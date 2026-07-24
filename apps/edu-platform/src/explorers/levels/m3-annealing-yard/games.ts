import type { ArcadeGameDefinition } from '../../systems/ArcadeTypes';

export const arcadeGames: ArcadeGameDefinition[] = [
  {
    id: 'arcade-fault-trace',
    type: 'fault-trace',
    title: { pl: 'Regresja', en: 'Regression' },
    description: {
      pl: 'Po jednej z aktualizacji sterownik chłodzenia przestał działać. Sprawdzaj wybrane wersje, zawężaj obszar poszukiwań i powtarzaj podejrzane odczyty. Znajdź pierwszą wadliwą wersję, zanim wyczerpiesz limit prób.',
      en: 'The cooling controller stopped working after an update. Check selected versions, narrow the search, and repeat suspicious readings. Find the first faulty version before you run out of attempts.',
    },
    difficulty: 3,
    durationSeconds: 0,
    mission: {
      minScore: 70,
      firstClearXp: 25,
      firstClearDialogueId: 'm3-fault-trace-cleared',
    },
  },
];
