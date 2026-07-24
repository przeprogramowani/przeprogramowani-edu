export const FIRST_REVISION = 0;

export type RevisionTestState = 'good' | 'bad' | 'unstable';

export interface FaultTraceDifficulty {
  revisionCount: number;
  testBudget: number;
  unstableRuns: number;
  parTests: number;
}

export interface BisectBounds {
  knownGood: number;
  knownBad: number;
}

const DIFFICULTY_CURVE = {
  1: { revisionCount: 8, testBudget: 5, unstableRuns: 0 },
  2: { revisionCount: 12, testBudget: 5, unstableRuns: 1 },
  3: { revisionCount: 16, testBudget: 6, unstableRuns: 2 },
  4: { revisionCount: 24, testBudget: 7, unstableRuns: 2 },
  5: { revisionCount: 32, testBudget: 8, unstableRuns: 3 },
} as const;

export function getFaultTraceDifficulty(
  difficulty: 1 | 2 | 3 | 4 | 5
): FaultTraceDifficulty {
  const settings = DIFFICULTY_CURVE[difficulty];
  return {
    ...settings,
    parTests: Math.ceil(Math.log2(settings.revisionCount)) + settings.unstableRuns,
  };
}

/**
 * Returns every revision an ideal binary-search path would test. Picking
 * unstable revisions from this list guarantees that the reliability wrinkle
 * appears during an otherwise optimal run.
 */
export function getIdealMidpoints(
  firstBadRevision: number,
  lastRevision: number
): number[] {
  let knownGood = FIRST_REVISION;
  let knownBad = lastRevision;
  const midpoints: number[] = [];

  while (knownBad - knownGood > 1) {
    const midpoint = Math.floor((knownGood + knownBad) / 2);
    midpoints.push(midpoint);
    if (midpoint < firstBadRevision) {
      knownGood = midpoint;
    } else {
      knownBad = midpoint;
    }
  }

  return midpoints;
}

/**
 * The unstable runner lies only on its first run. The renderer marks that
 * result as suspect and does not move the bisect bounds until it is repeated.
 */
export function resolveRevisionTest(
  revision: number,
  firstBadRevision: number,
  unstableRevisions: ReadonlySet<number>,
  previousState?: RevisionTestState
): RevisionTestState {
  if (unstableRevisions.has(revision) && previousState === undefined) {
    return 'unstable';
  }
  return revision < firstBadRevision ? 'good' : 'bad';
}

export function applyRevisionTest(
  bounds: BisectBounds,
  revision: number,
  state: RevisionTestState
): BisectBounds {
  if (state === 'unstable') return bounds;
  if (state === 'good') {
    return { ...bounds, knownGood: Math.max(bounds.knownGood, revision) };
  }
  return { ...bounds, knownBad: Math.min(bounds.knownBad, revision) };
}

export function scoreFaultTrace(
  selectedRevision: number,
  firstBadRevision: number,
  testsUsed: number,
  parTests: number,
  lastRevision: number
): number {
  if (selectedRevision === firstBadRevision) {
    return Math.max(0, 100 - 10 * Math.max(0, testsUsed - parTests));
  }

  const distance = Math.abs(selectedRevision - firstBadRevision);
  return Math.max(0, Math.min(60, Math.round(60 * (1 - distance / lastRevision))));
}
