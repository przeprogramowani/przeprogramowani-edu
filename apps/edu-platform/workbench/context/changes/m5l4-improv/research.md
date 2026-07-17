---
date: 2026-06-09T11:27:12+0200
researcher: mkczarkowski
git_commit: e78f8bdb6e6853da1434989883b962556e883cc5
branch: master
repository: przeprogramowani-sites
topic: "m5-l4 'Shared AI Registry' rewrite — getting the student's needs right (order, details, approach); todo comments override schema/spec"
tags: [research, workbench, lesson, m5-l4, 10xdevs3, distribution, github-packages, codeartifact, 10x-cli]
status: complete
last_updated: 2026-06-09
last_updated_by: mkczarkowski
---

# Research: m5-l4 "Shared AI Registry" rewrite

**Date**: 2026-06-09T11:27:12+0200
**Researcher**: mkczarkowski
**Git Commit**: e78f8bdb6e6853da1434989883b962556e883cc5
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Rework `lessons/m5-l4/lesson-draft.md` from an early, leaky draft into a release-ready lesson **for the student who is a 10xDevs learner that will set up AI-artifact infrastructure for their own team/company**. Focus on getting the student's needs right in terms of **order, details, and approach**. Where `lessons-schema.json`, `lesson-spec.md`, and the author's in-draft `[todo]` comments conflict, **the `[todo]` comments win.**

## Summary

The current draft is structurally and tonally mismatched to its real audience. The prior `rc-review.md` graded it "Ready with minor fixes" **against the spec** — but the author's ~44 `[todo]` comments reject the spec's central narrative. Three problems dominate, and all three are author-confirmed re-architecture, not polish:

1. **Wrong audience framing (leaks).** Model 3 (the API+CLI) is drenched in 10xDevs-*operator* internals — Circle, KV sync, email-hash migration, `releaseAt` time-gating, course-revocation JWT, on-call runbooks, a fabricated smoke-test incident, offline-mode. The student does not care how *we* run the course. Most of this must be cut or translated to generic team terms.
2. **Wrong tone.** The draft apologizes for Model 2 (AWS CodeArtifact + Terraform) as an "over-build confession." The author rejects this outright: CodeArtifact is *managed* infra (not self-hosted), config-rich, gives freedom, costs ~zero, and was built deliberately to show the enterprise path. The genuinely heavy option is self-hosting Nexus/Verdaccio. The spec's "dystrybucja pod CV / I fell into the trap" failure-mode and the over-build teaser are **invalidated by author decision**.
3. **Wrong order + missing scaffolding.** The "two repo contexts" (source-of-truth repo vs consumer repo) are never established, so "one field in `package.json`" and "the installer" appear from nowhere. The mainstream-validation signal (Matt Pocock) lands far too late. The author wants: brief overview of all three models → "what about marketplaces?" → then per-model deep dives.

Good news for execution: **the source material to fix all of this already exists** in the three learnings digests and the real `10x-toolkit` / `10x-cli` repos — including verbatim code snippets, real manifest examples, and the exact reframes the author is asking for. The open factual questions (GitHub Packages private billing, `.npmrc` producer/consumer split, versioning library) are now resolved against official docs. Three small gaps need author confirmation (listed in Open Questions).

This research feeds a **full re-architecture plan** (`/10x-plan m5l4-improv`), not a fix-pass.

---

## The authoritative requirement set: the 44 `[todo]` comments, themed

The user instructed that `[todo]` comments override schema/spec. Catalogued from `lessons/m5-l4/lesson-draft.md` and grouped into the themes the rewrite must satisfy. Line numbers are the draft's.

### Theme A — Reverse the Model-2 tone (STOP apologizing) — *highest-impact, conflicts with spec*
- L166: infra isn't "heavy" — it's *elaborate for large orgs and gives freedom*.
- L173: drop the apologetic "najcięższy z możliwych"; CodeArtifact+Terraform is *"something in the middle"*; the heavy thing is self-hosting on Nexus.
- L179: not a regretful reflection — author just looked for an even simpler on-ramp to lower the barrier.
- L186: CodeArtifact is *managed infra with rich permission/behavior config*, not "your own infrastructure."
- L191: clarify "repository" for a newcomer; don't repeat the litany; **"NIE PRZEPRASZAMY ZA FAJNE ROZWIĄZANIE."**
- L360: author didn't "fall into a trap" — deliberately chose the enterprise build to demonstrate it. Kill the self-deprecating failure-mode framing.
- **Conflict with spec:** `lesson-spec.md:87-93,159-161` (over-build teaser + "dystrybucja pod CV" failure mode) and `rc-review.md:56-57` (graded these a "pass"). **Per user instruction, the todos win — retire the over-build/confession spine.**

### Theme B — Establish the two repo contexts early (core pedagogy gap)
- L60: "one field in `package.json`" is shown before establishing it lives in the *source-of-truth repo*; structure shown too late → logical gap.
- L89: *we* are the skill author — must explain the two contexts: (a) source-of-truth/artifacts repo, (b) consumer repo that installs.
- L131: clarify jargon "no-op", where the env var is set, whether `.npmrc` is gitignored.
- L216: "instalator" appears from nowhere in the sentinel section — nothing introduces it.

### Theme C — Strip 10xDevs-operator leaks from Model 3 (cut or translate)
- L265: "you as consumer" = the *10xDevs* context, not the company context under discussion — bracket it explicitly.
- L278: JWT/revocation is course technicalia — *translate* to "access changes take effect immediately for a team".
- L283: Circle sync — **cut** (no company uses Circle).
- L288: email-hash/KV migration — **cut** (course-specific; KV is a shield for *our* rate-limit characteristic; non-issue for most companies).
- L293: `releaseAt` time-gating — **cut** as operator detail (but the *capability* "impossible in a plain registry" can stay as a generic differentiator).
- L303: say "API endpoint", not Cloudflare "Worker".
- L313, L319: on-call / "maintain not publish" / runbooks — too course-specific.
- L316: smoke test is just a normal e2e check — **do not fabricate** the "smoke failed after promotion" incident.
- L322: offline-mode — **cut** ("a registry has no real offline mode either").
- **Keep (transferable):** L296 Ed25519 signing (MITM/supply-chain protection — valuable); L306 sentinel-injection guard (explain it); the storage→gate→applicator skeleton; the multi-tool applicator.

### Theme D — Reframe *why* Model 3 / CLI exists
- L115, L253: it's **not** "the registry stops being enough." It's: you may **not have a registry**, and you may have **consumers across different tech stacks** (a registry serving many stacks is *more* complex than a CLI), plus you want to **deliver material progressively**. With packages that progressive split is hard.
- L242: the mechanism is **`10x-cli`** (name the tool) — `10x auth`/`10x get` are its commands, not the tool. Don't conflate categories.
- L238: weak Model-3 opening ("the one promised at repo-source") — the source repo is used by *every* model; just introduce it plainly as the next model.

### Theme E — Add concrete code / fix "abstract yet too detailed"
- L133, L135: auth-plumbing (preinstall, CF token sync) is *too abstract AND too detailed* — needs real code snippets or simplification.
- L228: manifest pattern — explain better, **show a real manifest example** (author points to `/Users/admin/code/10xCards`).
- L154: link an automatic-versioning library (conventional-commits tooling).
- L112: the two-package (content vs installer) split is too complex and sudden — **redo or delete**.

### Theme F — Major reorder
- L163: introduce the "registry-distribution is now mainstream" signal (Matt Pocock) **much earlier**, to validate the approach — not late, not as "look what I built."
- L346: **present all three models briefly first → "a co z marketplace'ami?" → then deep-dive each model.**
- L351: marketplaces — lead with **vendor lock-in** as the real risk (tool rotation is too high today).

### Theme G — Resolve open factual questions (now answered — see "Resolved facts")
- L72 `.npmrc` producer vs consumer; L126 GitHub Packages private billing/free tier; L144 why commit types lie + how `git diff` helps; L176 link CodeArtifact + costs are really ~zero; L154 versioning library; L201 scope vs domain-name difference; L203 OIDC/IAM steps are pipeline-declared not manual; L199 the TF_PLUGIN_TIMEOUT command everyone must still run.

---

## Detailed Findings

### 1. The two-repo context model (Theme B) — source material exists

- The producer/consumer split is concrete in the digests: producer = the toolkit repo (`@przeprogramowani/10x-toolkit`, publishes on every merge to master); consumer = any repo running `npm install` (`lessons/m5-l4/github-packages-learnings.md:13,72`).
- The mechanism that *connects* them: the installer **patches the consumer project** — writes/extends `.npmrc`, adds a `preinstall` script to the consumer's `package.json`, patches the consumer's GitHub Actions workflow (`github-packages-learnings.md:42,46-52`). A workspace-link guard makes the installer skip patching when it runs inside the source monorepo itself (`...:87-88`; confirmed in code at `/Users/admin/code/10x-toolkit/packages/internal-pkg/src/install.ts:375-382`).
- Gap: no literal consumer `package.json` example is reproduced in the digests — the draft will synthesize a minimal one from the field references. Real consumer `.npmrc` exists though (see #2).

**Implication:** introduce "two repos" as the lesson's first concrete scaffold, *before* the `publishConfig` snippet. This single move fixes todos L60, L89, and L216 at once (the "installer" becomes the thing that lives in/acts across these two repos).

### 2. `.npmrc` producer vs consumer (Theme B/G) — resolved, with real files

From official docs **and** the real repos (they agree):

- **Producer (source-of-truth):** routing via `publishConfig.registry` in `package.json` (the toolkit installer uses `https://npm.pkg.github.com` — `/Users/admin/code/10x-toolkit/packages/internal-pkg/package.json:12-14`). `publishConfig` only *routes*; publishing still needs **auth** supplied separately in CI (a secret `.npmrc`/env token, never committed).
- **Consumer:** a **committed** `.npmrc` with only the scope→registry mapping. Real example, verbatim: `/Users/admin/code/10xCards/.npmrc` →
  ```
  @przeprogramowani:registry=https://npm.pkg.github.com
  ```
  Plus a **token line that is never committed**, injected at install time:
  ```
  //npm.pkg.github.com/:_authToken=${GH_PKG_TOKEN}
  ```
- Net rule for the lesson: **both sides touch `.npmrc`-style config, but different config.** Producer = `publishConfig` (routing) + CI auth; consumer = committed scope mapping + injected token line. (Official: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- **Open gap (author confirm):** the digests don't state whether the token-bearing `.npmrc` is gitignored. In practice the committed line is just the scope mapping; the token line is appended at runtime. The draft should say the token line is never committed — confirm gitignore convention with author (todo L131).

### 3. Auth plumbing as code (Theme E) — verbatim snippets available

The "abstract yet too detailed" section can be grounded with real code:

- **Preinstall token injection** (the actual constant), `/Users/admin/code/10x-toolkit/packages/internal-pkg/src/github-packages-auth.ts:4-8`:
  ```
  [ -n "$GH_PKG_TOKEN" ] && echo '//npm.pkg.github.com/:_authToken=${GH_PKG_TOKEN}' >> .npmrc || true
  ```
  "No-op locally" = `GH_PKG_TOKEN` is unset on a dev machine (devs auth via `~/.npmrc` from a one-time `npm login`), so the test is false and `|| true` short-circuits. In CI the secret is set, so the token lands. (`github-packages-learnings.md:46-49`)
- **Read/write asymmetry** (the single best complexity illustration): same CI job *reads* private deps with the long-lived `GH_PKG_TOKEN` PAT but *publishes* with the ephemeral auto-provided `GITHUB_TOKEN` + `permissions: packages: write` (`github-packages-learnings.md:59-67`).
- **Workflow patching** (`github-packages-auth.ts:12-73`) and **Cloudflare token-sync step** (`...:167-233`, sets the token on **both production and preview** — matches [[feedback_cf_secrets_both_envs]]); local `cf-auth` command (`/Users/admin/code/10x-toolkit/packages/internal-pkg/src/cf-auth.ts:1-363`).
- **Decision for the rewrite:** these are *builder* internals. Learner-facing prose may only use `10x auth`/`10x get` (`lesson-grounding.md:189`), and the auth section is the author's biggest "too detailed" complaint. Recommend: keep the **preinstall one-liner + read/write asymmetry** as the one concrete code beat; demote CF-sync/workflow-patching to a single sentence or Deep Dive. (Resolves L133/L135.)

### 4. Automatic versioning (Theme E/G) — resolved

- The toolkit's own approach: `conventional-recommended-bump` (angular preset) + a **`git diff` ground-truth gate** that only releases if package-shipping files actually changed — "commit types can be wrong, `git diff` cannot" (`github-packages-learnings.md:94-108`; script at `packages/internal-pkg/scripts/auto-version.mjs`). This directly answers L144 (why commit types lie, how diff helps).
- Linkable libraries to satisfy L154 (official docs, verified live):
  - **semantic-release** (commit-message-driven, auto-publishes) — https://semantic-release.org
  - **Changesets** (intent-file-driven, monorepo-friendly) — https://github.com/changesets/changesets
  - **release-please** (commit-driven, opens a release PR; doesn't publish itself) — https://github.com/googleapis/release-please
  - Lesson framing: commit-message-driven vs intent-file-driven; pick by repo shape.

### 5. The two-package split (Theme E) — confirmed, but treat as one line

- Confirmed in the real monorepo: `packages/ai-artifacts` (content) vs `packages/internal-pkg` (publishable installer, depends on content as `workspace:*`). The build copies artifacts into `dist/` because **`npm pack` cannot follow `workspace:` paths** — stated verbatim in `/Users/admin/code/10x-toolkit/packages/internal-pkg/scripts/copy-artifacts.sh` header.
- The "npm pack can't follow workspace:" justification is **real code truth** but is NOT in the digests (the digests only give the editorial rationale "authors never touch installer code", `github-packages-learnings.md:89-91`). Grounding marks installer internals `mustNotCover` beyond one line (`lesson-grounding.md:235`).
- **Decision (resolves L112):** cut the paragraph to a single optional sentence or move to Deep Dive. It is not load-bearing for the student.

### 6. Model 2 (CodeArtifact) reframe (Theme A) — fully supported by source

The digests already contain exactly the framing the author wants:

- The genuinely heavy alternative is **self-hosting Verdaccio on ECS/Fargate** (5–10 min deploys, $25–45/mo, far more HCL) — CodeArtifact is the *managed* option that **won** that comparison (`webinar-learnings.md:47,86`). This is the author's "something in the middle, Nexus is the heavy one" point (L173), already grounded.
- **Cost ~zero** for most: free tier, author's case "w okolicach zera" (`webinar-learnings.md:47`; flagged as internal estimate — present as experience, `lesson-grounding.md:161,233`). Link CodeArtifact docs (L176): https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html and the product page.
- **Repository vs domain vs registry** clarity for newcomers (L191): one CodeArtifact *domain* (`devs10x`) holds two *repositories* — `npm` (private) + `npm-store` (proxy to public npm) — so devs get one endpoint (`webinar-learnings.md:46`). Must disambiguate from "repository = where I keep code."
- **Scope vs domain-name** (L201): package scope `@10xdevs` ≠ CodeArtifact domain `devs10x`; scoped login routes only your scope through CodeArtifact (`webinar-learnings.md:50`).
- **OIDC/IAM are pipeline-declared, not "manual"** (L203): nuance — the role-assumption runs in CI via `aws-actions/configure-aws-credentials@v4`; only the OIDC provider + S3 state bucket are one-time bootstrap, framed as a deliberate "codify vs bootstrap" boundary, not a weakness (`webinar-learnings.md:54-56`). Workflow needs `permissions: id-token: write` or OIDC fails silently.
- **Gotchas to keep as cost lines, not apology:** lowercase-domain-name rule (`10xdevs`→`devs10x`, `webinar-learnings.md:50,72`); `TF_PLUGIN_TIMEOUT=300` for the ~700MB AWS provider v5 — and note **everyone must still run this command** even without a demo (L199, `webinar-learnings.md:75`). Drop the useless `terraform apply` 39s detail (L176).

### 7. Model 3 reframe + leak triage (Themes C/D) — classification done

**Ownership (author-confirmed 2026-06-09):** m5-l4 owns Model 3's depth in full. m5-l1 is only the module's wide intro (to m5-l2/l3/l4) and does not absorb this content. The cuts below are because the items are **10xDevs-operator noise that doesn't transfer to a team**, not because they belong in another lesson.

Author's correct motivation (replace "registry stops being enough"): **multi-stack consumers + progressive material delivery + private source / public delivery** (`api-cli-learnings.md:15,18,19`). The tool is **`10x-cli`** (`/Users/admin/code/10x-cli`, bin `10x`, v1.8.0 — "Fetch and apply AI coding skills, prompts, and configs into your workspace"; commands `auth`/`get`/`list`/`doctor`).

| Model-3 element | Verdict | Note (todo) |
|---|---|---|
| storage → gate → applicator skeleton | **KEEP (generic)** | three replaceable layers generalize |
| multi-tool applicator (7 tool profiles) | **KEEP — make it central** | `tool-profile.ts:26-110` maps each tool→dir; this IS the "different stacks" motivation (D) |
| Ed25519 bundle signing | **KEEP (translate)** | MITM/supply-chain protection (L296); enforced in code `signing.ts:34` `REQUIRE_SIGNATURES=true` |
| sentinel-injection guard | **KEEP (explain)** | `sentinel-migration.ts:97-108` refuses bodies containing markers (L306) |
| API-host allowlist | **KEEP (translate)** | "CLI talks only to its API endpoint", not "Worker" (L303); `api-client.ts:12-64` |
| install manifest (per-file SHA-256) | **KEEP (generic)** | real example below; clean uninstall |
| magic-link / JWT / refresh-rotation | **TRANSLATE to one line** | "access changes apply immediately for a team" (L278); cut rotation mechanics |
| entitlements synced to KV | **TRANSLATE to pattern** | "sync entitlement out of business system, check locally" generalizes; Circle specifics cut |
| Circle membership | **CUT** | L283 — no company uses Circle |
| email-hash / KV migration | **CUT** | L288 — operator-only, non-issue for companies |
| `releaseAt` time-gating | **CUT mechanics; keep capability** | L293 — "impossible in plain registry" stays as differentiator |
| on-call / runbooks / "maintain not publish" | **CUT (or 1 line)** | L313/L319 |
| smoke test as fabricated incident | **REWRITE** | L316 — it's a normal e2e check; no incident story |
| offline-mode tradeoff | **CUT** | L322 — registry has none either |
| "you as consumer" | **BRACKET** | L265 — that's the 10xDevs context, not the company one |

### 8. Sentinel markers + manifest (Themes B/E) — real artifacts to show

- **Sentinel markers** (current CLI pair), `/Users/admin/code/10x-cli/src/lib/sentinel-migration.ts:23-24`:
  ```
  <!-- BEGIN @przeprogramowani/10x-cli -->
  ...team rules...
  <!-- END @przeprogramowani/10x-cli -->
  ```
  Idempotent replace + orphan-marker repair (`...:91-168`); the CLI migrates the old installer markers (`@przeprogramowani/10x-toolkit`) to the new ones. Same pattern recurs across all three models.
- **Install manifest** — a real example to satisfy L228 exists in 10xCards:
  - CLI manifest: `/Users/admin/code/10xCards/.claude/.10x-cli-manifest.json` (`MANIFEST_FILENAME`, v3; per-skill file lists + SHA-256 hashes; `manifest.ts:15-59`).
  - Installer manifest: `/Users/admin/code/10xCards/.claude/.10x-toolkit-manifest.json` (`mode: symlink|copy`, `source`, `links`, `artifacts`; `install.ts:238-246,387-389`).
  - The draft should show one trimmed real manifest and explain mode + file list → reliable uninstall (no guessing, no dependence on `node_modules`).
- **The "installer" must be named/introduced before this section** (L216) — tie it to the two-repo model from #1.

### 9. Payload-skill replacement (todo L4/L109) — use earlier-module skills

The `code-review` payload belongs to m5-l3 (in progress) — wrong choice. Real earlier-module skills wired via course-content (`/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-NN/lesson-NN.ts`):
- **`10x-agents-md`** (m1-l4) — *best single swap*: it generates a **rules** artifact, so one example carries both the `skills/` and `rules/` (sentinel) beats.
- `10x-shape` + `10x-prd` (m1-l1) — clean pair; `10x-tech-stack-selector` (m1-l2); `10x-plan`/`10x-implement` (m2-l2); `10x-research` (m2-l4).
- These are literally "the many skills from earlier modules" the student already pulled via `10x get`, so the swap is accurate and de-risks the m5-l3 dependency.

### 10. Reorder + structure constraints (Theme F)

**Intro scope (author-confirmed 2026-06-09):** the existing m5-l4 intro stays as-is for this pass — do **not** rework it or fold it into m5-l1's framing (no de-duplication against the module intro for now).

Author's target flow: **headingless intro → brief overview of all three models → "A co z marketplace'ami?" → per-model deep dives → decision table → alternatives/failure → Zadania → Odznaka → Deep Dive → Materiały dodatkowe.** Constraints from `references/lesson-structure.md` and `references/style.md`:
- The overview, marketplace section, and per-model deep dives are all **Core** content between the H1 intro prose and `## 🧑🏻‍💻 Zadania praktyczne`. The reorder is Core-internal; the fixed tail (Zadania → Odznaka → Deep Dive → Materiały) must not move (`lesson-structure.md:9-18`).
- **No `## Wstęp` / `## Core`** headings; the overview gets its own descriptive H2 (e.g. "Trzy modele dystrybucji", 3–8 words), not a promo "w tej lekcji omówimy 1,2,3" list — introduce models inside argument prose (`lesson-structure.md:22-31`; `style.md:43-53,185-203`).
- "A co z marketplace'ami?" promotes from H3 to a top-level H2 if it precedes the deep dives; don't orphan the "Tabela decyzyjna" parent.
- Mainstream signal (Matt Pocock) moves into the overview/early framing to validate the approach (L163), not the Model-2 retrospective.
- **Emdash sweep** is a real cleanup target (43 in ~376 lines; `style.md:137-147`). Several headings are thesis/contrast-style ("…, nie tylko zapisywarka plików") — simplify per `style.md:185-203`.

---

## Resolved facts (official docs, as of mid-2026)

- **GitHub Packages private billing (L126):** public packages are fully free (storage + transfer). Private packages are **not free beyond an included per-plan allowance** but cost nothing until you exceed it; storage (hourly) + data transfer (per download) count, and transfer via Actions `GITHUB_TOKEN` is free. **Do not hard-code GB numbers** — link https://docs.github.com/en/billing/concepts/product-billing/github-packages.
- **`.npmrc` producer/consumer (L72):** see Finding #2 — both sides, different config.
- **Classic-PAT limitation (dated claim):** docs still state the npm registry on GitHub Packages requires a **classic PAT** ("only supports authentication using a personal access token (classic)"). Roadmap #558 (fine-grained support) is **still open**, last moved 2024-06-26, `ga`-labeled (contradictory signal). Keep "as of mid-2026, re-check" framing; recommend classic PAT as the documented path. (https://github.com/github/roadmap/issues/558)
- **Versioning libraries (L154):** semantic-release / Changesets / release-please — see Finding #4.

---

## Code References

- `lessons/m5-l4/lesson-draft.md` — 44 `[todo]` comments = the authoritative requirement set (themed above)
- `lessons/m5-l4/{webinar,github-packages,api-cli}-learnings.md` — primary source digests (per-finding citations above)
- `lessons/m5-l4/lesson-grounding.md:189,228-237` — learner-facing command rule; claims to soften; installer internals out of scope
- `lessons/m5-l4/outdated-lesson-marker-references.md` — m5 reorder: this lesson is m5-l4, forward neighbor m5-l5, "AI Internal Builders" is now m5-l1 and **precedes** it
- `/Users/admin/code/10x-toolkit/packages/internal-pkg/src/github-packages-auth.ts:4-8,12-73,167-233` — preinstall, workflow patch, CF sync
- `/Users/admin/code/10x-toolkit/packages/internal-pkg/scripts/copy-artifacts.sh` — "npm pack cannot follow workspace: paths"
- `/Users/admin/code/10x-cli/src/lib/{tool-profile.ts:26-110, sentinel-migration.ts:23-24,97-108, signing.ts:34, api-client.ts:12-64}` — multi-tool profiles, markers, injection guard, signing, host allowlist
- `/Users/admin/code/10xCards/.claude/.10x-cli-manifest.json` and `.10x-toolkit-manifest.json` — real manifest examples
- `/Users/admin/code/10xCards/.npmrc` — real consumer scope mapping
- course-content `module-01..02/lesson-*.ts` — earlier-module skills for the neutral payload

## Architecture Insights

- **The student is the producer, not the consumer.** The draft repeatedly slips into the 10xDevs-as-operator voice. The rewrite's through-line should be "*you* are setting up distribution for *your* team" — the 10xDevs CLI is only an illustrative case, explicitly bracketed.
- **Audience drives the model, not impressiveness — but without the self-flagellation.** Keep the audience-first decision framework (it's good), drop the "I over-built / fell into the CV trap" narrative. CodeArtifact is a legitimate, deliberately-chosen enterprise demonstration.
- **Model 3's real axis is stack diversity + progressive delivery**, not "external/gated/revocable." Lead with multi-tool applicator (7 profiles) as the concrete payoff; keep only the transferable security trio (signing, host allowlist, sentinel guard).
- **Concrete-but-bounded:** the author wants more real code (preinstall, manifest, markers) AND less operator detail. The resolution is *select* the load-bearing snippets and push the rest to Deep Dive.

## Historical Context (from prior changes)

- No prior `context/changes/**` entries for this lesson (this change `m5l4-improv` is the first). The lesson's own in-folder artifacts (`lesson-spec.md`, `lesson-grounding.md`, `rc-review.md`, three learnings digests) are the historical record.
- **`rc-review.md` (2026-06-08) graded the draft "Ready with minor fixes" against the spec.** This research supersedes that verdict on the points where the author's todos reject the spec (Model-2 tone, Model-3 leaks, order). The rc-review remains valid for: emdash density, missing `sentinel-markers.png` asset, handout-wiring blocker, and Matt Pocock quote re-verification.

## Related Research

- `lessons/m5-l4/lesson-spec.md` — the spec the todos partly override; still authoritative for thesis, learning outcomes, prework continuity, structure tail.
- Memory [[release-translated-m4-learnings]], [[feedback_cf_secrets_both_envs]] — CF preview/production secret parity, relevant to the CF token-sync detail if it stays.

## Open Questions (need author/human decision before/while planning)

1. **Payload skill:** confirm `10x-agents-md` (recommended — produces a rules artifact, covers skills+rules beats) vs the `10x-shape`/`10x-prd` pair, as the running example replacing `code-review`.
2. **Model-3 ownership — RESOLVED (author, 2026-06-09):** Do **not** defer/relocate Model-3 building detail to m5-l1. m5-l1 (AI Internal Builders) is the module's **wide introduction** to the whole build-for-your-team arc (m5-l2 SDK agents, m5-l3 code review, m5-l4 registry); as an intro it does not own the API/CLI depth. **m5-l4 keeps its Model-3 architecture** (storage→gate→applicator, 7-tool applicator, Ed25519 signing, host allowlist, sentinel guard, manifest), translated to generic team terms. The operator-specific cuts in Finding #7 (Circle, email-hash migration, `releaseAt`, runbooks, offline-mode) still apply — but the rationale is **"operator noise that doesn't transfer,"** not "m5-l1 owns it." Consequence: the draft's L324 back-pointer ("temat, od którego ten moduł się zaczął") may stay as a light nod to m5-l1 as the module opener, but must NOT hand off Model-3 substance to it.
3. **`.npmrc` gitignore convention:** confirm the token-bearing `.npmrc` line is treated as never-committed / gitignored (todo L131) so the draft states it correctly.
4. **Two-package split:** confirm it can be reduced to one sentence / Deep Dive (recommended) rather than taught (todo L112).
5. **`SECURITY.md` vs code mismatch:** `10x-cli/SECURITY.md` says `REQUIRE_SIGNATURES=false`; live `signing.ts` ships `true`. Cite the code (signatures enforced); optionally flag the stale doc to the CLI maintainer.
6. **Course video-scenario / handout wiring** (carried from rc-review): Zadanie 2 + the video depend on a handout not yet wired into `10x get` under ref `m5l4`; reconcile the 4-vs-5 spec-file list. Release-coordination, not a prose blocker — but affects what Zadania can instruct.
