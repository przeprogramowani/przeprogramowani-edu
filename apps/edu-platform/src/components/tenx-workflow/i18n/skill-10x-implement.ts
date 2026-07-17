/**
 * Slownik strony skilla /10x-implement (ImplementSkillBody) - krok 04 CSC.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html
 * zawieraja inline markup (strong/b/em) i renderuja sie przez set:html.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface Row {
  dt: string;
  ddHtml: string;
}

interface SkillImplementDict {
  eyebrow: string;
  h1Html: string;
  subSf: string;
  subNeutral: string;
  subRestHtml: string;
  svgAria: string;
  svg: {
    phase1: string;
    start: string;
    crit1: string;
    crit2: string;
    gate: string;
    gateSub1: string;
    gateSub2: string;
    commit: string;
    commitSub: string;
    phase2: string;
    next: string;
    commit2: string;
    epilog: string;
    epilogSub: string;
    resume: string;
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
    rows: [Row, Row, Row, Row];
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

export const SKILL_IMPLEMENT: Record<Lang, SkillImplementDict> = {
  pl: {
    eyebrow: 'SKILL // KROK 04 ŁAŃCUCHA',
    h1Html: '/10x-implement - <span class="glow">realizacja etap po etapie</span>',
    subSf: 'Rocinante nie leci do celu jednym odpaleniem - koryguje kurs w punktach kontrolnych.',
    subNeutral: 'Duża zmiana nie powstaje jednym diffem - rośnie od punktu kontrolnego do punktu kontrolnego.',
    subRestHtml:
      '<strong>/10x-implement</strong> realizuje zatwierdzony <strong>plan.md</strong> faza po fazie: każda kończy się weryfikacją, bramą ręcznego potwierdzenia i commitem, a sekcja <strong>Progress</strong> w planie jest jedyną maszyną stanów - przerwana sesja wraca od ostatniego zielonego etapu.',
    svgAria:
      'Schemat działania /10x-implement: szyna faz, w której każda faza przechodzi przez kryteria automatyczne, bramę ręcznej weryfikacji i commit z SHA wpisywanym do sekcji Progress; na końcu commit epilogowy zamyka plan',
    svg: {
      phase1: 'FAZA 1',
      start: 'START',
      crit1: 'KRYTERIA',
      crit2: 'AUTOMATYCZNE',
      gate: 'BRAMA',
      gateSub1: 'CZŁOWIEK',
      gateSub2: 'POTWIERDZA',
      commit: 'COMMIT',
      commitSub: 'SHA → PROGRESS',
      phase2: 'FAZA 2',
      next: 'DALEJ',
      commit2: 'COMMIT',
      epilog: 'EPILOG',
      epilogSub: 'IMPLEMENTED',
      resume: 'PRZERWANA SESJA WRACA OD PIERWSZEGO NIEODHACZONEGO WIERSZA PROGRESS',
    },
    mapCap: '/10X-IMPLEMENT // KAŻDA FAZA TO PUNKT POWROTU',
    routeAria: 'Sekcje strony',
    route: ['Po co', 'Wejście → wyjście', 'Mechanizm', 'Anatomia Progress', 'Granice'],
    poco: {
      num: 'PO CO',
      uniSuffix: ' · Flip & burn',
      h2: 'Problem: jeden wielki diff bez punktów kontrolnych',
      epigraph: '„Pół drogi ciągu, obrót, pół drogi hamowania - i korekty po drodze."',
      epigraphCite: '- profil lotu, który da się przerwać w każdym punkcie',
      p1Html:
        'Zmiana realizowana jednym ciągiem nie ma miejsc, w których można ją bezpiecznie przerwać, zweryfikować albo cofnąć. <em>/10x-implement</em> tnie wykonanie na fazy z planu: faza kończy się dopiero, gdy jej kryteria sukcesu są zielone, człowiek potwierdził testy ręczne, a zmiana siedzi w commicie z SHA wpisanym do Progress.',
      p2Html:
        'Filozofia: <strong>podążaj za intencją planu, adaptując się do zastanego kodu</strong>. Plany są projektowane starannie, ale rzeczywistość bywa nieuporządkowana - przy rozjeździe skill zatrzymuje się i przedstawia problem (oczekiwane / zastane / dlaczego to istotne), zamiast improwizować po cichu.',
      targetK: 'CEL:',
      targetHtml:
        'kluczowy przy długiej lub przerywanej pracy - <b>każda faza to punkt powrotu</b>: commit plus zielone kryteria zamiast jednego wielkiego diffa na koniec.',
    },
    io: {
      num: 'WEJŚCIE → WYJŚCIE',
      h2: 'Z zatwierdzonego planu do commitów per faza',
      p1Html:
        'Wejściem jest <strong>plan.md</strong> z folderu zmiany, opcjonalnie z numerem fazy (<em>/10x-implement oauth-login phase 2</em>). Skill czyta plan w całości, wszystkie pliki, do których plan się odwołuje, oraz <em>lessons.md</em> - zaakceptowane reguły zespołu kształtują każdą decyzję implementacyjną w tym przebiegu.',
      p2Html:
        'Wyjściem jest seria <strong>commitów w konwencji Conventional Commits</strong> - po jednym na fazę, w formie <em>typ(change-id): tytuł fazy (pN)</em> - oraz odhaczona sekcja Progress, w której każdy domknięty wiersz nosi skrócony SHA zamykającego commita.',
      rows: [
        { dt: 'Wejście', ddHtml: '<b>plan.md</b> (change-id lub ścieżka) + opcjonalny numer fazy' },
        { dt: 'Wyjście', ddHtml: '<b>commit per faza</b> (Conventional Commits) + Progress z SHA przy każdym wierszu' },
        { dt: 'Status', ddHtml: 'change.md: <b>implementing</b> na wejściu, <b>implemented</b> po ostatniej fazie i epilogu' },
      ],
    },
    mech: {
      num: 'MECHANIZM',
      h2: 'Rytuał końca fazy - sekwencja, nie sugestia',
      rows: [
        {
          dt: '01 · Start',
          ddHtml:
            'pierwszy nieodhaczony wiersz Progress wyznacza miejsce startu; ukończonej pracy się ufa - weryfikacja tylko, gdy coś wygląda podejrzanie.',
        },
        {
          dt: '02 · Implementacja',
          ddHtml:
            'faza realizowana w całości przed następną; każdy edytowany plik trafia do <b>zbioru plików dotkniętych</b> - kanonicznego wejścia do stagingu, nadrzędnego wobec heurystyk z git status.',
        },
        {
          dt: '03 · Weryfikacja',
          ddHtml:
            'komendy z kryteriów automatycznych muszą przejść; problemy naprawiane przed pójściem dalej; odhaczane wiersze Progress - po jednym na krok.',
        },
        {
          dt: '04 · Brama ręczna',
          ddHtml:
            'skill wypisuje testy ręczne z planu i <b>czeka na potwierdzenie człowieka</b>; przy ostatniej fazie dokłada zbiorczą listę zaległych pozycji ręcznych z faz wcześniejszych.',
        },
        {
          dt: '05 · Commit',
          ddHtml:
            'staging jawnie po ścieżkach ze zbioru dotkniętych (nigdy git add -A); niezwiązane brudne ścieżki wywołują pytanie zamiast cichego dołączenia; komunikat commita zatwierdza użytkownik.',
        },
        {
          dt: '06 · SHA i dalej',
          ddHtml:
            'skrócony SHA wraca do każdego wiersza fazy w Progress; potem decyzja: kontynuuj, wyczyść kontekst (komenda wznowienia w schowku) albo review fazy przez /10x-impl-review.',
        },
        {
          dt: '07 · Epilog',
          ddHtml:
            'po ostatniej fazie zamykający commit epilogowy domyka SHA ostatniej fazy i status implemented - bez niego archiwizacja zatrzyma się na zmianach bez commita.',
        },
      ],
      targetK: 'ZASADA:',
      targetHtml:
        'przy rozjeździe z planem <b>trzy wyjścia, decyzja człowieka</b>: adaptuj i kontynuuj, pomiń ten fragment, albo zatrzymaj się i wróć do planowania.',
    },
    anat: {
      num: 'ANATOMIA',
      h2: 'Progress - maszyna stanów bez plików stanu',
      p1Html:
        'Sekcja <strong>Progress</strong> na dole plan.md to jedyne źródło prawdy o wykonaniu: żadnego JSON-a obok, żadnych markerów w komentarzach, żadnego pliku pomocniczego. Stan nie jest przechowywany, tylko <strong>wyprowadzany</strong>: pierwszy nieodhaczony wiersz = następny krok; faza bieżąca = nagłówek nad nim; ukończenie = stosunek odhaczonych do wszystkich.',
      p2Html:
        'Skill mutuje <strong>wyłącznie Progress</strong> - bloki faz (Overview, Changes Required, Success Criteria) są tylko do odczytu. W środku fazy odhaczone wiersze bez SHA to poprawny stan pośredni; SHA dopisuje się zbiorczo na końcu fazy, po zamykającym commicie.',
      rows: [
        {
          dt: 'Wiersz',
          ddHtml: 'checkbox + indeks <b>N.M</b> + tytuł kryterium; po domknięciu fazy dochodzi skrócony SHA commita',
        },
        {
          dt: 'Podział',
          ddHtml: 'podsekcje <b>Automated</b> (komendy, testy, typy) i <b>Manual</b> (człowiek patrzy na wynik) per faza',
        },
        {
          dt: 'Indeksy',
          ddHtml: '1-based, unikalne w fazie, <b>nigdy nie przenumerowywane</b>; usunięte kroki zostawiają luki',
        },
        {
          dt: 'Fazy bez diffa',
          ddHtml:
            'faza czysto ręczna nie tworzy commita i zostaje bez SHA - /10x-archive zgłosi to jako ostrzeżenie informacyjne, nie błąd',
        },
      ],
      targetK: '„GDZIE JESTEM?":',
      targetHtml:
        'odpowiedź zawsze wynika z parsowania Progress - dzięki temu <b>przerwana sesja wraca od ostatniego zielonego etapu, nie od zera</b>, a stan nie może się rozjechać z rzeczywistością.',
    },
    granice: {
      num: 'GRANICE',
      h2: 'Czego /10x-implement nie robi',
      rows: [
        {
          dt: 'Nie odhacza za człowieka',
          ddHtml: 'pozycje ręczne czekają na potwierdzenie użytkownika - bez wyjątków.',
        },
        {
          dt: 'Nie commituje hurtem',
          ddHtml: 'żadnego git add -A ani git add . - staging wyłącznie jawnymi ścieżkami ze zbioru plików dotkniętych.',
        },
        {
          dt: 'Nie obchodzi bramek',
          ddHtml: 'nigdy --no-verify ani --amend; po nieudanym hooku naprawa problemu i nowy commit, nie poprawianie historii.',
        },
        {
          dt: 'Nie edytuje planu',
          ddHtml: 'bloki faz są read-only; mutacji podlega wyłącznie sekcja Progress i change.md.',
        },
        { dt: 'Nie wykonuje archiwum', ddHtml: 'plan w context/archive/ = odmowa i wskazanie /10x-new.' },
      ],
      chainK: 'NA STRONIE ŁAŃCUCHA:',
      chainLink: 'wróć do kroku 04 (implement) na stronie Core Skills Chain',
      chainRest: ' - kontekst całego łańcucha i sąsiednie kroki.',
    },
  },
  en: {
    eyebrow: 'SKILL // CHAIN STEP 04',
    h1Html: '/10x-implement - <span class="glow">execution stage by stage</span>',
    subSf: 'The Rocinante does not reach its target on a single burn - it corrects course at checkpoints.',
    subNeutral: 'A large change is not born as one diff - it grows from checkpoint to checkpoint.',
    subRestHtml:
      '<strong>/10x-implement</strong> executes an approved <strong>plan.md</strong> phase by phase: each one ends with verification, a manual confirmation gate and a commit, and the <strong>Progress</strong> section in the plan is the only state machine - an interrupted session resumes from the last green stage.',
    svgAria:
      'How /10x-implement works: a rail of phases in which every phase passes through automated criteria, a manual verification gate and a commit whose SHA is written into the Progress section; at the end an epilogue commit closes the plan',
    svg: {
      phase1: 'PHASE 1',
      start: 'START',
      crit1: 'AUTOMATED',
      crit2: 'CRITERIA',
      gate: 'GATE',
      gateSub1: 'HUMAN',
      gateSub2: 'CONFIRMS',
      commit: 'COMMIT',
      commitSub: 'SHA → PROGRESS',
      phase2: 'PHASE 2',
      next: 'NEXT',
      commit2: 'COMMIT',
      epilog: 'EPILOGUE',
      epilogSub: 'IMPLEMENTED',
      resume: 'AN INTERRUPTED SESSION RESUMES FROM THE FIRST UNCHECKED PROGRESS ROW',
    },
    mapCap: '/10X-IMPLEMENT // EVERY PHASE IS A RETURN POINT',
    routeAria: 'Page sections',
    route: ['Why', 'Input → output', 'Mechanism', 'Anatomy of Progress', 'Boundaries'],
    poco: {
      num: 'WHY',
      uniSuffix: ' · Flip & burn',
      h2: 'The problem: one big diff with no checkpoints',
      epigraph: '"Half the way under thrust, flip, half the way braking - and corrections along the way."',
      epigraphCite: '- a flight profile that can be aborted at any point',
      p1Html:
        'A change executed in one continuous burn has no places where it can be safely interrupted, verified or rolled back. <em>/10x-implement</em> cuts the execution into the plan\'s phases: a phase ends only when its success criteria are green, a human has confirmed the manual tests, and the change sits in a commit with its SHA written into Progress.',
      p2Html:
        'The philosophy: <strong>follow the plan\'s intent, adapting to the code you find</strong>. Plans are designed carefully, but reality gets messy - on divergence the skill stops and presents the problem (expected / found / why it matters) instead of quietly improvising.',
      targetK: 'GOAL:',
      targetHtml:
        'crucial for long or interrupted work - <b>every phase is a return point</b>: a commit plus green criteria instead of one giant diff at the end.',
    },
    io: {
      num: 'INPUT → OUTPUT',
      h2: 'From an approved plan to commits per phase',
      p1Html:
        'The input is <strong>plan.md</strong> from the change folder, optionally with a phase number (<em>/10x-implement oauth-login phase 2</em>). The skill reads the plan in full, every file the plan refers to, and <em>lessons.md</em> - the team\'s accepted rules shape every implementation decision in this run.',
      p2Html:
        'The output is a series of <strong>commits in the Conventional Commits convention</strong> - one per phase, in the form <em>type(change-id): phase title (pN)</em> - and a ticked-off Progress section in which every closed row carries the short SHA of the closing commit.',
      rows: [
        { dt: 'Input', ddHtml: '<b>plan.md</b> (change-id or a path) + an optional phase number' },
        { dt: 'Output', ddHtml: '<b>a commit per phase</b> (Conventional Commits) + Progress with a SHA on every row' },
        { dt: 'Status', ddHtml: 'change.md: <b>implementing</b> on entry, <b>implemented</b> after the last phase and the epilogue' },
      ],
    },
    mech: {
      num: 'MECHANISM',
      h2: 'The end-of-phase ritual - a sequence, not a suggestion',
      rows: [
        {
          dt: '01 · Start',
          ddHtml:
            'the first unchecked Progress row marks the starting point; completed work is trusted - verification only when something looks suspicious.',
        },
        {
          dt: '02 · Implementation',
          ddHtml:
            'a phase is completed in full before the next one; every edited file goes into the <b>touched-files set</b> - the canonical staging input, overriding git status heuristics.',
        },
        {
          dt: '03 · Verification',
          ddHtml:
            'commands from the automated criteria must pass; problems are fixed before moving on; Progress rows are ticked off - one per step.',
        },
        {
          dt: '04 · Manual gate',
          ddHtml:
            'the skill lists the manual tests from the plan and <b>waits for human confirmation</b>; on the last phase it adds a combined list of outstanding manual items from earlier phases.',
        },
        {
          dt: '05 · Commit',
          ddHtml:
            'staging explicitly by paths from the touched set (never git add -A); unrelated dirty paths trigger a question instead of silent inclusion; the commit message is approved by the user.',
        },
        {
          dt: '06 · SHA and onward',
          ddHtml:
            'the short SHA goes back into every row of the phase in Progress; then a decision: continue, clear the context (a resume command in the clipboard) or review the phase with /10x-impl-review.',
        },
        {
          dt: '07 · Epilogue',
          ddHtml:
            'after the last phase, a closing epilogue commit seals the last phase\'s SHA and the implemented status - without it, archiving will stop on uncommitted changes.',
        },
      ],
      targetK: 'RULE:',
      targetHtml:
        'on divergence from the plan, <b>three exits, human decision</b>: adapt and continue, skip this fragment, or stop and go back to planning.',
    },
    anat: {
      num: 'ANATOMY',
      h2: 'Progress - a state machine without state files',
      p1Html:
        'The <strong>Progress</strong> section at the bottom of plan.md is the only source of truth about execution: no JSON on the side, no markers in comments, no helper file. State is not stored but <strong>derived</strong>: the first unchecked row = the next step; the current phase = the header above it; completion = the ratio of checked rows to all of them.',
      p2Html:
        'The skill mutates <strong>Progress only</strong> - the phase blocks (Overview, Changes Required, Success Criteria) are read-only. Mid-phase, checked rows without a SHA are a valid intermediate state; SHAs are added in bulk at the end of the phase, after the closing commit.',
      rows: [
        {
          dt: 'Row',
          ddHtml: 'a checkbox + an <b>N.M</b> index + the criterion title; once the phase closes, the commit\'s short SHA is added',
        },
        {
          dt: 'Split',
          ddHtml: '<b>Automated</b> (commands, tests, types) and <b>Manual</b> (a human looks at the result) subsections per phase',
        },
        {
          dt: 'Indexes',
          ddHtml: '1-based, unique within a phase, <b>never renumbered</b>; removed steps leave gaps',
        },
        {
          dt: 'Phases without a diff',
          ddHtml:
            'a purely manual phase creates no commit and stays without a SHA - /10x-archive reports it as an informational warning, not an error',
        },
      ],
      targetK: '"WHERE AM I?":',
      targetHtml:
        'the answer always comes from parsing Progress - which is why <b>an interrupted session resumes from the last green stage, not from zero</b>, and the state cannot drift away from reality.',
    },
    granice: {
      num: 'BOUNDARIES',
      h2: 'What /10x-implement does not do',
      rows: [
        {
          dt: 'Does not tick off for the human',
          ddHtml: 'manual items wait for the user\'s confirmation - no exceptions.',
        },
        {
          dt: 'Does not commit in bulk',
          ddHtml: 'no git add -A and no git add . - staging happens exclusively with explicit paths from the touched-files set.',
        },
        {
          dt: 'Does not bypass gates',
          ddHtml: 'never --no-verify or --amend; after a failed hook, the problem gets fixed and a new commit is made - history is not rewritten.',
        },
        {
          dt: 'Does not edit the plan',
          ddHtml: 'phase blocks are read-only; only the Progress section and change.md are mutated.',
        },
        { dt: 'Does not execute from the archive', ddHtml: 'a plan in context/archive/ = refusal and a pointer to /10x-new.' },
      ],
      chainK: 'ON THE CHAIN PAGE:',
      chainLink: 'back to step 04 (implement) on the Core Skills Chain page',
      chainRest: ' - the context of the whole chain and the neighboring steps.',
    },
  },
};
