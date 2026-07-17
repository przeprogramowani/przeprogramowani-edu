# Lesson Grounding: m1-l1 — Od pomysłu do PRD: Metoda Sokratejska z Agentem

## Scope

- Lesson source: schema + `lessons/m1-l1/lesson-spec.md` (refreshed 2026-05-03 to two-skill scope: `/10x-shape` + `/10x-prd`)
- Neighbor boundaries (corrected 2026-05-03): `m1-l2` owns deeper toolkit, skille, metaprompting **and tech-stack selection** (m1-l2 is the first real PRD consumer — tech-stack-selector reads PRD); `m1-l3` owns **bootstrap of the project on top of PRD + selected stack**. The bootstrap chain `shape → prd → tech-stack-selector (m1-l2) → bootstrapper (m1-l3)` consumes the PRD from m1-l2 onwards.
- Relevant prework: `[4.2] Dobry i zły projekt kursowy` for MVP/project criteria; `[1.2] Chatbot vs Agent vs Harness` for the agent/harness mental model; `[3.2] Wzorce i antywzorce promptowania` for prompt-as-contract continuity.
- Research posture: standard. Most factual ground is now closed by the built-skill sources from 2026-05-03; remaining work is to keep the secondary frame sources warm and to flag remaining open decisions.

## Claims To Support

- Skill `/10x-shape` is the conversational facilitator that runs the Socratic dialog (BMAD-Facilitator stance + GSD gray-area discovery + mattpocock recommended-answer + per-FR Socratic challenge round + closing 6-element soft gate) in both greenfield and brownfield modes (auto-detected from project markers in cwd) and produces `context/foundation/shape-notes.md` — supports the lesson's Socratic-method thesis at the *mechanic* level. Evidence type: official skill source (SKILL.md).
- Skill `/10x-prd` is the document generator that consumes `shape-notes.md`, runs a 4-signal thin-input heuristic, and writes `context/foundation/prd.md` (or `prd-vN.md` on collision) against the locked schema, never inventing domain decisions — gaps go verbatim to `## Open Questions`. Supports the "hollow PRD as signal of unfinished decisions" failure mode. Evidence type: official skill source (SKILL.md).
- The PRD schema is locked: 7 frontmatter fields (`project, version, status, created, product_type, target_scale, timeline_budget`) + 11 required sections (greenfield) or 12 sections (brownfield), after the 2026-05-03 scope trim. `/10x-prd` auto-routes based on `context_type` in shape-notes.md. Tech / test plan / deploy are deliberately *out* of PRD and live downstream of stack selection. Supports the "PRD = product/business shape" framing and the spec's *spirit-not-schema* posture. Evidence type: canonical schema reference doc + /10x-prd SKILL.md.
- Workflow v2 (`context/foundation/`) is a hard prerequisite for `/10x-shape`; the skill cooperates with `/10x-init` via the harness `Skill` tool when the scaffold is missing. Supports the "minimal install + init in m1-l1" decision in the spec. Evidence type: official skill source.
- A real run of `/10x-shape → /10x-prd` (10xCards, 2026-05-03) produced a working `shape-notes.md` and PRD, validated the workflow end-to-end, and exposed the scope overreach that drove the trim. Supports the demo as an actual artifact, not a hypothetical. Evidence type: real-world transcript.
- A PRD is useful before implementation because it makes goals, assumptions, user stories, success criteria and out-of-scope decisions explicit — supports the "PRD as contract for Agent" frame at the *concept* level (not the implementation level). Evidence type: product/Agile documentation.
- A questioning workflow is a credible way to elicit requirements because requirements work depends on natural-language dialogue, assumptions and open questions — supports the Socratic premise at the *concept* level (the *mechanic* is now grounded in the skill itself). Evidence type: requirements-engineering paper.
- Agents are appropriate after the task is clear, with planning/checkpoints/tool feedback rather than blind autonomy — protects the lesson from "agent magic" overclaiming. Evidence type: official agent engineering guidance.
- Mainstream coding-agent products implement plan-before-code as a standard pattern — supports the "this isn't a 10xDevs eccentricity" frame, so the lesson can position the workflow as industry-aligned. Evidence type: official product docs.

## Strong Sources

### `/10x-shape` SKILL.md (and `references/prd-schema.md`)

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-shape/SKILL.md` (and `.../10x-shape/references/prd-schema.md`)
- Type: official-docs (canonical skill source)
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-10 (brownfield verified)
- Supports:
  - `/10x-shape` supports both greenfield and brownfield modes. Auto-detects context type from project markers in cwd (brownfield) or absence thereof (greenfield). Runs as facilitator (never generates domain content) and conforms to the locked PRD schema reference at every checkpoint write.
  - Six discovery phases: Vision & Problem → Persona & Access Control → MVP discipline → FRs+User Stories → Business Logic+Data → Product framing. Plus Socratic challenge round (4.5) and closing soft-gate (7). In brownfield mode, each phase adapts: Vision asks about current system and pain, Persona asks about existing auth and roles, MVP reframes as smallest incremental change with blast-radius awareness, FRs use `Change: new | modified | preserved` tags, Business Logic captures existing domain rules and modifications.
  - Brownfield output includes `context_type: brownfield` in frontmatter, `## Current System` section, and `## Constraints & Preserved Behavior` section. Closing soft-gate adds a 7th element: preserved behaviors explicitly named.
  - Empty-CRUD anti-pattern detection is a named mechanic with seven explicit rule shapes (recommendation, prioritization, classification, validation, scoring, workflow, calculation).
  - MVP-in-a-week scope-cost surface: longer timelines are valid when the user accepts the sustained-effort cost via an explicit `## Timeline acknowledgment` block.
  - Closing 6-element soft gate: Access Control, Data Model, Business Logic (one-sentence rule), Project artifacts, Timeline-cost ack, Non-Goals. Warns by name; allows override; records `quality_check_status: warned | accepted` in the checkpoint.
  - Schema (locked, post-2026-05-03 trim): 7 frontmatter fields + 11 required sections; tech/test/deploy are deliberately *out* of PRD.
- Use in lesson:
  - Ground every concrete mechanic the draft mentions (phases, Socratic round, empty-CRUD detection, MVP scope-cost surface, soft gate). The lesson is no longer guessing how the skill works — these are the canonical contracts.
  - When the lesson references "fazy sesji shape", use the six-phase list as named in the skill.
  - When the lesson references "soft gate", anchor to the 6 elements above (not the older 8-element pre-trim set).
  - Lesson should describe the mechanism faithfully but stay at the *spirit* level for schema specifics (per spec decision).
- Confidence: high
- Notes:
  - The skill enforces "universal language only" — no 10xDevs / cohort references in shipped output. The lesson voice can frame the example as a course project; it must not claim the skill is cohort-aware.
  - Schema reference doc explicitly states section names are load-bearing for downstream parsers — useful framing if the lesson ever needs to defend the templated shape.

### `/10x-prd` SKILL.md

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-prd/SKILL.md`
- Type: official-docs (canonical skill source)
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-03
- Supports:
  - `/10x-prd` is a document generator, not a discovery facilitator — it never invents domain decisions. Missing input lands verbatim in `## Open Questions`.
  - Input ingestion defaults to `context/foundation/shape-notes.md`; explicit path argument overrides.
  - Thin-input heuristic: 4 signals (frontmatter `checkpoint:` block, FR-NNN format, Given/When/Then user stories, one-sentence business rule). Score < 2 triggers a thin-input warning that names each missing signal by consequence.
  - Pre-write self-review: 11 sections + 7 frontmatter keys validated against the schema; mismatches abort the write rather than silently patch.
  - Collision handling on existing `prd.md`: defaults to versioned save (`prd-vN.md`); overwrite and abort are explicit alternatives.
- Use in lesson:
  - Ground the "hollow PRD as signal of unfinished decisions" failure mode — the thin-input warning is a real, named mechanic, not a metaphor.
  - Use the "never invents" guardrail to support the lesson's claim that gaps are *the user's* unfinished decisions, not the Agent's deficiency.
  - The collision flow is incidental for a beginner lesson — mention only if the demo runs the skill twice, otherwise skip.
- Confidence: high
- Notes:
  - The skill is purely a writer; do not credit any Socratic dialog or facilitation behavior to it. Misattribution was the exact bug the spec refresh removed.

### `prd-skill` change folder (change.md + frame.md + plan.md)

- URL: `/Users/admin/code/10x-toolkit/context/changes/prd-skill/{change.md,frame.md,plan.md}`
- Type: internal-course-material (design rationale; the workflow-v2 `## Notes` ledger + framing brief + implementation plan)
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-03
- Supports:
  - Two-skill split (shape + prd) is intentional, with the boundary chosen to separate facilitation (BMAD-style) from generation (schema-conformant write).
  - 2026-05-03 scope trim: PRD frontmatter shrank from 7 priors → 4 product fields; required sections shrank from 14 → 11; `## Implementation Decisions`, `## Testing Strategy`, `## Deployment & CI/CD` deferred to a future technical-roadmap skill (no change folder yet).
  - Persona-driven design: cohort context (Module 01: Agentic Environment, Lesson 1 "Od pomysłu do PRD: Metoda Sokratejska z Agentem", Lesson 3 "AI-Powered Bootstrap") shaped depth, defaults, and embedded mechanics — but the shipped skill is universal.
  - Quality bar alignment with prework [4.2]: 6 cert elements (access control, data, business logic, artifacts, test, CI/CD), MVP-in-a-week, empty-CRUD detection, one-sentence-business-logic gate.
- Use in lesson:
  - Background only — internal rationale, not learner-facing material. The lesson reads the *output* of these decisions (the skills, the schema), not the design history.
  - Useful when the lesson explains *why* tech / test / deploy are not in PRD: the trim is a deliberate scope decision, validated against a real run.
- Confidence: high
- Notes:
  - frame.md explicitly names m1-l1 by title and module — confirms this lesson sits in the persona context the skills were built for. Do not surface this in the lesson voice (universality constraint).

### 10xCards `/10x-shape` session transcript

- URL: `/Users/admin/code/10xCards/context/foundation/prd-convo-story.md`
- Type: repo / internal-course-material (real-world validation transcript)
- Author/publisher: real session run on 2026-05-03 by user (transcript captured by the skill)
- Checked: 2026-05-03
- Supports:
  - End-to-end workflow validated: `/10x-init` cooperation → `/10x-shape` six phases + Socratic round + closing gate → `/10x-prd` generation, with all mechanics firing as designed.
  - The Socratic round is not theatrical — it surfaced a real persona-too-wide flag and a real wedge-question gap (existing AI-flashcard tools), and the user's resolutions narrowed the project meaningfully.
  - Empty-CRUD detection is not a strawman — the seed idea (manually-created flashcards + AI-assisted generation) had a real domain rule (the AI extraction + human-in-the-loop accept/edit/reject), captured in business logic.
  - The trim was driven by genuine scope creep observed during Phase 6 — not a theoretical concern. PRD became architectural by accident; the trim restored product/business shape only.
- Use in lesson:
  - Treat as the *evidence* that the demo ("aplikacja do śledzenia nawyków") is grounded in a real workflow, not a marketing scenario. The lesson does not need to cite this transcript publicly, but the drafter can use its phrasing as a benchmark.
  - The session resolved exactly the kind of vague-idea pain the lesson is selling — a junior would do the equivalent on their habit-tracker idea.
- Confidence: high
- Notes:
  - This is a sibling-repo path; do not link to it from learner-facing prose. Internal evidence only.

### Atlassian — What is a Product Requirements Document?

- URL: https://www.atlassian.com/agile/product-management/requirements
- Type: technical-post
- Author/publisher: Atlassian / Dan Radigan
- Checked: 2026-05-01
- Supports:
  - Agile PRDs include assumptions, user stories, success metrics, open questions, and explicit out-of-scope items.
  - Requirements docs create shared understanding, not heavyweight ceremony.
- Use in lesson:
  - Concept-level support for "PRD as living input contract", not as the source of the lesson's specific shape (the locked schema is the source). Use sparingly — prework house voice avoids inline academic citations.
  - Strongest for the "questions / what we're not doing" framing, which maps cleanly to the skill's `## Non-Goals` and `## Open Questions`.
- Confidence: high
- Notes:
  - Not AI-agent-specific. Do not claim Atlassian endorses the AI PRD workflow.

### QUARE — towards a question-answering model for requirements elicitation

- URL: https://link.springer.com/article/10.1007/s10515-023-00386-w
- Type: paper
- Author/publisher: Calle Gallego & Zapata Jaramillo / Automated Software Engineering
- Checked: 2026-05-01
- Supports:
  - Requirements elicitation is stakeholder-centered and natural-language based.
  - Question-answering structures elicitation by surfacing actors, concepts, actions, and ambiguities.
- Use in lesson:
  - Conceptual support that "dialog sokratejski" is a credible elicitation pattern, not philosophical ornament. The *implementation* of the pattern is now grounded in `/10x-shape`.
  - Demote inline use; prefer to cite skill mechanics directly.
- Confidence: high (for the conceptual claim) / medium (as evidence for `/10x-shape` specifically — the paper is not about LLM coding agents)
- Notes:
  - Use as background framing; no need to mention by name in the lesson body.

### Anthropic — Building effective agents

- URL: https://www.anthropic.com/engineering/building-effective-agents
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-01
- Supports:
  - Agents begin from an interactive discussion; after the task is clear, they plan and operate with checkpoints.
  - Agentic systems trade cost/latency for performance and need guardrails, tool feedback, and stopping conditions.
- Use in lesson:
  - Frame `/10x-shape` as task clarification before agent execution. Useful sanity check on the lesson's failure-mode logic ("Agent zacznie konsekwentnie implementować błędne założenie" — supported by Anthropic's discussion of compounding errors under autonomy).
  - Keep autonomy claims sober: the goal is forcing precision before code, not "agent zrobi wszystko".
- Confidence: high
- Notes:
  - Deeper agent architecture details belong to m1-l2 and later lessons; cite only the task-clarification angle here.

### OpenAI Academy — Prompting fundamentals

- URL: https://openai.com/academy/prompting/
- Type: official-docs
- Author/publisher: OpenAI Academy
- Checked: 2026-05-01
- Supports:
  - Prompting is iterative and conversational.
  - Good prompts outline task, provide context, and describe desired output.
- Use in lesson:
  - Light support for the dialog-as-iteration framing. The lesson should not become a generic prompting lesson — m1-l2 and prework [3.2] own that.
- Confidence: high
- Notes:
  - General source; do not cite for tool-specific or model-specific details.

### 10xDevs internal slides — PRD before tech plan

- URL: `/Users/admin/code/przeprogramowani-sites/utils/circle-lesson-backup/10x-slides-optimized.md`
- Type: internal-course-material
- Author/publisher: Przeprogramowani
- Checked: 2026-05-01
- Supports:
  - Existing 10xDevs material framed PRD-first planning before technical implementation.
  - Prior material treated PRD files as agent-readable project context (under `.ai/`).
- Use in lesson:
  - Internal continuity: the new workflow continues a thread the cohort already saw, rather than introducing it from scratch. Do not cite slide ROI numbers as factual benchmarks.
- Confidence: medium
- Notes:
  - Path corrected from earlier grounding pass (was a stale `/Users/psmyrdek/...` path). The file lives in this repo's `utils/` tree.

### GitHub Docs — About GitHub Copilot cloud agent

- URL: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
- Type: official-docs
- Author/publisher: GitHub Docs
- Checked: 2026-05-01
- Supports:
  - A mainstream coding agent product researches a repository, creates an implementation plan, changes code on a branch, and expects review/iteration before PR.
- Use in lesson:
  - Optional: supports the broader "plan-before-code" trend, useful as a one-line aside that the workflow isn't a 10xDevs eccentricity.
  - Recheck before any current-feature claim; product behavior changes.
- Confidence: high (as of last check)
- Notes:
  - Keep tool-specific detail out unless directly relevant.

### 10x-evals Benchmark — Master Comparison Report (22 models × 3 plans)

- URL: `/Users/admin/code/10x-evals/data/analysis/report-master.md`
- Type: internal-course-material (proprietary benchmark data)
- Author/publisher: Przeprogramowani / 10x-evals
- Checked: 2026-05-06
- Supports:
  - Budget-tier Chinese models (DeepSeek V4 Flash at $0.019/task, 82.5 pts) outperform premium models (Opus 4.7 at $8.687/task, 76.8 pts) on implementation benchmarks — 180x cheaper, higher score.
  - Model archetypes predict plan sensitivity better than price tier: "Follower" models (Sonnet 4.6, Opus 4.7) benefit from detailed plans; "Explorer" models (Gemini 3.1 Pro, DeepSeek V3-2) prefer autonomy; "Self-sufficient" models (DeepSeek V4 Flash) pass all conditions.
  - Token consumption does not predict quality: DeepSeek V4 Flash used 114K tokens for 82.5 pts; Qwen 3.6 Plus used 10.3M tokens for 83.5 pts (91x more tokens, +1 point).
  - Opus 4.7 is the most plan-dependent model: 47.3 (FAIL) without a plan, 76.8 (PASS) with HITL plan — a 29.5-point swing. This confirms the instructor's observation that Opus 4.7 consumes more tokens for comparable analytical task quality vs Opus 4.6.
  - 20 of 22 models pass at least one condition — the gap is not pass/fail but cost-efficiency and task fit.
- Use in lesson:
  - Ground the "architekci vs implementatorzy" framing in the deep-dive model recommendation section. Use as background evidence, not as a full benchmark report — encourage learners to test on their own tasks.
  - Do not reproduce leaderboard tables in lesson prose; cite key data points (V4 Flash cost, Opus 4.7 cost, score delta) as concrete examples.
  - Companion reports (report-gpt-plan.md, report-hitl-plan.md, report-no-plan.md, report-local-models.md) provide condition-specific detail if the lesson ever needs deeper data.
- Confidence: high (for implementation benchmark claims) / medium (for extrapolation to analytical/planning tasks — benchmark measures coding, not reasoning)
- Notes:
  - The benchmark used OpenCode as runtime, not Claude Code or Cursor. Scores reflect API-driven agentic coding, not subscription UX.
  - Instructor's personal recommendation (Opus 4.6[1m] over Opus 4.7) is grounded in daily usage experience, partially supported by the token-consumption data but not directly measured in the benchmark.

### OpenRouter model catalog and pricing (May 2026)

- URL: https://openrouter.ai/models
- Type: official-docs
- Author/publisher: OpenRouter
- Checked: 2026-05-15
- Supports:
  - Current pricing for all models referenced in the deep-dive table: Opus 4.6/4.7 ($5/$25), Sonnet 4.6 ($3/$15), Gemini 3.1 Pro ($2/$12), DeepSeek V4 Flash ($0.11/$0.22), Qwen 3.6 Plus ($0.33/$1.95), Qwen3 Coder 480B ($0.22/$1.80), MiniMax M2.7 ($0.28/$1.20), DeepSeek V4 Pro ($0.44/$0.87).
  - Free tiers exist for DeepSeek V4 Flash, Qwen3 Coder 480B, and Hy3 Preview (with rate limits: ~20 req/min, ~200 req/day).
  - Qwen3 Coder 480B (MoE 480B/35B active, Apache 2.0) is a specialized coding model not included in 10x-evals but highly relevant as a free implementor option.
  - Hy3 Preview (Tencent) is the most popular model on OpenRouter by weekly token usage (2.4T tokens/week) and scored 72.9 in 10x-evals — a strong free option.
  - OpenRouter rankings (May 2026) top 5 by usage: Hy3 Preview, Claude Opus 4.7, Claude Sonnet 4.6, DeepSeek V4 Flash, Kimi K2.6.
- Use in lesson:
  - Pricing table in deep-dive references these numbers. Add disclaimer that prices change dynamically.
  - Free tiers are a key recommendation for budget-conscious learners — mention prominently.
  - Recheck pricing before course launch; OpenRouter prices track upstream providers and may shift.
- Confidence: high (for current pricing) / medium (for stability over time)
- Notes:
  - Prices are per million tokens, pay-per-use. Free tiers have rate limits that may be insufficient for long agentic sessions.

### OpenCode — open-source CLI coding agent

- URL: https://opencode.ai
- Type: official-docs
- Author/publisher: Anomaly / OpenCode community
- Checked: 2026-05-15
- Supports:
  - OpenCode is an open-source (MIT) terminal-based AI coding agent with 160K+ GitHub stars and 7.5M+ monthly active users.
  - Works with 75+ LLM providers including OpenRouter, Anthropic, OpenAI, and local models via Ollama.
  - One-line install: `curl -fsSL https://opencode.ai/install | bash`. OpenRouter integration via `/connect` command.
  - Does not store code or context data — relevant for privacy-sensitive use cases.
  - The 10x-evals benchmark (22 models) was run on OpenCode with OpenRouter — this is the runtime behind the benchmark data.
- Use in lesson:
  - Recommend as the alternative agent CLI for learners who want model flexibility or budget control.
  - Mention that our benchmark was run on OpenCode — establishes credibility for the tool.
  - Do not position as replacement for Claude Code in the course workflow; course skills (/10x-shape, /10x-prd) are designed for Claude Code / Cursor / Copilot, not OpenCode.
- Confidence: high
- Notes:
  - OpenCode uses AGENTS.md (not CLAUDE.md) for project context. Course skills delivered via 10x-cli target Claude Code, Cursor, and Copilot skill directories. OpenCode users would need to manually place skills.

## Practitioner Signals

### Reddit — "Do coding agents need a planning/spec handoff layer before implementation?"

- URL: https://www.reddit.com/r/AI_Agents/comments/1sxp1rq/do_coding_agents_need_a_planningspec_handoff/
- Type: community-discussion
- Signal:
  - Practitioner describes the loop: rough idea, agent implements too early, missing flows and edge cases appear later, rework follows.
  - Frames the fix as an explicit planning/spec handoff before coding agents start implementation — exactly the gap `/10x-shape → /10x-prd` fills.
- Useful language:
  - "started implementation too early"
  - "planning/spec handoff layer"
  - "clearer target and criteria for completion/review"
- Risk:
  - Anecdotal; not factual evidence. Use only as a phrasing source.
- Confidence: low

### Reddit — "How we evolved our AI coding workflow: Iterating on PRDs, not code"

- URL: https://www.reddit.com/r/aiagents/comments/1iyre2m
- Type: practitioner-signal
- Signal:
  - Practitioner moved from reactive AI fixes to PRD-first work, iterating on the PRD before implementation.
  - Comments echo that teams vary in how far they take specs beyond PRD.
- Useful language:
  - "iterate on the PRDs before jumping into implementation"
  - "separates planning from implementation"
- Risk:
  - Promotional tone; weak as proof. Use as evidence of recurring practitioner pain only.
- Confidence: low

## Examples Worth Using

- Anchor demo: "aplikacja do śledzenia nawyków" (mirrors the prework [4.2] example). Walk it from one-sentence seed through `/10x-shape` phases (vision → persona+access → MVP → FRs → business logic → product framing), with at least one Socratic-round counter-challenge visible per FR, and one empty-CRUD detection beat ("dodawanie / odhaczanie nawyków" alone is hollow without a domain rule like *streak warning* or *recommendation of next habit*).
- Before/after PRD delta:
  - Before: "apka do śledzenia nawyków z logowaniem i statystykami".
  - After: jeden konkretny użytkownik (junior dev uczący się po pracy), pierwszy 7-dniowy przepływ, jedna reguła domenowa (np. "aplikacja sygnalizuje przerwanie serii i rekomenduje krok naprawczy"), jasne non-goals (społeczność, gamifikacja, rozbudowane wykresy), kryterium sukcesu (przeszedł pełny tygodniowy cykl).
- Hollow-PRD failure mode example: cienka notatka („aplikacja do nawyków, login, statystyki") → `/10x-prd` ostrzega o niskim shape-score → kursant uznaje gapy w `## Open Questions` za winę Agenta, idzie do kodu, po dwóch tygodniach widzi, że kontrakt był pusty od początku. Lekcja powinna pokazać tę ścieżkę jako jawnie niezalecaną, z konkretnym powrotem do `/10x-shape` jako fixem.
- Closing soft-gate moment: 6-elementowy raport z `/10x-shape` Step 7 jako artefakt do pokazania w lekcji ("Access Control: present / Business Logic: missing — your PRD will be hollow") — to fragment, którego kursant nigdy nie napisałby sam, a który dokładnie egzekwuje kryteria z preworku [4.2].
- Real-world parallel: 10xCards 2026-05-03 session showed Socratic round catching a persona-too-wide flag (Q3 narrowed from "exams + expertise" to "self-directed learner pursuing expertise") — pokazuje, że Socratic challenge nie jest teatralny, tylko realnie zawęża projekt. (Wewnętrzny przykład; nie cytować w lekcji.)

## Claims To Avoid Or Soften

- "Skill `/10x-prd` przeprowadza sesję sokratejską" — false; `/10x-shape` runs the dialog. Spec already corrected; draft must follow.
- "PRD ma 7 pól frontmatter i 11 sekcji" — true, but lesson stays at the *spirit* level per spec decision (resilience to schema evolution). Describe contents, not the exact field/section names.
- "PRD oszczędza X godzin" — internal slides include illustrative ROI; no measured benchmark was found.
- "Metoda sokratejska gwarantuje lepszy MVP" — phrase as a forcing function (the soft gate makes vague decisions visible), not a guarantee.
- "Agent sam zweryfikuje rynek/użytkowników" — `/10x-shape` exposes assumptions; user/customer validation remains outside the model.
- "PRD jest formalnym dokumentem PM-a" — explicitly forbidden by spec; PRD is a working contract for downstream agentic work.
- "Tech, testy i deployment są częścią PRD" — false post-2026-05-03 trim. They live downstream of stack selection.
- "10x-cli daje od razu skille `/10x-shape` i `/10x-prd`" — depends on the chosen preset (`learner` / `dev` / `full`). Editorial decision: **m1-l1 pomija nazywanie presetu** i pokazuje `npx @przeprogramowani/10x-cli@latest auth` + `get m1l1`; przegląd presetów należy do m1-l2. Invokacja przez `npx @latest` zamiast globalnej instalacji — kursant zawsze dostaje najnowszą wersję.

## Open Verification Questions

- Will the toolkit version available to cohort participants at course start match the post-2026-05-03 schema (11 sections), or does the lesson need to soft-pin a version? — *recheck closer to course start; for now, lesson stays at the *spirit* level so version drift does not invalidate the prose.*
- Should `lessons-schema.json` `m1-l1.owns/referencesOnly/mustNotCover/learningOutcomes` be promoted from the spec's provisional values to canonical schema fields before drafting? — *spec tracks this in `Needs human decision`; not blocking grounding.*

## Resolved Editorial Decisions (2026-05-03)

- **10x-cli preset in m1-l1**: pomijamy nazywanie presetu. m1-l1 pokazuje `npx @przeprogramowani/10x-cli@latest auth` + `get m1l1` bez wariantu (`learner` / `dev` / `full`); przegląd presetów należy do m1-l2.
- **Hollow-PRD demo in video**: zostaje tylko w tekście. Lekcja opisuje ścieżkę cienkie notatki → ostrzeżenie z `/10x-prd` → powrót do `/10x-shape` w prozie; osobny demo w wideo nie jest wymagany.
- **Boundary m1-l2 / m1-l3**: m1-l2 owns deep toolkit + tech-stack selection (first real PRD consumer); m1-l3 owns bootstrap on top of PRD + selected stack. Earlier "m1-l3 owns stack" framing is corrected throughout grounding, spec, draft, and schema.

## Schema Source Update

Updated `groundingSources` for the `m1-l1` object in `lessons-schema.json`:

- **Added** (highest-tier evidence, post-2026-05-03):
  - `/10x-shape SKILL.md` (official-docs; canonical mechanic)
  - `/10x-prd SKILL.md` (official-docs; canonical generator)
  - `prd-schema.md` reference (official-docs; locked PRD contract)
  - `prd-skill` change folder, change.md+frame.md+plan.md (internal-course-material; design rationale + 2026-05-03 trim)
  - 10xCards prd-convo-story.md (repo; real-world validation transcript)
- **Kept and updated** (`checkedAt: 2026-05-03` only where rechecked; relevance/notes adjusted to reflect demoted role):
  - Atlassian — What is a Product Requirements Document? (concept-level only)
  - QUARE paper (concept-level only; mechanic now grounded in skill)
  - Anthropic — Building effective agents (high relevance, task-clarification angle)
  - OpenAI Academy — Prompting fundamentals (light, dialog-iteration angle)
  - 10xDevs internal slides — PRD before tech plan (continuity, with corrected absolute path)
  - GitHub Docs — Copilot cloud agent (industry parallel for plan-before-code)
- **Removed**:
  - `@przeprogramowani/10x-toolkit README` standalone entry — superseded by direct skill source files inside the toolkit; install command details are still authoritative there but the skill SKILL.md is the stronger evidence for the lesson's specific claims.

Updated `sideEffectLedger.unsupportedFacts` for `m1-l1`:

- **Removed** (resolved by 2026-05-03 evidence):
  - "Exact invocation syntax and output format for skill 10x-prd in 10xCLI remain unverified" — resolved; `/10x-shape` and `/10x-prd` are slash commands in the harness post-install (`npx @przeprogramowani/10x-cli@latest get m1l1`); output format is the locked schema.
- **Kept**:
  - "Numeric ROI claims about PRD/planning time savings" — still illustrative in internal material, not measured. Lesson must not state these as benchmarks.

Updated `sideEffectLedger.needsHumanDecision` for `m1-l1`:

- **Resolved** (no longer open):
  - "Decide whether m1-l1 owns any 10x-cli installation/onboarding" — resolved; m1-l1 covers minimal `npx @przeprogramowani/10x-cli@latest auth` + `get m1l1`, deep toolkit stays with m1-l2.
  - "Confirm exact current invocation and output format for skill 10x-prd before RC" — resolved; slash command + locked schema.
  - "Decide which 10xCLI preset (`learner` / `dev` / `full`) m1-l1 demos" — resolved; m1-l1 pomija nazywanie presetu, przegląd presetów należy do m1-l2.
  - "Decide whether the video scenario includes a hollow-PRD demo" — resolved; failure mode covered in text only, no separate video demo.
  - "Boundary m1-l2 / m1-l3: which lesson owns tech-stack selection" — resolved; **m1-l2** owns tech-stack selection (alongside deep toolkit / skille / metaprompting); **m1-l3** owns bootstrap on top of PRD + selected stack.
- **Added** (still open):
  - Decide whether to promote provisional spec schema enrichment (owns/referencesOnly/mustNotCover/learningOutcomes) into canonical schema fields before drafting.
