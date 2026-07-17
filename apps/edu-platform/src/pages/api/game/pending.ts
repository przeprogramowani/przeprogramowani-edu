import type { APIContext, APIRoute } from 'astro';
import { verifyToken } from '@/server/auth';
import { getPendingGrants } from '@/server/game/serverGameStateManager';

export const GET: APIRoute = async (context: APIContext) => {
  const token = context.cookies.get('token')?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = await verifyToken(token, context.locals.runtime.env.JWT_SECRET);
  if (!payload?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const pending = await getPendingGrants(payload.email, context.locals.runtime.env);
    return new Response(JSON.stringify(pending), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/game/pending GET] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
