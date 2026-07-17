import { getSupabaseAdmin } from '@/server/supabase/client';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export const MAX_GENERATIONS_PER_LESSON = 2;

export interface QuotaEntry {
  lessonId: string;
  count: number;
  lastBadgeImageUrl: string | null;
  lastBadgeId: number | null;
}

interface QuotaRow {
  lesson_id: string;
  count: number;
  last_badge_image_url: string | null;
  last_badge_id: number | null;
}

function mapRow(row: QuotaRow): QuotaEntry {
  return {
    lessonId: row.lesson_id,
    count: row.count,
    lastBadgeImageUrl: row.last_badge_image_url,
    lastBadgeId: row.last_badge_id,
  };
}

export async function getQuotaForUser(
  userId: string,
  env: SupabaseEnv,
): Promise<QuotaEntry[]> {
  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase
    .from('mission_log_generations')
    .select('lesson_id, count, last_badge_image_url, last_badge_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to load mission log quota: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRow(row as QuotaRow));
}

export interface RecordGenerationInput {
  userId: string;
  lessonId: string;
  badgeId: number;
  badgeImageUrl: string;
}

export class QuotaExhaustedError extends Error {
  constructor(public readonly currentCount: number) {
    super(`Quota exhausted: count=${currentCount}`);
    this.name = 'QuotaExhaustedError';
  }
}

export async function recordGeneration(
  input: RecordGenerationInput,
  env: SupabaseEnv,
): Promise<{ count: number }> {
  const supabase = getSupabaseAdmin(env);
  const now = new Date().toISOString();

  // Read existing row first so we can hard-cap server-side. The plan accepts a
  // race here because the upstream generate call is idempotent on (email, badgeId)
  // — a doubled call only overwrites the image, not the local counter. The cap
  // is the source of truth for "remaining attempts".
  const { data: existing, error: readError } = await supabase
    .from('mission_log_generations')
    .select('count')
    .eq('user_id', input.userId)
    .eq('lesson_id', input.lessonId)
    .maybeSingle();

  if (readError) {
    throw new Error(`Failed to read mission log quota: ${readError.message}`);
  }

  const currentCount = (existing?.count as number | undefined) ?? 0;
  if (currentCount >= MAX_GENERATIONS_PER_LESSON) {
    throw new QuotaExhaustedError(currentCount);
  }

  const nextCount = currentCount + 1;

  if (existing) {
    const { error: updateError } = await supabase
      .from('mission_log_generations')
      .update({
        count: nextCount,
        last_generated_at: now,
        last_badge_image_url: input.badgeImageUrl,
        last_badge_id: input.badgeId,
      })
      .eq('user_id', input.userId)
      .eq('lesson_id', input.lessonId);
    if (updateError) {
      throw new Error(`Failed to update mission log quota: ${updateError.message}`);
    }
  } else {
    const { error: insertError } = await supabase.from('mission_log_generations').insert({
      user_id: input.userId,
      lesson_id: input.lessonId,
      count: nextCount,
      first_generated_at: now,
      last_generated_at: now,
      last_badge_image_url: input.badgeImageUrl,
      last_badge_id: input.badgeId,
    });
    if (insertError) {
      throw new Error(`Failed to insert mission log quota: ${insertError.message}`);
    }
  }

  return { count: nextCount };
}
