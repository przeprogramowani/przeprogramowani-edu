import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm4-erased-index',
  displayName: { pl: 'Wymazany Indeks', en: 'The Erased Index' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'catalog-head',
      defaultDialogue: 'm4-catalog-head',
      flagVariants: [
        { flag: FLAGS.M4_ENTROPY_CATALOGUED, dialogue: 'm4-catalog-head-post' },
        { flag: FLAGS.M4_THREAD_ACTIVE, dialogue: 'm4-catalog-head-waiting' },
      ],
    },
    {
      zoneId: 'spindle-1',
      defaultDialogue: 'm4-spindle-1',
      flagVariants: [{ flag: FLAGS.M4_SPINDLE_1_LINKED, dialogue: 'm4-spindle-1-done' }],
    },
    {
      zoneId: 'spindle-2',
      defaultDialogue: 'm4-spindle-order-warn',
      flagVariants: [
        { flag: FLAGS.M4_SPINDLE_2_LINKED, dialogue: 'm4-spindle-2-done' },
        { flag: FLAGS.M4_SPINDLE_1_LINKED, dialogue: 'm4-spindle-2' },
      ],
    },
    {
      zoneId: 'spindle-3',
      defaultDialogue: 'm4-spindle-order-warn',
      flagVariants: [
        { flag: FLAGS.M4_SPINDLE_3_LINKED, dialogue: 'm4-spindle-3-done' },
        { flag: FLAGS.M4_SPINDLE_2_LINKED, dialogue: 'm4-spindle-3' },
      ],
    },
    {
      zoneId: 'vein',
      defaultDialogue: 'm4-vein',
      flagVariants: [{ flag: FLAGS.M4_VEIN_TRACE_SEEN, dialogue: 'm4-vein-done' }],
    },
    {
      zoneId: 'echo',
      defaultDialogue: 'm4-echo-nervous',
      flagVariants: [{ flag: FLAGS.M4_ENTROPY_CATALOGUED, dialogue: 'm4-echo-calm' }],
    },
    {
      zoneId: 'lower-reading-room',
      defaultDialogue: 'm4-lower-reading-room',
    },
    { zoneId: 'vault-door', defaultDialogue: 'm4-vault-door-locked' },
    { zoneId: 'exam-protocol-18', defaultDialogue: 'm4-exam-protocol-18-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m4-thread': 'q-m4-thread-complete' },
  exams,
  examCompletionDialogues: { 'm4-exam-protocol-18': 'm4-exam-protocol-18-done' },
  introDialogue: 'm4-index-intro',
  introFlag: FLAGS.M4_INDEX_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 4 — Wymazany Indeks',
  introCinematicSubtitle: 'Wymazany Indeks',
  conditionalIntros: [
    {
      dialogue: 'm4-return-index',
      flag: FLAGS.M4_RETURN_INDEX_SEEN,
      requiredFlags: [FLAGS.M4_MEMORY_ONLINE],
      cinematicTitle: 'Powrót — Wymazany Indeks',
    },
  ],
};
