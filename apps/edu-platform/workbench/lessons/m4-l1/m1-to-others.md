# L1 → L2–L5 continuity notes

> What the **context-scaling lesson (m4-l1)** hands forward to the rest of Module 4, the
> foundations the downstream lessons *assume*, and the one seam worth writing. Written
> 2026-06-02 from an analysis of `m4-l1/lesson-draft.md` against the L2–L5 `notes.md`.
>
> **Framing (confirmed with owner):** L1's own artifacts are the **source of truth for L1**;
> `m4-shape.md` is source of truth for **L2–L5**. L1 **keeps its influence on the report** —
> it produces the **⓪ Context architecture** section (the report's foundation), *and* it
> thematically prepares L2–L5. These notes are observations to fold into a later editorial
> pass — **no edits were made to `lesson-draft.md`.**

---

## The one thing that already works

L1 explicitly frames `context/` as the **home for everything L2–L5 will generate**:

> *"Później w tym module będziesz generował mapy kodu, analizy feature'ów i plany
> refaktoryzacji, a każdy z tych artefaktów potrzebuje miejsca. Tym miejscem jest
> context/."* — `lesson-draft.md` l.77 (reinforced in the task, l.251)

That single sentence is the backbone of the L1→L2–L5 continuity. Every downstream lesson
produces an artifact; L1 has already given them a disciplined place to live. **Keep it,
and consider naming it once more in the L1→L2 bridge.**

---

## What the downstream lessons assume that L1 doesn't yet say

Three foundations the L2–L5 `notes.md` lean on. They trace back to `m4-shape.md`'s *old*
theoretical-L1 (now superseded by context-scaling), so they currently have no explicit
home. None is yet in the L1 draft.

### G1 — The collaboration contract (AI as analyst/ally, the human decides & defends)
- **Who assumes it:** L5's 2ed draft opens on it (`m4-l5/lesson-2ed-draft.md` l.7–16,
  l.156–158); `m4-shape.md` cross-cutting principle #3 says *"reuse the framing already set
  in L1."* But L1 never states it explicitly.
- **Why it belongs in L1:** it's the contract under which the whole report is built — the
  learner owns and defends it, AI accelerates. It's framing, not technique, so it pre-empts
  nothing downstream.
- **Suggested shape:** one short paragraph near L1's intro or just before the task — "across
  this module AI is your analyst/ally; the architecture report is *yours*, defended, not
  auto-generated."
- **Conflict with L1 spec:** none. Safe.

### G2 — Attention budget, extended from *files* to *reading the repo*
- **Who assumes it:** L2 notes justify map-before-feature by citing *"context economics z
  L1"* (`m4-l2/notes.md` l.63). But L1's attention-budget argument is about
  *instruction-file size* (l.17–34), never about *reading/analysing* a large repo.
- **Why it belongs in L1:** the bridge — "the same finite attention that stops you dumping
  the whole project into one `AGENTS.md` also stops you reading the whole repo in one pass."
- **Important boundary:** the full **wide-then-deep** method is **L2-owned** (`m4-l2/notes.md`
  §4). L1 should plant the *idea* as a one-line bridge, **not** teach the technique.
- **Conflict with L1 spec:** medium if over-built (risks pre-empting L2). Keep it to a bridge.

### G3 — The project data-source inventory — **stays downstream, do NOT add to L1**
- **Who assumes it:** L3 (git history/churn/issues/observability), L4 (ADRs/PR
  rationale/no-goals/post-mortems). `m4-shape.md` §4 *originally* assigned the inventory to L1.
- **Decision (confirmed):** **leave it downstream**, introduced at point-of-use in L2–L4.
  The inventory is the raw material of mapping/analysis; pulling it into L1 contradicts L1's
  `Must Not Cover`. `m4-shape.md §4` has been corrected to reflect this.
- **Action in L1:** none.

### G4 — A preview of the report's shape
- **Who needs it:** the learner, so the L2–L5 sections have a frame. L1 opens the
  certification throughline (l.253–268) and produces the ⓪ Context architecture section.
- **Suggested shape:** in L1's certification beat, briefly name the report's full shape —
  ⓪ context architecture (here) → ① map (L2) → ②③ feature + hot spots (L3) → ④ refactor (L4)
  → ⑤ DDD (L5). Names the elements; doesn't teach them.
- **Conflict with L1 spec:** low. (Mind rc-review Major #2: certification copy is still
  unconfirmed against the official forms — don't harden numbers/timing here.)

---

## The L1 → L2 seam (highest-leverage single edit, when L2 is drafted)

Today L1 ends on certification and L2 will open on "you can't decide what to change until
you see the whole board." The connective tissue, carrying G2:

> *"`context/` holds what the project knows, and you've set a rule for how much the agent
> holds at once. But you still can't **see** the system itself — and the same attention
> budget that shapes your files shapes how you read code: you can't load the whole repo
> either. So the first real job is a map."* → **L2.**

---

## Per-lesson continuity at a glance

| Lesson | Produces | Home in `context/`? | Extra foundation it assumes from L1 |
|--------|----------|---------------------|--------------------------------------|
| **L2** map | ① Repo map | ✅ (l.77) | G2 reading-economics bridge; report-shape preview (G4) |
| **L3** feature/hotspots | ②③ | ✅ | data sources owned here (G3); collaboration contract (G1) |
| **L4** refactor | ④ | ✅ (l.77 names "plany refaktoryzacji") | data sources/ADRs owned here (G3); G1 |
| **L5** DDD | ⑤ | ✅ | **G1 collaboration contract** (its draft already opens on it) |

---

## Forward-lean (L1 content pointing downstream — observations, not moves)

- **Report-element ownership:** L1 keeps its ⓪ Context architecture section (confirmed). The
  *other* report sections are owned by the lessons that produce them; the report *template*
  is best assembled where the elements actually land (L2 onward / module end). L1 opens the
  throughline; it shouldn't try to own the whole template.
- **Per-module `context/` + `AGENTS.md` depth (l.149–205):** rc-review already flags this as
  heavy for the MVP audience. No downstream lesson owns it, so it can't move — flagged only
  so its altitude isn't mistaken for a continuity defect.

---

## Status / what was actually changed

- ✅ `m4-shape.md` adjusted: spine now lists ⓪ Context architecture (L1); the stale §2 "L1 =
  theoretical foundations" block replaced with L1's real role + a pointer to this file; §3
  decisions marked resolved post-reorder; §4 data-source inventory marked "owned downstream,
  not built in L1."
- ✅ This file created.
- ⛔ `m4-l1/lesson-draft.md` — **not edited.** G1/G2/G4 + the seam are captured here for a
  future editorial pass, per owner instruction.
- 🔁 The interim `m4-continuity-report.md` (written earlier this session, before the framing
  was confirmed) is superseded by this file — safe to delete.
