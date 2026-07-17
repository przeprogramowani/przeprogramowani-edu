import { type AuthResult } from '@/models/AuthResult';
import { PERMISSION_MAPPINGS, type CourseSlug } from '@/models/CollectionMappings';
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
import { refreshSessionCookieIfNeeded, verifyToken } from '@/server/auth';
import { JWT_SECRET, AIRTABLE_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY } from 'astro:env/server';
import { getProfile, getUserIdByEmail } from '@/server/supabase/userService';
import { getGrants, grantsToAirtableCourses } from '@/server/supabase/accessService';
import { AstroGlobal } from 'astro';
import { log } from '@/lib/logger';

export async function verifyAuth(Astro: AstroGlobal, courseSlug?: CourseSlug): Promise<AuthResult> {

  const token = Astro.cookies.get('token')?.value;

  if (!token) {
    return { isAuthenticated: false };
  }

  const payload = await verifyToken(token, JWT_SECRET);
  if (!payload) {
    log({ level: 'warn', event: 'auth.token_invalid', courseSlug: courseSlug ?? null });
    return { isAuthenticated: false };
  }

  const refreshed = await refreshSessionCookieIfNeeded(Astro.cookies, payload, JWT_SECRET);
  if (refreshed) {
    log({ level: 'info', event: 'auth.token_refreshed', email: payload.email });
  }

  const supabaseEnv = { SUPABASE_URL, SUPABASE_SERVICE_KEY };
  let purchasedCourses;
  let firstName: string | null | undefined;
  let lastName: string | null | undefined;
  let avatarUrl: string | null | undefined;
  let resolvedUserId: string | undefined;
  try {
    const userId = await getUserIdByEmail(payload.email, supabaseEnv);
    if (userId) {
      resolvedUserId = userId;
      const [grantSlugs, profile] = await Promise.all([
        getGrants(userId, supabaseEnv),
        getProfile(userId, supabaseEnv).catch((profileError) => {
          log({ level: 'error', event: 'auth.profile_load_failed', email: payload.email, error: String(profileError) });
          return null;
        }),
      ]);
      log({ level: 'info', event: 'auth.grants_loaded', email: payload.email, grantCount: grantSlugs.length, source: 'supabase' });
      purchasedCourses = grantsToAirtableCourses(grantSlugs);
      if (profile) {
        firstName = profile.firstName;
        lastName = profile.lastName;
        avatarUrl = profile.avatarUrl;
      }
    } else {
      log({ level: 'warn', event: 'auth.supabase_user_missing', email: payload.email, fallback: 'airtable' });
      const fallback = await getCustomerPurchases(payload.email, AIRTABLE_API_KEY);
      purchasedCourses = fallback.purchasedCourses;
    }
  } catch (supabaseError) {
    log({ level: 'error', event: 'auth.supabase_query_failed', email: payload.email, error: String(supabaseError), fallback: 'airtable' });
    const fallback = await getCustomerPurchases(payload.email, AIRTABLE_API_KEY);
    purchasedCourses = fallback.purchasedCourses;
  }

  if (courseSlug) {
    const permission = PERMISSION_MAPPINGS[courseSlug];
    if (!purchasedCourses.includes(permission)) {
      return { isAuthenticated: false };
    }
  }

  return {
    isAuthenticated: true,
    email: payload.email,
    userId: resolvedUserId,
    purchases: purchasedCourses,
    firstName,
    lastName,
    avatarUrl,
  };
}
