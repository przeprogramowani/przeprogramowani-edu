import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-echo-depths',
  displayName: { pl: 'Strefa Ciszy', en: 'The Silence Zone' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'field-console',
      defaultDialogue: 'm1-field-console-start',
      flagVariants: [
        { flag: FLAGS.M1_SILENCE_DONE, dialogue: 'm1-field-console-post' },
        { flag: FLAGS.M1_SILENCE_ACTIVE, dialogue: 'm1-field-console-waiting' },
      ],
    },
    {
      zoneId: 'node-deep',
      defaultDialogue: 'm1-node-deep-inert',
      flagVariants: [
        { flag: FLAGS.M1_NODE_DEEP_ISOLATED, dialogue: 'm1-node-deep-done' },
        { flag: FLAGS.M1_SILENCE_ACTIVE, dialogue: 'm1-node-deep-isolate' },
      ],
    },
    {
      zoneId: 'node-north',
      defaultDialogue: 'm1-node-north-inert',
      flagVariants: [
        { flag: FLAGS.M1_NODE_NORTH_ISOLATED, dialogue: 'm1-node-north-done' },
        { flag: FLAGS.M1_NODE_DEEP_ISOLATED, dialogue: 'm1-node-north-isolate' },
        { flag: FLAGS.M1_SILENCE_ACTIVE, dialogue: 'm1-node-north-warning' },
      ],
    },
    {
      zoneId: 'node-east',
      defaultDialogue: 'm1-node-east-inert',
      flagVariants: [
        { flag: FLAGS.M1_NODE_EAST_ISOLATED, dialogue: 'm1-node-east-done' },
        { flag: FLAGS.M1_NODE_NORTH_ISOLATED, dialogue: 'm1-node-east-isolate' },
        { flag: FLAGS.M1_SILENCE_ACTIVE, dialogue: 'm1-node-east-warning' },
      ],
    },
    { zoneId: 'synaptit-outcrop', defaultDialogue: 'm1-synaptit-outcrop' },
    {
      zoneId: 'swierszcz',
      defaultDialogue: 'm1-swierszcz-nervous',
      flagVariants: [{ flag: FLAGS.M1_SILENCE_DONE, dialogue: 'm1-swierszcz-calm' }],
    },
    { zoneId: 'silence-orb', defaultDialogue: 'm1-silence-orb' },
    { zoneId: 'exam-protocol-3', defaultDialogue: 'm1-exam-protocol-3-already' },
    { zoneId: 'vein-door', defaultDialogue: 'm1-vein-door-locked' },
  ],
  quests,
  questCompletionDialogues: { 'q-m1-silence': 'q-m1-silence-complete' },
  exams,
  examCompletionDialogues: { 'm1-exam-protocol-3': 'm1-exam-protocol-3-done' },
  introDialogue: 'm1-silence-intro',
  introFlag: FLAGS.M1_SILENCE_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Dżungla',
  introCinematicSubtitle: 'Strefa Ciszy',
  conditionalIntros: [
    {
      dialogue: 'm1-return-silence',
      flag: FLAGS.M1_RETURN_SILENCE_SEEN,
      requiredFlags: [FLAGS.M1_SENSORS_ONLINE],
      cinematicTitle: 'Powrót — Strefa Ciszy',
    },
  ],
};
