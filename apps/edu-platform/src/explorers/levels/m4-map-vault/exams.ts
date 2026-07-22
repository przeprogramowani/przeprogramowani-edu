import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm4-exam-protocol-19',
    title: { pl: 'Protokół Ekspedycyjny XIX — Przeprawa', en: 'Expedition Protocol XIX — The Crossing' },
    description: {
      pl: 'Doktryna przeprawowa: eksploracja kończy się raportem opcji, nie decyzją. Człowiek wybiera kierunek, dopiero potem wpuszcza maszyny — komora po komorze, z pieczęcią i sprawdzeniem po każdej. Zanim przebudujesz, przeczytaj historię: nie każda złożoność jest do usunięcia.',
      en: 'The crossing doctrine: exploration ends in a report of options, not a decision. The human picks the direction, then lets the machines in — chamber by chamber, with a seal and a check after each. Before you rebuild, read the history: not every complexity is there to be removed.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'W Skarbcu Map kusi cię gest: wskazać agentowi splątany moduł katalogu i napisać „zrefaktoryzuj ten moduł". Wraca czyściutki diff na czterdzieści plików. Jak przygotować taką przeprawę, żeby diff nie zabetonował bałaganu?',
          en: 'In the Map Vault a gesture tempts you: point the agent at the tangled catalogue module and write "refactor this module." Back comes a tidy forty-file diff. How do you set up such a crossing so the diff does not cement the mess?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Skoro diff jest duży, ale czysty i testy przechodzą — przyjąć go; refaktor się udał', en: 'Since the diff is large but clean and the tests pass — accept it; the refactor succeeded' } },
          { id: 'b', text: { pl: 'Zlecić agentowi przedstawienie opcji z docelowym kształtem, historią decyzji i drogą odwrotu — wybór zostaje przy tobie', en: 'Have the agent present options with a target shape, the history of decisions, and a reversible path — the choice stays with you' } },
          { id: 'c', text: { pl: 'Kazać od razu przepisać moduł do modelu domenowego — to docelowa, nowoczesna forma', en: 'Have it rewrite the module straight to a domain model — that is the modern, correct target' } },
          { id: 'd', text: { pl: 'Wygenerować moduł od zera — skoro kod jest dziś tani, przepisanie jest bezpieczne', en: 'Generate the module from scratch — since code is cheap now, a rewrite is safe' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'W module katalogu siedzą pozycyjne tablice kolumn — brzydkie i straszne. Git log pokazuje, że wprowadzono je celowo lata temu dla wydajności zapisu hurtowego, i przez sześć lat nie dały ani jednego błędu. Jak potraktować to miejsce?',
          en: 'The catalogue module holds positional column arrays — ugly and scary. The git log shows they were introduced deliberately years ago for bulk-write performance, and in six years they produced not one bug. How do you treat this spot?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'To celowe ograniczenie — przykryj je testem charakteryzującym i nie przebudowuj', en: 'It is a deliberate constraint — pin it with a characterization test and do not rebuild' } },
          { id: 'b', text: { pl: 'Brzydki, straszny kod to złożoność przypadkowa — zrefaktoryzuj go do czystszej formy', en: 'Ugly, scary code is accidental complexity — refactor it into a cleaner form' } },
          { id: 'c', text: { pl: 'Najsilniejszy hotspot z raportu jest z definicji pierwszym kandydatem do przebudowy', en: 'The strongest hotspot in the report is by definition the top rebuild candidate' } },
          { id: 'd', text: { pl: 'Najpierw przeprojektuj moduł, potem dopisz test — ma utrwalić poprawne zachowanie', en: 'Redesign the module first, then add the test — it should lock in the correct behavior' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Egzamin XIX: korytarz zbyt kręty dla gąsienic to mały, prosty moduł. Raport badawczy ustawił kandydatów w ranking. Jak poprowadzić przeprawę przez taki moduł?',
          en: 'Protocol XIX: the corridor too winding for the crawlers is a small, simple module. The research report ranked the candidates. How do you route the crossing through such a module?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przeprowadzić jednorazowe, całościowe cięcie — od razu podmienić stary moduł na nowy', en: 'Do a single big-bang cutover — swap the old module for the new one at once' } },
          { id: 'b', text: { pl: 'Ranking z raportu jest decyzją — wdrażaj pozycję numer jeden', en: 'The report ranking is the decision — implement number one' } },
          { id: 'c', text: { pl: 'Prosty moduł może zostać Transaction Scriptem; jeśli migrujesz, rób to odwracalnie, tak by pień był wciąż wydawalny', en: 'A simple module may stay a Transaction Script; if you migrate, do it reversibly so the trunk stays releasable' } },
          { id: 'd', text: { pl: 'Każdy moduł należy docelowo doprowadzić do Modelu Domenowego — to forma dojrzała', en: 'Every module should end up a Domain Model — that is the mature form' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M4_EXAM_PROTOCOL_19_DONE] },
  },
];
