---
date: 2026-04-09
planner: Claude (10x-plan)
git_commit: 7bd2683b5600d1f45b2c2260f36d70467efbbdf9
branch: master
repository: przeprogramowani-sites
project: edu-platform
topic: "Mobile-friendly game controls for Space Explorers"
research: thoughts/shared/research/2026-04-09-mobile-friendly-game-controls.md
status: ready
---

# Mobile-Friendly Game Controls — Implementation Plan

## Overview

Add a touch-friendly virtual control layer (D-pad + 4 action buttons) and a responsive HUD so that Space Explorers becomes fully playable on small portrait screens (iPhone SE → iPhone 14+ widths). Desktop UX is unchanged.

## Current State Analysis

- `InputController` is keyboard-only and is the central hub for movement (`src/explorers/systems/InputController.ts:1-61`).
- `Astronaut.update()` polls `inputCtrl.isLeft/Right/Up/Down()` directly — virtualizing those four methods is a non-breaking seam.
- `DialogueScene` registers `SPACE` and `ESC` directly on `scene.input.keyboard` and polls them in `update()` (`src/explorers/scenes/DialogueScene.ts:29-30,47-54`). It bypasses `InputController`.
- `ExamScene` is **NOT** Svelte/DOM (the research document was wrong on this point). It is rendered with Phaser GameObjects, and answer-option backgrounds already have `pointerup` handlers (`src/explorers/scenes/ExamScene.ts:239,273`). Tapping options already works on touch devices. Only the keyboard shortcuts (number keys / `Enter`) bypass tap support, and they are supplemental.
- Three arcade renderers register their own scene-level keyboard handlers and maintain a private `keys` map:
  - `AsteroidRangeRenderer` — `WASD` held + `SPACE` pulse (`src/explorers/arcade/AsteroidRangeRenderer.ts:195-211`)
  - `MemoryMatrixRenderer` — `WASD` + `SPACE` + `Enter` discrete (`src/explorers/arcade/MemoryMatrixRenderer.ts:189-190,260-292`)
  - `OscilloscopeRenderer` — `WASD` + `Enter` discrete (`src/explorers/arcade/OscilloscopeRenderer.ts:266-267,282-329`)
- `PhaserGame.svelte` is a flex column: 56 px HUD, then `flex-1` canvas (`src/explorers/PhaserGame.svelte:317-328`). Phaser canvas scales via `Scale.RESIZE` (`src/explorers/config/gameConfig.ts:7-11`) and `GameScene.updateCameraForViewport()` recomputes zoom on `scale.on('resize')` (`src/explorers/scenes/GameScene.ts:291-315`).
- `GameHud.svelte` is 56 px tall (CSS says 48 but the wrapper in PhaserGame reserves 56), three flex sections: home/logo, rank/XP/location, mute/terminal/login CTA (`src/explorers/GameHud.svelte:115-205`).
- `SmartTerminal` lives in a fixed `w-[540px]` container (`src/explorers/PhaserGame.svelte:337`) — overflows portrait phones.
- `GameScene` exposes `getInputController()` publicly (`src/explorers/scenes/GameScene.ts:552`), so a Svelte component can grab it via `game.scene.getScene(SceneKey.GAME).getInputController()` once the scene is active.
- Zero existing touch detection, no `pointer*` event handlers anywhere in `src/explorers/`.

## Desired End State

A user opening `/explorers` on an iPhone in portrait sees:

1. A compact HUD bar (top, 56 px) with hamburger menu, mute, and terminal toggle. Tapping the hamburger reveals rank/XP/location/login CTA in a popover.
2. The Phaser canvas filling the middle.
3. A pixel-art mobile control bar (bottom, ~140 px + safe-area) with a 4-direction D-pad on the left and a 4-button action cluster (`E`, `SPC`, `ENTER`, `ESC`) on the right.
4. They can walk the astronaut, talk to NPCs, advance dialogue, take exams (option taps already work), and play all three arcade games using only touch — no keyboard.

Desktop behavior is byte-identical to before.

### Key Discoveries

- `InputController.isLeft/Right/Up/Down()` are polled per frame by `Astronaut` — adding `OR virtualButtons.left` etc. is a one-line change per method.
- `Phaser.Input.Keyboard.JustDown` is a per-frame edge detector — virtual `E` must be modeled as a "consume-once pulse" to keep the same semantics.
- `getInputController()` already exists on `GameScene` — no new public API needed for the Svelte side to reach the controller.
- Phaser scenes share a global event bus through `game.events` — emitting `virtual-space` / `virtual-esc` / `virtual-enter` / `virtual-dir-down` / `virtual-dir-up` from Svelte and subscribing in scenes is the cleanest bridge.
- Exam options are already Phaser interactive game objects — no exam scene changes are needed for tapping. We do **not** need to inject synthetic number-key events.

## What We're NOT Doing

- No virtual analog joystick. The D-pad is final per the design decision in the research doc.
- No landscape orientation lock. The bar is portrait-first; landscape continues to work with keyboard.
- No Phaser plugins (`phaser3-rex-plugins` or others).
- No changes to `ExamScene` — its options are already tappable Phaser interactives.
- No changes to `Astronaut.ts` — the `InputController` seam already covers it.
- No camera/deadzone tuning. Per user choice, we leave the existing dynamic zoom behavior alone.
- No iOS-specific Canvas-mode forcing — `Phaser.AUTO` already falls back if WebGL fails.
- No automatic device-pixel-ratio handling beyond what Phaser already does.
- No keyboard remapping, gamepad API support, or settings UI for control customization.
- No diagonal movement on the D-pad. Single direction at a time, winner-takes-all.

## Implementation Approach

The plan is split into 5 phases that ship in order. Phases 1–3 are the core "make it playable on mobile" work. Phase 4 is the HUD redesign needed for screen real estate. Phase 5 is a small polish fix for the terminal width.

The architectural seams are:

1. **Input layer** — `InputController` learns about `virtualButtons` (movement) and a `virtualInteractPulse` (one-shot E). Movement code (`Astronaut`) is unchanged.
2. **Event-bus layer** — Svelte buttons emit semantic events on `game.events`: `virtual-space`, `virtual-esc`, `virtual-enter`, `virtual-dir-down`, `virtual-dir-up`. Each interested scene subscribes and remaps to its own behavior. Buttons stay visible across contexts; behavior swaps via subscription.
3. **Detection layer** — A small `touchDetection.ts` helper exposes a Svelte store. The store re-evaluates on `resize` and `orientationchange`.
4. **UI layer** — `MobileControls.svelte` (new) and an updated `GameHud.svelte` use the store to render conditionally on touch + narrow viewport.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Pointer release coverage** — every D-pad and action button must release on `pointerup`, `pointercancel`, `pointerleave`, **and** `lostpointercapture`. Skipping any of these leaves a virtual button stuck "down" when the OS interrupts touch (notification banner, scroll, system gesture). This is the single most important correctness rule of this plan.
- **`E` button = one-frame pulse** — `Phaser.Input.Keyboard.JustDown` is an edge detector polled by `GameScene.update()` once per frame. The virtual interact pulse must be set on `pointerdown` and consumed (cleared) inside `isInteractJustPressed()` so that holding the `E` button produces exactly one interaction, matching keyboard semantics.
- **`MobileControls` mount order** — the component mounts inside `PhaserGame.svelte` only after `gameReady === true`. The `inputController` reference must be acquired lazily (on first press) via `game.scene.getScene(SceneKey.GAME)?.getInputController()`, because `GameScene` is launched asynchronously by `BootScene` and may not exist when `MobileControls` first mounts.
- **Touch detection re-evaluation** — `initTouchDetection()` listens to `resize` and `orientationchange` and updates the store. This handles device rotation and DevTools mobile-mode toggling without a reload.
- **Event subscription cleanup** — every scene that subscribes to `virtual-*` events on `game.events` must unsubscribe in its `shutdown` event handler, mirroring the existing pattern in `DialogueScene.create()`.

### User Experience Specification

- **Bar visibility** — the mobile bar is **always visible** when touch mode is active. It does not hide when DialogueScene/ExamScene/ArcadeScene is active. Users always see the same 4 action buttons; their behavior swaps via which scene is currently subscribed.
- **No diagonals** — pressing a new direction button immediately clears all other direction flags. Rule: "winner takes all, latest press wins". Two simultaneous touches → only the most-recent direction is active.
- **Pixel-art aesthetic** — pure CSS, no `transition` properties (instant state changes match the pixel-art feel). Background is `#0a0e2a` (DEEP_NAVY) with `rgba(0, 212, 170, 0.15)` borders. Pressed state flips background to `rgba(0, 212, 170, 0.25)` and brightens border to `#00d4aa`. Arrow glyphs are Unicode `▲ ▼ ◀ ▶`. Action labels use `JetBrains Mono` (already loaded by HUD).
- **Touch target size** — every button is at least `52×52 px` (Apple HIG minimum is 44 px; we go larger to feel comfortable on a moving target).
- **Bar height** — `~140 px` for the buttons themselves, plus `env(safe-area-inset-bottom, 0)` to clear the iPhone home indicator zone.
- **Visual feedback** — instant background flip on press; no animation, no transition. Matches "no smooth transitions = pixel-art feel" from the research doc.
- **HUD on mobile** — compact bar (56 px) with hamburger button on the left, mini level indicator (e.g. `Lv.5`), mute icon, terminal toggle. Tapping the hamburger opens a popover positioned absolutely below the HUD containing: full rank+name, XP bar+text, location, login CTA. Tapping outside the popover or the hamburger again closes it. Popover overlays the canvas and does not pause the game.
- **Edge case — TERMINAL_FOUND not yet set** — terminal toggle is hidden until the flag is set, same as desktop logic (`GameHud.svelte:193`).

### Performance & Optimization Strategy

- **Passive listeners** — `resize` and `orientationchange` listeners use `{ passive: true }`. Pointer-event listeners on buttons cannot be passive because they need `preventDefault()` to suppress browser gestures (zoom, double-tap select).
- **`touch-action: none`** — every button gets `touch-action: none` in CSS so the browser does not synthesize scroll/pinch from finger movement on the bar.
- **No CSS transitions** — buttons have zero `transition` rules. Instant state changes are not only stylistic but also avoid GPU compositing work on every press.
- **Store updates** — `isTouchMode` writable store updates only on resize/orientationchange, not per render or per tick.
- **Per-scene subscription overhead** — each interested scene adds at most 5 new event listeners on `game.events`. Negligible.

### State Management Sequencing

- **Movement press flow**
  1. User touches `▲` button
  2. `pointerdown` → clear all 4 direction virtual flags → set `up = true` → emit `virtual-dir-down { dir: 'up' }`
  3. Next Phaser tick: `Astronaut.update()` calls `inputCtrl.isUp()` which returns `true` (virtual flag), Astronaut applies up velocity
  4. User lifts finger → `pointerup` (or `pointerleave` / `pointercancel` / `lostpointercapture`) → set `up = false` → emit `virtual-dir-up { dir: 'up' }`
  5. Next tick: `isUp()` returns `false`, Astronaut decelerates
- **Interact press flow**
  1. User taps `E` → `pointerdown` → `inputCtrl.pulseVirtualInteract()` sets `virtualInteractPulse = true`
  2. Next `GameScene.update()` calls `inputCtrl.isInteractJustPressed()` which returns `true` once and resets `virtualInteractPulse = false`
  3. `GameScene.handleInteraction()` runs exactly once
- **Dialogue advance flow**
  1. User taps `SPC` (or `ENTER`) → emit `virtual-space` on `game.events`
  2. `DialogueScene` listener calls `handleAdvance()` if `this.active === true`, otherwise no-op
- **Arcade flow** — `AsteroidRangeRenderer` listens to `virtual-dir-down/up` and updates its private `keys.w/a/s/d` map; listens to `virtual-space` for shoot. `MemoryMatrixRenderer` listens to direction events for cursor, `virtual-space` for toggle, `virtual-enter` for submit. `OscilloscopeRenderer` listens to direction events for parameter scroll/adjust, `virtual-enter` for submit.
- **Movement disabled by `setEnabled(false)`** — when `GameScene` disables the input controller during dialogue/exam/arcade transitions, virtual flags still get set but `isUp()` etc. early-return `false` because of the `enabled` check. Movement is correctly suppressed without any additional gating in the Svelte component.

### Debug & Observability Plan

- **Verification path** — open `/explorers` in Chrome DevTools mobile mode (iPhone 14, portrait), log in, observe the mobile bar appears. Tap each direction → astronaut moves. Tap `E` near an NPC → dialogue starts. Tap `SPC` → dialogue advances. Tap `ESC` → dialogue skips. Repeat against arcade and exam zones.
- **Logging** — add `devLog('[InputController] virtual:', btn, value)` inside `setVirtualButton()` and `devLog('[MobileControls] press', dir | action)` in the Svelte handlers, gated through the existing `devLog` utility (`src/explorers/utils/logger.ts`).
- **Manual on-device** — the only way to fully validate pointer-event quirks is on a real iPhone (DevTools simulation does not reproduce all `pointercancel` cases). Use Safari on iOS connected to macOS via USB and the Web Inspector.
- **Stuck-button detection** — temporarily add a debug indicator (only when `?qa` query param is set, like `QaOverlay`) showing the current state of all virtual flags. Helpful while iterating.

---

## Phase 1: Foundation — InputController virtualization & touch detection

### Overview

Make `InputController` accept virtual button input alongside keyboard, and add a Svelte store that detects touch + narrow viewport.

### Changes Required

#### 1. `src/explorers/systems/InputController.ts`

**Changes**: add `virtualButtons` map, `virtualInteractPulse` flag, setters, OR virtual flags into existing query methods.

```typescript
import Phaser from 'phaser';

export type VirtualDirection = 'up' | 'down' | 'left' | 'right';

export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: { /* unchanged */ };
  private interactKey: Phaser.Input.Keyboard.Key;
  private spaceKey: Phaser.Input.Keyboard.Key;
  private escKey: Phaser.Input.Keyboard.Key;
  private enabled = true;

  // NEW: virtual input state
  private virtualButtons: Record<VirtualDirection, boolean> = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  private virtualInteractPulse = false;

  constructor(scene: Phaser.Scene) { /* unchanged */ }

  setEnabled(value: boolean): void { this.enabled = value; }

  // NEW: virtual setters
  setVirtualDirection(dir: VirtualDirection, value: boolean): void {
    if (value) {
      // Winner-takes-all: clear all other directions to enforce no-diagonals
      this.virtualButtons.up = false;
      this.virtualButtons.down = false;
      this.virtualButtons.left = false;
      this.virtualButtons.right = false;
    }
    this.virtualButtons[dir] = value;
  }

  pulseVirtualInteract(): void {
    this.virtualInteractPulse = true;
  }

  // MODIFIED: OR virtual flags
  isUp(): boolean {
    return this.enabled && (this.cursors.up.isDown || this.wasd.W.isDown || this.virtualButtons.up);
  }
  isDown(): boolean {
    return this.enabled && (this.cursors.down.isDown || this.wasd.S.isDown || this.virtualButtons.down);
  }
  isLeft(): boolean {
    return this.enabled && (this.cursors.left.isDown || this.wasd.A.isDown || this.virtualButtons.left);
  }
  isRight(): boolean {
    return this.enabled && (this.cursors.right.isDown || this.wasd.D.isDown || this.virtualButtons.right);
  }

  // MODIFIED: consume virtual interact pulse exactly once
  isInteractJustPressed(): boolean {
    if (!this.enabled) return false;
    const kb = Phaser.Input.Keyboard.JustDown(this.interactKey);
    if (this.virtualInteractPulse) {
      this.virtualInteractPulse = false;
      return true;
    }
    return kb;
  }

  // unchanged
  isSpaceJustPressed(): boolean { /* unchanged */ }
  isEscJustPressed(): boolean { /* unchanged */ }
}
```

Note: `setEnabled(false)` still suppresses virtual movement because `isUp()` etc. short-circuit on `enabled`. This is intentional — when the player enters dialogue/exam/arcade, the D-pad presses become harmless no-ops for movement, but the action button events still flow through `game.events` to the active scene.

#### 2. `src/explorers/utils/touchDetection.ts` (new file)

```typescript
import { writable, type Writable } from 'svelte/store';

const TOUCH_BREAKPOINT_PX = 1024;

function detect(): boolean {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return hasTouch && window.innerWidth < TOUCH_BREAKPOINT_PX;
}

export const isTouchMode: Writable<boolean> = writable(false);

/**
 * Initialise touch detection. Returns a cleanup function that removes
 * the resize/orientationchange listeners.
 */
export function initTouchDetection(): () => void {
  if (typeof window === 'undefined') return () => {};

  isTouchMode.set(detect());

  const onChange = () => isTouchMode.set(detect());
  window.addEventListener('resize', onChange, { passive: true });
  window.addEventListener('orientationchange', onChange, { passive: true });

  return () => {
    window.removeEventListener('resize', onChange);
    window.removeEventListener('orientationchange', onChange);
  };
}
```

### Success Criteria

#### Automated Verification

- [x] Type-check passes: `npm run build` (or whatever Astro typecheck runs in CI)
- [x] Lint passes: `npm run lint` (from monorepo root, scoped to `projects/edu-platform`)
- [x] No new test failures: `npm run test`
- [x] Existing keyboard input still works in dev: `npm run dev` → game loads → arrow keys move astronaut

#### Manual Verification

- [ ] In dev console, run `game.scene.getScene('GameScene').getInputController().setVirtualDirection('up', true)` → astronaut walks up
- [ ] Calling `setVirtualDirection('left', true)` immediately after up → astronaut walks left only (no diagonal)
- [ ] Calling `pulseVirtualInteract()` near an NPC → dialogue starts exactly once

**Implementation Note**: Pause here for confirmation before Phase 2.

---

## Phase 2: `MobileControls.svelte` component

### Overview

Build the touch-friendly D-pad + action button component. Pure CSS pixel-art aesthetic, no Phaser involvement.

### Changes Required

#### 1. `src/explorers/MobileControls.svelte` (new file)

**Structure**: a single fixed-position bar that slots into the flex column below the canvas. The component takes the live `Phaser.Game` as a prop and lazy-resolves the `InputController` on first press.

```svelte
<script lang="ts">
  import type Phaser from 'phaser';
  import { SceneKey } from './config/sceneRegistry';
  import type { InputController, VirtualDirection } from './systems/InputController';
  import { devLog } from './utils/logger';
  import type { GameScene } from './scenes/GameScene';

  export let game: Phaser.Game;

  type ActionKey = 'space' | 'enter' | 'esc';

  function getInputController(): InputController | null {
    const scene = game.scene.getScene(SceneKey.GAME) as GameScene | undefined;
    return scene?.getInputController() ?? null;
  }

  function pressDirection(dir: VirtualDirection): void {
    devLog('[MobileControls] press dir', dir);
    getInputController()?.setVirtualDirection(dir, true);
    game.events.emit('virtual-dir-down', { dir });
  }

  function releaseDirection(dir: VirtualDirection): void {
    devLog('[MobileControls] release dir', dir);
    getInputController()?.setVirtualDirection(dir, false);
    game.events.emit('virtual-dir-up', { dir });
  }

  function pressInteract(): void {
    devLog('[MobileControls] press interact');
    getInputController()?.pulseVirtualInteract();
  }

  function pressAction(key: ActionKey): void {
    devLog('[MobileControls] press action', key);
    game.events.emit(`virtual-${key}`);
  }

  // Generic handler factory — covers pointerup / pointercancel / pointerleave / lostpointercapture
  function makeReleaseHandlers(release: () => void) {
    return {
      onpointerup: release,
      onpointercancel: release,
      onpointerleave: release,
      onlostpointercapture: release,
    };
  }
</script>

<div class="mobile-controls" role="group" aria-label="Sterowanie dotykowe">
  <!-- D-pad -->
  <div class="dpad">
    <button
      type="button"
      class="dpad-btn dpad-up"
      aria-label="Góra"
      on:pointerdown|preventDefault={() => pressDirection('up')}
      {...makeReleaseHandlers(() => releaseDirection('up'))}>▲</button>
    <button
      type="button"
      class="dpad-btn dpad-left"
      aria-label="Lewo"
      on:pointerdown|preventDefault={() => pressDirection('left')}
      {...makeReleaseHandlers(() => releaseDirection('left'))}>◀</button>
    <button
      type="button"
      class="dpad-btn dpad-right"
      aria-label="Prawo"
      on:pointerdown|preventDefault={() => pressDirection('right')}
      {...makeReleaseHandlers(() => releaseDirection('right'))}>▶</button>
    <button
      type="button"
      class="dpad-btn dpad-down"
      aria-label="Dół"
      on:pointerdown|preventDefault={() => pressDirection('down')}
      {...makeReleaseHandlers(() => releaseDirection('down'))}>▼</button>
  </div>

  <!-- Action buttons -->
  <div class="actions">
    <button
      type="button"
      class="action-btn"
      aria-label="Interakcja"
      on:pointerdown|preventDefault={pressInteract}>E</button>
    <button
      type="button"
      class="action-btn"
      aria-label="Spacja"
      on:pointerdown|preventDefault={() => pressAction('space')}>SPC</button>
    <button
      type="button"
      class="action-btn"
      aria-label="Enter"
      on:pointerdown|preventDefault={() => pressAction('enter')}>ENT</button>
    <button
      type="button"
      class="action-btn"
      aria-label="Anuluj"
      on:pointerdown|preventDefault={() => pressAction('esc')}>ESC</button>
  </div>
</div>

<style>
  .mobile-controls {
    width: 100%;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0)) 16px;
    background: #0a0e2a;
    border-top: 1px solid rgba(0, 212, 170, 0.15);
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }

  .dpad {
    position: relative;
    width: 168px;
    height: 168px;
    flex-shrink: 0;
  }

  .dpad-btn {
    position: absolute;
    width: 56px;
    height: 56px;
    background: rgba(0, 212, 170, 0.08);
    border: 1px solid rgba(0, 212, 170, 0.25);
    color: #00d4aa;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 22px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    touch-action: none;
    image-rendering: pixelated;
    /* No transitions — pixel-art instant feel */
  }

  .dpad-btn:active {
    background: rgba(0, 212, 170, 0.25);
    border-color: #00d4aa;
    color: #ffffff;
  }

  .dpad-up    { top: 0;    left: 56px; }
  .dpad-left  { top: 56px; left: 0; }
  .dpad-right { top: 56px; left: 112px; }
  .dpad-down  { top: 112px; left: 56px; }

  .actions {
    display: grid;
    grid-template-columns: repeat(2, 56px);
    grid-template-rows: repeat(2, 56px);
    gap: 8px;
  }

  .action-btn {
    width: 56px;
    height: 56px;
    background: rgba(0, 212, 170, 0.08);
    border: 1px solid rgba(0, 212, 170, 0.25);
    color: #00d4aa;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    touch-action: none;
  }

  .action-btn:active {
    background: rgba(0, 212, 170, 0.25);
    border-color: #00d4aa;
    color: #ffffff;
  }
</style>
```

Notes:
- `:active` is enough for the pressed state because we have no transition/animation; the browser flips it instantly.
- `touch-action: none` is on both the bar and individual buttons to fully suppress browser gestures.
- The D-pad uses absolute positioning inside a `168×168 px` container so it forms a `+` shape (the center position is intentionally empty — visual-only "no action").
- Action buttons are a `2×2` grid (`E`/`SPC` top, `ENT`/`ESC` bottom) — fits comfortably alongside the D-pad on a 375 px wide phone (168 + 16 + 120 + 16*2 padding ≈ 336 px → leaves margin).
- The `:export type GameScene` import path is the existing `GameScene.ts`. The `getInputController()` getter at `src/explorers/scenes/GameScene.ts:552` is already public.

### Success Criteria

#### Automated Verification

- [x] Type-check passes: `npm run build`
- [x] Lint passes: `npm run lint`
- [x] Component imports resolve without errors

#### Manual Verification

- [ ] Component renders standalone in Storybook-like sandbox (or temporarily mount in PhaserGame.svelte unconditionally for visual check)
- [ ] All 8 buttons render in correct positions (D-pad cross, action 2×2 grid)
- [ ] Pressed state visually flips immediately on tap
- [ ] No CSS console warnings about `touch-action` or `safe-area-inset`

**Implementation Note**: Pause for confirmation that the visual matches the desired pixel-art aesthetic before Phase 3.

---

## Phase 3: Mount + scene wiring

### Overview

Plug `MobileControls` into `PhaserGame.svelte`, conditionally rendered via the touch-mode store. Wire `DialogueScene` and the three arcade renderers to listen to the `virtual-*` events on `game.events`.

### Changes Required

#### 1. `src/explorers/PhaserGame.svelte`

**Changes**:
- Import `MobileControls` and the touch detection helpers
- Initialize touch detection in `onMount`, clean up in the existing return cleanup
- Conditionally render `<MobileControls>` below the canvas inside the existing flex column

```svelte
<script lang="ts">
  // ... existing imports
  import MobileControls from './MobileControls.svelte';
  import { isTouchMode, initTouchDetection } from './utils/touchDetection';

  // ... existing state
</script>

<!-- in onMount, after game = new Phaser.Game(config); -->
const cleanupTouchDetection = initTouchDetection();

<!-- in the return cleanup at the end of onMount -->
return () => {
  // ... existing cleanup
  cleanupTouchDetection();
};
```

```svelte
<div class="flex flex-col w-full h-full transition-opacity duration-300" class:opacity-0={!settled}>
  <!-- HUD topbar -->
  <div style="flex: 0 0 56px;">
    {#if game && gameReady}
      <GameHud {game} {userEmail} {terminalOpen} onToggleTerminal={toggleTerminal} />
    {/if}
  </div>

  <!-- Game canvas — fills space below HUD and above mobile controls -->
  <div bind:this={container} class="flex-1 min-h-0"></div>

  <!-- Mobile controls — only on touch devices in narrow viewports -->
  {#if game && gameReady && $isTouchMode}
    <MobileControls {game} />
  {/if}

  <!-- ... existing overlays unchanged -->
</div>
```

The flex layout naturally gives the canvas the remaining space; Phaser's `Scale.RESIZE` triggers `GameScene.updateCameraForViewport()` automatically when the bar appears.

#### 2. `src/explorers/scenes/DialogueScene.ts`

**Changes**: subscribe to `virtual-space` and `virtual-esc` on `this.game.events`. Mirror the existing `bus.on/off` pattern.

```typescript
create(): void {
  devLog('[DialogueScene] Created');

  this.dialogueBar = new DialogueBar(this);
  this.dialogueManager = new DialogueManager(this.game, this.bus);

  this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

  // Listen for dialogue show events
  const onDialogueShow = (payload: { dialogueId: string }) => {
    this.showDialogue(payload.dialogueId);
  };
  this.bus.on(GameEvents.DIALOGUE_SHOW, onDialogueShow);

  // NEW: virtual buttons from MobileControls
  const onVirtualSpace = () => {
    if (this.active) this.handleAdvance();
  };
  const onVirtualEsc = () => {
    if (this.active) this.handleSkip();
  };
  this.game.events.on('virtual-space', onVirtualSpace);
  this.game.events.on('virtual-esc', onVirtualEsc);

  this.events.on('shutdown', () => {
    this.bus.off(GameEvents.DIALOGUE_SHOW, onDialogueShow);
    this.game.events.off('virtual-space', onVirtualSpace);
    this.game.events.off('virtual-esc', onVirtualEsc);
  });
}
```

(`this.bus` in `BaseScene` is `this.game.events` — using `this.game.events` directly here is fine but you may also route through `this.bus` for consistency. Use whichever matches the existing pattern in `BaseScene.ts`.)

#### 3. `src/explorers/arcade/AsteroidRangeRenderer.ts`

**Changes**: subscribe to `virtual-dir-down/up` and `virtual-space`. Map directions → existing private `keys` map.

```typescript
private virtualDirDownHandler: ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void) | null = null;
private virtualDirUpHandler: ((p: { dir: 'up' | 'down' | 'left' | 'right' }) => void) | null = null;
private virtualSpaceHandler: (() => void) | null = null;

create(scene: Phaser.Scene, config: ArcadeGameDefinition, bounds: Phaser.Geom.Rectangle): void {
  // ... existing setup ...

  this.keydownHandler = /* unchanged */;
  this.keyupHandler = /* unchanged */;
  this.spaceHandler = () => this.shoot();

  scene.input.keyboard?.on('keydown', this.keydownHandler);
  scene.input.keyboard?.on('keyup', this.keyupHandler);
  scene.input.keyboard?.on('keydown-SPACE', this.spaceHandler);

  // NEW: virtual D-pad → WASD map
  const dirToKey: Record<string, 'w' | 'a' | 's' | 'd'> = {
    up: 'w', down: 's', left: 'a', right: 'd',
  };
  this.virtualDirDownHandler = ({ dir }) => {
    const key = dirToKey[dir];
    if (key) this.keys[key] = true;
  };
  this.virtualDirUpHandler = ({ dir }) => {
    const key = dirToKey[dir];
    if (key) this.keys[key] = false;
  };
  this.virtualSpaceHandler = () => this.shoot();

  scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
  scene.game.events.on('virtual-dir-up', this.virtualDirUpHandler);
  scene.game.events.on('virtual-space', this.virtualSpaceHandler);
}

destroy(): void {
  // ... existing cleanup ...
  if (this.virtualDirDownHandler) {
    this.scene.game.events.off('virtual-dir-down', this.virtualDirDownHandler);
    this.virtualDirDownHandler = null;
  }
  if (this.virtualDirUpHandler) {
    this.scene.game.events.off('virtual-dir-up', this.virtualDirUpHandler);
    this.virtualDirUpHandler = null;
  }
  if (this.virtualSpaceHandler) {
    this.scene.game.events.off('virtual-space', this.virtualSpaceHandler);
    this.virtualSpaceHandler = null;
  }
  // ...
}
```

Note: the existing `spaceHandler` and `virtualSpaceHandler` both call `this.shoot()` — the cooldown logic inside `shoot()` already prevents double-fire if both keyboard and virtual fire on the same frame.

#### 4. `src/explorers/arcade/MemoryMatrixRenderer.ts`

**Changes**: same pattern. Subscribe to `virtual-dir-down`, `virtual-space` (toggle cell), `virtual-enter` (submit). Direction events should only act during the `'input'` phase (mirror the existing `handleKey` guard).

```typescript
// In create(), after the existing keyHandler registration:

const dirToCursor: Record<string, () => void> = {
  up: () => {
    if (this.phase !== 'input') return;
    this.cursorRow = (this.cursorRow - 1 + this.gridSize) % this.gridSize;
    this.updateCursorPosition();
  },
  down: () => {
    if (this.phase !== 'input') return;
    this.cursorRow = (this.cursorRow + 1) % this.gridSize;
    this.updateCursorPosition();
  },
  left: () => {
    if (this.phase !== 'input') return;
    this.cursorCol = (this.cursorCol - 1 + this.gridSize) % this.gridSize;
    this.updateCursorPosition();
  },
  right: () => {
    if (this.phase !== 'input') return;
    this.cursorCol = (this.cursorCol + 1) % this.gridSize;
    this.updateCursorPosition();
  },
};

this.virtualDirDownHandler = ({ dir }) => dirToCursor[dir]?.();
this.virtualSpaceHandler = () => {
  if (this.phase === 'input') this.toggleCell();
};
this.virtualEnterHandler = () => {
  if (this.phase === 'input') this.submitSelection();
};

scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
scene.game.events.on('virtual-space', this.virtualSpaceHandler);
scene.game.events.on('virtual-enter', this.virtualEnterHandler);
```

Add the corresponding `off()` cleanup in `destroy()`.

#### 5. `src/explorers/arcade/OscilloscopeRenderer.ts`

**Changes**: same pattern. Direction → param scroll/adjust, virtual-enter → submit (or finish if already submitted, mirroring existing keyboard handler).

```typescript
this.virtualDirDownHandler = ({ dir }) => {
  if (this.submitted) return;
  const params = this.diffConfig.params;
  switch (dir) {
    case 'up':
      this.activeParamIndex = (this.activeParamIndex - 1 + params.length) % params.length;
      this.dirty = true;
      break;
    case 'down':
      this.activeParamIndex = (this.activeParamIndex + 1) % params.length;
      this.dirty = true;
      break;
    case 'right': {
      const param = params[this.activeParamIndex];
      const current = this.playerParams[param.key] ?? 0;
      this.playerParams[param.key] = Math.min(param.max, round(current + param.step, 3));
      this.dirty = true;
      audioManager.playSfx(SfxKey.PARAM_BEEP);
      break;
    }
    case 'left': {
      const param = params[this.activeParamIndex];
      const current = this.playerParams[param.key] ?? 0;
      this.playerParams[param.key] = Math.max(param.min, round(current - param.step, 3));
      this.dirty = true;
      audioManager.playSfx(SfxKey.PARAM_BEEP);
      break;
    }
  }
};

this.virtualEnterHandler = () => {
  if (this.submitted) {
    this.finishDelayTimer?.destroy();
    this.finishDelayTimer = null;
    this.finished = true;
  } else {
    this.submit();
  }
};

scene.game.events.on('virtual-dir-down', this.virtualDirDownHandler);
scene.game.events.on('virtual-enter', this.virtualEnterHandler);
```

Add `off()` cleanup in `destroy()`.

### Success Criteria

#### Automated Verification

- [x] Type-check passes: `npm run build`
- [x] Lint passes: `npm run lint`
- [x] Existing tests still pass: `npm run test`

#### Manual Verification

- [ ] Open `/explorers` in DevTools mobile mode (iPhone 14, portrait): mobile bar appears
- [ ] D-pad moves astronaut in all 4 directions; pressing two directions at once produces only the latest direction (no diagonal)
- [ ] Tapping `E` near an NPC starts dialogue
- [ ] Tapping `SPC` advances dialogue; tapping `ESC` skips dialogue
- [ ] Asteroid Range: D-pad moves crosshair, `SPC` shoots
- [ ] Memory Matrix: D-pad moves cursor, `SPC` toggles cell, `ENT` submits
- [ ] Oscilloscope: D-pad cycles params and adjusts values, `ENT` submits then finishes
- [ ] Exam: tap answer options directly (already worked); `ESC` closes (via existing keyboard handler — confirm it ALSO works via virtual ESC by connecting if needed in a follow-up; current scope leaves it tap-only)
- [ ] Switch to desktop mode in DevTools: mobile bar disappears, keyboard input still works
- [ ] Rotate device to landscape: bar still works (or hides if viewport > 1024 px); rotating back restores it

**Implementation Note**: This is the ship-blocking phase. Verify on a real iPhone (not just DevTools simulation) before continuing — `pointercancel` behavior under system interruptions is hard to reproduce in the simulator.

---

## Phase 4: Mobile HUD with hamburger drawer

### Overview

Collapse `GameHud` into a compact bar on narrow viewports, with the rank/XP/location/CTA content hidden behind a hamburger button that opens a popover.

### Changes Required

#### 1. `src/explorers/GameHud.svelte`

**Changes**:
- Import `isTouchMode` store
- Add internal `hudExpanded` state
- Reorganize markup so the rank/XP/location/CTA cluster is conditionally hidden on touch and shown inside a popover when `hudExpanded`
- Compact bar shows: hamburger button (left), mini level indicator (center), mute (right), terminal (right)

```svelte
<script lang="ts">
  // ... existing imports
  import { isTouchMode } from './utils/touchDetection';

  // ... existing state
  let hudExpanded = false;

  function toggleExpanded(event: MouseEvent) {
    hudExpanded = !hudExpanded;
    blurHudButton(event);
  }

  function closeExpanded() {
    hudExpanded = false;
  }
</script>

<div class="hud" class:hud-mobile={$isTouchMode}>
  {#if $isTouchMode}
    <!-- Compact mobile layout -->
    <div class="hud-left">
      <button
        type="button"
        class="hotkey hamburger"
        aria-label="Menu"
        aria-expanded={hudExpanded}
        on:mousedown={preventHudFocusSteal}
        on:click={toggleExpanded}>
        ☰
      </button>
    </div>

    <div class="hud-center">
      <span class="level">Lv.{rankTier}</span>
    </div>

    <div class="hud-right">
      <button
        type="button"
        tabindex="-1"
        class="hotkey"
        class:hotkey-active={muted}
        on:mousedown={preventHudFocusSteal}
        on:click={onToggleMute}
        title={muted ? 'Włącz dźwięk' : 'Wycisz'}>
        <!-- existing mute icon SVG -->
      </button>
      {#if terminalFound}
        <button
          type="button"
          tabindex="-1"
          class="hotkey"
          class:hotkey-active={terminalOpen}
          on:mousedown={preventHudFocusSteal}
          on:click={onTerminalButtonClick}>
          Terminal
        </button>
      {/if}
    </div>
  {:else}
    <!-- Existing desktop layout (unchanged) -->
    <div class="hud-left"> ... </div>
    <div class="hud-center"> ... </div>
    <div class="hud-right"> ... </div>
  {/if}
</div>

{#if $isTouchMode && hudExpanded}
  <!-- Backdrop closes the drawer when tapped -->
  <div class="hud-backdrop" on:click={closeExpanded}></div>

  <!-- Drawer / popover -->
  <div class="hud-drawer">
    <a href="/courses" class="home-btn" title="Powrót do platformy">
      <!-- existing home SVG -->
    </a>

    <div class="drawer-row">
      <span class="rank">★ {rankName}</span>
      <span class="level">Lv.{rankTier}</span>
    </div>

    <div class="drawer-row">
      <div class="xp-bar-bg" style="width: 100%;">
        <div class="xp-bar-fill" style="width: {$xpWidth}%"></div>
      </div>
    </div>

    <div class="drawer-row">
      <span class="xp-text">
        {#if getRankProgress(xp).displayMax !== null}
          {xp}/{getRankProgress(xp).displayMax} XP
        {:else}
          {xp} XP
        {/if}
      </span>
    </div>

    {#if location}
      <div class="drawer-row">
        <span class="location">📍 {location}</span>
      </div>
    {/if}

    {#if !userEmail}
      <a href="/signup?redirect=explorers" class="save-cta" on:click={closeExpanded}>
        Zaloguj się, aby zapisać postęp
      </a>
    {/if}
  </div>
{/if}

<style>
  /* ... existing styles ... */

  .hud-mobile {
    /* Hamburger compact bar uses tighter padding */
    padding: 0 12px;
  }

  .hamburger {
    font-size: 18px;
    line-height: 1;
    padding: 4px 10px;
  }

  .hud-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 25;
  }

  .hud-drawer {
    position: fixed;
    top: 56px;
    left: 8px;
    right: 8px;
    z-index: 26;
    background: #0a0e2a;
    border: 1px solid rgba(0, 212, 170, 0.35);
    border-radius: 6px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }

  .drawer-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
```

Note: the mute and terminal buttons remain in the compact bar so the player can toggle audio and open the terminal without ever opening the drawer (terminal toggle is gameplay-critical).

The drawer's `top: 56px` matches the HUD wrapper height in `PhaserGame.svelte`. `z-index: 26` is above the game canvas but below the terminal overlay (`z-20` on the backdrop, `z-20` on the terminal — bump terminal to `z-30` if it shows beneath the drawer in practice).

### Success Criteria

#### Automated Verification

- [x] Type-check passes: `npm run build`
- [x] Lint passes: `npm run lint`

#### Manual Verification

- [ ] In DevTools mobile mode: HUD shows compact layout (hamburger / level / mute / terminal)
- [ ] Tapping the hamburger opens the drawer with full rank/XP/location/CTA
- [ ] Tapping the backdrop closes the drawer
- [ ] Tapping the hamburger again closes the drawer
- [ ] Mute and terminal buttons in the compact bar still work (terminal shows the Smart Terminal overlay)
- [ ] Switching to desktop mode shows the original full HUD with no hamburger
- [ ] Drawer does not block gameplay events (canvas still responds to touch through the backdrop's pointer events — verify the backdrop only intercepts taps when the drawer is open)

**Implementation Note**: Pause for confirmation that the hamburger UX feels right before Phase 5.

---

## Phase 5: SmartTerminal mobile width

### Overview

Fix the fixed-width terminal so it does not overflow portrait phones. Native keyboard flow stays unchanged.

### Changes Required

#### 1. `src/explorers/PhaserGame.svelte`

**Change**: replace the fixed `w-[540px]` terminal container with a responsive variant.

```svelte
<!-- BEFORE -->
<div class="fixed top-3 right-3 bottom-3 w-[540px] z-20">

<!-- AFTER -->
<div
  class="fixed top-3 bottom-3 z-20 left-3 right-3 sm:left-auto sm:right-3 sm:w-[540px]">
```

This makes the terminal fill the viewport (minus 12 px margins) on `< 640 px` screens, and falls back to the original `540 px` right-anchored card on `≥ 640 px` (Tailwind's `sm` breakpoint).

### Success Criteria

#### Automated Verification

- [x] Type-check passes: `npm run build`
- [x] Lint passes: `npm run lint`

#### Manual Verification

- [ ] In DevTools mobile mode (iPhone 14 portrait): open the terminal via the hamburger drawer's terminal button or the compact bar terminal button — terminal fills the viewport with 12 px margins all around
- [ ] Type a command — native keyboard appears, terminal accepts input
- [ ] Tap outside the terminal (backdrop) → terminal closes
- [ ] Switch to desktop mode → terminal returns to the 540 px right-anchored card
- [ ] No horizontal scroll appears on the page at any width

---

## Testing Strategy

### Unit Tests

There are no obvious unit-testable surfaces here:
- `InputController` virtual flags are trivial setters/getters; not worth a test
- `touchDetection.ts` is window-dependent and would need a `jsdom` shim

If you want a smoke test, add one for `setVirtualDirection` enforcing winner-takes-all:

```typescript
// src/explorers/systems/InputController.test.ts
import { describe, it, expect, vi } from 'vitest';
import Phaser from 'phaser';
import { InputController } from './InputController';

describe('InputController virtual direction', () => {
  it('clears all directions when a new direction is pressed (no diagonals)', () => {
    const scene = makeMockScene();
    const ic = new InputController(scene);
    ic.setVirtualDirection('up', true);
    expect(ic.isUp()).toBe(true);
    ic.setVirtualDirection('left', true);
    expect(ic.isUp()).toBe(false);
    expect(ic.isLeft()).toBe(true);
  });

  it('consumes virtual interact pulse exactly once', () => {
    const scene = makeMockScene();
    const ic = new InputController(scene);
    ic.pulseVirtualInteract();
    expect(ic.isInteractJustPressed()).toBe(true);
    expect(ic.isInteractJustPressed()).toBe(false);
  });
});
```

(`makeMockScene()` will need to stub `scene.input.keyboard` enough for the constructor — check existing test patterns under `src/explorers/` for inspiration; if no test infra exists for Phaser scenes, skip the unit test.)

### Integration Tests

None planned. The integration is the game itself — manual smoke tests cover everything that matters.

### Manual Testing Steps

1. Open `npm run dev` → `http://localhost:3000/explorers`
2. Open Chrome DevTools, switch to device mode, pick "iPhone 14 Pro" (393×852)
3. Verify mobile bar is visible at the bottom and HUD is compact with hamburger
4. Walk astronaut around the map using the D-pad
5. Find an NPC, tap `E` → dialogue starts
6. Tap `SPC` repeatedly → dialogue advances; tap `ESC` → dialogue skips
7. Find the exam zone, tap `E` → exam appears, tap an answer option, tap "Następne →" button on the panel (still works because exam options are Phaser interactives)
8. Find an arcade zone for each of the three games, tap `E`, play through using the D-pad + SPC/ENT
9. Open the hamburger drawer, verify rank/XP/location render, tap terminal toggle, verify SmartTerminal opens full-screen
10. Type a command in the terminal, verify native keyboard appears
11. Switch DevTools to desktop mode (1280×720), verify mobile bar disappears, hamburger goes away, normal HUD returns, keyboard input works
12. Test on a real iPhone via Safari Web Inspector — pay particular attention to:
    - `pointercancel` when a notification banner appears mid-press
    - `pointerleave` when finger drags off a button
    - Safe-area-inset clearance below the bar (no buttons hidden behind home indicator)

## Performance Considerations

- The bar adds two `resize` listeners and a constant number of pointer event listeners (~10 buttons). Negligible.
- Phaser's `Scale.RESIZE` already triggers a re-layout when the bar appears/disappears; no extra work needed.
- No CSS transitions or animations on the bar — zero compositor overhead per press.
- Touch detection runs once on mount and on each resize, not per render or per Phaser tick.

## Migration Notes

- No data migration required.
- No new environment variables.
- No Cloudflare KV or Supabase changes.
- Backwards compatible: desktop users see no change. The new code paths are gated behind `$isTouchMode`.

## References

- Original research: `thoughts/shared/research/2026-04-09-mobile-friendly-game-controls.md`
- Input controller seam: `src/explorers/systems/InputController.ts:1-61`
- Astronaut movement consumer: `src/explorers/entities/Astronaut.ts:84-97`
- Public input controller getter: `src/explorers/scenes/GameScene.ts:552`
- Dialogue scene keyboard: `src/explorers/scenes/DialogueScene.ts:29-30,47-54`
- Exam options already tappable: `src/explorers/scenes/ExamScene.ts:239,273`
- Arcade renderers: `src/explorers/arcade/AsteroidRangeRenderer.ts:195-211`, `MemoryMatrixRenderer.ts:189-190,260-292`, `OscilloscopeRenderer.ts:266-267,282-329`
- Phaser flex layout: `src/explorers/PhaserGame.svelte:317-328`
- HUD: `src/explorers/GameHud.svelte:115-205`
- Terminal container: `src/explorers/PhaserGame.svelte:337`
- Phaser scale config: `src/explorers/config/gameConfig.ts:7-11`
- Camera resize logic: `src/explorers/scenes/GameScene.ts:291-315`
