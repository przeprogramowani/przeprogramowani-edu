export const SceneKey = {
  BOOT: 'BootScene',
  PRELOADER: 'PreloaderScene',
  GAME: 'GameScene',
  DIALOGUE: 'DialogueScene',
  TRANSITION: 'TransitionScene',
  EXAM: 'ExamScene',
  ARCADE: 'ArcadeScene',
  NAVIGATION: 'NavigationScene',
} as const;

export type SceneKeyType = (typeof SceneKey)[keyof typeof SceneKey];
