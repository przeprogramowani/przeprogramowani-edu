# RC Review: m1-l3 / p1-permission-prompts — Trzy decyzje w trakcie biegu

**Reviewed:** 2026-05-11
**Artifact reviewed:** `workbench/lessons/m1-l3/videos/p1-permission-prompts.md` (recording brief)
**Cross-referenced against:** `video-permission-prompts.md` (canonical video scenario), `lesson-draft.md`, `lesson-spec.md`, `lesson-grounding.md`, `lessons-schema.json` (m1-l3 entry + videoPlaceholders + owns), neighboring lessons (m1-l2, m1-l4), `prework.md`, `style.md`, `rc-review.md` (existing draft-level review)
**Verdict:** Ready with minor fixes

---

## Relationship to canonical scenario

`p1-permission-prompts.md` is a condensed recording brief -- a practical shoot plan for the same content that `video-permission-prompts.md` covers as a full scenario with segment structure, mosty do tekstu, pre-production TODO, and mismatch analysis. The brief is tighter, more action-oriented, and adds a recording-day summary table ("Podsumowanie dnia") that positions this video as 5th of 5 in a day's shoot. The canonical scenario already passed review in the full RC review (2026-05-10). This review focuses on whether the brief introduces drift, contradictions, or gaps relative to the canonical scenario, spec, and draft.

---

## Findings

### Minor: "Opcja druga" framing simplifies three-option UX to a number

- Evidence: Segment 2 (line 14): "Opcja druga -- Yes, don't ask again." The Claude Code permission prompt has three labeled options, not numbered options. The canonical scenario (video-permission-prompts.md, Segment 2, lines 66-72) correctly reproduces the three textual options. The brief reduces this to "opcja 2", which matches the current Claude Code UI (options are numbered [1], [2], [3]), but differs from the canonical scenario's fuller presentation.
- Why it matters: Low risk. The brief is a shoot guide, not learner-facing text. The actual permission prompt in Claude Code does show numbered options, so "opcja 2" is correct for recording instructions.
- Required fix: None -- acceptable shorthand for a recording brief. If the brief is ever repurposed as learner-facing material, expand to match the canonical scenario.

### Minor: MUST-SAY about Write/Edit being "domyslnie dozwolone" may be inaccurate depending on permission mode

- Evidence: Segment 3 (line 76): "Write i Edit to wbudowane narzedzia -- domyslnie dozwolone w katalogu roboczym. Bash komendy -- nie." The grounding source (Claude Code permissions docs, permission-modes docs) confirms that in `default` mode, Write and Edit *do* require approval. Only in `acceptEdits` mode are file edits auto-approved. The canonical scenario (video-permission-prompts.md, Segment 3, lines 96-104) handles this correctly with two fallback paths: one where Write/Edit prompt, one where they do not.
- Why it matters: If the recording starts in `default` mode (which is the expected state after resetting settings.json), Write/Edit *will* prompt. The MUST-SAY as written would be factually incorrect during the recording.
- Required fix: Soften the MUST-SAY to match the canonical scenario's fallback logic: "Jesli Write/Edit nie pytaja -- to dlatego, ze harness w trybie default dopuszcza je w katalogu roboczym. Jesli pytaja -- filtr jest ten sam: co to moze popsuc poza repo? Nic." Alternatively, add a conditional: "Jesli harness pyta o Write/Edit -- komentuj filtrem. Jesli nie pyta -- wyjasnij, dlaczego."
- Source check: Claude Code permissions docs (code.claude.com/docs/en/permissions): "In default mode, Claude asks permission before file modifications." Permission-modes docs: "acceptEdits auto-approves file edits and common filesystem Bash commands."

### Minor: Deny rule example `Bash(git push *)` commentary could be stronger

- Evidence: Segment 5 (lines 103-106): "Bash(git push *) -- push to decyzja publikacyjna. Nie deleguje jej bez swiadomego potwierdzenia." The existing draft-level RC review (S2-4) flagged that `Bash(git *)` in allow also passes destructive local git operations (git reset --hard, git clean -fd). The brief's deny rules cover only `rm -rf` and `git push`. The brief does not mention this nuance.
- Why it matters: Low risk for the brief itself (shoot instructions), but the recording will produce material that learners watch. If the prowadzacy explains the policy as complete without noting the local-destructive gap, it may give a false sense of safety.
- Required fix: Optional. Consider adding one line to the MUST-SAY in Segment 5: "Bash(git *) dopuszcza tez operacje lokalne jak git reset --hard -- swiadomie, bo reflog pozwala cofnac. Jesli wolisz wieksza kontrole, zawez do git status, git add, git commit, git diff."

### Minor: Missing explicit reference to deny-ask-allow evaluation order

- Evidence: The brief's Segment 5 (lines 111-121) shows the docelowy settings.json and the filter heuristic ("Nic -- allow. Potencjalnie wszystko -- deny. Nie wiem -- zostaw.") but does not include a MUST-SAY about evaluation order (deny -> ask -> allow). The canonical scenario (Segment 5, lines 148-157) also does not include this, but the draft (lines 167-177) explicitly teaches it. The schema requiredFragments entry demands: "kolejnosc ewaluacji deny -> ask -> allow".
- Why it matters: If the recording brief is the shoot guide, the prowadzacy may omit this key claim. The learner would see the video without understanding why `Bash(git push *)` in deny overrides `Bash(git *)` in allow.
- Required fix: Add a one-line MUST-SAY to Segment 5: "Kolejnosc ewaluacji: deny sprawdzane pierwsze, potem ask, potem allow. Pierwszy pasujacy wygrywa. Dlatego git push w deny ma priorytet nad git * w allow."

### Minor: "Podsumowanie dnia" table lists 5 videos not present in the canonical video set

- Evidence: Lines 161-173 list five videos for a full recording day: welcome, lesson-intro, shape-session, skill-vs-prompt, permission-prompts. Only three of these have canonical video scenarios in the m1-l3 videos/ directory (video-delegate-to-cli.md, video-permission-prompts.md, video-verification-report.md). The "welcome", "lesson-intro", and "shape-session" appear to be from m1-l1, and "skill-vs-prompt" from m1-l2. This recording-day plan spans multiple lessons.
- Why it matters: The table is a production logistics artifact, not a content artifact. It is useful context for the recording crew but could create confusion if read as an m1-l3 content plan.
- Required fix: None required -- the table is clearly labeled "Podsumowanie dnia" and lists lesson attribution in the video names (m1-l1 welcome, m1-l2 skill-vs-prompt). No action needed unless the brief is reorganized.

### Note: Segment 6 bridge to verification.md is well-aligned

- Evidence: Lines 152-155: "Za chwile w tekscie lekcji zobaczysz verification.md -- raport, ktory bootstrapper zostawil obok scaffoldu. Trzecia bramka -- post-execution." This matches the canonical scenario's Segment 6 (lines 178-180) and the draft's bridge to verification.md.
- Why it matters: Good alignment -- no drift.

### Note: "NIE RESETUJ po nagraniu" instruction is critical and well-placed

- Evidence: Lines 157-159: "KRYTYCZNE: NIE RESETUJ po nagraniu! verification.md z tego biegu jest potrzebny do video-verification-report." This matches the canonical scenario's pre-production TODO (lines 200-203) and video-verification-report.md's assumptions (lines 9, 17).
- Why it matters: Production continuity. Well-handled.

---

## Spec Compliance

- Thesis: Pass. The brief demonstrates in-execution gate (permission prompts) and operational policy -- core thesis territory.
- Learning outcomes: Pass. The brief covers: configuring minimal permission policy (LO3), filter "co ten wzorzec moze popsuc poza moim repo" (LO3), reading agent behavior as three gates (LO4), understanding deny-ask-allow evaluation (LO3, though the brief does not explicitly MUST-SAY the evaluation order -- see finding above).
- Behavioral change: Pass. After watching, the learner has a concrete settings.json to copy and a filter to apply.
- Required example/demo: Pass. The brief uses 10xCards with bootstrapper, matching the spec's required demo.
- Failure mode: Partial. The brief does not explicitly name the failure modes (approve-everything Stockholm, YOLO without conditions) -- but the canonical video scenario also does not. These are covered in the draft's Deep Dive, not in the video. Acceptable division.
- Bridge in/out: Pass. Bridge in (lines 42-47) references prd.md and tech-stack.md from previous lessons. Bridge out (lines 146-155) references m1-l4 and verification.md.

## Grounding And External Checks

- Verified claims:
  - Permission prompt UI with three options (Yes / Yes don't ask again / No): Confirmed in Claude Code permissions docs. The brief's "opcja 2" shorthand is valid.
  - Deny rules (Bash(rm -rf *), Bash(git push *)): Confirmed in Claude Code permissions docs as standard patterns.
  - Write/Edit as built-in tools: Confirmed, but the "domyslnie dozwolone" characterization needs the mode qualifier (see finding above).
  - Bootstrapper not doing git init: Confirmed in bootstrapper SKILL.md.
- Unsupported or softened claims:
  - (none -- the brief is operationally focused, not claim-heavy)
- Open verification:
  - Exact permission prompt text depends on Claude Code version at recording time -- dry run is specified in setup checklist (line 21).

## Curriculum Continuity

- Previous lesson fit: Clean. References prd.md (m1-l1) and tech-stack.md (m1-l2) as file artifacts on disk.
- Next lesson setup: Clean. Bridge to m1-l4 ("agent nie zna twoich konwencji") matches m1-l4's owns (AGENTS.md, custom instructions, onboarding). Bridge to verification.md correctly sets up video-verification-report.
- Potential duplicates: None. The brief stays within in-execution gate territory and does not touch AGENTS.md, hooks, MCP, or CI/CD.
- Scope theft risk: None. No concepts from m1-l4 or m1-l5 are introduced.

## Editorial Quality

- Style guide fit: Not directly applicable -- this is a recording brief, not learner-facing prose. The MUST-SAY scripts are in appropriate conversational Polish for voiceover.
- AI-sounding patterns: None detected. The brief is crisp and action-oriented.
- Polish/prose issues: The brief uses ASCII-only Polish (no diacritics) consistently, which is intentional for a production document.

## Diagram Quality

- Diagrams present: none
- Placement: N/A
- Missing opportunities: None -- recording briefs do not typically include diagrams. The visual content is the live terminal capture itself.
- Decorative or redundant: N/A
- Syntax/rendering: N/A

## Video Alignment

The brief is well-aligned with the canonical scenario (video-permission-prompts.md). Key correspondences:

| Brief segment | Canonical segment | Alignment |
|---|---|---|
| Segment 1 (stan wyjsciowy) | Segment 1 | Match |
| Segment 2 (pierwszy prompt) | Segment 2 | Match (brief is shorter) |
| Segment 3 (kolejne prompty) | Segment 3 | Match (brief collapses two fallback paths into MUST-SAYs) |
| Segment 4 (settings.json po biegu) | Segment 4 | Match |
| Segment 5 (edycja deny rules) | Segment 5 | Match (brief slightly shorter, missing evaluation order) |
| Segment 6 (zamkniecie) | Segment 6 | Match |

No contradictions between the brief and the canonical scenario. The brief is a condensation, not a deviation.

The brief's docelowy settings.json (lines 126-132) correctly omits the `"defaultMode": "default"` key that was flagged as a blocker in the draft-level RC review (S1-1). This means the video will show the corrected version:
```json
{
  "permissions": {
    "allow": ["Bash(npm *)", "Bash(git *)", "Read", "Edit", "Write"],
    "deny": ["Bash(rm -rf *)", "Bash(git push *)"]
  }
}
```

The draft still has the incorrect `"defaultMode": "default"` in its example (draft line 155). The video recording will produce correct output, but the draft needs the fix independently.

Draft VIDEO PLACEHOLDER (line 198) still mentions `git init` prompt -- the brief correctly omits it. No mismatch between brief and canonical scenario; the mismatch is between the draft and both video artifacts. Already flagged in the draft-level RC review (S2-1).

## Side-Effect Ledger

New claims introduced:
(none -- the brief operationalizes claims from the draft and canonical scenario)

Claims removed:
(none)

Neighboring lesson references changed:
(none)

Prework references used:
(none directly -- the brief assumes the learner has read the draft)

Prework concepts repeated intentionally:
(none)

Potential duplicates:
(none)

Unsupported facts:
(none)

Video/text mismatches:
- Write/Edit "domyslnie dozwolone" characterization in brief Segment 3 may not match recording reality in default mode (see finding above)
- Draft line 198 VIDEO PLACEHOLDER mentions git init prompt -- brief correctly omits it (pre-existing mismatch in draft, not introduced by brief)
- Draft line 155 includes `"defaultMode": "default"` -- brief's docelowy JSON correctly omits it (pre-existing mismatch in draft)

Needs human decision:
- Whether to add deny-ask-allow evaluation order as a MUST-SAY in Segment 5 (recommended: yes)
- Whether to soften the Write/Edit "domyslnie dozwolone" MUST-SAY to handle both permission modes (recommended: yes)

## Acceptance Checklist

- [x] Spec compliance blockers resolved (no blockers found)
- [x] Unsupported factual claims resolved or removed (no unsupported claims)
- [x] Neighboring lesson drift resolved (no drift)
- [x] Editorial polish accepted (recording brief, not learner-facing)
- [x] Video scenario aligned (well-aligned with canonical scenario; minor fixes recommended)
- [ ] Write/Edit "domyslnie dozwolone" MUST-SAY adjusted for default mode behavior
- [ ] Deny-ask-allow evaluation order added as MUST-SAY in Segment 5
