import type { DialogueSequence } from '../systems/DialogueTypes';
import type { QuestDefinition } from '../systems/QuestManager';
import type { ExamDefinition } from '../systems/ExamTypes';
import type { ArcadeGameDefinition } from '../systems/ArcadeTypes';
import type { BilingualText } from '../i18n/types';

export interface InteractionRoute {
  /** Matches zone objectId in Tiled map */
  zoneId: string;
  /** Default dialogue ID when no flag variant matches */
  defaultDialogue: string;
  /** Flag-gated dialogue variants, checked in order — first match wins */
  flagVariants?: {
    flag: string;
    dialogue: string;
  }[];
}

export interface LevelManifest {
  /** Map key — must match Tiled JSON filename in public/game/maps/ */
  id: string;
  /** Bilingual display name for HUD */
  displayName: BilingualText;

  /** All dialogue sequences for this level (keyed by dialogue ID) */
  dialogues: Record<string, DialogueSequence>;

  /** Dialogue routing — replaces hardcoded if/else in GameScene */
  interactionRoutes: InteractionRoute[];

  /** Quest definitions for this level (optional) */
  quests?: QuestDefinition[];

  /** Quest completion → dialogue mapping (optional) */
  questCompletionDialogues?: Record<string, string>;

  /** Exam definitions for this level (optional) */
  exams?: ExamDefinition[];

  /** Exam completion → dialogue mapping (optional) */
  examCompletionDialogues?: Record<string, string>;

  /** Arcade game definitions for this level (optional) */
  arcadeGames?: ArcadeGameDefinition[];

  /** Intro dialogue played on first visit (optional) */
  introDialogue?: string;
  /** Flag to mark intro as seen — prevents replay (optional) */
  introFlag?: string;
  /** Title text for the cinematic black-screen intro card (optional — omit to skip the card) */
  introCinematicTitle?: string;
  /** Subtitle text for the cinematic intro card (optional) */
  introCinematicSubtitle?: string;
}
