# Key 10xWorkflow Skills Reference

Source: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/`

This document summarizes five core skills that form the implementation chain in modules 2–5. Each follows the same format (SKILL.md + references/ + scripts/) but addresses a different step of the development workflow.

---

## /10x-research

**Job:** Comprehensive codebase exploration using parallel sub-agents.

**Contract:**
- Input: research question or area of interest (optionally a change-id or file path)
- Output: `context/changes/<change-id>/research.md` — structured research document with findings, code references, architecture insights, and historical context

**How it works:**
1. Reads any directly mentioned files first (fully, in main context)
2. Decomposes the research question into composable areas
3. Clarifies scope/depth/focus via structured questions (unless query is unambiguous)
4. Spawns 2–4 parallel sub-agents (Explore for file discovery, general-purpose for deep analysis) — all in one message for concurrency
5. Waits for all sub-agents, then synthesizes findings into a single document with YAML frontmatter
6. Adds GitHub permalinks when on a pushed branch
7. Handles follow-up questions by appending to the same document

**Key mechanisms:**
- Sub-agents do deep reading; main agent synthesizes — keeps main context lean
- TaskCreate/TaskUpdate for visible progress tracking in status bar
- Frontmatter with metadata (date, branch, commit, tags, status)
- Research doc is consumed by `/10x-frame` and `/10x-plan` as upstream context

**Allowed tools:** Read, Glob, Grep, Bash, Task, Write, AskUserQuestion, TaskCreate, TaskUpdate, TaskList, TaskGet

**Position in chain:** First exploration step after a change is opened. Output feeds `/10x-frame` (problem validation) or directly into `/10x-plan` (solution design).

---

## /10x-frame

**Job:** Challenge framing assumptions about WHAT to build before planning HOW. Separates observation from stated cause, problem from proposed solution.

**Contract:**
- Input: a problem description, bug report, scope question, or design choice (optionally a research doc or change-id)
- Output: `context/changes/<change-id>/frame.md` — Frame Brief with reframed (or confirmed) problem statement

**How it works:**
1. Captures the framing — keeps observation, stated cause, and proposed direction as three separate bullets (never collapses them)
2. Runs one round of pre-dispatch clarifying questions (scope/observation narrowing, not solutions)
3. Maps dimensions of the problem — constructs a hypothesis space by reading actual files and tracing paths from stated cause to observed effect
4. Spawns parallel hypothesis agents (2–4, capped at 5) — each investigates "if the framing broke at this dimension, what evidence would we expect?"
5. Narrowing questions — Socratic, not solution-oriented. Options describe observations or design positions, not causes or fixes
6. Cross-system pressure test — independent search, prior occurrences, inverse check
7. Synthesizes Frame Brief with hypothesis investigation table, dimension map, confidence level, and reframed problem statement

**Key mechanisms:**
- Guardrail: allowed conclusion is "the framing was right" — no manufactured reframings
- Observation and stated cause stay separate through every step
- No solution design — produces ONE artifact: the reframed (or confirmed) problem statement
- Narrowing questions != solution questions (fundamental difference from /10x-plan)
- Evidence-based: hypothesis table is the heart of the brief

**Allowed tools:** Read, Glob, Grep, Write, Bash, Task, AskUserQuestion, TaskCreate, TaskUpdate, TaskList, TaskGet

**Position in chain:** Between `/10x-research` and `/10x-plan`. Frame Brief IS a valid first argument to /10x-plan. Useful standalone as a discussion artifact or to scope a quick fix.

---

## /10x-plan

**Job:** Create detailed implementation plans through interactive, iterative process with complexity-scaled questioning.

**Contract:**
- Input: task description (optionally + research doc + frame brief). More upstream artifacts = fewer questions
- Output: `context/changes/<change-id>/plan.md` + `context/changes/<change-id>/plan-brief.md` (two-pager summary)

**How it works:**
1. Identifies upstream artifacts and scales questioning depth accordingly (frame + research → minimum questions; task only → full questioning)
2. Reads all context, spawns parallel research agents to find files, patterns, prior decisions
3. Presents informed understanding + complexity assessment (LOW: 4–6 questions, MEDIUM: 7–10, HIGH: 11–15)
4. Deep probing questions via AskUserQuestion — every option includes a recommendation with strength/tradeoff analysis. Questions are tagged [D]iagnostic (about the problem) or [S]olution (about how to build it) — with a frame brief, all [D] questions are skipped
5. Research & Discovery — answers implementation questions itself from codebase patterns
6. Presents plan structure for approval, then writes detailed phased plan
7. Generates plan-brief.md (two-pager for quick orientation)

**Key mechanisms:**
- Plan is intent-based: describes WHAT to change and WHY, not HOW to write the code
- Each phase has separate Automated and Manual Success Criteria
- `## Progress` section at the bottom owns all checkbox state (single source of truth)
- Complexity-scaled questioning prevents both over-engineering simple tasks and under-specifying complex ones
- Context management: delegates research to sub-agents, monitors context usage

**Allowed tools:** Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion, TaskCreate, TaskUpdate, TaskList, TaskGet

**Position in chain:** Consumes research and/or frame as input. Output (`plan.md`) is consumed by `/10x-implement` for execution and `/10x-impl-review` for verification.

---

## /10x-implement

**Job:** Execute approved plans phase-by-phase with verification, commit rituals, and state tracking.

**Contract:**
- Input: `context/changes/<change-id>/plan.md` (optionally with `phase N` to resume)
- Output: implemented code + updated `## Progress` section with commit SHAs + `change.md` status → `implemented`

**How it works:**
1. Reads plan fully, reads `context/foundation/lessons.md` for recurring rules
2. Creates one TaskCreate entry per phase for visible progress
3. Finds next pending step (first `- [ ]` in Progress section)
4. Implements each phase: follows plan intent, adapts to reality, tracks all touched files
5. After each phase — verification approach:
   - Runs automated success criteria
   - Manual confirmation gate (pauses for human testing)
   - Stages explicitly by path (never `git add -A`)
   - Detects unrelated dirty paths and asks
   - Proposes Conventional-Commits message
   - Commits via heredoc, captures SHA
   - Writes SHA back into Progress rows
6. Between phases: measures context usage and recommends continue vs. clear
7. After all phases: defensive pending-items surface, epilogue commit, marks change as `implemented`

**Key mechanisms:**
- `## Progress` section is the single source of truth — no state files, no JSON sidecars
- Touched-file set maintained in working memory (resets per phase)
- Phase blocks are read-only; only Progress checkboxes get mutated
- Mismatch handling: stops, presents issue, asks for structured decision (adapt/skip/re-plan)
- Context monitoring via bundled script between phases
- Never `--no-verify` or `--amend`; if pre-commit hook fails → fix and new commit

**Allowed tools:** Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion, TaskCreate, TaskUpdate, TaskList, TaskGet

**Position in chain:** Consumes `plan.md` from `/10x-plan`. Can be followed by `/10x-impl-review` after each phase or after all phases. Produces committed, verified code.

---

## /10x-impl-review

**Job:** Review implementation against plan for drift, dangerous decisions, architecture violations, and pattern misuse.

**Contract:**
- Input: plan path or change-id (optionally with `phase N`); or a saved review report for resume
- Output: `context/changes/<change-id>/reviews/impl-review.md` — structured review report with findings and interactive triage

**How it works:**
1. Loads plan, reads Progress state, determines scope (specific phase or all completed phases)
2. Git scope detection — compares plan's file list against actual diff:
   - In plan AND in diff → verify content matches intent
   - In diff but NOT in plan → unplanned change, investigate
   - In plan but NOT in diff → potentially missing implementation
3. Spawns two parallel sub-agents:
   - **Agent 1 — Plan Drift Detection**: reads actual files, compares against planned intent. Verdicts: MATCH / DRIFT / MISSING / EXTRA
   - **Agent 2 — Safety, Quality & Pattern Compliance**: security scan (injection, secrets, authz), performance (N+1, unbounded iteration), reliability (error handling at boundaries), data safety (destructive ops). Plus pattern compliance against similar existing files
4. Verifies success criteria: runs automated commands, checks manual items in Progress
5. Compiles findings with: ID, Severity (CRITICAL/WARNING/OBSERVATION), Impact (LOW/MEDIUM/HIGH), Dimension, Location, Detail, Fix options (1–2 with strength/tradeoff/confidence/blind-spot)
6. Interactive triage: walks findings in severity order, offers Apply Fix / Fix differently / Skip / Accept risk / Accept as recurring rule / Register as contract surface / Disagree

**Key mechanisms:**
- Six review dimensions: Plan Adherence, Scope Discipline, Safety & Quality, Architecture, Pattern Consistency, Success Criteria
- Overall verdicts: APPROVED / NEEDS ATTENTION / REJECTED
- Two fix options only when there's a genuine tradeoff (default: one fix)
- Impact is orthogonal to severity (a CRITICAL can be LOW impact if the fix is obvious)
- "Accept as recurring rule" → appends to `context/foundation/lessons.md` (feeds future reviews and implementations)
- "Register as contract surface" → appends to `docs/reference/contract-surfaces.md`
- Resume mode: load saved report, filter to PENDING decisions, continue triage

**Allowed tools:** Read, Glob, Grep, Bash, Agent, AskUserQuestion, TaskCreate, TaskUpdate, TaskList, TaskGet

**Position in chain:** Runs after `/10x-implement` (per-phase or full plan). Can trigger fixes that go back through implementation. Updates `change.md` status to `impl_reviewed`.

---

## /10x-tdd

**Job:** Turn an implementation plan into a verifiable test suite before writing production code. Tests act as a specification and living progress tracker.

**Contract:**
- Input: `context/changes/<change-id>/plan.md`
- Output: test files at the right levels + `context/changes/<change-id>/test-plan.md`

**How it works:**
1. Reads the plan completely — every phase, every acceptance criterion
2. Mines testable behaviors from: Desired End State, Phase Acceptance Criteria, Changes Required, Success Criteria, Edge Cases
3. Analyzes the project's testing stack (loads cached analysis or researches from scratch)
4. Proposes a focused test budget of 15–20 tests mapped to levels (unit, integration, API, e2e) — presents for user approval
5. Saves test plan to `test-plan.md`, then writes actual test files after sign-off

**Key mechanisms:**
- Test budget is deliberately focused (15–20 max) — sets the pattern, does not attempt exhaustive coverage
- Prioritizes breadth across phases over depth in one phase
- Each phase ends with a user checkpoint (never skips or merges phases)
- Green tests = done phases — the suite becomes a living progress tracker during `/10x-implement`

**Allowed tools:** Read, Glob, Grep, Write, Edit, Bash, Task, AskUserQuestion, TaskCreate, TaskUpdate, TaskList, TaskGet

**Position in chain:** Alternative entry before `/10x-implement`. Instead of plan → implement → review, the flow becomes plan → tdd (tests first) → implement (with tests as guardrails) → review. Used when the developer wants verification scaffolding before touching production code.

---

## Chain Summary

```
/10x-research → research.md
     ↓
/10x-frame → frame.md (optional but high-value for non-obvious problems)
     ↓
/10x-plan → plan.md + plan-brief.md
     ↓
/10x-tdd → test files + test-plan.md (optional, test-first variant)
     ↓
/10x-implement → committed code + Progress with SHAs
     ↓
/10x-impl-review → impl-review.md + triage decisions
```

Each link:
- Reads the previous step's file as input
- Produces a named file on disk as output
- Has the same structural format (SKILL.md frontmatter with name, description, allowed-tools)
- Uses the same mechanisms (sub-agents for parallel work, AskUserQuestion for decisions, TaskCreate for progress)
- Differs only in the content of the contract — what it reads and what it writes

The learner internalizes the format once (in m1-l2) and then learns new links, not new abstractions.

---

## When Do We Learn These Skills?

Module 1 (Agentic Environment) focuses on preparing the working environment for AI-assisted development: PRD as a contract (m1-l1), skills as the key abstraction and tech stack selection (m1-l2), bootstrapping the project (m1-l3), agent onboarding with AGENTS.md/CLAUDE.md (m1-l4), and deployment with MCP and CI/CD (m1-l5).

Once the environment is ready, Module 2 introduces the implementation workflow — and that's where these skills come into play as daily tools. The learner will use `/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, and `/10x-impl-review` hands-on in a real project context, building on the format understanding from m1-l2 and the configured environment from m1-l3 through m1-l5.

In m1-l2, these skills serve as a forward-looking map — proof that the format learned here is the same format used throughout the rest of the course. The learner sees the chain, understands the contract pattern, and knows what's coming. The operational depth comes in Module 2.
