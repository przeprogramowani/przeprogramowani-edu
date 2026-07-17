# M5-L3 Source Material: API + CLI Model (`10x-toolkit/packages/api` → `10x-cli`)

Digest of `/Users/admin/code/10x-toolkit/packages/api` (Cloudflare Worker delivery API) and
`/Users/admin/code/10x-cli` (public consumer CLI). Compiled 2026-06-04 as the **third distribution model**
for m5-l3, alongside `webinar-learnings.md` (CodeArtifact + Terraform) and `github-packages-learnings.md`
(GitHub Packages). This is the system 10xDevs 3.0 learners use during the course — skills, prompts, and
configs live in a private repo and are delivered to authenticated course members via `10x auth` + `10x get`.

## Why a third model exists (the audience argument)

The npm-registry models (CodeArtifact, GitHub Packages) assume the consumer is a **trusted team member**:
someone you'd give a PAT or IAM role to. The moment the audience becomes **external and gated** — paying
customers, cohort members, license holders — registry auth stops fitting:

- you can't hand out org PATs to 3,000 students;
- entitlement lives in a business system (here: Circle community membership), not in GitHub/AWS IAM;
- access must be **revocable on refund/removal** and **time-gated** (modules unlock on a schedule);
- consumers use seven different AI tools, not one `.claude/` convention;
- the artifact source repo must stay private while delivery stays public.

So distribution becomes a **product**: API + CLI. This is the model where "Shared AI Registry" stops being
plumbing and becomes software you operate.

## Architecture (end to end)

```
private monorepo (10x-toolkit)                                  public repo (10x-cli)
ai-artifacts/ (skills, prompts, rules, configs)
   │  CI on merge: build lesson bundles (JSON)
   ▼
Cloudflare R2 (10x-toolkit-content/<course>/catalog.json, lessons/<id>.json)
   │  machine-to-machine only — clients never touch R2
   ▼
Cloudflare Worker API (Hono + zod-openapi)  ◄── KV: membership / auth / module-state
   │  JWT-gated JSON over HTTPS                  ▲
   ▼                                             │ webhooks + daily cron
10x auth → 10x get m1l1                       Circle.so (membership source of truth)
   │
   ▼
learner's workspace: .claude/ | .cursor/ | .github/ | .agents/ | ... + rules file
```

Three layers, each replaceable: **storage** (R2 bundles), **gate** (Worker: auth + entitlement + module state),
**applicator** (CLI: writes artifacts into the right tool's directories).

## The gate — what registry models can't do

### Auth: magic link + two-token pattern (`contracts/auth-api.md`)

- `POST /auth/login` (email) → checks membership KV → sends magic link via Resend. `403 no_access` if
  not a member; rate limit 3 req/email/15 min.
- **Two-token pattern**: `session_id` (128-bit, returned to the CLI for polling) is separate from
  `verification_token` (256-bit, only in the email link) — compromising one doesn't compromise the other.
- CLI polls `GET /auth/verify` → JWT delivered **exactly once**, then the session is deleted.
- **JWT: 1-hour TTL** (HS256) + **30-day refresh token with family-based rotation**: each refresh
  invalidates the old token; reuse of a rotated token revokes the entire family (stolen-token defense).
- **Membership is re-checked on every refresh** → a refunded/removed learner loses access within 1 hour.
  This is the revocation story registries don't have.
- Defense details worth teaching: verification tokens stored as SHA-256 hashes, constant-time comparison,
  brute-force lockout (5 attempts/session).

### Entitlement: pre-synced membership KV

Request-time checks are **pure KV lookups** (`member:<sha256(lowercased-email)>`) — no Circle API call in the
hot path. The KV is kept in sync by three mechanisms:

1. **Webhooks** (Circle Workflows → `/webhooks/circle`) — real-time joins/leaves;
2. **Daily reconcile cron** (`0 3 * * *`) — drift-detecting diff (adds AND deletes) against paginated
   Circle Admin API, with bounded 429 retries; webhooks catch events, cron catches what webhooks missed;
3. **Admin endpoints** — on-demand bulk sync / reconcile / drain for recovery.

Pattern name for the lesson: *sync entitlement out of the business system into an edge KV; check locally.*

**Email drift — an audience-specific ops cost.** When an admin changes a member's email in Circle mid-cohort
(employer seat transfers are the common case), the KV record keyed by the *old* email hash goes stale and the
learner loses access through no fault of their own. The reconcile cron detects email changes and migrates KV
records via a tri-state rollout (`disabled → dry_run → apply`), logging collisions instead of guessing. The
point for the lesson: the learner **cannot self-remediate** — only the operator can. npm package authors never
face this class of problem; it exists precisely because entitlement lives in a business system instead of an
identity the consumer controls.

### Module gating

Each module: `releaseAt` timestamp + optional KV `stateOverride` (locked/unlocked). Catalog/module endpoints
always respond and include `effectiveState` (client interprets); only the **lesson endpoint enforces** (403 when
the parent module is locked). Time-based course pacing — impossible in a plain registry.

### Content integrity

Optional **Ed25519 bundle signing**: the Worker signs lesson bundles (`X-Bundle-Signature` header), the CLI
verifies before writing anything to the learner's workspace. Supply-chain story for delivered AI artifacts.

## The applicator — `10x-cli`

- Distribution: `npx @przeprogramowani/10x-cli`, global npm install, or Bun-compiled standalone binaries
  (GitHub Releases). Node 20+ is the only requirement.
- UX: `10x auth` → `10x list` → `10x get m1l1` → `10x doctor` (diagnoses auth, connectivity, config;
  checks the npm registry for a newer CLI version — advisory only, with a graceful timeout so it never
  blocks offline).
- **Multi-tool support** — the CLI owns the "which directory does this tool use" mapping:
  Claude Code `.claude/`+`CLAUDE.md`, Cursor `.cursor/`+`.cursor/rules/10x-course.mdc`, Copilot
  `.github/copilot-instructions.md`, Codex `.agents/`+`AGENTS.md`, Windsurf, Gemini, generic `.ai/`.
  Tool choice persisted in `~/.config/10x-cli/config.json`, overridable with `--tool`.
- Rules use the **same sentinel-marker pattern** as the npm pack (block in the user's rules file), with a
  migration step that swaps old `@przeprogramowani/10x-toolkit` markers for CLI markers — pattern continuity
  across all three models. `--no-course-rules` opt-out is persisted; explicit `--type rules` overrides it.
- Composable flags: `--type/--name` filters, `--print` (pipe to stdout), `--dry-run`, `--json`.
- **The applicator is a security boundary, not just a file-writer.** Three mechanisms, all hardened after a
  real security review (2026-04-11): an exact **API-host allowlist** (only the production Worker hostname over
  HTTPS, or localhost for dev — a loose env override would enable token harvesting); **Ed25519 signature
  verification before any write** (content hash checked against `X-Bundle-Content-Hash`, signature over
  `v1:<keyId>:<sha256>`, failure is fatal); and a **sentinel-injection guard** — the CLI refuses to write a
  rules body that itself contains sentinel markers, so malicious lesson content can't corrupt the learner's
  rules file on the next re-apply. An npm installer needs none of this; a gated-delivery client has its own
  threat model.
- **No offline mode — a deliberate trade-off.** `10x list` and `10x get` require the API (catalog and bundles
  are never cached locally); only the doctor's update check degrades gracefully. Simplicity over offline-first
  — acceptable for a course CLI where network is expected, but it's an honest cost line next to "registry
  packages work from local cache".
- Meta touch: the repo ships a `10x-cli-setup` SKILL.md installable via `npx skills add przeprogramowani/10x-cli`
  — an Agent Skill that teaches the agent to install the CLI that delivers Agent Skills.

## The boundary — contracts and codegen

The private repo and public CLI meet at an explicit contract: `contracts/delivery-api.md`, `auth-api.md`,
`lesson-ref.md`, plus a generated **OpenAPI 3.1 spec** (`/openapi.json`, all routes registered via
`OpenAPIHono`/`createRoute`) from which the CLI generates its types at build time. Swagger UI at `/docs`.
This is how two repos with different visibility evolve without breaking each other.

## The cost — this model is operated, not just published

Running an API for a cohort means real ops (all present in the repo, all absent from registry models):

- **Pre-deploy smoke gate**: `wrangler versions upload` (inactive version, preview URL, production bindings)
  → smoke script (health → login → refresh → catalog → lesson) → promote to 100% only on pass. Motivated by a
  real incident where a post-deploy smoke failed *after* promotion.
- Structured JSON logs with a stable `reason` taxonomy (`kv_error`, `membership_revoked`, `jwt_invalid`...),
  PII guard (emails hashed, tokens/IPs never logged) — both pinned by tests.
- Slack deploy/failure notifications, outage runbooks, webhook secret rotation procedure, three-lever
  rollback (pause Circle Workflows → `wrangler rollback` → KV drain + re-sync).
- Worker deploy blocked if content upload fails ("a live worker with no content is worse than no deploy").

For the lesson this is the honest trade-off line: npm registry = hours, API+CLI = a product with on-call
characteristics. Teams should not pick model 3 because it's impressive; they pick it when the audience forces it.

## Where MCP fits in this model

MCP is an **alternative interface to the same gate**, not a fourth architecture: instead of a CLI writing files
into the workspace, an MCP server could expose the registry to the agent directly (tools like `get_skill`,
`search_prompts`). The webinar research (`webinar-learnings.md`) already documented why file-delivery won here:
artifacts must *live in the repo* (versioned, offline, visible in review) and work across 7 tools — while MCP
earns its place with live data, big corpora needing search, or system integrations. A short "when would this API
grow an MCP facade" beat can close the lesson's model 3 section honestly: same auth, same entitlement KV, same
R2 — different last mile.

## Three-model decision table (the lesson's spine)

| | npm registry: CodeArtifact + TF | npm registry: GitHub Packages | API + CLI (or MCP facade) |
|---|---|---|---|
| Audience | Team on AWS | Team on GitHub | **External / gated** (customers, cohorts) |
| Auth | IAM / OIDC | PAT / `GITHUB_TOKEN` | Magic link + JWT + refresh rotation |
| Entitlement | IAM policy | Org/repo membership | Business system (Circle) synced to KV |
| Revocation | Detach policy | Remove from org | ≤1h (JWT expiry + membership re-check) |
| Time gating | No | No | Yes (releaseAt + overrides) |
| Multi-tool delivery | Installer's job | Installer's job | CLI tool profiles (7 tools) |
| Setup cost | ~60 lines TF + AWS account | ~zero | Full product (API, auth, ops, support) |
| Operate cost | Token refresh, IAM hygiene | Token plumbing in 3rd-party CI | Smoke gates, logs, runbooks, cron |

## Where to look in the repos

| What | Path |
|---|---|
| API overview, endpoints, bindings, ops | `10x-toolkit/packages/api/README.md` |
| Auth contract (two-token, family rotation, KV keys) | `10x-toolkit/packages/api/contracts/auth-api.md` |
| Delivery contract (JWT claims, gating semantics) | `10x-toolkit/packages/api/contracts/delivery-api.md` |
| Routes (auth, catalog, lessons, webhooks, admin) | `10x-toolkit/packages/api/src/routes/` |
| Membership sync + reconcile | `10x-toolkit/packages/api/src/services/circle-sync.ts` |
| Module gating logic | `10x-toolkit/packages/api/src/lib/module-state.ts` |
| Ed25519 signing | `10x-toolkit/packages/api/src/lib/signing.ts` |
| Smoke gate | `10x-toolkit/packages/api/scripts/smoke-deployed.mjs` + `ci.yml` `deploy-worker` |
| CLI commands, multi-tool table, flags | `10x-cli/README.md` |
| Agentic setup skill | `10x-cli/skills/10x-cli-setup/SKILL.md` |
| Audience-based channel split | `10x-toolkit/docs/explanation/distribution-model.md` |

## Fit with the m5-l3 contract — boundary RESOLVED (author decision, 2026-06-04)

The m5-l3 / m5-l4 split is decided:

- **m5-l3 owns the "why" of the API+CLI model** as part of the Shared AI Registry spectrum: it's the approach
  that requires **no internal package registry at all and is not tied to the npm ecosystem** — the answer when
  the audience is gated/external or when you want to drop the registry dependency entirely. m5-l3 teaches all
  three distribution models, their trade-offs, and the decision framework; for model 3 that means audience
  argument, architecture (storage → gate → applicator), auth/entitlement/gating concepts, and the MCP-facade
  framing — described and reasoned about, not built step by step.
- **m5-l4 (AI Internal Builders) owns the "how"**: using AI to build tools for your company, team, or personal
  needs. `10x-cli` returns there as the case study of an internal tool built with AI — m5-l4 picks up a system
  whose *rationale* the learner already understands from m5-l3.

Bridge sentence logic: m5-l3 ends having justified *why this tool exists*; m5-l4 opens with *how a team
(or one person with agents) builds a tool like it*.

Additional hook: learners **already use model 3 daily** (`10x auth`, `10x get`) — m5-l3 can reveal the system
behind their own toolkit ("you've been the consumer; here's why the producer side looks like this"), and m5-l4
completes the arc on the builder side. The sentinel-marker rules pattern recurs across all three models — good
recurring-pattern thread for m5-l3. (Symlink/copy installs belong to the npm models only; the CLI writes
manifest-tracked copies — `.10x-cli-manifest.json` with per-file SHA-256 hashes — no symlinks.)
