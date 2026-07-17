/**
 * Slownik strony "Jak dziala kurs 10xDevs" (slug jak-dziala-kurs, kontekst
 * publiczny /10xdevs-4). Opisuje przebieg programu: prework, wlasciwa czesc
 * (5 tygodni, 5 live we wtorki, 5 dyzurow trenerskich w piatki) oraz zasady
 * certyfikacji. Tresc zasad certyfikacji nie mieszka tutaj - pobierana jest
 * przez Circle API z posta w kanale "Informacje i ogloszenia [10X3]" i
 * wstrzykiwana do KursBody jako prop (jedno zrodlo prawdy = post na Circle).
 *
 * Strona jest polska (nie ma jej w EN_PAGES - rollout progresywny), wiec
 * wpis en celowo odbija pl. Gdy dojdzie misja EN dla tej strony, wystarczy
 * podmienic en na realne tlumaczenie i dopisac slug do EN_PAGES.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface KursText {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  routeAria: string;
  route: string[];

  prework: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
    targetK: string;
    targetHtml: string;
  };

  course: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rhythmK: string;
    tuesdayK: string;
    tuesdayHtml: string;
    fridayK: string;
    fridayHtml: string;
    weeksCap: string;
    weeks: { tag: string; h3: string; p: string }[];
    targetK: string;
    targetHtml: string;
  };

  cert: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    pillarsCap: string;
    pillars: { tag: string; h3: string; p: string }[];
    termsCap: string;
    ctaK: string;
    ctaPre: string;
    ctaLink: string;
    ctaRest: string;
  };

  next: {
    num: string;
    kicker: string;
    h2Pre: string;
    h2Accent: string;
    targetK: string;
    faqLink: string;
    faqRest: string;
    cscLink: string;
    cscRest: string;
    top5Link: string;
    top5Rest: string;
  };
}

const pl: KursText = {
  eyebrow: 'Przebieg programu',
  h1Html: 'Jak działa kurs <span class="glow">10xDevs</span>',
  subHtml:
    'Od <strong>preworku</strong> i konfiguracji narzędzi, przez <strong>pięć tygodni</strong> pracy z agentem AI (live we wtorki, dyżury trenerskie w piątki), aż po <strong>certyfikację</strong> projektem zaliczeniowym. Poniżej masz cały rytm programu w jednym miejscu.',
  routeAria: 'Sekcje strony',
  route: ['Prework', '5 tygodni', 'Certyfikacja', 'Dalej'],

  prework: {
    num: 'ETAP 00',
    kicker: 'Zanim ruszymy',
    h2: 'Prework - wchodzisz na start z gotowym środowiskiem',
    leadHtml:
      'Prework to materiały do samodzielnej pracy <b>przed startem</b> właściwego kursu. Cel jest jeden: pierwszego wtorkowego live\'a zaczynasz z działającym setupem i podstawami pracy z agentem, bez tracenia czasu na konfigurację na żywo.',
    rows: [
      {
        dt: 'Narzędzia',
        ddHtml:
          'Instalacja i konfiguracja <b>10x-cli</b> oraz IDE/agenta (Cursor, Claude Code lub Codex CLI). Sprawdzasz, że wszystko odpala się u Ciebie lokalnie.',
      },
      {
        dt: 'Fundamenty',
        ddHtml:
          'Jak w ogóle rozmawiać z agentem: kontekst, reguły projektu, dokumenty kontekstowe. To baza, na której stoją wszystkie moduły.',
      },
      {
        dt: 'Rozgrzewka',
        ddHtml:
          'Pierwsze ćwiczenia na sucho, żeby workflow "pomysł → plan → implementacja → review" nie był nowością, gdy ruszy moduł 1.',
      },
    ],
    targetK: 'Po co',
    targetHtml:
      'Prework zdejmuje z tygodnia 1. całą "instalacyjną" część. Wchodzisz na program gotowy do <b>pracy nad projektem</b>, a nie do konfigurowania środowiska.',
  },

  course: {
    num: 'ETAP 01',
    kicker: 'Właściwa część',
    h2: 'Pięć tygodni, pięć modułów, stały rytm tygodnia',
    leadHtml:
      'Właściwy kurs to <b>5 tygodni</b> i <b>5 modułów</b>. Każdy tydzień ma ten sam, przewidywalny rytm: <b>we wtorek live</b>, w którym omawiamy moduł na żywo, i <b>w piątek dyżur trenerski z autorami kursu</b> - otwarte Q&A, na którym rozwiązujemy Twoje realne problemy z projektem.',
    rhythmK: 'Rytm tygodnia',
    tuesdayK: 'Wtorek — live',
    tuesdayHtml:
      'Spotkanie na żywo z omówieniem modułu na dany tydzień: workflow, skille, demo na realnym kodzie. <b>5 live w całym programie</b> - po jednym na moduł. Nagrania zostają na platformie.',
    fridayK: 'Piątek — dyżur trenerski',
    fridayHtml:
      'Otwarty dyżur z <b>autorami kursu</b>: pytania do lekcji, przeglądy Twojego kodu, odblokowywanie w projekcie zaliczeniowym. <b>5 dyżurów w całym programie</b> - po jednym na tydzień.',
    weeksCap: 'Pięć modułów programu',
    weeks: [
      { tag: 'Moduł 1', h3: 'Fundament', p: 'Kontekst i reguły projektu - grunt pod pracę z agentem.' },
      { tag: 'Moduł 2', h3: 'Core Skills Chain', p: 'Pięć kroków od pomysłu do review. Tu startuje praca nad projektem.' },
      { tag: 'Moduł 3', h3: 'Jakość', p: 'Testy, hooki i bramki jakości - żeby AI-owy kod był bezpieczny.' },
      { tag: 'Moduł 4', h3: 'Legacy', p: 'Praca w zastanym kodzie - realia, nie tylko greenfield.' },
      { tag: 'Moduł 5', h3: 'Teamwork', p: 'Workflow w zespole: pipeline\'y, CI/CD, współpraca z AI.' },
    ],
    targetK: 'Rytm',
    targetHtml:
      'Wtorek daje Ci <b>materiał i kierunek</b>, tydzień to czas na własną pracę, a piątkowy dyżur <b>odblokowuje</b>, gdy coś się zatnie. Pięć razy pod rząd - tyle wystarczy, żeby wyrobić nawyk.',
  },

  cert: {
    num: 'ETAP 02',
    kicker: 'Na koniec',
    h2: 'Certyfikacja - projekt zaliczeniowy i trzy odznaki',
    leadHtml:
      'Certyfikat zdobywasz <b>projektem zaliczeniowym</b>, nie testem. W edycji 3.0 obowiązuje model oparty o trzy filary - jeden obowiązkowy i dwa dla ambitnych.',
    pillarsCap: 'Trzy filary certyfikacji',
    pillars: [
      { tag: 'Blok obowiązkowy', h3: '🚀 10xBuilder', p: 'Full-stackowe MVP z wdrożeniem na chmurę. Fundament, który realizuje każdy uczestnik.' },
      { tag: 'Blok dla ambitnych', h3: '🔧 10xArchitect', p: 'Rozbudowa architektury, modernizacja i refaktoryzacja - AI w dużej skali.' },
      { tag: 'Blok dla ambitnych', h3: '🏆 10xChampion', p: 'AI w pracy zespołowej: pipeline\'y CI/CD i nowoczesny workflow.' },
    ],
    termsCap: 'Terminy zgłoszeń',
    ctaK: 'Pełne zasady',
    ctaPre: 'Terminy, zasady zgłoszeń i szczegóły każdego bloku (wymagania, artefakty, ocena) znajdziesz na dedykowanej stronie ',
    ctaLink: 'Certyfikacja',
    ctaRest: ' - z pełnymi zasadami pobieranymi na żywo z Circle.',
  },

  next: {
    num: 'DALEJ',
    kicker: 'Co teraz',
    h2Pre: 'Masz pytania? Zajrzyj do ',
    h2Accent: 'FAQ',
    targetK: 'Skróty',
    faqLink: 'FAQ',
    faqRest: ' - najczęstsze pytania o dostęp, terminy i wymagania.',
    cscLink: '10xWorkflow (CSC)',
    cscRest: ' - zobacz workflow, który ćwiczysz przez cały kurs.',
    top5Link: '10xTop5',
    top5Rest: ' - pięć wartości kursu z dowodami od uczestników.',
  },
};

/** EN celowo odbija PL - strona nie jest jeszcze w EN_PAGES (rollout progresywny). */
export const KURS: Record<Lang, KursText> = { pl, en: pl };
