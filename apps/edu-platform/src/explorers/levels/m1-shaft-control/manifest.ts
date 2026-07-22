import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-shaft-control',
  displayName: { pl: 'Ogród Sondy', en: 'Probe Grove' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'probe-comms',
      defaultDialogue: 'm1-probe-comms-log',
      flagVariants: [
        { flag: FLAGS.M1_SWIERSZCZ_ONLINE, dialogue: 'm1-probe-comms-post' },
        { flag: FLAGS.M1_PROBE_CORE_FOUND, dialogue: 'm1-probe-comms-riddle' },
      ],
    },
    {
      zoneId: 'crash-drone',
      defaultDialogue: 'm1-crash-drone',
      flagVariants: [
        { flag: FLAGS.M1_SWIERSZCZ_ONLINE, dialogue: 'm1-crash-drone-empty' },
        { flag: FLAGS.M1_PROBE_CORE_FOUND, dialogue: 'm1-crash-drone-assembly' },
      ],
    },
    {
      zoneId: 'probe-core',
      defaultDialogue: 'm1-probe-core',
      flagVariants: [{ flag: FLAGS.M1_PROBE_CORE_FOUND, dialogue: 'm1-probe-core-taken' }],
    },
    { zoneId: 'graveyard', defaultDialogue: 'm1-graveyard' },
    { zoneId: 'exam-protocol-2', defaultDialogue: 'm1-exam-protocol-2-already' },
    { zoneId: 'silence-door', defaultDialogue: 'm1-silence-door-locked' },
  ],
  quests,
  questCompletionDialogues: { 'q-m1-cricket': 'q-m1-cricket-complete' },
  exams,
  examCompletionDialogues: { 'm1-exam-protocol-2': 'm1-exam-protocol-2-done' },
  introDialogue: 'm1-grove-intro',
  introFlag: FLAGS.M1_GROVE_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Strefa Ciszy',
  introCinematicSubtitle: 'Ogród Sondy',
  conditionalIntros: [
    {
      dialogue: 'm1-return-grove',
      flag: FLAGS.M1_RETURN_GROVE_SEEN,
      requiredFlags: [FLAGS.M1_SENSORS_ONLINE],
      cinematicTitle: 'Powrót — Ogród Sondy',
    },
  ],
};
