# Exam Option Text Wrapping Fix

## Overview

Long exam answer options overflow the panel boundary because option labels have no `wordWrap` and use a fixed 32px height. This plan adds word wrapping to option text and makes both option boxes and the panel height dynamic.

## Current State Analysis

In `src/explorers/scenes/ExamScene.ts`:
- **Question text** (line 158-168) correctly uses `wordWrap: { width: panelW - 40 }` and its height is read via `questionText.height` for positioning subsequent elements.
- **Option labels** (line 210-218) have NO `wordWrap` — text renders in a single line and overflows the panel.
- **Option background** height is hardcoded to `optionH = 32` (line 187).
- **Panel height** is `Math.min(480, height - 40)` (line 107) — fixed, doesn't account for content size.
- **Navigation buttons** and **progress bar** are positioned relative to `panelTop + panelH`, so they'll move correctly if `panelH` changes.

### Key Discoveries:

- Option text starts at `panelLeft + 28` (line 211) with indicator prefix — available text width is roughly `optionW - 16` (~`panelW - 56`)
- Options are spaced with `optionGap = 6` (line 188)
- The nav bar sits at `panelTop + panelH - 50` (line 262) and progress bar at `panelTop + panelH - 18` (line 358)

## Desired End State

Option text wraps within the panel boundary. Each option box grows to fit its wrapped content. The panel height adjusts dynamically to contain all options plus navigation. The screenshot-visible overflow is eliminated.

### Verification:

- Load exam with long answer options (e.g., "Weryfikacja pamięci: Systemy agentowe")
- All option text stays within the panel boundary
- Option boxes are tall enough to show all wrapped text
- Navigation buttons and progress bar remain visible below options

## What We're NOT Doing

- Not changing the results screen layout (`showResults`)
- Not adding scrolling — dynamic height is sufficient for typical 4-5 options
- Not changing font sizes or panel width
- Not refactoring the rendering approach (e.g., no container/group objects)

## Implementation Approach

Two-pass rendering for options: first create text objects to measure heights, then position backgrounds and labels using measured heights. Compute total options height to determine panel height dynamically.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: This is a synchronous rendering change within `renderQuestion()`. No async operations or lifecycle concerns.

### User Experience Specification

- Option text wraps at roughly `panelW - 56` pixels (accounting for indicator character + left padding)
- Option background height = `max(32, textHeight + 12)` to ensure minimum click target while growing for wrapped text
- Vertical text alignment: `setOrigin(0, 0.5)` stays centered in the option box
- Panel height = computed dynamically based on: title bar + question text + hint (if multi) + all option heights + nav bar + progress bar + padding

### Performance & Optimization Strategy

**N/A**: Rendering a handful of text objects with wordWrap has negligible performance impact.

### State Management Sequencing

**N/A**: No state changes — this is purely visual layout.

### Debug & Observability Plan

- Visual verification: load exam with long options, confirm no overflow
- Test with both `single` and `multi` question types (multi has an extra hint line)
- Test with short options to confirm they still render correctly at minimum 32px height

## Phase 1: Dynamic Option Heights and Panel Sizing

### Overview

Modify `renderQuestion()` to measure option text before positioning, compute dynamic heights, and size the panel accordingly.

### Changes Required:

#### 1. `src/explorers/scenes/ExamScene.ts` — `renderQuestion()` method

**Change 1**: Pre-measure option text heights (insert before the option rendering loop at line 191)

Create temporary text objects for each option to measure their wrapped height, compute per-option heights and total options block height, then determine the dynamic panel height.

```typescript
// Pre-measure option text heights for dynamic layout
const optionMinH = 32;
const optionPadding = 12;
const textWrapWidth = optionW - 16; // account for indicator + padding

const optionHeights: number[] = [];
for (const opt of question.options) {
  const measure = this.add
    .text(0, 0, `\u25CB ${opt.text}`, {
      fontFamily: 'monospace',
      fontSize: '11px',
      wordWrap: { width: textWrapWidth },
    })
    .setVisible(false);
  optionHeights.push(Math.max(optionMinH, measure.height + optionPadding));
  measure.destroy();
}
```

**Change 2**: Compute dynamic panel height

Replace the fixed `panelH` computation. Calculate based on:
- Title bar: ~48px (title + separator)
- Question text height: measured after creation
- Multi-choice hint: 28px if applicable
- Options block: sum of `optionHeights` + gaps
- Nav bar + progress: ~68px
- Padding: ~24px

Since question text height is needed and it's created later, restructure to:
1. Create question text first (off-screen or measure separately)
2. Compute total height
3. Then position everything

Simpler approach: compute panelH after question text is created, but before drawing the panel background. Reorder rendering:

```typescript
// 1. Measure question text height
const questionMeasure = this.add
  .text(0, 0, question.text, {
    fontFamily: 'monospace',
    fontSize: '12px',
    wordWrap: { width: panelW - 40 },
    lineSpacing: 4,
  })
  .setVisible(false);
const questionTextHeight = questionMeasure.height;
questionMeasure.destroy();

// 2. Measure option heights
const optionMinH = 32;
const optionPadding = 12;
const textWrapWidth = panelW - 56;
const optionGap = 6;

const optionHeights: number[] = [];
for (const opt of question.options) {
  const measure = this.add
    .text(0, 0, `\u25CB ${opt.text}`, {
      fontFamily: 'monospace',
      fontSize: '11px',
      wordWrap: { width: textWrapWidth },
    })
    .setVisible(false);
  optionHeights.push(Math.max(optionMinH, measure.height + optionPadding));
  measure.destroy();
}

const totalOptionsH = optionHeights.reduce((sum, h) => sum + h, 0)
  + (optionHeights.length - 1) * optionGap;

const multiHintH = question.type === 'multi' ? 28 : 12;

// title(36) + sep(12) + questionText + hint/gap + options + nav(68) + padding(24)
const contentH = 48 + questionTextHeight + multiHintH + totalOptionsH + 68 + 24;
const panelH = Math.min(Math.max(contentH, 280), height - 40);
```

**Change 3**: Update option rendering loop to use dynamic heights

Replace the fixed `optionH` usage in the loop:

```typescript
let cumulativeY = optionStartY;
for (let i = 0; i < question.options.length; i++) {
  const opt = question.options[i];
  const optH = optionHeights[i];
  const optY = cumulativeY;
  // ...
  // Use optH instead of optionH for rectangle height
  // Position text at optY + optH / 2
  // ...
  cumulativeY += optH + optionGap;
}
```

**Change 4**: Add `wordWrap` to option label text

```typescript
const optLabel = this.add
  .text(panelLeft + 28, optY + optH / 2, `${indicator} ${opt.text}`, {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: isSelected ? '#00d4aa' : '#cccccc',
    wordWrap: { width: textWrapWidth },
  })
  .setOrigin(0, 0.5)
  .setScrollFactor(0)
  .setDepth(DEPTH.EXAM + 3);
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles: `npx tsc --noEmit` (no new errors)
- [x] Linting passes: `npm run lint` (only pre-existing error in showResults)
- [x] Existing tests pass: `npm run test`

#### Manual Verification:

- [ ] Load exam "Weryfikacja pamięci: Systemy agentowe" — all option text stays within panel
- [ ] Option boxes grow to accommodate wrapped text
- [ ] Short option text still renders correctly (minimum 32px height)
- [ ] Navigation buttons (Zamknij, Następne) visible and functional
- [ ] Progress bar visible at bottom of panel
- [ ] Multi-choice exam renders correctly with hint text
- [ ] Keyboard shortcuts (1-4, Enter) still work
- [ ] ESC dismisses exam

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful.

## Testing Strategy

### Manual Testing Steps:

1. Navigate to an exam with long answer options
2. Verify all text wraps within the panel
3. Click options — verify hover effects cover the full option height
4. Navigate between questions — verify layout recalculates
5. Test on different viewport sizes (resize browser window)
6. Complete an exam — verify results screen still works

## Performance Considerations

Measuring text via temporary Phaser text objects is cheap (happens once per render, ~4-5 objects created and destroyed). No performance impact expected.

## References

- ExamScene source: `src/explorers/scenes/ExamScene.ts`
- Constants: `src/explorers/config/constants.ts`
- Screenshot showing overflow: provided by user
