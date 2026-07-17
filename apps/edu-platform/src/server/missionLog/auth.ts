import type { APIContext } from 'astro';
import { verifyToken } from '@/server/auth';
import { ADMIN_EMAILS } from '@/server/admins';
import { hasGrant } from '@/server/supabase/accessService';
import { getProfile, upsertUser } from '@/server/supabase/userService';
import {
  checkTenXDevs3ToolkitMembership,
  syncTenXDevs3ToolkitGrant,
  TEN_X_DEVS_3_COURSE_ID,
} from '@/server/toolkit/tenXDevs3Membership';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export interface MissionLogUser {
  userId: string;
  email: string;
  avatarUrl: string | null;
}

export type MissionLogAuthResult =
  | { ok: true; user: MissionLogUser }
  | { ok: false; status: 401 | 403; error: string };

export async function resolveMissionLogUser(
  context: APIContext,
): Promise<MissionLogAuthResult> {
  const env = context.locals.runtime.env;
  const supabaseEnv: SupabaseEnv = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: env.SUPABASE_SERVICE_KEY,
  };

  const token = context.cookies.get('token')?.value;
  if (!token) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload?.email) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }

  const userId = await upsertUser(payload.email, supabaseEnv);

  const isAdmin = ADMIN_EMAILS.includes(payload.email);
  if (!isAdmin) {
    const granted = await hasGrant(userId, TEN_X_DEVS_3_COURSE_ID, supabaseEnv);
    if (!granted) {
      const toolkitDecision = await checkTenXDevs3ToolkitMembership(
        payload.email,
        TEN_X_DEVS_3_COURSE_ID,
        env,
      );
      const wrote = await syncTenXDevs3ToolkitGrant(
        userId,
        TEN_X_DEVS_3_COURSE_ID,
        toolkitDecision,
        supabaseEnv,
      );
      if (!wrote) {
        return { ok: false, status: 403, error: 'Forbidden' };
      }
    }
  }

  const profile = await getProfile(userId, supabaseEnv);

  return {
    ok: true,
    user: {
      userId,
      email: payload.email,
      avatarUrl: profile?.avatarUrl ?? null,
    },
  };
}
