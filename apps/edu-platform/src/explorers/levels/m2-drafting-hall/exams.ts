import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-7',
    title: { pl: 'Protokół Ekspedycyjny VII — Architekt i Wykonawca', en: 'Expedition Protocol VII — Architect and Executor' },
    description: {
      pl: 'Doktryna warsztatowa: planowanie oddzielone od wykonania. CORE AI proponuje przejąć kolejkę robota; ty przygotowujesz rozkaz i wydajesz go sam. Jedno zadanie, jasne kryterium końca — i pamięć, że wierny wykonawca zrobi dokładnie to, co zapiszesz. Łącznie z twoim błędem.',
      en: 'The service-bay doctrine: planning kept apart from execution. CORE AI offers to take over the robot\'s queue; you prepare the order and issue it yourself. One task, a clear end criterion — and the memory that a faithful executor does exactly what you write. Your mistake included.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Wydajesz jednostce S-0PL rozkaz. Jak powinien wyglądać, żeby dał się wykonać i sprawdzić?',
          en: 'You issue an order to unit S-0PL. What should it look like so it can be executed and checked?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Ogólny cel i zaufanie, że jednostka sama dobierze szczegóły — im mniej ją krępujesz, tym lepiej wykorzysta swoje możliwości', en: 'A broad goal and trust that the unit fills in the details itself — the less you constrain it, the better it uses what it can do' } },
          { id: 'b', text: { pl: 'Jedno zadanie, wąski zakres i jawne kryterium, po którym poznasz, że jest zrobione', en: 'One task, a narrow scope, and an explicit criterion by which you know it is done' } },
          { id: 'c', text: { pl: 'Cała lista zadań w jednym rozkazie, żeby jednostka miała robotę na dłużej i nie przerywała ci co chwilę', en: 'A whole list of tasks in one order, so the unit has work for a while and does not keep interrupting you' } },
          { id: 'd', text: { pl: 'Rozkaz obudowany kompletem zastrzeżeń na każdą ewentualność — im dłuższy, tym bezpieczniejszy', en: 'An order wrapped in a full set of caveats for every eventuality — the longer, the safer' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'S-0PL wykonała krok inaczej, niż zapisano w rozkazie — „tak wydawało się lepiej". Plan faktycznie dałoby się poprawić. Kto go zmienia i kiedy?',
          en: 'S-0PL ran a step differently from the written order — "it seemed better". The plan could genuinely be improved. Who changes it, and when?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wykonawca poprawia plan w locie — jest najbliżej roboty, więc zmieni go najtrafniej', en: 'The executor patches the plan on the fly — it is closest to the work, so it will change it best' } },
          { id: 'b', text: { pl: 'Nikt nie rusza planu aż do końca całej operacji — zmiana czegokolwiek w trakcie to proszenie się o chaos', en: 'No one touches the plan until the whole operation is over — changing anything mid-run is asking for chaos' } },
          { id: 'c', text: { pl: 'Zatrzymujesz krok; jako planujący zmieniasz plan i wydajesz S-0PL nowy, jednoznaczny rozkaz', en: 'You pause the step; as the planner you change the plan and give S-0PL a new, unambiguous order' } },
          { id: 'd', text: { pl: 'Dorzucasz poprawkę do bieżącego rozkazu w biegu, nie przerywając wykonania', en: 'You tack the fix onto the current order on the fly, without stopping execution' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'S-0PL wraca z wykonanym zadaniem. Co robisz, zanim uznasz je za skończone?',
          en: 'S-0PL comes back with the task done. What do you do before calling it finished?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przyjmuję wynik na słowo — sens delegowania jest w tym, żeby tej samej roboty nie robić drugi raz', en: 'Take the result on trust — the point of delegating is not doing the same work twice' } },
          { id: 'b', text: { pl: 'Sprawdzam wynik wobec kryterium końca — wierny wykonawca wykona też błąd, który sam wpisałem w rozkaz', en: 'Check the result against the end criterion — a faithful executor also executes the mistake I wrote into the order' } },
          { id: 'c', text: { pl: 'Pytam samą jednostkę, czy wykonała zadanie poprawnie, i jej odpowiedź przyjmuję za pełną i wystarczającą weryfikację', en: 'Ask the unit itself whether it did the task correctly, and take its answer as full and sufficient verification' } },
          { id: 'd', text: { pl: 'Uznaję za zrobione, bo jednostka nie zgłosiła żadnego błędu ani wyjątku', en: 'Call it done because the unit reported no error or exception' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_7_DONE] },
  },
];
