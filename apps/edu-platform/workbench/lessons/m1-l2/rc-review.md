# RC Review: m1-l2 — Od chatbota do Agenta: tech stack, skille i metaprompting

## Verdict

Ready with minor fixes

## Context

**Reviewed:** 2026-05-10 (third RC review, post-edit of 10xWorkflow section)
**Artifacts reviewed:** lesson-draft.md (post-edit), lesson-spec.md (updated with M2 framing and skill mechanism descriptions), lesson-grounding.md (10 sources + 4 practitioner signals), video scenarios (3: video-skill-vs-prompt, video-skill-creator, video-stack-assess), references/10x-workflow-skills.md (new), lessons-schema.json (m1-l1, m1-l2, m1-l3 entries), style.md, prework.md
**External verification:** Prior review URLs still valid; no new external claims introduced in this edit
**Prior review:** Second RC review (2026-05-10 post-edit) identified 2 Major + 5 Minor findings. This review covers the 10xWorkflow section rewrite and spec synchronization.

## Findings

### Minor: Diagram missing `/10x-frame` between research and plan

- Evidence: Draft line 303–328 (mermaid flowchart TD) shows `E -->|"/10x-research"| F` then `F -->|"/10x-plan"| G`. But the text at lines 289–299 prominently describes `/10x-frame` as the step between research and plan: "kwestionowanie założeń problemu, zanim zaplanujesz rozwiązanie."
- Why it matters: The diagram is the first visual the learner anchors to. If frame is described in text but absent from the diagram, the learner builds a mental model of 3 skills (research → plan → implement) and the frame description feels orphaned.
- Required fix: Add a node for `/10x-frame` between F and G in the diagram. E.g.: `F -->|"/10x-frame"| F2["frame.md"]` then `F2 -->|"/10x-plan"| G`. Alternatively, add `/10x-impl-review` after H as well, since it's also described in text.
- Source check: spec Suggested Structure §6 (forward-looking map lists frame explicitly)

### Minor: "Łańcuch, który zobaczysz w działaniu w module 2" slightly imprecise

- Evidence: Draft line 289 says "Łańcuch, który zobaczysz w działaniu w module 2." Spec line 87 assigns skills across modules 2–5: `/10x-research` (m2), `/10x-frame` (unassigned), `/10x-plan` (m2), `/10x-implement` (m2), `/10x-tdd` (m3), `/10x-impl-review` (m2/m5).
- Why it matters: Low risk — the framing "module 2 introduces the implementation workflow" is pedagogically correct. But if `/10x-frame` or `/10x-impl-review` are formally introduced later, the learner might feel misled.
- Required fix: Not blocking. Consider "Łańcuch, który zobaczysz w działaniu od modułu 2:" (adds "od" for "starting from") — one-word fix that covers the truth without complicating the message.
- Source check: spec Forward-looking map; lessons-schema.json does not yet have module 2 entries to cross-check

### Minor: Prior review Major findings still open

- Evidence: Prior RC review (second) flagged two Major findings: (1) "70+ reguł" should be "40+" — **already fixed** in current draft (lines 114, 406). (2) `skill-creator` possibly removed from `anthropics/skills` public repo — **partially addressed** (draft no longer claims it's in the public repo listing, references local install path instead). The public repo URL in Materiały dodatkowe (line 403) also no longer mentions skill-creator specifically.
- Why it matters: Both Majors from the prior review are resolved or adequately worked around in the current draft.
- Required fix: None needed — documenting closure.
- Source check: prior RC review findings vs current draft text

### Note: `/10x-tdd` described in spec but absent from draft 10xWorkflow section

- Evidence: Spec Owned Concepts (line 52) lists `/10x-tdd` — test-first z planu. The draft's 10xWorkflow section (lines 289–301) describes 5 skills but omits `/10x-tdd`. The prior version's table included it.
- Why it matters: Minimal — the spec says `referencesOnly` for the full set ("kolejne skille łańcucha... jako forward-looking mapa — pełne mechaniki w m2–m4"). The 5 described skills are the core chain; `/10x-tdd` is a variant of `/10x-implement` that tests first. Omitting it from prose is acceptable if the section is already dense.
- Required fix: Not required. Either add one sentence ("Wariant: `/10x-tdd` odwraca kolejność — pisze testy z planu *przed* implementacją.") or leave as-is. The reference file `references/10x-workflow-skills.md` does not cover it either since the user only asked about 5 skills.
- Source check: spec Owned Concepts bullet on 10xWorkflow

### Note: Spec `references/10x-workflow-skills.md` reference added but file is English-only

- Evidence: Spec line 107 now mentions `references/10x-workflow-skills.md`. The file is written in English (per CLAUDE.md "Always write comments, logs and any generated source code in English"). However, the lesson is Polish and the reference is editorial context, not source code.
- Why it matters: No impact on the learner — the reference file is for editorial use, not learner-facing content. The draft section is in Polish and draws from it correctly.
- Required fix: None. The reference file is editorial context, appropriately in English for the workbench.
- Source check: workbench/CLAUDE.md editing discipline

## Spec Compliance

- Thesis: **pass** — "kontrakt wejścia/wyjścia → skill zamiast jednorazowego promptu" operationalized through before/after demo, anatomy, prompt-or-skill picker, and now enriched 10xWorkflow forward map.
- Learning outcomes: **pass** — all 5 outcomes addressed. The 10xWorkflow section now directly supports LO5 (kursant rozpoznaje, kiedy zadanie zasługuje na skill) with concrete skill descriptions showing what "powtarzalny krok łańcucha" looks like in practice.
- Behavioral change: **pass** — the M2 framing ("W module 2 uruchomisz te skille na realnych zadaniach") ties the forward map directly to future behavior change.
- Required example/demo: **pass** — 10xCards PRD → `/10x-tech-stack-selector` → `tech-stack.md` with before/after and SKILL.md anatomy.
- Failure mode: **pass** — "trzeci prompt" heuristic, prompt-or-skill picker exercise.
- Bridge in/out: **pass** — Bridge out now explicitly mentions M2 as operational destination. Spec Bridge Out updated to match.

## Grounding And External Checks

- Verified claims:
  - 10xWorkflow skill descriptions (research, frame, plan, implement, impl-review) verified against actual SKILL.md source files in `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/` — descriptions match mechanisms
  - "2–4 równoległe agenty" for research — confirmed (SKILL.md says "2-4 agents in parallel")
  - "skalowane pytanie (od 4 do 15)" for plan — confirmed (SKILL.md complexity table: LOW 4-6, MEDIUM 7-10, HIGH 11-15)
  - "Sześć wymiarów oceny" for impl-review — confirmed (Plan Adherence, Scope Discipline, Safety & Quality, Architecture, Pattern Consistency, Success Criteria)
  - "MATCH / DRIFT / MISSING / EXTRA" verdicts — confirmed (SKILL.md Agent 1 instructions)
- Unsupported or softened claims:
  - (none new — all skill mechanism claims grounded against source)
- Open verification:
  - Module 2 lesson assignments not yet in lessons-schema.json — curriculum structure claim based on spec forward-looking map, not schema entries

## Curriculum Continuity

- Previous lesson fit: **pass** — m1-l1 delivers PRD; m1-l2 consumes it via `/10x-tech-stack-selector`. No overlap.
- Next lesson setup: **pass** — m1-l3 receives `tech-stack.md` (greenfield) or `stack-assessment.md` (brownfield). Bridge out updated to mention M2 workflow destination.
- Potential duplicates: **none** — the 10xWorkflow section is a forward-looking map; detailed mechanics belong to M2 where the skills are taught operationally. The draft correctly uses "zobaczysz w działaniu" framing, not tutorial depth.
- Scope theft risk: **low** — the section describes *what* each skill does and its contract, not *how* to use it. Operational teaching is deferred to M2. This matches the spec's `referencesOnly` designation for "kolejne skille łańcucha — pełne mechaniki w m2–m4."

## Editorial Quality

- Style guide fit: **pass** — section uses "ty/ci" direct address, short paragraphs, conversational Polish, no expanded acronyms, no thesis-statement headings.
- AI-sounding patterns: **none detected** — the editor pass removed "Oto łańcuch", stiff constructions, and mixed English.
- Polish/prose issues: **pass** — "bramce ręcznej weryfikacji" (natural), "sformułowaniem problemu" (natural), "lista ustaleń i decyzji" (clean), "kompromisów" (correct Polish for tradeoffs in this context).

## Diagram Quality

- Diagrams present: 4 (progressive disclosure, skill-vs-prompt decision, PRD before/after, full workflow chain)
- Placement: each diagram placed next to supporting claim — pass
- Missing opportunities: the full workflow chain diagram (diagram 4) does not show `/10x-frame` or `/10x-impl-review` despite text describing both. See Minor finding above.
- Decorative or redundant: none — all diagrams reduce cognitive load for multi-step flows
- Syntax/rendering: valid mermaid syntax; rendered PNGs referenced via CDN comments

## Video Alignment

**Pass** — three video scenario files exist (video-skill-vs-prompt.md, video-skill-creator.md, video-stack-assess.md). The 10xWorkflow section has no video placeholder and doesn't need one — it's a forward-looking map, not a demo segment. No video/text mismatches introduced by this edit.

## Side-Effect Ledger

New claims introduced:
- Module 1 = environment preparation, Module 2 = operational use of implementation workflow skills (curriculum framing, not factual claim about external tools)
- Specific mechanism descriptions for 5 skills (all grounded against SKILL.md source files)

Claims removed:
- `/10x-tdd` removed from the 10xWorkflow section text (was in prior table, now omitted — covered by reference file)

Neighboring lesson references changed:
- (none — M2 forward references are new but do not change M1L1 or M1L3 contracts)

Prework references used:
- (none new in this section)

Prework concepts repeated intentionally:
- (none)

Potential duplicates:
- (none — forward map stays at "what it does and its contract" level, not tutorial depth)

Unsupported facts:
- (none — all skill descriptions verified against source)

Video/text mismatches:
- (none)

Needs human decision:
- Whether to add `/10x-frame` and `/10x-impl-review` nodes to diagram 4 (currently shows simplified chain)
- Whether to add one sentence about `/10x-tdd` to the prose or leave as-is

## Acceptance Checklist

- [x] Spec compliance blockers resolved
- [x] Unsupported factual claims resolved or removed
- [x] Neighboring lesson drift resolved
- [x] Editorial polish accepted
- [x] Video scenario aligned or explicitly deferred
- [ ] Diagram 4 optionally updated to include `/10x-frame` (Minor — not blocking)
- [ ] "w module 2" optionally softened to "od modułu 2" (Minor — not blocking)
