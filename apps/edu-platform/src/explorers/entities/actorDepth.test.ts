// These tests define the expected behavior for Y-sorted actor depth (Phase 1).
// They will fail until actorDepth is extracted from NPC.ts / Astronaut.ts
// into a shared module at ./actorDepth.ts.
// Run with: npm run test:explorers

import { describe, it, expect } from 'vitest';
import { actorDepth } from './actorDepth';
import { DEPTH } from '../config/constants';

describe('actorDepth', () => {
  it('returns DEPTH.PLAYER when Y is 0', () => {
    expect(actorDepth(0)).toBe(DEPTH.PLAYER);
  });

  it('returns higher depth for higher Y position', () => {
    expect(actorDepth(200)).toBeGreaterThan(actorDepth(100));
  });

  it('produces correct relative ordering — lower actor renders in front', () => {
    // Player at Y=400 (lower on screen) should render in front of NPC at Y=300
    const playerDepth = actorDepth(400);
    const npcDepth = actorDepth(300);
    expect(playerDepth).toBeGreaterThan(npcDepth);
  });

  it('does not exceed DEPTH.ABOVE at realistic max map height', () => {
    // Maps up to ~4999px tall must keep actor depth below the ABOVE layer
    expect(actorDepth(4999)).toBeLessThan(DEPTH.ABOVE);
  });
});
