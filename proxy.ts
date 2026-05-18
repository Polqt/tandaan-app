import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

let edgeSaveLimiter: Ratelimit | null | undefined;

const isProtectedRoute = createRouteMatcher([
  "/api/auth-endpoint(.*)",
  "/api/billing/cancel(.*)",
  "/api/billing/checkout(.*)",
  "/api/documents(.*)",
  "/api/rooms(.*)",
  "/api/users(.*)",
]);

function getEdgeSaveLimiter() {
  if (edgeSaveLimiter !== undefined) {
    return edgeSaveLimiter;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    edgeSaveLimiter = null;
    return edgeSaveLimiter;
  }

  edgeSaveLimiter = new Ratelimit({
    analytics: true,
    limiter: Ratelimit.slidingWindow(180, "1 m"),
    redis: new Redis({ token, url }),
  });

  return edgeSaveLimiter;
}

function isDocumentSavePatch(request: Request) {
  return (
    request.method === "PATCH" &&
    /^\/api\/documents\/[^/]+$/.test(new URL(request.url).pathname)
  );
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const requestId = crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  if (isDocumentSavePatch(request)) {
    const limiter = getEdgeSaveLimiter();
    if (limiter) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const result = await limiter.limit(
        `edge:document-save:${ip}:${request.nextUrl.pathname}`,
      );

      if (!result.success) {
        const response = NextResponse.json(
          { error: "Too many save requests. Please try again." },
          { status: 429 },
        );
        response.headers.set("x-request-id", requestId);
        return response;
      }
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set("x-request-id", requestId);
  return response;
});

export const config = {
  matcher: [
    "/(api|trpc)(.*)",
  ],
};
