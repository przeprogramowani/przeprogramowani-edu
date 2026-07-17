import { getSupabaseAdmin } from './client';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export interface LessonProgressScope {
  courseSlug: string;
  language?: string | null;
}

export interface LessonProgressItem extends LessonProgressScope {
  lessonId: string;
  completedAt: string;
  updatedAt?: string;
}

export interface LessonCompletionInput extends LessonProgressScope {
  lessonId: string;
  completed: boolean;
}

interface LessonProgressRow {
  id?: string;
  course_slug: string;
  language: string | null;
  lesson_id: string;
  completed_at: string;
  updated_at?: string;
}

function normalizeLanguage(language?: string | null): string | null {
  return language ?? null;
}

function mapLessonProgress(row: LessonProgressRow): LessonProgressItem {
  return {
    courseSlug: row.course_slug,
    language: row.language,
    lessonId: row.lesson_id,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
  };
}

export async function loadLessonProgress(
  userId: string,
  scope: LessonProgressScope,
  env: SupabaseEnv
): Promise<LessonProgressItem[]> {
  const supabase = getSupabaseAdmin(env);
  let query = supabase
    .from('lesson_progress')
    .select('course_slug, language, lesson_id, completed_at, updated_at')
    .eq('user_id', userId)
    .eq('course_slug', scope.courseSlug);

  const language = normalizeLanguage(scope.language);
  query = language === null ? query.is('language', null) : query.eq('language', language);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load lesson progress: ${error.message}`);
  }

  return (data ?? []).map((row) => mapLessonProgress(row as LessonProgressRow));
}

export async function setLessonCompletion(
  userId: string,
  input: LessonCompletionInput,
  env: SupabaseEnv
): Promise<LessonProgressItem | null> {
  const supabase = getSupabaseAdmin(env);
  const language = normalizeLanguage(input.language);

  if (!input.completed) {
    let query = supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', userId)
      .eq('course_slug', input.courseSlug)
      .eq('lesson_id', input.lessonId);

    query = language === null ? query.is('language', null) : query.eq('language', language);

    const { error } = await query;

    if (error) {
      throw new Error(`Failed to delete lesson progress: ${error.message}`);
    }

    return null;
  }

  let findQuery = supabase
    .from('lesson_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('course_slug', input.courseSlug)
    .eq('lesson_id', input.lessonId);

  findQuery = language === null ? findQuery.is('language', null) : findQuery.eq('language', language);

  const { data: existing, error: findError } = await findQuery.maybeSingle();

  if (findError) {
    throw new Error(`Failed to find lesson progress: ${findError.message}`);
  }

  const now = new Date().toISOString();

  if ((existing as { id?: string } | null)?.id) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .update({
        completed_at: now,
        updated_at: now,
      })
      .eq('id', (existing as { id: string }).id)
      .select('course_slug, language, lesson_id, completed_at, updated_at')
      .single();

    if (error) {
      throw new Error(`Failed to update lesson progress: ${error.message}`);
    }

    return mapLessonProgress(data as LessonProgressRow);
  }

  const insertPayload = {
    user_id: userId,
    course_slug: input.courseSlug,
    language,
    lesson_id: input.lessonId,
    completed_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('lesson_progress')
    .insert(insertPayload)
    .select('course_slug, language, lesson_id, completed_at, updated_at')
    .single();

  if (!error) {
    return mapLessonProgress(data as LessonProgressRow);
  }

  if (error.code !== '23505') {
    throw new Error(`Failed to save lesson progress: ${error.message}`);
  }

  let retryQuery = supabase
    .from('lesson_progress')
    .update({
      completed_at: now,
      updated_at: now,
    })
    .eq('user_id', userId)
    .eq('course_slug', input.courseSlug)
    .eq('lesson_id', input.lessonId);

  retryQuery = language === null ? retryQuery.is('language', null) : retryQuery.eq('language', language);

  const { data: retryData, error: retryError } = await retryQuery
    .select('course_slug, language, lesson_id, completed_at, updated_at')
    .single();

  if (retryError) {
    throw new Error(`Failed to update lesson progress after duplicate insert: ${retryError.message}`);
  }

  return mapLessonProgress(retryData as LessonProgressRow);
}
