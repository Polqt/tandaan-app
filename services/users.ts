"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { adminDB } from "@/firebase-admin";
import { buildRoomListDocument } from "@/lib/docs/document-list";
import {
  recordAnalyticsEventServer,
  recordAuditEventServer,
} from "@/lib/telemetry/server-events";
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
    return {
      success: false,
      error: "Only the document owner can invite users",
    };
  }

  try {
    const client = await clerkClient();
    const invited = await client.users.getUserList({ emailAddress: [email] });

    // User already exists in Clerk — add them directly
    if (invited.data.length > 0) {
      const userIdToInvite = invited.data[0].id;

      const existingSnap = await adminDB
        .collection("users")
        .doc(userIdToInvite)
        .collection("rooms")
        .doc(roomId)
        .get();

      if (existingSnap.exists) {
        return {
          success: false,
          error: "User is already a member of this document",
        };
      }

      const documentSnap = await adminDB
        .collection("documents")
        .doc(roomId)
        .get();

      await adminDB
        .collection("users")
        .doc(userIdToInvite)
        .collection("rooms")
        .doc(roomId)
        .set({
          document: buildRoomListDocument(
            roomId,
            documentSnap.exists
              ? (documentSnap.data() as Record<string, unknown>)
              : null,
          ),
          userId: userIdToInvite,
          role: "editor",
          createdAt: new Date(),
          roomId,
        });

      await Promise.all([
        recordAnalyticsEventServer({
          actorUserId: ownerId,
          event: "document_user_invited",
          metadata: { inviteMode: "direct", invitedUserId: userIdToInvite },
          roomId,
        }),
        recordAuditEventServer({
          action: "document.user_invited",
          actorUserId: ownerId,
          metadata: { inviteMode: "direct", invitedUserId: userIdToInvite },
          roomId,
          targetId: userIdToInvite,
          targetType: "user",
        }),
      ]);

      return { success: true };
    }

    // User not in Clerk yet — store a pending invite and send a Clerk invitation
    const pendingRef = adminDB
      .collection("pendingInvites")
      .doc(`${roomId}_${email.replace(/[.@]/g, "_")}`);

    const existing = await pendingRef.get();
    if (existing.exists) {
      return {
        success: false,
        error: "An invite has already been sent to this email",
      };
    }

    await pendingRef.set({
      roomId,
      email,
      invitedBy: ownerId,
      createdAt: new Date(),
    });

    // Send a Clerk invitation so the user gets an email to sign up
    await client.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/sign-up`,
    });

    await Promise.all([
      recordAnalyticsEventServer({
        actorUserId: ownerId,
        event: "document_user_invited",
        metadata: { email, inviteMode: "pending" },
        roomId,
      }),
      recordAuditEventServer({
        action: "document.user_invited",
        actorUserId: ownerId,
        metadata: { email, inviteMode: "pending" },
        roomId,
        targetId: email,
        targetType: "email",
      }),
    ]);

    return { success: true, pending: true };
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

  const isOwner =
    ownerRoomSnap.exists && ownerRoomSnap.data()?.role === "owner";
  const isSelf = currentUserId === userId;

  if (!isOwner && !isSelf) {
    return {
      success: false,
      error: "Insufficient permissions to remove this user",
    };
  }

  try {
    await adminDB
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .delete();

    await Promise.all([
      recordAnalyticsEventServer({
        actorUserId: currentUserId,
        event: "document_user_removed",
        metadata: { removedUserId: userId },
        roomId,
      }),
      recordAuditEventServer({
        action: "document.user_removed",
        actorUserId: currentUserId,
        metadata: { removedUserId: userId },
        roomId,
        targetId: userId,
        targetType: "user",
      }),
    ]);

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
