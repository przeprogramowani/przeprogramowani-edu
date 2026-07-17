# PR #151 Diataxis Documentation — Plan Brief

> Full plan: `thoughts/shared/plans/2026-04-23-pr151-diataxis-docs.md`

## What & Why

Document the wall-collision and NPC-movement changes from PR #151 using the Diataxis framework. The original implementation plan committed to a "Phase 5 docs update" that never shipped in the PR diff; this pass discharges that commitment while giving both engine developers and content authors the material they need.

## Starting Point

The explorers/game docs live in a single 1465-line `cookbook.md` (mixed how-to + reference). Its NPC section does not yet reflect the new behavior: standardized 80 px/s speed, idle phases, wall-recovery state, Y-sorted depth, or the `ActorMovementBounds` constructor argument. A new module `actorMovementBounds.ts` (BFS flood-fill + body containment) is shipped without any prose documentation, and the four-state NPC machine is only discoverable by reading source.

## Desired End State

Two new documents sit alongside `cookbook.md`: a reference for the `actorMovementBounds` module and an explanation for the NPC state machine. The cookbook's NPC section is refreshed for the current behavior and cross-links to both. An engine developer can look up the module's API in under 30 seconds; a content author can place and wire an NPC using only the cookbook; a curious reader can understand why the state machine exists as it does.

## Key Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Audience | Both content authors and engine devs | Both groups are affected — authors see behavior changes, devs touch the API. |
| Diataxis type mix | Reference + Explanation + How-to update | Covers factual API surface, conceptual state machine, and author-facing task — all three are needed; no tutorial, since readers already know the system. |
| Out of scope | TDD skill artifacts and internal review files | Those are tooling/process artifacts, not product docs. |
| Placement | New files under `.ai/10x-devs/game/` alongside cookbook | Preserves Diataxis type separation without fragmenting discovery; no new doc root invented. |
| State-machine depth | Transition diagram + constants table + minimal prose | Diagrams carry state machines better than prose; constants table is reference-grade and resists rot. |
| Code sample sourcing | Quoted from the codebase with `startLine:endLine:filepath` citations | Honors CLAUDE.md §2 convention and gives readers a click-through to truth. |
| Language | English | Matches CLAUDE.md §1 and existing cookbook. |
| Validation | Diataxis 4-check + citation-drift spot-check | Catches both editorial defects and code-drift; the two ways docs go wrong. |

## Scope

**In scope:**
- New reference doc `movement-bounds.md` covering `ActorPosition`, `ActorMovementBounds`, `buildActorMovementBounds`, `isActorPositionWithinBounds`.
- New explanation doc `npc-behavior.md` covering the four-state machine, timer constants, and external control surface (`freeze` / `unfreeze` / `faceTowards`).
- Scoped update to the cookbook NPC section for speed, idle, wall-recovery, Y-sort, and constructor signature.
- Cross-links and a validation pass.

**Out of scope:**
- TDD skill artifacts, iteration-1 eval outputs, internal reviews, post-mortems.
- Tutorial-style onboarding content.
- A new top-level `docs/` folder.
- Polish translation.
- Any change to runtime code.

## Architecture / Approach

Three artifacts, one validation sweep. Phases 1 and 2 write the two new files; Phase 3 amends the cookbook NPC section and wires cross-links; Phase 4 applies the Diataxis skill's type-specific validation checks and audits every code citation. Writing is sequenced forward-only — later phases can link to earlier ones without forward references. Every code quotation carries a `startLine:endLine:filepath` citation per CLAUDE.md §2, trimmed to the minimum illustrative slice.

## Phases at a Glance

| Phase | What it delivers | Key risk |
|-------|-----------------|----------|
| 1. Reference — `movement-bounds.md` | New file documenting the module's two exported types and two functions, with cited real-usage slice from `GameScene.ts`. | Citations drift if NPC or GameScene lines move before Phase 4; Phase 4 audit catches this. |
| 2. Explanation — `npc-behavior.md` | New file with transition diagram, per-state prose, timer constants table, and external-control-surface note. | Diagram slipping out of sync with source if the state machine is refactored; audited in Phase 4. |
| 3. How-to update — cookbook NPC section | Scoped edits for speed, idle, wall-recovery, Y-sort, new constructor signature, plus cross-links to phases 1 and 2. | Accidentally bleeding "why" content into a how-to section; Diataxis validation catches this. |
| 4. Validation pass | Diataxis 4-check + citation audit; defects fixed. | Structural defects force a loop back to earlier phase; planned for explicitly. |

**Prerequisites:** Access to branch `test/impl-review-pr151` (checked out); familiarity with `projects/edu-platform/src/explorers/` source; `/Users/admin/.claude/skills/documentation/SKILL.md` available.
**Estimated effort:** ~1–2 sessions; low-risk, prose-only work with a final validation sweep.

## Open Risks & Assumptions

- Line numbers in `NPC.ts` and `GameScene.ts` are assumed stable for the duration of this plan; if the PR branch receives further rebases, Phase 4 audit must re-run.
- Assumption that no Polish translation is expected for internal dev docs; revisit if the cookbook ever becomes learner-facing.
- Assumption that `cookbook.md` NPC section boundaries (roughly 379–519) are accurate at plan start; exact range is re-confirmed during Phase 3.

## Success Criteria (Summary)

- An engine dev finds any documented `actorMovementBounds` symbol and reads its contract in under 30 seconds.
- A reader of `npc-behavior.md` can summarize the four states and the grace-plus-stable rationale in their own words.
- A content author can add a new NPC with dialogue and bounds using only the cookbook, without falling back to source.
