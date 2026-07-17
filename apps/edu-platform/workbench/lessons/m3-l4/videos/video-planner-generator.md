# Video Scenario: m3-l4 — Planner→Generator workflow (V3a)

> **STATUS: SUPERSEDED BY TEXT (3. edycja).** Nie nagrywany w 10xDevs 3.0 — treść zastąpiona tekstem + mermaidem (sekcja „Planner→Generator pipeline", l.210–234) i screenem (l.246) w `lesson-draft.md`. Zachowany jako materiał referencyjny; kandydat do nagrania w 4. edycji.

## Purpose

Show the planner→generator pipeline in action: the learner sees an agent explore a live app, produce a Markdown test plan, and transform it into executable TypeScript. This is the "wow" moment of agentic E2E — the agent navigates 10xCards autonomously, discovers UI structure, and writes tests from what it sees.

Because the agent's behavior is unpredictable and exploration can be slow, this video is designed for **accelerated playback** or **pre-recorded with voiceover**. The recording captures the real pipeline running; editing trims dead time (agent thinking, network waits). The final video should feel brisk: setup → agent explores → plan appears → test appears.

This video does NOT cover review/fix (V3b handles that). The test that the generator produces may contain anti-patterns — that's fine. V3b picks up from there.

## Prerequisites

- 10xCards running locally (`npm run dev`, `http://localhost:3000`)
- `@playwright/cli` installed
- `storageState` configured (auth state saved)
- `seed.spec.ts` written and in place
- `context/foundation/test-plan.md` with at least 2 risk entries that need E2E coverage
- `npx playwright init-agents --loop=claude` already run (agent definitions exist in repo)

## Project context

- **Repo:** 10xCards (`/Users/admin/code/10xCards`)
- **Primary risk for demo:** "utrata wygenerowanych fiszek po odświeżeniu strony" (Risk #1 from test-plan.md)
- **Seed test:** `tests/seed.spec.ts`
- **Output location:** `tests/` directory — planner writes `.md`, generator writes `.spec.ts`

## Recording strategy

**Pre-record the entire pipeline run without voiceover.** The pipeline involves:
1. Agent thinking (pauses of 5-30 seconds)
2. Agent issuing CLI commands
3. Snapshots appearing in terminal
4. Planner writing a Markdown file
5. Generator writing a TypeScript file

Record all of this with screen capture. Then:
- Trim or 2x-speed the thinking pauses
- Add voiceover in post, narrating what's happening at each step
- Total raw recording: ~10-15 minutes. Final edited video: ~4-5 minutes.

**Fallback if the pipeline fails or produces poor output:** Use screenshots of a successful run and narrate over static frames. This still conveys the workflow clearly.

## Segment 1 — Setup and context

**Format:** `live-demo` (normal speed)

**Goal:** Show the starting point — test-plan.md with risk, seed test in place, agent definitions initialized.

**On screen:**

- Editor with `context/foundation/test-plan.md` open
- Risk #1 highlighted or visible

**Flow:**

1. Prowadzący opens test-plan.md: "Mam mapę ryzyk z m3-l1. Najwyższe ryzyko E2E: utrata fiszek po odświeżeniu. Przechodzi przez API, bazę i rendering — żaden unit test tego nie pokryje."
2. Quick flash of `seed.spec.ts`: "Seed test jest na miejscu — pokaże Generatorowi, jak wygląda dobry test."
3. Prowadzący: "Uruchamiam pipeline."

**Duration:** ~30 seconds.

## Segment 2 — Planner explores the app

**Format:** `pre-recorded + voiceover` (accelerated)

**Goal:** Show the planner navigating 10xCards through accessibility snapshots and producing a Markdown test plan.

**On screen:**

- Terminal where the planner agent runs
- Browser showing 10xCards (visible in headed mode)
- Planner's output appearing in terminal

**Flow:**

1. Prowadzący runs the planner (exact invocation depends on the init-agents output, but the pattern is):
   ```bash
   npx playwright test --project=planner
   ```
   Or, if using Claude Code integration:
   ```
   Run the planner agent for risk: "flashcard data persists after page reload".
   Use context/foundation/test-plan.md as input.
   ```

2. **Accelerated section.** The planner:
   - Opens 10xCards in the browser
   - Takes accessibility snapshots
   - Navigates through the deck creation flow
   - Identifies interactive elements
   - Writes observations

3. Voiceover during acceleration: "Planner eksploruje aplikację przez snapshoty. Widzi strukturę dostępności — te same role i nazwy, które widzieliśmy w CLI. Nawiguje po flow tworzenia decku, dodawania fiszek, odświeżania strony."

4. Planner produces a Markdown plan file. Show the output briefly:
   ```markdown
   ## Test Plan: Flashcard Persistence
   
   ### Scenario 1: Created deck persists after reload
   1. Navigate to dashboard
   2. Create a new deck with unique name
   3. Verify deck heading is visible
   4. Reload the page
   5. Verify deck heading is still visible
   
   ### Scenario 2: Flashcard content persists after reload
   1. ...
   ```

5. Prowadzący: "Plan gotowy. Scenariusze, kroki, oczekiwane wyniki. Teraz Generator zamienia to w TypeScript."

**Duration:** ~2 minutes (edited from ~5-8 minutes raw).

## Segment 3 — Generator writes the test

**Format:** `pre-recorded + voiceover` (accelerated)

**Goal:** Show the generator converting the Markdown plan into a TypeScript test file, referencing the seed test.

**On screen:**

- Terminal where the generator runs
- The generated `.spec.ts` file appearing in the editor

**Flow:**

1. Prowadzący runs the generator:
   ```bash
   npx playwright test --project=generator
   ```

2. **Accelerated section.** The generator:
   - Reads the plan
   - References `seed.spec.ts` (metadata line: `// seed: tests/seed.spec.ts`)
   - Opens the browser to validate selectors against the live app
   - Writes the test file

3. Voiceover: "Generator czyta plan i seed test. Waliduje selektory na żywej aplikacji — sprawdza, czy elementy, które chce użyć, naprawdę istnieją."

4. Show the generated test file. **Do not fix it.** If it has anti-patterns, that's the setup for V3b.
5. Prowadzący: "Test wygenerowany. Ale zanim trafi do suite'a — review. I tu zaczyna się najważniejsza część."

**Duration:** ~90 seconds (edited from ~3-5 minutes raw).

## Segment 4 — Closing / bridge to V3b

**Format:** `voiceover` or `live-demo`

**Goal:** One sentence connecting to the review video.

**On screen:**

- Generated test file in editor

**Flow:**

1. Prowadzący: "Pipeline dostarczył test. Teraz pytanie: czy ten test naprawdę chroni system? Przejdźmy przez review."

**Duration:** ~10 seconds.

## Pre-production TODO

### Setup:

- [ ] Run `npx playwright init-agents --loop=claude` and verify agent definitions are created
- [ ] Write `seed.spec.ts` with the quality patterns from the draft
- [ ] Create or update `context/foundation/test-plan.md` with the flashcard persistence risk as highest priority
- [ ] Configure `storageState` so the planner can explore authenticated pages
- [ ] Do a dry run of the full pipeline to verify it works end-to-end
- [ ] Note the approximate run time — plan editing accordingly

### Recording:

- [ ] Screen recording tool that captures both terminal and browser simultaneously
- [ ] Raw recording will be 10-15 minutes — plan for post-production editing
- [ ] Mark timestamps during recording where "interesting things happen" (agent navigating, plan appearing, test file being written)
- [ ] Terminal font size large enough to read agent output at 2x speed

### Risks:

- **Agent takes too long.** Planner exploration can take 3-10 minutes depending on app complexity. Speed up in post. If it takes >15 minutes, abort and use screenshots from the dry run.
- **Agent fails to explore correctly.** If the planner can't navigate 10xCards (missing ARIA, auth wall, complex SPA routing), the demo breaks. Dry run is essential. Fallback: use screenshots with voiceover.
- **Generator produces a clean test.** If the seed test is strong enough, the generator may produce a test WITHOUT anti-patterns. That's actually good — but then V3b needs a separate pre-prepared bad test (which it already has). No conflict.
- **CLI/agent API changes.** Exact commands may differ from what's documented. Verify current syntax before recording via `npx playwright --help` and `playwright.dev/docs/test-agents`.

## Post-production notes

- **Editing priority:** Cut thinking pauses ruthlessly. Keep: (a) the first snapshot appearing, (b) the agent clicking through the app in the browser, (c) the plan file appearing, (d) the test file appearing. Everything else can be sped up or cut.
- **Speed:** 2x for agent thinking, normal speed for moments where output appears, normal speed for voiceover sections.
- **If the full pipeline cannot be recorded cleanly:** Fall back to a montage of screenshots with voiceover. The key deliverable is: (a) the learner understands the flow (test-plan.md → planner → Markdown plan → generator → TypeScript test), and (b) the learner sees that it's real, not hypothetical. Even static screenshots achieve this.

## Video/text alignment

- Matches draft line 150: `[VIDEO PLACEHOLDER: V3a — ...]`
- Risk selection from test-plan.md: draft lines 113–123
- Planner/generator workflow: draft lines 125–137, pipeline diagram at line 139
- Seed test reference: draft line 156 ("Planner will also use this seed test...")
- `init-agents` command: draft line 133
- 10xCards concrete example: draft lines 148–150

## Claims introduced only in video

- (none) — video demonstrates the pipeline already described in the draft

## Needs human decision

- **Whether to do a full live recording or use screenshots.** Full recording is more authentic but risky (agent unpredictability, timing). Screenshots with voiceover are safer and faster to produce. Recommend: attempt full recording in a dry run. If it goes well, use it. If not, fall back to screenshots. **Given the 3-day timeline, screenshots may be the pragmatic choice.**
- **Exact planner/generator invocation commands.** These depend on `init-agents` output. Run `init-agents` first and note the actual commands.
