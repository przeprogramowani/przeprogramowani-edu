# Lesson Grounding: m4-l3 — Analiza feature z AI: co działa, co kuleje, co zmodernizować

## Scope

- Lesson source: schema slot (`owns`) + `m4-l3/notes.md` + `m4-shape.md` §5. No `lesson-spec.md` or `lesson-draft.md` exists yet.
- Neighbor boundaries:
  - **← m4-l2 (Repo map):** owns deep/shallow modules, coupling metrics & Main Sequence, DSM/propagation cost, wide-then-deep comprehension. L3 must NOT re-teach whole-repo mapping or static dependency-graph theory — L3 zooms into **one** module already chosen on the L2 map.
  - **→ m4-l4 (Refactor):** owns EAA archetypes, Strangler Fig / Branch by Abstraction, Mikado Method, ADR-grounded refactor candidates. L3 must NOT propose refactor strategies or target archetypes — it only produces evidence (data flow + hot spots) that L4 turns into options. The bridge out is "you know how it works and where it hurts — now, what should change?"
- Relevant prework: [1.2] chatbot/agent/harness mental model, [1.3] generation-then-comprehension + AI-as-tutor. Assumed, not re-taught. L3 reuses "AI is an ally, the human decides" framing (M4 cross-cutting principle 3).
- Research posture: **standard** for the SE-concept lenses (most are textbook-stable and now primary-verified); **deep + time-sensitive** only for Area 5 (current AI-assisted practice), which must be re-checked close to publication.

## Claims To Support

- **Hotspots = complexity × change-frequency** (the evidence engine for element ③) — Tornhill attribution + the exact complexity proxy. *Verified facts; high stakes because the proxy is widely misremembered as cyclomatic.*
- **Tornhill's complexity proxy is indentation/size-based, language-neutral — NOT cyclomatic.** *Correction of a common misconception; matters if the draft names a metric.*
- **Tooling: open-source `code-maat` + commercial `CodeScene`** operationalize hotspot/coupling mining from `git log`. *Needed for "techniques/tools" beat and Materiały dodatkowe.*
- **Change / temporal / logical coupling** — files that co-change in history are coupled regardless of static deps (the L2 graph can't see this). Gall et al. 1998 + Tornhill's "sum of coupling". *Verified; central to element ③.*
- **Connascence taxonomy** (static name/type/meaning/position/algorithm; dynamic execution/timing/value/identity; stronger+more-distant = higher priority) — Page-Jones attribution. *Concept well-documented; primary-source attribution NOT yet adversarially verified — soften the citation.*
- **Supporting metrics:** relative code churn → defect density (Nagappan & Ball 2005); cyclomatic complexity (McCabe 1976); cognitive complexity (SonarSource/Campbell 2018) as a proxy distinct from cyclomatic. *Verified; use as optional/bonus depth, not core.*
- **Program slicing / change-impact for blast radius** (Weiser). *Attribution NOT verified in this pass — treat as unverified.*
- **Current AI-assisted practice (2025-26):** agents reconstructing end-to-end data flow / sequence diagrams; feeding churn/coupling output to an LLM; failure modes (hallucinated call graphs, stale context, token limits). *Emerging, time-sensitive, NOT adversarially verified — frame as practice, not established fact.*

## Strong Sources

### Adam Tornhill — *Your Code as a Crime Scene* (1st ed. ~2015; 2nd ed. Feb 2024) & *Software Design X-Rays* (2018), Pragmatic Bookshelf

- URL: https://pragprog.com/titles/atcrime2/your-code-as-a-crime-scene-second-edition/ · https://www.oreilly.com/library/view/software-design-x-rays/9781680505795/f_0086.xhtml
- Type: technical-post (publisher TOC / book) — treat as primary for the method's own framing
- Author/publisher: Adam Tornhill / Pragmatic Bookshelf
- Checked: 2026-06-03
- Supports:
  - Hotspot lens = intersect code complexity with change frequency/effort, both mined from version-control history ("Mine the Evolution of Code", "Intersect Complexity and Effort").
  - X-Rays: "Hotspots combine two dimensions: complexity and change frequency" — prioritize code both frequently modified and hard to understand.
  - "Coupling in Time" / co-changing files framing for change coupling (X-Rays Ch. 3).
- Use in lesson:
  - Name the hotspot lens and attribute it to Tornhill; cite 1st ed. ~2015 / 2nd ed. 2024 and *Software Design X-Rays* 2018.
  - Anchor the "data, not vibes" thesis for element ③.
- Confidence: high (3-0 verified)
- Notes:
  - 1st-edition date is ambiguous (publisher 2014 vs commonly-cited 2015 paperback) — write "1st ed. ~2015, 2nd ed. 2024".

### `adamtornhill/indent-complexity-proxy` (GitHub)

- URL: https://github.com/adamtornhill/indent-complexity-proxy
- Type: repo
- Author/publisher: Adam Tornhill
- Checked: 2026-06-03
- Supports:
  - Tornhill's complexity proxy analyzes **source-code indentation patterns** (language-independent), explicitly **not** cyclomatic complexity.
  - Justified by research showing medium-to-high correlation with McCabe cyclomatic and Halstead measures (underlying paper: Hindle, Godfrey & Holt, "Reading Beside the Lines: Indentation as a Proxy for Complexity Metric", IEEE ICPC 2008).
- Use in lesson:
  - If the draft names a complexity measure, say "complexity proxied by indentation/size (LOC), not cyclomatic". Better: present the hotspot lens as **proxy-agnostic** (indentation/cyclomatic/cognitive/LOC all viable) so learners aren't locked to one metric. *(See Open Verification Questions.)*
- Confidence: high (3-0 verified)
- Notes:
  - CodeScene docs confirm it uses indentation-based complexity "rather than traditional metrics like Cyclomatic Complexity".

### `adamtornhill/code-maat` (GitHub) + CodeScene

- URL: https://github.com/adamtornhill/code-maat · https://github.com/adamtornhill/code-maat/blob/master/src/code_maat/analysis/sum_of_coupling.clj · https://github.com/adamtornhill/code-maat/blob/master/src/code_maat/analysis/logical_coupling.clj
- Type: repo (+ commercial product CodeScene at https://codescene.com)
- Author/publisher: Adam Tornhill
- Checked: 2026-06-03
- Supports:
  - code-maat is a CLI to "mine and analyze data from version-control systems", "developed to accompany ... *Your Code as a Crime Scene* and *Software Design X-Rays*". Supports git/SVN/Mercurial/Perforce/TFS (Clojure).
  - Defines logical coupling as "modules that tend to change together" with a "hidden, implicit dependency".
  - Implements `sum_of_coupling` (SoC): "the sum of the temporal coupling for each module ... a priority list of the modules that are most frequently changed together with others".
  - CodeScene is the commercial successor that automates these analyses.
- Use in lesson:
  - The "techniques / tools / data sources" beat: `git log` churn + code-maat-style change-coupling; CodeScene as the productized version. List in Materiały dodatkowe.
- Confidence: high (3-0 verified)
- Notes:
  - **Don't conflate SoC with pairwise coupling.** SoC ranks a module's *overall* co-change involvement; pairwise coupling strength is code-maat's separate `coupling` analysis.

### Gall, Hajek & Jazayeri — "Detection of Logical Coupling Based on Product Release History", ICSM 1998, pp. 190–198

- URL: https://plg.uwaterloo.ca/~migod/846/papers/gall-coupling.pdf · https://dblp.org/db/conf/icsm/icsm1998.html
- Type: paper
- Author/publisher: H. Gall, K. Hajek, M. Jazayeri (TU Vienna) / IEEE ICSM (14th Intl. Conf. on Software Maintenance)
- Checked: 2026-06-03
- Supports:
  - "Logical coupling refers to observed identical change behavior of different elements during system evolution" — detected over release history, "otherwise hidden in the source code".
  - The primary-source origin of change/temporal/logical coupling that L3 uses to surface boundary-crossing co-change the L2 dependency graph can't see.
- Use in lesson:
  - Attribute the concept to Gall et al. 1998; Tornhill operationalizes it. Use as the "this is rigorous, not folklore" anchor.
- Confidence: high (3-0 verified)
- Notes:
  - Affiliation/venue corroborated via DBLP + BibBase plus the PDF body; the PDF binary was partially uncooperative but author/title/year/venue are unanimous.

### Nagappan & Ball — "Use of Relative Code Churn Measures to Predict System Defect Density", ICSE 2005, pp. 284–292

- URL: https://dl.acm.org/doi/10.1145/1062455.1062514 · https://dblp.org/rec/conf/icse/NagappanB05.html
- Type: paper
- Author/publisher: Nachiappan Nagappan, Thomas Ball / ACM ICSE 2005 (DOI 10.1145/1062455.1062514)
- Checked: 2026-06-03
- Supports:
  - **Absolute** churn is a poor defect predictor, but **relative** churn (normalized by component size and temporal extent) is highly predictive of defect density.
- Use in lesson:
  - Bonus/optional depth behind "churn as a risk signal" — but stress *relative*, not raw, churn.
- Confidence: high (3-0 verified)
- Notes:
  - Grounded in one large industrial case study (Windows Server 2003) — present as a strong empirical result, not a universal law.

### McCabe — "A Complexity Measure", IEEE TSE, Vol. SE-2, No. 4, Dec 1976, pp. 308–320

- URL: http://www.literateprogramming.com/mccabe.pdf · https://dl.acm.org/doi/10.1109/TSE.1976.233837
- Type: paper
- Author/publisher: Thomas J. McCabe / IEEE Transactions on Software Engineering (DOI 10.1109/TSE.1976.233837)
- Checked: 2026-06-03
- Supports:
  - Cyclomatic complexity v(G) = e − n + p (control-flow form e − n + 2p); counts max linearly independent paths.
- Use in lesson:
  - Optional: name cyclomatic complexity as one complexity proxy. Note it is a **control-flow** (not data-flow) measure — relevant when contrasting with Tornhill's indentation proxy.
- Confidence: high (3-0 verified)

### SonarSource — "Cognitive Complexity" (G. Ann Campbell), 2018

- URL: https://www.sonarsource.com/resources/cognitive-complexity/ · https://dl.acm.org/doi/10.1145/3194164.3194186
- Type: technical-post (white paper) + peer-reviewed (ACM TechDebt 2018)
- Author/publisher: G. Ann Campbell / SonarSource
- Checked: 2026-06-03
- Supports:
  - Cognitive Complexity measures relative *understandability* of methods, departing from pure math models by combining cyclomatic precedents with human assessment — a proxy **distinct** from cyclomatic complexity.
- Use in lesson:
  - Optional: a more human-centered complexity proxy than cyclomatic. Attribute as "Sonar's metric" (widely reimplemented elsewhere, not strictly proprietary).
- Confidence: high (concept 3-0 verified)
- Notes:
  - **Date correction:** white paper dates to **2018** (ACM TechDebt 2018), with a 2021 republish — NOT a 2021 origin. The "~2017/2018" assumption in notes is correct.

## Practitioner Signals

### connascence.io / Wikipedia "Connascence" / community write-ups (Page-Jones taxonomy)

- URL: https://connascence.io/ · https://connascence.io/strength.html · https://en.wikipedia.org/wiki/Connascence · https://alchemists.io/articles/connascence · https://dev.to/trikitrok/about-connascence-17ko
- Type: community-discussion / technical-post
- Signal:
  - The static (name, type, meaning/convention, position, algorithm) and dynamic (execution/order, timing, value, identity) taxonomy is consistently reproduced across these sources, as is the guideline "stronger + more distant connascence = higher refactor priority" (degree / locality / strength).
  - Jim Weirich's conference talks are the common modern popularizer.
- Useful language:
  - "Connascence of meaning", "connascence of position", "locality reduces the cost of strong connascence" — precise vocabulary to replace "tightly coupled".
- Risk:
  - The **primary attribution** to Meilir Page-Jones (*What Every Programmer Should Know About OO Design*, ~1995/1996; *Fundamentals of OO Design in UML*, 1999) was **NOT adversarially verified** in this pass. The concept is solid; the exact book/year citation should be confirmed against a primary source before it appears in prose.
- Confidence: medium (concept well-attested; primary citation unverified)

### CodeScene — agentic refactoring / AI-readiness blogs (2025)

- URL: https://codescene.com/blog/making-legacy-code-ai-ready-benchmarks-on-agentic-refactoring · https://codescene.com/blog/deterministic-pr-refactoring-agents
- Type: technical-post (vendor blog) / practitioner-signal
- Signal:
  - A vendor actively combining behavioral code analysis with AI agents for refactoring — useful as evidence that "hotspot → AI-assisted change" is a live, productized workflow, and as a framing reference for the AI-as-ally angle.
- Useful language:
  - "AI-ready legacy code", "agentic refactoring", deterministic guardrails around agent output.
- Risk:
  - Vendor source with a commercial interest; benchmark claims are self-reported. Use for framing/existence-proof, not for hard performance numbers.
- Confidence: medium (vendor; not adversarially verified)

### understandlegacycode.com — *Software Design X-Rays* key points

- URL: https://understandlegacycode.com/blog/key-points-of-software-design-x-rays/
- Type: technical-post
- Signal:
  - A clear practitioner distillation of the hotspot/coupling method — useful as an accessible secondary explainer and Materiały dodatkowe link for learners who won't read the book.
- Confidence: medium-high (faithful to the primary source)

## Examples Worth Using

- **End-to-end data-flow trace (element ②):** pick one advanced-10xCards module (e.g. async flashcard generation, account/deletion lifecycle) and reconstruct inputs → commands → state changes → side effects → outputs as a sequence/flow diagram. The async-generation flow is the strongest demo (clear hops, side effects, failure points).
- **Hotspot ranking (element ③):** run `git log`-derived churn against a complexity proxy on the chosen module; show the top hotspot is *not* the file people feared but the one that is both complex and constantly changing.
- **Boundary-crossing change coupling:** show two files in different folders that co-change in history (SoC / logical-coupling) — implicit blast radius the L2 dependency graph missed.
- **Connascence as vocabulary upgrade:** rename a vague "this is tightly coupled" into "connascence of position across a module boundary" to make the issue precise and prioritizable.
- **AI as the accelerant, human decides:** agent drafts the data-flow diagram and the hotspot summary; learner verifies against the code and owns the risk read. Reinforces M4 principle 3.

## Claims To Avoid Or Soften

- **Do NOT say Tornhill's hotspots use cyclomatic complexity.** The proxy is indentation/size-based. Safest framing: the hotspot *lens* is proxy-agnostic; Tornhill's tooling happens to use indentation.
- **Do NOT present connascence with a hard Page-Jones primary citation** until verified — attribute as "the connascence taxonomy (popularized via Page-Jones / Jim Weirich)" and flag for a verification pass, or keep it at concept level.
- **Do NOT cite Weiser/program slicing** for blast-radius until verified (ICSE 1981 vs IEEE TSE 1984 unconfirmed here). Use the plain idea "compute the set of code a change can reach" without a hard citation, or drop it.
- **Do NOT quote CodeScene/AI-refactoring benchmark numbers** as established fact — vendor-reported, time-sensitive.
- **Do NOT overstate AI data-flow reconstruction.** Frame as "agent drafts, human verifies"; name the failure modes (hallucinated call graphs, stale/partial context, token limits) explicitly.
- **Relative vs absolute churn:** if churn is mentioned, specify *relative* churn (Nagappan & Ball) — raw churn is a poor predictor.

## Open Verification Questions

- **Connascence (Page-Jones):** confirm primary citation and dates (*What Every Programmer Should Know About OO Design* ~1995/1996; *Fundamentals of OO Design in UML* 1999) and the full static/dynamic taxonomy + strength/locality refactor-priority rule against a primary source.
- **Program slicing (Weiser):** confirm ICSE 1981 vs IEEE TSE 1984 and whether it earns a place in L3 at all (vs. L4 blast-radius framing).
- **Area 5 (AI-assisted practice 2025-26):** ground the current reality of LLM/agent data-flow + sequence-diagram reconstruction and churn/coupling operationalization, separating verified capability from hype — re-check close to publication.
- **Editorial (needs human decision):** present the complexity proxy strictly as indentation-based (Tornhill/CodeScene), or note the hotspot lens is proxy-agnostic (cyclomatic/cognitive/LOC all viable)? Recommend proxy-agnostic to avoid implying only one metric is valid.
- **Editorial (open in m4-shape §3 #4):** confirm L3 owns *both* report elements (② feature overview + ③ hot spots) vs. moving hot spots to L4.

## Schema Source Update

Added a `groundingSources` array to the `m4-l3` entry in `workbench/lessons-schema.json` (inserted between `requiredArtifacts` and `sideEffectLedger`) with the strong, primary-verified sources (Tornhill books, indent-complexity-proxy, code-maat/CodeScene, Gall et al. 1998, Nagappan & Ball 2005, McCabe 1976, SonarSource Cognitive Complexity) at `high` confidence, plus connascence (`medium`) and the CodeScene AI-refactoring blog (`medium`) flagged as unverified-attribution / vendor. Weiser/program slicing and the broader Area-5 grounding were left OUT of schema (unverified) and recorded under `sideEffectLedger.unsupportedFacts`; editorial choices recorded under `sideEffectLedger.needsHumanDecision`.
