import { describe, it, expect, beforeEach } from 'vitest';
import type { GameFlag } from '../config/flags';
import {
  createDefaultState,
  loadState,
  mergeServerProgressIntoLocal,
  saveState,
} from './GameStateManager';
import { SAVE_KEY } from '../config/constants';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { for (const k in store) delete store[k]; },
} as Storage;

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('GameStateManager', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('createDefaultState returns version 2 state', () => {
    const state = createDefaultState();
    expect(state.version).toBe(2);
    expect(state.currentMap).toBe('m0-awakening');
    expect(state.flags).toEqual([]);
    expect(state.xp).toBe(0);
  });

  it('save → load roundtrip preserves state', () => {
    const state = createDefaultState();
    state.flags = ['keycode-found', 'terminal-unlocked'];
    state.xp = 75;
    state.currentMap = 'ship-bridge';
    state.quests.active = 'demo-quest-2';
    state.quests.completed = ['demo-quest-1'];

    saveState(state);
    const loaded = loadState();

    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(2);
    expect(loaded!.flags).toEqual(['keycode-found', 'terminal-unlocked']);
    expect(loaded!.xp).toBe(75);
    expect(loaded!.currentMap).toBe('ship-bridge');
    expect(loaded!.quests.active).toBe('demo-quest-2');
    expect(loaded!.quests.completed).toEqual(['demo-quest-1']);
  });

  it('loadState returns null for missing data', () => {
    expect(loadState()).toBeNull();
  });

  it('loadState returns null for corrupted JSON', () => {
    localStorageMock.setItem(SAVE_KEY, '{bad json');
    expect(loadState()).toBeNull();
  });

  it('loadState returns null for wrong version', () => {
    localStorageMock.setItem(SAVE_KEY, JSON.stringify({ version: 99 }));
    expect(loadState()).toBeNull();
  });

  it('mergeServerProgressIntoLocal returns server state when local is missing', () => {
    const server = createDefaultState();
    server.currentMap = 'ship-bridge';
    server.position = { x: 320, y: 160 };
    server.xp = 120;

    const merged = mergeServerProgressIntoLocal(null, server);

    expect(merged).toEqual(server);
  });

  it('mergeServerProgressIntoLocal clears needsPositionReset flag when local is missing', () => {
    const server = createDefaultState();
    server.currentMap = 'ship-bridge';
    server.position = { x: 128, y: 256 };
    server.needsPositionReset = true;

    const merged = mergeServerProgressIntoLocal(null, server);

    expect(merged.needsPositionReset).toBe(false);
  });

  it('mergeServerProgressIntoLocal uses server navigation when needsPositionReset is true', () => {
    const local = createDefaultState();
    local.currentMap = 'm0-exam-room';
    local.position = { x: 9999, y: 9999 };
    local.facing = 'left';

    const server = createDefaultState();
    server.currentMap = 'm0-awakening';
    server.position = { x: 128, y: 256 };
    server.facing = 'down';
    server.needsPositionReset = true;

    const merged = mergeServerProgressIntoLocal(local, server);

    expect(merged.currentMap).toBe('m0-awakening');
    expect(merged.position).toEqual({ x: 128, y: 256 });
    expect(merged.facing).toBe('down');
    expect(merged.needsPositionReset).toBe(false);
  });

  it('mergeServerProgressIntoLocal keeps local navigation when needsPositionReset is absent', () => {
    const local = createDefaultState();
    local.currentMap = 'm0-exam-room';
    local.position = { x: 96, y: 64 };
    local.facing = 'left';

    const server = createDefaultState();
    server.currentMap = 'm0-awakening';
    server.position = { x: 128, y: 256 };
    server.facing = 'down';

    const merged = mergeServerProgressIntoLocal(local, server);

    expect(merged.currentMap).toBe('m0-exam-room');
    expect(merged.position).toEqual({ x: 96, y: 64 });
    expect(merged.facing).toBe('left');
    expect(merged.needsPositionReset).toBeUndefined();
  });

  it('mergeServerProgressIntoLocal keeps local navigation and merges progression', () => {
    const local = createDefaultState();
    local.currentMap = 'm0-exam-room';
    local.position = { x: 96, y: 64 };
    local.facing = 'left';
    local.flags = ['local-flag' as GameFlag];
    local.xp = 80;
    local.quests.active = 'q-local-active';
    local.quests.completed = ['q-local-done'];
    local.quests.objectivesDone = { 'q-local-active': ['o1'] };
    local.hintIndex = { 'q-shared': 3 };
    local.commandHistory = ['/help'];
    local.bookmarks = [
      { id: 'same', url: '/local', title: 'Local old', addedAt: 1 },
      { id: 'local-only', url: '/a', title: 'Local', addedAt: 2 },
    ];

    const server = createDefaultState();
    server.currentMap = 'ship-bridge';
    server.position = { x: 320, y: 160 };
    server.facing = 'up';
    server.flags = ['server-flag' as GameFlag];
    server.xp = 150;
    server.quests.active = 'q-server-active';
    server.quests.completed = ['q-server-done'];
    server.quests.objectivesDone = { 'q-local-active': ['o2'], 'q-server-active': ['x1'] };
    server.hintIndex = { 'q-shared': 1, 'q-server-active': 2 };
    server.commandHistory = ['/server'];
    server.bookmarks = [
      { id: 'same', url: '/server', title: 'Server new', addedAt: 3 },
      { id: 'server-only', url: '/b', title: 'Server', addedAt: 4 },
    ];

    const merged = mergeServerProgressIntoLocal(local, server);

    expect(merged.currentMap).toBe('m0-exam-room');
    expect(merged.position).toEqual({ x: 96, y: 64 });
    expect(merged.facing).toBe('left');

    expect(merged.xp).toBe(150);
    expect(merged.flags).toEqual(['server-flag', 'local-flag']);
    expect(merged.quests.active).toBe('q-local-active');
    expect(merged.quests.completed).toEqual(['q-server-done', 'q-local-done']);
    expect(merged.quests.objectivesDone).toEqual({
      'q-local-active': ['o2', 'o1'],
      'q-server-active': ['x1'],
    });
    expect(merged.hintIndex).toEqual({ 'q-shared': 3, 'q-server-active': 2 });
    expect(merged.commandHistory).toEqual(['/help']);
    expect(merged.bookmarks).toEqual([
      { id: 'local-only', url: '/a', title: 'Local', addedAt: 2 },
      { id: 'same', url: '/server', title: 'Server new', addedAt: 3 },
      { id: 'server-only', url: '/b', title: 'Server', addedAt: 4 },
    ]);
  });
});
