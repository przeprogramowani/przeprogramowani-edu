import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm4-exam-protocol-18',
    title: { pl: 'Protokół Ekspedycyjny XVIII — Archeologia', en: 'Expedition Protocol XVIII — Archaeology' },
    description: {
      pl: 'Doktryna głębokiego wejścia: mapę projektu bierzesz jako hipotezę do pogłębienia, nie jako prawdę objawioną. Pokazuje szerokość i strukturę, nie zachowanie; jest zdjęciem w czasie. Pogłębiasz ją rygorem dowód / wnioskowanie / niewiadoma, a strukturalne twierdzenia weryfikujesz narzędziem.',
      en: 'The deep-focus doctrine: you take the project map as a hypothesis to deepen, not as revealed truth. It shows breadth and structure, not behavior; it is a snapshot in time. You deepen it under the rigor evidence / inference / unknown, and you verify structural claims with a tool.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Echo podaje ci Mapę projektu sali katalogowej, a CORE AI zleca agentowi pogłębić jeden przepływ danych. Mapa ma sekcje Strefy ryzyka, Pierwszy dzień i Ograniczenia. Jak agent powinien potraktować to, co w niej stoi?',
          en: 'Echo hands you the catalogue hall’s Project Map, and CORE AI tasks the agent with deepening one data flow. The map has sections Risk zones, First day, and Constraints. How should the agent treat what it says?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Jako gotowy opis przepływu — mapa mówi, jak feature działa, więc można od razu wdrażać zmianę', en: 'As a finished description of the flow — the map says how the feature works, so you can implement a change right away' } },
          { id: 'b', text: { pl: 'Jako prawdę do rozbudowy — skoro przeszła przez zespół, jej fakty są pewne i buduje się na nich', en: 'As truth to build upon — since it passed through the team, its facts are certain and you extend them' } },
          { id: 'c', text: { pl: 'Jako hipotezę, nie prawdę — mapa daje szerokość i strukturę, więc pogłębiasz przepływ, znacząc dowód, wnioskowanie i niewiadome', en: 'As a prior, not truth — the map gives breadth and structure, so you deepen the flow, marking evidence, inference, and unknowns' } },
          { id: 'd', text: { pl: 'Jako punkt startu do „przeanalizuj ten moduł" — agent sam wybierze pliki, które akurat zobaczy', en: 'As a starting point for “analyze this module” — the agent will pick whatever files it happens to see' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Śledząc nić indeksu, agent raportuje: „zero wywołań Save() poza modułem katalogu", licząc przez ast-grep po AST. Wynik brzmi twardo. Zanim CORE AI oprze na nim decyzję, co należy zrobić?',
          en: 'Tracing the index thread, the agent reports: “zero Save() call-sites outside the catalogue module”, counting via ast-grep over the AST. The number sounds hard. Before CORE AI acts on it, what should be done?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Nic — ast-grep zastępuje grep, więc jego wynik jest ostateczny i dokładniejszy niż tekstowy', en: 'Nothing — ast-grep replaces grep, so its result is final and more precise than a textual one' } },
          { id: 'b', text: { pl: 'Potwierdzić to zero zwykłym grep — zły wzorzec strukturalny daje mylące zero, a grep widzi też to, co ast-grep pomija', en: 'Confirm that zero with plain grep — a bad structural pattern yields a misleading zero, and grep sees what ast-grep skips' } },
          { id: 'c', text: { pl: 'Zaufać liczbie tym bardziej, im pewniej wygląda — parser AST nie myli się co do składni', en: 'Trust the number the more confident it looks — an AST parser does not err on syntax' } },
          { id: 'd', text: { pl: 'Przeszukać całość zwykłym grep „Save(" i przyjąć jego wynik jako komplet wywołań', en: 'Search everything with plain grep “Save(” and take its result as the complete set of call-sites' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Współzmiany pokazują, że dwa pliki karuzeli zawsze zmieniają się razem, a diff między nimi jest duży i straszny. Agent chce od razu wpisać je do długu technicznego. Co robisz z tym sygnałem?',
          en: 'Co-changes show that two carousel files always change together, and the diff between them is large and scary. The agent wants to file them straight into technical debt. What do you do with that signal?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Duża współzmiana zawsze znaczy realne sprzężenie — wpisujesz do długu i planujesz refaktor', en: 'A large co-change always means real coupling — you file it as debt and plan a refactor' } },
          { id: 'b', text: { pl: 'Skoro zmieniają się razem, trzeba je scalić w jeden plik i sprzężenie zniknie', en: 'Since they change together, merge them into one file and the coupling disappears' } },
          { id: 'c', text: { pl: 'Statyczny graf zależności z mapy już dowodzi biznesowego sprzężenia — nie trzeba dalej patrzeć', en: 'The static dependency graph from the map already proves the business coupling — no need to look further' } },
          { id: 'd', text: { pl: 'Rozdzielasz sprzężenie tanie od realnego długu — część współzmian jest mechaniczna, generowana, łapana przez CI', en: 'You separate cheap coupling from real debt — some co-change is mechanical, generated, caught by CI' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M4_EXAM_PROTOCOL_18_DONE] },
  },
];
