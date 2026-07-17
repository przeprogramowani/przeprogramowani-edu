# M3L4 /10x-e2e Reframe — Implementation Plan

## Overview

Reframe `lessons/m3-l4/lesson-draft.md` ("Testy E2E: Playwright, MCP i multimodalne scenariusze") so it teaches `/10x-e2e` as it now exists in the toolkit: a **plan-execution skill, the E2E sibling of `/10x-implement` and `/10x-tdd`**, not a generator wrapper. The lesson currently calls `/10x-e2e` "the thing that generates tests" and reproduces the full prompt template + worked example inline (now owned by the skill's `references/`).

The reframe **mirrors m3-l2's `/10x-tdd` section** ("Opcjonalny skill dla nowych funkcjonalności: `/10x-tdd`"): same-plan / same-`## Progress` framing, a decision diagram, PLAN→GENERATE→REVIEW→VERIFY loop (the analogue of RED→GREEN→REFACTOR), an eligibility gate (where it fits / where it redirects), deliberate-break verification (the analogue of m3-l2's "weryfikacja asercji przez celowe psucie"), and interleaving modes in one plan.

Scope: one lesson draft + a light, target-only schema touch + the workbench editorial handoff. No other lesson changes; no toolkit changes (the skill is already shipped).

## Current State Analysis

### What the skill is now (source of truth)

`/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-e2e/SKILL.md` — the skill:

- **Drives an approved `context/changes/<change-id>/plan.md` phase by phase, one risk at a time** (SKILL.md:21-34). It is the "E2E sibling of `/10x-implement` and `/10x-tdd`" — same plan, same canonical `## Progress`, same per-phase commit ritual and clipboard handoffs (SKILL.md:32, 328-331).
- Inner loop is **PLAN → GENERATE → REVIEW → VERIFY** (SKILL.md:25-30, 221-255):
  - **PLAN** — pick the risk, map the flow via the Playwright Planner *or* the prompt template (two strategies, same contract).
  - **GENERATE** — turn the flow into a test from the **seed exemplar + E2E rules** (the two quality levers).
  - **REVIEW** — check against the **five anti-patterns**, re-prompt by name.
  - **VERIFY** — run green, then a **deliberate break**: invert the production behavior the risk targets and confirm the test goes red (SKILL.md:250).
- **Eligibility gate before every phase** (SKILL.md:128-217): (1) browser-level fit (crosses auth/routing/API/DB or lives only in rendered UI), (2) feature already built & app runnable, (3) no passing E2E test yet. If a phase fails the gate, it **redirects to `/10x-tdd` or `/10x-implement`**, or stops.
- Assumes Playwright installed + app runnable; **creates the seed + rules levers on first use** from `references/`, but scaffolds nothing else (SKILL.md:50-56, 113-116).
- Heavy content lives in `references/`: `e2e-prompt-template.md`, `seed-test-pattern.md`, `e2e-quality-rules.md`, `e2e-anti-patterns.md`, `playwright-agent-pipeline.md`.

### What the lesson says today (`lessons/m3-l4/lesson-draft.md`)

- Intro + "Jak agent widzi aplikację" (CLI, accessibility tree, `storageState`) — **accurate, keep.** (lines 1-109)
- "Od ryzyk do testów E2E" (lines 111-123) — risk→E2E heuristic, E2E≠zero mocking, "nie generujesz od zera", conservative count. **Good spine, keep.**
- "Planner, generator, healer" (125-163) — introduces `/10x-e2e` as the thing that *generates* tests; planner/generator/healer + seed handoff + 10xCards example. **Needs reframe:** `/10x-e2e` is now the plan-executor; planner→generator is one PLAN strategy inside the loop.
- "Seed test i reguły jakości" (165-212) — seed 4 patterns + rules + Debbie O'Brien. **Keep as teaching** (owned concept); reposition as the GENERATE levers.
- "Szablon promptu dla E2E" (214-288) — **full inline prompt template + worked example.** **Remove** per decision; replace with a thin pointer to the skill, reframed as the prompt-template PLAN path.
- "Pięć antywzorców E2E od agenta" (290-313) — five anti-patterns. **Keep as teaching** (owned concept); reposition as the REVIEW checklist.
- "Re-prompting" (315-333) — re-prompt discipline + one example + V3b video placeholder. **Keep trimmed**, position inside REVIEW, point to skill reference.
- "Izolacja danych testowych" (335-351) — data isolation. **Keep.**
- "MCP i tryb wizyjny" (353-415), "E2E w pipeline jakości" (417-447) — **mostly keep**; the pipeline/healer section needs one consistency pass against the new framing.
- Zadania praktyczne (450-508) — task "Scenariusze E2E z mapy ryzyk" frames the skill as "Szablon promptu vs Planner→Generator variants"; **update to the plan-execution model** + add a deliberate-break check. Optional "Dostosuj `/10x-e2e`" task stays.
- Deep Dive "Workflow E2E jako skill" (616-632) — teaches "build your own skill"; **reframe** to the new conception (the skill IS a plan-executor sibling; the build-your-own angle stays for non-Playwright stacks).

### Key Discoveries

- **The exact pattern to copy** lives in `lessons/m3-l2/lesson-draft.md:152-268` ("Opcjonalny skill dla nowych funkcjonalności: `/10x-tdd`"): download command → "reads the same `plan.md`, same `## Progress`, same phases as `/10x-implement`, only changes order" → decision mermaid → value (agent reveals assertion before code) → simple rule → where it fits / where not → "assumes test env exists" → interleaving modes example sharing one `## Progress`.
- **m3-l2 already has the deliberate-break beat** ("weryfikacja asercji przez celowe psucie", m3-l2:148) and explicitly cross-references M3L2 throughout m3-l4 — so the VERIFY/deliberate-break bridge is continuity, not a new concept.
- **The prior revision** (`context/changes/m3l4-todo-revision/`, status `implemented`) already moved rules/anti-patterns/seed into the skill and slimmed the re-prompt — but **kept the inline prompt template** and described the skill as a generator. This change finishes the job for the *new* skill shape.
- **Schema slot `m3-l4`** `owns` + `learningOutcomes` still describe a "planner→generator workflow" and "generuje scenariusze E2E przez workflow planner→generator" (learningOutcomes[3]) — no mention of plan-execution or the sibling relationship. Light update needed.
- **Working copy is mid-editorial-polish** (`git diff` shows em-dash/wording tweaks across the draft, schema has a small uncommitted diff). These are cosmetic and do not collide with the structural reframe; edit the working copy as-is.
- **`requiredArtifacts`** for m3-l4 = `lesson-spec, lesson-draft, video-scenario, rc-review`. The reframe materially changes the draft → it needs `lesson-editor-pl` then `lesson-rc-review` (memory: editor before RC, sequential — `feedback_editor_before_review.md`).

## Desired End State

- M3L4 introduces `/10x-e2e` as the **E2E sibling of `/10x-implement` and `/10x-tdd`** — reading the same `plan.md`, mutating the same `## Progress`, swapping the inner loop for **PLAN→GENERATE→REVIEW→VERIFY** at the browser level, gated by the eligibility check, with deliberate-break verification and interleaving modes — explained with the same structure m3-l2 uses for `/10x-tdd`.
- The inline prompt template + worked example are **gone**; a short pointer presents the prompt-template path as one PLAN strategy owned by the skill.
- Seed + rules read as the **GENERATE** levers; the five anti-patterns as the **REVIEW** checklist; re-prompting as a REVIEW move that points at the skill reference; deliberate-break as **VERIFY**.
- Zadania praktyczne and the "Workflow E2E jako skill" Deep Dive are consistent with the plan-execution framing.
- `lessons-schema.json` `m3-l4` slot reflects the plan-execution / sibling framing (`owns` + `learningOutcomes`), target slot only.
- Side-effect ledger produced; lesson staged for `lesson-editor-pl` → `lesson-rc-review`.

### Verification

- `grep -n 'plan-execut\|/10x-implement\|/10x-tdd' lessons/m3-l4/lesson-draft.md` shows the sibling framing present.
- The inline prompt template heredoc is gone: `grep -n 'Research anchor:' lessons/m3-l4/lesson-draft.md` returns nothing (that phrase only existed in the inline template + worked example).
- `python3 -c "import json; json.load(open('lessons-schema.json'))"` parses; `git diff lessons-schema.json` touches the `m3-l4` slot only.
- Canonical section order intact per `references/lesson-structure.md`.

## What We're NOT Doing

- **Not** touching the toolkit — the skill, its references, the thin `CLAUDE-m3l4`, and `lesson-04.ts` are already shipped (prior revision, commit `56e774b`). This is lesson + schema only.
- **Not** re-teaching `/10x-implement` or `/10x-tdd` (m3-l2 / m1 own them) — only positioning `/10x-e2e` against them.
- **Not** re-opening the vision boundary (m3l4-todo-revision settled it: light supplement here, model material in M3L5).
- **Not** changing any schema slot other than `m3-l4`; **not** changing learning-outcome *intent*, only wording to match the skill shape.
- **Not** changing lesson order, the CLI download command (`npx @przeprogramowani/10x-cli@latest get m3l4`), or the seed-test code example.
- **Not** running `lesson-editor-pl` / `lesson-rc-review` inside this plan — staged as the Phase 5 handoff.
- **Not** re-recording video scenarios; note any video/text mismatch in the ledger (esp. V3b at the re-prompt beat).

## Implementation Approach

Contract-first, then prose, then handoff — the workbench order. Schema moves first (Phase 1) so the lesson is written against an accurate contract. Then the prose reframe lands in two passes: the **new conceptual spine** (Phase 2 — introduce the sibling skill, the loop, the gate, the decision diagram, interleaving) and the **mapping of existing levers onto that loop** (Phase 3 — seed/rules as GENERATE, anti-patterns/re-prompt as REVIEW, deliberate-break as VERIFY, remove the inline prompt template). Phase 4 aligns the downstream sections (pipeline, tasks, Deep Dive). Phase 5 is the ledger + editor/RC handoff.

The reframe is **structural editing of existing good prose**, not a rewrite — preserve the lesson's voice, examples (10xCards), and the sections that are already accurate (CLI, accessibility tree, `storageState`, vision, pipeline). Read `references/lesson-structure.md` and `src/content/lessons10xDevs3Prework/style.md` before editing, and `lessons/m3-l2/lesson-draft.md:152-268` as the pattern exemplar.

## Critical Implementation Details

- **Diagram numbering.** Phase 2 adds one decision mermaid (parallel to m3-l2's `/10x-tdd` diagram). The four existing diagrams carry `<!-- rendered: ...-N-10x.png -->` comments numbered by document order; inserting a diagram mid-document shifts the trailing numbers. Do **not** hand-edit the rendered PNGs — author the mermaid block with a placeholder `<!-- rendered: TODO -->` comment and flag a follow-up render via the `mermaid` skill in the Phase 5 handoff (the `mermaid` skill owns extraction + renumber + SVG/PNG). Keep the existing four diagrams' content; only the new one is net-new.
- **Don't strand cross-references.** Several sections point at each other ("section wyżej", "Szablon promptu dla E2E", "wrócimy do tego przy seed teście"). Removing the inline template and renaming subsections can leave dangling pointers — sweep every internal reference after the structural edits (Phase 3 success criteria).
- **Bridge, don't duplicate, m3-l2.** The deliberate-break beat, the "test that passes today but breaks tomorrow" framing, and the re-prompt discipline are introduced in m3-l2; here they are *lifted to E2E*. Reference M3L2 explicitly (the draft already does) rather than re-explaining from scratch.

## Phase 1: Schema — plan-execution framing (m3-l4 slot only)

### Overview
Realign the `m3-l4` curriculum contract so the lesson is written against an accurate description of `/10x-e2e`. Target slot only (workbench rule).

### Changes Required:

#### 1. m3-l4 `owns` + `learningOutcomes`
**File**: `lessons-schema.json` (slot `lessonId: "m3-l4"`)

**Intent**: Encode that `/10x-e2e` is a plan-execution skill — the E2E sibling of `/10x-implement` and `/10x-tdd` — driving `plan.md` phases through PLAN→GENERATE→REVIEW→VERIFY with an eligibility gate, rather than a one-shot planner→generator workflow.

**Contract**:
- `owns`: revise the Playwright Test Agents line and the seed-test line so planner/generator/healer reads as **one PLAN strategy inside `/10x-e2e`'s loop**, and add a line naming `/10x-e2e` as "the risk-driven E2E plan-execution skill — sibling of `/10x-implement`/`/10x-tdd`, shared `plan.md`/`## Progress`, PLAN→GENERATE→REVIEW→VERIFY, eligibility gate, deliberate-break verification." Keep the existing seed/rules-as-levers ownership.
- `learningOutcomes`: revise outcome [3] ("generuje scenariusze E2E przez workflow planner→generator…") so it reads as driving the relevant plan phases with `/10x-e2e` (PLAN via planner→generator *or* the prompt template) and verifying each test against its risk via deliberate break. Keep outcomes [0],[1],[2],[5],[6],[7] (CLI, seed, rules, storageState, vision, CLI-vs-MCP) intact.
- `referencesOnly`: confirm the m3-l2 reference line still reads correctly (it now also covers `/10x-tdd` as the sibling whose pattern this lesson mirrors); enrich only if needed.
- Do **not** touch `mustNotCover`, `dependsOn`, `preparesFor`, `videoPlaceholders`, or any other slot.

### Success Criteria:

#### Automated Verification:
- Schema is valid JSON: `python3 -c "import json; json.load(open('lessons-schema.json'))"`.
- Diff touches the `m3-l4` slot only: `git diff lessons-schema.json` shows no other `lessonId` object changed.

#### Manual Verification:
- `owns` + `learningOutcomes` describe `/10x-e2e` as a plan-execution sibling of `/10x-implement`/`/10x-tdd`, and planner→generator as a PLAN strategy — not as the whole skill.
- No contradiction introduced with `mustNotCover` or the existing seed/rules/vision ownership.

**Implementation Note**: After automated verification passes, pause for the author to confirm the manual items before Phase 2.

---

## Phase 2: Reframe the spine — /10x-e2e as the plan-execution sibling

### Overview
Replace the "Planner, generator, healer" framing with the conceptual spine that mirrors m3-l2's `/10x-tdd` section: introduce `/10x-e2e` as the E2E sibling of `/10x-implement` and `/10x-tdd`, present the PLAN→GENERATE→REVIEW→VERIFY loop and the eligibility gate, relocate the CLI download here, and add a decision diagram + interleaving-modes example.

### Changes Required:

#### 1. New sibling-skill framing (reframe "Planner, generator, healer")
**File**: `lessons/m3-l4/lesson-draft.md` (current lines ~125-163, plus the download block currently at ~220-226)

**Intent**: Introduce `/10x-e2e` the way m3-l2 introduces `/10x-tdd` — as a plan-executor that reads the same `plan.md`, mutates the same `## Progress`, and runs the same phases as `/10x-implement`/`/10x-tdd`, but swaps the inner loop for browser-level PLAN→GENERATE→REVIEW→VERIFY. Keep planner/generator/healer, demoted to one PLAN strategy.

**Contract**:
- Lead with the sibling relationship and the shared-`plan.md`/`## Progress` framing (parallel to m3-l2:166-193). Name the loop PLAN→GENERATE→REVIEW→VERIFY and one-line each step. Explicitly cross-reference `/10x-tdd` (M3L2) and `/10x-implement`.
- Fold in the **eligibility gate**: a risk gets E2E only when it (a) crosses several system boundaries or lives only in the rendered UI, (b) the feature is already built and the app runs, (c) no passing E2E test exists yet — otherwise `/10x-e2e` redirects to `/10x-tdd` / `/10x-implement`. Keep this tight; the skill owns the full gate.
- Relocate the CLI download block (`npx @przeprogramowani/10x-cli@latest get m3l4`) into this section as the moment the learner gets the skill (it currently sits inside the to-be-removed "Szablon promptu" section).
- Keep planner/generator/healer as the PLAN/GENERATE machinery for the "let the agent explore" path; keep the 10xCards risk example (data-loss-after-reload, auth-gate redirect).
- Add the **interleaving-modes** beat (parallel to m3-l2:255-264): one plan, phases driven by `/10x-implement`, `/10x-tdd`, and `/10x-e2e`, all sharing one `## Progress`.

**Contract (diagram)**: add one decision mermaid in this section — "is the risk browser-level AND is the feature built? → `/10x-e2e`; isolated function / not built → `/10x-tdd` or `/10x-implement`" — styled like the existing diagrams. Use a placeholder `<!-- rendered: TODO -->` comment; rendering is a Phase 5 follow-up via the `mermaid` skill. Keep the existing planner→generator→review flow diagram (it now illustrates the PLAN/GENERATE machinery).

### Success Criteria:

#### Automated Verification:
- Sibling framing present: `grep -n '/10x-implement\|/10x-tdd\|PLAN.*GENERATE.*REVIEW.*VERIFY\|## Progress' lessons/m3-l4/lesson-draft.md` returns hits in the reframed section.
- Download command present exactly once and in the new section: `grep -n 'get m3l4' lessons/m3-l4/lesson-draft.md`.
- New mermaid block added with a placeholder render comment: `grep -n 'rendered: TODO' lessons/m3-l4/lesson-draft.md`.

#### Manual Verification:
- A reader who knows `/10x-tdd` from M3L2 recognizes `/10x-e2e` as its E2E sibling within the first two paragraphs.
- The eligibility gate and redirect read clearly and don't overflow into re-teaching `/10x-tdd`/`/10x-implement`.
- The 10xCards example and the planner/generator/healer mechanics survive, now positioned inside the loop.

**Implementation Note**: Pause for author confirmation of the manual items before Phase 3.

---

## Phase 3: Map the levers onto the loop + remove the inline prompt template

### Overview
Position the existing teaching sections as steps of the loop, remove the inline prompt template + worked example (replace with a thin pointer), and add the deliberate-break VERIFY beat bridged from m3-l2.

### Changes Required:

#### 1. Remove the inline prompt template + worked example → thin pointer
**File**: `lessons/m3-l4/lesson-draft.md` ("Szablon promptu dla E2E", current lines ~214-288)

**Intent**: The skill's `references/e2e-prompt-template.md` is the single source. The lesson keeps only a short prose pointer presenting the prompt-template path as one PLAN strategy.

**Contract**:
- Delete the two ```text blocks (the template, ~lines 230-250, and the 10xCards worked example, ~256-282) and the surrounding prose that narrates them.
- Replace with 2-3 sentences: when you want a single test without initializing the Planner→Generator agents, `/10x-e2e` fills its prompt-template (risk, research anchor, business scenario, real-vs-mocked boundaries) for you; the contract is identical to the planner path. Keep the one-sentence bridge to the unit-test prompt discipline from M3L2 (the draft's existing comparison at ~lines 286-288), shortened.
- After removal, ensure the "two PLAN strategies" idea (planner→generator vs prompt-template) reads coherently with Phase 2 (cross-reference, don't re-explain).

#### 2. Seed + rules as the GENERATE levers
**File**: `lessons/m3-l4/lesson-draft.md` ("Seed test i reguły jakości", ~lines 165-212)

**Intent**: Reposition the section as the **GENERATE** step's two quality levers without losing the teaching (owned concept). Keep the seed code example and the four patterns.

**Contract**: Light edits — a lead sentence tying seed + rules to the GENERATE step of the loop; keep the four patterns, the seed `seed.spec.ts` example, the Debbie O'Brien evidence, and the "thin pointer in the project rules file + skill reference" framing (already aligned with the shipped thin `CLAUDE-m3l4`). No content removal.

#### 3. Five anti-patterns as the REVIEW checklist + re-prompt as a REVIEW move
**File**: `lessons/m3-l4/lesson-draft.md` ("Pięć antywzorców…", ~lines 290-313; "Re-prompting", ~315-333)

**Intent**: Position the five anti-patterns as the **REVIEW** step's checklist and re-prompting as how you fix what REVIEW finds, pointing at the skill's `e2e-anti-patterns.md` reference.

**Contract**: Light edits — a lead sentence framing the five anti-patterns as the REVIEW checklist `/10x-e2e` runs; keep the five-item teaching. Keep the slimmed re-prompt (one example + "name the anti-pattern, say why it doesn't protect the risk, give the target pattern", pointing at the skill reference) and the V3b VIDEO PLACEHOLDER; verify the placeholder still matches the slimmed text (note any mismatch in the ledger).

#### 4. Deliberate-break VERIFY beat
**File**: `lessons/m3-l4/lesson-draft.md` (within the loop framing — end of the REVIEW/anti-pattern area or a short VERIFY paragraph)

**Intent**: Add the **VERIFY** step — run green, then deliberately invert the production behavior the risk targets and confirm the test goes red — explicitly bridged from m3-l2's "weryfikacja asercji przez celowe psucie" (m3-l2:148) and the existing control question ("czy ta asercja padnie, jeśli ryzyko się zmaterializuje?").

**Contract**: 2-4 sentences. Tie it to the existing control question already in the draft (~line 303); name it as the same discipline as M3L2's deliberate-break, lifted to E2E; note `/10x-e2e` runs and then reverts the break automatically (never commits it).

### Success Criteria:

#### Automated Verification:
- Inline template gone: `grep -n 'Research anchor:\|Mocked boundaries' lessons/m3-l4/lesson-draft.md` returns nothing.
- Deliberate-break beat present: `grep -n -i 'celowe psucie\|deliberate\|odwróć\|zepsuj' lessons/m3-l4/lesson-draft.md` returns a hit in the VERIFY beat.
- No dangling pointer to the removed section: `grep -n 'Szablon promptu dla E2E' lessons/m3-l4/lesson-draft.md` returns only the (optionally renamed) heading, not stale cross-references.

#### Manual Verification:
- Seed/rules read as GENERATE, anti-patterns/re-prompt as REVIEW, deliberate-break as VERIFY — the four loop steps are all visibly present and labeled.
- No internal cross-reference points at deleted prose ("section wyżej", "Szablon promptu", "wrócimy do tego").
- The prompt-template pointer makes sense without the learner having seen the full template (they get it from the skill).

**Implementation Note**: Pause for author confirmation before Phase 4.

---

## Phase 4: Align downstream sections — pipeline, tasks, Deep Dive

### Overview
Sweep the sections after the loop so they match the plan-execution framing: the quality-pipeline section, the practical tasks, and the "Workflow E2E jako skill" Deep Dive.

### Changes Required:

#### 1. Pipeline + healer consistency pass
**File**: `lessons/m3-l4/lesson-draft.md` ("E2E w pipeline jakości" + healer note, ~lines 417-447)

**Intent**: Keep the layered-quality pipeline and the healer boundary; ensure they reference `/10x-e2e` and the M3L5 debugging handoff consistently with the new framing.

**Contract**: Light edits only — confirm the local-E2E-then-CI rhythm and the healer-helps-on-selectors / harms-on-logic boundary still read correctly; align any "skill generuje testy" phrasing to "`/10x-e2e` drives the phase". No structural change.

#### 2. Practical tasks → plan-execution model
**File**: `lessons/m3-l4/lesson-draft.md` ("🧑🏻‍💻 Zadania praktyczne", ~lines 450-508)

**Intent**: Update the tasks so they exercise `/10x-e2e` as a plan-executor, not a generator with two "variants".

**Contract**:
- "Scenariusze E2E z mapy ryzyk" task (~lines 483-490): reframe so the learner runs `/10x-e2e <change-id> phase N` (or on a chosen risk) and the skill drives PLAN→GENERATE→REVIEW→VERIFY; keep "pick 2-3 top risks", keep the five-anti-pattern review step, and **add a deliberate-break step** ("invert the behavior, confirm the test goes red"). Present planner→generator vs prompt-template as the two PLAN strategies the skill offers, not two ways to use the skill.
- Keep "Seed test i reguły testowania", "Eksploracja przez CLI", "Konfiguracja storageState", "Izolacja danych testowych", and the optional "Dostosuj `/10x-e2e`" tasks; align wording to the new framing where they call the skill.

#### 3. "Workflow E2E jako skill" Deep Dive reframe
**File**: `lessons/m3-l4/lesson-draft.md` (Deep Dive subsection, ~lines 616-632)

**Intent**: The skill is now a plan-execution sibling, so "spakuj reguły + seed w skill" is no longer the whole story. Reframe: `/10x-e2e` already *is* that packaged workflow (a plan-executor sibling of `/10x-implement`/`/10x-tdd`); the build-your-own angle survives for **non-Playwright stacks**, where you author your own variant of the levers + loop.

**Contract**: Revise the subsection so the "kiedy się opłaca / jak go zbudować" steps describe authoring a *variant* of the shipped skill for another stack (Cypress/WebdriverIO/Selenium), reusing the loop and gate, rather than implying the learner must build the Playwright skill from scratch. Keep the Debbie O'Brien tie-in and the progressive-disclosure point. Update the Deep Dive intro topic-list line if the subsection title changes (`references/lesson-structure.md` Deep Dive convention).

### Success Criteria:

#### Automated Verification:
- No todos introduced: `grep -n '\[todo' lessons/m3-l4/lesson-draft.md` returns nothing.
- Tasks reference the plan-execution skill: `grep -n '/10x-e2e' lessons/m3-l4/lesson-draft.md` shows hits in Zadania praktyczne.
- Canonical section order intact per `references/lesson-structure.md` (title → core → Zadania → Odznaka → Deep Dive → Materiały); Deep Dive intro topic list matches its H3 subsections.

#### Manual Verification:
- The practical tasks have the learner *drive a plan phase* with `/10x-e2e` and run the deliberate-break check — not "generate via variant A or B".
- The Deep Dive reads as "author your own variant for another stack", not "build the Playwright skill from scratch".
- Pipeline/healer section is consistent with the reframed core; M3L5 handoff intact.

**Implementation Note**: Pause for author confirmation before Phase 5.

---

## Phase 5: Side-effect ledger + editor/RC handoff

### Overview
Produce the workbench side-effect ledger and stage the lesson for the editorial pipeline. No editorial pass runs inside this plan.

### Changes Required:

#### 1. Side-effect ledger
**File**: `context/changes/m3l4-e2e-skill-reframe/side-effect-ledger.md` (new)

**Intent**: Document content-level effects per workbench discipline.

**Contract**: Fill the ledger template. Key entries to expect: **New claims** — `/10x-e2e` is a plan-execution sibling of `/10x-implement`/`/10x-tdd`; the eligibility gate; deliberate-break verification at E2E level. **Claims removed** — the inline prompt template + worked example (now skill-owned); "/10x-e2e is the test generator" framing. **Neighboring references changed** — strengthened M3L2 bridge (`/10x-tdd` sibling, deliberate-break). **Potential duplicates** — m3-l2 `/10x-tdd` section vs m3-l4 `/10x-e2e` section (boundary: same pattern, different layer — call it out). **Video/text mismatches** — V3b at the re-prompt beat; any video beat implying the old generator framing. **Needs human decision** — diagram render/renumber via `mermaid` skill; whether the new decision diagram replaces or supplements an existing one.

#### 2. Stage editor → RC handoff
**File**: process note in `change.md`

**Intent**: The draft changed materially → it needs `lesson-editor-pl` then `lesson-rc-review`, run **sequentially** (memory `feedback_editor_before_review.md`: editor before RC, never parallel). Also flag the mermaid render follow-up.

**Contract**: Update `change.md` `status` and `updated`, and record the handoff: (1) run the `mermaid` skill to render + renumber the new decision diagram; (2) `lesson-editor-pl` on `m3-l4`; (3) `lesson-rc-review` on `m3-l4`. Note that m3-l4 had a prior RC review (`requiredArtifacts`) — the reframe invalidates it; a fresh RC is required.

### Success Criteria:

#### Automated Verification:
- Ledger exists: `ls context/changes/m3l4-e2e-skill-reframe/side-effect-ledger.md`.
- No `[todo]` in the draft: `grep -n '\[todo' lessons/m3-l4/lesson-draft.md` returns nothing.

#### Manual Verification:
- Ledger captures the prompt-template removal, the framing change, the M3L2 bridge, and the mermaid render follow-up.
- Author agrees the lesson is ready for the `mermaid` → `lesson-editor-pl` → `lesson-rc-review` pipeline.

---

## Testing Strategy

Editorial work; "tests" are structural and grep/build checks:

- **Schema**: JSON validity + scope-of-diff (Phase 1).
- **Draft**: sibling-framing present, inline template absent, deliberate-break present, no dangling cross-refs, canonical section order, no `[todo]` (Phases 2-4).
- **Cross-lesson**: manual read confirming the m3-l4 `/10x-e2e` section parallels m3-l2's `/10x-tdd` section without duplicating it.

### Manual Testing Steps
1. Read the reframed core end-to-end — confirm all four loop steps (PLAN/GENERATE/REVIEW/VERIFY), the gate, and the interleaving beat are present and labeled.
2. Diff against `lessons/m3-l2/lesson-draft.md:152-268` mentally — confirm structural parallel, not copy.
3. Confirm the prompt-template pointer stands alone without the deleted template.
4. `git diff lessons-schema.json` — confirm only the `m3-l4` slot changed.

## Migration Notes

- The new decision diagram ships with a `<!-- rendered: TODO -->` placeholder; the `mermaid` skill must render + renumber before publish (Phase 5 handoff). Until then the lesson is editorially complete but not render-complete.

## References

- Change identity: `context/changes/m3l4-e2e-skill-reframe/change.md`
- Draft under revision: `lessons/m3-l4/lesson-draft.md`
- Pattern exemplar: `lessons/m3-l2/lesson-draft.md:152-268` (the `/10x-tdd` section)
- New skill (source of truth): `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-e2e/SKILL.md` + `references/`
- Sibling skills: `/Users/admin/.claude/skills/10x-tdd/SKILL.md`
- Contract: `lessons-schema.json` (slot `m3-l4`)
- Structure rules: `references/lesson-structure.md`
- House voice: `src/content/lessons10xDevs3Prework/style.md`
- Prior revision: `context/changes/m3l4-todo-revision/` (moved content into the skill; kept the inline template this change removes)

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Schema — plan-execution framing (m3-l4 slot only)

#### Automated
- [x] 1.1 Schema valid JSON (`python3 -c "import json; json.load(...)"`) — b373af31
- [x] 1.2 Diff touches the m3-l4 slot only — b373af31

#### Manual
- [x] 1.3 owns/learningOutcomes describe /10x-e2e as plan-execution sibling; planner→generator as a PLAN strategy — b373af31
- [x] 1.4 No contradiction with mustNotCover or existing seed/rules/vision ownership — b373af31

### Phase 2: Reframe the spine — /10x-e2e as the plan-execution sibling

#### Automated
- [x] 2.1 Sibling framing present (grep /10x-implement, /10x-tdd, loop, ## Progress) — 866920d2
- [x] 2.2 Download command present once, in the new section — 866920d2
- [x] 2.3 New mermaid decision block added with `rendered: TODO` placeholder — 866920d2

#### Manual
- [x] 2.4 Reader recognizes /10x-e2e as /10x-tdd's E2E sibling within two paragraphs — 866920d2
- [x] 2.5 Eligibility gate + redirect read clearly, no re-teaching of /10x-tdd/-implement — 866920d2
- [x] 2.6 10xCards example + planner/generator/healer mechanics survive inside the loop — 866920d2

### Phase 3: Map the levers onto the loop + remove the inline prompt template

#### Automated
- [x] 3.1 Inline template gone (grep `Research anchor:` / `Mocked boundaries` → empty) — 9a8fa406
- [x] 3.2 Deliberate-break beat present — 9a8fa406
- [x] 3.3 No dangling cross-reference to the removed template section — 9a8fa406

#### Manual
- [x] 3.4 Seed/rules=GENERATE, anti-patterns/re-prompt=REVIEW, deliberate-break=VERIFY all visible — 9a8fa406
- [x] 3.5 No internal pointer at deleted prose ("section wyżej", "Szablon promptu", "wrócimy do tego") — 9a8fa406
- [x] 3.6 Prompt-template pointer stands alone without the full template — 9a8fa406

### Phase 4: Align downstream sections — pipeline, tasks, Deep Dive

#### Automated
- [x] 4.1 No `[todo]` introduced — 8e0e8a30
- [x] 4.2 Zadania praktyczne reference /10x-e2e (plan-execution) — 8e0e8a30
- [x] 4.3 Canonical section order + Deep Dive intro topic-list intact — 8e0e8a30

#### Manual
- [x] 4.4 Tasks have the learner drive a plan phase + run the deliberate-break check — 8e0e8a30
- [x] 4.5 Deep Dive reads as "author your own variant for another stack" — 8e0e8a30
- [x] 4.6 Pipeline/healer consistent with reframed core; M3L5 handoff intact — 8e0e8a30

### Phase 5: Side-effect ledger + editor/RC handoff

#### Automated
- [x] 5.1 Side-effect ledger file exists — 258bb873
- [x] 5.2 No `[todo]` in the draft — 258bb873

#### Manual
- [x] 5.3 Ledger captures template removal, framing change, M3L2 bridge, mermaid render follow-up — 258bb873
- [x] 5.4 Lesson staged for mermaid → lesson-editor-pl → lesson-rc-review — 258bb873
