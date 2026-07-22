import type { TextAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: TextAnswerQuest[] = [
  {
    id: 'q-m4-last-route',
    completionType: 'text-answer',
    title: { pl: 'Ostatnia Trasa', en: 'The Last Route' },
    briefing: {
      pl: 'Dziennik E-CH0 to setki kursów, a na marginesach prywatne skróty kuriera — trasy, którymi nikt inny nie jeździł. Zasil zajezdnię, odczytaj dziennik przy głowicy serwisowej i skoreluj marginesy z mapą terenu z obozu. Na dnie dziennika leży fraza-klucz trybu czuwania jednostki. Podaj ją przez /solve, a nie zgrywaj indeksu — obudź kuriera i zapytaj o drogę.',
      en: "E-CH0's journal is hundreds of courses, with the courier's private shortcuts in the margins — routes no one else ever drove. Power the yard, read the journal at the service head, and correlate the margins with the terrain map from camp. At the bottom of the journal lies the unit's standby wake-phrase. Enter it via /solve — do not clone the index; wake the courier and ask for the road.",
    },
    inputPayload: [
      'DZIENNIK E-CH0 — ZRZUT / E-CH0 JOURNAL — DUMP (fragment)',
      '[K-4471] KURS: magazyn → sala katalogowa   | margines: skrót przez studnię W3',
      '[K-4472] KURS: sala katalogowa → skarbiec   | margines: skrót przez studnię W7',
      '[K-4473] KURS: skrzydło osobowe → ???        | ZLECENIE POZA REJESTREM',
      'OSTATNI KURS / LAST COURSE: 0-HCE',
      'TRYB CZUWANIA — fraza wybudzenia = odwróć kod',
      'STANDBY — wake phrase = reverse the code',
      'FORMAT: /solve <fraza> / <phrase>',
    ].join('\n'),
    hints: [
      {
        pl: 'Dziennik odczytasz przy głowicy serwisowej zajezdni — najpierw zasil ciąg zasilający.',
        en: 'Read the journal at the yard\'s service head — power the supply line first.',
      },
      {
        pl: 'Fraza wybudzenia siedzi na dnie dziennika. Popatrz na ostatni kod kursu: 0-HCE.',
        en: 'The wake-phrase sits at the bottom of the journal. Look at the last course code: 0-HCE.',
      },
      {
        pl: 'Odwróć kod znak po znaku: 0-HCE → ECH-0. Podaj małymi literami: /solve ech-0',
        en: 'Reverse the code character by character: 0-HCE → ECH-0. Enter it lowercase: /solve ech-0',
      },
    ],
    solution: 'ech-0',
    validation: 'exact-lowercase',
    rewards: { xp: 100, flags: [FLAGS.M4_ECHO_ONLINE, FLAGS.CMDS_ECHO] },
  },
];
