/**
 * Slownik strony "Modul 3: Jakosc" (jakosc/JakoscBody). Struktura kluczy
 * odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja inline markup
 * (strong/b/em/a/code) i renderuja sie przez set:html. Pary sf-only /
 * neutral-only zostaja w markupie body - slownik niesie tylko teksty.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

/** Krok panelu DeepDive - ksztalt zgodny z Props.items DeepDive.astro. */
interface DdItem {
  label: string;
  body: string;
}

interface Lesson {
  num: string;
  /** Etykieta uniwersum w sec-uni (sf-only); glyph zostaje w markupie. */
  uniSf: string;
  epigraphSf: string;
  epigraphCiteSf: string;
  figAria: string;
  /** Etykiety <text> w SVG rysunku, w kolejnosci wystepowania w markupie. */
  fig: string[];
  figcaption: string;
  leadSfHtml: string;
  leadNeutralHtml: string;
  leadHtml: string;
  mechQ: string;
  mechG: string;
  mechAHtml: string;
  mechTHtml: string;
  lessonLabel: string;
  targetHtml: string;
}

interface JakoscDict {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  svgAria: string;
  svgNodeAria: { q01: string; q02: string; q03: string; q04: string; q05: string };
  svg: {
    n1Ann: string;
    n1Knum: string;
    n1Sub: string;
    n2Ann: string;
    n2Knum: string;
    n2Sub: string;
    n3PrePush: string;
    n3PreCommit: string;
    n3PerEdit: string;
    n3Ann: string;
    n4Knum: string;
    n5Knum: string;
  };
  mapCap: string;
  routeAria: string;
  route: [string, string, string, string, string, string];
  skrotEyebrow: string;
  sumCards: { num: string; h3: string; p: string }[];
  skrotFinis: string;
  skrotFinisCite: string;
  mechLabels: { q: string; g: string; a: string; t: string; l: string };
  targetK: string;
  q1: Lesson & { h2: string };
  q2: Lesson & { h2: string };
  q3: Lesson & { h2: string };
  q4: Lesson & { h2Pre: string; h2Sf: string; h2Neutral: string; h2Post: string };
  q5: Lesson & { h2Pre: string; h2Sf: string; h2Neutral: string; h2Post: string };
  dd1: DdItem[];
  dd2: DdItem[];
  dd4: DdItem[];
  next: {
    num: string;
    uni: string;
    h2: string;
    mono1: string;
    leadSfHtml: string;
    leadNeutralHtml: string;
    m1Dt: string;
    m1Link: string;
    m1Rest: string;
    m2Dt: string;
    m2Link: string;
    m2Rest: string;
    m3Dt: string;
    m3Link: string;
    m3Rest: string;
    mono2: string;
    leadHtml: string;
    zapDt: string;
    zapDd: string;
    zasDt: string;
    zasDdHtml: string;
    finis: string;
    finisCite: string;
  };
}

export const JAKOSC: Record<Lang, JakoscDict> = {
  pl: {
    eyebrow: 'MODUŁ 3 // JAKOŚĆ',
    h1Html: 'Najpierw <span class="glow">ryzyka</span>, nie pliki',
    subHtml:
      'Jakość w <strong>10x Workflow</strong>: pięć lekcji o tym, jak chronić najgroźniejsze scenariusze testem, którego <strong>asercja realnie pada</strong> - plan testów, wyrocznia i mutacja, warstwy hooków, przelot E2E i debugowanie z dowodów. Zielony test, który nie pada po zepsuciu, niczego nie pilnuje.',
    svgAria:
      'Diagram mapy ryzyk pod tarczą: siatka wpływ na prawdopodobieństwo z pulsującym kwadrantem wysoki-wysoki, strzałka do zielonej tarczy-testu, wokół trzy łuki warstw obrony per-edit, pre-commit, pre-push; dioda-błąd gaśnie na najtańszej warstwie',
    svgNodeAria: {
      q01: 'Lekcja 01: plan testów - mapa ryzyk wpływ na prawdopodobieństwo; kwadrant wysoki-wysoki idzie pod ochronę pierwszy',
      q02: 'Lekcja 02: od planu do testów - z kwadrantu ryzyka do tarczy-testu, którego asercja realnie pada',
      q03: 'Lekcja 03: hooki i triggery - trzy warstwy obrony per-edit, pre-commit, pre-push; błąd gaśnie na najtańszej',
      q04: 'Lekcja 04: testy E2E - pełny przelot end-to-end przez wszystkie moduły',
      q05: 'Lekcja 05: debugowanie - diagnoza z wielu źródeł naraz',
    },
    svg: {
      n1Ann: 'co zabija projekt najpierw?',
      n1Knum: 'MAPA RYZYK',
      n1Sub: 'wpływ × prawdopodobieństwo',
      n2Ann: 'najgroźniejszy scenariusz',
      n2Knum: 'TARCZA-TEST',
      n2Sub: 'asercja, która realnie pada',
      n3PrePush: 'PRE-PUSH',
      n3PreCommit: 'PRE-COMMIT',
      n3PerEdit: 'PER-EDIT // NAJTAŃSZA',
      n3Ann: 'dioda-błąd gaśnie na najtańszej warstwie',
      n4Knum: 'E2E // PEŁNY PRZELOT',
      n5Knum: 'DEBUG // WIELE ŹRÓDEŁ',
    },
    mapCap: 'MAPA RYZYK POD TARCZĄ // KLIKNIJ OBSZAR, BY DOLECIEĆ DO SEKCJI',
    routeAria: 'Lekcje modułu',
    route: [
      '01 · plan testów',
      '02 · plan → testy',
      '03 · hooki',
      '04 · e2e',
      '05 · debugowanie',
      'Dalej: blok domknięty',
    ],
    skrotEyebrow: 'Skrót modułu · pięć lekcji w 30 sekund',
    sumCards: [
      {
        num: 'LEKCJA 01',
        h3: 'Plan testów',
        p: 'Co zabija projekt najpierw? Najgroźniejsze scenariusze chronione najpierw.',
      },
      {
        num: 'LEKCJA 02',
        h3: 'Od planu do testów',
        p: 'Skąd test wie, co jest poprawne? Asercja, która realnie pada na zepsutym kodzie.',
      },
      {
        num: 'LEKCJA 03',
        h3: 'Hooki i triggery',
        p: 'Co łapie błąd, zanim go zobaczysz? Dryf wykryty sekundy po powstaniu.',
      },
      {
        num: 'LEKCJA 04',
        h3: 'Testy E2E',
        p: 'Czy całość naprawdę leci? Przelot tam, gdzie unit by skłamał.',
      },
      {
        num: 'LEKCJA 05',
        h3: 'Debugowanie',
        p: 'Co mówią wszystkie przyrządy naraz? Diagnoza z dowodów, nie z przeczucia.',
      },
    ],
    skrotFinis:
      '„Najpierw ryzyka, nie pliki - chroń najgroźniejsze scenariusze testem, którego asercja realnie pada."',
    skrotFinisCite: '- fundament 10x Workflow',
    mechLabels: { q: 'Pytanie', g: 'Gwarancja', a: 'Artefakt', t: 'Narzędzia', l: 'Lekcja' },
    targetK: 'CEL:',
    q1: {
      num: 'LEKCJA 01',
      uniSf: 'Diuna · Fremeni',
      h2: 'Plan testów - co zabija projekt najpierw?',
      epigraphSf:
        '„Pustynia zabija w znanej kolejności: najpierw pragnienie, potem burza, na końcu czerw. Kto wychodzi z siczy bez tej mapy, nie wraca."',
      epigraphCiteSf: '- nauka Fremenów, przed wyjściem z siczy',
      figAria:
        'Schemat siatki ryzyk: oś wpływu i prawdopodobieństwa, hot-spot w kwadrancie wysoki-wysoki, z niego strzałka do dokumentu test-plan.md',
      fig: [
        'PRAWDOPODOBIEŃSTWO →',
        'WPŁYW →',
        'CHRONIONE NAJPIERW',
        'TEST-PLAN.MD',
        'RYZYKO = AWARIA U USERA',
      ],
      figcaption: 'RYS. 01 // MAPA RYZYK: WPŁYW × PRAWDOPODOBIEŃSTWO',
      leadSfHtml:
        'Fremeni nie wychodzą z siczy z listą rzeczy do zrobienia - wychodzą z mapą tego, co zabija. Pustynia jest przewidywalna w swojej wrogości: każde zagrożenie ma znaną wagę i znaną częstość. Plan testów przenosi ten rygor na projekt: zamiast pokrywać pliki po kolei, mapuje ryzyka na osi <strong>wpływ × prawdopodobieństwo</strong>, a każde ryzyko opisuje jako awarię u usera - „koszyk gubi pozycje przy odświeżeniu", nie „brak testów w cart.ts".',
      leadNeutralHtml:
        'Plan testów zaczyna od mapy tego, co zabija projekt, a nie od listy plików: mapuje ryzyka na osi <strong>wpływ × prawdopodobieństwo</strong>, a każde ryzyko opisuje jako awarię u usera - „koszyk gubi pozycje przy odświeżeniu", nie „brak testów w cart.ts".',
      leadHtml:
        'Wejście: działający produkt i PRD. Wyjście: <strong>context/foundation/test-plan.md</strong> - mapa ryzyk pocięta na fazy rolloutu, od najgroźniejszych scenariuszy w dół. Mechanizm: <em>/10x-test-plan</em> orkiestruje dowiezienie testów, nie pisze ich sam - każdą fazę prowadzi przez łańcuch (research → plan → implement), a ponowne uruchomienie wznawia od następnej fazy zamiast zaczynać od zera.',
      mechQ: 'co zabija projekt najpierw?',
      mechG: 'najgroźniejsze scenariusze chronione najpierw',
      mechAHtml: '<b>test-plan.md</b> w context/foundation/',
      mechTHtml: '<b>/10x-test-plan</b> → łańcuch: research → plan → implement',
      lessonLabel: 'M3·L1: Plan testów z AI',
      targetHtml:
        'kluczowy, zanim powstanie pierwszy test - <b>kolejność pisania testów wyznacza mapa ryzyk</b>, nie struktura katalogów.',
    },
    q2: {
      num: 'LEKCJA 02',
      uniSf: 'Problem trzech ciał · Eksperyment',
      h2: 'Od planu do testów - skąd test wie, co jest poprawne?',
      epigraphSf:
        '„Nie pytaj teorii, czy ma rację. Zepsuj układ i patrz, czy przyrząd krzyknie - pomiar rozstrzyga, nie wiara."',
      epigraphCiteSf: '- protokół eksperymentu, dziennik zespołu badawczego',
      figAria:
        'Schemat eksperymentu: celowo zepsuty układ podłączony do przyrządu pomiarowego, który zapala czerwony sygnał',
      fig: [
        'UKŁAD: ZEPSUTY CELOWO',
        'PRZYRZĄD = TEST',
        'CZERWIEŃ',
        'WYROCZNIA: Z WYMAGAŃ, NIE Z KODU',
        'ZIELONY, KTÓRY NIE PADA, NICZEGO NIE PILNUJE',
      ],
      figcaption: 'RYS. 02 // MUTATION CHECK: ZEPSUJ I POTWIERDŹ CZERWIEŃ',
      leadSfHtml:
        'W „Problemie trzech ciał" spory rozstrzyga eksperyment: teoria, której nie da się zmierzyć, jest tylko opinią. Test ma tę samą naturę - to, co poprawne, musi znać z <strong>wyroczni zbudowanej z wymagań i researchu</strong>, nie z kodu, który sprawdza. Test odczytujący oczekiwaną wartość z implementacji tylko ją powiela - przyklepie każdy bug, który już tam mieszka. Stąd antywzorce do wytępienia: asercje spisane z kodu, snapshoty bez zrozumienia, mocki testujące mocki.',
      leadNeutralHtml:
        'To, co poprawne, test musi znać z <strong>wyroczni zbudowanej z wymagań i researchu</strong>, nie z kodu, który sprawdza. Asercja spisana z implementacji tylko ją powiela - przyklepie każdy bug, który już tam mieszka; stąd antywzorce do wytępienia: asercje spisane z kodu, snapshoty bez zrozumienia, mocki testujące mocki.',
      leadHtml:
        'Wejście: jedno ryzyko z test-plan.md. Wyjście: test, którego <strong>asercja realnie pada na zepsutym kodzie</strong>. Mechanizm: <em>mutation check</em> - zepsuj chronione zachowanie celowo i potwierdź czerwień; jeśli przyrząd nie krzyczy po sabotażu, niczego nie mierzy. <em>/10x-tdd</em> wymusza tę kolejność od początku: czerwony test przed kodem, zieleń jako dowód, refactor na osłoniętym gruncie.',
      mechQ: 'skąd test wie, co jest poprawne?',
      mechG: 'asercja, która realnie pada na zepsutym kodzie',
      mechAHtml: '<b>test chroniący ryzyko</b> + potwierdzona czerwień',
      mechTHtml: '<b>/10x-tdd</b>, mutation / deliberate-break check',
      lessonLabel: 'M3·L2: Od planu do testów',
      targetHtml:
        'kluczowy przy każdym teście pisanym przez agenta - <b>wyrocznia pochodzi z wymagań</b>, a dowodem jakości testu jest jego czerwień na zepsutym kodzie.',
    },
    q3: {
      num: 'LEKCJA 03',
      uniSf: 'Star Wars · Tarcze deflektorowe',
      h2: 'Hooki i triggery - co łapie błąd, zanim go zobaczysz?',
      epigraphSf:
        '„Najpierw pracuje tania osłona zewnętrzna, potem deflektory, na końcu pancerz. Ogień, który dochodzi do kadłuba, to porażka wszystkich warstw."',
      epigraphCiteSf: '- oficer sekcji tarcz, odprawa przed bitwą',
      figAria:
        'Schemat trzech koncentrycznych łuków tarcz wokół kodu: nadlatujący błąd gaśnie na najtańszej, zewnętrznej warstwie per-edit',
      fig: [
        'KOD',
        'PRE-PUSH',
        'PRE-COMMIT',
        'PER-EDIT // NAJTAŃSZA',
        'DRYF ŁAPANY SEKUNDY PO POWSTANIU',
        'IM DALEJ OD KODU, TYM DROŻSZY BŁĄD',
      ],
      figcaption: 'RYS. 03 // BŁĄD GAŚNIE NA NAJTAŃSZEJ WARSTWIE',
      leadSfHtml:
        'Krążownik nie przyjmuje ognia na pancerz kadłuba - od tego są tarcze deflektorowe, warstwa za warstwą, od najtańszej na zewnątrz po najdroższą przy poszyciu. Obrona jakości działa tak samo i jest <strong>uporządkowana według kosztu</strong>: per-edit (lint i typecheck sekundy po zapisie) → pre-commit → pre-push. Im dalej błąd doleci, tym droższe jest jego zestrzelenie.',
      leadNeutralHtml:
        'Obrona jakości jest <strong>uporządkowana według kosztu</strong>: per-edit (lint i typecheck sekundy po zapisie) → pre-commit → pre-push. Im później błąd zostanie wykryty, tym droższa jest jego naprawa.',
      leadHtml:
        'Wejście: reguły jakości projektu - lint, typecheck, szybkie testy. Wyjście: <strong>hooki zapięte na zdarzenia</strong> - per-edit, pre-commit i pre-push, każdy z własnym budżetem czasu. Mechanizm: <em>self-checking pipeline</em> - dryf jest wykrywany sekundy po powstaniu, w tle, bez udziału człowieka; do końca fazy dolatuje już tylko to, czego żadna warstwa nie mogła złapać wcześniej.',
      mechQ: 'co łapie błąd, zanim go zobaczysz?',
      mechG: 'dryf wykryty sekundy po powstaniu, nie na końcu fazy',
      mechAHtml: '<b>hooki per-edit / pre-commit / pre-push</b> w repo',
      mechTHtml: '<b>hooki</b> (PostToolUse, pre-commit, pre-push), lint, typecheck',
      lessonLabel: 'M3·L3: Hooki i triggery',
      targetHtml:
        'kluczowy przy pracy z agentem, który generuje kod szybciej, niż czytasz - <b>błąd ma zgasnąć na najtańszej warstwie</b>, zanim dotknie historii gita.',
    },
    q4: {
      num: 'LEKCJA 04',
      uniSf: 'The Expanse · Lot testowy Rocinante',
      h2Pre: 'Testy E2E - czy całość naprawdę ',
      h2Sf: 'leci',
      h2Neutral: 'działa',
      h2Post: '?',
      epigraphSf:
        '„Makieta w doku nie powie ci, czy statek leci. Wyprowadź go, odpal silniki i czytaj przyrządy w locie."',
      epigraphCiteSf: '- mechanik pokładowy, przed lotem testowym',
      figAria:
        'Schemat lotu testowego: trajektoria przelotu przez moduły UI, API i dane, od seedu po pełny przelot end-to-end',
      fig: [
        'UI',
        'API',
        'DANE',
        'SEED: DANE POD PRZELOT',
        'E2E TYLKO TAM, GDZIE MOCK BY SKŁAMAŁ',
        'PEŁNY PRZELOT, NIE DOK',
      ],
      figcaption: 'RYS. 04 // LOT TESTOWY: PRZEZ WSZYSTKIE MODUŁY, NIE W DOKU',
      leadSfHtml:
        'Rocinante nie dowiodła, że lata, na schematach w doku - dowiodła tego lotem testowym: silniki, nawigacja, kadłub i załoga naraz, w próżni. Test E2E to ten sam manewr: <strong>przelot przez wszystkie moduły naraz</strong> - UI, API, dane - dokładnie tam, gdzie mock by skłamał. Obowiązuje zasada najtańszego testu dającego sygnał: jeśli unit wystarcza, E2E jest przepychem; jeśli unit kłamie, E2E jest jedynym uczciwym pomiarem. Coverage nie jest celem - celem jest sygnał.',
      leadNeutralHtml:
        'Test E2E to <strong>przejście przez wszystkie moduły naraz</strong> - UI, API, dane - dokładnie tam, gdzie mock by skłamał. Obowiązuje zasada najtańszego testu dającego sygnał: jeśli unit wystarcza, E2E jest przepychem; coverage nie jest celem, celem jest sygnał.',
      leadHtml:
        'Wejście: działająca aplikacja i ryzyko z planu, którego nie pokryje nic tańszego. Wyjście: <strong>testy Playwright + seed test</strong> przygotowujący dane pod przelot. Mechanizm: <em>/10x-e2e</em> prowadzi ryzyko przez plan → generate → review → verify na uruchomionej aplikacji, multimodalnie - agent czyta DOM i patrzy na zrzuty ekranu jednocześnie, więc widzi też to, czego selektor nie złapie.',
      mechQ: 'czy całość naprawdę leci?',
      mechG: 'przelot end-to-end tam, gdzie unit by skłamał',
      mechAHtml: '<b>testy Playwright</b> + seed test',
      mechTHtml: '<b>/10x-e2e</b>, Playwright CLI/MCP (DOM + vision)',
      lessonLabel: 'M3·L4: Testy E2E',
      targetHtml:
        'kluczowy dla ścieżek krytycznych - logowanie, płatność, zapis danych - <b>E2E tylko tam, gdzie mock by skłamał</b>, nie do gonienia coverage.',
    },
    q5: {
      num: 'LEKCJA 05',
      uniSf: 'Hyperion · Pielgrzymi',
      h2Pre: 'Debugowanie - co mówią wszystkie ',
      h2Sf: 'przyrządy',
      h2Neutral: 'źródła',
      h2Post: ' naraz?',
      epigraphSf:
        '„Każdy z nas niesie inną opowieść i żadna z osobna niczego nie wyjaśnia. Prawda leży tam, gdzie opowieści się przecinają."',
      epigraphCiteSf: '- zasada pielgrzymów, w drodze do Grobowców Czasu',
      figAria:
        'Schemat syntezy dowodów: cztery źródła - Sentry, logi, konsola, network - zbiegają w jeden punkt diagnozy',
      fig: [
        'SENTRY',
        'WRANGLER LOGS',
        'CONSOLE',
        'NETWORK',
        'PRZECIĘCIE OPOWIEŚCI',
        'DIAGNOZA',
        'ŻADNE ŹRÓDŁO SAMO NIE WYSTARCZA',
        'TRY/CATCH → 200 = POŁKNIĘTY DOWÓD',
      ],
      figcaption: 'RYS. 05 // WIELE OPOWIEŚCI, JEDNA DIAGNOZA',
      leadSfHtml:
        'Pielgrzymi w drodze do Grobowców Czasu docierają do prawdy tylko dlatego, że każdy opowiada własną historię - żadna z osobna niczego nie wyjaśnia, wszystkie naraz wskazują to samo miejsce. Debugowanie z agentem działa identycznie: <strong>synteza dowodów z wielu źródeł</strong> - Sentry z produkcji, wrangler logs z backendu, konsola i network z Playwrighta - zamiast mistrzostwa w jednym narzędziu.',
      leadNeutralHtml:
        'Debugowanie z agentem to <strong>synteza dowodów z wielu źródeł naraz</strong> - Sentry z produkcji, wrangler logs z backendu, konsola i network z Playwrighta - zamiast mistrzostwa w jednym narzędziu. Żadne źródło z osobna niczego nie wyjaśnia; wszystkie naraz wskazują to samo miejsce.',
      leadHtml:
        'Wejście: objaw - błąd u usera, czerwony test, alert. Wyjście: <strong>diagnoza poparta dowodami</strong> i naprawa przypięta testem, żeby regresja nie wróciła. Mechanizm: zbierz odczyty wszystkich przyrządów naraz i szukaj przecięcia opowieści; po drodze wytęp połykanie błędów - <em>try/catch zwracający 200</em> to zamiatanie dowodów (OWASP A10:2025), przez które następna diagnoza zaczyna od zera.',
      mechQ: 'co mówią wszystkie przyrządy naraz?',
      mechG: 'diagnoza z dowodów, nie z przeczucia',
      mechAHtml: '<b>diagnoza</b> + test przypinający naprawę',
      mechTHtml: '<b>Sentry MCP</b>, wrangler logs, Playwright console/network',
      lessonLabel: 'M3·L5: Debugowanie z AI',
      targetHtml:
        'kluczowy, gdy objaw i przyczyna mieszkają w różnych warstwach - <b>diagnozę stawia przecięcie źródeł</b>, nie pierwsze podejrzenie.',
    },
    dd1: [
      {
        label: 'Po co',
        body: '<p>Orkiestrator, nie autor testów: pisze <code>context/foundation/test-plan.md</code> jako fazową strategię rolloutu i prowadzi każdą fazę przez łańcuch: nowa zmiana → research → plan → implement. Ponowne uruchomienie odczytuje stan z dysku i wznawia od pierwszej niedomkniętej fazy.</p>',
      },
      {
        label: 'Wejście → wyjście',
        body: '<p>Wejście: PRD, roadmapa, archiwum zmian, skan hot-spotów z historii gita (ostatnie 30 dni) i wywiad z użytkownikiem - pięć pytań o realne obawy, wcześniejsze wpadki i miejsca zmieniane bez pewności. Wyjście: mapa ryzyk <b>wpływ × prawdopodobieństwo</b> pocięta na fazy rolloutu ze statusami.</p>',
      },
      {
        label: 'Dowody, nie kotwice',
        body: '<p>Każde ryzyko cytuje dowód: linię PRD, odpowiedź z wywiadu, katalog o wysokim churnie. Nigdy <code>plik:linia</code> - kotwice w kodzie znajduje dopiero research w ramach konkretnej fazy, na aktualnym kodzie. Ryzyko to scenariusz awarii u usera, nie lokalizacja w repo.</p>',
      },
      {
        label: 'Koszt × sygnał',
        body: '<p>Dla każdego ryzyka plan niesie wskazówki odpowiedzi:</p><ul><li>co by dowiodło ochrony (zachowanie, nie „pokryj moduł"),</li><li>jakie oczywiste założenie trzeba podważyć,</li><li>najtańsza warstwa testu, która daje realny sygnał,</li><li>antywzorzec do uniknięcia - najgroźniejszy to <b>wyrocznia spisana z implementacji</b>: taki test przyklepuje bieżące bugi.</li></ul>',
      },
      {
        label: 'Soczewka nadużyć',
        body: '<p>Jeśli produkt ma logowanie, płatności albo przyjmuje dane od użytkownika, mapa musi zawierać co najmniej jeden scenariusz nadużycia: kontrola własności zasobu, walidacja po stronie serwera, wyciek sekretów lub danych, nadużycie zasobów. Happy path nie zawiera atakującego, więc te ryzyka nie wypłyną same z wywiadu.</p>',
      },
      {
        label: 'Granice',
        body: '<p>Nie pisze kodu testów, nie konfiguruje hooków ani CI - to robota faz rolloutu. Nie wymyśla ryzyk: każde musi się wywodzić z PRD, roadmapy, archiwum, hot-spotów albo wywiadu. Jeden test do jednego pliku to teren <b>/10x-tdd</b>, nie rollout.</p>',
      },
    ],
    dd2: [
      {
        label: 'Po co',
        body: '<p>Test-first brat <b>/10x-implement</b>: prowadzi fazy zatwierdzonego planu przez pętlę <b>czerwony → zielony → refactor</b>. Padający test powstaje przed kodem produkcyjnym - wyrocznia fizycznie nie może zostać spisana z implementacji, bo tej jeszcze nie ma.</p>',
      },
      {
        label: 'Bramka wejścia',
        body: '<p>Przed każdą fazą dwa pytania: czy implementacja jeszcze <b>nie istnieje</b> i czy fazę da się poprowadzić padającym testem. Istniejący kod - stop i przekierowanie do <b>/10x-implement</b>, bo testy dopisane po fakcie to nie TDD. Scaffolding, config, infra, szlif wizualny - też przekierowanie: tam padający test niczego nie prowadzi.</p>',
      },
      {
        label: 'RED',
        body: '<p>Jeden test na jedno zachowanie, nazwany od wyniku („zwraca 429 po przekroczeniu limitu"), asercje o wynikach, nie o wnętrznościach. Test musi spaść <b>z właściwego powodu</b>: brakującego zachowania, nie błędu składni w samym teście. Pomijanie testu przez <code>it.skip</code>, żeby „przeszło", jest zakazane - czerwień to sedno.</p>',
      },
      {
        label: 'GREEN i REFACTOR',
        body: '<p>Najmniejszy kod produkcyjny, który gasi czerwień - bez budowania na zapas, przyszłe zachowania dostaną własny krok RED. Potem porządki przy zielonym teście: nazwy, duplikacja, typy - bez zmiany zachowania. Budżet: <b>2-5 testów na fazę</b>, te, które łapią realne regresje; nie test na getter.</p>',
      },
      {
        label: 'Antywzorce',
        body: '<p>Testowanie detali implementacji (prywatny stan, kolejność wywołań), over-mocking (gdy wszystko jest mockiem, testujesz mocki), snapshoty dla logiki biznesowej, prawie-duplikaty pod różnymi nazwami. I żelazna zasada: <b>commit tylko na zielono</b> - nigdy przy czerwonym albo pominiętym teście.</p>',
      },
    ],
    dd4: [
      {
        label: 'Po co',
        body: '<p>Prowadzi fazy planu wymagające przeglądarki <b>jedno ryzyko na raz</b> przez pętlę plan → generate → review → verify. Agent wygeneruje przechodzący test E2E w sekundy; trudne jest to, żeby test chronił realne ryzyko i przeżył jutrzejszy refactor - i właśnie tę pracę wykonuje ta pętla.</p>',
      },
      {
        label: 'Bramka wejścia',
        body: '<p>Trzy warunki naraz: ryzyko naprawdę wymaga przeglądarki (przecina auth, routing, API i dane albo istnieje tylko w wyrenderowanym UI), feature jest już zbudowany i uruchamialny, a test dla tego ryzyka jeszcze nie istnieje. Wszystko inne - przekierowanie do <b>/10x-tdd</b> albo <b>/10x-implement</b>: E2E to najdroższa i najbardziej krucha warstwa.</p>',
      },
      {
        label: 'Dwie dźwignie',
        body: '<p>Testów E2E nie generuje się od zera. Jakości pilnują dwie dźwignie: <code>seed.spec.ts</code> - wzorcowy test, na którym modelowany jest każdy następny (co pokażesz, to dostaniesz), oraz plik reguł E2E czytany przed generowaniem. Prompt niesie tylko to, czego dźwignie nie zakodują: konkretne ryzyko, flow i granice real vs mock.</p>',
      },
      {
        label: 'Mechanizm',
        body: '<p>Agent widzi <b>drzewo dostępności</b> (role, nazwy, stany), nie piksele - stąd naturalnie lokatory <code>getByRole</code>, nie selektory CSS. Granice wewnętrzne (auth, routing, baza) zostają prawdziwe, bo tam mieszka ryzyko integracji; mockuje się wyłącznie drogie lub niedeterministyczne zewnętrzne API, na warstwie sieci.</p>',
      },
      {
        label: 'Review: 5 antywzorców',
        body: '<p>Wygenerowanego testu nie przyjmuje się na słowo. Przegląd łapie pięć antywzorców: halucynowana asercja, kruchy selektor, współdzielony stan, czekanie na czas zamiast na stan, brak sprzątania. Poprawka to <b>re-prompt po nazwie antywzorca</b>: co jest źle, czemu nie chroni ryzyka, jaki wzorzec ma to zastąpić - nigdy ogólne „napraw ten test".</p>',
      },
      {
        label: 'Verify',
        body: '<p>Zielony wynik to za mało. Pytanie kontrolne: czy test spadnie, gdy ryzyko z planu naprawdę się zmaterializuje? Dowodem jest <b>deliberate break</b>: celowe zepsucie chronionego zachowania i potwierdzona czerwień, potem natychmiastowy powrót do stanu sprzed zepsucia. Budżet: jeden test na ryzyko, rzadko więcej niż 1-3 na fazę.</p>',
      },
    ],
    next: {
      num: 'DALEJ',
      uni: 'Jakość domyka blok · 10xBuilder',
      h2: 'Dalej: blok domknięty',
      mono1: 'BLOK 10XBUILDER // FUNDAMENT → ŁAŃCUCH → JAKOŚĆ',
      leadSfHtml:
        'Jakość domyka blok 10xBuilder. Fundament stawia rampę, łańcuch lata jednostkami pracy, skalowanie podnosi rygor i autonomię, a jakość pilnuje, żeby to, co lata, nie spadało.',
      leadNeutralHtml:
        'Jakość domyka blok 10xBuilder. Fundament przygotowuje projekt, łańcuch dowozi jednostki pracy, skalowanie podnosi przepustowość i autonomię, a jakość pilnuje, żeby poziom nie spadał, gdy tempo rośnie.',
      m1Dt: 'moduł 1',
      m1Link: 'Moduł 1: Fundament',
      m1Rest: ' - od pomysłu do rampy startowej',
      m2Dt: 'moduł 2 // csc',
      m2Link: 'Core Skills Chain',
      m2Rest: ' - pięć skoków jednej jednostki pracy',
      m3Dt: 'skalowanie',
      m3Link: 'Skalowanie',
      m3Rest: ' - quality gates, goal, loops',
      mono2: 'MODUŁ 4 // LEGACY',
      leadHtml:
        'Dalej gra toczy się w cudzym kodzie: <b>10xArchitect</b> otwiera moduł o legacy - zastane systemy, brak testów, archeologia decyzji. Wszystko, czego ten moduł nauczył cię na własnym kodzie, wraca tam ze zdwojoną stawką.',
      zapDt: 'zapowiedź',
      zapDd: 'legacy (M4, 10xArchitect) - praca w zastanych systemach',
      zasDt: 'zasada',
      zasDdHtml: 'w legacy test chroniący zachowanie powstaje, <b>zanim ruszy refactor</b>',
      finis:
        '„Blok 10xBuilder domknięty: rampa, łańcuch, tarcza. Dalej lata się w cudzym kodzie."',
      finisCite: '- fundament 10x Workflow',
    },
  },
  en: {
    eyebrow: 'MODULE 3 // QUALITY',
    h1Html: '<span class="glow">Risks</span> first, not files',
    subHtml:
      'Quality in <strong>10x Workflow</strong>: five lessons on protecting the most dangerous scenarios with a test whose <strong>assertion actually fails</strong> - a test plan, the oracle and mutation, hook layers, an E2E flight and debugging from evidence. A green test that does not fail when you break the code guards nothing.',
    svgAria:
      'Diagram of a risk map under a shield: an impact by likelihood grid with a pulsing high-high quadrant, an arrow to a green test shield, three defense layer arcs around it - per-edit, pre-commit, pre-push; the error light goes out at the cheapest layer',
    svgNodeAria: {
      q01: 'Lesson 01: test plan - a risk map of impact by likelihood; the high-high quadrant gets protected first',
      q02: 'Lesson 02: from plan to tests - from the risk quadrant to a test shield whose assertion actually fails',
      q03: 'Lesson 03: hooks and triggers - three defense layers per-edit, pre-commit, pre-push; the error goes out at the cheapest one',
      q04: 'Lesson 04: E2E tests - a full end-to-end flight through all modules',
      q05: 'Lesson 05: debugging - a diagnosis from many sources at once',
    },
    svg: {
      n1Ann: 'what kills the project first?',
      n1Knum: 'RISK MAP',
      n1Sub: 'impact × likelihood',
      n2Ann: 'the most dangerous scenario',
      n2Knum: 'TEST SHIELD',
      n2Sub: 'an assertion that actually fails',
      n3PrePush: 'PRE-PUSH',
      n3PreCommit: 'PRE-COMMIT',
      n3PerEdit: 'PER-EDIT // CHEAPEST',
      n3Ann: 'the error light goes out at the cheapest layer',
      n4Knum: 'E2E // FULL FLIGHT',
      n5Knum: 'DEBUG // MANY SOURCES',
    },
    mapCap: 'RISK MAP UNDER A SHIELD // CLICK AN AREA TO FLY TO A SECTION',
    routeAria: 'Module lessons',
    route: [
      '01 · test plan',
      '02 · plan → tests',
      '03 · hooks',
      '04 · e2e',
      '05 · debugging',
      'Next: block complete',
    ],
    skrotEyebrow: 'Module summary · five lessons in 30 seconds',
    sumCards: [
      {
        num: 'LESSON 01',
        h3: 'Test plan',
        p: 'What kills the project first? The most dangerous scenarios protected first.',
      },
      {
        num: 'LESSON 02',
        h3: 'From plan to tests',
        p: 'How does a test know what is correct? An assertion that actually fails on broken code.',
      },
      {
        num: 'LESSON 03',
        h3: 'Hooks and triggers',
        p: 'What catches the error before you see it? Drift detected seconds after it appears.',
      },
      {
        num: 'LESSON 04',
        h3: 'E2E tests',
        p: 'Does the whole thing really fly? A flight where a unit test would lie.',
      },
      {
        num: 'LESSON 05',
        h3: 'Debugging',
        p: 'What do all the instruments say at once? A diagnosis from evidence, not from hunches.',
      },
    ],
    skrotFinis:
      '"Risks first, not files - protect the most dangerous scenarios with a test whose assertion actually fails."',
    skrotFinisCite: '- a 10x Workflow cornerstone',
    mechLabels: { q: 'Question', g: 'Guarantee', a: 'Artifact', t: 'Tools', l: 'Lesson' },
    targetK: 'GOAL:',
    q1: {
      num: 'LESSON 01',
      uniSf: 'Dune · The Fremen',
      h2: 'Test plan - what kills the project first?',
      epigraphSf:
        '"The desert kills in a known order: thirst first, then the storm, the worm last. Whoever leaves the sietch without this map does not come back."',
      epigraphCiteSf: '- Fremen teaching, before leaving the sietch',
      figAria:
        'Diagram of a risk grid: impact and likelihood axes, a hot spot in the high-high quadrant, and an arrow from it to the test-plan.md document',
      fig: [
        'LIKELIHOOD →',
        'IMPACT →',
        'PROTECTED FIRST',
        'TEST-PLAN.MD',
        'RISK = USER-FACING FAILURE',
      ],
      figcaption: 'FIG. 01 // RISK MAP: IMPACT × LIKELIHOOD',
      leadSfHtml:
        'The Fremen do not leave the sietch with a to-do list - they leave with a map of what kills. The desert is predictable in its hostility: every threat has a known weight and a known frequency. A test plan brings that rigor to the project: instead of covering files one by one, it maps risks on the <strong>impact × likelihood</strong> axes and describes each risk as a user-facing failure - "the cart loses items on refresh", not "cart.ts has no tests".',
      leadNeutralHtml:
        'A test plan starts from a map of what kills the project, not from a list of files: it maps risks on the <strong>impact × likelihood</strong> axes and describes each risk as a user-facing failure - "the cart loses items on refresh", not "cart.ts has no tests".',
      leadHtml:
        'Input: a working product and the PRD. Output: <strong>context/foundation/test-plan.md</strong> - a risk map cut into rollout phases, from the most dangerous scenarios down. Mechanism: <em>/10x-test-plan</em> orchestrates the delivery of tests instead of writing them itself - it drives each phase through the chain (research → plan → implement), and a re-run resumes from the next phase instead of starting over.',
      mechQ: 'what kills the project first?',
      mechG: 'the most dangerous scenarios protected first',
      mechAHtml: '<b>test-plan.md</b> in context/foundation/',
      mechTHtml: '<b>/10x-test-plan</b> → chain: research → plan → implement',
      lessonLabel: 'M3·L1: Test planning with AI',
      targetHtml:
        'key before the first test is written - <b>the order of writing tests is set by the risk map</b>, not by the directory structure.',
    },
    q2: {
      num: 'LESSON 02',
      uniSf: 'The Three-Body Problem · The Experiment',
      h2: 'From plan to tests - how does a test know what is correct?',
      epigraphSf:
        '"Do not ask the theory whether it is right. Break the system and watch whether the instrument screams - measurement decides, not faith."',
      epigraphCiteSf: '- experiment protocol, research team journal',
      figAria:
        'Diagram of an experiment: a deliberately broken system wired to a measuring instrument that lights a red signal',
      fig: [
        'SYSTEM: BROKEN ON PURPOSE',
        'INSTRUMENT = TEST',
        'RED',
        'ORACLE: FROM REQUIREMENTS, NOT FROM CODE',
        'A GREEN THAT NEVER FAILS GUARDS NOTHING',
      ],
      figcaption: 'FIG. 02 // MUTATION CHECK: BREAK IT AND CONFIRM THE RED',
      leadSfHtml:
        'In "The Three-Body Problem" disputes are settled by experiment: a theory that cannot be measured is just an opinion. A test has the same nature - it must know what is correct from an <strong>oracle built from requirements and research</strong>, not from the code it checks. A test that reads its expected value from the implementation merely duplicates it - it will rubber-stamp every bug already living there. Hence the anti-patterns to eradicate: assertions copied from code, snapshots without understanding, mocks testing mocks.',
      leadNeutralHtml:
        'A test must know what is correct from an <strong>oracle built from requirements and research</strong>, not from the code it checks. An assertion copied from the implementation merely duplicates it - it will rubber-stamp every bug already living there; hence the anti-patterns to eradicate: assertions copied from code, snapshots without understanding, mocks testing mocks.',
      leadHtml:
        'Input: one risk from test-plan.md. Output: a test whose <strong>assertion actually fails on broken code</strong>. Mechanism: the <em>mutation check</em> - break the protected behavior on purpose and confirm the red; if the instrument does not scream after sabotage, it measures nothing. <em>/10x-tdd</em> enforces this order from the start: a red test before the code, green as proof, refactoring on protected ground.',
      mechQ: 'how does a test know what is correct?',
      mechG: 'an assertion that actually fails on broken code',
      mechAHtml: '<b>a test protecting the risk</b> + a confirmed red',
      mechTHtml: '<b>/10x-tdd</b>, mutation / deliberate-break check',
      lessonLabel: 'M3·L2: From plan to tests',
      targetHtml:
        'key for every test written by an agent - <b>the oracle comes from requirements</b>, and the proof of a test\'s quality is its red on broken code.',
    },
    q3: {
      num: 'LESSON 03',
      uniSf: 'Star Wars · Deflector shields',
      h2: 'Hooks and triggers - what catches the error before you see it?',
      epigraphSf:
        '"The cheap outer screen works first, then the deflectors, the armor last. Fire that reaches the hull is a failure of every layer."',
      epigraphCiteSf: '- shield section officer, pre-battle briefing',
      figAria:
        'Diagram of three concentric shield arcs around the code: an incoming error goes out at the cheapest, outermost per-edit layer',
      fig: [
        'CODE',
        'PRE-PUSH',
        'PRE-COMMIT',
        'PER-EDIT // CHEAPEST',
        'DRIFT CAUGHT SECONDS AFTER IT APPEARS',
        'THE FARTHER FROM CODE, THE COSTLIER THE ERROR',
      ],
      figcaption: 'FIG. 03 // THE ERROR GOES OUT AT THE CHEAPEST LAYER',
      leadSfHtml:
        'A cruiser does not take fire on its hull armor - that is what deflector shields are for, layer after layer, from the cheapest on the outside to the most expensive at the plating. Quality defense works the same way and is <strong>ordered by cost</strong>: per-edit (lint and typecheck seconds after a save) → pre-commit → pre-push. The farther an error flies, the more it costs to shoot down.',
      leadNeutralHtml:
        'Quality defense is <strong>ordered by cost</strong>: per-edit (lint and typecheck seconds after a save) → pre-commit → pre-push. The later an error is detected, the more its fix costs.',
      leadHtml:
        'Input: the project\'s quality rules - lint, typecheck, fast tests. Output: <strong>hooks wired to events</strong> - per-edit, pre-commit and pre-push, each with its own time budget. Mechanism: a <em>self-checking pipeline</em> - drift is detected seconds after it appears, in the background, with no human involved; the only things that reach the end of a phase are those no layer could have caught earlier.',
      mechQ: 'what catches the error before you see it?',
      mechG: 'drift detected seconds after it appears, not at the end of a phase',
      mechAHtml: '<b>per-edit / pre-commit / pre-push hooks</b> in the repo',
      mechTHtml: '<b>hooks</b> (PostToolUse, pre-commit, pre-push), lint, typecheck',
      lessonLabel: 'M3·L3: Hooks and triggers',
      targetHtml:
        'key when working with an agent that generates code faster than you can read - <b>the error should go out at the cheapest layer</b>, before it touches git history.',
    },
    q4: {
      num: 'LESSON 04',
      uniSf: 'The Expanse · The Rocinante test flight',
      h2Pre: 'E2E tests - does the whole thing really ',
      h2Sf: 'fly',
      h2Neutral: 'work',
      h2Post: '?',
      epigraphSf:
        '"A mock-up in the dock will not tell you whether the ship flies. Take her out, light the drive and read the instruments in flight."',
      epigraphCiteSf: '- ship mechanic, before the test flight',
      figAria:
        'Diagram of a test flight: a trajectory through the UI, API and data modules, from the seed to a full end-to-end flight',
      fig: [
        'UI',
        'API',
        'DATA',
        'SEED: DATA FOR THE FLIGHT',
        'E2E ONLY WHERE A MOCK WOULD LIE',
        'A FULL FLIGHT, NOT A DOCK',
      ],
      figcaption: 'FIG. 04 // TEST FLIGHT: THROUGH ALL MODULES, NOT IN THE DOCK',
      leadSfHtml:
        'The Rocinante did not prove she could fly on dock schematics - she proved it with a test flight: drive, navigation, hull and crew at once, in vacuum. An E2E test is the same maneuver: <strong>a flight through all modules at once</strong> - UI, API, data - exactly where a mock would lie. The rule of the cheapest test that gives signal applies: if a unit test is enough, E2E is a luxury; if the unit test lies, E2E is the only honest measurement. Coverage is not the goal - signal is.',
      leadNeutralHtml:
        'An E2E test is <strong>a pass through all modules at once</strong> - UI, API, data - exactly where a mock would lie. The rule of the cheapest test that gives signal applies: if a unit test is enough, E2E is a luxury; coverage is not the goal, signal is.',
      leadHtml:
        'Input: a running application and a risk from the plan that nothing cheaper can cover. Output: <strong>Playwright tests + a seed test</strong> preparing the data for the flight. Mechanism: <em>/10x-e2e</em> drives the risk through plan → generate → review → verify on the running application, multimodally - the agent reads the DOM and looks at screenshots at the same time, so it also sees what a selector cannot catch.',
      mechQ: 'does the whole thing really fly?',
      mechG: 'an end-to-end flight where a unit test would lie',
      mechAHtml: '<b>Playwright tests</b> + a seed test',
      mechTHtml: '<b>/10x-e2e</b>, Playwright CLI/MCP (DOM + vision)',
      lessonLabel: 'M3·L4: E2E tests',
      targetHtml:
        'key for critical paths - login, payment, data writes - <b>E2E only where a mock would lie</b>, not for chasing coverage.',
    },
    q5: {
      num: 'LESSON 05',
      uniSf: 'Hyperion · The Pilgrims',
      h2Pre: 'Debugging - what do all the ',
      h2Sf: 'instruments',
      h2Neutral: 'sources',
      h2Post: ' say at once?',
      epigraphSf:
        '"Each of us carries a different tale, and none of them explains anything on its own. The truth lies where the tales intersect."',
      epigraphCiteSf: '- the pilgrims\' rule, on the way to the Time Tombs',
      figAria:
        'Diagram of evidence synthesis: four sources - Sentry, logs, console, network - converge on a single point of diagnosis',
      fig: [
        'SENTRY',
        'WRANGLER LOGS',
        'CONSOLE',
        'NETWORK',
        'WHERE THE TALES INTERSECT',
        'DIAGNOSIS',
        'NO SINGLE SOURCE IS ENOUGH',
        'TRY/CATCH → 200 = SWALLOWED EVIDENCE',
      ],
      figcaption: 'FIG. 05 // MANY TALES, ONE DIAGNOSIS',
      leadSfHtml:
        'The pilgrims on their way to the Time Tombs reach the truth only because each one tells his own story - none of them explains anything on its own, all of them at once point to the same place. Debugging with an agent works exactly the same way: <strong>a synthesis of evidence from many sources</strong> - Sentry from production, wrangler logs from the backend, console and network from Playwright - instead of mastery of a single tool.',
      leadNeutralHtml:
        'Debugging with an agent is <strong>a synthesis of evidence from many sources at once</strong> - Sentry from production, wrangler logs from the backend, console and network from Playwright - instead of mastery of a single tool. No source explains anything on its own; all of them at once point to the same place.',
      leadHtml:
        'Input: a symptom - a user-facing error, a red test, an alert. Output: <strong>a diagnosis backed by evidence</strong> and a fix pinned with a test so the regression does not come back. Mechanism: collect readings from all the instruments at once and look for where the tales intersect; along the way, eradicate error swallowing - a <em>try/catch returning 200</em> is sweeping evidence away (OWASP A10:2025), and it makes the next diagnosis start from zero.',
      mechQ: 'what do all the instruments say at once?',
      mechG: 'a diagnosis from evidence, not from hunches',
      mechAHtml: '<b>a diagnosis</b> + a test pinning the fix',
      mechTHtml: '<b>Sentry MCP</b>, wrangler logs, Playwright console/network',
      lessonLabel: 'M3·L5: Debugging with AI',
      targetHtml:
        'key when the symptom and the cause live in different layers - <b>the diagnosis is made by the intersection of sources</b>, not by the first suspicion.',
    },
    dd1: [
      {
        label: 'Why',
        body: '<p>An orchestrator, not an author of tests: it writes <code>context/foundation/test-plan.md</code> as a phased rollout strategy and drives each phase through the chain: new change → research → plan → implement. A re-run reads the state from disk and resumes from the first unfinished phase.</p>',
      },
      {
        label: 'Input → output',
        body: '<p>Input: the PRD, the roadmap, the change archive, a hot-spot scan of git history (the last 30 days) and a user interview - five questions about real worries, past incidents and places changed without confidence. Output: an <b>impact × likelihood</b> risk map cut into rollout phases with statuses.</p>',
      },
      {
        label: 'Evidence, not anchors',
        body: '<p>Every risk cites evidence: a PRD line, an interview answer, a high-churn directory. Never <code>file:line</code> - anchors in code are found only by the research of a specific phase, on current code. A risk is a user-facing failure scenario, not a location in the repo.</p>',
      },
      {
        label: 'Cost × signal',
        body: '<p>For each risk the plan carries response hints:</p><ul><li>what would prove protection (a behavior, not "cover the module"),</li><li>which obvious assumption needs to be challenged,</li><li>the cheapest test layer that gives real signal,</li><li>the anti-pattern to avoid - the most dangerous being <b>an oracle copied from the implementation</b>: such a test rubber-stamps current bugs.</li></ul>',
      },
      {
        label: 'The abuse lens',
        body: '<p>If the product has login, payments or accepts user input, the map must contain at least one abuse scenario: resource ownership checks, server-side validation, secret or data leaks, resource abuse. The happy path contains no attacker, so these risks will not surface from the interview on their own.</p>',
      },
      {
        label: 'Boundaries',
        body: '<p>It does not write test code and does not configure hooks or CI - that is the rollout phases\' job. It does not invent risks: each one must derive from the PRD, the roadmap, the archive, the hot-spots or the interview. A single test for a single file is <b>/10x-tdd</b> territory, not a rollout.</p>',
      },
    ],
    dd2: [
      {
        label: 'Why',
        body: '<p>The test-first sibling of <b>/10x-implement</b>: it drives the phases of an approved plan through the <b>red → green → refactor</b> loop. The failing test is written before the production code - the oracle physically cannot be copied from the implementation, because it does not exist yet.</p>',
      },
      {
        label: 'Entry gate',
        body: '<p>Two questions before each phase: does the implementation <b>not exist yet</b>, and can the phase be driven by a failing test. Existing code - stop and redirect to <b>/10x-implement</b>, because tests added after the fact are not TDD. Scaffolding, config, infra, visual polish - also a redirect: there a failing test drives nothing.</p>',
      },
      {
        label: 'RED',
        body: '<p>One test per behavior, named after the outcome ("returns 429 once the limit is exceeded"), assertions about results, not internals. The test must fail <b>for the right reason</b>: the missing behavior, not a syntax error in the test itself. Skipping a test with <code>it.skip</code> so it "passes" is forbidden - the red is the whole point.</p>',
      },
      {
        label: 'GREEN and REFACTOR',
        body: '<p>The smallest production code that puts out the red - no building ahead, future behaviors will get their own RED step. Then cleanup with the test green: names, duplication, types - without changing behavior. Budget: <b>2-5 tests per phase</b>, the ones that catch real regressions; not a test for a getter.</p>',
      },
      {
        label: 'Anti-patterns',
        body: '<p>Testing implementation details (private state, call order), over-mocking (when everything is a mock, you are testing mocks), snapshots for business logic, near-duplicates under different names. And the iron rule: <b>commit only on green</b> - never with a red or skipped test.</p>',
      },
    ],
    dd4: [
      {
        label: 'Why',
        body: '<p>It drives the plan\'s browser-level phases <b>one risk at a time</b> through the plan → generate → review → verify loop. An agent will generate a passing E2E test in seconds; the hard part is a test that protects a real risk and survives tomorrow\'s refactor - and that is exactly the work this loop does.</p>',
      },
      {
        label: 'Entry gate',
        body: '<p>Three conditions at once: the risk genuinely requires a browser (it cuts across auth, routing, API and data, or exists only in the rendered UI), the feature is already built and runnable, and a test for this risk does not exist yet. Everything else - a redirect to <b>/10x-tdd</b> or <b>/10x-implement</b>: E2E is the most expensive and most brittle layer.</p>',
      },
      {
        label: 'Two levers',
        body: '<p>E2E tests are not generated from scratch. Quality is guarded by two levers: <code>seed.spec.ts</code> - the exemplar test every next one is modeled on (what you show is what you get), and the E2E rules file read before generation. The prompt carries only what the levers cannot encode: the specific risk, the flow and the real vs mock boundaries.</p>',
      },
      {
        label: 'Mechanism',
        body: '<p>The agent sees the <b>accessibility tree</b> (roles, names, states), not pixels - hence <code>getByRole</code> locators come naturally, not CSS selectors. Internal boundaries (auth, routing, the database) stay real, because that is where the integration risk lives; only expensive or non-deterministic external APIs get mocked, at the network layer.</p>',
      },
      {
        label: 'Review: 5 anti-patterns',
        body: '<p>A generated test is not taken at its word. The review catches five anti-patterns: a hallucinated assertion, a brittle selector, shared state, waiting for time instead of state, missing cleanup. The fix is a <b>re-prompt by the anti-pattern\'s name</b>: what is wrong, why it does not protect the risk, which pattern should replace it - never a generic "fix this test".</p>',
      },
      {
        label: 'Verify',
        body: '<p>A green result is not enough. The control question: will the test fail when the risk from the plan actually materializes? The proof is a <b>deliberate break</b>: intentionally breaking the protected behavior and confirming the red, then immediately restoring the pre-break state. Budget: one test per risk, rarely more than 1-3 per phase.</p>',
      },
    ],
    next: {
      num: 'NEXT',
      uni: 'Quality closes the block · 10xBuilder',
      h2: 'Next: block complete',
      mono1: '10XBUILDER BLOCK // FOUNDATION → CHAIN → QUALITY',
      leadSfHtml:
        'Quality closes the 10xBuilder block. Foundation builds the launch ramp, the chain flies units of work, scaling raises rigor and autonomy, and quality makes sure that what flies does not fall.',
      leadNeutralHtml:
        'Quality closes the 10xBuilder block. Foundation prepares the project, the chain delivers units of work, scaling raises throughput and autonomy, and quality makes sure the bar does not drop as the pace goes up.',
      m1Dt: 'module 1',
      m1Link: 'Module 1: Foundation',
      m1Rest: ' - from an idea to the launch ramp',
      m2Dt: 'module 2 // csc',
      m2Link: 'Core Skills Chain',
      m2Rest: ' - five jumps of a single unit of work',
      m3Dt: 'scaling',
      m3Link: 'Scaling',
      m3Rest: ' - quality gates, goal, loops',
      mono2: 'MODULE 4 // LEGACY',
      leadHtml:
        'From here the game moves into someone else\'s code: <b>10xArchitect</b> opens the legacy module - inherited systems, no tests, the archaeology of decisions. Everything this module taught you on your own code comes back there with the stakes doubled.',
      zapDt: 'up next',
      zapDd: 'legacy (M4, 10xArchitect) - working in inherited systems',
      zasDt: 'rule',
      zasDdHtml: 'in legacy, the test protecting the behavior is written <b>before the refactor starts</b>',
      finis:
        '"The 10xBuilder block is complete: ramp, chain, shield. From here on you fly in someone else\'s code."',
      finisCite: '- a 10x Workflow cornerstone',
    },
  },
};
