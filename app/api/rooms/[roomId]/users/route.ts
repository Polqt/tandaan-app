import { auth, clerkClient } from "@clerk/nextjs/server";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminApp } from "@/firebase-admin";
import type { RoomUser } from "@/types/user";

const db = getFirestore(adminApp);

async function getRoomMemberships(roomId: string) {
  const userRefs = await db.collection("users").listDocuments();

  const membershipResults = await Promise.all(
    userRefs.map(async (userRef) => {
      const membership = await userRef.collection("rooms").doc(roomId).get();
      if (!membership.exists) {
        return null;
      }

      return {
        membership,
        userId: userRef.id,
      };
    }),
  );

  return membershipResults.filter(
    (
      result,
    ): result is {
      membership: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
      userId: string;
    } => result !== null,
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    const clerk = await clerkClient();

    const resolvedProfiles = await Promise.all(
      memberships.map(async ({ userId: memberUserId }) => {
        try {
          const user = await clerk.users.getUser(memberUserId);
          return [
            memberUserId,
            {
              email: user.emailAddresses[0]?.emailAddress || "",
              image: user.imageUrl || "",
              name: user.fullName || user.firstName || "Anonymous",
            },
          ] as const;
        } catch (error) {
          console.error(`Error resolving room user ${memberUserId}:`, error);
          return [
            memberUserId,
            {
              email: "",
              image: "",
              name: "Unknown user",
            },
          ] as const;
        }
      }),
    );

    const profilesByUserId = new Map(resolvedProfiles);

    const users = memberships.map<RoomUser>(
      ({ membership, userId: memberUserId }) => {
        const data = membership.data() ?? {};
        const profile = profilesByUserId.get(memberUserId);

        return {
          email: profile?.email || "",
          id: memberUserId,
          image: profile?.image || "",
          name: profile?.name || "Unknown user",
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
