import type { GameFlag } from '../config/flags';
import type { Locale } from '../utils/locale';

// --------------- Event name constants ---------------

export const GameEvents = {
  // State
  STATE_CHANGED: 'state:changed',

  // Scene lifecycle
  SCENE_ENTERED: 'scene:entered',
  TRANSITION_START: 'transition:start',
  TRANSITION_COMPLETE: 'transition:complete',

  // Dialogue
  DIALOGUE_SHOW: 'dialogue:show',
  DIALOGUE_DISMISSED: 'dialogue:dismissed',

  // Interaction
  INTERACTION_TRIGGERED: 'interaction:triggered',

  // Quests
  QUEST_ACTIVATE_REQUEST: 'quest:activate-request',
  QUEST_COMPLETE_REQUEST: 'quest:complete-request',
  QUEST_ACTIVATED: 'quest:activated',
  QUEST_COMPLETED: 'quest:completed',
  QUEST_OBJECTIVE_COMPLETED: 'quest:objective-completed',

  // Terminal (Svelte <-> Phaser bridge)
  TERMINAL_COMMAND: 'terminal:command',
  TERMINAL_FOCUS_CHANGED: 'terminal:focus-changed',
  TERMINAL_UNLOCK: 'terminal:unlock',

  // Progression
  XP_GAINED: 'xp:gained',
  RANK_UP: 'rank:up',

  // Flags
  FLAG_SET: 'flag:set',

  // Exams
  EXAM_SHOW: 'exam:show',
  EXAM_COMPLETED: 'exam:completed',
  EXAM_DISMISSED: 'exam:dismissed',

  // Arcade
  ARCADE_SHOW: 'arcade:show',
  ARCADE_COMPLETED: 'arcade:completed',
  ARCADE_DISMISSED: 'arcade:dismissed',

  // Preview
  PREVIEW_SHOW: 'preview:show',
  PREVIEW_DISMISSED: 'preview:dismissed',

  // Scan
  SCAN_REQUESTED: 'scan:requested',
  SCAN_RESPONSE: 'scan:response',

  // External grants (applied via API, picked up by polling)
  GRANTS_APPLIED: 'grants:applied',

  // Locale
  LOCALE_CHANGED: 'locale:changed',
} as const;

export type GameEventKey = keyof typeof GameEvents;
export type GameEventValue = (typeof GameEvents)[GameEventKey];

// --------------- Payload interfaces ---------------

export interface StateChangedPayload {
  state: import('../state/types').GameState;
}

export interface SceneEnteredPayload {
  mapKey: string;
  displayName: import('../i18n/types').BilingualText;
}

export interface TransitionStartPayload {
  targetMap: string;
  spawnX: number;
  spawnY: number;
}
// TransitionComplete — no payload

export interface DialogueShowPayload {
  dialogueId: string;
}
// DialogueDismissed — no payload

export interface InteractionTriggeredPayload {
  objectId: string;
  objectType: 'trigger' | 'door' | 'terminal' | 'exam' | 'arcade';
  eventId: string;
  properties: Record<string, unknown>;
}

export interface QuestActivatedPayload {
  questId: string;
  title: string;
}

export interface QuestCompleteRequestPayload {
  questId: string;
}

export interface QuestCompletedPayload {
  questId: string;
  rewards: { xp: number; flags: GameFlag[] };
}

export interface QuestObjectiveCompletedPayload {
  questId: string;
  objectiveLabel: string;
  doneCount: number;
  totalCount: number;
}

export interface TerminalCommandPayload {
  command: string;
  args: string[];
}

export interface TerminalFocusChangedPayload {
  focused: boolean;
}
// TerminalUnlock — no payload

export interface XpGainedPayload {
  amount: number;
  total: number;
}

export interface RankUpPayload {
  oldTier: number;
  oldName: string;
  newTier: number;
  newName: string;
  totalXP: number;
}

export interface FlagSetPayload {
  flag: GameFlag;
}

export interface ExamShowPayload {
  examId: string;
}

export interface ExamCompletedPayload {
  examId: string;
  score: number;
  total: number;
  passed: boolean;
  rewards?: { xp: number; flags: GameFlag[] };
}
// ExamDismissed — no payload

export interface ArcadeShowPayload {
  mapKey: string;
  zoneId: string;
  arcadeGameId: string;
}

export interface ArcadeCompletedPayload {
  mapKey: string;
  zoneId: string;
  arcadeGameId: string;
  stationFlag: string;
  score: number;
  maxScore?: number;
  solved: boolean;
  firstClear: boolean;
  xpGained: number;
  timestamp: number;
}
// ArcadeDismissed — no payload

export interface PreviewShowPayload {
  url: string;
  title?: string;
}
// PreviewDismissed — no payload

// ScanRequested — no payload

export interface ScanResponsePayload {
  nearbyObjects: Array<{ id: string; name: string; distance: number }>;
}

export interface GrantsAppliedPayload {
  grants: Array<{ questTitle: string; xp: number }>;
  totalXp: number;
}

export interface LocaleChangedPayload {
  locale: Locale;
}
