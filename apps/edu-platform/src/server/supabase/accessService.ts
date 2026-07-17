import { getSupabaseAdmin } from './client';
import { PERMISSION_MAPPINGS } from '@/models/CollectionMappings';
import type { AirtableCourse } from '@/server/airtable/airtable-course';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function getGrants(userId: string, env: SupabaseEnv): Promise<string[]> {
  const supabase = getSupabaseAdmin(env);
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('access_grants')
    .select('course_slug')
    .eq('user_id', userId)
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  if (error) throw new Error(`getGrants failed: ${error.message}`);
  return (data ?? []).map((r) => r.course_slug);
}

export async function hasGrant(
  userId: string,
  courseSlug: string,
  env: SupabaseEnv
): Promise<boolean> {
  const grants = await getGrants(userId, env);
  return grants.includes(courseSlug);
}

export async function upsertGrant(
  userId: string,
  courseSlug: string,
  source: 'free' | 'airtable' | 'circle' | 'manual',
  env: SupabaseEnv,
  sourceMeta?: Record<string, unknown>
): Promise<void> {
  const supabase = getSupabaseAdmin(env);
  await supabase.from('access_grants').upsert(
    {
      user_id: userId,
      course_slug: courseSlug,
      source,
      synced_at: new Date().toISOString(),
      source_meta: sourceMeta ?? null,
    },
    { onConflict: 'user_id,course_slug' }
  );
}

/**
 * Convert Supabase course_slug grants back to AirtableCourse[] for backward compat
 * with AuthResult.purchases field used by CourseList.
 */
export function grantsToAirtableCourses(grantSlugs: string[]): AirtableCourse[] {
  const slugSet = new Set(grantSlugs);
  const courses = Object.entries(PERMISSION_MAPPINGS)
    .filter(([slug]) => slugSet.has(slug))
    .map(([, perm]) => perm);
  return [...new Set(courses)] as AirtableCourse[];
}
