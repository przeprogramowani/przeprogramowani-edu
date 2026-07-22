import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-9',
    title: { pl: 'Protokół Ekspedycyjny IX — Ostatnie 20%', en: 'Expedition Protocol IX — The Last 20%' },
    description: {
      pl: 'Weryfikacja pamięci przy sterowni huty: automat niesie cię przez większość roboty, ale przegląd wyniku należy do człowieka. Protokół sprawdza, czy pamiętasz, jak czytać diff wygenerowany przez agenta, jak robić triage findings i co naprawdę mówi zielony test.',
      en: 'Memory verification at the foundry control room: the automaton carries most of the work, but reviewing the result belongs to the human. This protocol checks that you remember how to read an agent-generated diff, how to triage findings, and what a green test really says.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Automat linii wytopu kończy fazę i przynosi ci do sterowni gotowy diff do review. Od czego zaczynasz czytanie?',
          en: 'The melt-line automaton finishes a phase and brings a ready diff to the control room for your review. Where do you start reading?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Od zakresu — czy agent zmienił tylko to, co wynikało z planu, czy rozwiązał też „problem obok"', en: 'With scope — did the agent change only what the plan called for, or also solve the "problem next door"' } },
          { id: 'b', text: { pl: 'Od jakości kodu — nazwy, czytelność i styl najszybciej zdradzają, czy zmiana jest solidna', en: 'With code quality — names, readability, and style are the quickest tell of whether a change is solid' } },
          { id: 'c', text: { pl: 'Od testów — jeśli przechodzą, reszta review jest już głównie formalnością do odhaczenia', en: 'With the tests — if they pass, the rest of the review is mostly a formality to tick off' } },
          { id: 'd', text: { pl: 'Od największego pliku w diffie — tam statystycznie kryje się najwięcej wprowadzonych błędów', en: 'With the largest file in the diff — statistically that is where most of the introduced bugs hide' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Uruchamiasz w sterowni pełny review implementacji zmiany automatu. Raport zgłasza pięć findings. Jak z nimi pracujesz przed merge?',
          en: 'In the control room you run a full implementation review of the automaton\'s change. The report lists five findings. How do you work through them before merge?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Naprawiam wszystkie po kolei — review po to jest, żeby nie zostawiać w kodzie żadnych znanych problemów', en: 'Fix them all one by one — the point of review is to leave no known problems in the code' } },
          { id: 'b', text: { pl: 'Naprawiam tylko oznaczone jako krytyczne — poziom severity w raporcie wystarcza do podjęcia decyzji', en: 'Fix only the ones marked critical — the severity level in the report is enough to decide' } },
          { id: 'c', text: { pl: 'Oceniam każdy po severity i impact — część naprawiam, część świadomie pomijam, a wzorce zapisuję jako regułę', en: 'Weigh each by severity and impact — fix some, consciously skip some, and record patterns as a rule' } },
          { id: 'd', text: { pl: 'Odsyłam pełną listę agentowi, który pisał ten kod — sam najlepiej oceni, które uwagi są zasadne, a które nadgorliwe', en: 'Send the full list back to the agent that wrote the code — it can best judge which remarks are valid and which overzealous' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Automat melduje partię gotową do ładowni: wszystkie testy przy jego zmianie świecą się na zielono. Co to mówi o gotowości do merge?',
          en: 'The automaton reports the batch ready for the cargo bay: all the tests on its change show green. What does that say about readiness to merge?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zmiana jest zweryfikowana — automatyczna weryfikacja zachowania to dokładnie rola testów w procesie', en: 'The change is verified — automated verification of behaviour is exactly the tests\' role in the process' } },
          { id: 'b', text: { pl: 'Samo w sobie niewiele — test pisał ten sam agent; sprawdzam, czy wykryłby błąd, przed którym ma chronić', en: 'Little on its own — the same agent wrote the test; I check whether it would catch the bug it is meant to guard against' } },
          { id: 'c', text: { pl: 'Że kod jest poprawny technicznie — do oceny zostaje już tylko zgodność ze stylem projektu', en: 'That the code is technically correct — all that remains to judge is conformance to project style' } },
          { id: 'd', text: { pl: 'Że można mergować, o ile pokrycie kodu nie spadło poniżej progu przyjętego w projekcie', en: 'That it can merge, as long as code coverage has not dropped below the project\'s threshold' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_9_DONE] },
  },
];
