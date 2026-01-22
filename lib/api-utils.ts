import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      authorized: false,
      userId: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    authorized: true,
    userId,
    error: null,
  };
}

export function apiErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccessResponse(data: any) {
  return NextResponse.json(data);
}
