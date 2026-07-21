import type { ArcadeGameDefinition } from '../../systems/ArcadeTypes';

export const arcadeGames: ArcadeGameDefinition[] = [
  {
    id: 'arcade-fault-trace',
    type: 'fault-trace',
    title: { pl: 'Zwarcie', en: 'Fault Trace' },
    description: {
      pl: 'Certyfikuj pętlę chłodzenia wyżarzalni, zanim pójdzie pierwsza partia. Wpinaj sondy między odcinkami: każda mówi, czy usterka jest powyżej, czy poniżej — połowienie zamiast zgadywania. Sond jest mało, a każda zmarnowana to ubytek chłodziwa. I pamiętaj: jeden czujnik w pętli kłamie. Nigdy nie ufaj jednemu zielonemu — potwierdź drugą sondą.',
      en: 'Certify the annealing yard\'s cooling loop before the first batch runs. Pin probes between segments: each tells you whether the fault lies upstream or downstream — bisection, not guessing. Probes are scarce, and every wasted one is lost coolant. And remember: one sensor in the loop lies. Never trust a single green — confirm it with a second probe.',
    },
    difficulty: 3,
    durationSeconds: 0,
    mission: {
      minScore: 70,
      firstClearXp: 25,
      firstClearDialogueId: 'm3-fault-trace-cleared',
    },
  },
];
