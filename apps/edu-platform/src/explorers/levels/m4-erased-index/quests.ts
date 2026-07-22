import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m4-thread',
    completionType: 'event',
    title: { pl: 'Nić', en: 'The Thread' },
    briefing: {
      pl: 'Spis bez powiązań to nie pamięć — to inwentarz. Odtwórz trzy ogniwa indeksu w kolejności odsyłaczy: każde odzyskane wrzeciono wskazuje następne. Nie odbudowuje się wszystkiego naraz — odbudowuje się nić.',
      en: 'A list without links is not memory — it is an inventory. Restore three index links in the order of their references: each recovered spindle points to the next. You do not rebuild everything at once — you rebuild the thread.',
    },
    hints: [
      { pl: 'Zacznij przy głowicy katalogu — tam aktywujesz zadanie i usłyszysz doktrynę nici.', en: 'Start at the catalogue head — that is where you open the task and hear the doctrine of the thread.' },
      { pl: 'Idź po kolei: pierwsze wrzeciono wskazuje drugie, drugie — trzecie. Zła kolejność tylko cię zawróci, nie ukarze.', en: 'Go in order: the first spindle points to the second, the second to the third. A wrong order only turns you back, it does not punish.' },
      { pl: 'Echo czyta na głos własny dziennik tras. Słuchaj, dokąd prowadzi każdy odsyłacz.', en: 'Echo reads his own route journal aloud. Listen for where each reference leads.' },
    ],
    objectives: [
      {
        id: 'spindle-1',
        label: { pl: 'Połącz pierwsze wrzeciono', en: 'Link the first spindle' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_SPINDLE_1_LINKED },
        requireFlag: FLAGS.M4_SPINDLE_1_LINKED,
      },
      {
        id: 'spindle-2',
        label: { pl: 'Połącz drugie wrzeciono', en: 'Link the second spindle' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_SPINDLE_2_LINKED },
        requireFlag: FLAGS.M4_SPINDLE_2_LINKED,
      },
      {
        id: 'spindle-3',
        label: { pl: 'Połącz trzecie wrzeciono', en: 'Link the third spindle' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_SPINDLE_3_LINKED },
        requireFlag: FLAGS.M4_SPINDLE_3_LINKED,
      },
    ],
    rewards: { xp: 125, flags: [FLAGS.M4_ENTROPY_CATALOGUED] },
  },
];
