# Lesson Spec: m5-l1 — AI Internal Builders: wewnętrzne narzędzia, serwisy i automatyzacje

## Schema Context

- Course: 10xdevs-3
- Module: m5 — AI-Native Teamwork
- Position: 1 / 21
- Depends on: m4-l5 — Modernizacja legacy z DDD: wydzielaj domeny, potem deleguj Agentowi
- Prepares for: m5-l2 — Twój pierwszy Agent zespołowy: SDK, koszty, metryki

## Prework Continuity

- Relevant prework lessons: [1.2] Chatbot vs Agent vs Harness; [2.1–2.4] agent tools and environments; [3.2–3.3] prompt/context discipline; [4.2] good project discipline.
- Assumed from prework: learner understands agents, harnesses, tool choice, context boundaries, project quality, and “small useful workflow before big product.”
- Deepened here: those mental models move from personal/project productivity to team friction and internal-builder decisions.
- Avoid repeating: agent/harness definitions, prompt patterns, model choice, CI/CD basics, tool setup.

## Lesson Job

Open Module 5 by teaching the learner how to notice recurring team friction and decide whether to buy, complement, or build. The lesson must disarm the misconception that internal AI tools should replace SaaS. SaaS often carries platform responsibilities — security, compliance, audits, permissions, uptime, procurement, support, vendor risk — so the high-leverage move is often a thin internal helper around existing systems. The lesson gives learners an opportunity map they can use before m5-l2 teaches how to build a first team agent. It also introduces the Module 5 **10xChampion** path: learners prove a team-scale AI workflow through screenshots and evidence, not by exposing a company repository.

## Thesis

AI-native teamwork starts when you stop treating team friction as “just coordination,” keep SaaS where it carries platform responsibility, and build the smallest internal helper around the local gap.

## Learning Outcomes

- Learner can distinguish a workflow that should be bought from local friction worth addressing internally.
- Learner can explain why internal building usually means complementing SaaS, not replacing the vendor platform.
- Learner can classify recurring team pain with an opportunity map and route it to the right later M5 path.
- Learner can define a first useful internal-helper version that avoids unnecessary deployment, auth, and productization.
- Learner can explain why AI lowers the cost of small bespoke helpers without making every annoyance worth building.
- Learner can name how solving visible team friction creates trust and influence without treating promotion as guaranteed.
- Learner can explain what evidence the 10xChampion badge expects: screenshot-based proof of a team workflow, without requiring a public repository link.

## Audience Starting Point

The learner can already use agents for personal and project work. They may still see “teamwork with AI” as everyone individually using better tools. They may also overcorrect: either accept SaaS gaps forever, or fantasize about replacing a vendor because a missing feature looks easy to rebuild. They need a decision frame that respects invisible platform work and still gives them permission to remove local friction.

## Behavioral Change

When the learner sees repeated team friction, they map it before building: buy/default, SaaS responsibility, internal helper, first useful version, and later M5 path.

## Owned Concepts

- Build-vs-buy-vs-complement decision frame for internal AI tools.
- SaaS as platform responsibility, not a feature checklist.
- Team friction as the signal for internal-builder opportunities.
- Opportunity map: friction signal → SaaS/default response → internal helper → first useful version → later M5 path.
- First useful version rule: start as a narrow helper around existing systems before productizing.
- Internal builder leverage: trust and influence from reducing visible team pain.
- 10xChampion evidence package: screenshot-based proof of a Module 5 workflow, especially a CI/CD code-review pipeline or Shared AI Registry flow.

## References Only

- Agent/harness/tool-use definitions — prework [1.2].
- IDE/terminal/cloud tool tradeoffs — prework [2.x].
- Prompt/context/model discipline — prework [3.x].
- CI/CD maturity baseline — prework [4.2].
- SDK agent implementation, costs, privacy, metrics — m5-l2.
- PR review gates, DoD, GitHub Actions — m5-l3.
- Shared AI registry and artifact distribution — m5-l4.
- Remote/async execution — m5-l5.
- Concrete 10xChampion implementation artifacts from later lessons: code-review pipeline from m5-l2/m5-l3 or shared AI registry from m5-l4.

## Must Not Cover

- How to build an agent with an SDK.
- How to run a review agent in CI.
- How to distribute skills, commands, rules, packages, registries, or CLI delivery.
- How to configure remote agents, cloud sandboxes, loops, or async execution.
- How to replace full SaaS products or rebuild their security/compliance/audit responsibilities.
- Full BI/dashboard design, analytics engineering, data modeling, or product discovery.
- General career advice or claims that internal tools guarantee promotion.
- Exact implementation of the 10xChampion submission workflow; this lesson introduces requirements and evidence shape only.

## Required Example Or Demo

Use a generic company scenario as the running example. The team already has normal operational data in GitHub, Linear/Jira, CI, and an internal company database. The internal helper does not replace those systems or depend on vendor AI features; it reads and combines their existing signals into a small digest: stale issues, risky PRs, failed jobs, blocked work, ownership gaps, release state, or “what changed since yesterday.”

The required decision artifact is an opportunity map. The tiny demo may show a static/read-only digest or mocked report, but not SDK code, deployment, CI, registry, or remote-agent operation.

The lesson should explicitly say that the example can be done on real company context **or** as a standalone PoC. For company context, the submission should use screenshots rather than repository links.

## Structural Logic Map

1. **Beat:** Open with repeated team friction.
   - **Question answered:** “Why does Module 5 start here?”
   - **Introduces (what + why-now):** team friction = recurring coordination cost visible across people/tools; it matters now because M5 shifts from solo/project agent work to team workflows.
   - **Depends on:** learner’s prior agent workflow experience.
   - **Sets up:** decision frame.
   - **Diagram opportunity:** none.
   - **Risk:** sounding like generic productivity advice.

2. **Beat:** SaaS is not just a feature bundle.
   - **Question answered:** “If we can build the missing feature, why not replace the SaaS?”
   - **Introduces (what + why-now):** SaaS platform responsibility = security, compliance, audits, permissions, uptime, procurement, support, vendor risk; it matters before build-vs-buy so the learner does not compare only visible features.
   - **Depends on:** friction pain is established.
   - **Sets up:** complement-not-replace posture.
   - **Diagram opportunity:** small contrast table: feature gap vs platform responsibility.
   - **Risk:** becoming a procurement/compliance lecture.

3. **Beat:** Build, buy, or complement.
   - **Question answered:** “What decision am I actually making?”
   - **Introduces (what + why-now):** complement = keep the system of record and add a thin helper around the local gap; it matters because this is the lesson’s middle path between resignation and overbuild.
   - **Depends on:** SaaS responsibility guardrail.
   - **Sets up:** opportunity map.
   - **Diagram opportunity:** yes — decision branch: generic → buy; local gap around SaaS → complement; durable workflow → later M5 path.
   - **Risk:** using “build” too loosely.

4. **Beat:** Opportunity map.
   - **Question answered:** “How do I classify real team pains?”
   - **Introduces (what + why-now):** opportunity map = friction signal mapped to SaaS/default, internal helper, AI advantage, and later M5 path; it matters because it becomes the learner’s practical artifact.
   - **Depends on:** build/buy/complement distinction.
   - **Sets up:** triage digest example.
   - **Diagram opportunity:** the table is the artifact; optional mermaid only if table becomes too dense.
   - **Risk:** generic scenarios without behavioral consequence.

5. **Beat:** Running example — triage digest.
   - **Question answered:** “What does this look like in a real team?”
   - **Introduces (what + why-now):** triage digest = a small read-only summary of scattered signals, not a replacement for GitHub/Linear/Jira; it matters because it proves the complement posture.
   - **Depends on:** opportunity map.
   - **Sets up:** first useful version.
   - **Diagram opportunity:** source systems → digest → team decision.
   - **Risk:** drifting into SDK/automation implementation.

6. **Beat:** First useful version.
   - **Question answered:** “How small can this be before it deserves productization?”
   - **Introduces (what + why-now):** first useful version = local script, static report, spreadsheet-like view, or temporary dashboard that validates the workflow before auth/deploy/backlog; it matters because it prevents overbuilding.
   - **Depends on:** digest example.
   - **Sets up:** later M5 paths if it proves valuable.
   - **Diagram opportunity:** none.
   - **Risk:** “no auth/deploy” must not sound universal for sensitive data.

7. **Beat:** Route to the rest of Module 5.
   - **Question answered:** “What happens if this helper works?”
   - **Introduces (what + why-now):** later M5 path mapping: m5-l2 builds an agent, m5-l3 operationalizes review gates, m5-l4 distributes team artifacts, m5-l5 runs bounded work async.
   - **Depends on:** first useful version.
   - **Sets up:** bridge to m5-l2.
   - **Diagram opportunity:** opportunity map row → M5 lesson path.
   - **Risk:** pre-teaching downstream lessons.

8. **Beat:** 10xChampion evidence path.
   - **Question answered:** “Jak udowodnić, że zrobiłem coś zespołowego, jeśli pracuję na firmowym kontekście?”
   - **Introduces (what + why-now):** 10xChampion = optional Module 5 badge for learners who build a team-scale AI workflow; evidence is screenshots, not repo links, so people can work on company context without publishing code.
   - **Depends on:** later M5 path mapping.
   - **Sets up:** practical task and badge CTA.
   - **Diagram opportunity:** small checklist grouped by path: CI/CD review pipeline vs Shared AI Registry.
   - **Risk:** turning the lesson into an administrative form; keep it short and practical.

9. **Beat:** Engineering leverage.
   - **Question answered:** “Why should I care beyond a neat internal tool?”
   - **Introduces (what + why-now):** internal-builder leverage = trust/influence from removing visible team pain; it matters as motivation, not a promotion promise.
   - **Depends on:** concrete example and boundaries.
   - **Sets up:** practical task.
   - **Diagram opportunity:** none.
   - **Risk:** overclaiming career outcomes.

## Failure Mode To Disarm

The learner sees a SaaS gap and jumps to “we should build our own version.” The lesson exposes that this ignores invisible platform work. The correct move is to classify the pain: buy where generic, complement where local, build only when the helper proves durable and valuable.

## Suggested Structure

1. **Intro prose** — repeated team friction and the module shift.
   ```text
   Previous beat -> this beat -> next beat:
   m4 ended post-MVP/domain modernization -> M5 starts team friction -> build/buy/complement; no SDKs yet.
   ```

2. **SaaS to nie tylko funkcje** — platform responsibility guardrail.
   ```text
   Previous beat -> this beat -> next beat:
   friction pain -> why replacement is often illusory -> complement posture; must not become compliance training.
   ```

3. **Kup, uzupełnij albo zbuduj** — decision frame.
   ```text
   Previous beat -> this beat -> next beat:
   SaaS guardrail -> concrete decision categories -> opportunity map; must define “complement” clearly.
   ```

4. **Mapa okazji dla internal buildera** — opportunity map.
   ```text
   Previous beat -> this beat -> next beat:
   decision frame -> reusable classification artifact -> triage digest example; must route to later M5 lessons without teaching them.
   ```

5. **Przykład: digest tarcia zespołowego** — tiny artifact/demo.
   ```text
   Previous beat -> this beat -> next beat:
   map -> concrete read-only digest -> first useful version; must not introduce SDK, CI, registry, or deployment.
   ```

6. **Pierwsza użyteczna wersja** — avoid overbuild.
   ```text
   Previous beat -> this beat -> next beat:
   digest -> smallest validation surface -> later module paths; must include sensitive-data caveat.
   ```

7. **Dźwignia internal buildera** — career/influence motivation.
   ```text
   Previous beat -> this beat -> next beat:
   practical decision -> why it matters socially in engineering teams -> practice; must not promise promotion.
   ```

8. **🧑🏻‍💻 Zadania praktyczne** — classify 3–5 pains, choose one helper, sketch first useful version and later M5 path; introduce the 10xChampion path and screenshot-based evidence.

9. **Odbierz swoją odznakę** — standard one-liner.

10. **🔎 Deep Dive** — build-vs-buy anti-patterns; SaaS platform responsibilities; when a helper deserves productization.

11. **📚 Materiały dodatkowe** — grounding sources after `lesson-grounding`.

## 10xChampion Evidence Package

Introduce this in the practical-task section, mirroring the `m4-l1` Architect/Champion framing:

- **Builder certificate** remains based on modules 1–3. Module 5 is not required for the base Builder badge.
- **10xChampion** is an optional badge for learners who complete the Module 5 team-workflow path.
- Learners may use real company context or a standalone PoC. If the work uses company context, they submit screenshots rather than repository links.
- Valid paths include:
  - CI/CD pipeline with code review, built across `m5-l2` and `m5-l3`.
  - Shared AI Registry / team artifact distribution, built in `m5-l4`.
- Evidence expected:
  - list of releases,
  - repository where the workflow exists (shown in screenshot, not necessarily linked),
  - package definition,
  - at least one visible job,
  - pipeline view,
  - logs from the pipeline/job.

## Video Placeholders

- **Decision walkthrough:** classify 3 prepared scenarios in the opportunity map and explain why one is “buy,” one is “complement,” and one should wait.
- **Tiny artifact demo:** show a mocked/read-only triage digest generated from normal GitHub, Linear/Jira, CI, and internal-company-DB signals. The video must not show SDK code, CI implementation, auth, deployment, registry, or remote-agent setup.
- **10xChampion evidence walkthrough:** show the expected screenshot categories at a high level, without implementing the pipeline or registry in this lesson.

## Bridge In

From m4-l5 only lightly: after post-MVP/domain modernization, the learner now moves from “how do I improve this project?” to “how do I reduce friction for the team around the project?” No heavy bridge needed; this lesson opens a new module.

## Bridge Out

To m5-l2: once a helper idea is worth building, the next question is how to assemble the first team agent and reason about SDK, privacy, cost, and metrics. Keep this as a one-sentence handoff.

## Open Questions

- (none — user decisions recorded 2026-06-11)

## Side-Effect Ledger

New claims introduced:
- m5-l1 owns the build/buy/complement frame for team friction.
- SaaS platform responsibility is a first-class guardrail.
- Triage digest/opportunity map becomes the anchor artifact, using a generic company scenario: GitHub + Linear/Jira + CI + internal company database.
- Career leverage is secondary and framed as trust/influence.
- m5-l1 introduces the 10xChampion badge evidence path: screenshot-based proof for a CI/CD code-review pipeline or Shared AI Registry workflow, with implementation owned by later Module 5 lessons.

Claims removed:
- (none)

Neighboring lesson references changed:
- m5-l2 is explicitly protected as the first implementation lesson.
- m5-l3/m5-l4/m5-l5 are referenced only as later paths.

Prework references used:
- [1.2], [2.x], [3.x], [4.2]

Prework concepts repeated intentionally:
- Agent/harness/tool vocabulary only as assumed background.
- Small useful workflow / MVP discipline as continuity.

Potential duplicates:
- m5-l2 if the digest becomes an SDK build.
- m5-l3 if review examples become CI gates.
- m5-l4 if shared rules/prompts become distribution architecture.
- m5-l5 if async digest execution becomes remote-agent setup.

Unsupported facts:
- (none — SaaS/platform responsibility and AI-helper cost are grounded; career leverage remains soft; data/security caveat recorded as editorial posture)

Video/text mismatches:
- none yet; future video must stay decision/demo-level.

Needs human decision:
- (none — decisions recorded 2026-06-11)
