# Lesson Grounding: m1-l5 — Od localhosta na produkcję: auto-deploy, MCP i CLI

## Scope

- Lesson source: `lessons-schema.json` + `lessons/m1-l5/lesson-spec.md`
- Neighbor boundaries: m1-l4 owns AGENTS.md, custom instructions, local hooks, inner loop and failure-modes; m2-l1 owns MVP milestones, dependencies and priority planning; m3 owns custom GHA pipelines, approval gates, environment protection rules and read-only CI diagnostics. m1-l5 owns deployment environment research, interface choice and the minimum auto-deploy artifact (platform-managed GitHub ↔ platform integration — no custom GHA pipelines).
- Relevant prework: [1.2] agent/harness/tool use, [2.1] local/terminal/cloud agent environments, [2.3] Claude Code and operational commands, [2.4] agent-native discipline, [3.2] prompt as contract, [3.3] context lifecycle, [4.1] agent-friendly stack, [4.2] good project includes CI/CD.
- Research posture: deep for current tool/platform facts; standard for conceptual framing; light for community/practitioner signals.

## Claims To Support

- Skills and MCP are complementary, not mutually exclusive — prevents the draft from turning into a false "skills vs MCP" taxonomy — official Anthropic source.
- MCP is useful for connecting agents to external tools/data, but large tool surfaces can increase token cost and latency — supports the "MCP is not automatically better than CLI" warning — official Anthropic engineering source.
- Cloudflare can be a CLI-first example because Wrangler supports project/deployment operations and Pages preview/direct-upload flows — supports the Cloudflare demo path — official Cloudflare docs.
- Netlify has both CLI and official MCP support for agentic deployment workflows — supports "MCP + CLI together" platform example — official Netlify docs.
- Vercel has an official remote MCP that can manage projects/deployments/logs, but it is beta — supports current Vercel example and caveat — official Vercel docs.
- AWS MCP Server Deployment SOPs can guide agents through deployment, CDK/CloudFormation and CI/CD, but require IAM/AWS CLI/CDK and review of generated infrastructure — supports AWS as high-power/high-caution contrast — official AWS docs.
- GitHub Actions environments support approvals, environment secrets and deployment protection rules; `gh` can inspect workflow run status/logs — **belongs to m3 (custom CI pipelines and approval gates); referenced from m1-l5 only as a forward pointer**, not as material for m1-l5 prose.
- Practitioner discourse around MCP vs CLI often centers on tool-schema token cost, operational control, version drift and security — supports objections/language, not hard facts — HN/X/community.

## Strong Sources

### Building agents that reach production systems with MCP

- URL: https://claude.com/blog/building-agents-that-reach-production-systems-with-mcp
- Type: technical-post
- Author/publisher: Anthropic / Claude
- Checked: 2026-05-08
- Supports:
  - Production agents increasingly run in the cloud and need authenticated access to remote systems.
  - Direct API calls, CLIs and MCP are three valid integration paths; mature integrations often expose all three.
  - CLI is lightweight and strong in local/sandboxed environments, but thinner as a common layer for cloud/web/mobile agents.
  - MCP is positioned as the portable common layer for production/cloud agents across compatible clients.
  - Effective MCP servers should be remote, group tools around intent, avoid endpoint-by-endpoint API mirrors, use code orchestration for huge operational surfaces, standardize auth, and support user elicitation for confirmations, OAuth and credentials.
  - Skills and MCP remain complementary: MCP exposes capabilities, skills carry the playbook for using them well.
- Use in lesson:
  - Upgrade the "CLI vs MCP" section into an "API + CLI + MCP" decision matrix.
  - Add nuance: CLI remains useful for auditable local commands, while MCP becomes more important when the agent itself runs in the cloud and needs portable authenticated access.
  - Strengthen the read-only/approval discussion with elicitation and URL-mode patterns for destructive actions, OAuth and sensitive credentials.
- Confidence: high
- Notes:
  - Avoid turning the lesson into MCP server design. Use only the production-agent implications: remote systems, auth, intent-shaped tools, code orchestration, progressive disclosure and skill pairing.

### Extending Claude's capabilities with skills and MCP servers

- URL: https://www.claude.com/blog/extending-claude-capabilities-with-skills-mcp-servers
- Type: official-docs
- Author/publisher: Anthropic / Claude
- Checked: 2026-05-04
- Supports:
  - Skills and MCP should be framed as complementary layers.
  - MCP connects Claude to tools; skills teach workflows and procedures for using those tools.
- Use in lesson:
  - Anchor the "skill + CLI/MCP" framing.
  - Prevent a simplistic hierarchy where skills are "better than" MCP or MCP replaces skills.
- Confidence: high
- Notes:
  - Good fit for the lesson's central stack: skill packages process, MCP exposes external systems.

### Skills explained: How Skills compares to prompts, Projects, MCP, and subagents

- URL: https://www.claude.com/blog/skills-explained
- Type: official-docs
- Author/publisher: Anthropic / Claude
- Checked: 2026-05-04
- Supports:
  - MCP is the connection layer to tools and data.
  - Skills carry procedural knowledge for how to use external systems well.
- Use in lesson:
  - One paragraph explaining why `10x-infra-research` can guide the agent while MCP/CLI/API provide capabilities.
- Confidence: high
- Notes:
  - Keep this short to avoid stealing m1-l2's anatomy-of-skills territory.

### Code execution with MCP: Building more efficient agents

- URL: https://www.anthropic.com/engineering/code-execution-with-mcp
- Type: technical-post
- Author/publisher: Anthropic Engineering
- Checked: 2026-05-04
- Supports:
  - Large connected tool surfaces can overload context with tool definitions and intermediate results.
  - Progressive disclosure, tool search and code execution are practical mitigations.
  - MCP remains foundational, but naive tool exposure can reduce efficiency.
- Use in lesson:
  - Evidence for softening "MCP is always better" and for evaluating the operational surface of a platform.
  - Supports the CLI-vs-MCP section: the important question is context efficiency, auditability and control, not hype.
- Confidence: high
- Notes:
  - Do not turn the lesson into MCP internals. Use as one source-backed caveat.

### Connect Claude Code to tools via MCP

- URL: https://docs.anthropic.com/en/docs/claude-code/mcp
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-04
- Supports:
  - MCP servers can connect Claude Code to issue trackers, monitoring, databases, design tools and workflow systems.
  - MCP can expose prompts as slash commands and dynamically discovered workflows.
- Use in lesson:
  - Concrete examples for why deployment work may need external systems beyond the cloud platform itself: GitHub, Jira/Linear, Sentry/monitoring, Slack.
- Confidence: high
- Notes:
  - Useful for "Connect to Jira/Linear - how?" as a sidebar, but do not go deep; that's not the lesson's owned scope.

### Wrangler — Cloudflare Workers docs

- URL: https://developers.cloudflare.com/workers/wrangler/
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-05-04
- Supports:
  - Wrangler is Cloudflare's developer platform CLI.
  - It manages Worker projects, commands, configuration, deployments and related developer platform workflows.
- Use in lesson:
  - Main "CLI-first" platform example: agent can inspect docs, run explicit commands and leave terminal output as an auditable trace.
- Confidence: high
- Notes:
  - The spec's `wrangler deployments list/status` phrasing is strongest for Workers; Pages has separate Pages commands and dashboard flows. Draft must distinguish Workers vs Pages.

### Cloudflare Pages Direct Upload

- URL: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-05-04
- Supports:
  - Pages Direct Upload can deploy built assets through Wrangler.
  - Preview deployments can be created through branch-specific deploys.
  - Direct Upload projects have tradeoffs versus Git integration.
- Use in lesson:
  - Ground the Cloudflare Pages path for Astro/static output and preview deployment.
  - Support the "research platform first" point: deployment method choices can constrain future workflow.
- Confidence: high
- Notes:
  - Draft should avoid implying Direct Upload is always best. It is one path, not the recommendation.

### Cloudflare Pages Preview Deployments

- URL: https://developers.cloudflare.com/pages/configuration/preview-deployments/
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-05-04
- Supports:
  - Pull requests can create unique preview URLs for Pages when using Git integration.
  - Preview deployments can be protected with Cloudflare Access.
- Use in lesson:
  - Evidence for "preview before production" and for including preview access/privacy in the research matrix.
- Confidence: high
- Notes:
  - Do not overstate availability for fork PRs or all repository setups; docs include conditions.

### Netlify MCP Server

- URL: https://docs.netlify.com/welcome/build-with-ai/netlify-mcp-server/
- Type: official-docs
- Author/publisher: Netlify
- Checked: 2026-05-04
- Supports:
  - Netlify MCP Server enables code agents to create/manage/deploy projects and manage settings such as access controls, extensions, forms, env vars and team info.
  - Netlify recommends installing Netlify CLI so the MCP server can use it where possible.
- Use in lesson:
  - Best example of "MCP and CLI together" from an official platform.
  - Good fit for `10x-infra-research` criteria: MCP, CLI, env vars, deploys, access controls.
- Confidence: high
- Notes:
  - Source directly supports the spec's "MCP is a signal of agentic support, not the whole evaluation."

### Netlify CLI deploy command

- URL: https://cli.netlify.com/commands/deploy/
- Type: official-docs
- Author/publisher: Netlify
- Checked: 2026-05-04
- Supports:
  - `netlify deploy` builds and deploys; draft deploy is default, `--prod` deploys live.
  - Command returns deploy and function log URLs.
- Use in lesson:
  - Concrete contrast: CLI can be safer for explicit preview/draft deploys before production.
- Confidence: high
- Notes:
  - Strong example for approval gates: production deploy should be explicit.

### Use Vercel's MCP server

- URL: https://vercel.com/docs/ai-resources/vercel-mcp
- Type: official-docs
- Author/publisher: Vercel
- Checked: 2026-05-04
- Supports:
  - Vercel MCP is official, remote, OAuth-backed and currently beta.
  - It can search docs, manage projects and deployments, and analyze deployment logs.
- Use in lesson:
  - Vercel example in the research matrix under "remote MCP with OAuth and logs".
- Confidence: high
- Notes:
  - Draft must include beta caveat and avoid depending on exact tool list without rechecking before publication.

### Deployment SOPs — AWS MCP Server Preview

- URL: https://docs.aws.amazon.com/aws-mcp/latest/userguide/agent-sops-deployment.html
- Type: official-docs
- Author/publisher: AWS
- Checked: 2026-05-04
- Supports:
  - AWS MCP Server Deployment SOPs can analyze applications, generate CDK infrastructure and deploy through CloudFormation.
  - SOPs can create CI/CD with CodePipeline.
  - Prerequisites include AWS MCP Server, Git CLI, AWS CLI, AWS CDK CLI and package manager.
  - AWS warns users to review generated infrastructure and notes agents may need extra prompts.
- Use in lesson:
  - Strong high-power/high-risk contrast: MCP can orchestrate a lot, therefore approval and review gates matter more.
- Confidence: high
- Notes:
  - The feature is preview and region-limited in the docs/news. Do not present as a universal default.

### AWS announces Deployment Agent SOPs in AWS MCP Server preview

- URL: https://aws.amazon.com/about-aws/whats-new/2025/01/aws-announces-deployment-agent-sops-in-aws-mcp-server-preview
- Type: official-docs
- Author/publisher: AWS
- Checked: 2026-05-04
- Supports:
  - AWS positions deployment SOPs as structured natural-language procedures for agents.
  - SOPs support deployment from MCP-compatible IDEs/CLIs and generate AWS CDK/CloudFormation/CI/CD resources.
- Use in lesson:
  - Optional additional source for "platforms are beginning to ship agent-facing deployment workflows."
- Confidence: high
- Notes:
  - Treat date/capability as current as of 2026-05-04; recheck before final draft.

### Deployments and environments — GitHub Docs — **deferred to m3**

- URL: https://docs.github.com/en/actions/reference/deployments-and-environments
- Type: official-docs
- Author/publisher: GitHub
- Checked: 2026-05-04
- Supports:
  - GitHub Actions environments can require reviewers, wait timers, branch/tag restrictions and custom protection rules.
  - Environment secrets are only available to jobs referencing that environment, and approval can gate secret access.
- Use in lesson:
  - **Not used in m1-l5.** Approval gates, environment protection rules and GHA pipeline secrets management are m3 territory. m1-l5 stops at platform-managed auto-deploy without custom workflows.
- Confidence: high
- Notes:
  - Kept in grounding as a forward reference. Move to m3 grounding when that lesson is drafted.

### gh run view manual — **deferred to m3**

- URL: https://cli.github.com/manual/gh_run_view
- Type: official-docs
- Author/publisher: GitHub CLI
- Checked: 2026-05-04
- Supports:
  - `gh run view` can inspect workflow run summaries, JSON fields and logs.
  - `--exit-status`, `--log`, and `--log-failed` support read-only CI diagnosis from terminal.
- Use in lesson:
  - **Not used in m1-l5.** m1-l5 covers only platform-managed auto-deploy (Cloudflare Pages ↔ GitHub integration). Custom GHA pipelines and `gh run view` read-only diagnostics belong to m3.
- Confidence: high
- Notes:
  - Kept in grounding as a forward reference. Move to m3 grounding when that lesson is drafted.

### GitHub MCP Server repository — **deferred to m3**

- URL: https://github.com/github/github-mcp-server
- Type: repo
- Author/publisher: GitHub
- Checked: 2026-05-04
- Supports:
  - GitHub MCP Server connects AI tools to repositories, issues, PRs and CI/CD workflow intelligence.
- Use in lesson:
  - **Not used in m1-l5.** Belongs to m3, where CI workflow intelligence and pipeline-level integrations are introduced.
- Confidence: medium
- Notes:
  - Kept in grounding as a forward reference. Move to m3 grounding when that lesson is drafted.

## Practitioner Signals

### Show HN: Mcp2cli — One CLI for every API

- URL: https://news.ycombinator.com/item?id=47305149
- Type: community-discussion
- Signal:
  - Practitioner concern: MCP tool schemas can consume large amounts of context; CLI-style discovery can feel cheaper and more explicit.
  - Useful as current language for "CLI vs MCP" anxiety.
- Useful language:
  - "discover tools on demand"
  - "schema/context overhead"
  - "just a CLI the model shells out to"
- Risk:
  - Numbers are project-authored and not independent evidence. Do not cite token savings as fact in the lesson.
- Confidence: medium

### HN discussion: "CLI. Always CLI. Never MCP" and replies

- URL: https://news.ycombinator.com/item?id=47392011
- Type: community-discussion
- Signal:
  - The community debate is polarized, but replies often converge on a more nuanced point: CLI is good for explicit commands; MCP is useful when agents need tool discovery; tool-loading strategy matters.
- Useful language:
  - "The real problem isn't MCP vs CLI"
  - "too many tool definitions"
  - "lazy loading"
- Risk:
  - HN comments are sentiment only. Use for framing objections, not factual claims.
- Confidence: low

### X Developer docs: skill.md and MCP Servers

- URL: https://docs.x.com/tools/skill-md
- Type: official-docs
- Signal:
  - X documents both `skill.md` and MCP servers as agent-facing resources: skills summarize capabilities/workflows; MCP servers expose callable API endpoints and docs search.
- Useful language:
  - "capability summary"
  - "actions, required inputs, and constraints"
  - "tool allow-listing"
- Risk:
  - X is not a deployment platform example, so use only as a secondary ecosystem signal for skill + MCP complementarity.
- Confidence: medium

### X post: Skills + MCP in Codex/Linear workflows

- URL: https://x.com/dkundel/status/2018436269907603590
- Type: practitioner-signal
- Signal:
  - Practitioner/vendor signal that skills can install/auth MCP as part of a workflow; useful support for "skill can orchestrate MCP setup."
- Useful language:
  - "Skills use MCP"
  - "auto install and auto auth MCP"
- Risk:
  - Single X post; do not use as primary evidence.
- Confidence: low

## Examples Worth Using

- **Cloudflare CLI-first path:** Astro static/SSR research checks whether the project fits Pages or Workers, then uses official docs and Wrangler for explicit preview/direct deploy decisions. Key lesson: CLI commands are concrete and inspectable; deployment method choices have future workflow tradeoffs.
- **Netlify dual path:** Netlify's official MCP docs explicitly say the MCP server uses API and CLI and recommends Netlify CLI. Key lesson: "MCP vs CLI" is often the wrong frame; a strong platform may expose both.
- **Vercel remote MCP path:** Vercel MCP is OAuth-backed and can manage deployments/logs, but beta. Key lesson: an MCP can improve agent access to platform state, but beta status belongs in the research matrix.
- **AWS high-caution path:** AWS Deployment SOPs can generate CDK, CloudFormation and CI/CD, and docs explicitly require prerequisites and review. Key lesson: more automation increases the need for IAM scope, cost awareness and human approval.
- ~~**GitHub approval/read-only path:** `gh run view --log-failed` and GitHub environment protections~~ — **moved to m3**. m1-l5 stops at platform-managed auto-deploy (Cloudflare Pages ↔ GitHub integration) without custom GHA pipelines or approval gates.
- **Artifact shape:** `deployment-research.md` should include stack fit, runtime fit, CLI fit, MCP fit, API/docs fit, preview story, secrets story, rollback story, approval story, risk notes and recommended path. `deploy-plan.md` should include build/test, preview, smoke checks, production gate, first remote/prod deployment path, post-deploy verification and rollback notes.

## Claims To Avoid Or Soften

- "MCP is better than CLI" — unsupported and misleading. Better: MCP and CLI are different interfaces; evaluate by task, risk, observability, permissions and context cost.
- "CLI always beats MCP" — community sentiment exists but official docs show platforms combining MCP, CLI and API. Better: CLI is often a strong default for explicit, auditable terminal operations; MCP is useful for discovery and cross-system access.
- "Has MCP = agent-friendly platform" — too shallow. Better: MCP is one signal; the matrix must include docs, auth, read-only modes, logs, preview, rollback, env vars and permission boundaries.
- "AWS SOPs deploy production in one prompt" — vendor framing exists, but lesson should stress review of generated infrastructure, prerequisites, region/preview status and cost/IAM risk.
- "Cloudflare Wrangler deployment status works the same for Pages and Workers" — not precise. Workers and Pages have related but different commands and workflows; draft must separate them.
- "X/HN proves what developers should do" — no. These are practitioner signals and language sources only.
- "Optimal deployment platform" as universal ranking — avoid. The result must depend on stack/runtime/team constraints.

## Resolved Editorial Decisions

- Skill name: `10x-infra-research`.
- Demo target: Cloudflare is the demo path for the course app, but the lesson must frame it as the natural result of app-specific platform research.
- Video scope: E2E from research to first remote/prod deployment, not only preview + plan.
- `deploy-plan.md` is part of m1-l5 and should be structured enough for m2-l1 to consume.

## Open Verification Questions

- Before publication, recheck beta/current status for Vercel MCP and AWS MCP/SOPs.
- Before video, verify exact CLI commands in a real demo repo; do not rely on docs snippets for screen recording.

## Schema Source Update

Updated `lessons-schema.json` for `m1-l5` only:

- Added `groundingSources` with 12 sources: Anthropic/Claude Skills+MCP, Anthropic MCP efficiency, Cloudflare Wrangler/Pages docs, Netlify MCP/CLI, Vercel MCP, AWS MCP/SOPs, GitHub environments/gh CLI, GitHub MCP repo.
- Added unsupported-facts caveats for CLI-vs-MCP overclaims, beta/current platform behavior, Cloudflare Pages vs Workers command differences, and community-source weakness.
- Resolved prior human-decision items: skill name, Cloudflare demo posture, E2E first deployment posture and `deploy-plan.md` as a lesson artifact.
