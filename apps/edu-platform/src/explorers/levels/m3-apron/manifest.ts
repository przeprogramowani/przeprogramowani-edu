import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm3-apron',
  displayName: { pl: 'Przedpole', en: 'The Apron' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'camp-module',
      defaultDialogue: 'm3-camp-start',
      flagVariants: [
        { flag: FLAGS.M3_CAMP_ONLINE, dialogue: 'm3-camp-online-post' },
        { flag: FLAGS.M3_AUDIT_ACTIVE, dialogue: 'm3-camp-waiting' },
      ],
    },
    {
      zoneId: 'main-board',
      defaultDialogue: 'm3-main-board',
      flagVariants: [{ flag: FLAGS.M3_STATION_RECERTIFIED, dialogue: 'm3-main-board-recert' }],
    },
    {
      zoneId: 'audit-tower',
      defaultDialogue: 'm3-audit-tower',
      flagVariants: [
        { flag: FLAGS.M3_AUDIT_TOWER_CHECKED, dialogue: 'm3-audit-tower-done' },
        { flag: FLAGS.M3_AUDIT_ACTIVE, dialogue: 'm3-audit-tower-check' },
      ],
    },
    {
      zoneId: 'audit-anchor',
      defaultDialogue: 'm3-audit-anchor',
      flagVariants: [
        { flag: FLAGS.M3_AUDIT_ANCHOR_CHECKED, dialogue: 'm3-audit-anchor-done' },
        { flag: FLAGS.M3_AUDIT_ACTIVE, dialogue: 'm3-audit-anchor-check' },
      ],
    },
    {
      zoneId: 'audit-mast',
      defaultDialogue: 'm3-audit-mast',
      flagVariants: [
        { flag: FLAGS.M3_AUDIT_MAST_CHECKED, dialogue: 'm3-audit-mast-done' },
        { flag: FLAGS.M3_AUDIT_ACTIVE, dialogue: 'm3-audit-mast-check' },
      ],
    },
    {
      zoneId: 'moreau',
      defaultDialogue: 'm3-moreau',
      flagVariants: [
        { flag: FLAGS.M3_RETURN_APRON_SEEN, dialogue: 'm3-moreau-notebook' },
        { flag: FLAGS.M3_DIAGNOSTICS_ONLINE, dialogue: 'm3-moreau-diag' },
        { flag: FLAGS.M3_FIRST_CERT, dialogue: 'm3-moreau-cert' },
        { flag: FLAGS.M3_ISKRA_ONLINE, dialogue: 'm3-moreau-iskra' },
        { flag: FLAGS.M3_CAMP_ONLINE, dialogue: 'm3-moreau-camp' },
      ],
    },
    { zoneId: 'boneyard-door', defaultDialogue: 'm3-boneyard-door-locked' },
    { zoneId: 'exam-protocol-11', defaultDialogue: 'm3-exam-protocol-11-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m3-audit': 'q-m3-audit-complete' },
  exams,
  examCompletionDialogues: { 'm3-exam-protocol-11': 'm3-exam-protocol-11-done' },
  introDialogue: 'm3-apron-intro',
  introFlag: FLAGS.M3_APRON_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 3 — Próba Ognia',
  introCinematicSubtitle: 'Przedpole',
  conditionalIntros: [
    {
      dialogue: 'm3-return-apron',
      flag: FLAGS.M3_RETURN_APRON_SEEN,
      requiredFlags: [FLAGS.M3_DIAGNOSTICS_ONLINE],
      cinematicTitle: 'Powrót — Przedpole',
    },
  ],
};
