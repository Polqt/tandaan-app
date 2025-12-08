import { adminApp } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { getFirestore } from "firebase-admin/firestore";
import { documentId } from "firebase/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  auth.protect();

  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const roomRef = db
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(id);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const roomData = roomSnap.data();

    const roomId = roomData?.roomId ?? id;
    const docSnap = await db.collection("documents").doc(roomId).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        {
          error: "Document not found.",
        },
        { status: 404 },
      );
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  auth.protect();

  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const roomRef = db
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(id);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 },
      );
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
