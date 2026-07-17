import type { GameFlag } from '../config/flags';
import { SAVE_KEY, TILE_SIZE } from '../config/constants';
import { devLog } from '../utils/logger';
import type { BookmarkEntry, GameState } from './types';

export function createDefaultState(): GameState {
  return {
    version: 2,
    flags: [],
    currentMap: 'm0-awakening',
    position: { x: 2 * TILE_SIZE, y: 4 * TILE_SIZE },
    facing: 'right',
    quests: {
      active: null,
      completed: [],
      objectivesDone: {},
    },
    hintIndex: {},
    xp: 0,
    commandHistory: [],
    bookmarks: [],
  };
}

export function loadState(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.version !== 2) return null;
    if (!data.bookmarks) {
      data.bookmarks = [];
    }
    if (!data.quests.objectivesDone) {
      data.quests.objectivesDone = {};
    }
    if (!data.hintIndex) {
      data.hintIndex = {};
    }
    if (!data.commandHistory) {
      data.commandHistory = [];
    }
    return data as GameState;
  } catch {
    return null;
  }
}

export function saveState(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  devLog('[GameState] State saved');
}

function uniqueStrings<T extends string>(values: T[]): T[] {
  return [...new Set(values)];
}

function mergeObjectivesDone(
  localObjectives: Record<string, string[]>,
  serverObjectives: Record<string, string[]>
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const keys = new Set([...Object.keys(serverObjectives), ...Object.keys(localObjectives)]);

  for (const questId of keys) {
    result[questId] = uniqueStrings([
      ...(serverObjectives[questId] ?? []),
      ...(localObjectives[questId] ?? []),
    ]);
  }

  return result;
}

function mergeHintIndex(
  localHintIndex: Record<string, number>,
  serverHintIndex: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {};
  const keys = new Set([...Object.keys(serverHintIndex), ...Object.keys(localHintIndex)]);

  for (const questId of keys) {
    result[questId] = Math.max(serverHintIndex[questId] ?? 0, localHintIndex[questId] ?? 0);
  }

  return result;
}

function mergeBookmarks(
  localBookmarks: BookmarkEntry[],
  serverBookmarks: BookmarkEntry[]
): BookmarkEntry[] {
  const bookmarksById = new Map<string, BookmarkEntry>();

  for (const bookmark of [...serverBookmarks, ...localBookmarks]) {
    const existing = bookmarksById.get(bookmark.id);
    if (!existing || bookmark.addedAt >= existing.addedAt) {
      bookmarksById.set(bookmark.id, bookmark);
    }
  }

  return [...bookmarksById.values()].sort((a, b) => a.addedAt - b.addedAt);
}

function resolveActiveQuest(
  localActive: string | null,
  serverActive: string | null,
  completed: string[]
): string | null {
  const active = localActive ?? serverActive;
  return active && completed.includes(active) ? null : active;
}

/**
 * Merge server progression into local runtime state.
 * Local movement/navigation state stays authoritative for active session.
 */
export function mergeServerProgressIntoLocal(
  localState: GameState | null,
  serverState: GameState
): GameState {
  if (!localState) {
    return serverState.needsPositionReset ? { ...serverState, needsPositionReset: false } : serverState;
  }

  const useServerNavigation = serverState.needsPositionReset === true;

  const completed = uniqueStrings([
    ...serverState.quests.completed,
    ...localState.quests.completed,
  ]);

  return {
    ...serverState,
    currentMap: useServerNavigation ? serverState.currentMap : localState.currentMap,
    position: useServerNavigation ? serverState.position : localState.position,
    facing: useServerNavigation ? serverState.facing : localState.facing,
    ...(useServerNavigation ? { needsPositionReset: false } : {}),
    flags: uniqueStrings([...serverState.flags, ...localState.flags]),
    xp: Math.max(serverState.xp, localState.xp),
    quests: {
      active: resolveActiveQuest(localState.quests.active, serverState.quests.active, completed),
      completed,
      objectivesDone: mergeObjectivesDone(
        localState.quests.objectivesDone ?? {},
        serverState.quests.objectivesDone ?? {}
      ),
    },
    hintIndex: mergeHintIndex(localState.hintIndex ?? {}, serverState.hintIndex ?? {}),
    commandHistory: localState.commandHistory ?? [],
    bookmarks: mergeBookmarks(localState.bookmarks ?? [], serverState.bookmarks ?? []),
  };
}

let preloadedSystemFlags: GameFlag[] = [];

/** Called by PhaserGame.svelte after fetching server state, before Phaser boot. */
export function setPreloadedSystemFlags(flags: GameFlag[]): void {
  preloadedSystemFlags = flags;
}

/** Called once by BootScene to consume the pre-loaded system flags. */
export function getPreloadedSystemFlags(): GameFlag[] {
  return preloadedSystemFlags;
}

/** Called by BootScene after consuming the pre-loaded system flags. */
export function clearPreloadedSystemFlags(): void {
  preloadedSystemFlags = [];
}

let preloadedState: GameState | null = null;

/** Called by PhaserGame.svelte after fetching server state, before Phaser boot. */
export function setPreloadedState(state: GameState): void {
  preloadedState = state;
}

/** Called once by BootScene to consume the pre-loaded state. */
export function getPreloadedState(): GameState | null {
  return preloadedState;
}

/** Called by BootScene after consuming the pre-loaded state. */
export function clearPreloadedState(): void {
  preloadedState = null;
}
