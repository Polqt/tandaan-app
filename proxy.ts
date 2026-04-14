import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

let edgeSaveLimiter: Ratelimit | null | undefined;

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

const isPublicRoute = createRouteMatcher([
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/replay/(.*)",           // public replay viewer + embed — no auth required
  "/blog(.*)",              // nextra blog
  "/docs(.*)",              // nextra docs
  "/pricing(.*)",           // pricing page
  "/api/clerk-webhook",     // Clerk webhook — verified by svix, not Clerk session
  "/api/billing/webhook",   // PayMongo webhook — verified by HMAC, not Clerk session
  "/monitoring(.*)",        // Sentry tunnel
]);

export default clerkMiddleware(async (auth, request) => {
  const requestId = crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

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

  if (!isPublicRoute(request)) {
    await auth.protect();
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
    // Skip Next.js internals and static files
    "/((?!_next|favicon.ico|icon\\?.*|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
