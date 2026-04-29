import { adminDB } from "@/firebase-admin";
import { toIsoTimestampOrNull } from "@/lib/dates/timestamp";

type DocumentListSource =
  | {
      replayShareId?: unknown;
      title?: unknown;
      updatedAt?: unknown;
    }
  | null
  | undefined;

export function buildRoomListDocument(id: string, source: DocumentListSource) {
  if (!source) {
    return {
      id,
      replayShareId: null,
      title: "Untitled Document",
      updatedAt: null,
    };
  }

  return {
    id,
    replayShareId:
      typeof source.replayShareId === "string" ? source.replayShareId : null,
    title:
      typeof source.title === "string" && source.title.trim().length > 0
        ? source.title
        : "Untitled Document",
    updatedAt: toIsoTimestampOrNull(source.updatedAt),
  };
}

export async function syncRoomDocumentMetadata(
  roomId: string,
  source: DocumentListSource,
) {
  const memberships = await adminDB
    .collectionGroup("rooms")
    .where("roomId", "==", roomId)
    .get();

  if (memberships.empty) {
    return;
  }

  const document = buildRoomListDocument(roomId, source);
  const batch = adminDB.batch();

  memberships.docs.forEach((membership) => {
    batch.update(membership.ref, { document });
  });

  await batch.commit();
}
