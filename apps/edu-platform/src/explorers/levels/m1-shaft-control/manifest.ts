import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-shaft-control',
  displayName: { pl: 'Podstacja Szybu 03', en: 'Shaft Substation 03' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'shaft-controller',
      defaultDialogue: 'm1-shaft-controller-start',
      flagVariants: [{ flag: FLAGS.M1_SHAFT_POLICY_DONE, dialogue: 'm1-shaft-controller-done' }],
    },
    {
      zoneId: 'bootloader-core',
      defaultDialogue: 'm1-bootloader-core',
      flagVariants: [{ flag: FLAGS.M1_SHAFT_POLICY_DONE, dialogue: 'm1-bootloader-core-done' }],
    },
    {
      zoneId: 'signature-beacon',
      defaultDialogue: 'm1-signature-beacon-dormant',
      flagVariants: [{ flag: FLAGS.M1_VOID_AWARE_OF_ODYSSEY, dialogue: 'm1-signature-beacon-active' }],
    },
    {
      zoneId: 'shaft-custodian',
      defaultDialogue: 'm1-shaft-custodian',
      flagVariants: [{ flag: FLAGS.M1_SHAFT_POLICY_DONE, dialogue: 'm1-shaft-custodian-done' }],
    },
    {
      zoneId: 'policy-sentinel',
      defaultDialogue: 'm1-policy-sentinel',
      flagVariants: [{ flag: FLAGS.M1_SHAFT_POLICY_DONE, dialogue: 'm1-policy-sentinel-done' }],
    },
    { zoneId: 'profile-vault-door', defaultDialogue: 'm1-profile-door-locked' },
    { zoneId: 'exam-safe-bootstrap', defaultDialogue: 'm1-exam-safe-bootstrap-already' },
  ],
  quests,
  exams,
  examCompletionDialogues: { 'm1-exam-safe-bootstrap': 'm1-exam-safe-bootstrap-done' },
  introDialogue: 'm1-shaft-intro',
  introFlag: FLAGS.M1_SHAFT_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Podstacja Szybu 03',
  introCinematicSubtitle: 'Aktywna instalacja VOID',
};
