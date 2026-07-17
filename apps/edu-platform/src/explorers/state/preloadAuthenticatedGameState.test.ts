import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FLAGS, type GameFlag } from '../config/flags';
import type { GameState, PendingGrant } from './types';
import {
  GAME_STATE_ENDPOINT,
  preloadAuthenticatedGameState,
  shouldFlushBootState,
} from './preloadAuthenticatedGameState';
import {
  loadState,
  mergeServerProgressIntoLocal,
  saveState,
  setPreloadedState,
  setPreloadedSystemFlags,
} from './GameStateManager';

vi.mock('./GameStateManager', () => ({
  loadState: vi.fn(),
  mergeServerProgressIntoLocal: vi.fn(),
  saveState: vi.fn(),
  setPreloadedState: vi.fn(),
  setPreloadedSystemFlags: vi.fn(),
}));

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    version: 2,
    flags: [],
    currentMap: 'm0-awakening',
    position: { x: 128, y: 256 },
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
    ...overrides,
  };
}

function createPendingGrant(overrides: Partial<PendingGrant> = {}): PendingGrant {
  return {
    id: 'grant-1',
    quest_id: 'quest-1',
    questTitle: 'Quest 1',
    xp: 10,
    flags: [],
    timestamp: 1,
    ...overrides,
  };
}

function createFetchMock(response: {
  state: GameState | null;
  pending: PendingGrant[];
  systemFlags?: GameFlag[];
}) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => response,
  })) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

describe('preloadAuthenticatedGameState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadState).mockReturnValue(null);
    vi.mocked(mergeServerProgressIntoLocal).mockImplementation((_local, server) => {
      return server.needsPositionReset ? { ...server, needsPositionReset: false } : server;
    });
  });

  it('flushes cleared state when needsPositionReset is consumed without pending grants', async () => {
    const serverState = createState({ needsPositionReset: true });
    const fetchMock = createFetchMock({ state: serverState, pending: [] });

    await preloadAuthenticatedGameState(fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, GAME_STATE_ENDPOINT);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      GAME_STATE_ENDPOINT,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          state: { ...serverState, needsPositionReset: false },
          appliedGrantIds: [],
        }),
      })
    );
    expect(saveState).toHaveBeenCalledWith({ ...serverState, needsPositionReset: false });
    expect(setPreloadedState).toHaveBeenCalledWith({ ...serverState, needsPositionReset: false });
  });

  it('does not flush when there are no pending grants and no consumed reset flag', async () => {
    const serverState = createState();
    const fetchMock = createFetchMock({ state: serverState, pending: [] });

    await preloadAuthenticatedGameState(fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(GAME_STATE_ENDPOINT);
    expect(saveState).toHaveBeenCalledWith(serverState);
    expect(setPreloadedState).toHaveBeenCalledWith(serverState);
  });

  it('flushes pending grant ids when pending grants are applied', async () => {
    const serverState = createState();
    const pending = [createPendingGrant({ id: 'grant-1' }), createPendingGrant({ id: 'grant-2' })];
    const fetchMock = createFetchMock({ state: serverState, pending });

    await preloadAuthenticatedGameState(fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      GAME_STATE_ENDPOINT,
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"appliedGrantIds":["grant-1","grant-2"]'),
      })
    );
  });

  it('preloads system flags from the state response', async () => {
    const fetchMock = createFetchMock({
      state: null,
      pending: [],
      systemFlags: [FLAGS.SYS_COURSE_M1_AVAILABLE],
    });

    await preloadAuthenticatedGameState(fetchMock);

    expect(setPreloadedSystemFlags).toHaveBeenCalledWith([FLAGS.SYS_COURSE_M1_AVAILABLE]);
  });
});

describe('shouldFlushBootState', () => {
  it('flushes for pending grants or consumed reset flags only', () => {
    expect(shouldFlushBootState([], false)).toBe(false);
    expect(shouldFlushBootState([], true)).toBe(true);
    expect(shouldFlushBootState([createPendingGrant()], false)).toBe(true);
  });
});
