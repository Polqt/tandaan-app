import { auth, clerkClient } from "@clerk/nextjs/server";
import { FieldPath, getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminApp } from "@/firebase-admin";
import type { RoomUser } from "@/types/user";

const db = getFirestore(adminApp);

type MembershipEntry = {
  membership: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>;
  userId: string;
};

async function getRoomMemberships(roomId: string): Promise<MembershipEntry[]> {
  const memberships = await db
    .collectionGroup("rooms")
    .where(FieldPath.documentId(), "==", roomId)
    .get();

  return memberships.docs.flatMap((membership) => {
    const userDoc = membership.ref.parent.parent;
    if (!userDoc) {
      return [];
    }

    return [{ membership, userId: userDoc.id }];
  });
}

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

    const currentUserMembership = await db
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .get();

    if (!currentUserMembership.exists) {
      return NextResponse.json(
        { error: "Room not found or access denied" },
        { status: 404 },
      );
    }

    const memberships = await getRoomMemberships(roomId);
    const memberUserIds = Array.from(
      new Set(memberships.map(({ userId: memberUserId }) => memberUserId)),
    );

    const profileFallback = {
      email: "",
      image: "",
      name: "Unknown user",
    };

    const profilesByUserId = new Map(
      memberUserIds.map((memberUserId) => [memberUserId, profileFallback]),
    );

    if (memberUserIds.length > 0) {
      try {
        const clerk = await clerkClient();
        const users = await clerk.users.getUserList({
          limit: memberUserIds.length,
          userId: memberUserIds,
        });

        for (const user of users.data) {
          profilesByUserId.set(user.id, {
            email: user.emailAddresses[0]?.emailAddress || "",
            image: user.imageUrl || "",
            name: user.fullName || user.firstName || "Anonymous",
          });
        }
      } catch (error) {
        console.error("Error resolving room users:", error);
      }
    }

    const users = memberships.map<RoomUser>(
      ({ membership, userId: memberUserId }) => {
        const data = membership.data() ?? {};
        const profile = profilesByUserId.get(memberUserId) ?? profileFallback;

        return {
          email: profile.email,
          id: memberUserId,
          image: profile.image,
          name: profile.name,
          roomId: typeof data.roomId === "string" ? data.roomId : roomId,
          role: data.role === "owner" ? "owner" : "editor",
          userId: typeof data.userId === "string" ? data.userId : memberUserId,
        };
      },
    );

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching room users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
