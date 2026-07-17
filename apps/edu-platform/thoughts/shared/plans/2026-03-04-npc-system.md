# NPC System Implementation Plan

## Overview

Add a simple NPC system to the 10x Explorers Phaser 3 game. NPCs wander freely on the map (random-direction AI), collide with walls and each other, and initiate full-featured dialogues with XP / quest / flag side-effects when the player presses [E] nearby. All building blocks exist; we wire them together.

---

## Current State Analysis

- `entities/` has only `Astronaut.ts` and `InteractiveObject.ts` — no NPC class
- `InteractionDetector` works with `InteractiveObject[]` only; `centerX`/`centerY` are `readonly` values set at construction (fixed position)
- `PreloaderScene` loads `astronaut.png` only — no NPC spritesheet
- `editor/types.ts` ZoneObject type union is `'trigger' | 'door' | 'terminal'` — missing `'npc'`
- `LevelManifest.interactionRoutes` uses `zoneId: string` — already works for any ID, including NPC IDs
- `DialogueTypes.ts` speaker field is `'astronaut' | 'system' | string` — already accepts NPC names
- `/public/game/sprites/` contains only `astronaut.png` and `placeholder-astronaut.png` — `npc-characters.png` does not exist yet (author creates it separately)

### Key Discoveries

- `Astronaut.ts:30-32` — physics body: 24×8 px at feet, offset (4, 32) — NPCs reuse this exactly
- `GameScene.ts:109-132` — Zones layer parsed into `ZoneObject[]`; all types go to `this.zoneObjects`; NPCs must be separated here
- `GameScene.ts:156-171` — `InteractiveObject` creation loop — NPCs skip this and go to a separate `this.npcs` array
- `InteractionDetector.ts:51-64` — proximity loop uses `obj.centerX`/`obj.centerY`; for moving NPCs these must be dynamic getters returning the sprite's current position
- `GameScene.ts:418-425` — `startDialogue()` is the single entry point for all dialogue start — NPC interactions route through the same method
- `constants.ts:1-44` — `PLAYER_SPEED = 120`, `INTERACTION_RADIUS = 48`, `WALK_FRAME_RATE = 10`, `DEPTH.PLAYER = 5`

---

## Desired End State

After this plan is implemented:

1. Map authors can place NPC objects in the Tiled Zones layer (`type: npc`, required property `id`, optional `npcType`, `speed`)
2. NPCs spawn at their Tiled coordinates and wander freely, constrained only by Arcade Physics wall collider
3. NPCs collide with each other and with the player (no pass-through)
4. When the player faces an NPC and is within `INTERACTION_RADIUS`, prompt `[E] Porozmawiaj` appears and tracks the NPC's current position
5. On [E], the NPC dialogue resolves via `interactionRoutes` (same flag-variant system as triggers)
6. All NPCs freeze during any active dialogue or exam; they resume wandering when dismissed
7. NPC animations play the matching 4-direction walk anim from the `npc-characters.png` spritesheet; idle frame shows when velocity is (0, 0)
8. The editor (ZonePropertiesPanel) supports creating NPC zones with `npcType` and `speed` fields
9. One example NPC (`engineer-moreau`) exists in `m0-awakening` with dialogue and XP reward

### Verification Steps

- Start the game, navigate to `m0-awakening` — see an NPC wandering
- Walk next to the NPC — prompt `[E] Porozmawiaj` hovers above the NPC and follows its movement
- Press [E] — NPC freezes, dialogue plays, player gets XP
- Press ESC — dialogue dismissed, NPC resumes wandering
- NPCs don't walk through walls or each other

---

## What We're NOT Doing

- Creating `npc-characters.png` (author handles this separately; plan references it as an assumed asset)
- NPC nameplates / HUD name display
- NPC patrol routes or home-radius restrictions
- Multi-stage stateful NPC dialogues (level authors can add `flagVariants` to manifest routes using the existing mechanism)
- Adding `exam` to `editor/types.ts` ZoneObject union (pre-existing gap, separate ticket)
- Modifying the Tiled `.json` map file directly (NPC zone placement in m0-awakening is a manual editor step, documented in Phase 6 success criteria)

---

## Implementation Approach

**Option B** (from research) for proximity detection: extend `InteractionDetector` with a shared `Interactable` interface. Both `InteractiveObject` and `NPC` implement it structurally. This lets the detector's `getNearest()` return a dynamic NPC position each frame without hacks.

NPC dialogue routing reuses `interactionRoutes` in the level manifest — `zoneId` matches the NPC `id` property from Tiled. `startDialogue()` and `resolveDialogueId()` require minimal changes.

---

## Critical Implementation Details

### Spritesheet Layout

Single `npc-characters.png` spritesheet (32×48 px frames, 16 frames per row):

| Row | NPC type   | Frames 0–3 | Frames 4–7 | Frames 8–11 | Frames 12–15 |
|-----|------------|------------|------------|-------------|--------------|
| 0   | scientist  | walk-down  | walk-right | walk-up     | walk-left    |
| 1   | alien      | walk-down  | walk-right | walk-up     | walk-left    |
| 2   | philosopher| walk-down  | walk-right | walk-up     | walk-left    |

Animation keys: `npc-{typeName}-walk-{dir}` (e.g. `npc-scientist-walk-down`)

### NPC Wander Algorithm

```typescript
// In NPC.update(delta):
this.wanderTimer -= delta;
if (this.wanderTimer <= 0) {
  const angle = Math.random() * Math.PI * 2;
  body.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
  this.wanderTimer = NPC_WANDER_TIMER_MIN + Math.random() * (NPC_WANDER_TIMER_MAX - NPC_WANDER_TIMER_MIN);
}
// Wall physics collider zeros velocity on impact; NPC waits for next timer tick
```

### Interaction Prompt Tracking

`NPC.centerX` and `NPC.centerY` are dynamic getters (`return this.x; / return this.y;`). `InteractionPrompt.show(nearest.centerX, nearest.centerY, ...)` is called every frame in `GameScene.update()`, so the prompt follows the NPC automatically.

### NPC Freeze / Unfreeze

All NPCs freeze on **any** dialogue or exam start (not just NPC dialogues). `startDialogue()` and exam `handleInteraction` call `this.npcs.forEach(npc => npc.freeze())`. Matching dismiss events call `unfreeze()`.

### `Interactable` Interface (Option B)

Defined in `InteractionDetector.ts`, exported:

```typescript
export interface Interactable {
  readonly objectId: string;
  readonly objectType: string;
  readonly centerX: number;
  readonly centerY: number;
  readonly requiredFlag: string | undefined;
}
```

`InteractiveObject` satisfies this structurally (all properties already exist). `NPC` exposes these via getters. No changes to `InteractiveObject.ts`.

`InteractionDetector` changes `interactables: InteractiveObject[]` → `interactables: Interactable[]` and `getNearest()` returns `Interactable | null`.

### `resolveDialogueId` Signature Change

Currently accepts `InteractiveObject`; changed to accept `string` (the objectId). All three call sites within `handleInteraction` pass `obj.objectId` instead of `obj`. Fallback is the `objectId` string itself (previously was `obj.eventId`, which defaults to `obj.objectId` anyway).

### GameScene NPC Dispatch

`handleInteraction(obj: Interactable)` gains a `'npc'` case that falls through to `'trigger'`:

```typescript
case 'npc':
case 'trigger': {
  const dialogueId = this.resolveDialogueId(obj.objectId);
  this.startDialogue(dialogueId);
  break;
}
```

`door` and `exam` cases cast to `InteractiveObject` for extended properties (`requiredFlags`, `properties`).

---

## Phase 1: Foundation — NPC Entity, Constants, Editor Types

### Overview

Create the `NPC` entity class and add supporting constants and editor type definitions.

### Changes Required

#### 1. `src/explorers/config/constants.ts`

**File**: `src/explorers/config/constants.ts`
**Changes**: Add NPC speed constants and NPC type→row mapping

```typescript
export const NPC_SPEED = 60; // px/s — slower than PLAYER_SPEED (120)
export const NPC_WANDER_TIMER_MIN = 1500; // ms
export const NPC_WANDER_TIMER_MAX = 3500; // ms

// Maps npcType Tiled property → spritesheet row index
export const NPC_TYPE_ROWS: Record<string, number> = {
  scientist: 0,
  alien: 1,
  philosopher: 2,
};
```

#### 2. `src/explorers/entities/NPC.ts` (new file)

**File**: `src/explorers/entities/NPC.ts`
**Changes**: Create NPC entity class

```typescript
import Phaser from 'phaser';
import {
  DEPTH,
  WALK_FRAME_RATE,
  NPC_SPEED,
  NPC_WANDER_TIMER_MIN,
  NPC_WANDER_TIMER_MAX,
  NPC_TYPE_ROWS,
} from '../config/constants';
import type { FacingDirection } from '../state/types';

// Idle frame offset within a row for each facing direction
// Layout per row: 0-3 walk-down, 4-7 walk-right, 8-11 walk-up, 12-15 walk-left
const IDLE_FRAME_OFFSET: Record<FacingDirection, number> = {
  down: 0,
  right: 4,
  up: 8,
  left: 12,
};

export class NPC extends Phaser.Physics.Arcade.Sprite {
  readonly npcId: string;
  readonly npcTypeName: string;
  private readonly npcRow: number;
  private readonly speed: number;
  private facing: FacingDirection = 'down';
  private wanderTimer: number;
  private frozen = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    npcId: string,
    npcTypeName = 'scientist',
    speed = NPC_SPEED,
  ) {
    const row = NPC_TYPE_ROWS[npcTypeName] ?? 0;
    super(scene, x, y, 'npc-characters', row * 16);

    scene.add.existing(this as Phaser.GameObjects.GameObject);
    scene.physics.add.existing(this as Phaser.GameObjects.GameObject);

    this.npcId = npcId;
    this.npcTypeName = npcTypeName;
    this.npcRow = row;
    this.speed = speed;

    // Stagger initial timers so NPCs don't all move in sync
    this.wanderTimer = Math.random() * NPC_WANDER_TIMER_MAX;

    // Same body config as Astronaut — feet hitbox
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 8);
    body.setOffset(4, 32);
    body.setCollideWorldBounds(true);

    this.setDepth(DEPTH.PLAYER);
  }

  // Interactable interface — dynamic position getters
  get objectId(): string {
    return this.npcId;
  }

  get objectType(): 'npc' {
    return 'npc';
  }

  get centerX(): number {
    return this.x;
  }

  get centerY(): number {
    return this.y;
  }

  get requiredFlag(): undefined {
    return undefined;
  }

  freeze(): void {
    this.frozen = true;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    if (this.anims.isPlaying) {
      this.stop();
    }
    this.setFrame(this.npcRow * 16 + IDLE_FRAME_OFFSET[this.facing]);
  }

  unfreeze(): void {
    this.frozen = false;
  }

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

    // Update facing based on dominant velocity axis
    if (Math.abs(body.velocity.x) >= Math.abs(body.velocity.y)) {
      this.facing = body.velocity.x < 0 ? 'left' : 'right';
    } else {
      this.facing = body.velocity.y < 0 ? 'up' : 'down';
    }

    // Play walk animation or show idle frame
    if (body.velocity.x === 0 && body.velocity.y === 0) {
      if (this.anims.isPlaying) {
        this.stop();
        this.setFrame(this.npcRow * 16 + IDLE_FRAME_OFFSET[this.facing]);
      }
    } else {
      const animKey = `npc-${this.npcTypeName}-walk-${this.facing}`;
      if (!this.anims.isPlaying || this.anims.currentAnim?.key !== animKey) {
        this.play(animKey, true);
      }
    }
  }
}
```

#### 3. `src/explorers/editor/types.ts`

**File**: `src/explorers/editor/types.ts`
**Changes**: Add `'npc'` to `ZoneObject.type` union and add npc color

```typescript
// Line 24: extend type union
type: 'trigger' | 'door' | 'terminal' | 'npc';

// Lines 79-83: add npc color
export const ZONE_COLORS: Record<ZoneObject['type'], string> = {
  trigger: '#ffb347',
  door: '#00d4aa',
  terminal: '#00d4aa',
  npc: '#e879f9', // fuchsia
};
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles with no errors: `npm run build --workspace=edu-platform` (or `npx tsc --noEmit`)
- [x] `NPC.ts` exists at `src/explorers/entities/NPC.ts`

#### Manual Verification

- [ ] N/A — no runtime behavior yet; verified in later phases

---

## Phase 2: Asset Loading & Animations

### Overview

Load the `npc-characters.png` spritesheet in `PreloaderScene` and register walk animations for all known NPC types.

### Changes Required

#### 1. `src/explorers/scenes/PreloaderScene.ts`

**File**: `src/explorers/scenes/PreloaderScene.ts`
**Changes**: Add spritesheet load in `preload()` and animation registration in `create()`

In `preload()`, after the astronaut spritesheet load:
```typescript
this.load.spritesheet('npc-characters', '/game/sprites/npc-characters.png', {
  frameWidth: 32,
  frameHeight: 48,
});
```

In `create()`, after existing walk animation registration:
```typescript
import { NPC_TYPE_ROWS, WALK_FRAME_RATE } from '../config/constants';

// Register NPC walk animations for all known NPC types
const npcDirs = ['down', 'right', 'up', 'left'] as const;
for (const [typeName, row] of Object.entries(NPC_TYPE_ROWS)) {
  const rowOffset = row * 16;
  npcDirs.forEach((dir, dirIndex) => {
    const start = rowOffset + dirIndex * 4;
    this.anims.create({
      key: `npc-${typeName}-walk-${dir}`,
      frames: this.anims.generateFrameNumbers('npc-characters', { start, end: start + 3 }),
      frameRate: WALK_FRAME_RATE,
      repeat: -1,
    });
  });
}
devLog('[PreloaderScene] NPC animations registered');
```

### Success Criteria

#### Automated Verification

- [x] TypeScript compiles with no errors

#### Manual Verification

- [ ] Game loads without console errors about missing animations (only possible once `npc-characters.png` exists at `/public/game/sprites/npc-characters.png`)
- [ ] If spritesheet missing, Phaser logs a warning but does not crash

---

## Phase 3: Interaction System Extension

### Overview

Introduce the `Interactable` interface in `InteractionDetector.ts` and update the detector to accept both `InteractiveObject` and `NPC`.

### Changes Required

#### 1. `src/explorers/systems/InteractionDetector.ts`

**File**: `src/explorers/systems/InteractionDetector.ts`
**Changes**: Export `Interactable` interface; change `interactables` array type; update all method signatures

```typescript
import { INTERACTION_RADIUS, TILE_SIZE } from '../config/constants';
import type { FacingDirection } from '../state/types';

export interface Interactable {
  readonly objectId: string;
  readonly objectType: string;
  readonly centerX: number;
  readonly centerY: number;
  readonly requiredFlag: string | undefined;
}

export class InteractionDetector {
  private interactables: Interactable[] = [];

  register(obj: Interactable): void {
    this.interactables.push(obj);
  }

  registerAll(objects: Interactable[]): void {
    this.interactables.push(...objects);
  }

  clear(): void {
    this.interactables = [];
  }

  getNearest(
    playerX: number,
    playerY: number,
    facing: FacingDirection,
    flags: Set<string>
  ): Interactable | null {
    let probeX = playerX;
    let probeY = playerY;
    const offset = TILE_SIZE * 0.6;

    switch (facing) {
      case 'up':    probeY -= offset; break;
      case 'down':  probeY += offset; break;
      case 'left':  probeX -= offset; break;
      case 'right': probeX += offset; break;
    }

    let closest: Interactable | null = null;
    let closestDistSq = INTERACTION_RADIUS * INTERACTION_RADIUS;

    for (const obj of this.interactables) {
      const dx = probeX - obj.centerX;
      const dy = probeY - obj.centerY;
      const distSq = dx * dx + dy * dy;

      if (distSq < closestDistSq) {
        closest = obj;
        closestDistSq = distSq;
      }
    }

    return closest;
  }

  getAll(): Interactable[] {
    return this.interactables;
  }
}
```

Note: `InteractiveObject` satisfies `Interactable` structurally (all required properties already exist). No changes to `InteractiveObject.ts`.

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles with no errors

---

## Phase 4: GameScene Integration

### Overview

Parse NPC zones separately, spawn `NPC` instances, register physics colliders, call `npc.update()` each frame, and handle NPC interactions in `handleInteraction()`. Also update `resolveDialogueId` signature and add NPC freeze/unfreeze to dialogue lifecycle.

### Changes Required

#### 1. `src/explorers/scenes/GameScene.ts`

**Changes**: Multiple additions throughout the file

**a) Imports** — add at top:
```typescript
import { NPC } from '../entities/NPC';
import type { Interactable } from '../systems/InteractionDetector';
```

**b) Class fields** — add to class:
```typescript
private npcs: NPC[] = [];
private npcGroup!: Phaser.Physics.Arcade.Group;
```

**c) `create()` — separate NPC zones during parsing** (modify the zone-parsing loop `GameScene.ts:110-132`):

Replace:
```typescript
this.zoneObjects.push({ ... });
```
With:
```typescript
const zoneData = { id: ..., name: ..., type: ..., x: ..., y: ..., width: ..., height: ..., properties: props };
if (zoneData.type === 'npc') {
  // Handled separately below — skip adding to zoneObjects
  npcZones.push(zoneData);
} else {
  this.zoneObjects.push(zoneData);
}
```

Declare `const npcZones: ZoneObject[] = [];` before the loop.

**d) `create()` — add NPC group creation and NPC spawning** (after player creation at ~line 207):
```typescript
// Create NPC group for batch physics
this.npcGroup = this.physics.add.group();
this.npcs = [];

for (const zone of npcZones) {
  const npcTypeName = (zone.properties['npcType'] as string) ?? 'scientist';
  const speedProp = zone.properties['speed'] as number | undefined;
  const npc = new NPC(
    this,
    zone.x + zone.width / 2,
    zone.y + zone.height / 2,
    zone.id,
    npcTypeName,
    speedProp,
  );
  this.npcGroup.add(npc as unknown as Phaser.GameObjects.GameObject);
  this.npcs.push(npc);
}
devLog(`[GameScene] Spawned ${this.npcs.length} NPC(s)`);
```

**e) `create()` — register NPC physics colliders** (after existing wall collider at ~line 209-215):
```typescript
// NPC physics colliders
if (this.wallLayer) {
  this.physics.add.collider(this.npcGroup, this.wallLayer);
}
this.physics.add.collider(
  this.npcGroup,
  this.player as unknown as Phaser.Types.Physics.Arcade.ArcadeColliderType
);
this.physics.add.collider(this.npcGroup, this.npcGroup);
```

**f) `create()` — register NPCs with InteractionDetector** (after `this.interactionDetector.registerAll(this.interactiveObjects)`):
```typescript
this.interactionDetector.registerAll(this.npcs);
```

**g) `create()` — add NPC unfreeze to onDialogueDismissed**:
```typescript
const onDialogueDismissed = () => {
  this.inDialogue = false;
  this.player.enterState('idle');
  this.inputController.setEnabled(true);
  this.npcs.forEach((npc) => npc.unfreeze()); // ← add
  devLog('[GameScene] Dialogue dismissed, movement restored');
};
```

**h) `create()` — add NPC unfreeze to onExamDismissed**:
```typescript
const onExamDismissed = () => {
  this.player.enterState('idle');
  this.inputController.setEnabled(true);
  this.npcs.forEach((npc) => npc.unfreeze()); // ← add
  devLog('[GameScene] Exam dismissed, movement restored');
};
```

**i) `create()` — add NPC cleanup to shutdown handler**:
```typescript
this.events.on('shutdown', () => {
  // existing cleanup...
  this.npcs.forEach((npc) => npc.destroy());
  this.npcs = [];
  this.npcGroup.destroy(true);
});
```

**j) `update()` — call npc.update() each frame**:
```typescript
update(): void {
  if (!this.player || this.introPlaying) return;

  this.player.update();

  const delta = this.game.loop.delta;
  for (const npc of this.npcs) {
    npc.update(delta);
  }
  // ... rest of update unchanged
}
```

**k) `update()` — add NPC prompt label and update return type**:

In the nearest-object block, add:
```typescript
if (nearest.objectType === 'npc') promptLabel = '[E] Porozmawiaj';
```

The `nearest` variable is now typed `Interactable | null`. The call to `handleInteraction(nearest)` needs the type update.

**l) `handleInteraction()` — change signature and add 'npc' case**:
```typescript
private handleInteraction(obj: Interactable): void {
  devLog(`[GameScene] Interaction: ${obj.objectId} (${obj.objectType})`);

  switch (obj.objectType) {
    case 'npc':
    case 'trigger': {
      const dialogueId = this.resolveDialogueId(obj.objectId);
      this.startDialogue(dialogueId);
      break;
    }
    case 'terminal':
      devLog(`[GameScene] Terminal interaction: ${obj.objectId}`);
      this.startDialogue('terminal-first-use');
      break;
    case 'door': {
      const ioObj = obj as InteractiveObject;
      const requiredFlags = ioObj.requiredFlags;
      if (requiredFlags.length > 0) {
        const missingFlags = requiredFlags.filter((f) => !this.hasFlag(f));
        if (missingFlags.length > 0) {
          devLog(`[GameScene] Door ${obj.objectId} locked — missing flags: ${missingFlags.join(', ')}`);
          this.startDialogue(this.resolveDialogueId(obj.objectId));
          break;
        }
      }
      this.triggerDoorTransition(ioObj);
      break;
    }
    case 'exam': {
      const ioObj = obj as InteractiveObject;
      const examId = ioObj.properties['examId'] as string;
      if (!examId) {
        devLog(`[GameScene] Exam zone ${obj.objectId} missing examId property`);
        break;
      }
      if (this.gameState.exams?.completed.includes(examId)) {
        this.startDialogue(this.resolveDialogueId(obj.objectId));
      } else {
        this.inputController.setEnabled(false);
        this.player.enterState('cutscene');
        this.interactionPrompt.hide();
        this.npcs.forEach((npc) => npc.freeze()); // freeze NPCs during exam
        this.bus.emit(GameEvents.EXAM_SHOW, { examId });
      }
      break;
    }
  }
}
```

**m) `resolveDialogueId()` — change parameter from `InteractiveObject` to `string`**:
```typescript
private resolveDialogueId(objectId: string): string {
  const routes = getInteractionRoutes(this.mapKey);
  const route = routes.find((r) => r.zoneId === objectId);

  if (!route) {
    return objectId; // fallback: use objectId directly (previously used obj.eventId which defaults to objectId)
  }

  if (route.flagVariants) {
    for (const variant of route.flagVariants) {
      if (this.hasFlag(variant.flag)) {
        devLog(`[GameScene] Route resolved: ${objectId} → ${variant.dialogue} (flag: ${variant.flag})`);
        return variant.dialogue;
      }
    }
  }

  devLog(`[GameScene] Route resolved: ${objectId} → ${route.defaultDialogue} (default)`);
  return route.defaultDialogue;
}
```

**n) `startDialogue()` — freeze NPCs**:
```typescript
private startDialogue(dialogueId: string): void {
  this.inDialogue = true;
  this.player.enterState('dialogue');
  this.inputController.setEnabled(false);
  this.interactionPrompt.hide();
  this.npcs.forEach((npc) => npc.freeze()); // ← add
  this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
}
```

**o) Debug overlays** — add NPC color to zone debug rects in `create()` (after existing color assignments):
```typescript
if (zone.type === 'npc') color = 0xe879f9; // fuchsia
```

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`

#### Manual Verification

- [ ] NPCs visible on the map, wandering
- [ ] NPCs stop at walls, don't pass through each other
- [ ] `[E] Porozmawiaj` prompt appears when player is near NPC and tracks NPC movement
- [ ] Pressing [E] triggers dialogue with correct NPC
- [ ] NPCs freeze during dialogue, resume after dismiss
- [ ] No console errors during normal play

**Pause here after manual verification before proceeding to Phase 5.**

---

## Phase 5: Editor Support

### Overview

Add `npc` as a selectable zone type in the ZonePropertiesPanel with fields for `npcType` and optional `speed`.

### Changes Required

#### 1. `src/explorers/editor/ZonePropertiesPanel.svelte`

**Changes**:

**a) In `setType()` function** — add `npc` branch after `terminal`:
```typescript
} else if (newType === 'npc') {
  baseProps.push({ name: 'npcType', type: 'string', value: 'scientist' });
}
```

**b) In the type `<select>` element** — add npc option after terminal:
```html
<option value="npc">npc</option>
```

**c) Add NPC fields section** — after the terminal `{#if}` block:
```html
<!-- NPC fields -->
{#if zone.type === 'npc'}
  <label class="flex flex-col gap-0.5">
    <span class="text-xs text-gray-500">npcType</span>
    <select
      value={getProp('npcType')}
      onchange={(e) => setProp('npcType', (e.target as HTMLSelectElement).value)}
      class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
    >
      <option value="scientist">scientist</option>
      <option value="alien">alien</option>
      <option value="philosopher">philosopher</option>
    </select>
  </label>
  <label class="flex flex-col gap-0.5">
    <span class="text-xs text-gray-500">speed (optional, px/s)</span>
    <input
      type="number"
      value={getIntProp('speed') || ''}
      placeholder="default: 60"
      oninput={(e) => {
        const val = (e.target as HTMLInputElement).value;
        if (val) setProp('speed', Number(val), 'int');
        else if (zone) onUpdate({ ...zone, properties: zone.properties.filter(p => p.name !== 'speed') });
      }}
      class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
    />
  </label>
{/if}
```

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles with no errors

#### Manual Verification

- [ ] Navigate to the map editor; add a zone and change type to `npc` → see `npcType` dropdown and `speed` input appear
- [ ] NPC zone renders in fuchsia (`#e879f9`) in the editor canvas

---

## Phase 6: Example Content

### Overview

Add an example NPC (`engineer-moreau`) to `m0-awakening` — manifest route + dialogue. The NPC object in the Tiled map must also be added manually via the editor (documented below).

### Changes Required

#### 1. `src/explorers/levels/m0-awakening/manifest.ts`

**Changes**: Add NPC route to `interactionRoutes`

```typescript
interactionRoutes: [
  { zoneId: 'hibernation-pod', defaultDialogue: 'm0-pod-examine' },
  {
    zoneId: 'loot-terminal',
    defaultDialogue: 'm0-loot-terminal-open',
    flagVariants: [
      { flag: 'terminal-found', dialogue: 'm0-loot-terminal-done' },
    ],
  },
  { zoneId: 'info-board', defaultDialogue: 'm0-info-board' },
  { zoneId: 'engineer-moreau', defaultDialogue: 'm0-npc-moreau' }, // ← new
],
```

#### 2. `src/explorers/levels/m0-awakening/dialogues.ts`

**Changes**: Add NPC dialogue sequence

```typescript
'm0-npc-moreau': {
  id: 'm0-npc-moreau',
  lines: [
    { speaker: 'inżynier Moreau', text: 'Ach, w końcu się obudziłeś. Zaczynałem się martwić.' },
    { speaker: 'astronaut', text: 'Co się stało? Gdzie jesteśmy?' },
    { speaker: 'inżynier Moreau', text: 'Długa historia. Najpierw sprawdź systemy. Zacznij od terminalu w rogu.' },
  ],
  onComplete: { grantXp: 25 },
},
```

#### 3. Tiled map — manual step

Open the map editor at `/editor`, select `m0-awakening`, and add a new zone object:
- **Type**: `npc`
- **id**: `engineer-moreau`
- **npcType**: `scientist`
- **Position**: choose any open walkable area

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles with no errors

#### Manual Verification

- [ ] NPC appears in `m0-awakening` at the placed position
- [ ] Talking to the NPC triggers the `m0-npc-moreau` dialogue
- [ ] Player receives 25 XP after the dialogue completes

---

## Testing Strategy

### Manual Testing Steps

1. Start dev server (`npm run dev --workspace=edu-platform`)
2. Navigate to the Explorers game
3. Load `m0-awakening`
4. Confirm `engineer-moreau` NPC is visible and wandering
5. Walk up to the NPC; confirm `[E] Porozmawiaj` prompt appears and follows the NPC
6. Press [E]; confirm dialogue starts and NPC freezes mid-animation
7. Advance through all dialogue lines; confirm player receives XP toast
8. Confirm NPC resumes wandering after dialogue dismiss
9. Confirm NPC does not walk through walls
10. Confirm NPC does not pass through the player character
11. Start a non-NPC dialogue (e.g., loot terminal); confirm all NPCs freeze during it too
12. Open the editor; add a second NPC zone; confirm fuchsia debug rect and correct fields

### Edge Cases to Test

- NPC wandering into a corner and staying there (timer will unstick it within 3.5s)
- Two NPCs colliding — confirm neither clips through the other
- Dialogue started via NPC when player also near an InteractiveObject — only the nearest is shown

---

## Performance Considerations

- NPC wander uses only random direction picks + velocity; no pathfinding — negligible CPU cost
- All NPCs share one `Phaser.Physics.Arcade.Group` — batch collider registration is efficient
- `InteractionDetector` loops `O(zones + npcs)` per frame — acceptable for expected counts (< 20 total)

---

## References

- Research document: `thoughts/shared/research/2026-03-04-npc-system-design.md`
- Player entity template: `src/explorers/entities/Astronaut.ts:16-128`
- Zone wrapper reference: `src/explorers/entities/InteractiveObject.ts:1-69`
- Wall + physics setup: `src/explorers/scenes/GameScene.ts:96-221`
- Dialogue side-effects: `src/explorers/systems/DialogueManager.ts:84-124`
- Level manifest example: `src/explorers/levels/m0-awakening/manifest.ts`
