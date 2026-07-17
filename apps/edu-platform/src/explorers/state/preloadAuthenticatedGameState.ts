import {
  loadState,
  mergeServerProgressIntoLocal,
  saveState,
  setPreloadedState,
  setPreloadedSystemFlags,
} from './GameStateManager';
import type { GameFlag } from '../config/flags';
import type { GameState, PendingGrant } from './types';

export const GAME_STATE_ENDPOINT = '/api/game/state';

type GameStateResponse = {
  state: GameState | null;
  pending: PendingGrant[];
  systemFlags?: GameFlag[];
};

type FetchLike = typeof fetch;

export function applyPendingGrants(state: GameState, pending: PendingGrant[]): GameState {
  if (pending.length === 0) return state;
  let result = { ...state };
  for (const grant of pending) {
    result = {
      ...result,
      xp: result.xp + grant.xp,
      flags: [...new Set([...result.flags, ...grant.flags])],
      quests: {
        ...result.quests,
        active: result.quests.active === grant.quest_id ? null : result.quests.active,
        completed: result.quests.completed.includes(grant.quest_id)
          ? result.quests.completed
          : [...result.quests.completed, grant.quest_id],
      },
    };
  }
  return result;
}

export function shouldFlushBootState(
  pending: PendingGrant[],
  consumedPositionReset: boolean
): boolean {
  return pending.length > 0 || consumedPositionReset;
}

async function flushBootState(
  fetchFn: FetchLike,
  state: GameState,
  pending: PendingGrant[]
): Promise<void> {
  await fetchFn(GAME_STATE_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      state,
      appliedGrantIds: pending.map((g) => g.id),
    }),
  });
}

export async function preloadAuthenticatedGameState(fetchFn: FetchLike = fetch): Promise<void> {
  const localState = loadState();
  const res = await fetchFn(GAME_STATE_ENDPOINT);
  if (!res.ok) return;

  const { state: serverState, pending, systemFlags } = (await res.json()) as GameStateResponse;
  if (systemFlags?.length) {
    setPreloadedSystemFlags(systemFlags);
  }
  if (!serverState) return;

  const consumedPositionReset = serverState.needsPositionReset === true;
  const baseState = mergeServerProgressIntoLocal(localState, serverState);
  const mergedState = applyPendingGrants(baseState, pending);

  setPreloadedState(mergedState);
  saveState(mergedState);

  if (shouldFlushBootState(pending, consumedPositionReset)) {
    await flushBootState(fetchFn, mergedState, pending);
  }
}
