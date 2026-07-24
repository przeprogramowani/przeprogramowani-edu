import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-drafting-hall',
  displayName: { pl: 'Warsztat', en: 'The Service Bay' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'service-terminal',
      defaultDialogue: 'm2-service-terminal-start',
      flagVariants: [{ flag: FLAGS.M2_SOPEL_ONLINE, dialogue: 'm2-service-terminal-post' }],
    },
    {
      zoneId: 'queue-board',
      defaultDialogue: 'm2-queue-board',
      flagVariants: [{ flag: FLAGS.M2_SOPEL_ONLINE, dialogue: 'm2-queue-board-cleared' }],
    },
    {
      zoneId: 's0pl',
      defaultDialogue: 'm2-s0pl-frozen',
      flagVariants: [{ flag: FLAGS.M2_SOPEL_ONLINE, dialogue: 'm2-s0pl-empty' }],
    },
    { zoneId: 'bot-row-1', defaultDialogue: 'm2-bot-row' },
    { zoneId: 'bot-row-2', defaultDialogue: 'm2-bot-row' },
    { zoneId: 'derailed-tram', defaultDialogue: 'm2-derailed-tram' },
    { zoneId: 'sopel-return', defaultDialogue: 'm2-sopel-return' },
    { zoneId: 'deadlock-door', defaultDialogue: 'm2-deadlock-door-locked' },
    { zoneId: 'exam-protocol-7', defaultDialogue: 'm2-exam-protocol-7-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m2-new-order': 'q-m2-new-order-complete' },
  exams,
  examCompletionDialogues: { 'm2-exam-protocol-7': 'm2-exam-protocol-7-done' },
  introDialogue: 'm2-service-intro',
  introFlag: FLAGS.M2_SERVICE_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Zamrożony Plan',
  introCinematicSubtitle: 'Warsztat',
  conditionalIntros: [
    {
      dialogue: 'm2-return-service',
      flag: FLAGS.M2_RETURN_SERVICE_SEEN,
      requiredFlags: [FLAGS.M2_PLANNING_ONLINE],
      cinematicTitle: 'Powrót — Warsztat',
    },
  ],
};
