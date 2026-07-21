import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-staging-yard',
  displayName: { pl: 'Zajezdnia Etapowa', en: 'The Staging Yard' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'schedule-board',
      defaultDialogue: 'm2-schedule-board',
      flagVariants: [{ flag: FLAGS.M2_MILESTONES_DONE, dialogue: 'm2-schedule-board-done' }],
    },
    {
      zoneId: 'milestone-console',
      defaultDialogue: 'm2-milestone-console-start',
      flagVariants: [{ flag: FLAGS.M2_MILESTONES_DONE, dialogue: 'm2-milestone-console-done' }],
    },
    {
      zoneId: 'tram-alpha',
      defaultDialogue: 'm2-tram-alpha',
      flagVariants: [{ flag: FLAGS.M2_MILESTONES_DONE, dialogue: 'm2-tram-alpha-done' }],
    },
    {
      zoneId: 'tram-beta',
      defaultDialogue: 'm2-tram-beta',
      flagVariants: [{ flag: FLAGS.M2_MILESTONES_DONE, dialogue: 'm2-tram-beta-done' }],
    },
    { zoneId: 'tram-gamma', defaultDialogue: 'm2-tram-gamma' },
    { zoneId: 'frozen-loader', defaultDialogue: 'm2-frozen-loader' },
    { zoneId: 'heat-plant', defaultDialogue: 'm2-heat-plant' },
    {
      zoneId: 'dispatcher-d2',
      defaultDialogue: 'm2-dispatcher-d2',
      flagVariants: [{ flag: FLAGS.M2_MILESTONES_DONE, dialogue: 'm2-dispatcher-d2-done' }],
    },
    {
      zoneId: 'stoker-b6',
      defaultDialogue: 'm2-stoker-b6',
      flagVariants: [{ flag: FLAGS.M2_MILESTONES_DONE, dialogue: 'm2-stoker-b6-done' }],
    },
    { zoneId: 'drafting-hall-door', defaultDialogue: 'm2-drafting-locked' },
    { zoneId: 'exam-mvp-milestones', defaultDialogue: 'm2-exam-mvp-milestones-already' },
  ],
  quests,
  exams,
  questCompletionDialogues: { 'q-m2-mvp-milestones': 'm2-mvp-milestones-complete' },
  examCompletionDialogues: { 'm2-exam-mvp-milestones': 'm2-exam-mvp-milestones-done' },
  introDialogue: 'm2-staging-intro',
  introFlag: FLAGS.M2_STAGING_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Zajezdnia Etapowa',
  introCinematicSubtitle: 'Budżet cieplny: ograniczony',
};
