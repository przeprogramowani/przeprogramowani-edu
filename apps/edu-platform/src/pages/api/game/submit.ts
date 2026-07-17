import type { APIContext, APIRoute } from 'astro';
import {
  TEN_X_DEVS_GAME_FINISHED_GROUP_ID,
  TEN_X_DEVS_MAILERLITE_API_KEY,
} from 'astro:env/server';
import { resolveTokenToEmail } from '@/server/game/apiTokenManager';
import {
  loadGameState,
  getPendingGrants,
  appendPendingGrant,
} from '@/server/game/serverGameStateManager';
import { kvRateLimit, rateLimitHeaders } from '@/server/kvRateLimiter';
import { getAllQuests } from '@/explorers/levels/index';
import type { ApiAnswerQuest } from '@/explorers/systems/QuestManager';
import { localized } from '@/explorers/i18n/types';
import { assignSubscriberToGroup } from '@/server/newsletter';
import { log } from '@/lib/logger';

const GAME_FINISHED_QUEST_ID = 'q-earth-signal';

async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const POST: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;

  // Auth
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

  // Rate limiting (PROD only — KV not available locally)
  if (env.ENV === 'PROD' && env.GAME_API_TOKENS) {
    const ip = context.request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const tokenHash = await sha256hex(rawToken);

    const ipResult = await kvRateLimit(env.GAME_API_TOKENS, `ip:${ip}`, 60, 60);
    const tokenResult = await kvRateLimit(env.GAME_API_TOKENS, `tok:${tokenHash}`, 20, 3600);

    if (!ipResult.allowed || !tokenResult.allowed) {
      const binding = !ipResult.allowed ? ipResult : tokenResult;
      const limit = !ipResult.allowed ? 60 : 20;
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...rateLimitHeaders(binding, limit) },
      });
    }
  }

  // Parse body
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { quest_id, answer } = body as { quest_id?: string; answer?: string };
  if (!quest_id || typeof answer !== 'string') {
    return new Response(JSON.stringify({ error: 'Missing quest_id or answer' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Load game state
  const state = await loadGameState(email, env);
  if (!state) {
    return new Response(JSON.stringify({ error: 'Game state not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Idempotency check — quest already applied to saved state
  if (state.quests.completed.includes(quest_id)) {
    return new Response(
      JSON.stringify({ accepted: true, already_completed: true, message: 'Misja już zaliczona.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Idempotency check — quest already queued in pending grants
  const pending = await getPendingGrants(email, env);
  if (pending.some((g) => g.quest_id === quest_id)) {
    return new Response(
      JSON.stringify({ accepted: true, already_completed: true, message: 'Misja już zaliczona.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Quest lookup (server-side manifest — includes answerHash)
  const quest = getAllQuests().get(quest_id);
  if (!quest || quest.completionType !== 'api-answer') {
    return new Response(
      JSON.stringify({ error: 'Quest not found or not externally submittable' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiQuest = quest as ApiAnswerQuest;
  const candidateHash = await sha256hex(answer.trim().toLowerCase());

  if (candidateHash !== apiQuest.answerHash) {
    return new Response(
      JSON.stringify({ accepted: false, hint: localized(apiQuest.hint) }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Correct answer — publish grant to pending queue (browser applies on next boot)
  await appendPendingGrant(email, {
    id: crypto.randomUUID(),
    quest_id,
    questTitle: localized(apiQuest.title),
    xp: apiQuest.rewards.xp ?? 0,
    flags: apiQuest.rewards.flags,
    timestamp: Date.now(),
  }, env);

  if (quest_id === GAME_FINISHED_QUEST_ID) {
    if (TEN_X_DEVS_MAILERLITE_API_KEY && TEN_X_DEVS_GAME_FINISHED_GROUP_ID) {
      const nlPromise = assignSubscriberToGroup(
        email,
        TEN_X_DEVS_MAILERLITE_API_KEY,
        TEN_X_DEVS_GAME_FINISHED_GROUP_ID
      ).catch((err) => log({ level: 'error', event: 'game.newsletter_assign_failed', quest_id, error: String(err) }));
      context.locals.runtime.ctx.waitUntil(nlPromise);
      log({ level: 'info', event: 'game.finished_group_queued', quest_id });
    }
  }

  log({ level: 'info', event: 'game.quest_completed', quest_id, xp: apiQuest.rewards.xp ?? 0 });

  return new Response(
    JSON.stringify({
      accepted: true,
      xp: apiQuest.rewards.xp ?? 0,
      flags: apiQuest.rewards.flags,
      message: 'Misja zaliczona! Dobra robota, Navigatorze!',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
