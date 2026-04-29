import { randomUUID } from "node:crypto";
import { adminDB } from "@/firebase-admin";
import { computeVersionSummary } from "@/lib/docs/version-utils";
import { recordAnalyticsEventServer } from "@/lib/telemetry/server-events";

type PersistVersionSnapshotInput = {
  content: string;
  queuedAt?: string | null;
  requestId?: string | null;
  roomId: string;
  userId: string;
};

type PersistVersionSnapshotResult = {
  queueLatencyMs: number | null;
  summary: ReturnType<typeof computeVersionSummary>;
  versionId: string;
};

const SNAPSHOT_LOCK_TTL_MS = 30_000;
const SNAPSHOT_LOCK_ATTEMPTS = 5;

function wait(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

async function acquireSnapshotLock(roomId: string, ownerKey: string) {
  const lockRef = adminDB.collection("snapshotLocks").doc(roomId);
  const startedAt = Date.now();

  for (let attempt = 0; attempt < SNAPSHOT_LOCK_ATTEMPTS; attempt += 1) {
    const acquired = await adminDB.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(lockRef);
      const now = Date.now();

      if (!snapshot.exists) {
        transaction.set(lockRef, {
          expiresAt: new Date(now + SNAPSHOT_LOCK_TTL_MS),
          lockedAt: new Date(now),
          ownerKey,
        });
        return true;
      }

      const data = snapshot.data() as
        | { expiresAt?: { toDate?: () => Date }; ownerKey?: string }
        | undefined;
      const expiresAt =
        typeof data?.expiresAt?.toDate === "function"
          ? data.expiresAt.toDate().getTime()
          : 0;

      if (data?.ownerKey === ownerKey || expiresAt <= now) {
        transaction.set(lockRef, {
          expiresAt: new Date(now + SNAPSHOT_LOCK_TTL_MS),
          lockedAt: new Date(now),
          ownerKey,
        });
        return true;
      }

      return false;
    });

    if (acquired) {
      return {
        lockRef,
        waitMs: Date.now() - startedAt,
      };
    }

    await recordAnalyticsEventServer({
      actorUserId: ownerKey.split(":")[0] ?? null,
      event: "snapshot_lock_contention",
      metadata: { attempt: attempt + 1 },
      roomId,
    });
    await wait(150 * (attempt + 1));
  }

  throw new Error(`Timed out acquiring snapshot lock for room ${roomId}`);
}

async function releaseSnapshotLock(roomId: string, ownerKey: string) {
  const lockRef = adminDB.collection("snapshotLocks").doc(roomId);
  await adminDB.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(lockRef);
    if (!snapshot.exists) {
      return;
    }

    const data = snapshot.data() as { ownerKey?: string } | undefined;
    if (data?.ownerKey === ownerKey) {
      transaction.delete(lockRef);
    }
  });
}

function resolveQueueLatencyMs(queuedAt?: string | null) {
  if (!queuedAt) {
    return null;
  }

  const queuedTime = Date.parse(queuedAt);
  if (Number.isNaN(queuedTime)) {
    return null;
  }

  return Math.max(0, Date.now() - queuedTime);
}

export async function persistVersionSnapshot({
  content,
  queuedAt = null,
  requestId = null,
  roomId,
  userId,
}: PersistVersionSnapshotInput): Promise<PersistVersionSnapshotResult> {
  const ownerKey = `${userId}:${requestId ?? randomUUID()}`;
  const lock = await acquireSnapshotLock(roomId, ownerKey);

  try {
    const versionsCollection = adminDB
      .collection("documents")
      .doc(roomId)
      .collection("versions");
    const latestVersionSnapshot = await versionsCollection
      .orderBy("timeStamp", "desc")
      .limit(1)
      .get();
    const previousContent = latestVersionSnapshot.empty
      ? null
      : (latestVersionSnapshot.docs[0].data().content as string | null);
    const summary = computeVersionSummary(content, previousContent);

    const versionRef = versionsCollection.doc();
    await versionRef.set({
      content,
      summary,
      timeStamp: new Date(),
      userId,
    });

    const queueLatencyMs = resolveQueueLatencyMs(queuedAt);
    await recordAnalyticsEventServer({
      actorUserId: userId,
      event: "snapshot_persisted",
      metadata: {
        lockWaitMs: lock.waitMs,
        queueLatencyMs,
        versionId: versionRef.id,
      },
      requestId,
      roomId,
    });

    const workerUrl = process.env.CLOUDFLARE_AI_WORKER_URL;
    const workerSecret = process.env.CLOUDFLARE_AI_WORKER_SECRET;
    if (workerUrl) {
      fetch(workerUrl, {
        body: JSON.stringify({
          content,
          documentId: roomId,
          versionId: versionRef.id,
        }),
        headers: {
          "Content-Type": "application/json",
          ...(workerSecret ? { "X-Worker-Secret": workerSecret } : {}),
        },
        method: "POST",
      })
        .then(async (res) => {
          if (!res.ok) {
            return;
          }
          const json = (await res.json()) as { summary?: string };
          if (json.summary) {
            await versionRef.update({ aiSummary: json.summary });
          }
        })
        .catch((err) => {
          console.warn("AI summary worker failed (non-blocking):", err);
        });
    }

    return {
      queueLatencyMs,
      summary,
      versionId: versionRef.id,
    };
  } finally {
    await releaseSnapshotLock(roomId, ownerKey);
  }
}
