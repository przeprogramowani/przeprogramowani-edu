import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';
import { arcadeGames } from './games';

export const manifest: LevelManifest = {
  id: 'm3-annealing-yard',
  displayName: { pl: 'Wyżarzalnia', en: 'The Annealing Yard' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'assay-rig',
      defaultDialogue: 'm3-assay-rig-start',
      flagVariants: [
        { flag: FLAGS.M3_FIRST_CERT, dialogue: 'm3-assay-rig-post' },
        { flag: FLAGS.M3_BATCH_ANNEALED, dialogue: 'm3-assay-rig-collect' },
        { flag: FLAGS.M3_COOLING_CERTIFIED, dialogue: 'm3-assay-rig-run-batch' },
        { flag: FLAGS.M3_ASSAY_RIG_POWERED, dialogue: 'm3-assay-rig-briefing' },
      ],
    },
    {
      zoneId: 'anneal-row',
      defaultDialogue: 'm3-anneal-row-cold',
      flagVariants: [{ flag: FLAGS.M3_COOLING_CERTIFIED, dialogue: 'm3-anneal-row-run' }],
    },
    {
      zoneId: 'ridge-antenna',
      defaultDialogue: 'm3-ridge-antenna',
      flagVariants: [{ flag: FLAGS.M3_DEAD_DISH_RELAY_SEEN, dialogue: 'm3-ridge-antenna-seen' }],
    },
    { zoneId: 'ore-veins', defaultDialogue: 'm3-ore-veins' },
    {
      zoneId: 'iskra-yard',
      defaultDialogue: 'm3-iskra-yard',
      flagVariants: [{ flag: FLAGS.M3_FIRST_CERT, dialogue: 'm3-iskra-yard-post' }],
    },
    { zoneId: 'assay-door', defaultDialogue: 'm3-assay-door-locked' },
    { zoneId: 'exam-protocol-14', defaultDialogue: 'm3-exam-protocol-14-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m3-first-cert': 'q-m3-first-cert-complete' },
  exams,
  examCompletionDialogues: { 'm3-exam-protocol-14': 'm3-exam-protocol-14-done' },
  arcadeGames,
  introDialogue: 'm3-annealing-intro',
  introFlag: FLAGS.M3_ANNEALING_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 3 — Uczciwa Próba',
  introCinematicSubtitle: 'Wyżarzalnia',
  conditionalIntros: [
    {
      dialogue: 'm3-return-annealing',
      flag: FLAGS.M3_RETURN_ANNEALING_SEEN,
      requiredFlags: [FLAGS.M3_DIAGNOSTICS_ONLINE],
      cinematicTitle: 'Powrót — Wyżarzalnia',
    },
  ],
};
