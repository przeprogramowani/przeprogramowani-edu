import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-plan-first',
    title: { pl: 'Przechwycony test VOID: Plan przed kodem', en: 'Captured VOID Test: Plan Before Code' },
    description: {
      pl: 'Test sprawdza pracę plan-first z agentem: kontrakt planu przed implementacją, zawartość dobrego kontraktu i obsługę zmian zakresu w trakcie wykonania.',
      en: 'This test checks plan-first work with an agent: a plan contract before implementation, the contents of a good contract, and handling scope changes during execution.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Nawigator ma z agentem wdrożyć nowy moduł raportowania stacji. Agent proponuje: „zacznijmy od kodu, plan ułoży się po drodze". Co jest najlepszym pierwszym krokiem?', en: 'The Navigator is about to build a new station-reporting module with an agent. The agent proposes: "let\'s start with code, the plan will emerge along the way". What is the best first step?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pozwolić agentowi generować kod od razu — szybkie iteracje zastąpią planowanie', en: 'Let the agent generate code immediately — fast iterations will replace planning' } },
          { id: 'b', text: { pl: 'Spisać kontrakt planu: cel, zakres, kryteria sukcesu i nie-cele, zatwierdzić go, a dopiero potem implementować', en: 'Write the plan contract: goal, scope, success criteria, and non-goals, approve it, and only then implement' } },
          { id: 'c', text: { pl: 'Poprosić agenta o pełną dokumentację techniczną przyszłego systemu przed rozmową o celu', en: 'Ask the agent for full technical documentation of the future system before discussing the goal' } },
          { id: 'd', text: { pl: 'Zacząć od wyboru frameworka i struktury katalogów, bo to determinuje całą resztę', en: 'Start by choosing the framework and directory structure, because that determines everything else' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: { pl: 'Kontrakt planu nowej funkcji jest gotowy do zatwierdzenia. Który zestaw elementów świadczy o tym, że nadaje się do pracy z agentem?', en: 'The plan contract for a new feature is ready for approval. Which set of elements shows it is fit for work with an agent?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pełny listing przyszłego kodu i gotowa lista commitów do wykonania', en: 'A full listing of the future code and a ready list of commits to make' } },
          { id: 'b', text: { pl: 'Harmonogram godzinowy prac i przypisanie zadań do członków załogi', en: 'An hour-by-hour schedule and task assignments for crew members' } },
          { id: 'c', text: { pl: 'Sam opis technologii: język, framework, biblioteki i wersje zależności', en: 'A technology description alone: language, framework, libraries, and dependency versions' } },
          { id: 'd', text: { pl: 'Cel, zakres, mierzalne kryteria sukcesu i jawne nie-cele wyznaczające granice pracy agenta', en: 'Goal, scope, measurable success criteria, and explicit non-goals marking the boundaries of the agent\'s work' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: { pl: 'W połowie implementacji agent odkrywa, że prostsze rozwiązanie wymaga wyjścia poza zatwierdzony zakres planu. Co powinno się wydarzyć?', en: 'Halfway through implementation, the agent discovers a simpler solution that requires stepping outside the approved plan scope. What should happen?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Agent wdraża prostsze rozwiązanie od razu — plan nie może blokować oczywistej poprawy', en: 'The agent ships the simpler solution immediately — a plan must not block an obvious improvement' } },
          { id: 'b', text: { pl: 'Agent porzuca całą dotychczasową pracę i rozpoczyna plan od zera', en: 'The agent abandons all work so far and starts the plan from scratch' } },
          { id: 'c', text: { pl: 'Zatrzymać pracę, zaproponować decydentowi aktualizację planu i wrócić do implementacji po zatwierdzeniu zmiany', en: 'Stop the work, propose a plan update to the decision-maker, and return to implementation once the change is approved' } },
          { id: 'd', text: { pl: 'Agent dopisuje zmianę do planu po fakcie, żeby dokumentacja pozostała spójna', en: 'The agent appends the change to the plan after the fact, so the documentation stays consistent' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M2_EXAM_PLAN_FIRST_DONE] },
  },
];
