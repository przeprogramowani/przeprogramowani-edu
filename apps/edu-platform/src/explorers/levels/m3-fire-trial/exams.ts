import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-13',
    title: { pl: 'Protokół Ekspedycyjny XIII — Rachunek Ryzyka', en: 'Expedition Protocol XIII — The Risk Ledger' },
    description: {
      pl: 'Doktryna poligonowa: badaj najpierw to, co zabija pierwsze, a odłożone naprawy prowadź w jawnym rejestrze zaległości. Dług ukryty rośnie w ciemności; dług spisany można spłacić.',
      en: 'The range doctrine: test first what kills first, and keep deferred repairs in an open backlog register. Hidden debt grows in the dark; written debt can be paid.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Masz trzy próby do przeprowadzenia i mało czasu. Od której zaczynasz?',
          en: 'You have three trials to run and little time. Which do you start with?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Od najbliższej — układam kolejność wg wygody, żeby zdążyć z jak największą liczbą', en: 'The nearest one — I order by convenience, to get through as many as possible' } },
          { id: 'b', text: { pl: 'Od tej, której usterka uderzy najmocniej i najszybciej — kolejność dyktuje ryzyko', en: 'The one whose failure would hit hardest and soonest — risk sets the order' } },
          { id: 'c', text: { pl: 'Od najłatwiejszej — szybkie zaliczenie podbije licznik zrobionych prób', en: 'The easiest one — a quick pass bumps the count of trials done' } },
          { id: 'd', text: { pl: 'Od tej, którą najpewniej zaliczę — po co zaczynać od próby, która może wypaść na czerwono', en: 'The one I am surest to pass — why start with a trial that might come out red' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Wykryłeś usterkę, ale naprawę musisz odłożyć. Co z nią robisz?',
          en: 'You found a fault but must defer the repair. What do you do with it?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zapisuję ją w jawnym rejestrze zaległości — z powodem, ryzykiem i priorytetem', en: 'I log it in an open backlog register — with reason, risk, and priority' } },
          { id: 'b', text: { pl: 'Trzymam ją w pamięci i pilnuję sam — wrócę do niej, zanim zdąży urosnąć', en: 'I keep it in my head and watch it myself — I will return before it grows' } },
          { id: 'c', text: { pl: 'Zostawiam ją następnej zmianie bez wpisu — kto tu wejdzie, sam ją zobaczy', en: 'I leave it to the next shift without an entry — whoever comes will see it themselves' } },
          { id: 'd', text: { pl: 'Melduję ją jako naprawioną z planem powrotu — żeby tablica została zielona, dopóki jej nie tknę', en: 'I report it as fixed with a plan to return — so the board stays green until I touch it' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Weryfikator podstemplował stanowisko „ZALICZONO", ale nikt nie widział samej próby. Czy to jest zaliczenie?',
          en: 'The verifier stamped a stand "PASSED", but no one saw the trial itself. Is that a pass?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Tak — pieczęć weryfikatora jest dokumentem, a dokument wystarcza za dowód', en: 'Yes — the verifier stamp is a document, and a document stands in for proof' } },
          { id: 'b', text: { pl: 'Nie — „zaliczono" waży tyle, ile próba za nim; bez powtórzonej próby to tylko twierdzenie', en: 'No — "passed" is worth only as much as the trial behind it; without a repeated trial it is only a claim' } },
          { id: 'c', text: { pl: 'Tak, jeśli daty i podpisy w rejestrze się zgadzają — spójny zapis potwierdza, że próba była', en: 'Yes, if the dates and signatures in the register match — a consistent record confirms the trial happened' } },
          { id: 'd', text: { pl: 'Nie da się tego orzec bez weryfikatora, więc do czasu naprawy przyjmuję zaliczenie', en: 'It cannot be settled without the verifier, so until it is fixed I accept the pass' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_13_DONE] },
  },
];
