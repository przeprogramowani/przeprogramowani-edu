# Door Auto-Transitions Implementation Plan

## Overview

Replace the current E-key door interaction with automatic scene transitions triggered when the player walks onto a door zone. This creates a seamless exploration experience — the player simply walks into a doorway and the fade transition fires immediately.

## Current State Analysis

### How doors work now:
1. Doors are defined as zone objects in Tiled map JSONs with `type: "door"` and properties `targetMap`, `spawnX`, `spawnY`
2. In `GameScene.update()`, the `InteractionDetector` checks proximity using a probe point in the player's facing direction
3. When a door is the nearest interactable and the player presses **E**, `handleInteraction()` fires `TRANSITION_START`
4. `TransitionScene` handles the fade-to-black and restarts `GameScene` with the new map data

### Key files:
- `src/explorers/scenes/GameScene.ts:312-328` — proximity check in update loop
- `src/explorers/scenes/GameScene.ts:349-358` — door case in `handleInteraction()`
- `src/explorers/scenes/TransitionScene.ts:41-87` — transition fade logic
- `src/explorers/systems/InteractionDetector.ts` — proximity detection
- `src/explorers/entities/InteractiveObject.ts` — object data model

### The bounce-back problem:
When transitioning between maps, the player spawns near the destination door. Example:
- `ship-hibernation` door at `(416, 192)` sends player to `ship-corridor` at tile `(1, 4)` = pixel `(32, 128)`
- `ship-corridor` has its door back to hibernation at `(0, 128)` — the spawn point is 32px away from the door zone

With auto-transitions, the player would immediately overlap the return door and bounce back. Solution: a spawn immunity cooldown.

## Desired End State

- Walking onto a door zone instantly triggers the fade transition to the target map
- No E-key prompt or interaction needed for doors
- E-key interaction still works for triggers and terminals (unchanged)
- After spawning into a new map, door overlaps are ignored for 500ms to prevent bounce-back
- No changes to map JSON files required

## What We're NOT Doing

- No visual walk-into animation before transitions
- No changes to spawn point positions in map JSONs
- No changes to the TransitionScene fade logic
- No changes to trigger/terminal interaction (E-key stays for those)
- No door-specific tile rendering changes

## Implementation Approach

Use a manual bounds-overlap check in `GameScene.update()` rather than Phaser physics overlap. This is consistent with the existing manual proximity pattern in `InteractionDetector` and avoids adding physics bodies to door zones.

## Critical Implementation Details

### Timing & Lifecycle Considerations

- **Spawn Immunity**: Set a `doorCooldownActive` flag to `true` in `GameScene.create()`. Clear it after 500ms via `this.time.delayedCall()`. During cooldown, skip all door overlap checks.
- **Transition guard**: Once a door transition is triggered, set a `doorTransitioning` flag to prevent multiple overlaps from firing duplicate transitions during the same frame or during the fade animation.
- **Scene restart**: On `GameScene` restart (new map), all instance state resets in `create()`, so the cooldown naturally reinitializes.

### User Experience Specification

- **Walk onto door** → instant fade-to-black (300ms) → new map loads → fade-out (300ms). Same timings as current E-key transition.
- **[E] prompt no longer shows for doors**. Triggers and terminals still show the prompt as before.
- **During cooldown** (first 500ms after spawn), walking over a door zone does nothing.

### Debug & Observability Plan

- Add `console.log('[GameScene] Door auto-transition: ${doorObj.objectId} → ${targetMap}')` when a door overlap fires
- Add `console.log('[GameScene] Door cooldown active, ignoring overlap')` during cooldown period
- Verification: walk between all 3 maps (hibernation ↔ corridor ↔ bridge) without bounce-back issues

## Phase 1: Implement Door Auto-Transitions

### Overview

Modify `GameScene` to detect player overlap with door zones and trigger transitions automatically, while adding spawn immunity cooldown.

### Changes Required:

#### 1. GameScene — Add state properties

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Add door-tracking state to the class

```typescript
// New properties (add after existing private properties)
private doorObjects: InteractiveObject[] = [];
private doorCooldownActive = true;
private doorTransitioning = false;
```

#### 2. GameScene.create() — Separate door objects and set up cooldown

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: After creating InteractiveObjects, separate doors from other interactables. Add cooldown timer.

In the zone creation loop (around line 162-178), after pushing to `interactiveObjects`, also collect doors:

```typescript
// After the existing loop that creates InteractiveObjects
this.doorObjects = this.interactiveObjects.filter(obj => obj.objectType === 'door');
```

Add spawn cooldown timer after the interaction system setup:

```typescript
// Spawn cooldown — ignore door overlaps for 500ms after entering map
this.doorCooldownActive = true;
this.doorTransitioning = false;
this.time.delayedCall(500, () => {
  this.doorCooldownActive = false;
  console.log('[GameScene] Door cooldown expired, auto-transitions active');
});
```

#### 3. GameScene.update() — Add door overlap check

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Add door overlap detection before the existing interaction proximity check. Replace the existing interaction flow so doors are excluded from E-key checks.

Add a new method and call it from `update()`:

```typescript
private checkDoorOverlap(): boolean {
  if (this.doorCooldownActive || this.doorTransitioning) return false;

  const body = this.player.body as Phaser.Physics.Arcade.Body;
  const playerCenterX = body.center.x;
  const playerCenterY = body.center.y;

  for (const door of this.doorObjects) {
    // Check if player center is inside the door zone bounds
    if (
      playerCenterX >= door.x &&
      playerCenterX <= door.x + door.width &&
      playerCenterY >= door.y &&
      playerCenterY <= door.y + door.height
    ) {
      this.triggerDoorTransition(door);
      return true;
    }
  }
  return false;
}

private triggerDoorTransition(door: InteractiveObject): void {
  const targetMap = door.properties['targetMap'] as string;
  const spawnX = door.properties['spawnX'] as number;
  const spawnY = door.properties['spawnY'] as number;

  console.log(`[GameScene] Door auto-transition: ${door.objectId} → ${targetMap} at (${spawnX}, ${spawnY})`);

  this.doorTransitioning = true;
  this.interactionPrompt.hide();
  this.player.enterState('cutscene');
  this.inputController.setEnabled(false);
  this.bus.emit(GameEvents.TRANSITION_START, { targetMap, spawnX, spawnY });
}
```

In `update()`, call `checkDoorOverlap()` after the player update and before the interaction check:

```typescript
update(): void {
  if (!this.player || this.introPlaying) return;

  this.player.update();

  // Skip interaction checks during dialogue
  if (this.inDialogue) {
    this.interactionPrompt.hide();
    return;
  }

  // Auto-transition: check if player walked onto a door zone
  if (this.checkDoorOverlap()) return;

  // Interaction proximity check (triggers and terminals only — doors handled above)
  const nearest = this.interactionDetector.getNearest(
    this.player.x,
    this.player.y,
    this.player.facing,
    this.gameState.flags
  );

  if (nearest && nearest.objectType !== 'door') {
    this.interactionPrompt.show(nearest.centerX, nearest.centerY);

    if (this.inputController.isInteractJustPressed()) {
      this.handleInteraction(nearest);
    }
  } else {
    this.interactionPrompt.hide();
  }
}
```

#### 4. GameScene.handleInteraction() — Remove door case

**File**: `src/explorers/scenes/GameScene.ts`
**Changes**: Remove the `case 'door'` block from `handleInteraction()` since doors are now handled by `triggerDoorTransition()`.

```typescript
private handleInteraction(obj: InteractiveObject): void {
  console.log(`[GameScene] Interaction: ${obj.objectId} (${obj.objectType})`);

  switch (obj.objectType) {
    case 'trigger': {
      // ... (unchanged)
      break;
    }
    case 'terminal':
      // ... (unchanged)
      break;
  }
}
```

### Success Criteria:

#### Automated Verification:

- [x] TypeScript compiles without errors: `npm run build`
- [x] No linting errors

#### Manual Verification:

- [ ] Walk into the door in ship-hibernation → fade transition to ship-corridor
- [ ] Walk into the left door in ship-corridor → fade transition back to ship-hibernation
- [ ] Walk into the right door in ship-corridor → fade transition to ship-bridge
- [ ] Walk into the door in ship-bridge → fade transition back to ship-corridor
- [ ] No bounce-back: after transitioning, player does NOT immediately return
- [ ] Triggers (pod, screens, notice board, etc.) still require E-key and show prompt
- [ ] Terminal in ship-bridge still requires E-key and shows prompt
- [ ] Walking near a door (but not overlapping) does NOT trigger transition
- [ ] Rapid back-and-forth transitions between maps work without getting stuck

## Testing Strategy

### Manual Testing Steps:

1. Start in ship-hibernation, walk to the right-side door opening → should transition to ship-corridor
2. In ship-corridor, walk left to the opening → should go back to hibernation
3. In ship-corridor, walk right to the opening → should go to bridge
4. In ship-bridge, walk left to the opening → should go back to corridor
5. After each transition, stand still for 1 second — no bounce-back should occur
6. After each transition, walk back toward the door you came from — transition should only fire after the 500ms cooldown
7. Test that interacting with a trigger (e.g., Hibernation Pod) still works with E key
8. Test that the `[E]` prompt does NOT appear when near a door

## Performance Considerations

- The door overlap check runs every frame, but iterates over at most 1-2 door objects per map — negligible performance impact
- No new physics bodies are created; the check uses simple bounds comparison

## References

- Existing transition system: `src/explorers/scenes/TransitionScene.ts`
- Door zone definitions: `public/game/maps/ship-*.json` (Zones object layers)
- Interaction system: `src/explorers/systems/InteractionDetector.ts`
