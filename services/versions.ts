"use server";

import { adminDB } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function getDocumentVersion(roomId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const versionRef = adminDB
      .collection("documents")
      .doc(roomId)
      .collection("versions")
      .orderBy("timeStamp", "desc")
      .get();

    const versions = (await versionRef).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, versions };
  } catch (error) {
    console.error("Error getting document versions:", error);
    return { success: false };
  }
}

export async function saveDocumentVersion(roomId: string, content: any) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const versionRef = adminDB
      .collection("documents")
      .doc(roomId)
      .collection("versions")
      .doc();

    await versionRef.set({
      content,
      timeStamp: new Date(),
      userId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving document version:", error);
    return { success: false };
  }
}

export async function restoreDocumentVersion(
  roomId: string,
  versionId: string,
) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Authentication required" };
  }

  try {
    const versionRef = adminDB
      .collection("documents")
      .doc(roomId)
      .collection("versions")
      .doc(versionId)
      .get();

    if (!(await versionRef).exists) {
      throw new Error("Version not found");
    }

    return { success: true, content: (await versionRef).data()?.content };
  } catch (error) {
    console.error("Error restoring document version:", error);
    return { success: false };
  }
}
