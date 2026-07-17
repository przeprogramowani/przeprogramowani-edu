# Lesson Spec: m5-l4 — Shared AI Registry: skille, komendy i reguły dla zespołu

> **Source-of-truth note:** this spec has been realigned to the current `lesson-draft.md`. The draft is the editorial source for this version of the spec; older conflicting planning notes were removed.

## Schema Context

- Course: 10xdevs-3
- Module: m5 — AI-Native Teamwork
- Position: 4 / 24 (module order 4, global 24)
- Depends on: m5-l3 — Code Review w erze AI: standardy, DoD i Agent w pipeline
- Prepares for: m5-l5 — Innovate: Async & Remote Agents - deleguj i zajmij się czymś innym
- Current draft file: `workbench/lessons/m5-l4/lesson-draft.md`

## Prework Continuity

- Relevant prework lessons: [3.2] Wzorce i antywzorce promptowania; [2.2]/[2.3] tool conventions around Cursor, Claude Code, project rules and skills; [1.2] harness model
- Assumed from prework: learners know what skills, prompts, rules, tools and harnesses are; they understand that instructions shape agent behavior
- Deepened here: from "I have useful AI artifacts in my project" to "my team can version, distribute, update and remove those artifacts across many repos and tools"
- Avoid repeating: skill anatomy, basic prompt writing, instruction hierarchy theory, single-tool setup basics

## Lesson Job

This lesson turns individual AI workflow artifacts into a team distribution problem. It teaches that skills, rules and commands are not loose notes but operational team assets that affect how agents write, review and modify code. The lesson gives learners a practical decision framework for distributing those assets: use the package registry you already have when the audience is an internal team, reach for managed registry infrastructure only when governance or platform context demands it, and build API+CLI delivery when the audience becomes external, gated, revocable or multi-stack.

## Thesis

AI artifacts are code: they need one source of truth, versioning, auth, install/update/uninstall and multi-tool delivery. The right distribution mechanism is chosen by audience and existing infrastructure, not by how impressive the platform looks.

## Learning Outcomes

- Learner can explain why AI artifacts need code-like distribution rather than Slack/wiki/copy-paste sharing.
- Learner can name the five requirements for an AI-artifact distribution mechanism: one source of truth, versioning, auth, install/update/uninstall, multi-tool delivery.
- Learner can describe the shared source-repo → installer → consumer-repo model used by all three delivery approaches.
- Learner can justify GitHub Packages as the default path for most GitHub-based teams and point to the real complexity: read/write auth asymmetry.
- Learner can recognize when CodeArtifact/Terraform is a conscious managed-infrastructure choice rather than the default.
- Learner can recognize when an external or gated audience forces an API+CLI model and sketch its storage → gate → applicator architecture.
- Learner can use the decision table and practical task to choose a distribution model for their own team.

## Audience Starting Point

The learner has accumulated personal skills, prompts, rules and workflows over the course. They may already have team standards after m5-l3, but those standards still live in scattered documents, copied files or personal setup. They suspect there is a better way to share artifacts, but may overestimate the infrastructure required or assume that a marketplace solves the team problem outright.

## Behavioral Change

The learner stops treating AI artifacts as informal notes and starts shipping them through a versioned distribution channel matched to the audience.

## Owned Concepts

- AI artifacts as code-like assets that require versioning, review and controlled distribution
- Five distribution requirements: source of truth, versioning, auth, install/update/uninstall, multi-tool delivery
- Source-repo / consumer-repo / installer model
- Package-registry analogy for AI artifacts
- GitHub Packages as the default recommendation for GitHub-based teams
- Read/write auth asymmetry in GitHub Packages: write via ephemeral `GITHUB_TOKEN`, read via token plumbing
- Automatic versioning guarded by real package-file diffs
- CodeArtifact/Terraform as managed registry infrastructure for AWS/native-governance contexts
- Reusable distribution patterns: sentinel markers, install manifest, SKILL.md portability
- Plugin marketplaces as a viable single-tool shortcut with lock-in tradeoff
- API+CLI delivery model for external, gated, revocable or multi-stack audiences
- Storage → gate → applicator architecture
- CLI security responsibilities in gated delivery: signing, API host allowlist, sentinel-injection guard
- Audience-first decision table

## References Only

- m4-l1 multi-repo framing: referenced as prior vocabulary about synchronization and one source of truth, not retaught
- m5-l3 review standards / DoD: used only as implied payload for a `code-review` skill, not taught deeply
- m5-l1 AI Internal Builders: referenced as the place where building internal tools belongs, not re-explained
- MCP: absent from the main draft body; only appears indirectly through the optional Simon Willison link in materials
- Prework [3.2] instruction hierarchy: assumed as vocabulary

## Must Not Cover

- Deep review-standard design or DoD content from m5-l3
- Full implementation of MCP servers or MCP-based artifact delivery
- Internal toolkit commands in learner-facing prose; learner-facing commands stay at `10x auth` / `10x get`
- Beginner AWS, IAM or Terraform tutorial; CodeArtifact/Terraform appears as a concrete managed-infrastructure model with gotchas
- Full implementation of the API+CLI product; this lesson explains why and when the model exists, plus its architecture and security responsibilities
- Exact publishing integration into platform or Circle content

## Required Example Or Demo

The lesson uses the author's real distribution path as its running example:

- GitHub Packages as the production/default model for an internal team toolkit.
- CodeArtifact + Terraform as the earlier webinar-built, managed-infrastructure variant.
- `10x-cli` as the API+CLI model learners already use through `10x auth` and `10x get`.

The practical artifact is a minimal team AI pack generated from course-provided specs, starter templates, and meta-loop skills via `10x get m5l4`, centered on a `code-review` skill derived from team conventions, a `package.json`, installer/uninstaller examples, consumer `.npmrc`, and a workflow publishing to GitHub Packages. The AWS appendix also ships `/create-skill`, `/pack-init`, `/tf-registry`, and `/setup-cicd` as Model 2 pipeline wrappers.

## Structural Logic Map

1. **Beat: individual workflow becomes a team problem.**
   - Question answered: why does this lesson exist after weeks of individual AI workflow work?
   - Introduces: the drift problem in multi-repo setups; "one source of truth + distribution mechanism"
   - Depends on: m5-l3 team standards and earlier course work with skills/rules/prompts
   - Sets up: artifact-as-code thesis
   - Diagram opportunity: none
   - Risk: re-teaching m4-l1 multi-repo concepts instead of using a short bridge

2. **Beat: AI artifacts are code.**
   - Question answered: why are skills, rules and commands not just notes?
   - Introduces: AI artifacts as instructions that affect agent behavior; stale artifact as silent system bug
   - Depends on: learner recognizing skills/rules as part of their workflow
   - Sets up: package-registry analogy
   - Diagram opportunity: none
   - Risk: over-dramatizing; the point is operational, not philosophical

3. **Beat: package registries solve the copy-paste problem.**
   - Question answered: what mature engineering pattern maps to this problem?
   - Introduces: publish, declare dependency, version, access control; registry-agnostic file payload
   - Depends on: artifacts-as-code thesis
   - Sets up: distribution requirements
   - Diagram opportunity: none
   - Risk: sounding JavaScript-only; the draft explicitly states npm is an example, not the universal requirement

4. **Beat: five requirements for distribution.**
   - Question answered: how do we evaluate any proposed mechanism?
   - Introduces: one source of truth, versioning, auth, install/update/uninstall, multi-tool delivery
   - Depends on: registry analogy
   - Sets up: source repo + installer model
   - Diagram opportunity: none
   - Risk: abstract checklist; each requirement needs a concrete failure consequence

5. **Beat: source repo, installer and consumer repos.**
   - Question answered: what is common across all delivery models?
   - Introduces: source-of-truth repo, consumer repos, installer, sample `ai-toolkit/` package shape
   - Depends on: requirements list
   - Sets up: three model spectrum
   - Diagram opportunity: yes — source repo → installer → consumer repo, already present in draft
   - Risk: installer concept must be clear before GitHub Packages and API+CLI reuse it

6. **Beat: three models and marketplace caveat.**
   - Question answered: what options exist, and why not just use a marketplace?
   - Introduces: GitHub Packages, CodeArtifact/Terraform, API+CLI; marketplace as single-tool shortcut with lock-in tradeoff; Matt Pocock practitioner signal
   - Depends on: shared model
   - Sets up: detailed model walkthrough
   - Diagram opportunity: none
   - Risk: marketplace must not become a fourth full model

7. **Beat: Model 1 — GitHub Packages.**
   - Question answered: what should most GitHub-based teams do first?
   - Introduces: `publishConfig`, consumer `.npmrc` scope mapping, pipeline flow, internal toolkit example
   - Depends on: source repo + installer model
   - Sets up: auth complexity and versioning
   - Diagram opportunity: yes — skill/rule → pack → CI/CD → registry → team repo, already present in draft
   - Risk: hiding the real complexity; the next subsection must surface auth asymmetry immediately

8. **Beat: GitHub Packages auth and release pitfalls.**
   - Question answered: where does the simple model actually hurt?
   - Introduces: write via `GITHUB_TOKEN`, read via PAT/token plumbing, same-org exception, third-party CI secret sync, `preinstall` token line, version automation with diff gate, duplicate version risk
   - Depends on: Model 1 setup
   - Sets up: why heavier infrastructure sometimes makes sense
   - Diagram opportunity: none; code snippet and image carry the point
   - Risk: aging claims around PAT support must be rechecked before publication

9. **Beat: Model 2 — managed registry infrastructure.**
   - Question answered: when is the heavier registry model justified?
   - Introduces: CodeArtifact + Terraform webinar build, author platform-engineering background, OIDC, domain/repository/scope vocabulary, Terraform/IAM cost lines and gotchas
   - Depends on: GitHub Packages baseline
   - Sets up: reusable patterns
   - Diagram opportunity: none required; video placeholder carries walkthrough
   - Risk: turning into an AWS tutorial; keep it as a decision model plus gotchas

10. **Beat: patterns that survive every model.**
    - Question answered: what design decisions stay useful regardless of registry choice?
    - Introduces: sentinel markers, idempotent updates, manifest-based uninstall, SKILL.md portability
    - Depends on: two registry models
    - Sets up: API+CLI model
    - Diagram opportunity: images/snippets already support sentinel and manifest examples
    - Risk: installer internals can bloat; Deep Dive owns extra detail

11. **Beat: Model 3 — API+CLI for external/gated audiences.**
    - Question answered: why does the course use `10x-cli` instead of just publishing an npm package?
    - Introduces: external/gated audience, multi-stack audience, progressive release, storage → gate → applicator architecture, magic link, local entitlement lookup, time-gating
    - Depends on: understanding package-registry limits
    - Sets up: CLI security mechanisms
    - Diagram opportunity: yes — storage → gate → applicator → workspace, already present in draft
    - Risk: internal implementation details must stay illustrative, not turn into build instructions

12. **Beat: CLI as safety boundary.**
    - Question answered: why does a CLI do more than write files?
    - Introduces: Ed25519 signing, API host allowlist, sentinel-injection guard, different threat model than trusted package registry
    - Depends on: API+CLI architecture
    - Sets up: final decision table
    - Diagram opportunity: screenshots/images support signing and allowlist
    - Risk: security claims should stay tied to concrete delivery risks

13. **Beat: decision table and failure mode.**
    - Question answered: how do I choose for my organization?
    - Introduces: audience-first model selection, "distribution under CV" failure mode
    - Depends on: all three models
    - Sets up: practical tasks and bridge to async/remote agents
    - Diagram opportunity: table is the visual
    - Risk: table must not introduce new unsupported facts

14. **Beat: practice, badge, Deep Dive and materials.**
    - Question answered: what do I do after reading?
    - Introduces: decision exercise, `10x get m5l4` spec-driven team pack exercise, Deep Dive topics and optional sources
    - Depends on: decision framework
    - Sets up: m5-l5 async/remote delegation
    - Diagram opportunity: none
    - Risk: task 2 must clearly default to GitHub Packages even though some specs mention AWS

## Failure Mode To Disarm

The main failure mode is **CV-driven distribution**: choosing the most impressive model instead of the audience-matched model. A team with internal GitHub-based consumers does not need to build a full API+CLI or Terraform-managed registry just to share skills. The lesson disarms this through the audience-first table, the "GitHub Packages as default" recommendation and the cautionary CodeArtifact story.

The secondary failure mode is **copy-paste normalization**: treating team AI artifacts as loose wiki/Slack material because proper distribution sounds too heavy. The lesson disarms this by showing the simplest viable model is mostly package metadata plus auth plumbing.

## Suggested Structure

1. **Intro prose** — personal workflow → team drift → one source of truth + distribution mechanism.
   ```text
   Previous beat -> this beat -> next beat:
   m5-l3/team standards exist -> those artifacts now need to travel -> artifacts as code.
   ```

2. **Artefakty AI to kod** — why skills/rules/commands deserve code-like treatment; package-registry analogy.
   ```text
   Previous beat -> this beat -> next beat:
   Drift pain -> mature package distribution pattern -> evaluation requirements.
   ```

3. **Czego potrzebuje dystrybucja artefaktów AI** — five requirements.
   ```text
   Previous beat -> this beat -> next beat:
   Package analogy -> concrete criteria -> shared source repo/installer model.
   ```

4. **Repozytorium ze źródłem prawdy** — source repo, consumer repos, installer, sample package shape.
   ```text
   Previous beat -> this beat -> next beat:
   Criteria -> common architecture -> three model choices.
   ```

5. **Trzy modele dystrybucji** and **A co z marketplace'ami?** — model preview, practitioner signal, marketplace caveat.
   ```text
   Previous beat -> this beat -> next beat:
   Shared architecture -> option space and non-default alternatives -> default model.
   ```

6. **Model 1: GitHub Packages** — default path, config snippets, pipeline, auth asymmetry, versioning and pitfalls.
   ```text
   Previous beat -> this beat -> next beat:
   Option space -> most teams' recommended path and real cost -> heavier managed registry.
   ```

7. **Model 2: Rejestr jako gotowa infrastruktura** — CodeArtifact/Terraform retrospective, when it wins, gotchas, video placeholder.
   ```text
   Previous beat -> this beat -> next beat:
   Simple registry -> conscious managed-infra variant -> model-independent installer patterns.
   ```

8. **Wzorce, które przeżyją każdy model** — sentinel markers, manifest, SKILL.md portability.
   ```text
   Previous beat -> this beat -> next beat:
   Registry variants -> reusable design patterns -> API+CLI product model.
   ```

9. **Model 3: Pełny produkt z API i CLI** — why `10x-cli` exists, architecture, gated access and security responsibilities.
   ```text
   Previous beat -> this beat -> next beat:
   Reusable patterns -> external/gated audience constraints -> final decision table.
   ```

10. **Tabela decyzyjna i alternatywy** — model comparison, audience-first choice, anti-overbuild warning, bridge to m5-l5.
    ```text
    Previous beat -> this beat -> next beat:
    Three models -> practical choice -> exercises.
    ```

11. **🧑🏻‍💻 Zadania praktyczne** — decision-table exercise and spec-driven team pack bootstrap.

12. **Odbierz swoją odznakę** — standard badge section.

13. **🔎 Deep Dive** — installer anatomy, private/public CLI contract, meta-loop of skills that rebuild the pipeline.

14. **📚 Materiały dodatkowe** — webinar, SKILL.md standard, GitHub Packages docs, marketplace docs, Matt Pocock signal, Simon Willison post, prework reference.

## Video Placeholders

- Existing placeholder in draft: webinar "Od chaosu do AI-Native Infrastructure", placed in Model 2, explicitly framed as a full walkthrough of the CodeArtifact/Terraform variant rather than the default recommendation.
- Separate course video scenario already exists under `lessons/m5-l4/videos/video-spec-driven-team-pack.md`; this spec should not overwrite it. It should be checked against the current draft if a video/text sync pass is requested.

## Bridge In

The lesson bridges from the previous teamwork/code-review material by assuming that team AI standards and artifacts now exist. It also references the earlier multi-repo synchronization problem as prior vocabulary, then shifts quickly to the distribution mechanism.

## Bridge Out

The lesson closes by saying that once standards, pipelines and shared registry/context exist, the next frontier is using that foundation for async and remote agents. That sets up m5-l5 without teaching it.

## Open Questions

- Re-check current GitHub Packages auth limitations before publication, especially classic PAT vs fine-grained PAT support.
- Task 2 filenames delivered by `10x get m5l4` are resolved in course-content: shared inputs use `m5l4-shared-*`, the default GitHub Packages path uses `m5l4-github-packages-*`, and the optional AWS appendix uses `m5l4-codeartifact-*`.
- Decide whether `lessons-schema.json` should be updated to mark status as `drafted` after this spec/draft alignment.
- Optional future cleanup: some grounding-source notes in schema still use stale "Model 1/Model 2" labels from before the current draft order.

## Side-Effect Ledger

New claims introduced: none beyond reflecting the existing draft
Claims removed: removed stale spec claims that said the analytical body still used old neighbor names and that schema enrichment targeted `m5-l3`
Neighboring lesson references changed: bridge-out now points to m5-l5 async/remote agents, matching the draft
Prework references used: [3.2], [2.2]/[2.3], [1.2]
Prework concepts repeated intentionally: instruction hierarchy and tool conventions only as assumed context
Potential duplicates: m4-l1 multi-repo framing, mitigated as a brief back-reference; m5-l3 review standards, kept as payload only
Unsupported facts: current GitHub Packages auth limitations remain time-sensitive and need recheck before publication
Video/text mismatches: `video-spec-driven-team-pack.md` updated to use the model-labeled handout names
Needs human decision: schema status update; whether to clean stale grounding labels in schema
