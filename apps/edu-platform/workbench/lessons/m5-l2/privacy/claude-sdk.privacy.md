# Claude Agent SDK — Privacy, Data-Handling & Pricing Research Note

> Compiled 2026-06-08. Editorial research note for course workbench. Primary sources prioritized (platform.claude.com, privacy.claude.com, anthropic.com/legal, code.claude.com). Claims that could not be verified against a primary source are flagged **[unverified]**.

**Scope note.** The "Claude Agent SDK" (formerly Claude Code SDK) is a programmatic harness that runs against either (a) the Claude API (first-party, `api.anthropic.com`), (b) a partner cloud (Amazon Bedrock / Google Vertex AI / Microsoft Foundry), or (c) Claude subscription credentials (Pro/Max) via `claude -p` and similar. The privacy and data terms below are therefore driven by **which backend the SDK is pointed at**, not by the SDK package itself. Anthropic does not publish a separate "Agent SDK privacy policy"; the applicable terms are the API/commercial terms, the consumer terms, or the relevant cloud provider's terms.

---

## Data sharing & training

- **Commercial / API default: no training.** Anthropic's commercial data-usage policy states: *"By default, we will not use your inputs or outputs from our commercial products to train our models."* This covers the Anthropic API, Claude for Work, and other commercial products — i.e., the typical Agent SDK path when using a commercial API key.
- **Commercial Terms are explicit.** The Commercial Terms of Service state that *"Anthropic may not train models on Customer Content from Services."* Customer Content (inputs and outputs) is also designated as the Customer's Confidential Information.
- **Exception — feedback / opt-in.** Data *may* be used for training if you explicitly opt in, e.g. by submitting thumbs-up/down feedback or otherwise consenting. Feedback data is retained for up to 5 years and is de-linked from user/customer IDs before being used for model improvement.
- **Retained operational data is still not training data.** Per the API & data-retention doc: *"Retained data is never used for model training without your express permission."*
- **Consumer (claude.ai) is different — now an explicit user choice (corrected).** The consumer products (Claude Free, Pro, Max) are governed by a separate Consumer Terms / Privacy Policy. Per Anthropic's consumer-terms update announcement (https://www.anthropic.com/news/updates-to-our-consumer-terms), Anthropic *"now give[s] users the choice to allow their data to be used to improve Claude"* via a **"model training setting"** at `claude.ai/settings/data-privacy-controls`; users had until **October 8, 2025** to accept the updated Consumer Terms and make a selection. Earlier (pre-update) reporting described an opt-out / "on by default unless you opted out" posture; the current live posture is an explicit choice the user must make. Retention follows the choice: **up to 5 years** in de-identified form if you allow training, **30 days** if you decline (confirmed at https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data and the code.claude.com data-usage doc).
- **Subscription-auth Agent SDK / Claude Code = consumer data terms (resolved).** Anthropic's Claude Code data-usage doc (https://code.claude.com/docs/en/data-usage) and the consumer-terms announcement state plainly that consumer terms apply to Free/Pro/Max accounts *"including when you use Claude Code from these accounts,"* while commercial/API use is excluded. So traffic authenticated with a Pro/Max subscription is governed by **consumer** data terms (training follows the user's model-training setting; 5y/30d retention). Important nuance: per the consumer-terms update, **OAuth/subscription credentials are not a sanctioned auth path for the Agent SDK itself** — Anthropic directs Agent SDK builders to use an **API key** from the Console (commercial terms, no-training default, ZDR-eligible). `claude -p` interactive-adjacent use under a subscription still falls under consumer terms.

## Retention

- **API default retention: 30 days.** Per Anthropic's commercial retention article: *"For Anthropic API users, we automatically delete inputs and outputs on our backend within 30 days of receipt or generation,"* subject to exceptions (services with longer user-controlled retention like the Files API, custom agreements, Usage Policy enforcement, legal compliance).
  - Note: some secondary sources claimed a reduction to **7 days as of 2025-09-14**. This is **not supported by the primary source** (re-checked 2026-06-08): the primary Anthropic article still states *"we automatically delete inputs and outputs on our backend within 30 days of receipt or generation."* **30 days is the documented default; the 7-day claim is incorrect/secondary-only.** (Source: https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)
- **Zero Data Retention (ZDR).** Available to qualifying organizations by arrangement (contact sales). With ZDR, *"Customer data is not stored at rest after the API response is returned, except where needed to comply with law or combat misuse."*
  - ZDR **covers**: Claude Messages API and Token Counting API; Claude Code when used with Commercial organization API keys or through Claude Enterprise with ZDR enabled.
  - ZDR **does NOT cover**: Console/Workbench usage, Claude Managed Agents (stateful), consumer products (Free/Pro/Max), Claude Teams and Claude Enterprise product interfaces (except Claude Code path above), third-party integrations.
  - A long feature-eligibility table governs the Agent SDK surface. ZDR-eligible: Messages API, token counting, web search, web fetch, memory tool, bash/text-editor tools, prompt caching, structured outputs (qualified), data residency, extended/adaptive thinking, fast mode, 1M context. **NOT ZDR-eligible**: Batch API (29-day retention), code execution (containers up to 30 days), Files API (until deleted), Agent Skills, MCP connector, Claude Managed Agents, MCP tunnels.
  - **CORS is not supported under ZDR** — browser-direct calls require a backend proxy.
- **Policy-violation override.** Even under ZDR/HIPAA, flagged content may be retained up to **2 years**, and **trust-and-safety classification scores up to 7 years** — both figures now confirmed against the primary retention article (https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data, checked 2026-06-08). Inputs/outputs flagged for Usage Policy violations are kept up to 2 years; the associated classification scores up to 7 years.
- **Feedback data:** up to 5 years (de-linked).
- **Activity Feed / Compliance API:** Activity Feed retains 6 years; Compliance API has its own model.

## Data residency / cloud routing

- **First-party API geo controls.** Two independent settings:
  - `inference_geo` (per-request): `"global"` (default) or `"us"` (US-only infrastructure). Supported on Opus 4.6 / Sonnet 4.6 and later; older models return a 400 if the parameter is sent. US-only carries a **1.1x pricing multiplier** across all token categories.
  - **Workspace geo** (at-rest storage + endpoint processing like transcoding/code execution): currently `"us"` only, set at workspace creation, immutable afterward.
  - Workspace-level `allowed_inference_geos` / `default_inference_geo` enforce geo policy across keys. Legacy "US-only" opt-outs were auto-migrated to `allowed_inference_geos: ["us"]`.
- **Bedrock & Vertex AI.** On these partner platforms the **cloud provider is the data processor**, not Anthropic. Anthropic's ZDR/HIPAA arrangements and first-party retention do **not** apply; you rely on the cloud provider's data-handling and regional infrastructure. Both offer global / regional (and Vertex multi-region) endpoints; regional/multi-region endpoints carry a ~10% premium over global. `inference_geo` is **not** applicable on Bedrock/Vertex/Foundry — region is set via endpoint URL / inference profile.
- **Microsoft Foundry (confirmed from primary docs).** Claude on Microsoft Foundry runs on **Anthropic-hosted infrastructure, not Azure-native**. Microsoft's own Foundry data-privacy page states that for Claude in Foundry *"Anthropic (not Microsoft) is the processor of the data,"* the model is one that *"Anthropic service hosts and manages,"* and *"prompts and outputs may be processed outside of your region, for operational purposes"* (https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/claude-models/data-privacy). Anthropic's own Claude Code provider table corroborates this: for Foundry, *"Requests route to Anthropic infrastructure with AES-256 disk encryption"* (https://code.claude.com/docs/en/data-usage). Consequently EU data-residency / "no data sent to Anthropic" guarantees do **not** apply on the Foundry path today; EU-native support is reported as targeted for 2026 (that timeline remains secondary-sourced). Microsoft is the data processor only for the *deployment infrastructure and endpoint*, under the Microsoft DPA.
- **HIPAA + partner clouds.** HIPAA readiness applies to the first-party Claude API only; it is **not** available on Bedrock, Vertex AI, Claude Platform on AWS, or Microsoft Foundry (defer to those platforms' own compliance docs).

## Inputs/outputs ownership

- Per the Commercial Terms of Service (Section B – Customer Content): *"Anthropic agrees that Customer (a) retains all rights to its Inputs, and (b) owns its Outputs … Anthropic hereby assigns to Customer its right, title and interest (if any) in and to Outputs."* (https://www.anthropic.com/legal/commercial-terms)
- **Copyright defense (verbatim, confirmed).** Commercial Terms Section K.1 (*Claims Against Customer*): *"Anthropic will defend Customer and its personnel, successors, and assigns from and against any Customer Claim … and indemnify them for any judgment that a court of competent jurisdiction grants a third party on such Customer Claim or that an arbitrator awards a third party under any Anthropic-approved settlement of such Customer Claim."* A *Customer Claim* is defined as a *"third-party claim, suit, or proceeding alleging that Customer's paid use of the Services … in accordance with these Terms or Outputs generated through such authorized use violates any third-party intellectual property right."* (Confirmed from live Commercial Terms, https://www.anthropic.com/legal/commercial-terms, checked 2026-06-08.)
- **Confidentiality.** Commercial Terms include mutual confidentiality obligations; Customer Content is the Customer's Confidential Information, protected to at least the standard each party uses for its own confidential information.
- Consumer terms ownership wording was not separately verified here. **[unverified for consumer tier.]**

## Pricing

### How Agent SDK usage is billed

The Agent SDK has **no separate license fee** — you pay for the underlying model usage. Two billing modes:

1. **Pay-as-you-go API (token-based).** Standard per-model token pricing (below). This is the recommended path for shared/production automation.
2. **Subscription credentials (Pro/Max via `claude -p`).** Historically subsidized under flat-rate subscription limits — **this changes June 15, 2026** (below).

### June 15, 2026 billing change — Agent SDK credit pool

Confirmed against the **primary Anthropic Help Center article** *"Use the Claude Agent SDK with your Claude plan"* (https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan, checked 2026-06-08). The policy was formalized in the Help Center ~mid-May 2026. All mechanics below are now verified against this primary page.

- Starting **2026-06-15**, per the primary doc: *"Claude Agent SDK and `claude -p` usage no longer counts toward your Claude plan's usage limits."* The credit covers Agent SDK usage in your own Python/TypeScript projects, `claude -p` (non-interactive Claude Code), the **Claude Code GitHub Actions** integration, and **third-party apps that authenticate with your Claude subscription**. Programmatic usage instead draws from a **separate monthly credit, billed at standard API rates**.
- Credit amounts (confirmed verbatim): **$20 (Pro), $100 (Max 5x), $200 (Max 20x)**; also **Team Standard $20/seat, Team Premium $100/seat, Enterprise seat-based Premium $200**.
- **Interactive usage is unaffected**: *"Using Claude Code in the terminal or your IDE continues to use your subscription usage limits exactly as before"* (web/desktop/mobile chat, interactive Claude Code, Claude Cowork unchanged).
- **Unused credits do not roll over**: *"Unused credits don't roll over to the next billing cycle."* When the monthly credit is exhausted, *"additional Agent SDK usage flows to usage credits at standard API rates—but only if you've enabled usage credits"* (otherwise automation stops until the credit refreshes).
- **No team pooling** (confirmed verbatim): *"Credits belong to individual accounts. They can't be shared or pooled across teammates."* Teams running shared production automation should use **pay-as-you-go Claude Platform API billing** rather than subscription credentials.

### Current first-party API token prices (confirmed from platform.claude.com, 2026-06-08, USD per million tokens)

| Model | Input | 5m cache write | 1h cache write | Cache hit/read | Output |
|---|---|---|---|---|---|
| Claude Opus 4.8 / 4.7 / 4.6 / 4.5 | $5 | $6.25 | $10 | $0.50 | $25 |
| Claude Sonnet 4.6 / 4.5 | $3 | $3.75 | $6 | $0.30 | $15 |
| Claude Haiku 4.5 | $1 | $1.25 | $2 | $0.10 | $5 |
| Claude Opus 4.1 / 4 (deprecated) | $15 | $18.75 | $30 | $1.50 | $75 |
| Claude Haiku 3.5 (retired exc. Bedrock/Vertex) | $0.80 | $1 | $1.60 | $0.08 | $4 |

Other pricing modifiers:
- **Prompt caching multipliers:** 5-min write 1.25x base input, 1-hr write 2x base input, cache read 0.1x base input.
- **Batch API:** 50% discount on input and output (e.g. Opus 4.8 batch = $2.50 in / $12.50 out).
- **Data residency:** `inference_geo: "us"` = 1.1x all token categories (Opus 4.6 / Sonnet 4.6 and later).
- **Fast mode (research preview):** premium — e.g. Opus 4.8 $10 in / $50 out; Opus 4.6/4.7 $30 in / $150 out.
- **Server-side tools:** web search $10 / 1,000 searches; web fetch no extra cost; code execution 1,550 free container-hours/org/month then $0.05/container-hour (free when paired with web search/fetch).
- **Claude Managed Agents:** tokens at standard rates **plus** session runtime $0.08 per session-hour (running status only).
- **Claude Platform on AWS:** billed via AWS Marketplace in Claude Consumption Units (CCU), 100 CCU = $1.00 of standard-rate usage.
- **1M-token context:** included at standard pricing on Opus 4.8/4.7/4.6 and Sonnet 4.6.

### Per-seat / subscription nuances

- Pro/Max are per-user subscriptions; the new Agent SDK credit is per-user and non-transferable/non-poolable.
- Enterprise/volume pricing and custom rate limits are available via sales.

## Compliance & certifications

Confirmed from Anthropic's Privacy Center certifications article (checked 2026-06-08). Anthropic states it maintains:

- **SOC 2 Type I & Type II**
- **ISO 27001:2022** (Information Security Management)
- **ISO/IEC 42001:2023** (AI Management Systems)
- **HIPAA-ready configuration** (Business Associate Agreement / BAA available; first-party Claude API only, signed BAA + dedicated HIPAA-enabled org required; not available on Bedrock/Vertex/Claude Platform on AWS/Foundry, and **Claude Code is not covered under HIPAA readiness**)

Additional:
- **GDPR / international transfers:** Anthropic uses EU-Commission-approved Standard Contractual Clauses (SCCs) for transfers; a **Data Processing Addendum (DPA)** is referenced at anthropic.com/legal/data-processing-addendum. The certifications article itself does not list GDPR/DPA as "certifications" (they aren't certifications). **[GDPR/DPA availability corroborated by Anthropic legal pages + secondary sources; exact current DPA terms not fetched verbatim in this pass.]**
- **Trust Center** (trust.anthropic.com) hosts compliance artifacts behind an access-request flow (the public landing page did not expose the document list to automated fetch).

## Reseller / branding caveats (data-relevant)

- **No resale of raw API access / no competing models (verbatim, confirmed).** Commercial Terms Section D.4 (*Use Restrictions*): *"Customer may not and must not attempt to (a) access the Services to build a competing product or service, including to train competing AI models or resell the Services except as expressly approved by Anthropic."* (https://www.anthropic.com/legal/commercial-terms, checked 2026-06-08.) Pure "pass-through" wrappers (your product is just a conduit to the Anthropic API) are the targeted risk pattern; Claude as a feature inside an independent product is low-risk.
- **No funneling subscription auth to outside end-users.** Anthropic has moved to meter/limit third-party tools using Claude Pro/Max subscription credentials for programmatic/agent traffic (the OpenClaw-style pattern of routing requests through Max subscriptions to dodge API costs). The June 15 credit-pool change (primary: https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan) reinforces this: subscription-auth programmatic usage is metered against a fixed monthly credit and steered to pay-as-you-go API billing on overflow. Separately, Anthropic's consumer-terms update directs Agent SDK builders to use a Console **API key**, not subscription OAuth. (Mechanics confirmed primary; the prior temporary full block of third-party subscription auth is secondary-sourced.)
- Implication for course/editorial framing: an Agent SDK product that authenticates end-users via their own claude.ai login, or that resells your subscription credits to third parties, is **not** a sanctioned pattern. Sanctioned multi-user/production path = your own commercial API keys (pay-as-you-go), where commercial no-training defaults, ZDR, and DPA/BAA options apply.

## Open questions / unverified

Most items from the prior pass are now resolved against primary sources (see inline citations). Remaining genuinely-open or secondary-only items:

- **Foundry EU-native timeline ("Coming 2026").** That Claude on Foundry runs on Anthropic-hosted infra today is confirmed primary (Microsoft Learn + code.claude.com). The *specific* EU-native availability date remains secondary-sourced ("Coming 2026" with no firm date). **[partially unverified — timeline only]**
- **Prior temporary full block of third-party subscription auth (OpenClaw).** The current metered credit-pool model is confirmed primary; the earlier short-lived hard block / reinstatement narrative is secondary-sourced (VentureBeat etc.). **[secondary only — historical detail]**
- **Exact current DPA terms (verbatim).** GDPR/SCCs/DPA availability is confirmed via Anthropic legal pages; the live DPA was not quoted verbatim. **[low priority]**

Resolved this pass (moved out of open): consumer training default (now an explicit user choice / "model training setting", corrected from "opt-out"); subscription-auth data tier (consumer terms apply to Pro/Max Claude Code; Agent SDK builders directed to API keys); API retention (30 days confirmed, 7-day claim refuted); June 15 billing change (primary Help Center URL fetched and quoted); Foundry residency (primary-confirmed); copyright indemnity + reseller clause (verbatim from Commercial Terms); 2-year + 7-year retention figures (both primary-confirmed).

## Sources

Primary (Anthropic):
- Pricing — https://platform.claude.com/docs/en/about-claude/pricing
- Data residency — https://platform.claude.com/docs/en/build-with-claude/data-residency  (also /docs/en/manage-claude/data-residency)
- API and data retention (ZDR / HIPAA / feature eligibility) — https://platform.claude.com/docs/en/build-with-claude/api-and-data-retention
- Claude Code Zero Data Retention — https://code.claude.com/docs/en/zero-data-retention
- Claude Code data usage (consumer vs commercial terms, Foundry routing) — https://code.claude.com/docs/en/data-usage
- "Use the Claude Agent SDK with your Claude plan" (June 15 2026 credit pool — PRIMARY Help Center) — https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan
- Microsoft Learn — Data/privacy/security for Anthropic Claude models in Microsoft Foundry (Anthropic = processor, Anthropic-hosted) — https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/claude-models/data-privacy
- "Is my data used for model training?" — https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training
- "How long do you store my organization's data?" — https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data
- "How long do you store my data?" (consumer) — https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data
- "What certifications has Anthropic obtained?" — https://privacy.claude.com/en/articles/10015870-what-certifications-has-anthropic-obtained
- Commercial customers privacy collection — https://privacy.claude.com/en/collections/10663361-commercial-customers
- Commercial Terms of Service — https://www.anthropic.com/legal/commercial-terms
- Consumer terms update announcement — https://www.anthropic.com/news/updates-to-our-consumer-terms
- Expanded legal protections (API ownership/IP) — https://www.anthropic.com/news/expanded-legal-protections-api-improvements
- Data Processing Addendum — https://www.anthropic.com/legal/data-processing-addendum
- Privacy Policy — https://www.anthropic.com/legal/privacy
- Trust Center — https://trust.anthropic.com/  and  https://trust.anthropic.com/resources

Secondary (corroborating, treat as weaker evidence):
- The New Stack — Agent SDK credit pools — https://thenewstack.io/anthropic-agent-sdk-credits/
- TechTimes — June 15 credit pool — https://www.techtimes.com/articles/317625/20260602/anthropic-ends-subscription-subsidy-agents-june-15-credit-pool-replaces-flat-rate-access.htm
- Zed blog — subscription changes — https://zed.dev/blog/anthropic-subscription-changes
- DEV — $200 Agent SDK credit / claude -p in production — https://dev.to/vainamoinen/what-anthropics-200-agent-sdk-credit-means-if-you-run-claude-p-in-production-ce2
- Gerloff — Claude AWS vs Azure vs GCP GDPR residency — https://www.gerloff.dev/writing/claude-aws-azure-google-gdpr
- claude-code GitHub issue (Foundry EU residency) — https://github.com/anthropics/claude-code/issues/40530
- SitePoint — API terms / wrapper era — https://www.sitepoint.com/end-wrapper-era-anthropic-api-terms-saas/
- MLQ — Anthropic blocks subscription auth in third-party tools — https://mlq.ai/news/anthropic-ends-paid-access-for-claude-in-third-party-tools-like-openclaw/
