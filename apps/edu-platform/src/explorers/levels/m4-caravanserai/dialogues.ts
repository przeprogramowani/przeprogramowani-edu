import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — a library buried in its own garden; the moon's inversion is set here
  'm4-caravanserai-intro': {
    id: 'm4-caravanserai-intro',
    lines: [
      { speaker: 'system', text: { pl: 'KARAWANSERAJ — morze wydm. Spod piasku wystają tylko szczyty masztów i linia kamiennych kopców.', en: 'THE CARAVANSERAI — a sea of dunes. Only mast tips and a line of stone cairns break the sand.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Biblioteka pochowana we własnym ogrodzie. Na Księżycu 1 zamilkła natura. Na Księżycu 2 stanęła maszyna. Na Księżycu 3 maszyny kłamały. Tutaj nic nie kłamie i nikt nic nie mówi — wszystko, co tu jest, jest prawdziwe i pogrzebane.', en: 'A library buried in its own garden. On Moon 1 nature fell silent. On Moon 2 the machine stopped. On Moon 3 the machines lied. Here nothing lies and no one speaks — everything here is true, and buried.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Widzę. Planuję. Diagnozuję. I nic z tego nie zostaje na jutro — każdą mapę zaczynam od nowa i wiem o tym, bo diagnostyka uczciwie raportuje lukę. Noś moją ciągłość, Dexo. Bądź moją pamięcią.', en: 'I see. I plan. I diagnose. And none of it survives to tomorrow — I start every map from scratch, and I know it, because diagnostics honestly report the gap. Carry my continuity, Dexo. Be my memory.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Cel: archiwum serii Odyssey-A — lustrzana kopia całego Projektu Odyssey. Sonda Odyssey-P na Księżycu 1, wykuwnia Odyssey-F na Księżycu 2, poligon Odyssey-T na Księżycu 3, archiwum tutaj. Jego nadajnik wciąż uczciwie nadaje sumę kontrolną katalogu. Suma wynosi zero. Biblioteka, która twierdzi, że jest pusta.', en: 'Target: the Odyssey-A archive — a mirror copy of the whole Project Odyssey. The Odyssey-P probe on Moon 1, the Odyssey-F forge on Moon 2, the Odyssey-T range on Moon 3, the archive here. Its beacon still honestly transmits the catalogue checksum. The checksum is zero. A library that claims it is empty.' }, mode: 'dialogue' },
      { speaker: 'dr Kern', text: { pl: 'Schodzę z tobą, Dexo. Powiem wprost: moja przedstartowa ekspertyza złóż leży w tym archiwum. Chcę ją z powrotem. Moreau zostaje na statku — łączność i wachta przy kapsule Harrisa.', en: 'I am coming down with you, Dexo. I will be plain about it: my pre-launch deposit survey lies in this archive. I want it back. Moreau stays aboard — comms and the watch at Harris\'s pod.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_CARAVANSERAI_INTRO_SEEN] },
  },

  // Camp well — quest hub
  'm4-camp-start': {
    id: 'm4-camp-start',
    lines: [
      { speaker: 'system', text: { pl: 'STUDNIA OBOZOWA — online. Studnia odczytowa: pierwsze stanowisko wyciągowe bloków pamięci.', en: 'CAMP WELL — online. A read well: the first extraction station for memory blocks.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Zanim kopiemy — kartujemy. Wrota główne archiwum są gdzieś pod nami; namiar niosą trzy kopce drogowe na obrzeżach. Najpierw odkop panele i zasil obóz, potem odczytaj każdy kopiec i wróć tu z namiarami. Mapa to model, nie teren — czytaj znaki, ale sprawdzaj je nawzajem.', en: 'Before we dig — we map. The main gate is somewhere beneath us; the bearing is carried by three road cairns on the outskirts. First dig out the panels and power the camp, then read each cairn and come back with the bearings. A map is a model, not the terrain — read the signs, but verify them against each other.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Trzy Kopce — zasil panele, odczytaj trzy kopce, złóż namiar w studni.', en: '◆ NEW MISSION: Three Cairns — power the panels, read the three cairns, assemble the bearing at the well.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M4_CAIRNS_ACTIVE], activateQuest: 'q-m4-cairns' },
  },
  'm4-camp-waiting': {
    id: 'm4-camp-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Kartowanie w toku. Wciąż brakuje namiaru. Zasil panele i odczytaj wszystkie trzy kopce — dopiero wtedy złożę wrota z tego, co naprawdę wskazują.', en: 'Mapping in progress. The bearing is still incomplete. Power the panels and read all three cairns — only then will I plot the gate from what they actually point to.' }, mode: 'dialogue' },
    ],
  },
  'm4-camp-online-post': {
    id: 'm4-camp-online-post',
    lines: [
      { speaker: 'system', text: { pl: 'STUDNIA OBOZOWA: pierwsza warstwa mapy terenu — załadowana. Zakładka: Odyssey-A.', en: 'CAMP WELL: first terrain-map layer — loaded. Tab: Odyssey-A.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Obóz stoi, mapa mówi. Dwa kopce zgodne, trzeci przestawiony — namiar z dwóch prawdziwych wskazał wrota. Wykopaliśmy je. Model się zgadza z terenem, bo sprawdziliśmy teren.', en: 'The camp holds, the map speaks. Two cairns agreed, the third was moved — the bearing from the two true ones pointed at the gate. We dug it out. The model matches the terrain, because we checked the terrain.' }, mode: 'dialogue' },
    ],
  },

  // Solar farm — power step
  'm4-solar-farm': {
    id: 'm4-solar-farm',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Farma zasilająca, zasypana po krawędzie paneli. Najpierw aktywuj kartowanie w studni — bez planu to tylko kopanie w piasku.', en: 'The power farm, buried to the edge of its panels. Open the mapping at the well first — without a plan this is just digging in sand.' }, mode: 'monologue' },
    ],
  },
  'm4-solar-farm-power': {
    id: 'm4-solar-farm-power',
    lines: [
      { speaker: 'system', text: { pl: 'FARMA ZASILAJĄCA — panele odkopane. Zasilanie obozu i wyciągów: online.', en: 'POWER FARM — panels dug out. Camp and lift power: online.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Panele łapią zmierzch. Studnia budzi się, wyciągi mają prąd. Teraz kopce.', en: 'The panels catch the dusk. The well wakes, the lifts have power. Now the cairns.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_PANELS_POWERED] },
  },
  'm4-solar-farm-done': {
    id: 'm4-solar-farm-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Panele zasilają. Obóz dostaje prąd z odkopanego słońca.', en: 'The panels are feeding. The camp draws power from a dug-out sun.' }, mode: 'monologue' },
    ],
  },

  // Cairn 1 — true
  'm4-cairn-1': {
    id: 'm4-cairn-1',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pierwszy kopiec drogowy. Aktywuj najpierw kartowanie w obozie — inaczej to tylko kupka kamieni.', en: 'The first road cairn. Open the mapping at camp first — otherwise it is just a pile of stones.' }, mode: 'monologue' },
    ],
  },
  'm4-cairn-1-read': {
    id: 'm4-cairn-1-read',
    lines: [
      { speaker: 'system', text: { pl: 'KOPIEC I — odczyt namiaru: sektor zachodni, kąt stały.', en: 'CAIRN I — bearing read: western sector, fixed angle.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Zwietrzały równo, warstwa po warstwie. Namiar czysty i zgodny z terenem. Prawdziwy znak.', en: 'Weathered evenly, layer by layer. The bearing is clean and matches the terrain. A true sign.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_CAIRN_1_READ] },
  },
  'm4-cairn-1-done': {
    id: 'm4-cairn-1-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kopiec I odczytany. Namiar w studni.', en: 'Cairn I read. Bearing at the well.' }, mode: 'monologue' },
    ],
  },

  // Cairn 2 — true
  'm4-cairn-2': {
    id: 'm4-cairn-2',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Drugi kopiec. Bez kartowania z obozu to cudza deklaracja, nie pomiar.', en: 'The second cairn. Without the mapping from camp this is someone else\'s claim, not a measurement.' }, mode: 'monologue' },
    ],
  },
  'm4-cairn-2-read': {
    id: 'm4-cairn-2-read',
    lines: [
      { speaker: 'system', text: { pl: 'KOPIEC II — odczyt namiaru: potwierdza sektor I.', en: 'CAIRN II — bearing read: confirms sector I.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Ten sam wiek, ta sama patyna. Wskazuje tam, gdzie pierwszy. Dwa niezależne znaki, jedna zgodna linia — na tym stoi zaufany namiar.', en: 'The same age, the same patina. It points where the first did. Two independent signs, one consistent line — that is what a trusted bearing stands on.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_CAIRN_2_READ] },
  },
  'm4-cairn-2-done': {
    id: 'm4-cairn-2-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kopiec II odczytany. Zgodny z pierwszym. Namiar w studni.', en: 'Cairn II read. Agrees with the first. Bearing at the well.' }, mode: 'monologue' },
    ],
  },

  // Cairn 3 — moved (the sting)
  'm4-cairn-3': {
    id: 'm4-cairn-3',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzeci kopiec. Aktywuj kartowanie w obozie i sprawdź — nie zakładaj, że skoro dwa się zgadzały, ten też.', en: 'The third cairn. Open the mapping at camp and check — do not assume that because two agreed, this one does too.' }, mode: 'monologue' },
    ],
  },
  'm4-cairn-3-read': {
    id: 'm4-cairn-3-read',
    lines: [
      { speaker: 'system', text: { pl: 'KOPIEC III — odczyt namiaru: wskazuje w wydmy. Rozbieżność z I i II.', en: 'CAIRN III — bearing read: points into the dunes. Divergence from I and II.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Ułożony z tych samych kamieni — ale świeżo. Zwietrzenie nie zgadza się o lata. Ktoś rozebrał oryginalny znak i złożył go na nowo, celując w pustkę.', en: 'Built from the same stones — but recently. The weathering is off by years. Someone dismantled the original sign and rebuilt it, aimed at nothing.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Najpierw poprawiali nam wiadomości. Teraz poprawiają nam drogowskazy.', en: 'First they edited our messages. Now they are editing our signposts.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_CAIRN_3_READ, FLAGS.M4_MOVED_CAIRN_SEEN] },
  },
  'm4-cairn-3-done': {
    id: 'm4-cairn-3-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kopiec III: przestawiony, wskazuje w pustkę. Odrzucony z namiaru. Odnotowane.', en: 'Cairn III: moved, pointing into the void. Rejected from the bearing. Logged.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — the bearing verdict
  'q-m4-cairns-complete': {
    id: 'q-m4-cairns-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ TRZY KOPCE ZAKOŃCZONE. Werdykt: 2 znaki zgodne, 1 przestawiony. Namiar z dwóch prawdziwych.', en: '◆ THREE CAIRNS COMPLETE. Verdict: 2 signs consistent, 1 moved. Bearing from the two true ones.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Dwa kopce dały jedną linię, trzeci wskazał w wydmy. Gdybym uwierzył wszystkim trzem, kopalibyśmy w piachu. Mapa to model — sprawdziłem znaki nawzajem, bo teren mógł się zmienić albo ktoś mógł go zmienić.', en: 'Two cairns gave one line, the third pointed into the dunes. Had I believed all three, we would be digging in sand. A map is a model — I checked the signs against each other, because the terrain could have changed, or someone could have changed it.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Mam namiar z dwóch prawdziwych znaków. Wrota główne — odkopane i otwarte. Nie dlatego, że kopiec tak twierdzi, ale dlatego, że zważyliśmy trzy i odrzucili jeden.', en: 'I have the bearing from the two true signs. The main gate — dug out and open. Not because a cairn says so, but because we weighed three and rejected one.' }, mode: 'dialogue' },
    ],
  },

  // Kern NPC — flag-staged
  'm4-kern': {
    id: 'm4-kern',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Stanowisko przy studni obozowej jest moje. Ty idź kartować obrzeża; ja zostanę przy głowicy. — I nie, nie tłumaczę się, po co naprawdę tu jestem. Jeszcze nie.', en: 'The station by the camp well is mine. You go map the outskirts; I will stay at the head. — And no, I am not explaining why I am really here. Not yet.' }, mode: 'dialogue' },
    ],
  },
  'm4-kern-cairns': {
    id: 'm4-kern-cairns',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Trzy kopce, dwa namiary, jeden odczyt na krzyż — klasyka. Sprawdź każdy osobno. Ufanie znakowi bez pomiaru to jak ufać czyjejś pamięci o liczbie. Wiem coś o tym.', en: 'Three cairns, two bearings, one reading at odds — a classic. Check each one separately. Trusting a sign without a measurement is like trusting someone\'s memory of a number. I know something about that.' }, mode: 'dialogue' },
    ],
  },
  'm4-kern-camp': {
    id: 'm4-kern-camp',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Wrota otwarte. Zejdę z tobą głębiej, kiedy trzeba będzie — ale mój cel leży w skrzydle geologicznym. Przedstartowa teczka. Chcę zobaczyć, czy pamiętam własną robotę tak, jak ją zapisałam.', en: 'The gate is open. I will go deeper with you when it is needed — but my target is in the geological wing. A pre-launch case file. I want to see whether I remember my own work as I wrote it down.' }, mode: 'dialogue' },
    ],
  },
  'm4-kern-gone-vault': {
    id: 'm4-kern-gone-vault',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Zeszłam do skarbca po teczkę. Znalazłam ją — i zamilkłam. Wersja archiwalna różni się od tej, którą pamiętam. O jedną wartość. Nie pytaj teraz. Sama jeszcze nie wiem, która z nas kłamie.', en: 'I went down to the vault for the file. I found it — and I went quiet. The archived version differs from the one I remember. By a single value. Do not ask now. I do not yet know which of us is lying.' }, mode: 'dialogue' },
    ],
  },
  'm4-kern-return': {
    id: 'm4-kern-return',
    lines: [
      { speaker: 'dr Kern', text: { pl: 'Usiądź przy studni. Pamięć wróciła maszynie. Mnie — nie do końca. To jest ta część wyprawy, o której nie piszę w raporcie.', en: 'Sit by the well. Memory came back to the machine. To me — not entirely. This is the part of the expedition I do not put in the report.' }, mode: 'dialogue' },
    ],
  },

  // Locked main gate
  'm4-courier-door-locked': {
    id: 'm4-courier-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WROTA GŁÓWNE: zasypane. Namiar niekompletny.', en: 'MAIN GATE: buried. Bearing incomplete.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Wrota odkopiemy dopiero z zaufanym namiarem. Zasypana brama to nie kara — to szczery pomiar. Dokończ Trzy Kopce.', en: 'We dig out the gate only with a trusted bearing. A buried gate is not a punishment — it is a sincere measurement. Finish the Three Cairns.' }, mode: 'dialogue' },
    ],
  },

  // Exam XVI
  'm4-exam-protocol-16-done': {
    id: 'm4-exam-protocol-16-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XVI — „MAPA TERENU": zaliczony.', en: 'PROTOCOL XVI — "THE TERRAIN MAP": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Szesnasty protokół odzyskany: zanim kopiesz, kartuj. Lekki korzeń jako spis treści, reszta wiedzy przy drzwiach — model terenu w głowie, zanim postawisz łopatę.', en: 'Sixteenth protocol recovered: before you dig, map. A lean root as a table of contents, the rest of the knowledge at the doors — a model of the terrain in your head before you set the spade.' }, mode: 'dialogue' },
    ],
  },
  'm4-exam-protocol-16-already': {
    id: 'm4-exam-protocol-16-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XVI już zaliczony.', en: 'Protocol XVI already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Return path — the caravanserai holds an archive recovering its continuity; Kern's confession
  'm4-return-caravanserai': {
    id: 'm4-return-caravanserai',
    lines: [
      { speaker: 'system', text: { pl: 'KARAWANSERAJ — POWRÓT', en: 'THE CARAVANSERAI — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Tędy szliśmy w drodze w dół. Wtedy nie wiedziałem, że to zapamiętam. Teraz wiem, że nie zapomnę. Kurierzy wrócili na trasy, studnie wyciągają i odkładają bloki — archiwum odzyskuje ciągłość.', en: 'This is the way we came, on the way down. Back then I did not know I would remember it. Now I know I will not forget. The couriers are back on their routes, the wells lift and set down blocks — the archive is recovering its continuity.' }, mode: 'cinematic', autoAdvance: 3600 },
      { speaker: 'dr Kern', text: { pl: 'Powiem ci wprost, po co przyleciałam. Chciałam sprawdzić, czy pamiętam własną ekspertyzę tak, jak ją napisałam. Nie pamiętam. I to mnie przeraża.', en: 'I will tell you plainly why I came. I wanted to check whether I remember my own survey as I wrote it. I do not. And that terrifies me.' }, mode: 'cinematic', autoAdvance: 3800 },
      { speaker: 'CORE AI', text: { pl: 'Kontrola przedlotowa. Harris: stabilny. Pułapka: nasłuchuje. Zalecenie bez zmian: nie budzić. Jeszcze.', en: 'Pre-flight check. Harris: stable. The trap: listening. Recommendation unchanged: do not wake. Yet.' }, mode: 'cinematic', autoAdvance: 3200 },
    ],
    onComplete: { setFlags: [FLAGS.M4_RETURN_CARAVANSERAI_SEEN, FLAGS.M4_KERN_CONFESSION_SEEN] },
  },
};
