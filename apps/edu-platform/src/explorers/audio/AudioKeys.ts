/** Typed string constants for all audio asset keys */
export const MusicKey = {
  BG_EXPLORATION: 'music-bg-exploration',
  ARCADE_ACTION: 'music-arcade-action',
} as const;

export type MusicKeyValue = (typeof MusicKey)[keyof typeof MusicKey];

export const SfxKey = {
  // Progression
  XP_DING: 'sfx-xp-ding',
  RANK_UP: 'sfx-rank-up',
  QUEST_ACCEPT: 'sfx-quest-accept',
  QUEST_COMPLETE: 'sfx-quest-complete',
  OBJECTIVE_TICK: 'sfx-objective-tick',

  // Arcade — Asteroid Range
  LASER_SHOT: 'sfx-laser-shot',
  ASTEROID_HIT: 'sfx-asteroid-hit',
  MISS_WHIFF: 'sfx-miss-whiff',

  // Arcade — Memory Matrix
  SIGNAL_BEEP: 'sfx-signal-beep',
  CELL_CLICK: 'sfx-cell-click',

  // Arcade — Oscilloscope
  PARAM_BEEP: 'sfx-param-beep',
  SUBMIT_CONFIRM: 'sfx-submit-confirm',

  // Arcade — shared
  SUCCESS_CHIME: 'sfx-success-chime',
  ERROR_BUZZ: 'sfx-error-buzz',

  // Dialogue
  DIALOGUE_BLIP: 'sfx-dialogue-blip',

  // Terminal
  TERMINAL_OPEN: 'sfx-terminal-open',
  TERMINAL_CLOSE: 'sfx-terminal-close',

  // Transitions
  TRANSITION_WHOOSH: 'sfx-transition-whoosh',
} as const;

export type SfxKeyValue = (typeof SfxKey)[keyof typeof SfxKey];
