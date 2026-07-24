import { describe, expect, it } from 'vitest';
import {
  applyRevisionTest,
  getFaultTraceDifficulty,
  getIdealMidpoints,
  resolveRevisionTest,
  scoreFaultTrace,
} from './FaultTraceLogic';

describe('FaultTraceLogic', () => {
  it('narrows an ideal run to the first bad revision', () => {
    let bounds = { knownGood: 0, knownBad: 15 };
    const firstBadRevision = 10;

    while (bounds.knownBad - bounds.knownGood > 1) {
      const midpoint = Math.floor((bounds.knownGood + bounds.knownBad) / 2);
      bounds = applyRevisionTest(
        bounds,
        midpoint,
        midpoint < firstBadRevision ? 'good' : 'bad'
      );
    }

    expect(bounds).toEqual({ knownGood: 9, knownBad: 10 });
  });

  it('makes the unstable result repeatable without moving the bounds', () => {
    const bounds = { knownGood: 0, knownBad: 15 };
    const unstableRevisions = new Set([11]);
    const first = resolveRevisionTest(11, 9, unstableRevisions);
    const unchanged = applyRevisionTest(bounds, 11, first);
    const repeated = resolveRevisionTest(11, 9, unstableRevisions, first);

    expect(first).toBe('unstable');
    expect(unchanged).toEqual(bounds);
    expect(repeated).toBe('bad');
    expect(applyRevisionTest(unchanged, 11, repeated)).toEqual({
      knownGood: 0,
      knownBad: 11,
    });
  });

  it('provides enough ideal midpoints for every difficulty configuration', () => {
    for (const difficulty of [1, 2, 3, 4, 5] as const) {
      const settings = getFaultTraceDifficulty(difficulty);
      const lastRevision = settings.revisionCount - 1;
      for (let firstBadRevision = 1; firstBadRevision < lastRevision; firstBadRevision++) {
        expect(getIdealMidpoints(firstBadRevision, lastRevision).length).toBeGreaterThanOrEqual(
          settings.unstableRuns
        );
      }
    }
  });

  it('scales history, test budget, and instability with difficulty', () => {
    expect(getFaultTraceDifficulty(1)).toEqual({
      revisionCount: 8,
      testBudget: 5,
      unstableRuns: 0,
      parTests: 3,
    });
    expect(getFaultTraceDifficulty(3)).toEqual({
      revisionCount: 16,
      testBudget: 6,
      unstableRuns: 2,
      parTests: 6,
    });
    expect(getFaultTraceDifficulty(5)).toEqual({
      revisionCount: 32,
      testBudget: 8,
      unstableRuns: 3,
      parTests: 8,
    });
  });

  it('rewards an exact diagnosis and caps a near miss below the pass score', () => {
    expect(scoreFaultTrace(10, 10, 6, 6, 15)).toBe(100);
    expect(scoreFaultTrace(10, 10, 7, 6, 15)).toBe(90);
    expect(scoreFaultTrace(9, 10, 6, 6, 15)).toBeLessThan(70);
  });
});
