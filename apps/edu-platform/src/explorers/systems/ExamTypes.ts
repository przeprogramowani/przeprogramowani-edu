import type { GameFlag } from '../config/flags';
import type { BilingualText } from '../i18n/types';

export interface ExamDefinition {
  /** Unique exam identifier */
  id: string;
  /** Display title */
  title: BilingualText;
  /** Description shown before starting */
  description: BilingualText;
  /** Questions in this exam */
  questions: ExamQuestion[];
  /** Minimum correct answers to pass */
  passingScore: number;
  /** Rewards granted on passing */
  rewards: { xp: number; flags: GameFlag[] };
  /** Optional dialogue triggered on completion */
  completionDialogue?: string;
}

export interface ExamQuestion {
  /** Unique question ID within exam */
  id: string;
  /** Question text */
  text: BilingualText;
  /** Question type */
  type: 'single' | 'multi';
  /** Available answer options */
  options: ExamOption[];
  /** IDs of correct options */
  correctOptionIds: string[];
}

export interface ExamOption {
  /** Unique option ID within question */
  id: string;
  /** Option text */
  text: BilingualText;
}
