# Clean Phaser Architecture — Implementation Plan

## Overview

Build the foundational Phaser 3 architecture for 10x Explorers, transforming the current skeleton (`PhaserGame.svelte` with an inline BootScene) into a clean, modular game framework. This establishes the scene system, entity framework, state management, event bus, tilemap pipeline, dialogue system, and input handling — everything inside the Phaser canvas — so that building actual game content becomes straightforward.

## Current State Analysis

The game exists as a minimal bootstrap:

- `src/explorers/PhaserGame.svelte` — 45-line Svelte component with an inline `BootScene` that only sets background color
- `src/pages/explorers.astro` — 8-line page using `GameLayout` + `PhaserGame` with `client:only="svelte"`
- `src/layouts/GameLayout.astro` — 16-line full-viewport layout (no header/footer)
- Phaser `^3.90.0` is installed in `package.json`
- `@/explorers/*` path alias configured in `tsconfig.json`
- No game logic, no scenes, no entities, no state, no assets

### Key Discoveries:

- Architecture spec (`.ai/10x-devs/game/architecture-spec.md`, 1,809 lines) defines the complete target architecture — this plan implements the Phaser-side subset
- The spec mandates a hybrid rendering approach: 65% Phaser canvas + 35% DOM Smart Terminal — this plan covers only the Phaser canvas side
- Background color in current code (`#111827`) doesn't match the spec palette (`#0a0e2a` Deep Navy)
- Phaser config is currently missing critical pixel-art settings: `pixelArt: true`, `roundPixels: true`
- No physics configuration exists yet (needs `arcade` with zero gravity for top-down RPG)

## Desired End State

After this plan is complete:

1. **Scene system** — 7 scene classes following the spec's lifecycle: `BootScene` → `PreloaderScene` → `GameScene` + `HudScene` (parallel) + `DialogueScene` (overlay) + `TransitionScene` (overlay)
2. **Entity system** — `Astronaut` player with WSAD movement and state machine, `NPC` with idle animation and interaction zone, `InteractiveObject` for doors/terminals/items/triggers
3. **State management** — `GameState` stored in Phaser registry, accessible from any scene via `BaseScene` helpers, with typed interfaces for player/quest/inventory/terminal state
4. **Event bus** — Typed event constants and payloads, centralized on `game.events`, with proper listener cleanup on scene shutdown
5. **Tilemap pipeline** — `GameScene` loads Tiled JSON maps, creates layers in correct depth order, sets up collision by property, parses Zones object layer to spawn entities
6. **Dialogue system** — `DialogueScene` with typewriter effect, 4 display modes (dialogue/monologue/system/cinematic), queue-based advancement, movement blocking
7. **HUD** — Parallel `HudScene` with level, XP bar, location, and quest count
8. **Input handling** — WSAD movement, [E] interaction, [M] map toggle, keyboard focus management
9. **Placeholder assets** — Minimal colored-rectangle tileset, simple test tilemap, and placeholder astronaut sprite so the architecture can be visually verified
10. **Clean `PhaserGame.svelte`** — Uses extracted `createGameConfig()`, external scene classes, proper lifecycle

### Verification:

- Navigate to `/explorers` → full-viewport Phaser canvas renders with Deep Navy background
- `BootScene` initializes registry → transitions to `PreloaderScene` (progress bar visible) → transitions to `GameScene`
- Astronaut spawns on placeholder tilemap, moves with WSAD, collides with walls
- Walking near an NPC/object shows "[E] Interakcja" prompt
- Pressing E triggers dialogue with typewriter effect
- HUD bar visible at top showing placeholder level/location
- Scene transitions work with fade-to-black effect
- No console errors, no memory leaks on scene restart

## What We're NOT Doing

- **Smart Terminal (Svelte DOM panel)** — Separate plan; this is Phaser-only
- **Backend API / Supabase** — No database, no `/api/game/*` endpoints, no save/load
- **WebSocket / real-time updates** — No network layer
- **Quest system logic** — No `QuestManager`, no quest state machine, no quest validation
- **Inventory system** — No `InventoryManager`, no item pickup logic, no inventory UI overlay
- **Progression / XP** — No `ProgressionManager`, no level-up calculations, no rank system
- **Save system** — No `SaveManager`, no persistence, no `beforeunload` handler
- **Real art assets** — Using placeholder graphics only; real sprites, tilesets, and audio come later
- **Audio** — No BGM, no SFX, no audio loading (placeholder architecture stub only)
- **Authentication / route protection** — No login check on `/explorers`
- **Mobile detection / blocking** — No "desktop only" message
- **Demo storyline content** — No Scene 0.1 awakening, no locked terminal, no actual quests

## Implementation Approach

Build incrementally in 7 phases, each producing a testable checkpoint. Early phases establish the foundation (config, events, state); middle phases build the scene and entity systems; final phases wire up interaction and dialogue. Each phase depends on the previous one.

The architecture follows `architecture-spec.md` closely for file structure, naming, and patterns, but simplifies by:
- Skipping all network/backend-dependent systems
- Using Phaser Graphics primitives instead of real sprites where possible
- Creating the minimal placeholder tilemap by hand (JSON) instead of requiring Tiled
- Stubbing deferred systems with TODO comments and empty interfaces

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Scene registration:** Scenes are registered in `BootScene.create()` via `this.scene.add()`, not in the Phaser config `scene` array. Only `BootScene` is in the config array. This allows dynamic scene management.
- **Parallel scene launch:** `HudScene` is launched (not started) from `PreloaderScene.create()` alongside `GameScene`. It runs independently and never restarts.
- **Overlay scene lifecycle:** `DialogueScene` uses sleep/wake pattern — launched once, then `scene.sleep()` / `scene.wake()` to show/hide. Never destroyed.
- **Listener cleanup:** Every `this.bus.on(...)` registered in `create()` must have a corresponding `this.bus.off(...)` in the scene's `shutdown` event. Use `this.events.on('shutdown', this.cleanup, this)` pattern.
- **GameScene restart on map change:** `this.scene.restart({ mapKey, spawnX, spawnY })` — the scene re-runs `init()` → `preload()` → `create()` with new data.

### User Experience Specification

- **Placeholder visuals:** Colored rectangles for sprites (teal for astronaut, amber for NPCs, purple for interactable objects). The tilemap uses a generated simple tileset with floor/wall tiles.
- **Dialogue bar:** Appears at bottom 20% of canvas with semi-transparent dark background. Text in white, typewriter at 30 chars/sec.
- **Interaction prompt:** "[E] Interakcja" text floating above interactive objects when player is within 48px radius.
- **HUD bar:** Top of canvas, 40px height, shows "Lv.1 Kadet | Statek | Q 0/0" as placeholder.
- **Transition:** Full-screen black rectangle alpha tween: 0→1 in 300ms, scene restart, 1→0 in 300ms.

### Performance & Optimization Strategy

- **N/A for this phase.** The placeholder assets are trivially small. No object pooling, memoization, or caching strategies needed. These will be addressed when real assets and content are added.

### State Management Sequencing

- **State initialization:** `BootScene.create()` sets default `GameState` in registry before any other scene runs.
- **State access pattern:** All scenes extend `BaseScene` which provides `this.gameState` getter and `this.updateState()` helper. No direct `registry.get/set` outside BaseScene.
- **Event flow for state changes:** `updateState()` → patches registry → emits `state:changed` on bus → HudScene and other listeners react.
- **No persistence:** State lives only in Phaser registry (in-memory). Refreshing the page resets everything.

### Debug & Observability Plan

- **Verification method:** Each phase has manual verification steps listed in success criteria
- **Phaser debug mode:** `arcade.debug: import.meta.env.DEV` — shows physics bodies in development
- **Console logging:** `BootScene` logs Phaser version and game state initialization. Scene transitions log `[Scene] Entering {sceneKey}`. Dialogue logs queue state.
- **No metrics:** No monitoring or analytics in this architectural phase.

---

## Phase 1: Config, Events & State Foundation

### Overview

Extract game configuration from the inline Svelte code, establish the event system constants, and define state interfaces. No visual changes yet — this is the structural foundation.

### Changes Required:

#### 1. Game Config

**File**: `src/explorers/config/gameConfig.ts`
**Changes**: New file — Phaser config factory

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
**Changes**: New file — shared constants

```typescript
// Tile & world
export const TILE_SIZE = 32;
export const PLAYER_SPEED = 120;
export const PLAYER_FRAME_WIDTH = 32;
export const PLAYER_FRAME_HEIGHT = 48;

// Camera
export const CAMERA_LERP = 0.08;
export const CAMERA_DEADZONE_X = 64;
export const CAMERA_DEADZONE_Y = 48;
export const CAMERA_BASE_WIDTH = 480;

// Dialogue
export const TYPEWRITER_CHARS_PER_SEC = 30;
export const SYSTEM_MESSAGE_DURATION_MS = 3000;
export const TRANSITION_FADE_MS = 300;

// Interaction
export const INTERACTION_RADIUS = 48;
export const INTERACTION_ZONE_SIZE = 32;

// Depths
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

// Colors (from sprites-theme.md palette)
export const COLORS = {
  DEEP_NAVY: 0x0a0e2a,
  COSMIC_PURPLE: 0x2d1b69,
  TEAL: 0x00d4aa,
  WARM_AMBER: 0xffb347,
  WHITE: 0xffffff,
  DARK_BG: 0x111827,
} as const;
```

#### 3. Scene Registry

**File**: `src/explorers/config/sceneRegistry.ts`
**Changes**: New file — scene key enum

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
**Changes**: New file — typed event name constants and payload interfaces

```typescript
// Event names — use these constants, never string literals
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

  // Player
  PLAYER_LEVEL_UP: 'player:level-up',

  // Quest (stubs — used by HUD display, actual system deferred)
  QUEST_ACTIVATED: 'quest:activated',
  QUEST_UPDATED: 'quest:updated',
  QUEST_COMPLETED: 'quest:completed',

  // Terminal bridge (stubs — actual terminal deferred)
  TERMINAL_COMMAND: 'terminal:command',
  TERMINAL_FOCUS_CHANGED: 'terminal:focus-changed',

  // XP
  XP_GAINED: 'xp:gained',
} as const;

// Payload types
export interface SceneEnteredPayload {
  mapKey: string;
}

export interface TransitionStartPayload {
  targetMap: string;
  spawnX: number;
  spawnY: number;
}

export interface DialogueShowPayload {
  dialogueId: string;
}

export interface InteractionPayload {
  objectId: string;
  objectType: string;
  properties: Record<string, unknown>;
}

export interface TerminalFocusPayload {
  focused: boolean;
}
```

#### 5. State Types

**File**: `src/explorers/state/types.ts`
**Changes**: New file — all state interfaces

```typescript
export type FacingDirection = 'down' | 'up' | 'left' | 'right';

export interface PlayerState {
  id: string;
  level: number;
  xp: number;
  rank: string;
  position: { x: number; y: number };
  facingDirection: FacingDirection;
}

export interface QuestProgressState {
  active: string | null;
  completed: string[];
  available: string[];
  hintIndex: Record<string, number>;
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface InventoryState {
  items: InventorySlot[];
  equipped: {
    tool: string | null;
    accessory: string | null;
  };
}

export interface TerminalState {
  mode: 'mission' | 'archive' | 'comms';
  commandHistory: string[];
  activityLog: ActivityLogEntry[];
}

export interface ActivityLogEntry {
  timestamp: number;
  type: 'xp' | 'quest' | 'discovery' | 'item' | 'level-up';
  message: string;
}

export interface GameState {
  player: PlayerState;
  quests: QuestProgressState;
  inventory: InventoryState;
  flags: Set<string>;
  terminal: TerminalState;
  currentMap: string;
  lastSaveTimestamp: number;
}
```

#### 6. GameState Helper

**File**: `src/explorers/state/GameState.ts`
**Changes**: New file — default state factory and registry key

```typescript
import type { GameState } from './types';

export const GAME_STATE_KEY = 'gameState';

export function createDefaultGameState(): GameState {
  return {
    player: {
      id: '',
      level: 1,
      xp: 0,
      rank: 'Kadet',
      position: { x: 160, y: 240 },
      facingDirection: 'down',
    },
    quests: {
      active: null,
      completed: [],
      available: [],
      hintIndex: {},
    },
    inventory: {
      items: [],
      equipped: { tool: null, accessory: null },
    },
    flags: new Set<string>(),
    terminal: {
      mode: 'mission',
      commandHistory: [],
      activityLog: [],
    },
    currentMap: 'ship-hibernation',
    lastSaveTimestamp: 0,
  };
}
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] All new files exist at correct paths
- [ ] No circular imports

#### Manual Verification:

- [ ] N/A (no visual changes in this phase — foundation only)

---

## Phase 2: Scene System

### Overview

Build the scene class hierarchy: `BaseScene` abstract class, `BootScene` (initializes registry + transitions), `PreloaderScene` (shows progress bar, loads global assets), and `TransitionScene` (fade-to-black). Update `PhaserGame.svelte` to use the extracted config. After this phase, the game boots through `BootScene` → `PreloaderScene` and displays a loading screen.

### Changes Required:

#### 1. BaseScene

**File**: `src/explorers/scenes/BaseScene.ts`
**Changes**: New file — abstract base scene

```typescript
import Phaser from 'phaser';
import { GAME_STATE_KEY } from '../state/GameState';
import { GameEvents } from '../events/GameEvents';
import type { GameState } from '../state/types';

export abstract class BaseScene extends Phaser.Scene {
  protected get bus(): Phaser.Events.EventEmitter {
    return this.game.events;
  }

  protected get gameState(): GameState {
    return this.registry.get(GAME_STATE_KEY) as GameState;
  }

  protected updateState(updater: (state: GameState) => Partial<GameState>): void {
    const current = this.gameState;
    const patch = updater(current);
    const newState = { ...current, ...patch };
    this.registry.set(GAME_STATE_KEY, newState);
    this.bus.emit(GameEvents.STATE_CHANGED, newState);
  }
}
```

#### 2. BootScene

**File**: `src/explorers/scenes/BootScene.ts`
**Changes**: New file — one-time initialization, replaces the inline BootScene

```typescript
import { BaseScene } from './BaseScene';
import { SceneKey } from '../config/sceneRegistry';
import { GAME_STATE_KEY, createDefaultGameState } from '../state/GameState';
import { PreloaderScene } from './PreloaderScene';
import { GameScene } from './GameScene';
import { HudScene } from './HudScene';
import { DialogueScene } from './DialogueScene';
import { TransitionScene } from './TransitionScene';

export class BootScene extends BaseScene {
  constructor() {
    super({ key: SceneKey.BOOT });
  }

  create(): void {
    console.log(`[BootScene] Phaser ${Phaser.VERSION} | 10x Explorers`);

    // Initialize game state in registry
    this.registry.set(GAME_STATE_KEY, createDefaultGameState());

    // Register all scenes
    this.scene.add(SceneKey.PRELOADER, PreloaderScene, false);
    this.scene.add(SceneKey.GAME, GameScene, false);
    this.scene.add(SceneKey.HUD, HudScene, false);
    this.scene.add(SceneKey.DIALOGUE, DialogueScene, false);
    this.scene.add(SceneKey.TRANSITION, TransitionScene, false);

    // Transition to preloader
    this.scene.start(SceneKey.PRELOADER);
  }
}
```

Note: In the full game, `BootScene` will also fetch auth token and load player state from API. For now it just initializes defaults.

#### 3. PreloaderScene

**File**: `src/explorers/scenes/PreloaderScene.ts`
**Changes**: New file — progress bar, loads global assets, transitions to GameScene + HudScene

```typescript
import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKey } from '../config/sceneRegistry';
import { COLORS } from '../config/constants';

export class PreloaderScene extends BaseScene {
  constructor() {
    super({ key: SceneKey.PRELOADER });
  }

  preload(): void {
    this.createProgressBar();
    this.loadPlaceholderAssets();
  }

  create(): void {
    // Start main game + launch HUD in parallel
    this.scene.start(SceneKey.GAME, {
      mapKey: 'test-room',
      spawnX: 5,
      spawnY: 5,
    });
    this.scene.launch(SceneKey.HUD);
  }

  private createProgressBar(): void {
    const { width, height } = this.scale;
    const barWidth = 300;
    const barHeight = 20;
    const x = (width - barWidth) / 2;
    const y = height / 2;

    // Background bar
    const bgBar = this.add.rectangle(
      width / 2, y, barWidth, barHeight, 0x222222
    );
    bgBar.setStrokeStyle(1, COLORS.TEAL);

    // Fill bar
    const fillBar = this.add.rectangle(
      x + 1, y, 0, barHeight - 2, COLORS.TEAL
    ).setOrigin(0, 0.5);

    // Title text
    this.add.text(width / 2, y - 40, '10x EXPLORERS', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#00d4aa',
    }).setOrigin(0.5);

    // Loading text
    const loadingText = this.add.text(width / 2, y + 30, 'Ładowanie zasobów...', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Progress events
    this.load.on('progress', (value: number) => {
      fillBar.width = (barWidth - 2) * value;
    });

    this.load.on('complete', () => {
      loadingText.setText('Gotowe!');
    });
  }

  private loadPlaceholderAssets(): void {
    // Placeholder assets will be generated programmatically in Phase 3.
    // For now, create a minimal texture in create() if no assets exist.
    // This method will be expanded when AssetManifest is added.
  }
}
```

#### 4. TransitionScene

**File**: `src/explorers/scenes/TransitionScene.ts`
**Changes**: New file — fade-to-black overlay for map transitions

```typescript
import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKey } from '../config/sceneRegistry';
import { TRANSITION_FADE_MS, DEPTH } from '../config/constants';
import { GameEvents } from '../events/GameEvents';
import type { TransitionStartPayload } from '../events/GameEvents';

export class TransitionScene extends BaseScene {
  private overlay!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: SceneKey.TRANSITION });
  }

  create(): void {
    const { width, height } = this.scale;
    this.overlay = this.add.rectangle(
      width / 2, height / 2, width, height, 0x000000
    ).setAlpha(0).setDepth(DEPTH.TRANSITION);

    // Listen for transition requests
    this.bus.on(GameEvents.TRANSITION_START, this.startTransition, this);
    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.TRANSITION_START, this.startTransition, this);
    });
  }

  private startTransition(payload: TransitionStartPayload): void {
    // Fade in to black
    this.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: TRANSITION_FADE_MS,
      onComplete: () => {
        // Restart game scene with new map data
        this.scene.get(SceneKey.GAME).scene.restart({
          mapKey: payload.targetMap,
          spawnX: payload.spawnX,
          spawnY: payload.spawnY,
        });

        // Fade out after a brief pause for scene rebuild
        this.time.delayedCall(200, () => {
          this.tweens.add({
            targets: this.overlay,
            alpha: 0,
            duration: TRANSITION_FADE_MS,
            onComplete: () => {
              this.bus.emit(GameEvents.TRANSITION_COMPLETE);
            },
          });
        });
      },
    });
  }
}
```

#### 5. Update PhaserGame.svelte

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Replace inline BootScene with imported config and scene

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Phaser from 'phaser';
  import { createGameConfig } from './config/gameConfig';
  import { BootScene } from './scenes/BootScene';

  let container: HTMLDivElement;
  let game: Phaser.Game | null = null;

  onMount(() => {
    const config = createGameConfig(container);
    config.scene = [BootScene];
    game = new Phaser.Game(config);
  });

  onDestroy(() => {
    game?.destroy(true);
    game = null;
  });
</script>

<div bind:this={container} class="w-full h-full"></div>

<style>
  div :global(canvas) {
    display: block;
  }
</style>
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Navigate to `/explorers` → Deep Navy background renders (not gray)
- [ ] Console shows `[BootScene] Phaser X.XX.X | 10x Explorers`
- [ ] PreloaderScene progress bar briefly visible (may flash by quickly with no real assets)
- [ ] No console errors

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Placeholder Assets & Tilemap Pipeline

### Overview

Create the minimal placeholder assets needed to verify the tilemap pipeline: a simple tileset PNG, a hand-crafted Tiled-compatible JSON tilemap, and a placeholder astronaut spritesheet. Build the `AssetManifest` and wire asset loading into `PreloaderScene`. Create `GameScene` with tilemap rendering, layer setup, and camera follow (no player movement yet — that's Phase 4).

### Changes Required:

#### 1. Placeholder Tileset

**File**: `public/game/tilesets/placeholder.png`
**Changes**: Generate a minimal 64x32 PNG with 2 tiles (32x32 each): tile 0 = dark floor (#1a1a2e), tile 1 = wall (#4a4a6a). This can be created programmatically with a script or manually.

Use a small Node script to generate:

```typescript
// scripts/generate-placeholder-tileset.ts
// Generates a 64x32 PNG with 2 tiles: floor and wall
// Run: npx ts-node scripts/generate-placeholder-tileset.ts
```

Alternatively, create a 64x32 PNG by hand with any image editor. Two 32x32 squares: left = floor (dark), right = wall (lighter with border).

#### 2. Placeholder Tilemap

**File**: `public/game/maps/test-room.json`
**Changes**: Hand-crafted Tiled-compatible JSON for a 12x10 tile room. Walls around the edges, floor in the middle, a "door" zone object, and an "npc" zone object.

The JSON structure must follow Tiled TMJ format:
- `width: 12`, `height: 10`, `tilewidth: 32`, `tileheight: 32`
- Layers: `Ground` (tile layer), `Walls` (tile layer), `Zones` (object layer)
- `Ground` filled with tile index 1 (floor)
- `Walls` has tile index 2 (wall) around perimeter, 0 elsewhere
- `Zones` has objects: one `spawn` at (5,5), one `npc` at (8,3), one `door` at (11,5)
- Tileset references `placeholder.png` with `collides` property on the wall tile

#### 3. Placeholder Astronaut Spritesheet

**File**: `public/game/sprites/placeholder-astronaut.png`
**Changes**: Minimal 128x48 PNG spritesheet — 4 frames of 32x48 each. Each frame is a teal (#00d4aa) rectangle with a small directional indicator (arrow or different shade) so you can see facing direction. This is enough for idle-down, idle-left, idle-right, idle-up.

#### 4. Asset Manifest

**File**: `src/explorers/assets/AssetManifest.ts`
**Changes**: New file — defines global and per-map asset references

```typescript
export interface SpritesheetAsset {
  key: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
}

export interface ImageAsset {
  key: string;
  path: string;
}

export interface TilemapAsset {
  key: string;
  path: string;
}

export interface MapAssetManifest {
  tilemap: TilemapAsset;
  tilesets: ImageAsset[];
  spritesheets?: SpritesheetAsset[];
}

export const GLOBAL_ASSETS = {
  spritesheets: [
    {
      key: 'placeholder-astronaut',
      path: 'game/sprites/placeholder-astronaut.png',
      frameWidth: 32,
      frameHeight: 48,
    },
  ] as SpritesheetAsset[],
  images: [] as ImageAsset[],
};

export const MAP_ASSETS: Record<string, MapAssetManifest> = {
  'test-room': {
    tilemap: { key: 'test-room', path: 'game/maps/test-room.json' },
    tilesets: [{ key: 'placeholder', path: 'game/tilesets/placeholder.png' }],
  },
};
```

#### 5. Update PreloaderScene

**File**: `src/explorers/scenes/PreloaderScene.ts`
**Changes**: Load global assets from manifest in `preload()`

Update `loadPlaceholderAssets()`:
```typescript
private loadPlaceholderAssets(): void {
  for (const sprite of GLOBAL_ASSETS.spritesheets) {
    this.load.spritesheet(sprite.key, sprite.path, {
      frameWidth: sprite.frameWidth,
      frameHeight: sprite.frameHeight,
    });
  }
  for (const image of GLOBAL_ASSETS.images) {
    this.load.image(image.key, image.path);
  }
}
```

#### 6. GameScene (Initial — Tilemap Only)

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: New file — loads tilemap, creates layers, sets up camera, parses zones

```typescript
import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKey } from '../config/sceneRegistry';
import { TILE_SIZE, DEPTH, CAMERA_LERP, CAMERA_DEADZONE_X, CAMERA_DEADZONE_Y, CAMERA_BASE_WIDTH } from '../config/constants';
import { GameEvents } from '../events/GameEvents';
import { MAP_ASSETS } from '../assets/AssetManifest';

interface GameSceneData {
  mapKey: string;
  spawnX: number;
  spawnY: number;
}

export class GameScene extends BaseScene {
  private mapKey!: string;
  private spawnX!: number;
  private spawnY!: number;
  private map!: Phaser.Tilemaps.Tilemap;
  private wallsLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: SceneKey.GAME });
  }

  init(data: GameSceneData): void {
    this.mapKey = data.mapKey;
    this.spawnX = data.spawnX;
    this.spawnY = data.spawnY;
    console.log(`[GameScene] Entering map: ${this.mapKey}`);
  }

  preload(): void {
    const mapAssets = MAP_ASSETS[this.mapKey];
    if (!mapAssets) {
      console.error(`[GameScene] No assets defined for map: ${this.mapKey}`);
      return;
    }

    if (!this.cache.tilemap.exists(mapAssets.tilemap.key)) {
      this.load.tilemapTiledJSON(mapAssets.tilemap.key, mapAssets.tilemap.path);
    }
    for (const tileset of mapAssets.tilesets) {
      if (!this.textures.exists(tileset.key)) {
        this.load.image(tileset.key, tileset.path);
      }
    }
    if (mapAssets.spritesheets) {
      for (const sprite of mapAssets.spritesheets) {
        if (!this.textures.exists(sprite.key)) {
          this.load.spritesheet(sprite.key, sprite.path, {
            frameWidth: sprite.frameWidth,
            frameHeight: sprite.frameHeight,
          });
        }
      }
    }
  }

  create(): void {
    this.buildWorld();
    this.setupCamera();
    this.parseZones();

    this.bus.emit(GameEvents.SCENE_ENTERED, { mapKey: this.mapKey });
  }

  private buildWorld(): void {
    this.map = this.make.tilemap({ key: this.mapKey });

    // Add all tilesets referenced by map
    const mapAssets = MAP_ASSETS[this.mapKey];
    const tilesets: Phaser.Tilemaps.Tileset[] = [];
    for (const ts of mapAssets.tilesets) {
      const tileset = this.map.addTilesetImage(ts.key, ts.key);
      if (tileset) tilesets.push(tileset);
    }

    // Create layers in depth order
    const groundLayer = this.map.createLayer('Ground', tilesets);
    groundLayer?.setDepth(DEPTH.GROUND);

    const groundDecorLayer = this.map.createLayer('GroundDecor', tilesets);
    groundDecorLayer?.setDepth(DEPTH.GROUND_DECOR);

    this.wallsLayer = this.map.createLayer('Walls', tilesets)!;
    if (this.wallsLayer) {
      this.wallsLayer.setDepth(DEPTH.WALLS);
      this.wallsLayer.setCollisionByProperty({ collides: true });
    }

    const objectsLayer = this.map.createLayer('Objects', tilesets);
    objectsLayer?.setDepth(DEPTH.OBJECTS);

    const aboveLayer = this.map.createLayer('Above', tilesets);
    aboveLayer?.setDepth(DEPTH.ABOVE);
  }

  private setupCamera(): void {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    cam.setZoom(this.calculateZoom());

    // Recalculate zoom on resize
    this.scale.on('resize', () => {
      cam.setZoom(this.calculateZoom());
    });
  }

  private calculateZoom(): number {
    const canvasWidth = this.scale.width;
    return Math.max(1, Math.floor(canvasWidth / CAMERA_BASE_WIDTH));
  }

  private parseZones(): void {
    const zonesLayer = this.map.getObjectLayer('Zones');
    if (!zonesLayer) return;

    for (const obj of zonesLayer.objects) {
      const type = obj.type || this.getObjectProperty(obj, 'type');
      const id = obj.name || this.getObjectProperty(obj, 'id');

      // Store zone data for later use by entity spawning (Phase 4-5)
      console.log(`[GameScene] Zone: type=${type}, id=${id}, x=${obj.x}, y=${obj.y}`);
    }
  }

  private getObjectProperty(obj: Phaser.Types.Tilemaps.TiledObject, name: string): string {
    const prop = obj.properties?.find(
      (p: { name: string; value: unknown }) => p.name === name
    );
    return prop?.value as string ?? '';
  }

  getWallsLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.wallsLayer;
  }

  getMap(): Phaser.Tilemaps.Tilemap {
    return this.map;
  }

  getSpawnPosition(): { x: number; y: number } {
    return {
      x: this.spawnX * TILE_SIZE + TILE_SIZE / 2,
      y: this.spawnY * TILE_SIZE + TILE_SIZE / 2,
    };
  }
}
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] Placeholder asset files exist in `public/game/`
- [ ] Tilemap JSON is valid: `node -e "JSON.parse(require('fs').readFileSync('public/game/maps/test-room.json'))"` (run from edu-platform dir)

#### Manual Verification:

- [ ] PreloaderScene shows "10x EXPLORERS" title and progress bar
- [ ] GameScene loads and renders the test room tilemap (dark floor with lighter walls around edges)
- [ ] Camera is positioned, zoom level is appropriate
- [ ] Console shows `[GameScene] Entering map: test-room` and zone logs
- [ ] No asset loading errors in console

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Player Controller

### Overview

Implement the `Astronaut` entity with WSAD movement, facing direction, and physics collision with walls. Add the `StateMachine` utility for entity state management and `InputController` for centralized key binding. After this phase, a placeholder astronaut sprite moves around the test room and collides with walls.

### Changes Required:

#### 1. StateMachine

**File**: `src/explorers/systems/StateMachine.ts`
**Changes**: New file — generic FSM for entity states

```typescript
export class StateMachine<TState extends string> {
  private currentState: TState;
  private validTransitions: Map<TState, Set<TState>>;
  private onEnterHandlers: Map<TState, () => void> = new Map();
  private onExitHandlers: Map<TState, () => void> = new Map();

  constructor(
    initialState: TState,
    transitions: Record<TState, TState[]>,
  ) {
    this.currentState = initialState;
    this.validTransitions = new Map();
    for (const [from, toList] of Object.entries(transitions) as [TState, TState[]][]) {
      this.validTransitions.set(from, new Set(toList));
    }
  }

  get state(): TState {
    return this.currentState;
  }

  canTransition(to: TState): boolean {
    return this.validTransitions.get(this.currentState)?.has(to) ?? false;
  }

  transition(to: TState): boolean {
    if (!this.canTransition(to)) return false;
    this.onExitHandlers.get(this.currentState)?.();
    this.currentState = to;
    this.onEnterHandlers.get(to)?.();
    return true;
  }

  onEnter(state: TState, handler: () => void): void {
    this.onEnterHandlers.set(state, handler);
  }

  onExit(state: TState, handler: () => void): void {
    this.onExitHandlers.set(state, handler);
  }

  isState(...states: TState[]): boolean {
    return states.includes(this.currentState);
  }
}
```

#### 2. InputController

**File**: `src/explorers/systems/InputController.ts`
**Changes**: New file — centralized key bindings

```typescript
import Phaser from 'phaser';

export interface GameKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  W: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  interact: Phaser.Input.Keyboard.Key;
  advance: Phaser.Input.Keyboard.Key;
  escape: Phaser.Input.Keyboard.Key;
}

export class InputController {
  private keys: GameKeys;
  private enabled = true;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    this.keys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      advance: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      escape: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
    };
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isUp(): boolean {
    return this.enabled && (this.keys.up.isDown || this.keys.W.isDown);
  }

  isDown(): boolean {
    return this.enabled && (this.keys.down.isDown || this.keys.S.isDown);
  }

  isLeft(): boolean {
    return this.enabled && (this.keys.left.isDown || this.keys.A.isDown);
  }

  isRight(): boolean {
    return this.enabled && (this.keys.right.isDown || this.keys.D.isDown);
  }

  isInteractJustPressed(): boolean {
    return this.enabled && Phaser.Input.Keyboard.JustDown(this.keys.interact);
  }

  isAdvanceJustPressed(): boolean {
    return this.enabled && Phaser.Input.Keyboard.JustDown(this.keys.advance);
  }

  isEscapeJustPressed(): boolean {
    return this.enabled && Phaser.Input.Keyboard.JustDown(this.keys.escape);
  }

  getKeys(): GameKeys {
    return this.keys;
  }
}
```

#### 3. Astronaut Entity

**File**: `src/explorers/entities/Astronaut.ts`
**Changes**: New file — player sprite with movement and state machine

```typescript
import Phaser from 'phaser';
import { StateMachine } from '../systems/StateMachine';
import { InputController } from '../systems/InputController';
import { PLAYER_SPEED, DEPTH, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT } from '../config/constants';
import type { FacingDirection } from '../state/types';

export type AstronautState = 'idle' | 'walking' | 'interacting' | 'dialogue' | 'cutscene';

export class Astronaut extends Phaser.Physics.Arcade.Sprite {
  private stateMachine: StateMachine<AstronautState>;
  private inputController: InputController;
  private _facingDirection: FacingDirection = 'down';

  constructor(scene: Phaser.Scene, x: number, y: number, inputController: InputController) {
    super(scene, x, y, 'placeholder-astronaut', 0);

    this.inputController = inputController;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics body — feet hitbox (bottom 16px of 32x48 sprite)
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER_FRAME_WIDTH, 16);
    body.setOffset(0, PLAYER_FRAME_HEIGHT - 16);

    this.setDepth(DEPTH.PLAYER);

    // State machine
    this.stateMachine = new StateMachine<AstronautState>('idle', {
      idle: ['walking', 'interacting', 'dialogue', 'cutscene'],
      walking: ['idle', 'interacting', 'dialogue', 'cutscene'],
      interacting: ['idle'],
      dialogue: ['idle'],
      cutscene: ['idle'],
    });
  }

  get facingDirection(): FacingDirection {
    return this._facingDirection;
  }

  get fsm(): StateMachine<AstronautState> {
    return this.stateMachine;
  }

  update(): void {
    if (!this.stateMachine.isState('idle', 'walking')) {
      // Cannot move while interacting, in dialogue, or cutscene
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      return;
    }

    this.handleMovement();
  }

  private handleMovement(): void {
    let vx = 0;
    let vy = 0;

    if (this.inputController.isLeft()) vx -= 1;
    if (this.inputController.isRight()) vx += 1;
    if (this.inputController.isUp()) vy -= 1;
    if (this.inputController.isDown()) vy += 1;

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      const factor = Math.SQRT1_2; // 1/sqrt(2)
      vx *= factor;
      vy *= factor;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);

    // Update facing direction and animation frame
    if (vx !== 0 || vy !== 0) {
      this.stateMachine.transition('walking');
      // Determine dominant direction for facing
      if (Math.abs(vy) >= Math.abs(vx)) {
        this._facingDirection = vy < 0 ? 'up' : 'down';
      } else {
        this._facingDirection = vx < 0 ? 'left' : 'right';
      }
      this.updateFrame();
    } else {
      this.stateMachine.transition('idle');
      this.updateFrame();
    }
  }

  private updateFrame(): void {
    // Placeholder: frame 0=down, 1=left, 2=right, 3=up
    const frameMap: Record<FacingDirection, number> = {
      down: 0,
      left: 1,
      right: 2,
      up: 3,
    };
    this.setFrame(frameMap[this._facingDirection]);
  }
}
```

#### 4. Update GameScene

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Add player spawning, physics collision, camera follow, and update loop

Add to GameScene class:
- New private fields: `player`, `inputController`
- In `create()`: instantiate `InputController`, create `Astronaut` at spawn position, add wall collider, set up camera follow
- New `update()` method: calls `player.update()`

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] StateMachine unit test passes (add `src/explorers/systems/StateMachine.test.ts` — test state transitions, invalid transitions)

#### Manual Verification:

- [ ] Teal rectangle (astronaut) appears at spawn point in the test room
- [ ] WSAD keys move the astronaut smoothly in all 4 directions + diagonals
- [ ] Astronaut collides with wall tiles (cannot walk through perimeter)
- [ ] Camera follows player with smooth lerp
- [ ] Physics debug outlines visible in dev mode (if `import.meta.env.DEV` is true)
- [ ] Different frames show for different facing directions (visible on placeholder sprite)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: NPCs & Interaction System

### Overview

Add `NPC` and `InteractiveObject` entities, the `InteractionDetector` system for proximity-based interaction, and the `InteractionPrompt` UI. After this phase, walking near placed objects shows a "[E] Interakcja" prompt, and pressing E fires an interaction event.

### Changes Required:

#### 1. NPC Entity

**File**: `src/explorers/entities/NPC.ts`
**Changes**: New file — static NPC sprite with interaction zone

```typescript
import Phaser from 'phaser';
import { DEPTH, INTERACTION_RADIUS } from '../config/constants';

export interface NPCConfig {
  id: string;
  name: string;
  spriteKey: string;
  dialogueId: string;
  questId?: string;
  requiredFlag?: string;
  requiredQuest?: string;
}

export class NPC extends Phaser.Physics.Arcade.Sprite {
  readonly npcId: string;
  readonly npcName: string;
  readonly dialogueId: string;
  readonly questId?: string;
  readonly requiredFlag?: string;
  readonly requiredQuest?: string;
  readonly interactionRadius: number = INTERACTION_RADIUS;

  constructor(scene: Phaser.Scene, x: number, y: number, config: NPCConfig) {
    // Use placeholder — warm amber colored rectangle
    super(scene, x, y, config.spriteKey);

    this.npcId = config.id;
    this.npcName = config.name;
    this.dialogueId = config.dialogueId;
    this.questId = config.questId;
    this.requiredFlag = config.requiredFlag;
    this.requiredQuest = config.requiredQuest;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.setDepth(DEPTH.PLAYER - 1);
  }
}
```

#### 2. InteractiveObject Entity

**File**: `src/explorers/entities/InteractiveObject.ts`
**Changes**: New file — generic interactable object (doors, terminals, items, triggers)

```typescript
import Phaser from 'phaser';
import { DEPTH, INTERACTION_RADIUS } from '../config/constants';

export type InteractableType = 'door' | 'terminal' | 'item' | 'trigger';

export interface InteractiveObjectConfig {
  id: string;
  type: InteractableType;
  properties: Record<string, unknown>;
}

export class InteractiveObject extends Phaser.Physics.Arcade.Sprite {
  readonly objectId: string;
  readonly objectType: InteractableType;
  readonly properties: Record<string, unknown>;
  readonly interactionRadius: number = INTERACTION_RADIUS;

  constructor(scene: Phaser.Scene, x: number, y: number, config: InteractiveObjectConfig) {
    // Use a placeholder texture generated at runtime
    super(scene, x, y, '__DEFAULT');

    this.objectId = config.id;
    this.objectType = config.type;
    this.properties = config.properties;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    this.setDepth(DEPTH.OBJECTS);
    this.setVisible(false); // Invisible trigger zones by default
  }
}
```

#### 3. InteractionDetector

**File**: `src/explorers/systems/InteractionDetector.ts`
**Changes**: New file — checks proximity between player and interactive entities

```typescript
import Phaser from 'phaser';
import { Astronaut } from '../entities/Astronaut';
import { NPC } from '../entities/NPC';
import { InteractiveObject } from '../entities/InteractiveObject';
import { INTERACTION_RADIUS, TILE_SIZE } from '../config/constants';
import type { FacingDirection } from '../state/types';

export interface InteractableEntity {
  x: number;
  y: number;
  interactionRadius: number;
}

export class InteractionDetector {
  private player: Astronaut;
  private interactables: (NPC | InteractiveObject)[] = [];
  private currentTarget: (NPC | InteractiveObject) | null = null;

  constructor(player: Astronaut) {
    this.player = player;
  }

  addInteractable(entity: NPC | InteractiveObject): void {
    this.interactables.push(entity);
  }

  removeInteractable(entity: NPC | InteractiveObject): void {
    this.interactables = this.interactables.filter(e => e !== entity);
  }

  update(): (NPC | InteractiveObject) | null {
    if (!this.player.fsm.isState('idle', 'walking')) {
      this.currentTarget = null;
      return null;
    }

    // Get the point in front of the player based on facing direction
    const checkPoint = this.getFacingPoint();

    let closest: (NPC | InteractiveObject) | null = null;
    let closestDist = Infinity;

    for (const entity of this.interactables) {
      if (!entity.active) continue;

      const dist = Phaser.Math.Distance.Between(
        checkPoint.x, checkPoint.y,
        entity.x, entity.y
      );

      if (dist < entity.interactionRadius && dist < closestDist) {
        closest = entity;
        closestDist = dist;
      }
    }

    this.currentTarget = closest;
    return closest;
  }

  getCurrentTarget(): (NPC | InteractiveObject) | null {
    return this.currentTarget;
  }

  private getFacingPoint(): { x: number; y: number } {
    const offset = TILE_SIZE;
    const dir = this.player.facingDirection;
    const offsets: Record<FacingDirection, { x: number; y: number }> = {
      down: { x: 0, y: offset },
      up: { x: 0, y: -offset },
      left: { x: -offset, y: 0 },
      right: { x: offset, y: 0 },
    };
    return {
      x: this.player.x + offsets[dir].x,
      y: this.player.y + offsets[dir].y,
    };
  }
}
```

#### 4. InteractionPrompt UI

**File**: `src/explorers/ui/InteractionPrompt.ts`
**Changes**: New file — "[E] Interakcja" text that appears above interactive objects

```typescript
import Phaser from 'phaser';
import { DEPTH, COLORS } from '../config/constants';

export class InteractionPrompt {
  private container: Phaser.GameObjects.Container;
  private text: Phaser.GameObjects.Text;
  private bg: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add.text(0, 0, '[E] Interakcja', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#00d4aa',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);

    this.bg = scene.add.rectangle(
      0, 0,
      this.text.width + 12, this.text.height + 6,
      0x000000, 0.7
    ).setOrigin(0.5);

    this.container = scene.add.container(0, 0, [this.bg, this.text]);
    this.container.setDepth(DEPTH.INTERACTION_PROMPT);
    this.container.setVisible(false);
  }

  show(x: number, y: number): void {
    this.container.setPosition(x, y - 40);
    this.container.setVisible(true);
  }

  hide(): void {
    this.container.setVisible(false);
  }

  destroy(): void {
    this.container.destroy();
  }
}
```

#### 5. Update GameScene

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Add NPC/object spawning from Zones layer, InteractionDetector, InteractionPrompt, and interaction handling

Extend `parseZones()` to create NPC and InteractiveObject entities from zone data. Add `InteractionDetector` and `InteractionPrompt`. In `update()`, check for nearby targets and handle E key press.

#### 6. Placeholder NPC Texture

Generate a placeholder NPC texture at runtime in `PreloaderScene` using `this.textures.createCanvas()` — a warm amber (COLORS.WARM_AMBER) 32x48 rectangle. No need for an external file.

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] NPCs (amber rectangles) visible in the test room at configured positions
- [ ] Walking near an NPC shows "[E] Interakcja" prompt above them
- [ ] Walking away hides the prompt
- [ ] Pressing E near an NPC fires interaction event (visible in console log)
- [ ] Prompt tracks the nearest interactable (not showing for distant ones)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 6: Dialogue System

### Overview

Build the full dialogue pipeline: `TypewriterEffect` for character-by-character text reveal, `DialogueBar` for the visual overlay, `DialogueManager` for queue management, and `DialogueScene` to orchestrate display. After this phase, interacting with an NPC triggers a multi-line dialogue with typewriter effect and Space to advance.

### Changes Required:

#### 1. TypewriterEffect

**File**: `src/explorers/ui/TypewriterEffect.ts`
**Changes**: New file — reveals text character by character

```typescript
import Phaser from 'phaser';
import { TYPEWRITER_CHARS_PER_SEC } from '../config/constants';

export class TypewriterEffect {
  private textObject: Phaser.GameObjects.Text;
  private fullText = '';
  private charIndex = 0;
  private timer: Phaser.Time.TimerEvent | null = null;
  private isComplete = false;
  private onCompleteCallback?: () => void;

  constructor(textObject: Phaser.GameObjects.Text) {
    this.textObject = textObject;
  }

  start(text: string, scene: Phaser.Scene, onComplete?: () => void): void {
    this.fullText = text;
    this.charIndex = 0;
    this.isComplete = false;
    this.onCompleteCallback = onComplete;
    this.textObject.setText('');

    const delay = 1000 / TYPEWRITER_CHARS_PER_SEC;
    this.timer = scene.time.addEvent({
      delay,
      callback: this.revealNextChar,
      callbackScope: this,
      loop: true,
    });
  }

  revealAll(): void {
    this.timer?.remove();
    this.timer = null;
    this.textObject.setText(this.fullText);
    this.charIndex = this.fullText.length;
    this.isComplete = true;
    this.onCompleteCallback?.();
  }

  getIsComplete(): boolean {
    return this.isComplete;
  }

  stop(): void {
    this.timer?.remove();
    this.timer = null;
  }

  private revealNextChar(): void {
    if (this.charIndex >= this.fullText.length) {
      this.timer?.remove();
      this.timer = null;
      this.isComplete = true;
      this.onCompleteCallback?.();
      return;
    }

    this.charIndex++;
    this.textObject.setText(this.fullText.substring(0, this.charIndex));
  }
}
```

#### 2. Dialogue Data Types

**File**: `src/explorers/systems/DialogueTypes.ts`
**Changes**: New file — dialogue data interfaces (matching architecture spec §10)

```typescript
export type DialogueMode = 'dialogue' | 'monologue' | 'system' | 'cinematic';

export interface DialogueLine {
  speaker: 'astronaut' | 'system' | string;
  text: string;
  portrait?: string;
  mode: DialogueMode;
  autoAdvance?: number;
}

export interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  giveItem?: string;
  setFlag?: string;
  clearFlag?: string;
  triggerEvent?: string;
  nextDialogue?: string;
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  onComplete?: DialogueEffect;
}
```

#### 3. DialogueBar UI

**File**: `src/explorers/ui/DialogueBar.ts`
**Changes**: New file — Phaser GameObjects for the dialogue overlay at bottom of viewport

```typescript
import Phaser from 'phaser';
import { DEPTH, COLORS } from '../config/constants';
import { TypewriterEffect } from './TypewriterEffect';
import type { DialogueLine, DialogueMode } from '../systems/DialogueTypes';

export class DialogueBar {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Rectangle;
  private speakerText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private advanceHint: Phaser.GameObjects.Text;
  private typewriter: TypewriterEffect;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const { width, height } = scene.scale;

    // Semi-transparent dark background (bottom 20% of canvas)
    const barHeight = Math.floor(height * 0.2);
    const barY = height - barHeight / 2;

    this.bg = scene.add.rectangle(
      width / 2, barY, width, barHeight, 0x000000, 0.85
    );

    // Speaker name
    this.speakerText = scene.add.text(
      24, height - barHeight + 12, '',
      { fontFamily: 'monospace', fontSize: '14px', color: '#00d4aa', fontStyle: 'bold' }
    );

    // Body text
    this.bodyText = scene.add.text(
      24, height - barHeight + 34, '',
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        wordWrap: { width: width - 48 },
        lineSpacing: 4,
      }
    );

    // Advance hint
    this.advanceHint = scene.add.text(
      width - 24, height - 16, '[Spacja] ▸',
      { fontFamily: 'monospace', fontSize: '12px', color: '#666666' }
    ).setOrigin(1, 1);

    this.container = scene.add.container(0, 0, [
      this.bg, this.speakerText, this.bodyText, this.advanceHint,
    ]);
    this.container.setDepth(DEPTH.DIALOGUE);
    this.container.setVisible(false);

    this.typewriter = new TypewriterEffect(this.bodyText);

    // Resize handler
    scene.scale.on('resize', () => this.handleResize());
  }

  showLine(line: DialogueLine, onRevealComplete: () => void): void {
    this.container.setVisible(true);

    // Apply mode styling
    this.applyModeStyle(line.mode);

    // Set speaker
    if (line.mode === 'monologue') {
      this.speakerText.setText('');
    } else if (line.speaker === 'system') {
      this.speakerText.setText('SYSTEM');
    } else if (line.speaker === 'astronaut') {
      this.speakerText.setText('ASTRONAUTA');
    } else {
      this.speakerText.setText(line.speaker.toUpperCase());
    }

    // Start typewriter
    this.advanceHint.setVisible(false);
    this.typewriter.start(line.text, this.scene, () => {
      this.advanceHint.setVisible(true);
      onRevealComplete();
    });
  }

  revealAll(): void {
    this.typewriter.revealAll();
  }

  isRevealing(): boolean {
    return !this.typewriter.getIsComplete();
  }

  hide(): void {
    this.typewriter.stop();
    this.container.setVisible(false);
  }

  destroy(): void {
    this.typewriter.stop();
    this.container.destroy();
  }

  private applyModeStyle(mode: DialogueMode): void {
    switch (mode) {
      case 'monologue':
        this.bodyText.setFontStyle('italic');
        this.bg.setAlpha(0.7);
        break;
      case 'system':
        this.bodyText.setFontStyle('normal');
        this.bodyText.setColor('#ffb347');
        this.bg.setAlpha(0.85);
        break;
      case 'cinematic':
        this.bodyText.setFontStyle('normal');
        this.bodyText.setColor('#ffffff');
        this.bg.setAlpha(0.95);
        break;
      default: // dialogue
        this.bodyText.setFontStyle('normal');
        this.bodyText.setColor('#ffffff');
        this.bg.setAlpha(0.85);
        break;
    }
  }

  private handleResize(): void {
    const { width, height } = this.scene.scale;
    const barHeight = Math.floor(height * 0.2);
    const barY = height - barHeight / 2;

    this.bg.setPosition(width / 2, barY);
    this.bg.setSize(width, barHeight);
    this.speakerText.setPosition(24, height - barHeight + 12);
    this.bodyText.setPosition(24, height - barHeight + 34);
    this.bodyText.setWordWrapWidth(width - 48);
    this.advanceHint.setPosition(width - 24, height - 16);
  }
}
```

#### 4. DialogueManager

**File**: `src/explorers/systems/DialogueManager.ts`
**Changes**: New file — manages dialogue queue and advancement

```typescript
import { GameEvents } from '../events/GameEvents';
import type { DialogueSequence, DialogueLine, DialogueEffect } from './DialogueTypes';

// Hardcoded test dialogues for placeholder testing
// In the full game, these come from JSON files in src/explorers/data/dialogues/
export const TEST_DIALOGUES: Record<string, DialogueSequence> = {
  'test-npc-greeting': {
    id: 'test-npc-greeting',
    lines: [
      {
        speaker: 'astronaut',
        text: '„Systemy offline. CORE nie odpowiada. Jak długo byłem nieprzytomny?"',
        mode: 'monologue',
      },
      {
        speaker: 'system',
        text: 'Wykryto sygnał z Ziemi. Łącze kwantowe aktywne.',
        mode: 'system',
        autoAdvance: 3000,
      },
      {
        speaker: 'astronaut',
        text: '„Nawigator? Ktoś jest po drugiej stronie... Nie wiem kim jesteś, ale potrzebuję twojej pomocy."',
        mode: 'dialogue',
      },
    ],
    onComplete: {
      setFlag: 'first-contact',
    },
  },
};

export class DialogueManager {
  private bus: Phaser.Events.EventEmitter;
  private currentSequence: DialogueSequence | null = null;
  private currentLineIndex = 0;

  constructor(bus: Phaser.Events.EventEmitter) {
    this.bus = bus;
  }

  startDialogue(dialogueId: string): DialogueSequence | null {
    const sequence = TEST_DIALOGUES[dialogueId];
    if (!sequence) {
      console.warn(`[DialogueManager] Dialogue not found: ${dialogueId}`);
      return null;
    }

    this.currentSequence = sequence;
    this.currentLineIndex = 0;
    return sequence;
  }

  getCurrentLine(): DialogueLine | null {
    if (!this.currentSequence) return null;
    return this.currentSequence.lines[this.currentLineIndex] ?? null;
  }

  advance(): DialogueLine | null {
    if (!this.currentSequence) return null;

    this.currentLineIndex++;
    if (this.currentLineIndex >= this.currentSequence.lines.length) {
      // Dialogue complete
      const effects = this.currentSequence.onComplete;
      this.currentSequence = null;
      this.currentLineIndex = 0;

      if (effects) {
        this.applyEffects(effects);
      }

      return null; // signals completion
    }

    return this.currentSequence.lines[this.currentLineIndex];
  }

  isActive(): boolean {
    return this.currentSequence !== null;
  }

  private applyEffects(effects: DialogueEffect): void {
    if (effects.setFlag) {
      console.log(`[DialogueManager] Setting flag: ${effects.setFlag}`);
      // In the full game: updateState to add flag
    }
    if (effects.activateQuest) {
      console.log(`[DialogueManager] Activating quest: ${effects.activateQuest}`);
      this.bus.emit(GameEvents.QUEST_ACTIVATED, { questId: effects.activateQuest });
    }
    if (effects.nextDialogue) {
      // Chain to next dialogue
      this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId: effects.nextDialogue });
    }
  }
}
```

#### 5. DialogueScene

**File**: `src/explorers/scenes/DialogueScene.ts`
**Changes**: New file — overlay scene that manages the dialogue bar display

```typescript
import { BaseScene } from './BaseScene';
import { SceneKey } from '../config/sceneRegistry';
import { GameEvents } from '../events/GameEvents';
import { DialogueBar } from '../ui/DialogueBar';
import { DialogueManager } from '../systems/DialogueManager';
import type { DialogueShowPayload } from '../events/GameEvents';
import type { DialogueLine } from '../systems/DialogueTypes';

export class DialogueScene extends BaseScene {
  private dialogueBar!: DialogueBar;
  private dialogueManager!: DialogueManager;
  private lineRevealed = false;

  constructor() {
    super({ key: SceneKey.DIALOGUE });
  }

  create(): void {
    this.dialogueBar = new DialogueBar(this);
    this.dialogueManager = new DialogueManager(this.bus);

    // Listen for dialogue requests
    this.bus.on(GameEvents.DIALOGUE_SHOW, this.onShowDialogue, this);

    // Input for advancing dialogue
    this.input.keyboard!.on('keydown-SPACE', this.onAdvanceInput, this);
    this.input.keyboard!.on('keydown-ENTER', this.onAdvanceInput, this);
    this.input.keyboard!.on('keydown-ESC', this.onDismiss, this);

    // Cleanup
    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.DIALOGUE_SHOW, this.onShowDialogue, this);
    });

    // Start sleeping — woken by DIALOGUE_SHOW event
    this.scene.sleep();
  }

  private onShowDialogue(payload: DialogueShowPayload): void {
    this.scene.wake();

    const sequence = this.dialogueManager.startDialogue(payload.dialogueId);
    if (!sequence) {
      this.scene.sleep();
      return;
    }

    const firstLine = this.dialogueManager.getCurrentLine();
    if (firstLine) {
      this.showLine(firstLine);
    }
  }

  private showLine(line: DialogueLine): void {
    this.lineRevealed = false;
    this.dialogueBar.showLine(line, () => {
      this.lineRevealed = true;

      // Auto-advance for system messages
      if (line.autoAdvance) {
        this.time.delayedCall(line.autoAdvance, () => {
          if (this.dialogueManager.isActive()) {
            this.advanceDialogue();
          }
        });
      }
    });
  }

  private onAdvanceInput(): void {
    if (!this.dialogueManager.isActive()) return;

    if (this.dialogueBar.isRevealing()) {
      // Still typing — reveal all
      this.dialogueBar.revealAll();
    } else if (this.lineRevealed) {
      // Line fully shown — advance
      this.advanceDialogue();
    }
  }

  private advanceDialogue(): void {
    const nextLine = this.dialogueManager.advance();
    if (nextLine) {
      this.showLine(nextLine);
    } else {
      // Dialogue complete
      this.dialogueBar.hide();
      this.bus.emit(GameEvents.DIALOGUE_DISMISSED);
      this.scene.sleep();
    }
  }

  private onDismiss(): void {
    if (!this.dialogueManager.isActive()) return;

    // Skip to end
    this.dialogueBar.hide();
    // Advance through all remaining lines to trigger onComplete effects
    while (this.dialogueManager.advance() !== null) {
      // fast-forward
    }
    this.bus.emit(GameEvents.DIALOGUE_DISMISSED);
    this.scene.sleep();
  }
}
```

#### 6. Wire Dialogue into GameScene

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: When player interacts with NPC, emit `DIALOGUE_SHOW` event, set player to `dialogue` state, and listen for `DIALOGUE_DISMISSED` to restore player to `idle`.

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Press E near NPC → dialogue bar appears at bottom with typewriter effect
- [ ] Text appears character by character at readable speed
- [ ] Pressing Space during reveal shows full line instantly
- [ ] Pressing Space when line is complete advances to next line
- [ ] Astronaut movement is blocked during dialogue
- [ ] After last line, dialogue bar hides and movement resumes
- [ ] Esc skips entire dialogue sequence
- [ ] System message (amber text) auto-advances after ~3 seconds
- [ ] Multiple dialogue lines work in sequence (3-line test dialogue)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 7: HUD Scene

### Overview

Add the parallel `HudScene` that displays player status at the top of the canvas: level, rank, XP bar, current location name, and quest count. The HUD listens for state changes via the event bus and updates accordingly.

### Changes Required:

#### 1. HudBar UI

**File**: `src/explorers/ui/HudBar.ts`
**Changes**: New file — Phaser GameObjects for the top HUD bar

```typescript
import Phaser from 'phaser';
import { COLORS } from '../config/constants';

export interface HudData {
  level: number;
  rank: string;
  xp: number;
  xpToNext: number;
  location: string;
  activeQuests: number;
  totalQuests: number;
}

export class HudBar {
  private scene: Phaser.Scene;
  private bg: Phaser.GameObjects.Rectangle;
  private leftText: Phaser.GameObjects.Text;
  private centerText: Phaser.GameObjects.Text;
  private rightText: Phaser.GameObjects.Text;
  private xpBarBg: Phaser.GameObjects.Rectangle;
  private xpBarFill: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const { width } = scene.scale;
    const barHeight = 36;

    // Background
    this.bg = scene.add.rectangle(width / 2, barHeight / 2, width, barHeight, 0x000000, 0.7);

    // Left: Level + Rank
    this.leftText = scene.add.text(12, 6, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#00d4aa',
    });

    // XP bar (small, next to level text)
    this.xpBarBg = scene.add.rectangle(160, 14, 80, 8, 0x333333).setOrigin(0, 0.5);
    this.xpBarFill = scene.add.rectangle(160, 14, 0, 8, COLORS.TEAL).setOrigin(0, 0.5);

    // Center: Location
    this.centerText = scene.add.text(width / 2, 6, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffffff',
    }).setOrigin(0.5, 0);

    // Right: Quest count
    this.rightText = scene.add.text(width - 12, 6, '', {
      fontFamily: 'monospace', fontSize: '13px', color: '#ffb347',
    }).setOrigin(1, 0);

    // Resize handler
    scene.scale.on('resize', () => this.handleResize());
  }

  updateDisplay(data: HudData): void {
    this.leftText.setText(`Lv.${data.level} ${data.rank}`);
    this.centerText.setText(data.location);
    this.rightText.setText(`Q ${data.activeQuests}/${data.totalQuests}`);

    // XP bar fill
    const ratio = data.xpToNext > 0 ? data.xp / data.xpToNext : 0;
    this.xpBarFill.width = 80 * Math.min(ratio, 1);
  }

  private handleResize(): void {
    const { width } = this.scene.scale;
    this.bg.setPosition(width / 2, 18);
    this.bg.width = width;
    this.centerText.setPosition(width / 2, 6);
    this.rightText.setPosition(width - 12, 6);
  }
}
```

#### 2. HudScene

**File**: `src/explorers/scenes/HudScene.ts`
**Changes**: New file — parallel scene that displays the HUD and listens for state/event changes

```typescript
import { BaseScene } from './BaseScene';
import { SceneKey } from '../config/sceneRegistry';
import { GameEvents } from '../events/GameEvents';
import { HudBar } from '../ui/HudBar';
import type { GameState } from '../state/types';

// Map key to Polish display name
const MAP_NAMES: Record<string, string> = {
  'ship-hibernation': 'Statek — Hibernacja',
  'ship-corridor': 'Statek — Korytarz',
  'ship-bridge': 'Statek — Mostek',
  'test-room': 'Pomieszczenie testowe',
};

export class HudScene extends BaseScene {
  private hudBar!: HudBar;

  constructor() {
    super({ key: SceneKey.HUD });
  }

  create(): void {
    // HUD camera does not scroll
    this.cameras.main.setScroll(0, 0);

    this.hudBar = new HudBar(this);

    // Listen for state changes
    this.bus.on(GameEvents.STATE_CHANGED, this.onStateChanged, this);
    this.bus.on(GameEvents.SCENE_ENTERED, this.onSceneEntered, this);

    // Initial display
    this.refreshDisplay();

    // Cleanup
    this.events.on('shutdown', () => {
      this.bus.off(GameEvents.STATE_CHANGED, this.onStateChanged, this);
      this.bus.off(GameEvents.SCENE_ENTERED, this.onSceneEntered, this);
    });
  }

  private onStateChanged(_state: GameState): void {
    this.refreshDisplay();
  }

  private onSceneEntered(_payload: { mapKey: string }): void {
    this.refreshDisplay();
  }

  private refreshDisplay(): void {
    const state = this.gameState;
    // XP to next level: 100 * N * (N + 1) / 2
    const currentLevelXp = 100 * state.player.level * (state.player.level + 1) / 2;
    const prevLevelXp = state.player.level > 1
      ? 100 * (state.player.level - 1) * state.player.level / 2
      : 0;
    const xpInLevel = state.player.xp - prevLevelXp;
    const xpNeeded = currentLevelXp - prevLevelXp;

    this.hudBar.updateDisplay({
      level: state.player.level,
      rank: state.player.rank,
      xp: xpInLevel,
      xpToNext: xpNeeded,
      location: MAP_NAMES[state.currentMap] || state.currentMap,
      activeQuests: state.quests.active ? 1 : 0,
      totalQuests: state.quests.completed.length + (state.quests.active ? 1 : 0),
    });
  }
}
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] HUD bar visible at top of canvas with semi-transparent dark background
- [ ] Shows "Lv.1 Kadet" on the left
- [ ] Shows location name in the center (e.g., "Pomieszczenie testowe")
- [ ] Shows quest count on the right (e.g., "Q 0/0")
- [ ] XP bar visible (empty at level 1 with 0 XP)
- [ ] HUD does not scroll with the camera — stays fixed at top
- [ ] HUD renders above the game world but below dialogue

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- **StateMachine** (`src/explorers/systems/StateMachine.test.ts`):
  - Valid transitions succeed and update state
  - Invalid transitions return false and don't change state
  - `onEnter` and `onExit` callbacks fire correctly
  - `isState()` checks work for single and multiple states

- **TypewriterEffect** — difficult to unit test (Phaser-dependent), verify manually

- **DialogueManager** (`src/explorers/systems/DialogueManager.test.ts`):
  - `startDialogue()` loads sequence correctly
  - `getCurrentLine()` returns first line
  - `advance()` progresses through lines
  - `advance()` returns null when sequence complete
  - `isActive()` reflects current state
  - Effects fire on completion

### Integration Tests:

- N/A for this phase — no backend/API to test

### Manual Testing Steps:

1. Navigate to `/explorers` — full-viewport canvas renders
2. Verify boot sequence: `BootScene` → `PreloaderScene` (progress bar) → `GameScene` + `HudScene`
3. Astronaut spawns on tilemap, moves with WSAD, collides with walls
4. Walk to NPC → "[E] Interakcja" appears → press E → dialogue plays
5. Advance through dialogue with Space → dialogue dismisses → movement resumes
6. HUD shows correct level, location, quest count throughout
7. Resize browser window — canvas and HUD adapt correctly
8. No console errors or memory leak warnings

## Performance Considerations

- **Minimal concern at this phase.** All assets are placeholders (<10 KB total). Scene count is small. No pooling or optimization needed.
- **Future consideration:** When real assets are added, monitor the `PreloaderScene` load time and total asset weight per map against the <1 MB budget.

## References

- Architecture spec: `.ai/10x-devs/game/architecture-spec.md` — canonical source for all technical decisions
- Business spec: `.ai/10x-devs/game/10x-explorers-spec.md` — product vision, UI layout, game structure
- Storyline: `.ai/10x-devs/game/storyline.md` — narrative beats, demo milestone scene graph
- Sprites theme: `.ai/10x-devs/game/sprites-theme.md` — color palette, art style, generation prompts
- Bootstrap plan: `thoughts/shared/plans/2026-02-18-phaser-explorers-integration.md` — initial Phaser setup (already executed)
