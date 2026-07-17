import type { GameFlag } from '../config/flags';
import { getArcadeStationClearFlag } from '../state/arcadeFlags';
import type { ArcadeGameDefinition, ArcadeGameResult, ArcadeMissionConfig, ArcadeStationContext } from './ArcadeTypes';
import type { StringKey } from '../i18n';

export const DEFAULT_ARCADE_CLEAR_RATIO = 0.8;

export interface ArcadeRunResolutionInput {
  definition: ArcadeGameDefinition;
  context: ArcadeStationContext;
  result: ArcadeGameResult;
  alreadyCleared: boolean;
  flagWasSet?: boolean;
}

export interface ArcadeRunResolution {
  stationFlag: GameFlag;
  solved: boolean;
  firstClear: boolean;
  xpGained: number;
  queuedDialogueId: string | null;
  showReplayDisclaimer: boolean;
  resultTitleKey: StringKey;
  resultColor: string;
  resultMessageKey: StringKey;
}

export function evaluateArcadeMissionSuccess(
  result: ArcadeGameResult,
  mission?: ArcadeMissionConfig
): boolean {
  const usesCompletedRule = mission?.requireCompleted === true;
  const usesScoreRule = typeof mission?.minScore === 'number';
  const inferredScoreRule =
    !usesScoreRule && typeof result.maxScore === 'number'
      ? Math.ceil(result.maxScore * (mission?.minScoreRatio ?? DEFAULT_ARCADE_CLEAR_RATIO))
      : null;

  if (!usesCompletedRule && !usesScoreRule && inferredScoreRule === null) {
    return result.completed;
  }

  if (usesCompletedRule && !result.completed) {
    return false;
  }

  if (usesScoreRule && result.score < (mission?.minScore ?? 0)) {
    return false;
  }

  if (inferredScoreRule !== null && result.score < inferredScoreRule) {
    return false;
  }

  return true;
}

export function resolveArcadeRunOutcome({
  definition,
  context,
  result,
  alreadyCleared,
  flagWasSet = false,
}: ArcadeRunResolutionInput): ArcadeRunResolution {
  const stationFlag = getArcadeStationClearFlag(context);
  const solved = evaluateArcadeMissionSuccess(result, definition.mission);
  const firstClear = solved && !alreadyCleared && flagWasSet;
  const firstClearXp = definition.mission?.firstClearXp ?? 0;

  if (firstClear) {
    return {
      stationFlag,
      solved,
      firstClear,
      xpGained: firstClearXp,
      queuedDialogueId: definition.mission?.firstClearDialogueId ?? null,
      showReplayDisclaimer: false,
      resultTitleKey: 'arcade.result.firstClearTitle',
      resultColor: '#2ecc71',
      resultMessageKey: 'arcade.result.firstClearMessage',
    };
  }

  if (solved) {
    return {
      stationFlag,
      solved,
      firstClear,
      xpGained: 0,
      queuedDialogueId: null,
      showReplayDisclaimer: alreadyCleared,
      resultTitleKey: alreadyCleared ? 'arcade.result.trainingTitle' : 'arcade.result.stabilizedTitle',
      resultColor: '#00d4aa',
      resultMessageKey: alreadyCleared
        ? 'arcade.result.trainingMessage'
        : 'arcade.result.stabilizedMessage',
    };
  }

  return {
    stationFlag,
    solved,
    firstClear,
    xpGained: 0,
    queuedDialogueId: null,
    showReplayDisclaimer: alreadyCleared,
    resultTitleKey: 'arcade.result.needsWorkTitle',
    resultColor: '#ffb347',
    resultMessageKey: 'arcade.result.needsWorkMessage',
  };
}
