import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminApp } from "@/firebase-admin";
import { apiErrorResponse, requireAuth } from "@/lib/api-utils";
import { toIsoTimestampOrNull } from "@/lib/timestamp-utils";

const db = getFirestore(adminApp);

function toRoomDocument(
  id: string,
  source: Record<string, unknown> | undefined,
) {
  if (!source) {
    return null;
  }

  const title =
    typeof source.title === "string" && source.title.trim().length > 0
      ? source.title
      : "Untitled Document";

  return {
    id,
    replayShareId:
      typeof source.replayShareId === "string" ? source.replayShareId : null,
    title,
    updatedAt: toIsoTimestampOrNull(source.updatedAt),
  };
}

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const snap = await db
      .collection("users")
      .doc(authResult.userId)
      .collection("rooms")
      .get();

    const roomEntries = snap.docs.map((roomDoc) => {
      const room = roomDoc.data() as Record<string, unknown>;
      const roomId =
        typeof room.roomId === "string" && room.roomId.length > 0
          ? room.roomId
          : roomDoc.id;

      return {
        id: roomDoc.id,
        room,
        roomId,
      };
    });

    const documentIds = Array.from(
      new Set(roomEntries.map((entry) => entry.roomId)),
    );
    const documentRefs = documentIds.map((documentId) =>
      db.collection("documents").doc(documentId),
    );
    const documentSnapshots =
      documentRefs.length > 0 ? await db.getAll(...documentRefs) : [];
    const documentsById = new Map(
      documentSnapshots
        .filter((documentSnapshot) => documentSnapshot.exists)
        .map((documentSnapshot) => [
          documentSnapshot.id,
          documentSnapshot.data() as Record<string, unknown>,
        ]),
    );

    const rooms = roomEntries.map(({ id, room, roomId }) => ({
      id,
      ...room,
      createdAt: toIsoTimestampOrNull(room.createdAt),
      roomId,
      document: toRoomDocument(roomId, documentsById.get(roomId)),
    }));

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
