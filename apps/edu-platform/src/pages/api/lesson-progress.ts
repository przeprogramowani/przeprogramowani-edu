import type { APIRoute } from 'astro';
import type { CourseSlug } from '@/models/CollectionMappings';
import { isCourseSlug, resolveLessonProgressUser } from '@/server/progress/lessonProgressAuth';
import { loadLessonProgress, setLessonCompletion } from '@/server/supabase/lessonProgressService';

const jsonHeaders = { 'Content-Type': 'application/json' };
const BILINGUAL_COURSE_SLUGS = new Set<CourseSlug>(['10xdevs-3-prework', '10xdevs-3']);
const SUPPORTED_LANGUAGES = new Set(['pl', 'en']);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeLanguage(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function validateProgressScope(
  courseSlug: string,
  language: string | null
): { ok: true; courseSlug: CourseSlug; language: string | null } | { ok: false; error: string } {
  if (!isCourseSlug(courseSlug)) {
    return { ok: false, error: 'Unsupported course slug' };
  }

  if (BILINGUAL_COURSE_SLUGS.has(courseSlug)) {
    if (!language || !SUPPORTED_LANGUAGES.has(language)) {
      return { ok: false, error: 'Invalid course language' };
    }
    return { ok: true, courseSlug, language };
  }

  if (language !== null) {
    return { ok: false, error: 'Language is not supported for this course' };
  }

  return { ok: true, courseSlug, language: null };
}

function mapProgressItem(item: { lessonId: string; completedAt: string }) {
  return {
    lessonId: item.lessonId,
    completedAt: item.completedAt,
  };
}

export const GET: APIRoute = async (context) => {
  const courseSlug = context.url.searchParams.get('courseSlug') ?? '';
  const language = normalizeLanguage(context.url.searchParams.get('language'));
  const validation = validateProgressScope(courseSlug, language);

  if (!validation.ok) {
    return jsonResponse({ error: validation.error }, 400);
  }

  try {
    const auth = await resolveLessonProgressUser(context, validation.courseSlug);
    if (!auth.ok) {
      return jsonResponse({ error: auth.error }, auth.status);
    }

    const progress = await loadLessonProgress(
      auth.user.userId,
      { courseSlug: validation.courseSlug, language: validation.language },
      context.locals.runtime.env
    );

    return jsonResponse({ progress: progress.map(mapProgressItem) });
  } catch (error) {
    console.error('[api/lesson-progress GET] Error:', error);
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
  const language = normalizeLanguage(typeof body.language === 'string' ? body.language : null);
  const lessonId = typeof body.lessonId === 'string' ? body.lessonId.trim() : '';
  const validation = validateProgressScope(courseSlug, language);

  if (!validation.ok) {
    return jsonResponse({ error: validation.error }, 400);
  }

  if (!lessonId) {
    return jsonResponse({ error: 'Invalid lesson ID' }, 400);
  }

  if (typeof body.completed !== 'boolean') {
    return jsonResponse({ error: 'Invalid completed value' }, 400);
  }

  try {
    const auth = await resolveLessonProgressUser(context, validation.courseSlug);
    if (!auth.ok) {
      return jsonResponse({ error: auth.error }, auth.status);
    }

    const progress = await setLessonCompletion(
      auth.user.userId,
      {
        courseSlug: validation.courseSlug,
        language: validation.language,
        lessonId,
        completed: body.completed,
      },
      context.locals.runtime.env
    );

    return jsonResponse({
      progress: progress
        ? { lessonId: progress.lessonId, completed: true, completedAt: progress.completedAt }
        : { lessonId, completed: false, completedAt: null },
    });
  } catch (error) {
    console.error('[api/lesson-progress PUT] Error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};
