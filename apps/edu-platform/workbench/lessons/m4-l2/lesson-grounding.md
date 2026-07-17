# Lesson Grounding: m4-l2 — Nowy-stary projekt? Agent zbuduje Ci mapę i wyjaśni architekturę

## Scope

- Lesson source: schema slot (`owns` populated) + `lessons/m4-l2/notes.md` (conceptual scaffolding). No `lesson-spec.md` / `lesson-draft.md` yet.
- Report element produced: **① Mapa projektu** (territory map → modules, responsibilities, dependency direction, entry points; modules tagged deep/shallow + core/peripheral; cycles + high-D zones marked).
- Neighbor boundaries:
  - **m4-l1 (dependsOn)** owns context-scaling (lean root + `context/`, maturity ladder). Hands forward the attention-budget mindset → bridge into L2's wide-then-deep. **Do not re-teach context architecture.**
  - **m4-l3 (preparesFor)** owns **hotspots = complexity × change frequency (Tornhill)**, **connascence (Page-Jones)**, and **change/temporal coupling (Gall; Tornhill sum-of-coupling)**. **Critical boundary:** the *behavioral* git-history analysis (churn × complexity, change coupling) is **L3's owned territory**. L2 may *introduce* git-history as one of four data axes and set up "wide search builds the map," but must not steal the hotspot/change-coupling method.
- Relevant prework: [3.1] LLMy / Maximum Effective Context Window (context budget — the technical analog of "can't read the whole repo at once"); [3.3] context lifecycle / Write-Select-Compress-Isolate (the agent's working-memory framing this lesson operationalizes). Assume, do not re-teach.
- Research posture: **standard** — focused on confirming the **CLI tool facts** (license, language coverage, output formats, maintenance) that L2 will name. The academic lenses (Ousterhout, Parnas, Martin, MacCormack, comprehension theory) were **not** re-grounded in this pass — see Open Verification Questions.

## What this pass grounded

This pass targeted the **tool/method claims** in `owns` items 6–7 (repo-search models; CLI static/behavioral analysis tools) and in `notes.md` §"Tooling / data sources". A deep-research run (2026-06-03) fetched 25 sources → 122 candidate claims → verified 25 via 3-vote adversarial verification (24 confirmed, 1 killed). The findings below are the **3-0 unanimous, primary-source-backed** subset relevant to L2.

The big result for the drafter: the **static-analysis + structural-search families are well-grounded**; the **behavioral (git-history) and sizing/packer families that `notes.md` puts in its "core five" are NOT yet grounded** (see Claims To Avoid Or Soften + Open Verification Questions). `notes.md`'s "core five = git + scc + code-maat + madge + lizard" has **only `madge` verified** — the drafter must treat the other four as provisional.

## Claims To Support

- L2 names a dependency-graph tool that detects cycles and emits a machine-readable graph — *core of "build the structural skeleton of the map"* — **needs official repo/docs.** ✅ grounded (dependency-cruiser, madge, skott).
- The JS-native graph tools have **cross-stack equivalents** so the report stays variadic (any OSS repo, not just TS 10xCards) — *variadic promise of the module* — **needs per-language docs.** ✅ grounded for Java (jdeps) + Go (goda); pydeps/.NET/etc. still open.
- A structural/AST search tool lets an agent retrieve exact code structures instead of full-repo reads — *the "offload to deterministic tool" thesis* — **needs official docs.** ✅ grounded (ast-grep, Probe, universal-ctags, Semgrep CE).
- Symbol-indexing / code-as-data (go-to-def, find-refs as precomputed data an agent queries) — *the structural/symbol search family* — **needs official docs.** ✅ grounded (SCIP, stack graphs); **SCIP superseded LSIF** (update the `SCIP/LSIF` pairing in `owns` item 6).
- Behavioral git-history analysis (churn, hotspots, change coupling) as a non-AI data source — **needs grounding.** ❌ NOT grounded this pass (and largely L3's owned method — keep L2's use to "git history is one axis").
- Size/complexity proxy + LLM-context packers — **needs grounding.** ❌ NOT grounded this pass.

## Strong Sources

### dependency-cruiser

- URL: https://github.com/sverweij/dependency-cruiser
- Type: repo (official)
- Author/publisher: Sander Verweij (sverweij)
- Checked: 2026-06-03
- Supports:
  - Validates dependencies against custom rules and detects circular dependencies (ships in default rule set).
  - Emits agent-consumable formats: JSON, DOT (GraphViz), **Mermaid**, CSV, HTML, text, d2, metrics.
  - Language coverage limited to **JavaScript / TypeScript / CoffeeScript** (ES6/CommonJS/AMD; .jsx/.tsx/.vue/.svelte).
  - MIT licensed; Node/npm CLI; cross-platform. Actively maintained (v17.4.3, May 2026).
- Use in lesson:
  - The rule-aware graph tool: "encode an architectural rule (no `ui → db` imports) and let the tool flag violations on the map."
  - Mermaid output ties straight into the house Mermaid workflow for the map diagram.
- Confidence: high
- Notes:
  - JS-family only — pair with jdeps/goda when teaching the variadic angle.

### madge

- URL: https://github.com/pahen/madge (also https://www.npmjs.com/package/madge)
- Type: repo (official)
- Author/publisher: Patrik Henningsson (pahen)
- Checked: 2026-06-03
- Supports:
  - Generates a visual module-dependency graph, finds circular dependencies (rendered **red**), detects orphan/leaf modules.
  - Output: `--json` (pipeable, e.g. `madge --json … | madge --stdin`), `--dot` (`> graph.gv`); `--image graph.svg` **requires a system Graphviz install**.
  - Coverage: JS (AMD/CommonJS/ES6) + CSS preprocessors (Sass/Stylus/Less). MIT. v8.0.0.
- Use in lesson:
  - The fastest "show me cycles" command: `madge --circular src/`. JSON/DOT are the agent-ingestible outputs; only the image rendering needs Graphviz.
- Confidence: high
- Notes:
  - The `--image` path's Graphviz dependency is a real setup gotcha worth flagging to learners.

### skott

- URL: https://github.com/antoine-coulon/skott
- Type: repo (official)
- Author/publisher: Antoine Coulon
- Checked: 2026-06-03
- Supports:
  - Deep circular-dependency detection with **configurable max search depth** (powered by zero-dependency `digraph-js`).
  - Coverage: .js/.jsx/.cjs/.mjs/.ts/.tsx, ESM + CommonJS, **TypeScript path aliases** (uses typescript-estree).
  - Output: JSON, Mermaid, SVG/PNG/MD (static-file outputs need `@skottorg/static-file-plugin`), interactive web UI, terminal file-tree/graph views. MIT. v0.35.9 (Mar 2026).
- Use in lesson:
  - A modern alternative to madge with first-class TS path-alias handling — relevant for a real TS monorepo like 10xCards. Optional; don't over-stack tools.
- Confidence: high
- Notes:
  - Static-file output needs the extra plugin — note if shown live.

### jdeps (Java — cross-stack equivalent)

- URL: https://docs.oracle.com/en/java/javase/13/docs/specs/man/jdeps.html
- Type: official-docs
- Author/publisher: Oracle / OpenJDK
- Checked: 2026-06-03
- Supports:
  - Shows package-level or class-level dependencies of Java class files (`-verbose:package` / `-verbose:class`).
  - `-dotoutput`: one `.dot` per analyzed archive + a `summary.dot` of inter-archive dependencies (Graphviz-ready, agent-readable adjacency text).
  - **JDK-bundled** since JDK 8 (no separate install), GPLv2+CE, cross-platform.
- Use in lesson:
  - The "JS isn't special" proof: the variadic report works on a Java repo with a tool that ships in the JDK.
- Confidence: high
- Notes:
  - **Static analysis only** — misses reflection / `Class.forName` / service-loading. State this limit so learners don't trust the graph as complete.

### goda (Go — cross-stack equivalent)

- URL: https://github.com/loov/goda
- Type: repo (official)
- Author/publisher: Egon Elbre (loov)
- Checked: 2026-06-03
- Supports:
  - Go dependency-analysis toolkit; DOT output piped to Graphviz; Go-template-customizable node formatting.
  - Module-level **clustered** graphs (`goda graph -cluster -short`) and package/module specifiers + set arithmetic (`:mod`, `:all`, `:import`). MIT. v0.9.2 (Feb 2026).
- Use in lesson:
  - Second variadic proof point (Go). `-cluster` is a nice "group the territory" demo.
- Confidence: high
- Notes:
  - `-cluster` groups *related packages*, not strictly Go-module boundaries — don't overstate it as automatic module detection. Go-only.

### ast-grep

- URL: https://github.com/ast-grep/ast-grep (comparison: https://ast-grep.github.io/advanced/tool-comparison.html)
- Type: repo (official) + official-docs
- Author/publisher: Herrington Darkholme / ast-grep project
- Checked: 2026-06-03
- Supports:
  - Rust CLI for **structural** code search / lint / rewrite over **tree-sitter** ASTs. Matches AST nodes, not text (`$MATCH` wildcards, AST types, regex in rules). Multi-threaded, many languages, `--json` output. MIT. v0.43.0 (May 2026).
  - Installable via npm / pip / cargo / homebrew / scoop / MacPorts.
  - **An official ast-grep Agent Skill exists** that exposes the tool to AI agents — i.e. the "offload to a deterministic tool" pattern is vendor-endorsed here.
- Use in lesson:
  - The flagship "offload structural retrieval" example: an agent runs `ast-grep` to find all call sites / a structural pattern and reasons over compact `--json`, instead of reading files.
- Confidence: high
- Notes:
  - Pedantically it parses to tree-sitter CSTs and derives the AST by keeping named nodes — "AST-based" is fair shorthand.

### Probe

- URL: https://github.com/probelabs/probe
- Type: repo (official)
- Author/publisher: probelabs
- Checked: 2026-06-03
- Supports:
  - "AI-friendly **semantic** code search engine for large codebases" — combines ripgrep speed with tree-sitter AST parsing; returns **complete functions/classes**, not text lines. Output: markdown / json / xml. Apache-2.0. v0.6.0-rc323 (Jun 2026).
- Use in lesson:
  - Concrete "search tool built for agents" — returns whole code units the agent can reason over.
- Confidence: high
- Notes:
  - **CRITICAL DISAMBIGUATION:** Probe's "semantic" means **AST-structural, NOT embeddings/vector search.** The lesson's `owns` item 6 separately lists "semantic/RAG (embeddings)" as a *different* family — do **not** cite Probe as an example of embedding-based RAG. Keep the two senses of "semantic" distinct or the lesson will mislead.

### universal-ctags

- URL: https://github.com/universal-ctags/ctags
- Type: repo (official)
- Author/publisher: Universal Ctags project
- Checked: 2026-06-03
- Supports:
  - Maintained implementation of `ctags`; generates a project-wide **index (tags file)** of language objects/symbols so tools (and agents) can locate definitions. GPL-2.0, cross-platform. v6.2.1 (Oct 2025).
- Use in lesson:
  - The cheap, classic symbol index for the structural/symbol search family — "where is X defined" without an LSP server.
- Confidence: high
- Notes:
  - Minor 1-day release-date discrepancy across mirrors (timezone artifact); immaterial.

### SCIP (SCIP Code Intelligence Protocol)

- URL: https://github.com/sourcegraph/scip (announce: https://sourcegraph.com/blog/announcing-scip)
- Type: repo (official) + technical-post
- Author/publisher: Sourcegraph
- Checked: 2026-06-03
- Supports:
  - Language-agnostic, **Protobuf-based** code-indexing format powering Go-to-definition / Find-references / Find-implementations — precomputed symbol/cross-reference data an agent can query instead of reading files. Apache-2.0. v0.8.0 (Jun 2026).
  - **SCIP superseded LSIF** (LSIF read support removed in Sourcegraph 4.6).
- Use in lesson:
  - The "code-as-data" endpoint of the structural/symbol family: precomputed navigation data, not live reading.
  - **Action for drafter:** `owns` item 6 says "SCIP/LSIF" — note LSIF is the deprecated predecessor; prefer "SCIP (następca LSIF)".
- Confidence: high
- Notes:
  - **DO NOT cite a specific count/roster of SCIP indexers or their language mappings.** The claim "nine indexers covering Java/Scala/Kotlin/TS/JS/Rust/C++/Ruby/Python/C#/Dart/PHP" was **REFUTED (1-2 vote)**. SCIP has multiple-language indexers, but the exact list needs re-verification before any learner-facing enumeration.

### Stack graphs (supporting / optional)

- URL: https://github.blog/open-source/introducing-stack-graphs/
- Type: technical-post (official, GitHub blog)
- Author/publisher: GitHub
- Checked: 2026-06-03
- Supports:
  - OSS Rust framework (`stack-graphs`, `tree-sitter-stack-graphs`) defining a language's name-binding rules via a declarative DSL on top of tree-sitter — another code-as-data name-resolution capability.
- Use in lesson:
  - Optional depth for the symbol-indexing family; powers GitHub's precise code navigation. Skip if room is tight.
- Confidence: high

### Semgrep CE (supporting / licensing note)

- URL: https://semgrep.dev/docs/licensing
- Type: official-docs
- Author/publisher: Semgrep
- Checked: 2026-06-03
- Supports:
  - The Semgrep CE **engine** is open source under **LGPL 2.1** — free to use, including agent-driven CLI invocation. The Feb 2025 license change affected only Semgrep-maintained **rules** (Semgrep Rules License), not the engine.
  - **CE is limited to single-file analysis.**
- Use in lesson:
  - Only if Semgrep is mentioned as a structural-search option: clarify the engine is OSS/free and the single-file limit. Don't over-feature it for L2 (it's more a linting/rules tool than a map-builder).
- Confidence: high

## Confirmed cross-stack coverage matrix (for the variadic angle)

| Family | JS/TS (10xCards demo) | Java | Go | Polyglot / agnostic |
|---|---|---|---|---|
| Dependency graph + cycles | dependency-cruiser, madge, skott ✅ | jdeps ✅ | goda ✅ | pydeps / `go mod graph` named in notes but **not grounded** |
| Structural/AST search | ast-grep ✅ (multi-lang), Probe ✅ (multi-lang) | ↤ | ↤ | ast-grep, Probe are multi-language ✅ |
| Symbol index / code-as-data | universal-ctags ✅, SCIP ✅ | ↤ | ↤ | universal-ctags, SCIP language-agnostic ✅ |
| Behavioral (git history) | — | — | — | git, code-maat **NOT grounded** ❌ |
| Size / complexity proxy | — | — | — | scc, tokei, cloc, lizard **NOT grounded** ❌ |

## Practitioner Signals

(none collected this pass — the research targeted primary tool docs, not community sentiment. If the lesson wants "why mapping a strange repo hurts" voice, a separate practitioner-signal sweep on HN/Reddit would help, but it is not required for factual grounding.)

## Examples Worth Using

- **Offload-to-deterministic-tool, made concrete:** an agent runs `madge --circular src/` (or `dependency-cruiser` with a rule) and reasons over the small list of cycles, instead of opening dozens of files to infer the import graph. ast-grep with `--json` is the same move for "find every place this pattern occurs."
- **Variadic proof:** same map, three stacks — `dependency-cruiser`/`madge` on TS 10xCards, `jdeps -dotoutput` on a Java repo, `goda graph -cluster` on a Go repo — all emit DOT → one Mermaid/Graphviz map.
- **The "two senses of semantic" teaching moment:** ast-grep/Probe = structural (AST) "semantic" vs embedding-RAG "semantic". A good place to kill a common confusion.

## Claims To Avoid Or Soften

- **"core five = git + scc + code-maat + madge + lizard" (`notes.md`):** only **madge is grounded**. `git`, `scc`, `code-maat`, `lizard` are **not yet verified** in this pass. Either ground them in a follow-up round or present them as "commonly used, verify before relying" — do **not** state versions/licenses/capabilities for them as established fact.
- **Behavioral git-history method (churn × complexity hotspots, change/temporal coupling):** this is **m4-l3's owned territory** (Tornhill, Gall). L2 may name "git history is one of the data axes and wide search builds the map," but must **not** teach the hotspot/change-coupling technique here. Avoids scope theft.
- **Any specific list of SCIP indexers / languages:** refuted (1-2). Keep it to "language-agnostic; indexers exist for several languages."
- **Probe as "RAG/embedding search":** false — it is AST-structural. See its note.
- **Metric formulas `I = Ce/(Ca+Ce)`, `D = |A+I−1|` and academic attributions (Ousterhout, Parnas, Martin, MacCormack, Brooks, Pirolli & Card):** confident-but-**not re-verified in this pass**. They are the lesson's intellectual backbone, so verify before they enter learner-facing prose (see Open Questions). Tools don't "measure D" out of the box — be honest that the metrics are a lens applied to graph output, not a one-command number.
- **"agent ingests tool output instead of reading the whole repo" / "tool classifies modules deep-vs-shallow":** editorial framing. Only ast-grep and Probe document themselves as agent tooling; the deep/shallow & core/periphery classification is the *author's lens applied to* the graph, not a built-in feature. Present as our method, not a vendor guarantee.

## Open Verification Questions

- **Behavioral family (own grounding round):** code-maat, hercules, git-of-theseus — license, maintenance, OSS status, output formats. **Also establish the OSS↔commercial line: CodeScene is the commercial Tornhill tool; code-maat is its OSS ancestor.** (Most of this lands in m4-l3's grounding, since L3 owns the hotspot/coupling method — coordinate placement.)
- **Sizing + LLM-context-packer family (own grounding round):** scc, tokei, cloc, lizard (size/complexity proxy) and Structurizr/C4 CLI, repomix, code2prompt (repo→LLM context). Maintenance, license, output formats, ingestion pattern.
- **Per-language dependency graphers beyond JS/Java/Go:** pydeps (Python), `go mod graph` (already partial via goda), .NET/Ruby/PHP equivalents — fill the variadic matrix.
- **Academic lenses (separate, non-tool grounding):** confirm Ousterhout deep/shallow framing, Parnas 1972, Martin's instability/abstractness formulas, MacCormack/Rusnak/Baldwin 2006 DSM propagation cost, and the program-comprehension citations (Brooks; von Mayrhauser & Vans; Littman; Pirolli & Card). These were **not** in scope of the 2026-06-03 tool-focused run.
- **End-to-end chaining pattern:** is there a verified "size → boundaries → symbols → (history) → pack into LLM context" orchestration the lesson can show, or do we assemble it ourselves?

## Schema Source Update

Updated only the `m4-l2` lesson object in `workbench/lessons-schema.json`:

- Added `groundingSources` with **9 verified primary sources** (dependency-cruiser, madge, skott, jdeps, goda, ast-grep, Probe, universal-ctags, SCIP). All `confidence: high`, all `checkedAt: 2026-06-03`. Did **not** add the unverified behavioral/sizing-family sources (code-maat, scc, tokei, Structurizr, repomix, code2prompt) — they live in this brief as gaps until a dedicated grounding round.
- Added `lesson-grounding` to `requiredArtifacts`.
- `sideEffectLedger.unsupportedFacts`: recorded the not-yet-grounded "core five" tools (git/scc/code-maat/lizard), the refuted SCIP indexer roster, the unverified academic metric formulas/attributions, and the sizing/packer family.
- `sideEffectLedger.needsHumanDecision`: recorded the L2↔L3 boundary for git-history/behavioral analysis (who teaches the hotspot/change-coupling method) and whether the deep/agentic-search half moves to L3.
