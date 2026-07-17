# Refactor Opportunities — Guards & SaveMultiple Fix Implementation Plan

## Overview

Land the two highest-certainty payoffs from this change's research: the **C4 manual-layer completeness guard** (generator-enforced, under the existing blocking `check-store-layers` CI gate), fixing the confirmed-live **SaveMultiple search-indexing bug** along the way, plus the **C2 column-array consistency assertion** the research recommended as a standalone quick win. Everything is additive; the manual layers stay hand-written and the positional INSERT design stays untouched — both are evidenced intentional constraints that get *guarded*, not *reshaped*.

## Current State Analysis

From `context/changes/refactor-opportunities/research.md` (commit `29bab2184d`) plus planning-time verification:

- **Manual layers silently swallow new store methods.** `SearchPostStore` (`server/channels/store/searchlayer/post_layer.go:16-19`) and `LocalCachePostStore` (`server/channels/store/localcachelayer/post_layer.go:17-20`) embed `store.PostStore`; un-overridden methods pass through with no compile error. `PostStore` declares **54 (plan: 57) methods** (`server/channels/store/store.go:375-432`; ast-grep-verified count from research.md §Weryfikacja — the planning session re-counted 57 from the line range); searchlayer overrides **8**, localcachelayer **6**.
- **The failure mode is realized and is a live production bug.** searchlayer overrides `Save` (`post_layer.go:104`) but not `SaveMultiple`. `Post().SaveMultiple` has exactly 3 production callers — all bulk import (`server/channels/app/import_functions.go:1470,1915,2434`). Import completes (`server/channels/app/import.go:344`) without triggering any indexing job; the ES `IndexingJob` (`server/enterprise/elasticsearch/common/indexing_job.go`) is admin-manual ("Index Now"). **Imported posts are unsearchable until manual reindex.**
- **Single saves are NOT affected**: sqlstore's `Save` delegates to `SaveMultiple` internally (`server/channels/store/sqlstore/post_store.go:341-347`), but that delegation happens *below* the search layer; `searchlayer.Save` triggers `indexPost` itself.
- **The layer generator** (`server/channels/store/layer_generators/main.go:30-37`) is two builder functions (`buildTimerLayer` :52-63, `buildRetryLayer` :39-50) writing two files; it already AST-extracts the full per-sub-store method set (`:109-164`). It is invoked by `make store-layers`, which the blocking CI job `check-store-layers` runs (`.github/workflows/server-ci.yml:163-179`) followed by a `git status --porcelain` check. A non-zero exit from the make target fails the job directly.
- **The positional column arrays have no guard.** `postSliceColumnsWithTypes()` (`sqlstore/post_store.go:53-80`) and `postToSlice()` (`:82-103`) must stay in positional correspondence (18 entries each); nothing asserts this. 4 of the 18 entries don't kind-match naively (`Props`/`Filenames`/`FileIds` are JSON-serialized in `postToSlice`; `RemoteId` is `*string` vs declared `reflect.String`).
- **Test landscape**: `searchlayer` has only `layer_test.go` (one config-race test) — `Save→indexPost` has zero coverage. sqlstore has pure-unit test precedent (`adapters_test.go:13-21`, `utils_test.go:15-160`, no DB, runs under `make test-server-quick`); `post_store_test.go` currently holds only DB-bound storetest wrappers.

## Desired End State

1. `make store-layers` **fails with an actionable message** whenever a `PostStore` method on `searchlayer` or `localcachelayer` is neither explicitly overridden nor listed in that layer's checked-in exemption file (with a one-line reason). The existing blocking `check-store-layers` CI job enforces this with zero new CI plumbing.
2. **Bulk-imported posts are search-indexed live**: `SearchPostStore.SaveMultiple` exists, mirrors the `Save` override, and is covered by tests alongside a new characterization test for `Save→indexPost`.
3. A **pure-unit sentinel test** pins the `postSliceColumnsWithTypes ↔ postToSlice` correspondence (length + per-index value identity), failing on any column add/remove/reorder that isn't applied to both functions.

**Verification of the end state**: deliberately add a method to the `PostStore` interface (or delete an exemption entry) → `make store-layers` fails locally and in CI with a message naming the method and the two ways to resolve it. Deliberately swap two adjacent same-type columns in `postToSlice` → the Phase 1 test fails.

### Key Discoveries:

- The repo's guard idiom is "regenerate + fail" — 6 blocking CI jobs already follow it (`check-mocks`, `check-store-layers`, `check-gen-serialized`, `check-migrations`, `check-email-templates`, `check-mmctl-docs`); riding `check-store-layers` costs zero new CI.
- The generator already knows the authoritative method set per sub-store (`layer_generators/main.go:109-164`) — completeness validation reuses that extraction.
- `searchlayer.indexPost` (`post_layer.go:21-44`) skips `PostTypeBurnOnRead`/`PostTypeCard` and does a per-post channel fetch — the `SaveMultiple` override inherits this behavior by calling `indexPost` per post.
- Sentinel-value testing beats `reflect.Kind` checks: the research showed same-kind adjacent columns (`CreateAt/UpdateAt/EditAt/DeleteAt`) would pass a kind check even when swapped.

## What We're NOT Doing

- **No C1 work** (Post contract drift gate Go↔TS↔OpenAPI) — that's opportunity #2, a separate future change.
- **No C3 work** (`SaveMultiple` body decomposition, god-file splits) — opportunity #3, gated on its own characterization-test campaign.
- **No C2 structural migration** to `NamedExec` — rejected by the research as an intentional performance design; only the assertion lands.
- **No fixes beyond `SaveMultiple`** for other suspicious non-overridden write methods surfaced by triage (`OverwriteMultiple`, `PermanentDeleteBatch`, `PermanentDeleteBatchForRetentionPolicies`, `RestoreContentFlaggedPost`, …) — each gets a documented exemption or a filed follow-up, never an in-scope code change.
- **No extension beyond `PostStore`** — other sub-stores on the manual layers are an explicit follow-up once the pilot mechanism is proven.
- **No import-path behavior change** (e.g., auto-triggering the indexing job post-import) — rejected as doubling the risk surface.
- **No changes to generated layers** (timer/retry) or to how search/cache layers are written (they stay manual by design).

## Implementation Approach

Four independently revertible phases, ordered cheapest-and-standalone first. Phases 1–2 are pure test/fix additions with no tooling work. Phases 3–4 split the guard into *mechanism* (opt-in, lands green with no exemption files) and *activation* (triage produces the exemption files, which switches enforcement on). Each phase is a separate commit/PR candidate.

## Critical Implementation Details

- **Layer-chain ordering makes the SaveMultiple override safe**: the chain is LocalCache → Timer → Search → Retry → Sql (`app/platform/service.go:285-310`). sqlstore's internal `Save→SaveMultiple` delegation happens below searchlayer, so adding `searchlayer.SaveMultiple` cannot double-index single-post saves.
- **Performance is an accepted tradeoff, decided explicitly**: the override makes bulk imports with live indexing enabled pay a per-post channel fetch + synchronous engine call — identical to what single-post paths already pay. Admins of very large imports can disable live indexing and bulk-reindex, as before. Do not add batching or async dispatch in this change.
- **Phase 1's test must compare serialized values, not kinds**: `Props` → `model.StringInterfaceToJSON(post.Props)`, `Filenames`/`FileIds` → `model.ArrayToJSON(...)`, `RemoteId` is `*string`. Build the expected value per column name, then assert `slice[indexOf(name)] == expected` — order swaps between same-kind columns must fail.
- **Phase 3's enforcement must be opt-in per (layer, sub-store)**: validation runs only when an exemption file exists for that layer. This is what lets the mechanism land green before triage, and lets future sub-stores be onboarded one at a time.

## Phase 1: C2 Quick Win — Column-Array Correspondence Test

### Overview

Pin the `postSliceColumnsWithTypes ↔ postToSlice` positional invariant with a pure-unit sentinel-value test. Standalone; no dependency on later phases.

### Changes Required:

#### 1. Post column correspondence test

**File**: `server/channels/store/sqlstore/post_store_test.go`

**Intent**: Add a no-DB unit test that fails whenever the two functions drift in length, order, or serialization — closing the gap the research upgraded from suspicion to fact (no test, init-assert, or lint checks the correspondence).

**Contract**: A `TestPostToSliceColumnCorrespondence`-style function (no `StoreTest` wrapper, no `testing.Short()` skip — it must run under `make test-server-quick`, following the `utils_test.go:15` convention). It builds a `model.Post` with a distinctive sentinel value in every one of the 18 persisted fields, computes the expected on-the-wire value per column name (applying the same serialization `postToSlice` uses for `Props`, `Filenames`, `FileIds`), then asserts: (a) `len(postSliceColumnsWithTypes()) == len(postToSlice(post))`, and (b) for each column index, the slice value equals the expected sentinel for that column *name*. A swapped pair of same-typed columns must produce a failure naming both columns.

### Success Criteria:

#### Automated Verification:

- New test passes: `cd server && go test ./channels/store/sqlstore/ -run TestPostToSlice -short -count=1`
- Quick suite still passes for the package: `cd server && go test ./channels/store/sqlstore/ -short -count=1`
- Lint passes: `cd server && make check-style` (or targeted `golangci-lint run channels/store/sqlstore/`)

#### Manual Verification:

- Mutation check: temporarily swap two adjacent same-type entries in `postToSlice` (e.g., `UpdateAt`/`EditAt`) → test fails naming the columns; revert.

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding.

---

## Phase 2: Fix the SaveMultiple Indexing Gap

### Overview

First pin the existing `Save→indexPost` behavior with a characterization test (closing TD-5's top gap and building the searchlayer post test harness), then add the `SaveMultiple` override that makes bulk-imported posts searchable.

### Changes Required:

#### 1. Characterization test for the existing Save override

**File**: `server/channels/store/searchlayer/post_layer_test.go` (new file)

**Intent**: searchlayer's `Save→indexPost` currently has zero coverage; pin it before touching the file so the new override is tested against an established harness, not alongside one.

**Contract**: Test setup composes a `SearchStore` over a mocked underlying store (`server/channels/store/storetest/mocks`) with a mocked search engine (`server/platform/services/searchengine/mocks`) whose `IsIndexingEnabled()` returns true — follow whatever bootstrap `layer_test.go` already uses for the root store. Assertions: `Save` on the layer (a) delegates to the underlying store, and (b) results in `IndexPost` being called on the active engine with the post and the channel's TeamId; a `PostTypeBurnOnRead` post is *not* indexed. Note `indexPost` runs the engine call in a goroutine if it does — mirror however the existing `Save` path synchronizes (check `post_layer.go:21-44`; if indexing is fire-and-forget, the test needs a sync point such as a channel-signaling mock).

#### 2. SaveMultiple override

**File**: `server/channels/store/searchlayer/post_layer.go`

**Intent**: Close the realized silent-fallthrough: batch saves must index like single saves. This is the bug fix the Phase-0 investigation confirmed (bulk-imported posts unsearchable until manual "Index Now").

**Contract**: `SaveMultiple(rctx request.CTX, posts []*model.Post) ([]*model.Post, int, error)` mirroring the `Save` override at `post_layer.go:104-111`: delegate to the embedded `s.PostStore.SaveMultiple`, and on success call `s.indexPost` for each returned post. Per-post skip logic (burn-on-read, card) already lives inside `indexPost` — do not duplicate it.

#### 3. SaveMultiple override test

**File**: `server/channels/store/searchlayer/post_layer_test.go`

**Intent**: Verify the new override indexes every post in a batch and propagates errors/partial-failure indices from the underlying store unchanged.

**Contract**: Cases: (a) N posts saved → N `IndexPost` calls; (b) underlying-store error → error returned, no indexing of failed batch (mirror whatever `Save` does on error — it does not index); (c) mixed batch containing a burn-on-read post → that post skipped.

### Success Criteria:

#### Automated Verification:

- New tests pass: `cd server && go test ./channels/store/searchlayer/ -count=1`
- Store-layer mocks unchanged / regenerated cleanly: `cd server && make store-layers && git status --porcelain` shows no diff
- Server builds: `cd server && go build ./...`
- Lint passes: `cd server && make check-style`

#### Manual Verification:

- On a local server with Bleve (or ES) live indexing enabled, run a small bulk import (`mmctl import` JSONL with batched posts) → imported posts are findable via search **without** running "Index Now".

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation (the bulk-import search check) before proceeding.

---

## Phase 3: Generator Completeness Validation (Mechanism)

### Overview

Teach `layer_generators` to validate manual-layer completeness: every interface method must be explicitly overridden or exempted-with-reason. Enforcement is opt-in per (layer, sub-store) — it activates only when an exemption file exists — so this phase lands green with no behavior change to CI.

### Changes Required:

#### 1. Completeness validation in the generator

**File**: `server/channels/store/layer_generators/` (new file, e.g. `completeness.go`, wired from `main.go:30-37`)

**Intent**: Reuse the generator's existing AST extraction of the per-sub-store method set to detect silent passthroughs on the manual layers, turning "easy to forget" into "impossible to merge".

**Contract**: After the existing build steps, `main()` runs a validation pass driven by a small in-generator table of manual layers to check — for this pilot: `{dir: "searchlayer", struct: "SearchPostStore", subStore: "PostStore"}` and `{dir: "localcachelayer", struct: "LocalCachePostStore", subStore: "PostStore"}`. For each entry whose exemption file exists (see #2): parse the layer package's AST to collect method names declared with that struct as receiver; compute `interfaceMethods − declaredOverrides − exemptedMethods`; if non-empty, exit non-zero listing each missing method and the two resolutions ("add an override in <dir>/post_layer.go, or add an exemption with a reason to <exemption file>"). Also fail on *stale* exemptions (exempted method that is now overridden, or no longer on the interface) so the files can't rot. If the exemption file is absent, skip that entry silently (opt-in semantics).

#### 2. Exemption file format

**File**: convention only in this phase — `server/channels/store/searchlayer/completeness_exemptions.json` and `server/channels/store/localcachelayer/completeness_exemptions.json` (created in Phase 4)

**Intent**: Make every silent passthrough a reviewed, documented decision that shows up in diffs.

**Contract**: JSON (stdlib-parseable from the generator): `{"PostStore": {"<MethodName>": "<one-line reason>", ...}}`. Top-level key is the sub-store interface name so future sub-stores extend the same file. Reasons are mandatory non-empty strings — the generator rejects empty ones.

#### 3. Generator unit tests

**File**: `server/channels/store/layer_generators/` (test file alongside)

**Intent**: The validator is now load-bearing CI logic; pin its verdicts.

**Contract**: Table-driven tests over the set-difference + staleness logic (method sets and exemption maps as inputs → expected pass/fail and message contents). AST-parsing of the real layer files can be covered by one test that runs extraction against the actual repo packages and asserts the known override lists (8 for searchlayer `PostStore`, 6 for localcachelayer) — this doubles as a tripwire if extraction breaks.

### Success Criteria:

#### Automated Verification:

- Generator tests pass: `cd server && go test ./channels/store/layer_generators/ -count=1`
- `cd server && make store-layers` exits 0 and `git status --porcelain` shows no diff (no exemption files yet → validation is a no-op)
- Server builds: `cd server && go build ./...`
- Lint passes: `cd server && make check-style`

#### Manual Verification:

- Dry-run check: create a throwaway exemption file for searchlayer containing an incomplete list → `make store-layers` fails listing the missing methods with the actionable message; delete the file → passes again.

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding.

---

## Phase 4: Triage & Activate for PostStore on Both Layers

### Overview

Write the two exemption files — the triage that turns ~93 (plan: ~99) silent passthroughs into documented decisions — and thereby switch enforcement on under the blocking `check-store-layers` CI job.

### Changes Required:

#### 1. searchlayer exemption file

**File**: `server/channels/store/searchlayer/completeness_exemptions.json` (new)

**Intent**: Document why each of the ~45 (plan: ~48) non-overridden `PostStore` methods (54 − 8 existing overrides − `SaveMultiple` fixed in Phase 2) needs no search-index side effect.

**Contract**: One entry per method with a specific reason. Bulk reasons for the obvious classes (reads/`Get*`/`Search` variants delegated elsewhere, analytics, etag/cache ops, export/reporting reads). **Methods requiring genuine light investigation before writing their line** (write-shaped, SaveMultiple-class): `OverwriteMultiple`, `PermanentDeleteBatch`, `PermanentDeleteBatchForRetentionPolicies`, `PermanentDeleteAssociatedData`, `RestoreContentFlaggedPost`, `Update`-adjacent batch ops. For each: find production callers and whether the index is reconciled elsewhere (e.g., retention may have its own ES cleanup); the outcome is either a reason stating where reconciliation happens, or an exemption reason of the form "known gap — follow-up filed: <ref>" plus an entry in this change's notes. **No code fixes for these in this change.**

#### 2. localcachelayer exemption file

**File**: `server/channels/store/localcachelayer/completeness_exemptions.json` (new)

**Intent**: Same triage for the ~48 (plan: ~51) non-overridden methods on the cache layer; the question per method is "does this mutate state whose cached projection (last-post-time, posts, etag, count) would go stale?".

**Contract**: Same format. Investigation focus: write methods (`Save`, `SaveMultiple`, `Update`, `Delete`, `Overwrite*`, `PermanentDelete*`) — establish where cache invalidation actually happens for them today (likely explicit `InvalidateLastPostTimeCache`/`ClearCaches` calls at the app layer) and cite that location in the reason. Same "known gap — follow-up filed" escape hatch; no fixes.

#### 3. Contributor-facing note

**File**: `server/channels/store/searchlayer/` and/or existing developer docs near the layers (smallest reasonable placement — e.g., a comment block atop each exemption file is acceptable if JSON-with-comments is avoided by using a sibling `README.md` or a doc comment in the layer file)

**Intent**: A developer hitting the new failure must immediately understand the contract: new `PostStore` methods need an override or an exemption-with-reason.

**Contract**: 5–10 lines: what the check is, where the exemption files live, the one-command repro (`make store-layers`).

### Success Criteria:

#### Automated Verification:

- `cd server && make store-layers` exits 0 with both exemption files in place; `git status --porcelain` clean
- Generator tests still pass: `cd server && go test ./channels/store/layer_generators/ -count=1`
- Full targeted packages: `cd server && go test ./channels/store/searchlayer/ ./channels/store/localcachelayer/ -count=1`
- Lint passes: `cd server && make check-style`

#### Manual Verification:

- End-to-end tripwire: temporarily add a dummy method to the `PostStore` interface in `store.go` (and sqlstore impl) → `make store-layers` fails for both manual layers with the actionable message; revert.
- Review pass over both exemption files: every write-shaped method's reason either cites a reconciliation mechanism (file:line) or a filed follow-up — no bare "TODO"/empty reasons.
- Confirm any follow-ups discovered during triage are actually filed/recorded (in this change's notes at minimum).

**Implementation Note**: This is the final phase; after automated verification passes, do the tripwire and review-pass checks before declaring the change complete.

---

## Testing Strategy

### Unit Tests:

- Phase 1: sentinel-value correspondence test (length, per-index value identity, serialization of `Props`/`Filenames`/`FileIds`, `RemoteId` pointer handling).
- Phase 2: searchlayer post-layer harness — `Save` characterization, `SaveMultiple` batch indexing, error propagation, burn-on-read skip.
- Phase 3: generator validator verdicts (set difference, stale exemptions, empty-reason rejection) + AST-extraction tripwire against real packages.

### Integration Tests:

- Existing real-DB storetest suite (`make test-server` / CI `postgres-store-tests`) must stay green — Phases 1–4 add no store behavior changes except the searchlayer override, which is above the SQL layer.

### Manual Testing Steps:

1. Bulk import a small JSONL with batched posts on a server with live indexing enabled → search finds the imported posts without "Index Now" (Phase 2).
2. Mutation test on `postToSlice` ordering (Phase 1).
3. Dummy-method tripwire on the `PostStore` interface → both layers fail `make store-layers` (Phase 4).

## Performance Considerations

- The `SaveMultiple` override adds a per-post channel fetch + synchronous engine index call on bulk-import batches when live indexing is enabled — explicitly accepted (matches single-save cost; large-import escape hatch is disabling live indexing + bulk reindex). No batching/async work in this change.
- Generator validation adds one extra AST parse of two layer packages to `make store-layers` — negligible against its existing whole-store parse.

## Migration Notes

- No schema, data, or config changes. All phases are revertible by reverting their commit; Phase 4's revert (deleting exemption files) cleanly deactivates Phase 3's enforcement due to opt-in semantics.

## References

- Related research: `context/changes/refactor-opportunities/research.md` (ranked opportunities; corrections to prior report)
- Source debt report: `context/changes/post-flow-analysis/research.md`
- Layer chain composition: `server/channels/app/platform/service.go:285-310`
- Save override pattern to mirror: `server/channels/store/searchlayer/post_layer.go:104-111`
- Generator structure: `server/channels/store/layer_generators/main.go:30-62,109-164`
- CI gate: `.github/workflows/server-ci.yml:163-179`
- Column arrays: `server/channels/store/sqlstore/post_store.go:53-103`
- Pure-unit test convention: `server/channels/store/sqlstore/utils_test.go:15`
- Bulk-import call sites: `server/channels/app/import_functions.go:1470,1915,2434`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: C2 Quick Win — Column-Array Correspondence Test

#### Automated

- [ ] 1.1 New test passes: `go test ./channels/store/sqlstore/ -run TestPostToSlice -short -count=1`
- [ ] 1.2 Quick suite passes for the package: `go test ./channels/store/sqlstore/ -short -count=1`
- [ ] 1.3 Lint passes: `make check-style`

#### Manual

- [ ] 1.4 Mutation check: swapped adjacent columns in `postToSlice` fail the test

### Phase 2: Fix the SaveMultiple Indexing Gap

#### Automated

- [ ] 2.1 New searchlayer tests pass: `go test ./channels/store/searchlayer/ -count=1`
- [ ] 2.2 `make store-layers` clean (no porcelain diff)
- [ ] 2.3 Server builds: `go build ./...`
- [ ] 2.4 Lint passes: `make check-style`

#### Manual

- [ ] 2.5 Bulk-imported posts searchable without "Index Now" (live indexing enabled)

### Phase 3: Generator Completeness Validation (Mechanism)

#### Automated

- [ ] 3.1 Generator tests pass: `go test ./channels/store/layer_generators/ -count=1`
- [ ] 3.2 `make store-layers` exits 0 with no exemption files (opt-in no-op) and no porcelain diff
- [ ] 3.3 Server builds: `go build ./...`
- [ ] 3.4 Lint passes: `make check-style`

#### Manual

- [ ] 3.5 Dry-run: incomplete throwaway exemption file fails `make store-layers` with actionable message

### Phase 4: Triage & Activate for PostStore on Both Layers

#### Automated

- [ ] 4.1 `make store-layers` exits 0 with both exemption files; porcelain clean
- [ ] 4.2 Generator tests pass: `go test ./channels/store/layer_generators/ -count=1`
- [ ] 4.3 Layer package tests pass: `go test ./channels/store/searchlayer/ ./channels/store/localcachelayer/ -count=1`
- [ ] 4.4 Lint passes: `make check-style`

#### Manual

- [ ] 4.5 Dummy-method tripwire fails `make store-layers` for both layers
- [ ] 4.6 Review pass: every write-shaped exemption cites reconciliation (file:line) or a filed follow-up
- [ ] 4.7 Triage follow-ups recorded in this change's notes
