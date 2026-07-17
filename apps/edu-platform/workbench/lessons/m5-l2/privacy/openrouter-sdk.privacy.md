# OpenRouter Agent SDK (`@openrouter/agent`) — Privacy, Data-Handling & Pricing Research Note

> Compiled 2026-06-08. Editorial research note. Sources are primary OpenRouter docs unless flagged secondary. Any claim that could not be verified against a primary source is marked **[unverified]**.

## The two-layer model (read this first)

OpenRouter is a **model gateway** that routes a single API to 400+ models across many upstream providers. The `@openrouter/agent` SDK is just a higher-level agent-loop wrapper (tools, multi-turn, stop conditions, streaming) sitting on top of that gateway — it inherits the gateway's data and pricing behavior; it does not define its own. So privacy is **two-layered**:

- **(a) The gateway layer — OpenRouter itself**: what OpenRouter logs/retains as the request passes through.
- **(b) The provider layer — the downstream model provider** (OpenAI, Anthropic, Google, Together, DeepInfra, etc.) that actually runs inference and has its own retention/training policy.

The single most important nuance: OpenRouter's *own* logging policy and the *downstream provider's* policy are independent. Turning off "training" only changes **which downstream providers OpenRouter will route to**; it has no bearing on what OpenRouter itself does. These are controlled by different settings.

---

## OpenRouter's own logging & training (gateway layer)

- **No prompt/completion logging by default.** "We do zero logging of your prompts/completions, even if an error occurs, unless you opt-in to logging them." (FAQ)
- **Metadata is always retained.** "We log basic request metadata (timestamps, model used, token counts)." This metadata is kept regardless of logging settings. (FAQ)
- **OpenRouter does not train on your data** in the default path. OpenRouter states it itself has a Zero Data Retention posture: "your prompts are not retained unless you specifically opt in to prompt logging." (ZDR docs)
- **Prompt categorization / sampling.** OpenRouter "samples a small number of prompts for categorization to power our reporting and model ranking." If you are **not** opted into OpenRouter's use of inputs/outputs, that categorization is "stored completely anonymously," never tied to your account/user ID, with a zero-data-retention policy. (Data Collection docs)

### Two distinct opt-in logging features (do not conflate them)

1. **Private Input & Output Logging** (Observability / Logs; beta). You store your own prompts and completions to view them on the Logs page for debugging and prompt optimization.
   - Stored in "an isolated Google Cloud Storage project with separate access controls," encrypted at rest with "Google Cloud's default encryption (AES-256)."
   - Retained "for a minimum of 3 months," possibly longer at OpenRouter's discretion, unless you request deletion via support@openrouter.ai.
   - OpenRouter "does not access or use your prompt and response data logged with this feature for model training, analytics, or any other purpose." Off by default. Org accounts require admin enablement. (Input & Output Logging docs)

2. **"OpenRouter Use of Inputs/Outputs"** (Privacy settings; the discount tradeoff). You let OpenRouter "use your prompt and completion data to improve the product" in exchange for a **1% discount on model usage**. Off by default. (Data Collection docs / FAQ)
   - **Confirmed commercial-use caveat — but the language lives in the Terms of Service, not the Privacy Policy.** The live Privacy Policy is conservative: it says OpenRouter does not control how downstream LLMs use your inputs/outputs ("We do not control, and are not responsible for, LLMs' handling of your Inputs or Outputs, including for use in their model training"), and that when it processes feedback it "disassociate[s] Inputs and Outputs from your user ID." The broad license sits in the **Terms of Service**: enabling prompt logging grants OpenRouter a "worldwide, perpetual, irrevocable, non-exclusive, royalty-free, fully paid right and license (with the right to sublicense) to host, store, transfer, display, perform, reproduce, modify…" your User Content, including the right to "license or sell your User Content in anonymized form." Separately, even **without** opt-in, automatic categorization carries a parallel "worldwide, perpetual, irrevocable…royalty-free…license…to use, host, reproduce…your Inputs in anonymized form" for metrics/rankings. So the broad/irrevocable commercial-use claim is **correct in substance**, but it is a Terms-of-Service grant tied to enabling prompt logging — not Privacy-Policy text. (Terms of Service; Privacy Policy)

> Net: by default OpenRouter behaves as a zero-content-retention pass-through (metadata only). Content storage requires an explicit opt-in, and the two opt-ins have very different purposes — one is private-to-you, the other licenses your data to OpenRouter for a discount.

---

## Downstream provider data policies (provider layer)

- Each upstream provider "has its own data handling policies, and OpenRouter reflects those policies in structured data on each AI endpoint that is offered." Provider policies are surfaced per-endpoint and per-provider page, with links to each provider's full terms. (Provider Logging docs)
- **Training:** Some providers may train on data per their own policies. OpenRouter classifies endpoints by whether the provider may train/log. "Providers that do log, or where we have been unable to confirm their policy, will not be routed to unless the model training toggle is switched on." (FAQ)
- **Retention vs training are separate axes at the provider level too.** Providers "also have their own data retention policies, often for compliance reasons." Per the Provider Logging page, OpenRouter "does not have routing rules that change based on [provider] data retention policies" by default — i.e., the automatic filter targets *training/logging*, and pure *retention* requirements are enforced via the separate ZDR mechanism (below), not the training toggle. (Provider Logging docs)
- **Free models** are typically served by providers/endpoints with looser data policies (this is the usual data tradeoff for $0 inference). OpenRouter exposes separate account toggles for free vs paid models so you can, e.g., allow training-on-data providers for free models but deny them for paid. (Data Collection docs — separate free/paid settings)

---

## Controlling data flow (provider routing + data policy)

OpenRouter gives you three layers of control: account settings, the `provider` routing object per request, and ZDR enforcement.

### Account-level data policy
- A setting controls whether OpenRouter may route to providers that "may train on your data (according to their own policies)," with **separate settings for paid and free models**. If you opt out of training, "OpenRouter will not route to providers that train." (Data Collection / Provider Logging docs)

### Per-request `provider` routing object
Relevant fields (Provider Routing docs):
- **`provider.data_collection`**: `"allow"` (default) routes to providers that may store user data non-transiently; `"deny"` uses "only providers which do not collect user data." This is the per-request analog of the account data policy.
- **`provider.order`**: ordered list of provider slugs to try (with fallback unless disabled).
- **`provider.only`**: whitelist of allowed provider slugs (merges with account allow-list).
- **`provider.ignore`**: blacklist of providers to exclude (merges with account ignore-list).
- **`provider.allow_fallbacks`** (default `true`): whether to fall back to other providers if the preferred one fails; set `false` (often with `order`) to pin a single provider.
- **`provider.quantizations`**: filter by quantization (int4, int8, fp8, fp16, …).
- **`provider.sort`**: `"price"`, `"throughput"`, or `"latency"`.
- **`max_price`**: max acceptable per-million-token price, e.g. `{"prompt": 1, "completion": 2}` allows ≤ $1/M prompt and ≤ $2/M completion. This is the field that bounds price-sorted/fallback routing.

> Note on the SDK: `@openrouter/agent`'s stop conditions are passed via the `stopWhen` option as built-in helpers. The cost-limit helper is **`maxCost(amount)`** (e.g. `maxCost(0.50)`), a USD spend ceiling that stops the agent loop once accumulated spend crosses the threshold. The full built-in set is `stepCountIs(n)`, `hasToolCall(name)`, `maxCost(amount)`, `maxTokensUsed(n)`, and `finishReasonIs(reason)`; passing an array stops on whichever fires first; the default when `stopWhen` is omitted is `stepCountIs(5)`. `maxCost` is an agent-loop budget guard and is distinct from `max_price`, which is a per-request provider-selection price ceiling. (Agent SDK Stop Conditions docs)

### Zero Data Retention (ZDR) enforcement
- "Zero Data Retention (ZDR) means that a provider will not store your data for any period of time." ZDR providers also cannot train on your data. (ZDR docs)
- Enforceable **globally** (account-wide), **per model group**, or **per request**:
  - Per model group toggles map to API fields `enforce_zdr_anthropic`, `enforce_zdr_openai`, `enforce_zdr_google`, `enforce_zdr_other`.
  - Per request: `"zdr": true` inside the `provider` object.
- The per-request `zdr` flag is **OR-combined** with account/guardrail settings — it can only *enable* ZDR for a request, never disable an account-level restriction.
- In-memory prompt caching is **not** treated as data retention, so cached endpoints remain available under ZDR. (ZDR docs)

---

## Retention

- **OpenRouter (gateway):** Request **metadata** (timestamps, model, token counts) is always retained. **Content** (prompts/completions) is **not** retained by default. Content is only stored if you opt into Input & Output Logging (min. 3 months, deletable on request) and/or the use-of-inputs/outputs discount program. (FAQ / Input & Output Logging docs)
- **Providers (downstream):** Retention varies per provider and is published in each endpoint's structured policy data. ZDR endpoints retain nothing. Non-ZDR endpoints may retain even if they don't train. Use ZDR enforcement (not the training toggle) to guarantee no provider-side retention. (ZDR / Provider Logging docs)
- Exact provider-by-provider retention windows are **not centralized** by OpenRouter. Per the Provider Logging docs, each upstream provider "has its own data handling policies, and OpenRouter reflects those policies in structured data on each AI endpoint" — i.e., retention is surfaced per-endpoint/per-provider, with links out to each provider's full terms, not as a single consolidated table of numeric windows. To read a specific window you must consult the relevant endpoint's policy data (or the provider's own terms) directly. (checked 2026-06-08: confirmed per-endpoint only; no central enumeration exists.)

---

## Pricing & fees

- **Pass-through token pricing, no markup.** "We do not mark up provider pricing. Pricing shown in the model catalog is what you pay which is exactly what you will see on provider's websites." / "We pass through the pricing of the underlying model providers without any markup." (Pricing page / FAQ)
- **Credit purchase fee.** The live FAQ/pricing pages render the fee dynamically (templated `getTotalFeeString('stripe', …)` / `('coinbase', …)`), so the exact numbers are **not** exposed as static text there. Confirmed via OpenRouter's primary "Simplifying Our Platform Fee" announcement (effective 2025-06-09):
  - Card / non-crypto (Stripe): **5.5% of the order amount, minimum fee $0.80**. (Simplifying Our Platform Fee announcement)
  - Crypto (Coinbase): **5.0% flat, no minimum fee**. (Simplifying Our Platform Fee announcement)
  - The pricing page independently lists a **"5.5%" platform fee** for Pay-as-you-go, consistent with the card-purchase figure. (Pricing page)
- **No minimums / no lock-in** for Pay-as-you-go: "You pay only for what you use." (Pricing page)
- **BYOK (Bring Your Own Key):** first **1M requests/month free**, then a **5% fee** of what the same model/provider would normally cost on OpenRouter, deducted from OpenRouter credits. Enterprise: 5M free reqs/month, custom pricing. (FAQ / Pricing page)
- **Free models:** "25+ free models" across "4 free providers." The data tradeoff is the looser provider data policy typical of free tiers (see provider layer above); gate these with the free-vs-paid account toggles. (Pricing page / Data Collection docs)
- **Fallback/`max_price` interaction:** with price-sorted or fallback routing, `max_price` caps which endpoints are eligible; `allow_fallbacks=false` pins routing and disables substitution. (Provider Routing docs)

> Revenue model summary: OpenRouter does not mark up inference. It monetizes via (1) the credit-purchase/platform fee (~5.5% card), (2) the BYOK fee (5% after 1M req/mo), and (3) enterprise contracts.

---

## Compliance

- **GDPR / DPA:** OpenRouter offers a Data Processing Agreement. Per the support article, a **mutually signed DPA is provided to enterprise-tier customers** via the Trust Portal (trust.openrouter.ai); self-serve customers can request Trust Portal access to review it for informational purposes, but the signed agreement applies to enterprise accounts. (OpenRouter support / Trust Center)
- **SOC 2:** The Enterprise page advertises "A single GDPR compatible, SOC-2 compliant partner with SLAs," plus org-wide policy enforcement and exportable audit trails. The page states SOC 2 compliance but **does not publish a SOC 2 report date or attestation period (Type I vs Type II)**; obtain the current attestation from sales/security or via the Trust Center if compliance-critical. (Enterprise page) (checked 2026-06-08: SOC 2 claim confirmed on Enterprise page; report currency/type not stated publicly — confirm directly with OpenRouter.)
- **Data residency:** The Enterprise page lists "EU region locking" and "Sovereign AI" with "in-region routing, data residency controls, and compliance features." This is presented as an **enterprise-tier** capability; the page does not describe EU in-region routing as available on self-serve tiers. (Enterprise page) (checked 2026-06-08: EU region locking / in-region routing confirmed on Enterprise page as an enterprise feature; exact scope/availability outside enterprise not stated — confirm with sales.)
- A public **Trust Center** exists at trust.openrouter.ai with documents/attestations behind access request.

---

## Open questions / unverified

- **Exact credit-purchase and crypto fee numbers** — RESOLVED (checked 2026-06-08). Confirmed via OpenRouter's primary "Simplifying Our Platform Fee" announcement: card/non-crypto = **5.5%, min $0.80**; crypto = **5.0% flat, no minimum**. The pricing/FAQ pages still template these (`getTotalFeeString`), but the announcement is a primary OpenRouter source.
- **Privacy Policy vs Terms commercial-use language** — RESOLVED/CORRECTED (checked 2026-06-08). The broad "worldwide, perpetual, irrevocable…right to sublicense…license or sell…in anonymized form" grant is **real but lives in the Terms of Service**, tied to enabling prompt logging — not in the Privacy Policy. The Privacy Policy itself is conservative (de-identifies inputs/outputs for feedback; defers training to provider terms). Earlier framing that pinned this to the Privacy Policy was misattributed.
- **Per-provider retention windows** — RESOLVED (checked 2026-06-08). Confirmed OpenRouter does **not** centralize these; retention is surfaced per-endpoint/per-provider in structured policy data with links to provider terms. No consolidated numeric table exists.
- **Agent SDK cost-limit stop condition** — RESOLVED (checked 2026-06-08). The helper is **`maxCost(amount)`** (e.g. `maxCost(0.50)`), passed in the `stopWhen` array. Full built-in set: `stepCountIs`, `hasToolCall`, `maxCost`, `maxTokensUsed`, `finishReasonIs`; default `stepCountIs(5)`.
- **SOC 2 report currency and EU-residency scope** — STILL OPEN (checked 2026-06-08). The Enterprise page confirms a SOC-2-compliant posture and "EU region locking" / in-region routing as enterprise features, but publishes **no SOC 2 report date or type (I/II)** and does not detail availability outside the enterprise tier. Attestation currency and exact residency scope can't be confirmed without contacting OpenRouter sales/security or the Trust Center (which gates documents behind an access request).

---

## Sources

OpenRouter primary docs:
- Quickstart / Agent SDK overview: https://openrouter.ai/docs/agent-sdk/overview
- Agent SDK Stop Conditions: https://openrouter.ai/docs/sdks/typescript/call-model/stop-conditions
- Agent SDK API reference: https://openrouter.ai/docs/agent-sdk/call-model/api-reference
- Agentic usage: https://openrouter.ai/docs/sdks/agentic-usage
- SDK landing: https://openrouter.ai/sdk
- FAQ: https://openrouter.ai/docs/faq
- Data Collection (privacy): https://openrouter.ai/docs/guides/privacy/data-collection
- Provider Logging (privacy): https://openrouter.ai/docs/guides/privacy/provider-logging
- Input & Output Logging: https://openrouter.ai/docs/guides/features/input-output-logging
- Zero Data Retention (ZDR): https://openrouter.ai/docs/guides/features/zdr
- Provider Routing / Provider Selection: https://openrouter.ai/docs/guides/routing/provider-selection
- Pricing: https://openrouter.ai/pricing
- Platform fee announcement (card/crypto fee numbers): https://openrouter.ai/announcements/simplifying-our-platform-fee
- Enterprise: https://openrouter.ai/enterprise
- Privacy Policy: https://openrouter.ai/privacy
- Terms of Service: https://openrouter.ai/terms
- Trust Center: https://trust.openrouter.ai/
- DPA / GDPR support article: https://openrouter.zendesk.com/hc/en-us/articles/47828437697051-How-do-I-get-OpenRouter-s-Data-Processing-Agreement-DPA-for-GDPR-compliance

Secondary (flagged — used only where primary numbers were templated/unavailable):
- https://www.datastudios.org/post/openrouter-pricing-byok-routing-costs-and-cost-optimization-strategies-how-openrouter-actually-c
- https://ofox.ai/blog/openrouter-pricing-hidden-markup-breakdown-2026/
- https://meetily.ai/llm-privacy/openrouter
- https://anarlog.so/blog/openrouter-data-retention-policy/
- https://skywork.ai/blog/openrouter-review-2025-2/
