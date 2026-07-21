# QA Autopilot — Guided Automatic Playthrough Implementation Plan

> After approval, save a copy to `thoughts/shared/plans/2026-07-17-qa-autopilot.md` (relative to `projects/edu-platform`) per the 10x-plan convention, so `/10x-implement` can discover it.

## Context

Maintainers currently verify Space Explorers content by playing the game manually. Automated tests check that referenced IDs exist and maps compile, but nothing verifies that the game is actually *playable* end-to-end — that doors unlock in order, dialogues fire, exams pass, and quests chain correctly. The user wants an **Autopilot** in the existing `?qa` overlay: "Start autopilot" resets state and begins a forward-only scripted playthrough; "Next step" (or an Auto toggle) advances one beat at a time while the maintainer watches the player walk, talk, take exams, and progress through every level in logical order. Manual involvement is minimized; timeline never rewinds.

Decisions made during planning (all ⭐ recommendations accepted by the user):

| Decision | Choice |
|---|---|
| Movement fidelity | Player visibly **walks via BFS pathfinding** over the collision grid, presses E via virtual input |
| Exams | **Visibly auto-answered** in the real ExamScene (correct options selected with pacing), via a new public hook |
| Step granularity | One logical **beat per "Next step"** + an **Auto toggle** that chains beats with a pause |
| Coverage | **Critical path only** (9 levels; no crew-room arcades / optional chatter) |
| Script source | **Hand-authored step script** + Vitest completeness test enforcing forward-only progression |
| On failure | **Halt and report** (state left intact for debugging) |

## Current State Analysis

- **Progression is a strict linear flag-gated chain** (no timeline reversal needed by construction):
  `m0-awakening` (intro → loot-terminal → info-board sets `m0-info-board-read`, activates `q-pass-exams`) → `m0-exam-room` (3 exams, each sets `m0-exam-*-done`; all three unlock the CORE AI door and complete event-quest `q-pass-exams`) → `m0-core-ai` (intro → firmware console sets `cmds:navi`/`cmds:support` → malfunction → support manual → `q-earth-signal` (api-answer) sets `m0-earth-signal-received`) → navigation deck (`moon-1` requires `m0-earth-signal-received` + `sys:course-m1-available`) → `m1-landing-pad` → `m1-echo-depths` → `m1-shaft-control` → `m1-profile-vault` → `m1-uplink-bay`. Each m1 level: intro → console dialogue activates an api-answer quest → quest reward flag unlocks the next door. `debug-npc-playground` and `m0-crew-room` are off the critical path.
- **QA overlay precedent**: `src/explorers/QaOverlay.svelte` (mounted by `PhaserGame.svelte:344-346` when `?qa`) already jumps maps (`TRANSITION_START` + `QA_MAP_SPAWNS`), adds flags, sets XP, launches dialogues, and resets state (localStorage default + `DELETE`/`PUT /api/game/state` + `game.destroy` + reload, `resetState` lines 173-207).
- **Existing driving seams**:
  - Dialogue advance: `game.events.emit('virtual-space')` / `'virtual-esc'` (DialogueScene.ts:39-46); end signal `DIALOGUE_DISMISSED`; `autoAdvance` lines self-advance.
  - Movement: `InputController.setVirtualDirection(dir, bool)` (:50) and `pulseVirtualInteract()` (:65), reachable via `GameScene.getInputController()` (:636); player position via `GameScene.getPlayer()`; interaction targets in public `GameScene.zoneObjects` (:62). Virtual input is gated by `InputController.enabled` (disabled during overlays).
  - Collision: `GameScene.buildCollisionGrid()` (:917) produces `{width,height,collisions[][]}` — currently **private** (`this.collisionGrid`, :56).
  - Map switch: emit `TRANSITION_START {targetMap, spawnX, spawnY}`; await `TRANSITION_COMPLETE` (TransitionScene.ts:80, no payload).
  - Quests: `QuestManager` is on the registry (`game.registry.get('questManager')`). All 6 story quests are **api-answer** (answers exist only as server-side hashes) — legitimately completable client-side via `QUEST_COMPLETE_REQUEST {questId}` → `completeQuestById` (PhaserGame.svelte:224-226; QuestManager.ts:165) which grants XP + reward flags + completion dialogue. Event-quest `q-pass-exams` auto-completes once the 3 exam flags are set.
  - Exams: `correctOptionIds` ship to the client (ExamTypes.ts:31, not stripped by `api/game.ts`). But `ExamScene` selection/submit are private and its `ExamManager` is not on the registry → needs a small public hook. Pass signal: `EXAM_COMPLETED {examId, passed, ...}`.
  - Navigation: `NavigationScene.launchTo(dest)` (private, :247) plays the ~2.8s warp then emits `TRANSITION_START`. `NAVIGATION_SHOW` payload is ignored → deck can be opened programmatically; needs a tiny public launch hook.
  - Intros: cinematic card ≈4.5s before dialogue; spotlight expands after dialogue dismiss; the intro's seen-flag being set (observable via `FLAG_SET`) is the "intro fully done" signal (GameScene.ts:738-748). Input is disabled until then.
- **Gates needing QA-local handling**: `sys:course-m1-available` is a read-only server flag (`setFlag` rejects `sys:`, flagManager.ts:11-13); it lives in the separate registry Set `'systemFlags'` (BootScene.ts:53-55) which can be mutated directly. Server-side **pending grants are not cleared by the QA reset** and re-merge after reload (`applyPendingGrants`, PhaserGame.svelte:143-196) — reset must drain them.

## Desired End State

In `/explorers?qa`, the overlay has an **Autopilot** panel. Pressing **Start autopilot** (with confirm) resets all state (local + server + pending grants) and reloads; the overlay comes back armed at step 0 of the scripted critical path. Each **Next step** executes one beat — the player walks to the target, the real UI plays out — and the panel shows "Step i/N — <label>". **Auto** chains beats with a short pause. If a beat can't complete (locked door, missing zone, no path, timeout), the run **halts** with a red report naming the step, what was expected, and what was found. The run ends after `q-uplink-to-earth` completes in `m1-uplink-bay`. A Vitest proves the script stays complete and forward-only as content evolves.

### Key Discoveries (references for the implementer)

- `QaOverlay.svelte:109-207` — map jump / flag / reset patterns to reuse
- `DialogueScene.ts:39-46` — `virtual-space`/`virtual-esc` listeners
- `InputController.ts:50-103` — virtual direction + interact pulse
- `GameScene.ts:56,62,632-636,917` — collision grid (make accessible), `zoneObjects`, player/input accessors
- `QuestManager.ts:102,165,288` — `activateQuest`, `completeQuestById`
- `ExamScene.ts:68,456-474,584` + `ExamManager.ts:54-135` — exam internals the hook will drive
- `NavigationScene.ts:247,336-340` — `launchTo` internals
- `navigationDestinations.ts:48-62` — `moon-1` → `m1-landing-pad` spawn (2,7), required flags
- `PhaserGame.svelte:143-196,224-226` — pending-grant poller, quest-complete request handler
- `config/qaMapSpawns.ts` — per-map safe spawns (fallback teleport targets are NOT used — halt instead — but spawns validate script start points)
- `levels/contentValidation.ts:107-393` — pattern for the completeness test (loads compiled map JSON, walks manifests)

## What We're NOT Doing

- No arcade coverage (crew-room detours) and no `ArcadeScene` force-finish seam
- No auto-derived step solver — the script is hand-authored
- No headless/CI playthrough (browser-only, human-watched)
- No skip/force-continue on failure (halt only, per decision; can be added later)
- No coverage of optional/flavor dialogues, post-quest flag variants, `debug-npc-playground`, or the not-yet-existing `m2-planning`
- No changes to production gameplay behavior — every new hook is inert unless the autopilot drives it; no new UI outside the `?qa` overlay
- No server/API changes

## Implementation Approach

All new code lives in `src/explorers/qa/` (new directory), driven by `QaOverlay.svelte`. The engine is a plain TS class that owns a step cursor and executes **beats** against the running game exclusively through existing public seams plus three small additive hooks (`GameScene` grid accessor, `ExamScene` auto-answer, `NavigationScene` launch). Every beat = (optional walk) + (trigger) + (await expected event with timeout). The authored script is data (typed step objects), so the Vitest can simulate it without Phaser: replay steps accumulating flags, asserting every gate is satisfied by earlier steps (forward-only) and every referenced id exists in manifests/compiled maps.

## Critical Implementation Details

- **Reset → resume across reload**: `resetState` destroys the game and reloads the page, so the engine cannot survive it. Before reload, write `sessionStorage['qa-autopilot'] = JSON.stringify({armed: true, auto: <bool>})`; on QaOverlay mount, read + clear the marker and arm the engine at step 0 (auto-run if `auto` was on). The reset must also **drain pending grants**: after `DELETE /api/game/state`, `GET /api/game/pending` and, if non-empty, `PUT /api/game/state` with `{state: freshState, appliedGrantIds: [...ids]}` (the existing clear mechanism, `state.ts:128-131`) — otherwise old quest grants re-merge after reload.
- **Await-with-timeout is the halt mechanism**: every expected signal (`TRANSITION_COMPLETE`, `DIALOGUE_DISMISSED`, `EXAM_COMPLETED`, `QUEST_COMPLETED`, `FLAG_SET` for intro flags) gets a single-shot listener + timeout (default ~15s; walking beats compute a generous budget from path length). Timeout → halt with `{stepIndex, stepLabel, expected, observed}`. Never auto-teleport or auto-grant on failure.
- **Walking requires input to be enabled**: `InputController.setEnabled(false)` is active during dialogues/exams/intros. The engine must await the previous beat's dismiss signal before starting a walk, and must treat the automatic level intro as a first-class beat (`await-intro` awaits `FLAG_SET` of the intro flag) — on m1 maps the intro starts on arrival, immediately after the door/nav transition.
- **Facing for interaction**: `InteractionDetector` requires proximity (48px) and facing. Path to the nearest walkable tile adjacent to the zone rect, then take the final step *toward* the zone center so facing derives from the last movement direction before `pulseVirtualInteract()`. If the interaction opens something other than the expected outcome (wrong dialogue id), halt with a mismatch report.
- **Dialogue advance pacing**: emit `virtual-space` on an interval (~600ms); first press reveals the typewriter, second advances; `autoAdvance` (system/cinematic) lines advance themselves — the interval is harmless there. Stop on `DIALOGUE_DISMISSED`.
- **`sys:` override**: `game.registry.get('systemFlags')` is a plain `Set` read lazily by `hasFlag` — add `sys:course-m1-available` right before the navigation beat (a dedicated `grant-sys-flag` step) and show "(QA override)" in the panel. Do not touch `setFlag`.
- **i18n guard**: new UI strings are dev-tool English inside `QaOverlay.svelte` (already excluded from `noHardcodedPolish`); keep `src/explorers/qa/*.ts` free of Polish literals so the static-analysis test stays green.

---

## Phase 1: Step model, authored script, completeness test

### Overview
Define the step vocabulary, author the full critical-path script, and lock it with a simulation test.

### Changes Required:

#### 1. Step types
**File**: `src/explorers/qa/autopilotTypes.ts` (new)
**Intent**: Typed step/beat definitions the engine executes and the test simulates.
**Contract**: Discriminated union `AutopilotStep` with kinds:
- `await-intro { mapKey, introFlag }` — wait for the auto-playing intro to finish
- `interact { mapKey, zoneId, expectDialogue: string, advance?: 'auto' }` — walk + E + advance dialogue to dismiss
- `exam { mapKey, zoneId, examId }` — walk + E + drive ExamScene hook, await pass
- `complete-quest { questId, activate?: boolean, expectFlags: string[] }` — registry QuestManager: optional `activateQuest`, then `QUEST_COMPLETE_REQUEST`, await `QUEST_COMPLETED` + completion dialogue dismiss
- `door { mapKey, zoneId, targetMap }` — walk + E, await `TRANSITION_COMPLETE`
- `navigate { mapKey, zoneId, destinationId, targetMap }` — walk + E (deck opens), call NavigationScene hook, await `TRANSITION_COMPLETE`
- `grant-sys-flag { flag }` — QA-local systemFlags override
Each step also carries `label: string` (shown in the panel) and optional `producesFlags: string[]` / `requiresFlags: string[]` metadata for the simulation test.

#### 2. Authored script
**File**: `src/explorers/qa/autopilotScript.ts` (new)
**Intent**: The ordered critical-path beats for all 9 levels, per the progression graph in Current State Analysis (m0-awakening beats → exam-room's 3 exams → core-ai firmware/malfunction/support chain → `q-earth-signal` complete → `grant-sys-flag` → navigate moon-1 → per-m1-level: await-intro, console `interact` (activates quest), `complete-quest`, exit `door`; final step completes `q-uplink-to-earth`).
**Contract**: `export const AUTOPILOT_SCRIPT: AutopilotStep[]`. Zone ids, dialogue ids, exam ids, quest ids, and flag names must match manifests/yaml exactly (the test enforces this). Note: `q-earth-signal` is activated in-fiction via the terminal `/support` flow — the script uses `complete-quest` with `activate: true` instead (documented inline).

#### 3. Completeness / forward-only test
**File**: `src/explorers/qa/autopilotScript.test.ts` (new)
**Intent**: Prove the script is executable forward-only and stays in sync with content.
**Contract**: Pure simulation over `ALL_LEVELS` + compiled `public/game/maps/*.json` (loading pattern from `contentValidation.ts`): replay steps carrying a flag accumulator (intro flags, dialogue `onComplete.setFlags`, exam reward flags, quest reward flags, sys grants). Assert per step: referenced map/zone/dialogue/exam/quest exists; zone type matches step kind; door/nav `requiredFlags ⊆ accumulated` **before** the step; exam zones' `requiredFlag` satisfied; current map continuity (each step's `mapKey` equals the map produced by the previous transition). Assert overall: script visits the 9 critical-path levels in door-graph order and ends with `m1-uplink-done` accumulated.

### Success Criteria:

#### Automated Verification:
- `npx vitest run src/explorers/qa/autopilotScript.test.ts` passes
- `npm run check` passes

#### Manual Verification:
- Script read-through matches the intended narrative order (sanity skim)

---

## Phase 2: Driver primitives and engine hooks

### Overview
The reusable pieces the engine composes: pathfinding + walking, dialogue advancing, exam/navigation hooks, sys-flag override, hardened reset.

### Changes Required:

#### 1. Grid pathfinder
**File**: `src/explorers/qa/gridPath.ts` (new)
**Intent**: BFS over the collision grid returning a tile path; pure function, unit-testable.
**Contract**: `findPath(grid: {width,height,collisions:boolean[][]}, from: Tile, to: Tile): Tile[] | null`. 4-directional.

#### 2. Collision grid accessor
**File**: `src/explorers/scenes/GameScene.ts`
**Intent**: Expose the already-built collision grid and current map key to QA tooling.
**Contract**: Public `getCollisionGrid(): SpawnCollisionGrid | null` (returns `this.collisionGrid`); `zoneObjects` and `getPlayer()`/`getInputController()` already public.

#### 3. Walk driver
**File**: `src/explorers/qa/walkDriver.ts` (new)
**Intent**: Walk the player along a path using `setVirtualDirection`, then face the zone and stop.
**Contract**: `async walkToZone(game, zoneId, opts): Promise<void>` — resolves target tile adjacent to the zone rect (final step toward zone center for facing), steers per-frame toward each waypoint (poll `getPlayer().x/y`, ~50ms tick), rejects on: no path, stuck (no progress > ~3s), or input disabled beyond budget. Clears all virtual directions on exit (success or failure).

#### 4. Dialogue advancer
**File**: `src/explorers/qa/dialogueDriver.ts` (new)
**Intent**: Advance any visible dialogue to completion.
**Contract**: `async advanceDialogue(game, expectedId?, timeoutMs?)` — emits `virtual-space` every ~600ms until `DIALOGUE_DISMISSED`; if a `DIALOGUE_SHOW` for a different id than expected is observed, reject with mismatch.

#### 5. ExamScene autopilot hook
**File**: `src/explorers/scenes/ExamScene.ts`
**Intent**: Let the autopilot visibly answer the active exam correctly.
**Contract**: Public `autopilotAnswer(pacingMs = 700): void` — no-op unless the scene is awake with an active exam. Internally iterates questions on a timer: select each question's `correctOptionIds` via the existing `selectOption`, advance via the existing next/submit path, ending in the real `submitExam()` → results screen. External completion signal remains `EXAM_COMPLETED`.

#### 6. NavigationScene autopilot hook
**File**: `src/explorers/scenes/NavigationScene.ts`
**Intent**: Programmatically launch an available destination with the real warp cinematic.
**Contract**: Public `autopilotLaunch(destinationId: string): boolean` — finds the destination in `NAV_DESTINATIONS`, verifies `getDestinationStatus(...) === 'available'` with the game's `hasFlag`, calls the private `launchTo(dest)`; returns false (engine halts) if unavailable.

#### 7. sys-flag override + hardened reset
**File**: `src/explorers/qa/qaState.ts` (new)
**Intent**: QA-local system-flag grant; reset that drains pending grants and arms resume.
**Contract**: `grantSystemFlagOverride(game, flag)` mutates `registry.get('systemFlags')` Set (creates it if absent). `autopilotReset(game, {auto}): Promise<never>` — replicates `QaOverlay.resetState` (skipSave, local default state, `DELETE /api/game/state`, `PUT` wrapped default) **plus** drains `/api/game/pending` via `appliedGrantIds`, writes the `sessionStorage['qa-autopilot']` resume marker, destroys the game, reloads. Move/reuse the existing reset logic here so QaOverlay's plain Reset button and autopilot share one implementation.

### Success Criteria:

#### Automated Verification:
- `npx vitest run src/explorers/qa/gridPath.test.ts` passes (new unit test: path found/blocked/adjacent-target cases)
- `npx vitest run` full suite passes (i18n static-analysis, content validation untouched)
- `npm run check` passes

#### Manual Verification:
- From the browser console in `?qa` mode: walk driver moves the player to a named zone and the E-pulse opens its dialogue
- `autopilotAnswer()` visibly answers and passes an m0 exam

---

## Phase 3: AutopilotEngine orchestrator

### Overview
The state machine that executes the script beat-by-beat with halt-and-report semantics.

### Changes Required:

#### 1. Engine
**File**: `src/explorers/qa/AutopilotEngine.ts` (new)
**Intent**: Own the cursor over `AUTOPILOT_SCRIPT`; execute one beat per `next()`; Auto mode chains beats; surface status to the UI.
**Contract**:
- `status: {phase: 'idle'|'armed'|'running'|'waiting'|'halted'|'done', stepIndex, stepLabel, error?: {expected, observed}}` exposed via a callback/store the Svelte panel subscribes to
- `start(auto: boolean)` → `autopilotReset(...)` (never returns); `resumeFromMarker()` called on mount arms at step 0
- `next(): Promise<void>` — executes the current step: dispatch by kind to the Phase-2 drivers; every await is single-shot listener + timeout; on success advance cursor (and auto-continue after ~800ms pause when Auto is on); on failure set `halted` with the report and stop permanently (state untouched)
- `stop()` — cancel timers/listeners, clear virtual input, back to `idle`
- Beat sequencing details: after `door`/`navigate`, if the target map has an unseen intro the engine automatically runs the following `await-intro` step's wait as part of arrival when Auto is on; `complete-quest` awaits `QUEST_COMPLETED` then advances the completion dialogue via the dialogue driver

### Success Criteria:

#### Automated Verification:
- `npm run check` and full `npx vitest run` pass

#### Manual Verification:
- With the engine driven from the console (pre-UI), `next()` walks through the first three m0-awakening beats correctly and halts with a readable report when a required flag is manually removed

---

## Phase 4: QA overlay Autopilot panel

### Overview
The UI: start/next/auto/stop, live status, error banner, resume-after-reload.

### Changes Required:

#### 1. Panel
**File**: `src/explorers/QaOverlay.svelte`
**Intent**: New collapsible "Autopilot" section wired to the engine; auto-arm on mount when the resume marker exists.
**Contract**: Buttons: **Start autopilot** (confirm dialog → `engine.start(auto)`), **Next step** (enabled when `armed`/`waiting`), **Auto** toggle, **Stop**. Status line "Step i/N — <label>" + current map; red banner on halt showing `expected` vs `observed`; "(QA override)" note when the sys-flag step ran. On mount: `engine.resumeFromMarker()`. Existing Reset button now calls the shared reset in `qaState.ts` (without arming autopilot). English strings (dev tool).

### Success Criteria:

#### Automated Verification:
- `npm run check`, full `npx vitest run`, `npm run build` pass

#### Manual Verification:
- Start → confirm → page reloads → panel shows "armed, step 1/N"
- Stepping and Auto both work; Stop cancels cleanly and normal QA controls still function

---

## Phase 5: End-to-end verification & docs

### Overview
Full-run validation and cookbook documentation.

### Changes Required:

#### 1. Cookbook section
**File**: `.ai/10x-devs/game/cookbook.md`
**Intent**: Document the autopilot (how to run it, how to add steps for a new level — new checklist item in "Adding a New Level"), and the rule that the completeness test must pass when content changes.
**Contract**: New "QA Autopilot" section + one checklist bullet.

### Success Criteria:

#### Automated Verification:
- `npm run check`, `npx vitest run`, `npm run build` all pass (pre-push trio for server-adjacent changes — `GameScene`/`ExamScene`/`NavigationScene` are client-only but the trio is cheap insurance)

#### Manual Verification:
- **Full happy path**: `/explorers?qa` → Start autopilot → Auto on → watch the entire run complete from hibernation bay to `q-uplink-to-earth` in `m1-uplink-bay` with no manual input
- **Halt path**: temporarily break one gate (e.g. remove a door's flag from the script's producer) → autopilot halts with an accurate report at the right beat
- Works for an anonymous session and an authenticated session (server reset + pending-grant drain verified)

---

## Testing Strategy

- **Unit**: `gridPath.test.ts` (BFS cases); `autopilotScript.test.ts` (the forward-only simulation — the long-term guardrail)
- **Integration (manual, browser)**: full Auto run; per-beat stepping; halt-and-report; reset for anon + authed users
- **Regression**: existing suites (`contentValidation`, `bilingualParity`, `noHardcodedPolish`, `mapSync`) must stay green — new hooks are additive and inert outside QA mode

## References

- Architecture + seams research: this session (QaOverlay, DialogueScene, ExamScene/ExamManager, QuestManager, NavigationScene, InputController, GameScene, GamePersistence, flags — see Key Discoveries)
- Cookbook: `.ai/10x-devs/game/cookbook.md`
- QA overlay: `src/explorers/QaOverlay.svelte`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands.

### Phase 1: Step model, authored script, completeness test
#### Automated
- [ ] 1.1 autopilotScript.test.ts passes
- [ ] 1.2 npm run check passes
#### Manual
- [ ] 1.3 Script narrative order skim

### Phase 2: Driver primitives and engine hooks
#### Automated
- [ ] 2.1 gridPath.test.ts passes
- [ ] 2.2 Full vitest suite passes
- [ ] 2.3 npm run check passes
#### Manual
- [ ] 2.4 Walk driver reaches a zone and opens its dialogue
- [ ] 2.5 autopilotAnswer() passes an m0 exam visibly

### Phase 3: AutopilotEngine orchestrator
#### Automated
- [ ] 3.1 npm run check + full vitest pass
#### Manual
- [ ] 3.2 Console-driven next() walks first beats; halts with readable report on broken gate

### Phase 4: QA overlay Autopilot panel
#### Automated
- [ ] 4.1 npm run check + vitest + npm run build pass
#### Manual
- [ ] 4.2 Start/reload/arm cycle works; stepping, Auto, Stop all function

### Phase 5: End-to-end verification & docs
#### Automated
- [ ] 5.1 check + vitest + build trio passes
#### Manual
- [ ] 5.2 Full Auto run completes hibernation → uplink with zero manual input
- [ ] 5.3 Halt path reports accurately
- [ ] 5.4 Anonymous + authenticated reset verified
