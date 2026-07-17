import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm0-exam-agent-systems',
    title: { pl: 'Systemy agentowe', en: 'Agentic Systems' },
    description: { pl: 'Protokół pobudki sprawdza, czy odzyskujesz wiedzę o systemach AI.', en: 'The wake-up protocol checks whether you are recovering knowledge of AI systems.' },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Co najtrafniej odróżnia agenta kodującego od zwykłego chatbota?', en: 'What best distinguishes a coding agent from an ordinary chatbot?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Agent zwykle ma większe okno kontekstu niż chatbot', en: 'An agent typically has a larger context window than a chatbot' } },
          { id: 'b', text: { pl: 'Agent realizuje zadanie w pętli: analizuje kod, wprowadza zmiany, uruchamia narzędzia i poprawia wynik', en: 'An agent completes tasks in a loop: it analyses code, makes changes, runs tools, and refines the result' } },
          { id: 'c', text: { pl: 'Agent lepiej radzi sobie z pisaniem długich odpowiedzi technicznych', en: 'An agent is better at writing long technical responses' } },
          { id: 'd', text: { pl: 'Agent częściej korzysta z dokumentacji niż z wiedzy wbudowanej w model', en: 'An agent relies more on documentation than on knowledge built into the model' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: { pl: 'Jaki wspólny fundament łączy wszystkie narzędzia agentowe — Claude Code, Codex, Cursor czy OpenCode?', en: 'What common foundation connects all agentic tools — Claude Code, Codex, Cursor, and OpenCode?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Każde z nich wymaga dostępu do chmury i nie działa lokalnie', en: 'Each requires cloud access and cannot run locally' } },
          { id: 'b', text: { pl: 'Wszystkie opierają się na tym samym modelu językowym', en: 'All are built on the same language model' } },
          { id: 'c', text: { pl: 'Model językowy + dostęp do narzędzi + pętla iteracyjnego działania', en: 'Language model + access to tools + iterative action loop' } },
          { id: 'd', text: { pl: 'Wspólny format pliku konfiguracyjnego i ten sam zestaw pluginów', en: 'A shared configuration file format and the same plugin set' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: { pl: 'Dlaczego jakość pętli agentowej jest ważniejsza niż precyzja pojedynczego promptu?', en: 'Why is the quality of the agentic loop more important than the precision of a single prompt?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo pętla pozwala agentowi korzystać z większej liczby modeli jednocześnie', en: 'Because the loop allows the agent to use more models simultaneously' } },
          { id: 'b', text: { pl: 'Bo agent w pętli sam weryfikuje i naprawia swój wynik, zamiast polegać na jednorazowej odpowiedzi', en: 'Because an agent in a loop verifies and corrects its own output instead of relying on a one-shot response' } },
          { id: 'c', text: { pl: 'Bo pętla eliminuje potrzebę uruchamiania testów po zmianach', en: 'Because the loop eliminates the need to run tests after changes' } },
          { id: 'd', text: { pl: 'Bo w pętli agent automatycznie aktualizuje dokumentację projektu', en: 'Because in a loop the agent automatically updates project documentation' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 30, flags: [FLAGS.M0_EXAM_AGENT_SYSTEMS_DONE] },
  },
  {
    id: 'm0-exam-operational-procedures',
    title: { pl: 'Procedury operacyjne', en: 'Operational Procedures' },
    description: { pl: 'Sprawdź, czy pamiętasz właściwą kolejność działań podczas pracy z AI.', en: 'Check whether you remember the correct sequence of steps when working with AI.' },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Dlaczego w pracy z agentem nie warto pomijać fazy eksploracji problemu?', en: 'Why should you not skip the problem exploration phase when working with an agent?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo eksploracja służy głównie do znalezienia dokumentacji zewnętrznych bibliotek', en: 'Because exploration is mainly for finding documentation of external libraries' } },
          { id: 'b', text: { pl: 'Bo eksploracja zastępuje plan implementacji i pozwala od razu przejść do testów', en: 'Because exploration replaces the implementation plan and allows moving directly to tests' } },
          { id: 'c', text: { pl: 'Bo eksploracja zmniejsza liczbę tokenów zużywanych przez model w każdej odpowiedzi', en: 'Because exploration reduces the number of tokens the model uses per response' } },
          { id: 'd', text: { pl: 'Bo bez eksploracji agent może wdrożyć rozwiązanie niepasujące do istniejącej architektury i konwencji projektu', en: 'Because without exploration the agent may implement a solution that does not fit the existing architecture and project conventions' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: { pl: 'Jaka jest prawidłowa kolejność faz w zalecanym przepływie pracy z agentem?', en: 'What is the correct phase order in the recommended workflow with an agent?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Plan → Implement → Explore → Verify', en: 'Plan → Implement → Explore → Verify' } },
          { id: 'b', text: { pl: 'Implement → Verify → Explore → Plan', en: 'Implement → Verify → Explore → Plan' } },
          { id: 'c', text: { pl: 'Explore → Plan → Implement → Verify', en: 'Explore → Plan → Implement → Verify' } },
          { id: 'd', text: { pl: 'Explore → Implement → Plan → Verify', en: 'Explore → Implement → Plan → Verify' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: { pl: 'Dlaczego warto oddzielać fazę planowania od implementacji?', en: 'Why should you separate the planning phase from implementation?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo plan automatycznie generuje testy jednostkowe dla agenta', en: 'Because the plan automatically generates unit tests for the agent' } },
          { id: 'b', text: { pl: 'Bo plan można przejrzeć i skorygować zanim agent zacznie pisać kod', en: 'Because the plan can be reviewed and corrected before the agent starts writing code' } },
          { id: 'c', text: { pl: 'Bo bez planu agent nie ma dostępu do narzędzi systemowych', en: 'Because without a plan the agent cannot access system tools' } },
          { id: 'd', text: { pl: 'Bo faza planowania zmniejsza rozmiar okna kontekstu', en: 'Because the planning phase reduces the context window size' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 30, flags: [FLAGS.M0_EXAM_OPERATIONAL_PROCEDURES_DONE] },
  },
  {
    id: 'm0-exam-context-engineering',
    title: { pl: 'Context Engineering', en: 'Context Engineering' },
    description: { pl: 'Przekonaj się, czy odzyskujesz pamięć o strukturze informacji dla systemów AI.', en: 'See whether you are recovering your knowledge of information structure for AI systems.' },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Co najlepiej opisuje context engineering?', en: 'What best describes context engineering?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pisanie jednego bardzo dopracowanego promptu na początku sesji', en: 'Writing one highly refined prompt at the start of a session' } },
          { id: 'b', text: { pl: 'Zwiększanie długości rozmowy, żeby model miał jak najwięcej historii', en: 'Extending the conversation so the model has as much history as possible' } },
          { id: 'c', text: { pl: 'Dobieranie agentowi tylko tych informacji, które są najbardziej potrzebne na danym etapie pracy', en: 'Providing the agent only with the information most relevant to the current stage of work' } },
          { id: 'd', text: { pl: 'Zapisywanie trwałych zasad pracy w pliku AGENTS.md lub CLAUDE.md', en: 'Recording permanent working rules in an AGENTS.md or CLAUDE.md file' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: { pl: 'Co wchodzi w skład kontekstu, którym zarządza programista pracujący z agentem?', en: 'What makes up the context managed by a developer working with an agent?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wyłącznie treść ostatniego promptu wysłanego do modelu', en: 'Only the content of the last prompt sent to the model' } },
          { id: 'b', text: { pl: 'Instrukcje systemowe, historia pracy, wyniki narzędzi, dokumentacja projektu i pamięć sesji', en: 'System instructions, work history, tool results, project documentation, and session memory' } },
          { id: 'c', text: { pl: 'Tylko pliki źródłowe otwarte w edytorze w momencie zapytania', en: 'Only the source files open in the editor at the time of the query' } },
          { id: 'd', text: { pl: 'Zestaw benchmarków i metryk wydajności modelu', en: 'A set of benchmarks and model performance metrics' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: { pl: 'Jaka jest główna zasada tworzenia pliku z trwałymi instrukcjami dla agenta?', en: 'What is the main principle for creating a file with permanent instructions for an agent?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Powinien zawierać pełną dokumentację techniczną projektu wraz z tutorialami', en: 'It should contain the full technical documentation of the project, including tutorials' } },
          { id: 'b', text: { pl: 'Im więcej reguł, tym lepiej — agent sam wybierze te istotne', en: 'The more rules the better — the agent will select the relevant ones itself' } },
          { id: 'c', text: { pl: 'Powinien być zwięzły i zawierać tylko to, czego agent nie wywnioskuje z samego kodu', en: 'It should be concise and contain only what the agent cannot infer from the code itself' } },
          { id: 'd', text: { pl: 'Powinien być generowany automatycznie na podstawie historii commitów', en: 'It should be generated automatically from the commit history' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 30, flags: [FLAGS.M0_EXAM_CONTEXT_ENGINEERING_DONE] },
  },
];
