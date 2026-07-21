import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-planning',
  displayName: { pl: 'Zamarznięte Atrium', en: 'The Frozen Atrium' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'ops-board',
      defaultDialogue: 'm2-ops-board',
      flagVariants: [{ flag: FLAGS.M2_PLAN_CONTRACT_DONE, dialogue: 'm2-ops-board-done' }],
    },
    {
      zoneId: 'plan-registry',
      defaultDialogue: 'm2-plan-registry-start',
      flagVariants: [{ flag: FLAGS.M2_PLAN_CONTRACT_DONE, dialogue: 'm2-plan-registry-done' }],
    },
    {
      zoneId: 'usher-u1',
      defaultDialogue: 'm2-usher-u1',
      flagVariants: [{ flag: FLAGS.M2_PLAN_CONTRACT_DONE, dialogue: 'm2-usher-u1-done' }],
    },
    {
      zoneId: 'registrar-l4',
      defaultDialogue: 'm2-registrar-l4',
      flagVariants: [{ flag: FLAGS.M2_PLAN_CONTRACT_DONE, dialogue: 'm2-registrar-l4-done' }],
    },
    { zoneId: 'frozen-unit-1', defaultDialogue: 'm2-frozen-unit-1' },
    { zoneId: 'frozen-unit-2', defaultDialogue: 'm2-frozen-unit-2' },
    { zoneId: 'frozen-desk', defaultDialogue: 'm2-frozen-desk' },
    { zoneId: 'comms-console', defaultDialogue: 'm2-comms-console' },
    { zoneId: 'staging-yard-door', defaultDialogue: 'm2-staging-locked' },
    { zoneId: 'exam-plan-first', defaultDialogue: 'm2-exam-plan-first-already' },
  ],
  quests,
  exams,
  questCompletionDialogues: { 'q-m2-plan-contract': 'm2-plan-contract-complete' },
  examCompletionDialogues: { 'm2-exam-plan-first': 'm2-exam-plan-first-done' },
  introDialogue: 'm2-planning-intro',
  introFlag: FLAGS.M2_PLANNING_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Zamarznięte Atrium',
  introCinematicSubtitle: 'Węzeł planistyczny VOID',
};
