import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-5',
    title: { pl: 'Protokół Ekspedycyjny V — Łańcuch', en: 'Expedition Protocol V — The Chain' },
    description: {
      pl: 'Doktryna przekaźnika: droga z localhosta na produkcję to łańcuch świadomych decyzji — wybór platformy, plan i wdrożenie. Protokół sprawdza, czy umiesz go przejść z agentem.',
      en: 'The relay doctrine: the road from localhost to production is a chain of deliberate decisions — platform choice, plan, and deployment. This protocol checks whether you can walk it with an agent.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Tablica sensorów na grani jest gotowa — pierwsze produkcyjne wdrożenie misji. Zanim CORE AI dotknie konfiguracji, przełączasz je w Plan Mode. Na czym polega ten tryb?',
          en: 'The sensor array on the ridge is ready — the mission\'s first production deployment. Before CORE AI touches the configuration, you switch it into Plan Mode. What does this mode do?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Agent wykonuje zadanie wolniej, ale dokładniej — każdy krok sprawdza dwukrotnie przed przejściem dalej', en: 'The agent performs the task more slowly but more carefully — double-checking each step before moving on' } },
          { id: 'b', text: { pl: 'Harness przełącza się na osobny model wyspecjalizowany w planowaniu zamiast modelu kodującego', en: 'The harness switches to a separate model specialized in planning instead of the coding model' } },
          { id: 'c', text: { pl: 'Agent działa read-only: czyta repo i dopytuje o decyzje, a plik czy komendę zmieni dopiero po twoim zatwierdzeniu planu', en: 'The agent works read-only: it reads the repo and asks about decisions, and will only change a file or run a command after you approve the plan' } },
          { id: 'd', text: { pl: 'Harness automatycznie zapisuje historię sesji do pliku, żeby dało się później odtworzyć działania agenta', en: 'The harness automatically saves the session history to a file, so the agent\'s actions can be replayed later' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Dr Kern słucha z orbity, jak robisz z CORE AI research platformy hostingowej dla telemetrii misji — a ty od początku skłaniasz się ku jednej opcji. Jak zneutralizować sycophancy — skłonność modelu do potwierdzania twoich preferencji?',
          en: 'Dr Kern listens from orbit as you research a hosting platform for the mission\'s telemetry with CORE AI — and you have leaned toward one option from the start. How do you counter sycophancy — the model\'s tendency to confirm your preferences?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Odwrócić pytanie: zamiast „czy X pasuje do mojego stacku?” każ modelowi wykazać, dlaczego X to zły wybór — devil\'s advocate i pre-mortem', en: 'Invert the question: instead of "does X fit my stack?", make the model argue why X is a bad choice — devil\'s advocate and pre-mortem' } },
          { id: 'b', text: { pl: 'Zadać to samo pytanie kilka razy w nowych sesjach — powtarzająca się odpowiedź oznacza, że jest obiektywna', en: 'Ask the same question several times in fresh sessions — a repeated answer means it is objective' } },
          { id: 'c', text: { pl: 'Obniżyć temperaturę modelu, żeby odpowiadał na podstawie faktów, a nie opinii', en: 'Lower the model\'s temperature so it answers from facts rather than opinions' } },
          { id: 'd', text: { pl: 'Nie zdradzać modelowi żadnych wymagań projektu — bez kontekstu scoring będzie w pełni neutralny', en: 'Withhold all project requirements from the model — without context the scoring will be fully neutral' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Tablica działa, a wynik researchu i decyzja o platformie trafiają do context/foundation/infrastructure.md w repozytorium ekspedycji. Moreau pyta: po co utrzymywać ten plik, skoro wdrożenie już za wami?',
          en: 'The array is live, and the research result and the platform decision land in context/foundation/infrastructure.md in the expedition repo. Moreau asks: why maintain this file now that the deployment is behind you?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'To plik konfiguracyjny wdrożenia — platforma odczytuje z niego ustawienia przy każdym deployu', en: 'It is the deployment configuration file — the platform reads its settings from it on every deploy' } },
          { id: 'b', text: { pl: 'Wymaga go /10x-bootstrapper — bez niego nie da się postawić szkieletu projektu', en: 'It is required by /10x-bootstrapper — without it the project skeleton cannot be scaffolded' } },
          { id: 'c', text: { pl: 'Służy do automatycznego generowania dokumentacji dla użytkowników końcowych aplikacji', en: 'It is used to automatically generate documentation for the application\'s end users' } },
          { id: 'd', text: { pl: 'To zapis decyzji z uzasadnieniem i ryzykami — w stylu ADR: wsad do Plan Mode i punkt odniesienia, gdy trzeba będzie decyzję świadomie zrewidować', en: 'It is a record of the decision with rationale and risks — ADR-style: input for Plan Mode and the reference point when the decision must be consciously revisited' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_5_DONE] },
  },
];
