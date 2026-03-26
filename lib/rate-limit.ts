const hits = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter. Returns true if the request should be allowed.
 * @param key – unique identifier (usually IP)
 * @param limit – max requests per window
 * @param windowMs – window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count < limit) {
    entry.count++;
    return true;
  }

  return false;
}
