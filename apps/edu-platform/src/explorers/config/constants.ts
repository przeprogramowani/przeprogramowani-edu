// ─── Core tile dimension (change this ONE value to resize everything) ───
export const TILE_SIZE = 64;

// ─── Character frame dimensions (derived from tile size) ───
export const PLAYER_FRAME_WIDTH = TILE_SIZE;
export const PLAYER_FRAME_HEIGHT = TILE_SIZE * 1.5;

// ─── Collision body (proportional to frame) ───
export const PLAYER_BODY_WIDTH = TILE_SIZE * 0.75;
export const PLAYER_BODY_HEIGHT = TILE_SIZE * 0.5;
export const PLAYER_BODY_OFFSET_X = Math.round((PLAYER_FRAME_WIDTH - PLAYER_BODY_WIDTH) / 2);
export const PLAYER_BODY_OFFSET_Y = Math.round(PLAYER_FRAME_HEIGHT - PLAYER_BODY_HEIGHT - TILE_SIZE * 0.1875);

// ─── Movement speeds (pixels per second — scale with tile size for consistent feel) ───
export const PLAYER_SPEED = TILE_SIZE * 3.75;
export const WALK_FRAME_RATE = 10;

export const CAMERA_LERP = 0.08;
export const CAMERA_DEADZONE_X = TILE_SIZE * 2;
export const CAMERA_DEADZONE_Y = TILE_SIZE * 1.5;
export const CAMERA_BASE_WIDTH = 800;

export const TYPEWRITER_CHARS_PER_SEC = 30;
export const SYSTEM_MESSAGE_DURATION_MS = 3000;
export const TRANSITION_FADE_MS = 300;

// ─── Dialogue bar font sizes ───
export const DIALOGUE_SPEAKER_FONT_SIZE = 28;
export const DIALOGUE_BODY_FONT_SIZE = 32;
export const DIALOGUE_HINT_FONT_SIZE = 22;

// Smaller variants used when the canvas is narrower than DIALOGUE_NARROW_WIDTH_PX
// (e.g. mobile phones in portrait). DialogueBar picks the right set on every relayout.
export const DIALOGUE_SPEAKER_FONT_SIZE_NARROW = 14;
export const DIALOGUE_BODY_FONT_SIZE_NARROW = 16;
export const DIALOGUE_HINT_FONT_SIZE_NARROW = 12;
export const DIALOGUE_NARROW_WIDTH_PX = 640;

export const INTERACTION_RADIUS = TILE_SIZE * 1.5;

export const DEPTH = {
  GROUND: 0,
  GROUND_DECOR: 1,
  WALLS: 2,
  OBJECTS: 3,
  PLAYER: 5,
  ABOVE: 10,
  INTERACTION_PROMPT: 15,
  DIALOGUE: 20,
  EXAM: 90,
  ARCADE: 90,
  NAVIGATION: 90,
  TRANSITION: 100,
} as const;

export const COLORS = {
  DEEP_NAVY: 0x0a0e2a,
  COSMIC_PURPLE: 0x2d1b69,
  TEAL: 0x00d4aa,
  WARM_AMBER: 0xffb347,
  WHITE: 0xffffff,
  EXAM_CORRECT: 0x2ecc71,
  EXAM_INCORRECT: 0xe74c3c,
  EXAM_SELECTED: 0x00d4aa,
  EXAM_HOVER: 0x1a3a4a,
} as const;

export const SAVE_KEY = 'space-explorers-state-v2';
export const SAVE_INTERVAL_MS = 30_000;

export const NPC_SPEED = TILE_SIZE * 1.25; // 80 px/s — slower than PLAYER_SPEED
export const NPC_WANDER_TIMER_MIN = 1500; // ms
export const NPC_WANDER_TIMER_MAX = 3500; // ms
export const NPC_IDLE_CHANCE = 0.3;
export const NPC_IDLE_DURATION_MIN = 1000; // ms
export const NPC_IDLE_DURATION_MAX = 2000; // ms
export const NPC_IDLE_AFTER_UNFREEZE_MS = 1200; // ms
export const NPC_WALL_BLOCKED_GRACE_MS = 150; // ms
export const NPC_WALL_RECOVERY_MIN_MS = 350; // ms
export const NPC_WALL_CLEAR_STABLE_MS = 150; // ms

// Maps npcType Tiled property → character column-block index in npc-characters.png
export const NPC_TYPE_ROWS: Record<string, number> = {
  scientist: 0,
  alien: 1,
  robot: 2,
  orb: 3,
};

export type NpcBlendMode = 'add' | 'screen';

export interface NpcColorVariant {
  color: number;
  mode: 'fill' | 'multiply';
  blendMode?: NpcBlendMode;
}

// Optional named color variants authored via an NPC zone's npcVariant property.
// Tint changes the sprite color without lowering its opacity. The optional blend mode
// controls how the tinted sprite is composited over the map.
export const NPC_COLOR_VARIANTS: Record<string, NpcColorVariant> = {
  'jungle-dark-green': { color: 0x8fa383, mode: 'multiply' },
  'frosty-blue': { color: 0xa5cfe0, mode: 'multiply' },
  'crimson-red': { color: 0xd97a7a, mode: 'multiply' },
  'hologram-blue': { color: 0x66ccff, mode: 'multiply' },
  'hologram-green': { color: 0x66ff99, mode: 'multiply' },
  'hologram-magenta': { color: 0xff66cc, mode: 'multiply' },
  'hologram-blue-add': { color: 0x66ccff, mode: 'multiply', blendMode: 'add' },
  'hologram-blue-screen': { color: 0x66ccff, mode: 'multiply', blendMode: 'screen' },
};

// Total frames per row = character count × 4 frames per direction
export const NPC_SPRITE_COLS = Object.keys(NPC_TYPE_ROWS).length * 4; // 16
