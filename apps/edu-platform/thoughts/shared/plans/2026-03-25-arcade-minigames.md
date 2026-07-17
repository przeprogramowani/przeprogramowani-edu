# Arcade Mini-Games System — Implementation Plan

## Overview

Add an arcade mini-game system to 10x Explorers with three games: **Asteroid Shooting Range**, **Memory Matrix**, and **Oscilloscope Calibration**. Games are defined declaratively in level manifests (like exams/quests), placed as `arcade` zone objects in Tiled maps, and run as overlay Phaser scenes. Each play grants XP based on score and difficulty.

## Current State Analysis

The game already has a well-established pattern for overlay content:

- **ExamScene** (`src/explorers/scenes/ExamScene.ts`): Overlay scene launched from GameScene, uses sleep/wake pattern, dark overlay + panel UI, keyboard+pointer input, ESC to dismiss, emits events on completion.
- **Zone types** (`src/explorers/entities/InteractiveObject.ts:17`): Currently supports `trigger | door | terminal | exam`. We add `arcade`.
- **Level manifests** (`src/explorers/levels/types.ts`): Declarative config for dialogues, quests, exams per level. We add `arcadeGames` field.
- **Scene registration** (`src/explorers/scenes/BootScene.ts:59-64`): Scenes added dynamically in `BootScene.create()`.
- **Event bus** (`src/explorers/events/GameEvents.ts`): Central event system for scene communication.
- **DEPTH constants** (`src/explorers/config/constants.ts:34-45`): EXAM is 90 — arcade should use the same depth layer.

### Key Discoveries:

- ExamScene pattern at `scenes/ExamScene.ts:43-69`: sleep on create, wake on event, dismiss back to sleep. Arcade scenes follow this exactly.
- GameScene zone parsing at `scenes/GameScene.ts:125-153`: parses `type` from Tiled objects. Adding `arcade` type requires handling in `handleInteraction()`.
- InteractiveObject type union at `entities/InteractiveObject.ts:17`: needs `'arcade'` added.
- Game state at `state/types.ts`: no changes to GameState schema needed — XP is granted via existing `updateState` + `XP_GAINED` event.
- Level loader at `levels/levelLoader.ts`: builds flat registries from manifests. Needs new `allArcadeGames` registry.

## Desired End State

After implementation:

1. Level manifests can declare `arcadeGames` with game definitions (type, difficulty, XP config, Polish title/description)
2. Tiled maps can have `arcade` zone objects with `arcadeGameId` property pointing to a manifest-defined game
3. Player walks up to an arcade zone, sees `[E] Graj` prompt, presses E → game overlay launches
4. Three game types work: `asteroid-range`, `memory-matrix`, `oscilloscope`
5. Each play grants XP proportional to score × difficulty multiplier
6. Games are fully keyboard-controlled, render as overlay scenes, ESC to quit

### Verification:

- Place an arcade zone on the `m0-core-ai` map pointing to each game type
- Play each game at different difficulty levels
- Confirm XP is granted after each play
- Confirm ESC dismisses cleanly and returns control to GameScene

## What We're NOT Doing

- No persistent high score tracking in GameState (can add later)
- No sound effects or audio (game has no audio system yet)
- No particle systems (explosions are sprite-based tweens)
- No new Tiled map / recreation room (games are placed on existing maps)
- No unlock gating (arcade zones are always playable — gating can be added via existing `requiredFlags`)
- No leaderboard or multiplayer features

## Implementation Approach

Follow the exact same architectural pattern as the exam system:

1. **Types & Config** — Define `ArcadeGameDefinition` type, add to `LevelManifest`, register in level loader
2. **Scene infrastructure** — Create `ArcadeScene` (single overlay scene that delegates to game-specific renderers)
3. **Game renderers** — Three self-contained game implementations (asteroid, memory, oscilloscope)
4. **Integration** — Wire into GameScene zone handling, events, scene registry, BootScene

Each game renderer is a class that receives the Phaser scene and manages its own game objects, input, and lifecycle. The `ArcadeScene` owns the overlay/chrome (score HUD, timer, dark background, dismiss logic) and delegates gameplay to the renderer.

## Critical Implementation Details

### Scene Lifecycle

- **ArcadeScene** follows ExamScene's sleep/wake pattern: created once in BootScene, sleeps immediately, wakes on `ARCADE_SHOW` event
- On wake: reads game definition from registry, instantiates the correct renderer, starts game loop
- On dismiss (ESC or game over): destroys renderer game objects, emits `ARCADE_DISMISSED` + `XP_GAINED`, sleeps
- GameScene freezes player/NPCs and disables input on `ARCADE_SHOW`, restores on `ARCADE_DISMISSED` (same as exam flow)

### Input Isolation

- Each game renderer registers its own keyboard handlers on wake
- All handlers are cleaned up on dismiss (same pattern as ExamScene's `numKeyHandler`)
- GameScene's `InputController` is disabled while arcade is active (existing pattern via `setEnabled(false)`)

### Rendering Approach

- All three games use Phaser's built-in primitives: `this.add.rectangle()`, `this.add.circle()`, `this.add.text()`, `this.add.graphics()` (for waveforms)
- No external sprite assets needed — everything is procedurally drawn
- Depth: all arcade game objects use `DEPTH.ARCADE` (new constant, same value as `DEPTH.EXAM = 90`)
- ScrollFactor 0 on everything (fixed to camera, like ExamScene)

### XP Calculation

```
xpReward = baseXp + floor(score × difficultyMultiplier)
```

Where `baseXp` and `difficultyMultiplier` are defined per game in the manifest. This is calculated in `ArcadeScene` after the renderer reports final score, then emitted via existing `XP_GAINED` event pipeline.

---

## Phase 1: Types, Config & Infrastructure

### Overview

Establish the arcade game type system, extend level manifests, create the `ArcadeScene` shell, and wire it into the existing scene/event/interaction pipeline.

### Changes Required:

#### 1. Arcade Game Types

**File**: `src/explorers/systems/ArcadeTypes.ts` (new)

```typescript
export type ArcadeGameType = 'asteroid-range' | 'memory-matrix' | 'oscilloscope';

export interface ArcadeGameDefinition {
  /** Unique game ID (globally unique across all levels, like exam IDs) */
  id: string;
  /** Game type — determines which renderer to use */
  type: ArcadeGameType;
  /** Polish title shown in the game overlay header */
  title: string;
  /** Polish description shown before starting */
  description: string;
  /** Difficulty level 1-5 — affects game parameters */
  difficulty: number;
  /** Base XP granted on completion (before score multiplier) */
  baseXp: number;
  /** XP multiplier applied to the player's score */
  scoreMultiplier: number;
  /** Game duration in seconds (for timed games) */
  durationSeconds: number;
}

/** Result reported by a game renderer when the game ends */
export interface ArcadeGameResult {
  score: number;
  maxScore?: number;
  completed: boolean;
}

/** Interface that all game renderers must implement */
export interface ArcadeGameRenderer {
  /** Set up game objects and input handlers */
  create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void;
  /** Called every frame during gameplay */
  update(time: number, delta: number): void;
  /** Clean up all game objects and input handlers */
  destroy(): void;
  /** Called when game timer expires or player finishes */
  onComplete?: () => ArcadeGameResult;
  /** Whether the game has ended (renderer signals completion) */
  isFinished(): boolean;
  /** Get current score (for live HUD updates) */
  getScore(): number;
  /** Get result when finished */
  getResult(): ArcadeGameResult;
}
```

#### 2. Extend LevelManifest

**File**: `src/explorers/levels/types.ts`

Add to the `LevelManifest` interface:

```typescript
/** Arcade game definitions for this level (optional) */
arcadeGames?: ArcadeGameDefinition[];
```

Import the type:

```typescript
import type { ArcadeGameDefinition } from '../systems/ArcadeTypes';
```

#### 3. Extend Level Loader & Serialized Type

**File**: `src/explorers/levels/levelLoader.ts`

Add a new `allArcadeGames` registry (Map<string, ArcadeGameDefinition>) built from manifests, same pattern as `allExams`. Add a `getAllArcadeGames()` and `getArcadeGame(id)` export.

Also update the `GameManifestLevel` interface (lines 9-22) to include:
```typescript
arcadeGames: ArcadeGameDefinition[];
```

In the `/api/game` endpoint serialization (`src/pages/api/game.ts`), include `arcadeGames` field from each manifest:
```typescript
arcadeGames: manifest.arcadeGames ?? [],
```

#### 4. Extend InteractiveObject Type

**File**: `src/explorers/entities/InteractiveObject.ts`

Add `'arcade'` to the type union in two places:
- `InteractiveObjectConfig` interface `objectType` field (line 11)
- `InteractiveObject` class `objectType` field (line 17-18)

Change both from:
```typescript
objectType: 'trigger' | 'door' | 'terminal' | 'exam';
```
To:
```typescript
objectType: 'trigger' | 'door' | 'terminal' | 'exam' | 'arcade';
```

#### 5. Add Arcade Events

**File**: `src/explorers/events/GameEvents.ts`

Add:
```typescript
// Arcade
ARCADE_SHOW: 'arcade:show',
ARCADE_COMPLETED: 'arcade:completed',
ARCADE_DISMISSED: 'arcade:dismissed',
```

Add payload interfaces:
```typescript
export interface ArcadeShowPayload {
  arcadeGameId: string;
}

export interface ArcadeCompletedPayload {
  arcadeGameId: string;
  score: number;
  maxScore?: number;
  xpGained: number;
  timestamp: number; // Date.now() — enables future high-score tracking without changing the event contract
}
```

#### 6. Add DEPTH.ARCADE Constant

**File**: `src/explorers/config/constants.ts`

Add to DEPTH object:
```typescript
ARCADE: 90,  // same layer as EXAM — only one overlay active at a time
```

#### 7. Add Scene Key

**File**: `src/explorers/config/sceneRegistry.ts`

Add:
```typescript
ARCADE: 'ArcadeScene',
```

#### 8. Create ArcadeScene Shell

**File**: `src/explorers/scenes/ArcadeScene.ts` (new)

Follows ExamScene pattern with a simple state machine for clarity:

```typescript
type ArcadePhase = 'sleeping' | 'intro' | 'countdown' | 'playing' | 'results';
```

- Extends `BaseScene`
- `create()`: registers `ARCADE_SHOW` listener, sleeps immediately. Also registers `shutdown` handler to clean up the event listener (same as ExamScene lines 39-41).
- `showGame(arcadeGameId)`: wakes scene, sets phase to `'intro'`. Shows dark overlay + game title + description + "[Enter] Start" prompt. Instantiates correct renderer based on game type.
- On Enter during intro: transitions to `'countdown'` phase. Shows 3-2-1 countdown (1 second per number, centered large text) to give the player time to orient before gameplay starts.
- On countdown complete: transitions to `'playing'` phase. Shows header/footer chrome, starts timer, calls renderer `create()`.
- `update()`: delegates to renderer (only in `'playing'` phase), updates timer/score display, checks `isFinished()`
- `onGameEnd()`: sets phase to `'results'`. Shows result screen (score, XP earned), auto-dismiss after 3s or Enter/click
- `dismissGame()`: destroys renderer, clears all UI objects, emits `ARCADE_DISMISSED`, sets phase to `'sleeping'`, sleeps
- ESC key handler to quit early (no confirmation — keep it simple, just quit)

**Mutual exclusion guard**: Before showing, check that ExamScene is sleeping. If not (edge case), emit `ARCADE_DISMISSED` immediately and bail out:
```typescript
if (!this.scene.isSleeping(SceneKey.EXAM)) {
  this.bus.emit(GameEvents.ARCADE_DISMISSED);
  return;
}
```

**Timer handling**: When `durationSeconds > 0`, show a countdown timer in the header and auto-end the game on expiry. When `durationSeconds === 0` (round-based games like Memory Matrix), hide the timer display entirely and let the renderer signal completion via `isFinished()`.

Chrome layout (800×600 viewport):
```
┌──────────────────────────────────────────┐
│ ■ dark overlay (full screen, 0.85 alpha) │
│ ┌──────────────────────────────────────┐ │
│ │ TITLE          SCORE: 000  TIME: 60 │ │ ← header bar (40px) — TIME hidden if durationSeconds=0
│ ├──────────────────────────────────────┤ │
│ │                                      │ │
│ │          GAME AREA                   │ │ ← renderer bounds
│ │          (game-specific content)     │ │
│ │                                      │ │
│ ├──────────────────────────────────────┤ │
│ │ [ESC] Wyjdź          Poziom: ★★★☆☆ │ │ ← footer bar (30px)
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

#### 9. Register ArcadeScene in BootScene

**File**: `src/explorers/scenes/BootScene.ts`

Add import and registration:
```typescript
import { ArcadeScene } from './ArcadeScene';
// in create():
this.scene.add(SceneKey.ARCADE, ArcadeScene, false);
```

#### 10. Wire into GameScene

**File**: `src/explorers/scenes/GameScene.ts`

In `create()`:
- Launch ArcadeScene alongside other overlay scenes (~line 319):
  ```typescript
  if (!this.scene.isActive(SceneKey.ARCADE)) {
    this.scene.launch(SceneKey.ARCADE);
  }
  ```
- Add `ARCADE_DISMISSED` listener (same as exam dismissed, ~line 236):
  ```typescript
  const onArcadeDismissed = () => {
    this.player.enterState('idle');
    this.inputController.setEnabled(true);
    this.npcs.forEach((npc) => npc.unfreeze());
  };
  this.bus.on(GameEvents.ARCADE_DISMISSED, onArcadeDismissed);
  ```
- Clean up listener in existing `shutdown` handler (add alongside exam cleanup):
  ```typescript
  this.bus.off(GameEvents.ARCADE_DISMISSED, onArcadeDismissed);
  ```

In `update()` interaction prompt (~line 400):
```typescript
if (nearest.objectType === 'arcade') promptLabel = '[E] Graj';
```

In `handleInteraction()` (~line 414), add case:
```typescript
case 'arcade': {
  const ioObj = obj as InteractiveObject;
  const arcadeGameId = ioObj.properties['arcadeGameId'] as string;
  if (!arcadeGameId) break;
  this.inputController.setEnabled(false);
  this.player.enterState('cutscene');
  this.interactionPrompt.hide();
  this.npcs.forEach((npc) => npc.freeze());
  this.bus.emit(GameEvents.ARCADE_SHOW, { arcadeGameId });
  break;
}
```

In zone debug overlay colors (~line 158), add:
```typescript
if (zone.type === 'arcade') color = 0xe67e22; // orange for arcade
```

#### 11. Wire XP in ArcadeScene

XP granting happens inside `ArcadeScene.onGameEnd()` via `this.updateState()` and `this.bus.emit(GameEvents.XP_GAINED, ...)`. BaseScene already provides `updateState()`.

**Note**: This is simpler than ExamScene's approach, where XP is granted via `ExamManager` using a `setState` callback (ExamManager.ts:83-114). ArcadeScene doesn't need a separate manager — it calls `updateState` directly:

```typescript
// In ArcadeScene.onGameEnd():
const xpReward = definition.baseXp + Math.floor(result.score * definition.scoreMultiplier);
const newXp = this.gameState.xp + xpReward;
this.updateState(() => ({ xp: newXp }));
this.bus.emit(GameEvents.XP_GAINED, { amount: xpReward, total: newXp });
this.bus.emit(GameEvents.ARCADE_COMPLETED, { arcadeGameId, score: result.score, xpGained: xpReward });
```

No changes needed in PhaserGame.svelte — the existing `XP_GAINED` listener handles HUD updates and rank-up detection.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npm run build`
- [x] Existing tests still pass: `npm run test`
- [ ] ArcadeScene is registered and sleeps on boot (visible in Phaser scene list)

#### Manual Verification:

- [ ] Place a test arcade zone on a map, confirm `[E] Graj` prompt appears
- [ ] Pressing E shows the intro screen with game title, description, and "[Enter] Start" prompt
- [ ] Enter triggers 3-2-1 countdown, then gameplay starts
- [ ] Header/footer chrome renders correctly (score, timer if applicable, difficulty stars)
- [ ] ESC dismisses at any phase (intro, countdown, playing, results) and returns control to player
- [ ] No input leaks (player doesn't move while arcade is active)
- [ ] Cannot open arcade while exam is active (mutual exclusion guard)

**Implementation Note**: After completing this phase, pause for manual verification before proceeding.

---

## Phase 2: Asteroid Shooting Range

### Overview

Implement the first game renderer: a shooting gallery where asteroids fly right-to-left and the player aims a free crosshair with WSAD and shoots with SPACE.

### Changes Required:

#### 1. Asteroid Shooting Range Renderer

**File**: `src/explorers/arcade/AsteroidRangeRenderer.ts` (new)

Implements `ArcadeGameRenderer`.

**Gameplay mechanics:**
- Crosshair starts at center of game bounds
- WSAD moves crosshair (speed: ~400px/s, clamped to bounds)
- SPACE fires a "shot" — instant hit-scan from crosshair position
- Asteroids spawn from right edge at random Y positions, fly leftward
- Three asteroid sizes:
  - Large (radius 24px): slow (80-120px/s), 10 points
  - Medium (radius 16px): medium speed (140-200px/s), 25 points
  - Small (radius 10px): fast (220-300px/s), 50 points
- Asteroids spawn in waves (3-8 per wave, staggered timing) — "peloton" feel
- Hit detection: circle overlap between shot point and asteroid radius
- On hit: asteroid flashes white, scales down rapidly (tween), and is recycled to pool
- Score = sum of destroyed asteroid points ("mineraly zebrane")

**Object pooling (built-in from the start):**
- Pre-allocate asteroid pool of 30 objects on `create()`
- Each asteroid is a Phaser `Graphics` object with associated state (size, speed, points, active flag)
- On spawn: take from pool, set position/speed/size, mark active, setVisible(true)
- On hit or off-screen-left: mark inactive, setVisible(false), return to pool
- On `destroy()`: destroy all pool objects
- This avoids GC pressure from continuous create/destroy cycles during gameplay

**Difficulty scaling (1-5):**

| Parameter | Diff 1 | Diff 3 | Diff 5 |
|-----------|--------|--------|--------|
| Asteroid speed multiplier | 0.7× | 1.0× | 1.5× |
| Spawn interval (ms) | 1200 | 800 | 400 |
| Wave size | 2-4 | 3-6 | 5-8 |
| Duration (from manifest) | 60s | 60s | 60s |

**Rendering (all procedural, no sprites):**
- Crosshair: two thin white lines (horizontal + vertical, 20px each) + small circle center
- Asteroids: filled circles with slight radial gradient (dark brown/gray), irregular edge via `graphics.lineStyle` with slight offset
- Background: darker rectangle within game bounds (space-black `0x050510`)
- Hit effect: white flash circle expanding + fading (tween, 200ms)
- Score counter: updated in real-time via `getScore()`

**Input handling:**
- Register `keydown`/`keyup` for W/A/S/D on `create()`
- Track pressed state for smooth movement in `update()`
- Register `keydown-SPACE` for shooting with cooldown (200ms between shots)
- All handlers removed in `destroy()`

#### 2. Renderer Registry

**File**: `src/explorers/arcade/rendererRegistry.ts` (new)

```typescript
import type { ArcadeGameType, ArcadeGameRenderer } from '../systems/ArcadeTypes';
import { AsteroidRangeRenderer } from './AsteroidRangeRenderer';

const RENDERERS = new Map<ArcadeGameType, new () => ArcadeGameRenderer>([
  ['asteroid-range', AsteroidRangeRenderer],
  // ['memory-matrix', MemoryMatrixRenderer],    — added in Phase 3
  // ['oscilloscope', OscilloscopeRenderer],     — added in Phase 4
]);

export function createRenderer(type: ArcadeGameType): ArcadeGameRenderer {
  const Ctor = RENDERERS.get(type);
  if (!Ctor) throw new Error(`Unknown or unregistered arcade game type: ${type}`);
  return new Ctor();
}
```

Using a `Map` instead of `Record` avoids `null as any` for unimplemented renderers and keeps TypeScript safety. Entries are added as each phase is implemented.

#### 3. Test Manifest Entry

Add a test arcade game definition to an existing level manifest (e.g., `m0-core-ai`):

**File**: `src/explorers/levels/m0-core-ai/manifest.ts`

```typescript
arcadeGames: [
  {
    id: 'arcade-asteroid-test',
    type: 'asteroid-range',
    title: 'Strzelnica Asteroidów',
    description: 'Zniszcz jak najwięcej asteroid, aby wydobyć minerały!',
    difficulty: 2,
    baseXp: 5,
    scoreMultiplier: 0.1,
    durationSeconds: 60,
  },
],
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build`
- [x] Tests pass: `npm run test`

#### Manual Verification:

- [ ] Crosshair moves smoothly with WSAD
- [ ] Asteroids fly right-to-left in varied sizes and speeds
- [ ] SPACE destroys asteroids with visual feedback
- [ ] Score updates in real-time in header
- [ ] Timer counts down and game ends when time runs out
- [ ] Results screen shows score and XP earned
- [ ] XP is added to player state (visible in HUD XP bar)
- [ ] Game is replayable (walking away and back, pressing E again)

**Implementation Note**: Pause for manual verification before Phase 3.

---

## Phase 3: Memory Matrix

### Overview

Implement the second game renderer: a pattern memorization game framed as decoding deep-space signal reports.

### Changes Required:

#### 1. Memory Matrix Renderer

**File**: `src/explorers/arcade/MemoryMatrixRenderer.ts` (new)

Implements `ArcadeGameRenderer`.

**Gameplay mechanics:**
- Grid of tiles (size depends on difficulty)
- Game plays in rounds. Each round:
  1. **Show phase**: Random pattern of tiles lights up with "radio signal" effect (green glow, slight flicker). Display duration decreases per round.
  2. **Input phase**: Player navigates grid with arrow keys, toggles tiles with SPACE, confirms with Enter.
  3. **Feedback**: Correct tiles flash green, incorrect flash red. Score awarded for correct matches.
  4. **Next round**: Pattern grows by 1-2 tiles.
- Game ends after N rounds or first failed round (configurable).
- Score = total correctly matched tiles across all rounds.

**Difficulty scaling (1-5):**

| Parameter | Diff 1 | Diff 3 | Diff 5 |
|-----------|--------|--------|--------|
| Grid size | 3×3 | 4×4 | 5×5 |
| Starting pattern size | 2 tiles | 3 tiles | 4 tiles |
| Display time (round 1) | 3000ms | 2000ms | 1200ms |
| Display time decay/round | -200ms | -250ms | -300ms |
| Min display time | 800ms | 500ms | 300ms |
| Rounds to complete | 5 | 7 | 10 |
| Pattern growth/round | +1 | +1-2 | +2 |

**Visual design — CRT/radio signal aesthetic:**
- Game bounds background: very dark green-black (`0x0a1a0a`)
- Scanline effect: horizontal lines at 50% alpha drawn across background (every 3px)
- Grid tiles: dark cells (`0x112211`) with 1px border (`0x1a3a1a`)
- Active pattern (show phase): bright green (`0x00ff66`) with pulsing glow (alpha oscillation 0.7-1.0)
- Random "static noise": a few tiles briefly flash random dim colors during show phase (visual interference)
- Player cursor: teal border highlight on current cell, moves with arrow keys
- Selected tiles: medium green fill (`0x00aa44`)
- Correct feedback: bright green pulse
- Incorrect feedback: red pulse (`0xe74c3c`)
- Header text: `SYGNAŁ Z GŁĘBOKIEGO KOSMOSU — Runda X/Y`

**Input handling:**
- Arrow keys: move cursor (grid navigation, wraps at edges)
- SPACE: toggle current cell
- Enter: submit current selection
- All handlers registered on `create()`, removed on `destroy()`

#### 2. Update Renderer Registry

**File**: `src/explorers/arcade/rendererRegistry.ts`

Register `MemoryMatrixRenderer` for `'memory-matrix'` type.

#### 3. Test Manifest Entry

Add to an existing level:

```typescript
{
  id: 'arcade-memory-test',
  type: 'memory-matrix',
  title: 'Dekoder Sygnałów',
  description: 'Odczytaj i odtwórz sygnały z głębokiego kosmosu.',
  difficulty: 2,
  baseXp: 8,
  scoreMultiplier: 0.5,
  durationSeconds: 0, // not time-limited, round-based
},
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build`
- [x] Tests pass: `npm run test`

#### Manual Verification:

- [ ] Pattern displays with green glow + static noise effect
- [ ] Pattern disappears after display time
- [ ] Arrow keys navigate grid, SPACE toggles cells
- [ ] Enter submits, correct/incorrect feedback shows
- [ ] Rounds progress with growing pattern + shorter display time
- [ ] CRT scanline aesthetic is visible
- [ ] Game ends after all rounds, results screen shows score + XP
- [ ] Replayable

**Implementation Note**: Pause for manual verification before Phase 4.

---

## Phase 4: Oscilloscope Calibration

### Overview

Implement the third game renderer: a precision-matching game where the player adjusts waveform parameters to match a target signal.

### Changes Required:

#### 1. Oscilloscope Renderer

**File**: `src/explorers/arcade/OscilloscopeRenderer.ts` (new)

Implements `ArcadeGameRenderer`.

**Gameplay mechanics:**
- An oscilloscope screen displays a **target waveform** (bright green trace)
- Below/beside it, the **player's waveform** is drawn in real-time (teal/cyan trace)
- Player adjusts parameters using keyboard controls to match the target
- Parameters: amplitude, frequency, phase (and optionally: DC offset, secondary wave amplitude for higher difficulties)
- Match percentage shown live: `100 - mean_absolute_error_normalized`
- Player presses Enter when satisfied → final score is the match percentage
- Score = match% (0-100), XP scaled accordingly
- Timer runs down — if it expires, current match% is the final score

**Difficulty scaling (1-5):**

| Parameter | Diff 1 | Diff 3 | Diff 5 |
|-----------|--------|--------|--------|
| Adjustable params | 2 (amp, freq) | 3 (amp, freq, phase) | 4+ (amp, freq, phase, DC offset) |
| Target waveform | Simple sine | Sine + harmonic | Composite (2 sines + offset) |
| Parameter step size | Coarse (0.1) | Medium (0.05) | Fine (0.02) |
| Pass threshold | 70% | 80% | 90% |
| Duration | 90s | 75s | 60s |

**Visual design — oscilloscope aesthetic:**
- Game bounds background: very dark (`0x0a0a0a`)
- Grid lines: dim green (`0x1a3a1a`), 8×6 grid
- Axis labels: dim text showing scale
- Target waveform: bright green trace (`0x00ff66`), 2px line width, slight glow effect (draw twice: once at 4px/low alpha, once at 2px/full alpha)
- Player waveform: teal/cyan trace (`0x00d4aa`), 2px line width
- Parameter panel (right side or bottom):
  ```
  ▸ Amplituda:  ████████░░  0.75    [↑/↓]
    Częstotl.:  ██████░░░░  0.50    [↑/↓]
    Faza:       ████░░░░░░  0.35    [↑/↓]

    Dopasowanie: 73%
    [Tab] zmień parametr  [Enter] zatwierdź
  ```
- Active parameter highlighted with teal
- Match% changes color: red (<50%), yellow (50-80%), green (>80%)

**Waveform calculation:**
```typescript
function targetWave(x: number, params: WaveParams): number {
  let y = params.amplitude * Math.sin(2 * Math.PI * params.frequency * x + params.phase);
  if (params.dcOffset !== undefined) y += params.dcOffset;
  if (params.secondaryAmp !== undefined) {
    y += params.secondaryAmp * Math.sin(2 * Math.PI * params.frequency * 2 * x);
  }
  return y;
}

function calculateMatch(target: WaveParams, player: WaveParams, sampleCount = 200): number {
  let totalError = 0;
  let maxAmplitude = 0;
  for (let i = 0; i < sampleCount; i++) {
    const x = i / sampleCount;
    const tVal = targetWave(x, target);
    const pVal = targetWave(x, player);
    totalError += Math.abs(tVal - pVal);
    maxAmplitude = Math.max(maxAmplitude, Math.abs(tVal), Math.abs(pVal));
  }
  // Dynamic normalization — accounts for DC offset, secondary amplitude, etc.
  const maxPossibleError = sampleCount * Math.max(maxAmplitude * 2, 1);
  return Math.max(0, 100 * (1 - totalError / maxPossibleError));
}
```

**Rendering with Phaser Graphics API:**
- Use `this.add.graphics()` for waveform drawing
- Clear and redraw every frame in `update()` when parameters change
- Sample 200 points across the display width, connect with `lineTo()`
- Glow effect: draw the line twice (wider + transparent first, then sharp)

**Input handling:**
- Tab: cycle through parameters (wraps)
- Arrow Up/Down: adjust selected parameter value (by step size)
- Shift + Arrow: fine adjustment (step/5)
- Enter: submit final answer
- All handlers registered/removed via standard pattern

#### 2. Update Renderer Registry

Register `OscilloscopeRenderer` for `'oscilloscope'` type.

#### 3. Test Manifest Entry

```typescript
{
  id: 'arcade-oscilloscope-test',
  type: 'oscilloscope',
  title: 'Kalibracja Oscyloskopu',
  description: 'Dopasuj parametry fali do sygnału referencyjnego.',
  difficulty: 2,
  baseXp: 10,
  scoreMultiplier: 0.15,
  durationSeconds: 75,
},
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npm run build`
- [x] Tests pass: `npm run test`

#### Manual Verification:

- [ ] Target waveform renders as green trace on oscilloscope grid
- [ ] Player waveform updates in real-time as parameters change
- [ ] Tab cycles through parameters, Up/Down adjusts values
- [ ] Match percentage updates live and color changes with accuracy
- [ ] Enter submits, results screen shows match% + XP
- [ ] Timer counts down, auto-submits when expired
- [ ] Oscilloscope aesthetic looks clean (grid, glow, dark background)
- [ ] Replayable

**Implementation Note**: Pause for manual verification before Phase 5.

---

## Phase 5: Polish & Serialization

### Overview

Ensure the `/api/game` endpoint serializes arcade game definitions, the level loader deserializes them, and add a brief introductory dialogue when approaching an arcade terminal for the first time.

### Changes Required:

#### 1. API Serialization

**File**: `src/pages/api/game.ts`

Include `arcadeGames` from each manifest in the serialized response (same pattern as `exams`).

#### 2. Level Loader Deserialization

**File**: `src/explorers/levels/levelLoader.ts`

In `loadLevelsFromData()`:
- Build `allArcadeGames` Map from deserialized manifest data
- Export `getArcadeGame(id)` and `getAllArcadeGames()`

#### 3. Interaction Prompt for Arcade Type

**File**: `src/explorers/systems/InteractionDetector.ts`

Ensure `arcade` type objects are included in proximity detection (they should already work since `InteractiveObject` is generic, but verify the `objectType` filter logic).

#### 4. Remove Test Entries / Finalize Manifest Config

Move test arcade game definitions into proper level manifests or remove them if placement will happen via Tiled map changes later.

#### 5. Update Cookbook

**File**: `.ai/10x-devs/game/cookbook.md`

Add a new section documenting the arcade system, including:
- How to define arcade games in level manifests (`arcadeGames` field)
- How to place arcade zones in Tiled maps (type `arcade`, custom property `arcadeGameId` as string)
- Available game types and their configuration parameters
- How to add a new game renderer (implement `ArcadeGameRenderer`, register in `rendererRegistry.ts`)

### Success Criteria:

#### Automated Verification:

- [x] Full build succeeds: `npm run build`
- [x] All tests pass: `npm run test`
- [x] `/api/game` endpoint includes `arcadeGames` in response

#### Manual Verification:

- [ ] Complete end-to-end flow: boot game → walk to arcade zone → play game → earn XP
- [ ] All three game types work correctly
- [ ] XP persists after page reload (server save)
- [ ] No console errors during gameplay
- [x] Cookbook updated with arcade system documentation

---

## Testing Strategy

### Unit Tests:

- `ArcadeTypes` — validate XP calculation formula
- `OscilloscopeRenderer` — test `calculateMatch()` with known waveform parameters
- `MemoryMatrixRenderer` — test pattern generation and validation logic

### Integration Tests:

- Level loader correctly builds `allArcadeGames` registry from manifest data
- API endpoint includes arcade game definitions in response

### Manual Testing Steps:

1. Place arcade zones on a test map with all three game types
2. Play each game at difficulty 1, 3, and 5
3. Verify XP is granted and visible in HUD after each play
4. Verify ESC quits cleanly from each game
5. Verify no input leaks (player movement during game)
6. Verify replayability (can play same game multiple times)
7. Test with terminal open (should not conflict)

## Performance Considerations

- Asteroid renderer: uses built-in object pool of 30 pre-allocated asteroid objects (see Phase 2 gameplay mechanics). No per-frame create/destroy.
- Oscilloscope renderer: only redraw waveform graphics when parameter values change (track a `dirty` flag), not every frame.
- Memory matrix: static tiles don't need per-frame updates. Only animate during show/feedback phases.
- All games: use `setScrollFactor(0)` on all objects to avoid camera transform overhead.

## File Structure

```
src/explorers/
├── systems/
│   └── ArcadeTypes.ts              (new — types & interfaces)
├── arcade/                          (new directory)
│   ├── rendererRegistry.ts          (new — game type → renderer mapping)
│   ├── AsteroidRangeRenderer.ts     (new — shooting gallery game)
│   ├── MemoryMatrixRenderer.ts      (new — pattern recall game)
│   └── OscilloscopeRenderer.ts      (new — waveform matching game)
├── scenes/
│   └── ArcadeScene.ts               (new — overlay scene shell)
├── config/
│   ├── constants.ts                 (modified — add DEPTH.ARCADE)
│   └── sceneRegistry.ts            (modified — add ARCADE key)
├── events/
│   └── GameEvents.ts               (modified — add arcade events)
├── entities/
│   └── InteractiveObject.ts        (modified — add 'arcade' type)
├── levels/
│   ├── types.ts                    (modified — add arcadeGames to LevelManifest)
│   └── levelLoader.ts             (modified — add GameManifestLevel.arcadeGames, allArcadeGames registry)
└── scenes/
    ├── BootScene.ts                (modified — register ArcadeScene)
    └── GameScene.ts                (modified — handle arcade zones)
```

## References

- ExamScene overlay pattern: `src/explorers/scenes/ExamScene.ts`
- Level manifest structure: `src/explorers/levels/types.ts`
- Zone handling in GameScene: `src/explorers/scenes/GameScene.ts:414-466`
- Event system: `src/explorers/events/GameEvents.ts`
- Game specification: `.ai/10x-devs/game/10x-explorers-spec.md`
- Cookbook: `.ai/10x-devs/game/cookbook.md`
