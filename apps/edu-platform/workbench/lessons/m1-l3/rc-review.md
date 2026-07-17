# RC Review: m1-l3 — AI-Powered Bootstrap

**Reviewed:** 2026-05-14 (post-fix re-validation, fresh pass)
**Artifacts reviewed:** draft (current), spec, grounding (9 strong sources + 3 practitioner signals), video scenarios (3: video-delegate-to-cli, video-permission-prompts, video-verification-report), production briefs (p1-permission-prompts), schema (m1-l2, m1-l3, m1-l4 entries), style guide, neighboring lessons (m1-l1, m1-l2, m1-l4 specs), prework summary, 10x-content-delivery reference, fallback-verification.md

## Verdict

**Ready with minor fixes**

All blocking findings from the prior RC (S1-1, S1-2) and all important findings (S2-1 through S2-6) are confirmed resolved. No new blockers. Two minor items remain — both in video production artifacts, not learner-facing text.

---

## Prior Findings — Confirmed Resolved

### ~~S1-1. `defaultMode` key in settings.json~~ — RESOLVED

The settings.json example (draft lines 200-228) no longer contains `"defaultMode": "default"`. The `permissions` object correctly contains only `allow` and `deny` arrays.

### ~~S1-2. `phase_3_status: failed` naming confusion~~ — RESOLVED

The Mermaid diagram (draft line 482) now reads `verification.md<br/><small>status: failed</small>` and the prose (line 504) says `Częściowy verification.md ze statusem failed`. No more `phase_3_status` reference in learner-facing text. The underlying bootstrapper field name is now abstracted away, which is the correct editorial choice.

### ~~S2-1. VIDEO PLACEHOLDER git init reference~~ — RESOLVED

Draft line 194 now reads: "Trzeci: komentarz, że bootstrapper v1 NIE inicjalizuje gita — `git init` to świadoma decyzja kursanta, kiedy rozpocząć wersjonowanie." This correctly describes the absence of a prompt, not a simulated one.

### ~~S2-2. No routing callout in Core health-check~~ — RESOLVED

Draft line 357 opens the health-check section with: "Masz istniejący projekt? Nie uruchamiaj bootstrappera. Bootstrapper jest dla pustego katalogu. `/10x-health-check` to właściwy punkt wejścia." Direct, unmissable.

### ~~S2-3. Missing `auto` mode mention in body text~~ — RESOLVED

Draft line 296 includes: "Claude Code oferuje też tryb `auto` (research preview), który automatycznie redukuje liczbę promptów bez wyłączania kontroli bezpieczeństwa, np. jawnie blokuje `Bash(*)` i wildcardowane interpretery na wejściu. Warto obserwować jego rozwój jako potencjalną alternatywę dla ręcznego kształtowania allowlisty." Placed after the intermediate-state recommendation, consistent with grounding guidance ("mention as forward-looking, not as kursant default").

### ~~S2-4. `Bash(git *)` lacks acknowledgment of destructive local ops~~ — RESOLVED (exceeded recommendation)

The draft solved this more thoroughly than the original recommendation: instead of adding a note about `Bash(git *)`, the recommended config was refactored to use individual git commands (`Bash(git add *)`, `Bash(git commit *)`, etc.). Line 235 explicitly explains: "Rozdzielamy je zamiast pisać szerokie `Bash(git *)`, żeby agent nie dostał niejawnej zgody na `git push`, `git reset --hard` czy `git clean -fd`." This is a stronger solution — destructive git commands now fall into the default `ask` category.

### ~~S2-5. Video/text duration mismatch~~ — RESOLVED

Draft line 99 now reads: "Kontrast jako krótka wstawka — dwie minuty, które pokazują, dlaczego delegacja wygrywa z generowaniem." Aligns with video-delegate-to-cli.md's 90-120s target.

### ~~S2-6. Prework reference lacks explicit lesson name~~ — RESOLVED

Draft line 5 now reads: "W lekcji Od chatbota do Agenta (M1L2) na dysku wylądował `tech-stack.md`." Follows the (MXLX) marker convention consistently.

---

## New Findings

### Minor: Video scenario settings.json configs diverge from draft

- **Evidence:** video-permission-prompts.md (segment 5, lines 148-157) and p1-permission-prompts.md (lines 131-139) both show a target `settings.json` with broad `Bash(git *)` in allow. The draft (lines 200-228) now uses individual git commands (`Bash(git add *)`, `Bash(git commit *)`, etc.) with an explicit explanation of why.
- **Why it matters:** If the video demonstrates `Bash(git *)` while the text teaches split commands, learners who watch the video and then read the text will see an unexplained discrepancy. The draft's split approach is pedagogically superior (it motivated the S2-4 fix) and should be the authoritative reference.
- **Required fix:** Update the target settings.json in video-permission-prompts.md (segment 5) and p1-permission-prompts.md to match the draft's individual git commands. The segment 5 script should demonstrate adding individual git operations, with the same "rozdzielamy, żeby agent nie dostał niejawnej zgody na git push, git reset --hard" rationale.

### Minor: Stale video/text mismatch notes in video scenarios

- **Evidence:** Three video scenario files still list "Video/text mismatches" that reference issues already fixed in the draft:
  - video-permission-prompts.md (lines 207-209): mentions defaultMode and git init mismatches — both resolved.
  - video-delegate-to-cli.md (line 120): mentions "30-sekundowa wstawka" mismatch — resolved (now "krótka wstawka — dwie minuty").
  - video-verification-report.md (line 147): mentions `phase_3_status: failed` — resolved (now generic "status: failed").
- **Why it matters:** Stale mismatch notes create noise for the video producer, who may spend time investigating issues that no longer exist.
- **Required fix:** Clear or update the "Video/text mismatches" sections in all three video scenario files to reflect the current draft state.

### Note: `curl`/`wget` deny rules lack grounding source

- **Evidence:** Draft lines 222-223 and 242 add `Bash(curl *)` and `Bash(wget *)` to the deny list with explanation: "agent nie powinien samodzielnie pobierać i uruchamiać skryptów z sieci." The grounding brief does not specifically address curl/wget deny rules.
- **Why it matters:** Low risk — these are reasonable security recommendations consistent with the "co ten wzorzec może popsuć poza moim repo" filter. However, the previous review's recommended config (grounding section "Examples Worth Using") did not include them.
- **Required fix:** None — the addition is defensible within the lesson's own filter framework. If challenged, the rationale is: curl/wget can download and execute arbitrary content, which is an "effect beyond the repo."

### Note: Prior RC S3 findings — status unchanged

The prior RC's S3 (nice-to-have) findings remain in their original state and are acceptable for ship:
- S3-1 (repetition of filter phrase): 5 occurrences remain — deliberate pedagogical repetition.
- S3-2 (ona.com link fragility): No Wayback archive added — acceptable risk for a supplementary link.
- S3-3 (`"astro": "^4.0.0"` reproducibility): Draft line 85 uses illustrative framing ("bo tak było w danych treningowych") — acceptable.
- S3-4 (emoji in Mermaid diagrams): Render testing deferred to platform verification — acceptable for editorial RC.

---

## Spec Compliance

- **Thesis:** Pass. The draft delivers the complete thesis — chain execution, delegation, permission policy, and three-gate framework for both greenfield and brownfield paths.
- **Learning outcomes:** Pass. All five outcomes from the spec are covered: chain execution (lines 29-49), delegation pattern (lines 71-99), permission policy (lines 196-256), three-gate framework (lines 101-128), and health-check for brownfield (lines 355-411).
- **Behavioral change:** Pass. The draft provides a concrete `settings.json` config and the "co ten wzorzec może popsuć poza moim repo" filter as actionable tools.
- **Required example/demo:** Pass. Five VIDEO PLACEHOLDERs (lines 29, 99, 194, 256, 353, 413) mark the positions for live walkthrough video inserts.
- **Failure mode:** Pass. All four failure modes named explicitly (lines 545-565): Approve-everything Stockholm, YOLO mode bez warunków, AI scaffolds from scratch, Brownfield-as-greenfield.
- **Bridge in:** Pass. Line 5 references m1-l2 and `tech-stack.md`. Lines 46-49 explain the chain handoff.
- **Bridge out:** Pass. Line 466 sets up m1-l4: "Repo jest na razie *głuche*: agent nie zna jeszcze twoich konwencji."

## Grounding And External Checks

- **Verified claims:**
  - Permission syntax `Bash(npm *)` / `Bash(git *)` — correct per Claude Code docs (code.claude.com/docs/en/permissions).
  - Evaluation order deny → ask → allow — correct per Claude Code docs.
  - `bypassPermissions` warning ("isolated environments only") — correctly paraphrased from permission-modes docs.
  - Read/Edit-vs-Bash gap — correctly stated per Claude Code permissions docs ("Read deny does not block cat in Bash").
  - Codex/Cursor equivalents — correctly named per Codex (--sandbox, --ask-for-approval) and Cursor (permissions.json, "Run Everything" warning) docs.
  - npm audit severity tiers — correctly listed (info, low, moderate, high, critical) per npm CLI docs.
  - `auto` mode as research preview requiring Sonnet 4.6+ / Opus 4.6+ — correct per permission-modes docs.
  - Ona.com bypass case — correctly framed as "udokumentowany przypadek (Ona, marzec 2026 r.)" per grounding guidance, without endorsing the Veto product.
  - Bootstrapper behavior (hand-off precondition, conflict policy, HARD-STOP) — correct per bootstrapper SKILL.md.
- **Unsupported or softened claims:**
  - (none) — all factual claims are grounded.
- **Open verification:**
  - Whether Anthropic has acknowledged/fixed the ona.com bypasses — unchanged from grounding; framed as historical, not current. Acceptable.

## Curriculum Continuity

- **Previous lesson fit (m1-l2):** Clean handoff. Draft receives `tech-stack.md` from m1-l2 and correctly references skill format and metaprompting as established concepts without re-teaching them.
- **Next lesson setup (m1-l4):** Clean bridge. Draft ends at "projekt na dysku, agent głuchy" (line 466), explicitly leaving AGENTS.md/CLAUDE.md, custom instructions, hooks, and inner loop for m1-l4.
- **Potential duplicates:** Permissions vs prework 2.3 — managed by the progression from *categories* (prework) to *operational policy* (m1-l3). No filler repetition detected.
- **Scope theft risk:** None detected. No mention of AGENTS.md generation, hooks configuration, MCP server setup, or CI/CD pipeline — all correctly reserved for m1-l4 and m1-l5.

## Editorial Quality

- **Style guide fit:** Good. Bridge opening from m1-l2 (line 5). Short paragraphs (most ≤3 sentences). Casual asides present ("Brzmi banalnie, dopóki nie zobaczysz..." line 65). "Materiały dodatkowe" label used (line 582). Direct address (ty/ci) throughout.
- **AI-sounding patterns:** Minimal. No "Praktyczny wniosek:" labels, no expanded well-known acronyms, no thesis-statement headings. Prose reads as authored, not generated.
- **Polish/prose issues:** Minor emdash density in the "Uprawnienia w trakcie biegu" section (lines 130-165), slightly above the ~1 per 10 lines guideline. Most are in definition-list context (e.g., "**Yes** — pojedyncza zgoda") which the style guide permits.

## Diagram Quality

- **Diagrams present:** 9 mermaid diagrams with rendered CDN images.
- **Placement:** Each diagram sits directly next to its supporting claim — chain flow (line 33), three gates (line 105), deny→ask→allow evaluation (line 164), defense-in-depth (line 312), HARD-STOP failure (line 476), conflict policy (line 515), greenfield/brownfield convergence (line 387), health-check gates (line 361), tool surface (line 421).
- **Missing opportunities:** None identified. The nine diagrams cover all multi-step flows and decision branches.
- **Decorative or redundant:** None. Each diagram adds structural information not easily conveyed by adjacent prose.
- **Syntax/rendering:** CDN URLs present for all diagrams. Emoji usage in nodes (🔍, ⚙️, 📋, 🛡️, etc.) — acceptable pending platform render test (S3-4 from prior RC).

## Video Alignment

Three video scenarios present and reviewed:

- **video-permission-prompts.md:** Content-aligned with draft. Two stale mismatch notes need cleanup (defaultMode, git init). Target settings.json needs update to match draft's split git commands (see Minor finding above).
- **video-delegate-to-cli.md:** Content-aligned. Stale duration mismatch note needs cleanup.
- **video-verification-report.md:** Content-aligned. Stale `phase_3_status` mismatch note needs cleanup.

No video introduces claims absent from the draft. No video contradicts the draft's current content.

## Side-Effect Ledger

New claims introduced:
- `Bash(curl *)` and `Bash(wget *)` added to deny list with rationale (agent should not independently download/execute scripts from the network). Not in prior RC's config. Consistent with the filter framework.
- Individual git commands in allow list (replacing broad `Bash(git *)`) with explicit explanation of destructive-operation exclusion.

Claims removed:
- `"defaultMode": "default"` removed from settings.json example (S1-1 fix).
- `phase_3_status: failed` removed from prose (S1-2 fix). Replaced with generic "status: failed" language.

Neighboring lesson references changed:
(none — same handshakes as prior RC)

Prework references used:
- [1.2] Chatbot vs Agent vs Harness (harness as control layer) — Materiały dodatkowe (line 593).
- [2.3] Claude Code — podstawy operacyjne — Materiały dodatkowe (line 594).
- Prework model confidence/knowledge (line 97) — organically, without number.

Prework concepts repeated intentionally:
- Harness-as-control deepened from awareness to operational policy. No filler repetition.
- Permission categories from prework 2.3 operationalized into concrete settings.json entries.

Potential duplicates:
- Permissions vs prework 2.3: managed by progression from categories to operational policy.
- AGENTS.md / custom instructions: mentioned only as forward reference in defense-in-depth diagram (line 319) and bridge-out (line 466). No boundary violation.
- MCP: mentioned only as third category with forward reference to m1-l5 (line 462). No boundary violation.

Unsupported facts:
(none)

Video/text mismatches:
- Video scenarios contain stale mismatch notes referencing issues already fixed in draft (Minor finding — cleanup needed).
- Video production briefs show `Bash(git *)` broad pattern; draft uses individual commands (Minor finding — update briefs).

Needs human decision:
(none — all prior human decisions have been implemented)

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [x] Unsupported factual claims resolved or removed
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted
- [ ] Video scenario aligned — stale mismatch notes need cleanup; production briefs need settings.json update
