import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-landing-pad',
  displayName: { pl: 'Zarośnięte Lądowisko', en: 'Overgrown Landing' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'operation-archive',
      defaultDialogue: 'm1-operation-archive-start',
      flagVariants: [{ flag: FLAGS.M1_PRD_AUDIT_DONE, dialogue: 'm1-operation-archive-done' }],
    },
    {
      zoneId: 'landing-marker',
      defaultDialogue: 'm1-landing-marker',
      flagVariants: [{ flag: FLAGS.M1_PRD_AUDIT_DONE, dialogue: 'm1-landing-marker-done' }],
    },
    { zoneId: 'drone1', defaultDialogue: 'm1-inactive-drone' },
    { zoneId: 'drone2', defaultDialogue: 'm1-inactive-drone' },
    { zoneId: 'drone3', defaultDialogue: 'm1-inactive-drone' },
    { zoneId: 'drone4', defaultDialogue: 'm1-inactive-drone' },
    {
      zoneId: 'disabled-scout',
      defaultDialogue: 'm1-disabled-scout',
      flagVariants: [{ flag: FLAGS.M1_PRD_AUDIT_DONE, dialogue: 'm1-disabled-scout-done' }],
    },
    {
      zoneId: 'canopy-surveyor',
      defaultDialogue: 'm1-canopy-surveyor',
      flagVariants: [{ flag: FLAGS.M1_PRD_AUDIT_DONE, dialogue: 'm1-canopy-surveyor-done' }],
    },
    { zoneId: 'echo-depths-door', defaultDialogue: 'm1-echo-door-locked' },
    { zoneId: 'exam-prd-contract', defaultDialogue: 'm1-exam-prd-contract-already' },
  ],
  quests,
  exams,
  examCompletionDialogues: { 'm1-exam-prd-contract': 'm1-exam-prd-contract-done' },
  introDialogue: 'm1-landing-intro',
  introFlag: FLAGS.M1_LANDING_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Zarośnięte Lądowisko',
  introCinematicSubtitle: 'Strefa wydobywcza VOID',
};
