---
date: 2026-03-05T00:00:00+01:00
researcher: Claude Sonnet 4.6
git_commit: 684beec2
branch: master
repository: przeprogramowani-sites
topic: "Cinematic intros feature — two bugs: awakening intro after reset, core AI room movement block"
tags: [research, codebase, cinematic-intro, GameScene, DialogueScene, QaOverlay, flagManager, GameStateManager]
status: complete
last_updated: 2026-03-05
last_updated_by: Claude Sonnet 4.6
---

# Research: Cinematic Intros Feature — Bug Analysis

**Date**: 2026-03-05
**Git Commit**: 684beec2
**Branch**: master

## Research Question

Two bugs in the cinematic intros feature:
1. After QaOverlay state reset, the awakening intro is not launched.
2. When entering the core AI room, the intro is missing and the astronaut cannot be steered.

Goal: every level should have an option to attach a cinematic intro based on a flag. If no intro config → load level normally. Intros must never permanently block movement.

---

## Summary

**Bug 1 — Awakening intro skipped after reset:**
The `resetState()` in `QaOverlay.svelte` saves fresh state (flags: []) to localStorage, but a pending **debounced save timer** (triggered by earlier `setFlag` calls) can fire during the subsequent `await fetch(DELETE/PUT)` calls, overwriting the fresh localStorage state with the OLD game state (containing `m0-intro-seen`). On reload, `mergeServerProgressIntoLocal` unions local + server flags, so the old `m0-intro-seen` persists in the merged state → intro skipped.

**Bug 2 — Core AI room: intro missing, movement blocked:**
The no-cinematic-card path in `playCinematicIntro` calls `startDialogue()` **synchronously inside `GameScene.create()`**, immediately after `scene.launch(DIALOGUE)`. Phaser's scene lifecycle operations are deferred — DialogueScene may not be fully awake/set up when `DIALOGUE_SHOW` fires. Result: `inDialogue = true` + input disabled (movement blocked), but DialogueScene never shows the dialogue UI.

---

## Detailed Findings

### How the cinematic intro system works

`src/explorers/scenes/GameScene.ts:341-345` — at the end of `create()`:
```typescript
const introConfig = getIntroConfig(this.mapKey);
if (introConfig && !this.hasFlag(introConfig.flag)) {
  this.playCinematicIntro(introConfig);
}
```

`src/explorers/levels/levelLoader.ts:91-98` — intro config is built from the manifest:
```typescript
if (manifest.introDialogue && manifest.introFlag) {
  introConfigs.set(mapKey, {
    dialogueId: manifest.introDialogue,
    flag: manifest.introFlag,
    cinematicTitle: manifest.introCinematicTitle,
    cinematicSubtitle: manifest.introCinematicSubtitle,
  });
}
```

`playCinematicIntro` has two paths (`src/explorers/scenes/GameScene.ts:536-638`):

**Path A — with cinematic card** (awakening map has `introCinematicTitle`):
- Sets `introPlaying = true`, hides player, starts tween sequence (~6.5 s total)
- Only after all tweens complete: sets flag, saves state, calls `startDialogue()`

**Path B — no cinematic card** (core AI map has no `introCinematicTitle`):
```typescript
if (!introConfig.cinematicTitle) {
  this.setFlag(introConfig.flag);
  saveState(this.gameState);
  this.startDialogue(introConfig.dialogueId);  // ← called synchronously in create()
  return;
}
```
Sets flag and emits `DIALOGUE_SHOW` **immediately**, still inside `create()`.

### Scene launch order in GameScene.create()

`src/explorers/scenes/GameScene.ts:312-320`:
```typescript
if (!this.scene.isActive(SceneKey.DIALOGUE)) {
  this.scene.launch(SceneKey.DIALOGUE);   // ← deferred by Phaser's scene manager
}
// ... TransitionScene, ExamScene ...

// Lines 341-344: intro check fires IMMEDIATELY after
```

`DialogueScene.create()` (`src/explorers/scenes/DialogueScene.ts:23-44`) registers the `DIALOGUE_SHOW` listener and then self-sleeps:
```typescript
this.bus.on(GameEvents.DIALOGUE_SHOW, onDialogueShow);
// ...
this.scene.sleep();  // starts in sleep mode
```

`scene.launch()` from within a running scene's `create()` is **deferred** — DialogueScene's own `create()` does not run until the CURRENT scene's `create()` returns (next game step). When Path B emits `DIALOGUE_SHOW` synchronously in the same `create()`, DialogueScene is not yet initialized. The event fires before the listener is registered.

### Bug 1 root cause — debounced save overwrites fresh state

`src/explorers/state/GameStateManager.ts:56-62`:
```typescript
export function debouncedSaveState(state: GameState): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveState(state);
    saveTimeout = null;
  }, 200);
}
```

`flagManager.ts`'s `setFlag()` calls `debouncedSaveState` with the CURRENT (old) game state.

`QaOverlay.svelte:110-144` — `resetState()` flow:
1. `saveState(freshState)` → localStorage = fresh (flags: [])
2. `await fetch('/api/game/state', { method: 'DELETE' })` → **JavaScript yields here**
3. **← debounced save timer (200 ms from earlier setFlag calls) fires here**
4. `saveState(oldState)` overwrites localStorage with old state (has `m0-intro-seen`)
5. `await fetch(PUT, freshState)` → server gets freshState
6. `game.destroy(true)` + `window.location.reload()`

On reload (`src/explorers/state/GameStateManager.ts:153`):
```typescript
flags: uniqueStrings([...serverState.flags, ...localState.flags]),
// serverState.flags = []  (from fresh server state)
// localState.flags = ['m0-intro-seen', ...]  (from overwritten localStorage)
// result.flags = ['m0-intro-seen']  ← intro blocked!
```

`SAVE_INTERVAL_MS = 30_000` (30 s) — the periodic autosave timer is a lower-risk variant of the same problem (can fire if the timer happens to be due during the 2× fetch await).

### Bug 2 root cause — DIALOGUE_SHOW fired before DialogueScene is ready

Entering core AI room for the first time:
1. TransitionScene calls `scene.restart()` on GameScene → new `create()` runs
2. `scene.launch(SceneKey.DIALOGUE)` at line 312 — queued for next game step
3. Path B fires: `startDialogue('m0-core-ai-intro')` at line 541 — **same synchronous `create()` call**
4. `startDialogue` sets `inDialogue = true`, disables input, emits `DIALOGUE_SHOW`
5. DialogueScene receives the event (listener on `game.events` persists across scene sleep/wake)
6. `showDialogue` → `this.scene.wake()` — but if the scene is mid-initialization from `launch()`, the wake may conflict or be a no-op
7. Result: dialogue bar never appears, player permanently stuck

The awakening intro escapes this bug because Path A uses tweens (~6.5 s) — DialogueScene is long since initialized by the time `startDialogue` is called.

---

## Code References

| File | Lines | Description |
|------|-------|-------------|
| `src/explorers/scenes/GameScene.ts` | 312-320 | `scene.launch(DIALOGUE)` — deferred scene init |
| `src/explorers/scenes/GameScene.ts` | 341-345 | Intro trigger — checked at end of `create()` |
| `src/explorers/scenes/GameScene.ts` | 536-543 | Path B (no cinematic card) — synchronous `startDialogue` |
| `src/explorers/scenes/GameScene.ts` | 546-638 | Path A (cinematic card) — deferred via tweens |
| `src/explorers/scenes/DialogueScene.ts` | 33-44 | DIALOGUE_SHOW listener registration + self-sleep |
| `src/explorers/scenes/DialogueScene.ts` | 60-75 | `showDialogue` — wakes scene and shows line |
| `src/explorers/state/GameStateManager.ts` | 56-62 | `debouncedSaveState` — 200 ms timer |
| `src/explorers/state/GameStateManager.ts` | 137-167 | `mergeServerProgressIntoLocal` — unions flags |
| `src/explorers/QaOverlay.svelte` | 110-144 | `resetState()` — the reset flow |
| `src/explorers/levels/m0-awakening/manifest.ts` | 21-24 | Awakening intro config (HAS cinematicTitle) |
| `src/explorers/levels/m0-core-ai/manifest.ts` | 45-46 | Core AI intro config (no cinematicTitle) |
| `src/explorers/config/flags.ts` | 19, 22 | `M0_INTRO_SEEN`, `M0_CORE_AI_INTRO_SEEN` |
| `src/explorers/config/constants.ts` | 44 | `SAVE_INTERVAL_MS = 30_000` |

---

## Architecture Insights

### Intro system design

The intro system is well-structured: manifests declare `introDialogue`, `introFlag`, and optionally `introCinematicTitle`/`introCinematicSubtitle`. `levelLoader.ts` builds a `Map<mapKey, introConfig>`. GameScene.create() checks once and plays if the flag isn't set. After intro, the flag is set so it never replays.

The design goal (every level can optionally have an intro; if none, load normally; no movement block) is **almost correctly implemented**. Two timing issues break it:
1. State reset doesn't flush pending debounced saves → old flags leak into next session.
2. Dialogue-only (no card) intro fires synchronously in `create()` before overlay scenes are ready.

### Scene lifecycle timing

Phaser defers `scene.launch()` effects to the next game step. Any code after `scene.launch()` in the current `create()` runs before the launched scene's `create()`. For time-based sequences (tweens, delayedCall), this is not a problem. For synchronous code paths, events emitted immediately after `scene.launch()` may not reach freshly launched/woken scenes.

---

## Proposed Fixes

### Fix 1 — Prevent stale state overwriting fresh state during reset

In `src/explorers/state/GameStateManager.ts`, make `debouncedSaveState` respect `skipSave`.
OR: in `QaOverlay.svelte` `resetState()`, call `flushSaveState(freshState)` immediately after `saveState(freshState)` to cancel any pending timer and lock in the fresh state.

Also add `skipSave` check to `GameScene`'s autosave timer callback (`GameScene.ts:331`):
```typescript
callback: () => {
  if (this.game.registry.get('skipSave')) return;  // add this guard
  this.updateState(...);
  saveState(this.gameState);
},
```

### Fix 2 — Defer DIALOGUE_SHOW in no-card intro path

In `playCinematicIntro` Path B, block movement immediately but defer the `DIALOGUE_SHOW` emission using `time.delayedCall(0, ...)`:
```typescript
if (!introConfig.cinematicTitle) {
  this.setFlag(introConfig.flag);
  saveState(this.gameState);
  // Block movement now, but emit DIALOGUE_SHOW after scene setup completes
  this.inDialogue = true;
  this.player.enterState('dialogue');
  this.inputController.setEnabled(false);
  this.interactionPrompt.hide();
  this.npcs.forEach((npc) => npc.freeze());
  this.time.delayedCall(0, () => {
    this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId: introConfig.dialogueId });
  });
  return;
}
```

`delayedCall(0, ...)` defers to the next game step, by which time Phaser has processed the `scene.launch(DIALOGUE)` from earlier in `create()`.

---

## Applied Fix (Implemented)

Implemented a lower-complexity refactor that removes timing-dependent behavior instead of adding more timing guards.

### 1) Local save path simplified (debounce removed)

- Removed `debouncedSaveState` and `flushSaveState` from `src/explorers/state/GameStateManager.ts`.
- `flagManager.ts` now persists immediately via `saveState(next)` in both `setFlag()` and `removeFlag()`.
- Added `skipSave` guard in `flagManager` so reset flow cannot re-save stale state while reset is in progress.

Effect: no pending localStorage timer remains that can overwrite fresh reset state during async reset requests.

### 2) Autosave guard tightened

- Added `if (this.game.registry.get('skipSave')) return;` to periodic autosave callback in `src/explorers/scenes/GameScene.ts`.
- Removed `flushSaveState(...)` usage from GameScene shutdown path (not needed after debounce removal).

Effect: reset no longer races against periodic autosave writes.

### 3) DialogueScene lifecycle simplified (always-on listener)

- `DialogueScene` no longer starts in `scene.sleep()`.
- Removed `scene.wake()`/`scene.sleep()` toggling from dialogue show/finish path.
- Scene remains active; dialogue UI visibility is controlled by `DialogueBar.show()/hide()` and internal `active` flag.

Effect: `DIALOGUE_SHOW` delivery is no longer coupled to launch/sleep/wake timing in the same frame as `GameScene.create()`.

### Validation

- `npm test` passed (`20` test files, `256` tests).
- `npm run build` passed.

### Follow-up consideration

The intro flag in the no-card path is still set before dialogue rendering is confirmed. This is acceptable for the current fix scope, but if we want stronger guarantees, move intro-flag persistence to a dialogue-start acknowledgment point.

---

## Open Questions

1. Should intro flags (e.g. `M0_CORE_AI_INTRO_SEEN`) be persisted only after dialogue rendering is confirmed, to avoid rare "flag set but dialogue failed" scenarios?
2. The `mergeServerProgressIntoLocal` function unions flags from both sources. For a reset scenario, should local flags be ignored entirely if the server signals a fresh state? Consider a `resetVersion` field or checking if server state is "default".
