import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';
import { quests } from './quests';
import { FLAGS } from '../../config/flags';

export const manifest: LevelManifest = {
  id: 'm0-core-ai',
  displayName: { pl: 'Modu\u0142 CORE AI', en: 'CORE AI Module' },
  dialogues,
  interactionRoutes: [
    // Firmware upgrade console (computer sprite)
    {
      zoneId: 'firmware-console',
      defaultDialogue: 'm0-firmware-upgrade',
      flagVariants: [{ flag: FLAGS.M0_FIRMWARE_UPGRADED, dialogue: 'm0-firmware-upgrade-done' }],
    },
    // CORE AI module — gated behind firmware upgrade
    {
      zoneId: 'core-ai-module',
      defaultDialogue: 'm0-core-ai-no-firmware',
      flagVariants: [
        { flag: FLAGS.M0_CORE_AI_MALFUNCTION_SEEN, dialogue: 'm0-core-ai-malfunction-revisit' },
        { flag: FLAGS.M0_FIRMWARE_UPGRADED, dialogue: 'm0-core-ai-malfunction' },
      ],
    },
    // Support manual — gated behind malfunction discovery
    {
      zoneId: 'support-manual',
      defaultDialogue: 'm0-support-manual-early',
      flagVariants: [
        { flag: FLAGS.M0_SUPPORT_CALIBRATED, dialogue: 'm0-support-manual-revisit' },
        { flag: FLAGS.M0_CORE_AI_MALFUNCTION_SEEN, dialogue: 'm0-support-manual-read' },
      ],
    },
    // Door back to exam room
    {
      zoneId: 'exam-room-door',
      defaultDialogue: 'm0-core-ai-malfunction-revisit',
    },
    // Prework door — locked until earth signal + prework system flag
    {
      zoneId: 'prework-door',
      defaultDialogue: 'm0-prework-door-locked',
    },
  ],
  quests,
  questCompletionDialogues: {
    'q-earth-signal': 'm0-earth-signal-complete',
  },
  introDialogue: 'm0-core-ai-intro',
  introFlag: FLAGS.M0_CORE_AI_INTRO_SEEN,
};
