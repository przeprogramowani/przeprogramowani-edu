# Dry Run: element ④ → seatbelt → safe slice (m4-l4 demo rehearsal)

Goal: rehearse the lesson's full demo flow **in the correct order**: explore the risks recorded in the L3 research, rank refactor opportunities and pick one (element ④), and only then run the test-plan seatbelt and the safe-change chain. Produces raw material for the draft and video scenario.

**Order lesson (learned the hard way, 2026-06-05):** running `/10x-test-plan` directly on the whole L3 research — without a refactor decision — produced a *generic corridor QA rollout* ordered by interview-elicited fears, not by the refactor agenda (TD-2 fell to Phase 2). Tooling answers the question in its brief: no decision in, no refactor seatbelt out. The decision artifact (④) must exist first. This failed-order run is preserved below as the recorded anti-pattern — it's lesson material (beat 8 can show *why* ④ precedes the seatbelt).

## Key findings so far

**From the toolkit SKILL.md (2026-06-05):** `/10x-test-plan` runs fine on legacy without a PRD — the hard gate is a project marker; discovery reports "honest gaps"; path arguments are the documented briefing mechanism. The lesson presents this as documented brownfield behavior.

**From the failed-order run (2026-06-05, artifacts below):**

- PRD-less discovery, corridor scoping, and "signal, not knowledge" all held; the skill recommended the scoped hot-spot option and wrote a scope note into §1 itself.
- The challenger pass **refuted the round-trip test idea**: "A DB round-trip test that stays green with swapped columns (reads are by-name and forgive; writes are positional and do not)." The correct TD-2 guard is a **deterministic array-consistency check**. (Spec updated accordingly.)
- Phase 2's rationale — "cheapest set of tests … locking the most expensive debt (TD-1, TD-2) and a prerequisite for any future Posts schema work" — is the Mikado-prerequisite framing, articulated by the skill unprompted.
- Quotable beats: "coverage absence is not a failure scenario"; anchors stripped from risk sources; HEAD-anchored churn window honesty (2026-03-22 → 2026-04-21, 125 commits); live `config.go` (6) ↔ `config.ts` (6) churn corroborating the TD-1 class of risk.

## 0. Setup — run in the Mattermost checkout, not the workbench

```bash
cd /Users/admin/code/mattermost   # the L3 demo clone
git checkout 29bab2184            # pin the demo commit
# context/ already present (map/ + post-flow-analysis/ + failed-order artifacts)
```

**Reset for the clean demo order** — move the failed-order outputs aside (keep them as anti-pattern evidence, don't delete):

```bash
mkdir -p context/archive/2026-06-05-wrong-order-test-plan
mv context/foundation/test-plan.md context/archive/2026-06-05-wrong-order-test-plan/
mv context/changes/testing-silent-success-integrity context/archive/2026-06-05-wrong-order-test-plan/
# test-plan-convo.md stays in post-flow-analysis/ as the conversation record
```

## 1. Step A — Explore & rank: element ④ (NEW — this was missing)

The decision step. Input: ③ report (`post-flow-analysis/research.md`, TD-1…TD-5). Output: ranked refactor opportunities + one chosen slice.

### Reusable prompt — `/10x-new` intent block

Works for any repo/report; one placeholder (the path to the analysis you already have). The intent lives in `change.md`, so any later session re-derives the job.

```text
/10x-new refactor-opportunities

Intent: we have an analysis of this codebase that records technical debt and
structural risks: context/changes/post-flow-analysis/research.md. This change answers the question that
analysis deliberately left open: WHICH of those problems are worth fixing,
in what target shape, and in what order. We explore each recorded problem in
code and history, then rank them as refactor opportunities. Exploring only —
no refactoring happens in this change, and no decision is made during the
exploration. Output: this change's research.md, ending with a ranked
shortlist of options with trade-offs. I will read the report first; the
decision what to pursue happens afterwards, in the planning step.
```

### Reusable prompt — `/10x-research` exploration contract

Single placeholder. The agent derives the candidates from the report itself — at this point the human does not yet know what to focus on; producing that focus is the job of this research.

```text
Read the research: context/changes/post-flow-analysis/research.md — an analysis of this codebase that records
technical-debt findings and structural risks. Treat its findings as evidence
already gathered: do not re-derive them, build on them. If it references other analysis artifacts (a repository map, earlier research), read those too as priors.

Enumerate every problem the report records, however it labels them (debt
items, risks, hot spots, findings). Classify each one: a CANDIDATE is a
problem whose fix would change the structure of the code; anything else
(e.g. a missing test, a documentation gap) is not a candidate — keep it as
input for judging feasibility and cost. List your enumeration and
classification at the top of the output so I can audit it.

Then explore every candidate through three sub-agents, one lane each,
all read-only:

1. Current-shape evidence — confirm in code what shape the candidate is today:
   where the logic lives, how responsibilities mix, which abstractions or
   seams already exist. Cite file:line. Label every claim evidence /
   inference / unknown.

2. History & intentionality — dig into WHY the code is shaped this way: ADRs
   and design docs if they exist; otherwise git archaeology (git log -L,
   blame, PR rationale in commit messages). Verdict per candidate:
   intentional constraint (a load-bearing decision) vs accidental cruft — or
   an honest unknown.

3. Migration feasibility — what an incremental, reversible path would require
   (existing seam vs new abstraction), what the report's blast-radius data
   implies, what guards/tests already exist around it (check CI config for
   relevant checks), and what the first prerequisite step would be.

Hard boundaries:
- No code changes. No refactor execution. Evidence before interpretation.
- Do not design target architecture beyond naming a right-sized target shape
  per candidate. If a candidate's real fix is a redesign of business concepts
  rather than code structure, say so and stop there — that is a different,
  later analysis.
- Where data is missing, write unknown — do not fill gaps with plausible
  guesses.

Synthesis (after all three lanes report): write research.md in this change
folder. Per candidate: current shape (with evidence), intentionality verdict,
feasibility notes. Close with a section titled "Refactor opportunities"
containing the 2-3 strongest candidates, ranked — for each: current → target
shape, why it earns its rank (cost of the debt vs cost of the change), blast
radius, incremental path sketch, first prerequisite step. Also list the
candidates you considered and rejected, with one line on why. Rank using the
evidence. Do NOT ask me to choose, confirm, or proceed — end by pointing me
to the report. The ranking is a proposal for a separate planning session
that happens after I have read it, not a request for sign-off.
```

### Step A results — EXECUTED 2026-06-05 (`mattermost/context/changes/refactor-opportunities/research.md`)

Checklist resolutions:

- [x] **Enumeration audit** — better than spec'd: P1–P7, including two problems the report recorded only implicitly (P6 missing CI guard → became C2's prerequisite; P7 scheduled-posts duplication). TD-5 correctly classified as feasibility input. Audit table at top, fully usable (`research.md:30-44`).
- [x] **Business-concepts boundary fired — on P7, not TD-1**: scheduled-post validation unification stopped at "business-behavior redesign — a different, later analysis" (`research.md:140,186`). TD-1 stayed structural because the agent reframed its fix as a *detect-only drift gate* instead of codegen redesign (`research.md:166-172`). The DDD bridge-out emerges from P7.
- [x] **Lanes held**; intentionality verdicts came with commit evidence: C2 intentional (`27d536b212`, 2020 bulk-insert performance decision), C4's manual-ness intentional, C1 accidental (2023 monorepo-merge inheritance), C3 accidental accretion (430 commits, no split event) (`research.md:51,90-93,108-110,128-130`).
- [x] **Open question 308 resolved**: NO guard exists — upgraded from suspicion to fact (`research.md:86,148`).
- [x] **④ location decided**: the ranked section lives inside the change's `research.md` (canonical answer for the lesson).

Headline findings beyond the checklist:

1. **The ranking overturned the human prior.** C2/TD-2 — our expected demo slice — was **rejected as a refactor**: evidenced intentional design, zero bugs in six years → "the right-sized response is a guard, not a refactor" (`research.md:184`). C4 ranked #1 on a **realized** failure mode: `searchlayer` overrides `Save` but not `SaveMultiple` — batch saves are silently unindexed *today* (`research.md:52,124,158-164`). The intentionality lens did exactly what the lesson claims it does — and it changed the decision.
2. **Three corrections to the L3 report**: two coupled arrays, not three; the Post contract is a three-way drift surface (Go ↔ TS ↔ OpenAPI); `localcachelayer` *is* tested — the hole is specifically searchlayer (`research.md:144-150`). Deep Focus findings are inputs, not gospel — another teaching beat.
3. **Flow deviation → fixed in the contracts above**: the run still ended by demanding an immediate confirm/rerank; the human decided under pressure, without reading first (the `## Decision` section at `research.md:226` was added that way). Decision now moves to the planning step — research delivers the report, full stop.

## 2. Step B — Read the report, then decide in /10x-plan (NEW — decision moved out of research)

The human reads `research.md` first — away from the agent, no gate pressing. This *is* the prework [1.3] move (generation-then-comprehension); the lesson should name it. Then:

```
/10x-plan refactor-opportunities
```

`/10x-plan` reads the sibling `research.md` automatically and scales its interview down (upstream research present → fewer questions). **The decision gate happens in its interview**: which opportunity to pursue (the ranking proposes C4 — the human may still rerank, e.g. weigh C1's compounding value across 58 mirrored types), what is in/out of the slice, trade-offs challenged. Output: `plan.md` for the chosen slice — expected shape for C4: (1) resolve the SaveMultiple-indexing impact question (the ranked item's "first prerequisite step"), (2) characterization test `searchlayer.Save→indexPost`, (3) generator-emitted completeness assertion under the existing `check-store-layers` gate, (4) triage the assertion's initial failures (incl. the `SaveMultiple` override decision).

**Results**:
- /Users/admin/code/mattermost/context/changes/refactor-opportunities/plan.md
- /Users/admin/code/mattermost/context/changes/refactor-opportunities/plan-brief.md
- /Users/admin/code/mattermost/context/changes/refactor-opportunities/refactor-planning-convo.md

### Step B results — EXECUTED 2026-06-05

Checklist resolutions (evidence: `refactor-planning-convo.md`, `plan-brief.md`, `plan.md`):

- [x] **Decision question asked, not assumed** — the research's "my proposal, your decision" label converted ranking-acceptance into explicit Q1 (plan scope) instead of an assumption (`refactor-planning-convo.md:20,86`). The Step A flow fix worked exactly as designed.
- [x] **Interview challenged trade-offs** — 7 questions, all solution-design (zero diagnostics re-asked; budget scaled down by the upstream research, skill Step 1.0). Caveat worth keeping: **all 8 recommendations were accepted as offered** — the convo itself flags anchoring risk ("a future session could deliberately stress-test one ⭐ pick", `:88`). Honest [1.3] material for the lesson.
- [x] **Slice stayed narrow** — scope = C4 guard + C2 quick-win assertion; an explicit "What We're NOT Doing" fence (no C1/C3, no `NamedExec` migration, no fixes beyond `SaveMultiple`, triage bounded to exempt-or-file-follow-up) (`plan.md:33-41`).
- [x] **Decision recorded visibly** — `plan-brief.md` Key Decisions table with a Source column (Research vs Plan); full decision ledger in the convo (`:70-82`).

Headline findings:

1. **Planning-time investigation upgraded the prerequisite into evidence**: the SaveMultiple gap is a **confirmed live production bug** — bulk import is its only caller (3 sites), no auto-reindex after import, and sqlstore's `Save→SaveMultiple` delegation sits *below* searchlayer so the override can't double-index (`refactor-planning-convo.md:48`). New evidence against a conditional decision triggered an explicit extra question (Q7) instead of silent rule application — a teachable verification beat.
2. **Third iteration of test-design sharpening**: round-trip (refuted in the wrong-order run) → `reflect.Kind` check (research sketch) → **sentinel-value identity** (planning: 4/18 columns are JSON-serialized so kind checks false-positive, and same-kind adjacent swaps false-negative) (`refactor-planning-convo.md:56`). The guard design improved at every pipeline stage — a lesson thread in itself.
3. **Planner refinements with Mikado flavor**: hard-fail generator validation (actionable exit message) instead of a rubber-stampable porcelain diff, plus **opt-in-per-layer activation** so the mechanism lands green before triage flips enforcement on (`refactor-planning-convo.md:55`; `plan.md:52`).
4. **Feathers order is visible in the plan itself**: Phase 2 pins `Save→indexPost` with a characterization test *before* touching the file ("pin it before touching… not alongside", `plan.md:98`).

## 3. Step C — Seatbelt: /10x-test-plan with the decision in its brief (TO TEST — do not pre-judge)

**Preliminary observation (not a verdict)**: the Step B plan already carries the seatbelt as explicit, verifiable phases (Phase 1 sentinel test + mutation check, Phase 2 characterization-before-fix, Phase 3 tripwire-tested mechanism, Phase 4 triage + tripwire — `plan.md:54-231`). The open empirical question: what does a `/10x-test-plan` run **add** on top of that — a project-level QA foundation (risk map beyond this change, quality-gates table, cookbook patterns, negative space §7, orchestration of the future C1/C3 phases), or mostly duplication of the plan's phases? Run it and see:

```
/10x-test-plan context/changes/refactor-opportunities/plan-brief.md context/changes/refactor-opportunities/research.md context/changes/post-flow-analysis/research.md
```

**Results**:
- /Users/admin/code/mattermost/context/foundation/test-plan.md
- /Users/admin/code/mattermost/context/foundation/test-plan-convo.md

### Step C results — EXECUTED 2026-06-05 (`mattermost/context/foundation/test-plan.md` + `test-plan-convo.md`)

Checklist resolutions:

- [x] **Interview derived from the refactor agenda** — all five answers converge on one theme the convo itself names: *silent failure* (`test-plan-convo.md:74-75`). Risk #1 = the manual-layer passthrough with the realized bulk-import bug, citing `refactor-opportunities/research.md §C4` + the plan-brief (`test-plan.md:51`). Night-and-day vs the wrong-order run's generic fears.
- [x] **No duplication — the orchestrator ADOPTED the existing plan**: "Phase 1 adopts the pre-existing `refactor-opportunities` change, whose approved plan already delivers this phase's goal — opening a duplicate folder would be waste" (`test-plan.md:73-75`; decision ledger #2 in the convo). Status set to `implementing`, handoff = `/10x-implement refactor-opportunities phase 1`. **The two skills compose instead of competing** — this was the unknown, and it resolved cleanly.
- [x] **What test-plan adds that `plan.md` lacks** — confirmed, substantial:
  - **Backlog orchestration**: the ④ runners-up become rollout phases — Phase 2 = C1 drift gate, Phase 3 = error-path & leakage coverage, Phase 4 = extend the proven guards class-wide (`test-plan.md:77-82`). The ranked-opportunities list gets a delivery vehicle, not just a memory.
  - **A genuinely new risk**: #6 per-recipient sanitization leak (abuse lens) — surfaced by neither research nor plan; challenger pass reframed it with an honest coverage-unknown flag (`test-plan.md:56`; convo challenger findings).
  - **Oracle-problem enforcement**: Risk #5's guidance demands contract-sourced oracles, explicitly rejecting characterization of possibly-wrong error branches (m3-l1 continuity, applied unprompted).
  - Quality-gates table tying each new guard to its activation phase; cookbook placeholders; negative space; freshness ledger with a stale-checkout refresh trigger.
- [x] **A/B contrast with the wrong-order run is perfect lesson material**: same skill, same repo, same author — decision-free brief → generic QA rollout + a duplicate change folder; decision-rich brief → refactor-aligned risk map + adoption of the existing plan. The brief is the variable; the artifact is the proof.

### Step C verdict — FINAL (user-confirmed 2026-06-05): test-plan OUT of the core demo path → Deep Dive as the "campaign extension"

The run proved the *mechanics* (composition works: adoption instead of duplication, exact handoff, ④ backlog orchestrated) — but proving the mechanics also revealed that the value is **future-facing**, and that decided its placement in the lesson:

1. **It doesn't change what gets delivered.** The plan already owns the seatbelt; the executed slice is identical with or without the test-plan run. Its payoff (backlog orchestration, project QA memory, quality-gates activation map) materializes over a months-long campaign, not in the lesson's one safe slice.
2. **Cognitive load is at the ceiling.** Core already carries: anti-pattern → lenses → ranking → read-then-decide → plan → implement. An 8-section QA foundation via a 5-question interview is a whole extra act — and it re-treads m3-l1, where the skill was taught.
3. **The adoption behavior is elegant but subtle.** Explaining *why* it adopted the plan means explaining the skill's state machine — orchestration plumbing, not refactoring content; exactly the "tool becomes the topic" trap the module conventions ban. It's also emergent behavior: a misfire gives a learner duplicate folders mid-exercise.
4. **The teaching value is already captured as shown evidence.** The wrong-order run = the anti-pattern ("tooling without a decision"); this run = the A/B contrast (same skill, decision-free vs decision-rich brief). Both work on screen without learners reproducing them.

The L3 handoff said *"Może followup do 10x-test-plan"* — maybe. The dry run answered the maybe: **it composes, and it belongs to the campaign moment (committing to the whole ④ backlog), not the first-slice moment.**

**Lesson placement:**
- **Core demo + Zadania praktyczne**: the 4-step flow — `/10x-research` (options) → read → `/10x-plan` (decide + plan) → `/10x-implement` (one safe slice). Straightforward, deliverable, repeatable on the learner's own L3 report.
- **🔎 Deep Dive — "Od jednego kroku do kampanii"**: `/10x-test-plan` as the extension for when ④ has more than one opportunity worth pursuing — formalize the rollout, let it adopt the existing plan as Phase 1 and orchestrate the runners-up (C1 drift gate, error-path coverage, class-wide guards). Evidence shown: the A/B contrast of the two runs + the adoption beat. References m3-l1 for the skill itself; no interview re-run on screen.
- **Anti-pattern beat (core)**: the wrong-order run stays in core as the "tooling without a decision" proof — it needs no test-plan teaching to land.

## 4. Step D — execution: OUT OF LESSON SCOPE (user decision, 2026-06-05)

**The lesson does not run the implementation.** Execution is a *detail* relative to what L4 teaches — the steps before it. The reasoning, for the spec/draft:

1. **The lesson's actual job ends with the decision pipeline**: recorded problems → explored options → read → decided + planned with a safety net. That pipeline is what's new in L4; it's where learners fail today (big-bang prompts, ungrounded "modernize", deciding without reading).
2. **Execution mechanics are already owned elsewhere**: `/10x-implement`'s phase gates and commit ritual are m2-l2; test generation and deliberately-breaking-to-verify are m3-l2. Running them on screen would re-teach known material and dilute the new content.
3. **The plan IS the demonstrable artifact.** A guard-first, phased, independently-revertible `plan.md` with explicit verification criteria per phase (mutation check, characterization-before-fix, tripwire) *shows* "testy, zmiany, weryfikacja" as designed properties — the learner can see the safety story without watching 4 phases execute.
4. **The lesson ends on the handoff**: `/10x-implement refactor-opportunities phase 1` on the clipboard — the moment the new pipeline plugs into the cycle the learner already runs. That's the bridge, not a demo segment.

Consequences:
- **Zadania praktyczne end at the plan** (+ the handoff command), not at executed phases.
- **Spec beat 10 reframes** from "one slice ships" to "the handoff: the plan plugs into the known execution cycle"; learning outcome about executing a slice becomes producing the guard-first plan + handoff.
- The m4-l5 bridge-in assumption ("wiesz, jak prowadzić zmianę z Agentem, testami i weryfikacją") is satisfied by the plan's designed verification story + the known m2/m3 mechanics — no live execution required.
- Executing phases 1–4 in the Mattermost checkout remains **optional author verification** (b-roll / confidence), not lesson material and not a dry-run prerequisite.

## 5. Implications for lesson-spec / draft

1. **Order is the lesson**: explore (options) → read → decide in plan → execute guard-first. The archived wrong-order run remains the recorded anti-pattern; Step A adds the positive proof (history grounding changed the decision); Step B adds the process proof (decision gate in the plan interview, evidence-driven Q7).
2. **Spec rework fully unblocked** (Step C verdict final; Step D out of lesson scope): core flow = research → read → plan → **handoff** (no execution on screen); the demo's deliverable = the C4 guard-first `plan.md` (+ C2 sentinel quick-win as a planned phase); TD-2/C2 = the *intentionality/right-sizing* beat ("guard, don't reshape" — evidenced); decision gate in `/10x-plan`; `/10x-test-plan` → Deep Dive as the campaign extension (+ wrong-order anti-pattern stays in core); P7 = the DDD bridge-out.
3. **Test-design sharpening thread** (round-trip → kind check → sentinel identity) is a candidate recurring motif across beats 8–10.
4. **Video scenario**: three replay-grade logs now exist — `test-plan-convo.md` (anti-pattern segment), Step A research run, `refactor-planning-convo.md` (decision segment). Step D needs its own capture.

## Needs human decision

- ~~Step C shape~~ — **resolved 2026-06-05, user-confirmed after the empirical run**: test-plan out of the core demo path, recommended for Deep Dive as the campaign extension (full reasoning in §3's verdict).
- **Spec rework** (beats 7–10, demo section, learning outcomes, References Only) — unblocked; pending go-ahead.

## Artifacts ledger

| Artifact | Status |
|---|---|
| `mattermost/context/changes/post-flow-analysis/research.md` | ③ input (L3) |
| `mattermost/context/changes/post-flow-analysis/test-plan-convo.md` | conversation record of the wrong-order run |
| `mattermost/context/archive/2026-06-05-wrong-order-test-plan/` | anti-pattern evidence (test-plan.md + phase-1 change folder) |
| `mattermost/context/changes/refactor-opportunities/research.md` | ✅ Step A output (ranked options; premature Decision section removed — the decision emerges in Step B) |
| `mattermost/context/changes/refactor-opportunities/plan.md` + `plan-brief.md` | ✅ Step B output (4 phases, guard-first, narrow slice) |
| `mattermost/context/changes/refactor-opportunities/refactor-planning-convo.md` | ✅ Step B process log (replay-grade) |
| `mattermost/context/foundation/test-plan.md` + `test-plan-convo.md` | ✅ Step C output (decision-rich brief; adopted the existing plan as rollout Phase 1; ④ backlog orchestrated as Phases 2-4) |
| guard implementation (sentinel test, characterization + override, mechanism, triage) | **out of lesson scope** — optional author verification only (§4) |

Afterwards, copy the produced artifacts back into `lessons/m4-l4/context/` deliberately — they become the canonical L4 demo state the video scenario will replay (including the archived wrong-order run, which the lesson references as the anti-pattern).
