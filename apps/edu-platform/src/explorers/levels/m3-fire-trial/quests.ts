import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m3-red-light',
    completionType: 'event',
    title: { pl: 'Czerwone Światło', en: 'The Red Light' },
    briefing: {
      pl: 'Oprzyrząduj trzy stanowiska badawcze i przeprowadź uczciwe próby w kolejności ryzyka, którą dyktuje rejestr zagrożeń: trzecie, pierwsze, drugie. Nie „co blisko", tylko „co zabije nas pierwsze". Gdy skończysz, poligon pierwszy raz od lat pokaże prawdziwe światło.',
      en: 'Rig the three test stands and run honest trials in the risk order the register dictates: three, one, two. Not "what is near" but "what kills us first". When you finish, the range shows a true light for the first time in years.',
    },
    hints: [
      { pl: 'Zacznij przy module kontroli — Iskra odczyta rejestr ryzyka.', en: 'Start at the control module — Iskra reads out the risk register.' },
      { pl: 'Kolejność nie idzie po mapie. Trzecie stanowisko idzie pierwsze.', en: 'The order does not follow the map. Stand three goes first.' },
      { pl: 'Zła kolejność niczego nie psuje — po prostu nie da prawdy. Iskra przypomni.', en: 'The wrong order breaks nothing — it just will not give the truth. Iskra will remind you.' },
    ],
    objectives: [
      {
        id: 'stand-3',
        label: { pl: 'Zbadaj stanowisko trzecie', en: 'Test stand three' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_STAND_3_TESTED },
        requireFlag: FLAGS.M3_STAND_3_TESTED,
      },
      {
        id: 'stand-1',
        label: { pl: 'Zbadaj stanowisko pierwsze', en: 'Test stand one' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_STAND_1_TESTED },
        requireFlag: FLAGS.M3_STAND_1_TESTED,
      },
      {
        id: 'stand-2',
        label: { pl: 'Zbadaj stanowisko drugie', en: 'Test stand two' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_STAND_2_TESTED },
        requireFlag: FLAGS.M3_STAND_2_TESTED,
      },
    ],
    rewards: { xp: 125, flags: [FLAGS.M3_RED_LIGHT_ONLINE, FLAGS.M3_ENTROPY_UNMASKED] },
  },
];
