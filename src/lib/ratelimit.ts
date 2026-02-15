/**
 * In-memory rate limiting (development mode)
 *
 * For production with distributed rate limiting:
 * 1. Install: npm install @upstash/ratelimit @upstash/redis
 * 2. Uncomment and configure Upstash Redis client below
 * 3. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
 *
 * Free tier: 10,000 commands/day on Upstash
 */

// Placeholder - Upstash Redis rate limiters not configured
// To enable production rate limiting, install @upstash/ratelimit and @upstash/redis
export const aiRateLimiter = null;
export const checkoutRateLimiter = null;
export const portalRateLimiter = null;
export const webhookRateLimiter = null;

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
