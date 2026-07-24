import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';
import { arcadeGames } from './games';

export const manifest: LevelManifest = {
  id: 'm1-profile-vault',
  displayName: { pl: 'Żyła', en: 'The Vein' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'survey-rig',
      defaultDialogue: 'm1-survey-rig-start',
      flagVariants: [
        { flag: FLAGS.M1_FIRST_ORE, dialogue: 'm1-survey-rig-post' },
        { flag: FLAGS.M1_DEEP_SCAN_DONE, dialogue: 'm1-survey-rig-unsealed' },
        { flag: FLAGS.M1_RIG_POWERED, dialogue: 'm1-survey-rig-scan' },
      ],
    },
    {
      zoneId: 'kit-core',
      defaultDialogue: 'm1-kit-core',
      flagVariants: [{ flag: FLAGS.M1_RIG_POWERED, dialogue: 'm1-kit-core-taken' }],
    },
    {
      zoneId: 'chamber-barrier',
      defaultDialogue: 'm1-chamber-barrier-sealed',
      flagVariants: [{ flag: FLAGS.M1_DEEP_SCAN_DONE, dialogue: 'm1-chamber-barrier-released' }],
    },
    {
      zoneId: 'pure-vein',
      defaultDialogue: 'm1-pure-vein-sealed',
      flagVariants: [
        { flag: FLAGS.M1_VEIN_EXTRACTED, dialogue: 'm1-pure-vein-post' },
        { flag: FLAGS.M1_DEEP_SCAN_DONE, dialogue: 'm1-pure-vein-extract' },
      ],
    },
    { zoneId: 'sample-marks', defaultDialogue: 'm1-sample-marks' },
    {
      zoneId: 'swierszcz-vein',
      defaultDialogue: 'm1-swierszcz-vein',
      flagVariants: [{ flag: FLAGS.M1_FIRST_ORE, dialogue: 'm1-swierszcz-vein-post' }],
    },
    { zoneId: 'exam-protocol-4', defaultDialogue: 'm1-exam-protocol-4-already' },
    { zoneId: 'crest-door', defaultDialogue: 'm1-crest-door-locked' },
  ],
  quests,
  questCompletionDialogues: { 'q-m1-first-vein': 'q-m1-first-vein-complete' },
  exams,
  examCompletionDialogues: { 'm1-exam-protocol-4': 'm1-exam-protocol-4-done' },
  arcadeGames,
  introDialogue: 'm1-vein-intro',
  introFlag: FLAGS.M1_VEIN_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Dżungla',
  introCinematicSubtitle: 'Żyła',
  conditionalIntros: [
    {
      dialogue: 'm1-return-vein',
      flag: FLAGS.M1_RETURN_VEIN_SEEN,
      requiredFlags: [FLAGS.M1_SENSORS_ONLINE],
      cinematicTitle: 'Powrót — Żyła',
    },
  ],
};
