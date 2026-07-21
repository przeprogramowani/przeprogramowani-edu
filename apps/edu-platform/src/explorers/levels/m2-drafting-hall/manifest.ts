import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-drafting-hall',
  displayName: { pl: 'Kreślarnia', en: 'The Drafting Hall' },
  dialogues,
  interactionRoutes: [
    { zoneId: 'drafting-table-1', defaultDialogue: 'm2-drafting-table-1' },
    { zoneId: 'drafting-table-2', defaultDialogue: 'm2-drafting-table-2' },
    {
      zoneId: 'model-plinth',
      defaultDialogue: 'm2-model-plinth',
      flagVariants: [{ flag: FLAGS.M2_ARCHITECTURE_DONE, dialogue: 'm2-model-plinth-done' }],
    },
    {
      zoneId: 'architecture-console',
      defaultDialogue: 'm2-architecture-console-start',
      flagVariants: [{ flag: FLAGS.M2_ARCHITECTURE_DONE, dialogue: 'm2-architecture-console-done' }],
    },
    {
      zoneId: 'approach-array',
      defaultDialogue: 'm2-approach-array',
      flagVariants: [{ flag: FLAGS.M2_INBOUND_CONTACT_LOGGED, dialogue: 'm2-approach-array-logged' }],
    },
    {
      zoneId: 'draftsman-a3',
      defaultDialogue: 'm2-draftsman-a3',
      flagVariants: [{ flag: FLAGS.M2_ARCHITECTURE_DONE, dialogue: 'm2-draftsman-a3-done' }],
    },
    { zoneId: 'assembly-line-door', defaultDialogue: 'm2-assembly-locked' },
    { zoneId: 'exam-agent-architecture', defaultDialogue: 'm2-exam-agent-architecture-already' },
  ],
  quests,
  exams,
  questCompletionDialogues: { 'q-m2-agent-architecture': 'm2-agent-architecture-complete' },
  examCompletionDialogues: { 'm2-exam-agent-architecture': 'm2-exam-agent-architecture-done' },
  introDialogue: 'm2-drafting-intro',
  introFlag: FLAGS.M2_DRAFTING_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Kreślarnia',
  introCinematicSubtitle: 'Architektura operacji VOID',
};
