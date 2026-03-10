"use server";

import { adminDB } from "@/firebase-admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { User } from "@/types/user";

export async function getAllUsers(): Promise<User[]> {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({ limit: 50 });

    return users.map((user) => ({
      id: user.id,
      fullName: user.fullName || user.firstName || "Anonymous",
      email: user.emailAddresses[0]?.emailAddress || "",
      image: user.imageUrl || "",
    }));
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
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
    return [];
  }

  try {
    const roomUsers = await adminDB
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const userIds = roomUsers.docs
      .map((doc) => doc.data().userId)
      .filter((value): value is string => typeof value === "string");

    return userIds;
  } catch (error) {
    console.error("Error getting room users:", error);
    return [];
  }
}
