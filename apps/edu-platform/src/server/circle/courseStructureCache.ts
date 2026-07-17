import type { CourseStructure } from './courseStructureTypes';
import { fetchCourseStructure } from './courseStructureApi';
import type { ExternalAuthEnv } from './externalAuthConfig';

// Cache version - increment when structure format changes to invalidate old cache
const CACHE_VERSION = 'v2';

// 30 days TTL - course structure changes very rarely
const DEFAULT_STRUCTURE_TTL_DAYS = 30;

interface Env extends ExternalAuthEnv {
  PLATFORM_LESSON_CACHE?: KVNamespace;
}

/**
 * Generates a cache key for course structure
 */
function getCacheKey(courseId: string): string {
  return `${CACHE_VERSION}-course-structure-${courseId}`;
}

/**
 * Gets the PLATFORM_LESSON_CACHE KV namespace from the environment
 */
function getStructureCacheKV(env: Env): KVNamespace | null {
  if (env?.PLATFORM_LESSON_CACHE) {
    return env.PLATFORM_LESSON_CACHE;
  }

  // @ts-expect-error PLATFORM_LESSON_CACHE is not defined in the global scope
  if (globalThis.PLATFORM_LESSON_CACHE) {
    // @ts-expect-error PLATFORM_LESSON_CACHE is not defined in the global scope
    return globalThis.PLATFORM_LESSON_CACHE;
  }

  return null;
}

/**
 * Checks if the cached structure is stale based on TTL
 */
function isCacheStale(cachedAt: number, ttlDays: number = DEFAULT_STRUCTURE_TTL_DAYS): boolean {
  const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
  return Date.now() - cachedAt > ttlMs;
}

/**
 * Retrieves cached course structure
 *
 * @param courseId - Course identifier
 * @param env - Environment variables
 * @returns Cached course structure or null if not found/stale
 */
export async function getCachedCourseStructure(
  courseId: string,
  env: Env
): Promise<CourseStructure | null> {
  const cache = getStructureCacheKV(env);
  if (!cache) {
    return null;
  }

  try {
    const cacheKey = getCacheKey(courseId);
    const cachedData = await cache.get(cacheKey);

    if (!cachedData) {
      return null;
    }

    const structure: CourseStructure = JSON.parse(cachedData);

    // Check if cache is stale
    if (isCacheStale(structure.cachedAt)) {
      return null;
    }

    return structure;
  } catch (error) {
    console.error('Error retrieving cached course structure:', error);
    return null;
  }
}

/**
 * Stores course structure in the cache
 *
 * @param courseId - Course identifier
 * @param structure - Course structure to cache
 * @param env - Environment variables
 */
export async function setCachedCourseStructure(
  courseId: string,
  structure: CourseStructure,
  env: Env
): Promise<void> {
  const cache = getStructureCacheKV(env);
  if (!cache) {
    return;
  }

  try {
    const cacheKey = getCacheKey(courseId);
    // Store with TTL matching our check (plus a small buffer)
    const ttlSeconds = (DEFAULT_STRUCTURE_TTL_DAYS + 1) * 24 * 60 * 60;

    await cache.put(cacheKey, JSON.stringify(structure), {
      expirationTtl: ttlSeconds,
    });
  } catch (error) {
    console.error('Error storing course structure in cache:', error);
  }
}

/**
 * Invalidates cached course structure
 *
 * @param courseId - Course identifier
 * @param env - Environment variables
 */
export async function invalidateCachedCourseStructure(courseId: string, env: Env): Promise<void> {
  const cache = getStructureCacheKV(env);
  if (!cache) {
    return;
  }

  try {
    const cacheKey = getCacheKey(courseId);
    await cache.delete(cacheKey);
  } catch (error) {
    console.error('Error invalidating cached course structure:', error);
  }
}

/**
 * Gets course structure with cache-first strategy
 *
 * Attempts to retrieve from cache first, fetches from API if not cached
 * or cache is stale, then caches the fresh data.
 *
 * @param courseId - Course identifier
 * @param env - Environment variables
 * @returns Course structure (from cache or freshly fetched)
 */
export async function getCourseStructure(courseId: string, env: Env): Promise<CourseStructure> {
  // Try cache first
  const cached = await getCachedCourseStructure(courseId, env);
  if (cached) {
    return cached;
  }

  // Fetch fresh data from Circle API
  const structure = await fetchCourseStructure(courseId, env);

  // Cache the fresh data (fire and forget)
  setCachedCourseStructure(courseId, structure, env).catch((error) => {
    console.error('Error caching course structure:', error);
  });

  return structure;
}
