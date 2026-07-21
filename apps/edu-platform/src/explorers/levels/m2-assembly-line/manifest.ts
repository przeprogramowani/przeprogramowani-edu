import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';
import { arcadeGames } from './games';

export const manifest: LevelManifest = {
  id: 'm2-assembly-line',
  displayName: { pl: 'Huta', en: 'The Foundry' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'foundry-console',
      defaultDialogue: 'm2-foundry-start',
      flagVariants: [
        { flag: FLAGS.M2_FIRST_INGOT, dialogue: 'm2-foundry-post' },
        { flag: FLAGS.M2_CAST_DONE, dialogue: 'm2-foundry-wrap' },
        { flag: FLAGS.M2_SWITCHYARD_DONE, dialogue: 'm2-foundry-finish-cast' },
        { flag: FLAGS.M2_GALLERY_OPEN, dialogue: 'm2-foundry-briefing' },
        { flag: FLAGS.M2_MELT_ACTIVE, dialogue: 'm2-foundry-open-gallery' },
      ],
    },
    {
      zoneId: 'gallery-gate',
      defaultDialogue: 'm2-gallery-gate-shut',
      flagVariants: [{ flag: FLAGS.M2_GALLERY_OPEN, dialogue: 'm2-gallery-gate-open' }],
    },
    { zoneId: 'ore-veins', defaultDialogue: 'm2-ore-veins' },
    {
      zoneId: 'crucible',
      defaultDialogue: 'm2-crucible-cold',
      flagVariants: [
        { flag: FLAGS.M2_CAST_DONE, dialogue: 'm2-crucible-post' },
        { flag: FLAGS.M2_SWITCHYARD_DONE, dialogue: 'm2-crucible-cast' },
      ],
    },
    {
      zoneId: 'ore-shuttle',
      defaultDialogue: 'm2-ore-shuttle-parked',
      flagVariants: [{ flag: FLAGS.M2_SWITCHYARD_DONE, dialogue: 'm2-ore-shuttle-running' }],
    },
    {
      zoneId: 'sopel-foundry',
      defaultDialogue: 'm2-sopel-foundry',
      flagVariants: [{ flag: FLAGS.M2_FIRST_INGOT, dialogue: 'm2-sopel-foundry-post' }],
    },
    { zoneId: 'dispatch-door', defaultDialogue: 'm2-dispatch-door-locked' },
    { zoneId: 'exam-protocol-9', defaultDialogue: 'm2-exam-protocol-9-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m2-first-melt': 'q-m2-first-melt-complete' },
  exams,
  examCompletionDialogues: { 'm2-exam-protocol-9': 'm2-exam-protocol-9-done' },
  arcadeGames,
  introDialogue: 'm2-foundry-intro',
  introFlag: FLAGS.M2_FOUNDRY_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Martwy Punkt',
  introCinematicSubtitle: 'Huta',
  conditionalIntros: [
    {
      dialogue: 'm2-return-foundry',
      flag: FLAGS.M2_RETURN_FOUNDRY_SEEN,
      requiredFlags: [FLAGS.M2_PLANNING_ONLINE],
      cinematicTitle: 'Powrót — Huta',
    },
  ],
};
