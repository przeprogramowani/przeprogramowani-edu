import type { APIContext, APIRoute } from 'astro';
import { verifyToken } from '@/server/auth';
import { getUserIdByEmail, removeAvatar, uploadAvatar } from '@/server/supabase/userService';

const jsonHeaders = { 'Content-Type': 'application/json' };
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

async function resolveUserId(context: APIContext): Promise<{ userId: string } | { error: Response }> {
  const env = context.locals.runtime.env;
  const token = context.cookies.get('token')?.value;
  if (!token) {
    return { error: jsonResponse({ error: 'Unauthorized' }, 401) };
  }
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload?.email) {
    return { error: jsonResponse({ error: 'Unauthorized' }, 401) };
  }
  const userId = await getUserIdByEmail(payload.email, env);
  if (!userId) {
    return { error: jsonResponse({ error: 'Profile not found' }, 404) };
  }
  return { userId };
}

export const POST: APIRoute = async (context) => {
  const auth = await resolveUserId(context);
  if ('error' in auth) {
    return auth.error;
  }

  let formData: FormData;
  try {
    formData = await context.request.formData();
  } catch {
    return jsonResponse({ error: 'INVALID_FORM_DATA' }, 400);
  }

  const file = formData.get('avatar');
  if (!(file instanceof File)) {
    return jsonResponse({ error: 'MISSING_FILE' }, 400);
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return jsonResponse({ error: 'INVALID_TYPE' }, 400);
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return jsonResponse({ error: 'TOO_LARGE' }, 400);
  }

  try {
    const bytes = await file.arrayBuffer();
    const avatarUrl = await uploadAvatar(auth.userId, context.locals.runtime.env, bytes, file.type);
    return jsonResponse({ avatarUrl });
  } catch (error) {
    console.error('[api/profile/avatar POST] Error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};

export const DELETE: APIRoute = async (context) => {
  const auth = await resolveUserId(context);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    await removeAvatar(auth.userId, context.locals.runtime.env);
    return jsonResponse({ avatarUrl: null });
  } catch (error) {
    console.error('[api/profile/avatar DELETE] Error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};
