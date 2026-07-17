---
date: 2026-05-28T12:00:00+02:00
researcher: Claude (Opus 4.6)
git_commit: 537a1f22
branch: master
repository: przeprogramowani-sites
topic: "Revise m3-l3 TODOs, verify cross-lesson coherence with m3-l1/l2, validate against real 10xCards test-plan"
tags: [research, m3-l3, hooks, cross-lesson-coherence, test-plan-mapping, editorial-iteration]
status: complete
last_updated: 2026-05-28
last_updated_by: Claude (Opus 4.6)
---

# Research: m3-l3 TODO Revision and Cross-Lesson Coherence Check

**Date**: 2026-05-28T12:00:00+02:00
**Researcher**: Claude (Opus 4.6)
**Git Commit**: 537a1f22
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Revise all `[todo]` comments in `lessons/m3-l3/lesson-draft.md`, verify cross-lesson coherence with the latest m3-l1 and m3-l2 drafts, and validate the hook-to-gate mapping against the real 10xCards test-plan at `/Users/admin/code/10xCards/context/foundation/test-plan.md`.

## Summary

Eight `[todo]` items were found in the m3-l3 draft. Six can be resolved with clear recommendations; two require rewriting (the gate mapping and the tool-agnosticism in practical tasks). The most impactful finding is that **the required/recommended/optional gate taxonomy in m3-l3 does not match the real 10xCards test-plan structure**, which uses required/required-after-phase/deferred — a different and more nuanced scheme. Cross-lesson coherence between m3-l1, m3-l2, and m3-l3 is clean on bridges, terminology, and ownership boundaries, with the gate-taxonomy mismatch being the only inconsistency. Three of four RC review items have been addressed; the jq dependency mention is still missing.

---

## Detailed Findings

### 1. TODO Catalog and Resolution

#### TODO-1 (draft line 145)

> `[todo: do weryfikacji czy to w ogóle ma sens - czy jesteśmy w stanie realnie sterować konfiguracją hooków w oparciu o testing-guide]`

**Context**: After explaining that PostToolUse fires independently per tool call with no built-in aggregation.

**Analysis**: The concept is valid — you CAN configure matchers to target specific file paths/patterns that correspond to risk areas from `test-plan.md`. But the mapping is a **manual design decision**, not an automated pipeline. No tool reads `test-plan.md` and configures hooks from it. The flowchart at lines 130-138 correctly models the decision logic (edit → is file in risk area? → run tests or skip).

**Recommendation**: **Resolve — concept is sound.** Remove the todo. Optionally add one clarifying sentence: the mapping from test-plan risk areas to hook matchers is a design choice you make once, not something the hook system reads automatically. Also note: "testing-guide" in this todo is a stale name from an earlier spec iteration — the draft text itself correctly uses `test-plan.md`.

---

#### TODO-2 (draft line 159)

> `[todo: to jest claude code specific, czy chcemy z tego korzystać?]`

**Context**: Exit code 2 returning `additionalContext` with a 10,000-character limit.

**Analysis**: Two things conflated here:
- **Exit code 2 as blocking signal**: Universal across all five tools (Claude Code, Cursor, Codex, Windsurf, Copilot). All interpret exit code 2 as "block and report."
- **`additionalContext` with 10,000 char cap**: Partially universal. Claude Code (10,000 chars), Cursor (`additional_context`), Codex (`additionalContext`), Copilot (10 KB cap) all support it. Only Windsurf lacks context injection entirely.

The draft correctly uses Claude Code as the primary deep example per spec decision.

**Recommendation**: **Resolve — keep it.** The mechanism is mostly universal. The 10,000-char cap is Claude Code specific — either note it as such or soften to "limit depends on the tool." The prose already explains Windsurf's limitation in the cross-tool section.

---

#### TODO-3 (draft line 176)

> `[todo: upewnijmy się że takie mamy te kody błędów, na ile to jest uniwersalne, czy warto się do tego odwoływać]`

**Context**: Three exit codes: 0 (success), 2 (blocking), other (non-blocking).

**Analysis**: Confirmed universal across all five tools per grounding:

| Tool | 0 | 2 | Other |
|---|---|---|---|
| Claude Code | success | blocking error | non-blocking |
| Cursor | success | block action | failure, fail-open default |
| Codex | success | blocking error | non-blocking |
| Windsurf | success | blocking (pre-hooks only) | error, proceeds |
| Copilot | success | warning/block | logged, continues |

This is one of the strongest cross-tool convergence signals.

**Recommendation**: **Resolve positively — this IS universal and worth teaching.** Remove the todo. The three exit codes are the most portable piece of hook knowledge across all tools.

---

#### TODO-4 (draft line 263)

> `[todo: brakuje nam linków do dokumentacji hooków dla tych narzędzi - dodajmy je również tutaj]`

**Context**: After the cross-tool comparison table (lines 254-261).

**Analysis**: Links to all five tools' hook documentation are already present in `## 📚 Materiały dodatkowe` (lines 393-401). Adding them inline at the comparison table would duplicate content and break the house style from `lesson-structure.md`, which places links in Materiały dodatkowe.

**Recommendation**: **Resolve — don't add inline links.** Instead, add one sentence after the table: "Linki do dokumentacji hooków każdego narzędzia znajdziesz w sekcji Materiały dodatkowe." This handles discoverability without duplication.

---

#### TODO-5 (draft line 268)

> `[todo: sygnał konwergencji to dziwne określenie po polsku]`

**Context**: "Sygnał konwergencji: 1Password opublikował repozytorium `agent-hooks`..."

**Analysis**: "Sygnał konwergencji" is a calque that reads awkwardly in Polish. The intent is clear but the phrasing is unnatural.

**Recommendation**: **Resolve — rephrase.** Options:
- "Trend potwierdza się w praktyce: 1Password opublikował..."
- "Zbieżność widać w praktyce: 1Password opublikował..."
- "Praktyczny dowód: 1Password opublikował..."
- Just restructure: "1Password opublikował repozytorium `agent-hooks`, które jednym skryptem instaluje te same hooki do trzech narzędzi naraz. Jedno źródło hooków, wiele narzędzi — to pokazuje, jak bardzo architektury się zbliżyły."

---

#### TODO-6 (draft line 283) — **CRITICAL**

> `[todo: sprawdźmy czy to faktycznie się poprawnie mapuje na realny plan z /Users/admin/code/10xCards]`

**Context**: The mapping at lines 278-285:
```
- Wymagane bramki → hooki per-edit
- Zalecane bramki → pre-commit
- Opcjonalne bramki → CI
```

**Analysis**: This mapping **does NOT match** the real 10xCards test-plan structure. Detailed comparison:

| m3-l3 draft says | Real 10xCards §5 Quality Gates |
|---|---|
| "Wymagane bramki" (required) → per-edit hooks | "required": lint + typecheck at **local + pre-commit**, not per-edit |
| "Zalecane bramki" (recommended) → pre-commit | Category doesn't exist. Real plan uses "required after §3 Phase N" |
| "Opcjonalne bramki" (optional) → CI | "deferred": CI gating is explicitly deferred ("not v1") |
| (not mentioned) | "post-edit hook / visual diff / multimodal review" is **deferred** ("not v1") |

Key mismatches:
1. **Taxonomy mismatch**: Real plan uses `required / required-after-phase / deferred`, not `required / recommended / optional`.
2. **Per-edit hooks are DEFERRED** in the real plan, not required. The real plan's §5 explicitly lists "post-edit hook" as deferred/not-v1.
3. **E2e** is at "local pre-push" in the real plan, not CI.
4. **CI** is entirely deferred in the real plan.

**Pedagogical tension**: The lesson teaches per-edit hooks as the first quality layer, but the real project decided they weren't worth implementing in v1. This is actually fine pedagogically (the lesson teaches the concept; the project made a specific cost/signal tradeoff), but the heuristic must be honest about this.

**Recommendation**: **Rewrite the mapping.** Two options:

**Option A — Question-based decision**: Replace the three-bullet heuristic with a decision question:
> "Które bramki z twojego planu jakości są wystarczająco szybkie na per-edit? Które powinny czekać na commit? Które potrzebują pełnego środowiska CI?"

Then show the real 10xCards plan as an example where lint fits per-edit, integration tests fit pre-commit, and e2e fits pre-push — with CI deferred in v1.

**Option B — Realistic mapping with the real plan**: Show the actual 10xCards §5 table and walk through which gates map to which layer, including the explicit decision to defer post-edit hooks in this project. This makes the lesson more honest and teaches the tradeoff.

---

#### TODO-7 & TODO-8 (draft lines 301, 313)

> `[todo: ucieknijmy od konkretnych narzędzi i skupmy się na ogólnych zasadach, które można zaimplementować w dowolnym narzędziu]`

**Context**: Practical tasks that reference `.claude/settings.json`, `PostToolUse`, `Write|Edit`, `vitest related`, `AI_AGENT=1`.

**Analysis**: The grounding decision #7 says: "Keep the lesson generalizable." The spec says Claude Code is the primary deep example, but practical tasks should be transferable. Currently the tasks are Claude Code + Vitest specific.

**Recommendation**: **Rewrite tasks to lead with the principle, offer the specific tool as one option.** Example:

> "W swoim projekcie kursowym skonfiguruj hook per-edit, który uruchamia linter po każdej edycji pliku przez agenta. W Claude Code to PostToolUse z matcherem `Write|Edit` w `.claude/settings.json`. W Cursor — `afterFileEdit` w `.cursor/hooks.json`. W Codex — PostToolUse w `.codex/hooks.json`. Wybierz swoje narzędzie i przetestuj."

Same for the test trigger: lead with "use your test runner's related-tests feature" and give Vitest as one example.

---

### 2. Cross-Lesson Coherence

#### Bridges

| Bridge | Status | Evidence |
|---|---|---|
| m3-l2 → m3-l3 | Clean ✓ | m3-l2 line 36: "W następnej lekcji hooki zaczną uruchamiać..." m3-l3 lines 1-11 pick this up directly. |
| m3-l1 → m3-l3 | Clean ✓ | m3-l3 line 272: "W m3-l1 stworzyłeś `context/foundation/test-plan.md` ze strategią i bramkami jakości" — correct reference. |
| m3-l3 → m3-l4 | Clean ✓ | m3-l3 line 287: "Do tego potrzebujesz przeglądarki, Playwrighta i scenariuszy E2E, które postawimy w następnej lekcji." |
| m3-l2 V6 → m3-l3 opening | Clean ✓ | V6: "Bridge do m3-l3: ręczne uruchomienie testów dzisiaj i zapowiedź hooka po edycji w następnej lekcji." |

#### Terminology Consistency

| Term | m3-l1 | m3-l2 | m3-l3 | Status |
|---|---|---|---|---|
| Test strategy artifact | `context/foundation/test-plan.md` | `context/foundation/test-plan.md` | `context/foundation/test-plan.md` | Consistent ✓ |
| Risk areas | "mapa ryzyk", "failure scenarios" | "top ryzyko", "obszar ryzyka" | "obszary ryzyka" | Consistent ✓ |
| Quality gates | "Quality Gates" (§5) | (not discussed) | "bramki jakości" | Consistent ✓ |
| Anti-patterns | (not discussed) | "anti-wzorce" (owned) | (not re-introduced) | Correct boundary ✓ |
| Gate taxonomy | required / required-after-phase / deferred | (not discussed) | **wymagane / zalecane / opcjonalne** | **MISMATCH** ✗ |

**The only terminology inconsistency is the gate taxonomy** (TODO-6). m3-l1 teaches the real taxonomy through the test-plan structure; m3-l3 introduces a simplified but incorrect three-tier heuristic.

#### Concept Ownership Boundaries

All clean:
- m3-l3 does NOT re-teach strategy/risk-map creation (m3-l1 territory) ✓
- m3-l3 does NOT re-teach test writing or anti-patterns (m3-l2 territory) ✓
- m3-l3 does NOT venture into E2E/Playwright (m3-l4 territory) ✓
- m3-l3 correctly draws the self-correction boundary: "trivial autofix only, complex failures → m3-l5" ✓
- m3-l3 owns hook lifecycle, PostToolUse config, three-layer model, pre-commit gate, cross-tool transfer ✓

#### Schema Dependency Chain

```
m3-l1 (globalOrder 11) → m3-l2 (globalOrder 12) → m3-l3 (globalOrder 13) → m3-l4
dependsOn: m2-l5          dependsOn: m3-l1          dependsOn: m3-l2
preparesFor: m3-l2         preparesFor: m3-l3         preparesFor: m3-l4
```

All three have `status: "drafted"` and `requiredArtifacts: [lesson-spec, lesson-draft, video-scenario, rc-review]`. m3-l3 has video-scenario and rc-review artifacts. m3-l1 and m3-l2 also have rc-review artifacts but no video-scenario files yet.

---

### 3. Real 10xCards Test-Plan Mapping

The 10xCards `context/foundation/test-plan.md` (last updated 2026-05-27) provides a concrete case study that the m3-l3 lesson references but doesn't accurately model.

#### Quality Gates Structure (10xCards §5)

| Gate | Where | Required? | Layer in m3-l3 terms |
|---|---|---|---|
| lint + typecheck | local + pre-commit (Husky/lint-staged) | required | Per-edit OR pre-commit |
| unit + integration | local pre-commit | required after Phase 1 | Pre-commit |
| atomic-save transaction | local pre-commit | required after Phase 2 | Pre-commit |
| auth-gate + ownership | local pre-commit | required after Phase 3 | Pre-commit |
| cascade + SRS | local pre-commit | required after Phase 4 | Pre-commit |
| AI-native pre-commit hooks | local pre-commit (Husky) | required after Phase 5 | Pre-commit |
| e2e on critical flows | local pre-push (manual until CI) | required after Phase 6 | Pre-push |
| CI gating | GitHub Actions on PR | **deferred** — not v1 | (deferred) |
| post-edit hook / visual diff | (deferred) | **not v1** | (deferred) |

**Key observation**: The real plan explicitly **defers** post-edit hooks to "not v1." This is a legitimate cost/signal tradeoff for a 1-week solo MVP. The m3-l3 lesson teaches hooks as the first layer, which is correct architecturally, but the real project chose not to implement them yet.

**Recommendation for the lesson**: Use this as an honest teaching moment. Show the real plan's decision and explain: "Your project may also decide that per-edit hooks aren't worth the investment right now. That's a valid choice — the three-layer model is a menu, not a mandate. Start where the cost/signal ratio is best for you."

#### Phased Rollout Structure (10xCards §3)

6 phases, each opening a `/10x-new` change folder. Phase 1 is `researched`, phases 2-6 are `not started`. This confirms the m3-l1 → m3-l2 → m3-l3 progression: m3-l1 created the plan, m3-l2 would implement Phase 1 tests, m3-l3 would wire hooks to run those tests automatically.

#### Cookbook Patterns (10xCards §6)

All TBD — confirming m3-l1's teaching that cookbook fills in as phases ship. The draft correctly references this at line 127-128.

---

### 4. RC Review Items Status

Cross-referencing `rc-review.md` acceptance checklist against the current draft:

| Item | RC Status | Current Status | Evidence |
|---|---|---|---|
| Spec compliance blockers | ✓ | ✓ | No changes needed |
| Unsupported factual claims | ✓ | ✓ | No changes needed |
| Neighboring lesson drift | ✓ | ✓ | No changes needed |
| Editorial polish | ✓ | ✓ | No changes needed |
| Mermaid diagram language consistency | ✗ (2 nodes) | **Partially addressed** | Line 131 now reads "obszarze ryzyka" (fixed). Line 188 "related tests" remains (acceptable technical vocab). Need to verify line 191 for "pełny suite" → current text says "pełniejsze testy" (fixed). |
| First hook project-wide note | ✗ | **Addressed** ✓ | Line 72: "Zwróć uwagę, że ta komenda uruchamia ESLint na całym projekcie. W małych projektach to wystarczające..." |
| jq dependency mention | ✗ | **Still pending** ✗ | No mention of jq as a requirement near line 116-123. Learners who copy-paste the hook will get "command not found" if jq is missing. |
| Video scenario deferred | deferred | deferred | Separate artifact per workbench workflow. |

---

## Architecture Insights

### The Three Lessons Form a Clean Pipeline

```
m3-l1: WHAT to test (risk map, quality gates, phased rollout)
  ↓
m3-l2: HOW to write tests (prompt-template, anti-patterns, review ritual)
  ↓
m3-l3: WHEN to run tests (per-edit hooks, pre-commit gates, cross-tool transfer)
```

Each lesson consumes the previous lesson's artifact and produces a new one. The concept ownership is clear and there's no significant drift.

### The Gate Taxonomy Is the One Inconsistency

m3-l1 teaches the real taxonomy (`required / required-after-phase / deferred`) through the test-plan structure. m3-l3 introduces a simplified heuristic (`wymagane / zalecane / opcjonalne`) that doesn't map to the real plan. Fixing this is the highest-priority editorial action.

### The Real Project vs. The Lesson's Ideal

The 10xCards test-plan defers per-edit hooks. The lesson teaches them as the first layer. This is pedagogically fine but the lesson should acknowledge the tradeoff explicitly, not imply every project should start with per-edit hooks.

---

## Open Questions

1. **Gate taxonomy fix**: Should the lesson use the real plan's taxonomy, or introduce a universal simplified heuristic that acknowledges it doesn't match every plan structure? (Needs human decision.)
2. **jq dependency**: Add inline mention or suggest an alternative that doesn't require jq (e.g., a bash-only approach)? (Minor editorial, can be decided during plan phase.)
3. **Tool-agnostic tasks**: Full rewrite of both practical tasks, or just add "or equivalent in your tool" annotations? (Affects scope of the iteration.)

## Code References

- `lessons/m3-l3/lesson-draft.md` — 8 `[todo]` items at lines 145, 159, 176, 263, 268, 283, 301, 313
- `lessons/m3-l3/rc-review.md` — acceptance checklist with 3/4 items addressed
- `lessons/m3-l1/lesson-draft.md` — bridge-out at line 36 (implicit in m3-l2 V6)
- `lessons/m3-l2/lesson-draft.md` — explicit bridge at lines 36-37
- `/Users/admin/code/10xCards/context/foundation/test-plan.md` — §5 Quality Gates, §3 Phased Rollout
- `lessons-schema.json` — m3-l1/l2/l3 entries (all status: "drafted")

## Prioritized Action Items

| # | Item | Severity | Scope |
|---|---|---|---|
| 1 | Rewrite gate mapping (TODO-6) to match real test-plan taxonomy | High | Lines 278-285 + surrounding paragraph |
| 2 | Rewrite practical tasks for tool-agnosticism (TODO-7, TODO-8) | Medium | Lines 291-325 |
| 3 | Add jq dependency mention (RC review item) | Minor | 1 sentence near line 116 |
| 4 | Fix "sygnał konwergencji" phrasing (TODO-5) | Minor | Line 268 |
| 5 | Resolve TODO-1 (remove todo, concept is sound) | Minor | Remove line 145 |
| 6 | Resolve TODO-2 (keep, note Claude Code specificity) | Minor | Remove line 159 |
| 7 | Resolve TODO-3 (exit codes are universal, keep) | Minor | Remove line 176 |
| 8 | Resolve TODO-4 (add pointer to Materiały dodatkowe) | Minor | Line 263 → 1 sentence |
