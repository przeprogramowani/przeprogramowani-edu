# RC Review: m4-l1 — Skalowanie kontekstu dla AI w dużych projektach

> Re-review after the `m4l1-others` editorial pass (Phases 1–3). Supersedes the 2026-06-02 review.
> Scope of this pass: close the four L1→L2–L5 contract gaps (G1/G2/G4 + seam), clear RC-blocking
> markers/typos, name the three module foundations, restore the GitHub-search counting trap.

## Verdict

**Not ready** — but only because of the **two known, out-of-scope, deferred items** carried over from
the prior review (missing video scenario; unconfirmed certification copy). **This pass introduced no new
Blocker or Major findings.** All four contract gaps, both `[todo]` markers, the malformed heading, the dropped
GitHub-search counting trap, and the seven typos are resolved. Against the change's stated end state, the
editorial pass is complete.

## Findings

### Major (carry-over, out of scope of this pass): Required `video-scenario` artifact missing

- Evidence: `lessons/m4-l1/videos/` does not exist; `lessons-schema.json:4563-4569` lists `video-scenario`
  in `requiredArtifacts`, and `videoPlaceholders` (`:4310-4314`) define three planned recordings. The demo
  beat (`lesson-draft.md:79-99`) defers the *showing* to video.
- Why it matters: the lesson contract requires a video scenario for production handoff; the demo beat reads
  as incomplete without it.
- Required fix: author `lessons/m4-l1/videos/video-*.md` via the `video-scenario` skill (separate pipeline step).
- Source check: schema `requiredArtifacts`; prior `rc-review.md`. Explicitly deferred in `plan.md` ("What We're NOT Doing").

### Major (carry-over, needs human decision): Certification copy unconfirmed against official forms

- Evidence: `lesson-draft.md:273` states Builder min-reqs as fact (CRUD + 1 logika biznesowa + testy oparte
  o ryzyko); `:274` states the Architect form arrives "na początku piątego tygodnia"; `:250` references the
  report's "sekcja architektura kontekstu". These sit in `sideEffectLedger.needsHumanDecision` (`:4583-4585`)
  and `lesson-grounding.md:259, 266`.
- Why it matters: learner-facing certification copy must match the official Builder / Architect & Champion forms.
- Required fix: owner confirmation of Builder min-req wording, week-5 timing, and any fixed report template,
  before RC sign-off. **G4 was deliberately written to name report sections only** (`:269`), so this pass did
  not harden any unconfirmed number — the open item is the pre-existing copy at `:250, :273, :274`.
- Source check: `lesson-grounding.md` "Claims To Avoid Or Soften" + "Open Verification Questions"; owner decision, not research.

### Minor: Added inserts lean on em-dashes

- Evidence: the new framing uses `—` at `:27, :135, :233, :239 (×2), :269`. Style guide caps prose em-dashes at
  ~1 per 10 lines and prefers varied punctuation (`references/style.md:137-147`).
- Why it matters: minor drift from house punctuation discipline; not a comprehension issue.
- Required fix (optional polish): vary a few of the added `—` to commas/colons/`czyli`. Acceptable as-is for RC.
- Source check: `references/style.md` "Limit emdash usage".

### Note: Bridge-out points to "the map" immediately before this lesson's own task heading

- Evidence: `:233` ends "pierwsze realne zadanie w tym module to narysowanie mapy. Tym zajmiemy się w następnej
  lekcji." directly precedes `## 🧑🏻‍💻 Zadania praktyczne` (this lesson's scaffold/report task).
- Why it matters: a fast reader could briefly conflate "first real task = map (next lesson)" with the task that
  follows. The G1 framing (`:239`) and G4 preview (`:269`) resolve it (this lesson owns the *foundation* ⓪;
  the map is ①, next lesson). Reads coherently on a full pass.
- Required fix: none required; intentional per plan ("highest-leverage single edit").

### Note (pre-existing, not in this pass's scope): "obowiązkowe" vs "(Opcjonalne)" task framing

- Evidence: `:237` calls the task "zadanie obowiązkowe", while `:241` labels the scaffolding sub-step
  "(Opcjonalne)"; the mandatory part is "napisz sekcję…" at `:250`.
- Why it matters: the mandatory-vs-optional split is correct (write the section = mandatory; actually scaffold =
  optional for a course MVP) but reads slightly ambiguously. Pre-existing; not touched by this pass.
- Required fix: optional future clarification; out of scope here.

## Spec Compliance

- Thesis: **pass** — "co agent powinien wiedzieć *właśnie teraz*?" (`:17`) matches spec thesis.
- Learning outcomes: **pass** — all 6 LOs realized (economics/4-failure-modes; lean-root+`context/` scaffold;
  maturity ladder + signals; tool load/merge in Deep Dive; multi-repo awareness; the report section task).
- Behavioral change: **pass** — "lean by default, escalate on a named signal" is dominant and now explicitly
  named as a through-thread ("progresywne ujawnianie skali", `:27`).
- Required example/demo: **pass** — 10xCards 82-line `CLAUDE.md` + `context/` scaffold (`:79-99`).
- Failure mode: **pass** — both symmetrical traps (fat monolith / premature structure) disarmed (`:7-9, :158`).
- Bridge in/out: **pass** — bridge-in from m1-l4 (`:3`); bridge-out to L2 now present and deliberate (`:233`),
  closing the previously-buried seam.

## Grounding And External Checks

- Verified claims:
  - arXiv `2601.20404` (−28% runtime / −17% tokens) and `2602.11988` (>20% cost / reduced success from redundant
    context) — both genuine, Codex/small-PR-scoped; linked in Materiały dodatkowe (`:343-344`). The `:335` claim was
    **sharpened this pass** to read the ">20%" as a task-success-rate drop with cost also rising, matching
    `groundingSources` note for `2602.11988` (`:4344`) and `lesson-grounding.md:255`.
  - Four failure modes (OpenAI Harness), three-way split, Agent Skills three-tier disclosure, Codex/Claude load
    mechanics — all match `groundingSources`.
- Unsupported or softened claims (correctly hedged in-draft):
  - Maturity-ladder thresholds (~200–300 lines, own deploy/owner) — kept as heuristics ("wyczucie, nie próg", `:122, :166`).
  - Codex byte cap presented as version-sensitive (`:297`).
  - Maintenance-mechanism effectiveness explicitly un-quantified ("nikt nie zmierzył, *o ile*", `:229`).
- Open verification:
  - Certification copy (see Major above) — owner confirmation pending.

## Curriculum Continuity

- Previous lesson fit: **pass** — opens from m1-l4 single-project onboarding; `dependsOn: ["m3-l5"]` honored.
- Next lesson setup: **strong** — the G2 seed (`:27`) + bridge-out (`:233`) now make `m4-l2/notes.md:61-63`'s
  "ani człowiek, ani agent nie zmieści całego repo naraz … (łączy się z *context economics* z L1)" a **fulfilled**
  reference rather than an aspirational one. The single live cross-lesson dependency in prose is now true.
- Potential duplicates: the l.13 taxonomy pointer ("element raportu") and the l.269 report-shape preview reinforce
  each other without redundancy (schema-of-each-lesson vs the concrete section list). Acceptable.
- Scope theft risk: **none** — the three foundation namings are framing only; the taxonomy stays a pointer
  (`soczewka → narzędzia/dane → element raportu`) and teaches no L2–L5 technique. `mustNotCover` respected.

## Editorial Quality

- Style guide fit: **good** — `ty`/`my` voice, rhetorical openers, softened claims, paragraphs ≤3 sentences,
  research numbers in Deep Dive. Inserts match surrounding voice.
- AI-sounding patterns: none introduced.
- Polish/prose issues: only the minor em-dash lean (see Minor). All 7 catalogued typos resolved.

## Diagram Quality

- Diagrams present: 4 (before/after monolith vs lean; two-layer architecture; maturity ladder; (i)/(ii) layout decision).
- Placement: each sits next to the claim it visualizes.
- Missing opportunities: none material.
- Decorative or redundant: none; the (i)/(ii) diagram is now set up in prose by the Phase-2 light touch (`:195`),
  resolving the earlier prose/diagram mismatch.
- Syntax/rendering: valid mermaid.

## Video Alignment

No scenario present — see Major (required artifact missing).

## Side-Effect Ledger

New claims introduced: Framing/bridge only (G1 collaboration contract; G2 files→repo attention bridge;
  "progresywne ujawnianie skali" as the named through-thread; the why+problem opening ritual; the
  lens→tools/data→report taxonomy pointer; G4 ⓪→⑤ report-shape preview). None are factual/quantitative.
Claims removed: (none) — the `:335` ">20% inference cost" claim was *sharpened* (not removed) to "task-success
  dropped >20%, cost also rose", matching the paper.
Neighboring lesson references changed: (none edited) — but the G2 bridge now makes `m4-l2/notes.md:63`'s
  "context economics z L1" reference accurate.
Prework references used: [3.1] MECW / attention budget (extended to file/dir architecture).
Prework concepts repeated intentionally: [3.1] attention budget — deliberately extended, not repeated as filler.
Potential duplicates: (none) — the buried "lekcji 2 i 3" forward-ref was trimmed so only the deliberate
  bridge-out remains.
Unsupported facts: Certification copy (Builder min-reqs, week-5 timing, report template) — flagged, owner decision.
Video/text mismatches: (none) — video scenario absent (flagged), so no contradiction exists yet.
Needs human decision: (1) certification-copy confirmation against official forms; (2) video-scenario authoring.

## Acceptance Checklist

- [x] Spec compliance blockers resolved (no spec/markup/typo blockers remain)
- [x] Contract gaps G1/G2/G4 + L1→L2 seam present and on-contract
- [x] requiredFragment[8] (GitHub-search counting trap) restored
- [x] Unsupported factual claims softened or correctly scoped in-draft
- [x] Neighboring-lesson drift resolved (G2 bridge makes m4-l2's L1 reference true)
- [x] Editorial polish accepted (minor em-dash note optional)
- [ ] Certification copy confirmed against official forms (owner decision — out of scope)
- [ ] Video scenario authored or explicitly deferred (deferred — separate pipeline step)
