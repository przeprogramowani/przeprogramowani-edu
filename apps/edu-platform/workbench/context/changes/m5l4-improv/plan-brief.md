# m5-l4 "Shared AI Registry" Re-Architecture — Plan Brief

> Full plan: `context/changes/m5l4-improv/plan.md`
> Research: `context/changes/m5l4-improv/research.md`

## What & Why

Rewrite `lessons/m5-l4/lesson-draft.md` from a leaky, mis-ordered early draft into a release-ready lesson for the real audience: **a 10xDevs learner setting up AI-artifact distribution for their own team/company.** The current draft passed RC "against the spec," but the author's ~44 `[todo]` comments reject the spec's narrative — so this is a re-architecture, not a polish pass, and the todos win over schema/spec/rc-review.

## Starting Point

A 416-line draft that (1) leaks 10xDevs-operator internals into Model 3 (Circle, KV email-hash migration, `releaseAt`, JWT-revocation mechanics, runbooks, a fabricated smoke incident, offline-mode), (2) apologizes for Model 2 (CodeArtifact + Terraform) as an "over-build," and (3) never establishes the two repo contexts, so key snippets and "the installer" appear from nowhere. All fix material already exists in the learnings digests and the real `10x-toolkit` / `10x-cli` / `10xCards` repos.

## Desired End State

A release-candidate draft whose through-line is "distribution for **your** team," opening with a brief three-model overview → "A co z marketplace'ami?" → per-model deep dives → decision table → fixed tail. Model 2 is de-apologized (deliberate managed infra); Model 3 is stripped of operator noise, translated to team terms, and keeps a shown-as-real (bracketed) security trio. Zadanie 2's handout is wired into `10x-toolkit` so `10x get m5l4` works. Zero `[todo]` comments, em-dashes swept, rendered-card references in place.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Authority on conflicts | `[todo]` comments override schema/spec/rc-review | Author explicitly instructed it; the spec narrative is rejected | Research |
| Running-example payload | Go broad across earlier-module skills/prompts/rules | Author: "almost every previous lesson introduces some" — not the in-progress `code-review` | Plan |
| Two-package split (content vs installer) | Delete entirely | Too complex/sudden; not load-bearing for the student | Plan |
| Model-3 security trio | Show real 10x-cli snippets, bracketed as the 10xDevs case | Provenance must stay truthful; Model 3 *is* the course case study | Plan |
| Intro | Rework to match the new flow | Author overrode the earlier "keep intro as-is" to fix the apologetic teaser | Plan |
| Model 2 tone + video | De-apologize; reframe video as enterprise/managed-infra path | CodeArtifact is deliberate, config-rich, ~zero cost; Nexus is the heavy one | Research/Plan |
| Opening structure | `## Trzy modele dystrybucji` overview, then `## A co z marketplace'ami?` as H2 | Matches todo L346 + style rules; marketplaces land as the natural early question | Plan |
| Zadanie 2 + handout | Keep as-is; wire specs into `10x-toolkit` as part of this plan | Keeps the spec-driven payoff; unblocks `10x get m5l4` | Plan |
| Asset cards | Define shots + inline refs now; defer render/upload | Designs narration in while keeping PNG production out of this pass | Plan |
| Setup-section order | Keep thesis + 5 requirements as own sections **before** the overview | Measuring stick in hand before any model is sketched | Plan |
| Handout wiring | Ref `m5l4`, all 5 specs, `spec-terraform` as AWS appendix | Matches lesson id; keeps Zadanie 2's AWS-note valid | Plan |
| Deep Dive | Keep all 3 subsections; reframe `Anatomia instalatora` as the install/update/uninstall scripts-layer | Installer is single-package-valid, not tied to the deleted split | Plan |
| Schema scope | m5-l4 entry only | Honors workbench target-lesson-only rule; m5-l3 is a separate change | Plan |
| `.npmrc` convention | Committed scope line; token injected at install (verified in 10xCards) | Confirmed the file is tracked, not gitignored | Plan |

## Scope

**In scope:** full draft re-architecture (intro, overview, marketplaces, Models 1–3, patterns, decision table, failure mode, tail); editorial polish; cross-repo handout wiring in `10x-toolkit`; light `lessons-schema.json` m5-l4 sync; rendered-card shot definitions + inline references; final RC review.

**Out of scope:** rendering/uploading asset PNGs; producing the course video-scenario; teaching cloud/IaC from scratch; re-teaching m4-l1/prework; handing Model-3 substance to m5-l1.

## Architecture / Approach

Sequential edits to one draft file, phased by lesson region for independent verifiability, then an editorial pass (`lesson-editor-pl`), cross-repo wiring, schema sync, and a final `lesson-rc-review` gate — editor before review, never parallel. Rendered-artifact-card references are inserted where each real artifact appears (consumer `.npmrc`, `publishConfig`, preinstall one-liner, sentinel markers, manifest, signing/allowlist); their shot definitions go into `render-artifact-screenshots.mjs` for a later production run.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Scaffold | New order, reworked intro, overview + marketplaces H2, two-repo context | Reordering breaks existing bridges/through-line |
| 2. Model 1 | GitHub Packages on the scaffold; split deleted; auth/versioning/billing resolved | Auth section sliding back into over-detail |
| 3. Model 2 | De-apologized CodeArtifact + enterprise video reframe | Over-correcting into overselling the niche case |
| 4. Patterns | Sentinel + real manifest cards; SKILL.md path challenge | Pattern prose ballooning into installer internals |
| 5. Model 3 | Leak triage, reframe, security trio as real bracketed snippets | Largest cut surface; card/prose naming tension |
| 6. Table + tail + polish | Reconciled table, reframed failure mode, `lesson-editor-pl`, em-dash sweep | Table cells referencing cut facts |
| 7. Wiring + schema + RC | `10x get m5l4` works; schema synced; RC gate | Cross-repo coordination; deferred-asset flags |

**Prerequisites:** access to `/Users/admin/code/10x-toolkit`, `10x-cli`, `10xCards`; workbench skills (`lesson-editor-pl`, `lesson-rc-review`); `lessons-schema.json` + schema file.
**Estimated effort:** ~3–4 sessions across 7 phases (Phase 5 is the heaviest; Phase 7 spans two repos).

## Open Risks & Assumptions

- Draft will reference asset PNGs that don't exist until a deferred render/upload run — flagged as non-blocking in RC.
- Handout wiring is cross-repo and may need release scheduling (resolved: ref `m5l4`, 5 specs, terraform = AWS appendix).
- `SECURITY.md` vs code mismatch — RESOLVED: corrected `10x-cli/SECURITY.md` to match `signing.ts` (`REQUIRE_SIGNATURES=true`, fail-closed); doc and code now agree.
- Showing real 10x-cli code in Model 3 cards keeps real names (Worker/Circle) visible even though prose translates them — mitigated by explicit bracketing.

## Success Criteria (Summary)

- Lesson reads as "distribution for your team"; zero `[todo]` comments; operator leaks gone; em-dashes swept.
- Models 1–3 land in the new order with the two-repo scaffold, de-apologized Model 2, and a translated-but-shown Model 3 security trio.
- `10x get m5l4` delivers Zadanie 2's specs; `lesson-rc-review` returns no blocking findings.
