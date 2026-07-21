import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m2-gate-boot',
    completionType: 'event',
    title: { pl: 'Rozruch Bramy', en: 'Gate Boot' },
    briefing: {
      pl: 'Brama towarowa jest zamarznięta. Przywróć ciepło wartowni ręcznym zaworem, odczytaj z tablicy planu kolejność rozruchu, a potem uruchom trzy węzły grzewcze w tej kolejności: jeden, dwa, trzy. Na końcu zamelduj przy konsoli wartowni.',
      en: 'The cargo gate is frozen. Restore the guardhouse warmth with the manual valve, read the boot order off the roadmap board, then boot the three heat nodes in that order: one, two, three. Report at the guardhouse console last.',
    },
    hints: [
      { pl: 'Najpierw zawór ciepła, dopiero potem węzły — zimne nie odpowiedzą.', en: 'The heat valve first, only then the nodes — cold ones will not answer.' },
      { pl: 'Kolejność jest na tablicy planu: jeden, dwa, trzy. Zła kolejność daje ostrzeżenie, nie porażkę.', en: 'The order is on the roadmap board: one, two, three. The wrong order gives a warning, not a failure.' },
      { pl: 'Po trzech węzłach wróć do konsoli wartowni i złóż meldunek.', en: 'After all three nodes, return to the guardhouse console and file the report.' },
    ],
    objectives: [
      {
        id: 'warm-guardhouse',
        label: { pl: 'Przywróć ciepło wartowni', en: 'Restore guardhouse warmth' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_GUARDHOUSE_WARM },
        requireFlag: FLAGS.M2_GUARDHOUSE_WARM,
      },
      {
        id: 'heat-node-1',
        label: { pl: 'Uruchom węzeł grzewczy 1', en: 'Boot heat node 1' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_HEAT_NODE_1_ON },
        requireFlag: FLAGS.M2_HEAT_NODE_1_ON,
      },
      {
        id: 'heat-node-2',
        label: { pl: 'Uruchom węzeł grzewczy 2', en: 'Boot heat node 2' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_HEAT_NODE_2_ON },
        requireFlag: FLAGS.M2_HEAT_NODE_2_ON,
      },
      {
        id: 'heat-node-3',
        label: { pl: 'Uruchom węzeł grzewczy 3', en: 'Boot heat node 3' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_HEAT_NODE_3_ON },
        requireFlag: FLAGS.M2_HEAT_NODE_3_ON,
      },
    ],
    rewards: { xp: 75, flags: [FLAGS.M2_BOOT_DONE] },
  },
];
