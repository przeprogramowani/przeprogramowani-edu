# QA Overlay Accordion + Zone Debug Toggle

## Overview

Two QA-mode improvements:
1. Make `QaOverlay.svelte` collapsible — click the header to toggle between full panel and minimal "QA MODE" bar
2. Store zone debug rectangle references in `GameScene` and expose a toggle method so the QA panel can show/hide them via a button

## Current State Analysis

- **QaOverlay** (`src/explorers/QaOverlay.svelte`) is a fixed DOM panel that always renders its full content when mounted. No collapse/expand capability exists.
- **Zone debug overlays** (`src/explorers/scenes/GameScene.ts:137-151`) are Phaser rectangles created once in `create()` inside an `if (import.meta.env.DEV)` guard. They have no references stored and no visibility toggle.
- The overlay and zone debug systems are completely independent — QA overlay is Svelte DOM, zone rectangles are Phaser canvas objects.

## Desired End State

1. QA overlay has a clickable header that toggles between expanded (full panel, current behavior) and collapsed (just the "QA MODE" + "?qa" header row). Starts **expanded** by default.
2. In DEV mode, zone debug rectangles are **visible by default**. A toggle button in the QA panel sets their visibility on/off at runtime.
3. No changes to production behavior — zone debug overlays remain DEV-only.

## What We're NOT Doing

- No keyboard shortcuts for toggling
- No persisting collapsed/expanded state across reloads
- No zone debug overlays in production builds
- No changes to GameHud or other HUD components

## Implementation Approach

Phase 1 adds accordion behavior purely in Svelte. Phase 2 stores zone rect references in GameScene, exposes a public toggle method, and adds a button in the QA panel that calls it.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- Zone debug rectangles are created in `GameScene.create()`. The QA overlay mounts after `gameReady` fires, so the scene and its rectangles already exist when the toggle button appears.
- `QaOverlay` already accesses `GameScene` via `game.scene.getScene(SceneKey.GAME)` in `readLivePosition()` — the same pattern works for calling the toggle method.

### User Experience Specification

- **Collapsed state**: Only the amber "QA MODE" text and gray "?qa" hint are visible. The panel shrinks to a single row.
- **Expanded state**: Identical to current full panel.
- **Toggle**: Clicking anywhere on the header row toggles state.
- **Zone toggle button**: A simple on/off button in the QA panel (only visible in DEV). Label shows current state ("Strefy: WL" / "Strefy: WYL" in Polish).

### State Management Sequencing

- `expanded` is a simple Svelte `let` variable, no event bus needed.
- Zone visibility is controlled by calling `gameScene.toggleZoneDebug()` which flips `.visible` on stored rectangle references. No game state persistence needed.

---

## Phase 1: QA Overlay Accordion

### Overview

Add a reactive `expanded` boolean to `QaOverlay.svelte`. The header row becomes clickable. When collapsed, only the header renders.

### Changes Required:

#### 1. `src/explorers/QaOverlay.svelte`

**Add state variable** (in `<script>` block):

```ts
let expanded = true;
```

**Make header clickable** — replace the static header `div` with a clickable toggle:

```svelte
<button
  class="flex items-center justify-between w-full mb-0 cursor-pointer"
  class:mb-2={expanded}
  on:click={() => (expanded = !expanded)}
>
  <span class="text-amber-400 font-bold text-sm">QA MODE</span>
  <div class="flex items-center gap-2">
    <span class="text-gray-500 text-[10px]">?qa</span>
    <span class="text-gray-500 text-[10px]">{expanded ? '▲' : '▼'}</span>
  </div>
</button>
```

**Wrap body in `{#if expanded}`** — everything below the header (the `space-y-1.5` div through the reset button) gets wrapped:

```svelte
{#if state}
  <!-- header button above -->
  {#if expanded}
    <div class="space-y-1.5">
      <!-- ... all existing state display content ... -->
    </div>
    <div class="mt-3 pt-2 border-t border-gray-700">
      <!-- reset button -->
    </div>
  {/if}
{:else}
  <!-- waiting message only shown when expanded -->
  {#if expanded}
    <div class="text-gray-600 italic">Waiting for game state...</div>
  {/if}
{/if}
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run build --workspace=projects/edu-platform` succeeds
- [x] No TypeScript errors

#### Manual Verification:

- [ ] Navigate to `/explorers?qa` — overlay starts expanded with full content
- [ ] Click header — overlay collapses to just "QA MODE ?qa ▲/▼"
- [ ] Click header again — overlay expands back to full content
- [ ] Position polling continues working when expanded again
- [ ] Reset button still works after collapse/expand cycle

---

## Phase 2: Zone Debug Overlay Toggle

### Overview

Store zone debug rectangle references in `GameScene`, expose a toggle method, and add a button in the QA panel to control visibility.

### Changes Required:

#### 1. `src/explorers/scenes/GameScene.ts`

**Add instance property** to store zone debug rectangles:

```ts
private zoneDebugRects: Phaser.GameObjects.Rectangle[] = [];
```

**Store references** when creating zone debug rectangles (modify existing block at ~line 137):

```ts
if (import.meta.env.DEV) {
  for (const zone of this.zoneObjects) {
    if (zone.type === 'spawn') continue;

    let color = 0xffb347;
    if (zone.type === 'door') color = 0x00d4aa;
    if (zone.type === 'terminal') color = 0x00d4aa;

    const rect = this.add.rectangle(
      zone.x + zone.width / 2,
      zone.y + zone.height / 2,
      zone.width,
      zone.height
    );
    rect.setStrokeStyle(2, color);
    rect.setFillStyle(color, 0.1);
    rect.setDepth(DEPTH.OBJECTS);
    this.zoneDebugRects.push(rect);
  }
}
```

**Add public toggle method**:

```ts
/** Toggle visibility of zone debug overlays. Returns new visibility state. */
toggleZoneDebug(): boolean {
  const newVisible = this.zoneDebugRects.length > 0 && !this.zoneDebugRects[0]?.visible;
  for (const rect of this.zoneDebugRects) {
    rect.setVisible(newVisible);
  }
  return newVisible;
}

/** Get current visibility of zone debug overlays. */
getZoneDebugVisible(): boolean {
  return this.zoneDebugRects.length > 0 && (this.zoneDebugRects[0]?.visible ?? false);
}
```

#### 2. `src/explorers/QaOverlay.svelte`

**Add zone debug state** (in `<script>` block):

```ts
const isDev = import.meta.env.DEV;
let zoneDebugVisible = true; // matches default (on by default in DEV)
```

**Initialize from scene** — in `readLivePosition()` (already runs every 250ms), sync the state:

```ts
function readLivePosition() {
  const gameScene = game.scene.getScene(SceneKey.GAME) as GameScene | null;
  if (gameScene) {
    const player = gameScene.getPlayer?.();
    if (player) {
      liveX = player.x;
      liveY = player.y;
      liveFacing = player.facing;
    }
    if (isDev) {
      zoneDebugVisible = gameScene.getZoneDebugVisible();
    }
  }
}
```

**Add toggle function**:

```ts
function toggleZoneDebug() {
  const gameScene = game.scene.getScene(SceneKey.GAME) as GameScene | null;
  if (gameScene) {
    zoneDebugVisible = gameScene.toggleZoneDebug();
  }
}
```

**Add toggle button** in the template (inside the expanded content area, before the Reset button):

```svelte
{#if isDev}
  <button
    on:click={toggleZoneDebug}
    class="w-full px-2 py-1.5 border rounded text-xs font-bold cursor-pointer transition-colors
           {zoneDebugVisible
             ? 'bg-teal-900/60 hover:bg-teal-800/80 border-teal-700/50 text-teal-300'
             : 'bg-gray-800/60 hover:bg-gray-700/80 border-gray-600/50 text-gray-400'}"
  >
    Strefy: {zoneDebugVisible ? 'WŁ' : 'WYŁ'}
  </button>
{/if}
```

### Success Criteria:

#### Automated Verification:

- [x] `npm run build --workspace=projects/edu-platform` succeeds
- [x] No TypeScript errors

#### Manual Verification:

- [ ] Zone debug rectangles visible by default in dev mode with `?qa`
- [ ] "Strefy: WŁ" button visible in QA panel (only in dev mode)
- [ ] Click button — zone rectangles disappear, button shows "Strefy: WYŁ"
- [ ] Click again — zone rectangles reappear, button shows "Strefy: WŁ"
- [ ] Zone toggle button NOT visible in production builds
- [ ] Zone toggle works correctly after map transitions

## Testing Strategy

### Manual Testing Steps:

1. Run dev server, navigate to `/explorers?qa`
2. Verify overlay starts expanded
3. Click header — verify collapse to minimal bar
4. Click header — verify expand to full content
5. Verify zone debug rectangles are visible
6. Click "Strefy: WŁ" — verify rectangles disappear
7. Click "Strefy: WYŁ" — verify rectangles reappear
8. Navigate between maps — verify zone toggle state is correct for new map
9. Test without `?qa` — verify no overlay appears and zone debug rectangles still show (DEV default)

## References

- QaOverlay: `src/explorers/QaOverlay.svelte`
- Zone debug rendering: `src/explorers/scenes/GameScene.ts:137-151`
- QA mode activation: `src/explorers/PhaserGame.svelte:39`
