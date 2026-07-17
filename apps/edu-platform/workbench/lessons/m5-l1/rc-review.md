# RC Review: m5-l1 — AI Internal Builders: wewnętrzne narzędzia, serwisy i automatyzacje

## Verdict

Not ready

The lesson draft is broadly aligned with the schema, spec, grounding, neighboring boundaries, and editorial style. The blocking readiness issue is artifact completeness: the schema requires a `video-scenario`, but `lessons/m5-l1/videos/video-*.md` is not present. The draft and spec contain video placeholders; those are not scenario files.

## Findings

### Major: Required video-scenario artifact is missing

- Evidence: `lessons-schema.json` / lesson-context for `m5-l1` lists `video-scenario` in `requiredArtifacts`; `lesson-spec.md` defines three video placeholders; `lesson-draft.md` includes three `[VIDEO PLACEHOLDER: ...]` markers at lines 81, 172, and 295. `find lessons/m5-l1 -maxdepth 2 -type f` shows no `lessons/m5-l1/videos/video-*.md` file.
- Why it matters: the lesson cannot be accepted as a full RC package when one required artifact is absent. The placeholders correctly describe intended video content, but they do not provide a recording-ready scenario or let production check text/video alignment.
- Required fix: create `lessons/m5-l1/videos/video-*.md` scenario file(s) for the three required beats: decision walkthrough, mocked/read-only triage digest demo, and 10xChampion evidence walkthrough. Keep them at decision/demo level and explicitly avoid SDK code, CI implementation, auth, deployment, registry implementation, and remote-agent setup.
- Source check: schema contract and `lesson-spec.md`; no external source required.

## Spec Compliance

- Thesis: pass. The draft teaches the promised frame: team friction -> SaaS responsibility -> complement before building -> first useful version.
- Learning outcomes: pass. The draft covers buy/default vs complement/build, SaaS platform responsibility, the opportunity map, first useful version, AI lowering prototype cost without removing maintenance, trust/influence without promotion guarantees, and screenshot-based 10xChampion evidence.
- Behavioral change: pass. The practical task requires mapping friction before building.
- Required example/demo: pass in prose/draft placeholder. The generic company scenario uses GitHub, Linear/Jira, CI, release notes, and an internal company DB; the digest remains mocked/read-only and does not implement SDK/CI/auth/deployment.
- Failure mode: pass. The SaaS-replacement fantasy is explicitly disarmed in `SaaS to nie tylko funkcje`, `Kup, uzupełnij albo zbuduj`, and `Pierwsza użyteczna wersja`.
- Bridge in/out: pass. Bridge in from m4-l5 is light and appropriate; bridge out to m5-l2/m5-l3/m5-l4/m5-l5 is routing-level, not implementation-level.

## Coherence And Flow

- Through-line: the lesson moves from repeated team friction, through SaaS/platform responsibility and an opportunity map, to a small read-only helper and evidence path for Module 5 team workflows.
- Promise ledger:
  - Opening question "co w pracy zespołu regularnie traci czas, uwagę i energię?" -> paid in `Tarcie zespołu jako sygnał` and the opportunity-map examples.
  - "Potrzebujesz prostego filtra" -> paid by the three categories in `Kup, uzupełnij albo zbuduj` and the five-field map in `Mapa okazji dla internal buildera`.
  - "Zanim zbudujemy pierwszego agenta zespołowego..." -> paid by `Jak helper dojrzewa`, which routes to m5-l2 only after helper validation.
  - "SaaS to nie tylko funkcje" -> paid by the platform-responsibility explanation and the replace-vs-complement guardrail.
  - "Zobacz trzy przykładowe klasyfikacje" -> paid by three concrete map rows.
  - "Co dalej, jeśli digest naprawdę pomaga?" -> paid by explicit M5 path routing.
  - "Dlaczego warto się tym zajmować?" -> paid by the trust/influence section without promotion overclaim.
  - Video placeholders -> text placeholders are present, but scenario-file payoff is missing; tracked as Major artifact finding, not a prose-flow defect.
- Dependency gaps: none. Prework-owned terms (`agent`, `harness`, prompt/context discipline) are referenced lightly as assumed background. New lesson terms (`tarcie zespołu`, `uzupełnienie`, `internal builder`, `mapa okazji`, `pierwsza użyteczna wersja`) are introduced before substantive use.
- Adequacy gaps: none material. `SaaS`, `cienki helper`, `system źródłowy`, `PoC`, and `tenant` receive enough what+why-now context at first teaching use.
- Logical holes: none found. The sensitive-data caveat correctly narrows the "no auth/deploy" first-version rule.
- Flow interruptions: none requiring revision. The map example for "Poranny status projektu" is later expanded into the digest example; this is a useful zoom-in, not a dropped or duplicated thread.
- Opening/ending symmetry: pass. The opening tension ("team work loses time across tools") resolves in a concrete map, helper boundary, Module 5 route, and 10xChampion evidence plan.

## Grounding And External Checks

- Verified claims:
  - SaaS as provider-hosted application/platform responsibility is supported by NIST's SaaS glossary and AWS Well-Architected SaaS Lens: https://csrc.nist.gov/glossary/term/software_as_a_service and https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/saas-lens.html
  - "Start simple / add agentic complexity only when needed" is supported by Anthropic's *Building effective agents*: https://www.anthropic.com/engineering/building-effective-agents
  - Vendor-native triage/summarization examples are current enough for the draft's generic claim: Linear Triage Intelligence documents LLM-based routing/suggestions, and GitHub's blog has a 2026 issue-triage Copilot SDK example: https://linear.app/docs/triage-intelligence and https://github.blog/ai-and-ml/github-copilot/building-ai-powered-github-issue-triage-with-the-copilot-sdk/
  - Internal-tool maintenance risk and coordination-signal framing are grounded in `lesson-grounding.md` sources; the draft uses them at implication level rather than academic-citation level.
- Unsupported or softened claims:
  - none requiring draft change. The career section is correctly softened to trust/influence, not promotion.
- Open verification:
  - none for current prose. Recheck vendor feature details only if a future edit names exact plan gates, product mechanics, or availability.

## Curriculum Continuity

- Previous lesson fit: pass. The m4-l5 bridge is light and only shifts from project/domain modernization to team friction. It does not re-teach DDD, event storming, or post-MVP planning.
- Next lesson setup: pass. m5-l2 owns SDK construction, privacy, costs, metrics, and the concrete local agent. m5-l1 only routes there after the helper has proven value.
- Potential duplicates: controlled. The draft references m5-l3 review pipeline, m5-l4 Shared AI Registry, and m5-l5 async/remote operation as later paths without teaching their mechanics.
- Scope theft risk: low. The strongest boundary-sensitive spots are the "Review bez jasnych kryteriów" and "Artefakty AI kopiowane ręcznie" examples, but they remain classification rows, not implementation guidance.

## Editorial Quality And Economy

- Style guide fit: good. The opening is recognition-level, paragraphs are short, headings are readable, and the lesson uses direct address without becoming generic motivation.
- AI-sounding patterns: low. The draft avoids heavy inline research citations and avoids turning sources into name-drops.
- Polish/prose issues: no RC-blocking issues. One optional polish pass could tighten a few English/Polish hybrids (`Morning delivery digest`, `internal builder`, `workflow`), but these are acceptable in this course context.
- Economy (filler / restatement / repeated beats): no material issue. The Deep Dive repeats the core frame, but adds maintenance/platform nuance and stays appropriately short.
- Over-narration: none material. Forward references to later M5 lessons earn their place because the lesson's artifact includes "późniejsza ścieżka M5".

## Diagram Quality

- Diagrams present: 2.
- Placement: pass. The decision-flow diagram sits next to the build/buy/complement claim; the source-systems diagram sits next to the digest example.
- Missing opportunities: none. The opportunity map is better as a table/worksheet than a third diagram.
- Decorative or redundant: none. Both diagrams reduce cognitive load for decision flow and system-signal flow.
- Syntax/rendering: dry-run detected 2 Mermaid blocks via `node scripts/render-mermaid.mjs lessons/m5-l1/lesson-draft.md --dry-run`; syntax appears straightforward and valid, but I did not generate final SVG/PNG assets during RC review.

## Video Alignment

Issue: no scenario present.

The draft/spec contain three precise video placeholders, and they align with the lesson boundaries. There are no scenario files to compare against the text, so video/text mismatch cannot be fully assessed yet.

## Side-Effect Ledger

New claims introduced:
(none)

Claims removed:
(none)

Neighboring lesson references changed:
(none)

Prework references used:
Prework [1.2], [2.x], [3.x], [4.2] are used as assumed continuity, not re-taught.

Prework concepts repeated intentionally:
Agent/harness/tool vocabulary and small-useful-workflow discipline are repeated lightly to support the module shift.

Potential duplicates:
m5-l2 if the digest becomes SDK implementation; m5-l3 if review classification becomes CI gates; m5-l4 if the Shared AI Registry example becomes distribution architecture; m5-l5 if cyclical digest becomes remote-agent setup.

Unsupported facts:
(none)

Video/text mismatches:
Cannot assess until `videos/video-*.md` exists.

Needs human decision:
Decide whether to produce the required video-scenario artifact now or explicitly defer/remove it from RC acceptance criteria. No human decision is needed for a prose revision of `lesson-draft.md`.

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [x] Unpaid promises and logical holes resolved
- [x] Unsupported factual claims resolved or removed
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted
- [ ] Video scenario aligned or explicitly deferred
