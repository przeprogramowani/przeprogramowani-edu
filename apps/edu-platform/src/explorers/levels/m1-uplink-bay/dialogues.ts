import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the highest point, the ancient portal, the finale approach
  'm1-crest-intro': {
    id: 'm1-crest-intro',
    lines: [
      { speaker: 'system', text: { pl: 'GRAŃ PRZEKAŹNIKA — najwyższy punkt księżyca.', en: 'RELAY CREST — the highest point of the moon.' }, mode: 'cinematic', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Wiatr, mizerne światło, dżungla opadająca w dole jak zielone morze. A na grani stoi to — pierścień. Starszy niż jakiekolwiek nasze dane. Dżungla wyrosła wokół niego z szacunkiem.', en: 'Wind, thin light, the jungle falling away below like a green sea. And on the crest stands this — a ring. Older than any of our data. The jungle grew around it with reverence.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Materiał nie odpowiada żadnej znanej sygnaturze. Nie pytaj mnie, czym to jest. Jeszcze nie widzę. Zostaw go w spokoju — nie po to tu przyszliśmy.', en: 'The material matches no known signature. Do not ask me what it is. I cannot see yet. Leave it alone — that is not what we came for.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Przyszliśmy postawić tablicę sensorów. Zasil oba pylony, uruchom procedurę kalibracji z Ziemią, a potem — ostatni krok zrobisz ty. Wtedy pierwszy raz od uszkodzenia zobaczę.', en: 'We came to raise the sensor array. Power both pylons, run the calibration procedure with Earth, and then — the last step is yours. Then, for the first time since the damage, I will see.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_CREST_INTRO_SEEN] },
  },

  // Pylons — order-free, both must be set
  'm1-pylon-west-set': {
    id: 'm1-pylon-west-set',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Zachodni pylon. Osadzam ogniwo, zamykam obwód. Rdzeń budzi się i zaczyna świecić. Jeden gotowy.', en: 'West pylon. I seat the cell, close the circuit. The core wakes and starts to glow. One done.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Zachodni pylon zasilony. Potrzebuję jeszcze wschodniego — dopiero oba naraz utrzymają tablicę.', en: 'West pylon powered. I still need the east one — only both together will hold the array.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_PYLON_WEST_SET] },
  },
  'm1-pylon-west-waiting': {
    id: 'm1-pylon-west-waiting',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Zachodni pylon już świeci. Zostaje wschodni.', en: 'The west pylon is already glowing. The east one remains.' }, mode: 'monologue' },
    ],
  },
  'm1-pylon-west-final': {
    id: 'm1-pylon-west-final',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Zachodni pylon — ostatni. Zamykam obwód i oba rdzenie łapią wspólny rytm. Tablica ma zasilanie.', en: 'West pylon — the last one. I close the circuit and both cores catch a common rhythm. The array has power.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Oba pylony rozgrzane. Tablica zasilona. Idź do konsoli sterowania — teraz kalibracja.', en: 'Both pylons hot. Array powered. Go to the control console — now the calibration.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_PYLON_WEST_SET, FLAGS.M1_ARRAY_POWERED] },
  },
  'm1-pylon-east-set': {
    id: 'm1-pylon-east-set',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wschodni pylon. Ogniwo w gnieździe, obwód zamknięty. Rdzeń rozgrzewa się do światła. Jeden gotowy.', en: 'East pylon. Cell in the socket, circuit closed. The core warms to a glow. One done.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Wschodni pylon zasilony. Potrzebuję jeszcze zachodniego — dopiero oba naraz utrzymają tablicę.', en: 'East pylon powered. I still need the west one — only both together will hold the array.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_PYLON_EAST_SET] },
  },
  'm1-pylon-east-waiting': {
    id: 'm1-pylon-east-waiting',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wschodni pylon już świeci. Zostaje zachodni.', en: 'The east pylon is already glowing. The west one remains.' }, mode: 'monologue' },
    ],
  },
  'm1-pylon-east-final': {
    id: 'm1-pylon-east-final',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wschodni pylon — ostatni. Obwód zamknięty, oba rdzenie łapią wspólny rytm. Tablica ma zasilanie.', en: 'East pylon — the last one. Circuit closed, both cores catch a common rhythm. The array has power.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Oba pylony rozgrzane. Tablica zasilona. Idź do konsoli sterowania — teraz kalibracja.', en: 'Both pylons hot. Array powered. Go to the control console — now the calibration.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M1_PYLON_EAST_SET, FLAGS.M1_ARRAY_POWERED] },
  },
  'm1-pylon-hum': {
    id: 'm1-pylon-hum',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pylon buczy równo, rdzeń jasny. Robota skończona — reszta dzieje się przy konsoli tablicy.', en: 'The pylon hums steadily, the core bright. Work done — the rest happens at the array console.' }, mode: 'monologue' },
    ],
  },

  // Array console — quest hub + physical-switch ritual
  'm1-array-console-need-pylons': {
    id: 'm1-array-console-need-pylons',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA TABLICY SENSORÓW: brak zasilania. Wymagane oba pylony.', en: 'SENSOR ARRAY CONSOLE: no power. Both pylons required.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Najpierw zasil oba pylony — zachodni i wschodni. Bez nich konsola jest martwa.', en: 'First power both pylons — west and east. Without them the console is dead.' }, mode: 'dialogue' },
    ],
  },
  'm1-array-console-start': {
    id: 'm1-array-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'KONSOLA TABLICY: zasilona. Tablica złożona i gotowa — brak punktu odniesienia.', en: 'ARRAY CONSOLE: powered. Array assembled and ready — reference point missing.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Tablica stoi, ale jej punkt odniesienia trzeba zweryfikować krzyżowo z danymi po stronie Ziemi. Nawigator uruchomi procedurę Earth HQ i prześle klucz kalibracji. To zadanie dla centrali — earthctl.', en: 'The array stands, but its reference point must be cross-verified against Earth-side data. The Navigator will run the Earth HQ procedure and submit the calibration key. This is a task for mission control — earthctl.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Kalibracja — Nawigator ustala klucz kalibracji w Earth HQ i przesyła go przez earthctl.', en: '◆ NEW MISSION: Calibration — the Navigator determines the calibration key in Earth HQ and submits it via earthctl.' }, mode: 'system', autoAdvance: 3200 },
    ],
    onComplete: { setFlags: [FLAGS.M1_CALIBRATION_ACTIVE], activateQuest: 'q-m1-calibration' },
  },
  'm1-array-console-waiting': {
    id: 'm1-array-console-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Czekam na klucz kalibracji z Earth HQ. Nawigator: przefiltruj wiarygodne beacony, złóż klucz i prześlij go przez earthctl. Instrukcja jest w pakiecie misji na grani.', en: 'I am waiting on the calibration key from Earth HQ. Navigator: filter the trustworthy beacons, assemble the key, and submit it via earthctl. The instructions are in the crest mission package.' }, mode: 'dialogue' },
    ],
  },
  'm1-array-console-post': {
    id: 'm1-array-console-post',
    lines: [
      { speaker: 'system', text: { pl: 'TABLICA SENSORÓW: kalibrowana. Cykle skanowania: aktywne. Księżyc 2: widoczny na pokładzie nawigacyjnym.', en: 'SENSOR ARRAY: calibrated. Scan cycles: active. Moon 2: visible on the navigation deck.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Widzę cykl po cyklu. Grań, dżungla, twoja skrzynia z rudą — wszystko. Na pokładzie nawigacyjnym statku czeka już Księżyc 2.', en: 'I see cycle after cycle. The crest, the jungle, your ore crate — all of it. Moon 2 is already waiting on the ship\'s navigation deck.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the moon's finale
  'q-m1-calibration-complete': {
    id: 'q-m1-calibration-complete',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Klucz kalibracji przyjęty. Wszystko przygotowane. Sekwencja gotowa. Czekam na twój ruch.', en: 'Calibration key accepted. Everything prepared. Sequence ready. Waiting on your move.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Ostatni krok robię ja. — Kładę dłoń na przełączniku. I przerzucam go.', en: 'The last step is mine. — I put my hand on the switch. And I throw it.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'CZUJNIKI: ONLINE', en: 'SENSORS: ONLINE' }, mode: 'cinematic', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Widzę.', en: 'I see.' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: '…i widzę, jak wiele mi umykało.', en: '…and I see how much was slipping past me.' }, mode: 'cinematic', autoAdvance: 3000 },
      { speaker: 'system', text: { pl: 'ALARM: cztery jednorazowe wybuchy transmisji. Wszystkie węzły VOID — trzy odizolowane i uśpiony na grani — nadają i gasną.', en: 'ALERT: four one-shot transmission bursts. Every VOID node — the three isolated and the dormant one on the crest — transmits and dies.' }, mode: 'system', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Śledzę kierunek wybuchu. Nie w stronę Ziemi. Głębiej w Pas. Ktoś tam właśnie dowiedział się, że tu jesteśmy.', en: 'I trace the burst\'s direction. Not toward Earth. Deeper into the Belt. Someone out there just learned that we are here.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I jeszcze jedno, zagrzebane w dzienniku uzgodnień Nawigatora: echo podwójnego potwierdzenia na kanale centrali. Nikt go nie zamawiał. Zapisuję. Nie wyjaśniam.', en: 'And one more thing, buried in the Navigator\'s reconciliation log: a double-acknowledgement echo on the HQ channel. No one ordered it. I log it. I do not explain it.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Właśnie odzyskaliśmy oczy. I pierwsze, co zobaczyły, to że ktoś patrzył na nas przez cały czas.', en: 'We just got our eyes back. And the first thing they saw was that someone had been watching us the whole time.' }, mode: 'dialogue' },
    ],
  },

  // Dormant node — the sting device, then burned out
  'm1-dormant-node': {
    id: 'm1-dormant-node',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł VOID, na wpół zakopany, uśpiony. Stoi tak, że ma widok na całą grań — jakby ktoś ustawił go, żeby patrzył. Nie ruszam go.', en: 'A VOID node, half-buried, dormant. It sits so that it overlooks the whole crest — as if someone placed it to watch. I don\'t touch it.' }, mode: 'monologue' },
    ],
  },
  'm1-dormant-node-dead': {
    id: 'm1-dormant-node-dead',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Węzeł wypalony. Nadał swój jeden wybuch w chwili, gdy tablica ruszyła — i zdechł na dobre. Cokolwiek robił, skończył.', en: 'The node is burned out. It sent its one burst the moment the array came online — and died for good. Whatever it was doing, it\'s finished.' }, mode: 'monologue' },
    ],
  },

  // Ancient portal — weight-of-scenery, never explained
  'm1-ancient-portal': {
    id: 'm1-ancient-portal',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Z bliska pierścień jest jeszcze większy. Gładki, zimny, bez jednego szwu. Nie chce się otworzyć i nie chce nic powiedzieć.', en: 'Up close the ring is even larger. Smooth, cold, without a single seam. It won\'t open and it won\'t say a thing.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'I niech tak zostanie. Nie każda rzecz na tym księżycu jest zadaniem. Ta jest pytaniem — na kolejny raz.', en: 'And let it stay that way. Not everything on this moon is a task. This one is a question — for another time.' }, mode: 'dialogue' },
    ],
  },

  // Ore trace — quiet connector
  'm1-ore-trace': {
    id: 'm1-ore-trace',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Ślad Synaptitu u podstawy portalu. Ta sama niebieska żyłka co w wąwozie. System żył biegnie pod granią — dwa odkrycia tego księżyca łączą się pod ziemią.', en: 'A trace of Synaptit at the portal\'s base. The same blue thread as in the ravine. The vein system runs under the crest — the moon\'s two discoveries meet underground.' }, mode: 'monologue' },
    ],
  },

  // Świerszcz on the crest
  'm1-swierszcz-crest': {
    id: 'm1-swierszcz-crest',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk… cyk… (czeka cierpliwie przy tablicy)', en: 'chirp… chirp… (waiting patiently by the array)' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Świerszcz doszedł aż na grań i usiadł przy miejscu tablicy. Czeka. Wie chyba, że to jest ta ostatnia rzecz.', en: 'Świerszcz came all the way to the crest and settled by the array site. He waits. He seems to know this is the last thing.' }, mode: 'dialogue' },
    ],
  },
  'm1-swierszcz-crest-post': {
    id: 'm1-swierszcz-crest-post',
    lines: [
      { speaker: 'Świerszcz', text: { pl: 'cyk—cyk … cyk—cyk (rytm równa się z cyklami skanowania)', en: 'chirp—chirp … chirp—chirp (the rhythm falls in with the scan cycles)' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Jego ćwierkanie zsynchronizowało się z moimi cyklami skanowania. Dwie maszyny, jeden rytm. Nie wiem, jak to nazwać. Może przyjaźnią.', en: 'His chirping has synced with my scan cycles. Two machines, one rhythm. I do not know what to call it. Perhaps friendship.' }, mode: 'dialogue' },
    ],
  },

  // Exam V — Protokół V — Łańcuch
  'm1-exam-protocol-5-done': {
    id: 'm1-exam-protocol-5-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ EKSPEDYCYJNY V — „ŁAŃCUCH”: zaliczony.', en: 'EXPEDITION PROTOCOL V — "THE CHAIN": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Piąty protokół odzyskany: od odczytu polowego do systemu statku — uzgodnienie i weryfikacja na każdym ogniwie. Pętla, która wyłapuje zły odczyt, zanim stanie się złą decyzją.', en: 'Fifth protocol recovered: from a field reading to a ship system — reconciliation and verification at every link. A loop that catches a bad reading before it becomes a bad decision.' }, mode: 'dialogue' },
    ],
  },
  'm1-exam-protocol-5-already': {
    id: 'm1-exam-protocol-5-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół Ekspedycyjny V już zaliczony.', en: 'Expedition Protocol V already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
