/**
 * Slownik strony "Dziennik pokladowy" (log/BackstoryBody) - pilot architektury
 * i18n calego portalu. Struktura kluczy odzwierciedla kolejnosc sekcji w body;
 * pola *Html zawieraja inline markup (strong/b/span sf-only) i renderuja sie
 * przez set:html. Zmiana tresci = zmiana OBU jezykow w tym pliku.
 */

import type { Lang } from './index';

interface LogEntry {
  num: string;
  uniSf: string;
  uniNeutral: string;
  h2: string;
  /** Kolejne akapity .lead sekcji (inline markup dozwolony). */
  pHtml: string[];
}

interface LogDict {
  eyebrow: string;
  h1Html: string;
  subHtml: string;
  svgAria: string;
  svgNodeAria: { attempts: string; stop: string; model: string; portal: string };
  svg: {
    weeks: string;
    weeksSub: string;
    attempts: [string, string, string];
    stop: string;
    stopSub: string;
    t0: string;
    t0Sub: string;
    t24: string;
    portal: string;
  };
  mapCapPre: string;
  mapCapSf: string;
  mapCapNeutral: string;
  mapCapPost: string;
  routeAria: string;
  route: [string, string, string, string, string];
  e1: LogEntry;
  e2: LogEntry;
  e3: LogEntry & { epigraphSf: string; epigraphCiteSf: string };
  e4: LogEntry;
  e5: LogEntry;
  mech: {
    bridgeDtSf: string;
    bridgeDtNeutral: string;
    bridgeLinkSf: string;
    bridgeLinkNeutral: string;
    bridgeRest: string;
    methodDt: string;
    methodLink: string;
    methodRest: string;
    themeDt: string;
    themeLink: string;
    themeRest: string;
  };
  targetK: string;
  targetHtml: string;
  finisHtml: string;
  finisCiteSf: string;
  finisCiteNeutral: string;
}

export const LOG: Record<Lang, LogDict> = {
  pl: {
    eyebrow: 'DZIENNIK POKŁADOWY // BACKSTORY',
    h1Html: 'Jak powstał <span class="glow">ten portal</span>',
    subHtml:
      'Wersja krótka: w <strong>24 godziny</strong>, na urlopie na Teneryfie. Wersja pełna: <strong>kilka tygodni podejść, które nie klikały</strong>, spore zmęczenie i nowy model, który spiął to wszystko w całość. Poniżej zapis, jak było naprawdę - bez lukru i bez legendy założycielskiej. Zapis prowadzi Marcin.',
    svgAria:
      'Oś czasu jak zapis dziennika pokładowego: trzy przygaszone węzły nieudanych podejść do cheatsheetów w tygodniach przed wyjazdem, węzeł postoju na Teneryfie, start pracy z modelem Fable 5 i jasny węzeł portalu 24 godziny później',
    svgNodeAria: {
      attempts: 'Wpis 01: tygodnie cheatsheetów - nieudane podejścia przed wyjazdem',
      stop: 'Wpis 02: postój - urlop na Teneryfie',
      model: 'Wpis 03: nowy model Claude Fable 5 - start pracy nad portalem',
      portal: 'Wpis 05: portal gotowy po 24 godzinach - puenta zapisu',
    },
    svg: {
      weeks: 'TYGODNIE 0',
      weeksSub: 'CHEATSHEETY // BEZ DOWIEZIENIA',
      attempts: ['PODEJŚCIE 01', 'PODEJŚCIE 02', 'PODEJŚCIE 03'],
      stop: 'POSTÓJ',
      stopSub: 'TENERYFA // URLOP',
      t0: 'T+0',
      t0Sub: 'NOWY MODEL // FABLE 5',
      t24: 'T+24H',
      portal: 'PORTAL',
    },
    mapCapPre: 'LOG // KLIKNIJ WĘZEŁ, BY ',
    mapCapSf: 'DOLECIEĆ',
    mapCapNeutral: 'PRZEJŚĆ',
    mapCapPost: ' DO WPISU',
    routeAria: 'Wpisy dziennika',
    route: ['01 · cheatsheety', '02 · tło', '03 · przełamanie', '04 · sci-fi', '05 · puenta'],
    e1: {
      num: 'WPIS 01',
      uniSf: 'ZAPIS POKŁADOWY · TYGODNIE PRZED STARTEM',
      uniNeutral: 'KILKA TYGODNI WCZEŚNIEJ',
      h2: 'Cheatsheety, które nie klikały',
      pHtml: [
        'Ten portal nie zaczął się od portalu. Zaczął się od cheatsheetów - ściąg dla studentów kursu, które miały zebrać najważniejsze rzeczy z lekcji w jednym miejscu. Prosty pomysł. Kilka tygodni podejść i żadne nie kliknęło.',
        'Co konkretnie nie działało: <strong>za dużo formatów naraz</strong> - każde podejście wyglądało inaczej i żadne nie wygrywało. <strong>Za mało energii</strong>, żeby którekolwiek doprowadzić do końca. I <strong>kontekst, który się rozjeżdżał</strong> - kolejne próby zaczynały od zera, zamiast budować na poprzednich.',
        'Materiału nie brakowało - wręcz przeciwnie. Brakowało formy, która by go udźwignęła, i sił, żeby jej szukać. Po drodze zostawał tylko rosnący folder szkiców i notatek. Zapamiętaj ten folder, wróci w tej historii.',
      ],
    },
    e2: {
      num: 'WPIS 02',
      uniSf: 'ZAPIS POKŁADOWY · STAN REAKTORA',
      uniNeutral: 'TŁO',
      h2: 'Zbiornik na rezerwie',
      pHtml: [
        'Krótko o tle, bo bez niego ta historia nie ma sensu. To był intensywny okres, zawodowo i prywatnie - dużo zmian naraz, dużo rzeczy na głowie. Energii zostawało mniej, niż wymagał materiał tego kalibru.',
        'Z tej perspektywy nieudane podejścia do cheatsheetów nie były zagadką. Nie zawiodła metoda - zawiodło paliwo. Da się pchać projekt na rezerwie, ale nie da się na rezerwie wymyślić dobrej formy dla trudnego materiału.',
        'Decyzja okazała się prosta: urlop. Teneryfa, bez planu na produktywność. Cheatsheety zostały na dysku jako folder nieudanych podejść - i tyle.',
      ],
    },
    e3: {
      num: 'WPIS 03',
      uniSf: 'ZAPIS POKŁADOWY · T+0 DO T+24H',
      uniNeutral: 'PRZEŁAMANIE',
      h2: 'Teneryfa, Fable 5, 24 godziny',
      epigraphSf:
        '„Zapis z pokładu: nowy napęd na stanie. Stary ładunek, spisany na straty, okazał się paliwem."',
      epigraphCiteSf: '- dziennik pokładowy, wpis poranny',
      pHtml: [
        'Przełamanie przyszło z nowym modelem: <strong>Claude Fable 5</strong> od Anthropic. Usiadłem do niego na urlopie, już z naładowanym zbiornikiem, i zamiast wracać do kolejnej wersji cheatsheeta, spróbowałem czegoś innego.',
        'I tu jest sedno tej historii: <strong>cały kontekst z tygodni nieudanych prób nagle przestał być balastem</strong>. Notatki, szkice, odrzucone formaty - wszystko to stało się paliwem dla zupełnie nowej rzeczy. Nie kolejnej ściągi, tylko kompleksowej prezentacji całego kursu 10xDevs. Tego portalu, który właśnie czytasz.',
        'Od startu do działającej całości minęły <strong>24 godziny</strong>. Nie dlatego, że 24 godziny wystarczą na taki portal - tylko dlatego, że tygodnie wcześniej, choć nie dowiozły ani jednego cheatsheeta, dowiozły coś cenniejszego: przemyślany, przetrawiony materiał, gotowy do użycia w chwili, gdy pojawiło się narzędzie, które umiało go unieść.',
      ],
    },
    e4: {
      num: 'WPIS 04',
      uniSf: 'ZAPIS POKŁADOWY · SKĄD TEN STATEK',
      uniNeutral: 'SKĄD TEN KLIMAT',
      h2: 'Czemu to wszystko wygląda jak statek kosmiczny',
      pHtml: [
        'Jedno w tej pracy było czystą frajdą: klimat. Od lat czytam sci-fi i ten portal jest tego bezpośrednim skutkiem - nie strategią marketingową, tylko konwencją, w której po prostu dobrze się opowiada o systemach, załogach i długich misjach.',
        'Historia o tym, jak powstał, też dostała tę konwencję: dziennik pokładowy, wpisy, postój w porcie. <span class="sf-only">Ale sama historia jest w stu procentach prawdziwa i czyta się ją tak samo z wyłączonym trybem sci-fi - przełącznik masz w nawigacji.</span><span class="neutral-only">Ale sama historia jest w stu procentach prawdziwa - czytasz ją właśnie w trybie neutralnym i niczego jej nie brakuje.</span>',
      ],
    },
    e5: {
      num: 'WPIS 05',
      uniSf: 'ZAPIS POKŁADOWY · RAPORT KOŃCOWY',
      uniNeutral: 'PUENTA',
      h2: 'To jest teza kursu, w praktyce',
      pHtml: [
        'Bez lukru: <strong>nieudane tygodnie nie były stratą - były researchem</strong>. Tylko nie wyglądały jak research, dopóki nie pojawiło się narzędzie, które umiało z niego skorzystać.',
        'Przełamanie nie wzięło się z jednej rzeczy, tylko z trzech naraz: <strong>odpoczynku</strong>, <strong>gotowego kontekstu</strong> i <strong>nowego modelu</strong>. Zabierz którąkolwiek - i tej strony by nie było. Sam model, bez tygodni materiału, wygenerowałby coś ładnego i pustego. Sam materiał, bez sił i bez narzędzia, dalej leżałby w folderze.',
        'I to jest dokładnie to, czego uczy ten kurs: <strong>kontekst jako artefakty na dysku plus iteracja z agentem</strong>. Nie dlatego, że ładnie brzmi w materiałach - tylko dlatego, że dokładnie tak powstało to, co właśnie czytasz. Ten portal jest żywym dowodem własnej tezy.',
      ],
    },
    mech: {
      bridgeDtSf: 'mostek',
      bridgeDtNeutral: 'mapa',
      bridgeLinkSf: 'Wróć na mostek',
      bridgeLinkNeutral: 'Zobacz mapę portalu',
      bridgeRest: ' - pełna mapa tego, co powstało w te 24 godziny',
      methodDt: 'metoda',
      methodLink: 'Core Skills Chain',
      methodRest: ' - ten sam mechanizm „kontekst + iteracja", rozpisany na pięć kroków',
      themeDt: 'motyw',
      themeLink: 'Motyw sci-fi',
      themeRest: ' - skąd dokładnie te odniesienia: dziesięć uniwersów, ich kolory i powody',
    },
    targetK: 'CEL:',
    targetHtml:
      'jeśli masz za sobą własne „nieudane tygodnie" - <b>nie kasuj folderu</b>. To może być najlepszy kontekst, jaki kiedykolwiek przygotujesz.',
    finisHtml:
      '„Najlepsza doba pracy w tym roku zaczęła się od kilku tygodni, które wyglądały jak porażka, i od tygodnia, w którym nie pracowałem wcale."',
    finisCiteSf: '- dziennik pokładowy, ostatni wpis przed powrotem. Koniec zapisu',
    finisCiteNeutral: '- notatka z końca urlopu',
  },
  en: {
    eyebrow: "CAPTAIN'S LOG // BACKSTORY",
    h1Html: 'How <span class="glow">this portal</span> was built',
    subHtml:
      'The short version: in <strong>24 hours</strong>, on vacation in Tenerife. The full version: <strong>weeks of attempts that never clicked</strong>, a fair amount of fatigue, and a new model that pulled it all together. Below is the record of how it actually went - no varnish and no founding legend. Marcin keeps this log.',
    svgAria:
      "Timeline styled as a captain's log: three dimmed nodes of failed cheat-sheet attempts in the weeks before the trip, a layover node in Tenerife, the start of work with the Fable 5 model, and a bright portal node 24 hours later",
    svgNodeAria: {
      attempts: 'Entry 01: the cheat-sheet weeks - failed attempts before the trip',
      stop: 'Entry 02: layover - vacation in Tenerife',
      model: 'Entry 03: the new Claude Fable 5 model - work on the portal begins',
      portal: 'Entry 05: portal ready after 24 hours - the takeaway of this log',
    },
    svg: {
      weeks: 'WEEKS 0',
      weeksSub: 'CHEAT SHEETS // NOT SHIPPED',
      attempts: ['ATTEMPT 01', 'ATTEMPT 02', 'ATTEMPT 03'],
      stop: 'LAYOVER',
      stopSub: 'TENERIFE // VACATION',
      t0: 'T+0',
      t0Sub: 'NEW MODEL // FABLE 5',
      t24: 'T+24H',
      portal: 'PORTAL',
    },
    mapCapPre: 'LOG // CLICK A NODE TO ',
    mapCapSf: 'FLY',
    mapCapNeutral: 'JUMP',
    mapCapPost: ' TO AN ENTRY',
    routeAria: 'Log entries',
    route: ['01 · cheat sheets', '02 · background', '03 · breakthrough', '04 · sci-fi', '05 · takeaway'],
    e1: {
      num: 'ENTRY 01',
      uniSf: 'LOG ENTRY · WEEKS BEFORE LAUNCH',
      uniNeutral: 'A FEW WEEKS EARLIER',
      h2: 'Cheat sheets that never clicked',
      pHtml: [
        'This portal did not start as a portal. It started as cheat sheets - study aids meant to gather the most important parts of each lesson in one place. A simple idea. Several weeks of attempts, and none of them clicked.',
        'What specifically failed: <strong>too many formats at once</strong> - every attempt looked different and none was winning. <strong>Too little energy</strong> to carry any of them across the finish line. And <strong>context that kept drifting apart</strong> - each new try started from zero instead of building on the previous ones.',
        'There was no shortage of material - quite the opposite. What was missing was a form that could carry it, and the energy to keep looking for one. All that piled up along the way was a growing folder of drafts and notes. Remember that folder; it comes back in this story.',
      ],
    },
    e2: {
      num: 'ENTRY 02',
      uniSf: 'LOG ENTRY · REACTOR STATUS',
      uniNeutral: 'BACKGROUND',
      h2: 'Running on reserve',
      pHtml: [
        'A word about the background, because the story makes no sense without it. It was an intense stretch, professionally and personally - a lot of changes at once, a lot on my plate. There was less energy left than material of this caliber demanded.',
        'Seen from there, the failed cheat-sheet attempts were no mystery. The method did not fail - the fuel did. You can push a project while running on reserve, but you cannot invent a good form for hard material on reserve.',
        'The decision turned out to be simple: vacation. Tenerife, with no productivity agenda. The cheat sheets stayed on disk as a folder of failed attempts - and that was that.',
      ],
    },
    e3: {
      num: 'ENTRY 03',
      uniSf: 'LOG ENTRY · T+0 TO T+24H',
      uniNeutral: 'BREAKTHROUGH',
      h2: 'Tenerife, Fable 5, 24 hours',
      epigraphSf:
        '"Log entry: new drive on board. The old cargo, written off as a loss, turned out to be fuel."',
      epigraphCiteSf: "- captain's log, morning entry",
      pHtml: [
        'The breakthrough came with a new model: <strong>Claude Fable 5</strong> from Anthropic. I sat down with it on vacation, tank finally recharged, and instead of returning to yet another cheat-sheet revision, I tried something else.',
        'And here is the heart of this story: <strong>all the context from weeks of failed attempts suddenly stopped being dead weight</strong>. Notes, drafts, rejected formats - all of it became fuel for something entirely new. Not another cheat sheet, but a comprehensive presentation of the whole 10xDevs course. The very portal you are reading.',
        'From start to a working whole took <strong>24 hours</strong>. Not because 24 hours is enough for a portal like this - but because the weeks before, though they never shipped a single cheat sheet, shipped something more valuable: material that had been thought through and digested, ready to use the moment a tool appeared that could carry it.',
      ],
    },
    e4: {
      num: 'ENTRY 04',
      uniSf: 'LOG ENTRY · WHY THE SHIP',
      uniNeutral: 'WHY THE VIBE',
      h2: 'Why all of this looks like a spaceship',
      pHtml: [
        'One part of this work was pure fun: the vibe. I have been reading sci-fi for years, and this portal is a direct consequence of that - not a marketing strategy, just a convention that happens to be great for telling stories about systems, crews and long missions.',
        "The story of how it was built got the same convention: a captain's log, entries, a layover in port. <span class=\"sf-only\">But the story itself is one hundred percent true and reads just as well with the sci-fi mode off - the toggle is in the navigation.</span><span class=\"neutral-only\">But the story itself is one hundred percent true - you are reading it in neutral mode right now and it is not missing a thing.</span>",
      ],
    },
    e5: {
      num: 'ENTRY 05',
      uniSf: 'LOG ENTRY · FINAL REPORT',
      uniNeutral: 'TAKEAWAY',
      h2: 'This is the course thesis, in practice',
      pHtml: [
        'No varnish: <strong>the failed weeks were not a loss - they were research</strong>. They just did not look like research until a tool appeared that could make use of them.',
        'The breakthrough did not come from one thing, but from three at once: <strong>rest</strong>, <strong>ready context</strong> and <strong>a new model</strong>. Remove any one of them - and this page would not exist. The model alone, without weeks of material, would have generated something pretty and empty. The material alone, without energy and without the tool, would still be sitting in a folder.',
        'And that is exactly what this course teaches: <strong>context as artifacts on disk, plus iteration with an agent</strong>. Not because it sounds good in course materials - but because that is precisely how the thing you are reading came to be. This portal is living proof of its own thesis.',
      ],
    },
    mech: {
      bridgeDtSf: 'bridge',
      bridgeDtNeutral: 'map',
      bridgeLinkSf: 'Back to the bridge',
      bridgeLinkNeutral: 'See the portal map',
      bridgeRest: ' - the full map of what was built in those 24 hours',
      methodDt: 'method',
      methodLink: 'Core Skills Chain',
      methodRest: ' - the same "context + iteration" mechanism, laid out in five steps',
      themeDt: 'theme',
      themeLink: 'The sci-fi theme',
      themeRest: ' - where exactly the references come from: ten universes, their colors and reasons',
    },
    targetK: 'GOAL:',
    targetHtml:
      'if you have your own "failed weeks" behind you - <b>do not delete the folder</b>. It may be the best context you will ever prepare.',
    finisHtml:
      '"The best 24 hours of work this year started with a few weeks that looked like failure, and with a week in which I did not work at all."',
    finisCiteSf: "- captain's log, last entry before the return. End of record",
    finisCiteNeutral: '- a note from the end of the vacation',
  },
};
