# m5-l4 "Shared AI Registry" — Re-Architecture to Release-Ready Implementation Plan

## Overview

Rewrite `lessons/m5-l4/lesson-draft.md` from a leaky, mis-ordered early draft into a release-ready lesson whose through-line is **"you set up AI-artifact distribution for your team."** The current draft is graded "Ready with minor fixes" against the spec, but the author's ~44 `[todo]` comments reject the spec's central narrative on three axes: wrong audience framing (10xDevs-operator leaks in Model 3), wrong tone (apologizing for a deliberate managed-infra build), and wrong order + missing scaffolding. Per author instruction, **the `[todo]` comments win over schema/spec/rc-review** wherever they conflict.

This plan also includes the cross-repo wiring that unblocks Zadanie 2 (`10x get m5l4` handout) and a light `lessons-schema.json` sync. Asset-PNG **production** (rendering + CDN upload) is deferred; the plan defines the rendered-artifact-card shot list and inline references so narration is designed in.

## Current State Analysis

- **Draft:** `lessons/m5-l4/lesson-draft.md`, 416 lines, ~44 `[todo:` author comments = the authoritative requirement set (themed A–G in `research.md`).
- **Structure today:** intro → "Artefakty AI to kod" → requirements → Model 1 → Model 2 → patterns → Model 3 → decision table → marketplaces (as H3 *inside* the table section) → failure mode → tail (Zadania/Odznaka/Deep Dive/Materiały).
- **Three confirmed problems:**
  1. **Audience leaks** — Model 3 is drenched in operator internals (Circle, KV email-hash migration, `releaseAt` time-gating, JWT-revocation mechanics, on-call runbooks, a fabricated smoke-test incident, offline-mode).
  2. **Apologetic tone** — Model 2 (CodeArtifact + Terraform) is framed as an "over-build confession" / "najcięższy z możliwych" / "dystrybucja pod CV trap." Author rejects this: CodeArtifact is *managed* infra, config-rich, ~zero cost, deliberately built to show the enterprise path. The genuinely heavy option is self-hosting Nexus/Verdaccio.
  3. **Wrong order + missing scaffolding** — the two repo contexts (source-of-truth vs consumer) are never established, so "one field in `package.json`" and "the installer" appear from nowhere; the mainstream-validation signal (Matt Pocock) lands too late.
- **Fix material exists:** verbatim code/snippets and real artifacts in `lessons/m5-l4/{webinar,github-packages,api-cli}-learnings.md`, the real `10x-toolkit` / `10x-cli` repos, and real files in `/Users/admin/code/10xCards` (`.npmrc`, `.claude/.10x-cli-manifest.json`, `.10x-toolkit-manifest.json`). Open factual questions resolved in `research.md` "Resolved facts."
- **Rendered-card technique exists:** `scripts/render-artifact-screenshots.mjs` slices a section from a real `.md`/code file → micromark+GFM → dark HTML card → 2× Playwright shot (card bar shows real file path + origin badge) → `assets/<name>.png`; referenced as `![](./assets/<name>.png)` + `<!-- cdn: … -->`, uploaded via `upload-assets.mjs`. Currently shot definitions are m4-only.

## Desired End State

A release-candidate `lesson-draft.md` that:

- Reads as "distribution for **your** team," with the 10xDevs CLI used only as an explicitly-bracketed case study.
- Opens: headingless intro (reworked to flow forward) → `## Trzy modele dystrybucji` (brief 3-model overview in argument prose) → `## A co z marketplace'ami?` (lead with vendor lock-in) → per-model deep dives → decision table → failure mode → fixed tail.
- Establishes the two-repo context (source-of-truth vs consumer) **before** the first `publishConfig` snippet.
- De-apologizes Model 2 and reframes its video as the enterprise/managed-infra path.
- Cuts operator noise from Model 3, translates the transferable bits to team terms, and keeps + shows the security trio (sentinel guard, Ed25519 signing, API-endpoint allowlist) as real (bracketed) 10x-cli snippets.
- Carries no `[todo:` comments, ≤ a handful of em-dashes, and rendered-card references for the load-bearing artifacts.
- Has Zadanie 2's handout wired into `10x-toolkit` course-content under ref `m5l4`.

**Verification:** `node scripts/lesson-context.mjs m5-l4` runs clean; the draft passes `lesson-editor-pl` then `lesson-rc-review`; `10x get m5l4` resolves the specs in the toolkit repo.

### Key Discoveries

- The student is the **producer**, not the consumer; the draft repeatedly slips into operator voice (`research.md` Architecture Insights).
- Model 3's real axis is **stack diversity + progressive delivery**, not "external/gated/revocable" (`api-cli-learnings.md:15,18,19`; todo L115/L253).
- `.npmrc` split (resolved + verified): the consumer `.npmrc` **is committed** (tracked, not gitignored — confirmed in `/Users/admin/code/10xCards/.npmrc`) and holds *only* the scope→registry line; the token line `//npm.pkg.github.com/:_authToken=${GH_PKG_TOKEN}` is never written into that file — it's injected at install (CI env / `~/.npmrc` locally). Producer routes via `publishConfig` + separate CI auth.
- Real artifacts to show as cards: `10x-toolkit/packages/internal-pkg/package.json:12-14` (`publishConfig`), `github-packages-auth.ts:4-8` (preinstall one-liner), `10x-cli/src/lib/sentinel-migration.ts:23-24` (markers), `10xCards/.claude/.10x-cli-manifest.json` (manifest), `10x-cli/src/lib/{signing.ts:34, api-client.ts:12-64}` (security trio).
- Structure tail (Zadania → Odznaka → Deep Dive → Materiały) is fixed and must not move (`references/lesson-structure.md:9-18`); no `## Wstęp`/`## Core`; overview gets a descriptive H2, not a promo "w tej lekcji omówimy 1,2,3" list (`style.md:43-53,185-203`).
- Em-dash sweep is a real target (~43 in ~376 lines, `style.md:137-147`).

## What We're NOT Doing

- ~~**Not** rendering or uploading asset PNGs (Playwright run + `upload-assets.mjs`) — deferred follow-up.~~ **Pulled in as Phase 8** (author decision, 2026-06-09): the render + upload now run in this change.
- **Not** producing the course **video-scenario** artifact (Model 1 screencast) — deferred.
- **Not** retaining the over-build/confession spine, the "dystrybucja pod CV" failure-mode, or "najcięższy z możliwych" framing (author-invalidated).
- **Not** teaching the two-package (content vs installer) split — deleted entirely (author decision).
- **Not** teaching cloud/IaC from scratch — Terraform/IAM/AWS stay as cost lines and gotchas.
- **Not** re-teaching m4-l1 multi-repo framing or prework concepts (back-reference only).
- **Not** handing Model-3 substance to m5-l1 (author-resolved: m5-l4 owns Model 3's depth in full).

## Implementation Approach

Sequential edits to one draft file, phased by lesson region so each phase is independently readable and verifiable, followed by an editorial polish (`lesson-editor-pl`), the cross-repo handout wiring, a light schema sync, and a final `lesson-rc-review` gate (per `[[feedback_editor_before_review]]`: editor first, then review, never parallel). Rendered-artifact-card references are inserted where the artifact appears; their shot definitions are added to `render-artifact-screenshots.mjs` so a later production run renders them.

## Critical Implementation Details

- **Card provenance must stay truthful.** The render script's core rule is that the card bar shows the real file path + a truthful origin badge. Model 3 cards therefore show real 10x-cli names (Worker, Circle, `@przeprogramowani/10x-cli`); prose must **bracket** them ("this is our course's gate; your team's equivalent looks like X") rather than rewrite the card. Model 1 cards (consumer `.npmrc`, `publishConfig`, manifest, sentinel markers) are already generic/authentic.
- **Ordering trap (todo L60/L89/L216):** the two-repo context (source-of-truth vs consumer) and "the installer" must be named **before** the `publishConfig` snippet, the `.npmrc` snippet, and the sentinel section. This single scaffold resolves three todos at once.
- **Marketplace section promotion:** moving "A co z marketplace'ami?" to a top-level H2 before the deep dives means the decision-table section must not be left with an orphaned marketplace subsection — reconcile the "Tabela decyzyjna i alternatywy" parent (todo L346, `research.md` Finding #10).

---

## Phase 1: Re-architecture scaffold (order, intro, overview, marketplaces, two-repo context)

### Overview

Establish the new section skeleton and the opening flow. Rework the intro to lead forward into a three-model overview, add the overview H2 and the promoted marketplace H2, and introduce the two-repo context as the lesson's first concrete scaffold.

### Changes Required:

#### 1. Intro prose (reworked to new flow)

**File**: `lessons/m5-l4/lesson-draft.md` (L1–21)

**Intent**: Rework the headingless intro to flow into the three-model overview (author chose "rework intro to match new flow," overriding the earlier "keep intro as-is"). Remove the apologetic AWS over-build teaser (L19–21); replace with a forward-looking framing that the same fundament can be done simply (GitHub Packages) or as deliberate managed infra (CodeArtifact) or as a gated product (API+CLI). Keep the "five weeks of warsztat → how to share it" hook.

**Contract**: H1 unchanged; intro ends by handing off to `## Artefakty AI to kod`. No specific registry product over-claimed as universal; no confession spine.

#### 2. Retained setup sections before the overview (author-decided order)

**File**: `lessons/m5-l4/lesson-draft.md` (`## Artefakty AI to kod` L23–41; `## Czego potrzebuje dystrybucja artefaktów AI` L43–53)

**Intent**: Keep BOTH conceptual sections as their own sections **before** the three-model overview, in this order: intro → `## Artefakty AI to kod` (the pre-npm "artifacts are code" thesis) → `## Czego potrzebuje dystrybucja artefaktów AI` (the 5 requirements = decision-table rows) → overview. This puts the measuring stick in hand before any model is sketched (author decision). Trim each lightly; do not fold the pre-npm analogy into the overview.

**Contract**: Both H2 sections retained and reordered to sit before `## Trzy modele dystrybucji`. The 5-requirement list stays the canonical decision-table-row source.

#### 3. New overview section `## Trzy modele dystrybucji`

**File**: `lessons/m5-l4/lesson-draft.md` (new H2 after the requirements section)

**Intent**: Briefly introduce all three models in argument prose so the reader has a map before deep dives. Fold in the "registry-distribution is now mainstream" signal (Matt Pocock) **here**, early, to validate the approach (todo L163).

**Contract**: Descriptive H2 (3–8 words), not a promo "w tej lekcji omówimy 1,2,3" list (`style.md:185-203`). Introduces M1 (registry you already have), M2 (managed enterprise infra), M3 (gated product) in one-line-each prose, measured against the requirements just established. Matt Pocock reference moves out of the Model-2 retrospective.

#### 4. Promoted `## A co z marketplace'ami?`

**File**: `lessons/m5-l4/lesson-draft.md` (new H2 right after the overview; content lifted from current L343–351)

**Intent**: Promote the marketplace discussion from an H3 inside the decision-table section to a top-level H2 immediately after the overview (todo L346). Lead with **vendor lock-in** as the real risk (tool rotation too high today), not the softer "channel mismatch" framing (todo L351).

**Contract**: H2 `## A co z marketplace'ami?`; keeps the SKILL.md-portable-but-delivery-locked point; ends by pointing into the per-model deep dives. The decision-table section later must not retain an orphaned marketplace H3.

#### 5. Two-repo context scaffold

**File**: `lessons/m5-l4/lesson-draft.md` (new prose, placed before Model 1's `publishConfig`)

**Intent**: Establish the two contexts — (a) source-of-truth/artifacts repo that publishes, (b) consumer repo that installs — and name "the installer" as the thing that lives in / acts across them (todos L60, L89, L216). This is the scaffold every later snippet leans on.

**Contract**: Plain prose introducing producer vs consumer; defines "installer" before it is used in the sentinel and auth sections.

### Success Criteria:

#### Automated Verification:

- `node scripts/lesson-context.mjs m5-l4` runs without error.
- Draft contains H2 `## Trzy modele dystrybucji` and H2 `## A co z marketplace'ami?` (grep).
- Setup order holds: `## Artefakty AI to kod` and `## Czego potrzebuje dystrybucja artefaktów AI` both appear before `## Trzy modele dystrybucji` (grep order).
- No `## Wstęp` or `## Core` headings present (grep).
- Fixed tail order preserved: `## 🧑🏻‍💻 Zadania praktyczne` → `## Odbierz swoją odznakę` → `## 🔎 Deep Dive` → `## 📚 Materiały dodatkowe` (grep order).

#### Manual Verification:

- Intro reads forward into the overview with no apologetic teaser; the over-build/confession spine is gone.
- The three models are recognizable from the overview before any deep dive.
- The two-repo context is established before the first `publishConfig`/`.npmrc` snippet; "installer" is defined before first use.
- Matt Pocock mainstream signal appears in the early framing, not the Model-2 retrospective.

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding.

---

## Phase 2: Model 1 — GitHub Packages

### Overview

Rewrite the Model 1 body so the "one field" simplicity lands on top of the now-established two-repo scaffold, delete the two-package split, ground the auth asymmetry in one real code beat, and resolve the `.npmrc`, billing, and versioning facts.

### Changes Required:

#### 1. Model 1 body + source-of-truth repo structure

**File**: `lessons/m5-l4/lesson-draft.md` (current L55–115)

**Intent**: Present GitHub Packages as the default, anchored to the source-of-truth repo. Show the repo tree (skills/, rules/, prompts/, config-templates/) and the `publishConfig` field as the "provisioning." Replace the `code-review` running example with a **broad** reference to the skills/prompts/rules learners collected across earlier modules (author: "we can go really broad"), using representative names where a concrete anchor helps. **Delete** the two-package split paragraph (L111–112) entirely.

**Contract**: `publishConfig` snippet stays; repo-tree shown as the source-of-truth context. Card candidate: real `publishConfig` from `10x-toolkit/packages/internal-pkg/package.json:12-14` → `![](./assets/publishconfig.png)` + cdn comment. No `code-review`-specific dependency on m5-l3. No mention of content/installer two-package split.

#### 2. `.npmrc` producer/consumer resolution

**File**: `lessons/m5-l4/lesson-draft.md` (current L71–78)

**Intent**: State the resolved + verified split (todo L72/L131): the consumer `.npmrc` is committed (not gitignored) and holds only the scope→registry mapping; the token line is never written into it — it's injected at install (CI env / `~/.npmrc` locally). Producer routes via `publishConfig` + separate CI auth.

**Contract**: Consumer `.npmrc` card candidate from `/Users/admin/code/10xCards/.npmrc` (`@przeprogramowani:registry=…`). Prose names the never-committed token line `//npm.pkg.github.com/:_authToken=${GH_PKG_TOKEN}`.

#### 3. Auth asymmetry as the one code beat

**File**: `lessons/m5-l4/lesson-draft.md` (current L117–137)

**Intent**: Keep the read/write asymmetry (write = ephemeral `GITHUB_TOKEN` + `permissions: packages: write`; read = long-lived PAT plumbed everywhere, with the same-org `GITHUB_TOKEN` exception). Ground "no-op locally" with the real preinstall one-liner. Demote CF-token-sync and workflow-patching to a single sentence (or Deep Dive), per "too abstract AND too detailed" (todos L131/L133/L135).

**Contract**: Preinstall card candidate from `github-packages-auth.ts:4-8` (`[ -n "$GH_PKG_TOKEN" ] && echo … >> .npmrc || true`). "No-op locally" explained = `GH_PKG_TOKEN` unset on dev machines. CF-sync compressed to one line; keep the cross-env (production + preview) note as a one-liner per `[[feedback_cf_secrets_both_envs]]`.

#### 4. Versioning + billing facts

**File**: `lessons/m5-l4/lesson-draft.md` (current L139–154)

**Intent**: Explain why commit types lie and how the `git diff` gate fixes it (todo L144); link automatic-versioning libraries (todo L154); state GitHub Packages billing correctly without hard-coded GB numbers (todo L126).

**Contract**: Link `semantic-release` (https://semantic-release.org), Changesets (https://github.com/changesets/changesets), release-please (https://github.com/googleapis/release-please) framed as commit-driven vs intent-file-driven. Billing: link https://docs.github.com/en/billing/concepts/product-billing/github-packages; public free, private within plan allowance, no GB literals. Keep classic-PAT-only gotcha with "as of mid-2026, re-check" framing.

### Success Criteria:

#### Automated Verification:

- Two-package split removed: no "workspace:" / "npm pack" paragraph remains in the Model 1 body (grep).
- No `code-review` as the named running-example payload in Model 1 (grep).
- Versioning library links present (grep for semantic-release / changesets / release-please).
- `node scripts/lesson-context.mjs m5-l4` still clean.

#### Manual Verification:

- "One field" simplicity lands on top of the two-repo scaffold (no logical gap).
- Auth section is concrete (preinstall one-liner) but no longer drowning in CF/workflow detail.
- `.npmrc` producer/consumer distinction is correct and unambiguous.
- Billing claim has no invented numbers; classic-PAT framing is dated.

**Implementation Note**: Pause for manual confirmation before proceeding.

---

## Phase 3: Model 2 — CodeArtifact (tone reversal + video reframe)

### Overview

Reverse the apologetic tone throughout Model 2: CodeArtifact is deliberate managed infra that gives freedom at ~zero cost; the genuinely heavy option is self-hosting Nexus/Verdaccio. Reframe the webinar video as the enterprise/managed-infra path.

### Changes Required:

#### 1. De-apologize the Model 2 framing

**File**: `lessons/m5-l4/lesson-draft.md` (current L156–186)

**Intent**: Remove "najcięższy z możliwych," the "refleksja/over-build" beat, and the "przerost formy nad treścią" dismissal (todos L166/L173/L179/L186). Reframe: CodeArtifact = managed infra (not "your own infrastructure"), config-rich on permissions/behavior, ~zero cost for most, deliberately built to demonstrate the enterprise path. Position self-hosting Nexus/Verdaccio as the actually-heavy alternative ("something in the middle"). Drop the useless `terraform apply` 39s detail (todo L176); link CodeArtifact docs.

**Contract**: Keep the Verdaccio-on-ECS cost contrast as a cost line, not an apology. Link https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html. "NIE PRZEPRASZAMY ZA FAJNE ROZWIĄZANIE" spirit (todo L191).

#### 2. Repository vs domain vs registry clarity + gotchas

**File**: `lessons/m5-l4/lesson-draft.md` (current L188–204)

**Intent**: Disambiguate "repository" for a newcomer — one CodeArtifact *domain* holds two *repositories* (private + npm proxy) giving one endpoint (todo L191); clarify scope (`@10xdevs`) ≠ domain (`devs10x`) (todo L201); reframe OIDC/IAM as **pipeline-declared, not manual** steps with a deliberate "codify vs bootstrap" boundary (todo L203); keep the lowercase-domain rule and `TF_PLUGIN_TIMEOUT=300` as cost lines, noting everyone must still run the timeout command even without a demo (todo L199).

**Contract**: Drop the "litania" repetition of what's used. Gotchas stay as a tight "na co uważać" list, framed as costs not weaknesses. `permissions: id-token: write` note kept.

#### 3. Video reframe

**File**: `lessons/m5-l4/lesson-draft.md` (current L181–183, 207)

**Intent**: Reframe the webinar video (VIDEO PLACEHOLDER + Materiały link) as "a full walkthrough of the deliberate enterprise/managed-infra option" — remove "origin story" / "nadmiarowa wersja" / "historia pochodzenia" framing.

**Contract**: VIDEO PLACEHOLDER text updated; "when Model 2 wins" criteria kept honest (AWS-native org, registry-level governance) so it isn't oversold. URL unchanged (https://www.youtube.com/watch?v=hbuCLvwbMVg).

### Success Criteria:

#### Automated Verification:

- Apologetic phrases removed: no "najcięższy z możliwych" / "przerost formy" / "historia pochodzenia" / "nadmiarowa wersja" in Model 2 (grep).
- No `terraform apply` 39s detail remains (grep "39").
- CodeArtifact docs link present (grep).
- `node scripts/lesson-context.mjs m5-l4` clean.

#### Manual Verification:

- Model 2 reads as a legitimate, deliberate enterprise choice — no confession.
- repository/domain/registry distinction is clear to a newcomer.
- OIDC/IAM framed as pipeline-declared; gotchas read as costs, not regrets.
- Video framing is enterprise-walkthrough, consistent with the de-apologized tone.

**Implementation Note**: Pause for manual confirmation before proceeding.

---

## Phase 4: Patterns that survive every model

### Overview

Tighten the three cross-model patterns now that the installer is introduced (Phase 1). Show real artifacts as cards: sentinel markers and a trimmed real manifest.

### Changes Required:

#### 1. Sentinel markers (with installer now defined)

**File**: `lessons/m5-l4/lesson-draft.md` (current L211–225)

**Intent**: Explain how the installer injects a block between sentinel markers into user-edited rule files without clobbering human edits (todo L216 resolved by Phase 1's installer scaffold). Keep the idempotent-replace explanation.

**Contract**: Sentinel-marker card candidate from `10x-cli/src/lib/sentinel-migration.ts:23-24` → `![](./assets/sentinel-markers.png)` + cdn comment (production deferred). Generic `<!-- BEGIN @twoj-zespol/ai-toolkit -->` form kept in inline prose.

#### 2. Manifest with real example

**File**: `lessons/m5-l4/lesson-draft.md` (current L227–228)

**Intent**: Explain mode + file list → reliable uninstall, and show one trimmed real manifest (todo L228).

**Contract**: Manifest card candidate from `/Users/admin/code/10xCards/.claude/.10x-cli-manifest.json` (trimmed) → `![](./assets/manifest.png)` + cdn comment. Prose explains per-file SHA-256 → clean uninstall without depending on `node_modules`.

#### 3. SKILL.md open standard + path-placement challenge

**File**: `lessons/m5-l4/lesson-draft.md` (current L230–233)

**Intent**: Keep SKILL.md as the cross-tool open standard; add that the one real challenge is placing the skill (or a link to it) under the path each tool reads (todo L231).

**Contract**: agentskills.io reference kept; multi-tool applicator framing set up as the bridge into Model 3's 7-tool profiles.

### Success Criteria:

#### Automated Verification:

- Card references present for sentinel markers and manifest (grep `assets/sentinel-markers.png`, `assets/manifest.png`).
- `node scripts/lesson-context.mjs m5-l4` clean.

#### Manual Verification:

- Sentinel section no longer references "the installer" as an undefined term.
- Manifest example is concrete and the uninstall guarantee is clear.
- SKILL.md section names the path-placement challenge.

**Implementation Note**: Pause for manual confirmation before proceeding.

---

## Phase 5: Model 3 — API+CLI (leak triage, reframe, security trio)

### Overview

The heaviest phase. Cut operator noise, translate transferable bits to team terms, reframe *why* Model 3 exists, name the tool (`10x-cli`), and keep + show the security trio as real bracketed snippets. Apply the keep/translate/cut table from `research.md` Finding #7.

### Changes Required:

#### 1. Reframe *why* Model 3 exists + name the tool

**File**: `lessons/m5-l4/lesson-draft.md` (current L235–253)

**Intent**: Open Model 3 plainly as the next model (todo L238). Name the mechanism `10x-cli` (with `10x auth`/`10x get` as its commands, not the tool — todo L242). Replace "registry stops being enough" with the real motivation: you may have **no registry**, **consumers across different tech stacks** (a registry serving many stacks is *more* complex than a CLI), and you want **progressive material delivery** (todos L115/L253).

**Contract**: Bracket "you as consumer" = the 10xDevs context, not the company context (todo L265). Keep the storage → gate → applicator three-layer skeleton + diagram.

#### 2. Cut operator-only leaks

**File**: `lessons/m5-l4/lesson-draft.md` (current L280–322)

**Intent**: **Cut** Circle membership (L283), email-hash/KV migration (L288), `releaseAt` mechanics (keep only the capability "impossible in a plain registry" as a generic differentiator — L293), on-call/runbooks/"maintain not publish" (L313/L319), offline-mode (L322), and the fabricated smoke-test incident (rewrite as a normal pre-release e2e check — L316).

**Contract**: The "Uprawnienia: synchronizuj, nie odpytuj" pattern survives as a generic line ("pull entitlement out of the business system into local store, check locally") with Circle/KV-rate-limit specifics removed (todo L288). The "utrzymywać not opublikować" section collapses to at most one neutral line.

#### 3. Translate the transferable bits

**File**: `lessons/m5-l4/lesson-draft.md` (current L269–278, L298–308)

**Intent**: Translate JWT-revocation mechanics to one team line: "a change in access permissions takes effect immediately for a team" (todo L278); cut rotation-family mechanics. Say "API endpoint," not Cloudflare "Worker" (todo L303).

**Contract**: Magic-link/JWT/refresh detail reduced to the one-line capability; host-allowlist described as "CLI talks only to its API endpoint."

#### 4. Security trio as real bracketed cards/snippets

**File**: `lessons/m5-l4/lesson-draft.md` (current L290–308)

**Intent**: Keep and **show** the transferable security trio (author: "show real snippets, translated"): Ed25519 bundle signing (MITM/supply-chain protection — todo L296), sentinel-injection guard (refuse rule bodies containing markers — todo L306), API-host allowlist. Show real 10x-cli code, **bracketed** as the 10xDevs case ("this is our course's gate; your team's equivalent looks like X").

**Contract**: Card candidates from `10x-cli/src/lib/signing.ts:34` (Ed25519, `REQUIRE_SIGNATURES=true`) and `api-client.ts:12-64` (host allowlist), plus the sentinel-injection guard from `sentinel-migration.ts:97-108`. Cards show truthful origin badges (real names); prose brackets them. Cite the enforced behavior (signatures required, fail-closed): the `10x-cli/SECURITY.md` stale note was corrected in this change to match `signing.ts` (`REQUIRE_SIGNATURES = true`), so the doc and code now agree.

#### 5. Reconcile the closing back-pointer

**File**: `lessons/m5-l4/lesson-draft.md` (current L324)

**Intent**: Keep the light nod to m5-l1 as the module opener, but do **not** hand off Model-3 substance to it (research Open Q2 resolved).

**Contract**: One-line forward/back nod; no transfer of architecture ownership.

### Success Criteria:

#### Automated Verification:

- Operator-leak terms removed from Model 3 prose: no "Circle", "email", "offline", "runbook", "on-call", "smoke" incident framing, `releaseAt` mechanics (targeted grep, allowing the single bracketed 10xDevs mention if intentionally retained).
- "Worker" replaced by "API endpoint" in Model 3 prose (grep "Worker").
- Tool named: `10x-cli` appears as the mechanism (grep).
- Security-trio card references present (grep `assets/` for signing/allowlist where rendered).
- `node scripts/lesson-context.mjs m5-l4` clean.

#### Manual Verification:

- Model 3's *why* leads with stack diversity + progressive delivery, not "registry stops being enough."
- All cut items (Circle, email-hash, `releaseAt` mechanics, runbooks, offline, smoke incident) are gone; no fabricated incident.
- JWT/revocation reads as a one-line team capability; host-allowlist says "API endpoint."
- Security trio is shown as real, honestly-bracketed 10x-cli snippets; provenance is truthful.
- "You as consumer" is bracketed as the 10xDevs context.

**Implementation Note**: Pause for manual confirmation before proceeding.

---

## Phase 6: Decision table, failure mode, tail + editorial polish

### Overview

Reconcile the decision table with the translated content, reframe the failure mode, finalize the tail, then run the Polish editorial pass and the em-dash/heading sweep.

### Changes Required:

#### 1. Decision table reconciliation

**File**: `lessons/m5-l4/lesson-draft.md` (current L326–341)

**Intent**: Update table cells so every cell traces back to prose that survived the rewrite (no operator-only facts); ensure the marketplace H3 is no longer orphaned here (it moved to a top-level H2 in Phase 1).

**Contract**: Rows = the requirement list. Model 3 cells use translated team terms (e.g. "access changes apply immediately," "tool profiles in CLI"). "Najczęstszy błąd" subsection retained but reframed (next item).

#### 2. Failure-mode reframe

**File**: `lessons/m5-l4/lesson-draft.md` (current L355–360)

**Intent**: Reframe "dystrybucja pod CV / I fell into a trap" — the author **deliberately** chose the enterprise build to demonstrate it (todo L360). Keep the genuine lesson ("start from the audience, not from what's impressive to build") without the self-flagellation.

**Contract**: The "audience is the first row of the table" point stays; the personal "trap" confession is removed.

#### 3. Tail finalization (Zadania, Odznaka, Deep Dive, Materiały)

**File**: `lessons/m5-l4/lesson-draft.md` (current L364–415)

**Intent**: Keep Zadanie 2 as-is (author decision; its handout is wired in Phase 7). Keep **all three** Deep Dive subsections (`Anatomia instalatora`, `Kontrakt repo prywatne/publiczne CLI`, `Meta-pętla`). Reframe `Anatomia instalatora` so it presents the installer as the package's **scripts/CLI layer for install/update/uninstall** — valid even in a single-package approach (author clarification) — NOT as a consequence of the deleted two-package split. Verify Materiały links and the Matt Pocock link/date.

**Contract**: Fixed tail order preserved; Deep Dive intro convention (`lesson-structure.md:57-72`) followed; the Deep Dive intro topic list matches the three retained subsections. `Anatomia instalatora` carries no reference to the two-package split; symlink-vs-copy modes, manifest, presets, and old-version migration stay as installer-layer detail. Materiały link format (`[Title](URL) — desc`) followed; prework entry format preserved.

#### 4. Editorial polish pass

**File**: `lessons/m5-l4/lesson-draft.md` (whole file)

**Intent**: Run `lesson-editor-pl` to remove generic AI prose, fix Polglish, tighten argument architecture, and do the em-dash sweep + thesis/contrast-heading simplification (`style.md:137-147,185-203`). Remove all remaining `[todo:` comments.

**Contract**: Em-dash count materially reduced; headings simplified; zero `[todo:` markers remain; voice matches `references/style.md`.

### Success Criteria:

#### Automated Verification:

- Zero `[todo:` comments remain (grep).
- Em-dash count reduced (grep count of `—` well below ~43).
- Fixed tail order intact (grep).
- `node scripts/lesson-context.mjs m5-l4` clean.

#### Manual Verification:

- Every decision-table cell traces to surviving prose.
- Failure mode reads as principle, not confession.
- Deep Dive intro list matches its three retained subsections; `Anatomia instalatora` reads as the install/update/uninstall scripts-layer (single-package-valid), with no two-package-split reference; Materiały links well-formed.
- `lesson-editor-pl` output reads as release-candidate Polish, on-voice.

**Implementation Note**: Pause for manual confirmation before proceeding. Run `lesson-editor-pl` **before** the Phase 7 RC review (never parallel — `[[feedback_editor_before_review]]`).

---

## Phase 7: Cross-repo handout wiring + schema sync + RC gate

### Overview

Wire Zadanie 2's curated specs into the `10x-toolkit` so `10x get m5l4` resolves, sync the workbench schema for m5-l4, and run the final RC review.

### Changes Required:

#### 1. Handout wiring in 10x-toolkit

**File**: `/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-05/lesson-04.ts` (and curated spec files)

**Intent**: Wire **all 5** curated specs (`spec-skill.md`, `spec-pack.md`, `spec-cicd.md`, `spec-terraform.md`, `conventions.md`) into course-content under ref **`m5l4`** (author decision) so `10x get m5l4` delivers them. The 4 GH-Packages specs are the base; `spec-terraform.md` is marked **AWS appendix**. Fix/annotate any wrong `--namespace @devs10x` login hint in the source material.

**Contract**: Ref = `m5l4`; 5 specs delivered, terraform flagged as appendix (keeps Zadanie 2's "część specyfikacji opisuje wariant AWS" note valid). Follow the existing course-content wiring shape for module-05 lessons. Run the toolkit repo's own build/typecheck after wiring.

#### 2. Workbench schema sync

**File**: `lessons-schema.json` (m5-l4 entry; recorded m5-l3 `owns` proposal)

**Intent**: Light enrichment of the **m5-l4 entry only** to match resolved decisions (owns/referencesOnly/mustNotCover/learningOutcomes per `lesson-spec.md`) — author decision: do NOT touch m5-l3 this pass (the recorded m5-l3 proposal is a separate future change).

**Contract**: Touch only the m5-l4 lesson object. Validate against `schemas/lessons-schema.schema.json`. Do not mass-add fields across other lessons.

#### 3. Render-card shot definitions (deferred production)

**File**: `scripts/render-artifact-screenshots.mjs`

**Intent**: Add m5-l4 shot definitions for the card candidates (publishConfig, consumer `.npmrc`, preinstall one-liner, sentinel markers, manifest, signing/allowlist) pointing at the real source files, with redactions where needed. **Do not run** the render/upload (deferred).

**Contract**: `node scripts/render-artifact-screenshots.mjs --dry-run` lists the new m5-l4 shots without rendering. Source files referenced by absolute path with missing-file skip (script already supports this).

#### 4. Final RC review

**File**: `lessons/m5-l4/lesson-draft.md`

**Intent**: Run `lesson-rc-review` as the release gate over schema/spec/grounding/draft/neighbors, including the linear coherence-and-flow pass.

**Contract**: RC review reports findings ordered by severity; no blocking drift/leak/unsupported-claim findings remain (asset-PNG production and video-scenario are known deferred items, flagged not blocking).

### Success Criteria:

#### Automated Verification:

- `10x get m5l4` resolves the specs in the toolkit repo (or the toolkit repo's content test passes).
- Toolkit build/typecheck passes after wiring.
- `lessons-schema.json` validates against `schemas/lessons-schema.schema.json`.
- `node scripts/render-artifact-screenshots.mjs --dry-run` lists the new m5-l4 shots.

#### Manual Verification:

- `10x get m5l4` delivers the curated specs; `spec-terraform.md` is marked as AWS appendix; login-hint annotation correct.
- Schema m5-l4 entry reflects resolved owns/mustNotCover/learningOutcomes.
- `lesson-rc-review` returns no blocking findings; deferred items (PNG render, video-scenario) are explicitly listed as follow-ups.

**Implementation Note**: This phase spans two repos (workbench + `10x-toolkit`). Pause for manual confirmation after handout wiring before the RC gate.

---

## Phase 8: Render + upload m5-l4 artifact screenshots

### Overview

Produce the artifact-card PNGs deferred in Phase 7: render the 7 m5-l4 shots defined in `render-artifact-screenshots.mjs`, normalize the draft's image references to the canonical embed form, upload the PNGs to the CDN, and let `upload-assets.mjs` stamp `<!-- cdn: … -->` comments. This closes the "asset-PNG production" item previously under "What We're NOT Doing."

### Changes Required:

#### 1. Normalize draft image references

**File**: `lessons/m5-l4/lesson-draft.md`

**Intent**: Unwrap the backtick-wrapped image refs (`` `![](./assets/X.png)` ``) to the canonical bare `![](./assets/X.png)` form used in m4 lessons, so they render as images and the upload writeback regex matches them. Covers the 7 card refs + the existing matt-pocock ref.

**Contract**: 8 refs become bare `![](...)`; shot names already match (publishconfig, consumer-npmrc, preinstall, sentinel-markers, manifest, signing, api-allowlist).

#### 2. Render the cards

**File**: `lessons/m5-l4/assets/*.png` (generated)

**Intent**: Run `node scripts/render-artifact-screenshots.mjs m5-l4` to produce the 7 PNGs from the real source files; verify no ISO date survives redaction (manifest `lastApplied` redacted).

**Contract**: 7 PNGs created; redaction guard clean.

#### 3. Upload to CDN + comment writeback

**File**: `assets/diagrams/.upload-cache.json`; `lessons/m5-l4/lesson-draft.md` (cdn comments)

**Intent**: `node scripts/upload-assets.mjs` uploads the 8 m5-l4 PNGs (7 cards + matt-pocock) to S3/CloudFront and stamps `<!-- cdn: … -->` under each ref. Outward-facing publish — confirm before running.

**Contract**: cache updated; each ref carries a cdn comment; CDN URLs resolve.

### Success Criteria:

#### Automated Verification:

- `render-artifact-screenshots.mjs m5-l4` writes 7 PNGs to `lessons/m5-l4/assets/` with no surviving-date warning.
- No backtick-wrapped `![](./assets/...)` refs remain in the draft (grep).
- `upload-assets.mjs --dry-run` lists the 8 m5-l4 assets + the writeback it would perform.

#### Manual Verification:

- The 8 PNGs render correctly (card bar shows truthful path + badge; code legible; manifest faded; no leaked timestamps).
- Each draft image ref carries the correct `<!-- cdn: … -->` comment; CDN URLs load.

**Implementation Note**: The upload step publishes to a shared CDN (S3 + CloudFront) — confirm before running. Pause for manual confirmation before the phase-end commit.

---

## Testing Strategy

### Unit / structural checks:

- Section order + required H2s present; no forbidden headings.
- Zero `[todo:` comments; em-dash count reduced.
- Operator-leak terms absent from Model 3; "API endpoint" not "Worker"; `10x-cli` named.
- Card references present where specified; `render-artifact-screenshots.mjs --dry-run` lists m5-l4 shots.
- `lessons-schema.json` validates; `node scripts/lesson-context.mjs m5-l4` clean.

### Integration:

- `10x get m5l4` end-to-end in the toolkit repo delivers the specs.

### Manual review:

- `lesson-editor-pl` (voice/flow) then `lesson-rc-review` (release gate), in that order.
- Read-through against the 44 `[todo]` themes A–G to confirm each is resolved.

## Migration Notes

- Asset PNGs and the course video-scenario are deferred; the draft references images that won't exist until a later render/upload run. Flag this in the RC review as a known, non-blocking follow-up.
- Handout wiring is cross-repo; coordinate the `10x-toolkit` change with release scheduling.

## References

- Research: `context/changes/m5l4-improv/research.md`
- Draft + todos: `lessons/m5-l4/lesson-draft.md`
- Spec: `lessons/m5-l4/lesson-spec.md`
- Structure: `references/lesson-structure.md`; voice: `references/style.md`
- Render technique: `lessons/m4-l4/lesson-draft.md`, `scripts/render-artifact-screenshots.mjs`, `scripts/upload-assets.mjs`
- Real artifacts: `/Users/admin/code/10x-toolkit/packages/internal-pkg/**`, `/Users/admin/code/10x-cli/src/lib/**`, `/Users/admin/code/10xCards/{.npmrc,.claude/.10x-*-manifest.json}`
- Memory: `[[feedback_editor_before_review]]`, `[[feedback_cf_secrets_both_envs]]`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Re-architecture scaffold

#### Automated

- [x] 1.1 `lesson-context.mjs m5-l4` runs clean — 8d1820c8
- [x] 1.2 `## Trzy modele dystrybucji` and `## A co z marketplace'ami?` present — 8d1820c8
- [x] 1.3 No `## Wstęp` / `## Core` headings — 8d1820c8
- [x] 1.4 Fixed tail order preserved — 8d1820c8

#### Manual

- [x] 1.5 Intro flows forward, no apologetic teaser — 03906650
- [x] 1.6 Three models recognizable from overview — 03906650
- [x] 1.7 Two-repo context + installer defined before first snippet — 03906650
- [x] 1.8 Matt Pocock signal moved to early framing — 03906650

### Phase 2: Model 1 — GitHub Packages

#### Automated

- [x] 2.1 Two-package split removed — c3389a29
- [x] 2.2 No `code-review` named payload in Model 1 — c3389a29
- [x] 2.3 Versioning library links present — c3389a29
- [x] 2.4 `lesson-context.mjs m5-l4` clean — c3389a29

#### Manual

- [x] 2.5 "One field" lands on the two-repo scaffold — 03906650
- [x] 2.6 Auth section concrete but not over-detailed — 03906650
- [x] 2.7 `.npmrc` producer/consumer correct — 03906650
- [x] 2.8 Billing has no invented numbers; PAT framing dated — 03906650

### Phase 3: Model 2 — CodeArtifact

#### Automated

- [x] 3.1 Apologetic phrases removed — 02330d55
- [x] 3.2 No `terraform apply` 39s detail — 02330d55
- [x] 3.3 CodeArtifact docs link present — 02330d55
- [x] 3.4 `lesson-context.mjs m5-l4` clean — 02330d55

#### Manual

- [x] 3.5 Model 2 reads as deliberate enterprise choice — 02330d55
- [x] 3.6 repository/domain/registry distinction clear — 02330d55
- [x] 3.7 OIDC/IAM framed as pipeline-declared; gotchas as costs — 02330d55
- [x] 3.8 Video framing is enterprise-walkthrough — 02330d55

### Phase 4: Patterns that survive every model

#### Automated

- [x] 4.1 Sentinel + manifest card references present — 99fe01d2
- [x] 4.2 `lesson-context.mjs m5-l4` clean — 99fe01d2

#### Manual

- [x] 4.3 Sentinel section: installer no longer undefined — 99fe01d2
- [x] 4.4 Manifest example concrete; uninstall guarantee clear — 99fe01d2
- [x] 4.5 SKILL.md path-placement challenge named — 99fe01d2

### Phase 5: Model 3 — API+CLI

#### Automated

- [x] 5.1 Operator-leak terms removed from Model 3 — 3b0c9754
- [x] 5.2 "Worker" → "API endpoint" — 3b0c9754
- [x] 5.3 `10x-cli` named as the mechanism — 3b0c9754
- [x] 5.4 Security-trio card references present — 3b0c9754
- [x] 5.5 `lesson-context.mjs m5-l4` clean — 3b0c9754

#### Manual

- [x] 5.6 Why-Model-3 leads with stack diversity + progressive delivery — 03906650
- [x] 5.7 All cut items gone; no fabricated incident — 03906650
- [x] 5.8 JWT/revocation = one team line; host-allowlist = API endpoint — 03906650
- [x] 5.9 Security trio shown as real bracketed snippets, truthful provenance — 03906650
- [x] 5.10 "You as consumer" bracketed as 10xDevs context — 03906650

### Phase 6: Decision table, failure mode, tail + editorial polish

#### Automated

- [x] 6.1 Zero `[todo:` comments remain — de888b78
- [x] 6.2 Em-dash count materially reduced — de888b78
- [x] 6.3 Fixed tail order intact — de888b78
- [x] 6.4 `lesson-context.mjs m5-l4` clean — de888b78

#### Manual

- [x] 6.5 Every decision-table cell traces to surviving prose — de888b78
- [x] 6.6 Failure mode reads as principle, not confession — de888b78
- [x] 6.7 Deep Dive list matches subsections; Materiały links well-formed — de888b78
- [x] 6.8 `lesson-editor-pl` output is on-voice RC Polish — de888b78

### Phase 7: Cross-repo wiring + schema sync + RC gate

#### Automated

- [x] 7.1 `10x get m5l4` resolves specs (or toolkit content test passes) — 7820ce5b
- [x] 7.2 Toolkit build/typecheck passes — 7820ce5b
- [x] 7.3 `lessons-schema.json` validates against schema — 7820ce5b
- [x] 7.4 `render-artifact-screenshots.mjs --dry-run` lists m5-l4 shots — 7820ce5b

#### Manual

- [x] 7.5 `10x get m5l4` delivers specs; AWS appendix marked; login hint fixed — 7820ce5b
- [x] 7.6 Schema m5-l4 entry reflects resolved decisions — 7820ce5b
- [x] 7.7 `lesson-rc-review` returns no blocking findings; deferred items listed — 7820ce5b

### Phase 8: Render + upload m5-l4 artifact screenshots

#### Automated

- [x] 8.1 `render-artifact-screenshots.mjs m5-l4` writes 7 PNGs, redaction clean — 03906650
- [x] 8.2 No backtick-wrapped asset refs remain in draft — 03906650
- [x] 8.3 `upload-assets.mjs --dry-run` lists 8 m5-l4 assets + writeback — 03906650

#### Manual

- [x] 8.4 8 PNGs render correctly; no leaked timestamps — 03906650
- [x] 8.5 cdn comments stamped under each ref; CDN URLs load — 03906650
