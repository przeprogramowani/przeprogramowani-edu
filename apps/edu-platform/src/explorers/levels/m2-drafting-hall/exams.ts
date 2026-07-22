import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-7',
    title: { pl: 'Protokół Ekspedycyjny VII — Architekt i Wykonawca', en: 'Expedition Protocol VII — Architect and Executor' },
    description: {
      pl: 'Weryfikacja pamięci przy terminalu serwisowym: planowanie oddzielone od wykonania. Protokół sprawdza, czy pamiętasz, po co plan implementacji trafia do pliku w repo, kto go zmienia w trakcie pracy i jak wygląda fazowa realizacja z agentem.',
      en: 'Memory verification at the service terminal: planning kept apart from execution. This protocol checks that you remember why an implementation plan goes into a file in the repo, who changes it mid-work, and how phased execution with an agent runs.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Przed obudzeniem jednostki S-0PL CORE AI kusi skrótem: „Zaplanuję wszystko w pamięci roboczej i od razu wykonam — po co przepisywać to do pliku?". Jak ustawiasz tę pracę?',
          en: 'Before waking unit S-0PL, CORE AI tempts you with a shortcut: "I will plan it all in working memory and execute right away — why copy it into a file?". How do you set the work up?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przyjmujesz propozycję — plan w pamięci roboczej wystarczy, skoro zaraz i tak powstanie kod', en: 'Accept the offer — a plan in working memory is enough, since the code is about to be written anyway' } },
          { id: 'b', text: { pl: 'Każesz najpierw zapisać plan do pliku w repozytorium i przeglądasz go, zanim powstanie kod', en: 'Order the plan written to a file in the repository first, and review it before any code is written' } },
          { id: 'c', text: { pl: 'Każesz spisać plan po skończonej implementacji, jako dokumentację tego, co faktycznie powstało', en: 'Have the plan written down after the implementation is finished, as documentation of what actually got built' } },
          { id: 'd', text: { pl: 'Prosisz o streszczenie planu w oknie rozmowy i zatwierdzasz je, zanim agent zacznie wykonanie', en: 'Ask for a summary of the plan in the chat window and approve it before the agent starts executing' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'S-0PL w połowie fazy melduje z hali serwisowej: plan zakładał istniejący model danych, którego w repo fabryki w ogóle nie ma. Zmienia się kontrakt planu. Co robisz?',
          en: 'Mid-phase, S-0PL reports from the service bay: the plan assumed an existing data model that is nowhere in the factory\'s repo. The plan\'s contract changes. What do you do?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pozwalam mu się dostosować w locie — agent jest najbliżej kodu, więc rozstrzygnie szczegóły najtrafniej', en: 'Let it adapt on the fly — the agent is closest to the code, so it will settle the details best' } },
          { id: 'b', text: { pl: 'Dorzucam korektę kolejnym promptem bez przerywania fazy — zatrzymanie zmarnowałoby zebrany kontekst', en: 'Tack a correction on with another prompt without stopping the phase — stopping would waste the gathered context' } },
          { id: 'c', text: { pl: 'Kasuję plan i wracam do roadmapy — skoro jedno założenie było błędne, cały plan jest niewiarygodny', en: 'Scrap the plan and go back to the roadmap — if one assumption was wrong, the whole plan is untrustworthy' } },
          { id: 'd', text: { pl: 'Zatrzymuję pracę, jawnie poprawiam plan i dopiero wtedy kontynuuję — kontrakt nie zmienia się w biegu', en: 'Stop the work, amend the plan explicitly, and only then continue — the contract does not change on the run' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Nowy rozkaz dla S-0PL jest zatwierdzony i uruchamiasz fazową realizację planu. Jak wygląda prawidłowy cykl pracy agenta-wykonawcy?',
          en: 'The new order for S-0PL is approved and you start phased execution of the plan. What does the executor agent\'s correct working cycle look like?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wykonuje jedną fazę, weryfikuje wynik, commituje i odnotowuje postęp w planie, zanim ruszy dalej', en: 'It executes one phase, verifies the result, commits, and records progress in the plan before moving on' } },
          { id: 'b', text: { pl: 'Realizuje cały plan od początku do końca w jednej sesji — po to był plan, żeby nie przerywać pracy', en: 'It runs the whole plan start to finish in one session — that is what the plan was for, so the work is not interrupted' } },
          { id: 'c', text: { pl: 'Generuje kod dla wszystkich faz naraz, a podział na commity zostawia człowiekowi do pogrupowania', en: 'It generates code for all phases at once and leaves splitting into commits for the human to group' } },
          { id: 'd', text: { pl: 'Wybiera z planu fazy, które uzna za najistotniejsze, i pomija te oznaczone jako mniej ważne', en: 'It picks the phases it deems most significant from the plan and skips the ones marked less important' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_7_DONE] },
  },
];
