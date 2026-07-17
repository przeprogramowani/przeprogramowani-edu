# Reduce Astronaut Collision Body Height Implementation Plan

## Overview

Reduce the astronaut's physics collision body height by half (16px → 8px) so the player can walk closer to walls and obstacles. The body stays anchored at the sprite's feet.

## Current State Analysis

The astronaut sprite is 32×48 pixels. The physics body is configured at:

```typescript
body.setSize(24, 16);    // 24px wide, 16px tall
body.setOffset(4, 32);   // starts at x=4, y=32 → covers y: 32–48 (bottom 16px)
```

This creates a 24×16 collision box at the feet, but it leaves too much gap between the astronaut's legs and nearby walls/obstacles.

### Key Discoveries:

- Collision body setup: `src/explorers/entities/Astronaut.ts:30-32`
- Only entity with a physics body — all other objects use zones/proximity detection
- Wall collisions via `physics.add.collider(player, wallLayer)` in `GameScene.ts:220-225`
- Door overlap uses `body.center` for AABB checks — smaller body shifts center down slightly but doors are large enough that this won't matter

## Desired End State

The astronaut's collision body is 24×8 pixels anchored at the very bottom of the sprite (feet level). The player can walk noticeably closer to walls above and below while maintaining the same horizontal clearance.

### Verification:
- Astronaut walks closer to walls (especially top/bottom edges)
- No clipping through walls or getting stuck
- Door transitions still trigger correctly
- Interaction prompts still appear at correct distances

## What We're NOT Doing

- Not changing horizontal body width (stays at 24px)
- Not adjusting interaction radius or probe distance
- Not modifying door zone sizes or detection logic
- Not touching any other entity collision settings

## Implementation Approach

Single-line change in `Astronaut.ts` — reduce body height and adjust Y offset to keep body at sprite bottom.

## Critical Implementation Details

### Timing & Lifecycle Considerations
**N/A**: This is a static physics body configuration, no lifecycle concerns.

### User Experience Specification
- Player will be able to walk ~8px closer to walls above/below
- No visual change to the sprite itself
- Movement feel remains the same (same speed, same animation)

### Performance & Optimization Strategy
**N/A**: No performance impact — same physics body, just smaller dimensions.

### State Management Sequencing
**N/A**: No state changes involved.

### Debug & Observability Plan
- Enable `debug: true` in `src/explorers/config/gameConfig.ts` arcade physics config to visualize the new body size
- Walk the astronaut into walls from all four directions to verify no clipping

## Phase 1: Reduce Collision Body

### Overview
Change two numbers in the Astronaut constructor.

### Changes Required:

#### 1. Astronaut Physics Body

**File**: `src/explorers/entities/Astronaut.ts`
**Changes**: Reduce body height from 16 to 8, adjust Y offset from 32 to 40

```typescript
// Before:
body.setSize(24, 16);
body.setOffset(4, 32);

// After:
body.setSize(24, 8);
body.setOffset(4, 40);
```

Offset math: sprite height (48) - body height (8) = 40

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compiles: `npm run build` (no type changes, but confirms no syntax errors)

#### Manual Verification:

- [ ] Astronaut walks closer to walls above/below than before
- [ ] Astronaut does NOT clip through any wall tiles
- [ ] Astronaut does NOT get stuck on any geometry
- [ ] Door transitions still trigger when walking into doors
- [ ] Interaction prompts (terminals, triggers) still appear correctly
- [ ] Diagonal movement near walls still works smoothly

## Testing Strategy

### Manual Testing Steps:

1. Walk astronaut into walls from all four cardinal directions — verify collision stops movement
2. Walk diagonally along walls — verify smooth sliding, no snags
3. Walk through all doors in the game — verify transitions trigger
4. Approach terminals/triggers — verify interaction prompts appear
5. Compare gap between astronaut and walls vs. before the change

## References

- Astronaut entity: `src/explorers/entities/Astronaut.ts:29-32`
- Wall collision setup: `src/explorers/scenes/GameScene.ts:220-225`
- Door overlap check: `src/explorers/scenes/GameScene.ts:365-386`
- Physics config: `src/explorers/config/gameConfig.ts:15-20`
