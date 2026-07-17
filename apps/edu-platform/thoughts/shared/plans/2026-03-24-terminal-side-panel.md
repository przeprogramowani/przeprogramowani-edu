# Terminal Side Panel Layout Implementation Plan

## Overview

Convert SmartTerminal from a floating overlay to a persistent side panel displayed next to the game canvas. Add a draggable vertical divider between the game scene and terminal, allowing the user to resize the terminal width within 20%-40% of the viewport. The terminal appears only after unlock (`terminal-found` flag) and cannot be collapsed once visible.

## Current State Analysis

- **Terminal**: Mounted as a fixed overlay (`fixed top-3 right-3 bottom-3 w-[540px] z-20`) with a semi-transparent backdrop (`z-10`), toggled via `terminalOpen` boolean in `PhaserGame.svelte:332-342`
- **Game canvas**: Fills `flex-1` space below the 56px HUD in a vertical flex layout (`PhaserGame.svelte:328`)
- **Phaser config**: Uses `Scale.RESIZE` mode — canvas auto-adjusts to its container size (`gameConfig.ts:9`)
- **Toggle mechanism**: `Ctrl+\`` hotkey and HUD button toggle `terminalOpen`, emitting `TERMINAL_FOCUS_CHANGED` to disable/enable player input (`PhaserGame.svelte:72-91`)
- **Input gating**: `GameScene.ts:219-223` disables `InputController` when terminal is focused

### Key Discoveries:

- Phaser `Scale.RESIZE` will automatically adapt when the canvas container width changes — no manual resize calls needed
- `SmartTerminal.svelte` stops keyboard propagation to Phaser (`line 156-160`) — this prevents player movement while typing
- The terminal currently mounts/unmounts on toggle — switching to always-mounted (after unlock) simplifies state management
- `TERMINAL_FOCUS_CHANGED` event is used to disable game input — we'll repurpose this to track focus within the always-visible terminal

## Desired End State

After implementation:
1. Below the HUD, the layout is a horizontal flex row: `[Game Canvas] | [Divider] | [Terminal]`
2. Terminal panel occupies 20%-40% of the viewport width (default ~30%)
3. A vertical drag handle between canvas and terminal allows resizing
4. Terminal appears only after `terminal-found` flag is set; before that, game canvas is 100% width
5. Once visible, terminal cannot be hidden
6. Phaser canvas auto-resizes to fill remaining space
7. Keyboard input in terminal doesn't affect game; clicking the game area restores game input focus

### Verification:
- Game canvas resizes fluidly when dragging the divider
- Terminal remains functional at min (20%) and max (40%) widths
- Phaser camera/rendering adapts correctly to canvas resize
- Player input works when clicking game area, terminal input works when clicking terminal

## What We're NOT Doing

- No terminal collapse/hide functionality after unlock
- No mobile/responsive breakpoint handling (game is desktop-only)
- No persisting divider position to game state (resets to default on reload)
- No animation/transition on terminal appearance (instant mount)
- No changes to terminal internal functionality or commands

## Implementation Approach

Replace the overlay-based terminal rendering with a horizontal flex layout. Create a new `ResizeDivider.svelte` component for the drag handle. Modify `PhaserGame.svelte` layout from vertical-only flex to a nested structure: vertical (HUD + content area) → horizontal (canvas + divider + terminal). Repurpose input focus handling so terminal focus is managed by click/focus events rather than open/close toggle.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Phaser resize**: `Scale.RESIZE` mode listens to the parent container's size via ResizeObserver internally. When the flex container width changes during drag, Phaser will auto-resize within a frame or two.
- **Drag performance**: Use `pointermove` on `window` (not the divider element) during drag to avoid losing the cursor. Use `requestAnimationFrame` throttling to prevent layout thrashing during rapid drags.
- **Terminal mount timing**: Terminal mounts once when `terminal-found` flag is detected via `STATE_CHANGED` event — same reactive check as current `terminalOpen` but driven by game state instead of toggle.

### User Experience Specification

- **Divider visual**: 6px wide bar with `bg-gray-800` default, `bg-teal-600` on hover/drag, `cursor-col-resize`
- **Drag behavior**: Pointer down on divider starts drag; pointer up anywhere stops. Terminal width updates in real-time during drag.
- **Width constraints**: Clamp terminal width between 20% and 40% of viewport. Default: 30%.
- **Focus model**: Clicking inside terminal panel sets `terminalFocused=true` (disables game input). Clicking the game canvas or pressing Escape sets `terminalFocused=false` (re-enables game input). The `Ctrl+\`` hotkey toggles focus between game and terminal.

### Performance & Optimization Strategy

- **Drag throttling**: Wrap drag handler in `requestAnimationFrame` to limit reflows to one per frame
- **CSS-driven resize**: Use flex-basis percentage on the terminal panel rather than absolute pixels — the browser handles layout efficiently
- **No re-mount**: Terminal stays mounted after unlock; only the outer container visibility changes

### State Management Sequencing

- **Terminal visibility**: Derived reactively from `gameState.flags.includes('terminal-found')` — no separate `terminalOpen` boolean needed for the panel itself
- **Focus state**: New `terminalFocused` boolean replaces `terminalOpen` for input gating. `TERMINAL_FOCUS_CHANGED` event payload remains the same.
- **Divider state**: Local `terminalWidthPct` variable (not persisted), default 30, clamped to [20, 40]

### Debug & Observability Plan

- **Verification**: Drag the divider and observe Phaser canvas resize in real-time. Check that tile rendering and camera follow remain correct.
- **Edge cases**: Resize to min/max bounds and verify clamping. Rapidly drag back and forth to verify no layout jank.

---

## Phase 1: Layout Restructure & Divider Component

### Overview

Change `PhaserGame.svelte` layout from overlay-based terminal to side-by-side flex layout with a draggable divider.

### Changes Required:

#### 1. New Component: `ResizeDivider.svelte`

**File**: `src/explorers/ResizeDivider.svelte`
**Purpose**: Draggable vertical bar that emits width changes

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ resize: { widthPct: number } }>();

  export let minPct = 20;
  export let maxPct = 40;

  let dragging = false;

  function onPointerDown(e: PointerEvent) {
    e.preventDefault();
    dragging = true;
    let rafId: number | null = null;

    function onMove(ev: PointerEvent) {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const vw = window.innerWidth;
        const fromRight = vw - ev.clientX;
        let pct = (fromRight / vw) * 100;
        pct = Math.max(minPct, Math.min(maxPct, pct));
        dispatch('resize', { widthPct: pct });
      });
    }

    function onUp() {
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (rafId !== null) cancelAnimationFrame(rafId);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="w-1.5 cursor-col-resize select-none flex-shrink-0 transition-colors duration-150"
  class:bg-teal-600={dragging}
  class:bg-gray-800={!dragging}
  class:hover:bg-teal-700={!dragging}
  on:pointerdown={onPointerDown}
></div>
```

#### 2. Modify `PhaserGame.svelte` Layout

**File**: `src/explorers/PhaserGame.svelte`

**Changes**:

a) Replace `terminalOpen` with `terminalFocused` for input gating. Derive terminal visibility from game state:

```typescript
// Replace terminalOpen with:
let terminalFocused = false;
// Terminal panel visibility is derived from state
$: terminalVisible = gameReady && gameState?.flags.includes('terminal-found');
```

b) Replace `openTerminal`/`closeTerminal`/`toggleTerminal` with focus management:

```typescript
function focusTerminal() {
  if (!terminalVisible) return;
  terminalFocused = true;
  game?.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: true });
}

function unfocusTerminal() {
  terminalFocused = false;
  game?.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: false });
  (document.activeElement as HTMLElement)?.blur();
}

function toggleTerminalFocus() {
  if (terminalFocused) unfocusTerminal();
  else focusTerminal();
}
```

c) Add terminal width state:

```typescript
let terminalWidthPct = 30;
function handleResize(e: CustomEvent<{ widthPct: number }>) {
  terminalWidthPct = e.detail.widthPct;
}
```

d) Add `gameState` reactive variable (needs to be set on STATE_CHANGED):

```typescript
let gameState: GameState | null = null;
// In the STATE_CHANGED handler, add:
game.events.on(GameEvents.STATE_CHANGED, ({ state }: StateChangedPayload) => {
  gameState = state;
  debouncedServerSave(state);
});
```

e) Replace the template (lines 315-352) with the new layout:

```svelte
<div
  class="flex flex-col w-full h-full transition-opacity duration-300"
  class:opacity-0={!settled}>
  <!-- HUD topbar -->
  <div style="flex: 0 0 56px;">
    {#if game && gameReady}
      <GameHud {game} {userEmail} terminalOpen={terminalFocused} onToggleTerminal={toggleTerminalFocus} />
    {/if}
  </div>

  <!-- Content area: Game + optional Terminal side-by-side -->
  <div class="flex flex-1 min-h-0">
    <!-- Game canvas — fills remaining space -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      bind:this={container}
      class="flex-1 min-h-0 min-w-0"
      on:click={unfocusTerminal}></div>

    {#if game && gameReady && terminalVisible}
      <ResizeDivider on:resize={handleResize} />

      <!-- Terminal panel -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="min-h-0 border-l border-teal-800/60 bg-gray-950"
        style="flex: 0 0 {terminalWidthPct}%;"
        on:click={focusTerminal}>
        <SmartTerminal {game} {userEmail} />
      </div>
    {/if}
  </div>

  <!-- Non-terminal overlays -->
  {#if game && gameReady}
    <PreviewOverlay {game} />
    <GrantNotification {game} />
    {#if qaMode}
      <QaOverlay {game} />
    {/if}
  {/if}
</div>
```

f) Update global hotkey handler (lines 149-157):

```typescript
function onGlobalKey(e: KeyboardEvent) {
  if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    toggleTerminalFocus();
  }
  if (e.key === 'Escape' && terminalFocused) {
    unfocusTerminal();
  }
}
```

g) Remove the old overlay-related code:
- Remove `terminalOpen` variable
- Remove `openTerminal`, `closeTerminal`, `toggleTerminal` functions
- Remove the backdrop div and fixed-position terminal wrapper

#### 3. Update GameHud terminal button

**File**: `src/explorers/GameHud.svelte`

The HUD button currently toggles terminal open/close. After this change, it toggles terminal focus. The prop names (`terminalOpen`, `onToggleTerminal`) are kept compatible — `terminalOpen` now means "terminal is focused" from the HUD's perspective, which still drives the active styling correctly.

No changes needed to GameHud.svelte — the prop interface remains the same.

#### 4. SmartTerminal height fix

**File**: `src/explorers/SmartTerminal.svelte`

The root div uses `h-full` which should work within the new flex container. No changes needed to SmartTerminal internals.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npx tsc --noEmit`
- [x] ESLint passes: `npm run lint --workspace=projects/edu-platform`
- [ ] Dev server starts without errors: `npm run dev --workspace=projects/edu-platform`

#### Manual Verification:

- [ ] Before `terminal-found` flag: game canvas fills 100% width, no terminal or divider visible
- [ ] After `terminal-found` flag: terminal appears on the right with divider
- [ ] Dragging divider resizes terminal between 20% and 40% of viewport
- [ ] Phaser canvas auto-resizes correctly (no black bars, no stretching)
- [ ] Typing in terminal doesn't move the player character
- [ ] Clicking game canvas area allows player movement
- [ ] `Ctrl+\`` toggles focus between game and terminal
- [ ] Escape unfocuses terminal
- [ ] All terminal commands still work (`/help`, `/quest`, etc.)
- [ ] Divider hover state shows teal color
- [ ] HUD terminal button shows active state when terminal is focused

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding.

---

## Phase 2: Polish & Edge Cases

### Overview

Handle edge cases around the terminal appearance transition and ensure keyboard focus management is robust.

### Changes Required:

#### 1. Auto-focus terminal on unlock

**File**: `src/explorers/PhaserGame.svelte`

When the `terminal-found` flag is first set during gameplay (not on page load with existing state), auto-focus the terminal so the user's attention is drawn to it:

```typescript
// Watch for terminal becoming visible for the first time in this session
let terminalWasVisible = false;
$: if (terminalVisible && !terminalWasVisible) {
  terminalWasVisible = true;
  // Only auto-focus if this happened during gameplay (not on page load)
  if (settled) {
    requestAnimationFrame(() => focusTerminal());
  }
}
```

#### 2. Keyboard focus trapping improvement

**File**: `src/explorers/SmartTerminal.svelte`

Update `handleKeydown` to also handle Escape by dispatching a custom event or letting it bubble (currently it returns early for Escape, which is correct — it bubbles to the global handler).

No change needed — current behavior is correct.

#### 3. Persist terminal width in localStorage (optional enhancement)

**File**: `src/explorers/PhaserGame.svelte`

```typescript
const TERMINAL_WIDTH_KEY = 'explorers-terminal-width';
let terminalWidthPct = parseFloat(localStorage.getItem(TERMINAL_WIDTH_KEY) ?? '30');

function handleResize(e: CustomEvent<{ widthPct: number }>) {
  terminalWidthPct = e.detail.widthPct;
  localStorage.setItem(TERMINAL_WIDTH_KEY, String(terminalWidthPct));
}
```

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compilation passes
- [ ] No console errors in dev tools

#### Manual Verification:

- [ ] Discovering terminal in-game for the first time auto-focuses the terminal panel
- [ ] Reloading page with existing terminal-found flag shows terminal without auto-focus
- [ ] Divider position persists across page reloads (if localStorage enhancement is included)

---

## Testing Strategy

### Manual Testing Steps:

1. Start fresh game (no saved state) — verify full-width canvas, no terminal
2. Progress to terminal discovery — verify terminal panel appears on the right
3. Drag divider to minimum (20%) — verify canvas takes 80%, no rendering issues
4. Drag divider to maximum (40%) — verify canvas takes 60%, no rendering issues
5. Type terminal commands — verify player doesn't move
6. Click game canvas — verify player movement works
7. Use `Ctrl+\`` to toggle focus back and forth
8. Press Escape to unfocus terminal
9. Verify all existing terminal functionality (boot sequence, commands, quest notifications)
10. Resize browser window — verify layout adapts correctly

## Performance Considerations

- Phaser's `Scale.RESIZE` handles canvas resize efficiently via internal ResizeObserver
- Drag handler is throttled with `requestAnimationFrame` to prevent excessive reflows
- Terminal stays mounted (no mount/unmount overhead on focus changes)
- CSS flex-basis percentage is more efficient than absolute pixel calculations

## References

- Current terminal overlay: `src/explorers/PhaserGame.svelte:332-342`
- Phaser scale config: `src/explorers/config/gameConfig.ts:8-12`
- Input controller gating: `src/explorers/scenes/GameScene.ts:219-223`
- Terminal keyboard handling: `src/explorers/SmartTerminal.svelte:156-160`
