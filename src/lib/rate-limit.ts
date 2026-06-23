/**
 * ============================================================================
 * Rate Limiting
 * ============================================================================
 *
 * In-memory rate limiter for development + production (single-instance).
 * For multi-instance production (Vercel), upgrade to Upstash Redis later.
 *
 * USAGE:
 *   import { rateLimit } from '@/lib/rate-limit';
 *   const result = rateLimit(identifier, { window: 60, max: 5 });
 *   if (!result.allowed) return 429;
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  window: number; // seconds
  max: number; // max requests in window
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate-limited.
 *
 * @param identifier - Unique key (IP address, user ID, etc.)
 * @param options - { window: seconds, max: requests }
 * @returns { allowed, remaining, resetTime }
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}:${options.window}`;

  const entry = store.get(key);

  if (!entry || entry.resetTime < now) {
    // First request or window expired
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + options.window * 1000,
    };
    store.set(key, newEntry);
    return {
      allowed: true,
      remaining: options.max - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count >= options.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: options.max - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from request headers.
 * Vercel sets x-forwarded-for, x-real-ip, etc.
 */
export function getClientIP(request: Request): string {
  const headers = new Headers(request.headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

/**
 * Rate limit configs for different endpoints.
 */
export const RATE_LIMITS = {
  AUTH: { window: 60, max: 5 }, // 5 auth attempts per minute
  CHECKOUT: { window: 60, max: 3 }, // 3 checkout attempts per minute
  SEARCH: { window: 60, max: 30 }, // 30 searches per minute
  NEWSLETTER: { window: 3600, max: 3 }, // 3 newsletter signups per hour
  API_GENERAL: { window: 60, max: 60 }, // 60 API calls per minute
} as const;
