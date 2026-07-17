---
name: 10x-prework-improver
description: Improve an existing 10xDevs 3.0 prework lesson via an interactive decision-gate interview (which weaknesses to fix, sections to reshape, workflow change to clarify, failure modes to add, 3 takeaways to set, recommendation posture to enforce, optional /autoresearch) anchored in the fixed RC improvement report and fixed prework style guide. Use when the user asks to update, improve, polish, or apply RC report feedback to a specific lesson in src/content/lessons10xDevs3Prework. Takes the lesson markdown file path as the parameter. Must run the interview, present an improvement plan, and get explicit approval before editing.
---

# 10x Prework Improver — interactive lesson upgrade

Improve one existing 10xDevs 3.0 prework lesson. The contract: **do the dirty work autonomously (read, diagnose, propose), but stop at every important decision and ask the user before editing.** Mirror the `/10x-plan` and `10x-prework-planner` patterns — assess complexity of the upgrade, propose a decision count, run probing rounds, and only then edit.

Lesson parameter: `$ARGUMENTS`

## Fixed inputs

- Report: `projects/edu-platform/src/content/lessons10xDevs3Prework/release-candidate-improvement-report.md`
- Style guide: `projects/edu-platform/src/content/lessons10xDevs3Prework/style.md`

(Resolve from the repo root. Do not hardcode user-specific absolute paths.)

## Contract

- Both fixed paths above are fixed. Do not ask for a different report or style guide unless the file is missing.
- The lesson path is the only parameter.
- Do not edit the lesson until the user approves the planned improvements.
- Preserve the lesson's intended topic, sequence, frontmatter, links, and technical claims unless the report, style guide, or user clearly require a change.
- Write all learner-facing prose in Polish.

## Question tool selection

Before starting the interview, decide which user-input mechanism is available in this runtime and use it consistently for the whole interview:

1. Prefer `AskUserQuestion` if that tool exists in the environment.
2. Otherwise use `request_user_input` if that tool exists and the current collaboration mode allows it.
3. Otherwise fall back to concise plain-text questions in the assistant message, preserving the same decision-gate structure and labeled options.

If neither tool is available, do **not** skip the interview. Ask the same questions manually in chat.

## Phase map

```
0. Read           →  lesson, style, report (silent)
1. Framing        →  diagnosis, complexity, draft revision skeleton
2. Interview      →  decision-gate question rounds (LOW=4-6, MEDIUM=7-10, HIGH=11-15)
3. Improvement plan → reflects every confirmed decision
4. Approval gate  →  user greenlights → only then edit
5. Edit + verify  →  in-place changes, re-read for damage, short report
```

You progress through these in order. Never skip the interview. Never edit before approval.

## Phase 0 — Read (silent)

In parallel:

1. Validate `$ARGUMENTS`. If empty, ask once for the lesson markdown path. Resolve relative paths from the edu-platform repo root. Confirm all three files exist before continuing.
2. Read the lesson in full.
3. Read `style.md` in full.
4. Read the sections of the RC report that mention this lesson by filename, slug, title, module number, or nearby lesson identifier. Include any global rules from the report that apply here.

Output of Phase 0 is internal — no message yet.

## Phase 1 — Framing + complexity assessment

Now break silence. In one short message:

1. Summarize the lesson's current state in 2-3 sentences (what it does, what slot it occupies).
2. Surface the **top 3-5 weaknesses** you see, drawn from the RC report sections relevant to this lesson, the style guide, and your own read. Each weakness gets one line: what's wrong + which paragraph/section.
3. Surface anything strong worth protecting (so the user knows you saw it).
4. **Propose a draft revision skeleton** — what would change at the section level.
5. **Assess upgrade complexity** and ask the user to confirm using the selected question tool.

Format:

```
Current state: [2-3 sentences]

Top weaknesses:
- [weakness] — [where in lesson] — [source: RC report / style / own read]
- [weakness] — [where] — [source]
- ...

Worth protecting:
- [strong element]
- [strong element]

Draft revision skeleton (we'll refine this):
- [Section / area] — [what to change]
- [Section / area] — [what to change]

**Upgrade complexity: [LOW / MEDIUM / HIGH]**
[2-3 sentences explaining why: scope of changes, whether structural or surface, whether new content needs to be researched, whether tone/posture is in question.]

I'd like to ask **[N] questions** across rounds to nail down weaknesses to fix, sections to reshape, workflow change clarity, failure modes, takeaways, and recommendation posture.
```

Then ask the question using the selected question tool:

- question: "Does this complexity assessment match the upgrade scope?"
  header: "Complexity"
  options:
  - label: "Agree — proceed with [N] questions"
    description: "Assessment fits. Run the interview."
  - label: "Higher — ask more"
    description: "More to fix than I named. I'll explain what's missing."
  - label: "Lower — keep it tight"
    description: "Smaller upgrade than this looks. Fewer questions."
  multiSelect: false

**Complexity scale (for upgrades):**

| Level | Questions | When to use |
|---|---|---|
| **LOW** | 4-6 | Surface fixes — Polglish cleanup, tightening prose, fixing one weak section, applying style-guide rules. No new content, no structural change. |
| **MEDIUM** | 7-10 | Section-level changes — reshape one or two sections, add a missing failure mode, rewrite the close, replace examples. May add new content but doesn't change the lesson's thesis. |
| **HIGH** | 11-15 | Structural rewrite — change section order, change recommendation posture, change the answer to "what changes in my workflow?", add or remove major scope. Effectively a re-plan of an existing lesson. |

## Phase 2 — Decision-gate interview

Run questions in **rounds of 1-4** until you've hit the target count. Use the selected question tool for every decision.

Every option follows:

```
[1-sentence what this means] · Strength: [key advantage] · Tradeoff: [key cost or risk]
```

Mark exactly one option per question as `⭐ Recommended:` in its label, grounded in what you read in Phase 0.

### Mandatory questions (every upgrade)

**Q1 — Which weaknesses to fix in this pass**

The diagnosis named several weaknesses. The user picks which are in scope for this upgrade.

- question: "Which weaknesses should this upgrade pass fix?"
  header: "Scope"
  options:
  - label: "⭐ Recommended: All of the listed weaknesses"
    description: "Address every weakness in the diagnosis. · Strength: Single coherent upgrade; lesson lands in good shape. · Tradeoff: Larger diff; longer review."
  - label: "Top N only — user names which"
    description: "User selects the subset. · Strength: Smaller, faster upgrade. · Tradeoff: Lesson stays uneven if the unfixed weaknesses interact."
  - label: "Add weaknesses I missed"
    description: "User adds more before we proceed. · Strength: Catches things the planner couldn't see. · Tradeoff: Expands scope."
  multiSelect: true

**Q2 — Section structure changes**

If any structural change is on the table (MEDIUM+), confirm. For LOW upgrades that are pure surface, skip this Q.

- question: "What structural change does the lesson need?"
  header: "Sections"
  options:
  - label: "⭐ Recommended: [planner-proposed change]"
    description: "[e.g., 'Merge 'Stack' and 'Alternatywy' into one section with a clearer pivot.'] · Strength: [why] · Tradeoff: [why not]"
  - label: "Different change"
    description: "User describes. · Strength: Full control. · Tradeoff: Requires articulation."
  - label: "Keep current structure"
    description: "Only fix prose-level issues; do not reshape sections. · Strength: Lower risk. · Tradeoff: If the structural problem is real, the upgrade won't fully land."
  multiSelect: false

**Q3 — Workflow change clarity ("co zmieni się w moim codziennym engineering workflow?")**

Every prework lesson should let the reader answer this in one sentence. If the current lesson doesn't, the upgrade fixes it.

- question: "What should the reader be able to say has changed in their daily engineering workflow after reading this lesson?"
  header: "Workflow Δ"
  options:
  - label: "⭐ Recommended: Make explicit — [proposed sentence]"
    description: "[1-sentence behavioral change to surface in the lesson] · Strength: Concrete, observable. · Tradeoff: Narrows the lesson if it was deliberately broad."
  - label: "Different framing — user specifies"
    description: "Free-form. · Strength: User has stronger framing. · Tradeoff: Requires articulation."
  - label: "Keep implicit — orientation lesson"
    description: "Lesson orients without mandating new behavior. · Strength: Right for some slots. · Tradeoff: Risks landing flat — reader leaves without anything to do."
  multiSelect: false

**Q4 — Failure mode (at least one)**

Confirm the lesson surfaces at least one failure mode for one workflow/concept. If absent, add. If present but weak, strengthen.

- question: "Which failure mode should the lesson show?"
  header: "Failure mode"
  options:
  - label: "⭐ Recommended: [planner-proposed failure mode]"
    description: "[concrete mistake + cost] · Strength: [why] · Tradeoff: adds 100-200 words."
  - label: "[alternative failure mode]"
    description: "[different mistake] · Strength: [why] · Tradeoff: [why not]"
  - label: "Lesson already covers a strong one — leave alone"
    description: "Existing failure mode is enough. · Strength: Lower diff. · Tradeoff: Skip if you spotted a stronger one."
  - label: "User specifies"
    description: "Free-form. · Strength: Captures something planner missed. · Tradeoff: Requires articulation."
  multiSelect: false

**Q5 — 3 takeaways**

Confirm the lesson ends with one decision rule, one safety check, one action. Ask separately for each.

- question: "What should the lesson's one decision rule be?"
  header: "Decision rule"
  options:
  - label: "⭐ Recommended: [proposed]"
    description: "[falsifiable rule] · Strength: [why] · Tradeoff: [where it breaks]"
  - label: "[alternative]"
    description: "[different rule] · Strength: [why] · Tradeoff: [why not]"
  - label: "Already strong — keep current"
    description: "Existing rule is good. · Strength: Lower diff. · Tradeoff: Skip if planner spotted a stronger formulation."
  - label: "User specifies"
    description: "Free-form."
  multiSelect: false

(Same shape for Q5b — Safety check, Q5c — Action.)

**Q6 — Recommendation posture**

The previous version of the lesson may have over-recommended specific tools/frameworks. The upgrade is the chance to fix posture.

- question: "How prescriptive should the upgraded lesson be about specific tools, frameworks, or vendors?"
  header: "Posture"
  options:
  - label: "Prescriptive — keep / strengthen specific picks"
    description: "Recommend specific frameworks/tools by name with rationale. · Strength: Maximally actionable. · Tradeoff: Locks team into recommendations they may not deeply own; ages fast."
  - label: "⭐ Recommended: Neutral with criteria"
    description: "Selection criteria + name kursowy stack as one example + readers in other ecosystems pick their own. Remove specific framework names the team doesn't deeply own. · Strength: Respects readers' autonomy and the team's actual expertise; ages well. · Tradeoff: Less concrete for readers who wanted a single answer."
  - label: "Single-stack only"
    description: "Cover only the kursowy stack; remove all alternatives. · Strength: Simplest, on-brand. · Tradeoff: Excludes readers in other ecosystems."
  multiSelect: false

> **Special enforcement.** If the user picks "Neutral with criteria", the improver MUST remove or generalize any concrete framework names in the lesson that the team doesn't deeply own (e.g., specific Java/.NET/PHP/Python frameworks, specific JS meta-frameworks beyond the kursowy stack). Replace with selection criteria language. This is the question the previous flow missed.

### Conditional questions (added based on complexity)

**MEDIUM+ adds:**

- **Q7 — Deeper research?** Should we run `/autoresearch` or a focused web pass before editing? Use when adding new content (e.g., a new failure mode example) that needs primary sources.
- **Q8 — Examples and artifacts.** Replace existing examples? Add a new artifact (terminal transcript, table, mermaid)? Match to the topic.
- **Q9 — Bridge in/out.** Adjust the lead or close to fit better with adjacent lessons?

**HIGH adds:**

- **Q10 — Tone tension.** Authoritative vs recommendation vs neutral explainer.
- **Q11 — Re-use signal.** Will this material be reused (webinar, ebook, social) — and should the upgrade make that easier?
- **Q12 — Risk surface.** Is there a known landmine the upgrade should disarm proactively?
- **Q13 — Source updates.** Refresh primary sources cited in "Źródła"? Replace stale ones?
- **Q14 — Length budget.** Hard cap (e.g., "stays under 1000 words"), grow modestly, or open?
- **Q15 — Frontmatter / title.** Adjust title or any frontmatter fields?

### Question discipline

- Don't ask about settled context (the lesson exists; its slot is fixed).
- Don't ask leading questions outside the `⭐ Recommended:` mechanism.
- Don't ask about word-level edits — those are the editor's job during application.
- Always provide an "Other / I'll specify" or "Keep current" option for substantive decisions.

## Phase 3 — Improvement plan

Synthesize every confirmed answer into an explicit improvement plan. Use this format:

```markdown
Improvement plan for `<lesson path>`:

## Diagnosis (confirmed)
- [weakness, in user-confirmed scope from Q1]
- [weakness, in user-confirmed scope]

## Changes
- `<area / section>`: `<specific change>` — [maps to which Q]
- `<area / section>`: `<specific change>` — [maps to which Q]

## Workflow Δ (from Q3)
[The 1-sentence behavioral change the upgraded lesson will make explicit, or "remains implicit — orientation"]

## Failure mode (from Q4)
- Context: [where in the lesson]
- What breaks: [the mistake]
- How to recognize: [signal]
- How to avoid / recover: [defense]

## Takeaways (from Q5)
- Decision rule: [text]
- Safety check: [text]
- Action: [text]

## Recommendation posture (from Q6)
[Prescriptive / Neutral with criteria / Single-stack — and the concrete consequence for the lesson, e.g., "remove framework names X, Y, Z; replace with criteria language"]

## Kept unchanged
- [stays stable]
- [stays stable]

## Open questions or conflicts
- [only if applicable; if any exist, the planner stops and asks before edits]

## Decyzje, które właśnie podjęliśmy
| Decyzja | Wybór | Dlaczego |
|---|---|---|
| Scope (Q1) | [picks] | [reason] |
| Sections (Q2) | [pick] | [reason] |
| Workflow Δ (Q3) | [pick] | [reason] |
| Failure mode (Q4) | [pick] | [reason] |
| Decision rule (Q5a) | [pick] | [reason] |
| Safety check (Q5b) | [pick] | [reason] |
| Action (Q5c) | [pick] | [reason] |
| Posture (Q6) | [pick] | [reason] |
| ... | ... | ... |

Approve this plan, or tell me what to change before I edit the lesson.
```

## Phase 4 — Approval gate

Wait for explicit approval ("ok", "approved", "zatwierdzam", "działaj", "leci", "tak", or equivalent). If the user changes the plan, revise it first; if the change is material (touches Q1–Q6), re-run the relevant question(s) before revising. Wait again. Never edit without approval.

## Phase 5 — Edit and verify

Once approved:

1. Apply the approved changes in place to the lesson file passed as `$ARGUMENTS`.
2. Keep markdown structure clean and Astro-compatible.
3. Prefer targeted rewrites over broad unrelated changes.
4. Preserve frontmatter fields and collection conventions (unless Q15 explicitly authorized a change).
5. Re-read the changed lesson enough to catch obvious markdown or structure mistakes.
6. If practical, run a narrow validation command relevant to markdown/content changes.
7. Final response: lesson path, short summary of changes grouped by Q, any verification performed.

## Editing notes

- Use the report as quality direction, not as text to copy verbatim.
- Use the style guide as the source of voice, structure, and editorial constraints.
- Keep examples practical and developer-focused.
- Avoid adding marketing language, vague motivational copy, or unsupported claims.
- If the approved plan requires facts not present in the lesson/report/style guide, verify them from primary sources before inserting them.
- For Q6 = "Neutral with criteria": when removing specific framework names, replace with criteria-based language ("typed, conventional, popular in training data, well-documented") rather than just deleting — readers in those ecosystems still need to know how to choose.

## What this skill does NOT do

- It does not edit the lesson before approval.
- It does not skip the interview because "the report tells me what to do" — the report is one input; the user's posture, scope, and takeaway choices are their own.
- It does not add specific framework recommendations the team doesn't deeply own when the user has chosen "Neutral with criteria".
- It does not pad questions to hit a number when answers are obvious. If a LOW upgrade only needs 4 well-chosen questions, ask 4.
