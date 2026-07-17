# Technical Exam Game Mechanic — Implementation Plan

## Overview

Add a new "Technical Exam" mechanic to the 10x Explorers game. Players interact with special exam zones on maps, which launch a holographic quiz UI rendered as a Phaser overlay scene. Exams consist of configurable single-choice and multi-choice questions. Passing an exam grants XP and sets flags that gate further progression. Failed exams can be immediately retried.

## Current State Analysis

### Key Discoveries:

- Game uses **manifest-driven level system** — dialogues, quests, interaction routes all declared in TypeScript manifests (`src/explorers/levels/*/manifest.ts`)
- **Flag system** is the primary progression gate — `hasFlag()` / `setFlag()` with O(1) Set-based lookups (`src/explorers/state/flagManager.ts:9-27`)
- **Overlay scenes** follow sleep/wake pattern — DialogueScene and TransitionScene sleep by default, wake on events (`src/explorers/scenes/DialogueScene.ts:42-43`)
- **Interactive objects** support 3 types: `trigger`, `door`, `terminal` — need to add `exam` type (`src/explorers/entities/InteractiveObject.ts:11`)
- **XP system** is accumulation-only with no level thresholds — quests grant XP via `QuestManager.completeQuest()` (`src/explorers/systems/QuestManager.ts:76-113`)
- **Game state** persists to localStorage with debounced saves (`src/explorers/state/GameStateManager.ts`)
- **Depth layers** go up to `TRANSITION: 100` — exam UI needs a dedicated depth (`src/explorers/config/constants.ts:18-28`)
- **Input disabling** during overlays: `InputController.setEnabled(false)` blocks player movement (`src/explorers/scenes/GameScene.ts:381`)

## Desired End State

After implementation:
1. A new `exam` zone type exists in Tiled maps, rendered with debug overlays in dev mode
2. Pressing `[E]` near an exam zone launches a holographic exam UI (Phaser overlay scene)
3. The exam presents single-choice and multi-choice questions with clickable options
4. Player navigates questions, selects answers, and submits
5. On passing: XP granted, flags set, completion dialogue triggered, exam marked completed
6. On failing: results shown with option to retry immediately
7. Completed exams cannot be retaken (zone shows "already completed" dialogue)
8. One proof-of-concept exam is defined on the ship-bridge map

### Verification:
- Player can approach exam zone, press [E], complete exam, receive XP and flags
- Failed exam shows retry option, passing sets flags visible in QA overlay
- Exam state persists across page reloads (localStorage)
- Terminal `/status` reflects exam XP gains
- Activity log entries appear for exam events

## What We're NOT Doing

- No text-input questions (only single/multi choice)
- No timer/countdown per question
- No partial XP on failure (all-or-nothing pass/fail with immediate retry)
- No exam question randomization/shuffling
- No level-up system (XP remains accumulation-only)
- No holographic display asset integration (placeholder visuals — user will provide asset later)
- No terminal `/exam` command (exams triggered only via map zones)

## Implementation Approach

Follow the established manifest-driven pattern: define `ExamDefinition` types, add them to level manifests, register them in the global level loader, and create an `ExamScene` overlay that follows the same sleep/wake pattern as `DialogueScene`. Add `exam` as a new interactive object type.

## Critical Implementation Details

### State Management Sequencing

- **Exam flow**: Player presses [E] → GameScene emits `EXAM_SHOW` → ExamScene wakes → player completes exam → ExamScene applies rewards (XP + flags) → emits `EXAM_COMPLETED` or `EXAM_DISMISSED` → ExamScene sleeps → GameScene re-enables input
- **State updates**: Follow same pattern as QuestManager — `updateState()` for exam completion, `setFlag()` for reward flags, `bus.emit(XP_GAINED)` for XP
- **Persistence**: Completed exam IDs stored in `state.exams.completed[]`, saved via existing debounced localStorage mechanism

### User Experience Specification

- **Exam prompt**: `[E] Egzamin` shown when near exam zone (distinct from `[E] Zobacz` and `[E] Przejdź`)
- **Exam start**: Input disabled, dialogue bar hidden, ExamScene wakes with holographic panel
- **Question display**: Dark overlay + centered panel (similar to end-screen pattern at `GameScene.ts:505-598`), teal border, monospace font
- **Answer selection**: Clickable option rectangles with hover highlight (teal glow)
- **Single-choice**: Click selects one option (deselects previous)
- **Multi-choice**: Click toggles options, visual indicator shows "select all that apply"
- **Navigation**: "Następne pytanie →" / "Poprzednie pytanie ←" buttons, question counter (e.g., "2/5")
- **Submit**: Final question shows "Zakończ egzamin" button
- **Results**: Score display (e.g., "4/5 poprawnych odpowiedzi"), pass/fail message, XP gained (if passed)
- **On pass**: Green success text, XP animation, auto-dismiss after 3s (or click)
- **On fail**: Red failure text, "Spróbuj ponownie" retry button
- **All text in Polish** (per project constraint)

### Performance & Optimization Strategy

- **N/A**: Exam questions are small arrays (< 20 items), no performance concerns. Phaser scene sleep/wake is already optimized.

### Timing & Lifecycle Considerations

- **Input blocking**: `InputController.setEnabled(false)` on exam start, re-enabled on exam dismiss (same pattern as dialogue)
- **Scene lifecycle**: ExamScene created and launched in sleep mode during `GameScene.create()`, alongside DialogueScene and TransitionScene
- **Cleanup**: ExamScene listens for `shutdown` event to clean up bus listeners

### Debug & Observability Plan

- **Dev zone overlays**: Exam zones rendered in a distinct color (purple `0x9b59b6`) in dev mode
- **QA overlay**: Show completed exams list
- **devLog**: Log exam start, answer submission, pass/fail, rewards
- **Activity log**: Entries for "Egzamin rozpoczęty: [title]" and "Egzamin zdany (+X XP)" or "Egzamin niezdany"

---

## Phase 1: Type Definitions & State Extension

### Overview

Define the `ExamDefinition` type system, extend game state to track completed exams, add new events, and register `exam` as an interactive object type.

### Changes Required:

#### 1. Exam Type Definitions

**File**: `src/explorers/systems/ExamTypes.ts` (NEW)

```typescript
export interface ExamDefinition {
  /** Unique exam identifier */
  id: string;
  /** Polish display title */
  title: string;
  /** Polish description shown before starting */
  description: string;
  /** Questions in this exam */
  questions: ExamQuestion[];
  /** Minimum correct answers to pass */
  passingScore: number;
  /** Rewards granted on passing */
  rewards: { xp: number; flags: string[] };
  /** Optional dialogue triggered on completion */
  completionDialogue?: string;
}

export interface ExamQuestion {
  /** Unique question ID within exam */
  id: string;
  /** Polish question text */
  text: string;
  /** Question type */
  type: 'single' | 'multi';
  /** Available answer options */
  options: ExamOption[];
  /** IDs of correct options */
  correctOptionIds: string[];
}

export interface ExamOption {
  /** Unique option ID within question */
  id: string;
  /** Polish option text */
  text: string;
}
```

#### 2. Game State Extension

**File**: `src/explorers/state/types.ts`
**Changes**: Add `exams` field to `DemoGameState`

```typescript
export interface DemoGameState {
  // ... existing fields ...
  exams: {
    completed: string[];  // Completed exam IDs
  };
}
```

#### 3. Default State Update

**File**: `src/explorers/state/GameStateManager.ts`
**Changes**: Add `exams: { completed: [] }` to `createDefaultState()`

#### 4. New Game Events

**File**: `src/explorers/events/GameEvents.ts`
**Changes**: Add exam-related events and payload types

```typescript
// In GameEvents object:
EXAM_SHOW: 'exam:show',
EXAM_COMPLETED: 'exam:completed',
EXAM_DISMISSED: 'exam:dismissed',

// New payload interfaces:
export interface ExamShowPayload {
  examId: string;
}

export interface ExamCompletedPayload {
  examId: string;
  score: number;
  total: number;
  passed: boolean;
  rewards?: { xp: number; flags: string[] };
}
// ExamDismissed — no payload
```

#### 5. Interactive Object Type Extension

**File**: `src/explorers/entities/InteractiveObject.ts`
**Changes**: Add `'exam'` to `objectType` union

```typescript
objectType: 'trigger' | 'door' | 'terminal' | 'exam';
```

Also update `InteractiveObjectConfig` interface to match.

#### 6. GameScene Zone Parsing

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**:
- Add `exam` to zone type handling in `create()` (line ~168 — alongside trigger/door/terminal)
- Add `exam` debug overlay color (purple `0x9b59b6`)
- Add `exam` prompt label in `update()`: `'[E] Egzamin'`
- Add `exam` case in `handleInteraction()` that emits `EXAM_SHOW` event

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles without errors: `npx tsc --noEmit`
- [x] Existing tests pass: `npm run test`

#### Manual Verification:
- [ ] Game loads without errors in browser console
- [ ] No regressions in existing dialogue/quest interactions

---

## Phase 2: ExamManager System

### Overview

Create the `ExamManager` class that handles exam lifecycle — loading definitions from the global registry, evaluating answers, granting rewards. Follows the same pattern as `QuestManager`.

### Changes Required:

#### 1. ExamManager

**File**: `src/explorers/systems/ExamManager.ts` (NEW)

```typescript
import type Phaser from 'phaser';
import type { ExamDefinition } from './ExamTypes';
import { GameEvents } from '../events/GameEvents';
import { setFlag } from '../state/flagManager';
import { devLog } from '../utils/logger';
import type { DemoGameState } from '../state/types';
import { getAllExams, getExamCompletionDialogues } from '../levels/levelLoader';

export class ExamManager {
  private game: Phaser.Game;
  private bus: Phaser.Events.EventEmitter;
  private getState: () => DemoGameState;
  private setState: (updater: (prev: DemoGameState) => Partial<DemoGameState>) => void;
  private examDefs: Map<string, ExamDefinition>;
  private examCompletionDialogues: Record<string, string>;

  constructor(
    game: Phaser.Game,
    bus: Phaser.Events.EventEmitter,
    getState: () => DemoGameState,
    setState: (updater: (prev: DemoGameState) => Partial<DemoGameState>) => void
  ) {
    this.game = game;
    this.bus = bus;
    this.getState = getState;
    this.setState = setState;
    this.examDefs = getAllExams();
    this.examCompletionDialogues = getExamCompletionDialogues();
  }

  getExamDef(id: string): ExamDefinition | null {
    return this.examDefs.get(id) ?? null;
  }

  isCompleted(examId: string): boolean {
    return this.getState().exams.completed.includes(examId);
  }

  /** Evaluate answers and return result. Does NOT apply rewards yet. */
  evaluate(examId: string, answers: Record<string, string[]>): {
    score: number;
    total: number;
    passed: boolean;
  } {
    const exam = this.examDefs.get(examId);
    if (!exam) return { score: 0, total: 0, passed: false };

    let score = 0;
    for (const q of exam.questions) {
      const selected = answers[q.id] ?? [];
      const correct = q.correctOptionIds;
      // Must match exactly — same items, same count
      if (
        selected.length === correct.length &&
        selected.every((s) => correct.includes(s))
      ) {
        score++;
      }
    }

    return {
      score,
      total: exam.questions.length,
      passed: score >= exam.passingScore,
    };
  }

  /** Complete a passed exam — grant rewards, set flags, emit events. */
  completeExam(examId: string): void {
    const exam = this.examDefs.get(examId);
    if (!exam) return;

    const state = this.getState();
    const newXp = state.xp + exam.rewards.xp;

    // Mark completed + grant XP
    this.setState((s) => ({
      exams: {
        ...s.exams,
        completed: [...s.exams.completed, examId],
      },
      xp: newXp,
    }));

    // Emit XP gained
    this.bus.emit(GameEvents.XP_GAINED, { amount: exam.rewards.xp, total: newXp });

    // Emit exam completed
    this.bus.emit(GameEvents.EXAM_COMPLETED, {
      examId,
      score: exam.questions.length,
      total: exam.questions.length,
      passed: true,
      rewards: exam.rewards,
    });

    // Set reward flags
    for (const flag of exam.rewards.flags) {
      setFlag(this.game, flag);
    }

    // Trigger completion dialogue
    const dialogueId = this.examCompletionDialogues[examId];
    if (dialogueId) {
      this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
    }

    devLog(`[ExamManager] Exam completed: ${exam.title} (+${exam.rewards.xp} XP)`);
  }
}
```

#### 2. Level Loader Extension

**File**: `src/explorers/levels/levelLoader.ts`
**Changes**: Add exam registries alongside existing quest registries

```typescript
let allExams: Map<string, ExamDefinition>;
let allExamCompletionDialogues: Record<string, string>;

// In loadAllLevels():
// Register exams
if (manifest.exams) {
  for (const exam of manifest.exams) {
    allExams.set(exam.id, exam);
  }
}
// Register exam completion dialogues
if (manifest.examCompletionDialogues) {
  Object.assign(allExamCompletionDialogues, manifest.examCompletionDialogues);
}

// New exports:
export function getAllExams(): Map<string, ExamDefinition> { return allExams; }
export function getExamCompletionDialogues(): Record<string, string> { return allExamCompletionDialogues; }
```

#### 3. Level Manifest Type Extension

**File**: `src/explorers/levels/types.ts`
**Changes**: Add exam fields to `LevelManifest`

```typescript
import type { ExamDefinition } from '../systems/ExamTypes';

export interface LevelManifest {
  // ... existing fields ...

  /** Exam definitions for this level (optional) */
  exams?: ExamDefinition[];

  /** Exam completion → dialogue mapping (optional) */
  examCompletionDialogues?: Record<string, string>;
}
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Existing tests pass: `npm run test`
- [x] ExamManager unit test: `evaluate()` returns correct scores for known inputs

#### Manual Verification:
- [x] N/A (no UI yet — system-only phase)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the automated tests look correct before proceeding to the next phase.

---

## Phase 3: ExamScene (Phaser Overlay)

### Overview

Create the `ExamScene` Phaser overlay scene that renders the holographic exam UI. Follows the sleep/wake pattern of `DialogueScene`. Handles question display, answer selection, navigation, submission, and results.

### Changes Required:

#### 1. Scene Registry

**File**: `src/explorers/config/sceneRegistry.ts`
**Changes**: Add `EXAM` scene key

```typescript
export const SceneKey = {
  // ... existing ...
  EXAM: 'ExamScene',
} as const;
```

#### 2. Constants

**File**: `src/explorers/config/constants.ts`
**Changes**: Add exam-specific depth and colors

```typescript
export const DEPTH = {
  // ... existing ...
  EXAM: 90, // Below TRANSITION (100) but above everything else
} as const;

export const COLORS = {
  // ... existing ...
  EXAM_CORRECT: 0x2ecc71,   // Green for correct
  EXAM_INCORRECT: 0xe74c3c, // Red for incorrect
  EXAM_SELECTED: 0x00d4aa,  // Teal for selected option
  EXAM_HOVER: 0x1a3a4a,     // Dark teal for hover
} as const;
```

#### 3. ExamScene

**File**: `src/explorers/scenes/ExamScene.ts` (NEW)

Core responsibilities:
- Listens for `EXAM_SHOW` event, wakes from sleep
- Loads `ExamDefinition` from `ExamManager`
- Renders dark overlay + centered exam panel (camera-fixed, `setScrollFactor(0)`)
- Renders question text, option buttons (clickable rectangles), navigation buttons
- Tracks selected answers per question in local state (`Map<string, string[]>`)
- On submit: calls `ExamManager.evaluate()`, shows results
- On pass: calls `ExamManager.completeExam()`, shows success UI, auto-dismiss
- On fail: shows "Spróbuj ponownie" button that resets answers and restarts
- On dismiss: emits `EXAM_DISMISSED`, cleans up all game objects, goes back to sleep

UI Layout (approximate):
```
┌──────────────────────────────────────────┐
│  EGZAMIN TECHNICZNY: [title]             │
│──────────────────────────────────────────│
│                                          │
│  Pytanie 2/5                             │
│                                          │
│  [Question text here, word-wrapped]      │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ ○ Option A text                    │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ ● Option B text (selected)         │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ ○ Option C text                    │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ ○ Option D text                    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  [← Poprzednie]         [Następne →]     │
│──────────────────────────────────────────│
│  ■■■■■□□□□□  2/5                         │
└──────────────────────────────────────────┘
```

Key implementation details:
- All UI elements created as Phaser `GameObjects` (Rectangle, Text) with `setScrollFactor(0)` and `setDepth(DEPTH.EXAM)`
- Options are interactive rectangles with `setInteractive({ useHandCursor: true })` — click handlers toggle selection
- Single-choice: selecting an option deselects all others for that question
- Multi-choice: toggle individual options, show "Wybierz wszystkie pasujące" hint text
- Navigation via prev/next buttons; last question shows "Zakończ egzamin" instead of next
- Progress bar rendered as series of small rectangles (filled = answered)
- Results screen replaces question content — shows score, pass/fail, XP gained
- All dynamic game objects stored in an array, destroyed on cleanup/dismiss

#### 4. GameScene Integration

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**:
- Launch ExamScene in sleep mode during `create()` (line ~242, alongside DialogueScene/TransitionScene)
- Create `ExamManager` instance (passed same `getState`/`setState` as QuestManager)
- Store ExamManager as class field for use in interaction handler
- Listen for `EXAM_DISMISSED` event to re-enable input (same pattern as `DIALOGUE_DISMISSED`)
- In `handleInteraction()`, add `case 'exam'` that:
  1. Reads `examId` from zone properties
  2. Checks if exam is already completed → show "already done" dialogue instead
  3. Otherwise: disable input, emit `EXAM_SHOW` with examId

#### 5. PhaserGame.svelte Activity Log

**File**: `src/explorers/PhaserGame.svelte`
**Changes**: Add exam event listeners for activity log entries

```typescript
game.events.on(GameEvents.EXAM_COMPLETED, (p) => {
  if (p.passed) {
    addLogEntry(`Egzamin zdany: (+${p.rewards.xp} XP)`);
  } else {
    addLogEntry(`Egzamin niezdany`);
  }
});
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] Existing tests pass: `npm run test`
- [x] Game builds without errors: `npm run build`

#### Manual Verification:
- [ ] Exam scene opens when pressing [E] on exam zone
- [ ] Questions display correctly with all options visible
- [ ] Single-choice: only one option can be selected per question
- [ ] Multi-choice: multiple options can be toggled
- [ ] Navigation between questions works (prev/next)
- [ ] Submit evaluates answers and shows results
- [ ] On pass: XP granted (visible in HUD), flags set (visible in QA overlay)
- [ ] On fail: retry button resets exam
- [ ] Completed exam zone shows "already done" message
- [ ] Player movement disabled during exam, re-enabled after dismiss
- [ ] Activity log shows exam events in terminal

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the exam UI looks and works correctly before proceeding to the next phase.

---

## Phase 4: Proof-of-Concept Exam Content

### Overview

Define one exam on the ship-bridge map with a dedicated exam zone, activation dialogue, and completion dialogue. This validates the full system end-to-end.

### Changes Required:

#### 1. Exam Definition

**File**: `src/explorers/levels/ship-bridge/exams.ts` (NEW)

```typescript
import type { ExamDefinition } from '../../systems/ExamTypes';

export const exams: ExamDefinition[] = [
  {
    id: 'bridge-systems-exam',
    title: 'Certyfikacja Systemów Mostka',
    description: 'Sprawdź swoją wiedzę o systemach statku. Musisz zaliczyć, aby uzyskać dostęp do zaawansowanych konsol.',
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: 'Który system odpowiada za łączność kwantową z Ziemią?',
        type: 'single',
        options: [
          { id: 'a', text: 'CORE' },
          { id: 'b', text: 'Uplink' },
          { id: 'c', text: 'Stacja nawigacyjna' },
          { id: 'd', text: 'Projektor holograficzny' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: 'Co oznacza kod błędu CAL-7031?',
        type: 'single',
        options: [
          { id: 'a', text: 'Utrata zasilania' },
          { id: 'b', text: 'Błąd kalibracji' },
          { id: 'c', text: 'Awaria silnika' },
          { id: 'd', text: 'Przegrzanie systemu' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: 'Które systemy statku są obecnie offline? (wybierz wszystkie)',
        type: 'multi',
        options: [
          { id: 'a', text: 'Stacja nawigacyjna' },
          { id: 'b', text: 'Terminal Uplink' },
          { id: 'c', text: 'Stacja komunikacyjna' },
          { id: 'd', text: 'Stacja inżynieryjna' },
        ],
        correctOptionIds: ['a', 'c', 'd'],
      },
      {
        id: 'q4',
        text: 'Jaki kod awaryjny odblokowuje terminal?',
        type: 'single',
        options: [
          { id: 'a', text: '1234' },
          { id: 'b', text: '0451' },
          { id: 'c', text: '7031' },
          { id: 'd', text: '2049' },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 150, flags: ['bridge-exam-passed'] },
    completionDialogue: 'bridge-exam-complete',
  },
];
```

#### 2. Exam Dialogues

**File**: `src/explorers/levels/ship-bridge/dialogues.ts`
**Changes**: Add exam-related dialogues

```typescript
// Add to existing dialogues record:
'exam-station-available': {
  id: 'exam-station-available',
  lines: [
    { speaker: 'system', text: 'Stacja certyfikacji aktywna. Przygotuj się do egzaminu.', mode: 'system', autoAdvance: 2000 },
  ],
},
'exam-station-completed': {
  id: 'exam-station-completed',
  lines: [
    { speaker: 'system', text: 'Certyfikacja ukończona. Dostęp przyznany.', mode: 'system', autoAdvance: 2000 },
  ],
},
'bridge-exam-complete': {
  id: 'bridge-exam-complete',
  lines: [
    { speaker: 'system', text: 'CERTYFIKACJA ZALICZONA', mode: 'system', autoAdvance: 2000 },
    { speaker: 'astronaut', text: 'Nawigatorze, twoja wiedza o systemach mostka jest imponująca.', mode: 'dialogue' },
    { speaker: 'astronaut', text: 'Zaawansowane konsole są teraz dostępne.', mode: 'dialogue' },
  ],
  onComplete: { setFlags: ['bridge-exam-passed'] },
},
```

#### 3. Manifest Update

**File**: `src/explorers/levels/ship-bridge/manifest.ts`
**Changes**: Add exam imports and fields

```typescript
import { exams } from './exams';

export const manifest: LevelManifest = {
  // ... existing fields ...
  exams,
  examCompletionDialogues: {
    'bridge-systems-exam': 'bridge-exam-complete',
  },
  interactionRoutes: [
    // ... existing routes ...
    {
      zoneId: 'exam-station',
      defaultDialogue: 'exam-station-available',
      flagVariants: [
        { flag: 'bridge-exam-passed', dialogue: 'exam-station-completed' },
      ],
    },
  ],
};
```

#### 4. Tiled Map Zone

**File**: `public/game/maps/ship-bridge.json`
**Changes**: Add an `exam` zone object in the Zones layer

```json
{
  "type": "exam",
  "x": 320,
  "y": 192,
  "width": 64,
  "height": 32,
  "properties": [
    { "name": "id", "type": "string", "value": "exam-station" },
    { "name": "examId", "type": "string", "value": "bridge-systems-exam" },
    { "name": "requiredFlag", "type": "string", "value": "terminal-unlocked" }
  ]
}
```

Note: Exact coordinates may need adjustment to fit the map. The `requiredFlag` ensures the exam is only available after the terminal is unlocked.

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] All tests pass: `npm run test`
- [x] Game builds: `npm run build`

#### Manual Verification:
- [ ] Exam zone appears on ship-bridge map (purple debug overlay in dev mode)
- [ ] Pressing [E] on exam zone starts the exam
- [ ] All 4 questions display correctly
- [ ] Answering 3+ correctly → pass → XP + flag granted
- [ ] Answering < 3 correctly → fail → retry available
- [ ] After passing, exam zone shows completion dialogue
- [ ] `bridge-exam-passed` flag visible in QA overlay
- [ ] Activity log shows exam events

**Implementation Note**: After completing this phase and all verification passes, pause here for manual confirmation from the human that the complete exam flow works end-to-end.

---

## Phase 5: QA Overlay & Polish

### Overview

Update the QA overlay to show exam state, add any missing polish (edge cases, save/load with exam state, etc.).

### Changes Required:

#### 1. QA Overlay Update

**File**: `src/explorers/QaOverlay.svelte`
**Changes**: Add completed exams display section (similar to completed quests)

#### 2. State Migration

**File**: `src/explorers/state/GameStateManager.ts`
**Changes**: Handle loading saved state that lacks the `exams` field (backward compatibility)

```typescript
// In loadState():
if (!state.exams) {
  state.exams = { completed: [] };
}
```

#### 3. Terminal /status Update (Optional)

**File**: `src/explorers/terminal/commandHandler.ts`
**Changes**: Show exam count in `/status` output

```typescript
// Add line to status output:
`Certyfikacje: ${state.exams.completed.length}`
```

### Success Criteria:

#### Automated Verification:
- [x] TypeScript compiles: `npx tsc --noEmit`
- [x] All tests pass: `npm run test`

#### Manual Verification:
- [ ] QA overlay shows completed exams
- [ ] Old save states (without `exams` field) load without errors
- [ ] `/status` shows certification count
- [ ] Full game flow from fresh state works end-to-end

---

## Testing Strategy

### Unit Tests:

- `ExamManager.evaluate()` — correct scoring for single-choice, multi-choice, mixed
- `ExamManager.evaluate()` — partial correct answers in multi-choice count as wrong
- `ExamManager.evaluate()` — passing threshold (exactly at threshold, above, below)
- `ExamManager.isCompleted()` — returns true after `completeExam()`
- State migration — old state without `exams` field gets default

### Integration Tests:

- Full exam flow: show → answer → submit → rewards
- Retry flow: fail → retry → pass
- Already-completed guard: completed exam shows dialogue instead of exam UI

### Manual Testing Steps:

1. Navigate to ship-bridge, find exam zone (purple overlay in dev mode)
2. Press [E] — exam UI should appear with title and first question
3. Answer questions, navigate between them
4. Submit with passing score — verify XP gained in HUD, flag in QA overlay
5. Interact with exam zone again — should show "completed" dialogue
6. Reload page — exam should still be marked as completed
7. Reset state via QA overlay — exam should be retakable

## Performance Considerations

Minimal impact — exam UI consists of < 30 Phaser game objects (rectangles + text). Scene sleep/wake is already proven efficient. No per-frame updates needed in ExamScene (purely event-driven interactions).

## Migration Notes

Existing save states will not have the `exams` field. Phase 5 adds backward-compatible migration that defaults to `{ completed: [] }`.

## References

- Game spec: `.ai/10x-devs/game/storyline.md`
- Quest system (pattern to follow): `src/explorers/systems/QuestManager.ts`
- DialogueScene (overlay pattern): `src/explorers/scenes/DialogueScene.ts`
- End screen UI (panel pattern): `src/explorers/scenes/GameScene.ts:505-598`
- Level manifest system: `src/explorers/levels/types.ts`, `src/explorers/levels/levelLoader.ts`
- Flag system: `src/explorers/state/flagManager.ts`
- Event system: `src/explorers/events/GameEvents.ts`
