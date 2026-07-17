---
date: 2026-06-10T17:41:20+0200
researcher: mkczarkowski
git_commit: 98dbdad84581cbdc6e08594fab668d25e229c810
branch: master
repository: przeprogramowani-sites
topic: "Why the lesson draft/edit/review pipeline leaves filler, over-forced narration, and half-introduced concepts"
tags: [research, codebase, workbench, lesson-skills, lesson-draft, lesson-editor-pl, lesson-rc-review, lesson-spec, lesson-grounding, style-guide]
status: complete
last_updated: 2026-06-10
last_updated_by: mkczarkowski
---

# Research: Why the lesson draft/edit/review pipeline leaves filler, over-forced narration, and half-introduced concepts

**Date**: 2026-06-10T17:41:20+0200
**Researcher**: mkczarkowski
**Git Commit**: 98dbdad84581cbdc6e08594fab668d25e229c810
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

The lesson workflow `/lesson-draft → /lesson-editor-pl → /lesson-rc-review` still requires heavy manual editorial work afterward. Three pains recur:

1. **Filler / redundancy** — sentences that bring no value, restate a nearby point (sometimes verbatim), mostly as narrative figures.
2. **Over-forced continuity** — the lessons try too hard to maintain narration between lessons and between sections, instead of optimizing for clarity.
3. **Half-introduced concepts** — new concepts appear without clearly stating *what this is* and *why it matters*.

And the meta-observation: *"Each of the skills have some elements that try to prevent this but it doesn't work as a whole."*

Scope (confirmed with user): full pipeline including upstream `lesson-spec` and `lesson-grounding`, plus the shared references `style.md` and `lesson-structure.md`; grounded in evidence from real lesson artifacts.

## Summary

The three pains are not random misses — they are **structurally produced and then structurally rewarded** by the current skill system. The root cause is a one-sided optimization: every stage of the pipeline applies *additive* forces (more continuity, more claims, more narrative voice) and almost no *subtractive* force (cut filler, drop a needless bridge, demand a fuller concept introduction). The subtractive rules that do exist live in only one place each, in divergent wording, with no shared contract — so they don't compose.

Concretely:

- **Pain #1 (filler) is born of an upstream vacuum and a downstream inversion.** No economy / "every sentence earns its place" rule exists in `lesson-spec` or `lesson-grounding`. It exists only weakly in `lesson-editor-pl`. And `style.md` *prescribes* narrative figures (3–4 casual asides + humor + rhetorical questions per article), which `lesson-rc-review` then **scores as a positive voice signal** — so payload-free asides are green-lit, not cut.
- **Pain #2 (over-forced continuity) is manufactured upstream and rewarded downstream.** `lesson-spec` ranks continuity second only to schema, mandates unconditional Bridge-In/Out and a *per-section transition contract*, with no counter-rule that a clean topic switch is acceptable. `lesson-rc-review`'s mandatory Coherence-And-Flow Pass then treats resolved forward-references as "PAID" virtues, rewards sections that "end pointing at the next," and treats a *missing* bridge as a **Blocker**. The pipeline pushes drafts toward more narration; nothing pushes back.
- **Pain #3 (half-introduced concepts) is a definitional gap.** Every stage checks concept **ordering** ("introduced before used") and none checks concept **adequacy** ("does this line say what it is and why it matters now?"). `lesson-rc-review`'s dependency ledger clears any term that is course vocabulary or appeared in a prior lesson, regardless of whether the current line explains it.
- **"Doesn't work as a whole" = diffuse ownership + asymmetric forces + a one-sided accretion event.** Flow/scope/ledger concerns are asserted in 3+ stages with divergent phrasing; the two most-felt pains (redundancy, concept adequacy) are owned by *no* upstream stage. The heavy coherence machinery was added in a single commit to `lesson-rc-review` only (2026-06-07), over-correcting on continuity while the draft/edit stages kept lighter, divergent phrasing and never gained an economy or concept-adequacy contract.

## Detailed Findings

### Area 1 — Pain #1: filler / redundancy / empty narrative figures

**Where it should be prevented but isn't:**

- Upstream (`lesson-spec`, `lesson-grounding`) has **no** sentence-level economy concept. The only "earn its place" rule (`lesson-spec/SKILL.md:278`) governs *examples/evidence placement*, and the only "reduce cognitive load, not decorate" rule (`lesson-spec/SKILL.md:287`) is scoped **to diagrams**. Compactness rules bound the *spec artifact* size (`lesson-spec/SKILL.md:266`, `:335`), not the draft's prose.
- The only real anti-filler rules live in `lesson-editor-pl/SKILL.md:80-82` ("filler like 'warto zauważyć', 'w dzisiejszych czasach', 'kluczowe jest'", "repeated claims already made in nearby sections") and `:160` ("merge repeated beats"). These are a handful of bullets inside a Voice Pass, not a systematic redundancy sweep, and they do not exist in `lesson-draft` at all.

**Where the system actively works against the user:**

- `style.md` *prescribes* the very narrative figures the user trims: "Use casual asides, rhetorical questions, AND humor/irony" with a target of "3–4 per article" (`style.md:88-104`), ellipsis-for-dramatic-pause (`style.md:124-133`). Nothing distinguishes a device that carries information from one that fills space.
- `lesson-rc-review`'s **Editorial Quality** dimension treats these devices as compliance wins. In the m4-l4 review it praises the asides explicitly: *"casual asides present ('tylko kto ma na to czas w cudzym repo tej skali?'…)"* (`lessons/m4-l4/rc-review.md:88`); the m5-l4 review rates style "strong" / "AI-sounding patterns: minimal" (`lessons/m5-l4/rc-review.md:106-113`).

**Evidence the pain survives (real drafts):**

- m5-l4: `lesson-draft.md:32` "Nie musimy wymyślać koła na nowo." (payload-free cliché); `:48` "Te pięć punktów to nasza miara. Przyłóżmy ją najpierw do całej trójki z lotu ptaka." (summary-announcing); `:344` re-announces a point already made at `:331` and `:350`.
- m4-l4: `lesson-draft.md:20` "Wygląda jak postęp."; `:26` "…a wartość… no właśnie, gdzie jest wartość?" (rhetorical filler); `:205` "Czy historia naprawdę zmienia decyzje? Właśnie to zobaczyłeś." (summary-announcing).
- m1-l5: `lesson-draft.md:223`, `:130`, `:303` are information-free generalizations/restatements; the review caught only length/drama (`rc-review.md:105-109`, `:171`), not the restatements.

**Verdict:** filler survives heavily in all three sampled drafts; rc-review misses it and, for narrative figures, **inverts** the signal (rewards them as house voice).

### Area 2 — Pain #2: over-forced continuity

**Manufactured upstream:**

- `lesson-spec/SKILL.md:10` ranks continuity *second* ("schema first, prework continuity second, discovery third").
- Unconditional bridges: `Bridge In` (`lesson-spec/SKILL.md:310-312`) and `Bridge Out` (`:314-316`) with no "omit if it adds no value" escape hatch.
- A **per-section transition contract** (`lesson-spec/SKILL.md:299-304`): "For each suggested section, add a one-line transition contract: Previous beat -> this beat -> next beat". This primes the drafter to author connective tissue between *every* section.
- Dependency neighbors are binding even when empty (`lesson-spec/SKILL.md:45`, `:74`).
- `style.md` reinforces: "Open with a bridge from the previous lesson" (`style.md:15-25`) and "Add forward references … 2–3" (`style.md:44-53`).
- **No counter-rule exists** in spec or style that continuity must serve clarity, or that a clean, unnarrated topic switch is acceptable. The only relief valves are anti-tangent / anti-abstraction-jump rules (`lesson-spec/SKILL.md:142-143`) whose implied remedy is to *add a bridge*.

**Rewarded downstream:**

- `lesson-rc-review`'s **mandatory Coherence-And-Flow Pass** (`lesson-rc-review/SKILL.md:72-97`) builds a **promise ledger** that scores resolved forward-references as "PAID" — a virtue. In the m5-l4 review, manufactured pre-announcements are logged as wins: *"'instalator … wróci jeszcze przy wzorcach i przy trzecim modelu' → PAID"* (`lessons/m5-l4/rc-review.md:68`), *"'Zapamiętaj jeszcze jedną rzecz, bo wróci pod koniec lekcji' → PAID"* (`:69`), and *"Transitions are explicit and load-bearing; each section ends pointing at the next. Reorder test passes."* (`:80`).
- The **reorder test** (`lesson-rc-review/SKILL.md:94`) defines missing connective tissue as a defect — exactly the pressure that produces over-narration. It has no inverse ("is this transition manufactured between sections that are already independently clear?").
- A *missing* bridge is escalated to **Blocker**: m1-l5 Blocker #2 = "Brakujący Bridge out do m2-l1" with required fix "Dodaj krótki outro… zwrot do m2-l1" (`lessons/m1-l5/rc-review.md:11-24`, `:129`).

**Evidence the pain survives (real drafts):** m5-l4 `lesson-draft.md:81`, `:142`, `:231`, `:274` are pure narration scaffolding; m4-l4 `:131`, `:181`, `:205`, `:290` are forced callbacks; all validated (not flagged) by their reviews.

**Verdict:** over-forced continuity is not merely missed — the rc-review rubric is **structurally biased to reward it** and to block releases for *omitting* it.

### Area 3 — Pain #3: half-introduced concepts

**Every stage checks ordering, none checks adequacy:**

- `lesson-spec`'s Structural Logic Map (`lesson-spec/SKILL.md:270-276`) has fields `Introduces` (names the concept), `Depends on`, `Sets up` — all ordering/sequence. `Question answered` (`:271`) captures the reader's implicit question but does **not** oblige the beat to state the concept's *definition* or *why-now*. No quality-bar item asks "is every new concept defined before it is used?" (`:355-357` are all placement questions).
- `lesson-draft/SKILL.md:321` self-review: "Verify that every new concept is introduced before it is used" — *ordering only*.
- `lesson-rc-review`'s **dependency ledger** (`lesson-rc-review/SKILL.md:88-90`) records concepts "at first *use* and check it was introduced … *before* that point" — *ordering/provenance only*.
- `lesson-grounding` compounds it: it hands the drafter a `Claims To Support` list and per-source `Use in lesson` fields (`lesson-grounding/SKILL.md:99-105`, `:134-148`) with **no rule that a source may be used silently** to get a fact right rather than surfaced as a sentence — so thin claims become shallow name-drops.

**Evidence the pain survives and review misses it:**

- m5-l4: `lesson-draft.md:197` "OIDC", `:313` "Ed25519", `:387` "OpenAPI 3.1" — all name-dropped with no gloss. The dependency-gaps check **cleared everything on ordering grounds** (`lessons/m5-l4/rc-review.md:76`) and never assessed these three because they aren't reused.
- m1-l5: `lesson-draft.md:337` "progressive disclosure i lazy loading" invoked as already-known with no refresher — not flagged, because they appeared earlier in the course (passes the ordering test). The one catch (`/10x-lesson`, `rc-review.md:115-119`) succeeded only because it was an *orphan* with no provenance — i.e., it failed the ordering test, not an adequacy test.
- m4-l4: `lesson-draft.md:219` "ast-grep" approved precisely *because* it was introduced earlier ("referenced to M4L3, not re-taught", `rc-review.md:83`).

**Verdict:** the right surface area exists (dependency tracking) but is wired to the wrong question (ordering, not adequacy).

### Area 4 — Why it "doesn't work as a whole" (system-level)

- **Diffuse ownership with divergent phrasing.** The same concerns are re-expressed at each stage in different words: continuity/flow lives in spec (`:142-144`, `:299-304`), draft (`:321-323`, `:372`), editor (`:123-124`, `:266`, `:367`), and the full ledger machinery in rc-review (`:72-97`). Scope-theft and the Side-Effect Ledger are likewise duplicated across spec, grounding, draft, editor, review, and `workbench/CLAUDE.md`. No single artifact is the source of truth for any of them.
- **Asymmetric forces.** Continuity is reinforced in ~5 places and *rewarded* in review; economy/anti-filler exists weakly in one place; concept-adequacy exists nowhere. The aggregate vector points at over-narrated, under-trimmed, shallowly-introduced prose — exactly the reported symptom.
- **One-sided accretion event.** The entire Coherence-And-Flow Pass, promise ledger, dependency ledger, reorder test, and through-line/arc-integrity rules were added in a **single commit `11964529` (2026-06-07, "feat(skills): add draft consistency check to rc-review skill")** to `lesson-rc-review` only (`git log -S` confirms "Coherence And Flow", "promise", "reorder", "through-line" each appear only in that commit). The team felt the coherence pain (driven by the per-lesson `m2l3-iteration`, `m3l4-iteration` coherence audits) and over-corrected on the *review* side — while the *draft* and *edit* stages, which actually produce and fix prose, never received a matching economy or concept-adequacy contract.
- **Rubric mis-alignment (the sharpest framing).** rc-review's two flagship mechanisms point the wrong way for two of the three pains: Editorial Quality *rewards* rhetorical filler as voice (pain #1), the promise ledger/reorder test *reward* connective tissue as coherence (pain #2), and the dependency ledger has the right surface but the wrong question for pain #3 (ordering, not adequacy).

### Area 5 — Coupling constraints any fix must respect

- **Dual-tree mirroring.** All five skills exist in **both** `.claude/skills/<name>/SKILL.md` (Claude) and `.agents/skills/<name>/SKILL.md` (Codex). Any skill edit is a **paired edit**, reconciled via the `skill-sync` skill (`python3 .agents/skills/skill-sync/scripts/sync_skills.py --skill <name> --from claude|codex --write`). `SKILL.md`, `scripts/**`, `references/**`, `assets/**` are shared payload; `agents/**` and hidden files are runtime-specific.
- **Pre-existing drift to heal first.** `lesson-rc-review`'s two copies differ only in the expected Codex-runtime block (coherence body is byte-identical). But `lesson-draft`, `lesson-editor-pl`, `lesson-spec`, `lesson-grounding` have **genuine body divergence**: the `.agents` copies never received the 2026-06-03 `1e1b5ed8` "faster lesson context retrieval" update (they still point at `lessons-schema.json` directly, lack `lesson-context.mjs` wiring). editor-pl's `.agents` copy also lacks the "Lesson cross-reference format" block, and editor-pl's `.claude` copy carries a stale hardcoded path `/Users/psmyrdek/dev/…` (`lesson-editor-pl/SKILL.md:353`). These baselines should be reconciled before layering new rules.
- **Shared references are the lever for "as a whole".** `workbench/references/style.md` is a single, non-mirrored file referenced by every skill in the pipeline; it is iteration-versioned ("Iteration: 3", `style.md:7`) and there is precedent (`9a09f9d0`) for landing a cross-cutting rule in `style.md` + skills in one commit. A redundancy/economy rule and a concept-introduction-adequacy rule placed in `style.md` would be inherited by draft, editor, and review at once — directly attacking the divergent-phrasing problem. Structural/order rules belong in `references/lesson-structure.md`.

## Code References

- `.claude/skills/lesson-draft/SKILL.md:194-216` — Section Logic Discipline (logic map; ordering-only concept check)
- `.claude/skills/lesson-draft/SKILL.md:218-234` — Writing Style (delegates voice to style.md; no economy rule)
- `.claude/skills/lesson-draft/SKILL.md:321` — "introduced before it is used" (ordering only)
- `.claude/skills/lesson-editor-pl/SKILL.md:80-82`, `:160` — the only anti-filler / merge-repeats rules in the pipeline
- `.claude/skills/lesson-editor-pl/SKILL.md:118-166` — Argument Architecture beat map (transition-additive)
- `.claude/skills/lesson-editor-pl/SKILL.md:353` — stale hardcoded `/Users/psmyrdek/dev/…` path
- `.claude/skills/lesson-rc-review/SKILL.md:72-97` — mandatory Coherence-And-Flow Pass (promise ledger, dependency ledger, reorder test, arc integrity)
- `.claude/skills/lesson-rc-review/SKILL.md:99-113` — Review Dimensions (Editorial Quality rewards voice; dependency = ordering)
- `.claude/skills/lesson-spec/SKILL.md:10`, `:299-304`, `:310-316` — continuity ranked 2nd; per-section transition contract; unconditional bridges
- `.claude/skills/lesson-spec/SKILL.md:270-278` — Structural Logic Map fields (ordering, not adequacy)
- `.claude/skills/lesson-grounding/SKILL.md:99-105`, `:134-148` — claims/sources handed to drafter with no "use silently" rule
- `references/style.md:88-104`, `:124-133` — prescribes 3–4 asides + humor + ellipsis (the narrative-figure source)
- `references/style.md:7` — Iteration counter (bump on any cross-cutting rule)
- `lessons/m5-l4/lesson-draft.md` + `lessons/m5-l4/rc-review.md` — primary evidence (filler, forced continuity rewarded, OIDC/Ed25519/OpenAPI un-introduced)
- `lessons/m4-l4/lesson-draft.md` + `lessons/m4-l4/rc-review.md` — asides praised as voice; ast-grep cleared on ordering
- `lessons/m1-l5/lesson-draft.md` + `lessons/m1-l5/rc-review.md` — missing-bridge escalated to Blocker; orphan concept caught only via ordering

## Architecture Insights

- The pipeline is an **additive system with no budgeted subtraction.** Each stage adds requirements (claims, bridges, fragments, voice). The only subtractive agent (`lesson-editor-pl`) has the weakest, least-systematic rules, and the final gate (`lesson-rc-review`) scores additive properties as virtues.
- **"Introduced" is treated as binary** (did the token appear before use) rather than **graded** (does the introduction answer what/why). Pain #3 is fixable by upgrading the existing dependency machinery from a presence test to an adequacy test — the surface area already exists.
- **Continuity needs a counter-weight, not removal.** The fix is not to delete bridges but to add an explicit "continuity serves clarity; a clean labeled topic switch is acceptable; do not manufacture transitions between independently-clear sections" rule, and to give rc-review an *over-narration* finding to balance its *under-narration* (missing-bridge) finding.
- **The shared reference is the correct home for cross-cutting rules**, because it is single-source and already inherited by all five skills — this is the structural answer to "doesn't work as a whole." Per-skill duplication is what caused the divergence.

## Historical Context (from prior changes)

- `context/foundation/lessons.md` does **not** exist (no accepted team lesson-priors file yet).
- `context/archive/m2l3-iteration/` and `context/archive/m3l4-iteration/` (both archived 2026-05-28) — per-lesson **cross-lesson coherence** audits. These are the felt pain that motivated the rc-review coherence pass; the new change should generalize that intent into draft/editor rather than re-litigate it.
- `context/changes/m5l4-improv/change.md` (2026-06-09) — reworked a draft for "content leaks", bad order, and concepts "not introduced properly, but only shallowly displayed" — the per-lesson manifestation of pain #3.
- `context/changes/eval-lesson-flow/change.md` (new, 2026-05-09) — intent to eval the lesson skills across models via `10x-evals`; never executed. Potentially a measurement harness for verifying any fix.
- `context/archive/2026-05-16-lesson-order/` — standardized M1 section order/emoji; fed `references/lesson-structure.md`.
- No prior change has refactored the draft/editor/review skills as a **system** — this is the first.

## Related Research

- None under `context/changes/**/research.md` or `context/archive/**/research.md` directly on the skill system. The `m2l3-iteration` and `m3l4-iteration` archives contain per-lesson `research.md` files focused on individual-lesson coherence, not skill design.

## Open Questions

1. **Where should each new rule live?** Cross-cutting economy + concept-adequacy rules in `style.md` (inherited by all), vs. per-stage enforcement steps in each SKILL.md. Likely both: rule in `style.md`, enforcement pass in editor + review. To be decided in planning.
2. **How aggressively to dampen continuity?** A counter-rule risks the opposite failure (disconnected lessons). Needs a balanced formulation: "continuity must earn its place" symmetric with the existing "introduced before used."
3. **Should the concept-adequacy check be a new field in the spec's logic map** (`Introduces` → `Introduces (what + why-now)`), a new draft self-review step, a new rc-review dimension, or all three? Risk of re-introducing the diffuse-ownership problem if added everywhere without a shared definition.
4. **Heal drift first?** Should the four drifted `.agents` skill copies be reconciled via `skill-sync` before new rules land, to avoid building on inconsistent baselines?
5. **Verification.** Is `eval-lesson-flow` / `10x-evals` the way to measure whether a change actually reduces post-pipeline manual editing, or do we re-run the pipeline on the three sampled lessons (m1-l5, m4-l4, m5-l4) and diff the editorial burden?
6. **Style-guide tension.** The "3–4 asides + humor per article" prescription (`style.md:88-104`) directly feeds pain #1. Soften to "asides must carry information or set up a payoff," or keep the target and add a value filter?
