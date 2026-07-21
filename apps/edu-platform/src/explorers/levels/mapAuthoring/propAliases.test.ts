import { describe, expect, it } from 'vitest';
import { aliasForSlot, slotForAlias } from './propAliases';

describe('propAliases', () => {
  const aliasesByTheme = {
    1: [
      'console',
      'hibernation-chamber',
      'viewport',
      'whiteboard',
      'crate',
      'radar',
      'oscilloscope',
      'button-panel',
    ],
    2: [
      'ship-teleport',
      'holographic-console',
      'void-node',
      'synaptit-ore',
      'ancient-portal',
      'broken-scout-drone',
      'energy-barrier',
      'energy-core',
    ],
    3: [
      'ship-teleport',
      'frozen-console',
      'holo-plan-board',
      'server-monolith',
      'fabricator-rig',
      'cargo-tram',
      'frozen-service-bot',
      'synaptit-ore',
    ],
    4: [
      'ship-teleport',
      'survey-lander',
      'lava-geyser',
      'lava-obelisk',
      'magma-crystals',
      'synaptit-ore',
      'satellite-dish',
      'exploration-rover',
    ],
    5: [
      'ship-teleport',
      'buried-hatch',
      'desert-cairn',
      'signal-beacon',
      'synaptit-ore',
      'solar-panel',
      'supply-canister',
      'desert-well',
    ],
    6: [
      'ship-teleport',
      'water-pump',
      'seaweed',
      'synaptit-ore',
      'coral-shrine',
      'pearl-orb',
      'tidal-monolith',
      'water-turbine',
    ],
  } as const;

  it('uses ship teleport as slot 1 in every planetary theme', () => {
    for (let theme = 2; theme <= 6; theme++) {
      expect(slotForAlias(theme, 'ship-teleport')).toBe(1);
      expect(aliasForSlot(theme, 1)).toBe('ship-teleport');
    }
  });

  for (const [theme, aliases] of Object.entries(aliasesByTheme)) {
    it(`maps every theme-${theme} alias to its row-major prop slot`, () => {
      aliases.forEach((alias, index) => {
        const slot = index + 1;
        expect(slotForAlias(Number(theme), alias)).toBe(slot);
        expect(aliasForSlot(Number(theme), slot)).toBe(alias);
      });
    });
  }

  it('exposes exactly one synaptit ore prop in every planetary theme', () => {
    expect(slotForAlias(1, 'synaptit-ore')).toBeUndefined();
    for (let theme = 2; theme <= 6; theme++) {
      const matchingSlots = Array.from({ length: 8 }, (_, index) => index + 1).filter(
        (slot) => aliasForSlot(theme, slot) === 'synaptit-ore',
      );
      expect(matchingSlots).toHaveLength(1);
      expect(slotForAlias(theme, 'synaptit-ore')).toBe(matchingSlots[0]);
    }
  });
});
