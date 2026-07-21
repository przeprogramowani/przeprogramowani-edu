import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-6',
    title: { pl: 'Protokół Ekspedycyjny VI — Mapa drogowa', en: 'Expedition Protocol VI — Roadmap' },
    description: {
      pl: 'Doktryna planowania wyprawy: kiedy CORE AI rozpisuje mapę drogową, każdy kamień milowy musi mieć obserwowalny efekt i warunek, po którym poznasz, że jest osiągnięty. Protokół sprawdza, czy odróżniasz plan od pobożnych życzeń.',
      en: 'The expedition planning doctrine: when CORE AI drafts a roadmap, every milestone must have an observable effect and a condition that tells you it has been reached. This protocol checks that you tell a plan apart from wishful thinking.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'CORE AI rozpisało mapę rozruchu bramy i oznaczyło pierwszy kamień milowy. Po czym poznasz, że naprawdę został osiągnięty?',
          en: 'CORE AI drafted the gate boot roadmap and marked the first milestone. How do you know it has genuinely been reached?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'CORE AI melduje „rozpoczęto rozruch węzła" — praca ruszyła, więc kamień zaliczony', en: 'CORE AI reports "node boot started" — the work has begun, so the milestone counts' } },
          { id: 'b', text: { pl: 'Węzeł osiąga temperaturę roboczą i ją utrzymuje — warunek, który sam odczytasz z przyrządu', en: 'The node reaches working temperature and holds it — a condition you read off the instrument yourself' } },
          { id: 'c', text: { pl: 'Wszystkie zadania etapu odhaczone na tablicy planu — lista domknięta', en: 'Every task in the stage ticked off on the plan board — the list is closed' } },
          { id: 'd', text: { pl: 'CORE AI ocenia, że etap przebiegł zgodnie z planem, i proponuje iść dalej', en: 'CORE AI judges the stage went to plan and suggests moving on' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'CORE AI wskazuje trzy węzły grzewcze bramy naraz — widzi wszystkie, ale nie umie ich uszeregować. Część zależy od siebie. Jak układasz plan rozruchu?',
          en: 'CORE AI points to the gate\'s three heating nodes at once — it sees them all but cannot rank them. Some depend on others. How do you lay out the boot plan?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Odpalam wszystkie trzy węzły równolegle — brama i tak potrzebuje ich wszystkich, więc robię je naraz i skracam rozruch', en: 'Fire all three nodes in parallel — the gate needs them all anyway, so I do them at once and shorten the boot' } },
          { id: 'b', text: { pl: 'Zaczynam od węzła, który znam najlepiej, a resztę dopnę w biegu', en: 'Start with the node I know best and sort the rest out as I go' } },
          { id: 'c', text: { pl: 'Wyprowadzam kolejność z zależności i idę krok po kroku, sprawdzając efekt każdego, zanim ruszę następny', en: 'Derive the order from the dependencies and go step by step, checking each effect before the next' } },
          { id: 'd', text: { pl: 'Rozpisuję plan z każdym możliwym wariantem awaryjnym, zanim cokolwiek uruchomię', en: 'Write out a plan with every possible fallback before I start anything' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Kiedy uznajesz krok planu za skończony — i co robisz, gdy węzeł protestuje poza kolejnością?',
          en: 'When do you call a plan step finished — and what do you do when a node protests out of order?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Krok jest skończony, gdy przechodzę dalej; a protest obchodzę, wymuszając kolejność ręcznie', en: 'A step is finished when I move on; and I get around the protest by forcing the order by hand' } },
          { id: 'b', text: { pl: 'Krok jest skończony, gdy spełnia wcześniej ustalone kryterium; a protest poza kolejnością każe cofnąć się do ostatniego pewnego stanu i znaleźć pominiętą zależność', en: 'A step is finished when it meets a pre-set criterion; and an out-of-order protest means falling back to the last safe state to find the missed dependency' } },
          { id: 'c', text: { pl: 'Krok jest skończony, gdy maszyna zgłasza gotowość; a protest poza kolejnością to zwykle fałszywy alarm z czujnika, który po kilku ponowieniach rozkazu mija sam', en: 'A step is finished when the machine reports ready; and an out-of-order protest is usually a false sensor alarm that clears itself after a few retries of the order' } },
          { id: 'd', text: { pl: 'Krok jest skończony, gdy nie widzę już błędów na ekranie; a protest ignoruję, jeśli reszta i tak działa', en: 'A step is finished when I no longer see errors on screen; and I ignore the protest if the rest works anyway' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_6_DONE] },
  },
];
