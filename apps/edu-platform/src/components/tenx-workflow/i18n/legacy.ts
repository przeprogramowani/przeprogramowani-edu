/**
 * Slownik strony "Modul 4: Legacy" (legacy/LegacyBody). Struktura kluczy
 * odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja inline markup
 * (strong/b/em) i renderuja sie przez set:html. Nazwy uniwersow dociagane
 * przez universeName() - w slowniku tylko dopiski po separatorze.
 * Linie GRUNT: nazwiska badaczy bez zmian, tytuly prac w oryginale.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface DeepDiveItem {
  label: string;
  /** Tresc panelu (inline markup dozwolony, renderowana przez DeepDive). */
  body: string;
}

interface LegacyLesson {
  num: string;
  /** Dopisek w sec-uni po nazwie uniwersum (z separatorem ' · '). */
  uniSub: string;
  h2: string;
  epigraphSf: string;
  epigraphCiteSf: string;
  figAria: string;
  /** Etykiety <text> w SVG figury, w kolejnosci dokumentu. */
  fig: string[];
  figcaption: string;
  leadSfHtml: string;
  leadNeutralHtml: string;
  leadHtml: string;
  grunt: string;
  question: string;
  guarantee: string;
  artifactHtml: string;
  toolsHtml: string;
  lessonLabel: string;
  targetHtml: string;
  dd: DeepDiveItem[];
}

interface LegacyDict {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  svgAria: string;
  svgNodeAria: {
    radar: string;
    hotspot: string;
    item0: string;
    item1: string;
    item23: string;
    item4: string;
    item5: string;
  };
  svg: {
    annScan: string;
    radarLabel: string;
    hotspotL1: string;
    hotspotL2: string;
    reportTitle: string;
    items: [string, string, string, string, string, string];
    annDefensible: string;
  };
  mapCap: string;
  routeAria: string;
  route: [string, string, string, string, string, string];
  skrotEyebrow: string;
  cards: { num: string; h3: string; p: string }[];
  skrotFinis: string;
  skrotFinisCite: string;
  /** Wspolne etykiety dt w blokach mech lekcji. */
  mechDt: { question: string; guarantee: string; artifact: string; tools: string; lesson: string };
  targetK: string;
  l1: LegacyLesson;
  l2: LegacyLesson;
  l3: LegacyLesson;
  l4: LegacyLesson;
  l5: LegacyLesson;
  next: {
    num: string;
    uni: string;
    h2: string;
    leftMono: string;
    leftLead: string;
    leftMech: { dt: string; link: string; rest: string }[];
    rightMono: string;
    rightLeadHtml: string;
    rightMech: { dt: string; ddHtml: string }[];
    finis: string;
    finisCite: string;
  };
}

export const LEGACY: Record<Lang, LegacyDict> = {
  pl: {
    eyebrow: 'MODUŁ 4 // LEGACY',
    h1Html: 'Decyzje architektoniczne: <span class="glow">dowody</span> zamiast intuicji',
    subHtml:
      'Legacy w <strong>10x Workflow</strong> otwiera blok <strong>10xArchitect</strong>: pięć lekcji buduje <strong>5-elementowy raport architektoniczny</strong> - od architektury kontekstu po okazje DDD. Raport ma być Twój - <strong>obronialny, nie przyjęty na wiarę</strong>. To obszar, którego niemal żaden kurs AI nie rusza.',
    svgAria:
      'Diagram skanu nieznanego terenu: radar z obracającym się ramieniem odsłania bloki modułów deep i shallow, jeden kwadrant pulsuje jako hot spot; sonda przelatuje do panelu raportu architektonicznego z sześcioma pozycjami od zero do pięć, odhaczanymi po kolei',
    svgNodeAria: {
      radar: 'Lekcja 02: mapa projektu - radar skanuje teren, moduły deep i shallow odsłaniane z dowodów',
      hotspot: 'Lekcja 03: hot spots - kwadrant radaru pulsuje tam, gdzie kod pęka najczęściej',
      item0: 'Lekcja 01: skalowanie kontekstu - pozycja zero raportu: architektura kontekstu',
      item1: 'Lekcja 02: mapa projektu - pozycja jeden raportu',
      item23: "Lekcja 03: przegląd feature'a i hot spots - pozycje dwa i trzy raportu",
      item4: 'Lekcja 04: refaktor odwracalny - pozycja cztery raportu: okazje refaktorowe',
      item5: 'Lekcja 05: DDD z agentem - pozycja pięć raportu: okazje DDD',
    },
    svg: {
      annScan: 'skan terenu: dowody, nie foldery',
      radarLabel: 'RADAR // MODUŁY: DEEP VS SHALLOW',
      hotspotL1: 'hot spot: tu kod',
      hotspotL2: 'pęka najczęściej',
      reportTitle: 'RAPORT ARCHITEKTONICZNY',
      items: [
        '⓪ ARCHITEKTURA KONTEKSTU',
        '① MAPA PROJEKTU',
        "② PRZEGLĄD FEATURE'A",
        '③ HOT SPOTS',
        '④ OKAZJE REFAKTOROWE',
        '⑤ OKAZJE DDD',
      ],
      annDefensible: 'raport ma być Twój - obronialny, nie przyjęty na wiarę',
    },
    mapCap: 'SKAN NIEZNANEGO TERENU // KLIKNIJ OBSZAR, BY DOLECIEĆ DO SEKCJI',
    routeAria: 'Lekcje modułu',
    route: [
      '01 · kontekst',
      '02 · mapa projektu',
      '03 · hot spots',
      '04 · refaktor',
      '05 · ddd',
      'Dalej: 10xArchitect',
    ],
    skrotEyebrow: 'Skrót modułu · pięć lekcji w 30 sekund',
    cards: [
      {
        num: 'LEKCJA 01',
        h3: 'Skalowanie kontekstu',
        p: 'Ile kontekstu naraz uniesie agent? Kontekst racjonowany, nie wylewany.',
      },
      {
        num: 'LEKCJA 02',
        h3: 'Mapa projektu',
        p: 'Jak wygląda teren, zanim wejdziesz? Mapa z dowodów, nie z folderów.',
      },
      {
        num: 'LEKCJA 03',
        h3: 'Feature + hot spots',
        p: 'Gdzie kod pęka najczęściej? Ryzyko wskazane z dowodów, nie na wyczucie.',
      },
      {
        num: 'LEKCJA 04',
        h3: 'Refaktor odwracalny',
        p: 'Jak przebudować bez zatrzymywania maszyny? Każdy krok odwracalny i osobno zielony.',
      },
      {
        num: 'LEKCJA 05',
        h3: 'DDD z agentem',
        p: 'Czy model mówi językiem domeny? Granice i język, których zespół potrafi bronić.',
      },
    ],
    skrotFinis: '„Decyzje architektoniczne z dowodów, nie z intuicji."',
    skrotFinisCite: '- fundament 10x Workflow',
    mechDt: {
      question: 'Pytanie',
      guarantee: 'Gwarancja',
      artifact: 'Artefakt',
      tools: 'Narzędzia',
      lesson: 'Lekcja',
    },
    targetK: 'CEL:',
    l1: {
      num: 'LEKCJA 01',
      uniSub: ' · Filtrfrak',
      h2: 'Skalowanie kontekstu - ile kontekstu naraz uniesie agent?',
      epigraphSf:
        '„Filtrfrak nie oddaje pustyni ani kropli. Woda krąży w zamkniętym obiegu i wraca dokładnie tam, gdzie jest potrzebna - kto wylewa zapas na piach, nie zobaczy siczy."',
      epigraphCiteSf: '- mistrz destylarni, nauka przy pierwszym filtrfraku',
      figAria:
        'Schemat zbiornika kontekstu: pełny zbiornik po lewej, zawór racjonujący w środku, po prawej okno agenta dostaje małe dawki kontekstu',
      fig: [
        'ZBIORNIK: CAŁY KONTEKST',
        'CONTEXT/ = SYSTEM-OF-RECORD',
        'ZAWÓR',
        'OKNO AGENTA: TYLKO TA DAWKA',
        'ANI KROPLI NA PIACH',
      ],
      figcaption: 'RYS. 01 // ZAWÓR RACJONUJE: DAWKA KONTEKSTU POD ZADANIE',
      leadSfHtml:
        'Fremen nie pyta, ile wody ma pustynia - pyta, ile wody potrzebuje najbliższy marsz. Filtrfrak działa, bo racjonuje: zamknięty obieg oddaje ciału dokładnie tyle, ile trzeba teraz. Kontekst agenta to ta sama ekonomia. Pytanie w legacy nie brzmi „co agent ma wiedzieć?", tylko <strong>„co agent ma wiedzieć TERAZ?"</strong> - okno kontekstu jest zasobem jak woda na pustyni, a wylany zapas nie wraca.',
      leadNeutralHtml:
        'Okno kontekstu agenta to zasób ograniczony - przeładowany prompt obniża jakość pracy. Pytanie w legacy nie brzmi „co agent ma wiedzieć?", tylko <strong>„co agent ma wiedzieć TERAZ?"</strong>: dawka kontekstu dobrana pod zadanie zamiast wylania wszystkiego naraz.',
      leadHtml:
        'Wejście: repozytorium z kontekstem rozlanym po README, wiki i głowach ludzi. Wyjście: <strong>lean root AGENTS.md</strong> plus <em>context/</em> jako system-of-record - fakty o architekturze mieszkają w plikach, które agent dociąga na żądanie, nie w jednym przeładowanym prompcie. Mechanizm: <em>drabina dojrzałości</em> - od zera do systemu, w którym każda dawka kontekstu ma swoje miejsce i swój moment podania.',
      grunt: 'GRUNT: PARNAS 1972 // MODUŁ UJAWNIA MINIMUM - Z KONTEKSTEM TAK SAMO',
      question: 'ile kontekstu naraz uniesie agent?',
      guarantee: 'kontekst racjonowany, nie wylewany',
      artifactHtml: '<b>lean AGENTS.md</b> + context/ jako system-of-record',
      toolsHtml: '<b>AGENTS.md</b> lean root, context/ foundation, drabina dojrzałości',
      lessonLabel: 'M4·L1: Skalowanie kontekstu dla AI w dużych projektach',
      targetHtml:
        'kluczowy, zanim agent dotknie legacy - <b>okno kontekstu to zasób racjonowany</b>: dawka pod zadanie zamiast wylania wszystkiego naraz.',
      dd: [
        {
          label: 'PO CO',
          body: '<p><b>AGENTS.md jako onboarding agenta</b>: krótki, specyficzny dla repo, z najważniejszymi regułami na górze - przyszły agent czyta go raz i nie blokuje się. Każde zdanie musi wynikać z pliku, komendy albo commita, który skill faktycznie obejrzał.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: repozytorium - manifest, README, konfiguracja lint/test, układ katalogów, 30 ostatnich commitów. Wyjście: jeden plik <code>AGENTS.md</code> („Repository Guidelines") o budżecie <b>200-400 słów</b>; wariant katalogowy jeszcze mniejszy (120-250 słów), bo opisuje reguły jednego katalogu, nie całego repo.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Discovery w ustalonej kolejności, potem ekstrakcja: 1-3 komendy, które agent uruchamia najczęściej, konwencje, które recenzent wytknąłby w PR, twarde zakazy „nigdy nie rób X". Gdy plik już istnieje - <b>edycja chirurgiczna</b>, nie przepisanie: każda linia klasyfikowana jako KEEP / UPDATE / REMOVE / MISSING na podstawie diffu od ostatniego dotknięcia pliku.</p>',
        },
        {
          label: 'ANATOMIA',
          body: '<p>Sekcje uporządkowane według dźwigni, nie tradycji:</p><ul><li>twarde reguły i tripwires - zawsze na górze,</li><li>struktura projektu i komendy build/test/dev,</li><li>styl, nazewnictwo, testy, konwencje commitów.</li></ul><p>Zamiast wklejania konfiguracji - referencje <code>@package.json</code>, <code>@docs/...</code>: dawka kontekstu dociągana na żądanie.</p>',
        },
        {
          label: 'STRAŻNICY JAKOŚCI',
          body: '<p>Pięć twardych bramek przed zapisem: budżet słów, zero wieloliniowych snippetów, <b>każda reguła sprawdzalna na diffie</b> („clean code" i „best practices" wylatują), zero wiedzy, którą agent i tak ma z treningu, reguły krytyczne w pierwszej jednej trzeciej pliku.</p>',
        },
      ],
    },
    l2: {
      num: 'LEKCJA 02',
      uniSub: ' · Sondowanie oceanu',
      h2: 'Mapa projektu - jak wygląda teren, zanim wejdziesz?',
      epigraphSf:
        '„Oceanu nie rozumie nikt i nikt na stacji tego nie udaje. Wysyłamy próbniki, nanosimy zjawiska na mapy - i to mapa mówi, gdzie wolno zejść niżej."',
      epigraphCiteSf: '- notatka solarysty, archiwum stacji badawczej',
      figAria:
        'Schemat sondowania: stacja badawcza po lewej wysyła próbniki, które rozlatują się i wracają; po prawej rośnie mapa modułów deep i shallow',
      fig: [
        'STACJA',
        'PRÓBNIKI: GIT LOG // ZALEŻNOŚCI // STRUKTURA',
        'MAPA: DEEP VS SHALLOW',
        'CORE VS PERIPHERAL // LOAD-BEARING',
      ],
      figcaption: 'RYS. 02 // PRÓBNIKI WRACAJĄ Z MAPĄ MODUŁÓW',
      leadSfHtml:
        'Ocean Solaris badają od stu lat i nikt go nie rozumie - więc solaryści nie udają: wysyłają próbniki, każdy mierzy swój wycinek, a z pomiarów rośnie mapa zjawisk, nie teoria całości. Mapa projektu to ta sama pokora: <strong>szeroki skan, zanim postawisz stopę w kodzie</strong>. Struktura folderów kłamie - mapa ma powstać z dowodów: historii gita, wyszukiwań strukturalnych, grafów zależności.',
      leadNeutralHtml:
        'Mapa projektu to <strong>szeroki skan, zanim postawisz stopę w kodzie</strong>. Struktura folderów kłamie - mapa ma powstać z dowodów: historii gita, wyszukiwań strukturalnych, grafów zależności.',
      leadHtml:
        'Wejście: nieznane repozytorium. Wyjście: <strong>mapa projektu</strong> (pozycja ① raportu) - które moduły są deep, a które shallow, co jest core, co peripheral, co jest load-bearing. Mechanizm: <em>równoległe próbniki</em> - /10x-research wysyła subagentów, git log i churn pokazują, gdzie projekt naprawdę żyje, a graf zależności - co się zawali, gdy pociągniesz nitkę.',
      grunt: 'GRUNT: OUSTERHOUT // DEEP VS SHALLOW - GŁĘBOKOŚĆ MODUŁU, NIE JEGO ROZMIAR',
      question: 'jak wygląda teren, zanim wejdziesz?',
      guarantee: 'mapa z dowodów, nie z folderów',
      artifactHtml: '<b>mapa projektu</b> - pozycja ① raportu',
      toolsHtml: '<b>/10x-research</b>, git log/blame/churn, madge, dependency-cruiser',
      lessonLabel: 'M4·L2: Agent w projekcie legacy - generowanie Mapy projektu',
      targetHtml:
        'kluczowy przy wejściu w cudzy albo stary kod - <b>najpierw mapa z dowodów</b>, dopiero potem pierwszy krok w teren.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Odpowiedzieć dowodami na pytanie o kod projektu: równoległe subagenty przeczesują osobne wymiary, główny agent tylko syntetyzuje. Mapa powstaje z odczytów <code>plik:linia</code>, nie z przeczuć.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: pytanie badawcze plus pliki wskazane przez użytkownika - czytane w całości, <b>zanim</b> ruszy delegacja. Wyjście: <code>research.md</code> w folderze zmiany - samowystarczalny raport z odnośnikami do kodu, wnioskami architektonicznymi i otwartymi pytaniami.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Dekompozycja pytania na obszary → doprecyzowanie zakresu i głębokości → <b>2-4 subagenty równolegle w jednej wiadomości</b>: Explore do szukania plików i wzorców, general-purpose do analizy złożonych systemów. Synteza zaczyna się dopiero, gdy wrócą wszyscy.</p>',
        },
        {
          label: 'ANATOMIA RAPORTU',
          body: '<ul><li>Summary i Detailed Findings per komponent,</li><li>Code References ze ścieżkami i numerami linii,</li><li>Architecture Insights - wzorce i decyzje projektowe,</li><li>kontekst historyczny z <code>context/changes/</code> i <code>context/archive/</code>,</li><li>Open Questions - co wymaga dalszego zbadania.</li></ul>',
        },
        {
          label: 'GRANICE',
          body: '<p>Research jest read-only - subagenty dostają zakaz edycji i obowiązek zwracania referencji <code>plik:linia</code>. Świeży odczyt kodu ma pierwszeństwo; historia zmian to kontekst uzupełniający, nie źródło prawdy.</p>',
        },
      ],
    },
    l3: {
      num: 'LEKCJA 03',
      uniSub: ' · Detektyw na Ceres',
      h2: 'Feature i hot spots - gdzie kod pęka najczęściej?',
      epigraphSf:
        '„Na Ceres nie patroluję ciemnych korytarzy. Chodzę tam, gdzie zbrodnia była już trzy razy - ona wraca w te same miejsca."',
      epigraphCiteSf: '- detektyw stacji Ceres, notatki ze śledztwa',
      figAria:
        'Schemat mapy stacji: siatka korytarzy, ślady zmian wracają w te same punkty, jeden punkt pulsuje jako hot spot',
      fig: [
        'ŚLADY ZMIAN WRACAJĄ W TE SAME MIEJSCA',
        'HOT SPOT',
        'CHANGE COUPLING: CO ZMIENIA SIĘ RAZEM',
        'HOT SPOT = ZŁOŻONOŚĆ × CZĘSTOŚĆ ZMIAN',
      ],
      figcaption: 'RYS. 03 // ZBRODNIA WRACA W TE SAME MIEJSCA',
      leadSfHtml:
        'Detektyw na Ceres nie patroluje całej stacji - wraca tam, gdzie zbrodnia była już trzy razy. Kod pęka według tego samego wzorca: awarie nie rozkładają się równo po repozytorium, wracają w te same miejsca. <strong>Hot spot</strong> to skrzyżowanie dwóch dowodów: złożoności kodu i częstości zmian - tam, gdzie skomplikowane spotyka często dotykane, ryzyko rośnie najszybciej.',
      leadNeutralHtml:
        'Awarie nie rozkładają się równo po repozytorium - wracają w te same miejsca. <strong>Hot spot</strong> to skrzyżowanie dwóch dowodów: złożoności kodu i częstości zmian - tam, gdzie skomplikowane spotyka często dotykane, ryzyko rośnie najszybciej.',
      leadHtml:
        "Wejście: mapa projektu i jeden feature. Wyjście: <strong>przegląd feature'a + hot spots</strong> (pozycje ② i ③ raportu) - przepływ danych end-to-end jednego modułu plus lista miejsc, które pękają najczęściej. Mechanizm: <em>deterministyczne CLI domyka semantykę</em> - ast-grep znajduje wzorce w składni, code-maat liczy change coupling, a observability dokłada dowody z produkcji; agent interpretuje, ale pomiar jest maszynowy.",
      grunt: 'GRUNT: TORNHILL // KOD JAK MIEJSCE ZBRODNI - ZŁOŻONOŚĆ × CZĘSTOŚĆ ZMIAN',
      question: 'gdzie kod pęka najczęściej?',
      guarantee: 'ryzyko wskazane z dowodów, nie na wyczucie',
      artifactHtml: "<b>przegląd feature'a + hot spots</b> - pozycje ② i ③ raportu",
      toolsHtml: '<b>ast-grep</b>, code-maat (change coupling), Sentry/observability',
      lessonLabel: 'M4·L3: Analiza feature z AI',
      targetHtml:
        'kluczowy przed każdą decyzją o refaktorze - <b>ryzyko wskazują dowody</b>: złożoność × częstość zmian, nie przeczucie.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Rozdzielić <b>obserwację</b> od <b>deklarowanej przyczyny</b>, zanim powstanie plan. Perfekcyjny plan na źle postawiony problem to stracony dzień: rozwiązanie trafia w hipotezę, a prawdziwy problem zostaje.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: zgłoszenie w kształcie „bug + proponowany fix", pytanie o zakres albo założenie do sprawdzenia. Wyjście: <code>frame.md</code> - potwierdzone lub przeramowane sformułowanie problemu z poziomem pewności (HIGH / MEDIUM / LOW) i wnioskiem dla /10x-plan.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Obserwacja zostaje zamrożona jako jedyny pewny grunt - wszystko inne to hipotezy. Powstaje mapa wymiarów, z których obserwacja mogła wyniknąć, a równoległe subagenty testują każdy z nich pytaniem: <em>jakich dowodów byśmy się spodziewali, gdyby pękło właśnie tutaj - i czy one istnieją?</em> Na końcu wiodąca hipoteza przechodzi próbę ciśnieniową - ocenia ją także świeży agent, któremu nie zdradza się faworyta.</p>',
        },
        {
          label: 'ANATOMIA BRIEFU',
          body: '<p>Serce briefu to tabela hipoteza / dowód / werdykt (STRONG / WEAK / NONE). Obok: obserwacja, pierwotne założenie zachowane dosłownie, mapa wymiarów, sygnały zawężające i sekcja „co zmienia się dla planu".</p>',
        },
        {
          label: 'ANTYWZORCE',
          body: '<p>Dozwolony wniosek brzmi także „założenie było trafne" - wymuszone przeramowanie jest gorsze niż brak frame\'u. Pewnie brzmiąca hipoteza bez dowodu <code>plik:linia</code> to dokładnie ten błąd, przed którym skill chroni. Pytania zawężające opisują obserwacje, nigdy rozwiązania.</p>',
        },
      ],
    },
    l4: {
      num: 'LEKCJA 04',
      uniSub: ' · Świątynia-maszyna',
      h2: 'Refaktor odwracalny - jak przebudować bez zatrzymywania maszyny?',
      epigraphSf:
        '„Ducha maszyny nie gasimy nigdy. Wyjmij jeden moduł, wstaw nowy, odpraw rytuał powrotu. Jeśli maszyna zamilknie - cofnij krok, nie plan."',
      epigraphCiteSf: '- magos odbudowy, litania wymiany podzespołu',
      figAria:
        'Schemat świątyni-maszyny: rzędy modułów pod dachem świątyni, jeden moduł wymieniany na nowy, po wymianie pulsuje rytualny test powrotu, rdzeń maszyny nie gaśnie',
      fig: [
        'DUCH MASZYNY: NIE GAŚNIE',
        'RYTUAŁ POWROTU = TEST',
        'STRANGLER FIG // MIKADO // ADR',
        'KROK CZERWONY → COFNIJ KROK, NIE PLAN',
      ],
      figcaption: 'RYS. 04 // WYMIANA MODUŁU BEZ GASZENIA MASZYNY',
      leadSfHtml:
        'Świątyni-maszyny nie gasi się nigdy - odbudowa idzie modułem po module: wyjmij jeden podzespół, wstaw nowy, odpraw rytuał powrotu i dopiero wtedy sięgnij po następny. Refaktor legacy to ta sama liturgia: <strong>odwracalna ścieżka zamiast big-bangu</strong>. Wielki przepisujący skok kończy się katastrofą, bo nie ma z niego drogi powrotu - sekwencja małych, osobno zielonych kroków ma ją zawsze.',
      leadNeutralHtml:
        'Refaktor legacy to <strong>odwracalna ścieżka zamiast big-bangu</strong>. Wielki przepisujący skok kończy się katastrofą, bo nie ma z niego drogi powrotu - sekwencja małych, osobno zielonych kroków ma ją zawsze.',
      leadHtml:
        'Wejście: hot spot z dowodami i test chroniący zachowanie - napisany, <strong>zanim ruszy refaktor</strong>. Wyjście: <strong>okazje refaktorowe</strong> (pozycja ④ raportu) plus ADR-y dokumentujące decyzje. Mechanizm: wzorce odwracalności - <em>Strangler Fig</em> (nowe oplata stare, zanim je zastąpi), <em>Branch by Abstraction</em>, <em>metoda Mikado</em> - a /10x-plan tnie ścieżkę na fazy, z których każda kończy się zielenią albo cofnięciem kroku, nie planu.',
      grunt: 'GRUNT: FOWLER + FEATHERS // TEST CHRONIĄCY ZACHOWANIE POWSTAJE PRZED REFAKTOREM',
      question: 'jak przebudować bez zatrzymywania maszyny?',
      guarantee: 'każdy krok odwracalny i osobno zielony',
      artifactHtml: '<b>okazje refaktorowe</b> - pozycja ④ raportu + ADR-y',
      toolsHtml: '<b>/10x-plan</b>, ADR, metoda Mikado, Strangler Fig',
      lessonLabel: 'M4·L4: Refaktoryzacja z Agentem',
      targetHtml:
        'kluczowy, gdy system musi działać w trakcie przebudowy - <b>każdy krok odwracalny i osobno zielony</b>, big-bang zostaje w koszu.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Zamienić zadanie w plan pocięty na fazy z jawnymi kryteriami sukcesu - automatycznymi i manualnymi - zanim powstanie pierwsza linijka kodu. Plan jest kontraktem: implementacja ma się do czego cofnąć.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: opis zadania, opcjonalnie <code>frame.md</code> i <code>research.md</code> - każdy artefakt z wcześniejszych kroków to decyzje już podjęte, więc mniej pytań. Wyjście: <code>plan.md</code> plus <code>plan-brief.md</code> - dwustronicowy skrót z tabelą kluczowych decyzji.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Research repozytorium subagentami → ocena złożoności (LOW / MEDIUM / HIGH) potwierdzona z użytkownikiem → skalowane dopytywanie: 4-15 pytań, każda opcja z rekomendacją oraz jawną siłą i kosztem → akceptacja szkieletu faz → dopiero wtedy pełny plan.</p>',
        },
        {
          label: 'ANATOMIA PLANU',
          body: '<p>Stan obecny, stan docelowy, <b>„czego NIE robimy"</b>, fazy z parą Intent / Contract dla każdej zmiany, kryteria Automated / Manual, na dole sekcja Progress - jedyne miejsce, gdzie żyją checkboxy.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Plan opisuje intencję, nie implementację - snippet kodu tylko przy zmianie nieoczywistej. Zero otwartych pytań w finalnym planie. Po każdej fazie pauza na ludzkie potwierdzenie weryfikacji manualnej, zanim ruszy następna.</p>',
        },
      ],
    },
    l5: {
      num: 'LEKCJA 05',
      uniSub: ' · Model domeny',
      h2: 'DDD z agentem - czy model mówi językiem domeny?',
      epigraphSf:
        '„Model przewiduje zachowanie całej domeny - pod jednym warunkiem: pojęcia muszą być ostre. Jedno rozmyte słowo w równaniu i plan rozjeżdża się o stulecia."',
      epigraphCiteSf: '- wykład wstępny, katedra psychohistorii',
      figAria:
        'Schemat porządkowania domeny: chmura rozmytych pojęć po lewej przechodzi przez model i układa się w dwa ostre bounded contexts po prawej',
      fig: [
        'POJĘCIA: ROZMYTE',
        'MODEL',
        'KONTEKST: MAGAZYN',
        'KONTEKST: PŁATNOŚCI',
        'JEDEN JĘZYK W KAŻDYM KONTEKŚCIE',
      ],
      figcaption: 'RYS. 05 // CHAOS POJĘĆ → OSTRE GRANICE KONTEKSTÓW',
      leadSfHtml:
        'Psychohistoria przewiduje zachowanie całej domeny jednym modelem - ale tylko dlatego, że jej pojęcia są ostre. Jedno rozmyte słowo w równaniu i predykcja rozjeżdża się o stulecia. Model domeny w kodzie podlega temu samemu prawu: <strong>bounded contexts</strong> działają, gdy granice są ostre, a język jednoznaczny - „zamówienie" w magazynie i „zamówienie" w płatnościach to dwa różne pojęcia i mają prawo mieć dwa różne modele.',
      leadNeutralHtml:
        'Model domeny działa, gdy granice są ostre, a język jednoznaczny: <strong>bounded contexts</strong> istnieją po to, żeby to rozdzielenie było jawne - „zamówienie" w magazynie i „zamówienie" w płatnościach to dwa różne pojęcia i mają prawo mieć dwa różne modele.',
      leadHtml:
        'Wejście: chaos pojęć zastanej domeny. Wyjście: <strong>okazje DDD</strong> (pozycja ⑤ raportu) - kandydaci na bounded contexts, glosariusz ubiquitous language, inwarianty, podział na entities i value objects. Mechanizm: <em>AI jako coach DDD</em> - agent prowadzi Event Storming, proponuje granice i nazwy, ale to człowiek broni każdej decyzji; model, którego zespół nie potrafi obronić, nie jest modelem, tylko notatką.',
      grunt: 'GRUNT: EVANS // UBIQUITOUS LANGUAGE - JEDEN JĘZYK OD ROZMOWY PO KOD',
      question: 'czy model mówi językiem domeny?',
      guarantee: 'granice i język, których zespół potrafi bronić',
      artifactHtml: '<b>okazje DDD</b> - pozycja ⑤ raportu + glosariusz',
      toolsHtml: '<b>Event Storming</b>, glosariusz ubiquitous language, bounded contexts',
      lessonLabel: 'M4·L5: Modernizacja legacy z DDD',
      targetHtml:
        'kluczowy, gdy model ma przeżyć dłużej niż sprint - <b>granice i język, których zespół potrafi bronić</b>, przetrwają rotację ludzi i agentów.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Sformalizować terminologię domeny w jeden spójny glosariusz: jedno pojęcie - jedna nazwa. Synonimy i wieloznaczności wyłapane, zanim rozmyją model i oderwą kod od rozmowy.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: rozmowa o domenie - sesja modelowania, dyskusja o wymaganiach. Wyjście: <code>UBIQUITOUS_LANGUAGE.md</code> - tabele terminów z definicjami i aliasami do unikania, relacje, przykładowy dialog i sekcja zgłoszonych wieloznaczności.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Skan rozmowy pod kątem pojęć → wykrycie dwóch klas problemów: <b>to samo słowo dla różnych pojęć</b> i <b>różne słowa dla tego samego pojęcia</b> → stanowczy wybór terminu kanonicznego → jawne flagowanie konfliktów z rekomendacją.</p>',
        },
        {
          label: 'ANATOMIA WPISU',
          body: '<p>Termin, definicja w jednym zdaniu (czym pojęcie JEST, nie co robi), aliasy do unikania. Relacje z kardynalnością: „Invoice należy do dokładnie jednego Customer". Do tego krótki dialog dev / ekspert domeny, który pokazuje granice pojęć w naturalnym użyciu.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Tylko terminy istotne dla eksperta domeny: nazwy modułów, klas i generyczne pojęcia programistyczne (array, endpoint) nie wchodzą, chyba że niosą znaczenie domenowe. Definicje ciasne - maksymalnie jedno zdanie.</p>',
        },
      ],
    },
    next: {
      num: 'DALEJ',
      uni: 'Po 10xBuilderze · 10xArchitect otwarty',
      h2: 'Dalej: 10xArchitect otwarty',
      leftMono: 'BLOK 10XBUILDER // ZA TOBĄ',
      leftLead:
        'Legacy otwiera blok 10xArchitect, ale stoi na wszystkim, co zbudował 10xBuilder: rampa, łańcuch, rygor i tarcza. Cztery strony bloku niżej.',
      leftMech: [
        { dt: 'moduł 1', link: 'Moduł 1: Fundament', rest: ' - od pomysłu do rampy startowej' },
        { dt: 'moduł 2 // csc', link: 'Core Skills Chain', rest: ' - pięć skoków jednej jednostki pracy' },
        { dt: 'skalowanie', link: 'Skalowanie', rest: ' - quality gates, goal, loops' },
        { dt: 'moduł 3', link: 'Moduł 3: Jakość', rest: ' - najpierw ryzyka, nie pliki' },
      ],
      rightMono: '10XARCHITECT // CO DALEJ',
      rightLeadHtml:
        '10xArchitect zaczyna się tam, gdzie kończy się Twój własny kod: <b>dowody zamiast intuicji</b>, raport architektoniczny jako artefakt, którego bronisz. Następny moduł podnosi stawkę z kodu na ludzi.',
      rightMech: [
        { dt: 'zapowiedź', ddHtml: 'teamwork (M5, 10xChampion) - workflow w zespole, nie solo' },
        { dt: 'zasada', ddHtml: 'raport ma być Twój - <b>obronialny, nie przyjęty na wiarę</b>' },
      ],
      finis: '„Blok 10xBuilder za Tobą. 10xArchitect gra w cudzym kodzie - dowodami, nie intuicją."',
      finisCite: '- fundament 10x Workflow',
    },
  },
  en: {
    eyebrow: 'MODULE 4 // LEGACY',
    h1Html: 'Architectural decisions: <span class="glow">evidence</span> instead of intuition',
    subHtml:
      'Legacy in the <strong>10x Workflow</strong> opens the <strong>10xArchitect</strong> block: five lessons build a <strong>5-part architecture report</strong> - from context architecture to DDD opportunities. The report is meant to be yours - <strong>defensible, not taken on faith</strong>. This is territory almost no AI course touches.',
    svgAria:
      'Diagram of scanning unknown terrain: a radar with a rotating arm reveals deep and shallow module blocks, one quadrant pulses as a hot spot; a probe flies over to an architecture report panel with six items from zero to five, checked off one by one',
    svgNodeAria: {
      radar: 'Lesson 02: project map - the radar scans the terrain, deep and shallow modules revealed from evidence',
      hotspot: 'Lesson 03: hot spots - a radar quadrant pulses where the code breaks most often',
      item0: 'Lesson 01: context scaling - report item zero: context architecture',
      item1: 'Lesson 02: project map - report item one',
      item23: 'Lesson 03: feature review and hot spots - report items two and three',
      item4: 'Lesson 04: reversible refactoring - report item four: refactoring opportunities',
      item5: 'Lesson 05: DDD with an agent - report item five: DDD opportunities',
    },
    svg: {
      annScan: 'terrain scan: evidence, not folders',
      radarLabel: 'RADAR // MODULES: DEEP VS SHALLOW',
      hotspotL1: 'hot spot: where the code',
      hotspotL2: 'breaks most often',
      reportTitle: 'ARCHITECTURE REPORT',
      items: [
        '⓪ CONTEXT ARCHITECTURE',
        '① PROJECT MAP',
        '② FEATURE REVIEW',
        '③ HOT SPOTS',
        '④ REFACTORING OPPORTUNITIES',
        '⑤ DDD OPPORTUNITIES',
      ],
      annDefensible: 'the report is meant to be yours - defensible, not taken on faith',
    },
    mapCap: 'UNKNOWN TERRAIN SCAN // CLICK AN AREA TO FLY TO ITS SECTION',
    routeAria: 'Module lessons',
    route: [
      '01 · context',
      '02 · project map',
      '03 · hot spots',
      '04 · refactoring',
      '05 · ddd',
      'Next: 10xArchitect',
    ],
    skrotEyebrow: 'Module recap · five lessons in 30 seconds',
    cards: [
      {
        num: 'LESSON 01',
        h3: 'Context scaling',
        p: 'How much context can the agent carry at once? Context rationed, not poured out.',
      },
      {
        num: 'LESSON 02',
        h3: 'Project map',
        p: 'What does the terrain look like before you step in? A map from evidence, not folders.',
      },
      {
        num: 'LESSON 03',
        h3: 'Feature + hot spots',
        p: 'Where does the code break most often? Risk identified from evidence, not gut feeling.',
      },
      {
        num: 'LESSON 04',
        h3: 'Reversible refactoring',
        p: 'How do you rebuild without stopping the machine? Every step reversible and independently green.',
      },
      {
        num: 'LESSON 05',
        h3: 'DDD with an agent',
        p: 'Does the model speak the language of the domain? Boundaries and language the team can defend.',
      },
    ],
    skrotFinis: '"Architectural decisions from evidence, not from intuition."',
    skrotFinisCite: '- a 10x Workflow cornerstone',
    mechDt: {
      question: 'Question',
      guarantee: 'Guarantee',
      artifact: 'Artifact',
      tools: 'Tools',
      lesson: 'Lesson',
    },
    targetK: 'GOAL:',
    l1: {
      num: 'LESSON 01',
      uniSub: ' · Stillsuit',
      h2: 'Context scaling - how much context can the agent carry at once?',
      epigraphSf:
        '"A stillsuit gives the desert not a single drop. Water moves in a closed loop and returns exactly where it is needed - whoever spills their reserve on the sand will never see the sietch."',
      epigraphCiteSf: '- master of the stills, a lesson at the first stillsuit fitting',
      figAria:
        'Diagram of a context tank: a full tank on the left, a rationing valve in the middle, on the right the agent window receives small doses of context',
      fig: [
        'TANK: ALL THE CONTEXT',
        'CONTEXT/ = SYSTEM-OF-RECORD',
        'VALVE',
        'AGENT WINDOW: THIS DOSE ONLY',
        'NOT A DROP ON THE SAND',
      ],
      figcaption: 'FIG. 01 // THE VALVE RATIONS: A DOSE OF CONTEXT PER TASK',
      leadSfHtml:
        'A Fremen does not ask how much water the desert holds - he asks how much water the next march needs. A stillsuit works because it rations: the closed loop returns to the body exactly as much as it needs right now. Agent context is the same economy. In legacy the question is not "what should the agent know?" but <strong>"what should the agent know NOW?"</strong> - the context window is a resource like water in the desert, and a spilled reserve does not come back.',
      leadNeutralHtml:
        'An agent\'s context window is a limited resource - an overloaded prompt degrades the quality of its work. In legacy the question is not "what should the agent know?" but <strong>"what should the agent know NOW?"</strong>: a dose of context matched to the task instead of pouring everything in at once.',
      leadHtml:
        'Input: a repository with context spilled across READMEs, wikis and people\'s heads. Output: a <strong>lean root AGENTS.md</strong> plus <em>context/</em> as the system-of-record - facts about the architecture live in files the agent pulls in on demand, not in one overloaded prompt. Mechanism: a <em>maturity ladder</em> - from zero to a system where every dose of context has its place and its moment of delivery.',
      grunt: 'GROUNDING: PARNAS 1972 // A MODULE REVEALS THE MINIMUM - SAME WITH CONTEXT',
      question: 'how much context can the agent carry at once?',
      guarantee: 'context rationed, not poured out',
      artifactHtml: '<b>lean AGENTS.md</b> + context/ as the system-of-record',
      toolsHtml: '<b>AGENTS.md</b> lean root, context/ foundation, maturity ladder',
      lessonLabel: 'M4·L1: Scaling context for AI in large projects',
      targetHtml:
        'key before the agent touches legacy - <b>the context window is a rationed resource</b>: a dose per task instead of pouring everything in at once.',
      dd: [
        {
          label: 'WHY',
          body: '<p><b>AGENTS.md as agent onboarding</b>: short, repo-specific, with the most important rules at the top - a future agent reads it once and stays unblocked. Every sentence must follow from a file, a command or a commit the skill actually inspected.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: the repository - manifest, README, lint/test configuration, directory layout, the last 30 commits. Output: a single <code>AGENTS.md</code> file ("Repository Guidelines") with a budget of <b>200-400 words</b>; the per-directory variant is even smaller (120-250 words) because it describes the rules of one directory, not the whole repo.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>Discovery in a fixed order, then extraction: the 1-3 commands the agent runs most often, the conventions a reviewer would flag in a PR, the hard "never do X" rules. When the file already exists - <b>surgical editing</b>, not a rewrite: every line classified as KEEP / UPDATE / REMOVE / MISSING based on the diff since the file was last touched.</p>',
        },
        {
          label: 'ANATOMY',
          body: '<p>Sections ordered by leverage, not tradition:</p><ul><li>hard rules and tripwires - always at the top,</li><li>project structure and build/test/dev commands,</li><li>style, naming, tests, commit conventions.</li></ul><p>Instead of pasting configuration - references like <code>@package.json</code>, <code>@docs/...</code>: a dose of context pulled in on demand.</p>',
        },
        {
          label: 'QUALITY GUARDS',
          body: '<p>Five hard gates before saving: the word budget, zero multi-line snippets, <b>every rule verifiable on a diff</b> ("clean code" and "best practices" get cut), zero knowledge the agent already has from training, critical rules in the first third of the file.</p>',
        },
      ],
    },
    l2: {
      num: 'LESSON 02',
      uniSub: ' · Probing the ocean',
      h2: 'Project map - what does the terrain look like before you step in?',
      epigraphSf:
        '"Nobody understands the ocean and nobody on the station pretends to. We send probes, we chart the phenomena on maps - and it is the map that says where one may descend deeper."',
      epigraphCiteSf: "- a solarist's note, research station archive",
      figAria:
        'Probing diagram: a research station on the left sends out probes that fan out and return; on the right a map of deep and shallow modules grows',
      fig: [
        'STATION',
        'PROBES: GIT LOG // DEPENDENCIES // STRUCTURE',
        'MAP: DEEP VS SHALLOW',
        'CORE VS PERIPHERAL // LOAD-BEARING',
      ],
      figcaption: 'FIG. 02 // THE PROBES RETURN WITH A MAP OF MODULES',
      leadSfHtml:
        'The Solaris ocean has been studied for a hundred years and nobody understands it - so solarists do not pretend: they send out probes, each one measures its own slice, and out of the measurements grows a map of phenomena, not a theory of the whole. The project map is the same humility: <strong>a broad scan before you set foot in the code</strong>. Folder structure lies - the map must come from evidence: git history, structural searches, dependency graphs.',
      leadNeutralHtml:
        'The project map is <strong>a broad scan before you set foot in the code</strong>. Folder structure lies - the map must come from evidence: git history, structural searches, dependency graphs.',
      leadHtml:
        'Input: an unknown repository. Output: a <strong>project map</strong> (report item ①) - which modules are deep and which shallow, what is core, what is peripheral, what is load-bearing. Mechanism: <em>parallel probes</em> - /10x-research sends out subagents, git log and churn show where the project really lives, and the dependency graph shows what collapses when you pull a thread.',
      grunt: "GROUNDING: OUSTERHOUT // DEEP VS SHALLOW - A MODULE'S DEPTH, NOT ITS SIZE",
      question: 'what does the terrain look like before you step in?',
      guarantee: 'a map from evidence, not folders',
      artifactHtml: '<b>project map</b> - report item ①',
      toolsHtml: '<b>/10x-research</b>, git log/blame/churn, madge, dependency-cruiser',
      lessonLabel: 'M4·L2: An agent in a legacy project - generating the Project map',
      targetHtml:
        "key when entering someone else's or old code - <b>first a map from evidence</b>, only then the first step into the terrain.",
      dd: [
        {
          label: 'WHY',
          body: '<p>Answer questions about the project\'s code with evidence: parallel subagents comb through separate dimensions, the main agent only synthesizes. The map is built from <code>file:line</code> readings, not hunches.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: a research question plus the files pointed out by the user - read in full <b>before</b> any delegation starts. Output: <code>research.md</code> in the change folder - a self-contained report with code references, architecture insights and open questions.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>Decompose the question into areas → pin down scope and depth → <b>2-4 subagents in parallel in a single message</b>: Explore for finding files and patterns, general-purpose for analyzing complex systems. Synthesis starts only once they have all returned.</p>',
        },
        {
          label: 'REPORT ANATOMY',
          body: '<ul><li>Summary and Detailed Findings per component,</li><li>Code References with paths and line numbers,</li><li>Architecture Insights - patterns and design decisions,</li><li>historical context from <code>context/changes/</code> and <code>context/archive/</code>,</li><li>Open Questions - what needs further investigation.</li></ul>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>Research is read-only - subagents get a ban on editing and an obligation to return <code>file:line</code> references. A fresh read of the code takes precedence; change history is supplementary context, not the source of truth.</p>',
        },
      ],
    },
    l3: {
      num: 'LESSON 03',
      uniSub: ' · A detective on Ceres',
      h2: 'Feature and hot spots - where does the code break most often?',
      epigraphSf:
        '"On Ceres I do not patrol dark corridors. I go where crime has already struck three times - it returns to the same places."',
      epigraphCiteSf: '- a Ceres station detective, case notes',
      figAria:
        'Station map diagram: a grid of corridors, change traces return to the same points, one point pulses as a hot spot',
      fig: [
        'CHANGE TRACES RETURN TO THE SAME PLACES',
        'HOT SPOT',
        'CHANGE COUPLING: WHAT CHANGES TOGETHER',
        'HOT SPOT = COMPLEXITY × CHANGE FREQUENCY',
      ],
      figcaption: 'FIG. 03 // CRIME RETURNS TO THE SAME PLACES',
      leadSfHtml:
        'A detective on Ceres does not patrol the whole station - he goes back to where crime has already struck three times. Code breaks along the same pattern: failures are not spread evenly across the repository, they return to the same places. A <strong>hot spot</strong> is the intersection of two pieces of evidence: code complexity and change frequency - where the complicated meets the frequently touched, risk grows fastest.',
      leadNeutralHtml:
        'Failures are not spread evenly across the repository - they return to the same places. A <strong>hot spot</strong> is the intersection of two pieces of evidence: code complexity and change frequency - where the complicated meets the frequently touched, risk grows fastest.',
      leadHtml:
        'Input: the project map and one feature. Output: a <strong>feature review + hot spots</strong> (report items ② and ③) - the end-to-end data flow of one module plus a list of the places that break most often. Mechanism: <em>deterministic CLI pins down the semantics</em> - ast-grep finds patterns in the syntax, code-maat computes change coupling, and observability adds evidence from production; the agent interprets, but the measurement is done by machine.',
      grunt: 'GROUNDING: TORNHILL // CODE AS A CRIME SCENE - COMPLEXITY × CHANGE FREQUENCY',
      question: 'where does the code break most often?',
      guarantee: 'risk identified from evidence, not gut feeling',
      artifactHtml: '<b>feature review + hot spots</b> - report items ② and ③',
      toolsHtml: '<b>ast-grep</b>, code-maat (change coupling), Sentry/observability',
      lessonLabel: 'M4·L3: Feature analysis with AI',
      targetHtml:
        'key before every refactoring decision - <b>evidence points to the risk</b>: complexity × change frequency, not a hunch.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Separate the <b>observation</b> from the <b>declared cause</b> before a plan exists. A perfect plan for a mis-stated problem is a lost day: the solution hits the hypothesis, and the real problem stays.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: a report shaped like "bug + proposed fix", a scope question or an assumption to check. Output: <code>frame.md</code> - a confirmed or reframed problem statement with a confidence level (HIGH / MEDIUM / LOW) and a conclusion for /10x-plan.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>The observation gets frozen as the only solid ground - everything else is hypotheses. A map is drawn of the dimensions the observation could have come from, and parallel subagents test each one with the question: <em>what evidence would we expect if it broke exactly here - and does it exist?</em> At the end the leading hypothesis goes through a pressure test - it is also judged by a fresh agent that is not told the favorite.</p>',
        },
        {
          label: 'BRIEF ANATOMY',
          body: '<p>The heart of the brief is a hypothesis / evidence / verdict table (STRONG / WEAK / NONE). Alongside: the observation, the original assumption preserved verbatim, the dimension map, narrowing signals and a "what changes for the plan" section.</p>',
        },
        {
          label: 'ANTI-PATTERNS',
          body: '<p>"The assumption was correct" is also an allowed conclusion - a forced reframe is worse than no frame at all. A confident-sounding hypothesis without <code>file:line</code> evidence is exactly the mistake this skill protects against. Narrowing questions describe observations, never solutions.</p>',
        },
      ],
    },
    l4: {
      num: 'LESSON 04',
      uniSub: ' · Machine temple',
      h2: 'Reversible refactoring - how do you rebuild without stopping the machine?',
      epigraphSf:
        '"The machine spirit is never extinguished. Remove one module, seat the new one, perform the rite of return. If the machine falls silent - revert the step, not the plan."',
      epigraphCiteSf: '- magos of restoration, litany of component replacement',
      figAria:
        'Machine temple diagram: rows of modules under a temple roof, one module being swapped for a new one, after the swap the ritual return test pulses, the machine core never goes dark',
      fig: [
        'MACHINE SPIRIT: NEVER GOES DARK',
        'RITE OF RETURN = TEST',
        'STRANGLER FIG // MIKADO // ADR',
        'RED STEP → REVERT THE STEP, NOT THE PLAN',
      ],
      figcaption: 'FIG. 04 // SWAPPING A MODULE WITHOUT SHUTTING DOWN THE MACHINE',
      leadSfHtml:
        'A machine temple is never shut down - the rebuild goes module by module: remove one component, seat the new one, perform the rite of return, and only then reach for the next. Legacy refactoring is the same liturgy: <strong>a reversible path instead of a big bang</strong>. The great rewrite leap ends in disaster because there is no way back from it - a sequence of small, independently green steps always has one.',
      leadNeutralHtml:
        'Legacy refactoring is <strong>a reversible path instead of a big bang</strong>. The great rewrite leap ends in disaster because there is no way back from it - a sequence of small, independently green steps always has one.',
      leadHtml:
        'Input: a hot spot with evidence and a behavior-protecting test - written <strong>before the refactoring starts</strong>. Output: <strong>refactoring opportunities</strong> (report item ④) plus ADRs documenting the decisions. Mechanism: reversibility patterns - <em>Strangler Fig</em> (the new entwines the old before replacing it), <em>Branch by Abstraction</em>, <em>the Mikado method</em> - and /10x-plan cuts the path into phases, each of which ends in green or in reverting the step, not the plan.',
      grunt: 'GROUNDING: FOWLER + FEATHERS // THE BEHAVIOR-PROTECTING TEST IS WRITTEN BEFORE THE REFACTORING',
      question: 'how do you rebuild without stopping the machine?',
      guarantee: 'every step reversible and independently green',
      artifactHtml: '<b>refactoring opportunities</b> - report item ④ + ADRs',
      toolsHtml: '<b>/10x-plan</b>, ADR, the Mikado method, Strangler Fig',
      lessonLabel: 'M4·L4: Refactoring with an Agent',
      targetHtml:
        'key when the system must keep running during the rebuild - <b>every step reversible and independently green</b>, the big bang goes in the bin.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Turn a task into a plan cut into phases with explicit success criteria - automated and manual - before the first line of code exists. The plan is a contract: the implementation has something to fall back on.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: a task description, optionally <code>frame.md</code> and <code>research.md</code> - every artifact from earlier steps is decisions already made, so fewer questions. Output: <code>plan.md</code> plus <code>plan-brief.md</code> - a two-page summary with a table of key decisions.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>Repository research with subagents → complexity assessment (LOW / MEDIUM / HIGH) confirmed with the user → scaled questioning: 4-15 questions, every option with a recommendation and its explicit strength and cost → acceptance of the phase skeleton → only then the full plan.</p>',
        },
        {
          label: 'PLAN ANATOMY',
          body: '<p>Current state, target state, <b>"what we are NOT doing"</b>, phases with an Intent / Contract pair for every change, Automated / Manual criteria, and a Progress section at the bottom - the only place where checkboxes live.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>The plan describes intent, not implementation - a code snippet only for a non-obvious change. Zero open questions in the final plan. After each phase, a pause for human confirmation of manual verification before the next one starts.</p>',
        },
      ],
    },
    l5: {
      num: 'LESSON 05',
      uniSub: ' · Domain model',
      h2: 'DDD with an agent - does the model speak the language of the domain?',
      epigraphSf:
        '"The model predicts the behavior of the entire domain - on one condition: the concepts must be sharp. One blurry word in the equation and the plan drifts off by centuries."',
      epigraphCiteSf: '- introductory lecture, department of psychohistory',
      figAria:
        'Domain-ordering diagram: a cloud of blurry concepts on the left passes through a model and settles into two sharp bounded contexts on the right',
      fig: [
        'CONCEPTS: BLURRY',
        'MODEL',
        'CONTEXT: WAREHOUSE',
        'CONTEXT: PAYMENTS',
        'ONE LANGUAGE IN EACH CONTEXT',
      ],
      figcaption: 'FIG. 05 // CONCEPT CHAOS → SHARP CONTEXT BOUNDARIES',
      leadSfHtml:
        'Psychohistory predicts the behavior of an entire domain with a single model - but only because its concepts are sharp. One blurry word in the equation and the prediction drifts off by centuries. A domain model in code obeys the same law: <strong>bounded contexts</strong> work when the boundaries are sharp and the language unambiguous - an "order" in the warehouse and an "order" in payments are two different concepts and have the right to two different models.',
      leadNeutralHtml:
        'A domain model works when the boundaries are sharp and the language unambiguous: <strong>bounded contexts</strong> exist to make that separation explicit - an "order" in the warehouse and an "order" in payments are two different concepts and have the right to two different models.',
      leadHtml:
        'Input: the concept chaos of an inherited domain. Output: <strong>DDD opportunities</strong> (report item ⑤) - candidates for bounded contexts, a ubiquitous language glossary, invariants, a split into entities and value objects. Mechanism: <em>AI as a DDD coach</em> - the agent runs Event Storming, proposes boundaries and names, but it is the human who defends every decision; a model the team cannot defend is not a model, just a note.',
      grunt: 'GROUNDING: EVANS // UBIQUITOUS LANGUAGE - ONE LANGUAGE FROM CONVERSATION TO CODE',
      question: 'does the model speak the language of the domain?',
      guarantee: 'boundaries and language the team can defend',
      artifactHtml: '<b>DDD opportunities</b> - report item ⑤ + glossary',
      toolsHtml: '<b>Event Storming</b>, ubiquitous language glossary, bounded contexts',
      lessonLabel: 'M4·L5: Legacy modernization with DDD',
      targetHtml:
        'key when the model has to outlive a sprint - <b>boundaries and language the team can defend</b> survive the rotation of people and agents.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Formalize the domain terminology into one coherent glossary: one concept - one name. Synonyms and ambiguities caught before they blur the model and detach the code from the conversation.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: a conversation about the domain - a modeling session, a requirements discussion. Output: <code>UBIQUITOUS_LANGUAGE.md</code> - term tables with definitions and aliases to avoid, relationships, a sample dialogue and a section of flagged ambiguities.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>Scan the conversation for concepts → detect two classes of problems: <b>the same word for different concepts</b> and <b>different words for the same concept</b> → a firm choice of the canonical term → explicit flagging of conflicts with a recommendation.</p>',
        },
        {
          label: 'ENTRY ANATOMY',
          body: '<p>The term, a one-sentence definition (what the concept IS, not what it does), aliases to avoid. Relationships with cardinality: "an Invoice belongs to exactly one Customer". Plus a short dev / domain-expert dialogue that shows the boundaries of the concepts in natural use.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>Only terms that matter to a domain expert: module names, class names and generic programming concepts (array, endpoint) do not qualify unless they carry domain meaning. Definitions kept tight - one sentence at most.</p>',
        },
      ],
    },
    next: {
      num: 'NEXT',
      uni: 'After 10xBuilder · 10xArchitect open',
      h2: 'Next: 10xArchitect open',
      leftMono: '10XBUILDER BLOCK // BEHIND YOU',
      leftLead:
        'Legacy opens the 10xArchitect block, but it stands on everything 10xBuilder built: the ramp, the chain, the rigor and the shield. The four pages of the block below.',
      leftMech: [
        { dt: 'module 1', link: 'Module 1: Foundation', rest: ' - from idea to launch ramp' },
        { dt: 'module 2 // csc', link: 'Core Skills Chain', rest: ' - five jumps of a single unit of work' },
        { dt: 'scaling', link: 'Scaling', rest: ' - quality gates, goal, loops' },
        { dt: 'module 3', link: 'Module 3: Quality', rest: ' - risks first, not files' },
      ],
      rightMono: '10XARCHITECT // WHAT IS NEXT',
      rightLeadHtml:
        '10xArchitect begins where your own code ends: <b>evidence instead of intuition</b>, the architecture report as an artifact you defend. The next module raises the stakes from code to people.',
      rightMech: [
        { dt: 'up next', ddHtml: 'teamwork (M5, 10xChampion) - the workflow in a team, not solo' },
        { dt: 'principle', ddHtml: 'the report is meant to be yours - <b>defensible, not taken on faith</b>' },
      ],
      finis: '"The 10xBuilder block is behind you. 10xArchitect plays in someone else\'s code - with evidence, not intuition."',
      finisCite: '- a 10x Workflow cornerstone',
    },
  },
};
