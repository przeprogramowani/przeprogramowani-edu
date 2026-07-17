import { describe, it, expect, vi } from 'vitest';
import { addBookmark, getBookmarks } from './BookmarkManager';
import { GameEvents } from '../events/GameEvents';
import type { GameState } from '../state/types';

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    version: 2,
    flags: [],
    currentMap: 'hub' as GameState['currentMap'],
    position: { x: 0, y: 0 },
    facing: 'down',
    quests: { active: null, completed: [], objectivesDone: {} },
    hintIndex: {},
    xp: 0,
    commandHistory: [],
    bookmarks: [],
    ...overrides,
  };
}

function makeMocks(state: GameState) {
  const registry = new Map<string, unknown>();
  registry.set('demoGameState', state);

  const game = {
    registry: {
      get: (key: string) => registry.get(key),
      set: (key: string, val: unknown) => registry.set(key, val),
    },
  } as unknown as Phaser.Game;

  const listeners: Record<string, Array<(...args: unknown[]) => void>> = {};
  const bus = {
    emit: vi.fn((event: string, ...args: unknown[]) => {
      listeners[event]?.forEach((fn) => fn(...args));
    }),
    on: vi.fn((event: string, fn: (...args: unknown[]) => void) => {
      (listeners[event] ??= []).push(fn);
    }),
  } as unknown as Phaser.Events.EventEmitter;

  return { game, bus, registry };
}

describe('BookmarkManager', () => {
  describe('addBookmark', () => {
    it('adds a bookmark and emits STATE_CHANGED + PREVIEW_SHOW', () => {
      const state = makeState();
      const { game, bus } = makeMocks(state);

      addBookmark(game, bus, 'https://example.com', 'Example');

      expect(bus.emit).toHaveBeenCalledWith(
        GameEvents.STATE_CHANGED,
        expect.objectContaining({
          state: expect.objectContaining({
            bookmarks: [
              expect.objectContaining({
                url: 'https://example.com',
                title: 'Example',
              }),
            ],
          }),
        })
      );
      expect(bus.emit).toHaveBeenCalledWith(GameEvents.PREVIEW_SHOW, {
        url: 'https://example.com',
        title: 'Example',
      });
    });

    it('generates a deterministic id from the URL', () => {
      const state = makeState();
      const { game, bus } = makeMocks(state);

      addBookmark(game, bus, 'https://example.com/path', 'Test');

      const emittedState = (bus.emit as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === GameEvents.STATE_CHANGED
      )?.[1]?.state as GameState;

      expect(emittedState.bookmarks[0].id).toBe('https---example-com-path');
    });

    it('does not add a duplicate bookmark', () => {
      const state = makeState({
        bookmarks: [
          {
            id: 'https---example-com',
            url: 'https://example.com',
            title: 'Existing',
            addedAt: 1000,
          },
        ],
      });
      const { game, bus } = makeMocks(state);

      addBookmark(game, bus, 'https://example.com', 'Duplicate');

      expect(bus.emit).not.toHaveBeenCalledWith(
        GameEvents.STATE_CHANGED,
        expect.anything()
      );
    });

    it('still emits PREVIEW_SHOW for a duplicate bookmark', () => {
      const state = makeState({
        bookmarks: [
          {
            id: 'https---example-com',
            url: 'https://example.com',
            title: 'Existing',
            addedAt: 1000,
          },
        ],
      });
      const { game, bus } = makeMocks(state);

      addBookmark(game, bus, 'https://example.com', 'Duplicate');

      expect(bus.emit).toHaveBeenCalledWith(GameEvents.PREVIEW_SHOW, {
        url: 'https://example.com',
        title: 'Duplicate',
      });
    });

    it('appends to existing bookmarks without mutating the array', () => {
      const existing = {
        id: 'https---first-com',
        url: 'https://first.com',
        title: 'First',
        addedAt: 1000,
      };
      const state = makeState({ bookmarks: [existing] });
      const originalBookmarks = state.bookmarks;
      const { game, bus } = makeMocks(state);

      addBookmark(game, bus, 'https://second.com', 'Second');

      const emittedState = (bus.emit as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === GameEvents.STATE_CHANGED
      )?.[1]?.state as GameState;

      expect(emittedState.bookmarks).toHaveLength(2);
      expect(emittedState.bookmarks[0]).toEqual(existing);
      expect(emittedState.bookmarks[1]).toMatchObject({
        url: 'https://second.com',
        title: 'Second',
      });
      // Original array should not be mutated
      expect(originalBookmarks).toHaveLength(1);
    });

    it('sets addedAt to a timestamp', () => {
      const state = makeState();
      const { game, bus } = makeMocks(state);
      const before = Date.now();

      addBookmark(game, bus, 'https://example.com', 'Test');

      const after = Date.now();
      const emittedState = (bus.emit as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0] === GameEvents.STATE_CHANGED
      )?.[1]?.state as GameState;

      const addedAt = emittedState.bookmarks[0].addedAt;
      expect(addedAt).toBeGreaterThanOrEqual(before);
      expect(addedAt).toBeLessThanOrEqual(after);
    });
  });

  describe('getBookmarks', () => {
    it('returns bookmarks from state', () => {
      const bookmarks = [
        { id: 'a', url: 'https://a.com', title: 'A', addedAt: 1 },
        { id: 'b', url: 'https://b.com', title: 'B', addedAt: 2 },
      ];
      const state = makeState({ bookmarks });

      expect(getBookmarks(state)).toEqual(bookmarks);
    });

    it('returns empty array when bookmarks is undefined', () => {
      const state = { ...makeState() } as GameState;
      // Simulate missing bookmarks (e.g. legacy state)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state as any).bookmarks = undefined;

      expect(getBookmarks(state)).toEqual([]);
    });
  });
});
