---
date: 2026-06-03T09:51:38+0200
researcher: mkczarkowski
git_commit: 7f1c436e16daa78271b0f6abc86bce4570898468
branch: master
repository: przeprogramowani-sites
topic: "Sharpen m4-l1 into a strong Module-4 opener that fulfills its contract to L2–L5"
tags: [research, workbench, 10xdevs3, m4, lesson-draft, continuity, handoff]
status: complete
last_updated: 2026-06-03
last_updated_by: mkczarkowski
---

# Research: Sharpen m4-l1 into a strong Module-4 opener that fulfills its contract to L2–L5

**Date**: 2026-06-03T09:51:38+0200
**Researcher**: mkczarkowski
**Git Commit**: 7f1c436e16daa78271b0f6abc86bce4570898468
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Use `lessons/m4-shape.md` (source of truth for L2–L5) and `lessons/m4-l1/m1-to-others.md`
(the L1→L2–L5 continuity notes) to improve `lessons/m4-l1/lesson-draft.md` so it is (a) a
great first lesson of Module 4 and (b) fulfills all of its contract to L2–L5.

**Scope (confirmed with owner):** both dimensions — the downstream handoff contract AND
L1's standalone opener quality. **Output:** gap analysis + a prioritized edit plan ready to
feed an editing pass. (RC-blocker sweep was *not* selected as a separate axis, but the two
open RC items that touch this work — the missing video scenario and unconfirmed certification
copy — are noted where relevant.)

## Summary

The schema reorder is **done and correct**: `m3-l5 → m4-l1 → m4-l2 → m4-l3 → m4-l4 → m4-l5 → m5-l1`,
with `m4-l1` wired as the Module-4 entry point (`dependsOn: ["m3-l5"]`, `preparesFor: ["m4-l2"]`).
L1's *own* scope is clean — no scope-theft of the downstream lessons, and the data-source
inventory (G3) is correctly kept downstream.

The draft is **already strong as an opener** (hook, economics, architecture, demo, ladder,
calibration all land; four diagrams valid; on-voice). But it has **three contract gaps to
L2–L5 and one weak seam**, all already diagnosed in `m1-to-others.md` and confirmed live here:

- **G1 — collaboration contract** ("AI is your analyst, you own & defend the report"): **absent.**
  L5's draft *opens* on it; L1 never establishes it. The draft's skill-as-generator framing
  (l.93–95, l.240) currently sends the *opposite* signal (report feels auto-generated).
- **G2 — attention budget extended from files → reading the repo**: **absent.** The draft's
  budget argument is scoped to instruction-FILE size; the leap to "you can't read the whole
  repo at once" — which L2 cites as "context economics z L1" — is never made.
- **G4 — report-shape preview** (⓪→⑤ across L1–L5): **absent.** The certification beat names
  the *path* but never previews the five report sections.
- **L1→L2 seam / bridge-out**: **weak / buried.** The body ends on certification + badge +
  Deep Dive; the only forward-ref to L2 is buried inside the task at l.251. No deliberate
  "you can't *see* the system yet — first job is a map" hand-off.

Plus **opener-quality cleanups**: one altitude drift (tier-2 per-module content, ~l.149–205,
heavy for an MVP audience the lesson just told to stay lean), **three unfinished markers**
(`[todo]` at l.156 and l.328; a malformed unclosed bold heading at l.191), and ~7 typos.

**Maturity caveat:** L2–L4 exist only as `notes.md` (no learner prose yet); only L5 has a
draft. So the downstream "assumptions" are firm where L5's draft or L2's notes state them
explicitly (G1, G2) and inferential elsewhere. The edits below are all *framing/bridge*
additions that pre-empt no downstream technique, so they're safe to make now regardless.

## Detailed Findings

### Area 1 — Schema contract (live state verified)

The `m4-reorder` change executed cleanly. From `lessons-schema.json`:

- **Boundary wiring:** `m3-l5.preparesFor = ["m4-l1"]` (`lessons-schema.json:4008-4009`);
  `m5-l1.dependsOn = ["m4-l5"]` (`lessons-schema.json:4766`).
- **m4-l1** (`lessons-schema.json:4252-4586`): title "Skalowanie kontekstu dla AI w dużych
  projektach"; `status: planned`; `dependsOn: ["m3-l5"]`; `preparesFor: ["m4-l2"]`; **7 `owns`**,
  **4 `referencesOnly`**, **5 `mustNotCover`**, **6 `learningOutcomes`**, **12 `requiredFragments`**,
  **14 `groundingSources`**, non-empty `sideEffectLedger` (unsupportedFacts + needsHumanDecision).
  L1 is the *only* m4 lesson with populated LOs/fragments/grounding.
- **Downstream ownership** (each `owns` only its vertical; `learningOutcomes`/`requiredFragments`
  still empty — awaiting drafts):
  - **m4-l2** (`:4589-4629`) "Nowy-stary projekt? Agent zbuduje Ci mapę…" — repo map: deep/shallow
    modules, coupling metrics/Main Sequence, DSM, wide-then-deep, retrieval models, CLI tooling →
    report element **①**.
  - **m4-l3** (`:4632-4669`) "Analiza feature z AI…" — hotspots (complexity×churn), connascence,
    change coupling → report elements **②③**.
  - **m4-l4** (`:4672-4709`) "Refaktoryzacja z Agentem…" — EAA archetypes, Strangler Fig/Branch-by-
    Abstraction, Mikado Method → report element **④**.
  - **m4-l5** (`:4712-4749`) "Modernizacja legacy z DDD…" — Event Storming, Bounded Contexts/Context
    Mapping, subdomain distillation → report element **⑤**.

**Implication:** L1 must *set up* but **not teach** mapping/analysis/refactor/DDD (its
`mustNotCover` item #2 says exactly this), and should give the learner a frame for where the
five downstream report sections come from. The schema confirms the handoff the draft must serve.

### Area 2 — What L2–L5 actually assume from L1 (continuity verified against live files)

`m1-to-others.md`'s four claims, checked against the real downstream files:

- **G1 (collaboration contract) — CONFIRMED as a gap.** L5's draft opens on it:
  *"prezentujemy Generatywne AI jako wartościowego sojusznika"* (`m4-l5/lesson-2ed-draft.md:9`),
  *"ostateczne decyzje architektoniczne zawsze pozostają w Twoich rękach"* (`:16`),
  *"ostateczna odpowiedzialność … zawsze spoczywa na nas"* (`:158`). L1's draft never states it.
- **G2 (reading-budget bridge) — CONFIRMED as a gap.** L2's notes justify map-before-feature:
  *"ani człowiek, ani agent nie zmieści całego repo naraz; 'wide then deep' … (łączy się z
  context economics z L1)"* (`m4-l2/notes.md:61-63`). L1's budget argument
  (`lesson-draft.md:21-23`) is only about instruction-file size — the extension is missing.
  This is the **single direct L1 reference** across all downstream notes.
- **G3 (data-source inventory) — CONFIRMED it stays downstream; no gap, no L1 action.** L3/L4
  introduce sources at point-of-use: *"git history/blame, … issue tracker…"* (`m4-l3/notes.md:51`);
  *"ADRs, git/PR rationale, post-mortems…"* (`m4-l4/notes.md:53`). L1 correctly does **not**
  carry an inventory — it only homes `context/` (`lesson-draft.md:77`).
- **G4 (report-shape preview) — CONFIRMED as a gap.** L1 names the *path* to the Architect badge
  (`lesson-draft.md:253-268`) and its own ⓪ section (`:244`) but never previews ⓪→⑤. The shape
  lives only in `m4-shape.md:11-25` and `m1-to-others.md:90-95`, not in learner-facing prose.

**Three extra implicit foundations** the G-items don't name (lower priority, optional):
1. The **"why + current problem" opening ritual** every L2–L5 note uses (e.g. `m4-l2/notes.md:7-11`)
   — `m4-shape.md` §1 principle #1; L1 uses it implicitly but never names it as the module's method.
2. The **lenses / tools / output taxonomy** each downstream lesson follows — not named in L1.
3. **"Progressive disclosure of scale"** as a module-wide principle (`m4-shape.md:65-67`) — L1
   plants the idea (`lesson-draft.md:15-34`) but doesn't name it as the thread L2–L5 operationalize.

**Maturity warning:** L2–L4 = `notes.md` only; L5 = `lesson-2ed-draft.md` + `notes.md`. The
contract is firm where stated in prose/notes (G1 via L5, G2 via L2 notes) and inferential
otherwise. Editing L1 now is safe because every proposed addition is framing/bridge, not technique.

### Area 3 — L1 draft: opener quality + the gaps in place

Beat-by-beat the draft realizes the spec's 9-beat Structural Logic Map:

| Spec beat | Draft | Verdict |
|---|---|---|
| 1 Hook (from m1-l4) | `:3-15` | strong — recalls m1-l4, names both failure reflexes, lands thesis |
| 2 Economics + 4 failure modes | `:17-48` | strong; before/after diagram `:36-46` |
| 3 Architecture + 3-way split | `:50-77` | strong; diagram `:68-75`; **G2 seed missing** |
| 4 Demo scaffold | `:79-99` | good; avoids pure-tutorial |
| 5 Ladder + triggers | `:101-127` | good; diagram `:111-118` |
| 6 Calibrate MVP vs big repo | `:129-147` | good |
| 7 Tool load/merge | Deep Dive `:285-303` | moved to Deep Dive — **intentional**, not a missing beat |
| 8 Multi-repo awareness | Deep Dive `:305-319` | moved to Deep Dive — **intentional** |
| 9 Mandatory task + cert | `:231-268` | present; **G1 + G4 missing** |

- **Beats 7 & 8 in Deep Dive** is a defensible altitude choice for an MVP audience, internally
  signposted (`:147, :215, :280, :303`), and it answers the spec's own risk warnings ("tool-by-tool
  dump", "going deep into polyrepo"). **Keep as-is** — do not "restore to core."
- **Altitude drift at `:149-205`** (≈55 lines on per-module `context/`, per-module `AGENTS.md`,
  cloudflare leaf anatomy, the "(i)/(ii)" layout choice). rc-review already flagged this as heavy
  for the MVP audience the lesson just told to stay on tier 1 (`:133`). Not scope-theft (no
  downstream lesson owns it — `m1-to-others.md:105-107`), so **tighten, don't cut**.
- **Scope-theft check: none.** Downstream techniques appear only as pointers (`:11` names upcoming
  work; `:77` homes their artifacts; `:251` points to "lekcji 2 i 3"; multi-repo defers build-out
  to M5L3 at `:319`). G3 inventory correctly absent.

### Area 4 — Unfinished markers and typos (block RC)

- `[todo: wypiszmy lepiej co to znaczy że brak przeszkadza]` — `lesson-draft.md:156`.
- **Malformed unclosed bold heading** `**Jeden context/ w roocie czy osobny w każdym module? Coś
  po średku.` — `lesson-draft.md:191` (opening `**` never closed; the bullet at `:193` is an orphan
  single-item list).
- `[todo: dodaj referencje i linki do badań]` — `lesson-draft.md:328`. **Note:** the two studies are
  *already* linked in Materiały dodatkowe (`:343-344`), so this resolves to a delete + pointer.
- Typos: `:160` `jeżeli  do katalogu` (double space + dropped verb); `:162` `kontekt`→`kontekst`;
  `:193` `w wybranych module`→`modułach`; `:195` `uzwględnieniem`→`uwzględnieniem`; `:217` missing
  comma before `jeżeli`; `:235` `Zprojektuj`→`Zaprojektuj`; `:265` missing comma `test planu, czyli`.
  *(The earlier-suspected `:23 "jakość"` is correct as written — no fix.)*

### Area 5 — Two open RC items adjacent to this work (carry-over, not invented here)

From `m4-l1/rc-review.md` (verdict: **Not ready**), independent of the handoff edits:
1. **Required `video-scenario` artifact missing** — `lessons/m4-l1/videos/` does not exist; the
   demo beat defers the *showing* to video. (Pipeline step.)
2. **Certification copy unconfirmed** — Builder min-reqs, week-5 timing, report template stated as
   fact (`:241-242, :246`) pending confirmation against official forms. **Honor this in G4:** the
   report-shape preview must name *sections only*, not harden numbers/timing.
3. (Minor, requiredFragment regression) the **GitHub-search counting trap** was dropped from the
   calibration beat — schema `requiredFragments[8]` wants it back near `:131`/`:139`.

## Prioritized Edit Plan

> All snippets are short, on-voice (ty/my, rhetorical openers, softened claims). They add framing
> only — no downstream technique. Apply with `lesson-editor-pl`, then re-run `lesson-rc-review`
> (editor before review, never parallel — per standing preference).

### P1 — contract-critical (handoff gaps + RC-blocking markup/todos)

1. **INSERT L1→L2 bridge-out** between `:229` and `:231` (before `## 🧑🏻‍💻 Zadania praktyczne`).
   Carries G2 to its payoff; the highest-leverage single edit (`m1-to-others.md:76-85`,
   `m4-shape.md` §2 "Bridge out → L2"). Proposed:
   > Masz już dwie rzeczy: `context/`, czyli miejsce na to, co projekt *wie*, i regułę mówiącą, ile
   > z tego agent trzyma naraz. Ale wciąż nie *widzisz* samego systemu — a ten sam budżet uwagi,
   > który kształtuje twoje pliki, kształtuje też to, jak czytasz kod: całego repo też nie wczytasz
   > na raz. Dlatego pierwsze realne zadanie w tym module to narysowanie mapy. Tym zajmiemy się w
   > następnej lekcji.
2. **INSERT G1 collaboration contract** before the task (after `:233`). Proposed:
   > W całym tym module AI jest twoim analitykiem, nie autorem. Skille i agent przyspieszą zbieranie
   > kontekstu, narysują mapę, podsuną kandydatów do refaktoru — ale decyzje architektoniczne i tak
   > należą do ciebie. Raport, który złożysz na odznakę Architekta, ma być *twój* — taki, który
   > potrafisz obronić, a nie taki, który wygenerowałeś jednym promptem i przyjąłeś na wiarę.
3. **INSERT G4 report-shape preview** in the certification beat (after `:261`); name sections, do
   **not** harden numbers/timing (rc-review Major #2). Proposed:
   > Żebyś widział całość: raport architektoniczny składa się z kilku części, a każda powstaje w innej
   > lekcji tego modułu. Tutaj domykasz jego fundament — sekcję *architektura kontekstu*. W kolejnych
   > lekcjach dojdą mapa repozytorium, analiza wybranego modułu wraz z jego najbardziej zapalnymi
   > miejscami, kandydaci do refaktoryzacji i wreszcie spojrzenie na domenę. Każdą z tych części
   > poznasz, gdy do niej dojdziemy.
4. **INSERT G2 seed line** after `:23` (so the seam's payoff is set up earlier). Keep to one line —
   wide-then-deep technique is L2-owned. Proposed:
   > Ta sama zasada zaraz odbije się echem przy kodzie: skoro uwaga jest skończona, to agent (i ty)
   > nie przeczyta całego repo na raz — ale do tego wrócimy w kolejnych lekcjach.
5. **FIX `[todo]` at `:156`** with concrete "brak przeszkadza" signals (reuse ladder triggers
   `:123-125`):
   > Co znaczy „brak przeszkadza"? Konkretnie: agent wielokrotnie gubi kontekst tego modułu mimo
   > poprawek w roocie, albo za każdym razem ręcznie dosyłasz mu te same referencje do jego dokumentacji.
6. **FIX malformed bold heading at `:191`** → proper closed lead-in; resolves the orphan bullet:
   > **Jeden `context/` w roocie czy osobny w każdym module?** Najczęściej coś pośrodku.
7. **FIX `[todo]` at `:328`** — delete it; append to `:327` "— oba znajdziesz w Materiałach
   dodatkowych." **Also verify** the two arXiv IDs at `:343-344` (`2601.20404`, `2602.11988`)
   resolve before RC; they back the only quantitative claims (`:325, :327`). *(grounding/human check)*

### P2 — opener strength

8. **TIGHTEN tier-2 altitude at `:149-205`** — compress the cloudflare leaf code walkthrough
   (`:164-189`) and fold the "(i)/(ii) layout decision" (`:191-206`) into the maturity-ladder tier-2
   description rather than running a second standalone section. Keeps "lean by default" dominant.
9. **TRIM duplicate forward-ref at `:251`** — once edit #1 exists, shorten/drop the buried
   "wykorzystaj wiedzę z lekcji 2 i 3" pointer to avoid two competing forward-refs.
10. *(Optional, from rc-review)* re-add the **GitHub-search counting trap** near `:131`/`:139`
    (requiredFragment[8]).

### P3 — polish / typos

11. `:160` double space + dropped verb → `jeżeli wchodzisz do katalogu tego jednego…`.
12. `:162` `kontekt` → `kontekst`.
13. `:193` `w wybranych module` → `w wybranych modułach`.
14. `:195` `uzwględnieniem` → `uwzględnieniem`.
15. `:217` add comma before `jeżeli`.
16. `:235` `Zprojektuj` → `Zaprojektuj`.
17. `:265` `test planu czyli` → `test planu, czyli`.

## Code References

- `lessons-schema.json:4252-4586` — m4-l1 object (dependsOn/preparesFor/owns/mustNotCover/LOs/fragments).
- `lessons-schema.json:4589-4749` — m4-l2…m4-l5 objects (downstream ownership; empty LOs/fragments).
- `lessons-schema.json:4008-4009`, `:4766` — m3-l5→m4-l1 and m4-l5→m5-l1 boundary wiring.
- `lessons/m4-l1/lesson-draft.md:21-23, :77, :93-95, :149-205, :229-268, :251` — budget argument,
  `context/` home, skill-as-generator framing, tier-2 drift, certification beat, buried forward-ref.
- `lessons/m4-l1/lesson-draft.md:156, :191, :328` — unfinished markers.
- `lessons/m4-l1/lesson-spec.md:76-90` — Structural Logic Map + failure modes the edits must serve.
- `lessons/m4-l1/m1-to-others.md:35-72, :76-85` — G1/G2/G3/G4 definitions + the L1→L2 seam text.
- `lessons/m4-shape.md:11-25, :73-110` — report spine (⓪→⑤) + L1 role-in-module + Bridge out → L2.
- `lessons/m4-l2/notes.md:61-63` — the live "context economics z L1" reference (G2 anchor).
- `lessons/m4-l5/lesson-2ed-draft.md:9, :16, :158` — the live collaboration-contract frame (G1 anchor).
- `lessons/m4-l3/notes.md:51`, `lessons/m4-l4/notes.md:53` — downstream data sources (G3 stays here).
- `lessons/m4-l1/rc-review.md` — open RC blockers (video scenario; certification copy).

## Architecture Insights

- **The module is one deliverable.** Every lesson hands the learner a finished report section
  (L1=⓪, L2=①, L3=②③, L4=④, L5=⑤). L1's job is to be the *foundation + on-ramp*: it owns ⓪ and
  must frame the throughline without teaching the four downstream techniques. The handoff gaps are
  all *framing*, which is exactly what a foundation lesson should carry — they pre-empt nothing.
- **The contract is asymmetric in maturity.** L1 is RC-quality; L2–L4 are notes; L5 is a draft.
  The safe move is to write L1's bridges/framing now (they're stable) and let the downstream drafts
  align to them when authored — not to over-specify L1 against notes that may still move.
- **The one true cross-lesson dependency expressed in prose today** is `m4-l2/notes.md:63`'s
  "context economics z L1". The G2 seed + bridge-out edits are what actually make that reference
  true rather than aspirational.
- **Altitude is the recurring risk.** Both the spec's beat-6 warning and rc-review flag over-weighting
  big-repo/tier-2 material for an MVP audience. The draft mitigates well but `:149-205` still tips;
  tightening it strengthens the "lean by default" thesis the whole module rests on.

## Historical Context (from prior changes)

- `m4-reorder` (archived) moved context-scaling from m4-l5 → m4-l1 and cascaded the four legacy
  lessons down one slot; schema renumber, dependency rewiring, folder move, and research relocation
  are done. Recorded in `lessons/m4-l1/positioning-and-certification.md` and `lessons/m4-shape.md` §3.
- `lessons/m4-l1/m1-to-others.md` (2026-06-02) is the prior analysis that first identified G1/G2/G4 +
  the seam as "captured for a future editorial pass — `lesson-draft.md` NOT edited." This change is
  that editorial pass.

## Related Research

- `lessons/m4-l1/research/` — the grounding bundle behind the L1 draft (repo case studies, tool
  load/merge mechanics, arXiv AGENTS.md studies).

## Open Questions

1. **Certification copy** — Builder min-reqs / week-5 timing / report template remain unconfirmed
   against official forms (rc-review Major #2). G4 preview is written to avoid hardening these; the
   underlying numbers still need owner confirmation before RC.
2. **arXiv IDs `2601.20404` / `2602.11988`** (`lesson-draft.md:343-344`) look placeholder-shaped and
   back the lesson's only quantitative claims — confirm they resolve (grounding check).
3. **Video scenario** — required artifact still missing (`lessons/m4-l1/videos/`); separate pipeline
   step, out of scope for this prose pass but blocks RC.
4. **Downstream firmness** — L2–L4 have no learner prose yet; once drafted, re-check that they open
   with / cite the foundations L1 now hands forward (especially G1 and the G2 bridge).
5. **Optional implicit foundations** (why+problem ritual; lenses/tools/output taxonomy; naming
   "progressive disclosure of scale") — worth a one-line mention in L1, or leave to the downstream
   drafts to establish? Owner call.
