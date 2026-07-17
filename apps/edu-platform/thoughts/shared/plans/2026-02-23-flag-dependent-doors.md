# Flag-Dependent Door Zones Implementation Plan

## Overview

Add flag-gated doors to 10x Explorers — doors that require one or more flags (AND logic) before the player can pass through. When the player interacts with a locked door, a configurable dialogue is shown instead of transitioning. Each locked door can have its own unique hint/message. Configuration uses the existing `InteractionRoute` manifest system.

## Current State Analysis

- **Door zones** (`GameScene.ts:346-348`) call `triggerDoorTransition()` unconditionally — no flag checks
- **Trigger zones** already have a `requiredFlag` property (single flag), but it's informational — the `InteractionDetector` still returns the zone regardless
- **InteractionRoute** system (`types.ts:5-15`) already supports `flagVariants` for dialogue branching on triggers, but doors never go through this system
- **`resolveDialogueId()`** (`GameScene.ts:371-392`) only runs for triggers and completed exams, not doors
- **Editor** (`ZonePropertiesPanel.svelte`) has `requiredFlag` input for triggers only, not doors

### Key Discoveries:

- `InteractiveObject.requiredFlag` getter (`InteractiveObject.ts:51-53`) reads from properties — we can add a similar `requiredFlags` getter
- `handleInteraction()` (`GameScene.ts:333-368`) switches on `objectType` — the `'door'` case just calls `triggerDoorTransition()` directly
- `resolveDialogueId()` is already generic — it looks up routes by `zoneId`, so it works for any zone type including doors
- Editor zone type switching (`ZonePropertiesPanel.svelte:39-59`) builds default properties per type — we just add `requiredFlags` to the door defaults

## Desired End State

1. Door zones can have a `requiredFlags` property (comma-separated string in map JSON, e.g. `"m0-exam-llm-basics-done,m0-exam-prompting-done"`)
2. When a player presses [E] on a flagged door:
   - **All flags present** → normal door transition
   - **Any flag missing** → shows a dialogue resolved via `InteractionRoute` (the `defaultDialogue` from the manifest)
3. Each locked door has its own configurable dialogue in the level manifest
4. The editor supports editing `requiredFlags` for door zones
5. No changes to the interaction prompt — locked doors still show `[E] Przejdź`

### Verification:

- Add `requiredFlags` to an existing door zone in a map JSON
- Add a corresponding `InteractionRoute` with a locked dialogue in the manifest
- Test: without flags → dialogue shows; with flags → transition works
- Editor: can edit `requiredFlags` on door zones

## What We're NOT Doing

- No OR logic for flags (AND only — all flags must be present)
- No visual indicator on locked doors (no lock icon, no different prompt text)
- No changes to the InteractionDetector (doors remain interactable regardless of flag state)
- No flag-specific dialogue variants (one locked dialogue per door, not per missing flag)
- No changes to existing trigger `requiredFlag` behavior

## Implementation Approach

The approach leverages the existing `InteractionRoute` + `resolveDialogueId()` system. The key change is in `GameScene.handleInteraction()` — before calling `triggerDoorTransition()`, check if the door has `requiredFlags` and if all are met. If not, resolve a dialogue ID via the route system and show it instead.

## Critical Implementation Details

### State Management Sequencing

- **Flag Check Timing**: Flag check happens synchronously in `handleInteraction()` before any async transition. Uses `this.hasFlag()` (O(1) via cached Set in BaseScene).
- **No Race Conditions**: The door interaction is a single synchronous check — either transition or dialogue. No concurrent state changes possible.

### User Experience Specification

- **Prompt**: Locked doors show same `[E] Przejdź` prompt as unlocked doors
- **Locked Interaction**: Player presses E → monologue/system dialogue plays (e.g., "Te drzwi wymagają specjalnego kodu...") → dialogue dismisses → player can move
- **Unlocked Interaction**: Identical to current behavior — fade transition to target map
- **Re-checking**: Every interaction re-checks flags, so if the player completes required actions and returns, the door works

### Debug & Observability Plan

- **Logging**: Add `devLog` in the door case showing which flags are required, which are present, and whether the door is unlocked
- **Verification**: Can be tested by setting/clearing flags in the browser console via `localStorage`

## Phase 1: Core Door Flag-Gating Logic

### Overview

Add `requiredFlags` parsing to `InteractiveObject` and flag-checking logic to `GameScene.handleInteraction()` for door zones.

### Changes Required:

#### 1. InteractiveObject — Add `requiredFlags` getter

**File**: `src/explorers/entities/InteractiveObject.ts`
**Changes**: Add a getter that parses comma-separated `requiredFlags` property into an array

```typescript
// After the existing requiredFlag getter (line 51-53)

/** Comma-separated required flags (AND logic). Empty array = no requirements. */
get requiredFlags(): string[] {
  const raw = this.properties['requiredFlags'] as string | undefined;
  if (!raw) return [];
  return raw.split(',').map((f) => f.trim()).filter(Boolean);
}
```

#### 2. GameScene — Check flags before door transition

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: In `handleInteraction()`, add flag check in the `'door'` case before calling `triggerDoorTransition()`

```typescript
case 'door': {
  const requiredFlags = obj.requiredFlags;
  if (requiredFlags.length > 0) {
    const missingFlags = requiredFlags.filter((f) => !this.hasFlag(f));
    if (missingFlags.length > 0) {
      devLog(`[GameScene] Door ${obj.objectId} locked — missing flags: ${missingFlags.join(', ')}`);
      const dialogueId = this.resolveDialogueId(obj);
      this.startDialogue(dialogueId);
      break;
    }
  }
  this.triggerDoorTransition(obj);
  break;
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npx tsc --noEmit`
- [x] All existing tests pass: `npm run test`

#### Manual Verification:

- [ ] Add `requiredFlags` to a door in map JSON + add InteractionRoute in manifest with a test dialogue
- [ ] Without flags: pressing E on the door shows the locked dialogue
- [ ] With flags: pressing E on the door transitions normally
- [ ] Doors without `requiredFlags` continue to work as before (no regression)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Editor Support

### Overview

Add `requiredFlags` field to the zone properties panel for door zones.

### Changes Required:

#### 1. ZonePropertiesPanel — Add requiredFlags input for doors

**File**: `src/explorers/editor/ZonePropertiesPanel.svelte`
**Changes**: Add a text input for `requiredFlags` (comma-separated) in the door fields section, after the spawnY field

```svelte
<!-- Inside {#if zone.type === 'door'} block, after the spawnX/spawnY div -->
<label class="flex flex-col gap-0.5">
  <span class="text-xs text-gray-500">requiredFlags (comma-separated)</span>
  <input
    type="text"
    value={getProp('requiredFlags')}
    oninput={(e) => {
      const val = (e.target as HTMLInputElement).value;
      if (val) setProp('requiredFlags', val);
      else if (zone) onUpdate({ ...zone, properties: zone.properties.filter(p => p.name !== 'requiredFlags') });
    }}
    placeholder="flag-a,flag-b"
    class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
  />
</label>
```

#### 2. ZonePropertiesPanel — Preserve requiredFlags on type switch

**File**: `src/explorers/editor/ZonePropertiesPanel.svelte`
**Changes**: In the `setType()` function, when switching to 'door', carry over the `requiredFlags` property if it exists

```typescript
} else if (newType === 'door') {
  baseProps.push({ name: 'targetMap', type: 'string', value: getProp('targetMap') || '' });
  baseProps.push({ name: 'spawnX', type: 'int', value: getIntProp('spawnX') });
  baseProps.push({ name: 'spawnY', type: 'int', value: getIntProp('spawnY') });
  const reqFlags = getProp('requiredFlags');
  if (reqFlags) baseProps.push({ name: 'requiredFlags', type: 'string', value: reqFlags });
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npx tsc --noEmit`

#### Manual Verification:

- [ ] Door zone in editor shows `requiredFlags` field
- [ ] Entering comma-separated flags saves correctly to the map JSON export
- [ ] Clearing the field removes the property from the zone
- [ ] Switching zone type to door preserves any existing requiredFlags value

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Example Configuration (Exam Room Door)

### Overview

Add a flag-gated door example using the existing exam room exit door. The door to crew room from exam room will require all three exams to be passed.

### Changes Required:

#### 1. Map JSON — Add requiredFlags to exam room exit door

**File**: `public/game/maps/m0-exam-room.json`
**Changes**: Add `requiredFlags` property to the `crew-room-door` zone

```json
{ "name": "requiredFlags", "type": "string", "value": "m0-exam-llm-basics-done,m0-exam-prompting-done,m0-exam-tokenization-done" }
```

#### 2. Exam Room Manifest — Add InteractionRoute for the door

**File**: `src/explorers/levels/m0-exam-room/manifest.ts`
**Changes**: Add an interaction route for `crew-room-door` with a locked dialogue

```typescript
interactionRoutes: [
  { zoneId: 'study-notes-board', defaultDialogue: 'm0-study-notes-board' },
  {
    zoneId: 'exam-llm-basics',
    defaultDialogue: 'm0-exam-llm-basics-already',
  },
  {
    zoneId: 'crew-room-door',
    defaultDialogue: 'm0-exam-room-door-locked',
  },
],
```

#### 3. Exam Room Dialogues — Add locked door dialogue

**File**: `src/explorers/levels/m0-exam-room/dialogues.ts`
**Changes**: Add a dialogue sequence for the locked door message

```typescript
'm0-exam-room-door-locked': {
  id: 'm0-exam-room-door-locked',
  lines: [
    {
      speaker: 'system',
      text: 'UWAGA: Wymagana certyfikacja przed opuszczeniem sali egzaminacyjnej.',
      mode: 'system',
      autoAdvance: 3000,
    },
    {
      speaker: 'astronaut',
      text: 'Wygląda na to, że muszę zdać wszystkie egzaminy, zanim stąd wyjdę...',
      mode: 'monologue',
    },
  ],
},
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npx tsc --noEmit`
- [x] All tests pass: `npm run test`

#### Manual Verification:

- [ ] Enter exam room with no exams completed → door shows locked dialogue
- [ ] Complete 1-2 exams → door still shows locked dialogue
- [ ] Complete all 3 exams → door transitions to crew room normally
- [ ] Other doors in the game (awakening ↔ crew room, awakening ↔ exam room) still work without restrictions

---

## Testing Strategy

### Unit Tests:

- `InteractiveObject.requiredFlags` getter: parses comma-separated, handles empty, handles whitespace
- No additional unit tests needed for GameScene (integration-level behavior)

### Manual Testing Steps:

1. Start fresh game (clear localStorage)
2. Navigate to exam room
3. Try to use the exit door → locked dialogue appears
4. Complete one exam → try door → still locked
5. Complete all three exams → try door → transition works
6. Return to exam room → exit door works immediately (flags persisted)
7. Check all other doors in the game → no regressions

## Performance Considerations

None — flag checking is O(n) where n is the number of required flags (typically 1-5), using the O(1) Set-based `hasFlag()`. Negligible overhead.

## References

- Current door handling: `src/explorers/scenes/GameScene.ts:346-348`
- InteractionRoute types: `src/explorers/levels/types.ts:5-15`
- Flag system: `src/explorers/state/flagManager.ts`
- Editor panel: `src/explorers/editor/ZonePropertiesPanel.svelte`
- Existing flag-variant routing: `src/explorers/scenes/GameScene.ts:371-392`
