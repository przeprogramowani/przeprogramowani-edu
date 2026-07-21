/**
 * Slownik strony skilla /10x-new (NewSkillBody) - krok 01 CSC.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html
 * zawieraja inline markup (strong/b/em) i renderuja sie przez set:html.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface SkillNewDict {
  eyebrow: string;
  h1Html: string;
  subSf: string;
  subNeutral: string;
  subRestHtml: string;
  svgAria: string;
  svg: {
    ideas: string;
    ideasSub: string;
    gate: string;
    gateSub1: string;
    gateSub2: string;
    folder: string;
    file: string;
    status: string;
    next: string;
    nextCmd: string;
    alt1: string;
    alt2: string;
  };
  mapCap: string;
  routeAria: string;
  route: [string, string, string, string, string];
  poco: {
    num: string;
    uniSuffix: string;
    h2: string;
    epigraph: string;
    epigraphCite: string;
    p1Html: string;
    p2Html: string;
    targetK: string;
    targetHtml: string;
  };
  io: {
    num: string;
    h2: string;
    p1Html: string;
    p2Html: string;
    rows: [Row, Row, Row];
  };
  mech: {
    num: string;
    h2: string;
    rows: [Row, Row, Row, Row];
    targetK: string;
    targetHtml: string;
  };
  anat: {
    num: string;
    h2: string;
    p1Html: string;
    p2Html: string;
    rows: [Row, Row, Row, Row, Row];
    targetK: string;
    targetHtml: string;
  };
  granice: {
    num: string;
    h2: string;
    rows: [Row, Row, Row, Row];
    chainK: string;
    chainLink: string;
    chainRest: string;
  };
}

export const SKILL_NEW: Record<Lang, SkillNewDict> = {
  pl: {
    eyebrow: 'SKILL // KROK 01 ŁAŃCUCHA',
    h1Html: '/10x-new - <span class="glow">jedna jednostka pracy</span>',
    subSf: 'Przed bitwą Ender ustawia pole gry - ten skill ustawia pole zmiany.',
    subNeutral: 'Ten skill ustawia pole zmiany, zanim ruszy jakakolwiek praca.',
    subRestHtml:
      '<strong>/10x-new</strong> zakłada folder <strong>context/changes/&lt;change-id&gt;/</strong> z małym plikiem tożsamości <strong>change.md</strong> i wskazuje następny skill. Jedna zmiana = jedna jednostka pracy od researchu po review, spięta jednym identyfikatorem.',
    svgAria:
      'Schemat działania /10x-new: chmura pomysłów przechodzi przez bramę walidacji (kebab-case, unikalność, istniejący katalog context/changes) do folderu zmiany z plikiem change.md, a dalej strzałka wskazuje następny skill',
    svg: {
      ideas: 'POMYSŁY / ZLECENIA',
      ideasSub: 'ZAKRES: ROZMYTY',
      gate: 'BRAMA: WALIDACJA',
      gateSub1: 'KEBAB-CASE // UNIKALNOŚĆ',
      gateSub2: 'ISTNIEJE CONTEXT/CHANGES/',
      folder: 'CONTEXT/CHANGES/<ID>/',
      file: 'CHANGE.MD',
      status: 'STATUS: NEW',
      next: 'NEXT:',
      nextCmd: '/10X-PLAN',
      alt1: 'LUB RESEARCH',
      alt2: 'LUB FRAME',
    },
    mapCap: '/10X-NEW // Z ROZMYTEGO ZAMIARU DO JEDNOSTKI PRACY NA DYSKU',
    routeAria: 'Sekcje strony',
    route: ['Po co', 'Wejście → wyjście', 'Mechanizm', 'Anatomia change.md', 'Granice'],
    poco: {
      num: 'PO CO',
      uniSuffix: ' · Wybór bitwy',
      h2: 'Problem: praca bez tożsamości',
      epigraph: '„Zanim ruszysz do Sali Bitewnej, nazwij bitwę, którą grasz."',
      epigraphCite: '- zasada odprawy przed każdą symulacją',
      p1Html:
        'Research, plan, implementacja i review potrzebują jednego wspólnego miejsca na dysku - inaczej artefakty rozłażą się po repozytorium i po pamięci rozmowy. <em>/10x-new</em> daje zmianie tożsamość: folder o nazwie <strong>change-id</strong> i mały plik <strong>change.md</strong>, w którym wszystko kolejne będzie żyć. „Zmiana" to jedna jednostka pracy od początku do końca.',
      p2Html:
        'To najkrótszy skill łańcucha - i celowo: robi jedną rzecz (zakłada folder), po czym natychmiast oddaje pałeczkę dalej, podpowiadając następny krok z gotową komendą w schowku.',
      targetK: 'CEL:',
      targetHtml:
        'otwierany <b>na samym początku każdej zmiany</b> - zanim powstanie jakikolwiek research, frame czy plan, musi istnieć folder, do którego trafią.',
    },
    io: {
      num: 'WEJŚCIE → WYJŚCIE',
      h2: 'Z luźnego zamiaru do pliku tożsamości',
      p1Html:
        'Wejście to <strong>change-id w kebab-case</strong> plus opcjonalny zamiar w wolnej formie: pierwszy token argumentu staje się identyfikatorem, cała reszta zasila tytuł i sekcję Notes. Akceptowane są też referencje ścieżkowe (<em>@context/changes/oauth-login/</em>) - wtedy identyfikatorem jest ostatni segment ścieżki.',
      p2Html:
        'Zamiar jest <strong>wskazówką, nie literałem</strong>: skill pisze z niego zwięzły tytuł (do 80 znaków), a pełną treść zamiaru wrzuca dosłownie do Notes jako ziarno kontekstu. Bez zamiaru tytuł powstaje z samego identyfikatora, rozpisanego na słowa, a Notes dostaje komentarz-podpowiedź.',
      rows: [
        { dt: 'Wejście', ddHtml: '<b>change-id</b> (kebab-case) + opcjonalny zamiar w wolnej formie lub ścieżka' },
        { dt: 'Wyjście', ddHtml: '<b>change.md</b> w context/changes/&lt;change-id&gt;/ ze statusem <b>new</b>' },
        { dt: 'Bonus', ddHtml: 'sugerowana komenda następnego kroku <b>skopiowana do schowka</b>' },
      ],
    },
    mech: {
      num: 'MECHANIZM',
      h2: 'Cztery ruchy, zero magii',
      rows: [
        {
          dt: '01 · Parsowanie',
          ddHtml:
            'argument dzieli się na pierwszym odstępie: pierwszy token → <b>change-id</b> (po zdjęciu „@" i końcowego „/"), reszta → zamiar. Brak argumentu = instrukcja i stop.',
        },
        {
          dt: '02 · Walidacja',
          ddHtml:
            'trzy bramki, zanim cokolwiek powstanie: <b>kebab-case</b> sprawdzany regexem, <b>unikalność</b> identyfikatora w changes/ i archive/, <b>istniejący</b> katalog context/changes/. Każda odmowa to jasny komunikat błędu i stop.',
        },
        {
          dt: '03 · Utworzenie',
          ddHtml:
            'folder context/changes/&lt;change-id&gt;/ + <b>change.md</b>: frontmatter (change_id, title, status: new, daty, archived_at: null) i sekcja Notes z zamiarem albo podpowiedzią.',
        },
        {
          dt: '04 · Następny krok',
          ddHtml:
            'domyślnie <b>/10x-plan</b>; sytuacyjnie <b>/10x-research</b> (zamiar sugeruje eksplorację kodu) albo <b>/10x-frame</b> (zgłoszenie typu „fix / bug / broken" z gotową diagnozą). Komenda ląduje w schowku.',
        },
      ],
      targetK: 'ZASADA:',
      targetHtml:
        'brak katalogu context/changes/ to <b>odmowa, nie auto-tworzenie</b> - to sygnał, że repo nie jest jeszcze przygotowane pod strukturę kontekstu (od tego jest /10x-init).',
    },
    anat: {
      num: 'ANATOMIA',
      h2: 'change.md - plik tożsamości zmiany',
      p1Html:
        'Plik jest celowo mały: frontmatter plus jedna sekcja notatek. To <strong>rekord, nie maszyna stanów</strong> - statusy są zapisem cyklu życia, nic ich nie wymusza, a pominięcie kroku jest dozwolone (luki wyłapie /10x-status po brakujących artefaktach).',
      p2Html:
        'Cykl życia statusów: <em>new</em> → <em>preparing</em> (research lub frame) → <em>planned</em> → <em>plan_reviewed</em> → <em>implementing</em> → <em>implemented</em> → <em>impl_reviewed</em> → <em>archived</em>; z każdego miejsca ręcznie do <em>blocked</em> i z powrotem. Każdy skill łańcucha podbija pole <em>updated</em> przy swoim przejściu.',
      rows: [
        { dt: 'change_id', ddHtml: 'kebab-case, musi odpowiadać nazwie folderu' },
        { dt: 'title', ddHtml: 'tytuł czytelny dla człowieka (z zamiaru albo rozpisany z identyfikatora)' },
        { dt: 'status', ddHtml: 'new → ... → archived; zapis cyklu życia, niczego nie wymusza' },
        { dt: 'created / updated', ddHtml: 'daty założenia i ostatniej zmiany w cyklu życia' },
        { dt: 'Notes', ddHtml: 'luźny kontekst: linki, decyzje ad hoc, których nie mieści research/frame/plan' },
      ],
      targetK: 'CZEGO TU NIE MA:',
      targetHtml:
        'żadnego bloku artifacts.* (wynika z zawartości folderu) ani liczników etapów - <b>postęp wykonania mieszka wyłącznie w sekcji Progress w plan.md</b>.',
    },
    granice: {
      num: 'GRANICE',
      h2: 'Czego /10x-new nie robi',
      rows: [
        {
          dt: 'Nie pisze artefaktów',
          ddHtml: 'frame.md, research.md i plan.md powstają w swoich skillach - tu rodzi się tylko tożsamość zmiany.',
        },
        {
          dt: 'Nie prowadzi stanu',
          ddHtml: 'zero plików stanu obok - jedynym źródłem prawdy o wykonaniu jest sekcja Progress w plan.md.',
        },
        {
          dt: 'Nie wymusza przejść',
          ddHtml: 'change.md jest record-only; statusy opisują, co się stało, a nie pilnują kolejności.',
        },
        {
          dt: 'Nie tworzy struktury',
          ddHtml: 'brak context/changes/ = odmowa; przygotowanie repo to osobna decyzja, nie efekt uboczny.',
        },
      ],
      chainK: 'NA STRONIE ŁAŃCUCHA:',
      chainLink: 'wróć do kroku 01 (new) na stronie Core Skills Chain',
      chainRest: ' - kontekst całego łańcucha i sąsiednie kroki.',
    },
  },
  en: {
    eyebrow: 'SKILL // CHAIN STEP 01',
    h1Html: '/10x-new - <span class="glow">one unit of work</span>',
    subSf: 'Before a battle, Ender sets up the game field - this skill sets up the field for a change.',
    subNeutral: 'This skill sets up the field for a change before any work begins.',
    subRestHtml:
      '<strong>/10x-new</strong> creates the <strong>context/changes/&lt;change-id&gt;/</strong> folder with a small identity file, <strong>change.md</strong>, and points to the next skill. One change = one unit of work from research to review, tied together by a single identifier.',
    svgAria:
      'How /10x-new works: a cloud of ideas passes through a validation gate (kebab-case, uniqueness, an existing context/changes directory) into a change folder with a change.md file, and an arrow points onward to the next skill',
    svg: {
      ideas: 'IDEAS / REQUESTS',
      ideasSub: 'SCOPE: FUZZY',
      gate: 'GATE: VALIDATION',
      gateSub1: 'KEBAB-CASE // UNIQUENESS',
      gateSub2: 'CONTEXT/CHANGES/ EXISTS',
      folder: 'CONTEXT/CHANGES/<ID>/',
      file: 'CHANGE.MD',
      status: 'STATUS: NEW',
      next: 'NEXT:',
      nextCmd: '/10X-PLAN',
      alt1: 'OR RESEARCH',
      alt2: 'OR FRAME',
    },
    mapCap: '/10X-NEW // FROM A FUZZY INTENT TO A UNIT OF WORK ON DISK',
    routeAria: 'Page sections',
    route: ['Why', 'Input → output', 'Mechanism', 'Anatomy of change.md', 'Boundaries'],
    poco: {
      num: 'WHY',
      uniSuffix: ' · Picking the battle',
      h2: 'The problem: work without an identity',
      epigraph: '"Before you head into the Battle Room, name the battle you are playing."',
      epigraphCite: '- briefing rule before every simulation',
      p1Html:
        'Research, plan, implementation and review need one shared place on disk - otherwise artifacts scatter across the repository and the conversation memory. <em>/10x-new</em> gives the change an identity: a folder named with the <strong>change-id</strong> and a small <strong>change.md</strong> file where everything that follows will live. A "change" is one unit of work from start to finish.',
      p2Html:
        'It is the shortest skill in the chain - deliberately: it does one thing (creates the folder), then immediately passes the baton, suggesting the next step with a ready-made command in the clipboard.',
      targetK: 'GOAL:',
      targetHtml:
        'opened <b>at the very start of every change</b> - before any research, frame or plan exists, there must be a folder for them to land in.',
    },
    io: {
      num: 'INPUT → OUTPUT',
      h2: 'From a loose intent to an identity file',
      p1Html:
        'The input is a <strong>change-id in kebab-case</strong> plus an optional free-form intent: the first token of the argument becomes the identifier, and everything else feeds the title and the Notes section. Path references are accepted too (<em>@context/changes/oauth-login/</em>) - then the identifier is the last path segment.',
      p2Html:
        'The intent is a <strong>hint, not a literal</strong>: the skill writes a concise title from it (up to 80 characters) and drops the full intent verbatim into Notes as a context seed. Without an intent, the title is derived from the identifier itself, expanded into words, and Notes gets a hint comment.',
      rows: [
        { dt: 'Input', ddHtml: '<b>change-id</b> (kebab-case) + an optional free-form intent or a path' },
        { dt: 'Output', ddHtml: '<b>change.md</b> in context/changes/&lt;change-id&gt;/ with status <b>new</b>' },
        { dt: 'Bonus', ddHtml: 'the suggested next-step command <b>copied to the clipboard</b>' },
      ],
    },
    mech: {
      num: 'MECHANISM',
      h2: 'Four moves, zero magic',
      rows: [
        {
          dt: '01 · Parsing',
          ddHtml:
            'the argument splits on the first whitespace: the first token → <b>change-id</b> (after stripping "@" and a trailing "/"), the rest → the intent. No argument = instructions and stop.',
        },
        {
          dt: '02 · Validation',
          ddHtml:
            'three gates before anything is created: <b>kebab-case</b> checked with a regex, <b>uniqueness</b> of the identifier across changes/ and archive/, an <b>existing</b> context/changes/ directory. Every refusal is a clear error message and a stop.',
        },
        {
          dt: '03 · Creation',
          ddHtml:
            'the context/changes/&lt;change-id&gt;/ folder + <b>change.md</b>: frontmatter (change_id, title, status: new, dates, archived_at: null) and a Notes section with the intent or a hint.',
        },
        {
          dt: '04 · Next step',
          ddHtml:
            'by default <b>/10x-plan</b>; situationally <b>/10x-research</b> (the intent suggests code exploration) or <b>/10x-frame</b> (a "fix / bug / broken" report arriving with a ready-made diagnosis). The command lands in the clipboard.',
        },
      ],
      targetK: 'RULE:',
      targetHtml:
        'a missing context/changes/ directory means <b>refusal, not auto-creation</b> - it signals that the repo is not yet prepared for the context structure (that is what /10x-init is for).',
    },
    anat: {
      num: 'ANATOMY',
      h2: 'change.md - the identity file of a change',
      p1Html:
        'The file is deliberately small: frontmatter plus one notes section. It is <strong>a record, not a state machine</strong> - statuses log the lifecycle, nothing enforces them, and skipping a step is allowed (/10x-status catches the gaps via missing artifacts).',
      p2Html:
        'The status lifecycle: <em>new</em> → <em>preparing</em> (research or frame) → <em>planned</em> → <em>plan_reviewed</em> → <em>implementing</em> → <em>implemented</em> → <em>impl_reviewed</em> → <em>archived</em>; from anywhere manually to <em>blocked</em> and back. Every skill in the chain bumps the <em>updated</em> field on its transition.',
      rows: [
        { dt: 'change_id', ddHtml: 'kebab-case, must match the folder name' },
        { dt: 'title', ddHtml: 'a human-readable title (from the intent or expanded from the identifier)' },
        { dt: 'status', ddHtml: 'new → ... → archived; a lifecycle record, it enforces nothing' },
        { dt: 'created / updated', ddHtml: 'dates of creation and of the last lifecycle change' },
        { dt: 'Notes', ddHtml: 'loose context: links, ad hoc decisions that research/frame/plan cannot hold' },
      ],
      targetK: 'WHAT IS NOT HERE:',
      targetHtml:
        'no artifacts.* block (it follows from the folder contents) and no phase counters - <b>execution progress lives exclusively in the Progress section of plan.md</b>.',
    },
    granice: {
      num: 'BOUNDARIES',
      h2: 'What /10x-new does not do',
      rows: [
        {
          dt: 'Does not write artifacts',
          ddHtml: 'frame.md, research.md and plan.md are born in their own skills - only the identity of the change is created here.',
        },
        {
          dt: 'Does not track state',
          ddHtml: 'zero state files on the side - the only source of truth about execution is the Progress section in plan.md.',
        },
        {
          dt: 'Does not enforce transitions',
          ddHtml: 'change.md is record-only; statuses describe what happened, they do not police the order.',
        },
        {
          dt: 'Does not create structure',
          ddHtml: 'no context/changes/ = refusal; preparing the repo is a separate decision, not a side effect.',
        },
      ],
      chainK: 'ON THE CHAIN PAGE:',
      chainLink: 'back to step 01 (new) on the Core Skills Chain page',
      chainRest: ' - the context of the whole chain and the neighboring steps.',
    },
  },
};
