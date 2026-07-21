/**
 * Slownik strony "Skalowanie" (SCALE TIER / SkalowanieBody) - misja EN, etap 2.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja
 * inline markup (strong/b/em/code/p/ul/li) i renderuja sie przez set:html.
 * Tablice fig[] = kolejne etykiety <text> w SVG sekcji, w kolejnosci dokumentu.
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface DdItem {
  label: string;
  /** Tresc kroku DeepDive (HTML: p/ul/li/b/code). */
  body: string;
}

interface NodeDict {
  num: string;
  uniSf: string;
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
  mech: { q: string; g: string; artifactHtml: string; toolsHtml: string };
  targetHtml: string;
  dd: DdItem[];
}

interface SkalowanieDict {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  svgAria: string;
  svgNodeAria: { loops: string; gates: string; goal: string };
  svg: {
    ann03: string;
    dim03: string;
    ann01: string;
    dim01: string;
    ann02: string;
    dim02: string;
    ceilK: string;
    ceilLbl: string;
    ceilAnn: string;
  };
  mapCap: string;
  routeAria: string;
  route: [string, string, string];
  routeNextSf: string;
  routeNextNeutral: string;
  skrotEyebrow: string;
  sum: [
    { num: string; h3: string; p: string },
    { num: string; h3: string; p: string },
    { num: string; h3: string; p: string },
  ];
  skrotFinis: string;
  skrotFinisCite: string;
  mechLabels: { q: string; g: string; a: string; t: string };
  targetK: string;
  w1: NodeDict;
  w2: NodeDict;
  w3: NodeDict;
  orbit: {
    numSf: string;
    numNeutral: string;
    uniSf: string;
    h2Sf: string;
    h2Neutral: string;
    underMono: string;
    underLeadSf: string;
    underLeadNeutral: string;
    underFundamentDt: string;
    underFundamentLink: string;
    underFundamentRest: string;
    underChainDt: string;
    underChainLink: string;
    underChainRest: string;
    nextMono: string;
    nextLead: string;
    nextDt: string;
    nextDdHtml: string;
    finis: string;
    finisCite: string;
  };
}

export const SKALOWANIE: Record<Lang, SkalowanieDict> = {
  pl: {
    eyebrow: 'SCALE TIER // SKALOWANIE',
    h1Html: 'Więcej cykli naraz, <span class="glow">sufitem jest review</span>',
    subHtml:
      'Warstwa skalowania <strong>10x Workflow</strong>: nie dokładasz agentów do jednego zadania - prowadzisz <strong>więcej cykli równolegle</strong>, z bramkami jakości i autonomią. Sufit przepustowości wyznacza Twoja zdolność do review.',
    svgAria:
      'Diagram scale tier: trzy równoległe tory z mini-łańcuchami CSC przechodzą przez bramki jakości, autonomiczny przelot i zbiegają do węzła REVIEW, przy którym stoi człowiek',
    svgNodeAria: {
      loops: 'Węzeł 03: loops - trzy tory równolegle, każdy z własnym mini-łańcuchem CSC',
      gates: 'Węzeł 01: quality gates - bramki jakości na każdym torze, przechodzi tylko zielone',
      goal: 'Węzeł 02: goal - autonomiczny przelot planu między bramkami a review',
    },
    svg: {
      ann03: 'WĘZEŁ 03 · TRZY TORY RÓWNOLEGLE',
      dim03: 'MINI-ŁAŃCUCH CSC NA KAŻDYM TORZE',
      ann01: 'WĘZEŁ 01 · BRAMKI JAKOŚCI',
      dim01: 'PRZECHODZI TYLKO ZIELONE',
      ann02: 'WĘZEŁ 02 · AUTONOMICZNY PRZELOT',
      dim02: 'ETAPY IDĄ SAME · COMMIT PER ETAP',
      ceilK: 'SUFIT',
      ceilLbl: 'REVIEW',
      ceilAnn: 'człowiek · sufit przepustowości',
    },
    mapCap: 'SCALE TIER // KLIKNIJ WĘZEŁ, BY DOLECIEĆ DO SEKCJI',
    routeAria: 'Węzły warstwy skalowania',
    route: ['01 · quality gates', '02 · goal', '03 · loops'],
    routeNextSf: 'Dalej: orbity',
    routeNextNeutral: 'Dalej: kontekst warstwy',
    skrotEyebrow: 'Skrót warstwy · trzy węzły w 30 sekund',
    sum: [
      {
        num: 'WĘZEŁ 01',
        h3: 'quality gates',
        p: 'Automatyczne bramki domykają każdy etap - żaden nie przechodzi na czerwono.',
      },
      {
        num: 'WĘZEŁ 02',
        h3: 'goal',
        p: 'Plan wykonuje się sam: commit per etap albo uczciwy STOP.',
      },
      {
        num: 'WĘZEŁ 03',
        h3: 'loops',
        p: 'Więcej cykli równolegle z izolacją kontekstu - sufit wyznacza review.',
      },
    ],
    skrotFinis:
      '„Skalowanie to więcej cykli równolegle z izolacją kontekstu, nie więcej agentów na jednym wycinku pracy."',
    skrotFinisCite: '- fundament 10x Workflow',
    mechLabels: { q: 'Pytanie', g: 'Gwarancja', a: 'Artefakt', t: 'Narzędzia' },
    targetK: 'CEL:',
    w1: {
      num: 'WĘZEŁ 01',
      uniSf: 'Diuna · Gom dżabbar',
      h2: 'quality gates - próba, której nie da się ominąć',
      epigraphSf:
        '„Ręka w skrzynce, igła przy szyi. Dalej idzie tylko to, co przetrwa próbę - reszta odpada przy bramce."',
      epigraphCiteSf: '- Matka Wielebna przy skrzynce, próba gom dżabbar',
      figAria:
        'Schemat bramki jakości: taśma jednostek dochodzi do bramki-próby; zielona jednostka przechodzi na prawo do commita, czerwona zostaje odesłana w dół do poprawki',
      fig: [
        'LINT / TYPECHECK / TESTY / DELIBERATE-BREAK',
        'BRAMKA',
        'COMMIT: TYLKO NA ZIELONO',
        'CZERWONE: WRACA DO POPRAWKI',
      ],
      figcaption: 'RYS. 01 // BRAMKA-PRÓBA - PRZECHODZI TYLKO ZIELONE',
      leadSfHtml:
        'Gom dżabbar sprawdza jedno: czy kandydat wytrzyma próbę, zanim ktokolwiek mu zaufa. Ten węzeł robi to samo z każdym etapem planu. Bez niego autonomia oznacza kod, którego nikt nie sprawdził w chwili powstania - jedyną bramką jesteś Ty i musisz patrzeć na wszystko. <em>Quality gates</em> odpowiadają na pytanie: <strong>co pilnuje jakości, gdy Ciebie nie ma?</strong>',
      leadNeutralHtml:
        'Ten węzeł odpowiada na pytanie: <strong>co pilnuje jakości, gdy Ciebie nie ma?</strong> Bez automatycznych bramek autonomia oznacza kod, którego nikt nie sprawdził w chwili powstania - jedyną bramką jesteś Ty i musisz patrzeć na wszystko.',
      leadHtml:
        'Wejście: plan z warunkami sukcesu. Wyjście: <strong>etap domknięty automatycznie</strong> - lint i typecheck po każdej edycji, testy per etap, commit tylko na zielono. Mechanizm: <em>deliberate-break check</em> - celowo psujesz implementację i potwierdzasz, że test pada. Bramce można zaufać dopiero wtedy, gdy widziałeś, jak się zamyka.',
      mech: {
        q: 'co pilnuje jakości, gdy Ciebie nie ma?',
        g: 'żaden etap nie przechodzi na czerwono',
        artifactHtml: '<b>komplet zielonych bramek per etap</b> + commit na zielono',
        toolsHtml:
          'hooki (per-edit → pre-commit → pre-push), <b>/10x-tdd</b>, deliberate-break check, <b>/10x-plan-review</b>',
      },
      targetHtml:
        'kluczowy, zanim oddasz maszynie więcej autonomii - <b>bramki muszą pilnować jakości wcześniej, niż przestaniesz patrzeć na ręce</b>.',
      dd: [
        {
          label: 'Po co',
          body: `<p>Recenzja implementacji jako automatyczna bramka: skill uruchamia się w CI na pull requeście, <b>bez pytań i bez edycji kodu</b>. Czyta, analizuje, zapisuje raport i wystawia werdykt - pilnuje jakości dokładnie wtedy, gdy nikt nie patrzy na ręce.</p>`,
        },
        {
          label: 'Wejście → wyjście',
          body: `<p>Wejście: pull request + plan zmiany (<code>context/changes/&lt;change-id&gt;/plan.md</code>), znaleziony po konwencji albo z linii <code>Plan:</code> w opisie PR. Wyjście: raport <code>reviews/impl-review.md</code> zacommitowany na branch PR, komentarz z werdyktem i tabelą wymiarów oraz komentarze inline na oflagowanych liniach diffa.</p>`,
        },
        {
          label: 'Mechanizm',
          body: `<p>Trzej subagenci pracują równolegle: dryf względem planu (<code>MATCH / DRIFT / MISSING / EXTRA</code>), bezpieczeństwo i zgodność ze wzorcami, pokrycie testami. Potem lint, build i typecheck, oceny <b>PASS / WARNING / FAIL</b> w siedmiu wymiarach i werdykt całości: <code>APPROVED</code>, <code>NEEDS ATTENTION</code> albo <code>REJECTED</code>.</p>`,
        },
        {
          label: 'Anatomia raportu',
          body: `<p>Kontrakt wyjścia jest sztywny:</p><ul><li>marker <code>&lt;!-- IMPL-REVIEW-REPORT --&gt;</code> w pierwszej linii - po nim raport rozpoznają narzędzia triage,</li><li>każde znalezisko niesie pole <code>Decision: PENDING</code> do późniejszej decyzji człowieka,</li><li>commit raportu ma <code>[skip ci]</code>, żeby review nie uruchamiał sam siebie w pętli,</li><li>maksymalnie 10 znalezisk, posortowanych od krytycznych.</li></ul>`,
        },
        {
          label: 'Granice',
          body: `<p>Skill nie edytuje kodu i nie zadaje pytań - poprawki idą osobnym krokiem po triage. PR bez planu dostaje neutralny komentarz zamiast czerwonego checka. Werdykt <code>REJECTED</code> blokuje merge; obejście istnieje (etykieta <code>impl-review-override</code>), ale to już świadoma decyzja człowieka, nie maszyny.</p>`,
        },
      ],
    },
    w2: {
      num: 'WĘZEŁ 02',
      uniSf: 'Fundacja · Plan Seldona',
      h2: 'goal - plan wykonuje się bez autora',
      epigraphSf:
        '„Ten kryzys policzono na wieki przed waszym urodzeniem. Krypta otworzy się dokładnie wtedy, kiedy plan tego wymaga."',
      epigraphCiteSf: '- w duchu nagrań Hariego Seldona z Krypty Czasu',
      figAria:
        'Schemat trajektorii planu: łuk z checkpointami-commitami prowadzi do celu, a w połowie drogi stoi przewidziany punkt STOP na wypadek strukturalnego rozjazdu',
      fig: [
        'COMMIT',
        'COMMIT',
        'COMMIT',
        'STOP: PRZEWIDZIANY',
        'CEL',
        'ETAPY WYKONUJĄ SIĘ SAME',
        'KRYZYS: W PLANIE, NIE W IMPROWIZACJI',
      ],
      figcaption: 'RYS. 02 // TRAJEKTORIA PLANU - COMMITY I PRZEWIDZIANY STOP',
      leadSfHtml:
        'Plan Seldona działa, bo nie potrzebuje autora przy sterach: kryzysy przewidziano zawczasu, a Krypta odzywa się dokładnie wtedy, kiedy trzeba. Ten węzeł przenosi to na plan zmiany. Bez niego siedzisz między etapami jako klikacz „dalej" i autonomia kończy się na pierwszym pytaniu. <em>/10x-goal-implement</em> pod <em>/goal</em> odpowiada: <strong>jak plan wykonuje się bez Ciebie?</strong>',
      leadNeutralHtml:
        'Ten węzeł odpowiada na pytanie: <strong>jak plan wykonuje się bez Ciebie?</strong> Bez niego siedzisz między etapami jako klikacz „dalej" i autonomia kończy się na pierwszym pytaniu - <em>/10x-goal-implement</em> pod <em>/goal</em> zdejmuje Cię z tego stanowiska.',
      leadHtml:
        'Wejście: zatwierdzony plan.md. Wyjście: <strong>commit per etap na zielono albo uczciwy STOP</strong>. Mechanizm: etapy wykonują się same, sekcja Progress pracuje jak maszyna stanów, a przy strukturalnym rozjeździe wykonanie zatrzymuje się <em>STOP-blokiem</em> zamiast improwizować. Kryzys jest przewidziany w samym planie - nie odgrywany na żywo.',
      mech: {
        q: 'jak plan wykonuje się bez Ciebie?',
        g: 'commit per etap na zielono albo uczciwy STOP',
        artifactHtml: '<b>commity per etap</b> + run report albo STOP-blok z konkretem',
        toolsHtml:
          '<b>/10x-goal-implement</b> pod <b>/goal</b>, Progress jako maszyna stanów, STOP-bloki, run report',
      },
      targetHtml:
        'kluczowy przy zatwierdzonym planie i ograniczonym czasie - <b>plan idzie sam</b>, a Ty wracasz do gotowych commitów albo do uczciwego STOP z powodem na piśmie.',
      dd: [
        {
          label: 'Po co',
          body: `<p>Autonomiczny brat <b>/10x-implement</b>: wykonuje zatwierdzony plan pod <code>/goal</code> bez żadnej interakcji - w zwykłej sesji albo headless przez <code>claude -p</code>. Każdą decyzję, którą normalnie podejmuje człowiek, zastępuje jawna, spisana polityka; gdy polityki brakuje, wybiera interpretację konserwatywną i ją raportuje.</p>`,
        },
        {
          label: 'Wejście → wyjście',
          body: `<p>Wejście: zatwierdzony <code>plan.md</code> z sekcją <code>Progress</code> jako maszyną stanów. Wyjście: <b>commit per etap</b> (Conventional Commits) plus run report - albo uczciwy STOP-blok z tym, czego plan oczekiwał, co zastano, dlaczego to blokuje i skąd wznowić.</p>`,
        },
        {
          label: 'Stos bramek',
          body: `<p>Każdy etap przechodzi stały ciąg: kryteria sukcesu z planu → staging dotkniętych plików → <b>deliberate-break check</b> (celowe zepsucie kodu produkcyjnego; test musi spaść - czerwień jest warunkiem zaliczenia) → pełny zestaw testów, lint, typecheck → commit <b>tylko na zielono</b>. Padająca bramka dostaje najwyżej 2 próby naprawy, potem STOP.</p>`,
        },
        {
          label: 'Taksonomia rozjazdów',
          body: `<p>Gdy kod nie zgadza się z planem: <b>Minor</b> (przesunięty plik, zmiana nazwy, dryf importu) - adaptuje i raportuje jedną linią; <b>Structural</b> (brakująca zależność, inna architektura, nieistniejące API) - STOP-blok i koniec pracy. W razie wątpliwości rozjazd jest strukturalny: zły STOP kosztuje jedno wznowienie, złe dostosowanie przemyca przeprojektowanie, którego nikt nie zatwierdził.</p>`,
        },
        {
          label: 'Granice',
          body: `<p>Wiersze <code>Manual</code> w Progress są poza jurysdykcją maszyny: nigdy ich nie odhacza i nigdy na nich nie blokuje - trafiają na koniec run reportu jako checklista dla człowieka. Naprawa padającej bramki nigdy nie osłabia asercji, nie usuwa testu i nie luzuje reguł lint: kod ma sprostać sprawdzeniu, nie odwrotnie.</p>`,
        },
      ],
    },
    w3: {
      num: 'WĘZEŁ 03',
      uniSf: 'Star Wars · Eskadra myśliwców',
      h2: 'loops - więcej cykli równolegle',
      epigraphSf:
        '„Każdy pilot we własnym kokpicie, wszyscy na moim nasłuchu. Prowadzę tyle skrzydeł, ile jestem w stanie ogarnąć."',
      epigraphCiteSf: '- dowódca eskadry na odprawie przed startem',
      figAria:
        'Schemat eskadry: trzy izolowane kokpity na osobnych torach zbiegają do węzła dowódcy, z którego wychodzi jeden zatwierdzony strumień',
      fig: [
        'KOKPIT A',
        'KOKPIT B',
        'KOKPIT C',
        'DOWÓDCA // REVIEW',
        'IZOLACJA KONTEKSTU: PEŁNA',
        'TYLE SKRZYDEŁ, ILE OGARNIE DOWÓDCA',
      ],
      figcaption: 'RYS. 03 // ESKADRA - IZOLOWANE KOKPITY, JEDEN DOWÓDCA',
      leadSfHtml:
        'Eskadra nie skaluje się przez wsadzenie dwunastu pilotów do jednego myśliwca - skaluje się przez więcej maszyn, izolowane kokpity i jednego dowódcę na nasłuchu. Tak samo praca: <strong>więcej cykli równolegle z izolacją kontekstu</strong>, nie więcej agentów na jednym wycinku. Węzeł odpowiada na pytanie: <em>ile cykli naraz udźwigniesz?</em>',
      leadNeutralHtml:
        'Skalowanie pracy to <strong>więcej cykli równolegle z izolacją kontekstu</strong>, nie więcej agentów na jednym wycinku. Węzeł odpowiada na pytanie: <em>ile cykli naraz udźwigniesz?</em>',
      leadHtml:
        'Wejście: kilka niezależnych jednostek pracy. Wyjście: <strong>więcej przepustowości bez nierecenzowanego kodu</strong>. Mechanizm: cykle plan → implement → review biegną w rytmie (<em>/loop</em>), każdy we własnym kontekście, a wszystkie zbiegają do jednej bramy - Twojego review. Więcej agentów bez review nie podnosi przepustowości, tylko dług; sufit wyznacza dowódca, nie liczba maszyn.',
      mech: {
        q: 'ile cykli naraz udźwigniesz?',
        g: 'więcej przepustowości bez nierecenzowanego kodu',
        artifactHtml: '<b>osobny cykl per tor</b>: change-folder + raport review',
        toolsHtml:
          '<b>/loop</b>, <b>/10x-status</b>, izolacja kontekstu (worktree / osobne sesje), <b>/10x-impl-review</b> jako brama',
      },
      targetHtml:
        'kluczowy, gdy jeden cykl przestaje wystarczać - <b>dokładasz tory tak długo, jak każdy commit wciąż przechodzi przez Twoje review</b>.',
      dd: [
        {
          label: 'Po co',
          body: `<p>Silnik pojedynczego toru: wykonuje zatwierdzony plan z <code>context/changes/&lt;change-id&gt;/plan.md</code> etap po etapie, z weryfikacją i osobnym commitem po każdym etapie. To dokładnie ten cykl powielasz, gdy dokładasz kolejne równoległe tory.</p>`,
        },
        {
          label: 'Wejście → wyjście',
          body: `<p>Wejście: plan z sekcją <code>Progress</code> na dole. Wyjście: zaimplementowane etapy - każdy z własnym commitem (Conventional Commits), którego skrócony SHA wraca do odhaczonych wierszy Progress jako dowód, co i kiedy wylądowało.</p>`,
        },
        {
          label: 'Progress jako stan',
          body: `<p>Sekcja <code>Progress</code> w planie jest jedynym źródłem stanu - bez plików pomocniczych i markerów. „Gdzie jestem" jest wyliczane, nie zapisywane: pierwszy pusty checkbox to następny krok. Dzięki temu cykl można przerwać, wyczyścić kontekst i wznowić jedną komendą - stan nigdy nie ginie.</p>`,
        },
        {
          label: 'Rytuał końca etapu',
          body: `<p>Po zieleni automatów: potwierdzenie manualne od człowieka → staging <b>wyłącznie plików dotkniętych w etapie</b> (nigdy <code>git add -A</code>; brudne pliki spoza zestawu dostają osobne pytanie) → zatwierdzenie komunikatu → commit → SHA wpisany z powrotem do Progress.</p>`,
        },
        {
          label: 'Izolacja kontekstu',
          body: `<p>Po każdym etapie decyzja: kontynuować w tym samym kontekście czy wyczyścić i wznowić komendą skopiowaną do schowka (<code>/10x-implement &lt;change-id&gt; phase N</code>). Ten mechanizm pozwala prowadzić kilka cykli równolegle - każdy tor ma własny kontekst i własny stan w swoim planie.</p>`,
        },
        {
          label: 'Granice',
          body: `<p>Przy rozjeździe planu z rzeczywistością zatrzymuje się i pyta: dostosować, pominąć czy wrócić do planowania. Na torze, który ma pracować bez nadzoru, użyj <b>/10x-goal-implement</b> - tam te decyzje podejmuje spisana polityka.</p>`,
        },
      ],
    },
    orbit: {
      numSf: 'ORBITY',
      numNeutral: 'KONTEKST',
      uniSf: 'Orbity nad łańcuchem · Skąd się tu przylatuje i co dalej',
      h2Sf: 'Orbity nad łańcuchem',
      h2Neutral: 'Skąd tu trafiasz i co dalej',
      underMono: 'POD SPODEM // FUNDAMENT I ŁAŃCUCH',
      underLeadSf:
        'Warstwa skalowania niczego nie zastępuje - orbituje nad tym, co już działa. Fundament daje projektowi rampę, łańcuch przewozi jednostki pracy, skalowanie dokłada tory.',
      underLeadNeutral:
        'Warstwa skalowania niczego nie zastępuje - działa na tym, co już masz. Fundament przygotowuje projekt, łańcuch dowozi pojedyncze jednostki pracy, skalowanie uruchamia ich więcej równolegle.',
      underFundamentDt: 'fundament',
      underFundamentLink: 'Moduł 1: Fundament',
      underFundamentRest: ' - rampa startowa projektu',
      underChainDt: 'łańcuch',
      underChainLink: 'Core Skills Chain',
      underChainRest: ' - pięć skoków jednostki pracy',
      nextMono: 'DALEJ // JAKOŚĆ (M3)',
      nextLead:
        'Skalowanie podnosi przepustowość - następny moduł dokręca rygor. Więcej torów ma sens tylko wtedy, gdy poziom nie spada z żadnego z nich.',
      nextDt: 'zapowiedź',
      nextDdHtml: '<b>jakość (M3)</b>: co trzyma poziom, gdy przepustowość rośnie',
      finis:
        '„Łańcuch się nie zmienia - dokładasz mu obstawę. A sufit zawsze wyznacza Twoje review."',
      finisCite: '- fundament 10x Workflow',
    },
  },
  en: {
    eyebrow: 'SCALE TIER // SCALING',
    h1Html: 'More cycles at once, <span class="glow">review is the ceiling</span>',
    subHtml:
      'The scaling tier of the <strong>10x Workflow</strong>: you do not add agents to a single task - you run <strong>more cycles in parallel</strong>, with quality gates and autonomy. The throughput ceiling is set by your capacity to review.',
    svgAria:
      'Scale tier diagram: three parallel tracks with mini CSC chains pass through quality gates and an autonomous flight, then converge on the REVIEW node with a human standing at it',
    svgNodeAria: {
      loops: 'Node 03: loops - three tracks in parallel, each with its own mini CSC chain',
      gates: 'Node 01: quality gates - quality gates on every track, only green passes',
      goal: "Node 02: goal - the plan's autonomous flight between the gates and review",
    },
    svg: {
      ann03: 'NODE 03 · THREE TRACKS IN PARALLEL',
      dim03: 'A MINI CSC CHAIN ON EVERY TRACK',
      ann01: 'NODE 01 · QUALITY GATES',
      dim01: 'ONLY GREEN PASSES',
      ann02: 'NODE 02 · AUTONOMOUS FLIGHT',
      dim02: 'PHASES RUN ON THEIR OWN · COMMIT PER PHASE',
      ceilK: 'CEILING',
      ceilLbl: 'REVIEW',
      ceilAnn: 'human · throughput ceiling',
    },
    mapCap: 'SCALE TIER // CLICK A NODE TO FLY TO A SECTION',
    routeAria: 'Scaling tier nodes',
    route: ['01 · quality gates', '02 · goal', '03 · loops'],
    routeNextSf: 'Next: orbits',
    routeNextNeutral: 'Next: tier context',
    skrotEyebrow: 'Tier brief · three nodes in 30 seconds',
    sum: [
      {
        num: 'NODE 01',
        h3: 'quality gates',
        p: 'Automatic gates close out every phase - none passes on red.',
      },
      {
        num: 'NODE 02',
        h3: 'goal',
        p: 'The plan executes itself: a commit per phase or an honest STOP.',
      },
      {
        num: 'NODE 03',
        h3: 'loops',
        p: 'More cycles in parallel with context isolation - review sets the ceiling.',
      },
    ],
    skrotFinis:
      '"Scaling means more cycles in parallel with context isolation, not more agents on one slice of work."',
    skrotFinisCite: '- a 10x Workflow cornerstone',
    mechLabels: { q: 'Question', g: 'Guarantee', a: 'Artifact', t: 'Tools' },
    targetK: 'GOAL:',
    w1: {
      num: 'NODE 01',
      uniSf: 'Dune · Gom jabbar',
      h2: 'quality gates - a test you cannot skip',
      epigraphSf:
        '"Hand in the box, needle at the neck. Only what survives the test goes on - the rest drops out at the gate."',
      epigraphCiteSf: '- the Reverend Mother at the box, the gom jabbar test',
      figAria:
        'Quality gate diagram: a belt of work units reaches the test gate; a green unit passes right to the commit, a red one is sent down for a fix',
      fig: [
        'LINT / TYPECHECK / TESTS / DELIBERATE-BREAK',
        'GATE',
        'COMMIT: GREEN ONLY',
        'RED: GOES BACK FOR A FIX',
      ],
      figcaption: 'FIG. 01 // THE TEST GATE - ONLY GREEN PASSES',
      leadSfHtml:
        'The gom jabbar checks one thing: whether the candidate can survive the test before anyone trusts them. This node does the same with every phase of the plan. Without it, autonomy means code nobody checked at the moment it was written - you are the only gate and you have to watch everything. <em>Quality gates</em> answer the question: <strong>what guards quality when you are not there?</strong>',
      leadNeutralHtml:
        'This node answers the question: <strong>what guards quality when you are not there?</strong> Without automatic gates, autonomy means code nobody checked at the moment it was written - you are the only gate and you have to watch everything.',
      leadHtml:
        'Input: a plan with success criteria. Output: <strong>a phase closed out automatically</strong> - lint and typecheck after every edit, tests per phase, a commit only on green. The mechanism: the <em>deliberate-break check</em> - you break the implementation on purpose and confirm the test fails. You can trust a gate only once you have seen it close.',
      mech: {
        q: 'what guards quality when you are not there?',
        g: 'no phase passes on red',
        artifactHtml: '<b>a full set of green gates per phase</b> + a commit on green',
        toolsHtml:
          'hooks (per-edit → pre-commit → pre-push), <b>/10x-tdd</b>, deliberate-break check, <b>/10x-plan-review</b>',
      },
      targetHtml:
        'key before you hand the machine more autonomy - <b>the gates must be guarding quality before you stop watching over its shoulder</b>.',
      dd: [
        {
          label: 'Why',
          body: `<p>Implementation review as an automatic gate: the skill runs in CI on a pull request, <b>with no questions and no code edits</b>. It reads, analyzes, writes a report and issues a verdict - guarding quality exactly when nobody is watching.</p>`,
        },
        {
          label: 'Input → output',
          body: `<p>Input: a pull request plus the change plan (<code>context/changes/&lt;change-id&gt;/plan.md</code>), found by convention or from a <code>Plan:</code> line in the PR description. Output: a <code>reviews/impl-review.md</code> report committed to the PR branch, a comment with the verdict and a dimension table, and inline comments on flagged diff lines.</p>`,
        },
        {
          label: 'Mechanism',
          body: `<p>Three subagents work in parallel: drift against the plan (<code>MATCH / DRIFT / MISSING / EXTRA</code>), safety and pattern compliance, test coverage. Then lint, build and typecheck, <b>PASS / WARNING / FAIL</b> grades across seven dimensions and an overall verdict: <code>APPROVED</code>, <code>NEEDS ATTENTION</code> or <code>REJECTED</code>.</p>`,
        },
        {
          label: 'Report anatomy',
          body: `<p>The output contract is strict:</p><ul><li>a <code>&lt;!-- IMPL-REVIEW-REPORT --&gt;</code> marker in the first line - triage tools recognize the report by it,</li><li>every finding carries a <code>Decision: PENDING</code> field for a later human decision,</li><li>the report commit has <code>[skip ci]</code> so the review does not trigger itself in a loop,</li><li>at most 10 findings, sorted from critical down.</li></ul>`,
        },
        {
          label: 'Boundaries',
          body: `<p>The skill does not edit code and asks no questions - fixes go in a separate step after triage. A PR without a plan gets a neutral comment instead of a red check. A <code>REJECTED</code> verdict blocks the merge; an override exists (the <code>impl-review-override</code> label), but that is a deliberate human decision, not the machine's.</p>`,
        },
      ],
    },
    w2: {
      num: 'NODE 02',
      uniSf: 'Foundation · The Seldon Plan',
      h2: 'goal - the plan executes without its author',
      epigraphSf:
        '"This crisis was computed centuries before you were born. The Vault will open exactly when the plan requires it."',
      epigraphCiteSf: "- in the spirit of Hari Seldon's recordings from the Time Vault",
      figAria:
        'Plan trajectory diagram: an arc with commit checkpoints leads to the goal, and halfway along stands a foreseen STOP point in case of a structural mismatch',
      fig: [
        'COMMIT',
        'COMMIT',
        'COMMIT',
        'STOP: FORESEEN',
        'GOAL',
        'PHASES RUN ON THEIR OWN',
        'CRISIS: IN THE PLAN, NOT IN IMPROVISATION',
      ],
      figcaption: 'FIG. 02 // PLAN TRAJECTORY - COMMITS AND A FORESEEN STOP',
      leadSfHtml:
        'The Seldon Plan works because it does not need its author at the controls: the crises were foreseen in advance, and the Vault speaks up exactly when needed. This node brings that to a change plan. Without it, you sit between phases as a "next" clicker and autonomy ends at the first question. <em>/10x-goal-implement</em> under <em>/goal</em> answers: <strong>how does the plan execute without you?</strong>',
      leadNeutralHtml:
        'This node answers the question: <strong>how does the plan execute without you?</strong> Without it, you sit between phases as a "next" clicker and autonomy ends at the first question - <em>/10x-goal-implement</em> under <em>/goal</em> takes you off that post.',
      leadHtml:
        'Input: an approved plan.md. Output: <strong>a commit per phase on green or an honest STOP</strong>. The mechanism: phases run on their own, the Progress section works as a state machine, and on a structural mismatch execution halts with a <em>STOP block</em> instead of improvising. The crisis is foreseen in the plan itself - not acted out live.',
      mech: {
        q: 'how does the plan execute without you?',
        g: 'a commit per phase on green or an honest STOP',
        artifactHtml: '<b>commits per phase</b> + a run report or a STOP block with specifics',
        toolsHtml:
          '<b>/10x-goal-implement</b> under <b>/goal</b>, Progress as a state machine, STOP blocks, the run report',
      },
      targetHtml:
        'key with an approved plan and limited time - <b>the plan runs on its own</b>, and you come back to finished commits or to an honest STOP with the reason in writing.',
      dd: [
        {
          label: 'Why',
          body: `<p>The autonomous sibling of <b>/10x-implement</b>: it executes an approved plan under <code>/goal</code> with no interaction at all - in a regular session or headless via <code>claude -p</code>. Every decision a human would normally make is replaced by an explicit, written policy; where policy is missing, it picks the conservative interpretation and reports it.</p>`,
        },
        {
          label: 'Input → output',
          body: `<p>Input: an approved <code>plan.md</code> with a <code>Progress</code> section as the state machine. Output: <b>a commit per phase</b> (Conventional Commits) plus a run report - or an honest STOP block with what the plan expected, what was found, why it blocks and where to resume from.</p>`,
        },
        {
          label: 'The gate stack',
          body: `<p>Every phase goes through a fixed sequence: success criteria from the plan → staging of touched files → the <b>deliberate-break check</b> (breaking production code on purpose; the test must fail - red is the passing condition) → the full test suite, lint, typecheck → a commit <b>only on green</b>. A failing gate gets at most 2 repair attempts, then STOP.</p>`,
        },
        {
          label: 'Mismatch taxonomy',
          body: `<p>When the code disagrees with the plan: <b>Minor</b> (a moved file, a rename, import drift) - it adapts and reports in one line; <b>Structural</b> (a missing dependency, a different architecture, a nonexistent API) - a STOP block and end of work. When in doubt, the mismatch is structural: a wrong STOP costs one resume, a wrong adaptation smuggles in a redesign nobody approved.</p>`,
        },
        {
          label: 'Boundaries',
          body: `<p><code>Manual</code> rows in Progress are outside the machine's jurisdiction: it never checks them off and never blocks on them - they land at the end of the run report as a checklist for a human. Repairing a failing gate never weakens an assertion, removes a test or loosens lint rules: the code has to meet the check, not the other way around.</p>`,
        },
      ],
    },
    w3: {
      num: 'NODE 03',
      uniSf: 'Star Wars · Starfighter squadron',
      h2: 'loops - more cycles in parallel',
      epigraphSf:
        '"Every pilot in their own cockpit, all of them on my comms. I lead as many wings as I can keep track of."',
      epigraphCiteSf: '- squadron leader at the pre-launch briefing',
      figAria:
        "Squadron diagram: three isolated cockpits on separate tracks converge on the leader's node, from which a single approved stream exits",
      fig: [
        'COCKPIT A',
        'COCKPIT B',
        'COCKPIT C',
        'LEADER // REVIEW',
        'CONTEXT ISOLATION: FULL',
        'AS MANY WINGS AS THE LEADER CAN HANDLE',
      ],
      figcaption: 'FIG. 03 // THE SQUADRON - ISOLATED COCKPITS, ONE LEADER',
      leadSfHtml:
        'A squadron does not scale by packing twelve pilots into one starfighter - it scales with more ships, isolated cockpits and one leader on comms. Work is the same: <strong>more cycles in parallel with context isolation</strong>, not more agents on one slice. The node answers the question: <em>how many cycles can you carry at once?</em>',
      leadNeutralHtml:
        'Scaling work means <strong>more cycles in parallel with context isolation</strong>, not more agents on one slice. The node answers the question: <em>how many cycles can you carry at once?</em>',
      leadHtml:
        'Input: several independent units of work. Output: <strong>more throughput without unreviewed code</strong>. The mechanism: plan → implement → review cycles run on a cadence (<em>/loop</em>), each in its own context, and all converge on one gate - your review. More agents without review does not raise throughput, only debt; the leader sets the ceiling, not the number of ships.',
      mech: {
        q: 'how many cycles can you carry at once?',
        g: 'more throughput without unreviewed code',
        artifactHtml: '<b>a separate cycle per track</b>: a change folder + a review report',
        toolsHtml:
          '<b>/loop</b>, <b>/10x-status</b>, context isolation (worktree / separate sessions), <b>/10x-impl-review</b> as the gate',
      },
      targetHtml:
        'key once a single cycle stops being enough - <b>you keep adding tracks as long as every commit still goes through your review</b>.',
      dd: [
        {
          label: 'Why',
          body: `<p>The single-track engine: it executes an approved plan from <code>context/changes/&lt;change-id&gt;/plan.md</code> phase by phase, with verification and a separate commit after each phase. This is exactly the cycle you replicate when adding more parallel tracks.</p>`,
        },
        {
          label: 'Input → output',
          body: `<p>Input: a plan with a <code>Progress</code> section at the bottom. Output: implemented phases - each with its own commit (Conventional Commits), whose short SHA goes back into the checked-off Progress rows as proof of what landed and when.</p>`,
        },
        {
          label: 'Progress as state',
          body: `<p>The <code>Progress</code> section in the plan is the only source of state - no helper files, no markers. "Where am I" is computed, not stored: the first empty checkbox is the next step. That means you can interrupt the cycle, clear the context and resume with a single command - the state never gets lost.</p>`,
        },
        {
          label: 'End-of-phase ritual',
          body: `<p>After the automated checks go green: manual confirmation from a human → staging of <b>only the files touched in the phase</b> (never <code>git add -A</code>; dirty files outside the set get a separate question) → message approval → commit → the SHA written back into Progress.</p>`,
        },
        {
          label: 'Context isolation',
          body: `<p>After each phase, a decision: continue in the same context or clear it and resume with a command copied to the clipboard (<code>/10x-implement &lt;change-id&gt; phase N</code>). This mechanism lets you run several cycles in parallel - each track has its own context and its own state in its own plan.</p>`,
        },
        {
          label: 'Boundaries',
          body: `<p>When the plan diverges from reality, it stops and asks: adapt, skip or go back to planning. On a track that is meant to run unattended, use <b>/10x-goal-implement</b> - there those decisions are made by written policy.</p>`,
        },
      ],
    },
    orbit: {
      numSf: 'ORBITS',
      numNeutral: 'CONTEXT',
      uniSf: 'Orbits above the chain · How you fly in here and what comes next',
      h2Sf: 'Orbits above the chain',
      h2Neutral: 'How you get here and what comes next',
      underMono: 'UNDERNEATH // FOUNDATION AND THE CHAIN',
      underLeadSf:
        'The scaling tier replaces nothing - it orbits above what already works. The foundation gives the project a launch ramp, the chain carries units of work, scaling adds tracks.',
      underLeadNeutral:
        'The scaling tier replaces nothing - it works on what you already have. The foundation prepares the project, the chain delivers individual units of work, scaling runs more of them in parallel.',
      underFundamentDt: 'foundation',
      underFundamentLink: 'Module 1: Foundation',
      underFundamentRest: " - the project's launch ramp",
      underChainDt: 'chain',
      underChainLink: 'Core Skills Chain',
      underChainRest: ' - the five jumps of a unit of work',
      nextMono: 'NEXT // QUALITY (M3)',
      nextLead:
        'Scaling raises throughput - the next module tightens the rigor. More tracks make sense only when the bar drops on none of them.',
      nextDt: 'preview',
      nextDdHtml: '<b>Quality (M3)</b>: what holds the bar as throughput grows',
      finis:
        '"The chain does not change - you give it an escort. And the ceiling is always set by your review."',
      finisCite: '- a 10x Workflow cornerstone',
    },
  },
};
