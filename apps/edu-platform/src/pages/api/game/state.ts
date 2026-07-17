import type { APIContext, APIRoute } from 'astro';
import { verifyToken } from '@/server/auth';
import {
  loadGameState,
  saveGameState,
  deleteGameState,
  getPendingGrants,
  clearAppliedGrants,
} from '@/server/game/serverGameStateManager';
import { getCachedSystemFlags } from '@/server/game/systemFlagsCache';
import type { GameState } from '@/explorers/state/types';
import { log } from '@/lib/logger';

function isValidGameState(body: unknown): body is GameState {
  if (typeof body !== 'object' || body === null) return false;
  const s = body as Record<string, unknown>;
  const pos = s.position as Record<string, unknown> | undefined;
  const quests = s.quests as Record<string, unknown> | undefined;
  return (
    s.version === 2 &&
    Array.isArray(s.flags) &&
    typeof s.currentMap === 'string' &&
    typeof pos === 'object' &&
    pos !== null &&
    typeof pos.x === 'number' &&
    typeof pos.y === 'number' &&
    typeof s.xp === 'number' &&
    Array.isArray(s.commandHistory) &&
    typeof quests === 'object' &&
    quests !== null &&
    typeof quests.active !== 'undefined' &&
    Array.isArray(quests.completed) &&
    Array.isArray(s.bookmarks)
  );
}

async function getEmailFromRequest(context: APIContext): Promise<string | null> {
  const token = context.cookies.get('token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token, context.locals.runtime.env.JWT_SECRET);
  return payload?.email ?? null;
}

export const GET: APIRoute = async (context: APIContext) => {
  const email = await getEmailFromRequest(context);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const [state, pending, systemFlags] = await Promise.all([
      loadGameState(email, context.locals.runtime.env),
      getPendingGrants(email, context.locals.runtime.env),
      getCachedSystemFlags(context.locals.runtime.env),
    ]);
    log({ level: 'info', event: 'game.state_loaded', hasState: !!state, pendingCount: pending.length });
    return new Response(JSON.stringify({ state, pending, systemFlags }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    log({ level: 'error', event: 'game.state_load_failed', error: String(error) });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async (context: APIContext) => {
  const email = await getEmailFromRequest(context);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await deleteGameState(email, context.locals.runtime.env);
    log({ level: 'info', event: 'game.state_deleted' });
    return new Response(null, { status: 204 });
  } catch (error) {
    log({ level: 'error', event: 'game.state_delete_failed', error: String(error) });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async (context: APIContext) => {
  const email = await getEmailFromRequest(context);
  if (!email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const wrapped = body as { state?: unknown; appliedGrantIds?: string[] };
  const gameState = wrapped.state ?? body;
  const appliedGrantIds: string[] = Array.isArray(wrapped.appliedGrantIds)
    ? wrapped.appliedGrantIds
    : [];

  if (!isValidGameState(gameState)) {
    return new Response(JSON.stringify({ error: 'Invalid game state shape' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await saveGameState(email, gameState, context.locals.runtime.env);
    if (appliedGrantIds.length > 0) {
      await clearAppliedGrants(email, appliedGrantIds, context.locals.runtime.env);
    }
    log({ level: 'info', event: 'game.state_saved', appliedGrants: appliedGrantIds.length });
    return new Response(null, { status: 204 });
  } catch (error) {
    log({ level: 'error', event: 'game.state_save_failed', error: String(error) });
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
