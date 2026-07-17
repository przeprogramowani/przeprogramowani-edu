# Improve the Lesson Draft/Edit/Review Flow Implementation Plan

## Overview

The lesson pipeline `lesson-spec → lesson-grounding → lesson-draft → lesson-editor-pl → lesson-rc-review` still leaves three pains the user fixes by hand: (1) filler / redundant narrative figures, (2) over-forced inter-lesson and inter-section continuity, (3) half-introduced concepts (named but not explained "what + why-now").

The research (`context/changes/improve-lesson-editing/research.md`) established that these are **structurally produced and then structurally rewarded**: every stage applies *additive* forces (more continuity, more claims, more voice) with almost no *subtractive* force, and `lesson-rc-review` scores additive properties (asides, resolved forward-refs, present-but-shallow concepts) as virtues. The subtractive rules that exist live in one place each, in divergent phrasing, with no shared contract — so they don't compose ("doesn't work as a whole").

The fix introduces a **single-source editorial contract** referenced by all five skills, adds a **value filter** to the style-guide rule that manufactures filler, names **one owner** for economy (the editor) and **one rebalanced gate** (rc-review), and upgrades concept tracking from an *ordering* test to an *adequacy* test at three existing touchpoints — without re-creating the diffuse-ownership problem.

## Current State Analysis

What exists now (verified against the live files, not just research):

- **Five skills, dual-tree.** Each skill exists in `.claude/skills/<name>/SKILL.md` (Claude) and `.agents/skills/<name>/SKILL.md` (Codex). Shared payload (`SKILL.md`, `references/**`, `scripts/**`, `assets/**`) is mirrored via `python3 .agents/skills/skill-sync/scripts/sync_skills.py --skill <name> --from claude|codex --write`; `agents/**` and hidden files are runtime-specific.
- **`.agents` drift predates this work.** Line-count probe: `lesson-editor-pl` (.claude 374 / .agents 346) and `lesson-rc-review` (.claude 260 / .agents 267) differ materially; `lesson-spec` (374/372) slightly; `lesson-draft` (375/375) and `lesson-grounding` (221/221) match on count but research reports body divergence (the 2026-06-03 `lesson-context.mjs` wiring landed in `.claude` only). `.claude` is the correct baseline.
- **`workbench/references/` files are single-source (NOT dual-tree).** `style.md` (533 lines) and `lesson-structure.md` (101 lines) live once and are read directly by skills. A new `references/editorial-contract.md` will be single-source too. This means **only the five `SKILL.md` edits need `skill-sync`**; the reference files do not.
- **Who references what today** (grep-verified): `style.md` is referenced by `lesson-draft`, `lesson-editor-pl`, `lesson-rc-review` only. `lesson-structure.md` is referenced by `lesson-editor-pl` only. **`lesson-spec` and `lesson-grounding` reference neither** — wiring them to the new contract requires adding a Required-Context line, not editing an existing one.
- **Economy lives weakly in one place.** `lesson-editor-pl/SKILL.md:76-87` ("Remove or rewrite" list, includes `filler like "warto zauważyć"…` and `repeated claims already made in nearby sections`), `:160` ("merge repeated beats"), and `:284-296` (Voice Pass, one "cut filler" bullet). No systematic redundancy sweep; nothing in `lesson-draft`; nothing in spec/grounding.
- **Continuity is manufactured upstream, rewarded downstream.** `lesson-spec/SKILL.md:10` ranks continuity second; `:299-304` mandates a per-section transition contract; `:310`/`:314` are unconditional Bridge In / Bridge Out. `lesson-rc-review/SKILL.md:72-97` (mandatory Coherence-And-Flow Pass) builds a promise ledger that scores resolved forward-refs as "PAID", a reorder test that defines missing connective tissue as a defect, and arc-integrity rules. A *missing* bridge can escalate to Blocker; there is **no inverse over-narration finding**.
- **Concept tracking checks ordering, not adequacy.** `lesson-spec/SKILL.md:272` logic-map field is `Introduces:` (names the concept). `lesson-draft/SKILL.md:321` self-review = "every new concept is introduced before it is used" (ordering). `lesson-rc-review/SKILL.md:89` dependency ledger records concepts "at first use and check it was introduced … before that point" (ordering/provenance). None asks "does this line say what it is and why it matters now?"
- **`style.md` manufactures pain #1.** `style.md:88-104` prescribes "3–4 casual asides + humor + rhetorical questions per article" with no value filter; `style.md:7` is the iteration counter (currently 3).
- **`lesson-grounding`** hands the drafter `Claims To Support` (`:133`) and per-source `Use in lesson:` (`:147`) with no rule that a source may be used *silently* to get a fact right — so thin claims become shallow name-drops (e.g. m5-l4 "OIDC", "Ed25519", "OpenAPI 3.1").
- **Known defect:** `lesson-editor-pl/SKILL.md:353` carries a stale hardcoded path `/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/workbench/.claude/skills/lesson-rc-review/SKILL.md`.

## Desired End State

After this plan:

- A single `references/editorial-contract.md` is the source of truth for three cross-cutting rules: **Editorial Economy**, **Concept-Introduction Adequacy**, **Continuity Earns Its Place**. All five skills cite it.
- `style.md`'s asides rule carries a value filter; the rule and rc-review's Editorial Quality dimension stop rewarding payload-free asides.
- `lesson-editor-pl` is the explicit **owner** of a systematic economy/redundancy sweep; `lesson-rc-review` is the **backstop** with an economy finding.
- Continuity is balanced: bridges and per-section transitions are conditional upstream; rc-review demotes missing-bridge from automatic Blocker to a judged finding and gains an over-narration finding and a reorder-test inverse.
- Concept adequacy is enforced at three touchpoints (spec field, draft self-review, rc-review ledger) from **one** shared definition; grounding gains a "use silently" rule.
- Both runtime trees are identical for shared payload; the editor-pl stale path is gone.
- A re-run of `lesson-editor-pl` → `lesson-rc-review` on **m5-l4** measurably reduces the documented filler, flags the un-introduced concepts, and no longer logs manufactured pre-announcements as virtues.

**Verification of end state:** `references/editorial-contract.md` exists; `skill-sync` reports no pending diff for all five skills; grep confirms each skill references the contract and the stale path is gone; the m5-l4 re-run diff shows the specific pain instances from research are now caught or cut.

### Key Discoveries:

- Reference files are single-source — `skill-sync` is only needed for the five `SKILL.md` edits (`references/style.md` proves the single-source precedent).
- `lesson-spec` and `lesson-grounding` don't currently read `style.md` or `lesson-structure.md`; they need a *new* Required-Context reference to the contract (`lesson-spec/SKILL.md:12-19` Required Context block; `lesson-grounding` equivalent).
- The surface area for pain #3 already exists (`lesson-spec/SKILL.md:272`, `lesson-draft/SKILL.md:321`, `lesson-rc-review/SKILL.md:89`) — it is wired to *ordering*; the fix re-points it to *adequacy* without new machinery.
- The continuity counter-weight must be **symmetric**, not a removal: "continuity must earn its place" paired with the existing "introduced before used" (research Architecture Insights).

## What We're NOT Doing

- **Not** building or running the dormant `eval-lesson-flow` / `10x-evals` harness (out of scope; verification is a targeted m5-l4 re-run only).
- **Not** re-running the pipeline on m1-l5 or m4-l4 — verification is **m5-l4 only** (user decision).
- **Not** modifying `lessons-schema.json` or `schemas/lessons-schema.schema.json` — the `Introduces` field lives in the spec skill's logic-map template (`lesson-spec/SKILL.md`), not the JSON schema. No new JSON schema concepts.
- **Not** touching `src/content*` or any platform/publishing files.
- **Not** changing curriculum order or lesson sequence.
- **Not** rewriting `style.md` wholesale — only the asides rule (`:88-104`) gains a value filter plus the iteration bump and a pointer to the new contract.
- **Not** deleting bridges or the Coherence-And-Flow Pass — continuity gets a counter-weight and rebalanced severity, not removal.

## Implementation Approach

Single-source the cross-cutting rules, then wire thin enforcement hooks per skill. The contract file states each rule once (with before/after examples so it is enforceable, not aspirational); each skill references it and adds the minimal stage-specific enforcement step. Economy gets one owner (editor) + one backstop (review). Concept-adequacy reuses the three existing ordering checks, re-pointed to adequacy, all citing the same definition. Continuity gets a symmetric counter-rule upstream and a rebalanced severity model downstream.

Order: heal drift to a clean identical baseline first (so new rules don't land on stale scaffolding), author the shared lever files (contract + style.md), then edit skills grouped by file (upstream → production → gate) for clean paired diffs, then mirror to `.agents` and verify on m5-l4.

## Critical Implementation Details

- **Sync direction is claude→codex.** `.claude` carries the 2026-06-03 `lesson-context.mjs` update the `.agents` copies missed. Phase 0 must confirm each diff is the expected drift before `--write`, and must fix the editor-pl stale path in `.claude` *before* syncing so the bug is not propagated.
- **Reference files are single-source.** Do not attempt to mirror `references/editorial-contract.md` or `references/style.md` into `.agents` — they are read by path and live once.
- **One definition, three touchpoints — keep the definition single.** The concept-adequacy wording must live in `editorial-contract.md` only; spec/draft/rc-review reference it rather than restating it, or the diffuse-ownership problem returns.
- **Verification ordering is fixed:** `lesson-editor-pl` runs first, then `lesson-rc-review` — never in parallel (established workflow; see `MEMORY.md`). m5-l4's draft is currently uncommitted (`M lessons/m5-l4/lesson-draft.md`); snapshot it before the re-run so the diff is meaningful.

---

## Phase 0: Baseline Reconciliation

### Overview

Heal pre-existing `.agents` drift so both trees start identical, and remove the editor-pl stale path, before any new rule lands.

### Changes Required:

#### 1. Fix the editor-pl stale path (prerequisite to sync)

**File**: `.claude/skills/lesson-editor-pl/SKILL.md` (around `:353`)

**Intent**: Replace the hardcoded `/Users/psmyrdek/dev/…/lesson-rc-review/SKILL.md` path in the "Next step" handoff with a portable relative/skill reference, so syncing claude→codex doesn't propagate a machine-specific bug.

**Contract**: The handoff text in the `## Final Summary` "Next step" block must name the RC review step without an absolute filesystem path (e.g. "move to RC review with the `lesson-rc-review` skill"). No other behavior changes.

#### 2. Reconcile all five skills to one baseline

**File**: `.agents/skills/{lesson-draft,lesson-editor-pl,lesson-spec,lesson-grounding,lesson-rc-review}/SKILL.md`

**Intent**: Bring each `.agents` SKILL.md to parity with its `.claude` counterpart for shared payload, preserving the Codex-runtime-specific blocks the sync tool already excludes.

**Contract**: For each skill, run `sync_skills.py --skill <name> --from claude` in diff mode, confirm the diff is only the expected drift (missing `lesson-context.mjs` wiring, the editor-pl cross-reference block, the stale-path fix from change #1), then re-run with `--write`. After all five, a diff pass reports no pending shared-payload differences.

### Success Criteria:

#### Automated Verification:

- [ ] No stale path remains: `grep -rn "psmyrdek" .claude/skills .agents/skills` returns nothing.
- [ ] `skill-sync` reports clean for all five: `for s in lesson-draft lesson-editor-pl lesson-spec lesson-grounding lesson-rc-review; do python3 .agents/skills/skill-sync/scripts/sync_skills.py --skill $s --from claude; done` shows no pending shared-payload diff.

#### Manual Verification:

- [ ] Spot-check each synced `.agents/SKILL.md`: the Codex-runtime block is intact and only the intended drift was reconciled (no accidental loss of runtime-specific content).

**Implementation Note**: After automated verification passes, pause for human confirmation that the synced `.agents` copies look correct before proceeding.

---

## Phase 1: Author Shared Contracts

### Overview

Create the single-source editorial contract and add the value filter to the style-guide rule that manufactures filler.

### Changes Required:

#### 1. Create the editorial contract

**File**: `workbench/references/editorial-contract.md` (new)

**Intent**: One source of truth for the three cross-cutting rules, written with short before/after examples so each is enforceable rather than aspirational. This is the structural answer to "doesn't work as a whole."

**Contract**: Three named sections:
1. **Editorial Economy** — every sentence earns its place; no verbatim/near-verbatim restatement of a nearby point; asides must carry information or set up a later payoff; merge repeated beats. Names `lesson-editor-pl` as owner and `lesson-rc-review` as backstop.
2. **Concept-Introduction Adequacy** — at a concept's first substantive use, the text must state *what it is* and *why it matters now*; ordering ("introduced before used") is necessary but not sufficient. Includes the grounding-facing note: a source may be used silently to get a fact right; do not surface every claim as a shallow name-drop, and flag any claim too thin to introduce adequately.
3. **Continuity Earns Its Place** — continuity serves clarity; a clean, labeled topic switch is acceptable; do not manufacture transitions between independently-clear sections; bridges are conditional. Stated symmetrically with "introduced before used."

Keep the file short and example-driven (mirror the `style.md` rule format: Rule → Before → After → How to apply).

#### 2. Add a value filter to the asides rule

**File**: `workbench/references/style.md` (`:88-104`, plus `:7` and the Application Checklist `:504`)

**Intent**: Keep the house voice but stop the rule from manufacturing a quota of payload-free asides, and cross-link the economy contract.

**Contract**: The asides rule keeps the 3–4 target but adds: every aside must carry information or set up a later payoff; cut payload-free asides. Application-checklist item #2 (`:504`) gets the same qualifier. Bump `Iteration:` (`:7`) to 4 and update `Last updated`. Add a one-line pointer to `references/editorial-contract.md` for the economy rule.

### Success Criteria:

#### Automated Verification:

- [ ] `references/editorial-contract.md` exists and contains the three section headings (Economy, Concept-Introduction Adequacy, Continuity).
- [ ] `style.md` iteration bumped: `grep -n "Iteration:" references/style.md` shows 4.
- [ ] `style.md` asides rule references the value filter: `grep -n "carry information\|payoff" references/style.md` matches.

#### Manual Verification:

- [ ] Each contract rule has a concrete before/after example a drafter/editor/reviewer could apply without re-deriving intent.
- [ ] The continuity rule reads as a balanced counter-weight, not a license to disconnect lessons.

**Implementation Note**: Pause for human confirmation that the contract wording is right before wiring skills to it (the wording propagates to five enforcement points).

---

## Phase 2: Upstream Skills (spec + grounding)

### Overview

Wire concept-adequacy and the continuity counter-weight into `lesson-spec`, and the use-silently rule into `lesson-grounding`. Both gain a Required-Context reference to the contract.

### Changes Required:

#### 1. lesson-spec — adequacy field, conditional continuity, contract reference

**File**: `.claude/skills/lesson-spec/SKILL.md`

**Intent**: Make the logic map demand concept adequacy, make continuity conditional rather than mandatory, and cite the contract.

**Contract**:
- Required Context block (`:12-19` area): add `workbench/references/editorial-contract.md`.
- Logic-map `Introduces:` field (`:272`): becomes `Introduces (what + why-now):` with a one-line gloss referencing the contract's adequacy rule.
- Per-section transition contract (`:299-304`): qualify so a transition is added only where it serves clarity, not mandated per section; a clean labeled topic switch is acceptable.
- Bridge In / Bridge Out (`:310`, `:314`): make conditional — include only when they add value; reference the continuity rule.
- Add one quality-bar item: "every new concept names what it is and why it matters now (not just introduced before use)."

#### 2. lesson-grounding — use-silently rule, contract reference

**File**: `.claude/skills/lesson-grounding/SKILL.md`

**Intent**: Stop the skill from implying every supported claim must become a surfaced sentence; allow silent use for factual correctness; flag claims too thin to introduce adequately.

**Contract**:
- Required Context: add `workbench/references/editorial-contract.md`.
- Near `Claims To Support` (`:133`) / per-source `Use in lesson:` (`:147`): add a note that a source may be used silently to get a fact right; do not require every claim to become a name-drop; flag claims too thin to introduce per the adequacy rule.

### Success Criteria:

#### Automated Verification:

- [ ] Both skills reference the contract: `grep -l "editorial-contract.md" .claude/skills/lesson-spec/SKILL.md .claude/skills/lesson-grounding/SKILL.md` lists both.
- [ ] Spec adequacy field present: `grep -n "why-now\|why now" .claude/skills/lesson-spec/SKILL.md` matches.

#### Manual Verification:

- [ ] The spec's conditional-bridge wording does not read as "drop all bridges" — continuity is still available when it serves clarity.
- [ ] The grounding use-silently rule is unambiguous about still requiring factual correctness.

**Implementation Note**: Pause for human confirmation before the production-skill phase.

---

## Phase 3: Production Skills (draft + editor-pl)

### Overview

Make the drafter check adequacy and economy at self-review, and turn the editor into the explicit owner of a systematic economy sweep with concept-adequacy in its structural pass.

### Changes Required:

#### 1. lesson-draft — adequacy + economy self-review, contract reference

**File**: `.claude/skills/lesson-draft/SKILL.md`

**Intent**: Upgrade the self-review from ordering-only to adequacy, add an economy check, and cite the contract.

**Contract**:
- Required Context: add `workbench/references/editorial-contract.md` (alongside the existing `style.md` reference).
- Self-Review step (`:308`, item at `:321`): keep "introduced before it is used" and add "and at first use states what it is and why it matters now" (reference the adequacy rule).
- Add a self-review economy item: write lean — no payload-free asides, no verbatim restatement of a nearby point; clean topic switches are acceptable where they read clearly.

#### 2. lesson-editor-pl — economy owner, adequacy in structural pass, continuity restraint

**File**: `.claude/skills/lesson-editor-pl/SKILL.md`

**Intent**: Name the editor the owner of a systematic redundancy/economy sweep (its natural subtractive role), add concept-adequacy to the structural pass, add a continuity-restraint check, and cite the contract.

**Contract**:
- Required Context (`:14-19`): add `workbench/references/editorial-contract.md`.
- Voice Pass (`:284-296`) / "Remove or rewrite" list (`:76-87`): promote the scattered filler bullets into a named **Economy Pass** that systematically sweeps for payload-free asides, verbatim/near-verbatim restatement across sections, and repeated beats (reference the economy rule). State that the editor owns economy.
- Structural / argument-architecture pass (`:249-272`): add an adequacy check — each new concept is introduced with what-it-is + why-now, not merely placed in order.
- Add a continuity-restraint check: do not manufacture transitions between independently-clear sections; a clean labeled topic switch is acceptable (reference the continuity rule).

### Success Criteria:

#### Automated Verification:

- [ ] Both skills reference the contract: `grep -l "editorial-contract.md" .claude/skills/lesson-draft/SKILL.md .claude/skills/lesson-editor-pl/SKILL.md` lists both.
- [ ] Editor names an Economy Pass / owner: `grep -ni "economy" .claude/skills/lesson-editor-pl/SKILL.md` matches.
- [ ] Draft self-review upgraded: `grep -n "why-now\|why it matters now" .claude/skills/lesson-draft/SKILL.md` matches.

#### Manual Verification:

- [ ] The Economy Pass is concrete enough to act on (names what to cut: payload-free asides, restatements, repeated beats), not a vague "cut filler".
- [ ] The continuity-restraint check coexists with the editor's existing "make transitions explicit" guidance without contradiction (explicit *where needed*, not everywhere).

**Implementation Note**: Pause for human confirmation before the gate phase.

---

## Phase 4: Gate Skill (rc-review)

### Overview

Rebalance the reviewer so it stops rewarding the three pains: payload-score asides, test concept *adequacy* not just ordering, add an economy backstop finding, and balance the missing-bridge severity with an over-narration finding and a reorder-test inverse.

### Changes Required:

#### 1. lesson-rc-review — payload scoring, adequacy ledger, economy finding, severity rebalance, contract reference

**File**: `.claude/skills/lesson-rc-review/SKILL.md`

**Intent**: Make the gate symmetric — it can now flag too-much (over-narration, filler) as well as too-little, and judges concept introductions for adequacy.

**Contract**:
- Required Context (`:14-19`): add `workbench/references/editorial-contract.md`.
- Editorial Quality dimension (`:110`) and its output section (`:193-197`): score asides on payload, not presence; add an over-narration / payload-free-aside finding and an economy (filler/redundancy) finding as backstop to the editor.
- Dependency ledger (`:89`) and Coherence-And-Flow output `Dependency gaps` (`:172`): upgrade from ordering/provenance to **adequacy** — a concept used is a finding if it is not introduced with what-it-is + why-now, even when it appeared earlier or is course vocabulary (reference the adequacy rule).
- Reorder test (`:94`): add the inverse — flag transitions manufactured between sections that are already independently clear; resolved forward-references are not automatically a virtue.
- Severity (`:115-124`) + Verdict Rules (`:235-246`): demote a *missing* bridge from automatic Blocker to a finding judged against "does this lesson need the bridge for clarity"; keep Blocker only where the lesson's thesis genuinely depends on the connection.

### Success Criteria:

#### Automated Verification:

- [ ] Contract referenced: `grep -l "editorial-contract.md" .claude/skills/lesson-rc-review/SKILL.md` matches.
- [ ] Over-narration / economy findings present: `grep -ni "over-narration\|payload\|economy" .claude/skills/lesson-rc-review/SKILL.md` matches.
- [ ] Adequacy in ledger: `grep -ni "why-now\|why it matters now\|adequac" .claude/skills/lesson-rc-review/SKILL.md` matches.

#### Manual Verification:

- [ ] The severity change makes a missing bridge a *judged* finding, not auto-Blocker, without removing the ability to block when the thesis depends on it.
- [ ] The rubric now lets a reviewer flag a manufactured pre-announcement (the m5-l4 "wróci jeszcze…" / "wróci pod koniec lekcji" cases) instead of logging it as PAID.

**Implementation Note**: Pause for human confirmation before mirroring and verification.

---

## Phase 5: Mirror & Verify

### Overview

Propagate the five SKILL.md edits to `.agents`, then verify the change reduces editorial burden on m5-l4.

### Changes Required:

#### 1. Mirror SKILL.md edits to .agents

**File**: `.agents/skills/{lesson-spec,lesson-grounding,lesson-draft,lesson-editor-pl,lesson-rc-review}/SKILL.md`

**Intent**: Keep both runtime trees identical for shared payload after Phases 2–4.

**Contract**: For each of the five edited skills, run `sync_skills.py --skill <name> --from claude --write`; confirm the runtime-specific blocks are preserved and only the new shared-payload edits propagated. Reference files (`editorial-contract.md`, `style.md`) are single-source — do **not** sync them.

#### 2. Verify on m5-l4

**File**: `workbench/lessons/m5-l4/lesson-draft.md` (test subject; snapshot first)

**Intent**: Re-run the pipeline on the research's evidence lesson and confirm the documented pains are now cut or caught.

**Contract**: Snapshot the current uncommitted m5-l4 draft. Run `lesson-editor-pl` on m5-l4, then `lesson-rc-review` (sequential, never parallel). Diff against the documented instances:
- Filler cut or flagged: `:32` "Nie musimy wymyślać koła na nowo.", `:48` summary-announcing, `:344` re-announcement of `:331`/`:350`.
- Manufactured continuity no longer logged as virtue: the "instalator … wróci jeszcze…" and "wróci pod koniec lekcji" pre-announcements are not scored as PAID wins; over-narration findings available.
- Concept adequacy flagged: `:197` "OIDC", `:313` "Ed25519", `:387` "OpenAPI 3.1" name-drops flagged for missing what+why-now.

### Success Criteria:

#### Automated Verification:

- [ ] All five skills clean after mirror: `for s in lesson-spec lesson-grounding lesson-draft lesson-editor-pl lesson-rc-review; do python3 .agents/skills/skill-sync/scripts/sync_skills.py --skill $s --from claude; done` reports no pending diff.
- [ ] m5-l4 snapshot exists for before/after diff (e.g. `git stash`/copy or a saved baseline file).

#### Manual Verification:

- [ ] The editor pass on m5-l4 cuts or rewrites the three documented filler instances.
- [ ] The rc-review on m5-l4 flags the three un-introduced concepts (OIDC / Ed25519 / OpenAPI 3.1) for adequacy and does **not** reward the manufactured pre-announcements as PAID.
- [ ] Net editorial burden on m5-l4 is visibly lower than the research's documented baseline (fewer hand-fixes for the three pains).

**Implementation Note**: This is the acceptance gate for the whole change. If m5-l4 still shows a pain class uncaught, trace it to the owning rule (economy → contract+editor; continuity → contract+spec+rc-review; adequacy → contract+spec/draft/rc-review) and refine that one place, not all five.

---

## Testing Strategy

### Automated checks (grep / sync):

- Contract file exists with three sections; `style.md` iteration bumped + value filter present.
- All five skills reference `editorial-contract.md`.
- Stale `psmyrdek` path gone.
- `skill-sync` clean for all five skills (both trees identical for shared payload).

### Manual testing (the real test):

1. Snapshot m5-l4 draft.
2. Run `lesson-editor-pl` on m5-l4; confirm the Economy Pass cuts the documented filler and the structural pass surfaces the thin concept intros.
3. Run `lesson-rc-review` on m5-l4; confirm it flags concept adequacy, offers over-narration findings, and does not log manufactured pre-announcements as PAID.
4. Compare the post-pipeline editorial burden to the research baseline for m5-l4's three pain classes.

### Edge cases to watch:

- Over-correction: the continuity counter-weight must not produce a choppy, disconnected m5-l4. Check the lesson still reads as a connected whole.
- Voice flattening: the asides value filter must not strip the house voice — confirm informative asides survive.

## Migration Notes

No data migration. The only baseline concern is the pre-existing `.agents` drift, healed in Phase 0 before new rules land. Sync direction is fixed: claude→codex.

## References

- Research: `context/changes/improve-lesson-editing/research.md`
- Change identity: `context/changes/improve-lesson-editing/change.md`
- Single-source lever precedent: `references/style.md` (and commit `9a09f9d0` landing a cross-cutting rule)
- Sync mechanism: `.agents/skills/skill-sync/scripts/sync_skills.py`
- Evidence lesson: `lessons/m5-l4/lesson-draft.md` + `lessons/m5-l4/rc-review.md`
- Workflow ordering: editor before review (`MEMORY.md`: "Editor before RC review")

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 0: Baseline Reconciliation

#### Automated

- [x] 0.1 No stale path remains (`grep -rn "psmyrdek"` empty) — 32d5355c
- [x] 0.2 `skill-sync` reports clean for all five skills — 32d5355c

#### Manual

- [x] 0.3 Each synced `.agents/SKILL.md` keeps its Codex-runtime block; only intended drift reconciled — 32d5355c

### Phase 1: Author Shared Contracts

#### Automated

- [x] 1.1 `references/editorial-contract.md` exists with the three section headings — af9e3dbc
- [x] 1.2 `style.md` iteration bumped to 4 — af9e3dbc
- [x] 1.3 `style.md` asides rule references the value filter — af9e3dbc

#### Manual

- [ ] 1.4 Each contract rule has an actionable before/after example
- [ ] 1.5 Continuity rule reads as a balanced counter-weight, not a disconnect license

### Phase 2: Upstream Skills (spec + grounding)

#### Automated

- [x] 2.1 spec + grounding both reference the contract — 545c0622
- [x] 2.2 spec adequacy field (`why-now`) present — 545c0622

#### Manual

- [ ] 2.3 Conditional-bridge wording does not read as "drop all bridges"
- [ ] 2.4 Grounding use-silently rule still requires factual correctness

### Phase 3: Production Skills (draft + editor-pl)

#### Automated

- [x] 3.1 draft + editor-pl both reference the contract — 35739485
- [x] 3.2 editor-pl names an Economy Pass / owner — 35739485
- [x] 3.3 draft self-review upgraded to adequacy (`why-now`) — 35739485

#### Manual

- [ ] 3.4 Economy Pass names concrete cut targets (asides, restatements, repeated beats)
- [ ] 3.5 Continuity-restraint check coexists with existing "make transitions explicit" guidance

### Phase 4: Gate Skill (rc-review)

#### Automated

- [x] 4.1 rc-review references the contract — b8f031e6
- [x] 4.2 Over-narration / economy findings present — b8f031e6
- [x] 4.3 Adequacy in dependency ledger — b8f031e6

#### Manual

- [ ] 4.4 Missing bridge is a judged finding, blockable only when thesis depends on it
- [ ] 4.5 Rubric can flag manufactured pre-announcements instead of logging them PAID

### Phase 5: Mirror & Verify

#### Automated

- [x] 5.1 All five skills clean after mirror (`skill-sync` no pending diff) — 342a802f
- [x] 5.2 m5-l4 snapshot exists for before/after diff — 342a802f

#### Manual

- [ ] 5.3 Editor pass cuts/rewrites the three documented m5-l4 filler instances
- [ ] 5.4 rc-review flags OIDC / Ed25519 / OpenAPI 3.1 for adequacy and does not reward manufactured pre-announcements
- [ ] 5.5 Net editorial burden on m5-l4 visibly lower than the research baseline
