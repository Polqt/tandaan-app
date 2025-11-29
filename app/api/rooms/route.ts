import { adminApp } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(adminApp);

export async function GET() {
    auth.protect();

    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const snap = await db.collection("users").doc(userId).collection("rooms").get();
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
                }
            })
        )
        return NextResponse.json({ rooms });
    } catch (error: any) {
        console.error("Error fetching rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}