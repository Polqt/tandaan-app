import { NextResponse } from "next/server";
import { z } from "zod";

// Documents
export const patchDocumentSchema = z
  .object({
    title: z.string().min(1).max(500).trim().optional(),
    content: z.string().min(1).optional(),
    idempotencyKey: z.string().min(8).max(128).optional(),
  })
  .refine((d) => d.title !== undefined || d.content !== undefined, {
    message: "At least one of title or content is required",
  });

export const createVersionSchema = z.object({
  content: z.string().min(1),
  idempotencyKey: z.string().min(8).max(128).optional(),
});

// Auth endpoint
export const liveblocksAuthSchema = z.object({
  room: z.string().min(1),
});

// Users / invite
export const inviteUserSchema = z.object({
  email: z.string().email(),
});

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
        {
          error: "Validation failed",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      ),
    };
  }

  return { success: true, data: result.data };
}
