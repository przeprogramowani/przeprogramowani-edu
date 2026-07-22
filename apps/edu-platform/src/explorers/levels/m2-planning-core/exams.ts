import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-10',
    title: { pl: 'Protokół Ekspedycyjny X — Równoległe Tory', en: 'Expedition Protocol X — Parallel Tracks' },
    description: {
      pl: 'Weryfikacja pamięci na wieży dyspozytora: wiele torów, jeden dyspozytor. Protokół sprawdza, czy pamiętasz, które zadania nadają się do pracy równoległej, co daje git worktree i kiedy wolno oddelegować implementację bez nadzoru.',
      en: 'Memory verification at the dispatch tower: many tracks, one dispatcher. This protocol checks that you remember which tasks suit parallel work, what a git worktree provides, and when implementation may be delegated unattended.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Z wieży dyspozytora widzisz całą sieć torów fabryki. Chcesz prowadzić dwa slice\'y z roadmapy rozruchu równolegle, każdy z osobnym agentem. Które zadania nadają się do takiej pracy?',
          en: 'From the dispatch tower you see the factory\'s whole track network. You want to run two slices of the boot roadmap in parallel, each with its own agent. Which tasks suit that kind of work?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Dowolne dwa o statusie ready — od izolowania zmian między agentami są branche', en: 'Any two with ready status — isolating changes between agents is what branches are for' } },
          { id: 'b', text: { pl: 'Dwa największe — zysk z równoległości rośnie proporcjonalnie do rozmiaru zadania', en: 'The two largest — the gain from parallelism grows in proportion to task size' } },
          { id: 'c', text: { pl: 'Dwa powiązane tematycznie — agenci pracujący na tym samym obszarze korzystają ze wspólnych ustaleń', en: 'Two thematically related ones — agents working the same area benefit from shared groundwork' } },
          { id: 'd', text: { pl: 'Dwa niezależne — bez wspólnych plików, kontraktów i migracji; inaczej zamiast przyspieszenia produkujesz konflikt do ręcznego rozplątania', en: 'Two independent ones — no shared files, contracts, or migrations; otherwise instead of speed you produce a conflict to untangle by hand' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Dla każdej równoległej odnogi CORE AI zakłada agentowi osobny git worktree w repozytorium fabryki. Co daje worktree — i czego świadomie nie załatwia?',
          en: 'For each parallel branch line, CORE AI sets the agent up with its own git worktree in the factory repository. What does the worktree give — and what does it deliberately not solve?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Osobny katalog roboczy z własnym branchem i indexem na tym samym repo — ale nie izoluje środowiska: port serwera czy lokalna baza wciąż mogą być wspólne', en: 'A separate working directory with its own branch and index on the same repo — but it does not isolate the environment: the server port or local database can still be shared' } },
          { id: 'b', text: { pl: 'Pełną kopię repozytorium (klon) — dzięki temu środowiska agentów są odseparowane razem z bazą i portami', en: 'A full copy of the repository (a clone) — so the agents\' environments are separated along with database and ports' } },
          { id: 'c', text: { pl: 'Lekki branch w tym samym katalogu — agenci przełączają się między gałęziami bez zmiany plików na dysku', en: 'A lightweight branch in the same directory — agents switch between branches without files changing on disk' } },
          { id: 'd', text: { pl: 'Sandbox agenta, w którym zmiany nie trafiają do gita, dopóki nie zatwierdzisz ich ręcznie', en: 'An agent sandbox where changes do not reach git until you approve them by hand' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Rdzeń Harmonogramu znów planuje, a ty rozważasz oddanie jednej odnogi agentowi bez nadzoru — przez `/goal` z warunkiem końca. Kiedy możesz tak oddelegować implementację zamiast interaktywnej sesji?',
          en: 'The Schedule Core is planning again, and you weigh handing one branch line to an agent unattended — via `/goal` with an end condition. When can you delegate implementation that way instead of an interactive session?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Gdy zadanie jest trudne — delegowanie odciąża cię tam, gdzie interaktywna praca kosztuje najwięcej uwagi', en: 'When the task is hard — delegation relieves you where interactive work costs the most attention' } },
          { id: 'b', text: { pl: 'Gdy ufasz modelowi — nowsze modele nie wymagają już nadzoru przy typowych zadaniach programistycznych', en: 'When you trust the model — newer models no longer need supervision on typical programming tasks' } },
          { id: 'c', text: { pl: 'Gdy plan jest konkretny, zakres zamknięty, a warunki końca mierzalne — kontrola przesuwa się wtedy na PR i review, nie znika', en: 'When the plan is concrete, the scope closed, and the end conditions measurable — control then shifts to the PR and review, it does not disappear' } },
          { id: 'd', text: { pl: 'Nigdy przy kodzie produkcyjnym — tryb bez interakcji nadaje się wyłącznie do prototypów i spike\'ów', en: 'Never on production code — the non-interactive mode is fit only for prototypes and spikes' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_10_DONE] },
  },
];
