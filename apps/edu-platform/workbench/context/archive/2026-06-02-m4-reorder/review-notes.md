# M4 Reorder — Author Review Notes

> Written 2026-06-02 alongside the `m4-reorder` change. Advisory only — no schema or lesson-content edits were made here. Scope per decision: focus on the new **m4-l1 (foundation) → m4-l2 (project-map)** flow; brief spot-check of the other three cascaded lessons.

## What was executed

The context-scaling lesson moved from slot `m4-l5` to `m4-l1` and the four legacy lessons cascaded down one slot. New Module-4 order and ladder:

| Slot | Content | dependsOn → preparesFor |
|---|---|---|
| m4-l1 | Skalowanie kontekstu dla AI (foundation) | m3-l5 → m4-l2 |
| m4-l2 | Nowy-stary projekt? Agent zbuduje mapę… | m4-l1 → m4-l3 |
| m4-l3 | Analiza feature z AI… | m4-l2 → m4-l4 |
| m4-l4 | Refaktoryzacja z Agentem… | m4-l3 → m4-l5 |
| m4-l5 | Modernizacja legacy z DDD… | m4-l4 → m5-l1 |

Boundaries unchanged (slot-stable): `m3-l5.preparesFor=[m4-l1]`, `m5-l1.dependsOn=[m4-l5]`. The context lesson keeps all content arrays verbatim; only its structural fields + the one research-folder URL changed.

**Caveat for this review:** m4-l2…m4-l5 are still **content stubs** in the schema (empty `owns`/`learningOutcomes`/`mustNotCover` etc.). The assessment below is therefore forward-looking guidance for when those lessons are drafted, not an audit of existing prose. Only the new m4-l1 has full content.

## Focus: m4-l1 (foundation) → m4-l2 (project-map) flow

**Verdict: the handoff is coherent and actually synergistic — but the m4-l2 bridge-in must be drafted to assume the foundation, not re-introduce it.**

What the learner leaves m4-l1 with (from its `owns` / `requiredFragments`):
- a scaffolded **scalable context architecture**: lean root `AGENTS.md`/`CLAUDE.md` + `context/` as system-of-record (foundation + changes), three-way split (conventions → root, references/PRD/plans → `context/`, procedures → skills);
- the **maturity ladder** + escalation signals;
- the **certification throughline**: architektura kontekstu → raport architektoniczny → odznaka Architekta, with the "single application ⇒ decide architecture at end of lesson / after the module" rule.

Why m4-l2 (the agent builds a map + explains architecture of a new/legacy codebase) follows cleanly:
1. **No scope collision.** m4-l1's `mustNotCover` already explicitly defers "mapowanie kodu, analiza feature, refaktoryzacja, ekstrakcja domen DDD (m4-l2…m4-l5 po renumber)" — so the foundation does not pre-teach map-building. The boundary is already encoded in the schema. ✅
2. **The artifacts compose.** The architecture map m4-l2 has the agent produce is a natural **`context/` foundation document** — exactly the system-of-record m4-l1 just taught the learner to set up. Recommended bridge: frame m4-l2's map as "the first real `context/foundation/` artifact you populate," not a standalone deliverable. This makes the reorder pay off rather than read as two unrelated lessons.
3. **The report throughline carries forward.** m4-l2 should be drafted to *continue* the architectural-report throughline established in m4-l1 (the map is an input to the Architect-badge report), not re-introduce the certification framing. m4-l1 owns that framing now.

### Action items for the m4-l2 draft (when written)
- Write the bridge-in to assume a scaffolded `context/` + lean root already exist (learner did it in m4-l1). Don't restate the finite-attention / monolith-vs-lean argument — reference it.
- Position the generated architecture map as feeding `context/foundation/` and the architectural report.
- Keep m4-l2 owning "agent-driven codebase mapping / architecture explanation"; reference (don't re-teach) context architecture.

## Spot-check: m4-l3 / m4-l4 / m4-l5

All three **fit their new slots, no blocker.** Notes for drafting time:

- **m4-l3 (feature-analysis)** — sits after project-map as before (it always followed the map); the only change is one slot down. No re-framing needed beyond depending on m4-l2.
- **m4-l4 (refactoring)** — unchanged relative position to its neighbors; fine.
- **m4-l5 (DDD-legacy)** — now the **module closer** (was m4-l4), `preparesFor: [m5-l1]`. Sensible capstone: the most advanced legacy-modernization topic right before Module 5 (team agents/SDK). Minor opportunity: as the final M4 lesson, its outro is the natural place to land the "make/justify your architecture decision now or at module end" closure that m4-l1 set up (the report's completion point). Optional, not required. Its current `lesson-2ed-draft.md` is an early draft and does not reference slot position, so nothing reads wrong today.

## Open items deliberately NOT resolved here

- **Context lesson's `needsHumanDecision`** (unchanged): certification-form wording + architectural-report template confirmation against the official Builder and Architect & Champion forms. Still pending Marcin's confirmation against the official forms.
- **m4-l2…m4-l5 are unwritten stubs.** This reorder only renumbered/relocated them; their content is still to be drafted (the paired `m4-l1-bootstrap` change drafts the new m4-l1 from research; the legacy lessons remain to be done).
