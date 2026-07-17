import { getSupabaseAdmin } from './client';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export interface QuizResultRecord {
  courseSlug: string;
  quizSlug: string;
  language: string;
  questionVersion: string;
  answers: unknown;
  result: unknown;
  completedAt?: string;
  updatedAt?: string;
}

interface QuizResultRow {
  course_slug: string;
  quiz_slug: string;
  language: string;
  question_version: string;
  answers: unknown;
  result: unknown;
  completed_at?: string;
  updated_at?: string;
}

function mapQuizResult(row: QuizResultRow): QuizResultRecord {
  return {
    courseSlug: row.course_slug,
    quizSlug: row.quiz_slug,
    language: row.language,
    questionVersion: row.question_version,
    answers: row.answers,
    result: row.result,
    completedAt: row.completed_at,
    updatedAt: row.updated_at,
  };
}

export async function loadQuizResult(
  userId: string,
  courseSlug: string,
  quizSlug: string,
  language: string,
  env: SupabaseEnv
): Promise<QuizResultRecord | null> {
  const supabase = getSupabaseAdmin(env);
  const { data, error } = await supabase
    .from('quiz_results')
    .select('course_slug, quiz_slug, language, question_version, answers, result, completed_at, updated_at')
    .eq('user_id', userId)
    .eq('course_slug', courseSlug)
    .eq('quiz_slug', quizSlug)
    .eq('language', language)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load quiz result: ${error.message}`);
  }

  return data ? mapQuizResult(data as QuizResultRow) : null;
}

export async function saveQuizResult(
  userId: string,
  record: QuizResultRecord,
  env: SupabaseEnv
): Promise<QuizResultRecord> {
  const supabase = getSupabaseAdmin(env);
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('quiz_results')
    .upsert(
      {
        user_id: userId,
        course_slug: record.courseSlug,
        quiz_slug: record.quizSlug,
        language: record.language,
        question_version: record.questionVersion,
        answers: record.answers,
        result: record.result,
        completed_at: now,
        updated_at: now,
      },
      { onConflict: 'user_id,course_slug,quiz_slug,language' }
    )
    .select('course_slug, quiz_slug, language, question_version, answers, result, completed_at, updated_at')
    .single();

  if (error) {
    throw new Error(`Failed to save quiz result: ${error.message}`);
  }

  return mapQuizResult(data as QuizResultRow);
}
