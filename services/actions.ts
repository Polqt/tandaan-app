"use server";

import { adminDB } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  auth.protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unable to determine user ID");
  }

  const docCollection = adminDB.collection("documents");
  const docRef = await docCollection.add({
    title: "New Document",
    content: "",
  });

  await adminDB
    .collection("users")
    .doc(userId)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: userId,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  auth.protect();

  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unable to determine user ID");
    }

    const docRef = await adminDB.collection("documents").doc(roomId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Document does not exist");
    }

    const data = doc.data();

    await adminDB
      .collection("trash")
      .doc(roomId)
      .set({
        ...data,
        deleteAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId,
        roomId,
      });

    await docRef.delete();

    const query = await adminDB
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .where("userId", "==", (await auth()).userId)
      .get();

    const batch = adminDB.batch();

    query.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false };
  }
}

export async function restoreDocument(roomId: string) {
  auth.protect();

  try {
    const { userId } = await auth();

    const trashRef = adminDB.collection("trash").doc(roomId);
    const trashDoc = await trashRef.get();

    if (!trashDoc.exists) {
      throw new Error("Trash document does not exist");
    }

    const data = trashDoc.data();

    if (!data) {
      throw new Error("No data found in trash document");
    }

    await adminDB
      .collection("documents")
      .doc(roomId)
      .set({
        ...data,
        restoredAt: new Date(),
        restoredBy: userId,
      });

    await trashRef.delete();

    return { success: true };
  } catch (error) {
    console.error("Error restoring document: ", error);
    return { success: false };
  }
}

export async function getUserDocuments(userId: string) {
  try {
    const roomsRef = adminDB
      .collection("users")
      .doc(userId)
      .collection("rooms");
    const snapshot = await roomsRef.get();
    const documents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return [];
  }
}
