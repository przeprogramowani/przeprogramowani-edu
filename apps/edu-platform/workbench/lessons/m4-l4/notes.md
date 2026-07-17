# Notes — M4L4: Refactor opportunities (grounded, archetype-mapped, history-aware)

> Conceptual scaffolding for L4, distributed from `workbench/lessons/m4-shape.md` §5.
> Report element produced: **④ Refactor opportunities.** Lesson opens with *why +
> current problem*, then applies these lenses. Concept is the hero; AI operationalizes
> it at scale.

## Why / current problem (recap)

Hot spots are problems; this lesson turns them into *options*. Refactor ideas that ignore
past decisions, constraints, and explicit non-goals get rejected or cause regressions.
"Modernize" with no target shape = paralysis or cargo-cult patterns; nobody remembers
*why* the awkward bit exists (and it might be load-bearing).

## Grounded lenses (≥3)

### 1. Enterprise application archetypes — *M. Fowler, Patterns of Enterprise Application Architecture (2002)*
The domain-logic spectrum gives **target shapes** to map a module against:
**Transaction Script → Table Module → Domain Model**, organized by a **Service Layer**.
- **Apply:** "this module is an overgrown Transaction Script that wants to become a
  Domain Model" is a grounded, defensible refactor thesis — not "rewrite it."
- **Pairs with — accidental vs essential complexity** (*F. Brooks, "No Silver Bullet",
  1986*): separate removable cruft from inherent hardness before proposing change.

### 2. Strangler Fig + Branch by Abstraction — *M. Fowler (2004) / P. Hammant*
Incremental, **reversible** migration strategies: replace legacy behind a stable
facade / abstraction layer rather than via big-bang rewrite.
- **Apply:** every refactor opportunity ships with a safe, incremental path and a
  rollback story — the modernization is a sequence of small reversible steps.

### 3. The Mikado Method — *O. Ellnestam & D. Brolund (2014)*
A systematic procedure for large refactorings: attempt a change, observe what breaks,
record prerequisites as a dependency graph (the **Mikado graph**), revert, resolve the
leaves first.
- **Apply:** turns a daunting refactor into an ordered, verifiable plan.
- **Pairs with — seams & characterization tests** (*M. Feathers, Working Effectively with
  Legacy Code, 2004*): establish a test harness around legacy code before touching it;
  sprout/wrap method/class to add behavior safely.

## Bonus lenses (optional, if room)

- **ADRs** — *M. Nygard (2011)*: ground proposals in past decisions and explicit
  no-goals; distinguish intentional constraint from accidental complexity.
- **Fitness functions** — *Ford, Parsons & Kua, Building Evolutionary Architecture
  (2017)*: objective guardrails for the refactor's direction.
- **Technical debt quadrant** (*Fowler*) / principal-vs-interest framing (*Cunningham*):
  prioritize which opportunities are worth paying down now.

## Tooling / data sources (operationalize the lenses)

- Archetype catalog as a lens; incremental-refactor framing (tests as the seatbelt) —
  connects back to M3 testing work.
- Data sources: ADRs, git/PR rationale, post-mortems, issue tracker, and the L3
  hot-spot list (the input that makes opportunities concrete).

## Output of the lesson

The **refactor-opportunities** report section: 2–3 ranked, justified candidates per
analyzed module — current archetype → target archetype, grounded in history/ADRs/no-goals,
each with blast radius, an incremental path (Strangler/Branch-by-Abstraction), and a
Mikado-style prerequisite sketch. Right-sized modernization, no over-engineering.

> Attributions are confident-but-unverified — confirm in `lesson-grounding` before
> learner-facing prose.
