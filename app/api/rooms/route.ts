import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminApp } from "@/firebase-admin";
import { toIsoTimestampOrNull } from "@/lib/dates/timestamp";
import { buildRoomListDocument } from "@/lib/docs/document-list";
import { apiErrorResponse, requireAuth } from "@/lib/server/api-utils";

const db = getFirestore(adminApp);

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

    const missingMetadataEntries = roomEntries.filter(
      ({ roomId, room }) =>
        !room.document ||
        typeof room.document !== "object" ||
        buildRoomListDocument(roomId, room.document as Record<string, unknown>)
          .updatedAt === null,
    );
    const documentIds = Array.from(
      new Set(missingMetadataEntries.map((entry) => entry.roomId)),
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
      document:
        room.document && typeof room.document === "object"
          ? buildRoomListDocument(
              roomId,
              room.document as Record<string, unknown>,
            )
          : buildRoomListDocument(roomId, documentsById.get(roomId)),
    }));

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
