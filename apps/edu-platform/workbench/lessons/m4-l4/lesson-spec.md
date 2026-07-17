# Lesson Spec: m4-l4 — Refaktoryzacja z Agentem: testy, zmiany, weryfikacja

## Schema Context

- Course: 10xdevs-3
- Module: Large scale & legacy projects (m4)
- Position: 4 / 19
- Depends on: m4-l3 — Analiza feature z AI: co działa, co kuleje, co zmodernizować
- Prepares for: m4-l5 — Modernizacja legacy z DDD: wydzielaj domeny, potem deleguj Agentowi

## Prework Continuity

- Relevant prework lessons: [1.3] Jak uczyć się i rozwijać z AI; [3.1] LLMy i ich wpływ; [3.2] Wzorce i antywzorce promptowania; [3.3] Cykl życia wątku
- Assumed from prework: agent/harness model, prompt-as-contract, context lifecycle across handoffs, "testy utrwalające błędne założenia" awareness
- Deepened here: [3.2]'s "refaktor" work template matures into a grounded, options-first, decision-gated workflow; [1.3]'s "nie akceptuj bez obrony" becomes two named beats — the learner READS the options report before deciding, then defends the choice in the plan interview
- Avoid repeating: nothing structural — no SE author or lens (Fowler, Brooks, Feathers, Nygard, Mikado) exists in prework; L4 owns all introductions

## Lesson Job

Take the ②③ evidence report the learner produced in m4-l3 and teach the move from *problems* to *options* to a *defended decision*: explore every recorded problem through three read-only lanes (current shape, history/intentionality, migration feasibility), rank candidates into report element **④ Refactor opportunities** as a proposal (no decision inside research), read the report, defend the choice in the `/10x-plan` interview, and produce a guard-first, phased, reversible `plan.md` — handed off to `/10x-implement`. Deliver what m4-l5 already assumes: a candidate list and the ability to drive a change with agent, tests, and verification — demonstrated as *designed properties of the plan*, not as live execution.

## Thesis

Hotspoty z raportu ③ to problemy; refaktor zaczyna się dopiero, gdy nadasz im docelowy kształt, ugruntujesz w historii i zaplanujesz odwracalną ścieżkę — AI operacjonalizuje te soczewki na skalę, ale decyzję bronisz ty.

## Learning Outcomes

- Learner maps a module from the ③ report to a current → target archetype and states a defensible refactor thesis ("przerośnięty skrypt transakcyjny, który chce być modelem domenowym za warstwą usług"), not "rewrite it"
- Learner distinguishes accidental from essential complexity before proposing change, using decision history (ADRs where they exist, git/PR archaeology where they don't) — and right-sizes the response: an evidenced intentional design earns a *guard*, not a reshape
- Learner produces element ④ by running `/10x-research` with the reusable exploration contract: enumeration audit, three lanes, ranked options with trade-offs — and NO decision inside the research
- Learner reads the options report before deciding (prework [1.3] made operational), then defends the decision in the `/10x-plan` interview — which opportunity, what's in/out of the slice, trade-offs challenged
- Learner produces the guard-first, phased, independently-revertible plan (characterization-before-touch, verification criteria per phase) and hands it off: `/10x-implement <change> phase 1`
- Learner knows when to escalate from one safe slice to a campaign over the whole ④ backlog (`/10x-test-plan` — Deep Dive)

## Audience Starting Point

The learner holds a finished research.md with ranked debt (TD-1…TD-5) and was explicitly forbidden from refactoring in L3. Their instinct is either "agent, zrefaktoruj ten moduł" (big-bang, ungrounded) or paralysis ("modernize toward what?"). They know the m2 plan→implement loop and the M3 test discipline but have never aimed either at legacy code they didn't write. They don't know any of the named lenses.

## Behavioral Change

Before proposing or accepting any refactor, the learner explores options grounded in history, reads the ranking before deciding, defends the chosen slice in the plan interview, and ships the decision as a guard-first, phased, reversible plan — and rejects agent proposals that skip any of these.

## Owned Concepts

(per schema `owns`, confirmed)

- Enterprise application archetypes as target shapes: Transaction Script → Table Module → Domain Model + Service Layer; accidental vs essential complexity (essence/accidents)
- Incremental, reversible migration: Strangler Fig, Branch by Abstraction (including *inheriting* an existing seam); Mikado-style prerequisite ordering as plan structure (leaves first, every phase revertible)
- Seams + characterization tests as the safety harness for legacy (pin current behavior before touching)
- Refactor opportunities as report element ④: ranked, history-grounded OPTIONS with trade-offs — a proposal for a decision that happens later, in planning

## References Only

- Hot-spot/connascence/blast-radius detection — m4-l3 (consumed as input)
- `/10x-plan` interview mechanics, `plan.md` structure, `## Progress`, phase commits — m2-l2 (L4 shows the decision gate, not the mechanics)
- `/10x-implement` — m2-l2 (handoff only; NOT executed on screen)
- `/10x-test-plan` — m3-l1 (mechanics) + Deep Dive here (campaign extension)
- Test generation, LLM-test anti-patterns, `/10x-tdd` — m3-l2
- ast-grep basics — m4-l3
- DDD — m4-l5 (named once in bridge-out)
- Fitness functions, technical-debt quadrant — Deep Dive only (medium confidence)

## Must Not Cover

- Hot-spot detection technique (churn × complexity, co-change derivation) — m4-l3
- Event Storming, bounded contexts, ubiquitous language, aggregates, element ⑤ — m4-l5
- Execution of the plan's phases on screen — m2-l2 owns the mechanics; the lesson ends on the handoff (dry-run §4: four reasons)
- The wrong-order test-plan run / order anti-pattern demo — research-only material (archived in `context/archive/`); the lesson presents the correct order affirmatively, never the failed run
- AI-refactoring efficacy numbers, benchmarks, failure rates — ungrounded (grounding brief: zero verified claims)
- Re-teaching m2/m3 workflow mechanics
- `/10x-test-plan` interview re-run or its state machine internals — Deep Dive shows the outcome, references m3-l1

## Required Example Or Demo

**Mattermost continuation** (commit 29bab2184, `PostStore.Save` corridor), input = `context/changes/post-flow-analysis/research.md`; all artifacts canonical in `lessons/m4-l4/context/`:

- **Exploration run** (`/10x-research` + reusable contract, dry-run §1): enumeration audit P1–P7 (incl. two problems the ③ report recorded only implicitly), three lanes, intentionality verdicts with commit evidence
- **The ranking overturn — the lesson's strongest proof that history grounding changes decisions**: C2 (positional arrays — the human's expected pick) REJECTED as a refactor on commit evidence (`27d536b212`, 2020 bulk-insert performance decision, zero bugs in six years) → "the right-sized response is a guard, not a refactor"; C4 promoted to #1 on a REALIZED bug: `searchlayer` overrides `Save` but not `SaveMultiple` — batch saves silently unindexed today
- **Chosen slice = C4** (manual-layer completeness guard + SaveMultiple fix) **+ C2 sentinel test** as the planned quick-win phase; C4 also carries the *inherited seam* beat — the decorator chain over `PostStore` IS the abstraction Branch by Abstraction needs
- **C3** (`SaveMultiple` god-method) → the archetype thesis beat (overgrown Transaction Script); ranked #3, narrowed
- **Recurring motif — test-design sharpening**: round-trip test (seemingly obvious; technically wrong — reads are by-name and forgive, writes are positional) → `reflect.Kind` check (research sketch; same-kind adjacent swaps false-negative) → sentinel-value identity (planning; 4/18 columns JSON-serialized) — each pipeline stage caught what the previous missed
- **Three corrections to the L3 report** surfaced by the exploration (two coupled arrays not three; three-way drift surface; localcachelayer IS tested) — Deep Focus findings are inputs, not gospel
- Demo corrections honored: no opentracinglayer; mocks in `storetest/mocks/`; Go blast radius = co-change + ast-grep, not an import graph

## Structural Logic Map

1. **Beat: Stop-line lifted.** The ③ report on the desk; L3 forbade change, L4 begins it.
   Question answered: "Mam raport — co teraz?" • Introduces: element ④ as destination • Depends on: L3 artifact • Sets up: the anti-pattern • Diagram opportunity: (none — prose) • Risk: re-summarizing L3 instead of one-paragraph recap.
2. **Beat: The ungrounded refactor dies.** "Agent, zrefaktoruj ten moduł" → plausible huge diff, no target, no history, no rollback; "modernize" with no shape = paralysis or cargo-cult.
   Question: "Czemu nie po prostu kazać agentowi refaktorować?" • Introduces: options-not-mandates framing; anti-big-bang (verified Strangler "reduced risk" anchor) • Depends on: beat 1 • Sets up: need for lenses • Diagram opportunity: (none) • Risk: AI-efficacy claims — keep directional.
3. **Beat: Target shapes.** Archetype spectrum applied live to C3: where does `SaveMultiple` sit, what shape does it want.
   Question: "Skoro nie 'przepisz', to co jest celem?" • Introduces: Transaction Script / Table Module / Domain Model / Service Layer (no inline citations — names to Deep Dive) • Depends on: beat 2 • Sets up: judging history • Diagram opportunity: LR spectrum with C3 positioned on it • Risk: drifting into domain modeling (L5) — stop at structural thesis.
4. **Beat: Essence vs accident + history.** Is the awkward bit load-bearing? C2's positional arrays interrogated via git archaeology (`git log -L`, blame, commit rationale); ADRs named as what you read when they exist — Mattermost has none, archaeology is the honest substitute.
   Question: "Skąd wiem, że to śmieć, a nie świadoma decyzja?" • Introduces: essence/accidents; ADRs; intentional constraint vs cruft • Depends on: beat 3 • Sets up: right-sizing • Diagram opportunity: (none — prose + command output) • Risk: claiming "non-goals" is a Nygard field (it's our extension).
5. **Beat: Right-sizing — "guard, don't reshape".** The verdict on C2: evidenced intentional design (2020 perf decision, zero bugs) → rejected as a refactor; the right-sized response is a deterministic guard. Generalizes: small-logic modules stay Transaction Scripts; intentional constraints earn guards, not reshapes.
   Question: "Czy wszystko trzeba modernizować?" • Introduces: right-sizing as a named move • Depends on: beats 3–4 • Sets up: reversible paths + the ranking • Diagram opportunity: (none) • Risk: skipping this invites cargo-cult Domain Models.
6. **Beat: Reversible paths.** Strangler Fig + Branch by Abstraction; C4 shows the seam already exists (decorator chain) — sometimes you inherit the abstraction. Mikado-style prerequisite ordering introduced as the planning lens: leaves first, every step revertible.
   Question: "Jak dojść do celu bez wyłączania systemu?" • Introduces: both strategies + "inherit the abstraction" + Mikado ordering (mechanics, not Manning quote) • Depends on: beat 5 • Sets up: the exploration run • Diagram opportunity: BbA swap sequence (LR) • Risk: dating BbA 2004 (it's 2007); presenting it as Hammant's invention.
7. **Beat: The exploration run — element ④ written.** `/10x-research` with the reusable exploration contract (dry-run §1): enumeration audit, three read-only lanes (shape / history / feasibility), ranked options with trade-offs. The contract explicitly forbids a decision: the run ends by pointing at the report, not asking for sign-off. On screen: the ranking overturn — C2 rejected, C4 promoted on the realized SaveMultiple bug.
   Question: "Jak zamienić problemy w opcje, których ktoś nie kupi w ciemno?" • Introduces: the ④ artifact format (ranked options, rejected candidates with reasons); the exploration contract as reusable prompt • Depends on: all lenses (3–6) • Sets up: reading • Diagram opportunity: (none — artifact shown as markdown) • Risk: re-teaching `/10x-research` mechanics (m4-l3 owns controlled mode); letting the run end in a confirm-gate (the contract forbids it).
8. **Beat: Read before deciding.** The human reads research.md — away from the agent, no gate pressing. Prework [1.3] (generation-then-comprehension) named explicitly: the ranking is a proposal; you can still rerank (e.g. weigh C1's compounding value across 58 mirrored types).
   Question: "Czemu nie kliknąć 'tak' od razu?" • Introduces: nothing new — operationalizes [1.3] • Depends on: beat 7 • Sets up: the decision gate • Diagram opportunity: (none) • Risk: framing this as optional hygiene instead of the load-bearing step.
9. **Beat: The decision gate — `/10x-plan`.** The interview converts ranking-acceptance into an explicit question (Q1: which opportunity), challenges trade-offs, and investigates: planning-time evidence upgrades the SaveMultiple gap to a confirmed live bug, triggering an explicit extra question instead of silent rule application. Output: guard-first `plan.md` — 4 phases, "What We're NOT Doing" fence, characterization-before-touch (pin `Save→indexPost` before editing), sentinel-value test design (the sharpening motif lands), opt-in activation so the mechanism lands green.
   Question: "Gdzie naprawdę zapada decyzja i jak jej bronię?" • Introduces: the decision gate; guard-first plan shape • Depends on: beat 8 • Sets up: the handoff • Diagram opportunity: TD phase sequence of the plan (optional) • Risk: re-teaching `/10x-plan` mechanics (m2-l2); presenting all-recommendations-accepted as ideal (the convo flags anchoring risk — honest [1.3] note).
10. **Beat: The handoff.** `/10x-implement refactor-opportunities phase 1` on the clipboard — the moment the new pipeline plugs into the cycle the learner already runs (m2-l2). The plan itself demonstrates "testy, zmiany, weryfikacja" as designed properties: verification criteria per phase, independently revertible commits. Not executed on screen.
    Question: "Co się dzieje dalej i czemu tego nie oglądamy?" • Introduces: nothing — composition • Depends on: beat 9 • Sets up: synthesis • Diagram opportunity: (none) • Risk: scope creep into execution; re-explaining `## Progress` (m2-l2).
11. **Beat: Synthesis + bridge-out.** ④ joins the report; one slot left. The exploration's business-concepts boundary fired on P7 (scheduled-posts validation unification stopped at "business-behavior redesign — a different, later analysis") — the deepest opportunities aren't structural but domain-shaped; one woven sentence toward DDD/L5.
    Question: "Co mi zostało w rękach i co dalej?" • Introduces: (nothing) • Depends on: all • Sets up: m4-l5 • Diagram opportunity: (none) • Risk: standalone "next lesson" promo paragraph (style ban); starting domain talk.

## Failure Mode To Disarm

The **big-bang AI rewrite**: the learner pastes the module into the agent with "zrefaktoruj to porządnie", gets an impressive 40-file diff, and has no way to verify, stage, or roll it back. Its quieter siblings: **cargo-cult modernization** (Domain Model everywhere because a pattern catalog said so — beat 5 disarms it) and **deciding without reading** (accepting the agent's ranking at the gate, under pressure, unread — beats 7–9 structurally remove the gate from research and move the decision to a defended interview).

## Suggested Structure

1. **Intro (no heading)** — stop-line lifted, ④ as destination, thesis.

   ```text
   Previous beat -> this beat -> next beat:
   L3's report recapped in one paragraph; must not re-teach detection; sets up the anti-pattern.
   ```

2. **Antywzorzec: refaktor bez kształtu** — beat 2.

   ```text
   Anti-pattern -> lenses: shows why options need grounding; must not introduce any lens yet.
   ```

3. **Docelowe kształty modułu** — beats 3–5 (archetypes, essence/accident + history, right-sizing/"guard, don't reshape").

   ```text
   Lenses -> paths: judging current shape before choosing a route; must not start migration mechanics yet.
   ```

4. **Odwracalna droga: Strangler, Branch by Abstraction i porządek Mikado** — beat 6.

   ```text
   Paths -> exploration: strategies exist to be ranked, not admired; must not run anything yet.
   ```

5. **Element ④: eksploracja i ranking opcji** — beat 7.

   ```text
   Exploration -> reading: the run ends at a report, not a decision; must not let the agent close the loop.
   ```

6. **Przeczytaj, zanim zdecydujesz** — beat 8.

   ```text
   Reading -> decision gate: the ranking is a proposal; must not frame reading as optional.
   ```

7. **Brama decyzyjna: /10x-plan i plan guard-first** — beat 9.

   ```text
   Decision -> handoff: a defended choice becomes a phased, reversible plan; must not re-teach plan mechanics.
   ```

8. **Handoff: plan wpina się w znany cykl** — beat 10.

   ```text
   Handoff -> synthesis: the pipeline ends where m2's cycle begins; must not execute on screen.
   ```

9. **🧑🏻‍💻 Zadania praktyczne** — learner repeats on their L3 report: run the exploration contract, read the ranking, defend the decision in the plan interview, produce the guard-first plan + the handoff command. Tasks end at the plan, not at executed phases.
10. **Odbierz swoją odznakę** — standard one-liner.
11. **🔎 Deep Dive** — two subsections: (a) **"Od jednego kroku do kampanii"** — `/10x-test-plan` as the extension for when ④ holds more than one opportunity worth pursuing: it adopts the existing plan as rollout Phase 1 (no duplicate change folder) and orchestrates the ④ runners-up (C1 drift gate, error-path coverage, class-wide guards) as Phases 2–4; shown as outcome evidence from the campaign run, references m3-l1, no interview re-run; (b) author attributions + dates (Fowler/Brooks/Feathers/Nygard/Ellnestam-Brolund/Hammant), technical-debt quadrant, fitness functions, Spolsky's rewrite caution.
12. **📚 Materiały dodatkowe** — the 9 schema groundingSources.

## Video Placeholders

- **Segment 1 — exploration run**: `/10x-research` with the contract; enumeration audit; the ranking overturn on screen (replay: `refactor-opportunities/research.md` creation).
- **Segment 2 — the reading beat**: the report scrolled and read; reranking considered aloud (C1's compounding value); the [1.3] move named.
- **Segment 3 — the decision gate**: `/10x-plan` interview — Q1 (which opportunity), the trade-off challenges, the live-bug investigation, the sentinel-test design (replay: `refactor-planning-convo.md`).
- **Segment 4 — the handoff**: `plan.md` walked through as the deliverable (phases, fences, verification criteria); `/10x-implement refactor-opportunities phase 1` on the clipboard.
- **Optional Deep Dive segment**: the campaign extension — `/10x-test-plan` adopting the plan as Phase 1 and orchestrating the ④ backlog (replay: `foundation/test-plan-convo.md`); cut if recording runs long.

Text owns concepts; video owns execution. Replay-grade convo logs exist for segments 1, 3, 4 and the optional segment (see dry-run artifacts ledger).

## Bridge In

"W poprzedniej lekcji zatrzymałeś się przed refaktorem — celowo." One-paragraph recap of ②③, then the stop-line lifts. Prework hook: [3.2] named "refaktor" as a work template; this lesson is that template grown up.

## Bridge Out

Element ④ closes; the report has one slot left. One woven sentence: the candidates here were structural — the deepest opportunities are about the domain the code never named (the boundary that fired on P7), which is m4-l5's move (no Event Storming, no bounded contexts here).

## Open Questions

- **Toolkit ID offset**: workbench m4-l4 = toolkit `m4l3`; any `10x get …` command in prose blocked on the renumbering decision.
- **Toolkit wiring**: module-04 packs are empty (`skills: []`, `summary: "TBD"`); should m4-l4 deliver/spread the spine skills?
- **Feathers wording**: re-confirm verbatim seam/characterization definitions against the sample PDF before prose (grounding caveat) — relevant to beat 9's characterization-before-touch framing.
- **Schema enrichment proposal (recorded per user decision)** — apply to `lessons-schema.json` m4-l4 slot when approved:
  - `referencesOnly`: as listed in References Only above
  - `mustNotCover`: as listed in Must Not Cover above
  - `learningOutcomes`: the six outcomes above
  - `videoPlaceholders`: the five segments above (4 core + 1 optional Deep Dive)

## Side-Effect Ledger

New claims introduced: (none — all demo claims evidenced in `lessons/m4-l4/context/` artifacts; all lenses pre-grounded in lesson-grounding.md)
Claims removed: round-trip test as TD-2's Mikado leaf (refuted — reads by-name forgive, writes positional don't); `/10x-test-plan` corridor run as a core beat; executed slice as a core beat; wrong-order run as lesson material (user decision 2026-06-05 — research-only, archived)
Neighboring lesson references changed: (none — boundaries restate m4-l3/m4-l5 specs; m4-l5's bridge-in assumption satisfied by the plan's designed verification story + known m2/m3 mechanics, per dry-run §4)
Prework references used: [1.3], [3.1], [3.2], [3.3]
Prework concepts repeated intentionally: [1.3] "defend the decision" (operationalized twice: read-before-deciding + the plan-interview defense)
Potential duplicates: ast-grep (L3 owns intro); plan/implement mechanics (m2-l2 — referenced only); test-plan (m3-l1 — referenced + Deep Dive outcome)
Unsupported facts: AI-refactoring efficacy (kept directional); Feathers wording pending re-confirmation
Video/text mismatches: (none — placeholders match the four core beats + optional Deep Dive)
Needs human decision: toolkit ID offset; module-04 wiring; schema enrichment application; optional Deep Dive video segment (keep/cut)
