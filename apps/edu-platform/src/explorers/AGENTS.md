# Space Explorers agent guide

This file applies to `src/explorers/**`. It supplements the repository-level `AGENTS.md`; follow both. When work crosses into API routes, pages, public assets, or build scripts, also respect the instructions that govern those paths.

## Read before changing the game

- `.ai/10x-devs/game/cookbook.md` is the primary how-to guide for working on Space Explorers. Consult it before implementing levels, NPCs, dialogues, quests, doors, exams, arcade games, progression, or audio. Follow its detailed procedures and checklists instead of inventing a parallel workflow.
- `.ai/10x-devs/game/storyline.md`, `backstory.md`, and `player-progression.md` define narrative and progression constraints.
- `src/explorers/levels/_arc-m1.md` contains the Module 1 narrative arc and design context.
- For focused subsystems, check the matching document in `.ai/10x-devs/game/`, especially `movement-bounds.md`, `npc-behavior.md`, and `sprites-theme.md`.

## Architecture and ownership

| Area | Responsibility |
|---|---|
| `PhaserGame.svelte` | Browser-game host and bridge between Svelte UI, Phaser, persistence, and managers |
| `scenes/` | Phaser lifecycle: boot, preload, map gameplay, dialogue, exams, arcade, transitions |
| `levels/<map-key>/` | Level-owned YAML, manifest, dialogue, quests, exams, and arcade definitions |
| `levels/index.ts` | Server-side registry of all level manifests |
| `levels/levelLoader.ts` | Client-side conversion of `/api/game` data into runtime registries |
| `levels/mapAuthoring/` | YAML parsing, validation, compilation, auto-tiling, and source/artifact sync tests |
| `entities/` | Player, NPCs, interactable objects, movement, collision, and actor depth |
| `systems/` | Dialogue, quest, exam, arcade, input, interaction, bookmarks, and state machines |
| `state/` | Game state, flags, persistence, authenticated preload, spawn and movement bounds |
| `config/` | Constants, flags, ranks, scene keys, map names, tile semantics, and NPC variants |
| `events/GameEvents.ts` | Typed event contract between game subsystems and Svelte UI |
| `i18n/` | Localized UI/chrome strings and parity/static-analysis tests |
| `terminal/` | Terminal commands, output, lock screen, tokens, and event bridge |
| `arcade/` | Phaser renderers for mini-games; definitions remain level-owned |
| `audio/` | Audio keys, asset registry, and playback manager |
| `editor/` | Svelte level editor and its import/export API contract |
| `assets/AssetManifest.ts` | Runtime map/global visual asset URLs |

At boot, `BootScene` fetches `/api/game`. The endpoint in `src/pages/api/game.ts` serializes `levels/index.ts`; `levelLoader.ts` builds the client registries before gameplay starts. If a new manifest field is consumed at runtime, update all three parts: `levels/types.ts`, `src/pages/api/game.ts`, and `levels/levelLoader.ts`. Never expose server-only data such as API-answer hashes in the public manifest.

## Non-negotiable working rules

- Use Phaser for canvas/gameplay behavior and Svelte for interactive DOM UI. Do not add React.
- Keep player-facing content bilingual. Use `t()` for chrome, HUD, scene labels, terminal output, and arcade results. Use `BilingualText` for dialogues, quests, exams, map names, and other authored content. Add both `pl` and `en` values.
- Do not hardcode Polish player-facing strings in `src/explorers/`; `i18n/noHardcodedPolish.test.ts` enforces this.
- Add reusable flags in `config/flags.ts`. Keep dialogue, quest, exam, arcade, zone, and map IDs stable and globally unique where the loaders require it.
- Communicate across subsystems through typed `GameEvents` when an event boundary already exists; avoid introducing parallel ad-hoc channels.
- Preserve Y-sorted actor depth and the existing collision/movement-bounds model when changing actors or maps.
- Keep constants centralized in `config/constants.ts`. Sprite geometry must agree with preload frame configuration and animation indexing.
- Do not silently change persisted state semantics. State migrations, save keys, flags, and API persistence require explicit compatibility analysis.

## Level authoring workflow

`src/explorers/levels/<map-key>/map.level.yaml` is the canonical map source. `public/game/maps/<map-key>.json` is a generated, committed artifact. Never edit map JSON by hand.

Use `.ai/10x-devs/game/cookbook.md` for the complete level-authoring how-to, YAML examples, content wiring instructions, subsystem recipes, and completion checklists. The steps below are only the minimum working loop.

For a level change:

1. Write or confirm the level purpose, topology, landmark, quest geography, and NPC-or-no-NPC decision.
2. Edit `map.level.yaml` plus the level-owned `dialogues.ts`, `quests.ts`, `exams.ts`, `games.ts`, and `manifest.ts` files that are needed.
3. Register a new manifest in `levels/index.ts`.
4. Run `npm run levels:build -- --map <map-key>`. Run the unscoped command when cross-map validation or several maps changed.
5. Run `npm run levels:render -- <map-key> --zones`, inspect the PNG, and iterate on geometry, blocked routes, door/spawn alignment, landmarks, and quest flow.
6. Run the focused tests, including the map sync and content validation tests.

Use semantic prop aliases from `levels/mapAuthoring/propAliases.ts`; do not hand-author tile indices. Door zones must align with `D` cells and normally need reciprocal target doors with safe walkable spawns. Use explicit validated NPC properties such as `npcType` and `npcVariant` rather than map-name checks in runtime code.

## Asset locations

Runtime URLs under `/game/...` resolve to `public/game/...`.

| Asset | Location and contract |
|---|---|
| Main tileset | `public/game/tilesets/placeholder.png`; runtime sheet is 512 x 1536, 8 columns, six stacked 8 x 4 theme blocks of 64 px tiles |
| Tile semantics | `config/tileIndices.ts`; theme names, role positions, and absolute-index helpers |
| Prop names | `levels/mapAuthoring/propAliases.ts`; preferred YAML aliases for the eight prop slots per theme |
| Player spritesheet | `public/game/sprites/astronaut.png`; 256 x 384, 64 x 96 frames |
| NPC spritesheet | `public/game/sprites/npc-characters.png`; 1024 x 384, 64 x 96 frames; type columns and color variants live in `config/constants.ts` |
| Compiled maps | `public/game/maps/*.json`; generated from `levels/*/map.level.yaml` |
| Music | `public/game/audio/music/*.ogg`; keys and URLs in `audio/AudioKeys.ts` and `audio/audioAssets.ts` |
| Sound effects | `public/game/audio/sfx/*.ogg`; keys and URLs in the same audio registry files |
| In-game data | `data/`, currently including the terminal boot sequence |
| Resource header | `public/game/headers/resources.png`; used by the Explorers resource page |
| Rank badge art | `public/game/badges/`; served by the rank badge route |

When adding or replacing a sprite, verify its pixel dimensions and alpha channel before changing frame constants. For NPC recoloring, prefer a named `NPC_COLOR_VARIANTS` entry and an authored `npcVariant`; multiplicative tints reduce brightness, while fill tints discard source color detail. Test visual changes in the browser, not only through unit tests.

`npm run generate:assets` runs the placeholder generator and can overwrite runtime placeholder files. Do not run it for normal level work or when preserving finished art.

## Verification

Use the smallest relevant set while iterating, then broaden according to risk:

```bash
npm run test:explorers
npm run levels:check
npm run check
```

For map work, always include `levels/mapAuthoring/mapSync.test.ts` and `levels/contentValidation.test.ts`. Localization changes must pass `i18n/strings.test.ts`, `i18n/noHardcodedPolish.test.ts`, and `levels/bilingualParity.test.ts`.

If the change touches `src/pages/api/game*`, other API routes, middleware, server code, Astro/Cloudflare configuration, or another server-side integration, run the repository-required sequence before pushing:

```bash
npm run check
npx vitest run
npm run build
```

For gameplay and visual changes, also test `/explorers` at desktop and mobile sizes. For editor changes, test `/explorers-editor` under `npm run dev` (it loads and saves `map.level.yaml` through a dev-only Vite middleware) and confirm saves stay parse/serialize round-trip clean and never touch the compiled JSON artifacts directly.
