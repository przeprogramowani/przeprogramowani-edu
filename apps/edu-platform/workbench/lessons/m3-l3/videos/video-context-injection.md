# Video Scenario: m3-l3 — Context injection: agent widzi i reaguje

## Purpose

Show the "aha" moment of agent hooks: when a hook catches an error, the agent sees the feedback in its context and self-corrects without human intervention. This is what separates agent hooks from plain git hooks — the feedback loop closes automatically. The video ends with a clear boundary statement ("trivial auto-fix, not debugging") and a one-sentence bridge to m3-l4 (hooks catch code errors, not visual/UX regressions).

## Prerequisites

- 10xCards Phase 1 tests exist and pass (`src/lib/openrouter.test.ts`, `src/pages/api/generate.test.ts`)
- `.claude/settings.json` has the PostToolUse hooks active

> **Verified 2026-05-31 (in the `10xcards-m3l3-injection` worktree):** all **three** hooks are already present in `.claude/settings.json` (ESLint `--fix`, scoped `vitest related` via `jq`, `tsc --noEmit`). `jq` is installed, `vitest related` resolves correctly (~1.4s), clean `tsc --noEmit` runs in ~5.1s (<10s), and `tsc` returns **exit code 2** on a type error (the blocking signal Claude Code injects as feedback).
>
> **Consequence for Segment 1:** the typecheck hook is *already* in settings. To "add it live" on camera, either (a) temporarily remove the `tsc` hook before recording so you can add it back live, or (b) drop the live-add and narrate it as a recap ("mam już komplet trzech hooków").

## Project context

- **Repo / recording location:** `10xcards-m3l3-injection` worktree (`/Users/admin/code/10xcards-m3l3-injection`, branch `video/m3l3-injection-prep`) — clean master + the 3 hooks.
- **Target file for the intentional break:** `src/lib/openrouter.ts` — the OpenRouter wrapper with typed interfaces and Zod validation. Rich enough in types that a small edit can produce a type error the agent can fix.
- **Test file that will catch regressions:** `src/lib/openrouter.test.ts`

## Segment 1 — Setting up a typecheck hook

**Format:** `live-demo`

**Goal:** Add a typecheck hook so the agent gets type error feedback. This hook plus the existing test hook creates the full per-edit feedback surface.

**On screen:**

- Terminal with Claude Code in 10xCards
- `.claude/settings.json` visible with existing hooks from previous video

**Flow:**

1. Prowadzący: "Mam hooki na lint i testy. Dodaję jeszcze typecheck — to najbardziej użyteczna trójka per-edit."
2. Prowadzący adds the typecheck hook to the existing PostToolUse config — either manually or via agent:

   ```json
   {
     "type": "command",
     "command": "npx tsc --noEmit",
     "timeout": 30000
   }
   ```

3. Brief comment: "W większym projekcie typecheck może być za wolny na per-edit. W 10xCards to kilka sekund — opłaca się."

**Duration:** ~30 seconds.

## Segment 2 — Agent breaks a type, hook catches it

**Format:** `live-demo` (continues from Segment 1)

**Goal:** Demonstrate the feedback loop: agent edit -> hook catches type error -> agent sees error in context -> agent fixes it in next iteration.

**On screen:**

- Same terminal, same session
- All three hooks active (ESLint, typecheck, vitest related)

**Flow:**

1. Prowadzący gives agent a task that will naturally produce a type-adjacent change in `src/lib/openrouter.ts`. The task should be real enough that the agent might introduce a small type inconsistency. Options:

   **Option A (guided break):** Ask the agent to refactor a function signature in a way that requires updating callers:
   ```
   In src/lib/openrouter.ts, rename the `model` parameter in generateCards
   to `modelId` and update the function signature. Make sure the caller
   in src/pages/api/generate.ts is updated too.
   ```
   The agent may update the function but miss updating one reference, producing a type error.

   **Option B (introduce a type intentionally before recording — guaranteed error):**
   **Already committed** on `video/m3l3-injection-prep` as `152a705` — the worktree is pre-broken and ready. It annotates `requestedCount` as `string` (it is a `number`) inside `generateCards`, producing **exactly one** `tsc` error with no test-file cascade (verified):
   ```ts
   // openrouter.ts ~line 64, inside generateCards:
   const requestedCount: string = input.requestedCount; // number → string
   const userMessage = [`Produce ${requestedCount} flashcards ...`, ...].join("\n\n");
   // → src/lib/openrouter.ts(68,9): error TS2322: Type 'number' is not assignable to type 'string'.
   ```
   It does **not** touch the public `CardDraft`/`generateCards` contract, so the test suite stays type-valid (adding a field to `CardDraft` would instead cascade ~6 errors into `*.test.ts` mocks/asserts — avoided on purpose).
   On camera: ask the agent to "fix the type issue in `openrouter.ts`" — the hook fires, the agent sees the exact `tsc` diagnostic via context injection, and removes the bad annotation. Revert/reset after each take with `git checkout src/lib/openrouter.ts`.

   **Option C (simplest, most controllable):** Ask the agent to add a new typed parameter to `generateCards` without updating the call site:
   ```
   Add an optional `temperature` parameter (number) to @src/lib/openrouter.ts
   and pass it to the fetch body. Don't update the caller yet —
   I want to see what happens.
   ```
   Agent edits `openrouter.ts`. Typecheck hook may or may not fire depending on whether the param is optional. If optional, no error. For a guaranteed error, make the param required in the prompt.

2. **Key moment:** Agent edits the file. Hooks fire in sequence:
   - ESLint: passes (formatting is fine)
   - Typecheck (`tsc --noEmit`): **fails with a type error**. Exit code 2.
   - The error output appears in the terminal. The agent sees it.

3. **Agent reacts.** In the next iteration, the agent reads the hook feedback (visible as `additionalContext` in the conversation) and fixes the type error — adds the missing import, updates the caller, corrects the type signature.

4. Hooks fire again on the fix:
   - ESLint: passes
   - Typecheck: **passes**
   - Tests: pass (or no related test changes needed)

5. Prowadzący: "Hook złapał błąd, agent zobaczył co dokładnie nie pasuje i naprawił w następnej iteracji. Bez mojej interwencji."

**Duration:** ~2–3 minutes depending on agent speed.

**Fallback:** If the agent doesn't produce a type error organically (e.g., it correctly updates all callers), use Option B: pre-break a type before recording and ask the agent to "fix the type issues in openrouter.ts". The hook will fire immediately and the agent will see the `tsc` output. Less organic but guaranteed to show the feedback loop.

## Segment 3 — The boundary and the bridge

**Format:** `talking-to-camera` or `voiceover` over the terminal showing the fixed state

**Goal:** Draw the line between trivial self-correction (what we just saw) and real debugging (m3-l5). Close with a one-sentence bridge to m3-l4.

**On screen:**

- Terminal showing the completed fix — all hooks green
- Or: prowadzący on camera

**Flow:**

1. Prowadzący: "To co właśnie widzieliście, to trywialna autokorekta. Brakujący import, zły typ, źle nazwana zmienna. Agent to ogarnie sam."
2. "Ale jeśli test pada z powodu błędnej logiki biznesowej? Hook to pokaże, ale agent niekoniecznie zdiagnozuje prawdziwą przyczynę. To już nie jest temat na hook — to temat na dedykowany debugging workflow, o którym będziemy mówić w m3-l5."
3. Bridge to m3-l4: "I jeszcze jedno. Hooki łapią błędy na poziomie kodu — typy, format, testy jednostkowe. Ale nie łapią tego, co widzi użytkownik: przesuwający się layout, zepsutą nawigację, niedostępny formularz. Do tego potrzebna jest przeglądarka i E2E. To temat następnej lekcji."

**Duration:** ~30–40 seconds.

## Pre-production TODO

### Setup (status 2026-05-31):

- [x] All three hooks in `.claude/settings.json` and working (ESLint, `tsc`, scoped `vitest related` via `jq`) — verified
- [x] `tsc --noEmit` runs in <10s (~5.1s) — verified
- [x] Exit code 2 returned on `tsc` failure (Claude Code treats 2 as blocking) — verified
- [ ] **Decide break option (A, B, or C)** — open. A needs a live-agent dry-run at the keyboard (can't be auto-verified); B is the guaranteed fallback (see concrete pre-break in Segment 2).
- [ ] **Confirm the agent actually *sees* the `tsc` diagnostic text** in the live dry-run. `tsc` writes diagnostics to stdout; exit-2 injection surfaces stderr. If the agent gets "blocked" without the error text, wrap the hook command: `bash -c 'npx tsc --noEmit 1>&2'`.
- [ ] Decide Segment 1 handling — the `tsc` hook is already present (remove temporarily to add live, or narrate as recap; see Prerequisites).

### Recording:

- [ ] Terminal font size large enough to read the `tsc` error message — this is the key visual
- [ ] The agent's "I see the error, fixing it" response must be visible on screen — don't cut it
- [ ] Total video length target: 3–4 minutes after editing
- [ ] Bookmark: (a) the moment the hook fires with an error, (b) the agent's self-correction response, (c) the second hook run passing

### Risks:

- **Agent doesn't produce a type error.** Most likely with Option A. Use Option B as fallback — guaranteed error.
- **`tsc --noEmit` is too slow.** Unlikely in 10xCards (small project, ~50 TS files). If it takes >10s, mention: "W większym projekcie ten check przeniósłbym na bramkę commitową."
- **Agent enters a fix loop.** If the agent's first fix introduces another error, that's still good footage — shows the iterative nature. If it loops more than twice, cut and mention: "Jeśli agent nie naprawia po dwóch próbach, to sygnał, że problem jest głębszy."
- **Test hook also fails.** If the type change also breaks a test, both hooks fire. That's even better — more feedback channels at once. Don't prevent it.

## Video/text alignment

- Matches draft line 176: `[VIDEO: Context injection — ...]`
- Draft lines 153–172: exit code semantics (0, 2, other), `additionalContext` mechanism, the self-correction boundary
- Draft line 172: explicit boundary — "Hook to pokaże, ale agent niekoniecznie zdiagnozuje prawdziwą przyczynę"
- Draft lines 282–283: bridge to m3-l4 — hooks catch code errors, not visual/UX regressions
- Segment 3 absorbs the removed V6 bridge placeholder — the bridge is now a closing sentence in this video

## Claims introduced only in video

- (none) — video demonstrates behavior already described in the draft (context injection, exit code 2, self-correction boundary, bridge to m3-l4)

## Needs human decision

- **Which break strategy to use (Option A, B, or C).** Option B is most reliable for recording. Option A is most organic but risky. Option C is a middle ground. Recommend: try Option A in a dry run. If the agent doesn't produce an error, fall back to Option B.
- **Whether to show all three hooks firing or focus on typecheck.** Showing all three (ESLint pass, tsc fail, vitest related pass/fail) is richer but longer. Showing only tsc is tighter. Recommend: show all three — the sequence reinforces the "pipeline per-edit" concept from the draft.
