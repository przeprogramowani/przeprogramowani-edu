import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm3-boneyard',
  displayName: { pl: 'Złomowisko', en: 'The Boneyard' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'service-module',
      defaultDialogue: 'm3-service-start',
      flagVariants: [
        { flag: FLAGS.M3_ISKRA_ONLINE, dialogue: 'm3-service-post' },
        { flag: FLAGS.M3_FAULT_HUNT_ACTIVE, dialogue: 'm3-service-log' },
      ],
    },
    {
      zoneId: 'i5kra',
      defaultDialogue: 'm3-i5kra',
      flagVariants: [{ flag: FLAGS.M3_ISKRA_ONLINE, dialogue: 'm3-i5kra-post' }],
    },
    { zoneId: 'wreck-1', defaultDialogue: 'm3-wreck-1' },
    { zoneId: 'wreck-2', defaultDialogue: 'm3-wreck-2' },
    { zoneId: 'iskra-return', defaultDialogue: 'm3-iskra-return' },
    { zoneId: 'trial-door', defaultDialogue: 'm3-trial-door-locked' },
    { zoneId: 'exam-protocol-12', defaultDialogue: 'm3-exam-protocol-12-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m3-true-fault': 'q-m3-true-fault-complete' },
  exams,
  examCompletionDialogues: { 'm3-exam-protocol-12': 'm3-exam-protocol-12-done' },
  introDialogue: 'm3-boneyard-intro',
  introFlag: FLAGS.M3_BONEYARD_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 3 — Próba Ognia',
  introCinematicSubtitle: 'Złomowisko',
  conditionalIntros: [
    {
      dialogue: 'm3-return-boneyard',
      flag: FLAGS.M3_RETURN_BONEYARD_SEEN,
      requiredFlags: [FLAGS.M3_DIAGNOSTICS_ONLINE],
      cinematicTitle: 'Powrót — Złomowisko',
    },
  ],
};
