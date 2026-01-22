import { adminApp } from "@/firebase-admin";
import { requireAuth, apiErrorResponse } from "@/lib/api-utils";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET() {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return auth.error;
    }

    const snap = await db
      .collection("users")
      .doc(auth.userId!)
      .collection("rooms")
      .get();

    // Fetch associated documents for each room
    const rooms = await Promise.all(
      snap.docs.map(async (roomDoc) => {
        const room = roomDoc.data() as any;
        const docId = room.roomId ?? roomDoc.id;
        const docSnap = await db.collection("documents").doc(docId).get();
        const document = docSnap.exists ? docSnap.data() : null;
        return {
          id: roomDoc.id,
          roomId: docId,
          ...room,
          document,
        };
      }),
    );
    return NextResponse.json({ rooms });
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
