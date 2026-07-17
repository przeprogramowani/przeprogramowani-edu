# Cursor SDK & Cloud Agents — Privacy, Data-Handling & Pricing Research Note

> Compiled 2026-06-08. Editorial research note for course workbench.
>
> Scope: `@cursor/sdk` (TypeScript SDK) and Cursor Cloud Agents — the programmatic / headless coding-agent infrastructure. The SDK entered **public beta on 2026-04-29**, so terms, pricing, and rate limits are subject to change. Verify against primary sources before relying on any figure. Claims that could not be confirmed against a Cursor primary source are flagged **[unverified]**.
>
> Vendor: Anysphere (the company behind Cursor).

---

## Data sharing & training

- **Default position under Privacy Mode:** With Privacy Mode enabled, code is **never stored by model providers** and **never used for training** by Cursor or any third party. This is enforced through both technical controls and contractual Zero Data Retention (ZDR) agreements with providers. (Source: Privacy & Data Governance docs, Security page.)
- **The SDK and Cloud Agents inherit the same data-governance model as the rest of Cursor.** The privacy/data-use posture is account- and team-level, not a separate SDK regime. The one material difference is Cloud Agents code storage (see Retention).
- **Without Privacy Mode ("Share Data" mode):** Cursor's data-use page states it reserves the right to *"use and store codebase data, prompts, editor actions, code snippets"* for product/model improvement and training. Inference providers may temporarily access data to optimize performance, then delete it. (Source: cursor.com/data-use.)
- **"Privacy Mode (Legacy)":** an older mode that also guarantees zero data retention — no storage or training by any party. Cursor's data-use page distinguishes Privacy Mode, Privacy Mode (Legacy), and Share Data. (Source: cursor.com/data-use.)
- **User-provided API keys are an exception:** when you supply your own model-provider API key, ZDR protections do **not** apply — that traffic follows the respective provider's privacy policy, not Cursor's ZDR agreement. (Source: privacy help page.)
- **Account-age nuance:** accounts created before 2025-10-15 do not have data shared with model providers (legacy default). (Source: cursor.com/data-use.) **[unverified]** how this interacts with new SDK service accounts created after that date. (checked 2026-06-08: service accounts are Enterprise-only and consume from the team's pool "just like human users"; Privacy Mode is ON by default and admin-enforceable team-wide, so the team-level posture governs — but the docs do not separately address the account-age default for a service account created after the cutoff. Remains undocumented.)

## Privacy Mode

- **What it is:** A setting that, when enabled, guarantees code is never stored by model providers and never used for training. It is the practical mechanism that activates ZDR across Cursor's provider chain. Cursor frames the combination of technical controls + contractual ZDR as its **"Privacy Mode Guarantee."**
- **Availability:** Available to **all users regardless of plan tier** (Free and Pro included).
- **Defaults:**
  - **Teams / Enterprise:** Privacy Mode is **ON by default** for members of a team; admins can **enforce** it org-wide so individual members cannot opt out.
  - **Enterprise:** Privacy Mode is the default posture.
  - Toggle location: Settings → General (Cmd+Shift+J / Ctrl+Shift+J).
- **Encryption:** Data is encrypted in transit (TLS 1.2+) and at rest (AES-256). (Source: Privacy & Data Governance docs.)

## Subprocessors / upstream providers

Cursor maintains a published subprocessor list on its Trust Center (`trust.cursor.com/subprocessors`) and re-reviews each annually under a vendor risk-management program.

- **Frontier model providers:** OpenAI, Anthropic, Google (Vertex AI), xAI (Grok). Cursor states it holds **contractual ZDR agreements** with these providers (xAI/OpenAI ZDR specifically tied to Privacy Mode / Privacy Mode Legacy). (Source: Privacy & Data Governance docs; data-use page.)
- **Cursor's own / custom models (e.g. Composer):** hosted via inference partners:
  - **Fireworks** — servers in US, Europe, or Japan; ZDR for Privacy Mode / Legacy users.
  - **Baseten** — servers in US and Canada; ZDR for Privacy Mode / Legacy users.
  - **Together AI** — listed as an inference provider. (ZDR specifics **[unverified]** at this granularity.)
  - In Share Data mode, these inference providers "may temporarily access and store model inputs/outputs to improve inference performance, for the minimum duration required, then securely delete." (Source: data-use page / subprocessor search.)
- **Cloud infrastructure:** AWS (primary; US-located servers), plus GCP, Azure (US servers), and Cloudflare appear on the subprocessor list. AWS handles code data **in memory** during AI request processing and stores embeddings + obfuscated file paths for indexing. (Source: subprocessor list; security report secondary corroboration.)
- **No China infrastructure:** Cursor states it does not use or maintain infrastructure in China, and uses no China-headquartered subprocessors. (Source: Security page.)
- **How data flows to subprocessors:** API/SDK requests route through Cursor's backend for final prompt construction *regardless of whether you supply your own API key* — i.e., requests are not direct browser/SDK → provider. (Source: data-use page.)

## Retention & storage

- **Codebase indexing / embeddings:** Plaintext code is deleted after embeddings are computed; the vector DB stores only embeddings plus metadata (hashes, obfuscated file paths, line numbers) — never raw source. (Source: Privacy & Data Governance docs.)
- **Cloud Agents — the one feature that stores code:** Cloud Agents are the **only** Cursor feature that requires code to be stored, because the agent needs ongoing repo access over the run. Repositories are **encrypted and stored temporarily inside isolated VMs while the agent operates, then deleted on completion.** Cloud Agents are **optional** and can be disabled if org policy prohibits code storage. (Source: Privacy & Data Governance docs.)
- **Artifacts (Cloud Agents API):** Artifacts are workspace-scoped and stored in an S3 bucket (`cloud-agent-artifacts.s3.us-east-1.amazonaws.com`, i.e. **us-east-1**). Download is via a **temporary 15-minute presigned S3 URL**; artifact paths are relative to an `artifacts/` directory. (Source: Cloud Agents API endpoints docs.)
- **Streaming retention:** SSE streams carry an `X-Cursor-Stream-Retention-Seconds` header; after the window the stream may return `410 stream_expired`, and callers should fall back to the Get-A-Run terminal-state endpoint. (Source: Cloud Agents API endpoints docs.)
- **Agent lifecycle / ephemeral state:**
  - Environment variables are session-scoped and **deleted with the agent**.
  - Worker tokens are user-scoped and **expire after 1 hour** (no self-refresh).
  - Archived agents remain readable but accept no new runs; deletion is irreversible.
  - (Source: Cloud Agents API endpoints docs.)
- **File caching:** Temporary, encrypted with client-generated keys; not permanently retained or trained on when Privacy Mode is active. (Source: data-use page.)
- **CMEK:** Enterprise can supply Customer-Managed Encryption Keys to encrypt embeddings and Cloud Agent data, with control over rotation/access. (Source: Privacy & Data Governance docs.)
- **Cloud Agent repo deletion (confirmed 2026-06-08):** The Enterprise privacy & data-governance page states encrypted repository copies are **"Stored temporarily while the agent runs"** and **"Deleted after the agent completes."** So per-run code is not retained. (Source: cursor.com/docs/enterprise/privacy-and-data-governance.)
- **[unverified]:** Whether any **repository history or workspace metadata persists across multiple runs** (beyond the single-run deletion above) is **not disclosed** in the docs reviewed. (checked 2026-06-08: the privacy page confirms deletion on completion of each run but is silent on cross-run history persistence; Cloud Agents API is public beta and run-history persistence is undocumented.)

## Runtime privacy (cloud / self-hosted / local)

The SDK / Cloud Agents support three execution runtimes, with different privacy profiles:

1. **Local** — agent runs on the developer's own machine. Best for fast iteration; code/tool execution stays local. (Model inference still routes through Cursor's backend to providers.)
2. **Cloud VM** — each agent run gets a **dedicated, strongly sandboxed VM** with a fresh clone of the repo, durable across connection drops (close your laptop, agent keeps working; opens a PR / pushes a branch on finish). This is the runtime that triggers temporary encrypted code storage in the VM (see Retention). Artifacts land in S3 (us-east-1).
3. **Self-hosted workers** — for teams with strict network-security requirements; **agents and tool execution run inside the company's own network**, keeping code and execution in-network. (Source: SDK release notes; Privacy & Data Governance docs; MarkTechPost announcement.)

## Data residency

- **No self-serve EU data-residency option exists (confirmed 2026-06-08, primary).** Cursor's privacy policy states plainly: **"For users in the European Economic Area ('EEA'), when you access our Service, your personal data may be transferred to our United States servers [and] to other countries outside the EEA and the UK."** No region-selection mechanism for data processing is described anywhere in the privacy policy or security page. (Source: cursor.com/privacy.)
- **The two "Regions" docs are NOT about data residency.** Both `cursor.com/docs/account/regions` and `cursor.com/help/security-and-privacy/regions` cover **model availability by geography** (which provider models are reachable where), **not** customer-selectable data-processing residency. There is no EU data-residency product. (Checked 2026-06-08.)
- **Inference-server geography varies by model:** custom models via Fireworks may run in US / Europe / Japan; via Baseten in US / Canada. This is inference-node location, **not** a customer-selectable data-residency guarantee. (Source: subprocessor list.)
- **Self-hosted workers** are the practical lever for keeping code/tool execution within a chosen network/region. (Source: Privacy & Data Governance docs.)
- **[unverified]:** Whether **Enterprise contracts can negotiate** region-pinned / EU-only processing beyond the published defaults. (checked 2026-06-08: no public-facing statement confirms or denies a negotiated EU-only option; the privacy policy and Enterprise data-governance docs describe US processing with EU transfers under SCCs / EU-US Data Privacy Framework, and direct commercial questions to the sales/legal team. Confirmed: **no self-serve EU residency**; an individually negotiated arrangement is neither documented nor ruled out.)

## Pricing & billing model

- **No separate SDK fee.** The SDK is billed on **standard token-based consumption pricing** — the same usage model as Cursor itself. You pay for tokens your agents consume, **not** per-seat or per-run. (Source: SDK release / changelog.)
- **Composer model rates (Cursor's own model, listed as "Composer 2.5" on the pricing/models page):**
  - Input: **$0.50 / M tokens**
  - Output: **$2.50 / M tokens**
  - Cache read: **$0.20 / M tokens**; cache write listed as "-" (not applicable)
  - These figures are **confirmed verbatim** against the live models-and-pricing page (checked 2026-06-08). The live model name is **"Composer 2.5"**, not "Composer 2 Standard" (that label appeared only in secondary launch coverage). Both Auto and Composer 2.5 draw from the **Auto + Composer usage pool**, not the API pool. (Source: cursor.com/docs/models-and-pricing.)
- **Availability by plan (corrected/clarified, checked 2026-06-08):** The blanket claim "Free users do not have API access" is **too strong and partly inaccurate**. The Cursor API docs list the TypeScript and Python SDKs as available to **"All users"**, and the Cloud Agents API as **"Beta (All Plans)"** (Source: cursor.com/docs/api). However, the gating is on **features the SDK orchestrates**, not the SDK download itself:
  - **Cloud Agents** (the SDK's primary use) are listed as a paid-plan feature on the pricing page — they appear under the **Individual ($20/mo Pro) tier and up**, not under the **Hobby (Free)** tier. The Free/Hobby plan provides only "Agent, Chat, and Tab completions with the Auto model" and limited usage. (Source: cursor.com/pricing; cursor.com/help/account-and-billing/pricing.)
  - **Service-account API keys** (the intended headless/CI credential) are **Enterprise-only** (see below).
  - Note: the BYOK "bring your own model API key" feature is a separate concept and *is* usable on Free, but Agent/Edit features that depend on Cursor's custom models still require a paid subscription. (Source: cursor.com/help/models-and-usage/api-keys.)
  - Net: a Free user can technically install the SDK, but cannot meaningfully run paid Cloud Agents or use service accounts. The original "Free users have no API access" framing is **secondary and imprecise**; prefer the feature-gating description above.
- **Plan tiers (consumption-based, individual):** Pro $20/mo (**"$20 of API agent usage + generous Auto and Composer usage"**), Pro Plus $60/mo (**"$70 of API agent usage…"**), Ultra $200/mo (**"$400 of API agent usage…"**). The included pool is split: an **API agent-usage budget** plus a **separate Auto + Composer allowance**. Composer 2.5 / Auto draw from the Auto+Composer pool, not the API pool. (Source: cursor.com/help/models-and-usage/usage-limits, confirmed 2026-06-08.)
- **Overage handling (confirmed 2026-06-08):** When the included pool is exhausted, you either **enable usage-based pricing (pay-as-you-go)** at the same model API rates, or **upgrade to a higher plan**. This applies to SDK/headless spend the same as in-editor spend. (Source: cursor.com/help/models-and-usage/usage-limits.)
- **Business / Teams & Enterprise inclusion (clarified 2026-06-08):** Teams plans are **$40/user/mo** with centralized billing and team-wide privacy mode. On Teams, non-Auto agent requests carry a **Cursor Token Rate of $0.25 / M tokens on top of model API pricing** (applies to included, on-demand, and BYOK usage). **Enterprise** adds **pooled usage**, invoice/PO billing, SCIM, and audit logs. (Source: cursor.com/pricing; cursor.com/docs/api billing notes.) Exact per-org pooled-overage thresholds remain custom/contract-specific and are not published.
- **Mapping to plans (confirmed):** SDK/headless token spend draws against the **same included-usage / overage pool as in-editor usage** — there is no dedicated SDK meter beyond token consumption. Service-account usage is **billed identically to human-user usage** from the team's shared pool (see below).
- **API keys vs service accounts (confirmed 2026-06-08):**
  - **User API keys:** created in Dashboard → API Keys, tied to the org, visible to all admins, unaffected by the creator's account status.
  - **Service-account API keys:** **Enterprise-plan only.** Service accounts are non-human accounts for automating Cursor (API consumption, CLI auth, Cloud Agent invocation). Per Cursor docs, **"Service accounts consume usage from your team's usage pool, just like human users. All usage is tracked and visible in your team's analytics and billing"** — i.e. headless/CI usage is **billed identically** to interactive usage. (Source: cursor.com/docs/account/enterprise/service-accounts; cursor.com/docs/api.)

## Rate limits (operational, affects privacy/cost planning)

- **`/v1/repositories` is very strict:** **1 request per user / minute** and **30 requests per user / hour**; responses can take tens of seconds. Cursor recommends graceful handling when data isn't ready. v1 currently supports **one repository** in the `repos` array. (Source: Cloud Agents API endpoints docs.)
- **General:** rate limits enforced **per team**, reset every minute; exceeding returns **429**. Other API families have their own per-minute caps (e.g. Admin API ~20/min, Analytics ~100/min). 304/cached responses don't count against limits (15-min cache on some endpoints). (Source: Cursor APIs overview docs.)

## Compliance & certifications

- **SOC 2 Type II:** Anysphere is SOC 2 Type II attested; report available **on request** via the Trust Center (`trust.cursor.com`). (Source: Security page.)
- **DPA (clarified 2026-06-08):** A Data Processing Addendum is published (`cursor.com/terms/dpa`) with industry-standard commitments. The published DPA is **structured as an addendum to a "Master Services Agreement between Anysphere and Customer"** — it contains no click-to-accept or self-serve execution mechanism in the document text. The privacy policy reinforces this: commercial/processor use is **"governed by our customer agreements covering access to and use of those offerings."** This is **strong primary evidence the DPA is tied to a commercial (Enterprise/Teams) agreement rather than a self-serve click-through.** (Sources: cursor.com/terms/dpa; cursor.com/privacy.) Note: the exact step where a customer signs/countersigns the DPA is not spelled out in public docs, so the precise self-serve-vs-countersigned boundary for smaller Teams customers remains partly **[unverified]** (checked 2026-06-08: DPA references an MSA but does not state who may execute it self-serve).
- **GDPR:** Cursor positions itself as following GDPR-aligned processing via the DPA and subprocessor agreements; **note the lack of EU data residency** is the key GDPR caveat for EU developers (data processed in US AWS).
- **Penetration testing:** at-least-annual third-party pen testing. (Source: Security page.)
- **Enterprise extras:** audit logs, granular admin controls, CMEK. (Source: Privacy & Data Governance docs.)

---

## Open questions / unverified

- **RESOLVED (corrected)** — "Free users lack SDK/API access" was imprecise. Primary docs list the SDKs and Cloud Agents API as "All Plans / All users", but **Cloud Agents** (the SDK's main purpose) is a **paid-plan feature** (Individual/Pro and up, not Hobby/Free) and **service accounts are Enterprise-only**. So a Free user can install the SDK but cannot meaningfully run paid Cloud Agents or use service accounts. (Sources: cursor.com/docs/api; cursor.com/pricing; cursor.com/help/account-and-billing/pricing.)
- **RESOLVED** — Service-account / headless usage is **billed identically** to interactive usage: per Cursor docs, "Service accounts consume usage from your team's usage pool, just like human users." Overage = enable pay-as-you-go at model API rates or upgrade. (Sources: cursor.com/docs/account/enterprise/service-accounts; cursor.com/help/models-and-usage/usage-limits.)
- **RESOLVED (partial)** — Plan inclusion: Pro/Pro+/Ultra include an API-agent budget + separate Auto+Composer allowance; Teams ($40/user/mo) adds a **$0.25/M Cursor Token Rate** on non-Auto agent requests; **Enterprise adds pooled usage**. Exact per-org pooled-overage thresholds are custom/contract-specific and unpublished. (Sources: cursor.com/help/models-and-usage/usage-limits; cursor.com/pricing; cursor.com/docs/api.)
- **[unverified]** Long-term retention of Cloud Agent workspace/repo **history across multiple runs**. (checked 2026-06-08: per-run repo copies are confirmed "deleted after the agent completes" — cursor.com/docs/enterprise/privacy-and-data-governance — but cross-run history persistence is undocumented; Cloud Agents API is public beta.)
- **[unverified]** Whether **Enterprise can negotiate region-pinned (EU-only) processing**. (checked 2026-06-08: **confirmed no self-serve EU residency** — privacy policy states EEA data transfers to US servers, and the two "Regions" docs are about model availability, not data residency. A negotiated Enterprise EU-only arrangement is neither documented nor explicitly ruled out.)
- **[unverified] (mostly resolved)** Self-serve vs. enterprise-gated DPA. (checked 2026-06-08: the published DPA is an addendum to a "Master Services Agreement between Anysphere and Customer" with no click-to-accept text, and the privacy policy ties processor terms to "our customer agreements" — strong evidence the DPA is **commercial-agreement-gated**, not a pure self-serve click-through; the exact execution step for smaller Teams customers is still not spelled out.)
- **RESOLVED (corrected)** — Composer naming: the live models/pricing page shows **"Composer 2.5"** (NOT "Composer 2 Standard"; that label was only in secondary launch coverage). Rates **confirmed verbatim**: **$0.50/M in, $2.50/M out, $0.20/M cache read**, cache write "-". Draws from the Auto+Composer pool. (Source: cursor.com/docs/models-and-pricing, checked 2026-06-08.)
- Public-beta caveat (unchanged): pricing, rate limits, retention windows (e.g. 15-min presigned URL, 1-hour worker tokens, stream retention), and runtime options may shift before GA.

---

## Sources

Primary (Cursor official):

- Cursor SDK release / changelog — https://cursor.com/changelog/sdk-release
- Privacy and Data Governance (Enterprise docs) — https://cursor.com/docs/enterprise/privacy-and-data-governance
- Security — https://cursor.com/security
- Data Use & Privacy Overview — https://cursor.com/data-use
- Privacy and data (help) — https://cursor.com/help/security-and-privacy/privacy
- Security and compliance documents — https://cursor.com/help/security-and-privacy/compliance
- Models & Pricing — https://cursor.com/docs/models-and-pricing
- Pricing (plans/feature comparison) — https://cursor.com/pricing
- Pricing and plans (help) — https://cursor.com/help/account-and-billing/pricing
- Usage and limits (help) — https://cursor.com/help/models-and-usage/usage-limits
- Service Accounts (Enterprise) — https://cursor.com/docs/account/enterprise/service-accounts
- Regions (account) — https://cursor.com/docs/account/regions
- Regions and model availability (help) — https://cursor.com/help/security-and-privacy/regions
- Bring your own API key (help) — https://cursor.com/help/models-and-usage/api-keys
- Cursor APIs Overview — https://cursor.com/docs/api
- Cloud Agents API (endpoints) — https://cursor.com/docs/cloud-agent/api/endpoints
- Cloud Agents (product) — https://cursor.com/cloud
- Data Processing Addendum — https://cursor.com/terms/dpa
- Privacy Policy — https://cursor.com/privacy
- Trust Center subprocessors — https://trust.cursor.com/subprocessors

Secondary (corroboration / context — treat as secondary):

- MarkTechPost (SDK launch, 2026-04-29) — https://www.marktechpost.com/2026/04/29/cursor-introduces-a-typescript-sdk-for-building-programmatic-coding-agents-with-sandboxed-cloud-vms-subagents-hooks-and-token-based-pricing/
- DevOps.com (SDK as deployable infrastructure) — https://devops.com/cursors-new-sdk-turns-ai-coding-agents-into-deployable-infrastructure/
- Cursor SDK & Cloud Agents API updates (community forum announcement) — https://forum.cursor.com/t/cursor-sdk-cloud-agents-api-updates/159284
- Simon Willison on Cursor security — https://simonwillison.net/2025/May/11/cursor-security/
- Lurus Code — Is Cursor GDPR compliant? — https://code.lurus.ai/en/blog/is-cursor-gdpr-compliant/
