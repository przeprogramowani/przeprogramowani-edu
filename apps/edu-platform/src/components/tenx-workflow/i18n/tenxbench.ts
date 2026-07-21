/**
 * Slownik strony 10xBench (slug 10xbench, kontekst publiczny). 10xBench to
 * benchmark Przeprogramowani, ktory pokazuje, jak wiodace modele LLM radza
 * sobie z jednym podejsciem do zbudowania prawdziwej strony produkcyjnej
 * (Astro + React + Tailwind + Cloudflare) - z wynikami, zrzutami ekranu
 * i wygenerowanym kodem obok siebie.
 *
 * Zrodlo: 10xbench.ai + repo przeprogramowani/10x-bench. Adresy zyja
 * w config.ts (TENX_BENCH). Strona jest polska (poza EN_PAGES) - wpis en
 * odbija pl.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface BenchText {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  routeAria: string;
  route: string[];

  what: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
  };

  how: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
  };

  score: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
  };

  find: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
  };

  next: {
    num: string;
    kicker: string;
    h2: string;
    ctaLabel: string;
    siteLabel: string;
    siteRest: string;
    repoLabel: string;
    repoRest: string;
    kursLink: string;
    kursRest: string;
  };
}

const pl: BenchText = {
  eyebrow: 'Benchmark modeli',
  h1Html: '10xBench - jak modele <span class="glow">radzą sobie z kodem</span>',
  subHtml:
    '<strong>10xBench</strong> to benchmark, który pokazuje, jak wiodące modele LLM radzą sobie z <b>jednym podejściem</b> do zbudowania prawdziwej strony produkcyjnej w <b>Astro, React, Tailwind i Cloudflare</b>. Wyniki, zrzuty ekranu i wygenerowany kod porównujesz obok siebie.',
  routeAria: 'Sekcje strony',
  route: ['Co to jest', 'Jak testujemy', 'Punktacja', 'Co znajdziesz'],

  what: {
    num: '01',
    kicker: 'Po co',
    h2: 'Co to jest 10xBench',
    leadHtml:
      'Każdy model dostaje ten sam prompt i ma jedno podejście - żadnych poprawek, żadnej iteracji. Zadanie: zbudować od zera stronę Przeprogramowani.pl. To test „vibe codingu" na realnym, produkcyjnym projekcie, nie na akademickim zadaniu.',
    rows: [
      { dt: 'Dla kogo', ddHtml: 'Dla każdego, kto wybiera model do pracy z kodem - zamiast wierzyć marketingowi, patrzysz na dowody z realnego zadania.' },
      { dt: 'Co mierzy', ddHtml: 'Jak model radzi sobie w <b>jednym strzale</b>: rozumienie wymagań, wygenerowany kod i gotowy do wdrożenia efekt.' },
      { dt: 'Na czym', ddHtml: 'Na prawdziwej stronie Przeprogramowani.pl - <b>Astro, React, Tailwind i Cloudflare</b>, nie na syntetycznym zadaniu.' },
    ],
  },

  how: {
    num: '02',
    kicker: 'Zasady',
    h2: 'Jak testujemy modele',
    leadHtml:
      'Ten sam prompt i ta sama specyfikacja treści trafiają do każdego modelu. Stack jest ustalony, więc porównanie jest uczciwe - różni je tylko model.',
    rows: [
      { dt: 'Jeden strzał', ddHtml: 'Model buduje stronę w <b>jednym podejściu</b>, bez iteracji i bez podpowiedzi - to celowo trudny scenariusz zero-shot.' },
      { dt: 'Ustalony stack', ddHtml: 'Astro + React + Tailwind + Cloudflare - identyczne dla wszystkich, żeby liczył się model, nie środowisko.' },
      { dt: 'Wiele prób', ddHtml: 'Każdy model przechodzi zadanie kilka razy; wynik modelu to <b>średnia z prób</b>, a rozrzut widać jako osobne punkty.' },
    ],
  },

  score: {
    num: '03',
    kicker: 'Jak liczymy',
    h2: 'Jak działa punktacja',
    leadHtml:
      'Każde kryterium ocenia się w skali <b>0-1</b>. Wynik modelu to średnia po kryteriach i próbach - jedna kolumna na model, z kropkami pokazującymi pojedyncze podejścia.',
    rows: [
      { dt: 'Kryteria', ddHtml: 'Każde kryterium: od <b>0 do 1 punktu</b>. Suma kryteriów wyznacza maksymalny wynik zadania.' },
      { dt: 'Kary', ddHtml: 'Opcjonalne odjęcie punktów za problemy spoza standardowych kryteriów - nie wliczają się do maksimum.' },
      { dt: 'Czas', ddHtml: 'Czas wykonania zadania zbieramy poglądowo, ale <b>nie wlicza się</b> do wyniku.' },
    ],
  },

  find: {
    num: '04',
    kicker: 'Co zobaczysz',
    h2: 'Co znajdziesz na 10xbench.ai',
    leadHtml:
      'Wchodzisz na 10xbench.ai i porównujesz modele obok siebie - liczby, obrazy i kod w jednym miejscu.',
    rows: [
      { dt: 'Wyniki', ddHtml: 'Tabela wyników z uśrednioną kolumną na model i rozrzutem prób.' },
      { dt: 'Zrzuty ekranu', ddHtml: 'Podgląd tego, co każdy model faktycznie wygenerował - efekt wizualny obok punktacji.' },
      { dt: 'Kod', ddHtml: 'Wygenerowany kod do wglądu - możesz zajrzeć, jak model doszedł do wyniku.' },
      { dt: 'Porównanie', ddHtml: 'Zestawienie dwóch rodzin modeli po średnim wyniku kryteriów i rozrzucie prób.' },
    ],
  },

  next: {
    num: 'DALEJ',
    kicker: 'Co teraz',
    h2: 'Zobacz wyniki i zajrzyj do repozytorium',
    ctaLabel: 'Otwórz 10xbench.ai',
    siteLabel: '10xbench.ai',
    siteRest: ' - leaderboard z wynikami, zrzutami ekranu i kodem.',
    repoLabel: 'Repozytorium 10x-bench',
    repoRest: ' - prompt, kryteria i wyniki benchmarku.',
    kursLink: 'Jak działa kurs',
    kursRest: ' - gdzie wybór modelu wpina się w naukę pracy z agentem.',
  },
};

/** EN celowo odbija PL - strona poza EN_PAGES (rollout progresywny). */
export const TENX_BENCH_TEXT: Record<Lang, BenchText> = { pl, en: pl };
