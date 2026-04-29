import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;

function getLimiter() {
  if (limiter) return limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
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
  if (!rateLimiter) {
    return { reset: 0, success: true };
  }

  return rateLimiter.limit(identifier);
}
