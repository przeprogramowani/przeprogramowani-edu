import type { APIContext, APIRoute } from 'astro';
import { resolveTokenToEmail } from '@/server/game/apiTokenManager';
import { loadGameState } from '@/server/game/serverGameStateManager';
import { getAllQuests } from '@/explorers/levels/index';

export const GET: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;

  const authHeader = context.request.headers.get('Authorization');
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!rawToken) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const email = await resolveTokenToEmail(rawToken, env as any);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const state = await loadGameState(email, env);
  if (!state?.quests.active) {
    return new Response(JSON.stringify({ error: 'No active mission' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const quest = getAllQuests().get(state.quests.active);
  if (!quest || quest.completionType !== 'api-answer') {
    return new Response(
      JSON.stringify({ error: 'Active quest does not support external submission' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      mission: {
        quest_id: quest.id,
        title: quest.title,
        briefing: quest.briefing,
        hint: quest.hint,
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
