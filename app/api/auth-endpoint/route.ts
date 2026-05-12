import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase-admin";
import liveblocks from "@/lib/collaboration/liveblocks";
import { liveblocksAuthSchema, parseBody } from "@/lib/server/schemas";

// Maximum concurrent connections per room - configure in Liveblocks dashboard
const _MAX_CONNECTIONS_PER_ROOM = 500;

/**
 * Authorization level based on user role in the document
 */
type AccessLevel = "full" | "readonly" | "none";

/**
 * Determines access level based on user role in the document
 */
async function getAccessLevel(
  clerkUserId: string,
  roomId: string,
): Promise<AccessLevel> {
  const userRoomDoc = await adminDB
    .collection("users")
    .doc(clerkUserId)
    .collection("rooms")
    .doc(roomId)
    .get();

  if (!userRoomDoc.exists) {
    return "none";
  }

  const role = userRoomDoc.data()?.role;

  // Owners get full access, editors get readonly (can view but not manage)
  return role === "owner" ? "full" : "readonly";
}

export async function POST(req: NextRequest) {
  try {
    const { sessionClaims, userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 },
      );
    }

    const parsed = await parseBody(req, liveblocksAuthSchema);
    if (!parsed.success) return parsed.response;
    const { room } = parsed.data;

    // Note: Connection limiting handled by Liveblocks at the account level
    // The MAX_CONNECTIONS_PER_ROOM constant is for documentation purposes
    // In production, configure this in Liveblocks dashboard or use webhooks

    // Get user's access level based on their role in the document
    const accessLevel = await getAccessLevel(clerkUserId, room);

    if (accessLevel === "none") {
      return NextResponse.json(
        { message: "You don't have access to this room." },
        { status: 403 },
      );
    }

    // Build user info from session claims
    const userInfo = {
      name: ((sessionClaims?.fullName as string) || "Anonymous").slice(0, 80),
      avatar: sessionClaims?.image as string,
    };

    const session = liveblocks.prepareSession(clerkUserId, { userInfo });

    if (accessLevel === "full") {
      // Owners get full access to the room
      session.allow(room, session.FULL_ACCESS);
    } else {
      // Editors get read-only access
      session.allow(room, session.READ_ACCESS);
    }

    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } catch (error) {
    console.error("Error in auth-endpoint:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
