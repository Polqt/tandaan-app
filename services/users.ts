"use server";

import { adminDB } from "@/firebase-admin";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getAllUsers() {
  auth.protect();

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
  auth.protect();

  try {
    const { userId: ownerId } = await auth();

    if (!ownerId) {
      throw new Error("Unable to determine user ID");
    }

    const invited = await (await clerkClient()).users.getUserList({
      emailAddress: [email],
    });

    if (invited.data.length === 0) {
      throw new Error("User with the provided email does not exist");
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

export async function removeUser(roomId: string, email: string) {
  auth.protect();

  try {
    await adminDB
      .collection("users")
      .doc(email)
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
  auth.protect();

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
