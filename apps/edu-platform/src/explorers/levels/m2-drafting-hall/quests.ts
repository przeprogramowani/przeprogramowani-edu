import type { TextAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: TextAnswerQuest[] = [
  {
    id: 'q-m2-new-order',
    completionType: 'text-answer',
    title: { pl: 'Nowy Rozkaz', en: 'New Order' },
    briefing: {
      pl: 'Harmonogram hali przetrwał zrzut awaryjny, ale kolejność wykonania się zatarła. Zostało siedem zleceń i ich wymagania. Zadanie może ruszyć dopiero, gdy wszystkie jego wymagania są wykonane — istnieje dokładnie jeden porządek, w którym całość da się skończyć. Podaj litery stanowisk w tej kolejności przez /solve, aby wydać S-0PL nowy rozkaz.',
      en: 'The bay schedule survived the emergency dump, but the execution order was wiped. Seven work orders and their requirements remain. A task can start only once all of its requirements are done — there is exactly one order in which everything can be finished. Enter the bay letters in that order via /solve to issue S-0PL a new order.',
    },
    inputPayload: [
      'HARMONOGRAM HALI SERWISOWEJ — KOLEJNOŚĆ ZATARTA',
      '[a] KADŁUB      — wymaga: SPAW',
      '[b] OKABLOWANIE — wymaga: ZASILANIE, SPAW',
      '[c] ODLEW       — wymaga: — (materiał na stanie)',
      '[d] ROZRUCH     — wymaga: TEST, ZASILANIE',
      '[e] ZASILANIE   — wymaga: KADŁUB, ODLEW',
      '[f] TEST        — wymaga: OKABLOWANIE',
      '[g] SPAW        — wymaga: ODLEW',
      'ZLECENIE RUSZA TYLKO, GDY JEGO WYMAGANIA SĄ WYKONANE.',
      'FORMAT ODPOWIEDZI: 7 liter stanowisk przedzielonych myślnikami, np. /solve a-b-c-d-e-f-g',
    ].join('\n'),
    hints: [
      { pl: 'Identyfikatory linii nie oznaczają kolejności wykonania.', en: 'The line identifiers do not reflect the execution order.' },
      { pl: 'Prowadź łańcuch zadań od pierwszego dostępnego.', en: 'Build the task chain starting from the first available one.' },
      { pl: 'Uważaj na zadania z dwoma wymaganiami — jedno spełnione to za mało.', en: 'Watch out for tasks with two requirements — one satisfied is not enough.' },
    ],
    solution: 'c-g-a-e-b-f-d',
    validation: 'exact-lowercase',
    rewards: { xp: 100, flags: [FLAGS.M2_SOPEL_ONLINE] },
  },
];
