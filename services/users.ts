"use server";

import { adminDB } from "@/firebase-admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { User } from "@/types/user";

// Search users by name or email — uses Clerk's server-side search so we never
// pull the entire user list onto the server. Pass an empty string to get the
// first 20 results (useful for initial invite modal suggestions).
export async function searchUsers(query: string): Promise<User[]> {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  try {
    const client = await clerkClient();
    const { data: users } = await client.users.getUserList({
      query: query.trim() || undefined,
      limit: 20,
    });

    return users
      .filter((u) => u.id !== userId) // exclude self from results
      .map((user) => ({
        id: user.id,
        fullName: user.fullName || user.firstName || "Anonymous",
        email: user.emailAddresses[0]?.emailAddress || "",
        image: user.imageUrl || "",
      }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}

export async function inviteUser(roomId: string, email: string) {
  const { userId: ownerId } = await auth();

  if (!ownerId) {
    return { success: false, error: "Authentication required" };
  }

  // Verify requester owns the room
  const ownerRoomSnap = await adminDB
    .collection("users")
    .doc(ownerId)
    .collection("rooms")
    .doc(roomId)
    .get();

  if (!ownerRoomSnap.exists || ownerRoomSnap.data()?.role !== "owner") {
    return { success: false, error: "Only the document owner can invite users" };
  }

  try {
    const invited = await (await clerkClient()).users.getUserList({
      emailAddress: [email],
    });

    if (invited.data.length === 0) {
      return { success: false, error: "User with the provided email does not exist" };
    }

    const userIdToInvite = invited.data[0].id;

    // Don't re-invite if already a member
    const existingSnap = await adminDB
      .collection("users")
      .doc(userIdToInvite)
      .collection("rooms")
      .doc(roomId)
      .get();

    if (existingSnap.exists) {
      return { success: false, error: "User is already a member of this document" };
    }

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
    return { success: false, error: "Failed to invite user" };
  }
}

export async function removeUser(roomId: string, userId: string) {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    return { success: false, error: "Authentication required" };
  }

  // Only the owner (or the user themselves) can remove a member
  const ownerRoomSnap = await adminDB
    .collection("users")
    .doc(currentUserId)
    .collection("rooms")
    .doc(roomId)
    .get();

  const isOwner = ownerRoomSnap.exists && ownerRoomSnap.data()?.role === "owner";
  const isSelf = currentUserId === userId;

  if (!isOwner && !isSelf) {
    return { success: false, error: "Insufficient permissions to remove this user" };
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
    return { success: false, error: "Failed to remove user" };
  }
}

export async function getRoomUsers(roomId: string): Promise<string[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  try {
    // Use collectionGroup — acceptable for moderate scale; add a Firestore index on roomId
    const roomUsers = await adminDB
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    return roomUsers.docs
      .map((doc) => doc.data().userId)
      .filter((value): value is string => typeof value === "string");
  } catch (error) {
    console.error("Error getting room users:", error);
    return [];
  }
}
