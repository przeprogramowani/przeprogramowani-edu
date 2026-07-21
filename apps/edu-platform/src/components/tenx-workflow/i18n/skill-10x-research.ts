/**
 * Slownik strony skilla /10x-research (ResearchSkillBody) - krok 02 CSC.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html
 * zawieraja inline markup (strong/b/em) i renderuja sie przez set:html.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface SkillResearchDict {
  eyebrow: string;
  h1Html: string;
  subSf: string;
  subNeutral: string;
  subRestHtml: string;
  svgAria: string;
  svg: {
    input: string;
    question: string;
    sub1: string;
    sub2: string;
    sub3: string;
    parallel: string;
    synth: string;
    file: string;
    fileLine: string;
    assumptions: string;
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
    rows: [Row, Row, Row, Row, Row, Row];
    targetK: string;
    targetHtml: string;
  };
  anat: {
    num: string;
    h2: string;
    p1Html: string;
    p2Html: string;
    rows: [Row, Row, Row, Row, Row, Row];
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

export const SKILL_RESEARCH: Record<Lang, SkillResearchDict> = {
  pl: {
    eyebrow: 'SKILL // KROK 02 ŁAŃCUCHA',
    h1Html: '/10x-research - <span class="glow">dowody z repozytorium</span>',
    subSf: 'Gdy pomiarom nie można ufać, buduje się własne przyrządy - ten skill jest przyrządem do mierzenia kodu.',
    subNeutral: 'Ten skill jest przyrządem do mierzenia kodu, zanim zapadną decyzje.',
    subRestHtml:
      '<strong>/10x-research</strong> odpowiada na pytanie badawcze <strong>równoległymi subagentami</strong> i zapisuje ustalenia z referencjami <strong>plik:linia</strong> do <strong>research.md</strong> - kolejne kroki czytają fakty z dysku, nie z pamięci rozmowy.',
    svgAria:
      'Schemat działania /10x-research: pytanie badawcze rozdziela się na 2-4 równoległych subagentów badających kod i wzorce, historię decyzji oraz działanie systemu; ich wyniki zbiegają w syntezę, z której powstaje research.md z referencjami plik:linia',
    svg: {
      input: 'WEJŚCIE',
      question: 'PYTANIE',
      sub1: 'SUBAGENT: KOD I WZORCE',
      sub2: 'SUBAGENT: HISTORIA DECYZJI',
      sub3: 'SUBAGENT: DZIAŁANIE SYSTEMU',
      parallel: '2-4 RÓWNOLEGLE // TYLKO ODCZYT',
      synth: 'SYNTEZA',
      file: 'RESEARCH.MD',
      fileLine: 'PLIK:LINIA',
      assumptions: 'ZAŁOŻENIA: 0',
    },
    mapCap: '/10X-RESEARCH // RÓWNOLEGŁY POMIAR ZBIEGA W JEDEN ARTEFAKT',
    routeAria: 'Sekcje strony',
    route: ['Po co', 'Wejście → wyjście', 'Mechanizm', 'Anatomia research.md', 'Granice'],
    poco: {
      num: 'PO CO',
      uniSuffix: ' · Własne przyrządy',
      h2: 'Problem: decyzje na zatrutych danych',
      epigraph: '„Nie ufaj pomiarowi, którego nie wykonałeś własnym przyrządem."',
      epigraphCite: '- odruch naukowców po tym, jak wszechświat zaczął migotać',
      p1Html:
        'Największym sabotażystą planu jest fałszywe „wiem, jak to działa" - wiedza sprzed trzech refaktorów, cudzy kod, duże repozytorium. <em>/10x-research</em> zastępuje założenia <strong>dowodami z repozytorium</strong>: przeczesuje kod, historię decyzji i realne zachowanie systemu, a wynik zapisuje na dysku.',
      p2Html:
        'Artefakt jest sednem: research w pamięci rozmowy znika z kontekstem, research w pliku <strong>przeżywa sesję</strong> i staje się wejściem dla /10x-plan - plan powstaje na faktach, które można zacytować z numerem linii.',
      targetK: 'CEL:',
      targetHtml:
        'kluczowy w cudzym, starym lub dużym kodzie - wszędzie tam, gdzie <b>fałszywe „wiem" kosztuje najwięcej</b> i gdzie plan bez ugruntowania byłby zgadywaniem.',
    },
    io: {
      num: 'WEJŚCIE → WYJŚCIE',
      h2: 'Z pytania badawczego do dokumentu z dowodami',
      p1Html:
        'Wejściem jest <strong>pytanie badawcze</strong> plus pliki wskazane przez użytkownika - te skill czyta w całości <strong>zanim</strong> ruszy cokolwiek innego, w głównym kontekście, nie w subagentach. Jeśli istnieje <em>context/foundation/lessons.md</em>, jego reguły są przyjmowane z góry: co zespół już zaakceptował, tego nie trzeba badać od nowa.',
      p2Html:
        'Wyjściem jest <strong>research.md</strong> w folderze zmiany - jeden artefakt researchu na zmianę. Pytania follow-up nie tworzą nowych plików: dopisują się do tego samego dokumentu jako osobna sekcja z adnotacją w frontmatterze.',
      rows: [
        { dt: 'Wejście', ddHtml: '<b>pytanie badawcze</b> + wskazane pliki (czytane w całości) + opcjonalnie change-id' },
        {
          dt: 'Wyjście',
          ddHtml: '<b>research.md</b> w context/changes/&lt;change-id&gt;/ z metadanymi (data, commit, branch, temat)',
        },
        { dt: 'Status', ddHtml: 'change.md przechodzi z <b>new</b> na <b>preparing</b>; brak folderu = tworzony jak w /10x-new' },
      ],
    },
    mech: {
      num: 'MECHANIZM',
      h2: 'Dekompozycja, równoległy pomiar, synteza',
      rows: [
        {
          dt: '01 · Lektura',
          ddHtml:
            'pliki wymienione przez użytkownika czytane <b>w całości</b> w głównym kontekście - żadnych limitów, żadnego delegowania tej lektury.',
        },
        {
          dt: '02 · Dekompozycja',
          ddHtml:
            'pytanie rozbijane na obszary badawcze, które potem złożą się w odpowiedź; każdy obszar dostaje widoczne dla użytkownika zadanie na liście postępu.',
        },
        {
          dt: '03 · Zakres',
          ddHtml:
            'doprecyzowanie z użytkownikiem: szerokość, głębokość, punkt ciężkości (2-4 konkretne opcje na pytanie). Pomijane, gdy zapytanie jest jednoznaczne i wąsko zakrojone.',
        },
        {
          dt: '04 · Subagenci',
          ddHtml:
            '<b>2-4 równolegle</b>, każdy w swoim wymiarze: szybkie wyszukiwanie plików i wzorców, wcześniejsze decyzje w context/changes/ i context/archive/, głęboka analiza działania systemu.',
        },
        {
          dt: '05 · Synteza',
          ddHtml:
            'start dopiero, gdy <b>wrócą wszyscy</b>; ustalenia z żywego kodu mają pierwszeństwo, historia jest kontekstem uzupełniającym; wszystko spina się referencjami plik:linia.',
        },
        {
          dt: '06 · Zapis',
          ddHtml:
            'metadane (commit, branch, data) zbierane <b>przed</b> pisaniem - dokument nigdy nie powstaje z placeholderami; przy wypchniętym commicie referencje dostają permalinki do GitHuba.',
        },
      ],
      targetK: 'ZASADA:',
      targetHtml:
        'subagenci dostają zadania <b>tylko do odczytu</b> i mają zwracać konkretne referencje plik:linia oraz wzorce użycia - nie ogólniki i nie same definicje.',
    },
    anat: {
      num: 'ANATOMIA',
      h2: 'research.md - dokument samowystarczalny',
      p1Html:
        'Dokument otwiera frontmatter z pełnym kontekstem czasowym: data z timezone, badacz, commit, branch, repozytorium, temat, tagi. Dzięki temu czytelnik za trzy miesiące wie, <strong>względem jakiego stanu kodu</strong> te ustalenia były prawdziwe.',
      p2Html:
        'Sekcje prowadzą od skrótu do szczegółu: najpierw odpowiedź na pytanie, potem dowody per komponent, na końcu wnioski architektoniczne i to, czego nie udało się rozstrzygnąć. Pytania follow-up trafiają na dół z własnym znacznikiem czasu.',
      rows: [
        { dt: 'Summary', ddHtml: 'wysokopoziomowa odpowiedź na pytanie badawcze' },
        { dt: 'Detailed Findings', ddHtml: 'ustalenia per komponent/obszar z referencjami i powiązaniami między komponentami' },
        { dt: 'Code References', ddHtml: 'lista ścieżka:linia z opisem, co tam jest - grunt pod plan' },
        { dt: 'Architecture Insights', ddHtml: 'wzorce, konwencje i decyzje projektowe odkryte po drodze' },
        { dt: 'Historical Context', ddHtml: 'wnioski z context/changes/ i context/archive/ z referencjami do tamtych dokumentów' },
        { dt: 'Open Questions', ddHtml: 'obszary wymagające dalszego zbadania - jawnie, zamiast udawać kompletność' },
      ],
    },
    granice: {
      num: 'GRANICE',
      h2: 'Czego /10x-research nie robi',
      rows: [
        {
          dt: 'Nie zmienia kodu',
          ddHtml: 'badanie jest w całości odczytowe - jedyny zapis to research.md i podbicie statusu w change.md.',
        },
        {
          dt: 'Nie ufa historii w ciemno',
          ddHtml:
            'świeży research żywego kodu zawsze przed archiwum - wcześniejsze zmiany to kontekst uzupełniający, nie zamiennik czytania.',
        },
        { dt: 'Nie planuje', ddHtml: 'research ustala fakty; decyzje projektowe i etapy to praca /10x-plan.' },
        {
          dt: 'Nie mnoży artefaktów',
          ddHtml:
            'jeden research.md na zmianę; pytania follow-up dopisują się do istniejącego pliku. Zmiana zarchiwizowana = odmowa i wskazanie /10x-new.',
        },
      ],
      chainK: 'NA STRONIE ŁAŃCUCHA:',
      chainLink: 'wróć do kroku 02 (research) na stronie Core Skills Chain',
      chainRest: ' - kontekst całego łańcucha i sąsiednie kroki.',
    },
  },
  en: {
    eyebrow: 'SKILL // CHAIN STEP 02',
    h1Html: '/10x-research - <span class="glow">evidence from the repository</span>',
    subSf: 'When measurements cannot be trusted, you build your own instruments - this skill is an instrument for measuring code.',
    subNeutral: 'This skill is an instrument for measuring code before decisions are made.',
    subRestHtml:
      '<strong>/10x-research</strong> answers a research question with <strong>parallel subagents</strong> and writes the findings, with <strong>file:line</strong> references, to <strong>research.md</strong> - later steps read facts from disk, not from conversation memory.',
    svgAria:
      'How /10x-research works: a research question splits into 2-4 parallel subagents investigating code and patterns, decision history, and system behavior; their results converge into a synthesis that produces research.md with file:line references',
    svg: {
      input: 'INPUT',
      question: 'QUESTION',
      sub1: 'SUBAGENT: CODE AND PATTERNS',
      sub2: 'SUBAGENT: DECISION HISTORY',
      sub3: 'SUBAGENT: SYSTEM BEHAVIOR',
      parallel: '2-4 IN PARALLEL // READ-ONLY',
      synth: 'SYNTHESIS',
      file: 'RESEARCH.MD',
      fileLine: 'FILE:LINE',
      assumptions: 'ASSUMPTIONS: 0',
    },
    mapCap: '/10X-RESEARCH // PARALLEL MEASUREMENT CONVERGES INTO ONE ARTIFACT',
    routeAria: 'Page sections',
    route: ['Why', 'Input → output', 'Mechanism', 'Anatomy of research.md', 'Boundaries'],
    poco: {
      num: 'WHY',
      uniSuffix: ' · Your own instruments',
      h2: 'The problem: decisions on poisoned data',
      epigraph: '"Do not trust a measurement you did not take with your own instrument."',
      epigraphCite: '- the scientists\' reflex after the universe started to flicker',
      p1Html:
        'The biggest saboteur of a plan is a false "I know how this works" - knowledge from three refactors ago, someone else\'s code, a large repository. <em>/10x-research</em> replaces assumptions with <strong>evidence from the repository</strong>: it combs through the code, the decision history and the system\'s real behavior, and writes the result to disk.',
      p2Html:
        'The artifact is the whole point: research in conversation memory vanishes with the context, research in a file <strong>survives the session</strong> and becomes the input for /10x-plan - the plan is built on facts that can be cited with a line number.',
      targetK: 'GOAL:',
      targetHtml:
        'crucial in unfamiliar, old or large code - wherever <b>a false "I know" costs the most</b> and a plan without grounding would be guesswork.',
    },
    io: {
      num: 'INPUT → OUTPUT',
      h2: 'From a research question to a document with evidence',
      p1Html:
        'The input is a <strong>research question</strong> plus the files pointed out by the user - the skill reads these in full <strong>before</strong> anything else starts, in the main context, not in subagents. If <em>context/foundation/lessons.md</em> exists, its rules are taken as given: what the team has already accepted does not need to be investigated again.',
      p2Html:
        'The output is <strong>research.md</strong> in the change folder - one research artifact per change. Follow-up questions do not create new files: they are appended to the same document as a separate section with a frontmatter annotation.',
      rows: [
        { dt: 'Input', ddHtml: '<b>a research question</b> + the pointed-out files (read in full) + optionally a change-id' },
        {
          dt: 'Output',
          ddHtml: '<b>research.md</b> in context/changes/&lt;change-id&gt;/ with metadata (date, commit, branch, topic)',
        },
        { dt: 'Status', ddHtml: 'change.md moves from <b>new</b> to <b>preparing</b>; a missing folder = created as in /10x-new' },
      ],
    },
    mech: {
      num: 'MECHANISM',
      h2: 'Decomposition, parallel measurement, synthesis',
      rows: [
        {
          dt: '01 · Reading',
          ddHtml:
            'files named by the user are read <b>in full</b> in the main context - no limits, no delegating this reading.',
        },
        {
          dt: '02 · Decomposition',
          ddHtml:
            'the question is broken into research areas that will later compose the answer; each area gets a user-visible task on the progress list.',
        },
        {
          dt: '03 · Scope',
          ddHtml:
            'clarification with the user: breadth, depth, center of gravity (2-4 concrete options per question). Skipped when the query is unambiguous and narrowly scoped.',
        },
        {
          dt: '04 · Subagents',
          ddHtml:
            '<b>2-4 in parallel</b>, each in its own dimension: fast search for files and patterns, earlier decisions in context/changes/ and context/archive/, deep analysis of system behavior.',
        },
        {
          dt: '05 · Synthesis',
          ddHtml:
            'starts only when <b>everyone is back</b>; findings from live code take precedence, history is supplementary context; everything is tied together with file:line references.',
        },
        {
          dt: '06 · Write',
          ddHtml:
            'metadata (commit, branch, date) is collected <b>before</b> writing - the document is never created with placeholders; with a pushed commit the references get GitHub permalinks.',
        },
      ],
      targetK: 'RULE:',
      targetHtml:
        'subagents get <b>read-only</b> tasks and must return concrete file:line references and usage patterns - not generalities and not bare definitions.',
    },
    anat: {
      num: 'ANATOMY',
      h2: 'research.md - a self-sufficient document',
      p1Html:
        'The document opens with frontmatter carrying full temporal context: date with timezone, researcher, commit, branch, repository, topic, tags. Thanks to it, a reader three months later knows <strong>against which state of the code</strong> these findings were true.',
      p2Html:
        'The sections lead from summary to detail: first the answer to the question, then evidence per component, finally architectural insights and what could not be resolved. Follow-up questions land at the bottom with their own timestamp.',
      rows: [
        { dt: 'Summary', ddHtml: 'a high-level answer to the research question' },
        { dt: 'Detailed Findings', ddHtml: 'findings per component/area with references and cross-component relationships' },
        { dt: 'Code References', ddHtml: 'a list of path:line entries describing what lives there - the ground for the plan' },
        { dt: 'Architecture Insights', ddHtml: 'patterns, conventions and design decisions discovered along the way' },
        { dt: 'Historical Context', ddHtml: 'conclusions from context/changes/ and context/archive/ with references to those documents' },
        { dt: 'Open Questions', ddHtml: 'areas that need further investigation - stated openly, instead of feigning completeness' },
      ],
    },
    granice: {
      num: 'BOUNDARIES',
      h2: 'What /10x-research does not do',
      rows: [
        {
          dt: 'Does not change code',
          ddHtml: 'the investigation is entirely read-only - the only writes are research.md and the status bump in change.md.',
        },
        {
          dt: 'Does not trust history blindly',
          ddHtml:
            'fresh research of live code always comes before the archive - earlier changes are supplementary context, not a substitute for reading.',
        },
        { dt: 'Does not plan', ddHtml: 'research establishes facts; design decisions and phases are the job of /10x-plan.' },
        {
          dt: 'Does not multiply artifacts',
          ddHtml:
            'one research.md per change; follow-up questions are appended to the existing file. An archived change = refusal and a pointer to /10x-new.',
        },
      ],
      chainK: 'ON THE CHAIN PAGE:',
      chainLink: 'back to step 02 (research) on the Core Skills Chain page',
      chainRest: ' - the context of the whole chain and the neighboring steps.',
    },
  },
};
