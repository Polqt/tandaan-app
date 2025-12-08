"use server";

import { adminDB } from "@/firebase-admin";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getAllUsers() {
  const { userId } = await auth();
  if (!userId) {
    return { users: [] };
  }

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ limit: 50 });

    return users.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      name: user.fullName || user.firstName || "Anonymous",
    }));
  } catch (error) {
    console.error("Error getting users:", error);
    return { users: [] };
  }
}

export async function inviteUser(roomId: string, email: string) {
  const { userId: ownerId } = await auth();

  if (!ownerId) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const invited = await (await clerkClient()).users.getUserList({
      emailAddress: [email],
    });

    if (invited.data.length === 0) {
      return { success: false, error: "User with the provided email does not exist" };
    }

    const userIdToInvite = invited.data[0].id;

    await adminDB
      .collection("users")
      .doc(userIdToInvite)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: userIdToInvite,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.error("Error inviting user:", error);
    return { success: false };
  }
}

export async function removeUser(roomId: string, userId: string) {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    return { success: false, error: "Authentication required" };
  }

  try {
    await adminDB
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.error("Error removing user:", error);
    return { success: false };
  }
}

export async function getRoomUsers(roomId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { users: [] };
  }

  try {
    const roomUsers = await adminDB
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const emails = roomUsers.docs.map((doc) => doc.data().userId);

    return { success: true, emails };
  } catch (error) {
    console.error("Error getting room users:", error);
    return { users: [] };
  }
}
