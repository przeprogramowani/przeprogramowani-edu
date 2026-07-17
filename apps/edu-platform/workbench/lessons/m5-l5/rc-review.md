# RC Review: m5-l5 — Innovate: Async & Remote Agents - deleguj i zajmij się czymś innym

## Verdict

Not ready

The draft has a clear through-line and mostly respects the lesson boundaries, but two RC-level gaps remain: the required video scenario artifact is missing, and the required concrete sandbox/phone demo is only represented by placeholders plus a generic runbook. Those are not polish issues; they block production handoff because the lesson contract explicitly makes this a demo-backed async delegation lesson.

## Findings

### Major: Required video scenario artifact is missing

- Evidence: `lessons-schema.json` marks `video-scenario` as a required artifact for `m5-l5`; `lesson-spec.md` defines a primary video map at lines 239-242 and 333-350; `find lessons/m5-l5/videos` returns no files, and the lesson folder has no `videos/` directory. The current draft contains raw placeholders at `lesson-draft.md:115` and `lesson-draft.md:141`.
- Why it matters: the spec requires video/text alignment for a concrete remote/cloud run. Without a scenario, production cannot verify whether the screencast will prove the thesis or introduce ungrounded product behavior.
- Required fix: create `lessons/m5-l5/videos/video-delegate-from-phone.md` at minimum. It should show a bounded task, setup/network/MCP choices, cloud or remote run start, laptop-away/phone-monitoring moment, and review of output. If `sandbox-config` remains as a second placeholder, either create a second scenario or remove/defer that placeholder explicitly.
- Source check: schema + `lesson-spec.md`; no external source needed.

### Major: The required concrete sandbox/phone demo is not actually present in the draft

- Evidence: `lesson-spec.md:111-115` requires a two-part anchor: cloud sandbox config payload plus delegate-from-phone walkthrough. `lesson-draft.md:61-113` explains the reusable sandbox model well, but it never walks through a concrete bounded task with an actual runbook example, setup choice, network choice, MCP choice, and review criteria. `lesson-draft.md:131-141` lists a generic workflow and then inserts `[VIDEO PLACEHOLDER: delegate-from-phone]`, but the text itself does not demonstrate the promised run.
- Why it matters: the lesson's behavioral change is "delegate bounded work and reclaim attention while keeping review control." A learner can understand the concept, but they do not see one complete operational pass before the practical task asks them to perform it.
- Required fix: add one compact example before or around the primary video placeholder. Use a specific but low-risk task, for example "update docs/test-plan for one module"; show the runbook fields, the environment assumptions, what goes into setup, what network/MCP/secrets are allowed, what the phone monitoring checks, and what the final review checklist proves. Keep it tool-agnostic first, with Claude Code on the web or Codex Cloud as examples only where facts are verified.
- Source check: supported by `lesson-spec.md`; current product behavior checked against [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web), [Codex cloud environments](https://developers.openai.com/codex/cloud/environments), and [Codex internet access](https://developers.openai.com/codex/cloud/internet-access).

### Minor: MCP is used as a key sandbox knob without a full first-use gloss

- Evidence: `lesson-draft.md:73-79` introduces "MCP i konfigurację narzędzi" and explains that local MCP configuration may not travel to the cloud, but it does not briefly say what MCP is in this context. The draft later treats MCP as a runbook field at `lesson-draft.md:101`, `lesson-draft.md:135`, `lesson-draft.md:183`, `lesson-draft.md:207`, and `lesson-draft.md:242`.
- Why it matters: MCP is one of the lesson's owned configuration dimensions. Even if the learner has seen the acronym before, the editorial contract requires first substantive use to state what the concept is and why it matters now.
- Required fix: at first use, add one sentence such as: "MCP to sposób podpinania narzędzi i serwerów do agenta; w sandboxie liczy się dlatego, że widoczna jest tylko konfiguracja, którą zdalne środowisko potrafi odczytać." Then keep the `.mcp.json` example.
- Source check: [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web) confirms repo `.mcp.json` carries into cloud sessions while local `claude mcp add` config does not; [OpenAI Codex MCP](https://developers.openai.com/codex/mcp) supports the Codex-side configuration angle.

### Minor: `/loop` remains open for current-behavior verification

- Evidence: the draft owns `/loop` in core at `lesson-draft.md:147-175` and Deep Dive at `lesson-draft.md:271-279`, but the strongest file-level grounding for `/loop` is tool behavior captured in `lesson-grounding.md:217-229`, not a stable public official documentation link. The draft is careful and does not give exact `/loop` syntax, which is good, but it still names `/loop` as an operational option.
- Why it matters: RC review must not accept current product/tool behavior purely from memory or prior research when the lesson tells learners to choose that control mode.
- Required fix: before publication, either attach the strongest available current source for `/loop` behavior in `lesson-grounding.md` and `Materiały dodatkowe`, or soften learner-facing prose to "routines / zaplanowane przebiegi / pętle narzędziowe" where exact `/loop` behavior cannot be verified. Do not expand `/goal` or Ralph to compensate; m2-l5 owns them.
- Source check: [Claude Code routines](https://code.claude.com/docs/en/routines) verifies routines; `/loop` exact behavior remains open verification.

## Spec Compliance

- Thesis: pass. The draft consistently teaches that control moves to setup, monitoring, and review (`lesson-draft.md:7-11`, `177-191`).
- Learning outcomes: issue. The comparison, sandbox model, isolation, and review failure modes are covered, but "delegate and monitor/steer from phone" is still mostly generic text plus a placeholder instead of a demonstrated run.
- Behavioral change: issue. The practical task points the learner toward the right behavior, but the lesson does not yet model one complete execution path before asking the learner to do it.
- Required example/demo: issue. The required demo anchor is not fulfilled in text or a video scenario.
- Failure mode: pass. "Green run != success", budget, access, loops, and review risk appear in `lesson-draft.md:11`, `162-175`, `211-215`.
- Bridge in/out: pass. The draft bridges from m5-l4 and m2-l5 without re-teaching them, and closes the module cleanly.

## Coherence And Flow

- Through-line: control starts as a fear of losing real-time supervision, becomes a control-moment decision, moves through local remote control, managed sandboxes and scheduled loops, then resolves in setup/monitoring/review responsibility.
- Promise ledger:
  - `lesson-draft.md:5-11` promises control moment, sandbox preparation, bounded delegation, and green-status skepticism -> paid by the mode table, sandbox sections, failure-mode section, and practical task.
  - `lesson-draft.md:17` asks when the human controls work -> paid by the table at `lesson-draft.md:19-23` and mode explanations at `27-31`.
  - `lesson-draft.md:59` promises six sandbox questions -> paid by H3 sections at `61`, `67`, `73`, `81`, `87`, `93`.
  - `lesson-draft.md:131` promises a practical run shape -> partially paid by the seven-step list at `133-139`; still weakened by the absent concrete demo and raw video placeholder.
  - Deep Dive intro bullets at `lesson-draft.md:227-230` -> paid by subsections at `234`, `251`, `261`, `271`.
- Dependency gaps: none that break ordering. The draft assumes agent/harness/cloud/background vocabulary from prework and dependencies, which matches the schema.
- Adequacy gaps: MCP needs a first-use what+why-now gloss. `/loop` also needs source confidence, but the draft gives enough local meaning for a reader to follow the section.
- Logical holes: the core argument is coherent, but the "you can do this" proof is under-demonstrated because the required concrete run is missing.
- Flow interruptions: none severe. The Deep Dive is clearly separated and Cloudflare Agents stays references-only rather than intruding into Core.
- Opening/ending symmetry: pass. The opening fear of losing control resolves in the final sequence: choose control mode, configure environment, delegate bounded work, review later.

## Grounding And External Checks

- Verified claims:
  - Claude Code on the web is research preview for Pro/Max/Team and eligible Enterprise users; sessions run on Anthropic-managed cloud infrastructure, persist after browser close, and can be monitored from the Claude mobile app. Source: [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web).
  - Claude cloud sessions start from a repo clone; committed `.mcp.json` is available, while user-local `claude mcp add` configuration does not carry over. Source: [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web).
  - Codex cloud tasks run setup first, then apply internet settings; setup has internet, while agent-phase internet is off by default unless configured. Source: [Codex cloud environments](https://developers.openai.com/codex/cloud/environments) and [Codex internet access](https://developers.openai.com/codex/cloud/internet-access).
  - Happy controls a local Claude Code/Codex session from phone/web through an end-to-end-encrypted relay; the relay moves encrypted blobs and does not run the agent. Source: [Happy repo](https://github.com/slopus/happy) and [How Happy works](https://happy.engineering/docs/how-it-works/).
  - Anthropic's sandboxing rationale supports the lesson's filesystem + network isolation point and explicitly links sandbox boundaries to safer autonomy. Source: [Claude Code sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing).
  - Cloudflare Agents + Workflows are correctly positioned as a build-your-own durable async runtime path, not a fourth cloud coding sandbox. Source: [Cloudflare Agents](https://developers.cloudflare.com/agents/) and [Workflows for Agents](https://developers.cloudflare.com/agents/concepts/workflows/).
- Unsupported or softened claims:
  - SSH/tmux is correctly presented as a known practitioner baseline, not as a first-party product spec.
  - Exact product limits, installed tool lists, cache durations, pricing, and tiers are mostly kept out of learner-facing prose or pushed to "verify before production" language.
  - The 84% sandboxing figure from Anthropic grounding is not surfaced in the draft, which avoids vendor-stat overclaiming.
- Open verification:
  - Exact `/loop` behavior and a stable source/link for learner-facing materials.
  - Exact status/tier/cache/resource/tool-list behavior immediately before publication or recording.
  - Any future claim of first-party Anthropic "Remote Control" mobile mode. The draft currently does not assert it.

## Curriculum Continuity

- Previous lesson fit: good. m5-l4 owns shared AI artifacts and distribution; m5-l5 only consumes that by explaining why committed repo-level config matters in cloud sandboxes (`lesson-draft.md:75-79`).
- Next lesson setup: not applicable; this is the module finale.
- Potential duplicates:
  - m2-l5 owns worktrees, `/goal`, Ralph, and orchestrator survey. The draft references m2-l5 twice and keeps worktrees/orchestrators out. Ralph appears in Deep Dive as lineage, not as a tutorial.
  - m5-l2 owns building agents/SDKs. Cloudflare Agents is kept in Deep Dive and explicitly fenced at `lesson-draft.md:267-269`.
- Scope theft risk: low after current edits. The remaining risk is only if a future video expands Cloudflare Agents into implementation or expands Ralph/`/goal` beyond back-pointer depth.

## Editorial Quality And Economy

- Style guide fit: generally strong. Intro has no `## Wstęp`, paragraphs are short, product details are mostly moved to Deep Dive, and the tone stays practical.
- AI-sounding patterns: low. The repeated "kontrola nie zniknęła, tylko zmieniła miejsce" is intentional through-line rather than accidental filler.
- Polish/prose issues:
  - Mixed English/product terms are mostly justified (`sandbox`, `setup`, `review`, `routine`), but `routine` may need one Polish gloss on first core use if the audience has not seen the product term.
  - `allowlista` is understandable in this technical context.
- Economy (filler / restatement / repeated beats): mostly clean. The final section restates the three modes, but it adds closing synthesis and does not feel decorative.
- Over-narration: none significant. The m2-l5 callbacks are purposeful and not manufactured.

## Diagram Quality

- Diagrams present: 1 Mermaid diagram (`lesson-draft.md:105-111`).
- Placement: placed next to the sandbox setup/runbook claim it visualizes.
- Missing opportunities: none blocking. The control-moment decision table fulfills the main comparison need better than a diagram would.
- Decorative or redundant: not decorative; it compresses the runbook -> setup -> sandbox -> task -> review flow.
- Syntax/rendering: visually valid Mermaid `flowchart LR`; no syntax issue spotted in the source.

## Video Alignment

Issue: no scenario present. The draft has `[VIDEO PLACEHOLDER: sandbox-config]` and `[VIDEO PLACEHOLDER: delegate-from-phone]`, while the spec and schema require at least the primary video scenario. Because no `videos/video-*.md` exists, there is no way to confirm video/text alignment yet.

## Side-Effect Ledger

New claims introduced: (none by this review)
Claims removed: (none)
Neighboring lesson references changed: (none)
Prework references used: [1.2], [2.1], [2.4], [3.3] as assumed context; no new prework dependency introduced
Prework concepts repeated intentionally: cloud/background agent vocabulary; isolation/context vocabulary
Potential duplicates: Ralph and `/goal` with m2-l5 if future edits expand the Deep Dive; Cloudflare implementation depth with m5-l2 if future video becomes a build tutorial
Unsupported facts: exact `/loop` behavior; exact product/tier/cache/resource/tool-list details before publication
Video/text mismatches: cannot evaluate; video scenario missing
Needs human decision: whether `sandbox-config` is a real second video scenario or should be removed/deferred; whether `/loop` gets a verified source or softer phrasing

## Acceptance Checklist

- [ ] Spec compliance blockers resolved
- [ ] Unpaid promises and logical holes resolved
- [ ] Unsupported factual claims resolved or removed
- [ ] Neighboring lesson drift resolved
- [ ] Editorial polish accepted
- [ ] Video scenario aligned or explicitly deferred
