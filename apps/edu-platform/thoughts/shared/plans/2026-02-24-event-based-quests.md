# Event-Based Quests: SmartTerminal Unlock & Exam Passing

## Overview

Extend the quest system to support **event-based quests** — quests that auto-complete when specific game events fire, rather than requiring `/solve <answer>` in the terminal. Two new quests will be created:

1. **"Uruchom SmartTerminal"** — completes when `TERMINAL_UNLOCK` event fires
2. **"Zdaj egzaminy weryfikacyjne"** — completes when all 3 exams are passed (`EXAM_COMPLETED` events)

The existing gameplay flows (terminal unlock sequence, exam UI) remain unchanged. Quests wrap these flows with tracking, objectives display, and XP/flag rewards.

## Current State Analysis

**Quest system** (`src/explorers/systems/QuestManager.ts`): Fully implemented but only supports text-answer quests via `/solve`. `QuestDefinition` requires `solution`, `validation`, `inputPayload` fields. No quests are defined in any level manifest.

**SmartTerminal unlock** (`src/explorers/SmartTerminal.svelte:94-109`): Multi-step flow (find terminal → find code → enter code 1030). Emits `TERMINAL_UNLOCK` event and sets `terminal-unlocked` flag on success.

**Exam system** (`src/explorers/systems/ExamManager.ts`): Three exams in m0-exam-room. Each emits `EXAM_COMPLETED` with `{ examId, passed: true, rewards }` and sets flags like `m0-exam-llm-basics-done`.

**Event bus**: Phaser's native `game.events` EventEmitter. All events typed in `src/explorers/events/GameEvents.ts`.

**Data serialization**: Quest definitions go through JSON serialization via `/api/game` endpoint — all quest data must be plain serializable objects (no functions).

### Key Discoveries:

- `QuestManager` is instantiated in `SmartTerminal.svelte:212` with `game`, `bus`, `getState`, `setState`
- Quest data loads from level manifests via `levelLoader.ts` → serialized through `/api/game` API → deserialized on client
- `DialogueEffect.activateQuest` already exists for dialogue-triggered quest activation (`src/explorers/systems/DialogueTypes.ts:11`)
- `DialogueEffect.completeQuest` exists but bypasses QuestManager — just emits event with empty rewards (`DialogueManager.ts:95-97`)
- Game state persisted to localStorage with backward-compat handling in `GameStateManager.ts:31-37`
- Current `quests.active` is `string | null` — only one active quest at a time

## Desired End State

After implementation:

1. `QuestDefinition` is a discriminated union supporting both `text-answer` and `event` completion types
2. `QuestManager` listens for game events when an event-based quest is active, tracking objective progress
3. Two quests exist in level manifests:
   - SmartTerminal quest (m0-awakening) — 1 objective, activated via intro dialogue
   - Exam quest (m0-exam-room) — 3 objectives, activated via study notes board dialogue
4. `/quest` command shows objectives with checkmarks for event-based quests
5. `/solve` shows a contextual message for event-based quests instead of trying to validate text

### Verification:

- Quest activates through dialogue, shows in terminal via `/quest`
- Performing the actual game action (unlocking terminal / passing exam) auto-completes the quest objective
- Multi-objective quest (exams) tracks partial progress correctly
- Already-completed actions are detected on quest activation (idempotency)
- All existing quest tests continue passing
- New tests cover event-based quest validation and objective tracking

## What We're NOT Doing

- Not changing the existing SmartTerminal unlock flow (code entry, boot sequence)
- Not changing the exam UI/flow
- Not supporting multiple simultaneous active quests (still one at a time)
- Not adding a visual quest HUD/tracker outside the terminal
- Not adding quest progress persistence beyond the existing state system
- Not modifying text-answer quest support (keeping it for future use)

## Implementation Approach

Use a **discriminated union** on `QuestDefinition` with a `completionType` field. Event-based quests define `objectives` — each with an event to listen for, payload matching criteria, and a `requireFlag` for detecting already-satisfied conditions. QuestManager subscribes to events when an event quest activates, tracks objective completion in state, and auto-completes when all objectives are met.

## Critical Implementation Details

### State Management Sequencing

- **Quest activation flow**: `activateQuest()` → check `requireFlag` for each objective → mark already-done objectives → subscribe to remaining events → if all done, complete immediately
- **Event handler flow**: Event fires → match payload → mark objective done in state → check if all objectives done → if yes, `completeQuest()`
- **Cleanup**: On quest completion or deactivation, remove all event listeners to prevent leaks
- **State persistence**: `objectivesDone` added to `DemoGameState.quests` — backward-compat handling in `loadState()`

### Timing & Lifecycle Considerations

- Event listeners are registered on the Phaser `game.events` bus (same as all other game events)
- QuestManager lives in SmartTerminal.svelte's lifecycle — event listeners must be cleaned up on component destroy
- The `TERMINAL_UNLOCK` event fires from SmartTerminal.svelte (same component), so the listener is guaranteed to catch it
- `EXAM_COMPLETED` fires from ExamManager, which uses the same bus — no cross-component timing issues

### Performance & Optimization Strategy

**N/A**: Event-based quests add a small number of event listeners (1-3 per quest). No performance concerns.

### Debug & Observability Plan

- `devLog()` messages for: quest activation, objective satisfied, all objectives complete, event listener registration/cleanup
- `/quest` command shows real-time objective progress for debugging
- Existing activity log already captures quest activation/completion events

## Phase 1: Extend QuestDefinition Type System

### Overview

Refactor `QuestDefinition` from a flat interface to a discriminated union supporting both text-answer and event-based quests. Add objective tracking to game state.

### Changes Required:

#### 1. Quest Type Definitions

**File**: `src/explorers/systems/QuestManager.ts` (lines 8-17)

Replace the flat `QuestDefinition` interface with a discriminated union:

```typescript
// Shared base for all quest types
interface BaseQuestDefinition {
  id: string;
  title: string;
  briefing: string;
  hints: string[];
  rewards: { xp: number; flags: string[] };
}

// Text-answer quests (existing, solved via /solve command)
export interface TextAnswerQuest extends BaseQuestDefinition {
  completionType: 'text-answer';
  inputPayload: string;
  solution: string;
  validation: 'exact-lowercase' | 'exact-trim';
}

// Event-based quest objective
export interface EventObjective {
  id: string;
  /** Polish label shown in /quest command */
  label: string;
  /** GameEvents value to listen for */
  event: string;
  /** Payload properties that must match for this objective to be satisfied */
  matchPayload?: Record<string, unknown>;
  /** If this flag is already set, objective is immediately satisfied on quest activation */
  requireFlag?: string;
}

// Event-based quests (auto-complete when game events fire)
export interface EventQuest extends BaseQuestDefinition {
  completionType: 'event';
  objectives: EventObjective[];
}

export type QuestDefinition = TextAnswerQuest | EventQuest;
```

#### 2. Game State Extension

**File**: `src/explorers/state/types.ts` (lines 11-14)

Add objective tracking:

```typescript
quests: {
  active: string | null;
  completed: string[];
  objectivesDone: Record<string, string[]>; // questId -> completed objective IDs
};
```

#### 3. Default State & Backward Compatibility

**File**: `src/explorers/state/GameStateManager.ts`

Update `createDefaultState()` to include `objectivesDone: {}` in the quests object.

Add backward-compat in `loadState()`:

```typescript
if (!data.quests.objectivesDone) {
  data.quests.objectivesDone = {};
}
```

#### 4. LevelLoader Type Update

**File**: `src/explorers/levels/levelLoader.ts` (line 14)

The `GameManifestLevel` interface already uses `QuestDefinition[]` — the union type flows through automatically. No change needed here, but verify that `JSON.stringify` handles the discriminated union correctly (it does — all fields are plain data).

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npx tsc --noEmit`
- [x] Existing quest validation tests pass: `npx vitest run src/explorers/systems/QuestManager.test.ts`
- [x] No lint errors: `npm run lint`

#### Manual Verification:

- [ ] Game loads correctly (no state deserialization errors)
- [ ] Existing gameplay unaffected

---

## Phase 2: Update QuestManager for Event-Based Completion

### Overview

Add event listener management, objective tracking, and auto-completion logic to QuestManager.

### Changes Required:

#### 1. QuestManager Core Logic

**File**: `src/explorers/systems/QuestManager.ts`

Add these capabilities:

**A. Event listener tracking** — store active listeners for cleanup:

```typescript
private activeEventListeners: Array<{ event: string; handler: Function }> = [];
```

**B. Modified `activateQuest()`** — after setting state, check if event quest and set up listeners:

```typescript
activateQuest(questId: string): void {
  const def = this.questDefs.get(questId);
  if (!def) return;

  this.setState((s) => ({
    quests: { ...s.quests, active: questId },
  }));

  this.bus.emit(GameEvents.QUEST_ACTIVATED, { questId, title: def.title });
  devLog(`[QuestManager] Quest activated: ${def.title}`);

  if (def.completionType === 'event') {
    this.setupEventListeners(def);
  }
}
```

**C. New `setupEventListeners()` method** — check already-satisfied objectives, subscribe to remaining:

```typescript
private setupEventListeners(quest: EventQuest): void {
  // Check already-satisfied objectives via flags
  const state = this.getState();
  const alreadyDone: string[] = [];

  for (const obj of quest.objectives) {
    if (obj.requireFlag && state.flags.includes(obj.requireFlag)) {
      alreadyDone.push(obj.id);
    }
  }

  // Persist already-done objectives
  if (alreadyDone.length > 0) {
    this.setState((s) => ({
      quests: {
        ...s.quests,
        objectivesDone: {
          ...s.quests.objectivesDone,
          [quest.id]: alreadyDone,
        },
      },
    }));
  }

  // Check if all already done
  if (alreadyDone.length >= quest.objectives.length) {
    this.completeQuest(quest);
    return;
  }

  // Subscribe to events for remaining objectives
  const remainingObjectives = quest.objectives.filter((o) => !alreadyDone.includes(o.id));

  for (const obj of remainingObjectives) {
    const handler = (payload: Record<string, unknown>) => {
      this.onEventObjective(quest, obj, payload);
    };
    this.bus.on(obj.event, handler);
    this.activeEventListeners.push({ event: obj.event, handler });
  }

  devLog(`[QuestManager] Event listeners set up: ${remainingObjectives.length} remaining objectives`);
}
```

**D. New `onEventObjective()` method** — handle incoming event:

```typescript
private onEventObjective(quest: EventQuest, objective: EventObjective, payload: Record<string, unknown>): void {
  // Check payload match
  if (objective.matchPayload) {
    for (const [key, value] of Object.entries(objective.matchPayload)) {
      if (payload[key] !== value) return; // Payload mismatch, ignore
    }
  }

  // Mark objective done
  const state = this.getState();
  const currentDone = state.quests.objectivesDone[quest.id] ?? [];
  if (currentDone.includes(objective.id)) return; // Already done

  const updatedDone = [...currentDone, objective.id];

  this.setState((s) => ({
    quests: {
      ...s.quests,
      objectivesDone: {
        ...s.quests.objectivesDone,
        [quest.id]: updatedDone,
      },
    },
  }));

  devLog(`[QuestManager] Objective completed: ${objective.label} (${updatedDone.length}/${quest.objectives.length})`);

  // Check if all objectives done
  if (updatedDone.length >= quest.objectives.length) {
    this.cleanupEventListeners();
    this.completeQuest(quest);
  }
}
```

**E. New `cleanupEventListeners()` method**:

```typescript
private cleanupEventListeners(): void {
  for (const { event, handler } of this.activeEventListeners) {
    this.bus.off(event, handler);
  }
  this.activeEventListeners = [];
  devLog('[QuestManager] Event listeners cleaned up');
}
```

**F. New `getObjectiveProgress()` method** — for terminal display:

```typescript
getObjectiveProgress(questId: string): { objective: EventObjective; done: boolean }[] | null {
  const def = this.questDefs.get(questId);
  if (!def || def.completionType !== 'event') return null;

  const state = this.getState();
  const doneIds = state.quests.objectivesDone[questId] ?? [];

  return def.objectives.map((obj) => ({
    objective: obj,
    done: doneIds.includes(obj.id),
  }));
}
```

**G. Handle re-activation on game reload** — if the game reloads with an active event quest, re-setup listeners:

Add a `resumeActiveQuest()` method to call after construction:

```typescript
resumeActiveQuest(): void {
  const state = this.getState();
  if (!state.quests.active) return;

  const def = this.questDefs.get(state.quests.active);
  if (!def || def.completionType !== 'event') return;

  this.setupEventListeners(def);
  devLog(`[QuestManager] Resumed event listeners for: ${def.title}`);
}
```

Call `resumeActiveQuest()` from SmartTerminal.svelte right after constructing QuestManager.

**H. Update `completeQuest()` to clean up objectivesDone**:

In the existing `completeQuest()` method, after clearing `active`, also clean up `objectivesDone` for the completed quest — but leave it in state for potential display purposes. The `cleanupEventListeners()` call handles the actual listener cleanup.

**I. Guard `submitAnswer()` against event quests**:

```typescript
submitAnswer(answer: string): boolean {
  const quest = this.getActiveQuest();
  if (!quest) return false;
  if (quest.completionType === 'event') return false; // Event quests can't be solved via /solve

  const correct = this.validate(answer, quest.solution, quest.validation);
  if (!correct) return false;

  this.completeQuest(quest);
  return true;
}
```

**J. Update `validate()` to type-narrow**:

The `validate` method only applies to `TextAnswerQuest`. Update its signature accordingly. Since `submitAnswer` already guards against event quests, this is just for type safety:

```typescript
private validate(answer: string, solution: string, mode: 'exact-lowercase' | 'exact-trim'): boolean {
  // ... same implementation
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Existing tests pass: `npx vitest run src/explorers/systems/QuestManager.test.ts`
- [x] No lint errors

#### Manual Verification:

- [ ] (Deferred to Phase 5 when actual quests are defined)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Adapt Terminal Commands

### Overview

Update `/quest` and `/solve` commands to display event-based quests with objective progress instead of text-answer instructions.

### Changes Required:

#### 1. `/quest` Command

**File**: `src/explorers/terminal/commandHandler.ts` (lines 121-147)

Replace `cmdQuest` to handle both quest types:

```typescript
function cmdQuest(state: DemoGameState, questManager?: QuestManager): CommandResult {
  if (!state.quests.active) {
    return { output: ['Brak aktywnej misji. Zbadaj statek.'] };
  }

  const quest = questManager?.getActiveQuest();
  if (!quest) {
    return { output: [`Misja ${state.quests.active} — brak danych.`] };
  }

  if (quest.completionType === 'event') {
    return cmdQuestEvent(quest, questManager!);
  }

  // Text-answer quest (existing behavior)
  const hintsLeft = questManager?.getRemainingHints() ?? 0;
  return {
    output: [
      `◆ MISJA: ${quest.title}`,
      '─────────────────────────────',
      quest.briefing,
      '',
      'Dane wejściowe:',
      quest.inputPayload,
      '',
      `Wskazówki: ${hintsLeft} dostępne`,
      'Użyj /solve <odpowiedź> aby wysłać rozwiązanie.',
      'Użyj /hint aby uzyskać wskazówkę.',
    ],
  };
}

function cmdQuestEvent(quest: EventQuest, questManager: QuestManager): CommandResult {
  const progress = questManager.getObjectiveProgress(quest.id);
  if (!progress) return { output: ['Błąd danych misji.'] };

  const doneCount = progress.filter((p) => p.done).length;
  const totalCount = progress.length;

  const objectiveLines = progress.map(
    (p) => `  ${p.done ? '✓' : '☐'} ${p.objective.label}`
  );

  const hintsLeft = questManager.getRemainingHints();

  const output = [
    `◆ MISJA: ${quest.title}`,
    '─────────────────────────────',
    quest.briefing,
    '',
    'Cele:',
    ...objectiveLines,
    '',
    `Postęp: ${doneCount}/${totalCount}`,
  ];

  if (hintsLeft > 0) {
    output.push('', `Wskazówki: ${hintsLeft} dostępne`, 'Użyj /hint aby uzyskać wskazówkę.');
  }

  return { output };
}
```

#### 2. `/solve` Command

**File**: `src/explorers/terminal/commandHandler.ts` (lines 149-172)

Add event quest guard:

```typescript
function cmdSolve(args: string[], state: DemoGameState, questManager?: QuestManager): CommandResult {
  if (!state.quests.active) {
    return { output: ['Brak aktywnej misji. Zbadaj statek.'] };
  }

  // Check if active quest is event-based
  const quest = questManager?.getActiveQuest();
  if (quest?.completionType === 'event') {
    return { output: ['Ta misja nie wymaga komendy /solve. Wykonaj cele opisane w /quest.'] };
  }

  if (args.length === 0) {
    return { output: ['Użycie: /solve <odpowiedź>'] };
  }

  if (!questManager) {
    return { output: ['Błąd systemu questów.'] };
  }

  const answer = args.join(' ');
  const correct = questManager.submitAnswer(answer);

  if (correct) {
    return { output: ['Odpowiedź poprawna! Weryfikacja zakończona.'] };
  }

  return {
    output: ['Nieprawidłowa odpowiedź. Spróbuj ponownie. Wpisz /hint, aby uzyskać wskazówkę.'],
  };
}
```

#### 3. Import Update

**File**: `src/explorers/terminal/commandHandler.ts`

Add import for `EventQuest` type:

```typescript
import type { QuestManager, EventQuest } from '../systems/QuestManager';
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors

#### Manual Verification:

- [ ] (Deferred to Phase 5)

---

## Phase 4: Define Two New Quests

### Overview

Add the SmartTerminal unlock quest and exam completion quest to their respective level manifests.

### Changes Required:

#### 1. SmartTerminal Quest

**File**: `src/explorers/levels/m0-awakening/manifest.ts`

Add quest definition:

```typescript
import type { LevelManifest } from '../types';
import type { EventQuest } from '../../systems/QuestManager';
import { dialogues } from './dialogues';

const questUnlockTerminal: EventQuest = {
  id: 'q-unlock-terminal',
  completionType: 'event',
  title: 'Uruchom SmartTerminal',
  briefing: 'Znajdź sposób na uruchomienie SmartTerminala. Przeszukaj statek w poszukiwaniu kodu dostępu.',
  hints: [
    'SmartTerminal wymaga 4-cyfrowego kodu dostępu.',
    'Kody załogi mogą być zapisane na tablicach personalnych.',
    'Szukaj tablicy z komorą hibernacyjną #3 — to Twoja komora.',
  ],
  objectives: [
    {
      id: 'terminal-unlocked',
      label: 'Odblokuj SmartTerminal',
      event: 'terminal:unlock',
      requireFlag: 'terminal-unlocked',
    },
  ],
  rewards: { xp: 20, flags: ['quest:terminal-done'] },
};

export const manifest: LevelManifest = {
  id: 'm0-awakening',
  displayName: 'Sala Hibernacyjna',
  dialogues,
  interactionRoutes: [
    { zoneId: 'hibernation-pod', defaultDialogue: 'm0-pod-examine' },
    {
      zoneId: 'loot-terminal',
      defaultDialogue: 'm0-loot-terminal-open',
      flagVariants: [
        { flag: 'terminal-found', dialogue: 'm0-loot-terminal-done' },
      ],
    },
    { zoneId: 'info-board', defaultDialogue: 'm0-info-board' },
  ],
  quests: [questUnlockTerminal],
  questCompletionDialogues: {
    'q-unlock-terminal': 'q-unlock-terminal-done',
  },
  introDialogue: 'm0-awakening-intro',
  introFlag: 'm0-intro-seen',
};
```

#### 2. SmartTerminal Quest Activation & Completion Dialogues

**File**: `src/explorers/levels/m0-awakening/dialogues.ts`

Add quest activation to the loot box dialogue and a completion dialogue:

Update `m0-loot-terminal-open` onComplete:
```typescript
onComplete: { setFlags: ['terminal-found'], activateQuest: 'q-unlock-terminal' },
```

Add completion dialogue:
```typescript
'q-unlock-terminal-done': {
  id: 'q-unlock-terminal-done',
  lines: [
    { speaker: 'system', text: 'MISJA UKOŃCZONA: Uruchom SmartTerminal', mode: 'system', autoAdvance: 2500 },
    { speaker: 'astronaut', text: 'Terminal działa. Teraz mogę sprawdzić co się tu wydarzyło.', mode: 'monologue' },
  ],
},
```

#### 3. Exam Quest

**File**: `src/explorers/levels/m0-exam-room/manifest.ts`

Add quest definition:

```typescript
import type { LevelManifest } from '../types';
import type { EventQuest } from '../../systems/QuestManager';
import { dialogues } from './dialogues';
import { exams } from './exams';

const questPassExams: EventQuest = {
  id: 'q-pass-exams',
  completionType: 'event',
  title: 'Zdaj egzaminy weryfikacyjne',
  briefing: 'Zdaj wszystkie trzy egzaminy weryfikacyjne, aby odzyskać dostęp do systemów statku.',
  hints: [
    'Na tablicy szkoleniowej znajdziesz materiały do nauki.',
    'Każdy egzamin wymaga zaliczenia minimum wymaganych pytań.',
    'Użyj /bookmarks, aby wrócić do notatek szkoleniowych.',
  ],
  objectives: [
    {
      id: 'exam-llm',
      label: 'Zdaj egzamin: Fundamenty LLM',
      event: 'exam:completed',
      matchPayload: { examId: 'm0-exam-llm-basics', passed: true },
      requireFlag: 'm0-exam-llm-basics-done',
    },
    {
      id: 'exam-prompting',
      label: 'Zdaj egzamin: Prompt Engineering',
      event: 'exam:completed',
      matchPayload: { examId: 'm0-exam-prompting', passed: true },
      requireFlag: 'm0-exam-prompting-done',
    },
    {
      id: 'exam-tokenization',
      label: 'Zdaj egzamin: Tokenizacja',
      event: 'exam:completed',
      matchPayload: { examId: 'm0-exam-tokenization', passed: true },
      requireFlag: 'm0-exam-tokenization-done',
    },
  ],
  rewards: { xp: 20, flags: ['quest:exams-done'] },
};

export const manifest: LevelManifest = {
  id: 'm0-exam-room',
  displayName: 'Sala Egzaminacyjna',
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'study-notes-board',
      defaultDialogue: 'm0-study-notes-board',
      flagVariants: [{ flag: 'cmds:bookmarks', dialogue: 'm0-study-notes-board-revisit' }],
    },
    { zoneId: 'exam-llm-basics', defaultDialogue: 'm0-exam-llm-basics-already' },
    { zoneId: 'exam-prompting', defaultDialogue: 'm0-exam-prompting-already' },
    { zoneId: 'exam-tokenization', defaultDialogue: 'm0-exam-tokenization-already' },
    { zoneId: 'coreai-room-door', defaultDialogue: 'm0-exam-room-door-locked' },
  ],
  quests: [questPassExams],
  questCompletionDialogues: {
    'q-pass-exams': 'q-pass-exams-done',
  },
  exams,
  examCompletionDialogues: {
    'm0-exam-llm-basics': 'm0-exam-llm-basics-done',
    'm0-exam-prompting': 'm0-exam-prompting-done',
    'm0-exam-tokenization': 'm0-exam-tokenization-done',
  },
};
```

#### 4. Exam Quest Activation & Completion Dialogues

**File**: `src/explorers/levels/m0-exam-room/dialogues.ts`

Add quest activation to study notes board (first visit triggers the quest):

Update `m0-study-notes-board` onComplete:
```typescript
onComplete: {
  setFlags: ['cmds:bookmarks'],
  activateQuest: 'q-pass-exams',
  addBookmark: {
    url: '/external/10xdevs-2/2580638',
    title: 'Notatki szkoleniowe',
    afterDialogue: 'm0-bookmarks-unlocked',
  },
},
```

Add completion dialogue:
```typescript
'q-pass-exams-done': {
  id: 'q-pass-exams-done',
  lines: [
    { speaker: 'system', text: 'MISJA UKOŃCZONA: Zdaj egzaminy weryfikacyjne', mode: 'system', autoAdvance: 2500 },
    { speaker: 'astronaut', text: 'Wszystkie egzaminy zdane. Wspomnienia wracają... jestem gotowy na kolejny krok.', mode: 'monologue' },
  ],
},
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors

#### Manual Verification:

- [ ] Quest definitions appear in `/api/game` JSON response

---

## Phase 5: Wire Up SmartTerminal.svelte

### Overview

Add `resumeActiveQuest()` call and ensure event listeners are cleaned up on component destroy.

### Changes Required:

#### 1. Resume Active Quest on Mount

**File**: `src/explorers/SmartTerminal.svelte`

After QuestManager construction (line ~212), add:

```typescript
questManager = new QuestManager(game, getBus(), getState, updateState);
questManager.resumeActiveQuest(); // Re-setup event listeners if an event quest was active
```

#### 2. Cleanup on Destroy

Event listener cleanup is handled by `cleanupEventListeners()` which is called on quest completion. For the edge case where the component unmounts with an active event quest, add cleanup in the existing `onDestroy` or `return` cleanup function in SmartTerminal:

```typescript
return () => {
  questManager?.cleanupEventListeners();
  // ... existing cleanup
};
```

This requires making `cleanupEventListeners()` public (or adding a `destroy()` method on QuestManager).

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] No lint errors

#### Manual Verification:

- [ ] Start game fresh → find loot box → quest "Uruchom SmartTerminal" activates with terminal message
- [ ] `/quest` shows single objective: `☐ Odblokuj SmartTerminal`
- [ ] `/solve anything` shows "Ta misja nie wymaga komendy /solve..."
- [ ] Enter code 1030 → quest auto-completes → completion dialogue plays → XP granted
- [ ] `/quest` now shows "Brak aktywnej misji"
- [ ] Navigate to exam room → interact with study notes board → quest "Zdaj egzaminy weryfikacyjne" activates
- [ ] `/quest` shows 3 objectives: all `☐`
- [ ] Pass first exam → `/quest` shows 1 `✓`, 2 `☐`, "Postęp: 1/3"
- [ ] Pass remaining exams → quest auto-completes after third → completion dialogue plays
- [ ] Reload game mid-quest → quest listeners resume correctly

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 6: Tests

### Overview

Update existing quest validation tests and add new tests for event-based quest logic.

### Changes Required:

#### 1. Update Existing Tests

**File**: `src/explorers/systems/QuestManager.test.ts`

Existing tests verify validation logic (the standalone `validate` function). These should continue passing unchanged since the function signature is the same.

#### 2. New Event-Based Quest Tests

**File**: `src/explorers/systems/QuestManager.test.ts`

Add new test suite:

```typescript
describe('Event-based quest objectives', () => {
  // Test payload matching
  describe('payload matching', () => {
    it('matches when all payload fields match', () => { ... });
    it('rejects when a payload field does not match', () => { ... });
    it('accepts any payload when matchPayload is undefined', () => { ... });
  });

  // Test objective progress tracking
  describe('objective progress', () => {
    it('marks objective done when matching event fires', () => { ... });
    it('ignores duplicate objective completion', () => { ... });
    it('tracks partial progress for multi-objective quests', () => { ... });
  });

  // Test auto-completion
  describe('auto-completion', () => {
    it('completes quest when all objectives are satisfied', () => { ... });
    it('completes immediately if all requireFlags are already set', () => { ... });
    it('completes with mix of already-done and event-triggered objectives', () => { ... });
  });
});
```

Since QuestManager depends on Phaser's game/bus, tests will need to mock these (or extract the pure logic into testable functions, similar to how the existing `validate` function is tested standalone). The cleanest approach is to extract the payload matching logic into a pure function and test it directly:

```typescript
// Extractable pure function for testing
export function matchesPayload(
  actual: Record<string, unknown>,
  expected?: Record<string, unknown>
): boolean {
  if (!expected) return true;
  return Object.entries(expected).every(([key, value]) => actual[key] === value);
}
```

### Success Criteria:

#### Automated Verification:

- [x] All tests pass: `npx vitest run src/explorers/systems/QuestManager.test.ts`
- [x] No lint errors

#### Manual Verification:

- [x] N/A — this phase is fully testable via automated tests

---

## Testing Strategy

### Unit Tests:

- Payload matching: exact match, partial match, no match, undefined matchPayload
- Objective progress: single objective, multi-objective, duplicate completion
- Auto-completion: all pre-satisfied, mixed, sequential events
- Text-answer quests: unchanged behavior (regression)

### Integration Tests:

- Not applicable — the event bus integration is best verified manually in-game

### Manual Testing Steps:

1. **Fresh game — SmartTerminal quest flow**:
   - Start new game → complete intro → interact with loot box
   - Verify quest activation message in terminal
   - Type `/quest` → verify objective display
   - Type `/solve test` → verify event quest rejection message
   - Navigate to crew room → find code → enter code in terminal
   - Verify quest auto-completes with dialogue + XP

2. **Fresh game — Exam quest flow**:
   - Navigate to exam room → interact with study notes board
   - Verify quest activation
   - Pass exams one by one, checking `/quest` progress after each
   - Verify quest completes after third exam

3. **Game reload**:
   - Activate a quest → reload page mid-quest
   - Verify quest is still active and listeners resume
   - Complete the quest normally

4. **Already-completed state**:
   - If terminal is already unlocked when quest activates → should auto-complete immediately
   - If 2/3 exams already passed when quest activates → should show 2/3 progress and complete on third

## Performance Considerations

Minimal impact — adds 1-3 event listeners per active event quest. Listeners are cleaned up on completion.

## References

- Quest system: `src/explorers/systems/QuestManager.ts`
- Game events: `src/explorers/events/GameEvents.ts`
- SmartTerminal: `src/explorers/SmartTerminal.svelte`
- Exam manager: `src/explorers/systems/ExamManager.ts`
- Level manifests: `src/explorers/levels/m0-awakening/manifest.ts`, `src/explorers/levels/m0-exam-room/manifest.ts`
- State types: `src/explorers/state/types.ts`
- Command handler: `src/explorers/terminal/commandHandler.ts`
