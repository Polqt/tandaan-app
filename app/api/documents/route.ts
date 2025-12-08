import { adminApp } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const roomRef = db.collection("users").doc(userId).collection("rooms");
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
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
