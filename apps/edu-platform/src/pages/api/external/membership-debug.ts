import type { APIContext, APIRoute } from 'astro';
import { getExternalAuthConfig } from '@/server/circle/externalAuthConfig';
import {
  DEFAULT_MEMBERSHIP_FRESHNESS_HOURS,
  getCacheKey,
  isMembershipCacheStale,
} from '@/server/circle/membershipCache';
import type { CachedMembership } from '@/server/circle/membershipTypes';

const createJsonResponse = (data: Record<string, unknown>, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

function isAuthorized(request: Request, secret?: string): boolean {
  if (!secret) return false;
  const authHeader = request.headers.get('Authorization');
  return authHeader === `Bearer ${secret}`;
}

function parseCachedMembership(raw: string | null): CachedMembership | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CachedMembership;
  } catch {
    return null;
  }
}

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
  const env = locals.runtime.env;

  if (!isAuthorized(request, env.EXTERNAL_MEMBERSHIP_REFRESH_SECRET)) {
    return new Response(null, { status: 401 });
  }

  if (!env.CIRCLE_MEMBERS) {
    return createJsonResponse({ success: false, error: 'CIRCLE_MEMBERS KV binding is required.' }, 500);
  }

  let body: { email?: string; courseId?: string };
  try {
    body = (await request.json()) as { email?: string; courseId?: string };
  } catch {
    return createJsonResponse({ success: false, error: 'Invalid JSON body.' }, 400);
  }

  const email = body.email?.toLowerCase().trim();
  const courseId = body.courseId?.trim();
  if (!email || !courseId) {
    return createJsonResponse({ success: false, error: 'email and courseId are required.' }, 400);
  }

  const config = getExternalAuthConfig(courseId);
  if (!config) {
    return createJsonResponse({ success: false, error: 'Unknown courseId.' }, 400);
  }

  const expectedKey = getCacheKey(config.platform, config.spaceId, email);
  const raw = await env.CIRCLE_MEMBERS.get(expectedKey);
  const cached = parseCachedMembership(raw);
  const freshnessHours = env.EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS || DEFAULT_MEMBERSHIP_FRESHNESS_HOURS;

  return createJsonResponse(
    {
      success: true,
      courseId,
      email,
      expectedKey,
      keyFound: raw !== null,
      rawValue: raw,
      parsedValue: cached,
      freshnessHours,
      isStale: cached ? isMembershipCacheStale(cached, freshnessHours) : null,
      now: Date.now(),
    },
    200
  );
};
