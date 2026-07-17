# How NPC Movement Works

> Explanation of the four-state movement machine that drives every wandering NPC in the explorer game.
>
> **Audience:** Engine developers and curious content authors who want to understand the *why*.

## Context

NPCs in the explorer game need to feel alive without being annoying. They wander inside the room they spawn in, pause occasionally, recover cleanly when they bump a wall, and hold still during dialogue. Doing this naively — raw random walk plus a "blocked" flag — produces oscillation against walls, jittery direction flips, and NPCs that wander into other rooms through doorways the designer never meant them to use.

The shipped design is the minimum that avoids all three failure modes: a four-state movement machine (wandering, idle, wallRecovery, frozen), a pair of debounce timers around wall contact, and a per-NPC walkable-region mask computed once at spawn. The rest of this page explains how those pieces fit together.

## State diagram

```
                 ┌──────────────────────────┐
                 │          frozen          │◄──── freeze() (external)
                 └──────────────────────────┘
                        │  unfreeze()
                        ▼
  ┌──────────┐  timer   ┌──────────┐  chance   ┌──────────┐
  │ wandering│ ───────► │   idle   │ ◄─────────│ wandering│
  │          │          │          │           │          │
  │          │ ◄─────── │          │ timer     │          │
  └──────────┘          └──────────┘           └──────────┘
       │ ▲
       │ │ stable clear
 blocked│ │
       ▼ │
  ┌────────────┐
  │wallRecovery│
  └────────────┘
       ▲
       │ position outside movementBounds
       │  (from any non-frozen state)
```

- `wandering` and `idle` are the natural cycle: each wander phase ends by rolling against `NPC_IDLE_CHANCE`, either entering a brief idle or picking a new direction.
- `wallRecovery` is a debounced recovery state entered when the NPC has been blocked in its travel direction for long enough, or when `enforceMovementBounds` snaps it back inside its allowed region.
- `frozen` is an external override: no internal transition can enter or leave it. Dialogue, exams, and arcade interactions use it to hold every NPC still.

## States

**`wandering`** — the default active state. The NPC moves at `NPC_SPEED` in a randomized direction for a randomized duration drawn from `[NPC_WANDER_TIMER_MIN, NPC_WANDER_TIMER_MAX]`. Entered via `startWandering()`. Exits to `idle` or a fresh `wandering` phase when the timer runs out, or to `wallRecovery` when travel-direction blocking persists past the grace window.

**`idle`** — a short pause, weighted into the wander cycle so NPCs feel less mechanical. Duration is drawn from `[NPC_IDLE_DURATION_MIN, NPC_IDLE_DURATION_MAX]` on a natural transition, or forced to `NPC_IDLE_AFTER_UNFREEZE_MS` when leaving `frozen`. Velocity is zeroed. Exits to `wandering` when the timer runs out.

**`wallRecovery`** — the NPC holds still while the physics body is marked immovable, waiting out `NPC_WALL_RECOVERY_MIN_MS` plus a `NPC_WALL_CLEAR_STABLE_MS` window during which no wall contact is detected. Entered from `wandering` when blocking persists past `NPC_WALL_BLOCKED_GRACE_MS`, or from any non-frozen state when `enforceMovementBounds` resets the body to its last known good position. Exits via `chooseNextMovementPhase()`, which re-rolls between `wandering` and `idle`.

**`frozen`** — an external override. Enter via `freeze()` (called for every NPC when dialogue, exam, or arcade scenes start); exit only via `unfreeze()`, which routes through `idle` for `NPC_IDLE_AFTER_UNFREEZE_MS` rather than snapping back into motion. While frozen, the body is immovable and no timers advance.

## Timer constants

All values live in `projects/edu-platform/src/explorers/config/constants.ts` (not in `NPC.ts`; the entity imports them).

| Constant | Value | Role |
|---|---|---|
| `NPC_SPEED` | `TILE_SIZE * 1.25` (80 px/s) | Wander velocity magnitude. |
| `NPC_WANDER_TIMER_MIN` | `1500` ms | Minimum length of a wander phase. |
| `NPC_WANDER_TIMER_MAX` | `3500` ms | Maximum length of a wander phase. Also caps the randomized constructor-time stagger. |
| `NPC_IDLE_CHANCE` | `0.3` | Probability of entering `idle` (vs. a fresh `wandering`) at the end of each wander or wallRecovery phase. |
| `NPC_IDLE_DURATION_MIN` | `1000` ms | Minimum idle duration on natural transitions. |
| `NPC_IDLE_DURATION_MAX` | `2000` ms | Maximum idle duration on natural transitions. |
| `NPC_IDLE_AFTER_UNFREEZE_MS` | `1200` ms | Fixed idle duration after `unfreeze()`. Prevents a hard snap back into motion after dialogue. |
| `NPC_WALL_BLOCKED_GRACE_MS` | `150` ms | How long travel-direction blocking must persist before `wandering` transitions to `wallRecovery`. Absorbs transient collider noise. |
| `NPC_WALL_RECOVERY_MIN_MS` | `350` ms | Minimum time the NPC stays in `wallRecovery` before it can start evaluating the "clear" window. |
| `NPC_WALL_CLEAR_STABLE_MS` | `150` ms | How long the NPC must remain unblocked before `wallRecovery` exits. |

```ts
70:79:projects/edu-platform/src/explorers/config/constants.ts
export const NPC_SPEED = TILE_SIZE * 1.25; // 80 px/s — slower than PLAYER_SPEED
export const NPC_WANDER_TIMER_MIN = 1500; // ms
export const NPC_WANDER_TIMER_MAX = 3500; // ms
export const NPC_IDLE_CHANCE = 0.3;
export const NPC_IDLE_DURATION_MIN = 1000; // ms
export const NPC_IDLE_DURATION_MAX = 2000; // ms
export const NPC_IDLE_AFTER_UNFREEZE_MS = 1200; // ms
export const NPC_WALL_BLOCKED_GRACE_MS = 150; // ms
export const NPC_WALL_RECOVERY_MIN_MS = 350; // ms
export const NPC_WALL_CLEAR_STABLE_MS = 150; // ms
```

## External control surface

Three public methods on `NPC` let the rest of the engine drive behaviour without reaching into state internals.

- **`freeze()`** (see `NPC.ts:152:164`) — forces the machine into `frozen`, zeroes velocity, stops animation, and leaves the NPC on an idle frame. Used by `GameScene` for every NPC when dialogue, exam, or arcade scenes start.
- **`unfreeze()`** (see `NPC.ts:166:168`) — delegates to `enterIdle(NPC_IDLE_AFTER_UNFREEZE_MS)`. The NPC does **not** snap back into `wandering`; it waits out a short idle first. This is deliberate: an immediate resume feels robotic, especially across a group of NPCs unfreezing together after a dialogue.
- **`faceTowards(targetX, targetY)`** (see `NPC.ts:170:185`) — rotates the sprite to face a world position without touching movement state. Called at dialogue entry so the NPC looks at the player.

The interaction between `freeze`/`unfreeze` and the machine is why `frozen` is drawn as a sidelined state in the diagram: it never participates in the natural cycle. Only external callers move the NPC in and out of it.

**Example — `faceTowards` at dialogue entry**

```ts
437:442:projects/edu-platform/src/explorers/scenes/GameScene.ts
      case 'npc': {
        obj.faceTowards(this.player.x, this.player.y);
        const dialogueId = this.resolveDialogueId(obj.objectId);
        this.startDialogue(dialogueId);
        break;
      }
```

`startDialogue` then calls `freeze()` on every NPC (see `GameScene.ts:551:558`), so the faced NPC keeps its new facing while every NPC in the room goes still.

## Trade-offs and why-not alternatives

- **Why not a single `blocked` boolean instead of a state?** Raw blocked/not-blocked flips at the physics-step rate. An NPC brushing a wall parallel to travel oscillates between moving and stopping every frame. The two-timer debounce (`NPC_WALL_BLOCKED_GRACE_MS` on entry, `NPC_WALL_CLEAR_STABLE_MS` on exit) absorbs that noise and collapses contiguous contact into one visible pause.
- **Why check only the travel direction, not all four?** Omnidirectional block detection fires when the NPC is brushing a wall parallel to its travel vector — a common and harmless case. `isBlockedInTravelDirection` (see `NPC.ts:61:72`) only triggers on the axis the NPC is actually trying to move along, which matches the user-visible notion of "stuck".
- **Why `enforceMovementBounds` on top of Phaser wall colliders?** Wall colliders prevent walking *into* walls but not walking *around* them through doorways the designer meant to be one-way, or through gaps opened by dynamic tile changes. The flood-filled bounds (see `movement-bounds.md`) pin each NPC to the room it spawned in without the content author having to build explicit invisible walls.
- **Why route `unfreeze` through `idle` instead of back to `wandering`?** Directly re-entering `wandering` made a group of NPCs snap to motion the instant a dialogue closed, which read as mechanical. The short forced idle gives the scene a beat to breathe and desynchronizes the group.

## See also

- [`movement-bounds.md`](./movement-bounds.md) — reference for the `ActorMovementBounds` API that scopes each NPC's walkable region.
- [`cookbook.md`](./cookbook.md) — how-to for content authors placing and wiring NPCs.
- Source: `projects/edu-platform/src/explorers/entities/NPC.ts`.
