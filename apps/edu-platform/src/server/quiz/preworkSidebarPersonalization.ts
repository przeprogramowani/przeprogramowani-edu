import {
  PREWORK_COURSE_SLUG,
  PREWORK_PATH_QUIZ_SLUG,
  type PreworkQuizResult,
  type QuizLanguage,
} from '@/lib/quiz/10x-devs-3-prework';
import { loadQuizResult } from '@/server/supabase/quizResultService';
import { getUserIdByEmail } from '@/server/supabase/userService';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export interface LessonPersonalizationMarker {
  label: string;
  tooltip: string;
}

export type LessonPersonalizationById = Record<string, LessonPersonalizationMarker>;

function isPreworkQuizResult(value: unknown): value is PreworkQuizResult {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<PreworkQuizResult>;
  return Array.isArray(candidate.recommendations);
}

function buildTooltip(language: QuizLanguage, reason: string): string {
  const prefix = language === 'pl' ? 'Sugestia na podstawie quizu' : 'Suggested based on your quiz';
  return `${prefix}: ${reason}`;
}

export function mapPreworkQuizResultToLessonPersonalization(
  result: unknown,
  language: QuizLanguage
): LessonPersonalizationById {
  if (!isPreworkQuizResult(result)) return {};

  return result.recommendations.reduce<LessonPersonalizationById>((markers, recommendation) => {
    if (!recommendation.lessonId || !recommendation.reason) return markers;

    markers[recommendation.lessonId] = {
      label: '💡',
      tooltip: buildTooltip(language, recommendation.reason),
    };

    return markers;
  }, {});
}

export async function loadPreworkSidebarPersonalization(
  email: string | undefined,
  language: QuizLanguage,
  env: SupabaseEnv
): Promise<LessonPersonalizationById> {
  if (!email) return {};

  try {
    const userId = await getUserIdByEmail(email, env);
    if (!userId) return {};

    const record = await loadQuizResult(
      userId,
      PREWORK_COURSE_SLUG,
      PREWORK_PATH_QUIZ_SLUG,
      language,
      env
    );

    return mapPreworkQuizResultToLessonPersonalization(record?.result, language);
  } catch (error) {
    console.error('[preworkSidebarPersonalization] Failed to load quiz personalization:', error);
    return {};
  }
}
