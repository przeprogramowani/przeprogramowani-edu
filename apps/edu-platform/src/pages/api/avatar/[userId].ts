import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/server/supabase/client';

const AVATAR_BUCKET = 'avatars';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function emptyResponse(status: number): Response {
  return new Response(null, { status });
}

export const GET: APIRoute = async (context) => {
  const userId = context.params.userId;
  if (!userId || !UUID_REGEX.test(userId)) {
    return emptyResponse(400);
  }

  const env = context.locals.runtime.env;
  const supabase = getSupabaseAdmin(env);

  try {
    const { data, error } = await supabase.storage.from(AVATAR_BUCKET).download(userId);
    if (error || !data) {
      // Supabase Storage signals "object not found" as HTTP 400 from the underlying
      // REST endpoint with body `{"statusCode":"404",...}`. The JS SDK surfaces this
      // as either a StorageApiError with `message: 'Object not found'`, or — when the
      // body fails to parse — a StorageUnknownError carrying `originalError.status: 400`.
      // Either signal counts as 404 for the proxy.
      const message = error && typeof error.message === 'string' ? error.message.toLowerCase() : '';
      const originalStatus = (error as { originalError?: { status?: number } } | null)?.originalError
        ?.status;
      const isNotFound =
        message.includes('not found') ||
        message.includes('object_not_found') ||
        originalStatus === 400 ||
        originalStatus === 404;
      if (isNotFound) {
        return emptyResponse(404);
      }
      console.error('[api/avatar GET] download failed', { userId, err: error });
      return emptyResponse(502);
    }

    const contentType = data.type && data.type.length > 0 ? data.type : 'application/octet-stream';
    return new Response(data.stream(), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[api/avatar GET] download failed', { userId, err });
    return emptyResponse(502);
  }
};
