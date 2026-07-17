# 10x Explorers — Level Framework Cookbook

> How to add levels, dialogues, quests, exams, flags, flag-gated interactions, and flag-dependent doors.
>
> **Audience:** Game designers, AI coding agents, and developers building new content.

---

## Architecture Overview

All game content is defined via **Level Manifests** — self-contained TypeScript modules under `src/explorers/levels/`. At boot, `BootScene` fetches the `/api/game` endpoint (which serializes all manifests into JSON) and passes the response to `loadLevelsFromData()`. This builds flat global registries for dialogues, quests, exams, interaction routes, and display names. No runtime files need editing when adding content — only the server-side `src/explorers/levels/index.ts` and the new level directory.

```
src/explorers/levels/
├── types.ts                    # LevelManifest, InteractionRoute types
├── index.ts                    # ALL_LEVELS map — server-side registry (imported by /api/game)
├── levelLoader.ts              # Client-side loader; loadLevelsFromData() builds global registries
└── example-level/
    ├── manifest.ts
    ├── dialogues.ts
    ├── games.ts
    ├── quests.ts
    └── exams.ts
```

### Boot-time loading

`BootScene.preload()` fetches `/api/game` (a JSON endpoint). `BootScene.create()` calls `loadLevelsFromData(data)` with the response before any game scene starts. All dialogues, quests, and exams are registered before the first interaction.

After boot, `PhaserGame.svelte` listens for the first `STATE_CHANGED` event to create the `QuestManager` and store it on the registry. This ensures the quest system is available before any player interaction, regardless of terminal visibility.

**Manifest serialization contract:** when adding new `LevelManifest` fields used at runtime, update both:

- `src/pages/api/game.ts` (serialize the field into `/api/game`)
- `src/explorers/levels/levelLoader.ts` (type + map the field on load)

If either side is missing, the field is silently `undefined` on the client.

### What the loader builds

| Registry | Source | Consumer |
|----------|--------|----------|
| `allDialogues` (Map) | All manifests, via `/api/game` | `DialogueManager` |
| `allQuests` (Map) | All manifests, via `/api/game` | `QuestManager` |
| `questCompletionDialogues` (Record) | All manifests, via `/api/game` | `QuestManager` |
| `allExams` (Map) | All manifests, via `/api/game` | `ExamManager` |
| `examCompletionDialogues` (Record) | All manifests, via `/api/game` | `ExamManager` |
| `routesByMap` (Map) | All manifests, via `/api/game` | `GameScene.resolveDialogueId()` |
| `displayNames` (Record) | All manifests, via `/api/game` | HUD, `/status` command |

Additionally, `loadLevelsFromData()` calls `buildRankUpDialogues()` and merges rank-up dialogue sequences into `allDialogues` — these are global and not tied to any specific level.

### Dialogue IDs are global

All dialogues from all levels are merged into one flat map. IDs must be unique across the entire game. A level can reference dialogue IDs defined in another level.

---

## How to Add a New Level

### Step 1: Create the Tiled map

**File:** `public/game/maps/<map-key>.json`

Create a Tiled-compatible JSON with layers: `Ground`, `Walls`, `Above` (optional), `Zones` (object layer for interactive objects and doors).

No manual asset registration needed - just create the map JSON file in the `public/game/maps/` directory.

### Step 2: Create the level directory

```
src/explorers/levels/engine-room/
├── manifest.ts
├── dialogues.ts
└── quests.ts          # only if the level has quests
```

### Step 3: Define dialogues

**File:** `src/explorers/levels/engine-room/dialogues.ts`

```typescript
import type { DialogueSequence } from '../../systems/DialogueTypes';

export const dialogues: Record<string, DialogueSequence> = {
  'reactor-panel': {
    id: 'reactor-panel',
    lines: [
      { speaker: 'system', text: 'Reaktor — tryb oszczędzania energii.', mode: 'system', autoAdvance: 2000 },
    ],
  },
  'coolant-pipe': {
    id: 'coolant-pipe',
    lines: [
      { speaker: 'astronaut', text: 'Rura chłodząca. Jeszcze ciepła.', mode: 'monologue' },
    ],
  },
};
```

Each key is the dialogue ID. The `id` field inside the object must match the key.

### Step 4: Define the manifest

**File:** `src/explorers/levels/engine-room/manifest.ts`

```typescript
import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';

export const manifest: LevelManifest = {
  id: 'engine-room',                    // must match map JSON filename
  displayName: 'Maszynownia',           // Polish, shown in HUD
  dialogues,
  interactionRoutes: [
    { zoneId: 'reactor-panel', defaultDialogue: 'reactor-panel' },
    { zoneId: 'coolant-pipe', defaultDialogue: 'coolant-pipe' },
  ],
};
```

### Step 5: Register in the levels index

**File:** `src/explorers/levels/index.ts`

```typescript
import { manifest as engineRoom } from './engine-room/manifest';

export const ALL_LEVELS: ReadonlyMap<string, LevelManifest> = new Map([
  // ... existing levels
  [engineRoom.id, engineRoom],
]);
```

This file is the **server-side** registry. It is imported by the `/api/game` endpoint, which serializes all manifests to JSON and serves them to the client at boot.

### Step 6: Connect via doors

Add door objects in the Tiled map's `Zones` layer pointing to existing maps, and add return doors in existing maps pointing back. Door objects need `targetMap`, `spawnX`, `spawnY` properties.

**That's it.** No other files to edit. The level loader auto-discovers everything from the manifest. The map display name, all dialogues, interaction routes, and editor constants are all derived automatically.

---

## How to Add a Dialogue

All dialogues live in their level's `dialogues.ts` file as typed TypeScript objects.

### Dialogue structure

```typescript
interface DialogueSequence {
  id: string;                    // globally unique
  lines: DialogueLine[];
  onComplete?: DialogueEffect;   // effects fired after last line
}

interface DialogueLine {
  speaker: 'astronaut' | 'system' | string;
  text: string;                  // Polish in-game text
  mode: 'dialogue' | 'monologue' | 'system' | 'cinematic';
  autoAdvance?: number;          // milliseconds, for system/cinematic modes
}

interface DialogueEffect {
  activateQuest?: string;        // quest ID to activate (emits QUEST_ACTIVATE_REQUEST)
  completeQuest?: string;        // quest ID to complete
  setFlags?: string[];           // flags to set (array)
  triggerEvent?: string;         // custom event name to emit
  openUrl?: string;              // URL to open in preview overlay (no bookmark saved)
  openUrlTitle?: string;         // title for the preview overlay header
  addBookmark?: {                // saves bookmark + opens preview overlay
    url: string;
    title: string;
    afterDialogue?: string;      // optional dialogue ID to show after preview closes
  };
  grantXp?: number;              // XP to grant on dialogue completion
}
```

### Dialogue modes

| Mode | Visual | Advance |
|------|--------|---------|
| `dialogue` | Speaker name (teal) + white text | Space key |
| `monologue` | No speaker, gray/italic text | Space key |
| `system` | "SYSTEM" (amber) + amber text | Auto-dismisses after `autoAdvance` ms |
| `cinematic` | White centered text | Space or auto (`autoAdvance`) |

### Setting flags on completion

Use the `setFlags` array to set one or more flags when a dialogue finishes. Always reference constants from `src/explorers/config/flags.ts`:

```typescript
import { FLAGS } from '../../config/flags';

onComplete: { setFlags: [FLAGS.KEYCODE_FOUND] }
```

Multiple flags:

```typescript
onComplete: { setFlags: [FLAGS.QUEST_2_COMPLETE, FLAGS.DEMO_COMPLETE], completeQuest: 'demo-quest-2' }
```

### Wiring a dialogue to a map zone

Add the zone's `objectId` to the manifest's `interactionRoutes`:

```typescript
interactionRoutes: [
  { zoneId: 'reactor-panel', defaultDialogue: 'reactor-panel' },
],
```

When a player presses E near the `reactor-panel` zone, `GameScene.resolveDialogueId()` looks up the route and returns `'reactor-panel'` as the dialogue ID.

### Sharing dialogues between levels

Dialogues are global. If `engine-room` needs the same `'examine-pod'` dialogue defined in another level, just reference the ID in `interactionRoutes` — no need to redefine it:

```typescript
// engine-room/dialogues.ts — empty, no new dialogues needed
export const dialogues: Record<string, DialogueSequence> = {};

// engine-room/manifest.ts
interactionRoutes: [
  { zoneId: 'examine-pod', defaultDialogue: 'examine-pod' },  // defined in another level
],
```

---

## How to Add Flag-Gated Interactions

Some objects show different dialogue depending on game state. This is handled via `flagVariants` in interaction routes.

### Example: object changes after quest completion

```typescript
interactionRoutes: [
  {
    zoneId: 'holo-projector',
    defaultDialogue: 'holo-projector-off',       // before quest 1
    flagVariants: [
      { flag: 'quest-1-complete', dialogue: 'holo-projector-on' },  // after quest 1
    ],
  },
],
```

### Resolution order

`GameScene.resolveDialogueId()` checks `flagVariants` in array order — **first matching flag wins**. Put more specific flags before general ones:

```typescript
flagVariants: [
  { flag: 'quest-2-complete', dialogue: 'reactor-fully-online' },  // most specific
  { flag: 'quest-1-complete', dialogue: 'reactor-partially-online' },
],
defaultDialogue: 'reactor-offline',  // fallback when no flag matches
```

### Fallback behavior

If no route is defined for a zone's `objectId`, `GameScene` falls back to the zone's `objectId` directly as the dialogue ID. This provides backward compatibility for zones not yet migrated to routes.

---

## How to Add Bookmarks

Bookmarks allow players to save and revisit URLs (lesson materials, notes, external resources) from the terminal. Bookmarks are added automatically via the `addBookmark` dialogue effect — there is no manual "save" button. The `/bookmarks` terminal command shows a clickable list of saved bookmarks.

### How it works

1. A dialogue's `onComplete` includes `addBookmark: { url, title }` and typically `setFlags: ['cmds:bookmarks']`
2. `DialogueManager.applyEffects()` calls `BookmarkManager.addBookmark()` which:
   - Adds the bookmark to `state.bookmarks[]` (deduplicates by URL)
   - Opens the URL in the preview overlay immediately
   - Emits `STATE_CHANGED` to persist the bookmark
3. The `cmds:bookmarks` flag unlocks the `/bookmarks` terminal command
4. `/bookmarks` returns a clickable list — clicking an item emits `PREVIEW_SHOW` and opens the preview overlay

### Step 1: Add a bookmark via dialogue effect

In the level's `dialogues.ts`, use `addBookmark` in `onComplete`:

```typescript
'm0-study-notes-board': {
  id: 'm0-study-notes-board',
  lines: [
    { speaker: 'system', text: 'TABLICA SZKOLENIOWA — Notatki do egzaminów', mode: 'system', autoAdvance: 2500 },
    { speaker: 'astronaut', text: 'Notatki z przeszłości...', mode: 'monologue' },
  ],
  onComplete: {
    setFlags: ['cmds:bookmarks'],
    addBookmark: { url: '/external/course/lesson-id', title: 'Notatki szkoleniowe' },
  },
},
```

**Important:** The first dialogue that adds a bookmark should also set `cmds:bookmarks` to unlock the terminal command. Subsequent dialogues that add bookmarks don't need to set the flag again (it's already set).

### Step 2: That's it

No other wiring is needed. The bookmark is saved to `state.bookmarks[]`, the preview opens, and the `/bookmarks` command becomes available.

### Adding bookmarks from other sources

Any dialogue can add bookmarks via `addBookmark`. The `BookmarkManager.addBookmark()` function can also be called directly from systems or Svelte components:

```typescript
import { addBookmark } from '../systems/BookmarkManager';

addBookmark(game, bus, '/external/course/lesson-id', 'Lekcja o promptach');
```

### Bookmark deduplication

Bookmarks are deduplicated by URL. If a dialogue adds a bookmark with a URL that already exists, the preview still opens but no duplicate entry is created.

### Terminal command behavior

- `/bookmarks` with no bookmarks: `"Brak zapisanych zakładek."`
- `/bookmarks` with items: numbered clickable list in teal color
- Clicking a bookmark opens the preview overlay (same as `openUrl` effect)
- Interactive items clear when the player types a new command or closes the preview

### State structure

```typescript
interface BookmarkEntry {
  id: string;       // derived from URL (slugified)
  url: string;      // URL to open in preview
  title: string;    // display title in terminal
  addedAt: number;  // timestamp
}

// In GameState:
bookmarks: BookmarkEntry[];
```

### Key files

| File | Role |
|------|------|
| `src/explorers/systems/BookmarkManager.ts` | `addBookmark()` / `getBookmarks()` — bookmark state management |
| `src/explorers/systems/DialogueTypes.ts` | `DialogueEffect.addBookmark` field definition |
| `src/explorers/systems/DialogueManager.ts` | Processes `addBookmark` effect in `applyEffects()` |
| `src/explorers/terminal/commandHandler.ts` | `cmdBookmarks()` — returns interactive clickable list |
| `src/explorers/SmartTerminal.svelte` | Renders `InteractiveItem[]` as clickable elements, retrieves `QuestManager` from registry |

### Interactive command results

The bookmarks command uses a generic `InteractiveItem` system in `CommandResult`. Any command can return clickable items:

```typescript
interface CommandResult {
  output: string[];                    // text lines shown in terminal
  interactive?: InteractiveItem[];     // clickable items rendered below output
}

interface InteractiveItem {
  label: string;                       // display text
  action: InteractiveAction;           // what happens on click
}

interface InteractiveAction {
  type: 'preview';                     // opens preview overlay
  url: string;
  title: string;
}
```

SmartTerminal renders these as teal-colored clickable divs. This system is reusable for future commands that need clickable output.

---

## How to Add NPCs

NPCs are autonomous characters that wander the map and initiate dialogues with the player. They reuse the same interaction route system as static triggers — a zone `id` maps to a dialogue via `interactionRoutes`.

### How it works

1. Map author places a zone object with `type: npc` in Tiled's `Zones` layer
2. `GameScene` separates NPC zones from static zones during parsing and spawns `NPC` instances
3. Each NPC wanders freely using a random-direction timer; Arcade Physics prevents wall and character pass-through
4. When the player faces an NPC within `INTERACTION_RADIUS` (48 px), the prompt `[E] Porozmawiaj` appears and tracks the NPC's current position
5. Pressing [E] freezes all NPCs, resolves the dialogue ID via `interactionRoutes`, and starts the dialogue
6. On dialogue dismiss, all NPCs resume wandering

### Step 1: Add the NPC zone to the Tiled map

In the map's `Zones` layer, add an object with `type: npc`:

```json
{
  "type": "npc",
  "x": 192,
  "y": 128,
  "width": 32,
  "height": 32,
  "properties": [
    { "name": "id",      "type": "string", "value": "engineer-moreau" },
    { "name": "npcType", "type": "string", "value": "scientist" }
  ]
}
```

Key properties:

| Property | Required | Default | Description |
|----------|----------|---------|-------------|
| `id` | yes | — | Matches `zoneId` in `interactionRoutes` |
| `npcType` | no | `scientist` | Visual appearance — see NPC types table below |

NPC movement speed is standardized in runtime via `NPC_SPEED` and is not authored per zone.

### NPC types

| `npcType` | Spritesheet column block | Suggested use |
|-----------|--------------------------|---------------|
| `scientist` | 0 | Crew members, engineers |
| `alien` | 1 | Non-human characters |
| `philosopher` | 2 | Mentors, scholars |

The animation key format is `npc-{npcType}-walk-{direction}` (e.g. `npc-scientist-walk-down`).

### Step 2: Add a dialogue for the NPC

In the level's `dialogues.ts`, add a dialogue sequence. Use `mode: 'dialogue'` for two-character exchanges:

```typescript
'engineer-moreau': {
  id: 'engineer-moreau',
  lines: [
    { speaker: 'inżynier Moreau', text: 'Ach, w końcu się obudziłeś.', mode: 'dialogue' },
    { speaker: 'astronaut', text: 'Co się stało? Gdzie jesteśmy?', mode: 'dialogue' },
    { speaker: 'inżynier Moreau', text: 'Długa historia. Zacznij od terminalu.', mode: 'dialogue' },
  ],
  onComplete: { grantXp: 25 },
},
```

The `speaker` string can be any name — it is displayed as-is in the dialogue box.

### Step 3: Wire the NPC to the dialogue in the manifest

Add an entry to `interactionRoutes` using the NPC's `id` as `zoneId`:

```typescript
interactionRoutes: [
  // ... existing routes ...
  { zoneId: 'engineer-moreau', defaultDialogue: 'engineer-moreau' },
],
```

Flag variants work identically to triggers — if the NPC should say something different after a quest is complete:

```typescript
{
  zoneId: 'engineer-moreau',
  defaultDialogue: 'engineer-moreau',
  flagVariants: [
    { flag: 'quest-1-complete', dialogue: 'engineer-moreau-post-quest' },
  ],
},
```

### NPC behavior reference

| Behaviour | Detail |
|-----------|--------|
| Actor depth | Y-sorted inside the actor band, so lower actors render in front of higher actors |
| Wander states | `wandering`, `idle`, `wallRecovery`, `frozen` |
| Wander motion | Persistent movement intent during wander windows; idle pauses are intentional |
| Wall collision | Brief contact is ignored; sustained blocking enters `wallRecovery`, then resumes after a short clear window |
| Player collision | Solid — neither character can pass through the other |
| NPC–NPC collision | Solid — NPCs push each other apart |
| Bounds safety | Roaming is constrained to the wall-connected region reachable from the NPC spawn |
| Resume after UI | Dialogue, exam, and arcade dismissal return NPCs to a short idle before wandering |
| Freeze | All NPCs freeze during any dialogue or exam (not only NPC dialogues) |
| Animation | `walk-{dir}` plays while moving; first frame of the facing direction shows when idle |
| Speed | Standardized at `80 px/s` via `NPC_SPEED`; animation frame rate scales from that shared speed |

### Editor support

The map editor (`/editor`) supports NPC zones natively. When you change a zone's type to `npc`:
- A `npcType` dropdown appears (scientist / alien / philosopher)
- The debug overlay renders the zone in **fuchsia** (`#e879f9`)

### Spritesheet layout — `npc-characters.png`

**Size:** 384 × 192 px — 4 frames per direction × 3 characters × 4 directions

```
         scientist        alien         philosopher
         (cols 0–3)      (cols 4–7)     (cols 8–11)
row 0    [up   × 4]      [up   × 4]     [up   × 4]
row 1    [down × 4]      [down × 4]     [down × 4]
row 2    [left × 4]      [left × 4]     [left × 4]
row 3    [right × 4]     [right × 4]    [right × 4]
```

Frame index formula: `dirRow × 12 + charIdx × 4 + frameOffset`

Each frame is **32 × 48 px** (same as the player spritesheet).

### Key files

| File | Role |
|------|------|
| `src/explorers/entities/NPC.ts` | NPC entity — wander AI, physics body, `freeze()` / `unfreeze()`, `Interactable` getters |
| `src/explorers/scenes/GameScene.ts` | Parses NPC zones, spawns NPCs, registers colliders, calls `npc.update()`, routes interactions |
| `src/explorers/scenes/PreloaderScene.ts` | Loads `npc-characters.png`, registers all `npc-{type}-walk-{dir}` animations |
| `src/explorers/config/constants.ts` | `NPC_SPEED`, NPC idle/wall-recovery timing constants, `NPC_TYPE_ROWS`, `NPC_SPRITE_COLS` |
| `src/explorers/editor/ZonePropertiesPanel.svelte` | Editor field for `npcType` |
| `public/game/sprites/npc-characters.png` | NPC spritesheet (must be provided by artist) |

---

## How to Add Flag-Dependent Doors

Doors can require one or more flags before the player can pass through. When the player interacts with a locked door, a configurable dialogue is shown instead of transitioning. Uses AND logic — **all** listed flags must be present.

### How it works

1. `InteractiveObject.requiredFlags` getter parses a comma-separated `requiredFlags` property from the Tiled map zone into a `string[]`
2. `GameScene.handleInteraction()` checks the door's `requiredFlags` before calling `triggerDoorTransition()`
3. If any flag is missing, it resolves a dialogue ID via the existing `InteractionRoute` system and shows it instead
4. If all flags are present (or none are required), the door transitions normally

### Step 1: Add `requiredFlags` to the door zone in the Tiled map

In the map JSON, add a `requiredFlags` property to the door object. Flags are comma-separated:

```json
{
  "type": "door",
  "properties": [
    { "name": "id", "type": "string", "value": "exit-door" },
    { "name": "targetMap", "type": "string", "value": "next-room" },
    { "name": "spawnX", "type": "int", "value": 5 },
    { "name": "spawnY", "type": "int", "value": 3 },
    { "name": "requiredFlags", "type": "string", "value": "exam-a-done,exam-b-done" }
  ]
}
```

### Step 2: Add an InteractionRoute for the door

In the level manifest, add a route for the door zone. The `defaultDialogue` is shown when the door is locked:

```typescript
interactionRoutes: [
  // ... existing routes ...
  {
    zoneId: 'exit-door',
    defaultDialogue: 'exit-door-locked',
  },
],
```

### Step 3: Create the locked dialogue

In the level's `dialogues.ts`:

```typescript
'exit-door-locked': {
  id: 'exit-door-locked',
  lines: [
    { speaker: 'system', text: 'UWAGA: Wymagana certyfikacja.', mode: 'system', autoAdvance: 3000 },
    { speaker: 'astronaut', text: 'Muszę najpierw zdać egzaminy...', mode: 'monologue' },
  ],
},
```

### Behavior

- **Prompt**: Locked doors show the same `[E] Przejdź` prompt as unlocked doors (no visual difference)
- **Locked**: Player presses E → locked dialogue plays → dialogue dismisses → player can move
- **Unlocked**: Identical to a normal door — fade transition to target map
- **Re-checking**: Every interaction re-checks flags, so completing required actions and returning unlocks the door
- **No route defined**: If `requiredFlags` are set but no `InteractionRoute` exists for the door, the `objectId` is used as dialogue ID directly

### Editor support

The zone editor (`ZonePropertiesPanel.svelte`) shows a `requiredFlags` text input for door zones. Enter comma-separated flag names. Clearing the field removes the property. The value is preserved when switching zone types.

### Design constraints

- **AND logic only** — all flags must be present; no OR support
- **No visual lock indicator** — the prompt text does not change for locked doors
- **One dialogue per door** — the same locked dialogue plays regardless of which specific flags are missing

### Key files

| File | Role |
|------|------|
| `src/explorers/entities/InteractiveObject.ts` | `requiredFlags` getter — parses comma-separated string |
| `src/explorers/scenes/GameScene.ts` | Flag check in `handleInteraction()` door case |
| `src/explorers/editor/ZonePropertiesPanel.svelte` | Editor input for `requiredFlags` on door zones |

---

## Flag Management

Flags are the primary mechanism for tracking game progress — unlocking terminals, gating dialogues, marking quest completion, etc. All flag operations go through a **centralized utility** in `src/explorers/state/flagManager.ts`.

### Single source of truth — `src/explorers/config/flags.ts`

All flag string values live in one place:

```typescript
// src/explorers/config/flags.ts
export const FLAGS = {
  TERMINAL_UNLOCKED: 'terminal-unlocked',
  CMDS_QUEST: 'cmds:quest',
  // ... all flags
} as const;

export type GameFlag = (typeof FLAGS)[keyof typeof FLAGS];

/** Flat array — used by QA overlay and tooling. */
export const ALL_FLAGS: GameFlag[] = Object.values(FLAGS);
```

**Always add new flags here first.** Every time a new flag string is introduced anywhere in the game (dialogue effects, quest rewards, manifest routes, runtime checks), a corresponding constant must be added to `flags.ts`.

### API

```typescript
import { setFlag, hasFlag, removeFlag } from '../state/flagManager';
import { FLAGS } from '../config/flags';

// Set a flag. Returns true if newly added, false if already present.
setFlag(game, FLAGS.TERMINAL_UNLOCKED);   // game: Phaser.Game

// Check whether a flag is set.
hasFlag(game, FLAGS.TERMINAL_UNLOCKED);   // → boolean

// Remove a flag. Returns true if removed, false if not present.
// Use sparingly — prefer designing flag logic to be write-once.
removeFlag(game, FLAGS.TERMINAL_UNLOCKED);

// Runtime check (e.g. in commandHandler.ts)
if (state.flags.includes(FLAGS.M0_SUPPORT_CALIBRATED)) { ... }
```

### What `setFlag` does

A single `setFlag(game, flag)` call performs the full lifecycle:

1. **Dedup guard** — no-op if the flag already exists
2. **Registry update** — writes the new flags array to `game.registry`
3. **Emits `STATE_CHANGED`** — notifies UI listeners (QA overlay, terminal, etc.)
4. **Emits `FLAG_SET`** — notifies game systems (cache invalidation, activity log)
5. **Debounced save** — persists to `localStorage`
6. **Dev log** — prints `[Flag] Set: <flag>` in dev mode

### Where to use it

| Context | How to call |
|---------|-------------|
| **Scenes** (BaseScene subclasses) | `this.setFlag(flag)` — delegates to flagManager internally |
| **Svelte components** (SmartTerminal) | `import { setFlag } from './state/flagManager'; setFlag(game, flag)` |
| **Systems** (QuestManager, DialogueManager) | Accept `game: Phaser.Game` in constructor, call `setFlag(this.game, flag)` |
| **Dialogue effects** | Use `onComplete: { setFlags: ['flag-name'] }` — DialogueManager calls `setFlag` automatically |
| **Quest rewards** | Define in `rewards: { xp: 50, flags: ['quest-complete'] }` — QuestManager calls `setFlag` automatically |

### Rules

- **Prefer write-once flags.** `removeFlag` exists but should be used sparingly. Design flag logic so that flags accumulate rather than toggle — this keeps save/load and state reasoning simple.
- **Always use `FLAGS.*` constants.** Never write raw flag strings anywhere in the codebase outside of `flags.ts` itself. This makes typos a compile-time error and provides a single place to enumerate all flags.
- **Register every new flag in `flags.ts`.** Before using a flag anywhere, add it to `src/explorers/config/flags.ts`. This is the authoritative list consumed by the QA overlay and any future tooling.
- **Flag names are global strings.** Use descriptive, kebab-case names: `terminal-unlocked`, `quest-1-complete`, `intro-seen`.

### Scene cache

`BaseScene` maintains a cached `Set<string>` view of flags for O(1) lookups in the game loop (used by `InteractionDetector.getNearest()` for flag-gated interactions). The cache is automatically invalidated when `setFlag` fires the `FLAG_SET` event. You do not need to manage the cache manually.

### System flags (server-controlled, read-only)

In addition to player-earned flags, the game supports **system flags** — global, admin-toggled flags stored in a Supabase `system_flags` table and delivered to the client at boot via `/api/game/state`. System flags enable milestone gating (e.g., unlocking Module 1 doors for an entire cohort) without deploying code.

**Key characteristics:**

- **Prefix:** all system flags use the `sys:` prefix (e.g., `sys:course-m1-available`).
- **Read-only on client:** stored in a separate `'systemFlags'` registry key as a `Set<string>`. `setFlag()` rejects any `sys:` prefixed flag with a devLog warning.
- **Transparent to consumers:** `hasFlag()` (both `BaseScene` and `flagManager`) checks player flags **and** system flags — doors, dialogues, and quests work unchanged.
- **KV-cached:** flags are cached in the `GAME_STATE` KV namespace (key `v1-system-flags`, 5-min TTL) to avoid querying Supabase on every boot.
- **Session-scoped:** fetched once at page load, never mutated mid-session. Toggling a flag in Supabase propagates on the next page load (within KV TTL).
- **No per-user targeting:** system flags are global. For player-specific gating, use regular flags.

**How to add a new system flag:**

1. Insert a row into `system_flags` table (via Supabase Studio or migration) with `enabled = false`.
2. Add a constant to `src/explorers/config/flags.ts` under the system flags section (e.g., `SYS_COURSE_M3_AVAILABLE: 'sys:course-m3-available'`).
3. Reference it in map door `requiredFlags` or dialogue conditions like any other flag.
4. Toggle `enabled` in Supabase Studio when ready to unlock.

**Implementation reference:** `thoughts/shared/plans/2026-03-24-system-flags-milestone-gating.md`

---

## How to Add a Quest

Quests are defined in their level's `quests.ts` and wired via the manifest. There are three quest completion types.

### Quest types

```typescript
// Text-answer quests — solved via /solve command in terminal
interface TextAnswerQuest {
  id: string;
  title: string;
  briefing: string;
  hints: string[];
  rewards: { xp: number; flags: string[] };
  completionType: 'text-answer';
  inputPayload: string;           // puzzle data shown to player
  solution: string;               // canonical answer string
  validation: 'exact-lowercase' | 'exact-trim';
}

// Event-based quests — auto-complete when game events fire
interface EventQuest {
  id: string;
  title: string;
  briefing: string;
  hints: string[];
  rewards: { xp: number; flags: string[] };
  completionType: 'event';
  objectives: EventObjective[];
}

interface EventObjective {
  id: string;
  label: string;          // Polish label shown in /quest command
  event: string;          // GameEvents value to listen for
  matchPayload?: Record<string, unknown>;  // payload properties that must match
  requireFlag?: string;   // if this flag is already set, objective is immediately satisfied
}

// External API quests — solved via POST /api/game/submit with Bearer token
interface ApiAnswerQuest {
  id: string;
  title: string;
  briefing: string;
  hints: string[];
  rewards: { xp: number; flags: string[] };
  completionType: 'api-answer';
  answerHash: string;    // SHA-256 hex of canonical answer — server-side only, stripped from public API
  hint: string;          // hint returned to Navigator on wrong answer
}
```

### Step 1: Define the quest

**File:** `src/explorers/levels/engine-room/quests.ts`

```typescript
import type { QuestDefinition } from '../../systems/QuestManager';

export const quests: QuestDefinition[] = [
  {
    id: 'engine-quest-1',
    title: 'Uruchom reaktor',
    briefing: 'Reaktor jest w trybie oszczędzania...',
    inputPayload: '{"reactor":"offline","code":"RT-42"}',
    hints: [
      'Sprawdź kod RT-42.',
      'Wpisz /solve restart-RT-42',
    ],
    solution: 'restart-rt-42',
    validation: 'exact-lowercase',
    completionType: 'text-answer',
    rewards: { xp: 50, flags: ['engine-quest-1-complete'] },
  },
];
```

### Step 2: Create activation and completion dialogues

In the level's `dialogues.ts`, add dialogues that activate and complete the quest:

```typescript
'engine-quest-1-activation': {
  id: 'engine-quest-1-activation',
  lines: [
    { speaker: 'astronaut', text: 'Reaktor nie działa...', mode: 'dialogue' },
    { speaker: 'system', text: '◆ Nowa misja: Uruchom reaktor', mode: 'system', autoAdvance: 4000 },
  ],
  onComplete: { setFlags: ['engine-quest-1-active'], activateQuest: 'engine-quest-1' },
},
'engine-quest-1-complete': {
  id: 'engine-quest-1-complete',
  lines: [
    { speaker: 'system', text: 'Reaktor: ONLINE', mode: 'system', autoAdvance: 2000 },
    { speaker: 'astronaut', text: 'Energia wraca!', mode: 'dialogue' },
  ],
  onComplete: { setFlags: ['engine-quest-1-complete'], completeQuest: 'engine-quest-1' },
},
```

### Step 3: Wire in the manifest

```typescript
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'engine-room',
  displayName: 'Maszynownia',
  dialogues,
  interactionRoutes: [/* ... */],
  quests,
  questCompletionDialogues: {
    'engine-quest-1': 'engine-quest-1-complete',   // quest ID → dialogue ID
  },
};
```

### Quest flow

```
1. Something triggers the activation dialogue (terminal command, previous quest, etc.)
2. Activation dialogue's onComplete fires: activateQuest + setFlags
3. DialogueManager emits QUEST_ACTIVATE_REQUEST
4. PhaserGame (always mounted) listens → calls QuestManager.activateQuest()
5. QuestManager sets state.quests.active = questId, emits QUEST_ACTIVATED
6. SmartTerminal (if open) shows notification; works regardless of terminal visibility
7. Player uses /solve <answer> in terminal (text-answer type only)
8. QuestManager.submitAnswer() validates against quest.solution
9. On correct answer:
   a. Grant XP, set reward flags
   b. Look up questCompletionDialogues[questId] → dialogue ID
   c. Emit DIALOGUE_SHOW with completion dialogue
   d. Completion dialogue's onComplete fires: completeQuest + setFlags
```

For `event` type quests: objectives complete automatically when the specified `GameEvents` fire with matching payloads. For `api-answer` type quests: answers are validated server-side via POST `/api/game/submit`.

### Quest system ownership

`QuestManager` is created and owned by `PhaserGame.svelte` — not by `SmartTerminal`. This ensures quest activation works regardless of terminal visibility. The manager is stored on the Phaser registry (`game.registry.get('questManager')`) so any component can access it.

**Event flow:**
- `QUEST_ACTIVATE_REQUEST` — emitted by `DialogueManager` when a dialogue's `activateQuest` effect fires. This is a **command** ("please activate this quest").
- `QUEST_ACTIVATED` — emitted by `QuestManager.activateQuest()` after updating state. This is a **notification** ("quest is now active"). UI components listen for this to show messages.

`SmartTerminal` retrieves the shared `QuestManager` from the registry and uses it for terminal commands (`/quest`, `/solve`, `/hint`) but does **not** own its lifecycle.

### Chaining quests

Have the completion dialogue of quest N activate quest N+1:

```typescript
'quest-1-complete': {
  id: 'quest-1-complete',
  lines: [/* ... */],
  onComplete: {
    setFlags: ['quest-1-complete'],
    completeQuest: 'quest-1',
    activateQuest: 'quest-2',         // chains to next quest
  },
},
```

### Validation modes (text-answer only)

| Mode | Behavior |
|------|----------|
| `exact-lowercase` | `answer.toLowerCase().trim() === solution` |
| `exact-trim` | `answer.trim() === solution` |

---

## How to Add an Exam

Exams are multiple-choice quizzes triggered from map zones. They support single-choice and multi-choice questions, pass/fail scoring, XP rewards, and flag-gated progression. Exams are defined in their level's `exams.ts` and wired via the manifest.

### Exam types

```typescript
interface ExamDefinition {
  id: string;                    // globally unique
  title: string;                 // Polish display title
  description: string;           // Polish description
  questions: ExamQuestion[];
  passingScore: number;          // minimum correct answers to pass
  rewards: { xp: number; flags: string[] };
  completionDialogue?: string;   // dialogue ID triggered on pass
}

interface ExamQuestion {
  id: string;                    // unique within exam
  text: string;                  // Polish question text
  type: 'single' | 'multi';     // single-choice or multi-choice
  options: ExamOption[];
  correctOptionIds: string[];    // IDs of correct options
}

interface ExamOption {
  id: string;                    // unique within question
  text: string;                  // Polish option text
}
```

### Step 1: Define the exam

**File:** `src/explorers/levels/engine-room/exams.ts`

```typescript
import type { ExamDefinition } from '../../systems/ExamTypes';

export const exams: ExamDefinition[] = [
  {
    id: 'reactor-certification',
    title: 'Certyfikacja Reaktora',
    description: 'Sprawdź wiedzę o systemach reaktora.',
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: 'Jaki jest kod diagnostyczny reaktora?',
        type: 'single',
        options: [
          { id: 'a', text: 'RT-42' },
          { id: 'b', text: 'RT-99' },
          { id: 'c', text: 'RX-01' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: 'Które systemy chłodzenia są aktywne? (wybierz wszystkie)',
        type: 'multi',
        options: [
          { id: 'a', text: 'Obwód pierwotny' },
          { id: 'b', text: 'Obwód wtórny' },
          { id: 'c', text: 'Obwód awaryjny' },
        ],
        correctOptionIds: ['a', 'c'],
      },
    ],
    rewards: { xp: 100, flags: ['reactor-certified'] },
    completionDialogue: 'reactor-exam-complete',
  },
];
```

### Step 2: Create exam-related dialogues

In the level's `dialogues.ts`, add dialogues for the exam zone and completion:

```typescript
'exam-reactor-available': {
  id: 'exam-reactor-available',
  lines: [
    { speaker: 'system', text: 'Stacja certyfikacji reaktora aktywna.', mode: 'system', autoAdvance: 2000 },
  ],
},
'exam-reactor-completed': {
  id: 'exam-reactor-completed',
  lines: [
    { speaker: 'system', text: 'Certyfikacja ukończona. Dostęp przyznany.', mode: 'system', autoAdvance: 2000 },
  ],
},
'reactor-exam-complete': {
  id: 'reactor-exam-complete',
  lines: [
    { speaker: 'system', text: 'CERTYFIKACJA ZALICZONA', mode: 'system', autoAdvance: 2000 },
    { speaker: 'astronaut', text: 'Reaktor jest teraz pod kontrolą.', mode: 'dialogue' },
  ],
  onComplete: { setFlags: ['reactor-certified'] },
},
```

### Step 3: Wire in the manifest

```typescript
import { exams } from './exams';

export const manifest: LevelManifest = {
  id: 'engine-room',
  displayName: 'Maszynownia',
  dialogues,
  interactionRoutes: [
    // ... existing routes ...
    {
      zoneId: 'exam-reactor',
      defaultDialogue: 'exam-reactor-available',
      flagVariants: [
        { flag: 'reactor-certified', dialogue: 'exam-reactor-completed' },
      ],
    },
  ],
  exams,
  examCompletionDialogues: {
    'reactor-certification': 'reactor-exam-complete',   // exam ID → dialogue ID
  },
};
```

### Step 4: Add the exam zone to the Tiled map

In the map's `Zones` layer, add an object with type `exam`:

```json
{
  "type": "exam",
  "x": 192,
  "y": 128,
  "width": 64,
  "height": 32,
  "properties": [
    { "name": "id", "type": "string", "value": "exam-reactor" },
    { "name": "examId", "type": "string", "value": "reactor-certification" },
    { "name": "requiredFlag", "type": "string", "value": "terminal-unlocked" }
  ]
}
```

Key properties:
- `id` — matches the `zoneId` in the manifest's `interactionRoutes`
- `examId` — matches the exam's `id` in `exams.ts`
- `requiredFlag` — (optional) flag that must be set before the zone is interactable

### Exam flow

```
1. Player approaches exam zone, sees "[E] Egzamin" prompt
2. Player presses [E] → GameScene emits EXAM_SHOW
3. ExamScene wakes, renders holographic quiz UI
4. Player answers questions (single-choice: click to select, multi-choice: click to toggle)
5. Player navigates between questions, then submits on the last question
6. ExamManager.evaluate() checks answers:
   a. Each question: selected options must exactly match correctOptionIds
   b. Score >= passingScore → pass
7. On pass:
   a. ExamManager.completeExam() grants XP, sets reward flags
   b. Completion dialogue triggers
   c. Exam marked as completed in state.exams.completed[]
8. On fail:
   a. "Spróbuj ponownie" button resets answers for immediate retry
9. Completed exams cannot be retaken — zone shows completion dialogue
```

### Question types

| Type | Behavior |
|------|----------|
| `single` | Click selects one option, deselects previous |
| `multi` | Click toggles options, shows "Wybierz wszystkie pasujące" hint |

### Scoring rules

- Each question is all-or-nothing — the selected options must **exactly** match `correctOptionIds` (same items, same count)
- Partial matches in multi-choice do not score
- No partial XP — pass grants full reward, fail grants nothing
- Failed exams can be retried immediately

### UI behavior

- Exam zone prompt: `[E] Egzamin` (distinct from `[E] Zobacz` and `[E] Przejdź`)
- Debug overlay: purple (`0x9b59b6`) in dev mode
- Panel: dark overlay + centered panel with teal border, monospace font
- Navigation: "Poprzednie" / "Następne" buttons, progress bar at bottom
- Results: score display, pass/fail message, XP animation on pass
- On pass: auto-dismiss after 3s or click
- On fail: "Spróbuj ponownie" retry button + "Zamknij" dismiss button

### State persistence

- Completed exam IDs stored in `state.exams.completed[]`
- Persisted via existing debounced `localStorage` mechanism
- QA overlay shows completed exams in purple
- Terminal `/status` shows certification count
- Activity log entries: "Egzamin zdany (+X XP)" or "Egzamin niezdany"

---

## How to Add a Cinematic Intro

Levels can have an intro dialogue that plays once on first visit. The cinematic can optionally display a full-screen title card before the dialogue.

```typescript
export const manifest: LevelManifest = {
  id: 'engine-room',
  displayName: 'Maszynownia',
  dialogues,
  interactionRoutes: [/* ... */],
  introDialogue: 'engine-room-intro',         // dialogue ID to play
  introFlag: 'engine-room-intro-seen',        // flag set after playing (prevents replay)
  introCinematicTitle: 'Maszynownia',         // optional: black-screen title card text
  introCinematicSubtitle: 'Pokład B, Sekcja 3', // optional: subtitle text on the card
};
```

`GameScene` checks `getIntroConfig(mapKey)` on every map entry. If the config exists and the intro flag is NOT set, it runs the cinematic sequence.

**Two variants:**

- **With `introCinematicTitle`**: Full black-screen card with title + subtitle fades in, holds 2s, fades out. Then a spotlight overlay appears (small circle around the player) and the intro dialogue plays over the dimmed screen. When the dialogue is dismissed, the spotlight expands to reveal the full map. The spotlight effect is implemented in `src/explorers/effects/spotlightReveal.ts`.
- **Without `introCinematicTitle`**: Sets the intro flag and immediately plays the intro dialogue, skipping the black-screen card and spotlight entirely.

### Fresh-start testing (important)

- Intro playback is controlled by `introFlag` only. If the flag exists, intro does not run.
- To re-test first-visit behavior, clear the intro flag from both local and server state.
- QA overlay `Reset State` performs a full reset by writing default state locally and resetting server state before reload.

---

## LevelManifest Reference

```typescript
interface LevelManifest {
  id: string;                                        // map key, matches JSON filename
  displayName: string;                               // Polish, for HUD
  dialogues: Record<string, DialogueSequence>;       // all dialogues for this level
  interactionRoutes: InteractionRoute[];             // zone → dialogue routing
  quests?: QuestDefinition[];                        // quest definitions (optional)
  questCompletionDialogues?: Record<string, string>; // questId → dialogueId (optional)
  exams?: ExamDefinition[];                          // exam definitions (optional)
  examCompletionDialogues?: Record<string, string>;  // examId → dialogueId (optional)
  introDialogue?: string;                            // intro dialogue ID (optional)
  introFlag?: string;                                // intro-seen flag (optional)
  introCinematicTitle?: string;                      // black-screen title card text (optional)
  introCinematicSubtitle?: string;                   // subtitle on the title card (optional)
}

interface InteractionRoute {
  zoneId: string;              // matches objectId in Tiled map
  defaultDialogue: string;     // fallback dialogue ID
  flagVariants?: {             // checked in order, first match wins
    flag: string;
    dialogue: string;
  }[];
}
```

---

## File Reference

### Level Framework

| File | Purpose |
|------|---------|
| `src/explorers/levels/types.ts` | `LevelManifest`, `InteractionRoute` type definitions |
| `src/explorers/levels/index.ts` | `ALL_LEVELS` map — **server-side** registry, imported by `/api/game` endpoint |
| `src/explorers/levels/levelLoader.ts` | **Client-side** loader; `loadLevelsFromData()` builds global registries from API response |
| `src/explorers/levels/<level>/manifest.ts` | Level manifest (single source of truth per level) |
| `src/explorers/levels/<level>/dialogues.ts` | Dialogue sequences for the level |
| `src/explorers/levels/<level>/quests.ts` | Quest definitions for the level (optional) |
| `src/explorers/levels/<level>/exams.ts` | Exam definitions for the level (optional) |
| `src/pages/api/game/index.ts` | API endpoint — serializes `ALL_LEVELS` to JSON for client boot |

### State & Flags

| File | Purpose |
|------|---------|
| `src/explorers/config/flags.ts` | **Single source of truth** for all flag string constants (`FLAGS` object + `ALL_FLAGS` array) |
| `src/explorers/state/flagManager.ts` | Centralized `setFlag()` / `hasFlag()` / `removeFlag()` — all runtime flag mutations go here |
| `src/explorers/state/GameStateManager.ts` | Save/load game state to `localStorage`, debounced save |
| `src/explorers/state/types.ts` | `GameState` type definition |

### Visual Effects

| File | Purpose |
|------|---------|
| `src/explorers/effects/spotlightReveal.ts` | Spotlight reveal animation — black overlay with expanding circular cutout, used in cinematic intros |

### Consumers

| File | What it reads from levelLoader |
|------|-------------------------------|
| `src/explorers/systems/DialogueManager.ts` | `getAllDialogues()` — populates dialogue sequence map |
| `src/explorers/systems/BookmarkManager.ts` | `addBookmark()` / `getBookmarks()` — bookmark state management |
| `src/explorers/systems/QuestManager.ts` | `getAllQuests()`, `getQuestCompletionDialogues()` — owned by `PhaserGame.svelte`, stored on registry |
| `src/explorers/systems/ExamManager.ts` | `getAllExams()`, `getExamCompletionDialogues()` |
| `src/explorers/scenes/GameScene.ts` | `getInteractionRoutes()`, `getIntroConfig()` |
| `src/explorers/config/mapRegistry.ts` | `getMapDisplayNames()` — HUD, terminal |
| `src/explorers/PhaserGame.svelte` | Creates & owns `QuestManager`, handles `QUEST_ACTIVATE_REQUEST`, stores manager on registry |
| `src/explorers/SmartTerminal.svelte` | Terminal UI — retrieves `QuestManager` from registry for commands (`/quest`, `/solve`, `/hint`) |
| `src/explorers/scenes/BootScene.ts` | Fetches `/api/game`, calls `loadLevelsFromData()` once at startup |

---

## Available Sprites

Interactive objects placed in Tiled map `Zones` layers use sprites from the `placeholder.png` sprite sheet. The following object sprites are available:

| Sprite | Use for |
|--------|---------|
| Computer | Workstations, data terminals, puzzle interfaces |
| Terminal | Command-line consoles, system access points |
| Hibernation chamber | Crew pods, stasis units |
| Whiteboard | Information displays, notes, schematics |
| Loot box | Collectibles, item pickups, rewards |
| Ladder | Vertical traversal, level transitions |

When designing a new level or quest, pick from these sprites for zone objects. Each sprite can be wired to any dialogue or interaction route via the manifest's `interactionRoutes`.

---

## Checklist: Adding a New Level

- [ ] Add any new flag constants to `src/explorers/config/flags.ts` before using them elsewhere
- [ ] Create `public/game/maps/<map-key>.json` (Tiled map — auto-discovered by `getMapAssets()`)
- [ ] Create `src/explorers/levels/<map-key>/dialogues.ts`
- [ ] Create `src/explorers/levels/<map-key>/quests.ts` (if needed)
- [ ] Create `src/explorers/levels/<map-key>/exams.ts` (if needed)
- [ ] Create `src/explorers/levels/<map-key>/manifest.ts`
- [ ] Add import + entry in `src/explorers/levels/index.ts`
- [ ] If adding new manifest fields consumed by runtime, also serialize them in `src/pages/api/game.ts` and map them in `src/explorers/levels/levelLoader.ts`
- [ ] Add door objects connecting to/from existing maps
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] Test in browser: doors work, dialogues play, quests function, exams work

## Checklist: Adding an NPC

- [ ] Place a zone object (`type: npc`, `id`, optional `npcType`) in the Tiled map's `Zones` layer via the map editor
- [ ] Add a dialogue sequence to the level's `dialogues.ts` (use `mode: 'dialogue'` for two-character lines)
- [ ] Add `{ zoneId: '<npc-id>', defaultDialogue: '<dialogue-id>' }` to the manifest's `interactionRoutes`
- [ ] Ensure `public/game/sprites/npc-characters.png` exists (384 × 192 px, 32 × 48 px frames)
- [ ] `npx tsc --noEmit` passes
- [ ] Test in browser: NPC wanders, `[E] Porozmawiaj` prompt tracks NPC, dialogue plays, NPC freezes/resumes

---

## Arcade Mini-Games System

The arcade system adds interactive mini-games as overlay scenes, following the same pattern as exams. Games are defined in level manifests, placed as zones on Tiled maps, and run as Phaser overlay scenes.

### Architecture

```
src/explorers/
├── systems/ArcadeTypes.ts          # Types: ArcadeGameDefinition, ArcadeGameRenderer, ArcadeGameResult
├── arcade/
│   ├── rendererRegistry.ts         # Maps ArcadeGameType → renderer class
│   ├── AsteroidRangeRenderer.ts    # CRT/vector shooting console (timed, WSAD + SPACE)
│   ├── MemoryMatrixRenderer.ts     # CRT signal recall grid (round-based, WSAD + SPACE + ENTER)
│   └── OscilloscopeRenderer.ts     # CRT calibration console (timed, WSAD + ENTER)
└── scenes/ArcadeScene.ts           # Overlay scene: intro → countdown → playing → results
```

### Current Design Direction

Arcade intros should not read like dry tooltips. Each game's intro screen should explain:

- **Why** the task matters for the Odyssey mission or damaged CORE AI systems
- **What** the player must do mechanically once the game starts

In practice, this means the `description` field in `games.ts` should be mission-framed first, with task instructions second. The current visual direction across all three games is a unified **old-tech CRT / vector display** aesthetic rather than bright arcade sprites.

### Defining Arcade Games in Manifests

Always define arcade games in a **separate `games.ts` module** (following the same pattern as `dialogues.ts`), then import and re-export via the manifest:

```typescript
// games.ts
import type { ArcadeGameDefinition } from '../../systems/ArcadeTypes';

export const arcadeGames: ArcadeGameDefinition[] = [
  {
    id: 'arcade-asteroid-test',       // Unique ID (referenced by Tiled zone)
    type: 'asteroid-range',           // 'asteroid-range' | 'memory-matrix' | 'oscilloscope'
    title: 'Strzelnica Asteroidów',   // Polish title (shown in overlay header)
    description: 'Odyssey potrzebuje surowców do utrzymywania sprawności systemów pokładowych. Namierzaj asteroidy, rozbijaj je działkiem pokładowym i zbieraj minerały.',
    difficulty: 2,                    // 1-5 (affects game parameters)
    baseXp: 5,                        // XP granted on completion (before score bonus)
    scoreMultiplier: 0.1,             // XP bonus = floor(score × multiplier)
    durationSeconds: 60,              // Timer length (0 = round-based, no timer)
  },
];
```

```typescript
// manifest.ts
import { arcadeGames } from './games';

export const manifest: LevelManifest = {
  // ...
  arcadeGames,
};
```

### Placing Arcade Zones in Tiled Maps

In the map editor (`/explorers-editor`):

1. Switch to Zones layer
2. Click to create a zone
3. Set **type** to `arcade`
4. Set **arcadeGameId** to the game's `id` from the manifest (e.g., `arcade-asteroid-test`)

The zone renders with an orange debug overlay. Player sees `[E] Graj` prompt when nearby.

### Game Types

| Type | Controls | Duration | Scoring |
|------|----------|----------|---------|
| `asteroid-range` | `WSAD` move crosshair, `SPACE` shoot | Timed (`durationSeconds`) | Points per asteroid destroyed |
| `memory-matrix` | `WSAD` move cursor, `SPACE` toggle, `ENTER` submit | Round-based (`durationSeconds: 0`) | Score only for fully completed rounds |
| `oscilloscope` | `W/S` change active parameter, `A/D` adjust value, `ENTER` submit | Timed (`durationSeconds`) | Match percentage (0-100) |

### Current Game Behavior Notes

#### `asteroid-range`

- Uses a procedural CRT targeting console instead of sprite-like space art
- Shares the same old-tech visual language as the other arcade games: scanlines, vector crosshair, monochrome HUD, procedural wireframe targets
- Best used for mission framing around mining resources, ship repairs, or restoring Odyssey systems

#### `memory-matrix`

- Uses a dark green CRT/radio-signal presentation with blinking target tiles rather than permanently lit targets
- During the input phase, the footer controls are intentionally white for readability against the background
- A failed round may still show partial correctness like `Błąd! 3/4 poprawnych`, but **score increases only when the entire round is solved correctly**
- Because XP uses final score, partial rounds no longer grant XP indirectly

#### `oscilloscope`

- Uses the same procedural CRT styling as the other games
- Control scheme is aligned with the rest of the arcade set: `W/S` for vertical selection, `A/D` for left/right value changes
- Mission framing should emphasize signal stabilization, calibration, or reconnecting damaged Odyssey / CORE AI systems rather than abstract waveform matching alone

### XP Calculation

```
xpReward = baseXp + floor(score × scoreMultiplier)
```

XP is granted via the existing `XP_GAINED` event pipeline — no changes needed in PhaserGame.svelte.

### Adding a New Game Renderer

1. Create `src/explorers/arcade/MyRenderer.ts` implementing `ArcadeGameRenderer`
2. Register it in `src/explorers/arcade/rendererRegistry.ts`
3. Add the type string to the `ArcadeGameType` union in `src/explorers/systems/ArcadeTypes.ts`

The `ArcadeGameRenderer` interface:
- `create(scene, config, bounds)` — set up game objects within the provided rectangle
- `update(time, delta)` — per-frame logic
- `destroy()` — clean up all objects and input handlers
- `isFinished()` — signal game end (for round-based games)
- `getScore()` — live score for HUD
- `getResult()` — final result with score and completion flag

### Checklist: Adding an Arcade Game

- [ ] Define the game in a separate `games.ts` module and import it into the level manifest
- [ ] Place an `arcade` zone on the Tiled map with `arcadeGameId` property
- [ ] `npm run build` passes
- [ ] Test in browser: `[E] Graj` prompt → intro screen → countdown → gameplay → results → XP granted

---

## How to Add Audio Assets

The audio system uses a centralized `AudioManager` singleton that plays background music and sound effects in response to game events. All audio files are OGG format and live under `public/game/audio/`.

### Directory structure

```
public/game/audio/
├── music/          # Background music tracks (looped)
│   ├── bg-exploration.ogg
│   └── arcade-action.ogg
└── sfx/            # One-shot sound effects
    ├── xp-ding.ogg
    ├── rank-up.ogg
    └── ...
```

### Key files

| File | Purpose |
|------|---------|
| `src/explorers/audio/AudioKeys.ts` | Typed string constants (`MusicKey`, `SfxKey`) |
| `src/explorers/audio/audioAssets.ts` | Maps each key to its file URL |
| `src/explorers/audio/AudioManager.ts` | Singleton that handles playback, muting, ducking, and event subscriptions |

### Adding a new sound effect

**Step 1: Add the key constant**

In `src/explorers/audio/AudioKeys.ts`, add a new entry to `SfxKey` (or `MusicKey` for music):

```typescript
export const SfxKey = {
  // ... existing keys
  MY_NEW_SOUND: 'sfx-my-new-sound',
} as const;
```

**Step 2: Register the asset path**

In `src/explorers/audio/audioAssets.ts`, add an entry to `SFX_ASSETS` (or `MUSIC_ASSETS`):

```typescript
export const SFX_ASSETS: AudioAssetEntry[] = [
  // ... existing entries
  { key: SfxKey.MY_NEW_SOUND, url: '/game/audio/sfx/my-new-sound.ogg' },
];
```

**Step 3: Drop the audio file**

Place the `.ogg` file at the matching path under `public/`:

```
public/game/audio/sfx/my-new-sound.ogg
```

**Step 4: Play it**

From any file with access to the `audioManager` singleton:

```typescript
import { audioManager } from '../audio/AudioManager';
import { SfxKey } from '../audio/AudioKeys';

audioManager.playSfx(SfxKey.MY_NEW_SOUND);
```

For event-driven playback (progression, transitions, etc.), add a subscription in `AudioManager.subscribeToEvents()` instead:

```typescript
bus.on(GameEvents.SOME_EVENT, () => {
  this.playSfx(SfxKey.MY_NEW_SOUND);
});
```

### Audio categories and their triggers

| Category | Trigger mechanism | Examples |
|----------|-------------------|----------|
| Background music | Auto-played on `SCENE_ENTERED`, swapped on `ARCADE_SHOW`/`ARCADE_DISMISSED` | `BG_EXPLORATION`, `ARCADE_ACTION` |
| Progression SFX | Event bus subscriptions in `AudioManager` | `XP_DING`, `RANK_UP`, `QUEST_COMPLETE` |
| Arcade SFX | Direct `audioManager.playSfx()` calls in renderers | `LASER_SHOT`, `CELL_CLICK`, `PARAM_BEEP` |
| Dialogue blip | Throttled callback from `TypewriterEffect` | `DIALOGUE_BLIP` |
| Transition SFX | Event bus subscription | `TRANSITION_WHOOSH` |

### Behavior notes

- **Missing files are safe** — if an `.ogg` file doesn't exist, the asset 404s during preload but the game continues without errors. `playSfx()` silently no-ops with a `devLog` warning.
- **All assets preload** during `PreloaderScene` alongside images and tilemaps. Keep total audio budget under 5MB.
- **Mute toggle** in the HUD controls all audio via `game.sound.mute`. State persists in `localStorage` under key `space-explorers-audio-muted`.
- **Music ducking** — music volume drops to ~30% during dialogue and restores on dismiss.
- **Blip throttle** — typewriter blips fire at most every 80ms and skip whitespace characters.

### Checklist: Adding an Audio Asset

- [ ] Key added to `AudioKeys.ts` (`SfxKey` or `MusicKey`)
- [ ] Asset entry added to `audioAssets.ts` (`SFX_ASSETS` or `MUSIC_ASSETS`)
- [ ] `.ogg` file placed in the correct `public/game/audio/` subdirectory
- [ ] Playback wired (direct call or event subscription)
- [ ] `npm run build` passes
- [ ] Test in browser: sound plays at the expected moment and respects mute toggle

## Adding a Localized String

The game ships in Polish (`pl`) and English (`en`). The HUD has a PL/EN toggle that flips the active locale at runtime; reload restores the choice from `localStorage` (`space-explorers-locale`). Any new player-facing string must be authored in both locales.

### Two flavors of localization

| Flavor | Used for | API | Storage |
|---|---|---|---|
| **Chrome (key-based)** | Static UI labels: HUD, terminal output, scene titles, arcade renderers, error messages, exam buttons | `t('module.key', params?)` | `src/explorers/i18n/{hud,scene,exam,arcade,terminal,preview,grant}.ts` |
| **Content (BilingualText)** | Authored narrative: dialogue lines, exam questions/options, quest fields, arcade game titles/descriptions, rank flavor text | `localized({ pl: '...', en: '...' })` | Inline in level data (`src/explorers/levels/**`) and `config/ranks.ts` |

### Adding a chrome string

1. Pick the right module file in `src/explorers/i18n/` (or add a new namespace).
2. Add the key to **both** `pl` and `en` blocks. Use `{name}`-style placeholders for interpolation slots — the same slot must appear in both locales.
3. Call `t('module.key', { name: 'value' })` in code. In Svelte templates use the derived store: `import { t } from './i18n/store'` and `{$t('module.key')}`.
4. The strings parity test (`src/explorers/i18n/strings.test.ts`) enforces non-empty values, distinct pl≠en, and matching interpolation slots.

### Adding a content string

1. Author as `{ pl: '...', en: '...' }` inline at the call site.
2. Resolve via `localized(text)` (`src/explorers/i18n/types.ts`) when rendering.
3. The bilingual parity test (`src/explorers/levels/bilingualParity.test.ts`) enforces non-empty + distinct values for dialogues, quests, exams, arcade games, and rank flavor.

### Static-analysis guard

`src/explorers/i18n/noHardcodedPolish.test.ts` scans `src/explorers/**/*.{ts,svelte}` (excluding `i18n/`, `levels/`, tests, `QaOverlay.svelte`, `MobileControls.svelte`) for string literals containing Polish-specific characters. CI fails if a new untranslated literal sneaks in. Append a trailing `// i18n-allow` comment to genuinely intentional offending lines (the marker stays out of common style noise).

### Re-render policy on locale toggle

The locale store emits `LOCALE_CHANGED` via `BaseScene` when the user clicks PL/EN. Each scene decides how to react:

- **`ExamScene`** — full `clearUI()` + re-render of the active question or results panel.
- **`ArcadeScene`** — re-renders intro/results immediately; defers mid-round (`phase === 'playing'`) and drains the pending swap on round-end.
- **`GameScene`** — interaction prompts auto-refresh on the next `update()` tick; cinematic intro defers via `pendingLocaleSwap`.
- **`DialogueBar`** — speaker label and advance hint refresh immediately; body text only re-renders if the typewriter has finished the current line.
- **Arcade renderers** — `applyLocale()` updates retained `setText` refs without re-instantiating game state.

### Checklist: Adding a Localized String

- [ ] Decide chrome (`t()`) vs content (`BilingualText`) per the table above.
- [ ] `pl` and `en` values both authored, non-empty, and naturally translated (no placeholders).
- [ ] Interpolation slots match across `pl` and `en` (chrome only).
- [ ] Call site uses `t(...)` / `localized(...)` (no inline string).
- [ ] If adding to a Phaser scene with retained refs, add a re-render path (`onLocaleChanged()` override or `applyLocale()` method).
- [ ] `npm run test:explorers` passes (parity + static-analysis tests).
- [ ] `npm run build` passes.
- [ ] Toggle PL ↔ EN in browser at the affected surface and confirm the new string flips.
