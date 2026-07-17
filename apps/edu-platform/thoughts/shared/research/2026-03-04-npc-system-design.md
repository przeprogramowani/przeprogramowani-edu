---
date: 2026-03-04T00:00:00+01:00
researcher: Claude (claude-sonnet-4-6)
git_commit: bb679fa9d745409e2316c9ae60db1d5f01ade7a7
branch: master
repository: przeprogramowani/przeprogramowani-sites
topic: "NPC System Design for 10x Explorers"
tags: [research, game, npc, phaser, dialogue, tiled, explorers]
status: complete
last_updated: 2026-03-04
last_updated_by: Claude (claude-sonnet-4-6)
---

# Research: NPC System Design for 10x Explorers

**Date**: 2026-03-04
**Researcher**: Claude (claude-sonnet-4-6)
**Git Commit**: bb679fa9d745409e2316c9ae60db1d5f01ade7a7
**Branch**: master
**Repository**: przeprogramowani/przeprogramowani-sites

## Research Question

Introduce a simplistic NPC system: NPCs freely moving through the stage from a starting point (supported in the Tiled editor), constrained by walls (same as the player), initiating dialogues with the same side-effects as existing dialogues (exp, quest, etc.).

## Summary

The codebase has all the building blocks needed. The player (`Astronaut`) uses Arcade Physics against a wall tilemap layer — NPCs can reuse the exact same pattern. The existing `InteractionDetector` + `DialogueManager` pipeline already handles player-proximity dialogue with full side-effects. No NPC class exists yet; adding one requires:

1. A new `NPC.ts` entity extending `Phaser.Physics.Arcade.Sprite`
2. A new Tiled object type `'npc'` in the Zones layer with spawn-position properties
3. GameScene updates to parse, spawn, collide, and proximity-check NPCs
4. Level manifest extension to define NPC dialogue routes
5. Dialogue sequences authored per-NPC in level dialogue files

---

## Detailed Findings

### Player Movement & Wall Collision (the model for NPCs)

- **`src/explorers/entities/Astronaut.ts:16`** — extends `Phaser.Physics.Arcade.Sprite`
- **`Astronaut.ts:29-32`** — physics body: 24×8 px at feet, offset (4, 32)
- **`Astronaut.ts:84-97`** — velocity-based movement: reads input → normalises diagonal → applies `vx * PLAYER_SPEED` / `vy * PLAYER_SPEED`
- **`src/explorers/config/constants.ts:2`** — `PLAYER_SPEED = 120` px/s
- **`src/explorers/scenes/GameScene.ts:96-101`** — wall layer: `setCollisionByExclusion([-1, 0])`
- **`GameScene.ts:209-215`** — `this.physics.add.collider(player, wallLayer)` — NPCs need the same call
- **`GameScene.ts:217-221`** — world bounds set to map dimensions; `setCollideWorldBounds(true)` on player body — NPCs should also set this

No base character class exists. Both `Astronaut` and any future NPC class extend `Phaser.Physics.Arcade.Sprite` directly.

### Dialogue System

- **`src/explorers/systems/DialogueTypes.ts:3-8`** — `DialogueLine.speaker` is typed as `'astronaut' | 'system' | string`, so any NPC name already works
- **`DialogueTypes.ts:26-30`** — `DialogueSequence { id, lines, onComplete? }`
- **`DialogueTypes.ts:10-24`** — `DialogueEffect` supports: `grantXp`, `activateQuest`, `completeQuest`, `setFlags`, `triggerEvent`, `addBookmark`, `openUrl`
- **`src/explorers/systems/DialogueManager.ts:84-124`** — `applyEffects()` handles all side-effects; triggered after last line advance
- **`src/explorers/scenes/GameScene.ts:333-379`** — `handleInteraction()` is the single entry point; calls `startDialogue(dialogueId)` for trigger zones — NPC interactions route through the same function
- **`GameScene.ts:418-425`** — `startDialogue()` emits `GameEvents.DIALOGUE_SHOW` — no changes needed here

Full interaction flow:
```
Player [E] near NPC
  → GameScene.handleInteraction()
  → resolve dialogueId from npcRoutes (manifest)
  → startDialogue(id)
  → DIALOGUE_SHOW event
  → DialogueScene → DialogueManager → DialogueBar
  → on last advance: applyEffects() (xp, flags, quests…)
  → DIALOGUE_DISMISSED → player control restored
```

### Tiled Map & Object Layer

- **`src/explorers/editor/types.ts`** — `TiledMap` has layers: Ground, Walls, Above, Zones
- **`GameScene.ts:109-132`** — Zones layer parsed into `ZoneObject[]` with `x`, `y`, `width`, `height`, `type`, `properties`
- **`GameScene.ts:156-171`** — each zone becomes an `InteractiveObject`; current supported types: `trigger | door | terminal | exam`

**For NPCs**: add type `'npc'` to the Zones layer. Required Tiled custom properties on NPC objects:
- `id` (string) — unique NPC identifier, matches manifest route
- `speed` (int, optional) — override default wander speed
- `sprite` (string, optional) — which NPC spritesheet to use (future)

NPC starting position is taken directly from the Tiled object's `x`/`y` coordinates (same as trigger zones).

### Level Manifest

- **`src/explorers/levels/types.ts:17-45`** — `LevelManifest` includes `interactionRoutes: InteractionRoute[]`
- **`src/explorers/levels/types.ts:5-14`** — `InteractionRoute { zoneId, defaultDialogue, flagVariants? }` — NPCs reuse this exact structure; `zoneId` will be the NPC `id`
- **`src/explorers/levels/m0-awakening/manifest.ts:1-21`** — example manifest showing how routes map zone IDs to dialogue IDs

NPCs can be added to `interactionRoutes` without changing the interface — the same flag-variant system allows different dialogues based on game state.

### Scene Lifecycle

- **`GameScene.ts:80-297`** — `create()`: builds tilemap, parses zones, spawns player, launches overlay scenes
- **`GameScene.ts:300-331`** — `update()`: updates player, runs interaction detection
- **`src/explorers/systems/InteractionDetector.ts`** — proximity + facing detection; currently detects only `InteractiveObject` instances; will need to detect NPCs too (or NPCs can have their own proximity trigger zone)
- **`GameScene.ts:277-297`** — `shutdown()`: destroys zones, cleans up listeners — NPC cleanup goes here

---

### Editor Support

The map editor must support placing NPC objects. Two files need changes:

**`src/explorers/editor/types.ts`**
- `ZoneObject.type`: extend union to `'trigger' | 'door' | 'terminal' | 'npc'`
- `ZONE_COLORS`: add `npc` entry (e.g. `'#e879f9'` — fuchsia to distinguish from other zone types)

**`src/explorers/editor/ZonePropertiesPanel.svelte`**
- Type `<select>`: add `<option value="npc">npc</option>`
- `setType('npc')`: default props — `id` (string, auto-slugged from name) + `npcType` (string, default `'scientist'`)
- NPC fields section in template:
  - `npcType` — dropdown listing known NPC types (scientist, alien, philosopher, …)
  - `speed` — optional int input (leave empty → NPC uses default speed from constants)

NPC objects in Tiled are placed at 32×32 (one tile) — same default size as trigger zones. The x/y from the Tiled object is the NPC spawn point.

## Code References

- `src/explorers/editor/types.ts:23` — ZoneObject type union (add 'npc')
- `src/explorers/editor/types.ts:79-83` — ZONE_COLORS (add 'npc' color)
- `src/explorers/editor/ZonePropertiesPanel.svelte:39-61` — setType() default props per type (add 'npc' branch)
- `src/explorers/editor/ZonePropertiesPanel.svelte:99-108` — type select options (add npc)
- `src/explorers/entities/Astronaut.ts:16-128` — Full player entity (template for NPC.ts)
- `src/explorers/entities/InteractiveObject.ts:1-69` — Zone wrapper (reference for NPC proximity zone pattern)
- `src/explorers/scenes/GameScene.ts:96-101` — Wall layer + collision setup
- `src/explorers/scenes/GameScene.ts:109-132` — Zones layer parsing (extend to handle 'npc' type)
- `src/explorers/scenes/GameScene.ts:156-171` — InteractiveObject creation loop (add NPC creation here)
- `src/explorers/scenes/GameScene.ts:209-215` — Physics collider registration (add for NPCs)
- `src/explorers/scenes/GameScene.ts:333-379` — handleInteraction() — no changes needed; NPC interaction flows through this
- `src/explorers/systems/DialogueManager.ts:84-124` — applyEffects() — unchanged, works for NPCs
- `src/explorers/systems/DialogueTypes.ts:1-30` — Dialogue data structures (speaker field already supports NPC names)
- `src/explorers/levels/types.ts:5-45` — LevelManifest + InteractionRoute types
- `src/explorers/config/constants.ts:1-10` — PLAYER_SPEED, TILE_SIZE, DEPTH constants

---

## Architecture Insights

### What to Build

**1. `src/explorers/entities/NPC.ts`**
- Extend `Phaser.Physics.Arcade.Sprite`
- Same physics body config as Astronaut (24×8 at feet, `setCollideWorldBounds(true)`)
- Store `startX`, `startY` from Tiled object coordinates
- Simple wander AI in `update()`: pick a random direction, walk for N ms, pick again; or bounce on wall contact
- Freeze velocity when player is in dialogue with this NPC (listen for `DIALOGUE_SHOW`/`DIALOGUE_DISMISSED`)
- Expose a `npcId` property for interaction routing

**2. `GameScene.ts` — NPC group for collision**
- Create `this.npcGroup = this.physics.add.group()` at scene creation
- After spawning NPCs: `this.physics.add.collider(npcGroup, wallLayer)`, `this.physics.add.collider(npcGroup, player)`, `this.physics.add.collider(npcGroup, npcGroup)`

**3. `GameScene.ts` — parse NPC objects from Zones layer**
- In the zones loop (`GameScene.ts:109-132`): if `obj.type === 'npc'`, push to `this.npcObjects` instead of `this.zoneObjects`
- After player creation, create `NPC` instances from `this.npcObjects`
- Register `this.physics.add.collider(npc, wallLayer)` for each NPC
- Optionally register `this.physics.add.collider(npc, player)` for bumping

**3. `GameScene.ts` — NPC proximity detection**
- Option A: Give each NPC a small trigger `Zone` (like `InteractiveObject`) — player enters → show prompt → [E] starts dialogue. This reuses the existing `InteractionDetector`.
- Option B: Extend `InteractionDetector` to accept NPC sprites as additional collidables.
- Option B is cleaner; Option A requires zero changes to `InteractionDetector`.

**4. `GameScene.ts` — update loop**
- Call `npc.update()` in `GameScene.update()` for each NPC

**5. Level manifest — add NPC routes**
- `interactionRoutes` already supports any `zoneId` — just add entries with the NPC's `id`
- Dialogue sequences go in the level's `dialogues.ts` using any speaker name

### NPC Wander Algorithm (simple)
```typescript
// In NPC.update(delta):
this.wanderTimer -= delta;
if (this.wanderTimer <= 0) {
  const angle = Math.random() * Math.PI * 2;
  this.body.setVelocity(
    Math.cos(angle) * NPC_SPEED,
    Math.sin(angle) * NPC_SPEED
  );
  this.wanderTimer = 1500 + Math.random() * 2000; // 1.5–3.5s per direction
}
// Wall physics collider handles stopping
```

### Dialogue Freeze During NPC Interaction
When the player initiates a dialogue with an NPC, the NPC should stop moving. This is naturally handled if the NPC listens for `GameEvents.DIALOGUE_SHOW` (freeze) and `GameEvents.DIALOGUE_DISMISSED` (resume) — same pattern used by GameScene to disable player input.

### Tiled Editor Support
Add NPC objects to the Zones layer in Tiled with:
- Type: `npc`
- Custom property `id`: `"engineer-moreau"` (or any unique string)
- Position: wherever the NPC should start wandering from
- Width/Height: 32×32 (or NPC hitbox size)

---

## Open Questions

~~1. **NPC spritesheet**: Separate NPC spritesheet. One PNG with all NPC types. Each NPC type occupies one row of 16 frames: 4 down, 4 right, 4 up, 4 left. Types (rows): scientist (0), alien (1), philosopher (2), etc. Row index = `npcType`.~~
~~2. **Wander radius**: Free-roaming across the map; walls are the only constraint (Arcade Physics collider).~~
~~3. **NPC facing animations**: Full 4-direction walk animations required.~~

Remaining open questions: ~~none~~

## Decisions

### Spritesheet Layout
Single `npc-characters.png` spritesheet:
- 16 frames per row (frame size: 32×32, same as player)
- Frame layout per NPC type row:
  - Frames 0–3: walk-down
  - Frames 4–7: walk-right
  - Frames 8–11: walk-up
  - Frames 12–15: walk-left
- NPC types are identified by **row index**: `scientist=0`, `alien=1`, `philosopher=2`, etc.
- Tiled property `npcType` (string/int) → determines which row to use for animation

### Animation Key Convention
Following the player convention (`walk-down`, `walk-left`, etc.), NPC animations will be keyed as:
```
npc-{npcType}-walk-down
npc-{npcType}-walk-right
npc-{npcType}-walk-up
npc-{npcType}-walk-left
```
Registered once in `PreloaderScene` when the NPC spritesheet is loaded.

### Wander Behaviour
- NPCs wander freely across the entire map
- Only constraint: Arcade Physics wall layer collider (same as player)
- On wall contact: `body.velocity` is zeroed by physics; NPC picks a new random direction on next wander timer tick
- No home-radius restriction

### NPC–NPC Collision
- NPCs collide with each other — `physics.add.collider(npcGroup, npcGroup)`
- They act like dynamic walls: neither passes through the other
- Use a Phaser `Physics.Arcade.Group` for all NPCs to make group-vs-group collider registration trivial

### Dialogue Scope
- NPC dialogue routes are **level-scoped** — defined in the level's `LevelManifest.interactionRoutes`, same as trigger/terminal zones
- `zoneId` in the route matches the NPC's `id` property from Tiled
- No shared cross-map NPC dialogue registry needed

### Facing Direction & Animation
Same `FacingDirection` enum as player (`down | right | up | left`).
NPC updates facing based on dominant velocity axis each frame, plays matching walk animation.
Idle: plays frame 0 of the current facing direction (no separate idle animation needed).
