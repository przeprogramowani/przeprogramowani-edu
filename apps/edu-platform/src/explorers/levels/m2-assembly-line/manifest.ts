import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-assembly-line',
  displayName: { pl: 'Hala Montażowa', en: 'The Assembly Hall' },
  dialogues,
  interactionRoutes: [
    { zoneId: 'fabricator-line', defaultDialogue: 'm2-fabricator-line' },
    {
      zoneId: 'fabricator-line-2',
      defaultDialogue: 'm2-fabricator-line-2',
      flagVariants: [{ flag: FLAGS.M2_IMPL_CONTROL_DONE, dialogue: 'm2-fabricator-line-2-done' }],
    },
    { zoneId: 'checkpoint-gate-1', defaultDialogue: 'm2-checkpoint-gate-1' },
    { zoneId: 'checkpoint-gate-2', defaultDialogue: 'm2-checkpoint-gate-2' },
    {
      zoneId: 'control-console',
      defaultDialogue: 'm2-control-console-start',
      flagVariants: [{ flag: FLAGS.M2_IMPL_CONTROL_DONE, dialogue: 'm2-control-console-done' }],
    },
    {
      zoneId: 'line-archive',
      defaultDialogue: 'm2-line-archive',
      flagVariants: [{ flag: FLAGS.M2_INSIDER_WORK_ORDER_FOUND, dialogue: 'm2-line-archive-found' }],
    },
    {
      zoneId: 'foreman-f6',
      defaultDialogue: 'm2-foreman-f6',
      flagVariants: [{ flag: FLAGS.M2_IMPL_CONTROL_DONE, dialogue: 'm2-foreman-f6-done' }],
    },
    {
      zoneId: 'controller-cp5',
      defaultDialogue: 'm2-controller-cp5',
      flagVariants: [{ flag: FLAGS.M2_IMPL_CONTROL_DONE, dialogue: 'm2-controller-cp5-done' }],
    },
    { zoneId: 'frozen-runner', defaultDialogue: 'm2-frozen-runner' },
    { zoneId: 'planning-core-door', defaultDialogue: 'm2-core-locked' },
    { zoneId: 'exam-impl-control', defaultDialogue: 'm2-exam-impl-control-already' },
  ],
  quests,
  exams,
  questCompletionDialogues: { 'q-m2-impl-control': 'm2-impl-control-complete' },
  examCompletionDialogues: { 'm2-exam-impl-control': 'm2-exam-impl-control-done' },
  introDialogue: 'm2-assembly-intro',
  introFlag: FLAGS.M2_ASSEMBLY_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Hala Montażowa',
  introCinematicSubtitle: 'Wykonanie pod kontrolą',
};
