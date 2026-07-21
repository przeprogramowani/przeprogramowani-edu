import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m1-silence',
    completionType: 'event',
    title: { pl: 'Cisza', en: 'Silence' },
    briefing: {
      pl: 'Trzy węzły tłumią ten pas dżungli. Nie niszcz ich — odetnij. Odizoluj wszystkie trzy w kolejności wskazywanej przez ćwierkanie Świerszcza: najpierw głęboki, potem północny, na końcu wschodni.',
      en: 'Three nodes smother this belt of jungle. Do not destroy them — isolate them. Cut off all three in the order Świerszcz\'s chirp points to: deep first, then north, east last.',
    },
    hints: [
      { pl: 'Kolejność: głęboki węzeł, potem północny, na końcu wschodni. Zła kolejność daje ostrzeżenie, nie porażkę.', en: 'Order: deep node, then north, east last. The wrong order gives a warning, not a failure.' },
      { pl: 'Świerszcz jest najspokojniejszy przy węźle, który należy odciąć jako następny.', en: 'Świerszcz is calmest at the node you should isolate next.' },
      { pl: 'Nigdy nie niszcz węzła — odcinasz zasilanie, rdzeń zostaje do zbadania.', en: 'Never destroy a node — you cut the power, the core stays for study.' },
    ],
    objectives: [
      {
        id: 'isolate-deep',
        label: { pl: 'Odetnij węzeł głęboki', en: 'Isolate the deep node' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_NODE_DEEP_ISOLATED },
        requireFlag: FLAGS.M1_NODE_DEEP_ISOLATED,
      },
      {
        id: 'isolate-north',
        label: { pl: 'Odetnij węzeł północny', en: 'Isolate the north node' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_NODE_NORTH_ISOLATED },
        requireFlag: FLAGS.M1_NODE_NORTH_ISOLATED,
      },
      {
        id: 'isolate-east',
        label: { pl: 'Odetnij węzeł wschodni', en: 'Isolate the east node' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_NODE_EAST_ISOLATED },
        requireFlag: FLAGS.M1_NODE_EAST_ISOLATED,
      },
    ],
    rewards: { xp: 125, flags: [FLAGS.M1_SILENCE_DONE, FLAGS.M1_ENTROPY_NAMED, FLAGS.CMDS_INTEL] },
  },
];
