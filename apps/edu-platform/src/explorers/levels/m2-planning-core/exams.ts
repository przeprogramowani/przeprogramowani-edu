import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-solo-review',
    title: { pl: 'Przechwycony test VOID: Samodzielne code review', en: 'Captured VOID Test: Solo Code Review' },
    description: {
      pl: 'Test sprawdza recenzowanie własnej pracy wykonanej z agentem: oddzielenie roli recenzenta od autora, priorytety przeglądu i dyscyplinę werdyktu.',
      en: 'This test checks reviewing your own agent-assisted work: separating the reviewer role from the author, review priorities, and verdict discipline.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Pracujesz solo i musisz zrecenzować duży fragment kodu, który wczoraj napisał dla Ciebie agent. Jak podejść do recenzji, żeby nie była formalnością?', en: 'You work solo and must review a large piece of code an agent wrote for you yesterday. How do you approach the review so it is not a formality?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przeczytać diff od góry do dołu i zatwierdzić, jeśli nic nie razi — autor zna kontekst najlepiej', en: 'Read the diff top to bottom and approve if nothing stands out — the author knows the context best' } },
          { id: 'b', text: { pl: 'W osobnej sesji wejść w rolę recenzenta z jawną listą kontrolną i czytać zmianę jak cudzą pracę, której się nie ufa', en: 'In a separate session, take on the reviewer role with an explicit checklist and read the change like a stranger\'s work you do not trust' } },
          { id: 'c', text: { pl: 'Poprosić tego samego agenta w tej samej sesji o ocenę, czy jego kod jest poprawny', en: 'Ask the same agent in the same session to assess whether its code is correct' } },
          { id: 'd', text: { pl: 'Pominąć recenzję — przecież testy jednostkowe przechodzą', en: 'Skip the review — the unit tests pass, after all' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: { pl: 'Recenzujesz zmianę wygenerowaną przez agenta na podstawie planu. Na co zwrócić uwagę w pierwszej kolejności?', en: 'You are reviewing an agent-generated change based on a plan. What deserves attention first?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Styl nazewnictwa i formatowanie — to najczęstsze problemy generowanego kodu', en: 'Naming style and formatting — the most common problems in generated code' } },
          { id: 'b', text: { pl: 'Liczbę linii zmiany — im mniej, tym zawsze lepiej', en: 'The line count of the change — fewer is always better' } },
          { id: 'c', text: { pl: 'Zgodność z planem i kryteriami sukcesu oraz to, czego w zmianie brakuje: przypadki brzegowe, obsługa błędów, testy', en: 'Conformance to the plan and success criteria, and what the change is missing: edge cases, error handling, tests' } },
          { id: 'd', text: { pl: 'Czy agent użył najnowszych wersji bibliotek dostępnych na rynku', en: 'Whether the agent used the newest library versions on the market' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: { pl: 'Podczas samodzielnej recenzji znajdujesz dwa realne defekty. Jest późno, a funkcja „w zasadzie działa". Co dalej?', en: 'During a solo review you find two real defects. It is late, and the feature "basically works". What next?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zatwierdzić z notatką w głowie, żeby wrócić do defektów przy okazji', en: 'Approve, with a mental note to revisit the defects someday' } },
          { id: 'b', text: { pl: 'Naprawić defekty, ponownie zrecenzować zmienione fragmenty i dopiero wtedy zatwierdzić', en: 'Fix the defects, re-review the changed parts, and only then approve' } },
          { id: 'c', text: { pl: 'Wyłączyć testy wskazujące na defekty, żeby odblokować wdrożenie', en: 'Disable the tests that expose the defects, to unblock the release' } },
          { id: 'd', text: { pl: 'Uznać, że skoro recenzent i autor to ta sama osoba, werdykt i tak nie ma znaczenia', en: 'Decide that since reviewer and author are the same person, the verdict does not matter anyway' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M2_EXAM_SOLO_REVIEW_DONE] },
  },
];
