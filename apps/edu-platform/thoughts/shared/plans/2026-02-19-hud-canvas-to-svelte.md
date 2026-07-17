# Move HUD from Phaser Canvas to Svelte — Implementation Plan

## Overview

Move the game HUD (rank/level, XP bar, location, terminal hotkey hint) from a Phaser canvas scene (`HudScene.ts`) to a Svelte overlay component. This solves high-DPI rendering issues caused by `pixelArt: true` + `roundPixels: true` degrading text rendering, and gives us native DOM text rendering for crisp UI at any resolution.

## Current State Analysis

- **HudScene.ts** renders text + rectangles inside the Phaser canvas using `Phaser.GameObjects.Text` and `Phaser.GameObjects.Rectangle`
- Game config has `pixelArt: true` + `roundPixels: true` — great for sprites, but makes UI text blurry/pixelated on high-DPI displays
- Two Svelte overlays already exist (`SmartTerminal.svelte`, `QaOverlay.svelte`) using the established pattern: receive `game` prop, listen to `game.events`, read from `game.registry`
- HudScene is registered in `BootScene.ts:34`, launched from `PreloaderScene.ts:89`

### Key Discoveries

- HudScene listens to 3 events: `SCENE_ENTERED`, `XP_GAINED`, `STATE_CHANGED` (see `src/explorers/scenes/HudScene.ts:101-116`)
- XP bar animation uses Phaser tween (300ms fill + 600ms yellow text flash) — will be replaced with Svelte transitions
- HUD handles resize via `this.scale.on('resize')` — DOM handles this natively with flexbox/percentage widths
- All HUD elements use `setScrollFactor(0)` to stay fixed — DOM positioning handles this automatically
- The `SceneKey.HUD` entry and `HudScene` class can be fully removed after migration

## Desired End State

A `GameHud.svelte` component rendered inside `PhaserGame.svelte`, positioned at the top of the viewport as an absolutely positioned overlay. It:

1. Renders crisp text at any DPI using native DOM rendering
2. Shows rank/level, XP bar with animated fill, location name, and terminal hotkey hint
3. Reacts to the same game events as the old HudScene
4. Uses Svelte transitions for XP gain animations
5. Fully replaces `HudScene.ts` (no dead code left)

### Verification

- All HUD info (rank, XP, location, hotkey hint) visible and crisp on high-DPI displays
- XP bar animates on XP gain events
- Location name updates on scene transitions
- No Phaser console errors about missing HudScene
- Terminal hotkey hint still works
- `HudScene.ts` and all references are removed

## What We're NOT Doing

- Not changing the game state management system or event bus
- Not modifying other Phaser scenes (GameScene, DialogueScene, etc.)
- Not adding new HUD features beyond what exists
- Not changing the terminal shortcut or its behavior
- Not touching the SmartTerminal or QaOverlay components

## Implementation Approach

Follow the established Svelte overlay pattern (SmartTerminal/QaOverlay) to create a new `GameHud.svelte` component. Wire it to the same Phaser events the HudScene used. Then remove the Phaser scene and all references.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- The HUD component renders conditionally inside `{#if game && gameReady}` — same guard as other overlays
- Initial state (XP, location) must be read from `game.registry.get('demoGameState')` on mount
- Event listeners attach in `onMount`, detach in `onDestroy` — matching the pattern in `QaOverlay.svelte`
- The `SCENE_ENTERED` event fires after map load in GameScene — the HUD may mount before any scene is entered, so it should handle empty location gracefully

### User Experience Specification

- **Visual**: Polished redesign — improved typography, spacing, and visual clarity using proper CSS while keeping the same sci-fi/terminal aesthetic (monospace, teal accents, dark background)
- **Layout**: Full-width top bar, ~40px height, with left/center/right sections using flexbox
- **XP bar animation**: Svelte `tweened` store for smooth width transition + CSS class toggle for yellow flash on XP gain
- **Responsiveness**: Flexbox handles resize natively — no manual resize handler needed
- **Text rendering**: Native DOM text → crisp at any DPI, including Retina/4K

### Performance & Optimization Strategy

- Use Svelte reactive declarations (`$:`) for derived values (XP percentage, display strings)
- Use `tweened` from `svelte/motion` for XP bar width — provides smooth easing similar to Phaser's Power2
- Event listener count identical to before (3 events) — no performance regression
- No polling needed — all updates are event-driven

### State Management Sequencing

- **Read**: `game.registry.get('demoGameState')` for initial values on mount
- **Listen**: `game.events.on(GameEvents.*)` for updates
- **No writes**: HUD is read-only — it never modifies game state

### Debug & Observability Plan

- `devLog('[GameHud] mounted')` on mount, matching existing pattern
- Browser DevTools can inspect the DOM directly (unlike canvas elements)
- QaOverlay continues to work alongside the new Svelte HUD

## Phase 1: Create GameHud.svelte Component

### Overview

Create the Svelte HUD component with polished styling and wire it to game events.

### Changes Required

#### 1. New file: `src/explorers/GameHud.svelte`

**File**: `src/explorers/GameHud.svelte`
**Changes**: Create new Svelte component

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import Phaser from 'phaser';
  import { GameEvents } from './events/GameEvents';
  import type { SceneEnteredPayload, XpGainedPayload, StateChangedPayload } from './events/GameEvents';
  import type { DemoGameState } from './state/types';
  import { devLog } from './utils/logger';

  export let game: Phaser.Game;

  const XP_MAX = 100;

  let location = '';
  let xp = 0;
  let xpFlash = false;

  const xpWidth = tweened(0, { duration: 300, easing: cubicOut });

  function onSceneEntered(payload: SceneEnteredPayload) {
    location = payload.displayName;
  }

  function onXpGained(payload: XpGainedPayload) {
    xp = payload.total;
    xpWidth.set(Math.min((payload.total / XP_MAX) * 100, 100));

    // Flash effect
    xpFlash = true;
    setTimeout(() => { xpFlash = false; }, 600);
  }

  function onStateChanged(payload: StateChangedPayload) {
    xp = payload.state.xp;
    // Update bar without animation on state sync
    xpWidth.set(Math.min((payload.state.xp / XP_MAX) * 100, 100), { duration: 0 });
  }

  onMount(() => {
    devLog('[GameHud] mounted');

    // Read initial state
    const state = game.registry.get('demoGameState') as DemoGameState | undefined;
    if (state) {
      xp = state.xp;
      xpWidth.set(Math.min((state.xp / XP_MAX) * 100, 100), { duration: 0 });
    }

    game.events.on(GameEvents.SCENE_ENTERED, onSceneEntered);
    game.events.on(GameEvents.XP_GAINED, onXpGained);
    game.events.on(GameEvents.STATE_CHANGED, onStateChanged);
  });

  onDestroy(() => {
    game.events.off(GameEvents.SCENE_ENTERED, onSceneEntered);
    game.events.off(GameEvents.XP_GAINED, onXpGained);
    game.events.off(GameEvents.STATE_CHANGED, onStateChanged);
  });
</script>

<div class="hud">
  <!-- Rank / Level -->
  <div class="hud-left">
    <span class="rank">★ Kadet</span>
    <span class="level">Lv.1</span>
  </div>

  <!-- XP Bar -->
  <div class="hud-center">
    <div class="xp-bar-bg">
      <div class="xp-bar-fill" style="width: {$xpWidth}%" />
    </div>
    <span class="xp-text" class:xp-flash={xpFlash}>{xp}/{XP_MAX} XP</span>
  </div>

  <!-- Location + Hotkey -->
  <div class="hud-right">
    {#if location}
      <span class="location">{location}</span>
    {/if}
    <span class="hotkey">
      <kbd>Ctrl</kbd>+<kbd>`</kbd> Terminal
    </span>
  </div>
</div>

<style>
  .hud {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    color: #e0e0e0;
    z-index: 40;
    pointer-events: none;
    user-select: none;
  }

  .hud-left, .hud-center, .hud-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hud-left { flex: 0 0 auto; }
  .hud-center { flex: 1 1 auto; justify-content: center; }
  .hud-right { flex: 0 0 auto; }

  .rank {
    color: #00d4aa;
    font-weight: 600;
  }

  .level {
    color: #00d4aa;
    opacity: 0.7;
  }

  .xp-bar-bg {
    width: 120px;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .xp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d4aa, #00e4bb);
    border-radius: 4px;
    transition: none; /* tweened store handles animation */
  }

  .xp-text {
    font-size: 11px;
    color: #a0a0a0;
    transition: color 0.15s ease;
  }

  .xp-flash {
    color: #ffb347;
    text-shadow: 0 0 6px rgba(255, 179, 71, 0.4);
  }

  .location {
    color: #666;
    font-size: 11px;
  }

  .hotkey {
    color: #00d4aa;
    font-size: 11px;
    opacity: 0.8;
  }

  kbd {
    display: inline-block;
    padding: 1px 4px;
    font-size: 10px;
    font-family: inherit;
    color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
    border: 1px solid rgba(0, 212, 170, 0.25);
    border-radius: 3px;
  }
</style>
```

#### 2. Mount GameHud in PhaserGame.svelte

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Import and render `GameHud` alongside other overlays

- Add import: `import GameHud from './GameHud.svelte';`
- Add `<GameHud {game} />` inside the `{#if game && gameReady}` block, before the terminal overlay

```svelte
{#if game && gameReady}
    <GameHud {game} />

    {#if terminalOpen}
      <!-- existing terminal code -->
    {/if}

    {#if qaMode}
      <QaOverlay {game} />
    {/if}
{/if}
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npx astro check` (or `npm run build`)
- [x] No lint errors: `npm run lint`
- [x] Existing tests pass: `npm run test`

#### Manual Verification

- [ ] HUD displays at top of screen with rank, XP bar, location, hotkey hint
- [ ] Text is crisp on high-DPI displays (compare before/after)
- [ ] XP bar animates smoothly on XP gain
- [ ] XP text flashes amber on XP gain
- [ ] Location updates when transitioning between maps
- [ ] Terminal hotkey hint is visible and the shortcut works
- [ ] HUD does not interfere with game input (pointer-events: none)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Phase 2: Remove HudScene from Phaser

### Overview

Delete the Phaser HudScene and clean up all references.

### Changes Required

#### 1. Delete HudScene.ts

**File**: `src/explorers/scenes/HudScene.ts`
**Changes**: Delete file entirely

#### 2. Remove from BootScene

**File**: `src/explorers/scenes/BootScene.ts`
**Changes**: Remove HudScene import and scene registration

- Remove: `import { HudScene } from './HudScene';` (line 7)
- Remove: `this.scene.add(SceneKey.HUD, HudScene, false);` (line 34)

#### 3. Remove HUD launch from PreloaderScene

**File**: `src/explorers/scenes/PreloaderScene.ts`
**Changes**: Remove HUD scene launch

- Remove: `this.scene.launch(SceneKey.HUD);` (line 89)

#### 4. Remove from sceneRegistry

**File**: `src/explorers/config/sceneRegistry.ts`
**Changes**: Remove HUD entry

- Remove: `HUD: 'HudScene',` (line 5)

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles with no errors referencing HudScene
- [x] No lint errors
- [x] All tests pass
- [x] No remaining references to HudScene or SceneKey.HUD in codebase (grep check)

#### Manual Verification

- [ ] Game launches without errors in browser console
- [ ] Svelte HUD from Phase 1 still works correctly
- [ ] No visual regression in gameplay (sprites, dialogue, transitions unaffected)

---

## Testing Strategy

### Unit Tests

- No new unit tests needed — the HUD is a thin reactive display layer with no business logic

### Manual Testing Steps

1. Load the game at `/explorers` on a high-DPI display
2. Verify all HUD text is sharp (compare with a screenshot of the old canvas HUD)
3. Complete a quest or trigger XP gain — verify bar animation and amber flash
4. Walk through a door to change maps — verify location text updates
5. Press Ctrl+` — verify terminal opens and HUD remains visible
6. Resize the browser window — verify HUD stays properly positioned
7. Open with `?qa` param — verify QaOverlay and HUD coexist
8. Check browser console — no errors about missing scenes

## Performance Considerations

- DOM overlay adds negligible overhead (a single `<div>` with children)
- Event listener count unchanged (3 events)
- `tweened` store uses `requestAnimationFrame` — efficient and battery-friendly
- Removing HudScene reduces Phaser's scene count by 1, slightly reducing per-frame overhead

## References

- Existing overlay pattern: `src/explorers/SmartTerminal.svelte`, `src/explorers/QaOverlay.svelte`
- Game events: `src/explorers/events/GameEvents.ts`
- Game state type: `src/explorers/state/types.ts`
- Game config: `src/explorers/config/gameConfig.ts`
