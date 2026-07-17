# Bookmarks System Implementation Plan

## Overview

Add a reusable bookmarks system to 10x Explorers. Bookmarks are added automatically via dialogue effects (e.g. Study Notes Board), stored in player state, and viewable/clickable through the `/bookmarks` terminal command. The first bookmark is granted by the Study Notes Board interaction, which also unlocks the `cmds:bookmarks` flag.

## Current State Analysis

- `bookmarks` command exists in `commandRegistry.ts:10` with `requiredFlag: 'cmds:bookmarks'` but has **no implementation** in `commandHandler.ts`
- Study Notes Board dialogue (`dialogues.ts:5-18`) uses `openUrl` effect to show content but does NOT set `cmds:bookmarks` flag
- `CommandResult` (`commandHandler.ts:6-8`) is `{ output: string[] }` — cannot trigger events
- `DemoGameState` (`types.ts:5-25`) has no bookmarks field
- `DialogueEffect` (`DialogueTypes.ts:10-20`) has no bookmark-related effect

### Key Discoveries

- Commands are pure functions returning text — `commandHandler.ts:10-37`
- SmartTerminal has `getBus()` access to emit events — `SmartTerminal.svelte:54-56`
- DialogueManager processes effects sequentially in `applyEffects()` — `DialogueManager.ts:83-106`
- State backward compatibility is handled in `loadState()` — `GameStateManager.ts:33-36`

## Desired End State

1. `DemoGameState` includes `bookmarks: BookmarkEntry[]`
2. A new `addBookmark` dialogue effect adds bookmarks to state and opens the preview
3. Study Notes Board dialogue uses `addBookmark` + `setFlags: ['cmds:bookmarks']`
4. `/bookmarks` command shows a clickable list in the terminal
5. Clicking a bookmark item emits `PREVIEW_SHOW` and opens the iframe overlay
6. The system is reusable — any future dialogue can add bookmarks via the effect

### Verification

- Interact with Study Notes Board → preview opens + bookmark saved + `cmds:bookmarks` unlocked + terminal notification shown
- Type `/bookmarks` → numbered list appears with clickable items
- Click a bookmark → preview overlay opens with the correct URL and title
- Save/reload → bookmarks persist in state

## What We're NOT Doing

- No manual "save bookmark" button in the preview overlay (only event-driven)
- No bookmark deletion/editing
- No bookmark categories or sorting
- No bookmark import/export

## Implementation Approach

Extend the dialogue effect system with `addBookmark`, extend `CommandResult` with an `interactive` field for clickable items, and update SmartTerminal to render them. This keeps the command handler pure (no bus dependency) while allowing rich terminal interactions.

## Critical Implementation Details

### State Management

- New `BookmarkEntry` type: `{ id: string; url: string; title: string; addedAt: number }`
- ID derived from URL to prevent duplicates (simple hash or slug)
- Backward compatibility: add `bookmarks: []` default in `loadState()` like existing `exams` pattern

### Command Result Extension

- Add `interactive?: InteractiveItem[]` to `CommandResult`
- `InteractiveItem = { label: string; action: { type: 'preview'; url: string; title: string } }`
- SmartTerminal checks for `interactive` items and renders them as clickable divs
- Clicking emits `PREVIEW_SHOW` via `getBus()`

### Dialogue Effect Flow

- `addBookmark` effect: adds bookmark to state (dedup by URL), then opens preview
- This replaces the current `openUrl` usage in Study Notes Board — single effect does both
- DialogueManager processes `addBookmark` before other effects since bookmark addition should happen first

### Terminal UX

- `/bookmarks` with no bookmarks: "Brak zapisanych zakładek."
- `/bookmarks` with items: numbered list, each rendered as clickable interactive item
- Visual style: teal accent for clickable items, consistent with terminal theme

---

## Phase 1: State & Types Foundation

### Overview

Add bookmark types to state, extend `CommandResult` and `DialogueEffect`.

### Changes Required

#### 1. Bookmark type + state extension

**File**: `src/explorers/state/types.ts`
**Changes**: Add `BookmarkEntry` interface and `bookmarks` field

```typescript
export interface BookmarkEntry {
  id: string;
  url: string;
  title: string;
  addedAt: number;
}

// In DemoGameState, add:
bookmarks: BookmarkEntry[];
```

#### 2. Default state + backward compat

**File**: `src/explorers/state/GameStateManager.ts`
**Changes**: Add `bookmarks: []` to `createDefaultState()` and backward compat in `loadState()`

```typescript
// In createDefaultState():
bookmarks: [],

// In loadState(), after exams compat:
if (!data.bookmarks) {
  data.bookmarks = [];
}
```

#### 3. Extend CommandResult with interactive items

**File**: `src/explorers/terminal/commandHandler.ts`
**Changes**: Add `InteractiveItem` interface and optional `interactive` field to `CommandResult`

```typescript
export interface InteractiveAction {
  type: 'preview';
  url: string;
  title: string;
}

export interface InteractiveItem {
  label: string;
  action: InteractiveAction;
}

export interface CommandResult {
  output: string[];
  interactive?: InteractiveItem[];
}
```

#### 4. Extend DialogueEffect with addBookmark

**File**: `src/explorers/systems/DialogueTypes.ts`
**Changes**: Add `addBookmark` field to `DialogueEffect`

```typescript
export interface DialogueEffect {
  // ... existing fields ...
  /** Adds a bookmark to player state and opens preview */
  addBookmark?: { url: string; title: string };
}
```

### Success Criteria

#### Automated Verification
- [x] Type checking passes: `npx tsc --noEmit` (from edu-platform)
- [x] No new bookmarks field breaks existing state loading

#### Manual Verification
- [x] N/A — no user-facing changes yet

---

## Phase 2: Bookmark Manager + DialogueManager Integration

### Overview

Create the BookmarkManager module and wire `addBookmark` effect into DialogueManager.

### Changes Required

#### 1. BookmarkManager module

**File**: `src/explorers/systems/BookmarkManager.ts` (new)
**Changes**: Create reusable bookmark management functions

```typescript
import type Phaser from 'phaser';
import type { BookmarkEntry } from '../state/types';
import { GameEvents } from '../events/GameEvents';
import { devLog } from '../utils/logger';

function bookmarkId(url: string): string {
  return url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

export function addBookmark(
  game: Phaser.Game,
  bus: Phaser.Events.EventEmitter,
  url: string,
  title: string
): void {
  const state = game.registry.get('demoGameState') as import('../state/types').DemoGameState;
  const id = bookmarkId(url);

  if (state.bookmarks.some((b) => b.id === id)) {
    devLog(`[BookmarkManager] Bookmark already exists: ${id}`);
    // Still open preview even if duplicate
    bus.emit(GameEvents.PREVIEW_SHOW, { url, title });
    return;
  }

  const entry: BookmarkEntry = { id, url, title, addedAt: Date.now() };
  const next = { ...state, bookmarks: [...state.bookmarks, entry] };
  game.registry.set('demoGameState', next);
  bus.emit(GameEvents.STATE_CHANGED, { state: next });
  bus.emit(GameEvents.PREVIEW_SHOW, { url, title });
  devLog(`[BookmarkManager] Bookmark added: ${title} (${url})`);
}

export function getBookmarks(state: import('../state/types').DemoGameState): BookmarkEntry[] {
  return state.bookmarks ?? [];
}
```

#### 2. Wire addBookmark into DialogueManager

**File**: `src/explorers/systems/DialogueManager.ts`
**Changes**: Import and process `addBookmark` effect in `applyEffects()`

```typescript
// Add import:
import { addBookmark } from './BookmarkManager';

// In applyEffects(), add before openUrl handling:
if (effects.addBookmark) {
  addBookmark(this.game, this.bus, effects.addBookmark.url, effects.addBookmark.title);
}
```

Note: When `addBookmark` is used, it handles opening the preview internally. The existing `openUrl` handling remains for dialogues that only want to open preview without saving a bookmark.

### Success Criteria

#### Automated Verification
- [x] Type checking passes: `npx tsc --noEmit`

#### Manual Verification
- [x] N/A — wired but not yet triggered by any dialogue

---

## Phase 3: Update Study Notes Board + Implement /bookmarks Command

### Overview

Update the Study Notes Board dialogue to use `addBookmark` + `setFlags`, implement the `/bookmarks` command handler.

### Changes Required

#### 1. Update Study Notes Board dialogue

**File**: `src/explorers/levels/m0-exam-room/dialogues.ts`
**Changes**: Replace `openUrl`/`openUrlTitle` with `addBookmark` + `setFlags`

```typescript
'm0-study-notes-board': {
  id: 'm0-study-notes-board',
  lines: [
    { speaker: 'system', text: 'TABLICA SZKOLENIOWA — Notatki do egzaminów', mode: 'system', autoAdvance: 2500 },
    {
      speaker: 'system',
      text: 'Materiały przygotowawcze do weryfikacji pamięci.',
      mode: 'system',
      autoAdvance: 2500,
    },
    { speaker: 'astronaut', text: 'Notatki z przeszłości... Może pomogą mi sobie przypomnieć.', mode: 'monologue' },
  ],
  onComplete: {
    setFlags: ['cmds:bookmarks'],
    addBookmark: { url: '/external/10xdevs-2/2580638', title: 'Notatki szkoleniowe' },
  },
},
```

#### 2. Implement cmdBookmarks command

**File**: `src/explorers/terminal/commandHandler.ts`
**Changes**: Add `cmdBookmarks` function and wire into switch statement

```typescript
// Add import at top:
import { getBookmarks } from '../systems/BookmarkManager';

// Add case in switch:
case 'bookmarks':
  return cmdBookmarks(state);

// Add function:
function cmdBookmarks(state: DemoGameState): CommandResult {
  const bookmarks = getBookmarks(state);

  if (bookmarks.length === 0) {
    return { output: ['Brak zapisanych zakładek.'] };
  }

  const output: string[] = [
    'ZAKŁADKI',
    '═════════════════════════════',
    '',
  ];

  const interactive: InteractiveItem[] = bookmarks.map((b, i) => ({
    label: `  ${i + 1}. ${b.title}`,
    action: { type: 'preview' as const, url: b.url, title: b.title },
  }));

  return { output, interactive };
}
```

### Success Criteria

#### Automated Verification
- [x] Type checking passes: `npx tsc --noEmit`

#### Manual Verification
- [ ] Interact with Study Notes Board → preview opens, bookmark saved, `cmds:bookmarks` flag set
- [ ] Terminal shows "Nowa komenda dostępna: /bookmarks" notification
- [ ] Type `/bookmarks` → shows header + bookmark list (but not yet clickable — Phase 4)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation that the dialogue flow works correctly before proceeding.

---

## Phase 4: SmartTerminal Interactive Items

### Overview

Update SmartTerminal to render `interactive` items from CommandResult as clickable elements that emit `PREVIEW_SHOW`.

### Changes Required

#### 1. Update SmartTerminal command handling

**File**: `src/explorers/SmartTerminal.svelte`
**Changes**: Store interactive items from command results, render them as clickable, handle clicks

In the `<script>` section:

```typescript
// Add import:
import type { InteractiveItem } from './terminal/commandHandler';

// Add state variable:
let interactiveItems: InteractiveItem[] = [];

// In handleCommandSubmit(), after result processing:
interactiveItems = result.interactive ?? [];
```

In `handleCommandSubmit()`, update to store interactive items:

```typescript
function handleCommandSubmit() {
  const raw = commandInput.trim();
  if (!raw) return;
  suggestions = [];
  interactiveItems = []; // Clear previous interactive items

  const state = getState();
  terminalLines = [...terminalLines, `> ${raw}`];
  const result = handleCommand(raw, state, questManager);
  terminalLines = [...terminalLines, ...result.output, ''];
  interactiveItems = result.interactive ?? [];

  updateState((s) => ({ commandHistory: [...s.commandHistory, raw] }));
  commandInput = '';
  scrollToBottom();
}
```

Add click handler:

```typescript
function handleInteractiveClick(item: InteractiveItem) {
  if (item.action.type === 'preview') {
    getBus().emit(GameEvents.PREVIEW_SHOW, {
      url: item.action.url,
      title: item.action.title,
    });
  }
  interactiveItems = []; // Clear after click
}
```

#### 2. Render interactive items in template

**File**: `src/explorers/SmartTerminal.svelte`
**Changes**: Add interactive items rendering after terminal output, before autocomplete

```svelte
<!-- Interactive items (bookmarks, etc.) -->
{#if interactiveItems.length > 0}
  <div class="px-3 py-1 space-y-0.5">
    {#each interactiveItems as item}
      <div
        class="text-xs text-teal-400 cursor-pointer hover:text-teal-200 hover:bg-teal-900/20 px-2 py-1 rounded transition-colors"
        on:click={() => handleInteractiveClick(item)}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === 'Enter' && handleInteractiveClick(item)}>
        {item.label}
      </div>
    {/each}
  </div>
{/if}
```

Place this block between the output `<div>` and the autocomplete suggestions section.

#### 3. Clear interactive items on new input

Interactive items should clear when the user starts typing a new command — already handled by setting `interactiveItems = []` at the start of `handleCommandSubmit()`. Also clear when preview is dismissed:

```typescript
// In onMount, add listener:
const onPreviewDismissed = () => {
  interactiveItems = [];
};
getBus().on(GameEvents.PREVIEW_DISMISSED, onPreviewDismissed);

// In cleanup:
getBus().off(GameEvents.PREVIEW_DISMISSED, onPreviewDismissed);
```

### Success Criteria

#### Automated Verification
- [x] Type checking passes: `npx tsc --noEmit`
- [x] Build succeeds: `npm run build` (from edu-platform)

#### Manual Verification
- [ ] Interact with Study Notes Board → preview opens, bookmark saved, command unlocked
- [ ] Type `/bookmarks` → numbered list with teal-colored clickable items appears
- [ ] Click a bookmark → preview overlay opens with correct URL/title
- [ ] Close preview → interactive items clear
- [ ] Type another command → interactive items clear
- [ ] Save & reload page → bookmarks persist, `/bookmarks` still works
- [ ] Interact with Study Notes Board again → no duplicate bookmark, preview still opens

---

## Testing Strategy

### Manual Testing Steps

1. Fresh state (clear localStorage): interact with Study Notes Board
   - Verify: dialogue plays → preview opens → bookmark saved → flag set → terminal notification
2. Type `/bookmarks` in terminal
   - Verify: header + numbered clickable list shown
3. Click bookmark item
   - Verify: preview overlay opens with correct content
4. Close preview, type `/bookmarks` again
   - Verify: list appears again (items persist)
5. Interact with Study Notes Board a second time
   - Verify: no duplicate bookmark entry
6. Reload page (F5)
   - Verify: bookmarks persist in state, `/bookmarks` command still available
7. Clear localStorage and reload
   - Verify: no bookmarks, `/bookmarks` command not available (flag not set)

## Performance Considerations

- Bookmarks array will be small (likely <20 items total across all levels)
- No performance concerns with linear scan for dedup

## Migration Notes

- Backward compatibility: `loadState()` adds `bookmarks: []` if missing from old saves
- No data migration needed — new field starts empty

## References

- Command registry: `src/explorers/terminal/commandRegistry.ts:10`
- Study Notes Board dialogue: `src/explorers/levels/m0-exam-room/dialogues.ts:5-18`
- DialogueEffect type: `src/explorers/systems/DialogueTypes.ts:10-20`
- DialogueManager effect processing: `src/explorers/systems/DialogueManager.ts:83-106`
- SmartTerminal command handling: `src/explorers/SmartTerminal.svelte:126-139`
- GameStateManager: `src/explorers/state/GameStateManager.ts`
- State types: `src/explorers/state/types.ts`
