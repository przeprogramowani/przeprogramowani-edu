---
date: 2026-06-01T12:02:29+0200
researcher: mkczarkowski
git_commit: 06eb0a2b603d92047b79a0e736081d541e9eb3b1
branch: master
repository: przeprogramowani-sites
topic: "10x-workflow skills/prompts cheatsheet — grouping, when-to-use, how-to-chain"
tags: [research, 10x-toolkit, skills, course-content, ai-artifacts, cheatsheet, workflow]
status: complete
last_updated: 2026-06-01
last_updated_by: mkczarkowski
---

# Research: 10x-workflow Skills/Prompts Cheatsheet

**Date**: 2026-06-01T12:02:29+0200
**Researcher**: mkczarkowski
**Git Commit**: 06eb0a2b603d92047b79a0e736081d541e9eb3b1
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Students asked for a 10x-workflow summary (infographic or cheatsheet) covering the most important information about each skill: **when to use it** and **how to chain it**. There are many skills (and prompts), so they need sensible grouping (start by module). Inputs: skill→lesson wiring in `10x-toolkit/packages/course-content`, skill source in `10x-toolkit/packages/ai-artifacts`, the `skill-explainer.md` prompt as a per-skill analysis method, and the m1–m3 `lesson-draft.md` files as the "how to use" voice. Decide research method + style. Deliverable format is still open: generated infographic (nano-banana-pro / GPT-image-2 via OpenRouter), an HTML+Tailwind page, or both.

**Scope locked with the user:** cover skills that are **either** wired in `course-content` **or** named in an **m1–m3 `lesson-draft.md`**, plus **prompts** as secondary per-lesson entries.

## Summary

- The 10x toolkit ships **29 skills** in `ai-artifacts/skills/`, of which **23 are wired into 10xDevs 3.0 lessons** (modules 0–3; modules 4–5 are not yet wired). The in-scope cheatsheet universe is exactly those **23 skills** (course-content ∪ m1–m3 drafts both resolve to the same 23) plus **7 prompts**.
- **Grouping has two natural axes.** (1) **Course module** — the primary axis the user asked for; each module introduces a clean batch of skills (M1 = foundation/onboarding, M2 = build loop, M3 = quality/testing). (2) **Workflow phase** — the more useful "how to chain" axis: Setup → Discovery → Foundation decisions → Frame/Research → Plan → Implement → Review/Archive. The two axes line up almost perfectly because the course teaches the skills in chain order.
- **The chain is the product.** Every skill follows the same model: *read a file → do work → write a file → STOP and defer to the human*. Skills never auto-chain. The load-bearing nouns are the **artifact files** (`shape-notes.md → prd.md → tech-stack.md → roadmap.md → plan.md → ## Progress → impl-review.md`). A great cheatsheet pairs each skill with its **input file → output file**.
- **Two entry branches**: greenfield (`shape → prd → tech-stack-selector → bootstrapper`) and brownfield (`shape → prd → stack-assess → health-check`), converging at agent onboarding (`10x-agents-md`).
- **Three execution siblings** (`10x-implement`, `10x-tdd`, `10x-e2e`) all read the **same `plan.md`** and mutate the **same `## Progress`** block — that shared block is the real state backbone; the three interleave per phase.
- **`skill-explainer.md` is the research method** for per-skill depth: it produces a 7-section analysis (Problem & Purpose, Chain Position, Anatomy, Key Mechanics, Design Decisions, Adaptation Guide, Building Similar). For a cheatsheet we only need its first two sections per skill (purpose + chain position) — the rest is for learners who want to build their own skills.
- **House voice for "when to use"** is consistent and quotable: *"powtarzalny proces → skill; jednorazowa eksploracja → prompt"*, *"Najpierw plan. Potem kod."*, *"Skill jest tu silnikiem, nie redaktorem."* The cheatsheet copy should reuse this register.

## Detailed Findings

### 1. The cheatsheet skill universe (in-scope set)

**23 in-scope skills** (wired into a 10xDevs 3.0 lesson AND/OR taught in an m1–m3 draft):

`10x-init`, `10x-shape`, `10x-prd`, `10x-tech-stack-selector`, `10x-stack-assess`, `10x-bootstrapper`, `10x-health-check`, `10x-agents-md`, `10x-rule-review`, `10x-lesson`, `10x-infra-research`, `10x-roadmap`, `10x-new`, `10x-plan`, `10x-plan-review`, `10x-implement`, `10x-archive`, `10x-impl-review`, `10x-frame`, `10x-research`, `10x-test-plan`, `10x-tdd`, `10x-e2e`.

**6 registry skills OUT of m1–m3 scope** (exist in `ai-artifacts/skills/` but neither wired to m1–m3 nor taught in those drafts) — candidate "available/bonus" appendix, not core cheatsheet cells: `10x-deployment` (M1L5 uses Plan Mode + `wrangler` instead), `10x-auto-implement`, `10x-contract`, `10x-status`, `10x-impl-review-ci`, `autoresearch`.

**Edge cases in scope:**
- `10x-archive` is **wired** (module-02, `module-02/lesson-02.ts`) but **not named in any m1–m3 draft prose** — in scope via course-content; flag as "wired but draft-silent".
- `10x-frame` is wired to module-02 but the m2-l4 draft explicitly frames it as a **lifeline/escape-hatch ("koło ratunkowe"), not a linear step** (`m2-l4/lesson-draft.md:376-379`). Cheatsheet should mark it as situational.
- `10x-tdd` / `10x-e2e` are **forward-referenced** before their home lesson (tdd named in m2-l5; both home in m3-l2 / m3-l4). "First taught in" column should use m3-l2 / m3-l4.

**Helper / advisory skills mentioned in drafts but NOT part of the workflow chain** (separate tier, not core cells): `10x-cli-setup`, `10x-cli-guide` (m1-l1), `skill-creator` (m1-l2, m3-l4), and advisory auto-activating examples `react-best-practices` / `supabase-postgres-best-practices` (m1-l2, used to illustrate "doradczy" skills).

### 2. Skill → module/lesson assignment matrix (grouping backbone)

Source: `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-NN/lesson-NN.ts`. Each lesson `defineLesson(...)` declares `artifacts.root.{skills,prompts,rules,configs}` and `artifacts.local.{...}`. Lessons **accumulate** skills via spread from the previous lesson, so each lesson's array is cumulative. The **net-new** skills introduced per lesson (the useful grouping for a cheatsheet) are:

| Lesson | Title (EN) | NET-NEW skills introduced | NET-NEW prompts |
|--------|-----------|---------------------------|-----------------|
| m0l1 | Prework | — | `m0l1-prework` |
| m1l1 | Bootstrap a New Project: From Idea to PRD | `10x-init`, `10x-shape`, `10x-prd` | — |
| m1l2 | Tech Stack Selection | `10x-tech-stack-selector`, `10x-stack-assess` | `skill-explainer` |
| m1l3 | AI-Powered Bootstrap | `10x-bootstrapper`, `10x-health-check` | — |
| m1l4 | Agent Onboarding (AGENTS.md, rules, feedback) | `10x-agents-md`, `10x-rule-review`, `10x-lesson` | — |
| m1l5 | Localhost → Production (infra + first deploy) | `10x-infra-research` | `m1l5-1-plan-integration`, `m1l5-2-constrain-approach`, `m1l5-3-extend-prerequisites`, `m1l5-4-store-plan` |
| m2l1 | MVP Roadmap | `10x-roadmap` | — |
| m2l2 | Implementation with Agents | `10x-new`, `10x-plan`, `10x-plan-review`, `10x-implement`, `10x-archive` | — |
| m2l3 | Solo Code Review | `10x-impl-review` | — |
| m2l4 | AI Research Toolkit | `10x-frame`, `10x-research` | — |
| m2l5 | Multi-Agent Work | (none new; worktrees + `/goal`/`/loop`) | — |
| m3l1 | Test Plan with AI | `10x-test-plan` | — |
| m3l2 | From Plan to Tests | `10x-tdd` | `m3l2-ad-hoc-testing` |
| m3l3 | Hooks and Triggers | (none new; ships `CLAUDE-m3l3` rule) | — |
| m3l4 | E2E Tests (Playwright/MCP) | `10x-e2e` | — |
| m3l5 | Debugging with AI | (none new; reuses tdd/e2e + Sentry/Playwright) | — |

Module headers (`module-NN/index.ts`): M0 "10xDevs 3.0 - Prework", M1 "Agentic Environment", M2 "10xDevs Workflow", M3 "AI Development Quality & Maintenance", M4 "Large Scale & Legacy Projects" (unwired), M5 "AI-Native Teamwork" (unwired).

Per-lesson rules: every wired lesson ships a `CLAUDE-mNlN` rule pack (m1l1…m3l4; m3l5 ships none). These are CLAUDE.md rule files delivered via the CLI `get`, not skills.

### 3. End-to-end chain topology (the "how to chain" axis)

Directory layout the skills share:

```
context/
├── foundation/   ← one-time per project (cross-change living docs)
│   shape-notes.md, prd.md, tech-stack.md, roadmap.md,
│   stack-assessment.md, health-check.md, infrastructure.md,
│   lessons.md, test-plan.md
├── changes/<change-id>/   ← per-change loop (repeated per unit of work)
│   change.md, research.md, frame.md, plan.md, plan-brief.md,
│   reviews/plan-review.md, reviews/impl-review.md, follow-ups/review-fixes.md
└── archive/<date>-<change-id>/   ← closed changes (read-only)
```

**A. Foundation bootstrap (runs once), forks greenfield/brownfield at PRD:**

```
10x-init → context/{changes,archive,foundation}/ + READMEs
10x-shape → foundation/shape-notes.md   (auto-detects greenfield vs brownfield)
10x-prd   → foundation/prd.md
   ├─ GREENFIELD: 10x-tech-stack-selector → tech-stack.md → 10x-bootstrapper → scaffold + bootstrap-verification/verification.md
   └─ BROWNFIELD: 10x-stack-assess → stack-assessment.md → 10x-health-check → health-check.md
   ↓ both converge at:
10x-agents-md → AGENTS.md / CLAUDE.md   (+ 10x-rule-review scores it, 10x-lesson seeds lessons.md)
```

Foundation skills that branch off the PRD (situational, not strictly linear): `10x-roadmap → roadmap.md`, `10x-infra-research → infrastructure.md`, `10x-deployment → deploy-readiness.md` (out of scope), `10x-test-plan → test-plan.md`.

**B. Per-change loop (repeated per unit of work):**

```
10x-new <id> → changes/<id>/change.md (status: new)
  ├─ (situational) 10x-research → research.md      (new→preparing)
  └─ (situational) 10x-frame    → frame.md         (new→preparing; frame can read research.md)
10x-plan → plan.md + plan-brief.md   (→planned; question count scales DOWN with frame/research present)
  └─ (gate) 10x-plan-review → reviews/plan-review.md  (→plan_reviewed; verdict SOUND/REVISE/RETHINK)
EXECUTION (3 siblings, same plan.md + same ## Progress, interleavable):
  10x-implement <id> phase N → code + flips ## Progress [ ]→[x] + SHA
  10x-tdd       <id> phase N → test-first (RED→GREEN→REFACTOR); redirects non-TDD'able/already-built phases to implement
  10x-e2e       <id>         → browser risks only; redirects the rest to tdd/implement
  (10x-auto-implement → headless launcher, out of scope)
  └─ (gate) 10x-impl-review → reviews/impl-review.md  (→impl_reviewed; APPROVED/NEEDS ATTENTION/REJECTED)
10x-archive <id> → git mv to archive/<date>-<id>/  (→archived; closes matching roadmap item)
10x-status → read-only cross-cut over all change.md + ## Progress (drift warnings)
```

**change.md status lifecycle:** `new → preparing → planned → plan_reviewed → implementing → implemented → impl_reviewed → archived` (record-only frontmatter; transitions stamped by the owning skill).

**plan.md `## Progress` = single source of truth for execution.** No state sidecar. `- [ ] N.M <title>` flips to `- [x] N.M <title> — <sha>` at phase-end commit. "Where am I" is derived (first `- [ ]` = next step), not stored.

### 4. Workflow-phase grouping (secondary cheatsheet axis)

| Phase | Skills | Module(s) |
|-------|--------|-----------|
| 0. Setup (one-time) | `10x-init` | M1 |
| 1. Discovery / Shape | `10x-shape`, `10x-prd` | M1 |
| 2a. Foundation decisions (greenfield) | `10x-tech-stack-selector`, `10x-bootstrapper`, `10x-agents-md`, `10x-roadmap`, `10x-infra-research`, `10x-test-plan` | M1–M3 |
| 2b. Foundation assessment (brownfield) | `10x-stack-assess`, `10x-health-check`, `10x-agents-md` | M1 |
| 3. Frame / Research (per-change, situational) | `10x-frame`, `10x-research` | M2 |
| 4. Plan | `10x-plan`, `10x-plan-review` | M2 |
| 5. Implement | `10x-implement`, `10x-tdd`, `10x-e2e` | M2–M3 |
| 6. Review / Archive | `10x-impl-review`, `10x-archive` | M2 |
| Cross-cutting registers (any time) | `10x-lesson` → `lessons.md`; `10x-rule-review` (scorecard only) | M1 |

`lessons.md` is re-read as priors at the start of `10x-frame`, `10x-research`, `10x-plan`, `10x-plan-review`, `10x-implement`, `10x-tdd`, `10x-impl-review` — it crosscuts the whole loop.

### 5. Per-skill capsule data (cheatsheet cell contents)

Format: **skill — purpose · WHEN · in→out artifact · (line count = complexity).** Refs into `ai-artifacts/skills/<name>/SKILL.md`.

**Setup / lifecycle**
- `10x-init` (~95) — scaffold `context/` skeleton. WHEN: start of workflow. in: none → out: `context/{changes,archive,foundation}/` + READMEs. Idempotent; STOP (no chain).
- `10x-new` (~143) — bootstrap one change folder. WHEN: new unit of work. in: needs `context/changes/` → out: `changes/<id>/change.md`. Suggests `/10x-plan` next.
- `10x-archive` (~232) — close a change. WHEN: implemented/reviewed. in: `change.md` → out: `git mv` to `archive/<date>-<id>/`; flips roadmap item to done. Hard-blocks only on uncommitted changes.

**Discovery → product**
- `10x-shape` (~745) — turn idea/change into structured notes (facilitator, never invents). WHEN: greenfield project or meaningful brownfield change. in: needs `foundation/` → out: `shape-notes.md`. STOP.
- `10x-prd` (~446) — shape-notes → schema-conformant PRD; gaps → `## Open Questions`. WHEN: notes exist. in: `shape-notes.md` → out: `prd.md`. STOP.

**Stack / scaffold (greenfield)**
- `10x-tech-stack-selector` (~294) — PRD → vetted starter + machine hand-off. in: `prd.md` → out: `tech-stack.md`. STOP.
- `10x-bootstrapper` (~245) — hand-off → scaffolded project in cwd (preserves `context/`). in: `tech-stack.md` → out: scaffold + `bootstrap-verification/verification.md`.

**Brownfield assessment**
- `10x-stack-assess` (~346) — score existing stack vs 4 agent-friendly gates; value = compensation path. in: optional `prd.md` → out: `stack-assessment.md`.
- `10x-health-check` (~385) — audit deps/security/test-runner/CI for agent-readiness. in: optional `stack-assessment.md` → out: `health-check.md`.

**Foundation decisions**
- `10x-roadmap` (~753) — PRD → ordered vertical slices (F-NN/S-NN) in dependency order. in: `prd.md` (+`tech-stack.md`) → out: `roadmap.md`; each slice → `/10x-plan <id>`.
- `10x-infra-research` (~447) — pick MVP platform via research + 5 criteria + 3 anti-bias lenses. in: `tech-stack.md` (+`prd.md`) → out: `infrastructure.md`.
- `10x-test-plan` (~633) — risk-first phased test-rollout orchestrator (brownfield). in: PRD+roadmap → out: `test-plan.md`; launches phases into new→research→plan→implement.

**Onboarding / rules**
- `10x-agents-md` (~223) — generate short, reference-heavy `AGENTS.md` (critical rules first). in: repo inspection → out: `AGENTS.md`. Standalone.
- `10x-rule-review` (~313) — score any rules-for-AI file on 5 axes (scorecard only, never edits). in: a markdown path → out: scorecard. Standalone.
- `10x-lesson` (~111) — append a recurring rule/pitfall. in: 4-field interview → out: appends `foundation/lessons.md`.

**Per-change: frame / research / plan**
- `10x-frame` (~349) — separate observation from cause / problem from solution before planning. WHEN: "bug + fix", scope/design/assumption questions; situational lifeline. in: optional `research.md` → out: `frame.md` (valid first arg to plan).
- `10x-research` (~223) — parallel-subagent codebase research. WHEN: how/where/why before planning. in: optional `lessons.md` → out: `research.md`.
- `10x-plan` (~831) — detailed, skeptical, iterated plan with canonical `## Progress`. in: optional `research.md`/`frame.md` → out: `plan.md` + `plan-brief.md`. More upstream context = fewer questions.
- `10x-plan-review` (~384) — "will this plan work?" before code. in: `plan.md` (+`contract-surfaces.md`) → out: `reviews/plan-review.md` (SOUND/REVISE/RETHINK).

**Per-change: execution (shared plan + ## Progress)**
- `10x-implement` (~363) — execute approved plan phase-by-phase. in: `plan.md` → out: code + flips `## Progress`.
- `10x-tdd` (~376) — test-first sibling (RED→GREEN→REFACTOR); needs existing test infra; redirects non-TDD'able / already-built phases to implement.
- `10x-e2e` (~398) — browser sibling (PLAN→GENERATE→REVIEW→VERIFY); start from a seed test; redirects non-browser risks to tdd/implement.

**Per-change: review**
- `10x-impl-review` (~442) — "did we build what we planned?" drift/safety/pattern check. in: `plan.md` `## Progress` + git diff → out: `reviews/impl-review.md` (APPROVED/NEEDS ATTENTION/REJECTED).

### 6. Prompts (secondary per-lesson entries)

`ai-artifacts/prompts/` — simpler than skills (no frontmatter/chain; `{{...}}` = template vars):

- `m0l1-prework.md` (10) — course welcome / prework onboarding text. Used at m0l1.
- `m1l5-1-plan-integration.md` (1) — kick off planning the `{{platform}}` integration + deploy per `infrastructure.md`. Step 1 of the m1l5 deploy sequence.
- `m1l5-2-constrain-approach.md` (1) — constrain plan: platform-native auto-deploy, not external CI. Step 2.
- `m1l5-3-extend-prerequisites.md` (1) — add CLI-config prerequisites. Step 3.
- `m1l5-4-store-plan.md` (1) — persist plan at `context/changes/deployment/deployment-plan.md`. Step 4.
- `m3l2-ad-hoc-testing.md` (20, PL) — ad-hoc behavioral unit-test prompt grounded in `@TECH_STACK` + `@PRD`; 3 stages; stop on oracle ambiguity. Used at m3l2 without a full plan.
- `skill-explainer.md` (240) — meta/teaching prompt: analyze a skill's source → 7-section report on mechanics + how to build a similar one. Per-skill research method.

### 7. House voice for "when to use" / "how to chain" (cheatsheet copy register)

Each draft introduces a skill with the pattern: **wrong instinct → skill name → what it owns → what it deliberately does NOT do.** Chaining is narrated with **arrows (`→` in prose, `->` in fenced blocks)** and **"najpierw… potem…"**; files are "memory".

- Skill-vs-prompt rule: *"powtarzalny proces - sięgaj po skill. Jednorazowa eksploracja, wyjaśnienie albo edycja - napisz prompt i ruszaj dalej."* (`m1-l2/lesson-draft.md:88`); *"łapiesz się na pisaniu trzeciego podobnego promptu? To znak, że warto stworzyć skilla."* (`:90`)
- Chain as one continuous "ciąg": *"Workflow /10x-shape → /10x-prd → wybór stacku → bootstrap … to jeden ciąg. Jeśli pierwszy kontrakt jest pusty, reszta będzie tylko szybszym sposobem dowożenia złych decyzji."* (`m1-l1:60`); *"Każdy czyta plik wyprodukowany przez wcześniejszy krok i zapisuje wynik jako wejście dla następnego."* (`m1-l2:295`)
- Engine-not-decider: *"Skill jest tu silnikiem, nie redaktorem."* (`m1-l5:200`); *"werdykt należy do ciebie."* (`m2-l3:217`)
- Plan-before-code (M2 spine): *"plan to mechanizm kontroli nad przyszłą pracą agenta."* (`m2-l2:22`); *"Najpierw plan. Potem kod."*
- Risk-first (M3 spine): *"/10x-test-plan … Ustawia im kolejność i pilnuje, żeby nie zaczynały od wygodnego pliku, tylko od ważnego ryzyka."* (`m3-l1:198`)
- TDD gate one-liner (great cheatsheet snippet): *"Jeśli w danej fazie planu umiesz nazwać pierwszy czerwony test jednym zdaniem, rozważ /10x-tdd. Jeśli nie umiesz, zostań przy /10x-implement albo wróć do researchu."* (`m3-l2:224`)

## Code References

- `10x-toolkit/packages/course-content/src/schemas/lesson.ts` — `defineLesson` shape: `artifacts.root/local.{skills,prompts,configs,rules}`.
- `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-{00..05}/lesson-*.ts` — per-lesson skill/prompt/rule assignments (cumulative via spread).
- `10x-toolkit/packages/ai-artifacts/skills/<name>/SKILL.md` — per-skill purpose, when-to-use, chain position (29 skills).
- `10x-toolkit/packages/ai-artifacts/prompts/*.md` — 7 prompts (m0l1, m1l5-1..4, m3l2-ad-hoc-testing, skill-explainer).
- `10x-toolkit/packages/ai-artifacts/prompts/skill-explainer.md` — per-skill analysis method (7-section report; depth scales with skill size).
- `workbench/lessons/m{1,2,3}-l{1..5}/lesson-draft.md` — "how to use" voice + per-lesson chaining narrative.

## Architecture Insights

- **File-on-disk handoff is the architecture.** Skills are stateless functions over the `context/` filesystem; the human is the scheduler. This is why the cheatsheet's most valuable column is **input file → output file**, not a prose description.
- **The course teaches in chain order**, so module-axis and phase-axis grouping coincide. A cheatsheet can use module as the top-level lane and overlay the phase/chain arrows without conflict.
- **Three "shapes" of skill** worth color-coding: (1) **document generators** that write a foundation/change artifact and STOP (most skills); (2) **execution drivers** that mutate `## Progress` (`implement`/`tdd`/`e2e`); (3) **read-only/registers** that score or append but don't drive (`rule-review`, `status`, `lesson`, `contract`).
- **Branch points** the cheatsheet must show: greenfield vs brownfield head; research vs frame as situational pre-plan; implement vs tdd vs e2e per phase. These are the only real "choices" in an otherwise linear flow.
- **Cumulative wiring** in course-content means "skills available in lesson N" ≠ "skills taught in lesson N". The cheatsheet should key off **net-new per lesson** (Section 2 table), not the cumulative array.

## Format decision input (deliverable still open)

The change notes list three options. Research-relevant trade-offs:
- **HTML + Tailwind page** — best for the chain/branch arrows and the input→output artifact pairing (real layout, anchors, responsive, diffable, easy to iterate). Recommended as the iterable source of truth.
- **Generated infographic (nano-banana-pro / GPT-image-2 via OpenRouter)** — good for a shareable single-image artifact, but hard to get 23 skills + arrows + artifact filenames legible and correct; re-prompting to fix one cell is costly.
- **Both** — HTML as source of truth, export a static image for sharing. Likely the pragmatic end state.
This is a framing/planning decision, not blocked by research.

## Historical Context (from prior changes)

- `context/changes/workflow-cheatsheet/change.md` — this change's identity + notes (deliverable format options, source paths, scope intent).
- No prior `context/changes/**` or `context/archive/**` in this workbench address skills/cheatsheet topics; `context/foundation/lessons.md` is absent.
- Memory: `reference_10xdevs3_en_circle_workflow.md` (EN→Circle release flow) and `feedback_editor_before_review.md` (lesson-editor before rc-review) are adjacent but not directly relevant to cheatsheet authoring.

## Related Research

None found under `context/changes/**/research.md` or `context/archive/**/research.md` in this workbench.

## Open Questions

1. **Deliverable format** — HTML+Tailwind page, generated infographic, or both? (Recommend: HTML source of truth → optional image export.)
2. **Bonus tier** — include the 6 out-of-scope registry skills (`10x-deployment`, `10x-auto-implement`, `10x-contract`, `10x-status`, `10x-impl-review-ci`, `autoresearch`) as a labelled "available/bonus" appendix, or omit entirely per the locked scope?
3. **Helper/advisory tier** — surface `10x-cli-setup`/`10x-cli-guide`/`skill-creator` (mentioned in drafts) as a small "supporting cast" box, or keep the cheatsheet purely to the 23 workflow skills?
4. **Module 4–5 forward note** — those modules are unwired (no skills yet). Add a "coming in M4–M5" placeholder lane, or scope the cheatsheet to M0–M3 only?
5. **Prompt prominence** — render the 7 prompts as first-class cells or as small per-lesson footnotes (the m1l5-* set is really a 4-step sub-sequence of one deploy prompt chain)?
6. **PL vs EN** — drafts are Polish, skill sources are English. Cheatsheet language? (Voice quotes suggest Polish for learner-facing copy.)
