import type { TextAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: TextAnswerQuest[] = [
  {
    id: 'q-m2-new-order',
    completionType: 'text-answer',
    title: { pl: 'Nowy Rozkaz', en: 'New Order' },
    briefing: {
      pl: 'Wydobądź z logów hali właściwe zlecenie i klucz zwolnienia kolejki. Licz tylko zlecenia ze stemplem dyspozytora i tylko klucze z poprawną sumą kontrolną. Złóż odpowiedź w formacie zlecenie-klucz i podaj przez /solve, aby wydać S-0PL nowy rozkaz.',
      en: 'Extract the correct work order and queue release key from the bay logs. Count only orders with a dispatcher stamp and only keys with a valid checksum. Assemble the answer in the order-key format and enter it via /solve to issue S-0PL a new order.',
    },
    inputPayload: [
      'KOLEJKA HALI SERWISOWEJ — ZRZUT AWARYJNY',
      "[311] ZLECENIE: 'RW-77'   — stempel dyspozytora: BRAK → odrzuć",
      "[312] ZLECENIE: 'RW-04'   — stempel dyspozytora: OK",
      "[313] KLUCZ ZWOLNIENIA: 'SZRON'  — suma kontrolna BŁĄD → retransmisja",
      "[314] KLUCZ ZWOLNIENIA: 'JUTRO'  — suma kontrolna OK",
      'FORMAT ODPOWIEDZI: <zlecenie>-<klucz>',
    ].join('\n'),
    hints: [
      { pl: 'Zlecenie bez stempla dyspozytora nie liczy się — zostaje tylko jedno.', en: 'An order without a dispatcher stamp does not count — only one remains.' },
      { pl: 'Klucz z błędną sumą kontrolną to retransmisja, nie klucz. Weź ten oznaczony OK.', en: 'A key with a bad checksum is a retransmission, not a key. Take the one marked OK.' },
      { pl: 'Format to <zlecenie>-<klucz>, małymi literami. Np. /solve rw-77-szron', en: 'The format is <order>-<key>, lowercase. E.g. /solve rw-77-szron' },
    ],
    solution: 'rw-04-jutro',
    validation: 'exact-lowercase',
    rewards: { xp: 100, flags: [FLAGS.M2_SOPEL_ONLINE, FLAGS.CMDS_SOPEL] },
  },
];
