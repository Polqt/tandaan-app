import { adminDB } from "@/firebase-admin";
import { computeVersionSummary } from "@/lib/version-utils";

type PersistVersionSnapshotInput = {
  content: string;
  roomId: string;
  userId: string;
};

type PersistVersionSnapshotResult = {
  summary: ReturnType<typeof computeVersionSummary>;
  versionId: string;
};

export async function persistVersionSnapshot({
  content,
  roomId,
  userId,
}: PersistVersionSnapshotInput): Promise<PersistVersionSnapshotResult> {
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

  const workerUrl = process.env.CLOUDFLARE_AI_WORKER_URL;
  const workerSecret = process.env.CLOUDFLARE_AI_WORKER_SECRET;
  if (workerUrl) {
    fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(workerSecret ? { "X-Worker-Secret": workerSecret } : {}),
      },
      body: JSON.stringify({
        documentId: roomId,
        versionId: versionRef.id,
        content,
      }),
    })
      .then(async (res) => {
        if (!res.ok) return;
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
    summary,
    versionId: versionRef.id,
  };
}
