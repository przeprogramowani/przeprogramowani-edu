import { MusicKey, SfxKey } from './AudioKeys';

export interface AudioAssetEntry {
  key: string;
  url: string;
}

export const MUSIC_ASSETS: AudioAssetEntry[] = [
  { key: MusicKey.BG_EXPLORATION, url: '/game/audio/music/bg-exploration.ogg' },
  { key: MusicKey.ARCADE_ACTION, url: '/game/audio/music/arcade-action.ogg' },
];

export const SFX_ASSETS: AudioAssetEntry[] = [
  // Progression
  { key: SfxKey.XP_DING, url: '/game/audio/sfx/xp-ding.ogg' },
  { key: SfxKey.RANK_UP, url: '/game/audio/sfx/rank-up.ogg' },
  { key: SfxKey.QUEST_ACCEPT, url: '/game/audio/sfx/quest-accept.ogg' },
  { key: SfxKey.QUEST_COMPLETE, url: '/game/audio/sfx/quest-complete.ogg' },
  { key: SfxKey.OBJECTIVE_TICK, url: '/game/audio/sfx/objective-tick.ogg' },

  // Arcade — Asteroid Range
  { key: SfxKey.LASER_SHOT, url: '/game/audio/sfx/laser-shot.ogg' },
  { key: SfxKey.ASTEROID_HIT, url: '/game/audio/sfx/asteroid-hit.ogg' },
  { key: SfxKey.MISS_WHIFF, url: '/game/audio/sfx/miss-whiff.ogg' },

  // Arcade — Memory Matrix
  { key: SfxKey.SIGNAL_BEEP, url: '/game/audio/sfx/signal-beep.ogg' },
  { key: SfxKey.CELL_CLICK, url: '/game/audio/sfx/cell-click.ogg' },

  // Arcade — Oscilloscope
  { key: SfxKey.PARAM_BEEP, url: '/game/audio/sfx/param-beep.ogg' },
  { key: SfxKey.SUBMIT_CONFIRM, url: '/game/audio/sfx/submit-confirm.ogg' },

  // Arcade — shared
  { key: SfxKey.SUCCESS_CHIME, url: '/game/audio/sfx/success-chime.ogg' },
  { key: SfxKey.ERROR_BUZZ, url: '/game/audio/sfx/error-buzz.ogg' },

  // Terminal
  { key: SfxKey.TERMINAL_OPEN, url: '/game/audio/sfx/terminal-open.ogg' },
  { key: SfxKey.TERMINAL_CLOSE, url: '/game/audio/sfx/terminal-close.ogg' },

  // Dialogue
  { key: SfxKey.DIALOGUE_BLIP, url: '/game/audio/sfx/dialogue-blip.ogg' },

  // Transitions
  { key: SfxKey.TRANSITION_WHOOSH, url: '/game/audio/sfx/transition-whoosh.ogg' },
];

export const ALL_AUDIO_ASSETS: AudioAssetEntry[] = [...MUSIC_ASSETS, ...SFX_ASSETS];
