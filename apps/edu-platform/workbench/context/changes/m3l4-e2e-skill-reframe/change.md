---
change-id: m3l4-e2e-skill-reframe
title: M3L4 — reframe /10x-e2e as the plan-execution sibling of /10x-implement & /10x-tdd
status: implemented
created: 2026-05-31
updated: 2026-05-31
---

# M3L4 /10x-e2e Reframe

The `/10x-e2e` skill was significantly rewritten in the toolkit
(`/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-e2e`). It is no
longer a *generator wrapper* (run planner→generator or fill a prompt template). It
is now a **plan-execution skill — the explicit E2E sibling of `/10x-implement` and
`/10x-tdd`**: it reads the same `context/changes/<change-id>/plan.md`, mutates the
same canonical `## Progress`, runs the same per-phase commit ritual, and swaps the
inner loop for **PLAN → GENERATE → REVIEW → VERIFY** at the browser level, gated by
an eligibility check (browser-level risk + feature already built + no passing test
yet). The prompt template, seed pattern, five anti-patterns, quality rules, and the
planner→generator→healer pipeline now live entirely in the skill's `references/`.

`lessons/m3-l4/lesson-draft.md` still describes `/10x-e2e` as "the thing that
generates tests" and reproduces the full prompt template + worked example inline —
now redundant with the skill reference and conceptually outdated.

This change reframes the lesson to match the new skill, **mirroring the explanation
pattern m3-l2 uses for `/10x-tdd`** (same-plan / same-`## Progress` framing, a
decision diagram, where-it-fits, deliberate-break verification, interleaving modes).

## Decisions (confirmed with author)

1. **Inline prompt template + worked example → removed, thin pointer.** The skill's
   `references/e2e-prompt-template.md` is the single source.
2. **Full parallel to m3-l2's `/10x-tdd` section.** Reframe `/10x-e2e` as the E2E
   sibling of `/10x-implement` & `/10x-tdd`: shared `plan.md` / `## Progress`,
   PLAN→GENERATE→REVIEW→VERIFY loop, eligibility gate, deliberate-break verify,
   interleaving modes, where-it-fits.
3. **Light schema update, target lesson only.** Update the `m3-l4` `owns` +
   `learningOutcomes` to the plan-execution / sibling framing; touch no other slot.

See `plan.md` for the full plan, `plan-brief.md` for the two-pager, and `side-effect-ledger.md` for the content-level effects.

## Handoff (run sequentially)

The m3-l4 draft changed materially, so it needs the editorial pipeline. Run in this order:

1. **`mermaid` skill** — render + renumber the new decision diagram (currently `<!-- rendered: TODO -->` in the `/10x-e2e` sibling section). The four existing diagrams are unchanged; inserting one shifts the trailing PNG numbering, which the skill owns.
2. **`lesson-editor-pl`** on `m3-l4` — editorial polish on the reframed prose.
3. **`lesson-rc-review`** on `m3-l4` — fresh RC review (the prior RC is invalidated by the reframe). Never run editor and RC in parallel (memory: editor before RC).

Toolkit note: the `/10x-e2e` skill, its `references/`, and the thin `CLAUDE-m3l4` already shipped in the `10x-toolkit` repo (prior `m3l4-todo-revision`, commit `56e774b`) — no toolkit work in this change.
