# RC Review: m2-l1 — Roadmapa MVP: Technical Project Manager, milestony i backlog dla agenta

## Verdict

Not ready

## Findings

### Major: Draft skips the `/10x-new` bridge required before m2-l2

- Evidence: `lesson-draft.md` ends the workflow by recommending `/10x-plan first-gated-generation` directly after choosing the issue (`lesson-draft.md:431-435`). The lesson schema owns "`/10x-new` jako bridge z roadmapy do change folder" and the next lesson explicitly assumes "Wybrany slice z `status: ready` i change folder z `/10x-new`" (`lesson-spec.md:65`, `lesson-spec.md:295-298`, `lesson-spec.md:359`; `m2-l2/lesson-spec.md:20`, `m2-l2/lesson-spec.md:37-40`, `m2-l2/lesson-spec.md:66-67`).
- Why it matters: m2-l2 starts from a selected slice plus `context/changes/<change-id>/change.md`. If m2-l1 jumps straight from backlog issue to `/10x-plan`, the curriculum handoff is broken and the learner misses the change-folder identity step.
- Required fix: Add a short final beat after backlog issue selection: choose `change-id`, run `/10x-new first-gated-generation ...`, verify `context/changes/first-gated-generation/change.md`, then hand off to `/10x-plan first-gated-generation`. Update the "Your next move" prose so `/10x-roadmap` may recommend `/10x-plan`, but the course workflow first creates the change folder with `/10x-new`.
- Source check: Local `10x-new` skill confirms it creates `context/changes/<change-id>/change.md` and then suggests `/10x-plan <change-id>`.

### Major: Linear MCP configuration uses the stale `/sse` endpoint

- Evidence: The draft shows a generic Linear MCP config with `args: ["mcp-remote", "https://mcp.linear.app/sse"]` (`lesson-draft.md:338-344`). Current Linear docs say the Streamable HTTP endpoint is `https://mcp.linear.app/mcp`; their current client examples use `/mcp`, with `mcp-remote` only as a compatibility proxy.
- Why it matters: This is copy-paste setup content. A stale endpoint in a course lesson can break the demo or teach learners to configure the wrong transport.
- Required fix: Replace the config with the current official Linear example, e.g. `["-y", "mcp-remote", "https://mcp.linear.app/mcp"]`, or remove exact config from the main prose and say "sprawdź aktualny snippet w dokumentacji Linear przed demo".
- Source check: Verified against Linear MCP official docs on 2026-05-13: https://linear.app/docs/mcp. Atlassian `/sse` deprecation claim remains supported by Atlassian docs: https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/.

### Major: Required video scenario artifact is missing

- Evidence: `workbench/lessons/m2-l1/videos/` has no `video-*.md` files. The schema requires `video-scenario` for this lesson and lists four video placeholders, including the `/10x-roadmap`, MCP backlog, and `/10x-new` bridge demos (`lessons-schema.json:m2-l1 requiredArtifacts`, `lesson-spec.md:345-350`).
- Why it matters: The draft has seven video placeholders, but no executable scenario for production. RC handoff cannot validate whether video and text teach the same workflow.
- Required fix: Create video scenario files for the required demo beats, or explicitly defer video scenario production and keep this lesson out of RC acceptance until that artifact exists.
- Source check: Local artifact check; no external source needed.

### Minor: Acceptance criteria source is still described inconsistently

- Evidence: The draft correctly says `roadmap.md` has no separate `Acceptance criteria` field and that criteria are derived from `Outcome`, `PRD refs`, `Risk`, `Unknowns`, and status (`lesson-draft.md:278`). Later the mapping list says acceptance criteria are "wyciągnięte z pól Risk i FR refs" (`lesson-draft.md:381`), while the prompt says `Outcome + PRD refs + Risk` (`lesson-draft.md:400-402`).
- Why it matters: This is not fatal, but the learner gets three subtly different extraction rules for the same backlog field.
- Required fix: Use one rule everywhere: derive backlog acceptance criteria from `Outcome`, `PRD refs`, `Risk`, and relevant `Unknowns`/`Blockers`; do not imply `Risk` alone is enough.
- Source check: Local `10x-roadmap` skill template exposes `Outcome`, `PRD refs`, `Unknowns`, `Risk`, and `Backlog Handoff`, but no dedicated `Acceptance criteria` field.

### Minor: Several Polish/style issues remain below RC bar

- Evidence: Examples include `progress będzie postępował` (`lesson-draft.md:11`), `zadań'ów` (`lesson-draft.md:97`), heavy Polglish around `runtime`, `leaderzy`, `trade-offy`, `full-stackowo`, `downstream`, `AI-gated generation`, and English-heavy field explanations in otherwise Polish learner prose.
- Why it matters: The lesson is understandable, but not yet release-candidate prose according to `workbench/style.md`; it still reads like a draft in several sections.
- Required fix: Run a focused voice pass after the structural fixes. Keep accepted course terms (`roadmap`, `backlog`, `change-id`, `MCP`) but clean fake Polish forms and unnecessary English filler.
- Source check: `workbench/style.md` technical Polish hygiene rules.

## Spec Compliance

- Thesis: pass with issue. The TPM/roadmap/backlog thesis is present, but the missing `/10x-new` bridge weakens the full artifact chain.
- Learning outcomes: issue. Roadmap, vertical-first, MCP backlog, and `change-id` are covered; `/10x-new` / change-folder readiness for m2-l2 is not.
- Behavioral change: pass. The lesson moves the learner from "ask agent to build app" to milestone and backlog steering.
- Required example/demo: issue. 10xCards roadmap and backlog mapping are present; video scenario artifact is missing and `/10x-new` bridge is absent.
- Failure mode: pass. The "one giant PRD prompt" failure mode is clear.
- Bridge in/out: issue. Bridge in from sprint zero works; bridge out to m2-l2 is incomplete because m2-l2 assumes a change folder from `/10x-new`.

## Grounding And External Checks

- Verified claims:
  - `/10x-roadmap` is a decomposition/sequencing skill that writes `context/foundation/roadmap.md` and avoids implementation planning: local `10x-roadmap/SKILL.md`.
  - Thin PRD behavior now matches the skill: score `< 3` warns and asks whether to firm up PRD or proceed anyway.
  - Linear MCP currently uses `https://mcp.linear.app/mcp` as the Streamable HTTP endpoint: https://linear.app/docs/mcp.
  - Atlassian Rovo MCP `/sse` endpoint is being retired after June 30, 2026, with `/mcp` recommended: https://support.atlassian.com/atlassian-rovo-mcp-server/docs/getting-started-with-the-atlassian-remote-mcp-server/.
  - MCP concepts of tools/resources/prompts and consent are supported by official MCP docs: https://modelcontextprotocol.io/docs/learn/server-concepts.
- Unsupported or softened claims:
  - `(none)` after the Linear endpoint is fixed.
- Open verification:
  - Real `/10x-roadmap` output for the recorded 10xCards demo still needs to be regenerated before video production.
  - Exact current Linear/Jira MCP client snippets should be rechecked immediately before recording.

## Curriculum Continuity

- Previous lesson fit: pass. The draft starts from sprint zero, production, `deploy-plan.md`/M1 state without re-teaching deployment.
- Next lesson setup: issue. m2-l2 assumes `change folder z /10x-new`; the draft currently hands off directly to `/10x-plan`.
- Potential duplicates: acceptable. It references `/10x-plan` without teaching plan anatomy; m2-l2 retains detailed planning.
- Scope theft risk: low. The MCP section stays at mental-model/minimal-flow level, not a full Jira/Linear admin tutorial.

## Editorial Quality

- Style guide fit: issue. Strong overall flow, but several sections still contain draft-level Polglish and stiff translated terminology.
- AI-sounding patterns: moderate. The opening works, but phrases like "rozpędzająca się rewolucja AI" and generic TPM setup sound broader than necessary.
- Polish/prose issues: minor but repeated. Needs a focused polish pass after structural fixes.

## Diagram Quality

- Diagrams present: 4 mermaid diagrams plus image placeholders.
- Placement: good. Diagrams sit next to artifact chain, vertical/horizontal contrast, TPM dimensions, and MCP/backlog access.
- Missing opportunities: the final roadmap → backlog issue → `/10x-new` → `/10x-plan` bridge needs either a compact diagram or a corrected text flow.
- Decorative or redundant: none severe.
- Syntax/rendering: Mermaid syntax appears valid on inspection.

## Video Alignment

Issue: no scenario present. Draft placeholders exist, but no `videos/video-*.md` artifact is available to compare against the lesson.

## Side-Effect Ledger

New claims introduced:
- `(none)`

Claims removed:
- `(none)`

Neighboring lesson references changed:
- m2-l2 dependency is currently under-served: it expects a change folder from `/10x-new`.

Prework references used:
- [1.2], [2.4], [3.2], [3.3], [4.2] as assumed context; no problematic repetition found.

Prework concepts repeated intentionally:
- Agent as tool-using harness participant; prompt/task as contract; small MVP and first working user path.

Potential duplicates:
- `/10x-plan` appears near the end but does not yet steal plan anatomy from m2-l2.

Unsupported facts:
- Linear MCP `/sse` snippet is stale against current official docs.

Video/text mismatches:
- Cannot assess; video scenario missing.

Needs human decision:
- Whether to keep exact MCP config snippets in learner prose or move them to demo notes with a "verify current docs" instruction.
- Whether m2-l1 should explicitly teach `/10x-new` as a visible final mini-step or only show it in the video/demo handoff.

## Acceptance Checklist

- [ ] Spec compliance blockers resolved
- [ ] Unsupported factual claims resolved or removed
- [ ] Neighboring lesson drift resolved
- [ ] Editorial polish accepted
- [ ] Video scenario aligned or explicitly deferred
