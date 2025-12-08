import { adminApp } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  auth.protect();

  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roomId } = await params;

    const usersInRoomRef = await db
      .collection("rooms")
      .where("roomId", "==", roomId)
      .get();

    const users = usersInRoomRef.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId,
      ...doc.data(),
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching room users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
