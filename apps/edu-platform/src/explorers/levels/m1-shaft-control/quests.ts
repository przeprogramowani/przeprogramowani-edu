import type { TextAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: TextAnswerQuest[] = [
  {
    id: 'q-m1-cricket',
    completionType: 'text-answer',
    title: { pl: 'Świerszcz', en: 'Cricket' },
    briefing: {
      pl: 'Odzyskaj klucz rozruchowy z uszkodzonego dziennika sondy. Część wpisów była retransmitowana z błędną sumą kontrolną — licz tylko wersje oznaczone jako OK i złóż je w kolejności. Podaj klucz przez /solve, aby uruchomić drona.',
      en: 'Recover the boot key from the probe\'s damaged log. Some entries were retransmitted with a bad checksum — count only the versions marked OK and assemble them in order. Enter the key via /solve to start the drone.',
    },
    inputPayload: [
      'DZIENNIK SONDY ODYSSEY-P7 — SEKWENCJA ROZRUCHOWA',
      "[041] KLUCZ 1/3: 'P7'   — suma kontrolna OK",
      "[042] KLUCZ 2/3: 'XR4'  — suma kontrolna BŁĄD → retransmisja",
      "[043] KLUCZ 2/3: 'CYK'  — suma kontrolna OK",
      "[044] KLUCZ 3/3: '090'  — suma kontrolna BŁĄD (duplikat)",
      "[045] KLUCZ 3/3: '113'  — suma kontrolna OK",
      'FORMAT KLUCZA: <1>-<2>-<3>',
    ].join('\n'),
    hints: [
      { pl: 'Ignoruj każdy wpis oznaczony jako BŁĄD — to retransmisje, nie klucz.', en: 'Ignore every entry marked BŁĄD (error) — those are retransmissions, not the key.' },
      { pl: 'Zostają trzy wpisy OK, po jednym na każdą część klucza.', en: 'Three OK entries remain, one for each part of the key.' },
      { pl: 'Format to <1>-<2>-<3>, małymi literami. Np. /solve p7-cyk-113', en: 'The format is <1>-<2>-<3>, lowercase. E.g. /solve p7-cyk-113' },
    ],
    solution: 'p7-cyk-113',
    validation: 'exact-lowercase',
    rewards: { xp: 100, flags: [FLAGS.M1_SWIERSZCZ_ONLINE, FLAGS.CMDS_DRONE] },
  },
];
