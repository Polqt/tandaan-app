"use server";

import { adminDB } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  auth.protect();

  const { sessionClaims } = await auth();
  const email = sessionClaims?.email as string;

  if (!email) {
    throw new Error("Unable to determine user ID");
  }

  const docCollection = adminDB.collection("documents");
  const docRef = await docCollection.add({
    title: "New Document",
    content: "",
  });

  await adminDB
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  auth.protect();

  try {
    await adminDB.collection("documents").doc(roomId).delete();

    const query = await adminDB
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
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
