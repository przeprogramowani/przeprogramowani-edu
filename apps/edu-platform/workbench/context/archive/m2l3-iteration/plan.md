# m3-l3 Iteration: Resolve TODOs, Fix Gate Mapping, Tool-Agnostic Tasks

## Overview

Resolve all 8 `[todo]` items in `lessons/m3-l3/lesson-draft.md`, fix the 1 pending RC review item (jq/Windows dependency), and verify cross-lesson coherence with m3-l1/l2 — bringing the draft to RC-ready state. The highest-impact change is rewriting the gate mapping heuristic (TODO-6) to match the real 10xCards test-plan taxonomy and teach the three-layer model as a menu, not a mandate.

## Current State Analysis

The m3-l3 draft is complete and has been through RC review. Three of four RC items are addressed; one remains (jq dependency). Eight `[todo]` comments mark editorial doubts:

- 5 are minor: concept validation, tool-specificity notes, phrasing fixes
- 1 is critical: gate taxonomy mismatch with the real 10xCards test-plan
- 2 require paragraph-level rewrites for tool-agnosticism in practical tasks

Cross-lesson coherence is clean on bridges, terminology, and ownership boundaries — the gate taxonomy is the only inconsistency.

### Key Discoveries:

- The real 10xCards test-plan (§5) uses `required / required-after-phase / deferred`, not `wymagane / zalecane / opcjonalne`. Per-edit hooks are explicitly deferred ("not v1") in the real plan.
- m3-l1 teaches the real taxonomy through the test-plan structure; m3-l3 contradicts it with a simplified heuristic.
- Exit codes (0/2/other) are confirmed universal across all five tools — strongest cross-tool convergence signal.
- `additionalContext` with 10,000 char cap is mostly universal (Claude Code, Cursor, Codex, Copilot); only Windsurf lacks it.
- Bridges m3-l2→l3, m3-l1→l3, m3-l3→l4 are all verified clean.

## Desired End State

The m3-l3 lesson draft has zero `[todo]` markers, zero pending RC review items, and consistent gate terminology with m3-l1. The gate mapping section teaches the three-layer model as a decision framework grounded in the real 10xCards example. Practical tasks lead with universal principles and offer tool-specific examples for Claude Code + 1-2 alternatives with doc links. The jq dependency is mentioned with a Windows-aware note. The draft is ready for `/lesson-editor-pl` followed by `/lesson-rc-review`.

### Verification:

```bash
grep -n '\[todo' lessons/m3-l3/lesson-draft.md   # expect: 0 matches
```

Manual read-through confirms: gate taxonomy aligns with m3-l1's `required / required-after-phase / deferred` scheme, practical tasks work for learners on any tool, jq dependency is addressed for all platforms.

## What We're NOT Doing

- Structural changes to the lesson (section order, new sections, heading changes)
- Schema updates to `lessons-schema.json`
- Edits to m3-l1, m3-l2, or m3-l4 drafts
- Video scenario work
- Full editorial polish (that's `/lesson-editor-pl` after this plan)
- Cross-tool comparison table changes (lines 254-261) — the table is accurate

## Implementation Approach

Work through the draft top-to-bottom, resolving minor TODOs first (Phase 1), then tackling the two substantive rewrites (Phases 2-3), then the RC item (Phase 4), then a coherence verification pass (Phase 5). Each phase edits a distinct section of the draft, so there are no ordering dependencies between Phases 1-4 except that Phase 5 must come last.

---

## Phase 1: Minor TODO Resolves

### Overview

Remove 5 straightforward `[todo]` markers that the research already resolved. Each is a line-level edit: remove the marker, optionally add a clarifying sentence or rephrase.

### Changes Required:

#### 1. TODO-1 (line 145) — concept validation

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Remove the todo. The concept of steering hook configuration based on test-plan.md risk areas is sound — the flowchart at lines 130-138 correctly models it. "Testing-guide" in the todo is a stale name; the draft text already uses `test-plan.md`.

**Contract**: Delete the line `[todo: do weryfikacji czy to w ogóle ma sens...]`. No replacement text needed — the preceding paragraph already explains the concept.

#### 2. TODO-2 (line 159) — Claude Code specificity

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Remove the todo. The mechanism (exit code 2 + additionalContext) is mostly universal. The 10,000-char cap is Claude Code specific but the draft already explains Windsurf's limitation in the cross-tool section. Optionally soften "z limitem 10 000 znaków" to acknowledge tool variance.

**Contract**: Delete the line `[todo: to jest claude code specific...]`. Optionally edit the preceding sentence to note the limit varies by tool, e.g.: "Stdout trafia do pola `additionalContext` (w Claude Code z limitem 10 000 znaków; inne narzędzia mają podobne mechanizmy z własnymi limitami)."

#### 3. TODO-3 (line 176) — exit code universality

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Remove the todo. The three exit codes are confirmed universal across all five tools — this is the strongest cross-tool convergence signal and absolutely worth teaching.

**Contract**: Delete the line `[todo: upewnijmy się że takie mamy te kody błędów...]`. No other changes needed.

#### 4. TODO-4 (line 263) — doc links

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Remove the todo. Links are already in Materiały dodatkowe (lines 393-401). Adding inline links would duplicate content and break the house style from `lesson-structure.md`. Instead, add one sentence pointing the reader to Materiały dodatkowe for discoverability.

**Contract**: Replace the todo line with a sentence like: "Linki do dokumentacji hooków każdego narzędzia znajdziesz w sekcji Materiały dodatkowe."

#### 5. TODO-5 (line 268) — "sygnał konwergencji" phrasing

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Remove the awkward calque "Sygnał konwergencji" and restructure the sentence so the 1Password example speaks for itself.

**Contract**: Replace lines 267-268:

Before:
```
Sygnał konwergencji: 1Password opublikował repozytorium `agent-hooks`, które jednym skryptem instaluje te same hooki do `.cursor/hooks.json`, `.claude/settings.json` i `.windsurf/hooks.json`. Jedno źródło hooków, wiele narzędzi.
[todo: sygnał konwergencji to dziwne określenie po polsku]
```

After (direction):
```
1Password opublikował repozytorium `agent-hooks`, które jednym skryptem instaluje te same hooki do `.cursor/hooks.json`, `.claude/settings.json` i `.windsurf/hooks.json`. Jedno źródło hooków, wiele narzędzi — to pokazuje, jak bardzo architektury się zbliżyły.
```

### Success Criteria:

#### Automated Verification:

- No `[todo]` markers remain on lines 145, 159, 176, 263, 268: `grep -n '\[todo' lessons/m3-l3/lesson-draft.md` returns only TODOs from lines 283, 301, 313 (Phases 2-3)

#### Manual Verification:

- Read the five edited passages in context — each flows naturally without the todo marker
- The additionalContext sentence (TODO-2) accurately reflects cross-tool reality
- The 1Password sentence (TODO-5) reads naturally in Polish

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Gate Mapping Rewrite

### Overview

Rewrite the gate mapping section (TODO-6, lines 272-285) to replace the incorrect `wymagane / zalecane / opcjonalne` heuristic with a question-based decision framework grounded in the real 10xCards test-plan. This is the highest-impact editorial change — it fixes the only cross-lesson inconsistency with m3-l1.

### Changes Required:

#### 1. Gate mapping section

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Replace the three-bullet heuristic with a decision question that teaches the learner to evaluate their own test-plan gates against the three-layer model. Follow with the real 10xCards plan as an honest example, showing: lint fits per-edit, integration tests fit pre-commit, e2e fits pre-push, and per-edit hooks + CI are explicitly deferred in v1. Acknowledge the pedagogical tension: the lesson teaches per-edit hooks, but the real project chose not to implement them yet. Frame the three-layer model as a menu, not a mandate.

**Contract**: Replace lines ~276-285 (from "Prosta zasada mapowania:" through the todo). The new text must:

1. Open with a decision question instead of a declarative heuristic: the learner asks "which gates from my test-plan are fast enough for per-edit? which should wait for commit? which need full CI?"
2. Walk through the real 10xCards §5 as a concrete example:
   - lint + typecheck → per-edit or pre-commit (the project chose pre-commit via Husky)
   - unit + integration → pre-commit (required after Phase 1)
   - e2e → pre-push (manual until CI lands)
   - CI → deferred (not v1)
   - post-edit hooks → deferred (not v1)
3. Include one honest sentence: "Twój projekt też może zdecydować, że hooki per-edit jeszcze się nie opłacają. To uprawniony wybór — trzy warstwy to menu, nie nakaz. Zacznij tam, gdzie stosunek kosztu do sygnału jest najlepszy."
4. Remove the `[todo: sprawdźmy czy to faktycznie się poprawnie mapuje...]` marker.
5. Keep the transitional sentence after the mapping ("Nie musisz konfigurować tego perfekcyjnie za pierwszym razem...").

### Success Criteria:

#### Automated Verification:

- No `[todo]` on line 283 area: `grep -n '\[todo.*mapuje' lessons/m3-l3/lesson-draft.md` returns empty
- Draft passes basic lint: no broken markdown links, no unclosed code blocks

#### Manual Verification:

- The gate terminology now aligns with m3-l1's taxonomy (required / required-after-phase / deferred)
- The 10xCards example is accurate per `/Users/admin/code/10xCards/context/foundation/test-plan.md` §5
- The "menu, not a mandate" framing is clear without undermining the lesson's thesis
- The learner understands HOW to map their own test-plan gates to layers, not just the 10xCards answer

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Tool-Agnostic Practical Tasks

### Overview

Rewrite the two practical tasks (TODO-7 on line 301 and TODO-8 on line 313) to lead with universal principles, then offer 1-2 tool-specific examples with documentation links.

### Changes Required:

#### 1. Task "Skonfiguruj hook lint + typecheck" (lines 293-303)

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Rewrite to lead with the principle ("configure a per-edit hook that runs your linter after every agent file edit"), then show Claude Code as the primary example with Cursor as a second option. Link to docs for each. Remove the todo.

**Contract**: The task text must:
1. Open with the universal instruction: what kind of hook, what trigger, what handler
2. Show the Claude Code path: `PostToolUse` matcher `Write|Edit` in `.claude/settings.json`
3. Show a Cursor alternative: `afterFileEdit` in `.cursor/hooks.json` (or link to Cursor hooks docs)
4. End with "Wybierz swoje narzędzie i przetestuj"
5. Remove the `[todo: ucieknijmy od konkretnych narzędzi...]` marker

#### 2. Task "Dodaj scoped test trigger" (lines 305-313)

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Rewrite to lead with "use your test runner's related-tests feature on the highest-risk area from test-plan.md", then show Vitest as one concrete example. Keep AI_AGENT=1 as a Vitest-specific tip. Remove the todo.

**Contract**: The task text must:
1. Open with the universal instruction: scoped test trigger for the highest-risk area
2. Show the Vitest example: `vitest related $FILE --run` with `AI_AGENT=1`
3. Note: "Twój test runner prawdopodobnie ma podobną opcję — sprawdź dokumentację"
4. Keep the comparison instruction (edit risk-area file vs. non-risk-area file)
5. Remove the `[todo: ucieknijmy od konkretnych narzędzi...]` marker

### Success Criteria:

#### Automated Verification:

- No `[todo]` markers on lines 301, 313: `grep -n '\[todo.*narzędzi' lessons/m3-l3/lesson-draft.md` returns empty

#### Manual Verification:

- A learner using Cursor (not Claude Code) can follow Task 1 without feeling lost
- A learner using Jest (not Vitest) understands the principle of Task 2 even if the syntax differs
- Tasks are still concrete enough to be actionable, not abstract platitudes

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: jq/Windows Dependency Fix

### Overview

Address the pending RC review item: learners who copy-paste the test-trigger hook command will get "command not found" if jq is missing, and Windows users face additional friction.

### Changes Required:

#### 1. jq dependency note

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: The jq mention already exists on line 116 ("ten przykład korzysta z unixowego narzędzia `jq`, więc upewnij się, że masz go zainstalowanego"). Expand it slightly to cover installation on macOS/Linux and note the Windows situation. The point is preventing a wall of "command not found" without turning the lesson into a jq setup tutorial.

**Contract**: Expand the jq mention near line 116 to:
1. Keep the existing "upewnij się, że masz go zainstalowanego" framing
2. Add a brief install hint: `brew install jq` (macOS), `apt install jq` (Ubuntu/Debian)
3. Add a Windows note: jq works via `winget install jqlang.jq` or `choco install jq`; alternatively, PowerShell's `ConvertFrom-Json` can parse the stdin JSON natively
4. Keep it to 2-3 sentences max — don't derail the hook explanation

### Success Criteria:

#### Automated Verification:

- The string `jq` appears in the draft with surrounding install context: `grep -A2 -B2 'jq' lessons/m3-l3/lesson-draft.md` shows install hints

#### Manual Verification:

- A macOS user, a Linux user, and a Windows user each know how to get jq (or its equivalent) working
- The note doesn't break the flow of the hook explanation

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Final Coherence Verification

### Overview

Re-read the full draft post-edits. Verify all TODOs are gone, cross-lesson bridges with m3-l1/l2 still hold, and the gate terminology is now consistent across the three lessons.

### Changes Required:

#### 1. Full-draft verification pass

**File**: `lessons/m3-l3/lesson-draft.md`

**Intent**: Read the entire draft and verify: (a) zero `[todo]` markers remain, (b) the gate taxonomy in the mapping section aligns with m3-l1's terminology, (c) bridges in/out are accurate, (d) no orphaned references to the old `wymagane / zalecane / opcjonalne` labels, (e) Materiały dodatkowe links are still valid.

**Contract**: This is a verification-only phase. If issues are found, fix them inline. Report a side-effect ledger:

```
New claims introduced:
Claims removed:
Neighboring lesson references changed:
Prework references used:
Prework concepts repeated intentionally:
Potential duplicates:
Unsupported facts:
Video/text mismatches:
Needs human decision:
```

### Success Criteria:

#### Automated Verification:

- `grep -c '\[todo' lessons/m3-l3/lesson-draft.md` returns `0`
- `grep -c 'zalecane bramki\|opcjonalne bramki' lessons/m3-l3/lesson-draft.md` returns `0` (old taxonomy gone)

#### Manual Verification:

- Gate terminology in m3-l3 now matches m3-l1's `required / required-after-phase / deferred` scheme
- Bridges m3-l2→l3 (line ~1-11) and m3-l3→l4 (line ~287) read accurately post-edits
- The 1Password restructured sentence (TODO-5) reads naturally in the surrounding paragraph
- No new inconsistencies introduced by the edits

**Implementation Note**: This is the final phase. After verification, the draft is ready for `/lesson-editor-pl` → `/lesson-rc-review`.

---

## Testing Strategy

### Automated:

- `grep -c '\[todo' lessons/m3-l3/lesson-draft.md` → 0
- `grep -c 'zalecane bramki\|opcjonalne bramki' lessons/m3-l3/lesson-draft.md` → 0
- No broken markdown (unclosed code blocks, orphan links)

### Manual:

1. Read the gate mapping section (Phase 2) — verify it teaches the decision framework with the real 10xCards example
2. Read practical tasks (Phase 3) — verify a Cursor/Codex user could follow them
3. Read the jq note (Phase 4) — verify macOS, Linux, and Windows are addressed
4. Spot-check bridges with m3-l1 (line ~272-274 reference to test-plan.md) and m3-l2 (opening lines)

## References

- Research: `context/changes/m2l3-iteration/research.md`
- Lesson draft: `lessons/m3-l3/lesson-draft.md`
- Lesson spec: `lessons/m3-l3/lesson-spec.md`
- RC review: `lessons/m3-l3/rc-review.md`
- Real test-plan: `/Users/admin/code/10xCards/context/foundation/test-plan.md` (§5 Quality Gates)
- Neighboring drafts: `lessons/m3-l1/lesson-draft.md`, `lessons/m3-l2/lesson-draft.md`

## Progress

### Phase 1: Minor TODO Resolves

#### Automated

- [x] 1.1 No `[todo]` on lines 145, 159, 176, 263, 268 — c3dcf972

#### Manual

- [x] 1.2 Five edited passages flow naturally without todo markers — c3dcf972
- [x] 1.3 additionalContext sentence accurately reflects cross-tool reality — c3dcf972
- [x] 1.4 1Password sentence reads naturally in Polish — c3dcf972

### Phase 2: Gate Mapping Rewrite

#### Automated

- [x] 2.1 No `[todo]` on line 283 area — 00837e8e
- [x] 2.2 No broken markdown — 00837e8e

#### Manual

- [x] 2.3 Gate terminology aligns with m3-l1's taxonomy — 00837e8e
- [x] 2.4 10xCards example is accurate per test-plan.md §5 — 00837e8e
- [x] 2.5 "Menu, not a mandate" framing is clear — 00837e8e
- [x] 2.6 Learner understands how to map their own gates to layers — 00837e8e

### Phase 3: Tool-Agnostic Practical Tasks

#### Automated

- [x] 3.1 No `[todo]` on lines 301, 313 — ba89d9aa

#### Manual

- [x] 3.2 Cursor learner can follow Task 1 — ba89d9aa
- [x] 3.3 Jest user understands the principle of Task 2 — ba89d9aa
- [x] 3.4 Tasks are still concrete and actionable — ba89d9aa

### Phase 4: jq/Windows Dependency Fix

#### Automated

- [x] 4.1 jq install context present in draft — 4eba07b3

#### Manual

- [x] 4.2 macOS, Linux, and Windows users each know how to get jq working — 4eba07b3
- [x] 4.3 Note doesn't break hook explanation flow — 4eba07b3

### Phase 5: Final Coherence Verification

#### Automated

- [x] 5.1 Zero `[todo]` markers in entire draft — 15001617
- [x] 5.2 Zero occurrences of old taxonomy labels — 15001617

#### Manual

- [x] 5.3 Gate terminology consistent with m3-l1 — 15001617
- [x] 5.4 Bridges m3-l2→l3 and m3-l3→l4 accurate post-edits — 15001617
- [x] 5.5 No new inconsistencies introduced — 15001617
