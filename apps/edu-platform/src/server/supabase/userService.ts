import { getSupabaseAdmin } from './client';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };
type AvatarUploadEnv = SupabaseEnv & { SITE_URL: string };

const AVATAR_BUCKET = 'avatars';

// Skip the `last_login` UPDATE if it was bumped within this window. Nothing in
// the app reads `last_login`; the field exists for ops/analytics, so per-hour
// resolution is plenty and removes ~10% of total DB time from write spam.
const LAST_LOGIN_THROTTLE_MS = 60 * 60 * 1000;

export function buildAvatarUrl(userId: string, version: number, siteUrl: string): string {
  return `${siteUrl}/api/avatar/${userId}?v=${version}`;
}

export interface ProfileRecord {
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

export interface ProfileUpdateInput {
  firstName: string | null;
  lastName: string | null;
}

export interface UpsertUserOptions {
  newsletterOptIn?: boolean;
  firstName?: string | null;
  lastName?: string | null;
}

export async function upsertUser(
  email: string,
  env: SupabaseEnv,
  options?: UpsertUserOptions
): Promise<string> {
  const supabase = getSupabaseAdmin(env);

  // Check profiles table first (fast path — avoids listing all auth.users)
  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Failed to lookup profile for ${email}: ${existingError.message}`);
  }

  let userId: string;

  if (existing?.id) {
    userId = existing.id;
    console.info('[userService] returning user login', { email, userId });
    // Returning user: maybe bump last_login (throttled) and backfill NULL profile
    // fields from OAuth options; never overwrite non-NULL values.
    const { data: current, error: readError } = await supabase
      .from('profiles')
      .select('first_name, last_name, last_login')
      .eq('id', userId)
      .maybeSingle();
    if (readError) {
      throw new Error(`Failed to read profile for ${email}: ${readError.message}`);
    }

    const updatePayload: Record<string, unknown> = {};

    const lastLoginIso = current?.last_login as string | null | undefined;
    const lastLoginMs = lastLoginIso ? Date.parse(lastLoginIso) : NaN;
    const isRecentLastLogin =
      Number.isFinite(lastLoginMs) && Date.now() - lastLoginMs < LAST_LOGIN_THROTTLE_MS;
    if (!isRecentLastLogin) {
      updatePayload.last_login = new Date().toISOString();
    }
    if (options?.firstName && !current?.first_name) {
      updatePayload.first_name = options.firstName;
    }
    if (options?.lastName && !current?.last_name) {
      updatePayload.last_name = options.lastName;
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);
      if (updateError) {
        throw new Error(`Failed to update profile for ${email}: ${updateError.message}`);
      }
    }
  } else {
    console.info('[userService] first-time login — creating Supabase user', { email });
    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { source: 'platform' },
    });
    if (error || !created.user) {
      throw new Error(`Failed to create Supabase user for ${email}: ${error?.message}`);
    }
    userId = created.user.id;
    console.info('[userService] user created', { email, userId });

    const profileData: Record<string, unknown> = {
      id: userId,
      email,
      last_login: new Date().toISOString(),
    };
    if (options?.newsletterOptIn !== undefined) {
      profileData.newsletter_optin = options.newsletterOptIn;
    }
    if (options?.firstName) {
      profileData.first_name = options.firstName;
    }
    if (options?.lastName) {
      profileData.last_name = options.lastName;
    }
    const { error: profileError } = await supabase.from('profiles').insert(profileData);
    if (profileError) {
      throw new Error(`Failed to insert profile for ${email}: ${profileError.message}`);
    }
  }

  return userId;
}

export async function getUserIdByEmail(
  email: string,
  env: SupabaseEnv
): Promise<string | null> {
  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to lookup userId for ${email}: ${error.message}`);
  }
  return data?.id ?? null;
}

export async function getProfile(userId: string, env: SupabaseEnv): Promise<ProfileRecord | null> {
  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase
    .from('profiles')
    .select('email, first_name, last_name, avatar_url')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    throw new Error(`Failed to load profile for ${userId}: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  return {
    email: data.email,
    firstName: data.first_name ?? null,
    lastName: data.last_name ?? null,
    avatarUrl: data.avatar_url ?? null,
  };
}

export async function updateProfile(
  userId: string,
  env: SupabaseEnv,
  input: ProfileUpdateInput
): Promise<ProfileUpdateInput> {
  const supabase = getSupabaseAdmin(env);
  const { error } = await supabase
    .from('profiles')
    .update({ first_name: input.firstName, last_name: input.lastName })
    .eq('id', userId);
  if (error) {
    throw new Error(`Failed to update profile for ${userId}: ${error.message}`);
  }
  return { firstName: input.firstName, lastName: input.lastName };
}

export async function uploadAvatar(
  userId: string,
  env: AvatarUploadEnv,
  bytes: ArrayBuffer | Uint8Array,
  contentType: string
): Promise<string> {
  const supabase = getSupabaseAdmin(env);
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(userId, bytes, { upsert: true, contentType });
  if (uploadError) {
    throw new Error(`Failed to upload avatar for ${userId}: ${uploadError.message}`);
  }

  const avatarUrl = buildAvatarUrl(userId, Date.now(), env.SITE_URL);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);
  if (updateError) {
    throw new Error(`Failed to persist avatar URL for ${userId}: ${updateError.message}`);
  }

  return avatarUrl;
}

export async function removeAvatar(userId: string, env: SupabaseEnv): Promise<void> {
  const supabase = getSupabaseAdmin(env);
  const { error: removeError } = await supabase.storage.from(AVATAR_BUCKET).remove([userId]);
  if (removeError) {
    throw new Error(`Failed to remove avatar for ${userId}: ${removeError.message}`);
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: null })
    .eq('id', userId);
  if (updateError) {
    throw new Error(`Failed to clear avatar URL for ${userId}: ${updateError.message}`);
  }
}
