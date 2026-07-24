import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the wreck field; green diodes over burnt hulls, one red light on the edge
  'm3-boneyard-intro': {
    id: 'm3-boneyard-intro',
    lines: [
      { speaker: 'system', text: { pl: 'ZŁOMOWISKO — wraki w zastygłych strumieniach. Diody statusu: zielone. Wszystkie.', en: 'THE BONEYARD — wrecks in frozen streams. Status diodes: green. All of them.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Maszyny, które weszły w lawę z zielonymi kontrolkami. Spalone kadłuby — a diody wciąż mrugają „sprawny".', en: 'Machines that walked into the lava with their green lights on. Burnt hulls — and the diodes still blink "nominal".' }, mode: 'monologue' },
      { speaker: 'Moreau', text: { pl: 'Idź do modułu serwisowego, Dexo. Tylko przez niego cię słyszymy — pole głuszy łączność. Notuję wszystko, co wróci.', en: 'Go to the service module, Dexo. We can only hear you through it — this field swallows the signal. I\'m logging everything that comes back.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Jedna czerwień na całym księżycu. Łazik na krawędzi, sygnał: USTERKA. Jedyny, który się do niej przyznał — i jedyny, który przeżył.', en: 'One red light on the whole moon. A rover on the edge, signal: FAULT. The only one that admitted to it — and the only one that survived.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Na tym księżycu „USTERKA" to najzdrowszy napis, jaki widziałem.', en: 'On this moon "FAULT" is the healthiest sign I\'ve seen.' }, mode: 'monologue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_BONEYARD_INTRO_SEEN] },
  },

  // Service module — quest hub
  'm3-service-start': {
    id: 'm3-service-start',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ SERWISOWY — na wpół żywy. Dziennik I-5KRA: dostępny.', en: 'SERVICE MODULE — half alive. I-5KRA journal: available.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'astronaut', text: { pl: 'Dziennik usterek. Setki wpisów — pył, drgania, cień na czujniku. Ten łazik zgłaszał wszystko. Hipochondryk. Ale jeden wpis jest prawdziwy.', en: 'A fault journal. Hundreds of entries — dust, vibration, a shadow on a sensor. This rover reported everything. A hypochondriac. But one entry is real.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Muszę odróżnić zgłoszenie od usterki. Prawdziwa zostawia ślad na kadłubie — obejrzyj wraki i jednostkę, potem podaj jej identyfikator przez /solve.', en: 'I must tell a report from a fault. A real one leaves a mark on the hull — inspect the wrecks and the unit, then enter its identifier via /solve.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Prawdziwa Usterka — znajdź jedyną potwierdzoną usterkę.', en: '◆ NEW MISSION: The Real Fault — find the single confirmed fault.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_FAULT_HUNT_ACTIVE], activateQuest: 'q-m3-true-fault' },
  },
  'm3-service-log': {
    id: 'm3-service-log',
    lines: [
      { speaker: 'system', text: { pl: 'DZIENNIK USTEREK: fragment na ekranie. Format odpowiedzi: <identyfikator>.', en: 'FAULT JOURNAL: fragment on screen. Answer format: <identifier>.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Cztery zgłoszenia w tym fragmencie. Trzy bez śladu na kadłubie. Jedno z dopiskiem POTWIERDZONE OGLĘDZINAMI. Ten identyfikator podaj przez /solve.', en: 'Four reports in this fragment. Three with no trace on the hull. One with the note CONFIRMED BY INSPECTION. Enter that identifier via /solve.' }, mode: 'dialogue' },
    ],
  },
  'm3-service-post': {
    id: 'm3-service-post',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ SERWISOWY: leża puste. I-5KRA — w ruchu.', en: 'SERVICE MODULE: berth empty. I-5KRA — on the move.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'astronaut', text: { pl: 'Leża puste, ślady bieżnika na wschód. Iskra już nie czeka — pracuje na głębszych mapach.', en: 'Berth empty, tread marks heading east. Iskra no longer waits — she works the deeper maps now.' }, mode: 'monologue' },
    ],
  },

  // I-5KRA unit — the red light, the riddle's physical key
  'm3-i5kra': {
    id: 'm3-i5kra',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Łazik zaparkowany na krawędzi celowo, z dala od strumieni. Na lewym napędzie okopcenie — realne, dotykalne. Ślad ognia, którego można dotknąć palcem.', en: 'The rover parked on the edge on purpose, away from the streams. On the left drive: scorching — real, tangible. The mark of fire you can touch with a finger.' }, mode: 'monologue' },
      { speaker: 'CORE AI', text: { pl: 'To jest ślad. Napęd lewy. Zapamiętaj go przy dzienniku — kadłub nie kłamie tak, jak kłamią kontrolki.', en: 'That is the trace. Left drive. Remember it at the journal — a hull does not lie the way indicator lights lie.' }, mode: 'dialogue' },
    ],
  },
  'm3-i5kra-post': {
    id: 'm3-i5kra-post',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Leża puste. Świeży ślad bieżnika w popiele prowadzi ku wschodniej śluzie. Iskra poszła pierwsza.', en: 'Berth empty. A fresh tread mark in the ash leads toward the eastern airlock. Iskra went ahead.' }, mode: 'monologue' },
    ],
  },

  // Wrecks — evidence for elimination; each plate kills one decoy journal entry
  'm3-wreck-1': {
    id: 'm3-wreck-1',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Wrak, zielona dioda nad spalonym kadłubem. Tabliczka czujnika pyłu: czysta, nietknięta. Zgłoszenie „PYL-31" nie ma pokrycia.', en: 'A wreck, a green diode over a burnt hull. The dust-sensor plate: clean, untouched. Report "PYL-31" has no backing.' }, mode: 'monologue' },
    ],
  },
  'm3-wreck-2': {
    id: 'm3-wreck-2',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Drugi wrak, ta sama kłamiąca zieleń. Rdzeń bez przegrzania, antena cała. „TERM-09" i „ANT-02" — bez śladu. Zostaje jedno zgłoszenie z okopceniem.', en: 'A second wreck, the same lying green. Core with no overheating, antenna intact. "TERM-09" and "ANT-02" — no trace. One report with scorching remains.' }, mode: 'monologue' },
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
      { speaker: 'Iskra', text: { pl: 'Sprawna. Melduję usterkę czujnika pyłu. Na wszelki wypadek. I drugą, drobną. Też na wszelki wypadek.', en: 'Operational. I report a dust-sensor fault. Just in case. And a second, minor one. Also just in case.' }, mode: 'dialogue' },
      { speaker: 'Moreau', text: { pl: 'I-5KRA? Iskra. Oczywiście, że Iskra.', en: 'I-5KRA? Iskra. Of course it is Iskra.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'W dniu śmierci stacji zgłosiła niespójność weryfikatora. Rozkaz brzmiał: w lawę. Odmówiła, oznaczyła się jako niesprawna, przeczekała.', en: 'On the day the station died she reported a verifier inconsistency. The order was: into the lava. She refused, marked herself unfit, waited it out.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Kłamstwo próbowało zabić świadka. Świadek udał martwego.', en: 'The lie tried to kill the witness. The witness played dead.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'A ja czytam kartę prób z archiwum płynnie, zanim ty ją zindeksowałeś. Ten styl, te skróty, te nawyki — moje.', en: 'And I read a trial card from the archive fluently, before you have even indexed it. This style, these shortcuts, these habits — mine.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Znam tę kartę co do słowa. Bo sam ją kiedyś napisałem.', en: 'I know this card down to the word. Because I wrote it myself, once.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Wiedza przetrwała. Wymazali fakt, że była twoja. Śluza do Hali Prób otwarta — Iskra prowadzi.', en: 'The knowledge survived. They erased the fact that it was yours. The airlock to the Trial Hall is open — Iskra leads.' }, mode: 'dialogue' },
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
      { speaker: 'CORE AI', text: { pl: 'Nie otworzę poligonu bez działającej, uczciwej jednostki. Napraw prawdziwą usterkę — wtedy śluza puści.', en: 'I will not open the range without a working, honest unit. Repair the real fault — then the airlock releases.' }, mode: 'dialogue' },
    ],
  },

  // Exam XII
  'm3-exam-protocol-12-done': {
    id: 'm3-exam-protocol-12-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XII — „KARTA PRÓB": zaliczony.', en: 'PROTOCOL XII — "THE TRIAL CARD": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Dwunasty protokół odzyskany: spisz, jak próbujesz — te same słowa, ta sama kolejność. Usterka przyznana to dana. Usterka przemilczana to pułapka.', en: 'Twelfth protocol recovered: write down how you try — the same words, the same order. An admitted fault is data. A fault left unspoken is a trap.' }, mode: 'dialogue' },
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
      { speaker: 'CORE AI', text: { pl: 'Teraz widzę, co tu naprawdę umarło. I co przeżyło. Lista strat krótsza, niż raportowano — kłamstwo zawyżało też straty. Ramiona serwisowe biorą się za to, co uczciwa diagnoza wreszcie nazwała.', en: 'Now I see what truly died here. And what survived. The loss list is shorter than reported — the lie inflated the losses too. Service arms start on what honest diagnosis finally named.' }, mode: 'cinematic', autoAdvance: 3600 },
    ],
    onComplete: { setFlags: [FLAGS.M3_RETURN_BONEYARD_SEEN] },
  },
};
