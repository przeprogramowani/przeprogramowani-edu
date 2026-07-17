import { describe, expect, it, vi } from 'vitest';

import {
  GAME_STARTED_COOKIE_CONFIG,
  shouldTrackAnonymousStart,
  trackAnonymousGameStart,
} from '@/server/game/anonymousTracking';

describe('anonymousTracking', () => {
  it('writes an analytics event when the dataset binding is present', () => {
    const writeDataPoint = vi.fn();

    trackAnonymousGameStart({
      ANON_GAME_STARTS: {
        writeDataPoint,
      },
    });

    expect(writeDataPoint).toHaveBeenCalledWith({
      doubles: [1],
      blobs: ['anonymous_game_start', '/explorers'],
      indexes: ['explorers'],
    });
  });

  it('does nothing when the dataset binding is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => trackAnonymousGameStart({})).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(
      '[anonymousTracking] ANON_GAME_STARTS binding is missing at runtime'
    );

    warnSpy.mockRestore();
  });

  it('tracks only anonymous users without the game-started cookie', () => {
    expect(shouldTrackAnonymousStart(undefined, undefined)).toBe(true);
    expect(shouldTrackAnonymousStart('user@example.com', undefined)).toBe(false);
    expect(shouldTrackAnonymousStart(undefined, '1')).toBe(false);
  });

  it('uses the expected cookie configuration', () => {
    expect(GAME_STARTED_COOKIE_CONFIG).toMatchObject({
      name: 'game-started',
      value: '1',
      path: '/explorers',
      maxAge: 7 * 86400,
    });
  });
});
