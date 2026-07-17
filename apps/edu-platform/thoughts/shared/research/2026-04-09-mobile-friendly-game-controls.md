---
date: 2026-04-09T00:00:00+02:00
researcher: Claude (10x-research)
git_commit: 7bd2683b5600d1f45b2c2260f36d70467efbbdf9
branch: master
repository: przeprogramowani-sites
topic: "Mobile-friendly game controls for Space Explorers on small vertical screens"
tags: [research, mobile, game, controls, phaser, touch, input, space-explorers]
status: complete
last_updated: 2026-04-09
last_updated_by: Claude (10x-research)
last_updated_note: "Added follow-up decisions from user: D-pad, portrait+D-pad-below, native keyboard for terminal, pixel-art aesthetic, Svelte-side steering"
---

# Research: Mobile-Friendly Game Controls for Space Explorers

**Date**: 2026-04-09
**Researcher**: Claude (10x-research)
**Git Commit**: `7bd2683b5600d1f45b2c2260f36d70467efbbdf9`
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

What would be required to introduce mobile-friendly game controls for small vertical screens? Many users open link to Space Explorers from mobile (i.e. from emails) and the game view is not adjusted - only keyboard is supported, not buttons / gamepad simulator.

## Summary

The game currently has **zero mobile/touch input support**. All controls are keyboard-only, handled through a single `InputController` class and scattered per-scene key listeners. The game canvas scales responsively via `Phaser.Scale.RESIZE`, and the HUD is already flexbox-based, but there are no virtual buttons, no touch event handlers, and no mobile-aware layout logic anywhere.

Introducing mobile controls requires changes across **four layers**:
1. **Input layer** — extend `InputController` to accept virtual button state alongside keyboard
2. **UI layer** — add a `MobileControls.svelte` overlay with D-pad + action buttons
3. **Scene layer** — feed `SPACE` and `ESC` analogs into scene-level key listeners (DialogueScene, ExamScene, ArcadeScene)
4. **Layout/detection layer** — detect touch devices and show/hide the overlay appropriately

---

## Detailed Findings

### Current Input Architecture

**InputController** (`src/explorers/systems/InputController.ts`) is the central hub for movement:
- Lines 1–61: keyboard-only; reads Phaser cursor keys + WASD + E / Space / ESC
- All four movement query methods (`isUp`, `isDown`, `isLeft`, `isRight`) poll Phaser `Key.isDown`
- `isInteractJustPressed()`, `isSpaceJustPressed()`, `isEscJustPressed()` use `Phaser.Input.Keyboard.JustDown`
- `setEnabled(bool)` disables/re-enables the controller during dialogue and transitions

**Movement consumer** — `Astronaut.ts` calls `inputCtrl.isLeft()` etc. directly in its `update()` loop (lines 84–97). Velocity is applied per-frame, so a virtual button needs only to hold `isDown = true` while pressed.

**Scene-level key listeners not routed through InputController:**
- `DialogueScene.ts` lines 29–30, 43–54: Space + ESC registered directly on `this.input.keyboard`
- `ExamScene.ts` lines 67–69, 281–299: ESC + number keys 1–9 + Enter registered directly
- `ArcadeScene.ts` arcade renderers (`AsteroidRangeRenderer`, `MemoryMatrixRenderer`, `OscilloscopeRenderer`): WASD + Space + Enter registered directly on scene keyboard

This means a mobile solution must patch **both** `InputController` (movement + E) **and** inject synthetic events or callbacks into the scene-level listeners.

### Current Canvas & Layout

- **Phaser config** (`config/gameConfig.ts` lines 7–11): `Scale.RESIZE`, `width: '100%'`, `height: '100%'` — canvas already fills the container
- **PhaserGame.svelte** (lines 317–328): flex column, HUD bar = fixed 56 px, game canvas = `flex-1 min-h-0`
- **CSS override** (lines 355–359): canvas forced to `width/height: 100% !important`
- **GameLayout.astro**: `overflow-hidden`, `w-screen h-screen`, viewport meta `width=device-width, initial-scale=1.0` — already mobile-safe at the HTML level
- **Camera zoom** (`GameScene.ts` lines 291–305): dynamic zoom with `scale.on('resize')` listener — zoom recalculates correctly when mobile controls shrink available height

No existing mobile breakpoints, no `navigator.maxTouchPoints` detection, no `pointer`/`touchstart` events anywhere.

### HUD and Overlay Layers

HUD (`GameHud.svelte`, 48 px height):
- Flexbox with three sections (left logo, center XP/rank, right buttons)
- `pointer-events: none` on container, explicit `pointer-events: auto` on interactive children
- Works well on mobile widths; no overflow issues found

Overlays sit in `PhaserGame.svelte` as Svelte siblings to the canvas:
- `SmartTerminal` — fixed 540 px width (would overflow on mobile portrait)
- `PreviewOverlay` — uses `inset-4` so it's already viewport-safe
- `GrantNotification` — fixed `bottom/right 20px`, 280 px wide — marginal on small screens

### Phaser Touch Support

Phaser 3 natively supports pointer/touch events through `this.input.on('pointerdown', ...)`. No plugin is needed for basic touch. For a virtual joystick, **`phaser3-rex-plugins`** provides a `VirtualJoystick` plugin, but a custom D-pad with simple pointer listeners is lighter and sufficient here.

---

## Required Changes

### 1. `InputController` — add virtual input state

Extend the class to accept boolean flags from a Svelte store or callback:

```typescript
// New fields
private virtualButtons = { up: false, down: false, left: false, right: false, interact: false };

setVirtualButton(btn: keyof typeof this.virtualButtons, value: boolean) {
  this.virtualButtons[btn] = value;
}

isUp()    { return this.keys.up.isDown    || this.virtualButtons.up; }
isLeft()  { return this.keys.left.isDown  || this.virtualButtons.left; }
// … etc.
isInteractJustPressed() {
  const kb = Phaser.Input.Keyboard.JustDown(this.interactKey);
  const virtual = this.virtualInteractPulse; // one-frame pulse
  this.virtualInteractPulse = false;
  return kb || virtual;
}
```

Reference: `src/explorers/systems/InputController.ts:1–61`

### 2. `MobileControls.svelte` — virtual D-pad + action buttons

A new Svelte overlay component placed inside `PhaserGame.svelte` between the canvas and the existing overlays. Structure:

```
[D-pad: up/down/left/right touch areas]   [right side: E (Interact), SPACE (Advance), ESC (Skip)]
```

Wiring:
- Each button fires `onpointerdown` → `inputController.setVirtualButton('up', true)` and `onpointerup` → `false`
- Access to `inputController` via the Svelte prop or `game.registry`
- Only rendered when `isTouchDevice()` returns true (`navigator.maxTouchPoints > 0`)

Positioning: `position: fixed; bottom: 0; left: 0; right: 0; height: ~160px` — below canvas. Canvas area needs to shrink accordingly (PhaserGame.svelte flex layout handles this if mobile controls live inside the flex column).

### 3. Scene-level listeners — SPACE / ESC / numbers

`DialogueScene`, `ExamScene`, and the arcade renderers have direct keyboard listeners that bypass `InputController`. Options:

**Option A (preferred):** Expose event emitter methods on a global `GameEventBus` that Svelte buttons can call:
```typescript
// DialogueScene.ts — replace keydown listener with:
this.events.on('virtual-space', () => { /* advance */ });
this.events.on('virtual-esc',   () => { /* skip */ });
```
Mobile buttons emit `game.scene.getScene('DialogueScene').events.emit('virtual-space')`.

**Option B:** Synthesize a `KeyboardEvent` and dispatch on `window` — simpler, slightly hacky but works with Phaser's event system.

For exam number keys on mobile: render the answer options as tappable DOM elements (ExamScene already renders a Svelte/DOM exam overlay via `EXAM_SHOW` event → `ExamScene.ts`). Tap = number key equivalent. This requires no synthetic events.

### 4. Arcade mini-game controls on mobile

Each arcade renderer (`AsteroidRangeRenderer`, `MemoryMatrixRenderer`, `OscilloscopeRenderer`) registers its own WASD/Space/Enter handlers. Each needs to accept either:
- Virtual button callbacks (same pattern as InputController), or
- A touch/pointer overlay rendered by the ArcadeScene during active gameplay

Asteroid Range's crosshair tracking is continuous (WASD held down); D-pad hold events map naturally. Memory Matrix and Oscilloscope use discrete key presses (move cursor, select, submit); tap buttons suffice.

### 5. SmartTerminal width on mobile

`SmartTerminal.svelte` is fixed at 540 px width — it overflows on phones. Add `max-w-[calc(100vw-16px)]` or switch to a drawer/bottom-sheet on mobile.

### 6. Layout height budget on vertical screens

Portrait 390×844 (iPhone 14):
- HUD: 56 px
- Mobile controls overlay: ~160 px
- Remaining canvas: ~628 px

At that canvas height Phaser's dynamic zoom (`GameScene.ts` lines 291–305) will auto-zoom in on the map, which is acceptable. Camera deadzone constants (`CAMERA_DEADZONE_X/Y`) may need slight reduction on very small canvases to keep the player visible.

---

## Code References

- `src/explorers/systems/InputController.ts:1–61` — keyboard-only input hub, central modification target
- `src/explorers/entities/Astronaut.ts:84–97` — movement update loop, calls InputController methods
- `src/explorers/scenes/GameScene.ts:219` — InputController instantiation
- `src/explorers/scenes/GameScene.ts:222–224` — input disabled on terminal focus
- `src/explorers/scenes/GameScene.ts:291–315` — camera zoom + resize listener
- `src/explorers/scenes/DialogueScene.ts:29–30,43–54` — Space/ESC listeners outside InputController
- `src/explorers/scenes/ExamScene.ts:67–69,281–299` — ESC + number key listeners outside InputController
- `src/explorers/arcade/AsteroidRangeRenderer.ts:195–211` — WASD + Space in arcade context
- `src/explorers/arcade/MemoryMatrixRenderer.ts:190,260–292` — WASD + Space + Enter in arcade
- `src/explorers/arcade/OscilloscopeRenderer.ts:267,282–329` — WASD + Enter in arcade
- `src/explorers/PhaserGame.svelte:317–328` — flex layout (canvas + HUD)
- `src/explorers/PhaserGame.svelte:355–359` — canvas CSS override
- `src/explorers/config/gameConfig.ts:7–11` — Phaser Scale.RESIZE config
- `src/layouts/GameLayout.astro:1–16` — viewport meta, overflow-hidden body
- `src/explorers/GameHud.svelte:207–407` — HUD layout (already flexbox-responsive)

---

## Architecture Insights

1. **InputController is the right seam** for movement virtualization. It's already used as a clean abstraction by `Astronaut.ts`; adding virtual boolean flags is a minimal, non-breaking change.

2. **Scene-level key listeners are the main friction point.** Because DialogueScene, ExamScene, and arcade renderers bypass InputController and register directly on `scene.input.keyboard`, they need separate wiring. Using Phaser scene events (`scene.events.emit`) is the cleanest bridge between Svelte and Phaser scenes.

3. **Canvas scaling is already mobile-ready** (`Scale.RESIZE`). The game will render correctly at portrait dimensions; no Phaser config changes required.

4. **Overlay placement** — the flex column layout in `PhaserGame.svelte` means a bottom-mounted mobile controls div will naturally push the canvas up, triggering the resize listener and recalculating zoom. No manual height arithmetic needed.

5. **Touch detection** — use `'ontouchstart' in window || navigator.maxTouchPoints > 0` in `PhaserGame.svelte` `onMount` to conditionally render `<MobileControls>`. This avoids showing the overlay on desktop browsers.

---

## Estimated Scope

| Area | Files to Change | Complexity |
|------|----------------|------------|
| InputController virtual flags | `InputController.ts` | Low |
| MobileControls.svelte (new) | New file | Medium |
| PhaserGame.svelte integration | `PhaserGame.svelte` | Low |
| DialogueScene virtual events | `DialogueScene.ts` | Low |
| ExamScene — tap = number key | `ExamScene.ts` (if needed) | Low |
| Arcade renderers | 3 renderer files | Medium |
| SmartTerminal mobile width | `SmartTerminal.svelte` | Low |
| Camera deadzone tuning | `GameScene.ts` / `constants.ts` | Low |

Total: ~8–10 files changed, 1 new file. No Phaser plugin required.

---

## Follow-up Research 2026-04-09 — Design Decisions

The following decisions were provided by the user and resolve the open questions.

### Resolved Decisions

| # | Topic | Decision |
|---|-------|----------|
| 1 | D-pad vs joystick | **D-pad** — 4 discrete direction buttons |
| 2 | Exam on mobile | **Keep number keys 1/2/3/4** — render as tappable buttons that emit the same events |
| 3 | Terminal on mobile | **Native keyboard** — acceptable UX; no changes needed |
| 4 | Orientation | **Portrait with D-pad below canvas** — no landscape lock |
| 5 | Aesthetic | **Pixel-art aesthetic** — controls must match the game's visual style |
| 6 | D-pad implementation side | **Svelte (outside Phaser canvas)** — preferred if it simplifies wiring |

---

### Revised Architecture Based on Decisions

#### D-pad as a Svelte component (not Phaser canvas)

Implementing the D-pad entirely in Svelte DOM is **the correct call**:
- Svelte handles `pointerdown`/`pointerup`/`pointercancel` natively; no Phaser touch plumbing needed
- The D-pad sits in the flex column **below** the canvas as a sibling div — Phaser's `scale.on('resize')` picks up the reduced canvas height automatically
- `InputController` is accessed via `game.registry.get('inputController')` or a direct Svelte prop passed down from `PhaserGame.svelte`
- No changes to the Phaser game loop or scene files for movement

The revised `PhaserGame.svelte` layout becomes:
```
[HUD bar — 56 px]
[Phaser canvas — flex-1]
[MobileControls.svelte — fixed ~140 px, only on touch devices]
```

#### D-pad pixel-art aesthetic

The D-pad must feel like part of the game UI, not a generic OS overlay. Approach:
- Use the same color palette as the HUD: `#0a0e2a` background, `rgba(0,212,170,0.15)` borders, `#00d4aa` accent
- Buttons are square pixel-art tiles, drawn with CSS `box-shadow` inset border trick or SVG icons matching the game's monospace/blocky style
- Arrow glyphs: use Unicode block characters (`▲ ▼ ◀ ▶`) or custom SVG arrows at 1px-aliased size with `image-rendering: pixelated`
- Active/pressed state: background flips to `#00d4aa20`, border brightens — no smooth transitions (pixel-art feel = instant state change, no CSS `transition`)
- Font: JetBrains Mono (already loaded by HUD) for any button labels

#### Exam tap buttons — number keys 1/2/3/4

The ExamScene Svelte overlay already renders answer options. The change is:
- Each answer option element gets `pointer-events: auto` and an `onclick` handler that calls the existing `numKeyHandler` logic with the correct number
- No synthetic keyboard events needed — just call the same handler function directly
- On mobile, options should be rendered with `min-height: 56px` and `touch-action: manipulation` to avoid 300ms tap delay

#### Portrait height budget (revised with D-pad)

Portrait 390×844 (iPhone 14):
- HUD: 56 px
- Phaser canvas: `flex-1` ≈ 648 px (844 − 56 − 140)
- D-pad bar: 140 px

Portrait 375×667 (iPhone SE):
- HUD: 56 px
- Phaser canvas: ≈ 471 px (667 − 56 − 140)
- D-pad bar: 140 px

At 471 px canvas height the dynamic zoom will zoom in further on the map — acceptable given the camera deadzone. Consider reducing `CAMERA_DEADZONE_Y` from `TILE_SIZE * 1.5` (96 px) to `TILE_SIZE * 1.0` (64 px) to prevent the player from hitting the deadzone edge too quickly on short canvases.

#### D-pad layout (portrait)

Left cluster — D-pad:
```
       [▲]
  [◀]  [·]  [▶]        (center dot = visual only, no action)
       [▼]
```

Right cluster — actions:
```
  [E]   (interact / talk)
  [SPC] (advance dialogue)
  [ESC] (skip / cancel)
```

All buttons: ~48×48 px touch targets (Apple HIG minimum), pixel-art styled.

#### SmartTerminal on mobile (native keyboard flow)

Since native keyboard is acceptable:
- Only fix: add `max-w-[calc(100vw-16px)]` to the terminal container to prevent horizontal overflow on portrait phones
- Terminal auto-focuses the input → native keyboard opens → terminal floats as a fixed overlay → D-pad is behind the keyboard but irrelevant while terminal is open

No other terminal changes needed.

---

### Final Scope Table (updated)

| Area | Files to Change | Complexity | Notes |
|------|----------------|------------|-------|
| `InputController.ts` — virtual flags | `InputController.ts` | Low | Add `virtualButtons` map + setters |
| `MobileControls.svelte` (new) | New file | Medium | D-pad + action buttons, pixel-art style |
| `PhaserGame.svelte` — mount + touch detect | `PhaserGame.svelte` | Low | Conditional render, pass `inputController` ref |
| `DialogueScene.ts` — virtual Space/ESC | `DialogueScene.ts` | Low | Add `scene.events.on('virtual-space/esc')` |
| `ExamScene` — tap answer options | `ExamScene.ts` + exam Svelte overlay | Low | onClick → numKeyHandler, touch sizing |
| Arcade renderers — virtual WASD | `AsteroidRangeRenderer.ts`, `MemoryMatrixRenderer.ts`, `OscilloscopeRenderer.ts` | Medium | Same virtual flag pattern |
| `SmartTerminal.svelte` — mobile width | `SmartTerminal.svelte` | Low | `max-w-[calc(100vw-16px)]` |
| `constants.ts` — camera deadzone | `constants.ts` | Low | Reduce `CAMERA_DEADZONE_Y` for small canvases |

Total: **8 files changed, 1 new file. No Phaser plugin required.**

---

## Open Questions

1. **Performance**: Phaser WebGL on mobile Safari has known quirks. Should a Canvas fallback be explicitly tested / forced on iOS? (`Phaser.AUTO` already falls back to Canvas if WebGL fails, so this may be a non-issue.)

2. **Arcade renderers on mobile**: Asteroid Range uses continuous WASD hold for crosshair movement. D-pad hold maps naturally. But on very small screens the canvas+crosshair may be hard to use — consider if a "tap to aim" pointer alternative is worth adding later.
