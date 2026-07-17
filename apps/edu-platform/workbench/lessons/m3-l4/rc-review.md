# RC Review: m3-l4 — Testy E2E: Playwright, MCP i multimodalne scenariusze

## Verdict

**Ready with minor fixes**

No blockers. No major issues. The draft covers all spec outcomes, respects schema boundaries, grounds claims in verified sources, and follows the house style after the editor pass. Four minor findings and three notes below.

## Findings

### Minor: Ambiguous lesson count in pipeline section

- Evidence: Line 331 — "Przez ostatnie cztery lekcje tego modułu zbudowaliśmy warstwowy system jakości"
- Why it matters: m3-l4 is the 4th lesson. "Ostatnie cztery" could mean "the four before this one" (m3-l1 through m3-l4 includes the current one) or "the four preceding" (m3-l1 through m3-l4 minus current = only three). Ambiguous.
- Required fix: Change to "W tym module zbudowaliśmy warstwowy system jakości:" or "Przez cztery lekcje tego modułu zbudowaliśmy..."
- Source check: n/a — editorial

### Minor: Task heading uses English "risk map" while H2 was Polonized

- Evidence: Line 382 — `### Scenariusze E2E z risk map` vs line 111 — `## Od ryzyk do testów E2E`
- Why it matters: The H2 uses Polish "ryzyk", the task heading uses English "risk map." Minor inconsistency in the same concept's terminology.
- Required fix: Change to `### Scenariusze E2E z mapy ryzyk` for consistency with the H2.
- Source check: n/a — editorial

### Minor: Three useful grounding sources missing from Materialy dodatkowe

- Evidence: The grounding v2 added BrowserStack waitForTimeout article, QA Wolf parallelization article, and TestDino Playwright Test Agents article. None appear in Materialy dodatkowe despite being used in lesson claims (anti-patterns, data isolation, seed test).
- Why it matters: Learners who want to go deeper on specific anti-patterns or data isolation would benefit from these direct links.
- Required fix: Consider adding 1-2 of these (QA Wolf and BrowserStack are the most learner-useful):
  - `- [Why You Shouldn't Use waitForTimeout](https://www.browserstack.com/guide/playwright-waitfortimeout) — BrowserStack, before/after examples for replacing hardcoded waits`
  - `- [How to Write E2E Tests for Full Parallelization](https://www.qawolf.com/blog/how-to-write-tests-for-full-parallelization) — QA Wolf, unique identifiers and cleanup patterns`
- Source check: grounding v2

### Minor: Video scenarios not yet created

- Evidence: No `videos/` directory exists in `lessons/m3-l4/`.
- Why it matters: Schema `requiredArtifacts` includes `video-scenario`. The draft has 4 video placeholders (V1-V4) that match the spec, but the detailed video scenario files haven't been written yet.
- Required fix: Create video scenarios as a follow-up artifact (not blocking draft RC).
- Source check: schema `requiredArtifacts`

### Note: Table in CLI vs MCP section is appropriate

The style guide says "Don't use tables for conceptual frameworks — only for lookup." The CLI vs MCP table (line 264) IS a lookup table (tokens, interaction model, best use case, default mode). No fix needed.

### Note: Tool transferability is adequate

The lesson is Playwright-centric by design (recommended stack). Key concepts are framed as universal principles: accessibility tree interaction, seed test as quality template, E2E anti-patterns, token budget tradeoffs. The rules template uses Playwright APIs but the principle ("constrain agent output with rules") transfers. No fix needed.

### Note: Prework [3.5] reference added in vision section

The editor pass added a forward reference to prework [3.5] for model recommendations (line 325). This is a good organic bridge — no issue.

## Spec Compliance

- **Thesis**: Pass — "quality depends on seed test + rules + review" is visible in intro (line 11) and reinforced throughout.
- **Learning outcomes**: Pass — all 8 outcomes from spec covered:
  1. CLI setup + snapshot navigation (lines 37-73, task "Eksploracja")
  2. Seed test with quality patterns (lines 148-211, task "Seed test")
  3. E2E rules in project rules file (lines 189-209, task "Seed test" step 2)
  4. Risk-driven E2E generation (lines 111-146, task "Scenariusze E2E")
  5. Anti-pattern identification and fix (lines 213-236, task step 5)
  6. storageState configuration (lines 77-109, task "Konfiguracja storageState")
  7. Vision mode + limitations (lines 281-327, task "Weryfikacja wizualna")
  8. CLI vs MCP tradeoff (lines 258-279)
- **Behavioral change**: Pass — learner goes from "agent edits code" to "agent explores browser AND generated tests are reviewed against seed + rules."
- **Required example/demo**: Pass — seed.spec.ts code (line 164), anti-pattern examples with fixes, CLI walkthrough commands.
- **Failure mode**: Pass — "tests that pass but don't verify risk AND won't survive refactor" addressed by anti-patterns (Beat 7) + seed test (Beat 6).
- **Bridge in**: Pass — opens from m3-l3 hooks gap (line 7). References m3-l1 testing-guide.md (line 113). References m3-l2 prompt-template (line 150).
- **Bridge out**: Pass — healer limits lead to m3-l5 debugging (line 347).

## Grounding And External Checks

**Verified claims (against live docs 2026-05-27):**
- `@playwright/cli` package name, `playwright-cli` binary, core commands (open, click, fill, press, screenshot, state-save) — verified at playwright.dev/docs/getting-started-cli
- `PLAYWRIGHT_CLI_SESSION=name claude .` integration pattern — verified
- `npx playwright init-agents --loop=claude` — verified at playwright.dev/docs/test-agents
- Seed test role: "Planner will also use this seed test as an example of all the generated tests" — verified (exact quote)
- Three agent types (planner/generator/healer) descriptions — verified
- `--headed` flag, snapshot YAML format — verified
- `getByRole` as recommended locator — verified at playwright.dev/docs/best-practices
- "Never wait for timeout in production" — verified at playwright.dev/docs/test-assertions
- storageState save/load pattern — verified at playwright.dev/docs/auth
- `--caps=vision,network,storage` flag — verified at github.com/microsoft/playwright-mcp

**Softened claims (appropriate caution):**
- Token numbers (~27K vs ~114K) — framed as "mniej więcej czterokrotna oszczędność." Secondary source (Currents.dev). Appropriate softening.
- WebTestBench F1 scores — framed as "mniej niż 30%" and "mniej więcej dwukrotnie." Appropriate.
- Healer success — framed as "większość problemów z selektorami." No unsupported percentage.
- VLM model categories — genericized (no specific model versions). Appropriate per mustNotCover.

**Open verification:**
- Exact CLI command syntax may evolve (CLI is pre-1.0). Verified as of 2026-05-27.
- `browser.bind()` API stability (Deep Dive) — no stability warning found. Low risk.
- 10xcards visual element for vision demo — needs human decision (carried from spec).

## Curriculum Continuity

- **Previous lesson fit**: m3-l3 bridge is explicit (hooks → browser gap). m3-l2 prompt-template is bridged to seed test. m3-l1 testing-guide.md is referenced as input.
- **Next lesson setup**: m3-l5 bridge is explicit (healer limits → debugging). The healer failure mode (line 345) creates the exact tension m3-l5 resolves.
- **Potential duplicates**: m3-l2 review ritual vs m3-l4 anti-pattern review — boundary clear (different anti-pattern set, same principle). m3-l1 risk mapping vs m3-l4 risk selection — boundary clear (strategic vs operational).
- **Scope theft risk**: None detected. No testing-guide.md creation (m3-l1), no unit test authoring (m3-l2), no hook configuration (m3-l3), no debug workflow (m3-l5).

## Editorial Quality

- **Style guide fit**: Good. Opening follows bridge convention (from m3-l3), no code in intro, punchy closer ("I dokładnie to teraz skonfigurujemy."). Forward references organic. Paragraphs mostly 1-3 sentences.
- **AI-sounding patterns**: None detected after editor pass. No "warto zauważyć", no "kluczowe jest", no expanded acronyms, no thesis-statement headings.
- **Polish/prose issues**: Minor — "Scenariusze E2E z risk map" heading still uses English where nearby H2 was Polonized (see finding above).

## Diagram Quality

- **Diagrams present**: 4
- **Placement**: All 4 placed next to supporting claims:
  1. Agent↔Browser loop (line 23) — supports accessibility tree concept
  2. Risk→E2E pipeline (line 135) — supports planner/generator workflow
  3. DOM→Vision decision tree (line 291) — supports vision supplement concept
  4. Quality pipeline layers (line 333) — supports pipeline position
- **Missing opportunities**: None — the lesson covers multi-step flows and decision branches well with existing diagrams.
- **Decorative or redundant**: None — all reduce cognitive load.
- **Syntax/rendering**: Valid mermaid syntax. Labels use Polish. Evaluation labels (`✓`) used in vision diagram.

## Video Alignment

No video scenario files present (`videos/` directory does not exist). Four VIDEO PLACEHOLDER markers in the draft match the spec's `videoPlaceholders` exactly (V1-V4). Video scenario creation is a follow-up artifact.

## Side-Effect Ledger

New claims introduced: (none beyond what spec/grounding authorized)
Claims removed: Opus 4.7 resolution claim (unsupported), specific VLM model version numbers (editor pass)
Neighboring lesson references changed: (none)
Prework references used: [3.1] token budgets, [3.5] model recommendations (new in editor pass), [4.1] Playwright in stack
Prework concepts repeated intentionally: (none — concepts operationalized, not repeated)
Potential duplicates: (none new)
Unsupported facts: (none remaining — previously unsupported claims removed or softened)
Video/text mismatches: (none — no video scenarios to compare)
Needs human decision: which 10xcards risk scenario for primary E2E demo, whether to cite Debbie O'Brien by name (currently approach-only, not name-dropped)

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [x] Unsupported factual claims resolved or removed
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted (editor pass complete)
- [ ] Video scenario aligned or explicitly deferred — deferred (no scenarios yet)
- [ ] Minor: Ambiguous "cztery lekcje" count → fix to "W tym module"
- [ ] Minor: "risk map" heading inconsistency → Polonize task heading
- [ ] Minor: Consider adding 1-2 grounding sources to Materialy dodatkowe
