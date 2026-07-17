import type { GameState, PendingGrant } from '@/explorers/state/types';
import * as local from './localGameStateManager';
import * as remote from './remoteGameStateKV';
import * as localPending from './localGameStatePending';
import * as remotePending from './remoteGameStatePending';
import * as supabaseGame from '@/server/supabase/gameSyncService';
import { getUserIdByEmail } from '@/server/supabase/userService';

export async function loadGameState(email: string, env: any): Promise<GameState | null> {
  if (env.ENV === 'PROD') {
    return remote.getGameState(email, env);
  }
  return local.getGameState(email);
}

export async function deleteGameState(email: string, env: any): Promise<void> {
  if (env.ENV === 'PROD') {
    await remote.deleteGameState(email, env);
  } else {
    await local.deleteGameState(email);
  }

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    getUserIdByEmail(email, env)
      .then((userId) => {
        if (userId) {
          return supabaseGame.deleteGameState(userId, env);
        }
      })
      .catch((err) =>
        console.error('[serverGameStateManager] Supabase game delete failed:', err)
      );
  }
}

export async function getPendingGrants(email: string, env: any): Promise<PendingGrant[]> {
  if (env.ENV === 'PROD') {
    return remotePending.getPendingGrants(email, env);
  }
  return localPending.getPendingGrants(email);
}

export async function appendPendingGrant(
  email: string,
  grant: PendingGrant,
  env: any
): Promise<void> {
  if (env.ENV === 'PROD') {
    return remotePending.appendPendingGrant(email, grant, env);
  }
  return localPending.appendPendingGrant(email, grant);
}

export async function clearAppliedGrants(
  email: string,
  ids: string[],
  env: any
): Promise<void> {
  if (env.ENV === 'PROD') {
    return remotePending.clearAppliedGrants(email, ids, env);
  }
  return localPending.clearAppliedGrants(email, ids);
}

export async function saveGameState(email: string, state: GameState, env: any): Promise<void> {
  // Write to KV first (primary, fast)
  if (env.ENV === 'PROD') {
    await remote.setGameState(email, state, env);
  } else {
    await local.setGameState(email, state);
  }

  // Write to Supabase async (durable backup, non-blocking)
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
    getUserIdByEmail(email, env)
      .then((userId) => {
        if (userId) {
          return supabaseGame.saveGameState(userId, state, env);
        }
      })
      .catch((err) => console.error('[serverGameStateManager] Supabase game sync failed:', err));
  }
}
