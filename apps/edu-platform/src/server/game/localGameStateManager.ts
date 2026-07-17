import type { GameState } from '@/explorers/state/types';

const store = new Map<string, string>();

export async function getGameState(email: string): Promise<GameState | null> {
  const raw = store.get(email.toLowerCase().trim());
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export async function setGameState(email: string, state: GameState): Promise<void> {
  store.set(email.toLowerCase().trim(), JSON.stringify(state));
}

export async function deleteGameState(email: string): Promise<void> {
  store.delete(email.toLowerCase().trim());
}
