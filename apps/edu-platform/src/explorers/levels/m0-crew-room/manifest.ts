import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';
import { arcadeGames, crewRoomArcadeFlags } from './games';
import { FLAGS } from '../../config/flags';

export const manifest: LevelManifest = {
  id: 'm0-crew-room',
  displayName: { pl: 'Szatnia Załogi', en: 'Crew Quarters' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'board-eng',
      defaultDialogue: 'm0-board-eng',
      flagVariants: [{ flag: crewRoomArcadeFlags.asteroid, dialogue: 'm0-board-eng-asteroid-cleared' }],
    },
    {
      zoneId: 'board-ofc',
      defaultDialogue: 'm0-board-ofc',
      flagVariants: [{ flag: crewRoomArcadeFlags.memory, dialogue: 'm0-board-ofc-memory-cleared' }],
    },
    {
      zoneId: 'board-nav',
      defaultDialogue: 'm0-board-nav',
      flagVariants: [
        { flag: FLAGS.KEYCODE_FOUND, dialogue: 'm0-board-nav-revisit' },
      ],
    },
    {
      zoneId: 'whiteboard',
      defaultDialogue: 'm0-whiteboard',
      flagVariants: [{ flag: crewRoomArcadeFlags.oscilloscope, dialogue: 'm0-whiteboard-oscilloscope-cleared' }],
    },
    {
      zoneId: 'floobert',
      defaultDialogue: 'npc-floobert',
      flagVariants: [{ flag: FLAGS.KEYCODE_FOUND, dialogue: 'npc-floobert-keycode-found' }],
    },
  ],
  arcadeGames,
};
