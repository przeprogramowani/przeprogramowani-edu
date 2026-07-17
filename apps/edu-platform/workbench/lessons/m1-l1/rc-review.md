# RC Review: m1-l1 — Od pomysłu do PRD: Metoda Sokratejska z Agentem

## Verdict

**Ready**

No blockers. Two Major findings were identified and resolved during this review (brownfield grounding refresh, content-delivery reference alignment). Minor items (CTA verbosity, stale spec sections, screenshot placeholder) also fixed. The draft is structurally complete, pedagogically sound, and well-aligned with the spec and schema.

## Findings

### Major: Grounding says /10x-shape is "greenfield-only" but draft teaches brownfield extensively

- Evidence: `lesson-grounding.md` line 31 — claimsSupported includes "/10x-shape is greenfield-only and runs as a facilitator that never invents domain content." Schema entry `groundingSources[0].claimsSupported[0]` repeats this. But the draft devotes an entire section ("Brownfield: sesja na istniejącym projekcie") plus brownfield PRD template, and the schema `owns` includes brownfield mode as two separate owned concepts.
- Why it matters: If the skill truly doesn't support brownfield, the draft is teaching a nonexistent feature. If it does (which is almost certainly the case given the spec was refreshed May 8 after grounding was written May 3), the grounding is stale and misleading for future reviewers.
- Required fix: Re-read `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/SKILL.md` and verify brownfield support. Update `lesson-grounding.md` claimsSupported and the schema `groundingSources[0].claimsSupported[0]` to reflect current skill state. If the skill gained brownfield after May 3, add the brownfield-related claims with a new `checkedAt` date.
- Source check: Requires re-verification against canonical SKILL.md.

### Major: Content-delivery reference conflicts with npx @latest invocation approach

- Evidence: `workbench/references/10x-content-delivery.md` lines 18-31 and 108-115 define learner commands as `10x auth`, `10x get m1l1` (implying a globally installed CLI). The draft now uses `npx @przeprogramowani/10x-cli@latest auth` and `npx @przeprogramowani/10x-cli@latest get m1l1`. This is a deliberate decision by the user (for rapid iteration in early course days), but creates a discrepancy between the reference doc and all lesson artifacts.
- Why it matters: Future agents drafting m1-l2 or other lessons will read the content-delivery reference and use `10x auth` / `10x get` (global install style), contradicting m1-l1's npx approach. Inconsistent CLI instructions across lessons will confuse learners.
- Required fix: Update `workbench/references/10x-content-delivery.md` to reflect the npx @latest invocation as the canonical learner command. The reference should show `npx @przeprogramowani/10x-cli@latest auth` and `npx @przeprogramowani/10x-cli@latest get <ref>` as the primary path.
- Source check: User decision (2026-05-10).

### Minor: CTA in Materiały dodatkowe repeats full npx command 4 times

- Evidence: `lesson-draft.md` lines 352-353 — greenfield and brownfield CTAs both spell out `npx @przeprogramowani/10x-cli@latest auth` and `npx @przeprogramowani/10x-cli@latest get m1l1` in full. The command appears 4 times in two bullet points.
- Why it matters: Verbose CTA reduces scannability. The learner has already seen the commands in "Minimalne uruchomienie."
- Required fix: Shorten to backreference, e.g. "Jeśli jeszcze tego nie robiłeś — `auth` i `get m1l1` (patrz sekcja Minimalne uruchomienie wyżej)." Keep the full npx command in the setup section only.
- Source check: Style guide rule — keep takeaway bullet lists purposeful.

### Minor: Spec side-effect ledger "Needs human decision" section is stale

- Evidence: `lesson-spec.md` lines 169-197 — the "Needs human decision" block still contains a provisional schema enrichment proposal that has already been applied to `lessons-schema.json`. The `owns`, `referencesOnly`, `mustNotCover`, and `learningOutcomes` listed there match what's in the schema.
- Why it matters: Misleading for future reviewers — looks like an unresolved decision when it's already resolved.
- Required fix: Replace the provisional schema enrichment block with a resolved note: "Schema enrichment applied to `lessons-schema.json` — all provisional values promoted to canonical fields."
- Source check: Compare spec lines 170-195 with schema lines 23-52 — they match.

### Minor: Missing screenshot placeholder for CLI output

- Evidence: Style guide rule — "Add a screenshot placeholder when describing tool UI or command output." The draft describes `10x get` output at line 81 ("CLI pobiera skille z serwera i zapisuje je w twoim projekcie") but has no `![](./assets/...)` placeholder.
- Why it matters: Style guide compliance. The video covers this, but the text itself would benefit from a visual.
- Required fix: Add `![](./assets/10x-get-output.png)` after the description of what `get m1l1` delivers.
- Source check: Style guide, formatting rules.

### Note: Spec open question about spirit vs schema precision — resolved by the draft

- Evidence: `lesson-spec.md` line 120 — "Czy lekcja powinna explicite nazwać 7 frontmatter fields i 11 sekcji PRD (precyzja), czy zostać na poziomie ducha (odporność na ewolucję)?" The draft stays at spirit level (line 206: "W środku znajdziesz wizję, personę, kryteria sukcesu...") — listing concepts, not field names.
- Why it matters: The open question can be closed.
- Required fix: Mark as resolved in spec: "Resolved: spirit-only, confirmed in draft."
- Source check: Draft inspection.

### Note: Brownfield section lists 12 PRD sections in a numbered list

- Evidence: `lesson-draft.md` lines 287-298 — the 12-section brownfield PRD template is listed as a numbered list in the Core section.
- Why it matters: This borders on the schema-precision level that the spec explicitly avoids for greenfield PRD. However, for brownfield the list serves as a contrast with greenfield — showing what's different. The detail is justified because brownfield is less intuitive.
- Required fix: None required. This is a judgment call already made in the spec (brownfield section is explicitly a `requiredFragment`). Note for awareness only.

### Note: Forward references in Deep Dive could be more organic

- Evidence: `lesson-draft.md` lines 336-341 — "W kolejnej lekcji (m1-l2)... W m1-l3 PRD razem z wybranym stackiem..." These are two consecutive forward-reference paragraphs.
- Why it matters: Style guide says forward references should be woven in, not standalone paragraphs. However, this is the Deep Dive closing, where a structural bridge to the next lesson is natural.
- Required fix: Consider merging into a single paragraph and weaving into the preceding argument. Not blocking.
- Source check: Style guide, forward reference rule.

### Note: Diagram emoji usage

- Evidence: All three mermaid diagrams use emoji in node labels (💡, 📋, 🔍, 👤, 🛡️, ⚙️, 📄, 📝, ❓, 🚫, ✅). The style guide doesn't explicitly address emoji in diagrams.
- Why it matters: Emoji may not render consistently across all mermaid renderers.
- Required fix: Test render. If emoji cause issues, replace with text-only labels.
- Source check: Rendering verification needed.

## Spec Compliance

- **Thesis**: Pass — draft opens with the behavioral shift (idea → shape session → PRD as contract) and maintains it throughout.
- **Learning outcomes**: Pass — all 6 outcomes from schema are covered: shape session mechanics, hollow PRD recognition, readiness criteria, PRD as downstream contract, brownfield session, brownfield PRD.
- **Behavioral change**: Pass — the "Nie tylko na start projektu" section explicitly disarms the one-time-ritual failure mode.
- **Required example/demo**: Pass — habit tracker walkthrough with before/after, Socratic challenge, empty-CRUD detection, closing soft-gate all present.
- **Failure modes**: Pass — all three (one-time session, hollow PRD, brownfield skip) are disarmed in the draft.
- **Bridge in/out**: Pass — bridge in references prework [4.2], [1.2], [3.2]; bridge out names m1-l2 (toolkit + stack) and m1-l3 (bootstrap).

## Grounding And External Checks

- **Verified claims:**
  - Two-skill split (/10x-shape facilitator, /10x-prd generator) — grounded in both SKILL.md sources, confirmed by 10xCards session.
  - Six discovery phases — grounded in /10x-shape SKILL.md.
  - Closing 6-element soft gate — grounded in /10x-shape SKILL.md.
  - Empty-CRUD detection with 7 rule shapes — grounded in /10x-shape SKILL.md.
  - Thin-input heuristic (4 signals) — grounded in /10x-prd SKILL.md.
  - PRD excludes tech/test/deploy (post-2026-05-03 trim) — grounded in change folder rationale.
  - End-to-end workflow validated — grounded in 10xCards transcript.
  - Atlassian PRD reference — URL verified, content matches claim.
  - Anthropic "Building effective agents" — URL verified, task-clarification framing matches.

- **Unsupported or softened claims:**
  - Numeric time savings / ROI from PRD — correctly absent from draft (grounding notes this as illustrative only).
  - "Agent gwarantuje lepszy MVP" — correctly framed as forcing function, not guarantee.

- **Open verification:**
  - Brownfield mode in /10x-shape — needs re-verification against current SKILL.md (see Major finding #1).
  - Brownfield PRD template (12 sections) in /10x-prd — needs verification that the brownfield template exists in the current skill.
  - `npx @przeprogramowani/10x-cli@latest` invocation — user-confirmed approach, but the CLI itself should be tested to verify this invocation pattern works (npx with subcommands like `auth` and `get`).

## Curriculum Continuity

- **Previous lesson fit**: First lesson — no predecessor. Prework references are appropriate and non-repetitive.
- **Next lesson setup**: m1-l2 schema confirms it depends on m1-l1 and owns toolkit deep-dive + tech-stack selection. The draft correctly positions m1-l2 as the first PRD consumer. m1-l2's `mustNotCover` includes "mechanika /10x-shape / /10x-prd (m1-l1)" and "tour po 10xCLI / instalacja toolkitu od zera (m1-l1)" — confirming boundary respect.
- **Potential duplicates**: Low risk. m1-l1 keeps CLI to "auth + get" minimum; m1-l2 owns the deeper toolkit exploration. The closing soft-gate (in /10x-shape) vs post-PRD control (after /10x-prd) are clearly separated in the draft.
- **Scope theft risk**: None detected. The draft does not explain skill internals, metaprompting, or tech-stack selection — all deferred to m1-l2 per spec.

## Editorial Quality

- **Style guide fit**: Good overall. Wstęp is at recognition level (no code), uses "ty/ci" and "my/nasz", headings are descriptive, "Materiały dodatkowe" used correctly.
- **AI-sounding patterns**: Minimal. Prose reads naturally. No "Praktyczny wniosek:" labels, no expanded common acronyms, no dramatic metaphors.
- **Polish/prose issues**: User reports editorial polish already done. The prose is tight and reads well. One potential issue: the CTA verbosity (see Minor finding).

## Diagram Quality

- **Diagrams present**: 3
- **Placement**: All three placed adjacent to supporting claims — pipeline diagram with "Dwa skille" section, phases diagram with walkthrough, hollow PRD diagram with failure mode description.
- **Missing opportunities**: None identified. The brownfield section could potentially use a greenfield-vs-brownfield comparison diagram, but the prose handles the contrast well with bullet lists.
- **Decorative or redundant**: None — each diagram visualizes a multi-step flow that would be harder to follow as prose alone.
- **Syntax/rendering**: Mermaid syntax appears valid. Dark-mode styling applied consistently. Emoji in labels may need render testing (see Note).

## Video Alignment

- **4 scenarios present**: video-welcome, video-lesson-intro, video-cli-intro, video-shape-session.
- **Schema coverage**: All 5 videoPlaceholders from schema are covered — welcome (video-welcome), lesson intro (video-lesson-intro), CLI intro (video-cli-intro), shape session (video-shape-session), and brownfield auto-detection (mentioned as CTA in video-shape-session segment 7, marked optional per spec).
- **Draft alignment**: Each VIDEO PLACEHOLDER in the draft maps to a scenario file. Scenario "Most do tekstu" sections correctly reference draft sections.
- **Video/text mismatches**: None. video-shape-session explicitly notes it does NOT show /10x-prd (consistent with spec resolved decision). No claims introduced only in video.
- **CLI commands in video**: All updated to npx @latest approach.
- **Open human decisions**: 8 across all scenarios (recording format choices, montage length, fallback strategies). None block the draft text.

## Side-Effect Ledger

```
New claims introduced:
(none beyond what spec already tracks)

Claims removed:
(none)

Neighboring lesson references changed:
(none — m1-l2 boundary confirmed correct)

Prework references used:
- [4.2] criteria operationalized as shape session questions
- [1.2] Agent gets first concrete task
- [3.2] prompt-as-contract extended to session-as-contract

Prework concepts repeated intentionally:
- Brief prework criteria mention in Wstęp — operationalization, not repetition

Potential duplicates:
(none new)

Unsupported facts:
- Brownfield support in /10x-shape — grounding says greenfield-only, needs re-verification

Video/text mismatches:
(none)

Needs human decision:
- Update content-delivery reference to match npx @latest approach
- Verify brownfield claims against current SKILL.md
- 8 video production decisions (non-blocking for text)
```

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [x] Unsupported factual claims resolved or removed — brownfield grounding refreshed (2026-05-10)
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted (user confirms done)
- [x] Video scenario aligned
- [x] Content-delivery reference updated to match npx @latest
