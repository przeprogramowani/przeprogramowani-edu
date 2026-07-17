import {
  PREWORK_COURSE_SLUG,
  PREWORK_PATH_QUIZ_SLUG,
  type QuizLanguage,
} from '@/lib/quiz/10x-devs-3-prework';
import { loadQuizResult } from '@/server/supabase/quizResultService';
import { getUserIdByEmail } from '@/server/supabase/userService';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function hasCompletedPreworkPathQuiz(
  email: string | undefined,
  language: QuizLanguage,
  env: SupabaseEnv
): Promise<boolean> {
  if (!email) return false;

  try {
    const userId = await getUserIdByEmail(email, env);
    if (!userId) return false;

    const record = await loadQuizResult(
      userId,
      PREWORK_COURSE_SLUG,
      PREWORK_PATH_QUIZ_SLUG,
      language,
      env
    );

    return !!record?.result;
  } catch (error) {
    console.error('[preworkQuizState] Failed to load quiz completion state:', error);
    return false;
  }
}
