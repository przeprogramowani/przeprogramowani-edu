# Wall Collision & NPC Distance Fix — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-22-wall-collision-npc-distance-fix.md`

## What & Why

Player feedback reports NPCs getting stuck against walls for seconds at a time, and NPC distance/approachability feeling inconsistent across levels. The root causes are a wander algorithm with no wall-bounce response, always-moving NPCs with no idle pauses, inconsistent speeds (45–120 px/s across NPCs), and a narrow collision body that creates visual wall overlap.

## Starting Point

NPCs use a simple random-direction wander with 1.5–3.5s timers. When Phaser's arcade physics stops an NPC at a wall, the NPC keeps pushing into it until the timer fires. There's no idle state, no post-dialogue grace period, and speeds vary 2.5× across NPCs. The collision body (48×32 px) covers only the feet of the 64×96 sprite.

## Desired End State

NPCs immediately redirect when hitting walls, occasionally pause between moves (~30% chance), stand still briefly after dialogue, and all move at a consistent 80 px/s. The collision body is wider (56×48 px), reducing visual wall overlap. Movement feels natural and approachable across all levels.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| --- | --- | --- |
| Wall-bounce strategy | Immediate redirect via `body.blocked` | Simplest fix, eliminates stuck behavior without callbacks (no callback pattern exists in codebase) |
| NPC tethering | No leash | Keep NPC freedom; other fixes address the distance perception |
| Idle state | 30% random idle chance, 1–2s pause | Makes NPCs feel natural and easier to approach without making rooms feel static |
| Post-dialogue behavior | Reset timer + 1.2s idle | Predictable behavior; player has a moment to re-orient |
| NPC speed | Standardize at 80 px/s | Consistent feel across levels; per-NPC overrides removed |
| Passable tiles | Keep all solid (audit complete) | Tiles are decorative wall variants used in all 4 maps; `TileIndex` is never imported |
| Collision body | Widen to 56×48 px | Reduces visual wall overlap; feet-only body was causing perceived clipping |

## Scope

**In scope:**
- NPC wall-bounce redirect (check `body.blocked` each frame)
- Random idle state between wander intervals
- Post-dialogue unfreeze with timer reset
- Speed standardization to 80 px/s
- Collision body widening (48×32 → 56×48)
- Cookbook documentation update

**Out of scope:**
- NPC leash/tether radius
- Passable tile logic for `WALL_VERT_PASS`/`WALL_HORIZ_PASS`
- Interaction detector changes (directional probe is intentional)
- Pathfinding or NPC AI
- Tiled map file edits

## Architecture / Approach

All changes are localized to 3 source files: `NPC.ts` (wander logic, idle state, unfreeze), `constants.ts` (speed, body dimensions, idle constants), and `GameScene.ts` (remove speed override reading). No new systems, no new files, no architecture changes. The approach uses existing Phaser arcade physics properties (`body.blocked`) rather than collision callbacks, matching established codebase patterns.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. NPC wander improvements | Wall-bounce, idle state, unfreeze reset | Wall-bounce in tight corridors may cause rapid re-rolling |
| 2. Speed standardization | All NPCs at 80 px/s | Animation frame rate needs to scale correctly |
| 3. Collision body widening | 56×48 body, less wall overlap | Tight corridors may become impassable; spawn validation may reject positions |
| 4. Documentation update | Updated cookbook | None |

**Prerequisites:** None — all changes are self-contained within the game module
**Estimated effort:** ~1 session across 4 phases (Phase 3 may need fallback tuning)

## Open Risks & Assumptions

- Wider collision body (Phase 3) may make single-tile corridors impassable — fallback to 52×40 px if needed
- Removing per-NPC speed overrides assumes no future map relies on character-specific speeds
- 30% idle chance is a tuning guess — may need adjustment based on feel

## Success Criteria (Summary)

- NPCs never visibly push into walls for more than one frame
- NPCs feel calm, approachable, and consistent across all 4 levels
- Player and NPCs don't visually clip through wall tiles at head/torso level
