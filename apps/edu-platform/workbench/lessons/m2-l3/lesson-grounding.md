# Lesson Grounding: m2-l3 — Solo Code Review: weryfikuj kod AI szybko i skutecznie

## Scope

- Lesson source: schema + `lessons/m2-l3/lesson-spec.md`
- Neighbor boundaries: m2-l4 owns phase-by-phase implementation, verification gates, commit ritual, and context assessment; m2-l5 owns parallel/headless work without `/10x-impl-review-ci`; M3 owns automated CI review. m2-l3 owns the interactive single-change review loop and human triage before merge.
- Relevant prework: [3.2] prompt jako kontrakt and code-review template, [1.3] generation-then-comprehension and "approve bez obrony", [2.4] agent-native IDE risks around reduced visibility, review, diffs, scope, and secrets.
- Research posture: standard, with current verification for 10x skill behavior, AI review product behavior, and recent AI-code verification signals.

## Claims To Support

- `/10x-impl-review` uses a 6-dimensional implementation review scorecard: Plan Adherence, Scope Discipline, Safety & Quality, Architecture, Pattern Consistency, and Success Criteria — matters because schema had older shorthand dimensions — needs canonical skill source.
- `/10x-impl-review` is a review plus interactive triage system, not an automatic fixer — matters because the lesson's behavioral change is judgment, not "ask another agent to approve" — needs canonical skill source.
- Severity and impact are separate axes — matters because the lesson teaches "fix all" overcorrection as a failure mode — needs canonical skill source and practitioner framing.
- `accept as recurring rule` is a real triage branch that writes to project memory artifacts — matters because the lesson turns review findings into durable context — needs `/10x-lesson` canonical source.
- Review should check design/scope, functionality, tests, naming, readability, and code health, not only whether the diff compiles — matters because it grounds diff-reading heuristics — needs established code review guidance.
- AI-generated or AI-assisted code can create security and verification risks even when it looks plausible — matters because the lesson needs a non-moralizing reason for review-before-merge — needs papers/survey evidence.
- AI review tools can help surface findings but do not remove human approval and triage responsibility — matters because m2-l3 should not teach "AI approves AI" — needs current official tool docs and recent research.
- Learner-facing CLI wiring for `m2l3` is approved as planned course-content wiring and should include `/10x-impl-review` and `/10x-lesson` — matters because the draft can now give exact `10x get m2l3` instructions.

## Strong Sources

### 10x-impl-review skill source

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-impl-review/SKILL.md`
- Type: official-docs
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-14
- Supports:
  - `/10x-impl-review` compares implementation against the original plan before drift, dangerous decisions, architecture violations, and pattern misuse compound.
  - The canonical six dimensions are Plan Adherence, Scope Discipline, Safety & Quality, Architecture, Pattern Consistency, and Success Criteria.
  - Findings carry severity, impact, dimension, location, detail, and fix options.
  - Impact is orthogonal to severity and describes decision effort, not how bad the bug is.
  - The interactive triage loop offers fix, skip, accept risk, accept as recurring rule, and disagree/dismiss outcomes.
- Use in lesson:
  - Update schema/draft wording to use the exact six dimensions, not the older shorthand list.
  - Teach the scorecard briefly, then spend the lesson's energy on triage judgment.
  - Model "skip" and "disagree" as valid expert moves when the finding is low-impact or wrong.
- Confidence: high
- Notes:
  - The report uses emoji and box-drawing in the tool output, but the lesson can simplify visual design for the article.

### 10x-lesson skill source

- URL: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-lesson/SKILL.md`
- Type: official-docs
- Author/publisher: 10x-toolkit / Przeprogramowani
- Checked: 2026-05-14
- Supports:
  - `/10x-lesson` appends recurring rules to `context/foundation/lessons.md`.
  - The bar is a recurring pattern that would have changed past work and will keep coming up, not a one-off bug.
  - Future frame, research, plan, plan-review, implement, and impl-review runs re-read this artifact as a prior.
- Use in lesson:
  - Frame `accept as recurring rule` as project memory created during review, not as a side quest.
  - In the demo, use it for a repeated pattern violation, not a single local typo.
- Confidence: high
- Notes:
  - m1-l4 introduced this concept; m2-l3 should reinforce it only as a triage outcome.

### Google Engineering Practices: What to look for in a code review

- URL: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Type: official-docs
- Author/publisher: Google
- Checked: 2026-05-14
- Supports:
  - Review should cover design, functionality, complexity, tests, naming, comments, style, documentation, and every line in context.
  - Tests are code and need human validation; a passing test is not proof that the test is useful.
  - Over-engineering and unnecessary genericity are valid review concerns.
- Use in lesson:
  - Ground diff-reading heuristics: start with design/scope, behavior, safety, patterns, and tests before style nits.
  - Use as Deep Dive material, not as a full checklist copied into the core lesson.
- Confidence: high
- Notes:
  - Google writes for team review, while this lesson is solo review of agent output. Adapt the principles, do not copy the process.

### Expectations, Outcomes, and Challenges of Modern Code Review

- URL: https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/
- Type: paper
- Author/publisher: Christian Bird, Alberto Bacchelli / Microsoft Research, IEEE ICSE 2013
- Checked: 2026-05-14
- Supports:
  - Finding defects is a major motivation for code review, but reviews also support knowledge transfer, team awareness, and alternative solutions.
  - Code and change understanding is a key aspect of reviewing.
- Use in lesson:
  - Support the idea that review is not only "bug hunt"; it is also comprehension and project memory.
  - Keep the paper in Deep Dive / additional materials, not in the main teaching flow.
- Confidence: high
- Notes:
  - Older paper, but still useful for stable code-review principles.

### Do Users Write More Insecure Code with AI Assistants?

- URL: https://arxiv.org/abs/2211.03622
- Type: paper
- Author/publisher: Neil Perry, Megha Srivastava, Deepak Kumar, Dan Boneh / CCS 2023
- Checked: 2026-05-14
- Supports:
  - In a security-focused user study, participants with access to an AI code assistant wrote less secure code than participants without it.
  - Participants with AI assistance were more likely to believe their code was secure.
  - Lower trust and more active engagement with prompts correlated with fewer vulnerabilities.
- Use in lesson:
  - Ground the "approve bez obrony" risk in AI-assisted programming.
  - Use carefully: it studied Codex-era assistance and security tasks, not every modern agent workflow.
- Confidence: high
- Notes:
  - Good Deep Dive source for the claim that confidence in AI output can outpace actual safety.

### Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions

- URL: https://arxiv.org/abs/2108.09293
- Type: paper
- Author/publisher: Hammond Pearce, Baleegh Ahmad, Benjamin Tan, Brendan Dolan-Gavitt, Ramesh Karri / IEEE S&P 2022
- Checked: 2026-05-14
- Supports:
  - Copilot-generated code was evaluated across security-relevant scenarios and a substantial share of generated programs were vulnerable.
  - Prompt/context changes can affect whether insecure code is suggested.
- Use in lesson:
  - Support the general caution that plausible generated code still needs security-oriented review.
  - Avoid using the exact vulnerability percentage as a current benchmark for all AI coding tools.
- Confidence: medium
- Notes:
  - Older Copilot study; still useful historically, but product/model behavior has changed.

### Claude Code Review documentation and launch post

- URL: https://code.claude.com/docs/en/code-review
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-05-14
- Supports:
  - Automated PR review is framed around logic errors, security vulnerabilities, regressions, and full-codebase multi-agent analysis.
  - Repo-specific review instructions can recalibrate severity, cap nits, skip generated files, and require evidence before findings are posted.
  - Anthropic's launch post explicitly says Code Review does not approve PRs; approval remains a human call.
- Use in lesson:
  - Use as external confirmation that serious AI review systems rank severity and still preserve human approval.
  - Keep product details out of core lesson unless the article intentionally compares `/10x-impl-review` to commercial PR review.
- Confidence: high
- Notes:
  - Pricing and product availability are time-sensitive; recheck before mentioning them in learner-facing prose.

### SWE-PRBench: Benchmarking AI Code Review Quality Against Pull Request Feedback

- URL: https://arxiv.org/abs/2603.26130
- Type: paper
- Author/publisher: Deepak Kumar / arXiv
- Checked: 2026-05-14
- Supports:
  - AI code review quality still lags expert human PR feedback in the benchmark's setup.
  - More context is not automatically better; context provision strategy matters.
- Use in lesson:
  - Support the caution that AI review is a decision-support step, not a replacement for human judgment.
  - Align with `/10x-impl-review` behavior: compare code to plan and scope, then triage findings.
- Confidence: medium
- Notes:
  - New 2026 preprint; useful directional evidence, not settled industry truth.

## Practitioner Signals

### Sonar 2026 State of Code survey

- URL: https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/
- Type: practitioner-signal
- Signal:
  - Developers report a verification bottleneck around AI-assisted code: many do not fully trust AI output, but fewer always verify before committing.
  - A meaningful share reports that reviewing AI-generated code takes more effort than reviewing human-written code.
- Useful language:
  - "verification bottleneck"
  - "vibe, then verify"
  - "verification debt"
- Risk:
  - Vendor survey and press release; useful for current industry language, weaker than primary research for causal claims.
- Confidence: medium

### Reddit / ExperiencedDevs discussion on AI-generated review

- URL: https://www.reddit.com/r/ExperiencedDevs/comments/1t1zfsz/does_ai_generated_code_change_the_review_process/
- Type: community-discussion
- Signal:
  - Practitioners debate whether AI-generated code needs a different process, but recurring themes are: understand the code, scrutinize tests/approach, reject code nobody can explain, and treat AI findings critically too.
- Useful language:
  - "is this the right approach?"
  - "is it solving the right problem?"
  - "I don't accept 'this is probably fine' if nobody understands it."
- Risk:
  - Anecdotal and emotionally loaded; use only for objections and language, not factual claims.
- Confidence: low

### Reddit / GitHub discussion on AI making PRs harder to review

- URL: https://www.reddit.com/r/github/comments/1rofktt/is_ai_coding_making_pull_requests_harder_to_review/
- Type: community-discussion
- Signal:
  - Practitioners worry that AI tools make it easier to create large diffs where sensitive changes like auth, permissions, billing, API contracts, or deployment config get buried.
- Useful language:
  - "risky changes buried in a big diff"
  - "special attention to certain file types"
  - "structured review checklists"
- Risk:
  - Community discussion; good for naming the anxiety, weak for measurement.
- Confidence: low

## Examples Worth Using

- Continue the 10xCards S-01 slice from m2-l4. Run `/10x-impl-review` against the finished `plan.md`, show the verdict table, then pick 3-4 findings for triage.
- Use one CRITICAL or FAIL finding with LOW/MEDIUM impact as the "fix now" case: obvious, scoped, and worth applying.
- Use one WARNING with HIGH impact as the "pause and reason" case: architecture/scope tradeoff, not a drive-by edit.
- Use one OBSERVATION with LOW impact as the "skip" case to disarm fix-all overcorrection.
- Use one recurring pattern for `accept as rule`, such as "new server actions must reuse the existing auth guard pattern."
- Diff-reading heuristic stack for AI-generated code:
  - Scope first: did the agent change only what the plan allowed?
  - Boundaries next: auth, permissions, data writes, external calls, migration/deploy config.
  - Plan adherence: did the implementation solve the intended slice or a nearby-but-different problem?
  - Existing patterns: did it invent abstractions, names, handlers, or error shapes the repo does not use?
  - Tests last in core, but not as "test strategy": do tests exist where expected, and would they fail for the bug this change could introduce?

## Claims To Avoid Or Soften

- "AI-generated code is usually insecure" — too broad. Say that AI assistance can introduce security risks and false confidence, especially without explicit verification.
- "`/10x-impl-review` guarantees safe code" — false. It is a structured review aid plus triage workflow.
- "Automated AI review replaces human review" — false. Current official product language and research both support keeping a human decision point.
- "Severity tells you what to do" — incomplete. Severity tells how bad the problem is; impact tells how much decision effort the fix needs.
- "Fix every finding" — this is the lesson's primary anti-pattern. Normalize skip, accept risk, and disagree when justified.
- "More context always improves AI review" — recent benchmark evidence suggests context strategy matters and more context can dilute attention.
- "`m2l3` CLI pack is already present in local course-content wiring" — unsupported as of 2026-05-14. The editorial decision is to add it, so draft may mention the planned learner-facing ref, but RC should verify the actual lesson definition before publication.

## Open Verification Questions

- Course-content wiring for module 2 is not present in `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/` as of 2026-05-14. Editorial decision: add `m2l3` to the CLI pack with `/10x-impl-review` and `/10x-lesson`; RC should verify the actual lesson definition before publication.
- The demo needs a concrete 10xCards S-01 implementation artifact from m2-l4. Once available, rerun the grounding pass lightly against the actual plan path and sample review output.
- Decide whether the learner-facing article should mention external Claude Code Review at all. It is useful context, but it belongs in Deep Dive unless the lesson explicitly compares local interactive review to PR review tooling.

## Schema Source Update

Updated `workbench/lessons-schema.json` only for `m2-l3`:

- Corrected the `/10x-impl-review` scorecard wording from the older shorthand dimensions to the canonical six dimensions from the skill source.
- Added `groundingSources` for the canonical 10x skill sources, stable code-review guidance/research, current AI-review docs, and selected AI-code security/review evidence.
- Replaced the resolved unsupported fact about exact scorecard dimensions with the editorial decision that `m2l3` will be added to learner-facing course-content wiring.
- Updated neighbor boundary: `/10x-impl-review-ci` is no longer introduced in m2-l5; it moves to M3.
