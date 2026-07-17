# RC Review: m1-l1 / p1-welcome — Powitanie + prework

## Verdict

**Ready with minor fixes**

No blockers. Two minor findings and three notes. The video brief is a lean, low-risk talking-head segment that aligns well with the lesson draft, spec, schema, and the older expanded video-welcome.md scenario. The prompter text faithfully covers the schema's first `videoPlaceholder` without drift, scope theft, or unsupported claims.

## Findings

### Minor: Prework module numbering uses ordinals ("Pierwszy", "Drugi") instead of official module names or numbers

- Evidence: p1-welcome.md lines 38-49 — the prompter text says "Pierwszy — Chatbot vs Agent vs Harness", "Drugi — Tooling", "Trzeci — Jak to dziala pod maska", "Czwarty — Przygotowania do projektu." The prework actually has numbered sub-modules within four larger modules (e.g., [1.2], [2.1]-[2.4], [3.1]-[3.5], [4.1]-[4.3]). The four items in the video map to prework modules 1, 2, 3, and 4 at the module level, which is correct as a high-level summary.
- Why it matters: No factual error — the four modules are correct at the module level. However, the second module is labeled "Tooling" here, while the prework module 2 title in the schema is "Agent w IDE, Terminalu czy w Chmurze?" and covers Cursor, Claude Code, and agent-native IDEs. "Tooling" is a reasonable shorthand but slightly vague. The draft's VIDEO PLACEHOLDER (lesson-draft.md line 5) uses "tooling do programowania z AI" which is slightly more precise.
- Required fix: Consider aligning the shorthand with the draft's wording: "Tooling do programowania z AI" or simply "Narzedzia do programowania z AI" for clarity. This is a polish item, not a blocker.
- Source check: prework.md module 2 summaries vs p1-welcome.md line 42.

### Minor: Quiz mention lacks fallback if quiz is deprecated by recording time

- Evidence: p1-welcome.md line 51 — "Jesli jeszcze nie wypelniles quizu na platformie — zrob to. Pomaga dopasowac agende." The setup checklist (line 18) correctly flags "Sprawdzic: czy quiz nadal dziala na platformie." However, the prompter text has no bracketed fallback instruction (unlike the older video-welcome.md which lists this as a "Needs human decision" item).
- Why it matters: If the quiz is no longer live at recording time, the presenter must improvise a cut or skip. Adding a bracketed fallback note inside the prompter text would make the brief self-contained.
- Required fix: Add a bracketed instruction after the quiz line, e.g.: `[jesli quiz zostal wylaczony — pomin te dwa zdania]`.
- Source check: Older video-welcome.md "Needs human decision" section; setup checklist line 18.

### Note: p1-welcome.md is a condensed rewrite of video-welcome.md — both files coexist

- Evidence: The `videos/` directory contains both `video-welcome.md` (5.4 KB, detailed 3-segment scenario with pre-production TODO) and `p1-welcome.md` (1.7 KB, lean P1 brief with full prompter text). Both cover the same content — welcome + prework reminder.
- Why it matters: Two files for the same video segment can confuse future agents or editors. The P1 brief format (p1-welcome.md) appears to be the production-ready recording brief, while video-welcome.md is the earlier planning artifact.
- Required fix: None required during review. Recommend a human decision: archive or rename video-welcome.md to avoid confusion (e.g., `_archive-video-welcome.md` or delete after p1-welcome.md is accepted).
- Source check: Directory listing.

### Note: "Kolejnosc nagrania: 1 z 5" implies five videos total for m1-l1

- Evidence: p1-welcome.md line 10 — "Kolejnosc nagrania: **1 z 5**". The schema lists five `videoPlaceholders` for m1-l1 (welcome, lesson-intro, shape-session live, optional prd.md, optional brownfield). The `videos/` directory has P1 briefs for three of these (p1-welcome, p1-lesson-intro, p1-shape-session) plus older expanded scenarios for three (video-welcome, video-lesson-intro, video-shape-session) plus a video-cli-intro that corresponds to the lesson-draft's CLI video placeholder in "Minimalne uruchomienie."
- Why it matters: The "5" count should match the actual planned recordings. If only 3-4 are being produced (two optional placeholders may be skipped), the count could mislead the production team.
- Required fix: None required — the count is consistent with the schema's five placeholders. If some are dropped, update the "X z Y" count in all P1 briefs.
- Source check: Schema videoPlaceholders for m1-l1.

### Note: "Po nagraniu" instruction creates a tight dependency with p1-lesson-intro

- Evidence: p1-welcome.md line 68 — "Od razu przejdz do video-lesson-intro — ten sam setup, nie ruszaj nic." This is a useful production note. It correctly matches p1-lesson-intro.md's setup which says "ten sam co welcome +".
- Why it matters: No issue — this is good production practice. Noting it as a verified cross-reference.
- Source check: p1-lesson-intro.md line 12.

## Spec Compliance

- Thesis: **pass** — the video does not state the lesson thesis (that is p1-lesson-intro's job). It correctly limits itself to welcome + prework context.
- Learning outcomes: **pass** — video does not teach outcomes; it sets preconditions. This is appropriate for a welcome segment.
- Behavioral change: **n/a** — welcome segment is not expected to drive behavioral change.
- Required example/demo: **n/a** — no demo expected in welcome segment.
- Failure mode: **n/a** — not applicable to welcome.
- Bridge in/out: **pass** — the video correctly bridges from prework to the lesson ("Prework za nami. Zaczynamy budowac.") and forward to the lesson content ("Pierwszym ruchem w tym kursie nie bedzie implementacja. Bedzie rozmowa.").

## Grounding And External Checks

- Verified claims:
  - Four prework modules are correctly named at the module level and match prework.md summaries.
  - The framing "budowanie zaczyna sie od decyzji, nie od kodu" aligns with the lesson thesis in lesson-spec.md and lesson-draft.md.
  - Quiz is referenced as an existing platform feature; setup checklist includes a verification step.
- Unsupported or softened claims:
  - (none) — the video introduces no factual claims. It is a welcome and prework reminder.
- Open verification:
  - Quiz availability at recording time (flagged in setup checklist).

## Curriculum Continuity

- Previous lesson fit: **pass** — this is the first lesson; the video correctly positions prework as the predecessor.
- Next lesson setup: **pass** — the video does not reference m1-l2. It correctly scopes to m1-l1 only.
- Potential duplicates: (none) — the video does not duplicate prework content, only names the modules.
- Scope theft risk: (none) — the video does not enter m1-l1's own lesson content (that is p1-lesson-intro's job).

## Editorial Quality

- Style guide fit: The prompter text uses direct address ("witajcie", "napiszesz", "przeprowadzisz"), casual pauses, and short punchy sentences. Matches style.md tone rules.
- AI-sounding patterns: (none detected) — the text reads as natural spoken Polish.
- Polish/prose issues: The text uses ASCII-only Polish (no diacritics: "Czesc" not "Cześć", "ktora" not "która"). This is intentional for prompter compatibility and is noted in the format header ("PELNY prompter"). No issue.

## Diagram Quality

- Diagrams present: none
- Placement: n/a — talking head format, no diagrams expected.
- Missing opportunities: (none) — this is a 3-4 minute welcome segment without technical content.
- Decorative or redundant: n/a
- Syntax/rendering: n/a

## Video Alignment

**Pass.** The p1-welcome.md video brief aligns with:
- The first `videoPlaceholder` in the schema: "Powitanie w pierwszej lekcji glownego programu — przypomnienie o preworku jako fundamencie kursu..."
- The lesson-draft.md VIDEO PLACEHOLDER at lines 5-6.
- The older video-welcome.md scenario (condensed but faithful).
- The p1-lesson-intro.md brief (clean handoff without overlap).

No contradictions with the lesson draft text. The video does not introduce claims, examples, or framing absent from the draft.

## Side-Effect Ledger

```
New claims introduced: (none)
Claims removed: (none)
Neighboring lesson references changed: (none)
Prework references used: All four prework modules named by shorthand + quiz
Prework concepts repeated intentionally: (none) — modules are named, not explained
Potential duplicates: (none)
Unsupported facts: (none)
Video/text mismatches: (none)
Needs human decision:
- Whether to archive or remove the older video-welcome.md now that p1-welcome.md exists
- Quiz availability at recording time (already in setup checklist)
```

## Acceptance Checklist

- [x] Spec compliance blockers resolved — no blockers found
- [x] Unsupported factual claims resolved or removed — no factual claims in video
- [x] Neighboring lesson drift resolved — no drift detected
- [ ] Editorial polish accepted — "Tooling" shorthand could be slightly more precise (Minor)
- [ ] Quiz fallback instruction added to prompter text (Minor)
- [x] Video scenario aligned with draft and schema
