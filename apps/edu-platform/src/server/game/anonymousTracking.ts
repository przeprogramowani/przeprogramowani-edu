const GAME_STARTED_COOKIE = 'game-started';
const GAME_STARTED_MAX_AGE = 7 * 86400; // 7 days in seconds

interface AnonymousTrackingEnv {
  ANON_GAME_STARTS?: AnalyticsEngineDataset;
}

export function trackAnonymousGameStart(env: AnonymousTrackingEnv): void {
  if (!env.ANON_GAME_STARTS) {
    console.warn('[anonymousTracking] ANON_GAME_STARTS binding is missing at runtime');
    return;
  }

  env.ANON_GAME_STARTS.writeDataPoint({
    doubles: [1],
    blobs: ['anonymous_game_start', '/explorers'],
    indexes: ['explorers'],
  });

  console.info('[anonymousTracking] wrote anonymous_game_start event');
}

export function shouldTrackAnonymousStart(
  userEmail: string | undefined,
  gameStartedCookie: string | undefined,
): boolean {
  return !userEmail && !gameStartedCookie;
}

export const GAME_STARTED_COOKIE_CONFIG = {
  name: GAME_STARTED_COOKIE,
  value: '1',
  path: '/explorers',
  maxAge: GAME_STARTED_MAX_AGE,
} as const;
