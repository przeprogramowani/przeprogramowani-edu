import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-9',
    title: { pl: 'Protokół Ekspedycyjny IX — Ostatnie 20%', en: 'Expedition Protocol IX — The Last 20%' },
    description: {
      pl: 'Doktryna hutnicza: automat linii niesie cię przez pierwsze 80% roboty, ale ostatnia część należy do człowieka. Rozpoznaj pętlę błędu, przejmij stery na czas i sam obejrzyj wynik, zanim trafi do ładowni.',
      en: 'The foundry doctrine: the line\'s automaton carries you through the first 80% of the work, but the last part is the human\'s. Recognise the error loop, take the controls in time, and inspect the result yourself before it ships.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Automat linii trzeci raz z rzędu wykonuje tę samą fazę z tym samym błędem. Co to znaczy?',
          en: 'The line automaton runs the same phase with the same error a third time in a row. What does that mean?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Że jest blisko — jeszcze jedno, dwa podejścia i samo zaskoczy', en: 'That it is close — one or two more attempts and it will click on its own' } },
          { id: 'b', text: { pl: 'Że utknął w pętli błędu — ten sam błąd trzeci raz nie naprawi się czwartym; przejmuję stery', en: 'That it is stuck in an error loop — the same error a third time will not fix itself on the fourth; I take the controls' } },
          { id: 'c', text: { pl: 'Że rozkaz był zły — kasuję wszystko i wydaję fazę od nowa, innymi słowami', en: 'That the order was wrong — I wipe it all and reissue the phase from scratch, in other words' } },
          { id: 'd', text: { pl: 'Że brakuje mu kontekstu — dorzucam więcej danych o poprzednich próbach i pozwalam mu próbować dalej', en: 'That it lacks context — I feed it more data about the previous attempts and let it keep trying' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Linia doprowadziła wytop do 80%. Jak dzielisz odpowiedzialność za ostatnią fazę?',
          en: 'The line carried the melt to 80%. How do you split responsibility for the last phase?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Automat dokańcza sam — skoro bez potknięcia doszedł aż do 80%, ostatni odcinek jest już najłatwiejszy', en: 'The automaton finishes on its own — since it reached 80% without a stumble, the last stretch is the easiest' } },
          { id: 'b', text: { pl: 'Maszyna niesie ciężką, powtarzalną większość; ja przejmuję krytyczne ostatnie 20% i domykam je sam', en: 'The machine carries the heavy, repetitive bulk; I take the critical last 20% and close it out myself' } },
          { id: 'c', text: { pl: 'Robię całą fazę od nowa ręcznie — do wyniku, za który odpowiadam, nie wpuszczam automatu', en: 'I redo the whole phase by hand — I keep the automaton away from a result I answer for' } },
          { id: 'd', text: { pl: 'Dzielę ostatnią fazę na pół z automatem i pracujemy równolegle na tym samym odlewie', en: 'I split the last phase with the automaton and we work the same cast in parallel' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Partia jest odlana. Co robisz, zanim trafi do ładowni?',
          en: 'The batch is cast. What do you do before it ships to the cargo bay?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wysyłam od razu — odlew dopiął się bez błędu, a proces jest sprawdzony', en: 'Ship it at once — the cast completed without error and the process is proven' } },
          { id: 'b', text: { pl: 'Sam oglądam partię wobec specyfikacji — czystość, wagę, formę; przegląd łapie to, co automat przepuścił', en: 'Inspect the batch myself against the spec — purity, weight, form; the review catches what the automaton let through' } },
          { id: 'c', text: { pl: 'Wysyłam próbkę i czekam na kontrolę u odbiorcy, zanim ruszę z resztą', en: 'Ship a sample and wait for the recipient\'s check before releasing the rest' } },
          { id: 'd', text: { pl: 'Ufam meldunkowi automatu, że partia trzyma normę — po to właśnie raportuje wynik po każdej ukończonej fazie', en: 'Trust the automaton\'s report that the batch meets spec — that is exactly what it reports after every completed phase' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_9_DONE] },
  },
];
