import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm4-courier-yard',
  displayName: { pl: 'Zajezdnia', en: 'The Courier Yard' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'service-well',
      defaultDialogue: 'm4-service-start',
      flagVariants: [
        { flag: FLAGS.M4_ECHO_ONLINE, dialogue: 'm4-service-post' },
        { flag: FLAGS.M4_COURIER_HUNT_ACTIVE, dialogue: 'm4-service-log' },
      ],
    },
    {
      zoneId: 'yard-power',
      defaultDialogue: 'm4-yard-power',
      flagVariants: [{ flag: FLAGS.M4_YARD_POWERED, dialogue: 'm4-yard-power-done' }],
    },
    {
      zoneId: 'echo-unit',
      defaultDialogue: 'm4-echo-unit',
      flagVariants: [{ flag: FLAGS.M4_ECHO_ONLINE, dialogue: 'm4-nest-layout' }],
    },
    {
      zoneId: 'misplaced-canister',
      defaultDialogue: 'm4-misplaced-canister',
      flagVariants: [{ flag: FLAGS.M4_GHOST_COURSE_SEEN, dialogue: 'm4-misplaced-canister-seen' }],
    },
    { zoneId: 'index-door', defaultDialogue: 'm4-index-door-locked' },
    { zoneId: 'exam-protocol-17', defaultDialogue: 'm4-exam-protocol-17-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m4-last-route': 'q-m4-last-route-complete' },
  exams,
  examCompletionDialogues: { 'm4-exam-protocol-17': 'm4-exam-protocol-17-done' },
  introDialogue: 'm4-courier-intro',
  introFlag: FLAGS.M4_COURIER_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 4 — Wymazany Indeks',
  introCinematicSubtitle: 'Zajezdnia',
  conditionalIntros: [
    {
      dialogue: 'm4-return-courier',
      flag: FLAGS.M4_RETURN_COURIER_SEEN,
      requiredFlags: [FLAGS.M4_MEMORY_ONLINE],
      cinematicTitle: 'Powrót — Zajezdnia',
    },
  ],
};
