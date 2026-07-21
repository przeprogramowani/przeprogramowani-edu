import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-8',
    title: { pl: 'Protokół Ekspedycyjny VIII — Żywy Plan', en: 'Expedition Protocol VIII — Living Plan' },
    description: {
      pl: 'Doktryna dyspozytorska: plan, którego nikt nie aktualizuje, jest pułapką. CORE AI ułoży następny krok z tego, co zapisano na tablicy — więc po każdym kroku zapisz stan, po każdej zmianie popraw mapę. Plan nieaktualny jest gorszy niż brak planu.',
      en: 'The dispatcher\'s doctrine: a plan no one updates is a trap. CORE AI plans the next move from what the board records — so record the state after every step and fix the map after every change. A stale plan is worse than no plan.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'CORE AI ma ułożyć plan zwolnień z tablicy stanów torów — a tablica pokazuje stan sprzed lat. Jak ją traktujesz?',
          en: 'CORE AI is to build the release plan from the track-state board — but the board shows a state from years ago. How do you treat it?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Biorę ją za punkt wyjścia — skoro ktoś spisał ją starannie, oszczędzi mi roboty od zera', en: 'Take it as a starting point — since someone wrote it carefully, it saves me starting from scratch' } },
          { id: 'b', text: { pl: 'Traktuję ostrożnie i sprawdzam w terenie — zapis rozjechany z rzeczywistością myli bardziej niż jego brak', en: 'Treat it with caution and verify on the ground — a record out of step with reality misleads more than none' } },
          { id: 'c', text: { pl: 'Odrzucam ją w całości i odtwarzam stan sieci od zera, bez zaglądania do starego zapisu', en: 'Discard it entirely and rebuild the network state from scratch, without looking at the old record' } },
          { id: 'd', text: { pl: 'Biorę ją za obowiązującą i to rozjazdy ustawiam tak, żeby pasowały do zapisu', en: 'Take it as authoritative and set the switches to match the record instead' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Prowadzisz wieloetapową operację na sieci torów; CORE AI po każdym kroku czyta stan, żeby zaproponować następny. Kiedy aktualizujesz zapis?',
          en: 'You run a multi-step operation on the rail network; after each step CORE AI reads the state to propose the next. When do you update the record?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Na końcu operacji, jednym rzetelnym wpisem — bieżące notatki i tak trzeba by potem czyścić', en: 'At the end of the operation, in one solid entry — running notes would need cleaning up later anyway' } },
          { id: 'b', text: { pl: 'Po każdym kroku i każdej zmianie stanu — zapis ma nadążać za siecią, nie za moją pamięcią', en: 'After every step and every state change — the record must keep pace with the network, not with my memory' } },
          { id: 'c', text: { pl: 'Tylko przy kamieniach milowych — notowanie każdego drobiazgu to szum, który zaciemnia obraz', en: 'Only at milestones — noting every little thing is noise that clouds the picture' } },
          { id: 'd', text: { pl: 'Gdy stan się ustabilizuje — nie ma sensu zapisywać czegoś, co za chwilę i tak się zmieni', en: 'Once the state settles — no point recording something that will change again in a moment' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Przekazujesz niedokończoną operację nowej zmianie — operatorowi, który nie widział, co już zrobiłeś. Co decyduje, czy przejmie ją bezpiecznie?',
          en: 'You hand an unfinished operation to a new shift — an operator who did not see what you already did. What decides whether they can take it over safely?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Doświadczenie przejmującego — dobry operator odczyta z samej sieci, co już zrobiono', en: 'The taker\'s experience — a good operator reads what was done off the network itself' } },
          { id: 'b', text: { pl: 'Aktualny, spisany stan i mapa zgodna z siecią — zaczyna od faktu, nie od rekonstrukcji', en: 'A current, written state and a map that matches the network — they start from fact, not reconstruction' } },
          { id: 'c', text: { pl: 'Pełny zapis wszystkiego, co robiłeś, krok po kroku od początku zmiany — im więcej historii, tym bezpieczniej', en: 'A full log of everything you did, step by step from the start of the shift — the more history, the safer' } },
          { id: 'd', text: { pl: 'Rozmowa na żywo, w której streszczasz mu z pamięci, co się działo', en: 'A live chat where you sum up from memory what happened' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_8_DONE] },
  },
];
