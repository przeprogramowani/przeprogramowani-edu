# Wire m3-l3/l4/l5 Toolkit Artifacts (hooks, E2E, debug) Implementation Plan

## Overview

Module 3 of 10xDevs 3.0 delivers per-lesson AI artifacts to learners through the public CLI (`10x get m3lX`). Lessons m3-l1 and m3-l2 are wired; **m3-l3, m3-l4, m3-l5 are empty `"TBD"` stubs** with all artifact arrays empty. This plan authors the missing artifacts (one prompt, two rules), wires the three lesson definitions into the spread chain, adds `get` blocks to the relevant lesson drafts, and validates the bundle so `10x get m3l3/m3l4` actually deliver content before tomorrow's release.

None of these lessons introduces a new `/10x-*` skill — the work is **prompt + rules + wiring**, not skill authoring.

## Current State Analysis

**Two repos are involved:**

1. **Toolkit monorepo** (`/Users/admin/code/10x-toolkit/`) — where artifacts and wiring live. This is where most of the work lands.
2. **Workbench** (this repo, `projects/edu-platform/workbench/`) — where the lesson drafts live; only the `get` blocks change here.

**Wiring mechanics (verified in code):**

- Lesson defs live at `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-0X.ts`.
- `defineLesson({ lessonId, lesson, title, summary, artifacts: { root, local } })`. `root`/`local` each have four string arrays: `skills`, `prompts`, `configs`, `rules` (`schemas/lesson.ts:3-25`).
- Lessons inherit via **spread** of the previous lesson, e.g. `skills: [...lesson02.artifacts.root.skills, "..."]`.
- **Current spread chain:** m2l5 → m3l1 (`+10x-test-plan`) → m3l2 (`+10x-tdd`, `+m3l2-ad-hoc-testing`). l3/l4/l5 are stubs with **no import of the previous lesson** and all-empty arrays.
- `rules` is **NOT** spread — each lesson carries only its own rule (m3l1→`["CLAUDE-m3l1"]`, m3l2→`["CLAUDE-m3l2"]`). Rules merge into the learner's `CLAUDE.md` on `get`.
- Lessons 03/04/05 are already registered in `courses/10xdevs3/index.ts` (`lessons: [m3l1..m3l5]`), so no registry change is needed.
- Toolkit summaries are written in **English** (see m3l1/m3l2); stubs currently say `"TBD"`.

**Artifact resolution + CLI delivery (verified in code):**

- Resolver `createFsArtifactResolver()` (`course-content/src/build/core.ts:39-50`) maps strings to files:
  - `prompts: ["x"]` → `ai-artifacts/prompts/x.md` (`.md` appended)
  - `rules: ["CLAUDE-m3lX"]` → `ai-artifacts/rules/CLAUDE-m3lX.md` (`.md` appended)
  - `configs: ["name"]` → `ai-artifacts/config-templates/name` (**no suffix** — name used as-is)
- `build:lessons` (`course-content/package.json`) **throws** `Missing root artifact: ...` if any referenced file is absent — this is our validation backstop.
- CLI `get` (`10x-cli/src/lib/writer.ts`) delivery, per artifact type:
  - skills → `.claude/skills/<name>/SKILL.md`
  - prompts → `.claude/prompts/<name>.md`
  - rules → merged into `CLAUDE.md` (sentinel block)
  - **configs → `.claude/config-templates/<name>`, skip-on-exists, NO MERGE, `.template` suffix not stripped**

**Source material ready to copy (verified to exist):**

- Canonical 3-hook `settings.json`: `/Users/admin/code/10xcards-m3l3-injection/.claude/settings.json` (ESLint `--fix` + `vitest related` via `jq` + `tsc --noEmit`). The 2-hook `10xcards-m3l3-hooks` variant is the wrong one.
- The m3-l3 draft **already contains the full 3-hook JSON inline** (lines 68-85, 105-110, 143-149) plus a `lefthook.yml` example (lines 256-268).
- m3-l4 prompt-template verbatim block at `m3-l4/lesson-draft.md:136-156`; 10xCards Phase-6 example at lines 162-188.
- Format exemplars: `ai-artifacts/prompts/m3l2-ad-hoc-testing.md` (pure prompt text, no front-matter) and `ai-artifacts/rules/CLAUDE-m3l2.md` (intro → task-router table → key rules → **Lesson boundaries** → **Paths used**).

### Key Discoveries:

- **`configs` delivery is reference-only** (`writer.ts` configs branch) — it drops a file in `.claude/config-templates/` and never merges into the active `.claude/settings.json`. Shipping hooks via `configs` would mislead learners into thinking hooks are installed. **Decision: m3-l3 ships the rule only; hooks stay inline in the draft** (where they already are).
- **`rules` is not accumulated** — each lesson def lists only its own rule. l3/l4 each get one new rule; l5 gets none.
- **No E2E/Playwright/hooks/debug artifact exists anywhere** in `ai-artifacts/` — confirmed by directory sweep. We are creating the first ones.
- **Import order constrains phase order**: l4 imports l3, l5 imports l4, so l3 must be wired before l4 type-checks, l4 before l5.

## Desired End State

- `ai-artifacts/prompts/m3l4-e2e-prompt.md` and `ai-artifacts/rules/CLAUDE-m3l3.md`, `CLAUDE-m3l4.md` exist, matching house format.
- `module-03/lesson-03.ts`, `lesson-04.ts`, `lesson-05.ts` import the previous lesson, spread the chain correctly, carry real English `summary` values, and reference only existing artifact files.
- `npm run build:lessons` (in `course-content`) passes with no `Missing root artifact` error.
- `10x get m3l3` delivers `CLAUDE-m3l3` (merged into `CLAUDE.md`) + inherited skills/prompts; `10x get m3l4` additionally delivers `m3l4-e2e-prompt` + `CLAUDE-m3l4`.
- m3-l3 and m3-l4 drafts contain a `get mXlY` block at the first point of use; m3-l5 draft is unchanged.

**Verification:** build passes; a dry-run/inspection of the resolved m3l3 and m3l4 bundles shows the expected `rules`/`prompts` entries with real content.

## What We're NOT Doing

- **No new skill.** All three lessons reuse existing skills + external tools (Playwright CLI/MCP, Sentry MCP).
- **No `configs` array on any lesson.** Reference-only delivery makes it the wrong vehicle for active hooks (see Key Discoveries).
- **No m3-l5 toolkit artifact** — no `CLAUDE-m3l5`, no Sentry MCP config entry, no `get m3l5` block in the draft. l5 wiring only inherits the chain and fills `summary`.
- **No seed `seed.spec.ts` as a delivered artifact** — no delivery slot exists for raw test files; the seed stays an inline example in the m3-l4 draft.
- **No `lefthook.yml` artifact** — it lives inline in the m3-l3 draft only.
- **Not touching the m3-l2 file** — the brief notes a stray-backtick typo and a title cross-reference in m3-l2; both are out of scope here (reported under Side-Effect Ledger for a separate fix).
- **No Track A work** (10xCards demo code: seed/anti-patterns/planted bug). Separate concern; the planted m3l5 bug must never reach 10xCards master.
- **No changes to publishing paths, Circle IDs, or `src/content*`.**

## Implementation Approach

Author the new artifact files first within each lesson phase, then wire that lesson's `.ts` def, then (for l3/l4) add the draft `get` block. Proceed in import-chain order (l3 → l4 → l5) so each `.ts` type-checks against an already-wired predecessor. A final phase runs the toolkit build to validate every string reference resolves, then smoke-tests delivery.

Artifact language follows existing exemplars: **rules in English** (matching `CLAUDE-m3l2.md`, Polish allowed in examples); the **e2e prompt copies the draft's English template verbatim** (the draft's prompt-template is already English). Draft `get` blocks are **Polish** (learner-facing prose).

## Phase 1: m3-l3 — Hooks rule, wiring, draft get block

### Overview
Author the hooks rule, wire `lesson-03.ts` into the chain (rule only, no configs), and add a `get m3l3` block to the m3-l3 draft.

### Changes Required:

#### 1. New hooks rule
**File**: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/rules/CLAUDE-m3l3.md`

**Intent**: Encode the m3-l3 hooks model as a project rule the agent reads before configuring hooks. Source content from the draft sections: `### Cykl życia hooka` (trigger→matcher→handler→signal), `### Trzy warstwy lokalnej jakości` (per-edit / pre-commit / pre-push / CI and which check belongs where), `### Agent widzi i reaguje` (exit codes 0/2/other + `additionalContext` 10k limit), `### Ten sam wzorzec w każdym narzędziu` (cross-tool table; Windsurf has no context injection), `### Hooki a test-plan.md` (which risk areas warrant scoped tests).

**Contract**: Follow the `CLAUDE-m3l2.md` structure exactly: `## 10xDevs AI Toolkit - Module 3, Lesson 3` intro → task-router table → key rules → **### Lesson boundaries** (do NOT do E2E = l4; do NOT do debugging = l5; hooks config only) → **### Paths used by this lesson** (`.claude/settings.json`, `lefthook.yml`, `context/foundation/test-plan.md`). English prose.

#### 2. Wire lesson-03
**File**: `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-03.ts`

**Intent**: Replace the stub so l3 inherits l2's accumulated skills/prompts and adds its own rule. No new skill, prompt, or config.

**Contract**: Add `import lesson02 from "./lesson-02.js";`. Set `artifacts.root` to `skills: [...lesson02.artifacts.root.skills]`, `prompts: [...lesson02.artifacts.root.prompts]`, `configs: []`, `rules: ["CLAUDE-m3l3"]`; `local` stays all-empty. Replace `summary: "TBD"` with a real English summary describing the hooks lesson (per-edit/commit/push layering, exit-code feedback loop, cross-tool pattern).

#### 3. Draft get block
**File**: `/Users/admin/code/przeprogramowani-sites/projects/edu-platform/workbench/lessons/m3-l3/lesson-draft.md`

**Intent**: Tell the learner to fetch the lesson's artifact package at first point of use. Insert near `### Pierwszy hook w praktyce` (line 62).

**Contract**: Polish prose + a `bash` block `npx @przeprogramowani/10x-cli@latest get m3l3`, stating the package delivers the rule (`CLAUDE-m3l3`, merged into `CLAUDE.md`). Match the m3-l1/m3-l2 `get` block wording pattern. Do not move or duplicate the existing inline hook JSON.

### Success Criteria:

#### Automated Verification:
- `lesson-03.ts` type-checks (covered by the Phase 4 build)
- Referenced rule file exists at the resolver's expected path

#### Manual Verification:
- `get m3l3` block reads naturally in the draft and sits at the first hook use
- Rule content matches the draft's hooks model without inventing claims

---

## Phase 2: m3-l4 — E2E prompt + rule, wiring, draft get block

### Overview
Author the E2E prompt (generic template + 10xCards example) and the E2E rule, wire `lesson-04.ts`, and add a `get m3l4` block to the m3-l4 draft.

### Changes Required:

#### 1. New E2E prompt
**File**: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/prompts/m3l4-e2e-prompt.md`

**Intent**: A paste-ready prompt for generating an E2E test from a risk. Copy the draft's prompt-template **1:1** (`m3-l4/lesson-draft.md:136-156`), then include the concrete 10xCards Phase-6 worked example (lines 162-188) below it.

**Contract**: Pure prompt text, no front-matter (matching `m3l2-ad-hoc-testing.md`). English content (the draft template is English). Generic fill-in template first, a brief separator, then the filled example.

#### 2. New E2E rule
**File**: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/rules/CLAUDE-m3l4.md`

**Intent**: Encode the E2E quality model. Source from draft sections: `## Jak agent widzi aplikację` (accessibility tree), CLI vs MCP + token budget (~27K vs ~114K) and the selection heuristic, `### Seed test i reguły jakości` (the `# E2E Testing Rules` block: `getByRole`/`getByLabel`/`getByText`, no CSS/XPath, test independence, no `waitForTimeout`, business assertion, unique ids + cleanup, `storageState`), `### Pięć anti-wzorców E2E od agenta` + the re-prompt discipline, vision-as-supplement (DOM default), E2E in CI not per-edit, the healer boundary (selector=helps, logic=harms).

**Contract**: `CLAUDE-m3l2.md` structure: intro → task-router table → key rules (the E2E Testing Rules) → anti-patterns → **### Lesson boundaries** (do NOT do hooks = l3; do NOT do debugging = l5) → **### Paths used by this lesson**. English prose.

#### 3. Wire lesson-04
**File**: `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-04.ts`

**Intent**: Inherit l3's chain and add the E2E prompt + rule.

**Contract**: Add `import lesson03 from "./lesson-03.js";`. Set `artifacts.root` to `skills: [...lesson03.artifacts.root.skills]`, `prompts: [...lesson03.artifacts.root.prompts, "m3l4-e2e-prompt"]`, `configs: [...lesson03.artifacts.root.configs]`, `rules: ["CLAUDE-m3l4"]`; `local` all-empty. Replace `summary: "TBD"` with a real English summary (Playwright CLI/MCP, accessibility-tree interaction, seed+rules as quality levers, vision supplement).

#### 4. Draft get block
**File**: `/Users/admin/code/przeprogramowani-sites/projects/edu-platform/workbench/lessons/m3-l4/lesson-draft.md`

**Intent**: Fetch block at first point of use. Insert near `### Prompt-template dla E2E` (line ~130).

**Contract**: Polish prose + `npx @przeprogramowani/10x-cli@latest get m3l4`, stating it delivers the E2E prompt (`m3l4-e2e-prompt`) and the rule (`CLAUDE-m3l4`). Match m3-l1/m3-l2 wording.

### Success Criteria:

#### Automated Verification:
- `lesson-04.ts` type-checks (Phase 4 build)
- Both new artifact files resolve at expected paths

#### Manual Verification:
- Prompt template is byte-faithful to the draft; example renders correctly
- Rule captures the E2E rules + anti-patterns without scope-stealing from l3/l5
- `get m3l4` block reads naturally at the prompt-template section

---

## Phase 3: m3-l5 — Wiring only

### Overview
Wire `lesson-05.ts` to inherit the full chain and fill its summary. No toolkit artifact, no draft change.

### Changes Required:

#### 1. Wire lesson-05
**File**: `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-05.ts`

**Intent**: Keep the spread chain intact (so future module-04 lessons can extend it) while shipping no new artifact for the debug lesson.

**Contract**: Add `import lesson04 from "./lesson-04.js";`. Set `artifacts.root` to `skills: [...lesson04.artifacts.root.skills]`, `prompts: [...lesson04.artifacts.root.prompts]`, `configs: [...lesson04.artifacts.root.configs]`, `rules: []`; `local` all-empty. Replace `summary: "TBD"` with a real English summary (evidence convergence from monitoring/logs/Playwright/code, debug-as-test, swallowed errors / OWASP A10:2025, one workflow / four entry points).

### Success Criteria:

#### Automated Verification:
- `lesson-05.ts` type-checks (Phase 4 build)

#### Manual Verification:
- No `get m3l5` block was added to the m3-l5 draft; draft is untouched
- l5 still inherits the accumulated skills/prompts from l4

---

## Phase 4: Build, validate, smoke-test delivery

### Overview
Run the toolkit build to validate every artifact string resolves, then confirm the m3l3/m3l4 bundles carry the expected content.

### Changes Required:

#### 1. Build the course-content package
**File**: `/Users/admin/code/10x-toolkit/packages/course-content/` (no edit — run command)

**Intent**: `build:lessons` resolves all artifact strings and throws on any missing file, validating the wiring end-to-end.

**Contract**: Run `npm run build:lessons` (or the package's documented build) from `course-content/`. Expect zero `Missing root artifact` errors. If a workspace-wide build/typecheck script exists, run it too.

#### 2. Inspect resolved bundles
**File**: build output (no edit — inspect)

**Intent**: Confirm `m3l3` resolves `rules: ["CLAUDE-m3l3"]` with real content and the inherited skills/prompts; `m3l4` additionally resolves `prompts: [..., "m3l4-e2e-prompt"]` and `rules: ["CLAUDE-m3l4"]`; `m3l5` carries inherited artifacts + empty rules.

**Contract**: Inspect the generated bundle JSON (or a `10x get --dry-run` if available) for the three lessons.

### Success Criteria:

#### Automated Verification:
- `npm run build:lessons` exits 0 with no missing-artifact errors
- Type-check/build of `course-content` passes

#### Manual Verification:
- Resolved m3l3/m3l4 bundles contain the new rule/prompt content
- A smoke `10x get m3l4` in a scratch dir writes `.claude/prompts/m3l4-e2e-prompt.md` and merges `CLAUDE-m3l4` into `CLAUDE.md` (if a built CLI is available locally)

---

## Testing Strategy

### Automated:
- Toolkit `build:lessons` is the primary gate — it validates the string→file contract for all four arrays across the three lessons.

### Manual Testing Steps:
1. From a scratch directory, run `npx @przeprogramowani/10x-cli@latest get m3l3` and confirm `CLAUDE.md` gains the m3l3 rule block.
2. Run `get m3l4` and confirm `.claude/prompts/m3l4-e2e-prompt.md` exists and `CLAUDE.md` gains the m3l4 rule.
3. Render/read the m3-l3 and m3-l4 drafts to confirm the `get` blocks sit at first point of use and read naturally.

## Migration Notes

No data migration. Lesson defs were already registered; this fills their content. Spread-chain integrity matters for future module-04 lessons that may import m3l5.

## References

- Brief: `projects/edu-platform/workbench/toolkit-l3-l4-l5.md`
- Format exemplars: `10x-toolkit/packages/ai-artifacts/prompts/m3l2-ad-hoc-testing.md`, `.../rules/CLAUDE-m3l2.md`
- Wiring exemplar: `10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-02.ts`
- Resolver: `10x-toolkit/packages/course-content/src/build/core.ts:39-50`
- CLI delivery: `10x-cli/src/lib/writer.ts` (configs branch ~296-304), `src/lib/tool-profile.ts`
- Source hooks: `/Users/admin/code/10xcards-m3l3-injection/.claude/settings.json`
- Draft insertion points: `m3-l3/lesson-draft.md:62`, `m3-l4/lesson-draft.md:130`, prompt-template `m3-l4/lesson-draft.md:136-156`

## Side-Effect Ledger

```
New claims introduced: (none — artifacts restate existing draft content)
Claims removed: (none)
Neighboring lesson references changed: lesson-03/04/05.ts summaries filled; spread chain extended m3l2→m3l3→m3l4→m3l5
Prework references used: (none)
Prework concepts repeated intentionally: (none)
Potential duplicates: (none — first E2E/hooks/debug artifacts in the toolkit)
Unsupported facts: (none)
Video/text mismatches: (none — not touching video scenarios)
Needs human decision: (none — both prior flags resolved). m3-l2 stray-backtick typo already fixed by commit 1381a4e0 (fence is clean, no action). m3-l2 title vs. cross-reference label: user decided to KEEP the content label "Testy jednostkowe i integracyjne z agentem (M3L2)" in m3-l5 (reads naturally, does not break) — no edit.
```

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: m3-l3 — Hooks rule, wiring, draft get block

#### Automated
- [x] 1.1 lesson-03.ts type-checks (via Phase 4 build) — 9d16ec8
- [x] 1.2 CLAUDE-m3l3.md resolves at expected path — 9d16ec8

#### Manual
- [ ] 1.3 get m3l3 block reads naturally at first hook use
- [ ] 1.4 Rule content matches the draft hooks model without invented claims

### Phase 2: m3-l4 — E2E prompt + rule, wiring, draft get block

#### Automated
- [x] 2.1 lesson-04.ts type-checks (via Phase 4 build) — 183b07a
- [x] 2.2 m3l4-e2e-prompt.md and CLAUDE-m3l4.md resolve at expected paths — 183b07a

#### Manual
- [ ] 2.3 Prompt template is byte-faithful to draft; example renders
- [ ] 2.4 Rule captures E2E rules + anti-patterns without scope-stealing
- [ ] 2.5 get m3l4 block reads naturally at the prompt-template section

### Phase 3: m3-l5 — Wiring only

#### Automated
- [x] 3.1 lesson-05.ts type-checks (via Phase 4 build) — fbaec49

#### Manual
- [ ] 3.2 No get m3l5 block added; m3-l5 draft untouched
- [ ] 3.3 l5 inherits accumulated skills/prompts from l4

### Phase 4: Build, validate, smoke-test delivery

#### Automated
- [x] 4.1 npm run build:lessons exits 0 with no missing-artifact errors
- [x] 4.2 course-content type-check/build passes

#### Manual
- [ ] 4.3 Resolved m3l3/m3l4 bundles contain new rule/prompt content
- [ ] 4.4 Smoke `10x get m3l4` writes prompt + merges rule (if built CLI available)
