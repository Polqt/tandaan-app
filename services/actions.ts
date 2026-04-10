"use server";

import { adminDB } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import type { DocumentData } from "@/types/documents";

const TRASH_RETENTION_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function createNewDocument() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unable to determine user ID");
  }

  // Generate a doc ID upfront so both writes can go in one atomic batch
  const docRef = adminDB.collection("documents").doc();
  const roomRef = adminDB
    .collection("users")
    .doc(userId)
    .collection("rooms")
    .doc(docRef.id);

  const batch = adminDB.batch();

  batch.set(docRef, {
    title: "New Document",
    content: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  batch.set(roomRef, {
    userId,
    role: "owner",
    createdAt: new Date(),
    roomId: docRef.id,
  });

  await batch.commit();

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unable to determine user ID");
    }

    // Verify ownership
    const ownerRoomSnap = await adminDB
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .get();

    if (!ownerRoomSnap.exists || ownerRoomSnap.data()?.role !== "owner") {
      throw new Error("Only the document owner can delete this document");
    }

    const docRef = adminDB.collection("documents").doc(roomId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Document does not exist");
    }

    const data = doc.data() as DocumentData;

    // Fetch all user-room relationships before the batch
    const membershipsSnap = await adminDB
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    // Atomic: trash write + document delete + all membership deletes in one batch
    const batch = adminDB.batch();

    batch.set(adminDB.collection("trash").doc(roomId), {
      ...data,
      deleteAt: new Date(),
      expiresAt: new Date(Date.now() + TRASH_RETENTION_DAYS * MS_PER_DAY),
      userId,
      roomId,
    });

    batch.delete(docRef);

    membershipsSnap.forEach((memberDoc) => {
      batch.delete(memberDoc.ref);
    });

    await batch.commit();

    // Liveblocks cleanup is best-effort — room may already not exist
    await liveblocks.deleteRoom(roomId).catch((err) => {
      console.warn(`Could not delete Liveblocks room ${roomId}:`, err);
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false };
  }
}

export async function restoreDocument(roomId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unable to determine user ID");
    }

    const trashRef = adminDB.collection("trash").doc(roomId);
    const trashDoc = await trashRef.get();

    if (!trashDoc.exists) {
      throw new Error("Trash document does not exist");
    }

    const data = trashDoc.data() as DocumentData & { userId?: string };

    // Only the original owner can restore
    if (data.userId !== userId) {
      throw new Error("Only the original owner can restore this document");
    }

    const batch = adminDB.batch();

    // Restore document
    batch.set(adminDB.collection("documents").doc(roomId), {
      ...data,
      restoredAt: new Date(),
      restoredBy: userId,
    });

    // Re-create owner membership
    batch.set(
      adminDB.collection("users").doc(userId).collection("rooms").doc(roomId),
      {
        userId,
        role: "owner",
        createdAt: new Date(),
        roomId,
      },
    );

    // Remove from trash
    batch.delete(trashRef);

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error("Error restoring document:", error);
    return { success: false };
  }
}
