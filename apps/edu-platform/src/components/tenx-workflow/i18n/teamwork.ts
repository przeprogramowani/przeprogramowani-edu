/**
 * Slownik strony "Modul 5: Teamwork" (slug: teamwork, TeamworkBody).
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja
 * inline markup (strong/b/em) i renderuja sie przez set:html. Nazwy uniwersow
 * ida z universeName(UNIVERSES.x, lang) - tu tylko dopiski po "·".
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

/** Krok panelu DeepDive: chip label + tresc kroku (HTML pod set:html). */
interface DdItem {
  label: string;
  body: string;
}

/** Wezel konstelacji w headerze: aria linku, adnotacja, etykieta knum. */
interface HdrNode {
  aria: string;
  ann: string;
  k: string;
}

interface Fig1 {
  aria: string;
  data: string;
  decision: string;
  gap: string;
  helper: string;
  buy: string;
  build: string;
  caption: string;
}

interface Fig2 {
  aria: string;
  model: string;
  tools: string;
  loop: string;
  context: string;
  agent: string;
  meter: string;
  fork: string;
  metrics: string;
  caption: string;
}

interface Fig3 {
  aria: string;
  pr: string;
  merge: string;
  observer: string;
  loop: string;
  severity: string;
  comment: string;
  triage: string;
  caption: string;
}

interface Fig4 {
  aria: string;
  v1: string;
  v11: string;
  v2: string;
  registry: string;
  ide: string;
  cli: string;
  ci: string;
  distribution: string;
  oneVersion: string;
  lifecycle: string;
  caption: string;
}

interface Fig5 {
  aria: string;
  commander: string;
  orders: string;
  reports: string;
  sandbox: string;
  boundaries: string;
  caption: string;
}

interface Lesson<F> {
  num: string;
  /** Dopisek po nazwie uniwersum w sec-uni (po "·"). */
  uniSub: string;
  h2: string;
  epigraphSf: string;
  epigraphCiteSf: string;
  fig: F;
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

interface SumCard {
  num: string;
  h3: string;
  p: string;
}

interface MechRow {
  dt: string;
  ddHtml: string;
}

interface MapRow {
  dt: string;
  link: string;
  rest: string;
}

interface TeamworkDict {
  hdr: {
    eyebrow: string;
    h1Html: string;
    subHtml: string;
    svgAria: string;
    svgTitle: string;
    svgPacks: string;
    svgTeam: string;
    node: {
      tool: HdrNode;
      agent: HdrNode;
      review: HdrNode;
      registry: HdrNode;
      async: HdrNode;
    };
    mapCap: string;
    routeAria: string;
    route: [string, string, string, string, string, string];
  };
  sum: {
    eyebrow: string;
    cards: [SumCard, SumCard, SumCard, SumCard, SumCard];
    finis: string;
    finisCite: string;
  };
  mech: { q: string; g: string; a: string; t: string; l: string };
  targetK: string;
  l1: Lesson<Fig1>;
  l2: Lesson<Fig2>;
  l3: Lesson<Fig3>;
  l4: Lesson<Fig4>;
  l5: Lesson<Fig5>;
  dd: {
    builders: DdItem[];
    reviewCi: DdItem[];
    rejestr: DdItem[];
    async: DdItem[];
  };
  next: {
    num: string;
    uni: string;
    h2: string;
    champK: string;
    champLeadHtml: string;
    champRows: [MechRow, MechRow, MechRow, MechRow];
    badgesK: string;
    badgesLead: string;
    badgeRows: [MechRow, MechRow, MechRow];
    mapK: string;
    mapRows: [MapRow, MapRow, MapRow, MapRow, MapRow, MapRow];
    finis: string;
    finisCite: string;
  };
}

export const TEAMWORK: Record<Lang, TeamworkDict> = {
  pl: {
    hdr: {
      eyebrow: 'MODUŁ 5 // TEAMWORK',
      h1Html: 'Agent zarabia dopiero, gdy działa <span class="glow">bez Ciebie</span>',
      subHtml:
        'Teamwork w <strong>10x Workflow</strong>: pięć lekcji o agencie pracującym dla zespołu - najmniejszy helper zamiast platformy, agent z prymitywów SDK, review na każdym PR, rejestr wspólnych skilli i delegacja async. Druga teza modułu: <strong>artefakty AI to kod</strong> - jedno źródło prawdy, wersje, dystrybucja. Ten moduł domyka blok <strong>10xChampion</strong>: wystarczy jeden z dwóch projektów, dowodem są zrzuty ekranu.',
      svgAria:
        'Konstelacja zespołu: centralny węzeł zespół, wokół pięć węzłów - narzędzie, agent, review w CI, rejestr, async - połączone łukami; paczki skilli wylatują z rejestru do węzłów, a węzeł review pulsuje w rytmie każdego PR',
      svgTitle: 'KONSTELACJA ZESPOŁU',
      svgPacks: 'PACZKI SKILLI: Z REJESTRU DO KAŻDEGO WĘZŁA',
      svgTeam: 'ZESPÓŁ',
      node: {
        tool: {
          aria: 'Lekcja 01: internal builders - najmniejsze narzędzie, które domyka lukę zespołu',
          ann: 'co zbudować, a co kupić?',
          k: 'NARZĘDZIE',
        },
        agent: {
          aria: 'Lekcja 02: pierwszy agent zespołowy - złożony z prymitywów SDK, z licznikiem kosztów',
          ann: 'prymitywy sdk + koszty',
          k: 'AGENT',
        },
        review: {
          aria: 'Lekcja 03: code review w CI - agent recenzuje każdy PR, bez Ciebie',
          ann: 'puls: każdy PR, gdy śpisz',
          k: 'REVIEW-CI',
        },
        registry: {
          aria: 'Lekcja 04: shared AI registry - jedna wersja prawdy dystrybuowana do narzędzi',
          ann: 'jedna wersja prawdy',
          k: 'REJESTR',
        },
        async: {
          aria: 'Lekcja 05: async i remote agents - rozkazy przed akcją, kontrola wraca w raportach',
          ann: 'rozkazy przed akcją',
          k: 'ASYNC',
        },
      },
      mapCap: 'KONSTELACJA ZESPOŁU // KLIKNIJ WĘZEŁ, BY DOLECIEĆ DO SEKCJI',
      routeAria: 'Lekcje modułu',
      route: [
        '01 · internal builders',
        '02 · pierwszy agent',
        '03 · review w ci',
        '04 · registry',
        '05 · async',
        'Dalej: kampania domknięta',
      ],
    },
    sum: {
      eyebrow: 'Skrót modułu · pięć lekcji w 30 sekund',
      cards: [
        {
          num: 'LEKCJA 01',
          h3: 'AI Internal Builders',
          p: 'Co zbudować, a co kupić? Najmniejsze narzędzie, które zamyka realną lukę.',
        },
        {
          num: 'LEKCJA 02',
          h3: 'Pierwszy agent zespołowy',
          p: 'Z czego składa się agent, gdy zdejmiesz IDE? Złożony świadomie, z licznikiem kosztów.',
        },
        {
          num: 'LEKCJA 03',
          h3: 'Code review w erze AI',
          p: 'Kto pilnuje każdego PR, gdy śpisz? Review na każdym PR, nie tylko gdy masz czas.',
        },
        {
          num: 'LEKCJA 04',
          h3: 'Shared AI Registry',
          p: 'Skąd zespół bierze wspólne skille? Jedna wersja prawdy zamiast dryfujących kopii.',
        },
        {
          num: 'LEKCJA 05',
          h3: 'Async i remote agents',
          p: 'Jak delegować pracę na odległość? Granice przed startem, kontrola wraca w review.',
        },
      ],
      finis: '„Agent zarabia dla zespołu dopiero wtedy, gdy działa bez Ciebie."',
      finisCite: '- fundament 10x Workflow',
    },
    mech: { q: 'Pytanie', g: 'Gwarancja', a: 'Artefakt', t: 'Narzędzia', l: 'Lekcja' },
    targetK: 'CEL:',
    l1: {
      num: 'LEKCJA 01',
      uniSub: 'Pasiarze',
      h2: 'AI Internal Builders - co zbudować, a co kupić?',
      epigraphSf:
        '„Na Pasie nikt nie czeka na dostawę z wewnętrznych planet. Bierzesz to, co masz pod ręką, i domykasz szczelinę, zanim ucieknie powietrze."',
      epigraphCiteSf: '- mechanik z Pasa, przy śluzie',
      fig: {
        aria: 'Schemat przepływu zespołu z luką pośrodku: od danych do decyzji, lukę domyka najmniejszy helper wsuwany od dołu',
        data: 'DANE',
        decision: 'DECYZJA',
        gap: 'LUKA LOKALNA',
        helper: 'NAJMNIEJSZY HELPER',
        buy: 'BUY: SAAS TAM, GDZIE ODPOWIEDZIALNOŚĆ PLATFORMOWA',
        build: 'BUILD: WOKÓŁ LUKI ZESPOŁU',
        caption: 'RYS. 01 // LUKA DOMKNIĘTA NAJMNIEJSZYM NARZĘDZIEM',
      },
      leadSfHtml:
        'Pasiarze nie czekają na dostawę z wewnętrznych planet - biorą to, co jest pod ręką, i domykają szczelinę, zanim ucieknie powietrze. Wewnętrzne narzędzia zespołu powstają z tej samej logiki: tam, gdzie SaaS niesie <strong>odpowiedzialność platformową</strong> - auth, billing, compliance - zostajesz przy SaaS. Budujesz dopiero wokół lokalnej luki zespołu, której żaden produkt z półki nie zna: wizualizacja danych zamiast kolejnej rundy pytań do analityków.',
      leadNeutralHtml:
        'Wewnętrzne narzędzia zespołu rządzą się prostą regułą: tam, gdzie SaaS niesie <strong>odpowiedzialność platformową</strong> - auth, billing, compliance - zostajesz przy SaaS. Budujesz dopiero wokół lokalnej luki zespołu, której żaden produkt z półki nie zna.',
      leadHtml:
        'Wejście: realna luka w przepływie zespołu. Wyjście: <strong>najmniejsze narzędzie, które ją zamyka</strong> - i decyzja build vs buy podjęta świadomie, nie z rozpędu. Mechanizm: zanim powstanie pierwsza linijka, pada pytanie, kto poniesie odpowiedzialność, gdy narzędzie zawiedzie - jeśli platforma, kupujesz; jeśli luka jest wasza i tylko wasza, budujesz <em>najmniejszą rzecz, która działa</em>.',
      mechQ: 'co zbudować, a co kupić?',
      mechG: 'najmniejsze narzędzie, które zamyka realną lukę',
      mechAHtml: '<b>wewnętrzny helper</b> domykający lukę zespołu',
      mechTHtml: '<b>build vs buy</b>, najmniejszy helper',
      lessonLabel: 'M5·L1: AI Internal Builders',
      targetHtml:
        'kluczowy przy każdym „zbudujmy sobie narzędzie" - <b>build tylko wokół lokalnej luki</b>, buy tam, gdzie SaaS niesie odpowiedzialność platformową.',
    },
    l2: {
      num: 'LEKCJA 02',
      uniSub: 'Budowa drużyny',
      h2: 'Pierwszy agent zespołowy - z czego składa się agent, gdy zdejmiesz IDE?',
      epigraphSf:
        '„Nie dostajesz gotowego żołnierza. Dobierasz go, składasz z tego, co ma, i mierzysz w każdej bitwie - zaufanie przychodzi po wynikach."',
      epigraphCiteSf: '- dowódca armii szkoleniowej, przed pierwszą bitwą',
      fig: {
        aria: 'Schemat składania agenta z prymitywów SDK: model, narzędzia, pętla i kontekst zbiegają w jedną ramę agenta, obok licznik kosztów z ruchomą wskazówką',
        model: 'MODEL',
        tools: 'NARZĘDZIA',
        loop: 'PĘTLA',
        context: 'KONTEKST',
        agent: 'AGENT',
        meter: 'LICZNIK KOSZTÓW',
        fork: 'FORK: READY-MADE SDK VS ASSEMBLE-IT-YOURSELF',
        metrics: 'METRYKI OD PIERWSZEGO DNIA',
        caption: 'RYS. 02 // AGENT Z PRYMITYWÓW, KOSZTY OD DNIA PIERWSZEGO',
      },
      leadSfHtml:
        'Ender nie dostaje gotowej armii - dostaje rekrutów i składa z nich drużynę: dobiera, ustawia, mierzy w każdej bitwie, zanim komukolwiek zaufa. Pierwszy agent zespołowy powstaje tak samo: schodzisz poziom niżej, pod IDE, do <strong>prymitywów SDK</strong> - model, narzędzia, pętla, kontekst - i składasz z nich nowego członka zespołu, którego zachowanie rozumiesz, bo sam je złożyłeś.',
      leadNeutralHtml:
        'Pierwszy agent zespołowy powstaje poziom niżej, pod IDE: z <strong>prymitywów SDK</strong> - model, narzędzia, pętla, kontekst - składasz nowego członka zespołu, którego zachowanie rozumiesz, bo sam je złożyłeś.',
      leadHtml:
        'Wejście: prymitywy SDK agentowego. Wyjście: <strong>agent złożony świadomie, z licznikiem kosztów</strong> i metrykami od pierwszego dnia. Mechanizm: pierwsze rozwidlenie projektu - <em>ready-made SDK vs assemble-it-yourself</em> - rozstrzyga, ile kontroli potrzebujesz; a koszty mierzysz od startu, bo agent bez licznika to członek zespołu, którego pensji nikt nie zna.',
      mechQ: 'z czego składa się agent, gdy zdejmiesz IDE?',
      mechG: 'agent złożony świadomie, z licznikiem kosztów',
      mechAHtml: '<b>pierwszy agent zespołowy</b> + metryki kosztów',
      mechTHtml: '<b>SDK agentowe</b>, metryki kosztów',
      lessonLabel: 'M5·L2: Twój pierwszy Agent zespołowy',
      targetHtml:
        'kluczowy, zanim zespół zaufa agentowi - <b>z prymitywów, świadomie, z licznikiem kosztów</b> od pierwszego dnia.',
    },
    l3: {
      num: 'LEKCJA 03',
      uniSub: 'Ocean bada badających',
      h2: 'Code review w erze AI - kto pilnuje każdego PR, gdy śpisz?',
      epigraphSf:
        '„Sondowaliśmy ocean latami, zanim zrozumieliśmy, że on sonduje nas. Każde badanie zostawia ślad w badanym - i w badającym."',
      epigraphCiteSf: '- dziennik pokładowy, stacja badawcza Solaris',
      fig: {
        aria: "Schemat pipeline'u w pętli: PR trafia do pulsującego obserwatora-recenzenta, dalej do merge, a pętla wraca po kolejny PR",
        pr: 'PR',
        merge: 'MERGE',
        observer: 'OBSERWATOR-RECENZENT',
        loop: 'PĘTLA: KOLEJNY PR, BEZ CIEBIE',
        severity: 'SEVERITY × IMPACT',
        comment: 'KOMENTARZ AGENTA NA KAŻDYM PR',
        triage: 'TRIAGE: FIX-WORTHY VS SZUM',
        caption: 'RYS. 03 // OBSERWATOR NA KAŻDYM PR, W PĘTLI',
      },
      leadSfHtml:
        "Oceanu Solaris nie da się badać z zewnątrz - on odpowiada na obserwację, a badaczom odsyła to, co sami wnieśli: obserwator zmienia obserwowany system. Code review w erze AI działa w tej samej fizyce: <strong>agent jako krok pipeline'u</strong>, uruchamiany bez Ciebie na każdym PR - także tym wysłanym o trzeciej w nocy - to obserwacja, która kształtuje kod i zespół, bo autor pisze inaczej, wiedząc, że recenzja przyjdzie zawsze.",
      leadNeutralHtml:
        "Code review w erze AI to <strong>agent jako krok pipeline'u</strong>, uruchamiany bez Ciebie na każdym PR - także tym wysłanym o trzeciej w nocy, także tym, którego nie miałbyś siły przeczytać.",
      leadHtml:
        'Wejście: PR w repozytorium zespołu. Wyjście: <strong>pipeline CI, w którym agent zostawia komentarz na każdym PR</strong> - review przestaje zależeć od Twojego kalendarza. Mechanizm: <em>/10x-impl-review-ci</em> na GitHub Actions ocenia zmiany po <em>severity × impact</em>, a triage odróżnia znaleziska warte poprawki od szumu - recenzent zgłaszający wszystko jest tak samo bezużyteczny jak ten, który nie zgłasza niczego.',
      mechQ: 'kto pilnuje każdego PR, gdy śpisz?',
      mechG: 'review na każdym PR, nie tylko gdy masz czas',
      mechAHtml: '<b>pipeline CI</b> z komentarzem agenta na PR',
      mechTHtml: '<b>/10x-impl-review-ci</b>, GHA / Claude Code Action, PR comment',
      lessonLabel: 'M5·L3: Code Review w erze AI',
      targetHtml:
        'kluczowy dla tezy modułu - <b>agent zarabia dopiero, gdy działa bez Ciebie</b>: review na każdym PR, nie wtedy, kiedy masz siłę.',
    },
    l4: {
      num: 'LEKCJA 04',
      uniSub: 'Encyklopedia',
      h2: 'Shared AI Registry - skąd zespół bierze wspólne skille?',
      epigraphSf:
        '„Imperia upadają, kopie dryfują. Przetrwa ta wiedza, która ma jedno źródło, numer wydania i drogę do każdej planety."',
      epigraphCiteSf: '- kustosz Encyklopedii, przedmowa do wydania',
      fig: {
        aria: 'Schemat rejestru-encyklopedii: wersjonowane wydania paczek lecą z jednego źródła do trzech narzędzi - IDE, CLI i CI',
        v1: 'V1.0.0',
        v11: 'V1.1.0',
        v2: 'V2.0.0',
        registry: 'REJESTR // ENCYKLOPEDIA',
        ide: 'IDE',
        cli: 'CLI',
        ci: 'CI',
        distribution: 'DYSTRYBUCJA WG AUDYTORIUM, NIE EFEKTOWNOŚCI',
        oneVersion: 'JEDNA WERSJA PRAWDY',
        lifecycle: 'INSTALL / UPDATE / UNINSTALL',
        caption: 'RYS. 04 // JEDNO ŹRÓDŁO, WERSJE, WIELE NARZĘDZI',
      },
      leadSfHtml:
        'Encyklopedia Galaktyczna powstała, żeby wiedza przetrwała upadek imperium: jedno źródło, numer wydania, droga do każdej planety. Wspólne skille zespołu potrzebują dokładnie tego, bo <strong>artefakty AI to kod</strong> - skille, komendy i reguły mają jedno źródło prawdy, wersje i mechanizm dystrybucji, zamiast dryfujących kopii wklejanych między maszynami.',
      leadNeutralHtml:
        '<strong>Artefakty AI to kod</strong>: skille, komendy i reguły mają jedno źródło prawdy, wersje i mechanizm dystrybucji - zamiast dryfujących kopii wklejanych między maszynami.',
      leadHtml:
        'Wejście: skille i reguły rozproszone po komputerach zespołu. Wyjście: <strong>rejestr paczek</strong> - repo z definicją paczki, wydanymi wersjami i auth, z którego każdy instaluje tę samą prawdę. Mechanizm: <em>install / update / uninstall</em> jak w menedżerze pakietów, z dostarczaniem do wielu narzędzi - kanał dystrybucji dobierasz według audytorium, które ma z niego korzystać, nie według efektowności demo.',
      mechQ: 'skąd zespół bierze wspólne skille?',
      mechG: 'jedna wersja prawdy zamiast dryfujących kopii',
      mechAHtml: '<b>rejestr paczek</b>: definicja paczki + wydane wersje',
      mechTHtml: '<b>/10x-contract</b>, rejestr paczek, wersjonowanie',
      lessonLabel: 'M5·L4: Shared AI Registry',
      targetHtml:
        'kluczowy dla drugiej tezy modułu - <b>artefakty AI to kod</b>: jedno źródło prawdy, wersjonowane i dystrybuowane, zamiast kopii, które dryfują osobno.',
    },
    l5: {
      num: 'LEKCJA 05',
      uniSub: 'Wataha Howlers',
      h2: 'Async i remote agents - jak delegować pracę na odległość?',
      epigraphSf:
        '„Watahy nie prowadzi się za rękę. Rozkazy i granice dostajesz przed akcją - potem działasz w ciemności, a do dowódcy wraca twój raport."',
      epigraphCiteSf: '- dowódca watahy, odprawa przed zrzutem',
      fig: {
        aria: 'Schemat watahy: dowódca wysyła rozkazy przed akcją do członków watahy zamkniętych w sandboxie z granicami sieci i sekretów, raporty wracają do review',
        commander: 'DOWÓDCA',
        orders: 'ROZKAZY PRZED AKCJĄ',
        reports: 'RAPORTY WRACAJĄ DO REVIEW',
        sandbox: 'SANDBOX',
        boundaries: 'GRANICE SIECI I SEKRETÓW',
        caption: 'RYS. 05 // ROZKAZY PRZED AKCJĄ, KONTROLA W RAPORTACH',
      },
      leadSfHtml:
        'Wataha Howlers nie czeka, aż dowódca zatwierdzi każdy jej ruch - rozkazy i granice ustala się przed akcją, potem ufa się watasze i czyta raporty, które wracają. Async i remote agents to ta sama doktryna: <strong>delegacja z odroczoną kontrolą</strong> - sandbox oraz granice sieci i sekretów ustawione, zanim agent wystartuje, bo w trakcie akcji nikt już nie negocjuje zasad.',
      leadNeutralHtml:
        'Async i remote agents to <strong>delegacja z odroczoną kontrolą</strong>: sandbox oraz granice sieci i sekretów ustawione, zanim agent wystartuje - a kontrola wraca w raportach i review.',
      leadHtml:
        'Wejście: zadanie, które nie wymaga Twojej obecności. Wyjście: <strong>agent pracujący zdalnie w sandboxie</strong> z jawnie zakreślonymi granicami - i raport, który wraca do review. Mechanizm: odpowiedzialność nie znika z delegacją, tylko zmienia moment - <em>wraca w monitoringu i review</em>; kontrolujesz wynik, nie każdy ruch.',
      mechQ: 'jak delegować pracę na odległość?',
      mechG: 'granice ustawione, zanim agent ruszy; kontrola wraca w review',
      mechAHtml: '<b>zadanie delegowane zdalnie</b> + raport w review',
      mechTHtml: '<b>sandbox</b>, granice sieci/sekretów, monitoring',
      lessonLabel: 'M5·L5: Innovate - Async & Remote Agents',
      targetHtml:
        'kluczowy przy delegacji - <b>granice przed startem, kontrola w review</b>; odpowiedzialność wraca, nie znika.',
    },
    dd: {
      builders: [
        {
          label: 'PO CO',
          body: `<p>Zanim zespół zbuduje narzędzie z rozpędu, luka trafia na papier: PRD definiuje problem, użytkowników i granice - i dopiero na tym zapada decyzja, czy w ogóle budować.</p>`,
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: `<p>Wejście: <code>shape-notes.md</code> z etapu odkrywania (albo surowe notatki). Wyjście: <code>context/foundation/prd.md</code> zgodny z zamkniętym schematem - 10 sekcji dla projektu od zera, 11 dla zmiany w istniejącym systemie.</p>`,
        },
        {
          label: 'MECHANIZM',
          body: `<p>Heurystyka 0-4 ocenia, czy notatki są ukształtowane: blok checkpoint, wymagania w formacie FR-NNN, scenariusze Given / When / Then, jawna reguła biznesowa. Poniżej progu skill ostrzega wprost: czego brakuje i z jaką konsekwencją dla dokumentu. Generacja w pamięci i walidacja ze schematem przed zapisem na dysk.</p>`,
        },
        {
          label: 'ANATOMIA',
          body: `<p>Dla zmiany w istniejącym systemie: przegląd obecnego stanu, problem i motywacja, persony, kryteria sukcesu z guardrails „co nie może się zepsuć", historyjki, wymagania funkcjonalne i niefunkcjonalne, <b>Non-Goals</b> oraz <b>Open Questions</b>.</p>`,
        },
        {
          label: 'GRANICE',
          body: `<p>Skill jest generatorem dokumentu, nie facylitatorem odkrywania: <b>nigdy nie wymyśla</b> decyzji domenowych, reguł biznesowych ani kryteriów sukcesu. Każda luka trafia dosłownie do Open Questions - rozstrzyga ją człowiek, nie generator.</p>`,
        },
      ],
      reviewCi: [
        {
          label: 'PO CO',
          body: `<p>Recenzja na każdym PR bez człowieka w pętli: agent w CI porównuje diff z planem, który PR deklaruje realizować, i zostawia trwały ślad audytowy - raport, komentarze inline, werdykt.</p>`,
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: `<p>Wejście: PR plus plan - znaleziony konwencją <code>context/changes/&lt;id&gt;/plan.md</code> albo linią „Plan:" w opisie PR. Wyjście: raport <code>reviews/impl-review.md</code> commitowany na branch PR, komentarze inline na zmienionych liniach i komentarz-podsumowanie z tabelą wymiarów.</p>`,
        },
        {
          label: 'MECHANIZM',
          body: `<p>Diff od merge-base → trzy subagenty równolegle: dryf względem planu (MATCH / DRIFT / MISSING / EXTRA), bezpieczeństwo i zgodność ze wzorcami sąsiadów, pokrycie testami → komendy weryfikacji z planu → oceny siedmiu wymiarów → werdykt APPROVED / NEEDS ATTENTION / REJECTED.</p>`,
        },
        {
          label: 'ANATOMIA ZNALEZISKA',
          body: `<p>Severity (CRITICAL / WARNING / OBSERVATION), impact, wymiar, lokalizacja <code>plik:linia</code>, detal i propozycja poprawki z jawną siłą, kosztem i pewnością. Limit 10 znalezisk - powiązane problemy konsolidowane, sortowanie po severity oddziela znaleziska warte poprawki od szumu.</p>`,
        },
        {
          label: 'GRANICE',
          body: `<p>Skill niczego nie pyta i nie edytuje kodu: czyta, analizuje, raportuje. Brak planu w PR to neutralny komentarz i wyjście, nie porażka. Werdykt REJECTED blokuje check dopiero w workflow - z etykietą-obejściem po ludzkiej decyzji.</p>`,
        },
      ],
      rejestr: [
        {
          label: 'PO CO',
          body: `<p>Zarejestrować nazwę lub schemat, które są nośne: ich zmiana wymusza skoordynowaną aktualizację u konsumentów. Rejestr sprawia, że przyszłe review planów automatycznie flaguje zmiany łamiące kontrakt.</p>`,
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: `<p>Wejście: świeżo utworzony albo rozpoznany kontrakt - pole schematu, endpoint API, format frontmattera. Wyjście: wpis H2 w <code>docs/reference/contract-surfaces.md</code>, po którym /10x-plan-review grepuje tekst każdego przyszłego planu.</p>`,
        },
        {
          label: 'ANATOMIA WPISU',
          body: `<p>Nazwa powierzchni (nagłówek H2 to dosłowny cel grep - pełna kwalifikacja zamiast gołego identyfikatora), kanoniczna definicja <code>plik:linia</code>, właściciele i konsumenci, checklist zmian łamiących gotowy do wklejenia w plan migracji.</p>`,
        },
        {
          label: 'MECHANIZM',
          body: `<p>Cztery pytania wywiadu - treść pisze użytkownik, skill niczego nie podpowiada z góry → echo wpisu i potwierdzenie → self-bootstrap pliku przy pierwszym użyciu → append na końcu rejestru.</p>`,
        },
        {
          label: 'GRANICE',
          body: `<p>Plik jest <b>append-only</b> - rewizje robi człowiek ręcznie i to celowe tarcie. Jeden wpis na wywołanie. Poprzeczka wejścia: jeśli zmiana nazwy psuje coś tylko w lokalnym module, to nie jest kontrakt i wpis nie powstaje.</p>`,
        },
      ],
      async: [
        {
          label: 'PO CO',
          body: `<p>Wykonać zatwierdzony plan bez człowieka przy klawiaturze: autonomiczny odpowiednik /10x-implement dla sesji /goal i uruchomień headless. Zaufanie zastępują jawne polityki, nie dobra wola agenta.</p>`,
        },
        {
          label: 'GRANICE PRZED STARTEM',
          body: `<p>Warunek celu spisany przed startem: zakres plików, zakaz osłabiania testów, limit tur. Polityka braku interakcji - nikt nie patrzy, więc każda decyzja ma z góry ustaloną regułę, a wątpliwości rozstrzyga interpretacja konserwatywna: mniej plików, mniej zmian zachowania, bliżej litery planu.</p>`,
        },
        {
          label: 'MECHANIZM',
          body: `<p>Implementację każdego etapu pisze delegowany subagent, ale bramki jakości biegną w głównym kontekście: kryteria planu → <b>deliberate-break check</b> (test musi zaczerwienić się na celowo zepsutym kodzie - inaczej niczego nie chroni) → pełny zestaw testów → commit wyłącznie na zielono, osobno per etap.</p>`,
        },
        {
          label: 'ROZJAZDY',
          body: `<p>Rozjazd planu z rzeczywistością jest klasyfikowany: <b>Minor</b> (przeniesiony plik, zmieniona nazwa) - adaptowany i raportowany jedną linią; <b>Structural</b> (brakująca zależność, inna architektura) - blok STOP z instrukcją wznowienia. W razie wątpliwości: Structural.</p>`,
        },
        {
          label: 'KONTROLA W RAPORTACH',
          body: `<p>Ewaluator celu czyta wyłącznie transkrypt: każdy werdykt bramki, SHA commita i adaptacja muszą zostać opowiedziane w odpowiedzi - bramka, która przeszła po cichu, nie istnieje. Maksymalnie 2 próby naprawy na bramkę, potem STOP; kroki manualne wracają do człowieka jako zamykająca checklista.</p>`,
        },
      ],
    },
    next: {
      num: 'DALEJ',
      uni: 'Kampania domknięta · Trzy odznaki',
      h2: 'Dalej: kampania domknięta',
      champK: 'BLOK 10XCHAMPION // KRYTERIA',
      champLeadHtml:
        'Odznakę domyka <b>jeden z dwóch projektów</b> - oba wyrastają wprost z tego modułu: obserwator-recenzent z lekcji 03 albo encyklopedia z lekcji 04.',
      champRows: [
        {
          dt: 'projekt a',
          ddHtml: 'pipeline CI/CD do review kodu: <b>co najmniej 1 job, logi, PR z komentarzem agenta</b>',
        },
        {
          dt: 'projekt b',
          ddHtml: 'rejestr artefaktów: <b>repo/rejestr, definicja paczki, wydane wersje</b>',
        },
        { dt: 'zasada', ddHtml: 'wystarczy <b>1 z 2</b> projektów' },
        { dt: 'dowód', ddHtml: "<b>zrzuty ekranu</b> działającego pipeline'u lub rejestru" },
      ],
      badgesK: 'TRZY ODZNAKI // DOMKNIĘCIE',
      badgesLead:
        'Teamwork domyka trzecią, ostatnią odznakę kampanii. Agent, który zarabia dla zespołu, to finał drogi zaczętej na rampie startowej.',
      badgeRows: [
        {
          dt: '10xbuilder',
          ddHtml: 'M1-M3: fundament, łańcuch, skalowanie, jakość - <b>własny kod pod kontrolą</b>',
        },
        { dt: '10xarchitect', ddHtml: 'M4: legacy - <b>cudzy kod bez strachu</b>' },
        {
          dt: '10xchampion',
          ddHtml: 'M5: teamwork - <b>agent pracujący dla zespołu, bez Ciebie</b>',
        },
      ],
      mapK: 'CAŁA MAPA KAMPANII',
      mapRows: [
        { dt: 'fundament', link: 'Moduł 1: Fundament', rest: ' - od pomysłu do rampy startowej' },
        { dt: 'csc', link: 'Core Skills Chain', rest: ' - pięć skoków jednej jednostki pracy' },
        { dt: 'skalowanie', link: 'Skalowanie', rest: ' - quality gates, goal, loops' },
        { dt: 'jakość', link: 'Moduł 3: Jakość', rest: ' - najpierw ryzyka, nie pliki' },
        { dt: 'legacy', link: 'Moduł 4: Legacy', rest: ' - praca w zastanych systemach' },
        { dt: 'docs', link: 'Dokumentacja', rest: ' - dokumentacja całej kampanii' },
      ],
      finis:
        '„Kampania domknięta: rampa, łańcuch, tarcza, cudzy kod, zespół. Agent zarabia, kiedy Ciebie tam nie ma."',
      finisCite: '- fundament 10x Workflow',
    },
  },
  en: {
    hdr: {
      eyebrow: 'MODULE 5 // TEAMWORK',
      h1Html: 'An agent earns its keep only when it works <span class="glow">without you</span>',
      subHtml:
        "Teamwork in <strong>10x Workflow</strong>: five lessons on an agent working for the team - the smallest helper instead of a platform, an agent built from SDK primitives, review on every PR, a registry of shared skills and async delegation. The module's second thesis: <strong>AI artifacts are code</strong> - one source of truth, versions, distribution. This module closes the <strong>10xChampion</strong> block: one of two projects is enough, and screenshots are the proof.",
      svgAria:
        'Team constellation: a central team node surrounded by five nodes - tool, agent, review in CI, registry, async - connected by arcs; skill packages fly out of the registry toward the nodes, and the review node pulses to the rhythm of every PR',
      svgTitle: 'TEAM CONSTELLATION',
      svgPacks: 'SKILL PACKAGES: FROM THE REGISTRY TO EVERY NODE',
      svgTeam: 'TEAM',
      node: {
        tool: {
          aria: "Lesson 01: internal builders - the smallest tool that closes the team's gap",
          ann: 'what to build, what to buy?',
          k: 'TOOL',
        },
        agent: {
          aria: 'Lesson 02: the first team agent - assembled from SDK primitives, with a cost meter',
          ann: 'sdk primitives + costs',
          k: 'AGENT',
        },
        review: {
          aria: 'Lesson 03: code review in CI - an agent reviews every PR, without you',
          ann: 'pulse: every PR, while you sleep',
          k: 'REVIEW-CI',
        },
        registry: {
          aria: 'Lesson 04: shared AI registry - one version of truth distributed to your tools',
          ann: 'one version of truth',
          k: 'REGISTRY',
        },
        async: {
          aria: 'Lesson 05: async and remote agents - orders before the action, control returns in reports',
          ann: 'orders before the action',
          k: 'ASYNC',
        },
      },
      mapCap: 'TEAM CONSTELLATION // CLICK A NODE TO FLY TO A SECTION',
      routeAria: 'Module lessons',
      route: [
        '01 · internal builders',
        '02 · first agent',
        '03 · review in ci',
        '04 · registry',
        '05 · async',
        'Next: campaign complete',
      ],
    },
    sum: {
      eyebrow: 'Module recap · five lessons in 30 seconds',
      cards: [
        {
          num: 'LESSON 01',
          h3: 'AI Internal Builders',
          p: 'What to build and what to buy? The smallest tool that closes a real gap.',
        },
        {
          num: 'LESSON 02',
          h3: 'The first team agent',
          p: 'What is an agent made of once you strip away the IDE? Assembled deliberately, with a cost meter.',
        },
        {
          num: 'LESSON 03',
          h3: 'Code review in the AI era',
          p: 'Who watches every PR while you sleep? Review on every PR, not just when you have time.',
        },
        {
          num: 'LESSON 04',
          h3: 'Shared AI Registry',
          p: 'Where does the team get shared skills? One version of truth instead of drifting copies.',
        },
        {
          num: 'LESSON 05',
          h3: 'Async and remote agents',
          p: 'How do you delegate work at a distance? Boundaries before launch, control returns in review.',
        },
      ],
      finis: '"An agent earns its keep for the team only when it works without you."',
      finisCite: '- a 10x Workflow cornerstone',
    },
    mech: { q: 'Question', g: 'Guarantee', a: 'Artifact', t: 'Tools', l: 'Lesson' },
    targetK: 'GOAL:',
    l1: {
      num: 'LESSON 01',
      uniSub: 'Belters',
      h2: 'AI Internal Builders - what to build, what to buy?',
      epigraphSf:
        '"Out in the Belt nobody waits for a shipment from the inner planets. You take what is at hand and seal the breach before the air runs out."',
      epigraphCiteSf: '- a Belter mechanic, at the airlock',
      fig: {
        aria: 'Diagram of a team flow with a gap in the middle: from data to decision, the gap is closed by the smallest helper slotted in from below',
        data: 'DATA',
        decision: 'DECISION',
        gap: 'LOCAL GAP',
        helper: 'SMALLEST HELPER',
        buy: 'BUY: SAAS WHERE THE RESPONSIBILITY IS PLATFORM-GRADE',
        build: "BUILD: AROUND THE TEAM'S GAP",
        caption: 'FIG. 01 // A GAP CLOSED WITH THE SMALLEST TOOL',
      },
      leadSfHtml:
        "Belters do not wait for a shipment from the inner planets - they take what is at hand and seal the breach before the air runs out. Internal team tools grow out of the same logic: wherever SaaS carries <strong>platform-grade responsibility</strong> - auth, billing, compliance - you stay with SaaS. You build only around the team's local gap that no off-the-shelf product knows: data visualization instead of another round of questions to the analysts.",
      leadNeutralHtml:
        "Internal team tools follow one simple rule: wherever SaaS carries <strong>platform-grade responsibility</strong> - auth, billing, compliance - you stay with SaaS. You build only around the team's local gap that no off-the-shelf product knows.",
      leadHtml:
        "Input: a real gap in the team's flow. Output: <strong>the smallest tool that closes it</strong> - and a build vs buy decision made deliberately, not out of momentum. Mechanism: before the first line of code, one question falls - who takes the responsibility when the tool fails; if the platform does, you buy; if the gap is yours and yours alone, you build <em>the smallest thing that works</em>.",
      mechQ: 'what to build, what to buy?',
      mechG: 'the smallest tool that closes a real gap',
      mechAHtml: "<b>an internal helper</b> closing the team's gap",
      mechTHtml: '<b>build vs buy</b>, the smallest helper',
      lessonLabel: 'M5·L1: AI Internal Builders',
      targetHtml:
        'key whenever someone says "let\'s build ourselves a tool" - <b>build only around a local gap</b>, buy wherever SaaS carries platform-grade responsibility.',
    },
    l2: {
      num: 'LESSON 02',
      uniSub: 'Building the team',
      h2: 'The first team agent - what is an agent made of once you strip away the IDE?',
      epigraphSf:
        '"You do not get a ready-made soldier. You pick him, assemble him from what he has, and measure him in every battle - trust comes after results."',
      epigraphCiteSf: '- a training army commander, before the first battle',
      fig: {
        aria: 'Diagram of assembling an agent from SDK primitives: model, tools, loop and context converge into a single agent frame, next to it a cost meter with a moving needle',
        model: 'MODEL',
        tools: 'TOOLS',
        loop: 'LOOP',
        context: 'CONTEXT',
        agent: 'AGENT',
        meter: 'COST METER',
        fork: 'FORK: READY-MADE SDK VS ASSEMBLE-IT-YOURSELF',
        metrics: 'METRICS FROM DAY ONE',
        caption: 'FIG. 02 // AN AGENT FROM PRIMITIVES, COSTS FROM DAY ONE',
      },
      leadSfHtml:
        'Ender does not get a ready-made army - he gets recruits and builds a team out of them: he picks, positions and measures in every battle before he trusts anyone. The first team agent is built the same way: you go one level down, below the IDE, to the <strong>SDK primitives</strong> - model, tools, loop, context - and assemble from them a new team member whose behavior you understand, because you put it together yourself.',
      leadNeutralHtml:
        'The first team agent is built one level down, below the IDE: from <strong>SDK primitives</strong> - model, tools, loop, context - you assemble a new team member whose behavior you understand, because you put it together yourself.',
      leadHtml:
        "Input: the primitives of an agent SDK. Output: <strong>an agent assembled deliberately, with a cost meter</strong> and metrics from day one. Mechanism: the project's first fork - <em>ready-made SDK vs assemble-it-yourself</em> - settles how much control you need; and you measure costs from the start, because an agent without a meter is a team member whose salary nobody knows.",
      mechQ: 'what is an agent made of once you strip away the IDE?',
      mechG: 'an agent assembled deliberately, with a cost meter',
      mechAHtml: '<b>the first team agent</b> + cost metrics',
      mechTHtml: '<b>agent SDKs</b>, cost metrics',
      lessonLabel: 'M5·L2: Your first team Agent',
      targetHtml:
        'key before the team trusts the agent - <b>from primitives, deliberately, with a cost meter</b> from day one.',
    },
    l3: {
      num: 'LESSON 03',
      uniSub: 'The ocean studies its researchers',
      h2: 'Code review in the AI era - who watches every PR while you sleep?',
      epigraphSf:
        '"We probed the ocean for years before we understood that it was probing us. Every study leaves a trace in the studied - and in the one who studies."',
      epigraphCiteSf: '- station log, Solaris research station',
      fig: {
        aria: 'Diagram of a pipeline in a loop: a PR reaches a pulsing observer-reviewer, then goes to merge, and the loop returns for the next PR',
        pr: 'PR',
        merge: 'MERGE',
        observer: 'OBSERVER-REVIEWER',
        loop: 'LOOP: NEXT PR, WITHOUT YOU',
        severity: 'SEVERITY × IMPACT',
        comment: 'AGENT COMMENT ON EVERY PR',
        triage: 'TRIAGE: FIX-WORTHY VS NOISE',
        caption: 'FIG. 03 // AN OBSERVER ON EVERY PR, IN A LOOP',
      },
      leadSfHtml:
        'The ocean of Solaris cannot be studied from the outside - it responds to observation and sends back to the researchers what they themselves brought in: the observer changes the observed system. Code review in the AI era runs on the same physics: <strong>an agent as a pipeline step</strong>, triggered without you on every PR - including the one submitted at three in the morning - is observation that shapes both the code and the team, because an author writes differently knowing the review will always come.',
      leadNeutralHtml:
        'Code review in the AI era is <strong>an agent as a pipeline step</strong>, triggered without you on every PR - including the one submitted at three in the morning, including the one you would not have had the energy to read.',
      leadHtml:
        "Input: a PR in the team's repository. Output: <strong>a CI pipeline in which the agent leaves a comment on every PR</strong> - review stops depending on your calendar. Mechanism: <em>/10x-impl-review-ci</em> on GitHub Actions scores changes by <em>severity × impact</em>, and triage separates findings worth fixing from noise - a reviewer who reports everything is just as useless as one who reports nothing.",
      mechQ: 'who watches every PR while you sleep?',
      mechG: 'review on every PR, not just when you have time',
      mechAHtml: '<b>a CI pipeline</b> with an agent comment on the PR',
      mechTHtml: '<b>/10x-impl-review-ci</b>, GHA / Claude Code Action, PR comment',
      lessonLabel: 'M5·L3: Code Review in the AI era',
      targetHtml:
        "key for the module's thesis - <b>an agent earns its keep only when it works without you</b>: review on every PR, not when you happen to have the energy.",
    },
    l4: {
      num: 'LESSON 04',
      uniSub: 'The Encyclopedia',
      h2: 'Shared AI Registry - where does the team get shared skills?',
      epigraphSf:
        '"Empires fall, copies drift. The knowledge that survives is the one with a single source, an edition number and a route to every planet."',
      epigraphCiteSf: '- curator of the Encyclopedia, preface to an edition',
      fig: {
        aria: 'Diagram of a registry-encyclopedia: versioned package editions fly from a single source to three tools - IDE, CLI and CI',
        v1: 'V1.0.0',
        v11: 'V1.1.0',
        v2: 'V2.0.0',
        registry: 'REGISTRY // ENCYCLOPEDIA',
        ide: 'IDE',
        cli: 'CLI',
        ci: 'CI',
        distribution: 'DISTRIBUTION BY AUDIENCE, NOT BY FLASH',
        oneVersion: 'ONE VERSION OF TRUTH',
        lifecycle: 'INSTALL / UPDATE / UNINSTALL',
        caption: 'FIG. 04 // ONE SOURCE, VERSIONS, MANY TOOLS',
      },
      leadSfHtml:
        "The Encyclopedia Galactica was created so that knowledge would survive the fall of an empire: a single source, an edition number, a route to every planet. A team's shared skills need exactly that, because <strong>AI artifacts are code</strong> - skills, commands and rules get one source of truth, versions and a distribution mechanism, instead of drifting copies pasted between machines.",
      leadNeutralHtml:
        '<strong>AI artifacts are code</strong>: skills, commands and rules get one source of truth, versions and a distribution mechanism - instead of drifting copies pasted between machines.',
      leadHtml:
        "Input: skills and rules scattered across the team's computers. Output: <strong>a package registry</strong> - a repo with a package definition, released versions and auth, from which everyone installs the same truth. Mechanism: <em>install / update / uninstall</em> like in a package manager, delivering to multiple tools - you pick the distribution channel by the audience meant to use it, not by how flashy the demo looks.",
      mechQ: 'where does the team get shared skills?',
      mechG: 'one version of truth instead of drifting copies',
      mechAHtml: '<b>a package registry</b>: package definition + released versions',
      mechTHtml: '<b>/10x-contract</b>, package registry, versioning',
      lessonLabel: 'M5·L4: Shared AI Registry',
      targetHtml:
        "key for the module's second thesis - <b>AI artifacts are code</b>: one source of truth, versioned and distributed, instead of copies drifting apart.",
    },
    l5: {
      num: 'LESSON 05',
      uniSub: 'The Howlers pack',
      h2: 'Async and remote agents - how do you delegate work at a distance?',
      epigraphSf:
        '"You do not lead a pack by the hand. Orders and boundaries come before the action - then you operate in the dark, and your report goes back to the commander."',
      epigraphCiteSf: '- pack commander, briefing before the drop',
      fig: {
        aria: 'Diagram of the pack: the commander sends orders before the action to pack members enclosed in a sandbox with network and secret boundaries, and reports return for review',
        commander: 'COMMANDER',
        orders: 'ORDERS BEFORE THE ACTION',
        reports: 'REPORTS RETURN FOR REVIEW',
        sandbox: 'SANDBOX',
        boundaries: 'NETWORK AND SECRET BOUNDARIES',
        caption: 'FIG. 05 // ORDERS BEFORE THE ACTION, CONTROL IN THE REPORTS',
      },
      leadSfHtml:
        'The Howlers do not wait for the commander to approve their every move - orders and boundaries are set before the action, then you trust the pack and read the reports that come back. Async and remote agents are the same doctrine: <strong>delegation with deferred control</strong> - the sandbox and the network and secret boundaries are set before the agent launches, because nobody renegotiates the rules mid-action.',
      leadNeutralHtml:
        'Async and remote agents are <strong>delegation with deferred control</strong>: the sandbox and the network and secret boundaries are set before the agent launches - and control returns in reports and review.',
      leadHtml:
        'Input: a task that does not require your presence. Output: <strong>an agent working remotely in a sandbox</strong> with explicitly drawn boundaries - and a report that comes back for review. Mechanism: responsibility does not disappear with delegation, it changes its moment - <em>it returns in monitoring and review</em>; you control the outcome, not every move.',
      mechQ: 'how do you delegate work at a distance?',
      mechG: 'boundaries set before the agent moves; control returns in review',
      mechAHtml: '<b>a task delegated remotely</b> + a report in review',
      mechTHtml: '<b>sandbox</b>, network/secret boundaries, monitoring',
      lessonLabel: 'M5·L5: Innovate - Async & Remote Agents',
      targetHtml:
        'key for delegation - <b>boundaries before launch, control in review</b>; responsibility returns, it does not disappear.',
    },
    dd: {
      builders: [
        {
          label: 'WHY',
          body: `<p>Before the team builds a tool out of momentum, the gap goes on paper: the PRD defines the problem, the users and the boundaries - and only on that basis does the decision fall whether to build at all.</p>`,
        },
        {
          label: 'INPUT → OUTPUT',
          body: `<p>Input: <code>shape-notes.md</code> from the discovery stage (or raw notes). Output: <code>context/foundation/prd.md</code> conforming to a locked schema - 10 sections for a greenfield project, 11 for a change in an existing system.</p>`,
        },
        {
          label: 'MECHANISM',
          body: `<p>A 0-4 heuristic scores whether the notes are shaped: a checkpoint block, requirements in FR-NNN format, Given / When / Then scenarios, an explicit business rule. Below the threshold the skill warns outright: what is missing and what it costs the document. Generation happens in memory, with schema validation before anything lands on disk.</p>`,
        },
        {
          label: 'ANATOMY',
          body: `<p>For a change in an existing system: a review of the current state, problem and motivation, personas, success criteria with "what must not break" guardrails, stories, functional and non-functional requirements, <b>Non-Goals</b> and <b>Open Questions</b>.</p>`,
        },
        {
          label: 'BOUNDARIES',
          body: `<p>The skill is a document generator, not a discovery facilitator: it <b>never invents</b> domain decisions, business rules or success criteria. Every gap goes verbatim into Open Questions - a human resolves it, not the generator.</p>`,
        },
      ],
      reviewCi: [
        {
          label: 'WHY',
          body: `<p>Review on every PR with no human in the loop: an agent in CI compares the diff against the plan the PR declares it implements, and leaves a durable audit trail - a report, inline comments, a verdict.</p>`,
        },
        {
          label: 'INPUT → OUTPUT',
          body: `<p>Input: a PR plus a plan - found by the <code>context/changes/&lt;id&gt;/plan.md</code> convention or a "Plan:" line in the PR description. Output: a <code>reviews/impl-review.md</code> report committed to the PR branch, inline comments on the changed lines and a summary comment with a table of dimensions.</p>`,
        },
        {
          label: 'MECHANISM',
          body: `<p>Diff from the merge-base → three subagents in parallel: drift against the plan (MATCH / DRIFT / MISSING / EXTRA), safety and conformance with neighboring patterns, test coverage → verification commands from the plan → scores across seven dimensions → an APPROVED / NEEDS ATTENTION / REJECTED verdict.</p>`,
        },
        {
          label: 'ANATOMY OF A FINDING',
          body: `<p>Severity (CRITICAL / WARNING / OBSERVATION), impact, dimension, <code>file:line</code> location, detail and a proposed fix with explicit strength, cost and confidence. A limit of 10 findings - related problems get consolidated, and sorting by severity separates findings worth fixing from noise.</p>`,
        },
        {
          label: 'BOUNDARIES',
          body: `<p>The skill asks nothing and edits no code: it reads, analyzes, reports. A missing plan in a PR means a neutral comment and an exit, not a failure. A REJECTED verdict blocks the check only in the workflow - with an override label after a human decision.</p>`,
        },
      ],
      rejestr: [
        {
          label: 'WHY',
          body: `<p>Register a name or schema that is load-bearing: changing it forces a coordinated update across its consumers. The registry makes future plan reviews flag contract-breaking changes automatically.</p>`,
        },
        {
          label: 'INPUT → OUTPUT',
          body: `<p>Input: a freshly created or newly recognized contract - a schema field, an API endpoint, a frontmatter format. Output: an H2 entry in <code>docs/reference/contract-surfaces.md</code>, which /10x-plan-review greps against the text of every future plan.</p>`,
        },
        {
          label: 'ANATOMY OF AN ENTRY',
          body: `<p>The surface name (the H2 heading is the literal grep target - fully qualified instead of a bare identifier), the canonical <code>file:line</code> definition, owners and consumers, and a breaking-change checklist ready to paste into a migration plan.</p>`,
        },
        {
          label: 'MECHANISM',
          body: `<p>A four-question interview - the user writes the content, the skill suggests nothing upfront → an echo of the entry and confirmation → self-bootstrap of the file on first use → append at the end of the registry.</p>`,
        },
        {
          label: 'BOUNDARIES',
          body: `<p>The file is <b>append-only</b> - revisions are made by a human, by hand, and that friction is deliberate. One entry per invocation. The entry bar: if a rename breaks something only in a local module, it is not a contract and no entry is created.</p>`,
        },
      ],
      async: [
        {
          label: 'WHY',
          body: `<p>Execute an approved plan with nobody at the keyboard: the autonomous counterpart of /10x-implement for /goal sessions and headless runs. Trust is replaced by explicit policies, not by the agent's good will.</p>`,
        },
        {
          label: 'BOUNDARIES BEFORE LAUNCH',
          body: `<p>The goal condition is written down before launch: file scope, no weakening of tests, a turn limit. A no-interaction policy - nobody is watching, so every decision has a rule set in advance, and doubts are resolved by the conservative interpretation: fewer files, fewer behavior changes, closer to the letter of the plan.</p>`,
        },
        {
          label: 'MECHANISM',
          body: `<p>Each phase's implementation is written by a delegated subagent, but the quality gates run in the main context: plan criteria → a <b>deliberate-break check</b> (the test must go red on deliberately broken code - otherwise it protects nothing) → the full test suite → commits only on green, one per phase.</p>`,
        },
        {
          label: 'DEVIATIONS',
          body: `<p>A divergence between the plan and reality is classified: <b>Minor</b> (a moved file, a changed name) - adapted and reported in one line; <b>Structural</b> (a missing dependency, a different architecture) - a STOP block with resume instructions. When in doubt: Structural.</p>`,
        },
        {
          label: 'CONTROL IN THE REPORTS',
          body: `<p>The goal evaluator reads only the transcript: every gate verdict, commit SHA and adaptation must be narrated in the response - a gate that passed silently does not exist. At most 2 repair attempts per gate, then STOP; manual steps return to the human as a closing checklist.</p>`,
        },
      ],
    },
    next: {
      num: 'NEXT',
      uni: 'Campaign complete · Three badges',
      h2: 'Next: campaign complete',
      champK: '10XCHAMPION BLOCK // CRITERIA',
      champLeadHtml:
        'The badge is closed by <b>one of two projects</b> - both grow straight out of this module: the observer-reviewer from lesson 03 or the encyclopedia from lesson 04.',
      champRows: [
        {
          dt: 'project a',
          ddHtml: 'a CI/CD pipeline for code review: <b>at least 1 job, logs, a PR with an agent comment</b>',
        },
        {
          dt: 'project b',
          ddHtml: 'an artifact registry: <b>a repo/registry, a package definition, released versions</b>',
        },
        { dt: 'rule', ddHtml: '<b>1 of 2</b> projects is enough' },
        { dt: 'proof', ddHtml: '<b>screenshots</b> of the working pipeline or registry' },
      ],
      badgesK: 'THREE BADGES // CLOSING THE CAMPAIGN',
      badgesLead:
        'Teamwork closes the third and final badge of the campaign. An agent that earns for the team is the finale of a road that started on the launch ramp.',
      badgeRows: [
        {
          dt: '10xbuilder',
          ddHtml: 'M1-M3: foundation, chain, scaling, quality - <b>your own code under control</b>',
        },
        { dt: '10xarchitect', ddHtml: "M4: legacy - <b>someone else's code without fear</b>" },
        {
          dt: '10xchampion',
          ddHtml: 'M5: teamwork - <b>an agent working for the team, without you</b>',
        },
      ],
      mapK: 'THE FULL CAMPAIGN MAP',
      mapRows: [
        { dt: 'foundation', link: 'Module 1: Foundation', rest: ' - from an idea to the launch ramp' },
        { dt: 'csc', link: 'Core Skills Chain', rest: ' - five jumps of a single unit of work' },
        { dt: 'scaling', link: 'Scaling', rest: ' - quality gates, goal, loops' },
        { dt: 'quality', link: 'Module 3: Quality', rest: ' - risks first, not files' },
        { dt: 'legacy', link: 'Module 4: Legacy', rest: ' - working in inherited systems' },
        { dt: 'docs', link: 'Documentation', rest: ' - documentation of the whole campaign' },
      ],
      finis:
        '"Campaign complete: the ramp, the chain, the shield, someone else\'s code, the team. The agent earns when you are not there."',
      finisCite: '- a 10x Workflow cornerstone',
    },
  },
};
