# Lesson Grounding: m4-l5 — Skalowanie kontekstu dla AI w dużych projektach

> Consolidation pass, 2026-06-02. This brief does **not** start research from zero — it synthesizes the existing
> `lessons/m4-l5/research/` bundle (6 deep-research reports + repo clones, all checked 2026-06-02) into a drafting-ready
> evidence layer and records the strongest sources into `lessons-schema.json`. Where a claim is a heuristic or unverified,
> it is flagged explicitly so `lesson-draft` does not overclaim.

## Scope

- Lesson source: **spec** (`lesson-spec.md`, foundation altitude) + a deep, pre-existing **research bundle** (`research/*.md`).
- Research posture: **deep** — but the bulk of the deep work is already done and adversarially verified. This pass is
  consolidation + caveat-hardening + schema recording, not new fan-out search.
- Neighbor boundaries:
  - **m1-l4** owns single-project `AGENTS.md` authoring (inclusion test, rules/memory taxonomy, inner loop) — *assumed, not retaught*; this lesson only validates it against real repos and extends it to scale.
  - **m4-l2…m4-l5 (post-renumber, the legacy lessons)** own codebase mapping, feature analysis, refactoring, DDD extraction — this foundation must **not** assume or pre-empt their content.
  - **M5-L3** owns the team Shared AI Registry / distribution infra (polyrepo build-out) — *pointed to, not built*.
  - **prework [3.5]** owns model selection / benchmarks — out of scope here.
- Relevant prework: `[3.1]` MECW / context degradation / token budgeting (the load-bearing prior, extended from token-window to file/dir architecture); `[3.2]` instruction hierarchy + context-overload anti-pattern; `[3.3]` Write/Select/Compress/Isolate + external memory/subagents; `[2.2]/[2.3]` Cursor / Claude Code, `AGENTS.md`/`CLAUDE.md` as project memory.

## Claims To Support

- **"A finite attention budget makes a fat root file degrade at scale"** — load-bearing thesis for beats 1–2 — needs *primary* (Anthropic) + corroborating research (Lost in the Middle / context-rot). **Status: strongly supported.**
- **"The four failure modes of a monolithic instruction file"** (crowds out the task / dilutes guidance / rots / resists verification) — beat 2 — needs a *named first-party source*. **Status: supported, verbatim from OpenAI "Harness engineering".**
- **"Lean root = table of contents, not encyclopedia; deeper truth lives in a `context/`/`docs/` system-of-record"** — beat 3 core architecture — needs *primary*. **Status: supported (OpenAI Harness engineering + Anthropic large-codebases JIT).**
- **"Tools load instruction files additively (stack on root), not by override"** — beat 7, corrects a common false model — needs *per-tool primary docs*. **Status: supported for Claude Code, Codex, Copilot, Cursor; agents.md spec itself was ambiguous until v1.1.**
- **"Codex: eager root→cwd concat, 32 KiB cap + silent truncation, no lazy load; Claude Code: filesystem-root walk + lazy subtree"** — beat 7 sharp contrast — needs *primary docs + issue trackers*. **Status: supported (2 originally-wrong claims were refuted and corrected in the bundle).**
- **"Agent Skills give zero-upfront-cost JIT via three-tier progressive disclosure"** — beat 3/5 the documented answer to scaling — needs *primary*. **Status: supported (Anthropic Skills docs).**
- **"Real reputable repos run 1/2/8/16/32 instruction files — count is strategy-dependent, not a target"** — beats 3, 5, 6 calibration — needs *direct repo inspection*. **Status: supported (5 repos cloned at HEAD; counts via `find`).**
- **"Maturity-ladder thresholds (~200–300-line root; own-deploy/owner; repeated misses)"** — beat 5 escalation triggers — needs *evidence*. **Status: heuristic only — grounded in vendor targets + repo case studies, NOT measured. Teach as judgment calls.**
- **"Polyrepo breaks in-tree nesting → org/user-level + distribution + cross-repo runtime (`--add-dir`/MCP); build-out is M5-L3"** — beat 8 awareness — needs *primary*. **Status: supported for the mechanisms; the distribution build is deferred.**
- **Certification throughline** (Builder min reqs: CRUD + 1 business-logic + risk-based tests; Architect form at start of week 5; single-app ⇒ decide architecture at end of module) — beat 9 — **Status: course-internal decision capture, NOT externally verifiable. Confirm against official forms before locking copy.**

## Strong Sources

### Anthropic — Effective context engineering for AI agents

- URL: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Type: official-docs / technical-post (first-party engineering)
- Author/publisher: Anthropic
- Checked: 2026-06-02
- Supports:
  - the **finite attention budget** framing — the single fact that explains *why* scaling context is hard;
  - **just-in-time / hybrid context** as the recommended strategy (agents hold lightweight identifiers, load at runtime via tools);
  - Claude Code as the cited exemplar: `CLAUDE.md` dropped in up front, `glob`/`grep` retrieve just-in-time.
- Use in lesson: beat 2 (the economics) and beat 3/5 (JIT as the scaling answer). This is the thesis's primary anchor.
- Confidence: high
- Notes: independently corroborated by Chroma *context-rot* and Liu et al. *Lost in the Middle*; **do not quote a hard token threshold** — context-rot is model/task-specific.

### OpenAI — Harness engineering (R. Lopopolo, Feb 2026)

- URL: https://openai.com/index/harness-engineering/
- Type: technical-post (first-party)
- Author/publisher: OpenAI
- Checked: 2026-06-02
- Supports:
  - **"table of contents, not encyclopedia"** + `docs/` as **system of record** + **progressive disclosure** — the hybrid thesis in OpenAI's own words (~100-line `AGENTS.md` as a map);
  - the **four failure modes of a monolithic instruction file** (verbatim, ideal for beat 2's "why").
- Use in lesson: beat 2 (four failure modes) and beat 3 (lean-root-as-map → `context/` system-of-record). Strongest on-thesis primary source.
- Confidence: high
- Notes: **say-do gap to teach honestly** — this describes a *separate internal Codex-built product*; the public `openai/codex` repo's root `AGENTS.md` is actually a 286-line / 20 KB Rust-scoped file, not the ~100-line map the philosophy prescribes. Use that gap as a "even the source hasn't fully migrated" reality check.

### Anthropic — Claude Code memory

- URL: https://code.claude.com/docs/en/memory
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-02
- Supports:
  - **filesystem-root walk** (not project-root) + **concatenate ancestors root→cwd** (closest read last, never override);
  - **lazy on-demand subtree loading** (subdir files load only when Claude reads files there);
  - four scopes (managed-policy → user → project → local); `claudeMdExcludes`;
  - **`@path` imports are expanded at launch, recursive up to 4 hops, do NOT save tokens** (Claude-Code-specific);
  - **auto memory** (default-on) is distinct from human-written `CLAUDE.md`; `--add-dir` + additional-dirs flag for cross-repo.
- Use in lesson: beat 7 (load/merge mechanics), beat 5 (maintenance loop), beat 8 (polyrepo `--add-dir`).
- Confidence: high
- Notes: live-proof available — this very session (cwd `…/edu-platform/workbench`) loaded the full ancestor chain, demonstrating the subdirectory-launch rule.

### Anthropic — Claude Code: Manage large codebases

- URL: https://code.claude.com/docs/en/large-codebases
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-02
- Supports:
  - a single root file **"tends to either grow to cover every subsystem's conventions or stay too generic to be useful"** (the fat-vs-generic dilemma);
  - **per-directory layering stops scaling** — "conventions drift, files go stale, and no one owns the root" (the governance-collapse failure mode);
  - documented **<200 lines per file** target.
- Use in lesson: beat 2 (why single-root fails) and beat 5 (why nesting needs ownership).
- Confidence: high
- Notes: pairs with best-practices below; the <200-line number is a vendor target, not a measured threshold.

### Anthropic — Claude Code best practices

- URL: https://www.anthropic.com/engineering/claude-code-best-practices
- Type: official-docs / technical-post
- Author/publisher: Anthropic
- Checked: 2026-06-02
- Supports:
  - **"Bloated CLAUDE.md files cause Claude to ignore your actual instructions"** (rules lost in the noise — the fat-monolith failure made concrete);
  - **per-line inclusion test** ("would removing this cause a mistake? if not, cut it") — the m1-l4 discipline, vendor-sourced;
  - **exclude information that changes frequently**; ruthless pruning; periodic audit; test behavior empirically.
- Use in lesson: beat 2 (failure mode), beat 5 (maintenance discipline = `/10x-rule-review`). Reference-only for the inclusion test itself (m1-l4 owns teaching it).
- Confidence: high
- Notes: vendor best-practice/opinion, not a measured study — frame as discipline, not proof.

### Anthropic — Agent Skills (engineering post + platform overview)

- URL: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills  ·  https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-02
- Supports:
  - **three-tier progressive disclosure** (L1 name+description ~100 tokens always-on; L2 full `SKILL.md` <5k only when matched; L3+ bundled resources via bash, effectively unbounded);
  - the only verified mechanism that **breaks the "more modules = more always-on context" curve**.
- Use in lesson: beat 3/5 ("procedures → skills" arm of the three-way split; why reference/PRD belongs in `context/`, procedures in skills).
- Confidence: high
- Notes: JIT defers cost, it does not erase it — files the agent *does* read still enter context.

### OpenAI — Codex AGENTS.md guide + config reference

- URL: https://developers.openai.com/codex/guides/agents-md  ·  https://developers.openai.com/codex/config-reference
- Type: official-docs
- Author/publisher: OpenAI
- Checked: 2026-06-02
- Supports:
  - **eager additive merge, root→cwd, one file per dir, built once at launch, no lazy load, not re-read mid-session**;
  - **`project_doc_max_bytes` = 32 KiB combined cap, silent truncation** (newer builds may default 64 KiB — version-check);
  - root-detection walks *up* to git root, then loading walks *down* (loading is **not** upward);
  - `AGENTS.override.md` hard-replaces at the same level; `project_doc_fallback_filenames`.
- Use in lesson: beat 7 (the Claude-Code-vs-Codex sharp contrast — the most demonstrable "your tool doesn't load this the way you think" moment).
- Confidence: high
- Notes: two originally-circulating claims were **refuted** in the bundle and must not be repeated — Codex does *not* walk up to merge, and the cap is *combined*, not per-file. Cap value is version-sensitive.

### agents.md — open spec + v1.1 proposal (#135)

- URL: https://agents.md/  ·  https://github.com/agentsmd/agents.md/issues/135
- Type: official-docs / repo
- Author/publisher: agents.md (Linux Foundation / Agentic AI Foundation stewardship as of Dec 2025)
- Checked: 2026-06-02
- Supports:
  - the shared **filename does not guarantee shared semantics** — the spec only said "nearest file takes precedence" (ambiguous merge-vs-replace) until the **v1.1 proposal: "a local AGENTS.md extends and builds upon ancestor files rather than replacing"** (Jan 2026, not yet merged);
  - `AGENTS.md` as a cross-tool single-file mitigation (24 tools, 60k+ repos).
- Use in lesson: beat 7 (don't assume nearest-replaces-root; same filename ≠ same behavior).
- Confidence: medium-high
- Notes: v1.1 not yet merged into the official spec as of the check — say "proposed", not "standard". Per Marcin: among popular tools, only Claude Code does not read `AGENTS.md`.

### GitHub Copilot — custom instructions (IDE + CLI + org)

- URL: https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot  ·  https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-organization-instructions
- Type: official-docs
- Author/publisher: GitHub
- Checked: 2026-06-02
- Supports:
  - **merges, never selects** — path-specific match *plus* repo-wide file both apply; `applyTo:` globs;
  - **organization custom instructions apply only to Copilot Chat / code review / cloud agent on GitHub.com — NOT the IDE or CLI** (uneven org-wide support, for beat 8).
- Use in lesson: beat 7 (additive merge across a third tool) and beat 8 (org-level instructions are surface-limited).
- Confidence: medium-high
- Notes: nested precedence is "intended" but has surface gaps and conflict resolution is explicitly non-deterministic — don't overstate reliability.

### Cursor — Rules

- URL: https://cursor.com/docs/rules
- Type: official-docs
- Author/publisher: Cursor
- Checked: 2026-06-02
- Supports:
  - **four rule application types** that map onto the task-vs-module split: Always Apply (global), Apply Intelligently (by task, model reads `description`), Apply to Specific Files (`globs`, by module), Apply Manually (`@`-mention).
- Use in lesson: beat 7 (third surface of the one mental model) and beat 6 (twenty's glob-scoped `.cursor/rules` as the "topic, not directory" exemplar).
- Confidence: high
- Notes: "Apply Intelligently" has the same non-determinism as Skills (depends on the model choosing).

### Real-repo calibration — 5 repos cloned at HEAD (internal evidence)

- URL: (in-bundle) `lessons/m4-l5/research/repo-case-studies.md`
- Type: internal-course-material (direct repo inspection — `openai/codex`, `mastra-ai/mastra`, `cloudflare/workers-sdk`, `open-mercato/open-mercato`, `twentyhq/twenty`)
- Author/publisher: 10xDevs editorial (deep-research bundle)
- Checked: 2026-06-02
- Supports:
  - **counts are strategy-dependent, not a target**: 2 / 16 / 8 / 32 / (16 `.mdc`) instruction files;
  - **cloudflare/workers-sdk = the copyable model** (lean root + explicit child index + "see root" additive leaves);
  - **open-mercato = what *heavy* looks like** (404-line root + task router + 1699-line leaf that would blow Codex's 32 KiB cap — layout & tool choice are coupled);
  - **codex = minimal nesting** (286-line root + 1 hyper-local leaf; 121 crates, 1 nested file — per-crate co-location is NOT the convention);
  - the **"count by cloning, never by GitHub search"** lesson (twenty's "31" mirage = product docs, real count 1);
  - twenty's `feedback-incorporation.mdc` = a real self-maintenance meta-rule in a 49k-star repo.
- Use in lesson: beats 5–6 (calibration / "what good looks like at scale") and the escalation-trigger table.
- Confidence: high (structure observed directly) / **but effectiveness NOT measured** — observed layout, not whether it improves agent output.
- Notes: single HEAD snapshot 2026-06-02; counts will drift. The "88 AGENTS.md" figure is OpenAI's *internal* monorepo, **not** the public repo — do not cite "88" as observable.

### Anthropic — Claude Code sub-agents + MCP (maintenance & cross-repo)

- URL: https://code.claude.com/docs/en/sub-agents  ·  https://code.claude.com/docs/en/mcp
- Type: official-docs
- Author/publisher: Anthropic
- Checked: 2026-06-02
- Supports:
  - the **read-only reviewer/auditor sub-agent** as the canonical pattern (closest documented thing to a "rule-maintenance specialist"; no vendor doc names one dedicated to instruction-file auditing → legitimate course contribution);
  - MCP **scopes** for polyrepo (project `.mcp.json` shared-but-per-repo, user `~/.claude.json` cross-project, managed, plugin-bundled) — exposing shared contracts as a tool every repo's agent can query.
- Use in lesson: beat 5 (`/10x-rule-review` framing) and beat 8 (cross-repo runtime visibility).
- Confidence: medium-high
- Notes: sub-agent persistent memory maintains the sub-agent's own store, not `CLAUDE.md` — the staleness bridge is interpretive.

### Nx `configure-ai-agents` + Ruler (single-source generation)

- URL: https://nx.dev/blog/nx-ai-agent-skills  ·  https://github.com/intellectronica/ruler
- Type: technical-post / repo
- Author/publisher: Nx / Ruler (intellectronica)
- Checked: 2026-06-02
- Supports:
  - **single-source-of-truth generation** kills *cross-tool* drift (one source → `CLAUDE.md`/`AGENTS.md`/Cursor/Copilot/Codex/…);
  - the subtlety: generators solve **multi-tool** drift inside one repo; **multi-repo** drift still needs package/CLI/bot sync across repos.
- Use in lesson: beat 8 (briefly — pointer to the M5-L3 problem space), Materiały dodatkowe.
- Confidence: medium
- Notes: Nx's "every tool gets the same capabilities" is a design statement, not an audited drift-elimination result.

## Practitioner Signals

### OpenAI "Harness engineering" framing language

- URL: https://openai.com/index/harness-engineering/
- Type: technical-post
- Signal: gives the lesson its sharpest *language* — "encyclopedia vs table of contents", "When everything is important, nothing is", "graveyard of stale rules". These are quotable for the Polish draft's hook/economics beats.
- Useful language: *table of contents not encyclopedia*; *progressive disclosure*; *system of record*.
- Risk: it's framing from a vendor describing an internal product — pair with the say-do gap; don't present the prescribed layout as universal practice.
- Confidence: high (as language); medium (as universal practice)

### `claude-reflect` (OSS) + twenty's `feedback-incorporation.mdc`

- URL: https://github.com/BayramAnnakov/claude-reflect
- Type: community-discussion / practitioner-signal
- Signal: a real capture→human-approve→sync-to-`CLAUDE.md` loop exists in the wild, and a 49k-star repo commits a self-maintenance meta-rule — validates the course's `/10x-rule-review` + `/10x-lesson` instinct as a real pattern, not invented.
- Useful language: "after each coding session, identify patterns in user corrections… suggest rule updates".
- Risk: single niche OSS project; not a standard. Use as "this instinct is real and partially shipped", not as documented best practice.
- Confidence: low-medium

### Reflexion (academic grounding for learnings loops)

- URL: https://arxiv.org/abs/2303.11366
- Type: paper
- Signal: agents improve "through linguistic feedback, not weight updates" — the conceptual grounding for self-updating rule loops. Bridge to `CLAUDE.md` edits is analogical, not literal.
- Risk: episodic-buffer mechanism, not rule-file edits — don't overclaim a direct link.
- Confidence: medium (as concept), low (as direct evidence for instruction-file maintenance)

## Examples Worth Using

- **The live monorepo demo** (this very repo): launch from `przeprogramowani-sites/` root → only root `CLAUDE.md` loads up front; `edu-platform/CLAUDE.md` loads lazily when the agent touches that subtree. Launch from `edu-platform/` → root + every ancestor load at launch, guaranteed. Concrete, demonstrable, matches the spec's video placeholder.
- **cloudflare/workers-sdk child index + "see root" leaf** — the copyable lean-root-+-index pattern; quote the leaf's inheritance line ("Wrangler-specific context only. See root AGENTS.md for monorepo conventions.").
- **The "count by cloning" trap** — twenty shows "31" in GitHub search, real count is 1 (the rest are product `.mdx` docs). A one-line cautionary example for the calibration beat.
- **Codex 32 KiB cap meets open-mercato's 93 KB leaf** — concrete proof that layout choice and tool choice are coupled (that leaf would be silently truncated by Codex, fine for Cursor/Claude lazy loading).
- **The three-way split applied to the course project**: conventions → `AGENTS.md`; PRD/plans/research → `context/` (`/10x-init`, `/10x-prd`); procedures → skills. Anchors the demo beat.

## Claims To Avoid Or Soften

- **Any hard context-rot token number** — degradation thresholds are model/task-specific. Say "degrades as it grows", not "at N tokens".
- **Maturity-ladder thresholds (~200–300-line root, "own deploy/owner")** — heuristics from vendor targets + repo case studies, **not measured**. Present as judgment calls, never as benchmarked rules.
- **arXiv productivity figures** — `progressive-adoption.md` conflated two papers under one ID. Correct attribution: **−28.64% median runtime / −16.58% output tokens = arXiv 2601.20404** (Lulla et al.); **>20% inference-cost increase from redundant context = arXiv 2602.11988** (Gloaguen et al.). **Both are verified** (already grounding m1-l4, checked 2026-05-14, high confidence) — but both are **Codex/small-PR-scoped and directional**. Quote with that scope ("w badaniu na OpenAI Codex, dla małych PR-ów"); never as a universal cross-agent guarantee.
- **"88 AGENTS.md files in the OpenAI repo"** — that's OpenAI's *internal* monorepo, not the public `openai/codex` (which has 2). Do not cite "88" as observable.
- **CODEOWNERS + CI gates for instruction files** — NOT vendor-documented; teach as team convention, not documented practice.
- **Effectiveness of any maintenance mechanism** — existence is documented, *outcomes are not measured anywhere*. Don't claim pruning/auto-memory/reflect "reduces drift" — say the mechanisms exist.
- **Certification specifics** (Builder min reqs wording; Architect form timing; report template) — course-internal capture, confirm against official forms before locking learner-facing copy.

## Open Verification Questions

- ✅ **arXiv attribution — RESOLVED.** Two distinct verified papers, not one: 2601.20404 (−28% time) and 2602.11988 (+20% cost). Both already ground m1-l4. Quote Codex/small-PR-scoped.
- **Codex `project_doc_max_bytes` current default** — 32 KiB vs 64 KiB on the latest build; version-check before stating the cap as a number.
- **agents.md v1.1 (#135)** — has "local extends ancestor" been merged into the official spec yet? Say "proposed" until confirmed.
- **Certification forms (STILL OPEN)** — Marcin refined the framing (moduły 4–5 not required for the base Builder badge; architecture decided at end of lesson or after the module; project continued from Module 1), but the **official-form wording/template is still unconfirmed**: Builder min-reqs exact wording (CRUD + 1 business-logic + risk-based tests from the test plan); whether the architectural report has a fixed template the "context architecture section" must match; Architect & Champion form timing (start of week 5). Human/owner decision, not research.

## Resolved Decisions (Marcin, 2026-06-02)

- **Renumber `m4-l5 → m4-l1` + cascade + folder moves + dep rewiring + mandatory-task coordination** → delegated to the dedicated **`m4-reorder`** change (PARKED for the cofounder sync; executes tomorrow). Schema id stays `m4-l5` for now; drafting continues here at foundation altitude and the change will relocate artifacts into `lessons/m4-l1/`.
- **Schema enrichment** → DONE. `owns` / `referencesOnly` / `mustNotCover` / `learningOutcomes` recorded into the **current `m4-l5`** slot from the spec (content already written at reorder/foundation altitude). `dependsOn`/`preparesFor` deliberately left for `m4-reorder`. `requiredFragments`/`videoPlaceholders` left for draft time (not in scope of the enrichment decision).
- **Certification framing** → refined in `positioning-and-certification.md` (see still-open form confirmation above).

## Schema Source Update

Updated **only** the target lesson `m4-l5` in `workbench/lessons-schema.json`:

- Added a `groundingSources` array (**17 entries**): the two verified arXiv papers (2601.20404, 2602.11988) plus the load-bearing primary sources — Anthropic (effective context engineering, memory, large-codebases, best-practices, Skills, sub-agents/MCP), OpenAI (Harness engineering, Codex AGENTS.md guide + config), agents.md spec + v1.1, GitHub Copilot (IDE/CLI + org), Cursor rules, Nx/Ruler single-source generation, and one `internal-course-material` entry for the cloned-repo calibration evidence. Each carries `claimsSupported`, `confidence`, `checkedAt`, and short relevance notes. Weak/niche signals (`claude-reflect`, Reflexion, twenty's meta-rule) are kept in this brief only, not promoted to schema.
- **Populated** `owns` (7), `referencesOnly` (5), `mustNotCover` (5), `learningOutcomes` (6) from the spec into the **current `m4-l5`** slot, per Marcin's enrichment decision (content already at reorder/foundation altitude). Added `lesson-grounding` to `requiredArtifacts`. Left `requiredFragments`/`videoPlaceholders` empty for draft time; left `dependsOn`/`preparesFor` for the `m4-reorder` change.
- Updated `sideEffectLedger.unsupportedFacts`: heuristic ladder thresholds; **corrected** arXiv attribution (two verified papers, Codex/small-PR-scoped, not "unverified"); effectiveness/ROI of maintenance mechanisms; CODEOWNERS/CI-gate governance; Codex cap version-sensitivity.
- Reduced `sideEffectLedger.needsHumanDecision` to the single still-open item: certification-form wording/template confirmation. Renumber + schema-enrichment are resolved (delegated to `m4-reorder` / recorded respectively). Did not touch any other lesson.
