---
date: 2026-03-10T12:00:00+01:00
researcher: Claude
git_commit: 5e18524f
branch: master
repository: przeprogramowani-sites
topic: "Spotlight reveal animation for awakening level intro"
tags: [research, codebase, game, awakening, animation, phaser, spotlight]
status: complete
last_updated: 2026-03-10
last_updated_by: Claude
---

# Research: Spotlight Reveal Animation for Awakening Level Intro

**Date**: 2026-03-10
**Researcher**: Claude
**Git Commit**: 5e18524f
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

When the player starts the game in the awakening level, introduce an extra animation (first time only) where the screen starts fully black with only a rounded spotlight on the player visible. Then a beam of light expands in all directions making the whole stage visible. The goal is to help players identify the main character immediately.

## Summary

The current awakening intro already hides the player and uses a black overlay during the cinematic title card sequence. The spotlight effect should be inserted **between the title card fade-out and the dialogue start** — specifically replacing the current "player fade in" step with a spotlight reveal sequence. Phaser 3's `BitmapMask` or `GeometryMask` (via a Graphics circle) can create the spotlight effect. The game uses `Phaser.AUTO` renderer, which falls back to Canvas if WebGL is unavailable — both support geometry masks.

## Detailed Findings

### 1. Current Cinematic Intro Flow

The intro is implemented in `GameScene.playCinematicIntro()` (`src/explorers/scenes/GameScene.ts:536-638`).

**Current sequence:**
1. Player hidden, cutscene state, input disabled
2. Black overlay (full screen, depth TRANSITION+1, scrollFactor 0)
3. Title text fade-in (1000ms)
4. Subtitle text fade-in (1000ms)
5. Hold (2000ms)
6. Texts fade-out (500ms)
7. **Black overlay fade-out (500ms)** ← replace this step
8. **Player fade-in (500ms)** ← replace this step
9. Set flag, save state, start dialogue

### 2. Where to Insert the Spotlight Reveal

Replace steps 7-8 with a spotlight sequence:

1. After text fade-out, **keep the black overlay at alpha 1**
2. Make player visible (but invisible to player due to overlay)
3. Apply a **circle mask** to the overlay (inverted — everything outside the circle is black)
4. Start with a very small circle radius centered on the player
5. Tween the circle radius from small → large enough to reveal the entire map
6. Once fully revealed, destroy the overlay and mask
7. Continue to dialogue

### 3. Phaser 3 Masking Approach

**Recommended: Graphics-based GeometryMask (inverted)**

```typescript
// Create a Graphics object for the mask shape
const maskGraphics = this.make.graphics({ x: 0, y: 0 });
maskGraphics.fillStyle(0xffffff);
maskGraphics.fillCircle(playerX, playerY, startRadius);

// Create geometry mask and invert it
const mask = maskGraphics.createGeometryMask();
mask.invertAlpha = true; // Everything OUTSIDE the circle is visible

// Apply mask to the black overlay
overlay.setMask(mask);
```

**Key consideration**: `invertAlpha` on GeometryMask means the **drawn area is hidden** and **undrawn area is visible**. So with `invertAlpha = true`, the circle area would be transparent (player visible) and everything else would be the black overlay.

Actually, for this use case we need the **opposite** of a standard mask approach. We want:
- Black everywhere EXCEPT a circle around the player
- The circle grows to reveal the whole screen

**Better approach — "hole punch" technique:**

Instead of masking the overlay, create a **full-screen Graphics object** that is a filled rectangle with a circular hole:

```typescript
const spotlight = this.add.graphics();
spotlight.setScrollFactor(0);
spotlight.setDepth(DEPTH.TRANSITION + 1);

function drawSpotlight(cx: number, cy: number, radius: number) {
  spotlight.clear();
  spotlight.fillStyle(0x000000, 1);
  // Fill entire screen
  spotlight.fillRect(0, 0, width, height);
  // Punch a circular hole using blend mode or erase
  spotlight.setBlendMode(Phaser.BlendModes.ERASE); // WebGL only!
  spotlight.fillCircle(cx, cy, radius);
  spotlight.setBlendMode(Phaser.BlendModes.NORMAL);
}
```

**Warning**: `ERASE` blend mode only works with WebGL renderer. Since the game uses `Phaser.AUTO`, this may fall back to Canvas where `ERASE` is not supported.

**Safest cross-renderer approach — RenderTexture + mask:**

Use a `Phaser.GameObjects.Graphics` to draw a white circle, create a geometry mask from it, and apply it to the **visible game content** (or apply inverted mask to the overlay).

**Simplest robust approach — Alpha mask via RenderTexture:**

```typescript
// 1. Create the spotlight overlay as a RenderTexture
const rt = this.add.renderTexture(cx, cy, width, height);
rt.setOrigin(0.5);
rt.setScrollFactor(0);
rt.setDepth(DEPTH.TRANSITION + 1);

// 2. Each frame, redraw: fill black, then erase a circle
function updateSpotlight(radius: number) {
  rt.clear();
  rt.fill(0x000000, 1); // Full black
  // Draw transparent circle (erase center)
  const eraseCircle = scene.make.graphics({ x: 0, y: 0, add: false });
  eraseCircle.fillStyle(0xffffff);
  eraseCircle.fillCircle(playerScreenX, playerScreenY, radius);
  rt.erase(eraseCircle); // Punch hole
  eraseCircle.destroy();
}
```

`RenderTexture.erase()` works on **both Canvas and WebGL** renderers — this is the safest approach.

### 4. Player Position During Spotlight

The player spawns at tile (0, 0) → pixel (32, 32) in world coordinates. Since the overlay uses `setScrollFactor(0)` (camera-fixed), we need to convert the player's world position to screen coordinates:

```typescript
const playerScreenX = this.player.x - this.cameras.main.scrollX;
const playerScreenY = this.player.y - this.cameras.main.scrollY;
```

But during the intro, the camera is following the player, so the player should be roughly centered. The camera starts following at `GameScene.create()` line 275-303.

### 5. Timing and Animation Parameters

**Suggested timeline for spotlight reveal:**
- Initial radius: ~40px (just enough to show the player sprite, which is 64×96)
- Hold at small radius: 500ms (let player identify the character)
- Expand to full screen: 1500ms with ease-out curve
- Final radius: `Math.sqrt(width² + height²) / 2` (diagonal half to cover all corners)
- Total: ~2000ms

**Tween approach** (since Phaser tweens don't directly tween arbitrary values, use a dummy object):

```typescript
const spotlightState = { radius: 40 };
this.tweens.add({
  targets: spotlightState,
  radius: maxRadius,
  duration: 1500,
  ease: 'Cubic.easeOut',
  delay: 500, // brief hold at small radius
  onUpdate: () => updateSpotlight(spotlightState.radius),
  onComplete: () => { /* destroy RT, continue to dialogue */ },
});
```

### 6. First-Time-Only Gating

The existing intro system already handles this perfectly:
- `manifest.introFlag: FLAGS.M0_INTRO_SEEN` prevents the intro from replaying
- The spotlight would be part of `playCinematicIntro()`, so it only runs when the flag is absent
- No additional flag needed

### 7. Depth Layering

Current depth constants from `src/explorers/config/constants.ts:34-45`:
- `PLAYER: 5`
- `TRANSITION: 100`

The spotlight overlay should use `DEPTH.TRANSITION + 1` (same as the current black overlay = 101). The player at depth 5 would normally be hidden behind this, but since the spotlight uses RenderTexture with an erased circle, the player is visible through the hole.

### 8. Edge Softness (Optional Enhancement)

For a softer spotlight edge, instead of a hard-edged circle, use a radial gradient via a pre-made texture or a series of concentric circles with decreasing alpha. This adds visual polish but increases complexity.

## Code References

- `src/explorers/scenes/GameScene.ts:536-638` — Current `playCinematicIntro()` implementation
- `src/explorers/scenes/GameScene.ts:546-549` — Player hidden + cutscene state setup
- `src/explorers/scenes/GameScene.ts:604-628` — Current overlay fade-out + player reveal (to be replaced)
- `src/explorers/levels/m0-awakening/manifest.ts:21-24` — Intro config with flag and cinematic titles
- `src/explorers/levels/m0-awakening/dialogues.ts:6-17` — Intro dialogue lines
- `src/explorers/entities/Astronaut.ts:16-46` — Player class, sprite setup, depth
- `src/explorers/config/constants.ts:34-45` — DEPTH constants
- `src/explorers/config/gameConfig.ts:4-27` — Phaser config (AUTO renderer, pixel art mode)

## Architecture Insights

1. **Renderer compatibility**: The game uses `Phaser.AUTO` which could be Canvas or WebGL. The `RenderTexture.erase()` method works on both — critical for the spotlight hole-punch technique.

2. **Pixel art mode**: `pixelArt: true` and `roundPixels: true` are set. The spotlight circle should still render smoothly since it's a vector-drawn overlay, not a sprite. However, `roundPixels` may cause slight jitter during the radius tween — using `Math.round()` on the radius value should prevent this.

3. **Camera scroll factor**: The spotlight overlay must use `setScrollFactor(0)` to stay fixed to the viewport, matching the existing overlay approach. Player world→screen coordinate conversion is needed.

4. **Existing tween chain**: The current intro uses deeply nested tween callbacks. The spotlight phase fits cleanly as a replacement for the overlay fade-out + player fade-in block (lines 604-628).

5. **Scale/resize handling**: The game uses `Phaser.Scale.RESIZE` — the spotlight should handle viewport size changes. Since the intro is short (~8s total), resize during playback is unlikely but the RenderTexture dimensions should match the current viewport.

## Implementation Recommendation

**Modify `playCinematicIntro()` in GameScene.ts:**

Replace lines 604-628 (the overlay fade-out + player fade-in) with:

1. Keep black overlay at full alpha
2. Make player visible (setVisible true)
3. Create a RenderTexture at same depth as overlay
4. Destroy the original rectangle overlay (RT replaces it)
5. Draw full-black RT with circular hole at player's screen position
6. Hold small spotlight for 500ms
7. Tween radius from 40 → max radius over 1500ms (ease: Cubic.easeOut)
8. On each tween update, redraw the RT (clear → fill black → erase circle)
9. On complete, destroy RT, set introPlaying=false, set flag, start dialogue

This approach:
- Works on both Canvas and WebGL
- Only plays on first visit (existing flag system)
- Clearly identifies the player character
- Feels cinematic and polished
- Minimal code changes (~30 lines replacing ~25 lines)

## Open Questions

1. **Soft edge vs hard edge**: Should the spotlight have a soft/feathered edge or a crisp circle? A soft edge is more cinematic but requires either a pre-baked gradient texture or multiple concentric circles.

2. **Spotlight shape**: Perfectly round, or slightly elliptical (taller to match the player sprite's 64×96 proportions)?

3. **Sound effect**: Should there be an audio cue (hum, power-up sound) accompanying the light expansion?

4. **Breathing/pulse**: Should the small spotlight pulse slightly before expanding, to draw extra attention?

5. **Post-expansion**: Should the spotlight disappear abruptly or fade the overlay edges smoothly to zero?
