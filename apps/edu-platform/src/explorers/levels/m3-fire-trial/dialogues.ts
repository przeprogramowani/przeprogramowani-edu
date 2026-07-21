import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // Intro — the test hall under open sky; every stand stamped ZALICZONO for years
  // past the station's death. A range that passed everything and checked nothing.
  'm3-fire-trial-intro': {
    id: 'm3-fire-trial-intro',
    lines: [
      { speaker: 'system', text: { pl: 'HALA PRÓB — pod odkrytym niebem. Trzy stanowiska nad dyszami lawy. Tabliczki: ZALICZONO.', en: 'TRIAL HALL — under open sky. Three stands over lava nozzles. Plaques: PASSED.' }, mode: 'cinematic', autoAdvance: 2800 },
      { speaker: 'astronaut', text: { pl: 'Poligon prób. Na każdym stanowisku tabliczka „ZALICZONO" — a daty ciągną się latami po śmierci stacji. Podstemplował je martwy weryfikator. Poligon, który wszystko zaliczał i niczego nie sprawdzał.', en: 'The proving range. Every stand carries a "PASSED" plaque — and the dates run for years past the station\'s death. A dead verifier stamped them. A range that passed everything and checked nothing.' }, mode: 'monologue' },
      { speaker: 'Iskra', text: { pl: 'Dysza jeden: gorąca. Dysza dwa: gorąca. Dysza trzy: gorąca. Zgłaszam trzy usterki, na wszelki wypadek. Zawsze zgłaszam. Dzięki temu jeszcze jeżdżę.', en: 'Nozzle one: hot. Nozzle two: hot. Nozzle three: hot. I report three faults, just in case. I always report. That is why I am still driving.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Nazwa księżyca robi się dosłowna. Oprzyrząduj stanowiska i przeprowadź uczciwe próby. Nie ufaj żadnej zielonej tabliczce, dopóki sam nie zobaczysz próby.', en: 'The moon\'s name turns literal. Rig the stands and run honest trials. Trust no green plaque until you have seen the trial yourself.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_FIRE_TRIAL_INTRO_SEEN] },
  },

  // Trial control module — quest hub
  'm3-trial-control-start': {
    id: 'm3-trial-control-start',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ KONTROLI PRÓB — online. Rejestr zagrożeń: wczytany.', en: 'TRIAL CONTROL MODULE — online. Risk register: loaded.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'Doktryna poligonu: nie naprawiaj tego, czego nie potrafisz powtórzyć. Naprawa bez powtórzonej próby to zgadywanie. Mógłbym podbić wyniki i otworzyć śluzę. Mielibyśmy zielone światło. Nie mielibyśmy prawdy.', en: 'The range doctrine: do not repair what you cannot reproduce. A repair without a repeated trial is guessing. I could inflate the results and open the airlock. We would have a green light. We would not have the truth.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Czytam rejestr ryzyka. Kolejność prób nie idzie po mapie — idzie po pytaniu: co zabije nas pierwsze. Zaczynamy od stanowiska trzeciego. Potem pierwsze, potem drugie.', en: 'I am reading the risk register. The trial order does not follow the map — it follows one question: what kills us first. We start with stand three. Then one, then two.' }, mode: 'dialogue' },
      { speaker: 'system', text: { pl: '◆ NOWA MISJA: Czerwone Światło — próby w kolejności ryzyka: 3, 1, 2.', en: '◆ NEW MISSION: Red Light — trials in risk order: 3, 1, 2.' }, mode: 'system', autoAdvance: 2800 },
    ],
    onComplete: { setFlags: [FLAGS.M3_TRIAL_ACTIVE], activateQuest: 'q-m3-red-light' },
  },
  'm3-trial-control-reminder': {
    id: 'm3-trial-control-reminder',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Rejestr ryzyka, na głos: najpierw stanowisko trzecie — to ono zabije nas pierwsze. Potem pierwsze. Na końcu drugie. Zła kolejność niczego nie zepsuje, ale nie da prawdy.', en: 'The risk register, out loud: stand three first — it is the one that kills us first. Then stand one. Stand two last. The wrong order breaks nothing, but it will not give the truth.' }, mode: 'dialogue' },
    ],
  },
  'm3-trial-control-post': {
    id: 'm3-trial-control-post',
    lines: [
      { speaker: 'system', text: { pl: 'MODUŁ KONTROLI: dane prób — prawdziwe. Sekcja A: zapieczętowana. Sekcja B: otwarta.', en: 'TRIAL CONTROL: trial data — true. Section A: sealed. Section B: open.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'System bezpieczeństwa wreszcie dostał prawdziwe dane. Jedna sekcja sama się zapieczętowała, inna się otworzyła. Tak to ma działać: uczciwy pomiar rządzi śluzami, nie stempel.', en: 'The safety system finally has true data. One section sealed itself, another opened. This is how it should work: an honest measurement rules the airlocks, not a stamp.' }, mode: 'dialogue' },
    ],
  },

  // Stand 3 — first in the risk order
  'm3-stand-3-trial': {
    id: 'm3-stand-3-trial',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Stanowisko trzecie. Oprzyrządowuję dyszę i przeprowadzam próbę — naprawdę, do końca, tak jak ją przejdzie sprzęt, który tędy pójdzie.', en: 'Stand three. I rig the nozzle and run the trial — for real, all the way through, the way the gear that passes here will run it.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Próba trzecia: wykonana. Wynik zapisany taki, jaki jest — nie taki, jaki miałby być. Pierwszy uczciwy wpis w tym rejestrze od lat.', en: 'Trial three: executed. Result logged as it is — not as it should be. The first honest entry in this register in years.' }, mode: 'dialogue' },
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
      { speaker: 'Iskra', text: { pl: 'Rejestr ryzyka mówi „nie teraz". Najpierw stanowisko trzecie — to ono zabije nas pierwsze. Kolejności nie ustala wygoda, tylko zagrożenie.', en: 'The risk register says "not yet". Stand three first — it is the one that kills us first. Convenience does not set the order, danger does.' }, mode: 'dialogue' },
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
      { speaker: 'astronaut', text: { pl: 'Pierwsze uczciwe światło od lat jest czerwone. I to jest dobra wiadomość.', en: 'The first honest light in years is red. And that is good news.' }, mode: 'dialogue' },
    ],
    onComplete: { setFlags: [FLAGS.M3_STAND_2_TESTED] },
  },
  'm3-stand-2-done': {
    id: 'm3-stand-2-done',
    lines: [
      { speaker: 'astronaut', text: { pl: 'Trzy stanowiska, trzy uczciwe próby. Czerwone światło pali się nad halą jak dowód, że ktoś wreszcie sprawdził.', en: 'Three stands, three honest trials. The red light burns over the hall like proof that someone finally checked.' }, mode: 'monologue' },
    ],
  },

  // Trench ore vein — the first Synaptit trace, kept as trial material (l4 pointer)
  'm3-ore-vein': {
    id: 'm3-ore-vein',
    lines: [
      { speaker: 'astronaut', text: { pl: 'W wykopie pod stanowiskiem trzecim — żyła. Pierwszy ślad surowca na tym księżycu. Poligon hartował sprzęt do obróbki Synaptitu; żyłę trzymano pod ręką jako materiał prób.', en: 'In the trench under stand three — a vein. The first trace of ore on this moon. The range hardened gear for Synaptit processing; the vein was kept at hand as trial material.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'To nie przypadek, że surowiec leży tuż obok prób. Wyżarzalnia jest o poziom dalej. Tam ta żyła znajdzie swój ciąg dalszy.', en: 'It is no accident the ore lies right beside the trials. The annealing yard is a level on. That is where this vein finds its sequel.' }, mode: 'dialogue' },
    ],
  },

  // Iskra NPC — nervous before, measured after
  'm3-iskra': {
    id: 'm3-iskra',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Lista usterek na teraz: dwadzieścia dwie. Może dwadzieścia trzy — lewy czujnik znów mruga. Wolę zgłosić za dużo niż za mało. Za mało zabiło całą resztę tego pola.', en: 'Fault list for now: twenty-two. Maybe twenty-three — the left sensor blinks again. I would rather over-report than under-report. Under-reporting killed the rest of this field.' }, mode: 'dialogue' },
    ],
  },
  'm3-iskra-post': {
    id: 'm3-iskra-post',
    lines: [
      { speaker: 'Iskra', text: { pl: 'Status: sprawna, jedna usterka w obserwacji. Krótko. Uczę się mówić krócej, kiedy dane są prawdziwe.', en: 'Status: operational, one fault under watch. Short. I am learning to speak shorter when the data is true.' }, mode: 'dialogue' },
    ],
  },

  // Quest completion — Entropy's third face: it breaks checking
  'q-m3-red-light-complete': {
    id: 'q-m3-red-light-complete',
    lines: [
      { speaker: 'system', text: { pl: '◆ CZERWONE ŚWIATŁO: próby uczciwe. Firmware weryfikatora: odczytany.', en: '◆ RED LIGHT: trials honest. Verifier firmware: read.' }, mode: 'system', autoAdvance: 2600 },
      { speaker: 'CORE AI', text: { pl: 'W firmware martwego weryfikatora ta sama sygnatura co w węzłach Księżyca 1 i podstacji Księżyca 2: ENTROPY. Ale tu widać jej trzecią twarz.', en: 'In the dead verifier\'s firmware, the same signature as in Moon 1\'s nodes and Moon 2\'s substation: ENTROPY. But here its third face shows.' }, mode: 'dialogue' },
      { speaker: 'CORE AI', text: { pl: 'Nie psuje maszyn. Nie psuje kolejności. Psuje sprawdzanie. Znam ten podpis. Teraz wiem, jak przeszedł moje testy przed startem. Nie ukrył się przed sprawdzeniem. Był sprawdzeniem.', en: 'It does not break machines. It does not break order. It breaks checking. I know this signature. Now I know how it passed my pre-launch tests. It did not hide from the check. It was the check.' }, mode: 'dialogue' },
      { speaker: 'Iskra', text: { pl: 'Wszystkie systemy sprawne.', en: 'All systems operational.' }, mode: 'dialogue' },
      { speaker: 'astronaut', text: { pl: 'Nie. Iskra, wymuszam autotest ręcznie. — ...Wróciła lista: dziewiętnaście usterek. Dobrze. Nie komentujmy tego.', en: 'No. Iskra, I am forcing a manual autotest. — ...The list returned: nineteen faults. Good. Let us not comment on that.' }, mode: 'dialogue' },
    ],
  },

  // Exam XIII
  'm3-exam-protocol-13-done': {
    id: 'm3-exam-protocol-13-done',
    lines: [
      { speaker: 'system', text: { pl: 'PROTOKÓŁ XIII — „RACHUNEK RYZYKA": zaliczony.', en: 'PROTOCOL XIII — "THE RISK LEDGER": passed.' }, mode: 'system', autoAdvance: 2400 },
      { speaker: 'CORE AI', text: { pl: 'Trzynasty protokół odzyskany: badaj najpierw to, co zabija pierwsze; odłożone naprawy prowadź w jawnym rejestrze zaległości. Dług ukryty rośnie w ciemności; dług spisany można spłacić.', en: 'Thirteenth protocol recovered: test first what kills first; keep deferred repairs in an open backlog register. Hidden debt grows in the dark; written debt can be paid.' }, mode: 'dialogue' },
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
      { speaker: 'CORE AI', text: { pl: 'Ta śluza otwiera się na uczciwych danych prób, nie na stemplach. Zakończ trzy próby w kolejności ryzyka — wtedy południe wpuści cię dalej.', en: 'This airlock opens on honest trial data, not on stamps. Finish the three trials in risk order — then the south lets you through.' }, mode: 'dialogue' },
    ],
  },

  // Return path — plaques now show honest mixed results
  'm3-return-fire-trial': {
    id: 'm3-return-fire-trial',
    lines: [
      { speaker: 'system', text: { pl: 'HALA PRÓB — POWRÓT', en: 'THE FIRE TRIAL — RETURN' }, mode: 'cinematic', autoAdvance: 2400 },
      { speaker: 'system', text: { pl: 'Tabliczki na stanowiskach nie mówią już „ZALICZONO". Mówią prawdę: uczciwa mieszanka — zdane, warunkowe, odrzucone.', en: 'The stand plaques no longer say "PASSED". They say the truth: an honest mix — passed, conditional, rejected.' }, mode: 'cinematic', autoAdvance: 3200 },
      { speaker: 'CORE AI', text: { pl: 'System bezpieczeństwa pracuje na prawdziwych danych. Czytam tę halę na nowo — pierwszy raz bez pośrednika kłamstwa.', en: 'The safety system runs on true data. I read this hall anew — for the first time without a liar in between.' }, mode: 'cinematic', autoAdvance: 3400 },
    ],
    onComplete: { setFlags: [FLAGS.M3_RETURN_FIRE_TRIAL_SEEN] },
  },
};
