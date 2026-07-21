import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-staging-yard',
  displayName: { pl: 'Martwy Punkt', en: 'The Deadlock' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'dispatch-substation',
      defaultDialogue: 'm2-dispatch-start',
      flagVariants: [
        { flag: FLAGS.M2_DEADLOCK_CLEARED, dialogue: 'm2-dispatch-post' },
        { flag: FLAGS.M2_DEADLOCK_ACTIVE, dialogue: 'm2-dispatch-waiting' },
      ],
    },
    {
      zoneId: 'tram-gamma',
      defaultDialogue: 'm2-tram-gamma-inert',
      flagVariants: [
        { flag: FLAGS.M2_TRAM_GAMMA_RELEASED, dialogue: 'm2-tram-gamma-done' },
        { flag: FLAGS.M2_DEADLOCK_ACTIVE, dialogue: 'm2-tram-gamma-release' },
      ],
    },
    {
      zoneId: 'tram-beta',
      defaultDialogue: 'm2-tram-beta-inert',
      flagVariants: [
        { flag: FLAGS.M2_TRAM_BETA_RELEASED, dialogue: 'm2-tram-beta-done' },
        { flag: FLAGS.M2_TRAM_GAMMA_RELEASED, dialogue: 'm2-tram-beta-release' },
        { flag: FLAGS.M2_DEADLOCK_ACTIVE, dialogue: 'm2-tram-beta-warning' },
      ],
    },
    {
      zoneId: 'tram-alpha',
      defaultDialogue: 'm2-tram-alpha-inert',
      flagVariants: [
        { flag: FLAGS.M2_TRAM_ALPHA_RELEASED, dialogue: 'm2-tram-alpha-done' },
        { flag: FLAGS.M2_TRAM_BETA_RELEASED, dialogue: 'm2-tram-alpha-release' },
        { flag: FLAGS.M2_DEADLOCK_ACTIVE, dialogue: 'm2-tram-alpha-warning' },
      ],
    },
    { zoneId: 'track-board', defaultDialogue: 'm2-track-board' },
    { zoneId: 'ore-spill', defaultDialogue: 'm2-ore-spill' },
    {
      zoneId: 'sopel',
      defaultDialogue: 'm2-sopel-nervous',
      flagVariants: [{ flag: FLAGS.M2_DEADLOCK_CLEARED, dialogue: 'm2-sopel-calm' }],
    },
    { zoneId: 'foundry-door', defaultDialogue: 'm2-foundry-door-locked' },
    { zoneId: 'exam-protocol-8', defaultDialogue: 'm2-exam-protocol-8-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m2-deadlock': 'q-m2-deadlock-complete' },
  exams,
  examCompletionDialogues: { 'm2-exam-protocol-8': 'm2-exam-protocol-8-done' },
  introDialogue: 'm2-deadlock-intro',
  introFlag: FLAGS.M2_DEADLOCK_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Martwy Punkt',
  introCinematicSubtitle: 'Martwy Punkt',
  conditionalIntros: [
    {
      dialogue: 'm2-return-deadlock',
      flag: FLAGS.M2_RETURN_DEADLOCK_SEEN,
      requiredFlags: [FLAGS.M2_PLANNING_ONLINE],
      cinematicTitle: 'Powrót — Martwy Punkt',
    },
  ],
};
