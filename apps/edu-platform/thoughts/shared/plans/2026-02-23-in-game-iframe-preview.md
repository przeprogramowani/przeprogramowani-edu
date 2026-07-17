# In-Game Iframe Preview Overlay — Implementation Plan

## Overview

Replace the current `window.open()` behavior of `DialogueEffect.openUrl` with an in-game iframe-based overlay. The overlay renders as a full-viewport Svelte DOM component (following the terminal overlay pattern) with a gamified header bar ("Notatki z podróży"), configurable title, close button, and ESC key support. Exposed via a reusable `PREVIEW_SHOW` game event so any system can trigger it.

## Current State Analysis

- `DialogueEffect.openUrl` calls `window.open(url, '_blank')` in `DialogueManager.applyEffects()` (`src/explorers/systems/DialogueManager.ts:100-102`)
- Only one dialogue currently uses `openUrl`: `m0-study-notes-board` in `src/explorers/levels/m0-exam-room/dialogues.ts:12`
- The game already has a Svelte DOM overlay pattern via the terminal (`PhaserGame.svelte:175-187`): fixed backdrop + fixed content card + ESC key + event-based input blocking
- No iframe embedding exists anywhere in the codebase

### Key Discoveries

- Terminal overlay pattern at `PhaserGame.svelte:177-187` — backdrop with `fixed inset-0 bg-black/40 z-10`, content at `z-20`
- Input blocking via `GameEvents.TERMINAL_FOCUS_CHANGED` disables Phaser input controller
- `SmartTerminal.svelte:163-168` shows keyboard event isolation pattern (`stopPropagation` except for ESC and Ctrl+`)
- All target URLs are on owned domains — no X-Frame-Options/CSP issues

## Desired End State

1. When `openUrl` fires from a dialogue effect (or any system emits `PREVIEW_SHOW`), a full-viewport overlay appears with:
   - Dark semi-transparent backdrop (click to close)
   - Centered content card with subtle padding from viewport edges
   - Gamified header bar showing configurable title (default: "Notatki z podróży")
   - Close button ("X") in the header
   - Iframe loading the target URL
   - ESC key dismisses the overlay
2. Phaser game input is disabled while the overlay is open
3. `window.open()` is no longer used for `openUrl`

### Verification

- Trigger `m0-study-notes-board` dialogue → overlay appears with iframe instead of new tab
- Press ESC → overlay closes, game input restored
- Click "X" button → overlay closes
- Click backdrop → overlay closes
- No popup blocker warnings

## What We're NOT Doing

- No loading spinner / progress indicator for the iframe (keep it simple)
- No resize/drag of the overlay
- No fallback to `window.open()` (all target URLs are on owned domains)
- No caching or prefetching of iframe content
- No mobile-specific layout adjustments

## Implementation Approach

Follow the terminal overlay pattern exactly: a Svelte component rendered in `PhaserGame.svelte` controlled by a reactive boolean, triggered via a game event, with input blocking via the existing `TERMINAL_FOCUS_CHANGED` event mechanism.

## Critical Implementation Details

### Input Blocking

Reuse the same `TERMINAL_FOCUS_CHANGED` event with `{ focused: true/false }` to disable/enable Phaser input when the preview overlay opens/closes. This is the same mechanism the terminal uses and is already wired up in `GameScene`.

### Event Design

Add `PREVIEW_SHOW` and `PREVIEW_DISMISSED` events. `PREVIEW_SHOW` carries `{ url: string; title?: string }`. The `DialogueManager` emits `PREVIEW_SHOW` instead of calling `window.open()`.

### DOM Structure

The overlay sits as a sibling to the terminal overlay in `PhaserGame.svelte`, using `z-30` (above terminal's `z-20`) to ensure it renders on top of everything.

### Timing & Lifecycle

- N/A — no complex lifecycle. The overlay mounts/unmounts based on a boolean flag. The iframe loads naturally when the `src` attribute is set.

### Performance & Optimization

- N/A — single iframe, no lists or frequent updates.

### State Management Sequencing

- N/A — no persistent state. The overlay is purely ephemeral UI.

### Debug & Observability

- `devLog` when preview opens/closes (matching existing logging pattern)
- Preview URL visible in the iframe `src` attribute for inspection

---

## Phase 1: Add Game Event + Svelte Overlay Component

### Overview

Create the `PreviewOverlay.svelte` component, add the `PREVIEW_SHOW` / `PREVIEW_DISMISSED` events, and wire the overlay into `PhaserGame.svelte`.

### Changes Required

#### 1. GameEvents — add preview events

**File**: `src/explorers/events/GameEvents.ts`
**Changes**: Add event constants and payload interface

```typescript
// After EXAM_DISMISSED line (~38)
// Preview
PREVIEW_SHOW: 'preview:show',
PREVIEW_DISMISSED: 'preview:dismissed',
```

```typescript
// After ExamCompletedPayload (~125)
export interface PreviewShowPayload {
  url: string;
  title?: string;
}
// PreviewDismissed — no payload
```

#### 2. PreviewOverlay.svelte — new component

**File**: `src/explorers/PreviewOverlay.svelte` (new file)
**Changes**: Create the iframe overlay component

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { GameEvents } from './events/GameEvents';
  import type { PreviewShowPayload } from './events/GameEvents';

  export let game: Phaser.Game;

  let visible = false;
  let url = '';
  let title = 'Notatki z podróży';

  function open(payload: PreviewShowPayload) {
    url = payload.url;
    title = payload.title ?? 'Notatki z podróży';
    visible = true;
    game.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: true });
  }

  function close() {
    if (!visible) return;
    visible = false;
    url = '';
    game.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: false });
    game.events.emit(GameEvents.PREVIEW_DISMISSED);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && visible) {
      e.stopPropagation();
      close();
    }
  }

  onMount(() => {
    game.events.on(GameEvents.PREVIEW_SHOW, open);
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    game.events.off(GameEvents.PREVIEW_SHOW, open);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if visible}
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-black/60 z-30" on:click={close}></div>

  <!-- Content card -->
  <div class="fixed inset-4 z-40 flex flex-col rounded-xl overflow-hidden
              border border-teal-700/50 bg-gray-950 shadow-2xl shadow-teal-900/40">
    <!-- Header bar -->
    <div class="flex items-center justify-between px-4 py-2
                bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800
                border-b border-teal-800/40">
      <div class="flex items-center gap-3">
        <span class="text-teal-400 font-mono text-xs tracking-widest uppercase opacity-70">
          // ARCHIWUM
        </span>
        <span class="text-gray-200 font-mono text-sm">{title}</span>
      </div>
      <button
        on:click={close}
        class="w-7 h-7 flex items-center justify-center rounded
               text-gray-400 hover:text-white hover:bg-gray-700/60
               transition-colors font-mono text-sm">
        X
      </button>
    </div>

    <!-- Iframe -->
    <iframe
      src={url}
      {title}
      class="flex-1 w-full border-0 bg-white"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    ></iframe>
  </div>
{/if}
```

#### 3. PhaserGame.svelte — wire overlay

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Import and render `PreviewOverlay`

Add import (after line 12):
```typescript
import PreviewOverlay from './PreviewOverlay.svelte';
```

Add component rendering (after terminal overlay block, before QA overlay, ~line 188):
```svelte
<PreviewOverlay {game} />
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npm run build` (or `npx tsc --noEmit`)
- [x] No lint errors: `npm run lint`

#### Manual Verification

- [ ] Emitting `PREVIEW_SHOW` from browser console opens the overlay
- [ ] ESC key closes the overlay
- [ ] "X" button closes the overlay
- [ ] Backdrop click closes the overlay
- [ ] Game input is disabled while overlay is open
- [ ] Game input restores after overlay closes

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Phase 2: Replace `openUrl` in DialogueManager

### Overview

Change `DialogueManager.applyEffects()` to emit `PREVIEW_SHOW` instead of `window.open()`. Update `DialogueEffect` type to support the optional title. Update existing dialogue data.

### Changes Required

#### 1. DialogueTypes — add optional title to openUrl

**File**: `src/explorers/systems/DialogueTypes.ts`
**Changes**: Add `openUrlTitle` to `DialogueEffect`

```typescript
export interface DialogueEffect {
  activateQuest?: string;
  completeQuest?: string;
  setFlags?: string[];
  triggerEvent?: string;
  /** Opens URL in an in-game iframe preview overlay */
  openUrl?: string;
  /** Title shown in the preview overlay header (default: 'Notatki z podróży') */
  openUrlTitle?: string;
}
```

#### 2. DialogueManager — emit PREVIEW_SHOW instead of window.open

**File**: `src/explorers/systems/DialogueManager.ts`
**Changes**: Replace `window.open` with event emission

Replace lines 100-102:
```typescript
// Before:
if (effects.openUrl) {
  window.open(effects.openUrl, '_blank');
}

// After:
if (effects.openUrl) {
  this.bus.emit(GameEvents.PREVIEW_SHOW, {
    url: effects.openUrl,
    title: effects.openUrlTitle,
  });
}
```

Add import if not already present (GameEvents should already be imported).

#### 3. Dialogue data — add title to m0-study-notes-board

**File**: `src/explorers/levels/m0-exam-room/dialogues.ts`
**Changes**: Add `openUrlTitle` to the study notes dialogue

```typescript
onComplete: {
  openUrl: 'STUDY_NOTES_URL_PLACEHOLDER',
  openUrlTitle: 'Notatki szkoleniowe',
},
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles: `npm run build`
- [x] No lint errors: `npm run lint`

#### Manual Verification

- [ ] Triggering the study notes whiteboard interaction opens the iframe overlay (not a new tab)
- [ ] The header shows "Notatki szkoleniowe" title
- [ ] All close methods work (ESC, X, backdrop)
- [ ] No popup blocker warnings appear
- [ ] Dialogue effects still fire correctly (flags, quests, etc.)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation.

---

## Testing Strategy

### Manual Testing Steps

1. Start the game, navigate to the study notes whiteboard zone
2. Interact with it → dialogue plays → after completion, iframe overlay should appear
3. Verify overlay shows the correct title in the header
4. Press ESC → overlay closes, player can move again
5. Re-trigger → overlay opens → click "X" → closes
6. Re-trigger → overlay opens → click backdrop → closes
7. While overlay is open, try WASD/arrow keys → player should NOT move
8. After closing, verify player movement works normally
9. Verify other dialogue effects (flags, quests) still work after the change

## Performance Considerations

None significant — single iframe mount/unmount on user interaction. The iframe loads content on-demand and is fully destroyed when the overlay closes.

## References

- Terminal overlay pattern: `src/explorers/PhaserGame.svelte:175-187`
- Input blocking event: `src/explorers/events/GameEvents.ts:25` (`TERMINAL_FOCUS_CHANGED`)
- Current openUrl implementation: `src/explorers/systems/DialogueManager.ts:100-102`
- Dialogue using openUrl: `src/explorers/levels/m0-exam-room/dialogues.ts:12`
