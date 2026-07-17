# Vercel AI SDK 6 (`ai`) — Privacy, Data-Handling & Pricing Research Note

> Compiled 2026-06-08. Subject: the **Vercel AI SDK** (the open-source `ai` npm package) used as a programmable agent SDK. Sourced from primary Vercel / ai-sdk.dev docs and the package's own LICENSE where possible; secondary or uncertain items flagged **[unverified]**.

## The "not in the data path" model (read this first)

The Vercel AI SDK is an **open-source client library that runs in YOUR process** (your server, your function, your machine). By itself it does **not** send your data to Vercel. When you wire it to a provider package with your own API key (`@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, …), requests go **directly to that provider's API endpoint** — e.g. the OpenAI provider's default base URL is `https://api.openai.com/v1`. Vercel ships the framework code; it is **not** in the request path. (AI SDK provider docs)

So the SDK's privacy posture is **mostly inherited from the model provider you choose** — a thinner version of OpenRouter's two-layer model. There are effectively two distinct paths, and you must reason about them separately:

- **(a) Direct-to-provider path (default when you import a specific provider).** Data flows SDK → provider. Privacy/training/retention is governed entirely by **that provider's** terms. Vercel is not a data processor here.
- **(b) Via Vercel AI Gateway path (opt-in).** Data flows SDK → **Vercel's gateway** → provider. Vercel **is** in the data path and applies its own data/retention/pricing terms on top of the provider's.

The single most important nuance: **the bare SDK is not in your data path unless you use the AI Gateway.** The AI Gateway provider docs state the rule explicitly: *"The AI SDK automatically uses the AI Gateway when you pass a model string in the `creator/model-name` format."* So a plain string like `'anthropic/claude-opus-4.7'` (or `'openai/gpt-5.4'`) routes through the Gateway by default; importing a provider package and calling it with your own key (e.g. `anthropic('claude-…')`) routes direct. The `gateway(...)` instance is the explicit form of the same Gateway routing. (AI SDK — AI Gateway provider: https://ai-sdk.dev/providers/ai-sdk-providers/ai-gateway)

---

## 1. The SDK itself (license, cost, telemetry)

### License & cost
- **License: Apache-2.0.** The repo LICENSE reads "Copyright 2023 Vercel, Inc. Licensed under the Apache License, Version 2.0." The `ai` package's `package.json` `license` field is `"Apache-2.0"`. (Note: **not** MIT — a reasonable assumption, but the package is Apache-2.0.)
- **Free and open-source.** Vercel describes it as "a free open-source library for building AI-powered applications and agents." There is **no license fee for the SDK**; you pay only the underlying model provider (and, if used, the AI Gateway — see below).
- **Version.** Current published stable line is **AI SDK 6** (`ai@6.0.x`). As of 2026-06-08, the npm registry `latest` dist-tag is **`6.0.197`** (license `Apache-2.0`), confirmed via `https://registry.npmjs.org/-/package/ai/dist-tags`. v7 is in pre-release only: the `beta` tag is `7.0.0-beta.116` and `canary` is `7.0.0-canary.165` (the `main` branch package.json reads `7.0.0-canary.165`). So **6.0.x is the current stable; 7.0 is still beta/canary, not released.** *(The specific stable patch shifts frequently; treat the patch number as a 2026-06-08 snapshot.)*

### Telemetry — does the library phone home?
- **No telemetry to Vercel by default.** The SDK does not collect telemetry or "phone home" to Vercel out of the box. Its telemetry support is **experimental and opt-in**: "AI SDK Telemetry is experimental and may change in the future."
- **Opt-in via `experimental_telemetry`.** You must explicitly set `experimental_telemetry: { isEnabled: true }` on individual calls. There is no automatic collection.
- **It's OpenTelemetry — you own the destination.** Telemetry is emitted via OpenTelemetry. The data goes to **whatever `TracerProvider` you configure** (or the `@opentelemetry/api` singleton). The AI SDK telemetry docs describe no automatic export to Vercel — even inside a Vercel deployment the exporter destination is always developer-configured; **Vercel does not receive this data** unless you deliberately point your exporter at a Vercel/observability backend. Third-party collectors (Langfuse, Arize OpenInference, etc.) exist precisely because the destination is developer-chosen. (AI SDK Core — Telemetry: https://ai-sdk.dev/docs/ai-sdk-core/telemetry)
- **Input/output recording defaults.** When telemetry IS enabled, both input and output recording are **on by default** (`recordInputs` / `recordOutputs` default to `true`); you can set them to `false` "for privacy, data transfer, and performance reasons." This only matters once you've opted into telemetry and pointed it somewhere.

> Net: the bare `ai` library is Apache-2.0, free, and silent — no default telemetry, no default Vercel callbacks. Any data leaving your process does so because (a) you call a model provider, (b) you enabled OpenTelemetry and configured an exporter, or (c) you opted into the AI Gateway.

---

## 2. Direct-to-provider path (data governed by the provider)

When you use the SDK with a provider package and your own key, **Vercel is not in the data path** and is **not** a data processor for those requests. Privacy, training, and retention are 100% the chosen provider's terms. Cross-reference the relevant provider note:

- **OpenAI** (`@ai-sdk/openai`, default base `https://api.openai.com/v1`): API data **not used for training by default**; default API retention up to 30 days; ZDR available to approved customers. (See OpenAI/Codex note.)
- **Anthropic** (`@ai-sdk/anthropic`): commercial/API usage **not trained on by default** under Anthropic's commercial terms; retention per Anthropic's policy; ZDR available. (See Claude note.)
- **Google, xAI, Mistral, etc.**: each governed by its own terms.

Practical implications of the direct path:
- The provider's API key lives in **your** environment; auth is provider-to-you, not via Vercel.
- The provider's DPA, SOC 2, residency, and training-default all apply — **not** Vercel's.
- There is **no Vercel-side logging, retention, or metadata** on this path, because the request never touches Vercel infrastructure. (Logical consequence of the SDK being an in-process client; **[no Vercel doc is needed to assert a negative — confirm only that you have not also enabled the Gateway.]**)

> If you need a no-train / ZDR guarantee on the direct path, you get it from the **provider's** controls, exactly as you would calling that provider's own SDK.

---

## 3. Vercel AI Gateway path (logging / training / retention / pricing)

The **AI Gateway** is the opt-in exception where Vercel **is** in your data path.

### What it is
- "A unified API to access hundreds of models through a single endpoint" with budgets, usage monitoring, load-balancing, automatic fallbacks, and embeddings. Endpoint base: `https://ai-gateway.vercel.sh/v1`. Works with AI SDK v5/v6 and via OpenAI-/Anthropic-compatible APIs.
- Operationally it's a **routing proxy**: your request hits Vercel, Vercel selects/forwards to a provider (its system credentials or your BYOK key), and returns the result with routing metadata.

### Vercel's own data handling (gateway layer)
- **No training on your data — ever, by Vercel.** "AI Gateway does not use your prompts or responses for training purposes. Your data is processed solely to fulfill your requests and is not retained for model improvement."
- **Gateway content retention: Vercel does not retain prompt/response content at its own gateway layer — baseline, no opt-in required.** The ZDR capability page (https://vercel.com/docs/ai-gateway/capabilities/zdr, last updated 2026-05-18) has a dedicated **"Vercel"** section, structurally separate from the **"Providers"** and per-request `zeroDataRetention` sections, that states unconditionally: *"AI Gateway has a ZDR policy and does not retain prompts, outputs, or sensitive data. User data is immediately and permanently deleted after requests are completed. No action is needed on the user side."* Read alongside the Observability page (which logs only token COUNTS, cost, latency, and model — not message bodies), this resolves the earlier caveat: the "immediately and permanently deleted" guarantee describes **Vercel's own** handling of content for **all** Gateway requests, and needs no flag. The per-request / team-wide `zeroDataRetention` feature is a separate control that governs the **downstream provider's** retention — not Vercel's gateway layer. So: Vercel-the-proxy does not persist content by default; whether the *provider* retains it depends on the ZDR/disallow-training filters below.
- **Metadata IS logged (Observability) — but not message content.** Confirmed against the Observability page (https://vercel.com/docs/ai-gateway/capabilities/observability, last updated 2026-02-26). The Gateway "logs spend, model usage, and observability metrics" — requests-by-model, time-to-first-token, **input/output token COUNTS**, spend, plus per-project / per-API-key summaries (request count, average tokens, P75 duration, P75 TTFT, cost). The dashboard exposes a "detailed log of all requests" whose documented contents are *"all token types and the cost for each request"* — i.e. **usage metadata, not prompt/completion bodies**. The docs enumerate no message-content field anywhere on the page. Extended timeframes/retention require the paid **Observability Plus** add-on.

### Training & retention controls (downstream provider, via the Gateway)
Two opt-in routing filters control what the **downstream provider** is allowed to do. Both are AND-combinable and apply to fallbacks. Neither is on by default:

1. **`disallowPromptTraining: true`** — routes only to providers that don't train on your data. **Free, all users.** If Vercel doesn't know a provider's stance, it **assumes they train** and excludes them when this is set. By default (filter off) "AI Gateway does not route based on the training data policy of providers."
2. **`zeroDataRetention: true`** (ZDR) — superset of disallow-training; routes only to providers Vercel has a ZDR agreement with (Anthropic, OpenAI, Google Vertex, Bedrock, Azure, Groq, Mistral, Together, etc.). **Pro/Enterprise only.** Per-request flag = **no extra cost**; **team-wide** enforcement = **$0.10 / 1,000 requests**.

- **Default (no filter) routing does NOT consider provider retention/training policy** — confirmed verbatim on the ZDR page: *"By default, AI Gateway does not route based on the data retention policy of providers."* So on the Gateway, *downstream* training/retention is whatever the routed provider's own default is **unless you set `disallowPromptTraining` or `zeroDataRetention`**. This is the key gotcha: Vercel not retaining content at its gateway layer ≠ the routed provider not retaining it. (https://vercel.com/docs/ai-gateway/capabilities/zdr)
- **BYOK interaction:** with ZDR enabled, AI Gateway **skips your BYOK keys by default** (they run under your own provider agreements) unless you explicitly mark a BYOK key as ZDR-compliant. Disallow-training is likewise **not enforced on BYOK** requests (your key, your agreement), though it IS honored if the Gateway falls back to its own system credentials.

### BYOK vs Vercel credits
- **BYOK (Bring Your Own Key):** use your own provider key through the Gateway. "With BYOK, there is no markup or fee from AI Gateway." You keep your own provider relationship/agreement; Vercel just routes.
- **Vercel credits (system credentials):** Vercel uses its own provider credentials and bills you in AI Gateway Credits at the provider's list price.

### Pricing (Gateway)
- **Pay-as-you-go, zero markup on tokens** — "AI Gateway provides tokens with zero markup, including when you bring your own key." Rates are "based on the provider's list price."
- **Free tier:** every Vercel team gets **$5/month** of AI Gateway Credits included (starts on first request; the monthly free credit stops once you purchase paid credits).
- **Paid tier:** pay-as-you-go, no lock-in, all models.
- **Add-on surcharges (off by default):**
  - **Team-wide ZDR:** $0.10 / 1,000 successful requests (per-request ZDR: free).
  - **Team-wide provider allowlist:** $0.10 / 1,000 successful requests (per-request `only` filter: free).
  - **Custom Reporting:** $0.075 / 1,000 tag/user-ID/quota writes; $5 / 1,000 reporting-endpoint queries.
- You're "responsible for any payment processing fees that may apply."

---

## 4. Pricing & billing model (summary)

| Layer | Cost |
| --- | --- |
| **SDK (`ai` package)** | **Free** (Apache-2.0). No license fee, no metering. |
| **Model provider (direct path)** | The **provider's** token pricing, billed by the provider on your own key. Vercel gets nothing. |
| **AI Gateway (opt-in)** | **No markup** on tokens (incl. BYOK). $5/mo free credit per team, then pay-as-you-go at provider list price. Optional metered add-ons: team-wide ZDR / allowlist ($0.10/1k), Custom Reporting writes/queries. |
| **Hosting on Vercel functions** | Separate Vercel compute/bandwidth billing — **out of scope** here, but note that running the SDK inside a Vercel Function is billed as ordinary Vercel compute regardless of which AI path you use. |

> Revenue model: the SDK is a free funnel; Vercel monetizes the **AI Gateway** (compute/credits + metered privacy/reporting add-ons) and its **hosting platform**, not the library.

---

## 5. Compliance & certifications (Gateway / Vercel-hosted path only)

These apply to **Vercel as a processor** — i.e. the **AI Gateway** and/or apps hosted on Vercel. They do **not** apply to the bare SDK on the direct-to-provider path (there, the provider's compliance governs).

- **SOC 2 Type 2:** held by Vercel; DPA references an audit program performed "at least once annually." Attestation downloadable via the Trust Center.
- **ISO/IEC 27001** (and **27017 / 27018 / 27701** referenced); **PCI DSS** (2025 SAQ-D AOC noted); **HIPAA**; **GDPR**. Trust Center also lists CCPA/CPRA, EU-US Data Privacy Framework (+ Swiss/UK extensions), PIPEDA, DSA, NIS 2, DORA, nFADP, TISAX L2. **[the long secondary list is from the Trust Center page render; verify the exact in-scope certifications via the portal before citing specific ones.]**
- **DPA / GDPR:** Vercel offers a **Data Processing Addendum** (effective 2026-03-31) covering "EU GDPR (EU) 2016/679," applicable to **Enterprise and Pro** customers, with Standard Contractual Clauses (Modules 1–3) incorporated. Subprocessor list at security.vercel.com; customers can subscribe via privacy@vercel.com and have **5 days** to object to new subprocessors.
- **Data residency:** "primary processing facilities are in the United States," but Customer Data "may need to be transferred and processed … anywhere else in the world" where Vercel/subprocessors operate. Encryption: **TLS 1.2+** in transit, **AES-256** at rest. There is **no EU-in-region inference option for the AI Gateway** as of 2026-06-08. The ZDR/Observability/Gateway docs surface no region-pinning or EU-residency control, and EU data residency for the Gateway is an open, unfulfilled feature request (Vercel Community feature request; vercel/ai issue #10157 re: OpenAI EU regional endpoints — the Gateway routes OpenAI traffic to `api.openai.com`, not `eu.api.openai.com`). Only the general US-primary + worldwide-transfer posture applies. For EU residency on inference, prefer the direct-to-provider path with a residency-supporting provider, or confirm with Vercel sales.
- **Trust Center:** `https://security.vercel.com` (reports behind access request).

---

## 6. Open questions / unverified

- **Default-resolution trigger** for Gateway vs direct — **RESOLVED (checked 2026-06-08).** The AI Gateway provider docs state the explicit rule: *"The AI SDK automatically uses the AI Gateway when you pass a model string in the `creator/model-name` format."* A plain string routes through the Gateway; an imported provider package (or `gateway(...)` instance for explicit Gateway use) is the alternative. Source: https://ai-sdk.dev/providers/ai-sdk-providers/ai-gateway
- **Scope of Vercel's "no content retention" claim** — **RESOLVED (checked 2026-06-08).** The "immediately and permanently deleted after requests" guarantee is in a dedicated **"Vercel"** section of the ZDR page (separate from the "Providers" and per-request `zeroDataRetention` sections) and applies to Vercel's gateway layer for **all** requests, no opt-in required ("No action is needed on the user side"). The per-request/team-wide `zeroDataRetention` flag is a separate control governing the **downstream provider**. Source: https://vercel.com/docs/ai-gateway/capabilities/zdr
- **Exactly what the Observability "detailed request log" stores** — **RESOLVED (checked 2026-06-08).** Metadata only: token COUNTS, cost per request, model, latency (P75 duration/TTFT), project, API key. The "detailed log of all requests" is documented as containing "all token types and the cost for each request" — no message-body/content field anywhere on the page. Source: https://vercel.com/docs/ai-gateway/capabilities/observability
- **Default (filter-off) downstream behavior on the Gateway** — **RESOLVED (checked 2026-06-08).** Verbatim: *"By default, AI Gateway does not route based on the data retention policy of providers."* So the routed provider's own default training/retention applies unless `disallowPromptTraining` / `zeroDataRetention` is set. (The precise per-provider default remains a per-provider question — see each provider note.) Source: https://vercel.com/docs/ai-gateway/capabilities/zdr
- **AI-Gateway-specific data residency / EU in-region inference** — **RESOLVED (checked 2026-06-08): no such option exists.** EU residency for the Gateway is an open, unfulfilled feature request (Vercel Community; vercel/ai issue #10157). Only the general US-primary + worldwide-transfer posture applies.
- **Current stable `ai` version** — **RESOLVED (snapshot 2026-06-08).** npm `latest` = `6.0.197` (Apache-2.0); `beta` = `7.0.0-beta.116`; `canary` = `7.0.0-canary.165`. v6 is stable; v7 is beta/canary only. Source: https://registry.npmjs.org/-/package/ai/dist-tags
- **Whether OpenTelemetry export to Vercel's own observability is ever implicit** — **RESOLVED (checked 2026-06-08).** No. The AI SDK telemetry docs describe no automatic export; the exporter destination is always developer-configured via the `TracerProvider`, even inside a Vercel deployment. Source: https://ai-sdk.dev/docs/ai-sdk-core/telemetry

---

## Sources

Primary — AI SDK (ai-sdk.dev) & repo:
- AI SDK introduction — https://ai-sdk.dev/docs/introduction
- AI SDK Core: Telemetry — https://ai-sdk.dev/docs/ai-sdk-core/telemetry
- Providers and models (foundations) — https://ai-sdk.dev/docs/foundations/providers-and-models
- OpenAI provider (default base `api.openai.com/v1`) — https://ai-sdk.dev/providers/ai-sdk-providers/openai
- `vercel/ai` repo — https://github.com/vercel/ai
- LICENSE (Apache-2.0) — https://raw.githubusercontent.com/vercel/ai/main/LICENSE
- `ai` package.json (`license: Apache-2.0`) — https://raw.githubusercontent.com/vercel/ai/main/packages/ai/package.json
- `ai` on npm — https://www.npmjs.com/package/ai
- `ai` npm dist-tags (latest 6.0.197 / beta 7.0.0-beta.116 / canary 7.0.0-canary.165, checked 2026-06-08) — https://registry.npmjs.org/-/package/ai/dist-tags
- AI Gateway provider (default-resolution rule for `creator/model-name` strings) — https://ai-sdk.dev/providers/ai-sdk-providers/ai-gateway
- Introducing the AI SDK (blog) — https://vercel.com/blog/introducing-the-vercel-ai-sdk

Primary — Vercel AI Gateway:
- AI Gateway overview — https://vercel.com/docs/ai-gateway
- Getting started — https://vercel.com/docs/ai-gateway/getting-started
- Pricing — https://vercel.com/docs/ai-gateway/pricing
- Zero Data Retention — https://vercel.com/docs/ai-gateway/capabilities/zdr
- Disallow Prompt Training — https://vercel.com/docs/ai-gateway/capabilities/disallow-prompt-training
- Observability — https://vercel.com/docs/ai-gateway/capabilities/observability
- BYOK — https://vercel.com/docs/ai-gateway/authentication-and-byok/byok

Primary — Vercel compliance:
- Data Processing Addendum (DPA) — https://vercel.com/legal/dpa
- Trust Center / security — https://security.vercel.com/
- AI Gateway data residency (open feature request, no EU in-region inference) — https://community.vercel.com/t/feature-request-data-residency-options-for-ai-gateway/41187
- vercel/ai issue #10157 — OpenAI EU regional endpoints not supported by Gateway — https://github.com/vercel/ai/issues/10157

Secondary (flagged — framing / change history only):
- Fewer Tools — "ZDR moved behind a $0.10/1k fee" (Apr/May 2026) — https://fewertools.com/news/vercel-ai-gateway-zdr-paid-april-2026/
- Folding Sky — AI Gateway one killer feature, one pricing catch — https://folding-sky.com/blog/vercel-ai-gateway-hundreds-ai-models-zero-data-retention
