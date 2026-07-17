# Agent SDK Privacy, Data & Pricing — Cross-SDK Summary

> Compiled 2026-06-08 from parallel research into five SDKs; **a second pass
> (also 2026-06-08) resolved most `[unverified]` items against primary sources.**
> Full per-SDK detail lives in the sibling files:
> [`claude-sdk.privacy.md`](./claude-sdk.privacy.md) ·
> [`codex-sdk.privacy.md`](./codex-sdk.privacy.md) ·
> [`cursor-sdk.privacy.md`](./cursor-sdk.privacy.md) ·
> [`openrouter-sdk.privacy.md`](./openrouter-sdk.privacy.md) ·
> [`vercel-ai-sdk.privacy.md`](./vercel-ai-sdk.privacy.md).
> A handful of items remain **[unverified]** (mostly attestation currency and
> beta-stage disclosures) — see each file's "Open questions" section and the
> ledger below before quoting in lesson material.

## The one rule that governs all five

**None of these SDKs has its own privacy or billing regime.** Each is a thin
control layer; its data and cost terms are *inherited* from the backend it talks
to and, critically, **from the authentication path you choose**:

- **Claude** → first-party API (commercial terms) vs partner cloud (Bedrock/
  Vertex/Foundry) vs subscription auth (`claude -p`). Different data regime each.
- **Codex** → API-key auth (your API org's settings, API billing) vs
  sign-in-with-ChatGPT (ChatGPT Enterprise settings, plan limits).
- **Cursor** → first-party token billing vs bring-your-own-key (BYOK voids the
  zero-retention guarantee).
- **OpenRouter** → two independent layers: the gateway *and* each downstream
  provider, each with its own toggle.
- **Vercel AI SDK** → the **purest** form of this rule: the open-source `ai`
  library is **not in the data path at all** by default — requests go *direct to
  the provider* you import, governed entirely by that provider's terms. Vercel
  only enters the picture if you opt into the **AI Gateway** proxy.

So "is my data safe?" has no single answer per SDK — it depends on how you wired
it up. That nuance is the headline finding, and Vercel makes it most explicit:
the SDK vendor and the data processor can be **completely different parties**.

---

## Data sharing / training on your data

| SDK | Trained on by default? | Key mechanism |
|---|---|---|
| **Claude** | **No** (commercial/API). Commercial Terms: "Anthropic may not train models on Customer Content." | Consumer claude.ai is now an *explicit user choice* (the "model training setting"): allow → data retained **up to 5y**; decline → **30 days**. **`claude -p` on a Pro/Max subscription falls under consumer terms** — but Anthropic directs Agent SDK builders to use a **Console API key** (commercial, no-train, ZDR-eligible). |
| **Codex** | **No** (API track, since 2023). Business Terms: no training on Customer Content without opt-in. | API-key path = safe default; ChatGPT path = Data Controls toggle ("Improve the model for everyone"). |
| **Cursor** | **No** *with Privacy Mode* — contractual ZDR with OpenAI/Anthropic/Google/xAI + Fireworks/Baseten. | Privacy Mode forced-on for Teams/Enterprise. **BYOK voids ZDR.** |
| **OpenRouter** | **No** by gateway default; depends on **chosen providers** for the second layer. | Account "data policy" + per-request `provider.data_collection: allow\|deny` filters routing. Free models = looser data tradeoff. |
| **Vercel** | **No** by Vercel — it isn't in the path. Training depends **entirely on the chosen provider** (direct) or is **not done by Vercel** (Gateway). | Direct path: provider's terms apply verbatim. Gateway: Vercel states no training; free `disallowPromptTraining` flag, plus metered team-wide ZDR ($0.10/1k req). |

**Takeaway:** all five default to *not training on your data on the
commercial/API path*. The exceptions are user-chosen: Claude consumer auth,
Codex ChatGPT auth, Cursor BYOK, OpenRouter free/permissive-provider routing,
and — for Vercel — whichever provider you point it at (Vercel itself never
trains, and stays out of the data path unless you enable the Gateway).

---

## Retention & zero-data-retention (ZDR)

- **Claude** — **30-day** API default (confirmed primary; the "7-day since Sep
  2025" claim was secondary-only and is *refuted*). ZDR by arrangement covers
  Messages/Token-Counting + Claude Code with commercial keys; **excludes** Batch,
  Files, code execution, Managed Agents, MCP connector, Agent Skills, consumer.
  Policy-violation content retained up to **2y**; trust-and-safety classification
  scores up to **7y** (both confirmed primary). Consumer retention follows the
  training choice: 5y (allow) / 30d (decline).
- **Codex** — standard 30-day API retention (inputs/outputs + abuse logs); ZDR
  available to approved customers on the eligible endpoints Codex uses. *Confirmed:
  there is **no Codex-SDK-named** ZDR/residency/cert statement — it is pure
  inheritance from API/Enterprise scope.*
- **Cursor** — Privacy Mode = providers store nothing. Cloud Agents temporarily
  hold encrypted repos in isolated VMs, deleted on run completion. Indexing keeps
  only embeddings + obfuscated metadata, never raw source. Artifacts in S3
  us-east-1, 15-min presigned URLs; worker tokens 1h; env vars session-scoped.
- **OpenRouter** — gateway: **content-zero, metadata-always** (timestamps, model,
  token counts always kept). Optional *Private logging* (your-eyes-only, isolated
  GCS, AES-256, ≥3-month retention, not for training) is distinct from the
  *discount-for-data* opt-in. Provider-side retention controlled separately via
  `enforce_zdr_*` / `provider.zdr: true`.
- **Vercel** — *direct path:* retention is **the provider's**, full stop. *Gateway
  path:* Vercel states it does not retain message content; observability logs
  **metadata only** (tokens, cost, latency, model). No default SDK telemetry —
  it's opt-in via `experimental_telemetry` to *your* OpenTelemetry exporter, not
  Vercel. ZDR available as a metered Gateway add-on (Pro/Enterprise).

---

## Data residency

- **Claude** — cloud routing (Bedrock/Vertex/Foundry) puts the *cloud provider*
  as data processor in its region; first-party API supports `inference_geo: "us"`
  (1.1× multiplier). 
- **Codex** — regional/ChatGPT-Enterprise residency settings on the ChatGPT path.
- **Cursor** — **weak spot: no self-serve EU residency** (confirmed — EEA data
  "may be transferred to US servers"; the "Regions" docs are about *model
  availability*, not data residency). Whether Enterprise can negotiate EU-only is
  undocumented. The main GDPR caveat for EU devs.
- **OpenRouter** — Enterprise advertises **"EU region locking" / "Sovereign AI"**
  in-region routing (a real enterprise feature); SOC-2 currency & exact residency
  scope still need direct confirmation (**[unverified]**).
- **Vercel** — *direct path:* residency is wherever your provider/region points
  (Vercel uncovered — the lever for EU). *Gateway path:* **confirmed no EU
  in-region inference option exists** (open feature request; Gateway routes OpenAI
  to `api.openai.com`, not the EU endpoint) — US-primary only.

---

## Inputs / outputs ownership

Uniform and customer-favorable across the first-party vendors; the two gateways
pass ownership through to the chosen provider:

- **Claude** — "Customer retains all rights to its Inputs and owns its Outputs";
  Customer Content is Customer's Confidential Information.
- **Codex** — customer retains rights in Input, **owns all Output** (OpenAI
  assigns its Output rights to customer).
- **Cursor** — covered by Privacy Mode + DPA (no separate ownership reassignment
  surfaced).
- **OpenRouter** — gateway pass-through; ownership effectively flows from the
  chosen downstream provider's terms.
- **Vercel** — not a party to inputs/outputs on the direct path; ownership flows
  from the provider. Gateway adds Vercel's processing terms but not an ownership claim.

---

## Pricing & billing model

| SDK | Model | Notable specifics |
|---|---|---|
| **Claude** | Token-based API. | Opus 4.x **$5/$25** per MTok (in/out), Sonnet 4.x **$3/$15**, Haiku 4.5 **$1/$5**; batch −50%; cache + `us` geo (1.1×) multipliers. **June 15 2026 (confirmed primary, Help Center #15036540):** programmatic usage (`claude -p`/SDK/Code GitHub Actions/3rd-party subscription-auth apps) draws a **separate monthly credit** — $20 Pro / $100 Max-5× / $200 Max-20× (+ Team Standard $20/seat, Team Premium $100/seat, Enterprise $200); **no rollover, no pooling**, stops at zero unless overflow billing on. |
| **Codex** | Two channels by auth. | **API track** = token billing. Confirmed **1 credit = $0.04** (25 cr = $1): GPT-5.5 = **$5 / $0.50 / $30** per MTok (in/cached/out) = 125 / 12.5 / 750 cr; GPT-5.4 = $2.50/$0.25/$15; 5.4-mini cheaper. **ChatGPT track** = bundled into Plus/Pro/Business with per-5-hour windows + overage. No standalone Codex subscription. |
| **Cursor** | Token-based, **no separate SDK fee.** | Composer 2.5 (confirmed name + rates verbatim): **$0.50/M in, $2.50/M out, $0.20/M cache**. Free users *can install* the SDK, but **Cloud Agents are paid-plan** and **service accounts Enterprise-only**; service-account usage bills from the **team pool, same as humans**. Teams ($40/user) adds a $0.25/M Cursor Token Rate. `/v1/repositories` very strict: 1/min, 30/hr. |
| **OpenRouter** | Pass-through, **no inference markup.** | Revenue = platform fee (confirmed: **card 5.5%, min $0.80**; **crypto 5.0% flat, no min**) + BYOK fee (5% after 1M free req/month). Loop cost cap via **`maxCost(amount)`** in `stopWhen` (default `stepCountIs(5)`). Free model tiers carry data tradeoffs. |
| **Vercel** | **SDK is free** (Apache-2.0); you pay only the provider. | Direct path: pure provider token pricing, Vercel takes nothing. **AI Gateway:** **zero markup** on tokens incl. BYOK, $5/mo free credit per team, then provider list price. Metered add-ons off by default (team-wide ZDR + provider allowlist **$0.10/1k req**; per-request ZDR + `disallowPromptTraining` free). Vercel-hosting compute billed separately. *(license was Apache-2.0 not MIT — corrected.)* |

---

## Compliance & certifications

- **Claude** — SOC 2 Type I & II, ISO 27001:2022, ISO/IEC 42001:2023, HIPAA-ready
  (BAA, first-party API only — Claude Code & partner clouds excluded), GDPR via
  SCCs + DPA.
- **Codex** — SOC 2 Type 2 (confirmed window **2025-01-01 → 2025-06-30**), ISO
  27001:2022 + 27017 + 27018 + 27701:2019 + 42001:2023 (API Platform / ChatGPT
  Enterprise scope), BAA for HIPAA, DPA for GDPR. Inherited — no Codex-specific scope.
- **Cursor** — SOC 2 Type II (report via trust.cursor.com), published DPA +
  subprocessor list, AES-256 at rest / TLS 1.2+, CMEK for Enterprise, annual pen test.
- **OpenRouter** — signed DPA via trust.openrouter.ai; Enterprise page claims
  SOC-2 + EU residency (**[unverified]** — confirm currency/scope directly).
- **Vercel** — *applies to the Gateway/hosted path only, not the bare SDK:* SOC 2
  Type 2, ISO 27001, PCI DSS, HIPAA, GDPR; DPA (effective 2026-03-31, Pro/
  Enterprise, SCCs incorporated). On the direct path, compliance is the provider's.

---

## Decision shortcuts (privacy lens)

1. **Strictest data control, code must not leave your network** → Cursor
   **self-hosted** runtime, or Claude/Codex on a **ZDR-arranged commercial key**.
2. **EU data residency is mandatory** → *avoid Cursor* (no self-serve EU) *and the
   Vercel AI Gateway* (US-only, no EU inference); prefer Claude via Vertex/Bedrock
   EU region, **OpenRouter Enterprise** "EU region locking / Sovereign AI", or
   **Vercel AI SDK direct-to-an-EU-region provider** (you pick the endpoint, Vercel
   stays out of the path).
3. **Provider flexibility + hard cost caps** → OpenRouter, but you own the
   two-layer config: set the account data policy *and* `enforce_zdr_*`, and avoid
   free/permissive-provider routing for sensitive data.
4. **Want the SDK vendor out of the data path entirely** → **Vercel AI SDK
   direct-to-provider** is the cleanest: open-source, no telemetry by default, no
   proxy — only your provider sees the data. (Skip the AI Gateway to keep it that way.)
5. **Cheapest path can be the leakiest** → Claude consumer auth, Codex ChatGPT
   auth, Cursor BYOK, OpenRouter free models, and (for Vercel) a permissive/free
   provider each trade some data protection for cost/convenience. Match the auth
   path to the data sensitivity.

---

### Side-effect ledger

```text
New claims introduced: Vercel AI SDK 6 added as a fifth SDK across every section. A 2026-06-08 verification pass then resolved most [unverified] items against primary sources and updated the per-SDK files + this summary.
Claims removed: "7-day Claude API retention" (refuted — 30 days confirmed primary); "Cursor Free = no API access" (corrected — Free can install SDK; Cloud Agents are paid, service accounts Enterprise-only); "Composer 2 Standard" naming (corrected to Composer 2.5).
Resolved this pass: Claude June-15 credit mechanics (primary Help Center #15036540); Claude consumer training = explicit choice, 5y/30d retention; claude -p subscription = consumer terms but SDK builders directed to Console API key; Codex 1 credit = $0.04 + GPT-5.5 $5/$0.50/$30; Codex SOC 2 window 2025-01-01→2025-06-30; Codex = pure inheritance (no Codex-named ZDR/cert); Python vs TS SDK auth defaults differ; OpenRouter fees (card 5.5%/$0.80, crypto 5.0%) + maxCost(amount) stop condition; Vercel license Apache-2.0 (not MIT); Vercel Gateway "no content retention" = baseline for all requests; Vercel Gateway = no EU inference.
Neighboring lesson references changed: (none)
Prework references used: (none)
Prework concepts repeated intentionally: (none)
Potential duplicates: Complements sdk-comparison.md (feature/architecture) — this file is the privacy/cost layer; minimal overlap.
Still [unverified] (minor): Claude Foundry EU-native date + verbatim DPA text; Codex per-turn transmitted context + consumer opt-out verbatim wording; Cursor cross-run Cloud Agent history retention + Enterprise EU-negotiation + small-team DPA execution step; OpenRouter SOC-2 attestation currency/type + exact EU-residency scope.
Video/text mismatches: (n/a)
Needs human decision: Whether the remaining [unverified] items (mostly attestation currency, beta-stage disclosures, and enterprise-negotiated terms) need direct vendor confirmation before this feeds a learner-facing lesson.
```
