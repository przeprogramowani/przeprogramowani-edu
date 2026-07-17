# Exam Close Button & ESC Key Support

## Overview

Add a "Zamknij" button to the exam question screen and ESC key support for closing the exam from any state. Currently, the exam can only be navigated forward/backward through questions with no way to exit mid-exam.

## Current State Analysis

- `src/explorers/scenes/ExamScene.ts` renders questions with Previous/Next navigation buttons
- "Zamknij" button exists only on the **failed results screen** (line 492-516)
- No keyboard input handling exists in ExamScene (unlike DialogueScene which supports Space/ESC)
- The `dismissExam()` method (line 520) already handles clean teardown: clears UI, emits `EXAM_DISMISSED`, sleeps scene

### Key Discoveries:

- DialogueScene uses `this.input.keyboard!.addKey()` + `update()` polling pattern (lines 29-30, 46-57)
- GameScene uses event-based `this.input.keyboard?.on('keydown-ESC', handler)` pattern (line 620)
- ExamScene has no `update()` method — event-based ESC handling is simpler and avoids adding one
- Nav buttons positioned at `navY = panelTop + panelH - 50`; Previous at `panelLeft + 80`, Next at `panelLeft + panelW - 80`

## Desired End State

1. A "Zamknij" button appears on the **left side of the navigation bar** in the question view, always visible regardless of question index
2. Pressing **ESC** closes the exam from any screen (questions or results)
3. Mid-exam close = **silent dismiss** (no fail recorded, player can retry later)
4. ESC also works on results screen (both pass and fail states)

## What We're NOT Doing

- No confirmation dialog before closing (simple dismiss)
- No "are you sure?" prompt
- No progress saving — closing resets the exam

## Implementation Approach

Single-phase change to `ExamScene.ts` with three modifications:

1. Add "Zamknij" button in `renderQuestion()` nav bar area
2. Add ESC key listener in `showExam()`, remove in `dismissExam()`
3. Wire ESC to `dismissExam()` which already handles all cleanup

## Critical Implementation Details

### Timing & Lifecycle Considerations

- ESC listener must be added when exam wakes (`showExam`) and removed when it sleeps (`dismissExam`)
- On the pass results screen, a `dismissTimer` auto-closes after 3s — ESC should also destroy this timer
- Since `dismissExam()` calls `clearUI()` which destroys all objects, and then `scene.sleep()`, no dangling listeners from UI objects remain
- The ESC keyboard listener is separate from UI objects, so it must be explicitly removed

### User Experience Specification

- "Zamknij" button: subtle secondary style (dark bg `0x222222`, gray text `#888888`, border `0x444444`) — matches the existing dismiss button on fail screen
- Position: far left of nav bar, before Previous button
- ESC key: instant dismiss, same as clicking "Zamknij"
- No visual feedback for ESC press — just closes immediately

## Phase 1: Add Close Button and ESC Key Support

### Overview

Single set of changes to `ExamScene.ts`.

### Changes Required:

#### 1. Add ESC key listener management

**File**: `src/explorers/scenes/ExamScene.ts`

Add a class property for the ESC dismiss handler, bind it in `showExam()`, unbind in `dismissExam()`:

```typescript
// New class property
private escDismiss: (() => void) | null = null;
```

In `showExam()`, after `this.renderQuestion()`:
```typescript
// ESC key to close exam
this.escDismiss = () => this.dismissExam();
this.input.keyboard?.on('keydown-ESC', this.escDismiss);
```

In `dismissExam()`, before `this.scene.sleep()`:
```typescript
if (this.escDismiss) {
  this.input.keyboard?.off('keydown-ESC', this.escDismiss);
  this.escDismiss = null;
}
```

#### 2. Add "Zamknij" button to question navigation

**File**: `src/explorers/scenes/ExamScene.ts`

In `renderQuestion()`, add a close button before the existing Previous/Next buttons (after line 227, before line 229):

```typescript
// Close button (always visible)
const closeBg = this.add
  .rectangle(panelLeft + 50, navY, 90, 28, 0x222222, 1)
  .setScrollFactor(0)
  .setDepth(DEPTH.EXAM + 2)
  .setStrokeStyle(1, 0x444444)
  .setInteractive({ useHandCursor: true });
this.uiObjects.push(closeBg);

const closeText = this.add
  .text(panelLeft + 50, navY, 'Zamknij', {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#888888',
  })
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(DEPTH.EXAM + 3);
this.uiObjects.push(closeText);

closeBg.on('pointerover', () => closeBg.setFillStyle(0x333333, 1));
closeBg.on('pointerout', () => closeBg.setFillStyle(0x222222, 1));
closeBg.on('pointerup', () => {
  this.dismissExam();
});
```

#### 3. Adjust Previous button position

Since "Zamknij" takes the far-left spot, shift "Poprzednie" button slightly right to avoid overlap:

- Previous button X: change from `panelLeft + 80` to `panelLeft + 160` (only when `!isFirst`)

#### 4. Handle ESC on pass results screen timer

In `showResults()` for the pass case (line 441-450), the `dismissTimer` needs to be cleaned up if ESC is pressed. Since `dismissExam()` calls `clearUI()` which destroys all game objects, and the timer is a Phaser time event tied to the scene, it will be cleaned up when the scene sleeps. No additional change needed — Phaser's `scene.sleep()` pauses all timers.

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npx tsc --noEmit`
- [x] No linting errors in the changed file

#### Manual Verification:

- [ ] "Zamknij" button visible on every question during exam
- [ ] Clicking "Zamknij" closes exam and returns to game
- [ ] ESC key closes exam during any question
- [ ] ESC key closes exam on pass results screen
- [ ] ESC key closes exam on fail results screen
- [ ] Previous/Next buttons still work correctly and don't overlap with Zamknij
- [ ] After closing mid-exam, the exam can be re-triggered and starts fresh
- [ ] No visual glitches when panel is narrow (small viewport)

## Testing Strategy

### Manual Testing Steps:

1. Start an exam, verify "Zamknij" appears on first question
2. Navigate to middle question, click "Zamknij" — verify exam closes
3. Re-enter exam — verify it starts from question 1
4. Press ESC on first question — verify exam closes
5. Complete exam (pass), press ESC on results — verify it closes
6. Fail exam, press ESC on results — verify it closes
7. Resize viewport to small size — verify buttons don't overlap

## References

- ExamScene: `src/explorers/scenes/ExamScene.ts`
- DialogueScene ESC pattern: `src/explorers/scenes/DialogueScene.ts:29-57`
- GameScene ESC pattern: `src/explorers/scenes/GameScene.ts:617-622`
