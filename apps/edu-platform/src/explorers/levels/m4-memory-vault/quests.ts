import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m4-second-channel',
    completionType: 'event',
    title: { pl: 'Drugi Kanał', en: 'The Second Channel' },
    briefing: {
      pl: 'Banki są odbudowane, ale rdzeń-zalążek potrzebuje podpisanego bloku genezy spoza skompromitowanej centrali. Przynieś rdzenie z magazynu, zamknij łańcuch nadajników przez pustynię i otwórz drugi kanał do Ziemi. Dopiero wtedy korba studni opuści pierwszy rdzeń. Maszyna zapisuje — człowiek ręczy za znaczenie.',
      en: 'The banks are rebuilt, but the seed core needs a signed genesis block from outside the compromised control link. Bring the cores from the store, close the transmitter chain across the desert, and open a second channel to Earth. Only then does the well crank lower the first core. The machine records — the human vouches for the meaning.',
    },
    hints: [
      { pl: 'Zacznij przy studni — tam aktywujesz misję i zobaczysz kolejność kroków.', en: 'Start at the well — that is where you open the mission and see the order of steps.' },
      { pl: 'Rdzenie leżą w magazynie półproduktów. Łańcuch nadajników ma dwa ogniwa: komorowe i maszt na powierzchni.', en: 'The cores lie in the half-product store. The transmitter chain has two links: the chamber one and the surface mast.' },
      { pl: 'Kanał boczny musi stać, zanim pierwszy wpis pójdzie po podpis Ziemi. Kanarek potwierdzi, że kanał jest czysty.', en: 'The side channel must stand before the first entry goes for Earth\'s signature. A canary confirms the channel is clean.' },
    ],
    objectives: [
      {
        id: 'bring-cores',
        label: { pl: 'Przynieś rdzenie-zalążki do studni', en: 'Bring the seed cores to the well' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_CORES_BROUGHT },
        requireFlag: FLAGS.M4_CORES_BROUGHT,
      },
      {
        id: 'raise-channel',
        label: { pl: 'Zamknij łańcuch nadajników', en: 'Close the transmitter chain' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M4_SIDE_CHANNEL_ONLINE },
        requireFlag: FLAGS.M4_SIDE_CHANNEL_ONLINE,
      },
    ],
    rewards: { xp: 175, flags: [FLAGS.M4_MEMORY_ONLINE, FLAGS.CMDS_RECALL] },
  },
];
