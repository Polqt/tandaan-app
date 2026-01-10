import { adminApp } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roomId } = await params;

    const currentUserRoom = await db
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .get();

    if (!currentUserRoom.exists) {
      return NextResponse.json(
        { error: "Room not found or access denied" },
        { status: 404 },
      );
    }

    const roomUsersSnapshot = await db
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const users = roomUsersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: doc.ref.parent.parent?.id || "",
        roomId: data.roomId || roomId,
        role: data.role,
        createdAt: data.createdAt,
      }
    })
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching room users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
