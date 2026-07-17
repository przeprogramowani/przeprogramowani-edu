import type { GameState } from '@/explorers/state/types';

const CACHE_VERSION = 'v1';
const TTL_SECONDS = 365 * 24 * 60 * 60; // 1 year

interface GameStateEnv {
  GAME_STATE: KVNamespace;
}

function getKey(email: string): string {
  return `${CACHE_VERSION}-game-state-${email.toLowerCase().trim()}`;
}

function getKV(env: GameStateEnv): KVNamespace | null {
  return env.GAME_STATE || null;
}

export async function getGameState(email: string, env: GameStateEnv): Promise<GameState | null> {
  const kv = getKV(env);
  if (!kv) return null;
  try {
    const data = await kv.get(getKey(email));
    if (!data) return null;
    return JSON.parse(data) as GameState;
  } catch (error) {
    console.error('[GameState] Error reading from KV:', error);
    return null;
  }
}

export async function setGameState(
  email: string,
  state: GameState,
  env: GameStateEnv
): Promise<void> {
  const kv = getKV(env);
  if (!kv) return;
  try {
    await kv.put(getKey(email), JSON.stringify(state), { expirationTtl: TTL_SECONDS });
  } catch (error) {
    console.error('[GameState] Error writing to KV:', error);
  }
}

export async function deleteGameState(email: string, env: GameStateEnv): Promise<void> {
  const kv = getKV(env);
  if (!kv) return;
  try {
    await kv.delete(getKey(email));
  } catch (error) {
    console.error('[GameState] Error deleting from KV:', error);
  }
}
