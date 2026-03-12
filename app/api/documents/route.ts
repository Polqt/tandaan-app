import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminApp } from "@/firebase-admin";
import { apiErrorResponse, requireAuth } from "@/lib/api-utils";

const db = getFirestore(adminApp);

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const roomRef = db
      .collection("users")
      .doc(authResult.userId)
      .collection("rooms");
    const roomSnap = await roomRef.get();

    const roomEntries = roomSnap.docs.map((roomDoc) => {
      const roomData = roomDoc.data() as Record<string, unknown>;
      const roomId =
        typeof roomData.roomId === "string" && roomData.roomId.length > 0
          ? roomData.roomId
          : roomDoc.id;

      return {
        id: roomDoc.id,
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

    const documents = roomEntries.map(({ roomId }) => {
      const documentData = documentsById.get(roomId);
      const title =
        typeof documentData?.title === "string" &&
        documentData.title.trim().length > 0
          ? documentData.title
          : "Untitled Document";

      return {
        id: roomId,
        title,
      };
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
