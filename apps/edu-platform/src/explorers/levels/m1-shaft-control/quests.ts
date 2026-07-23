import type { TextAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: TextAnswerQuest[] = [
  {
    id: 'q-m1-cricket',
    completionType: 'text-answer',
    title: { pl: 'Świerszcz', en: 'Cricket' },
    briefing: {
      pl: 'Odzyskany dziennik drona zawiera pięć fragmentów procedury naprawczej. Odtwórz sekwencję technicznych kodów na podstawie zależności między nimi. Podaj odpowiedź przez /solve, aby naprawić drona.',
      en: 'The recovered drone log contains five fragments of its repair procedure. Reconstruct the sequence of technical codes from the relationships between them. Enter the answer via /solve to repair the drone.',
    },
    inputPayload: [
      'ODYSSEY-P7 // DZI##NIK NAPRA#Y SYS##MU',
      '',
      '[ww5] Aktywacja następuje bezpośrednio po HGX.',
      '[rq4] Moduł zamyka procedurę, już po wykonaniu N7K.',
      '[ac1] Przed tym etapem nie może znaleźć się żaden inny.',
      '[n7k] Etap musi znaleźć się po WW5, ale przed RQ4.',
      '[hgx] Moduł działa później niż AC1 i wcześniej niż WW5.',
      '',
      'FORMAT KODU: P7-<1>-<2>-<3>-<4>-<5>',
    ].join('\n'),
    hints: [
      { pl: 'Zapisz każdą relację jako prostą strzałkę: jeśli jeden etap jest przed drugim, zanotuj A → B.', en: 'Rewrite each relationship as a simple arrow: if one stage comes before another, note A → B.' },
      { pl: 'Najpierw znajdź dwa punkty kotwiczące: etap, przed którym nie ma niczego, oraz etap zamykający procedurę.', en: 'First find the two anchors: the stage with nothing before it and the stage that closes the procedure.' },
      { pl: 'Potraktuj „bezpośrednio po” jako nierozłączną parę. Wstaw ją między skrajnymi etapami, a potem umieść pozostały kod zgodnie z jego dwiema relacjami.', en: 'Treat “immediately after” as an inseparable pair. Place it between the two anchors, then position the remaining code using its two relationships.' },
    ],
    solution: 'p7-ac1-hgx-ww5-n7k-rq4',
    validation: 'exact-lowercase',
    rewards: { xp: 100, flags: [FLAGS.M1_SWIERSZCZ_ONLINE] },
  },
];
