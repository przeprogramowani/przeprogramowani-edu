# RC Review: m3-l3 — Hooki i triggery: Agent, który sam reaguje na błędy

## Verdict

**Ready with minor fixes**

No blockers or major issues. The lesson is well-grounded, structurally sound, follows the spec's 10-beat logic map, respects all scope boundaries, and the editorial pass removed Polglish. Three minor issues and two notes remain.

## Findings

### Minor: Mermaid diagrams retain English terms cleaned from prose

- Evidence: Line 120 diagram node `"Plik w risk area\nz testing-guide.md?"` uses "risk area" (English); prose at line 116 was cleaned to "Obszary ryzyka". Line 162 diagram node uses `"pełny suite"` while prose at line 88 was cleaned to `"Pełny zestaw testów"`.
- Why it matters: Visual inconsistency between prose and diagrams. The editor pass cleaned English terms from prose but not from mermaid nodes.
- Required fix: Change diagram node at line 120 to `"Plik w obszarze ryzyka\nz testing-guide.md?"`. Change line 162 node to `"pełny zestaw testów"`.
- Source check: editorial consistency, no external source needed.

### Minor: First hook example runs project-wide, spec expected file-specific

- Evidence: Spec Beat 3 says "running a formatter on the edited file." Draft line 48 uses `npx eslint --fix . --quiet` which runs ESLint on the entire project, not the edited file.
- Why it matters: The pedagogical choice is reasonable (simpler first example, file-specific parsing introduced in Beat 5 with jq), but it deviates from the spec's stated intent and may confuse learners who notice the hook runs on everything after each edit.
- Required fix: Not a blocker. Either (a) add one sentence noting this runs project-wide and is fine for small projects, or (b) accept the deviation as a pedagogical trade-off and leave as-is.
- Source check: spec Beat 3.

### Minor: jq dependency not mentioned for stdin parsing hook

- Evidence: Line 109 uses `jq -r .tool_input.file_path` to parse JSON stdin. jq is not mentioned as a requirement.
- Why it matters: jq is common on macOS (via Homebrew) and Linux but not universally installed. A learner who copy-pastes this hook may get a cryptic "command not found" error.
- Required fix: Add a brief note (one sentence) near line 104-109 that this pattern requires `jq`, or mention it in a parenthetical.
- Source check: practical tooling, no external source needed.

### Note: Video scenario files not yet created

- Evidence: Spec lists `video-scenario` as a required artifact. No `videos/` directory exists in `workbench/lessons/m3-l3/`.
- Why it matters: 6 video placeholders in the draft are well-aligned with spec V1-V6, but the actual video scenario artifact is pending.
- Required fix: None for the draft RC. Video scenario is a separate artifact per the workbench workflow.

### Note: Copilot `.claude/settings.json` compatibility claim scoped correctly

- Evidence: Line 230 says "Copilot w VS Code potrafi nawet czytać `.claude/settings.json`."
- Why it matters: Grounding confirms this is true for the VS Code extension specifically, not for the cloud agent or CLI. The draft correctly scopes to "w VS Code" — verified, no fix needed.
- Source check: grounding § Copilot Hooks Documentation, confirmed.

## Spec Compliance

- **Thesis:** Pass. Lines 9-11 establish the hook-as-instant-feedback thesis clearly.
- **Learning outcomes (5):** Pass. All five from spec covered: PostToolUse config (lines 37-68), scoped tests (92-132), three-layer model (154-177), pre-commit gate (181-212), cross-tool transfer (214-232 + task 280-282).
- **Behavioral change:** Pass. "After this lesson, learner's sessions include automated quality checks" — addressed throughout, reinforced by practical tasks.
- **Required example/demo:** Pass. 10xcards narrative project referenced in video placeholders and tasks.
- **Failure mode ("hook everything, always"):** Pass. Disarmed in Beat 4 (speed question, lines 82-90) and Beat 7 (layers have different cadences, lines 165-177).
- **Bridge in:** Pass. Lines 3-7 bridge from m3-l2's manual test runs. Matches m3-l2 draft's explicit bridge-out (m3-l2 line 253, VIDEO V6).
- **Bridge out:** Pass. Line 246 sets up m3-l4 (E2E, Playwright, browser). VIDEO V6 (line 248) reinforces.

## Grounding And External Checks

Verified claims:
- Claude Code ~30 events, 5 handler types (grounding § Claude Code Hooks Documentation, high confidence)
- PostToolUse `additionalContext` with 10,000 char cap (same source)
- Exit code semantics 0/2/other (same source)
- Cursor ~18 events, afterFileEdit, failClosed (grounding § Cursor Hooks Documentation)
- Codex 10 events, command-only functional (grounding § Codex Hooks Documentation)
- Windsurf 12 events, no context injection (grounding § Windsurf Cascade Hooks Documentation)
- Copilot ~13 events, VS Code reads .claude/settings.json (grounding § Copilot Hooks Documentation)
- `vitest related <path> --run` is a subcommand, not `--related` flag (grounding § Vitest CLI, line 102 explicitly notes this)
- Vitest 4.1 agent reporter with `AI_AGENT=1` (grounding § Vitest 4.1 release notes)
- Lefthook: single YAML, `{staged_files}`, Go binary, v2.1.8 (grounding § Lefthook repo)
- 1Password agent-hooks as convergence proof (grounding § 1Password agent-hooks repo)
- Convergence claim softened appropriately ("robią to w bardzo podobny sposób" + "różniące się nazwami zdarzeń i głębokością konfiguracji")

Unsupported or softened claims:
- `agent` handler is experimental — correctly flagged in Deep Dive (line 322): "Na ten moment traktuj jako ciekawostkę do obserwowania."
- Stop hooks in Skills/Plugins have open issues — correctly scoped in Deep Dive (line 334): PostToolUse explicitly excluded from the problem.
- Performance numbers avoid specific ms claims — generalized to "ułamek sekundy", "kilka sekund" (compliant with grounding's "Claims To Avoid Or Soften" #2).

Open verification:
- (none — all factual claims in the draft are covered by the grounding brief)

## Curriculum Continuity

- **Previous lesson fit (m3-l2):** Clean. Draft bridges from m3-l2's manual test run ending. m3-l2 line 36: "W następnej lekcji hooki zaczną uruchamiać część tej weryfikacji automatycznie po edycji pliku." m3-l3 lines 3-7 pick this up directly.
- **Next lesson setup (m3-l4):** Clean. Line 246 sets up E2E: "Do tego potrzebujesz przeglądarki, Playwrighta i scenariuszy E2E. To temat m3-l4."
- **Potential duplicates:** None detected. m3-l1's strategic hook framing vs. m3-l3's operational wiring — boundary clear (m3-l3 references testing-guide.md as source, does not re-teach strategy). m1-l4 rules-file hierarchy vs. m3-l3 hook config — distinct mechanisms.
- **Scope theft risk:** None. Does not teach test authoring (m3-l2), testing-guide creation (m3-l1), E2E (m3-l4), debug strategy (m3-l5), AGENTS.md authoring (m1-l4), CI/CD pipeline creation (m1-l5/m2-l5), or full tool setup tutorials.

## Editorial Quality

- **Style guide fit:** Good. Short paragraphs, ty/ci address, casual asides ("Dwa polecenia i zapominasz o temacie formatowania", "Brzmi jak dużo warstw?", "Po to są hooki"), no expanded acronyms, simple headings, organic forward references, "Materiały dodatkowe" correct, Deep Dive intro convention followed.
- **AI-sounding patterns:** None remaining. Editor pass removed filler and Polglish.
- **Polish/prose issues:** Clean. 20+ Polglish terms were fixed in the editor pass. Remaining English terms are accepted technical vocabulary (hook, lint, typecheck, PostToolUse, exit code, staged files, etc.).
- **Lesson structure:** Matches canonical order from `lesson-structure.md`: H1 title → intro prose (no heading) → H3 subsections → `## 🧑🏻‍💻 Zadania praktyczne` → `## Odbierz swoją odznakę` (no emoji) → `## 🔎 Deep Dive` → `## 📚 Materiały dodatkowe`.
- **Materiały dodatkowe format:** Correct `[Title](URL) — description` and `Prework [x.y] *Title* — relevance` per lesson-structure.md.

## Diagram Quality

- **Diagrams present:** 3
- **Placement:**
  1. Hook lifecycle (lines 26-31) — placed after the 4-step explanation it visualizes. Correct.
  2. Scoped test decision (lines 118-126) — placed after the testing-guide.md filtering concept. Correct.
  3. Three-layer pipeline (lines 158-163) — placed at the opening of the section introducing the model. Correct.
- **Missing opportunities:** None. The spec flagged 3 diagram opportunities (Beats 2, 5, 7) and all three are implemented. Other beats don't have multi-step flows requiring visualization.
- **Decorative or redundant:** None. Each diagram reduces cognitive load for a multi-step flow or decision branch.
- **Syntax/rendering:** Valid mermaid flowchart syntax. Two minor language inconsistencies noted in findings (English terms in nodes that were cleaned from prose).

## Video Alignment

6 video placeholders match spec V1-V6. No video scenario files exist yet (separate artifact). No text/video mismatches — all placeholders describe content aligned with the corresponding draft sections.

## Side-Effect Ledger

New claims introduced: (none beyond what spec/grounding established)
Claims removed: (none)
Neighboring lesson references changed: (none)
Prework references used: 2.4 (safety discipline), 1.3 (tutor mode), 2.2/2.3 (tool basics)
Prework concepts repeated intentionally: (none — safety discipline is operationalized, not repeated)
Potential duplicates: (none)
Unsupported facts: `agent` handler stability (experimental, Deep Dive only), Stop hooks in Skills/Plugins (scoped, Deep Dive only)
Video/text mismatches: (none)
Needs human decision: (none)

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [x] Unsupported factual claims resolved or removed
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted
- [ ] Mermaid diagram language consistency (Minor — 2 nodes to fix)
- [ ] First hook project-wide vs. file-specific note (Minor — optional)
- [ ] jq dependency mention (Minor — one sentence)
- [ ] Video scenario aligned or explicitly deferred (deferred — separate artifact)
