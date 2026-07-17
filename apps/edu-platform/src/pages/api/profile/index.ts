import type { APIContext, APIRoute } from 'astro';
import { verifyToken } from '@/server/auth';
import { getUserIdByEmail, updateProfile } from '@/server/supabase/userService';

const jsonHeaders = { 'Content-Type': 'application/json' };
const NAME_MAX_LENGTH = 60;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

function normalizeName(value: unknown): { ok: true; value: string | null } | { ok: false } {
  if (value === null || value === undefined) {
    return { ok: true, value: null };
  }
  if (typeof value !== 'string') {
    return { ok: false };
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { ok: true, value: null };
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return { ok: false };
  }
  return { ok: true, value: trimmed };
}

export const PUT: APIRoute = async (context) => {
  const auth = await resolveUserId(context);
  if ('error' in auth) {
    return auth.error;
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!isObject(body)) {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const firstName = normalizeName(body.firstName);
  if (!firstName.ok) {
    return jsonResponse({ error: 'INVALID_FIRST_NAME' }, 400);
  }

  const lastName = normalizeName(body.lastName);
  if (!lastName.ok) {
    return jsonResponse({ error: 'INVALID_LAST_NAME' }, 400);
  }

  try {
    const result = await updateProfile(auth.userId, context.locals.runtime.env, {
      firstName: firstName.value,
      lastName: lastName.value,
    });
    return jsonResponse(result);
  } catch (error) {
    console.error('[api/profile PUT] Error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};
