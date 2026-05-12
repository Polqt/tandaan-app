import { NextResponse } from "next/server";
import { z } from "zod";

// ============================================================================
// Input Sanitization Utilities
// ============================================================================

/**
 * Sanitizes user input to prevent XSS and other injection attacks
 * - Strips HTML tags
 * - Normalizes Unicode to prevent homoglyph attacks
 * - Trims and limits length
 */
export function sanitizeInput(input: string): string {
  let result = input
    // Remove null bytes
    .replace(/\0/g, "")
    // Strip HTML/XML tags to prevent XSS
    .replace(/<[^>]*>/g, "")
    // Normalize Unicode characters (homoglyph attack prevention)
    .normalize("NFKC")
    // Trim whitespace
    .trim();

  // Remove control characters (0x00-0x1F and 0x7F) using code point check
  // biome-disable-next-line perf/no-assigning-array-elements
  result = Array.from(result)
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0;
      return !(code <= 0x1f || code === 0x7f);
    })
    .join("");

  return result;
}

/**
 * Validates and sanitizes document title
 */
export function sanitizeTitle(title: string): string {
  const sanitized = sanitizeInput(title);
  // Ensure max byte length to prevent UTF-8 bombs
  const byteLength = new TextEncoder().encode(sanitized).length;
  if (byteLength > 500) {
    // Truncate to 500 bytes
    return new TextDecoder("utf-8", { fatal: false })
      .decode(new TextEncoder().encode(sanitized).slice(0, 500))
      .replace(/\uFFFD/g, ""); // Remove replacement characters
  }
  return sanitized;
}

// ============================================================================
// Zod Schemas
// ============================================================================

// Pre-process title with sanitization
const sanitizedTitleSchema = z
  .string()
  .min(1, "Title cannot be empty")
  .max(500, "Title cannot exceed 500 characters")
  .transform(sanitizeTitle);

// Documents
export const patchDocumentSchema = z
  .object({
    title: sanitizedTitleSchema.optional(),
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
export const inviteUserSchema = z
  .object({
    email: z.string().email(),
  })
  .transform((data) => ({
    ...data,
    email: data.email.toLowerCase().trim(),
  }));

// ============================================================================
// Request Parsing
// ============================================================================

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
