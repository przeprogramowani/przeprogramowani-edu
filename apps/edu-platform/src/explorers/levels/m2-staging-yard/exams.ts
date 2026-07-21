import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-mvp-milestones',
    title: { pl: 'Przechwycony test VOID: Kamienie milowe MVP', en: 'Captured VOID Test: MVP Milestones' },
    description: {
      pl: 'Test sprawdza cięcie planu na kamienie milowe: definicję dobrego kamienia, wybór minimalnego łańcucha wartości i dyscyplinę zakresu pod twardym budżetem.',
      en: 'This test checks cutting a plan into milestones: what makes a good milestone, choosing a minimal value chain, and scope discipline under a hard budget.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Plan zakłada nowy moduł powiadomień stacji. Który podział na kamienie milowe najlepiej wspiera pracę z agentem?', en: 'The plan calls for a new station-notifications module. Which milestone split best supports working with an agent?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Jeden kamień „zbuduj cały moduł", bo mniejsze kroki mnożą narzut', en: 'One milestone, "build the whole module", because smaller steps multiply overhead' } },
          { id: 'b', text: { pl: 'Kamienie według warstw technicznych: najpierw cała baza danych, potem całe API, na końcu całe UI', en: 'Milestones by technical layer: the whole database first, then the whole API, the whole UI last' } },
          { id: 'c', text: { pl: 'Krótki łańcuch kamieni, z których każdy kończy się działającym, weryfikowalnym efektem dla użytkownika', en: 'A short chain of milestones, each ending in a working, verifiable effect for the user' } },
          { id: 'd', text: { pl: 'Kamienie odpowiadające dniom tygodnia, niezależnie od zawartości pracy', en: 'Milestones mapped to days of the week, regardless of the work inside' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: { pl: 'Zespół proponuje kamień milowy „analiza i przygotowanie architektury (raport wewnętrzny)". Co jest z nim nie tak w ujęciu MVP?', en: 'The team proposes a milestone: "analysis and architecture preparation (internal report)". What is wrong with it from an MVP standpoint?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Nic — każdy etap pracy zasługuje na własny kamień milowy', en: 'Nothing — every stage of work deserves its own milestone' } },
          { id: 'b', text: { pl: 'Kamień nie kończy się obserwowalną, weryfikowalną wartością — opisuje aktywność, a nie rezultat', en: 'The milestone does not end in observable, verifiable value — it describes activity, not an outcome' } },
          { id: 'c', text: { pl: 'Jest za tani — kamienie milowe powinny konsumować porównywalne części budżetu', en: 'It is too cheap — milestones should consume comparable slices of the budget' } },
          { id: 'd', text: { pl: 'Raporty wolno pisać wyłącznie po zakończeniu całego projektu', en: 'Reports may only be written after the whole project is finished' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: { pl: 'W trakcie realizacji łańcucha MVP interesariusz prosi o „drobny dodatek przy okazji": ekran statystyk. Budżet czasu jest napięty. Co zrobić?', en: 'Mid-way through the MVP chain, a stakeholder asks for a "small add-on while you are at it": a statistics screen. The time budget is tight. What do you do?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Dopisać ekran do bieżącego kamienia — skoro zespół i tak pracuje w tym obszarze', en: 'Fold the screen into the current milestone — the team is working in that area anyway' } },
          { id: 'b', text: { pl: 'Przerwać łańcuch i zrealizować prośbę natychmiast, bo pochodzi od interesariusza', en: 'Pause the chain and deliver the request immediately, because it comes from a stakeholder' } },
          { id: 'c', text: { pl: 'Zrealizować ekran po cichu poza planem, żeby nie otwierać dyskusji o zakresie', en: 'Build the screen quietly outside the plan, to avoid opening a scope discussion' } },
          { id: 'd', text: { pl: 'Zapisać prośbę jako kandydata do przyszłego łańcucha i dokończyć bieżący zakres MVP bez zmian', en: 'Record the request as a candidate for a future chain and finish the current MVP scope unchanged' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M2_EXAM_MVP_MILESTONES_DONE] },
  },
];
