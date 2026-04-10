import { adminApp } from "@/firebase-admin";
import { requireAuth, apiErrorResponse } from "@/lib/api-utils";
import { patchDocumentSchema, parseBody } from "@/lib/schemas";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;

    const roomRef = db
      .collection("users")
      .doc(authResult.userId)
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await requireAuth();
    if (!authResult.authorized) {
      return authResult.error;
    }

    const { id } = await params;
    const parsed = await parseBody(request, patchDocumentSchema);
    if (!parsed.success) return parsed.response;

    const roomRef = db
      .collection("users")
      .doc(authResult.userId)
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
      .update({ ...parsed.data, updatedAt: new Date() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating document:", error);
    return apiErrorResponse("Internal Server Error", 500);
  }
}
