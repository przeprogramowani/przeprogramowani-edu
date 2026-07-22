import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';
import { arcadeGames } from './games';

export const manifest: LevelManifest = {
  id: 'm4-map-vault',
  displayName: { pl: 'Skarbiec Map', en: 'The Map Vault' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'map-head',
      defaultDialogue: 'm4-map-head-start',
      flagVariants: [
        { flag: FLAGS.M4_MASTER_MAP, dialogue: 'm4-map-head-post' },
        { flag: FLAGS.M4_MAP_ACTIVE, dialogue: 'm4-map-head-waiting' },
      ],
    },
    {
      zoneId: 'lifts-power',
      defaultDialogue: 'm4-lifts-power',
      flagVariants: [{ flag: FLAGS.M4_LIFTS_POWERED, dialogue: 'm4-lifts-power-done' }],
    },
    {
      zoneId: 'kern',
      defaultDialogue: 'm4-kern-vault',
      flagVariants: [
        { flag: FLAGS.M4_MASTER_MAP, dialogue: 'm4-kern-vault-post' },
        { flag: FLAGS.M4_KERN_FILE_MISMATCH_SEEN, dialogue: 'm4-kern-vault-file' },
        { flag: FLAGS.M4_MAP_ACTIVE, dialogue: 'm4-kern-vault-mapping' },
      ],
    },
    {
      zoneId: 'kern-file',
      defaultDialogue: 'm4-kern-file',
      flagVariants: [{ flag: FLAGS.M4_KERN_FILE_MISMATCH_SEEN, dialogue: 'm4-kern-file-seen' }],
    },
    {
      zoneId: 'medbay-access',
      defaultDialogue: 'm4-medbay-access',
      flagVariants: [{ flag: FLAGS.M4_MEDBAY_INDEX_SEEN, dialogue: 'm4-medbay-access-seen' }],
    },
    { zoneId: 'vein-1', defaultDialogue: 'm4-vault-vein' },
    { zoneId: 'vein-2', defaultDialogue: 'm4-vault-vein' },
    {
      zoneId: 'echo',
      defaultDialogue: 'm4-echo-vault',
      flagVariants: [{ flag: FLAGS.M4_MASTER_MAP, dialogue: 'm4-echo-vault-post' }],
    },
    { zoneId: 'memory-door', defaultDialogue: 'm4-memory-door-locked' },
    { zoneId: 'exam-protocol-19', defaultDialogue: 'm4-exam-protocol-19-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m4-first-map': 'q-m4-first-map-complete' },
  exams,
  examCompletionDialogues: { 'm4-exam-protocol-19': 'm4-exam-protocol-19-done' },
  arcadeGames,
  introDialogue: 'm4-vault-intro',
  introFlag: FLAGS.M4_VAULT_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 4 — Wymazany Indeks',
  introCinematicSubtitle: 'Skarbiec Map',
  conditionalIntros: [
    {
      dialogue: 'm4-return-vault',
      flag: FLAGS.M4_RETURN_VAULT_SEEN,
      requiredFlags: [FLAGS.M4_MEMORY_ONLINE],
      cinematicTitle: 'Powrót — Skarbiec Map',
    },
  ],
};
