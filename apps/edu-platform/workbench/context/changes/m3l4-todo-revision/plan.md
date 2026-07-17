# M3L4 [todo] Revision — Implementation Plan

## Overview

The author revised `lessons/m3-l4/lesson-draft.md` ("Testy E2E: Playwright, MCP i multimodalne scenariusze") and left 10 `[todo]` comments. This plan resolves all of them across three repos/areas:

- **Workbench prose** (`lessons/m3-l4/lesson-draft.md`, `lessons/m3-l5/lesson-draft.md`)
- **Curriculum contract** (`lessons-schema.json`, slots `m3-l4` and `m3-l5`)
- **Delivery artifacts** (toolkit `/Users/admin/code/10x-toolkit/` — new `/10x-e2e` skill, retired/rewired `CLAUDE-m3l4` + `m3l4-e2e-prompt`)

Two decisions drive the plan (confirmed with the author):

1. **Group A (todos #1-4):** E2E rules + the five anti-patterns + the seed-test pattern + the prompt-template are consolidated into a **new `/10x-e2e` skill**. `CLAUDE-m3l4` shrinks to a **thin pointer** ("for E2E tests use `/10x-e2e`" + 2-3 hard rules); the standalone `m3l4-e2e-prompt` is **absorbed** into the skill's `references/`. The lesson stops dumping rule/anti-pattern blocks inline and references the skill. The existing optional Deep Dive exercise ("Workflow E2E jako skill") is reframed as: learners on non-Playwright stacks build their own `/10x-e2e` variant.
2. **Group B (todos #5-7):** M3L4 keeps vision as a **light supplement only**. The VLM model categories (frontier/budget/open-weight), per-screenshot cost, and model-selection guidance — which already **violate M3L4's own `mustNotCover`** ("VLM model comparison, benchmarking, or cost optimization") — **move to M3L5** (debugging) as a new "vision-as-diagnostic" section. Schema updated for both lessons.

Group C (todos #8-10) is mechanical: two links and a fixture caption fix.

## Current State Analysis

### The 10 todos (locations in `lessons/m3-l4/lesson-draft.md`)

| # | Line | Group | Summary |
|---|------|-------|---------|
| 1 | 214 | A | E2E rules shouldn't be inline — should live in a skill reference / `context/foundation/e2e-quality-rules.md` / `tests/docs/` |
| 2 | 253 | A | Pack should ship a dedicated rules file, not append `CLAUDE-m3l4` to `CLAUDE.md` |
| 3 | 381 | A | Anti-patterns should live in repo as `e2e-anti-patterns.md` next to `e2e-rules.md` |
| 4 | 382 | A | Re-prompt should be simpler — reference the anti-pattern doc, optionally name the spotted bad practice |
| 5 | 459 | B | Vision example (DOM checks 3 cards vs vision checks they look like cards) is weak — more a capability description |
| 6 | 476 | B | "Does this layout look right?" fits debugging, not testing — rebalance accents between the two lessons |
| 7 | 487 | B | VLM model categories/selection belong in M3L5 (debugging); in testing we rely on deterministic tools (`toMatchSnapshot`) |
| 8 | 609 | C | Add Stagehand link |
| 9 | 616 | C | Add Page Object Model link |
| 10 | 649 | C | Verify the `base.extend` fixture example is correct |

### Key Discoveries

- **Toolkit delivery model** (`references/10x-content-delivery.md:53-64`): artifact types are `skills | prompts | configs | rules`. Rules land as a **sentinel block in `CLAUDE.md`** (auto-read by the agent). There is no "standalone `.md` into the repo root" type except `configs` (→ `.claude/config-templates/`) or files inside a skill's `references/`. **This is why "deliver `e2e-rules.md` as a file" needed an architectural decision** → resolved by the skill.
- **Current m3l4 artifacts** (`10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-04.ts:10-16`): ships prompt `m3l4-e2e-prompt` + rule `CLAUDE-m3l4`.
- **`CLAUDE-m3l4.md` already contains the full content** the skill will absorb: E2E rules (`10x-toolkit/packages/ai-artifacts/rules/CLAUDE-m3l4.md:27-50`), the five anti-patterns (`:52-58`), the vision/healer boundary (`:62-66`), lesson boundaries (`:68-75`), and paths (`:77-83`). The skill body is largely a restructure of this file, not net-new authoring.
- **`m3l4-e2e-prompt.md`** exists at `10x-toolkit/packages/ai-artifacts/prompts/m3l4-e2e-prompt.md` — becomes the skill's prompt-template reference.
- **M3L4 schema** (`lessons-schema.json`, slot `m3-l4`):
  - `owns` includes "Vision-based multimodal verification as supplement: ... cost/reliability tradeoffs, when NOT to use" and an explicit E2E-rules-as-project-rules ownership line.
  - `mustNotCover` **already lists** "VLM model comparison, benchmarking, or cost optimization" and "Page Object Model pattern tutorial (Deep Dive only, not core)" — so the draft's frontier/budget/open-weight breakdown (draft lines 478-487) and `$0.01/screenshot` cost (line 463) are **out of bounds today**. Group B realigns the draft with the contract.
- **M3L5 schema** (slot `m3-l5`): `owns` covers the agent diagnostic workflow with "Playwright CLI/MCP diagnostic capabilities ... browser_console_messages, browser_network_requests" but has **no vision/VLM ownership**. `mustNotCover` forbids "E2E test generation or Playwright setup" (not vision). **M3L5 draft currently has zero vision coverage** (grep confirmed) — so a new vision-as-diagnostic section + an `owns` line is required, with no duplication risk.
- **M3L5 maturity**: M3L5 already has an `rc-review.md` and a 32KB draft. Adding the vision section means M3L5 will need a re-run of `lesson-editor-pl` → `lesson-rc-review` (see memory: editor before RC, never parallel).
- **Fixture (todo #10)**: the `base.extend<{ deckName: string }>` example (draft lines 636-646) **is valid, idiomatic Playwright** (setup → `use(name)` → teardown). Only nuances: the `import { test as base } from '@playwright/test'` line isn't shown, and teardown assumes a selected/visible deck. Verdict: keep the example, fix only the caption/note.
- **Group C links**: Stagehand `https://github.com/browserbase/stagehand` is **already** in Materiały dodatkowe (draft line 718); the inline Deep Dive mention (line 609) just needs the same link. POM canonical doc: `https://playwright.dev/docs/pom`.

## Desired End State

- All 10 `[todo]` markers removed from `lessons/m3-l4/lesson-draft.md`, each resolved (not deleted-and-ignored).
- M3L4 prose references the `/10x-e2e` skill instead of inlining the full E2E rules block and full re-prompt blocks; the re-prompt section is shorter and points at the skill's anti-pattern reference.
- M3L4 vision section is a light supplement (DOM default, `toMatchSnapshot`/Argos/Lost Pixel for pixel regression, vision for visual-only risks) with a one-line handoff to M3L5; no model-category/cost/selection content.
- M3L5 has a complete vision-as-diagnostic section (model categories, cost, selection, when vision vs deterministic), owned in schema.
- `lessons-schema.json` updated for both slots so draft ↔ contract are aligned.
- Toolkit ships the `/10x-e2e` skill; `CLAUDE-m3l4` is a thin pointer; `m3l4-e2e-prompt` is absorbed; `lesson-04.ts` artifacts rewired.
- Side-Effect Ledger produced; both lessons flagged for `lesson-editor-pl` → `lesson-rc-review`.

### Verification

- `grep -n '\[todo' lessons/m3-l4/lesson-draft.md` returns nothing.
- `python3 -c "import json; json.load(open('lessons-schema.json'))"` parses cleanly.
- Toolkit builds: `pnpm --filter @przeprogramowani/course-content build:lessons` succeeds and `dist/10xdevs3/lessons/m3l4.json` reflects the new skill.

## What We're NOT Doing

- **Not** building the learner's own E2E skill for them — that stays an optional exercise; we only ship the canonical `/10x-e2e`.
- **Not** re-teaching unit tests (m3-l2), hooks (m3-l3), test-plan creation (m3-l1), or CI/CD authoring (m1-l5/m2-l5).
- **Not** expanding Page Object Model beyond the existing Deep Dive mention (schema `mustNotCover`).
- **Not** turning M3L5 into a vision tutorial — vision is a supplementary diagnostic aid there, subordinate to Sentry + Playwright console/network diagnostics.
- **Not** running `lesson-editor-pl` / `lesson-rc-review` inside this plan — those are flagged as the handoff (Phase 5), run separately.
- **Not** changing lesson order, learning outcomes wording beyond what the vision move requires, or any other lesson's content.
- **Not** re-recording video scenarios in this plan (V3b review placeholder at draft line 386 stays; note any vision/video mismatch in the ledger).

## Implementation Approach

Contract-first, then delivery, then prose. Schema is the source of truth (workbench rule), so it changes first to set the M3L4/M3L5 vision boundary and the rules→skill ownership. The toolkit skill is built next so the M3L4 prose has a real artifact to reference. Then M3L4 prose, then M3L5 prose, then editorial handoff. M3L4 and M3L5 schema edits are batched in Phase 1 because this is an intentional two-lesson boundary change (the workbench "touch only the target lesson" rule is explicitly overridden here by the author-approved cross-lesson scope).

## Phase 1: Schema (curriculum contract)

### Overview
Realign `lessons-schema.json` so the M3L4/M3L5 vision boundary and the rules-delivery change are encoded before any prose moves.

### Changes Required:

#### 1. m3-l4 slot — vision lighter, rules→skill
**File**: `lessons-schema.json` (slot `lessonId: "m3-l4"`)

**Intent**: Narrow vision ownership to "light supplement + handoff" and reflect that E2E rules/anti-patterns are now delivered via the `/10x-e2e` skill rather than an inline `CLAUDE.md` rules block.

**Contract**:
- `owns`: soften the vision line to emphasize *supplement + deterministic-tools-first + pointer to M3L5* (remove "cost/reliability tradeoffs" framing that implies model comparison). Keep `--caps=vision` mention.
- `owns`: adjust the two rules-related lines ("E2E testing rules as project rules" and the seed-test line) to note delivery via the `/10x-e2e` skill (single source) with a thin `CLAUDE.md` pointer — not a full inline rules block.
- `referencesOnly`: add a line referencing M3L5 for vision-based visual diagnosis / VLM model selection (forward continuity).
- `mustNotCover`: keep the existing "VLM model comparison, benchmarking, or cost optimization" line (now actually enforced) — no change needed, but verify it's present.
- Add `/10x-e2e` to the relevant `owns`/delivery note as the canonical E2E artifact.

#### 2. m3-l5 slot — own vision-as-diagnostic
**File**: `lessons-schema.json` (slot `lessonId: "m3-l5"`)

**Intent**: Give M3L5 ownership of the vision/VLM material moving in from M3L4, scoped to debugging/diagnosis (not test generation).

**Contract**:
- `owns`: add a line — "Vision-based visual diagnosis as supplementary debug signal: screenshot + VLM evaluation, VLM model categories (frontier/budget/open-weight), cost/latency, when vision vs deterministic tools — diagnostic use, not test generation."
- `referencesOnly`: add/confirm a line pointing back to m3-l4 for vision-as-test-supplement (so the two lessons cross-reference cleanly).
- `mustNotCover`: leave "E2E test generation or Playwright setup" as-is (vision-as-diagnostic is distinct). Optionally add a clarifier that vision-as-test-supplement framing belongs to m3-l4.
- Consider whether a `requiredFragments` entry for the vision-diagnostic beat is warranted (the slot already has a rich `requiredFragments` list) — add one short entry so the section isn't dropped in a future M3L5 revision.

### Success Criteria:

#### Automated Verification:
- Schema still valid JSON: `python3 -c "import json; json.load(open('lessons-schema.json'))"`
- Only the two target slots changed: `git diff lessons-schema.json` touches `m3-l4` and `m3-l5` objects only.

#### Manual Verification:
- M3L4 `owns`/`mustNotCover` no longer contradict each other on vision (no "owns model tradeoffs" vs "mustNotCover model comparison").
- M3L5 `owns` clearly scopes vision to diagnosis, and `dependsOn`/`preparesFor` links remain coherent.

---

## Phase 2: Toolkit — `/10x-e2e` skill + artifact rewiring

### Overview
Create the canonical `/10x-e2e` skill, shrink `CLAUDE-m3l4` to a thin pointer, absorb `m3l4-e2e-prompt`, and rewire `lesson-04.ts`.

### Changes Required:

#### 1. New skill `10x-e2e`
**File**: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-e2e/SKILL.md` (+ `references/`)

**Intent**: Single source of truth for the E2E generation workflow. Body orchestrates the flow; heavy content lives in `references/` (progressive disclosure).

**Contract**:
- `SKILL.md` frontmatter: `name: 10x-e2e`, `description:` covering when to invoke (generating/reviewing an E2E test for a risk from `context/foundation/test-plan.md`). Body ≤ ~500 lines: workflow = pick top risk → generate per seed + rules → review against 5 anti-patterns → re-prompt → verify assertion vs risk. Mirror the Deep Dive "Jak go zbudować" steps (draft lines 695-699) so the lesson and skill agree.
- `references/e2e-quality-rules.md`: the rules block currently at `CLAUDE-m3l4.md:27-50` + the four governing rules (`:45-50`).
- `references/e2e-anti-patterns.md`: the five anti-patterns (`CLAUDE-m3l4.md:52-58`) + re-prompt discipline (`:60`), expanded with the target-pattern fixes from draft lines 319-384.
- `references/seed-test-pattern.md`: the `seed.spec.ts` exemplar (draft lines 188-209) + the four patterns it demonstrates (draft lines 178-186).
- `references/e2e-prompt-template.md`: absorb `prompts/m3l4-e2e-prompt.md` content (the risk/research-anchor/business-scenario/boundaries template).
- Decide tool profile coverage: skill should be stack-aware enough that the "build your own variant" exercise makes sense (note non-Playwright idioms in the rules reference).

#### 2. Shrink `CLAUDE-m3l4` to a thin pointer
**File**: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/rules/CLAUDE-m3l4.md`

**Intent**: Keep an auto-read signal in `CLAUDE.md` without duplicating the skill. Reduce from ~84 lines to a short block.

**Contract**: Replace the full rules/anti-pattern/boundary content with: (a) one line "for E2E tests, use the `/10x-e2e` skill"; (b) 2-3 hard non-negotiable rules (getByRole over CSS/XPath; no `waitForTimeout`; test independence + cleanup); (c) the one-line healer-boundary + DOM-default-vs-vision reminder. Everything else lives in the skill.

#### 3. Rewire lesson artifacts
**File**: `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-04.ts`

**Intent**: Ship the new skill; drop the absorbed prompt.

**Contract**: `artifacts.root.skills` += `"10x-e2e"`; remove `"m3l4-e2e-prompt"` from `prompts` (absorbed) — OR keep it if a standalone prompt is still wanted (default: remove per the "skill absorbs prompt" decision). Keep `rules: ["CLAUDE-m3l4"]` (now thin). Update the lesson `summary` string to mention `/10x-e2e` instead of "ships the `m3l4-e2e-prompt` prompt and the `CLAUDE-m3l4` rule".
- Delete or archive `prompts/m3l4-e2e-prompt.md` if removed from the manifest (check no other lesson references it: `grep -rn m3l4-e2e-prompt packages/`).

### Success Criteria:

#### Automated Verification:
- Course-content builds: `pnpm --filter @przeprogramowani/course-content build:lessons`
- `dist/10xdevs3/lessons/m3l4.json` contains the `10x-e2e` skill and no dangling `m3l4-e2e-prompt` reference: `grep -c '10x-e2e' .../dist/10xdevs3/lessons/m3l4.json`
- No orphan reference to a removed prompt: `grep -rn m3l4-e2e-prompt packages/ || true`

#### Manual Verification:
- `/10x-e2e` `SKILL.md` body reads as a runnable workflow, `references/` load the heavy content on-demand.
- Thin `CLAUDE-m3l4` still gives an agent enough to do the right thing before the skill is invoked.

---

## Phase 3: M3L4 draft prose

### Overview
Edit `lessons/m3-l4/lesson-draft.md` to resolve todos #1-10's prose side: reference the skill, simplify the re-prompt, lighten vision, fix Group C.

### Changes Required:

#### 1. Group A — rules block → skill reference (todos #1, #2, #3)
**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Stop inlining the full E2E rules block and the "package delivers CLAUDE-m3l4" framing; point at `/10x-e2e`.

**Contract**:
- Section "Seed test i reguły jakości" (~lines 213-238): replace the inline ```markdown rules block (lines 220-234) with a short prose summary + "pełny zestaw reguł i antywzorców dostaje agent przez skill `/10x-e2e`". Remove the `[todo]` at line 214.
- "Pobierz paczkę artefaktów" block (~lines 246-253): update to reflect `npx @przeprogramowani/10x-cli@latest get m3l4` delivering the `/10x-e2e` skill + thin `CLAUDE-m3l4` pointer (not a full rules block). Remove `[todo]` at line 253. Use the canonical `@latest` CLI form (`references/10x-content-delivery.md:18`).
- Keep the seed-test code example (it's pedagogically core and `owns`-listed).

#### 2. Group A — simplify re-prompt (todo #4)
**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Shorten the three full re-prompt blocks (lines 344-384) into one shorter pattern that references the skill's anti-pattern reference and optionally names the spotted bad practice.

**Contract**: Replace the three verbatim ```text blocks with: one compact example + the rule "wskaż antywzorzec (po nazwie z `/10x-e2e`), powiedz dlaczego nie chroni ryzyka, podaj wzorzec docelowy". Remove both `[todo]`s at lines 381-382. Keep the V3b VIDEO PLACEHOLDER (line 386) but verify it still matches the slimmed text (note any mismatch in ledger).

#### 3. Group B — lighten vision (todos #5, #6, #7)
**File**: `lessons/m3-l4/lesson-draft.md`, section "MCP i tryb wizyjny" (~lines 406-487)

**Intent**: Keep CLI-vs-MCP table + a short vision-as-supplement explanation; remove the weak example, the "does this look right?" testing framing, and all model-category/cost/selection content (moved to M3L5).

**Contract**:
- Keep: CLI vs MCP table (lines 412-417) + decision heuristic; the `--caps` flag mention; the "Praktyczna reguła" list (lines 469-473: DOM default / Vision supplement / deterministic tools).
- Soften the weak DOM-vs-vision example (lines 458-459) to a one-line capability statement; remove `[todo]` at 459.
- Remove the "czy ten układ wygląda poprawnie?" testing framing (lines 475-476) and replace with a sentence that this judgment-call use is a **debugging** aid, covered in M3L5; remove `[todo]` at 476.
- **Cut** the cost paragraph (line 463), the model-category list + "Który model?" (lines 478-486), and the model-refresh note (line 486); replace with one handoff sentence to M3L5. Remove `[todo]` at 487.
- Keep the vision flowchart diagram (lines 439-456) only if it still fits the lightened section; otherwise note for re-render via the `mermaid` skill.

#### 4. Group C — links + fixture (todos #8, #9, #10)
**File**: `lessons/m3-l4/lesson-draft.md`

**Intent**: Mechanical fixes.

**Contract**:
- Line 609: wrap "Stagehand" / add `(browserbase/stagehand)[https://github.com/browserbase/stagehand]` inline link; remove `[todo]`. (Same URL already in Materiały dodatkowe line 718.)
- Line 616: add Page Object Model link `https://playwright.dev/docs/pom`; remove `[todo]`. Keep within the existing Deep Dive mention scope (schema `mustNotCover` allows mention only).
- Line 649: fixture is valid — remove `[todo]`; adjust the caption to note teardown assumes a selected deck and that `import { test as base }` is elided for brevity. Keep the code.

### Success Criteria:

#### Automated Verification:
- No todos remain: `grep -n '\[todo' lessons/m3-l4/lesson-draft.md` → empty.
- Both new links resolve in the file: `grep -c 'github.com/browserbase/stagehand\|playwright.dev/docs/pom' lessons/m3-l4/lesson-draft.md`
- Canonical section order intact (title → core → Zadania → Odznaka → Deep Dive → Materiały) per `references/lesson-structure.md`.

#### Manual Verification:
- Vision section no longer contains model categories/cost; reads as a clean supplement + handoff.
- Rules/re-prompt sections reference `/10x-e2e` and read coherently (no dangling "section wyżej" pointing at a removed block).
- Practical-tasks section (lines 522-576) still consistent with the slimmed core (esp. "Seed test i reguły testowania" task lines 524-530 — update to reference `/10x-e2e`).

---

## Phase 4: M3L5 draft — vision-as-diagnostic section

### Overview
Add a complete vision-as-diagnostic section to `lessons/m3-l5/lesson-draft.md`, receiving the model material from M3L4.

### Changes Required:

#### 1. New vision-as-diagnostic section
**File**: `lessons/m3-l5/lesson-draft.md`

**Intent**: Position vision as a supplementary debug signal alongside Sentry + Playwright console/network diagnostics — for UI bugs the DOM/logs can't explain (layout regression, z-index, overlap discovered during reproduction).

**Contract**:
- Add a core subsection (placement: after the Playwright diagnostic-tools beat, before Deep Dive — fit to the existing M3L5 flow; read the draft to find the exact anchor). Content moved from M3L4:
  - When a visual bug surfaces during local reproduction and DOM/logs are silent → screenshot + VLM "what's wrong here?" as a diagnostic question (this is the *debugging* home for the "does this look right?" framing M3L4 hands off).
  - VLM model categories: frontier (Claude Opus / GPT-5.x), budget (Gemini Flash — reasonable CI default), open-weight (Qwen-VL). Cost/latency note (~$0.01 + 2-3s per screenshot via API; local = free, slower).
  - Limits: coordinate drift toward viewport center, visual hallucinations (false alarms vs dangerous false negatives), prompt precision.
  - Boundary line: for pixel-level regression in *tests*, deterministic tools (`toMatchSnapshot`, Argos, Lost Pixel) — that's M3L4's testing job; here vision answers an open diagnostic question.
- Add to `## 📚 Materiały dodatkowe`: the VLM Visual Testing link (Zak El Fassi — already in M3L4 line 716) if relevant to M3L5.
- Follow `references/lesson-structure.md` (H2/H3 rules, Deep Dive intro convention if touched).

### Success Criteria:

#### Automated Verification:
- Section present: `grep -n -i 'wizyj\|VLM\|vision' lessons/m3-l5/lesson-draft.md` returns the new section.
- Canonical section order intact in M3L5.

#### Manual Verification:
- Vision reads as subordinate to Sentry/Playwright diagnostics, not as a new testing topic (respects M3L5 `owns` scope from Phase 1).
- No duplication with M3L4's lightened vision supplement; the two cross-reference cleanly.
- Model names framed as "category over exact name, refresh periodically" (avoids staleness, matches M3L4's prior framing).

---

## Phase 5: Editorial + RC handoff

### Overview
Produce the Side-Effect Ledger and stage both lessons for the editor→RC pipeline. No editorial pass is run inside this plan.

### Changes Required:

#### 1. Side-Effect Ledger
**File**: `context/changes/m3l4-todo-revision/side-effect-ledger.md` (new)

**Intent**: Document content-level effects per the workbench discipline.

**Contract**: Fill the ledger template (New claims / Claims removed / Neighboring lesson references changed / Prework references / Repeated concepts / Potential duplicates / Unsupported facts / Video/text mismatches / Needs human decision). Key entries: claims *moved* M3L4→M3L5 (vision model material); neighboring-reference change (M3L4↔M3L5 vision cross-link); potential video mismatch (V3b at M3L4 line 386 after re-prompt slim; any M3L4 vision video beat now pointing at M3L5).

#### 2. Stage editor → RC
**File**: (process note in `change.md`)

**Intent**: Both M3L4 and M3L5 drafts changed materially → both need `lesson-editor-pl` then `lesson-rc-review`, sequentially (memory: editor before RC, never parallel).

**Contract**: Update `change.md` status to `in-progress`/`done` as appropriate and record the handoff: run `lesson-editor-pl` on m3-l4, then m3-l5; then `lesson-rc-review` on each. Note M3L5 had a prior RC — its new section invalidates that, re-review required.

### Success Criteria:

#### Automated Verification:
- Ledger file exists: `ls context/changes/m3l4-todo-revision/side-effect-ledger.md`
- No `[todo]` anywhere in either draft: `grep -rn '\[todo' lessons/m3-l4/lesson-draft.md lessons/m3-l5/lesson-draft.md` → empty.

#### Manual Verification:
- Ledger captures the M3L4→M3L5 content move and any video mismatch.
- Author agrees both lessons are ready for the editor→RC pipeline.

---

## Testing Strategy

This is editorial + delivery work; "tests" are structural and build checks:

- **Schema**: JSON validity + scope-of-diff check (Phase 1).
- **Toolkit**: `build:lessons` + bundle grep for the new skill / absent prompt (Phase 2).
- **Drafts**: `[todo]` absence, link presence, canonical section order (Phases 3-4).
- **Cross-lesson**: manual read of M3L4↔M3L5 vision boundary for no-overlap / clean handoff.

### Manual Testing Steps
1. Read M3L4 vision section end-to-end — confirm it's a supplement + handoff, no model categories.
2. Read M3L5 new section — confirm it's diagnostic-framed and owns the model material.
3. Invoke `/10x-e2e` mentally against the lesson's workflow steps — confirm parity.
4. Diff `lessons-schema.json` — confirm only m3-l4/m3-l5 changed and contradictions are gone.

## Migration Notes

- If `m3l4-e2e-prompt` is removed from the manifest, learners who previously ran `get m3l4` will have an orphaned `.claude/prompts/m3l4-e2e-prompt.md`; the CLI manifest cleanup (`references/10x-content-delivery.md:128-133`) handles removed artifacts on next `get m3l4`. Note this in the ledger.
- `CLAUDE-m3l4` shrinking is idempotent via the sentinel block — re-running `get m3l4` overwrites the managed block.

## References

- Change identity: `context/changes/m3l4-todo-revision/change.md`
- Draft under revision: `lessons/m3-l4/lesson-draft.md`
- Neighboring draft: `lessons/m3-l5/lesson-draft.md`
- Contract: `lessons-schema.json` (slots `m3-l4`, `m3-l5`)
- Delivery model: `references/10x-content-delivery.md`
- Structure rules: `references/lesson-structure.md`
- Current rule absorbed by skill: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/rules/CLAUDE-m3l4.md`
- Lesson wiring: `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-04.ts`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Schema (curriculum contract)

#### Automated
- [x] 1.1 Schema still valid JSON (`python3 -c "import json; json.load(...)"`) — 3ad574ae
- [x] 1.2 Diff touches only m3-l4 and m3-l5 slots — 3ad574ae

#### Manual
- [x] 1.3 M3L4 owns/mustNotCover no longer contradict on vision — 3ad574ae
- [x] 1.4 M3L5 owns scopes vision to diagnosis; dependsOn/preparesFor coherent — 3ad574ae

### Phase 2: Toolkit — `/10x-e2e` skill + artifact rewiring

#### Automated
- [x] 2.1 Course-content builds (`build:lessons`) — 56e774b
- [x] 2.2 `m3l4.json` bundle contains `10x-e2e`, no dangling `m3l4-e2e-prompt` — 56e774b
- [x] 2.3 No orphan reference to removed prompt in `packages/` — 56e774b

#### Manual
- [x] 2.4 `/10x-e2e` SKILL.md reads as runnable workflow; references load on-demand — 56e774b
- [x] 2.5 Thin `CLAUDE-m3l4` is sufficient pre-skill signal — 56e774b

### Phase 3: M3L4 draft prose

#### Automated
- [x] 3.1 No `[todo]` remains in m3-l4 draft — 8669d151
- [x] 3.2 Stagehand + POM links present — 8669d151
- [x] 3.3 Canonical section order intact — 8669d151

#### Manual
- [x] 3.4 Vision section is supplement + handoff, no model categories/cost — 8669d151
- [x] 3.5 Rules/re-prompt reference `/10x-e2e`, no dangling cross-refs — 8669d151
- [x] 3.6 Practical-tasks section consistent with slimmed core — 8669d151

### Phase 4: M3L5 draft — vision-as-diagnostic section

#### Automated
- [x] 4.1 Vision section present in m3-l5 draft — 41158600
- [x] 4.2 Canonical section order intact in M3L5 — 41158600

#### Manual
- [x] 4.3 Vision framed as diagnostic, subordinate to Sentry/Playwright — 41158600
- [x] 4.4 No duplication with M3L4; clean cross-reference — 41158600
- [x] 4.5 Model names framed as category-over-exact-name — 41158600

### Phase 5: Editorial + RC handoff

#### Automated
- [x] 5.1 Side-effect ledger file exists — fd9105ed
- [x] 5.2 No `[todo]` in either draft — m3-l4 clean; m3-l5 6 todos deferred per author (separate session) — fd9105ed

#### Manual
- [x] 5.3 Ledger captures M3L4→M3L5 move + video mismatch — fd9105ed
- [x] 5.4 Both lessons staged for lesson-editor-pl → lesson-rc-review — fd9105ed
