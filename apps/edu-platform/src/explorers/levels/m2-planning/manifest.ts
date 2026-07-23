import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm2-planning',
  displayName: { pl: 'Brama', en: 'The Gatehouse' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'guardhouse-console',
      defaultDialogue: 'm2-guardhouse-start',
      flagVariants: [
        { flag: FLAGS.M2_GATE_ONLINE, dialogue: 'm2-guardhouse-online' },
        { flag: FLAGS.M2_BOOT_DONE, dialogue: 'm2-guardhouse-report' },
        { flag: FLAGS.M2_BOOT_ACTIVE, dialogue: 'm2-guardhouse-waiting' },
      ],
    },
    {
      zoneId: 'valve',
      defaultDialogue: 'm2-valve',
      flagVariants: [{ flag: FLAGS.M2_GUARDHOUSE_WARM, dialogue: 'm2-valve-done' }],
    },
    {
      zoneId: 'roadmap-board',
      defaultDialogue: 'm2-roadmap-board',
      flagVariants: [{ flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-roadmap-board-live' }],
    },
    {
      zoneId: 'heat-node-1',
      defaultDialogue: 'm2-heat-node-1-cold',
      flagVariants: [
        { flag: FLAGS.M2_HEAT_NODE_1_ON, dialogue: 'm2-heat-node-1-done' },
        { flag: FLAGS.M2_GUARDHOUSE_WARM, dialogue: 'm2-heat-node-1-activate' },
      ],
    },
    {
      zoneId: 'heat-node-2',
      defaultDialogue: 'm2-heat-node-2-cold',
      flagVariants: [
        { flag: FLAGS.M2_HEAT_NODE_2_ON, dialogue: 'm2-heat-node-2-done' },
        { flag: FLAGS.M2_HEAT_NODE_1_ON, dialogue: 'm2-heat-node-2-activate' },
        { flag: FLAGS.M2_GUARDHOUSE_WARM, dialogue: 'm2-heat-node-2-warning' },
      ],
    },
    {
      zoneId: 'heat-node-3',
      defaultDialogue: 'm2-heat-node-3-cold',
      flagVariants: [
        { flag: FLAGS.M2_HEAT_NODE_3_ON, dialogue: 'm2-heat-node-3-done' },
        { flag: FLAGS.M2_HEAT_NODE_2_ON, dialogue: 'm2-heat-node-3-activate' },
        { flag: FLAGS.M2_GUARDHOUSE_WARM, dialogue: 'm2-heat-node-3-warning' },
      ],
    },
    {
      zoneId: 'gate-console',
      defaultDialogue: 'm2-gate-console-frozen',
      flagVariants: [{ flag: FLAGS.M2_GATE_ONLINE, dialogue: 'm2-gate-console-online' }],
    },
    {
      zoneId: 'black-box',
      defaultDialogue: 'm2-black-box',
      flagVariants: [{ flag: FLAGS.M2_BLACKBOX_DOCKING_SEEN, dialogue: 'm2-black-box-seen' }],
    },
    {
      zoneId: 'ingot-tram',
      defaultDialogue: 'm2-ingot-tram-locked',
      flagVariants: [{ flag: FLAGS.M2_DELIVERY_001, dialogue: 'm2-ingot-tram-delivered' }],
    },
    {
      zoneId: 'kern',
      defaultDialogue: 'm2-kern-default',
      flagVariants: [
        { flag: FLAGS.M2_RETURN_GATE_SEEN, dialogue: 'm2-kern-epilogue' },
        { flag: FLAGS.M2_PLANNING_ONLINE, dialogue: 'm2-kern-planning' },
        { flag: FLAGS.M2_FIRST_INGOT, dialogue: 'm2-kern-ingot' },
        { flag: FLAGS.M2_DEADLOCK_CLEARED, dialogue: 'm2-kern-deadlock' },
        { flag: FLAGS.M2_SOPEL_ONLINE, dialogue: 'm2-kern-sopel' },
        { flag: FLAGS.M2_GATE_ONLINE, dialogue: 'm2-kern-gate' },
      ],
    },
    { zoneId: 'service-door', defaultDialogue: 'm2-service-door-locked' },
    { zoneId: 'exam-protocol-6', defaultDialogue: 'm2-exam-protocol-6-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m2-gate-boot': 'q-m2-gate-boot-complete' },
  exams,
  examCompletionDialogues: { 'm2-exam-protocol-6': 'm2-exam-protocol-6-done' },
  introDialogue: 'm2-gate-intro',
  introFlag: FLAGS.M2_GATE_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 2 — Martwy Punkt',
  introCinematicSubtitle: 'Brama',
  conditionalIntros: [
    {
      dialogue: 'm2-return-gate',
      flag: FLAGS.M2_RETURN_GATE_SEEN,
      requiredFlags: [FLAGS.M2_PLANNING_ONLINE],
      cinematicTitle: 'Powrót — Brama',
    },
  ],
};
