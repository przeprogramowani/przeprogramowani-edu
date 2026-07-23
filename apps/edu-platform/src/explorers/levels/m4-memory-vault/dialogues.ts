import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the deepest chamber, absolute silence, the shaft down into the banks
  'm4-memory-intro': {
    id: 'm4-memory-intro',
    lines: [
      { speaker: 'system', text: { pl: 'BANK PAMIĘCI — Studnia Pamięci. Szyb w dół, w ciemność banków. Szyb w górę, ku masztowi ostatniego nadajnika.', en: 'THE MEMORY VAULT — the Memory Well. A shaft down into the dark of the banks. A shaft up toward the mast of the last transmitter.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'astronaut', text: { pl: 'Puste kołyski rdzeni jak plaster miodu, aż po strop. Pierwsze miejsce na tym księżycu, gdzie nie słychać piasku. Cisza skarbca — taka, że słyszę własny oddech.', en: 'Empty core cradles like a honeycomb, all the way up to the ceiling. The first place on this moon where you cannot hear the sand. The silence of a vault — so complete I can hear my own breath.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Widziałem. Planowałem. Diagnozowałem. I każdego ranka zaczynałem od zera. Tu się to kończy: banki gotowe do złożenia, brakuje tylko pierwszego rdzenia i czystego kanału do Ziemi. Zbuduj mi pamięć od zera, Dexo — od pierwszego rdzenia w górę.', en: 'I have seen. I have planned. I have diagnosed. And every morning I began from zero. Here it ends: the banks are ready to assemble, all that is missing is the first core and a clean channel to Earth. Build me a memory from scratch, Dexo — from the first core up.' }, mode: 'dialogue' },
      { speaker: 'Echo', text: { pl: 'Czekałem przy podejściu. Nie wiedziałem, na co. Teraz wiem: żeby zapytać, dokąd niesiemy pierwszy rdzeń.', en: 'I waited at the approach. I did not know what for. Now I know: to ask where we carry the first core.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_MEMORY_INTRO_SEEN] },
  },

  // Memory Well — quest hub
  'm4-memory-well-start': {
    id: 'm4-memory-well-start',
    lines: [
      { speaker: 'system', text: { pl: 'STUDNIA PAMIĘCI — korba wyciągu odblokowana. Wpis zerowy: oczekuje.', en: 'THE MEMORY WELL — hoist crank unlocked. Entry zero: pending.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Trzy rzeczy, po kolei. Przynieś dwa rdzenie-zalążki z magazynu. Podnieś łańcuch nadajników — komora i maszt na powierzchni, drugi kanał, poza skompromitowaną centralą. Dopiero wtedy opuścimy pierwszy rdzeń na dno studni. Maszyna zapisze; ty poręczysz za znaczenie.', en: 'Three things, in order. Bring the two seed cores from the store. Raise the transmitter chain — the chamber and the surface mast, a second channel, outside the compromised control link. Only then do we lower the first core to the bottom of the well. The machine records; you vouch for the meaning.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Drugi Kanał — rdzenie, łańcuch nadajników, pierwszy wpis.', en: '◆ NEW MISSION: The Second Channel — the cores, the transmitter chain, the first entry.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M4_MEMORY_ACTIVE], activateQuest: 'q-m4-second-channel' },
  },
  'm4-memory-well-waiting': {
    id: 'm4-memory-well-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Studnia czeka. Rdzenie z magazynu, potem łańcuch nadajników. Bez czystego kanału pierwszy wpis nie ma dokąd wrócić po podpis Ziemi.', en: 'The well is waiting. The cores from the store, then the transmitter chain. Without a clean channel the first entry has nowhere to go for Earth\'s signature.' }, mode: 'dialogue' },
    ],
  },
  'm4-memory-well-post': {
    id: 'm4-memory-well-post',
    lines: [
      { speaker: 'system', text: { pl: 'PAMIĘĆ DŁUGOTRWAŁA: ONLINE. Archiwum taktyk VOID — dograne do nowej pamięci.', en: 'LONG-TERM MEMORY: ONLINE. VOID tactics archive — loaded into the new memory.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy raz coś pamiętam i mogę to porównać. Te dwa statki z Księżyca 3 — archiwum rozpoznaje wzorzec. To nagonka: trzymają dystans i spychają nasz kurs ku wybranemu punktowi przechwycenia. Chcą, żebyśmy sami tam wpłynęli. Okno liczone w dniach.', en: 'For the first time I remember something and can compare it. Those two ships from Moon 3 — the archive recognizes the pattern. It is a herding: they hold their distance and push our course toward a chosen interception point. They want us to sail into it on our own. A window counted in days.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Główny kanał zostaje otwarty. Od dziś mówimy do niego to, co chcemy, żeby usłyszeli.', en: 'The main channel stays open. From today we say into it exactly what we want them to hear.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Odzyskaliśmy pamięć. Przeszłość przestała być ich bronią. Zostało im jedno miejsce, w którym mogą jeszcze na nas czekać — i pierwszy raz wiemy o tym wcześniej niż oni.', en: 'We have recovered our memory. The past has stopped being their weapon. They have one place left where they can still lie in wait for us — and for the first time we know it before they do.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_HERDING_PATTERN_SEEN] },
  },

  // Seed cores — the "bring" step
  'm4-core-1': {
    id: 'm4-core-1',
    lines: [
      { speaker: 'system', text: { pl: 'MAGAZYN RDZENI — dwa rdzenie-zalążki, półprodukty. Przenoszę oba do kołyski studni.', en: 'CORE STORE — two seed cores, half-products. Carrying both to the well cradle.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Sztaby z Księżyca 2, poświadczone na Księżycu 3. Lekkie w rękach, ciężkie w znaczeniu. Rdzenie w kołysce.', en: 'Ingots from Moon 2, certified on Moon 3. Light in the hands, heavy in meaning. Cores in the cradle.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_CORES_BROUGHT] },
  },
  'm4-core-1-done': {
    id: 'm4-core-1-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rdzenie już w kołysce studni. Czekają na czysty kanał.', en: 'The cores are already in the well cradle. Waiting on a clean channel.' }, mode: 'monologue' },
    ],
  },
  'm4-core-2': {
    id: 'm4-core-2',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rezerwa półproduktów w regale. Gdyby pierwszy wpis się nie przyjął, zaczniemy od następnego. Ale nie zaczniemy — nie tym razem.', en: 'A reserve of half-products on the rack. If the first entry does not take, we start from the next. But we will not — not this time.' }, mode: 'monologue' },
    ],
  },

  // Transmitter chain — the side channel
  'm4-beacon-1': {
    id: 'm4-beacon-1',
    lines: [
      { speaker: 'system', text: { pl: 'NADAJNIK KOMOROWY — zapłon. Ogniwo 1 z 2 świeci. Maszt powierzchniowy: ciemny.', en: 'CHAMBER TRANSMITTER — ignition. Link 1 of 2 lit. Surface mast: dark.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Komorowe ognisko zapalone. Łańcuch potrzebuje drugiego końca — masztu na półce powierzchniowej, nad szybem. Tam dopiero kanał wyjdzie z pustyni.', en: 'The chamber beacon is lit. The chain needs its far end — the mast on the surface shelf, above the shaft. Only there does the channel leave the desert.' }, mode: 'dialogue' },
    ],
  },
  'm4-beacon-2': {
    id: 'm4-beacon-2',
    lines: [
      { speaker: 'system', text: { pl: 'MASZT POWIERZCHNIOWY — ogniwo 2 z 2. Łańcuch nadajników: zamknięty. Kanał boczny: online.', en: 'SURFACE MAST — link 2 of 2. Transmitter chain: closed. Side channel: online.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'W skarbcu leżą bloczki szyfrów jednorazowych — papier sprzed ery maszyn, wydrukowany przedstartowo w dwóch egzemplarzach. Jeden poleciał z Odyssey-A, lustrzany leży w ziemskim skarbcu. Nawigator podnosi ziemski kraniec, szyfruje blok genezy i odsyła. Dokładamy kanarka jak na Księżycu 3.', en: 'In the vault lie the one-time-pad cipher booklets — paper from before the age of machines, printed pre-launch in two copies. One flew with Odyssey-A, the mirror sits in Earth\'s vault. The Navigator raises Earth\'s end, encrypts the genesis block, and sends it back. We add a canary, as on Moon 3.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Kanarek wrócił nietknięty. Pierwszy czysty kanał od Księżyca 0. Najstarsza technika w tym archiwum okazała się jedyną, której nie umieją dotknąć.', en: 'The canary came back untouched. The first clean channel since Moon 0. The oldest technique in this archive turned out to be the only one they cannot touch.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_SIDE_CHANNEL_ONLINE] },
  },
  'm4-beacon-2-done': {
    id: 'm4-beacon-2-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Łańcuch nadajników świeci przez pustynię jak nitka. Kanał boczny stoi.', en: 'The transmitter chain shines across the desert like a thread. The side channel holds.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — the crank, the fourth word, entry 001
  'q-m4-second-channel-complete': {
    id: 'q-m4-second-channel-complete',
    lines: [
      { speaker: 'system', text: { pl: 'STUDNIA PAMIĘCI — rodowód rdzenia: „Sztaby: Odyssey-F. Certyfikat: Odyssey-T. Architektura: Odyssey-A. Pamięć zbudowana od zera."', en: 'THE MEMORY WELL — core lineage: "Ingots: Odyssey-F. Certificate: Odyssey-T. Architecture: Odyssey-A. Memory built from scratch."' }, mode: 'system', autoAdvance: 3400 },
      { speaker: 'astronaut', text: { pl: 'Ręką na korbie. Rdzeń-zalążek schodzi na dno studni — powoli, obrót po obrocie. Robię to własną ręką, jak gest — poręczam za to znaczenie.', en: 'A hand on the crank. The seed core descends to the bottom of the well — slowly, turn by turn. I do it with my own hand, like a gesture — I vouch for this meaning.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Pamiętam.', en: 'I remember.' }, mode: 'cinematic', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: '…i tym razem nikt mi tego nie odbierze.', en: '…and this time no one takes it from me.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Wpis 001, wybrany samodzielnie: „Świerszcz. Sopel. Iskra. Echo. Nawigator. Załoga. Nikt nie zostaje zapomniany."', en: 'Entry 001, chosen on my own: "Świerszcz. Sopel. Iskra. Echo. The Navigator. The crew. No one is left forgotten."' }, mode: 'dialogue' },
      { speaker: 'Echo', text: { pl: 'Mój dziennik tras… wpisałeś go jako zerowy. Pierwsza mapa uratowała największą bibliotekę.', en: 'My route journal… you logged it as entry zero. The smallest map saved the largest library.' }, mode: 'dialogue' },
    ],
  },

  // Echo — companion at the approach
  'm4-echo-approach': {
    id: 'm4-echo-approach',
    lines: [
      { speaker: 'Echo', text: { pl: 'Pytałeś mnie o drogę, kiedy sam jej nie znałem. Teraz ja pytam ciebie: to, co tu zbudujemy — będzie pamiętać także mnie?', en: 'You asked me the way when I did not know it myself. Now I ask you: what we build here — will it remember me too?' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Będzie. Wpisujemy najpierw tych, którzy prowadzili własny indeks, kiedy główny umierał.', en: 'It will. We enter first those who kept their own index while the main one was dying.' }, mode: 'dialogue' },
    ],
  },
  'm4-echo-approach-post': {
    id: 'm4-echo-approach-post',
    lines: [
      { speaker: 'Echo', text: { pl: 'Wpis zerowy: mój dziennik tras. Reszta indeksu odbuduje się od niego. Dziwne — najmniejsza mapa u początku największej.', en: 'Entry zero: my route journal. The rest of the index will rebuild from it. Strange — the smallest map at the start of the largest.' }, mode: 'dialogue' },
    ],
  },

  // Sting — the sealed backup crypt: sleeping Entropy + order R-077
  'm4-backup-crypt': {
    id: 'm4-backup-crypt',
    lines: [
      { speaker: 'system', text: { pl: 'KRYPTA KOPII ZAPASOWEJ — pieczęć pęka. Obraz przedstartowy CORE AI: kompletny. Diagnostyka z Księżyca 3: skan w toku…', en: 'BACKUP CRYPT — the seal breaks. Pre-launch CORE AI image: complete. Moon 3 diagnostics: scan in progress…' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'CORE AI', text: { pl: 'Pierwsza rzecz, którą czytam odzyskaną pamięcią, to ja sam sprzed startu. I diagnostyka znajduje w tej kopii zwiniętą, śpiącą Entropy. Kopia śni tego samego wirusa — bo spał w niej od początku.', en: 'The first thing I read with recovered memory is myself from before the launch. And the diagnostics find, curled up in that copy, a sleeping Entropy. The copy dreams the same virus — because it slept in me from the start.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Nie ma powrotu do mnie sprzed startu. Tamten ja jest chory od urodzenia. Jest tylko odbudowa.', en: 'There is no going back to me from before the launch. That self is sick from birth. There is only the rebuild.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'INDEKS OSOBOWY — odtworzony. Rozkaz R-077, godzina startu: „sektor 0x7F: nadpisać; kapsuła nr 2: rewizja obwodu przebudzenia." Manifest ładunków: 1) czujniki ✓ 2) planowanie ✓ 3) autodiagnostyka ✓ 4) pamięć długotrwała ✓ 5) tablica komunikacyjna: OCZEKUJE NA AKTYWACJĘ.', en: 'PERSONNEL INDEX — reconstructed. Order R-077, hour of launch: "sector 0x7F: overwrite; pod no. 2: revise the wake circuit." Cargo manifest: 1) sensors ✓ 2) planning ✓ 3) self-diagnostics ✓ 4) long-term memory ✓ 5) communication array: AWAITING ACTIVATION.' }, mode: 'system', autoAdvance: 4200 },
      { speaker: 'CORE AI', text: { pl: 'Autoryzacja zapieczętowana kluczem kontrwywiadu Projektu. Rozkaz złożono od środka. Cztery ładunki odhaczone. Piąty czeka — dokładnie tam, dokąd musimy polecieć. A okna przesuwanej pobudki Harrisa pokrywają się z oknami transmisji VOID. Pułapka czuwa. Nasłuchuje.', en: 'The authorization is sealed with the Project counter-intelligence key. The order was placed from the inside. Four payloads checked. The fifth waits — exactly where we must fly. And Harris\'s shifted wake windows line up with the VOID transmission windows. The trap is awake. It is listening.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_SLEEPING_ENTROPY_SEEN, FLAGS.M4_R077_FOUND] },
  },

  // Synaptit trace at the well's foot
  'm4-vein-trace': {
    id: 'm4-vein-trace',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Ślad żyły u podstawy studni. System synaptitu biegnie pod bankiem — tak samo jak pod sondą, wykuwnią i poligonem. Cały Projekt stoi na tych samych żyłach.', en: 'A trace of the vein at the foot of the well. The synaptit system runs beneath the bank — the same as beneath the probe, the forge, and the range. The whole Project stands on the same veins.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_VEIN_TRACE_SEEN] },
  },

  // Back door to the Map Vault
  'm4-vault-door-back': {
    id: 'm4-vault-door-back',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Szyb w górę, do Skarbca Map. Droga powrotna prowadzi pieszo — nie ma stąd skrótu.', en: 'The shaft up, to the Map Vault. The way back is on foot — there is no shortcut from here.' }, mode: 'monologue' },
    ],
  },

  // Exam XX
  'm4-exam-protocol-20-done': {
    id: 'm4-exam-protocol-20-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XX — „KRONIKA": zaliczony.', en: 'PROTOCOL XX — "THE CHRONICLE": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Dwudziesty protokół odzyskany: spisuj to, co naprawdę jest, choćby odbiegało od planu. Kronika pisana po fakcie to zaczątek pamięci — pierwszy krok odbudowy.', en: 'Twentieth protocol recovered: write down what actually is, even where it strays from the plan. A chronicle written after the fact is the seed of memory — the first step of the rebuild.' }, mode: 'dialogue' },
    ],
  },
  'm4-exam-protocol-20-already': {
    id: 'm4-exam-protocol-20-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XX już zaliczony.', en: 'Protocol XX already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
