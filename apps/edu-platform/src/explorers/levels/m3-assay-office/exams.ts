import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-15',
    title: { pl: 'Protokół Ekspedycyjny XV — Próba Generalna', en: 'Expedition Protocol XV — The Dress Rehearsal' },
    description: {
      pl: 'Doktryna probiercza: certyfikuj podróż, nie części. Przejdź całą trasę tak, jak przejdzie ją ten, kto nią pójdzie — od włazu do włazu — i zbierz każdy rodzaj świadka, zanim za coś poręczysz.',
      en: 'The assay doctrine: certify the journey, not the parts. Walk the whole route as the one who will travel it — hatch to hatch — and collect every kind of witness before you vouch for anything.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Każde stanowisko z osobna przeszło swoją próbę. Co robisz, zanim poręczysz za całą trasę?',
          en: 'Every station passed its own trial separately. What do you do before you vouch for the whole route?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Poręczam bez dalszych prób — skoro każda część zdała swoją próbę osobno, złożenie wszystkich części musi zdać tak samo', en: 'I vouch with no further trials — if each part passed its trial separately, the assembly of all the parts must pass the same way' } },
          { id: 'b', text: { pl: 'Przechodzę całą trasę od włazu do włazu, jak przejdzie ją podróżnik — części zdają osobno i przepadają razem', en: 'I walk the whole route hatch to hatch as the traveller will — parts pass alone and fail together' } },
          { id: 'c', text: { pl: 'Sprawdzam jeszcze łączenia między stanowiskami, samych stanowisk już nie ruszam', en: 'I re-check the joints between stations, but leave the stations themselves alone' } },
          { id: 'd', text: { pl: 'Liczę, ile stanowisk zdało, i przy komplecie zielonych poręczam za trasę', en: 'I count how many stations passed, and with a full set of greens I vouch for the route' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Zbierasz dowody, zanim za coś poręczysz. Który zestaw świadków bierzesz?',
          en: 'You gather evidence before you vouch for anything. Which set of witnesses do you take?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Jeden dokładny odczyt liczbowy — im precyzyjniejsza miara, tym mniej potrzeba reszty', en: 'A single exact numeric reading — the more precise the measure, the less the rest is needed' } },
          { id: 'b', text: { pl: 'Każdy rodzaj świadka — odczyt, obraz i dziennik — bo każda modalność łapie inną klasę usterek', en: 'Every kind of witness — reading, image, and log — because each modality catches a different class of fault' } },
          { id: 'c', text: { pl: 'Jak najwięcej świadków tej samej klasy — dziesięć niezależnych odczytów jest pewniejsze niż trzy różne rodzaje dowodu', en: 'As many witnesses of the same class as possible — ten independent readings are surer than three different kinds of evidence' } },
          { id: 'd', text: { pl: 'Dziennik i obraz, odczyty pomijam — liczby zawsze da się podrobić', en: 'Log and image; I skip readings — numbers can always be faked' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Maszyna zbadała partię i wystawiła certyfikat z adnotacją „WYMAGA PORĘCZENIA". Co to znaczy?',
          en: 'The machine assayed the batch and issued a certificate marked "REQUIRES VOUCHING". What does that mean?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Że certyfikat jest nieważny, dopóki maszyna nie powtórzy badania drugi raz', en: 'That the certificate is void until the machine repeats the assay a second time' } },
          { id: 'b', text: { pl: 'Że badanie wykonała maszyna, ale odpowiedzialność bierze imiennie człowiek — poręczenie to podpis pod cudzą pracą', en: "That the machine did the assay, but a named human takes responsibility — vouching is a signature under another's work" } },
          { id: 'c', text: { pl: 'Że nad każdą maszyną trzeba postawić drugą maszynę, która niezależnie potwierdzi wynik pierwszej, zanim ktokolwiek to podpisze', en: 'That a second machine must be set over every first one to independently confirm its result before any human signs off on it' } },
          { id: 'd', text: { pl: 'Że adnotacja ostrzega o wadzie partii, którą trzeba usunąć przed wysyłką', en: 'That the note warns of a defect in the batch that must be removed before shipping' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_15_DONE] },
  },
];
