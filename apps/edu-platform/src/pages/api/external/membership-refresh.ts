import type { APIContext, APIRoute } from 'astro';
import { EXTERNAL_AUTH_CONFIG, type ExternalAuthEnv } from '@/server/circle/externalAuthConfig';
import { checkMembershipForCourse } from '@/server/circle/membershipApi';
import { MEMBERSHIP_CACHE_KEY_PREFIX, setCachedMembership } from '@/server/circle/membershipCache';

const MEMBERSHIP_REFRESH_BATCH_SIZE = 100;

interface MembershipRefreshCounters {
  checked: number;
  updated_active: number;
  updated_revoked: number;
  errors: number;
}

interface MembershipRefreshTarget {
  email: string;
  courseId: string;
  fallbackSpaceId: number;
}

const createJsonResponse = (data: Record<string, unknown>, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

function isAuthorized(request: Request, secret?: string): boolean {
  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get('Authorization');
  return authHeader === `Bearer ${secret}`;
}

function parseMembershipKey(key: string): MembershipRefreshTarget | null {
  if (!key.startsWith(MEMBERSHIP_CACHE_KEY_PREFIX)) {
    return null;
  }

  for (const config of Object.values(EXTERNAL_AUTH_CONFIG)) {
    const expectedPrefix = `${MEMBERSHIP_CACHE_KEY_PREFIX}${config.platform}-${config.spaceId}-`;
    if (!key.startsWith(expectedPrefix)) {
      continue;
    }

    const email = key.slice(expectedPrefix.length).trim().toLowerCase();
    if (!email) {
      return null;
    }

    return {
      email,
      courseId: config.courseId,
      fallbackSpaceId: config.spaceId,
    };
  }

  return null;
}

async function listMembershipTargets(cache: KVNamespace): Promise<MembershipRefreshTarget[]> {
  const targets: MembershipRefreshTarget[] = [];
  let cursor: string | undefined;

  do {
    const page = await cache.list({
      prefix: MEMBERSHIP_CACHE_KEY_PREFIX,
      cursor,
      limit: MEMBERSHIP_REFRESH_BATCH_SIZE,
    });

    for (const key of page.keys) {
      const parsed = parseMembershipKey(key.name);
      if (parsed) {
        targets.push(parsed);
      }
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return targets;
}

async function refreshMembershipTarget(
  target: MembershipRefreshTarget,
  env: ExternalAuthEnv
): Promise<'active' | 'revoked' | 'error'> {
  try {
    const { isMember, member } = await checkMembershipForCourse(target.email, target.courseId, env);
    const isActive = isMember && member !== null;

    await setCachedMembership(
      target.email,
      target.courseId,
      {
        email: target.email,
        spaceId: member?.space_id ?? target.fallbackSpaceId,
        status: isActive ? 'active' : 'revoked',
        verifiedAt: Date.now(),
        memberId: isActive ? member.id : null,
      },
      env
    );

    return isActive ? 'active' : 'revoked';
  } catch (error) {
    console.error('[membership-refresh] refresh_failed', {
      email: target.email,
      courseId: target.courseId,
      error,
    });
    return 'error';
  }
}

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
  const env = locals.runtime.env;

  if (!isAuthorized(request, env.EXTERNAL_MEMBERSHIP_REFRESH_SECRET)) {
    return new Response(null, { status: 401 });
  }

  if (!env.CIRCLE_MEMBERS) {
    return createJsonResponse(
      { success: false, error: 'CIRCLE_MEMBERS KV binding is required.' },
      500
    );
  }

  const counters: MembershipRefreshCounters = {
    checked: 0,
    updated_active: 0,
    updated_revoked: 0,
    errors: 0,
  };

  console.info('[membership-refresh] run_started');
  const targets = await listMembershipTargets(env.CIRCLE_MEMBERS);

  for (const target of targets) {
    counters.checked += 1;
    const result = await refreshMembershipTarget(target, env);

    if (result === 'active') {
      counters.updated_active += 1;
    } else if (result === 'revoked') {
      counters.updated_revoked += 1;
    } else {
      counters.errors += 1;
    }
  }

  console.info('[membership-refresh] run_completed', counters);
  return createJsonResponse({ success: true, ...counters }, 200);
};
