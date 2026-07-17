# M5-L3 Source Material: GitHub Packages Approach (`10x-toolkit/packages/internal-pkg`)

Digest of `/Users/admin/code/10x-toolkit/packages/internal-pkg` — the production evolution of the webinar PoC.
Compiled 2026-06-04 as the **second approach** for m5-l3, alongside `webinar-learnings.md` (AWS CodeArtifact + Terraform).

## The core realisation (lesson thesis material)

AWS CodeArtifact + Terraform is overkill for teams that don't already live on AWS: account setup, KMS,
three-layer IAM, OIDC trust policies, S3 state bootstrap, provider timeouts — all to host a few scoped packages.
**GitHub Packages removes the infrastructure layer entirely**: the registry already exists with your GitHub org,
publishing from CI authenticates with the auto-provided `GITHUB_TOKEN`, and the only "provisioning" is a
`publishConfig.registry` field in `package.json`. This is the approach actually running in production for the
10xDevs toolkit (`@przeprogramowani/10x-toolkit`, v2.26.x, published on every merge to master).

## Approach comparison (the lesson's decision framework)

| Aspect | AWS CodeArtifact + Terraform (PoC) | GitHub Packages (production) |
|---|---|---|
| Infra to provision | Domain, 2 repos, KMS, 3-layer IAM, S3 state bucket | **None** — registry exists with the org |
| IaC | ~60 lines Terraform + manual S3 bootstrap | Zero; `publishConfig` in package.json |
| Publish auth (CI) | OIDC provider + IAM role + trust policy + 2 secrets | Auto-provided `GITHUB_TOKEN` (`permissions: packages: write`) |
| Consume auth (dev) | `aws codeartifact login` (token expires 12h) | One-time `npm login` with classic PAT (`read:packages`) |
| Consume auth (same-org CI) | OIDC role | Classic PAT secret (`GH_PKG_TOKEN`) — production never relies on `GITHUB_TOKEN` for reads |
| Public packages | Built-in proxy (`npm-store` upstream) | Not needed — scope mapping routes only `@org/*` to GH Packages |
| Cost | $0–5/mo (free tier) | Included in GitHub plan |
| Pain points | Provider timeouts, IAM teardown, domain naming, token expiry | Classic-PAT-only, third-party build environments (CF Pages/Workers) |
| Fits when | Org is AWS-native, wants full IaC control, needs registry-level governance | Org is already on GitHub (most teams) |

Key simplification vs CodeArtifact: GitHub Packages serves **only your scope**; everything else comes from
public npm via the `.npmrc` scope mapping (`@przeprogramowani:registry=https://npm.pkg.github.com`).
No proxy repo, no "all traffic through the registry" decision.

> **Provenance**: this comparison is editorial synthesis across two repos, not a sourced document — the
> toolkit repo contains zero mention of CodeArtifact/AWS/Terraform (no alternatives-considered doc exists).
> The CodeArtifact column is grounded claim-for-claim in `webinar-learnings.md`; the framing "author built
> the AWS version for the webinar, then shipped GitHub Packages to production" is the author's own
> progression, to be confirmed as an author decision in lesson-spec rather than cited as a sourced fact.

## Auth — where the real complexity moved

The infra disappeared, but auth across environments became the engineering problem. The package solves it
**by making the installer patch the consumer project** (auth plumbing as code):

1. **Local dev**: one-time `npm login --registry=https://npm.pkg.github.com` with a **classic** PAT
   (`read:packages`) stored in `~/.npmrc`. **Gotcha: fine-grained PATs do NOT support GitHub Packages.**
2. **Consumer repo**: installer writes/extends `.npmrc` with the scope mapping and adds a `preinstall`
   script to `package.json`:
   `[ -n "$GH_PKG_TOKEN" ] && echo '//npm.pkg.github.com/:_authToken=${GH_PKG_TOKEN}' >> .npmrc || true`
   — injects auth in CI, no-op locally.
3. **GitHub Actions**: installer **parses and patches the consumer's workflow YAML** (`github-packages-auth.ts`):
   adds `registry-url` + `scope` to `setup-node` blocks and `NODE_AUTH_TOKEN: ${{ secrets.GH_PKG_TOKEN }}`
   to `npm ci/install` steps — idempotent (skips if already present).
4. **Cloudflare Pages/Workers** (builds on third-party infra can't see GitHub secrets): installer injects an
   "Ensure CF GH_PKG_TOKEN" step before every `wrangler deploy` step, syncing the token to the CF project
   via API. Plus a manual `npx @przeprogramowani/10x-toolkit cf-auth` command (resolves credentials:
   `CF_API_TOKEN` env → wrangler OAuth token → `wrangler.toml` account_id → API lookup) and a bulk
   `cf-sync-token.sh` for all projects at once.

**The read/write token split** — even the toolkit's own publish job uses two different tokens in one job
(`.github/workflows/ci.yml:130-152`): it *reads* private packages during install with the long-lived
`GH_PKG_TOKEN` PAT (`NODE_AUTH_TOKEN: ${{ secrets.GH_PKG_TOKEN }}`) but *publishes* with the ephemeral,
auto-provided `GITHUB_TOKEN` (`permissions: packages: write`). Write auth is free and short-lived; read auth
is PAT plumbing everywhere — locally, in consumer CI, on third-party platforms. This asymmetry is the single
clearest illustration of where the complexity moved.

This third-party-CI problem (point 4) is the honest cost of GitHub Packages — a great "no free lunch" teaching
beat: with CodeArtifact the cost is upfront IaC; with GH Packages it's distributed auth plumbing.

## Evolution of the pack itself (beyond the PoC)

The installer (`install.ts`) kept the PoC core (dual symlink/copy modes, project-root walk-up, manifest
`.claude/.10x-toolkit-manifest.json`, stale-symlink self-healing, never-fail postinstall) and added:

- **Four artifact types** instead of two: skills (`.claude/skills/`), prompts (`.claude/prompts/`),
  **rules**, and **config templates** (copy-only, skip-if-exists — user-owned after first install).
- **Rules via sentinel markers**: `rules/CLAUDE.md` is *appended to the project's `CLAUDE.md`* between
  `<!-- BEGIN @przeprogramowani/10x-toolkit -->` / `<!-- END ... -->` markers. Idempotent re-install
  (old block replaced), repairs partial/broken markers. This is the answer to "how do you distribute
  AI rules into a file the user also edits".
- **Skill dependency resolution**: skills declare `requires: [dep]` in frontmatter; installer auto-includes
  available deps, warns on missing ones, `--no-auto-deps` to suppress. Manifest records per-artifact deps
  so uninstall can warn about breaking dependents.
- **Presets** moved from `pack.yaml` to `package.json` under `10xToolkit.presets` (`minimal`, `bootstrap`)
  — one manifest file instead of two; `--preset NAME` filters skills/prompts/rules/configs.
- **Legacy migration**: cleans old `.claude/commands/` from previous toolkit versions using the old manifest
  (corrupted manifest → leave alone, avoid data loss).
- **Workspace-link guard**: skips `.npmrc`/workflow patching when installed via `workspace:*` in the source
  monorepo itself.
- **TypeScript + tsdown** build; content lives in a separate workspace package (`@przeprogramowani/ai-artifacts`)
  and is copied into `dist/` at build time — **content/installer separation** so artifact authors never touch
  installer code.

## Release engineering (fully automated, no human version bumps)

`scripts/auto-version.mjs` + the `publish-internal-pkg` CI job:

- **Auto-version from conventional commits** (conventional-recommended-bump, angular preset) scoped to
  `packages/internal-pkg` + `packages/ai-artifacts`.
- **Two release gates**: (1) releasable conventional commits exist (excluding `chore(release)`),
  (2) `git diff` ground truth — package-shipping files actually changed. Gate 2 kills spurious releases
  from mislabeled commits; "commit types can be wrong, git diff cannot".
- **Changelog injected into README** between `<!-- CHANGELOG -->` markers — because GitHub Packages
  displays the package README; release notes come from `gh release create --generate-notes`.
- CI publishes with `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`, then commits the bump, tags, and
  creates a GitHub Release. Duplicate versions are rejected by GH Packages (same 409 class as CodeArtifact) —
  auto-versioning makes that a non-issue.
- E2E suite (`test-e2e.sh`, 13 scenarios): package validation, frontmatter checks, both install modes,
  uninstall cleanup, dependency auto-include/missing/`--no-auto-deps`, vault-path leak detection.

## Bigger-picture: three distribution channels by audience (`docs/explanation/distribution-model.md`)

The production system splits distribution by **audience** — a load-bearing design decision:

| Channel | Tech | Audience |
|---|---|---|
| npm package (GH Packages) | `@przeprogramowani/10x-toolkit` | **Authors/internal team only** (dogfooding) |
| R2 content bundles | Cloudflare R2 | Machine consumer (delivery API) |
| Delivery API + public CLI | CF Worker + `@przeprogramowani/10x-cli` | **Learners** (magic-link auth, module gating) |

Lesson-relevant insight: a private npm registry is the right tool for *a team distributing artifacts to itself*.
Once the audience is external/gated (customers, cohort members), npm auth doesn't fit — that's when you outgrow
the registry into an API/CLI. That third model now has its own full digest: see `api-cli-learnings.md`.
Boundary decision (2026-06-04): m5-l3 owns the *why* of the API+CLI model (registry-free, npm-independent
distribution); m5-l4 owns the *how* — using AI to build such internal tools, with `10x-cli` as case study.

## Gotchas worth teaching

- **Classic PAT only** — fine-grained PATs don't support GitHub Packages (still true as of this build).
- Third-party build platforms (CF Pages/Workers) can't read GitHub secrets → token must be synced to the
  platform; the installer automates this via workflow patching + CF API.
- GH Packages rejects duplicate versions → automate versioning (conventional commits + git-diff gate).
- README is the package's display page on GH Packages → inject changelog there.
- Sentinel markers must handle the *partial marker* case (user deleted one marker) or re-installs duplicate rules.
- Preset filtering must still run dependency resolution — a preset that omits a skill's `requires` would
  silently break it without auto-include.

## Where to look in the repo

| What | Path (under `/Users/admin/code/10x-toolkit/`) |
|---|---|
| Package overview + auth setup | `packages/internal-pkg/README.md` |
| Installer (modes, presets, deps, sentinel rules) | `packages/internal-pkg/src/install.ts` |
| Auth plumbing (npmrc, preinstall, workflow + CF patching) | `packages/internal-pkg/src/github-packages-auth.ts` |
| CF token sync command | `packages/internal-pkg/src/cf-auth.ts` |
| Dependency resolution | `packages/internal-pkg/src/dependencies.ts` |
| Auto-versioning | `packages/internal-pkg/scripts/auto-version.mjs` |
| CI publish job | `.github/workflows/ci.yml` (`publish-internal-pkg`) |
| Specs (pack, CI/CD) | `context/spec-pack.md`, `context/spec-cicd.md` |
| Distribution model (3 channels by audience) | `docs/explanation/distribution-model.md` |
| Consumer how-to | `docs/how-to/consume-internal-package.md` |
| Publisher how-to | `docs/how-to/publish-internal-package.md` |
| E2E tests | `packages/internal-pkg/scripts/test-e2e.sh` |

## Fit with the m5-l3 contract

- Strengthens the lesson into a **two-approach narrative**: "registry as infrastructure" (CodeArtifact/Terraform,
  webinar) vs "registry you already have" (GitHub Packages, production). The course can teach GH Packages as the
  default recommendation and CodeArtifact as the AWS-native/governance-heavy variant — mirroring the author's own
  real-world progression (built the AWS version for the webinar, shipped the GitHub version to production).
- Note for grounding: learners already interact with the *consumer side* of this exact system via `10x-cli`
  (see `workbench/references/10x-content-delivery.md`) — the lesson can reveal "the registry behind your toolkit"
  as a worked example without leaking internal-only commands into learner-facing prose.
- Boundary watch: delivery API / CLI / R2 channels belong to m5-l4 (AI Internal Builders) territory — mention as
  forward-pointer only.
