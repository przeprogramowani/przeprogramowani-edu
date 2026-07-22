import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm4-caravanserai',
  displayName: { pl: 'Karawanseraj', en: 'The Caravanserai' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'camp-well',
      defaultDialogue: 'm4-camp-start',
      flagVariants: [
        { flag: FLAGS.M4_CAMP_ONLINE, dialogue: 'm4-camp-online-post' },
        { flag: FLAGS.M4_CAIRNS_ACTIVE, dialogue: 'm4-camp-waiting' },
      ],
    },
    {
      zoneId: 'solar-farm',
      defaultDialogue: 'm4-solar-farm',
      flagVariants: [
        { flag: FLAGS.M4_PANELS_POWERED, dialogue: 'm4-solar-farm-done' },
        { flag: FLAGS.M4_CAIRNS_ACTIVE, dialogue: 'm4-solar-farm-power' },
      ],
    },
    {
      zoneId: 'cairn-1',
      defaultDialogue: 'm4-cairn-1',
      flagVariants: [
        { flag: FLAGS.M4_CAIRN_1_READ, dialogue: 'm4-cairn-1-done' },
        { flag: FLAGS.M4_CAIRNS_ACTIVE, dialogue: 'm4-cairn-1-read' },
      ],
    },
    {
      zoneId: 'cairn-2',
      defaultDialogue: 'm4-cairn-2',
      flagVariants: [
        { flag: FLAGS.M4_CAIRN_2_READ, dialogue: 'm4-cairn-2-done' },
        { flag: FLAGS.M4_CAIRNS_ACTIVE, dialogue: 'm4-cairn-2-read' },
      ],
    },
    {
      zoneId: 'cairn-3',
      defaultDialogue: 'm4-cairn-3',
      flagVariants: [
        { flag: FLAGS.M4_CAIRN_3_READ, dialogue: 'm4-cairn-3-done' },
        { flag: FLAGS.M4_CAIRNS_ACTIVE, dialogue: 'm4-cairn-3-read' },
      ],
    },
    {
      zoneId: 'kern',
      defaultDialogue: 'm4-kern',
      flagVariants: [
        { flag: FLAGS.M4_RETURN_CARAVANSERAI_SEEN, dialogue: 'm4-kern-return' },
        { flag: FLAGS.M4_MASTER_MAP, dialogue: 'm4-kern-gone-vault' },
        { flag: FLAGS.M4_CAMP_ONLINE, dialogue: 'm4-kern-camp' },
        { flag: FLAGS.M4_CAIRNS_ACTIVE, dialogue: 'm4-kern-cairns' },
      ],
    },
    { zoneId: 'courier-door', defaultDialogue: 'm4-courier-door-locked' },
    { zoneId: 'exam-protocol-16', defaultDialogue: 'm4-exam-protocol-16-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m4-cairns': 'q-m4-cairns-complete' },
  exams,
  examCompletionDialogues: { 'm4-exam-protocol-16': 'm4-exam-protocol-16-done' },
  introDialogue: 'm4-caravanserai-intro',
  introFlag: FLAGS.M4_CARAVANSERAI_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 4 — Wymazany Indeks',
  introCinematicSubtitle: 'Karawanseraj',
  conditionalIntros: [
    {
      dialogue: 'm4-return-caravanserai',
      flag: FLAGS.M4_RETURN_CARAVANSERAI_SEEN,
      requiredFlags: [FLAGS.M4_MEMORY_ONLINE],
      cinematicTitle: 'Powrót — Karawanseraj',
    },
  ],
};
