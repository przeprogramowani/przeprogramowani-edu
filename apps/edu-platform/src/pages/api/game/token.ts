import type { APIContext, APIRoute } from 'astro';
import { verifyToken } from '@/server/auth';
import { getOrCreateToken, regenerateToken } from '@/server/game/apiTokenManager';
import { getSupabaseAdmin } from '@/server/supabase/client';

export const GET: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;

  // Authenticate via session cookie
  const sessionToken = context.cookies.get('token')?.value;
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const payload = await verifyToken(sessionToken, env.JWT_SECRET);
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email } = payload;
  const supabase = getSupabaseAdmin(env);

  // Lookup user profile (needed for access_grants check)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check explorers access grant
  const { data: accessGrant } = await supabase
    .from('access_grants')
    .select('id')
    .eq('user_id', profile.id)
    .eq('course_slug', 'explorers')
    .maybeSingle();

  if (!accessGrant) {
    return new Response(JSON.stringify({ error: 'Forbidden: explorers access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await getOrCreateToken(email, env as any);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/game/token GET] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;

  const sessionToken = context.cookies.get('token')?.value;
  if (!sessionToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const payload = await verifyToken(sessionToken, env.JWT_SECRET);
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email } = payload;
  const supabase = getSupabaseAdmin(env);

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: accessGrant } = await supabase
    .from('access_grants')
    .select('id')
    .eq('user_id', profile.id)
    .eq('course_slug', 'explorers')
    .maybeSingle();

  if (!accessGrant) {
    return new Response(JSON.stringify({ error: 'Forbidden: explorers access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await regenerateToken(email, env as any);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/game/token POST] Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
