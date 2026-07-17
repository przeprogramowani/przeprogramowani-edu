# Awakening Spotlight Reveal Animation — Implementation Plan

## Overview

Add a spotlight reveal animation to the awakening level's cinematic intro. When the player starts the game for the first time, after the title card fades out, the screen stays black with only a small round spotlight around the player visible. The spotlight then expands to reveal the entire map, followed by a smooth fade-out of the remaining overlay. This replaces the current plain overlay fade-out + player fade-in sequence.

## Current State Analysis

The intro is implemented in `playCinematicIntro()` at `src/explorers/scenes/GameScene.ts:536-638`. The current sequence after title text fades out:

1. **Lines 604-607**: Overlay rectangle alpha tweened from 1 → 0 over 500ms
2. **Lines 614-618**: Player visibility set true, alpha tweened 0 → 1 over 500ms
3. **Lines 620-626**: Flag set, state saved, dialogue started

This ~1000ms reveal will be replaced with a ~2300ms spotlight reveal sequence.

### Key Discoveries:

- No existing RenderTexture usage in the codebase — this is the first use (`src/explorers/scenes/GameScene.ts`)
- `RenderTexture.erase()` works on both Canvas and WebGL — safe with `Phaser.AUTO` renderer (`src/explorers/config/gameConfig.ts:4`)
- `pixelArt: true` and `roundPixels: true` are set — use `Math.round()` on radius to prevent jitter (`src/explorers/config/gameConfig.ts:14-15`)
- Overlay uses `DEPTH.TRANSITION + 1` (101) and `setScrollFactor(0)` (`src/explorers/config/constants.ts:43`)
- First-time gating is already handled by `FLAGS.M0_INTRO_SEEN` — no new flag needed (`src/explorers/levels/m0-awakening/manifest.ts:21-24`)
- Camera follows player before intro check, so player is roughly centered on screen (`src/explorers/scenes/GameScene.ts:275-295`)

## Desired End State

After implementation, the awakening intro sequence plays as:

1. Title card fades in/out (unchanged)
2. Screen stays black, player becomes visible but hidden behind overlay
3. A RenderTexture replaces the overlay — full black with a ~40px circular hole centered on the player
4. Hold for 500ms so the player can identify the character
5. Circle radius expands from 40px → screen diagonal over 1500ms (Cubic.easeOut)
6. RenderTexture alpha fades to 0 over 300ms for smooth finish
7. RenderTexture destroyed, dialogue starts

**Verification**: Start a new game (or clear the `m0-intro-seen` flag). The spotlight should appear after the title card, hold briefly, expand smoothly, fade out, then dialogue begins. Revisiting the level should skip the entire intro.

## What We're NOT Doing

- No soft/feathered spotlight edge — hard crisp circle
- No elliptical shape — round circle only
- No pulse/breathing animation before expansion
- No sound effects for the spotlight (audio is a separate concern)
- No changes to the title card sequence (only replacing the reveal phase)
- No changes to dialogue timing or content

## Implementation Approach

Replace lines 604-628 in `playCinematicIntro()` with a spotlight reveal sequence using `Phaser.GameObjects.RenderTexture`. The RenderTexture is filled black and a circle is erased at the player's screen position each frame during the tween. After expansion, the RT alpha fades to 0 before cleanup.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **RenderTexture creation**: Created after title text fades out, replacing the overlay rectangle at the same depth
- **Tween sequence**: Hold (500ms delay) → Expand radius (1500ms) → Fade alpha (300ms) → Destroy + continue
- **Total spotlight phase**: ~2300ms (vs current ~1000ms for overlay+player fade)
- **No race conditions**: Linear tween chain, no concurrent animations

### User Experience Specification

- **Visual behavior**: After title fades, player is visible through a small spotlight hole in darkness. Light expands outward from player, then overlay fades away completely.
- **Hard circle edge**: Clean boundary matching the pixel-art aesthetic
- **Player always centered**: Camera follows player, so screen-center coordinates work for the spotlight center
- **Smooth finish**: 300ms alpha fade on the RT prevents abrupt visual pop when the overlay disappears

### Performance & Optimization Strategy

- **RenderTexture redrawn each tween update frame**: `clear() → fill(black) → erase(circle)`. This is lightweight — single RT with a simple circle erase.
- **Graphics object for erase**: Create once, reuse with `clear()` + `fillCircle()` each frame, destroy at end.
- **`Math.round()` on radius**: Prevents sub-pixel jitter with `roundPixels: true`.

### State Management Sequencing

- **N/A**: No complex state flows. The spotlight is a visual effect within an existing tween chain. The flag/save/dialogue trigger sequence is unchanged.

### Debug & Observability Plan

- **devLog**: Add `[GameScene] Spotlight reveal started` and `[GameScene] Spotlight reveal complete` messages
- **Verification**: Clear game state, reload — spotlight should play. Reload again — intro should be skipped entirely.

## Phase 1: Replace Overlay Reveal with Spotlight

### Overview

Replace the overlay fade-out + player fade-in block (lines 604-628) with the RenderTexture spotlight sequence.

### Changes Required:

#### 1. GameScene.ts — `playCinematicIntro()`

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Replace lines 604-628 (inside the title text fade-out `onComplete` callback)

**Before** (lines 602-628):
```typescript
onComplete: () => {
  // Fade out black overlay, reveal gameplay
  this.tweens.add({
    targets: overlay,
    alpha: 0,
    duration: 500,
    onComplete: () => {
      overlay.destroy();
      titleText.destroy();
      subtitleText.destroy();

      // Show player
      this.player.setVisible(true);
      this.tweens.add({
        targets: this.player,
        alpha: { from: 0, to: 1 },
        duration: 500,
        onComplete: () => {
          this.introPlaying = false;
          this.setFlag(introConfig.flag);
          saveState(this.gameState);

          // Trigger intro dialogue from manifest
          this.startDialogue(introConfig.dialogueId);
          devLog('[GameScene] Cinematic intro complete');
        },
      });
    },
  });
},
```

**After**:
```typescript
onComplete: () => {
  // Destroy text and original overlay — spotlight RT replaces it
  titleText.destroy();
  subtitleText.destroy();
  overlay.destroy();

  // Show player (hidden behind spotlight overlay)
  this.player.setVisible(true);
  this.player.setAlpha(1);

  // Create RenderTexture spotlight overlay
  const rt = this.add.renderTexture(0, 0, width, height);
  rt.setOrigin(0);
  rt.setScrollFactor(0);
  rt.setDepth(DEPTH.TRANSITION + 1);

  // Reusable graphics for erasing the spotlight circle
  const eraseGraphics = this.make.graphics({ x: 0, y: 0, add: false });

  const playerScreenX = cx; // Camera follows player — player is centered
  const playerScreenY = cy;
  const maxRadius = Math.ceil(Math.sqrt(width * width + height * height) / 2);

  // Draw initial spotlight (small circle)
  const drawSpotlight = (radius: number) => {
    const r = Math.round(radius);
    rt.clear();
    rt.fill(0x000000, 1);
    eraseGraphics.clear();
    eraseGraphics.fillStyle(0xffffff);
    eraseGraphics.fillCircle(playerScreenX, playerScreenY, r);
    rt.erase(eraseGraphics);
  };

  drawSpotlight(40);
  devLog('[GameScene] Spotlight reveal started');

  // Expand spotlight after brief hold
  const spotlightState = { radius: 40 };
  this.tweens.add({
    targets: spotlightState,
    radius: maxRadius,
    duration: 1500,
    ease: 'Cubic.easeOut',
    delay: 500,
    onUpdate: () => drawSpotlight(spotlightState.radius),
    onComplete: () => {
      // Fade out remaining overlay edges
      this.tweens.add({
        targets: rt,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          rt.destroy();
          eraseGraphics.destroy();

          this.introPlaying = false;
          this.setFlag(introConfig.flag);
          saveState(this.gameState);

          this.startDialogue(introConfig.dialogueId);
          devLog('[GameScene] Spotlight reveal complete');
        },
      });
    },
  });
},
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npx tsc --noEmit`
- [x] Linting passes: `npm run lint --workspace=edu-platform` (pre-existing lint warnings on lines 333/359, not from this change)
- [x] Build succeeds: `npm run build --workspace=edu-platform`

#### Manual Verification:

- [ ] Start a new game (or clear `m0-intro-seen` flag) — spotlight appears after title card
- [ ] Small spotlight is visible around the player for ~500ms
- [ ] Spotlight expands smoothly with ease-out curve over ~1500ms
- [ ] After expansion, overlay fades out smoothly (~300ms)
- [ ] Dialogue starts immediately after spotlight completes
- [ ] Revisiting the level does NOT replay the intro
- [ ] No visual glitches at the circle edge (no jitter, no gaps)
- [ ] Works on both Chrome and Firefox (Canvas/WebGL fallback)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding.

## Testing Strategy

### Unit Tests:

- No unit tests needed — this is a purely visual Phaser animation with no extractable logic.

### Manual Testing Steps:

1. Clear game state (delete KV game state or use fresh browser)
2. Navigate to `/explorers` and start the awakening level
3. Verify title card plays normally
4. Verify spotlight appears (small circle, player visible)
5. Verify smooth expansion animation
6. Verify smooth fade-out at end
7. Verify dialogue starts after spotlight
8. Reload the page — verify intro is skipped (flag persisted)
9. Test in Firefox to verify Canvas renderer compatibility

## Performance Considerations

- RenderTexture `fill()` + `erase()` on every tween frame is lightweight for a single full-screen RT with a circle
- The spotlight phase runs for ~2.3s total — brief enough that performance impact is negligible
- `eraseGraphics` object is created once and reused, destroyed at end

## References

- Research document: `thoughts/shared/research/2026-03-10-awakening-spotlight-reveal.md`
- Current intro implementation: `src/explorers/scenes/GameScene.ts:536-638`
- Depth constants: `src/explorers/config/constants.ts:34-45`
- Game config (renderer): `src/explorers/config/gameConfig.ts:4-27`
- Awakening manifest: `src/explorers/levels/m0-awakening/manifest.ts`
