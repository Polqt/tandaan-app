"use server";

import { auth } from "@clerk/nextjs/server";

export async function addComment(
  roomId: string,
  content: string,
  selection?: { from: number; to: number },
  parentId?: string,
) {
  auth.protect();

  try {
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false };
  }
}

export async function getComments(roomId: string) {
  auth.protect();

  try {
  } catch (error) {
    console.error("Error getting comments:", error);
    return { success: false, comments: [] };
  }
}

export async function resolveComment(roomId: string, commentId: string) {
  auth.protect();

  try {
  } catch (error) {
    console.error("Error resolving comments: ", error);
    return { success: false };
  }
}

export async function deleteComment(roomId: string, commentId: string) {
  auth.protect();

  try {
  } catch (error) {
    console.error("Error deleting comments: ", error);
    return { success: false };
  }
}
