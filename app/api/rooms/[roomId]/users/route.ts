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

    const userSnapshot = await db.collection("users").get();

    const users: any[] = [];

    for (const userDoc of userSnapshot.docs) {
      const roomDoc = await db
        .collection("users")
        .doc(userDoc.id)
        .collection("rooms")
        .doc(roomId)
        .get();

      if (roomDoc.exists) {
        const data = roomDoc.data();
        users.push({
          id: roomDoc.id,
          userId: userDoc.id,
          roomId: data?.roomId || roomId,
          role: data?.role,
          createdAt: data?.createdAt,
        })
      }
    }
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching room users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
