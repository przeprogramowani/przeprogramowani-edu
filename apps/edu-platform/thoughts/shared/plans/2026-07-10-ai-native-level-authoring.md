# AI-Native Level Authoring — Text-First Map Sources with Auto-Tiling

## Overview

Introduce a text-first authoring pipeline for Space Explorers maps: a human/AI-readable `map.level.yaml` per level becomes the canonical source, compiled deterministically into the Tiled JSON that Phaser already consumes. The compiler performs full auto-tiling (wall edges, outer/inner corners, floor/background variant scatter), so authors — human or AI — only draw the floor plan and list props/zones. A validator catches level-design errors before runtime, a Vitest sync test prevents source/artifact drift, and a PNG renderer lets an AI agent visually verify its own output. The Phaser runtime is untouched.

**Decisions locked with the user (2026-07-09):**

| Decision | Choice |
|---|---|
| Source of truth | `map.level.yaml` canonical; `public/game/maps/*.json` is a build artifact |
| Auto-tiling | Full — author writes only `~` outside / `#` wall / `.` floor; compiler picks all variants |
| Editor role | Zones authoring + visual preview; zones-only decompile back to yaml |
| Tile semantics | Confirmed role model for the 8×4 theme block (see below) |
| Themes | Stacked `placeholder.png` (512×1536, 6 blocks of 8×4); theme N base = `(N−1)×32`; order: 1 sci-fi, 2 jungle, 3 snow, 4 lava, 5 desert, 6 underwater |
| Props | Ground **or** Walls layer per placement (author decides solidity); interaction always via a separate Zones object |

## Current State Analysis

- Maps live as Tiled JSON in `public/game/maps/` (4 files: `m0-awakening`, `m0-core-ai`, `m0-crew-room`, `m0-exam-room`). Layers: `Ground`, `Walls`, `Above` (all zeros today), `Zones` (objectgroup). Flat `data` arrays of tile indices — unreadable/unwritable for text agents; today's only authoring tool is the visual editor at `/explorers-editor`.
- `src/explorers/config/tileIndices.ts` is stale on two axes: the named constants (e.g. `FLOOR_CLEAN: 1`) do not match how maps actually use indices (Ground uses 5–8/10/11/18/19), and `TILESET_ROWS = 16` (with a "512x1024" comment) while the real `placeholder.png` is 512×1536 = 24 rows. No file outside `tileIndices.ts` references the `TileIndex` constants — the rewrite is unconstrained.
- Runtime wiring (`src/explorers/scenes/GameScene.ts`): `map.addTilesetImage('placeholder', 'tileset-placeholder')` (image URL registered in `src/explorers/assets/AssetManifest.ts:19-20`); collision is `wallLayer.setCollisionByExclusion([-1, 0])` (`GameScene.ts:113`) — **anything nonzero on Walls collides**. `GameScene.ts:130-134` samples a `bg-tile` frame at `(0, 4*TILE_SIZE)` — row 4 col 0, which under the 24-row sheet is theme 2's NW corner tile, not a background.
- Editor (`src/explorers/editor/`): `tilesetLoader.ts`, `mapImporter.ts`, `mapFactory.ts` already import the tileset constants (uncommitted working-tree change); fallback tileset entries still assume 16 rows / 128 tiles.
- `src/explorers/levels/mapAuthoring/` exists but is **empty** — adopted as the home for the new library code.
- Scripts convention: `scripts/*.ts` run via `tsx` (a devDependency), npm scripts named `<verb>:<noun>` (`generate:lesson-html` etc.). Scripts can import TS from `src/` directly (tsx).
- Existing anti-drift precedent: lesson HTML/markdown hash sync test — same pattern applies here.

### Confirmed tile semantics (one 8×4 theme block)

Index shown for theme 1 (`firstgid=1`, row-major, 8 columns). For theme N add `(N−1)×32`.

| Role | Indices | Layer | Notes |
|---|---|---|---|
| Floor | 10, 11, 18, 19 | Ground | 4 interchangeable walkable variants (plain + decorated) |
| Background / outside | 5, 6, 7, 8 | Ground | Decorative void beyond the walls; unreachable by design |
| Wall edge N | 2, 3 | Walls | 2 cosmetic variants; room floor is south of it |
| Wall edge W | 9, 17 | Walls | floor east |
| Wall edge E | 12, 20 | Walls | floor west |
| Wall edge S | 26, 27 | Walls | floor north |
| Outer corner NW / NE / SW / SE | 1 / 4 / 25 / 28 | Walls | Convex ring corners |
| Inner corner (elbow) NW / NE / SW / SE | 29 / 30 / 31 / 32 | Walls | Concave corners for non-rectangular rooms; elbow occupies the named quadrant, connects the two named edges |
| Prop slots 1–8 | 13, 14, 15, 16, 21, 22, 23, 24 | Ground **or** Walls | Theme-specific art (e.g. theme 1: console, hibernation chamber, viewport, whiteboard, crate, radar, oscilloscope, button panel); ground baked into sprite; solidity decided per placement |

Cross-validated against `m0-awakening.json`: wall ring rows are literally `1,3,2,3,…,4` / `25,27,26,…,28`, interior floor is `10/11/18/19`, outside is `5–8`, props `13/15/16/21` sit on the Walls layer.

### Key Discoveries

- `setCollisionByExclusion([-1, 0])` means layer placement **is** the collision model — no per-tile collision properties exist. Prop solidity = which layer the compiler writes it to.
- Zones use pixel coordinates in multiples of 64 and can span multiple tiles (e.g. Hibernation Pod: `x:128, y:192, width:128, height:64`). Zone `properties` is a flat name/type/value list; `id` property is the interaction key.
- Committed maps carry stale tileset metadata (`imageheight: 1024, tilecount: 128`) — harmless to Phaser at gids ≤ 32, but regenerated correctly by the compiler in Phase 3.
- The four existing maps all use theme 1 indices only.
- **Coordination note:** the working tree has uncommitted tileset-migration changes (`TILESET_ROWS = 16` edit, map touch-ups, untracked `placeholder_1..6.png`). Land or stash that work before starting Phase 1; Phase 1 supersedes the `tileIndices.ts` part of it. The per-theme `placeholder_N.png` files were reference art, not runtime assets — runtime and editor keep using the stacked `placeholder.png`. (The `placeholder_N.png` reference art was removed on 2026-07-15; only `placeholder.png` remains.)

## Desired End State

1. Each level directory contains `src/explorers/levels/<map-key>/map.level.yaml` — the canonical map source: theme, ASCII floor-plan grid, props list, zones list (tile coordinates).
2. `npm run levels:build` compiles every source to `public/game/maps/<map-key>.json`, byte-deterministically (same input → same bytes).
3. `npm run levels:check` validates all sources: geometry rules, wall resolvability, reachability, zone/manifest cross-references, door reciprocity.
4. A Vitest test fails CI whenever a committed JSON artifact differs from what its yaml source compiles to.
5. `npm run levels:render -- <map-key>` produces a PNG of the compiled map so an agent (or human) can eyeball it without launching the game.
6. `npm run levels:decompile -- --zones-only <map-key>` lifts editor-exported zone edits back into the yaml source (editor keeps its zones + preview role).
7. The four `m0-*` maps are migrated: yaml sources committed, JSON regenerated by the compiler, game plays identically (doors, dialogues, exams, collision).
8. The cookbook's "Step 1: Create the Tiled map" teaches the yaml flow; an AI agent can add a complete level without ever hand-writing tile indices.

### Verification

- Full suite green: `npm run check`, `npx vitest run`, `npm run build` (per repo pre-push rule).
- Manual: walk all four m0 maps in the browser — doors transition, prompts appear, exams open, NPCs collide with walls, no visual glitches at corners/junctions.
- Agent loop proof: author a new test room purely in yaml (temp), build, render, view PNG, delete.

## What We're NOT Doing

- **Not** changing the Phaser runtime, `/api/game`, level manifests, dialogues/quests/exams — the compiler's output contract is exactly today's Tiled JSON.
- **Not** building reverse auto-tiling for wall edits made in the editor. Tile painting in the editor remains possible for prototyping, but canonical wall/floor changes happen in yaml; only Zones round-trip.
- **Not** supporting the `Above` layer in the source format yet (all current maps have it empty; compiler emits zeros; format leaves room for a future `above` prop flag).
- **Not** supporting thin walls (floor on both sides of a 1-tile wall) or free-standing wall pillars — the 8×4 tile vocabulary has no pieces for them; the validator rejects them with a clear message.
- **Not** auto-running `levels:build` inside `npm run build` — same manual-generate + CI-sync-test model as lesson HTML.
- **Not** migrating the editor UI beyond what Phase 1 constants fix requires; `NewMapModal`/`TilePalette` keep working against the 24-row sheet.
- **Not** adding per-theme runtime theming logic (map ↔ theme binding lives in each map's yaml + compiled indices).

## Implementation Approach

Four phases, each independently verifiable:

1. **Phase 1 — Semantic tile model.** Rewrite `tileIndices.ts` around roles + theme math; fix the 24-row constants and the `bg-tile` sample; editor picks the fix up via its existing imports. Pure foundation, no behavior change for players.
2. **Phase 2 — Compiler + validator.** Library code in `src/explorers/levels/mapAuthoring/` (importable by Vitest), thin `tsx` script wrappers, `yaml` devDependency. The auto-tiler is the heart; it gets the densest unit tests.
3. **Phase 3 — Migrate the four m0 maps.** One-off full decompiler (JSON → yaml), recompile, prove role-equivalence, visually approve variant re-scatter, commit sources + regenerated artifacts + the sync test.
4. **Phase 4 — Agent loop + docs.** PNG renderer, zones-only decompile, cookbook rewrite.

## Critical Implementation Details

### Source format (`map.level.yaml`)

```yaml
# src/explorers/levels/m0-awakening/map.level.yaml
theme: 1            # 1-6 → index offset (theme-1)*32
grid: |             # fixed alphabet: '~' outside, '#' wall, '.' floor
  ~~~~~~~~~~~~
  ~##########~
  ~#........#~
  ~#........#~
  ~##########~
  ~~~~~~~~~~~~
props:
  - { slot: 1, at: [2, 1], solid: true }        # slot 1-8 → indices 13,14,15,16,21,22,23,24
  - { slot: 6, at: [4, 3], solid: false }       # walkable decal → Ground layer
zones:
  - id: hibernation-pod
    name: Hibernation Pod                        # optional, editor display name
    type: trigger                                # trigger | door | npc | exam | arcade
    at: [2, 3]                                   # tile coords, ×64 → pixels
    size: [2, 1]                                 # tiles, default [1, 1]
    properties: { }                              # extra Tiled properties, passed through
  - id: door-to-core
    type: door
    at: [5, 0]
    properties: { targetMap: m0-core-ai, spawnX: 5, spawnY: 3 }
```

- The grid alphabet is **fixed** (no per-file legend) — consistency across maps beats flexibility.
- Prop `slot` is theme-neutral (1–8). Optional human-readable aliases per theme live in `mapAuthoring/propAliases.ts` (theme 1 named first: `console`, `hibernation-chamber`, `viewport`, `whiteboard`, `crate`, `radar`, `oscilloscope`, `button-panel`); the yaml accepts either `slot: 2` or `prop: hibernation-chamber`.
- Zone `properties` map 1:1 to Tiled properties. Types: `spawnX`/`spawnY` → `int`, everything else → `string` (matches current maps). The zone `id` is emitted as the `id` string property; `type` and `name` go to the Tiled object fields.

### Auto-tiling decision table

Classify every cell: `OUT` (`~`, and everything outside the grid), `WALL` (`#`), `FLOOR` (`.`). For each `WALL` cell, let **F** = the set of 4-neighbors that are `FLOOR`:

| Condition | Piece | Index (theme 1) |
|---|---|---|
| F = {S} | edge N | 2/3 |
| F = {N} | edge S | 26/27 |
| F = {E} | edge W | 9/17 |
| F = {W} | edge E | 12/20 |
| F = {} and exactly one FLOOR diagonal: SE / SW / NE / NW | outer corner NW / NE / SW / SE | 1 / 4 / 25 / 28 |
| F = {S,E} / {S,W} / {N,E} / {N,W} | inner corner (elbow) NW / NE / SW / SE | 29 / 30 / 31 / 32 |
| F = {N,S} or {E,W} | **error**: thin wall unsupported |
| F = {} and 0 FLOOR diagonals | **error**: wall not bordering floor (use `~`) |
| F = {} and ≥2 FLOOR diagonals | **error**: ambiguous pillar |
| |F| ≥ 3 | **error**: free-standing wall stub |

Ground layer: `FLOOR` → floor variant; `WALL` and `OUT` → background variant (matches existing maps, where the ground under the wall ring is background).

### Deterministic variant selection

- Wall edge variants alternate by position parity: horizontal edges by `x % 2`, vertical by `y % 2` (existing maps alternate `3,2,3,2…` — same visual rhythm, not necessarily identical picks).
- Floor variants: FNV-1a hash of `(mapKey, x, y)` → weighted pick (plain `10` ≈ 70%, `11`/`18`/`19` ≈ 10% each). Backgrounds: same hash, `5` dominant.
- No `Date.now()`/`Math.random()` anywhere — byte-reproducible output is what makes the sync test possible.
- Compiler emits canonical JSON: fixed key order, 1-space indent (or whatever single format we pick — it becomes the committed style in Phase 3), zones get sequential Tiled object `id`s starting at 1, `nextobjectid = n+1`, correct tileset entry (`name: 'placeholder'`, `image: '../tilesets/placeholder.png'`, `imagewidth: 512`, `imageheight: 1536`, `tilecount: 192`, `columns: 8`, `firstgid: 1`).

### Validator rules (`levels:check`)

Errors: non-rectangular grid, unknown chars, unresolvable wall cells (table above), floor cell adjacent to `OUT` (leaky room), prop out of bounds / not on a `FLOOR` cell, duplicate zone ids, zone out of bounds, `theme` outside 1–6, door `targetMap` has no source/JSON, door `spawnX/spawnY` not on walkable floor **in the target map**.
Warnings: floor cells unreachable from any door spawn (or from the first floor cell if the map has no doors), door without a reciprocal door back, zone id with no `interactionRoutes` entry in the level manifest (legit fallback exists — objectId is used as dialogue id — hence warning, not error), `exam` zone whose `examId` is missing from the manifest's exams, `arcade` zone whose `arcadeGameId` is missing.
Manifest cross-checks import `ALL_LEVELS` from `src/explorers/levels/index.ts` directly (tsx handles TS imports).

---

## Phase 1: Semantic tile model + tileset constants fix

### Overview

Make `src/explorers/config/tileIndices.ts` the true single source of tile semantics, matching the real 24-row stacked tileset and the confirmed role model. No player-visible behavior change except fixing the mis-sampled page background tile.

### Changes Required

#### 1. Rewrite `src/explorers/config/tileIndices.ts`

Replace the stale `TileIndex` constants with the role model:

```ts
export const TILESET_COLS = 8;
export const TILESET_ROWS = 24;              // placeholder.png is 512x1536: 6 themes x (8x4)
export const TILESET_TILE_COUNT = TILESET_COLS * TILESET_ROWS;  // 192
export const THEME_COUNT = 6;
export const THEME_BLOCK_SIZE = 32;

/** Relative indices within one 8x4 theme block (1-based, firstgid=1). */
export const TileRole = {
  CORNER_NW: 1, EDGE_N_A: 2, EDGE_N_B: 3, CORNER_NE: 4,
  BG_1: 5, BG_2: 6, BG_3: 7, BG_4: 8,
  EDGE_W_A: 9, FLOOR_1: 10, FLOOR_2: 11, EDGE_E_A: 12,
  PROP_1: 13, PROP_2: 14, PROP_3: 15, PROP_4: 16,
  EDGE_W_B: 17, FLOOR_3: 18, FLOOR_4: 19, EDGE_E_B: 20,
  PROP_5: 21, PROP_6: 22, PROP_7: 23, PROP_8: 24,
  CORNER_SW: 25, EDGE_S_A: 26, EDGE_S_B: 27, CORNER_SE: 28,
  INNER_NW: 29, INNER_NE: 30, INNER_SW: 31, INNER_SE: 32,
} as const;

export function tileIndex(theme: number, role: number): number;  // (theme-1)*32 + role
export function themeOf(index: number): number;
export function roleOf(index: number): number;
export const FLOOR_ROLES / BG_ROLES / PROP_ROLES / WALL_ROLES: readonly number[];
```

Grouped role arrays are what the compiler/decompiler consume. Add a `THEMES` metadata record (1 sci-fi … 6 underwater) for docs/renderer labels.

#### 2. `src/explorers/editor/mapImporter.ts` + `mapFactory.ts`

Fallback tileset entries: `imageheight: TILE_SIZE * TILESET_ROWS` (already via constant in the working tree), and make sure `tilecount: TILESET_TILE_COUNT` and `columns: TILESET_COLS` are constant-driven. (`tilesetLoader.ts` already follows the constants.)

#### 3. `src/explorers/scenes/GameScene.ts:130-134` — fix `bg-tile` sample

Currently samples `(0, 4*TILE_SIZE)` — row 4 col 0 = theme 2's CORNER_NW under the 24-row sheet. Change to the theme-1 background tile: `add('bg-tile', 0, 4 * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)` → `x = 4 * TILE_SIZE, y = 0` (BG_1, index 5).

#### 4. Unit test `src/explorers/config/tileIndices.test.ts`

`tileIndex`/`roleOf`/`themeOf` round-trip for all 6 themes × 32 roles; role groups partition 1–32 exactly.

### Success Criteria

#### Automated Verification

- [ ] `npm run check` passes
- [ ] `npx vitest run` passes (new test included)
- [ ] `npm run build` passes
- [ ] `grep -rn "TileIndex\." src/` returns nothing outside `tileIndices.ts` (no stragglers)

#### Manual Verification

- [ ] `/explorers` plays as before: all four m0 maps render identically, collision unchanged
- [ ] Page background behind the map shows a background tile (stars/void), not a wall corner
- [ ] `/explorers-editor` palette shows all 192 tiles across 6 theme blocks

**Coordination:** land/stash the currently-uncommitted tileset migration first; this phase replaces its `tileIndices.ts` edit.

---

## Phase 2: Compiler + validator

### Overview

The authoring library in `src/explorers/levels/mapAuthoring/` plus thin script wrappers. Everything is pure functions over plain data so Vitest can exercise the auto-tiler exhaustively.

### Changes Required

#### 1. Dependency

Add `yaml` (devDependency) to `projects/edu-platform/package.json`.

#### 2. Library modules (`src/explorers/levels/mapAuthoring/`)

- `types.ts` — `LevelSource` (parsed yaml), `CellKind` (`OUT | WALL | FLOOR`), compile options, validation issue type (`{ level: 'error'|'warning', mapKey, message, at? }`).
- `parseSource.ts` — yaml → `LevelSource`; grid string → 2D cell array; prop alias resolution; shape errors here (rectangularity, alphabet, required fields).
- `autoTiler.ts` — the decision table from *Critical Implementation Details*: `resolveWalls(cells): number[]` (role indices or structured errors) + `groundLayer(cells, mapKey)` with the parity/FNV variant functions.
- `compile.ts` — `compileLevel(source, mapKey): TiledMap` — assembles Ground/Walls/Above/Zones, theme offset, canonical tileset entry; `serializeMap(map): string` — canonical byte-stable JSON.
- `decompile.ts` — inverse role mapping (`roleOf` + role groups → `~`/`#`/`.`/prop placements; Zones layer → zones list). Used by Phase 3 migration and the zones-only round-trip in Phase 4.
- `validate.ts` — the error/warning rules from *Critical Implementation Details*, including cross-map door checks and manifest cross-references (imports `ALL_LEVELS`).
- `propAliases.ts` — per-theme alias tables (theme 1 fully named; others start slot-only).

#### 3. Scripts + npm entries

- `scripts/levels-build.ts` — compile all `src/explorers/levels/*/map.level.yaml` → `public/game/maps/<key>.json`; `--map <key>` to scope. Runs validation first; refuses to write on errors.
- `scripts/levels-check.ts` — validation only, human-readable report, exit 1 on errors.
- `package.json`: `"levels:build": "tsx scripts/levels-build.ts"`, `"levels:check": "tsx scripts/levels-check.ts"`.

#### 4. Unit tests (`src/explorers/levels/mapAuthoring/*.test.ts`)

Auto-tiler: rectangular ring (all edges/corners), L-shaped room (inner corners on the concave turn), donut room, each error case (thin wall, pillar, stub, floor-touching-OUT). Compiler: fixture yaml → snapshot of compiled JSON; determinism (compile twice, bytes equal). Parser: alias resolution, malformed inputs. Validator: one test per rule.

### Success Criteria

#### Automated Verification

- [ ] `npm run check` / `npx vitest run` / `npm run build` pass
- [ ] `npm run levels:check` runs clean on an empty source set (no yaml files yet — graceful no-op)
- [ ] Compiling the same fixture twice yields identical bytes

#### Manual Verification

- [ ] Hand-write a small throwaway `map.level.yaml` (L-shaped room, one prop, one door), run `levels:build`, load the JSON in `/explorers-editor` preview — walls, corners, and inner elbows look correct

---

## Phase 3: Migrate the four m0 maps

### Overview

Decompile the existing maps into yaml sources, recompile, prove nothing semantic changed, accept the (deliberate) re-scatter of cosmetic variants, and turn on the anti-drift sync test.

### Changes Required

#### 1. `scripts/levels-decompile.ts` (+ `"levels:decompile"` npm entry)

`--full <map-key>`: read `public/game/maps/<key>.json`, invert via `decompile.ts`, write `src/explorers/levels/<key>/map.level.yaml`. Props found on Walls → `solid: true`; on Ground → `solid: false`. Zones lifted verbatim (pixels ÷ 64).

#### 2. Migrate: run for `m0-awakening`, `m0-core-ai`, `m0-crew-room`, `m0-exam-room`; then `npm run levels:build` and commit **both** the four yaml sources and the regenerated JSON artifacts.

Expected diffs in the regenerated JSON: variant re-scatter (different-but-valid floor/background/edge picks), corrected tileset metadata (`imageheight: 1536`, `tilecount: 192`), canonical formatting. Zones must survive byte-for-byte semantically (same ids, types, pixel coords, properties).

#### 3. Sync + equivalence tests: `src/explorers/levels/mapAuthoring/mapSync.test.ts`

- For every `map.level.yaml`, `compileLevel` output === committed `public/game/maps/<key>.json` (the drift gate).
- Role-equivalence: `decompile(compile(source))` reproduces the source grid/props/zones (proves the pair is a true inverse).
- Migration equivalence (one-off assertions kept in the test): for each m0 map, the role grid of the regenerated JSON equals the role grid of the pre-migration JSON (fixture copies stored under `mapAuthoring/__fixtures__/`), and zones deep-equal.

### Success Criteria

#### Automated Verification

- [ ] `npm run check` / `npx vitest run` / `npm run build` pass, including the new sync test
- [ ] `npm run levels:check` clean (or warnings only, each individually acknowledged)
- [ ] Mutating any committed m0 JSON by hand makes `mapSync.test.ts` fail (spot-check once, revert)

#### Manual Verification

- [ ] Full playthrough of all four maps: intro cinematics, door transitions (both directions), hibernation pod / whiteboard / terminal prompts, exam room exams, NPC wall collision
- [ ] Visual pass on each map (renderer from Phase 4 if built first, else in-game): variant re-scatter looks acceptable — this is the one deliberate visual change; user signs off

---

## Phase 4: Agent verification loop + editor round-trip + docs

### Overview

Close the loop: agents can see what they built, editor zone edits flow back to source, and the cookbook teaches the new flow.

### Changes Required

#### 1. `scripts/levels-render.ts` (+ `"levels:render"` npm entry, `pngjs` devDependency)

Blit Ground → Walls → Above from `public/game/tilesets/placeholder.png` per the compiled JSON; optional zone overlay (`--zones`: translucent rectangles + id labels). Output `--out <path>` (default: OS temp dir). Pure `pngjs` pixel copy — no native deps.

#### 2. Zones-only decompile: extend `scripts/levels-decompile.ts` with `--zones-only <map-key>`

Reads editor-exported JSON, rewrites **only** the `zones:` block of the existing yaml (grid/props untouched), preserving comments above the zones block if trivially possible (fine to document "comments inside zones block are not preserved").

#### 3. Cookbook update (`.ai/10x-devs/game/cookbook.md`)

- Rewrite "How to Add a New Level → Step 1" around `map.level.yaml` + `levels:build`; full source-format reference (alphabet, props, zones, theme table with the 6 themes).
- New section "Map authoring pipeline": build/check/decompile/render commands, the sync test, the editor's zones+preview role, the agent loop (author → build → check → render → view).
- Update "Available Sprites" to the slot/alias model (8 props per theme).
- Update the "Checklist: Adding a New Level" accordingly.

#### 4. `CLAUDE.md` (edu-platform) — one-line pointer in the Space Explorers section: maps are authored as `map.level.yaml` (see cookbook), JSON artifacts are compiled via `npm run levels:build`.

### Success Criteria

#### Automated Verification

- [ ] `npm run check` / `npx vitest run` / `npm run build` pass
- [ ] `npm run levels:render -- m0-awakening` writes a PNG

#### Manual Verification

- [ ] Rendered PNG of `m0-awakening` matches what the game shows
- [ ] Round-trip: move a zone in `/explorers-editor`, export, `levels:decompile --zones-only`, `levels:build` — diff shows only that zone moved
- [ ] End-to-end agent test: an AI agent (fresh session, cookbook only) authors a new connected room purely in yaml, and it plays correctly in the browser — the acceptance test for the whole initiative

---

## References

- Strategy discussion + tile semantics confirmation: session of 2026-07-09 (tile table cross-validated against `m0-awakening.json`)
- `src/explorers/config/tileIndices.ts` — current stale constants (Phase 1 target)
- `src/explorers/scenes/GameScene.ts:102,113,130-134` — tileset attach, collision-by-exclusion, bg-tile sample
- `src/explorers/editor/` — editor pipeline (`tilesetLoader`, `mapImporter`, `mapFactory`, `mapExporter`)
- `.ai/10x-devs/game/cookbook.md` — level framework docs (Phase 4 target)
- Anti-drift precedent: lesson HTML/markdown hash sync (commit `a878ccd6`)
