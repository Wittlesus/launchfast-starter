import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Production-ready rate limiting using Upstash Redis
 *
 * Fallback strategy:
 * - If UPSTASH_REDIS_REST_URL is not set, uses in-memory rate limiting (dev mode)
 * - Production deployments MUST set UPSTASH_REDIS_REST_URL for distributed rate limiting
 *
 * Free tier: 10,000 commands/day on Upstash
 */

// Initialize Redis client (only if credentials are provided)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * AI endpoint rate limiter - 10 requests per 60 seconds per user
 * Prevents abuse of expensive Anthropic API calls
 */
export const aiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
      prefix: "ratelimit:ai",
    })
  : null;

/**
 * Stripe checkout rate limiter - 5 requests per 60 seconds per user
 * Prevents spam creation of checkout sessions
 */
export const checkoutRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "ratelimit:checkout",
    })
  : null;

/**
 * Stripe portal rate limiter - 3 requests per 60 seconds per user
 * Prevents abuse of billing portal session creation
 */
export const portalRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "60 s"),
      analytics: true,
      prefix: "ratelimit:portal",
    })
  : null;

/**
 * Webhook rate limiter - 100 requests per 60 seconds per IP
 * Prevents webhook flooding attacks (Stripe verifies signatures separately)
 */
export const webhookRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      analytics: true,
      prefix: "ratelimit:webhook",
    })
  : null;

/**
 * Helper function to extract rate limit key from request
 * Priority: user ID > IP address > "unknown"
 */
export function getRateLimitKey(
  req: Request,
  userId?: string | null
): string {
  if (userId) return userId;

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

/**
 * In-memory fallback rate limiter (dev mode only)
 * WARNING: Does NOT work across multiple server instances
 */
const inMemoryMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;

export function inMemoryRateLimit(
  key: string,
  maxRequests: number
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const timestamps = inMemoryMap.get(key) ?? [];

  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  inMemoryMap.set(key, recent);

  if (recent.length >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: recent[0]! + RATE_LIMIT_WINDOW_MS,
    };
  }

  recent.push(now);
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - recent.length,
    reset: now + RATE_LIMIT_WINDOW_MS,
  };
}

// Clean up stale entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of inMemoryMap) {
      const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (recent.length === 0) {
        inMemoryMap.delete(key);
      } else {
        inMemoryMap.set(key, recent);
      }
    }
  }, 5 * 60_000);
}
