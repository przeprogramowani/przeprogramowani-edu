/**
 * Slownik dedykowanej strony certyfikacji (slug certyfikacja, kontekst
 * publiczny /10xdevs-4). Terminy zgloszen, zasady i szczegoly trzech blokow
 * (10xBuilder / 10xArchitect / 10xChampion). Zrodlo tresci: posty w kanale
 * "Informacje i ogloszenia [10X3]" na Circle (comprehensive + per-blok). Pelne,
 * zawsze aktualne zasady CertBody osadza dodatkowo z posta przez getCirclePost.
 *
 * Terminy zyja w config.ts (CERTIFICATION_TERMS) - tu tylko rama tekstowa.
 * Linki formularzy zglosze celowo NIE sa publikowane (to formularze dla
 * uczestnikow) - kierujemy po nie na platforme / kanal Informacje.
 *
 * Strona jest polska (poza EN_PAGES) - wpis en odbija pl.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface Block {
  tag: string;
  h3: string;
  /** Slug strony modulu, do ktorej linkuje blok (kotwica "materiał w module"). */
  moduleSlug: string;
  moduleLabel: string;
  leadHtml: string;
  reqTitle: string;
  reqs: string[];
  noteHtml: string;
}

interface CertText {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  routeAria: string;
  route: string[];

  terms: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    termsCap: string;
    highlightLabel: string;
    rulesCap: string;
    rules: Row[];
  };

  blocks: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    moduleLinkLabel: string;
    reqLabel: string;
    formLabel: string;
    items: Block[];
  };

  evalSec: {
    num: string;
    kicker: string;
    h2: string;
    rows: Row[];
  };

  source: {
    k: string;
    html: string;
    docTitle: string;
    readOnCircle: string;
    fallbackHtml: string;
  };

  next: {
    num: string;
    kicker: string;
    h2: string;
    kursLink: string;
    kursRest: string;
    faqLink: string;
    faqRest: string;
  };
}

const pl: CertText = {
  eyebrow: 'Certyfikacja 10xDevs',
  h1Html: 'Certyfikacja - <span class="glow">projekt zaliczeniowy</span> i trzy odznaki',
  subHtml:
    'Certyfikat zdobywasz projektem, nie testem. W edycji 3.0 obowiązuje model 3 filarów: obowiązkowy <strong>10xBuilder</strong> oraz bloki dla ambitnych <strong>10xArchitect</strong> i <strong>10xChampion</strong>. Poniżej terminy, zasady zgłoszeń i szczegóły każdego bloku.',
  routeAria: 'Sekcje strony',
  route: ['Terminy', 'Bloki', 'Ocena', 'Pełne zasady'],

  terms: {
    num: '01',
    kicker: 'Kiedy',
    h2: 'Terminy i zasady zgłoszeń',
    leadHtml:
      'Certyfikację przechodzisz w <b>jednym z trzech terminów</b> (zgłoszenia do 23:59 wskazanego dnia). Po każdym terminie prowadzący mają dwa tygodnie na sprawdzenie i feedback.',
    termsCap: 'Trzy terminy zgłoszeń',
    highlightLabel: 'Wyróżnienia',
    rulesCap: 'Zasady zgłoszeń - przemyśl strategię',
    rules: [
      {
        dt: 'Jedno podejście',
        ddHtml:
          'Do certyfikacji podchodzisz w <b>jednym, wybranym terminie</b>. Warto wysłać projekt bliżej końca terminu, gdy wiesz już, na jakie odznaki się zgłaszasz.',
      },
      {
        dt: 'Wszystko w jednej turze',
        ddHtml:
          'Jeśli chcesz zdobyć więcej niż jedną odznakę (np. Builder + Architect + Champion), wysyłasz wszystkie formularze <b>w ramach tego samego terminu</b> (nie musi być tego samego dnia).',
      },
      {
        dt: 'Bez dorzucania',
        ddHtml:
          'Zgłosisz w lipcu tylko Builder - dostajesz certyfikat z tą jedną odznaką. Nie da się dosłać Architekta czy Championa w kolejnym terminie.',
      },
      {
        dt: 'Feedback: cisza = dobrze',
        ddHtml:
          'Jeśli w ciągu dwóch tygodni nie dostaniesz sygnału - wszystko jest OK, a certyfikat pojawi się na koniec tego okresu. Jeśli coś wymaga poprawy, odezwiemy się z konkretnym komentarzem.',
      },
      {
        dt: 'Wyróżnienia i Demo Day',
        ddHtml:
          'Wyróżnienia przyznajemy <b>tylko w 1. terminie</b>. Wyróżnione projekty mają szansę trafić na <b>Demo Day</b> - webinar z najlepszymi projektami edycji.',
      },
    ],
  },

  blocks: {
    num: '02',
    kicker: 'Trzy filary',
    h2: 'Szczegóły bloków: Builder, Architect, Champion',
    leadHtml:
      '10xBuilder jest <b>obowiązkowy</b> i wystarcza do certyfikatu. Architect i Champion to ścieżki dla chętnych - moduły 4 i 5 nie są wymagane do bazowej odznaki.',
    moduleLinkLabel: 'Materiał w module',
    reqLabel: 'Co przygotować',
    formLabel: 'Zgłoszenie',
    items: [
      {
        tag: '🚀 Blok obowiązkowy · Moduły 1-3',
        h3: '10xBuilder',
        moduleSlug: 'fundament',
        moduleLabel: 'Moduł 1: Fundament →',
        leadHtml:
          'Udane full-stackowe <b>MVP</b> z wdrożeniem na chmurę - fundament certyfikacji, który realizuje każdy uczestnik na bazie modułów 1-3.',
        reqTitle: 'Minimalne wymagania MVP',
        reqs: [
          'Akcje CRUD - tworzenie, odczyt, aktualizacja i usuwanie elementów w sposób sensowny dla domeny.',
          'Logika biznesowa - co najmniej jedna funkcja realizująca logikę (np. sugerowanie priorytetów).',
          'Testy - co najmniej jeden zestaw adresujący konkretne ryzyko z dokumentu test-plan.',
          'Autentykacja - dostęp powiązany z użytkownikiem, który loguje się i widzi swoje zasoby.',
        ],
        noteHtml:
          'Wymagania są celowo skromne, żeby każdy miał realną szansę na certyfikat. Repo publiczne albo prywatne z dodanym kontem <b>przeprogramowani</b> jako współpracownikiem (albo zrzuty ekranu struktury projektu).',
      },
      {
        tag: '🔧 Blok dla ambitnych · Moduł 4',
        h3: '10xArchitect',
        moduleSlug: 'legacy',
        moduleLabel: 'Moduł 4: Legacy →',
        leadHtml:
          'Dowodem jest <b>raport architektoniczny</b> - zwięzły two-pager złożony z czterech artefaktów powstałych w lekcjach modułu 4.',
        reqTitle: 'Cztery artefakty raportu',
        reqs: [
          'Mapa repozytorium (L2).',
          'Research wybranego ficzera (L3).',
          'Plan refaktoryzacji (L4).',
          'Notatki o domenie inspirowane DDD, context/domain/ (L5).',
        ],
        noteHtml:
          'Sam raport wygenerujesz promptem z lekcji M4L5. Najważniejsze: ma być <b>Twój</b> - taki, który potrafisz obronić, a nie przyjęty na wiarę po jednym prompcie.',
      },
      {
        tag: '🏆 Blok dla ambitnych · Moduł 5',
        h3: '10xChampion',
        moduleSlug: 'teamwork',
        moduleLabel: 'Moduł 5: Teamwork →',
        leadHtml:
          'Wystarczy zbudować <b>jeden z dwóch projektów</b> modułu 5. Nie wymagamy publikowania firmowego repozytorium - dowodem są zrzuty ekranu pokazujące, że przepływ działa.',
        reqTitle: 'Do wyboru jeden projekt',
        reqs: [
          'Pipeline CI/CD do review kodu (M5L2-L3): widok pipeline\'u z jobem, logi z code review, PR ze zrzutem komentarza agenta.',
          'Rejestr artefaktów zespołowych (M5L4): repozytorium/rejestr z przepływem, definicja paczki (np. package.json), lista wydanych wersji.',
        ],
        noteHtml:
          'Dowodem są zrzuty ekranu pokazujące działanie w Twoim kontekście albo w samodzielnym PoC - bez konieczności ujawniania firmowego kodu.',
      },
    ],
  },

  evalSec: {
    num: '03',
    kicker: 'Jak oceniamy',
    h2: 'Ocena, rozbudowa i projekty nietypowe',
    rows: [
      {
        dt: 'Ocena zgłoszeń',
        ddHtml:
          'Weryfikuje <b>człowiek wspomagany AI</b> - to nie automat. Zależy nam na realnym wysiłku i zrozumieniu materiału, nie na odhaczeniu checklisty.',
      },
      {
        dt: 'Rozbudowa projektu',
        ddHtml:
          'Możesz certyfikować się na projekcie, nad którym już pracujesz - jeśli udowodnisz połączenie z materiałem kursu (skille, dokumentacja, testy, CI/CD).',
      },
      {
        dt: 'Projekty nietypowe',
        ddHtml:
          'Desktop, mobile, embedded albo niewebowy stack? Dostosujemy kryteria - np. bez wymogu publicznego URL. Liczy się zachowanie przepływu (dokumentacja, testy, automatyzacja).',
      },
    ],
  },

  source: {
    k: 'Źródło',
    html:
      'Pełne, zawsze aktualne zasady pobieramy na żywo z posta w kanale <b>Informacje i ogłoszenia [10X3]</b> na Circle - tego samego, który widzą uczestnicy. Formularze zgłoszeniowe udostępniamy na platformie w trakcie programu.',
    docTitle: 'Pełne zasady certyfikacji 10xDevs 3.0 (z kanału Informacje)',
    readOnCircle: 'Przeczytaj oryginalny post na Circle →',
    fallbackHtml:
      'Nie udało się teraz pobrać treści z Circle. Pełne zasady znajdziesz w oryginalnym poście na platformie kursu.',
  },

  next: {
    num: 'DALEJ',
    kicker: 'Co teraz',
    h2: 'Zobacz, jak dojść do projektu zaliczeniowego',
    kursLink: 'Jak działa kurs',
    kursRest: ' - prework, 5 tygodni i rytm, który prowadzi do projektu.',
    faqLink: 'FAQ',
    faqRest: ' - pytania o terminy, dostęp i wymagania.',
  },
};

/** EN celowo odbija PL - strona poza EN_PAGES (rollout progresywny). */
export const CERT: Record<Lang, CertText> = { pl, en: pl };
