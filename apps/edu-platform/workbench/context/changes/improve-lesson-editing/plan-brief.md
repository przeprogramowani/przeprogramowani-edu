# Improve the Lesson Draft/Edit/Review Flow — Plan Brief

> Full plan: `context/changes/improve-lesson-editing/plan.md`
> Research: `context/changes/improve-lesson-editing/research.md`

## What & Why

The lesson pipeline (`lesson-spec → lesson-grounding → lesson-draft → lesson-editor-pl → lesson-rc-review`) still leaves three pains the user fixes by hand: filler / redundant narrative figures, over-forced inter-lesson and inter-section continuity, and half-introduced concepts (named but not explained). The research showed these are not random misses — they are **structurally produced and then structurally rewarded**: every stage applies additive forces (more continuity, more claims, more voice) with almost no subtractive force, and the final gate scores additive properties as virtues. The subtractive rules that exist live in one place each, in divergent phrasing, with no shared contract — so they "don't work as a whole."

## Starting Point

Five skills, each mirrored across `.claude/` (Claude) and `.agents/` (Codex) trees, with pre-existing `.agents` drift. Anti-filler exists only as scattered bullets in `lesson-editor-pl`; continuity is mandated upstream (unconditional bridges, per-section transition contract) and rewarded downstream (rc-review's promise ledger / reorder test, with a *missing* bridge escalating to Blocker); concept tracking checks *ordering* ("introduced before used") at three points but never *adequacy* ("what is this + why now"). `style.md` even prescribes "3–4 casual asides per article" with no value filter. Reference files (`style.md`, `lesson-structure.md`) are single-source; only the skills are dual-tree.

## Desired End State

One `references/editorial-contract.md` is the single source of truth for three rules — Editorial Economy, Concept-Introduction Adequacy, Continuity-Earns-Its-Place — cited by all five skills. The editor owns a systematic economy sweep; rc-review is a rebalanced backstop that can flag too-much (over-narration, filler) as well as too-little, judges concepts for adequacy, and demotes missing-bridge from auto-Blocker to a judged finding. A re-run on m5-l4 cuts the documented filler, flags the un-introduced concepts (OIDC / Ed25519 / OpenAPI 3.1), and stops rewarding manufactured pre-announcements.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Where the new rules live | New `references/editorial-contract.md`, single-source | One definition inherited everywhere fixes the divergent-phrasing root cause | Plan |
| Continuity counter-weight | Symmetric "earn its place" + conditional bridges | Kills forced narration without disconnecting lessons | Plan |
| Concept-adequacy enforcement | One definition, three touchpoints (spec field, draft self-review, rc-review ledger) | Reuses existing ordering checks, re-pointed to adequacy | Plan |
| `style.md` asides rule | Keep target, add a value filter | Preserves house voice while removing payload-free filler | Plan |
| Economy owner | Editor primary + review backstop | Subtraction happens where prose is fixed; review catches misses | Plan |
| rc-review severity | Condition the missing-bridge Blocker + add inverse findings | Symmetric rubric stops rewarding the trimmed behaviors | Plan |
| Drift handling | Heal `.agents` first (Phase 0) | New rules land on a clean, identical baseline | Plan |
| Verification | Re-run on **m5-l4 only** | Concrete, fast, tests the documented failures on the live draft | Plan |

## Scope

**In scope:** new `editorial-contract.md`; `style.md` value filter + iteration bump; enforcement hooks in all five SKILL.md (both trees); editor-pl stale-path fix; `.agents` drift heal; m5-l4 verification.

**Out of scope:** the `eval-lesson-flow` / `10x-evals` harness; re-running m1-l5 / m4-l4; `lessons-schema.json` / JSON schema changes; `src/content*`; curriculum order; wholesale `style.md` rewrite; deleting bridges or the Coherence-And-Flow Pass.

## Architecture / Approach

Single-source the cross-cutting rules in one contract file, then wire thin per-skill enforcement hooks that reference it. Economy gets one owner (editor) + one backstop (review); concept-adequacy reuses the three existing ordering checks, re-pointed to adequacy, all citing the same definition; continuity gets a symmetric upstream counter-rule and a rebalanced downstream severity model. Heal drift first, author the lever files, edit skills grouped by file for clean paired diffs, mirror to `.agents`, verify on m5-l4.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 0. Baseline reconciliation | Identical trees; stale path gone | Sync overwrites a runtime-specific block |
| 1. Author shared contracts | `editorial-contract.md` + `style.md` value filter | Vague rules that don't enforce |
| 2. Upstream skills | spec adequacy field + conditional continuity; grounding use-silently | Conditional bridges read as "drop all bridges" |
| 3. Production skills | draft self-review + editor Economy Pass (owner) | Economy Pass too vague; voice flattening |
| 4. Gate skill | rc-review payload scoring, adequacy ledger, severity rebalance | Removing the Blocker weakens needed continuity |
| 5. Mirror & verify | `.agents` synced; m5-l4 re-run diff | Over-correction makes m5-l4 choppy |

**Prerequisites:** clean working tree awareness (m5-l4 draft is currently uncommitted — snapshot before verifying); `skill-sync` available.
**Estimated effort:** ~1–2 sessions across 6 phases (mostly prose edits + one new reference file + one verification re-run).

## Open Risks & Assumptions

- **Over-correction**: the continuity counter-weight could swing toward choppy, disconnected lessons — m5-l4 must still read as a connected whole.
- **Voice flattening**: the asides value filter must keep informative asides, not strip the house voice.
- **n=1 verification**: m5-l4 is both evidence and test subject — risks overfitting; not a model-generalization test (accepted trade-off).
- **Single-definition discipline**: concept-adequacy must stay defined only in the contract; restating it per skill would re-create diffuse ownership.

## Success Criteria (Summary)

- A re-run of editor → review on m5-l4 cuts or flags the three documented filler instances, flags OIDC / Ed25519 / OpenAPI 3.1 for adequacy, and no longer logs manufactured pre-announcements as PAID virtues.
- Net hand-editing on m5-l4's three pain classes is visibly lower than the research baseline.
- Both runtime trees are identical for shared payload; every skill cites the one contract.
