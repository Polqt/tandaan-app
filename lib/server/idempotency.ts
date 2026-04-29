import { adminDB } from "@/firebase-admin";

type IdempotencyParams = {
  key: string;
  scope: string;
  ttlSeconds?: number;
};

type StoredReplay = {
  body: unknown;
  status: number;
};

type ReservationResult =
  | { reserved: true }
  | { replay?: StoredReplay; reserved: false };

function getRef(scope: string, key: string) {
  const docId = `${scope}:${key}`;
  return adminDB.collection("idempotency").doc(docId);
}

function readReplay(snapshotData: Record<string, unknown> | undefined) {
  if (!snapshotData) {
    return null;
  }

  const body = snapshotData.responseBody;
  const status =
    typeof snapshotData.responseStatus === "number"
      ? snapshotData.responseStatus
      : null;

  if (body === undefined || status === null) {
    return null;
  }

  return { body, status } satisfies StoredReplay;
}

export async function reserveIdempotencyKey({
  key,
  scope,
  ttlSeconds = 60 * 10,
}: IdempotencyParams): Promise<ReservationResult> {
  const ref = getRef(scope, key);
  const now = Date.now();
  const txResult = await adminDB.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    if (snapshot.exists) {
      return {
        existing: snapshot.data() as Record<string, unknown> | undefined,
      };
    }

    tx.set(ref, {
      createdAt: new Date(now),
      expiresAt: new Date(now + ttlSeconds * 1000),
      key,
      responseBody: null,
      responseStatus: null,
      scope,
      status: "in_progress",
    });
    return { existing: undefined };
  });

  if (!txResult.existing) {
    return { reserved: true };
  }

  const replay = readReplay(txResult.existing);
  return replay ? { replay, reserved: false } : { reserved: false };
}

type StoreParams = {
  body: unknown;
  key: string;
  scope: string;
  status?: number;
};

export async function storeIdempotencyResponse({
  key,
  scope,
  body,
  status = 200,
}: StoreParams) {
  const ref = getRef(scope, key);
  await ref.set(
    {
      completedAt: new Date(),
      responseBody: body,
      responseStatus: status,
      status: "completed",
    },
    { merge: true },
  );
}
