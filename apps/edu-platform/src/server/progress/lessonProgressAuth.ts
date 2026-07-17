import type { APIContext } from 'astro';
import { COURSE_SLUG_TO_NAME, type CourseSlug } from '@/models/CollectionMappings';
import { verifyToken } from '@/server/auth';
import { getExternalAuthConfig } from '@/server/circle/externalAuthConfig';
import { verifyExternalAuth } from '@/server/externalAuth';
import { hasGrant } from '@/server/supabase/accessService';
import { upsertUser } from '@/server/supabase/userService';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export interface LessonProgressUser {
  userId: string;
  email: string;
}

export type LessonProgressAuthResult =
  | { ok: true; user: LessonProgressUser }
  | { ok: false; status: 401 | 404; error: string };

export function isCourseSlug(value: string): value is CourseSlug {
  return Object.prototype.hasOwnProperty.call(COURSE_SLUG_TO_NAME, value);
}

export async function resolveLessonProgressUser(
  context: APIContext,
  courseSlug: CourseSlug
): Promise<LessonProgressAuthResult> {
  const env = context.locals.runtime.env;
  const supabaseEnv: SupabaseEnv = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: env.SUPABASE_SERVICE_KEY,
  };

  let email: string | undefined;

  if (getExternalAuthConfig(courseSlug)) {
    const authResult = await verifyExternalAuth(context.cookies, courseSlug, env);
    if (!authResult.isAuthenticated || !authResult.email) {
      return { ok: false, status: 401, error: 'Unauthorized' };
    }
    email = authResult.email;
  } else {
    const token = context.cookies.get('token')?.value;
    if (!token) {
      return { ok: false, status: 401, error: 'Unauthorized' };
    }

    const payload = await verifyToken(token, env.JWT_SECRET);
    if (!payload?.email) {
      return { ok: false, status: 401, error: 'Unauthorized' };
    }

    email = payload.email;
  }

  const userId = await upsertUser(email, supabaseEnv);

  if (!getExternalAuthConfig(courseSlug)) {
    const granted = await hasGrant(userId, courseSlug, supabaseEnv);
    if (!granted) {
      return { ok: false, status: 401, error: 'Unauthorized' };
    }
  }

  return { ok: true, user: { userId, email } };
}
