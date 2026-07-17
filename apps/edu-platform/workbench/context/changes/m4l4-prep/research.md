---
date: 2026-06-05T09:31:01+02:00
researcher: mkczarkowski
git_commit: 9598c86697523c51031381cc948ad1f6807670db
branch: master
repository: przeprogramowani-sites
topic: "m4-l4 lesson prep: inputs for /lesson-spec, /lesson-grounding (reuse), /lesson-draft"
tags: [research, workbench, m4-l4, lesson-prep, refactoring, 10xdevs-3]
status: complete
last_updated: 2026-06-05
last_updated_by: mkczarkowski
---

# Research: m4-l4 lesson prep (spec → grounding reuse → draft)

**Date**: 2026-06-05T09:31:01+02:00
**Researcher**: mkczarkowski
**Git Commit**: 9598c86697523c51031381cc948ad1f6807670db
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Gather everything needed to create `/lesson-spec` and `/lesson-draft` for **m4-l4 "Refaktoryzacja z Agentem: testy, zmiany, weryfikacja"** (report element ④ Refactor opportunities). Scope decisions: (1) reuse the existing `lesson-grounding.md` and only flag its gaps; (2) full analysis of the Mattermost demo continuity artifacts; (3) verify the tooling spine: `/10x-plan` + `/10x-implement` + test-plan continuity.

## Summary

- **Artifact state:** m4-l4 has `lesson-grounding.md` (done 2026-06-03, 25/25 claims verified 3-0, 9 sources in schema), `notes.md` (lenses from `m4-shape.md` §5), and a mislabeled `handoff.md` (header says "M4-L2 → M4-L3" but the body is the **L3→L4 handoff**). **No spec, no draft.** Schema slot: `owns` ×4 populated; `mustNotCover`, `learningOutcomes`, `referencesOnly`, `requiredFragments`, `videoPlaceholders` empty — the spec step fills these.
- **Grounding is reusable as-is** with three precision caveats (Brooks "essence/accidents", Branch by Abstraction = 2007 not 2004, ADR "non-goals" + Mikado loop are our operationalizations) and **one real gap**: the AI-assisted-refactoring dimension has zero verified claims — directional framing only ("AI operationalizes the lens; the human owns the decision"); a dedicated grounding round is needed only if the spec promotes hard AI-refactoring claims.
- **Both neighbors are drafted and the boundary is clean.** m4-l3 explicitly defers Strangler Fig / Branch by Abstraction / Mikado / characterization tests / archetypes / ADRs to L4 (`lessons/m4-l3/lesson-spec.md:65`); m4-l5 opens by assuming element ④ is done (`lessons/m4-l5/lesson-draft.md:3`) and reserves all DDD. L4 is **structural/tactical**; it may only *name* DDD as the bridge-out.
- **The demo is pre-staged and rich.** `lessons/m4-l4/context/changes/post-flow-analysis/research.md` (Mattermost `PostStore.Save`) ships a ranked debt list TD-1…TD-5 with co-change evidence, blast-radius maps, and test-gap rankings — four concrete refactor-opportunity candidates fall out directly (see Detailed Findings). What the demo must generate live: ADR/history grounding, target-archetype decisions, the Mikado graph, the characterization-test plan.
- **Tooling spine verified:** `10x-plan`, `10x-implement`, `10x-test-plan`, `10x-research`, `10x-tdd` all exist in the toolkit. m2-l2 owns plan/implement mechanics, m3-l1 owns test-plan/quality-gates/oracle problem, m3-l2 owns test generation + `/10x-tdd` — **L4 references, never re-teaches**. ⚠️ Two human decisions: the workbench↔toolkit lesson-ID offset (workbench m4-l4 = toolkit `m4l3`, so the CLI ref would be `10x get m4l3` today), and the fact that **all module-04 toolkit lessons are unwired** (empty skills arrays, `summary: "TBD"`).

## Detailed Findings

### 1. Schema slot & existing m4-l4 artifacts

- Contract: `lessonId: m4-l4`, globalOrder 19, `dependsOn: [m4-l3]`, `preparesFor: [m4-l5]`, status `planned`; `requiredArtifacts`: lesson-spec, lesson-draft, video-scenario, rc-review, lesson-grounding (`lessons-schema.json`, via `node scripts/lesson-context.mjs m4-l4`).
- `owns` (4): archetypes (Fowler PoEAA + Brooks essence/accidents), incremental reversible migration (Strangler Fig / Branch by Abstraction), Mikado Method + seams/characterization tests (Feathers), refactor opportunities as report element ④ (ranked candidates grounded in ADRs/history/non-goals).
- `lessons/m4-l4/lesson-grounding.md` — full brief; high-confidence: PoEAA, Brooks, Strangler Fig, BbA, Mikado, ADRs; medium: Feathers wording, fitness functions, tech-debt quadrant; **ungrounded: AI-refactoring efficacy** (`lesson-grounding.md:137-152`).
- `lessons/m4-l4/notes.md` — lenses + output definition: 2–3 ranked candidates per module, current → target archetype, blast radius, incremental path, Mikado prerequisite sketch, right-sized / no over-engineering (`notes.md:56-61`).
- `lessons/m4-l4/handoff.md:53-57` — L4 starting mandate: analyze "Technical debt", "Blast radius", "Obszar 1 — Luki w pokryciu testami" from `post-flow-analysis/research.md`; use `/10x-research` + `/10x-plan`; `/test-plan` to safeguard the refactor with tests.

### 2. m4-l3 bridge-in (what L4 inherits)

- L3 ends at a hard stop: "Krok 4: Zatrzymaj się przed refaktorem" — the ②③ report is "gotowy jako wejście do następnej lekcji" (`lessons/m4-l3/lesson-draft.md:377-379`); "To dokładnie ten materiał, na którym w następnej lekcji oprzemy decyzję, co i jak warto ruszyć" (`:182`).
- L3 promised L4 twice: M4L4 named at `lesson-draft.md:69`; **ast-grep rewrite mode previewed and handed over** at `:249-288` ("to samo narzędzie… poniesie cię też przez zmianę"). L4 *uses* ast-grep rewrite, does not re-teach basics.
- Spec bridge-out: "M4-L4 starts from those sections and asks a different question: which refactor opportunities are worth considering, how to make them incremental and how to protect the change" (`lessons/m4-l3/lesson-spec.md:204-206`).
- Clean ownership: grep confirmed **no** archetypes/Strangler/Mikado/ADR/characterization-test content in the L3 draft; forbidden there by `lesson-spec.md:65`. Hot-spot detection (Tornhill, connascence, co-change) is L3-owned — L4 consumes the numbers, never re-derives them.

### 3. m4-l5 bridge-out (what L4 must deliver and must not touch)

- L5 opens: "W poprzedniej lekcji domknąłeś **④ Refactor opportunities**. Masz listę konkretnych, ugruntowanych kandydatów do modernizacji i wiesz, jak prowadzić zmianę z Agentem, testami i weryfikacją." (`lessons/m4-l5/lesson-draft.md:3`) → L4's delivery contract: (a) element ④ list, (b) the agent+tests+verification change mechanics, (c) code-level/structural work.
- Boundary line: "Refaktoryzacja z poprzedniej lekcji odpowiadała na pytanie: jak bezpiecznie zmienić ten kod? DDD odpowiada na inne, wcześniejsze pytanie: czym ten kod tak naprawdę jest w języku biznesu?" (`m4-l5/lesson-draft.md:21`).
- L5 reserves: Event Storming, Bounded Contexts/Context Mapping (incl. Anticorruption Layer), subdomain distillation, entities/VOs, element ⑤, tldraw-MCP whiteboard, milestone handoff. L5 spec allows naming Strangler/BbA/Mikado "dla ciągłości, **nie uczyć**" (`lessons/m4-l5/lesson-spec.md:56,63`).
- L4 bridge-out should land on the m4-shape line: "Some opportunities are tactical. The deepest ones are about the domain itself — that's DDD" (`lessons/m4-shape.md:253-254`) — woven into prose, not a promo paragraph (style rule `references/style.md:44-53`).

### 4. Report-element arc (confirmed)

| # | Element | Lesson | Evidence |
|---|---------|--------|----------|
| ⓪ | Context architecture | m4-l1 | `m4-shape.md:19,90-92` |
| ① | Mapa projektu | m4-l2 | `m4-shape.md:20,127` |
| ② | Feature overview | m4-l3 | `m4-l3/lesson-draft.md:25,164` |
| ③ | Technical debt | m4-l3 | `m4-l3/lesson-draft.md:26,174` (canonical name "Technical debt", not "Issues & hot spots") |
| ④ | Refactor opportunities | **m4-l4** | `m4-shape.md:23,224` |
| ⑤ | DDD opportunities | m4-l5 | `m4-l5/lesson-draft.md:15` |

L4 is penultimate — the **10xArchitect badge closes in L5** (`m4-l5/lesson-draft.md:196`); L4 must not claim badge completion.

### 5. m4-shape.md prescription for L4

- Why/problem (`m4-shape.md:213-222`): hot spots are problems, L4 turns them into *options*; ungrounded refactors get rejected or regress; "modernize" with no target shape = paralysis or cargo-cult.
- Beats (`:236-241`): hot spot → options; archetype mapping; grounding in ADRs/history/no-goals/post-mortems; ranking + safety (blast radius, incremental path, test scaffolding); capture section ④.
- Guardrail (`:248-251`): reuse the "honesty / no over-engineering" rule — small-logic modules legitimately stay Transaction Scripts.
- Tools/data (`:243-246`): archetype catalog as lens; ADRs + change history; tests-as-seatbelt explicitly connecting to M3; data sources = ADRs, git/PR rationale, post-mortems, issue tracker, the L3 hot-spot list.

### 6. Demo: four refactor-opportunity candidates from post-flow-analysis

All from `lessons/m4-l4/context/changes/post-flow-analysis/research.md` (Mattermost @ 29bab2184, flow `PostStore.Save`):

1. **`SaveMultiple` god-method → decompose toward Domain Model / Service Layer** (TD-3, `research.md:244,296`). Validation + tx + INSERT + 4 side effects in one body; `app/post.go` ≈3957 lines. The headline archetype demo: the save path is a layered **Transaction Script** (`:69-85`); only 4 production write call-sites (`:213`) bound the surface. Characterization prerequisites: untested error-mapping `app/post.go:366-377`, rollback path, persistent-notification validation, auto-translation branches (`:188-192,252`).
2. **Three positional column arrays → named mapping behind Branch by Abstraction** (TD-2, `research.md:239-240`, `post_store.go:53-143`). Silent data-corruption risk; write positional, read reflective by name (`:297`). Classic **Brooks accidental complexity**. Blast-radius map (b): add-a-field = EXPENSIVE, not co-commit-enforced (`:224`); burn-on-read commit touched 156 files (`:217`). Mikado leaf: a write→read round-trip characterization test (no current test asserts column order).
3. **Manual front/back model mirror → contract sync / codegen** (TD-1, "najwyższe ryzyko", `research.md:234-235`). `model/post.go` ↔ `types/posts.ts`, only 2 of 300 commits touched both. ⚠️ Keep framed as **contract synchronization**, not domain redesign (DDD-boundary leak risk → L5).
4. **Manual store layers outside codegen** (TD-4, `research.md:247`). `searchlayer.Save→indexPost` has **zero coverage** — the #1 ranked test gap (`:186,250`). The decorator chain `LocalCache→Timer→Search→Retry→Sql` over the `PostStore` interface (`:86,295`) means **the Branch-by-Abstraction seam already exists** — a strong teaching beat: sometimes you inherit the abstraction instead of introducing it (`:38`: "Szew… jest czysty i wąski").

**Ready-made ranking axes:** TD list pre-ordered by risk + CHEAP/EXPENSIVE distinction (`:231,254`) maps onto the tech-debt-quadrant lens; the test-gap ranking (`:185-195`) gives the refactor-cost axis.

**Demo must generate live:** ADR/PR-rationale grounding (none in the artifacts — `:30,309`), per-file churn×complexity for candidate files, runnable test inventory (the `/10x-test-plan` step), every current→target archetype decision, the Mikado graph (`handoff.md:50` — ast-grep rewrite reserved for L4).

**Demo risks:** (a) research.md drifts into light prescription (e.g. `:308` recommends a lint) — the agent should generate options live, artifacts are input; (b) opentracinglayer does **not** exist (`:39,314`), mocks live in `storetest/mocks/`, MySQL migrations removed — use the corrected layer set; (c) Go blast radius rests on co-change + ast-grep, not an import graph (`artifact-2-structure.md:107-112`) — say so; (d) pre-empt "why refactor the store, not the #1 frontend hotspot?" — the store was chosen for its clean seam (best teaching case), not because it's the worst debt.

### 7. Tooling spine (verified in 10x-toolkit)

- All spine skills exist at `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/`: `10x-plan` (writes `context/changes/<id>/plan.md`; SKILL.md:734 names the refactoring pattern "document behavior → incremental changes → backwards compatibility → migration"), `10x-implement` (phase-by-phase, manual gates, commit ritual — the operational form of "incremental, reversible"), `10x-test-plan` (brownfield test-rollout orchestrator over the research→plan→implement chain; "signal, not knowledge" boundary), `10x-research`, `10x-tdd` (**refuses existing code** — characterization tests for legacy go through test-plan→research→plan→implement, not TDD).
- The handoff's `/test-plan` = **`/10x-test-plan`** (no skill named `test-plan` exists). Note its stated prerequisite: "Use AFTER /10x-prd and /10x-roadmap" — for the Mattermost demo this is a framing wrinkle (no PRD exists for Mattermost); the lesson likely uses the test-plan *method* (risk-first characterization seatbelt) per-change rather than the full foundation document. **Spec decision.**
- First-wired locations: plan/implement/new/plan-review/archive → `module-02/lesson-02.ts:11-16` (m2l2); research/frame → m2l4; test-plan → `module-03/lesson-01.ts:12`; tdd → `module-03/lesson-02.ts:12`.
- **All module-04 toolkit lessons are stubs**: empty `skills/prompts/configs/rules`, `summary: "TBD"`, no spread chain from module-03 (`module-04/lesson-0{1..5}.ts`). Learners following linearly already hold the skills from m2–m3, but the m4-l4 pack delivers nothing today.
- **ID offset:** workbench `m4-l4` = toolkit **`m4l3`** (`module-04/lesson-03.ts:5-6`, same title). Any `10x get …` command in lesson prose must wait for a human decision (renumber vs use `m4l3`).
- CLI delivery rules (`references/10x-content-delivery.md`): learner prose uses `npx @przeprogramowani/10x-cli@latest …` / `10x get <toolkit-id>`; never `10x-toolkit install`; don't promise locked future modules.

### 8. Prior-lesson framing (reference, don't re-teach)

- **m2-l2** owns `/10x-new → /10x-plan → /10x-plan-review → /10x-implement`, `plan.md` structure, `## Progress`, phase commits (`lessons/m2-l2/lesson-draft.md:38,125-128,193-200,248-271`).
- **m3-l1** owns `/10x-test-plan`, quality gates, risk-first prioritization (impact×likelihood), oracle problem, "signal not knowledge" (`lessons/m3-l1/lesson-draft.md:26-48,86-200,209-230`).
- **m3-l2** owns risk-driven test generation through the chain, the three LLM-test anti-patterns, assertion-checking by breaking prod code, `/10x-tdd` with its decision rule (`lessons/m3-l2/lesson-draft.md:88-133,152-266`). The "safeguarding existing code" case study at `:88-133` is the closest precedent to L4's seatbelt move.
- **m4-l3** uses `/10x-research` (controlled mode) + `/10x-init`/`/10x-new` + ast-grep; it never mentions plan/implement/test-plan — **L4 is the lesson that picks the m2 execution spine back up in module 4.**

### 9. Style/structure contract & prework continuity

- Section order, emoji (only 🧑🏻‍💻/🔎/📚), no `## Wstęp`/`## Core`, badge one-liner, Deep Dive standardized intro, `- [Title](URL) — description` links: `references/lesson-structure.md:9-101`. Sibling drafts confirm the pattern; L5's `##`-per-beat style is the cleaner recent sibling.
- Voice (`references/style.md`, iter 3 — canonical over the prework copy): ≤1 em-dash per 10 lines; no inline academic citations in Core — author names/dates go to Deep Dive / Materiały dodatkowe (`:59-72,444-453`); mechanism-over-guideline (`:407-417`); soften mandates (`:470-478`); ≤3-sentence paragraphs; forward references woven into prose (`:44-53`).
- **Tension to resolve in spec:** L4's spine is named, citable concepts (Fowler/Brooks/Feathers/Nygard…), but house style bans inline citations in Core → plan where each attribution lives (Core = concept w/o citation; Deep Dive + Materiały = names/years/links).
- Prework: **no named SE author or lens exists in prework** — archetypes, Strangler/BbA, Mikado, characterization tests, ADRs, essence/accidents are all new at L4. Reusable prework hooks: [1.3] "nie akceptuj bez zrozumienia" (learner defends the decision), [3.2] "refaktor" prompt template (`prework.md:103`), [3.3] context lifecycle across handoffs, [3.1] "testy utrwalające błędne założenia" (`prework.md:90`).
- Mermaid (`.claude/skills/mermaid/references/mermaid-style-guide.md`): `flowchart`; `LR` for the archetype spectrum / incremental path, `TD` for the **Mikado graph**; 3–8 nodes; dark palette all-or-nothing; lesson refs as `M4L4`/`M4L5: Legacy z DDD`; setup sentence instead of captions. Diagrams render only from `lesson-draft.md` (commit c9e2d6e1).

## Code References

- `workbench/lessons-schema.json` — m4-l4 slot (owns ×4, 9 groundingSources, empty spec-owned fields)
- `workbench/lessons/m4-l4/lesson-grounding.md:19-22,137-152,161-177` — caveats, AI-dimension gap, open verification questions
- `workbench/lessons/m4-l4/notes.md:56-61` — element ④ output definition
- `workbench/lessons/m4-l4/handoff.md:46-57` — stop-line + L4 starting mandate (header mislabeled)
- `workbench/lessons/m4-l4/context/changes/post-flow-analysis/research.md:175-259` — test gaps, blast radius, TD-1…TD-5
- `workbench/lessons/m4-l3/lesson-spec.md:65,204-206` — forbiddance + bridge-out
- `workbench/lessons/m4-l3/lesson-draft.md:249-288,377-379` — ast-grep rewrite preview, hard stop
- `workbench/lessons/m4-l5/lesson-draft.md:3-21` — L4 delivery contract as seen from L5
- `workbench/lessons/m4-l5/lesson-spec.md:56,63` — Strangler/BbA/Mikado "name, don't teach"
- `workbench/lessons/m4-shape.md:208-255,449-474` — L4 block + §5 lenses
- `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-04/lesson-03.ts:5-10` — toolkit `m4l3` stub (ID offset, unwired)
- `workbench/references/10x-content-delivery.md:14-18,121-125` — CLI command rules
- `workbench/references/lesson-structure.md:9-101` — section contract
- `workbench/references/style.md:59-72,137-147,444-453` — citation & em-dash policy
- `workbench/references/prework.md:35-43,85-113` — continuity hooks

## Architecture Insights

- The module is a **single five-element report pipeline** (⓪–⑤) on one demo repo; each lesson consumes the previous artifact verbatim — L4's demo input is pre-staged in its own `context/` dir, so the lesson can open *in medias res* on the real research.md.
- L4 is the module's **execution-spine re-entry point**: m4-l1…l3 are read-only analysis; L4 reconnects to the m2/m3 change workflow (plan → tests → implement → verify) under legacy constraints. The novel content is the *lenses* (archetypes, migration strategies, Mikado, ADR grounding); the workflow is referenced.
- The strongest demo beat is structural: **the Branch-by-Abstraction seam already exists** in Mattermost's store decorator chain — teaching "inherit the abstraction" alongside "introduce the abstraction".

## Historical Context (from prior changes)

- `lessons/m4-l4/context/changes/post-flow-analysis/research.md` — the L3 demo output (carried over for continuity), produced via `/10x-research` controlled mode per `m4-l3/lesson-draft.md:327-332`.
- `lessons/m4-l4/handoff.md` — L2→L3→L4 process record; stop-line "Koniec L3 = dowody i ryzyko, NIE refaktor" (`:47-49`).
- Git status shows the m4-l3 copies of these context files were deleted in favor of the m4-l4 copies (continuity move, this session's working tree).

## Related Research

- `lessons/m4-l4/lesson-grounding.md` — the existing grounding brief this research treats as done.
- `lessons/m4-l4/context/changes/post-flow-analysis/research.md` — demo-side research (in-world artifact, not workbench editorial).

## Open Questions

1. **Demo continuation** — confirm L4 continues Mattermost `PostStore.Save` (artifacts pre-staged strongly imply yes) vs switching repos. → spec decision-gate.
2. **Which candidates the demo ranks** — TD-3 (god-method/archetype), TD-2 (positional arrays/BbA), TD-4 (manual layers/inherited seam) are the cleanest 3; TD-1 (model mirror) is highest-risk but edges toward L5's domain territory. → spec decision-gate.
3. **`/10x-test-plan` framing** — full foundation `test-plan.md` (its skill assumes PRD+roadmap, which Mattermost lacks) vs the risk-first characterization-test method applied per-change inside `/10x-plan`. → spec decision-gate.
4. **Toolkit ID offset** — `10x get m4l3` vs renumbering module-04 toolkit lessons before release; affects any CLI command in prose. → human decision outside the workbench.
5. **Toolkit wiring** — module-04 lesson stubs are empty; should m4-l4's pack deliver/spread the spine skills? → human decision outside the workbench.
6. **AI-refactoring claims** — if the spec wants any hard claim about AI-assisted refactoring efficacy/failure modes, run the dedicated grounding round flagged in `lesson-grounding.md:176`; otherwise keep directional framing.
7. **Feathers wording** — re-confirm verbatim seam/characterization/sprout-wrap definitions against the sample PDF before they enter prose (`lesson-grounding.md:174`).
