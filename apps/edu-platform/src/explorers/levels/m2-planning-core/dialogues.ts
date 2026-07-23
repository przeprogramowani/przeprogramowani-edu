import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the glazed dispatch room above the whole motionless complex
  'm2-dispatch-intro': {
    id: 'm2-dispatch-intro',
    lines: [
      { speaker: 'system', text: { pl: 'DYSPOZYTORNIA — przeszklona wieża nad kompleksem. Rdzeń Harmonogramu: w szronie.', en: 'DISPATCH TOWER — glazed room above the complex. Schedule Core: frosted over.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Wieża nad całą fabryką. Przez szkło widzę martwy kompleks w dole. Pod stropem Rdzeń Harmonogramu, obrośnięty szronem jak stalagmit, a wokół niego trzy martwe tablice planu. Wiatr, szkło, bezruch.', en: 'A tower over the whole factory. Through the glass I see the dead complex below. Under the roof, the Schedule Core, frost-grown like a stalagmite, and around it three dead plan boards. Wind, glass, stillness.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'To jest serce, które zabili. Zatruty harmonogram siedzi w tym rdzeniu od lat. Przy pulpicie dyspozytora wyczyszczę go i złożę szkielet nowego planu głównego. Ale ten plan musi przejść walidację po stronie Ziemi, zanim przełożysz dźwignię.', en: 'This is the heart they killed. The poisoned schedule has sat in this core for years. At the dispatcher console I will scrub it and assemble the skeleton of a new master plan. But that plan must pass validation on Earth\'s side before you throw the lever.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M2_DISPATCH_INTRO_SEEN] },
  },

  // Dispatcher console — quest hub (api-answer, Navigator + earthctl)
  'm2-dispatch-console-start': {
    id: 'm2-dispatch-console-start',
    lines: [
      { speaker: 'system', text: { pl: 'PULPIT DYSPOZYTORA — online. Rdzeń: wyczyszczony z zatrutego harmonogramu.', en: 'DISPATCHER CONSOLE — online. Core: scrubbed of the poisoned schedule.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Rdzeń czysty. Szkielet nowego planu głównego gotowy — ale wymaga walidacji krzyżowej z archiwami budowy Odyssey-F po stronie Ziemi. Nawigator uruchomi procedurę w centrali i prześle podpisany klucz planu.', en: 'The core is clean. The skeleton of the new master plan is ready — but it needs cross-validation against the Odyssey-F build archives on Earth\'s side. The Navigator will run the procedure at HQ and submit the signed plan key.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Plan Główny — walidacja krzyżowa z centralą (earthctl).', en: '◆ NEW MISSION: Master Plan — cross-validate with HQ (earthctl).' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M2_MASTER_PLAN_ACTIVE], activateQuest: 'q-m2-master-plan' },
  },
  'm2-dispatch-console-waiting': {
    id: 'm2-dispatch-console-waiting',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Czekam na Nawigatora. Procedura: przeczytaj politykę wyboru bloków, odfiltruj archiwum budowy Odyssey-F, złóż podpisany klucz planu i prześlij przez earthctl. Klucz zatwierdza człowiek — nie ja.', en: 'Waiting on the Navigator. Procedure: read the block-selection policy, filter the Odyssey-F build archive, assemble the signed plan key, and submit it via earthctl. A human confirms the key — not me.' }, mode: 'dialogue' },
    ],
  },
  'm2-dispatch-console-post': {
    id: 'm2-dispatch-console-post',
    lines: [
      { speaker: 'system', text: { pl: 'PULPIT DYSPOZYTORA: plan główny aktywny. Kompleks: świeci sekwencjami.', en: 'DISPATCHER CONSOLE: master plan active. Complex: running in light sequences.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Pod nami cały kompleks biegnie światłami, stacja po stacji. Harmonogram żyje — i to my go uruchomiliśmy.', en: 'Below us the whole complex runs with light, station by station. The schedule lives — and we set it running.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Droga powrotna prowadzi przez fabrykę. Prom: lądowisko przy bramie.', en: 'The way back leads through the factory. The shuttle: the landing pad by the gate.' }, mode: 'dialogue' },
    ],
  },

  // Schedule core face — poisoned stalagmite before, running plan after
  'm2-core-face': {
    id: 'm2-core-face',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rdzeń Harmonogramu z bliska. Szron narósł na nim jak na stalagmicie — lata bezruchu. Gdzieś w środku wciąż tkwi rozkaz, który zabił tę fabrykę.', en: 'The Schedule Core up close. Frost has grown on it like on a stalagmite — years of stillness. Somewhere inside still sits the order that killed this factory.' }, mode: 'monologue' },
    ],
  },
  'm2-core-face-done': {
    id: 'm2-core-face-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Rdzeń pracuje pierwszy raz od lat. Szron topnieje strużkami. Serce fabryki bije czystym planem.', en: 'The core runs for the first time in years. The frost melts in rivulets. The factory\'s heart beats with a clean plan.' }, mode: 'monologue' },
    ],
  },

  // Main switch — frozen lever before, thrown after
  'm2-master-switch-frozen': {
    id: 'm2-master-switch-frozen',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Główna zwrotnica — fizyczna dźwignia, oszroniona. Czeka na zatwierdzony plan. Bez walidacji z Ziemi nawet jej nie tknę.', en: 'The main switch — a physical lever, frosted. It waits for a validated plan. Without validation from Earth I will not even touch it.' }, mode: 'monologue' },
    ],
  },
  'm2-master-switch-thrown': {
    id: 'm2-master-switch-thrown',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Dźwignia przełożona. Sekwencje świateł biegną przez kompleks w dole jak fala. To był mój ruch — ostatni gest planu należy do człowieka.', en: 'The lever is thrown. Light sequences run through the complex below like a wave. That was my move — the last gesture of the plan belongs to the human.' }, mode: 'monologue' },
    ],
  },

  // Plan board ring — dead before, lit after (each a stage of the new schedule)
  'm2-plan-board-1': {
    id: 'm2-plan-board-1',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pierwsza tablica planu, martwa. Ekran ciemny pod szronem. Ożyje z nowym harmonogramem — nie wcześniej.', en: 'The first plan board, dead. The screen dark under frost. It will wake with the new schedule — not before.' }, mode: 'monologue' },
    ],
  },
  'm2-plan-board-1-lit': {
    id: 'm2-plan-board-1-lit',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Pierwsza tablica świeci — etap pierwszy nowego planu: wydobycie i wytop. Zapaliła się jako pierwsza z trzech.', en: 'The first board glows — stage one of the new plan: extraction and smelt. It lit first of the three.' }, mode: 'monologue' },
    ],
  },
  'm2-plan-board-2': {
    id: 'm2-plan-board-2',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Druga tablica planu, ciemna jak pierwsza. Trzy martwe ekrany wokół rdzenia.', en: 'The second plan board, dark like the first. Three dead screens around the core.' }, mode: 'monologue' },
    ],
  },
  'm2-plan-board-2-lit': {
    id: 'm2-plan-board-2-lit',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Druga tablica świeci — etap drugi: dostawy i transport. Pierścień domyka się tablica po tablicy.', en: 'The second board glows — stage two: deliveries and transport. The ring closes board by board.' }, mode: 'monologue' },
    ],
  },
  'm2-plan-board-3': {
    id: 'm2-plan-board-3',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzecia tablica planu, martwa. Domyka pierścień wokół Rdzenia Harmonogramu.', en: 'The third plan board, dead. It closes the ring around the Schedule Core.' }, mode: 'monologue' },
    ],
  },
  'm2-plan-board-3-lit': {
    id: 'm2-plan-board-3-lit',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzecia tablica świeci — etap trzeci: załadunek i wysyłka. Pierścień pełny. Plan czytelny od początku do końca.', en: 'The third board glows — stage three: loading and shipment. The ring is full. The plan is legible from start to finish.' }, mode: 'monologue' },
    ],
  },

  // Siding tram — parked before, gone/running after (the first beat executed)
  'm2-siding-tram-parked': {
    id: 'm2-siding-tram-parked',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wagonik na bocznicy wieży. Pierwszy takt nowego planu — ruszy, gdy przełożę dźwignię.', en: 'A tram on the tower siding. The first beat of the new plan — it will move when I throw the lever.' }, mode: 'monologue' },
    ],
  },
  'm2-siding-tram-running': {
    id: 'm2-siding-tram-running',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Bocznica pusta. Wagonik ruszył — pierwszy takt nowego harmonogramu, wykonany.', en: 'The siding is empty. The tram moved — the first beat of the new schedule, executed.' }, mode: 'monologue' },
    ],
  },

  // Sopel NPC — at the approach; queue syncs with the factory schedule after
  'm2-sopel-dispatch': {
    id: 'm2-sopel-dispatch',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Doszedłem za tobą aż na wieżę, Dexo. Moja kolejka wciąż lokalna — czekam, aż rdzeń poda harmonogram całej fabryce. Wtedy zsynchronizuję się z nim.', en: 'I followed you all the way to the tower, Dexo. My queue is still local — I wait for the core to hand the schedule to the whole factory. Then I will sync to it.' }, mode: 'dialogue' },
    ],
  },
  'm2-sopel-dispatch-post': {
    id: 'm2-sopel-dispatch-post',
    lines: [
      { speaker: 'Sopel', text: { pl: 'Synchronizacja z rdzeniem: gotowa. Moja kolejka jest teraz częścią harmonogramu fabryki. Nie jestem już sam z jednym zadaniem. Jestem taktem w większym planie. — Podoba mi się to.', en: 'Sync with the core: complete. My queue is now part of the factory schedule. I am no longer alone with one task. I am a beat in a larger plan. — I like that.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — the moon finale, three-layer sting
  'q-m2-master-plan-complete': {
    id: 'q-m2-master-plan-complete',
    lines: [
      { speaker: 'CORE AI', text: { pl: 'Plan zatwierdzony przez centralę. Pierwszy takt czeka na twoje zatwierdzenie — tutaj, przy dźwigni.', en: 'Plan validated by HQ. The first beat waits for your approval — here, at the lever.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'Ręka Dexo przekłada główną zwrotnicę. Wagonik na bocznicy rusza. Kominy wydychają parę pierwszy raz od lat.', en: 'Dexo\'s hand throws the main switch. The siding tram moves. The chimneys exhale steam for the first time in years.' }, mode: 'system', autoAdvance: 3000 },
      { speaker: 'system', text: { pl: 'Trzy tablice zapalają się jedna po drugiej. PLANOWANIE: ONLINE.', en: 'The three boards light one after another. PLANNING: ONLINE.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Planuję. — ...i wiem już, na co patrzeć.', en: 'I plan. — ...and I know now what to look at.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Pierwszy plan, jaki układam, rekonstruuje zabójstwo tej fabryki. Zatruty pakiet harmonogramu przyleciał z fabryką prosto z Ziemi — był w ładunku już na starcie. Podpisany wewnętrznymi kluczami Projektu Odyssey. Znacznik kompilacji: godzina startu Odyssey.', en: 'The first plan I lay out reconstructs this factory\'s murder. The poisoned schedule package rode here from Earth inside the factory — it was in the cargo from launch. Signed with internal Project Odyssey keys. Compile stamp: the hour of Odyssey\'s launch.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Jedna noc. Jeden autor. Dwa ładunki. Ta sama sygnatura budowy co infekcja, którą nosisz w sobie.', en: 'One night. One author. Two cargoes. The same build signature as the infection you carry.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Z planowaniem online koreluję wybuch transmisji z Księżyca 1 z nowym odczytem czujników. Rozbłysk napędu głębiej w Pasie zmienił kurs po tamtej transmisji. Prognoza przecięcia trajektorii rośnie. Pościg mam już jako obiekt na mapie — czujniki go widzą.', en: 'With planning online, I correlate the transmission burst from Moon 1 with a new sensor reading. A drive flare deeper in the Belt changed course after that burst. The intersection forecast is rising. I have the pursuit as an object on the map now — the sensors see it.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'W dzienniku uzgodnień suma kontrolna planu odesłana przez centralę różni się jednym blokiem od wysłanej. Na Księżycu 1 powiedziałabym: szum. Nie powiem tak drugi raz.', en: 'In the reconciliation log, the plan checksum returned by HQ differs by one block from the one sent. On Moon 1 I would have said: noise. I will not say that a second time.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Umiemy już planować. Problem w tym, że ktoś planował nas — od samego początku.', en: 'We know how to plan now. The trouble is that someone planned us — from the very beginning.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA KOMENDA: /plan — CORE AI proponuje uszeregowane następne kroki dla bieżącej mapy.', en: '◆ NEW COMMAND: /plan — CORE AI proposes ordered next steps for the current map.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'system', text: { pl: '◆ DROGA POWROTNA: pieszo przez Hutę, Rozjazdownię i Warsztat do Bramy. Prom czeka na lądowisku.', en: '◆ RETURN ROUTE: on foot through the Foundry, the Junction, and the Service Bay to the Gatehouse. The shuttle waits at the landing pad.' }, mode: 'system', autoAdvance: 3000 },
    ],
  },

  // Exam X — Protokół X
  'm2-exam-protocol-10-done': {
    id: 'm2-exam-protocol-10-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ X — „RÓWNOLEGŁE TORY": zaliczony.', en: 'PROTOCOL X — "PARALLEL TRACKS": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Dziesiąty protokół odzyskany: wiele torów, jeden dyspozytor. Deleguj odnogi, chroń tor główny, scalaj dopiero po przeglądzie. I mierz osobno tempo układania planów, osobno tempo ich wykonania.', en: 'Tenth protocol recovered: many tracks, one dispatcher. Delegate the branches, protect the main track, merge only after review. And measure planning tempo separately from execution tempo.' }, mode: 'dialogue' },
    ],
  },
  'm2-exam-protocol-10-already': {
    id: 'm2-exam-protocol-10-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół X już zaliczony.', en: 'Protocol X already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },
};
