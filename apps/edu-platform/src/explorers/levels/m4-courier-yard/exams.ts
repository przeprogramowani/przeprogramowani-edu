import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm4-exam-protocol-17',
    title: { pl: 'Protokół Ekspedycyjny XVII — Wiedza Przy Drzwiach', en: 'Expedition Protocol XVII — Knowledge at the Door' },
    description: {
      pl: 'Doktryna kurierska: każda komora trzyma własny rejestr przy wejściu, a brama trzyma tylko mapę komór. Nie noś całego archiwum w plecaku — noś mapę i czytaj rejestry na miejscu. Tak samo agent nie czyta całego repozytorium naraz: buduje mapę projektu i dobiera kontekst tam, gdzie akurat pracuje.',
      en: 'The courier doctrine: every chamber keeps its own register at the door, and the gate keeps only the map of chambers. Do not carry the whole archive in your pack — carry the map and read the registers on the spot. In the same way an agent does not read the whole repository at once: it builds a repo map and pulls context where it is actually working.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Echo dostał zlecenie: rozpoznać nieznaną, zasypaną zajezdnię. CORE AI podpowiada skrót: „wjedź w każdy korytarz po kolei i opisz mi całość". Który sposób da lepszą mapę projektu takiego legacy?',
          en: 'Echo is handed a task: survey an unknown, buried courier yard. CORE AI suggests a shortcut: "drive into every corridor in turn and describe the whole thing to me." Which approach yields a better repo map of such a legacy codebase?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wczytać całe repozytorium do kontekstu naraz — przy dużym oknie agent zobaczy architekturę w jednym przebiegu', en: 'Load the whole repository into context at once — with a large window the agent sees the architecture in one pass' } },
          { id: 'b', text: { pl: 'Najpierw szeroki, płytki przegląd tanimi sygnałami (git, zależności), potem pogłębienie jednego obszaru — Wide Scan, potem Deep Focus', en: 'First a wide, shallow pass over cheap signals (git, dependencies), then a deep dive into one area — Wide Scan, then Deep Focus' } },
          { id: 'c', text: { pl: 'Przejść drzewo katalogów od góry do dołu — układ folderów to w praktyce architektura systemu', en: 'Walk the directory tree top to bottom — the folder layout is, in practice, the system architecture' } },
          { id: 'd', text: { pl: 'Posortować moduły po liczbie zmian i wziąć na warsztat najczęściej zmieniany — to najważniejszy fragment', en: 'Sort modules by number of changes and take on the most-changed one — that is the most important part' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Agent zwraca schludne drzewo katalogów zajezdni i render grafu zależności z setką krawędzi. Moreau przez interkom: „ładne. Ale czego mam z tego użyć?" Czego brakuje, żeby to była mapa projektu, a nie obrazek?',
          en: 'The agent returns a tidy directory tree of the yard and a rendered dependency graph with a hundred edges. Moreau, over the intercom: "pretty. But what do I do with it?" What is missing to make it a repo map rather than a picture?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Nic — wyrenderowany graf zależności to już zrozumienie systemu; wystarczy go przeczytać', en: 'Nothing — a rendered dependency graph already is understanding of the system; you just read it' } },
          { id: 'b', text: { pl: 'Więcej krawędzi i węzłów — im gęstszy graf, tym pełniejszy obraz architektury', en: 'More edges and nodes — the denser the graph, the fuller the picture of the architecture' } },
          { id: 'c', text: { pl: 'Zgodność z drzewem katalogów — skoro foldery to architektura, mapa ma je po prostu odwzorować', en: 'Agreement with the directory tree — since folders are the architecture, the map should just mirror them' } },
          { id: 'd', text: { pl: 'Decyzja: które obszary są kluczowe, aktywne i ryzykowne, jawne „nieznane" i od których plików zacząć czytać', en: 'A decision: which areas are key, active, and risky, the explicit unknowns, and which files to read first' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Dexo poznaje układ zajezdni: każda komora ma własny rejestr przy drzwiach, brama trzyma tylko spis komór. Jak przenieść ten wzór na pliki instrukcji (AGENTS.md) dla agenta w rosnącym projekcie?',
          en: 'Dexo recognizes the yard\'s layout: each chamber has its own register at the door, the gate holds only the index of chambers. How do you carry that pattern into instruction files (AGENTS.md) for an agent in a growing project?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Trzymać szczupły root wskazujący just-in-time na kontekst modułu; plik bliżej modułu dokłada się do roota, nie kasuje go', en: 'Keep a lean root that points just-in-time to the module\'s context; the file nearer the module adds to the root, it does not erase it' } },
          { id: 'b', text: { pl: 'Uznać, że plik najbliższy modułu wygrywa i zastępuje instrukcje z roota — liczy się najbardziej szczegółowy', en: 'Treat the file nearest the module as the winner that replaces the root\'s instructions — the most specific one counts' } },
          { id: 'c', text: { pl: 'Zebrać wszystko w jednym pliku w roocie — jedno źródło jest prostsze niż rozproszone rejestry', en: 'Gather everything into a single root file — one source is simpler than scattered registers' } },
          { id: 'd', text: { pl: 'Założyć plik instrukcji w każdym folderze z góry, na wszelki wypadek — wtedy nic nie umknie agentowi', en: 'Create an instruction file in every folder up front, just in case — then nothing escapes the agent' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M4_EXAM_PROTOCOL_17_DONE] },
  },
];
