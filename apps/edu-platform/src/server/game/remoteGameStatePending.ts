import type { PendingGrant } from '@/explorers/state/types';

const CACHE_VERSION = 'v1';
const TTL_SECONDS = 365 * 24 * 60 * 60;

interface GameStateEnv {
  GAME_STATE: KVNamespace;
}

function getPendingKey(email: string): string {
  return `${CACHE_VERSION}-game-pending-${email.toLowerCase().trim()}`;
}

function getKV(env: GameStateEnv): KVNamespace | null {
  return env.GAME_STATE || null;
}

export async function getPendingGrants(
  email: string,
  env: GameStateEnv
): Promise<PendingGrant[]> {
  const kv = getKV(env);
  if (!kv) return [];
  try {
    const data = await kv.get(getPendingKey(email));
    if (!data) return [];
    return JSON.parse(data) as PendingGrant[];
  } catch {
    return [];
  }
}

export async function appendPendingGrant(
  email: string,
  grant: PendingGrant,
  env: GameStateEnv
): Promise<void> {
  const kv = getKV(env);
  if (!kv) return;
  try {
    const existing = await getPendingGrants(email, env);
    if (existing.some((g) => g.quest_id === grant.quest_id)) return;
    const updated = [...existing, grant];
    await kv.put(getPendingKey(email), JSON.stringify(updated), {
      expirationTtl: TTL_SECONDS,
    });
  } catch (error) {
    console.error('[GamePending] Error appending pending grant:', error);
  }
}

export async function clearAppliedGrants(
  email: string,
  ids: string[],
  env: GameStateEnv
): Promise<void> {
  if (ids.length === 0) return;
  const kv = getKV(env);
  if (!kv) return;
  try {
    const existing = await getPendingGrants(email, env);
    const remaining = existing.filter((g) => !ids.includes(g.id));
    if (remaining.length === 0) {
      await kv.delete(getPendingKey(email));
    } else {
      await kv.put(getPendingKey(email), JSON.stringify(remaining), {
        expirationTtl: TTL_SECONDS,
      });
    }
  } catch (error) {
    console.error('[GamePending] Error clearing applied grants:', error);
  }
}
