import { adminApp } from "@/firebase-admin";
import { requireAuth, apiErrorResponse } from "@/lib/api-utils";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

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

    const documents = await Promise.all(
      roomSnap.docs.map(async (doc) => {
        const roomId = doc.id;
        const docSnap = await db.collection("documents").doc(roomId).get();
        const data = docSnap.data();

        return {
          id: roomId,
          title: data?.title ?? "Untitled Document",
        };
      }),
    );

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
