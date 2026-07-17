import { Platform, getTokenForPlatform } from '@edu/circle';
import { transformIframes } from './process-for-display';
import { getCachedLesson, setCachedLesson } from './lessonCache';
import { log } from '@/lib/logger';

const API_URL = 'https://app.circle.so';

/**
 * Synthetic course id used only as a cache namespace key for Brave community
 * posts (reuses PLATFORM_LESSON_CACHE via lessonCache helpers).
 */
const CACHE_NAMESPACE = 'brave-post';

const headers = (token: string) => ({
  Authorization: `Token ${token}`,
});

interface Env {
  PLATFORM_LESSON_CACHE?: KVNamespace;
}

export interface CirclePost {
  /** Post title as set in Circle. */
  name: string;
  /** Rendered, display-ready HTML body of the post. */
  html: string;
  /** Canonical Circle URL of the post (for a "read on Circle" fallback link). */
  url: string;
}

/**
 * Shape of the admin v2 single-post response we rely on. Circle returns many
 * more fields; we only type what we read. The rich-text body is nested:
 * `body` is a trix record whose `.body` holds the HTML string.
 */
interface CirclePostResponse {
  name: string;
  url: string;
  body?: { body?: string } | null;
}

/**
 * Fetches a single community post from the Brave Circle community and returns
 * its display-ready HTML. Used to surface an existing Circle post (e.g. the
 * certification rules from the "Informacje i ogłoszenia [10X3]" channel) on a
 * public portal page without duplicating the content by hand.
 *
 * Caching mirrors lessons (PLATFORM_LESSON_CACHE, TTL from LESSON_CACHE_TTL_HOURS)
 * so a public page does not hit the Circle API on every request. On any failure
 * the function returns null so the caller can render a graceful fallback rather
 * than error the whole page.
 */
export async function getCirclePost(postId: string, env?: Env): Promise<CirclePost | null> {
  const cached = await getCachedLesson(CACHE_NAMESPACE, postId, env);
  if (cached) {
    log({ level: 'info', event: 'kv.cache_hit', namespace: 'PLATFORM_LESSON_CACHE', key: `${CACHE_NAMESPACE}-${postId}` });
    return { name: cached.lesson.data.name, html: cached.lesson.data.content, url: cached.lesson.data.id };
  }

  const token = getTokenForPlatform(Platform.CIRCLE_BRAVE);
  if (!token) {
    log({ level: 'error', event: 'circle.post_no_token', postId });
    return null;
  }

  const start = Date.now();
  try {
    // Native fetch + .text() for correct UTF-8 decoding in Cloudflare Workers.
    // Bounded timeout so a slow Circle never hangs SSR of the public page.
    const response = await fetch(`${API_URL}/api/admin/v2/posts/${postId}`, {
      method: 'GET',
      headers: headers(token),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      log({ level: 'error', event: 'circle.post_api_error', status: response.status, postId, duration_ms: Date.now() - start });
      return null;
    }

    const post: CirclePostResponse = JSON.parse(await response.text());
    const rawHtml = post.body?.body;
    if (!rawHtml) {
      log({ level: 'error', event: 'circle.post_empty_body', postId });
      return null;
    }

    log({ level: 'info', event: 'circle.post_api_success', postId, duration_ms: Date.now() - start });

    const html = transformIframes(rawHtml);
    const result: CirclePost = { name: post.name, html, url: post.url };

    // Reuse the lesson cache shape: id carries the canonical URL so a cache hit
    // can reconstruct the full CirclePost without a second field.
    await setCachedLesson(
      CACHE_NAMESPACE,
      postId,
      { id: post.url, data: { id: post.url, name: post.name, content: html } },
      [],
      env
    );

    return result;
  } catch (error) {
    log({ level: 'error', event: 'circle.post_fetch_failed', postId, error: String(error), duration_ms: Date.now() - start });
    return null;
  }
}
