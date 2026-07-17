# Lesson Spec: m4-l5 — Skalowanie kontekstu dla AI w dużych projektach

> ⚠️ **Repositioned to M4-L1 (Module 4 foundation). Renumber deferred** — schema id stays `m4-l5` until the Module-4 cascade is executed (see `positioning-and-certification.md`). This spec is written at *foundation* altitude.
> Spec language: English (internal editorial artifact). Learner-facing draft will be Polish per house style.

## Schema Context

- Course: 10xdevs-3
- Module: m4 — Large scale & legacy projects
- Position: **NEW lesson 1 / 5 (module foundation)** — schema currently `moduleOrder 5 / globalOrder 20`; target `moduleOrder 1` (pending renumber).
- Depends on: `m3-l5` (Debugging with AI) — and conceptually **m1-l4** (Agent Onboarding) + prework `[3.1][3.2][3.3]`.
- Prepares for: the four legacy lessons now downstream — project-map, feature-analysis, refactoring, DDD modernization.

## Prework Continuity

- Relevant prework: `[3.1]` LLMs / context degradation / *Maximum Effective Context Window* / token budgeting; `[3.2]` instruction hierarchy + *context-overload* anti-pattern; `[3.3]` context engineering = Write/Select/Compress/Isolate + external memory & subagents; `[2.2]/[2.3]` Cursor / Claude Code, `AGENTS.md`/`CLAUDE.md` as project memory.
- Assumed from prework: context degrades as it grows; instruction hierarchy exists; Write/Select/Compress/Isolate as concepts; AGENTS.md/CLAUDE.md exist.
- Deepened here: those strategies are **operationalized into a concrete file/directory architecture that scales** (lean root + `context/` + per-module escalation), grounded in how real tools load files and how real repos are structured.
- Avoid repeating: prework's "what *is* context engineering" theory; **m1-l4's "how to author a single AGENTS.md" (inclusion test, rules/memory taxonomy, inner loop)** — assumed, not retaught.

## Lesson Job

After Module 3 the learner can drive an agent through a single-project workflow, and m1-l4 taught them to onboard an agent to **one** project with a lean `AGENTS.md` + inner loop. Module 4 is about **large and legacy** projects — where "just keep adding to `AGENTS.md`" collapses (context rot; the agent ignores rules lost in the noise) and where the opposite reflex (build nested files everywhere) wastes effort. This is Module 4's **foundation**: it gives the learner a context architecture that scales and a decision model for *when* to add structure, so the later legacy lessons (mapping, analysis, refactoring, DDD) have a disciplined place to put the context they generate. It also opens the **certification throughline** — the architecture decisions begun here are finalized at module end into the architectural report for the Architect badge.

## Thesis

At scale the question is never "what should the agent know?" but **"what should the agent know *right now*?"** — so you start lean (a referencing root `AGENTS.md` + a `context/` system-of-record) and add structure (per-module files, governance) **only when an observable signal demands it**. A fat monolith and premature structure fail the same way: both spend the finite attention budget on context the current task doesn't need.

## Learning Outcomes

- Learner can explain *why* a single fat `AGENTS.md` / context dump degrades agent results at scale (finite attention budget → context rot; the four failure modes of a monolithic file), and how this differs from m1-l4's single-project concern.
- Learner can scaffold a baseline scalable architecture for their project: a **lean, referencing** root `AGENTS.md`/`CLAUDE.md` + a `context/` system-of-record (foundation + changes), using the 10x-workflow.
- Learner can apply the **maturity ladder**: name which tier their project is on and the **observable trigger signal** that would justify climbing (root > ~200–300 lines; a module gains its own deploy/owner; the agent repeatedly misses the same module context).
- Learner can describe how their tool actually loads & merges instruction files (additive hierarchy, *not* override; root→cwd; Codex 32 KB cap + no lazy load; Claude Code filesystem-root walk + lazy subtree; Cursor glob rules; Copilot `applyTo`) — so they don't rely on a false "nearest file replaces root" model.
- Learner is aware that multi-repo (polyrepo) breaks in-tree nesting and needs org/user-level instructions + distribution + cross-repo tooling — and that the team build-out is **M5-L3**, needed only by multi-repo companies.
- Learner produces the **"context architecture" section** of their architectural report (chosen tier, scaffold, escalation triggers, rationale).

## Audience Starting Point

Learner finished Module 3 + prework + m1-l4. They've written **one** `AGENTS.md` for a small project and assume the strategy is "keep adding to it." Pain: as their MVP grows — or when they picture a work codebase — they don't know *when* or *how* to split, and they fear both an unmanageable fat file and over-engineering. Typical errors: dumping architecture docs / the PRD into `AGENTS.md`; or pre-creating per-folder files for a 1–2 module app.

## Behavioral Change

Instead of growing one `AGENTS.md` (or pre-building nested files), the learner keeps a **lean root + a `context/` system-of-record** and escalates structure **only when a named signal appears** — and can justify that decision in their architectural report.

## Owned Concepts

- **Attention-budget economics at the architecture level** (extends prework `[3.1]` MECW to file/dir design): why *both* the fat monolith *and* premature structure waste context. The **four failure modes of a monolithic instruction file** (OpenAI *Harness engineering*: crowds out the task, dilutes guidance, rots, resists verification).
- **The progressive hybrid architecture**: lean root `AGENTS.md` as a *table of contents / map* (not an encyclopedia) + `context/` system-of-record (foundation + changes) as the JIT reference layer. The three-way split: **conventions → `AGENTS.md`; reference/PRD/plans → `context/`; procedures → skills.**
- **The maturity ladder + observable escalation triggers** (root → `context/` → per-module → governance); decision rule = **deployment/ownership boundary, not folder count**.
- **How real tools load & merge instruction files at scale** (additive hierarchy, not override; root→cwd concatenation; Codex 32 KB cap + no lazy load; Claude filesystem-root walk + lazy subtree; Cursor glob-scoped `.cursor/rules`; Copilot `applyTo`) — the basis for "don't assume nearest-replaces-root."
- **Real-repo calibration**: codex (lean root + one rare leaf), cloudflare/workers-sdk (lean root + child index — *the model*), open-mercato (task router — what *heavy* looks like, and its cost).
- **Multi-repo awareness**: in-tree nesting stops at the repo boundary → org/user-level + distribution + cross-repo tooling; build-out deferred to M5-L3.
- **The certification throughline**: context architecture → architectural report → Architect badge; single app ⇒ architecture decided at **end of module**.

## References Only

- Authoring a single `AGENTS.md` / inclusion test / inner loop / rules-memory taxonomy — **m1-l4** (assumed, operationalized at scale, not retaught).
- Write/Select/Compress/Isolate — prework `[3.3]` (named as the theory being operationalized).
- 10x-workflow skill mechanics (`/10x-init`, `/10x-prd`, `/10x-agents-md`, `/10x-rule-review`, `/10x-lesson`) — used as the demo vehicle, first taught m1-l1/m1-l4.
- Team Shared AI Registry / distribution infra — **M5-L3** (pointed to, not built).
- Maintenance/governance self-updating loops — referenced lightly (`/10x-rule-review`, `/10x-lesson`); full governance is a work/Track-B+ concern.

## Must Not Cover

- Re-teaching single-project `AGENTS.md` authoring / inclusion test / inner loop (m1-l4 owns it).
- The legacy workflows that now **follow**: codebase mapping, feature analysis, refactoring, DDD domain extraction (m4-l2…m4-l5 post-renumber). The foundation must not assume or pre-empt them.
- Building the team Shared AI Registry / CLI / package distribution (M5-L3).
- Deep MCP mechanics / building MCP servers (named only as a polyrepo cross-repo option).
- Model selection / benchmarks (prework `[3.5]`).

## Required Example Or Demo

**Anchor: the 10x-workflow `context/` applied to a course-style project.** Run `/10x-init` to scaffold `context/` (foundation + changes); keep a **lean `AGENTS.md`/`CLAUDE.md` that references it** (generate via `/10x-agents-md`, score with `/10x-rule-review`); PRD in `context/foundation/`, a change's plan in `context/changes/<id>/`. Then show the **escalation decision**: "your MVP has 1–2 modules → stay here; here's the *signal* that would make you climb." Real repos shown briefly as *what good looks like* at larger scale (cloudflare child-index; open-mercato router). Multi-tool: the same lean-root idea as `CLAUDE.md` (Claude Code), `AGENTS.md` (Codex), `.cursor/rules` (Cursor) — one mental model, different surfaces.

## Structural Logic Map (Core)

1. **Hook** — "you onboarded *one* project in m1-l4; Module 4 is large & legacy. Why does 'keep adding to AGENTS.md' break now?" · *Q:* why isn't one file enough? · *introduces:* the scaling problem · *depends on:* m1-l4 · *sets up:* the economics · *risk:* re-explaining m1-l4 basics.
2. **The economics** — finite attention budget → context rot at scale; the four failure modes of a monolith. · *Q:* what exactly goes wrong? · *introduces:* attention-budget-at-architecture-level, 4 failure modes · *depends on:* prework `[3.1]` · *sets up:* the answer · *Diagram:* before/after — fat root vs lean root + `context/` (contrast). · *risk:* drifting into pure theory.
3. **The architecture** — lean root + `context/` system-of-record; the 3-way split; "table of contents, not encyclopedia." · *Q:* what's the shape? · *introduces:* the hybrid + what-goes-where · *depends on:* beat 2 · *sets up:* the demo · *Diagram:* two-layer architecture (lean root → `context/` foundation+changes) with what-goes-where. · *risk:* re-teaching m1-l4 authoring.
4. **Demo** — scaffold it with the 10x-workflow on the course project. · *Q:* how do I set this up? · *introduces:* concrete scaffold via skills · *depends on:* beat 3 · *sets up:* the ladder · *risk:* becoming a /10x-workflow tutorial.
5. **The ladder + triggers** — tiers (root → `context/` → per-module → governance) and the **observable signals** to climb; decision rule = deployment/ownership boundary. · *Q:* when do I add structure? · *introduces:* maturity ladder + triggers · *depends on:* beat 4 · *Diagram:* ladder with trigger signals between rungs (decision flow). · *risk:* presenting tiers as mandatory steps.
6. **Calibrate to your project** — MVP (1–2 modules) → stay lean (don't over-engineer); bigger repos at work → escalate on signal. Real repos as exemplars. · *Q:* where do I stop? · *introduces:* the two contexts + real-repo calibration · *depends on:* beat 5 · *risk:* over-weighting big-repo for an MVP audience.
7. **Tool reality** — how your tool actually loads/merges (additive not override; root→cwd; Codex 32 KB cap; Claude filesystem-root + lazy; Cursor globs; Copilot applyTo). · *Q:* will my tool load these the way I think? · *introduces:* load/merge mechanics · *depends on:* beats 3–6 · *risk:* a tool-by-tool spec dump.
8. **Multi-repo awareness (brief)** — polyrepo breaks in-tree nesting → org/user-level + distribution + cross-repo tooling; build-out is M5-L3, only for multi-repo companies. · *Q:* what about conventions across repos? · *introduces:* polyrepo awareness + M5-L3 pointer · *depends on:* beat 7 · *risk:* going deep into polyrepo.
9. **Mandatory task + certification** — design + scaffold *your* context architecture; write the "context architecture" section (tier, scaffold, triggers, rationale) for the architectural report. Builder cert reqs (CRUD + 1 business logic + risk-based tests). Single app ⇒ architecture decided at **end of module**; this lesson sets the criteria/vocabulary. · *Q:* what do I do / how does this reach the badge? · *introduces:* mandatory task + cert path · *depends on:* all prior · *sets up:* the rest of Module 4 · *risk:* feeling like admin rather than payoff.

## Failure Mode To Disarm

Two symmetrical traps: **(a) the fat monolith** — grow one `AGENTS.md` until the agent ignores rules lost in the noise; **(b) premature structure** — build per-module/nested files (or a heavy `context/` tree) for a 1–2 module MVP, paying maintenance for no payoff. The lesson disarms both with one rule: **lean by default, escalate on a named signal.**

## Suggested Structure

1. **Wstęp / Bridge** — from m1-l4 single-project onboarding to "Module 4 = large & legacy; one file breaks." → *prev (m1-l4 onboarding) → this (why scale breaks it) → next (the economics); must not re-teach AGENTS.md authoring.*
2. **Dlaczego skala łamie kontekst** — attention budget + context rot + 4 failure modes. → *must not drift into pure prework theory.*
3. **Architektura: lean root + `context/`** — the hybrid + 3-way split + "ToC not encyclopedia." → *must not re-teach the inclusion test.*
4. **Demo: scaffold z 10x-workflow** — `/10x-init` + lean AGENTS.md + PRD/plans in `context/`. → *must not become a skills tutorial.*
5. **Drabina dojrzałości + sygnały eskalacji.** → *must not present tiers as mandatory steps.*
6. **Kalibracja: MVP vs większe repo** — real-repo exemplars. → *must not over-weight big repos.*
7. **Jak narzędzia naprawdę ładują pliki.** → *must not become a tool-by-tool dump.*
8. **Multi-repo: świadomość + M5-L3.** → *must not build the registry.*
9. **Zadanie obowiązkowe + ścieżka certyfikacji.** → *must not feel like admin; it's the payoff.*

## Video Placeholders

- Prowadzący runs `/10x-init` on a course-style project → shows `context/` scaffold + a lean `AGENTS.md` that references it; contrasts a fat `AGENTS.md` vs lean root + `context/`.
- Prowadzący demonstrates the escalation decision: a growing root → names the trigger → splits one module into its own `AGENTS.md` + a child index (cloudflare-style).
- (Optional) side-by-side of the same lean root as `CLAUDE.md` / `AGENTS.md` / `.cursor/rules` across tools.

## Bridge In

From m3-l5 (AI debugging closes the single-project Module-3 workflow) and m1-l4 (you onboarded *one* project). Module 4 opens with large & legacy projects — and before you map or refactor a big codebase, you need a context architecture that scales. That is this lesson.

## Bridge Out

The later Module-4 lessons (project mapping, feature analysis, refactoring, DDD) all **generate context** (maps, analyses, plans, domain boundaries); this lesson gives them a place to put it (`context/`) and a discipline (lean + escalate). It also opens the certification throughline: the architecture decisions begun here are finalized at module end into the architectural report for the Architect badge.

## Open Questions

- **Renumber execution** (m4-l5 → m4-l1 + Module-4 cascade + folder renames) — deferred per decision; execute as a separate scoped pass.
- **Schema enrichment** — provisional `owns` / `referencesOnly` / `mustNotCover` / `learningOutcomes` are drafted above; record them into `lessons-schema.json` now, or after renumber? (not written yet)
Decision: record them in lessons-schema but for current position m4-l5 but make the content itself of the spec already adapted to reorder
- **Mandatory-task coordination** — M4-L1 owns "design + scaffold context architecture"; the *other* mandatory tasks feeding the architectural report belong to the legacy lessons — align when those specs are written.
Decision: will be handled by a dedicated change m4-reorder
- **Certification specifics to confirm against the official forms** — Builder min reqs wording (CRUD + one business logic + risk-based tests from the test plan); whether the architectural report has a fixed template the "context architecture section" must match; Architect & Champion form timing (start of week 5).


## Side-Effect Ledger

```
New claims introduced:
  - Four failure modes of a monolithic instruction file (OpenAI Harness engineering)
  - Maturity ladder + observable escalation triggers (grounded heuristics, not benchmarked)
  - Tool load/merge mechanics at scale (Codex 32KB cap + no lazy load; Claude filesystem-root walk; etc.)
  - Real-repo calibration counts (codex 2, cloudflare 8, open-mercato 32) — verified by clone
  (All grounded in research/ bundle.)

Claims removed:
  (none — new lesson; altitude lowered from advanced to foundation)

Neighboring lesson references changed:
  - Repositioned: now conceptually dependsOn m3-l5 + m1-l4; preparesFor the four legacy lessons (post-renumber)
  - Original schema links (dependsOn m4-l4, preparesFor m5-l1) to be rewired on renumber

Prework references used:
  [3.1] context degradation/MECW/token budgeting, [3.2] instruction hierarchy + context-overload,
  [3.3] Write/Select/Compress/Isolate + external memory/subagents, [2.2]/[2.3] AGENTS.md/CLAUDE.md basics

Prework concepts repeated intentionally:
  - Attention budget / context degradation [3.1] — deliberately extended from token-window to file/dir architecture

Potential duplicates:
  - m1-l4 single-project AGENTS.md authoring — bounded via Must Not Cover (this lesson owns SCALE)

Unsupported facts:
  - Maturity-ladder thresholds (~200–300 line root, etc.) are heuristics, not measured — present as judgment calls
  - Certification form details pending confirmation against official forms

Video/text mismatches:
  (none yet)

Needs human decision:
  - Renumber execution; schema enrichment timing; certification-form wording + report template
```
