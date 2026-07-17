# Notes — M4L3: Feature & module analysis (one domain end-to-end + where it hurts)

> Conceptual scaffolding for L3, distributed from `workbench/lessons/m4-shape.md` §5.
> Report elements produced: **② Feature overview + ③ Issues & hot spots** (two outputs,
> one act of analysis). Lesson opens with *why + current problem*, then applies these
> lenses. Concept is the hero; AI operationalizes it at scale.

## Why / current problem (recap)

The map says *where*; now you need *how it actually works* in the one module you care
about — plus honest signal about where it's fragile. "Risky" is folklore until you back
it with evidence; changes cause regressions because blast radius is unknown.

## Grounded lenses (≥3)

### 1. Hotspots = complexity × change frequency — *A. Tornhill, Your Code as a Crime Scene (2015) / Software Design X-Rays (2018)*
Behavioral code analysis ranks risk by combining a complexity proxy with version-control
change frequency. Complex code that rarely changes is not the priority; complex code that
changes constantly is.
- **Apply:** the evidence engine behind the "issues & hot spots" element — prioritize by
  data, not vibes.

### 2. Connascence — *M. Page-Jones, What Every Programmer Should Know About OO Design (1996)*
A precise taxonomy of coupling **strength** and **locality**:
- Static: connascence of **name, type, meaning, position, algorithm**.
- Dynamic: connascence of **execution, timing, value, identity**.
- Rule of thumb: stronger + more distant connascence = higher modernization priority.
- **Apply:** name *why* a seam is fragile with exact terminology instead of "tightly
  coupled." Gives the issues section a defensible vocabulary.

### 3. Change coupling (temporal / logical coupling) — *Gall, Hajek & Jazayeri (1998); Tornhill's "sum of coupling"*
Files/modules that change **together in history** are coupled regardless of static
dependencies — surfacing hidden coupling that crosses architectural boundaries.
- **Apply:** detect implicit blast radius the L2 dependency graph can't see; flag
  boundary-crossing co-change as a top issue.

## Bonus lenses (optional, if room)

- **Code churn as defect predictor** — *Nagappan & Ball, MSR (2005)*: relative code
  churn correlates with defect density; a cheap risk signal from git alone.
- **Cyclomatic complexity** (*McCabe, 1976*) and **cognitive complexity**
  (*SonarSource*) as the complexity proxies feeding the hotspot score.
- **Change impact analysis / program slicing** (*Weiser, 1981*): compute the
  blast-radius set for a proposed change.

## Tooling / data sources (operationalize the lenses)

- Hotspot/behavioral analysis from `git log` churn + complexity proxies; change-coupling
  (code-maat-style "files that change together").
- Data-flow / sequence reconstruction → the feature-overview diagram (element ②).
- Data sources: git history/blame, the module's code + tests, issue tracker for past bugs
  in this area, observability/error rates if available.

## Output of the lesson

- **Feature overview** (element ②): end-to-end data flow for the chosen module — inputs →
  commands → state changes → side effects → outputs, as a sequence/flow diagram.
- **Issues & hot spots** (element ③): hotspot ranking, named connascence per fragile
  seam, boundary-crossing change coupling, and a risk read (blast radius, test gaps).

> Attributions are confident-but-unverified — confirm in `lesson-grounding` before
> learner-facing prose.

---

## Carryover from m4-l2 grounding (2026-06-03) — behavioral-tool candidates to ground HERE

> These tools surfaced during the **m4-l2 deep-research run** (repo-map tooling) but belong
> to **L3's owned method** (hotspots = complexity × change frequency; change/temporal
> coupling — Tornhill, Gall). They were **parked here on purpose**: L2 only introduces "git
> history is one data axis"; L3 teaches the behavioral-analysis technique, so the *tools*
> that operationalize it should be grounded in **this** lesson's `lesson-grounding` pass.
>
> ⚠️ **STATUS: UNVERIFIED.** In the 2026-06-03 run these sources were *fetched but produced
> NO 3-0 verified claims* (the verifier budget went to the dependency-graph / structural-
> search families). Do **not** state license / maintenance / output formats as fact until a
> dedicated grounding round confirms them. Treat everything below as **research leads**, not
> grounded claims.

### The OSS↔commercial line to establish first

- **CodeScene** — the **commercial** product (Adam Tornhill's company) that productizes
  "crime-scene" behavioral analysis: hotspots, change coupling, knowledge/bus-factor maps,
  trend dashboards. **Flag as the paid alternative** — name it as "this exists and is
  polished, but it's paid," then teach the OSS path so the badge report stays free/variadic.
- **code-maat** — the **OSS ancestor** (also Tornhill): the CLI that the *Your Code as a
  Crime Scene* / *Software Design X-Rays* books are built on. The free way to compute the
  same hotspot/coupling signals from a plain `git log` export. **This is the one the lesson
  should lean on for the worked example.**

### OSS behavioral-analysis tool candidates (verify each before use)

| Tool | Claimed role | What to verify in grounding |
|------|--------------|------------------------------|
| **code-maat** | Hotspots, temporal/change coupling, sum-of-coupling, authorship — straight from a `git log` export. The canonical Tornhill OSS tool. | License, current maintenance status (is it still active?), exact analyses (`-a revisions / coupling / soc / authors`), input log format, JVM/Clojure setup cost. |
| **hercules** (`src-d/hercules`) | Advanced git-history analysis — burndown, churn, coupling, developer effort over time; heavier than code-maat. | OSS license, maintenance status (src-d archived much of its stack — **likely stale, confirm**), output formats (protobuf/YAML?), Go install path. |
| **git-of-theseus** | Visualizes how a repo's code survives/decays over time (cohort/survival plots) — a *volatility/age* lens, complementary to hotspots. | License, maintenance, output (it produces plots/JSON — confirm it gives agent-ingestible data, not just images), Python install. |
| **raw `git log` pipelines** | The zero-dependency baseline: churn heatmap (`git log --name-only | sort | uniq -c | sort -rn`), bus factor (`git shortlog -sne`), co-change via `--numstat`. Always available, no install. | These are the *fallback that always works* — verify the exact one-liners and that they're cross-platform (the `sort | uniq` pipe is POSIX; Windows needs care). |

### Complexity-proxy tools that feed the hotspot score (also unverified — shared with L2 gap)

> The hotspot score = **complexity × change frequency**. The change-frequency half comes
> from git (above); the complexity half needs a proxy. These were *also* fetched-but-not-
> verified in the m4-l2 run and overlap the L2 "sizing" gap — decide which lesson grounds them.

- **lizard** — cyclomatic complexity per function, multi-language. The function-level
  complexity axis for the hotspot score. Verify license/maintenance/output (`-s
  cyclomatic_complexity`, CSV/XML?).
- **scc** (Sloc Cloc and Code) — size + keyword-based complexity proxy + COCOMO in one Go
  binary. Faster, richer than `cloc`; a cheap repo-wide complexity signal. Verify
  license/maintenance/`--by-file --sort complexity` + JSON output.
- **tokei** / **cloc** — pure size counters (no complexity). Cheapest "how big is each
  area" signal. Verify maintenance + JSON output.

> **Note on overlap:** scc/tokei/cloc are arguably **L2** territory (sizing the map) while
> lizard + the git tools are **L3** (the hotspot engine). When grounding, split them by
> where they're actually taught so the same tool isn't grounded twice. See
> `m4-l2/lesson-grounding.md` → "Open Verification Questions" for the matching gap entry.

### Recommended next action

Run a focused `lesson-grounding` pass on **m4-l3** targeting the table above (primary
sources: each tool's repo/docs). Confirm code-maat's maintenance status specifically —
if it's effectively unmaintained, decide whether to (a) still teach it as the canonical
method with a caveat, (b) switch the worked example to raw `git log` pipelines + lizard,
or (c) name CodeScene's free tier / trial as the "see it polished" demo. This is a
**needs-human-decision** item, mirrored in `m4-l2`'s schema ledger.
