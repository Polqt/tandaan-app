"use server";

import { adminDB } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function inviteUser(roomId: string, email: string) {
  auth.protect();

  try {
    await adminDB
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
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
