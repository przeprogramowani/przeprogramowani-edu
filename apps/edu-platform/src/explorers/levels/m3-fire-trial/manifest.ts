import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm3-fire-trial',
  displayName: { pl: 'Próba Ognia', en: 'The Fire Trial' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'trial-control',
      defaultDialogue: 'm3-trial-control-start',
      flagVariants: [
        { flag: FLAGS.M3_RED_LIGHT_ONLINE, dialogue: 'm3-trial-control-post' },
        { flag: FLAGS.M3_TRIAL_ACTIVE, dialogue: 'm3-trial-control-reminder' },
      ],
    },
    {
      zoneId: 'stand-3',
      defaultDialogue: 'm3-stand-3-trial',
      flagVariants: [{ flag: FLAGS.M3_STAND_3_TESTED, dialogue: 'm3-stand-3-done' }],
    },
    {
      zoneId: 'stand-1',
      defaultDialogue: 'm3-stand-1-warning',
      flagVariants: [
        { flag: FLAGS.M3_STAND_1_TESTED, dialogue: 'm3-stand-1-done' },
        { flag: FLAGS.M3_STAND_3_TESTED, dialogue: 'm3-stand-1-trial' },
      ],
    },
    {
      zoneId: 'stand-2',
      defaultDialogue: 'm3-stand-2-warning',
      flagVariants: [
        { flag: FLAGS.M3_STAND_2_TESTED, dialogue: 'm3-stand-2-done' },
        { flag: FLAGS.M3_STAND_1_TESTED, dialogue: 'm3-stand-2-trial' },
      ],
    },
    { zoneId: 'ore-vein', defaultDialogue: 'm3-ore-vein' },
    {
      zoneId: 'iskra',
      defaultDialogue: 'm3-iskra',
      flagVariants: [{ flag: FLAGS.M3_RED_LIGHT_ONLINE, dialogue: 'm3-iskra-post' }],
    },
    { zoneId: 'annealing-door', defaultDialogue: 'm3-annealing-door-locked' },
    { zoneId: 'exam-protocol-13', defaultDialogue: 'm3-exam-protocol-13-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m3-red-light': 'q-m3-red-light-complete' },
  exams,
  examCompletionDialogues: { 'm3-exam-protocol-13': 'm3-exam-protocol-13-done' },
  introDialogue: 'm3-fire-trial-intro',
  introFlag: FLAGS.M3_FIRE_TRIAL_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 3 — Próba Ognia',
  introCinematicSubtitle: 'Próba Ognia',
  conditionalIntros: [
    {
      dialogue: 'm3-return-fire-trial',
      flag: FLAGS.M3_RETURN_FIRE_TRIAL_SEEN,
      requiredFlags: [FLAGS.M3_DIAGNOSTICS_ONLINE],
      cinematicTitle: 'Powrót — Próba Ognia',
    },
  ],
};
