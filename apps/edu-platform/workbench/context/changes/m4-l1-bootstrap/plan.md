# M4-L1 Bootstrap — Context-Scaling Lesson Drafting Plan

## Overview

Produce the first learner-facing draft of **M4-L1 — "Skalowanie kontekstu dla AI w dużych projektach"**, the foundation lesson of Module 4 (schema id still `m4-l5` until the parked `m4-reorder` renumber runs). The lesson is already fully specified — settled thesis, 6 learning outcomes, hard editorial boundaries, a 9-beat structural logic map, and a drafting-ready grounding brief with 17 beat-mapped sources.

This is **not** a plan to re-derive the lesson design; the spec already made those calls. It is a **drafting brief**: it binds each of the 9 beats to its house-style section, its source(s), its concrete example, the claims it must soften, and the editorial boundary it must not cross — so the eventual `/lesson-draft` pass writes the *intended* foundation lesson rather than a broad, source-detached one. The deliverable is `lessons/m4-l5/lesson-draft.md` (Polish, house style), executed via `/lesson-draft` using this plan as the binding contract.

**Narration frame (threaded through every phase):** the course has a reference MVP — **`~/code/10xCards`**; each learner has *their own* MVP (the project they have built since Module 1). The prose shows every move on 10xCards, then directs the learner to make it on their own project. The mandatory task and the architectural-report section land on the learner's MVP, not on 10xCards.

## Current State Analysis

- **Schema slot** (`lessons-schema.json`, id `m4-l5`): `owns` (7), `referencesOnly` (5), `mustNotCover` (5), `learningOutcomes` (6), and 17 `groundingSources` are already populated at foundation/reorder altitude. `dependsOn`/`preparesFor` are deliberately left for `m4-reorder`. `videoPlaceholders` and `requiredFragments` are **empty — to be filled at draft time** (this plan, Phase 3).
- **Spec** (`lessons/m4-l5/lesson-spec.md`): foundation altitude; 9-beat Structural Logic Map; two symmetric failure modes to disarm (fat monolith vs premature structure); Suggested Structure with per-section boundary guards.
- **Grounding** (`lessons/m4-l5/lesson-grounding.md`): consolidation of the 6-report `research/` bundle into a beat-mapped evidence layer, with an explicit "Claims To Avoid Or Soften" list and one open human decision (certification copy).
- **Positioning** (`lessons/m4-l5/positioning-and-certification.md`): Module 4 vision ("start with context scaling — the foundation — then tackle the tasks — the challenges"); certification framing; reorder deferred to `m4-reorder` (tomorrow).
- **House structure** (`references/lesson-structure.md`): canonical section order, forbidden headings, Deep Dive intro convention, Materiały dodatkowe link format. Sibling drafts run ~440–600 lines.
- **10xCards** (`~/code/10xCards`): a living example of the taught architecture — 82-line lean root `CLAUDE.md` (Project / Commands / Architecture / Conventions / Reference / Toolkit), `context/foundation/` (prd, roadmap, tech-stack, test-plan, `lessons.md`), `context/changes/<id>/` + `archive/`, `.claude/skills/` (full 10x-workflow), `.cursor/rules`. A single Astro app at MVP scale.

### Key Discoveries

- The grounding's "Strong Sources" section already lists **which beat each source feeds** — Phases 1–3 lift that mapping rather than re-searching (`lessons/m4-l5/lesson-grounding.md:33-213`).
- 10xCards' 82-line `CLAUDE.md` is *under* the vendor 200-line target and its `context/foundation/lessons.md` is the `/10x-rule-review`+`/10x-lesson` governance loop **already shipped** — usable as live proof in beats 4–5.
- The grounding flags exactly **what must not be overclaimed** (`lessons/m4-l5/lesson-grounding.md:251-259`): no hard token threshold; ladder thresholds are heuristics; arXiv figures are Codex/small-PR-scoped; "88 files" is OpenAI's *internal* monorepo (public `openai/codex` has 2); two refuted Codex load-mechanics claims must not reappear.
- The one open human decision is certification copy (`lessons/m4-l5/lesson-grounding.md:261-266`) — handled by writing firmly with flagged TODOs.

## Desired End State

`lessons/m4-l5/lesson-draft.md` exists: a Polish, house-style foundation lesson that (a) opens with the Module 4 vision, (b) walks the 9-beat spine with 10xCards as the worked example and the learner's MVP as the application target, (c) carries three inline mermaid diagrams, (d) pushes heavy tool-load mechanics and multi-repo awareness into Deep Dive, (e) closes with the mandatory task + certification throughline (firm, with flagged TODOs), and (f) respects every `mustNotCover` boundary. The `m4-l5` schema slot has `videoPlaceholders`/`requiredFragments` populated, and a side-effect ledger is reported.

Verify by: structural conformance to `references/lesson-structure.md`; every factual claim traceable to a `groundingSources` entry; every "Claims To Avoid Or Soften" item respected; the dual-MVP narration present in beats 4, 6, and 9.

## What We're NOT Doing

- **Not** re-teaching single-project `AGENTS.md` authoring / inclusion test / inner loop / rules-memory taxonomy (m1-l4 owns it; assume it).
- **Not** assuming or pre-empting the legacy lessons that now follow (codebase mapping, feature analysis, refactoring, DDD) — this is their *foundation*, not their preview.
- **Not** building the team Shared AI Registry / distribution infra (M5-L3; pointed to, not built).
- **Not** executing the `m4-reorder` renumber, folder moves, or `dependsOn`/`preparesFor` rewiring (separate parked change).
- **Not** rendering diagrams to SVG/PNG — inline mermaid code blocks only (per decision).
- **Not** anchoring the demo on the live `przeprogramowani-sites` monorepo or a purely hypothetical app — the anchor is **10xCards**, the case-study repos provide the at-scale contrast.
- **Not** locking certification specifics as final — unconfirmed form details ship as flagged TODOs.
- **Not** quoting any hard context-rot token number, ladder threshold as measured fact, or "88 AGENTS.md" as observable.

## Implementation Approach

Draft top-down in document order across three phases that map to the three content zones of the canonical structure:

1. **Core spine** (intro + core content, beats 1–6 + a light tool-reality note) — the learner-facing through-line, anchored on 10xCards, with inline mermaid at beats 2/3/5.
2. **Tasks + certification** (beat 9) — `## 🧑🏻‍💻 Zadania praktyczne` + `## Odbierz swoją odznakę` + the cert throughline.
3. **Deep Dive + Materiały dodatkowe + schema wiring** (beats 7–8) — full load/merge mechanics and multi-repo awareness in Deep Dive, curated links, plus `videoPlaceholders`/`requiredFragments` and the side-effect ledger.

Each phase is drafted with the binding table below as the contract, then verified against structure (automated) and against boundaries/facts (manual) before the next.

## Critical Implementation Details

### Beat → Section → Source → Example → Soften → Boundary binding

This table is the contract the draft must satisfy. "Soften" = the claim that must be hedged or omitted per grounding; "Guard" = the `mustNotCover`/risk boundary for that beat.

| Beat | House section | Primary source(s) | Concrete example / narration | Soften | Guard |
|---|---|---|---|---|---|
| 1 Hook | intro prose (no heading) | spec Lesson Job; positioning vision line | "You onboarded *one* project in m1-l4; Module 4 is large & legacy. We start with context scaling — the foundation — then tackle the tasks." Frame: your MVP from Module 1 + our 10xCards. | — | No re-teaching m1-l4 authoring |
| 2 Economics | core `### Dlaczego skala łamie kontekst` | OpenAI Harness engineering (4 failure modes, verbatim); Anthropic effective-context-engineering (finite attention budget); Anthropic large-codebases (fat-vs-generic); best-practices ("bloated CLAUDE.md → ignored") | **Inline mermaid:** fat root vs lean root + `context/` (before/after) | **No hard token threshold** — "degrades as it grows", not "at N tokens". arXiv −28%/+20% optional, Codex/small-PR-scoped only | Don't drift into pure prework [3.1] theory — *extend* MECW to file/dir design |
| 3 Architecture | core `### Architektura: lean root + context/` | OpenAI Harness ("ToC not encyclopedia", system of record); Anthropic large-codebases (JIT); Anthropic Agent Skills (3-tier progressive disclosure) | 3-way split: conventions→`AGENTS.md`; reference/PRD/plans→`context/`; procedures→skills. **Inline mermaid:** two-layer architecture w/ what-goes-where. Say-do gap: OpenAI prescribes ~100-line map but public `openai/codex` root is 286 lines | JIT defers cost, doesn't erase it | Don't re-teach the inclusion test (m1-l4) |
| 4 Demo | core `### Demo: scaffold na 10xCards` | spec Required Demo; 10x-workflow skill mechanics (referencesOnly) | **10xCards (our MVP):** 82-line lean `CLAUDE.md`; `context/foundation/` (prd, roadmap, tech-stack, test-plan); `context/changes/<id>/`; `.claude/skills`. Scaffold via `/10x-init`, lean root via `/10x-agents-md`, score via `/10x-rule-review`. **Narration:** "watch on 10xCards → do it on YOUR MVP" | — | Don't become a /10x-workflow tutorial |
| 5 Ladder + triggers | core `### Drabina dojrzałości i sygnały eskalacji` | Anthropic large-codebases (<200-line target; per-dir layering staleness/ownership collapse); Claude Code memory (maintenance); claude-reflect / twenty `feedback-incorporation.mdc` (signal) | Tiers root→`context/`→per-module→governance. Triggers: root >~200–300 lines; module gains own deploy/owner; agent repeatedly misses same module context. Rule = deployment/ownership boundary, not folder count. 10xCards' `context/foundation/lessons.md` = live governance loop. **Inline mermaid:** ladder w/ trigger signals between rungs | **Thresholds are heuristics, not measured** — present as judgment calls. Don't claim any maintenance mechanism "reduces drift" — existence is documented, outcomes aren't | Don't present tiers as mandatory steps (disarms premature-structure trap) |
| 6 Calibrate | core `### Kalibracja: twój MVP vs większe repo` | repo-case-studies (internal, 5 repos cloned at HEAD) | 10xCards/your MVP (1–2 modules) → stay lean, don't over-engineer. cloudflare/workers-sdk = copyable model (lean root + child index + "see root" leaf). open-mercato = heavy (404-line root + router + 93 KB leaf, couples layout to tool). codex = minimal (286-line root + 1 leaf, 121 crates/1 nested). "Count by cloning" trap: twenty shows "31", real = 1 | Counts are strategy-dependent, **not a target**. Effectiveness **not measured** (layout observed, not outcomes). HEAD snapshot drifts. **Never cite "88" as observable** | Don't over-weight big repos for the MVP audience |
| 7 Tool reality | **Deep Dive** `### Jak narzędzia naprawdę ładują pliki` | Claude Code memory; Codex AGENTS.md guide + config; agents.md spec + v1.1; Copilot custom instructions; Cursor rules | Additive hierarchy **not** override (root→cwd concat, closest read last, never replaces). Codex: eager root→cwd, **32 KiB combined cap + silent truncation**, no lazy load, built once. Claude Code: filesystem-root walk + lazy subtree; `@path` imports expand at launch, don't save tokens. Cursor 4 rule types. Copilot merges-never-selects + `applyTo`. agents.md "nearest precedence" ambiguous until **proposed** v1.1 "extends not replaces". Only Claude Code doesn't read `AGENTS.md`. Live proof: this session loaded the full ancestor chain | **Two refuted Codex claims must NOT reappear** (Codex does *not* walk up to merge; cap is *combined*, not per-file). Cap version-sensitive (32 vs 64 KiB). v1.1 = "proposed", not standard | Don't make it a tool-by-tool spec dump — keep the ONE mental model framing |
| 8 Multi-repo | **Deep Dive** `### Multi-repo: świadomość` | multi-repo-context; Claude Code sub-agents+MCP; Nx/Ruler | Polyrepo breaks in-tree nesting → org/user-level + distribution + cross-repo runtime (`--add-dir`/MCP). Single-source generation (Nx, Ruler) kills *cross-tool* drift in one repo; multi-repo drift still needs package/CLI/bot sync. Build-out = **M5-L3**, only for multi-repo companies | Nx "every tool same capabilities" is a design statement, not audited drift-elimination | Don't build the registry; awareness + M5-L3 pointer only |
| 9 Task + cert | `## 🧑🏻‍💻 Zadania praktyczne` + `## Odbierz swoją odznakę` + cert framing | positioning-and-certification | **Mandatory task:** design + scaffold *your* MVP's context architecture; write the "context architecture" section (tier, scaffold, triggers, rationale) of the architectural report. **Cert throughline:** fundamentals here → continue your Module-1 project + mandatory tasks → architectural report → Architect badge. Builder min reqs (CRUD + 1 business-logic + risk-based tests from test plan); modules 4–5 not required for base Builder. Single app ⇒ decide architecture at end of lesson/module | Cert specifics **unconfirmed** → flagged TODOs | Don't feel like admin — it's the payoff |

### Narration discipline

10xCards is always *"nasz projekt"* / the worked example; the learner's MVP is always *"twój projekt"* / where the action lands. Beats 4, 6, and 9 must explicitly make this handoff. Never imply the learner works on 10xCards.

### Certification TODO format

Write the cert section as final-feeling Polish prose, but wrap each unconfirmed specific in an HTML comment TODO so it is visible to the editor and invisible to a rendered reader, e.g. `<!-- TODO(cert): confirm Builder min-reqs wording against official form -->`. Three TODOs required: (1) Builder min-reqs exact wording, (2) Architect form week-5 timing, (3) whether the architectural report has a fixed template the "context architecture section" must match.

## Phase 1: Core Spine (beats 1–6)

> **Drafting tool — read first:** the agent running this phase under `/10x-implement` must **invoke `/lesson-draft`** to write/extend `lessons/m4-l5/lesson-draft.md`. Do not hand-write the prose directly. `/lesson-draft` anchors the draft in the schema, spec, grounding, prework continuity, and `references/style.md` house voice; this plan's binding table is the per-beat contract it must satisfy.

### Overview

Draft the intro and core content: the Module 4 vision hook, the economics of context at scale, the progressive hybrid architecture, the 10xCards demo, the maturity ladder, and the calibration against case-study repos. Includes the three inline mermaid diagrams and a *light* additive-not-override note (full mechanics deferred to Deep Dive).

### Changes Required

#### 1. Intro + core sections (beats 1–6)

**File**: `lessons/m4-l5/lesson-draft.md`

**Intent**: Write the learner-facing spine in Polish house voice, anchored on 10xCards with the dual-MVP narration, following the binding table rows for beats 1–6. Open with the Module 4 vision; disarm both failure modes (fat monolith *and* premature structure).

**Contract**: H1 title; intro prose directly under it (no `## Wstęp`). Core sections as `###` under the title, no `## Core` wrapper. Sections per binding table beats 2–6. Three inline ```mermaid``` blocks at beats 2 (before/after), 3 (two-layer), 5 (ladder). Every factual claim traceable to a `groundingSources` entry; every beat-2/5/6 "soften" item respected.

### Success Criteria

#### Automated Verification

- File exists: `test -f lessons/m4-l5/lesson-draft.md`
- Exactly one H1: `grep -c '^# ' lessons/m4-l5/lesson-draft.md` returns 1
- No forbidden headings: `grep -nE '^##+ (Wstęp|Core)\b' lessons/m4-l5/lesson-draft.md` returns nothing
- Three mermaid blocks present: `grep -c '```mermaid' lessons/m4-l5/lesson-draft.md` returns 3
- No hard token threshold phrasing: `grep -niE 'po [0-9]+ ?(k|tys|tokenów)|at [0-9]+ tokens' lessons/m4-l5/lesson-draft.md` returns nothing
- "88" not cited as an observable repo count: `grep -n '88' lessons/m4-l5/lesson-draft.md` returns nothing (or only non-count usage)

#### Manual Verification

- Module 4 vision framing present in the intro ("foundation, then the challenges").
- Dual-MVP narration present in beats 4 and 6 (10xCards = worked example; your MVP = application).
- 10xCards demo cites real structure (82-line `CLAUDE.md`, `context/foundation/`, skills) accurately.
- Both failure modes disarmed; tiers not presented as mandatory steps.
- Ladder thresholds framed as judgment calls, not measured rules.
- Case-study counts framed as strategy-dependent, not targets; "count by cloning" trap included.
- No m1-l4 authoring re-teach; no legacy-lesson pre-emption; prework [3.1] extended, not re-explained.
- The three mermaid diagrams are logically correct and on-message.

**Implementation Note**: After Phase 1 automated checks pass, pause for human confirmation of the manual items (especially boundary and factual fidelity) before Phase 2.

---

## Phase 2: Tasks + Certification (beat 9)

> **Drafting tool — read first:** the agent running this phase under `/10x-implement` must **invoke `/lesson-draft`** to append these sections to `lessons/m4-l5/lesson-draft.md` (same draft, continued). Do not hand-write the prose directly. `/lesson-draft` keeps the voice and schema/spec/grounding alignment consistent with Phase 1; this plan's binding-table beat 9 + the certification TODO format are the contract.

### Overview

Draft the practical task, the badge one-liner, and the certification throughline — the lesson's payoff. The mandatory task lands on the learner's own MVP; the cert section is firm prose with three flagged TODOs.

### Changes Required

#### 1. Zadania praktyczne + Odbierz odznakę + cert framing

**File**: `lessons/m4-l5/lesson-draft.md`

**Intent**: Append the `## 🧑🏻‍💻 Zadania praktyczne` section (mandatory task: design + scaffold *your* MVP's context architecture and write the report's "context architecture" section), the standard `## Odbierz swoją odznakę` one-liner, and the certification throughline per binding table beat 9.

**Contract**: `## 🧑🏻‍💻 Zadania praktyczne` with the mandatory task framed on the learner's MVP (tier, scaffold, triggers, rationale → architectural-report section). `## Odbierz swoją odznakę` uses the canonical Mission Log one-liner from `references/lesson-structure.md`. Cert prose states Builder min-reqs + Architect path; three `<!-- TODO(cert): … -->` comments per the TODO format above. Section order: Zadania praktyczne → Odbierz odznakę (→ Deep Dive in Phase 3).

### Success Criteria

#### Automated Verification

- Practical tasks heading present: `grep -n '## 🧑🏻‍💻 Zadania praktyczne' lessons/m4-l5/lesson-draft.md`
- Badge section present with canonical one-liner: `grep -n 'Odbierz swoją odznakę' lessons/m4-l5/lesson-draft.md` and `grep -n 'Mission Log' lessons/m4-l5/lesson-draft.md`
- Exactly three cert TODOs: `grep -c 'TODO(cert)' lessons/m4-l5/lesson-draft.md` returns 3

#### Manual Verification

- Mandatory task is unambiguously on the learner's own MVP and feeds the architectural report.
- Builder min reqs (CRUD + 1 business-logic + risk-based tests) and "modules 4–5 not required for base Builder" stated correctly.
- "Single app ⇒ decide architecture at end of lesson/module" present.
- Cert section reads as payoff, not admin; TODOs cover the three unconfirmed specifics.

**Implementation Note**: Pause for human confirmation that the cert framing matches current intent (and the TODOs name the right unknowns) before Phase 3.

---

## Phase 3: Deep Dive + Materiały dodatkowe + Schema Wiring (beats 7–8)

> **Drafting tool — read first:** the agent running this phase under `/10x-implement` must **invoke `/lesson-draft`** for the prose sections (Deep Dive + Materiały dodatkowe) of `lessons/m4-l5/lesson-draft.md`. Do not hand-write the prose directly. The schema-wiring change (`videoPlaceholders`/`requiredFragments` in `lessons-schema.json`) is a direct edit outside `/lesson-draft`'s scope — apply it manually, target lesson `m4-l5` only. The binding-table beats 7–8 + house structure are the contract.

### Overview

Draft the optional-depth sections (tool load/merge mechanics; multi-repo awareness), curate the further-reading links, then populate the schema slot's `videoPlaceholders`/`requiredFragments` and write the side-effect ledger.

### Changes Required

#### 1. Deep Dive + Materiały dodatkowe

**File**: `lessons/m4-l5/lesson-draft.md`

**Intent**: Append `## 🔎 Deep Dive` (with the canonical intro paragraph + topic list) covering beats 7–8, then `## 📚 Materiały dodatkowe` with curated links. Keep beat 7 framed by the one mental model, not as a spec dump; keep the two refuted Codex claims out.

**Contract**: `## 🔎 Deep Dive` opens with the standardized intro + bulleted topic list (topics = the H3 subsections). Subsections per binding table beats 7–8. `## 📚 Materiały dodatkowe` uses `- [Title](URL) — description` for sources and `- Prework [x.y] *Title* — relevance` for prework [3.1]/[3.2]/[3.3]. Links drawn from grounding Strong Sources (Anthropic effective-context-engineering, OpenAI Harness, Anthropic large-codebases, Claude Code memory, Agent Skills, Codex AGENTS.md guide, agents.md spec, Cursor rules, Copilot instructions, Nx/Ruler).

#### 2. Schema slot wiring

**File**: `lessons-schema.json` (target lesson `m4-l5` only)

**Intent**: Populate the empty `videoPlaceholders` (the 3 from the spec) and `requiredFragments` (the load-bearing fragments the draft commits to). Touch no other lesson.

**Contract**: `videoPlaceholders` = the three spec placeholders (init/scaffold contrast; escalation decision → child index; optional multi-tool side-by-side). `requiredFragments` = the must-appear units (e.g. 4 failure modes, 3-way split, ladder+triggers, 10xCards demo, tool-load contrast, mandatory task + cert throughline). `dependsOn`/`preparesFor` left untouched (owned by `m4-reorder`).

### Success Criteria

#### Automated Verification

- Deep Dive + Materiały dodatkowe present: `grep -n '## 🔎 Deep Dive' lessons/m4-l5/lesson-draft.md` and `grep -n '## 📚 Materiały dodatkowe' lessons/m4-l5/lesson-draft.md`
- No bare URLs in further reading: `grep -nE '^- https?://' lessons/m4-l5/lesson-draft.md` returns nothing
- `videoPlaceholders`/`requiredFragments` non-empty for `m4-l5`: verify via a JSON read of the slot
- Schema still valid JSON: `python3 -c "import json;json.load(open('lessons-schema.json'))"`
- Refuted Codex claims absent: no "walks up to merge" / "per-file 32" phrasing in the Deep Dive

#### Manual Verification

- Deep Dive intro paragraph + topic list match the actual H3 subsections.
- Beat 7 keeps the one-mental-model framing; cap framed as version-sensitive; v1.1 said as "proposed".
- Beat 8 is awareness-only with an explicit M5-L3 pointer; no registry built.
- Materiały dodatkowe links resolve to the grounded sources; prework entries use the lesson-tag format.
- `videoPlaceholders`/`requiredFragments` accurately reflect the finished draft; no other schema lesson changed (`git diff lessons-schema.json` touches only the `m4-l5` slot).
- Side-effect ledger written (new claims, prework used/repeated, potential duplicates vs m1-l4, unsupported facts, needs-human-decision = cert forms).

**Implementation Note**: After Phase 3, the draft is RC-ready *pending* the cert-form TODOs and the editorial pass (`/lesson-editor-pl` then `/lesson-rc-review`).

---

## Testing Strategy

### Structural conformance (automated, per phase)

- Heading order/levels, forbidden-heading absence, Deep Dive intro convention, Materiały dodatkowe link format, badge one-liner, mermaid block count, JSON validity — as enumerated per phase.

### Factual fidelity (manual)

- Every claim traces to a `groundingSources` entry; every "Claims To Avoid Or Soften" item respected (no hard token number, heuristic thresholds flagged, arXiv scope stated, "88" not observable, two refuted Codex claims absent, cap version-sensitivity, v1.1 "proposed").

### Boundary fidelity (manual)

- No m1-l4 re-teaching; no legacy-lesson (m4-l2…m4-l5) pre-emption; no M5-L3 registry build; reorder untouched.

### Narration + payoff (manual)

- Dual-MVP frame present in beats 4/6/9; cert section reads as payoff with three flagged TODOs.

### Manual testing steps

1. Read top-to-bottom for flow; confirm the 9 beats are present and ordered.
2. Spot-check 5 random factual claims against `lesson-grounding.md` source rows.
3. Grep the "soften" list terms and confirm each is hedged or absent.
4. Confirm 10xCards facts (82-line `CLAUDE.md`, `context/foundation/` files) against the real repo.
5. `git diff lessons-schema.json` — only the `m4-l5` slot changed.

## Migration Notes

The `m4-reorder` change (parked) will later relocate `lessons/m4-l5/` → `lessons/m4-l1/`, rename the slot id, cascade Module-4 numbering, and rewire `dependsOn`/`preparesFor`. This draft is written at foundation altitude so the move is a relocation, not a rewrite. Do not pre-empt that change here.

## References

- Change identity: `context/changes/m4-l1-bootstrap/change.md`
- Spec: `lessons/m4-l5/lesson-spec.md`
- Grounding (beat→source map + soften list): `lessons/m4-l5/lesson-grounding.md`
- Positioning + certification: `lessons/m4-l5/positioning-and-certification.md`
- Research bundle: `lessons/m4-l5/research/*.md`
- House structure: `references/lesson-structure.md`; voice: `references/style.md`
- Prework continuity: `references/prework.md`
- Worked-example repo: `~/code/10xCards`
- Drafting tool: `/lesson-draft`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Core Spine (beats 1–6)

#### Automated

- [x] 1.1 File exists at lessons/m4-l5/lesson-draft.md
- [x] 1.2 Exactly one H1
- [x] 1.3 No forbidden headings (Wstęp/Core)
- [x] 1.4 Three mermaid blocks present
- [x] 1.5 No hard token threshold phrasing
- [x] 1.6 "88" not cited as observable count

#### Manual

- [ ] 1.7 Module 4 vision framing in intro
- [ ] 1.8 Dual-MVP narration in beats 4 and 6
- [ ] 1.9 10xCards demo cites real structure accurately
- [ ] 1.10 Both failure modes disarmed; tiers not mandatory
- [ ] 1.11 Ladder thresholds framed as judgment calls
- [ ] 1.12 Case-study counts framed as strategy-dependent; clone-trap included
- [ ] 1.13 No m1-l4 re-teach / no legacy pre-emption / prework extended not re-explained
- [ ] 1.14 Three diagrams logically correct

### Phase 2: Tasks + Certification (beat 9)

#### Automated

- [x] 2.1 Zadania praktyczne heading present
- [x] 2.2 Badge section present with canonical Mission Log one-liner
- [x] 2.3 Exactly three TODO(cert) comments

#### Manual

- [ ] 2.4 Mandatory task is on the learner's own MVP and feeds the report
- [ ] 2.5 Builder min reqs + "modules 4–5 not required for base Builder" correct
- [ ] 2.6 "Single app ⇒ decide architecture at end of lesson/module" present
- [ ] 2.7 Cert reads as payoff; TODOs name the three unconfirmed specifics

### Phase 3: Deep Dive + Materiały dodatkowe + Schema Wiring (beats 7–8)

#### Automated

- [x] 3.1 Deep Dive + Materiały dodatkowe sections present
- [x] 3.2 No bare URLs in further reading
- [x] 3.3 videoPlaceholders/requiredFragments non-empty for m4-l5
- [x] 3.4 Schema still valid JSON
- [x] 3.5 Refuted Codex claims absent from Deep Dive

#### Manual

- [ ] 3.6 Deep Dive intro + topic list match H3 subsections
- [ ] 3.7 Beat 7 keeps one-mental-model framing; cap version-sensitive; v1.1 "proposed"
- [ ] 3.8 Beat 8 awareness-only with M5-L3 pointer; no registry built
- [ ] 3.9 Materiały dodatkowe links grounded; prework tag format used
- [ ] 3.10 Schema diff touches only the m4-l5 slot
- [ ] 3.11 Side-effect ledger written (needs-human-decision = cert forms)
