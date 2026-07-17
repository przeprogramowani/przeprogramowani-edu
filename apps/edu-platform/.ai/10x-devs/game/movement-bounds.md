# `actorMovementBounds` — Reference

> Reference for the movement-bounds module that constrains NPC wander regions to wall-connected areas.
>
> **Audience:** Engine developers. Look up a signature, parameter contract, or return shape.

Source: `projects/edu-platform/src/explorers/state/actorMovementBounds.ts`

## Types

### `ActorPosition`

World-space pixel coordinates of an actor's anchor point (sprite centre).

| Field | Type | Description |
|-------|------|-------------|
| `x` | `number` | Horizontal position in pixels. |
| `y` | `number` | Vertical position in pixels. |

```ts
12:15:projects/edu-platform/src/explorers/state/actorMovementBounds.ts
export interface ActorPosition {
  x: number;
  y: number;
}
```

---

### `ActorMovementBounds`

A walkable-tile mask for a specific region of the map, derived from a BFS flood-fill. `allowed[y][x]` is `true` when an actor's body is permitted to occupy tile `(x, y)`.

| Field | Type | Description |
|-------|------|-------------|
| `width` | `number` | Map width in tiles. |
| `height` | `number` | Map height in tiles. |
| `tileSize` | `number` | Tile side length in pixels. Mirrors the collision grid's `tileSize` (defaults to `TILE_SIZE`). |
| `allowed` | `boolean[][]` | Row-major grid (`allowed[y][x]`) of walkable tiles. |

```ts
17:22:projects/edu-platform/src/explorers/state/actorMovementBounds.ts
export interface ActorMovementBounds {
  width: number;
  height: number;
  tileSize: number;
  allowed: boolean[][];
}
```

---

## Functions

### `buildActorMovementBounds(collisionGrid, origin)`

Builds an `ActorMovementBounds` by flood-filling outward from the tile(s) the `origin` body occupies, blocked only by tiles marked as collisions in `collisionGrid`.

**Signature**

```ts
function buildActorMovementBounds(
  collisionGrid: SpawnCollisionGrid,
  origin: ActorPosition,
): ActorMovementBounds;
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `collisionGrid` | `SpawnCollisionGrid` | Per-tile collision mask for the active map. `tileSize` is optional and falls back to the shared `TILE_SIZE` constant. |
| `origin` | `ActorPosition` | World-space position where the actor spawns. Treated as the BFS seed. |

**Returns** — `ActorMovementBounds` whose `allowed` grid contains every non-collision tile reachable (4-neighbour) from the origin tile(s).

**Algorithm** — 4-neighbour breadth-first flood fill seeded with the body-rectangle tiles of `origin`. Walls and out-of-map tiles stop expansion.

**Failure modes**

- If the origin body extends off the map, the returned bounds contain an `allowed` grid of all `false` — the NPC is effectively pinned. See the off-map guard at `actorMovementBounds.ts:51:53`.
- If the origin tiles themselves are walls, BFS never enqueues them and the result is all `false`.

**Example — building bounds at NPC spawn**

```ts
210:225:projects/edu-platform/src/explorers/scenes/GameScene.ts
    for (const zone of npcZones) {
      const npcTypeName = (zone.properties['npcType'] as string) ?? 'scientist';
      const npc = new NPC(
        this,
        zone.x + zone.width / 2,
        zone.y + zone.height / 2,
        zone.id,
        npcTypeName,
        buildActorMovementBounds(this.collisionGrid, {
          x: zone.x + zone.width / 2,
          y: zone.y + zone.height / 2,
        }),
      );
      this.npcGroup.add(npc as unknown as Phaser.GameObjects.GameObject);
      this.npcs.push(npc);
    }
```

```ts
70:136:projects/edu-platform/src/explorers/state/actorMovementBounds.ts
```

---

### `isActorPositionWithinBounds(bounds, position)`

Tests whether every tile occupied by an actor's body at `position` is flagged `allowed` in `bounds`. Used on every frame to detect when an NPC has crossed out of its walkable region.

**Signature**

```ts
function isActorPositionWithinBounds(
  bounds: ActorMovementBounds,
  position: ActorPosition,
): boolean;
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `bounds` | `ActorMovementBounds` | Bounds produced by `buildActorMovementBounds`. |
| `position` | `ActorPosition` | World-space position to test. |

**Returns** — `true` iff all tiles overlapped by the actor's body rectangle at `position` are `allowed`; `false` otherwise.

**Computation** — Derives the body rectangle from the shared player-body constants (`PLAYER_BODY_WIDTH`, `PLAYER_BODY_HEIGHT`, `PLAYER_BODY_OFFSET_X`, `PLAYER_BODY_OFFSET_Y`), splits it into tile coordinates, and checks each tile against `bounds.allowed`.

**Edge cases**

- A body extending even partially off the map returns `false` (the off-map guard in `getOccupiedTiles`).
- Because the body rectangle is smaller than a full tile, a well-centred actor typically occupies one or two tiles.

**Example — per-frame enforcement inside `NPC.update`**

```ts
334:358:projects/edu-platform/src/explorers/entities/NPC.ts
  private enforceMovementBounds(): void {
    if (!this.movementBounds) {
      return;
    }

    const currentPosition = { x: this.x, y: this.y };

    if (isActorPositionWithinBounds(this.movementBounds, currentPosition)) {
      this.lastAllowedPosition = currentPosition;
      this.hasAllowedPosition = true;
      return;
    }

    if (!this.hasAllowedPosition) {
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.reset(this.lastAllowedPosition.x, this.lastAllowedPosition.y);
    this.setDepth(actorDepth(this.y));

    if (this.movementState !== 'frozen') {
      this.enterWallRecovery();
      return;
    }
```

```ts
138:155:projects/edu-platform/src/explorers/state/actorMovementBounds.ts
```

---

## See also

- [`npc-behavior.md`](./npc-behavior.md) — explanation of the NPC movement state machine that consumes these bounds.
- [`cookbook.md`](./cookbook.md) — how-to for content authors placing NPCs in Tiled.
- `projects/edu-platform/src/explorers/state/spawnValidation.ts` — source of the `SpawnCollisionGrid` type.
