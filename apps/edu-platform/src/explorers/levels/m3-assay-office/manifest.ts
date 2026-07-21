import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm3-assay-office',
  displayName: { pl: 'Izba Probiercza', en: 'The Assay Office' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'assay-desk',
      defaultDialogue: 'm3-assay-desk-start',
      flagVariants: [
        { flag: FLAGS.M3_DIAGNOSTICS_ONLINE, dialogue: 'm3-assay-desk-post' },
        { flag: FLAGS.M3_STANDARD_ACTIVE, dialogue: 'm3-assay-desk-waiting' },
      ],
    },
    {
      zoneId: 'main-dish',
      defaultDialogue: 'm3-main-dish',
      flagVariants: [
        { flag: FLAGS.M3_DIAGNOSTICS_ONLINE, dialogue: 'm3-main-dish-post' },
        { flag: FLAGS.M3_STANDARD_ACTIVE, dialogue: 'm3-main-dish-active' },
      ],
    },
    { zoneId: 'overlook', defaultDialogue: 'm3-overlook' },
    {
      zoneId: 'iskra-approach',
      defaultDialogue: 'm3-iskra-approach',
      flagVariants: [{ flag: FLAGS.M3_DIAGNOSTICS_ONLINE, dialogue: 'm3-iskra-approach-post' }],
    },
    { zoneId: 'exam-protocol-15', defaultDialogue: 'm3-exam-protocol-15-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m3-standard': 'q-m3-standard-complete' },
  exams,
  examCompletionDialogues: { 'm3-exam-protocol-15': 'm3-exam-protocol-15-done' },
  introDialogue: 'm3-assay-intro',
  introFlag: FLAGS.M3_ASSAY_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 3 — Próba Ognia',
  introCinematicSubtitle: 'Izba Probiercza',
};
