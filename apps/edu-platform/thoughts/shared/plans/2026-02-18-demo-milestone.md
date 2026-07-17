# 10x Explorers — Demo Milestone Implementation Plan

## Overview

Build the complete playable Demo for 10x Explorers: 3 ship maps, astronaut exploration, dialogue system, Smart Terminal (Svelte) with lock/unlock and slash commands, 2 client-side quests, HUD, simplified cinematic intro, end screen, and localStorage persistence — all without server-side communication.

This is a **standalone plan** that incorporates all architecture and game content in a single pass, building directly with demo maps instead of a throwaway test-room.

## Current State Analysis

The game exists as a minimal bootstrap:

- `src/explorers/PhaserGame.svelte` (45 lines) — inline BootScene, no config extraction
- `src/pages/explorers.astro` — 8-line page using GameLayout
- `src/layouts/GameLayout.astro` — full-viewport layout
- Phaser `^3.90.0` installed, `@/explorers/*` path alias configured
- No scenes, entities, systems, state, assets, or game logic

### Key Discoveries:

- Architecture spec (`.ai/10x-devs/game/architecture-spec.md`) defines the complete target architecture — this plan implements the demo-relevant subset
- Demo milestone spec (`.ai/10x-devs/game/demo-milestone-spec.md`) defines all content, maps, dialogues, quests, and terminal behavior
- Background color `#111827` doesn't match spec palette `#0a0e2a` (Deep Navy)
- Missing `pixelArt: true`, `roundPixels: true`, arcade physics config
- No `public/game/` directory for assets

## Desired End State

A new player navigates to `/explorers` and experiences:

1. Simplified cinematic intro (text fade → gameplay)
2. Explores ship-hibernation room, finds keycode 0451
3. Enters code in the Smart Terminal lock screen → terminal unlocks with boot sequence
4. Types `/help`, `/status` → Quest 1 activates
5. Solves Quest 1 via `/solve recalibrate-CAL-7031` → `/map` unlocked, Quest 2 activates
6. Solves Quest 2 via `/solve 14.7.26` → demo complete
7. End screen shows with CTA → player can continue exploring
8. State persists to localStorage — page refresh restores everything

### Verification:

- Fresh start → intro → explore → unlock terminal → complete both quests → end screen
- Refresh page → state restored (map, position, flags, quests, XP)
- All 3 maps navigable via doors with fade transitions
- All interactive objects respond to [E] with correct dialogue
- All slash commands work: `/help`, `/status`, `/quest`, `/scan`, `/log`, `/map`, `/save`, `/solve`, `/hint`
- HUD shows level, XP bar, location name throughout
- No console errors during normal gameplay

## What We're NOT Doing

- **No server-side communication** — no API, no Supabase, no WebSocket
- **No real art assets** — placeholder colored rectangles throughout
- **No audio** — deferred to polish pass (silent files not needed either)
- **No authentication/route protection** — game loads for any visitor
- **No mobile support** — desktop keyboard only
- **No inventory UI** — items tracked in state only
- **No level-up mechanics** — XP tracked, level stays 1
- **No NPC sprites** — Astronaut is alone on the ship
- **No multiplayer/Comms tab**
- **No Astro middleware integration**

## Implementation Approach

8 phases (Phase 0–7), each testable independently. Phase 0 generates placeholder assets deterministically via a Node script. Phases 1–7 build foundation first, then layer systems incrementally, finishing with polish features (intro, end screen, persistence).

**Phase dependency chain:**
```
Phase 0 (Assets) → Phase 1 (Foundation) → Phase 2 (Map + Player) → Phase 3 (Interaction + Dialogue)
                                                                              ↓
                   Phase 4 (Smart Terminal) → Phase 5 (More Maps + Doors) → Phase 6 (Quests + HUD) → Phase 7 (Intro + End + Save)
```

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Scene registration:** Only `BootScene` in Phaser config `scene` array. All other scenes added dynamically via `this.scene.add()` in `BootScene.create()`.
- **Parallel scene launch:** `HudScene` launched (not started) alongside `GameScene` from `PreloaderScene.create()`. Runs independently.
- **DialogueScene lifecycle:** Sleep/wake pattern — launched once, then `scene.sleep()`/`scene.wake()` to show/hide. Never destroyed.
- **GameScene restart on map change:** `this.scene.restart({ mapKey, spawnX, spawnY })` — re-runs `init()` → `preload()` → `create()` with new data. Must save state before restart.
- **Listener cleanup:** Every `this.bus.on(...)` in `create()` must have a corresponding `this.bus.off(...)` in the scene's `shutdown` event handler.
- **Svelte ↔ Phaser bridge:** Communication via `game.events` (Phaser's EventEmitter). No shared Svelte stores. PhaserGame.svelte passes `game` instance to SmartTerminal.

### User Experience Specification

- **Placeholder visuals:** Teal rectangle for astronaut, colored outlines for interactive objects, dark/light rectangles for floor/wall tiles
- **Dialogue bar:** Bottom 20% of Phaser canvas, semi-transparent dark background, typewriter at 30 chars/sec
- **Interaction prompt:** "[E] Interakcja" floating above objects within 48px of player
- **Terminal panel:** Right 35% of screen, Svelte DOM component with monospace font, dark background
- **HUD bar:** Top of Phaser canvas, 36px height, shows level/rank + XP bar + location
- **Transition:** Full-screen black rectangle alpha tween: 0→1 (300ms), scene restart, 1→0 (300ms)

### State Management Sequencing

- **DemoGameState** (from spec §3): Simplified flat structure stored in localStorage as JSON
- **State initialization:** `BootScene.create()` reads localStorage, falls back to defaults
- **State access:** All scenes extend `BaseScene` with `this.gameState` getter and `this.updateState()` helper
- **State bridge:** On `state:changed` event, terminal and HUD both react
- **Save triggers:** Door transition (immediate), terminal unlock, quest completion, flag set, beforeunload, periodic (30s), `/save` command

### Debug & Observability Plan

- **Console logging:** Scene transitions, dialogue triggers, flag changes, quest state transitions, save/load operations
- **Phaser physics debug:** `arcade.debug: import.meta.env.DEV`
- **Verification:** Each phase has automated + manual success criteria

---

## Phase 0: Placeholder Asset Generation

### Overview

Generate all placeholder PNG assets deterministically via a Node script. This decouples asset creation from game logic and ensures every developer gets identical, reproducible assets. After this phase, `public/game/` contains all tilesets and spritesheets needed by Phases 2–5.

### Changes Required:

#### 1. Asset Generator Script

**File**: `scripts/generate-placeholder-assets.mjs`

A standalone Node script using the `canvas` npm package (or the built-in `node:canvas` shim via `@napi-rs/canvas`) to programmatically draw and save PNGs. Run with `node scripts/generate-placeholder-assets.mjs`.

**Generated files:**

| Output Path | Dimensions | Content |
|-------------|-----------|---------|
| `public/game/tilesets/placeholder.png` | 128×32 (4 tiles of 32×32) | Tile 0: floor `#1a1a2e` solid. Tile 1: wall `#4a4a6a` with 1px `#6a6a8a` border. Tile 2: door `#0a0e2a` fill with 2px `#00d4aa` teal outline. Tile 3: interactive marker `#0a0e2a` fill with 2px `#ffb347` amber outline. |
| `public/game/sprites/placeholder-astronaut.png` | 128×48 (4 frames of 32×48) | Each frame: teal `#00d4aa` filled 24×40 rectangle centered, with a 6px directional arrow indicator. Frame 0=down ▼, Frame 1=left ◀, Frame 2=right ▶, Frame 3=up ▲. Arrow in white `#ffffff`. |

**Script structure:**

```javascript
// scripts/generate-placeholder-assets.mjs
import { createCanvas } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const PUBLIC = join(import.meta.dirname, '..', 'public', 'game');
const TILE = 32;

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function generateTileset() {
  const canvas = createCanvas(TILE * 4, TILE);
  const ctx = canvas.getContext('2d');

  // Tile 0 — floor
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, TILE, TILE);

  // Tile 1 — wall
  ctx.fillStyle = '#4a4a6a';
  ctx.fillRect(TILE, 0, TILE, TILE);
  ctx.strokeStyle = '#6a6a8a';
  ctx.lineWidth = 1;
  ctx.strokeRect(TILE + 0.5, 0.5, TILE - 1, TILE - 1);

  // Tile 2 — door
  ctx.fillStyle = '#0a0e2a';
  ctx.fillRect(TILE * 2, 0, TILE, TILE);
  ctx.strokeStyle = '#00d4aa';
  ctx.lineWidth = 2;
  ctx.strokeRect(TILE * 2 + 1, 1, TILE - 2, TILE - 2);

  // Tile 3 — interactive marker
  ctx.fillStyle = '#0a0e2a';
  ctx.fillRect(TILE * 3, 0, TILE, TILE);
  ctx.strokeStyle = '#ffb347';
  ctx.lineWidth = 2;
  ctx.strokeRect(TILE * 3 + 1, 1, TILE - 2, TILE - 2);

  const outPath = join(PUBLIC, 'tilesets', 'placeholder.png');
  ensureDir(outPath);
  writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`✓ ${outPath}`);
}

function generateAstronaut() {
  const W = 32, H = 48, FRAMES = 4;
  const canvas = createCanvas(W * FRAMES, H);
  const ctx = canvas.getContext('2d');

  const arrows = [
    // down ▼
    (cx, cy) => { ctx.moveTo(cx - 4, cy - 3); ctx.lineTo(cx + 4, cy - 3); ctx.lineTo(cx, cy + 4); },
    // left ◀
    (cx, cy) => { ctx.moveTo(cx + 3, cy - 4); ctx.lineTo(cx + 3, cy + 4); ctx.lineTo(cx - 4, cy); },
    // right ▶
    (cx, cy) => { ctx.moveTo(cx - 3, cy - 4); ctx.lineTo(cx - 3, cy + 4); ctx.lineTo(cx + 4, cy); },
    // up ▲
    (cx, cy) => { ctx.moveTo(cx - 4, cy + 3); ctx.lineTo(cx + 4, cy + 3); ctx.lineTo(cx, cy - 4); },
  ];

  for (let i = 0; i < FRAMES; i++) {
    const x = i * W;
    // Body — teal rectangle
    ctx.fillStyle = '#00d4aa';
    ctx.fillRect(x + 4, 4, 24, 40);
    // Arrow — white directional indicator
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    arrows[i](x + W / 2, 14);
    ctx.closePath();
    ctx.fill();
  }

  const outPath = join(PUBLIC, 'sprites', 'placeholder-astronaut.png');
  ensureDir(outPath);
  writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`✓ ${outPath}`);
}

generateTileset();
generateAstronaut();
console.log('All placeholder assets generated.');
```

#### 2. NPM Script

**File**: `package.json` (add script)

```json
"generate:assets": "node scripts/generate-placeholder-assets.mjs"
```

#### 3. Gitignore Note

Generated PNGs **should be committed** to the repo so the game works without running the script. The script exists for reproducibility and future regeneration.

### Success Criteria:

#### Automated Verification:

- [x] Script runs without errors: `node scripts/generate-placeholder-assets.mjs`
- [x] Tileset exists and is a valid PNG: `file public/game/tilesets/placeholder.png` → "PNG image data, 128 x 32"
- [x] Astronaut spritesheet exists and is a valid PNG: `file public/game/sprites/placeholder-astronaut.png` → "PNG image data, 128 x 48"

#### Manual Verification:

- [ ] Open both PNGs in an image viewer — tiles and frames are visually distinct
- [ ] Floor tile is dark, wall tile is lighter with border, door has teal outline, interactive has amber outline
- [ ] Astronaut frames show teal body with white directional arrow (down/left/right/up)

**Implementation Note**: This phase has no game code dependency. Can be completed independently.

---

## Phase 1: Foundation — Config, Events, State, Scene System

### Overview

Extract game configuration, establish event constants, define demo state interfaces, build the scene class hierarchy, and update `PhaserGame.svelte`. After this phase, the game boots through `BootScene` → `PreloaderScene` and shows a loading screen.

### Changes Required:

#### 1. Game Config

**File**: `src/explorers/config/gameConfig.ts`

```typescript
import Phaser from 'phaser';

export function createGameConfig(parent: HTMLDivElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: '100%',
      height: '100%',
    },
    backgroundColor: '#0a0e2a',
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: import.meta.env.DEV,
      },
    },
    scene: [],
    audio: {
      disableWebAudio: false,
    },
  };
}
```

#### 2. Constants

**File**: `src/explorers/config/constants.ts`

```typescript
export const TILE_SIZE = 32;
export const PLAYER_SPEED = 120;
export const PLAYER_FRAME_WIDTH = 32;
export const PLAYER_FRAME_HEIGHT = 48;

export const CAMERA_LERP = 0.08;
export const CAMERA_DEADZONE_X = 64;
export const CAMERA_DEADZONE_Y = 48;
export const CAMERA_BASE_WIDTH = 480;

export const TYPEWRITER_CHARS_PER_SEC = 30;
export const SYSTEM_MESSAGE_DURATION_MS = 3000;
export const TRANSITION_FADE_MS = 300;

export const INTERACTION_RADIUS = 48;

export const DEPTH = {
  GROUND: 0,
  GROUND_DECOR: 1,
  WALLS: 2,
  OBJECTS: 3,
  PLAYER: 5,
  ABOVE: 10,
  INTERACTION_PROMPT: 15,
  DIALOGUE: 20,
  TRANSITION: 100,
} as const;

export const COLORS = {
  DEEP_NAVY: 0x0a0e2a,
  COSMIC_PURPLE: 0x2d1b69,
  TEAL: 0x00d4aa,
  WARM_AMBER: 0xffb347,
  WHITE: 0xffffff,
} as const;

export const SAVE_KEY = '10x-explorers-demo-state';
export const SAVE_INTERVAL_MS = 30_000;
```

#### 3. Scene Registry

**File**: `src/explorers/config/sceneRegistry.ts`

```typescript
export const SceneKey = {
  BOOT: 'BootScene',
  PRELOADER: 'PreloaderScene',
  GAME: 'GameScene',
  HUD: 'HudScene',
  DIALOGUE: 'DialogueScene',
  TRANSITION: 'TransitionScene',
} as const;

export type SceneKeyType = (typeof SceneKey)[keyof typeof SceneKey];
```

#### 4. Event Constants

**File**: `src/explorers/events/GameEvents.ts`

```typescript
// --------------- Event name constants ---------------

export const GameEvents = {
  // State
  STATE_CHANGED: 'state:changed',

  // Scene lifecycle
  SCENE_ENTERED: 'scene:entered',
  TRANSITION_START: 'transition:start',
  TRANSITION_COMPLETE: 'transition:complete',

  // Dialogue
  DIALOGUE_SHOW: 'dialogue:show',
  DIALOGUE_DISMISSED: 'dialogue:dismissed',

  // Interaction
  INTERACTION_TRIGGERED: 'interaction:triggered',

  // Quests
  QUEST_ACTIVATED: 'quest:activated',
  QUEST_COMPLETED: 'quest:completed',

  // Terminal (Svelte ↔ Phaser bridge)
  TERMINAL_COMMAND: 'terminal:command',
  TERMINAL_FOCUS_CHANGED: 'terminal:focus-changed',
  TERMINAL_UNLOCK: 'terminal:unlock',

  // Progression
  XP_GAINED: 'xp:gained',

  // Flags
  FLAG_SET: 'flag:set',

  // Scan
  SCAN_REQUESTED: 'scan:requested',
  SCAN_RESPONSE: 'scan:response',
} as const;

export type GameEventKey = keyof typeof GameEvents;
export type GameEventValue = (typeof GameEvents)[GameEventKey];

// --------------- Payload interfaces ---------------

export interface StateChangedPayload {
  state: import('../state/types').DemoGameState;
}

export interface SceneEnteredPayload {
  mapKey: string;
  displayName: string;
}

export interface TransitionStartPayload {
  targetMap: string;
  spawnX: number;
  spawnY: number;
}
// TransitionComplete — no payload

export interface DialogueShowPayload {
  dialogueId: string;
}
// DialogueDismissed — no payload

export interface InteractionTriggeredPayload {
  objectId: string;
  objectType: 'trigger' | 'door' | 'terminal';
  eventId: string;
  properties: Record<string, unknown>;
}

export interface QuestActivatedPayload {
  questId: string;
  title: string;
}

export interface QuestCompletedPayload {
  questId: string;
  rewards: { xp: number; flags: string[] };
}

export interface TerminalCommandPayload {
  command: string;
  args: string[];
}

export interface TerminalFocusChangedPayload {
  focused: boolean;
}
// TerminalUnlock — no payload

export interface XpGainedPayload {
  amount: number;
  total: number;
}

export interface FlagSetPayload {
  flag: string;
}

// ScanRequested — no payload

export interface ScanResponsePayload {
  nearbyObjects: Array<{ id: string; name: string; distance: number }>;
}
```

#### 5. Demo State Types

**File**: `src/explorers/state/types.ts`

```typescript
export type FacingDirection = 'down' | 'up' | 'left' | 'right';

export interface DemoGameState {
  version: 1;
  flags: string[];
  currentMap: string;
  position: { x: number; y: number };
  facing: FacingDirection;
  quests: {
    active: string | null;
    completed: string[];
  };
  hintIndex: Record<string, number>;
  terminalUnlocked: boolean;
  mapUnlocked: boolean;
  introSeen: boolean;
  xp: number;
  commandHistory: string[];
  activityLog: ActivityLogEntry[];
}

export interface ActivityLogEntry {
  timestamp: number;
  message: string;
}
```

#### 6. State Manager

**File**: `src/explorers/state/GameStateManager.ts`

Factory for default state + localStorage read/write helpers. `createDefaultState()` returns initial state from spec §3. `loadState()` reads localStorage with version check and fallback. `saveState()` serializes to localStorage.

#### 7. BaseScene

**File**: `src/explorers/scenes/BaseScene.ts`

Abstract class with `this.bus` (game.events), `this.gameState` getter from registry, `this.updateState()` for immutable updates + event emission, and `this.hasFlag()`/`this.setFlag()` convenience methods.

#### 8. BootScene

**File**: `src/explorers/scenes/BootScene.ts`

Loads state from localStorage (or creates default), stores in registry, registers all other scenes via `this.scene.add()`, transitions to PreloaderScene.

#### 9. PreloaderScene

**File**: `src/explorers/scenes/PreloaderScene.ts`

Shows "10x EXPLORERS" title + teal progress bar. Loads global assets from manifest. On complete, starts GameScene with current map from state + launches HudScene.

#### 10. Stub Scenes

Create empty shell classes for `GameScene`, `HudScene`, `DialogueScene`, `TransitionScene` — each extending BaseScene with correct SceneKey. GameScene initially just logs "Entering map: X".

#### 11. Update PhaserGame.svelte

**File**: `src/explorers/PhaserGame.svelte`

Replace inline BootScene with extracted config. Use `createGameConfig()` + `config.scene = [BootScene]`. Keep Svelte lifecycle (onMount/onDestroy). **Prepare 65/35 split layout** — left div for canvas (65%), right div placeholder for SmartTerminal (Phase 4).

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] All new files exist at correct paths under `src/explorers/`

#### Manual Verification:

- [x] Navigate to `/explorers` → Deep Navy background (#0a0e2a)
- [x] Console shows `[BootScene] Phaser X.XX.X | 10x Explorers`
- [x] PreloaderScene progress bar briefly visible
- [x] No console errors

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding.

---

## Phase 2: Tilemap Pipeline + Player Controller

### Overview

Create the ship-hibernation tilemap, build the AssetManifest, implement the full GameScene with tilemap rendering and zone parsing, and add the Astronaut entity with WSAD movement, facing direction, and wall collision. Placeholder PNG assets are already available from Phase 0. After this phase, the astronaut moves around ship-hibernation and collides with walls.

### Changes Required:

#### 1. Ship-Hibernation Tilemap

**File**: `public/game/maps/ship-hibernation.json`

Tiled-compatible JSON, 14×12 tiles. Layers: `Ground`, `Walls`, `Zones`. Walls around perimeter + internal features per spec §2. Zones layer objects:

| Object | Type | Position | Properties |
|--------|------|----------|------------|
| Spawn | `spawn` | (7,6) | `id: "player-spawn"` |
| Hibernation Pod | `trigger` | (7,6) | `id: "pod"`, `eventId: "examine-pod"` |
| Dead Screen ×2 | `trigger` | (2,3) (12,3) | `id: "screen-1"/"screen-2"`, `eventId: "dead-screen"` |
| Notice Board | `trigger` | (4,1) | `id: "notice-board"`, `eventId: "notice-board"` |
| Emergency Locker | `trigger` | (10,1) | `id: "emergency-locker"`, `eventId: "find-keycode"` |
| Door to Corridor | `door` | (13,6) | `targetMap: "ship-corridor"`, `spawnX: 1`, `spawnY: 4` |

#### 2. Asset Manifest

**File**: `src/explorers/assets/AssetManifest.ts`

Defines `GLOBAL_ASSETS` (astronaut spritesheet from `public/game/sprites/placeholder-astronaut.png`) and `MAP_ASSETS` for all 3 maps (tilemap JSON + tileset PNG references from Phase 0). Ship-corridor and ship-bridge entries added but maps not yet created.

#### 3. StateMachine Utility

**File**: `src/explorers/systems/StateMachine.ts`

Generic FSM with typed states, valid transitions map, `onEnter`/`onExit` callbacks, `canTransition()`, `transition()`, `isState()`.

#### 4. InputController

**File**: `src/explorers/systems/InputController.ts`

Centralized key bindings: WSAD + Arrows for movement, E for interact, Space for advance dialogue, Esc for dismiss. `setEnabled()` to disable during dialogue/cutscene. `isUp()`/`isDown()`/`isLeft()`/`isRight()` + `isInteractJustPressed()`.

#### 5. Astronaut Entity

**File**: `src/explorers/entities/Astronaut.ts`

`Phaser.Physics.Arcade.Sprite` with:
- State machine: `idle | walking | interacting | dialogue | cutscene`
- Physics body: 32×16 px at feet (offset 0, 32)
- WSAD movement with diagonal normalization
- Facing direction tracking
- Frame update based on facing (4 placeholder frames)
- Depth: `DEPTH.PLAYER`

#### 6. Full GameScene

**File**: `src/explorers/scenes/GameScene.ts`

Complete implementation:
- `init(data)` — receive mapKey + spawnX/spawnY
- `preload()` — load map assets from manifest (skip if cached)
- `create()` — build tilemap layers (Ground, GroundDecor, Walls, Objects, Above), set collision by property, parse Zones, spawn Astronaut, setup camera follow with zoom, add wall collider
- `update()` — call player.update()
- Camera: follow with lerp 0.08, deadzone 64×48, integer zoom based on canvas width
- Zone parsing stores objects for Phase 3 interaction system

#### 7. StateMachine Unit Test

**File**: `src/explorers/systems/StateMachine.test.ts`

Test valid transitions, invalid rejections, onEnter/onExit callbacks, isState() checks.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] StateMachine unit tests pass: `npx vitest run src/explorers/systems/StateMachine.test.ts`
- [x] Tilemap JSON is valid JSON
- [x] Placeholder assets from Phase 0 present in `public/game/`

#### Manual Verification:

- [x] PreloaderScene shows progress bar, loads assets
- [x] ship-hibernation tilemap renders (dark floor, lighter walls)
- [x] Teal astronaut rectangle appears at spawn point (center of room)
- [x] WSAD/Arrow keys move astronaut smoothly in all 4 directions + diagonals
- [x] Astronaut collides with walls (cannot walk through perimeter)
- [x] Camera follows player with smooth lerp
- [x] Correct facing frame displayed per direction

**Implementation Note**: Pause for manual verification before Phase 3.

---

## Phase 3: Interaction System + Dialogue

### Overview

Build proximity detection, interaction prompts, the full dialogue pipeline (TypewriterEffect, DialogueBar, DialogueManager, DialogueScene), and wire all ship-hibernation interactive objects with their dialogue content. After this phase, pressing E near objects triggers dialogue with typewriter effect and Space to advance.

### Changes Required:

#### 1. InteractiveObject Entity

**File**: `src/explorers/entities/InteractiveObject.ts`

Lightweight entity for doors, terminals, triggers. Stores `objectId`, `objectType`, `properties`, `eventId`. Uses invisible physics body for detection. Supports `requiredFlag` (only active when flag is set).

#### 2. InteractionDetector System

**File**: `src/explorers/systems/InteractionDetector.ts`

Checks distance from a point in front of the player (based on facing direction, offset by TILE_SIZE) to all registered interactables. Returns the closest within INTERACTION_RADIUS. Updates each frame.

#### 3. InteractionPrompt UI

**File**: `src/explorers/ui/InteractionPrompt.ts`

Phaser Container with background rectangle + "[E] Interakcja" text. Shows above the target object. `show(x, y)` / `hide()` methods.

#### 4. Dialogue Data Types

**File**: `src/explorers/systems/DialogueTypes.ts`

```typescript
export type DialogueMode = 'dialogue' | 'monologue' | 'system' | 'cinematic';

export interface DialogueLine {
  speaker: 'astronaut' | 'system' | string;
  text: string;
  mode: DialogueMode;
  autoAdvance?: number;
}

export interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  setFlag?: string;
  setFlag2?: string;
  triggerEvent?: string;
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  onComplete?: DialogueEffect;
}
```

#### 5. Dialogue JSON Data Files

**Files**: `src/explorers/data/dialogues/`

Create all dialogue files from spec §5:
- `awakening-monologue.json` — 3 lines, monologue after intro
- `find-keycode.json` — 4 lines, emergency locker interaction, sets `keycode-found`
- `terminal-boot.json` — boot sequence text (used by terminal, not dialogue bar)
- `first-contact.json` — 4 lines after terminal unlock
- `quest-1-activation.json` — 4 lines after first `/status`, activates quest
- `quest-1-complete.json` — 5 lines, completes Q1, activates Q2
- `quest-2-complete.json` — 4 lines, completes Q2, triggers demo end

**File**: `src/explorers/data/dialogues/ship-interactions.json`

All inline object dialogues from spec §5 (dead-screen, notice-board, examine-pod, damaged-panel, oxygen-tank, window-1/2, captain-chair, station-nav/comms/eng, data-console, holo-projector-off/on, star-map-off).

#### 6. TypewriterEffect

**File**: `src/explorers/ui/TypewriterEffect.ts`

Character-by-character reveal at `TYPEWRITER_CHARS_PER_SEC`. `start(text, scene, onComplete)`, `revealAll()`, `isComplete`, `stop()`.

#### 7. DialogueBar UI

**File**: `src/explorers/ui/DialogueBar.ts`

Phaser GameObjects at bottom 20% of canvas. Semi-transparent dark background. Speaker name (teal), body text (white), advance hint ("[Spacja] ▸"). Mode styling: dialogue (normal), monologue (italic, dimmer), system (amber), cinematic (centered).

#### 8. DialogueManager

**File**: `src/explorers/systems/DialogueManager.ts`

Loads dialogue sequences from imported JSON. Queue management: `startDialogue(id)` → `getCurrentLine()` → `advance()` → returns null when done. Applies `onComplete` effects (setFlag, activateQuest, triggerEvent) via bus events.

#### 9. DialogueScene

**File**: `src/explorers/scenes/DialogueScene.ts`

Overlay scene (sleep/wake pattern). Listens for `DIALOGUE_SHOW` event. Wakes up, shows lines through DialogueBar, handles Space (reveal/advance), handles Esc (skip), auto-advance for system messages. On complete: hides bar, emits `DIALOGUE_DISMISSED`, sleeps.

#### 10. Wire Interactions in GameScene

Update `GameScene.create()`:
- Create InteractiveObject entities from parsed Zones
- Initialize InteractionDetector with all interactables
- Create InteractionPrompt
- In `update()`: check proximity → show/hide prompt
- On E press: determine interaction type:
  - `trigger`: emit `DIALOGUE_SHOW` with the `eventId` as dialogue key
  - `door`: handled in Phase 5
  - `terminal`: handled in Phase 4
- Set player to `dialogue` state during dialogue
- Listen for `DIALOGUE_DISMISSED` → restore player to `idle`
- Handle `requiredFlag` checks (e.g., holo-projector shows different dialogue based on `quest-1-complete`)

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] All dialogue JSON files are valid JSON

#### Manual Verification:

- [x] Walking near Emergency Locker shows "[E] Interakcja" prompt
- [x] Walking away hides prompt
- [x] Pressing E at Emergency Locker triggers find-keycode dialogue (4 lines)
- [x] Typewriter effect reveals text character-by-character
- [x] Space during typing → reveals full line instantly
- [x] Space when line revealed → advances to next line
- [x] After last line → dialogue bar hides, movement resumes
- [x] Esc skips entire sequence
- [x] System messages (dead-screen) show amber text and auto-dismiss after 3s
- [x] Monologue shows italic text without speaker name
- [x] After find-keycode dialogue, `keycode-found` flag is set (verify via console log)
- [x] Player cannot move during dialogue

**Implementation Note**: Pause for manual verification before Phase 4.

---

## Phase 4: Smart Terminal (Svelte)

### Overview

Build the Smart Terminal as a Svelte DOM component alongside the Phaser canvas. Implement the lock screen, code input, boot sequence animation, unlocked terminal with slash commands, and the Phaser ↔ Svelte event bridge. After this phase, the player can find the code, enter 0451, unlock the terminal, and use all demo commands.

### Changes Required:

#### 1. Update PhaserGame.svelte Layout

**File**: `src/explorers/PhaserGame.svelte`

Split layout: left 65% for Phaser canvas, right 35% for SmartTerminal. Pass `game` instance to SmartTerminal when ready. Handle the case where game isn't initialized yet.

```svelte
<div class="flex w-full h-full bg-[#0a0e2a]">
  <div bind:this={container} class="flex-none h-full" style="width: 65%;" />
  <div class="flex-1 h-full bg-gray-950 border-l border-gray-800 overflow-hidden">
    {#if game}
      <SmartTerminal {game} />
    {/if}
  </div>
</div>
```

#### 2. SmartTerminal.svelte

**File**: `src/explorers/SmartTerminal.svelte`

Main terminal component. Receives `game` prop. Manages two states: `locked` and `unlocked`.

**Locked state:**
- Shows lock icon, "TERMINAL ZABLOKOWANY" header
- 4-digit code input field
- Hint text: "sprawdź procedury awaryjne na statku"
- On `keycode-found` flag: input field pulses with subtle glow animation
- On `0451` entered: play boot sequence → transition to unlocked
- On wrong code: shake animation + "Nieprawidłowy kod."

**Unlocked state:**
- Command input field at bottom (monospace, `>` prefix)
- Scrollable output area showing command history/output
- Mode tabs: [Misja] [Archiwum] (Komms hidden in demo)
- Mission mode shows active quest briefing
- All command output rendered as terminal lines

**Event bridge (in `onMount`):**
- Subscribe to game.events: `quest:activated`, `quest:completed`, `xp:gained`, `scene:entered`, `state:changed`, `flag:set`, `terminal:unlock`, `scan:response`
- Emit to game.events: `terminal:command`, `terminal:focus-changed`

**Focus management:**
- Backtick (`` ` ``) toggles focus between game and terminal
- When terminal input focused: emit `terminal:focus-changed { focused: true }` → InputController disabled
- When game focused: emit `terminal:focus-changed { focused: false }` → InputController enabled
- Esc returns focus to game

#### 3. Terminal Command Handler

**File**: `src/explorers/terminal/commandHandler.ts`

Parses slash commands and returns terminal output strings. Commands:

| Command | Implementation |
|---------|---------------|
| `/help` | Return static help text from spec §8 |
| `/status` | Read game state → format system diagnostics. On first call: set `first-status-seen` flag, emit event that triggers quest-1-activation dialogue |
| `/quest` | If no quest active: "Brak aktywnej misji." If active: show briefing + inputPayload |
| `/scan` | Emit `scan:requested` to Phaser → GameScene highlights nearby objects for 3s. Terminal shows "Skanowanie..." + count |
| `/log` | Show last 10 activity log entries from state |
| `/save` | Trigger localStorage save, show "Stan zapisany. ✓" |
| `/map` | Before `quest-1-complete`: offline message. After: show ASCII star map from storyline.md |
| `/solve <answer>` | Handled by quest system (Phase 6). Stub here. |
| `/hint` | Handled by quest system (Phase 6). Stub here. |

#### 4. Terminal Boot Sequence

When code 0451 is accepted:
1. Clear lock screen
2. Render boot sequence lines with delays (from spec §5 `terminal-boot.json`):
   ```
   > Kod zaakceptowany.
   > Inicjalizacja...
   > ████████████████████ 100%
   > UPLINK v0.7.1 — Awaryjne Łącze Kwantowe
   > ...
   ```
3. Set `terminal-unlocked` flag via game state
4. Emit `terminal:unlock` event → triggers `first-contact.json` dialogue in Phaser

#### 5. Wire Terminal Interaction in GameScene

When player interacts with Central Terminal object (`type: "terminal"`):
- If terminal not yet unlocked: show dialogue "Terminal jest zablokowany..." (already handled by awakening monologue)
- If terminal unlocked, first time: trigger `terminal-first-use` dialogue
- Subsequent: system message "Terminal aktywny. Użyj panelu po prawej."
- Terminal interaction also auto-focuses the terminal input

#### 6. InputController Terminal Focus

Update `InputController.setEnabled()` to be wired to `terminal:focus-changed` events. When terminal is focused, game movement disabled. When game focused, movement enabled.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`

#### Manual Verification:

- [x] Terminal panel visible on right 35% of screen with "TERMINAL ZABLOKOWANY"
- [x] Before finding keycode: input field normal appearance
- [x] After interacting with Emergency Locker (Phase 3): terminal input pulses
- [x] Entering wrong code → "Nieprawidłowy kod." + shake animation
- [x] Entering 0451 → boot sequence animation plays line by line
- [x] After boot: first-contact dialogue plays in Phaser dialogue bar
- [x] Terminal shows unlocked UI with command input
- [x] `/help` returns command list
- [x] `/status` returns ship diagnostics
- [x] `/quest` returns "Brak aktywnej misji" (before quest activation)
- [x] `/log` returns activity entries
- [x] `/save` saves to localStorage
- [x] `/map` returns "offline" message (before Quest 1 complete)
- [x] Backtick toggles focus between game and terminal
- [x] WSAD types in terminal when focused, moves astronaut when game focused

**Implementation Note**: Pause for manual verification before Phase 5.

---

## Phase 5: Additional Maps + Scene Transitions

### Overview

Create ship-corridor and ship-bridge tilemaps, implement door-based scene transitions with fade-to-black, and add all interactive objects for all 3 maps. After this phase, the player can walk through all 3 maps via doors with smooth transitions.

### Changes Required:

#### 1. Ship-Corridor Tilemap

**File**: `public/game/maps/ship-corridor.json`

24×8 tiles. Long hallway with obstacles. Zones objects:
- Damaged Panel (8,2), Oxygen Tank (16,6), Window ×2 (6,0 and 18,0)
- Door to Hibernation (0,4) → ship-hibernation, spawn (12,6)
- Door to Bridge (23,4) → ship-bridge, spawn (1,8)

#### 2. Ship-Bridge Tilemap

**File**: `public/game/maps/ship-bridge.json`

28×18 tiles. Large command center. Zones objects:
- Central Terminal (14,9): type `terminal`, `dialogueId: "terminal-first-use"`
- Holographic Projector (14,4): `requiredFlag: "quest-1-complete"`, different dialogue before/after
- Captain's Chair (14,14), Crew Stations ×3, Data Console (22,12)
- Star Map Wall Display (14,1): `requiredFlag: "quest-2-complete"`
- Door to Corridor (0,8) → ship-corridor, spawn (22,4)

#### 3. Update AssetManifest

Add `ship-corridor` and `ship-bridge` entries to `MAP_ASSETS`. All use the same `placeholder` tileset.

#### 4. TransitionScene

**File**: `src/explorers/scenes/TransitionScene.ts`

Full-screen black rectangle overlay. On `TRANSITION_START` event:
1. Fade in to black (300ms)
2. Save state to localStorage (position, map)
3. Restart GameScene with new map data
4. Brief pause (200ms) for scene rebuild
5. Fade out (300ms)
6. Emit `TRANSITION_COMPLETE`

#### 5. Door Interaction in GameScene

When player interacts with a `door` type object:
1. Read `targetMap`, `spawnX`, `spawnY` from properties
2. Update state with new map/position
3. Emit `TRANSITION_START` with target data
4. TransitionScene handles the rest

#### 6. Conditional Object Interactions

Some objects change behavior based on flags:
- Holographic Projector: before `quest-1-complete` → "Projektor wyłączony." After → "Mapa aktywna. Użyj /map."
- Star Map Wall Display: before `quest-2-complete` → "Duży ekran. Ciemny." After → visual + monologue

Implement flag-checking in the interaction handler — look up the `requiredFlag` property and show appropriate dialogue.

#### 7. Map Display Names

Add to constants or a map config:
```typescript
const MAP_DISPLAY_NAMES: Record<string, string> = {
  'ship-hibernation': 'Kwatera hibernacyjna',
  'ship-corridor': 'Korytarz główny',
  'ship-bridge': 'Mostek',
};
```

Used by HUD (Phase 6) and `/status` command.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] All 3 tilemap JSON files are valid

#### Manual Verification:

- [x] Walk to east door in ship-hibernation → fade to black → ship-corridor loads
- [x] Player spawns at correct position (1,4) in corridor
- [x] Walk through corridor (navigating obstacles) to east door → ship-bridge loads
- [x] Walk back through doors → returns to correct positions
- [x] All ship-corridor objects interactable (damaged panel, oxygen tank, windows)
- [x] All ship-bridge objects interactable (captain's chair, crew stations, data console)
- [x] Central Terminal on bridge triggers dialogue
- [x] Holo projector shows "wyłączony" (quest-1-complete flag not set yet)
- [x] Transitions are smooth (no flicker, no missing frames)
- [x] State preserves correctly across transitions

**Implementation Note**: Pause for manual verification before Phase 6.

---

## Phase 6: Quest System + HUD

### Overview

Implement the client-side quest system with QuestManager, `/solve` and `/hint` commands, quest activation/completion flow, and the parallel HudScene with level/XP/location display. After this phase, the full quest flow works: `/status` → Quest 1 → `/solve` → Quest 2 → `/solve` → demo complete flag.

### Changes Required:

#### 1. Quest Definitions

**File**: `src/explorers/data/quests/demo-quest-1.json`

```json
{
  "id": "demo-quest-1",
  "title": "Przywróć mapę holograficzną",
  "briefing": "Projektor holograficzny na mostku jest wyłączony. Systemy diagnostyczne wskazują, że kluczowy moduł wymaga ponownej kalibracji. Użyj danych z terminala, aby przywrócić projektor.",
  "inputPayload": "{\"projector\":\"holo-mk3\",\"status\":\"offline\",\"errorCode\":\"CAL-7031\",\"requiredAction\":\"recalibrate\"}",
  "hints": [
    "Sprawdź kod błędu CAL-7031. Co oznacza 'recalibrate'?",
    "Spróbuj wysłać komendę kalibracji — odpowiedź to słowo 'recalibrate' oraz kod błędu.",
    "Wpisz w terminalu: /solve recalibrate-CAL-7031"
  ],
  "solution": "recalibrate-cal-7031",
  "validation": "exact-lowercase",
  "rewards": { "xp": 75, "flags": ["quest-1-complete"] }
}
```

**File**: `src/explorers/data/quests/demo-quest-2.json`

```json
{
  "id": "demo-quest-2",
  "title": "Wyznacz aktualną pozycję",
  "briefing": "Mapa holograficzna działa, ale statek nie zna swojej pozycji. Sensory wykryły sygnał nawigacyjny — zdekoduj go, aby wyznaczyć koordynaty Odyssey.",
  "inputPayload": "{\"signal\":\"TmF2UG9pbnQ6IFNlY3Rvci03LVguIENvb3JkczogMTQuNy4yNg==\",\"encoding\":\"base64\",\"beacon\":\"NAV-BEACON-7X\"}",
  "hints": [
    "Sygnał jest zakodowany w base64. Zdekoduj go.",
    "Zdekodowany sygnał zawiera koordynaty. Wyodrębnij je.",
    "Wpisz w terminalu: /solve 14.7.26"
  ],
  "solution": "14.7.26",
  "validation": "exact-trim",
  "rewards": { "xp": 100, "flags": ["quest-2-complete"] }
}
```

#### 2. QuestManager

**File**: `src/explorers/systems/QuestManager.ts`

Client-side quest state machine:
- `activateQuest(questId)` — set as active in state, emit `QUEST_ACTIVATED`
- `submitAnswer(answer)` — validate against active quest solution, return correct/incorrect
- `completeQuest()` — mark completed, grant XP, set flags, trigger completion dialogue, activate next quest if applicable
- `getHint()` — return next progressive hint, increment `hintIndex`
- `getActiveQuest()` — return definition + status

Validation logic:
- `exact-lowercase`: `answer.toLowerCase().trim() === solution`
- `exact-trim`: `answer.trim() === solution`

Quest activation chain (from spec §7):
```
first /status → quest-1-activation dialogue → demo-quest-1 ACTIVE
/solve recalibrate-CAL-7031 → quest-1-complete dialogue → demo-quest-2 ACTIVE
/solve 14.7.26 → quest-2-complete dialogue → demo-complete flag
```

#### 3. Wire /solve and /hint in Terminal

Update `commandHandler.ts`:

**`/solve <answer>`:**
- No active quest: "Brak aktywnej misji. Zbadaj statek."
- Wrong answer: "Nieprawidłowa odpowiedź. Spróbuj ponownie. Wpisz /hint, aby uzyskać wskazówkę."
- Correct answer: emit quest completion event → triggers dialogue → returns success message

**`/hint`:**
- No active quest: "Brak aktywnej misji."
- Hints remaining: show next hint, increment index
- Hints exhausted: "Brak więcej wskazówek."

#### 4. Wire /status Quest Activation

When `/status` is called and `first-status-seen` flag is NOT set:
1. Set `first-status-seen` flag
2. After showing status output, emit event that triggers `quest-1-activation` dialogue
3. Dialogue's `onComplete` activates `demo-quest-1`

#### 5. Update /quest Command

When quest active: show full briefing including `inputPayload` (with copy button) and hint count.

#### 6. Update /map Command

After `quest-1-complete` flag: display ASCII star map from storyline.md Scene 0.5.

#### 7. HudScene

**File**: `src/explorers/scenes/HudScene.ts`

Parallel scene (launched once, never restarts). Fixed camera (no scroll).

#### 8. HudBar UI

**File**: `src/explorers/ui/HudBar.ts`

Top bar (36px height): `★ Kadet Lv.1 ████░░ 75/100 XP   Mostek`

Elements:
- Left: Rank icon ★ + "Kadet" + "Lv.1"
- Center: XP bar (filled rectangle proportional to xp/100)
- Center-right: XP text "{xp}/100 XP"
- Right: Location name from MAP_DISPLAY_NAMES

Listens for `STATE_CHANGED` and `SCENE_ENTERED` events to refresh.

#### 9. XP Bar Animation

On XP gain:
1. Flash XP text yellow
2. Animate bar fill from old to new value (300ms ease-out)

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] Quest JSON files are valid
- [x] QuestManager unit test: validation logic works for both quests

#### Manual Verification:

- [x] `/status` first time → status output, then quest-1-activation dialogue triggers
- [x] Terminal Mission mode shows Quest 1 briefing with inputPayload
- [x] `/quest` shows Quest 1 briefing
- [x] `/hint` shows progressive hints (3 available)
- [x] `/solve wrong-answer` → "Nieprawidłowa odpowiedź..."
- [x] `/solve recalibrate-CAL-7031` → quest-1-complete dialogue → Quest 2 activates
- [x] XP bar updates (0 → 75 XP)
- [x] `/map` now shows star map (was offline before)
- [x] Holographic Projector on bridge now shows "Mapa aktywna" dialogue
- [x] `/solve 14.7.26` → quest-2-complete dialogue
- [x] XP bar updates (75 → 175 XP)
- [x] `demo-complete` flag set
- [x] HUD shows correct level, XP, and location at all times
- [x] HUD doesn't scroll with camera

**Implementation Note**: Pause for manual verification before Phase 7.

---

## Phase 7: Cinematic Intro + End Screen + State Persistence

### Overview

Implement the simplified cinematic intro, demo completion end screen with CTA, and full localStorage persistence with proper save/load cycle. After this phase, the complete demo is playable from fresh start to end screen, and state survives page refresh.

### Changes Required:

#### 1. Simplified Cinematic Intro

On first entry to ship-hibernation (`introSeen === false`):

1. Player spawns but is invisible. Movement disabled.
2. Black screen with centered text (monospace, white on black):
   - "Statek głębokiej przestrzeni Odyssey" (fade in, hold 3s)
   - "322 dni od ostatniego wpisu w logu" (fade in below, hold 3s)
3. Both texts fade out (500ms)
4. Camera snaps to player position. Player sprite fades in (500ms).
5. Set `intro-seen` flag
6. Trigger `awakening-monologue` dialogue

Implementation: This can be handled within `GameScene.create()` — check `introSeen` flag, if false, run the cinematic sequence using tweens, then enable normal gameplay. Alternatively, a brief method in GameScene that chains tweens.

#### 2. End Screen Overlay

**Trigger:** `demo-complete` flag set (after Quest 2 completion dialogue finishes).

After `quest-2-complete` dialogue completes:
1. Camera slowly zooms out (tween zoom from current to 1 over 2s)
2. Dark overlay (70% opacity) covers viewport
3. Centered text panel appears:

```
──────────────────────────────────
DEMO UKOŃCZONE
──────────────────────────────────

Stan twojego Astronauty został zapisany.
Gdy etap Prework się odblokuje,
podróż będzie kontynuowana.

Dołącz do 10xDevs 3.0, aby odblokować
pełną misję — 5 księżyców czeka.

    [ Dowiedz się więcej → ]

──────────────────────────────────
Prework: 15 kwi 2026
Księżyc 1: 18 maj 2026
──────────────────────────────────
```

4. CTA button opens configurable URL in new tab
5. Click anywhere outside the panel (or press Esc) → dismiss overlay
6. Player can continue exploring freely after dismissal
7. Terminal shows: "Wszystkie misje demo ukończone. Gratulacje, Nawigatorze."

Implementation: Phaser overlay in GameScene — a dark rectangle + text objects + interactive zone for CTA. Can also be a simple Phaser scene overlay.

#### 3. Full State Persistence

**File**: `src/explorers/state/GameStateManager.ts` (update)

Complete `saveState()` and `loadState()`:

**saveState():**
```typescript
function saveState(state: DemoGameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
```

**loadState():**
```typescript
function loadState(): DemoGameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (data.version !== 1) return null;
    return data as DemoGameState;
  } catch {
    return null;
  }
}
```

**Save triggers** — wire all triggers from spec §3:

| Trigger | When |
|---------|------|
| Scene transition (door) | Before map unload in TransitionScene |
| Terminal unlock | After boot sequence completes |
| Quest completion | After rewards granted |
| Flag set | After any flag change |
| `beforeunload` | Window unload event (in PhaserGame.svelte) |
| `/save` command | Already implemented in Phase 4 |
| Periodic | setInterval every 30s (in GameScene) |

**Load behavior on boot:**
1. BootScene reads localStorage
2. If valid state found: restore map, position, facing, flags, quests, terminal state, XP
3. GameScene receives restored map + position via init data
4. Terminal checks `terminalUnlocked` to show locked/unlocked state
5. If introSeen: skip cinematic

#### 4. Wire beforeunload

**File**: `src/explorers/PhaserGame.svelte` (update)

Add `beforeunload` listener in `onMount` that saves current state. Remove in `onDestroy`.

#### 5. Periodic Auto-Save

In `GameScene.create()`, start a 30-second interval that saves state. Clear on scene shutdown.

#### 6. Activity Log Entries

Wire activity log throughout the game:
- "Terminal odblokowany" — on unlock
- "Odkryto: Kod awaryjny 0451" — on keycode-found flag
- "Misja aktywowana: {title}" — on quest activation
- "Misja ukończona: {title} (+{xp} XP)" — on quest completion

Store as `{ timestamp, message }` in state. Used by `/log` command.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build`
- [x] State serialization/deserialization roundtrip test passes

#### Manual Verification:

- [ ] **Fresh start** (clear localStorage): cinematic intro plays (2 text lines, fade, player appears)
- [ ] After intro: awakening monologue dialogue triggers
- [ ] **Page refresh after unlocking terminal**: terminal shows unlocked state, not lock screen
- [ ] **Page refresh on ship-bridge**: player spawns on bridge, not hibernation
- [ ] **Page refresh after Quest 1 complete**: Quest 2 is active, XP = 75, /map works
- [ ] **Complete full playthrough**: intro → explore → find code → unlock → /status → Quest 1 → Quest 2 → end screen
- [ ] End screen shows with CTA button
- [ ] CTA button opens link in new tab
- [ ] Pressing Esc dismisses end screen, player can continue exploring
- [ ] Terminal shows "Wszystkie misje demo ukończone" after dismissal
- [ ] `/log` shows complete activity history with timestamps
- [ ] Periodic save works (check localStorage updates every 30s)
- [ ] `beforeunload` saves state (close tab, reopen → state restored)
- [ ] No console errors during complete playthrough

**Implementation Note**: This is the final phase. Do a complete playthrough test from fresh state after all automated verification passes.

---

## Testing Strategy

### Unit Tests:

- **StateMachine** — Valid/invalid transitions, callbacks, isState() checks
- **QuestManager** — Validation logic (exact-lowercase, exact-trim), quest state transitions, hint progression, reward calculation
- **GameStateManager** — Serialization roundtrip (save → load), version migration, corrupted data handling
- **commandHandler** — Each slash command returns expected output format

### Integration Tests:

- N/A — no backend/API in demo milestone

### Manual Testing Steps (Complete Playthrough):

1. Clear localStorage, navigate to `/explorers`
2. Cinematic intro plays → awakening monologue
3. Move with WSAD, collide with walls
4. Interact with objects: pod, screens, notice board
5. Interact with Emergency Locker → find-keycode dialogue → keycode-found flag
6. Enter 0451 in terminal → boot sequence → first-contact dialogue
7. Type `/help` → command list
8. Type `/status` → diagnostics → quest-1-activation dialogue
9. Type `/quest` → Quest 1 briefing with inputPayload
10. Type `/hint` three times → 3 progressive hints
11. Type `/solve recalibrate-CAL-7031` → quest-1-complete dialogue → XP +75
12. Type `/map` → star map displays
13. Walk to bridge → interact with holo projector → "mapa aktywna" dialogue
14. Type `/quest` → Quest 2 briefing
15. Type `/solve 14.7.26` → quest-2-complete dialogue → XP +175 → end screen
16. Dismiss end screen → continue exploring
17. Refresh page → state fully restored
18. Walk through all 3 maps via doors → transitions work

## Performance Considerations

- **Placeholder assets** are trivially small (<50 KB total). No optimization needed.
- **Phaser code-split** by Vite — only loaded on `/explorers` route.
- **localStorage** reads are synchronous but data is small (<5 KB). No performance concern.
- **Future concern:** When real pixel-art assets replace placeholders, monitor total asset size against <1 MB per map budget.

## References

- Demo milestone spec: `.ai/10x-devs/game/demo-milestone-spec.md`
- Architecture spec: `.ai/10x-devs/game/architecture-spec.md`
- Storyline: `.ai/10x-devs/game/storyline.md`
- Sprites theme: `.ai/10x-devs/game/sprites-theme.md`
- Business spec: `.ai/10x-devs/game/10x-explorers-spec.md`
- Previous architecture plan: `thoughts/shared/plans/2026-02-18-clean-phaser-architecture.md` (superseded by this plan)

---

## User Request Changes (Post-Plan)

Changes made during implementation at the user's request that differ from the original plan:

### 1. Layout: Full-Screen Game + Floating Terminal Overlay
**Original plan:** 65/35 split layout — Phaser canvas on the left (65%), Smart Terminal on the right (35%), always visible side-by-side.

**Implemented:** Game canvas fills 100% of the viewport. Terminal is a floating overlay card (380px, rounded corners, dark background) that pops out on the right side with a dimmed game backdrop. Toggle via `Ctrl+`` ` — binary open/closed, no intermediate states.

### 2. Terminal Focus Shortcut: Ctrl+` Instead of Backtick
**Original plan:** Plain backtick (`` ` ``) toggles focus between game and terminal.

**Implemented:** `Ctrl+`` ` (or `Cmd+`` ` on Mac) for cross-platform safety — bare backtick conflicts with typing in terminal inputs. `Esc` closes the terminal panel.

### 3. Click-to-Focus Between Game and Terminal
**Original plan:** Only keyboard shortcut for focus switching.

**Implemented:** Clicking the game area closes the terminal. Clicking the terminal card opens/focuses it. Clicking the dimmed backdrop closes the terminal.

### 4. Terminal Autocomplete
**Original plan:** No autocomplete mentioned.

**Implemented:** Typing `/` in the terminal input shows a vertical list of all available commands. As the user types, the list filters to matching commands. `Tab` completes the first match. Clicking a suggestion applies it. No arrow-key navigation (kept simple).

### 5. Keyboard Event Isolation
**Original plan:** Not specified — assumed Phaser and DOM inputs would coexist.

**Implemented:** `stopPropagation` on terminal container's `keydown`/`keyup` prevents Phaser from capturing keys typed in the terminal (e.g., E, W, S, A, D). `Ctrl+`` ` and `Esc` are allowed to bubble through so the global handler in PhaserGame.svelte can process them.

### 6. Dynamic Camera Zoom
**Original plan:** Integer zoom based on `CAMERA_BASE_WIDTH = 480` → `Math.floor(canvasWidth / 480)`.

**Implemented:** Dynamic fractional zoom that fits the map within the viewport: `zoom = max(1.5, min(canvasW/min(mapW, 600), canvasH/min(mapH, 400)))`. Maps are always centered and fill a reasonable portion of the screen regardless of canvas size.

### 7. HUD Terminal Hotkey Hint
**Original plan:** HUD shows rank, XP bar, location only.

**Implemented:** Added `[Ctrl+`] Terminal` label in teal on the right side of the HUD bar so the player always knows how to open the terminal.
