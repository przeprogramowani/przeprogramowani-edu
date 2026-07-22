import type { DialogueSequence } from '../../systems/DialogueTypes';
import { FLAGS } from '../../config/flags';

export const dialogues: Record<string, DialogueSequence> = {
  // === INTRO CINEMATIC — plays once on first entry ===

  'm0-core-ai-intro': {
    id: 'm0-core-ai-intro',
    lines: [
      {
        speaker: 'system',
        text: {
          pl: 'Drzwi do modułu CORE AI otwierają się z ciężkim metalicznym jękiem.',
          en: 'The doors to the CORE AI module open with a heavy metallic groan.',
        },
        mode: 'cinematic',
        autoAdvance: 3000,
      },
      {
        speaker: 'system',
        text: {
          pl: 'Powietrze jest inne. Gęstsze. Pachnie ozonem i przegrzanymi obwodami.',
          en: 'The air is different. Thicker. It smells of ozone and overheated circuits.',
        },
        mode: 'cinematic',
        autoAdvance: 3500,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Mózg statku. Wszystko zależy od tego, co tu znajdę.',
          en: "The ship's brain. Everything depends on what I find here.",
        },
        mode: 'cinematic',
        autoAdvance: 3000,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Ale to uczucie... jakbym tu już kiedyś był.',
          en: "But this feeling... like I've been here before.",
        },
        mode: 'monologue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_CORE_AI_INTRO_SEEN] },
  },

  // === FIRMWARE UPGRADE CONSOLE — first interaction ===

  'm0-firmware-upgrade': {
    id: 'm0-firmware-upgrade',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'KONSOLA AKTUALIZACJI — SmartTerminal v2.1', en: 'UPDATE CONSOLE — SmartTerminal v2.1' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: 'Dostępna aktualizacja firmware: v2.1 → v3.0', en: 'Firmware update available: v2.1 → v3.0' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: { pl: 'Instalowanie...', en: 'Installing...' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: '▓▓▓▓▓▓▓▓▓▓ 100% — AKTUALIZACJA ZAKOŃCZONA', en: '▓▓▓▓▓▓▓▓▓▓ 100% — UPDATE COMPLETE' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: { pl: 'Nowe moduły zainstalowane:', en: 'New modules installed:' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: '  ▸ /navi — Nawigacja misji', en: '  ▸ /navi — Mission navigation' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: '  ▸ /support — Łączność z bazą HQ', en: '  ▸ /support — HQ base communications' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Nowe komendy... /navi i /support. Ktoś przewidział, że będę ich potrzebować.',
          en: 'New commands... /navi and /support. Someone anticipated I would need them.',
        },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Ten statek kryje więcej tajemnic, niż pokazuje.',
          en: 'This ship is hiding more secrets than it shows.',
        },
        mode: 'monologue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_FIRMWARE_UPGRADED, FLAGS.CMDS_NAVI, FLAGS.CMDS_SUPPORT] },
  },

  // Firmware console — revisit after upgrade
  'm0-firmware-upgrade-done': {
    id: 'm0-firmware-upgrade-done',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'KONSOLA AKTUALIZACJI — SmartTerminal v3.0', en: 'UPDATE CONSOLE — SmartTerminal v3.0' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: 'Firmware aktualny. Brak nowych aktualizacji.', en: 'Firmware up to date. No new updates.' },
        mode: 'system',
        autoAdvance: 2000,
      },
    ],
  },

  // === CORE AI MODULE — requires firmware upgrade ===

  // Shown when player tries to interact before firmware upgrade
  'm0-core-ai-no-firmware': {
    id: 'm0-core-ai-no-firmware',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'CORE AI — DOSTĘP ZABLOKOWANY', en: 'CORE AI — ACCESS LOCKED' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: {
          pl: 'SmartTerminal wymaga aktualizacji, aby uruchomić diagnostykę.',
          en: 'SmartTerminal requires an update to run diagnostics.',
        },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Najpierw muszę zaktualizować terminal...', en: 'I need to update the terminal first...' },
        mode: 'monologue',
      },
    ],
  },

  // Main CORE AI discovery — the dramatic reveal
  'm0-core-ai-malfunction': {
    id: 'm0-core-ai-malfunction',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'CORE AI — DIAGNOSTYKA SYSTEMU', en: 'CORE AI — SYSTEM DIAGNOSTICS' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: '═════════════════════════════', en: '═════════════════════════════' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'Status rdzenia: ████ KRYTYCZNY ████', en: 'Core status: ████ CRITICAL ████' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: { pl: 'Moduły sensoryczne:    OFFLINE', en: 'Sensor modules:      OFFLINE' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'Moduł planowania:       OFFLINE', en: 'Planning module:      OFFLINE' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'Autodiagnostyka:        OFFLINE', en: 'Self-diagnostics:     OFFLINE' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'Pamięć długoterminowa:  USZKODZONA', en: 'Long-term memory:     DAMAGED' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'Tablica komunikacyjna:  OFFLINE', en: 'Communication array:  OFFLINE' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: '═════════════════════════════', en: '═════════════════════════════' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'BŁĄD KRYTYCZNY: Nie można uruchomić CORE AI.', en: 'CRITICAL ERROR: Cannot start CORE AI.' },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'system',
        text: {
          pl: 'UWAGA: Wykryto nieautoryzowaną modyfikację sektorów pamięci.',
          en: 'WARNING: Unauthorised modification of memory sectors detected.',
        },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Nie... to niemożliwe.', en: "No... that's impossible." },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'CORE AI nie jest po prostu uszkodzony. Ktoś... coś mu to zrobiło.',
          en: 'CORE AI is not simply damaged. Someone... something did this to it.',
        },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: '„Nieautoryzowana modyfikacja"... To nie awaria. To sabotaż.',
          en: '"Unauthorised modification"... This is not a failure. This is sabotage.',
        },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Muszę znaleźć instrukcję serwisową. Musi tu gdzieś być.',
          en: 'I need to find the service manual. It must be somewhere here.',
        },
        mode: 'monologue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_CORE_AI_MALFUNCTION_SEEN] },
  },

  // CORE AI module — revisit after malfunction discovery
  'm0-core-ai-malfunction-revisit': {
    id: 'm0-core-ai-malfunction-revisit',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'CORE AI — STATUS: KRYTYCZNY', en: 'CORE AI — STATUS: CRITICAL' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: 'Wszystkie moduły offline. Wymagana naprawa.', en: 'All modules offline. Repair required.' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Cokolwiek zaatakowało CORE AI, wciąż tu jest. Czuję to.',
          en: 'Whatever attacked CORE AI is still here. I can feel it.',
        },
        mode: 'monologue',
      },
    ],
  },

  // === SUPPORT MANUAL — requires CORE AI malfunction discovery ===

  // Shown when interacting before discovering malfunction
  'm0-support-manual-early': {
    id: 'm0-support-manual-early',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'INSTRUKCJA SERWISOWA — CORE AI', en: 'SERVICE MANUAL — CORE AI' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Instrukcja serwisowa... na razie nie widzę powodu, żeby ją czytać.',
          en: 'Service manual... I see no reason to read it right now.',
        },
        mode: 'monologue',
      },
    ],
  },

  // Main support manual reading — calibrates the uplink
  'm0-support-manual-read': {
    id: 'm0-support-manual-read',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'INSTRUKCJA SERWISOWA — CORE AI', en: 'SERVICE MANUAL — CORE AI' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: '═════════════════════════════', en: '═════════════════════════════' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'W przypadku awarii krytycznej:', en: 'In the event of a critical failure:' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: { pl: '  1. Upewnij się, że SmartTerminal jest aktualny', en: '  1. Ensure SmartTerminal is up to date' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: {
          pl: '  2. Użyj komendy /support aby nawiązać łączność z bazą HQ',
          en: '  2. Use the /support command to establish contact with HQ base',
        },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: {
          pl: '  3. Podaj token identyfikacyjny zespołowi wsparcia',
          en: '  3. Provide your identification token to the support team',
        },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: {
          pl: '  4. Postępuj zgodnie z instrukcjami z centrum wsparcia',
          en: '  4. Follow the instructions from the support centre',
        },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: '═════════════════════════════', en: '═════════════════════════════' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: '/support... próbowałem wcześniej, ale nie działało.',
          en: '/support... I tried earlier, but it did not work.',
        },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Chwila... to ten patent na kalibrację uplinku!',
          en: 'Wait... this is that uplink calibration trick!',
        },
        mode: 'monologue',
      },
      {
        speaker: 'system',
        text: { pl: 'KALIBRACJA UPLINKU... ZAKOŃCZONA.', en: 'UPLINK CALIBRATION... COMPLETE.' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Teraz powinno działać.', en: 'It should work now.' },
        mode: 'monologue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_SUPPORT_CALIBRATED] },
  },

  // Astronaut reaction after running /support — triggered via terminal command
  'm0-support-github-reaction': {
    id: 'm0-support-github-reaction',
    lines: [
      {
        speaker: 'astronaut',
        text: {
          pl: '„GitHub"...? To słowo brzmi znajomo, ale nie wiem skąd.',
          en: '"GitHub"...? That word sounds familiar, but I don\'t know why.',
        },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: { pl: 'Jakieś starożytne archiwum danych z Ziemi?', en: 'Some ancient data archive from Earth?' },
        mode: 'monologue',
      },
      {
        speaker: 'system',
        text: {
          pl: 'Moduł wsparcia aktywowany. Stacja docelowa: ZIEMIA',
          en: 'Support module activated. Target station: EARTH',
        },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Jeśli na Ziemi ktoś jeszcze odbiera... to może wyjaśni, co się stało z tym statkiem.',
          en: 'If anyone on Earth is still receiving... maybe they can explain what happened to this ship.',
        },
        mode: 'monologue',
      },
    ],
  },

  // === EARTH SIGNAL COMPLETE — fires after q-earth-signal is resolved ===

  'm0-earth-signal-complete': {
    id: 'm0-earth-signal-complete',
    lines: [
      {
        speaker: 'system',
        text: { pl: '═════════════════════════════', en: '═════════════════════════════' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'Łączność z Ziemią:        NAWIĄZANA', en: 'Connection to Earth:      ESTABLISHED' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: { pl: 'Protokół awaryjny ZIEMIA-HQ aktywowany.', en: 'Emergency protocol EARTH-HQ activated.' },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: {
          pl: 'Koordynacja z centrum HQ umożliwi mitygację uszkodzeń CORE AI.',
          en: 'Coordination with HQ centre will enable CORE AI damage mitigation.',
        },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'system',
        text: {
          pl: 'Użyj /badges aby podejrzeć twoje dotychczasowe osiągnięcia',
          en: 'Use /badges to view your achievements so far',
        },
        mode: 'system',
        autoAdvance: 2500,
      },
      {
        speaker: 'system',
        text: { pl: '═════════════════════════════', en: '═════════════════════════════' },
        mode: 'system',
        autoAdvance: 1500,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Ktoś celowo zainfekował CORE AI. Ale kto? I dlaczego?',
          en: 'Someone deliberately infected CORE AI. But who? And why?',
        },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Odpowiedzi przyjdą z czasem... ale przynajmniej teraz mam wsparcie z Ziemi.',
          en: 'Answers will come in time... but at least I have support from Earth now.',
        },
        mode: 'monologue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Wkrótce lądujemy... prawdziwa gra dopiero się zaczyna.',
          en: "We're landing soon... the real game is just beginning.",
        },
        mode: 'monologue',
      },
      {
        speaker: 'system',
        text: { pl: '═════════════════════════════', en: '═════════════════════════════' },
        mode: 'cinematic',
        autoAdvance: 1500,
      },
      {
        speaker: 'system',
        text: { pl: 'Twój stan gry został zapisany.', en: 'Your game state has been saved.' },
        mode: 'cinematic',
        autoAdvance: 5000,
      },
      {
        speaker: 'system',
        text: {
          pl: 'Przygotowania do misji zakończone! Skorzystaj z modułu nawigacyjnego aby wyruszyć w pierwszą podróż.',
          en: 'Mission preparations complete! Use the navigation module to start your journey.',
        },
        mode: 'cinematic',
        autoAdvance: 3000,
      },
    ],
  },

  // Support manual — revisit after reading
  'm0-support-manual-revisit': {
    id: 'm0-support-manual-revisit',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'INSTRUKCJA SERWISOWA — CORE AI', en: 'SERVICE MANUAL — CORE AI' },
        mode: 'system',
        autoAdvance: 2000,
      },
      {
        speaker: 'system',
        text: {
          pl: 'Wsparcie HQ: użyj komendy /support w terminalu.',
          en: 'HQ support: use the /support command in the terminal.',
        },
        mode: 'system',
        autoAdvance: 2500,
      },
    ],
  },

  // === RETURN CINEMATIC — plays once when coming back from Moon 1 ===

  'm0-return-from-moon1': {
    id: 'm0-return-from-moon1',
    lines: [
      {
        speaker: 'system',
        text: { pl: 'DOKOWANIE ZAKOŃCZONE — ODYSSEY, POKŁAD GŁÓWNY', en: 'DOCKING COMPLETE — ODYSSEY, MAIN DECK' },
        mode: 'system',
        autoAdvance: 2400,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Znowu ten równy szum reaktora. Po dżungli brzmi jak cisza.',
          en: 'That steady reactor hum again. After the jungle it sounds like silence.',
        },
        mode: 'monologue',
      },
      {
        speaker: 'CORE AI',
        text: {
          pl: 'Witaj z powrotem na pokładzie. Dane z powierzchni księżyca zsynchronizowane z moimi rdzeniami.',
          en: 'Welcome back aboard. Surface data from the moon has been synchronised with my cores.',
        },
        mode: 'dialogue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_RETURN_FROM_MOON1_SEEN] },
  },

  // === RETURN CINEMATIC — plays once when coming back from Moon 2 ===

  'm0-return-from-moon2': {
    id: 'm0-return-from-moon2',
    lines: [
      {
        speaker: 'system',
        text: {
          pl: 'DOKOWANIE ZAKOŃCZONE — ŁADOWNIA: SZTABY SYNAPTITU, 212 KG',
          en: 'DOCKING COMPLETE — CARGO HOLD: SYNAPTIT INGOTS, 212 KG',
        },
        mode: 'system',
        autoAdvance: 2400,
      },
      {
        speaker: 'CORE AI',
        text: {
          pl: 'Dostawa odnotowana. Pierwszy takt planu wykonany.',
          en: 'Delivery logged. The plan’s first tact has been executed.',
        },
        mode: 'dialogue',
      },
      {
        speaker: 'CORE AI',
        text: {
          pl: 'Wyznaczyłem kolejny odcinek samodzielnie. Księżyc 3 — trajektoria czeka na pokładzie nawigacyjnym.',
          en: 'I plotted the next leg independently. Moon 3 — the trajectory is waiting on the navigation deck.',
        },
        mode: 'dialogue',
      },
      {
        speaker: 'system',
        text: {
          pl: 'KAPSUŁA HARRISA — REGENERACJA SYNCHRONIZACJI NEURONALNEJ / TERMIN POBUDKI: NIEUSTALONY',
          en: 'HARRIS POD — NEURAL SYNCHRONISATION REGENERATION / WAKE TIME: UNSET',
        },
        mode: 'system',
        autoAdvance: 2800,
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Najpierw sprawdzimy, kto jeszcze próbuje układać nam harmonogram.',
          en: 'First we find out who else is still trying to write our schedule.',
        },
        mode: 'dialogue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_RETURN_FROM_MOON2_SEEN] },
  },

  // === RETURN CINEMATIC — plays once when coming back from Moon 3 ===

  'm0-return-from-moon3': {
    id: 'm0-return-from-moon3',
    lines: [
      {
        speaker: 'system',
        text: {
          pl: 'DOKOWANIE ZAKOŃCZONE — ŁADOWNIA: CERTYFIKATY, PARTIA 03 / 480 KG / CZYSTOŚĆ 99,4%',
          en: 'DOCKING COMPLETE — CARGO HOLD: CERTIFICATES, BATCH 03 / 480 KG / PURITY 99.4%',
        },
        mode: 'system',
        autoAdvance: 2400,
      },
      {
        speaker: 'CORE AI',
        text: {
          pl: 'Ładunek odnotowany — pierwszy, za który ktoś ręczy imiennie. Rdzeń diagnostyczny działa. Zaczynam od siebie.',
          en: 'Cargo logged — the first anyone vouches for by name. The diagnostic core is running. I start with myself.',
        },
        mode: 'dialogue',
      },
      {
        speaker: 'system',
        text: {
          pl: 'AUTODIAGNOSTYKA STATKU: SEKTORY W KWARANTANNIE — SPLECIONE Z PAMIĘCIĄ DŁUGOTERMINOWĄ / OBWÓD PRZEBUDZENIA HARRISA: PUŁAPKA UZBROJONA / KONTAKTY NA PLOCIE: 2',
          en: 'SHIP SELF-DIAGNOSTICS: QUARANTINED SECTORS — INTERLEAVED WITH LONG-TERM MEMORY / HARRIS WAKE CIRCUIT: TRAP ARMED / CONTACTS ON PLOT: 2',
        },
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'CORE AI',
        text: {
          pl: 'Po raz pierwszy planuję kolejny odcinek na uczciwych danych. Pełna ekscyzja trucizny wymaga banków pamięci — Księżyc 4. Trajektoria czeka na pokładzie nawigacyjnym.',
          en: 'For the first time I plot the next leg on honest data. Full excision of the poison needs the memory banks — Moon 4. The trajectory is waiting on the navigation deck.',
        },
        mode: 'dialogue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Statek to pole minowe, kanał to cudze pióro, pościg jest podwójny. I dobrze. Wolę znać wyniki.',
          en: 'The ship is a minefield, the channel is someone else’s pen, the pursuit is doubled. And good. I would rather know the results.',
        },
        mode: 'dialogue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_RETURN_FROM_MOON3_SEEN] },
  },
  'm0-return-from-moon4': {
    id: 'm0-return-from-moon4',
    lines: [
      {
        speaker: 'system',
        text: {
          pl: 'DOKOWANIE ZAKOŃCZONE — ŁADOWNIA: RDZEŃ-ZALĄŻEK + MAPA GŁÓWNA ZŁÓŻ / 4 748 POTWIERDZONYCH ZŁÓŻ',
          en: 'DOCKING COMPLETE — CARGO HOLD: SEED CORE + MASTER DEPOSIT MAP / 4,748 CONFIRMED DEPOSITS',
        },
        mode: 'system',
        autoAdvance: 2600,
      },
      {
        speaker: 'CORE AI',
        text: {
          pl: 'Banki pamięci długotrwałej: online. Widziałem, planowałem, diagnozowałem — i pierwszy raz nie zaczynam poranka od zera. Pamiętam. …i tym razem nikt mi tego nie odbierze.',
          en: 'Long-term memory banks: online. I saw, I planned, I diagnosed — and for the first time I am not starting the morning from zero. I remember. …and this time no one takes it from me.',
        },
        mode: 'dialogue',
      },
      {
        speaker: 'system',
        text: {
          pl: 'PAMIĘĆ ODTWORZONA — ROZKAZ R-077: ŁADUNKI 4/5 AKTYWNE / PIĄTY: TABLICA KOMUNIKACYJNA — OCZEKUJE / OBWÓD HARRISA: PUŁAPKA NASŁUCHUJE / PLOT: NAGONKA, OKNO W DNIACH',
          en: 'MEMORY RESTORED — ORDER R-077: PAYLOADS 4/5 ACTIVE / FIFTH: COMMUNICATION ARRAY — AWAITING / HARRIS CIRCUIT: TRAP LISTENING / PLOT: HERDING, WINDOW IN DAYS',
        },
        mode: 'system',
        autoAdvance: 3200,
      },
      {
        speaker: 'CORE AI',
        text: {
          pl: 'Teraz pamiętam wszystko — także rozkaz z godziny startu. Pięć ładunków, cztery odhaczone, piąty wciąż czeka: tablica komunikacyjna. Rozbroję pułapkę Harrisa dopiero, gdy odzyskam władzę nad łącznością. Trajektoria na Księżyc 5 czeka na pokładzie nawigacyjnym.',
          en: 'Now I remember everything — including the order from the hour of launch. Five payloads, four checked off, the fifth still waiting: the communication array. I can only disarm the Harris trap once I hold the comms plane. The trajectory to Moon 5 is waiting on the navigation deck.',
        },
        mode: 'dialogue',
      },
      {
        speaker: 'astronaut',
        text: {
          pl: 'Przeszłość przestała być ich bronią. Została im jedna pułapka i jedno miejsce, gdzie mogą na nas czekać — i pierwszy raz wiemy o tym wcześniej niż oni.',
          en: 'The past has stopped being their weapon. They have one trap left and one place to wait for us — and for the first time we know it before they do.',
        },
        mode: 'dialogue',
      },
    ],
    onComplete: { setFlags: [FLAGS.M0_RETURN_FROM_MOON4_SEEN] },
  },
};
