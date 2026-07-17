import type { APIContext, APIRoute } from 'astro';
import { verifyExternalAuth } from '@/server/externalAuth';
import { upsertUser } from '@/server/supabase/userService';
import { loadQuizResult, saveQuizResult } from '@/server/supabase/quizResultService';
import {
  buildPreworkQuizResult,
  isQuizLanguage,
  PREWORK_COURSE_SLUG,
  PREWORK_PATH_QUIZ_SLUG,
  PREWORK_PATH_QUIZ_VERSION,
  type PreworkQuizAnswers,
} from '@/lib/quiz/10x-devs-3-prework';

const jsonHeaders = { 'Content-Type': 'application/json' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidAnswers(value: unknown): value is PreworkQuizAnswers {
  if (!isObject(value)) return false;
  return Object.values(value).every(
    (answer) =>
      typeof answer === 'string' ||
      (Array.isArray(answer) && answer.every((item) => typeof item === 'string'))
  );
}

function isSupportedQuiz(courseSlug: string, quizSlug: string): boolean {
  return courseSlug === PREWORK_COURSE_SLUG && quizSlug === PREWORK_PATH_QUIZ_SLUG;
}

async function getAuthenticatedUserId(context: APIContext, courseSlug: string): Promise<string | Response> {
  const env = context.locals.runtime.env;
  const authResult = await verifyExternalAuth(context.cookies, courseSlug, env);

  if (!authResult.isAuthenticated || !authResult.email) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  return upsertUser(authResult.email, env);
}

export const GET: APIRoute = async (context) => {
  const courseSlug = context.url.searchParams.get('courseSlug') ?? '';
  const quizSlug = context.url.searchParams.get('quizSlug') ?? '';
  const language = context.url.searchParams.get('language') ?? '';

  if (!isSupportedQuiz(courseSlug, quizSlug) || !isQuizLanguage(language)) {
    return jsonResponse({ error: 'Unsupported quiz' }, 400);
  }

  try {
    const userId = await getAuthenticatedUserId(context, courseSlug);
    if (userId instanceof Response) return userId;

    const record = await loadQuizResult(
      userId,
      courseSlug,
      quizSlug,
      language,
      context.locals.runtime.env
    );
    return jsonResponse({ result: record });
  } catch (error) {
    console.error('[api/quiz-result GET] Error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};

export const PUT: APIRoute = async (context) => {
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!isObject(body)) {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const courseSlug = typeof body.courseSlug === 'string' ? body.courseSlug : '';
  const quizSlug = typeof body.quizSlug === 'string' ? body.quizSlug : '';
  const language = typeof body.language === 'string' ? body.language : '';

  if (!isSupportedQuiz(courseSlug, quizSlug) || !isQuizLanguage(language)) {
    return jsonResponse({ error: 'Unsupported quiz' }, 400);
  }

  if (!isValidAnswers(body.answers)) {
    return jsonResponse({ error: 'Invalid answers' }, 400);
  }

  try {
    const userId = await getAuthenticatedUserId(context, courseSlug);
    if (userId instanceof Response) return userId;

    const quizResult = buildPreworkQuizResult(body.answers, language);
    const record = await saveQuizResult(
      userId,
      {
        courseSlug,
        quizSlug,
        language,
        questionVersion: PREWORK_PATH_QUIZ_VERSION,
        answers: body.answers,
        result: quizResult,
      },
      context.locals.runtime.env
    );

    return jsonResponse({ result: record });
  } catch (error) {
    console.error('[api/quiz-result PUT] Error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};
