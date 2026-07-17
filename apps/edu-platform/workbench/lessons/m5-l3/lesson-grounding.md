# Lesson Grounding: m5-l3 — Code Review w erze AI: standardy, kryteria i Agent w pipeline

> **Reconciled to the shipped draft on 2026-06-14 (backprop).** This brief was written *before* the draft against an 8-beat plan that the draft did not follow. The verified research below is kept (it is all still true and useful), but the framing is reconciled: the draft (a) does **not** teach the "required status check vs label" merge gate in prose — it defers gate mechanics to the video; (b) does **not** have a dedicated "DoD as a Zod schema" beat — structuring appears via `Output.object` in the tool-loop section and as the Deep Dive contrast; and (c) **adds** three areas this brief originally lacked: Composite Actions, the AI SDK tool loop / ladder of agency, and OpenRouter as a promptfoo provider. New sources for those three are appended under Strong Sources, verified 2026-06-14.

## Scope

- Lesson source (now): `lesson-draft.md` is the source of truth. `lesson-spec.md` (also backpropped 2026-06-14) and `notes.md` are supporting context.
- Neighbor boundaries:
  - **m5-l2 (depends-on, `grounded`)** owns: building the local review agent from SDK primitives (Claude Agent SDK *and* AI SDK 6), cost/privacy of that agent, and **promptfoo *as a concept*** (the `promptfoo eval` local run). This brief treats those as referencesOnly — it grounds only the *CI operationalization* (`promptfoo` exit codes, the `promptfoo-action`, evals as a regression gate), not the tool intro.
  - **m5-l4 (prepares-for, `grounded`)** owns authoring & distributing the team's shared AI artifacts (skills/commands/rules). Standards appear here only as the **input** the review agent enforces — this brief sources nothing about registries/distribution.
- Relevant prework: **[1.2]** Chatbot/Agent/Harness (the harness owns runtime/tools — reused to frame "skill auto-load is a *harness* property"); **[4.2]** "a good project has CI/CD" (deepened: an agent *lives inside* CI); **[3.5]** models (Opus/Sonnet/Haiku tiers, for the model-choice aside in CI).
- Research posture: **deep**. The spec flagged five grounding targets and three "needs human decision" items; four were time-sensitive GitHub/tooling mechanics. One internal source (the `10x-impl-review-ci` SKILL.md + its `workflow-template.yml`) was read in full — it is the single richest source and **resolves the merge-gating open question outright**.

> Note on note volume (per author request): notes below are intentionally dense — exact key/flag/endpoint names, current versions, and gotchas — so the drafter can write accurate prose without re-deriving CI mechanics. They are not pass/fail verdicts.

## Headline Finding (available research — the draft chose a lighter treatment)

**A PR label never blocks a merge. A required *status check* does.** This was the single most important pre-draft grounding finding. **The shipped draft did not surface it in prose** — it keeps `ai-cr:passed`/`ai-cr:failed` as the visible verdict, alludes to "bramka, która zatrzyma merge" twice without mechanics, and lets the **video** carry the actual gate (a red/green `ai-cr/verdict` status check blocking and unblocking the merge). So this finding now backs the **video scenario** and is held in reserve if the text is ever expanded to teach the gate explicitly (an open decision).

The underlying facts (still verified): GitHub has **no built-in merge rule of the form "block if label X is present."** Neither branch protection rules nor rulesets expose a label condition. The enforced gate is always a **required status check** (a commit status or a check run) selected *by name*; a merge is blocked while that check is `failure`/`error`/`pending` (passing states that unblock: `success`, `skipped`, `neutral`). The production reference (`10x-impl-review-ci`) does exactly this — posts a commit status `impl-review-ci/verdict` to the PR HEAD and gates on *that*, with labels as triggers/overrides (`impl-review` to run, `impl-review-override` to bypass). See "Claims To Avoid Or Soften" and "Needs Human Decision."

## Claims To Support

Mapped to the **shipped draft's sections** (✅ = the draft makes this claim; ⚠️ = de-emphasized/deferred vs the original plan).

- ✅ **Minimum GHA to run an agent on a PR** (section 2) — vocabulary (workflow/trigger/job/step/action/runner), `.github/workflows/*.yml`, `on: pull_request` + `workflow_dispatch`, a job, checkout + setup-node + `npm ci` + `run:` the script — needs: official GHA docs (verified).
- ✅ **The key isn't on the runner — secrets** (folded into section 2) — repo secret in the UI → `${{ secrets.X }}` → `env:` → `process.env`; ephemeral runner; masking is best-effort; fork PRs get no secrets — needs: official GHA secrets docs (verified).
- ✅ **Composite Action = reusable plugin** (section 3, **new**) — `action.yml` with `using: composite`, inputs/outputs, `github.action_path`, per-step `shell`; separate-repo vs local-subfolder hosting; consumer shrinks to one `uses:` step; **pin third-party actions to a SHA** — needs: GitHub "Creating a composite action" docs (verified 2026-06-14).
- ✅ **Build the pipeline as a feature** (section 4, **new**) — the 10x research→plan→implement flow seeded by `requirements.md`; MVP review contract (input params, 1–10 criteria, `ai-cr` labels, retry) — internal-method claim; no external source needed beyond the 10x workflow itself.
- ✅ **promptfoo as a model-comparison + regression gate** (section 5) — three pieces (prompts/providers/tests); **OpenRouter** multi-vendor providers (`openrouter:<vendor>/<model>`); `is-json`/`llm-rubric`/`javascript` assertions; the result matrix; `promptfoo eval` exits non-zero (100) on failure; `PROMPTFOO_PASS_RATE_THRESHOLD` — needs: promptfoo CI + assertions docs (verified) + OpenRouter quickstart (verified 2026-06-14).
- ✅ **Scorer → actor via the tool loop** (section 6, **new**) — `ToolLoopAgent` + `Output.object` (scorer) vs adding `tools`; `tool()` = description/inputSchema/execute; the validate→execute→continue loop; `stopWhen: stepCountIs` (the `isLoopFinished` cost trap; `onStepFinish` token telemetry); the read→write→whole-GitHub→external ladder — needs: AI SDK v6 Tools/agents docs (verified 2026-06-14; **default-step-count claim unverified — see notes**).
- ⚠️ **A fuzzy "review" becomes a schema-checkable verdict** — the draft shows this via `Output.object` (section 6 scorer) and as the Deep Dive contrast, **not** as a dedicated "DoD as a Zod schema" beat — needs: Anthropic structured-output docs + the production skill (both verified).
- ⚠️ **The verdict gates the merge — via a required status check, not a label** — research verified, but the draft defers this to the **video** (see Headline Finding) — needs: GitHub required-status-checks/rulesets docs (verified).
- ✅ **`10x-impl-review-ci` as a two-layer production reference** (Deep Dive) — `SKILL.md` run-mechanics vs `references/impl-review-instructions.md` portable criteria; what it adds (plan-drift, test coverage, inline comments, REJECTED gate) and what it assumes (a plan-driven `context/changes/<id>/plan.md` workflow); **why it skips a schema** (auto-loaded skill → model self-structures prose) — needs: the SKILL.md (read in full) + claude-code-action repo (verified).
- ✅ **Deep Dive: scaling AI review across a team** — AI review is throughput not replacement; risk-based triage; cost/time as a metric via `onStepFinish`; the override / bug-on-green learning loop — practitioner framing; no single primary source, build from the spec + the production skill's dimension model.

## Strong Sources

### GitHub Actions — workflow syntax, `pull_request` triggers, concurrency

- URL: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions · https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows · https://docs.github.com/en/actions/using-jobs/using-concurrency
- Type: official-docs · Author/publisher: GitHub · Checked: 2026-06-09
- Supports: the "minimum GHA" beat (beats 2).
- Use in lesson:
  - File lives in `.github/workflows/`; each `.yml` is an independent workflow.
  - `on: pull_request` **default activity types** (when `types:` omitted) = `opened`, `synchronize`, `reopened`. `synchronize` = "new commits pushed to the PR head" (this is the re-run-on-every-push event). Add `labeled`/`unlabeled` explicitly for a label-triggered review.
  - Skeleton: `jobs.<id>.runs-on: ubuntu-latest` → `steps:`; a step is **either** `uses:` (an action, inputs via `with:`) **or** `run:` (shell on the runner). Nothing is checked out automatically — `actions/checkout` must precede any `run:` that touches repo files.
  - Canonical PR concurrency: `group: ${{ github.workflow }}-${{ github.head_ref || github.ref }}` + `cancel-in-progress: true` → a new push cancels the now-stale run on the previous commit.
- Confidence: high
- Notes (**version-sensitive — verified this pass**): **`actions/checkout` and `actions/setup-node` are at `@v6`, not `@v4`** (GitHub forced JS actions onto Node 24 runtime starting 2026-06-02; that pushed both to v6). The production skill's `workflow-template.yml` still shows `@v4` — works but is stale. Draft with `@v6` (or note both); re-verify majors at publish. Don't cite specific action *release dates* (fetch was unreliable).

### GitHub Actions — secrets, `GITHUB_TOKEN`, permissions, ephemeral runners

- URL: https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions · https://docs.github.com/en/actions/concepts/security/github_token · https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token
- Type: official-docs · Author/publisher: GitHub · Checked: 2026-06-09
- Supports: the "secrets" beat (beat 3) + the ephemeral-runner / l2-privacy callback.
- Use in lesson:
  - **UI path**: Settings → *Secrets and variables* → **Actions** → **New repository secret**. (Also environment secrets, and org secrets with all/private/selected visibility.) Naming: alphanumeric+underscore, can't start with a digit or `GITHUB_`, case-insensitive, 48 KB cap. `gh secret set NAME` from CLI.
  - **Wiring**: `${{ secrets.ANTHROPIC_API_KEY }}` → `env:` at job/step level → the script reads `process.env.ANTHROPIC_API_KEY`. Gotcha: secrets can't be used directly in `if:` (assign to `env` first); avoid passing on the command line (prefer `env:`/STDIN).
  - **Masking is best-effort**, not guaranteed — Base64/substring/encoded transforms can evade it. `echo "::add-mask::$VALUE"` masks a runtime-derived value. If a secret leaks to a log: delete the log + rotate.
  - **`GITHUB_TOKEN`**: auto-minted per job (installation token for the Actions GitHub App), expires when the job finishes, scoped to the repo. Default permission level is a repo/org setting (restricted = read-only `contents` for new repos/orgs). **Rule: the moment you declare any `permissions:` block, every scope you don't list becomes `none`.** `permissions: {}` = full lockdown; re-grant per job (e.g. `contents: read`, `pull-requests: write`, `statuses: write`).
  - **Ephemeral-runner model** (the l2 privacy callback): each job = a fresh VM, secret injected at runtime, VM destroyed after; nothing persists, nothing committed. Contrast with the laptop in l2 that held the key on disk. Rotation is centralized in the UI.
  - **Fork caveat (flag it)**: with the sole exception of `GITHUB_TOKEN` (which is read-only on forks), **secrets are NOT passed to `pull_request` workflows from forks** — so an agent needing an API key has no key on fork PRs. `pull_request_target` *does* get secrets + write token but runs base-branch code; combining it with a checkout of PR head = a known secret-exfiltration footgun. For an internal team repo (the lesson's setting) this is a footnote, not a main beat.
- Confidence: high
- Notes: couldn't pull a verbatim line for the exact default `statuses` level under the restricted token — safe guidance is "always declare `permissions: { statuses: write }` explicitly."

### GitHub — required status checks, branch protection, rulesets (THE MERGE GATE)

- URL: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks · https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets · https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches · https://docs.github.com/en/rest/commits/statuses · https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/skipping-workflow-runs
- Type: official-docs · Author/publisher: GitHub · Checked: 2026-06-09
- Supports: beat 5 (the gate) — and **corrects** the "label blocks merge" framing.
- Use in lesson:
  - **The gate**: "Require status checks to pass before merging" (a branch-protection checkbox, or the equivalent ruleset rule) selects checks **by name/context**; a required check must be `success`/`skipped`/`neutral` to allow merge. To *block*, the verdict must be `failure`/`error` (or stay pending).
  - **Two underlying APIs, both can be "required":** the legacy **Commit Status API** (`POST /repos/{owner}/{repo}/statuses/{sha}`; `state` = error|failure|pending|success; identified by a `context` string, default `"default"`; optional `target_url`+`description`; anyone with write access can post) and the newer **Checks API** (`POST /check-runs`; **GitHub Apps only**; richer annotations). "GitHub Actions generates checks, not commit statuses, when workflows run" — but a workflow can *also* explicitly POST a commit status.
  - **The "post a status to the HEAD SHA" pattern (core to the lesson + to the production skill):** workflow runs the review → POSTs a commit status with a **stable context** (e.g. `ai-cr:verdict`) to the PR's HEAD SHA → branch protection requires that context. Needs `permissions: { statuses: write }`.
  - **Why a *manual* status, not the auto check-run** (the gotcha worth one crisp paragraph): required checks are evaluated against the PR's **latest** HEAD SHA. If the bot commits something back (a report file), HEAD moves; the earlier auto check-run is now on a stale SHA. Worse, bot commits carry `[skip ci]` (skip keywords: `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, `[actions skip]`, `skip-checks:true`) **and** commits pushed with `GITHUB_TOKEN` don't trigger new workflow runs at all (recursion guard) — so no new check lands on the new HEAD and the required check sits `pending` forever → merge blocked. Fix: POST the status directly to the real HEAD SHA.
  - **Branch protection vs rulesets**: rulesets are the **current, recommended** system — additive, multiple can apply at once (most-restrictive wins), have an "evaluate" (dry-run) mode, and **coexist/layer** with classic branch protection (which still works, only one rule applies at a time). Frame around rulesets, note classic still functions.
  - **Anti-spoof (nice aside)**: a required check can be **pinned to an expected GitHub App** (`statuses:write`), so a contributor can't self-post a `success` for the review context.
  - `gh` commands: `gh pr edit <n> --add-label "ai-cr:failed" --remove-label "ai-cr:passed"`; `gh api --method POST repos/{owner}/{repo}/statuses/{sha} -f state=failure -f context='ai-cr:verdict' -f description='...'`; `gh pr view <n> --json labels`.
- Confidence: high
- Notes: this is the area most worth getting right — it's the lesson's central mechanism and the spec explicitly left it open. **Resolved.**

### Anthropic structured output — the self-built "DoD as schema" path

- URL: https://platform.claude.com/docs/en/build-with-claude/structured-outputs · (via the `claude-api` skill, live-sources current 2026-06-09)
- Type: official-docs · Author/publisher: Anthropic · Checked: 2026-06-09
- Supports: beat 4 (DoD → schema → pass/fail) on the self-built side.
- Use in lesson:
  - Structured output is a feature of `POST /v1/messages`: `output_config: { format: { type: "json_schema", schema: <SCHEMA> } }`. Ergonomic wrapper `client.messages.parse()`; TS uses `zodOutputFormat(ZodSchema)` from `@anthropic-ai/sdk/helpers/zod` (this is the Zod tie-in the lesson leans on). Response carries `parsed_output`. Alternatively `strict: true` on a tool definition guarantees `input` validates against its `input_schema`.
  - **Version-sensitive**: the old top-level `output_format` parameter is **deprecated** — use `output_config.format`. JSON-schema support includes enum/const/anyOf/$ref and requires `additionalProperties: false` on every object; **does NOT** support recursive schemas or numeric/string-length constraints (SDKs strip + validate those client-side). Supported on Opus 4.8 / Sonnet 4.6 / Haiku 4.5.
  - This is the concrete answer to "how does a fuzzy review become pass/fail": the DoD is a Zod schema (e.g. `{ findings: [...], score: number, verdict: 'pass'|'fail' }`), the model is forced to fill it, and a threshold on `score` is deterministic.
- Confidence: high
- Notes: AI SDK 6's equivalent (`Output.object({ schema })` + `ToolLoopAgent`) is already grounded in m5-l2's brief — reference it, don't re-derive. Keep the lesson concept-level: "DoD as an executable schema," not an SDK API tour.

### promptfoo in CI — the regression gate on the agent

- URL: https://www.promptfoo.dev/docs/integrations/ci-cd/ · https://www.promptfoo.dev/docs/integrations/github-action/ · https://www.promptfoo.dev/docs/usage/command-line/ · https://www.promptfoo.dev/docs/configuration/expected-outputs/
- Type: official-docs · Author/publisher: promptfoo · Checked: 2026-06-09
- Supports: beat 6 (who reviews the reviewer).
- Use in lesson (operationalization only — the *concept* is m5-l2's):
  - **`promptfoo eval` exit codes**: returns **100** when ≥1 test fails **or** pass-rate < `PROMPTFOO_PASS_RATE_THRESHOLD` (default **100%**); returns 1 for other errors. So a failing eval fails the CI job by default — **no special flag needed**. Tune with `PROMPTFOO_PASS_RATE_THRESHOLD` (e.g. `95`) and `PROMPTFOO_FAILED_TEST_EXIT_CODE`.
  - **Version-sensitive gotcha**: tutorials mention a `--ci` flag; the current official CLI reference does **not** document it. Don't teach `--ci`; non-zero exit is the default. (Flag if m5-l2's draft used `--ci`.)
  - Manual gate variant (official CI doc): `npx promptfoo eval -c cfg.yaml -o results.json` then `jq '.results.stats.failures'` → `exit 1` if > 0. Output formats include `junit.xml` for CI reporters. Cache gotcha: hosted runners don't persist `~/.cache/promptfoo` — add `actions/cache@v4` to reuse provider responses.
  - **Official Action**: `promptfoo/promptfoo-action@v1` — runs the eval on a PR and posts a pass/fail summary comment (with a web-viewer link if sharing on). Key inputs: `config` (required), `github-token` (required), `anthropic-api-key`, `prompts` (globs to watch), `cache-path`, **`fail-on-threshold`** (the declarative gate: fail if success-rate below this %), **`repeat` + `repeat-min-pass`** (run each test N times, require M passes — for noisy evals), `promptfoo-version` (pin it), `disable-comment`. To *block merge*, make the action's job a required status check — the comment alone is informational.
  - **Assertions for a review agent's structured output**: `is-json` (optional value = a JSON Schema → validate the DoD shape), `javascript`/`python` (required keys, score bounds), `llm-rubric` (judge the free-form comment), `contains`/`equals`. `defaultTest.assert` applies invariants to *every* case (e.g. "always valid JSON, always within cost"). Scoring: assertion-level `threshold` + `weight` → weighted-average per test; test-level `threshold`; `assert-set` `threshold` = proportion of grouped asserts that must pass.
  - Self-built agent provider: `id: file://reviewProvider.ts` exporting a class with `callApi(prompt, ctx)` → `{ output, tokenUsage, cost }` (the AI-SDK wrapper); or first-class `anthropic:claude-agent-sdk` (needs `@anthropic-ai/claude-agent-sdk`). Both already in m5-l2's brief.
- Confidence: high
- Notes: keep prose concept-level; the eval *config* is real, not hand-waved. The "eval gate before the agent gates others" framing is the beat's whole point — repeatable test set, a quiet quality regression can't ship.

### `anthropics/claude-code-action` (v1) + Claude Code Skills — the contrast half of beat 7

- URL: https://github.com/anthropics/claude-code-action (README, `action.yml`, `src/`) · https://code.claude.com/docs/en/skills
- Type: official-docs / repo · Author/publisher: Anthropic · Checked: 2026-06-09
- Supports: beat 7 — *why* the production reference looks so different from the self-built agent.
- Use in lesson:
  - **The action is an agent *framework* wrapper**, not a thin API call: it loads `CLAUDE.md`, `.claude/`, skills, slash commands, MCP servers and runs an autonomous tool loop. `uses: anthropics/claude-code-action@v1`.
  - **v1 inputs**: `anthropic_api_key`, `prompt` (the instruction / `/skill-name` entrypoint), and **`claude_args`** — the v1 way to pass `--model`, `--max-turns`, `--allowedTools`, `--system-prompt`. **Version-sensitive (migration note)**: the top-level `allowed_tools`, `max_turns`, `model`, `custom_instructions` inputs were **removed in v1** and folded into `claude_args`. Permissions: `contents: write`, `pull-requests: write`, `id-token: write`.
  - **Inline comments**: built-in MCP tool `mcp__github_inline_comment__create_inline_comment` (posts a line-anchored review comment via `POST /pulls/:n/comments`; params `path`, `line`, `side`, `body`, `confirmed`). With `confirmed: true` it posts immediately; otherwise it's buffered and run through a lightweight ("Haiku-class") classifier that drops test/probe comments (toggle via `classify_inline_comments`).
  - **Untrusted-PR-head handling (load-bearing for *where the skill lives*)**: the action treats the PR head as untrusted — it snapshots PR-authored sensitive paths into `.claude-pr/`, deletes them, and **restores the base-branch versions** of `SENSITIVE_PATHS` (`.claude`, `CLAUDE.md`, `.mcp.json`, `.husky`, …). **Consequence: a review skill must already be committed to the base branch** (or staged user-level into `~/.claude/skills/`, which the production workflow does) — a skill added in the PR under review gets quarantined and is **not** loaded.
  - **The contrast (the sharp insight)**: skill auto-load is a property of the **runtime/harness** (Claude Code / claude-code-action / Managed Agents), **not** of the model or an arbitrary SDK. A from-scratch SDK agent (AI SDK 6 / raw Claude API loop) has **no skill discovery** — you inject criteria via the **system prompt** or pass the **diff as a parameter**, and you enforce structure with a **Zod/JSON schema**. The action, by contrast, lets the model read **prose criteria** in `SKILL.md` and **self-structure** a markdown verdict (later grep-parsed). Same job, opposite structuring strategy. This is exactly the spec's beat-7 thesis and the notes' two open questions ("czy kryteria z 10x-impl-review-ci trzeba przerzucić na Zoda" → **no, explain the divergence**; "AI SDK nie ma auto-load skilli na CI" → **confirmed; criteria via system prompt or diff-as-param**).
  - Skill mechanics for the prose: `SKILL.md` with YAML frontmatter (`name`, `description` [drives auto-invocation, ≤1536 chars], `allowed-tools`). Progressive disclosure: only the `description` sits in context; the body loads when invoked (by the model on a description match, or manually via `/skill-name`).
- Confidence: high
- Notes: the "Haiku-class classifier" model string isn't pinned from primary source — say "a lightweight classifier." `SENSITIVE_PATHS` does **not** cover nested `CLAUDE.md` (issue #1270). Don't over-teach the action — beat 7 is contrast + adoption, not a claude-code-action tutorial.

### `10x-impl-review-ci` — the production reference (internal, read in full)

- URL: `/Users/psmyrdek/dev/10x-toolkit/packages/ai-artifacts/skills/10x-impl-review-ci/SKILL.md` (+ `references/workflow-template.yml`)
- Type: internal-course-material · Author/publisher: 10x-toolkit · Checked: 2026-06-09
- Supports: beat 7 (what it adds / what it assumes) — and independently **confirms the merge-gate mechanics** above.
- Use in lesson — **what it adds** beyond the learner's hand-rolled agent:
  - **Plan-drift detection** — compares the PR against the plan it claims to implement (`context/changes/<change-id>/plan.md`): MATCH / DRIFT / MISSING / EXTRA per planned file.
  - **Test-coverage agent** — extracts test commitments from the plan's Success Criteria, runs the plan's automated commands, flags MISSING/FAILING/UNCOVERED.
  - **Seven graded dimensions** (Plan Adherence, Scope Discipline, Safety & Quality, Architecture, Pattern Consistency, Test Coverage, Success Criteria) → overall **APPROVED / NEEDS ATTENTION / REJECTED**.
  - **Inline review comments** on flagged lines (via the MCP tool, `confirmed: true`) + a committed report file (`reviews/impl-review.md`) + a summary PR comment. Severity × Impact grammar.
  - **The REJECTED gate** — the workflow's "Check review verdict" step greps `- **Verdict**: REJECTED` from the committed report and **POSTs a commit status `impl-review-ci/verdict` to the bot's HEAD SHA**, failing unless an `impl-review-override` label is present. *This is the concrete proof that the gate is a status check + label-as-override, not a label-as-gate.*
  - **What it assumes**: a **plan-driven workflow** (the `/10x-plan` → `/10x-implement` flow); no plan → it posts a neutral comment and exits 0. So it's not a drop-in for arbitrary repos.
- Use in lesson — **why it skips Zod** (the structural contrast made concrete): it runs **inside claude-code-action**, which auto-loads the `SKILL.md`; the model reads prose dimensions and **emits a markdown report**, and the verdict is extracted by a shell `grep -m1 -E '^\- \*\*Verdict\*\*:'`. There is no schema — the output contract is the `<!-- IMPL-REVIEW-REPORT -->` first-line marker + a parseable `Verdict:` line. The learner's self-built agent enforces the same idea with Zod because it owns the loop and has no skill framework. **Same intent, structuring strategy dictated by the runtime.**
- Delivery to learners: `npx @przeprogramowani/10x-cli@latest get <ref>` writes it to `.claude/skills/10x-impl-review-ci/`; invoked via `/10x-impl-review-ci`. (Lesson prose must use the CLI command, never the toolkit internal install.)
- Confidence: high (primary source, read 2026-06-09)
- Notes: the bundled `workflow-template.yml` is a complete, real GHA workflow — it stages the skill user-level (to dodge the `.claude-pr/` quarantine), runs `claude-code-action@v1` with `--model claude-opus-4-7 --max-turns 60`, validates `[skip ci]` + the output-contract marker, and posts the verdict status. It's the best single artifact to *show* (read, not build) for the GHA/secrets/gate material + the Deep Dive two-layer contrast. Its `actions/checkout@v4` is stale (now `@v6`) — mention if shown verbatim.

### GitHub Actions — Creating a composite action (NEW, draft section 3)

- URL: https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-composite-action
- Type: official-docs · Author/publisher: GitHub · Checked: 2026-06-14
- Supports: the "Composite Action: agent jako reużywalny plugin" section.
- Use in lesson:
  - A composite action is defined by an `action.yml` with `runs.using: composite`. It declares `inputs`/`outputs` and a list of `steps`, but **not** its own trigger or runner — the **consumer's** workflow decides `on:` and `runs-on:`. The action's steps are injected into the consumer job.
  - **Per-step `shell` is required** for every `run:` step inside a composite action (unlike a normal workflow where `shell` defaults). `${{ github.action_path }}` resolves to the action's own directory, so the action can run any script bundled with it (`node ${{ github.action_path }}/dist/review.js`) — this is what lets you wrap any AI SDK/runtime, not just JS.
  - **Outputs** flow a value back to the consumer: `outputs.verdict.value: ${{ steps.<id>.outputs.verdict }}`. **Inputs** parametrize (mode, API key) — treat them as untrusted (a consumer can inject hostile values).
  - **Hosting**: (1) a separate repo, `uses: org/ai-reviewer@<sha>` (publishable to the Marketplace); (2) a local subfolder `.github/actions/<name>/`, `uses: ./...`. Recommend (2) to start; the consumer workflow shrinks to `checkout` + one `uses:` step.
  - **Supply-chain (2026):** pin third-party actions to a commit **SHA** (`@<sha>`), not a moving tag (`@v1`). A tag can be repointed at unverified code that runs inside your pipeline with access to your secrets; a SHA freezes exactly the code you reviewed.
- Confidence: high
- Notes: stable, long-standing GitHub feature; well within current behavior. Distinguish from **reusable workflows** (compose whole processes) — a composite action packages a single reusable step.

### Vercel AI SDK (v6) — Tools, tool calling, and ToolLoopAgent (NEW, draft section 6)

- URL: https://ai-sdk.dev/docs/foundations/tools · (agents/loop-control + tool-loop-agent reference) · verified via Context7 `/vercel/ai @ ai_6.0.0-beta.128`
- Type: official-docs · Author/publisher: Vercel · Checked: 2026-06-14
- Supports: the "Więcej możliwości dla agenta" section (scorer → actor, the tool loop, the ladder of agency).
- Use in lesson (**verified against v6 docs**):
  - `tool()` = **`description`** (NL, the model reads it to decide whether/when to call) + **`inputSchema`** (Zod; the SDK both tells the model the input shape and validates what it generates) + **`execute`** (async, returns the result back to the model). ✅ confirmed.
  - `ToolLoopAgent({ model, instructions, tools, stopWhen })`; the scorer form uses `output: Output.object({ schema })`. Registering a tool is one field — `tools: { readPlan }` — on the same class. ✅ confirmed (`Output.object({ schema })` + `ToolLoopAgent` + `stopWhen: stepCountIs(n)` all present in v6).
  - The loop: each step the model either emits the final answer (loop ends) or requests a tool; the SDK validates args vs `inputSchema`, runs `execute`, appends the result, and gives the model the next turn. ✅ confirmed (`result.steps` holds the trace).
  - Loop safety: `stopWhen: stepCountIs(n)` caps the session; `stopWhen` also accepts an array (e.g. `[stepCountIs(20), hasToolCall('x')]`). `onStepFinish` / `isLoopFinished` per the draft.
- Confidence: high (API shapes), **medium on one claim**.
- Notes: ⚠️ **The draft states the DEFAULT is "stops after 20 steps (`stopWhen: stepCountIs(20)`)."** The v6 docs show `stepCountIs(20)` as the *canonical example* ("Maximum 20 steps") but I could **not** confirm from primary source that 20 is the **default when `stopWhen` is omitted**. Re-verify the default at publish (a possible correction: state it as the recommended/common cap rather than the framework default, or confirm the exact default). `onStepFinish` and `isLoopFinished` names are per the draft — confirm exact spelling at publish.

### OpenRouter — Quickstart (NEW, draft section 5)

- URL: https://openrouter.ai/docs/quickstart
- Type: official-docs · Author/publisher: OpenRouter · Checked: 2026-06-14
- Supports: the promptfoo `providers` block — one key, many vendors.
- Use in lesson:
  - One `OPENROUTER_API_KEY` gives access to models from many vendors, so the "cheaper? pricier? different vendor?" carousel is resolved without juggling vendor accounts. In promptfoo a provider is `id: openrouter:<vendor>/<model>` (e.g. `openrouter:anthropic/claude-haiku-4.5`, `openrouter:openai/gpt-5-mini`).
- Confidence: medium.
- Notes: the single-key/multi-vendor model and the `openrouter:` prefix are stable; the specific model slugs in the draft (`claude-haiku-4.5`, `claude-sonnet-4.6`, `gpt-5-mini`) are current-not-perennial — re-verify slugs at publish.

## Practitioner Signals

### "AI review is throughput, not replacement" (Deep Dive framing)

- Signal: agent-generated code produces more PRs than humans can review; the bottleneck moves from *writing* to *reviewing*. The realistic posture is risk-based triage — AI gates low/mid-complexity PRs, humans stay on critical paths — plus measuring whether you can *reduce* human intervention over time without quality loss.
- Useful language (PL): "AI jako przepustowość, nie zastępstwo", "triaging po ryzyku", "human-in-the-loop tam, gdzie krytyczne".
- Risk: this is a design framework, not a sourced fact — present it as a reasoned approach, not as measured industry consensus. The spec's D1–D4 already structure it well.
- Confidence: medium (as framing); low (as evidence) — no single authoritative source; synthesize from the spec + the production skill's seven-dimension model.

### Override-rate as the health metric (Deep Dive D3)

- Signal: the cleanest single signal for "is the AI review trustworthy" is **how often a human overrides its verdict**. Concretely: log at merge `{ ai_verdict, human_overrode (bool), complexity_tier }` to an append log/table; a rising override-rate on a tier = the DoD/evals need work. The production skill already models the override path (`impl-review-override` label) — the metric is "how often is that label used."
- Risk: "what to log / where" is a design sketch (the notes explicitly say "system do zbierania metryk — cokolwiek, do zaproponowania"). Present as a starter scheme, not a prescribed product.
- Confidence: medium (as a methodical sketch).

## Examples Worth Using

- **The spine**: the same l2 `review.ts` agent, now invoked by a `pull_request` (+ `workflow_dispatch`) workflow with the key from `secrets`. Diff in → scored verdict out → labels land. (The status-check gate is shown in the video.)
- **The agent as a Composite Action** (draft section 3): `action.yml` with `using: composite`, an `api-key` input, a `verdict` output, `node ${{ github.action_path }}/dist/review.js`; the consumer workflow shrinks to `checkout` + one `uses: org/ai-reviewer@<sha>` step.
- **`requirements.md` as the MVP seed** (draft section 4): overall concept + input params + `{{CR_CRITERIA}}` (1–10 scale) + parked items + `ai-cr` side-effect labels + retry — fed into research→plan→implement.
- **The promptfoo matrix over OpenRouter** (draft section 5 / task c): two–three `openrouter:<vendor>/<model>` providers on the same diff set; `is-json` + `javascript` (`JSON.parse(output).score <= 3`) + `llm-rubric`; show it failing (exit 100) on a planted bug before the agent is allowed to gate others.
- **Scorer → actor** (draft section 6): `ToolLoopAgent` + `Output.object` (the scorer) vs adding `tools: { readPlan }`; the `readPlan` tool (`description`/`inputSchema`/`execute`) reading `context/changes/<id>/plan.md`; `stopWhen: stepCountIs(8)`; the read→write→whole-GitHub→external ladder.
- **The structural contrast** (Deep Dive): "you own the loop → schema-structured output (`Output.object`)" vs "auto-loaded skill → model self-structures a prose verdict (grep-parsed)". `10x-impl-review-ci`'s `grep '^\- \*\*Verdict\*\*:'` line is the vivid proof.
- **The two-layer skill** (Deep Dive): `SKILL.md` (run-mechanics) vs `references/impl-review-instructions.md` (portable criteria); what it adds (plan-drift, test coverage, seven dimensions, inline comments, REJECTED gate) — read, not built.

## Claims To Avoid Or Soften

- **"A label blocks the merge."** It does not (Headline Finding). The shipped draft already avoids stating this — it keeps labels as the visible verdict and lets the video show the status-check gate. If the prose is ever expanded to teach the gate, soften to: the label is the human-readable verdict; a **required status check** posted by the workflow is what blocks.
- **"The AI SDK default is `stepCountIs(20)`."** ⚠️ Unconfirmed from primary source (the draft asserts it). `stepCountIs(20)` is the canonical *example* in v6 docs, but the default-when-omitted was not verified. Either confirm it or reword as "a sensible cap" / "set it explicitly" at publish.
- **Composite-action `@v1` tags as safe.** The draft is correct to pin to a SHA; don't present a moving tag as acceptable for a third-party action that runs inside a gating workflow with secret access.
- **"`promptfoo --ci`"** — not in current docs; the non-zero (100) exit is the default. Avoid the flag.
- **Action versions** — `checkout@v6`/`setup-node@v6` are current; the production template's `@v4` is stale. Don't present `@v4` as current; pin third-party actions to a SHA in a gating workflow (supply-chain).
- **`output_format` (Anthropic)** — deprecated top-level param; use `output_config.format`. Don't teach the old name.
- **Model IDs / pricing** — `claude-opus-4-8`, Sonnet 4.6, Haiku 4.5 and their rates are "as of mid-2026"; the production template pins `claude-opus-4-7`. Frame as current-not-perennial; bare ID strings, no date suffix; on Opus 4.8/4.7 `thinking` is `adaptive`-only (no `budget_tokens`/`temperature` → 400).
- **claude-code-action as a tutorial** — beat 7 is contrast + adoption, not a feature tour. Don't drift into MCP/classifier/sensitive-path depth beyond the one load-bearing fact (skill must be on the base branch).
- **promptfoo as a new concept** — it was introduced in m5-l2. Operationalize, don't re-introduce.
- **Branch-protection minutiae** — keep rulesets-vs-classic to one honest sentence ("rulesets are the current way; classic still works"); don't teach the full ruleset UI.
- **Fork-PR security depth** — the lesson's setting is an internal team repo; the no-secrets-on-forks + `pull_request_target` footgun is a one-line footnote, not a beat.

## Open Verification Questions

- ✅ **Which l2 build is the runnable CI example?** RESOLVED at draft (2026-06-10): the AI SDK 6 / `ToolLoopAgent` build, validated on przeprogramowani/10xCards PR #19.
- ✅ **Demonstrate vs explain the schema "port"?** RESOLVED: explained only, in the Deep Dive two-layer-skill discussion; no port demonstrated.
- ⚠️ **How explicitly to teach the status-check gate?** The draft chose to **defer it to the video** and only allude to the gate in prose. Still an open decision whether to expand the text (recommend, if expanded: labels as visible verdict + one honest sentence + one line of `gh api ... statuses/{sha}`).
- ⚠️ **`stepCountIs(20)` as the AI SDK default** — the draft asserts it; verify the default-when-omitted at publish (see the AI SDK Tools source note).
- **Freshness at publish** — re-verify `checkout`/`setup-node` majors, `claude-code-action` / `promptfoo-action` tags, promptfoo version/Node guidance (pinned on 0.120.15), and the OpenRouter model slugs before the draft hard-codes them.

## Schema Source Update

The m5-l3 entry in `workbench/lessons-schema.json` was updated in two passes:

**Grounding pass (2026-06-09):** added 8 curated `groundingSources` (GHA workflow syntax/triggers; GHA secrets/token/permissions; GitHub required-status-checks/rulesets; Anthropic structured outputs; promptfoo CI + GitHub Action; promptfoo assertions; claude-code-action v1 + Claude Code Skills auto-load; the `10x-impl-review-ci` SKILL.md). `status` set to `grounded` (now `drafted`).

**Backprop pass (2026-06-14, this reconciliation):**

- **Populated the contract fields from the shipped draft** (per author confirmation): `owns` (8), `referencesOnly` (5), `mustNotCover` (6), `learningOutcomes` (9) — derived from the draft, not the stale spec proposal.
- **Added 3 `groundingSources`** for the draft's new areas: GitHub "Creating a composite action"; Vercel AI SDK v6 Tools/agents (verified via Context7 `/vercel/ai @ ai_6.0.0-beta.128`); OpenRouter Quickstart. Now **11** sources total.
- **Reconciled relevance strings** away from stale beat numbers: the required-status-checks source now backs the video (gate deferred); structured-outputs reframed as the lighter `Output.object`/Deep Dive treatment; claude-code-action + `10x-impl-review-ci` reframed to the Deep Dive two-layer split.
- **`sideEffectLedger`** rewritten: `newClaimsIntroduced` (composite actions + SHA pinning; AI SDK tool loop; ladder of agency; OpenRouter provider; `requirements.md` MVP; two-layer skill); `claimsRemoved` (the dropped DoD-as-Zod beat + explicit status-check teaching); `potentialDuplicates`; `unsupportedFacts` (+ the `stepCountIs(20)`-default flag + OpenRouter slugs); `needsHumanDecision` (schema-enrichment marked RESOLVED; merge-gate depth left OPEN; toolkit wiring + promptfoo version carried forward).
- **`videoPlaceholders`** expanded to two entries (course video after section 4; the inline promptfoo placeholder in section 5).
