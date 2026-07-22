import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m4-cairns',
    completionType: 'event',
    title: { pl: 'Trzy Kopce', en: 'Three Cairns' },
    briefing: {
      pl: 'Zanim kopiesz — kartuj. Odkop panele i zasil obóz, potem odczytaj trzy kopce drogowe na obrzeżach i złóż namiar w studni obozowej. Uwaga: mapa to model, nie teren. Czytaj znaki, ale weryfikuj je nawzajem — teren mógł się zmienić albo ktoś mógł go zmienić.',
      en: 'Before you dig — map. Dig out the panels and power the camp, then read the three road cairns on the outskirts and assemble the bearing at the camp well. Note: a map is a model, not the terrain. Read the signs, but verify them against each other — the terrain could have changed, or someone could have changed it.',
    },
    hints: [
      { pl: 'Zacznij w studni obozowej — tam aktywujesz kartowanie i zobaczysz listę zadań.', en: 'Start at the camp well — that is where you open the mapping and see the task list.' },
      { pl: 'Najpierw odkop farmę paneli, żeby zasilić obóz i wyciągi. Potem podejdź do każdego kopca osobno.', en: 'First dig out the panel farm to power the camp and the lifts. Then walk up to each cairn separately.' },
      { pl: 'Dwa kopce dadzą zgodny namiar, trzeci wskaże w wydmy — ktoś go przestawił. Zaufaj dwóm prawdziwym.', en: 'Two cairns give a consistent bearing, the third points into the dunes — someone moved it. Trust the two true ones.' },
    ],
    objectives: [
      {
        id: 'panels-powered',
        label: { pl: 'Zasil farmę paneli', en: 'Power the panel farm' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_PANELS_POWERED },
        requireFlag: FLAGS.M4_PANELS_POWERED,
      },
      {
        id: 'cairn-1',
        label: { pl: 'Odczytaj kopiec I', en: 'Read cairn I' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_CAIRN_1_READ },
        requireFlag: FLAGS.M4_CAIRN_1_READ,
      },
      {
        id: 'cairn-2',
        label: { pl: 'Odczytaj kopiec II', en: 'Read cairn II' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_CAIRN_2_READ },
        requireFlag: FLAGS.M4_CAIRN_2_READ,
      },
      {
        id: 'cairn-3',
        label: { pl: 'Odczytaj kopiec III', en: 'Read cairn III' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_CAIRN_3_READ },
        requireFlag: FLAGS.M4_CAIRN_3_READ,
      },
    ],
    rewards: { xp: 75, flags: [FLAGS.M4_CAMP_ONLINE] },
  },
];
