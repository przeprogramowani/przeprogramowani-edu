# Research input 1: Methodology extracted from 10xDevs-3 M4L2–M4L5

Source lessons (PL):
- `src/content-source/lessons10xDevs3/pl/17-m4l2-agent-w-projekcie-legacy-generowanie-mapy-projektu.md`
- `src/content-source/lessons10xDevs3/pl/18-m4l3-analiza-feature-z-ai.md`
- `src/content-source/lessons10xDevs3/pl/19-m4l4-refaktoryzacja-z-agentem.md`
- `src/content-source/lessons10xDevs3/pl/20-m4l5-modernizacja-legacy-z-ddd.md`

The four lessons form one continuous pipeline producing a single stacked report with five elements:

- **① Mapa projektu** (Project Map) — L2
- **② Feature overview** — L3
- **③ Technical debt** — L3
- **④ Refactor opportunities** — L4
- **⑤ DDD opportunities** — L5

Guiding meta-principle: **cheap, deterministic CLI collects evidence; the agent interprets; the human decides.** Every claim is tagged `evidence` / `inference` / `unknown`.

## M4L2 — Project Map (Wide Scan)

- Two-stage process: **Wide Scan → Deep Focus**. Wide Scan loop: choose tool → define goal → generate command → present result → discuss and deepen.
- Three map components, each a working artifact in `context/map/`:
  1. **Terytorium** — active vs frozen areas, co-changes (git history) → `artifact-1-territory.md`
  2. **Struktura** — entry points, layers, import direction, cycles (`dependency-cruiser`: `--collapse`, `--focus`, `--metrics` with Ca/Ce/instability, `no-circular`) → `artifact-2-structure.md`
  3. **Kontekst kontrybutorów** — who has hidden knowledge (git authors, filtering bots/agents) → `artifact-3-contributors.md`
- Synthesis → `context/map/repo-map.md` with fixed structure: **TL;DR / Teren / Realne powiązania / Strefy ryzyka / Kogo zapytać / Pierwszy dzień / Ograniczenia**. Goal: new dev oriented in 15 min.
- Prompt discipline: Markdown tables first, diagrams only after selection. Filter noise (lockfiles, snapshots, generated files). History ≠ current state — verify coupled files still exist.
- Module labels (label without evidence = guess): `core/supporting/peripheral`, `deep/shallow`, `stable/volatile/seasonal`, `load-bearing/contained`, sensitivity high/medium/low. Record shape per module: `role / evidence / inference / caution / unknowns`.
- Failure modes: random deep-read; map without decisions. A good map is operational and ends with a decision.

## M4L3 — Feature Analysis (Deep Focus)

- `repo-map.md` is an **input contract**: `Strefy ryzyka` → pick target, `Pierwszy dzień` → entry points, `Ograniczenia` → first unknowns. Map is a prior, not truth.
- Pick ONE flow/module. `/10x-new {change-id}`, then `/10x-research` with exactly **three parallel sub-agents**:
  1. **Trace e2e** — entry point through layers to write/read and back; steps with `file:line` + Mermaid.
  2. **Test gaps** — which methods/branches on the path are covered vs not.
  3. **Blast radius** — what must change together (static graph + git co-change).
- Report → `context/changes/{change-id}/research.md` with two sections: **② Feature overview** (a flow, not a file list) and **③ Technical debt** (map of fragility: where change silently corrupts data/contract, where the safety net is missing; distinguish real debt from cheap coupling).
- **Verify structural claims with ast-grep** (claim → confirmed/clarified/refuted with files & lines); confirm every zero with classic grep. Analysis only — stop before refactor.
- Heuristics: hotspot = complexity × change frequency; connascence vocabulary; pair vs hub co-change; rank risk from two sources at once (static + co-change), contradictions become `unknown`.

## M4L4 — Refactor opportunities

- Anti-pattern: "refactor this module" (no target shape, no history, no reversible path). You commission **presentation of options**; the human decides. **Exploration ends with a report, not a decision** — the decision gate is `/10x-plan`.
- New change with explicit staged intent (eksploracja → decyzja i plan → implementacja). Enumerate all problems; classify **KANDYDAT** = fix would change code structure. Three sub-agents per candidate:
  1. **Current shape** — where logic lives, couplings, `file:line`, evidence/inference/unknown.
  2. **History & intentionality** — ADRs else git archaeology; verdict: deliberate constraint / accidental complexity / unknown.
  3. **Migration feasibility** — incremental reversible path, blast radius, existing guards/tests, first prerequisite step.
- Target-shape spectrum (Fowler PoEAA): **Transaction Script / Table Module / Domain Model (+ Service Layer)** — a spectrum with profitability thresholds, not a ranking. **Right-sizing:** small simple module STAYS a Transaction Script; deliberate constraint gets a cheap deterministic **guard**, not a rebuild.
- Hard boundaries: no code changes; don't design target architecture beyond naming an adequate shape; if the real fix is redesigning business concepts — STOP (defer to DDD/L5); missing data = `unknown`.
- Output: **④ Refactor opportunities** — 2–3 strongest candidates ranked (current → target shape, debt cost vs change cost, blast radius, sketch of incremental path, first prerequisite) + rejected candidates with reasons.
- Plan properties (for `/10x-plan`): guard-first ordering, each phase a separately reversible commit, **add the test before you touch** (characterization test), **mechanism lands green / enforcement turns on separately**, explicit "What We're NOT Doing". Reversibility patterns: Strangler Fig, Branch by Abstraction, Mikado.

## M4L5 — DDD opportunities

- Question shift: "does this code match how the business works?" Four techniques, all agent-delegated:
  1. **Ubiquitous language first** — language boundaries reveal context boundaries (`3xAccount` symptom). Domain-expert interview (LLM as hypothesis generator, not truth) or context-doc-vs-code distillation.
  2. **Invariants** — aggregate as consistency boundary and sole guard; illegal ops throw named domain errors (fail-fast). Pick invariant that is most core AND most weakly enforced (enforced / declared / violable).
  3. **Anti-Corruption Layer** — leaking dependency signals (same package imported across layers, library types in wire contracts, duplicated reconstruction); cure = domain value object + narrow port + adapter. Success criterion: `grep` for the package returns only adapter files.
  4. **Event Storming** — agent as moderator, `board.json` as source of truth; hotspots = candidate list.
- Artifacts in `context/domain/`: `01-domain-distillation.md` (ubiquitous language, Core/Supporting/Generic subdomains, aggregate candidates + invariants, MODEL-vs-KOD divergence list, refactor ranking), `02-invariant-aggregate-refactor.md`, `03-anti-corruption-layer.md`. Final: `context/architect-report.md` (two-pager).
- When to reach for DDD: post-MVP, when the domain hurts (same term means several things; PRD entity has no code counterpart; swapping one library becomes a sprint).
- Feed artifacts back into the same skills: `/10x-research @context/domain/01-...`, `/10x-plan @context/domain/02-...`, `/10x-roadmap` for hotspots.

## One-paragraph runbook (applied to any codebase)

1. **Wide Scan (L2):** `context/map/` — territory, structure, contributors → fixed-structure `repo-map.md`.
2. **Deep Focus (L3):** one flow from Strefy ryzyka → `context/changes/{id}/research.md` with ② + ③, ast-grep verification.
3. **Refactor options (L4):** enumerate → classify KANDYDAT → shape/history/feasibility → ④ ranked opportunities → decision at `/10x-plan` (guard-first, test-before-touch).
4. **DDD (L5):** `context/domain/` — distillation, invariant/aggregate, ACL, Event Storming → ⑤ → feed back into skills.
