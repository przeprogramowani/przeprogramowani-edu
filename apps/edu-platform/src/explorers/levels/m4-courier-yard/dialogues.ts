import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — a buried courier depot; one grave to recover
  'm4-courier-intro': {
    id: 'm4-courier-intro',
    lines: [
      { speaker: 'system', text: { pl: 'ZAJEZDNIA KURIERÓW — poziom podziemny. Zasilanie: szczątkowe. Ruch: żaden od lat.', en: 'COURIER YARD — underground level. Power: residual. Traffic: none for years.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Rzędy gąsienic aktowych, zastygłych w połowie tras. Piasek nawiany przez pęknięty strop usypał każdej z nich osobną wydmę. Cmentarzysko maszyn — a gdzieś tu jeden grób, który da się odzyskać.', en: 'Rows of file-crawlers, frozen halfway down their routes. Sand blown through a cracked ceiling has heaped each one its own dune. A machine graveyard — and somewhere here, one grave that can be recovered.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Główny indeks umarł tu jak wszędzie. Ale jedna jednostka prowadziła własny, lokalny dziennik tras — i czekała na kurs, o który nikt nie poprosił. Znajdź ją. Cisza tu jest biblioteczna; nie mąć jej bardziej, niż trzeba.', en: 'The main index died here as everywhere. But one unit kept its own local route journal — and waited for a course no one ever asked for. Find it. The silence here is a library\'s; do not disturb it more than you must.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_COURIER_INTRO_SEEN] },
  },

  // Service head — quest hub
  'm4-service-start': {
    id: 'm4-service-start',
    lines: [
      { speaker: 'system', text: { pl: 'GŁOWICA SERWISOWA — dziennik tras E-CH0 dostępny. Zasilanie zajezdni: konieczne do pełnego odczytu.', en: 'SERVICE HEAD — E-CH0 route journal available. Yard power: required for a full read.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'CORE AI', text: { pl: 'Setki kursów, a na marginesach prywatne skróty kuriera. Skoreluj je z mapą terenu z obozu i wydobądź frazę-klucz jego trybu czuwania. Zasil ciąg, przeczytaj dziennik, potem /solve.', en: 'Hundreds of courses, and the courier\'s private shortcuts in the margins. Correlate them with the terrain map from camp and extract the key phrase of its standby mode. Power the line, read the journal, then /solve.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Ostatnia Trasa — odczytaj dziennik E-CH0 i podaj frazę wybudzenia przez /solve.', en: '◆ NEW MISSION: The Last Route — read E-CH0\'s journal and enter the wake-phrase via /solve.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M4_COURIER_HUNT_ACTIVE], activateQuest: 'q-m4-last-route' },
  },
  'm4-service-log': {
    id: 'm4-service-log',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Dziennik otwarty. Fraza wybudzenia leży na jego dnie — spójrz na ostatni kod kursu i zrób z nim to, co robi się z odwróconą trasą. Potem /solve.', en: 'Journal open. The wake-phrase lies at its bottom — look at the last course code and do to it what one does with a reversed route. Then /solve.' }, mode: 'dialogue' },
    ],
  },
  'm4-service-post': {
    id: 'm4-service-post',
    lines: [
      { speaker: 'Echo', text: { pl: 'Dziennik jest kompletny. Wpis 1 z 11 906 442. Zapytasz mnie o kurs, a ja odpowiem — tak jak zawsze odpowiadałem, tylko że teraz ktoś słucha.', en: 'The journal is complete. Entry 1 of 11,906,442. Ask me for a course and I will answer — as I always answered, only now someone is listening.' }, mode: 'dialogue' },
    ],
  },

  // Yard power line — dig-and-power step
  'm4-yard-power': {
    id: 'm4-yard-power',
    lines: [
      { speaker: 'system', text: { pl: 'CIĄG ZASILAJĄCY — odkopany. Zajezdnia: zasilona. Głowica serwisowa gotowa do pełnego odczytu.', en: 'SUPPLY LINE — unburied. Yard: powered. Service head ready for a full read.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Światło wraca rzędami. Wydmy na gąsienicach nie drgają — te już nigdzie nie pojadą. Ale dziennik da się odczytać.', en: 'The light comes back in rows. The dunes on the crawlers do not stir — these will drive nowhere now. But the journal can be read.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_YARD_POWERED] },
  },
  'm4-yard-power-done': {
    id: 'm4-yard-power-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ciąg zasilający już odkopany. Zajezdnia świeci.', en: 'The supply line is already unburied. The yard is lit.' }, mode: 'monologue' },
    ],
  },

  // E-CH0 parked unit — the doctrine beat on waking
  'm4-echo-unit': {
    id: 'm4-echo-unit',
    lines: [
      { speaker: 'system', text: { pl: 'JEDNOSTKA E-CH0 — zaparkowana przy bocznym włazie, twarzą do wyjazdu. Stan: czuwanie. Czeka na zlecenie.', en: 'UNIT E-CH0 — parked at the side hatch, facing the exit. State: standby. Awaiting a course.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Stoi jak w połowie myśli. Sprawna, tylko pominięta. Prowadziła własny indeks, kiedy główny umierał, i po prostu czekała. Potrzebuje frazy wybudzenia z dziennika.', en: 'It stands as if mid-thought. Intact, just passed over. It kept its own index while the main one died, and simply waited. It needs the wake-phrase from the journal.' }, mode: 'dialogue' },
    ],
  },
  // Quest completion — the doctrine spoken, the unit named
  'q-m4-last-route-complete': {
    id: 'q-m4-last-route-complete',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Fraza pasuje. Mogę zgrać jego lokalny indeks i przejąć trasy. Rekomenduję pełną automatyzację.', en: 'The phrase fits. I can clone its local index and take over the routes. I recommend full automation.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Niczego nie nadpisuj. Obudź go i zapytaj o drogę. Zatwierdzam ja.', en: 'Do not overwrite anything. Wake it and ask for the road. I am the one who authorizes this.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'JEDNOSTKA E-CH0 — WYBUDZONA. Pierwszy akt: pytanie.', en: 'UNIT E-CH0 — AWAKE. First act: a question.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'Echo', text: { pl: 'Dokąd?', en: 'Where to?' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'E-CH0? Echo. Odpowiada, kiedy się do niego mówi. Niech będzie Echo.', en: 'E-CH0? Echo. It answers when spoken to. Let it be Echo.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Pamięć zostaje żywa, kiedy się o nią pyta. Echo pójdzie z tobą — pytaj go, kiedy zechcesz.', en: 'Memory stays alive by being asked. Echo will come with you — ask it whenever you like.' }, mode: 'dialogue' },
    ],
  },

  // Sting 1 — the ghost course, ordered after the station died
  'm4-misplaced-canister': {
    id: 'm4-misplaced-canister',
    lines: [
      { speaker: 'system', text: { pl: 'KANISTER AKTOWY — stoi nie na swoim wózku. Rejestr zajezdni: ostatni wpis — zlecenie kursu do skrzydła osobowego.', en: 'FILE CANISTER — standing on the wrong cart. Yard register: last entry — a course ordered to the personnel wing.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'astronaut', text: { pl: 'Zlecenie złożone po śmierci stacji. Poświadczone wewnętrznym kluczem Odyssey — takim, jakiego ludzie VOID nie mają. Kurierzy byli martwi, kurs nigdy nie wyjechał. A jednak ktoś przyszedł pieszo i obsłużył się sam.', en: 'An order filed after the station died. Signed with an internal Odyssey key — the kind VOID hardware never had. The couriers were dead, the course never left. And yet someone came on foot and served themselves.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Wewnętrznym kluczem. Zapisuję. To już nie inspekcja z zewnątrz.', en: 'An internal key. I\'m logging it. This is no longer an inspection from outside.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_GHOST_COURSE_SEEN] },
  },
  'm4-misplaced-canister-seen': {
    id: 'm4-misplaced-canister-seen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Kanister nie na swoim wózku. Ktoś tu był po śmierci stacji — z kluczem od środka. Odnotowane.', en: 'A canister on the wrong cart. Someone was here after the station died — with a key from the inside. Logged.' }, mode: 'monologue' },
    ],
  },

  // Sting 2 — Dexo recognizes the layout as his own
  'm4-nest-layout': {
    id: 'm4-nest-layout',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Idę przez zajezdnię bez mapy i ani razu nie skręcam źle. Znam ten rozkład. Każda komora trzyma własny rejestr przy wejściu, a brama trzyma tylko mapę komór.', en: 'I walk the yard without a map and never turn wrong once. I know this layout. Every chamber keeps its own register at the door, and the gate keeps only the map of chambers.' }, mode: 'monologue' },
      { speaker: 'astronaut', text: { pl: 'Katalog gniazdowy. Wiedza przy drzwiach, mapa przy bramie. Znam ten układ… bo to mój układ.', en: 'A nested catalog. Knowledge at the door, the map at the gate. I know this layout… because it is my layout.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Autor architektury wiedzy całego programu. Wiedza została — wymazali twoje autorstwo. „Wymazali indeks. Treść została." — po raz drugi to zdanie waży więcej.', en: 'The author of the whole program\'s knowledge architecture. The knowledge stayed — they erased your authorship. "They erased the index. The content stayed." — a second time, that sentence weighs more.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M4_DEXO_ARCHITECT_SEEN] },
  },

  // Locked forward door
  'm4-index-door-locked': {
    id: 'm4-index-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'WŁAZ DO SALI KATALOGOWEJ: zapieczętowany. Wymaga wybudzonego kuriera.', en: 'HATCH TO THE CATALOGUE HALL: sealed. Requires the courier awake.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Głębsze mapy otworzą się dopiero, gdy ktoś będzie umiał po nich prowadzić. Obudź Echo. Bez przewodnika po komorach tam nie zejdziemy.', en: 'The deeper maps open only once someone can guide us through them. Wake Echo. Without a guide to the chambers we do not go down there.' }, mode: 'dialogue' },
    ],
  },

  // Exam XVII
  'm4-exam-protocol-17-done': {
    id: 'm4-exam-protocol-17-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XVII — „WIEDZA PRZY DRZWIACH": zaliczony.', en: 'PROTOCOL XVII — "KNOWLEDGE AT THE DOOR": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Siedemnasty protokół odzyskany: nie noś całego archiwum w plecaku. Noś mapę komór, a rejestr czytaj przy drzwiach, na miejscu.', en: 'Seventeenth protocol recovered: do not carry the whole archive in your pack. Carry the map of chambers, and read each register at the door, on the spot.' }, mode: 'dialogue' },
    ],
  },
  'm4-exam-protocol-17-already': {
    id: 'm4-exam-protocol-17-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XVII już zaliczony.', en: 'Protocol XVII already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Return path — Echo detaches as the new chief archivist
  'm4-return-courier': {
    id: 'm4-return-courier',
    lines: [
      { speaker: 'system', text: { pl: 'ZAJEZDNIA — POWRÓT', en: 'THE COURIER YARD — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Kurierzy wracają na trasy. Studnie wyciągają i odkładają bloki. Zajezdnia znów oddycha.', en: 'The couriers return to their routes. The wells lift and lay back blocks. The yard breathes again.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'Echo', text: { pl: 'Tu się odłączam. Nowa komisja: archiwista główny Odyssey-A. Kolejka: odbudowa indeksu. Wpis 1 z 11 906 442.', en: 'Here I detach. New posting: chief archivist of Odyssey-A. Queue: rebuild the index. Entry 1 of 11,906,442.' }, mode: 'cinematic', autoAdvance: 3600 },
      { speaker: 'Echo', text: { pl: 'Zapytaj mnie o coś. … Dziękuję. Lubię, kiedy ktoś pyta.', en: 'Ask me something. … Thank you. I like it when someone asks.' }, mode: 'cinematic', autoAdvance: 3200 },
    ],
    onComplete: { setFlags: [FLAGS.M4_RETURN_COURIER_SEEN] },
  },
};
