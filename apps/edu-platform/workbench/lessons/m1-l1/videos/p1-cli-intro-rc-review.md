# RC Review: m1-l1 / p1-cli-intro — Pierwsze uruchomienie 10x-cli

## Verdict

**Ready with minor fixes**

No blockers. Two Minor findings (missing tool-path mention, missing `npx skills add` decision). Three Notes. The brief is production-viable: commands are grounded, scope is respected, MUST-SAY phrases match the lesson draft, and fallback coverage is solid.

## Findings

### Minor: Video shows only `.claude/skills/` without mentioning other tool paths

- Evidence: Segment 4 prompter text and the dry-run checklist reference `.claude/skills/` exclusively. The lesson draft (line 83) explicitly states: "Dla Claude Code lądują w `.claude/skills/`, dla Cursora w `.cursor/skills/`, dla Copilota w `.github/skills/`." The content-delivery reference (`workbench/references/10x-content-delivery.md`) confirms these tool-specific paths.
- Why it matters: Learners using Cursor or Copilot will see a different path after running `get m1l1`. Without a one-sentence mention, they may think the command failed or files landed in the wrong place. The demo itself will show Claude Code paths — that is expected — but the voiceover should acknowledge other tools exist.
- Required fix: Add a bracketed production note in segment 4, after `[pokaż: 10x-shape/ i 10x-prd/]`, e.g.: `[wspomnij: jeśli używasz Cursora lub Copilota — ścieżka będzie inna, np. .cursor/skills/ lub .github/skills/. CLI dostosowuje się automatycznie.]`
- Source check: `workbench/references/10x-content-delivery.md` line 57-59; lesson-draft.md line 83.

### Minor: Brief does not address whether to mention `npx skills add przeprogramowani/10x-cli`

- Evidence: The lesson draft (lines 91-101) describes CLI utility skills (`setup` and `guide`) installed via `npx skills add przeprogramowani/10x-cli`. The video brief covers `--help`, `auth`, `get m1l1`, `ls`, and `head` but does not mention utility skills at all — not even as a conscious omission note.
- Why it matters: The lesson draft treats utility skills as part of "Minimalne uruchomienie" (lines 91-103), though with "opcjonalnie" qualifier. The video brief should explicitly decide: mention or skip. Without a note, a future editor might add it thinking it was accidentally left out, expanding the video past the 5-7 minute target.
- Required fix: Add a one-line production note at the end of segment 5 or in the setup section, e.g.: `Uwaga: npx skills add przeprogramowani/10x-cli (skille pomocnicze CLI) celowo pominięte w tym nagraniu — opcjonalne, opisane w tekście lekcji.`
- Source check: lesson-draft.md lines 91-103; lesson-spec.md Owned Concepts "Minimalne uruchomienie."

### Note: Project directory `~/projects/my-10x-project/` differs from shape-session's `~/projects/10xcards/`

- Evidence: p1-cli-intro setup: `~/projects/my-10x-project/` (generic). p1-shape-session setup: `~/projects/10xcards/` (specific). The lesson's canonical example is 10xCards (per spec, draft, and all other briefs).
- Why it matters: If the learner watches videos in sequence, the directory name changes between videos. Since the CLI brief is in a separate session ("osobna"), this is acceptable — but production should decide whether to align directory names for visual continuity.
- Required fix: None required. Optional: change to `~/projects/10xcards/` (lub podobny) for visual continuity with shape-session.
- Source check: p1-shape-session.md line 15.

### Note: "Kolejnosc nagrania: niezalezna" doesn't participate in the X/5 count used by other briefs

- Evidence: p1-welcome: "1 z 5", p1-lesson-intro: "2 z 5", p1-shape-session: "3 z 5". p1-cli-intro: "niezalezna". The schema lists five `videoPlaceholders`, and the shape-session RC review (Note) interprets the count as including all five. If the CLI intro is one of the five, its position should be reflected. If it is a sixth independent recording, the "5" in other briefs is correct but this video falls outside the production schedule.
- Why it matters: Production planning. The brief's "osobna" session design is intentional and correct — CLI may need re-recording independently. But the production team needs clarity on total recording count.
- Required fix: None required. Consider adding a parenthetical: "niezalezna — osobne nagranie poza sesja 1-3 (4 z 5 w kolejce publikacji)" or similar, if production count matters.
- Source check: Schema `videoPlaceholders` for m1-l1; other P1 briefs.

### Note: `auth --logout` flag in setup/reset is not documented in content-delivery reference

- Evidence: Setup checklist (line 17) and Reset section (line 125) use `npx @przeprogramowani/10x-cli@latest auth --logout`. The content-delivery reference (`workbench/references/10x-content-delivery.md`) lists `auth` but does not document `--logout`. This is a production/setup command, not learner-facing, so it doesn't need grounding — but the presenter should verify it works during dry run.
- Why it matters: If the flag doesn't exist, the presenter needs an alternative (manual token deletion). The dry-run checklist already covers this implicitly.
- Required fix: None required. The dry run will catch any issue. This is noted for awareness.
- Source check: `workbench/references/10x-content-delivery.md`.

## Spec Compliance

- **Thesis**: Pass — the brief operationalizes the spec's "minimalne uruchomienie" requirement without touching deeper toolkit concepts.
- **Learning outcomes**: Pass (partial, expected) — the brief supports learning outcome 1 ("Kursant potrafi uruchomić skill /10x-shape w 10xCLI") by showing the prerequisite setup. Full outcome coverage belongs to the shape-session and lesson text.
- **Behavioral change**: N/A — CLI intro is a prerequisite step, not a behavioral-change driver. The behavioral change ("odruchowo uruchamia `/10x-shape`") is driven by the shape-session video and lesson prose.
- **Required example/demo**: Pass — the brief demonstrates the exact CLI commands specified in the spec's "Minimalne uruchomienie" (line 97): `npx @przeprogramowani/10x-cli@latest` + `auth` + `get m1l1`.
- **Failure mode**: N/A — no failure modes apply to the CLI intro. CLI troubleshooting belongs to m1-l2 toolkit deep-dive.
- **Bridge in/out**: Pass — bridge in is implicit (first lesson, CLI not referenced before). Bridge out (segment 5) correctly points to m1-l2 for toolkit deep-dive and to the shape-session for the next practical step ("Za chwilę uruchomimy /10x-shape" in segment 4).

## Grounding And External Checks

- Verified claims:
  - `npx @przeprogramowani/10x-cli@latest auth` — correct per content-delivery reference (line 22).
  - `npx @przeprogramowani/10x-cli@latest get m1l1` — correct per content-delivery reference (line 29).
  - Skills land in `.claude/skills/<name>/SKILL.md` — correct per content-delivery reference (line 57).
  - Re-running `get` is idempotent — confirmed by content-delivery reference (lines 129-134): "Re-running `10x get <ref>` is safe."
  - `@latest` guarantees latest version without manual updates — confirmed by content-delivery reference (line 18).
  - m1l1 delivers `/10x-shape` and `/10x-prd` — confirmed by lesson-draft (line 83) and schema `requiredFragments`.

- Unsupported or softened claims:
  - (none) — the brief makes no factual claims beyond grounded CLI behavior.

- Open verification:
  - `auth --logout` flag existence — production dry-run will verify (see Note above).

## Curriculum Continuity

- **Previous lesson fit**: N/A — first lesson, no predecessor. Prework is not referenced in this video, which is correct for a tool-setup demo.
- **Next lesson setup**: Pass — segment 5 correctly defers toolkit deep-dive to m1-l2. Segment 4 connects forward to the shape-session video ("Za chwilę uruchomimy /10x-shape").
- **Potential duplicates**: The brief overlaps with lesson-draft lines 63-103 ("Minimalne uruchomienie") by design — the video is the visual version of the written setup guide. No duplication with m1-l2 content.
- **Scope theft risk**: None. The brief explicitly avoids `--tool` flag details, preset configuration, `list` command, `doctor` command, and utility skills — all correctly deferred to m1-l2.

## Editorial Quality

- **Style guide fit**: The prompter text uses direct address ("twój email", "nie powtarzasz go"), short punchy sentences, and casual pauses via line breaks. Matches style.md tone rules for spoken content.
- **AI-sounding patterns**: None detected. The prompter text reads as natural developer-to-developer explanation.
- **Polish/prose issues**: Post editor-pl pass — "zaudytować" corrected to "sprawdzić", "Na teraz" corrected to "Na razie". Production notes use ASCII-only Polish (no diacritics), consistent with other P1 briefs. Prompter text uses diacritics, also consistent.

## Diagram Quality

- Diagrams present: None — live demo brief, no diagrams expected.
- Placement: N/A.
- Missing opportunities: None for a CLI walkthrough video. The lesson draft has a mermaid pipeline diagram that covers the conceptual flow; this video covers the mechanical steps.
- Decorative or redundant: N/A.
- Syntax/rendering: N/A.

## Video Alignment

**Pass.** The p1-cli-intro brief aligns with:

- The lesson-draft VIDEO PLACEHOLDER (line 65): "osobne wideo o 10x-cli — `npx @przeprogramowani/10x-cli@latest auth`, `get m1l1`, przegląd tego co wylądowało na dysku" — all three elements covered in segments 2, 3, and 4.
- The lesson-draft's "Minimalne uruchomienie" section (lines 63-103) — commands, idempotency claim, @latest reasoning, and m1-l2 deferral all match.
- The p1-shape-session brief (line 57): "Auth i get m1l1 mam za sobą — przez npx @latest" — assumes CLI intro already completed, consistent handoff.
- No contradictions with the lesson draft text. The brief introduces no claims absent from the draft.

MUST-SAY phrase alignment with lesson draft:

| MUST-SAY | Draft source | Match |
|----------|-------------|-------|
| "npx z @latest — zawsze najnowsza wersja, zero globalnej instalacji." | Draft line 67 + line 89 | Yes |
| "Bez get komendy z tej lekcji nie zadziałają. Każda lekcja zaczyna się od get." | Draft line 89 | Yes |
| "Skille to pliki markdown na dysku — nie magia w chmurze." | Draft lines 81-82 (similar framing) | Yes |
| "Deep dive na toolkit jest w m1-l2. Na razie — auth, get, gotowe." | Draft line 103 | Yes |

## Side-Effect Ledger

```
New claims introduced:
(none)

Claims removed:
(none)

Neighboring lesson references changed:
(none)

Prework references used:
(none — CLI video has no prework content, which is correct)

Prework concepts repeated intentionally:
(none)

Potential duplicates:
- p1-cli-intro.md and lesson-draft.md "Minimalne uruchomienie" section cover the same setup flow — by design (video is the visual version of the written guide). No action needed.

Unsupported facts:
(none)

Video/text mismatches:
(none)

Needs human decision:
(none)
```

## Acceptance Checklist

- [x] Spec compliance blockers resolved — no blockers found
- [x] Unsupported factual claims resolved or removed — no unsupported claims
- [x] Neighboring lesson drift resolved — no drift detected
- [x] Editorial polish accepted — editor-pl pass completed
- [ ] Tool-path mention added to segment 4 bracketed note (Minor fix)
- [ ] Explicit `npx skills add` omission note added (Minor fix)
- [x] Video scenario aligned with lesson draft
- [x] No scope theft from m1-l2
