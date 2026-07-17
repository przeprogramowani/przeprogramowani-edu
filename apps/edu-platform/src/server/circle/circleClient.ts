import { Lesson, getTokenForPlatform } from '@edu/circle';
import { getPlatformForCourse } from './course-config';
import { CourseSlug } from '@/models/CollectionMappings';
import { LessonEntry } from '@/models/LessonEntry';
import { processHtmlForDisplay } from './process-for-display';
import { getCachedLesson, setCachedLesson } from './lessonCache';
import type { TocItem } from '@/types/toc';
import { log } from '@/lib/logger';

const API_URL = 'https://app.circle.so';

const headers = (token: string) => ({
  Authorization: `Token ${token}`,
});

interface Env {
  PLATFORM_LESSON_CACHE?: KVNamespace;
}

/**
 * Fetches lesson content from Circle API
 * @throws Error if course platform is not configured or token is missing
 */
async function fetchLessonFromCircle(
  courseId: CourseSlug,
  lessonId: string
): Promise<{ lesson: LessonEntry; headings: TocItem[] }> {
  const platform = getPlatformForCourse(courseId);
  const token = getTokenForPlatform(platform);

  if (!token) {
    throw new Error(`No API token available for platform ${platform} (course: ${courseId})`);
  }

  const start = Date.now();
  // Use native fetch instead of axios for better UTF-8 handling in Cloudflare Workers
  const response = await fetch(`${API_URL}/api/admin/v2/course_lessons/${lessonId}`, {
    method: 'GET',
    headers: headers(token),
  });

  if (!response.ok) {
    log({ level: 'error', event: 'circle.api_error', status: response.status, courseId, lessonId, duration_ms: Date.now() - start });
    throw new Error(`Failed to fetch lesson: ${response.status} ${response.statusText}`);
  }

  log({ level: 'info', event: 'circle.api_success', courseId, lessonId, duration_ms: Date.now() - start });

  // .text() properly decodes UTF-8 in Cloudflare Workers
  const textContent = await response.text();
  const lesson: Lesson = JSON.parse(textContent);

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  const { html, headings } = processHtmlForDisplay(lesson.body_html, lesson.name);

  const lessonEntry: LessonEntry = {
    id: lesson.id.toString(),
    data: {
      id: lesson.id.toString(),
      name: lesson.name,
      content: html,
    },
  };

  return { lesson: lessonEntry, headings };
}

/**
 * Gets lesson content with caching support
 *
 * 1. First checks if the lesson is in cache and not stale
 * 2. If cached and fresh, returns cached version and re-extracts headings
 * 3. If not cached or stale, fetches from Circle API and updates cache
 *
 * Note on background refresh:
 * - Background refresh is disabled because it doesn't work reliably in Cloudflare Workers
 * - Stale content returns null, forcing a fresh fetch (user waits but gets fresh data)
 * - This ensures cache is always up-to-date when users access lessons
 *
 * @param courseId - The course slug identifier
 * @param lessonId - The lesson identifier
 * @param env - Optional environment context with KV namespace
 * @returns Object containing lesson entry and TOC headings
 */
export async function getLessonContent(
  courseId: CourseSlug,
  lessonId: string,
  env?: Env
): Promise<{ lesson: LessonEntry; headings: TocItem[] }> {
  // Try to get from cache first
  const cachedData = await getCachedLesson(courseId, lessonId, env);

  if (cachedData) {
    log({ level: 'info', event: 'kv.cache_hit', namespace: 'PLATFORM_LESSON_CACHE', key: `${courseId}-${lessonId}` });
    return cachedData;
  }

  log({ level: 'info', event: 'kv.cache_miss', namespace: 'PLATFORM_LESSON_CACHE', key: `${courseId}-${lessonId}` });

  // Cache miss or stale - fetch from Circle API
  const { lesson: freshLesson, headings } = await fetchLessonFromCircle(courseId, lessonId);

  // Store in cache with headings - await to ensure write completes before request ends
  await setCachedLesson(courseId, lessonId, freshLesson, headings, env);

  return { lesson: freshLesson, headings };
}
