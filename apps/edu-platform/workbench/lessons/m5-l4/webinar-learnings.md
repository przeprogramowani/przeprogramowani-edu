# M5-L3 Source Material: "Od chaosu do AI-Native Infrastructure" Webinar (Feb 26, 2026)

**Recording:** https://www.youtube.com/watch?v=hbuCLvwbMVg (Model 1 origin-story link for the lesson + `Materiały dodatkowe`).

Digest of `/Users/admin/code/ai-native-infra-poc` (full build + accumulated learnings) and
`/Users/admin/code/ai-native-infra` (clean spec-driven webinar version). Compiled 2026-06-04
as input for lesson-spec / lesson-grounding of m5-l3 "Shared AI Registry: skille, komendy i reguły dla zespołu".

## What was built (end-to-end pipeline)

```
Agent Skill (SKILL.md) → Extension Pack (npm + pack.yaml) → Private Registry (AWS CodeArtifact, Terraform)
→ CI/CD (GitHub Actions + OIDC) → Team Installation (npm install / npx copy mode)
```

Package: `@10xdevs/ai-toolkit`. Result in any consumer project: `.claude/skills/code-review/` + `.claude/commands/review.md`.

## Core narrative (directly reusable for the lesson)

- Hook: "50 deweloperów, 50 sposobów na prompt" — chaos of unshared AI configs.
- Insight: **AI artifacts (skills, rules, commands) are code — they need the same things code needs: versioning, testing, distribution.** Analogy: the pre-npm/pip/maven era of copying libraries by hand.
- Self-referential payoff: AI builds the platform that distributes AI capabilities; the webinar's own workflow skills (`create-skill`, `pack-init`, `tf-registry`, `setup-cicd`) are shipped as the bonus pack.
- Onboarding payoff: new developer → one command → full team AI toolkit in ~30 seconds (vs days).

## The five components and their key solutions

### 1. Agent Skill (input: team conventions)

- `context/conventions.md` (naming, error handling, TS rules, security, testing) is the **source document**; the `code-review` skill is generated from it. Pattern: conventions file → SKILL.md, not hand-written prompt.
- SKILL.md is the **Agent Skills Open Standard** (agentskills.io) — adopted by Claude Code, Codex CLI, ChatGPT, Cursor, VS Code/GitHub, Amp, Goose, OpenCode. Not proprietary.
- Frontmatter `description` is the trigger mechanism — include explicit trigger phrases ("review code", "check this PR") for auto-detection.
- Discovery is convention-based: `.claude/skills/<name>/SKILL.md` (project-level), `.claude/commands/<name>.md` for slash commands. No registration step.

### 2. Extension Pack (npm package + pack.yaml)

- `pack.yaml` manifest: `name`, `version`, `namespace`, `skills`, `commands`, **`presets`** (`learner` / `dev`) — progressive complexity for onboarding. Caveat: in the POC both presets have identical contents (and the clean repo has only `default`) — presets are a design pattern shown via manifest shape, not a demonstrated feature; frame as intent in the lesson.
- **Two install modes** (the most teachable design decision):
  - Symlink mode: `npm install @10xdevs/ai-toolkit` → postinstall creates symlinks into the **project's** `.claude/` (not `~/.claude/` — skills travel with the repo).
  - Copy mode: `npx @10xdevs/ai-toolkit install` → CLI copies files; works in ANY project (Python/Go/Rust, no package.json). Copy is mandatory here because the npx cache is ephemeral — symlinks would break after npx exits.
- `.claude/.ai-toolkit-manifest.json` records mode + exactly what was linked/copied → reliable uninstall without depending on `node_modules` still existing.
- `install.js` details: walks up from `node_modules` to find project root (CLI passes `PROJECT_ROOT` + `INSTALL_COPY` env vars instead); self-heals stale symlinks from previous installs; **never fails the install** (postinstall errors are warnings). The CLI auto-detects mode by checking for `package.json` in the project root — "design for the consumer's reality", no flag needed.
- Uninstall: **npm 10.x does NOT run `preuninstall` for dependencies** (security change since npm v7) → manifest-based cleanup via `npx ai-toolkit uninstall`, then `npm uninstall`. Fallback when the manifest is missing: scan `.claude/` for symlinks pointing at the package.

### 3. Private Registry (Terraform + AWS CodeArtifact)

- **Two-repo pattern**: `npm` (private packages) with upstream → `npm-store` (proxy with external connection to `public:npmjs`). Developers get ONE endpoint for both private and cached public packages.
- Core registry resources (domain + two repos, `main.tf`) are ~70 lines of Terraform; the full working setup (IAM, backend, outputs, variables) is ~250–400 lines. `terraform apply` completes in **~39 seconds**; cost $0–5/month (free tier). Compare Verdaccio on ECS/Fargate: 5–10 min deploy, $25–45/month, far more HCL — that comparison is why CodeArtifact won. (The webinar's "60 vs 200+ lines" framing compares core resources only.)
- Three-layer IAM: domain permissions policy, repository permissions policy, attachable managed policy (`devs10x-codeartifact-developer`) for developers/CI roles.
- S3 remote state with **native locking** (`use_lockfile = true`, Terraform >= 1.10 — no DynamoDB). State bucket must be bootstrapped manually (chicken-and-egg).
- Auth: `aws codeartifact login --tool npm ...` configures `.npmrc`; token valid 12h. **Scoped login** (`--namespace 10xdevs`) routes only `@10xdevs` through CodeArtifact, everything else stays on public npm. Teachable distinction: package scope (`@10xdevs`) ≠ CodeArtifact domain name (`devs10x`) — the repo's `terraform/outputs.tf` even emits the login hint with the wrong one (`--namespace @devs10x`); the docs' command is the correct one.

### 4. CI/CD (GitHub Actions + OIDC)

- Two jobs: **validate** (all PRs, zero AWS: pack.yaml required fields, SKILL.md frontmatter checks, frontmatter name == directory name, `npm pack --dry-run`) → **publish** (merge to master only: OIDC auth, CodeArtifact login, `npm publish`).
- OIDC = zero long-lived credentials. Three pieces: account-wide OIDC identity provider for `token.actions.githubusercontent.com`, IAM role with trust policy **scoped to specific repos** (`StringLike` on `:sub`, array for multiple repos — never `*`), `aws-actions/configure-aws-credentials@v4`. Note: the OIDC provider and role are **manual steps** (see `manual-steps-instructions.md`), deliberately outside Terraform — a teachable "codify vs one-time bootstrap" boundary, same category as the S3 state bucket.
- Workflow MUST have `permissions: id-token: write` or OIDC fails silently.
- Purpose-based role names (`github-actions-codeartifact`) beat repo-based names — one role shared by all publishing repos.

### 5. Team installation / governance

- Onboarding scenario: scoped login + one install command → working `/review` in 30s, any language/framework.
- Governance concepts shown: versioning, presets (learner/dev/full), Definition of Done via the review skill, clean uninstall.

## Spec-driven AI build (the meta-lesson)

The `ai-native-infra` repo shows the **workflow** used to build everything: each component had a short requirements spec written first (`context/spec-skill.md`, `spec-pack.md`, `spec-terraform.md`, `spec-cicd.md`) plus `conventions.md` (six sections: naming, error handling, TypeScript, functions, security, testing), and AI generated the component from the spec. Specs pin down names, versions, constraints (e.g. `devs10x`, region, `use_lockfile`) so live generation is deterministic. Checkpoint branches map 1:1 to the build stages — directly reusable as a video-scenario structure. Branch names differ per repo: POC has `start` → `checkpoint-1..4` → `final`; the clean repo has `master` → `checkpoint-1-cr-skill` … `checkpoint-4-cicd` → `final-test`.

Bonus meta-loop: four skills that regenerate the pipeline (`/create-skill`, `/pack-init`, `/tf-registry`, `/setup-cicd`) — "install the pack and rebuild the whole workflow yourself".

## Gotchas (rich teaching/failure-mode material, all battle-tested)

- CodeArtifact domain names must start with a lowercase letter → `10xdevs` rejected, renamed `devs10x`. Plan for it if your brand starts with a digit.
- npm 10.x skips `preuninstall` for dependencies → manifest-based cleanup pattern.
- macOS symlink types: `'dir'` for directories, `'file'` for files (`'junction'` is Windows-only).
- AWS provider v5 binary ~700MB → first `terraform plan` can time out; `TF_PLUGIN_TIMEOUT=300` (120 NOT enough); pre-warm before demos.
- Homebrew default tap ships Terraform 1.5.7 (pre-BSL); for >= 1.10 use `brew install hashicorp/tap/terraform`.
- Killed terraform mid-run → stale S3 state lock → `terraform force-unlock -force <LOCK_ID>`.
- `terraform destroy` fails if the managed policy is attached to roles outside TF → `aws iam list-entities-for-policy` + detach first.
- `npm publish` 409 when version already exists → bump version (or fresh registry).
- `npx <pack> install` runs postinstall in the npx cache first (confusing but harmless output); the CLI step is the one that matters.
- `npm pkg fix` pre-applies the corrections `npm pack` would silently make.
- CI workflow originally targeted `main` while the repo's primary branch is `master` → publish job silently never ran. Keep workflow triggers in sync with the actual default branch.

## Decisions with rationale (good "why" material)

- **CodeArtifact > Verdaccio**: deploy time (60s vs 5–10min), Terraform size (60 vs 200+ lines), cost ($0–5 vs $25–45/mo), IAM-native auth, built-in public proxy. Trade-off: no web UI.
- **MCP server deliberately cut from the main flow.** Markdown distributed via npm covers the typical team (≤20 devs, <100 internal docs): no runtime, offline, versioned. MCP earns its place only with: 1000+ doc corpora needing semantic search, live data (DB schemas, service status), system integrations (Jira/Confluence/Slack), or computed queries. Strong candidate for a Deep Dive boundary with m5-l4.
- **npm registry vs Claude Code plugin marketplaces**: git-based marketplaces (`.claude-plugin/marketplace.json`, `strictKnownMarketplaces`, `enabledPlugins`) are the zero-infra alternative — research flagged this as an open question worth addressing in the lesson.
- Landscape context (as of Feb 2026): SKILL.md adopted cross-platform; 96K+ skills on SkillsMP; npm-based cross-tool distribution already exists (vibe-rules, rulesync, Ruler); emerging `"exports": { "./llms": ... }` pattern — AI rules shipped WITH a library, like `.d.ts` for AI.

## Where to look in the repos

| What | Path |
|------|------|
| Accumulated gotchas | `ai-native-infra-poc/context/learnings.md` |
| Webinar plan + agenda + risk table | `ai-native-infra-poc/context/plan-webinaru.md` |
| Landscape research (SKILL.md standard, CodeArtifact vs Verdaccio, title brainstorm, MCP decision) | `ai-native-infra-poc/context/research.md` |
| Manual AWS steps (S3 bootstrap, OIDC, IAM) | `ai-native-infra-poc/context/manual-steps-instructions.md` |
| Dual-mode installer | `ai-native-infra-poc/install.js`, `bin/cli.js`, `uninstall.js` |
| Pack manifest | `ai-native-infra-poc/pack.yaml` |
| The five skills | `ai-native-infra-poc/skills/*/SKILL.md` |
| Terraform | `ai-native-infra-poc/terraform/` |
| CI workflow | `ai-native-infra-poc/.github/workflows/ci.yml` |
| Component specs (spec-driven build) | `ai-native-infra/context/spec-{skill,pack,terraform,cicd}.md` |
| Team conventions (skill input) | `ai-native-infra/context/conventions.md` |
| Presentation walkthroughs per segment | `ai-native-infra-poc/context/present/*.md` |
| E2E test | `ai-native-infra-poc/scripts/test-e2e.sh` |

## Fit with the m5-l3 contract

- m4-l1 owns the **conceptual** multi-repo framing (three layers, "the problem isn't duplication but manual sync") — m5-l3 references it backward and delivers the **practice of building** the distribution mechanism. The webinar material is exactly that practice.
- The `code-review` skill is **just the example payload** — its overlap with m5-l2 (review standards, DoD) is coincidental. m5-l3 teaches sharing AI artifacts and context in general; keep the example's review-standards content shallow and don't deepen material that belongs to m5-l2.
- `preparesFor: m5-l4` (AI Internal Builders) — the MCP-as-next-step decision and the `setup-cicd`/internal-tooling angle are natural bridges; keep MCP itself out of m5-l3 scope.
- **This is digest 1 of 3.** See `github-packages-learnings.md` (model 2: after the webinar, the author concluded AWS + Terraform is overkill for non-AWS teams and shipped the production toolkit on GitHub Packages) and `api-cli-learnings.md` (model 3: API + CLI for gated external audiences — the system learners use via `10x-cli`). Together they describe the lesson's distribution-model spectrum.
- Open editorial questions for lesson-spec:
  1. AWS CodeArtifact as the canonical path vs cloud-agnostic alternatives (GitHub Packages $0–5, GitLab registry, Artifactory, npm Pro $7/user) — webinar table exists; GitHub Packages now has its own full digest (see above).
  2. How much Terraform to teach vs treat as generated plumbing (webinar rule: ≤5 min on HCL syntax).
  3. npm registry vs Claude Code git-based plugin marketplace as the primary mechanism for 2026 readers.
  4. Whether the lesson reuses the checkpoint-branch structure for its video scenario.
