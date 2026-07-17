/**
 * Slownik strony glownej portalu (MOSTEK // WIDOK GLOWNY, slug index).
 * Struktura kluczy odzwierciedla kolejnosc sekcji w HubBody.astro; pola *Html
 * zawieraja inline markup (strong/b/span glow) i renderuja sie przez set:html.
 * Etykiety paneli konsoli (panels) i karty skrotu (cards) sa kluczowane
 * slugiem strony docelowej. Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface HubDict {
  eyebrow: string;
  h1SfHtml: string;
  h1NeutralHtml: string;
  subHtml: string;
  svgDesktopAria: string;
  svgMobileAria: string;
  screenTitle: string;
  screenSf: string;
  screenNeutral: string;
  mapCapSf: string;
  mapCapNeutral: string;
  routeAria: string;
  routeSkrot: string;
  routeJak: string;
  routeGeneza: string;
  routeDalej: string;
  skrotEyebrow: string;
  how: {
    num: string;
    /** Sufiks za universeName(UNIVERSES.expanse, lang) w sec-uni. */
    uniSuffix: string;
    h2: string;
    lead: string;
    modeDt: string;
    modeDdHtml: string;
    ddDt: string;
    ddDdHtml: string;
    skillsDt: string;
    skillsPre: string;
    skillsLink: string;
    skillsRest: string;
    searchDt: string;
    searchPreHtml: string;
    searchLink: string;
    searchRestHtml: string;
  };
  geneza: {
    num: string;
    uni: string;
    h2: string;
    leadPre: string;
    leadLink1: string;
    leadMid: string;
    leadLink2: string;
    leadPost: string;
  };
  dalej: {
    numSf: string;
    numNeutral: string;
    uni: string;
    h2Pre: string;
    h2Accent: string;
    targetK: string;
    targetPre: string;
    targetLink: string;
    targetRest: string;
    mono: string;
    top5Dt: string;
    top5Link: string;
    top5Rest: string;
    coreDt: string;
    coreLink: string;
    coreRest: string;
    startDt: string;
    startLink: string;
    startRest: string;
    docsDt: string;
    docsLink: string;
    docsRest: string;
    finis: string;
    finisCiteSf: string;
    finisCiteNeutral: string;
  };
}

export const HUB: Record<Lang, HubDict> = {
  pl: {
    eyebrow: 'MOSTEK // WIDOK GŁÓWNY',
    h1SfHtml: 'Mostek <span class="glow">Rocinante</span>: stąd widać cały system',
    h1NeutralHtml: 'Panel sterowania: <span class="glow">stąd widać cały system</span>',
    subHtml:
      'Ten portal to mapa <strong>10x Workflow</strong> - systemu pracy z agentem AI z kursu <strong>10xDevs</strong>. Podzielony na pięć kategorii: <strong>Kurs</strong> (przebieg i certyfikacja), <strong>Moduły</strong> (pięć modułów i skalowanie), <strong>Skille</strong> (łańcuch Core Skills Chain), <strong>Ekosystem</strong> (narzędzia i dokumentacja) oraz <strong>FAQ</strong>. Każdy panel poniżej to jedna kategoria - kliknij, żeby otworzyć jej przegląd.',
    svgDesktopAria:
      'Konsola mostka: centralny ekran 10x Workflow otoczony panelami-wskaźnikami; każdy panel prowadzi do przeglądu jednej kategorii portalu - Kurs, Moduły, Skille, Ekosystem i FAQ',
    svgMobileAria:
      'Konsola mostka w układzie pionowym: centralny ekran 10x Workflow u góry, poniżej panele-wskaźniki prowadzące do przeglądu kategorii portalu - Kurs, Moduły, Skille, Ekosystem i FAQ',
    screenTitle: '10X WORKFLOW',
    screenSf: 'MOSTEK // KURS WYZNACZONY',
    screenNeutral: 'PANEL STEROWANIA // PORTAL',
    mapCapSf: 'MOSTEK // WYBIERZ KATEGORIĘ',
    mapCapNeutral: 'PANEL STEROWANIA // WYBIERZ KATEGORIĘ',
    routeAria: 'Sekcje mostka',
    routeSkrot: 'Kategorie',
    routeJak: 'Jak czytać portal',
    routeGeneza: 'Skąd ten klimat',
    routeDalej: 'Dalej: zacznij od 10xTop5',
    skrotEyebrow: 'Pięć kategorii portalu w jednym widoku',
    how: {
      num: 'INSTRUKCJA',
      uniSuffix: ' · Konsola mostka',
      h2: 'Jak czytać ten portal',
      lead: 'Wszystkie strony korzystają z tych samych przełączników w pasku nawigacji - ustawienie zapamiętuje się między stronami. Cztery rzeczy wystarczą, żeby poruszać się sprawnie:',
      modeDt: 'TRYB',
      modeDdHtml:
        '<b>SF / NEUTRALNY</b> zmienia narrację, nie treść: SF dodaje kosmiczne metafory i odniesienia do książek, NEUTRALNY zostawia czysty opis techniczny. Merytoryka jest w obu trybach identyczna.',
      ddDt: 'DEEP DIVE',
      ddDdHtml:
        '<b>ON / OFF</b> odsłania rozszerzone sekcje: anatomię skilli, walidacje i granice. Z OFF czytasz przegląd, z ON - dokumentację do pracy.',
      skillsDt: 'Strony skilli',
      skillsPre: 'kroki łańcucha na stronie ',
      skillsLink: 'CSC',
      skillsRest:
        ' linkują do podstron pojedynczych skilli (np. /10x-plan): wejście → wyjście, mechanizm i granice każdego z nich.',
      searchDt: 'Szukanie',
      searchPreHtml:
        'przycisk <b>SZUKAJ (Cmd+K / Ctrl+K)</b> działa z każdej strony; pełny indeks z filtrowaniem na żywo mieszka w ',
      searchLink: 'dokumentacji',
      searchRestHtml: ' - tam klawisz <b>/</b> ustawia kursor w polu wyszukiwania.',
    },
    geneza: {
      num: 'GENEZA',
      uni: 'Skąd ten klimat',
      h2: 'Kosmiczna konwencja portalu',
      leadPre:
        'Każda strona portalu ma swoje uniwersum sci-fi - kolor, symbol i metaforę pożyczoną z książek, które naprawdę czytamy. To nie dekoracja: dobra metafora trzyma się pamięci lepiej niż definicja, więc plan Seldona tłumaczy plany, a ocean Solaris - dług kognitywny. Pełna lista dziesięciu uniwersów, z ocenami i powodami, mieszka na stronie ',
      leadLink1: 'motywu sci-fi',
      leadMid: '; a jeśli wolisz zacząć od twardych dowodów zamiast metafor, otwórz ',
      leadLink2: '10xTop5',
      leadPost: '.',
    },
    dalej: {
      numSf: 'MANEWR',
      numNeutral: 'DALEJ',
      uni: 'Pierwszy manewr · kurs na dowody',
      h2Pre: 'Zacznij od ',
      h2Accent: '10xTop5',
      targetK: 'CEL:',
      targetPre: 'jeśli masz czas na jedną stronę, otwórz ',
      targetLink: '10xTop5',
      targetRest:
        ' - pięć najmocniejszych wartości kursu z dowodami; każda kończy się follow-upem, który pokazuje, gdzie w portalu ta wartość jest rozwinięta.',
      mono: 'WYBIERZ KIERUNEK',
      top5Dt: 'top 5',
      top5Link: '10xTop5',
      top5Rest: ' - pięć golden nuggets, każdy z follow-upem do wartości z kursu',
      coreDt: 'rdzeń',
      coreLink: 'Core Skills Chain',
      coreRest: ' - pięć kroków jednej jednostki pracy, każdy z artefaktem na dysku',
      startDt: 'start',
      startLink: 'Moduł 1: Fundament',
      startRest: ' - kontekst i reguły projektu, zanim ruszy pierwsza zmiana',
      docsDt: 'docs',
      docsLink: 'Dokumentacja',
      docsRest: ' - quick search, gdy wiesz, czego szukasz',
      finis:
        '„Nie potrzebujesz wielkiego skoku. Potrzebujesz kursu i serii małych, weryfikowalnych manewrów."',
      finisCiteSf: 'dziennik pokładowy, w duchu mostka Rocinante',
      finisCiteNeutral: 'zasada przewodnia 10x Workflow',
    },
  },
  en: {
    eyebrow: 'BRIDGE // MAIN VIEW',
    h1SfHtml: 'The bridge of the <span class="glow">Rocinante</span>: the whole system in view',
    h1NeutralHtml: 'Control panel: <span class="glow">the whole system in view</span>',
    subHtml:
      'This portal is the map of the <strong>10x Workflow</strong> - the system for working with an AI agent from the <strong>10xDevs</strong> course. It is split into five categories: <strong>Course</strong> (flow and certification), <strong>Modules</strong> (the five modules and scaling), <strong>Skills</strong> (the Core Skills Chain), <strong>Ecosystem</strong> (tools and documentation) and <strong>FAQ</strong>. Each panel below is one category - click it to open its overview.',
    svgDesktopAria:
      'Bridge console: a central 10x Workflow screen surrounded by indicator panels; each panel leads to the overview of one portal category - Course, Modules, Skills, Ecosystem and FAQ',
    svgMobileAria:
      'Bridge console in a vertical layout: the central 10x Workflow screen on top, below it indicator panels leading to the overview of portal categories - Course, Modules, Skills, Ecosystem and FAQ',
    screenTitle: '10X WORKFLOW',
    screenSf: 'BRIDGE // COURSE LAID IN',
    screenNeutral: 'CONTROL PANEL // PORTAL',
    mapCapSf: 'BRIDGE // CHOOSE A CATEGORY',
    mapCapNeutral: 'CONTROL PANEL // CHOOSE A CATEGORY',
    routeAria: 'Bridge sections',
    routeSkrot: 'Categories',
    routeJak: 'How to read the portal',
    routeGeneza: 'Why the vibe',
    routeDalej: 'Next: start with 10xTop5',
    skrotEyebrow: 'The five portal categories in one view',
    how: {
      num: 'MANUAL',
      uniSuffix: ' · Bridge console',
      h2: 'How to read this portal',
      lead: 'Every page uses the same toggles in the navigation bar - the setting is remembered across pages. Four things are enough to get around comfortably:',
      modeDt: 'MODE',
      modeDdHtml:
        '<b>SF / NEUTRAL</b> switches the narration, not the content: SF adds cosmic metaphors and book references, NEUTRAL keeps a clean technical description. The substance is identical in both modes.',
      ddDt: 'DEEP DIVE',
      ddDdHtml:
        '<b>ON / OFF</b> reveals the extended sections: skill anatomy, validations and boundaries. With OFF you read an overview, with ON - working documentation.',
      skillsDt: 'Skill pages',
      skillsPre: 'the chain steps on the ',
      skillsLink: 'CSC',
      skillsRest:
        " page link to subpages for individual skills (e.g. /10x-plan): input → output, each one's mechanism and boundaries.",
      searchDt: 'Search',
      searchPreHtml:
        'the <b>SEARCH (Cmd+K / Ctrl+K)</b> button works from every page; the full index with live filtering lives in the ',
      searchLink: 'documentation',
      searchRestHtml: ' - there, the <b>/</b> key puts the cursor in the search field.',
    },
    geneza: {
      num: 'ORIGINS',
      uni: 'Why the vibe',
      h2: "The portal's cosmic convention",
      leadPre:
        'Every page of the portal has its own sci-fi universe - a color, a symbol and a metaphor borrowed from books we actually read. It is not decoration: a good metaphor sticks in memory better than a definition, so the Seldon Plan explains plans, and the ocean of Solaris explains cognitive debt. The full list of ten universes, with ratings and reasons, lives on the ',
      leadLink1: 'sci-fi theme',
      leadMid: ' page; and if you would rather start with hard evidence instead of metaphors, open ',
      leadLink2: '10xTop5',
      leadPost: '.',
    },
    dalej: {
      numSf: 'MANEUVER',
      numNeutral: 'NEXT',
      uni: 'First maneuver · set course for the evidence',
      h2Pre: 'Start with ',
      h2Accent: '10xTop5',
      targetK: 'GOAL:',
      targetPre: 'if you have time for one page, open ',
      targetLink: '10xTop5',
      targetRest:
        ' - the five strongest course values with evidence; each ends with a follow-up showing where in the portal that value is developed.',
      mono: 'CHOOSE A DIRECTION',
      top5Dt: 'top 5',
      top5Link: '10xTop5',
      top5Rest: ' - five golden nuggets, each with a follow-up to a value from the course',
      coreDt: 'core',
      coreLink: 'Core Skills Chain',
      coreRest: ' - the five steps of a single unit of work, each with an artifact on disk',
      startDt: 'start',
      startLink: 'Module 1: Foundation',
      startRest: ' - project context and rules, before the first change gets moving',
      docsDt: 'docs',
      docsLink: 'Documentation',
      docsRest: ' - quick search for when you know what you are looking for',
      finis:
        '"You do not need a giant leap. You need a course and a series of small, verifiable maneuvers."',
      finisCiteSf: "captain's log, in the spirit of the Rocinante's bridge",
      finisCiteNeutral: 'the guiding principle of 10x Workflow',
    },
  },
};
