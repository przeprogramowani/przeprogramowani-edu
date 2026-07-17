import type { CachedMembership } from './membershipTypes';
import { getExternalAuthConfig, type ExternalAuthEnv } from './externalAuthConfig';

const CACHE_VERSION = 'v1';
export const MEMBERSHIP_CACHE_KEY_PREFIX = `${CACHE_VERSION}-membership-`;
export const DEFAULT_MEMBERSHIP_FRESHNESS_HOURS = 24 * 60; // 60 days
const DEFAULT_MEMBERSHIP_RETENTION_HOURS = 24 * 90; // 90 days

/**
 * Generates a cache key for membership data
 */
export function getCacheKey(platform: string, spaceId: number, email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  return `${MEMBERSHIP_CACHE_KEY_PREFIX}${platform}-${spaceId}-${normalizedEmail}`;
}

/**
 * Gets the CIRCLE_MEMBERS KV namespace from the environment
 */
function getMembersKV(env: ExternalAuthEnv): KVNamespace | null {
  return env.CIRCLE_MEMBERS || null;
}

/**
 * Retrieves cached membership data for a user in a course
 *
 * @param email - User's email address
 * @param courseId - Course identifier
 * @param env - Environment variables
 * @returns Cached membership data or null if not found
 */
export async function getCachedMembership(
  email: string,
  courseId: string,
  env: ExternalAuthEnv
): Promise<CachedMembership | null> {
  const config = getExternalAuthConfig(courseId);
  if (!config) return null;

  const cache = getMembersKV(env);
  if (!cache) return null;

  const key = getCacheKey(config.platform, config.spaceId, email);

  try {
    const data = await cache.get(key);
    if (!data) return null;

    const cached: CachedMembership = JSON.parse(data);
    return cached;
  } catch (error) {
    console.error('Error retrieving cached membership:', error);
    return null;
  }
}

/**
 * Stores membership data in the cache
 *
 * @param email - User's email address
 * @param courseId - Course identifier
 * @param membership - Membership data to cache
 * @param env - Environment variables
 */
export async function setCachedMembership(
  email: string,
  courseId: string,
  membership: CachedMembership,
  env: ExternalAuthEnv
): Promise<void> {
  const config = getExternalAuthConfig(courseId);
  if (!config) return;

  const cache = getMembersKV(env);
  if (!cache) return;

  const key = getCacheKey(config.platform, config.spaceId, email);
  const freshnessHours = env.EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS || DEFAULT_MEMBERSHIP_FRESHNESS_HOURS;
  const retentionHours = env.EXTERNAL_MEMBERSHIP_CACHE_RETENTION_HOURS || DEFAULT_MEMBERSHIP_RETENTION_HOURS;
  const ttlHours = Math.max(freshnessHours, retentionHours);

  try {
    await cache.put(key, JSON.stringify(membership), {
      expirationTtl: ttlHours * 60 * 60,
    });
  } catch (error) {
    console.error('Error storing membership in cache:', error);
  }
}

/**
 * Invalidates cached membership data for a user in a course
 *
 * @param email - User's email address
 * @param courseId - Course identifier
 * @param env - Environment variables
 */
export async function invalidateCachedMembership(
  email: string,
  courseId: string,
  env: ExternalAuthEnv
): Promise<void> {
  const config = getExternalAuthConfig(courseId);
  if (!config) return;

  const cache = getMembersKV(env);
  if (!cache) return;

  const key = getCacheKey(config.platform, config.spaceId, email);

  try {
    await cache.delete(key);
  } catch (error) {
    console.error('Error invalidating cached membership:', error);
  }
}

/**
 * Checks if cached membership data is stale
 *
 * @param cached - Cached membership data
 * @param freshnessHours - Cache freshness window in hours (defaults to 60 days)
 * @returns True if cache is stale and should be refreshed
 */
export function isMembershipCacheStale(
  cached: CachedMembership,
  freshnessHours: number = DEFAULT_MEMBERSHIP_FRESHNESS_HOURS
): boolean {
  const ttlMs = freshnessHours * 60 * 60 * 1000;
  return Date.now() - cached.verifiedAt > ttlMs;
}
