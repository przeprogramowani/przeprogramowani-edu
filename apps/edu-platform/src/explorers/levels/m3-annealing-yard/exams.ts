import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-14',
    title: { pl: 'Protokół Ekspedycyjny XIV — Samonaprawa', en: 'Expedition Protocol XIV — Self-Repair' },
    description: {
      pl: 'Doktryna utrzymania ruchu: maszynie wolno bez pytania powtórzyć znane lekarstwo na znaną chorobę. Ale każda samonaprawa zostawia bliznę w dzienniku, a blizny czyta człowiek. Trzecie identyczne podejście to już nie leczenie — to pętla.',
      en: 'The maintenance doctrine: a machine may repeat a known cure for a known ailment without asking. But every self-repair leaves a scar in the log, and scars are read by humans. A third identical attempt is no longer treatment — it is a loop.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Znana usterka ma znane, wielokrotnie sprawdzone lekarstwo. Co wolno maszynie?',
          en: 'A known fault has a known, repeatedly proven cure. What is the machine allowed to do?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Naprawić sama i zostawić wpis w dzienniku — znane lekarstwo na znaną chorobę nie wymaga pytania', en: 'Fix it itself and leave a log entry — a known cure for a known ailment needs no asking' } },
          { id: 'b', text: { pl: 'Czekać na człowieka przy każdej usterce, nawet rutynowej — bezpieczniej, gdy decyzję zatwierdza ktoś żywy', en: 'Wait for a human on every fault, even a routine one — safer when someone alive approves the call' } },
          { id: 'c', text: { pl: 'Zastosować naprawę po cichu, bez wpisu — skoro to rutyna, dziennik nie musi jej odnotowywać', en: 'Apply the cure quietly, without an entry — since it is routine, the log need not note it' } },
          { id: 'd', text: { pl: 'Od razu sięgnąć po mocniejszą naprawę niż zwykle — przy okazji ogarnie też sąsiednie usterki', en: 'Reach straight for a stronger cure than usual — it will handle neighbouring faults along the way' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Rutyna samonaprawcza trzeci raz z rzędu zastosowała to samo lekarstwo na ten sam objaw. Co to znaczy?',
          en: 'A self-repair routine has applied the same cure to the same symptom three times in a row. What does that mean?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Że automatyzacja działa zdrowo — niech powtarza, aż w końcu utrzyma efekt', en: 'That the automation is working healthily — let it repeat until the effect finally holds' } },
          { id: 'b', text: { pl: 'Że to pętla, nie leczenie — identyczna powtórka bez skutku znaczy, że lek nie sięga przyczyny', en: 'That it is a loop, not treatment — an identical repeat with no effect means the cure does not reach the cause' } },
          { id: 'c', text: { pl: 'Że trzeba po prostu podnieść limit powtórzeń — przy większej liczbie identycznych prób automatyczna naprawa w końcu się utrwali', en: 'That the retry limit should simply be raised — with more identical attempts the automatic fix will eventually hold' } },
          { id: 'd', text: { pl: 'Że trzy razy to wciąż za mało, by cokolwiek orzekać — dopiero dłuższa seria coś znaczy', en: 'That three times is still too few to conclude anything — only a longer run means something' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Dlaczego każda samonaprawa musi zostawić ślad w dzienniku?',
          en: 'Why must every self-repair leave a mark in the log?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo blizny czyta człowiek — powtarzalne naprawy układają się we wzór niewidoczny w pojedynczej usterce', en: 'Because a human reads the scars — recurring repairs form a pattern invisible in any single fault' } },
          { id: 'b', text: { pl: 'Bo dłuższy dziennik dowodzi, że rutyny samonaprawcze pracują i zarabiają na siebie', en: 'Because a longer log proves the self-repair routines are working and earning their keep' } },
          { id: 'c', text: { pl: 'Nie musi — udana naprawa niczego nie psuje, więc nie ma czego zapisywać', en: 'It need not — a successful repair breaks nothing, so there is nothing to record' } },
          { id: 'd', text: { pl: 'Żeby przy następnej usterce maszyna mogła nadpisać stary wpis i trzymać dziennik możliwie krótkim i czytelnym', en: 'So that on the next fault the machine can overwrite the old entry and keep the log as short and readable as possible' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_14_DONE] },
  },
];
