import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-agent-architecture',
    title: { pl: 'Przechwycony test VOID: Architektura z agentami', en: 'Captured VOID Test: Architecture with Agents' },
    description: {
      pl: 'Test sprawdza projektowanie architektury dla pracy wieloagentowej: podział ról, kontrakty interfejsów i egzekwowanie granic mandatów.',
      en: 'This test checks designing architecture for multi-agent work: role division, interface contracts, and enforcing mandate boundaries.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Duża funkcja ma być realizowana równolegle przez kilka agentów. Co powinno powstać, zanim którykolwiek zacznie implementować?', en: 'A large feature is to be built in parallel by several agents. What should exist before any of them starts implementing?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Podział na role z jawnymi granicami odpowiedzialności i kontraktami interfejsów między obszarami pracy agentów', en: 'A role split with explicit responsibility boundaries and interface contracts between the agents\' areas of work' } },
          { id: 'b', text: { pl: 'Wspólny dostęp wszystkich agentów do całego repozytorium, żeby nikt nie był blokowany', en: 'Shared access for all agents to the whole repository, so no one is ever blocked' } },
          { id: 'c', text: { pl: 'Szczegółowy pseudokod każdej funkcji przygotowany z góry przez architekta', en: 'Detailed pseudocode for every function, prepared upfront by the architect' } },
          { id: 'd', text: { pl: 'Nic — konflikty scala się na końcu, a architektura wyłoni się z kodu', en: 'Nothing — conflicts get merged at the end, and the architecture emerges from the code' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: { pl: 'Agent odpowiedzialny za moduł raportów stwierdza, że najszybciej będzie „przy okazji" zmienić schemat danych należący do modułu magazynu. Jak powinna zadziałać architektura?', en: 'The agent responsible for the reports module decides the fastest path is to change the data schema owned by the warehouse module "while it is at it". How should the architecture respond?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pozwolić na zmianę — szybkość dostarczania jest ważniejsza niż formalne granice', en: 'Allow the change — delivery speed matters more than formal boundaries' } },
          { id: 'b', text: { pl: 'Pozwolić, o ile agent zostawi komentarz w kodzie z opisem zmiany', en: 'Allow it, as long as the agent leaves a code comment describing the change' } },
          { id: 'c', text: { pl: 'Zmiana wykracza poza mandat agenta: wraca jako propozycja zmiany kontraktu interfejsu, decydowana na poziomie architektury', en: 'The change exceeds the agent\'s mandate: it goes back as an interface-contract change proposal, decided at the architecture level' } },
          { id: 'd', text: { pl: 'Przenieść oba moduły do jednego agenta, żeby granica przestała istnieć', en: 'Move both modules under one agent, so the boundary stops existing' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: { pl: 'Co powinien zawierać aneks architektury dołączany do planu, aby agenci mogli pracować niezależnie?', en: 'What should the architecture annex attached to a plan contain, so agents can work independently?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Kompletny kod wszystkich modułów, żeby agenci mogli go tylko przepisać', en: 'The complete code of all modules, so the agents only have to transcribe it' } },
          { id: 'b', text: { pl: 'Wyłącznie listę technologii — resztę każdy agent ustala sam w trakcie', en: 'Only a list of technologies — each agent figures out the rest as it goes' } },
          { id: 'c', text: { pl: 'Harmonogram spotkań synchronizacyjnych między agentami', en: 'A schedule of synchronisation meetings between the agents' } },
          { id: 'd', text: { pl: 'Komponenty z przypisaną odpowiedzialnością, kontrakty interfejsów między nimi oraz granice i ograniczenia, których wykonawcom nie wolno przekroczyć', en: 'Components with assigned responsibility, interface contracts between them, and the boundaries and constraints executors must not cross' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M2_EXAM_AGENT_ARCHITECTURE_DONE] },
  },
];
