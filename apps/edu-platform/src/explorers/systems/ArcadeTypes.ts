import type { BilingualText } from '../i18n/types';

export type ArcadeGameType =
  | 'asteroid-range'
  | 'memory-matrix'
  | 'oscilloscope'
  | 'deep-scan'
  | 'switchyard'
  | 'fault-trace'
  | 'cartograph';

export interface ArcadeStationContext<
  MapKey extends string = string,
  ZoneId extends string = string,
  ArcadeGameId extends string = string,
> {
  mapKey: MapKey;
  zoneId: ZoneId;
  arcadeGameId: ArcadeGameId;
}

export interface ArcadeMissionConfig {
  requireCompleted?: boolean;
  minScore?: number;
  minScoreRatio?: number;
  firstClearDialogueId?: string;
  firstClearXp?: number;
}

export interface ArcadeGameDefinition {
  /** Unique game ID (globally unique across all levels, like exam IDs) */
  id: string;
  /** Game type — determines which renderer to use */
  type: ArcadeGameType;
  /** Bilingual title shown in the game overlay header */
  title: BilingualText;
  /** Bilingual description shown before starting */
  description: BilingualText;
  /** Difficulty level 1-5 — affects game parameters */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Game duration in seconds (for timed games; 0 = round-based) */
  durationSeconds: number;
  /** Authored mission success rules for this station */
  mission?: ArcadeMissionConfig;
}

/** Result reported by a game renderer when the game ends */
export interface ArcadeGameResult {
  score: number;
  maxScore?: number;
  completed: boolean;
}

/** Interface that all game renderers must implement */
export interface ArcadeGameRenderer {
  /** Set up game objects and input handlers */
  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void;
  /** Called every frame during gameplay */
  update(time: number, delta: number): void;
  /** Clean up all game objects and input handlers */
  destroy(): void;
  /** Whether the game has ended (renderer signals completion) */
  isFinished(): boolean;
  /** Get current score (for live HUD updates) */
  getScore(): number;
  /** Get result when finished */
  getResult(): ArcadeGameResult;
  /** Refresh any cached chrome strings to the active locale (optional). */
  applyLocale?(): void;
}
