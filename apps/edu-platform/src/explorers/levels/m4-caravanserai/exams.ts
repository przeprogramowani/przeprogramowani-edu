import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm4-exam-protocol-16',
    title: { pl: 'Protokół Ekspedycyjny XVI — Mapa Terenu', en: 'Expedition Protocol XVI — The Terrain Map' },
    description: {
      pl: 'Doktryna ekspedycyjna dużej skali: zanim wpuścisz agenta w ogrom cudzego repozytorium, zbuduj model terenu. Korzeń AGENTS.md ma być spisem treści, który w razie potrzeby wskazuje na katalog context/ — nie encyklopedią. Budżet uwagi jest skończony; strukturę wspinasz na sygnał, nie z góry.',
      en: 'The large-scale expedition doctrine: before you send an agent into the vastness of someone else\'s repository, build a model of the terrain. The root AGENTS.md must be a table of contents that points to a context/ directory when needed — not an encyclopedia. The attention budget is finite; you climb structure on a signal, not up front.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Dexo staje nad zasypanym archiwum Odyssey-A. Kusi go, żeby zrzucić CORE AI cały opis stacji do jednego pliku AGENTS.md i od razu ruszyć w wykop. Jak najlepiej przygotować kontekst agenta na tę skalę?',
          en: 'Dexo stands over the buried Odyssey-A archive. He is tempted to dump the whole station description into a single AGENTS.md and start digging at once. How is the agent\'s context best prepared at this scale?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Utrzymać jeden AGENTS.md i dopisywać do niego kolejne instrukcje, skoro sprawdził się w mniejszym projekcie', en: 'Keep a single AGENTS.md and keep appending instructions to it, since it worked in a smaller project' } },
          { id: 'b', text: { pl: 'Trzymać lekki korzeń AGENTS.md jako spis treści, który w razie potrzeby wskazuje na katalog context/', en: 'Keep a lean root AGENTS.md as a table of contents that points to a context/ directory when needed' } },
          { id: 'c', text: { pl: 'Wykorzystać okno miliona tokenów i wczytać cały opis naraz — większy budżet uwagi to mniejsze ryzyko', en: 'Use the million-token window and load the whole description at once — a bigger attention budget means less risk' } },
          { id: 'd', text: { pl: 'Założyć plik context/ w każdym folderze archiwum z góry, na wszelki wypadek', en: 'Create a context/ file in every archive folder up front, just in case' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Kartowanie rusza od jednego, korzeniowego pliku. CORE AI proponuje od razu rozbić kontekst na osobny plik dla każdego modułu stacji. Kiedy naprawdę warto wspiąć się na wyższy szczebel struktury?',
          en: 'Mapping starts from a single, root file. CORE AI proposes splitting the context into a separate file for each station module right away. When is it actually worth climbing to a higher rung of structure?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Dopiero na obserwowalny sygnał — korzeń pęcznieje i staje się nieczytelny albo agent wciąż gubi kontekst danego modułu', en: 'Only on an observable signal — the root swells and becomes unreadable, or the agent keeps losing a module\'s context' } },
          { id: 'b', text: { pl: 'Gdy tylko w archiwum pojawia się drugi moduł — lepiej rozdzielić od początku', en: 'As soon as a second module appears in the archive — better to split from the start' } },
          { id: 'c', text: { pl: 'Po przekroczeniu ustalonej docelowej liczby linii w pliku instrukcji', en: 'Once the file passes a fixed target line count for instruction files' } },
          { id: 'd', text: { pl: 'Zawsze na starcie, żeby uniknąć późniejszej migracji kontekstu', en: 'Always at the start, to avoid a later context migration' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Przy dzieleniu kontekstu archiwum na moduły kusi prosty klucz: tyle plików, ile folderów pod ręką. Czym naprawdę kierować się przy podziale?',
          en: 'When splitting the archive context into modules, a simple rule tempts: one file per folder on hand. What should the split actually be guided by?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Proporcjonalnie do liczby folderów w repozytorium — jeden plik kontekstu na katalog', en: 'In proportion to the number of folders in the repository — one context file per directory' } },
          { id: 'b', text: { pl: 'Im więcej plików context/, tym lepsza nawigacja agenta, więc twórz je hojnie', en: 'The more context/ files, the better the agent navigates, so create them generously' } },
          { id: 'c', text: { pl: 'Granicą własności, złożonością i realną potrzebą — projekt na skalę MVP zostaje na najniższym szczeblu jak najdłużej', en: 'By ownership boundary, complexity, and real need — an MVP-scale project stays on the lowest rung as long as possible' } },
          { id: 'd', text: { pl: 'Najbliższy plik i tak nadpisuje korzeń, więc dubluj w nim najważniejsze instrukcje', en: 'The nearest file overrides the root anyway, so duplicate the key instructions in it' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M4_EXAM_PROTOCOL_16_DONE] },
  },
];
