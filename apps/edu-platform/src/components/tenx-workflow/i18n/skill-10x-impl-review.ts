/**
 * Slownik strony skilla /10x-impl-review (ImplReviewSkillBody) - krok 05 CSC.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html
 * zawieraja inline markup (strong/b/em) i renderuja sie przez set:html.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface SkillImplReviewDict {
  eyebrow: string;
  h1Html: string;
  subSf: string;
  subNeutral: string;
  subRestHtml: string;
  svgAria: string;
  svg: {
    plan: string;
    planSub: string;
    diff: string;
    diffSub: string;
    sub1: string;
    sub1Sub: string;
    sub2: string;
    sub2Sub: string;
    verdict: string;
    report: string;
    verdicts: string;
    triage: string;
    triageSub: string;
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
    rows: [Row, Row, Row, Row, Row, Row, Row];
    targetK: string;
    targetHtml: string;
  };
  anat: {
    num: string;
    h2: string;
    p1Html: string;
    p2Html: string;
    rows: [Row, Row, Row, Row, Row, Row];
    targetK: string;
    targetHtml: string;
  };
  granice: {
    num: string;
    h2: string;
    rows: [Row, Row, Row, Row, Row];
    chainK: string;
    chainLink: string;
    chainRest: string;
  };
}

export const SKILL_IMPL_REVIEW: Record<Lang, SkillImplReviewDict> = {
  pl: {
    eyebrow: 'SKILL // KROK 05 ŁAŃCUCHA',
    h1Html: '/10x-impl-review - <span class="glow">plan kontra kod</span>',
    subSf: 'Review istnieje po to, by wątpić - zamiast odprawiać rytuał „wygląda dobrze".',
    subNeutral: 'Review istnieje po to, by sprawdzić - zamiast akceptować „wygląda dobrze".',
    subRestHtml:
      '<strong>/10x-impl-review</strong> porównuje rzeczywistą implementację z planem: dwóch równoległych subagentów szuka dryfu i zagrożeń, komendy z kryteriów sukcesu są uruchamiane naprawdę, a wynik ląduje jako raport z werdyktem i listą findingów gotowych do triage\'u.',
    svgAria:
      'Schemat działania /10x-impl-review: plan.md i diff z repozytorium wchodzą do dwóch równoległych subagentów - detekcji dryfu oraz skanu bezpieczeństwa i wzorców - których wyniki łączą się w raport z werdyktem, a raport przechodzi w pętlę triage\'u findingów',
    svg: {
      plan: 'PLAN.MD',
      planSub: 'OBIETNICA',
      diff: 'DIFF',
      diffSub: 'RZECZYWISTOŚĆ OD DATY PLANU',
      sub1: 'SUBAGENT: DRYF',
      sub1Sub: 'MATCH / DRIFT / MISSING / EXTRA',
      sub2: 'SUBAGENT: JAKOŚĆ',
      sub2Sub: 'BEZPIECZEŃSTWO // WZORCE',
      verdict: 'WERDYKT',
      report: 'RAPORT',
      verdicts: 'APPROVED / ATTENTION / REJECTED',
      triage: 'TRIAGE',
      triageSub: 'FINDING PO FINDINGU',
    },
    mapCap: '/10X-IMPL-REVIEW // OBIETNICA PLANU KONFRONTOWANA Z DIFFEM',
    routeAria: 'Sekcje strony',
    route: ['Po co', 'Wejście → wyjście', 'Mechanizm', 'Anatomia findingu', 'Granice'],
    poco: {
      num: 'PO CO',
      uniSuffix: ' · Zrozumienie zamiast rytuału',
      h2: 'Problem: akceptacja bez sprawdzenia obietnic',
      epigraph: '„Rytuał uspokaja maszynę. Zrozumienie mówi, czy działa."',
      epigraphCite: '- herezja użyteczna, oddział kogitatorów',
      p1Html:
        '„Działa, mergujemy" to akceptacja bez sprawdzenia, czy kod dotrzymał obietnic planu. Dryf, niebezpieczne decyzje i łamanie konwencji kumulują się po cichu - każda faza dokłada odrobinę, aż rozjazd staje się architekturą. <em>/10x-impl-review</em> łapie to, zanim się utrwali.',
      p2Html:
        'Dwa zakresy: <strong>review pojedynczej fazy</strong> (szybki, tuż po jej domknięciu) i <strong>pełny przegląd planu</strong> przed merge. Dwa tryby: świeży review z triage\'em oraz <strong>wznowienie</strong> - zapisany raport otwiera się później i triage rusza od pozycji nierozstrzygniętych.',
      targetK: 'CEL:',
      targetHtml:
        'kluczowy przed merge - im większy diff, tym łatwiej o <b>dryf między tym, co plan obiecał, a tym, co kod robi</b>.',
    },
    io: {
      num: 'WEJŚCIE → WYJŚCIE',
      h2: 'Z planu i diffa do zapisanego raportu',
      p1Html:
        'Wejściem jest <strong>plan.md</strong> (change-id, ścieżka albo numer fazy) i faktyczny stan repozytorium - diff wyznaczany od daty planu. Zestawienie plików z planu z plikami z diffa daje trzy klasy: <strong>oczekiwane</strong> (w obu - weryfikuj treść), <strong>nieplanowane</strong> (tylko w diffie - zbadaj i oflaguj), <strong>brakujące</strong> (tylko w planie - potencjalnie niezaimplementowane).',
      p2Html:
        'Wyjściem jest raport w <strong>reviews/</strong> folderu zmiany - zapisywany <strong>zawsze</strong>, niezależnie od tego, czy triage rusza teraz, później czy wcale. Wraz z zapisem change.md dostaje status <em>impl_reviewed</em>.',
      rows: [
        { dt: 'Wejście', ddHtml: '<b>plan.md</b> + diff od daty planu; alternatywnie zapisany raport (wznowienie triage\'u)' },
        {
          dt: 'Wyjście',
          ddHtml: 'raport w <b>context/changes/&lt;change-id&gt;/reviews/</b> z werdyktem i findingami z polem Decision',
        },
        {
          dt: 'Werdykt',
          ddHtml: '<b>APPROVED / NEEDS ATTENTION / REJECTED</b> - z werdyktami cząstkowymi w sześciu wymiarach',
        },
      ],
    },
    mech: {
      num: 'MECHANIZM',
      h2: 'Dwóch subagentów, realne komendy, triage',
      rows: [
        {
          dt: '01 · Kontekst',
          ddHtml:
            'plan czytany w całości, stan z sekcji Progress, reguły z lessons.md przyjmowane z góry - naruszenie zaakceptowanej reguły to mocniejszy sygnał niż generyczna uwaga stylistyczna.',
        },
        {
          dt: '02 · Zakres z gita',
          ddHtml:
            'commity i diff od daty planu; lista plików zmienionych kontra lista z planu wyznacza, co jest oczekiwane, nieplanowane i brakujące.',
        },
        {
          dt: '03 · Subagent dryfu',
          ddHtml:
            'dla każdej planowanej zmiany czyta faktyczny plik i orzeka: <b>MATCH / DRIFT / MISSING / EXTRA</b> - rozjazd intencji, nie formatowania.',
        },
        {
          dt: '04 · Subagent jakości',
          ddHtml:
            'równolegle: bezpieczeństwo (injection, sekrety, authn/authz), wydajność (N+1, brak paginacji), niezawodność (obsługa błędów na granicach), bezpieczeństwo danych oraz zgodność ze wzorcami sąsiednich plików.',
        },
        {
          dt: '05 · Kryteria naprawdę',
          ddHtml:
            'komendy z kryteriów automatycznych są <b>uruchamiane</b>, wynik porównany z deklaracjami; pozycje ręczne odhaczone bez śladu w diffie są flagowane jako możliwe zatwierdzenie w ciemno (rubber-stamping).',
        },
        {
          dt: '06 · Raport',
          ddHtml:
            'findingi posortowane po severity, maks. 10 (pokrewne konsolidowane); zapis na dysk i stempel statusu <b>zawsze przed</b> pytaniem, co dalej.',
        },
        {
          dt: '07 · Triage',
          ddHtml:
            'pętla po findingach: napraw teraz, napraw inaczej, pomiń, albo zapisz jako lekcję do lessons.md; każda decyzja wraca do zapisanego raportu, więc triage można przerwać i wznowić.',
        },
      ],
      targetK: 'ZASADA:',
      targetHtml:
        'review <b>domyślnie analizuje i raportuje</b> - edycje kodu zdarzają się wyłącznie w triage\'u, gdy użytkownik jawnie wybierze naprawę konkretnego findingu.',
    },
    anat: {
      num: 'ANATOMIA',
      h2: 'Finding - dowód, nie opinia',
      p1Html:
        'Każdy finding niesie dowód w formule <strong>„plan mówił X, kod robi Y"</strong> z lokalizacją plik:linia oraz propozycję naprawy z analizą kompromisów. Dwie opcje naprawy pojawiają się tylko przy prawdziwym dylemacie - słabych alternatyw nie wymyśla się na siłę.',
      p2Html:
        'Kluczowa para wymiarów: <strong>severity</strong> mówi, jak źle będzie, gdy problem zostanie zignorowany; <strong>impact</strong> - ile namysłu wymaga decyzja. To osie ortogonalne: CRITICAL z niskim impactem to oczywista jednolinijkowa poprawka, a WARNING z wysokim impactem zasługuje na dłuższy namysł niż niejeden CRITICAL.',
      rows: [
        { dt: 'Severity', ddHtml: '<b>CRITICAL / WARNING / OBSERVATION</b> - waga problemu przy zignorowaniu' },
        { dt: 'Impact', ddHtml: '<b>LOW / MEDIUM / HIGH</b> - koszt decyzji: od szybkiej poprawki po stawkę architektoniczną' },
        {
          dt: 'Wymiar',
          ddHtml:
            'jeden z sześciu: Plan Adherence, Scope Discipline, Safety &amp; Quality, Architecture, Pattern Consistency, Success Criteria',
        },
        { dt: 'Dowód', ddHtml: 'lokalizacja plik:linia + Detail zestawiający zapis planu z faktycznym kodem' },
        { dt: 'Naprawa', ddHtml: '1-2 opcje z mocnymi stronami, kosztami, poziomem pewności i jawnym martwym polem' },
        {
          dt: 'Decision',
          ddHtml: 'PENDING → FIXED / SKIPPED / ACCEPTED / DISMISSED - pole w raporcie aktualizowane podczas triage\'u',
        },
      ],
      targetK: 'WERDYKT CAŁOŚCI:',
      targetHtml:
        '<b>APPROVED</b> - wszystko przechodzi lub maks. 2 drobne ostrzeżenia; <b>NEEDS ATTENTION</b> - wiele ostrzeżeń lub jeden niekrytyczny FAIL; <b>REJECTED</b> - dowolny krytyczny FAIL (bezpieczeństwo, poważny dryf, dane, oblane testy).',
    },
    granice: {
      num: 'GRANICE',
      h2: 'Czego /10x-impl-review nie robi',
      rows: [
        {
          dt: 'Nie poprawia po cichu',
          ddHtml:
            'zmiany w kodzie tylko na jawny wybór użytkownika w triage\'u - i wtedy minimalne, celowane edycje, bez refaktorowania okolicy.',
        },
        {
          dt: 'Nie flaguje stylu',
          ddHtml:
            'drobne różnice stylistyczne, gdy kod działa i realizuje plan, to co najwyżej obserwacje - nie ostrzeżenia.',
        },
        {
          dt: 'Nie oszczędza planu',
          ddHtml:
            'jeśli sam plan był wadliwy (np. zaplanowano niebezpieczne podejście), review flaguje plan - nie tylko kod.',
        },
        {
          dt: 'Nie kłóci się przy „pomiń"',
          ddHtml:
            'decyzja użytkownika zapisywana bez dyskusji; przy review fazy sprawdza też, czy nie złamała założeń faz wcześniejszych.',
        },
        {
          dt: 'Nie dotyka archiwum',
          ddHtml: 'do zarchiwizowanych planów review nie jest dopisywany - odmowa wprost.',
        },
      ],
      chainK: 'NA STRONIE ŁAŃCUCHA:',
      chainLink: 'wróć do kroku 05 (review) na stronie Core Skills Chain',
      chainRest: ' - kontekst całego łańcucha i sąsiednie kroki.',
    },
  },
  en: {
    eyebrow: 'SKILL // CHAIN STEP 05',
    h1Html: '/10x-impl-review - <span class="glow">plan versus code</span>',
    subSf: 'Review exists to doubt - instead of performing the "looks good" ritual.',
    subNeutral: 'Review exists to check - instead of accepting "looks good".',
    subRestHtml:
      '<strong>/10x-impl-review</strong> compares the actual implementation against the plan: two parallel subagents look for drift and hazards, the commands from the success criteria are actually run, and the result lands as a report with a verdict and a list of findings ready for triage.',
    svgAria:
      'How /10x-impl-review works: plan.md and the repository diff enter two parallel subagents - drift detection plus a safety and pattern scan - whose results merge into a report with a verdict, and the report flows into a finding-by-finding triage loop',
    svg: {
      plan: 'PLAN.MD',
      planSub: 'THE PROMISE',
      diff: 'DIFF',
      diffSub: 'REALITY SINCE THE PLAN DATE',
      sub1: 'SUBAGENT: DRIFT',
      sub1Sub: 'MATCH / DRIFT / MISSING / EXTRA',
      sub2: 'SUBAGENT: QUALITY',
      sub2Sub: 'SAFETY // PATTERNS',
      verdict: 'VERDICT',
      report: 'REPORT',
      verdicts: 'APPROVED / ATTENTION / REJECTED',
      triage: 'TRIAGE',
      triageSub: 'FINDING BY FINDING',
    },
    mapCap: '/10X-IMPL-REVIEW // THE PLAN\'S PROMISE CONFRONTED WITH THE DIFF',
    routeAria: 'Page sections',
    route: ['Why', 'Input → output', 'Mechanism', 'Anatomy of a finding', 'Boundaries'],
    poco: {
      num: 'WHY',
      uniSuffix: ' · Understanding over ritual',
      h2: 'The problem: acceptance without checking the promises',
      epigraph: '"Ritual calms the machine. Understanding tells you whether it works."',
      epigraphCite: '- a useful heresy, cogitator detachment',
      p1Html:
        '"It works, let\'s merge" is acceptance without checking whether the code kept the plan\'s promises. Drift, dangerous decisions and convention violations accumulate quietly - every phase adds a little, until the divergence becomes the architecture. <em>/10x-impl-review</em> catches it before it sets in.',
      p2Html:
        'Two scopes: a <strong>single-phase review</strong> (fast, right after the phase closes) and a <strong>full plan review</strong> before merge. Two modes: a fresh review with triage, and <strong>resume</strong> - a saved report is opened later and triage picks up from the unresolved items.',
      targetK: 'GOAL:',
      targetHtml:
        'crucial before merge - the bigger the diff, the easier the <b>drift between what the plan promised and what the code does</b>.',
    },
    io: {
      num: 'INPUT → OUTPUT',
      h2: 'From a plan and a diff to a saved report',
      p1Html:
        'The input is <strong>plan.md</strong> (change-id, a path or a phase number) and the actual state of the repository - the diff is taken since the plan date. Matching the plan\'s file list against the diff\'s file list yields three classes: <strong>expected</strong> (in both - verify the content), <strong>unplanned</strong> (only in the diff - investigate and flag), <strong>missing</strong> (only in the plan - potentially unimplemented).',
      p2Html:
        'The output is a report in the change folder\'s <strong>reviews/</strong> - saved <strong>always</strong>, regardless of whether triage starts now, later or not at all. Along with the save, change.md gets the <em>impl_reviewed</em> status.',
      rows: [
        { dt: 'Input', ddHtml: '<b>plan.md</b> + the diff since the plan date; alternatively a saved report (triage resume)' },
        {
          dt: 'Output',
          ddHtml: 'a report in <b>context/changes/&lt;change-id&gt;/reviews/</b> with a verdict and findings carrying a Decision field',
        },
        {
          dt: 'Verdict',
          ddHtml: '<b>APPROVED / NEEDS ATTENTION / REJECTED</b> - with partial verdicts across six dimensions',
        },
      ],
    },
    mech: {
      num: 'MECHANISM',
      h2: 'Two subagents, real commands, triage',
      rows: [
        {
          dt: '01 · Context',
          ddHtml:
            'the plan read in full, state from the Progress section, rules from lessons.md taken as given - violating an accepted rule is a stronger signal than a generic style remark.',
        },
        {
          dt: '02 · Scope from git',
          ddHtml:
            'commits and the diff since the plan date; the list of changed files versus the plan\'s list determines what is expected, unplanned and missing.',
        },
        {
          dt: '03 · Drift subagent',
          ddHtml:
            'for every planned change it reads the actual file and rules: <b>MATCH / DRIFT / MISSING / EXTRA</b> - divergence of intent, not of formatting.',
        },
        {
          dt: '04 · Quality subagent',
          ddHtml:
            'in parallel: safety (injection, secrets, authn/authz), performance (N+1, missing pagination), reliability (error handling at the boundaries), data safety, and consistency with the patterns of neighboring files.',
        },
        {
          dt: '05 · Criteria for real',
          ddHtml:
            'commands from the automated criteria are <b>actually run</b>, the results compared with the declarations; manual items ticked off with no trace in the diff are flagged as possible rubber-stamping.',
        },
        {
          dt: '06 · Report',
          ddHtml:
            'findings sorted by severity, max 10 (related ones consolidated); the write to disk and the status stamp happen <b>always before</b> asking what comes next.',
        },
        {
          dt: '07 · Triage',
          ddHtml:
            'a loop over the findings: fix now, fix differently, skip, or record as a lesson in lessons.md; every decision goes back into the saved report, so triage can be paused and resumed.',
        },
      ],
      targetK: 'RULE:',
      targetHtml:
        'the review <b>analyzes and reports by default</b> - code edits happen only in triage, when the user explicitly chooses to fix a specific finding.',
    },
    anat: {
      num: 'ANATOMY',
      h2: 'A finding - evidence, not opinion',
      p1Html:
        'Every finding carries evidence in the formula <strong>"the plan said X, the code does Y"</strong> with a file:line location, plus a fix proposal with a trade-off analysis. Two fix options appear only for a genuine dilemma - weak alternatives are not invented for the sake of it.',
      p2Html:
        'The key pair of dimensions: <strong>severity</strong> says how bad it gets if the problem is ignored; <strong>impact</strong> - how much deliberation the decision requires. These are orthogonal axes: a CRITICAL with low impact is an obvious one-line fix, while a WARNING with high impact deserves more thought than many a CRITICAL.',
      rows: [
        { dt: 'Severity', ddHtml: '<b>CRITICAL / WARNING / OBSERVATION</b> - the weight of the problem if ignored' },
        { dt: 'Impact', ddHtml: '<b>LOW / MEDIUM / HIGH</b> - the cost of the decision: from a quick fix to architectural stakes' },
        {
          dt: 'Dimension',
          ddHtml:
            'one of six: Plan Adherence, Scope Discipline, Safety &amp; Quality, Architecture, Pattern Consistency, Success Criteria',
        },
        { dt: 'Evidence', ddHtml: 'a file:line location + a Detail juxtaposing the plan\'s wording with the actual code' },
        { dt: 'Fix', ddHtml: '1-2 options with strengths, costs, a confidence level and an explicit blind spot' },
        {
          dt: 'Decision',
          ddHtml: 'PENDING → FIXED / SKIPPED / ACCEPTED / DISMISSED - a report field updated during triage',
        },
      ],
      targetK: 'OVERALL VERDICT:',
      targetHtml:
        '<b>APPROVED</b> - everything passes or at most 2 minor warnings; <b>NEEDS ATTENTION</b> - multiple warnings or one non-critical FAIL; <b>REJECTED</b> - any critical FAIL (safety, serious drift, data, failed tests).',
    },
    granice: {
      num: 'BOUNDARIES',
      h2: 'What /10x-impl-review does not do',
      rows: [
        {
          dt: 'Does not fix quietly',
          ddHtml:
            'code changes only on the user\'s explicit choice in triage - and then minimal, targeted edits, without refactoring the neighborhood.',
        },
        {
          dt: 'Does not flag style',
          ddHtml:
            'minor stylistic differences, when the code works and delivers the plan, are at most observations - not warnings.',
        },
        {
          dt: 'Does not spare the plan',
          ddHtml:
            'if the plan itself was flawed (e.g. a dangerous approach was planned), the review flags the plan - not just the code.',
        },
        {
          dt: 'Does not argue with "skip"',
          ddHtml:
            'the user\'s decision is recorded without debate; in a phase review it also checks whether the phase broke the assumptions of earlier phases.',
        },
        {
          dt: 'Does not touch the archive',
          ddHtml: 'reviews are not appended to archived plans - an outright refusal.',
        },
      ],
      chainK: 'ON THE CHAIN PAGE:',
      chainLink: 'back to step 05 (review) on the Core Skills Chain page',
      chainRest: ' - the context of the whole chain and the neighboring steps.',
    },
  },
};
