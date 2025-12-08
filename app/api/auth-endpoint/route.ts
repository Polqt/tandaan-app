import { adminDB } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sessionClaims, userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 },
      );
    }

    const { room } = await req.json();

    if (!room) {
      return NextResponse.json(
        { message: "Room ID is required." },
        { status: 400 },
      );
    }

    const session = liveblocks.prepareSession(clerkUserId, {
      userInfo: {
        name: (sessionClaims?.fullName as string) || "Anonymous",
        email: (sessionClaims?.email as string) || clerkUserId,
        avatar: sessionClaims?.image as string,
      },
    });

    const userDocumentRef = adminDB
      .collection("users")
      .doc(clerkUserId)
      .collection("rooms")
      .doc(room);

    const userDocument = await userDocumentRef.get();

    if (userDocument.exists) {
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();

      return new Response(body, { status });
    } else {
      return NextResponse.json(
        { message: "You don't have access to this room." },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error("Error in auth-endpoint:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
