# PR #151 Diataxis Documentation Implementation Plan

## Overview

Produce three Diataxis-structured documents that explain the wall-collision and character-movement improvements shipped in PR #151. The pass adds two new documents under `projects/edu-platform/.ai/10x-devs/game/` (a **reference** for the new `actorMovementBounds` module and an **explanation** for the NPC movement state machine), updates the NPC section of the existing `cookbook.md` **how-to** for the new behavior, and closes with a validation pass that applies the Diataxis skill's four type-specific checks plus a citation-drift audit.

## Current State Analysis

PR #151 merges a 62-file diff on branch `test/impl-review-pr151`. Stripping out skill evals, internal review notes, and map-editor tweaks leaves seven product-code files that change behavior in the `explorers/` game system:

- `projects/edu-platform/src/explorers/state/actorMovementBounds.ts` (new, 155 lines) — BFS flood-fill that builds per-NPC walkable-tile bounds, plus a body-rectangle containment test.
- `projects/edu-platform/src/explorers/state/actorMovementBounds.test.ts` (new, 32 lines) — verifies wall-separated regions reject cross-region positions.
- `projects/edu-platform/src/explorers/entities/NPC.ts` (+249/-27) — introduces a four-state movement machine (`wandering`, `idle`, `wallRecovery`, `frozen`), directional block detection, timer constants, and new public methods `faceTowards`, refined `freeze` / `unfreeze`, plus bounds enforcement.
- `projects/edu-platform/src/explorers/scenes/GameScene.ts` (+34/-22) — builds the collision grid once per scene, constructs `ActorMovementBounds` per NPC spawn, and triggers `npc.faceTowards(...)` on interaction.
- `projects/edu-platform/src/explorers/entities/Astronaut.ts`, `config/constants.ts`, `editor/ZonePropertiesPanel.svelte` — small supporting changes (constants, speed standardization, editor cleanup).

The canonical dev-and-author documentation hub is `projects/edu-platform/.ai/10x-devs/game/cookbook.md` (1465 lines, English, mixed how-to + reference). Its NPC section (roughly lines 379–519) currently documents Tiled placement, dialogue wiring, NPC types, behaviors, and the spritesheet layout — but has not been updated for standardized speed (80 px/s), idle behavior, wall-recovery, Y-sorted depth, or the new constructor signature that accepts `ActorMovementBounds`.

The `explorers/` system is consumed only inside `edu-platform` (no monorepo imports outside the project); there is no external API surface. Audience is two-tiered: content authors placing NPCs in Tiled and engine developers extending the system. Planning and research artifacts for PR #151 already exist under `thoughts/shared/plans/` and `thoughts/shared/research/` (dated 2026-04-22) and are internal-only — this plan does not re-litigate them.

## Desired End State

When this plan completes:

- `projects/edu-platform/.ai/10x-devs/game/movement-bounds.md` exists as a reference document for the `actorMovementBounds` public API.
- `projects/edu-platform/.ai/10x-devs/game/npc-behavior.md` exists as an explanation document for the NPC movement state machine.
- The NPC section of `projects/edu-platform/.ai/10x-devs/game/cookbook.md` reflects the shipped behavior (standardized speed, idle behavior, wall-recovery, Y-sorted depth, new constructor signature) and cross-links to the two new documents.
- All `startLine:endLine:filepath` citations in the new and updated docs resolve to real source lines at HEAD of `test/impl-review-pr151`.
- The four Diataxis validation checks (see Step 4 of `/Users/admin/.claude/skills/documentation/SKILL.md`) have been run against each doc type and any defects fixed.

Verification is performed by the Phase 4 validation pass.

### Key Discoveries:

- The new module has a narrow, easily-documented public surface: `buildActorMovementBounds(collisionGrid, origin)` and `isActorPositionWithinBounds(bounds, position)`, plus two exported types `ActorPosition` and `ActorMovementBounds` — see `projects/edu-platform/src/explorers/state/actorMovementBounds.ts`.
- The NPC state machine has exactly four states and a small, stable set of named timer constants (`NPC_WALL_BLOCKED_GRACE_MS`, `NPC_WALL_RECOVERY_MIN_MS`, `NPC_WALL_CLEAR_STABLE_MS`, `NPC_IDLE_CHANCE`, `NPC_IDLE_DURATION_MIN`, `NPC_IDLE_DURATION_MAX`, `NPC_IDLE_AFTER_UNFREEZE_MS`) defined alongside `NPC_SPEED` in `projects/edu-platform/src/explorers/entities/NPC.ts` — a transition diagram plus a constants table carries the explanation without heavy prose.
- `GameScene.ts` wires bounds per NPC at spawn time: builds the collision grid once in `create()`, then passes bounds into each `new NPC(...)` call — a single real-code slice from `GameScene.ts` is enough to anchor the reference doc's usage example.
- The original plan (`projects/edu-platform/thoughts/shared/plans/2026-04-22-wall-collision-npc-distance-fix.md`) had a Phase 5 "docs update" commitment that never landed in the PR diff; this plan discharges that commitment through the Diataxis lens.
- Language follows CLAUDE.md §1 — docs are in English, matching existing `cookbook.md` and the repo-wide convention for generated source and docs.

## What We're NOT Doing

- Documenting any files in `.claude/skills/10x-tdd*` or the iteration-1 eval artifacts — those are internal tooling evaluation artifacts, not product.
- Documenting `thoughts/shared/reviews/*` or other process artifacts — those are planning/post-mortem internal notes.
- Documenting `projects/edu-platform/.ai/10x-devs/game/cookbook.md` as a whole (only the NPC section is touched); the rest of the cookbook is unrelated to PR #151.
- Writing a tutorial document — Diataxis tutorials are learning-by-doing from scratch; the audience here already knows the `explorers/` system and is reading docs to apply or extend it. If the onboarding need surfaces later, it's a separate plan.
- Creating a new top-level `docs/` folder. New files live alongside `cookbook.md` under the established `.ai/10x-devs/game/` path.
- Translating any docs to Polish. Internal dev docs follow the English convention in CLAUDE.md §1.
- Adding a link-lint script. Citation validation in Phase 4 is a one-time manual spot-check, not an automated tool.

## Implementation Approach

Each of the first three phases produces one self-contained artifact (a new file or a bounded edit to an existing file). Writing is sequenced so that later phases can cross-link to earlier ones without forward references. Code samples are quoted from the codebase with `startLine:endLine:filepath` citations per CLAUDE.md §2, trimmed to the minimum illustrative slice so surrounding state does not leak into the doc. Phase 4 closes with a single sweep that applies the Diataxis skill's four validation checks and audits every citation.

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: This is a documentation plan. No runtime lifecycle, DOM mutation, or timing concerns apply.

### User Experience Specification

**When applicable — reader experience:**

- **Navigability**: Each new doc is findable from `cookbook.md` NPC section via an inline cross-link. Cookbook remains the entry point; the two new docs are destinations, not replacements.
- **Single-type discipline**: No how-to steps in the reference doc, no API tables in the explanation doc. Per Diataxis skill Step 3, cross-link rather than mix.
- **Lookup speed**: Reference doc must let a reader find a specific symbol (e.g., `ActorMovementBounds`) and read its contract in under 30 seconds. Reference uses a consistent per-symbol block: name → signature → parameters → returns → example → source citation.
- **Explanation depth**: State-machine doc leads with a transition diagram, follows with a constants table, and uses short per-state paragraphs (purpose, entry condition, exit condition) — no code walkthrough, no step-by-step instructions.

**Derived from**: User answers on placement (new files alongside cookbook), depth (diagram + constants table + minimal prose), and code sample sourcing (cited from codebase) + Diataxis type discipline in the skill.

### Performance & Optimization Strategy

**N/A**: Documentation has no runtime performance surface.

### State Management Sequencing

**N/A**: No application state involved in writing docs.

### Debug & Observability Plan

**Required for all features — applied to docs:**

- **Verification Method**: Phase 4 runs the four Diataxis validation checks (one per doc type) from `/Users/admin/.claude/skills/documentation/SKILL.md` Step 4 and audits every `startLine:endLine:filepath` citation against HEAD.
- **Logging Strategy**: N/A — docs produce no runtime logs.
- **Debug Instrumentation**: The only "debug surface" for docs is the citation audit: running `grep -n` or opening each cited file to confirm the line range still contains the claimed symbol.
- **Timing Debug**: N/A.
- **Metrics**: N/A — no usage metrics captured for internal dev docs.

**Derived from**: User choice of Diataxis + code-drift spot-check validation.

---

## Phase 1: Reference Doc — `movement-bounds.md`

### Overview

Create a reference document for the new `actorMovementBounds` public API. Target reader: an engine developer who knows the `explorers/` system and needs to look up a signature, parameter contract, or return shape.

### Changes Required:

#### 1. New reference document

**File**: `projects/edu-platform/.ai/10x-devs/game/movement-bounds.md`
**Changes**: New file. Structure per the Diataxis skill's reference pattern (name → type → default → description → example).

Document these entries, one block per entry, in this order:

1. `ActorPosition` — exported type. Fields (`x`, `y`), semantics (world-space pixel coordinates of the actor's anchor).
2. `ActorMovementBounds` — exported type. Fields (`width`, `height`, `tileSize`, `allowed: boolean[][]`), semantics (grid of walkable tiles relative to the map's tile dimensions).
3. `buildActorMovementBounds(collisionGrid, origin)` — function. Parameters (`collisionGrid: SpawnCollisionGrid`, `origin: ActorPosition`), algorithm summary (BFS flood-fill from the tile containing `origin`), return (`ActorMovementBounds`), failure mode (off-map origin returns bounds with no allowed tiles), and a cited usage slice from `GameScene.ts` showing bounds construction at spawn time.
4. `isActorPositionWithinBounds(bounds, position)` — function. Parameters, computation (derives actor body rectangle via player-body constants, checks all occupied tiles are allowed), return (`boolean`), edge case (body extending off-map returns `false`), and a cited usage slice from `NPC.ts` showing per-frame enforcement.

Use `startLine:endLine:filepath` citations per CLAUDE.md §2 for every code quotation. Include a short "See also" section at the bottom linking to `npc-behavior.md` (explanation of how NPCs use these bounds) and the NPC section of `cookbook.md`.

### Success Criteria:

#### Automated Verification:

- [x] File exists at `projects/edu-platform/.ai/10x-devs/game/movement-bounds.md`
- [x] All cited line ranges resolve at HEAD: for every `startLine:endLine:filepath` citation, `sed -n "${startLine},${endLine}p" <filepath>` shows the claimed symbol.
- [x] Markdown parses without broken links (relative links to `cookbook.md` and `npc-behavior.md` resolve). *Note: `npc-behavior.md` is a forward reference to Phase 2 and will resolve once that phase lands.*

#### Manual Verification:

- [x] A reader unfamiliar with the module can find any of the four documented symbols and read its contract in under 30 seconds (Diataxis reference validation).
- [x] No how-to steps or conceptual tangents present — reference discipline preserved.
- [x] Every parameter, return, and failure mode documented matches the source.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Explanation Doc — `npc-behavior.md`

### Overview

Create an explanation document for the NPC movement state machine introduced in this PR. Target reader: an engine developer or a curious content author who wants to understand the "why" — how the four states interact, what the timer constants control, and how external calls (`freeze`, `unfreeze`, `faceTowards`) fit into the machine.

### Changes Required:

#### 1. New explanation document

**File**: `projects/edu-platform/.ai/10x-devs/game/npc-behavior.md`
**Changes**: New file. Structure per the Diataxis skill's explanation pattern (context → core concept → alternatives/trade-offs → higher-level perspective).

Sections:

1. **Context** — one short paragraph framing the problem: NPCs in the explorer game must wander within wall-connected regions, recover cleanly when wall-blocked, and pause politely during dialogue. The four-state machine is the minimal design that handles these cases without oscillation.
2. **State diagram** — ASCII or Mermaid transition diagram covering the four states (`wandering`, `idle`, `wallRecovery`, `frozen`) and the transitions between them. Emphasize that `frozen` is an external override; the other three are the natural wander cycle.
3. **States** — one short paragraph per state: purpose, entry condition, exit condition. No code.
4. **Timer constants** — reference-style table listing each named constant, its value, its role, and a citation to the definition line in `NPC.ts`. Constants in scope:
   - `NPC_SPEED`
   - `NPC_WALL_BLOCKED_GRACE_MS`
   - `NPC_WALL_RECOVERY_MIN_MS`
   - `NPC_WALL_CLEAR_STABLE_MS`
   - `NPC_IDLE_CHANCE`
   - `NPC_IDLE_DURATION_MIN`
   - `NPC_IDLE_DURATION_MAX`
   - `NPC_IDLE_AFTER_UNFREEZE_MS`
5. **External control surface** — short paragraph on `freeze()`, `unfreeze()`, and `faceTowards(targetX, targetY)` — what they mean semantically (not an API reference; the cookbook and source are the reference), and how they interact with the machine (e.g., `unfreeze()` enters a controlled idle before resuming wander, not an immediate jump back to `wandering`). Cite the GameScene interaction site that calls `faceTowards` on dialogue entry.
6. **Trade-offs & why-not alternatives** — one short paragraph: why not a single "blocked" flag (oscillates), why not omnidirectional block detection (false positives when the NPC is brushing a wall parallel to travel), why the grace + stable window pair (debounces transient collider noise).
7. **See also** — links to `movement-bounds.md` (reference) and the NPC section of `cookbook.md` (how-to for authors).

Per CLAUDE.md §2, cite every line range quoted or referenced in the table.

### Success Criteria:

#### Automated Verification:

- [x] File exists at `projects/edu-platform/.ai/10x-devs/game/npc-behavior.md`
- [x] All cited line ranges resolve at HEAD.
- [x] Markdown parses without broken links.

#### Manual Verification:

- [x] After reading, a reader can explain the four states and the rationale for the grace-plus-stable window in their own words (Diataxis explanation validation).
- [x] No step-by-step instructions or full API tables — explanation discipline preserved; reference material lives only in the constants table, which is factual by nature and cross-linked from the source.
- [x] Diagram accurately reflects transitions in `projects/edu-platform/src/explorers/entities/NPC.ts`.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: How-to Update — Cookbook NPC Section

### Overview

Refresh the NPC section of `cookbook.md` so that content authors see the current behavior and constructor contract, and add cross-links to the two new documents. Target reader: a content author using the how-to to add or wire NPCs.

### Changes Required:

#### 1. Cookbook NPC section refresh

**File**: `projects/edu-platform/.ai/10x-devs/game/cookbook.md`
**Changes**: Scoped edits to the NPC section (roughly lines 379–519 at HEAD; exact range to be confirmed during implementation). No changes elsewhere in the file.

Update items:

- **Speed**: Replace any mention of configurable NPC speed or the removed `speed` constructor parameter with the current standardized value (`NPC_SPEED = 80`, ~1.25× tile size). Cite the constant.
- **Constructor signature**: Document that NPCs now accept an `ActorMovementBounds` and do not accept a `speed` argument. Cross-link to `movement-bounds.md`.
- **Idle behavior**: Add a short paragraph describing that NPCs intermix wander and idle phases — a content author should not be surprised when an NPC stands still briefly.
- **Wall-recovery**: Add a short paragraph on the wall-recovery state so authors know why an NPC that hits a wall pauses briefly before resuming.
- **Depth / Y-sorting**: Document that NPC depth is computed as `DEPTH.PLAYER + y / 1000` so that vertical ordering with the player and other Y-sorted entities is predictable.
- **Cross-links**: At the start or end of the NPC section, add a "See also" line pointing to `movement-bounds.md` and `npc-behavior.md`.

Preserve Diataxis how-to discipline: the cookbook is task-oriented, so the updates describe what the author does and what the author observes — not the internals. The internals live in the explanation doc.

### Success Criteria:

#### Automated Verification:

- [x] `projects/edu-platform/.ai/10x-devs/game/cookbook.md` diff is scoped to the NPC section (no edits elsewhere).
- [x] All new citations resolve at HEAD.
- [x] Both new relative links (`./movement-bounds.md`, `./npc-behavior.md`) resolve.

#### Manual Verification:

- [x] An experienced content author can place an NPC, wire a dialogue, and understand the new behavior (speed, idle, wall-recovery, Y-sort) without reading source (Diataxis how-to validation).
- [x] No explanation-style "why" digressions in the cookbook edits — those belong in `npc-behavior.md`.
- [x] Existing cookbook structure and tone preserved (compare surrounding sections for voice consistency).

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Validation Pass

### Overview

Run the Diataxis skill's four validation checks across the three artifacts from Phases 1–3, audit every `startLine:endLine:filepath` citation, and fix any defects found. No new docs are created in this phase.

### Changes Required:

#### 1. Diataxis validation

For each doc, apply the matching Step 4 check from `/Users/admin/.claude/skills/documentation/SKILL.md`:

- `movement-bounds.md` — reference: a reader can find a specific fact (e.g., the parameters of `buildActorMovementBounds`) in under 30 seconds.
- `npc-behavior.md` — explanation: after reading, a reader can explain the state machine and the rationale for the grace + stable window pair in their own words.
- `cookbook.md` NPC section — how-to: an experienced author can complete "add an NPC with a dialogue" without backtracking.
- (Tutorial check — N/A, no tutorial produced.)

Record the outcome of each check in a short validation note committed inside the PR description or as a comment block at the top of each doc (the note can be removed before merge if preferred — ask the reviewer).

#### 2. Citation audit

For every `startLine:endLine:filepath` citation in the three docs, verify the slice at that range in the current working tree still contains the claimed symbol. If a line has drifted, update the citation. Catch drift caused by any late edits between Phase 1 and Phase 4.

A simple shell sweep is acceptable:

```
grep -rhoE '[0-9]+:[0-9]+:[^ )]+' projects/edu-platform/.ai/10x-devs/game/movement-bounds.md projects/edu-platform/.ai/10x-devs/game/npc-behavior.md
```

then spot-check each result by opening the referenced file range.

#### 3. Defect fixes

Apply edits to fix any validation or citation defects surfaced above. Stop only when all four automated checks pass.

### Success Criteria:

#### Automated Verification:

- [x] Every cited line range in the three artifacts resolves to a line containing the claimed symbol at HEAD. (14/14: 8 block-code + 6 inline.)
- [x] Both new docs and the cookbook diff lint cleanly (no broken links, no orphan headings).
- [x] `git diff` on the three target files shows only the intended changes. (cookbook: 27/2 lines, three hunks in NPC section only.)

#### Manual Verification:

- [x] Each Diataxis validation check for each doc type was performed and documented. (Reference: 30-s lookup; Explanation: reader-summary; How-to: author-can-complete; Tutorial: N/A.)
- [x] Any defects surfaced were fixed (or explicitly noted and deferred with a reason). *None surfaced.*
- [x] A reviewer reading all three docs end-to-end finds them consistent in terminology and cross-link targets. (State names, symbol names, and cross-link graph verified.)

**Implementation Note**: Phase 4 is the final gate before declaring the docs done. If defects surface that require structural changes, loop back to the relevant Phase (1, 2, or 3) rather than patching in this phase.

---

## Testing Strategy

### Unit Tests:

- **N/A for prose**. No code is produced by this plan.

### Integration Tests:

- **N/A**. Integration here means the cross-link graph between the three docs; validated manually in Phase 4.

### Manual Testing Steps:

1. Open `movement-bounds.md` fresh. Locate the signature of `buildActorMovementBounds`. Verify: under 30 seconds from open to signature-visible.
2. Open `npc-behavior.md` fresh. Read end-to-end. Verify: you can summarize the four states and the grace-plus-stable rationale without rereading.
3. Open `cookbook.md` NPC section fresh. Simulate "add an NPC with a dialogue and bounds" using only the cookbook text. Verify: no need to fall back to source.
4. From each doc, click every cross-link. Verify: all resolve and land on the right section.
5. For every `startLine:endLine:filepath` citation, open the file and verify the slice contains the claimed symbol.

## Performance Considerations

**N/A**. Documentation-only plan.

## Migration Notes

**N/A**. No existing public docs are removed; the cookbook section is updated in place and the two new files are additive. Readers with bookmarks into `cookbook.md` continue to find the NPC section at the same anchor.

## References

- Documentation skill: `/Users/admin/.claude/skills/documentation/SKILL.md`
- PR: https://github.com/przeprogramowani/przeprogramowani-sites/pull/151
- Branch: `test/impl-review-pr151`
- Existing doc hub: `projects/edu-platform/.ai/10x-devs/game/cookbook.md`
- Original implementation plan (internal): `projects/edu-platform/thoughts/shared/plans/2026-04-22-wall-collision-npc-distance-fix.md`
- Original research (internal): `projects/edu-platform/thoughts/shared/research/2026-04-22-wall-collision-npc-distance-feedback.md`
- New module source: `projects/edu-platform/src/explorers/state/actorMovementBounds.ts`
- NPC source: `projects/edu-platform/src/explorers/entities/NPC.ts`
- Integration point: `projects/edu-platform/src/explorers/scenes/GameScene.ts`

<!-- PLAN COMPLETED: 2026-04-23 -->
