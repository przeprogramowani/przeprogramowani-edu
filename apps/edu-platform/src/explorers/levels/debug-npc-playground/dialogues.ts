import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  'debug-npc-scientist': {
    id: 'debug-npc-scientist',
    lines: [
      {
        speaker: 'Scientist',
        text: { pl: 'Podgląd ruchu: scientist.', en: 'Movement preview: scientist.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-alien': {
    id: 'debug-npc-alien',
    lines: [
      {
        speaker: 'Alien',
        text: { pl: 'Podgląd ruchu: alien.', en: 'Movement preview: alien.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-robot': {
    id: 'debug-npc-robot',
    lines: [
      {
        speaker: 'Robot',
        text: { pl: 'Podgląd ruchu: robot.', en: 'Movement preview: robot.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-orb': {
    id: 'debug-npc-orb',
    lines: [
      {
        speaker: 'Orb',
        text: { pl: 'Podgląd ruchu: orb.', en: 'Movement preview: orb.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-hologram-blue': {
    id: 'debug-npc-hologram-blue',
    lines: [
      {
        speaker: 'Blue hologram',
        text: { pl: 'Wariant koloru: hologram-blue.', en: 'Color variant: hologram-blue.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-hologram-green': {
    id: 'debug-npc-hologram-green',
    lines: [
      {
        speaker: 'Green hologram',
        text: { pl: 'Wariant koloru: hologram-green.', en: 'Color variant: hologram-green.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-hologram-magenta': {
    id: 'debug-npc-hologram-magenta',
    lines: [
      {
        speaker: 'Magenta hologram',
        text: { pl: 'Wariant koloru: hologram-magenta.', en: 'Color variant: hologram-magenta.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-hologram-blue-add': {
    id: 'debug-npc-hologram-blue-add',
    lines: [
      {
        speaker: 'Blue hologram — ADD',
        text: { pl: 'Filtr koloru: niebieski tint + tryb ADD.', en: 'Color filter: blue tint + ADD mode.' },
        mode: 'dialogue',
      },
    ],
  },
  'debug-npc-hologram-blue-screen': {
    id: 'debug-npc-hologram-blue-screen',
    lines: [
      {
        speaker: 'Blue hologram — SCREEN',
        text: { pl: 'Filtr koloru: niebieski tint + tryb SCREEN.', en: 'Color filter: blue tint + SCREEN mode.' },
        mode: 'dialogue',
      },
    ],
  },
};
