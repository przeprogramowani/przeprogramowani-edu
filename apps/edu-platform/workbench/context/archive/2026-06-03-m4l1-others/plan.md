# Sharpen m4-l1 into a strong Module-4 opener (fulfilling its contract to L2–L5) — Implementation Plan

## Overview

This is the **editorial pass** that `m4-l1/m1-to-others.md` explicitly deferred ("`lesson-draft.md` NOT edited — captured for a future editorial pass"). It edits `lessons/m4-l1/lesson-draft.md` so it (a) reads as a strong Module-4 opener and (b) fulfills its handoff contract to L2–L5: closing the three contract gaps (G1/G2/G4) and the L1→L2 seam, naming the module's organizing foundations, and clearing RC-blocking markers and typos. Edits are applied directly (snippets are already on-voice and approved in `research.md`), then validated with `lesson-rc-review`.

## Current State Analysis

- The `m4-reorder` schema change is **done and correct**: `m3-l5 → m4-l1 → … → m4-l5 → m5-l1`. L1 is wired as the Module-4 entry point (`dependsOn: ["m3-l5"]`, `preparesFor: ["m4-l2"]`) — `lessons-schema.json:4252-4586`.
- The L1 draft is **already strong as an opener** (hook, economics, architecture, demo, maturity ladder, calibration all land; four valid Mermaid diagrams; on-voice). Its own scope is clean — no scope-theft of downstream lessons; the data-source inventory (G3) correctly stays downstream.
- But it has **three contract gaps + one weak seam**, all diagnosed in `m1-to-others.md` and confirmed live:
  - **G1 — collaboration contract** ("AI is your analyst; you own & defend the report"): absent. L5's draft *opens* on it (`m4-l5/lesson-2ed-draft.md:9,16,158`); L1's skill-as-generator framing (l.93–95, l.240) currently sends the opposite signal.
  - **G2 — attention budget extended from files → reading the repo**: absent. L2's notes cite "context economics z L1" (`m4-l2/notes.md:61-63`) as if it exists; L1's budget argument (l.21–23) is scoped to instruction-file size only.
  - **G4 — report-shape preview** (⓪→⑤): absent. The cert beat (l.253–268) names the *path* but never the five sections.
  - **L1→L2 seam / bridge-out**: weak/buried — the only forward-ref is inside the task at l.251.
- **Opener cleanups:** tier-2 altitude drift (l.149–205); three unfinished markers (`[todo]` l.156, l.328; malformed unclosed bold heading l.191 with an orphan bullet at l.193); ~7 typos. A requiredFragment regression: the **GitHub-search counting trap** (schema `requiredFragments[8]`) was dropped from the calibration beat.
- **arXiv IDs verified (2026-06-03):** `2601.20404` and `2602.11988` both resolve to genuine papers whose titles and headline numbers match the draft. No broken references — the `[todo]` at l.328 collapses to a delete + pointer (plus one claim-accuracy fix, below).

### Key Discoveries:

- Every proposed addition is **framing/bridge, not technique** — it pre-empts no downstream lesson. Safe to make now even though L2–L4 are `notes.md` only and L5 is a draft (`m1-to-others.md:118-125`).
- The single live cross-lesson dependency expressed in prose today is `m4-l2/notes.md:63`'s "context economics z L1"; the **G2 seed + bridge-out** are what make that reference *true* rather than aspirational.
- `research.md`'s **Prioritized Edit Plan (P1/P2/P3)** ships on-voice Polish snippets for every insert — this plan reuses them verbatim (see `research.md:178-238`).
- **Claim-accuracy nuance** (found during arXiv verification): paper `2602.11988`'s headline ">20%" is a **task-success-rate drop** (costs also rose); the draft at l.327 attributes ">20%" specifically to *inference cost*. To fix while resolving the adjacent `[todo]`.

## Desired End State

`lessons/m4-l1/lesson-draft.md` is RC-quality prose that: states the collaboration contract (G1), bridges the attention budget from files to reading the repo (G2 seed + L1→L2 bridge-out), previews the report's ⓪→⑤ shape without hardening unconfirmed cert numbers (G4), names the module's three organizing foundations, carries no `[todo]`/malformed-markup/typo, and restores the GitHub-search counting trap. `lesson-rc-review` returns no contract/markup/typo blockers; the only remaining RC blockers are the two explicitly out-of-scope items (video scenario; certification-copy confirmation), recorded in the side-effect ledger.

**Verification:** a re-run of `lesson-rc-review` plus a manual read confirms the four inserts form one coherent throughline and the voice holds.

## What We're NOT Doing

- **Not** teaching any downstream technique (wide-then-deep mapping, churn/hotspots, archetypes, Event Storming). G2 stays a one-line bridge; the technique is L2-owned (`m1-to-others.md:53-55`).
- **Not** adding the project data-source inventory (G3) — it stays downstream at point-of-use (`m1-to-others.md:57-63`).
- **Not** hardening certification numbers/timing (Builder min-reqs, week-5 timing, report template) — unconfirmed against official forms (rc-review Major #2). G4 names *sections only*.
- **Not** drafting the video scenario (`lessons/m4-l1/videos/`) — separate pipeline step + skill; flagged as an RC blocker, out of scope here.
- **Not** moving beats 7 & 8 (tool load/merge, multi-repo) out of Deep Dive — that altitude choice is intentional and defensible (`research.md:143-145`).
- **Not** editing `lessons-schema.json`, `m4-shape.md`, or any downstream lesson file.

## Implementation Approach

Direct edits with the Edit tool, applying `research.md`'s approved snippets. Phase order is contract-first (the load-bearing throughline), then opener strength + the foundation namings, then mechanical polish, then RC review. A deliberate reconciliation governs Phase 2: the owner chose **"name all three foundations, accept added length"**, so the tier-2 altitude tightening (research P2 #8) is **relaxed to a light touch** — fix the malformed-heading structure and trim only obvious redundancy; do **not** aggressively compress the cloudflare walkthrough, since length is being spent intentionally on the namings.

## Critical Implementation Details

- **G2 seed before the seam.** The G2 seed line (after l.23) must land *before* the L1→L2 bridge-out so the seam pays off something already planted. Insert order within Phase 1: G2 seed first, then the later inserts.
- **G4 stays soft.** The report-shape preview names ⓪→⑤ sections only. Do not state Builder min-reqs, week-5 timing, or report-template specifics as hardened fact (they live near l.241–242, l.246 and remain unconfirmed).
- **Voice contract.** All inserts use the house `ty`/`my` voice, rhetorical openers, and softened claims — match the surrounding draft. Snippets in `research.md:178-238` are already calibrated; preserve their wording.

---

## Phase 1: Contract gaps + RC-blocking markers (P1)

### Overview

Close the three contract gaps and the seam, and clear every RC-blocking marker. This is the load-bearing phase — the four inserts form the L1→L2–L5 throughline.

### Changes Required:

#### 1. G2 seed — attention budget extends from files to reading the repo

**File**: `lessons/m4-l1/lesson-draft.md` (after l.23, in the "Dlaczego skala łamie kontekst" economics beat)

**Intent**: Plant the one-line idea that finite attention limits not just instruction-file size but also how much of the repo can be read at once — the seed the L1→L2 bridge later pays off. One line only; wide-then-deep is L2-owned.

**Contract**: Insert the approved snippet at `research.md:207-209` ("Ta sama zasada zaraz odbije się echem przy kodzie… ale do tego wrócimy w kolejnych lekcjach."). New standalone short paragraph; no technique taught.

#### 2. L1→L2 bridge-out

**File**: `lessons/m4-l1/lesson-draft.md` (between l.229 and l.231, immediately before `## 🧑🏻‍💻 Zadania praktyczne`)

**Intent**: Add the deliberate hand-off — "you have `context/` + a budget rule, but you can't *see* the system yet; same attention budget shapes how you read code; first real job is a map" — carrying G2 to its payoff. Highest-leverage single edit.

**Contract**: Insert the approved snippet at `research.md:189-193`. New short paragraph closing the body before the task; ends pointing to the next lesson (the map).

#### 3. G1 collaboration contract

**File**: `lessons/m4-l1/lesson-draft.md` (before the task, after the bridge-out — around l.233)

**Intent**: State the contract under which the whole module's report is built: AI is the analyst/ally; the learner owns and defends the report; it is not auto-generated. Counters the current skill-as-generator signal (l.93–95, l.240).

**Contract**: Insert the approved snippet at `research.md:195-198` ("W całym tym module AI jest twoim analitykiem, nie autorem… potrafisz obronić, a nie taki, który wygenerowałeś jednym promptem…"). New short paragraph framing the task.

#### 4. G4 report-shape preview (sections-only)

**File**: `lessons/m4-l1/lesson-draft.md` (in the certification beat, after l.261)

**Intent**: Briefly name the report's full ⓪→⑤ shape so the L2–L5 sections have a frame, without hardening any unconfirmed number/timing.

**Contract**: Insert the approved snippet at `research.md:202-205`. Names ⓪ architektura kontekstu (here) → mapa → analiza modułu + hot spots → refaktor → domena, each "gdy do niej dojdziemy". No Builder/week-5/template specifics.

#### 5. Fix `[todo]` at l.156 ("brak przeszkadza")

**File**: `lessons/m4-l1/lesson-draft.md:156`

**Intent**: Replace the placeholder with concrete "the absence hurts" signals, reusing the maturity-ladder triggers (l.123–125).

**Contract**: Replace the `[todo: …]` line with the approved snippet at `research.md:212-213` (agent repeatedly loses the module's context despite root fixes / you keep manually re-sending the same doc references). Removes the marker.

#### 6. Fix malformed bold heading at l.191 + orphan bullet

**File**: `lessons/m4-l1/lesson-draft.md:191` (and the orphan single-item list at l.193)

**Intent**: The opening `**` is never closed, leaving an orphan bullet. Convert to a proper closed lead-in so the section reads correctly.

**Contract**: Apply `research.md:215` ("**Jeden `context/` w roocie czy osobny w każdym module?** Najczęściej coś pośrodku.") and re-knit the following bullet(s) into a well-formed list. Markup valid; no orphan list.

#### 7. Resolve `[todo]` at l.328 + tighten the l.327 cost claim

**File**: `lessons/m4-l1/lesson-draft.md:327-328` (Deep Dive "Co mówią badania o AGENTS.md")

**Intent**: The arXiv IDs are verified genuine and already linked in Materiały dodatkowe (l.343–344), so the todo collapses to a delete + pointer. Additionally correct the claim attribution: paper `2602.11988`'s ">20%" is a task-success-rate drop (with costs also rising), not specifically a ">20% inference-cost" figure.

**Contract**: Delete the `[todo: dodaj referencje i linki do badań]` at l.328; append a pointer to l.327 ("— oba znajdziesz w Materiałach dodatkowych.", per `research.md:216-217`). Adjust the l.327 sentence so the ">20%" reads as reduced task success / worse outcome at higher cost rather than a precise cost percentage. Keep the kierunkowo caveat.

### Success Criteria:

#### Automated Verification:

- No `[todo` markers remain: `grep -n "\[todo" lessons/m4-l1/lesson-draft.md` returns nothing.
- No unclosed bold heading / orphan list around the former l.191 (manual grep of `**Jeden` shows a closed pair).
- All four insert snippets are present: `grep` confirms key phrases ("twoim analitykiem", "narysowanie mapy" / next-lesson pointer, "architektura kontekstu" preview, repo-reading G2 seed).

#### Manual Verification:

- The four inserts (G2 seed → bridge-out → G1 → G4) read as one coherent throughline, not four bolted-on paragraphs.
- G4 names sections only — no hardened Builder min-reqs, week-5 timing, or template specifics.
- The l.327 claim now matches the paper (success-rate/outcome framing) and keeps the directional caveat.
- Voice holds (`ty`/`my`, softened claims) across all inserts.

**Implementation Note**: After completing this phase and automated checks, pause for manual confirmation before Phase 2.

---

## Phase 2: Opener strength + foundation namings (P2 + naming decision)

### Overview

Name the module's three organizing foundations (owner decision: name all three, accept added length), restore the dropped requiredFragment, trim the now-duplicate forward-ref, and apply a *light* tier-2 structural touch (relaxed, per the reconciliation).

### Changes Required:

#### 1. Name the three module-wide foundations

**File**: `lessons/m4-l1/lesson-draft.md` (folded into existing beats, not new standalone sections where avoidable)

**Intent**: Explicitly name the module's method so L1 is an on-ramp the downstream lessons operationalize: (a) **"progressive disclosure of scale"** as the named through-thread (near the economics/architecture framing, l.15–34); (b) the **"why + current problem" opening ritual** as the module's method (near the module-opening, ~l.11); (c) the **lenses / tools / output taxonomy** each downstream lesson follows (a one-line pointer). Owner chose full naming, accepting added length.

**Contract**: Three on-voice namings, drawn from `m4-shape.md:50-67` (cross-cutting principles) and `research.md:116-121`. The taxonomy naming stays a pointer ("każda lekcja tego modułu działa wedłóg tego samego schematu: soczewka → narzędzia/dane → element raportu") and must **not** teach or pre-empt the downstream lenses (L2–L5 are notes only). Names the concepts; doesn't elaborate them.

#### 2. Re-add the GitHub-search counting trap (requiredFragment[8])

**File**: `lessons/m4-l1/lesson-draft.md` (calibration beat, near l.131 / l.139)

**Intent**: Restore the dropped requiredFragment — the caveat that counting instruction files via GitHub search miscounts (it's a calibration trap), keeping the "these numbers are a consequence of strategy, not a target" thesis honest.

**Contract**: Short caveat near the repo-calibration numbers (l.131/l.139), consistent with `research.md:227-228` and schema `requiredFragments[8]`. On-voice, one or two sentences.

#### 3. Trim duplicate forward-ref at l.251

**File**: `lessons/m4-l1/lesson-draft.md:251`

**Intent**: Once the Phase-1 bridge-out exists, the buried "wykorzystaj wiedzę z lekcji 2 i 3" pointer competes with it. Shorten or drop it to leave a single deliberate forward-ref.

**Contract**: Reduce/remove the l.251 forward-ref per `research.md:225-226`; keep the task's "do it in a repo you understand" point intact.

#### 4. Light-touch tier-2 fix (relaxed)

**File**: `lessons/m4-l1/lesson-draft.md:149-205`

**Intent**: With length deliberately spent on the namings, apply only a *light* structural cleanup to the tier-2 region — ensure the (i)/(ii) layout content (l.191–206) reads as one coherent unit after the Phase-1 heading fix, and trim only obvious redundancy. Do **not** aggressively compress the cloudflare walkthrough (l.164–189).

**Contract**: Structural/readability touch only; the "lean by default" thesis stays dominant by tone, not by deep cuts. Per the reconciliation of Q-Scope (full pass) and Q-Reconcile (full naming, accept added length).

### Success Criteria:

#### Automated Verification:

- The GitHub-search counting trap phrase is present near the calibration beat (grep for the caveat keyword).
- The three foundation names appear in prose (grep for "progresywne ujawnianie skali" / chosen phrasing, the why-problem ritual phrasing, the taxonomy pointer).

#### Manual Verification:

- The three namings read as natural framing, not a glossary dump; "lean by default" still dominates.
- The taxonomy naming is a pointer only — it does not teach or pre-empt any L2–L5 technique.
- Only one deliberate forward-ref to L2 remains (Phase-1 bridge-out); l.251 no longer competes.
- The tier-2 region reads coherently after the light touch; no content the spec wanted was cut.

**Implementation Note**: Pause for manual confirmation before Phase 3.

---

## Phase 3: Polish sweep (P3)

### Overview

Mechanical typo fixes plus a final coherence read across the whole draft.

### Changes Required:

#### 1. Typo fixes

**File**: `lessons/m4-l1/lesson-draft.md`

**Intent**: Apply the seven typo fixes catalogued in `research.md:232-238`.

**Contract**: l.160 `jeżeli  do katalogu` → `jeżeli wchodzisz do katalogu tego jednego…` (double space + dropped verb); l.162 `kontekt` → `kontekst`; l.193 `w wybranych module` → `w wybranych modułach`; l.195 `uzwględnieniem` → `uwzględnieniem`; l.217 add comma before `jeżeli`; l.235 `Zprojektuj` → `Zaprojektuj`; l.265 `test planu czyli` → `test planu, czyli`. (Line numbers will have shifted from earlier inserts — match on text, not line.)

#### 2. Final coherence read

**File**: `lessons/m4-l1/lesson-draft.md`

**Intent**: Read the full draft end-to-end to confirm the new inserts, namings, and trims sit naturally and the voice is uniform.

**Contract**: No structural change expected; minor wording fixes only if the read surfaces a seam.

### Success Criteria:

#### Automated Verification:

- Known typos gone: `grep -n "kontekt\b\|uzwględnieniem\|Zprojektuj\|w wybranych module" lessons/m4-l1/lesson-draft.md` returns nothing.

#### Manual Verification:

- A full read confirms voice uniformity and that all inserts/namings/trims read naturally.
- No remaining double-spaces or dropped verbs in the touched regions.

**Implementation Note**: Pause for manual confirmation before Phase 4.

---

## Phase 4: RC review + handoff

### Overview

Validate the pass with `lesson-rc-review`, record the side-effect ledger, and flag the remaining out-of-scope RC blockers.

### Changes Required:

#### 1. Run `lesson-rc-review`

**File**: produces/updates `lessons/m4-l1/rc-review.md`

**Intent**: Re-review the draft against schema, spec, grounding, neighboring lessons, and the seam now that the contract gaps are closed. (Direct edits were used, so review runs after — never parallel, per standing preference.)

**Contract**: RC review reports no contract/markup/typo blockers introduced by this pass; remaining blockers are only the two known out-of-scope items.

#### 2. Side-effect ledger

**File**: this change folder (and/or the lesson per workbench convention)

**Intent**: Record the editorial side-effects per the workbench ledger format.

**Contract**: Fill: New claims introduced (G1/G2 bridge framing — not factual); Claims removed/sharpened (l.327 cost→success-rate); Neighboring lesson references changed (none — only L1 edited; the G2 bridge now makes `m4-l2/notes.md:63` true); Prework references used ([3.1] MECW); Potential duplicates ((none) — l.251 dup trimmed); Unsupported facts (certification copy — flagged); Video/text mismatches ((none) — video scenario absent, flagged); Needs human decision (certification copy confirmation; video scenario authoring).

#### 3. Flag remaining RC blockers

**Intent**: Make the two out-of-scope blockers explicit for the next step.

**Contract**: Note in the ledger / change.md: (a) **video scenario** (`lessons/m4-l1/videos/`) still missing — separate pipeline step via the `video-scenario` skill; (b) **certification copy** (Builder min-reqs, week-5 timing, report template at l.241–242, l.246) still unconfirmed against official forms — owner confirmation needed before RC sign-off.

### Success Criteria:

#### Automated Verification:

- `lesson-rc-review` runs to completion and its report is written.

#### Manual Verification:

- RC review confirms G1/G2/G4/seam are now present and on-contract.
- The side-effect ledger is complete and accurate.
- The two out-of-scope RC blockers are clearly recorded for follow-up.

**Implementation Note**: This is the final phase; on completion the prose pass is done and the only open items are the two flagged, out-of-scope blockers.

---

## Testing Strategy

This is an editorial (prose) change — "tests" are greps for markers/typos plus `lesson-rc-review` and manual reads.

### Automated checks:

- `grep` for residual `[todo`, known typos, and the malformed heading.
- `grep` for presence of each required insert phrase and the GitHub-search caveat.

### Manual checks:

1. Read the four Phase-1 inserts in sequence — confirm one coherent throughline.
2. Confirm G4 hardens no unconfirmed numbers.
3. Confirm the three namings don't pre-empt L2–L5.
4. Full end-to-end read for voice uniformity.
5. `lesson-rc-review` for contract/grounding validation.

## Migration Notes

None — single-file prose edit; no schema, data, or downstream-lesson changes.

## References

- Research (with verbatim snippets): `context/changes/m4l1-others/research.md` (Prioritized Edit Plan at `:178-238`)
- Continuity notes (G1/G2/G4 + seam): `lessons/m4-l1/m1-to-others.md`
- Module source-of-truth for L2–L5: `lessons/m4-shape.md` (spine `:11-25`; cross-cutting principles `:50-67`; L1 role + bridge-out `:73-110`)
- Target draft: `lessons/m4-l1/lesson-draft.md`
- Schema: `lessons-schema.json:4252-4586` (m4-l1), `:4589-4749` (m4-l2…m4-l5)
- arXiv verification (2026-06-03): `2601.20404` and `2602.11988` confirmed genuine; titles/numbers match.

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Contract gaps + RC-blocking markers

#### Automated

- [x] 1.1 No `[todo` markers remain (grep) — 58b7de6d
- [x] 1.2 No unclosed bold heading / orphan list around former l.191 — 58b7de6d
- [x] 1.3 All four insert snippets present (grep key phrases) — 58b7de6d

#### Manual

- [x] 1.4 Four inserts read as one coherent throughline — 58b7de6d
- [x] 1.5 G4 names sections only — no hardened cert numbers — 58b7de6d
- [x] 1.6 l.327 claim matches the paper (success-rate framing) + keeps caveat — 58b7de6d
- [x] 1.7 Voice holds across all inserts — 58b7de6d

### Phase 2: Opener strength + foundation namings

#### Automated

- [x] 2.1 GitHub-search counting-trap phrase present near calibration beat — 0eaa7d88
- [x] 2.2 Three foundation names appear in prose — 0eaa7d88

#### Manual

- [x] 2.3 Namings read as natural framing; "lean by default" still dominant — 0eaa7d88
- [x] 2.4 Taxonomy naming is a pointer only — no L2–L5 pre-emption — 0eaa7d88
- [x] 2.5 Only one deliberate L2 forward-ref remains (l.251 no longer competes) — 0eaa7d88
- [x] 2.6 Tier-2 region coherent after light touch; nothing the spec wanted was cut — 0eaa7d88

### Phase 3: Polish sweep

#### Automated

- [x] 3.1 Known typos gone (grep) — d074ac1c

#### Manual

- [x] 3.2 Full read confirms voice uniformity; all inserts/namings/trims read naturally — d074ac1c
- [x] 3.3 No remaining double-spaces / dropped verbs in touched regions — d074ac1c

### Phase 4: RC review + handoff

#### Automated

- [x] 4.1 `lesson-rc-review` runs to completion; report written — f2598ebc

#### Manual

- [x] 4.2 RC review confirms G1/G2/G4/seam present and on-contract — f2598ebc
- [x] 4.3 Side-effect ledger complete and accurate — f2598ebc
- [x] 4.4 Two out-of-scope RC blockers recorded for follow-up — f2598ebc
