# AI-Native Level Authoring — Plan Brief

> Full plan: `thoughts/shared/plans/2026-07-10-ai-native-level-authoring.md`

## What & Why

Introduce a text-first authoring format for Space Explorers maps: a `map.level.yaml` per level (ASCII floor plan + props + zones) compiled into the Tiled JSON Phaser already consumes. Today maps exist only as flat arrays of tile indices — unreadable and unwritable for AI agents, and the hardest part (picking edge/corner/inner-corner wall variants) is a visual task text models can't do. The compiler auto-tiles everything visual, so authoring shrinks to "draw the floor plan, list the props and zones."

## Starting Point

- 4 maps (`m0-*`) in `public/game/maps/`, authored via the visual editor only.
- `tileIndices.ts` is stale twice over: constants don't match how maps actually use indices, and it says 16 tileset rows while `placeholder.png` is 24 (6 themes × 8×4 block).
- Tile semantics confirmed with the user: per theme block — 4 floors, 4 backgrounds, 8 wall edges (2 variants/side), 4 outer corners, 4 inner corners, 8 prop slots. Collision = "any nonzero tile on Walls collides", so prop solidity = layer choice.
- `src/explorers/levels/mapAuthoring/` exists, empty. Uncommitted tileset-migration changes in the working tree must land/stash first.

## Desired End State

`map.level.yaml` is canonical per level dir; `levels:build` compiles deterministically to `public/game/maps/*.json`; `levels:check` validates geometry, reachability, door reciprocity, and manifest cross-refs; a Vitest sync test blocks source/artifact drift; `levels:render` produces a PNG for visual self-verification; editor keeps zones + preview with `levels:decompile --zones-only` round-trip; all four m0 maps migrated; cookbook teaches the new flow. Acceptance test: a fresh AI agent authors a playable connected room from the cookbook alone.

## Key Decisions Made

| Decision | Choice | Why | Source |
|---|---|---|---|
| Source of truth | Text yaml canonical; JSON is build artifact | Strongest anti-drift guarantee; runtime untouched | User (AskUserQuestion) |
| Auto-tiling | Full — author writes only `~`/`#`/`.` | Variant selection is the visual task agents fail at; derivable from outline | User (AskUserQuestion) |
| Editor role | Zones + preview; zones-only decompile | Auto-tiling makes tile painting cheap in text; full reverse auto-tiling not worth it | User (AskUserQuestion) |
| Tile model | role + theme, index = (theme−1)×32 + role | All 6 theme blocks share one internal order (confirmed) | User |
| Prop layering | `solid: true/false` per placement → Walls/Ground | Assets vary (footprint vs snowman); no fixed z-index per asset | User |
| Thin walls / pillars | Rejected by validator | The 8×4 vocabulary has no tiles for them | Tileset analysis |
| Determinism | Parity variants + FNV position hash, no RNG/clock | Byte-stable output enables the sync test | Plan |
| Build model | Manual `levels:build` + CI sync test | Same pattern as lesson HTML/markdown hash sync | Repo precedent |

## Scope

4 phases: (1) rewrite `tileIndices.ts` as role model + fix 24-row constants and `bg-tile` sample; (2) compiler + validator library in `mapAuthoring/` + `levels:build`/`levels:check` scripts + dense auto-tiler tests; (3) decompile/migrate the four m0 maps, commit yaml + regenerated JSON, enable sync test (deliberate cosmetic re-scatter, user signs off); (4) `levels:render` PNG renderer, zones-only round-trip, cookbook rewrite.

Not doing: runtime/manifest changes, reverse auto-tiling of editor wall edits, `Above` layer authoring, auto-build in `npm run build`, per-theme runtime theming.
