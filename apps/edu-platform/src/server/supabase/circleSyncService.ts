import { resolveMembership } from '@/server/circle/membershipResolver';
import { upsertGrant } from './accessService';
import type { ExternalAuthEnv } from '@/server/circle/externalAuthConfig';

type SyncEnv = SupabaseEnv & ExternalAuthEnv;
type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

// All Circle-gated courseIds that can produce access_grants
const CIRCLE_COURSE_IDS = ['opanuj-frontend', '10xdevs-1', '10xdevs-2', '10xdevs-3'];

export async function syncForCourse(
  userId: string,
  email: string,
  courseId: string,
  env: SyncEnv
): Promise<void> {
  console.info('[circleSyncService] checking membership', { email, courseId });
  try {
    const decision = await resolveMembership(email, courseId, env, {});
    if (decision.status === 'active') {
      await upsertGrant(userId, courseId, 'circle', env, {
        circleSource: decision.source,
      });
      console.info('[circleSyncService] grant upserted', {
        email,
        courseId,
        source: decision.source,
      });
    } else {
      console.info('[circleSyncService] no active membership', {
        email,
        courseId,
        status: decision.status,
      });
    }
  } catch (error) {
    console.error('[circleSyncService] sync failed:', { courseId, error });
  }
}

/**
 * Sync all known Circle courses for a user logging in via main platform.
 * Called on main login (magic link / OAuth) — checks each Circle course.
 * Expensive first time; subsequent calls are fast via KV cache.
 */
export async function syncAllCircleCourses(
  userId: string,
  email: string,
  env: SyncEnv
): Promise<void> {
  console.info('[circleSyncService] starting all-course sync', {
    email,
    courses: CIRCLE_COURSE_IDS,
  });
  const results = await Promise.allSettled(
    CIRCLE_COURSE_IDS.map((courseId) => syncForCourse(userId, email, courseId, env))
  );
  const failed = results.filter((r) => r.status === 'rejected').length;
  if (failed > 0) {
    console.warn('[circleSyncService] some course syncs failed', { email, failed });
  } else {
    console.info('[circleSyncService] all-course sync complete', { email });
  }
}
