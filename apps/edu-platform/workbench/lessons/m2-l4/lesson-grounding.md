# Lesson Grounding: m2-l4 — Implementacja z AI: SRS jako trudniejszy stream po CRUD

## Scope

- Lesson source: `lessons/m2-l4/lesson-spec.md` (significantly expanded) plus schema slot `m2-l4`.
- Neighbor boundaries: m2-l2 owns first CRUD/generation stream and basic plan/implement loop; m2-l3 owns implementation review after code exists; m2-l5 owns parallel execution; m2-l1 owns roadmap and stream selection. SRS theory and a full SRS library survey remain out of scope.
- Relevant prework: [3.3] context lifecycle, [3.2] prompt/plan as contract, [1.2] agent/harness, [4.2] real business logic beyond empty CRUD.
- Research posture: deep. The expanded spec introduces three new technical areas that did not exist in the prior grounding pass: (1) the internal vs external research split, (2) a concrete external toolkit (exa.ai for AI-native search, Context7 for live library docs), and (3) an "agent-friendly docs" pattern (Cloudflare markdown-for-agents, `llms.txt`, `/md` endpoints). It also commits to SRS as the demo branch, which requires at least one concrete TypeScript SRS library candidate.

## Claims To Support

- "Web/retrieval-backed research is safer than relying on model memory for current tool, library, or ecosystem decisions." — supports SRS library research, exa, Context7. (already grounded)
- "Retrieval improves factuality but does not replace evaluation." — protects against naive web-data trust. (already grounded)
- "Cognitive bias and framing effects are real in software work; problem formulation shapes solutions." — supports `/10x-frame` and silver-bullet check. (already grounded)
- "No single tool is a silver bullet." — supports warning against treating any one skill or library as universal. (already grounded)
- "Law of the instrument / golden hammer is a named anti-pattern." — supports "młotek na każdy problem" language. (already grounded)
- **New:** "AI-native search uses neural embeddings rather than keyword matching and is purpose-built for agent retrieval." — supports the exa.ai demo and the framing of external research as something other than 'paste a question into ChatGPT.'
- **New:** "Agentic search is a competitive category with several credible providers (Brave, Firecrawl, Exa, Tavily, Perplexity, Parallel, SerpAPI); top contenders are statistically indistinguishable overall, but per-category performance diverges meaningfully." — supports framing exa as *an* option in a category rather than "the" AI search engine.
- **New:** "On the Technical Documentation query category specifically, Exa achieved the highest quality score in the AIMultiple May 2026 benchmark of 8 agentic search APIs." — supports the lesson's choice of Exa for the SRS-library research demo (a textbook technical-documentation query).
- **New:** "Library documentation pulled into an agent context window by ID-based lookup reduces hallucination relative to relying on training data." — supports Context7 as live docs.
- **New:** "Markdown rendering of documentation is materially better for LLM consumption than raw HTML." — supports the `markdown-for-agents` / `llms.txt` / `/md` endpoint pattern as an evidence quality signal.
- **New:** "`llms.txt` is a real but unevenly adopted convention; presence is a positive signal, absence is the norm." — protects against suggesting agent-friendly docs are universal.
- **New:** "FSRS is a modern open-source spaced-repetition algorithm with a stable TypeScript implementation (`ts-fsrs`)." — supports SRS as a realistic demo branch with a concrete library candidate without making the lesson into an SRS-library survey.

## Strong Sources

### OpenAI — WebGPT: Improving factual accuracy through web browsing

- URL: https://openai.com/index/webgpt/
- Type: paper
- Author/publisher: OpenAI
- Checked: 2026-05-18
- Supports:
  - Language models can hallucinate obscure real-world knowledge.
  - Browser-like tools let a model search, navigate, collect passages, and cite sources.
  - Web/tools improve factuality but unfamiliar circumstances remain challenging.
- Use in lesson:
  - Ground the principle that SRS library selection should consult current external sources, not just model memory.
  - Use as caution that web research improves grounding but still needs human/agent evaluation.
- Confidence: high
- Notes:
  - Older, foundational. Use for the principle, not for current product behavior.

### Lewis et al. — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks

- URL: https://arxiv.org/abs/2005.11401
- Type: paper
- Author/publisher: Patrick Lewis et al., NeurIPS 2020
- Checked: 2026-05-18
- Supports:
  - Retrieval-augmented models combine parametric memory with retrieved non-parametric memory.
  - RAG produced more specific, diverse, and factual language than a parametric-only baseline on evaluated tasks.
- Use in lesson:
  - Background for the "model memory vs retrieved evidence" mental model that underpins both exa.ai and Context7.
- Confidence: high
- Notes:
  - Keep one paragraph maximum. The lesson is not a RAG lecture.

### Tversky & Kahneman — The Framing of Decisions and the Psychology of Choice

- URL: https://psych.hanover.edu/classes/Cognition/Papers/tversky81.pdf
- Type: paper
- Author/publisher: Amos Tversky and Daniel Kahneman, Science (1981)
- Checked: 2026-05-18
- Supports:
  - The same decision problem framed differently can produce different choices.
  - A decision frame is shaped partly by problem formulation and partly by habits/norms of the decision-maker.
- Use in lesson:
  - Conceptual ground for `/10x-frame` as a tool that separates observation from proposed cause/solution.
  - Use for the SRS contrast: "which library should we use?" vs "what contract must the review loop satisfy?"
- Confidence: high
- Notes:
  - Avoid deep psychology exposition.

### Mohanani et al. — Cognitive Biases in Software Engineering: A Systematic Mapping Study

- URL: https://arxiv.org/abs/1707.03869
- Type: paper
- Author/publisher: Mohanani, Salman, Turhan et al. / IEEE TSE preprint
- Checked: 2026-05-18
- Supports:
  - Cognitive bias has been studied across many SE activities.
  - Identified effects exist; mitigation techniques remain underdeveloped.
- Use in lesson:
  - Justify process and tooling as debiasing scaffolding rather than guarantees.
- Confidence: high
- Notes:
  - Keep broad. Do not claim a specific bias always occurs in SRS planning.

### Salman, Turhan & Vegas — Confirmation bias in functional software testing

- URL: https://link.springer.com/article/10.1007/s10664-018-9668-8
- Type: paper
- Author/publisher: Empirical Software Engineering / Springer
- Checked: 2026-05-18
- Supports:
  - Confirmation bias in SE manifests as designing tests that confirm expected behavior rather than break the code.
  - Time pressure may exacerbate confirmation-bias effects.
- Use in lesson:
  - Engineering evidence for "we come to a plan with a pet theory and look for confirming evidence."
  - Useful when warning that course-project speed pressure can push learners toward confirming the first plausible SRS library.
- Confidence: high
- Notes:
  - The study is about testing, not architecture planning. Use as analogy and SE evidence, not direct proof about SRS library selection.

### Brooks — No Silver Bullet: Essence and Accidents of Software Engineering

- URL: https://www.cin.ufpe.br/~phmb/ip/MaterialDeEnsino/BrooksNoSilverBullet.html
- Type: paper
- Author/publisher: Frederick P. Brooks Jr.
- Checked: 2026-05-18
- Supports:
  - No single technology or management technique promises an order-of-magnitude improvement by itself.
  - Progress comes from disciplined, stepwise use of multiple improvements.
- Use in lesson:
  - Ground "no silver bullet" framing: `/10x-research`, `/10x-frame`, exa, Context7, and any SRS library are tools, not magic.
- Confidence: medium
- Notes:
  - OCR copy. Use as background, not the only source for a formal quote.

### Law of the Instrument / Golden Hammer

- URL: https://en.wikipedia.org/wiki/Law_of_the_instrument
- Type: technical-post
- Author/publisher: Wikipedia summary (Kaplan / Maslow / golden hammer tradition)
- Checked: 2026-05-18
- Supports:
  - Over-reliance on a familiar tool is a named cognitive bias / anti-pattern.
  - In software, "golden hammer" describes applying a familiar technology to every problem.
- Use in lesson:
  - Practitioner-language support for "młotek na każdy problem."
- Confidence: medium
- Notes:
  - Wikipedia. Use as language/framing support, not a primary scientific source.

### 10x-toolkit skill sources

- URL: /Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/
- Type: internal-course-material
- Author/publisher: 10xDevs toolkit
- Checked: 2026-05-18
- Supports:
  - `/10x-frame` triggers when observation and stated cause/proposed solution are collapsed; it should be skipped for clear mechanical changes.
  - `/10x-research` orchestrates parallel sub-agents for codebase research.
  - `/10x-plan` can consume research/frame artifacts but does not require them.
  - `/10x-implement` handles mismatch with explicit adapt / skip / stop-and-replan paths.
  - `/10x-plan-review` is positioned as a pre-implementation gate.
- Use in lesson:
  - Canonical source for when frame is escalation vs default, what `/10x-research` actually does (and does not), and how drift handling is structured.
- Confidence: high
- Notes:
  - Confirm CLI delivery names (`10x get m2l4`, etc.) against `course-content` wiring before learner-facing prose.

### Exa — Search API and Exa 2.0 (Fast / Auto / Deep)

- URL: https://exa.ai/ (product) and https://exa.ai/blog/exa-api-2-0 (2.0 announcement)
- Type: official-docs
- Author/publisher: Exa
- Checked: 2026-05-18
- Supports:
  - Exa positions itself explicitly as an AI-native / agent-facing search API, contrasting with keyword search.
  - Retrieval is neural/embedding-based: queries are encoded into vectors and matched against a vector index of web documents.
  - The Exa 2.0 surface (Fast / Auto / Deep) is built around agent latency/quality tradeoffs (sub-200ms to multi-second deep search), with content extraction and an Answer endpoint that produces direct or cited responses.
  - Adoption signal: Cursor's `@web` and Notion AI's news search are documented integrations.
- Use in lesson:
  - Ground exa.ai as the demo example of AI-native search.
  - Use to explain the difference between keyword and embedding-based search at the level the lesson needs.
  - Use Exa 2.0 endpoints (Fast/Auto/Deep) as the practical-knob model that turns "AI search" into an evidence-gathering decision rather than a single button.
- Confidence: high
- Notes:
  - Pricing and exact latency numbers change. Verify free-tier and per-1k pricing again at draft/video time. Do not put numbers into schema; keep them in the brief or the lesson if useful.

### AIMultiple — Agentic Search APIs benchmark (May 2026)

- URL: https://aimultiple.com/agentic-search
- Type: technical-post
- Author/publisher: Ekrem Sarı (AI Researcher) and Hazal Şimşek (Industry Analyst), AIMultiple. Last updated 2026-05-13.
- Checked: 2026-05-22
- Supports:
  - Agentic search is positioned as a distinct category from traditional keyword search and bare RAG: agents interpret intent, plan multi-step retrieval, call tools autonomously, and synthesize answers.
  - Independent benchmark of 8 commercial agentic-search APIs (Brave Search, Firecrawl, Exa AI, Parallel Search Pro/Base, Tavily, Perplexity, SerpAPI) over 100 real-world AI/LLM queries and 4,000 retrieved results, with GPT-5.2 as LLM judge, paired-bootstrap difference tests (10,000 resamples), and ~10% human verification of judgments.
  - Headline Agent Score (Mean Relevant × Quality, 1–5 scale): Brave 14.89, Firecrawl 14.58, Exa AI 14.39, Parallel Search Pro 14.21, Tavily 13.67, Parallel Search Base 13.5, Perplexity 12.96, SerpAPI 12.28. Top 4 are statistically indistinguishable overall; Brave is the only API that reliably outperformed Tavily.
  - Latency spans ~20× across the field: Brave 669 ms (fastest), Tavily 998 ms, Perplexity ~11 s, Parallel Search Pro ~13.6 s.
  - Queries were drawn from six categories (24 Research, 20 Factual Verification, 20 Technical Documentation, 10 Real-time Events, 16 Comparative, 10 Tool Discovery). **Exa achieved the highest quality score on the Technical Documentation category** — the exact category that maps to "research a TypeScript SRS library and verify its API."
  - Tool-by-tool color: Brave (own index, privacy-focused, fastest), Firecrawl (full-page crawling, best for deep content retrieval), Exa (semantic/embedding search, document discovery and relevance), Tavily (AI-agent integration, free tier 1k credits/mo), Perplexity (synthesis-oriented but slow), Parallel (high capacity but very slow), SerpAPI (unified search-engine access, weaker on real-time/research).
- Use in lesson:
  - Frame "AI-native search" as a category with several credible representatives instead of "Exa or nothing." Name at least Brave, Firecrawl, Exa, Tavily, Perplexity in the landscape paragraph.
  - Justify the lesson's choice of Exa specifically by its top-of-category result on Technical Documentation — the kursant's actual task (read SRS-library docs, verify API surface).
  - Reinforce "no silver bullet": top 4 are tied within statistical noise, so the right choice depends on the dominant query category and latency budget — not on a single ranking number.
- Confidence: medium
- Notes:
  - The benchmark is methodologically transparent (paired bootstrap, 10k resamples, 10% human verification, ~3.5h execution), but it is still a single analyst-firm comparison with commercial framing. Treat as a strong practitioner signal, not as a peer-reviewed source.
  - Snapshot from December 2024 – January 2025 queries against a December 2025 API surface, page last updated 2026-05-13. Re-check before publishing if Brave/Firecrawl/Exa pricing or modes change materially.
  - Pair with the "Cursor and Notion use Exa under the hood" practitioner signal: adoption evidence + benchmark evidence point the same way.

### Cloudflare — Markdown for Agents

- URL: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/ (reference) and https://developers.cloudflare.com/changelog/post/2026-02-12-markdown-for-agents/ (announcement, 2026-02-12)
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-05-18
- Supports:
  - Markdown is increasingly the de facto exchange format for agent-facing content.
  - Cloudflare's network can convert HTML to Markdown on the fly when the client sends `Accept: text/markdown`; the response includes an `x-markdown-tokens` header so an agent can budget context.
  - Markdown output strips non-content chrome (nav, footers, scripts, styles) and exposes YAML frontmatter from page meta tags.
- Use in lesson:
  - Canonical "publisher-side" example of agent-friendly docs.
  - Ground the evidence-quality signal: a project that ships Markdown for Agents (or `/md` endpoints) is one where the lesson's external research can stay clean.
- Confidence: high
- Notes:
  - Use the changelog URL when introducing it ("uruchomione 2026-02-12") and the reference URL for the technical detail.

### Cloudflare developers — llms.txt index

- URL: https://developers.cloudflare.com/llms.txt
- Type: official-docs
- Author/publisher: Cloudflare
- Checked: 2026-05-18
- Supports:
  - Cloudflare ships a top-level `llms.txt` plus per-product `llms.txt` and `llms-full.txt` as a concrete adoption example.
- Use in lesson:
  - Show one real `llms.txt` rather than describing it in the abstract.
- Confidence: high
- Notes:
  - Pair with the llmstxt.org spec link below.

### llms.txt specification

- URL: https://llmstxt.org/
- Type: technical-post
- Author/publisher: Jeremy Howard (Answer.AI), proposal 2024-09-03
- Checked: 2026-05-18
- Supports:
  - `llms.txt` is a Markdown file at the root of a domain (`https://example.com/llms.txt`) listing the site's most important content with one-line descriptions, intended for LLM inference rather than crawling/training.
  - It is explicitly not a crawl directive (unlike `robots.txt`) and not a comprehensive index (unlike a sitemap).
- Use in lesson:
  - Ground `llms.txt` as a real convention authored by Jeremy Howard, with a clear scope.
- Confidence: high
- Notes:
  - Adoption is uneven (see practitioner signal below). Lesson must present it as a positive signal where present, not as a gate.

### Context7 — MCP server for live library docs

- URL: https://github.com/upstash/context7
- Type: repo
- Author/publisher: Upstash
- Checked: 2026-05-18
- Supports:
  - Context7 is an MCP server that injects up-to-date, version-specific library documentation into the agent's context.
  - The canonical workflow is two-step: `resolve-library-id` to map a library name (e.g. `next.js`) to a Context7-compatible ID (e.g. `/vercel/next.js`), then `get-library-docs` (renamed to `query-docs` in newer revisions of the server) to retrieve scoped chunks under a token budget.
  - MIT license, large community uptake (55k+ stars at check time).
- Use in lesson:
  - Canonical source for the `resolve-library-id` → `get-library-docs` flow as the recommended pattern for "stop guessing the API."
- Confidence: high
- Notes:
  - There is a naming discrepancy in flight: older docs (and many tutorials) use `get-library-docs`; the current GitHub README shows `query-docs`. Pick one explicitly at draft time and verify against the version the kursant will run from the course environment (MCP via `mcp.context7.com/mcp` or the `npx ctx7 setup` flow).

### ts-fsrs — TypeScript FSRS scheduler

- URL: https://github.com/open-spaced-repetition/ts-fsrs (repo), https://www.npmjs.com/package/ts-fsrs (npm), https://open-spaced-repetition.github.io/ts-fsrs/ (docs)
- Type: repo
- Author/publisher: Open Spaced Repetition (community)
- Checked: 2026-05-18
- Supports:
  - `ts-fsrs` is a TypeScript implementation of FSRS, with ESM/CommonJS/UMD builds. Latest 5.x line at check time; requires Node 20+.
  - Surface includes `createEmptyCard`, `fsrs()`, `Rating`, `scheduler.repeat()` (preview all four outcomes), `scheduler.next()` (apply a rating). The companion `@open-spaced-repetition/binding` package handles parameter optimization.
  - MIT license.
- Use in lesson:
  - Concrete SRS library candidate for the demo; supports claims about `ReviewState`, rating scale, and "library shape determines contract."
- Confidence: high
- Notes:
  - This is the most natural primary candidate. Keep alternatives (e.g. `simple-ts-fsrs`, `@squeakyrobot/fsrs`) as a one-line aside; do not run a survey.

### FSRS algorithm — algorithm background

- URL: https://faqs.ankiweb.net/what-spaced-repetition-algorithm and https://github.com/open-spaced-repetition/fsrs4anki
- Type: technical-post (Anki FAQ) / repo
- Author/publisher: Anki maintainers / Open Spaced Repetition
- Checked: 2026-05-18
- Supports:
  - FSRS models per-card memory as Difficulty / Stability / Retrievability (DSR), trained on large review logs.
  - FSRS targets a configurable desired retention; SM-2 instead multiplies intervals by a per-card "ease factor."
  - FSRS has been an opt-in algorithm inside Anki since v23.10 (Nov 2023); SM-2 remains the default.
- Use in lesson:
  - One-paragraph background so the kursant understands that `ts-fsrs` is not "another SRS lib" but a specific algorithm family that imposes a particular contract on the application (rating labels Again/Hard/Good/Easy, a DSR-shaped state, a target-retention parameter).
- Confidence: high
- Notes:
  - Do not turn this into an algorithm lecture. Two or three sentences plus a `Materiały dodatkowe` link.

## Practitioner Signals

### "Młotek na każdy problem" as language for tool overuse

- URL: https://en.wikipedia.org/wiki/Law_of_the_instrument
- Type: practitioner-signal
- Signal:
  - The hammer/nail shorthand maps cleanly onto "I learned one skill, so every task becomes that skill."
- Useful language:
  - "Jeśli przychodzisz do SRS z gotowym młotkiem, `/10x-frame` sprawdza, czy w ogóle masz gwóźdź."
- Risk:
  - Can become a cute metaphor instead of an engineering point. Tie it immediately to a roadmap decision.
- Confidence: medium

### `llms.txt` is a real but unevenly adopted convention

- URL: https://searchengineland.com/llms-txt-proposed-standard-453676, https://ppc.land/llms-txt-adoption-stalls-as-major-ai-platforms-ignore-proposed-standard/
- Type: community-discussion
- Signal:
  - Adopters include Anthropic, Stripe, Cursor, Cloudflare, Vercel, Mintlify, Supabase, LangGraph (and Mintlify rolled it out to all hosted docs in Nov 2024).
  - Major crawler-side adoption (OpenAI, Google, Anthropic crawlers) is weak; the convention is used more by agent runtimes (Cursor, Continue, Cline) than by training pipelines.
  - SEO/marketing discourse around `llms.txt` tends to overclaim ranking impact; that is not what the spec is for.
- Useful language:
  - Frame `llms.txt` as "ślad, że projekt zauważył agenta," not as "wymóg."
- Risk:
  - Do not let the lesson cite the SEO-side discourse as evidence of factual benefit. The point is operational (agent retrieval), not marketing.
- Confidence: medium

### Cursor and Notion using Exa under the hood

- URL: https://aihackers.net/posts/exa-search-ai-native-engine-2026/, https://exa.ai/
- Type: practitioner-signal
- Signal:
  - Mainstream agent surfaces (Cursor's `@web`, Notion AI news) standardize on Exa. Useful for normalizing exa as "not a fringe tool."
- Useful language:
  - "To nie jest egzotyczny dobór — Cursor pod `@web` używa właśnie Exy."
- Risk:
  - Vendor coverage shifts; avoid stating exclusivity ("only X uses Exa").
- Confidence: medium

### AIMultiple benchmark — Technical Documentation category top result

- URL: https://aimultiple.com/agentic-search
- Type: practitioner-signal
- Signal:
  - In an independent benchmark of 8 agentic-search APIs, Exa achieved the highest quality score on the Technical Documentation query category — exactly the use case the lesson demos (research a TypeScript SRS library, verify API surface).
  - Top 4 APIs overall (Brave, Firecrawl, Exa, Parallel Pro) are statistically indistinguishable on the headline Agent Score, so the choice between them depends on what query types you run most often and on your latency budget.
- Useful language:
  - "Wybór konkretnego dostawcy nie jest oczywisty — czwórka liderów jest statystycznie nie do odróżnienia w ogólnym rankingu. Decyduje to, jakie zapytania zadajesz najczęściej. W kategorii *Technical Documentation* (czyli dokładnie nasz przypadek z `ts-fsrs`) Exa wypadła najlepiej."
- Risk:
  - One benchmark, one analyst firm. Do not present this as "Exa is the best search engine."
  - Benchmark data is a snapshot — vendor APIs and pricing evolve quickly.
- Confidence: medium

## Examples Worth Using

- **SRS framing contrast.**
  - Bad frame: "Which SRS library should we install?"
  - Better frame: "What contract must our review loop satisfy: due selection, rating labels, review-state persistence, edit-vs-reset behavior?"
  - Then research libraries against that contract.

- **Silver-bullet failure.**
  - Learner lands on `ts-fsrs` and immediately wants to reshape product UX to match the library's defaults (e.g. forcing the Again/Hard/Good/Easy four-button UI before the plan asks for it).
  - `/10x-frame` re-asks whether the real problem is "choose library" or "preserve the product's learning loop while adopting a library as-is."

- **Internal vs external research split.**
  - `/10x-research srs-review-session` returns: existing time-based utilities, the current persistence pattern for `Flashcard`, the conventions around state machines. It does *not* return "use `ts-fsrs`."
  - The same prompt run as external research (exa for current SRS-library landscape, Context7 to pull `ts-fsrs` docs by ID) returns the library candidate and current API surface.
  - The lesson shows: both halves go into `plan-brief.md`. Either half alone would have produced a weaker plan.

- **Agent-friendly docs as evidence-quality signal.**
  - Compare requesting `https://developers.cloudflare.com/workers/runtime-apis/...` with `Accept: text/markdown` (Cloudflare returns a clean Markdown body and `x-markdown-tokens` header) vs scraping the HTML of a random SRS-library blog. The lesson uses the contrast, not a tutorial on content negotiation.

- **Drift scenario.**
  - The plan assumed a 1–5 rating scale; `ts-fsrs` exposes `Rating.Again | Hard | Good | Easy`. Small drift, adapt in place — but re-check the UI copy and any persisted scale.
  - Contrast: the plan assumed cards are deleted on user request without any review-state implications; `ts-fsrs` review state is tightly coupled to the card identity. This is a contractual drift — stop, return to research, possibly to `/10x-frame`.

## Claims To Avoid Or Soften

- "Web research eliminates hallucination." — soften: web research reduces it conditional on evaluation.
- "Cognitive bias explains every bad technical decision." — bias is a lens, not a diagnosis.
- "Every difficult slice requires `/10x-frame`." — in SRS the default escalation is research; frame appears when the learner arrives with a silver bullet.
- "No Silver Bullet proves AI won't improve productivity." — Brooks is about no single magical solution.
- "Agent-friendly docs are everywhere." — they are not. Most projects don't ship `llms.txt` or markdown-for-agents. Their absence is the norm; their presence is the signal.
- "Exa is the AI search engine." — exa is *an* AI-native search example; Perplexity, Tavily and others exist. Lesson picks exa as the demo, not as the canonical choice.
- "Context7 is the only way to fetch live docs." — many projects ship `/md` endpoints, `llms.txt` indexes, or simple Markdown source files; Context7 is an MCP-shaped convenience, not the only path.
- "`ts-fsrs` is the right SRS library." — it is the strongest TypeScript candidate, but the lesson grounds it as the demo, not as a universal recommendation.

## Open Verification Questions

- Which SRS library is the demo library: `ts-fsrs` (recommended), `@open-spaced-repetition/ts-fsrs` namespace explicitly, or do we present a short two-candidate shortlist? Recommendation: single primary candidate `ts-fsrs` with `simple-ts-fsrs` as a "minimal alternative" pointer.
- For the Context7 demo, which exact tool name is current at recording time: `get-library-docs` (long-standing) or `query-docs` (newer GitHub README)? Verify against the version the kursant runs from the course environment (`@przeprogramowani/10x-cli` install path) before video.
- Is the kursant's Context7 setup MCP-based (Claude Code config), CLI-based (`npx ctx7 setup`), or both? Pick one in the lesson and treat the other as a one-line reference.
- Will the lesson surface exa.ai pricing/tier (1k free / per-1k) or stay tool-agnostic about cost? Recommendation: skip exact numbers in the lesson body; mention "wolne tier" + link to pricing in `Materiały dodatkowe`.
- Confirm the public agent-friendly URLs we will use as the demo: Cloudflare `markdown-for-agents` reference page + `developers.cloudflare.com/llms.txt`. Anything from the SRS shortlist that ships a similar surface (e.g. a `/md` endpoint) is a bonus, not required.
- Drift scenario: will the recording use a real `ts-fsrs` constraint (Again/Hard/Good/Easy rating shape) or a controlled fictional mismatch? Recommendation: real `ts-fsrs` shape; it is well-suited for showing a small adapt-in-place drift.

## Schema Source Update

`workbench/lessons-schema.json` m2-l4 `groundingSources`: keep the seven existing sources, refresh `checkedAt` to `2026-05-18`, and add the new entries listed below. Also clear the two now-grounded items from `sideEffectLedger.unsupportedFacts` (SRS library API; Context7 setup), and mirror the lesson's new commitments in `newClaimsIntroduced`.

New entries to add to `groundingSources`:

- Exa.ai (official-docs, https://exa.ai/, with secondary blog/exa-api-2-0)
- AIMultiple agentic-search benchmark (technical-post, https://aimultiple.com/agentic-search, May 2026) — landscape framing + Technical Documentation category justification for Exa
- Cloudflare Markdown for Agents (official-docs, reference + 2026-02-12 changelog)
- Cloudflare `llms.txt` index (official-docs)
- llms.txt specification by Jeremy Howard (technical-post, https://llmstxt.org/)
- Context7 MCP (repo, https://github.com/upstash/context7)
- ts-fsrs TypeScript scheduler (repo, https://github.com/open-spaced-repetition/ts-fsrs)
- Anki FSRS FAQ + fsrs4anki repo (technical-post/repo) as one combined "FSRS algorithm background" source
