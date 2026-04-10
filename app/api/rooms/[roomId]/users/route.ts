import { auth, clerkClient } from "@clerk/nextjs/server";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminApp } from "@/firebase-admin";
import type { RoomUser } from "@/types/user";

const db = getFirestore(adminApp);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    // Verify requester has access to this room
    const currentUserSnap = await db
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .get();

    if (!currentUserSnap.exists) {
      return NextResponse.json({ error: "Room not found or access denied" }, { status: 404 });
    }

    // Direct path query — O(members) reads, no collectionGroup scan
    const membershipsSnap = await db
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const memberEntries = membershipsSnap.docs.flatMap((doc) => {
      const parentUser = doc.ref.parent.parent;
      if (!parentUser) return [];
      return [{ data: doc.data(), userId: parentUser.id }];
    });

    const memberUserIds = Array.from(new Set(memberEntries.map((e) => e.userId)));

    const profileFallback = { email: "", image: "", name: "Unknown user" };
    const profilesByUserId = new Map(
      memberUserIds.map((id) => [id, profileFallback]),
    );

    if (memberUserIds.length > 0) {
      try {
        const clerk = await clerkClient();
        const { data: clerkUsers } = await clerk.users.getUserList({
          userId: memberUserIds,
          limit: memberUserIds.length,
        });

        for (const u of clerkUsers) {
          profilesByUserId.set(u.id, {
            email: u.emailAddresses[0]?.emailAddress ?? "",
            image: u.imageUrl ?? "",
            name: u.fullName || u.firstName || "Anonymous",
          });
        }
      } catch (error) {
        console.error("Error resolving room user profiles:", error);
        // Non-fatal — return members with fallback profiles
      }
    }

    const users = memberEntries.map<RoomUser>(({ data, userId: memberId }) => {
      const profile = profilesByUserId.get(memberId) ?? profileFallback;
      return {
        email: profile.email,
        id: memberId,
        image: profile.image,
        name: profile.name,
        role: data.role === "owner" ? "owner" : "editor",
        roomId: typeof data.roomId === "string" ? data.roomId : roomId,
        userId: typeof data.userId === "string" ? data.userId : memberId,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching room users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
