import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm4-memory-vault',
  displayName: { pl: 'Bank Pamięci', en: 'The Memory Vault' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'memory-well',
      defaultDialogue: 'm4-memory-well-start',
      flagVariants: [
        { flag: FLAGS.M4_MEMORY_ONLINE, dialogue: 'm4-memory-well-post' },
        { flag: FLAGS.M4_MEMORY_ACTIVE, dialogue: 'm4-memory-well-waiting' },
      ],
    },
    {
      zoneId: 'core-1',
      defaultDialogue: 'm4-core-1',
      flagVariants: [{ flag: FLAGS.M4_CORES_BROUGHT, dialogue: 'm4-core-1-done' }],
    },
    { zoneId: 'core-2', defaultDialogue: 'm4-core-2' },
    { zoneId: 'beacon-1', defaultDialogue: 'm4-beacon-1' },
    {
      zoneId: 'beacon-2',
      defaultDialogue: 'm4-beacon-2',
      flagVariants: [{ flag: FLAGS.M4_SIDE_CHANNEL_ONLINE, dialogue: 'm4-beacon-2-done' }],
    },
    { zoneId: 'backup-crypt', defaultDialogue: 'm4-backup-crypt' },
    { zoneId: 'vein-trace', defaultDialogue: 'm4-vein-trace' },
    {
      zoneId: 'echo',
      defaultDialogue: 'm4-echo-approach',
      flagVariants: [{ flag: FLAGS.M4_MEMORY_ONLINE, dialogue: 'm4-echo-approach-post' }],
    },
    { zoneId: 'vault-door', defaultDialogue: 'm4-vault-door-back' },
    { zoneId: 'exam-protocol-20', defaultDialogue: 'm4-exam-protocol-20-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m4-second-channel': 'q-m4-second-channel-complete' },
  exams,
  examCompletionDialogues: { 'm4-exam-protocol-20': 'm4-exam-protocol-20-done' },
  introDialogue: 'm4-memory-intro',
  introFlag: FLAGS.M4_MEMORY_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 4 — Wymazany Indeks',
  introCinematicSubtitle: 'Bank Pamięci',
};
