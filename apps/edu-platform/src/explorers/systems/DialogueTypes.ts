import type { GameFlag } from '../config/flags';
import type { GameEventValue } from '../events/GameEvents';
import type { BilingualText } from '../i18n/types';

export type DialogueMode = 'dialogue' | 'monologue' | 'system' | 'cinematic';

export interface DialogueLine {
  speaker: 'astronaut' | 'system' | string;
  text: BilingualText;
  mode: DialogueMode;
  autoAdvance?: number;
}

export interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  /** Flags to set on dialogue completion */
  setFlags?: GameFlag[];
  triggerEvent?: GameEventValue;
  /** Opens URL in an in-game iframe preview overlay */
  openUrl?: string;
  /** Title shown in the preview overlay header (default: 'Notatki z podróży') */
  openUrlTitle?: BilingualText;
  /** Adds a bookmark to player state and opens preview */
  addBookmark?: { url: string; title: BilingualText; afterDialogue?: string };
  /** Grant XP on dialogue completion */
  grantXp?: number;
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  onComplete?: DialogueEffect;
}
