import type { ArcadeGameDefinition } from '../../systems/ArcadeTypes';
import type { ArcadeStationContext } from '../../systems/ArcadeTypes';
import { getArcadeStationClearFlag } from '../../state/arcadeFlags';

export const crewRoomArcadeStations = {
  asteroid: {
    mapKey: 'm0-crew-room',
    zoneId: 'crew-room-asteroids',
    arcadeGameId: 'crew-room-asteroids',
  },
  memory: {
    mapKey: 'm0-crew-room',
    zoneId: 'crew-room-memory',
    arcadeGameId: 'crew-room-memory',
  },
  oscilloscope: {
    mapKey: 'm0-crew-room',
    zoneId: 'crew-room-oscilloscope',
    arcadeGameId: 'crew-room-oscilloscope',
  },
} as const satisfies Record<string, ArcadeStationContext>;

export const crewRoomArcadeFlags = {
  asteroid: getArcadeStationClearFlag(crewRoomArcadeStations.asteroid),
  memory: getArcadeStationClearFlag(crewRoomArcadeStations.memory),
  oscilloscope: getArcadeStationClearFlag(crewRoomArcadeStations.oscilloscope),
} as const;

export const arcadeGames: ArcadeGameDefinition[] = [
  {
    id: crewRoomArcadeStations.asteroid.arcadeGameId,
    type: 'asteroid-range',
    title: { pl: 'Strzelnica Asteroidów', en: 'Asteroid Range' },
    description: {
      pl: 'Odyssey potrzebuje surowców do utrzymywania sprawności systemów pokładowych. Namierzaj asteroidy, rozbijaj je działkiem pokładowym i zbieraj jak najwięcej minerałów.',
      en: 'The Odyssey needs raw materials to keep onboard systems running. Track asteroids, smash them with the ship cannon, and collect as many minerals as you can.',
    },
    difficulty: 1,
    durationSeconds: 30,
    mission: {
      minScore: 250,
      firstClearXp: 10,
      firstClearDialogueId: 'm0-arcade-asteroid-cleared',
    },
  },
  {
    id: crewRoomArcadeStations.memory.arcadeGameId,
    type: 'memory-matrix',
    title: { pl: 'Dekoder Sygnałów', en: 'Signal Decoder' },
    description: {
      pl: 'Załoga wychwytuje chaotyczne transmisje z głębokiego kosmosu, ale nie potrafi ich uporządkować. Rozpoznaj sekwencje sygnałów, aby zdobyć na pokładzie zapanował porządek.',
      en: 'The crew picks up chaotic deep-space transmissions but cannot make sense of them. Recognise the signal sequences to restore order onboard.',
    },
    difficulty: 1,
    durationSeconds: 0,
    mission: {
      firstClearXp: 10,
      firstClearDialogueId: 'm0-arcade-memory-cleared',
    },
  },
  {
    id: crewRoomArcadeStations.oscilloscope.arcadeGameId,
    type: 'oscilloscope',
    title: { pl: 'Kalibracja Oscyloskopu', en: 'Oscilloscope Calibration' },
    description: {
      pl: 'Bez stabilnego sygnału, statek Odyssey nie może nawigować w przestrzeni kosmicznej. Przestawiaj parametry fali, aż przebieg roboczy pokryje się z sygnałem referencyjnym.',
      en: 'Without a stable signal, the Odyssey cannot navigate space. Adjust the wave parameters until the working trace lines up with the reference signal.',
    },
    difficulty: 1,
    durationSeconds: 30,
    mission: {
      firstClearXp: 10,
      firstClearDialogueId: 'm0-arcade-oscilloscope-cleared',
    },
  },
];
