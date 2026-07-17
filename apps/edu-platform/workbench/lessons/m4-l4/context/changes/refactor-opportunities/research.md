---
date: 2026-06-05T17:27:06+0200
researcher: mkczarkowski
git_commit: 29bab2184db42103dd30c0827059ef3f854847d4
branch: HEAD (detached at master)
repository: mattermost
topic: "Which recorded post-flow debt items are worth fixing, in what target shape, and in what order"
tags: [research, refactor, posts, store, sqlstore, searchlayer, codegen, contract, blast-radius]
status: complete
last_updated: 2026-06-05
last_updated_by: mkczarkowski
---

# Research: Refactor opportunities from the post-flow debt analysis

**Date**: 2026-06-05T17:27:06+0200
**Researcher**: mkczarkowski
**Git Commit**: `29bab2184db42103dd30c0827059ef3f854847d4`
**Branch**: HEAD (detached at master)
**Repository**: mattermost

## Research Question

`context/changes/post-flow-analysis/research.md` recorded technical debt and structural risks on the post-save flow but deliberately left open WHICH problems are worth fixing, in what target shape, and in what order. This research explores each recorded problem through three read-only lanes (current-shape evidence, history & intentionality, migration feasibility) and ranks them as refactor opportunities. **Exploring and deciding only — no refactoring happens in this change.**

Priors treated as evidence already gathered: `context/changes/post-flow-analysis/research.md`, `context/map/repo-map.md` (+ its three Wide Scan artifacts).

---

## Enumeration & classification (audit this first)

Every problem the post-flow report records, however labeled:

| # | Problem (report label) | Where recorded | Classification | Why |
|---|---|---|---|---|
| **P1** | TD-1: manual front/back mirror of the Post model (`model/post.go` ↔ `types/posts.ts`), no codegen/schema | §Technical debt | **CANDIDATE** (→ C1) | Fix = introduce a contract/codegen structure |
| **P2** | TD-2: positional column arrays in `sqlstore/post_store.go:53-143` + positional INSERT | §Technical debt + §Blast radius ("FRAGILNY szew kolumn") | **CANDIDATE** (→ C2) | Fix = restructure the write-mapping code |
| **P3** | TD-3: god-files on the path (`app/post.go` 3 957 ln, `sqlstore/post_store.go` 3 418, `model/post.go` 1 387, `store.go` 1 332) + `SaveMultiple` god-method | §Technical debt | **CANDIDATE** (→ C3) | Fix = decomposition |
| **P4** | TD-4: manual store layers (`searchlayer`, `localcachelayer`) outside codegen, no `DO NOT EDIT` | §Technical debt | **CANDIDATE** (→ C4) | Fix = structural guard / bring under generation |
| **P5** | TD-5: test gaps (searchlayer `Save→indexPost` zero coverage; retry/timer layers untested for `Post().Save`; app error mapping, single-`Save` rollback, persistent-notification validation, auto-translation untested) | §Technical debt | **NOT a candidate** | Missing tests, not structure — used as feasibility/guard input for C1–C4 |
| **P6** | No lint/CI checking consistency of the column arrays | §Sygnały do dalszej weryfikacji + Open Questions | **NOT a candidate** | Missing guard — becomes the prerequisite step for C2 |
| **P7** | Open question: scheduled posts on a separate route — shared or duplicated validation vs `CreatePost`? | §Open Questions | **NOT a candidate** (unconfirmed at enumeration; lightly verified below) | Recorded as a question, not a finding |

Out-of-enumeration prior: `repo-map.md` risks R1–R6 are context only (the report maps TD-1→R5-style, store→R6); frontend-only risks R1–R4 are outside this report's scope.

---

## Summary

- **All four candidates are confirmed real in today's code**, with three substantive corrections to the prior report (see "Corrections" below): C2 is **two** coupled arrays, not three; the Post contract is a **three-way** drift surface (Go ↔ TS ↔ OpenAPI), not two-way; and `localcachelayer` **is** tested — the manual-layer coverage hole is specifically searchlayer.
- **Intentionality splits the candidates cleanly in two.** C2 (positional arrays — a deliberate 2020 bulk-insert performance decision, commit `27d536b212`) and C4's manual-ness (search/cache layers were never generator candidates; generation is reserved for uniform cross-cutting wrappers) are **intentional constraints**. C1 (mirror inherited from the 2023 four-repo monorepo merge, codegen never once considered) and C3 (430 commits of accretion, no split event, no stated convention) are **accidental cruft**.
- **The single most consequential new finding:** `searchlayer` overrides `Save` but **not `SaveMultiple`** — batch saves silently pass through the embedded interface and trigger no indexing (`searchlayer/post_layer.go:16-18,104`). This is the TD-4 failure mode ("easy to forget") **already realized in the code**, not a hypothetical.
- **Live drift exists today on C1:** Go's `has_reactions` is absent from the TS type, and the in-repo OpenAPI `Post` schema has a `hashtag` (singular) typo and ~8 missing fields — three hand-maintained copies, zero tooling comparing any pair.
- **Every candidate has a cheap, additive, reversible first step** (detect-only guard) that exploits existing infrastructure: the govet analyzer framework, the blocking `check-store-layers`/`check-mocks` porcelain CI gates, the layer generator's existing full knowledge of the `PostStore` method set, and the real-DB storetest suite.
- Ranked opportunities (§Refactor opportunities): **C4 first** (smallest cost, realized failure mode, existing seam), **C1 second** (report's top debt, confirmed live drift, mechanism extensible to dozens of mirrored types), **C3 third — narrowed to `SaveMultiple` decomposition only** (genuine cruft with named-helper seams, but requires test-pinning first). C2's structural migration is **rejected** (intentional design, zero bug history — right-sized response is a consistency assertion, a guard rather than a refactor).

---

## Detailed Findings

### C1 — Manual front/back mirror of the Post model

**Current shape (lane 1):**
- Go `Post` struct at `server/public/model/post.go:113-152` (report said :114; struct starts at :113 today) vs TS `Post` at `webapp/platform/types/src/posts.ts:89-119`. [EVIDENCE]
- **Not in sync today**: `has_reactions` (`post.go:140`) has no TS counterpart. TS-only fields (`failed`, `user_activity_posts`, `state`, `exists`) are client-side UI state, not drift [INFERENCE]. `filenames` is `json:"-"` in Go (never on the wire) yet declared in TS — dead legacy on both sides. [EVIDENCE]
- **A third mirror exists and is the most drifted**: OpenAPI `Post` schema at `api/v4/source/definitions.yaml:432-475` — hand-maintained, has singular `hashtag` (typo/legacy) and omits ~8–11 fields present in Go (`is_pinned`, `has_reactions`, `remote_id`, `reply_count`, `last_reply_at`, `participants`, `is_following`, `message_source`…). Nothing is generated from it — the `api/` build only concatenates YAML into human-facing docs. [EVIDENCE]
- The only spec-sync tooling, govet `openApiSync` (`tools/mattermost-govet/openApiSync/openApiSync.go:124-247`), validates **route documentation only**, not struct↔schema fields; and `vet-api-check.sh:5` admits it is best-effort with a hard-coded allow-list. [EVIDENCE]
- **Class size**: `webapp/platform/types/src/` has 58 files mirroring `server/public/model/` structs — order of magnitude "dozens of mirrored types" (config, cloud, compliance, channels, users…), not just Post. [EVIDENCE/INFERENCE]
- The sync policy is explicitly manual: `webapp/platform/types/CLAUDE.OPTIONAL.md` — "align naming and shapes with server structs… Update types when server contracts change." No codegen mentioned. [EVIDENCE]

**Intentionality (lane 2): VERDICT — accidental cruft.**
- `posts.ts` entered this repo only via the monorepo merge `c943ed6859` (2023-03-22, four repos merged); the two halves were born in physically separate repositories. The manual mirror is an inheritance of the two-repo split, not an in-monorepo design choice. [EVIDENCE]
- No commit in history ever proposed generating TS types from Go or from the OpenAPI spec. [EVIDENCE — history grep]
- No drift-fix bug commit was found either — the cost is latent, not (visibly) realized. [EVIDENCE — absence]

**Feasibility (lane 3):**
- A **detect-only drift gate** (compare Go JSON-tag set ↔ TS key set ↔ optionally OpenAPI properties) requires changing **neither** side; the govet framework (28 existing analyzers) is a natural host for the Go-introspection half. [EVIDENCE/INFERENCE]
- Generation-in-place is the wrong first move: **145 webapp files import `Post`** from `@mattermost/types/posts` — generated output would have to be byte-identical or all importers churn. [EVIDENCE]
- Reversibility of the gate: high — pure addition; delete the CI job to revert.

### C2 — Positional column arrays in `sqlstore/post_store.go`

**Current shape (lane 1) — report corrected:**
- The real invariant couples **two** functions, not three: `postSliceColumnsWithTypes()` (`:53-80`, 18 columns, single source of column names/types) ↔ `postToSlice()` (`:82-103`, 18 values whose ORDER must match positionally). `postSliceColumns()` (`:105-111`), `postSliceColumnsWithName()` (`:114-121`) and `postSliceCoalesceQuery()` (`:123-143`) are all **derived** from `postSliceColumnsWithTypes()` and cannot drift. [EVIDENCE]
- Paired positionally at the chunked INSERT (`:256-258`) and at `Overwrite` (`:448-449`). Read path is by-name `sqlx` reflection (`:592`, `:645`, `:758`; `Post` has no usable `db:` tags) — write/read asymmetry confirmed. [EVIDENCE]
- **No test, init-assert, or lint checks the correspondence** — confirmed absence (P6 upgraded from suspicion to fact). [EVIDENCE]
- The `*ToSlice` pattern is the **house style** across sqlstore (status, channel, thread, team, draft, group stores); Posts is the only table with the richer `WithTypes` variant. [EVIDENCE]
- Same-type adjacent columns (`CreateAt/UpdateAt/EditAt/DeleteAt`; `UserId/ChannelId/RootId/OriginalId`) mean an order swap would likely pass the behavior-asserting storetest suite silently. [INFERENCE]

**Intentionality (lane 2): VERDICT — intentional constraint.**
- `27d536b212` (2020-03-11, "MM-21552: Adding SaveMultiple to posts (#13766)") deliberately replaced gorp's single-row reflective `GetMaster().Insert(post)` with positional arrays **to enable multi-row batched INSERT in one transaction** for bulk import performance. [EVIDENCE — pre/post diff + commit message]
- No column-order/missing-column bug-fix commit exists in `post_store.go` history. [EVIDENCE — absence]
- The *missing guard* on top of the intentional design is unmanaged; whether a safeguard was ever discussed: [UNKNOWN].

**Feasibility (lane 3):**
- Name-bound insert precedent exists **in the same file**: `savePostsPriority` / `savePostsPersistentNotifications` use `NamedExec` (`:3045`, `:3056`); ~20 sqlstore files use named bindings. [EVIDENCE]
- Cheapest guard: a unit test / `init()` assertion that `len(postSliceColumnsWithTypes()) == len(postToSlice(&model.Post{}))` plus per-index `reflect.Kind` match — pure addition, reversible. [INFERENCE]
- Full `NamedExec` migration has unknowns (JSON-encoded columns like `Props` via `StringInterfaceToJSON` need custom handling: [UNKNOWN] whether all 18 columns map cleanly). Pilotable on Posts, then propagatable to the other tables using the house pattern.

### C3 — God-files and the `SaveMultiple` god-method

**Current shape (lane 1):**
- Line counts confirmed: `app/post.go` 3 957, `sqlstore/post_store.go` 3 418, `model/post.go` 1 387, `store.go` 1 332. [EVIDENCE — wc -l]
- `SaveMultiple` (`post_store.go:159-339`) phase map: validation loop, burn-on-read branch, counter accumulation, transaction+chunked INSERT, and all post-commit updates are **inline**; threads (`updateThreadsFromPosts` :3067), priority (`savePostsPriority` :3035), persistent notifications (`savePostsPersistentNotifications` :3053) and `populateReplyCount` (:349) are **already extracted named helpers**. [EVIDENCE]
- `CreatePost` (`app/post.go:162-488`): ~10 inline responsibilities interleaved with ~12 existing named helpers (`deduplicateCreatePost`, `FillInPostProps`, `getEmbedsAndImages`, `attachFilesToPost`, `PreparePostForClient`, `handlePostEvents`…). `model.CreatePostFlags` is an existing options seam. [EVIDENCE]
- `app/post.go` holds **60 exported methods spanning several domains** (create/delete/patch/search/reminders/ephemeral/image-proxy/thread-move/burn-on-read) — several mixed concerns, not one. [EVIDENCE]

**Intentionality (lane 2): VERDICT — accidental cruft (accretion).**
- 430 additive commits since `97558f6a6e` (2017, "Add app package"); no "split post.go" event ever; refactor-labeled commits moved *other* concerns out. [EVIDENCE]
- The team **does** extract when motivated — sibling files `post_metadata.go`, `post_priority.go`, `post_persistent_notification.go`, `post_helpers.go` etc. exist — confirming the monolithic core is leftover accretion, not a chosen convention (no doc states a file-size/god-file convention). [EVIDENCE/INFERENCE]

**Feasibility (lane 3):**
- Intra-package file splits are **zero-risk and already the norm**: package `app` has 136 non-test files. [EVIDENCE]
- `SaveMultiple` decomposition is mostly moving already-delineated blocks within the package behind the existing named helpers. [INFERENCE from phase map]
- **Cost-raiser**: the branches an extraction would touch are exactly the untested ones (store-error mapping `app/post.go:366-377`, persistent-notification validation `:209-221`, auto-translation `:425-445`) — P5 input. [EVIDENCE]
- Blast radius: `Save`/`SaveMultiple` have 4 production call sites, but **`a.CreatePost` has ~40 internal callers** — its *signature* is a hot contract; only the *body* (and the store-side `SaveMultiple` body) is safe to decompose. [EVIDENCE]
- Reversibility: high (pure code movement, compiler + real-DB integration suite verify; revert = move back).

### C4 — Manual store layers outside codegen

**Current shape (lane 1):**
- Layer chain confirmed: **LocalCache → Timer → Search → Retry → Sql** (`app/platform/service.go:285-310`). retrylayer/timerlayer carry `DO NOT EDIT` (generated); searchlayer/localcachelayer do not (manual). `opentracinglayer` does not exist. [EVIDENCE]
- **The load-bearing mechanism**: both manual layers **embed the `store.PostStore` interface** (`searchlayer/post_layer.go:16-18`, `localcachelayer/post_layer.go:17-19`). A newly added `PostStore` method compiles fine and **silently passes through** — no compile error. The new method gets retry+timer (regenerated) but not search indexing or cache invalidation unless someone remembers. [EVIDENCE]
- **The failure mode has already happened**: `SearchPostStore` overrides `Save` (`:104` → `indexPost` `:108`) but **NOT `SaveMultiple`** — batch saves are not indexed at all. [EVIDENCE; production impact — e.g. whether bulk-import paths rely on a separate reindex job — UNKNOWN]
- Generator (`store/layer_generators/main.go:30-62,142-275`) builds exactly TimerLayer + RetryLayer from templates; it is purely structural (uniform wrapper per method) and **already AST-extracts the full `PostStore` method set** (`extractStoreMetadata`). It has no per-method semantic hooks — which is exactly why search/cache are hand-written. [EVIDENCE/INFERENCE]
- searchlayer wraps only 5 of ~40 sub-stores; its only test file is `layer_test.go` (one config-race test) — `Save→indexPost` has zero coverage, and `searchtest` exercises the read path only (answers the prior report's open question: **no indirect coverage**). `localcachelayer` **does have** `post_layer_test.go` + `temporary_post_layer_test.go`. [EVIDENCE]

**Intentionality (lane 2): VERDICT — intentional constraint (manual-ness); the missing guard is unmanaged.**
- Search/cache layers were created as behavior-specific abstractions (searchlayer `c66e182b08` 2020; localcachelayer `f8ad9f3b8f` 2019) and **never had a generator template** (templates that ever existed: timer, retry, opentracing, debugbar). Generation is reserved for uniform cross-cutting wrappers. [EVIDENCE]
- Opentracing layer was generated and removed in `f1acdce42c` (2025-01-29); removal rationale [UNKNOWN — terse squash message, no network access to PR #29965].

**Feasibility (lane 3):**
- The generator already has the authoritative method list and file-writing plumbing; it could emit a **completeness assertion** (generated test/file referencing every `PostStore` method on each manual layer), turning a forgotten override into a drift failure under the **existing blocking `check-store-layers` CI job** (`.github/workflows/server-ci.yml:163-179` — regenerate + fail on `git status --porcelain`). Mechanism description only. [EVIDENCE/INFERENCE]
- Reversibility: high — pure addition under an existing gate; no runtime behavior change to the layers.

### P7 — Scheduled posts (light verification; stays a non-candidate)

- Separate route `POST /api/v4/posts/schedule` → `createSchedulePost` (`api4/scheduled_post.go:19,73`) → `App.SaveScheduledPost` (`app/scheduled_post.go:15-50`) which **re-implements a thinner subset** of validation (PreSave/IsValid, archived-channel, restricted-DM), then persists a `ScheduledPost` row. The full `CreatePost` orchestration runs only later in the scheduler job (`scheduled_post_job.go:172,193` → `ToPost()` → `a.CreatePost`). [EVIDENCE]
- The coupling is acknowledged by **mirrored maintenance comments**: `api4/post.go:62` and `api4/scheduled_post.go:28` ("make the same change for scheduled posts"). [EVIDENCE]
- Verdict: duplication is real but thin; deciding what validation *should* be shared is a redesign of business behavior (which checks apply at schedule-time vs post-time) — per the brief's boundary, **noted and stopped here**; a different, later analysis.

---

## Corrections to the prior report

1. **TD-2 "three positional arrays" → two.** Only `postToSlice()` is an independent positional list; `postSliceColumns`, `postSliceColumnsWithName`, `postSliceCoalesceQuery` are derived from `postSliceColumnsWithTypes()`. The fragile invariant is the `postSliceColumnsWithTypes ↔ postToSlice` pair. (`post_store.go:53-143`)
2. **The Post contract is a three-way drift surface, not two-way** — the in-repo OpenAPI schema (`api/v4/source/definitions.yaml:432`) is a third hand-maintained, already-drifted copy.
3. **P6 upgraded from suspicion to fact**: no tooling guards either the column arrays or the model mirror (`openApiSync` checks routes only; `vet-api-check.sh` is best-effort).
4. **TD-4/TD-5 sharpened**: `localcachelayer` *is* tested; the manual-layer hole is specifically searchlayer — and searchlayer's missing `SaveMultiple` override means batch saves are not indexed (realized failure mode, impact unknown).
5. Minor: `Post` struct starts at `model/post.go:113` (not :114); `SaveMultiple` ends at `:339`.

---

## Refactor opportunities (ranked — my proposal, your decision)

Ranking criterion: **cost of the debt (likelihood × severity, weighted by evidence it has already bitten) vs cost of the change (effort + risk, weighted by reversibility and existing seams).**

### 1. C4 — Close the manual-layer silent-fallthrough hole

- **Current → target shape**: manual `searchlayer`/`localcachelayer` embed the `store.PostStore` interface, so forgotten overrides silently pass through → **generator-emitted completeness assertion** (interface method set ↔ explicit manual-layer overrides) under the existing `check-store-layers` CI gate; layers stay hand-written (respecting the intentional design); the known `SaveMultiple` indexing gap gets an explicit decision (override or documented exemption).
- **Why rank 1**: the failure mode is not hypothetical — `SaveMultiple` already slipped through (batch saves unindexed). Cost of change is the smallest of all candidates: the generator already AST-extracts the full method set, the blocking CI gate already exists, and the change is purely additive. Highest certainty-of-payoff per unit of effort.
- **Blast radius**: tiny — generator + one generated artifact + CI; zero runtime behavior change (until the `SaveMultiple` decision, which is a one-method override).
- **Incremental path**: (1) characterization test for `searchlayer.Save→indexPost` (closes TD-5's top gap); (2) generator emits completeness assertion for `PostStore` on both manual layers; (3) triage the assertion's initial failure list (incl. `SaveMultiple`) into explicit overrides or documented exemptions; (4) optionally extend beyond `PostStore`.
- **First prerequisite step**: establish whether the `SaveMultiple` indexing gap is a live production bug or covered elsewhere (bulk-index job on import?) — this determines whether step 3 starts with a bug fix.

### 2. C1 — Post contract drift gate (Go ↔ TS ↔ OpenAPI)

- **Current → target shape**: three hand-maintained copies of the Post contract with zero tooling comparing any pair → **a CI drift gate (not a generator)** over Go JSON-tags ↔ TS keys (↔ OpenAPI properties), both sides staying hand-written but provably in sync; piloted on Post, extensible to the dozens of mirrored types.
- **Why rank 2**: this is the report's TD-1 (highest-ranked debt) and the drift is **live today** (`has_reactions`; OpenAPI ~8 fields behind) — but no drift-induced bug was found in history, so severity is latent rather than realized. Cost is moderate (build a comparator; decide field-exemption policy for TS-only UI fields like `failed`). The mechanism's value compounds across the whole `model/` ↔ `types/` surface, which neither C2 nor C3 offers.
- **Blast radius**: zero on shipping code (detect-only; touches neither `post.go` nor `posts.ts`); 145 importers of `Post` are why generation-in-place is explicitly NOT the target shape.
- **Incremental path**: (1) one-off audit script for Post (report-only); (2) wire as non-blocking CI report; (3) fix the known drifts it confirms; (4) flip to blocking for Post; (5) extend type-by-type.
- **First prerequisite step**: the one-off Go-tags ↔ TS-keys comparison for `Post` with an explicit exemption list — it costs hours and produces the evidence (real drift count) that justifies or kills the rest.

### 3. C3 (narrowed) — Decompose `SaveMultiple` into its phase helpers

- **Current → target shape**: 180-line god-method mixing validation, counters, transaction, INSERT and four side effects (three already behind named helpers) → **thin orchestrator over per-phase helpers in the same package**; no interface change, no `CreatePost` signature change. The broader god-file split (app/post.go's 60 exported methods) is explicitly NOT in this slice.
- **Why rank 3**: genuine accretion (430 commits, no split event) and the seams already exist — but the debt's cost is friction on future change, not live risk, and the prerequisite work (pinning untested branches with characterization tests) makes it the most expensive of the three. Worth doing; not worth doing first.
- **Blast radius**: store-internal — `SaveMultiple` body only; 4 production call sites on the seam; real-DB storetest suite (incl. partial-failure/rollback assertions) guards behavior.
- **Incremental path**: (1) characterization tests for the untested branches that would move (store-error mapping `app/post.go:366-377`, single-`Save` rollback, burn-on-read branch); (2) extract inline phases one per PR (validation loop → counters → post-commit updates), each revertible; (3) only then consider the `app/post.go` per-concern file split as a follow-up campaign.
- **First prerequisite step**: characterization tests pinning `SaveMultiple`'s inline phases (especially the burn-on-read branch and post-commit updates) — TD-5's gaps are exactly where extraction would silently change behavior.

### Considered and rejected

- **C2 — migrate positional INSERT to name-bound (`NamedExec`)**: rejected as a refactor — the positional design is an evidenced intentional performance constraint (2020 bulk-insert decision) with zero recorded bugs in six years; the right-sized response is the cheap consistency assertion (`len` + per-index `reflect.Kind`), which is a guard, not a refactor. Recommend doing that assertion as a standalone quick win regardless of ranking.
- **C3 (broad) — split the god-files (`app/post.go` et al.) wholesale**: rejected for now — disproportionate cost and churn for friction-shaped (not risk-shaped) debt; the narrowed `SaveMultiple` slice captures most of the value at a fraction of the blast radius.
- **P7 — unify scheduled-post validation with `CreatePost`**: rejected per the brief's boundary — the duplication is real but deciding *which* validation applies at schedule-time vs post-time is a business-behavior redesign, a different and later analysis.
- **P5/P6 as standalone items**: not refactors — folded into the candidates as prerequisite steps (characterization tests, consistency assertion).

---

## Code References

- `server/public/model/post.go:113-152` — Go `Post` struct (one half of the three-way contract)
- `webapp/platform/types/src/posts.ts:89-119` — TS `Post` type (second half; `has_reactions` missing today)
- `api/v4/source/definitions.yaml:432-475` — OpenAPI `Post` schema (third copy; most drifted)
- `tools/mattermost-govet/openApiSync/openApiSync.go:124-247` — route-only spec sync (no field check)
- `webapp/platform/types/CLAUDE.OPTIONAL.md` — explicit manual-sync policy
- `server/channels/store/sqlstore/post_store.go:53-103` — `postSliceColumnsWithTypes` ↔ `postToSlice` (the real two-array invariant)
- `server/channels/store/sqlstore/post_store.go:256-258,448-449` — positional pairing sites (INSERT, Overwrite)
- `server/channels/store/sqlstore/post_store.go:3045,3056` — `NamedExec` precedent in the same file
- `server/channels/store/sqlstore/post_store.go:159-339` — `SaveMultiple` phase map; helpers at `:349,3035,3053,3067`
- `server/channels/app/post.go:162-488` — `CreatePost` orchestration; untested branches `:209-221,:366-377,:425-445`
- `server/channels/app/platform/service.go:285-310` — layer chain composition (LocalCache→Timer→Search→Retry→Sql)
- `server/channels/store/searchlayer/post_layer.go:16-18,104-111` — interface embedding + `Save` override; **no `SaveMultiple` override**
- `server/channels/store/localcachelayer/post_layer.go:17-19` — same embedding pattern (but has tests)
- `server/channels/store/layer_generators/main.go:30-62,142-275` — generator: builds timer+retry only; AST-extracts full method set
- `.github/workflows/server-ci.yml:50-66,131-145,163-179,203-246` — blocking drift gates (mocks, migrations, store-layers) + real-Postgres store tests
- `server/scripts/vet-api-check.sh:5-25` — best-effort API vet with allow-list
- `server/channels/app/scheduled_post.go:15-50`, `server/channels/app/scheduled_post_job.go:172,193`, `api4/post.go:62`, `api4/scheduled_post.go:28` — P7 scheduled-post duplication evidence

## Architecture Insights

- **The repo's guard idiom is "regenerate + fail on porcelain".** Seven blocking CI jobs already enforce generated-artifact freshness. Any new guard that can be expressed as a `make` target emitting a file becomes a hard gate for free — this is the seam C4 (and C2's assertion) should exploit.
- **Interface embedding is the manual layers' double edge**: it makes partial wrapping cheap (override 8 of 58 methods) and makes omissions invisible (silent passthrough). The generated layers avoid this by regenerating every method; the manual layers have no equivalent.
- **Intentionality is the ranking's hidden axis**: the two candidates whose shape was deliberately chosen (C2 positional bulk-insert, C4 manual semantic layers) should be *guarded*, not *reshaped*; the two that accreted (C1, C3) are legitimate reshaping targets. The evidence happens to make the cheapest fix (C4's guard) also the most urgent.

## Historical Context (from prior changes)

- `context/changes/post-flow-analysis/research.md` — the source report; its TD-1..TD-5 + open questions are this document's enumeration input. Three of its open questions are now answered: searchlayer save→index has **no** indirect coverage; **no** lint/CI guards the column arrays; drift history shows **no** recorded model-mirror bug (latent, not realized).
- `context/map/repo-map.md` — Wide Scan map; R5 (manual config contract) and R6 (store/migrations) framed the report's debt items; this research confirms the R5-style risk generalizes to a three-way contract surface.

## Related Research

- `context/changes/post-flow-analysis/research.md` — post-save flow trace, test gaps, blast radius (direct predecessor).

## Open Questions

- **Is the missing `searchlayer.SaveMultiple` override a live production bug?** Do bulk-import paths (`import_functions.go`, `slackimport`) rely on a separate post-import reindex job, or are imported posts unsearchable until a manual reindex? (First prerequisite of opportunity #1.)
- **Why was opentracinglayer removed** (`f1acdce42c`)? PR #29965 discussion unreachable offline; rationale unknown (does not block any opportunity).
- **Do all 18 Posts columns map cleanly to named bindings** (JSON-encoded `Props` etc.)? Only relevant if the rejected C2 migration is ever revisited.
- **What share of the ~58 mirrored types in `webapp/platform/types/src/` are actually drifted?** The Post pilot (opportunity #2, prerequisite step) produces the first real number.
