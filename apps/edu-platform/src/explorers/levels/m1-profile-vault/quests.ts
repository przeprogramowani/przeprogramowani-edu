import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m1-first-vein',
    completionType: 'event',
    title: { pl: 'Pierwsza Żyła', en: 'The First Vein' },
    briefing: {
      pl: 'Zdobądź pierwszą surową rudę Synaptitu. Zasil zestaw badawczy ogniwem z bocznej galerii, uruchom głęboki skan, by zlokalizować czystą żyłę, a potem wydobądź rudę z odpieczętowanej komory.',
      en: 'Secure the first raw Synaptit ore. Power the research kit with a cell from the side gallery, run a deep scan to locate the pure vein, then extract the ore from the unsealed chamber.',
    },
    hints: [
      { pl: 'Ogniwo zasilania leży w bocznej galerii wąwozu — zanieś je do zestawu badawczego.', en: 'The power cell lies in the ravine\'s side gallery — carry it to the research kit.' },
      { pl: 'Głęboki skan (konsola obok zestawu) odpieczętowuje najczystszą komorę. Oszczędzaj pingi.', en: 'The deep scan (console beside the kit) unseals the purest chamber. Conserve your pings.' },
      { pl: 'Po skanie wejdź do komory i wydobądź rudę z oznaczonej żyły.', en: 'After the scan, enter the chamber and extract the ore from the marked vein.' },
    ],
    objectives: [
      {
        id: 'power-rig',
        label: { pl: 'Zasil zestaw badawczy', en: 'Power the research kit' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_RIG_POWERED },
        requireFlag: FLAGS.M1_RIG_POWERED,
      },
      {
        id: 'deep-scan',
        label: { pl: 'Wykonaj głęboki skan', en: 'Run the deep scan' },
        event: 'arcade:completed',
        matchPayload: { arcadeGameId: 'arcade-deep-scan', solved: true },
        requireFlag: FLAGS.M1_DEEP_SCAN_DONE,
      },
      {
        id: 'extract-vein',
        label: { pl: 'Wydobądź rudę z oznaczonej żyły', en: 'Extract ore from the marked vein' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_VEIN_EXTRACTED },
        requireFlag: FLAGS.M1_VEIN_EXTRACTED,
      },
    ],
    rewards: { xp: 150, flags: [FLAGS.M1_FIRST_ORE] },
  },
];
