# m5-l1 — Vision notes (expanded pre-spec)

> Status: **expanded vision**, updated 2026-06-11 from the rough notes captured
> 2026-06-08. This is still **not** `lesson-spec.md`, not `lesson-grounding.md`,
> and not learner-facing prose.
>
> After the m5 reorder, m5-l1 is the **wide introduction** to the module
> "AI-Native Teamwork" (was m5-l4 "AI Internal Builders"). The goal of this file
> is to make the future `lesson-spec` and `lesson-grounding` easier, not to
> replace them.

## Resolved Direction

This vision should become a **spec runway**: a decision-ready pre-spec artifact
that records the lesson angle, boundaries, examples, risks, and grounding
targets. It should not become a section-by-section lesson draft yet.

Current direction:

- **Core frame:** build vs buy as the `m5-l1` decision frame, not necessarily the
  thesis of the entire module.
- **SaaS posture:** the lesson must not imply "replace SaaS with internal
  tools." SaaS often carries platform responsibilities far beyond feature
  surface: security, compliance, audit trails, permissions, uptime, procurement,
  support, and vendor risk. Internal AI tools should fill local gaps around
  existing systems, not pretend to recreate that whole platform burden.
- **Core pain:** team friction, not generic personal productivity.
- **Anchor example:** a team-friction triage board or digest built from existing
  signals such as GitHub Issues, Linear, Jira, database state, incidents, or
  support threads.
- **Motivation:** reducing friction for yourself, the team, and the organization.
  Career leverage is a secondary consequence: solving visible team pain creates
  trust and influence, but the lesson should not promise promotion as an outcome.
- **Depth rule:** this intro may name the later module paths, but it must not
  teach their implementation or architecture.

## Lesson Job Hypothesis

`m5-l1` should answer:

> When does it make sense to stop asking people or SaaS tools for another report,
> dashboard, checklist, or workflow workaround — and instead keep the SaaS where
> it is strong while building a small internal AI-enabled helper that removes the
> local friction around it?

The lesson opens Module 5 by changing the learner's lens:

- from "AI helps me code faster" to "AI lets me remove coordination friction
  around the team";
- from "which tool do I use?" to "which pain is worth turning into an internal
  capability?";
- from "replace the SaaS" to "combine the SaaS platform with a thin internal
  layer that covers our local gap";
- from "build something impressive" to "choose the smallest internal tool or
  automation that unlocks a real workflow."

The later lessons then show concrete paths for building and operationalizing
those capabilities:

- `m5-l2`: build the first team agent with SDKs, costs, privacy, and metrics;
- `m5-l3`: put a review agent into the PR pipeline with standards and gates;
- `m5-l4`: distribute shared AI artifacts across a team;
- `m5-l5`: delegate bounded work to remote/async agents safely.

## Working Thesis Candidates

Use these as raw material for `lesson-spec`, not as final prose:

1. **Recommended:** AI-native teamwork starts when you stop treating team
   friction as "just coordination" and start asking which small internal
   capability would remove it.
2. **Build-vs-buy variant:** SaaS is the default for stable, generic workflows;
   internal AI tools win when the pain is local, changing, data-adjacent, and
   too small or specific for a vendor roadmap. The goal is not SaaS replacement;
   it is gap-filling where SaaS is already doing the heavy platform work.
3. **Internal-builder variant:** The highest-leverage developer in an AI-native
   team is often not the person who writes the most code, but the person who
   turns recurring team pain into a reusable internal capability.

## Audience Starting Point

The learner has used agents across a personal coding workflow, a project
workflow, quality gates, tests, debugging, and legacy modernization. They can
drive tools, review code, and reason about context. They may still think of
"teamwork with AI" as "everyone individually uses better tools."

Likely misconceptions:

- "Internal tools mean a real product: auth, deployment, ownership, UI polish,
  and a backlog."
- "If SaaS can do 70% of it, we should just accept the remaining friction."
- "If we can build the missing 30%, we should replace the SaaS."
- "SaaS is just a feature bundle, not security, compliance, audits, permissions,
  support, uptime, procurement, and vendor-risk management."
- "A dashboard or digest is only valuable if it is permanent and productionized."
- "Career leverage comes from visible hero projects, not small friction removal."

The intro should reframe those assumptions: many valuable internal tools are
small, disposable, local-first, scriptable, and useful before they deserve
deployment or a product owner. They often work best as a thin layer on top of
existing SaaS and company systems, not as a fantasy replacement for them.

## Behavioral Change

After this lesson, the learner should look at repeated team friction and ask:

1. Is this generic enough to buy?
2. Is this local enough to build?
3. What platform responsibilities does the existing SaaS already solve that we
   should not casually rebuild?
4. Is the first useful version small enough to avoid deployment, auth, or a full
   product surface?
5. Which later Module 5 path would industrialize it if it proves valuable?

## Opportunity Map

This table is the core decision artifact for the future lesson.

| Friction signal | Buy/SaaS default | Internal-build opportunity | Why AI changes the equation | Later M5 path |
| --- | --- | --- | --- | --- |
| "I keep asking someone what is happening in the project." | Use Linear/Jira/GitHub dashboards, saved views, or status meetings. | A triage digest that summarizes stale issues, risky PRs, blocked work, and ownership gaps. | AI can interpret messy issue/PR text and turn scattered signals into a useful narrative without a polished analytics model. | `m5-l2` if it becomes a team agent; `m5-l5` if it runs async. |
| "We wait on analysts for a one-off data view." | BI tool, analytics queue, exported CSV. | A temporary internal data view or notebook-like dashboard for one decision. | AI lowers the cost of building the first view and iterating on the question before investing in a stable dashboard. | `m5-l2` for a small agent/tool; keep deployment out of `m5-l1`. |
| "Reviews repeat the same standard comments." | Human review discipline, repository templates, generic review bots. | A lightweight review assistant that checks team-specific criteria before a human review. | AI can apply local conventions and summarize risks, but the pipeline/gating part belongs later. | `m5-l2` local agent, then `m5-l3` pipeline gate. |
| "Everyone copies their own prompts, rules, and skills." | Wiki, Slack pinned messages, IDE marketplace. | Shared AI artifact pack: one source of truth for team rules, prompts, and skills. | AI artifacts affect code behavior, so sharing them becomes an engineering problem, not a documentation problem. | `m5-l4` owns the distribution architecture. |
| "Useful agent work requires sitting at the desk and babysitting progress." | More meetings, manual follow-up, scheduled reminders. | Bounded work delegated to a remote or async agent with review-time control. | AI agents can continue work away from the desk if isolation, budget, and review boundaries are clear. | `m5-l5` owns remote/async operation. |
| "A tiny internal workflow is painful but too specific for SaaS." | Keep the SaaS as the system of record and accept the local gap or wait for the vendor roadmap. | A thin helper around the SaaS: local script, CLI, spreadsheet-like view, generated report, or temporary app. | AI reduces the cost of bespoke glue code, especially when the first useful version complements the platform instead of replacing it. | `m5-l1` owns recognition and decision; later lessons own durable versions. |

## Anchor Example

Use a **team-friction triage board/digest** as the main example unless the spec
finds a stronger one.

Raw scenario:

- The team already has the data: GitHub Issues/PRs, Linear/Jira tickets, commit
  history, CI status, perhaps a product database or incident log.
- The pain is not "we lack a tool"; the pain is "nobody has the current picture
  without asking three people and opening six tabs."
- The first internal build is not a full product. It might be a local script, a
  generated report, a temporary dashboard, or a small agent that produces a daily
  digest.
- The SaaS and source systems remain in place. The internal build reads,
  connects, summarizes, or reshapes their signals; it does not try to recreate
  their security, compliance, audit, permission, or operational guarantees.
- If it proves valuable:
  - `m5-l2` can turn it into a more deliberate team agent;
  - `m5-l3` can show how similar logic becomes a PR review gate;
  - `m5-l4` can distribute the rules and conventions behind it;
  - `m5-l5` can run the digest asynchronously or remotely.

Why this example fits:

- It makes team friction visible.
- It uses existing company data without requiring a new SaaS product.
- It shows how an internal tool can complement SaaS instead of replacing it.
- It can start without deployment or auth.
- It naturally exposes build-vs-buy tradeoffs.
- It gives a concrete reason for the rest of Module 5 to exist.

## Scope Boundaries For Neighbor Lessons

`m5-l1` may name these topics, but only at recognition/decision depth:

- **`m5-l2` owns:** SDK agent construction, ready-made-agent vs
  assemble-it-yourself SDKs, code-review-agent implementation, costs, privacy,
  metrics, evals.
- **`m5-l3` owns:** GitHub Actions, CI execution, Definition of Done, merge
  gates, labels, promptfoo as a regression gate in pipeline context, production
  review references.
- **`m5-l4` owns:** shared AI registry, package distribution, GitHub Packages,
  CodeArtifact/Terraform, API+CLI delivery, installer patterns, signing,
  manifests, sentinels.
- **`m5-l5` owns:** remote execution modes, cloud sandboxes, mobile monitoring,
  network/filesystem isolation, loops, routines, async delegation.

`m5-l1` should avoid:

- SDK syntax or specific SDK comparison tables;
- CI YAML, branch protection, labels, or review-gate mechanics;
- package registry architecture or CLI delivery implementation;
- cloud sandbox configuration;
- teaching prompt patterns, context engineering, or harness definitions from
  prework.

## Provisional Spec Inputs

These are not schema edits. They are raw material for the future
`lesson-spec.md`.

### Possible Owned Concepts

- Build-vs-buy decision frame for internal AI tools and automations.
- SaaS-plus-internal-helper posture: use SaaS for broad platform guarantees and
  build small internal layers for local friction.
- Team friction as the signal for internal-builder opportunities.
- The "first useful version" rule: start smaller than a product, often without
  deployment or auth.
- Opportunity map: friction type -> buy/default -> internal build -> later M5
  path.
- Internal builder as engineering leverage: solving visible team pain creates
  trust and influence.

### Possible References Only

- Agent/harness/tool-use definitions from prework [1.2].
- Off-the-shelf IDE/terminal/cloud tools from prework [2.x].
- Prompt contracts, context engineering, and model choice from prework [3.x].
- CI/CD as a mature project baseline from prework [4.2].
- Detailed M5 implementation paths from `m5-l2..l5`.

### Possible Must Not Cover

- How to build an agent with an SDK.
- How to run a review agent in CI.
- How to distribute skills, commands, rules, or registries.
- How to configure remote agents or cloud sandboxes.
- How to replace full SaaS products or rebuild their security/compliance/audit
  responsibilities.
- Full BI/dashboard design, analytics engineering, data modeling, or product
  discovery.
- General career advice or claims that internal tools guarantee promotion.

### Possible Learning Outcomes

- Learner can distinguish a generic workflow that should be bought from a local
  friction point that may be worth building internally.
- Learner can explain why "build internally" usually means complementing SaaS
  with a narrow helper, not replacing the vendor platform.
- Learner can map recurring team friction to one of the later Module 5 paths.
- Learner can define a first useful internal tool version that avoids unnecessary
  deployment, auth, and productization.
- Learner can explain why AI changes the cost/benefit of small bespoke internal
  tools without treating every annoyance as a product idea.
- Learner can identify the human/team leverage of removing recurring friction
  without overclaiming career outcomes.

## Grounding Targets

Future `lesson-grounding` should look for sources that support or challenge:

- **Build vs buy for internal tools:** decision frameworks, risks of overbuild,
  when bespoke tools are justified.
- **SaaS as platform, not feature checklist:** sources or examples that show why
  SaaS decisions include security, compliance, audits, permissions, uptime,
  procurement, support, and vendor-risk obligations.
- **End-user development / internal tools:** why small internal tools create
  organizational leverage and where they fail.
- **AI lowering bespoke-tool cost:** credible examples or primary docs showing
  how AI agents/LLMs reduce glue-code, reporting, summarization, or prototype
  cost.
- **Team coordination friction:** research or practitioner material on
  coordination overhead, status reporting, PR/issue bottlenecks, knowledge
  transfer, and review load.
- **AI as triage/digest layer:** sources on summarization, issue triage,
  developer workflow automation, and limits of LLM-based decision support.
- **Claims to avoid:** promotion/career claims, hard ROI claims, "no deployment"
  as a universal recommendation, "AI makes internal tools cheap" without
  qualification, or "we can replace SaaS because we can rebuild the missing
  feature."

## Risks To Challenge Before Spec

- **Generic article risk:** "AI internal tools are useful" is too broad. The spec
  must anchor on a concrete friction pattern.
- **Scope theft risk:** every interesting example naturally points into
  `m5-l2..l5`; the intro must stop at decision depth.
- **Overbuild risk:** a build-vs-buy lesson can accidentally encourage learners
  to build what they should buy.
- **SaaS-replacement fantasy risk:** learners may confuse "fill the local gap"
  with "replace the vendor." The spec must name the invisible SaaS work:
  security, compliance, audits, permissions, uptime, procurement, support, and
  vendor risk.
- **Underbuild risk:** "bez deploymentu, bez autha" is a useful first-version
  heuristic, but some team tools become dangerous if they touch sensitive data
  without access control.
- **Career overclaim risk:** "awans przez rozwiązanie bólu zespołu" should be
  framed as influence/leverage, not a promised career ladder.
- **Data-access risk:** examples using GitHub/Linear/Jira/database data must not
  imply careless handling of secrets, PII, or private company data.

## Open Questions For `lesson-spec`

- Should the triage board/digest stay the main example, or should the lesson use
  a simpler one-off database visualization as the first example and keep triage
  as the richer module map?
- Should the practical task ask learners to map a pain from their own team, or
  to classify several prepared scenarios using the opportunity map?
- How strongly should the lesson recommend local/no-deploy first versions versus
  naming the conditions where auth/deployment is required immediately?
- How explicit should the spec be about SaaS as a platform-responsibility bundle,
  not merely a set of features?
- Should the module intro include one diagram of the opportunity map, or keep
  the map as a table?
- Should the future video be a decision walkthrough (classifying pains) or a
  quick artifact demo (building/reading a digest)?

## Side-Effect Ledger

New claims introduced:
- `m5-l1` should use build-vs-buy as its own decision frame, not as the whole
  module thesis.
- The central example should be a team-friction triage board/digest.
- Career leverage is a secondary motivation, not a promised outcome.
- Internal AI tools should usually complement SaaS and fill local gaps, not
  replace vendor platforms that carry security, compliance, audits, permissions,
  uptime, support, procurement, and vendor-risk responsibilities.

Claims removed:
- (none; rough notes preserved and expanded)

Neighboring lesson references changed:
- (none in schema; this vision records boundaries only)

Prework references used:
- Prework [1.2] agent/harness vocabulary.
- Prework [2.x] operating tools across IDE/terminal/cloud.
- Prework [3.x] prompt/context/model foundations.
- Prework [4.2] mature project / CI-CD baseline.

Prework concepts repeated intentionally:
- Agent/harness/tool vocabulary only as assumed background.
- Build discipline and small-MVP thinking only as continuity, not a re-teach.

Potential duplicates:
- `m5-l2`: building a team agent.
- `m5-l3`: PR review automation and gates.
- `m5-l4`: shared AI registry and delivery architecture.
- `m5-l5`: remote/async execution.

Unsupported facts:
- Build-vs-buy claims need grounding.
- AI lowering internal-tool cost needs grounding.
- SaaS-as-platform-responsibility framing needs grounding or careful wording.
- Career leverage/influence claims need grounding or softening.
- Any examples involving Jira/Linear/GitHub/database access need privacy and
  access-control caveats before drafting.

Video/text mismatches:
- (n/a; no video scenario yet)

Needs human decision:
- Final example choice.
- Practical task shape.
- Whether to later promote provisional `owns`, `referencesOnly`,
  `mustNotCover`, and `learningOutcomes` into `lessons-schema.json`.

## Original Rough Notes

Captured 2026-06-08. Preserved for provenance; do not treat these bullets as
locked learning outcomes.

- **Odblokuj siebie / zespół / organizację** — redukcja tarcia (friction) jako główny motyw.
- **Kiedy warto zostać przy SaaS, a kiedy zbudować coś własnego** — rama decyzyjna build vs buy.
- **Wizualizacja danych z bazy** zamiast "gadania do analityków" — przykład odblokowania.
- **Bez deploymentu, bez autha** — niska poprzeczka wejścia; narzędzia wewnętrzne, jednorazowe.
- **Awans poprzez rozwiązanie bólu zespołu** — motywacja: wewnętrzne narzędzie jako dźwignia.
- **Osobista produktywność:**
  - co się dzieje w firmie,
  - zrzut z GitHub Issues / Lineara / Jiry.

Original open questions:

- Jak ten intro mapuje się na resztę modułu (l2 Twój pierwszy Agent zespołowy,
  l3 Code Review, l4 Shared AI Registry, l5 Async & Remote Agents)?
- Ile z "how to build" zostaje tutaj jako szeroki obraz, a ile schodzi do l2–l4?
- Czy "build vs buy" to teza całego modułu, czy tylko otwarcie?
