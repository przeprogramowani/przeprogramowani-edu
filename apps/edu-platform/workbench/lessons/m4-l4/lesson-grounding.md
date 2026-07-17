# Lesson Grounding: m4-l4 — Refaktoryzacja z Agentem: testy, zmiany, weryfikacja

## Scope

- Lesson source: schema slot (`owns` populated, 4 items) + `lessons/m4-l4/notes.md` (conceptual scaffolding distributed from `m4-shape.md` §5). No `lesson-spec.md` / `lesson-draft.md` yet.
- Report element produced: **④ Refactor opportunities** — 2–3 ranked, justified modernization candidates per analyzed module (current archetype → target archetype), grounded in ADRs / history / non-goals, each with blast radius, an incremental + reversible path (Strangler Fig / Branch by Abstraction), and a Mikado-style prerequisite sketch. Right-sized modernization, no over-engineering.
- Neighbor boundaries:
  - **m4-l3 (dependsOn)** owns the **hot-spot list** (churn × complexity, connascence, change coupling — Tornhill, Page-Jones, Gall) and the **risk read** (blast radius, test gaps). That list is L4's *input*. **Do not re-teach hot-spot detection** — L4 consumes it and turns problems into options.
  - **m4-l5 (preparesFor)** owns **DDD** (Event Storming, Bounded Contexts, subdomain distillation — Brandolini, Evans, Vernon). **Critical boundary:** L4 is *structural/tactical* refactoring (archetypes, migration mechanics). The *domain-level* move ("discover the domain hiding in the code") belongs to L5. L4's bridge-out names DDD as "the deepest opportunities"; it must not start event-storming or defining bounded contexts.
- Relevant prework + prior modules: M3 testing work (tests as the refactor seatbelt) is assumed — L4 reuses it as the safety net under Strangler/Mikado, not re-teaches it.
- Research posture: **concept-verification** — this lesson's spine is *named, citable software-engineering concepts*, so the pass targeted **author / exact work / year / claim fidelity** for each lens, plus a thinner sweep for current AI-assisted-refactoring signal.

## What this pass grounded

A deep-research run (2026-06-03) decomposed the question into 6 angles, fetched 27 sources → 113 candidate claims → verified 25 via 3-vote adversarial verification. **All 25 confirmed unanimously (3-0); 0 killed.** Every primary attribution in the lesson's conceptual scaffolding checks out against canonical sources.

The big result for the drafter: **the entire archetype + migration + decision-record backbone is solidly grounded** with verbatim primary-source definitions. Six concept clusters are `high` confidence. Three more (**Feathers seams/characterization tests**, **fitness functions**, **technical-debt quadrant**) had their primary sources *fetched* but their specific claims fell outside the adversarially-verified top-25 — treat as `medium`, sources are sound but the exact wording wasn't independently re-checked. The **AI-assisted-refactoring (2024–2026) dimension is the weakest** — credible sources exist but produced no surviving *verified* claims; treat that guidance as directional, not grounded fact.

Three precision caveats the drafter must honor (see Claims To Avoid Or Soften):
1. Brooks's original wording is **"essence" / "accidents"** — "essential/accidental complexity" is a standard popularized restatement.
2. Hammant's *Branch by Abstraction* post is dated **2007, not 2004** — the 2004 date belongs to *Strangler Fig*. Do not conflate the two dates.
3. The **"non-goals" framing for ADRs** and the full **Mikado "revert / leaves-first" loop** are the lesson's own operationalizations — substance is correct, but they are not literal quotes from the primary sources.

## Claims To Support

- **Domain-logic archetype spectrum** (Transaction Script → Table Module → Domain Model, organized by Service Layer) as target shapes — *Fowler, PoEAA*. ✅ grounded (verbatim catalog definitions).
- **Accidental vs essential complexity** — separate removable cruft from inherent hardness before proposing change — *Brooks*. ✅ grounded (verbatim, 1986).
- **Strangler Fig** as the incremental, lower-risk alternative to a big-bang rewrite — *Fowler*. ✅ grounded (originator, 2004; "reduced risk" framing verbatim).
- **Branch by Abstraction** — large change behind a stable abstraction while still releasing — *Hammant (term) / Fowler (popularized)*. ✅ grounded.
- **Mikado Method** — extract dependencies one at a time, record the Mikado Graph as a roadmap — *Ellnestam & Brolund*. ✅ grounded (authors, 2014, procedure in substance).
- **ADRs** ground refactor proposals in past decisions/context/consequences — *Nygard*. ✅ grounded (author, Nov 2011; "non-goals" is our extension).
- **Seams / characterization tests / sprout-wrap** — test harness around legacy before touching it — *Feathers, WELC*. ⚠️ source fetched, claim not in verified top-25 — `medium`.
- **Fitness functions** as objective refactor guardrails — *Ford/Parsons/Kua*. ⚠️ `medium` (bonus lens; primary source fetched, not re-verified).
- **Technical-debt quadrant** (Fowler) / **principal-vs-interest debt metaphor** (Cunningham) for prioritizing opportunities — ⚠️ `medium` (primary sources fetched, not re-verified).
- **AI grounds refactor proposals in repo history; avoid AI big-bang rewrites / over-engineering** — ❌ not independently verified; rests on credible-but-unverified sources + the (verified) Strangler "reduced risk vs cut-over rewrite" framing extended by analogy.

## Strong Sources

### Patterns of Enterprise Application Architecture — archetype catalog (Fowler)

- URL: https://martinfowler.com/eaaCatalog/ (+ /transactionScript.html, /tableModule.html, /serviceLayer.html, /domainModel.html)
- Type: official-docs (author's canonical catalog, companion to the 2002 book)
- Author/publisher: Martin Fowler
- Checked: 2026-06-03
- Supports (verbatim from catalog):
  - **Transaction Script** = "Organizes business logic by procedures where each procedure handles a single request from the presentation." Trade-off: "its glory is its simplicity… natural for applications with only a small amount of logic."
  - **Table Module** = "A single instance that handles the business logic for all rows in a database table or view."
  - **Domain Model** = "An object model of the domain that incorporates both behavior and data."
  - **Service Layer** = "Defines an application's boundary with a layer of services that establishes a set of available operations and coordinates the application's response in each operation."
- Use in lesson: the **target-shape vocabulary** for the report — "this module is an overgrown Transaction Script that wants to become a Domain Model" is a grounded, defensible refactor thesis, not "rewrite it." The spectrum + trade-offs justify *right-sized* targets (small-logic modules legitimately stay Transaction Scripts — anti-over-engineering anchor).
- Confidence: high

### No Silver Bullet — Essence and Accident in Software Engineering (Brooks)

- URL: https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf
- Type: paper (primary PDF; reproduced in The Mythical Man-Month Anniversary ed., Addison-Wesley 1995; orig. IFIP Tenth World Computing Conference 1986, pp. 1069–76)
- Author/publisher: Frederick P. Brooks, Jr.
- Checked: 2026-06-03
- Supports (verbatim): "Following Aristotle, I divide them into essence — the difficulties inherent in the nature of the software — and accidents — those difficulties that today attend its production but that are not inherent." Thesis: "There is no single development… which by itself promises even one order-of-magnitude improvement… in productivity, in reliability, in simplicity."
- Use in lesson: the lens that separates **removable cruft (accidental)** from **inherent hardness (essential)** before proposing a refactor — stops the learner (and the agent) from "refactoring away" complexity that is actually load-bearing domain difficulty.
- Confidence: high
- Notes: cite as **"essence/accidents (Brooks, 1986)"**; if using "essential/accidental complexity," flag it as the standard popularized restatement, not Brooks's literal words.

### Strangler Fig Application (Fowler)

- URL: https://martinfowler.com/bliki/StranglerFigApplication.html (history: /bliki/OriginalStranglerFigApplication.html)
- Type: technical-post (originator, primary)
- Author/publisher: Martin Fowler
- Checked: 2026-06-03
- Supports (verbatim): "Like the fig, it begins with small additions… built on top of, yet separate to the legacy code base. As we do this we move bits of behavior from the legacy system into the new code base." Original (2004): "gradually create a new system around the edges of the old… until the old system is strangled," and **"The most important reason to consider a strangler fig application over a cut-over rewrite is reduced risk."** Published **29 June 2004** as "Strangler Application"; renamed "Strangler Fig Application" April 2019.
- Use in lesson: the headline **incremental + reversible** strategy — every refactor opportunity ships as a sequence of small steps behind a facade, never a big-bang. The "reduced risk vs cut-over rewrite" line is the lesson's strongest *verified* anti-big-bang anchor.
- Confidence: high

### Branch by Abstraction (Fowler / Hammant)

- URL: https://martinfowler.com/bliki/BranchByAbstraction.html (origin: https://paulhammant.com/blog/branch_by_abstraction.html)
- Type: technical-post (primary, both)
- Author/publisher: Martin Fowler (popularized) / Paul Hammant (named the term, credits Stacy Curl)
- Checked: 2026-06-03
- Supports (Fowler, 2014-01-07, verbatim): "a technique for making a large-scale change to a software system in [a] gradual way that allows you to release the system regularly while the change is still in-progress." Procedure: create an abstraction over the interaction → migrate clients to it → build the new implementation behind the same interface → swap over gradually → remove the old implementation. Fowler: "Paul Hammant introduced the term… (he credits Stacy Curl with originally coming up with it)." Hammant: "It is not my invention, and has been best practice for many years."
- Use in lesson: the **release-while-refactoring** companion to Strangler Fig — keep trunk shippable during the migration. Good for the "reversible step" framing.
- Confidence: high
- Notes: **Hammant's post is dated 2007**, not 2004. Attribute the *term* to Hammant; do not claim he invented the practice.

### The Mikado Method (Ellnestam & Brolund)

- URL: https://www.manning.com/books/the-mikado-method
- Type: official publisher page (primary; corroborated by ACM DL, ISBN 9781617291210)
- Author/publisher: Ola Ellnestam & Daniel Brolund — Manning, March 2014
- Checked: 2026-06-03
- Supports (verbatim): "You carefully extract each intertwined dependency until you expose the central issue [the *Mikado*], without collapsing the project." "A natural by-product… is the Mikado Graph, a roadmap that reflects deep understanding of how your system works." Named after the pick-up-sticks game.
- Use in lesson: the **method that turns a daunting refactor into an ordered, verifiable plan** — attempt the change, see what breaks, record prerequisites as a graph, resolve leaves first. The Mikado Graph is the concrete prerequisite-sketch artifact the report element asks for.
- Confidence: high
- Notes: authors/year/graph are quoted; the full **"revert / resolve-leaves-first" loop** is confirmed in substance from the method's description but not as a single verbatim line — present the loop as the method's mechanics, not a Manning quote.

### Working Effectively with Legacy Code (Feathers)

- URL: https://ptgmedia.pearsoncmg.com/images/9780131177055/samplepages/0131177052.pdf (overview: https://understandlegacycode.com/blog/key-points-of-working-effectively-with-legacy-code/)
- Type: primary (publisher sample chapter) + secondary (practitioner summary)
- Author/publisher: Michael Feathers — Prentice Hall, 2004
- Checked: 2026-06-03
- Supports: **seam** = a place where you can alter behavior without editing in that place (the leverage point for getting legacy under test); **characterization test** = a test that pins down *current* behavior (not correct behavior) so a refactor can't change it silently; **sprout / wrap method/class** = add new behavior in a fresh, tested unit rather than editing untested legacy in place.
- Use in lesson: the **safety net under every refactor** — establish characterization tests at the seams *before* touching legacy. Pairs with Mikado (the plan) and Strangler (the path). Connects back to M3 testing work.
- Confidence: medium — primary source fetched, but the seam/characterization/sprout-wrap definitions were **not** in the adversarially-verified top-25. Re-confirm wording against the sample PDF before learner-facing prose.

### Documenting Architecture Decisions / ADRs (Nygard)

- URL: https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions (corroboration: https://martinfowler.com/bliki/ArchitectureDecisionRecord.html, https://adr.github.io/)
- Type: technical-post (originator, primary)
- Author/publisher: Michael Nygard — 15 November 2011
- Checked: 2026-06-03
- Supports (verbatim): "We will keep a collection of records for architecturally significant decisions: those that affect the structure, non-functional characteristics, dependencies, interfaces, or construction techniques." Format = short text file with **Title, Context, Decision, Status, Consequences**. Fowler corroborates: "Michael Nygard coined the term… in 2011."
- Use in lesson: the **history-grounding** mechanic — read ADRs (and commit/PR rationale, post-mortems) to distinguish *intentional constraint* from *accidental complexity* before proposing change. This is what makes a refactor opportunity "grounded" rather than cargo-cult.
- Confidence: high
- Notes: the lesson's **"non-goals / no-goals"** emphasis is *our* extension of the Context/Consequences sections — Nygard's format captures decisions + consequences, not a literal "no-goals" field. State it as our reading of ADR context, not a Nygard term.

### Technical Debt Quadrant / Technical Debt metaphor (Fowler / Cunningham)

- URL: https://martinfowler.com/bliki/TechnicalDebtQuadrant.html (+ /bliki/TechnicalDebt.html)
- Type: technical-post (primary)
- Author/publisher: Martin Fowler (quadrant); debt metaphor orig. Ward Cunningham (1992 OOPSLA, "The WyCash Portfolio Management System")
- Checked: 2026-06-03
- Supports: Fowler's quadrant classifies debt on **deliberate/inadvertent × reckless/prudent** axes; the **principal vs interest** framing (Cunningham) treats shortcuts as debt whose interest is paid in slowed future change.
- Use in lesson: a **prioritization lens for ranking** the 2–3 refactor candidates — pay down high-interest, prudent-deliberate debt first. Optional bonus lens; supports report element ④'s "ranked, justified" requirement.
- Confidence: medium — primary sources fetched; the specific framing was not in the verified top-25. Sound attribution, re-confirm wording if quoted.

### Building Evolutionary Architectures — fitness functions (Ford / Parsons / Kua)

- URL: https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/ch02.html
- Type: official-docs (publisher, primary excerpt)
- Author/publisher: Neal Ford, Rebecca Parsons & Patrick Kua — O'Reilly, 2017
- Checked: 2026-06-03
- Supports: an **architectural fitness function** is an objective integrity measure for some architectural characteristic(s) — a guardrail that says whether a change moves the architecture toward or away from its goals.
- Use in lesson: optional bonus lens — frame the refactor's *direction* as an objective target (e.g. a coupling/complexity threshold), not a vibe. Lower priority for L4; include only if the draft needs the "objective guardrail" beat.
- Confidence: medium — primary excerpt fetched, claim not in verified top-25.

### AI-assisted refactoring — practitioner signal (weakest tier)

- URLs:
  - https://martinfowler.com/articles/exploring-gen-ai.html — Fowler/Thoughtworks ongoing series on GenAI in software delivery (credible engineering writing).
  - https://pragprog.com/titles/atcrime2/your-code-as-a-crime-scene-second-edition/ — Tornhill, *Your Code as a Crime Scene* 2nd ed. (2024) — hotspot-driven prioritization now framed with AI; ties L3's hot-spot list to L4's "where to refactor first."
  - https://arxiv.org/abs/2511.04824 — recent (2025) arXiv work on LLM-assisted refactoring/modernization.
  - https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/ — Spolsky's classic "never rewrite from scratch" — the canonical anti-big-bang caution (pre-AI, applies by analogy).
  - https://www.docker.com/blog/ai-coding-agent-horror-stories-security-risks/ — vendor blog cataloguing AI-coding-agent failure modes.
- Type: technical-post / paper / blog (mixed quality)
- Checked: 2026-06-03
- Use in lesson: support the framing **"AI operationalizes the lens at scale; the human owns the decision"** and the **anti-big-bang / anti-over-engineering** guardrail. The agent proposes ranked candidates grounded in churn + ADRs; the learner ranks, defends, and chooses the incremental path.
- Confidence: low — **no surviving adversarially-verified claim** in this dimension. Treat as directional. Do **not** state specific AI-refactoring efficacy numbers, benchmarks, or failure rates as fact without a dedicated grounding round.

## Practitioner Signals

The 2024–2026 AI-assisted-refactoring sweep surfaced the credible sources above but **no verified factual claims**. Usable as *framing/voice* (the ache of legacy modernization, the temptation of the AI rewrite, the "modernize with no target shape = paralysis" pain), **not as evidence**. If the lesson wants harder AI-assist claims (what measurably works, documented failure modes), run a dedicated grounding round.

## Examples Worth Using

- **Archetype thesis, made concrete:** "this 600-line `generateFlashcards` handler is an overgrown **Transaction Script**; its branching domain rules want to become a **Domain Model** behind a **Service Layer**" — a defensible target shape, not "rewrite it."
- **The grounded vs ungrounded refactor:** before proposing the move, the agent reads the ADR / PR that explains *why* the awkward retry loop exists — and discovers it's an intentional constraint (a flaky upstream), not accidental cruft (Brooks essence vs accident). The opportunity is reframed, not blindly "fixed."
- **Incremental path + prerequisite sketch:** ship the Domain Model behind **Branch by Abstraction** so trunk stays releasable; write **characterization tests** at the seam first (Feathers); lay out the **Mikado Graph** of prerequisites and resolve leaves first — the report's safety + sequencing section.
- **Right-sizing (anti-over-engineering):** a genuinely small-logic module legitimately *stays* a Transaction Script — the trade-off table is the guard against cargo-cult Domain Models / "Kafka-for-the-sake-of-it."

## Claims To Avoid Or Soften

- **"essential/accidental complexity" as Brooks's words:** his terms are **"essence" / "accidents."** Use the modern phrasing only as an explicit restatement.
- **Branch by Abstraction = 2004:** false — that's Strangler Fig. Hammant's post is **2007**. Keep the two dates separate.
- **ADR "no-goals" field:** Nygard's format is Title/Context/Decision/Status/Consequences. "Non-goals" is *our* reading of the context, not a Nygard term.
- **Mikado "revert / leaves-first" as a Manning quote:** it's the method's mechanics (confirmed in substance), not a verbatim line — don't quote it as such.
- **Hot-spot detection technique (churn × complexity, change coupling):** **m4-l3's owned territory** (Tornhill, Page-Jones, Gall). L4 *consumes* the hot-spot list as input — do not re-teach how to produce it. Avoids scope theft from L3.
- **DDD / domain modeling (bounded contexts, event storming, ubiquitous language):** **m4-l5's owned territory** (Brandolini, Evans, Vernon). L4 stays *structural/tactical*; it may *name* DDD as the bridge-out ("the deepest opportunities are about the domain"), nothing more.
- **Any AI-refactoring efficacy claim (benchmarks, % success, failure rates):** **not grounded.** Keep AI framing to method ("AI operationalizes the lens; human decides") and the verified Strangler "reduced risk vs rewrite" anchor.
- **Fitness functions / technical-debt quadrant as load-bearing:** `medium` confidence (bonus lenses). Fine as optional framing; re-confirm wording before quoting.

## Open Verification Questions

- **Feathers (own re-confirmation):** pin the verbatim definitions of *seam*, *characterization test*, *sprout method/class*, *wrap method/class* against the sample PDF before they enter prose (claim fetched but not adversarially verified this pass).
- **Fitness functions + technical-debt quadrant:** re-verify exact framing if the draft promotes them from bonus to primary lens.
- **AI-assisted refactoring (whole dimension):** dedicated grounding round needed for any hard claim about what AI refactoring measurably does/doesn't do, documented failure modes, and how teams ground agent proposals in git churn + ADRs. Currently directional only.
- **Right-sizing evidence:** is there a citable source for "over-engineering a small project is itself a refactor smell," or does L4 carry that as the author's guardrail (consistent with the PoEAA trade-off table)?

## Schema Source Update

Updated **only** the `m4-l4` lesson object in `workbench/lessons-schema.json`:

- Added a `groundingSources` array (field did not previously exist on this slot) with **9 sources** mapped to the four `owns` items, all `checkedAt: 2026-06-03`:
  - `high`: PoEAA catalog (Fowler), No Silver Bullet (Brooks), Strangler Fig (Fowler), Branch by Abstraction (Fowler/Hammant), The Mikado Method (Ellnestam & Brolund), Documenting Architecture Decisions (Nygard).
  - `medium`: WELC (Feathers), Technical Debt Quadrant (Fowler/Cunningham), Exploring GenAI (Fowler) for the AI-assist spine.
  - Deliberately **omitted** the low-confidence AI practitioner-signal links (arXiv/Joel/Docker/Tornhill-2e) and the fitness-functions excerpt from the schema array — they live in this brief as framing/bonus until promoted.
- Added `lesson-grounding` to `requiredArtifacts`.
- `sideEffectLedger.unsupportedFacts`: recorded the un-re-verified Feathers/fitness-function/tech-debt-quadrant wording and the wholly-ungrounded AI-refactoring-efficacy dimension.
- `sideEffectLedger.needsHumanDecision`: recorded the Brooks-wording, Branch-by-Abstraction-2007-date, ADR-"non-goals", and Mikado-loop precision caveats for the drafter.
