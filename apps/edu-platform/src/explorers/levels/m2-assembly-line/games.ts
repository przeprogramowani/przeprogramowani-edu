import type { ArcadeGameDefinition } from '../../systems/ArcadeTypes';

export const arcadeGames: ArcadeGameDefinition[] = [
  {
    id: 'arcade-switchyard',
    type: 'switchyard',
    title: { pl: 'Zwrotnica', en: 'Switchyard' },
    description: {
      pl: 'Nakarm hutę rudą z galerii. Najpierw plan: przestaw zwrotnice i ustal kolejność odjazdów, póki wagoniki stoją. Potem uruchom harmonogram — ruszą same. Masz tylko trzy ręczne wstrzymania, bo to plan ma pracować za ciebie. Każda kolizja to rozsypany ładunek.',
      en: 'Feed the foundry with ore from the gallery. Plan first: throw the switches and set the departure order while the trams stand still. Then start the schedule — they roll on their own. You get only three manual holds, because the plan is meant to do the work for you. Every collision is a spilled load.',
    },
    difficulty: 3,
    durationSeconds: 0,
    mission: {
      minScore: 70,
      firstClearXp: 25,
      firstClearDialogueId: 'm2-switchyard-cleared',
    },
  },
];
