---
name: lesson-rc-review
description: Review a 10xDevs workbench lesson release candidate against schema, spec, grounding, draft, video scenario, style, neighboring lessons, and external sources, including a mandatory linear coherence-and-flow pass over the draft (unpaid promises, logical holes, flow interruptions, through-line integrity). Use this skill whenever the user asks for RC review, release-candidate review, production readiness, final check, review against spec, check factual grounding, verify external claims, check lesson coherence or narrative flow, or decide whether workbench/lessons/<lessonId>/lesson-draft.md is ready for production handoff. Findings must lead, ordered by severity, with concrete evidence and required fixes.
---

# Lesson RC Review Skill

You review a lesson release candidate. You do not polish prose by default. You identify blockers, drift, unsupported claims, continuity problems, source problems, and production-readiness gaps.

The core rule: **find what would make this lesson unsafe, weak, detached from the course journey, or not ready for human production handoff**.

## Required Context

Always read:

1. `workbench/schemas/lessons-schema.schema.json`
2. `workbench/CLAUDE.md`
3. `workbench/references/prework.md`
4. `workbench/references/style.md`
5. `workbench/references/editorial-contract.md` — this gate enforces the Editorial Economy backstop, Concept-Introduction Adequacy, and Continuity Earns Its Place rules symmetrically (it can flag *too much* as well as *too little*)

Then run or read:

```text
node workbench/scripts/lesson-context.mjs <lessonId-or-title>
```

Use this output to locate the target lesson, inspect the target contract, and inspect dependency/forward-neighbor boundaries. Read the full `workbench/lessons-schema.json` only when the context helper output is insufficient.

Read the target artifacts when present:

```text
workbench/lessons/<lessonId>/lesson-spec.md
workbench/lessons/<lessonId>/lesson-grounding.md
workbench/lessons/<lessonId>/lesson-draft.md
workbench/lessons/<lessonId>/videos/video-*.md
```

If `lesson-draft.md` is missing, stop: there is no RC to review.

If `lesson-spec.md` is missing, mark this as a blocker unless the user explicitly asked for an assumption-based review.

If `lesson-grounding.md` is missing, mark factual/source confidence as limited and review claims conservatively.

Inspect neighboring lessons from `dependsOn` and `preparesFor` using the lesson-context output. If neighboring specs/drafts exist, read them enough to detect drift and duplication.

## External Source Verification

RC review must verify risky external claims, not merely trust the draft.

Check external sources when the lesson contains:

- current product/tool behavior,
- exact CLI/API syntax,
- model names, pricing, dates, release history,
- benchmark or research claims,
- security/compliance statements,
- vendor recommendations,
- claims introduced after grounding.

Use the source hierarchy from `lesson-grounding`:

1. official docs, release notes, engineering blogs,
2. papers or credible reports,
3. repositories, changelogs, issues,
4. known practitioner posts for framing only,
5. community discussions for objections and signals, not hard facts.

If external verification is unavailable or blocked, say so and list the claim under `Open verification`.

Do not quote long passages. Summarize and link sources.

## Coherence And Flow Pass (Mandatory)

Contract checks alone miss narrative failure: a draft can satisfy spec, schema, and grounding section-by-section and still read as a sequence of disconnected blocks. Before scoring dimensions, perform a **dedicated linear read** of `lesson-draft.md` from first line to last, simulating a learner who knows only prework, `dependsOn` lessons, and what this draft has said *so far*. Do not let spec/schema knowledge fill gaps the text leaves open — if the draft assumes something it never established, that is a finding even when the spec covers it.

During this pass, build two working ledgers:

**Promise ledger.** Record every forward commitment the draft makes, then verify each is paid off later in the text:

- explicit deferrals ("wrócimy do tego", "za chwilę", "w dalszej części", "zobaczysz później"),
- questions posed rhetorically that imply an answer is coming,
- problems or pain points set up in the intro or early sections,
- examples, demos, or scenarios announced before they appear,
- section headers and intro framing that promise content,
- the lesson's opening framing of what the learner will be able to do.

A promise is **unpaid** when the payoff never arrives, arrives so far away the connection is lost, or arrives in weakened form (a big setup resolved with a one-line mention). Flag each unpaid promise with its setup location and what the text owes.

**A resolved forward-reference is not automatically a virtue.** Apply the inverse check: flag *manufactured* pre-announcements — a setup created only so the text can later claim the payoff ("...ale do tego jeszcze wrócimy" / "wróci pod koniec lekcji" / "tak jak obiecaliśmy, wracamy do..."), where the topic would have been clearer introduced once, in place, without the deferral. These are over-narration findings (Continuity Earns Its Place, `references/editorial-contract.md`), not PAID wins. Record them under flow interruptions / over-narration, not as successful setup→payoff pairs.

**Dependency ledger (adequacy, not just ordering).** Record each concept, term, tool, or artifact at first *use*. Check two things: (1) ordering — it was introduced, by this draft, prework, or a `dependsOn` lesson, *before* that point; flag forward references the draft does not acknowledge. (2) adequacy — at first substantive use the text states *what it is* and *why it matters now*. A concept is a finding when it appears as a bare name-drop without this gloss, **even when it was introduced earlier or is course vocabulary**. Ordering is necessary but not sufficient (Concept-Introduction Adequacy, `references/editorial-contract.md`). Bare-name-drop examples to catch: an acronym, library, protocol, or algorithm named with no what+why-now (e.g. "OIDC", "Ed25519", "OpenAPI 3.1").

Then evaluate three failure classes:

1. **Logical holes** — a conclusion that does not follow from what preceded it; a missing step between A and C; an example that does not actually demonstrate the claim it is attached to; two sections that quietly contradict each other; an argument that assumes its own conclusion; a recommendation whose justification was never given.
2. **Flow interruptions** — abrupt topic switches without a transition; a running example, scenario, or thread introduced and then dropped; a tangent or aside that breaks momentum at a critical point; a section whose connection to the previous one exists only in the author's head. Apply the **reorder test** in both directions: if two adjacent sections could be swapped without any sentence breaking, the connective tissue between them is missing or decorative — but a missing connection is a defect **only when the reader needs it to follow the argument**; between two independently-clear sections a clean labeled topic switch is acceptable and a manufactured transition is itself a finding (over-narration). Do not reward connective tissue that exists only to perform continuity (Continuity Earns Its Place, `references/editorial-contract.md`).
3. **Arc integrity** — does the lesson have one traceable through-line from opening problem to closing payoff? State the through-line in one sentence in the review. If you cannot, that is itself a Major finding. Check that the ending resolves the tension the opening created, and that the bridge-out follows from what was actually built rather than being bolted on.

Distinguish severity: an unpaid *central* promise, a hole in the core argument chain, or a missing through-line is **Major** (Blocker if the lesson's thesis depends on it). A weak transition or a minor dropped aside is **Minor**. Report ledger results in the `Coherence And Flow` section even when clean — listing the verified setup→payoff pairs proves the pass happened.

## Review Dimensions

Review across these dimensions:

1. **Spec compliance** - Does the draft satisfy thesis, outcomes, behavioral change, owned concepts, required example, failure mode, and bridge in/out?
2. **Schema continuity** - Does the draft fit its place in `lessons-schema.json` and respect previous/next lesson boundaries?
3. **Grounding and facts** - Are factual claims supported by `lesson-grounding.md` or newly verified primary sources?
4. **Scope control** - Does the lesson duplicate prework or steal from neighboring lessons?
5. **Pedagogical value** - Does the lesson change what the learner can do, or is it generic explanation?
6. **Internal coherence and flow** - Results of the mandatory Coherence And Flow Pass: are all promises paid, dependencies established before use, the argument chain unbroken, and the through-line traceable from opening to payoff?
7. **Tool transferability** - Does the lesson teach transferable mental models that work across Cursor, Claude Code, Codex, and GitHub Copilot? Flag content that locks the learner into one tool's UI or workflow without surfacing the universal principle underneath. Tool-specific examples are fine as illustrations, but the concept itself should survive a tool switch.
8. **Editorial quality and economy** - Does the draft follow `workbench/references/style.md` and avoid AI-sounding prose? Score asides on **payload, not presence**: an aside that carries no information and sets up no payoff is a finding, not a virtue — do not reward voice-for-its-own-sake. As backstop to `lesson-editor-pl` (which owns economy), flag over-narration and filler: payload-free asides, verbatim/near-verbatim restatement across sections, repeated beats, and summary-announcing self-narration (Editorial Economy, `references/editorial-contract.md`).
9. **Diagram quality** - Are mermaid diagrams placed next to the claims they visualize? Do they reduce cognitive load for multi-step flows, decision branches, or component relationships? Are there flows missing a diagram that would meaningfully help comprehension? Are any diagrams decorative or redundant with adjacent prose?
10. **Video alignment** - If one or more `videos/video-*.md` scenario files exist in the lesson's `videos/` subdirectory, do they support the lesson without contradiction or unnecessary duplication?
11. **Production handoff readiness** - Are remaining issues small enough for human acceptance?

## Severity

Use these severities:

- **Blocker** - Should not ship. Incorrect, unsupported, scope-breaking, missing required artifact, or contradicts spec/schema.
- **Major** - Should fix before RC acceptance. Weak lesson job, important drift, poor grounding, major style problem, missing failure mode.
- **Minor** - Polish or clarity issue that does not block acceptance.
- **Note** - Observation or optional improvement.

**Missing-bridge severity is judged, not automatic.** A missing Bridge In or Bridge Out (or a missing inter-section transition) is **not** an automatic Blocker. Judge it against one question: does the lesson need this bridge for the reader to follow the argument? Bridges are conditional (Continuity Earns Its Place, `references/editorial-contract.md`). Escalate to Blocker only when the lesson's thesis genuinely depends on the connection; otherwise it is Major or Minor, and a lesson that opens or closes cleanly without a bridge is acceptable, not a defect.

Findings should lead the response. Do not bury issues under a summary.

## Output Location

By default, save the review to:

```text
workbench/lessons/<lessonId>/rc-review.md
```

If the user asks for chat-only review, do not write the file.

Do not edit `lesson-draft.md` during RC review unless the user explicitly asks you to fix findings.

## RC Review Format

Use this structure:

```markdown
# RC Review: [lessonId] — [title]

## Verdict

[Ready / Ready with minor fixes / Not ready]

## Findings

### [Severity]: [Short finding title]

- Evidence: [specific artifact/path/section and what is wrong]
- Why it matters: [impact on learner, course continuity, facts, or production readiness]
- Required fix: [concrete correction]
- Source check: [grounding source, external source, or "open verification"]

## Spec Compliance

- Thesis: [pass / issue]
- Learning outcomes: [pass / issue]
- Behavioral change: [pass / issue]
- Required example/demo: [pass / issue]
- Failure mode: [pass / issue]
- Bridge in/out: [pass / issue]

## Coherence And Flow

- Through-line: [one sentence stating the lesson's arc from opening problem to closing payoff, or "not traceable"]
- Promise ledger:
  - [setup → payoff location, or "UNPAID: setup location + what the text owes"]
- Dependency gaps: [concepts/terms/tools used before introduction, or "none"]
- Adequacy gaps: [concepts used as bare name-drops without what-it-is + why-now at first use — even if introduced earlier or course vocabulary, or "none"]
- Logical holes: [broken argument steps, contradictions, examples that don't prove their claim, or "none"]
- Flow interruptions: [abrupt transitions, dropped threads, sections failing the reorder test, or "none"]
- Opening/ending symmetry: [does the ending resolve the tension the opening created — pass / issue]

## Grounding And External Checks

- Verified claims:
  - [...]
- Unsupported or softened claims:
  - [...]
- Open verification:
  - [...]

## Curriculum Continuity

- Previous lesson fit: [...]
- Next lesson setup: [...]
- Potential duplicates: [...]
- Scope theft risk: [...]

## Editorial Quality And Economy

- Style guide fit: [...]
- AI-sounding patterns: [...]
- Polish/prose issues: [...]
- Economy (filler / restatement / repeated beats): [payload-free asides, verbatim/near-verbatim restatement, summary-announcing, or "none"]
- Over-narration: [manufactured pre-announcements / payload-free asides scored as findings, not PAID, or "none"]

## Diagram Quality

- Diagrams present: [count or "none"]
- Placement: [each diagram placed next to supporting claim / misplaced]
- Missing opportunities: [flows or decisions that would benefit from a diagram]
- Decorative or redundant: [diagrams that restate adjacent prose without reducing cognitive load]
- Syntax/rendering: [valid mermaid syntax / issues]

## Video Alignment

[Pass / issue / no scenario present]

## Side-Effect Ledger

New claims introduced:
Claims removed:
Neighboring lesson references changed:
Prework references used:
Prework concepts repeated intentionally:
Potential duplicates:
Unsupported facts:
Video/text mismatches:
Needs human decision:

## Acceptance Checklist

- [ ] Spec compliance blockers resolved
- [ ] Unpaid promises and logical holes resolved
- [ ] Unsupported factual claims resolved or removed
- [ ] Neighboring lesson drift resolved
- [ ] Editorial polish accepted
- [ ] Video scenario aligned or explicitly deferred
```

Use `(none)` for empty ledger sections.

## Verdict Rules

- Use **Ready** only when there are no Blocker or Major findings.
- Use **Ready with minor fixes** when only Minor findings remain.
- Use **Not ready** when any Blocker or Major finding remains.

If an artifact is missing:

- Missing draft: stop, no review.
- Missing spec: Blocker.
- Missing grounding: Major unless the draft has no factual/current/external claims.
- Missing video scenario: Minor if video is optional, Major if the spec requires video.

## Quality Bar

A good RC review is concrete enough that another agent or human can fix the lesson without re-running discovery.

It should:

- identify the exact problem,
- explain why it matters,
- state the required fix,
- distinguish facts from editorial judgment,
- link external checks where used,
- avoid rewriting the lesson unless asked,
- protect the course journey from drift.
