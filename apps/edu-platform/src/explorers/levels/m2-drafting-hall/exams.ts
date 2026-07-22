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
          pl: 'Przed obudzeniem jednostki S-0PL CORE AI proponuje: „Zaplanuję wszystko w pamięci roboczej i od razu wykonam." Ty każesz najpierw zapisać plan implementacji do pliku w repozytorium misji (`plan.md`). Po co, skoro agent i tak buduje sobie plan „w głowie"?',
          en: 'Before waking unit S-0PL, CORE AI offers: "I will plan it all in working memory and execute right away." You order the implementation plan written to a file in the mission repository (`plan.md`) first. Why, when the agent builds a plan "in its head" anyway?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Żeby udokumentować pracę na potrzeby raportowania — plan jest przede wszystkim śladem dla przełożonych i klienta', en: 'To document the work for reporting — the plan is above all a trail for managers and the client' } },
          { id: 'b', text: { pl: 'Plan w pliku to punkt kontroli przed edycją kodu — możesz go przejrzeć i skorygować, a po resecie sesji wrócić do niego, bo nie ginie z rozmową', en: 'A plan in a file is a control point before code edits — you can review and correct it, and return to it after a session reset, because it does not vanish with the conversation' } },
          { id: 'c', text: { pl: 'Bo bez pliku planu agent nie jest w stanie poprawnie wykonywać zmian obejmujących wiele plików naraz', en: 'Because without a plan file the agent cannot correctly execute changes spanning many files at once' } },
          { id: 'd', text: { pl: 'Żeby oszczędzać tokeny — raz zapisany plan nie musi być generowany ponownie w kolejnych sesjach', en: 'To save tokens — a plan written once does not have to be generated again in later sessions' } },
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
          { id: 'd', text: { pl: 'Zatrzymuję implementację, jawnie poprawiam plan i dopiero wtedy kontynuuję — zmiana kontraktu nie może dziać się w biegu', en: 'Stop the implementation, amend the plan explicitly, and only then continue — a contract change must not happen on the run' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Nowy rozkaz dla S-0PL jest zatwierdzony i uruchamiasz fazową realizację planu — dokładnie jak `/10x-implement` w projekcie. Jak wygląda prawidłowy cykl pracy agenta-wykonawcy?',
          en: 'The new order for S-0PL is approved and you start phased execution of the plan — exactly like `/10x-implement` on a project. What does the executor agent\'s correct working cycle look like?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wykonuje jedną fazę planu, weryfikuje wynik, zatrzymuje się na ręcznych bramkach, commituje i aktualizuje `## Progress`, zanim ruszy dalej', en: 'It executes one phase of the plan, verifies the result, pauses at manual gates, commits, and updates `## Progress` before moving on' } },
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
