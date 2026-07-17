import { LESSON_CACHE_TTL_HOURS } from 'astro:env/server';
import type { LessonEntry } from '@/models/LessonEntry';
import type { TocItem } from '@/types/toc';
import { log } from '@/lib/logger';

// Cache version - increment when encoding/format changes to invalidate old cache
const CACHE_VERSION = 'v2';

interface CachedLesson {
  refreshedAt: number;
  content: LessonEntry;
  headings: TocItem[];
}

interface Env {
  PLATFORM_LESSON_CACHE?: KVNamespace;
}

/**
 * Gets the PLATFORM_LESSON_CACHE KV namespace from the environment
 * Falls back to globalThis if env is not provided (for backward compatibility)
 */
function getLessonCacheKV(env?: Env): KVNamespace | null {
  if (env?.PLATFORM_LESSON_CACHE) {
    return env.PLATFORM_LESSON_CACHE;
  }

  // @ts-expect-error PLATFORM_LESSON_CACHE is not defined in the global scope
  if (globalThis.PLATFORM_LESSON_CACHE) {
    // @ts-expect-error PLATFORM_LESSON_CACHE is not defined in the global scope
    return globalThis.PLATFORM_LESSON_CACHE;
  }

  // Return null if KV is not available (e.g., in local development)
  return null;
}

/**
 * Generates a cache key from courseId and lessonId with version prefix
 */
function getCacheKey(courseId: string, lessonId: string): string {
  return `${CACHE_VERSION}-${courseId}-${lessonId}`;
}

/**
 * Checks if the cached lesson is stale based on TTL configuration
 */
function isCacheStale(refreshedAt: number, ttlHours: number = LESSON_CACHE_TTL_HOURS): boolean {
  const ttlMs = ttlHours * 60 * 60 * 1000;
  return Date.now() - refreshedAt > ttlMs;
}

/**
 * Retrieves a lesson from the cache
 * Returns null if not found, not available, or if the cache is stale
 */
export async function getCachedLesson(
  courseId: string,
  lessonId: string,
  env?: Env
): Promise<{ lesson: LessonEntry; headings: TocItem[] } | null> {
  const cache = getLessonCacheKV(env);

  if (!cache) {
    return null;
  }

  try {
    const cacheKey = getCacheKey(courseId, lessonId);
    const cachedData = await cache.get(cacheKey);

    if (!cachedData) {
      return null;
    }

    const parsed: CachedLesson = JSON.parse(cachedData);

    // Check if cache is stale
    if (isCacheStale(parsed.refreshedAt)) {
      return null;
    }

    return { lesson: parsed.content, headings: parsed.headings };
  } catch (error) {
    console.error('Error retrieving cached lesson:', error);
    return null;
  }
}

/**
 * Stores a lesson in the cache with current timestamp
 */
export async function setCachedLesson(
  courseId: string,
  lessonId: string,
  content: LessonEntry,
  headings: TocItem[],
  env?: Env
): Promise<void> {
  const cache = getLessonCacheKV(env);

  if (!cache) {
    return;
  }

  const cacheKey = getCacheKey(courseId, lessonId);
  try {
    const cachedLesson: CachedLesson = {
      refreshedAt: Date.now(),
      content,
      headings,
    };

    await cache.put(cacheKey, JSON.stringify(cachedLesson));
    log({ level: 'info', event: 'kv.cache_write', namespace: 'PLATFORM_LESSON_CACHE', key: cacheKey });
  } catch (error) {
    log({ level: 'error', event: 'kv.cache_write_failed', namespace: 'PLATFORM_LESSON_CACHE', key: cacheKey, error: String(error) });
  }
}

/**
 * Checks if a cached lesson should be refreshed
 * Returns true if the cache exists but is stale
 */
export async function shouldRefreshCache(courseId: string, lessonId: string, env?: Env): Promise<boolean> {
  const cache = getLessonCacheKV(env);

  if (!cache) {
    return false;
  }

  try {
    const cacheKey = getCacheKey(courseId, lessonId);
    const cachedData = await cache.get(cacheKey);

    if (!cachedData) {
      return false;
    }

    const parsed: CachedLesson = JSON.parse(cachedData);
    return isCacheStale(parsed.refreshedAt);
  } catch (error) {
    console.error('Error checking cache staleness:', error);
    return false;
  }
}

/**
 * Invalidates a cached lesson by deleting it
 */
export async function invalidateCachedLesson(courseId: string, lessonId: string, env?: Env): Promise<void> {
  const cache = getLessonCacheKV(env);

  if (!cache) {
    return;
  }

  try {
    const cacheKey = getCacheKey(courseId, lessonId);
    await cache.delete(cacheKey);
  } catch (error) {
    console.error('Error invalidating cached lesson:', error);
  }
}
