import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-10',
    title: { pl: 'Protokół Ekspedycyjny X — Równoległe Tory', en: 'Expedition Protocol X — Parallel Tracks' },
    description: {
      pl: 'Doktryna dyspozytorska: wiele torów, jeden dyspozytor. Deleguj odnogi osobnym jednostkom, chroń tor główny, scalaj dopiero po przeglądzie — i mierz osobno tempo układania planów, osobno tempo ich wykonania.',
      en: 'The dispatcher\'s doctrine: many tracks, one dispatcher. Delegate the branches to separate units, protect the main track, merge only after review — and measure planning tempo separately from execution tempo.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Rozdzielasz kilka zadań na osobne jednostki wykonawcze, żeby jechały równolegle. Jak chronisz tor główny?',
          en: 'You split several tasks across separate executor units to run in parallel. How do you protect the main track?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Puszczam wszystko jednym torem, po kolei — równoległe zadania i tak weszłyby sobie w drogę', en: 'Route everything down one track, one after another — parallel tasks would only get in each other\'s way' } },
          { id: 'b', text: { pl: 'Deleguję odnogi na osobne tory, a na główny wpuszczam wynik dopiero po przeglądzie', en: 'Delegate the branches onto separate tracks, and let a result onto the main only after review' } },
          { id: 'c', text: { pl: 'Trzymam wszystkie odnogi wpięte w tor główny na bieżąco, żeby cały czas jechały zsynchronizowane', en: 'Keep every branch wired into the main track continuously, so they stay in sync the whole time' } },
          { id: 'd', text: { pl: 'Prowadzę odnogi po torze głównym, tyle że w innych taktach — mniej rozjazdów, mniej kłopotu', en: 'Run the branches on the main track, just in different time-slots — fewer switches, less trouble' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Jednostka kończy swoją odnogę i zgłasza gotowy wynik. Kiedy wolno scalić go z torem głównym?',
          en: 'A unit finishes its branch and reports a ready result. When may it merge into the main track?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Od razu — odnoga sama zgłosiła koniec, a oddelegowałem ją przecież właśnie po to, żeby już jej nie sprawdzać ręcznie', en: 'At once — the branch reported done itself, and I delegated it precisely so I would not have to check it by hand' } },
          { id: 'b', text: { pl: 'Dopiero po przeglądzie wyniku wobec kryterium — scalenie bez przeglądu przenosi jej błąd wprost na tor główny', en: 'Only after reviewing the result against the criterion — merging without review carries its error straight onto the main track' } },
          { id: 'c', text: { pl: 'Gdy wynik przejdzie automatyczną kontrolę na bocznicy — wtedy ręczny przegląd jest już zbędny', en: 'Once the result passes the automated check on the siding — then a manual review is redundant' } },
          { id: 'd', text: { pl: 'Gdy trzeba ją domknąć, zanim urośnie i spowolni resztę — szybkie scalenie jest ważniejsze', en: 'When it has to be closed before it grows and slows the rest — a quick merge matters more' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Chcesz ocenić, czy rozdzielanie pracy na równoległe jednostki naprawdę pomaga. Co mierzysz?',
          en: 'You want to judge whether splitting work across parallel units truly helps. What do you measure?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Sam skrócony czas całości — jeśli cała fabryka kończy dzień wyraźnie szybciej niż wcześniej, to znaczy, że praca równoległa naprawdę się opłaca', en: 'Just the shorter total time — if the whole factory ends the day clearly sooner than before, parallel work really pays off' } },
          { id: 'b', text: { pl: 'Osobno tempo układania planów, osobno tempo ich wykonania — inaczej nie odróżnisz, czy wąskim gardłem jest planowanie, czy robota', en: 'Planning tempo and execution tempo separately — otherwise you cannot tell whether the bottleneck is the planning or the work' } },
          { id: 'c', text: { pl: 'Ile odnóg jedzie naraz — im więcej zajętych torów, tym większa przepustowość', en: 'How many branches run at once — the more tracks busy, the higher the throughput' } },
          { id: 'd', text: { pl: 'Ile zadań zeszło z tablicy w ciągu dnia — przerób mówi wszystko o wydajności', en: 'How many tasks left the board in a day — throughput tells you everything about performance' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_10_DONE] },
  },
];
