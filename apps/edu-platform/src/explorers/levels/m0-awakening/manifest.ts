import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';
import { FLAGS } from '../../config/flags';

export const manifest: LevelManifest = {
  id: 'm0-awakening',
  displayName: { pl: 'Sala Hibernacyjna', en: 'Hibernation Bay' },
  dialogues,
  interactionRoutes: [
    { zoneId: 'hibernation-pod', defaultDialogue: 'm0-pod-examine' },
    {
      zoneId: 'loot-terminal',
      defaultDialogue: 'm0-loot-terminal-open',
      flagVariants: [
        { flag: FLAGS.TERMINAL_FOUND, dialogue: 'm0-loot-terminal-done' },
      ],
    },
    { zoneId: 'info-board', defaultDialogue: 'm0-info-board' },
    { zoneId: 'crew-room-door', defaultDialogue: 'm0-door-locked' },
    { zoneId: 'zone-6', defaultDialogue: 'm0-door-locked' },
    { zoneId: 'engineer-moreau', defaultDialogue: 'm0-npc-moreau' },
  ],
  introDialogue: 'm0-awakening-intro',
  introFlag: FLAGS.M0_INTRO_SEEN,
  introCinematicTitle: 'Statek głębokiej przestrzeni Odyssey',
  introCinematicSubtitle: '322 dni od ostatniego wpisu w logu',
};
