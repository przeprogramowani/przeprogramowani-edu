# Lesson Grounding: m5-l4 — Shared AI Registry: skille, komendy i reguły dla zespołu

> **Reorder note (2026-06-08):** This lesson moved m5-l3 → m5-l4 (internal digest paths updated below). Neighbor references in the body ("m5-l4 owns the *how*") predate the reorder — that builder topic is now m5-l1, preceding this lesson. The classic-PAT claim was re-verified 2026-06-08: official docs still say classic-only, but fine-grained npm support is inconsistent and classic tokens are being sunset — prose softened accordingly.

## Scope

- Lesson source: schema slot + `lesson-spec.md` (2026-06-04) + three internal digests (`webinar-learnings.md`, `github-packages-learnings.md`, `api-cli-learnings.md`)
- Neighbor boundaries: m4-l1 (multi-repo framing — back-reference only), m5-l2 (review standards — `code-review` skill is example payload only), m5-l4 (owns *how* to build the API/CLI; m5-l3 ends at *why*)
- Relevant prework: [3.2] instruction hierarchy, [2.2]/[2.3] tool conventions, [1.2] harness model — assumed vocabulary, not retaught
- Research posture: standard — internal digests already carry the deep material; this pass verifies the dated external claims the spec flagged in Open Questions and attaches primary sources for `Materiały dodatkowe`
- **Model numbering (updated 2026-06-08):** the lesson now presents models simple→heavy for learner progression — **Model 1 = GitHub Packages** (default), **Model 2 = AWS CodeArtifact/Terraform** (webinar build, retrospective), **Model 3 = API+CLI**. The "Model 1/2" labels below have been updated to this presentation order. The author's actual chronology (CodeArtifact first) is intentionally the reverse — see `lesson-spec.md`.

## Claims To Support

- **GitHub Packages requires a classic PAT for reads; fine-grained PATs are not supported** — load-bearing for the read/write asymmetry beat (Model 1 / GitHub Packages — its single complexity illustration) — needs official docs + "as of" framing (it's a roadmap item that may ship)
- **Write auth in CI is the free, ephemeral `GITHUB_TOKEN` (`permissions: packages: write`)** — the other half of the asymmetry — official docs
- **GH Packages setup is `publishConfig` + `.npmrc` scope mapping, no infrastructure** — defuses the "registry = platform engineering" failure mode — official docs
- **GH Packages is included in the GitHub plan** (free for public; 500MB/1GB included on Free, 2GB/10GB on Team for private) — decision-table cost row — billing docs
- **CodeArtifact tokens default to 12h validity** (configurable 15 min–12 h) — Model 2 (CodeArtifact) cost line — AWS docs
- **SKILL.md is an open, cross-tool standard with broad adoption** — the portability foundation beat — agentskills.io
- **Claude Code plugin marketplaces are git-hosted catalogs (`marketplace.json`) with team-level auto-install and managed-settings governance** — beat 9 alternative — official docs
- **Cursor has an official marketplace** distributing plugins (MCP servers + agent skills + automations) — beat 9; updates the Feb 2026 webinar-era open question — cursor.com
- **Skills-vs-MCP framing: file delivery beats a protocol for static artifacts (token cost, portability)** — MCP forward-pointer paragraph — technical post (Willison) + internal webinar research
- **Author progression narrative + pipeline anatomy + sentinel markers + model-3 architecture** — internal-course-material (three digests); author decision confirmed 2026-06-04, not a sourced external fact

## Strong Sources

### Working with the npm registry — GitHub Packages

- URL: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
- Type: official-docs
- Author/publisher: GitHub
- Checked: 2026-06-04
- Supports:
  - "GitHub Packages only supports authentication using a personal access token (classic)" — verbatim from docs, still true as of check date
  - Publishing via `publishConfig.registry` in `package.json` or `.npmrc` scope mapping (`@NAMESPACE:registry=https://npm.pkg.github.com`)
  - `GITHUB_TOKEN` publishes packages associated with the workflow repository
- Use in lesson:
  - Model 1 section (GitHub Packages): the one-field setup claim; the read/write token asymmetry beat; `Materiały dodatkowe`
- Confidence: high
- Notes:
  - The classic-PAT-only line is the single most aging-prone claim in the lesson — pair with roadmap #558 below and re-check at RC review

### About billing for GitHub Packages

- URL: https://docs.github.com/en/billing/concepts/product-billing/github-packages
- Type: official-docs
- Author/publisher: GitHub
- Checked: 2026-06-04
- Supports:
  - Free for public packages; private packages include 500MB storage / 1GB transfer (Free), 2GB / 10GB (Team), 50GB / 100GB (Enterprise Cloud); quotas shared with Actions
- Use in lesson:
  - Decision-table "cost" row for Model 1 / GitHub Packages ("included in the plan you already pay for")
- Confidence: high
- Notes:
  - Quota numbers can drift; the lesson should say "included quota in your plan" rather than hard-coding the GB figures in prose

### Packages support for fine-grained PATs (GitHub roadmap #558)

- URL: https://github.com/github/roadmap/issues/558
- Type: repo
- Author/publisher: GitHub (public roadmap)
- Checked: 2026-06-04
- Supports:
  - The classic-PAT limitation is acknowledged by GitHub and slated to change eventually — open since September 2022, still open at check date
- Use in lesson:
  - Justifies "as of mid-2026" framing on the classic-PAT claim; one-line aside that GitHub has promised fine-grained support for years
- Confidence: medium-high
- Notes:
  - Re-check immediately before publication; if it ships mid-course, the asymmetry beat survives (read auth still needs a long-lived secret on third-party CI) but the "classic only" sentence must change

### AWS CodeArtifact authentication and tokens

- URL: https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html
- Type: official-docs
- Author/publisher: AWS
- Checked: 2026-06-04
- Supports:
  - "CodeArtifact authorization tokens are valid for a default period of 12 hours"; configurable 15 min–12 h (`--duration-seconds` 900–43200)
  - `aws codeartifact login` configures npm with token + endpoint
- Use in lesson:
  - Model 2 (CodeArtifact) cost line ("token expires every 12h — daily re-login or automation"); Deep Dive (a)
- Confidence: high
- Notes:
  - (none)

### Agent Skills — open standard (agentskills.io)

- URL: https://agentskills.io
- Type: official-docs
- Author/publisher: Anthropic + community (open standard)
- Checked: 2026-06-04
- Supports:
  - SKILL.md = folder with metadata (`name`, `description`) + instructions; progressive disclosure model
  - "Originally developed by Anthropic, released as an open standard, adopted by a growing number of agent products"
  - Adopter showcase as of check date includes: Claude Code, Claude, OpenAI Codex, Cursor, VS Code, GitHub Copilot, Gemini CLI, JetBrains Junie, Goose, OpenCode, Amp, Roo Code, Kiro, Factory, Trae, Tabnine and more
- Use in lesson:
  - "Patterns that survive every model" beat — SKILL.md as the portability foundation; `Materiały dodatkowe`
- Confidence: high
- Notes:
  - The webinar digest's adopter list (Feb 2026) said "ChatGPT" — current showcase lists Claude/Codex/etc.; use the current list, name 4–6 adopters max and say "and more"

### Create and distribute a plugin marketplace — Claude Code docs

- URL: https://code.claude.com/docs/en/plugin-marketplaces
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-04
- Supports:
  - Marketplace = `marketplace.json` catalog in a git repo (GitHub/GitLab/other host); users add via `/plugin marketplace add`; updates via push + `/plugin marketplace update`
  - Team distribution: `extraKnownMarketplaces` + `enabledPlugins` in `.claude/settings.json` auto-prompt team members on folder trust
  - Governance: `strictKnownMarketplaces` in managed settings restricts allowed sources; stable/latest release channels via refs
- Use in lesson:
  - Beat 9 (alternatives): the zero-infra single-tool option, with concrete team mechanics; `Materiały dodatkowe`
- Confidence: high
- Notes:
  - The team auto-install mechanism is stronger than the webinar-era research recorded — beat 9 should present marketplaces as a genuinely viable single-tool path, with lock-in (channel is per-tool) as the trade-off, not a strawman

### Cursor Marketplace

- URL: https://cursor.com/marketplace
- Type: official-docs
- Author/publisher: Cursor (Anysphere)
- Checked: 2026-06-04
- Supports:
  - Cursor operates an official marketplace distributing plugins (MCP servers + agent skills), and automations; install in-app or via CLI
- Use in lesson:
  - Beat 9: "Cursor marketplace" is no longer speculative (resolves the webinar digest's open question); same lock-in framing applies
- Confidence: medium-high
- Notes:
  - Page-level evidence; team-distribution mechanics not documented on the landing page — don't claim parity with Claude Code's team settings, link docs at cursor.com/docs/plugins

### Claude Skills are awesome, maybe a bigger deal than MCP — Simon Willison

- URL: https://simonwillison.net/2025/Oct/16/claude-skills/
- Type: technical-post
- Author/publisher: Simon Willison
- Checked: 2026-06-04
- Supports:
  - Skills are "Markdown files with optional scripts" — portable across models/tools without protocol implementation
  - Token economy: MCP servers consume tens of thousands of context tokens; skills cost dozens until activated
- Use in lesson:
  - The MCP forward-pointer paragraph (file delivery vs protocol for static artifacts) — aligns with the internal webinar research's "MCP deliberately cut" decision
- Confidence: medium-high
- Notes:
  - Opinion piece by a credible practitioner — use for framing, not as a benchmark-grade fact

### Internal digest: webinar build (Model 2 — CodeArtifact, presented as retrospective)

- URL: workbench/lessons/m5-l4/webinar-learnings.md
- Recording: https://www.youtube.com/watch?v=hbuCLvwbMVg (the actual webinar — Model 2 origin-story link + `Materiały dodatkowe`)
- Type: internal-course-material
- Author/publisher: 10xDevs (author's own build, Feb 2026 webinar)
- Checked: 2026-06-04
- Supports:
  - Pipeline anatomy (skill → pack → CodeArtifact → CI/CD → install); Terraform/IAM cost lines; ~39s apply; gotchas (domain naming, provider timeouts, state locks); CodeArtifact-vs-Verdaccio rationale; spec-driven build workflow + handout specs
- Use in lesson:
  - Model 2 section + Deep Dive candidates + handout; webinar video link placement
- Confidence: high
- Notes:
  - "$0–5/month" is an internal estimate — present as the author's experience, not a sourced price

### Internal digest: GitHub Packages production system (Model 1 — default)

- URL: workbench/lessons/m5-l4/github-packages-learnings.md
- Type: internal-course-material
- Author/publisher: 10xDevs (production toolkit, `10x-toolkit/packages/internal-pkg`)
- Checked: 2026-06-04
- Supports:
  - Read/write token split in one CI job (read = `GH_PKG_TOKEN` PAT, write = ephemeral `GITHUB_TOKEN`); auth plumbing as code (preinstall trick, workflow patching, CF token sync); sentinel-marker rules distribution; manifest-tracked install/uninstall; release engineering (conventional commits + git-diff gate)
- Use in lesson:
  - Model 1 section (asymmetry beat), "patterns that survive every model" beat, Deep Dive (b)/(c)
- Confidence: high
- Notes:
  - Author-progression narrative (AWS webinar build → GH Packages production) is an author decision confirmed 2026-06-04, not a sourced external fact

### Internal digest: API + CLI model (model 3)

- URL: workbench/lessons/m5-l4/api-cli-learnings.md
- Type: internal-course-material
- Author/publisher: 10xDevs (`10x-toolkit/packages/api` + `10x-cli`)
- Checked: 2026-06-04
- Supports:
  - Audience argument (no PATs for 3,000 students; entitlement in a business system; revocation ≤1h; time gating); storage → gate → applicator architecture; multi-tool delivery (7 tool profiles); MCP as alternative last mile to the same gate; ops cost (smoke gates, runbooks, cron)
- Use in lesson:
  - Model 3 section + the reveal (`10x auth` / `10x get`) + decision table rows; m5-l4 boundary (why, not how)
- Confidence: high
- Notes:
  - Learner-facing prose uses only `10x auth` / `10x get` per `workbench/references/10x-content-delivery.md`; internal toolkit commands must not leak

## Practitioner Signals

### Hacker News: "Claude Skills" launch discussion

- URL: https://news.ycombinator.com/item?id=45607117
- Type: community-discussion
- Signal:
  - Real demand for org-wide skill sharing (Anthropic "working on skill sharing across teams in an organization" cited approvingly)
  - Recurring pain: re-teaching the agent the same procedures daily; hand-maintained per-project "profiles" of configs
  - Skepticism worth disarming in prose: skills are "a framework to append text to your prompt", "a design pattern / prompt engineering trick", "how is this different from MCP prompts?"
- Useful language:
  - "skill add foo" (analogy to `uv add foo` — practitioners already think in package-manager terms; supports the lesson's "AI artifacts are code" thesis)
  - "Skills can be toggled on and off, which is good for context management"
- Risk:
  - Weak evidence for any factual claim; use only to name pains and objections
- Confidence: medium

### Simon Willison (see Strong Sources)

- URL: https://simonwillison.net/2025/Oct/16/claude-skills/
- Type: technical-post
- Signal:
  - "Cambrian explosion in Skills" prediction — explains why the ecosystem (marketplaces, registries, indexes) exists at all by 2026
- Useful language:
  - Skills as "just Markdown files" — supports the lesson's claim that the *artifact* is portable even when the *channel* is tool-locked
- Risk:
  - Enthusiast framing; don't import the MCP-vs-skills rivalry tone into the lesson — m5-l3 needs MCP only as a forward-pointer
- Confidence: medium-high

### Matt Pocock — npm-package distribution of skills (X / post)

- URL: https://x.com/mattpocockuk/status/2062129440558047545
- Type: practitioner-signal
- Author/publisher: Matt Pocock (well-known TypeScript educator)
- Checked: 2026-06-14 (verified at RC review; added to grounding after the draft cited it)
- Signal:
  - An independent practitioner arrives at the same recipe the lesson teaches: an npm package containing skills plus a `postinstall`/`prepare` script that symlinks them into the relevant agents' directories (`.claude/skills` etc.). Summarised as simple, versioned, intuitive skill distribution.
  - Corroborated independently by the 2026 "skills as the npm moment" wave: the `skills`/`skills-npm` packages and the `mattpocock/skills` set (`npx skills@latest add mattpocock/skills`).
- Use in lesson:
  - "Trzy modele dystrybucji" intro beat (`lesson-draft.md:91`) — social proof that the package+postinstall recipe is not a course invention; screenshot `assets/matt-pocock-skill-distribution.png`; `Materiały dodatkowe` link
- Risk:
  - Practitioner signal, not a factual authority; present the wording as paraphrase, not a verbatim quote. The recipe is the load-bearing point, not the attribution.
- Confidence: medium-high (specific post verified at RC; pattern independently corroborated)
- Corroborating sources: https://mcp.directory/blog/matt-pocock-skills-the-npm-moment-explained-2026 ; https://github.com/antfu/skills-npm/blob/main/PROPOSAL.md ; https://www.npmjs.com/~mpocock

## Examples Worth Using

- The toolkit's own CI publish job using **two tokens in one job** (read = long-lived PAT, write = ephemeral `GITHUB_TOKEN`) — the cleanest concrete illustration of the asymmetry (github-packages-learnings.md, `ci.yml:130-152`)
- The sentinel-marker block in the learner's own `CLAUDE.md` — they can open the file and see `<!-- BEGIN ... -->` right now (pattern continuity across all three models)
- The reveal: `10x auth` + `10x get` as model 3 the learner has used all course
- Claude Code team auto-install: `extraKnownMarketplaces` in a repo's `.claude/settings.json` prompting teammates on folder trust — the marketplace path's strongest team feature
- Ecosystem scale anchor (if a number is wanted): SkillsMP indexes ~1.64M public SKILL.md files as of 2026-06 — but see Claims To Avoid below

## Claims To Avoid Or Soften

- **"96K+ skills on SkillsMP"** (webinar digest, Feb 2026) — stale by an order of magnitude: SkillsMP reported 1,640,440 indexed SKILL.md files on 2026-06-04. It's also a community-run aggregator counting public GitHub files, not a curated marketplace. Either drop the number or say "an independent index counts over a million public SKILL.md files (as of mid-2026)" — prefer dropping; any figure will be stale at publication
- **"Fine-grained PATs do NOT support GitHub Packages"** — true at check date, but a 3.5-year-old open roadmap item; always frame "as of mid-2026" and re-verify at RC review
- **"ChatGPT adopted SKILL.md"** — not on the current agentskills.io client showcase; name only adopters listed there
- **"CodeArtifact costs $0–5/month"** — internal estimate; present as the author's experience ("w naszym przypadku")
- **Marketplace lock-in as absolute** — the *channel* is per-tool, but the *artifact* (SKILL.md) is portable; Claude Code marketplaces also have real team/governance features. Keep the warning about the distribution channel, don't overstate it into "your skills are trapped"
- **"npm 10.x doesn't run preuninstall"** — internal claim, unverified externally this pass; installer internals are `mustNotCover` beyond one line anyway, so it shouldn't surface in prose
- **Any GB-level quota numbers for GH Packages billing in prose** — link the billing page instead; quotas drift

## Open Verification Questions

- Webinar recording URL — **resolved 2026-06-08:** https://www.youtube.com/watch?v=hbuCLvwbMVg (Model 2 / CodeArtifact section link + `Materiały dodatkowe`)
- Handout wiring (`10x get` lesson ref for the curated specs) — cross-repo work in `10x-toolkit/packages/course-content`, flagged in spec; needs scheduling, not research
- Re-check roadmap #558 (fine-grained PATs for Packages) and the docs' classic-PAT sentence at RC review — single most aging-prone claim
- Cursor marketplace team-distribution mechanics (beyond install) — only needed if beat 9 wants parity claims with Claude Code; current draft plan doesn't require it

## Schema Source Update

Updated `workbench/lessons-schema.json`, m5-l3 entry only:

- Added `groundingSources` (12 entries): GitHub Packages npm docs, GH Packages billing docs, GitHub roadmap #558, AWS CodeArtifact tokens docs, agentskills.io, Claude Code plugin-marketplaces docs, Cursor Marketplace, Simon Willison skills-vs-MCP post, HN Claude Skills discussion, and the three internal digests (webinar / github-packages / api-cli learnings). SkillsMP deliberately kept out of schema (volatile number, weak evidence) — brief-only.
- Updated `sideEffectLedger.unsupportedFacts`: stale SkillsMP figure; CodeArtifact cost estimate as internal-only; npm preuninstall claim unverified.
- Updated `sideEffectLedger.needsHumanDecision`: whether to cite any skills-ecosystem count at all; webinar recording URL.
- Set `status` to `grounded` (spec + grounding now exist), matching the convention used by m3-l4/m3-l5.
- Did **not** touch `owns`/`learningOutcomes`/`mustNotCover` — the spec's schema-enrichment proposal remains a separate, explicitly user-approved step (per spec Open Questions).
