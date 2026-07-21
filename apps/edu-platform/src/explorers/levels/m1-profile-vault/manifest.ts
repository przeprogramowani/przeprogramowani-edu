import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-profile-vault',
  displayName: { pl: 'Magazyn Profili', en: 'Profile Vault' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'crew-profile-cache',
      defaultDialogue: 'm1-profile-cache-start',
      flagVariants: [{ flag: FLAGS.M1_MOREAU_CONTEXT_DONE, dialogue: 'm1-profile-cache-done' }],
    },
    {
      zoneId: 'moreau-profile',
      defaultDialogue: 'm1-moreau-profile',
      flagVariants: [{ flag: FLAGS.M1_MOREAU_AWAKE, dialogue: 'm1-moreau-profile-done' }],
    },
    {
      zoneId: 'recall-code',
      defaultDialogue: 'm1-recall-code',
      flagVariants: [{ flag: FLAGS.M1_HARRIS_RECALL_DISCOVERED, dialogue: 'm1-recall-code-done' }],
    },
    {
      zoneId: 'wake-relay',
      defaultDialogue: 'm1-wake-relay',
      flagVariants: [{ flag: FLAGS.M1_MOREAU_AWAKE, dialogue: 'm1-wake-relay-done' }],
    },
    {
      zoneId: 'archive-echo',
      defaultDialogue: 'm1-archive-echo',
      flagVariants: [{ flag: FLAGS.M1_MOREAU_AWAKE, dialogue: 'm1-archive-echo-done' }],
    },
    {
      zoneId: 'vault-indexer',
      defaultDialogue: 'm1-vault-indexer',
      flagVariants: [{ flag: FLAGS.M1_MOREAU_CONTEXT_DONE, dialogue: 'm1-vault-indexer-done' }],
    },
    { zoneId: 'uplink-bay-door', defaultDialogue: 'm1-uplink-door-locked' },
    { zoneId: 'exam-agent-onboarding', defaultDialogue: 'm1-exam-agent-onboarding-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m1-moreau-onboarding': 'm1-moreau-onboarding-complete' },
  exams,
  examCompletionDialogues: { 'm1-exam-agent-onboarding': 'm1-exam-agent-onboarding-done' },
  introDialogue: 'm1-profile-intro',
  introFlag: FLAGS.M1_PROFILE_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Magazyn Profili',
  introCinematicSubtitle: 'Archiwum danych załogi ODYSSEY',
};
