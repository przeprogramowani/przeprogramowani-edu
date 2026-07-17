/**
 * Slownik strony "Modul 1: Fundament" (fundament/FundamentBody). Struktura
 * kluczy odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja inline
 * markup (strong/b/em/span) i renderuja sie przez set:html. Kroki DeepDive
 * (dd.*) sa trescia krokow panelu - tresci wydestylowane z
 * ~/.claude/skills/<skill>/SKILL.md. Nazwy uniwersow dostarcza universeName();
 * tu tylko dopiski po nazwie (uniSuffix). Zmiana tresci = zmiana OBU jezykow.
 */

import type { Lang } from './index';

/** Pojedynczy krok panelu DeepDive (body renderuje sie przez set:html). */
interface DdItem {
  label: string;
  body: string;
}

interface FundamentLesson {
  num: string;
  /** Dopisek po nazwie uniwersum (sama nazwa z universeName()). */
  uniSuffix: string;
  h2: string;
  epigraphSf: string;
  epigraphCiteSf: string;
  figAria: string;
  figcaption: string;
  leadSfHtml: string;
  leadNeutralHtml: string;
  mechQ: string;
  mechG: string;
  mechAHtml: string;
  lessonLabel: string;
  targetHtml: string;
}

interface SumCard {
  num: string;
  h3: string;
  p: string;
}

interface FundamentDict {
  eyebrow: string;
  h1Pre: string;
  h1GlowSf: string;
  h1GlowNeutral: string;
  subSfHtml: string;
  subNeutralHtml: string;
  heroAria: string;
  heroNodeAria: { idea: string; step1: string; step2: string; step3: string; csc: string };
  hero: {
    ideaAnn: string;
    idea: string;
    step1: string;
    shape: string;
    shapeAnn: string;
    step2: string;
    prd: string;
    prdAnn: string;
    step3: string;
    roadmap: string;
    roadmapAnn: string;
    cscAnn: string;
  };
  mapCapSf: string;
  mapCapNeutral: string;
  routeAria: string;
  route: [string, string, string, string, string, string];
  sumEyebrow: string;
  cards: [SumCard, SumCard, SumCard, SumCard, SumCard];
  sumEpigraph: string;
  sumEpigraphCite: string;
  /** Wspolne etykiety dt wierszy mech w sekcjach lekcji. */
  mechDt: { q: string; g: string; a: string; l: string };
  targetK: string;
  l1: FundamentLesson & {
    leadHtml: string;
    fig: { q1: string; q2: string; q3: string; test: string; prd: string; answers: string };
  };
  l2: FundamentLesson & {
    leadHtml: string;
    fig: { prompt: string; module: string; carve: string; after: string };
  };
  l3: FundamentLesson & {
    leadHtml: string;
    fig: { yard: string; hull: string; plating: string; tolerances: string };
  };
  l4: FundamentLesson & {
    leadHtml: string;
    fig: { field: string; doc: string; obvious: string; nonObvious: string };
  };
  l5: FundamentLesson & {
    /** Lead wspolny dzieli sie wokol inline <span class="sf-only"> w markupie. */
    leadPreHtml: string;
    leadCalcSf: string;
    leadPost: string;
    fig: { localhost: string; prod: string; calc: string; note: string };
  };
  next: {
    num: string;
    uniSf: string;
    h2: string;
    leftMono: string;
    leftMonoSf: string;
    leftLead: string;
    leftMech: { d1t: string; d1d: string; d2t: string; d2d: string; d3t: string; d3d: string };
    rightMono: string;
    m2LeadPre: string;
    m2LeadSf: string;
    m2LeadNeutral: string;
    m2LeadPostHtml: string;
    cscDt: string;
    cscLink: string;
    previewDt: string;
    previewDd: string;
    finisSf: string;
    finisCiteSf: string;
    finisNeutral: string;
    finisCiteNeutral: string;
  };
  dd: {
    shape: DdItem[];
    bootstrapper: DdItem[];
    agentsMd: DdItem[];
    deployment: DdItem[];
  };
}

export const FUNDAMENT: Record<Lang, FundamentDict> = {
  pl: {
    eyebrow: 'MODUŁ 1 // FUNDAMENT',
    h1Pre: 'Od pomysłu do ',
    h1GlowSf: 'rampy startowej',
    h1GlowNeutral: 'pierwszego wdrożenia',
    subSfHtml:
      'Fundament <strong>10x Workflow</strong>: pięć lekcji, które zamieniają mglisty pomysł w projekt gotowy do lotu - <strong>PRD, skille, bootstrap, onboarding agenta i pierwszy deploy</strong>. Rampa kończy się tam, gdzie startuje łańcuch CSC.',
    subNeutralHtml:
      'Fundament <strong>10x Workflow</strong>: pięć lekcji, które zamieniają mglisty pomysł w projekt gotowy do pracy - <strong>PRD, skille, bootstrap, onboarding agenta i pierwszy deploy</strong>. Fundament kończy się tam, gdzie startuje łańcuch CSC.',
    heroAria:
      'Diagram rampy startowej: z chmury pomysłu trzy stopnie rampy - shape, prd, roadmap - prowadzą do sylwetki łańcucha CSC; jednostka przepływa przez całą rampę',
    heroNodeAria: {
      idea: 'Pomysł - mglisty zakres; skrót modułu',
      step1: 'Stopień 1 rampy: shape - sesja sokratejska; lekcja 01',
      step2: 'Stopień 2 rampy: prd - co i po co budujemy; lekcja 01',
      step3: 'Stopień 3 rampy: roadmap - kolejność budowy; lekcja 05',
      csc: 'Sylwetka łańcucha CSC - tu startuje moduł 2; sekcja Dalej',
    },
    hero: {
      ideaAnn: 'zakres: mglisty',
      idea: 'POMYSŁ',
      step1: 'STOPIEŃ 01',
      shape: 'SHAPE',
      shapeAnn: 'sesja sokratejska',
      step2: 'STOPIEŃ 02',
      prd: 'PRD',
      prdAnn: 'co i po co budujemy',
      step3: 'STOPIEŃ 03',
      roadmap: 'ROADMAP',
      roadmapAnn: 'kolejność budowy',
      cscAnn: 'tu startuje moduł 2 // csc',
    },
    mapCapSf: 'RAMPA STARTOWA // KLIKNIJ STOPIEŃ, BY DOLECIEĆ DO SEKCJI',
    mapCapNeutral: 'MAPA MODUŁU // KLIKNIJ STOPIEŃ, BY PRZEJŚĆ DO SEKCJI',
    routeAria: 'Lekcje modułu',
    route: [
      '01 · pomysł → prd',
      '02 · skille',
      '03 · bootstrap',
      '04 · onboarding',
      '05 · produkcja',
      'Dalej: łańcuch',
    ],
    sumEyebrow: 'Skrót modułu · pięć lekcji w 30 sekund',
    cards: [
      {
        num: 'LEKCJA 01',
        h3: 'Od pomysłu do PRD',
        p: 'Co naprawdę budujemy? Ustalenia, których kolejne prompty nie podważą.',
      },
      {
        num: 'LEKCJA 02',
        h3: 'Od chatbota do Agenta',
        p: 'Czym gra agent? Powtarzalne narzędzia zamiast jednorazowych promptów.',
      },
      {
        num: 'LEKCJA 03',
        h3: 'AI-Powered Bootstrap',
        p: 'Na czym stawiamy? Starter z oficjalnego CLI, nie boilerplate z generatora.',
      },
      {
        num: 'LEKCJA 04',
        h3: 'Agent Onboarding',
        p: 'Co agent ma wiedzieć? Kontekst projektu bez szumu.',
      },
      {
        num: 'LEKCJA 05',
        h3: 'Z localhosta na produkcję',
        p: 'Gdzie i jak wypływamy? Działający deploy zamiast wiecznego localhosta.',
      },
    ],
    sumEpigraph: '„Zanim napiszesz pierwszą linię kodu - przeprowadź sesję /10x-shape."',
    sumEpigraphCite: '- fundament 10x Workflow',
    mechDt: { q: 'Pytanie', g: 'Gwarancja', a: 'Artefakt', l: 'Lekcja' },
    targetK: 'CEL:',
    l1: {
      num: 'LEKCJA 01',
      uniSuffix: ' · Test Bene Gesserit',
      h2: 'Od pomysłu do PRD - co naprawdę budujemy?',
      epigraphSf:
        '„Zadaję pytania, zanim pozwolę czemukolwiek powstać. Precyzja przed działaniem - albo wcale."',
      epigraphCiteSf: '- Matka Wielebna Bene Gesserit, test przed dopuszczeniem do dzieła',
      figAria: 'Schemat testu: trzy pytania zbiegają przez bramkę testu w jeden dokument PRD',
      figcaption: 'RYS. 01 // PYTANIA ZBIEGAJĄ W JEDEN DOKUMENT',
      fig: {
        q1: 'PO CO?',
        q2: 'DLA KOGO?',
        q3: 'CO POMINĄĆ?',
        test: 'TEST: PYTANIA PRZED DZIAŁANIEM',
        prd: 'PRD.MD',
        answers: 'ODPOWIEDZI: NA DYSKU, NIE W CZACIE',
      },
      leadSfHtml:
        'Bene Gesserit nie ufają deklaracjom - testują, zanim uznają kogoś za człowieka. Fundament stosuje ten sam rygor wobec pomysłu: zanim cokolwiek powstanie, pomysł przechodzi test pytań. <em>/10x-shape</em> prowadzi sesję sokratejską i sam wykrywa, czy gra toczy się na zielonym polu, czy w istniejącym repo (greenfield/brownfield). Bez tego „mam pomysł na apkę" rozpada się przy trzecim prompcie.',
      leadNeutralHtml:
        'Zanim cokolwiek powstanie, pomysł przechodzi test pytań. <em>/10x-shape</em> prowadzi sesję sokratejską i sam wykrywa, czy pracujesz od zera, czy w istniejącym repo (greenfield/brownfield). Bez tego „mam pomysł na apkę" rozpada się przy trzecim prompcie.',
      leadHtml:
        'Wejście: luźny pomysł lub istniejący projekt. Wyjście: <strong>shape-notes.md</strong>, a z niego <strong>prd.md</strong> po przejściu przez <em>/10x-prd</em>. Mechanizm: pytania idą przed generowaniem - PRD spisuje ustalenia na dysku, więc kolejne prompty budują na decyzjach, zamiast po cichu je podważać.',
      mechQ: 'co naprawdę budujemy?',
      mechG: 'ustalenia, których kolejne prompty nie podważą',
      mechAHtml: '<b>shape-notes.md → prd.md</b> (/10x-shape, /10x-prd)',
      lessonLabel: 'M1·L1: Od pomysłu do PRD',
      targetHtml:
        'kluczowy na starcie każdego projektu - <b>zanim powstanie linia kodu</b>, na dysku musi istnieć zapis, co budujemy i po co.',
    },
    l2: {
      num: 'LEKCJA 02',
      uniSuffix: ' · Przepoczwarzenie',
      h2: 'Od chatbota do Agenta - czym gra agent?',
      epigraphSf:
        '„Nie uczę cię udawać Złotego. Przebudowuję cię raz - a potem każda sala i każde pole bitwy stoją przed tobą otworem."',
      epigraphCiteSf: '- rzeźbiarz ciał, przed zabiegiem przepoczwarzenia',
      figAria:
        'Schemat przemiany: moduł skilla wędruje z warsztatu do komory przepoczwarzenia, jednorazowe prompty blakną w tle',
      figcaption: 'RYS. 02 // MODUŁ WGRANY RAZ, ODTWARZANY ZAWSZE',
      fig: {
        prompt: 'PROMPT ×1: ZNIKA W HISTORII CZATU',
        module: 'SKILL // MODUŁ',
        carve: 'PRZEPOCZWARZENIE: RAZ',
        after: 'POTEM: INNA KLASA ZADAŃ',
      },
      leadSfHtml:
        'Czerwony nie wygrywa Instytutu lepszym kilofem - przechodzi przepoczwarzenie raz i wraca jako Złoty, z dostępem do zadań, o których wcześniej nie miał prawa myśleć. Dokładnie tam przebiega różnica między chatbotem a agentem: <strong>skill to nie prompt</strong>. Prompt żyje raz i umiera w historii czatu; skill jest odtwarzalną parą kontraktów - co wchodzi, co wychodzi - a raz przeprowadzona przemiana otwiera zupełnie inną klasę działań: wywołujesz go przy setnym zadaniu tak samo pewnie jak przy pierwszym.',
      leadNeutralHtml:
        'Różnica między chatbotem a agentem przebiega na narzędziach: <strong>skill to nie prompt</strong>. Prompt żyje raz i umiera w historii czatu; skill jest odtwarzalną parą kontraktów - co wchodzi, co wychodzi - którą wywołujesz przy setnym zadaniu tak samo pewnie jak przy pierwszym.',
      leadHtml:
        'Wejście: powtarzający się problem, który dziś załatwiasz coraz dłuższym promptem. Wyjście: <strong>skill z kontraktem wejścia/wyjścia</strong>, zapisany obok kodu. Mechanizm: <em>metaprompting</em> - agent pomaga pisać własne narzędzia, a każdy dopracowany skill podnosi jakość wszystkich kolejnych przebiegów, nie jednego.',
      mechQ: 'czym gra agent?',
      mechG: 'powtarzalne narzędzia zamiast jednorazowych promptów',
      mechAHtml: '<b>skille z kontraktami wejścia/wyjścia</b> (metaprompting)',
      lessonLabel: 'M1·L2: Od chatbota do Agenta',
      targetHtml:
        'kluczowy, gdy trzeci raz piszesz ten sam prompt - <b>powtarzalna praca ma być modułem</b>, nie improwizacją w oknie czatu.',
    },
    l3: {
      num: 'LEKCJA 03',
      uniSuffix: ' · Stocznia Tycho',
      h2: 'AI-Powered Bootstrap - na czym stawiamy?',
      epigraphSf:
        '„Kadłuby schodzą z doków stoczni, nie spod młotka w warsztacie. Dok zna tolerancje lepiej niż najlepszy spawacz."',
      epigraphCiteSf: '- stoczniowiec stacji Tycho, przy wodowaniu kadłuba',
      figAria: 'Schemat stoczni: kadłub wyjeżdża z doku po prowadnicach, ręczna blacha zostaje w tyle',
      figcaption: 'RYS. 03 // KADŁUB Z DOKÓW, NIE Z RĘCZNEJ BLACHY',
      fig: {
        yard: 'STOCZNIA // OFICJALNE CLI',
        hull: 'KADŁUB // STARTER',
        plating: 'RĘCZNA BLACHA: 0',
        tolerances: 'TOLERANCJE: ZNANE',
      },
      leadSfHtml:
        'Stacja Tycho nie klepie kadłubów ręcznie - buduje je dok, który zna tolerancje i procedury. Bootstrap projektu działa tak samo: zamiast prosić model o wygenerowanie boilerplate\'u z pamięci, fundament <strong>deleguje do oficjalnych CLI</strong>. <em>/10x-tech-stack-selector</em> czyta prd.md i wybiera stack przez bramki jakości, a <em>/10x-bootstrapper</em> uruchamia oficjalny starter wybranego frameworka.',
      leadNeutralHtml:
        'Bootstrap projektu nie polega na generowaniu boilerplate\'u z pamięci modelu - fundament <strong>deleguje do oficjalnych CLI</strong>. <em>/10x-tech-stack-selector</em> czyta prd.md i wybiera stack przez bramki jakości, a <em>/10x-bootstrapper</em> uruchamia oficjalny starter wybranego frameworka.',
      leadHtml:
        'Wejście: prd.md (greenfield) albo istniejące repo (brownfield: <em>/10x-stack-assess</em> → <em>/10x-health-check</em>). Wyjście: <strong>tech-stack.md i działający scaffold</strong> z oficjalnego CLI. Mechanizm: agent dostaje jasną politykę uprawnień - co wolno mu uruchomić bez pytania, a co wymaga człowieka - więc start projektu jest szybki i nadal pod kontrolą.',
      mechQ: 'na czym stawiamy?',
      mechG: 'starter z oficjalnego CLI, nie boilerplate z generatora',
      mechAHtml:
        '<b>tech-stack.md + scaffold</b> (/10x-bootstrapper; brownfield: /10x-stack-assess, /10x-health-check)',
      lessonLabel: 'M1·L3: AI-Powered Bootstrap',
      targetHtml:
        'kluczowy przy stawianiu repo - <b>fundamenty kładzie oficjalne CLI</b>, bo boilerplate generowany z pamięci modelu psuje się przy pierwszej aktualizacji frameworka.',
    },
    l4: {
      num: 'LEKCJA 04',
      uniSuffix: ' · Odprawa przed bitwą',
      h2: 'Agent Onboarding - co agent ma wiedzieć?',
      epigraphSf:
        '„Na odprawie dostajesz tylko to, czego sam nie wywnioskujesz z pola bitwy. Cała reszta to szum, który cię zabije."',
      epigraphCiteSf: '- odprawa dowódcy armii, Szkoła Bojowa',
      figAria: 'Schemat odprawy: mapa pola z trzema oznaczonymi punktami, tylko one trafiają do AGENTS.md',
      figcaption: 'RYS. 04 // ODPRAWA: TYLKO TO, CZEGO NIE WYWNIOSKUJESZ',
      fig: {
        field: 'POLE BITWY // REPO',
        doc: 'AGENTS.MD',
        obvious: 'OCZYWISTE: POMINIĘTE',
        nonObvious: 'NIEOCZYWISTE: 3',
      },
      leadSfHtml:
        'Ender nie dostawał przed bitwą podręcznika taktyki - dostawał to, czego nie dało się wywnioskować z układu pola. AGENTS.md działa według tej samej zasady: <strong>tylko to, czego model nie wyniósł z treningu</strong>. Konwencje repo, komendy, pułapki - tak; tłumaczenie, czym jest framework - nie.',
      leadNeutralHtml:
        'AGENTS.md działa według jednej zasady: <strong>tylko to, czego model nie wyniósł z treningu</strong>. Konwencje repo, komendy, pułapki - tak; tłumaczenie, czym jest framework - nie.',
      leadHtml:
        'Wejście: repo po bootstrapie. Wyjście: <strong>AGENTS.md</strong> wygenerowany przez <em>/10x-agents-md</em> i oceniony przez <em>/10x-rule-review</em>. Mechanizm: <em>pętla feedbacku</em> - każde potknięcie agenta to kandydat na nową regułę, auto-memory dokłada obserwacje, a przegląd reguł wycina szum, zanim zagłuszy sygnał.',
      mechQ: 'co agent ma wiedzieć?',
      mechG: 'kontekst projektu bez szumu',
      mechAHtml: '<b>AGENTS.md</b> (/10x-agents-md, /10x-rule-review)',
      lessonLabel: 'M1·L4: Agent Onboarding',
      targetHtml:
        'kluczowy, zanim agent dostanie pierwsze poważne zadanie - <b>kontekst bez szumu</b> decyduje, czy pracuje z tobą weteran, czy rekrut po złej odprawie.',
    },
    l5: {
      num: 'LEKCJA 05',
      uniSuffix: ' · Skok w nadprzestrzeń',
      h2: 'Z localhosta na produkcję - gdzie i jak wypływamy?',
      epigraphSf:
        '„Skok bez kalkulacji nawigacyjnej kończy się w sercu gwiazdy. Najpierw trasa, potem dźwignia."',
      epigraphCiteSf: '- nawigator frachtowca, przed wejściem w nadprzestrzeń',
      figAria: 'Schemat skoku: trajektoria z localhosta na produkcję, kalkulacja nawigacyjna przed skokiem',
      figcaption: 'RYS. 05 // KALKULACJA PRZED SKOKIEM: LOCALHOST → PROD',
      fig: {
        localhost: 'LOCALHOST',
        prod: 'PROD',
        calc: 'KALKULACJA // PLAN MODE',
        note: 'SKOK DOPIERO PO POLICZENIU TRASY',
      },
      leadSfHtml:
        'Frachtowiec nie skacze na wyczucie - komputer nawigacyjny liczy trasę, zanim ktokolwiek pociągnie dźwignię. Deploy to ten sam manewr: <strong>świadoma decyzja infrastrukturalna</strong>, nie odruch. <em>/10x-infra-research</em> porównuje platformy pod twój projekt, a <em>Plan Mode</em> pozwala obejrzeć całą trajektorię zmian, zanim cokolwiek dotknie produkcji.',
      leadNeutralHtml:
        'Deploy to <strong>świadoma decyzja infrastrukturalna</strong>, nie odruch. <em>/10x-infra-research</em> porównuje platformy pod twój projekt, a <em>Plan Mode</em> pozwala obejrzeć pełną listę zmian, zanim cokolwiek dotknie produkcji.',
      leadPreHtml:
        'Wejście: działający projekt na localhoście plus prd.md. Wyjście: <strong>infrastructure.md, roadmap.md i pierwszy działający deploy</strong> - <em>/10x-roadmap</em> tnie PRD na pionowe wycinki, <em>/10x-deployment</em> domyka bramkę gotowości. Mechanizm: ',
      leadCalcSf: 'kalkulacja przed skokiem - ',
      leadPost:
        'platforma wybrana z dowodów, roadmapa wyznacza kolejność, deploy przechodzi preflight zamiast „u mnie działa".',
      mechQ: 'gdzie i jak wypływamy?',
      mechG: 'działający deploy zamiast wiecznego localhosta',
      mechAHtml:
        '<b>infrastructure.md + roadmap.md + deploy</b> (/10x-infra-research, /10x-deployment, /10x-roadmap)',
      lessonLabel: 'M1·L5: Od localhosta na produkcję',
      targetHtml:
        'kluczowy, zanim projekt zapuści korzenie na localhoście - <b>pierwszy deploy ma wyjść z fundamentu</b>, bo dopiero produkcja weryfikuje decyzje.',
    },
    next: {
      num: 'DALEJ',
      uniSf: 'Rampa oddaje jednostkę · Core Skills Chain',
      h2: 'Dalej: łańcuch',
      leftMono: 'CO ZOSTAWIA FUNDAMENT',
      leftMonoSf: ' // RAMPA GOTOWA',
      leftLead:
        'Fundament kończy się tym, że łańcuch ma na czym ruszyć. Trzy rzeczy czekają na pierwszą jednostkę pracy.',
      leftMech: {
        d1t: 'prd.md',
        d1d: 'co budujemy i po co - ustalenia zapisane na dysku',
        d2t: 'roadmap.md',
        d2d: 'pionowe wycinki end-to-end, kolejność budowy',
        d3t: 'środowisko',
        d3d: 'scaffold z oficjalnego CLI, AGENTS.md, działający deploy',
      },
      rightMono: 'MODUŁ 2 // CORE SKILLS CHAIN',
      m2LeadPre: 'Pięć ',
      m2LeadSf: 'skoków',
      m2LeadNeutral: 'kroków',
      m2LeadPostHtml:
        ' jednej jednostki pracy: <b>new → research → plan → implement → review</b>. Każdy krok zostawia artefakt na dysku - pełna mapa na stronie łańcucha.',
      cscDt: 'strona CSC',
      cscLink: 'Core Skills Chain (CSC)',
      previewDt: 'zapowiedź',
      previewDd: 'skalowanie: quality gates, goal, loops - gdy rośnie ryzyko i/lub złożoność',
      finisSf: '„Zbudowałeś rampę. Od teraz lata się łańcuchem."',
      finisCiteSf: '- fundament 10x Workflow',
      finisNeutral: '„Fundament gotowy. Od teraz pracuje się łańcuchem."',
      finisCiteNeutral: '- fundament 10x Workflow',
    },
    dd: {
      shape: [
        {
          label: 'PO CO',
          body: '<p>Głowa łańcucha bootstrapu: zamienia „mam pomysł" (greenfield) albo „chcę zmienić ten system" (brownfield) w ustrukturyzowane notatki, z których <code>/10x-prd</code> wygeneruje PRD zgodny z zablokowanym schematem. Skill jest <b>facylitatorem, nie generatorem</b> - nigdy nie pisze wizji, wymagań ani reguł biznesowych, których użytkownik nie powiedział; jego wartość to kształt i kolejność pytań.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: pomysł w wolnej formie - inline, plik z notatkami albo rozmowa. Wyjście: <code>context/foundation/shape-notes.md</code> z checkpointem we frontmatterze (bieżąca faza, fazy ukończone, liczba zebranych wymagań), więc sesję można przerwać i wznowić od następnej fazy zamiast od zera. Na koniec komenda <code>/10x-prd</code> trafia do schowka.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Każda faza odkrywcza idzie tą samą pętlą:</p><ul><li>otwarcie fazy jednym pytaniem otwartym - pierwszą wersję treści daje użytkownik,</li><li>3-5 „szarych stref" jako decyzje z realnymi opcjami i kompromisami,</li><li>jedna opcja oznaczona jako rekomendowana plus zawsze opcja „nie wiem",</li><li>potwierdzenie decyzji jednym zdaniem i dopiero wtedy zapis fazy na dysk.</li></ul>',
        },
        {
          label: 'GREENFIELD / BROWNFIELD',
          body: '<p>Tryb wykrywany automatycznie z katalogu, na podstawie trzech poziomów sygnałów: historia gita (silny), lockfile (silny), sam manifest (niejednoznaczny - może być świeży <code>npm init</code>). Brownfield dodaje sekcję o istniejącym systemie i pytanie „co NIE może się zepsuć", a potwierdzony <code>context_type</code> steruje dalszym routingiem <code>/10x-prd</code>.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Trzy twarde reguły: nie generuje treści, których użytkownik nie powiedział; nigdy nie przesądza stacku (framework, baza, hosting - to decyzje kroków za <code>/10x-prd</code>); wymaga zainicjalizowanego <code>context/foundation/</code> - jeśli go brakuje, deleguje scaffold do <code>/10x-init</code>.</p>',
        },
      ],
      bootstrapper: [
        {
          label: 'PO CO',
          body: '<p>Ogon łańcucha bootstrapu (<code>/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper</code>). Jedno zadanie: zamienić zapisany handoff tech-stacku w projekt postawiony ze startera w bieżącym katalogu, z logiem weryfikacji do przejrzenia. Z rejestru starterów tylko korzysta - startery definiuje <code>/10x-tech-stack-selector</code>.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: <code>context/foundation/tech-stack.md</code> - twardy warunek wstępny. Bez tego pliku skill odmawia i odsyła do <code>/10x-tech-stack-selector</code>; nie zastąpi go nawet stack omówiony wcześniej w rozmowie - kontraktem jest plik na dysku. Wyjście: pliki projektu z oficjalnego startera plus <code>context/changes/bootstrap-verification/verification.md</code> jako ślad audytowy przebiegu.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Cztery kroki:</p><ul><li>powtórzenie wczytanego handoffu do potwierdzenia lub korekty,</li><li>lekki test świeżości startera (wersja paczki, ostatni push repo) - ostrzega, nie blokuje,</li><li>uruchomienie szablonu komendy oficjalnego CLI według jednej z trzech strategii pracy w katalogu,</li><li>audyt zależności po scaffoldzie z podziałem CRITICAL / HIGH / MODERATE / LOW.</li></ul>',
        },
        {
          label: 'POLITYKA KONFLIKTÓW',
          body: '<p><code>context/</code> jest zawsze zachowany - scaffold nigdy go nie nadpisze. Istniejące pliki w konflikcie dostają siostrzany plik <code>.scaffold</code>, a <code>.gitignore</code> jest scalany przez dopisanie. Niezerowy kod wyjścia CLI to twardy stop: katalog tymczasowy zostaje do inspekcji, a częściowy log weryfikacji trafia na dysk.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Nie generuje <code>AGENTS.md</code> / <code>CLAUDE.md</code> (to temat onboardingu agenta), nie robi <code>git init</code>, nie naprawia automatycznie znalezisk audytu - informuje, decyzja należy do człowieka.</p>',
        },
      ],
      agentsMd: [
        {
          label: 'PO CO',
          body: '<p>Generuje <code>AGENTS.md</code> - dokument onboardingowy dla agentów AI pracujących w repozytorium. Krótki, specyficzny dla projektu i uporządkowany według dźwigni: najcięższe reguły i najczęściej używane komendy na górze, tak żeby świeży agent przeczytał raz i dalej się nie blokował.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: samo repo - manifest, README, konfiguracje lint/test, układ katalogów i 30 ostatnich commitów (stąd konwencja komunikatów commitów). Wyjście: <code>AGENTS.md</code> o budżecie <b>200-400 słów</b> (120-250 dla wariantu katalogowego), z referencjami <code>@ścieżka/do/pliku</code> zamiast wklejek konfiguracji.</p>',
        },
        {
          label: 'AKTUALIZACJA',
          body: '<p>Gdy plik już istnieje, skill nie nadpisuje. Datuje go przez <code>git log</code>, porównuje stan repo od ostatniej edycji i klasyfikuje każdą linię: <b>KEEP / UPDATE / REMOVE / MISSING</b>. Potem edytuje chirurgicznie - po zatwierdzeniu listy zmian przez użytkownika - zamiast przepisywać od zera.</p>',
        },
        {
          label: 'BRAMKI JAKOŚCI',
          body: '<p>Pięć twardych bramek przed zapisem:</p><ul><li>budżet długości - za krótko znaczy brak konkretów, za dużo znaczy wata,</li><li>zero wielolinijkowych snippetów - zamiast nich referencja do pliku,</li><li>każda reguła sprawdzalna na diffie (odpada „clean code" i „best practices"),</li><li>zero wiedzy, którą model i tak wyniósł z treningu,</li><li>reguły krytyczne w pierwszej jednej trzeciej pliku.</li></ul>',
        },
        {
          label: 'ANTYWZORCE',
          body: '<p>Nie wymyśla faktów o projekcie - każde zdanie musi mieć pokrycie w obejrzanym pliku, komendzie albo commicie. Nie powtarza domyślnych ustawień frameworka ani tutoriali języka; tylko wiedza specyficzna dla projektu zasługuje na linię.</p>',
        },
      ],
      deployment: [
        {
          label: 'PO CO',
          body: '<p>Bramka gotowości do wdrożenia na PaaS (Cloudflare, Vercel, Netlify, Fly.io, Railway, Render). Bierze działające repo, klasyfikuje je, dobiera platformę i przepuszcza przez realny preflight - zanim pierwszy deploy zderzy się z limitami platformy w produkcji.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: repo (zawsze źródło prawdy) plus wskazówki z <code>tech-stack.md</code> i <code>prd.md</code>, jeśli istnieją - przy rozjeździe dokumentu z kodem wygrywa kod, a rozbieżność trafia do raportu. Wyjście: <code>context/foundation/deploy-readiness.md</code> plus minimalny natywny config platformy (<code>wrangler.toml</code>, <code>fly.toml</code>, <code>Dockerfile</code>, workflow GHA - zależnie od toru).</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Repo trafia do jednego z sześciu torów (static, edge-js, node-server, container, job, hybrid) na podstawie sygnałów z kodu, nie deklaracji użytkownika. Adapter frameworka potrafi zablokować wybór platformy (config pod inną po prostu by nie działał), a limity platformy są pobierane z jej dokumentacji w momencie uruchomienia - z cytowanym adresem i znacznikiem czasu.</p>',
        },
        {
          label: 'ANATOMIA PREFLIGHTU',
          body: '<p>Każde sprawdzenie kończy się jako <b>pass / warn / block</b>, a dowolny block zatrzymuje emisję configów. Uniwersalnie: <code>.gitignore</code> kryje <code>.env</code>, skan sekretów śledzonych przez gita, pokrycie zmiennych środowiskowych względem <code>.env.example</code>. Torowo: build przechodzi, rozmiar bundla lub obrazu kontra limit, zakazane API Node w bundlu edge, healthcheck w kontenerze.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>To generator dokumentu i configów, nie deployer - nie pushuje obrazów, nie ustawia sekretów w repo, nie odpala deployu za plecami. Tryb prowadzony (CLI lub MCP) wykonuje kroki wyłącznie z potwierdzeniem per krok, a wartości sekretów nigdy nie przechodzą przez pamięć skilla ani żaden zapisywany plik.</p>',
        },
      ],
    },
  },
  en: {
    eyebrow: 'MODULE 1 // FOUNDATION',
    h1Pre: 'From idea to ',
    h1GlowSf: 'the launch ramp',
    h1GlowNeutral: 'the first deployment',
    subSfHtml:
      'The <strong>10x Workflow</strong> Foundation: five lessons that turn a hazy idea into a project ready for flight - <strong>PRD, skills, bootstrap, agent onboarding and the first deploy</strong>. The ramp ends where the CSC chain begins.',
    subNeutralHtml:
      'The <strong>10x Workflow</strong> Foundation: five lessons that turn a hazy idea into a project ready for work - <strong>PRD, skills, bootstrap, agent onboarding and the first deploy</strong>. The Foundation ends where the CSC chain begins.',
    heroAria:
      'Diagram of the launch ramp: from the idea cloud, three ramp steps - shape, prd, roadmap - lead to the silhouette of the CSC chain; a unit flows across the whole ramp',
    heroNodeAria: {
      idea: 'Idea - hazy scope; module summary',
      step1: 'Ramp step 1: shape - a Socratic session; lesson 01',
      step2: 'Ramp step 2: prd - what we are building and why; lesson 01',
      step3: 'Ramp step 3: roadmap - the build order; lesson 05',
      csc: 'Silhouette of the CSC chain - module 2 starts here; the Next section',
    },
    hero: {
      ideaAnn: 'scope: hazy',
      idea: 'IDEA',
      step1: 'STEP 01',
      shape: 'SHAPE',
      shapeAnn: 'socratic session',
      step2: 'STEP 02',
      prd: 'PRD',
      prdAnn: 'what and why we build',
      step3: 'STEP 03',
      roadmap: 'ROADMAP',
      roadmapAnn: 'build order',
      cscAnn: 'module 2 starts here // csc',
    },
    mapCapSf: 'LAUNCH RAMP // CLICK A STEP TO FLY TO A SECTION',
    mapCapNeutral: 'MODULE MAP // CLICK A STEP TO JUMP TO A SECTION',
    routeAria: 'Module lessons',
    route: [
      '01 · idea → prd',
      '02 · skills',
      '03 · bootstrap',
      '04 · onboarding',
      '05 · production',
      'Next: the chain',
    ],
    sumEyebrow: 'Module summary · five lessons in 30 seconds',
    cards: [
      {
        num: 'LESSON 01',
        h3: 'From idea to PRD',
        p: 'What are we really building? Decisions that later prompts cannot undermine.',
      },
      {
        num: 'LESSON 02',
        h3: 'From chatbot to Agent',
        p: 'What does the agent play with? Repeatable tools instead of one-off prompts.',
      },
      {
        num: 'LESSON 03',
        h3: 'AI-Powered Bootstrap',
        p: 'What do we build on? A starter from the official CLI, not boilerplate from a generator.',
      },
      {
        num: 'LESSON 04',
        h3: 'Agent Onboarding',
        p: 'What should the agent know? Project context without the noise.',
      },
      {
        num: 'LESSON 05',
        h3: 'From localhost to production',
        p: 'Where and how do we ship out? A working deploy instead of eternal localhost.',
      },
    ],
    sumEpigraph: '"Before you write the first line of code - run a /10x-shape session."',
    sumEpigraphCite: '- a 10x Workflow cornerstone',
    mechDt: { q: 'Question', g: 'Guarantee', a: 'Artifact', l: 'Lesson' },
    targetK: 'GOAL:',
    l1: {
      num: 'LESSON 01',
      uniSuffix: ' · The Bene Gesserit test',
      h2: 'From idea to PRD - what are we really building?',
      epigraphSf:
        '"I ask questions before I allow anything to come into being. Precision before action - or not at all."',
      epigraphCiteSf: '- a Bene Gesserit Reverend Mother, the test before admission to the work',
      figAria: 'Diagram of the test: three questions converge through the test gate into a single PRD document',
      figcaption: 'FIG. 01 // QUESTIONS CONVERGE INTO ONE DOCUMENT',
      fig: {
        q1: 'WHY?',
        q2: 'FOR WHOM?',
        q3: 'WHAT TO SKIP?',
        test: 'TEST: QUESTIONS BEFORE ACTION',
        prd: 'PRD.MD',
        answers: 'ANSWERS: ON DISK, NOT IN CHAT',
      },
      leadSfHtml:
        'The Bene Gesserit do not trust declarations - they test before they recognize someone as human. The Foundation applies the same rigor to an idea: before anything comes into being, the idea passes a test of questions. <em>/10x-shape</em> runs a Socratic session and detects on its own whether the game is played on an open field or in an existing repo (greenfield/brownfield). Without it, "I have an app idea" falls apart by the third prompt.',
      leadNeutralHtml:
        'Before anything comes into being, the idea passes a test of questions. <em>/10x-shape</em> runs a Socratic session and detects on its own whether you are starting from scratch or working in an existing repo (greenfield/brownfield). Without it, "I have an app idea" falls apart by the third prompt.',
      leadHtml:
        'Input: a loose idea or an existing project. Output: <strong>shape-notes.md</strong>, and from it <strong>prd.md</strong> after a pass through <em>/10x-prd</em>. Mechanism: questions come before generation - the PRD writes the decisions down on disk, so later prompts build on them instead of quietly undermining them.',
      mechQ: 'what are we really building?',
      mechG: 'decisions that later prompts cannot undermine',
      mechAHtml: '<b>shape-notes.md → prd.md</b> (/10x-shape, /10x-prd)',
      lessonLabel: 'M1·L1: From idea to PRD',
      targetHtml:
        'key at the start of every project - <b>before a line of code exists</b>, a record of what we are building and why must exist on disk.',
    },
    l2: {
      num: 'LESSON 02',
      uniSuffix: ' · The Carving',
      h2: 'From chatbot to Agent - what does the agent play with?',
      epigraphSf:
        '"I am not teaching you to pass as a Gold. I rebuild you once - and then every hall and every battlefield stands open before you."',
      epigraphCiteSf: '- a body Carver, before the carving procedure',
      figAria:
        'Diagram of the transformation: a skill module travels from the workshop to the carving chamber, one-off prompts fade in the background',
      figcaption: 'FIG. 02 // MODULE INSTALLED ONCE, REPLAYED FOREVER',
      fig: {
        prompt: 'PROMPT ×1: VANISHES INTO CHAT HISTORY',
        module: 'SKILL // MODULE',
        carve: 'CARVING: ONCE',
        after: 'AFTER: A DIFFERENT CLASS OF TASKS',
      },
      leadSfHtml:
        'A Red does not win the Institute with a better pickaxe - he goes through the carving once and comes back a Gold, with access to tasks he previously had no right to even think about. That is exactly where the line between a chatbot and an agent runs: <strong>a skill is not a prompt</strong>. A prompt lives once and dies in chat history; a skill is a replayable pair of contracts - what goes in, what comes out - and a transformation performed once opens up an entirely different class of actions: you invoke it on the hundredth task as confidently as on the first.',
      leadNeutralHtml:
        'The difference between a chatbot and an agent runs through the tools: <strong>a skill is not a prompt</strong>. A prompt lives once and dies in chat history; a skill is a replayable pair of contracts - what goes in, what comes out - that you invoke on the hundredth task as confidently as on the first.',
      leadHtml:
        'Input: a recurring problem you currently handle with an ever-longer prompt. Output: <strong>a skill with an input/output contract</strong>, saved next to the code. Mechanism: <em>metaprompting</em> - the agent helps write its own tools, and every polished skill raises the quality of all future runs, not just one.',
      mechQ: 'what does the agent play with?',
      mechG: 'repeatable tools instead of one-off prompts',
      mechAHtml: '<b>skills with input/output contracts</b> (metaprompting)',
      lessonLabel: 'M1·L2: From chatbot to Agent',
      targetHtml:
        'key when you are writing the same prompt for the third time - <b>repeatable work should be a module</b>, not improvisation in a chat window.',
    },
    l3: {
      num: 'LESSON 03',
      uniSuffix: ' · The Tycho shipyard',
      h2: 'AI-Powered Bootstrap - what do we build on?',
      epigraphSf:
        '"Hulls come off the shipyard docks, not from under a hammer in a workshop. The dock knows the tolerances better than the best welder."',
      epigraphCiteSf: '- a Tycho Station shipwright, at the launch of a hull',
      figAria: 'Diagram of the shipyard: a hull rolls out of the dock along guide rails, hand-worked plating is left behind',
      figcaption: 'FIG. 03 // A HULL FROM THE DOCKS, NOT FROM HAND-WORKED PLATING',
      fig: {
        yard: 'SHIPYARD // OFFICIAL CLI',
        hull: 'HULL // STARTER',
        plating: 'HAND-WORKED PLATING: 0',
        tolerances: 'TOLERANCES: KNOWN',
      },
      leadSfHtml:
        'Tycho Station does not hammer out hulls by hand - they are built by a dock that knows the tolerances and the procedures. Project bootstrap works the same way: instead of asking the model to generate boilerplate from memory, the Foundation <strong>delegates to official CLIs</strong>. <em>/10x-tech-stack-selector</em> reads prd.md and picks the stack through quality gates, and <em>/10x-bootstrapper</em> runs the official starter of the chosen framework.',
      leadNeutralHtml:
        'Project bootstrap is not about generating boilerplate from the model\'s memory - the Foundation <strong>delegates to official CLIs</strong>. <em>/10x-tech-stack-selector</em> reads prd.md and picks the stack through quality gates, and <em>/10x-bootstrapper</em> runs the official starter of the chosen framework.',
      leadHtml:
        'Input: prd.md (greenfield) or an existing repo (brownfield: <em>/10x-stack-assess</em> → <em>/10x-health-check</em>). Output: <strong>tech-stack.md and a working scaffold</strong> from the official CLI. Mechanism: the agent gets a clear permission policy - what it may run without asking and what requires a human - so the project start is fast and still under control.',
      mechQ: 'what do we build on?',
      mechG: 'a starter from the official CLI, not boilerplate from a generator',
      mechAHtml:
        '<b>tech-stack.md + scaffold</b> (/10x-bootstrapper; brownfield: /10x-stack-assess, /10x-health-check)',
      lessonLabel: 'M1·L3: AI-Powered Bootstrap',
      targetHtml:
        'key when standing up a repo - <b>the official CLI lays the foundations</b>, because boilerplate generated from the model\'s memory breaks at the first framework update.',
    },
    l4: {
      num: 'LESSON 04',
      uniSuffix: ' · The pre-battle briefing',
      h2: 'Agent Onboarding - what should the agent know?',
      epigraphSf:
        '"At the briefing you get only what you cannot infer from the battlefield yourself. Everything else is noise that will get you killed."',
      epigraphCiteSf: '- an army commander\'s briefing, Battle School',
      figAria: 'Diagram of the briefing: a field map with three marked points, only they make it into AGENTS.md',
      figcaption: 'FIG. 04 // BRIEFING: ONLY WHAT YOU CANNOT INFER',
      fig: {
        field: 'BATTLEFIELD // REPO',
        doc: 'AGENTS.MD',
        obvious: 'OBVIOUS: OMITTED',
        nonObvious: 'NON-OBVIOUS: 3',
      },
      leadSfHtml:
        'Ender was not handed a tactics manual before a battle - he got what could not be inferred from the layout of the field. AGENTS.md works by the same principle: <strong>only what the model did not pick up in training</strong>. Repo conventions, commands, pitfalls - yes; explaining what a framework is - no.',
      leadNeutralHtml:
        'AGENTS.md works by a single principle: <strong>only what the model did not pick up in training</strong>. Repo conventions, commands, pitfalls - yes; explaining what a framework is - no.',
      leadHtml:
        'Input: the repo after bootstrap. Output: <strong>AGENTS.md</strong> generated by <em>/10x-agents-md</em> and scored by <em>/10x-rule-review</em>. Mechanism: <em>a feedback loop</em> - every agent stumble is a candidate for a new rule, auto-memory adds observations, and the rule review cuts the noise before it drowns out the signal.',
      mechQ: 'what should the agent know?',
      mechG: 'project context without the noise',
      mechAHtml: '<b>AGENTS.md</b> (/10x-agents-md, /10x-rule-review)',
      lessonLabel: 'M1·L4: Agent Onboarding',
      targetHtml:
        'key before the agent gets its first serious task - <b>context without noise</b> decides whether you are working with a veteran or a recruit after a bad briefing.',
    },
    l5: {
      num: 'LESSON 05',
      uniSuffix: ' · The hyperspace jump',
      h2: 'From localhost to production - where and how do we ship out?',
      epigraphSf:
        '"A jump without navigation calculations ends in the heart of a star. First the route, then the lever."',
      epigraphCiteSf: '- a freighter navigator, before entering hyperspace',
      figAria: 'Diagram of the jump: a trajectory from localhost to production, navigation calculations before the jump',
      figcaption: 'FIG. 05 // CALCULATION BEFORE THE JUMP: LOCALHOST → PROD',
      fig: {
        localhost: 'LOCALHOST',
        prod: 'PROD',
        calc: 'CALCULATION // PLAN MODE',
        note: 'JUMP ONLY AFTER THE ROUTE IS COMPUTED',
      },
      leadSfHtml:
        'A freighter does not jump on instinct - the nav computer calculates the route before anyone pulls the lever. A deploy is the same maneuver: <strong>a deliberate infrastructure decision</strong>, not a reflex. <em>/10x-infra-research</em> compares platforms for your project, and <em>Plan Mode</em> lets you inspect the whole trajectory of changes before anything touches production.',
      leadNeutralHtml:
        'A deploy is <strong>a deliberate infrastructure decision</strong>, not a reflex. <em>/10x-infra-research</em> compares platforms for your project, and <em>Plan Mode</em> lets you inspect the full list of changes before anything touches production.',
      leadPreHtml:
        'Input: a working project on localhost plus prd.md. Output: <strong>infrastructure.md, roadmap.md and the first working deploy</strong> - <em>/10x-roadmap</em> cuts the PRD into vertical slices, <em>/10x-deployment</em> closes the readiness gate. Mechanism: ',
      leadCalcSf: 'calculation before the jump - ',
      leadPost:
        'the platform is chosen from evidence, the roadmap sets the order, and the deploy passes preflight instead of "works on my machine".',
      mechQ: 'where and how do we ship out?',
      mechG: 'a working deploy instead of eternal localhost',
      mechAHtml:
        '<b>infrastructure.md + roadmap.md + deploy</b> (/10x-infra-research, /10x-deployment, /10x-roadmap)',
      lessonLabel: 'M1·L5: From localhost to production',
      targetHtml:
        'key before the project puts down roots on localhost - <b>the first deploy should come out of the Foundation</b>, because only production verifies decisions.',
    },
    next: {
      num: 'NEXT',
      uniSf: 'The ramp hands over the unit · Core Skills Chain',
      h2: 'Next: the chain',
      leftMono: 'WHAT THE FOUNDATION LEAVES BEHIND',
      leftMonoSf: ' // RAMP READY',
      leftLead:
        'The Foundation ends with the chain having something to start from. Three things await the first unit of work.',
      leftMech: {
        d1t: 'prd.md',
        d1d: 'what we are building and why - decisions written down on disk',
        d2t: 'roadmap.md',
        d2d: 'vertical end-to-end slices, the build order',
        d3t: 'environment',
        d3d: 'a scaffold from the official CLI, AGENTS.md, a working deploy',
      },
      rightMono: 'MODULE 2 // CORE SKILLS CHAIN',
      m2LeadPre: 'Five ',
      m2LeadSf: 'jumps',
      m2LeadNeutral: 'steps',
      m2LeadPostHtml:
        ' of a single unit of work: <b>new → research → plan → implement → review</b>. Every step leaves an artifact on disk - the full map is on the chain page.',
      cscDt: 'CSC page',
      cscLink: 'Core Skills Chain (CSC)',
      previewDt: 'coming up',
      previewDd: 'scaling: quality gates, goal, loops - when risk and/or complexity grow',
      finisSf: '"You built the ramp. From here on, you fly the chain."',
      finisCiteSf: '- a 10x Workflow cornerstone',
      finisNeutral: '"The Foundation is ready. From here on, you work the chain."',
      finisCiteNeutral: '- a 10x Workflow cornerstone',
    },
    dd: {
      shape: [
        {
          label: 'WHY',
          body: '<p>The head of the bootstrap chain: it turns "I have an idea" (greenfield) or "I want to change this system" (brownfield) into structured notes from which <code>/10x-prd</code> generates a PRD conforming to the locked schema. The skill is <b>a facilitator, not a generator</b> - it never writes vision, requirements or business rules the user did not state; its value is the shape and order of the questions.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: an idea in free form - inline, a file with notes or a conversation. Output: <code>context/foundation/shape-notes.md</code> with a checkpoint in the frontmatter (current phase, completed phases, number of collected requirements), so a session can be interrupted and resumed from the next phase instead of from zero. At the end, the <code>/10x-prd</code> command lands in the clipboard.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>Every discovery phase runs the same loop:</p><ul><li>the phase opens with one open-ended question - the first version of the content comes from the user,</li><li>3-5 "gray areas" as decisions with real options and trade-offs,</li><li>one option marked as recommended, plus an "I don\'t know" option always on the table,</li><li>the decision confirmed in a single sentence, and only then is the phase written to disk.</li></ul>',
        },
        {
          label: 'GREENFIELD / BROWNFIELD',
          body: '<p>The mode is detected automatically from the directory, based on three levels of signals: git history (strong), lockfile (strong), the manifest alone (ambiguous - it may be a fresh <code>npm init</code>). Brownfield adds a section about the existing system and the question "what must NOT break", and the confirmed <code>context_type</code> drives the further routing of <code>/10x-prd</code>.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>Three hard rules: it does not generate content the user did not state; it never prejudges the stack (framework, database, hosting - those are decisions for the steps after <code>/10x-prd</code>); it requires an initialized <code>context/foundation/</code> - if it is missing, it delegates the scaffold to <code>/10x-init</code>.</p>',
        },
      ],
      bootstrapper: [
        {
          label: 'WHY',
          body: '<p>The tail of the bootstrap chain (<code>/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper</code>). One job: turn the saved tech-stack handoff into a project scaffolded from a starter in the current directory, with a verification log to review. It only consumes the starter registry - starters are defined by <code>/10x-tech-stack-selector</code>.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: <code>context/foundation/tech-stack.md</code> - a hard precondition. Without that file the skill refuses and points back to <code>/10x-tech-stack-selector</code>; not even a stack discussed earlier in the conversation can replace it - the contract is the file on disk. Output: project files from the official starter plus <code>context/changes/bootstrap-verification/verification.md</code> as an audit trail of the run.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>Four steps:</p><ul><li>replaying the loaded handoff for confirmation or correction,</li><li>a light starter freshness test (package version, last repo push) - it warns, it does not block,</li><li>running the official CLI command template using one of three directory strategies,</li><li>a post-scaffold dependency audit split into CRITICAL / HIGH / MODERATE / LOW.</li></ul>',
        },
        {
          label: 'CONFLICT POLICY',
          body: '<p><code>context/</code> is always preserved - the scaffold never overwrites it. Existing files in conflict get a sibling <code>.scaffold</code> file, and <code>.gitignore</code> is merged by appending. A non-zero CLI exit code is a hard stop: the temporary directory stays for inspection, and a partial verification log lands on disk.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>It does not generate <code>AGENTS.md</code> / <code>CLAUDE.md</code> (that is the agent onboarding topic), does not run <code>git init</code>, does not auto-fix audit findings - it informs, the decision belongs to the human.</p>',
        },
      ],
      agentsMd: [
        {
          label: 'WHY',
          body: '<p>Generates <code>AGENTS.md</code> - an onboarding document for AI agents working in the repository. Short, project-specific and ordered by leverage: the heaviest rules and the most-used commands at the top, so a fresh agent reads it once and stays unblocked.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: the repo itself - the manifest, README, lint/test configs, directory layout and the last 30 commits (that is where the commit message convention comes from). Output: an <code>AGENTS.md</code> with a budget of <b>200-400 words</b> (120-250 for the directory variant), with <code>@path/to/file</code> references instead of pasted configuration.</p>',
        },
        {
          label: 'UPDATE',
          body: '<p>When the file already exists, the skill does not overwrite. It dates it via <code>git log</code>, compares the repo state since the last edit and classifies every line: <b>KEEP / UPDATE / REMOVE / MISSING</b>. Then it edits surgically - after the user approves the change list - instead of rewriting from scratch.</p>',
        },
        {
          label: 'QUALITY GATES',
          body: '<p>Five hard gates before saving:</p><ul><li>the length budget - too short means no specifics, too long means filler,</li><li>zero multi-line snippets - a file reference instead,</li><li>every rule checkable against a diff ("clean code" and "best practices" are out),</li><li>zero knowledge the model picked up in training anyway,</li><li>critical rules in the first third of the file.</li></ul>',
        },
        {
          label: 'ANTI-PATTERNS',
          body: '<p>It does not invent facts about the project - every sentence must be backed by an inspected file, command or commit. It does not repeat framework defaults or language tutorials; only project-specific knowledge earns a line.</p>',
        },
      ],
      deployment: [
        {
          label: 'WHY',
          body: '<p>A deployment-readiness gate for PaaS (Cloudflare, Vercel, Netlify, Fly.io, Railway, Render). It takes a working repo, classifies it, picks a platform and runs it through a real preflight - before the first deploy collides with platform limits in production.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: the repo (always the source of truth) plus hints from <code>tech-stack.md</code> and <code>prd.md</code> if they exist - when a document diverges from the code, the code wins and the divergence goes into the report. Output: <code>context/foundation/deploy-readiness.md</code> plus a minimal platform-native config (<code>wrangler.toml</code>, <code>fly.toml</code>, <code>Dockerfile</code>, a GHA workflow - depending on the track).</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>The repo lands in one of six tracks (static, edge-js, node-server, container, job, hybrid) based on signals from the code, not the user\'s declaration. A framework adapter can veto a platform choice (a config for a different one simply would not work), and platform limits are fetched from its documentation at run time - with a cited URL and a timestamp.</p>',
        },
        {
          label: 'PREFLIGHT ANATOMY',
          body: '<p>Every check ends as <b>pass / warn / block</b>, and any block stops config emission. Universally: <code>.gitignore</code> covers <code>.env</code>, a scan for git-tracked secrets, environment variable coverage against <code>.env.example</code>. Per track: the build passes, bundle or image size versus the limit, forbidden Node APIs in an edge bundle, a healthcheck in the container.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>It is a document and config generator, not a deployer - it does not push images, does not set secrets in the repo, does not fire a deploy behind your back. Guided mode (CLI or MCP) executes steps only with per-step confirmation, and secret values never pass through the skill\'s memory or any saved file.</p>',
        },
      ],
    },
  },
};
