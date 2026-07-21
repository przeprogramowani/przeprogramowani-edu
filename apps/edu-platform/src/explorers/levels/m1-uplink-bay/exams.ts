import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-5',
    title: { pl: 'Protokół Ekspedycyjny V — Łańcuch', en: 'Expedition Protocol V — The Chain' },
    description: {
      pl: 'Doktryna przekaźnika: od odczytu polowego do systemu statku — uzgodnienie i weryfikacja na każdym ogniwie, pętla sprzężenia, która wyłapuje zły odczyt, zanim stanie się złą decyzją.',
      en: 'The relay doctrine: from a field reading to a ship system — reconciliation and verification at every link, a feedback loop that catches a bad reading before it becomes a bad decision.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Odczyt z tablicy sensorów przechodzi przez kilka systemów — każdy przelicza go po swojemu i podaje dalej — aż na statku przesądzi o decyzji misji. Co jest zgodne z doktryną łańcucha?',
          en: 'A sensor-array reading passes through several systems — each re-processes it its own way and hands it onward — until on the ship it settles a mission decision. What follows the chain doctrine?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Puścić odczyt prosto do decyzji — po drodze i tak nie ma czego sprawdzać', en: 'Send the reading straight to the decision — there is nothing to check along the way anyway' } },
          { id: 'b', text: { pl: 'Na każdym ogniwie uzgodnić i zweryfikować dane, zanim pójdą dalej', en: 'At every link, reconcile and verify the data before it moves on' } },
          { id: 'c', text: { pl: 'Zaufać pierwszemu ogniwu i pominąć kolejne, żeby odczyt dotarł szybciej', en: 'Trust the first link and skip the later ones, so the reading arrives faster' } },
          { id: 'd', text: { pl: 'Zweryfikować dopiero na końcu, kiedy decyzja już zdążyła zapaść', en: 'Verify only at the end, once the decision has already been made' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Klucz kalibracji przysłany z Ziemi ma potwierdzić punkt odniesienia tablicy. Co najlepiej chroni przed błędną kalibracją?',
          en: 'A calibration key sent from Earth is to confirm the array\'s reference point. What best guards against a bad calibration?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przyjąć każdy przysłany klucz bez sprawdzania — skoro przyszedł z Ziemi, to musi być poprawny', en: 'Accept whatever key arrives without checking — since it came from Earth, it must simply be correct' } },
          { id: 'b', text: { pl: 'Zweryfikować klucz według reguł — źródło, zgodność, tolerancja — nim tablica go użyje', en: 'Verify the key against rules — source, match, tolerance — before the array uses it' } },
          { id: 'c', text: { pl: 'Wpiąć klucz od razu, a ewentualny błąd poprawić po uruchomieniu sensorów', en: 'Wire the key in at once, and fix any error after the sensors come online' } },
          { id: 'd', text: { pl: 'Odrzucić klucz z Ziemi i wyliczyć punkt odniesienia lokalnie, na czuja', en: 'Reject the Earth key and work out the reference point locally, by feel' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Podczas uzgodnień pojawia się anomalia, której nikt nie zamawiał — echo na kanale centrali. Kalibracja i tak przejdzie. Jaka reakcja jest właściwa w ramach łańcucha?',
          en: 'During reconciliation an anomaly appears that no one ordered — an echo on the HQ channel. The calibration will pass regardless. What is the right response within the chain?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zignorować echo — skoro nie zmienia wyniku kalibracji, to nie ma się czym w ogóle zajmować', en: 'Ignore the echo — since it does not change the calibration result, there is nothing at all to deal with' } },
          { id: 'b', text: { pl: 'Zalogować anomalię jako fakt, nawet bez wyjaśnienia, żeby łańcuch zachował pełny ślad', en: 'Log the anomaly as fact, even without an explanation, so the chain keeps a full trace' } },
          { id: 'c', text: { pl: 'Usunąć echo z logu, żeby nie zaburzało czystego wyniku kalibracji', en: 'Delete the echo from the log so it does not spoil a clean calibration result' } },
          { id: 'd', text: { pl: 'Wstrzymać całą misję, dopóki echo nie zostanie w pełni wyjaśnione', en: 'Halt the whole mission until the echo is fully explained' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_5_DONE] },
  },
];
