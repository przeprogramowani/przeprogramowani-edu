# Outdated lesson-marker references after the m5 reorder (2026-06-08)

## What changed

Module 5 was rotated. "Shared AI Registry" (this lesson) moved **m5-l3 → m5-l4**.
"AI Internal Builders" moved **m5-l4 → m5-l1** and is now the module's *wide
introduction* (it precedes this lesson instead of following it).

So there are **two** distinct kinds of stale reference — fix them differently:

- **(R) Relabel** — text names *this* lesson "m5-l3"/"M5-L3"/"m5l3". It is now
  **m5-l4**. Safe mechanical rename.
- **(I) Inverted pointer** — text points to "m5-l4" meaning the *old* "AI Internal
  Builders / how-to-build / next lesson". That content is now **m5-l1** and
  **precedes** this lesson, and is no longer "next". These need **editorial
  judgement**, not a find-replace — the "how to build" home is being redecided as
  m5-l2…l4 are written. Do **not** blind-replace these.

Already handled in this pass (so not listed below as TODO):
- Schema `groundingSources[].url` + asset-path note → updated to `lessons/m5-l4/`.
- Schema `sideEffectLedger` of m5-l1 and m5-l4 → reorder + inversion recorded.
- `lesson-draft.md` forward-leads (old lines 201 / 228 / 240, "to temat następnej
  lekcji") → neutralized, and a real bridge-out to async/remote (m5-l5) added.

---

## A. Inside this lesson folder (`lessons/m5-l4/`) — needs an editorial re-pass

Note: line numbers are pre-edit (from the 2026-06-08 grep); re-grep before fixing.

### lesson-spec.md
- L1 — title `# Lesson Spec: m5-l3 — Shared AI Registry` **(R)**
- L9 — "Prepares for: m5-l4 — AI Internal Builders" **(I)** → now prepares for **m5-l5** (Async & Remote Agents); the whole prepares-for target changed, not just the label
- L20 — "m5-l3 answers the question…" **(R)**
- L58 — "forward-pointer to m5-l4" (MCP) **(I)**
- L63 — "m5-l4 owns it (m5-l3 ends at 'why this exists')" **(R + I)**
- L128, L130, L140, L148, L150, L152 — beat-level "m5-l4 bridge / m5-l4 owns / m5-l4 hook" **(I)**
- L230 — "m5-l4 opens on the builder side…" bridge-out narrative **(I)**
- L234 — "update `m5-l3` in lessons-schema.json" **(R)**
- L235 — handout wiring "which lesson ref (m5l3)" in toolkit course-content **(R)** → **m5l4**
- L244 — "m5-l3/m5-l4 boundary applied… (l3 = why, l4 = how)" **(R + I, inverted)**

### lesson-grounding.md
- L1 — title `# Lesson Grounding: m5-l3 …` **(R)**
- L6 — "m5-l4 (owns how…); m5-l3 ends at why" **(R + I)**
- L148, L163, L177 — `- URL: workbench/lessons/m5-l3/…md` **(R)** — these now point at the **old, moved path** and are broken; rename to `lessons/m5-l4/`
- L184 — "m5-l4 boundary (why, not how)" **(I)**
- L215 — "m5-l3 needs MCP only as a forward-pointer" **(R)**
- L245 — "Updated lessons-schema.json, m5-l3 entry only" **(R)**

### rc-review.md
- L1 — title `# RC Review: m5-l3 …` **(R)**
- L10 — "respects… m5-l4 'how'" **(I)**
- L56 — "bridges out to m5-l4 (lines …) — 'how to build' next" **(I)**
- L68, L70 — deferrals "PAID as deferral to m5-l4" **(I)** (note: the draft lines these cite were edited this pass)
- L75 — "→ m5-l4 builds it" **(I)**
- L98 — "Next lesson setup (m5-l4): clean…" **(I)**
- L101 — "m5-l3 ends precisely at why…" **(R)**
- L125 — "m5-l4 = 'how' deferred" **(I)**

### api-cli-learnings.md  (source material — lower priority, but inconsistent)
- L1 — `# M5-L3 Source Material…` **(R)**
- L5 — "for m5-l3, alongside…" **(R)**
- L185 — "Fit with the m5-l3 contract — boundary RESOLVED" **(R)**
- L187 — "The m5-l3 / m5-l4 split is decided" **(R + I)**
- L189, L191 — "m5-l3 owns the 'why'… m5-l3 teaches all" **(R)**
- L195, L196, L197 — "m5-l4 (AI Internal Builders) owns the 'how'… picks up from m5-l3" **(R + I)**
- L199 — "m5-l3 ends having justified why; m5-l4 opens with how" **(R + I)**
- L202, L203, L205 — "m5-l3 can reveal… and m5-l4 …; recurring-pattern thread for m5-l3" **(R + I)**

### github-packages-learnings.md  (source material)
- L1 — `# M5-L3 Source Material…` **(R)**
- L4 — "second approach for m5-l3" **(R)**
- L123 — "m5-l3 owns the why of the API+CLI model" **(R)**
- L124 — "m5-l4 owns the how" **(I)**
- L154 — "Fit with the m5-l3 contract" **(R)**
- L163 — "belong to m5-l4 (AI Internal Builders) territory" **(I)**

### webinar-learnings.md  (source material)
- L1 — `# M5-L3 Source Material…` **(R)**
- L7 — "lesson-spec / lesson-grounding of m5-l3" **(R)**
- L87 — "Deep Dive boundary with m5-l4" **(I)**
- L109 — "Fit with the m5-l3 contract" **(R)**
- L111, L112 — "m5-l3 references it backward… m5-l3 teaches…" **(R)**
- L113 — "`preparesFor: m5-l4` (AI Internal Builders) — MCP-as-next-step…" **(I)** → preparesFor is now m5-l5

---

## B. Schema (`lessons-schema.json`) — m5-l4 object residual prose notes

(Field renames, orders, deps, URLs and ledger already updated; these are leftover
human-readable notes.)

- referencesOnly string ending "…M5-L3 = praktyka budowy" **(R)** — but re-resolve
  the framing, since "build practice after concepts" no longer matches the order
- `groundingSources[]` note "m5-l3 owns the why, m5-l4 owns the how" **(I, inverted)**
  → now **m5-l4 owns the why, m5-l1 owns the how**

---

## C. Cross-references in OTHER live lessons / docs (Shared Registry = m5-l3 → m5-l4)

These point *to* the Shared Registry lesson by id; they should become **m5-l4**.
All are **(R)** relabels (the registry build-out still lives in this lesson; only
its number changed):

- `lessons/m1-l4/lesson-spec.md` — L62, L70
- `lessons/m1-l5/lesson-spec.md` — L57
- `lessons/m4-l1/lesson-spec.md` — L35, L53, L61, L68, L85, L101
- `lessons/m4-l1/lesson-draft.md` — L468 ("…osobnej lekcji (M5L3)")
- `lessons/m4-l1/lesson-grounding.md` — L16, L30, L211
- `lessons/m4-l1/research/multi-repo-context.md` — L14, L46, L80, L82, L90, L92
- `lessons/m4-l1/research/progressive-adoption.md` — L103
- `context/social-media-aidevs-to-10xdevs.md` — L84 ("rejestr skilli i reguł | M5-L3")
- `.claude/skills/mermaid/references/mermaid-style-guide.md` — L199 ("| M5L3 | Shared AI Registry |")

### Schema entries of OTHER lessons (also Shared Registry = m5-l3 → m5-l4), **(R)**
In `lessons-schema.json`:
- ~L866, ~L873 — m1-l4 object ("shared AI registry … (m5-l3, m4)" / "(m5-l3)")
- ~L1173 — later-module object ("(m5-l3, późniejsze moduły)")
- ~L4271, ~L4278, ~L4284, ~L4293, ~L4307 — m4-l1 object (owns / mustNotCover / outcomes "M5-L3")
- ~L4514, ~L4527 — m4-l1 groundingSources relevance notes ("beat 8 pointer to M5-L3")

> Note on m4-l1: it defers the *registry build-out* to the Shared Registry lesson.
> That target is now **m5-l4** — a pure relabel. (m4-l1 does **not** point at the
> new intro m5-l1.)

---

## D. Historical change-records — recommend **LEAVE AS-IS** (listed for completeness)

These are snapshots of past changes; rewriting them falsifies the record. They
reference "M5L3 / m5-l3" as the Shared Registry build-out at the time:

- `context/changes/m4-l1-bootstrap/` — change.md, plan.md, plan-brief.md
- `context/changes/multirepo-m4l1/` — frame.md, plan.md, plan-brief.md,
  multirepo-forum-m4l1-impact.md
- `context/archive/2026-06-03-m4l1-others/research.md` — L152

---

## Suggested fix order

1. **C + B** — mechanical (R) relabels in the schema and live cross-refs (low risk).
2. **A** — editorial re-pass on this lesson (spec/grounding/rc-review + source
   files): apply (R) self-id renames **and** re-resolve the (I) inversions
   (what "how to build" now means and where it lives), then re-run
   `lesson-editor-pl` + `lesson-rc-review`.
3. **D** — leave.
