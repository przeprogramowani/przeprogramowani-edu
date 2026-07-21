import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-uplink-bay',
  displayName: { pl: 'Grań Przekaźnika', en: 'Relay Crest' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'array-console',
      defaultDialogue: 'm1-array-console-need-pylons',
      flagVariants: [
        { flag: FLAGS.M1_SENSORS_ONLINE, dialogue: 'm1-array-console-post' },
        { flag: FLAGS.M1_CALIBRATION_ACTIVE, dialogue: 'm1-array-console-waiting' },
        { flag: FLAGS.M1_ARRAY_POWERED, dialogue: 'm1-array-console-start' },
      ],
    },
    {
      zoneId: 'pylon-west',
      defaultDialogue: 'm1-pylon-west-set',
      flagVariants: [
        { flag: FLAGS.M1_ARRAY_POWERED, dialogue: 'm1-pylon-hum' },
        { flag: FLAGS.M1_PYLON_EAST_SET, dialogue: 'm1-pylon-west-final' },
        { flag: FLAGS.M1_PYLON_WEST_SET, dialogue: 'm1-pylon-west-waiting' },
      ],
    },
    {
      zoneId: 'pylon-east',
      defaultDialogue: 'm1-pylon-east-set',
      flagVariants: [
        { flag: FLAGS.M1_ARRAY_POWERED, dialogue: 'm1-pylon-hum' },
        { flag: FLAGS.M1_PYLON_WEST_SET, dialogue: 'm1-pylon-east-final' },
        { flag: FLAGS.M1_PYLON_EAST_SET, dialogue: 'm1-pylon-east-waiting' },
      ],
    },
    { zoneId: 'ancient-portal', defaultDialogue: 'm1-ancient-portal' },
    { zoneId: 'ore-trace', defaultDialogue: 'm1-ore-trace' },
    {
      zoneId: 'dormant-node',
      defaultDialogue: 'm1-dormant-node',
      flagVariants: [{ flag: FLAGS.M1_SENSORS_ONLINE, dialogue: 'm1-dormant-node-dead' }],
    },
    {
      zoneId: 'swierszcz-crest',
      defaultDialogue: 'm1-swierszcz-crest',
      flagVariants: [{ flag: FLAGS.M1_SENSORS_ONLINE, dialogue: 'm1-swierszcz-crest-post' }],
    },
    { zoneId: 'exam-protocol-5', defaultDialogue: 'm1-exam-protocol-5-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m1-calibration': 'q-m1-calibration-complete' },
  exams,
  examCompletionDialogues: { 'm1-exam-protocol-5': 'm1-exam-protocol-5-done' },
  introDialogue: 'm1-crest-intro',
  introFlag: FLAGS.M1_CREST_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Strefa Ciszy',
  introCinematicSubtitle: 'Grań Przekaźnika',
};
