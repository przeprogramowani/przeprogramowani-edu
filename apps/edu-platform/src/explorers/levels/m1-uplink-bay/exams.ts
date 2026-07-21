import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-authorization-boundary',
    title: { pl: 'Przechwycony test VOID: Deployment i autoryzacja', en: 'Captured VOID Test: Deployment and Authorization' },
    description: {
      pl: 'Test sprawdza research infrastruktury bez confirmation bias, dobór CLI lub MCP oraz ludzką autoryzację operacji produkcyjnych.',
      en: 'This test checks infrastructure research without confirmation bias, choosing CLI or MCP, and human authorisation of production operations.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Przed researchem hostingu dla panelu łączności ze stacją zespół skłania się ku jednej platformie. Jak uniknąć sytuacji, w której agent tylko potwierdzi ten wybór?', en: 'Before researching hosting for a station-communications dashboard, the team already favours one platform. How do you avoid the agent merely confirming that choice?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Poprosić agenta o zebranie jak największej liczby zalet preferowanej platformy, a potem sprawdzić źródła', en: 'Ask the agent to collect as many advantages of the preferred platform as possible, then verify the sources' } },
          { id: 'b', text: { pl: 'Pozwolić agentowi wybrać platformę z najwyższym wynikiem i potraktować scoring jako decyzję', en: 'Let the agent choose the highest-scoring platform and treat the score as the decision' } },
          { id: 'c', text: { pl: 'Zastosować devil\'s advocate, pre-mortem i pytania o pominięte kategorie, zaktualizować porównanie, a decyzję pozostawić człowiekowi', en: 'Use devil\'s advocate, a pre-mortem, and questions about omitted categories, update the comparison, and leave the decision to the human' } },
          { id: 'd', text: { pl: 'Ukryć preferencję przed agentem i zaakceptować pierwszą rekomendację, aby nie wpływać na wynik', en: 'Hide the preference from the agent and accept the first recommendation to avoid influencing the result' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: { pl: 'Znasz dokładną komendę sprawdzającą status deploymentu panelu łączności w lokalnym terminalu. Agent chmurowy nie ma powłoki i powinien sam odkrywać dostępne operacje. Które przyporządkowanie jest trafne?', en: 'You know the exact command for checking the communications-dashboard deployment status in a local terminal. A cloud agent has no shell and must discover available operations. Which mapping is accurate?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'CLI pasuje do znanej komendy i dostępnej powłoki; MCP do odkrywania opisanych narzędzi w sesji zdalnej. Oba nadal wymagają osobnej polityki uprawnień', en: 'CLI fits a known command and available shell; MCP fits discovering described tools in a remote session. Both still require a separate permissions policy' } },
          { id: 'b', text: { pl: 'MCP służy do znanych komend lokalnych, a CLI do automatycznego odkrywania operacji zdalnych', en: 'MCP is for known local commands, while CLI is for automatically discovering remote operations' } },
          { id: 'c', text: { pl: 'CLI z definicji jest tylko do odczytu, a każde narzędzie MCP może wykonywać zmiany produkcyjne', en: 'CLI is read-only by definition, while every MCP tool may perform production changes' } },
          { id: 'd', text: { pl: 'CLI i MCP są wymienne; wybór nie wpływa na discovery, kontekst ani sposób nadawania uprawnień', en: 'CLI and MCP are interchangeable; the choice does not affect discovery, context, or permission design' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: { pl: 'Agent przygotował deployment panelu łączności ze stacją; preview, testy i health-check przeszły. Polityka projektu wymaga jawnej zgody człowieka przed publikacją na produkcję. Co dalej?', en: 'The agent prepared a deployment of the station-communications dashboard; preview, tests, and the health check passed. Project policy requires explicit human approval before publishing to production. What happens next?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wdrożyć automatycznie, ponieważ zielone quality gates zastępują ręczną decyzję', en: 'Deploy automatically, because green quality gates replace the manual decision' } },
          { id: 'b', text: { pl: 'Wdrożyć od razu, ale zachować log i plan wyjaśnienia decyzji po fakcie', en: 'Deploy immediately, but retain a log and a plan to explain the decision afterwards' } },
          { id: 'c', text: { pl: 'Przekazać akceptację drugiemu agentowi, ponieważ niezależna recenzja jest równoważna zgodzie człowieka', en: 'Delegate approval to a second agent, because independent review is equivalent to human consent' } },
          { id: 'd', text: { pl: 'Zatrzymać się, pokazać człowiekowi plan zmian i wyniki kontroli, uzyskać jawną zgodę, wdrożyć tokenem o minimalnym zakresie i zweryfikować wynik', en: 'Stop, show the human the change plan and check results, obtain explicit approval, deploy with a least-scoped token, and verify the result' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M1_EXAM_AUTHORIZATION_BOUNDARY_DONE] },
  },
];
