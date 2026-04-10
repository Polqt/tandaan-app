import { z } from "zod";

// Documents
export const patchDocumentSchema = z.object({
  title: z.string().min(1).max(500).trim(),
});

export const createVersionSchema = z.object({
  content: z.string().min(1),
});

// Auth endpoint
export const liveblocksAuthSchema = z.object({
  room: z.string().min(1),
});

// Users / invite
export const inviteUserSchema = z.object({
  email: z.string().email(),
});

// Zod helper: parse request body and return typed result or a 400 response
import { NextResponse } from "next/server";

type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ParseResult<T>> {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }

  const result = schema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 400 },
      ),
    };
  }

  return { success: true, data: result.data };
}
