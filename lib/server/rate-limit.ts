import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;

function getLimiter() {
  if (limiter) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Log warning in production to catch misconfiguration
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[RATE-LIMIT] Redis credentials not configured. Rate limiting is DISABLED in production!",
      );
    }
    return null;
  }

  limiter = new Ratelimit({
    analytics: true,
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    redis: new Redis({
      token,
      url,
    }),
  });

  return limiter;
}

export async function checkSaveRateLimit(identifier: string) {
  const rateLimiter = getLimiter();

  // Fail-closed in production: if limiter is unavailable, deny the request
  // This prevents abuse when Redis is misconfigured
  if (!rateLimiter) {
    if (process.env.NODE_ENV === "production") {
      return { reset: Date.now() + 60000, success: false };
    }
    // Allow in development/testing when Redis isn't configured
    return { reset: 0, success: true };
  }

  return rateLimiter.limit(identifier);
}
