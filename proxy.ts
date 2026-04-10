import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/replay/(.*)",           // public replay viewer — no auth required
  "/blog(.*)",              // nextra blog
  "/docs(.*)",              // nextra docs
  "/pricing(.*)",           // pricing page
  "/api/clerk-webhook",     // Clerk webhook — verified by svix, not Clerk session
  "/api/billing/webhook",   // PayMongo webhook — verified by HMAC, not Clerk session
  "/monitoring(.*)",        // Sentry tunnel
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
