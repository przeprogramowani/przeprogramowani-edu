# RC Review: m1-l4 — Agent Onboarding: Agents.md, AI Rules i feedback loops

## Verdict

Not ready

## Findings

### Major: Spec/schema nadal wymagają celowo usuniętego inner loop

- Evidence: User decision in this RC thread: inner loop was intentionally removed and `lesson-draft.md` has priority. Current `lesson-spec.md:31`, `lesson-spec.md:49`, `lesson-spec.md:103`, `lesson-spec.md:122`, `lessons-schema.json`, and video scenarios still require formatter + hook/test runner and bridge to m1-l5. Draft does not teach this section, by design.
- Why it matters: This is not a draft blocker anymore, but it is a contract mismatch. Future reviewers, video writers, and downstream lessons will keep trying to reinsert inner loop unless spec/schema/video artifacts are reverse-updated.
- Required fix: Reverse-update `lesson-spec.md`, `lessons-schema.json`, and video scenarios to remove inner loop as required m1-l4 scope, then adjust m1-l5 bridge if it assumes a configured local inner loop.
- Source check: Human editorial decision in current thread; external hook docs no longer determine scope for this lesson.

### Major: Spec/schema nadal wskazują `failure-modes.md`, ale draftowy `10x-lesson` ma priorytet

- Evidence: User decision in this RC thread: `10x-lesson` has priority. Current spec/schema still require `failure-modes.md` (`lesson-spec.md:32`, `lesson-spec.md:50`, `lesson-spec.md:104`, `lesson-spec.md:130`; `lessons-schema.json` required fragment). Draft correctly introduces `context/foundation/lessons.md` and `/10x-lesson` under the updated scope (`lesson-draft.md:301-357`). Old video scenario still mentions `failure-modes.md` (`videos/video-scenario.md:176-198`), but video plan is now being replaced.
- Why it matters: This is no longer a draft defect. It is a reverse-update task: stale contract artifacts will keep reintroducing the old file name and confuse downstream lesson/video work.
- Required fix: Reverse-update `lesson-spec.md`, `lessons-schema.json`, and any retained video plan to make `/10x-lesson` + `context/foundation/lessons.md` the canonical incident/lesson register.
- Source check: Human editorial decision in current thread; internal spec/schema need sync.

### Major: Brakuje resetu problematycznej konwersacji przez `conversation-summary.md`

- Evidence: Spec wskazuje ten element jako learning outcome i owned concept (`lesson-spec.md:33`, `lesson-spec.md:54`, `lesson-spec.md:105`). Draft nie zawiera sekcji o sygnałach problematycznej konwersacji, zasadzie trzech prób ani `conversation-summary.md` (`rg` znajduje brak wystąpień).
- Why it matters: Lekcja miała domknąć nie tylko stałe instrukcje, ale też higienę pamięci roboczej wątku. Bez tego auto-memory i rejestr incydentów nie mają jasnego momentu decyzyjnego: kiedy resetować, co przenieść do pamięci, reguły, testu albo rejestru.
- Required fix: Dodać krótką sekcję Core po rejestrze incydentów albo przed auto-memory: sygnały ostrzegawcze, reset przez `conversation-summary.md`, decyzja po resecie.
- Source check: Internal 10xDevs 2ed continuity in `lesson-grounding.md`; external verification not required because this is course workflow, not measured claim.

### Major: Video artifacts are stale; final plan is two videos only

- Evidence: User decision in this RC thread: final lesson has only two films: (1) rules/custom instructions on Cursor + Claude Code + Codex, (2) AGENTS.md research: two papers plus author's own conclusions. Existing `videos/video-scenario.md`, `video-inner-loop-hook.md`, `video-agent-onboarding-baseline.md`, `video-memory-audit.md`, and `video-custom-instructions-test.md` still describe the older multi-video plan, including removed inner loop and `failure-modes.md`.
- Why it matters: The text can be acceptable while production handoff is still miswired. Video artifacts currently point producers toward scenes that are explicitly out of scope.
- Required fix: Replace or supersede current video scenario files with the two-video plan. The rules video should cover Cursor, Claude Code, and Codex. The research video should cover the two AGENTS.md papers and clearly separate evidence from author's own practice conclusions.
- Source check: Human editorial decision in current thread.

### Major: Deep Dive opiera się na długich cytatach z nieoficjalnego repo system promptów

- Evidence: `lesson-draft.md:402-449` cytuje kilka dłuższych fragmentów z `asgeirtj/system_prompts_leaks`, w tym system prompt Claude Code i Cursor. Grounding sam oznacza repo jako crowdsourced, medium confidence, bez metodologii ekstrakcji.
- Why it matters: Sekcja wygląda jak mocny dowód architektury narzędzi, ale źródło nie jest oficjalne i może być przestarzałe. Dodatkowo długie cytaty z proprietary promptów zwiększają ryzyko praw autorskich i odciągają lekcję od praktycznego celu.
- Required fix: Zostawić 2-3 krótkie, sparafrazowane obserwacje strukturalne z wyraźnym caveatem "społecznościowy zbiór, materiał ilustracyjny", bez długich bloków cytatów. Fakty o hookach, memory i `/init` oprzeć na oficjalnych docs.
- Source check: Community repo only: https://github.com/asgeirtj/system_prompts_leaks. Treat as illustrative, not authoritative.

### Minor: Heading typo and style polish

- Evidence: Heading `### Hierarcha instrukcji - AGENTS.md oraz CLAUDE.md` (`lesson-draft.md:289`) should be `Hierarchia`. Several paragraphs exceed the style guide's 3-sentence density target, e.g. `lesson-draft.md:293` and `lesson-draft.md:297`.
- Why it matters: Not a readiness blocker by itself, but the draft is dense in the middle and the typo appears in a core section.
- Required fix: Fix heading and split dense paragraphs during final editorial pass.
- Source check: `workbench/style.md`.

## Spec Compliance

- Thesis: pass with contract-sync caveat — custom instructions thesis is present; spec/schema must be reverse-updated for removed inner loop and `10x-lesson`.
- Learning outcomes: issue — `conversation-summary.md` remains unsatisfied unless intentionally removed; inner loop and `failure-modes.md` outcomes should be removed/replaced in spec/schema.
- Behavioral change: pass — the inclusion filter "czy agent mógłby to wiedzieć bez tego pliku?" is strong and repeated.
- Required example/demo: pass with caveat — five-pattern exercise is present and actionable.
- Failure mode: pass with contract-sync caveat — redundant context failure mode is covered; incident-register handling uses the newer `/10x-lesson` direction.
- Bridge in/out: issue — bridge in from m1-l3 is solid; bridge out to m1-l5 needs reverse-update if m1-l5 currently expects inner loop.

## Grounding And External Checks

- Verified claims:
  - Claude Code `/init` exists and initializes a `CLAUDE.md` project guide: https://docs.anthropic.com/en/docs/claude-code/slash-commands
  - Claude Code hooks support `PostToolUse` and `Edit|Write` matchers: https://code.claude.com/docs/en/hooks
  - Current Claude Code hook guide shows auto-formatting via `jq -r '.tool_input.file_path' | xargs npx prettier --write`: https://code.claude.com/docs/en/hooks-guide
  - Cursor rules are scoped, reusable project/user rules; project rules live in `.cursor/rules`, can be path-scoped, and best practices say focused/actionable/scoped: https://docs.cursor.com/context/rules
  - GitHub Copilot coding agent supports root and nested `AGENTS.md` alongside `.github/copilot-instructions.md`: https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/
  - "Lost in the Middle" supports the general position-sensitivity claim for long contexts: https://huggingface.co/papers/2307.03172
- Unsupported or softened claims:
  - System prompt details from `system_prompts_leaks` should be framed as illustrative, not authoritative.
- Open verification:
  - Exact current OpenAI Codex memories docs and regional availability at production handoff.
  - Exact current Claude Code auto-memory path and load limits from official docs at recording time.

## Curriculum Continuity

- Previous lesson fit: Strong opening. Draft correctly starts from m1-l3 state: project exists, agent works, but does not know local conventions.
- Next lesson setup: Needs contract update. If m1-l5 expects a configured local inner loop, that expectation must be removed or moved to the actual lesson that now owns inner loop.
- Potential duplicates: The "Lekcje z incydentów" section now intentionally uses `/10x-lesson`; later triage lessons should reference it as reinforcement, not redefine it.
- Scope theft risk: Low for CI/CD and deep hook architecture. Draft no longer owns hook scope by editorial decision, but spec/schema still say it does.

## Editorial Quality

- Style guide fit: Mostly aligned in the intro and custom instructions sections; dense in hierarchy/system prompt sections.
- AI-sounding patterns: The system prompt Deep Dive is too source-led and quotation-heavy; it reads more like research notes than a production lesson.
- Polish/prose issues: Fix `Hierarcha` typo; reduce long paragraphs; consider moving more research detail into Deep Dive after restoring missing Core sections.

## Diagram Quality

- Diagrams present: 2 Mermaid diagrams in draft.
- Placement: Both are near the claims they visualize.
- Missing opportunities: None under the updated draft-priority scope. If inner loop moves elsewhere, it would benefit from its own flow diagram there.
- Decorative or redundant: Current diagrams are useful, not decorative.
- Syntax/rendering: Rendered PNG comments exist for both diagrams; no syntax issue observed.

## Video Alignment

Issue. Existing video files are stale. The final plan is two films only: rules/custom instructions across Cursor + Claude Code + Codex, and a research film about the two AGENTS.md papers plus author's conclusions. Current video artifacts should be replaced or explicitly superseded.

## Side-Effect Ledger

New claims introduced:
- Draft introduces `/10x-agents-md`, `/10x-rule-review`, `/10x-lesson`, `context/foundation/lessons.md`, and detailed `CLAUDE_CODE_NEW_INIT` behavior beyond the original grounding emphasis.

Claims removed:
- Inner loop intentionally removed from draft by editorial decision in this RC thread.
- Required `failure-modes.md` and `conversation-summary.md` effectively removed from draft.

Neighboring lesson references changed:
- m1-l5 bridge must be reverse-updated if it assumes inner loop from m1-l4.

Prework references used:
- Prework [3.2] instruction hierarchy and [3.3] context/memory concepts used appropriately.

Prework concepts repeated intentionally:
- Instruction hierarchy recap is intentional and useful.

Potential duplicates:
- `/10x-lesson` / `lessons.md` may overlap with later triage lessons unless schema is updated.

Unsupported facts:
- System prompt leak details are illustrative, not authoritative.

Video/text mismatches:
- Inner loop exists in video scenario but not draft by design.
- Video uses `failure-modes.md`; draft uses `context/foundation/lessons.md`.
- Existing video set conflicts with the new two-video production plan.

Needs human decision:
- Decide whether to keep system prompt leak analysis as text or move it fully to optional video/Deep Dive with paraphrase.
- Reverse-update spec/schema/m1-l5 bridge/video scenarios to remove inner loop from m1-l4.
- Reverse-update spec/schema/video scenarios to make `/10x-lesson` + `context/foundation/lessons.md` canonical.
- Replace old video scenario set with two videos: rules across Cursor/Claude Code/Codex, and AGENTS.md research + author's conclusions.

## Acceptance Checklist

- [ ] Spec compliance blockers resolved
- [ ] Unsupported factual claims resolved or removed
- [ ] Neighboring lesson drift resolved
- [ ] Editorial polish accepted
- [ ] Video scenario aligned or explicitly deferred
