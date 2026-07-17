---
date: 2026-04-22T11:34:34Z
researcher: Claude
git_commit: 382cef90
branch: master
repository: przeprogramowani/przeprogramowani-sites
topic: "Space Explorers: Wall collision & NPC distance issues — feedback analysis"
tags: [research, codebase, space-explorers, physics, collision, npc, movement]
status: complete
last_updated: 2026-04-22
last_updated_by: Claude
---

# Research: Space Explorers — Wall Collision & NPC Distance Issues

**Date**: 2026-04-22T11:34:34Z
**Researcher**: Claude
**Git Commit**: 382cef90
**Branch**: master
**Repository**: przeprogramowani/przeprogramowani-sites

## Research Question

Original feedback (`webinar/00-feedback.md`):

> Zagrałem w grę i zauważyłem, że zarówno postać gracza jak i NPC mają problem w poruszaniu się blisko ściany. Ponadto odległość między graczem a NPC wydaje się niewłaściwa – czasem zbyt blisko, czasem zbyt daleko.

Translation: Both player and NPC have movement issues near walls. The player-NPC distance also feels wrong — sometimes too close, sometimes too far.

## Summary

The feedback maps to **two distinct problem areas** with a total of **11 contributing code elements** across 6 files. The root causes are:

1. **Wall issues**: NPC wander logic has no wall-bounce detection (stuck for up to 3.5s), the collision body is much narrower than the sprite (visual overlap with walls), and blanket collision rules make decorative/passable tiles solid.
2. **Distance issues**: NPCs wander randomly with no leash radius, interaction detection is directional (probe-based), and NPC speeds vary wildly across levels (45–120 px/s).

---

## Detailed Findings

### A. Wall Movement Issues

#### A1. NPC wander has no wall-bounce logic (CRITICAL)

**File**: `src/explorers/entities/NPC.ts:110-121`

```typescript
update(delta: number): void {
    if (this.frozen) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.wanderTimer -= delta;
    if (this.wanderTimer <= 0) {
      const angle = Math.random() * Math.PI * 2;
      body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
      this.wanderTimer =
        NPC_WANDER_TIMER_MIN + Math.random() * (NPC_WANDER_TIMER_MAX - NPC_WANDER_TIMER_MIN);
    }
}
```

The NPC picks a random direction and maintains it for **1.5–3.5 seconds** regardless of collisions. If the direction points into a wall, the NPC pushes into it for the entire timer duration with no course correction. This is the most visible "stuck" behavior.

#### A2. Collision body vs sprite size mismatch (KEY)

**File**: `src/explorers/config/constants.ts:5-12`

```
Sprite frame:     64 × 96 px
Collision body:   48 × 32 px  (at offset 8, 52)
```

The collision body covers only the "feet" area. There are 52px of non-colliding sprite above the body. This means characters visually overlap walls at their head/torso while the physics body (at the feet) is correctly stopped. Players perceive this as "sticking" or "clipping."

Additionally, the 48px-wide body inside a 64px tile grid leaves only **8px clearance per side** in single-tile corridors — very tight, especially on diagonal movement.

#### A3. Blanket collision on wall layer tiles

**File**: `src/explorers/scenes/GameScene.ts:106`

```typescript
wallLayer.setCollisionByExclusion([-1, 0]);
```

Every non-empty tile on the Walls layer becomes solid. This includes tiles whose names suggest they should be passable:

- `WALL_VERT_PASS` (index 26) — vertically passable?
- `WALL_HORIZ_PASS` (index 27) — horizontally passable?
- `SPACE_VOID` (index 28) — decorative?

These are defined in `src/explorers/config/tileIndices.ts` but all get full collision.

#### A4. Every-frame velocity reapplication (player)

**File**: `src/explorers/entities/Astronaut.ts:81-97`

The player reapplies full velocity toward the wall every frame. Combined with `roundPixels: true` in the Phaser config (`src/explorers/config/gameConfig.ts:14`), this can cause sub-pixel jittering — the physics engine resolves the collision, pixel rounding shifts the position, and the next frame pushes back again.

#### A5. Multiple collision groups create pinch points

**File**: `src/explorers/scenes/GameScene.ts:271-284`

Four collider groups are active: player↔walls, NPC↔walls, NPC↔player, NPC↔NPC. If an NPC is pushing into a wall and the player approaches from behind, the player can get trapped between the NPC body and the wall.

---

### B. NPC Distance Issues

#### B1. No leash/tether radius (CRITICAL)

NPCs wander unbounded from their spawn point. Over multiple wander intervals (each up to 420px of travel = 6.5 tiles), an NPC can end up at the opposite corner of the room. There is no logic to pull it back toward its spawn position, creating the "too far" perception.

#### B2. Speed inconsistency across NPCs

| NPC | Level | Speed | Source |
|-----|-------|-------|--------|
| Engineer Moreau | m0-awakening | 120 px/s (default) | `constants.ts:70` |
| Officer Harris | m0-exam-room | 50 px/s | Tiled map property |
| Floobert | m0-crew-room | 45 px/s | Tiled map property |

Per-NPC speed is set via Tiled zone properties and read in `NPC.ts:59`:
```typescript
this.speed = speed ?? NPC_SPEED;
```

Moreau wanders 2.5× faster than the other NPCs, creating wildly different distance perception across levels.

#### B3. Directional probe-based interaction

**File**: `src/explorers/systems/InteractionDetector.ts:28-73`

Interaction detection doesn't use the player's position directly. It projects a **probe point** 38.4px (`TILE_SIZE * 0.6`) in the direction the player is facing, then checks within `INTERACTION_RADIUS` (96px) from that probe.

- Facing toward NPC: effective range ≈ 134px (~2.1 tiles)
- Facing away from NPC: interaction impossible even at zero distance

This asymmetry creates the "sometimes too close, sometimes too far" feeling — the player can be standing on top of the NPC but unable to interact because they're facing the wrong way.

#### B4. No idle state between wander intervals

NPCs are **always moving**. Velocity persists between wander timer resets (it's only changed when the timer fires). There is no random chance to pause or stand idle, making NPCs feel restless and hard to approach.

#### B5. Post-dialogue freeze/unfreeze inconsistency

**File**: `src/explorers/entities/NPC.ts:96-108`

When dialogue ends, `unfreeze()` clears the frozen flag but does **not reset the wander timer**. The NPC's velocity is 0 (from `freeze()`), but the timer retains its pre-freeze value. Result:
- If the timer had nearly expired → NPC immediately picks a new random direction
- If the timer was freshly reset → NPC stands still for up to 3.5 seconds

This creates unpredictable post-dialogue behavior.

#### B6. Physics body offset affects perceived distance

Both player and NPC share the same body dimensions (48×32 at offset 8,52). The collision body is at the feet, 52px below the sprite origin. Two characters whose physics bodies are adjacent will visually overlap at their upper bodies while appearing separated at their feet.

---

## Code References

| File | Lines | Element |
|------|-------|---------|
| `src/explorers/entities/NPC.ts` | 110-121 | Wander logic (no wall bounce) |
| `src/explorers/entities/NPC.ts` | 67-70 | NPC physics body setup |
| `src/explorers/entities/NPC.ts` | 96-108 | Freeze/unfreeze behavior |
| `src/explorers/entities/NPC.ts` | 59 | Speed override from zone properties |
| `src/explorers/entities/Astronaut.ts` | 81-97 | Player velocity handling |
| `src/explorers/entities/Astronaut.ts` | 29-33 | Player physics body setup |
| `src/explorers/config/constants.ts` | 5-12 | Body dimensions & offsets |
| `src/explorers/config/constants.ts` | 15, 70-72 | Speed & timer constants |
| `src/explorers/config/constants.ts` | 39 | Interaction radius |
| `src/explorers/config/gameConfig.ts` | 13-14 | pixelArt + roundPixels |
| `src/explorers/config/tileIndices.ts` | 26-28 | Passable tile indices |
| `src/explorers/scenes/GameScene.ts` | 106 | Blanket collision exclusion |
| `src/explorers/scenes/GameScene.ts` | 271-284 | Collider group setup |
| `src/explorers/scenes/GameScene.ts` | 287-290 | World bounds |
| `src/explorers/systems/InteractionDetector.ts` | 28-73 | Probe-based proximity detection |

## Architecture Insights

1. **Physics model**: Top-down Arcade physics with zero gravity. No per-tile collision shapes — all wall tiles use full 64×64 collision boxes regardless of visual shape.
2. **Entity model**: Player (`Astronaut`) and NPCs share the same body dimensions. NPCs have no AI beyond random wander — no pathfinding, no player-awareness, no goal-seeking.
3. **Interaction model**: Directional probe + radius, not simple proximity. This is a deliberate design choice (forces player to face NPCs) but creates non-obvious interaction failures.
4. **Map pipeline**: Tiled editor → JSON → `mapImporter.ts` → Phaser tilemap. NPC spawn positions and speeds come from Tiled object properties.

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-03-04-npc-system-design.md` — Original NPC system design
- `thoughts/shared/research/2026-03-05-astronaut-spawn-position-bug.md` — Prior spawn position issues
- `thoughts/shared/research/2026-03-10-32-to-64-sprite-migration.md` — Sprite size migration (may have introduced body offset discrepancies)
- `thoughts/shared/research/2026-02-23-spawn-zone-mechanics.md` — Spawn zone mechanics

## Open Questions

1. Are `WALL_VERT_PASS` and `WALL_HORIZ_PASS` tiles intentionally collidable, or should they allow directional passage?
2. Should NPCs have an idle state (zero velocity for random intervals) to make them easier to approach?
3. Should the wander timer reset on `unfreeze()` for consistent post-dialogue behavior?
4. Is 8px clearance per side in corridors acceptable, or should the body width be reduced?
