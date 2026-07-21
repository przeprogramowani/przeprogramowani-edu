/**
 * Konfiguracja projektu 10x Workflow: identyfikator kursu, bazy URL
 * i adresy zalezne od kursu. Zmiana edycji kursu = edycja tego pliku.
 */

/** Identyfikator kursu na platformie (auth, login, adresy lekcji). */
export const COURSE_ID = '10xdevs-3';

/** Baza stron gated (za logowaniem) - wrappery w src/pages/10xdevs-3/workflow. */
export const INTERNAL_BASE = '/10xdevs-3/workflow';

/** Baza stron publicznych (bez auth) - wrapper src/pages/10xdevs-4/[...slug].astro. */
export const PUBLIC_BASE = '/10xdevs-4';

/**
 * Adres lekcji kursu na platformie (NN = 01..25). Kurs ma pelne wersje
 * pl i en (src/content/lessons10xDevs3/{pl,en}) - strony EN linkuja
 * lekcje angielskie.
 */
export function lessonUrl(nn: string, lang: 'pl' | 'en' = 'pl'): string {
  return `/external/${COURSE_ID}/${lang}/${nn}`;
}

/** Adres logowania z powrotem na strone, z ktorej przyszedl user. */
export function loginRedirectUrl(courseId: string, returnTo: string): string {
  return `/external/${courseId}/login?returnUrl=${encodeURIComponent(returnTo)}`;
}

/**
 * Oferta przedsprzedazy 10xDevs 4.0 pokazywana w bannerach kontekstu
 * publicznego. Dane ze strony 10xdevs.pl (stan 2026-07-10) - po zmianie
 * oferty wystarczy edycja tutaj.
 */
export const TENX_DEVS_PROMO = {
  deadline: '30 lipca',
  deadlineEn: 'July 30',
  price: '1990 zł',
  regular: '2990 zł',
} as const;

/**
 * Link wychodzacy do 10xdevs.pl z UTM - analityka 10xdevs.pl widzi zrodlo
 * i miejsce klikniecia (utm_content rozrozni banner od logo).
 */
export function tenxDevsUrl(content: string): string {
  return `https://www.10xdevs.pl/?utm_source=platforma-przeprogramowani&utm_medium=referral&utm_campaign=10x-workflow&utm_content=${content}`;
}

/** Zapis na Przeprogramowany Newsletter (banner naprzemienny z przedsprzedaza). */
export const NEWSLETTER_URL =
  'https://przeprogramowani.pl/newsletter?utm_source=platforma-przeprogramowani&utm_medium=referral&utm_campaign=10x-workflow&utm_content=newsletter-banner';

/**
 * Zrodlo zasad certyfikacji na stronie "Jak dziala kurs" - post spolecznosciowy
 * z kanalu "Informacje i ogloszenia [10X3]" w spolecznosci Brave (10xDevs 3.0).
 * Tresc pobierana przez Circle API (getCirclePost) i renderowana na stronie,
 * dzieki czemu zasady maja jedno zrodlo prawdy (post na Circle). Zmiana edycji
 * lub posta = edycja tych stalych.
 */
export const CERTIFICATION_POST = {
  /** Space id kanalu "Informacje i ogloszenia [10X3]" (Brave). */
  spaceId: 2552646,
  /** Id posta "Wszystko o projekcie zaliczeniowym i certyfikacji 10XDevs 3.0". */
  postId: '32795482',
  /** Kanoniczny adres posta na Circle (fallback "przeczytaj na Circle"). */
  url: 'https://bravecourses.circle.so/c/informacje-i-ogloszenia-10x3/wszystko-o-projekcie-zaliczeniowym-i-certyfikacji-10xdevs-3-0',
} as const;

/**
 * Terminy zgloszen certyfikacji - dane z posta [10X3] na Circle. Sa per edycja,
 * wiec zmiana edycji = edycja tej listy (pelne, zawsze aktualne zasady i tak
 * osadzamy z posta przez getCirclePost). 1. termin jest jedynym z wyroznieniami.
 */
export const CERTIFICATION_TERMS = [
  { label: '1. termin', date: '5 lipca 2026', highlight: 'jedyny termin z wyróżnieniami i szansą na Demo Day' },
  { label: '2. termin', date: '10 sierpnia 2026', highlight: '' },
  { label: '3. termin (ostateczny)', date: '14 września 2026', highlight: '' },
] as const;

/**
 * 10x-cli - terminalowy pomocnik kursu (repo przeprogramowani/10x-cli), ktory
 * dostarcza zasoby lekcji prosto do projektu. Adresy i przyklady komend w
 * jednym miejscu, zeby strona narzedzia i kaflik na stronach skilli czytaly
 * to samo zrodlo.
 */
export const TENX_CLI = {
  repo: 'https://github.com/przeprogramowani/10x-cli',
  /** Pakiet npm (uruchomienie zero-install przez npx). */
  npmPackage: '@przeprogramowani/10x-cli',
  /** Przykladowe komendy pokazywane na stronie narzedzia i w kafelkach skilli. */
  authCmd: '10x auth',
  getExample: '10x get m1l1',
  /**
   * Pobranie samego skilla po nazwie (kafelek CliHint na stronach skilli).
   * Wg README: `10x get <ref> --type skills --name <name>`. `%s` = nazwa skilla.
   */
  skillCmd: (name: string) => `10x get <lekcja> --type skills --name ${name}`,
} as const;

/**
 * 10xBench - benchmark Przeprogramowani (repo przeprogramowani/10x-bench),
 * ktory pokazuje, jak wiodace modele LLM radza sobie z jednym podejsciem
 * do zbudowania prawdziwej strony produkcyjnej (Astro + React + Tailwind +
 * Cloudflare). Adresy w jednym miejscu, zeby strona narzedzia i kaflik
 * ekosystemu czytaly to samo zrodlo.
 */
export const TENX_BENCH = {
  /** Publiczny leaderboard z wynikami, zrzutami ekranu i wygenerowanym kodem. */
  site: 'https://www.10xbench.ai/',
  /** Repozytorium benchmarku (prompt, kryteria, wyniki). */
  repo: 'https://github.com/przeprogramowani/10x-bench',
} as const;
