import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type AuthorizedAuth = {
  authorized: true;
  userId: string;
};

type UnauthorizedAuth = {
  authorized: false;
  error: NextResponse<{ error: string }>;
};

export type AuthResult = AuthorizedAuth | UnauthorizedAuth;

export async function requireAuth(): Promise<AuthResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      authorized: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    authorized: true,
    userId,
  };
}

export function apiErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccessResponse<T>(data: T) {
  return NextResponse.json(data);
}
