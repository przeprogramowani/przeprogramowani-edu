/**
 * Rejestr stron 10x Workflow. Kolejnosc tablicy = kolejnosc w pasku nawigacji.
 * Slug "index" (hub/mostek) renderuje sie pod baza (bez segmentu w URL);
 * dokumentacja quick search mieszka pod slugiem "docs".
 */

import type { Lang } from './i18n';

/**
 * Grupy dostepu portalu (2026-07-10, prosba usera):
 * - internal: zespol Przeprogramowani (ADMIN_EMAILS w src/server/admins.ts),
 *   widzi tez strony w przygotowaniu w kontekscie gated;
 * - students-10xdevs-3: uczestnicy kursu (auth przez czlonkostwo 10xdevs-3),
 *   kontekst /10xdevs-3/workflow;
 * - leads-10xdevs-4: ruch publiczny bez logowania, kontekst /10xdevs-4.
 * Wersja strony per grupa = pole access ponizej; strona bez danej grupy
 * nie istnieje w jej kontekscie (404 + brak w nawigacji i palecie).
 */
export type AccessGroup = 'internal' | 'students-10xdevs-3' | 'leads-10xdevs-4';

/**
 * Kategorie paska nawigacji - grupuja strony w rozwijane menu, zeby pasek
 * miescil sie mimo rosnacej liczby stron. Kolejnosc = kolejnosc w nawigacji.
 * "skille" nie ma wpisow w WORKFLOW_PAGES - wypelnia je layout z SKILL_PAGES
 * (gdy strona csc jest dostepna). Kategoria z jednym wpisem renderuje sie jako
 * zwykly link (bez rozwijania).
 */
export type NavCategoryId = 'kurs' | 'moduly' | 'skille' | 'ekosystem' | 'faq';
export const NAV_CATEGORY_ORDER: NavCategoryId[] = ['kurs', 'moduly', 'skille', 'ekosystem', 'faq'];
export const NAV_CATEGORY_LABEL: Record<Lang, Record<NavCategoryId, string>> = {
  pl: { kurs: 'Kurs', moduly: 'Moduły', skille: 'Skille', ekosystem: 'Ekosystem', faq: 'FAQ' },
  en: { kurs: 'Course', moduly: 'Modules', skille: 'Skills', ekosystem: 'Ecosystem', faq: 'FAQ' },
};

/** Pelny dostep - skrot dla stron otwartych wszedzie (stan dzisiejszy). */
const ALL_GROUPS: AccessGroup[] = ['internal', 'students-10xdevs-3', 'leads-10xdevs-4'];

/**
 * Tylko kontekst publiczny (/10xdevs-4). Strony marketingowe dla leadow bez
 * logowania - nie pojawiaja sie w wersji gated (brak wrapperow w
 * src/pages/10xdevs-3/workflow), wiec swiadomie omijaja grupy internal/students.
 */
const PUBLIC_ONLY: AccessGroup[] = ['leads-10xdevs-4'];

export interface WorkflowPage {
  slug: string;
  /** Tytul dokumentu (<title>) - czytany przez wrappery gated i publiczne. */
  title: string;
  navLabel: string;
  moduleLabel: string;
  /** Breadcrumb w hudzie; brak = wpis zewnetrzny (href), bez wlasnej strony. */
  breadcrumb?: string;
  /** Prawa czesc stopki; strona gated "index" nie renderuje stopki po prawej. */
  footerRight?: string;
  /** Strona istnieje tylko w trybie sci-fi; w trybie neutralnym znika z nawigacji. */
  sfOnly?: boolean;
  /** Zewnetrzny adres - wpis jest linkiem poza platforme, nie strona workflow. */
  href?: string;
  /** Teksty wersji angielskiej (misja EN); pageText() sklada widok per jezyk. */
  en?: { title: string; navLabel: string; breadcrumb?: string; footerRight?: string };
  /** Grupy, ktore widza strone; brak grupy = 404 w jej kontekscie. */
  access: AccessGroup[];
  /** Kategoria w pasku nawigacji (rozwijane menu). */
  category: NavCategoryId;
  /**
   * Strona domowa kategorii (indeks + zajawki jej podstron). Rowna kategorii
   * z pola powyzej; obecnosc = ta strona jest "Przegladem" kategorii,
   * renderowanym z CategoryBody. Wpis jest wyciagany z listy zwyklych podstron
   * (nawigacja i mostek traktuja go jako laczke do kategorii, nie jej element).
   */
  categoryHome?: NavCategoryId;
}

export const WORKFLOW_PAGES: WorkflowPage[] = [
  {
    slug: 'index',
    title: '10x Workflow - system pracy z agentem AI z kursu 10xDevs',
    navLabel: 'Mostek',
    moduleLabel: 'HUB',
    breadcrumb: '10X WORKFLOW // MOSTEK // MAPA PORTALU',
    footerRight: 'MOSTEK // 10X WORKFLOW',
    en: {
      title: '10x Workflow - the AI agent workflow behind the 10xDevs course',
      navLabel: 'Bridge',
      breadcrumb: '10X WORKFLOW // BRIDGE // PORTAL MAP',
      footerRight: 'BRIDGE // 10X WORKFLOW',
    },
    category: 'kurs',
    access: ALL_GROUPS,
  },
  {
    slug: 'kurs',
    title: 'Kurs 10xDevs - przegląd: przebieg, certyfikacja i wartości',
    navLabel: 'Przegląd',
    moduleLabel: 'KURS',
    breadcrumb: '10X WORKFLOW // KURS // PRZEGLĄD',
    footerRight: 'KURS // PRZEGLĄD',
    en: {
      title: 'The 10xDevs course - overview: flow, certification and values',
      navLabel: 'Overview',
      breadcrumb: '10X WORKFLOW // COURSE // OVERVIEW',
      footerRight: 'COURSE // OVERVIEW',
    },
    category: 'kurs',
    categoryHome: 'kurs',
    access: ALL_GROUPS,
  },
  {
    slug: 'jak-dziala-kurs',
    title: 'Jak działa kurs 10xDevs - prework, 5 tygodni, certyfikacja',
    navLabel: 'Jak działa kurs',
    moduleLabel: 'KURS',
    breadcrumb: '10X WORKFLOW // JAK DZIAŁA KURS // PRZEBIEG',
    footerRight: 'JAK DZIAŁA KURS // PRZEBIEG',
    category: 'kurs',
    access: PUBLIC_ONLY,
  },
  {
    slug: 'certyfikacja',
    title: 'Certyfikacja 10xDevs - terminy, zasady i bloki Builder/Architect/Champion',
    navLabel: 'Certyfikacja',
    moduleLabel: 'CERT',
    breadcrumb: '10X WORKFLOW // CERTYFIKACJA // TERMINY I ZASADY',
    footerRight: 'CERTYFIKACJA // TERMINY I ZASADY',
    category: 'kurs',
    access: PUBLIC_ONLY,
  },
  {
    slug: 'ekosystem',
    title: 'Ekosystem 10x Workflow - narzędzia, gra, dokumentacja i dziennik',
    navLabel: 'Przegląd',
    moduleLabel: 'ECO',
    breadcrumb: '10X WORKFLOW // EKOSYSTEM // PRZEGLĄD',
    footerRight: 'EKOSYSTEM // PRZEGLĄD',
    en: {
      title: 'The 10x Workflow ecosystem - tools, game, docs and the log',
      navLabel: 'Overview',
      breadcrumb: '10X WORKFLOW // ECOSYSTEM // OVERVIEW',
      footerRight: 'ECOSYSTEM // OVERVIEW',
    },
    category: 'ekosystem',
    categoryHome: 'ekosystem',
    access: ALL_GROUPS,
  },
  {
    slug: '10x-cli',
    title: '10x-cli - terminalowy pomocnik kursu 10xDevs',
    navLabel: '10x-cli',
    moduleLabel: 'CLI',
    breadcrumb: '10X WORKFLOW // 10X-CLI // NARZĘDZIE',
    footerRight: '10X-CLI // NARZĘDZIE',
    category: 'ekosystem',
    access: PUBLIC_ONLY,
  },
  {
    slug: 'space-explorers',
    title: 'Space Explorers - narracyjna gra kursu 10xDevs',
    navLabel: 'Space Explorers',
    moduleLabel: 'GAME',
    breadcrumb: '10X WORKFLOW // SPACE EXPLORERS // GRA',
    footerRight: 'SPACE EXPLORERS // GRA',
    category: 'ekosystem',
    access: PUBLIC_ONLY,
  },
  {
    slug: '10xbench',
    title: '10xBench - benchmark modeli LLM w kodowaniu (Astro, React, Tailwind, Cloudflare)',
    navLabel: '10xBench',
    moduleLabel: 'BENCH',
    breadcrumb: '10X WORKFLOW // 10XBENCH // BENCHMARK',
    footerRight: '10XBENCH // BENCHMARK',
    category: 'ekosystem',
    access: PUBLIC_ONLY,
  },
  {
    slug: 'moduly',
    title: 'Moduły kursu 10xDevs - przegląd pięciu modułów i skalowania',
    navLabel: 'Przegląd',
    moduleLabel: 'MOD',
    breadcrumb: '10X WORKFLOW // MODUŁY // PRZEGLĄD',
    footerRight: 'MODUŁY // PRZEGLĄD',
    en: {
      title: 'The 10xDevs modules - overview of the five modules and scaling',
      navLabel: 'Overview',
      breadcrumb: '10X WORKFLOW // MODULES // OVERVIEW',
      footerRight: 'MODULES // OVERVIEW',
    },
    category: 'moduly',
    categoryHome: 'moduly',
    access: ALL_GROUPS,
  },
  {
    slug: 'skille',
    title: 'Skille Core Skills Chain - przegląd pięciu skilli łańcucha',
    navLabel: 'Przegląd',
    moduleLabel: 'SKILL',
    breadcrumb: '10X WORKFLOW // SKILLE // PRZEGLĄD',
    footerRight: 'SKILLE // PRZEGLĄD',
    en: {
      title: 'Core Skills Chain skills - overview of the five chain skills',
      navLabel: 'Overview',
      breadcrumb: '10X WORKFLOW // SKILLS // OVERVIEW',
      footerRight: 'SKILLS // OVERVIEW',
    },
    category: 'skille',
    categoryHome: 'skille',
    access: ALL_GROUPS,
  },
  {
    slug: 'fundament',
    title: 'Moduł 1: Fundament - kontekst i reguły projektu',
    navLabel: 'Fundament',
    moduleLabel: 'M1',
    breadcrumb: '10X WORKFLOW // MODUŁ 1 // 5 LEKCJI',
    footerRight: 'MODUŁ 1 // FUNDAMENT',
    en: {
      title: 'Module 1: Foundation - project context and rules',
      navLabel: 'Foundation',
      breadcrumb: '10X WORKFLOW // MODULE 1 // 5 LESSONS',
      footerRight: 'MODULE 1 // FOUNDATION',
    },
    category: 'moduly',
    access: ALL_GROUPS,
  },
  {
    slug: 'csc',
    title: 'Core Skills Chain (CSC) - pięć kroków od pomysłu do review',
    navLabel: '10xWorkflow (CSC)',
    moduleLabel: 'M2',
    breadcrumb: '10X WORKFLOW // CORE SKILLS CHAIN // 5 KROKÓW',
    footerRight: '10X WORKFLOW // CORE SKILLS CHAIN',
    en: {
      title: 'Core Skills Chain (CSC) - five steps from idea to review',
      navLabel: '10xWorkflow (CSC)',
      breadcrumb: '10X WORKFLOW // CORE SKILLS CHAIN // 5 STEPS',
      footerRight: '10X WORKFLOW // CORE SKILLS CHAIN',
    },
    category: 'moduly',
    access: ALL_GROUPS,
  },
  {
    slug: 'jakosc',
    title: 'Moduł 3: Jakość - testy, hooki i bramki jakości',
    navLabel: 'Jakość',
    moduleLabel: 'M3',
    breadcrumb: '10X WORKFLOW // MODUŁ 3 // 5 LEKCJI',
    footerRight: 'MODUŁ 3 // JAKOŚĆ',
    en: {
      title: 'Module 3: Quality - tests, hooks and quality gates',
      navLabel: 'Quality',
      breadcrumb: '10X WORKFLOW // MODULE 3 // 5 LESSONS',
      footerRight: 'MODULE 3 // QUALITY',
    },
    category: 'moduly',
    access: ALL_GROUPS,
  },
  {
    slug: 'legacy',
    title: 'Moduł 4: Legacy - praca w zastanym kodzie',
    navLabel: 'Legacy',
    moduleLabel: 'M4',
    breadcrumb: '10X WORKFLOW // MODUŁ 4 // 5 LEKCJI',
    footerRight: 'MODUŁ 4 // LEGACY',
    en: {
      title: 'Module 4: Legacy - working in existing codebases',
      navLabel: 'Legacy',
      breadcrumb: '10X WORKFLOW // MODULE 4 // 5 LESSONS',
      footerRight: 'MODULE 4 // LEGACY',
    },
    category: 'moduly',
    access: ALL_GROUPS,
  },
  {
    slug: 'teamwork',
    title: 'Moduł 5: Teamwork - workflow w zespole',
    navLabel: 'Teamwork',
    moduleLabel: 'M5',
    breadcrumb: '10X WORKFLOW // MODUŁ 5 // 5 LEKCJI',
    footerRight: 'MODUŁ 5 // TEAMWORK',
    en: {
      title: 'Module 5: Teamwork - the workflow in a team',
      navLabel: 'Teamwork',
      breadcrumb: '10X WORKFLOW // MODULE 5 // 5 LESSONS',
      footerRight: 'MODULE 5 // TEAMWORK',
    },
    category: 'moduly',
    access: ALL_GROUPS,
  },
  {
    slug: 'skalowanie',
    title: 'Skalowanie - quality gates, tryb goal i pętle',
    navLabel: 'Skalowanie',
    moduleLabel: 'SCALE',
    breadcrumb: '10X WORKFLOW // SCALE TIER // 3 WĘZŁY',
    footerRight: 'SCALE TIER // SKALOWANIE',
    en: {
      title: 'Scaling - quality gates, goal mode and loops',
      navLabel: 'Scaling',
      breadcrumb: '10X WORKFLOW // SCALE TIER // 3 NODES',
      footerRight: 'SCALE TIER // SCALING',
    },
    category: 'moduly',
    access: ALL_GROUPS,
  },
  {
    slug: 'top5',
    title: '10xTop5 - pięć wartości kursu 10xDevs z dowodami',
    navLabel: '10xTop5',
    moduleLabel: 'TOP5',
    breadcrumb: '10X WORKFLOW // 10XTOP5 // GOLDEN NUGGETS',
    footerRight: '10XTOP5 // GOLDEN NUGGETS',
    en: {
      title: '10xTop5 - five course values with receipts',
      navLabel: '10xTop5',
      breadcrumb: '10X WORKFLOW // 10XTOP5 // GOLDEN NUGGETS',
      footerRight: '10XTOP5 // GOLDEN NUGGETS',
    },
    category: 'kurs',
    access: ALL_GROUPS,
  },
  {
    slug: 'docs',
    title: 'Dokumentacja - quick search po modułach i skillach',
    navLabel: 'Quick search',
    moduleLabel: 'DOCS',
    breadcrumb: '10X WORKFLOW // DOKUMENTACJA // QUICK SEARCH',
    footerRight: 'DOKUMENTACJA // QUICK SEARCH',
    en: {
      title: 'Documentation - quick search across modules and skills',
      navLabel: 'Quick search',
      breadcrumb: '10X WORKFLOW // DOCUMENTATION // QUICK SEARCH',
      footerRight: 'DOCUMENTATION // QUICK SEARCH',
    },
    category: 'ekosystem',
    access: ALL_GROUPS,
  },
  {
    slug: 'kanon',
    title: 'Motyw sci-fi - dziesięć uniwersów portalu',
    navLabel: 'Motyw SF',
    moduleLabel: 'SF',
    breadcrumb: '10X WORKFLOW // MOTYW SF // 10 UNIWERSÓW',
    footerRight: 'MOTYW // SCI-FI',
    sfOnly: true,
    en: {
      title: 'The sci-fi theme - ten universes of this portal',
      navLabel: 'SF theme',
      breadcrumb: '10X WORKFLOW // SF THEME // 10 UNIVERSES',
      footerRight: 'THEME // SCI-FI',
    },
    category: 'ekosystem',
    access: ALL_GROUPS,
  },
  {
    slug: 'log',
    title: 'Dziennik pokładowy - jak powstał ten portal w 24 godziny',
    navLabel: 'Dziennik',
    moduleLabel: 'LOG',
    breadcrumb: '10X WORKFLOW // DZIENNIK POKŁADOWY // BACKSTORY',
    footerRight: 'DZIENNIK // BACKSTORY',
    en: {
      title: 'Captain\'s log - how this portal was built in 24 hours',
      navLabel: 'Log',
      breadcrumb: '10X WORKFLOW // CAPTAIN\'S LOG // BACKSTORY',
      footerRight: 'LOG // BACKSTORY',
    },
    category: 'ekosystem',
    access: ALL_GROUPS,
  },
  {
    slug: 'faq',
    title: 'FAQ - najczęstsze pytania o kurs 10xDevs',
    navLabel: 'FAQ',
    moduleLabel: 'FAQ',
    breadcrumb: '10X WORKFLOW // FAQ // NAJCZĘSTSZE PYTANIA',
    footerRight: 'FAQ // NAJCZĘSTSZE PYTANIA',
    category: 'faq',
    access: PUBLIC_ONLY,
  },
];

/** Strony widoczne dla przynajmniej jednej z podanych grup (nawigacja per widz). */
export function pagesForGroups(groups: AccessGroup[]): WorkflowPage[] {
  return WORKFLOW_PAGES.filter((p) => p.access.some((g) => groups.includes(g)));
}

/**
 * Podstrony nalezace do kategorii (dla stron domowych kategorii i mostka).
 * Wyklucza sama strone domowa i mostek (index) - to nie sa "elementy" kategorii,
 * tylko odpowiednio jej przegald i nadrzedny hub. Kolejnosc = kolejnosc rejestru.
 * Kategoria 'skille' nie ma wpisow w rejestrze (wypelnia ja SKILL_PAGES) - dla niej
 * zwraca pusta liste. Argument `pages` filtruje po kontekscie widza (gated/public).
 */
export function categoryMembers(category: NavCategoryId, pages: WorkflowPage[]): WorkflowPage[] {
  return pages.filter((p) => p.category === category && !p.categoryHome && p.slug !== 'index');
}

/** Strona domowa (Przegald) danej kategorii albo undefined, gdy jej nie ma. */
export function categoryHomePage(category: NavCategoryId, pages: WorkflowPage[]): WorkflowPage | undefined {
  return pages.find((p) => p.categoryHome === category);
}

/**
 * Strony otwarte publicznie (kontekst 10xdevs-4) - pochodna pola access
 * (grupa leads-10xdevs-4). Otwarcie/zamkniecie strony = edycja access
 * we wpisie rejestru, nie tej listy.
 */
export const PUBLIC_PAGES: string[] = pagesForGroups(['leads-10xdevs-4']).map((p) => p.slug);

/**
 * Strony z gotowa wersja angielska (misja EN, rollout progresywny).
 * Slug na liscie = /10xdevs-4/en/<slug> odpowiada 200 i strona pokazuje
 * switcher PL/EN; poza lista wersja EN nie istnieje (404), a linki
 * z jezyka EN do tej strony prowadza na wersje polska.
 */
export const EN_PAGES: string[] = [
  'index',
  'kurs',
  'moduly',
  'skille',
  'ekosystem',
  'fundament',
  'csc',
  'jakosc',
  'legacy',
  'teamwork',
  'skalowanie',
  'top5',
  'kanon',
  'log',
  // strony skilli (dziedzicza dostepnosc EN po csc); docs dojdzie w etapie 3
  'skill/10x-new',
  'skill/10x-research',
  'skill/10x-plan',
  'skill/10x-implement',
  'skill/10x-impl-review',
  'skill/10x-archive',
];

/**
 * Adres strony wzgledem bazy; "index" mieszka pod sama baza.
 * Dla lang='en' prefiksuje /en tylko stronom z EN_PAGES - link do strony
 * bez wersji angielskiej swiadomie spada na polska (bez 404 w srodku misji).
 */
export function pageHref(base: string, slug: string, lang: Lang = 'pl'): string {
  const b = lang === 'en' && EN_PAGES.includes(slug) ? `${base}/en` : base;
  return slug === 'index' ? b : `${b}/${slug}`;
}

/** Widok wpisu rejestru w danym jezyku (teksty EN nadpisuja polskie). */
export function pageText(p: WorkflowPage, lang: Lang): WorkflowPage {
  return lang === 'en' && p.en ? { ...p, ...p.en } : p;
}

/** Wpis rejestru dla sluga - dla wrapperow stron, ktore znaja swoj slug statycznie. */
export function workflowPage(slug: string): WorkflowPage {
  const page = WORKFLOW_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Brak strony "${slug}" w WORKFLOW_PAGES`);
  return page;
}
