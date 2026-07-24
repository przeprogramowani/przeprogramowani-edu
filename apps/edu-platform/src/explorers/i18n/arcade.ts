// ArcadeScene + arcade renderer chrome (intro, results, in-game labels).

export const arcadeStrings = {
  pl: {
    // Intro / countdown / chrome shared by ArcadeScene
    'arcade.difficultyLabel': 'Poziom: {stars}',
    'arcade.startHint': '[Enter] Start',
    'arcade.escHint': '[ESC] Wyjdź',
    'arcade.scoreLabel': 'WYNIK: {score}',
    'arcade.scoreLabelInitial': 'WYNIK: 0',
    'arcade.timerLabel': 'CZAS: {seconds}',
    'arcade.resultsScoreSimple': 'Wynik: {score}',
    'arcade.resultsScoreFull': 'Wynik: {score}/{max}',

    // MemoryMatrix renderer
    'arcade.mm.headerSignal': 'SYGNAŁ Z GŁĘBOKIEGO KOSMOSU — Runda {current}/{total}',
    'arcade.mm.hintMemorize': 'Zapamiętaj wzór...',
    'arcade.mm.hintControls': '[WSAD] poruszaj  [SPACE] zaznacz  [ENTER] zatwierdź',
    'arcade.mm.feedbackCorrect': 'Poprawnie! +{points} punktów',
    'arcade.mm.feedbackIncorrect': 'Błąd! {correct}/{total} poprawnych',
    'arcade.mm.transmissionEnded': 'TRANSMISJA ZAKOŃCZONA',
    'arcade.mm.roundsCompleted': 'Ukończono {count} rund',

    // Oscilloscope renderer
    'arcade.osc.paramAmplitude': 'Amplituda',
    'arcade.osc.paramFrequency': 'Częstotl.',
    'arcade.osc.paramPhase': 'Faza',
    'arcade.osc.paramOffset': 'Przesunięcie',
    'arcade.osc.controls': '[W/S] zmień parametr\n[A/D] dopasuj  [Enter] zatwierdź',
    'arcade.osc.matchUnknown': 'Dopasowanie: ???',
    'arcade.osc.matchKnown': 'Dopasowanie: {percent}%',
    'arcade.osc.submittedHint': 'Zatwierdzone! [Enter] zakończ',

    // AsteroidRange renderer
    'arcade.ast.title': 'STRZELNICA ASTEROIDÓW',
    'arcade.ast.controls': '[WASD] celuj   [SPACE] strzelaj',
    'arcade.ast.statusReady': 'GOTOWY',
    'arcade.ast.statusCooldown': 'LADOWANIE {ms}ms',
    'arcade.ast.statusLine': 'SEKTOR B-12  |  CELE {targets}\nMINERALY {score}  |  LASER {laser}',

    // DeepScan renderer
    'arcade.ds.title': 'GŁĘBOKI SKAN — WĄWÓZ',
    'arcade.ds.controls': '[WSAD] kursor  [SPACE] ping  [ENTER] oznacz złoże',
    'arcade.ds.status': 'PINGI: {pings}  |  CZYTAJ ECHA, OZNACZ ŻYŁĘ',
    'arcade.ds.outOfPings': 'Bateria wyczerpana — [ENTER] oznacz złoże',
    'arcade.ds.result': 'ODCZYT: {score}/100',
    'arcade.ds.finishHint': 'Skan zakończony — [ENTER] zakończ',

    // Switchyard renderer
    'arcade.sw.title': 'ZWROTNICA — HUTA',
    'arcade.sw.phasePlanning': 'FAZA PLANOWANIA',
    'arcade.sw.phaseExecution': 'FAZA WYKONANIA',
    'arcade.sw.controlsPlanning': '[WSAD] kursor  [SPACE] zwrotnica/kolejność  [ENTER] start',
    'arcade.sw.controlsExecution': '[SPACE] przytrzymaj wagonik   blokady: {holds}',
    'arcade.sw.startHint': 'Ułóż plan, potem naciśnij [ENTER]',
    'arcade.sw.queue': 'KOLEJKA ODJAZDÓW: {order}',
    'arcade.sw.delivered': 'DOSTARCZONO: {done}/{total}   BLOKADY: {holds}',
    'arcade.sw.result': 'DOSTAWA: {score}/100',
    'arcade.sw.finishHint': 'Wytop gotowy — [ENTER] zakończ',

    // FaultTrace renderer
    'arcade.ft.title': 'REGRESJA — STEROWNIK CHŁODZENIA',
    'arcade.ft.controls': '[A/D] wybierz wersję  [SPACE] sprawdź  [ENTER] wskaż pierwszą wadliwą',
    'arcade.ft.status': 'PRÓBY: {tests}  |  PODEJRZANE WERSJE: {candidates}  |  NIESTABILNE ODCZYTY: {unstable}',
    'arcade.ft.range': 'OSTATNIA SPRAWNA: {good}   →   PIERWSZA WADLIWA: ?   ←   ZNANA WADLIWA: {bad}',
    'arcade.ft.selectedUnknown': '{revision}  ·  NIESPRAWDZONA',
    'arcade.ft.selectedGood': '{revision}  ·  SPRAWNA',
    'arcade.ft.selectedBad': '{revision}  ·  WADLIWA',
    'arcade.ft.selectedUnstable': '{revision}  ·  PODEJRZANY ODCZYT',
    'arcade.ft.startHint': 'Wybierz wersję blisko środka zaznaczonego zakresu i sprawdź ją.',
    'arcade.ft.reportGood': 'WERSJA {revision}: SPRAWNA — usterka powstała później.',
    'arcade.ft.reportBad': 'WERSJA {revision}: WADLIWA — usterka jest tutaj lub wcześniej.',
    'arcade.ft.reportUnstable': 'WERSJA {revision}: odczyt jest niespójny — sprawdź ją ponownie.',
    'arcade.ft.repeatHint': '[SPACE] powtórz sprawdzenie, zanim zawęzisz zakres',
    'arcade.ft.readyHint': 'Pozostała wersja {revision} — [ENTER] zatwierdź diagnozę',
    'arcade.ft.outOfTests': 'Brak prób — [ENTER] wskaż pierwszą wadliwą wersję',
    'arcade.ft.result': 'DIAGNOZA: {score}/100',
    'arcade.ft.resultDetail': 'PIERWSZY WADLIWY: {fault}   |   WSKAZANO: {selected}',
    'arcade.ft.finishHint': 'Diagnoza zapisana — [ENTER] zakończ',

    // Cartograph renderer
    'arcade.cg.title': 'KARTOGRAF — SKARBIEC MAP',
    'arcade.cg.controls': '[WSAD] kursor  [SPACE] sonda  [ENTER] zatwierdź trasę',
    'arcade.cg.status': 'SONDY: {probes}  |  ODTWÓRZ TRASĘ — ODRZUĆ STARE PIĘTRO',
    'arcade.cg.reportReal': 'KORYTARZ — łączy się z sąsiadem',
    'arcade.cg.reportStale': 'STARE PIĘTRO — fragment do niczego nie pasuje',
    'arcade.cg.reportEmpty': 'GRUZ — pusto',
    'arcade.cg.staleHint': 'Wygląda poprawnie, ale nie łączy się z niczym. Odrzuć i sonduj dalej.',
    'arcade.cg.outOfProbes': 'Wiertła zużyte — [ENTER] zatwierdź trasę',
    'arcade.cg.result': 'MAPA: {score}/100',
    'arcade.cg.finishHint': 'Mapa gotowa — [ENTER] zakończ',

    // Mission resolution / results
    'arcade.replay.disclaimer':
      'Misja w tym miejscu jest już wykonana. Dodatkowe XP nie zostanie przyznane - możesz zagrać dla zabawy. Powodzenia!',
    'arcade.result.firstClearTitle': 'MISJA WYKONANA',
    'arcade.result.firstClearMessage':
      'Problem w tym pomieszczeniu został rozwiązany. Ta stacja pozostaje dostępna do treningu, ale nie przyznaje dodatkowego XP.',
    'arcade.result.trainingTitle': 'TRENING ZALICZONY',
    'arcade.result.trainingMessage':
      'Ta stacja jest już oznaczona jako wykonana. To podejście ma charakter treningowy i nie przyznaje dodatkowego XP.',
    'arcade.result.stabilizedTitle': 'STACJA USTABILIZOWANA',
    'arcade.result.stabilizedMessage':
      'Stacja została już wcześniej oznaczona jako rozwiązana. Możesz dalej trenować bez wpływu na postęp fabularny.',
    'arcade.result.needsWorkTitle': 'POTRZEBNA DALSZA PRACA',
    'arcade.result.needsWorkMessage':
      'Problem w tym pomieszczeniu nadal wymaga pracy. Wróć do stacji i spróbuj jeszcze raz, aby domknąć tę misję.',
  },
  en: {
    'arcade.difficultyLabel': 'Level: {stars}',
    'arcade.startHint': '[Enter] Start',
    'arcade.escHint': '[ESC] Exit',
    'arcade.scoreLabel': 'SCORE: {score}',
    'arcade.scoreLabelInitial': 'SCORE: 0',
    'arcade.timerLabel': 'TIME: {seconds}',
    'arcade.resultsScoreSimple': 'Score: {score}',
    'arcade.resultsScoreFull': 'Score: {score}/{max}',

    // MemoryMatrix renderer
    'arcade.mm.headerSignal': 'DEEP SPACE SIGNAL — Round {current}/{total}',
    'arcade.mm.hintMemorize': 'Memorise the pattern...',
    'arcade.mm.hintControls': '[WSAD] move  [SPACE] select  [ENTER] confirm',
    'arcade.mm.feedbackCorrect': 'Correct! +{points} points',
    'arcade.mm.feedbackIncorrect': 'Wrong! {correct}/{total} correct',
    'arcade.mm.transmissionEnded': 'TRANSMISSION COMPLETE',
    'arcade.mm.roundsCompleted': '{count} rounds completed',

    // Oscilloscope renderer
    'arcade.osc.paramAmplitude': 'Amplitude',
    'arcade.osc.paramFrequency': 'Freq.',
    'arcade.osc.paramPhase': 'Phase',
    'arcade.osc.paramOffset': 'Offset',
    'arcade.osc.controls': '[W/S] change parameter\n[A/D] adjust  [Enter] confirm',
    'arcade.osc.matchUnknown': 'Match: ???',
    'arcade.osc.matchKnown': 'Match: {percent}%',
    'arcade.osc.submittedHint': 'Confirmed! [Enter] finish',

    // AsteroidRange renderer
    'arcade.ast.title': 'ASTEROID RANGE',
    'arcade.ast.controls': '[WASD] aim   [SPACE] shoot',
    'arcade.ast.statusReady': 'READY',
    'arcade.ast.statusCooldown': 'RELOADING {ms}ms',
    'arcade.ast.statusLine': 'SECTOR B-12  |  TARGETS {targets}\nMINERALS {score}  |  LASER {laser}',

    // DeepScan renderer
    'arcade.ds.title': 'DEEP SCAN — RAVINE',
    'arcade.ds.controls': '[WSAD] cursor  [SPACE] ping  [ENTER] mark deposit',
    'arcade.ds.status': 'PINGS: {pings}  |  READ THE ECHOES, MARK THE VEIN',
    'arcade.ds.outOfPings': 'Battery drained — [ENTER] mark deposit',
    'arcade.ds.result': 'READING: {score}/100',
    'arcade.ds.finishHint': 'Scan complete — [ENTER] finish',

    // Switchyard renderer
    'arcade.sw.title': 'SWITCHYARD — FOUNDRY',
    'arcade.sw.phasePlanning': 'PLANNING PHASE',
    'arcade.sw.phaseExecution': 'EXECUTION PHASE',
    'arcade.sw.controlsPlanning': '[WSAD] cursor  [SPACE] switch/order  [ENTER] start',
    'arcade.sw.controlsExecution': '[SPACE] hold a tram   holds: {holds}',
    'arcade.sw.startHint': 'Lay out the plan, then press [ENTER]',
    'arcade.sw.queue': 'DEPARTURE QUEUE: {order}',
    'arcade.sw.delivered': 'DELIVERED: {done}/{total}   HOLDS: {holds}',
    'arcade.sw.result': 'DELIVERY: {score}/100',
    'arcade.sw.finishHint': 'Melt ready — [ENTER] finish',

    // FaultTrace renderer
    'arcade.ft.title': 'REGRESSION — COOLING CONTROLLER',
    'arcade.ft.controls': '[A/D] choose version  [SPACE] check  [ENTER] mark first faulty',
    'arcade.ft.status': 'ATTEMPTS: {tests}  |  SUSPECT VERSIONS: {candidates}  |  UNSTABLE READINGS: {unstable}',
    'arcade.ft.range': 'LAST WORKING: {good}   →   FIRST FAULTY: ?   ←   KNOWN FAULTY: {bad}',
    'arcade.ft.selectedUnknown': '{revision}  ·  UNCHECKED',
    'arcade.ft.selectedGood': '{revision}  ·  WORKING',
    'arcade.ft.selectedBad': '{revision}  ·  FAULTY',
    'arcade.ft.selectedUnstable': '{revision}  ·  SUSPICIOUS READING',
    'arcade.ft.startHint': 'Choose a version near the middle of the highlighted range and check it.',
    'arcade.ft.reportGood': 'VERSION {revision}: WORKING — the fault appeared later.',
    'arcade.ft.reportBad': 'VERSION {revision}: FAULTY — the fault is here or earlier.',
    'arcade.ft.reportUnstable': 'VERSION {revision}: inconsistent reading — check it again.',
    'arcade.ft.repeatHint': '[SPACE] repeat the check before narrowing the range',
    'arcade.ft.readyHint': 'Only version {revision} remains — [ENTER] confirm diagnosis',
    'arcade.ft.outOfTests': 'No attempts left — [ENTER] mark the first faulty version',
    'arcade.ft.result': 'DIAGNOSIS: {score}/100',
    'arcade.ft.resultDetail': 'FIRST BAD: {fault}   |   SELECTED: {selected}',
    'arcade.ft.finishHint': 'Diagnosis saved — [ENTER] finish',

    // Cartograph renderer
    'arcade.cg.title': 'CARTOGRAPH — MAP VAULT',
    'arcade.cg.controls': '[WSAD] cursor  [SPACE] probe  [ENTER] commit route',
    'arcade.cg.status': 'PROBES: {probes}  |  RECONSTRUCT THE ROUTE — REJECT THE OLD FLOOR',
    'arcade.cg.reportReal': 'CORRIDOR — links a neighbour',
    'arcade.cg.reportStale': 'OLD FLOOR — the fragment fits nothing',
    'arcade.cg.reportEmpty': 'RUBBLE — empty',
    'arcade.cg.staleHint': 'Looks right, but it connects to nothing. Reject it and keep probing.',
    'arcade.cg.outOfProbes': 'Drills spent — [ENTER] commit route',
    'arcade.cg.result': 'MAP: {score}/100',
    'arcade.cg.finishHint': 'Map ready — [ENTER] finish',

    // Mission resolution / results
    'arcade.replay.disclaimer':
      'This room’s mission is already complete. No extra XP will be awarded — feel free to replay for fun. Good luck!',
    'arcade.result.firstClearTitle': 'MISSION CLEARED',
    'arcade.result.firstClearMessage':
      'The problem in this room has been solved. This station remains open for practice but no longer awards XP.',
    'arcade.result.trainingTitle': 'TRAINING CLEARED',
    'arcade.result.trainingMessage':
      'This station is already marked complete. This run counts as practice and does not award extra XP.',
    'arcade.result.stabilizedTitle': 'STATION STABILISED',
    'arcade.result.stabilizedMessage':
      'The station was already marked solved earlier. You can keep practising without affecting story progress.',
    'arcade.result.needsWorkTitle': 'MORE WORK NEEDED',
    'arcade.result.needsWorkMessage':
      'The problem in this room still needs work. Return to the station and try again to close out the mission.',
  },
} as const;
