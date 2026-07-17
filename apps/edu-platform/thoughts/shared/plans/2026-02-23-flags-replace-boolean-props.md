# Replace Boolean Props with Flags Implementation Plan

## Overview

Remove the three boolean properties (`introSeen`, `terminalUnlocked`, `mapUnlocked`) from `DemoGameState` and rely solely on the `flags[]` array. The booleans are redundant — `introSeen` and `terminalUnlocked` already have corresponding flag strings (`'m0-intro-seen'`, `'terminal-unlocked'`), and `mapUnlocked` is dead code. All consumers will be updated to use `hasFlag()` / `flags.includes()` checks instead of reading boolean properties.

## Current State Analysis

| Boolean Property | Corresponding Flag | Write Locations | Read Locations |
|---|---|---|---|
| `introSeen` | `'m0-intro-seen'` | `GameScene.ts:526` (dual-write with flag at :525) | `QaOverlay.svelte:144` (badge only) |
| `terminalUnlocked` | `'terminal-unlocked'` | `SmartTerminal.svelte:100` (dual-write with flag at :101) | `SmartTerminal.svelte:174` (restore on mount), `QaOverlay.svelte:145` (badge only) |
| `mapUnlocked` | **none** | `QuestManager.ts:89` (dead `demo-quest-1` logic) | `QaOverlay.svelte:146` (badge only) |

### Key Discoveries:

- Both `introSeen` and `terminalUnlocked` are always set alongside their flag counterparts (dual-write), so old saves in localStorage already have both — no migration needed
- `mapUnlocked` is only set by `demo-quest-1` which doesn't exist in any manifest — dead code
- QaOverlay badges for these 3 booleans are redundant since the Flags section already lists all active flags
- The `GameStateManager.test.ts` roundtrip test sets `terminalUnlocked: true` and asserts it — test must be updated

## Desired End State

- `DemoGameState` has no `introSeen`, `terminalUnlocked`, or `mapUnlocked` fields
- `SmartTerminal` checks for `'terminal-unlocked'` flag instead of the boolean property
- `GameScene` no longer sets `introSeen: true` (the flag `'m0-intro-seen'` is already set)
- `QuestManager` no longer sets `mapUnlocked` for `demo-quest-1`
- QaOverlay badges section removed
- `createDefaultState()` no longer includes the three boolean defaults
- Tests updated to reflect new state shape

### Verification:

- `npm run test` passes
- Game boots correctly on fresh state (no save)
- Game restores correctly with an existing save containing the old boolean fields (they're ignored)
- Terminal unlock flow still works (enter code → boot → unlocked persists on reload)
- Cinematic intro plays once and doesn't replay

## What We're NOT Doing

- Not creating a `'map-unlocked'` flag — `mapUnlocked` is dead code, remove entirely
- Not migrating old saves — booleans and flags were always set together
- Not touching other parts of the flag system (flagManager, BaseScene cache, etc.)

## Implementation Approach

Single-phase change — remove the 3 booleans from the type and update all 5 consumers. This is a small, focused refactoring that can be done atomically.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: No new timing or lifecycle concerns. We're replacing synchronous boolean reads with synchronous flag array checks. The flag is always set before it's ever read.

### User Experience Specification

**N/A**: No user-facing behavior changes. The QaOverlay badge removal is a dev-only QA tool change — the same information is visible in the Flags section.

### Performance & Optimization Strategy

**N/A**: `flags.includes()` on a small array (<20 items) is negligible. SmartTerminal only checks on mount (once).

### State Management Sequencing

The only non-trivial consumer is `SmartTerminal.svelte:174` which currently does:
```ts
if (state?.terminalUnlocked) {
```
This changes to:
```ts
if (state?.flags.includes('terminal-unlocked')) {
```
The flag is set in `playBootSequence()` at the same time the boolean was, so behavior is identical.

### Debug & Observability Plan

- The QaOverlay Flags section already displays all active flags — this replaces the badges
- `devLog` statements in `flagManager.setFlag()` already log every flag change

## Phase 1: Remove Boolean Props and Update Consumers

### Overview

Remove `introSeen`, `terminalUnlocked`, `mapUnlocked` from the type, default state, and all consumers in a single pass.

### Changes Required:

#### 1. `src/explorers/state/types.ts` — Remove boolean fields from type

**File**: `src/explorers/state/types.ts`
**Changes**: Remove lines 16-18 (`terminalUnlocked`, `mapUnlocked`, `introSeen`)

```diff
 export interface DemoGameState {
   version: 1;
   flags: string[];
   currentMap: MapKey;
   position: { x: number; y: number };
   facing: FacingDirection;
   quests: {
     active: string | null;
     completed: string[];
   };
   hintIndex: Record<string, number>;
-  terminalUnlocked: boolean;
-  mapUnlocked: boolean;
-  introSeen: boolean;
   xp: number;
   commandHistory: string[];
   activityLog: ActivityLogEntry[];
   exams: {
     completed: string[];
   };
 }
```

#### 2. `src/explorers/state/GameStateManager.ts` — Remove defaults

**File**: `src/explorers/state/GameStateManager.ts`
**Changes**: Remove lines 17-19 from `createDefaultState()`

```diff
 export function createDefaultState(): DemoGameState {
   return {
     version: 1,
     flags: [],
     currentMap: 'm0-awakening',
     position: { x: 2 * 32, y: 4 * 32 },
     facing: 'right',
     quests: {
       active: null,
       completed: [],
     },
     hintIndex: {},
-    terminalUnlocked: false,
-    mapUnlocked: false,
-    introSeen: false,
     xp: 0,
     commandHistory: [],
     activityLog: [],
     exams: { completed: [] },
   };
 }
```

#### 3. `src/explorers/scenes/GameScene.ts` — Remove `introSeen` write

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Remove `this.updateState((s) => ({ introSeen: true }));` at line 526. The flag `introConfig.flag` (which resolves to `'m0-intro-seen'`) is already set at line 525 via `this.setFlag(introConfig.flag)`.

```diff
                         this.introPlaying = false;
                         this.setFlag(introConfig.flag);
-                        this.updateState((s) => ({ introSeen: true }));
                         saveState(this.gameState);
```

#### 4. `src/explorers/SmartTerminal.svelte` — Remove boolean write, use flag for read

**File**: `src/explorers/SmartTerminal.svelte`
**Changes**:
- Line 100: Remove `updateState((s) => ({ terminalUnlocked: true }))` — the flag at line 101 is sufficient
- Line 174: Change `state?.terminalUnlocked` to `state?.flags.includes('terminal-unlocked')`

```diff
 // In playBootSequence():
-   updateState((s) => ({ terminalUnlocked: true }));
    setFlag(game, 'terminal-unlocked');
    getBus().emit(GameEvents.TERMINAL_UNLOCK);
    saveState(getState());

 // In onMount():
-   if (state?.terminalUnlocked) {
+   if (state?.flags.includes('terminal-unlocked')) {
```

#### 5. `src/explorers/systems/QuestManager.ts` — Remove dead `mapUnlocked` logic

**File**: `src/explorers/systems/QuestManager.ts`
**Changes**: Remove the `mapUnlocked` logic from `completeQuest()` at line 89

```diff
   private completeQuest(quest: QuestDefinition): void {
     const state = this.getState();
     const newXp = state.xp + quest.rewards.xp;

     this.setState((s) => ({
       quests: {
         active: null,
         completed: [...s.quests.completed, quest.id],
       },
       xp: newXp,
-      mapUnlocked: quest.id === 'demo-quest-1' ? true : s.mapUnlocked,
     }));
```

#### 6. `src/explorers/QaOverlay.svelte` — Remove badges section

**File**: `src/explorers/QaOverlay.svelte`
**Changes**: Remove lines 143-147 (the flex badges div with intro/terminal/map indicators)

```diff
         </div>

-        <div class="flex flex-wrap gap-1.5">
-          <span class={state.introSeen ? 'text-green-400' : 'text-gray-600'}>intro</span>
-          <span class={state.terminalUnlocked ? 'text-green-400' : 'text-gray-600'}>terminal</span>
-          <span class={state.mapUnlocked ? 'text-green-400' : 'text-gray-600'}>map</span>
-        </div>
-
         <div>
```

#### 7. `src/explorers/state/GameStateManager.test.ts` — Update test

**File**: `src/explorers/state/GameStateManager.test.ts`
**Changes**: Remove `terminalUnlocked` from the roundtrip test (lines 36, 48)

```diff
   it('save → load roundtrip preserves state', () => {
     const state = createDefaultState();
     state.flags = ['keycode-found', 'terminal-unlocked'];
     state.xp = 75;
     state.currentMap = 'ship-bridge';
     state.quests.active = 'demo-quest-2';
     state.quests.completed = ['demo-quest-1'];
-    state.terminalUnlocked = true;

     saveState(state);
     const loaded = loadState();

     expect(loaded).not.toBeNull();
     expect(loaded!.version).toBe(1);
     expect(loaded!.flags).toEqual(['keycode-found', 'terminal-unlocked']);
     expect(loaded!.xp).toBe(75);
     expect(loaded!.currentMap).toBe('ship-bridge');
     expect(loaded!.quests.active).toBe('demo-quest-2');
     expect(loaded!.quests.completed).toEqual(['demo-quest-1']);
-    expect(loaded!.terminalUnlocked).toBe(true);
   });
```

### Success Criteria:

#### Automated Verification:

- [ ] Unit tests pass: `npm run test`
- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Fresh game (no save): cinematic plays, terminal lock screen works, code entry unlocks terminal, reloading restores unlocked state
- [ ] Existing save with old boolean fields: game loads without errors, terminal stays unlocked if it was before
- [ ] QaOverlay: badges section gone, flags section still displays all flags correctly

## Testing Strategy

### Unit Tests:

- Existing `GameStateManager.test.ts` roundtrip test updated (no boolean fields)
- `createDefaultState()` test still passes (no boolean fields in output)

### Manual Testing Steps:

1. Clear localStorage, start fresh game → cinematic should play once
2. Unlock terminal via code → terminal stays unlocked after reload
3. Check QaOverlay → no badges row, flags section shows active flags
4. Load a save that was created before this change → game works normally

## References

- `src/explorers/state/types.ts` — DemoGameState type definition
- `src/explorers/state/flagManager.ts` — Flag API (setFlag, hasFlag, removeFlag)
- `src/explorers/state/GameStateManager.ts` — Save/load logic
