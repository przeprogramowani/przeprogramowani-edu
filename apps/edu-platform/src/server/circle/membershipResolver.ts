import type { CachedMembership } from './membershipTypes';
import {
  getCachedMembership,
  isMembershipCacheStale,
  setCachedMembership,
  DEFAULT_MEMBERSHIP_FRESHNESS_HOURS,
} from './membershipCache';
import { checkMembershipForCourse } from './membershipApi';
import { getExternalAuthConfig, type ExternalAuthEnv } from './externalAuthConfig';

type MembershipSource = 'cache' | 'circle' | 'recheck';
type MembershipErrorReason = 'unknown_course' | 'missing_v1_token' | 'circle_api_error';

export type MembershipDecision =
  | { status: 'active'; source: MembershipSource }
  | { status: 'revoked'; source: MembershipSource }
  | { status: 'error'; reason: MembershipErrorReason; source: Exclude<MembershipSource, 'cache'> };

export async function resolveMembership(
  email: string,
  courseId: string,
  env: ExternalAuthEnv,
  options: { freshnessHours?: number } = {}
): Promise<MembershipDecision> {
  const normalizedEmail = email.toLowerCase().trim();
  const freshnessHours = options.freshnessHours ?? DEFAULT_MEMBERSHIP_FRESHNESS_HOURS;
  const cached = await getCachedMembership(normalizedEmail, courseId, env);

  if (cached?.status === 'active') {
    if (!isMembershipCacheStale(cached, freshnessHours)) {
      console.info('[membershipResolver] cache_hit_active');
      return { status: 'active', source: 'cache' };
    }

    console.info('[membershipResolver] cache_stale_recheck');
    return refreshMembership(normalizedEmail, courseId, env, 'recheck');
  }

  if (cached?.status === 'revoked') {
    console.info('[membershipResolver] cache_revoked_recheck');
    return refreshMembership(normalizedEmail, courseId, env, 'recheck');
  }

  console.info('[membershipResolver] cache_miss_circle');
  return refreshMembership(normalizedEmail, courseId, env, 'circle');
}

function getErrorReason(error: unknown): MembershipErrorReason {
  if (!(error instanceof Error)) {
    return 'circle_api_error';
  }

  if (error.message.includes('Missing v1 token')) {
    return 'missing_v1_token';
  }

  if (error.message.includes('Unknown course')) {
    return 'unknown_course';
  }

  return 'circle_api_error';
}

function buildActiveMembership(
  email: string,
  memberId: number,
  spaceId: number
): CachedMembership {
  return {
    email,
    spaceId,
    status: 'active',
    verifiedAt: Date.now(),
    memberId,
  };
}

function buildRevokedMembership(
  email: string,
  spaceId: number
): CachedMembership {
  return {
    email,
    spaceId,
    status: 'revoked',
    verifiedAt: Date.now(),
    memberId: null,
  };
}

async function refreshMembership(
  email: string,
  courseId: string,
  env: ExternalAuthEnv,
  source: Exclude<MembershipSource, 'cache'>
): Promise<MembershipDecision> {
  const config = getExternalAuthConfig(courseId);
  const fallbackSpaceId = config?.spaceId ?? 0;

  try {
    const { isMember, member } = await checkMembershipForCourse(email, courseId, env);

    if (isMember && member) {
      await setCachedMembership(
        email,
        courseId,
        buildActiveMembership(email, member.id, member.space_id),
        env
      );
      return { status: 'active', source };
    }

    await setCachedMembership(
      email,
      courseId,
      buildRevokedMembership(email, member?.space_id ?? fallbackSpaceId),
      env
    );
    return { status: 'revoked', source };
  } catch (error) {
    console.error('[membershipResolver] circle_check_failed', {
      courseId,
      email,
      source,
      error,
    });
    return {
      status: 'error',
      reason: getErrorReason(error),
      source,
    };
  }
}
