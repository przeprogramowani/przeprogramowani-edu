/**
 * Slownik strony "Motyw sci-fi" (kanon/KanonBody). Struktura kluczy
 * odzwierciedla kolejnosc sekcji w body; pola *Html zawieraja inline markup
 * (strong/b/a) i renderuja sie przez set:html - zewnetrzne linki
 * (Goodreads/Filmweb) mieszkaja w ratingHtml/screenHtml, linki wewnetrzne
 * (pageHref) zostaja w body, tu tylko ich etykiety (links[]).
 * Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { UniverseId } from '../universes';
import type { Lang } from './index';

interface KanonUni {
  num: string;
  /** Tekst sec-uni: "Dlaczego kochamy: ..." */
  why: string;
  h2: string;
  /** Dwa akapity .lead sekcji (inline markup dozwolony). */
  pHtml: [string, string];
  /** Cala zawartosc dd wiersza Ocena (z linkiem Goodreads). */
  ratingHtml: string;
  /** Cala zawartosc dd wiersza Ekranizacja (z linkami Filmweb lub <b>brak</b>). */
  screenHtml: string;
  /** Tekst dd wiersza Symbol (po glifie glyph-mini). */
  symbol: string;
  /** Etykiety linkow wiersza Wystapienia - hrefy (pageHref) zostaja w body. */
  links: string[];
  targetHtml: string;
}

interface KanonDict {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  svgAria: string;
  /** aria-label wezla konstelacji; name = universeName(UNIVERSES[id], lang). */
  nodeAria: (name: string) => string;
  svgTheme: string;
  svgThemeSub: string;
  mapCap: string;
  routeAria: string;
  routeNext: string;
  /** Krotkie nazwy do chipow i etykiet konstelacji. */
  short: Record<UniverseId, string>;
  /** Haczyk rekomendacji na karcie skrotu. */
  hook: Record<UniverseId, string>;
  /** Podpis sygnetu pod duza wizualizacja glifu w sektorze. */
  sigil: Record<UniverseId, string>;
  sumEyebrow: string;
  epigraph: string;
  epigraphCite: string;
  mech: { rating: string; screen: string; symbol: string; links: string };
  targetK: string;
  u: Record<UniverseId, KanonUni>;
  strackK: string;
  strackHtml: string;
  strackOn: string;
  strackOff: string;
  orbit: {
    num: string;
    uni: string;
    h2: string;
    lead: string;
    nextK: string;
    nextPre: string;
    nextLink: string;
    nextPost: string;
  };
}

export const KANON: Record<Lang, KanonDict> = {
  pl: {
    eyebrow: 'MOTYW SF // SKĄD TEN KLIMAT',
    h1Html: 'Marcin i Przemek <span class="glow">lubią sci-fi</span>',
    subHtml:
      'Stąd kosmiczny klimat <strong>10xDevs 3.0</strong> - nie strategia marketingowa, tylko książki, które naprawdę czytamy. Każde uniwersum kampanii ma swój kolor, symbol i powód - poniżej wszystkie dziesięć.',
    svgAria:
      'Mapa orbitalna motywu sci-fi: dziesięć glifów uniwersów krąży wokół centralnego węzła 10x; każdy glif prowadzi do sekcji swojego uniwersum',
    nodeAria: (name) => `${name} - przejdź do sekcji uniwersum`,
    svgTheme: 'MOTYW',
    svgThemeSub: '10x',
    mapCap: 'MOTYW SF // KLIKNIJ GLIF, BY DOLECIEĆ DO UNIWERSUM',
    routeAria: 'Uniwersa motywu sci-fi',
    routeNext: 'Dalej: lista rośnie',
    short: {
      ender: 'Ender',
      trzycia: 'Trzy ciała',
      hyperion: 'Hyperion',
      diuna: 'Diuna',
      wh40k: 'WH40k',
      expanse: 'Expanse',
      starwars: 'Star Wars',
      fundacja: 'Fundacja',
      lem: 'Solaris',
      redrising: 'Red Rising',
    },
    hook: {
      ender:
        'Szkoła Bojowa, symulacje i dowodzenie przez ramy - taktyka, którą czyta się w dwa wieczory.',
      trzycia:
        'Hard SF o nauce pod presją - co się dzieje, gdy eksperymenty przestają się zgadzać.',
      hyperion:
        'Siedmiu pielgrzymów, siedem opowieści - literacko najlepsza pozycja tego zestawu.',
      diuna:
        'Ekologia, polityka i religia w jednym systemie - światotwórstwo, do którego wszystko się porównuje.',
      wh40k:
        'Mit założycielski Imperium - wojskowe SF o tym, jak wielkie instytucje psują się od środka.',
      expanse:
        'Fizyka bez taryfy ulgowej i załoga Rocinante - najmocniejsza rekomendacja kampanii.',
      starwars:
        'Thrawn: dowódca, który wygrywa analizą przeciwnika, nie większą flotą.',
      fundacja:
        'Psychohistoria i plan na stulecia - myślenie systemowe w skali galaktyki.',
      lem:
        'Pierwszy kontakt, który nie jest lustrem człowieka - polski klasyk grający w światowej lidze.',
      redrising:
        'Ender spotyka Rzym na Marsie - hierarchia kolorów i awans przez podszycie się pod elitę.',
    },
    sigil: {
      ender: 'BRAMA WROGA // W DÓŁ',
      trzycia: 'TRZY SŁOŃCA // ORBITY',
      hyperion: 'KLEPSYDRA // DZIERZBA',
      diuna: 'WYDMA // CZERW',
      wh40k: 'ZĘBATKA // MECHANICUS',
      expanse: 'ROCINANTE // NAPĘD',
      starwars: 'ROZBŁYSK // NADPRZESTRZEŃ',
      fundacja: 'SPIRALA // PLAN SELDONA',
      lem: 'OCEAN // SOLARIS',
      redrising: 'SIERP // PER ASPERA',
    },
    sumEyebrow: 'Skrót · dziesięć uniwersów w 30 sekund',
    epigraph:
      '„Dobra metafora to nie dekoracja - to mechanizm, który zapamiętujesz lepiej niż definicję. Dlatego zamiast wymyślać własne uniwersa, pożyczamy od najlepszych."',
    epigraphCite: '- 10x Workflow',
    mech: { rating: 'Ocena', screen: 'Ekranizacja', symbol: 'Symbol', links: 'Wystąpienia' },
    targetK: 'CEL:',
    u: {
      ender: {
        num: 'ENDER',
        why: 'Dlaczego kochamy: brama wroga jest w dole',
        h2: 'Gra Endera',
        pHtml: [
          'Orson Scott Card wysyła dziecko do Szkoły Bojowej, gdzie wszystko jest grą: symulacje, drużyny, taktyka w zerowej grawitacji. Ender wygrywa nie dlatego, że jest najsilniejszy, tylko dlatego, że jako pierwszy przestawia układ odniesienia - „brama wroga jest w dole" - i resztę bitwy rozgrywa już w lepszych współrzędnych.',
          'Polecamy, bo to najlepszy podręcznik dowodzenia i pracy zespołowej udający powieść przygodową: odprawy, delegowanie do dowódców zastępów, uczenie się z powtórek. A finał dokłada dorosłe pytanie o cenę wygranej, którego młodzieżowa okładka zupełnie nie zapowiada.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/375802.Ender_s_Game" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,3</b> (ok. 1,5 mln ocen)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Gra+Endera-2013-163903" target="_blank" rel="noopener" style="color:var(--acc)">Gra Endera (2013)</a> - <b>6,4</b> (ok. 81 tys. ocen); film spłaszcza powieść - traktuj jak zwiastun, nie zamiennik',
        symbol:
          'brama ze strzałką w dół - „the enemy\'s gate is down": przeramowanie układu odniesienia, zanim ruszy bitwa',
        links: [
          'łańcuch: wybór bitwy (new)',
          'fundament: odprawa (onboarding)',
          'teamwork: drużyna',
        ],
        targetHtml:
          'pierwsza pozycja na liście - <b>sięgnij, gdy chcesz w dwa wieczory zobaczyć, czym różni się dowodzenie przez ramy od dowodzenia przez rozkazy</b>.',
      },
      trzycia: {
        num: 'TRZY CIAŁA',
        why: 'Dlaczego kochamy: nauka pod presją',
        h2: 'Problem trzech ciał',
        pHtml: [
          'Cixin Liu zaczyna od fizyków, którym eksperymenty przestają się zgadzać - i od pytania, co to robi z ludźmi, którzy całe życie ufali metodzie. Dalej jest rewolucja kulturalna, dziwna gra VR o cywilizacji na niestabilnej orbicie trzech słońc i pierwszy kontakt, który nie przypomina niczego z hollywoodzkich schematów.',
          'Polecamy, bo to hard SF, w którym bohaterem jest eksperyment myślowy: skala rośnie od jednego laboratorium do losów gatunku, a każdy zwrot akcji wynika z fizyki, nie z wygody scenariusza. Książka uczy pokory wobec dowodów - i tego, że obserwator zmienia obserwowany system.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/20518872-the-three-body-problem" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,1</b> (ok. 524 tys. ocen)',
        screenHtml:
          '<a href="https://www.filmweb.pl/serial/Problem+trzech+cia%C5%82-2024-10030298" target="_blank" rel="noopener" style="color:var(--acc)">Problem trzech ciał (Netflix, 2024)</a> - <b>6,6</b> (ok. 25 tys. ocen); solidny punkt wejścia, ale książka idzie dalej i głębiej',
        symbol:
          'trzy ciała na przecinających się orbitach - układ, którego nie da się przewidzieć w długim horyzoncie',
        links: [
          'łańcuch: dowody (research)',
          'jakość: eksperyment i wyrocznia',
          'top5: pomiar zamiast wiary',
        ],
        targetHtml:
          'sięgnij, gdy chcesz hard SF, które <b>traktuje dowody i metodę naukową śmiertelnie poważnie</b> - i nie boi się skali cywilizacyjnej.',
      },
      hyperion: {
        num: 'HYPERION',
        why: 'Dlaczego kochamy: siedem opowieści, jedna trasa',
        h2: 'Hyperion',
        pHtml: [
          'Dan Simmons wysyła siedmiu pielgrzymów do Grobowców Czasu, gdzie czeka Dzierzba - i każe każdemu opowiedzieć po drodze własną historię. Struktura jak z „Opowieści kanterberyjskich", ale każda nowela to inny gatunek: horror, romans, wojskowe SF, kryminał noir, cyberpunk. Wszystkie zbiegają się w jednym punkcie trasy.',
          'Polecamy, bo to literacko najlepsza pozycja z całej dziesiątki - proza, która wygrywa z większością „poważnej" literatury, a przy okazji jest bezczelnie pomysłowym SF. Plan pielgrzymki jest prosty; to opowieści pielgrzymów niosą całą wagę. Dokładnie tak, jak dobry plan zmiany.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/77566.Hyperion" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,3</b> (ok. 313 tys. ocen)',
        screenHtml:
          '<b>brak</b> - projekt utknął w przygotowaniach od ok. 2009 (najpierw Syfy, potem Warner Bros.), wciąż bez reżysera i daty premiery; książka pozostaje jedynym wejściem do tego świata',
        symbol:
          'klepsydra Grobowców Czasu z kolcem Dzierzby - czas płynący pod prąd i cena spotkania na końcu trasy',
        links: [
          'łańcuch: trasa pielgrzymki (plan)',
          'jakość: pielgrzymi debuggingu',
          'top5: opowieści pielgrzymów',
        ],
        targetHtml:
          'sięgnij, gdy chcesz SF pisane jak <b>wielka literatura</b> - i nie przeszkadza Ci, że pełne odpowiedzi przychodzą dopiero w „Upadku Hyperiona".',
      },
      diuna: {
        num: 'DIUNA',
        why: 'Dlaczego kochamy: system, nie sceneria',
        h2: 'Diuna',
        pHtml: [
          'Arrakis to jedyne źródło przyprawy w znanym wszechświecie, więc polityka rodów, ekologia pustyni, religia i ekonomia są u Franka Herberta jednym sprzężonym systemem. Zmień jedną zmienną - wodę - a zmienia się wszystko: kultura Fremenów, strategia wojenna, mesjanizm. Bene Gesserit projektują swoje próby na pokolenia naprzód, a gom dżabbar odsiewa w minutę to, czego nie widać latami.',
          'Polecamy, bo to światotwórstwo-wzorzec, do którego porównuje się całą resztę gatunku - i najczystszy trening myślenia systemowego w formie powieści. Nie bez powodu to uniwersum obsługuje w kampanii aż cztery metafory, od kształtu projektu po bramki jakości.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/44767458-dune" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,3</b> (ok. 1,7 mln ocen)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Diuna-2021-469476" target="_blank" rel="noopener" style="color:var(--acc)">Diuna (2021)</a> - <b>7,6</b> (ok. 216 tys. ocen) · <a href="https://www.filmweb.pl/film/Diuna%3A+Cz%C4%99%C5%9B%C4%87+druga-2024-10003481" target="_blank" rel="noopener" style="color:var(--acc)">Diuna: Część druga (2024)</a> - <b>8,1</b> (ok. 150 tys. ocen); trzecia część zapowiedziana na grudzień 2026',
        symbol:
          'łuk wydmy i czerw wynurzający się z piasku - system, który odpowiada na każdy rytmiczny krok po jego powierzchni',
        links: [
          'fundament: Bene Gesserit (kształt)',
          'skalowanie: gom dżabbar (quality gates)',
          'jakość: Fremeni (mapa ryzyk)',
          'legacy: filtrfrak (kontekst)',
        ],
        targetHtml:
          "sięgnij, gdy chcesz zobaczyć <b>myślenie systemowe w akcji</b> - przed filmami Villeneuve'a albo zaraz po nich, kiedy świat wciąż siedzi w głowie.",
      },
      wh40k: {
        num: 'WH40K',
        why: 'Dlaczego kochamy: mit założycielski i entropia',
        h2: 'Horus Rising - początek Herezji Horusa',
        pHtml: [
          'Dan Abnett otwiera cykl Herezja Horusa zdaniem „I was there the day Horus slew the Emperor" - i przez resztę książki pokazuje Imperium w chwili największej świetności, w którym już kiełkują pęknięcia mające rozsadzić wszystko. Legiony Astartes, wielka krucjata, lojalność, propaganda - i pierwsze decyzje, które za kilkadziesiąt tomów okażą się katastrofą.',
          'Polecamy, bo Abnett pisze wojskowe SF z powagą, jakiej nikt nie spodziewa się po uniwersum z gry figurkowej: to opowieść o tym, jak największe instytucje psują się od środka, a technologia zamienia się w rytuał, gdy nikt już nie rozumie, jak działa. Najlepsze możliwe wejście w WH40k - bez znajomości gry.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/625603.Horus_Rising" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,3</b> (ok. 42 tys. ocen)',
        screenHtml:
          '<b>brak pełnoprawnej</b> - serial Amazona z Henrym Cavillem jest w przygotowaniu (realnie 2027+); przedsmak klimatu: odcinek antologii Secret Level (Prime Video, 2024)',
        symbol:
          'pół-zębatka Adeptus Mechanicus - kult maszyny: technologia, którą się czci, bo nikt już nie umie jej naprawić',
        links: [
          'łańcuch: kogitator (review)',
          'legacy: świątynia-maszyna (refaktor)',
          'top5: rytuał zamiast rozumienia',
        ],
        targetHtml:
          'sięgnij, gdy pracujesz z legacy i chcesz <b>mit założycielski o entropii wielkich systemów</b> - opowiedziany od środka, zanim wszystko się zawaliło.',
      },
      expanse: {
        num: 'EXPANSE',
        why: 'Dlaczego kochamy: fizyka bez taryfy ulgowej',
        h2: 'Przebudzenie Lewiatana - The Expanse',
        pHtml: [
          'James S.A. Corey dzieli Układ Słoneczny między Ziemię, Marsa i Pas - a potem wrzuca w ten zimny konflikt detektywa z Ceres i małą załogę, która wchodzi w posiadanie okrętu Rocinante. Fizyka nie dostaje taryfy ulgowej: ciąg, hamowanie, przeciążenia i orbity są tu realną walutą, a manewr flip &amp; burn boli dokładnie tak, jak powinien. Noir spotyka space operę i obie na tym zyskują.',
          'To najmocniejsza rekomendacja kampanii - i jedyna z osobistym dowodem: <strong>Marcin przeczytał wszystkie dziewięć tomów w półtora roku i obejrzał cały serial</strong>. Żadna inna seria z tej listy nie przeszła takiego testu w praktyce. Poziom nie spada do ostatniej strony ostatniego tomu, a załoga Rocinante to najlepszy mały zespół w SF.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/8855321-leviathan-wakes" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,3</b> (ok. 333 tys. ocen)',
        screenHtml:
          '<a href="https://www.filmweb.pl/serial/The+Expanse-2015-721026" target="_blank" rel="noopener" style="color:var(--acc)">The Expanse (2015-2022, 6 sezonów)</a> - <b>8,0</b> (ok. 27 tys. ocen); jedna z najlepszych adaptacji SF w historii telewizji',
        symbol:
          'trójkątny kadłub z płomieniem napędu - Rocinante: fizyka zamiast magii, załoga zamiast samotnego bohatera',
        links: [
          'łańcuch: flip & burn (implement)',
          'fundament: stocznia Tycho (bootstrap)',
          'jakość: lot Rocinante (E2E)',
          'legacy: detektyw z Ceres (hot spots)',
          'teamwork: Pasiarze (internal tools)',
        ],
        targetHtml:
          'sięgnij, gdy szukasz serii <b>na miesiące, nie na weekend</b> - dziewięć tomów, które utrzymują poziom do samego końca.',
      },
      starwars: {
        num: 'STAR WARS',
        why: 'Dlaczego kochamy: dowodzenie analizą',
        h2: 'Dziedzic Imperium - trylogia Thrawna',
        pHtml: [
          'Timothy Zahn zaczyna pięć lat po bitwie o Endor: Nowa Republika jeszcze świętuje, a resztki Imperium zbiera wielki admirał Thrawn - dowódca, który wygrywa nie liczbą okrętów, tylko analizą. Studiuje sztukę cywilizacji przeciwnika, żeby przewidzieć jego decyzje w boju. To książka, która w 1991 roku wskrzesiła Gwiezdne wojny i zbudowała cały stary Expanded Universe.',
          'Polecamy, bo to franczyza, na której wychowały się dwa pokolenia - reprezentowana tu przez najlepszą powieść, jaką kiedykolwiek dostała. Thrawn jest wzorcem dowódcy-analityka: przygotowanie zamiast brawury, research o przeciwniku zamiast większej floty. W kampanii to uniwersum obsługuje metafory skali operacji: skok w nadprzestrzeń, eskadrę i tarcze.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/216443.Heir_to_the_Empire" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,2</b> (ok. 106 tys. ocen)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Gwiezdne+wojny:+Cz%C4%99%C5%9B%C4%87+IV+Nowa+nadzieja-1977-759" target="_blank" rel="noopener" style="color:var(--acc)">Gwiezdne wojny: Nowa nadzieja (1977)</a> - <b>7,9</b> (ok. 354 tys. ocen); punkt zero całej franczyzy - trylogia Thrawna czeka na swoją adaptację',
        symbol:
          'czteroramienny rozbłysk gwiazdy - nadprzestrzeń i flota: skala operacji, nie pojedynczy myśliwiec',
        links: [
          'fundament: nadprzestrzeń (deploy)',
          'skalowanie: eskadra (loops)',
          'jakość: tarcze (hooki)',
        ],
        targetHtml:
          'sięgnij, gdy znasz filmy i chcesz zobaczyć, <b>jak dowodzi ktoś, kto naprawdę odrobił research o przeciwniku</b>.',
      },
      fundacja: {
        num: 'FUNDACJA',
        why: 'Dlaczego kochamy: plan na stulecia',
        h2: 'Fundacja',
        pHtml: [
          'Hari Seldon liczy psychohistorią - matematyką wielkich populacji - że Imperium Galaktyczne upadnie, a ciemne wieki potrwają trzydzieści tysięcy lat. Zamiast ratować Imperium, zakłada Fundację na skraju galaktyki, która ma skrócić chaos do tysiąca lat. Kryzysy są przewidziane pokolenia wcześniej, a Krypta Czasu odzywa się dokładnie wtedy, kiedy plan tego wymaga.',
          'Polecamy, bo Isaac Asimov to dziadek całego gatunku, a Fundacja to najczystsze SF idei: mało blasterów, dużo myślenia w horyzoncie instytucji i systemów. Każdy „plan, który wykonuje się bez autora" - łącznie z naszym - ma tu swój pierwowzór.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/29579.Foundation" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,2</b> (ok. 610 tys. ocen)',
        screenHtml:
          '<a href="https://www.filmweb.pl/serial/Fundacja-2021-856226" target="_blank" rel="noopener" style="color:var(--acc)">Fundacja (Apple TV+, 2021-)</a> - <b>7,3</b> (ok. 10 tys. ocen); luźna adaptacja - bierze z książek idee, nie fabułę',
        symbol: 'spirala galaktyki - plan Seldona: ruch, który widać dopiero w skali stuleci',
        links: [
          'skalowanie: plan Seldona (goal)',
          'legacy: model domeny (DDD)',
          'teamwork: Encyklopedia (registry)',
          'top5: plan bez autora',
        ],
        targetHtml:
          'sięgnij, gdy chcesz źródło - <b>od psychohistorii Seldona zaczęło się myślenie o planach dłuższych niż jedno życie</b>.',
      },
      lem: {
        num: 'LEM',
        why: 'Dlaczego kochamy: obcy, który nie jest lustrem',
        h2: 'Solaris',
        pHtml: [
          'Stanisław Lem wysyła psychologa Krisa Kelvina na stację badawczą nad planetą-oceanem, którą ludzkość studiuje od dekad bez rezultatu. Ocean nie odpowiada na sygnały - zamiast tego odsyła załodze „gości": materializacje najgłębiej pogrzebanych wspomnień. U Kelvina to zmarła żona. Solarystyka, całe biblioteki teorii o oceanie, okazuje się encyklopedią ludzkiej bezradności: badacze przez sto lat opisywali własne odbicie.',
          'Polecamy, bo to pierwszy kontakt, który nie jest lustrem człowieka - obcy naprawdę obcy, bez negocjacji, bez inwazji, bez tłumaczenia na ludzkie kategorie. I jest w tym kawałek dumy: polski klasyk z 1961 roku gra w światowej lidze na równych prawach, z dwiema głośnymi ekranizacjami i miejscem w każdym poważnym rankingu SF.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/95558.Solaris" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,0</b> (ok. 138 tys. ocen)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Solaris-1972-32140" target="_blank" rel="noopener" style="color:var(--acc)">Solaris (Tarkowski, 1972)</a> - <b>7,3</b> (ok. 11 tys. ocen) · <a href="https://www.filmweb.pl/film/Solaris-2002-33510" target="_blank" rel="noopener" style="color:var(--acc)">Solaris (Soderbergh, 2002)</a> - <b>6,1</b> (ok. 31 tys. ocen); Lem nie uznał żadnej - o wersji Tarkowskiego mówił, że to „Zbrodnia i kara", nie Solaris',
        symbol:
          'symetryczna fala oceanu z zawieszonym okiem - ocean, który bada badających: kontakt bez porozumienia',
        links: [
          'legacy: sondowanie oceanu (mapa)',
          'teamwork: ocean bada badających (review)',
          'top5: po stronie rozumienia',
        ],
        targetHtml:
          'sięgnij, gdy chcesz sprawdzić, <b>jak wygląda pierwszy kontakt bez lustra</b> - i dlaczego cały świat wciąż wraca do polskiego klasyka sprzed sześciu dekad.',
      },
      redrising: {
        num: 'RED RISING',
        why: 'Dlaczego kochamy: awans przez podszycie',
        h2: 'Red Rising',
        pHtml: [
          'Pierce Brown zaczyna w kopalniach helu-3 pod powierzchnią Marsa: Darrow jest Czerwonym, najniższą kastą w hierarchii kolorów, i wierzy, że jego praca przygotowuje planetę dla przyszłych pokoleń. To kłamstwo - Mars od dawna jest zasiedlony, a Czerwoni są niewolnikami fundamentu. Po stracie żony Darrow daje się chirurgicznie przebudować na Złotego i wchodzi do Instytutu: szkoły elity, w której egzaminem końcowym jest wojna między domami.',
          'Polecamy, bo to Ender spotyka Rzym na Marsie: instytucja, która testuje przez okrucieństwo, hierarchia kolorów zamiast klas społecznych i awans przez podszycie się pod elitę - dowodzenie ludźmi, którzy zabiliby go za samo pochodzenie. Brown pisze szybciej i brutalniej niż Card, ale pytanie zostaje to samo: ile kosztuje wygrana i kim się jest po niej.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/15839976-red-rising" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4,3</b> (ok. 917 tys. ocen)',
        screenHtml:
          '<b>brak</b> - serial po kilkunastu latach przygotowań oficjalnie skasowany (potwierdzone w 2026); prawa opcjonowane po raz trzeci, nowy projekt na bardzo wczesnym etapie - książka pozostaje jedynym wejściem do tego świata',
        symbol:
          'wznosząca strzała ze skrzydłami - droga z kopalni na szczyt hierarchii: per aspera ad astra',
        links: ['fundament: przepoczwarzenie (skille)', 'teamwork: wataha (async)'],
        targetHtml:
          'sięgnij, gdy chcesz zobaczyć <b>Szkołę Bojową dla dorosłych</b> - instytucję, hierarchię i cenę awansu w środowisku, które nie wybacza błędów.',
      },
    },
    strackK: 'SOUNDTRACK:',
    strackHtml:
      '<b>Footsteps of History</b> - Clinton Shorter (The Expanse, sezon 4). Ten utwór grał w pętli, kiedy powstawało 10xDevs 3.0.',
    strackOn: 'WŁĄCZ MUZYKĘ',
    strackOff: 'WYŁĄCZ MUZYKĘ',
    orbit: {
      num: 'ORBITA',
      uni: 'Zamknięcie orbity · co dalej',
      h2: 'Ta lista rośnie razem z kampanią',
      lead:
        'Żadne z tych uniwersów nie trafiło do kampanii dla ozdoby. Każde weszło, bo niesie mechanizm: próbę, której nie da się ominąć, plan, który wykonuje się bez autora, eskadrę z izolowanymi kokpitami. Metafora działa tylko wtedy, gdy źródło jest dobre - dlatego zamiast wymyślać własne światy, pożyczamy od książek, które przetrwały dekady czytelniczego review. Lista nie jest zamknięta: kolejne moduły będą dopisywać nowe glify, kolory i lektury.',
      nextK: 'DALEJ:',
      nextPre: 'pełna mapa metafor i węzłów mieszka w ',
      nextLink: 'dokumentacji 10x Workflow',
      nextPost: ' - quick search po wszystkich modułach.',
    },
  },
  en: {
    eyebrow: 'SF THEME // WHERE THE VIBE COMES FROM',
    h1Html: 'Marcin and Przemek <span class="glow">like sci-fi</span>',
    subHtml:
      'That is where the cosmic vibe of <strong>10xDevs 3.0</strong> comes from - not a marketing strategy, just the books we actually read. Every universe in the campaign has its color, its symbol and its reason - all ten are below.',
    svgAria:
      "Orbital map of the sci-fi theme: ten universe glyphs orbit the central 10x node; each glyph leads to its universe's section",
    nodeAria: (name) => `${name} - go to this universe's section`,
    svgTheme: 'THEME',
    svgThemeSub: '10x',
    mapCap: 'SF THEME // CLICK A GLYPH TO FLY TO A UNIVERSE',
    routeAria: 'Sci-fi theme universes',
    routeNext: 'Next: the list grows',
    short: {
      ender: 'Ender',
      trzycia: 'Three-Body',
      hyperion: 'Hyperion',
      diuna: 'Dune',
      wh40k: 'WH40k',
      expanse: 'Expanse',
      starwars: 'Star Wars',
      fundacja: 'Foundation',
      lem: 'Solaris',
      redrising: 'Red Rising',
    },
    hook: {
      ender:
        'Battle School, simulations and command through frames - tactics you can read in two evenings.',
      trzycia:
        'Hard SF about science under pressure - what happens when the experiments stop adding up.',
      hyperion:
        'Seven pilgrims, seven tales - the strongest piece of writing in this set.',
      diuna:
        'Ecology, politics and religion in one system - the worldbuilding everything else is compared to.',
      wh40k:
        'The founding myth of the Imperium - military SF about how great institutions rot from within.',
      expanse:
        "Physics with no free passes and the crew of the Rocinante - the campaign's strongest recommendation.",
      starwars:
        'Thrawn: a commander who wins through analysis of his opponent, not a bigger fleet.',
      fundacja:
        'Psychohistory and a plan for centuries - systems thinking at the scale of a galaxy.',
      lem:
        'A first contact that is not a mirror of humanity - a Polish classic playing in the world league.',
      redrising:
        'Ender meets Rome on Mars - a hierarchy of Colors and ascent by passing as the elite.',
    },
    sigil: {
      ender: 'ENEMY GATE // DOWN',
      trzycia: 'THREE SUNS // ORBITS',
      hyperion: 'HOURGLASS // SHRIKE',
      diuna: 'DUNE // SANDWORM',
      wh40k: 'COG // MECHANICUS',
      expanse: 'ROCINANTE // DRIVE',
      starwars: 'STARBURST // HYPERSPACE',
      fundacja: 'SPIRAL // SELDON PLAN',
      lem: 'OCEAN // SOLARIS',
      redrising: 'SICKLE // PER ASPERA',
    },
    sumEyebrow: 'The quick pass · ten universes in 30 seconds',
    epigraph:
      '"A good metaphor is not decoration - it is a mechanism you remember better than a definition. That is why, instead of inventing our own universes, we borrow from the best."',
    epigraphCite: '- 10x Workflow',
    mech: { rating: 'Rating', screen: 'Adaptation', symbol: 'Symbol', links: 'Appearances' },
    targetK: 'GOAL:',
    u: {
      ender: {
        num: 'ENDER',
        why: "Why we love it: the enemy's gate is down",
        h2: "Ender's Game",
        pHtml: [
          'Orson Scott Card sends a child to Battle School, where everything is a game: simulations, armies, tactics in zero gravity. Ender wins not because he is the strongest, but because he is the first to flip the frame of reference - "the enemy\'s gate is down" - and fights the rest of the battle in better coordinates.',
          'We recommend it because it is the best manual of command and teamwork disguised as an adventure novel: briefings, delegating to toon leaders, learning from replays. And the ending adds a grown-up question about the price of winning that the young-adult cover never hints at.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/375802.Ender_s_Game" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.3</b> (approx. 1.5M ratings)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Gra+Endera-2013-163903" target="_blank" rel="noopener" style="color:var(--acc)">Ender\'s Game (2013)</a> - <b>6.4</b> (approx. 81K ratings); the film flattens the novel - treat it as a trailer, not a substitute',
        symbol:
          'a gate with a downward arrow - "the enemy\'s gate is down": reframing the coordinate system before the battle starts',
        links: [
          'chain: picking the battle (new)',
          'foundation: the briefing (onboarding)',
          'teamwork: the team',
        ],
        targetHtml:
          'first on the list - <b>pick it up when you want to see, in two evenings, how commanding through frames differs from commanding through orders</b>.',
      },
      trzycia: {
        num: 'THREE-BODY',
        why: 'Why we love it: science under pressure',
        h2: 'The Three-Body Problem',
        pHtml: [
          'Cixin Liu starts with physicists whose experiments stop adding up - and with the question of what that does to people who trusted the method their whole lives. Then come the Cultural Revolution, a strange VR game about a civilization on the unstable orbit of three suns, and a first contact that resembles nothing from the Hollywood playbook.',
          'We recommend it because this is hard SF whose real protagonist is a thought experiment: the scale grows from a single laboratory to the fate of the species, and every plot twist follows from physics, not from the convenience of the script. The book teaches humility toward evidence - and that the observer changes the observed system.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/20518872-the-three-body-problem" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.1</b> (approx. 524K ratings)',
        screenHtml:
          '<a href="https://www.filmweb.pl/serial/Problem+trzech+cia%C5%82-2024-10030298" target="_blank" rel="noopener" style="color:var(--acc)">3 Body Problem (Netflix, 2024)</a> - <b>6.6</b> (approx. 25K ratings); a solid entry point, but the book goes further and deeper',
        symbol:
          'three bodies on intersecting orbits - a system that cannot be predicted over a long horizon',
        links: [
          'chain: evidence (research)',
          'quality: the experiment and the oracle',
          'top5: measurement instead of faith',
        ],
        targetHtml:
          'pick it up when you want hard SF that <b>takes evidence and the scientific method dead seriously</b> - and is not afraid of civilizational scale.',
      },
      hyperion: {
        num: 'HYPERION',
        why: 'Why we love it: seven tales, one route',
        h2: 'Hyperion',
        pHtml: [
          'Dan Simmons sends seven pilgrims to the Time Tombs, where the Shrike waits - and has each of them tell their own story along the way. The structure is straight out of "The Canterbury Tales", but every novella is a different genre: horror, romance, military SF, noir crime, cyberpunk. All of them converge at a single point of the route.',
          "We recommend it because it is the strongest piece of writing in this set of ten - prose that beats most \"serious\" literature while being shamelessly inventive SF. The pilgrimage plan is simple; it is the pilgrims' tales that carry all the weight. Exactly like a good plan for a change.",
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/77566.Hyperion" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.3</b> (approx. 313K ratings)',
        screenHtml:
          '<b>none</b> - the project has been stuck in development since around 2009 (first Syfy, then Warner Bros.), still without a director or a release date; the book remains the only way into this world',
        symbol:
          "the hourglass of the Time Tombs with the Shrike's spike - time flowing backward and the price of the meeting at the end of the route",
        links: [
          'chain: the pilgrimage route (plan)',
          'quality: the pilgrims of debugging',
          "top5: the pilgrims' tales",
        ],
        targetHtml:
          'pick it up when you want SF written like <b>great literature</b> - and you do not mind that the full answers arrive only in "The Fall of Hyperion".',
      },
      diuna: {
        num: 'DUNE',
        why: 'Why we love it: a system, not scenery',
        h2: 'Dune',
        pHtml: [
          "Arrakis is the only source of spice in the known universe, so the politics of the great houses, desert ecology, religion and economics form one coupled system in Frank Herbert's hands. Change a single variable - water - and everything changes: Fremen culture, military strategy, messianism. The Bene Gesserit design their trials generations ahead, and the gom jabbar filters out in a minute what stays invisible for years.",
          'We recommend it because this is the benchmark of worldbuilding the rest of the genre is measured against - and the purest training in systems thinking in the form of a novel. There is a reason this universe carries as many as four metaphors in the campaign, from the shape of a project to quality gates.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/44767458-dune" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.3</b> (approx. 1.7M ratings)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Diuna-2021-469476" target="_blank" rel="noopener" style="color:var(--acc)">Dune (2021)</a> - <b>7.6</b> (approx. 216K ratings) · <a href="https://www.filmweb.pl/film/Diuna%3A+Cz%C4%99%C5%9B%C4%87+druga-2024-10003481" target="_blank" rel="noopener" style="color:var(--acc)">Dune: Part Two (2024)</a> - <b>8.1</b> (approx. 150K ratings); part three announced for December 2026',
        symbol:
          'the arc of a dune and a sandworm surfacing from the sand - a system that answers every rhythmic step on its surface',
        links: [
          'foundation: Bene Gesserit (shape)',
          'scaling: gom jabbar (quality gates)',
          'quality: the Fremen (risk map)',
          'legacy: the stillsuit (context)',
        ],
        targetHtml:
          "pick it up when you want to see <b>systems thinking in action</b> - before Villeneuve's films, or right after them, while the world is still in your head.",
      },
      wh40k: {
        num: 'WH40K',
        why: 'Why we love it: a founding myth and entropy',
        h2: 'Horus Rising - the start of the Horus Heresy',
        pHtml: [
          'Dan Abnett opens the Horus Heresy cycle with the line "I was there the day Horus slew the Emperor" - and spends the rest of the book showing the Imperium at the peak of its glory, already sprouting the cracks that will blow it all apart. The Astartes Legions, the Great Crusade, loyalty, propaganda - and the first decisions that will prove catastrophic dozens of volumes later.',
          'We recommend it because Abnett writes military SF with a seriousness nobody expects from a universe born of a tabletop game: it is a story about how the greatest institutions rot from within, and how technology turns into ritual once nobody understands how it works anymore. The best possible entry into WH40k - no knowledge of the game required.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/625603.Horus_Rising" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.3</b> (approx. 42K ratings)',
        screenHtml:
          "<b>no full adaptation</b> - Amazon's series with Henry Cavill is in development (realistically 2027+); for a taste of the vibe: an episode of the Secret Level anthology (Prime Video, 2024)",
        symbol:
          'the half-cog of the Adeptus Mechanicus - the machine cult: technology worshipped because nobody can repair it anymore',
        links: [
          'chain: the cogitator (review)',
          'legacy: the machine-temple (refactor)',
          'top5: ritual instead of understanding',
        ],
        targetHtml:
          'pick it up when you work with legacy and want <b>a founding myth about the entropy of great systems</b> - told from the inside, before it all came down.',
      },
      expanse: {
        num: 'EXPANSE',
        why: 'Why we love it: physics with no free passes',
        h2: 'Leviathan Wakes - The Expanse',
        pHtml: [
          'James S.A. Corey splits the Solar System between Earth, Mars and the Belt - then drops into that cold conflict a detective from Ceres and a small crew that comes into possession of the Rocinante. Physics gets no free pass: thrust, deceleration, g-forces and orbits are real currency here, and the flip &amp; burn maneuver hurts exactly as much as it should. Noir meets space opera and both come out better for it.',
          'This is the strongest recommendation of the campaign - and the only one with personal proof: <strong>Marcin read all nine volumes in a year and a half and watched the entire series</strong>. No other series on this list has passed that kind of field test. The quality holds to the last page of the last volume, and the crew of the Rocinante is the best small team in SF.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/8855321-leviathan-wakes" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.3</b> (approx. 333K ratings)',
        screenHtml:
          '<a href="https://www.filmweb.pl/serial/The+Expanse-2015-721026" target="_blank" rel="noopener" style="color:var(--acc)">The Expanse (2015-2022, 6 seasons)</a> - <b>8.0</b> (approx. 27K ratings); one of the best SF adaptations in the history of television',
        symbol:
          'a triangular hull with a drive plume - the Rocinante: physics instead of magic, a crew instead of a lone hero',
        links: [
          'chain: flip & burn (implement)',
          'foundation: the Tycho shipyard (bootstrap)',
          "quality: the Rocinante's flight (E2E)",
          'legacy: the detective from Ceres (hot spots)',
          'teamwork: Belters (internal tools)',
        ],
        targetHtml:
          'pick it up when you are looking for a series <b>for months, not for a weekend</b> - nine volumes that hold their level to the very end.',
      },
      starwars: {
        num: 'STAR WARS',
        why: 'Why we love it: command through analysis',
        h2: 'Heir to the Empire - the Thrawn trilogy',
        pHtml: [
          "Timothy Zahn picks up five years after the Battle of Endor: the New Republic is still celebrating while the remnants of the Empire are gathered by Grand Admiral Thrawn - a commander who wins not with more ships, but with analysis. He studies the art of his opponent's civilization to predict their decisions in battle. This is the book that resurrected Star Wars in 1991 and built the entire old Expanded Universe.",
          'We recommend it because this is the franchise two generations grew up on - represented here by the best novel it ever got. Thrawn is the model of the analyst-commander: preparation instead of bravado, research on the opponent instead of a bigger fleet. In the campaign this universe carries the metaphors of operational scale: the jump to hyperspace, the squadron and the shields.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/216443.Heir_to_the_Empire" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.2</b> (approx. 106K ratings)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Gwiezdne+wojny:+Cz%C4%99%C5%9B%C4%87+IV+Nowa+nadzieja-1977-759" target="_blank" rel="noopener" style="color:var(--acc)">Star Wars: A New Hope (1977)</a> - <b>7.9</b> (approx. 354K ratings); point zero of the entire franchise - the Thrawn trilogy is still waiting for its adaptation',
        symbol:
          'a four-pointed starburst - hyperspace and the fleet: the scale of an operation, not a single fighter',
        links: [
          'foundation: hyperspace (deploy)',
          'scaling: the squadron (loops)',
          'quality: shields (hooks)',
        ],
        targetHtml:
          'pick it up when you know the films and want to see <b>how someone commands after actually doing the research on their opponent</b>.',
      },
      fundacja: {
        num: 'FOUNDATION',
        why: 'Why we love it: a plan for centuries',
        h2: 'Foundation',
        pHtml: [
          'Using psychohistory - the mathematics of vast populations - Hari Seldon calculates that the Galactic Empire will fall and the dark ages will last thirty thousand years. Instead of saving the Empire, he founds the Foundation at the edge of the galaxy, meant to shorten the chaos to a thousand years. Crises are predicted generations in advance, and the Time Vault speaks up exactly when the plan requires it.',
          'We recommend it because Isaac Asimov is the grandfather of the entire genre, and Foundation is the purest SF of ideas: few blasters, plenty of thinking on the horizon of institutions and systems. Every "plan that executes without its author" - including ours - has its prototype here.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/29579.Foundation" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.2</b> (approx. 610K ratings)',
        screenHtml:
          '<a href="https://www.filmweb.pl/serial/Fundacja-2021-856226" target="_blank" rel="noopener" style="color:var(--acc)">Foundation (Apple TV+, 2021-)</a> - <b>7.3</b> (approx. 10K ratings); a loose adaptation - it takes the ideas from the books, not the plot',
        symbol:
          'the spiral of the galaxy - the Seldon Plan: motion visible only at the scale of centuries',
        links: [
          'scaling: the Seldon Plan (goal)',
          'legacy: the domain model (DDD)',
          'teamwork: the Encyclopedia (registry)',
          'top5: a plan without its author',
        ],
        targetHtml:
          "pick it up when you want the source - <b>thinking about plans longer than one lifetime started with Seldon's psychohistory</b>.",
      },
      lem: {
        num: 'LEM',
        why: 'Why we love it: an alien that is not a mirror',
        h2: 'Solaris',
        pHtml: [
          'Stanisław Lem sends psychologist Kris Kelvin to a research station above an ocean-planet that humanity has been studying for decades with no result. The ocean does not answer signals - instead it sends the crew "visitors": materializations of their most deeply buried memories. For Kelvin, it is his dead wife. Solaristics, whole libraries of theories about the ocean, turns out to be an encyclopedia of human helplessness: for a hundred years the researchers were describing their own reflection.',
          'We recommend it because this is a first contact that is not a mirror of humanity - an alien that is genuinely alien, with no negotiation, no invasion, no translation into human categories. And there is a bit of pride in it: a Polish classic from 1961 plays in the world league on equal terms, with two famous adaptations and a place in every serious SF ranking.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/95558.Solaris" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.0</b> (approx. 138K ratings)',
        screenHtml:
          '<a href="https://www.filmweb.pl/film/Solaris-1972-32140" target="_blank" rel="noopener" style="color:var(--acc)">Solaris (Tarkovsky, 1972)</a> - <b>7.3</b> (approx. 11K ratings) · <a href="https://www.filmweb.pl/film/Solaris-2002-33510" target="_blank" rel="noopener" style="color:var(--acc)">Solaris (Soderbergh, 2002)</a> - <b>6.1</b> (approx. 31K ratings); Lem endorsed neither - he said Tarkovsky\'s version was "Crime and Punishment", not Solaris',
        symbol:
          'a symmetric ocean wave with a suspended eye - an ocean that studies the researchers: contact without understanding',
        links: [
          'legacy: probing the ocean (map)',
          'teamwork: the ocean studies the researchers (review)',
          'top5: on the side of understanding',
        ],
        targetHtml:
          'pick it up when you want to see <b>what first contact without a mirror looks like</b> - and why the whole world keeps coming back to a Polish classic from six decades ago.',
      },
      redrising: {
        num: 'RED RISING',
        why: 'Why we love it: ascent by passing as the elite',
        h2: 'Red Rising',
        pHtml: [
          'Pierce Brown starts in the helium-3 mines beneath the surface of Mars: Darrow is a Red, the lowest caste in the hierarchy of Colors, and believes his work is preparing the planet for future generations. It is a lie - Mars has long been settled, and the Reds are the slaves of its foundation. After losing his wife, Darrow lets himself be surgically rebuilt into a Gold and enters the Institute: a school for the elite whose final exam is a war between houses.',
          'We recommend it because this is Ender meets Rome on Mars: an institution that tests through cruelty, a hierarchy of Colors instead of social classes, and ascent by passing as the elite - commanding people who would kill him for his origin alone. Brown writes faster and more brutally than Card, but the question stays the same: what does winning cost, and who are you after it.',
        ],
        ratingHtml:
          '<a href="https://www.goodreads.com/book/show/15839976-red-rising" target="_blank" rel="noopener" style="color:var(--acc)">Goodreads</a> - <b>★ 4.3</b> (approx. 917K ratings)',
        screenHtml:
          '<b>none</b> - the series was officially cancelled after more than a decade in development (confirmed in 2026); the rights have been optioned for the third time and the new project is at a very early stage - the book remains the only way into this world',
        symbol:
          'a rising arrow with wings - the road from the mines to the top of the hierarchy: per aspera ad astra',
        links: ['foundation: the carving (skills)', 'teamwork: the pack (async)'],
        targetHtml:
          'pick it up when you want to see <b>Battle School for adults</b> - an institution, a hierarchy and the price of ascent in an environment that does not forgive mistakes.',
      },
    },
    strackK: 'SOUNDTRACK:',
    strackHtml:
      '<b>Footsteps of History</b> - Clinton Shorter (The Expanse, season 4). This track played on loop while 10xDevs 3.0 was being built.',
    strackOn: 'PLAY MUSIC',
    strackOff: 'STOP MUSIC',
    orbit: {
      num: 'ORBIT',
      uni: 'Closing the orbit · what next',
      h2: 'This list grows with the campaign',
      lead:
        "None of these universes made it into the campaign as decoration. Each one got in because it carries a mechanism: a trial that cannot be skipped, a plan that executes without its author, a squadron with isolated cockpits. A metaphor only works when the source is good - which is why, instead of inventing our own worlds, we borrow from books that have survived decades of readers' review. The list is not closed: future modules will keep adding new glyphs, colors and reading.",
      nextK: 'NEXT:',
      nextPre: 'the full map of metaphors and nodes lives in the ',
      nextLink: '10x Workflow documentation',
      nextPost: ' - quick search across all modules.',
    },
  },
};
