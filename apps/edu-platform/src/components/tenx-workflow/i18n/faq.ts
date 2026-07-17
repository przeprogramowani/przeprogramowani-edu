/**
 * Slownik strony FAQ (slug faq, kontekst publiczny /10xdevs-4). Pytania oparte
 * o sekcje FAQ na 10xdevs.pl, pogrupowane tematycznie i renderowane jako
 * dostepne akordeony <details>. FaqBody dokłada pasek wyszukiwania (search) z
 * filtrem kategorii (chipy) w stylu strony Quick search - jedno spojne UI
 * przeszukiwania w calym portalu.
 *
 * Fakty zmienne (dokladne daty edycji, cena, adresy) celowo odsylaja na
 * 10xdevs.pl, zeby FAQ nie dezaktualizowalo sie miedzy edycjami.
 *
 * Strona jest polska (nie ma jej w EN_PAGES - rollout progresywny), wiec wpis
 * en celowo odbija pl. Gdy dojdzie misja EN, podmien en na tlumaczenie i
 * dopisz slug do EN_PAGES.
 */

import type { Lang } from './index';

interface QA {
  q: string;
  aHtml: string;
}

interface Group {
  /** Id kategorii - kotwica sekcji i wartosc chipa filtra. */
  id: string;
  num: string;
  kicker: string;
  h2: string;
  /** Etykieta chipa w pasku filtra (krotsza niz h2). */
  chip: string;
  items: QA[];
}

interface FaqText {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  search: {
    placeholder: string;
    inputAria: string;
    countAria: string;
    catAria: string;
    catLabel: string;
    allChip: string;
    /** Slowa liczebnika "pytanie/pytania/pytań" wg reguly PL (1 / 2-4 / reszta). */
    nounForms: [string, string, string];
    emptyPrefix: string;
    emptyGeneric: string;
    clear: string;
  };
  groups: Group[];
  next: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    ctaHint: string;
    cta: string;
  };
}

const pl: FaqText = {
  eyebrow: 'Najczęstsze pytania',
  h1Html: 'FAQ - wszystko, co chcesz wiedzieć o <span class="glow">10xDevs</span>',
  subHtml:
    'Zebrane w jednym miejscu odpowiedzi o program, harmonogram, narzędzia, certyfikację i płatności. Wpisz frazę albo naciśnij <kbd>/</kbd> - lista filtruje się od razu. Nie ma Twojego pytania? Napisz do nas.',
  search: {
    placeholder: 'Szukaj: certyfikat, raty, live, dostęp, faktura… ( / przenosi tu kursor)',
    inputAria: 'Szukaj w pytaniach',
    countAria: 'Liczba pasujących pytań',
    catAria: 'Filtr kategorii pytań',
    catLabel: 'KATEGORIA',
    allChip: 'Wszystko',
    nounForms: ['pytanie', 'pytania', 'pytań'],
    emptyPrefix: 'BRAK WYNIKÓW DLA',
    emptyGeneric: 'BRAK WYNIKÓW // ZMIEŃ FRAZĘ ALBO KATEGORIĘ',
    clear: 'Wyczyść',
  },
  groups: [
    {
      id: 'program',
      num: '01',
      kicker: 'Podstawy',
      chip: 'O programie',
      h2: 'O programie',
      items: [
        {
          q: 'Co jest wyjątkowego w 10xDevs?',
          aHtml:
            'Nacisk na praktykę w projektach <b>greenfield i brownfield</b>, rzetelną ocenę tego, co AI naprawdę potrafi, pracę w grupie z setkami uczestników, stałą opiekę mentorów oraz interaktywną formę łączącą wideo, tekst, ćwiczenia i projekt zaliczeniowy.',
        },
        {
          q: 'Czym 10xDevs różni się od AI_devs?',
          aHtml:
            'To „braterskie" programy - oba warte uwagi. <b>10xDevs</b> skupia się na integracji narzędzi AI w codziennym workflow programisty przez cały cykl wytwarzania (łącznie z kodem legacy). <b>AI_devs</b> koncentruje się na integrowaniu modeli LLM z własnymi aplikacjami i automatyzacjami.',
        },
        {
          q: 'Dla kogo jest ten kurs? Nie mam backgroundu technicznego.',
          aHtml:
            'Kurs wymaga <b>doświadczenia programistycznego</b> - to nie jest szkolenie „od zera". Jest dla osób, które chcą wejść na wyższy, komercyjny poziom pracy z AI i tworzyć rozwiązania lepszej jakości.',
        },
        {
          q: 'Dlaczego mogę Wam zaufać?',
          aHtml:
            'Trzy dotychczasowe edycje 10xDevs to <b>ponad 6700 absolwentów</b>. Organizatorzy uczą od kilku lat i współpracowali z firmami takimi jak No Fluff Jobs czy SmartRecruiters. Partnerem jest <b>BRAVE</b> - firma edukacyjna, z której kursów skorzystało ponad 20 000 specjalistów.',
        },
        {
          q: 'Czy kurs jest przywiązany do jednego języka programowania?',
          aHtml:
            'Nie. Uczysz się <b>workflow pracy z AI</b>, nie frameworka. Materiały bazują na stacku webowym (Astro + React + TypeScript), ale z pełną dowolnością dla innych technologii - skille do planowania i implementacji są uniwersalne.',
        },
        {
          q: 'Czy program jest dostępny w języku angielskim?',
          aHtml:
            'Tak - wszystkie materiały tekstowe, zadania, dokumentacja i artefakty AI są po angielsku, a wideo ma angielskie napisy. <b>Sesje LIVE i Godziny Trenerskie są tylko po polsku.</b>',
        },
      ],
    },
    {
      id: 'przebieg',
      num: '02',
      kicker: 'Jak to leci',
      chip: 'Przebieg',
      h2: 'Przebieg i harmonogram',
      items: [
        {
          q: 'Kiedy startujemy i jak długo to trwa?',
          aHtml:
            'Program trwa <b>pięć tygodni</b> (pięć modułów). Dokładne daty najbliższej edycji znajdziesz na <a href="https://www.10xdevs.pl/" target="_blank" rel="noopener">10xdevs.pl</a>. Cały przebieg tydzień po tygodniu rozpisaliśmy na stronie <a href="/10xdevs-4/jak-dziala-kurs">Jak działa kurs</a>.',
        },
        {
          q: 'Kiedy są zajęcia LIVE i czy są nagrywane?',
          aHtml:
            'Każdy tydzień ma stały rytm: <b>live we wtorki o 19:00</b> (ok. godziny, z omówieniem modułu) oraz <b>Godziny Trenerskie w piątki o 13:00</b> - otwarty dyżur z autorami na pytania do lekcji i rozwiązywanie problemów. Wszystkie sesje są nagrywane i dostępne później.',
        },
        {
          q: 'Nie wiem, czy dam radę uczestniczyć we wszystkich spotkaniach LIVE.',
          aHtml:
            'Spokojnie - wszystkie sesje są nagrywane, więc nadrobisz w swoim tempie i ułożysz harmonogram pod siebie. Na żywo zyskujesz możliwość zadania pytania o własny projekt, ale obecność nie jest obowiązkowa.',
        },
        {
          q: 'Ile czasu potrzebuję na ten program?',
          aHtml:
            'Rekomendujemy około <b>5 godzin tygodniowo</b> (łącznie ~40 godzin) na wideo, sesje LIVE i zadania. O ostatecznym zaangażowaniu decydujesz sam.',
        },
        {
          q: 'W jakiej formie jest kurs i gdzie się odbywa?',
          aHtml:
            'To kurs <b>online, kohortowy</b>, w 100% na dedykowanej platformie: nagrania wideo, ćwiczenia, cotygodniowe sesje LIVE przez Zoom, moduł społeczności na Circle.so oraz projekt zaliczeniowy.',
        },
        {
          q: 'Jak długo mam dostęp do materiałów?',
          aHtml: 'Dostęp do materiałów trwa <b>12 miesięcy</b> od startu kursu.',
        },
        {
          q: 'Gdzie mogę oglądać lekcje?',
          aHtml:
            'Na dedykowanej platformie - w formacie wideo i artykułów. Dodatkowo dostajesz lekcje w Markdown, platformę 10xRules.ai z promptami, starter aplikacji oraz dostęp do narzędzi 10xDevs (m.in. 10x-cli).',
        },
      ],
    },
    {
      id: 'narzedzia',
      num: '03',
      kicker: 'Czego użyjesz',
      chip: 'Narzędzia',
      h2: 'Narzędzia i materiały',
      items: [
        {
          q: 'Czy potrzebuję dodatkowych narzędzi i ile one kosztują?',
          aHtml:
            'Program zrealizujesz z narzędziami takimi jak <b>Claude Code, Cursor, Windsurf czy GitHub Copilot</b>. Dla najlepszego doświadczenia sugerujemy płatne licencje, ale możesz też korzystać z rozwiązań open source i płacić tylko za tokeny API. Konkretny koszt zależy od wybranego narzędzia.',
        },
        {
          q: 'Co dokładnie robię w preworku?',
          aHtml:
            'Instalujesz i konfigurujesz 10x-cli oraz agenta w IDE, przechodzisz fundamenty pracy z kontekstem i regułami projektu i robisz rozgrzewkowe ćwiczenia. Cel: pierwszego live zaczynasz z działającym środowiskiem. Szczegóły w sekcji <a href="/10xdevs-4/jak-dziala-kurs#prework">Prework</a>.',
        },
        {
          q: 'Co dostaję poza lekcjami?',
          aHtml:
            'Lekcje w formacie wideo i artykułów, ich wersje w <b>Markdown</b>, platformę <b>10xRules.ai</b> z gotowymi promptami, starter aplikacji oraz dostęp do narzędzi ekosystemu 10xDevs.',
        },
      ],
    },
    {
      id: 'certyfikat',
      num: '04',
      kicker: 'Na koniec',
      chip: 'Certyfikat',
      h2: 'Certyfikacja i projekt',
      items: [
        {
          q: 'Czy dostanę certyfikat?',
          aHtml:
            'Tak. Certyfikacja ma <b>trzy poziomy</b>: 10xBuilder (obowiązkowy) oraz 10xArchitect i 10xChampion (dla ambitnych). Na wykonanie zadań masz dwa tygodnie od końca kursu, z dodatkowymi terminami. Terminy, zasady i szczegóły każdego bloku są na dedykowanej stronie <a href="/10xdevs-4/certyfikacja">Certyfikacja</a>.',
        },
        {
          q: 'Czy poradzę sobie z projektem zaliczeniowym?',
          aHtml:
            'Projekt realizujesz <b>stopniowo</b> - niemal każda lekcja to okazja, żeby dołożyć kolejny element. Po kursie masz dwa tygodnie na zaliczenie, a dla zajętych przewidziane są dodatkowe terminy.',
        },
        {
          q: 'Czy projekt musi być webowy?',
          aHtml:
            'Nie. Stack jest dowolny - webowy, desktopowy, mobilny czy embedded. Liczy się <b>zastosowanie AI w procesie wytwarzania</b>, a nie złożoność aplikacji.',
        },
        {
          q: 'Czy repozytorium musi być publiczne?',
          aHtml:
            'Nie jest wymagane, choć mile widziane. Repo prywatne jest OK - wtedy dodajesz prowadzących jako współpracowników albo dostarczasz zrzuty ekranu pokazujące strukturę projektu (pliki kontekstowe, testy, CI/CD).',
        },
        {
          q: 'Czy kurs pomaga w karierze programisty?',
          aHtml:
            'Umiejętność współpracy z AI to dziś jeden z najgorętszych skilli na rynku pracy. Certyfikat możesz dodać na <b>LinkedIn</b>, a w społeczności nawiązujesz kontakty branżowe - najlepsze projekty bywają promowane przez organizatorów.',
        },
      ],
    },
    {
      id: 'spolecznosc',
      num: '05',
      kicker: 'Razem raźniej',
      chip: 'Społeczność',
      h2: 'Społeczność',
      items: [
        {
          q: 'Jak działa społeczność?',
          aHtml:
            'Na czas kursu i przez <b>12 miesięcy po nim</b> masz dostęp do społeczności na Circle.so: wymiana wiedzy, feedback do projektów i kontakty branżowe. To tam odbywają się też dyskusje do lekcji i publikujemy ogłoszenia (m.in. zasady certyfikacji).',
        },
      ],
    },
    {
      id: 'platnosci',
      num: '06',
      kicker: 'Formalności',
      chip: 'Płatności',
      h2: 'Płatności i organizacja',
      items: [
        {
          q: 'Ile to kosztuje?',
          aHtml:
            'W ostatniej promocji: <b>1990 zł</b> zamiast standardowych 2990 zł. Aktualną cenę i termin promocji sprawdzisz na <a href="https://www.10xdevs.pl/" target="_blank" rel="noopener">10xdevs.pl</a>.',
        },
        {
          q: 'Jak opłacić dostęp?',
          aHtml:
            'Kartą, szybkim przelewem online lub BLIKiem przez EasyCart. Firmy mogą zapłacić na podstawie faktury proforma zwykłym przelewem lub z budżetu szkoleniowego.',
        },
        {
          q: 'Czy można kupić na raty?',
          aHtml:
            'Tak - dostępny jest zakup na <b>dwie raty 0%</b>. Raty obsługują organizatorzy i nie wpływają one na Twoją zdolność kredytową.',
        },
        {
          q: 'Czy można dostać fakturę proforma i zapłacić zwykłym przelewem?',
          aHtml:
            'Tak. Napisz do nas na <a href="mailto:10xdevs@brave.courses">10xdevs@brave.courses</a> z danymi do faktury, a wystawimy proformę do opłacenia tradycyjnym przelewem.',
        },
        {
          q: 'Czy można sfinansować kurs z budżetu szkoleniowego?',
          aHtml:
            'Tak, wielu uczestników korzysta z finansowania firmowego. Napisz do <a href="mailto:10xdevs@brave.courses">10xdevs@brave.courses</a> - podeślemy materiały pomocne w rozmowie z przełożonym.',
        },
        {
          q: 'Czy są zniżki dla zespołów z tej samej firmy?',
          aHtml:
            'Tak - przy zakupie dostępów dla zespołu przewidujemy atrakcyjne zniżki. Skontaktuj się z nami przez <a href="mailto:10xdevs@brave.courses">10xdevs@brave.courses</a>, żeby ustalić szczegóły.',
        },
        {
          q: 'Czy dostanę fakturę?',
          aHtml:
            'Tak, faktura generuje się automatycznie po zakupie. Przy płatności na raty faktura wystawiana jest na kwotę wpłaconej raty.',
        },
        {
          q: 'Czy jest gwarancja? Czy mogę zwrócić kurs?',
          aHtml:
            'Tak - zwrot <b>bez pytań do 14 dni</b> od rozpoczęcia, realizowany w ciągu trzech dni roboczych. Praktycznie nie ryzykujesz.',
        },
        {
          q: 'Kiedy będzie kolejna edycja?',
          aHtml:
            'Terminy kolejnej edycji ogłaszamy na <a href="https://www.10xdevs.pl/" target="_blank" rel="noopener">10xdevs.pl</a> - tam też zapiszesz się na powiadomienie o starcie zapisów.',
        },
      ],
    },
  ],
  next: {
    num: 'DALEJ',
    kicker: 'Gotowy?',
    h2: 'Chcesz dołączyć do kolejnej edycji?',
    leadHtml:
      'Zobacz pełny przebieg na stronie <a href="/10xdevs-4/jak-dziala-kurs">Jak działa kurs</a>, a po szczegóły oferty i zapisy zajrzyj na stronę kursu.',
    ctaHint: 'Zapisy i szczegóły oferty',
    cta: 'Przejdź na 10xdevs.pl →',
  },
};

/** EN celowo odbija PL - strona nie jest jeszcze w EN_PAGES (rollout progresywny). */
export const FAQ: Record<Lang, FaqText> = { pl, en: pl };
