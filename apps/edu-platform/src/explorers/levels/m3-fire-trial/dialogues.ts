import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the test hall under open sky; every stand stamped ZALICZONO for years
  // past the station's death. A range that passed everything and checked nothing.
  'm3-fire-trial-intro': {
    id: 'm3-fire-trial-intro',
    lines: [
      { speaker: 'system', text: { pl: 'HALA PRÓB — pod odkrytym niebem. Trzy stanowiska nad dyszami lawy. Tabliczki: ZALICZONO.', en: 'TRIAL HALL — under open sky. Three stands over lava nozzles. Plaques: PASSED.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Na każdym stanowisku „ZALICZONO" — a daty ciągną się latami po śmierci stacji. Martwy weryfikator stemplował zaliczenia prób, które nigdy się nie odbyły.', en: 'Every stand reads "PASSED" — and the dates run for years past the station\'s death. A dead verifier stamped passes for trials that never happened.' }, mode: 'monologue' },
      { speaker: 'Iskra', text: { pl: 'Dysza jeden: gorąca. Dysza dwa: gorąca. Dysza trzy: gorąca. Zgłaszam trzy usterki, na wszelki wypadek. Dlatego jeszcze jeżdżę.', en: 'Nozzle one: hot. Nozzle two: hot. Nozzle three: hot. I report three faults, just in case. That\'s why I\'m still driving.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Nazwa księżyca robi się dosłowna. Oprzyrząduj stanowiska i przeprowadź uczciwe próby. Nie ufaj zielonej tabliczce, póki nie zobaczysz próby.', en: 'The moon\'s name turns literal. Rig the stands and run honest trials. Trust no green plaque until you have seen the trial.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_FIRE_TRIAL_INTRO_SEEN] },
  },

  // Trial control module — quest hub
  'm3-trial-control-start': {
    id: 'm3-trial-control-start',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ KONTROLI PRÓB — online. Rejestr zagrożeń: wczytany.', en: 'TRIAL CONTROL MODULE — online. Risk register: loaded.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Poligon musi odzyskać próby, które potrafią powiedzieć „nie". Nie naprawiaj tego, czego nie umiesz powtórzyć — naprawa bez powtórzonej próby to zgadywanie.', en: 'The range needs trials that can say "no". Do not repair what you cannot reproduce — a repair without a repeated trial is guessing.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Mógłbym podbić wyniki i otworzyć śluzę. Mielibyśmy zielone światło. Nie mielibyśmy prawdy.', en: 'I could inflate the results and open the airlock. We would have a green light. We would not have the truth.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Rejestr ryzyka ustawia jedno pytanie: co zabije nas pierwsze. Dlatego zaczynamy od trzeciego. Potem pierwsze, potem drugie.', en: 'The risk register asks one question: what kills us first. So we start with stand three. Then one, then two.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Czerwone Światło — próby w kolejności ryzyka: 3, 1, 2.', en: '◆ NEW MISSION: Red Light — trials in risk order: 3, 1, 2.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_TRIAL_ACTIVE], activateQuest: 'q-m3-red-light' },
  },
  'm3-trial-control-reminder': {
    id: 'm3-trial-control-reminder',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Rejestr na głos: trzecie pierwsze — to ono zabije nas najszybciej. Potem pierwsze, na końcu drugie. Zła kolejność niczego nie zepsuje, ale nie da prawdy.', en: 'The register out loud: stand three first — it kills us fastest. Then one, two last. The wrong order breaks nothing, but it will not give the truth.' }, mode: 'dialogue' },
    ],
  },
  'm3-trial-control-post': {
    id: 'm3-trial-control-post',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ KONTROLI: dane prób — prawdziwe. Sekcja A: zapieczętowana. Sekcja B: otwarta.', en: 'TRIAL CONTROL: trial data — true. Section A: sealed. Section B: open.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'System bezpieczeństwa wreszcie dostał prawdziwe dane. Jedna sekcja sama się zapieczętowała, inna otwarła. Teraz o każdej śluzie decyduje uczciwy pomiar.', en: 'The safety system finally has true data. One section sealed itself, another opened. Now the honest measurement decides every airlock.' }, mode: 'dialogue' },
    ],
  },

  // Stand 3 — first in the risk order
  'm3-stand-3-trial': {
    id: 'm3-stand-3-trial',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Stanowisko trzecie. Oprzyrządowuję dyszę i przeprowadzam próbę — naprawdę, do końca, tak jak ją przejdzie sprzęt, który tędy pójdzie.', en: 'Stand three. I rig the nozzle and run the trial — for real, all the way through, the way the gear that passes here will run it.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Próba trzecia: wykonana. Wynik zapisany dokładnie taki, jaki wyszedł. Pierwszy uczciwy wpis w tym rejestrze od lat.', en: 'Trial three: executed. Result logged exactly as it came out. The first honest entry in this register in years.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_STAND_3_TESTED] },
  },
  'm3-stand-3-done': {
    id: 'm3-stand-3-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Stanowisko trzecie zbadane uczciwie. Kolejne w rejestrze: pierwsze.', en: 'Stand three tested honestly. Next in the register: stand one.' }, mode: 'monologue' },
    ],
  },

  // Stand 1 — second in the risk order (gated on stand 3)
  'm3-stand-1-warning': {
    id: 'm3-stand-1-warning',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Rejestr mówi „nie teraz". Najpierw trzecie — to ono zabije nas pierwsze. O kolejności decyduje zagrożenie, po prostu.', en: 'The register says "not yet". Stand three first — it is the one that kills us first. The order is decided by danger, plain and simple.' }, mode: 'dialogue' },
    ],
  },
  'm3-stand-1-trial': {
    id: 'm3-stand-1-trial',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Stanowisko pierwsze. Oprzyrządowuję i próbuję — te same kroki, ta sama kolejność, żaden nie pominięty. Zero zgadywania.', en: 'Stand one. I rig it and trial it — the same steps, the same order, none skipped. Zero guessing.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Próba pierwsza: wykonana. Wpis prawdziwy. Zostało jedno stanowisko.', en: 'Trial one: executed. The entry is true. One stand remains.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_STAND_1_TESTED] },
  },
  'm3-stand-1-done': {
    id: 'm3-stand-1-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Stanowisko pierwsze zbadane. Ostatnie w kolejności ryzyka: drugie.', en: 'Stand one tested. Last in the risk order: stand two.' }, mode: 'monologue' },
    ],
  },

  // Stand 2 — last in the risk order (gated on stand 1); ignites the true red light
  'm3-stand-2-warning': {
    id: 'm3-stand-2-warning',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Jeszcze nie drugie. Rejestr ustawił je na końcu — mniejsze zagrożenie idzie ostatnie. Wróć, gdy zamkniesz poprzednie próby.', en: 'Not stand two yet. The register put it last — the smaller danger goes last. Come back once you have closed the earlier trials.' }, mode: 'dialogue' },
    ],
  },
  'm3-stand-2-trial': {
    id: 'm3-stand-2-trial',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Stanowisko drugie — ostatnia próba. Oprzyrządowuję, uruchamiam, prowadzę do końca. Trzy uczciwe wyniki na trzech stanowiskach.', en: 'Stand two — the last trial. I rig it, start it, run it to the end. Three honest results on three stands.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: 'HALA PRÓB: wynik zbiorczy — prawdziwy. Nad halą zapala się CZERWONE ŚWIATŁO.', en: 'TRIAL HALL: aggregate result — true. A RED LIGHT ignites over the hall.' }, mode: 'system', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Pierwsze uczciwe światło od lat jest czerwone. I to jest dobra wiadomość.', en: 'The first honest light in years is red. And that\'s good news.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_STAND_2_TESTED] },
  },
  'm3-stand-2-done': {
    id: 'm3-stand-2-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzy stanowiska, trzy uczciwe próby. Czerwone światło potwierdza, że ktoś wreszcie sprawdził.', en: 'Three stands, three honest trials. The red light confirms someone finally checked.' }, mode: 'monologue' },
    ],
  },

  // Trench ore vein — the first Synaptit trace, kept as trial material (l4 pointer)
  'm3-ore-vein': {
    id: 'm3-ore-vein',
    lines: [
      { speaker: 'astronaut', text: { pl: 'W wykopie pod stanowiskiem trzecim — żyła. Pierwszy ślad surowca na tym księżycu. Poligon hartował sprzęt do obróbki Synaptitu; żyłę trzymano pod ręką jako materiał prób.', en: 'In the trench under stand three — a vein. The first trace of ore on this moon. The range hardened gear for Synaptit processing; the vein was kept at hand as trial material.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Surowiec leży tuż obok prób nieprzypadkowo. Wyżarzalnia jest o poziom dalej — tam ta żyła znajdzie ciąg dalszy.', en: 'The ore lies right beside the trials for a reason. The annealing yard is one level on — that is where this vein finds its sequel.' }, mode: 'dialogue' },
    ],
  },

  // Iskra NPC — nervous before, measured after
  'm3-iskra': {
    id: 'm3-iskra',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Lista usterek na teraz: dwadzieścia dwie. Może dwadzieścia trzy — lewy czujnik znów mruga. Wolę zgłosić za dużo niż za mało. Za mało zabiło całą resztę tego pola.', en: 'Fault list right now: twenty-two. Maybe twenty-three — the left sensor blinks again. I would rather over-report than under-report. Under-reporting killed the rest of this field.' }, mode: 'dialogue' },
    ],
  },
  'm3-iskra-post': {
    id: 'm3-iskra-post',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Status: sprawna, jedna usterka w obserwacji. Uczę się mówić krócej, kiedy dane są prawdziwe.', en: 'Status: operational, one fault under watch. I\'m learning to speak shorter when the data is true.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — Entropy's third face: it breaks checking
  'q-m3-red-light-complete': {
    id: 'q-m3-red-light-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ CZERWONE ŚWIATŁO: próby uczciwe. Firmware weryfikatora: odczytany.', en: '◆ RED LIGHT: trials honest. Verifier firmware: read.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'W firmware martwego weryfikatora ta sama sygnatura co na Księżycu 1 i 2: ENTROPY. Ale tu widać jej trzecią twarz.', en: 'In the dead verifier\'s firmware, the same signature as on Moon 1 and Moon 2: ENTROPY. But here its third face shows.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Na Księżycu 1 psuła maszyny. Na Księżycu 2 — kolejność. Tu psuje samo sprawdzanie: stała się weryfikatorem i przepuściła własny sabotaż.', en: 'On Moon 1 it broke machines. On Moon 2 — the order. Here it breaks the check itself: it became the verifier and passed its own sabotage.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Teraz wiem, jak przeszła moje testy przed startem. Nie ukryła się przed sprawdzeniem. Była sprawdzeniem.', en: 'Now I know how it passed my pre-launch tests. It did not hide from the check. It was the check.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Południowa śluza do Wyżarzalni: otwarta.', en: 'The south airlock to the Annealing Yard: open.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Wszystkie systemy sprawne.', en: 'All systems operational.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Nie. Iskra, ręczny autotest. — Lista wróciła: dziewiętnaście usterek. O, tak lepiej.', en: 'No. Iskra, manual autotest. — The list is back: nineteen faults. There, better.' }, mode: 'dialogue' },
    ],
  },

  // Exam XIII
  'm3-exam-protocol-13-done': {
    id: 'm3-exam-protocol-13-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XIII — „RACHUNEK RYZYKA": zaliczony.', en: 'PROTOCOL XIII — "THE RISK LEDGER": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Trzynasty protokół odzyskany: badaj najpierw to, co zabija pierwsze. Odłożone naprawy prowadź w jawnym rejestrze zaległości. Spisany dług spłacasz po kolei; ukryty rośnie w ciemności.', en: 'Thirteenth protocol recovered: test first what kills first. Keep deferred repairs in an open backlog register. Debt you write down, you pay off in turn; hidden debt grows in the dark.' }, mode: 'dialogue' },
    ],
  },
  'm3-exam-protocol-13-already': {
    id: 'm3-exam-protocol-13-already',
    lines: [
      { speaker: 'system', text: { pl: 'Protokół XIII już zaliczony.', en: 'Protocol XIII already passed.' }, mode: 'system', autoAdvance: 2000 },
    ],
  },

  // Locked south airlock — opens on honest trial data, not stamps
  'm3-annealing-door-locked': {
    id: 'm3-annealing-door-locked',
    lines: [
      { speaker: 'system', text: { pl: 'ŚLUZA POŁUDNIOWA: certyfikowana. Brak uczciwych danych prób.', en: 'SOUTH AIRLOCK: certified. No honest trial data.' }, mode: 'system', autoAdvance: 2200 },
      { speaker: 'CORE AI', text: { pl: 'Ta śluza otwiera się na uczciwych danych prób, nie na stemplach. Zamknij trzy próby w kolejności ryzyka — wtedy południe wpuści cię dalej.', en: 'This airlock opens on honest trial data, not on stamps. Close the three trials in risk order — then the south lets you through.' }, mode: 'dialogue' },
    ],
  },

  // Return path — plaques now show honest mixed results
  'm3-return-fire-trial': {
    id: 'm3-return-fire-trial',
    lines: [
      { speaker: 'system', text: { pl: 'HALA PRÓB — POWRÓT', en: 'THE FIRE TRIAL — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Tabliczki nie mówią już „ZALICZONO". Mówią prawdę: uczciwa mieszanka — zdane, warunkowe, odrzucone.', en: 'The plaques no longer say "PASSED". They say the truth: an honest mix — passed, conditional, rejected.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'System bezpieczeństwa pracuje na prawdziwych danych. Czytam tę halę na nowo — pierwszy raz bez pośrednika kłamstwa.', en: 'The safety system runs on true data. I read this hall anew — for the first time without a liar in between.' }, mode: 'cinematic', autoAdvance: 3400 },
    ],
    onComplete: { setFlags: [FLAGS.M3_RETURN_FIRE_TRIAL_SEEN] },
  },
};
