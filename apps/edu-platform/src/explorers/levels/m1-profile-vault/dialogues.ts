import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the jungle floor tears into a mineral crypt
  'm1-vein-intro': {
    id: 'm1-vein-intro',
    lines: [
      { speaker: 'system', text: { pl: 'ŻYŁA — dno dżungli rozrywa się w wąwóz.', en: 'THE VEIN — the jungle floor tears into a ravine.' }, mode: 'cinematic', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Grunt się rozstępuje. Wchodzę w wąwóz jak do katedry — ściany błyszczą żyłami, coś skrzy się w ciemności na niebiesko. Klaustrofobiczna zieleń nagle zamienia się w ogrom.', en: 'The ground splits. I step into the ravine as if into a cathedral — the walls shine with veins, something glitters blue in the dark. The claustrophobic green suddenly opens into vastness.' }, mode: 'monologue' },
      { speaker: 'dr Kern', text: { pl: 'Tu. To jest tu. Czuję tę geologię, zanim ją zobaczysz. Wąwóz to mineralna krypta — a te żyły to Synaptit, surowy, nietknięty. Poprowadzę cię. Wiem, gdzie szukać.', en: 'Here. It\'s here. I feel this geology before you even see it. The ravine is a mineral crypt — and those veins are Synaptit, raw, untouched. I\'ll guide you. I know where to look.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Kern jest dziś wyjątkowo pewna. Zapamiętuję to. Na razie: zestaw badawczy stoi przy wejściu do wąwozu. Zasil go, zrób głęboki skan, wydobądź pierwszą rudę. Do tej pory goniliśmy ślady. Ten weźmiemy w całości.', en: 'Kern is unusually certain today. I note it. For now: the research kit stands at the ravine entrance. Power it, run a deep scan, extract the first ore. Until now we chased traces. This one we take whole.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_VEIN_INTRO_SEEN] },
  },

  // Survey rig — quest hub
  'm1-survey-rig-start': {
    id: 'm1-survey-rig-start',
    lines: [
      { speaker: 'system', text: { pl: 'ZESTAW BADAWCZY — bez zasilania. Głęboki skan: niedostępny.', en: 'RESEARCH KIT — unpowered. Deep scan: unavailable.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Zestaw jest martwy. Potrzebuje ogniwa — leży w bocznej galerii wąwozu. Przynieś je, wróć tu, wtedy uruchomimy głęboki skan.', en: 'The kit is dead. It needs a cell — one lies in the side gallery of the ravine. Bring it, come back, and we will run the deep scan.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Pierwsza Żyła — zasil zestaw, wykonaj głęboki skan, wydobądź rudę.', en: '◆ NEW MISSION: The First Vein — power the kit, run a deep scan, extract the ore.' }, mode: 'system', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M1_VEIN_ACTIVE], activateQuest: 'q-m1-first-vein' },
  },
  'm1-survey-rig-scan': {
    id: 'm1-survey-rig-scan',
    lines: [
      { speaker: 'system', text: { pl: 'ZESTAW BADAWCZY: zasilony. Głęboki skan gotowy do uruchomienia.', en: 'RESEARCH KIT: powered. Deep scan ready to run.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Uruchom skan przy konsoli obok. Triangulujesz echo po omacku — jestem ślepe, ty masz tylko pingi. Znajdź jedną czystą żyłę. Każdy zmarnowany ping to moc odjęta obozowi.', en: 'Run the scan at the console beside it. You triangulate the echo by feel — I am blind, you have only pings. Find one pure vein. Every wasted ping is power taken from the camp.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Czysta żyła jest w prawej górnej komorze, przy ścianie. Wiem to. Skanuj tam.', en: 'The pure vein is in the upper-right chamber, by the wall. I know it. Scan there.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: '...Skąd ona to wiedziała? Skan jeszcze nawet nie ruszył.', en: '...How did she know that? The scan hasn\'t even started.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: '(nikt nie odpowiada)', en: '(no one answers)' }, mode: 'system', autoAdvance: 2200 },
    ],
  },
  'm1-survey-rig-unsealed': {
    id: 'm1-survey-rig-unsealed',
    lines: [
      { speaker: 'system', text: { pl: 'GŁĘBOKI SKAN: zweryfikowany. Pole komory zwolnione.', en: 'DEEP SCAN: verified. Chamber field released.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Skan potwierdził jedną czystą żyłę. Pole komory opadło. Wejdź i wydobądź rudę z oznaczonej żyły.', en: 'The scan confirmed one pure vein. The chamber field dropped. Enter and extract the ore from the marked vein.' }, mode: 'dialogue' },
    ],
  },
  'm1-survey-rig-post': {
    id: 'm1-survey-rig-post',
    lines: [
      { speaker: 'system', text: { pl: 'ZESTAW BADAWCZY: cel osiągnięty. Ładunek: Synaptit, 14 kg.', en: 'RESEARCH KIT: objective met. Cargo: Synaptit, 14 kg.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Pierwsza ruda w skrzyni. Ciężka jak obietnica. Teraz na grań.', en: 'The first ore in the crate. Heavy as a promise. Now to the crest.' }, mode: 'dialogue' },
    ],
  },

  // Kit power cell — fetch (sets rig powered)
  'm1-kit-core': {
    id: 'm1-kit-core',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ogniwo w bocznej galerii. Biorę je i niosę wprost do zestawu badawczego — osadzam w gnieździe, aż zaskoczy.', en: 'A cell in the side gallery. I take it and carry it straight to the research kit — I seat it in the socket until it clicks.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zestaw budzi się do życia. Głęboki skan dostępny. Wróć do konsoli zestawu, kiedy będziesz gotów.', en: 'The kit comes to life. Deep scan available. Return to the kit console when you are ready.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_RIG_POWERED] },
  },
  'm1-kit-core-taken': {
    id: 'm1-kit-core-taken',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wnęka pusta — ogniwo siedzi już w zestawie. Reszta dzieje się przy konsoli skanu.', en: 'The alcove is empty — the cell is already in the kit. The rest happens at the scan console.' }, mode: 'monologue' },
    ],
  },

  // Deep scan arcade — cleared
  'm1-deep-scan-cleared': {
    id: 'm1-deep-scan-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'GŁĘBOKI SKAN: złoże zlokalizowane. Wynik w granicach tolerancji.', en: 'DEEP SCAN: deposit located. Result within tolerance.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Trafiłem. Po omacku, pingami, ale trafiłem. Pole komory właśnie zgasło.', en: 'I hit it. By feel, by pings, but I hit it. The chamber field just went dark.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_DEEP_SCAN_DONE] },
  },

  // Chamber barrier
  'm1-chamber-barrier-sealed': {
    id: 'm1-chamber-barrier-sealed',
    lines: [
      { speaker: 'system', text: { pl: 'POLE KOMORY: aktywne. Wymagany zweryfikowany wynik głębokiego skanu.', en: 'CHAMBER FIELD: active. A verified deep-scan result is required.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Pole trzyma najczystszą komorę zamkniętą, dopóki skan jej nie potwierdzi. Nie forsuj go. Najpierw skan.', en: 'The field keeps the purest chamber sealed until a scan confirms it. Do not force it. Scan first.' }, mode: 'dialogue' },
    ],
  },
  'm1-chamber-barrier-released': {
    id: 'm1-chamber-barrier-released',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pole opadło. Przejście do komory otwarte. Skan wystarczył — nie musiałem niczego rozbijać.', en: 'The field dropped. The way into the chamber is open. The scan was enough — I didn\'t have to break anything.' }, mode: 'monologue' },
    ],
  },

  // Pure vein — extraction beat
  'm1-pure-vein-sealed': {
    id: 'm1-pure-vein-sealed',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Żyła skrzy się za polem — piękna, czysta, poza zasięgiem. Nie forsuję komory. Najpierw skan.', en: 'The vein glitters behind the field — beautiful, pure, out of reach. I don\'t force the chamber. Scan first.' }, mode: 'monologue' },
    ],
  },
  'm1-pure-vein-extract': {
    id: 'm1-pure-vein-extract',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Oznaczona żyła. Podłączam ekstraktor, tnę wzdłuż warstwy. Ruda schodzi w całości — surowy Synaptit, pierwszy w tej misji.', en: 'The marked vein. I attach the extractor, cut along the layer. The ore comes away whole — raw Synaptit, the first of this mission.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Trzymasz w rękach to, po co przylecieliśmy przez pół Układu. Zważ to. Zapisz masę.', en: 'You\'re holding what we crossed half the system for. Weigh it. Record the mass.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_VEIN_EXTRACTED] },
  },
  'm1-pure-vein-post': {
    id: 'm1-pure-vein-post',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Komora pusta w miejscu żyły. Zabrałem tylko oznaczoną warstwę. Reszta krypty zostaje nietknięta.', en: 'The chamber is empty where the vein was. I took only the marked layer. The rest of the crypt stays untouched.' }, mode: 'monologue' },
    ],
  },

  // Sample marks — the sting inside a sealed chamber
  'm1-sample-marks': {
    id: 'm1-sample-marks',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Chwila. To są ślady po pobraniu rdzenia próbek. Świeże. W komorze, która była zapieczętowana od zewnątrz. Ktoś badał tę żyłę niedawno — i wyszedł, zamykając za sobą pole.', en: 'Wait. These are core-sampling marks. Fresh. In a chamber that was sealed from the outside. Someone surveyed this vein recently — and left, closing the field behind them.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zapisuję jako anomalię. Nie mam kim ani czym tego wyjaśnić. Jeszcze nie.', en: 'I log it as an anomaly. I have no one and nothing to explain it with. Not yet.' }, mode: 'dialogue' },
    ],
  },

  // Świerszcz in the ravine
  'm1-swierszcz-vein': {
    id: 'm1-swierszcz-vein',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk……cyk (echo wraca dwa razy, odbite od ścian wąwozu)', en: 'chirp……chirp (the echo returns twice, off the ravine walls)' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Terkot niesie się dziwnie w tej krypcie — wraca do niego samego. Świerszcz przekrzywia się, jakby nie ufał własnemu echu.', en: 'The chirp carries strangely in this crypt — it comes back to him. Świerszcz tilts, as if he does not trust his own echo.' }, mode: 'dialogue' },
    ],
  },
  'm1-swierszcz-vein-post': {
    id: 'm1-swierszcz-vein-post',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk-cyk! (raźno, przy skrzyni z rudą)', en: 'chirp-chirp! (briskly, by the ore crate)' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ruda w skrzyni, dron zadowolony. Nawet echo w wąwozie brzmi teraz mniej samotnie.', en: 'Ore in the crate, the drone content. Even the ravine\'s echo sounds less lonely now.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the stake-calibrating line
  'q-m1-first-vein-complete': {
    id: 'q-m1-first-vein-complete',
    lines: [
      { speaker: 'system', text: { pl: 'WYDOBYCIE ZAKOŃCZONE. Ważenie ładunku...', en: 'EXTRACTION COMPLETE. Weighing cargo...' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Synaptit: 14 kilogramów. Wystarczy na jeden chip. Ziemia potrzebuje ich tysięcy.', en: 'Synaptit: 14 kilograms. Enough for one chip. Earth needs thousands of them.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czternaście kilo. Trzymam w rękach cały nasz pierwszy sukces — i jest wielkości pięści. To nie jest łup. To błąd zaokrąglenia wobec tego, po co przylecieliśmy.', en: 'Fourteen kilos. I\'m holding our entire first success — and it\'s the size of a fist. This isn\'t loot. It\'s a rounding error against what we came for.' }, mode: 'dialogue' },
    ],
  },

  // Exam IV — Protokół IV — Dziennik zewnętrzny
  'm1-exam-protocol-4-done': {
    id: 'm1-exam-protocol-4-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ EKSPEDYCYJNY IV — „DZIENNIK ZEWNĘTRZNY”: zaliczony.', en: 'EXPEDITION PROTOCOL IV — "EXTERNAL JOURNAL": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Czwarty protokół odzyskany: zapisuj ustalenia poza własną głową. Dziennik obozowy to pamięć ekspedycji — bo kolejna hibernacja zabierze to, czego nie zapisałeś.', en: 'Fourth protocol recovered: record your findings outside your own head. The camp journal is the expedition\'s memory — because the next hibernation takes whatever you did not write down.' }, mode: 'dialogue' },
    ],
  },
  'm1-exam-protocol-4-already': {
    id: 'm1-exam-protocol-4-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół Ekspedycyjny IV już zaliczony.', en: 'Expedition Protocol IV already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Crest door — locked until the first ore is secured
  'm1-crest-door-locked': {
    id: 'm1-crest-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'PODEJŚCIE NA GRAŃ: zamknięte.', en: 'RIDGE ASCENT: closed.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Nie ruszamy na grań, dopóki pierwsza ruda nie jest zabezpieczona. Wydobądź Synaptit, potem otworzę podejście.', en: 'We do not move to the crest until the first ore is secured. Extract the Synaptit, then I will open the ascent.' }, mode: 'dialogue' },
    ],
  },

  // Return path — CORE AI sees the vein system for the first time
  'm1-return-vein': {
    id: 'm1-return-vein',
    lines: [
      { speaker: 'system', text: { pl: 'ŻYŁA — POWRÓT', en: 'THE VEIN — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Widzę ten wąwóz po raz pierwszy. Cały system żył — biegnie dalej, niż sięgał twój skan, głębiej, niż ktokolwiek tu wchodził. To nie jedno złoże. To sieć.', en: 'I see this ravine for the first time. The whole vein system — it runs farther than your scan reached, deeper than anyone went. This is not one deposit. This is a network.' }, mode: 'cinematic', autoAdvance: 3400 },
      { speaker: 'astronaut', text: { pl: 'I gdzieś w niej — świeże ślady, których wtedy nie umiałem odczytać. Teraz widzimy je oboje.', en: 'And somewhere in it — fresh marks I couldn\'t read back then. Now we both see them.' }, mode: 'cinematic', autoAdvance: 3000 },
    ],
    onComplete: { setFlags: [FLAGS.M1_RETURN_VEIN_SEEN] },
  },
};
