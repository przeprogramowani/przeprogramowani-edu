# M4 — Shape notes: "Large scale & legacy projects"

> Direction-setting brainstorm for Module 4 (lessons L1–L5). Not a spec, not a draft.
> Source of truth remains `lessons-schema.json` — the schema slots m4-l1…m4-l5 are
> currently empty (`status: planned`), so this doc proposes how to fill them.
>
> **The spine of the whole module is one deliverable.**

---

## 0. The spine: the 10xArchitect Badge report

Every lesson serves one outcome: a **5-element architecture report** the learner
completes to earn the **10xArchitect Badge**. The report is the curriculum's
backbone — each lesson hands the learner a finished section of it.

| # | Report section            | Produced in | One-line definition |
|---|---------------------------|-------------|---------------------|
| 0 | **Context architecture**  | **L1**      | The report's foundation: chosen maturity tier, `context/` scaffold, escalation signals, rationale (deployment/ownership boundary). |
| 1 | **Mapa projektu**         | **L2**      | High-level territory map of the whole system: modules, dependencies, deep vs shallow areas. |
| 2 | **Feature overview**      | **L3**      | Data flow through *one* chosen module/feature, end to end. |
| 3 | **Issues & hot spots**    | **L3**      | Where that module hurts: churn × complexity, risk, fragility, coupling. |
| 4 | **Refactor opportunities**| **L4**      | Concrete, grounded modernization candidates mapped to archetypes. |
| 5 | **DDD opportunities**     | **L5**      | Domain-level openings: bounded contexts, ubiquitous language, invariants, entities/VOs. |

> **Status note (2026-06-02):** this doc originally cast L1 as a *theoretical* lesson
> producing no report element. That is **superseded**. After the `m4-reorder` change, the
> **context-scaling lesson now occupies L1** (was m4-l5) and is Module 4's foundation. L1
> **does** contribute to the report — the **Context architecture** section (⓪ above) — *and*
> it thematically prepares L2–L5. **L1's own artifacts (`m4-l1/lesson-spec.md`,
> `lesson-draft.md`) are the source of truth for L1**; this doc is the source of truth for
> **L2–L5** only.
> See `m4-l1/m1-to-others.md` for the L1→L2–L5 continuity notes (what L1
> hands forward and the foundations the downstream lessons assume).

> Note: L3 carries two elements (feature overview + hot spots). They're the two
> outputs of the same act — analyzing one module — so they belong together, not
> split across two lessons.

### The project

- **Course project:** an advanced/large version of **10xCards** (brownfield, more
  modules, more history than the MVP learners built earlier). This is the worked example.
- **Variadic by design:** the report is project-agnostic. Learners can build it
  against **any OSS or work codebase** they pick. Every lesson must teach the
  *technique*, not a 10xCards-specific recipe — 10xCards is the demo, not the contract.

---

## 1. Cross-cutting principles (apply to every lesson)

1. **Start with "why" + "current problem", then ideas.** Each lesson opens by
   naming the pain a developer feels on a large/legacy codebase *before* showing any
   technique. No technique lands without the ache it answers.
2. **Teach techniques, tools, and data sources — not AI capabilities.** The hero is
   the *method* (territory mapping, churn analysis, event storming) and the
   *project's own data* (git history, ADRs, issues, traces). AI is the accelerant
   that makes the method tractable at scale — it is never the subject of the lesson.
3. **AI is an ally, the human decides.** Reuse the framing already set in the M4L5
   2nd-edition draft: AI enriches modeling and analysis; architectural judgment stays
   with the learner. The report is *theirs*, defended, not auto-generated.
4. **Every lesson ends with a concrete artifact** (L2–L5: a report section; L1: the
   data-source inventory + a sizing/strategy note). Outcome = something checked off
   toward the badge.
5. **Progressive disclosure of scale.** L1 establishes that you cannot read the whole
   repo at once; every later lesson is an exercise in *deliberate, budgeted* reading —
   zoom out (L2), zoom into one module (L3), then reason about change (L4–L5).

---

## 2. Lesson-by-lesson distribution

### L1 — Context scaling: the foundation (lean root + `context/`)

> **L1 is now the context-scaling lesson** (reordered from m4-l5). **L1's own artifacts are
> the source of truth** — do not re-plan L1 from this doc:
> - `m4-l1/lesson-spec.md` — job, thesis, owned concepts, `Must Not Cover`.
> - `m4-l1/lesson-draft.md` — the RC-quality draft.
> - `m4-l1/m1-to-others.md` — **L1→L2–L5 continuity notes** (foundations L1 hands forward,
>   gaps the downstream lessons assume, the L1→L2 seam).
>
> Below is only L1's **role within Module 4**, kept here so the L2–L5 plan stays coherent.

**Role in the module:** Module 4's foundation. The learner can drive an agent on a single
project (m1-l4) but assumes "just keep adding to `AGENTS.md`." L1 replaces that with a
**lean root + `context/` system-of-record** and a **maturity ladder** (escalate structure
only on an observable signal). Thesis: *not "what should the agent know?" but "what should
the agent know **right now**?"*

**Report section produced:** ⓪ **Context architecture** (the report's foundation — chosen
tier, scaffold, escalation signals, rationale). L1 *does* influence the report; it is the
opening section, distinct from the five analysis elements L2–L5 produce.

**What L1 hands forward to L2–L5 (the foundation they reuse):**
- **A home for every downstream artifact** — `context/` is explicitly framed as where the
  Mapa projektu, feature analyses, and refactor/DDD plans will live. *(Strong, already in draft.)*
- **The collaboration contract** — AI as analyst/ally, human owns & defends the report.
  *(Assumed by L5's draft + every lesson; see `m1-to-others.md` G1.)*
- **The attention-budget mindset** — extended from "you can't put the whole project in one
  `AGENTS.md`" toward "you can't read the whole repo at once either" → the bridge into L2's
  wide-then-deep. *(Bridge only; the technique is L2's. See `m1-to-others.md` G2.)*

**Out of L1's scope (owned downstream — do NOT pull forward):** the project data-source
inventory (git history, ADRs, issues, observability) is the raw material of L2–L4 analysis
and stays where each source is introduced at point-of-use. L1's `Must Not Cover` forbids
pre-empting mapping/analysis/refactor/DDD.

**Bridge out → L2:** "`context/` holds what the project *knows*; but you still can't *see*
the system. Same attention budget — you can't read it all at once. First job: draw the map."

---

### L2 — Mapa projektu: the territory before the trees

*Schema title today: "Analiza feature z AI…" → proposed reframe: project mapping. See §3.*

**Why**
You can't decide what to change until you can see the whole board. A shared,
high-level map turns "I'm lost in someone else's code" into "I know roughly where
things live and how they connect."

**Current problem**
- Folder structure ≠ architecture; the real boundaries are implicit.
- It's unclear which modules are load-bearing vs peripheral, deep vs shallow.
- Onboarding/handover docs are stale or never existed.

**Report element produced:** ① **Mapa projektu.**

**Key learning outcomes**
- Produce a high-level **territory map**: modules, their responsibilities, dependency
  direction, entry points.
- Classify modules: **deep vs shallow**, core vs supporting, stable vs volatile.
- Read the map *economically* — big picture first, drill only where it matters.
- Spot the obvious structural smells at the macro level (god-modules, cyclic deps,
  tangled boundaries) without yet going deep.

**Beats**
1. From folders to a real map: what a useful architecture map shows (and omits).
2. Building it: dependency graph + responsibilities + entry points → diagram.
3. Deep vs shallow / core vs periphery: marking the map.
4. First read of the terrain: where are the suspicious neighborhoods? (sets up L3 target).
5. Capture: the Mapa projektu section of the report.

**Techniques / tools / data sources**
- Dependency graphing (e.g. madge / dependency-cruiser-style analysis), import graphs.
- Mermaid/Excalidraw as the whiteboard for the map (consistent with house Mermaid workflow).
- Data sources: directory structure, build/workspace config, dependency manifests,
  entry points/routes, README.

**10xCards grounding / variadic**
Map advanced-10xCards live; learner maps their own project and **chooses the one module
they'll analyze in L3.**

**Bridge in ← L1 / Bridge out → L3:** "Map in hand, pick the module that matters and go deep."

---

### L3 — Feature & module analysis: one domain, end to end + where it hurts

*Schema title today: "Refaktoryzacja z Agentem…" → proposed reframe: single-module
analysis (refactoring moves to L4). See §3.*

**Why**
The map tells you *where*; now you need *how it actually works* in the one place you
care about — and honest signal about where that place is fragile. This is the lesson
that turns a vague "this part is scary" into evidence.

**Current problem**
- A single feature's data flow is spread across layers, async hops, and side effects.
- "Risky" is folklore — nobody can point to *why* a module is risky with data.
- Changes here cause regressions because the blast radius is unknown.

**Report elements produced:** ② **Feature overview** + ③ **Issues & hot spots.**
(Two elements, one act of analysis.)

**Key learning outcomes**
- Trace **end-to-end data flow** for one module: inputs → commands → state changes →
  side effects → outputs. Make the implicit explicit.
- Surface **hot spots** with evidence, not vibes: **churn × complexity** (crime-scene /
  Tornhill-style hotspot analysis), coupling, change-coupled files, defect-prone areas.
- Assess **risk**: blast radius, missing tests, fragile seams, hidden side effects.
- Produce two report sections from one investigation.

**Beats**
1. Zoom in: scoping the chosen module so analysis stays tractable.
2. Data-flow trace: build the end-to-end picture (sequence/flow diagram). → element ②.
3. Hot-spot analysis: churn × complexity from git history; coupling and change-coupling.
4. Risk read: blast radius, test coverage gaps, fragile side effects. → element ③.
5. Capture: feature-overview + issues/hot-spots sections.

**Techniques / tools / data sources**
- Hotspot analysis: `git log` churn, complexity proxies, change-coupling (code-maat-style).
- Data-flow / sequence reconstruction (diagram as output).
- Data sources: git history/blame, the module's code + tests, issue tracker for past
  bugs in this area, observability/error rates if available.

**10xCards grounding / variadic**
Pick one advanced-10xCards module (e.g. flashcard generation or account lifecycle) and
work it live; learner does the same on their module. Candidate-module thinking from the
existing M4L5 notes (async generation, deletion saga, acceptance metrics) is a good
reservoir of demo targets.

**Bridge in ← L2 / Bridge out → L4:** "You know how it works and where it hurts —
now, what should change?"

---

### L4 — Refactor opportunities: grounded, archetype-mapped, history-aware

*Schema title today: "Modernizacja legacy z DDD…" → proposed reframe: refactor
opportunities (DDD/event-storming concentrates in L5). See §3.*

**Why**
Hot spots are problems; this lesson turns them into *options*. The skill is proposing
modernization that is grounded in the project's reality — not a generic "rewrite it"
that ignores why the code is the way it is.

**Current problem**
- Refactor ideas are ungrounded: they ignore past decisions, constraints, and explicit
  non-goals, so they get rejected or cause regressions.
- "Modernize" with no target shape = analysis paralysis or cargo-cult patterns.
- Nobody remembers *why* the awkward bit exists (and it might be load-bearing).

**Report element produced:** ④ **Refactor opportunities.**

**Key learning outcomes**
- Map a module's needs/flows to **architectural archetypes** (e.g. transaction script,
  active record, domain model, CQRS, event-driven) — identify the gap between current
  and fitting shape.
- **Ground opportunities in history:** read ADRs, commit/PR rationale, no-goals, and
  post-mortems before proposing change. Distinguish accidental complexity from
  intentional constraint.
- Produce ranked, justified refactor candidates with blast radius and a safety note
  (tests-first, incremental, reversible) — not a big-bang.

**Beats**
1. From hot spot to options: framing modernization as candidates, not mandates.
2. Archetype mapping: what shape does this module's behavior actually want?
3. Grounding: ADRs, history, no-goals, post-mortems — why is it like this?
4. Ranking + safety: blast radius, incremental path, test scaffolding before change.
5. Capture: refactor-opportunities section.

**Techniques / tools / data sources**
- Archetype catalog as a lens; ADRs (Nygard) and change history as grounding.
- Incremental-refactor framing (tests as the seatbelt) — connects to M3 testing work.
- Data sources: ADRs, git/PR rationale, post-mortems, issue tracker, the L3 hot-spot list.

**10xCards grounding / variadic**
Propose 2–3 grounded refactors for the L3 module of advanced-10xCards; learner does the
same. Reuse the "honesty / no over-engineering" guardrail from M4L5 notes — small-scale
project means right-sized modernization, not Kafka-for-the-sake-of-it.

**Bridge in ← L3 / Bridge out → L5:** "Some opportunities are tactical. The deepest ones
are about the domain itself — that's DDD."

---

### L5 — Agent as DDD coach: event storming, ubiquitous language, bounded contexts

*Schema title today: "Skalowanie kontekstu dla AI w dużych projektach". Existing M4L5
notes + 2nd-edition draft already treat L5 as the DDD/Event-Storming lesson. See §3.*

**Why**
The hardest modernization isn't moving code — it's discovering the domain hiding inside
it. This lesson uses AI as a **DDD coach** to surface the model the code never made
explicit, which is where the highest-leverage opportunities live.

**Current problem**
- The domain language is inconsistent: same concept, three names; one name, three meanings.
- Module boundaries don't match domain boundaries — leaky, tangled contexts.
- Invariants and rules are implicit, scattered, and silently violated.

**Report element produced:** ⑤ **DDD opportunities.**

**Key learning outcomes** (three pillars)
1. **Event Storming with AI** — model a full process (events, commands, actors,
   policies) with AI as moderator and a Mermaid diagram as the live whiteboard
   (technique already drafted in the 2nd-edition L5).
2. **Ubiquitous language** — extract and strengthen the domain vocabulary; surface and
   resolve naming clashes; align code to language.
3. **Bounded contexts** — define context boundaries *within* the module; name invariants;
   sketch the road to entities and value objects.

**Beats**
1. Why DDD now: from "refactor the code" to "discover the domain."
2. Event Storming workshop with AI (the 2nd-edition draft beat): events → commands →
   actors → policies → hot spots.
3. Ubiquitous language: mine the model + code for terms, fix the clashes.
4. Bounded contexts + invariants: where do boundaries belong; what must always hold.
5. Toward entities/value objects (lightweight road, not a rewrite). → element ⑤.

**Techniques / tools / data sources**
- Event Storming (Brandolini); DDD building blocks (Evans/Vernon): ubiquitous language,
  bounded contexts, aggregates/invariants, entities vs value objects.
- AI-as-moderator pattern + Mermaid whiteboard (reuse the 2nd-edition L5 approach).
- Data sources: the L3 data-flow model, domain experts/PRD, existing naming in code.

**10xCards grounding / variadic**
Run a storming session on an advanced-10xCards process (the existing notes lean toward
async flashcard generation as the worked feature); learner storms their own domain.
Honor the existing decision to keep it concept-level and stack-agnostic where possible.

**Bridge in ← L4 / Bridge out → M5:** report complete → **10xArchitect Badge.**
The learner now holds a full architecture report for a project they didn't write —
the launchpad into M5 team-scale work.

---

## 3. Open decisions / schema drift to flag (needs human confirmation)

> **⚠️ Mostly resolved — the reorder was EXECUTED 2026-06-02 via the `m4-reorder` change.**
> The slot table below is the *pre-reorder* proposal, kept for provenance. **Current
> reality:** context-scaling = **m4-l1**; the four legacy lessons cascaded down one slot
> (map = m4-l2, feature+hotspots = m4-l3, refactor = m4-l4, DDD = m4-l5). Schema renumber,
> dependency rewiring, and folder moves are done (see `m4-l1/positioning-and-certification.md`).
> Only decision #4 below remains genuinely open.

| Slot (pre-reorder) | Current schema title | Proposed role | Drift? |
|------|----------------------|---------------|--------|
| m4-l1 | Agent zbuduje Ci mapę i wyjaśni architekturę | **Theory / foundations** (map-building moves to L2) | **Title↔role mismatch** — title says "map", role is foundations. |
| m4-l2 | Analiza feature z AI | **Mapa projektu** | Element-1 (map) vs title's "feature". |
| m4-l3 | Refaktoryzacja z Agentem | **Feature overview + hot spots** | Refactor language belongs in L4. |
| m4-l4 | Modernizacja legacy z DDD | **Refactor opportunities** | "DDD" concentrates in L5; L4 is refactor. |
| m4-l5 | Skalowanie kontekstu dla AI… | **DDD coach / Event Storming** | Existing M4L5 notes + 2ed draft already = DDD/storming, not "context scaling." |

**Decisions — status after the reorder:**
1. ~~Adopt the reframe and retitle m4-l1…m4-l5~~ — **DONE** via `m4-reorder` (schema renumbered).
2. ~~"Context scaling for AI" — standalone lesson or absorbed?~~ — **RESOLVED:** it is the
   **standalone foundation lesson at m4-l1**, not merely an economics beat.
3. ~~L1 produces no report element~~ — **REVISED:** L1 **does** contribute the report's
   **Context architecture** section (⓪). It is the report's foundation + thematic on-ramp,
   not one of the five analysis elements.
4. **L3 owns two report elements** (feature overview + hot spots) — confirm that's the
   intended split (vs. moving hot spots into L4). *(Still open.)*
5. ~~Existing m4-l5 folder numbering inconsistency~~ — superseded by the reorder; L5 (DDD)
   notes live at `m4-l5/notes.md`; the context-scaling lesson moved to `m4-l1/`.

---

## 4. Shared resource — the project data-source inventory (owned downstream, point-of-use)

> **Placement decision (2026-06-02):** this inventory is **NOT built in L1**. L1 (context
> scaling) is deliberately lean and its `Must Not Cover` forbids pre-empting mapping/
> analysis/refactor/DDD. Each source is introduced **at point-of-use** in the lesson that
> needs it (the "Used in" column). The table below is the planning map of which source
> lands where — not an L1 deliverable.

The recurring "useful data sources about the project" thread — which source answers which
question, and where it is introduced:

| Source | Best for | Used in |
|--------|----------|---------|
| Directory / workspace / build config | Module boundaries, entry points | L2 |
| Dependency manifest + import graph | Coupling, deep/shallow, cycles | L2 |
| `git log` / churn / blame | Hot spots, ownership, volatility, *why* | L3, L4 |
| Change-coupling (files that change together) | Hidden coupling across boundaries | L3 |
| Tests / coverage | Risk, blast radius, refactor safety net | L3, L4 |
| Issue tracker / PRs | Known pain, past bugs, rationale | L3, L4 |
| ADRs | Past decisions, constraints, no-goals | L4 |
| Post-mortems | Where it broke and why | L4 |
| Observability (Sentry, logs, metrics) | Real failure rates, hot paths | L3 |
| PRD / domain experts / naming in code | Ubiquitous language, invariants | L5 |
| README / docs | Stated intent (verify against reality) | L1, L2 |

---

## 5. Conceptual scaffolding — grounded lenses per lesson

The intellectual backbone of each lesson: named, citable concepts from software
engineering, software architecture, and enterprise/legacy-systems practice. Each is a
**lens** the learner applies to their project; AI operationalizes the lens at scale.

> Attributions below are illustrative and to be confirmed in the formal
> `lesson-grounding` pass. They anchor the lesson's vocabulary and altitude — the goal
> is *precise technical terminology*, not folk intuition.

### L2 — Mapa projektu · structural & dependency lenses

1. **Deep vs shallow modules** — *J. Ousterhout, A Philosophy of Software Design (2018).*
   A module's value is interface simplicity relative to implementation depth; shallow
   modules (interface ≈ implementation) leak complexity upward. → Classify mapped
   modules by depth; deep modules are good boundaries, shallow ones are smells.
   Pairs with **information hiding** — *D. Parnas, "On the Criteria To Be Used in
   Decomposing Systems into Modules" (1972)* — decompose by hidden design decisions,
   not by processing steps.

2. **Coupling metrics & the Main Sequence** — *R. C. Martin, package design principles.*
   Afferent (Ca) / efferent (Ce) coupling, **Instability** `I = Ce/(Ca+Ce)`,
   **Abstractness** `A`, and **distance from the main sequence** `D = |A+I−1|`. →
   Quantify which modules are unstable-but-depended-on (pain) and locate zones of
   uselessness/pain. Turns "feels coupled" into a coordinate.

3. **Architectural core & propagation cost (DSM)** — *MacCormack, Rusnak & Baldwin,
   "Exploring the Structure of Complex Software Designs" (2006).*
   Dependency Structure Matrix analysis classifies components as core / peripheral /
   shared and measures **propagation cost** (fraction of the system reachable by a
   change) and **cyclic groups**. → Identify the load-bearing core and tangled cycles
   on the map; this is the enterprise-grade version of "deep vs shallow."

4. **Wide-then-deep under a bounded context window** — *R. Brooks / von Mayrhauser &
   Vans (top-down + integrated comprehension); Littman (opportunistic comprehension);
   Pirolli & Card (Information Foraging — "information scent").*
   The methodological reason L2 precedes L3: build a broad model first so you know
   *where* to spend the expensive deep read. The map provides the "scent" that steers
   the dive — neither a human nor an agent fits the whole repo at once. → Justifies the
   whole module's wide→deep structure (ties to L1 context economics).

5. **Repo retrieval models (grep → indexes → RAG → agentic search)** — engineering lens.
   Four families with distinct trade-offs: **lexical/pattern** (`grep`/`ripgrep` — exact,
   cheap, no semantics), **structural/symbol** (ctags, LSP, SCIP/LSIF, ast-grep),
   **semantic/RAG** (embeddings over code chunks; staleness & chunking risks), and
   **agentic search** (iterative tool-driven ReAct — fresh, no index, but token-costly).
   → How the map (and later the deep dive) is actually built. **Placement is fluid: the
   deep/agentic-search half may move to L3** (wide search builds the map in L2; deep,
   targeted reading traces flow in L3).

   *Bonus lenses:* **Software Reflexion Models** (*Murphy, Notkin & Sullivan, 1995*) —
   diff the *as-intended* architecture against the *as-built* dependency graph;
   **C4 model** (*S. Brown*) — map at deliberate altitudes (Context → Container →
   Component → Code); **Conway's Law** (*M. Conway, 1968*) + the Inverse Conway
   Maneuver — module structure mirrors org structure.

### L3 — Feature & hot spots · behavioral & coupling-strength lenses

1. **Hotspots = complexity × change frequency** — *A. Tornhill, Your Code as a Crime
   Scene (2015) / Software Design X-Rays (2018).*
   Behavioral code analysis ranks risk by combining a complexity proxy with version-
   control change frequency; complex code that rarely changes is not the priority. →
   The evidence-based engine for the "issues & hot spots" element.

2. **Connascence** — *M. Page-Jones, What Every Programmer Should Know About OO Design
   (1996).*
   A precise taxonomy of coupling *strength* and *locality*: static (name, type,
   meaning, position, algorithm) and dynamic (execution, timing, value, identity). →
   Name *why* a seam is fragile with exact terminology instead of "tightly coupled";
   stronger + more distant connascence = higher modernization priority.

3. **Change coupling (temporal / logical coupling)** — *Gall, Hajek & Jazayeri (1998);
   Tornhill's "sum of coupling".*
   Files/modules that change together in history are coupled regardless of static
   dependencies — surfaces hidden coupling that crosses architectural boundaries. →
   Detect implicit blast radius the dependency graph (L2) can't see.

   *Bonus lenses:* **Code churn as defect predictor** (*Nagappan & Ball, MSR 2005*) —
   relative churn correlates with defect density; **cyclomatic complexity** (*McCabe,
   1976*) and **cognitive complexity** (*SonarSource*) as complexity proxies; **change
   impact analysis / program slicing** (*Weiser, 1981*) to compute the blast-radius set.

### L4 — Refactor opportunities · archetype & migration lenses

1. **Enterprise application archetypes** — *M. Fowler, Patterns of Enterprise
   Application Architecture (2002).*
   The domain-logic spectrum — Transaction Script → Table Module → Domain Model, with
   Service Layer — gives target shapes to map a module against. → "This module is an
   overgrown Transaction Script that wants to become a Domain Model" is a grounded,
   defensible refactor thesis. Pair with **accidental vs essential complexity**
   (*F. Brooks, "No Silver Bullet", 1986*) to separate removable cruft from inherent hardness.

2. **Strangler Fig + Branch by Abstraction** — *M. Fowler (2004) / P. Hammant.*
   Incremental, reversible migration strategies that replace legacy behind a stable
   facade/abstraction layer rather than via big-bang rewrite. → Every refactor
   opportunity ships with an *incremental, safe path*, not a rewrite fantasy.

3. **The Mikado Method** — *O. Ellnestam & D. Brolund (2014).*
   A systematic procedure for large refactorings: attempt a change, observe what breaks,
   record prerequisites as a dependency graph (the "Mikado graph"), revert, and resolve
   leaves first. → Turns a daunting refactor into an ordered, verifiable plan. Pairs with
   **seams & characterization tests** (*M. Feathers, Working Effectively with Legacy Code,
   2004*) — establish a test harness around legacy before touching it; sprout/wrap.

   *Bonus lenses:* **ADRs** (*M. Nygard, 2011*) to ground proposals in past decisions and
   no-goals; **fitness functions** (*Ford, Parsons & Kua, Building Evolutionary
   Architecture, 2017*) as objective guardrails for the refactor's direction; **technical
   debt quadrant** (*Fowler*) / principal-vs-interest framing (*Cunningham*) to prioritize.

### L5 — DDD opportunities · strategic & tactical domain lenses

1. **Event Storming (big-picture → process → design)** — *A. Brandolini, Introducing
   EventStorming (2013).*
   Collaborative domain modeling on a timeline of domain events, with commands, actors,
   policies, read models, and **hotspots** (red stickies) and **pivotal events** marking
   tension and context seams. → The workshop engine of the lesson (already drafted in the
   2nd-edition L5); its hotspots feed directly into "DDD opportunities."

2. **Bounded Contexts & Context Mapping** — *E. Evans, Domain-Driven Design (2003);
   V. Vernon, Implementing DDD (2013).*
   A model is valid only within a boundary; integration patterns name the relationships —
   **Anticorruption Layer, Conformist, Open Host Service, Published Language, Shared
   Kernel, Customer/Supplier, Separate Ways**. **Linguistic boundaries reveal context
   boundaries.** → Define contexts *within* the analyzed module and name the integrations.

3. **Subdomain distillation: Core / Supporting / Generic** — *Evans / Vernon.*
   Classify subdomains to direct investment — the **Core Domain** is where modeling
   effort and modernization pay off; generic subdomains are buy/adopt candidates. →
   Prioritizes which DDD opportunities are worth pursuing (strategic, not just tactical).

   *Bonus lenses:* **Aggregate design & invariants** (*V. Vernon, "Effective Aggregate
   Design", 2011*) — aggregates as consistency boundaries protecting invariants,
   transactional vs eventual consistency; **Entities vs Value Objects** (*Evans*) —
   identity vs value equality, immutability; **Bounded Context Canvas** (*DDD Crew /
   N. Tune*) as a capture template for the report.

### Coverage check (≥3 grounded concepts per lesson)

| Lesson | Primary lenses (≥3) | Anchored to |
|--------|--------------------|-------------|
| L2 | Deep/shallow modules · Coupling metrics & Main Sequence · Architectural core/propagation cost (DSM) | Ousterhout · Martin · MacCormack/Baldwin |
| L3 | Hotspots (complexity×churn) · Connascence · Change coupling | Tornhill · Page-Jones · Gall |
| L4 | EAA archetypes · Strangler Fig/Branch-by-Abstraction · Mikado Method | Fowler · Fowler/Hammant · Ellnestam/Brolund |
| L5 | Event Storming · Bounded Contexts/Context Mapping · Subdomain distillation | Brandolini · Evans/Vernon · Evans |

---

## 6. Side-effect ledger (this shaping doc)

- **New claims introduced:** none factual; this is structural planning.
- **Neighboring lesson references changed:** proposes reframing all m4 titles (schema
  unedited — see §3).
- **Prework concepts reused:** chatbot/agent/harness model, generation-then-comprehension,
  AI-as-tutor framing (prework [1.2]/[1.3]) — assumed, not re-taught.
- **Potential duplicates:** L1 "context economics" vs current m4-l5 "context scaling"
  title — intentional absorption, flagged in §3.
- **Unsupported facts:** tool names (madge, dependency-cruiser, code-maat) are illustrative
  — confirm exact tooling during grounding. §5 concept attributions (authors, works, years,
  metric formulas like `I = Ce/(Ca+Ce)` and `D = |A+I−1|`) are confident-but-unverified —
  verify each in `lesson-grounding` before they enter learner-facing prose.
- **Needs human decision:** all five items in §3.
