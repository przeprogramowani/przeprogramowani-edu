/**
 * Kanon uniwersow 10x Workflow: uniwersum -> kolor akcentu + glif.
 * Zatwierdzony kanon kolorow - nie zmieniac bez decyzji w change.md
 * (context/changes/10xdevs3-workflow-pages/change.md).
 *
 * Glify: abstrakcyjne motywy inline-SVG, viewBox 0 0 24 24,
 * stroke=currentColor (dziedzicza kolor sekcji), fill none, stroke-width 1.5.
 */

export type UniverseId =
  | 'ender'
  | 'trzycia'
  | 'hyperion'
  | 'diuna'
  | 'wh40k'
  | 'expanse'
  | 'starwars'
  | 'fundacja'
  | 'lem'
  | 'redrising';

export interface Universe {
  id: UniverseId;
  name: string;
  /** Tytul w oryginale (misja EN) - universeName() wybiera per jezyk. */
  nameEn: string;
  color: string;
  /** Kompletny znacznik <svg>...</svg> do wstawienia przez set:html. */
  glyph: string;
}

const g = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${paths}</svg>`;

export const UNIVERSES: Record<UniverseId, Universe> = {
  ender: {
    id: 'ender',
    name: 'Gra Endera',
    nameEn: 'Ender\'s Game',
    color: '#4ade9b',
    // Brama ze strzalka w dol: "The enemy's gate is down".
    glyph: g(
      '<path d="M5 3v18M19 3v18M5 3h14"/><path d="M12 7v9M8.5 12.5L12 16l3.5-3.5"/>'
    ),
  },
  trzycia: {
    id: 'trzycia',
    name: 'Problem trzech ciał',
    nameEn: 'The Three-Body Problem',
    color: '#4cc9f0',
    // Trzy male ciala na przecinajacych sie orbitach.
    glyph: g(
      '<ellipse cx="12" cy="12" rx="9" ry="4.5"/><ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-60 12 12)"/><circle cx="12" cy="4.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="5.5" cy="15.7" r="1.4" fill="currentColor" stroke="none"/><circle cx="18.5" cy="15.7" r="1.4" fill="currentColor" stroke="none"/>'
    ),
  },
  hyperion: {
    id: 'hyperion',
    name: 'Hyperion',
    nameEn: 'Hyperion',
    color: '#a78bfa',
    // Klepsydra (Grobowce Czasu) z kolcem Dzierzby.
    glyph: g(
      '<path d="M7 3h10L12 12 7 21h10L12 12 7 3z"/><path d="M12 12l4-2M16 10l2.5-1.5M16 10l.5 2.8"/>'
    ),
  },
  diuna: {
    id: 'diuna',
    name: 'Diuna',
    nameEn: 'Dune',
    color: '#f0a64a',
    // Luk wydmy z lukiem czerwia wynurzajacego sie z piasku.
    glyph: g(
      '<path d="M2 19c3-6 7-9 11-9 3.5 0 6.5 1.5 9 4"/><path d="M6 19a4.5 4.5 0 0 1 9 0"/><circle cx="10.5" cy="16.8" r=".9" fill="currentColor" stroke="none"/>'
    ),
  },
  wh40k: {
    id: 'wh40k',
    name: 'Warhammer 40k',
    nameEn: 'Warhammer 40k',
    color: '#e2564a',
    // Pol-zebatka (Adeptus Mechanicus).
    glyph: g(
      '<path d="M3 14a9 9 0 0 1 18 0"/><path d="M3 14v-3M8.5 6.8 7 4.2M15.5 6.8 17 4.2M21 14v-3M12 5V2"/><circle cx="12" cy="14" r="3.2"/><path d="M3 18h18" opacity=".5"/>'
    ),
  },
  expanse: {
    id: 'expanse',
    name: 'The Expanse',
    nameEn: 'The Expanse',
    color: '#3ddad0',
    // Trojkatny kadlub z plomieniem napedu.
    glyph: g(
      '<path d="M12 2 17 14H7L12 2z"/><path d="M7 14v3h10v-3"/><path d="M12 17v2M9.5 17l-1 3M14.5 17l1 3" opacity=".7"/>'
    ),
  },
  starwars: {
    id: 'starwars',
    name: 'Star Wars',
    nameEn: 'Star Wars',
    color: '#ffd166',
    // Czteroramienny rozblysk gwiazdy.
    glyph: g(
      '<path d="M12 2v7M12 15v7M2 12h7M15 12h7"/><circle cx="12" cy="12" r="2.2"/><path d="M6.5 6.5l2.3 2.3M17.5 6.5l-2.3 2.3M6.5 17.5l2.3-2.3M17.5 17.5l-2.3-2.3" opacity=".5"/>'
    ),
  },
  fundacja: {
    id: 'fundacja',
    name: 'Fundacja',
    nameEn: 'Foundation',
    color: '#f472b6',
    // Spirala galaktyki.
    glyph: g(
      '<path d="M12 12c0-1.8 1.5-3 3.2-2.6 2.2.5 3.3 2.8 2.6 5.2-.9 3-4.2 4.5-7.4 3.5C6.4 16.9 4.6 12.6 6 8.9 7.7 4.4 12.9 2.4 17 4.3"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>'
    ),
  },
  lem: {
    id: 'lem',
    name: 'Solaris',
    nameEn: 'Solaris',
    color: '#7aa2ff',
    // Symetryczne fale oceanu Solaris z zawieszonym okiem-kropla.
    glyph: g(
      '<path d="M3 15.5c3-3.2 6-3.2 9 0s6 3.2 9 0"/><path d="M5 19.5c2.3-2.2 4.7-2.2 7 0s4.7 2.2 7 0" opacity=".5"/><circle cx="12" cy="8" r="3"/><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none"/>'
    ),
  },
  redrising: {
    id: 'redrising',
    name: 'Red Rising',
    nameEn: 'Red Rising',
    color: '#ff4f6e',
    // Wznoszaca strzala ze skrzydlami: awans z kopalni na szczyt hierarchii.
    glyph: g(
      '<path d="M12 21V5M8 9l4-4 4 4"/><path d="M3.5 16.5c3.2-.4 5.5-2 7-4.5M20.5 16.5c-3.2-.4-5.5-2-7-4.5" opacity=".7"/>'
    ),
  },
};

/** Nazwa uniwersum w jezyku strony (PL: polskie wydania, EN: oryginaly). */
export function universeName(u: Universe, lang: 'pl' | 'en'): string {
  return lang === 'en' ? u.nameEn : u.name;
}
