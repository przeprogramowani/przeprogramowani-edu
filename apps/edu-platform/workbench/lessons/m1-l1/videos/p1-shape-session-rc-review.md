# RC Review: m1-l1 / p1-shape-session — Sesja /10x-shape na zywo

## Verdict

**Ready with minor fixes**

No blockers. One Major finding (missing explicit alignment between the brief's golden-path cheat sheet and the canonical soft-gate element naming from the grounding). Four Minor findings related to completeness, consistency with the draft, and one terminology drift. The brief is production-viable and recording can proceed with the fixes below applied.

## Findings

### Major: Golden-path cheat sheet omits closing soft-gate specifics

- Evidence: `p1-shape-session.md` table row for "Soft-gate" says "Pozwol wylistowac braki" and "Zamknij 1-2 luki, reszte zaakceptuj" but does not name the six soft-gate elements (Access Control, Data Model, Business Logic, Project Artifacts, MVP-in-a-week, Non-Goals). The MUST-SAY table has a phrase for soft-gate but also stays generic ("gdzie mam luki"). The older `video-shape-session.md` segment 5 names all six elements explicitly. The lesson draft (lines 161-168) and the grounding (`/10x-shape` SKILL.md source, six named elements) treat this as load-bearing content the learner must see.
- Why it matters: The soft-gate element names are one of the most concrete, transferable takeaways of the video. If the prompter and cheat sheet are silent on them, the presenter may improvise or skip naming them, and the video loses alignment with the draft's numbered list. The six elements are part of the spec's required fragments.
- Required fix: Add a sub-row or annotation to the golden-path cheat sheet's "Soft-gate" row listing the six elements by name: (1) Access Control, (2) Data Model, (3) Business Logic (one-sentence rule), (4) Project Artifacts, (5) MVP-in-a-week, (6) Non-Goals. The presenter does not need to recite them word-for-word, but the printed cheat sheet must contain them so they are available during the live session.
- Source check: `lesson-grounding.md` "Closing 6-element soft gate" section; `video-shape-session.md` segment 5 lines 142-149; `lesson-draft.md` lines 161-168.

### Minor: Business-logic golden-path answer says "pusty CRUD" but the cheat sheet labels the column "CELOWO pusty CRUD" without the domain-rule resolution

- Evidence: The golden-path cheat sheet row for "Business Logic" has "CELOWO pusty CRUD: 'User dodaje i odhacza'" in the left column and "Po empty-CRUD: 'Seria przerwana -> pokaz przerwe, reset lub kontynuacja'" in the right column. The MUST-SAY table has the expanded framing. However, the right column omits the word "regula" or "regula domenowa" that the draft and grounding use consistently (lesson-draft line 158: "Wymusi konkretna regule domenowa"; grounding: "seven explicit rule shapes"). The presenter may describe the fix as a feature instead of a domain rule.
- Why it matters: The lesson draft owns the concept "regula domenowa" as the opposite of empty CRUD. The video should reinforce this term at least once, so the text and video use the same vocabulary.
- Required fix: Amend the right-column entry for "Business Logic" or add a MUST-SAY phrase: "To jest regula domenowa — nie ficzer, nie statystyka. Regula zamieniajaca dane w wartosc." (or similar). One mention is enough.
- Source check: `lesson-draft.md` line 158; `lesson-grounding.md` empty-CRUD detection section.

### Minor: Prompter intro text (segment 1) references "Auth i get m1l1 mam za soba" but does not mention npx @latest

- Evidence: Segment 1 prompter text says "Auth i get m1l1 mam za soba" without specifying the invocation method. The lesson draft (lines 68-72) and the resolved CLI invocation decision (lesson-spec.md "Resolved Decisions") mandate `npx @przeprogramowani/10x-cli@latest` as the canonical invocation to guarantee the latest version. The older `video-shape-session.md` segment 1 (lines 53) also uses the full npx form. The p1-welcome.md brief does not mention CLI at all (talking head only).
- Why it matters: The video is the first time the learner sees the CLI in action. Saying just "auth i get" without establishing the npx @latest prefix may create inconsistency with the written lesson. However, this is a live demo brief and the presenter will have already run the commands off-camera; the text is a voiceover cue, not a typed command.
- Required fix: Consider adding a parenthetical note to the prompter text: "Auth i get m1l1 mam za soba — przez npx @latest" or keep as-is but add a brief note in the Setup checklist reminding the presenter that if they show `ls .claude/skills/` on camera, they should reference npx invocation verbally.
- Source check: `lesson-draft.md` lines 68-72; `lesson-spec.md` "Resolved Decisions" CLI invocation entry.

### Minor: MUST-SAY table "Empty-CRUD" phrase differs slightly from lesson-draft wording

- Evidence: MUST-SAY says "Agent zlapal, ze moja logika to pusty CRUD — i zmusil mnie do decyzji. Bez tego mialbym ladna apke bez wartosci." The lesson draft (line 158) uses "Agent powie ci wprost, ze budujesz pusty CRUD. Wymusi konkretna regule domenowa." The older video scenario (line 124) uses "Agent zlapal, ze moja logika biznesowa to pusty CRUD — i zmusil mnie do decyzji." Note: "logika" (brief) vs "logika biznesowa" (older scenario). Both are acceptable, but "logika biznesowa" is more precise and matches the draft's vocabulary.
- Why it matters: Minor terminology consistency. Using "logika biznesowa" instead of bare "logika" reinforces the lesson's owned concept.
- Required fix: Change "moja logika" to "moja logika biznesowa" in the MUST-SAY phrase. This is a single-word addition.
- Source check: `video-shape-session.md` line 124; `lesson-draft.md` line 158.

### Note: Brief format is significantly leaner than the older video-shape-session.md

- Evidence: `p1-shape-session.md` is ~130 lines. `video-shape-session.md` is ~275 lines with full per-segment format, objectives, "Most do tekstu" links, pre-production TODO, and detailed fallback plans. The brief uses a "P1 Brief" format with a golden-path cheat sheet, prompter text for intro/artefakt/closing, improv instructions for the demo, and a condensed setup/fallback section. The brief references "min. 2-3 proby generalne PRZED nagraniem" and "screenshoty z prob" but does not replicate the full pre-production TODO from the older file.
- Why it matters: The P1 Brief format is fit for an experienced presenter who knows the material and the older scenario. If the presenter has not read `video-shape-session.md`, some operational detail (e.g., the specific voiceover technique of commenting "do kamery" in pauses between Agent responses) may be missed. However, this is an editorial choice, not a defect.
- Required fix: None required. If desired, add a one-line reference: "Pelna wersja scenariusza: video-shape-session.md" in the Setup section so the presenter can consult the detailed version if needed.

### Note: "Kolejnosc nagrania: 3 z 5" — the five recordings are spread across two sessions

- Evidence: The brief says "Sesja 2" and "Kolejnosc nagrania 3 z 5". Cross-checking with p1-welcome.md (1 z 5, sesja 1), p1-lesson-intro.md (2 z 5, sesja 1), and noting that there appear to be two more briefs expected (presumably CLI intro and possibly 10xCards or brownfield). This is consistent with the lesson having five video placeholders in the spec.
- Why it matters: No issue. Recording order and session grouping are consistent across the briefs examined.
- Required fix: None.

## Spec Compliance

- Thesis: **Pass.** The brief demonstrates the Socratic session from hazy idea to shape-notes.md with visible Agent-driven precision, which is the lesson's thesis.
- Learning outcomes: **Pass.** The brief covers running `/10x-shape`, showing the six phases, Socratic challenge, empty-CRUD detection, and closing soft-gate, and inspecting shape-notes.md. Learning outcomes 1 and 3 are directly supported. Outcome 2 (hollow PRD) is correctly excluded per resolved spec decision ("hollow PRD demo zostaje tylko w tekscie").
- Behavioral change: **Pass.** The brief's CTA ("Twoj ruch: odpal /10x-shape na swoim pomysle. Daj sie przepytac.") directly invites the behavioral change.
- Required example/demo: **Pass.** The brief uses the canonical "aplikacja do sledzenia nawykow" example from spec and draft, with the same golden-path answers (junior dev, 7 days, empty CRUD -> domain rule).
- Failure mode: **Pass.** Empty-CRUD detection is a first-class segment. Hollow PRD correctly stays in text. "Session jednorazowa" is addressed by the closing CTA ("Jesli masz istniejacy projekt — odpal /10x-shape w jego katalogu").
- Bridge in/out: **Pass.** Bridge in is implicit (first lesson, prework assumed). Bridge out via prompter segment 7 correctly names `/10x-prd` as next step and defers to lesson text.

## Grounding And External Checks

- Verified claims:
  - Six phases of `/10x-shape` are consistent with grounding source (SKILL.md, checked 2026-05-10).
  - Empty-CRUD detection as a named mechanic with seven rule shapes is confirmed by the grounding.
  - Closing 6-element soft-gate is confirmed by the grounding.
  - Auto-detection of brownfield mode mentioned in the closing CTA is confirmed by the grounding (brownfield support verified 2026-05-10).
  - `npx @przeprogramowani/10x-cli@latest auth` + `get m1l1` as prerequisite is consistent with the resolved spec decision and draft.

- Unsupported or softened claims:
  - (none) The brief makes no factual claims beyond what is grounded.

- Open verification:
  - The brief assumes 20-30 min raw -> 12-15 min post-edit. This is a production estimate, not a factual claim. Confirmed by the older video-shape-session.md which uses the same estimate.

## Curriculum Continuity

- Previous lesson fit: N/A (first lesson). Prework continuity is maintained via the "habit tracker" example from prework [4.2] and the CTA referencing brownfield for participants with existing projects.
- Next lesson setup: The closing prompter text correctly says "/10x-prd" is the next step and defers full PRD description to the lesson text. This sets up the written lesson's "Generacja PRD: /10x-prd" section without the video stealing that content.
- Potential duplicates: The brief overlaps with the detailed `video-shape-session.md` by design (same session, two format depths). No duplication with m1-l2 content.
- Scope theft risk: **None.** The brief does not teach toolkit internals, skill anatomy, tech-stack selection, or bootstrap — all reserved for m1-l2 and m1-l3.

## Editorial Quality

- Style guide fit: The brief is a recording plan, not learner-facing prose, so style guide rules (heading style, paragraph breaks, conversational tone) apply only to the prompter text blocks. Those blocks are concise, direct, use "ty/ci" address, and avoid AI-sounding patterns.
- AI-sounding patterns: None detected in the prompter text.
- Polish/prose issues: The brief uses ASCII-only Polish (no diacritics), which is standard for prompter text that will be displayed on a teleprompter. Acceptable editorial choice.

## Diagram Quality

- Diagrams present: None (recording brief, not lesson prose).
- Placement: N/A.
- Missing opportunities: The brief references the diagram slide from p1-lesson-intro.md implicitly but does not need its own diagrams.
- Decorative or redundant: N/A.
- Syntax/rendering: N/A.

## Video Alignment

This IS the video scenario under review. Alignment checks against the lesson draft:

- **Consistent:** The golden-path cheat sheet mirrors the draft's before/after example (habit tracker, junior dev, 7-day flow, serie + przerwa as domain rule, non-goals list).
- **Consistent:** The six phases shown match the draft's flowchart (Vision, Persona, MVP, FRs, Business Logic, Product Framing).
- **Consistent:** Socratic challenge and empty-CRUD detection are explicitly called out as key moments, matching the draft's description at lines 155-158.
- **Gap (Major finding above):** Closing soft-gate elements not named in the cheat sheet, though present in the draft.
- **Consistent:** The brief correctly does NOT show `/10x-prd` — per resolved spec decision, hollow PRD is text-only.
- **Consistent:** Brownfield mention is limited to the closing CTA, matching the draft's approach (brownfield has its own section in text but no video demo per the optional placeholder).

Alignment with older `video-shape-session.md`:

- The P1 Brief is a condensed, presenter-facing version of the older scenario. All seven segments from the older scenario map to the seven segments in the brief (Setup, Vision+Persona, MVP, FRs+Business Logic, Framing+Soft-gate, Artefact, Closing).
- No contradictions between the two versions.

## Side-Effect Ledger

New claims introduced:
(none)

Claims removed:
(none)

Neighboring lesson references changed:
(none)

Prework references used:
- [4.2] Dobry i zly projekt kursowy — habit tracker example continuity

Prework concepts repeated intentionally:
(none)

Potential duplicates:
- p1-shape-session.md and video-shape-session.md cover the same recording session in two depths. This is by design (P1 Brief for teleprompter, older file for full scenario reference). No action needed.

Unsupported facts:
(none)

Video/text mismatches:
- Closing soft-gate element names missing from the brief's cheat sheet but present in the draft (Major finding above).
- "logika" vs "logika biznesowa" terminology (Minor finding above).

Needs human decision:
(none)

## Acceptance Checklist

- [x] Spec compliance blockers resolved (none found)
- [x] Unsupported factual claims resolved or removed (none found)
- [x] Neighboring lesson drift resolved (none found)
- [ ] Closing soft-gate element names added to golden-path cheat sheet (Major fix)
- [ ] "regula domenowa" term added to MUST-SAY or Business Logic cheat sheet entry (Minor fix)
- [ ] "logika biznesowa" consistent in MUST-SAY (Minor fix)
- [x] Video scenario aligned with lesson draft
- [x] No scope theft from m1-l2 or m1-l3
