import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-landing-pad',
  displayName: { pl: 'Lądowisko', en: 'Landing Pad' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'camp-console',
      defaultDialogue: 'm1-camp-console-start',
      flagVariants: [
        { flag: FLAGS.M1_CAMP_ONLINE, dialogue: 'm1-camp-console-online' },
        { flag: FLAGS.M1_EYES_DONE, dialogue: 'm1-camp-report' },
        { flag: FLAGS.M1_EYES_ACTIVE, dialogue: 'm1-camp-console-waiting' },
      ],
    },
    {
      zoneId: 'survey-jungle-wall',
      defaultDialogue: 'm1-survey-wall',
      flagVariants: [{ flag: FLAGS.M1_EYES_WALL_SEEN, dialogue: 'm1-survey-wall-seen' }],
    },
    {
      zoneId: 'survey-burn-line',
      defaultDialogue: 'm1-survey-burn',
      flagVariants: [{ flag: FLAGS.M1_EYES_BURN_SEEN, dialogue: 'm1-survey-burn-seen' }],
    },
    {
      zoneId: 'survey-ridge-view',
      defaultDialogue: 'm1-survey-ridge',
      flagVariants: [{ flag: FLAGS.M1_EYES_RIDGE_SEEN, dialogue: 'm1-survey-ridge-seen' }],
    },
    { zoneId: 'wreck-debris-1', defaultDialogue: 'm1-wreck-debris' },
    { zoneId: 'wreck-debris-2', defaultDialogue: 'm1-wreck-debris' },
    {
      zoneId: 'preflight-panel',
      defaultDialogue: 'm1-preflight-panel',
      flagVariants: [{ flag: FLAGS.M1_SENSORS_ONLINE, dialogue: 'm1-preflight-final' }],
    },
    { zoneId: 'grove-door', defaultDialogue: 'm1-grove-door-locked' },
    { zoneId: 'exam-protocol-1', defaultDialogue: 'm1-exam-protocol-1-already' },
    {
      zoneId: 'moreau',
      defaultDialogue: 'm1-moreau-default',
      flagVariants: [
        { flag: FLAGS.M1_RETURN_CAMP_SEEN, dialogue: 'm1-moreau-epilogue' },
        { flag: FLAGS.M1_SENSORS_ONLINE, dialogue: 'm1-moreau-sensors' },
        { flag: FLAGS.M1_FIRST_ORE, dialogue: 'm1-moreau-ore' },
        { flag: FLAGS.M1_SWIERSZCZ_ONLINE, dialogue: 'm1-moreau-cricket' },
        { flag: FLAGS.M1_CAMP_ONLINE, dialogue: 'm1-moreau-camp' },
        { flag: FLAGS.M1_OLD_BURNS_FOUND, dialogue: 'm1-moreau-burns' },
      ],
    },
  ],
  quests,
  questCompletionDialogues: { 'q-m1-eyes': 'q-m1-eyes-complete' },
  exams,
  examCompletionDialogues: { 'm1-exam-protocol-1': 'm1-exam-protocol-1-done' },
  introDialogue: 'm1-landing-intro',
  introFlag: FLAGS.M1_LANDING_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Strefa Ciszy',
  introCinematicSubtitle: 'Lądowisko',
  conditionalIntros: [
    {
      dialogue: 'm1-return-camp',
      flag: FLAGS.M1_RETURN_CAMP_SEEN,
      requiredFlags: [FLAGS.M1_SENSORS_ONLINE],
      cinematicTitle: 'Powrót — Lądowisko',
    },
  ],
};
