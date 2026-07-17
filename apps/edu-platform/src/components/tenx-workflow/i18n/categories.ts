/**
 * Slownik stron domowych kategorii (Przegald: kurs, moduly, skille, ekosystem)
 * oraz zajawek mostka. Struktura odzwierciedla CategoryBody.astro i kafle
 * kategorii w HubBody.astro. Kolory i glify (PAGE_META / CATEGORY_META) sa
 * jezykowo neutralne i pochodza z kanonu uniwersow (universes.ts) - zmiana
 * koloru = decyzja kanonu, nie tego pliku. Zmiana tresci = zmiana OBU jezykow.
 */

import type { NavCategoryId } from '../pages';
import { UNIVERSES } from '../universes';
import type { Lang } from './index';

/**
 * Kolor + glif + numer stacji kafla kategorii na mostku (klucz = NavCategoryId).
 * Numer to staly ordynal w kolejnosci NAV_CATEGORY_ORDER (nie zmienia sie, gdy
 * kontekst gated ukrywa FAQ) - czyta sie jak numer stanowiska konsoli.
 */
export const CATEGORY_META: Record<NavCategoryId, { accent: string; glyph: string; num: string }> = {
  kurs: { accent: UNIVERSES.hyperion.color, glyph: UNIVERSES.hyperion.glyph, num: '01' },
  moduly: { accent: UNIVERSES.ender.color, glyph: UNIVERSES.ender.glyph, num: '02' },
  skille: { accent: UNIVERSES.fundacja.color, glyph: UNIVERSES.fundacja.glyph, num: '03' },
  ekosystem: { accent: UNIVERSES.lem.color, glyph: UNIVERSES.lem.glyph, num: '04' },
  faq: { accent: UNIVERSES.starwars.color, glyph: UNIVERSES.starwars.glyph, num: '05' },
};

/**
 * Kolor + glif karty indeksu na stronie kategorii (klucz = slug podstrony).
 * Strony z kanonicznym uniwersum czytaja jego kolor/glif; strony bez uniwersum
 * (kurs-flow, cli, gra) dostaja najblizszy pasujacy motyw. Skille czytaja
 * accent/universeId z SKILL_PAGES, wiec nie ma ich tutaj.
 */
export const PAGE_META: Record<string, { accent: string; glyph: string }> = {
  // kurs
  'jak-dziala-kurs': { accent: UNIVERSES.diuna.color, glyph: UNIVERSES.diuna.glyph },
  certyfikacja: { accent: UNIVERSES.starwars.color, glyph: UNIVERSES.starwars.glyph },
  top5: { accent: UNIVERSES.hyperion.color, glyph: UNIVERSES.hyperion.glyph },
  // moduly
  fundament: { accent: UNIVERSES.ender.color, glyph: UNIVERSES.ender.glyph },
  csc: { accent: UNIVERSES.fundacja.color, glyph: UNIVERSES.fundacja.glyph },
  jakosc: { accent: UNIVERSES.trzycia.color, glyph: UNIVERSES.trzycia.glyph },
  legacy: { accent: UNIVERSES.wh40k.color, glyph: UNIVERSES.wh40k.glyph },
  teamwork: { accent: UNIVERSES.redrising.color, glyph: UNIVERSES.redrising.glyph },
  skalowanie: { accent: UNIVERSES.starwars.color, glyph: UNIVERSES.starwars.glyph },
  // ekosystem
  '10x-cli': { accent: UNIVERSES.expanse.color, glyph: UNIVERSES.expanse.glyph },
  'space-explorers': { accent: UNIVERSES.diuna.color, glyph: UNIVERSES.diuna.glyph },
  docs: { accent: UNIVERSES.lem.color, glyph: UNIVERSES.lem.glyph },
  kanon: { accent: '#7c8cff', glyph: UNIVERSES.lem.glyph },
  log: { accent: UNIVERSES.expanse.color, glyph: UNIVERSES.expanse.glyph },
};

/** Zajawka pojedynczej podstrony (karta indeksu na stronie kategorii). */
interface Teaser {
  num: string;
  h3: string;
  p: string;
}

interface CategoryDict {
  /** Naglowek strony kategorii. */
  eyebrow: string;
  h1: string;
  subHtml: string;
  /** Eyebrow sekcji indeksu podstron. */
  indexEyebrow: string;
  /** Linia "cel" pod indeksem (powrot na mostek). */
  backHtml: string;
  /** Krotka zajawka kafla kategorii na mostku. */
  tileP: string;
  /** Zajawki podstron (klucz = slug podstrony lub slug skilla). */
  teasers: Record<string, Teaser>;
}

export const CATEGORIES: Record<Lang, Record<NavCategoryId, CategoryDict>> = {
  pl: {
    kurs: {
      eyebrow: 'KURS // PRZEGLĄD',
      h1: 'Kurs 10xDevs: przebieg, certyfikat i dowody',
      subHtml:
        'Wszystko o samym kursie <strong>10xDevs</strong>: jak jest zbudowany, jak zdobyć certyfikat i dlaczego warto - pięć wartości z dowodami. Każda karta poniżej to osobna strona.',
      indexEyebrow: 'W tej kategorii',
      backHtml:
        'Szukasz innej sekcji? Wróć na <a href="{mostek}" style="color:var(--acc)">mostek</a> albo użyj wyszukiwarki (Cmd/Ctrl+K).',
      tileP: 'Jak działa kurs, certyfikacja i 10xTop5 - dowody i wartości.',
      teasers: {
        'jak-dziala-kurs': {
          num: 'KURS',
          h3: 'Jak działa kurs',
          p: 'Przebieg kursu: prework, pięć tygodni pracy z agentem i ścieżka do certyfikatu - od czego zacząć.',
        },
        certyfikacja: {
          num: 'CERT',
          h3: 'Certyfikacja',
          p: 'Terminy, zasady i bloki Builder / Architect / Champion - wszystko o projekcie zaliczeniowym.',
        },
        top5: {
          num: 'TOP5',
          h3: '10xTop5',
          p: 'Pięć najmocniejszych wartości kursu z dowodami i głosami uczestników - najlepsze pierwsze czytanie.',
        },
      },
    },
    moduly: {
      eyebrow: 'MODUŁY // PRZEGLĄD',
      h1: 'Pięć modułów kursu i warstwa skalowania',
      subHtml:
        'Kręgosłup kursu: od <strong>fundamentu</strong> i łańcucha <strong>Core Skills Chain</strong>, przez jakość, legacy i pracę w zespole, aż po <strong>skalowanie</strong>, gdy stawka rośnie. Każda karta to osobna strona modułu.',
      indexEyebrow: 'Moduły i warstwy',
      backHtml:
        'Szukasz innej sekcji? Wróć na <a href="{mostek}" style="color:var(--acc)">mostek</a> albo użyj wyszukiwarki (Cmd/Ctrl+K).',
      tileP: 'M1-M5 plus skalowanie - od fundamentu po pracę w zespole.',
      teasers: {
        fundament: {
          num: 'M1',
          h3: 'Fundament',
          p: 'Pięć lekcji startu: kontekst projektu, reguły i pierwsza zmiana z agentem - zacznij tu, jeśli dopiero wsiadasz.',
        },
        csc: {
          num: 'M2',
          h3: 'Core Skills Chain',
          p: 'Serce systemu: pięć kroków new → research → plan → implement → review, każdy z artefaktem na dysku.',
        },
        jakosc: {
          num: 'M3',
          h3: 'Jakość',
          p: 'Testy, hooki i bramki jakości - dla każdego, kto chce ufać kodowi wychodzącemu od agenta.',
        },
        legacy: {
          num: 'M4',
          h3: 'Legacy',
          p: 'Praca w zastanym kodzie: mapa repozytorium, hot spoty, refaktoryzacja i DDD - w istniejących projektach.',
        },
        teamwork: {
          num: 'M5',
          h3: 'Teamwork',
          p: 'Workflow w zespole: wspólne konwencje, review i dystrybucja skilli - gdy chcesz zabrać system do firmy.',
        },
        skalowanie: {
          num: 'SCALE',
          h3: 'Skalowanie',
          p: 'Quality gates, tryb goal i pętle - rygor i autonomia, gdy zmian jest więcej, a stawka rośnie.',
        },
      },
    },
    skille: {
      eyebrow: 'SKILLE // PRZEGLĄD',
      h1: 'Pięć skilli łańcucha Core Skills Chain',
      subHtml:
        'Łańcuch <strong>Core Skills Chain</strong> to pięć skilli, każdy z osobną stroną: co przyjmuje na wejściu, co zostawia na dysku, jak działa i gdzie są jego granice. Kliknij, żeby zobaczyć anatomię skilla.',
      indexEyebrow: 'Skille łańcucha',
      backHtml:
        'Cały łańcuch w jednym miejscu widać na stronie <a href="{csc}" style="color:var(--acc)">Core Skills Chain</a>. Wróć też na <a href="{mostek}" style="color:var(--acc)">mostek</a>.',
      tileP: '/10x-new → research → plan → implement → review.',
      teasers: {
        '10x-new': {
          num: 'SKILL',
          h3: '/10x-new',
          p: 'Nowa jednostka pracy: pierwszy krok łańcucha zakłada folder zmiany i porządkuje kontekst.',
        },
        '10x-research': {
          num: 'SKILL',
          h3: '/10x-research',
          p: 'Dowody z repozytorium przed decyzjami - research zamiast zgadywania, jak działa dany fragment.',
        },
        '10x-plan': {
          num: 'SKILL',
          h3: '/10x-plan',
          p: 'Decyzje przed kodem: plan z pytaniami i wariantami, zanim ruszy implementacja.',
        },
        '10x-implement': {
          num: 'SKILL',
          h3: '/10x-implement',
          p: 'Realizacja etap po etapie, z weryfikacją każdego kroku planu zamiast jednego wielkiego skoku.',
        },
        '10x-impl-review': {
          num: 'SKILL',
          h3: '/10x-impl-review',
          p: 'Plan kontra kod: review sprawdza zgodność implementacji z planem, zanim zmiana pójdzie dalej.',
        },
      },
    },
    ekosystem: {
      eyebrow: 'EKOSYSTEM // PRZEGLĄD',
      h1: 'Narzędzia i konteksty wokół systemu',
      subHtml:
        'Wszystko poza modułami: terminalowy <strong>10x-cli</strong>, narracyjna gra <strong>Space Explorers</strong>, przeszukiwalna dokumentacja, motyw sci-fi portalu i dziennik pokładowy - jak to powstało.',
      indexEyebrow: 'Narzędzia i konteksty',
      backHtml:
        'Szukasz innej sekcji? Wróć na <a href="{mostek}" style="color:var(--acc)">mostek</a> albo użyj wyszukiwarki (Cmd/Ctrl+K).',
      tileP: '10x-cli, Space Explorers, dokumentacja, motyw SF i dziennik.',
      teasers: {
        '10x-cli': {
          num: 'CLI',
          h3: '10x-cli',
          p: 'Terminalowy pomocnik kursu: pobiera zasoby lekcji i skille prosto do Twojego projektu.',
        },
        'space-explorers': {
          num: 'GAME',
          h3: 'Space Explorers',
          p: 'Narracyjna gra kursu - fabularne wprowadzenie do świata 10x Workflow.',
        },
        docs: {
          num: 'DOCS',
          h3: 'Dokumentacja',
          p: 'Przeszukiwalny indeks całego portalu: moduły, lekcje, kroki i skille - wpisz frazę, lista filtruje się od razu.',
        },
        kanon: {
          num: 'SF',
          h3: 'Motyw sci-fi',
          p: 'Dziesięć uniwersów, z których pożyczamy kolory i metafory - dla ciekawych, skąd ten klimat.',
        },
        log: {
          num: 'LOG',
          h3: 'Dziennik pokładowy',
          p: 'Jak powstał ten portal: 24 godziny, przełamanie po tygodniach nieudanych podejść - historia od kuchni.',
        },
      },
    },
    faq: {
      eyebrow: 'FAQ',
      h1: 'Najczęstsze pytania o kurs',
      subHtml: 'Najczęstsze pytania o kurs 10xDevs - płatności, program i logistyka.',
      indexEyebrow: 'FAQ',
      backHtml: '',
      tileP: 'Płatności, program i logistyka - najczęstsze pytania.',
      teasers: {},
    },
  },
  en: {
    kurs: {
      eyebrow: 'COURSE // OVERVIEW',
      h1: 'The 10xDevs course: flow, certificate and receipts',
      subHtml:
        'Everything about the <strong>10xDevs</strong> course itself: how it is built, how to earn the certificate and why it is worth it - five values with receipts. Each card below is its own page.',
      indexEyebrow: 'In this category',
      backHtml:
        'Looking for another section? Head back to the <a href="{mostek}" style="color:var(--acc)">bridge</a> or use search (Cmd/Ctrl+K).',
      tileP: 'How the course works, certification and 10xTop5 - values and receipts.',
      teasers: {
        'jak-dziala-kurs': {
          num: 'COURSE',
          h3: 'How the course works',
          p: 'The course flow: prework, five weeks of working with an agent and the path to a certificate - where to start.',
        },
        certyfikacja: {
          num: 'CERT',
          h3: 'Certification',
          p: 'Dates, rules and the Builder / Architect / Champion blocks - everything about the capstone project.',
        },
        top5: {
          num: 'TOP5',
          h3: '10xTop5',
          p: 'The five strongest course values with evidence and participant voices - the best first read.',
        },
      },
    },
    moduly: {
      eyebrow: 'MODULES // OVERVIEW',
      h1: 'Five course modules and the scaling layer',
      subHtml:
        'The backbone of the course: from the <strong>foundation</strong> and the <strong>Core Skills Chain</strong>, through quality, legacy and teamwork, up to <strong>scaling</strong> when the stakes rise. Each card is its own module page.',
      indexEyebrow: 'Modules and layers',
      backHtml:
        'Looking for another section? Head back to the <a href="{mostek}" style="color:var(--acc)">bridge</a> or use search (Cmd/Ctrl+K).',
      tileP: 'M1-M5 plus scaling - from the foundation to teamwork.',
      teasers: {
        fundament: {
          num: 'M1',
          h3: 'Foundation',
          p: 'Five starter lessons: project context, rules and your first change with an agent - start here if you are just coming aboard.',
        },
        csc: {
          num: 'M2',
          h3: 'Core Skills Chain',
          p: 'The heart of the system: five steps new → research → plan → implement → review, each with an artifact on disk.',
        },
        jakosc: {
          num: 'M3',
          h3: 'Quality',
          p: 'Tests, hooks and quality gates - for anyone who wants to trust the code coming out of an agent.',
        },
        legacy: {
          num: 'M4',
          h3: 'Legacy',
          p: 'Working in inherited code: a repository map, hot spots, refactoring and DDD - for existing projects.',
        },
        teamwork: {
          num: 'M5',
          h3: 'Teamwork',
          p: 'A team workflow: shared conventions, reviews and skill distribution - to bring the system to your company.',
        },
        skalowanie: {
          num: 'SCALE',
          h3: 'Scaling',
          p: 'Quality gates, goal mode and loops - rigor and autonomy when there are more changes and the stakes rise.',
        },
      },
    },
    skille: {
      eyebrow: 'SKILLS // OVERVIEW',
      h1: 'The five Core Skills Chain skills',
      subHtml:
        'The <strong>Core Skills Chain</strong> is five skills, each with its own page: what it takes as input, what it leaves on disk, how it works and where its boundaries are. Click to see a skill anatomy.',
      indexEyebrow: 'Chain skills',
      backHtml:
        'The whole chain in one place lives on the <a href="{csc}" style="color:var(--acc)">Core Skills Chain</a> page. You can also return to the <a href="{mostek}" style="color:var(--acc)">bridge</a>.',
      tileP: '/10x-new → research → plan → implement → review.',
      teasers: {
        '10x-new': {
          num: 'SKILL',
          h3: '/10x-new',
          p: 'A new unit of work: the first chain step sets up the change folder and frames the context.',
        },
        '10x-research': {
          num: 'SKILL',
          h3: '/10x-research',
          p: 'Evidence from the repository before decisions - research instead of guessing how a fragment works.',
        },
        '10x-plan': {
          num: 'SKILL',
          h3: '/10x-plan',
          p: 'Decisions before code: a plan with questions and options before implementation starts.',
        },
        '10x-implement': {
          num: 'SKILL',
          h3: '/10x-implement',
          p: 'Stage-by-stage delivery, verifying each step of the plan instead of one giant leap.',
        },
        '10x-impl-review': {
          num: 'SKILL',
          h3: '/10x-impl-review',
          p: 'Plan versus code: the review checks the implementation against the plan before the change moves on.',
        },
      },
    },
    ekosystem: {
      eyebrow: 'ECOSYSTEM // OVERVIEW',
      h1: 'Tools and contexts around the system',
      subHtml:
        'Everything beyond the modules: the terminal <strong>10x-cli</strong>, the narrative <strong>Space Explorers</strong> game, searchable documentation, the portal sci-fi theme and the captain\'s log - how it was built.',
      indexEyebrow: 'Tools and contexts',
      backHtml:
        'Looking for another section? Head back to the <a href="{mostek}" style="color:var(--acc)">bridge</a> or use search (Cmd/Ctrl+K).',
      tileP: '10x-cli, Space Explorers, docs, the sci-fi theme and the log.',
      teasers: {
        '10x-cli': {
          num: 'CLI',
          h3: '10x-cli',
          p: 'The terminal course helper: it pulls lesson resources and skills straight into your project.',
        },
        'space-explorers': {
          num: 'GAME',
          h3: 'Space Explorers',
          p: 'The narrative course game - a story-driven introduction to the world of 10x Workflow.',
        },
        docs: {
          num: 'DOCS',
          h3: 'Documentation',
          p: 'A searchable index of the whole portal: modules, lessons, steps and skills - type a phrase and the list filters instantly.',
        },
        kanon: {
          num: 'SF',
          h3: 'The sci-fi theme',
          p: 'Ten universes we borrow colors and metaphors from - for anyone curious where the vibe comes from.',
        },
        log: {
          num: 'LOG',
          h3: "Captain's log",
          p: 'How this portal was built: 24 hours and a breakthrough after weeks of failed attempts - the behind-the-scenes story.',
        },
      },
    },
    faq: {
      eyebrow: 'FAQ',
      h1: 'Frequently asked questions',
      subHtml: 'The most common questions about the 10xDevs course - payments, program and logistics.',
      indexEyebrow: 'FAQ',
      backHtml: '',
      tileP: 'Payments, program and logistics - the most common questions.',
      teasers: {},
    },
  },
};
