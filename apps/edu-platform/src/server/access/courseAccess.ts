import {
  airtableCoursesToCourseSlugs,
  type CourseSlug,
} from '@/models/CollectionMappings';
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
import type { ExternalAuthEnv } from '@/server/circle/externalAuthConfig';
import { resolveMembership } from '@/server/circle/membershipResolver';
import { getGrants, upsertGrant } from '@/server/supabase/accessService';
import { getUserIdByEmail } from '@/server/supabase/userService';
import {
  checkTenXDevs3ToolkitMembership,
  TEN_X_DEVS_3_COURSE_ID,
  TEN_X_DEVS_3_PREWORK_COURSE_ID,
  type TenXDevs3ToolkitEnv,
} from '@/server/toolkit/tenXDevs3Membership';

export type CourseAccessEnv = ExternalAuthEnv &
  TenXDevs3ToolkitEnv & {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    AIRTABLE_API_KEY: string;
    EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS?: number;
  };

const KNOWN_COURSE_SLUGS = new Set<CourseSlug>([
  'cursor-ai',
  'opanuj-frontend',
  'opanuj-frontend-live',
  'opanuj-typescript-core',
  'opanuj-typescript-react',
  '10xdevs-1',
  '10xdevs-2',
  '10xdevs-2-en',
  '10xdevs-3',
  '10xdevs-3-prework',
]);

function isCourseSlug(value: string): value is CourseSlug {
  return KNOWN_COURSE_SLUGS.has(value as CourseSlug);
}

export async function getAccessibleCourseSlugs(
  email: string,
  env: CourseAccessEnv
): Promise<CourseSlug[]> {
  const supabaseEnv = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: env.SUPABASE_SERVICE_KEY,
  };

  const slugSet = new Set<CourseSlug>();
  let userId: string | null = null;

  try {
    userId = await getUserIdByEmail(email, supabaseEnv);
    if (userId) {
      const grantSlugs = await getGrants(userId, supabaseEnv);
      for (const raw of grantSlugs) {
        if (isCourseSlug(raw)) {
          slugSet.add(raw);
        }
      }
    } else {
      const fallback = await getCustomerPurchases(email, env.AIRTABLE_API_KEY);
      for (const slug of airtableCoursesToCourseSlugs(fallback.purchasedCourses)) {
        slugSet.add(slug);
      }
    }
  } catch (supabaseError) {
    console.error(
      '[courseAccess] Supabase query failed, falling back to Airtable:',
      supabaseError
    );
    try {
      const fallback = await getCustomerPurchases(email, env.AIRTABLE_API_KEY);
      for (const slug of airtableCoursesToCourseSlugs(fallback.purchasedCourses)) {
        slugSet.add(slug);
      }
    } catch (airtableError) {
      console.error('[courseAccess] Airtable fallback failed:', airtableError);
    }
  }

  if (!slugSet.has(TEN_X_DEVS_3_COURSE_ID)) {
    const mainCourseAccess = await checkTenXDevs3Eligibility(email, TEN_X_DEVS_3_COURSE_ID, userId, env, supabaseEnv);
    if (mainCourseAccess) {
      slugSet.add(TEN_X_DEVS_3_COURSE_ID);
    }
  }

  if (!slugSet.has(TEN_X_DEVS_3_PREWORK_COURSE_ID)) {
    const preworkAccess = await checkTenXDevs3Eligibility(email, TEN_X_DEVS_3_PREWORK_COURSE_ID, userId, env, supabaseEnv);
    if (preworkAccess) {
      slugSet.add(TEN_X_DEVS_3_PREWORK_COURSE_ID);
    }
  }

  return Array.from(slugSet);
}

async function checkTenXDevs3Eligibility(
  email: string,
  courseId: string,
  userId: string | null,
  env: CourseAccessEnv,
  supabaseEnv: { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string }
): Promise<boolean> {
  const toolkitDecision = await checkTenXDevs3ToolkitMembership(email, courseId, env);

  if (toolkitDecision.applies) {
    return toolkitDecision.allowed;
  }

  const decision = await resolveMembership(email, courseId, env, {
    freshnessHours: env.EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS,
  });

  if (decision.status !== 'active') {
    if (decision.status === 'error') {
      console.error('[courseAccess] Membership resolution failed:', {
        email,
        courseId,
        reason: decision.reason,
      });
    }
    return false;
  }

  if (userId) {
    try {
      await upsertGrant(userId, courseId, 'circle', supabaseEnv, {
        circleSource: decision.source,
      });
    } catch (syncError) {
      console.error('[courseAccess] Failed to sync Circle grant to Supabase:', syncError);
    }
  }

  return true;
}
