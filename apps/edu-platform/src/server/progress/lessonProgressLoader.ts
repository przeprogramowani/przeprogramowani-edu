import { loadLessonProgress, type LessonProgressItem } from '@/server/supabase/lessonProgressService';
import { upsertUser } from '@/server/supabase/userService';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export type LessonProgressById = Record<string, LessonProgressItem>;
export interface LessonProgressScope {
  courseSlug: string;
  language?: string | null;
}
export type LessonWithProgress<T> = T & {
  progress?: {
    completed: boolean;
    lessonId: string;
  };
};

export async function loadLessonProgressForCourse({
  email,
  courseSlug,
  language,
  env,
}: {
  email?: string;
  courseSlug: string;
  language?: string | null;
  env: SupabaseEnv;
}): Promise<LessonProgressById | null> {
  if (!email) return null;

  try {
    const userId = await upsertUser(email, env);
    const progress = await loadLessonProgress(userId, { courseSlug, language }, env);
    return Object.fromEntries(progress.map((item) => [item.lessonId, item]));
  } catch (error) {
    console.error('[lesson-progress] failed to load course progress', {
      courseSlug,
      language: language ?? null,
      error,
    });
    return null;
  }
}

export const loadProgressForCourseSidebar = loadLessonProgressForCourse;

export function buildLessonProgressScope({
  courseSlug,
  language,
  lessonProgress,
}: {
  courseSlug: string;
  language?: string | null;
  lessonProgress: LessonProgressById | null;
}): LessonProgressScope | undefined {
  return lessonProgress ? { courseSlug, language: language ?? null } : undefined;
}

export function attachLessonProgress<T>(
  lessons: T[],
  lessonProgress: LessonProgressById | null,
  getLessonId: (lesson: T) => string | number
): LessonWithProgress<T>[] {
  return lessons.map((lesson) => {
    const lessonId = String(getLessonId(lesson));

    return {
      ...lesson,
      progress: lessonProgress
        ? {
            completed: Boolean(lessonProgress[lessonId]),
            lessonId,
          }
        : undefined,
    };
  });
}
