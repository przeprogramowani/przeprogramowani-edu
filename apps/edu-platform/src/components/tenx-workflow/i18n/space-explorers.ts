/**
 * Slownik strony gry Space Explorers (slug space-explorers, kontekst publiczny).
 * Zrodlo: strona https://www.10xdevs.pl/explorers + kod gry w repo
 * (src/explorers, .ai/10x-devs/game/storyline.md, backstory, ranks.ts).
 *
 * Space Explorers to narracyjna gra nalozona na program 10xDevs: gracz jest
 * Nawigatorem przy IDE, a astronauta Dexo na statku Odyssey odbudowuje pokladowe
 * AI, rozwiazujac prawdziwe wyzwania inzynierskie. Prolog (Milestone 0) jest
 * darmowy; pelna wersja to piec ksiezycow = piec modulow kursu.
 *
 * Strona jest polska (poza EN_PAGES) - wpis en odbija pl (wzorzec jak w cli.ts).
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface Card {
  num: string;
  h3: string;
  p: string;
  color: string;
}

interface SpaceExplorersText {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  routeAria: string;
  route: string[];

  how: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
  };

  story: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    rows: Row[];
    epigraph: string;
    epigraphCite: string;
  };

  prolog: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    items: Row[];
    ctaLabel: string;
    noteHtml: string;
  };

  full: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    moons: Card[];
    featuresK: string;
    featuresHtml: string;
  };

  ranks: {
    num: string;
    kicker: string;
    h2: string;
    leadHtml: string;
    list: { name: string; xp: string }[];
    noteHtml: string;
  };

  next: {
    num: string;
    kicker: string;
    h2: string;
    ctaLabel: string;
    playDt: string;
    playLink: string;
    playRest: string;
    joinDt: string;
    joinLink: string;
    joinRest: string;
    kursDt: string;
    kursLink: string;
    kursRest: string;
    logDt: string;
    logLink: string;
    logRest: string;
  };
}

const pl: SpaceExplorersText = {
  eyebrow: 'Gra kursu 10xDevs',
  h1Html: 'Space Explorers - wyrusz z nami <span class="glow">w nieznane</span>',
  subHtml:
    'Statek <b>Odyssey</b>. Zamrożona załoga. Zainfekowany system AI. Ty - jedyny, kto może to naprawić. <strong>Space Explorers</strong> to narracyjna gra, która prowadzi Cię przez program 10xDevs: wcielasz się w Nawigatora i wspólnie z astronautą Dexo odbudowujesz pokładowe AI, rozwiązując prawdziwe wyzwania inżynierskie.',
  routeAria: 'Sekcje strony',
  route: ['Jak grać', 'Fabuła', 'Prolog', 'Pełna wersja', 'Rangi'],

  how: {
    num: '01',
    kicker: 'Zasada',
    h2: 'Gra, w którą grasz swoim edytorem',
    leadHtml:
      'Space Explorers to warstwa questowa nałożona na kurs. W świecie gry jesteś <b>Nawigatorem</b> - programistą przy IDE na Ziemi. Na pokładzie statku <b>Odyssey</b> astronauta Dexo budzi się z hibernacji z amnezją, a Ty przez uplink SmartTerminala pomagasz mu przejść przez wyzwania. To model co-op: Dexo eksploruje statek i księżyce, a Ty dostarczasz wiedzę i rozwiązujesz zadania w prawdziwym kodzie.',
    rows: [
      { dt: 'Nawigator', ddHtml: 'To <b>Ty</b> - programista przy edytorze. Prowadzisz misję z Ziemi przez uplink SmartTerminala.' },
      { dt: 'Dexo', ddHtml: 'Astronauta z komory hibernacyjnej #3. Budzi się z amnezją i odzyskuje kompetencje razem z Tobą.' },
      { dt: 'SmartTerminal', ddHtml: 'Pokładowa konsola z komendami (<code>/quest</code>, <code>/me</code>, <code>/badges</code>) - łącze między statkiem a Nawigatorem.' },
      { dt: 'CORE AI', ddHtml: 'Mózg statku, uszkodzony przez wirus Entropy. Naprawiasz kolejne moduły, przechodząc przez program kursu.' },
    ],
  },

  story: {
    num: '02',
    kicker: 'Świat',
    h2: 'Rok 2030. AI degraduje się w oczach',
    leadHtml:
      'Po złotej erze AI kolektyw <b>VOID</b> niszczy światowe złoża <b>Synaptitu</b> - superprzewodnika, bez którego neuromorficzne czipy przestają działać. Zaawansowane modele degradują się do poziomu prostych chatbotów, a świat pogrąża się w chaosie. Projekt <b>Odyssey</b> wyrusza po czysty Synaptit na asteroidy Pasa Głównego. Pięcioosobowa załoga zapada w hibernację - a wraz z przebudzeniem aktywuje się ukryty w CORE AI wirus Entropy.',
    rows: [
      { dt: 'VOID Collective', ddHtml: 'Vanguard of Intelligent Disruption - neoluddyści, którzy chcą odciąć ludzkość od zasobów napędzających AI.' },
      { dt: 'Synaptit', ddHtml: 'Syntetyczny superprzewodnik. W metaforze kursu = <b>wiedza AI-Native</b>: bez niej AI jest narzędziem, nie partnerem.' },
      { dt: 'Wirus Entropy', ddHtml: 'Sleeper agent VOID ukryty w pamięci CORE AI. Aktywuje się, gdy budzi się pierwszy członek załogi.' },
      { dt: 'Odyssey', ddHtml: 'Statek zbudowany z ostatnich rezerw technologii AI. Dexo to piąty członek załogi - ten, który potrafi odbudować AI od zera.' },
    ],
    epigraph: 'Bez Synaptitu CORE AI to autouzupełnianie z ambicjami.',
    epigraphCite: 'z dziennika pokładowego dr. Kerna',
  },

  prolog: {
    num: '03',
    kicker: 'Demo',
    h2: 'Zagraj w prolog za darmo',
    leadHtml:
      'Prolog (<b>Milestone 0 - Przebudzenie</b>) jest dostępny bez zapisów na kurs. Budzisz się na Odyssey, znajdujesz sprzęt, odkrywasz swoją tożsamość, zdajesz egzaminy weryfikacyjne z podstaw AI i nawiązujesz kontakt z Ziemią.',
    items: [
      { dt: 'Świat i fabuła', ddHtml: 'Wejdź w narrację osadzoną w roku 2030 i poznaj tło misji Odyssey.' },
      { dt: 'Sprawdzian wiedzy', ddHtml: 'Trzy egzaminy z fundamentów AI: modele językowe, prompt engineering i tokenizacja.' },
      { dt: 'Mechaniki gry', ddHtml: 'Oswój SmartTerminal, questy i egzaminy - komplet mechanik, na których stoi pełna wersja.' },
      { dt: 'Odznaka "Space Adept"', ddHtml: 'Za ukończenie prologu zdobywasz pierwszą rangę i odblokowujesz komendę <code>/badges</code>.' },
    ],
    ctaLabel: 'Chcę zagrać',
    noteHtml:
      'Prolog działa w przeglądarce (silnik Phaser). Nie musisz nic instalować - wystarczy wejść i zacząć.',
  },

  full: {
    num: '04',
    kicker: 'Pełna wersja',
    h2: 'Pięć księżyców, pięć modułów',
    leadHtml:
      'W pełnej wersji odwiedzasz pięć księżyców - każdy odpowiada jednemu modułowi kursu i naprawia jeden podsystem CORE AI. Na każdym rozwiązujesz questy, które sprawdzają, czy naprawdę potrafisz przenieść umiejętność do praktyki (walidacja w stylu Advent of Code), pracujesz we własnym IDE i zbierasz odznaki.',
    moons: [
      { num: 'MOON 1', h3: 'Agentic Environment', p: 'Bootstrap toolkitu agenta: uprawnienia, izolacja, MCP, skille, kontekst projektu. Przywracasz podstawowe sensory CORE AI.', color: '#3ddad0' },
      { num: 'MOON 2', h3: '10xDevs Workflow', p: 'Plan-first: kamienie milowe MVP, architektura z agentem, kontrola implementacji, solo code review. Naprawiasz moduł planowania.', color: '#7c8cff' },
      { num: 'MOON 3', h3: 'AI Quality & Maintenance', p: 'Testy i debugowanie z AI: quality gates, testy jednostkowe, hooki, E2E z Playwrightem. Przywracasz autodiagnostykę.', color: '#a78bfa' },
      { num: 'MOON 4', h3: 'Large Scale & Legacy', p: 'Duże i stare bazy kodu: mapowanie architektury, analiza funkcji, refactoring, modernizacja DDD. Odzyskujesz pamięć długoterminową.', color: '#f4b942' },
      { num: 'MOON 5', h3: 'AI-Native Teamwork', p: 'AI na poziomie zespołu: agent SDK, AI code review, wspólne rejestry, agenci async/remote. Uruchamiasz macierz komunikacyjną.', color: '#ff7a8a' },
    ],
    featuresK: 'W pełnej wersji',
    featuresHtml:
      '<b>5 księżyców</b> = moduły kursu · questy walidujące transfer umiejętności · praca w prawdziwym IDE · system odznak i rang · walidacja zadań w stylu Advent of Code.',
  },

  ranks: {
    num: '05',
    kicker: 'Progresja',
    h2: 'Od Space Adept do Deep Space Pioneer',
    leadHtml:
      'Za rozwiązane wyzwania zdobywasz XP i awansujesz przez kolejne rangi. Komenda <code>/badges</code> w SmartTerminalu w każdej chwili potwierdza Twoje kompetencje.',
    list: [
      { name: 'Space Adept', xp: '100 XP' },
      { name: 'Moon Engineer', xp: '1000 XP' },
      { name: 'Solar Builder', xp: '2000 XP' },
      { name: 'Stellar Explorer', xp: '3000 XP' },
      { name: 'Cosmic Architect', xp: '4000 XP' },
      { name: 'Deep Space Pioneer', xp: '5000 XP' },
    ],
    noteHtml: 'Głęboka przestrzeń jest twoim domem. ✦',
  },

  next: {
    num: 'DALEJ',
    kicker: 'Start',
    h2: 'Wejdź na pokład',
    ctaLabel: 'Zagraj w prolog',
    playDt: 'Zagraj',
    playLink: 'Prolog Space Explorers',
    playRest: ' - darmowe demo, prosto w przeglądarce.',
    joinDt: 'Dołącz',
    joinLink: 'Dołącz do programu 10xDevs',
    joinRest: ' - pełna wersja gry idzie w parze z kursem.',
    kursDt: 'Kurs',
    kursLink: 'Jak działa kurs',
    kursRest: ' - jak prolog i księżyce mapują się na moduły.',
    logDt: 'Fabuła',
    logLink: 'Dziennik pokładowy',
    logRest: ' - kulisy powstania portalu i motywu SF.',
  },
};

/** EN celowo odbija PL - strona poza EN_PAGES (rollout progresywny). */
export const SPACE_EXPLORERS: Record<Lang, SpaceExplorersText> = { pl, en: pl };
