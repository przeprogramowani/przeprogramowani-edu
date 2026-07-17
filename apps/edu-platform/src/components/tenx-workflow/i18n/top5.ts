/**
 * Slownik strony "10xTop5" (top5/Top5Body) - Golden Nuggets.
 * Struktura kluczy odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja
 * inline markup (strong/b/em/span glow) i renderuja sie przez set:html.
 * Nazwy uniwersow NIE mieszkaja tutaj - body sklada je przez
 * universeName(UNIVERSES.x, lang); slownik trzyma tylko epitety po " · "
 * i aria wezlow bez nawiasu z uniwersum. Zmiana tresci = zmiana OBU jezykow.
 */

import type { Lang } from './index';

interface Top5Node {
  num: string;
  label: string;
  /** Aria wezla hero BEZ koncowego "(Uniwersum)" - body dokleja universeName. */
  aria: string;
}

interface Top5Card {
  num: string;
  h3: string;
  pHtml: string;
}

interface Top5Tx {
  monoSf: string;
  monoNeutral: string;
  monoPost: string;
  quote: string;
  who: string;
}

interface Top5Sector {
  num: string;
  /** Epitet po nazwie uniwersum (body renderuje "Uniwersum · epitet"). */
  uni: string;
  h2: string;
  epigraphSf: string;
  epigraphCiteSf: string;
  figAria: string;
  /** Etykiety <text> schematu w kolejnosci wystapienia w markupie. */
  fig: string[];
  figcaption: string;
  leadSfHtml: string;
  leadNeutralHtml: string;
  leadHtml: string;
  tx: Top5Tx[];
  mechProofDt: string;
  mechProofHtml: string;
  mechVoiceDt: string;
  mechVoiceHtml: string;
  mechForDt: string;
  mechForHtml: string;
  mechRelDt: string;
  /** Etykiety linkow "Powiazane" - hrefy skladane w body. */
  relLabels: string[];
  targetHtml: string;
}

interface Top5Dict {
  eyebrow: string;
  h1Html: string;
  subPreHtml: string;
  subLink: string;
  subPostHtml: string;
  heroAria: string;
  centerNum: string;
  centerLbl: string;
  nodes: Top5Node[];
  mapCapPre: string;
  mapCapSf: string;
  mapCapNeutral: string;
  mapCapPost: string;
  routeAria: string;
  route: [string, string, string, string, string, string];
  skrotEyebrow: string;
  cards: Top5Card[];
  s1: Top5Sector;
  s2: Top5Sector;
  s3: Top5Sector;
  s4: Top5Sector;
  s5: Top5Sector;
  targetK: string;
  next: {
    numSf: string;
    numNeutral: string;
    uni: string;
    h2: string;
    leadHtml: string;
    finisQuote: string;
    finisCite: string;
    targetK: string;
    targetHtml: string;
    dirMono: string;
    dirs: { dt: string; link: string; rest: string }[];
  };
}

export const TOP5: Record<Lang, Top5Dict> = {
  pl: {
    eyebrow: '10XTOP5 // GOLDEN NUGGETS',
    h1Html: 'Pięć wartości, które <span class="glow">zostają po kursie</span>',
    subPreHtml:
      '10xDevs to największy program AI-Native Software Engineering w Polsce i na świecie: <strong>6&nbsp;700+ absolwentów</strong> w półtora roku, <strong>44% z nich to seniorzy z 8+ latami stażu</strong>, <strong>3&nbsp;000+ projektów</strong> w ramach certyfikacji. Sercem kursu jest <strong>10x Workflow</strong> - ustrukturyzowany system pracy z agentem AI, od pomysłu do wdrożenia (',
    subLink: 'mapa systemu',
    subPostHtml:
      '). Poniżej pięć wartości, które uczestnicy trzech edycji wskazują najczęściej - każda z dowodem, głosem uczestnika i linkiem do dokumentacji.',
    heroAria:
      'Mapa Top 5: pięć samorodków z glifami uniwersów krąży po orbicie wokół centralnego węzła 10xDevs Top 5; każdy samorodek prowadzi do sekcji swojego sektora',
    centerNum: '10xDEVS',
    centerLbl: 'TOP 5',
    nodes: [
      {
        num: 'SEKTOR 01', label: 'SYSTEM',
        aria: 'Sektor 01: 10x Workflow - system, który zabierasz do pracy',
      },
      {
        num: 'SEKTOR 02', label: 'SPOKÓJ',
        aria: 'Sektor 02: szybciej, lepiej, spokojniej - bez długu kognitywnego',
      },
      {
        num: 'SEKTOR 03', label: 'LEGACY',
        aria: 'Sektor 03: działa na prawdziwym kodzie i legacy',
      },
      {
        num: 'SEKTOR 04', label: 'KOSZTY',
        aria: 'Sektor 04: optymalizacja kosztów AI - benchmark zamiast marketingu',
      },
      {
        num: 'SEKTOR 05', label: 'PROJEKTY',
        aria: 'Sektor 05: realna transformacja - trzy projekty i certyfikat',
      },
    ],
    mapCapPre: 'TOP 5 // KLIKNIJ SAMORODEK, BY ',
    mapCapSf: 'DOLECIEĆ',
    mapCapNeutral: 'PRZEJŚĆ',
    mapCapPost: ' DO SEKTORA',
    routeAria: 'Pięć wartości',
    route: [
      '01 · system',
      '02 · spokój',
      '03 · legacy',
      '04 · koszty',
      '05 · projekty',
      'Dalej: zobacz system',
    ],
    skrotEyebrow: 'Skrót · pięć wartości w 30 sekund',
    cards: [
      {
        num: 'SEKTOR 01',
        h3: '10x Workflow',
        pHtml: 'Spójny system pracy z agentem, nie zbiór promptów - zabierasz go do firmy.',
      },
      {
        num: 'SEKTOR 02',
        h3: 'Nie tylko szybciej',
        pHtml: 'Lepiej i spokojniej - z zachowanym rozumieniem systemu, bez długu kognitywnego.',
      },
      {
        num: 'SEKTOR 03',
        h3: 'Prawdziwy kod',
        pHtml: 'Legacy, cudze repozytoria, DDD - obszar, którego inne kursy AI nie ruszają.',
      },
      {
        num: 'SEKTOR 04',
        h3: 'Koszty AI',
        pHtml: 'Benchmark i własne ewaluacje zamiast marketingu: zwrot z każdego tokenu.',
      },
      {
        num: 'SEKTOR 05',
        h3: 'Transformacja',
        pHtml: 'Trzy obronialne projekty i certyfikat - 3&nbsp;000+ realnych aplikacji.',
      },
    ],
    s1: {
      num: 'SEKTOR 01',
      uni: 'Plan działa bez autora',
      h2: '10x Workflow - system, który zabierasz do pracy',
      epigraphSf:
        '„Dobry plan nie potrzebuje obecności swojego twórcy. Potrzebuje tylko ludzi, którzy wykonają następny krok - i kroku, który da się wykonać."',
      epigraphCiteSf: '- zapis z Krypty, w duchu planu Seldona',
      figAria:
        'Schemat planu Seldona: łańcuch kroków wykonuje się kolejno i zostawia artefakty na dysku, a autor pozostaje poza układem',
      fig: [
        'PLAN SELDONA // KRYPTA',
        'WYKONUJE SIĘ BEZ AUTORA',
        'WEJŚCIE: POMYSŁ',
        'WYJŚCIE: WDROŻENIE',
        'AUTOR: POZA UKŁADEM',
        'KAŻDY KROK ZOSTAWIA ARTEFAKT NA DYSKU',
        'DZIAŁA DALEJ: W TWOJEJ FIRMIE',
      ],
      figcaption: 'RYS. 01 // PLAN, KTÓRY DZIAŁA BEZ AUTORA',
      leadSfHtml:
        'Kompletny <span class="glow">łańcuch pracy z agentem</span>: od pomysłu, przez plan i implementację z testami, po review i wdrożenie - całość spięta narzędziem <strong>10x-cli</strong>, które instaluje kursowe <strong>skille</strong> (gotowe, powtarzalne procedury dla agenta AI) w Twoim środowisku. Uczestnicy doceniają go jako <strong>spójny system, nie zbiór promptów</strong> - i jak plan Seldona z „Fundacji", działa dalej bez swojego autora: w Twojej firmie, bez kursu za plecami.',
      leadNeutralHtml:
        'Kompletny łańcuch pracy z agentem: od pomysłu, przez plan i implementację z testami, po review i wdrożenie - całość spięta narzędziem <strong>10x-cli</strong>, które instaluje kursowe <strong>skille</strong> (gotowe, powtarzalne procedury dla agenta AI) w Twoim środowisku. Uczestnicy doceniają go jako <strong>spójny system, nie zbiór promptów</strong> - działa dalej w Twojej firmie, bez kursu za plecami.',
      leadHtml:
        'Najlepszy dowód to, co absolwenci robią po kursie: <strong>przenoszą workflow do swoich firm i budują na nim własne narzędzia</strong> - forki skilli dopasowane do własnego sposobu pracy, zespołowe repozytoria dystrybucji, pipeline\'y code review na kursowej metodzie.',
      tx: [
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote:
            '„10xDevs workflow jest genialny. Dopiero co skończyłem kurs, a już wdrażam zmiany w pracy i robię kolejny side-project."',
          who: '- uczestnik 3. edycji',
        },
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote:
            '„Zbudowałem workflow, który analizuje lekcje i skille z 10xDevs i generuje ich forki dopasowane do mojego sposobu pracy."',
          who: '- uczestnik 3. edycji',
        },
      ],
      mechProofDt: 'Dowód',
      mechProofHtml:
        'absolwenci wdrażają workflow w zespołach: <b>forki skilli, repozytoria dystrybucji, własne narzędzia</b> zbudowane na kursowej metodzie',
      mechVoiceDt: 'Głos uczestnika',
      mechVoiceHtml:
        '„Zacząłem repozytorium dystrybucji skilli dla zespołu. Jak dotąd działa dobrze." - uczestnik 3. edycji',
      mechForDt: 'Dla kogo',
      mechForHtml:
        'wszyscy, a zwłaszcza zatrudnieni - to najkrótsza droga <b>„z kursu do zespołu"</b>',
      mechRelDt: 'Powiązane',
      relLabels: [
        'Core Skills Chain - pięć kroków łańcucha',
        'Fundament - kontekst przed pierwszą zmianą',
      ],
      targetHtml:
        'wynieść z kursu <b>powtarzalny proces, nie listę trików</b> - system, który działa tak samo w projekcie zaliczeniowym i w poniedziałek rano w firmie.',
    },
    s2: {
      num: 'SEKTOR 02',
      uni: 'Po stronie rozumienia',
      h2: 'AI to nie tylko szybciej - to lepiej i spokojniej',
      epigraphSf:
        '„Krążyliśmy nad oceanem dziesięciolecia. Biblioteka solarystyki rosła szybciej niż nasze rozumienie - aż w końcu opisywaliśmy już tylko własne raporty."',
      epigraphCiteSf: '- notatka ze stacji badawczej Solaris',
      figAria:
        'Schemat stacji badawczej nad oceanem Solaris: ocean kodu rośnie, biblioteka raportów puchnie bez rozumienia, stacja utrzymuje rozumienie artefaktami: raportem architektonicznym i mapą repozytorium',
      fig: [
        'STACJA SOLARIS // NASŁUCH',
        'ZROZUMIENIE: DO OBRONY',
        'RAPORT ARCHITEKTONICZNY',
        'MAPA REPOZYTORIUM',
        'BIBLIOTEKA SOLARYSTYKI',
        'OPISUJE JUŻ TYLKO WŁASNE RAPORTY',
        'OCEAN: KOD ROŚNIE SZYBCIEJ NIŻ ROZUMIENIE',
      ],
      figcaption: 'RYS. 02 // OCEAN VS STACJA - ROZUMIENIE NA POKŁADZIE',
      leadSfHtml:
        'Rynek sprzedaje AI jako samo przyspieszenie. Ale kod generowany bez struktury szybko staje się jak ocean Solaris: żywy, produktywny i coraz mniej zrozumiały dla ludzi, którzy nad nim krążą. Ustrukturyzowany workflow działa na czterech poziomach naraz: <strong>szybciej</strong> (mniej ręcznej roboty), <strong>lepiej</strong> (testy i weryfikacja na każdym etapie), <strong>spokojniej</strong> (przewidywalny proces zamiast chaotycznego promptowania) i <strong>z zachowanym rozumieniem systemu</strong>.',
      leadNeutralHtml:
        'Rynek sprzedaje AI jako samo przyspieszenie. Ustrukturyzowany workflow działa na czterech poziomach naraz: <strong>szybciej</strong> (mniej ręcznej roboty), <strong>lepiej</strong> (testy i weryfikacja na każdym etapie), <strong>spokojniej</strong> (przewidywalny proces zamiast chaotycznego promptowania) i <strong>z zachowanym rozumieniem systemu</strong>.',
      leadHtml:
        'Ten ostatni poziom neutralizuje cichą cenę pracy z AI - <strong>dług kognitywny</strong>, moment, w którym przestajesz rozumieć własny system. Powstają raporty architektoniczne, mapy repozytorium i diagramy domeny, które musisz umieć obronić. Zostajesz <em>architektem i recenzentem z własnym osądem</em>, nie osobą przyklepującą wynik modelu.',
      tx: [
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote:
            '„Największy postęp po kursie widzę nie w tym, że AI pisało za mnie kod szybciej, tylko w tym, że zacząłem budować własny system pracy z AI."',
          who: '- uczestnik 3. edycji',
        },
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote:
            '„Największą wartością było wypracowanie powtarzalnego procesu: od researchu i planowania, przez świadome decyzje architektoniczne, implementację, review i automatyzację jakości."',
          who: '- uczestnik 3. edycji',
        },
      ],
      mechProofDt: 'Dowód',
      mechProofHtml:
        '<b>raporty architektoniczne, mapy repozytorium i diagramy domeny</b> jako stałe artefakty pracy; wbudowana weryfikacja wyłapuje błędy, których człowiek nie zauważa',
      mechVoiceDt: 'Głos uczestnika',
      mechVoiceHtml:
        '„Testy E2E w moim projekcie wyłapały problem." - uczestnik 3. edycji; testy złapały błąd, którego sam nie dostrzegł',
      mechForDt: 'Dla kogo',
      mechForHtml:
        'wszyscy zmęczeni schematem <b>„szybko, ale byle jak"</b> i chaosem vibe codingu; seniorzy obawiający się utraty warsztatu',
      mechRelDt: 'Powiązane',
      relLabels: [
        'Jakość - testy, hooki i bramki',
        'Core Skills Chain: review - plan vs kod',
      ],
      targetHtml:
        'zamienić „AI pisze za mnie" na <b>„AI pracuje w moim procesie"</b> - z jakością rosnącą na każdym etapie i pełnym rozumieniem tego, co powstaje.',
    },
    s3: {
      num: 'SEKTOR 03',
      uni: 'Rytuał zamiast rozumienia',
      h2: 'Działa na Twoim prawdziwym kodzie',
      epigraphSf:
        '„Tech-kapłan okadza maszynę i recytuje litanię uruchomienia. Maszyna działa - ale nikt na pokładzie nie pamięta już dlaczego."',
      epigraphCiteSf: '- obrzędy Adeptus Mechanicus',
      figAria:
        'Schemat: świątynia-maszyna z rytuałem uruchomienia po lewej, mapa repozytorium z hot spotem po prawej; research zamienia wiedzę plemienną w dowody',
      fig: [
        'ŚWIĄTYNIA-MASZYNA',
        'LITANIA URUCHOMIENIA: DZIAŁA, NIE DOTYKAĆ',
        'RYTUAŁ ZAMIAST ROZUMIENIA',
        'RESEARCH',
        'HOT SPOT',
        'MAPA REPOZYTORIUM',
      ],
      figcaption: 'RYS. 03 // ŚWIĄTYNIA-MASZYNA VS MAPA REPOZYTORIUM',
      leadSfHtml:
        'W czterdziestym pierwszym millenium technologię się czci, bo nikt nie umie już jej naprawić. <span class="glow">Legacy bez mapy działa identycznie</span>: „tego pliku nie dotykamy", rytuały deploya, wiedza plemienna zamiast rozumienia. Workflow obejmuje pełną pracę z takim kodem: mapowanie nieznanego repozytorium, research konkretnej funkcjonalności, plan refaktoryzacji oraz analizę kodu zgodnie z <strong>Domain-Driven Design (DDD)</strong>. To obszar, którego niemal żaden kurs AI nie rusza.',
      leadNeutralHtml:
        'Większość developerów nie pisze aplikacji od zera - pracuje w cudzym, wieloletnim kodzie. Workflow obejmuje pełną pracę z legacy: mapowanie nieznanego repozytorium, research konkretnej funkcjonalności, plan refaktoryzacji oraz analizę kodu zgodnie z <strong>Domain-Driven Design (DDD)</strong>. To obszar, którego niemal żaden kurs AI nie rusza.',
      leadHtml:
        'Główne skille workflow - <strong>research → plan → implement → review</strong> - działają w każdym repozytorium, niezależnie od stacku i złożoności projektu. Rozpracujesz z nimi 90% wyzwań programistycznych, a z resztą poradzisz sobie dzięki <em>skillom specjalistycznym</em>, które nauczysz się tworzyć podczas kursu.',
      tx: [
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote:
            '„Największą wartość wyniosłem z modułu 4. Zmienił moje podejście do analizy istniejącego kodu i pokazał, jak podejmować decyzje architektoniczne na podstawie dowodów, a nie intuicji."',
          who: '- uczestnik 3. edycji, o module 4 (Legacy - praca na istniejącym kodzie)',
        },
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote:
            '„Lekcje o DDD oraz o pipelinie code review trafiły u mnie w konkretną potrzebę - materiały zostają u mnie jako punkt odniesienia."',
          who: '- uczestnik 3. edycji, pracujący z zespołami na dużych repozytoriach',
        },
      ],
      mechProofDt: 'Dowód',
      mechProofHtml:
        '<b>44% z 6&nbsp;700+ absolwentów to seniorzy z 8+ latami stażu</b> - ludzie pracujący na co dzień w istniejącym kodzie; do tego liczne pytania na czacie kursu o stosowanie workflow na legacy',
      mechVoiceDt: 'Głos uczestnika',
      mechVoiceHtml:
        '„Fajnie działa ten research przy wchodzeniu do repozytorium." - uczestnik 3. edycji',
      mechForDt: 'Dla kogo',
      mechForHtml:
        'zatrudnieni w istniejących projektach - <b>czyli większość developerów</b>',
      mechRelDt: 'Powiązane',
      relLabels: [
        'Legacy - mapa, hot spots, refaktor, DDD',
        'Core Skills Chain: research - fakty zamiast założeń',
      ],
      targetHtml:
        'przestać traktować AI jako narzędzie „tylko do greenfieldów" - <b>największy zwrot jest tam, gdzie kod ma lata i nikt nie pamięta dlaczego</b>.',
    },
    s4: {
      num: 'SEKTOR 04',
      uni: 'Pomiar zamiast wiary',
      h2: 'Optymalizacja kosztów AI - benchmark zamiast wiary',
      epigraphSf:
        '„Fizyka nie przyjmuje deklaracji. Jeśli wynik eksperymentu nie zgadza się z obietnicą, to nie wszechświat kłamie - to twój model."',
      epigraphCiteSf: '- dziennik badacza z ery Kryzysu, „Problem trzech ciał"',
      figAria:
        'Schemat sofonu - rozwinięcie protonu i zakłócony pomiar: szum marketingu kontra sygnał benchmarku',
      fig: [
        'UKŁAD CHAOTYCZNY',
        'SOFON - PROTON 11-D',
        'ŹRÓDŁO',
        'ROZWINIĘCIE 2-D',
        'MARKETING (SZUM)',
        '10XBENCH (SYGNAŁ)',
      ],
      figcaption: 'RYS. 04 // SOFON - POMIAR ODZYSKANY',
      leadSfHtml:
        'W „Problemie trzech ciał" przetrwanie zależy od pomiaru, nie od wiary w cudze deklaracje. Z budżetem na AI jest identycznie: kurs daje konkretny przegląd, <strong>za co realnie warto płacić</strong> - które subskrypcje mają sens i do czego, jak dobierać model na podstawie benchmarku <strong>10xBench</strong> (porównanie modeli na realnych zadaniach programistycznych, prowadzone w ramach kursu) i własnych ewaluacji <strong>10xEval</strong> pod konkretne zadania zespołu.',
      leadNeutralHtml:
        'Kurs daje konkretny przegląd, <strong>za co realnie warto płacić</strong>: które subskrypcje mają sens i do czego, jak dobierać model na podstawie benchmarku <strong>10xBench</strong> (porównanie modeli na realnych zadaniach programistycznych, prowadzone w ramach kursu) i własnych ewaluacji <strong>10xEval</strong> pod konkretne zadania zespołu.',
      leadHtml:
        'Zamiast bazować na marketingu, pokazujemy, jak testować - i kiedy opłaca się zejść na <strong>otwarte modele lokalne</strong>. Efekt: przewidywalny koszt i <em>zwrot z każdego tokenu</em>, zarówno w budżecie firmowym, jak i prywatnym.',
      tx: [
        {
          monoSf: 'SYGNAŁ Z CZATU',
          monoNeutral: 'SYGNAŁ Z KURSU',
          monoPost: ' // 3. EDYCJA',
          quote:
            '10xBench jest aktywnie śledzony przez uczestników jako źródło decyzji o wyborze modeli - temat wraca w wielu wątkach na czacie kursu.',
          who: '- obserwacja z trzech edycji',
        },
      ],
      mechProofDt: 'Dowód',
      mechProofHtml:
        '<b>10xBench</b> (benchmark modeli) + <b>10xEval</b> (ewaluacje pod własne zadania) zamiast deklaracji producentów modeli; kryterium wyboru: koszt i jakość na konkretnym zadaniu',
      mechVoiceDt: 'Sygnał',
      mechVoiceHtml:
        'uczestnicy śledzą 10xBench jako <b>źródło decyzji o wyborze modeli</b> - wiele wątków na czacie kursu',
      mechForDt: 'Dla kogo',
      mechForHtml:
        'firmy optymalizujące budżet na AI oraz <b>solo-developerzy płacący z własnej kieszeni</b>',
      mechRelDt: 'Powiązane',
      relLabels: [
        'Skalowanie - rygor i autonomia, gdy stawka rośnie',
        'Dokumentacja - quick search po modułach',
      ],
      targetHtml:
        'podejmować decyzje o modelach i subskrypcjach <b>na podstawie pomiaru, nie marketingu</b> - i wiedzieć, kiedy lokalny model wystarczy.',
    },
    s5: {
      num: 'SEKTOR 05',
      uni: 'Opowieści pielgrzymów',
      h2: 'Realna transformacja - trzy projekty, jeden certyfikat',
      epigraphSf:
        '„Każdy pielgrzym niesie własną opowieść i to ona jest jego przepustką. Do Grobowców Czasu dociera tylko ten, kto przeszedł całą drogę."',
      epigraphCiteSf: '- zwyczaj pielgrzymki na Hyperiona',
      figAria:
        'Mapa pielgrzymki - trzy etapy do Grobowców Czasu: Builder, Architect i Champion na jednej trasie',
      fig: [
        'TRASA PIELGRZYMKI',
        'BUILDER',
        'ARCHITECT',
        'CHAMPION',
        'GROBOWCE CZASU',
        'CZAS PŁYNIE WSTECZ',
        'START',
      ],
      figcaption: 'RYS. 05 // PIELGRZYMKA - TRZY OPOWIEŚCI, JEDEN CEL',
      leadSfHtml:
        'Jak w „Hyperionie": liczy się droga, a wagę niesie opowieść tego, kto ją przeszedł. Certyfikat stoi na trzech realnych, obronialnych projektach, nie na teście wiedzy: działające MVP (<strong>Builder</strong>), raport architektoniczny (<strong>Architect</strong>) i rozbudowa pipeline\'u CI/CD pod potrzeby zespołu (<strong>Champion</strong>). Trzy etapy pielgrzymki - każdy z twardym dowodem w repozytorium, nie odpowiedzią a/b/c.',
      leadNeutralHtml:
        'Certyfikat stoi na trzech realnych, obronialnych projektach, nie na teście wiedzy: działające MVP (<strong>Builder</strong>), raport architektoniczny (<strong>Architect</strong>) i rozbudowa pipeline\'u CI/CD pod potrzeby zespołu (<strong>Champion</strong>). Każdy z twardym dowodem w repozytorium, nie odpowiedzią a/b/c.',
      leadHtml:
        'Do tego <strong>DemoDay</strong>, na którym najlepsi prezentują swoje prace i zdobywają nagrody w głosowaniu społeczności. Przez trzy edycje w ramach certyfikacji powstało <strong>ponad 3&nbsp;000 projektów</strong> - realnych aplikacji odpowiadających na prawdziwe problemy: osobiste, rodzinne, zespołowe i firmowe. Uczestnicy opisują efekt jako realną transformację, a włożony wysiłek traktują jako część tej wartości, nie jako zarzut.',
      tx: [
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote:
            '„Oddałem projekt, architect i builder. Cieszę się jak dziecko - to było pięć tygodni naprawdę intensywnej pracy przy dzieciach, etacie i urlopie w międzyczasie. Satysfakcja jest niesamowita."',
          who: '- uczestnik 3. edycji',
        },
        {
          monoSf: 'PRZECHWYCONA TRANSMISJA',
          monoNeutral: 'GŁOS UCZESTNIKA',
          monoPost: ' // 3. EDYCJA',
          quote: '„Dziękuję za kurs - bez niego nadal błądziłabym we mgle."',
          who: '- uczestniczka 3. edycji, po zbudowaniu aplikacji od zera, krok po kroku, zgodnie z workflow',
        },
      ],
      mechProofDt: 'Dowód',
      mechProofHtml:
        '<b>3&nbsp;000+ projektów przez trzy edycje</b>; trzy obronialne artefakty (MVP, raport architektoniczny, pipeline CI/CD) zamiast testu wiedzy; DemoDay z nagrodami społeczności',
      mechVoiceDt: 'Głos uczestnika',
      mechVoiceHtml:
        '„Pierwszy raz zbudowałem kompletną aplikację webową od zera, z CI/CD, testami i deployem na prawdziwym hostingu." - uczestnik 3. edycji',
      mechForDt: 'Dla kogo',
      mechForHtml:
        'ambitni; <b>sceptycy wobec certyfikatów</b> (trzy obronialne projekty biją papier); wszyscy, którym potrzeba domkniętego, namacalnego osiągnięcia',
      mechRelDt: 'Powiązane',
      relLabels: [
        'Fundament - od pomysłu do MVP (Builder)',
        'Legacy - analiza architektury (Architect)',
        'Teamwork - pipeline zespołu (Champion)',
      ],
      targetHtml:
        'skończyć kurs z <b>trzema namacalnymi dowodami umiejętności</b> - działającą aplikacją, obronionym raportem i pipeline\'em, który zespół używa naprawdę.',
    },
    targetK: 'CEL:',
    next: {
      numSf: 'ORBITA',
      numNeutral: 'DALEJ',
      uni: 'Zamknięcie orbity · zobacz system w akcji',
      h2: 'Pięć wartości, jeden system',
      leadHtml:
        'Każdy z pięciu samorodków sprowadza się do tego samego mechanizmu: <b>ustrukturyzowany workflow z artefaktami na dysku</b> - zamiast promptowania na wyczucie. System, spokój, legacy, koszty i certyfikacja to nie osobne obietnice, tylko pięć twarzy jednej metody, którą przez trzy edycje przećwiczyło 6&nbsp;700+ absolwentów.',
      finisQuote:
        '„Największy postęp po kursie widzę nie w tym, że AI pisało za mnie kod szybciej, tylko w tym, że zacząłem budować własny system pracy z AI."',
      finisCite: '- uczestnik 3. edycji',
      targetK: 'DALEJ:',
      targetHtml:
        'ta strona to skrót - <b>system w całości mieszka na pozostałych stronach 10x Workflow</b>. Trzy najlepsze punkty startu poniżej.',
      dirMono: 'WYBIERZ KIERUNEK',
      dirs: [
        {
          dt: 'mapa',
          link: 'Zobacz mapę 10x Workflow',
          rest: ' - Core Skills Chain: pięć kroków od pomysłu do review, rdzeń metody krok po kroku',
        },
        {
          dt: 'docs',
          link: 'Sprawdź dokumentację',
          rest: ' - quick search po wszystkich modułach i skillach systemu',
        },
        {
          dt: 'motyw',
          link: 'Poznaj motyw sci-fi',
          rest: ' - skąd te odniesienia: dziesięć uniwersów, które nadają stronom kolory i metafory',
        },
        {
          dt: 'legacy',
          link: 'Moduł 4: Legacy',
          rest: ' - praca w zastanych systemach: mapa, hot spots, refaktoryzacja, DDD',
        },
        {
          dt: 'jakość',
          link: 'Moduł 3: Jakość',
          rest: ' - testy, hooki i bramki, zanim kod trafi na produkcję',
        },
      ],
    },
  },
  en: {
    eyebrow: '10XTOP5 // GOLDEN NUGGETS',
    h1Html: 'Five values that <span class="glow">stay with you after the course</span>',
    subPreHtml:
      '10xDevs is the largest AI-Native Software Engineering program in Poland and in the world: <strong>6,700+ graduates</strong> in a year and a half, <strong>44% of them seniors with 8+ years of experience</strong>, <strong>3,000+ projects</strong> built for certification. At the heart of the course is <strong>10x Workflow</strong> - a structured system of working with an AI agent, from idea to deployment (',
    subLink: 'system map',
    subPostHtml:
      '). Below are the five values that participants across three editions point to most often - each with evidence, a participant voice and a link to the documentation.',
    heroAria:
      "Top 5 map: five nuggets with universe glyphs orbit around a central 10xDevs Top 5 node; each nugget leads to its sector's section",
    centerNum: '10xDEVS',
    centerLbl: 'TOP 5',
    nodes: [
      {
        num: 'SECTOR 01', label: 'SYSTEM',
        aria: 'Sector 01: 10x Workflow - the system you take to work',
      },
      {
        num: 'SECTOR 02', label: 'CALM',
        aria: 'Sector 02: faster, better, calmer - without cognitive debt',
      },
      {
        num: 'SECTOR 03', label: 'LEGACY',
        aria: 'Sector 03: works on real code and legacy',
      },
      {
        num: 'SECTOR 04', label: 'COSTS',
        aria: 'Sector 04: AI cost optimization - a benchmark instead of marketing',
      },
      {
        num: 'SECTOR 05', label: 'PROJECTS',
        aria: 'Sector 05: real transformation - three projects and a certificate',
      },
    ],
    mapCapPre: 'TOP 5 // CLICK A NUGGET TO ',
    mapCapSf: 'FLY',
    mapCapNeutral: 'JUMP',
    mapCapPost: ' TO A SECTOR',
    routeAria: 'Five values',
    route: [
      '01 · system',
      '02 · calm',
      '03 · legacy',
      '04 · costs',
      '05 · projects',
      'Next: see the system',
    ],
    skrotEyebrow: 'Digest · five values in 30 seconds',
    cards: [
      {
        num: 'SECTOR 01',
        h3: '10x Workflow',
        pHtml: 'A coherent system of working with an agent, not a pile of prompts - you take it to your company.',
      },
      {
        num: 'SECTOR 02',
        h3: 'Not just faster',
        pHtml: 'Better and calmer - with your understanding of the system intact, without cognitive debt.',
      },
      {
        num: 'SECTOR 03',
        h3: 'Real code',
        pHtml: "Legacy, other people's repositories, DDD - territory other AI courses do not touch.",
      },
      {
        num: 'SECTOR 04',
        h3: 'AI costs',
        pHtml: 'A benchmark and your own evaluations instead of marketing: a return on every token.',
      },
      {
        num: 'SECTOR 05',
        h3: 'Transformation',
        pHtml: 'Three defensible projects and a certificate - 3,000+ real applications.',
      },
    ],
    s1: {
      num: 'SECTOR 01',
      uni: 'The plan works without its author',
      h2: '10x Workflow - the system you take to work',
      epigraphSf:
        '"A good plan does not need its author present. It only needs people who will take the next step - and a step that can be taken."',
      epigraphCiteSf: '- a record from the Vault, in the spirit of the Seldon Plan',
      figAria:
        'Diagram of the Seldon Plan: a chain of steps executes in sequence and leaves artifacts on disk, while the author stays outside the system',
      fig: [
        'SELDON PLAN // VAULT',
        'EXECUTES WITHOUT ITS AUTHOR',
        'INPUT: IDEA',
        'OUTPUT: DEPLOYMENT',
        'AUTHOR: OUTSIDE THE SYSTEM',
        'EVERY STEP LEAVES AN ARTIFACT ON DISK',
        'KEEPS RUNNING: AT YOUR COMPANY',
      ],
      figcaption: 'FIG. 01 // A PLAN THAT WORKS WITHOUT ITS AUTHOR',
      leadSfHtml:
        'A complete <span class="glow">chain of working with an agent</span>: from idea, through plan and implementation with tests, to review and deployment - all tied together by <strong>10x-cli</strong>, the tool that installs the course <strong>skills</strong> (ready, repeatable procedures for an AI agent) in your environment. Participants value it as <strong>a coherent system, not a pile of prompts</strong> - and like the Seldon Plan from "Foundation", it keeps working without its author: at your company, with no course behind your back.',
      leadNeutralHtml:
        'A complete chain of working with an agent: from idea, through plan and implementation with tests, to review and deployment - all tied together by <strong>10x-cli</strong>, the tool that installs the course <strong>skills</strong> (ready, repeatable procedures for an AI agent) in your environment. Participants value it as <strong>a coherent system, not a pile of prompts</strong> - it keeps working at your company, with no course behind your back.',
      leadHtml:
        'The best evidence is what graduates do after the course: <strong>they bring the workflow into their companies and build their own tools on top of it</strong> - skill forks tailored to the way they work, team distribution repositories, code review pipelines built on the course method.',
      tx: [
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote:
            '"The 10xDevs workflow is brilliant. I just finished the course and I am already rolling out changes at work and building another side project."',
          who: '- 3rd edition participant',
        },
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote:
            '"I built a workflow that analyzes 10xDevs lessons and skills and generates forks of them tailored to the way I work."',
          who: '- 3rd edition participant',
        },
      ],
      mechProofDt: 'Evidence',
      mechProofHtml:
        'graduates roll the workflow out across teams: <b>skill forks, distribution repositories, custom tools</b> built on the course method',
      mechVoiceDt: 'Participant voice',
      mechVoiceHtml:
        '"I started a skill distribution repository for the team. So far it works well." - 3rd edition participant',
      mechForDt: 'Who it is for',
      mechForHtml:
        'everyone, especially the employed - it is the shortest path <b>"from course to team"</b>',
      mechRelDt: 'Related',
      relLabels: [
        'Core Skills Chain - the five steps of the chain',
        'Foundation - context before the first change',
      ],
      targetHtml:
        'leave the course with <b>a repeatable process, not a list of tricks</b> - a system that works the same in a certification project and on Monday morning at work.',
    },
    s2: {
      num: 'SECTOR 02',
      uni: 'On the side of understanding',
      h2: 'AI is not just faster - it is better and calmer',
      epigraphSf:
        '"We circled above the ocean for decades. The library of Solaristics grew faster than our understanding - until, in the end, we were only describing our own reports."',
      epigraphCiteSf: '- a note from the Solaris research station',
      figAria:
        'Diagram of the research station above the Solaris ocean: the ocean of code grows, the library of reports swells without understanding, and the station preserves understanding with artifacts: an architecture report and a repository map',
      fig: [
        'SOLARIS STATION // LISTENING',
        'UNDERSTANDING: READY TO DEFEND',
        'ARCHITECTURE REPORT',
        'REPOSITORY MAP',
        'SOLARISTICS LIBRARY',
        'NOW DESCRIBES ONLY ITS OWN REPORTS',
        'OCEAN: CODE GROWS FASTER THAN UNDERSTANDING',
      ],
      figcaption: 'FIG. 02 // OCEAN VS STATION - UNDERSTANDING ON BOARD',
      leadSfHtml:
        'The market sells AI as pure acceleration. But code generated without structure soon becomes like the ocean of Solaris: alive, productive and less and less comprehensible to the people circling above it. A structured workflow operates on four levels at once: <strong>faster</strong> (less manual work), <strong>better</strong> (tests and verification at every stage), <strong>calmer</strong> (a predictable process instead of chaotic prompting) and <strong>with your understanding of the system intact</strong>.',
      leadNeutralHtml:
        'The market sells AI as pure acceleration. A structured workflow operates on four levels at once: <strong>faster</strong> (less manual work), <strong>better</strong> (tests and verification at every stage), <strong>calmer</strong> (a predictable process instead of chaotic prompting) and <strong>with your understanding of the system intact</strong>.',
      leadHtml:
        "That last level neutralizes the quiet price of working with AI - <strong>cognitive debt</strong>, the moment you stop understanding your own system. The work produces architecture reports, repository maps and domain diagrams you have to be able to defend. You remain <em>an architect and reviewer with your own judgment</em>, not someone rubber-stamping the model's output.",
      tx: [
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote:
            '"The biggest progress I see after the course is not that AI wrote code for me faster, but that I started building my own system of working with AI."',
          who: '- 3rd edition participant',
        },
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote:
            '"The biggest value was working out a repeatable process: from research and planning, through deliberate architectural decisions, implementation, review and quality automation."',
          who: '- 3rd edition participant',
        },
      ],
      mechProofDt: 'Evidence',
      mechProofHtml:
        '<b>architecture reports, repository maps and domain diagrams</b> as standing artifacts of the work; built-in verification catches bugs a human misses',
      mechVoiceDt: 'Participant voice',
      mechVoiceHtml:
        '"The E2E tests in my project caught a problem." - 3rd edition participant; the tests caught a bug he had not spotted himself',
      mechForDt: 'Who it is for',
      mechForHtml:
        'everyone tired of the <b>"fast, but sloppy"</b> pattern and the chaos of vibe coding; seniors worried about losing their craft',
      mechRelDt: 'Related',
      relLabels: [
        'Quality - tests, hooks and gates',
        'Core Skills Chain: review - plan vs code',
      ],
      targetHtml:
        'turn "AI writes for me" into <b>"AI works inside my process"</b> - with quality growing at every stage and full understanding of what is being built.',
    },
    s3: {
      num: 'SECTOR 03',
      uni: 'Ritual instead of understanding',
      h2: 'Works on your real code',
      epigraphSf:
        '"The tech-priest censes the machine and recites the litany of activation. The machine works - but no one aboard remembers why anymore."',
      epigraphCiteSf: '- rites of the Adeptus Mechanicus',
      figAria:
        'Diagram: a machine temple with an activation ritual on the left, a repository map with a hot spot on the right; research turns tribal knowledge into evidence',
      fig: [
        'MACHINE TEMPLE',
        'LITANY OF ACTIVATION: IT WORKS, DO NOT TOUCH',
        'RITUAL INSTEAD OF UNDERSTANDING',
        'RESEARCH',
        'HOT SPOT',
        'REPOSITORY MAP',
      ],
      figcaption: 'FIG. 03 // MACHINE TEMPLE VS REPOSITORY MAP',
      leadSfHtml:
        'In the forty-first millennium technology is worshipped, because no one can repair it anymore. <span class="glow">Legacy without a map works exactly the same way</span>: "we do not touch that file", deployment rituals, tribal knowledge instead of understanding. The workflow covers the full range of work with such code: mapping an unknown repository, researching a specific feature, planning a refactor and analyzing code along <strong>Domain-Driven Design (DDD)</strong> lines. This is territory almost no AI course touches.',
      leadNeutralHtml:
        "Most developers do not write applications from scratch - they work in someone else's years-old code. The workflow covers the full range of work with legacy: mapping an unknown repository, researching a specific feature, planning a refactor and analyzing code along <strong>Domain-Driven Design (DDD)</strong> lines. This is territory almost no AI course touches.",
      leadHtml:
        "The core workflow skills - <strong>research → plan → implement → review</strong> - work in any repository, regardless of the stack and the project's complexity. They will get you through 90% of programming challenges, and you will handle the rest with <em>specialized skills</em>, which you will learn to build during the course.",
      tx: [
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote:
            '"I got the most value out of module 4. It changed how I approach analyzing existing code and showed me how to make architectural decisions based on evidence, not intuition."',
          who: '- 3rd edition participant, on module 4 (Legacy - working with existing code)',
        },
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote:
            '"The lessons on DDD and on the code review pipeline hit a very real need of mine - the materials are staying with me as a reference point."',
          who: '- 3rd edition participant, working with teams on large repositories',
        },
      ],
      mechProofDt: 'Evidence',
      mechProofHtml:
        '<b>44% of the 6,700+ graduates are seniors with 8+ years of experience</b> - people who work in existing code every day; add the many course chat questions about applying the workflow to legacy',
      mechVoiceDt: 'Participant voice',
      mechVoiceHtml:
        '"That research works great when entering a repository." - 3rd edition participant',
      mechForDt: 'Who it is for',
      mechForHtml:
        'people employed on existing projects - <b>which means most developers</b>',
      mechRelDt: 'Related',
      relLabels: [
        'Legacy - map, hot spots, refactoring, DDD',
        'Core Skills Chain: research - facts instead of assumptions',
      ],
      targetHtml:
        'stop treating AI as a "greenfield-only" tool - <b>the biggest return is where the code is years old and no one remembers why</b>.',
    },
    s4: {
      num: 'SECTOR 04',
      uni: 'Measurement instead of faith',
      h2: 'AI cost optimization - a benchmark instead of faith',
      epigraphSf:
        '"Physics does not accept declarations. If the result of an experiment disagrees with the promise, it is not the universe that lies - it is your model."',
      epigraphCiteSf: '- a researcher\'s journal from the Crisis Era, "The Three-Body Problem"',
      figAria:
        'Diagram of a sophon - a proton unfolded and a disrupted measurement: marketing noise versus the benchmark signal',
      fig: [
        'CHAOTIC SYSTEM',
        'SOPHON - 11-D PROTON',
        'SOURCE',
        '2-D UNFOLDING',
        'MARKETING (NOISE)',
        '10XBENCH (SIGNAL)',
      ],
      figcaption: 'FIG. 04 // SOPHON - MEASUREMENT RECLAIMED',
      leadSfHtml:
        'In "The Three-Body Problem" survival depends on measurement, not on faith in someone else\'s declarations. An AI budget works exactly the same way: the course gives you a concrete overview of <strong>what is genuinely worth paying for</strong> - which subscriptions make sense and for what, how to pick a model based on the <strong>10xBench</strong> benchmark (a comparison of models on real programming tasks, run as part of the course) and your own <strong>10xEval</strong> evaluations for your team\'s specific tasks.',
      leadNeutralHtml:
        'The course gives you a concrete overview of <strong>what is genuinely worth paying for</strong>: which subscriptions make sense and for what, how to pick a model based on the <strong>10xBench</strong> benchmark (a comparison of models on real programming tasks, run as part of the course) and your own <strong>10xEval</strong> evaluations for your team\'s specific tasks.',
      leadHtml:
        'Instead of leaning on marketing, we show you how to test - and when it pays to drop down to <strong>open local models</strong>. The result: predictable cost and <em>a return on every token</em>, in a company budget and a private one alike.',
      tx: [
        {
          monoSf: 'SIGNAL FROM THE CHAT',
          monoNeutral: 'SIGNAL FROM THE COURSE',
          monoPost: ' // 3RD EDITION',
          quote:
            '10xBench is actively followed by participants as a source of model-choice decisions - the topic keeps coming back across many course chat threads.',
          who: '- an observation across three editions',
        },
      ],
      mechProofDt: 'Evidence',
      mechProofHtml:
        "<b>10xBench</b> (a model benchmark) + <b>10xEval</b> (evaluations for your own tasks) instead of model vendors' declarations; the selection criterion: cost and quality on a specific task",
      mechVoiceDt: 'Signal',
      mechVoiceHtml:
        'participants follow 10xBench as <b>a source of model-choice decisions</b> - many threads in the course chat',
      mechForDt: 'Who it is for',
      mechForHtml:
        'companies optimizing their AI budget and <b>solo developers paying out of pocket</b>',
      mechRelDt: 'Related',
      relLabels: [
        'Scaling - rigor and autonomy as the stakes grow',
        'Documentation - quick search across the modules',
      ],
      targetHtml:
        'make model and subscription decisions <b>based on measurement, not marketing</b> - and know when a local model is enough.',
    },
    s5: {
      num: 'SECTOR 05',
      uni: "The pilgrims' tales",
      h2: 'Real transformation - three projects, one certificate',
      epigraphSf:
        '"Each pilgrim carries their own tale, and the tale is their passage. Only those who have walked the whole road reach the Time Tombs."',
      epigraphCiteSf: '- custom of the pilgrimage to Hyperion',
      figAria:
        'Pilgrimage map - three stages to the Time Tombs: Builder, Architect and Champion on a single route',
      fig: [
        'PILGRIMAGE ROUTE',
        'BUILDER',
        'ARCHITECT',
        'CHAMPION',
        'TIME TOMBS',
        'TIME FLOWS BACKWARD',
        'START',
      ],
      figcaption: 'FIG. 05 // PILGRIMAGE - THREE TALES, ONE DESTINATION',
      leadSfHtml:
        'As in "Hyperion": the road is what counts, and the weight is carried by the tale of the one who walked it. The certificate stands on three real, defensible projects, not on a knowledge test: a working MVP (<strong>Builder</strong>), an architecture report (<strong>Architect</strong>) and a CI/CD pipeline extended for the team\'s needs (<strong>Champion</strong>). Three stages of the pilgrimage - each with hard evidence in a repository, not an a/b/c answer.',
      leadNeutralHtml:
        'The certificate stands on three real, defensible projects, not on a knowledge test: a working MVP (<strong>Builder</strong>), an architecture report (<strong>Architect</strong>) and a CI/CD pipeline extended for the team\'s needs (<strong>Champion</strong>). Each with hard evidence in a repository, not an a/b/c answer.',
      leadHtml:
        'On top of that comes <strong>DemoDay</strong>, where the best present their work and win awards in a community vote. Across three editions, certification has produced <strong>over 3,000 projects</strong> - real applications answering real problems: personal, family, team and company ones. Participants describe the effect as a real transformation, and they treat the effort involved as part of that value, not as a complaint.',
      tx: [
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote:
            '"I submitted the project, architect and builder. I am as happy as a kid - it was five weeks of really intense work around children, a full-time job and a vacation in between. The satisfaction is incredible."',
          who: '- 3rd edition participant',
        },
        {
          monoSf: 'INTERCEPTED TRANSMISSION',
          monoNeutral: 'PARTICIPANT VOICE',
          monoPost: ' // 3RD EDITION',
          quote: '"Thank you for the course - without it I would still be wandering in the fog."',
          who: '- 3rd edition participant, after building an application from scratch, step by step, following the workflow',
        },
      ],
      mechProofDt: 'Evidence',
      mechProofHtml:
        '<b>3,000+ projects across three editions</b>; three defensible artifacts (an MVP, an architecture report, a CI/CD pipeline) instead of a knowledge test; DemoDay with community awards',
      mechVoiceDt: 'Participant voice',
      mechVoiceHtml:
        '"For the first time I built a complete web application from scratch, with CI/CD, tests and a deploy to real hosting." - 3rd edition participant',
      mechForDt: 'Who it is for',
      mechForHtml:
        'the ambitious; <b>certificate skeptics</b> (three defensible projects beat a piece of paper); everyone who needs a finished, tangible achievement',
      mechRelDt: 'Related',
      relLabels: [
        'Foundation - from idea to MVP (Builder)',
        'Legacy - architecture analysis (Architect)',
        "Teamwork - the team's pipeline (Champion)",
      ],
      targetHtml:
        'finish the course with <b>three tangible proofs of skill</b> - a working application, a defended report and a pipeline your team actually uses.',
    },
    targetK: 'GOAL:',
    next: {
      numSf: 'ORBIT',
      numNeutral: 'NEXT',
      uni: 'Closing the orbit · see the system in action',
      h2: 'Five values, one system',
      leadHtml:
        'Each of the five nuggets comes down to the same mechanism: <b>a structured workflow with artifacts on disk</b> - instead of prompting by feel. System, calm, legacy, costs and certification are not separate promises, but five faces of one method that 6,700+ graduates have practiced across three editions.',
      finisQuote:
        '"The biggest progress I see after the course is not that AI wrote code for me faster, but that I started building my own system of working with AI."',
      finisCite: '- 3rd edition participant',
      targetK: 'NEXT:',
      targetHtml:
        'this page is the digest - <b>the full system lives on the other 10x Workflow pages</b>. The three best starting points are below.',
      dirMono: 'PICK A DIRECTION',
      dirs: [
        {
          dt: 'map',
          link: 'See the 10x Workflow map',
          rest: ' - Core Skills Chain: five steps from idea to review, the core of the method step by step',
        },
        {
          dt: 'docs',
          link: 'Browse the documentation',
          rest: " - quick search across all the system's modules and skills",
        },
        {
          dt: 'theme',
          link: 'Explore the sci-fi theme',
          rest: ' - where the references come from: ten universes that give the pages their colors and metaphors',
        },
        {
          dt: 'legacy',
          link: 'Module 4: Legacy',
          rest: ' - working in inherited systems: map, hot spots, refactoring, DDD',
        },
        {
          dt: 'quality',
          link: 'Module 3: Quality',
          rest: ' - tests, hooks and gates before the code hits production',
        },
      ],
    },
  },
};
