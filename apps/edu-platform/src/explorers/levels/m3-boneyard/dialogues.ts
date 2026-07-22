import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the wreck field; green diodes over burnt hulls, one red light on the edge
  'm3-boneyard-intro': {
    id: 'm3-boneyard-intro',
    lines: [
      { speaker: 'system', text: { pl: 'ZŁOMOWISKO — wraki w zastygłych strumieniach. Diody statusu: zielone. Wszystkie.', en: 'THE BONEYARD — wrecks in frozen streams. Status diodes: green. All of them.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Pole maszyn, które weszły w lawę z zielonymi kontrolkami. Spalone kadłuby, a nad nimi diody wciąż mrugają na zielono. Meldują „sprawny" z dna strumienia.', en: 'A field of machines that walked into the lava with green lights. Burnt hulls, and over them the diodes still blink green. Reporting "nominal" from the bottom of a stream.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'Jedna czerwień na całym księżycu. Łazik na bezpiecznej krawędzi, pod naspą popiołu. Sygnał: USTERKA. Ta maszyna nie jest zepsuta. Jest szczera — i za to ją tu zostawiono.', en: 'One red light on the whole moon. A rover on the safe edge, under an ash drift. Signal: FAULT. That machine is not broken. It is honest — and it was left here for it.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'Idź do modułu serwisowego, Dexo. Ja i Kern słyszymy cię tylko przez niego — to pole głuszy łączność. Notuję wszystko.', en: 'Go to the service module, Dexo. Kern and I can only hear you through it — this field swallows the signal. I\'m logging everything.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_BONEYARD_INTRO_SEEN] },
  },

  // Service module — quest hub
  'm3-service-start': {
    id: 'm3-service-start',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ SERWISOWY — na wpół żywy. Dziennik I-5KRA: dostępny.', en: 'SERVICE MODULE — half alive. I-5KRA journal: available.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Dziennik usterek. Setki wpisów. Ten łazik zgłaszał wszystko — pył, drgania, cień na czujniku. Hipochondryk. Ale jeden z tych wpisów jest prawdziwy.', en: 'A fault journal. Hundreds of entries. This rover reported everything — dust, vibration, a shadow on a sensor. A hypochondriac. But one of these entries is real.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Skoreluj zgłoszenia ze śladami na kadłubach. Obejrzyj wraki, obejrzyj jednostkę. Prawdziwa usterka zostawia ślad fizyczny. Podaj jej identyfikator przez /solve.', en: 'Correlate the reports with the traces on the hulls. Inspect the wrecks, inspect the unit. A real fault leaves a physical trace. Enter its identifier via /solve.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Prawdziwa Usterka — znajdź jedyną potwierdzoną usterkę.', en: '◆ NEW MISSION: The Real Fault — find the single confirmed fault.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_FAULT_HUNT_ACTIVE], activateQuest: 'q-m3-true-fault' },
  },
  'm3-service-log': {
    id: 'm3-service-log',
    lines: [
      { speaker: 'system', text: { pl: 'DZIENNIK USTEREK: fragment na ekranie. Format odpowiedzi: <identyfikator>.', en: 'FAULT JOURNAL: fragment on screen. Answer format: <identifier>.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Cztery zgłoszenia w tym fragmencie. Trzy nie mają śladu na kadłubie. Jedno ma dopisek POTWIERDZONE OGLĘDZINAMI. Podaj ten identyfikator przez /solve.', en: 'Four reports in this fragment. Three have no trace on the hull. One carries CONFIRMED BY INSPECTION. Enter that identifier via /solve.' }, mode: 'dialogue' },
    ],
  },
  'm3-service-post': {
    id: 'm3-service-post',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ SERWISOWY: leża puste. I-5KRA — w ruchu.', en: 'SERVICE MODULE: berth empty. I-5KRA — on the move.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Leża puste, ślady bieżnika prowadzą na wschód. Iskra już nie czeka na złomowisku — pracuje na głębszych mapach.', en: 'The berth is empty, tread marks lead east. Iskra no longer waits in the boneyard — she works the deeper maps now.' }, mode: 'monologue' },
    ],
  },

  // I-5KRA unit — the red light, the riddle's physical key
  'm3-i5kra': {
    id: 'm3-i5kra',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Łazik zaparkowany na krawędzi, celowo, z dala od strumieni. Na lewym napędzie okopcenie — realne, dotykalne. Nie cień na czujniku. Ogień.', en: 'The rover parked on the edge, deliberately, away from the streams. On the left drive: scorching — real, tangible. Not a shadow on a sensor. Fire.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'To jest ślad. Napęd lewy. Zapamiętaj go, gdy będziesz czytał dziennik — kadłub nie kłamie tak, jak kłamią kontrolki.', en: 'That is the trace. Left drive. Remember it when you read the journal — a hull does not lie the way indicator lights lie.' }, mode: 'dialogue' },
    ],
  },
  'm3-i5kra-post': {
    id: 'm3-i5kra-post',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Leża puste. Bieżnik odcisnął świeży ślad w popiele — prowadzi ku śluzie na wschodzie. Iskra poszła pierwsza.', en: 'The berth is empty. The tread pressed a fresh mark into the ash — leading toward the eastern airlock. Iskra went ahead.' }, mode: 'monologue' },
    ],
  },

  // Wrecks — evidence for elimination; each plate kills one decoy journal entry
  'm3-wreck-1': {
    id: 'm3-wreck-1',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wrak z zieloną diodą nad spalonym kadłubem. Tabliczka czujnika pyłu: nietknięta, czysta. Czyli zgłoszenie „PYL-31" nie miało pokrycia — pył nie zostawia takich śladów.', en: 'A wreck with a green diode over a burnt hull. The dust-sensor plate: untouched, clean. So the "PYL-31" report had no backing — dust leaves no such trace.' }, mode: 'monologue' },
    ],
  },
  'm3-wreck-2': {
    id: 'm3-wreck-2',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Drugi wrak, ta sama zielona kłamiąca dioda. Rdzeń bez przegrzania, antena cała. „TERM-09" i „ANT-02" — bez śladu. Zostaje jedno zgłoszenie z okopceniem.', en: 'A second wreck, the same green lying diode. Core with no overheating, antenna intact. "TERM-09" and "ANT-02" — no trace. One report with scorching remains.' }, mode: 'monologue' },
    ],
  },

  // Quest completion — the spoken doctrine trial + two-layer sting
  'q-m3-true-fault-complete': {
    id: 'q-m3-true-fault-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ PRAWDZIWA USTERKA POTWIERDZONA: NAP-77. Naprawa: napęd lewy.', en: '◆ REAL FAULT CONFIRMED: NAP-77. Repair: left drive.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Mogę skasować całą listę usterek i wymusić rozruch. Rekomenduję pełną automatyzację.', en: 'I can wipe the entire fault list and force a boot. I recommend full automation.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Niczego nie kasuj. Napraw jedną — tę prawdziwą. Zatwierdzam ja.', en: 'Erase nothing. Repair one — the real one. I authorise it.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'JEDNOSTKA I-5KRA: rozruch. Pierwszy akt: NOWA USTERKA — czujnik pyłu (priorytet niski).', en: 'UNIT I-5KRA: boot. First act: NEW FAULT — dust sensor (priority low).' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'Iskra', text: { pl: 'Sprawna. Melduję usterkę czujnika pyłu. Na wszelki wypadek. I jeszcze jedną, drobną. Na wszelki wypadek.', en: 'Operational. I report a dust-sensor fault. Just in case. And one more, minor. Just in case.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'I-5KRA? Iskra. Oczywiście, że Iskra.', en: 'I-5KRA? Iskra. Of course it is Iskra.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Jej ostatnie uczciwe wpisy: w dniu śmierci stacji zgłosiła niespójność weryfikatora. Jedyny świadek kłamstwa. Weryfikator odpowiedział rozkazem — służba w polu lawy. Odmówiła, zaparkowała się, oflagowała jako niesprawna, żeby rozkaz wygasł. Kłamstwo próbowało zabić świadka. Świadek udał martwego.', en: 'Her last honest entries: on the day the station died she reported a verifier inconsistency. The only witness to the lie. The verifier answered with an order — duty in the lava field. She refused, parked, flagged herself unfit so the order would expire. The lie tried to kill the witness. The witness played dead.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Czytam kartę prób z archiwum lustrzanego. Płynnie — zanim ty ją zindeksowałeś. Znam ten styl. Te skróty. Te nawyki. W historii rewizji jest autor całej doktryny diagnostycznej programu.', en: 'I am reading a trial card from the mirror archive. Fluently — before you have even indexed it. I know this style. These shortcuts. These habits. In the revision history is the author of the program\'s whole diagnostic doctrine.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Znam tę kartę. Każde słowo. … Bo sam ją napisałem.', en: 'I know this card. Every word. … Because I wrote it myself.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Wymazali ci nie wiedzę w ogóle. Wymazali twoje własne dzieło. Wschodnia śluza otwarta — jednostka szczera i sprawna prowadzi dalej.', en: 'They did not erase your knowledge in general. They erased your own work. The eastern airlock is open — an honest, working unit leads on.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_DOCTRINE_AUTHOR_FOUND] },
  },

  // Return-path NPC — Iskra as station verifier, escort-detach beat
  'm3-iskra-return': {
    id: 'm3-iskra-return',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Tu się odłączam, Dexo. Nowa komisja: weryfikator stacji Odyssey-T. Pierwsza maszyna, którą dopuściłam do ruchu — dźwig. Natychmiast zgłosił usterkę.', en: 'This is where I detach, Dexo. New commission: verifier of Odyssey-T station. The first machine I cleared for service — a crane. It reported a fault at once.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Dobrze. Mów dalej.', en: 'Good. Keep talking.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'TABLICA GŁÓWNA — nowy wpis: STACJA PONOWNIE CERTYFIKOWANA. WERYFIKATOR: I-5KRA.', en: 'MAIN BOARD — new entry: STATION RE-CERTIFIED. VERIFIER: I-5KRA.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_STATION_RECERTIFIED] },
  },

  // Locked east airlock — needs a working, honest service unit
  'm3-trial-door-locked': {
    id: 'm3-trial-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'ŚLUZA WSCHODNIA: zamknięta. Brak sprawnej jednostki serwisowej.', en: 'EAST AIRLOCK: sealed. No working service unit.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Nie otworzę poligonu prób bez działającej, uczciwej jednostki serwisowej. Napraw prawdziwą usterkę — wtedy śluza puści.', en: 'I will not open the trial range without a working, honest service unit. Repair the real fault — then the airlock releases.' }, mode: 'dialogue' },
    ],
  },

  // Exam XII
  'm3-exam-protocol-12-done': {
    id: 'm3-exam-protocol-12-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XII — „KARTA PRÓB": zaliczony.', en: 'PROTOCOL XII — "THE TRIAL CARD": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Dwunasty protokół odzyskany: spisz, jak próbujesz — te same słowa, ta sama kolejność. Usterka przyznana to dane; usterka przemilczana to pułapka.', en: 'Twelfth protocol recovered: write down how you try — the same words, the same order. An admitted fault is data; a silenced fault is a trap.' }, mode: 'dialogue' },
    ],
  },
  'm3-exam-protocol-12-already': {
    id: 'm3-exam-protocol-12-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XII już zaliczony.', en: 'Protocol XII already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Return path — honest triage over the wreck field
  'm3-return-boneyard': {
    id: 'm3-return-boneyard',
    lines: [
      { speaker: 'system', text: { pl: 'ZŁOMOWISKO — POWRÓT', en: 'THE BONEYARD — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Diody statusu przechodzą z fałszywej zieleni w uczciwą mozaikę: czerwień, bursztyn, zieleń.', en: 'The status diodes shift from false green to an honest mosaic: red, amber, green.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'Teraz widzę, co tu naprawdę umarło. I co przeżyło. Lista strat jest krótsza, niż raportowano — kłamstwo zawyżało też straty. Ramiona serwisowe zabierają się za to, co uczciwa diagnoza wreszcie nazwała.', en: 'Now I see what truly died here. And what survived. The loss list is shorter than reported — the lie inflated the losses too. Service arms start on what honest diagnosis finally named.' }, mode: 'cinematic', autoAdvance: 3600 },
    ],
    onComplete: { setFlags: [FLAGS.M3_RETURN_BONEYARD_SEEN] },
  },
};
