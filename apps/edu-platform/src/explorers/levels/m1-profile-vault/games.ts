import type { ArcadeGameDefinition } from '../../systems/ArcadeTypes';

export const arcadeGames: ArcadeGameDefinition[] = [
  {
    id: 'arcade-deep-scan',
    type: 'deep-scan',
    title: { pl: 'Głęboki Skan', en: 'Deep Scan' },
    description: {
      pl: 'CORE AI jest ślepe, a wąwóz pełen fałszywych ech. Znajdź jedną czystą żyłę Synaptitu po omacku: emituj pingi z kursora, czytaj rozkwitające echa i oznacz najgęstsze złoże. Budżet pingów to bateria obozu — każdy zmarnowany ping to moc odjęta misji.',
      en: 'CORE AI is blind and the ravine is full of false echoes. Find one pure Synaptit vein by feel: emit pings from your cursor, read the blooming echoes, and mark the densest deposit. Your ping budget is the camp battery — every wasted ping is power taken from the mission.',
    },
    difficulty: 3,
    durationSeconds: 0,
    mission: {
      minScore: 70,
      firstClearXp: 25,
      firstClearDialogueId: 'm1-deep-scan-cleared',
    },
  },
];
