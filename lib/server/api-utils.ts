import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { setSentryRequestContext } from "@/lib/telemetry/observability";
import { recordAnalyticsEventServer } from "@/lib/telemetry/server-events";
import { withRequestHeaders } from "./response";

type AuthorizedAuth = {
  authorized: true;
  userId: string;
};

type UnauthorizedAuth = {
  authorized: false;
  error: NextResponse<{ error: string }>;
};

export type AuthResult = AuthorizedAuth | UnauthorizedAuth;

export async function requireAuth(options?: {
  requestId?: string | null;
  route?: string;
}): Promise<AuthResult> {
  const { userId } = await auth();
  const route = options?.route ?? "unknown";

  if (!userId) {
    setSentryRequestContext({
      requestId: options?.requestId,
      route,
      tags: { authorized: false },
    });
    await recordAnalyticsEventServer({
      event: "auth_unauthorized",
      metadata: { route },
      requestId: options?.requestId,
    });

    return {
      authorized: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  setSentryRequestContext({
    requestId: options?.requestId,
    route,
    tags: { authorized: true },
    userId,
  });

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

export function apiErrorResponseWithRequestId(
  message: string,
  requestId: string,
  status: number = 500,
) {
  return withRequestHeaders(apiErrorResponse(message, status), requestId);
}

export function apiSuccessResponseWithRequestId<T>(data: T, requestId: string) {
  return withRequestHeaders(apiSuccessResponse(data), requestId);
}
