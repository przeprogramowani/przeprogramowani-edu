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
