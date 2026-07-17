/**
 * Slownik strony skilla /10x-plan (PlanSkillBody) - krok 03 CSC.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html
 * zawieraja inline markup (strong/b/em) i renderuja sie przez set:html.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface SkillPlanDict {
  eyebrow: string;
  h1Html: string;
  subSf: string;
  subNeutral: string;
  subRestHtml: string;
  svgAria: string;
  svg: {
    in1: string;
    in2: string;
    in3: string;
    inSub: string;
    rounds: string;
    decisions: string;
    phase1: string;
    phase2: string;
    phaseN: string;
    phaseSub: string;
    file: string;
    fileSub: string;
    brief: string;
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
    rows: [Row, Row, Row, Row];
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
    rows: [Row, Row, Row, Row, Row];
    targetK: string;
    targetHtml: string;
  };
  anty: {
    num: string;
    h2: string;
    rows: [Row, Row, Row, Row, Row];
    chainK: string;
    chainLink: string;
    chainRest: string;
  };
}

export const SKILL_PLAN: Record<Lang, SkillPlanDict> = {
  pl: {
    eyebrow: 'SKILL // KROK 03 ŁAŃCUCHA',
    h1Html: '/10x-plan - <span class="glow">decyzje przed kodem</span>',
    subSf: 'Pielgrzymka zna trasę, zanim ktokolwiek postawi krok - ten skill wyznacza trasę zmiany.',
    subNeutral: 'Ten skill wyznacza trasę zmiany, zanim powstanie kod.',
    subRestHtml:
      '<strong>/10x-plan</strong> prowadzi interaktywne, sceptyczne planowanie: skaluje liczbę pytań do złożoności i dostarczonych artefaktów, wymusza decyzje tam, gdzie są tanie, i zapisuje <strong>plan.md</strong> z fazami, kryteriami sukcesu i sekcją <strong>Progress</strong> - plus dwustronicowy <strong>plan-brief.md</strong>.',
    svgAria:
      'Schemat działania /10x-plan: artefakty wejściowe (research, frame) zasilają rundy pytań z rekomendacjami, z których powstaje trasa faz z warunkami sukcesu, zapisana jako plan.md z sekcją Progress oraz skrót plan-brief.md',
    svg: {
      in1: 'RESEARCH.MD',
      in2: 'FRAME.MD',
      in3: 'OPIS ZADANIA',
      inSub: 'WIĘCEJ ARTEFAKTÓW = MNIEJ PYTAŃ',
      rounds: 'RUNDY PYTAŃ',
      decisions: 'DECYZJE',
      phase1: 'FAZA 1',
      phase2: 'FAZA 2',
      phaseN: 'FAZA N',
      phaseSub: 'KAŻDA FAZA: WARUNKI SUKCESU',
      file: 'PLAN.MD',
      fileSub: 'FAZY + PROGRESS',
      brief: 'PLAN-BRIEF.MD',
    },
    mapCap: '/10X-PLAN // TRASA USTALONA, ZANIM RUSZY IMPLEMENTACJA',
    routeAria: 'Sekcje strony',
    route: ['Po co', 'Wejście → wyjście', 'Mechanizm', 'Anatomia plan.md', 'Antywzorce'],
    poco: {
      num: 'PO CO',
      uniSuffix: ' · Trasa pielgrzymki',
      h2: 'Problem: decyzje zapadające mimochodem',
      epigraph: '„Na mapie poprawka kosztuje ołówek. W drodze - pielgrzyma."',
      epigraphCite: '- rachunek trasy przed wyjściem do Grobowców Czasu',
      p1Html:
        'Implementacja „na żywioł" podejmuje kluczowe decyzje w najgorszym możliwym miejscu: w środku pisania kodu, mimochodem, bez porównania opcji. <em>/10x-plan</em> wyciąga je przed kod - tam, gdzie zmiana zdania kosztuje edycję tekstu, nie refaktor.',
      p2Html:
        'Skill jest z założenia <strong>sceptyczny i interaktywny</strong>: kwestionuje mgliste wymagania, pyta „dlaczego" i „co z przypadkiem X", weryfikuje korekty użytkownika własnym researchem i nie pisze planu za jednym podejściem - zatwierdza złożoność, potem decyzje, potem szkielet faz, dopiero na końcu szczegóły.',
      targetK: 'CEL:',
      targetHtml:
        'kluczowy, gdy zmiana dotyka wielu plików albo niesie decyzje trudne do cofnięcia (schemat danych, publiczne API) - <b>decyzje mają zapaść przed kodem</b>, nie w jego trakcie.',
    },
    io: {
      num: 'WEJŚCIE → WYJŚCIE',
      h2: 'Każdy artefakt na wejściu to mniej pytań',
      p1Html:
        'Wejściem jest opis zadania plus artefakty z wcześniejszych kroków. <strong>Każdy dostarczony artefakt to decyzje już podjęte</strong> - skill czyta je w całości i nie pyta o to, co użytkownik już zapisał. Frame zamyka pytania diagnostyczne (czym jest problem), research - pytania o stan kodu; z oboma naraz zostają wyłącznie decyzje projektowe.',
      p2Html:
        'Skala jest jawna: zadanie bez artefaktów przy złożoności MEDIUM to 7-10 pytań; z researchem 5-7; z frame 4-6; z oboma 3-5. Ponowne pytanie o rzecz rozstrzygniętą we wcześniejszych krokach to jawnie nazwany błąd skilla, nie nadgorliwość.',
      rows: [
        { dt: 'Wejście', ddHtml: '<b>opis zadania</b> + opcjonalnie research.md i/lub frame.md z folderu zmiany' },
        { dt: 'Wyjście', ddHtml: '<b>plan.md</b> - fazy z kryteriami sukcesu + sekcja Progress (maszyna stanów)' },
        { dt: 'Wyjście 2', ddHtml: '<b>plan-brief.md</b> - dwustronicowy skrót z tabelą kluczowych decyzji i ich źródeł' },
        { dt: 'Bonus', ddHtml: 'komenda <b>/10x-implement &lt;change-id&gt; phase 1</b> skopiowana do schowka' },
      ],
    },
    mech: {
      num: 'MECHANIZM',
      h2: 'Od złożoności do zatwierdzonego szkieletu',
      rows: [
        {
          dt: '01 · Kontekst',
          ddHtml:
            'identyfikacja artefaktów z wcześniejszych kroków, lektura wszystkich wskazanych plików <b>w całości</b>, do tego równolegli subagenci na luki, których research nie pokrył.',
        },
        {
          dt: '02 · Złożoność',
          ddHtml:
            'ocena LOW / MEDIUM / HIGH z uzasadnieniem, <b>potwierdzana z użytkownikiem</b>; wyznacza budżet pytań: LOW 4-6, MEDIUM 7-10, HIGH 11-15.',
        },
        {
          dt: '03 · Pytania',
          ddHtml:
            'rundy po 1-4 pytania; każda opcja niesie rekomendację oraz jawną analizę: co daje, co kosztuje. Kategorie dobrane do domeny (software / treść / proces), pytania diagnostyczne pomijane przy obecnym frame.',
        },
        {
          dt: '04 · Research wykonawczy',
          ddHtml:
            'wzorce, konwencje i punkty integracji skill ustala <b>sam</b> z kodu i wcześniejszych prac - o to nie pyta użytkownika.',
        },
        {
          dt: '05 · Szkielet',
          ddHtml:
            'propozycja podziału na fazy zatwierdzana, zanim powstaną szczegóły; korekty (za drobno / za grubo) są tanie na tym etapie.',
        },
        {
          dt: '06 · Zapis',
          ddHtml:
            'plan.md wg szablonu + plan-brief.md; status zmiany przechodzi na <b>planned</b>; potem iteracja z użytkownikiem do skutku.',
        },
      ],
      targetK: 'ZASADA:',
      targetHtml:
        'plan opisuje <b>intencję i kontrakt zmiany, nie gotowy kod</b> - każda pozycja rozdziela Intent (co i po co) od Contract (interfejs, sygnatura, schemat, niezmiennik); fragment kodu pojawia się tylko przy zmianie nieoczywistej.',
    },
    anat: {
      num: 'ANATOMIA',
      h2: 'plan.md i plan-brief.md - kontrakt oraz skrót',
      p1Html:
        'Sekcja <strong>„What We\'re NOT Doing"</strong> to tama na pełzanie zakresu, a <strong>Critical Implementation Details</strong> jest jawnie opcjonalna: pojawia się tylko, gdy istnieje realny haczyk (kolejność, wyścig, budżet wydajności). Plan bez niej nie jest niekompletny; plan wypchany szablonowymi punktami jest rozdęty.',
      p2Html:
        'Na dole mieszka <strong>Progress</strong> - jedyne miejsce checkboxów i maszyna stanów dla /10x-implement: po jednym wpisie na każde kryterium sukcesu, w podziale Automated / Manual, z indeksami N.M, które nigdy nie są przenumerowywane. Bloki faz wyżej niosą zwykłe punktory, bez checkboxów.',
      rows: [
        {
          dt: 'Overview + stany',
          ddHtml:
            'co budujemy i po co; stan bieżący z kluczowymi odkryciami (plik:linia); stan docelowy z metodą weryfikacji',
        },
        { dt: "What We're NOT Doing", ddHtml: 'jawna lista rzeczy poza zakresem zmiany' },
        {
          dt: 'Fazy',
          ddHtml:
            'Changes Required per plik z parą Intent / Contract; kryteria sukcesu podzielone na <b>automatyczne</b> (komendy) i <b>ręczne</b> (człowiek)',
        },
        {
          dt: 'Progress',
          ddHtml: 'jedyne checkboxy planu; wpisy N.M per kryterium, Automated / Manual, czytane i odhaczane przez /10x-implement',
        },
        {
          dt: 'plan-brief.md',
          ddHtml:
            'What &amp; Why, punkt startu, stan końcowy, <b>tabela kluczowych decyzji ze źródłem</b> (frame / research / plan), fazy w pigułce, ryzyka',
        },
      ],
      targetK: 'BRIEF:',
      targetHtml:
        'czyta się w mniej niż 2 minuty i jest pisany dla kogoś, <b>kto nie brał udziału w planowaniu</b> - tabela decyzji pokazuje rodowód: co rozstrzygnięto we wcześniejszych krokach, a co w tej sesji.',
    },
    anty: {
      num: 'ANTYWZORCE',
      h2: 'Czego dobry plan nie zawiera',
      rows: [
        {
          dt: 'Otwarte pytania',
          ddHtml:
            'żadnych w finalnym planie - napotkane w trakcie zatrzymują pracę do rozstrzygnięcia; plan ma być kompletny i wykonywalny.',
        },
        {
          dt: 'Gotowy kod',
          ddHtml:
            'plan mówi wykonawcy, co zmienić i dlaczego, nie jak pisać; rutynowa edycja = Intent w 1-2 zdaniach, Contract w jednym, koniec.',
        },
        {
          dt: 'Powtórzone pytania',
          ddHtml:
            'zero ponownego pytania o rzeczy rozstrzygnięte we frame lub researchu - to podważa zaufanie do wcześniejszych artefaktów.',
        },
        {
          dt: 'Szablonowe wypełniacze',
          ddHtml:
            'Critical Implementation Details domyślnie pomijane; generyczne rady („użyj memoizacji") nie są treścią planu.',
        },
        {
          dt: 'Checkboxy w fazach',
          ddHtml: 'bloki faz niosą zwykłe punktory; stan wykonania żyje wyłącznie w sekcji Progress.',
        },
      ],
      chainK: 'NA STRONIE ŁAŃCUCHA:',
      chainLink: 'wróć do kroku 03 (plan) na stronie Core Skills Chain',
      chainRest: ' - kontekst całego łańcucha i sąsiednie kroki.',
    },
  },
  en: {
    eyebrow: 'SKILL // CHAIN STEP 03',
    h1Html: '/10x-plan - <span class="glow">decisions before code</span>',
    subSf: 'The pilgrimage knows its route before anyone takes a step - this skill charts the route of a change.',
    subNeutral: 'This skill charts the route of a change before any code exists.',
    subRestHtml:
      '<strong>/10x-plan</strong> runs interactive, skeptical planning: it scales the number of questions to the complexity and the artifacts provided, forces decisions where they are cheap, and writes <strong>plan.md</strong> with phases, success criteria and a <strong>Progress</strong> section - plus the two-page <strong>plan-brief.md</strong>.',
    svgAria:
      'How /10x-plan works: input artifacts (research, frame) feed rounds of questions with recommendations, out of which a route of phases with success conditions emerges, saved as plan.md with a Progress section plus the plan-brief.md summary',
    svg: {
      in1: 'RESEARCH.MD',
      in2: 'FRAME.MD',
      in3: 'TASK DESCRIPTION',
      inSub: 'MORE ARTIFACTS = FEWER QUESTIONS',
      rounds: 'QUESTION ROUNDS',
      decisions: 'DECISIONS',
      phase1: 'PHASE 1',
      phase2: 'PHASE 2',
      phaseN: 'PHASE N',
      phaseSub: 'EVERY PHASE: SUCCESS CONDITIONS',
      file: 'PLAN.MD',
      fileSub: 'PHASES + PROGRESS',
      brief: 'PLAN-BRIEF.MD',
    },
    mapCap: '/10X-PLAN // THE ROUTE IS SET BEFORE IMPLEMENTATION STARTS',
    routeAria: 'Page sections',
    route: ['Why', 'Input → output', 'Mechanism', 'Anatomy of plan.md', 'Anti-patterns'],
    poco: {
      num: 'WHY',
      uniSuffix: ' · The pilgrimage route',
      h2: 'The problem: decisions made in passing',
      epigraph: '"On the map, a correction costs a pencil. On the road - a pilgrim."',
      epigraphCite: '- route arithmetic before setting out for the Time Tombs',
      p1Html:
        'Freestyle implementation makes the key decisions in the worst possible place: in the middle of writing code, in passing, with no comparison of options. <em>/10x-plan</em> pulls them out in front of the code - where changing your mind costs a text edit, not a refactor.',
      p2Html:
        'The skill is <strong>skeptical and interactive</strong> by design: it questions vague requirements, asks "why" and "what about case X", verifies the user\'s corrections with its own research, and does not write the plan in a single pass - it confirms the complexity, then the decisions, then the phase skeleton, and only at the end the details.',
      targetK: 'GOAL:',
      targetHtml:
        'crucial when a change touches many files or carries decisions that are hard to reverse (data schema, public API) - <b>decisions should be made before the code</b>, not while writing it.',
    },
    io: {
      num: 'INPUT → OUTPUT',
      h2: 'Every input artifact means fewer questions',
      p1Html:
        'The input is a task description plus artifacts from earlier steps. <strong>Every artifact provided means decisions already made</strong> - the skill reads them in full and does not ask about what the user has already written down. A frame closes the diagnostic questions (what the problem is), research - the questions about the state of the code; with both at once, only design decisions remain.',
      p2Html:
        'The scale is explicit: a task with no artifacts at MEDIUM complexity means 7-10 questions; with research 5-7; with a frame 4-6; with both 3-5. Re-asking about something settled in earlier steps is an explicitly named skill error, not overzealousness.',
      rows: [
        { dt: 'Input', ddHtml: '<b>a task description</b> + optionally research.md and/or frame.md from the change folder' },
        { dt: 'Output', ddHtml: '<b>plan.md</b> - phases with success criteria + the Progress section (a state machine)' },
        { dt: 'Output 2', ddHtml: '<b>plan-brief.md</b> - a two-page summary with a table of key decisions and their sources' },
        { dt: 'Bonus', ddHtml: 'the <b>/10x-implement &lt;change-id&gt; phase 1</b> command copied to the clipboard' },
      ],
    },
    mech: {
      num: 'MECHANISM',
      h2: 'From complexity to an approved skeleton',
      rows: [
        {
          dt: '01 · Context',
          ddHtml:
            'identifying artifacts from earlier steps, reading all the pointed-out files <b>in full</b>, plus parallel subagents for gaps the research did not cover.',
        },
        {
          dt: '02 · Complexity',
          ddHtml:
            'a LOW / MEDIUM / HIGH assessment with justification, <b>confirmed with the user</b>; it sets the question budget: LOW 4-6, MEDIUM 7-10, HIGH 11-15.',
        },
        {
          dt: '03 · Questions',
          ddHtml:
            'rounds of 1-4 questions; every option carries a recommendation and an explicit analysis: what it gives, what it costs. Categories match the domain (software / content / process), diagnostic questions are skipped when a frame is present.',
        },
        {
          dt: '04 · Implementation research',
          ddHtml:
            'patterns, conventions and integration points the skill determines <b>on its own</b> from the code and earlier work - it does not ask the user about these.',
        },
        {
          dt: '05 · Skeleton',
          ddHtml:
            'the proposed split into phases is approved before the details exist; corrections (too fine-grained / too coarse) are cheap at this stage.',
        },
        {
          dt: '06 · Write',
          ddHtml:
            'plan.md per the template + plan-brief.md; the change status moves to <b>planned</b>; then iteration with the user until it lands.',
        },
      ],
      targetK: 'RULE:',
      targetHtml:
        'the plan describes <b>the intent and the contract of the change, not finished code</b> - every item separates Intent (what and why) from Contract (interface, signature, schema, invariant); a code snippet appears only for a non-obvious change.',
    },
    anat: {
      num: 'ANATOMY',
      h2: 'plan.md and plan-brief.md - the contract and the summary',
      p1Html:
        'The <strong>"What We\'re NOT Doing"</strong> section is a dam against scope creep, and <strong>Critical Implementation Details</strong> is explicitly optional: it appears only when there is a real catch (ordering, a race, a performance budget). A plan without it is not incomplete; a plan stuffed with boilerplate points is bloated.',
      p2Html:
        'At the bottom lives <strong>Progress</strong> - the only home of checkboxes and the state machine for /10x-implement: one entry per success criterion, split into Automated / Manual, with N.M indexes that are never renumbered. The phase blocks above carry plain bullets, no checkboxes.',
      rows: [
        {
          dt: 'Overview + states',
          ddHtml:
            'what we are building and why; the current state with key discoveries (file:line); the target state with a verification method',
        },
        { dt: "What We're NOT Doing", ddHtml: 'an explicit list of things outside the scope of the change' },
        {
          dt: 'Phases',
          ddHtml:
            'Changes Required per file with an Intent / Contract pair; success criteria split into <b>automated</b> (commands) and <b>manual</b> (a human)',
        },
        {
          dt: 'Progress',
          ddHtml: 'the plan\'s only checkboxes; N.M entries per criterion, Automated / Manual, read and ticked off by /10x-implement',
        },
        {
          dt: 'plan-brief.md',
          ddHtml:
            'What &amp; Why, the starting point, the end state, <b>a table of key decisions with their source</b> (frame / research / plan), phases in a nutshell, risks',
        },
      ],
      targetK: 'BRIEF:',
      targetHtml:
        'reads in under 2 minutes and is written for someone <b>who did not take part in the planning</b> - the decision table shows the lineage: what was settled in earlier steps and what in this session.',
    },
    anty: {
      num: 'ANTI-PATTERNS',
      h2: 'What a good plan does not contain',
      rows: [
        {
          dt: 'Open questions',
          ddHtml:
            'none in the final plan - those encountered along the way stop the work until they are resolved; the plan must be complete and executable.',
        },
        {
          dt: 'Finished code',
          ddHtml:
            'the plan tells the implementer what to change and why, not how to write it; a routine edit = Intent in 1-2 sentences, Contract in one, done.',
        },
        {
          dt: 'Repeated questions',
          ddHtml:
            'zero re-asking about things settled in the frame or the research - it undermines trust in the earlier artifacts.',
        },
        {
          dt: 'Boilerplate fillers',
          ddHtml:
            'Critical Implementation Details skipped by default; generic advice ("use memoization") is not plan content.',
        },
        {
          dt: 'Checkboxes in phases',
          ddHtml: 'phase blocks carry plain bullets; execution state lives exclusively in the Progress section.',
        },
      ],
      chainK: 'ON THE CHAIN PAGE:',
      chainLink: 'back to step 03 (plan) on the Core Skills Chain page',
      chainRest: ' - the context of the whole chain and the neighboring steps.',
    },
  },
};
