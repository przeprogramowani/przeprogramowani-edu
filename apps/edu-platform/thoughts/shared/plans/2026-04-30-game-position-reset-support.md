# Game Position Reset — Support Fix Implementation Plan

## Overview

Introduce a `needsPositionReset` flag in `GameState` that allows support to override a player's corrupted position via a direct KV edit (wrangler CLI), bypassing the localStorage-wins merge rule that currently prevents KV fixes from taking effect.

## Current State Analysis

The game persists `currentMap`, `position`, and `facing` in both KV (server) and localStorage (client). The merge rule in `mergeServerProgressIntoLocal()` treats localStorage as authoritative for navigation state, which means a KV patch is silently overwritten on the next client load. Separately, client-side `resolveSafeSpawnPosition()` / `sanitizeSpawnPosition()` do auto-correct invalid positions at scene load — but only after the bad local state has already been applied.

### Key Discoveries:

- `mergeServerProgressIntoLocal()` at `src/explorers/state/GameStateManager.ts:129-133` explicitly spreads `...serverState` then overrides `currentMap`, `position`, `facing` with local values — this is the blocker
- `isValidGameState()` at `src/pages/api/game/state.ts:13-34` is a loose validator; it checks required fields only and does not strip unknown fields, so `needsPositionReset` passes through unmodified on PUT
- KV key format: `v1-game-state-{email}`, namespace binding `GAME_STATE` (ID `20d16620dfdb441a99454c15fea0dc09`)
- Default safe spawn from `createDefaultState()`: `m0-awakening`, `position: { x: 128, y: 256 }` (tile 2×4 at 64px)

## Desired End State

Support edits a player's KV entry via wrangler CLI, setting `needsPositionReset: true` plus corrected `position` and `currentMap` values. On the player's next game load, the merge logic detects the flag, takes the server's navigation state as authoritative (instead of local), clears the flag, and saves the corrected state back to KV. The player is placed at the intended position with no visible disruption.

### Key Discoveries:

- The fix is entirely client-driven — no new API endpoint needed
- The flag auto-clears in the merged client state, and the boot flow must immediately flush that merged state back to KV when the reset flag was consumed
- Existing test at `GameStateManager.test.ts:69-78` (`mergeServerProgressIntoLocal returns server state when local is missing`) will continue to pass as long as we only add `needsPositionReset: false` to the return when the flag was explicitly `true`

## What We're NOT Doing

- No new API endpoint for support-triggered fixes
- No admin authentication layer (direct KV access via wrangler CLI is the support mechanism)
- No position boundary validation on PUT `/api/game/state`
- No player-visible notification when the fix is applied
- No manual Supabase sync for the support patch (the boot-time state save after consuming the reset flag restores consistency through the normal sync path)
- No server-side safe-position computation (support sets the exact coordinates manually)

## Implementation Approach

Minimal, self-cleaning flag in the `GameState` schema. The merge function checks the flag once, applies server navigation state if set, then emits `needsPositionReset: false`. The boot flow must flush that merged state back to `/api/game/state` when it consumed a reset flag so KV does not retain the flag after the first load. Four code/doc files change.

## Phase 1: Extend GameState Type

### Overview

Add the optional `needsPositionReset` field to the `GameState` interface so TypeScript accepts it everywhere the type is used.

### Changes Required:

#### 1. GameState interface

**File**: `src/explorers/state/types.ts`

**Changes**: Add `needsPositionReset?: boolean` as an optional field to the `GameState` interface, after the `bookmarks` field. The field is optional so existing saved states (which won't have it) are still valid — TypeScript treats the absence as `undefined`, which is falsy and won't trigger the override path.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compilation passes: `npm run build`
- [x] No type errors in related files: `npx tsc --noEmit`

---

## Phase 2: Update Merge Logic

### Overview

Update `mergeServerProgressIntoLocal()` to honour the flag: when `serverState.needsPositionReset` is `true`, take the server's `currentMap`, `position`, and `facing` instead of the local values, and emit `needsPositionReset: false` in the merged result.

### Changes Required:

#### 1. mergeServerProgressIntoLocal function

**File**: `src/explorers/state/GameStateManager.ts`

**Changes**:

In the `localState === null` early return path, spread with `needsPositionReset: false` only when the flag is `true`, to prevent it persisting if it was set in KV and there was no local state:

```typescript
if (!localState) {
  return serverState.needsPositionReset ? { ...serverState, needsPositionReset: false } : serverState;
}
```

In the main merge return, add a `useServerNavigation` guard before overriding the three navigation fields:

```typescript
const useServerNavigation = serverState.needsPositionReset === true;

return {
  ...serverState,
  currentMap: useServerNavigation ? serverState.currentMap : localState.currentMap,
  position: useServerNavigation ? serverState.position : localState.position,
  facing: useServerNavigation ? serverState.facing : localState.facing,
  ...(useServerNavigation ? { needsPositionReset: false } : {}),
  flags: ...,
  // rest unchanged
};
```

Using a conditional spread `...(useServerNavigation ? { needsPositionReset: false } : {})` avoids adding the field to states that never had it, which keeps the existing `expect(merged).toEqual(server)` test green.

### Success Criteria:

#### Automated Verification:

- [x] All existing tests pass: `npm run test -- GameStateManager`
- [x] TypeScript passes: `npx tsc --noEmit`

#### Manual Verification:

- [ ] Simulate fix in browser console: set localStorage `space-explorers-state-v2` to state with bad position; load the game with server returning `needsPositionReset: true` and correct position — verify player spawns at correct position
- [ ] Verify flag is cleared: after above test, check localStorage — `needsPositionReset` should be `false` or absent
- [ ] Verify a `PUT /api/game/state` is sent on the reset load even when there are no pending grants, and that the payload contains `needsPositionReset: false`

**Implementation Note**: After this phase passes automated checks, pause for manual browser verification before proceeding.

---

## Phase 3: Add Tests for New Merge Behaviour

### Overview

Extend `GameStateManager.test.ts` with explicit coverage of the flag paths. This documents the invariants and prevents regressions.

### Changes Required:

#### 1. New test cases

**File**: `src/explorers/state/GameStateManager.test.ts`

**Changes**: Add three test cases in the `mergeServerProgressIntoLocal` describe block:

1. `needsPositionReset: true` with local state present → merged uses server's `currentMap`, `position`, `facing`; merged `needsPositionReset` is `false`
2. `needsPositionReset: false` (or absent) with local state present → local navigation wins (existing behaviour, but now explicitly documented)
3. `needsPositionReset: true` with no local state (`null`) → returned state has `needsPositionReset: false`

### Success Criteria:

#### Automated Verification:

- [x] All tests pass including new cases: `npm run test -- GameStateManager`
- [x] Coverage includes the three new test paths

---

## Phase 4: Support Runbook

### Overview

Document the wrangler CLI steps support uses to apply a position fix. This is the operational procedure — no code changes, just a markdown guide in the game AI docs directory.

### Changes Required:

#### 1. Support runbook

**File**: `.ai/10x-devs/game/support-position-fix.md`

**Changes**: Create a new file with the following content:

---

```markdown
# Support Runbook: Player Position Fix

Use this when a player reports being stuck outside the map or in an unreachable location.

## Prerequisites

- `wrangler` CLI installed and authenticated to the Cloudflare account
- Player's account email address

## Step 1: Read current KV state

```bash
wrangler kv key get \
  --binding GAME_STATE \
  "v1-game-state-{player-email}" \
  --namespace-id 20d16620dfdb441a99454c15fea0dc09 \
  --text
```

Copy the full JSON output into `patched-state.json`.

## Step 2: Edit the state

Preserve the full existing JSON object. Change only these fields:

```json
{
  "needsPositionReset": true,
  "currentMap": "m0-awakening",
  "position": { "x": 128, "y": 256 }
}
```

**Safe spawn coordinates per map** (tile × 64px):

| Map             | Safe position      |
|-----------------|--------------------|
| m0-awakening    | `{"x":128,"y":256}` (tile 2×4) |
| m0-crew-room    | `{"x":128,"y":128}` (tile 2×2) |
| m0-exam-room    | `{"x":128,"y":128}` (tile 2×2) |
| m0-core-ai      | `{"x":128,"y":128}` (tile 2×2) |

If the player's `currentMap` is correct but their position is wrong, keep their map and only override `position` (plus set `needsPositionReset: true`).

Do not replace the state with only the snippet above. The player state also contains progress fields such as `flags`, `quests`, `xp`, `commandHistory`, and `bookmarks`; those must remain in the JSON.

## Step 3: Write the patched state back

```bash
wrangler kv key put \
  --binding GAME_STATE \
  "v1-game-state-{player-email}" \
  --path patched-state.json \
  --namespace-id 20d16620dfdb441a99454c15fea0dc09
```

## Step 4: Instruct the player to reload

Tell the player to hard-reload the game (Ctrl+Shift+R / Cmd+Shift+R). On next load, the game will detect `needsPositionReset: true`, place them at the corrected position, and immediately write the cleared flag back to KV.

## Verification

After the player confirms they can move freely, the fix is complete. No manual Supabase update is needed — the boot-time state save restores consistency through the normal game-state sync path.
```

### Success Criteria:

#### Manual Verification:

- [ ] Runbook has been reviewed against actual wrangler CLI syntax
- [ ] Safe spawn coordinates verified in the game editor for each map listed

---

## Testing Strategy

### Unit Tests:

- `needsPositionReset: true` → server navigation wins, flag clears
- `needsPositionReset: false/absent` → local navigation wins (no regression)
- `localState: null` + `needsPositionReset: true` → flag clears in returned state

### Manual Testing Steps:

1. In browser DevTools, set `space-explorers-state-v2` in localStorage to a valid GameState with an obviously wrong position (e.g., `x: 9999, y: 9999`)
2. Mock or intercept `GET /api/game/state` to return a state with `needsPositionReset: true` and a valid position
3. Reload the game — verify player spawns at the server-specified position, not the localStorage position
4. Check localStorage after load — `needsPositionReset` should be `false`
5. Reload again without the mock — verify the position stays correct (flag did not persist)

<!-- PLAN COMPLETED: 2026-05-01 -->

## References

- Merge logic: `src/explorers/state/GameStateManager.ts:118-148`
- State type: `src/explorers/state/types.ts:6-21`
- State API validator: `src/pages/api/game/state.ts:13-34`
- KV client: `src/server/game/remoteGameStateKV.ts`
- Default spawn: `createDefaultState()` in `GameStateManager.ts:6-23` — `m0-awakening`, `{x:128, y:256}`
