import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-planning-core',
  displayName: { pl: 'Dyspozytornia', en: 'The Dispatch Tower' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'dispatch-console',
      defaultDialogue: 'm2-dispatch-console-start',
      flagVariants: [
        { flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-dispatch-console-post' },
        { flag: FLAGS.M2_MASTER_PLAN_ACTIVE, dialogue: 'm2-dispatch-console-waiting' },
      ],
    },
    {
      zoneId: 'core-face',
      defaultDialogue: 'm2-core-face',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-core-face-done' }],
    },
    {
      zoneId: 'master-switch',
      defaultDialogue: 'm2-master-switch-frozen',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-master-switch-thrown' }],
    },
    {
      zoneId: 'plan-board-1',
      defaultDialogue: 'm2-plan-board-1',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-plan-board-1-lit' }],
    },
    {
      zoneId: 'plan-board-2',
      defaultDialogue: 'm2-plan-board-2',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-plan-board-2-lit' }],
    },
    {
      zoneId: 'plan-board-3',
      defaultDialogue: 'm2-plan-board-3',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-plan-board-3-lit' }],
    },
    {
      zoneId: 'siding-tram',
      defaultDialogue: 'm2-siding-tram-parked',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-siding-tram-running' }],
    },
    {
      zoneId: 'sopel-dispatch',
      defaultDialogue: 'm2-sopel-dispatch',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-sopel-dispatch-post' }],
    },
    { zoneId: 'exam-protocol-10', defaultDialogue: 'm2-exam-protocol-10-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m2-master-plan': 'q-m2-master-plan-complete' },
  exams,
  examCompletionDialogues: { 'm2-exam-protocol-10': 'm2-exam-protocol-10-done' },
  introDialogue: 'm2-dispatch-intro',
  introFlag: FLAGS.M2_DISPATCH_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Martwy Punkt',
  introCinematicSubtitle: 'Dyspozytornia',
};
