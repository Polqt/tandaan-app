import { adminApp } from "@/firebase-admin";
import { requireAuth, apiErrorResponse } from "@/lib/api-utils";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return auth.error;
    }

    const { id } = await params;

    const roomRef = db
      .collection("users")
      .doc(auth.userId!)
      .collection("rooms")
      .doc(id);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return apiErrorResponse("Document not found", 404);
    }

    const roomData = roomSnap.data();

    const roomId = roomData?.roomId ?? id;
    const docSnap = await db.collection("documents").doc(roomId).get();

    if (!docSnap.exists) {
      return apiErrorResponse("Document not found", 404);
    }

    const documentData = docSnap.data();
    const documentId = docSnap.id;

    return NextResponse.json({
      id: documentId,
      ...roomData,
      document: {
        ...(documentData ?? {}),
        id: documentId,
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) {
      return auth.error;
    }

    const { id } = await params;
    const body = await request.json();

    const roomRef = db
      .collection("users")
      .doc(auth.userId!)
      .collection("rooms")
      .doc(id);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return apiErrorResponse("Document not found", 404);
    }

    const roomData = roomSnap.data();
    const docId = roomData?.roomId ?? id;

    await db
      .collection("documents")
      .doc(docId)
      .update({
        ...body,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating document:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
