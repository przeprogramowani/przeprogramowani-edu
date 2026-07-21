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
├── mapAuthoring/               # Map source compiler/validator library (see "Map Authoring Pipeline")
└── example-level/
    ├── map.level.yaml          # Canonical map source — compiled to public/game/maps/<key>.json
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

### Level-design quality gate for agents

A valid map is not automatically an interesting map. Before writing YAML, prepare a short level-design brief that answers:

| Decision | Required question |
|----------|-------------------|
| Purpose | What story, quest, or traversal beat is this level responsible for? |
| Topology | What makes moving through this space different from the previous level? |
| Landmarks | Which prop, NPC, doorway, vista, or room shape helps the player orient themselves? |
| Quest geography | Where does the player learn the objective, perform it, and observe its consequence? |
| NPC role | Does this level need an embodied character? If yes, which type and how does their dialogue participate in the quest? If no, why is a terminal, environment, or deliberate isolation stronger? |

Treat **topology** as gameplay structure, not decoration. Unless a level is intentionally a tiny connector, tutorial cell, or ceremonial reveal, do not default to a rectangular room with two opposite doors. Prefer a readable combination of spatial beats such as:

- an entry chamber opening into a wider hub;
- a bend, offset doorway, alcove, side room, or short branch that breaks a single sightline;
- a loop or optional detour that reconnects to the main path;
- a narrow-to-wide or quiet-to-busy transition;
- one visually dominant landmark placed where it aids navigation;
- props and interaction zones distributed according to the room's purpose instead of arranged symmetrically by habit.

Do not add complexity as noise. Every branch should hold a clue, interaction, resource, shortcut, story beat, or useful view. Respect the compiler's geometry constraints: build varied connected floor silhouettes and chambers, not unsupported thin walls, isolated wall stubs, or unreachable decorative pockets.

Spatialize quests when the level owns a quest beat. Avoid placing activation, objective, and consequence on the same tile unless the quest is intentionally a single interaction. A useful default flow is: learn the objective near the entry or hub, travel to a distinct interaction deeper in the layout, then see a changed route, prop dialogue, NPC response, or unlocked exit. Backtracking is acceptable when the return path is short or changes meaningfully after completion.

NPCs are conditional, not a quota. Add one when a character improves motivation, explanation, emotional response, local knowledge, or visible quest state. When an NPC is present in a quest-bearing level, tie them to the quest through at least one concrete mechanism: their dialogue activates it, provides an actionable clue, reacts through flag variants, sets a required flag, or acknowledges its consequence. Prefer both a useful pre-quest role and a changed post-quest response. Do not add an NPC merely to fill empty space; terminal-driven missions, abandoned locations, environmental puzzles, and intentionally lonely scenes may be stronger without one.

### Step 1: Author the map source

**File:** `src/explorers/levels/<map-key>/map.level.yaml`

Maps are authored as text — never hand-write tile indices or the Tiled JSON. The yaml source holds a theme, an ASCII floor plan, props, and zones; `npm run levels:build` compiles it into `public/game/maps/<map-key>.json` (the artifact the game loads, committed alongside the source). The compiler auto-tiles everything: wall edges, outer/inner corners, and floor/background variant scatter are all derived from the floor plan. A `D` cell selects doorway art; a matching `type: door` zone supplies its interaction and destination.

```yaml
# src/explorers/levels/engine-room/map.level.yaml
theme: 1            # 1-6, see the theme table below
grid: |             # ~ outside, # wall, . floor, o window wall, D doorway wall
  ~~~~~~~~~~~~
  ~##########~
  ~#........D~
  ~#........D~
  ~##########~
  ~~~~~~~~~~~~
props:
  - { id: reactor-console, prop: console, at: [2, 2], solid: true } # named prop, collides
  - { slot: 6, at: [4, 3], solid: false }         # slot number, walkable decal (Ground layer)
zones:
  - id: reactor-panel
    name: Reactor Panel      # optional editor display name
    type: trigger            # trigger | door | terminal | npc | exam | arcade
    propId: reactor-console  # derives at: [2, 2] from the named prop
    size: [2, 1]             # in tiles, defaults to [1, 1]
  - id: door-to-crew
    type: door
    at: [10, 2]
    size: [1, 2]
    properties: { targetMap: m0-crew-room, spawnX: 2, spawnY: 3 }
```

Rules the validator enforces (`npm run levels:check`):

- The grid alphabet is fixed: `~` outside, `#` wall, `.` floor, `o` window wall, `D` doorway wall. Grids must be rectangular.
- Windows (`o`) only work on north/south-facing wall runs — the tileset has no side-wall window (the side-wall "B" tiles are doorways). A window anywhere else is an error.
- Doorway cells (`D`) only work on west/east-facing wall runs. Every `D` must be covered by exactly one `type: door` zone; every door zone must cover only `D` cells and be one tile wide.
- Rooms must be sealed — every floor cell fully surrounded by floor or walls. Walls must be resolvable: no thin walls (floor on both sides of a 1-tile wall), no free-standing pillars/stubs.
- Props stand on floor cells. `solid: true` (default) puts the prop on the Walls layer (collides); `solid: false` makes a walkable Ground decal.
- A prop may declare a map-local `id`. A zone with `propId` derives its `at` coordinates from that prop; otherwise the zone must declare `at`. Prop ids must be non-empty and unique, and unknown `propId` references are errors. If both fields are present, `propId` takes precedence.
- Doors need `targetMap`, `spawnX`, `spawnY` (spawn must be walkable floor in the target map). Doors to not-yet-existing maps are allowed (warning only) when gated by flags.
- Each `D` resolves automatically to the correct west/east doorway sprite for the selected theme.
- Zone `properties` pass through to Tiled: `spawnX`/`spawnY` become ints, everything else strings.

**Themes** (each an 8×4 block in the stacked `placeholder.png`, tile index offset `(theme−1)×32`):

| Theme | Setting |
|-------|---------|
| 1 | sci-fi |
| 2 | jungle |
| 3 | snow |
| 4 | lava |
| 5 | desert |
| 6 | oceanic / underwater |

### Step 2: Create the level directory

```
src/explorers/levels/engine-room/
├── map.level.yaml
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
      {
        speaker: 'system',
        text: { pl: 'Reaktor — tryb oszczędzania energii.', en: 'Reactor — power-saving mode.' },
        mode: 'system',
        autoAdvance: 2000,
      },
    ],
  },
  'coolant-pipe': {
    id: 'coolant-pipe',
    lines: [
      {
        speaker: 'astronaut',
        text: { pl: 'Rura chłodząca. Jeszcze ciepła.', en: 'Coolant pipe. Still warm.' },
        mode: 'monologue',
      },
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
  displayName: { pl: 'Maszynownia', en: 'Engine Room' },
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

Add door zones in the new map's yaml pointing to existing maps, and add return doors in existing maps' yaml sources pointing back. Door zones need `targetMap`, `spawnX`, `spawnY` properties. Re-run `npm run levels:build` after editing any source.

Doors deliberately use both representations:

- A `type: door` zone is emitted into the Tiled `Zones` layer with its transition properties.
- A matching `D` grid cell selects the correctly oriented doorway art for the map's theme.
- The validator checks exact `D`/zone coverage, known targets, walkable target spawns, and missing return connections.
- The runtime performs the transition when the player interacts with the compiled door zone.

The compiler does **not** infer the destination, create the return door, choose spawn coordinates, replace a wall with walkable floor, or create north/south doorway art. Mark doorway wall cells with `D`, cover the same coordinates with the door zone, and keep the destination spawn on an unobstructed `.` floor cell inside the target room.

For example, given rooms whose side walls are at `x=1` and `x=10`, connect A's east wall to B's west wall like this:

```yaml
# room-a/map.level.yaml
grid: |
  ~~~~~~~~~~~~
  ~##########~
  ~#........D~
  ~#........D~
  ~##########~
  ~~~~~~~~~~~~
zones:
  - id: door-to-b
    type: door
    at: [10, 2]
    size: [1, 2]
    properties: { targetMap: room-b, spawnX: 2, spawnY: 3 }

# room-b/map.level.yaml — explicit reciprocal connection
grid: |
  ~~~~~~~~~~~~
  ~##########~
  ~D........#~
  ~D........#~
  ~##########~
  ~~~~~~~~~~~~
zones:
  - id: door-to-a
    type: door
    at: [1, 2]
    size: [1, 2]
    properties: { targetMap: room-a, spawnX: 9, spawnY: 3 }
```

The `at` coordinates describe doorway wall art in the current map. `spawnX` and `spawnY` describe where the player appears in the other map. They are not the target door's wall coordinates.

**That's it.** No other files to edit. The level loader auto-discovers everything from the manifest. The map display name, all dialogues, interaction routes, and editor constants are all derived automatically.

---

## Map Authoring Pipeline

`map.level.yaml` files under `src/explorers/levels/<map-key>/` are the canonical map sources; the Tiled JSON under `public/game/maps/` is a compiled build artifact (committed, like the lesson HTML). A Vitest sync test (`mapAuthoring/mapSync.test.ts`) fails CI whenever an artifact drifts from its source — so never edit the JSON by hand.

| Command | What it does |
|---------|--------------|
| `npm run levels:build` | Validate all sources, then compile each to `public/game/maps/<key>.json`. Deterministic — same source, same bytes. `-- --map <key>` scopes the write. |
| `npm run levels:check` | Validation only: geometry, sealed rooms, wall resolvability, props, zones, cross-map doors + spawn walkability, floor reachability, manifest references (interaction routes, exam/arcade ids). Exit 1 on errors. |
| `npm run levels:render -- <key> [--zones] [--out <path>]` | Render the compiled map to a PNG (default: OS temp dir). `--zones` overlays zone rectangles with object-id labels and prints an id legend. |
| `npm run levels:decompile -- --full <key>` | One-off: lift an existing JSON map into a yaml source (used for the m0 migration). |
| `npm run levels:decompile -- --zones-only <key> [--from <json>]` | Lift zone edits from a Tiled JSON back into the yaml source, leaving theme/grid/props untouched. Comments above the `zones:` block survive; comments inside it don't. |

**The editor's role:** `/explorers-editor` (dev server only) edits `map.level.yaml` directly. It loads every level source through a dev-only Vite middleware (`scripts/levelEditorDevPlugin.mjs`), holds the parsed `LevelSource` as its model, and live-compiles it in the browser for rendering — grid painting (`~ # . o D` with live auto-tiling), themed prop placement, zone authoring with prop links, and inline validation. Save rewrites only the yaml (canonical formatting; explicit default `size: [1, 1]` is dropped) and refuses on validation errors — run `npm run levels:build` afterwards to regenerate the JSON artifact. If a door zone moves, update the corresponding `D` cells in the grid too; validation rejects stale or mismatched placement.

`id` on a prop and `propId` on a zone are authoring links: the parser resolves `propId` to ordinary zone coordinates and keeps both fields on the parsed source, so the visual editor and `serializeSource` preserve them; the compiled Tiled JSON stores only coordinates. Decompilation from JSON therefore emits an explicit `at` and cannot restore the original `propId` reference.

**The agent loop:** author or edit `map.level.yaml` → `npm run levels:build` (runs validation) → `npm run levels:render -- <key> --zones` → view the PNG → iterate. An agent can ship a complete level without ever hand-writing a tile index.

### Agent recipe: create a connected themed level set

For requests such as “create three oceanic levels connected by doors,” treat the set as one graph rather than authoring maps independently:

1. Choose stable map keys and write a topology table before editing. Record every directed door, including return connections.
2. Give each map a distinct spatial purpose and silhouette. Record its entry beat, landmark, branch or turn, quest interaction location, and exit beat; do not repeat the same rectangular composition across the set.
3. Decide whether each quest-bearing map benefits from an NPC. Record `none` with a reason, or record the NPC type, zone id, quest relationship, and pre/post-quest dialogue states.
4. Assign the same requested theme to every map (`theme: 6` for oceanic) unless the request explicitly calls for a transition.
5. Sketch all grids and mark doorways with `D` on west/east wall runs. Do not cut holes in the ASCII wall ring.
6. Choose a walkable, unobstructed spawn inside each destination, normally one tile inward from its door.
7. Create all `map.level.yaml` sources before the first build. Validation loads the complete source set, even when `levels:build -- --map <key>` scopes which JSON file is written.
8. Add props by alias, not slot number. Include `synaptit-ore` only where the level design calls for the mission resource. Use props as landmarks and spatial storytelling, not uniform filler.
9. Add manifests and register all levels in `src/explorers/levels/index.ts`. Add bilingual dialogues and display names when the levels contain player-facing content.
10. Run `npm run levels:build`, then render every map with `--zones`. Check geometry, door overlays, target spawns, solid-prop obstructions, repeated visual composition, dead space, and whether the quest path uses the layout.
11. Run the full verification commands and test every transition in both directions in the browser.

Example topology prepared before authoring:

| Map | Theme | Outgoing doors | Intended entry spawn |
|-----|-------|----------------|----------------------|
| `oceanic-landing` | 6 | east → `oceanic-reef` | `[2, 3]` |
| `oceanic-reef` | 6 | west → `oceanic-landing`; east → `oceanic-sanctum` | `[2, 3]` from west; `[9, 3]` from east |
| `oceanic-sanctum` | 6 | west → `oceanic-reef` | `[9, 3]` |

This table is a planning aid, not compiler input. Every row still needs explicit YAML door zones.

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
  text: BilingualText;           // { pl: string, en: string }
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

### Choose an NPC for a reason

Match the visual type to the character's narrative function and the local theme: `scientist` for human crew or researchers, `alien` for organic non-human inhabitants, `robot` for technical or service entities, and `orb` for energy beings, anomalies, or ancient guides. This is guidance, not a restriction—a deliberate contrast can be more interesting than a literal match.

For quest-linked NPCs, write down the relationship before placing the zone:

- **Activation:** interacting with the NPC ends with `activateQuest`.
- **Guidance:** their dialogue gives a clue the player can act on elsewhere in the topology.
- **State:** `flagVariants` distinguish not-started, active, and completed quest states.
- **Consequence:** their post-quest dialogue acknowledges what changed or points to the newly available route.

An NPC does not need to own every stage. For example, a robot can activate a repair quest, a console in a side chamber can be the objective, and the same robot can react to the completion flag. Conversely, omit the NPC when the fiction calls for isolation or when a terminal/environment already communicates the quest more clearly.

### How it works

1. Map author places a zone object with `type: npc` in Tiled's `Zones` layer
2. `GameScene` separates NPC zones from static zones during parsing and spawns `NPC` instances
3. Each NPC wanders freely using a random-direction timer; Arcade Physics prevents wall and character pass-through
4. When the player faces an NPC within `INTERACTION_RADIUS` (48 px), the prompt `[E] Porozmawiaj` appears and tracks the NPC's current position
5. Pressing [E] freezes all NPCs, resolves the dialogue ID via `interactionRoutes`, and starts the dialogue
6. On dialogue dismiss, all NPCs resume wandering

### Step 1: Add the NPC zone to the map source

In the map's `map.level.yaml`, add a zone with `type: npc` (then `npm run levels:build`):

```yaml
zones:
  - id: engineer-moreau
    name: Moreau
    type: npc
    at: [9, 6]
    properties:
      npcType: scientist
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
| `robot` | 2 | Androids, service units, drones |
| `orb` | 3 | Floating entities, energy beings |

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
- A `npcType` dropdown appears (scientist / alien / robot / orb)
- The debug overlay renders the zone in **fuchsia** (`#e879f9`)

### Spritesheet layout — `npc-characters.png`

**Size:** 1024 × 384 px — 4 frames per direction × 4 characters × 4 directions

```
         scientist        alien           robot           orb
         (cols 0–3)      (cols 4–7)     (cols 8–11)    (cols 12–15)
row 0    [up   × 4]      [up   × 4]     [up   × 4]      [up   × 4]
row 1    [down × 4]      [down × 4]     [down × 4]      [down × 4]
row 2    [left × 4]      [left × 4]     [left × 4]      [left × 4]
row 3    [right × 4]     [right × 4]    [right × 4]     [right × 4]
```

Frame index formula: `dirRow × 16 + charIdx × 4 + frameOffset`

Each frame is **64 × 96 px** (same as the player spritesheet).

### Reusing the sheet as color variants

Do not use a Phaser geometry or bitmap mask to recolor an NPC. Masks control which pixels are visible; they do not change pixel color. `NPC` extends `Phaser.Physics.Arcade.Sprite`, so color variants can be applied directly to each instance while continuing to use the same texture frames and animation keys:

```typescript
// Color filter: preserves the source shading, but multiplies its RGB values.
npc.setTint(0x66ccff);

// Alpha-mask look: replaces every visible pixel with the selected color.
npc.setTintFill(0x66ccff);

// Restore the original sprite colors.
npc.clearTint();
```

Both tint modes respect the PNG alpha channel, so fully transparent background pixels remain transparent. Use `setTint()` for damage/status lighting or modest theme shifts. Use `setTintFill()` for holograms, silhouettes, scans, and other intentional one-color mask effects. Because the source characters are already colored, multiplicative tint cannot perform an arbitrary palette swap: black remains black and a saturated source channel cannot be remapped freely.

Phaser's sprite tint component is WebGL-only. The game currently uses `Phaser.AUTO`, so a browser that falls back to Canvas will not render these tints. If Canvas parity or exact multi-color theme palettes are required, generate and cache one derived spritesheet texture per variant after `npc-characters` loads:

1. Copy the source image into a `CanvasTexture` with image smoothing disabled.
2. For a one-color mask, fill it using the canvas `source-in` composite operation; this preserves the original alpha channel.
3. Register the canvas as a spritesheet with the same `64 × 96` frame configuration.
4. Register variant animation keys against that texture once, then reuse the cached texture for all matching NPC instances.

Avoid generating a texture per NPC. Cache by a stable variant key such as `npc-characters--hologram-blue`. For selective palette swaps (for example changing robot armor while preserving its eyes and outline), either export separate grayscale mask layers from the art pipeline or use a custom WebGL palette-swap pipeline; a single whole-sprite tint cannot distinguish semantic regions.

The authored YAML contains a numeric map `theme`, but the compiler does not currently emit it into the runtime Tiled map. Automatic theme-based NPC variants therefore need one small data-contract change first: emit the theme as a map property, or author an explicit validated `npcVariant` property on each NPC zone. Prefer the explicit property when two NPCs on the same map may use different variants.

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

### Step 1: Add `requiredFlags` to the door zone in the map source

In the map's `map.level.yaml`, add a `requiredFlags` property to the door zone (comma-separated flags), then `npm run levels:build`:

```yaml
grid: |
  ~##########~
  ~#........D~
  ~#........D~
  ~##########~
zones:
  - id: exit-door
    type: door
    at: [10, 1]
    size: [1, 2]
    properties:
      targetMap: next-room
      spawnX: 5
      spawnY: 3
      requiredFlags: exam-a-done,exam-b-done
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

### Companion HQ repository for API quests

`api-answer` quests span two repositories. The secondary repository is not an optional example or a documentation mirror; it is the Navigator's actual working environment and therefore part of the production quest contract:

- Local checkout: `~/dev/10x-explorers-hq`
- Public repository: `github.com/przeprogramowani/10x-explorers-hq`
- Player CLI: `earthctl` from `@10xdevspl/earth-ctl`

The responsibility split is deliberate:

| Repository | Owns |
|---|---|
| `edu-platform` | Quest activation, bilingual briefing and hints, API token lifecycle, server-side answer hash, XP/flag grant, pending-grant application, map/dialogue consequences |
| `10x-explorers-hq` | Mission source files, static fixtures, artifact templates, local validator/simulator, agent instructions, deterministic passphrase generation, `earthctl submit` workflow |

The game API does not receive or grade repository files. `POST /api/game/submit` accepts a short canonical answer and compares its normalized SHA-256 hash. Consequently, an API quest is not playable merely because its `quests.ts`, dialogue, and `answerHash` exist. The corresponding HQ mission must contain enough authored inputs and deterministic local tooling to produce that exact canonical answer.

When adding or changing an `api-answer` quest:

1. Inspect both repositories before implementation and obey each repository's `AGENTS.md`.
2. Add the quest definition and game consequences in `edu-platform`.
3. Add the matching mission package in `10x-explorers-hq`, including its briefing, inputs, expected artifact shape, and deterministic validator.
4. Run the HQ validator to obtain the canonical answer, then compute/update the `answerHash` in `edu-platform`. Never invent an unrelated hash by hand.
5. Verify the complete player path: `earthctl status` → solve using HQ assets → local validator emits answer → `earthctl submit --quest-id <id> --answer <answer>` → pending grant appears → browser applies XP/flags and plays the completion dialogue.
6. If the mission needs more than `{ quest_id, answer }` (for example explicit human authorization), update the HQ instructions, `earthctl`, the submission API schema, tests, and server validation as one cross-repository change.

Keep large puzzle inputs and local-only validator fixtures in the HQ repository. Keep player-facing in-game prose bilingual in `edu-platform`; keep HQ mission prose consistent with that repository's Earth HQ immersion rules.

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
  title: BilingualText;
  description: BilingualText;
  questions: ExamQuestion[];
  passingScore: number;          // minimum correct answers to pass
  rewards: { xp: number; flags: string[] };
  completionDialogue?: string;   // dialogue ID triggered on pass
}

interface ExamQuestion {
  id: string;                    // unique within exam
  text: BilingualText;
  type: 'single' | 'multi';     // single-choice or multi-choice
  options: ExamOption[];
  correctOptionIds: string[];    // IDs of correct options
}

interface ExamOption {
  id: string;                    // unique within question
  text: BilingualText;
}
```

### Step 1: Define the exam

**File:** `src/explorers/levels/engine-room/exams.ts`

```typescript
import type { ExamDefinition } from '../../systems/ExamTypes';

export const exams: ExamDefinition[] = [
  {
    id: 'reactor-certification',
    title: { pl: 'Certyfikacja Reaktora', en: 'Reactor Certification' },
    description: {
      pl: 'Sprawdź wiedzę o systemach reaktora.',
      en: 'Test your knowledge of the reactor systems.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Jaki jest kod diagnostyczny reaktora?', en: 'What is the reactor diagnostic code?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'RT-42', en: 'RT-42' } },
          { id: 'b', text: { pl: 'RT-99', en: 'RT-99' } },
          { id: 'c', text: { pl: 'RX-01', en: 'RX-01' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Które systemy chłodzenia są aktywne? (wybierz wszystkie)',
          en: 'Which cooling systems are active? (select all)',
        },
        type: 'multi',
        options: [
          { id: 'a', text: { pl: 'Obwód pierwotny', en: 'Primary circuit' } },
          { id: 'b', text: { pl: 'Obwód wtórny', en: 'Secondary circuit' } },
          { id: 'c', text: { pl: 'Obwód awaryjny', en: 'Emergency circuit' } },
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
    { speaker: 'system', text: { pl: 'Stacja certyfikacji reaktora aktywna.', en: 'Reactor certification station active.' }, mode: 'system', autoAdvance: 2000 },
  ],
},
'exam-reactor-completed': {
  id: 'exam-reactor-completed',
  lines: [
    { speaker: 'system', text: { pl: 'Certyfikacja ukończona. Dostęp przyznany.', en: 'Certification complete. Access granted.' }, mode: 'system', autoAdvance: 2000 },
  ],
},
'reactor-exam-complete': {
  id: 'reactor-exam-complete',
  lines: [
    { speaker: 'system', text: { pl: 'CERTYFIKACJA ZALICZONA', en: 'CERTIFICATION PASSED' }, mode: 'system', autoAdvance: 2000 },
    { speaker: 'astronaut', text: { pl: 'Reaktor jest teraz pod kontrolą.', en: 'The reactor is under control now.' }, mode: 'dialogue' },
  ],
  onComplete: { setFlags: ['reactor-certified'] },
},
```

### Step 3: Wire in the manifest

```typescript
import { exams } from './exams';

export const manifest: LevelManifest = {
  id: 'engine-room',
  displayName: { pl: 'Maszynownia', en: 'Engine Room' },
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

`GameScene` checks `getIntroConfigs(mapKey)` on every map entry and plays the **first** entry whose seen-flag is NOT set and whose `requiredFlags` (if any) are all present. The primary `introDialogue`/`introFlag` intro is always checked first.

### Conditional intros (e.g. return-to-ship cinematics)

A map can define additional one-shot intros via `conditionalIntros` — each gated by `requiredFlags` (AND logic) and tracked by its own seen-flag. This is how a "return from the moon" cinematic plays on a map the player has already visited:

```typescript
conditionalIntros: [
  {
    dialogue: 'm0-return-from-moon1',                 // dialogue ID to play
    flag: FLAGS.M0_RETURN_FROM_MOON1_SEEN,            // own seen-flag (prevents replay)
    requiredFlags: [FLAGS.M1_LANDING_INTRO_SEEN],     // only triggers once these are set
    cinematicTitle: 'Statek głębokiej przestrzeni Odyssey',  // optional title card
    cinematicSubtitle: 'Powrót z Księżyca 1',
  },
],
```

On the first visit the primary intro plays (the conditional one's `requiredFlags` are unmet); when the player returns after earning the required flags, the conditional intro plays once. `contentValidation` checks that the dialogue exists and all flags are registered in `flags.ts`.

**Variants:**

- **With `introCinematicTitle`**: Full black-screen card with title + subtitle fades in, holds 2s, fades out. Then the overlay fades to the visible map and the intro dialogue plays.
- **With `introCinematicTitle` + `introSpotlight: true`**: After the title card, a spotlight overlay appears (small circle around the player) and the intro dialogue plays over the dimmed screen. When the dialogue is dismissed, the spotlight expands to reveal the full map. The spotlight effect is implemented in `src/explorers/effects/spotlightReveal.ts` and is reserved for the hibernation-bay awakening (`m0-awakening`) — do not enable it on other levels.
- **Without `introCinematicTitle`**: Sets the intro flag and immediately plays the intro dialogue, skipping the black-screen card entirely.

### Fresh-start testing (important)

- Intro playback is controlled by `introFlag` only. If the flag exists, intro does not run.
- To re-test first-visit behavior, clear the intro flag from both local and server state.
- QA overlay `Reset State` performs a full reset by writing default state locally and resetting server state before reload.

---

## LevelManifest Reference

```typescript
interface LevelManifest {
  id: string;                                        // map key, matches JSON filename
  displayName: BilingualText;                        // { pl: string, en: string }, for HUD
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
  introSpotlight?: boolean;                          // spotlight-in-darkness reveal (m0-awakening only)
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
| `src/explorers/levels/<level>/map.level.yaml` | Canonical map source (theme, grid, props, zones) — compiled to `public/game/maps/<level>.json` |
| `src/explorers/levels/<level>/manifest.ts` | Level manifest (single source of truth per level) |
| `src/explorers/levels/<level>/dialogues.ts` | Dialogue sequences for the level |
| `src/explorers/levels/<level>/quests.ts` | Quest definitions for the level (optional) |
| `src/explorers/levels/<level>/exams.ts` | Exam definitions for the level (optional) |
| `src/pages/api/game/index.ts` | API endpoint — serializes `ALL_LEVELS` to JSON for client boot |

### Map Authoring

| File | Purpose |
|------|---------|
| `src/explorers/config/tileIndices.ts` | Tile semantics: `TileRole` (32 roles per 8×4 theme block), theme math (`tileIndex`/`themeOf`/`roleOf`), role groups |
| `src/explorers/levels/mapAuthoring/parseSource.ts` | `map.level.yaml` → `LevelSource` (grid/props/zones shape checks, prop alias resolution) |
| `src/explorers/levels/mapAuthoring/autoTiler.ts` | Wall decision table (edges, corners), window/door edge art, deterministic FNV floor/bg scatter |
| `src/explorers/levels/mapAuthoring/compile.ts` | `compileLevel()` → Tiled JSON; `serializeMap()` — canonical byte-stable output |
| `src/explorers/levels/mapAuthoring/decompile.ts` | Inverse mapping: Tiled JSON → `LevelSource` (migration + zones-only round-trip) |
| `src/explorers/levels/mapAuthoring/validate.ts` | Validation rules: geometry, sealed rooms, props, zones, cross-map doors, reachability, manifest refs |
| `src/explorers/levels/mapAuthoring/propAliases.ts` | Per-theme prop slot aliases for all six themes |
| `src/explorers/levels/mapAuthoring/mapSync.test.ts` | CI drift gate: committed JSON must equal compiled yaml source |
| `scripts/levels-build.ts` / `levels-check.ts` / `levels-decompile.ts` / `levels-render.ts` | CLI wrappers (`npm run levels:*`) |

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

## Available Sprites (Props)

Each theme block in `placeholder.png` ships 8 theme-specific prop tiles, addressed in `map.level.yaml` by `slot: 1-8` or, preferably, by per-theme alias (`prop: <name>`, defined in `src/explorers/levels/mapAuthoring/propAliases.ts`). The aliases in exact slot order are:

| Theme | Slots 1 → 8 |
|-------|-------------|
| 1 — sci-fi | `console`, `hibernation-chamber`, `viewport`, `whiteboard`, `crate`, `radar`, `oscilloscope`, `button-panel` |
| 2 — jungle | `ship-teleport`, `holographic-console`, `void-node`, `synaptit-ore`, `ancient-portal`, `broken-scout-drone`, `energy-barrier`, `energy-core` |
| 3 — snow (frozen facility) | `ship-teleport`, `frozen-console`, `holo-plan-board`, `server-monolith`, `fabricator-rig`, `cargo-tram`, `frozen-service-bot`, `synaptit-ore` |
| 4 — volcanic | `ship-teleport`, `survey-lander`, `lava-geyser`, `lava-obelisk`, `magma-crystals`, `synaptit-ore`, `satellite-dish`, `exploration-rover` |
| 5 — sand | `ship-teleport`, `buried-hatch`, `desert-cairn`, `signal-beacon`, `synaptit-ore`, `solar-panel`, `supply-canister`, `desert-well` |
| 6 — oceanic | `ship-teleport`, `water-pump`, `seaweed`, `synaptit-ore`, `coral-shrine`, `pearl-orb`, `tidal-monolith`, `water-turbine` |

Theme 1 usage guidance:

| Slot | Alias (theme 1) | Use for |
|------|-----------------|---------|
| 1 | `console` | Workstations, data terminals, puzzle interfaces |
| 2 | `hibernation-chamber` | Crew pods, stasis units |
| 3 | `viewport` | Windows, observation points |
| 4 | `whiteboard` | Information displays, notes, schematics |
| 5 | `crate` | Collectibles, item pickups, rewards |
| 6 | `radar` | Scanners, navigation stations |
| 7 | `oscilloscope` | Diagnostic equipment, signal displays |
| 8 | `button-panel` | Switches, control panels |

Props render their own ground, so `solid: true` (Walls layer, collides) vs `solid: false` (Ground layer, walkable decal) is purely a gameplay decision per placement. Interactivity always comes from a separate zone over the same tiles, wired via the manifest's `interactionRoutes`.

Every planetary theme (2-6) exposes one visually appropriate resource tile through the shared `synaptit-ore` alias. Theme 1 is the Odyssey's sci-fi interior and keeps `crate` instead. The physical Synaptit slot varies by planetary theme, so always prefer the alias over a numeric slot.

---

## Checklist: Adding a New Level

- [ ] Add any new flag constants to `src/explorers/config/flags.ts` before using them elsewhere
- [ ] Write the level-design brief: purpose, distinctive topology, landmark, quest geography, and NPC-or-no-NPC decision
- [ ] For a multi-level set, write the topology and reciprocal door pairs before editing maps; ensure adjacent maps do not repeat the same silhouette and traversal pattern
- [ ] Create `src/explorers/levels/<map-key>/map.level.yaml` (theme, grid, props, zones — see Step 1)
- [ ] Give meaningful branches, alcoves, or loops a clue, interaction, resource, shortcut, story beat, or useful view; remove purposeless dead space
- [ ] Mark every doorway with `D` and add an exactly overlapping door zone; add reciprocal connections where required
- [ ] `npm run levels:build` — compiles `public/game/maps/<map-key>.json`; fix any validation errors
- [ ] `npm run levels:render -- <map-key> --zones` — reject accidental box rooms, repetitive compositions, obstructed quest routes, and weak landmarks; iterate on the YAML
- [ ] Create `src/explorers/levels/<map-key>/dialogues.ts`
- [ ] Create `src/explorers/levels/<map-key>/quests.ts` (if needed)
- [ ] If the level has a quest, place activation, objective, and consequence across the topology where practical instead of collapsing every beat into one interaction
- [ ] If an NPC improves the quest, choose a matching type and tie it to activation, guidance, flag-dependent state, or consequence; otherwise record why no NPC is the stronger choice
- [ ] Create `src/explorers/levels/<map-key>/exams.ts` (if needed)
- [ ] Create `src/explorers/levels/<map-key>/manifest.ts`
- [ ] Add import + entry in `src/explorers/levels/index.ts`
- [ ] If adding new manifest fields consumed by runtime, also serialize them in `src/pages/api/game.ts` and map them in `src/explorers/levels/levelLoader.ts`
- [ ] `npm run check` passes
- [ ] `npx vitest run` passes (includes the map source/artifact sync test)
- [ ] `npm run build` passes
- [ ] Test in browser: traversal is readable and purposeful; every door works in both directions and spawns safely; dialogues, quests, NPC state changes, and exams work

## Checklist: Adding an NPC

- [ ] Add an NPC zone (`type: npc`, `id`, optional `npcType`) to `map.level.yaml`
- [ ] Add a dialogue sequence to the level's `dialogues.ts` (use `mode: 'dialogue'` for two-character lines)
- [ ] Add `{ zoneId: '<npc-id>', defaultDialogue: '<dialogue-id>' }` to the manifest's `interactionRoutes`
- [ ] Ensure `public/game/sprites/npc-characters.png` exists (1024 × 384 px, 64 × 96 px frames)
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
    title: { pl: 'Strzelnica Asteroidów', en: 'Asteroid Range' },
    description: {
      pl: 'Odyssey potrzebuje surowców do utrzymywania sprawności systemów pokładowych. Namierzaj asteroidy i zbieraj minerały.',
      en: 'The Odyssey needs raw materials to keep its systems running. Track asteroids and collect minerals.',
    },
    difficulty: 2,                    // 1-5 (affects game parameters)
    durationSeconds: 60,              // Timer length (0 = round-based, no timer)
    mission: {
      minScore: 250,
      firstClearXp: 10,
      firstClearDialogueId: 'arcade-asteroid-cleared',
    },
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

### Placing Arcade Zones in Map Sources

Add the zone to `map.level.yaml`, then rebuild:

```yaml
zones:
  - id: asteroid-station
    type: arcade
    at: [4, 3]
    properties: { arcadeGameId: arcade-asteroid-test }
```

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

### Mission success and XP

Mission success can require `requireCompleted`, `minScore`, or `minScoreRatio`. If no score rule is authored and the renderer reports `maxScore`, the default threshold is 80%. `mission.firstClearXp` is granted only on the first successful clear; successful replays grant no additional XP.

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
- [ ] Add an `arcade` zone to `map.level.yaml` with an `arcadeGameId` property
- [ ] `npm run build` passes
- [ ] Test in browser: `[E] Graj` prompt → intro screen → countdown → gameplay → results → XP granted

---

## Ship Navigation Deck (moon travel)

Travel from the Odyssey to the mission moons goes through the **ship navigation deck** — an overlay scene (`NavigationScene`, mirroring the exam scene lifecycle) opened from a `type: navigation` map zone. The player picks one of the 5 moons; selecting an available destination plays a short star-streak flight cinematic and then performs a regular map transition (`TRANSITION_START`). Arrival cinematics are handled by the destination map's own intro config.

### Destination registry

Destinations are authored content in `src/explorers/levels/navigationDestinations.ts` (bilingual names/descriptions). Each entry has:

```typescript
{
  id: 'moon-1',
  name: { pl: 'Księżyc 1 — Dżungla', en: 'Moon 1 — Jungle' },
  description: { pl: '...', en: '...' },
  codename: 'Agentic Asteroid',   // course-stage codename shown on the /navi mission map
  eta: '2026-05-22',              // course schedule date — /navi shows a countdown while in the future
  targetMap: 'm1-landing-pad',    // null = future content, renders as "no signal"
  spawnX: 1,
  spawnY: 5,
  requiredFlags: [FLAGS.M0_EARTH_SIGNAL_RECEIVED, FLAGS.SYS_COURSE_M1_AVAILABLE],  // AND logic
}
```

Row states: **available** (all `requiredFlags` set, clickable), **locked** (flags missing — "no launch clearance"), **no signal** (`targetMap: null`). Status logic lives in `getDestinationStatus()` in the same file.

### /navi terminal command

The SmartTerminal `/navi` mission map is driven by the **same registry** — `cmdNavi` in `terminal/commandHandler.ts` iterates `NAV_DESTINATIONS` and reuses `getDestinationStatus()`, so the terminal and the deck can never disagree. Per moon it shows: **ready to launch** (points the player at the CORE AI navigation deck), **no launch clearance** (flags missing), an **ETA countdown** (`eta` still in the future), or **no signal**. A fixed "0. Awakening Procedures" entry represents the ship and stays marked in-progress until the first moon becomes available. Edit moon names, codenames, dates, or gating in `navigationDestinations.ts` only — never in the command handler.

### Placing a navigation zone

```yaml
props:
  - { id: navigation-console, prop: radar, at: [9, 4], solid: true }
zones:
  - id: ship-navigation-deck
    type: navigation
    propId: navigation-console
```

No zone properties are needed — the scene reads the global destination registry. The prompt shows `[E] Nawigacja`; the debug overlay renders navigation zones in blue. Unlocking a new moon = adding a destination entry (or flipping its `sys:` flag); when the target map ships, replace `targetMap: null` with the real map key and spawn.

Note the deliberate asymmetry: flying out happens via the deck, returning happens via a **ship-teleport** on the moon map — a solid `ship-teleport` prop with a door-type zone on the same tile pointing back at the ship (the validator's "no door leading back" warning for such maps is expected). Door zones normally must sit on `D` wall cells, but the validator allows a door zone on a floor cell when a solid prop covers that tile — the prop is the door visual. Example from `m1-landing-pad`:

```yaml
props:
  - { id: ship-teleport, prop: ship-teleport, at: [1, 7], solid: true }
zones:
  - id: ship-teleport
    name: Landed Shuttle
    type: door
    propId: ship-teleport
    properties:
      targetMap: m0-core-ai
      spawnX: 9
      spawnY: 5
```

### Key files

| File | Role |
|------|------|
| `src/explorers/scenes/NavigationScene.ts` | Overlay scene: destination list, flight cinematic, transition |
| `src/explorers/levels/navigationDestinations.ts` | `NAV_DESTINATIONS` — bilingual destination registry |
| `src/explorers/i18n/navigation.ts` | Chrome strings (`nav.*`) |
| `src/explorers/scenes/GameScene.ts` | `navigation` interaction case, `NAVIGATION_DISMISSED` resume |
| `src/explorers/events/GameEvents.ts` | `NAVIGATION_SHOW` / `NAVIGATION_DISMISSED` |

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
