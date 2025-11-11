import { adminDB } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    auth.protect();

    const { sessionClaims, userId: clerkUserId } = await auth();
    const { room } = await req.json();

    const email = sessionClaims?.email as string;

    if (!email) {
      return NextResponse.json(
        { message: "Unable to determine user ID." },
        { status: 400 },
      );
    }

    const userId = sessionClaims?.email || clerkUserId;

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 },
      );
    }

    if (!room) {
      return NextResponse.json(
        { message: "Room ID is required." },
        { status: 400 },
      );
    }

    const userIdString = userId as string;

    const session = liveblocks.prepareSession(userIdString, {
      userInfo: {
        name: (sessionClaims?.fullName as string) || "Anonymous",
        email: (sessionClaims?.email as string) || userIdString,
        avatar: sessionClaims?.image as string,
      },
    });

    const userDocumentRef = adminDB
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(room);

    const userDocument = await userDocumentRef.get();

    if (userDocument) {
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
    console.error("Error inviting user:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
