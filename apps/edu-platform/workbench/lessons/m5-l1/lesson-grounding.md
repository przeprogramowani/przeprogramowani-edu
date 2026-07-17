# Lesson Grounding: m5-l1 — AI Internal Builders: wewnętrzne narzędzia, serwisy i automatyzacje

## Scope

- Lesson source: `lessons/m5-l1/lesson-spec.md`, supported by `lesson-vision.md` and the `m5-l1` schema slot.
- Neighbor boundaries: `m4-l5` closes legacy/domain modernization and must not be re-taught here; `m5-l2` owns SDK construction, privacy, costs, and metrics; `m5-l3` owns CI review gates; `m5-l4` owns shared AI artifact distribution; `m5-l5` owns remote/async operation.
- Relevant prework: [1.2] Chatbot vs Agent vs Harness; [2.1-2.4] agent tools/environments; [3.2-3.3] prompt/context discipline; [4.2] good project discipline and small useful workflow thinking.
- Research posture: standard. The lesson is a module opener with a wide decision frame, so the grounding favors durable principles plus a few current examples. The running scenario should center normal company data and existing product/tool features (GitHub, Linear/Jira, CI, internal DB); vendor AI features are background examples, not the lesson's focus.

## Claims To Support

- **SaaS is not just a visible feature bundle** — before comparing "we can build this missing feature" with a vendor product, the learner must see the platform responsibilities hidden under SaaS: infrastructure, security, reliability, operations, identity, tenancy, permissions, support, procurement, vendor risk. — protects the lesson from SaaS-replacement fantasy — needs: official cloud/SaaS definitions and architecture guidance.
- **Build/buy/complement is the right decision frame** — generic utility capabilities usually belong in packages/SaaS; strategic/local gaps can justify custom work; over-customizing a package or rebuilding a system of record is a common trap. — frames the opportunity map — needs: durable technical framing plus practitioner objections.
- **"Complement" means a thin helper around the system of record** — the internal helper reads, summarizes, connects, or reshapes signals from GitHub/Linear/Jira/support/data systems; it does not pretend to own their platform guarantees. — anchors the triage digest example — needs: SaaS/platform sources plus current AI-triage examples.
- **Team friction is a real software-engineering signal** — coordination needs are volatile, cross team boundaries, and can be inferred from archival traces such as issues, changes, and communication patterns. — justifies using scattered team signals as input — needs: coordination research.
- **Small internal helpers are useful but risky when quality is implicit** — end-user/internal tools are often built to accomplish another goal, so requirements, reuse, testing, debugging, and maintenance can stay implicit unless deliberately constrained. — supports "first useful version" and "avoid productization" — needs: end-user software engineering research.
- **AI lowers the first-prototype cost but does not remove maintenance or risk** — LLMs can help summarize, route, classify, and build glue around tools, but the recommended engineering posture is still to start with the simplest useful workflow and add complexity only when the value is proven. — supports "AI changes the equation" without overclaiming — needs: official AI-agent/tool guidance.
- **Triage/digest is credible because teams already have useful operational signals** — GitHub, Linear/Jira, CI, release history, incidents, support threads, and internal company databases already contain signals a team can combine into a digest. Vendor AI features are useful background examples, but the lesson should mostly integrate with normal features/data and build from there. — grounds the running example — needs: coordination research plus official/current tool examples.
- **10xChampion evidence is screenshot-based, not repo-link-based** — learners can work on company context without exposing code by submitting screenshots of releases, repository/package definition, jobs, pipeline view, and logs. — grounds the practical-task/badge path — needs: course-internal decision, not external verification.
- **Internal-builder leverage should be framed as trust/influence, not promotion** — reducing visible team pain can make a developer more useful to the organization, but there is no grounded claim that it guarantees promotion, compensation, or formal career progress. — protects motivation section — needs: soft wording more than external proof.

> **Use silently vs. surface.** A source may be used *silently* to get a fact right; not every supported claim must become a sentence in the lesson. Do not turn this list into a checklist of name-drops the draft must surface. Per the Concept-Introduction Adequacy rule in `references/editorial-contract.md`: if a claim is worth surfacing, it must be introduced with *what it is* + *why it matters now* — and a claim too thin to introduce adequately should be flagged (so the draft either expands it properly or uses it only for factual correctness). Factual correctness is always required, whether a claim is surfaced or used silently.

## Strong Sources

### Utility Vs Strategic Dichotomy

- URL: https://martinfowler.com/bliki/UtilityVsStrategicDichotomy.html
- Type: technical-post
- Author/publisher: Martin Fowler
- Checked: 2026-06-11
- Supports:
  - Utility work is usually better handled by a package/SaaS, while strategic differentiation can justify custom software.
  - Buying a package and then heavily customizing it can waste effort in a different way than rebuilding from scratch.
- Use in lesson: 
  - *surface*: build/buy/complement decision frame.
  - *use silently*: keep the lesson from treating every local annoyance as strategic.
- Confidence: high
- Notes:
  - Useful as a durable framing source, not as a modern AI-specific source.

### NIST CSRC Glossary — Software as a Service (SaaS)

- URL: https://csrc.nist.gov/glossary/term/software_as_a_service
- Type: official-docs
- Author/publisher: NIST
- Checked: 2026-06-11
- Supports:
  - SaaS means using provider applications on cloud infrastructure; consumers generally do not manage infrastructure or full application capabilities beyond limited configuration.
  - This supports the lesson's guardrail that SaaS carries responsibilities the visible feature checklist hides.
- Use in lesson:
  - *surface*: "SaaS is not only a feature bundle" guardrail.
  - *use silently*: avoid over-specific claims about individual vendors' exact responsibility split.
- Confidence: high
- Notes:
  - Keep the learner-facing version practical; do not turn the section into cloud-service taxonomy.

### AWS Well-Architected SaaS Lens

- URL: https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/saas-lens.html and https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/definitions.html
- Type: official-docs
- Author/publisher: AWS
- Checked: 2026-06-11
- Supports:
  - SaaS architecture requires thinking across operational excellence, security, reliability, performance efficiency, cost optimization, sustainability, and SaaS-specific concepts such as identity, tenant isolation, tenant-aware operations, onboarding, and tiers.
  - Multi-tenant SaaS adds operational and architectural concerns beyond building an isolated feature.
- Use in lesson:
  - *surface*: short platform-responsibility list.
  - *use silently*: deepen the "do not rebuild the vendor platform" argument.
- Confidence: high
- Notes:
  - AWS is provider-specific but the categories are useful for explaining invisible platform work.

### Building effective agents

- URL: https://www.anthropic.com/engineering/building-effective-agents
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-11
- Supports:
  - Start with the simplest solution that works; add agentic complexity only when needed.
  - Workflows are predictable for well-defined tasks; autonomous agents are better when flexibility and model-directed decisions are needed at scale.
  - Frameworks and agentic systems can tempt teams into complexity that is hard to debug.
- Use in lesson:
  - *surface*: "first useful version" rule and no-SDK/no-productization guardrail.
  - *use silently*: keep the m5-l1 digest example as a narrow workflow rather than an autonomous agent.
- Confidence: high
- Notes:
  - Detailed SDK construction belongs to `m5-l2`; here this source supports decision depth only.

### Writing effective tools for AI agents — using AI agents

- URL: https://www.anthropic.com/engineering/writing-tools-for-agents
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-11
- Supports:
  - Tracking tool calls, runtime, token consumption, and errors can reveal repeated workflows and opportunities to consolidate tools.
  - Agents can help identify issues in tools, but omissions and failures still matter.
- Use in lesson:
  - *surface*: "recurring friction becomes an internal-builder signal" if tied to observable repeated workflows.
  - *use silently*: avoid saying AI automatically knows what to build; signals still need human interpretation.
- Confidence: medium-high
- Notes:
  - This is more tool-building than internal-tools strategy; keep it as supporting material, not the main frame.

### The State of the Art in End-User Software Engineering

- URL: https://faculty.washington.edu/ajko/papers/Ko2011EndUserSoftwareEngineering.pdf
- Type: paper
- Author/publisher: Andrew J. Ko, Robin Abraham, Laura Beckwith, Alan Blackwell, Margaret Burnett, Martin Erwig, Chris Scaffidi, Joseph Lawrance, Henry Lieberman, Brad Myers, Mary Beth Rosson, Gregg Rothermel, Mary Shaw, Susan Wiedenbeck / ACM Computing Surveys
- Checked: 2026-06-11
- Supports:
  - End-user/internal software is often created to support another goal, so quality activities such as requirements, reuse, testing, verification, and debugging tend to be implicit, opportunistic, or secondary.
  - This creates a quality and maintenance risk when a small helper silently becomes critical infrastructure.
- Use in lesson:
  - *surface*: "first useful version" caveat and "do not productize too early" with an explicit upgrade path if the helper becomes durable.
  - *use silently*: shape Deep Dive warnings about shadow tools and unowned scripts.
- Confidence: high
- Notes:
  - Use the insight, not academic vocabulary. "End-user software engineering" probably belongs in Deep Dive or not at all.

### Identification of Coordination Requirements: Implications for the Design of Collaboration and Awareness Tools

- URL: https://herbsleb.org/web-pubs/pdfs/cataldo-identification-2006.pdf
- Type: paper
- Author/publisher: Marcelo Cataldo, Patrick A. Wagstrom, James D. Herbsleb, Kathleen M. Carley / CSCW 2006
- Checked: 2026-06-11
- Supports:
  - Coordination requirements can be inferred from archival development data.
  - Coordination needs are volatile and can cross team boundaries; better congruence between coordination needs and activity shortened development time in the studied project.
- Use in lesson:
  - *surface*: team-friction triage digest reads existing development traces because those traces can reveal coordination needs.
  - *use silently*: do not overclaim exact productivity effects for this course example.
- Confidence: high
- Notes:
  - Avoid turning the lesson into a socio-technical-congruence lecture.

### GitHub Blog — Building AI-powered GitHub issue triage with the Copilot SDK

- URL: https://github.blog/ai-and-ml/github-copilot/building-ai-powered-github-issue-triage-with-the-copilot-sdk/
- Type: technical-post
- Author/publisher: GitHub / Andrea Griffiths
- Checked: 2026-06-11
- Supports:
  - A concrete GitHub issue-triage app can use existing GitHub issue data and AI summarization to speed up triage decisions.
  - The implementation uses server-side handling for SDK/runtime and credential reasons, reinforcing that even "small" helpers have architecture and secret-handling implications.
- Use in lesson:
  - *surface*: optional example that issue triage/summaries are a real current workflow, not a made-up course scenario.
  - *use silently*: the demo should remain mocked/read-only in m5-l1; SDK details are `m5-l2`.
- Confidence: medium-high
- Notes:
  - Current and official, but blog/tutorial details can age. Recheck before quoting SDK mechanics.

### Linear Docs — Triage Intelligence and issue discussion summaries

- URL: https://linear.app/docs/triage-intelligence and https://linear.app/docs/comment-on-issues
- Type: official-docs
- Author/publisher: Linear
- Checked: 2026-06-11
- Supports:
  - Linear uses agentic models to suggest issue properties/relationships in triage and provides AI-generated discussion summaries of decisions, blockers, debates, resolutions, and people involved.
  - Generic triage/summarization features may already exist in SaaS, so internal helpers should target local cross-system gaps rather than rebuild the obvious feature.
- Use in lesson:
  - *surface*: SaaS default row in the opportunity map and the "complement, don't replace" posture.
  - *use silently*: avoid presenting a local triage digest as novel just because it uses AI.
- Confidence: high
- Notes:
  - Plan-tier and availability details can change; keep prose generic.

### Atlassian Support — Summarize a work item's description and comments using AI

- URL: https://support.atlassian.com/jira-service-management-cloud/docs/summarize-an-issues-comments-using-atlassian-intelligence/
- Type: official-docs
- Author/publisher: Atlassian
- Checked: 2026-06-11
- Supports:
  - Jira Service Management can summarize work item description/comments for Premium or Enterprise customers with AI enabled.
  - The summary is user-visible and transient, which is a useful contrast against a durable team digest.
- Use in lesson:
  - *surface*: "buy/default" side of the opportunity map for ticket-summary use cases.
  - *use silently*: if the lesson names Jira, avoid overstating feature scope beyond Service Management AI summaries.
- Confidence: high
- Notes:
  - Use only as a current example of vendor-native summarization; do not build the lesson around Jira-specific mechanics.

## Practitioner Signals

### Ask HN: What's a build vs. buy decision that you got wrong?

- URL: https://news.ycombinator.com/item?id=34163624
- Type: community-discussion
- Signal:
  - Practitioners repeatedly frame build-vs-buy as build-plus-maintain vs buy-plus-vendor-fit/opportunity-cost, not one-time implementation cost vs subscription price.
  - Stories include internal systems forced into jobs they were not designed for and later breaking records or workflows.
- Useful language:
  - "build + maintaining" vs "buying + keeping up with vendor updates + unsupported feature changes."
- Risk:
  - Anecdotal; do not use as factual proof.
- Confidence: medium

### HN discussion: AI is killing B2B SaaS

- URL: https://news.ycombinator.com/item?id=46888441
- Type: community-discussion
- Signal:
  - Strong practitioner skepticism toward the claim that companies will replace stable SaaS with AI-generated internal tools because maintenance and risk remain.
  - Useful counterweight to hype-driven "AI eats SaaS" framing.
- Useful language:
  - "maintenance or risk"; "RPA hype cycle"; "solve problems where they already work."
- Risk:
  - Weak evidence for facts; useful only for objections the lesson should disarm.
- Confidence: low

### HN discussion: 10 years building internal tools, and the SaaS stack is still a nightmare

- URL: https://news.ycombinator.com/item?id=44800166
- Type: community-discussion
- Signal:
  - Practitioners describe scattered context across Slack, BI, automation tools, data models, and disconnected SaaS systems; onboarding/offboarding, invoices, and silent API failures recur as pain.
  - Supports the language of "tool soup" and "context scattered," but not as proof that a particular internal helper should be built.
- Useful language:
  - "context was scattered"; "workflows broke easily"; "engineers debugged glue instead of shipping."
- Risk:
  - Anecdotal and startup-specific; use as pain language only.
- Confidence: medium

## Examples Worth Using

- **Opportunity map row: project-status friction.** Signal: "Nobody knows what changed since yesterday without opening six tools." SaaS/default: GitHub/Linear/Jira dashboards, CI views, release pages, and native summaries where available. Internal helper: read-only digest that joins stale issues, risky PRs, failed jobs, blocked work, ownership gaps, release state, and selected internal-company-DB signals. AI advantage: summarize messy text and route categories when useful, but the main value is integration of normal data sources. Later path: `m5-l2` if turned into a team agent; `m5-l5` if scheduled remotely.
- **Complement-not-replace example.** Keep Linear/Jira/GitHub as systems of record. The helper produces a digest or temporary view; source links remain authoritative. This makes the internal tool disposable and safer.
- **First useful version ladder.** Mocked Markdown report → local script reading exported JSON/CSV → static HTML digest → internal app/agent only after repeated use. Sensitive data requires access/auth earlier than the simple ladder suggests.
- **Buy/default contrast.** If the problem is "summarize one Jira ticket" or "suggest labels in Linear," vendor-native AI may already solve it. If the problem is "join Jira + GitHub + CI + support + one domain database into a morning decision," a thin internal helper may be justified.
- **Maintenance warning.** A digest that becomes a daily ritual needs ownership, data access review, failure behavior, and stale-source handling. Otherwise it becomes a quiet critical dependency.
- **Practice artifact.** Let the learner classify 3-5 pains into: buy/default, complement helper, first useful version, risk/caveat, later M5 path.
- **10xChampion evidence path.** Introduce screenshot-based proof, not repo links: list of releases, repository where the workflow exists, package definition, at least one job, pipeline view, and logs. Valid paths include CI/CD code review from `m5-l2`/`m5-l3` or Shared AI Registry from `m5-l4`.

## Claims To Avoid Or Soften

- **"AI makes internal tools cheap."** Soften to: AI lowers the cost of the first useful helper and iteration; maintenance, data access, quality, and ownership still cost real engineering time.
- **"Replace SaaS."** Avoid unless explicitly discussing the anti-pattern. The lesson should favor complementing existing systems of record.
- **"No deployment/auth."** Only safe for mocked, local, read-only, or non-sensitive data. If real user/customer/company data appears, access control and auditability move earlier. Raise this calmly as an engineering caveat, not as a compliance alarm.
- **"SaaS vendors cannot handle local workflows."** Too broad. Vendors increasingly ship AI summaries, triage, automations, and agent features. The local helper wins on cross-system/company-specific gaps, not on generic summaries.
- **"Internal tools create career leverage."** Keep as trust/influence from solving visible pain; do not promise promotion, compensation, or formal status.
- **"The triage digest proves productivity improvement."** The coordination papers support the importance of coordination needs; they do not prove this course digest improves productivity.
- **"Vendor AI examples are stable."** GitHub/Linear/Atlassian features and plan gates can change. Use as current examples, not permanent claims.

## Open Verification Questions

- If the draft names exact GitHub/Linear/Atlassian AI features, recheck them immediately before publication. The lesson should not depend on those features; it should mostly use normal company data and existing product surfaces.

## Schema Source Update

Updated `workbench/lessons-schema.json` for `m5-l1` only:

- Set `status` to `grounded`.
- Added `lesson-grounding` to `requiredArtifacts`.
- Added 9 curated `groundingSources` covering build-vs-buy, SaaS platform responsibilities, AI workflow simplicity, internal-tool quality risks, coordination research, and current AI triage/summarization examples.
- Replaced the stale "scope/spec must be redefined" schema blocker with the user's 2026-06-11 decisions: generic company scenario, prepared-first practical task with company-context option, light security caveat, schema enrichment approved, and normal product data as the main example source.
- Updated `owns`, `referencesOnly`, `mustNotCover`, `learningOutcomes`, `requiredFragments`, and `videoPlaceholders` from `lesson-spec.md` after explicit approval.
