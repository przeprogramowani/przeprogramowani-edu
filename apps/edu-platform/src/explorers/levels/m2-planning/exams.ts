import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-protocol-6',
    title: { pl: 'Protokół Ekspedycyjny VI — Mapa drogowa', en: 'Expedition Protocol VI — Roadmap' },
    description: {
      pl: 'Weryfikacja pamięci przy konsoli wartowni: zanim fabryka ruszy, mapa drogowa. Protokół sprawdza, czy pamiętasz, jak kroić pracę nad projektem na pionowe slice\'y, czym jest north star i kiedy fundament ma prawo wejść do roadmapy.',
      en: 'Memory verification at the gatehouse console: before the factory moves, a roadmap. This protocol checks that you remember how to cut project work into vertical slices, what a north star is, and when a foundation earns a place on the roadmap.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Holo-tablica przy bramie zamarzła w pół sprintu. Układasz z CORE AI nową roadmapę rozruchu fabryki — jak roadmapę MVP, opartą o vertical slices. Co wyróżnia taki slice jako jednostkę pracy?',
          en: 'The holo-board by the gate froze mid-sprint. With CORE AI you lay out a new factory boot roadmap — like an MVP roadmap, built on vertical slices. What defines such a slice as a unit of work?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Kompletna warstwa aplikacji dopięta do końca — np. cała baza danych albo wszystkie endpointy API', en: 'A complete application layer finished end to end — e.g. the whole database or all the API endpoints' } },
          { id: 'b', text: { pl: 'Zadanie na tyle małe, że agent wykona je w jednej sesji, bez osobnego planu implementacji', en: 'A task small enough for the agent to complete in one session, without a separate implementation plan' } },
          { id: 'c', text: { pl: 'Jeden przepływ użytkownika przez wszystkie warstwy aplikacji, zakończony efektem, który da się zweryfikować', en: 'One user flow through all application layers, ending in a result that can be verified' } },
          { id: 'd', text: { pl: 'Funkcjonalność o najwyższym priorytecie biznesowym w PRD, niezależnie od zależności technicznych', en: 'The feature with the highest business priority in the PRD, regardless of technical dependencies' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Węzły grzewcze bramy to czysta infrastruktura — same z siebie nie dają żadnego widocznego efektu. CORE AI pyta, czy wpisać je do roadmapy. Kiedy taka praca techniczna bez widocznego efektu dla użytkownika (foundation) ma prawo wejść do roadmapy?',
          en: 'The gate\'s heating nodes are pure infrastructure — on their own they show no visible result. CORE AI asks whether to put them on the roadmap. When does technical work like this, with no user-visible outcome (a foundation), earn a place on the roadmap?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Gdy odblokowuje konkretny, wskazany vertical slice — fundament bez wskazania, co odblokowuje, trafia na parking', en: 'When it unlocks a specific, named vertical slice — a foundation that names nothing it unlocks goes to the parking lot' } },
          { id: 'b', text: { pl: 'Gdy dotyczy infrastruktury krytycznej — baza, auth i deploy zawsze idą w całości przed pierwszym slice\'em', en: 'When it concerns critical infrastructure — database, auth, and deploy always go in full before the first slice' } },
          { id: 'c', text: { pl: 'Gdy zostają wolne moce przerobowe — fundamenty najlepiej nadrabiać w przerwach między slice\'ami', en: 'When there is spare capacity — foundations are best caught up on in the gaps between slices' } },
          { id: 'd', text: { pl: 'Nigdy — w podejściu vertical-first każda pozycja roadmapy musi kończyć się czymś widocznym dla użytkownika', en: 'Never — in a vertical-first approach every roadmap item must end in something the user can see' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'CORE AI chce oznaczyć w roadmapie rozruchu jeden milestone jako north star — i czeka przy konsoli wartowni na twoją definicję. Czym jest north star w roadmapie projektu i gdzie ląduje w sekwencji pracy?',
          en: 'CORE AI wants to mark one milestone of the boot roadmap as the north star — and waits at the gatehouse console for your definition. What is the north star on a project roadmap, and where does it land in the work sequence?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pierwszym slice\'em w kolejce — skoro udowadnia tezę produktu, zawsze od niego zaczynasz', en: 'The first slice in the queue — since it proves the product thesis, you always start with it' } },
          { id: 'b', text: { pl: 'Docelową wizją produktu po wszystkich milestone\'ach — punktem, do którego roadmapa zmierza na końcu', en: 'The target product vision after all milestones — the point the roadmap arrives at in the end' } },
          { id: 'c', text: { pl: 'Najbardziej ryzykownym technicznie zadaniem, atakowanym najpierw, żeby zredukować niepewność', en: 'The technically riskiest task, attacked first to reduce uncertainty' } },
          { id: 'd', text: { pl: 'Najmniejszym działającym przepływem domykającym tezę produktu — planowanym tak wcześnie, jak pozwalają zależności, niekoniecznie jako pierwszy', en: 'The smallest working flow that closes the product thesis — scheduled as early as dependencies allow, not necessarily first' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M2_EXAM_PROTOCOL_6_DONE] },
  },
];
