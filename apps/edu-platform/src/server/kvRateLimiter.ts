export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp (seconds)
}

export async function kvRateLimit(
  kv: KVNamespace,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowSeconds);
  const key = `rl:${windowStart}:${identifier}`;
  const resetAt = (windowStart + 1) * windowSeconds;

  const current = Number((await kv.get(key)) ?? '0');
  if (current >= limit) {
    return { allowed: false, remaining: 0, resetAt };
  }

  await kv.put(key, String(current + 1), { expirationTtl: windowSeconds * 2 });
  return { allowed: true, remaining: limit - current - 1, resetAt };
}

export function rateLimitHeaders(
  result: RateLimitResult,
  limit: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetAt),
  };
}
