# Video Scenario: m3-l3 — Hook setup + scoped tests

> **STATUS: SUPERSEDED BY TEXT (3. edycja).** Nie nagrywany w 10xDevs 3.0 — treść zastąpiona tekstem + mermaidami (sekcje „Pierwszy hook w praktyce" / „Testy tylko tam, gdzie trzeba") i screenem (l.107) w `lesson-draft.md`. Zachowany jako materiał referencyjny; kandydat do nagrania w 4. edycji.

## Purpose

Show the learner a complete hook-wiring session from zero to two working PostToolUse hooks in 10xCards. The video starts with no `.claude/settings.json`, ends with two hooks firing on every agent edit: (1) ESLint auto-fix, (2) scoped test trigger using `vitest related`. The second hook demonstrates scope-aware matching: editing a risk-area file runs related tests, editing a low-risk utility does not trigger failures. This is the lesson's core practical moment — without it the learner has only JSON config to read.

## Prerequisites

Before recording, Phase 1.1–1.3 of the test plan must be implemented in 10xCards. The video needs:

- `vitest.config.ts` configured and working
- `npm run test` passing
- At least `src/lib/openrouter.test.ts` with passing tests (Risk #1 wrapper tests)
- At least `src/pages/api/generate.test.ts` with passing tests (Risk #1 boundary + Risk #7 privacy)

These come from `context/changes/testing-bootstrap-openrouter-privacy/plan.md` Sub-phases 1.1–1.3. If Phase 1 is not yet implemented at recording time, implement Sub-phases 1.1–1.3 first. The video does not show test authoring (that's m3-l2) — it shows hooking up existing tests to fire automatically.

No `.claude/settings.json` should exist at the start of recording. If one exists, temporarily move it aside.

## Project context

- **Repo:** 10xCards (`/Users/admin/code/10xCards`)
- **Existing pre-commit:** Husky + lint-staged (ESLint on `*.{ts,tsx,astro}`, Prettier on `*.{json,css,md}`)
- **Risk #1 surface:** `src/lib/openrouter.ts` (wrapper) and `src/pages/api/generate.ts` (API route)
- **Low-risk file for contrast:** `src/lib/utils.ts` (utility helpers, no tests import it)
- **Test runner:** Vitest with `vitest related <path> --run`

## Segment 1 — First hook: ESLint on every edit

**Format:** `live-demo`

**Goal:** Wire the simplest possible PostToolUse hook and show it firing.

**On screen:**

- Terminal with Claude Code in 10xCards
- No `.claude/settings.json` exists yet

**Flow:**

1. Prowadzący opens Claude Code in 10xCards. Quick orientation: "Mam projekt z testami z poprzedniej lekcji. Brakuje jednego: automatycznego sprawdzania po każdej edycji."
2. Prowadzący asks Claude Code to create the hook config:

   ```
   Create .claude/settings.json with a PostToolUse hook that runs ESLint --fix
   after every Write or Edit. Use matcher "Write|Edit" and timeout 10000.
   ```

3. Agent creates `.claude/settings.json`. Prowadzący shows the file:

   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Write|Edit",
           "hooks": [
             {
               "type": "command",
               "command": "npx eslint --fix . --quiet",
               "timeout": 10000
             }
           ]
         }
       ]
     }
   }
   ```

4. Prowadzący asks agent to make a small edit to any file — e.g. "Add a comment to src/lib/utils.ts" or "Rename a variable in src/lib/openrouter.ts".
5. Agent edits the file. **Key moment:** the PostToolUse hook fires visibly in the terminal. ESLint runs, exit code 0.
6. Prowadzący: "Hook się odpalił. Każda edycja pliku przez agenta przejdzie teraz przez linter automatycznie."

**Duration:** ~90 seconds after editing.

**Fallback:** If ESLint finds no issues (likely), that's fine — the point is seeing the hook fire. If you want a visible fix, intentionally leave a formatting issue in a file before recording.

## Segment 2 — Second hook: scoped test trigger

**Format:** `live-demo` (continues from Segment 1)

**Goal:** Add a test hook that runs `vitest related` for the edited file. Show two contrasting edits: one in a risk-area file (tests run), one in a low-risk file (no related tests, fast pass).

**On screen:**

- Same terminal, same session
- `.claude/settings.json` already has the ESLint hook from Segment 1

**Flow:**

1. Prowadzący: "Lint to za mało. Chcę, żeby po edycji pliku z obszaru ryzyka uruchomiły się powiązane testy."
2. Prowadzący adds the test hook to settings.json — either manually or via agent. The hook parses `tool_input.file_path` from stdin:

   ```json
   {
     "type": "command",
     "command": "bash -c 'FILE=$(jq -r .tool_input.file_path) && npx vitest related \"$FILE\" --run'",
     "timeout": 30000
   }
   ```

   Brief mention: "Potrzebujemy `jq` do wyciągnięcia ścieżki pliku ze stdin hooka."

3. **Edit #1 — risk-area file.** Prowadzący asks agent to make a small change to `src/lib/openrouter.ts` — e.g. "Add a JSDoc comment to the generateCards function."
   - Agent edits the file.
   - ESLint hook fires (fast, passes).
   - **Test hook fires.** `vitest related src/lib/openrouter.ts --run` executes. Terminal shows `src/lib/openrouter.test.ts` running. Tests pass.
   - Prowadzący: "Agent edytował plik z obszaru ryzyka numer jeden. Vitest znalazł powiązane testy i je uruchomił."

4. **Edit #2 — low-risk file.** Prowadzący asks agent to make a small change to `src/lib/utils.ts`.
   - Agent edits the file.
   - ESLint hook fires (passes).
   - **Test hook fires** but `vitest related src/lib/utils.ts --run` finds no related tests. Vitest exits quickly with 0 tests run.
   - Prowadzący: "Utility helper — żadne testy go nie importują. Vitest skończył w ułamku sekundy. Hook nie blokuje agenta tam, gdzie nie ma czego sprawdzać."

5. Closing: "Dwa hooki, automatycznie. Lint na każdej edycji, testy na plikach z obszaru ryzyka. Agent pracuje, ja nie muszę pamiętać o ręcznym uruchamianiu."

**Duration:** ~3–4 minutes after editing.

**Fallback:** If `vitest related` on `src/lib/utils.ts` actually finds tests (because a test imports utils transitively), pick a different low-risk file: `src/styles/` CSS file, `src/env.d.ts`, or `astro.config.mjs`. The point is contrast — one edit triggers tests, the other doesn't.

## Pre-production TODO

### Setup:

- [ ] Implement 10xCards test plan Phase 1.1–1.3 (vitest bootstrap + openrouter wrapper tests + API route tests) if not already done
- [ ] Verify `npx vitest related src/lib/openrouter.ts --run` finds and runs `src/lib/openrouter.test.ts`
- [ ] Verify `npx vitest related src/lib/utils.ts --run` runs 0 tests (or find an alternative no-test file)
- [ ] Remove or rename `.claude/settings.json` if it exists — video starts from scratch
- [ ] Verify `jq` is installed (`brew install jq` if not)
- [ ] Verify ESLint config works with `npx eslint --fix . --quiet` (should exit 0 on clean project)

### Recording:

- [ ] Terminal font size large enough to read JSON config and test output
- [ ] Consider `AI_AGENT=1` in the test hook environment for compact output (Vitest 4.1+ only — check vitest version in 10xCards first)
- [ ] Total video length target: 4–5 minutes after editing
- [ ] Bookmark the two "hook fires" moments — these are the key frames

### Risks:

- **Agent creates different JSON structure.** If the agent formats `settings.json` differently, that's fine as long as the hook config is correct. The video teaches the pattern, not exact JSON.
- **Vitest takes too long on the wrapper tests.** If `vitest related` for `openrouter.ts` runs more than 5–10 seconds, it may feel slow on camera. Mention: "W większym projekcie to może być wolniejsze — wtedy przenosisz testy na bramkę commitową."
- **Agent makes a change that breaks a test.** Unlikely with a comment/JSDoc addition, but if it happens — that's actually great material for the next video (context injection). Consider keeping it if the agent self-corrects.

## Video/text alignment

- Matches draft line 78: `[VIDEO: Hook setup + scoped tests — ...]`
- Draft lines 37–72: first hook config (ESLint), three-level settings hierarchy, explanation of matcher
- Draft lines 92–150: scoped test trigger, `vitest related` syntax, `jq` for stdin parsing, risk-area filtering concept
- Draft line 72 notes the first hook runs project-wide ESLint — video matches this (not per-file)
- Draft line 116 mentions `jq` dependency — video includes the brief mention

## Claims introduced only in video

- (none) — video demonstrates config and behavior already described in the draft

## Needs human decision

- **Which low-risk file to use for Edit #2.** `src/lib/utils.ts` is the best candidate if no tests import it. Verify before recording. If it's transitively imported by tests, use `src/env.d.ts` or a style file instead.
- **Whether to show AI_AGENT=1.** If 10xCards uses Vitest 4.1+, adding `AI_AGENT=1` to the hook command makes test output cleaner on camera. If using an older Vitest, skip it — don't upgrade just for the video.
