# Refactor Opportunities — Guards & SaveMultiple Fix — Plan Brief

> Full plan: `context/changes/refactor-opportunities/plan.md`
> Research: `context/changes/refactor-opportunities/research.md`

## What & Why

The research ranked the recorded post-flow debt and concluded: the cheapest fix (a manual-layer completeness guard) is also the most urgent, because its failure mode has already happened — `searchlayer` overrides `Save` but not `SaveMultiple`, so batch saves silently skip search indexing. This plan executes that #1 opportunity (C4), fixes the realized bug along the way, and bundles the C2 column-array consistency assertion the research recommended "regardless of ranking". Both intentional designs (manual layers, positional INSERT) are *guarded*, not *reshaped*.

## Starting Point

`SearchPostStore` and `LocalCachePostStore` embed `store.PostStore` (57 methods), overriding only 8 and 6 respectively — new or forgotten methods pass through silently with no compile error, no test, no CI signal. Planning-time investigation confirmed the `SaveMultiple` gap is a **live production bug**: bulk import is its only caller (3 sites in `import_functions.go`), no automatic reindex runs after import, so imported posts are unsearchable until an admin manually runs "Index Now". Separately, the `postSliceColumnsWithTypes ↔ postToSlice` positional invariant (18 columns) has no guard of any kind.

## Desired End State

`make store-layers` (already a blocking CI gate) fails with an actionable message whenever a manual-layer `PostStore` method is neither overridden nor exempted-with-reason — silent passthrough becomes impossible to merge. Bulk-imported posts are search-indexed live. A pure-unit sentinel test makes any column add/remove/reorder that touches only one of the two coupled functions fail immediately.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Plan scope | C4 guard + C2 quick-win assertion | Both highest-certainty payoffs; C2 assertion is one additive test with zero coupling | Research + Plan |
| SaveMultiple gap | Add the override (after investigation confirmed live bug) | Correctness first; per-post cost equals what single saves already pay; big-import escape hatch (disable live indexing) remains | Plan |
| Enforcement mechanism | Generator validation that hard-fails `make store-layers` | Reuses the generator's existing AST method extraction and the existing blocking CI job; stronger than a rubber-stampable porcelain diff | Research + Plan |
| Exemptions | Explicit per-layer JSON file, method → mandatory reason; stale entries also fail | Every passthrough becomes a reviewed, documented, diffable decision | Plan |
| Guard scope | `PostStore` on both manual layers (pilot) | Proves the mechanism where the realized failure lives; ~2×50 triage entries; extension is a follow-up | Research |
| Rollout | Blocking from day one, via opt-in-per-layer activation | Deterministic check + same-change triage = no flake risk; opt-in semantics let the mechanism land green before triage | Plan |
| C2 test design | Sentinel-value identity per column (not `reflect.Kind`) | Same-kind adjacent columns would pass a kind check even when swapped | Plan |

## Scope

**In scope:** C2 correspondence test; searchlayer `Save` characterization test + `SaveMultiple` override + tests; generator completeness validation (opt-in); exemption-file triage for `PostStore` on both manual layers; light investigation of other write-shaped passthroughs (exempt or file follow-up only).

**Out of scope:** C1 (Post contract drift gate), C3 (`SaveMultiple` decomposition, god-file splits), C2 `NamedExec` migration, fixes for other suspicious passthroughs (`OverwriteMultiple`, retention batch deletes, …), other sub-stores, import-path behavior changes (auto-reindex).

## Architecture / Approach

The repo's guard idiom — "regenerate + fail" under blocking CI — is the seam. `layer_generators` already AST-extracts every sub-store's method set; a new validation pass compares it against (declared overrides ∪ exemption file) per manual layer and exits non-zero on gaps or stale entries, riding the existing `check-store-layers` job with zero new CI plumbing. Enforcement activates per (layer, sub-store) only when its exemption file exists.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. C2 correspondence test | Sentinel-value unit test pinning the 18-column invariant | Serialization edge cases (`Props`/`FileIds` JSON, `RemoteId` pointer) — handled by value-identity design |
| 2. SaveMultiple fix | `Save` characterization test + `SaveMultiple` override + tests; imported posts searchable | Bulk-import slowdown with live indexing — explicitly accepted tradeoff |
| 3. Guard mechanism | Generator validation, opt-in, lands green | AST override-detection correctness — pinned by tripwire test against real packages |
| 4. Triage & activate | Two exemption files (~99 reasoned entries), enforcement live in CI | Triage surfaces more SaveMultiple-class gaps — bounded to exempt-or-file-follow-up, never fix |

**Prerequisites:** none beyond the repo toolchain (Go, `make store-layers`, optionally a local server with Bleve/ES for Phase 2's manual check).
**Estimated effort:** ~4 sessions, one per phase; each phase is an independently revertible commit/PR.

## Open Risks & Assumptions

- Assumes `indexPost`'s engine call synchronization is testable with the existing mocks (if fire-and-forget, the Phase 2 harness needs a sync point — flagged in the plan).
- Triage of write-shaped passthroughs (retention deletes, `OverwriteMultiple`) may reveal further live bugs — the plan's boundary is exempt-with-citation or file follow-up, which could feel unsatisfying but keeps blast radius fixed.
- Upstream-acceptance risk if these changes are intended as Mattermost contributions: the exemption-file convention is a new pattern maintainers may want shaped differently.

## Success Criteria (Summary)

- A forgotten manual-layer override can no longer merge: the dummy-method tripwire fails `make store-layers` in CI with a message naming the method and both resolutions.
- A bulk import on a live-indexing server produces searchable posts without "Index Now".
- A column reorder applied to only one of `postSliceColumnsWithTypes`/`postToSlice` fails a fast unit test naming the columns.
