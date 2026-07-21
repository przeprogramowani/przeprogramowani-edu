import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-planning-core',
  displayName: { pl: 'Rdzeń Planowania', en: 'The Planning Core' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'core-face',
      defaultDialogue: 'm2-core-face',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_MODULE_RESTORED, dialogue: 'm2-core-face-done' }],
    },
    {
      zoneId: 'plan-queue',
      defaultDialogue: 'm2-plan-queue',
      flagVariants: [{ flag: FLAGS.M2_VOID_INTERCEPT_PLAN_FOUND, dialogue: 'm2-plan-queue-done' }],
    },
    {
      zoneId: 'review-console',
      defaultDialogue: 'm2-review-console-start',
      flagVariants: [{ flag: FLAGS.M2_SOLO_REVIEW_DONE, dialogue: 'm2-review-console-done' }],
    },
    {
      zoneId: 'approval-pedestal',
      defaultDialogue: 'm2-approval-pedestal',
      flagVariants: [{ flag: FLAGS.M2_SOLO_REVIEW_DONE, dialogue: 'm2-approval-pedestal-done' }],
    },
    {
      zoneId: 'plan-echo',
      defaultDialogue: 'm2-plan-echo',
      flagVariants: [{ flag: FLAGS.M2_SOLO_REVIEW_DONE, dialogue: 'm2-plan-echo-silent' }],
    },
    {
      zoneId: 'core-warden-z9',
      defaultDialogue: 'm2-core-warden-z9',
      flagVariants: [{ flag: FLAGS.M2_SOLO_REVIEW_DONE, dialogue: 'm2-core-warden-z9-done' }],
    },
    { zoneId: 'moon-three-door', defaultDialogue: 'm2-moon-three-locked' },
    { zoneId: 'exam-solo-review', defaultDialogue: 'm2-exam-solo-review-already' },
  ],
  quests,
  exams,
  questCompletionDialogues: { 'q-m2-solo-review': 'm2-solo-review-complete' },
  examCompletionDialogues: { 'm2-exam-solo-review': 'm2-exam-solo-review-done' },
  introDialogue: 'm2-core-intro',
  introFlag: FLAGS.M2_CORE_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Rdzeń Planowania',
  introCinematicSubtitle: 'Ostatnia recenzja przed zatwierdzeniem',
};
