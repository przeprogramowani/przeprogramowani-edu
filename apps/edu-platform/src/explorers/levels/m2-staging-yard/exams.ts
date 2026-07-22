import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-8',
    title: { pl: 'Protokół Ekspedycyjny VIII — Żywy Plan', en: 'Expedition Protocol VIII — Living Plan' },
    description: {
      pl: 'Weryfikacja pamięci przy podstacji dyspozytorskiej: zapis rozjechany z rzeczywistością myli bardziej niż jego brak. Protokół sprawdza, czy pamiętasz, skąd biorą się halucynacje API, po co robi się research przed planem i jak rozpoznać context drift.',
      en: 'Memory verification at the dispatch substation: a record out of step with reality misleads more than none. This protocol checks that you remember where API hallucinations come from, why research precedes a plan, and how to recognise context drift.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Przy podstacji dyspozytorskiej pytasz CORE AI o API biblioteki, której chcesz użyć w nowym slice\'ie. Odpowiada płynnie, z przykładami kodu. Na czym polega ryzyko?',
          en: 'At the dispatch substation you ask CORE AI about the API of a library you want to use in a new slice. It answers fluently, with code examples. What is the risk?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Model może nie znać tej biblioteki wcale — wtedy odmówi odpowiedzi i zablokuje dalsze planowanie', en: 'The model may not know the library at all — then it will refuse to answer and block further planning' } },
          { id: 'b', text: { pl: 'Przykłady z pamięci modelu bywają przestarzałe stylistycznie — kod zadziała, tylko będzie nieelegancki', en: 'Examples from the model\'s memory can be stylistically dated — the code will work, it will just be inelegant' } },
          { id: 'c', text: { pl: 'Ryzyko jest małe przy popularnych bibliotekach — ich API są dobrze reprezentowane w danych treningowych', en: 'The risk is small with popular libraries — their APIs are well represented in the training data' } },
          { id: 'd', text: { pl: 'Model odpowiada z pamięci treningowej sprzed daty odcięcia — potrafi podać przekonujący kod z funkcjami, które nie istnieją albo zmieniły się kilka wersji temu', en: 'The model answers from training memory frozen at its cutoff — it can give convincing code with functions that do not exist or changed several versions ago' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Sopel czyta na głos manifesty wagoników, a ciebie czeka slice wymagający decyzji kontraktowych: wybór biblioteki i kształt modelu danych. Jak przygotowujesz kontekst przed `/10x-plan`?',
          en: 'Sopel reads the tram manifests aloud while a slice awaits you that needs contract decisions: a library choice and a data model shape. How do you prepare context before `/10x-plan`?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wystarczy dobrze napisany prompt — agent w trakcie planowania sam doczyta z sieci to, czego mu brakuje', en: 'A well-written prompt is enough — during planning the agent will read up online on whatever it lacks' } },
          { id: 'b', text: { pl: 'Najpierw research: zewnętrzny (kandydaci i aktualna dokumentacja) i wewnętrzny (stan projektu) — plan dostaje sprawdzalne źródła zamiast założeń', en: 'Research first: external (candidates and current documentation) and internal (project state) — the plan gets verifiable sources instead of assumptions' } },
          { id: 'c', text: { pl: 'Zamykam wszystkie niewiadome z roadmapy, zanim zacznę planować — plan wolno pisać dopiero bez otwartych pytań', en: 'Close every unknown on the roadmap before planning starts — a plan may be written only once no questions stay open' } },
          { id: 'd', text: { pl: 'Zostawiam wybór agentowi — biblioteka to szczegół implementacyjny, który wyjdzie w praniu podczas kolejnych faz', en: 'Leave the choice to the agent — the library is an implementation detail that will come out in the wash across the phases' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Prowadzisz z CORE AI jedną długą sesję od wejścia do rozjazdowni. W końcu agent przekręca nazwy plików, powtarza te same poprawki i „pamięta" decyzje, których nie podjęliście. Co robisz?',
          en: 'You have run one long session with CORE AI since entering the switching yard. Eventually the agent garbles file names, repeats the same fixes, and "remembers" decisions you never made. What do you do?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Dokładam do rozmowy więcej kontekstu o wcześniejszych decyzjach — luki w pamięci trzeba uzupełnić na bieżąco', en: 'Feed the conversation more context about earlier decisions — memory gaps need topping up as you go' } },
          { id: 'b', text: { pl: 'Przełączam się na mocniejszy model w tej samej sesji — takie objawy wskazują na zbyt słaby silnik', en: 'Switch to a stronger model in the same session — symptoms like these point to too weak an engine' } },
          { id: 'c', text: { pl: 'Otwieram świeżą sesję i wczytuję `plan.md` z ostatnim stanem `## Progress` — jakość spada wraz z długością kontekstu, a stan pracy żyje w plikach', en: 'Open a fresh session and load `plan.md` with the latest `## Progress` state — quality drops as context grows, and the state of the work lives in files' } },
          { id: 'd', text: { pl: 'Kontynuuję i poprawiam błędy na bieżąco — chwilowe potknięcia miną, gdy agent złapie rytm zadania', en: 'Carry on and correct errors as they come — momentary stumbles will pass once the agent finds the task\'s rhythm' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_8_DONE] },
  },
];
