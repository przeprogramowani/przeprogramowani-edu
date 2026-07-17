import { refreshSessionCookieIfNeeded, verifyToken, type SessionCookieWriter } from './auth';
import { resolveMembership } from './circle/membershipResolver';
import type { ExternalAuthEnv } from './circle/externalAuthConfig';
import { getProfile, getUserIdByEmail } from './supabase/userService';
import { hasGrant, upsertGrant } from './supabase/accessService';
import { checkTenXDevs3ToolkitMembership, type TenXDevs3ToolkitEnv } from './toolkit/tenXDevs3Membership';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

/**
 * Result of external auth verification
 */
export interface ExternalAuthResult {
  isAuthenticated: boolean;
  email?: string;
  courseId?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

async function loadProfileFields(
  email: string,
  env: SupabaseEnv
): Promise<{ firstName?: string | null; lastName?: string | null; avatarUrl?: string | null }> {
  try {
    const userId = await getUserIdByEmail(email, env);
    if (!userId) return {};
    const profile = await getProfile(userId, env);
    if (!profile) return {};
    return {
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatarUrl,
    };
  } catch (error) {
    console.error('[verifyExternalAuth] Failed to load profile, continuing without it:', error);
    return {};
  }
}

/**
 * Verifies external auth for a specific course.
 * Accepts the unified platform token cookie, with backward-compatible fallback
 * for old course-scoped external_token_{courseId} cookies (expire within 24h).
 *
 * @param cookies - Astro cookies object
 * @param courseId - Course identifier
 * @param env - Environment variables
 * @returns Auth result with authentication status
 */
export async function verifyExternalAuth(
  cookies: SessionCookieWriter & { get: (name: string) => { value: string } | undefined },
  courseId: string,
  env: ExternalAuthEnv & TenXDevs3ToolkitEnv & { JWT_SECRET: string; SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string }
): Promise<ExternalAuthResult> {
  // 1. Try unified token cookie first
  let token = cookies.get('token')?.value;
  let isLegacyToken = false;

  // 2. Backward compat: fall back to old course-scoped cookie (expires after 24h naturally)
  if (!token) {
    token = cookies.get(`external_token_${courseId}`)?.value;
    isLegacyToken = !!token;
  }

  if (!token) return { isAuthenticated: false };

  // 3. Verify with unified verifyToken() — works for both old and new tokens
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload?.email) return { isAuthenticated: false };

  // 4. Legacy only: validate old token's courseId claim matches URL
  if (isLegacyToken && (payload as any).courseId !== courseId) {
    return { isAuthenticated: false };
  }

  const email = payload.email;
  const refreshUnifiedSession = async () => {
    if (!isLegacyToken) {
      await refreshSessionCookieIfNeeded(cookies, payload, env.JWT_SECRET);
    }
  };
  const supabaseEnv = { SUPABASE_URL: env.SUPABASE_URL, SUPABASE_SERVICE_KEY: env.SUPABASE_SERVICE_KEY };
  // Temporary pre-broker toolkit KV bridge for 10xDevs 3.
  // Plan: thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md
  const toolkitDecision = await checkTenXDevs3ToolkitMembership(email, courseId, env);

  if (toolkitDecision.applies) {
    if (toolkitDecision.allowed) {
      await refreshUnifiedSession();
      const profileFields = await loadProfileFields(email, supabaseEnv);
      return { isAuthenticated: true, email, courseId, ...profileFields };
    }

    return { isAuthenticated: false };
  }

  // 5. Check Supabase access_grants first (fast path)
  try {
    const userId = await getUserIdByEmail(email, supabaseEnv);
    if (userId) {
      const granted = await hasGrant(userId, courseId, supabaseEnv);
      if (granted) {
        await refreshUnifiedSession();
        const profile = await getProfile(userId, supabaseEnv).catch((profileError) => {
          console.error('[verifyExternalAuth] Failed to load profile, continuing without it:', profileError);
          return null;
        });
        return {
          isAuthenticated: true,
          email,
          courseId,
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          avatarUrl: profile?.avatarUrl,
        };
      }
    }
  } catch (supabaseError) {
    console.error('[verifyExternalAuth] Supabase check failed, falling through to Circle:', supabaseError);
  }

  // 6. Not in Supabase (or stale): re-check Circle API (mirrors current behavior)
  const decision = await resolveMembership(email, courseId, env, {
    freshnessHours: env.EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS,
  });

  if (decision.status !== 'active') {
    if (decision.status === 'error') {
      console.error('[verifyExternalAuth] Membership resolution failed:', {
        courseId,
        email,
        reason: decision.reason,
      });
    }
    return { isAuthenticated: false };
  }

  // 7. Sync Circle result to Supabase (async, non-blocking)
  try {
    const userId = await getUserIdByEmail(email, supabaseEnv);
    if (userId) {
      await upsertGrant(userId, courseId, 'circle', supabaseEnv, {
        circleSource: decision.source,
      });
    }
  } catch (syncError) {
    console.error('[verifyExternalAuth] Failed to sync Circle grant to Supabase:', syncError);
  }

  await refreshUnifiedSession();
  const profileFields = await loadProfileFields(email, supabaseEnv);
  return { isAuthenticated: true, email, courseId, ...profileFields };
}
