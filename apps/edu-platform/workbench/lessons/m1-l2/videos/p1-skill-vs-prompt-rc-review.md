# RC Review: m1-l2 / p1-skill-vs-prompt — Ad-hoc prompt vs skill (production brief)

## Verdict

Ready with minor fixes

## Context

**Reviewed:** 2026-05-11
**Artifact reviewed:** `workbench/lessons/m1-l2/videos/p1-skill-vs-prompt.md` (production brief, P1 format)
**Cross-referenced against:** lesson-spec.md, lesson-draft.md, lesson-grounding.md, video-skill-vs-prompt.md (full scenario), video-skill-creator.md, video-stack-assess.md, lessons-schema.json (m1-l2, m1-l1, m1-l3), prework.md, style.md
**External verification:** No new external claims introduced; all claims trace to draft and grounding
**Relationship to full scenario:** `p1-skill-vs-prompt.md` is a concise production brief (recording run-of-show). `video-skill-vs-prompt.md` is the full editorial scenario with pedagogical rationale, `Most do tekstu` links, and detailed segment structure. The P1 brief condenses the 5-segment structure into a leaner shooting script.

## Findings

### Minor: Segment 4 says "Dlaczego skill to zrobil, a prompt nie?" but the SKILL.md walkthrough omits `allowed-tools`

- Evidence: P1 brief Segment 4 walks through three SKILL.md sections: (1) Description, (2) Workflow, (3) References/. The full scenario (video-skill-vs-prompt.md, Segment 4) and the draft (line 225) both include `allowed-tools` as a key element of the anatomy walkthrough. The P1 brief does not mention it.
- Why it matters: `allowed-tools` is the runtime permission contract — one of the structural properties that distinguishes a skill from a prompt (spec: "kontrakt uprawnień"). Omitting it from the recording brief means the presenter may skip it on camera, losing a teaching moment the draft and full scenario both depend on.
- Required fix: Add `allowed-tools` as a fourth talking point in Segment 4, either between Description and Workflow or after Workflow. One line is enough: `4. **Allowed-tools** — "Lista narzedzi, ktore skill moze uzyc. Jawny kontrakt uprawnien — prompt tego nie ma."`
- Source check: lesson-draft.md line 225; video-skill-vs-prompt.md Segment 4 bullet on `allowed-tools`; spec Owned Concepts ("anatomia: SKILL.md, references/, scripts/, assets/").

### Minor: Segment 5 closing bridge references `skill-creator` without naming the video

- Evidence: P1 brief Segment 5 closing says: "Za chwile zobaczycie, jak skill-creator pomaga zarysowac szkielet nowego skilla, a potem jak /10x-stack-assess ocenia istniejacy projekt." The companion videos are `video-skill-creator.md` and `video-stack-assess.md`. The full scenario (video-skill-vs-prompt.md, Segment 5) uses the same bridge but adds context ("meta-skill `skill-creator`"). In the P1 brief, the reference is adequate but could cause confusion because the brief calls it `skill-creator` while the schema and spec call it `/10x-skill-creator` in some places (grounding open verification decision: "10x-toolkit will ship 10x-skill-creator").
- Why it matters: Low risk. The presenter knows which video comes next. But if the shipped skill is named `/10x-skill-creator` (per the grounding decision), the spoken bridge should use that name for consistency with what the learner will see in the CLI.
- Required fix: Verify the final shipped name. If `/10x-skill-creator`, update the bridge line to match. If the upstream `skill-creator` name is used on camera, ensure the draft and video-skill-creator.md are aligned.
- Source check: lesson-grounding.md Open Verification decision ("10x-toolkit will ship 10x-skill-creator"); video-skill-creator.md.

### Minor: Missing dry-run confirmation for the fallback scenario

- Evidence: P1 brief Setup checklist includes "Dry run skilla — potwierdzic standard path + frontmatter output." The full scenario (video-skill-vs-prompt.md, Pre-production TODO) has a more detailed fallback plan: "kopia zapasowa tech-stack.md w osobnym katalogu", "git stash lub git checkout", "przygotowany timing: jesli skill nie konczy sie w ~3 minuty, przejscie na fallback." The P1 brief has a fallback note in Segment 3 (">3 min -> podmien na przygotowany tech-stack.md") but the Setup checklist stores the backup at `/tmp/10xCards-fallback/` without specifying what the file should contain.
- Why it matters: If the fallback `tech-stack.md` has `path_taken: custom` instead of `path_taken: standard`, the on-screen frontmatter will contradict the MUST-SAY about "standardowa sciezka". The full scenario recommends "identyczny z standard path" — the P1 brief should carry this constraint.
- Required fix: Add to Setup: "Kopia tech-stack.md w fallback musi miec `path_taken: standard` i `bootstrapper_confidence: first-class` — identyczna z oczekiwanym wynikiem standard path."
- Source check: video-skill-vs-prompt.md Needs human decision ("Rekomendacja: identyczny z standard path dla spojnosci").

### Minor: "Kolejnosc nagrania: 4 z 5" but only 3 video files exist for the lesson

- Evidence: The P1 brief header says "Kolejnosc nagrania: 4 z 5". The lesson's `videos/` directory contains 3 video scenarios: `video-skill-vs-prompt.md` (full), `video-skill-creator.md`, `video-stack-assess.md`, plus this P1 brief. The schema `videoPlaceholders` lists 5 placeholders (including welcome and optional stack-assess), but only 3 full scenario files exist.
- Why it matters: The "4 z 5" numbering suggests a 5th video exists in the recording plan that has no matching scenario file. If the 5th video is the welcome/intro (placeholder 1 in schema), it either needs a scenario file or the numbering should be "3 z 4" (if welcome is not a separate recording). If the 5th is something else, it's unclear what.
- Required fix: Either (a) clarify what video 5 is and confirm it has a scenario, or (b) adjust the numbering to match the actual recording plan. This is a production logistics note, not a content blocker.
- Source check: lessons-schema.json videoPlaceholders (5 entries); videos/ directory listing (3 scenario files + 1 P1 brief).

### Note: Segment 4 contrast bullets differ slightly from full scenario wording

- Evidence: P1 brief Segment 4 has three contrast bullets. The full scenario (video-skill-vs-prompt.md, Segment 4) has the same three but with slightly different wording. For example:
  - P1: "Prompt nie wiedzial, ze powinien sprawdzic bramki agent-friendly — bo nikt mu o nich nie powiedzial. Skill ma to w references."
  - Full: "Prompt nie wiedzial, ze powinien sprawdzic bramki agent-friendly — bo nikt mu o nich nie powiedzial. Skill ma to wbudowane w references/agent-friendly-criteria.md."
  The full scenario names the specific file; the P1 brief is vaguer.
- Why it matters: Minimal. The P1 brief is a shooting script, not learner-facing prose. The presenter has the full scenario as reference. But if the P1 brief is the *only* document on the teleprompter/monitor, the more specific file name helps the presenter point at the right thing on screen.
- Required fix: Not required. Optional: add the file name for the presenter's reference.
- Source check: video-skill-vs-prompt.md Segment 4; lesson-draft.md line 228.

### Note: P1 brief uses ASCII-only Polish (no diacritics) throughout

- Evidence: All Polish text in the P1 brief uses ASCII approximations: "potwierdzic" instead of "potwierdzic", "lancucha" instead of "lancucha", "roznic" instead of "roznic", etc. This is consistent throughout the file.
- Why it matters: No impact on recording quality — the brief is a prompter for the presenter, who speaks natural Polish. However, if the file is ever shown on screen or referenced in editorial review, the lack of diacritics could cause confusion. The full scenario (video-skill-vs-prompt.md) uses proper Polish diacritics.
- Required fix: Not required. This appears to be an intentional choice for the P1 brief format (keyboard convenience during rapid authoring). If the brief is ever shown to learners, add diacritics.
- Source check: style.md does not prescribe diacritics for internal production briefs.

## Spec Compliance

- Thesis: **pass** — the brief operationalizes the core thesis ("zamieniamy jednorazowe prompty na skille") through the before/after demo structure.
- Learning outcomes: **pass** — the brief covers LO1 (reading SKILL.md anatomy), LO3 (running /10x-tech-stack-selector), and LO5 (recognizing prompt vs skill situations) directly. LO2 (installing a skill) and LO4 (metaprompting) are covered by the companion videos.
- Behavioral change: **pass** — the before/after structure directly demonstrates the shift from hand-writing prompts to using skills.
- Required example/demo: **pass** — 10xCards PRD before/after is the central demo. Matches spec Required Example point 1-3.
- Failure mode: **pass** — Segment 1 shows the failure mode (ad-hoc prompt produces no artifact), Segment 5 states the decision rule.
- Bridge in/out: **pass** — bridge in from PRD (m1-l1) is implicit in setup. Bridge out to skill-creator and stack-assess videos is explicit in Segment 5. Bridge to lesson text ("W tekscie lekcji znajdziecie picker z piecioma scenariuszami") connects video to draft.

## Grounding And External Checks

- Verified claims:
  - `starter_id`, `bootstrapper_confidence`, `path_taken`, `has_auth`, `has_ai` frontmatter fields in Segment 3 and Segment 5 table match the documented hand-off schema (grounding source: `/10x-tech-stack-selector` source, 10xCards artifacts).
  - "Te pliki laduja sie dopiero wtedy, kiedy agent ich potrzebuje" (Segment 4 on references/) — confirmed by Anthropic Agent Skills overview: Level 3 resources load as needed.
  - "Gdyby lezaly w glownym SKILL.md, kazdy skill zjadlby dwadziescia tysiecy tokenow zamiast pieciu" — directionally correct. Anthropic docs: SKILL.md body ~5k tokens; references load on demand with no cap. The "20k vs 5k" ratio is illustrative and safe.
- Unsupported or softened claims:
  - (none — the brief introduces no claims beyond the draft)
- Open verification:
  - The name `skill-creator` vs `/10x-skill-creator` needs resolution before recording (see Minor finding above).

## Curriculum Continuity

- Previous lesson fit: **pass** — brief assumes PRD from m1-l1 exists on disk. No m1-l1 content is repeated.
- Next lesson setup: **pass** — Segment 5 MUST-SAY mentions `bootstrapper` in next lesson. Bridge to companion videos (skill-creator, stack-assess) is clean.
- Potential duplicates: **none** — the P1 brief is a strict subset of the full scenario (video-skill-vs-prompt.md) with production annotations. No content divergence.
- Scope theft risk: **none** — the brief explicitly avoids bootstrap (m1-l3), AGENTS.md (m1-l4), and MCP (m1-l5). "NIE otwieraj starter-registry.yaml — za duzo na ekran, kradnie scope" is a good guardrail.

## Editorial Quality

- Style guide fit: **n/a** — P1 briefs are production documents, not learner-facing prose. The MUST-SAY quotes are in natural spoken Polish (appropriate for recording prompts).
- AI-sounding patterns: **none detected** — the brief reads as a concise human-authored shooting script.
- Polish/prose issues: **pass** — ASCII-only diacritics noted above but not blocking for a production brief.

## Diagram Quality

- Diagrams present: 1 (Segment 5 comparison table, formatted as markdown table)
- Placement: appropriate — the table is the closing recap, matching the full scenario's Segment 5 design.
- Missing opportunities: none for a production brief. The full scenario and draft carry the mermaid diagrams.
- Decorative or redundant: none.
- Syntax/rendering: the table renders correctly in standard markdown.

## Video Alignment

**Pass with notes.** The P1 brief is structurally aligned with the full scenario (video-skill-vs-prompt.md): same 5 segments, same arc (ad-hoc prompt -> tranzycja -> skill run -> SKILL.md anatomy -> recap). Key differences:

- P1 brief omits `allowed-tools` from Segment 4 (Minor finding).
- P1 brief is more compact: Segment 2 is reduced to 4 lines (vs full scenario's dedicated segment with screen setup instructions).
- P1 brief includes MUST-SAY markers that the full scenario writes as narrative text — this is correct for a shooting script.
- P1 brief adds "Kolejnosc nagrania: 4 z 5" metadata absent from the full scenario.

No contradictions between P1 brief and draft. The brief's Segment 5 closing matches the draft's prompt-or-skill picker reference and the lesson's bridge-out to m1-l3.

## Side-Effect Ledger

New claims introduced:
(none — the P1 brief introduces no claims beyond the draft and full scenario)

Claims removed:
(none)

Neighboring lesson references changed:
(none)

Prework references used:
(none directly — the brief assumes prework knowledge via the full scenario and draft)

Prework concepts repeated intentionally:
(none)

Potential duplicates:
(none)

Unsupported facts:
(none)

Video/text mismatches:
- P1 brief omits `allowed-tools` from SKILL.md walkthrough; draft and full scenario include it (Minor)

Needs human decision:
- Resolve `skill-creator` vs `/10x-skill-creator` naming before recording
- Clarify "4 z 5" recording order — what is video 5?
- Confirm fallback `tech-stack.md` must use `path_taken: standard` (recommended by full scenario)

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [x] Unsupported factual claims resolved or removed
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted (production brief standard)
- [x] Video scenario aligned with draft
- [ ] Add `allowed-tools` to Segment 4 walkthrough (Minor — not blocking)
- [ ] Resolve `skill-creator` vs `/10x-skill-creator` naming (Minor — needed before recording)
- [ ] Clarify "4 z 5" recording order (Minor — production logistics)
- [ ] Specify fallback file constraints in Setup checklist (Minor — not blocking)
