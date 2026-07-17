/**
 * i18n portalu 10x Workflow. Architektura (decyzja usera 2026-07-10):
 * jeden body per strona, teksty w slownikach per jezyk - markup, SVG
 * i wizualizacje wspolne. Slownik strony mieszka w i18n/<slug>.ts jako
 * Record<Lang, ...>; body dostaje prop lang i czyta t = DICT[lang].
 * Ten plik: typ Lang + slownik UI wspolnego layoutu (TenxCosmicLayout).
 * Konwencje EN: en-US, ton techniczny; nazwy wlasne bez tlumaczenia
 * (Core Skills Chain, 10x Workflow, skille /10x-*), tytuly ksiazek SF
 * w oryginalach; zero em dash (tylko "-").
 */

export type Lang = 'pl' | 'en';

export const LANGS: readonly Lang[] = ['pl', 'en'] as const;

/** Dane oferty przekazywane do szablonu bannera przedsprzedazy. */
interface PromoData {
  deadline: string;
  deadlineEn: string;
  price: string;
  regular: string;
}

interface LayoutUi {
  navAria: string;
  brandAria: string;
  /** Etykieta laczki do strony domowej kategorii (pierwszy wpis rozwijanego menu). */
  navOverview: string;
  modeGroupAria: string;
  modeKey: string;
  modeNeutral: string;
  ddKey: string;
  searchBtn: string;
  langGroupAria: string;
  langKey: string;
  promoAria: string;
  promoK: string;
  promoT: (p: PromoData) => string;
  promoCta: string;
  nlAria: string;
  nlK: string;
  nlT: string;
  nlCta: string;
  tocAria: string;
  tocKSf: string;
  tocKNeutral: string;
  tocTop: string;
  cmdkDialogAria: string;
  cmdkPlaceholder: string;
  cmdkInputAria: string;
  cmdkCloseAria: string;
  cmdkListAria: string;
  cmdkEmpty: string;
  /** Badge grupy stron w palecie (STRONA/PAGE); SKILL i DOCS wspolne. */
  paletteGroupPage: string;
}

export const LAYOUT_UI: Record<Lang, LayoutUi> = {
  pl: {
    navAria: 'Strony 10x Workflow',
    brandAria: '10x Workflow - mostek',
    navOverview: 'Przegląd',
    modeGroupAria: 'Tryb narracji',
    modeKey: 'TRYB:',
    modeNeutral: 'NEUTRALNY',
    ddKey: 'DEEP DIVE:',
    searchBtn: 'SZUKAJ',
    langGroupAria: 'Język strony',
    langKey: 'JĘZYK:',
    promoAria: 'Przedsprzedaż 10xDevs 4.0',
    promoK: 'PRZEDSPRZEDAŻ // 10XDEVS 4.0',
    promoT: (p) =>
      `Zapisy w najniższej cenie do <b>${p.deadline}</b>: <b>${p.price}</b> zamiast ${p.regular}. Pełny program AI-Native Software Engineering.`,
    promoCta: 'DOŁĄCZ NA 10XDEVS.PL →',
    nlAria: 'Przeprogramowany Newsletter',
    nlK: 'PRZEPROGRAMOWANY NEWSLETTER // CO PIĄTEK',
    nlT: '<b>3 materiały techniczne, 2 rozwojowe i 1 bonus</b> - w bonusie czasami wylosuje się sci-fi. Za darmo, w każdy piątek.',
    nlCta: 'ZAPISZ SIĘ →',
    tocAria: 'Spis treści strony',
    tocKSf: 'KONSOLA // SEKCJE',
    tocKNeutral: 'NA TEJ STRONIE',
    tocTop: '↑ Początek',
    cmdkDialogAria: 'Szukaj',
    cmdkPlaceholder: 'Szukaj: strony, skille, koncepty...',
    cmdkInputAria: 'Szukaj',
    cmdkCloseAria: 'Zamknij wyszukiwanie',
    cmdkListAria: 'Wyniki wyszukiwania',
    cmdkEmpty: 'BRAK WYNIKÓW // ZMIEŃ FRAZĘ',
    paletteGroupPage: 'STRONA',
  },
  en: {
    navAria: '10x Workflow pages',
    brandAria: '10x Workflow - bridge',
    navOverview: 'Overview',
    modeGroupAria: 'Narrative mode',
    modeKey: 'MODE:',
    modeNeutral: 'NEUTRAL',
    ddKey: 'DEEP DIVE:',
    searchBtn: 'SEARCH',
    langGroupAria: 'Page language',
    langKey: 'LANG:',
    promoAria: '10xDevs 4.0 presale',
    promoK: 'PRESALE // 10XDEVS 4.0',
    promoT: (p) =>
      `Enroll at the lowest price until <b>${p.deadlineEn}</b>: <b>${p.price}</b> instead of ${p.regular}. The full AI-Native Software Engineering program.`,
    promoCta: 'JOIN AT 10XDEVS.PL →',
    nlAria: 'Przeprogramowany Newsletter',
    nlK: 'PRZEPROGRAMOWANY NEWSLETTER // EVERY FRIDAY',
    nlT: '<b>3 technical picks, 2 on growth and 1 bonus</b> - sometimes the bonus rolls sci-fi. Free, every Friday.',
    nlCta: 'SUBSCRIBE →',
    tocAria: 'Table of contents',
    tocKSf: 'CONSOLE // SECTIONS',
    tocKNeutral: 'ON THIS PAGE',
    tocTop: '↑ Top',
    cmdkDialogAria: 'Search',
    cmdkPlaceholder: 'Search: pages, skills, concepts...',
    cmdkInputAria: 'Search',
    cmdkCloseAria: 'Close search',
    cmdkListAria: 'Search results',
    cmdkEmpty: 'NO RESULTS // TRY ANOTHER QUERY',
    paletteGroupPage: 'PAGE',
  },
};
