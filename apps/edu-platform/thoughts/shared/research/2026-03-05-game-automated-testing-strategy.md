---
date: 2026-03-05T12:00:00+01:00
researcher: Claude Sonnet 4.6
git_commit: 56045ddafe6039adf9826f8b6111d86878e63bcd
branch: master
repository: przeprogramowani-sites
topic: "How to automate in-browser testing of the 10x Explorers game with Playwright and scenario-based approaches"
tags: [research, testing, playwright, game, 10x-explorers, phaser, e2e, quests, exams]
status: complete
last_updated: 2026-03-05
last_updated_by: Claude Sonnet 4.6
---

# Research: Automated Testing Strategy for 10x Explorers

**Date**: 2026-03-05
**Researcher**: Claude Sonnet 4.6
**Git Commit**: 56045ddafe6039adf9826f8b6111d86878e63bcd
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

How could we automate testing this game in-browser — Playwright and scenarios based on game maps, zones, etc? Any other idea to simulate user and see if passing all quests, etc. is doable?

## Summary

The game architecture is highly testable. The key insight is that **all game logic is already decoupled from the Phaser rendering loop** — quest validation, exam scoring, state management, and flag transitions are pure TypeScript functions. This means we can test at multiple layers:

1. **Unit tests** — already exist for managers/state (no Phaser needed)
2. **Event-bridge Playwright tests** — expose `window.__game` and drive the full game via `page.evaluate()`, bypassing mouse/keyboard entirely
3. **Scenario-driven integration tests** — define scenarios as sequences of game events derived from level manifests; assert final state
4. **DOM-level Playwright tests** — verify HUD, terminal output, grant notifications using existing CSS classes

**Biggest gap:** No Playwright config, no `window.__game` exposure, no `data-testid` attributes anywhere.

---

## Detailed Findings

### 1. Existing Test Coverage

Already tested (Vitest unit tests):

| File | What's tested |
|------|--------------|
| `systems/QuestManager.test.ts` | Answer validation (exact-lowercase, exact-trim), matchPayload() |
| `systems/ExamManager.test.ts` | Single/multi-choice evaluation, passing score thresholds |
| `systems/StateMachine.test.ts` | State transitions, guard callbacks, lifecycle hooks |
| `state/GameStateManager.test.ts` | Default state, localStorage save/load, corruption handling |
| `config/ranks.test.ts` | XP → rank tier lookup, progress %, rank-up dialogues |

These are all **pure function tests with no Phaser dependency**. They test the validation/scoring layer only.

**No Playwright, no e2e tests, no integration tests exist.** The `tests/api/external/` directory has two API handler unit tests unrelated to the game.

---

### 2. Game Architecture — Testing Handles

#### A. Phaser Game Registry (primary state store)

```typescript
// All game state lives here:
game.registry.get('demoGameState')  // → GameState
game.registry.get('questManager')   // → QuestManager instance

// GameState shape:
{
  version: 1,
  flags: string[],
  currentMap: MapKey,
  position: { x, y },
  quests: { active: string | null, completed: string[], objectivesDone: Record<string, string[]> },
  xp: number,
  exams: { completed: string[] },
  bookmarks: BookmarkEntry[],
  commandHistory: string[],
  hintIndex: Record<string, number>,
}
```

#### B. Event Bus — All Game Actions Are Events

`src/explorers/events/GameEvents.ts` — every meaningful action emits an event:

```typescript
game.events.emit(GameEvents.DIALOGUE_SHOW, { dialogueId })
game.events.emit(GameEvents.EXAM_SHOW, { examId })
game.events.emit(GameEvents.QUEST_ACTIVATED, { questId, title })
game.events.emit(GameEvents.TRANSITION_START, { targetMap, spawnX, spawnY })
game.events.emit(GameEvents.FLAG_SET, { flag })
game.events.on(GameEvents.QUEST_COMPLETED, ({ questId, rewards }) => ...)
game.events.on(GameEvents.EXAM_COMPLETED, ({ examId, score, passed }) => ...)
game.events.on(GameEvents.STATE_CHANGED, ({ state }) => ...)
```

#### C. Manager APIs — Direct Programmatic Control

```typescript
// QuestManager
questManager.activateQuest(questId)
questManager.submitAnswer(answer)        // returns boolean
questManager.getActiveQuest()
questManager.getObjectiveProgress(questId)

// ExamManager
examManager.evaluate(examId, answers)    // { score, total, passed } — no side effects
examManager.completeExam(examId)         // applies rewards
examManager.isCompleted(examId)

// DialogueManager
dialogueManager.startDialogue(dialogueId)
dialogueManager.advance()               // returns next line or null (applies onComplete)
dialogueManager.skip()

// flagManager utilities
setFlag(game, flagName)
removeFlag(game, flagName)
hasFlag(game, flagName)
```

#### D. State Injection Before Boot

```typescript
// src/explorers/state/GameStateManager.ts
setPreloadedState(state: GameState)   // call before boot for clean test state
getPreloadedState(): GameState | null
createDefaultState(): GameState       // pristine state factory
```

#### E. DOM Selectors Available (No data-testid exists)

| Element | Selector |
|---------|---------|
| HUD bar | `.hud` |
| Rank name | `.rank` |
| XP text | `.xp-text` |
| XP bar fill | `.xp-bar-fill` (width % = progress) |
| Location badge | `.location` |
| Terminal toggle button | `.hotkey` / `.hotkey.hotkey-active` |
| Terminal input | `input[placeholder*="wpisz"]` |
| Terminal output | `div.overflow-y-auto` inside `.smart-terminal` |
| Grant card | `.grant-card` |
| Quest title in grant | `.grant-title` |
| QA overlay | `.absolute.top-12.left-2.z-50` |
| QA flag dropdown | `#qa-flag-add` |
| QA XP input | `#qa-xp-set` |
| QA map jump | `#qa-map-jump` |
| Preview iframe | `.fixed.inset-4.z-40 iframe` |

---

### 3. Testing Strategies

#### Strategy 1: Event-Bridge Playwright (Recommended Primary Approach)

Expose `window.__game` in dev/QA mode, then drive everything from `page.evaluate()`:

```typescript
// In PhaserGame.svelte (dev/qa mode only):
if (import.meta.env.DEV || new URLSearchParams(location.search).has('qa')) {
  window.__game = game;
}

// Playwright test:
const page = await browser.newPage();
await page.goto('/explorers?qa');
await page.waitForFunction(() => window.__game?.isBooted);

// Inject clean state before game loads (via preloaded state hook):
await page.evaluate(() => {
  window.__setPreloadedState({ ...createDefaultState() });
});

// Assert state after game events:
const state = await page.evaluate(() =>
  window.__game.registry.get('demoGameState')
);
expect(state.xp).toBe(0);
expect(state.flags).toContain('terminal-found');
```

**Pros:** No flakiness from timing, total control, fast, can test exact state
**Cons:** Requires `window.__game` exposure, needs build-time guard

#### Strategy 2: Scenario-Based Quest Simulation

Derive test scenarios from level manifests. Each manifest defines zones → dialogues → quest triggers:

```typescript
// Scenario: "Complete the m0-awakening tutorial"
// Steps derived from levels/m0-awakening/manifest.ts + dialogues.ts:

const scenario = {
  name: 'M0 Awakening tutorial completion',
  steps: [
    // 1. Skip intro (or assert it plays)
    { action: 'setFlag', flag: 'M0_INTRO_SEEN' },
    // 2. Interact with info-board → dialogue 'm0-info-board'
    { action: 'triggerDialogue', dialogueId: 'm0-info-board' },
    // 3. Advance through all lines (onComplete activates quest + sets flag)
    { action: 'advanceToCompletion' },
    // 4. Assert: quest 'q-pass-exams' activated
    { assert: 'questActive', questId: 'q-pass-exams' },
    // 5. Assert: flag CMDS_QUEST set
    { assert: 'flagSet', flag: 'CMDS_QUEST' },
  ]
};
```

Level manifests provide a machine-readable graph of all zones, their zone IDs, flag conditions, and dialogue/quest triggers. A scenario runner can walk this graph to verify all paths.

#### Strategy 3: QA Overlay + DOM Assertions (Simplest to Start)

Use the existing `?qa` overlay as a test fixture without any code changes:

```typescript
// Navigate to game with QA mode
await page.goto('/explorers?qa');
await page.waitForSelector('.hud');

// Use QA overlay to set up state:
await page.selectOption('#qa-flag-add', 'terminal-found');
await page.click('button:has-text("Dodaj flagę")');

// Jump to specific map:
await page.selectOption('#qa-map-jump', 'm0-core-ai');

// Assert HUD reflects changes:
await expect(page.locator('.location')).toContainText('Moduł CORE AI');
```

**Pros:** No code changes needed, uses existing dev tooling
**Cons:** Limited to what QA overlay exposes, tests the overlay not the game

#### Strategy 4: Terminal-Driven Quest Testing

The SmartTerminal accepts typed commands. For text-answer quests, use terminal `/solve`:

```typescript
// Open terminal via hotkey button
await page.click('.hotkey');
await page.waitForSelector('input[placeholder*="wpisz"]');

// Type and submit a command
await page.fill('input[placeholder*="wpisz"]', '/quest');
await page.keyboard.press('Enter');

// Assert output shows quest status
await expect(page.locator('.smart-terminal')).toContainText('◆');

// Solve a quest
await page.fill('input[placeholder*="wpisz"]', '/solve hello world');
await page.keyboard.press('Enter');

// Assert XP gained (HUD)
await expect(page.locator('.xp-text')).toContainText('100');

// Assert grant notification appeared
await expect(page.locator('.grant-card')).toBeVisible();
await expect(page.locator('.grant-title')).toContainText('Sygnał z Ziemi');
```

#### Strategy 5: Map + Zone Coverage Matrix

Combine Tiled map zone IDs with level manifest interaction routes to build a **coverage matrix**:

```typescript
// Every zone in every manifest has a zoneId that maps to:
// 1. A default dialogue
// 2. Optional flag variants
// 3. Optional exam trigger

// Test: each zone is reachable and triggers expected content
// Derived from manifest:
const m0AwakeningZones = [
  { zoneId: 'hibernation-pod', expectedDialogue: 'm0-pod-examine' },
  { zoneId: 'loot-terminal', expectedDialogue: 'm0-loot-terminal-open', afterFlag: 'm0-loot-terminal-done' },
  { zoneId: 'info-board', expectedDialogue: 'm0-info-board' },
  { zoneId: 'engineer-moreau', expectedDialogue: 'm0-npc-moreau' },
];

// For each zone: position player at zone → press E → assert dialogue fires
// In Playwright via event bridge:
for (const zone of m0AwakeningZones) {
  await page.evaluate(({ zoneId, expectedDialogue }) => {
    const game = window.__game;
    let firedDialogue = null;
    game.events.once('dialogue-show', ({ dialogueId }) => { firedDialogue = dialogueId; });
    game.events.emit('interaction-triggered', { objectId: zoneId });
    return firedDialogue;
  }, zone);
}
```

---

### 4. Implementation Plan

#### Phase 1: Foundation (no production code changes)

1. Add `playwright.config.ts` to `edu-platform`
2. Write 3-5 smoke tests using QA overlay (`?qa`) DOM selectors
3. Test: page loads, HUD visible, QA overlay accessible

#### Phase 2: Event Bridge (minimal code change)

1. In `PhaserGame.svelte`, after `new Phaser.Game(config)`:
   ```svelte
   {#if dev || hasQaParam}
     <script>window.__game = game;</script>
   {/if}
   ```
   Or set `window.__game = game` in the Svelte script block with a conditional.

2. Expose `setPreloadedState` and `createDefaultState` on `window.__testUtils` for state injection.

3. Write scenario tests:
   - Clean state → verify default state
   - Inject flags → verify zone interaction routes change
   - Activate quest → emit completion events → verify rewards

#### Phase 3: Level Manifest-Driven Coverage

1. Write a test generator that reads `ALL_LEVELS` from `levels/index.ts`
2. For each level manifest, generate test cases:
   - Each interaction route → trigger interaction → assert correct dialogue fires
   - Each flag variant → set flag → trigger interaction → assert variant dialogue
   - Each quest → activate → complete → assert XP + flags awarded
   - Each exam → evaluate with correct answers → assert pass + rewards

3. CI regression: any new quest/exam/dialogue added to manifests automatically gets a test skeleton

---

### 5. Specific Quest/Exam Test Cases

From the existing level content:

**Quest: `q-earth-signal`** (api-answer type)
- Answer: `"hello world"` (hash: `b94d27b9...`)
- Test: POST `/api/game/submit` with `{ questId, answer: 'hello world' }` → assert 200 + grant in DB

**Exam: M0 Exam Room** (3 exams: LLM basics, prompting, tokenization)
- Test each with correct answers derived from `correctOptionIds` in exam definitions
- Assert: `state.exams.completed` contains exam ID, XP increased by `rewards.xp`, flags set

**Quest: `q-pass-exams`** (event-based)
- Objectives likely listen to `EXAM_COMPLETED` events with matching examId payloads
- Test: emit `EXAM_COMPLETED` for each required exam → assert quest completes

**Dialogue chain: m0-awakening tutorial**
1. `m0-awakening-intro` (cinematic, flag-gated by `M0_INTRO_SEEN`)
2. `m0-loot-terminal-open` → sets `TERMINAL_FOUND` flag
3. `m0-info-board` → sets `CMDS_QUEST`, activates `q-pass-exams`
4. `m0-npc-moreau` → grants 25 XP
5. `first-contact` (terminal boot) → grants 10 XP

**Full scenario regression test** (via event bridge):
```
Total XP after m0-awakening completion: 35 XP (npc + terminal)
After 3 exams: variable (depends on exam reward values)
```

---

### 6. Alternative / Complementary Approaches

#### A. Headless Phaser (Node.js)

Phaser can run headless with `headless: true` renderer. This would allow pure Node/Vitest integration tests without a real browser — test scene logic, quest flows, exam scoring in a Vitest environment. However, Phaser's Cloudflare Workers deployment context makes this tricky (KV, server API calls).

**Best for:** Scene lifecycle tests, event flow tests without network calls.

#### B. State Snapshot Testing

Save `GameState` snapshots at key milestones (after m0-awakening, after first exam, etc.). Run the full scenario programmatically and `expect(state).toMatchSnapshot()`. Detects regressions when level content changes.

#### C. Storybook-style Isolated Scene Testing

Mount individual scenes (DialogueScene, ExamScene) outside the full game context with mock data. Would require extracting scene dependencies into injectable form. Medium refactor effort.

#### D. Server-Side API Test Matrix

The game has clear server APIs: `/api/game`, `/api/game/state`, `/api/game/submit`. Write integration tests against these endpoints with test user credentials to verify:
- State persistence roundtrips
- Quest answer validation (api-answer type)
- Grant application from pending grants

---

## Code References

- `src/explorers/events/GameEvents.ts` — All event constants and payload interfaces
- `src/explorers/state/GameStateManager.ts` — `setPreloadedState`, `createDefaultState`, `loadState`
- `src/explorers/state/types.ts` — `GameState` interface
- `src/explorers/systems/QuestManager.ts` — `activateQuest`, `submitAnswer`, `getActiveQuest`
- `src/explorers/systems/ExamManager.ts` — `evaluate`, `completeExam`, `isCompleted`
- `src/explorers/systems/DialogueManager.ts` — `startDialogue`, `advance`, `skip`
- `src/explorers/state/flagManager.ts` — `setFlag`, `removeFlag`, `hasFlag`
- `src/explorers/levels/index.ts` — `ALL_LEVELS` registry, `getAllQuests()`
- `src/explorers/levels/levelLoader.ts` — `getAllDialogues`, `getAllQuests`, `getAllExams`, `getInteractionRoutes`
- `src/explorers/levels/m0-awakening/manifest.ts` — Zone interaction routes with flagVariants
- `src/explorers/levels/m0-awakening/dialogues.ts` — Full dialogue content with onComplete effects
- `src/explorers/levels/m0-core-ai/quests.ts` — `q-earth-signal` quest definition
- `src/explorers/levels/m0-core-ai/manifest.ts` — Multi-flag zone routing
- `src/explorers/QaOverlay.svelte` — QA overlay with `#qa-flag-add`, `#qa-xp-set`, `#qa-map-jump`
- `src/explorers/GameHud.svelte` — `.hud`, `.rank`, `.xp-text`, `.location`, `.hotkey` selectors
- `src/explorers/SmartTerminal.svelte` — Terminal input/output selectors
- `src/explorers/PhaserGame.svelte` — Boot sequence, `setPreloadedState` integration point
- `src/explorers/scenes/GameScene.ts` — `handleInteraction`, zone/NPC dispatch
- `src/explorers/systems/InteractionDetector.ts` — `register`, `getNearest` (pure, no Phaser)

---

## Architecture Insights

1. **Event bus is the seam** — every meaningful game action goes through `game.events`. This is the perfect injection point for testing without touching rendering.

2. **State is serializable JSON** — `GameState` has no Phaser objects, making snapshots trivial.

3. **Level manifests are declarative** — The zone→dialogue→quest→effect graph can be walked programmatically to generate test cases automatically from content definitions.

4. **Managers are pure where it counts** — `evaluate()` in ExamManager, `matchesPayload()` in QuestManager, and all rank functions have zero side effects — ideal for unit testing.

5. **QA overlay is the secret weapon** — `?qa` already provides a test control panel with flag manipulation, XP setting, and map jumping. Playwright can drive this overlay as a test fixture with zero code changes.

6. **Flag variants create a combinatorial test space** — Each zone's `flagVariants` array defines branching dialogue. Test coverage = test all flag combinations for all zones.

---

## Open Questions

1. **Auth in Playwright** — The `/explorers` route requires authentication. Tests need either a test JWT or a mock auth middleware for local dev.
2. **Phaser boot timing** — Playwright needs to wait for Phaser to fully boot before calling `window.__game`. Need a reliable ready signal (e.g., `window.__gameReady = true` after `STATE_CHANGED` first fires).
3. **Map loading** — Tiled map files (`.tmj`) are loaded async by Phaser's asset loader. Zone IDs in manifests must match exactly the `objectId` fields in Tiled maps. Could add a validation test that cross-references manifests against parsed map files.
4. **API-answer quests in tests** — The `q-earth-signal` quest validates server-side. E2E tests for this need either the real server running or a mock of `/api/game/submit`.
5. **Headless canvas** — Phaser canvas rendering in Playwright/Chromium headless works fine (Chromium supports WebGL). But some Phaser asset loading may fail without CORS headers in test environment.
