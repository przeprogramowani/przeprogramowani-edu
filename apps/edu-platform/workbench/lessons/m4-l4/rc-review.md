# RC Review: m4-l4 — Refaktoryzacja z Agentem: testy, zmiany, weryfikacja

Reviewed: 2026-06-05 · Inputs: schema slot (via lesson-context), lesson-spec.md, lesson-grounding.md, lesson-draft.md (post 3× lesson-editor-pl), canonical demo artifacts in `lessons/m4-l4/context/`, prework.md, style.md, lesson-structure.md, neighbor contracts (m4-l3, m4-l5).

## Verdict

**Not ready** — one Major finding: the video scenario (`videos/video-*.md`) does not exist, and both the schema `requiredArtifacts` and the spec (5 defined video placeholders with replay-grade convo logs) require it.

The draft prose itself is **RC-grade with minor fixes**: spec-compliant beat for beat, every checked demo claim traces to the canonical `context/` artifacts, all four grounding precision caveats honored, scope boundaries respected. If the user explicitly defers the video scenario to a later stage, the draft alone qualifies as **Ready with minor fixes**.

## Findings

### Major: Video scenario missing while schema and spec require it

- Evidence: `lessons/m4-l4/videos/` does not exist. Schema `requiredArtifacts` lists `video-scenario`; the spec defines 5 segments (4 core + 1 optional Deep Dive) and states replay-grade convo logs exist for segments 1, 3, 4 and the optional segment. The draft carries 5 matching `[VIDEO PLACEHOLDER]` markers.
- Why it matters: RC review is supposed to compare draft against video scenario for contradiction/duplication; that dimension cannot pass, and production handoff is incomplete without the recording plan.
- Required fix: run `/video-scenario` for m4-l4 (inputs are all in place), or explicitly defer the video artifact and accept this review as draft-only.
- Source check: schema slot + lesson-spec.md §Video Placeholders.

### Minor: "cztery z osiemnastu kolumn serializują się do JSON-a" misstates the mechanism

- Evidence: draft line ~263 (test-sharpening motif, step 2). The canonical plan (`context/changes/refactor-opportunities/plan.md:15`) says 4 of 18 entries don't kind-match naively: **three** are JSON-serialized (`Props`, `Filenames`, `FileIds`) and **one** is a pointer (`RemoteId` is `*string`). The draft compresses this to "four serialize to JSON".
- Why it matters: the sharpening motif is the lesson's precision showcase; the one place it's imprecise is the step explaining why the `reflect.Kind` check fails. A learner comparing against the demo artifacts (or the video) will find the mismatch.
- Required fix: e.g. "cztery z osiemnastu kolumn nie przechodzą naiwnego porównania typów: trzy serializują się do JSON-a, a jedna jest wskaźnikiem" (or equivalent).
- Source check: `plan.md:15` and `plan.md:51` (canonical demo artifacts).

### Minor: PostStore method count — 57 vs 58 disagree across canonical artifacts

- Evidence: draft says "interfejs `PostStore` (57 metod)", consistent with `plan.md` ("57 − 8 existing overrides"); but `research.md:214` says "override 8 of 58 methods". The two canonical artifacts disagree by one.
- Why it matters: the number appears in learner-facing prose and will appear on screen in segments 1/3. The ~99 triage figure in Phase 4 derives from it.
- Required fix: reconcile against the pinned Mattermost commit (`29bab2184`) and align draft + whichever artifact is wrong. The draft needs no change if 57 holds.
- Source check: open verification (count not independently re-checked in this review).

### Minor: Deep Dive names two works the reader cannot click

- Evidence: Spolsky's "Things You Should Never Do" (2000) gets an explicit "warto go dziś odświeżyć" with no link anywhere in the lesson; *Building Evolutionary Architectures* (fitness functions) is also named without a link. Both URLs exist in lesson-grounding.md.
- Why it matters: style guide requires direct links when pointing the reader at a resource; "go read it" without a link forces a search. (Their absence from schema `groundingSources` was a deliberate grounding decision — an inline link in Deep Dive does not require promoting them to the schema array.)
- Required fix: add inline links in the two Deep Dive paragraphs (https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/ and the O'Reilly BEA page), or add Materiały dodatkowe entries if the user wants them promoted.
- Source check: lesson-grounding.md §AI-assisted refactoring / §fitness functions.

### Minor: Mermaid node labels carry English shorthand the prose no longer uses

- Evidence: diagram 3 nodes say "quick win C2", "opt-in", "triage"; diagram 1 axis labels are fine. After the editor passes, the surrounding prose reads "tani, szybki zysk", "domyślnie wyłączona", "przegląd". Diagrams are pre-rendered cached assets (`assets/diagrams/lessons-m4-l4-lesson-draft-*.png`).
- Why it matters: label/prose parity; the learner meets two registers for the same concept in the same section.
- Required fix: optional — re-render via the mermaid skill with naturalized labels, or accept English shorthand in diagrams as compact notation (consistent with `blast radius` etc. kept in prose). Needs a human call because re-rendering invalidates cached CDN assets.
- Source check: editorial judgment, not fact.

### Note: Heading style tension with the style guide — spec wins

- "Antywzorzec: refaktor bez kształtu", "Element ④: eksploracja i ranking opcji" (colon-separated) and "Guard, nie przebudowa" ("X, not Y" contrast) technically collide with the style guide's heading rule, but the first two are verbatim the spec's Suggested Structure and the third is the lesson's named move. No change required.

### Note: Schema slot enrichment still pending

- The m4-l4 schema slot has empty `learningOutcomes`, `requiredFragments`, `videoPlaceholders`, `referencesOnly`, `mustNotCover`; the spec records the approved enrichment proposal under Open Questions. Standing human decision, not a draft defect.

## Spec Compliance

- Thesis: **pass** — draft line 13 restates the spec thesis verbatim in substance (shape + history + reversible path; AI operationalizes, human defends).
- Learning outcomes: **pass** — all six map to beats: archetype thesis (C3/`SaveMultiple`), history/right-sizing (C2 guard verdict), element ④ via the exploration contract, read-before-deciding ([1.3] operationalized), guard-first plan + handoff, campaign escalation (Deep Dive).
- Behavioral change: **pass** — the anti-pattern dies in section 2; the workflow (explore → read → defend → plan) is rehearsed in Zadania kroki 1–5.
- Required example/demo: **pass** — Mattermost continuation complete: P1–P7 enumeration audit, ranking overturn (C2 rejected / C4 promoted on the realized searchlayer bug), inherited seam (decorator chain), three corrections to the ③ report, three-round test-sharpening motif. All spot-checked claims verified in `context/changes/refactor-opportunities/` and `context/foundation/test-plan.md` (details below).
- Failure mode: **pass** — big-bang rewrite (beat 2), cargo-cult modernization (right-sizing), deciding-without-reading (beats 7–9). The wrong-order test-plan run correctly absent (archived, research-only per spec).
- Bridge in/out: **pass** — bridge-in recaps ②③ in one paragraph with the [3.2] hook; bridge-out is one woven paragraph (P7 boundary → domain-shaped opportunities → M4L5), no promo paragraph, no Event Storming/bounded contexts.

## Grounding And External Checks

- Verified claims:
  - All four grounding precision caveats honored in the draft: Brooks essence/accidents flagged as popularized restatement (Deep Dive); Strangler 2004 vs BbA 2007 kept distinct with an explicit date warning; ADR "non-goals" framed as "nasza praktyka interpretacji"; Mikado loop presented as "mechanika metody w naszym streszczeniu, nie cytat".
  - Archetype definitions (Transaction Script / Table Module / Domain Model / Service Layer) paraphrase the Fowler catalog accurately (high-confidence grounding).
  - Demo facts verified against canonical artifacts: `app/post.go` 3957 ln / 60 exported methods; `SaveMultiple` 180 ln (`:159-339`) with 4 already-extracted helpers; commit `27d536b212` (2020-03-11, bulk-insert performance); zero column-order bug commits in six years; decorator chain LocalCache → Timer → Search → Retry → Sql; searchlayer overrides `Save` not `SaveMultiple` (realized bug); 2-not-3 coupled arrays; three-way Go ↔ TS ↔ OpenAPI drift; ~58 mirrored types / 145 `Post` importers; 3 bulk-import call sites (`import_functions.go:1470,1915,2434`); `Save→SaveMultiple` delegation below searchlayer; 7 planner questions incl. the extra Q7 on new evidence; ~99-method triage; mutation check + dummy-method tripwire; test-plan adopting the plan as Phase 1, Phases 2–4 mapping, quality-gates table, §7 "What We Deliberately Don't Test", broadcast-leak risk via abuse lens.
  - No AI-refactoring efficacy numbers anywhere (the ungrounded dimension stays directional, per grounding).
- Unsupported or softened claims:
  - "cztery z osiemnastu kolumn serializują się do JSON-a" — imprecise vs plan.md (see Minor finding).
- Open verification:
  - PostStore method count 57 vs 58 (artifact-internal discrepancy; reconcile against commit `29bab2184`).
  - Feathers seam/characterization wording — standing medium-confidence caveat; the draft paraphrases at a descriptive level consistent with the fetched source, no verbatim quote, so acceptable; re-confirm against the sample PDF only if the wording is ever tightened into a quote.
  - Demo facts verified against the pinned canonical artifacts, not against the live Mattermost repo (correct posture — the lesson is pinned to `29bab2184`).

## Curriculum Continuity

- Previous lesson fit: **pass** — ③ consumed as input ("ustalenia z Deep Focus to wejście, nie ewangelia"); no hotspot/connascence/co-change re-teaching; the L3 stop-line ("zakaz refaktoru") is the opening hinge.
- Next lesson setup: **pass** — m4-l5's bridge-in assumption (candidate list + plan-driving ability) delivered as designed plan properties; DDD territory untouched; the P7 business-behavior boundary is the woven setup.
- Potential duplicates: (none) — `/10x-plan`, `/10x-implement`, `/10x-test-plan` mechanics referenced to M2L2/M3L1, not re-taught; prework [1.3]/[3.2] deepened, not repeated.
- Scope theft risk: (none found) — the exploration contract even encodes the L5 boundary ("przeprojektowanie pojęć biznesowych… inna, późniejsza analiza").

## Editorial Quality

- Style guide fit: **pass** — intro is recognition-level with a 3-word punchy close ("Zaczynamy od decyzji."); paragraphs ≤3 sentences; casual asides present ("tylko kto ma na to czas w cudzym repo tej skali?", "zgadywanie z lepszym UX"); ellipsis-pause used sparingly; em-dashes confined to definition lists, placeholders and Materiały dodatkowe; "Materiały dodatkowe" label correct; canonical section order and emoji prefixes correct; badge one-liner verbatim; Deep Dive intro convention verbatim.
- AI-sounding patterns: none material after the three editor passes; cross-references use the `tytuł (M#L#)` format throughout.
- Polish/prose issues: only the two Minor items above (JSON-columns phrasing; diagram-label register).

## Diagram Quality

- Diagrams present: 3 (archetype spectrum, BbA swap sequence, guard-first phase plan).
- Placement: each sits at the claim it visualizes — spectrum at the C3 thesis, BbA at the strategy paragraph, phase plan at the plan walkthrough. Matches the spec's three identified diagram opportunities exactly.
- Missing opportunities: (none) — remaining flows are prose-shaped per the spec's beat map.
- Decorative or redundant: (none).
- Syntax/rendering: valid mermaid; rendered PNG/SVG assets exist with CDN comments. Only the label-register Minor above.

## Video Alignment

**No scenario present** — see the Major finding. The five in-draft placeholders match the spec's five segments 1:1 (exploration run, reading beat, decision gate, handoff, optional campaign), so the scenario inputs are consistent and ready.

## Side-Effect Ledger

New claims introduced: (none — review only)
Claims removed: (none)
Neighboring lesson references changed: (none)
Prework references used: [1.3], [3.2] (verified against prework.md — both exist and carry the claimed content)
Prework concepts repeated intentionally: [1.3] generation-then-comprehension, operationalized twice (read-before-deciding; plan-interview defense) — per spec
Potential duplicates: (none)
Unsupported facts: JSON-columns phrasing (Minor); 57-vs-58 method count (open verification)
Video/text mismatches: not assessable — scenario missing (Major)
Needs human decision: produce vs defer the video scenario; diagram re-render for label parity; schema slot enrichment (standing); toolkit ID offset (standing, currently moot — no `10x get` commands in the draft)

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [ ] Unsupported factual claims resolved or removed (2 minor: JSON-columns phrasing, 57/58 reconciliation)
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted (3× lesson-editor-pl applied; only Minors remain)
- [ ] Video scenario aligned or explicitly deferred
