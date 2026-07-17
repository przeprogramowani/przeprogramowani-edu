import { describe, expect, it } from 'vitest';
import type { ArcadeGameDefinition, ArcadeGameResult, ArcadeStationContext } from './ArcadeTypes';
import type { BilingualText } from '../i18n/types';
import {
  DEFAULT_ARCADE_CLEAR_RATIO,
  evaluateArcadeMissionSuccess,
  resolveArcadeRunOutcome,
} from './arcadeMission';

const context: ArcadeStationContext = {
  mapKey: 'm0-crew-room',
  zoneId: 'crew-room-memory',
  arcadeGameId: 'crew-room-memory',
};

const bi = (text: string): BilingualText => ({ pl: text, en: text });

const definition: ArcadeGameDefinition = {
  id: 'crew-room-memory',
  type: 'memory-matrix',
  title: bi('Dekoder Sygnałów'),
  description: bi('Test definition'),
  difficulty: 5,
  durationSeconds: 0,
  mission: {
    firstClearXp: 10,
    firstClearDialogueId: 'm0-arcade-memory-cleared',
  },
};

function makeResult(overrides: Partial<ArcadeGameResult> = {}): ArcadeGameResult {
  return {
    score: 0,
    completed: false,
    ...overrides,
  };
}

describe('evaluateArcadeMissionSuccess', () => {
  it('falls back to renderer completion when no mission rules are configured', () => {
    expect(evaluateArcadeMissionSuccess(makeResult({ completed: true }))).toBe(true);
    expect(evaluateArcadeMissionSuccess(makeResult({ completed: false }))).toBe(false);
  });

  it('supports minScore-only mission thresholds', () => {
    expect(evaluateArcadeMissionSuccess(makeResult({ score: 20 }), { minScore: 20 })).toBe(true);
    expect(evaluateArcadeMissionSuccess(makeResult({ score: 19 }), { minScore: 20 })).toBe(false);
  });

  it('defaults bounded games to an 80% maxScore threshold', () => {
    expect(
      evaluateArcadeMissionSuccess(makeResult({ score: 16, maxScore: 20 }), {})
    ).toBe(true);
    expect(
      evaluateArcadeMissionSuccess(makeResult({ score: 15, maxScore: 20 }), {})
    ).toBe(false);
    expect(DEFAULT_ARCADE_CLEAR_RATIO).toBe(0.8);
  });

  it('allows overriding the default ratio when needed', () => {
    expect(
      evaluateArcadeMissionSuccess(makeResult({ score: 14, maxScore: 20 }), { minScoreRatio: 0.7 })
    ).toBe(true);
    expect(
      evaluateArcadeMissionSuccess(makeResult({ score: 13, maxScore: 20 }), { minScoreRatio: 0.7 })
    ).toBe(false);
  });

  it('supports combined completed and score requirements', () => {
    const mission = { requireCompleted: true, minScore: 80 };
    expect(evaluateArcadeMissionSuccess(makeResult({ score: 82, completed: true }), mission)).toBe(true);
    expect(evaluateArcadeMissionSuccess(makeResult({ score: 82, completed: false }), mission)).toBe(false);
    expect(evaluateArcadeMissionSuccess(makeResult({ score: 79, completed: true }), mission)).toBe(false);
  });
});

describe('resolveArcadeRunOutcome', () => {
  it('marks the first successful clear as a one-time completion and queues dialogue', () => {
    const outcome = resolveArcadeRunOutcome({
      definition,
      context,
      result: makeResult({ score: 20, maxScore: 20, completed: false }),
      alreadyCleared: false,
      flagWasSet: true,
    });

    expect(outcome.solved).toBe(true);
    expect(outcome.firstClear).toBe(true);
    expect(outcome.queuedDialogueId).toBe('m0-arcade-memory-cleared');
    expect(outcome.xpGained).toBe(10);
    expect(outcome.resultTitleKey).toBe('arcade.result.firstClearTitle');
  });

  it('keeps repeat runs progression-neutral and shows the replay disclaimer', () => {
    const outcome = resolveArcadeRunOutcome({
      definition,
      context,
      result: makeResult({ score: 20, maxScore: 20, completed: true }),
      alreadyCleared: true,
    });

    expect(outcome.solved).toBe(true);
    expect(outcome.firstClear).toBe(false);
    expect(outcome.queuedDialogueId).toBeNull();
    expect(outcome.showReplayDisclaimer).toBe(true);
    expect(outcome.xpGained).toBe(0);
  });

  it('does not queue duplicate first-clear dialogue on replay', () => {
    const outcome = resolveArcadeRunOutcome({
      definition,
      context,
      result: makeResult({ score: 20, maxScore: 20 }),
      alreadyCleared: true,
      flagWasSet: false,
    });

    expect(outcome.firstClear).toBe(false);
    expect(outcome.queuedDialogueId).toBeNull();
  });

  it('keeps uncleared stations uncleared after a failed run', () => {
    const outcome = resolveArcadeRunOutcome({
      definition,
      context,
      result: makeResult({ score: 12, completed: false }),
      alreadyCleared: false,
    });

    expect(outcome.solved).toBe(false);
    expect(outcome.firstClear).toBe(false);
    expect(outcome.resultTitleKey).toBe('arcade.result.needsWorkTitle');
  });
});
