import type { GameFlag } from '../config/flags';
import type Phaser from 'phaser';
import { GameEvents } from '../events/GameEvents';
import { devLog } from '../utils/logger';
import type { GameState } from './types';

const STATE_KEY = 'demoGameState';

/** Set a game flag. Returns true if the flag was newly added, false if already present. */
export function setFlag(game: Phaser.Game, flag: GameFlag): boolean {
  if (flag.startsWith('sys:')) {
    devLog(`[Flag] Rejected sys: flag "${flag}" — system flags are read-only`);
    return false;
  }
  const state = game.registry.get(STATE_KEY) as GameState;
  if (state.flags.includes(flag)) return false;

  const next: GameState = { ...state, flags: [...state.flags, flag] };
  game.registry.set(STATE_KEY, next);
  game.events.emit(GameEvents.STATE_CHANGED, { state: next });
  game.events.emit(GameEvents.FLAG_SET, { flag });
  devLog(`[Flag] Set: ${flag}`);
  return true;
}

/** Remove a game flag. Returns true if the flag was removed, false if not present. */
export function removeFlag(game: Phaser.Game, flag: GameFlag): boolean {
  const state = game.registry.get(STATE_KEY) as GameState;
  if (!state.flags.includes(flag)) return false;

  const next: GameState = { ...state, flags: state.flags.filter((f) => f !== flag) };
  game.registry.set(STATE_KEY, next);
  game.events.emit(GameEvents.STATE_CHANGED, { state: next });
  devLog(`[Flag] Removed: ${flag}`);
  return true;
}

/** Check whether a game flag is currently set. */
export function hasFlag(game: Phaser.Game, flag: GameFlag): boolean {
  const state = game.registry.get(STATE_KEY) as GameState;
  if (state.flags.includes(flag)) return true;
  const systemFlags = game.registry.get('systemFlags') as Set<GameFlag> | undefined;
  return systemFlags?.has(flag) ?? false;
}
