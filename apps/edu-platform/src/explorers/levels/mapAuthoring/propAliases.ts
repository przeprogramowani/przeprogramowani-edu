/**
 * Human-readable aliases for prop slots, per theme. The yaml source accepts
 * either `slot: 2` or `prop: hibernation-chamber`. Themes without art names
 * yet stay slot-only.
 */
const ALIASES: Record<number, readonly string[]> = {
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
};

/** Slot (1-8) for a prop alias within a theme, or undefined if unknown. */
export function slotForAlias(theme: number, alias: string): number | undefined {
  const index = (ALIASES[theme] ?? []).indexOf(alias);
  return index === -1 ? undefined : index + 1;
}

/** Alias for a slot within a theme, or undefined if the theme has no names. */
export function aliasForSlot(theme: number, slot: number): string | undefined {
  return (ALIASES[theme] ?? [])[slot - 1];
}
