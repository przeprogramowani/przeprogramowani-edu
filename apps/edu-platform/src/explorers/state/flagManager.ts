import type { GameFlag } from '../config/flags';
import type Phaser from 'phaser';
import { GameEvents } from '../events/GameEvents';
import { devLog } from '../utils/logger';
import type { GameState } from './types';

const STATE_KEY = 'demoGameState';

/**
 * localStorage key for QA-forced system flags. System flags are normally
 * server-controlled and rebuilt from the server on every boot; persisting the
 * QA overrides here lets them survive a page refresh so gated content stays
 * reachable during testing. Additions only — clearing a genuine server flag is
 * transient and reverts on reload.
 */
const QA_SYSTEM_FLAGS_KEY = 'qaSystemFlags';

/** Read the persisted QA system-flag overrides from localStorage. */
export function loadQaSystemFlags(): GameFlag[] {
  try {
    const raw = localStorage.getItem(QA_SYSTEM_FLAGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (f): f is GameFlag => typeof f === 'string' && f.startsWith('sys:')
    );
  } catch {
    return [];
  }
}

function saveQaSystemFlags(flags: GameFlag[]): void {
  try {
    if (flags.length === 0) {
      localStorage.removeItem(QA_SYSTEM_FLAGS_KEY);
    } else {
      localStorage.setItem(QA_SYSTEM_FLAGS_KEY, JSON.stringify(flags));
    }
  } catch {
    // localStorage unavailable — QA overrides simply won't persist.
  }
}

/** QA-only: clear all persisted system-flag overrides (used by the Reset button). */
export function clearQaSystemFlags(): void {
  saveQaSystemFlags([]);
}

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

/**
 * Read the current system-flag set from the registry.
 * System flags are server-controlled (Supabase) and preloaded into a dedicated
 * registry Set, separate from the player's persisted `state.flags`.
 */
export function getSystemFlags(game: Phaser.Game): Set<GameFlag> {
  return (game.registry.get('systemFlags') as Set<GameFlag> | undefined) ?? new Set();
}

/**
 * QA-only: force a `sys:` flag into the local system-flag set so gated content can
 * be exercised without touching Supabase. Not persisted server-side. Returns true if
 * newly added. For non-sys flags use {@link setFlag} instead.
 */
export function setSystemFlag(game: Phaser.Game, flag: GameFlag): boolean {
  if (!flag.startsWith('sys:')) {
    devLog(`[Flag] setSystemFlag ignored non-sys flag "${flag}"`);
    return false;
  }
  const current = getSystemFlags(game);
  if (current.has(flag)) return false;

  const next = new Set(current);
  next.add(flag);
  game.registry.set('systemFlags', next);
  // Persist so the override survives a refresh (BootScene merges these back in).
  saveQaSystemFlags([...new Set([...loadQaSystemFlags(), flag])]);
  game.events.emit(GameEvents.FLAG_SET, { flag });
  devLog(`[Flag] System flag forced (QA): ${flag}`);
  return true;
}

/**
 * QA-only: clear a `sys:` flag from the local system-flag set. Not persisted
 * server-side. Returns true if the flag was present and removed.
 */
export function removeSystemFlag(game: Phaser.Game, flag: GameFlag): boolean {
  const current = getSystemFlags(game);
  if (!current.has(flag)) return false;

  const next = new Set(current);
  next.delete(flag);
  game.registry.set('systemFlags', next);
  // Drop it from the persisted overrides too so it stays cleared after refresh.
  saveQaSystemFlags(loadQaSystemFlags().filter((f) => f !== flag));
  devLog(`[Flag] System flag cleared (QA): ${flag}`);
  return true;
}

/** Check whether a game flag is currently set. */
export function hasFlag(game: Phaser.Game, flag: GameFlag): boolean {
  const state = game.registry.get(STATE_KEY) as GameState;
  if (state.flags.includes(flag)) return true;
  const systemFlags = game.registry.get('systemFlags') as Set<GameFlag> | undefined;
  return systemFlags?.has(flag) ?? false;
}
