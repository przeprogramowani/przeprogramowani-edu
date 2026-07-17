# Lesson Grounding: m2-l5 — Innovate: Więcej ficzerów, mniej czekania - wielowątkowa praca z Agentami

## Scope

- Lesson source: schema + `lessons/m2-l5/lesson-spec.md`
- Neighbor boundaries: m2-l3 owns interactive implementation review and triage; m3-l1 owns test planning and quality gates. m2-l5 should only use quality pain as the bridge into M3, not solve it.
- Relevant prework: [2.4] Agent-Native IDE (parallel work and worktrees as concept), [3.3] context isolation, [1.2] agent/tool/harness framing.
- Research posture: standard, with current verification for Claude Code, Git worktrees, GitHub Actions, and 10x skill behavior.

## Claims To Support

- `/10x-auto-implement` is a headless launcher around `claude -p` — matters because the lesson contrasts it with interactive `/10x-implement` — needs canonical skill + script + Claude CLI docs.
- Git worktrees isolate parallel agent work by giving each agent a separate working tree/index/HEAD — matters because this is the operational spine of the lesson — needs official Git docs.
- `/10x-impl-review-ci` is a non-interactive PR review pass that writes a report, comments on PRs, and gates by verdict outside the skill — matters because it must not be confused with m2-l3's interactive triage — needs canonical skill + workflow template + GitHub/Claude Actions docs.
- `/10x-archive` and `/10x-status` close and show the lifecycle across multiple changes — matters because this lesson closes the M2 loop — needs canonical skill docs.
- Parallel agents increase implementation throughput but leave human review/merge governance as the limiting control point — matters for the over-parallelization warning — needs research/practitioner signal, not hard product docs.
- Learner-facing `m2l5` CLI pack exists and includes the right skills — matters before draft can give exact `10x get m2l5` instructions — needs course-content wiring check.

## Strong Sources

### 10x-auto-implement skill source

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-auto-implement/SKILL.md`
- Type: official-docs
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-14
- Supports:
  - `/10x-auto-implement` accepts a change id or plan path and validates the plan.
  - The skill copies a `bash <script> <plan-path>` command for a separate terminal.
  - The launched script runs phases in fresh `claude -p` sessions and has no manual verification pauses.
- Use in lesson:
  - Treat it as a launcher, not as a magical new implementation methodology.
  - Contrast with m2-l4: verification pauses move later into PR review and human triage.
- Confidence: high
- Notes:
  - The canonical skill points to `.claude/scripts/auto-implement.sh` or user-level `~/.claude/scripts/auto-implement.sh`.

### benihime auto-implement.sh

- URL: `/Users/admin/code/benihime/.claude/scripts/auto-implement.sh`
- Type: repo
- Author/publisher: benihime / Przeprogramowani tooling
- Checked: 2026-05-14
- Supports:
  - The script calls `claude -p` per phase.
  - It passes an explicit tool allowlist and `--max-turns`.
  - It resumes by scanning unchecked plan checkboxes and stops on failed phases.
- Use in lesson:
  - Ground the demo command shape as `bash auto-implement.sh <plan-path>`, not as a direct learner-facing command unless the CLI pack delivers the script.
  - Use "fresh context per phase" carefully: each phase gets a fresh Claude print-mode run, while each worktree still represents separate filesystem/git context.
- Confidence: high
- Notes:
  - This is a local/internal script path, not a learner-facing link.

### Claude Code CLI reference

- URL: https://code.claude.com/docs/en/cli-reference
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - `--print`, `-p` prints a response without interactive mode.
  - Print mode supports automation-oriented flags such as `--max-turns`, `--output-format`, `--json-schema`, `--no-session-persistence`, and `--permission-prompt-tool`.
- Use in lesson:
  - Define `claude -p` as non-interactive/headless execution for a bounded task.
  - Avoid implying that `claude -p` itself guarantees correctness; it only changes execution mode.
- Confidence: high
- Notes:
  - Docs were verified through official Anthropic docs and Context7.

### Git worktree documentation

- URL: https://git-scm.com/docs/git-worktree.html
- Type: official-docs
- Author/publisher: Git
- Checked: 2026-05-14
- Supports:
  - A repository can have one main worktree and zero or more linked worktrees.
  - `git worktree add <path> [<commit-ish>]` creates a linked working tree sharing repository data but keeping per-worktree state such as `HEAD` and `index`.
  - `git worktree list` shows all associated worktrees.
- Use in lesson:
  - Teach one operational command and the mental model: separate folders/branches, shared history.
  - Keep Git internals light; the point is agent isolation, not a Git tutorial.
- Confidence: high
- Notes:
  - Git docs mention submodule caveats; do not overpromise worktrees as universal isolation.

### 10x-impl-review-ci skill source and workflow template

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-impl-review-ci/`
- Type: official-docs
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-14
- Supports:
  - Runs non-interactively inside GitHub Actions and never asks questions.
  - Discovers a plan from PR diff convention or a `Plan: context/changes/<change-id>/plan.md` PR-body override.
  - Writes `context/changes/<change-id>/reviews/impl-review.md`, stamps `change.md`, commits the report with `[skip ci]`, posts inline and summary comments, and separates the `REJECTED` gate into the workflow step.
  - Reviews seven dimensions, adding Test Coverage to the interactive review dimensions.
- Use in lesson:
  - Present CI review as an automated pre-scan and audit trail, not as the decision loop from m2-l3.
  - Keep human triage/merge responsibility explicit.
- Confidence: high
- Notes:
  - The workflow template requires same-repo PRs, label gating, `contents: write`, `pull-requests: write`, and `statuses: write`.

### Claude Code GitHub Actions

- URL: https://code.claude.com/docs/en/github-actions
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - Claude Code Action runs Claude Code inside GitHub Actions workflows.
  - It supports prompt-driven automation mode and accepts CLI arguments through action configuration.
  - Recommended setup requires repository permissions for contents, issues, and pull requests when Claude is expected to modify files or respond on PRs/issues.
- Use in lesson:
  - Ground the idea that an agent can run inside CI/CD, but keep setup details minimal unless the video/demo installs the workflow.
- Confidence: high
- Notes:
  - Product details change; recheck before writing exact workflow YAML into learner-facing prose.

### GitHub Actions permissions and PR comments

- URL: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- Type: official-docs
- Author/publisher: GitHub Docs
- Checked: 2026-05-14
- Supports:
  - Workflows can scope `GITHUB_TOKEN` permissions such as `contents`, `pull-requests`, and `statuses`.
  - Unspecified permissions default to `none` when any permission is explicitly specified.
  - Fork PRs typically cannot receive write permissions unless repository settings explicitly allow it.
- Use in lesson:
  - Mention that CI review is permission-sensitive; same-repo PRs are the safe teaching path.
  - Avoid turning this into a GitHub Actions security lesson.
- Confidence: high
- Notes:
  - `gh pr comment` docs separately confirm PR timeline comments; commit status docs confirm statuses require push access.

### 10x-archive skill source

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-archive/SKILL.md`
- Type: official-docs
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-14
- Supports:
  - Archives a completed change from `context/changes/<change-id>/` to `context/archive/<created-date>-<change-id>/`.
  - Stamps `change.md` with `status: archived`, `archived_at`, and `updated`.
  - Hard-blocks uncommitted edits inside the change folder and pre-existing staged changes; other readiness issues are warnings.
- Use in lesson:
  - Frame archive as lifecycle closure and audit hygiene, not a cosmetic cleanup step.
- Confidence: high
- Notes:
  - It creates a local commit and does not push.

### 10x-status skill source

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-status/SKILL.md`
- Type: official-docs
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-14
- Supports:
  - Lists active and archived changes by reading `change.md` frontmatter and `plan.md` `## Progress`.
  - Renders one-line progress status and drift warnings.
  - Deep view shows artifacts and progress rows, including SHA suffixes when present.
- Use in lesson:
  - Use `/10x-status` as the dashboard that makes the "multiple cycles in flight" visible.
  - It can support the quality-pain moment if the lesson/demo shows shipped changes without test/quality-gate artifacts, but that specific narrative still needs demo validation.
- Confidence: high
- Notes:
  - It reads status; it does not prove quality.

### Collaborator or Assistant? How AI Coding Agents Partition Work Across Pull Request Lifecycles

- URL: https://arxiv.org/abs/2605.08017
- Type: paper
- Author/publisher: Young Jo (seph) Chung, Safwat Hassan / arXiv
- Checked: 2026-05-14
- Supports:
  - In analyzed AI coding-agent PR workflows, operational agency and merge governance are decoupled.
  - Agent-initiated workflows can dominate PR creation, while terminal merge authority remains almost entirely human.
- Use in lesson:
  - Support the argument that review/merge governance remains the human bottleneck even when agents can initiate and carry more work.
- Confidence: medium
- Notes:
  - New arXiv paper from 2026-05-13; useful as current research signal, but do not overstate it as universal law.

## Practitioner Signals

### incident.io — shipping faster with Claude Code and Git Worktrees

- URL: https://incident.io/thedebrief/shipping-with-claude-code-and-worktrees
- Type: practitioner-signal
- Signal:
  - A real engineering team publicly frames Claude Code + Git worktrees as a way to build multiple features in parallel.
- Useful language:
  - "multiple features in parallel"
  - "Git Worktrees" as the operational primitive, not a special AI-only abstraction.
- Risk:
  - Podcast/show-notes source is weak for exact workflow mechanics; use only for adoption/framing signal.
- Confidence: medium

### Reddit / HN-like community threads on parallel agents and worktrees

- URL: https://www.reddit.com/r/ClaudeCode/comments/1tacxs0/i_built_a_git_worktree_workflow_so_claude_can/
- Type: community-discussion
- Signal:
  - Practitioners report the same recurring pattern: worktrees help isolate parallel agents, but coordination, environment setup, and final review remain pain points.
- Useful language:
  - "one agent per issue/worktree"
  - "CI green does not mean ready to merge"
  - "project owner reconciles after each PR"
- Risk:
  - Community discussion is weak factual evidence; use only to name objections and failure modes.
- Confidence: low

## Examples Worth Using

- Two independent roadmap slices in two worktrees: `../10xcards-s04-account-deletion` and `../10xcards-s05-auth-compliance`, each with its own branch and its own agent run.
- A small diagram: main repo → worktree A / agent A / PR A → CI review → archive; worktree B / agent B / PR B → CI review → archive.
- Failure mode: running five agents because five slices look ready, then facing five PRs with findings and no review capacity. This should land as "więcej kodu w kolejce do decyzji", not as a moral warning.
- CI review table:
  - interactive review (m2-l3): asks, triages, can drive fixes.
  - CI review (m2-l5): reads, reports, comments, gates; no questions and no source edits.
- Quality pain bridge: `/10x-status` shows multiple implemented/archived changes, but the artifacts do not yet include test-plan/quality-gate evidence. That observation sets up m3-l1.

## Claims To Avoid Or Soften

- "Worktrees fully isolate agents" — soften: worktrees isolate working tree/git state, not ports, local databases, secrets, `.env`, or shared external services.
- "`/10x-auto-implement` verifies implementation" — avoid: it removes manual pauses; verification shifts to CI review, tests, and human review.
- "`/10x-impl-review-ci` replaces code review" — avoid: it is a pre-scan/audit artifact; m2-l3's judgment loop remains the model for decisions.
- "More agents = more throughput" — soften: more agents increase generation/implementation throughput only until review capacity, dependency conflicts, and environment setup become the bottleneck.
- "M2 solves quality" — avoid: M2 gives workflow discipline; M3 starts because quality gates are still missing.

## Open Verification Questions

- Course-content wiring for `m2l5` does not exist in the current local toolkit tree: `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/` currently contains only `module-01` lesson definitions. Confirm the learner-facing ref and included artifacts before drafting exact `npx @przeprogramowani/10x-cli@latest get m2l5` instructions.
- Demo readiness: confirm whether S-04 and S-05 are both independent and ready enough for a parallel live demo.
- Video decision: split-screen with two terminals is pedagogically strong but may be noisy; decide whether to show both live or one live plus one summarized.
- `/10x-status` can show multi-change visibility, but the exact quality-pain moment depends on available demo artifacts. Confirm the status output before scripting the bridge to M3.

## Schema Source Update

Added `groundingSources` to the target lesson object with the strongest sources:

- `10x-auto-implement` skill source
- benihime `auto-implement.sh`
- Anthropic Claude Code CLI reference
- Git worktree docs
- `10x-impl-review-ci` skill source and workflow template
- Claude Code GitHub Actions docs
- GitHub Actions workflow permissions docs
- `10x-archive` skill source
- `10x-status` skill source
- arXiv paper on AI coding-agent PR lifecycle governance

Updated `sideEffectLedger.unsupportedFacts` to remove verified `claude -p` and `/10x-status` claims. Remaining unsupported fact: learner-facing `m2l5` course-content wiring.

Updated `sideEffectLedger.needsHumanDecision` with demo/video/status decisions that research cannot settle.
