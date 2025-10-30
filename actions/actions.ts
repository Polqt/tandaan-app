"use server";

import { adminDB } from "@/firebase-admin";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createNewDocument() {
  auth.protect();

  const { session } = auth();

  const docCollection = await adminDB.collection("documents");
  const docRef = await docCollection.add({
    title: "New Document",
    content: "",
  });

  await adminDB
    .collection("users")
    .doc(session?.email!)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: session?.email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}
