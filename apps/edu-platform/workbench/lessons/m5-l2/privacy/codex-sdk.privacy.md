# Codex SDK — Privacy, Data Handling & Pricing Research Note

> Compiled 2026-06-08. Subject: OpenAI **Codex SDK** (`@openai/codex-sdk`), the programmatic control layer for the Codex CLI/agent. Sourced from OpenAI primary docs where possible; secondary or uncertain items flagged.

## TL;DR

The Codex SDK is not its own billing/data product — it is a thin wrapper that **spawns the local `codex` CLI** and exchanges JSONL events over stdin/stdout. Therefore its privacy and pricing terms are inherited from whichever **authentication path** you use:

- **API key** → governed by your **OpenAI API organization's** retention and data-sharing settings; billed at **standard API token rates** through your OpenAI Platform account.
- **Sign in with ChatGPT** → governed by your **ChatGPT workspace** permissions/RBAC and **ChatGPT Enterprise retention/residency** settings; drawn against your **ChatGPT plan** usage limits/credits.

The **TypeScript** SDK injects an API key (`CODEX_API_KEY` / `OPENAI_API_KEY`) into the spawned CLI, which puts most TS programmatic usage on the **API track** by default. The **Python** SDK is different: it *reuses any existing Codex CLI authentication* and only uses an API key when you call `login_api_key(...)` — so its track is inherited from the prior session, not API-key-by-default (see Codex-specific notes).

---

## Data sharing & training

- **API data is not used for training by default.** Per OpenAI's API data-controls guide: *"data sent to the OpenAI API is not used to train or improve OpenAI models (unless you explicitly opt in to share data with us)."* This has been the default policy since 2023-03-01.
- This default applies to Codex SDK usage **when authenticated with an API key**, because the SDK runs under your API organization's data-sharing settings (Codex auth docs: with an API key *"usage follows your API organization's retention and data-sharing settings"*).
- **ChatGPT business/enterprise track** also does not train on data: data submitted via the API, ChatGPT Enterprise, and ChatGPT Team is not used to train OpenAI's models. Consumer ChatGPT (Free/Plus/Pro personal) differs — there, content **may** be used for training unless the user opts out, which is the key consumer-vs-business distinction. The consumer opt-out is the toggle **Settings → Data Controls → "Improve the model for everyone"**; switching it off means new conversations are not used to train OpenAI's models. Note the caveat that even after opting out, if a user submits feedback (thumbs up/down) on a response, the conversation tied to that feedback may still be used for training (per OpenAI's consumer data-controls / "How your data is used to improve model performance" guidance). **[checked 2026-06-08: the toggle name and opt-out mechanism are confirmed via OpenAI help-center/policy snippets, but the live consumer policy and consumer-privacy pages (openai.com/consumer-privacy, openai.com/policies/how-your-data-is-used-to-improve-model-performance) returned HTTP 403 to direct fetch, so the exact verbatim sentence could not be quoted from the primary page this pass.]**
- Under the **Business Terms**, OpenAI *"will not use Customer Content to develop or improve the Services, unless Customer explicitly agrees to such use,"* and *"will only use Customer Content as necessary to provide ... the Services, comply with applicable law, enforce OpenAI Policies, and prevent abuse."*

## Retention

- **Default API retention is 30 days.** API inputs/outputs and abuse-monitoring logs are retained for **up to 30 days**, then removed, unless longer retention is legally required or reasonably necessary to protect the service or third parties from harm.
- **Zero Data Retention (ZDR)** is available to approved/eligible customers on supported endpoints; it removes the 30-day default so content is not stored after the request completes and is excluded from abuse-monitoring logs. ZDR is requested through OpenAI (sales/account team) for a qualifying use case — it is **not** automatically applied.
- Eligible ZDR endpoints include (per the data-controls guide): `/v1/responses`, `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `/v1/images/*`, `/v1/audio/*`, `/v1/moderations`, `/v1/realtime`. Codex traffic on the API track runs through the Responses/Chat-completions style endpoints, so it falls within ZDR-eligible surface area. **[checked 2026-06-08: OpenAI does not publish an explicit "Codex SDK is ZDR-eligible" statement; ZDR/residency are scoped to API endpoints and Enterprise, and Codex inherits eligibility through the underlying endpoints — this is inheritance, not a Codex-named guarantee.]**
- With ZDR enabled, the `store` parameter is always treated as `false`.
- **ChatGPT-auth track** retention instead follows your **ChatGPT Enterprise retention** settings (custom retention windows configurable by workspace admins), not the API 30-day default.

## Data residency

- OpenAI offers **regional data storage / data residency** across ~10 regions (US, EU, Australia, Canada, Japan, India, Singapore, South Korea, UK, UAE). Non-US regions generally require ZDR approval. Some regions support regional **processing** for inference; others may temporarily process data outside the selected region to deliver the service.
- On the Codex **ChatGPT-auth track**, residency follows your **ChatGPT Enterprise ... residency settings.**
- **[checked 2026-06-08: no Codex-specific residency page exists; residency is the general API/Enterprise data-residency program applied to the underlying model calls — Codex inherits it, OpenAI does not publish a Codex-named residency statement.]**

## Inputs/outputs ownership

Per OpenAI **Business Terms**:

- *"As between Customer and OpenAI, to the extent permitted by applicable law, Customer retains all ownership rights in Input and owns all Output. OpenAI assigns to Customer all its right, title, and interest, if any, in and to Output."*
- *Input* = customer/end-user input to the Services; *Output* = what the Services return.
- Customer is responsible for Input and warrants it has the rights/licenses to provide it.
- This applies to Codex usage running under a business/API agreement. (Standard caveat: outputs may be non-unique across customers, and customer is responsible for compliance/IP of inputs.)

## Pricing & billing model

Codex billing has **two channels**, and the SDK inherits whichever auth it uses:

1. **API key (the SDK's documented default):** *"OpenAI bills API key usage through your OpenAI Platform account at standard API rates."* You *"pay only for the tokens Codex uses, based on API pricing."* This is consumption/token-based and does **not** draw on a ChatGPT subscription.
2. **Sign in with ChatGPT:** usage is included in the ChatGPT plan (Plus/Pro/Business/Enterprise) with **message/usage limits per 5-hour window** rather than per-token charges; when limits are hit, Plus/Pro users *"can purchase additional credits to continue working."*

**Subscription plan inclusion (ChatGPT track), per the Codex pricing page (current default model = GPT-5.5).** Message limits per 5-hour window, confirmed 2026-06-08 against https://developers.openai.com/codex/pricing:

| Plan | GPT-5.5 | GPT-5.4 | GPT-5.4-mini | GPT-5.3-Codex |
|------|---------|---------|--------------|---------------|
| Plus (~$20/mo) | 15–80 | 20–100 | 60–350 | 30–150 |
| Pro 5x | 80–400 | 100–500 | 300–1,750 | 150–750 |
| Pro 20x | 300–1,600 | 400–2,000 | 1,200–7,000 | 600–3,000 |
| Business | 15–80 | 20–100 | 60–350 | 30–150 |

- **Business** sits at the same per-window tier as Plus. Other listed plan price points: Free $0/mo, Go $8/mo, Pro from $100/mo, Business pay-as-you-go, Enterprise/Edu custom.
- (Codex is bundled into ChatGPT plans; there is no standalone Codex subscription.)
- Per OpenAI's pricing notes, Codex moved from per-message to **per-token (credit) pricing** in April 2026 for Plus/Pro/Business and Enterprise plans.

**Token / credit rate card (used when on the API track, or when buying overage credits):**

| Model | Input (credits / 1M tok) | Cached input | Output |
|-------|--------------------------|--------------|--------|
| GPT-5.5 | 125 | 12.50 | 750 |
| GPT-5.4 | 62.50 | 6.25 | 375 |
| GPT-5.4-mini | 18.75 | 1.875 | 113 |
| GPT-5.3-Codex | 43.75 | 4.375 | 350 |

(Codex pricing page, https://developers.openai.com/codex/pricing.)

**Credit → USD conversion: 1 credit ≈ $0.04 (i.e. 25 credits = $1).** This is derived by cross-referencing the Codex credit rate card against standard API token pricing, and it is internally consistent across all three GPT-5.x tiers:

| Model | Input (USD/1M, API) | Input (credits/1M, Codex) | Implied $/credit |
|-------|---------------------|---------------------------|------------------|
| GPT-5.5 | $5.00 | 125 | $0.040 |
| GPT-5.4 | $2.50 | 62.50 | $0.040 |
| GPT-5.4-mini | $0.75 | 18.75 | $0.040 |

(API token prices per https://developers.openai.com/api/docs/pricing; Codex credit rates per https://developers.openai.com/codex/pricing. Full USD-per-1M-token card — GPT-5.5: $5.00 in / $0.50 cached / $30.00 out; GPT-5.4: $2.50 / $0.25 / $15.00; GPT-5.4-mini: $0.75 / $0.075 / $4.50.)

- GPT-5.5 *"usage averages 5–45 credits per message."*
- **Rate limits:** on the ChatGPT track, enforced as the per-5-hour message windows above; on the API track, standard API rate limits / org tier apply. **[unverified: no Codex-SDK-specific rate-limit table found; SDK requests count against whichever account's limits the chosen auth maps to.]**
- **[checked 2026-06-08: the explicit dollar-per-credit figure is not published on any directly fetchable primary page — the Codex rate-card help-center article (help.openai.com/en/articles/20001106-codex-rate-card, and the help-lb mirror) returned HTTP 403. The $0.04/credit conversion above is *derived* from two primary OpenAI pages (Codex pricing credit rates × API token USD prices), which agree exactly across all three tiers; treat as high-confidence derived, not a verbatim OpenAI statement.]**

> Note: the "lockstep CLI version" requirement (the SDK pins a matching `codex` CLI runtime) is a **versioning/compatibility** constraint, not a cost mechanism — it does not change the billing model.

## Compliance & certifications

- **SOC 2 Type 2:** OpenAI holds an independent SOC 2 Type 2 examination covering the **Security, Availability, Confidentiality, and Privacy** Trust Services Criteria for the **API Platform, ChatGPT Enterprise, ChatGPT Edu, and ChatGPT Team**. Report period confirmed 2026-06-08 via the OpenAI Trust Portal: **2025-01-01 → 2025-06-30** (https://trust.openai.com/).
- ISO certifications confirmed on the Trust Portal (2026-06-08): **ISO/IEC 27001:2022**, **ISO/IEC 27017:2015**, **ISO/IEC 27018:2019**, **ISO/IEC 27701:2019**, and **ISO/IEC 42001:2023** (AI management system). These cover the OpenAI API, ChatGPT Enterprise, and ChatGPT Edu.
- **HIPAA / BAA:** OpenAI offers a **Business Associate Agreement (BAA)** to qualifying API and ChatGPT for Healthcare customers to support HIPAA compliance.
- **GDPR / DPA:** OpenAI offers a **Data Processing Addendum (DPA)** and supports compliance with GDPR, CCPA, HIPAA, and FERPA.
- **Trust Portal:** `https://trust.openai.com` hosts compliance documentation and security/privacy answers.
- These cover the **underlying API/ChatGPT business services** that Codex runs on. **[checked 2026-06-08: confirmed there is no separate "Codex SDK" certification scope on the Trust Portal; the SOC 2 / ISO scope is stated as API Platform + ChatGPT Enterprise/Edu/Team, and Codex coverage is purely inherited from that scope — OpenAI does not name Codex in the certification scope.]**

## Codex-specific notes

- **The SDK wraps the local CLI.** TypeScript SDK: *"wraps the `codex` CLI from `@openai/codex`. It spawns the CLI and exchanges JSONL events over stdin/stdout."* The Python SDK *"controls the local Codex app-server over JSON-RPC"* (requires Python 3.10+) and ships a pinned Codex CLI runtime. TS SDK requires Node.js 18+.
- **Auth/billing default differs between the two SDKs (corrected 2026-06-08).** The earlier note that "the SDK (TypeScript) is documented to use API key authentication by default" is only partly right and does not generalize to Python:
  - **TypeScript SDK** — the SDK *"injects its required variables (such as `CODEX_API_KEY`)"* into the spawned CLI environment, so API-key auth is the expected/default path for programmatic SDK use (consistent with the TL;DR). Source: TS SDK README, https://github.com/openai/codex/blob/main/sdk/typescript/README.md.
  - **Python SDK** — does **not** default to a fresh API key. It *"reuses your existing Codex authentication when one is already available"* (i.e. it can ride on a prior Sign-in-with-ChatGPT or API-key CLI session), and exposes an explicit `codex.login_api_key("sk-...")` for API-key login. So the Python SDK's effective auth/billing posture depends on whatever CLI session already exists, rather than defaulting to API-key like the TS path. Source: Python SDK README, https://github.com/openai/codex/blob/main/sdk/python/README.md.
  - Practical implication: the "auth determines the entire privacy/billing posture" rule still holds, but for Python you must check the *inherited* session, not assume the API track.
- **What context is transmitted per turn — not itemized by any primary doc (checked 2026-06-08).** The TS SDK README documents only the explicit, user-supplied inputs that flow to the model: the `run()` text prompt, images (passed to the CLI via `--image`), the working directory (Codex runs in the cwd by default), and `config` overrides. It does **not** enumerate the implicit context the CLI assembles (file slices, command/tool output, repo metadata) before sending it to the model. Secondary analyses (Milvus AI reference) state Codex CLI *"runs entirely on your machine and keeps your source code in your local environment by default,"* sending *"only the specific context and prompts necessary for the task,"* not the whole codebase — but this "only necessary context" framing remains a **secondary** characterization. **[checked 2026-06-08: no primary OpenAI doc itemizes the exact per-turn context payload; the sandbox/security docs confirm local execution and network-gating but stop short of listing transmitted context fields.]** Whatever context is sent goes to OpenAI's model endpoints and is then subject to the API/ChatGPT data terms above.
- **Sandbox = execution boundary, not a data-transmission guarantee.** Codex CLI runs commands inside an OS-native sandbox (macOS Seatbelt, Linux bubblewrap, Windows Sandbox) with **no network access** and **writes limited to the active workspace** by default; it *"asks before using the internet or going beyond the workspace boundary."* This restricts what Codex can *do* locally; it does not by itself stop model-bound prompt context from leaving the machine.
- **`.gitignore` handling (CLI):** when files are referenced with `@`, files listed in `.gitignore` are excluded from model context; however, `.gitignore`d files can still be **read locally** via `rg`/`cat`/workspace searches and their contents may then surface in responses. **[secondary source; confirm against current Codex CLI docs.]**
- **Auth determines the entire privacy/billing posture.** This is the single most important Codex-specific fact: API key vs Sign-in-with-ChatGPT changes retention, residency, training-default governance, and billing simultaneously. Some ChatGPT-workspace/cloud features are *"limited or unavailable"* under API-key auth.

## Open questions / unverified

- **Credit → USD conversion — RESOLVED (derived, high confidence).** 1 credit = **$0.04** (25 credits = $1), derived from primary Codex credit rates × primary API token USD prices, internally consistent across GPT-5.5 / 5.4 / 5.4-mini. **[checked 2026-06-08: the Codex rate-card help-center page (and its help-lb mirror) still return HTTP 403, so no single primary page states the dollar figure verbatim; the value is derived from two fetchable primary pricing pages.]**
- **Explicit Codex-SDK-named ZDR / residency / certification — RESOLVED (none; pure inheritance).** Confirmed 2026-06-08 that OpenAI publishes no Codex-named ZDR, residency, or certification scope; all three are inherited from the API Platform / ChatGPT Enterprise scope (Trust Portal SOC2/ISO scope lists API Platform + ChatGPT Enterprise/Edu/Team, not Codex).
- **Consumer ChatGPT training opt-out — RESOLVED (mechanism), partial on verbatim text.** Opt-out toggle is **Settings → Data Controls → "Improve the model for everyone"**; off = new chats not used for training, with a feedback (thumbs) caveat. **[checked 2026-06-08: toggle name/mechanism confirmed via help-center/policy snippets; the live consumer-privacy and "how your data is used" pages 403'd to direct fetch so the exact verbatim policy sentence could not be quoted.]**
- **SOC 2 report window — RESOLVED.** Confirmed via Trust Portal (https://trust.openai.com/) on 2026-06-08: **2025-01-01 → 2025-06-30**, Security/Availability/Confidentiality/Privacy, for API Platform + ChatGPT Enterprise/Edu/Team.
- **Per-turn transmitted context — STILL OPEN (genuinely unfindable in primary docs).** The TS SDK README lists only explicit inputs (prompt text, `--image`, cwd, `config`); no primary OpenAI doc itemizes the implicit per-turn payload (file slices, command/tool output, repo metadata). The "only necessary context" framing remains secondary. **[unverified — no primary itemization exists (checked 2026-06-08).]**
- **Python vs TypeScript SDK auth/billing default — RESOLVED (they differ).** TS SDK injects `CODEX_API_KEY` (API-track default); Python SDK *reuses existing Codex CLI auth* and only uses an API key via explicit `login_api_key(...)`, so its track is inherited from the prior session, not API-key-by-default. Confirmed 2026-06-08 via the two SDK READMEs on github.com/openai/codex.

## Sources

Primary (OpenAI):
- Codex pricing — https://developers.openai.com/codex/pricing
- Codex authentication — https://developers.openai.com/codex/auth
- Codex SDK — https://developers.openai.com/codex/sdk
- Codex sandboxing — https://developers.openai.com/codex/concepts/sandboxing
- Codex security — https://developers.openai.com/codex/security
- Codex CLI — https://developers.openai.com/codex/cli
- API data controls ("Your data") — https://developers.openai.com/api/docs/guides/your-data
- API pricing — https://developers.openai.com/api/docs/pricing
- Enterprise privacy — https://openai.com/enterprise-privacy/
- Business data privacy/security/compliance — https://openai.com/business-data/
- Security and privacy at OpenAI — https://openai.com/security-and-privacy/
- Business Terms (May 2025) — https://openai.com/policies/may-2025-business-terms/
- Service terms — https://openai.com/policies/service-terms/
- Trust Portal — https://trust.openai.com/
- Codex rate card (help center, returned 403 again 2026-06-08; help-lb mirror also 403) — https://help.openai.com/en/articles/20001106-codex-rate-card
- Codex SDK TypeScript README (GitHub) — https://github.com/openai/codex/blob/main/sdk/typescript/README.md
- Codex SDK Python README (GitHub) — https://github.com/openai/codex/blob/main/sdk/python/README.md
- Codex Python SDK source dir (GitHub) — https://github.com/openai/codex/tree/main/sdk/python
- `@openai/codex-sdk` (npm) — https://www.npmjs.com/package/@openai/codex-sdk
- Consumer privacy / training opt-out (returned 403 to direct fetch 2026-06-08) — https://openai.com/consumer-privacy/ ; https://openai.com/policies/how-your-data-is-used-to-improve-model-performance/
- Data Controls FAQ (help center, 403 to direct fetch 2026-06-08) — https://help.openai.com/en/articles/7730893-data-controls-faq

Secondary / community (used only for framing, flagged inline):
- Milvus AI reference — Is Codex CLI secure / how is data handled — https://milvus.io/ai-quick-reference/is-codex-cli-secure-and-how-is-my-code-or-data-handled-during-execution
- eesel AI — Codex pricing 2026 — https://www.eesel.ai/blog/openai-codex-pricing
- UI Bakery — Codex pricing 2026 — https://uibakery.io/blog/openai-codex-pricing
- Meetily — OpenAI data retention 2026 — https://meetily.ai/llm-privacy/openai
