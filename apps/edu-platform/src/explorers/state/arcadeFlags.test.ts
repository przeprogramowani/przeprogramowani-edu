import { describe, expect, it } from 'vitest';
import { getArcadeStationClearFlag } from './arcadeFlags';

describe('getArcadeStationClearFlag', () => {
  it('builds a deterministic flag from map, zone, and game identifiers', () => {
    expect(
      getArcadeStationClearFlag({
        mapKey: 'm0-crew-room',
        zoneId: 'crew-room-memory',
        arcadeGameId: 'crew-room-memory',
      })
    ).toBe('arcade:m0-crew-room:crew-room-memory:crew-room-memory');
  });

  it('keeps flags unique across different zones using the same game', () => {
    expect(
      getArcadeStationClearFlag({
        mapKey: 'm1-lab',
        zoneId: 'arcade-west',
        arcadeGameId: 'arcade-memory-test',
      })
    ).not.toBe(
      getArcadeStationClearFlag({
        mapKey: 'm1-lab',
        zoneId: 'arcade-east',
        arcadeGameId: 'arcade-memory-test',
      })
    );
  });
});
