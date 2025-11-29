"use server";

import { auth } from "@clerk/nextjs/server";

export async function createDocumentFromTemplate(templateId: string) {
  auth.protect();

  try {
  } catch (error) {
    console.error("Error creating document from template:", error);
    return { success: false };
  }
}

export async function getTempalates() {
  auth.protect();

  try {
  } catch (error) {
    console.error("Error creating document from template:", error);
    return { success: false };
  }
}

export async function saveAsTemplate(
  roomId: string,
  name: string,
  description: string,
  category: string,
) {
  auth.protect();

  try {
  } catch (error) {
    console.error("Error saving document as template:", error);
    return { success: false };
  }
}
