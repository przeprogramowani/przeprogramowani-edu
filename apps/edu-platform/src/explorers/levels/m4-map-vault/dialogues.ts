import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — an underground canyon of shelves; the scale jumps to cathedral
  'm4-vault-intro': {
    id: 'm4-vault-intro',
    lines: [
      { speaker: 'system', text: { pl: 'SKARBIEC MAP — podziemny kanion regałów. Mostki i wyciągi nad przepaścią akt. Na dnie: stożki piasku.', en: 'THE MAP VAULT — an underground canyon of shelves. Bridges and lifts over a chasm of files. On the floor: cones of sand.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Znowu skala rośnie o rząd. Półki jak ściany skalne, a za skarbcem galerie złóż — żyły Synaptitu skrzą się w ścianach wyrobisk, do których zawalone korytarze trzeba dopiero skartować. Nie wejdziemy tam po omacku.', en: 'The scale jumps an order again. Shelves like rock walls, and beyond the vault the deposit galleries — Synaptit veins glittering in the dig walls, reached only through collapsed corridors I still have to map. We are not going in there blind.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Czwarty szczebel misji materiałowej. Znalazłeś, przetopiłeś, poręczyłeś. Tu — zmapujesz. Ze skrzydła geologicznego i żywych skanów powstanie Mapa Główna Złóż Pasa. Pierwsza wypłata, która waży mniej, niż znaczy.', en: 'The fourth rung of the material mission. You found, smelted, vouched. Here — you map. From the geological wing and live scans we build the Master Deposit Map of the Belt. The first payload that weighs less than it means.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Schodzę do skarbca. Pierwszy raz. — Prowadzę kwerendę własnej ekspertyzy. Nie pytaj po co. Jeszcze nie.', en: 'I am going down to the vault. For the first time. — I am running a query on my own survey. Do not ask what for. Not yet.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_VAULT_INTRO_SEEN] },
  },

  // Map head — quest hub
  'm4-map-head-start': {
    id: 'm4-map-head-start',
    lines: [
      { speaker: 'system', text: { pl: 'GŁOWICA SKARBCA — online. Kompilator mapy: gotowy. Wejścia: 0 z 3.', en: 'VAULT HEAD — online. Map compiler: ready. Inputs: 0 of 3.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Kompilator czeka na trzy źródła: przedstartową ekspertyzę Kern, żywy skan galerii i certyfikaty czystości z Księżyca 3. Najpierw zasil wyciągi, potem skartuj zawalone galerie przy konsoli „Kartograf". Mapa przed maszynami.', en: 'The compiler waits on three sources: Kern\'s pre-launch survey, a live scan of the galleries, and the purity certificates from Moon 3. First power the lifts, then map the collapsed galleries at the Cartograph console. A map before the machines.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Pierwsza Mapa — zasilenie, kartowanie, kompilacja.', en: '◆ NEW MISSION: The First Map — power, mapping, compile.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M4_MAP_ACTIVE], activateQuest: 'q-m4-first-map' },
  },
  'm4-map-head-waiting': {
    id: 'm4-map-head-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Kompilacja wstrzymana. Brakuje żywego skanu galerii. Zasil wyciągi i skartuj korytarze przy „Kartografie" — dopiero wtedy złożę Mapę Główną.', en: 'Compile on hold. The live gallery scan is missing. Power the lifts and map the corridors at the Cartograph — only then do I assemble the Master Map.' }, mode: 'dialogue' },
    ],
  },
  'm4-map-head-post': {
    id: 'm4-map-head-post',
    lines: [
      { speaker: 'system', text: { pl: 'GŁOWICA SKARBCA: Mapa Główna Złóż — skompilowana. Pozycji: 4 748.', en: 'VAULT HEAD: Master Deposit Map — compiled. Entries: 4,748.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Mapa stoi. Współrzędne dla statków, które przylecą po nas — sama droga do ładunku, którą mogą przebyć. Lżejsza od jednej sztaby, cięższa od całej ładowni.', en: 'The map holds. Coordinates for the ships that come after us — the road to the cargo, ready to be traveled. Lighter than a single ingot, heavier than a whole hold.' }, mode: 'dialogue' },
    ],
  },

  // Lifts power line
  'm4-lifts-power': {
    id: 'm4-lifts-power',
    lines: [
      { speaker: 'system', text: { pl: 'CIĄG ZASILAJĄCY: odkopany. Wyciągi i taśmociąg urobku — online.', en: 'POWER LINE: dug out. Lifts and ore conveyor — online.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Wyciągi drgnęły pierwszy raz od lat. Teraz kanion oddycha. Zostaje kartografia — bez niej nie puszczę tu żadnej gąsienicy.', en: 'The lifts twitched for the first time in years. Now the canyon breathes. The cartography is left — without it I send no crawler down here.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_LIFTS_POWERED] },
  },
  'm4-lifts-power-done': {
    id: 'm4-lifts-power-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wyciągi trzymają. Zasilanie stabilne.', en: 'The lifts hold. Power steady.' }, mode: 'monologue' },
    ],
  },

  // Cartograph arcade — first clear maps the galleries
  'm4-cartograph-cleared': {
    id: 'm4-cartograph-cleared',
    lines: [
      { speaker: 'system', text: { pl: 'KARTOGRAF: topologia galerii odtworzona. Trasa dla gąsienic: wytyczona.', en: 'CARTOGRAPH: gallery topology reconstructed. Crawler route: plotted.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Odrzuciłeś fragmenty starego planu, które nie łączyły się z niczym. Mapa opisuje galerie takie, jakie istnieją dziś w skale. Wróć do głowicy — skompiluję Mapę Główną.', en: 'You rejected the old-plan fragments that connected to nothing. The map describes the galleries as they exist today in the rock. Return to the head — I will compile the Master Map.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_GALLERIES_MAPPED] },
  },

  // Quest completion — the payload that weighs less than it means
  'q-m4-first-map-complete': {
    id: 'q-m4-first-map-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ MAPA GŁÓWNA ZŁÓŻ — SKOMPILOWANA. Trzy źródła zbieżne. Pozycji: 4 748.', en: '◆ MASTER DEPOSIT MAP — COMPILED. Three sources converge. Entries: 4,748.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Ekspertyza Kern, żywy skan i certyfikaty z Księżyca 3 zeszły się w jednej warstwie. Ładownia: cztery tony. Mapa: 4 748 potwierdzonych złóż dla statków, które przylecą po nas.', en: 'Kern\'s survey, the live scan, and the Moon 3 certificates met in one layer. The hold: four tonnes. The map: 4,748 confirmed deposits for the ships that come after us.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Pierwszy raz wieziemy więcej, niż ważymy.', en: 'For the first time we carry more than we weigh.' }, mode: 'dialogue' },
    ],
  },

  // Kern — physically in the geological wing, staged
  'm4-kern-vault': {
    id: 'm4-kern-vault',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Skrzydło geologiczne. Znam tu każdą półkę z pamięci — a przynajmniej tak myślałam. Idź kartować galerie; ja przekopię ekspertyzy.', en: 'The geological wing. I know every shelf here from memory — or so I thought. Go map the galleries; I will dig through the surveys.' }, mode: 'dialogue' },
    ],
  },
  'm4-kern-vault-mapping': {
    id: 'm4-kern-vault-mapping',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Kartuj dokładnie. Stary plan tego skrzydła jest w archiwum, ale połowa korytarzy z niego już nie istnieje. Dokumentacja opisuje budynek, którego nie ma.', en: 'Map carefully. The old plan of this wing is in the archive, but half its corridors no longer exist. The documentation describes a building that is gone.' }, mode: 'dialogue' },
    ],
  },
  'm4-kern-vault-file': {
    id: 'm4-kern-vault-file',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Nadal nie śpię przez tę jedną wartość. Albo pamiętam własną ekspertyzę źle, albo ktoś ją poprawił w archiwum, które nigdy nie było online. Nie wiem, co gorsze.', en: 'I still cannot sleep over that one value. Either I remember my own survey wrong, or someone edited it in an archive that was never online. I do not know which is worse.' }, mode: 'dialogue' },
    ],
  },
  'm4-kern-vault-post': {
    id: 'm4-kern-vault-post',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Mapa Główna stoi. Moja ekspertyza w niej — poza tą jedną liczbą, która mnie prześladuje. Reszta się zgadza. Może to tylko ja.', en: 'The Master Map holds. My survey is in it — except for that one number that haunts me. The rest checks out. Maybe it is only me.' }, mode: 'dialogue' },
    ],
  },

  // Sting 1 — the medbay index cut
  'm4-medbay-access': {
    id: 'm4-medbay-access',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rejestr dostępu skrzydła osobowego. Jedno otwarcie — po śmierci stacji. Klucz główny Odyssey. Niczego nie zabrano.', en: 'The personnel wing access log. One opening — after the station died. Odyssey master key. Nothing taken.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Poza jednym: indeks jednej szuflady. „Załoga — sekcja medyczna". Zawartość została — zniknął sam indeks. Ktoś wiedział, że wystarczy zabrać drogę.', en: 'Except one thing: the index of a single drawer. "Crew — medical section." The contents stayed — the index alone is gone. Someone knew it was enough to take the road.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Metoda Entropy w ludzkim wykonaniu. Akta sekcji medycznej zostały nietknięte — skasowali drogę do nich. Zapisuję. Nie tłumaczę.', en: 'Entropy\'s method by a human hand. The medical section\'s files are untouched — they erased the road to them. I am logging it. I am not explaining it.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_MEDBAY_INDEX_SEEN] },
  },
  'm4-medbay-access-seen': {
    id: 'm4-medbay-access-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ten sam rejestr. Zabrali sam indeks sekcji medycznej, a akta zostały na miejscu. Wciąż nie wiem kto — ale zrobiła to czyjaś ręka, i to celowo.', en: 'The same log. They took the medical section\'s index alone, and the files stayed in place. I still do not know who — but a hand did this, and did it on purpose.' }, mode: 'monologue' },
    ],
  },

  // Sting 2 — Kern's own case file mismatch
  'm4-kern-file': {
    id: 'm4-kern-file',
    lines: [
      { speaker: 'system', text: { pl: 'KANISTER AKTOWY — ekspertyza złóż, autor: dr M. Kern. Wersja archiwalna.', en: 'FILE CANISTER — deposit survey, author: Dr M. Kern. Archived version.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'dr Kern', text: { pl: 'Moja teczka. Wersja z archiwum różni się od tej, którą pamiętam — jedną wartością. Tą samą, którą na Księżycu 3 podałam z pamięci co do miejsca po przecinku.', en: 'My case file. The archived version differs from the one I remember — by one value. The same one I quoted from memory on Moon 3, to the decimal place.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Któraś z nas kłamie. Ja albo moja teczka. A archiwum nigdy nie było online — kto by je redagował i kiedy?', en: 'One of us is lying. Me or my file. And the archive was never online — who would edit it, and when?' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Moreau tym razem nie pyta. Słyszę tylko, jak przewraca kartkę notesu.', en: 'Moreau does not ask this time. I only hear her turn a page of the notebook.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_KERN_FILE_MISMATCH_SEEN] },
  },
  'm4-kern-file-seen': {
    id: 'm4-kern-file-seen',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Nie dotykam jej więcej. Jedna wartość. Albo moja pamięć, albo ktoś, kto sięgnął do akt, do których nie da się sięgnąć. Jak Dexo. Może jak Dexo.', en: 'I will not touch it again. One value. Either my memory, or someone who reached files that cannot be reached. Like Dexo. Maybe like Dexo.' }, mode: 'dialogue' },
    ],
  },

  // Synaptit veins in the gallery walls
  'm4-vault-vein': {
    id: 'm4-vault-vein',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Żyła Synaptitu w ścianie wyrobiska. Na Księżycu 1 tropiłem jedną, na Księżycu 3 stałem w ich lesie. Tu robię z nimi następny krok — nanoszę każdą na mapę.', en: 'A Synaptit vein in the dig wall. On Moon 1 I tracked one, on Moon 3 I stood in a forest of them. Here I take the next step with them — I put each one on the map.' }, mode: 'dialogue' },
    ],
  },

  // Echo companion
  'm4-echo-vault': {
    id: 'm4-echo-vault',
    lines: [
      { speaker: 'Echo', text: { pl: 'Pytanie, Dexo: dokąd prowadzi ta galeria? Sprawdziłem w dzienniku. Prowadzi do żyły. Lubię, kiedy droga jest zapisana.', en: 'A question, Dexo: where does this gallery lead? I checked the journal. It leads to a vein. I like it when the road is written down.' }, mode: 'dialogue' },
    ],
  },
  'm4-echo-vault-post': {
    id: 'm4-echo-vault-post',
    lines: [
      { speaker: 'Echo', text: { pl: 'Mapa Główna gotowa. Zapisałem ją u siebie — na wszelki wypadek. Dwie kopie drogi to o jedną mniej okazji, żeby ją komuś zabrać.', en: 'The Master Map is done. I saved it on my side — just in case. Two copies of the road are one fewer chance for someone to take it away.' }, mode: 'dialogue' },
    ],
  },

  // Locked door to the memory vault
  'm4-memory-door-locked': {
    id: 'm4-memory-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'ŚLUZA GALERII: zamknięta. Brak skompilowanej mapy złóż.', en: 'GALLERY AIRLOCK: sealed. No compiled deposit map.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Studnia Pamięci wpuszcza dopiero, gdy masz mapę drogi. Najpierw Mapa Główna, potem najgłębsza komora.', en: 'The Memory Well admits you only once you hold the map of the road. First the Master Map, then the deepest chamber.' }, mode: 'dialogue' },
    ],
  },

  // Exam XIX
  'm4-exam-protocol-19-done': {
    id: 'm4-exam-protocol-19-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XIX — „PRZEPRAWA": zaliczony.', en: 'PROTOCOL XIX — "THE CROSSING": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Dziewiętnasty protokół odzyskany: przenoś komorę po komorze, z pieczęcią i sprawdzeniem po każdej. Eksploracja kończy się raportem opcji — kierunek wybiera człowiek, dopiero potem wchodzą maszyny.', en: 'Nineteenth protocol recovered: carry chamber by chamber, with a seal and a check after each. Exploration ends in a report of options — the human picks the direction, then the machines go in.' }, mode: 'dialogue' },
    ],
  },
  'm4-exam-protocol-19-already': {
    id: 'm4-exam-protocol-19-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XIX już zaliczony.', en: 'Protocol XIX already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Return path — the canyon of shelves, lifts working, the map alive
  'm4-return-vault': {
    id: 'm4-return-vault',
    lines: [
      { speaker: 'system', text: { pl: 'SKARBIEC MAP — POWRÓT', en: 'THE MAP VAULT — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Wyciągi pracują miarowo, taśmociąg niesie urobek, a Mapa Główna świeci na głowicy jak druga konstelacja.', en: 'The lifts work steadily, the conveyor carries ore, and the Master Map glows on the head like a second constellation.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Tędy schodziliśmy w drodze w dół. Tę drogę pamiętam — i już jej nie stracę. Do galerii prowadzi już droga.', en: 'This is the way we came down. I remember this road now — and I will not lose it again. A road leads to the galleries now.' }, mode: 'cinematic', autoAdvance: 3400 },
    ],
    onComplete: { setFlags: [FLAGS.M4_RETURN_VAULT_SEEN] },
  },
};
