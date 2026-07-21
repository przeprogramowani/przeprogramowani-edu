/**
 * Slownik strony "Core Skills Chain" (csc/CscBody). Struktura kluczy
 * odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja inline markup
 * (strong/b/em) i renderuja sie przez set:html. Pary sf-only/neutral-only
 * zostaja w markupie body - slownik dostarcza tylko teksty (Pre/Sf/Neutral/Post).
 * Tresci paneli DeepDive (dd) takze mieszkaja tutaj (label + body HTML).
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface ChainNode {
  aria: string;
  /** Adnotacja nad boxem; 2 elementy = 2 linie (tspan w markupie). */
  annTop: string[];
  knum: string;
  klbl: string;
  /** Adnotacja pod boxem; 2 elementy = 2 linie (tspan w markupie). */
  annBottom: string[];
}

interface DdItem {
  label: string;
  /** HTML kroku deep dive (p/code/b) - renderowany przez set:html w DeepDive. */
  body: string;
}

interface CscStep {
  num: string;
  /** Dopisek po nazwie uniwersum w sec-uni: "<universeName> · <uniSub>". */
  uniSub: string;
  h2: string;
  epigraphSf: string;
  epigraphCiteSf: string;
  figAria: string;
  /** Etykiety <text> w SVG figury, w kolejnosci dokumentu. */
  fig: string[];
  figcaption: string;
  leadSfHtml: string;
  leadNeutralHtml: string;
  /** Trzeci akapit .lead - wspolny dla obu trybow. */
  lead3Html: string;
  mechQ: string;
  mechG: string;
  mechArtHtml: string;
  skillLink: string;
  targetHtml: string;
  dd: DdItem[];
}

interface FndRow {
  dt: string;
  ddHtml: string;
}

interface CscDict {
  eyebrow: string;
  h1Pre: string;
  h1Sf: string;
  h1Neutral: string;
  subPreHtml: string;
  subSf: string;
  subNeutral: string;
  subPostHtml: string;
  svgAria: string;
  nodes: {
    new: ChainNode;
    research: ChainNode;
    plan: ChainNode;
    implement: ChainNode;
    review: ChainNode;
    archive: ChainNode;
  };
  mapCapPre: string;
  mapCapSf: string;
  mapCapNeutral: string;
  mapCapPost: string;
  routeAria: string;
  route: [string, string, string, string, string, string, string, string];
  sum: {
    eyebrowPre: string;
    eyebrowSf: string;
    eyebrowNeutral: string;
    eyebrowPost: string;
    cards: { num: string; h3: string; p: string }[];
    finis: string;
    finisCite: string;
  };
  /** Etykiety dt w blokach mech krokow 01-05 (wspolne). */
  mechDt: { q: string; g: string; a: string; s: string };
  targetK: string;
  k1: Omit<CscStep, 'lead3Html'> & {
    lead3PreHtml: string;
    lead3Sf: string;
    lead3Neutral: string;
    lead3PostHtml: string;
  };
  k2: CscStep;
  k3: CscStep;
  k4: CscStep;
  k5: CscStep;
  k6: CscStep;
  /** Sekcja "W praktyce": lancuch na roznych ksztaltach pracy + kiedy siegac po dodatki. */
  app: {
    numSf: string;
    numNeutral: string;
    uniSf: string;
    h2: string;
    /** Lewa kolumna: ten sam lancuch, rozne ksztalty pracy. */
    aMono: string;
    aLeadHtml: string;
    aRows: FndRow[];
    /** Prawa kolumna: wyspecjalizowane skille i ich wyzwalacze. */
    bMono: string;
    bLeadHtml: string;
    bRows: FndRow[];
  };
  fnd: {
    numSf: string;
    numNeutral: string;
    uniSf: string;
    h2: string;
    aMono: string;
    aLeadHtml: string;
    aRows: FndRow[];
    bMono: string;
    bLeadHtml: string;
    bRows: FndRow[];
  };
}

export const CSC: Record<Lang, CscDict> = {
  pl: {
    eyebrow: 'MODUŁ 2 // CORE SKILLS CHAIN',
    h1Pre: 'Jedna jednostka pracy, ',
    h1Sf: 'sześć skoków',
    h1Neutral: 'sześć kroków',
    subPreHtml: 'Rdzeń <strong>10x Workflow</strong>: sześć ',
    subSf: 'skoków',
    subNeutral: 'kroków',
    subPostHtml:
      ' jednej jednostki pracy - od wyznaczenia zakresu po domknięcie. <strong>new → research → plan → implement → review → archive</strong>, a każdy krok zostawia artefakt na dysku. Ten sam łańcuch obsługuje <strong>~90% codziennych zadań</strong> - nie tylko nowe feature’y.',
    svgAria:
      'Diagram Core Skills Chain: sześć kroków - new, research, plan, implement, review, archive - połączonych strzałkami; jednostka pracy przepływa przez cały łańcuch',
    nodes: {
      new: {
        aria: 'Krok 01: new - jedna jednostka pracy; jasny, odwracalny zakres',
        annTop: ['jedna jednostka pracy'],
        knum: 'KROK 01',
        klbl: 'NEW',
        annBottom: ['jasny, odwracalny zakres'],
      },
      research: {
        aria: 'Krok 02: research - dowody do planu; fakty zamiast założeń',
        annTop: ['dowody do planu'],
        knum: 'KROK 02',
        klbl: 'RESEARCH',
        annBottom: ['fakty zamiast założeń'],
      },
      plan: {
        aria: 'Krok 03: plan - kluczowe decyzje deva; etapy + warunki sukcesu',
        annTop: ['kluczowe decyzje deva'],
        knum: 'KROK 03',
        klbl: 'PLAN',
        annBottom: ['etapy + warunki sukcesu'],
      },
      implement: {
        aria: 'Krok 04: implement - implementacja etap po etapie; commitowane, weryfikowalne kroki',
        annTop: ['implementacja', 'etap po etapie'],
        knum: 'KROK 04',
        klbl: 'IMPLEMENT',
        annBottom: ['commitowane,', 'weryfikowalne kroki'],
      },
      review: {
        aria: 'Krok 05: review - czy implementacja realizuje plan?; analiza subagentów: plan vs kod',
        annTop: ['czy implementacja', 'realizuje plan?'],
        knum: 'KROK 05',
        klbl: 'REVIEW',
        annBottom: ['analiza subagentów:', 'plan vs kod'],
      },
      archive: {
        aria: 'Krok 06: archive - domknięcie zmiany; lekcje do foundation, folder do archiwum',
        annTop: ['domknięcie zmiany'],
        knum: 'KROK 06',
        klbl: 'ARCHIVE',
        annBottom: ['lekcje + archiwum'],
      },
    },
    mapCapPre: 'ŁAŃCUCH CSC // KLIKNIJ KROK, BY ',
    mapCapSf: 'DOLECIEĆ',
    mapCapNeutral: 'PRZEJŚĆ',
    mapCapPost: ' DO SEKCJI',
    routeAria: 'Kroki łańcucha',
    route: ['01 · new', '02 · research', '03 · plan', '04 · implement', '05 · review', '06 · archive', 'W praktyce', 'Fundament i skalowanie'],
    sum: {
      eyebrowPre: 'Skrót łańcucha · sześć ',
      eyebrowSf: 'skoków',
      eyebrowNeutral: 'kroków',
      eyebrowPost: ' w 30 sekund',
      cards: [
        { num: 'KROK 01', h3: 'new', p: 'Jedna jednostka pracy z jasnym, odwracalnym zakresem.' },
        { num: 'KROK 02', h3: 'research', p: 'Dowody do planu: fakty z repozytorium zamiast założeń.' },
        { num: 'KROK 03', h3: 'plan', p: 'Kluczowe decyzje deva przed kodem: etapy + warunki sukcesu.' },
        { num: 'KROK 04', h3: 'implement', p: 'Etap po etapie: commitowane, weryfikowalne kroki.' },
        { num: 'KROK 05', h3: 'review', p: 'Czy implementacja realizuje plan? Subagenci: plan vs kod.' },
        { num: 'KROK 06', h3: 'archive', p: 'Domknięcie zmiany: lekcje do foundation, folder do archiwum.' },
      ],
      finis:
        '„Zacznij od 10xDevs Workflow™ Core Skills Chain (CSC). Dodatki dokładaj, gdy rośnie ryzyko i/lub złożoność."',
      finisCite: '- fundament 10x Workflow',
    },
    mechDt: { q: 'Pytanie', g: 'Gwarancja', a: 'Artefakt', s: 'Skill' },
    targetK: 'CEL:',
    k1: {
      num: 'KROK 01',
      uniSub: 'Wybór bitwy',
      h2: 'new - jedna jednostka pracy',
      epigraphSf: '„Brama wroga jest na dole."',
      epigraphCiteSf: '- Ender Wiggin, orientacja przed każdą bitwą w Sali Bitewnej',
      figAria: 'Schemat bramy: z chmury pomysłów przez bramę przechodzi jedna jednostka pracy',
      fig: ['ZLECENIA / POMYSŁY', 'ZAKRES: ROZMYTY', 'BRAMA: JEDNA JEDNOSTKA', 'RESZTA CZEKA W KOLEJCE'],
      figcaption: 'RYS. 01 // BRAMA - DO GRY WCHODZI JEDNA JEDNOSTKA PRACY',
      leadSfHtml:
        'Ender przed każdą bitwą najpierw ustawiał sobie pole: gdzie jest brama, co jest celem, czym gra. Ten krok robi to samo z robotą. Bez niego zadanie „popraw onboarding" rozlewa się na całe repo i nigdy nie wiadomo, co znaczy „zrobione". <em>10x-new</em> tnie zamiar na <strong>jedną jednostkę pracy</strong> - na tyle małą, że jej zakres da się ogarnąć i cofnąć.',
      leadNeutralHtml:
        'Bez ustawienia pola gry zadanie „popraw onboarding" rozlewa się na całe repo i nigdy nie wiadomo, co znaczy „zrobione". <em>10x-new</em> tnie zamiar na <strong>jedną jednostkę pracy</strong> - na tyle małą, że jej zakres da się ogarnąć i cofnąć.',
      lead3PreHtml:
        'Wejście: luźny pomysł lub zgłoszenie. Wyjście: folder <em>context/changes/&lt;change-id&gt;</em> z plikiem <strong>change.md</strong> - tożsamością zmiany zapisaną na dysku. Artefakt zatrzymuje maszynę: to człowiek patrzy na zakres i decyduje, czy to jest ta ',
      lead3Sf: 'bitwa',
      lead3Neutral: 'zmiana',
      lead3PostHtml: ', zanim cokolwiek poleci dalej.',
      mechQ: 'jedna jednostka pracy',
      mechG: 'jasny, odwracalny zakres',
      mechArtHtml: '<b>change.md</b> w context/changes/&lt;change-id&gt;/',
      skillLink: '/10x-new - pełna strona skilla',
      targetHtml:
        'kluczowy, gdy zadanie jest mgliste albo zbyt duże - <b>zanim ruszy jakakolwiek praca</b>, musi istnieć jednostka o zakresie, który da się wycofać jednym ruchem.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Zakłada folder zmiany w <code>context/changes/&lt;change-id&gt;/</code>. „Zmiana" to jedna jednostka pracy od początku do końca: research, plan, implementacja i review żyją w jednym folderze spiętym identyfikatorem zmiany.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: change-id w kebab-case plus opcjonalny zamiar w wolnej formie - pierwszy człon staje się identyfikatorem, reszta zasila tytuł i notatki. Wyjście: <code>change.md</code> - mały plik tożsamości z frontmatterem (<code>change_id</code>, <code>title</code>, <code>status: new</code>, daty) i sekcją Notes na luźny kontekst.</p>',
        },
        {
          label: 'WALIDACJA',
          body: '<p>Trzy bramki, zanim cokolwiek powstanie: kebab-case sprawdzany regexem, unikalność identyfikatora w <code>changes/</code> i <code>archive/</code>, istniejący katalog <code>context/changes/</code>. Brak katalogu to odmowa, nie auto-tworzenie - to sygnał, że repo nie jest przygotowane pod tę strukturę.</p>',
        },
        {
          label: 'NASTĘPNY KROK',
          body: '<p>Po utworzeniu skill podpowiada domyślnie <code>/10x-plan</code>. Sytuacyjnie: <code>/10x-research</code>, gdy zamiar sugeruje eksplorację kodu przed planem, albo <code>/10x-frame</code>, gdy framing jest podejrzany - zgłoszenie typu „fix / bug / broken" z gotową diagnozą w treści. Sugerowana komenda ląduje w schowku.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Nie pisze <code>research.md</code>, <code>plan.md</code> ani <code>frame.md</code> - to praca kolejnych skilli. Nie prowadzi żadnego pliku stanu: jedynym źródłem prawdy o wykonaniu jest sekcja Progress w <code>plan.md</code>.</p>',
        },
      ],
    },
    k2: {
      num: 'KROK 02',
      uniSub: 'Własne przyrządy',
      h2: 'research - dowody do planu',
      epigraphSf: '„Wszechświat będzie dla was migotał."',
      epigraphCiteSf: '- sygnatura sofonów: pomiary, którym nie można już ufać',
      figAria:
        'Schemat pomiaru: trzy źródła - kod, testy, historia - zbiegają w jeden przyrząd, z którego wychodzi research.md',
      fig: ['KOD', 'TESTY', 'HISTORIA', 'POMIAR', 'RESEARCH.MD', 'ZAŁOŻENIA: 0'],
      figcaption: 'RYS. 02 // TRZY ŹRÓDŁA ZBIEGAJĄ W JEDEN POMIAR',
      leadSfHtml:
        'Sofony zakłócały ludzkości pomiary, żeby decyzje zapadały na zatrutych danych. W kodzie sabotażystą jest własna pamięć: „wiem, jak to działa" bywa wiedzą sprzed trzech refaktorów. <em>10x-research</em> istnieje po to, żeby plan powstał na <strong>dowodach z repozytorium</strong>, nie na założeniach.',
      leadNeutralHtml:
        'Sabotażystą decyzji w kodzie jest własna pamięć: „wiem, jak to działa" bywa wiedzą sprzed trzech refaktorów. <em>10x-research</em> istnieje po to, żeby plan powstał na <strong>dowodach z repozytorium</strong>, nie na założeniach.',
      lead3Html:
        'Wejście: change.md. Wyjście: <strong>research.md</strong> - ścieżki plików, konwencje, realne punkty zaczepienia. Mechanizm: <em>równolegli subagenci</em> przeczesują repo, każdy swój obszar, a wynik ląduje na dysku - kolejne kroki czytają fakty z pliku zamiast polegać na pamięci rozmowy.',
      mechQ: 'dowody do planu',
      mechG: 'fakty zamiast założeń',
      mechArtHtml: '<b>research.md</b> obok change.md',
      skillLink: '/10x-research - pełna strona skilla',
      targetHtml:
        'kluczowy w cudzym, starym lub dużym kodzie - wszędzie tam, gdzie <b>fałszywe „wiem"</b> kosztuje najwięcej.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Kompleksowy research kodu przed planowaniem: odpowiedzieć na pytanie badawcze dowodami z repozytorium i zapisać je na dysku - jako trwały artefakt, nie ulotną pamięć rozmowy.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: pytanie badawcze plus wskazane pliki - czytane w całości, zanim ruszy cokolwiek innego. Wyjście: <code>context/changes/&lt;change-id&gt;/research.md</code> z frontmatterem (data, commit, branch, temat) i sekcjami: podsumowanie, szczegółowe ustalenia, referencje do kodu z <code>plik:linia</code>, wnioski architektoniczne, kontekst historyczny i pytania otwarte.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Pytanie jest dekomponowane na obszary, zakres doprecyzowany z użytkownikiem (szerokość, głębokość, fokus), a potem 2-4 subagentów rusza równolegle - każdy przeczesuje swój wymiar: pliki i wzorce, wcześniejsze decyzje w <code>context/changes/</code> i <code>context/archive/</code>, działanie systemu. Synteza zaczyna się dopiero, gdy wrócą wszyscy.</p>',
        },
        {
          label: 'ANATOMIA',
          body: '<p>Dokument jest samowystarczalny: ścieżki, numery linii, wzorce międzykomponentowe, permalinki do GitHuba, gdy commit jest wypchnięty. Pytania uzupełniające trafiają do tego samego pliku z adnotacją we frontmatterze - jeden artefakt researchu na zmianę.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Subagenci dostają zadania tylko do odczytu i mają zwracać konkretne referencje <code>plik:linia</code>, nie ogólniki. Świeży research zawsze przed zaufaniem historii: wcześniejsze zmiany i archiwum to kontekst uzupełniający, nie zamiennik czytania kodu.</p>',
        },
      ],
    },
    k3: {
      num: 'KROK 03',
      uniSub: 'Trasa pielgrzymki',
      h2: 'plan - kluczowe decyzje deva',
      epigraphSf: '„Trasa jest znana, zanim ktokolwiek postawi pierwszy krok."',
      epigraphCiteSf: '- zasada pielgrzymki do Grobowców Czasu',
      figAria: 'Schemat trasy: droga z trzema etapami, każdy z odhaczonym warunkiem sukcesu, prowadzi do celu',
      fig: ['ETAP 1', 'ETAP 2', 'CEL', 'TRASA USTALONA PRZED WYJŚCIEM', 'KAŻDY ETAP: WARUNKI SUKCESU'],
      figcaption: 'RYS. 03 // TRASA Z ETAPAMI I WARUNKAMI SUKCESU',
      leadSfHtml:
        'Pielgrzymi w „Hyperionie" znają trasę i zasady, zanim wyruszą - improwizuje się w drodze, nie na mapie. Ten krok usuwa ból implementacji „na żywioł", w której <strong>kluczowe decyzje deva</strong> zapadają mimochodem, w środku pisania kodu. <em>10x-plan</em> wyciąga je przed kod, gdzie są tanie do zmiany.',
      leadNeutralHtml:
        'Ten krok usuwa ból implementacji „na żywioł", w której <strong>kluczowe decyzje deva</strong> zapadają mimochodem, w środku pisania kodu. <em>10x-plan</em> wyciąga je przed kod, gdzie są tanie do zmiany.',
      lead3Html:
        'Wejście: research.md. Wyjście: <strong>plan.md</strong> - etapy z warunkami sukcesu (automatyczne i ręczne) plus sekcja Progress. Mechanizm: plan powstaje w iteracjach z człowiekiem - czytasz go i kwestionujesz, dopóki jest tekstem; zatwierdzony staje się kontraktem, a Progress <em>maszyną stanów</em> dla następnego kroku.',
      mechQ: 'kluczowe decyzje deva',
      mechG: 'etapy + warunki sukcesu',
      mechArtHtml: '<b>plan.md</b> - etapy + sekcja Progress',
      skillLink: '/10x-plan - pełna strona skilla',
      targetHtml:
        'kluczowy, gdy zmiana dotyka wielu plików albo niesie decyzje trudne do cofnięcia (schemat danych, publiczne API) - <b>decyzje mają zapaść przed kodem</b>, nie w jego trakcie.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Podjąć kluczowe decyzje, dopóki są tanie - w tekście, nie w kodzie. Plan powstaje interaktywnie i sceptycznie - skill kwestionuje mgliste wymagania, pyta „dlaczego" i „co z przypadkiem X", zamiast spisywać życzenia.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: opis zadania plus artefakty z wcześniejszych kroków - <code>research.md</code> i/lub <code>frame.md</code>. Każdy dostarczony artefakt zmniejsza liczbę pytań: nie pyta się o to, co użytkownik już zapisał. Wyjście: <code>plan.md</code> (etapy z kryteriami sukcesu i sekcją Progress) plus <code>plan-brief.md</code> - dwustronicowy skrót z tabelą kluczowych decyzji.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Najpierw ocena złożoności potwierdzana z użytkownikiem (LOW: 4-6 pytań, MEDIUM: 7-10, HIGH: 11-15), potem pytania w rundach - każda opcja z rekomendacją oraz analizą zalet i kosztów. Szkielet etapów jest zatwierdzany, zanim powstaną szczegóły.</p>',
        },
        {
          label: 'ANATOMIA PLANU',
          body: '<p>Overview, stan bieżący, stan docelowy, „czego NIE robimy" (tama na pełzanie zakresu), etapy z kryteriami podzielonymi na <b>weryfikację automatyczną</b> (komendy) i <b>ręczną</b> (człowiek). Na dole sekcja Progress - jedyne miejsce checkboxów i maszyna stanów dla <code>/10x-implement</code>.</p>',
        },
        {
          label: 'ANTYWZORCE',
          body: '<p>Żadnych otwartych pytań w finalnym planie - wszystko rozstrzygnięte przed zapisem. Plan opisuje intencję i kontrakt zmiany, nie gotowy kod: snippet pojawia się tylko przy zmianie nieoczywistej. I zero ponownego pytania o rzeczy rozstrzygnięte we frame lub researchu.</p>',
        },
      ],
    },
    k4: {
      num: 'KROK 04',
      uniSub: 'Flip & burn',
      h2: 'implement - implementacja etap po etapie',
      epigraphSf: '„Drzwi i rogi, mały. Tam cię dopadają."',
      epigraphCiteSf: '- Miller do Holdena, o sprawdzaniu pomieszczeń krok po kroku',
      figAria:
        'Schemat trajektorii flip and burn: łuk lotu z trzema checkpointami-commitami, w połowie manewr flip',
      fig: [
        'START // CIĄG',
        'FLIP',
        'CEL // HAMOWANIE',
        'COMMIT',
        'COMMIT',
        'COMMIT',
        'KURS KORYGOWANY NA CHECKPOINTACH',
      ],
      figcaption: 'RYS. 04 // FLIP & BURN - CHECKPOINT NA KAŻDYM ETAPIE',
      leadSfHtml:
        'Rocinante nie leci do celu jednym odpaleniem silnika: pół drogi ciągu, obrót, pół drogi hamowania - i korekty kursu po drodze. Ten krok usuwa ból jednej wielkiej zmiany bez punktów kontrolnych, której nie da się ani przerwać, ani cofnąć. <em>10x-implement</em> realizuje plan <strong>etap po etapie</strong>.',
      leadNeutralHtml:
        'Ten krok usuwa ból jednej wielkiej zmiany bez punktów kontrolnych, której nie da się ani przerwać, ani cofnąć. <em>10x-implement</em> realizuje plan <strong>etap po etapie</strong>: każdy etap kończy się weryfikacją i commitem.',
      lead3Html:
        'Wejście: zatwierdzony plan.md. Wyjście: <strong>commity per etap</strong> i odhaczona sekcja Progress. Mechanizm: <em>Progress jako maszyna stanów</em> - etap kończy się dopiero, gdy jego warunki sukcesu są zielone i zmiana jest zacommitowana; przerwana sesja wraca od ostatniego zielonego etapu, nie od zera.',
      mechQ: 'implementacja etap po etapie',
      mechG: 'commitowane, weryfikowalne kroki',
      mechArtHtml: '<b>commity per etap</b> + odhaczone Progress',
      skillLink: '/10x-implement - pełna strona skilla',
      targetHtml:
        'kluczowy przy długiej lub przerywanej pracy - <b>każdy etap to punkt powrotu</b>: commit plus zielone warunki sukcesu zamiast jednego wielkiego diffa na koniec.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Zrealizować zatwierdzony plan etap po etapie z weryfikacją, zamiast jednym wielkim diffem. Filozofia: podążaj za intencją planu, adaptując się do zastanego kodu - a przy rozjeździe zatrzymaj się i przedstaw problem, zamiast improwizować po cichu.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: <code>context/changes/&lt;change-id&gt;/plan.md</code>, opcjonalnie numer etapu. Wyjście: commit per etap w konwencji Conventional Commits plus odhaczona sekcja Progress, w której każdy wiersz etapu dostaje dopisany skrócony SHA zamykającego commita.</p>',
        },
        {
          label: 'MASZYNA STANÓW',
          body: '<p>Sekcja Progress w <code>plan.md</code> to jedyne źródło prawdy - żadnych plików stanu obok. Pierwszy niezaznaczony wiersz wyznacza miejsce startu - po przerwie nie zgadujesz, co już zrobione. Skill modyfikuje wyłącznie Progress; bloki etapów są tylko do odczytu.</p>',
        },
        {
          label: 'RYTUAŁ KOŃCA ETAPU',
          body: '<p>Automatyczne kryteria przechodzą → brama ręcznej weryfikacji (człowiek potwierdza testy) → staging jawnie po ścieżkach z zestawu plików dotkniętych w etapie (nigdy <code>git add -A</code>) → zatwierdzenie komunikatu commita → SHA wpisany z powrotem do Progress.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Nie odhacza ręcznych testów bez potwierdzenia użytkownika. Rozjazd z planem eskaluje pytaniem z trzema wyjściami - adaptuj i kontynuuj, pomiń, wróć do planowania - zamiast decydować za człowieka.</p>',
        },
      ],
    },
    k5: {
      num: 'KROK 05',
      uniSub: 'Zrozumienie zamiast rytuału',
      h2: 'review - czy implementacja realizuje plan?',
      epigraphSf: '„Błogosławiony umysł zbyt mały, by wątpić."',
      epigraphCiteSf: '- katechizm Adeptus Mechanicus; review istnieje po to, by wątpić',
      figAria:
        'Schemat kogitatora: plan.md i kod wchodzą do maszyny porównującej, z której wychodzi raport plan vs kod',
      fig: ['PLAN.MD', 'KOD (DIFF)', 'KOGITATOR', 'RAPORT: PLAN VS KOD', 'RYTUAŁ: 0 // ZROZUMIENIE: 1'],
      figcaption: 'RYS. 05 // KOGITATOR PORÓWNUJE PLAN Z KODEM',
      leadSfHtml:
        'Tech-kapłani Mechanicus odprawiają rytuały nad maszynami, których nikt już nie rozumie. Odpowiednikiem w kodzie jest „działa, mergujemy" - akceptacja bez sprawdzenia, czy kod dotrzymał obietnic planu. <em>10x-impl-review</em> zadaje jedno pytanie wprost: <strong>czy implementacja realizuje plan?</strong>',
      leadNeutralHtml:
        '„Działa, mergujemy" to akceptacja bez sprawdzenia, czy kod dotrzymał obietnic planu. <em>10x-impl-review</em> zadaje jedno pytanie wprost: <strong>czy implementacja realizuje plan?</strong>',
      lead3Html:
        'Wejście: plan.md i gotowy diff. Wyjście: <strong>raport review</strong> - dryf względem planu, niebezpieczne decyzje, zgodność z konwencjami repo. Mechanizm: <em>analiza subagentów</em> - każdy porównuje inny wymiar planu z kodem, a człowiek dostaje listę konkretnych rozbieżności zamiast rytualnego „wygląda dobrze".',
      mechQ: 'czy implementacja realizuje plan?',
      mechG: 'analiza subagentów: plan vs kod',
      mechArtHtml: '<b>raport review</b> - plan vs kod',
      skillLink: '/10x-impl-review - pełna strona skilla',
      targetHtml:
        'kluczowy przed merge - im większy diff, tym łatwiej o <b>dryf między tym, co plan obiecał, a tym, co kod robi</b>.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Porównać rzeczywistą implementację z planem, zanim dryf, niebezpieczne decyzje i łamanie konwencji zdążą się skumulować. Dwa zakresy: szybki review pojedynczego etapu albo pełny przegląd całego planu przed merge.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: <code>plan.md</code> plus faktyczny stan repo - diff wyznaczany od daty planu. Wyjście: raport w <code>context/changes/&lt;change-id&gt;/reviews/</code> z werdyktem <b>APPROVED / NEEDS ATTENTION / REJECTED</b> i listą znalezisk gotowych do triage\'u.</p>',
        },
        {
          label: 'MECHANIZM',
          body: '<p>Dwóch równoległych subagentów: pierwszy wykrywa dryf - dla każdej planowanej zmiany werdykt MATCH / DRIFT / MISSING / EXTRA; drugi sprawdza bezpieczeństwo, wydajność, niezawodność i zgodność ze wzorcami repo. Do tego skill uruchamia komendy z automatycznych kryteriów sukcesu i porównuje wynik z deklaracjami w Progress.</p>',
        },
        {
          label: 'ANATOMIA ZNALEZISKA',
          body: '<p>ID, severity (CRITICAL / WARNING / OBSERVATION), impact (ile namysłu wymaga decyzja - wymiar ortogonalny do severity), lokalizacja <code>plik:linia</code>, dowód w formule „plan mówił X, kod robi Y" i propozycja naprawy z analizą kompromisów.</p>',
        },
        {
          label: 'TRIAGE',
          body: '<p>Interaktywna pętla po znaleziskach: napraw teraz, napraw inaczej, pomiń albo zapisz jako lekcję do <code>context/foundation/lessons.md</code>. Każda decyzja wraca do zapisanego raportu, więc triage można przerwać i wznowić później od pozycji PENDING.</p>',
        },
      ],
    },
    k6: {
      num: 'KROK 06',
      uniSub: 'Encyklopedia',
      h2: 'archive - domknięcie zmiany',
      epigraphSf: '„Zapisane przetrwa upadek; reszta zostaje legendą."',
      epigraphCiteSf: '- zasada Encyklopedii Galaktycznej, Fundacja',
      figAria:
        'Schemat archiwizacji: ukończony folder zmiany przechodzi kontrolę kompletności, lekcje trafiają do foundation, a folder ląduje w archiwum',
      fig: ['CHANGES/<ID>', 'KONTROLA: KOMPLETNOŚĆ', 'LESSONS.MD', 'ARCHIVE/', 'CHANGES: TYLKO W TOKU'],
      figcaption: 'RYS. 06 // ZMIANA DOMKNIĘTA - LEKCJE ZOSTAJĄ, FOLDER DO ARCHIWUM',
      leadSfHtml:
        'Fundacja przetrwała upadek Imperium nie siłą, lecz dlatego, że zawczasu spisała i zabezpieczyła wiedzę, zanim ta zdążyła zniknąć. Ten krok robi to samo ze skończoną zmianą: zamiast zostawić <code>changes/</code> zapchane starą pracą, <em>10x-archive</em> <strong>domyka jednostkę pracy</strong> - sprawdza, że jest naprawdę skończona, wyciąga z niej lekcje i odkłada folder do archiwum.',
      leadNeutralHtml:
        'Bez domknięcia katalog <code>changes/</code> zapycha się starą pracą i nie widać już, co jest w toku. <em>10x-archive</em> <strong>domyka jednostkę pracy</strong>: sprawdza, że jest naprawdę skończona, wyciąga z niej lekcje i odkłada folder do archiwum.',
      lead3Html:
        'Wejście: ukończona zmiana - plan.md z odhaczonym Progress i commitami. Wyjście: <strong>lekcje w context/foundation/lessons.md</strong> plus folder przeniesiony do <code>context/archive/</code>. Mechanizm: <em>kontrola kompletności</em> - każdy etap powinien mieć commit (SHA); etap czysto ręczny bez commita to <strong>ostrzeżenie informacyjne</strong>, nie błąd, a stan zostaje jawnie zamknięty.',
      mechQ: 'domknięcie zmiany',
      mechG: 'kompletność + wyciągnięte lekcje',
      mechArtHtml: '<b>lessons.md</b> + folder w context/archive/',
      skillLink: '/10x-archive - pełna strona skilla',
      targetHtml:
        'kluczowy po review i merge - <b>zamyka pętlę</b>: wiedza z tej zmiany zostaje w foundation, a folder trafia do archiwum, żeby <code>changes/</code> pokazywało tylko pracę w toku.',
      dd: [
        {
          label: 'PO CO',
          body: '<p>Domknąć skończoną jednostkę pracy: potwierdzić, że jest kompletna, przenieść wiedzę do trwałego kontekstu projektu i zwolnić <code>changes/</code>. „Skończone" ma znaczyć skończone - z zapisem, nie z pamięci.</p>',
        },
        {
          label: 'WEJŚCIE → WYJŚCIE',
          body: '<p>Wejście: folder zmiany <code>context/changes/&lt;change-id&gt;/</code> po review. Wyjście: dopisane lekcje w <code>context/foundation/lessons.md</code> i folder przeniesiony do <code>context/archive/</code> - z zachowaniem pełnej historii (change, research, plan, reviews).</p>',
        },
        {
          label: 'KONTROLA KOMPLETNOŚCI',
          body: '<p>Przed archiwizacją skill sprawdza spójność stanu: każdy etap w Progress powinien mieć commit (skrócony SHA). Etap czysto ręczny nie tworzy commita i zostaje bez SHA - to <b>ostrzeżenie informacyjne</b>, nie błąd, ale jawnie odnotowane, żeby „domknięte" nie znaczyło „po cichu pominięte".</p>',
        },
        {
          label: 'LEKCJE',
          body: '<p>To, czego nauczyła Cię ta zmiana - powtarzalne pułapki, decyzje warte zapamiętania - ląduje w <code>context/foundation/lessons.md</code>, wspólnym dla całego projektu. Następne zmiany startują z tej wiedzy, zamiast wynajdywać ją od nowa.</p>',
        },
        {
          label: 'GRANICE',
          body: '<p>Nie zmienia kodu ani planu - operuje na już zamkniętej pracy. Archiwum to zapis historyczny: nic nie czyta z niego rutynowo, ale wszystko tam jest, gdyby trzeba było wrócić do kontekstu starej zmiany.</p>',
        },
      ],
    },
    app: {
      numSf: 'MANEWRY',
      numNeutral: 'W PRAKTYCE',
      uniSf: 'Łańcuch w locie · Różne kształty pracy, jeden tor',
      h2: 'W praktyce: jeden łańcuch, każde zadanie',
      aMono: 'ZASTOSOWANIE // ~90% ZADAŃ, NIE TYLKO NOWE FEATURE',
      aLeadHtml:
        'CSC to nie rytuał od nowych feature’ów - to domyślna pętla dla większości codziennej pracy. Skalujesz ją w dół przy drobnicy i w górę przy ryzyku; rzadko ją porzucasz. <b>Ten sam łańcuch, różne kształty pracy:</b>',
      aRows: [
        {
          dt: 'bugfix',
          ddHtml:
            '<b>new → research → plan → implement → review → archive</b> - research krótki, plan to minimalny fix plus test regresji chroniący go przed nawrotem.',
        },
        {
          dt: 'refaktor',
          ddHtml:
            '<b>research → plan → implement → review → archive</b> - research mapuje wszystkie call-site’y, review pilnuje, że zachowanie nie dryfnęło.',
        },
        {
          dt: 'śledztwo / spike',
          ddHtml:
            'sam <b>research</b> - artefaktem jest research.md, bez planu i kodu; łańcuch schodzi do jednego kroku, gdy pytanie brzmi „dlaczego tak się dzieje?".',
        },
        {
          dt: 'mała zmiana',
          ddHtml:
            '<b>new → plan → implement</b> - research pomijasz tylko, gdy naprawdę znasz kod i zmiana jest przewidywalna; sama liczba plików to za mało - przy niepewności research zostaje, nawet dla jednego pliku.',
        },
      ],
      bMono: 'DODATKI // GDY SYTUACJA TEGO WYMAGA',
      bLeadHtml:
        'Rdzeń zostaje - wyspecjalizowany skill dokładasz tylko wtedy, gdy pojawia się jego wyzwalacz. Nie odpalasz całego toolkitu do jednej linijki.',
      bRows: [
        {
          dt: '/10x-frame',
          ddHtml: 'zgłoszenie „fix / bug / broken" z gotową diagnozą - przeramuj, zanim uwierzysz w cudzą hipotezę.',
        },
        {
          dt: '/10x-tdd',
          ddHtml: 'ryzyko chronisz testem, który realnie pada na zepsutym kodzie - etapy test-first zamiast /10x-implement.',
        },
        {
          dt: '/10x-e2e',
          ddHtml: 'liczy się przelot end-to-end przez działającą aplikację, tam gdzie unit by skłamał.',
        },
        {
          dt: '/10x-goal-implement',
          ddHtml: 'przebiegi nienadzorowane i headless - plan wykonuje się bez człowieka między etapami.',
        },
        {
          dt: '/10x-test-plan',
          ddHtml: 'wdrażasz testy w istniejącym produkcie - etapowy rollout brownfield przez łańcuch CSC.',
        },
        {
          dt: '/10x-impl-review-ci',
          ddHtml: 'review implementacji na każdym PR w CI, z komentarzem na PR - nie tylko lokalnie.',
        },
      ],
    },
    fnd: {
      numSf: 'ORBITY',
      numNeutral: 'KONTEKST',
      uniSf: 'Rampa startowa i eskorta · Przed łańcuchem i ponad nim',
      h2: 'Fundament i skalowanie',
      aMono: 'FUNDAMENT // ZANIM ŁAŃCUCH RUSZY',
      aLeadHtml:
        'CSC operuje na jednostkach pracy - fundament ustala, skąd one pochodzą. Trzy skille budują kontekst produktu, zanim pierwsza zmiana wejdzie w <b>new</b>.',
      aRows: [
        { dt: 'shape', ddHtml: 'rozmowa odkrywcza: pomysł → <b>shape-notes.md</b>' },
        { dt: 'prd', ddHtml: 'notatki → <b>prd.md</b>: co budujemy i po co' },
        { dt: 'roadmap', ddHtml: '<b>roadmap.md</b>: pionowe wycinki end-to-end, kolejność budowy' },
      ],
      bMono: 'SKALOWANIE // GDY ROŚNIE RYZYKO I/LUB ZŁOŻONOŚĆ',
      bLeadHtml:
        'Łańcuch się nie zmienia - dokładasz mu obstawę. Trzy dodatki podnoszą rygor i autonomię, kiedy stawka rośnie.',
      bRows: [
        { dt: 'quality gates', ddHtml: 'automatyczne bramki jakości domykają każdy etap' },
        { dt: 'goal', ddHtml: 'autonomiczne przejście planu, bez człowieka między etapami' },
        { dt: 'loops', ddHtml: 'powtarzalne przebiegi łańcucha w rytmie, nie na żądanie' },
      ],
    },
  },
  en: {
    eyebrow: 'MODULE 2 // CORE SKILLS CHAIN',
    h1Pre: 'One unit of work, ',
    h1Sf: 'six jumps',
    h1Neutral: 'six steps',
    subPreHtml: 'The core of <strong>10x Workflow</strong>: six ',
    subSf: 'jumps',
    subNeutral: 'steps',
    subPostHtml:
      ' of a single unit of work - from setting the scope to closing it out. <strong>new → research → plan → implement → review → archive</strong>, and each step leaves an artifact on disk. The same chain covers <strong>~90% of everyday tasks</strong> - not just new features.',
    svgAria:
      'Core Skills Chain diagram: six steps - new, research, plan, implement, review, archive - connected by arrows; a unit of work flows through the whole chain',
    nodes: {
      new: {
        aria: 'Step 01: new - one unit of work; a clear, reversible scope',
        annTop: ['one unit of work'],
        knum: 'STEP 01',
        klbl: 'NEW',
        annBottom: ['clear, reversible scope'],
      },
      research: {
        aria: 'Step 02: research - evidence for the plan; facts instead of assumptions',
        annTop: ['evidence for the plan'],
        knum: 'STEP 02',
        klbl: 'RESEARCH',
        annBottom: ['facts, not assumptions'],
      },
      plan: {
        aria: "Step 03: plan - the dev's key decisions; phases + success criteria",
        annTop: ['key dev decisions'],
        knum: 'STEP 03',
        klbl: 'PLAN',
        annBottom: ['phases + success criteria'],
      },
      implement: {
        aria: 'Step 04: implement - phase-by-phase implementation; committed, verifiable steps',
        annTop: ['implementation', 'phase by phase'],
        knum: 'STEP 04',
        klbl: 'IMPLEMENT',
        annBottom: ['committed,', 'verifiable steps'],
      },
      review: {
        aria: 'Step 05: review - does the implementation deliver the plan?; subagent analysis: plan vs code',
        annTop: ['does the implementation', 'deliver the plan?'],
        knum: 'STEP 05',
        klbl: 'REVIEW',
        annBottom: ['subagent analysis:', 'plan vs code'],
      },
      archive: {
        aria: 'Step 06: archive - close out the change; lessons to foundation, folder to the archive',
        annTop: ['close out the change'],
        knum: 'STEP 06',
        klbl: 'ARCHIVE',
        annBottom: ['lessons + archive'],
      },
    },
    mapCapPre: 'CSC CHAIN // CLICK A STEP TO ',
    mapCapSf: 'FLY',
    mapCapNeutral: 'JUMP',
    mapCapPost: ' TO ITS SECTION',
    routeAria: 'Chain steps',
    route: ['01 · new', '02 · research', '03 · plan', '04 · implement', '05 · review', '06 · archive', 'In practice', 'Foundation and scaling'],
    sum: {
      eyebrowPre: 'Chain summary · six ',
      eyebrowSf: 'jumps',
      eyebrowNeutral: 'steps',
      eyebrowPost: ' in 30 seconds',
      cards: [
        { num: 'STEP 01', h3: 'new', p: 'One unit of work with a clear, reversible scope.' },
        { num: 'STEP 02', h3: 'research', p: 'Evidence for the plan: facts from the repository instead of assumptions.' },
        { num: 'STEP 03', h3: 'plan', p: "The dev's key decisions before the code: phases + success criteria." },
        { num: 'STEP 04', h3: 'implement', p: 'Phase by phase: committed, verifiable steps.' },
        { num: 'STEP 05', h3: 'review', p: 'Does the implementation deliver the plan? Subagents: plan vs code.' },
        { num: 'STEP 06', h3: 'archive', p: 'Close out the change: lessons to foundation, folder to the archive.' },
      ],
      finis:
        '"Start with the 10xDevs Workflow™ Core Skills Chain (CSC). Add the extras as risk and/or complexity grows."',
      finisCite: '- a 10x Workflow cornerstone',
    },
    mechDt: { q: 'Question', g: 'Guarantee', a: 'Artifact', s: 'Skill' },
    targetK: 'GOAL:',
    k1: {
      num: 'STEP 01',
      uniSub: 'Picking the battle',
      h2: 'new - one unit of work',
      epigraphSf: '"The enemy\'s gate is down."',
      epigraphCiteSf: '- Ender Wiggin, orientation before every battle in the Battle Room',
      figAria: 'Gate diagram: from a cloud of ideas, a single unit of work passes through the gate',
      fig: ['REQUESTS / IDEAS', 'SCOPE: FUZZY', 'GATE: ONE UNIT', 'THE REST WAITS IN QUEUE'],
      figcaption: 'FIG. 01 // THE GATE - ONE UNIT OF WORK ENTERS THE GAME',
      leadSfHtml:
        'Before every battle, Ender first set up the field for himself: where the gate is, what the objective is, what he is playing with. This step does the same with work. Without it, a task like "improve onboarding" spills across the whole repo and nobody ever knows what "done" means. <em>10x-new</em> cuts the intent down to <strong>one unit of work</strong> - small enough that its scope can be grasped and rolled back.',
      leadNeutralHtml:
        'Without setting up the playing field, a task like "improve onboarding" spills across the whole repo and nobody ever knows what "done" means. <em>10x-new</em> cuts the intent down to <strong>one unit of work</strong> - small enough that its scope can be grasped and rolled back.',
      lead3PreHtml:
        'Input: a loose idea or a ticket. Output: a <em>context/changes/&lt;change-id&gt;</em> folder with a <strong>change.md</strong> file - the identity of the change written to disk. The artifact stops the machine: a human looks at the scope and decides whether this is the right ',
      lead3Sf: 'battle',
      lead3Neutral: 'change',
      lead3PostHtml: ' before anything moves further.',
      mechQ: 'one unit of work',
      mechG: 'a clear, reversible scope',
      mechArtHtml: '<b>change.md</b> in context/changes/&lt;change-id&gt;/',
      skillLink: '/10x-new - full skill page',
      targetHtml:
        'key when the task is fuzzy or too big - <b>before any work starts</b>, there must be a unit whose scope can be rolled back in one move.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Creates the change folder in <code>context/changes/&lt;change-id&gt;/</code>. A "change" is one unit of work from start to finish: research, plan, implementation and review live in a single folder tied together by the change id.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: a kebab-case change-id plus an optional free-form intent - the first token becomes the identifier, the rest feeds the title and notes. Output: <code>change.md</code> - a small identity file with frontmatter (<code>change_id</code>, <code>title</code>, <code>status: new</code>, dates) and a Notes section for loose context.</p>',
        },
        {
          label: 'VALIDATION',
          body: '<p>Three gates before anything is created: kebab-case checked with a regex, identifier uniqueness across <code>changes/</code> and <code>archive/</code>, and an existing <code>context/changes/</code> directory. A missing directory means refusal, not auto-creation - it signals the repo is not prepared for this structure.</p>',
        },
        {
          label: 'NEXT STEP',
          body: '<p>After creation, the skill suggests <code>/10x-plan</code> by default. Situationally: <code>/10x-research</code> when the intent suggests exploring the code before planning, or <code>/10x-frame</code> when the framing is suspicious - a "fix / bug / broken" report with a ready-made diagnosis inside. The suggested command lands in the clipboard.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>It does not write <code>research.md</code>, <code>plan.md</code> or <code>frame.md</code> - that is the work of the next skills. It keeps no state file of any kind: the only source of truth about execution is the Progress section in <code>plan.md</code>.</p>',
        },
      ],
    },
    k2: {
      num: 'STEP 02',
      uniSub: 'Your own instruments',
      h2: 'research - evidence for the plan',
      epigraphSf: '"The universe will flicker for you."',
      epigraphCiteSf: "- the sophons' signature: measurements that can no longer be trusted",
      figAria:
        'Measurement diagram: three sources - code, tests, history - converge into a single instrument, out of which research.md emerges',
      fig: ['CODE', 'TESTS', 'HISTORY', 'MEASUREMENT', 'RESEARCH.MD', 'ASSUMPTIONS: 0'],
      figcaption: 'FIG. 02 // THREE SOURCES CONVERGE INTO ONE MEASUREMENT',
      leadSfHtml:
        'The sophons jammed humanity\'s measurements so that decisions would be made on poisoned data. In code, the saboteur is your own memory: "I know how this works" is often knowledge from three refactors ago. <em>10x-research</em> exists so that the plan is built on <strong>evidence from the repository</strong>, not on assumptions.',
      leadNeutralHtml:
        'The saboteur of decisions in code is your own memory: "I know how this works" is often knowledge from three refactors ago. <em>10x-research</em> exists so that the plan is built on <strong>evidence from the repository</strong>, not on assumptions.',
      lead3Html:
        'Input: change.md. Output: <strong>research.md</strong> - file paths, conventions, real anchor points. The mechanism: <em>parallel subagents</em> comb the repo, each covering its own area, and the result lands on disk - later steps read facts from a file instead of relying on conversation memory.',
      mechQ: 'evidence for the plan',
      mechG: 'facts instead of assumptions',
      mechArtHtml: '<b>research.md</b> next to change.md',
      skillLink: '/10x-research - full skill page',
      targetHtml:
        'key in unfamiliar, old or large code - wherever a <b>false "I know"</b> costs the most.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Comprehensive code research before planning: answer the research question with evidence from the repository and write it to disk - as a durable artifact, not the fleeting memory of a conversation.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: a research question plus any pointed-to files - read in full before anything else moves. Output: <code>context/changes/&lt;change-id&gt;/research.md</code> with frontmatter (date, commit, branch, topic) and sections: summary, detailed findings, code references as <code>file:line</code>, architectural conclusions, historical context and open questions.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>The question is decomposed into areas, the scope refined with the user (breadth, depth, focus), and then 2-4 subagents run in parallel - each combing its own dimension: files and patterns, earlier decisions in <code>context/changes/</code> and <code>context/archive/</code>, how the system behaves. Synthesis starts only once they have all returned.</p>',
        },
        {
          label: 'ANATOMY',
          body: '<p>The document is self-sufficient: paths, line numbers, cross-component patterns, GitHub permalinks when the commit is pushed. Follow-up questions go into the same file with a frontmatter annotation - one research artifact per change.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>Subagents get read-only tasks and must return concrete <code>file:line</code> references, not generalities. Fresh research always comes before trusting history: earlier changes and the archive are supplementary context, not a substitute for reading the code.</p>',
        },
      ],
    },
    k3: {
      num: 'STEP 03',
      uniSub: 'The pilgrimage route',
      h2: "plan - the dev's key decisions",
      epigraphSf: '"The route is known before anyone takes the first step."',
      epigraphCiteSf: '- the rule of the pilgrimage to the Time Tombs',
      figAria:
        'Route diagram: a road with three phases, each with a checked-off success criterion, leads to the goal',
      fig: ['PHASE 1', 'PHASE 2', 'GOAL', 'ROUTE SET BEFORE DEPARTURE', 'EVERY PHASE: SUCCESS CRITERIA'],
      figcaption: 'FIG. 03 // A ROUTE WITH PHASES AND SUCCESS CRITERIA',
      leadSfHtml:
        'The pilgrims in "Hyperion" know the route and the rules before they set out - you improvise on the road, not on the map. This step removes the pain of "wing it" implementation, in which <strong>the dev\'s key decisions</strong> are made in passing, in the middle of writing code. <em>10x-plan</em> pulls them ahead of the code, where they are cheap to change.',
      leadNeutralHtml:
        'This step removes the pain of "wing it" implementation, in which <strong>the dev\'s key decisions</strong> are made in passing, in the middle of writing code. <em>10x-plan</em> pulls them ahead of the code, where they are cheap to change.',
      lead3Html:
        'Input: research.md. Output: <strong>plan.md</strong> - phases with success criteria (automated and manual) plus a Progress section. The mechanism: the plan is built in iterations with a human - you read it and challenge it while it is still text; once approved it becomes a contract, and Progress becomes the <em>state machine</em> for the next step.',
      mechQ: "the dev's key decisions",
      mechG: 'phases + success criteria',
      mechArtHtml: '<b>plan.md</b> - phases + a Progress section',
      skillLink: '/10x-plan - full skill page',
      targetHtml:
        'key when a change touches many files or carries decisions that are hard to undo (data schema, public API) - <b>decisions should be made before the code</b>, not in the middle of it.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Make the key decisions while they are cheap - in text, not in code. The plan is built interactively and skeptically - the skill challenges vague requirements, asks "why" and "what about case X" instead of writing down wishes.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: a task description plus artifacts from earlier steps - <code>research.md</code> and/or <code>frame.md</code>. Every artifact provided reduces the number of questions: nothing the user has already written down gets asked again. Output: <code>plan.md</code> (phases with success criteria and a Progress section) plus <code>plan-brief.md</code> - a two-page summary with a table of key decisions.</p>',
        },
        {
          label: 'MECHANISM',
          body: '<p>First a complexity assessment confirmed with the user (LOW: 4-6 questions, MEDIUM: 7-10, HIGH: 11-15), then questions in rounds - every option with a recommendation and an analysis of benefits and costs. The phase skeleton is approved before the details are written.</p>',
        },
        {
          label: 'PLAN ANATOMY',
          body: '<p>Overview, current state, target state, "what we are NOT doing" (a dam against scope creep), phases with criteria split into <b>automated verification</b> (commands) and <b>manual</b> (a human). At the bottom, the Progress section - the only place for checkboxes and the state machine for <code>/10x-implement</code>.</p>',
        },
        {
          label: 'ANTI-PATTERNS',
          body: '<p>No open questions in the final plan - everything resolved before it is saved. The plan describes the intent and the contract of the change, not finished code: a snippet appears only for a non-obvious change. And zero re-asking about things already settled in the frame or the research.</p>',
        },
      ],
    },
    k4: {
      num: 'STEP 04',
      uniSub: 'Flip & burn',
      h2: 'implement - phase-by-phase implementation',
      epigraphSf: '"Doors and corners, kid. That\'s where they get you."',
      epigraphCiteSf: '- Miller to Holden, on clearing rooms step by step',
      figAria:
        'Flip-and-burn trajectory diagram: a flight arc with three commit checkpoints and a flip maneuver at the midpoint',
      fig: [
        'START // BURN',
        'FLIP',
        'TARGET // BRAKING',
        'COMMIT',
        'COMMIT',
        'COMMIT',
        'COURSE CORRECTED AT CHECKPOINTS',
      ],
      figcaption: 'FIG. 04 // FLIP & BURN - A CHECKPOINT AT EVERY PHASE',
      leadSfHtml:
        'The Rocinante does not fly to its destination on one engine burn: half the way under thrust, a flip, half the way braking - and course corrections along the way. This step removes the pain of one big change with no checkpoints, which can be neither paused nor rolled back. <em>10x-implement</em> executes the plan <strong>phase by phase</strong>.',
      leadNeutralHtml:
        'This step removes the pain of one big change with no checkpoints, which can be neither paused nor rolled back. <em>10x-implement</em> executes the plan <strong>phase by phase</strong>: every phase ends with verification and a commit.',
      lead3Html:
        'Input: an approved plan.md. Output: <strong>commits per phase</strong> and a checked-off Progress section. The mechanism: <em>Progress as a state machine</em> - a phase is done only when its success criteria are green and the change is committed; an interrupted session resumes from the last green phase, not from zero.',
      mechQ: 'phase-by-phase implementation',
      mechG: 'committed, verifiable steps',
      mechArtHtml: '<b>commits per phase</b> + a checked-off Progress',
      skillLink: '/10x-implement - full skill page',
      targetHtml:
        'key for long or interrupted work - <b>every phase is a return point</b>: a commit plus green success criteria instead of one giant diff at the end.',
      dd: [
        {
          label: 'WHY',
          body: "<p>Execute the approved plan phase by phase with verification, instead of one giant diff. The philosophy: follow the plan's intent while adapting to the code you find - and on divergence, stop and present the problem instead of quietly improvising.</p>",
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: <code>context/changes/&lt;change-id&gt;/plan.md</code>, optionally a phase number. Output: a commit per phase in the Conventional Commits convention plus a checked-off Progress section, where every phase row gets the short SHA of its closing commit appended.</p>',
        },
        {
          label: 'STATE MACHINE',
          body: '<p>The Progress section in <code>plan.md</code> is the only source of truth - no state files on the side. The first unchecked row marks the starting point - after a break you do not guess what is already done. The skill modifies Progress only; the phase blocks are read-only.</p>',
        },
        {
          label: 'END-OF-PHASE RITUAL',
          body: '<p>Automated criteria pass → the manual verification gate (a human confirms the tests) → staging explicitly by path from the set of files touched in the phase (never <code>git add -A</code>) → commit message approval → the SHA written back into Progress.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: "<p>It does not check off manual tests without the user's confirmation. Divergence from the plan escalates as a question with three exits - adapt and continue, skip, go back to planning - instead of deciding for the human.</p>",
        },
      ],
    },
    k5: {
      num: 'STEP 05',
      uniSub: 'Understanding over ritual',
      h2: 'review - does the implementation deliver the plan?',
      epigraphSf: '"Blessed is the mind too small for doubt."',
      epigraphCiteSf: '- an Adeptus Mechanicus catechism; review exists in order to doubt',
      figAria:
        'Cogitator diagram: plan.md and code enter a comparison machine, out of which a plan-vs-code report emerges',
      fig: ['PLAN.MD', 'CODE (DIFF)', 'COGITATOR', 'REPORT: PLAN VS CODE', 'RITUAL: 0 // UNDERSTANDING: 1'],
      figcaption: 'FIG. 05 // THE COGITATOR COMPARES PLAN WITH CODE',
      leadSfHtml:
        'The tech-priests of the Mechanicus perform rituals over machines no one understands anymore. The code equivalent is "it works, let\'s merge" - acceptance without checking whether the code kept the plan\'s promises. <em>10x-impl-review</em> asks one question point-blank: <strong>does the implementation deliver the plan?</strong>',
      leadNeutralHtml:
        '"It works, let\'s merge" is acceptance without checking whether the code kept the plan\'s promises. <em>10x-impl-review</em> asks one question point-blank: <strong>does the implementation deliver the plan?</strong>',
      lead3Html:
        'Input: plan.md and the finished diff. Output: a <strong>review report</strong> - drift from the plan, dangerous decisions, compliance with repo conventions. The mechanism: <em>subagent analysis</em> - each compares a different dimension of the plan against the code, and the human gets a list of concrete discrepancies instead of a ritual "looks good".',
      mechQ: 'does the implementation deliver the plan?',
      mechG: 'subagent analysis: plan vs code',
      mechArtHtml: '<b>review report</b> - plan vs code',
      skillLink: '/10x-impl-review - full skill page',
      targetHtml:
        'key before merge - the bigger the diff, the easier the <b>drift between what the plan promised and what the code does</b>.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Compare the actual implementation against the plan before drift, dangerous decisions and convention violations have time to pile up. Two scopes: a quick review of a single phase or a full review of the whole plan before merge.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: "<p>Input: <code>plan.md</code> plus the actual state of the repo - the diff computed from the plan's date. Output: a report in <code>context/changes/&lt;change-id&gt;/reviews/</code> with an <b>APPROVED / NEEDS ATTENTION / REJECTED</b> verdict and a list of findings ready for triage.</p>",
        },
        {
          label: 'MECHANISM',
          body: "<p>Two parallel subagents: the first detects drift - for every planned change a MATCH / DRIFT / MISSING / EXTRA verdict; the second checks security, performance, reliability and compliance with the repo's patterns. On top of that, the skill runs the commands from the automated success criteria and compares the results with the claims in Progress.</p>",
        },
        {
          label: 'ANATOMY OF A FINDING',
          body: '<p>ID, severity (CRITICAL / WARNING / OBSERVATION), impact (how much deliberation the decision requires - a dimension orthogonal to severity), a <code>file:line</code> location, evidence in the form "the plan said X, the code does Y" and a proposed fix with a trade-off analysis.</p>',
        },
        {
          label: 'TRIAGE',
          body: '<p>An interactive loop over the findings: fix now, fix differently, skip, or record as a lesson in <code>context/foundation/lessons.md</code>. Every decision is written back into the saved report, so triage can be paused and resumed later from the PENDING position.</p>',
        },
      ],
    },
    k6: {
      num: 'STEP 06',
      uniSub: 'The Encyclopedia',
      h2: 'archive - close out the change',
      epigraphSf: '"What is written survives the fall; the rest becomes legend."',
      epigraphCiteSf: '- a principle of the Encyclopedia Galactica, Foundation',
      figAria:
        'Archival diagram: a completed change folder passes a completeness check, the lessons go to foundation, and the folder lands in the archive',
      fig: ['CHANGES/<ID>', 'CHECK: COMPLETENESS', 'LESSONS.MD', 'ARCHIVE/', 'CHANGES: WIP ONLY'],
      figcaption: 'FIG. 06 // THE CHANGE CLOSED OUT - LESSONS STAY, FOLDER TO THE ARCHIVE',
      leadSfHtml:
        'The Foundation survived the fall of the Empire not by force, but because it wrote down and safeguarded knowledge in time, before it could vanish. This step does the same with a finished change: instead of leaving <code>changes/</code> clogged with old work, <em>10x-archive</em> <strong>closes out the unit of work</strong> - it checks that it is truly finished, pulls the lessons from it and files the folder in the archive.',
      leadNeutralHtml:
        'Without a close-out, the <code>changes/</code> directory clogs up with old work and you can no longer see what is in progress. <em>10x-archive</em> <strong>closes out the unit of work</strong>: it checks that it is truly finished, pulls the lessons from it and files the folder in the archive.',
      lead3Html:
        'Input: a finished change - plan.md with a checked-off Progress and commits. Output: <strong>lessons in context/foundation/lessons.md</strong> plus the folder moved to <code>context/archive/</code>. The mechanism: a <em>completeness check</em> - every phase should have a commit (SHA); a purely manual phase with no commit is an <strong>informational warning</strong>, not an error, and the state is explicitly closed.',
      mechQ: 'closing out the change',
      mechG: 'completeness + captured lessons',
      mechArtHtml: '<b>lessons.md</b> + the folder in context/archive/',
      skillLink: '/10x-archive - full skill page',
      targetHtml:
        'key after review and merge - it <b>closes the loop</b>: what this change taught you stays in foundation, and the folder moves to the archive so <code>changes/</code> shows only work in progress.',
      dd: [
        {
          label: 'WHY',
          body: '<p>Close out a finished unit of work: confirm it is complete, move the knowledge into the durable project context, and free up <code>changes/</code>. "Done" should mean done - on the record, not from memory.</p>',
        },
        {
          label: 'INPUT → OUTPUT',
          body: '<p>Input: the change folder <code>context/changes/&lt;change-id&gt;/</code> after review. Output: lessons appended to <code>context/foundation/lessons.md</code> and the folder moved to <code>context/archive/</code> - preserving the full history (change, research, plan, reviews).</p>',
        },
        {
          label: 'COMPLETENESS CHECK',
          body: '<p>Before archiving, the skill checks state consistency: every phase in Progress should have a commit (short SHA). A purely manual phase creates no commit and stays without a SHA - that is an <b>informational warning</b>, not an error, but it is recorded explicitly so "closed out" does not quietly mean "skipped".</p>',
        },
        {
          label: 'LESSONS',
          body: '<p>What this change taught you - recurring pitfalls, decisions worth remembering - lands in <code>context/foundation/lessons.md</code>, shared across the whole project. The next changes start from that knowledge instead of rediscovering it.</p>',
        },
        {
          label: 'BOUNDARIES',
          body: '<p>It does not change code or the plan - it operates on already-closed work. The archive is a historical record: nothing reads from it routinely, but it is all there if you ever need to return to the context of an old change.</p>',
        },
      ],
    },
    app: {
      numSf: 'MANEUVERS',
      numNeutral: 'IN PRACTICE',
      uniSf: 'The chain in flight · Different shapes of work, one track',
      h2: 'In practice: one chain, every task',
      aMono: 'USAGE // ~90% OF TASKS, NOT JUST NEW FEATURES',
      aLeadHtml:
        'CSC is not a ritual reserved for new features - it is the default loop for most everyday work. You scale it down for small stuff and up for risk; you rarely abandon it. <b>The same chain, different shapes of work:</b>',
      aRows: [
        {
          dt: 'bugfix',
          ddHtml:
            '<b>new → research → plan → implement → review → archive</b> - research is short, the plan is a minimal fix plus a regression test guarding against a relapse.',
        },
        {
          dt: 'refactor',
          ddHtml:
            '<b>research → plan → implement → review → archive</b> - research maps every call site, review makes sure behavior did not drift.',
        },
        {
          dt: 'investigation / spike',
          ddHtml:
            'just <b>research</b> - the artifact is research.md, no plan and no code; the chain collapses to a single step when the question is "why does this happen?".',
        },
        {
          dt: 'small change',
          ddHtml:
            '<b>new → plan → implement</b> - you skip research only when you truly know the code and the change is predictable; file count alone is not enough - when in doubt, research stays, even for a single file.',
        },
      ],
      bMono: 'ADD-ONS // WHEN THE SITUATION CALLS FOR IT',
      bLeadHtml:
        'The core stays - you add a specialized skill only when its trigger appears. You do not fire up the whole toolkit for a one-liner.',
      bRows: [
        {
          dt: '/10x-frame',
          ddHtml: 'a "fix / bug / broken" report with a ready-made diagnosis - reframe before you trust someone else\'s hypothesis.',
        },
        {
          dt: '/10x-tdd',
          ddHtml: 'you protect the risk with a test that actually fails on broken code - test-first phases instead of /10x-implement.',
        },
        {
          dt: '/10x-e2e',
          ddHtml: 'an end-to-end pass through the running app matters, where a unit test would lie.',
        },
        {
          dt: '/10x-goal-implement',
          ddHtml: 'unattended and headless runs - the plan executes with no human between phases.',
        },
        {
          dt: '/10x-test-plan',
          ddHtml: 'you are rolling tests into an existing product - a phased brownfield rollout through the CSC chain.',
        },
        {
          dt: '/10x-impl-review-ci',
          ddHtml: 'implementation review on every PR in CI, with a comment on the PR - not just locally.',
        },
      ],
    },
    fnd: {
      numSf: 'ORBITS',
      numNeutral: 'CONTEXT',
      uniSf: 'Launch pad and escort · Before the chain and above it',
      h2: 'Foundation and scaling',
      aMono: 'FOUNDATION // BEFORE THE CHAIN STARTS',
      aLeadHtml:
        'CSC operates on units of work - the foundation determines where they come from. Three skills build the product context before the first change enters <b>new</b>.',
      aRows: [
        { dt: 'shape', ddHtml: 'a discovery conversation: an idea → <b>shape-notes.md</b>' },
        { dt: 'prd', ddHtml: 'notes → <b>prd.md</b>: what we are building and why' },
        { dt: 'roadmap', ddHtml: '<b>roadmap.md</b>: vertical end-to-end slices, the build order' },
      ],
      bMono: 'SCALING // WHEN RISK AND/OR COMPLEXITY GROWS',
      bLeadHtml:
        'The chain itself does not change - you give it an escort. Three add-ons raise the rigor and the autonomy as the stakes grow.',
      bRows: [
        { dt: 'quality gates', ddHtml: 'automated quality gates close out every phase' },
        { dt: 'goal', ddHtml: 'an autonomous pass through the plan, no human between phases' },
        { dt: 'loops', ddHtml: 'repeatable chain runs on a cadence, not on demand' },
      ],
    },
  },
};
