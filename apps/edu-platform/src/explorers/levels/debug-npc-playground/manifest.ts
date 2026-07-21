import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';

export const manifest: LevelManifest = {
  id: 'debug-npc-playground',
  displayName: { pl: 'Debug: ruch NPC', en: 'Debug: NPC movement' },
  dialogues,
  interactionRoutes: [
    { zoneId: 'debug-npc-scientist', defaultDialogue: 'debug-npc-scientist' },
    { zoneId: 'debug-npc-alien', defaultDialogue: 'debug-npc-alien' },
    { zoneId: 'debug-npc-robot', defaultDialogue: 'debug-npc-robot' },
    { zoneId: 'debug-npc-orb', defaultDialogue: 'debug-npc-orb' },
    { zoneId: 'debug-npc-scientist-blue', defaultDialogue: 'debug-npc-hologram-blue' },
    { zoneId: 'debug-npc-alien-blue', defaultDialogue: 'debug-npc-hologram-blue' },
    { zoneId: 'debug-npc-robot-blue', defaultDialogue: 'debug-npc-hologram-blue' },
    { zoneId: 'debug-npc-orb-blue', defaultDialogue: 'debug-npc-hologram-blue' },
    { zoneId: 'debug-npc-scientist-green', defaultDialogue: 'debug-npc-hologram-green' },
    { zoneId: 'debug-npc-alien-green', defaultDialogue: 'debug-npc-hologram-green' },
    { zoneId: 'debug-npc-robot-green', defaultDialogue: 'debug-npc-hologram-green' },
    { zoneId: 'debug-npc-orb-green', defaultDialogue: 'debug-npc-hologram-green' },
    { zoneId: 'debug-npc-scientist-magenta', defaultDialogue: 'debug-npc-hologram-magenta' },
    { zoneId: 'debug-npc-alien-magenta', defaultDialogue: 'debug-npc-hologram-magenta' },
    { zoneId: 'debug-npc-robot-magenta', defaultDialogue: 'debug-npc-hologram-magenta' },
    { zoneId: 'debug-npc-orb-magenta', defaultDialogue: 'debug-npc-hologram-magenta' },
    { zoneId: 'debug-npc-scientist-blue-add', defaultDialogue: 'debug-npc-hologram-blue-add' },
    { zoneId: 'debug-npc-alien-blue-add', defaultDialogue: 'debug-npc-hologram-blue-add' },
    { zoneId: 'debug-npc-robot-blue-add', defaultDialogue: 'debug-npc-hologram-blue-add' },
    { zoneId: 'debug-npc-orb-blue-add', defaultDialogue: 'debug-npc-hologram-blue-add' },
    { zoneId: 'debug-npc-scientist-blue-screen', defaultDialogue: 'debug-npc-hologram-blue-screen' },
    { zoneId: 'debug-npc-alien-blue-screen', defaultDialogue: 'debug-npc-hologram-blue-screen' },
    { zoneId: 'debug-npc-robot-blue-screen', defaultDialogue: 'debug-npc-hologram-blue-screen' },
    { zoneId: 'debug-npc-orb-blue-screen', defaultDialogue: 'debug-npc-hologram-blue-screen' },
  ],
};
