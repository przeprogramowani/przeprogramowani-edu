# Lesson Spec: m4-l3 — Analiza feature z AI: co działa, co kuleje, co zmodernizować

## Schema Context

- Course: 10xdevs-3
- Module: m4 — Large scale & legacy projects
- Position: 3 / 18
- Depends on: m4-l2 — Agent w projekcie legacy - generowanie Mapy projektu
- Prepares for: m4-l4 — Refaktoryzacja z Agentem: testy, zmiany, weryfikacja

## Prework Continuity

- Relevant prework lessons: [1.2] Chatbot vs Agent vs Harness, [1.3] Jak uczyć się i rozwijać z AI, [3.1] LLMy i ich wpływ na codzienną pracę programisty, [3.3] Cykl życia wątku i zarządzanie kontekstem.
- Assumed from prework: agent działa przez narzędzia w kontrolowanym harnessie; model widzi tylko wybrany kontekst; długi wątek i duże okno nie zastępują selekcji; AI ma wspierać zrozumienie, nie zdejmować odpowiedzialności z człowieka.
- Deepened here: strategia `Select` z preworku staje się operacyjnym Deep Focus na jednym module wybranym z repo mapy.
- Avoid repeating: definicje chatbota/agenta/harnessu, ogólne zasady context engineering, ogólne prompt patterns.

## Lesson Job

Ta lekcja zamienia Mapę projektu ① z M4-L2 w wąską, dowodową analizę jednego wybranego feature'a albo modułu. Kursant ma użyć artefaktów z `context/map/repo-map.md` jako wejścia do pracy z agentem: sekcji `Strefy ryzyka` (wybór celu), `Pierwszy dzień` (entry pointy), `Ograniczenia` (pierwsze `unknowns`), a także `Teren`, `Realne powiązania` i `Kogo zapytać`. Analizę prowadzi znany skill `/10x-research` w trybie kontrolowanym — karmiony mapą jako priorem oraz kontraktem zakresu, z jednym zapytaniem rozbitym na dokładnie trzy sub-agenty (trace e2e, luki w testach, blast radius). Wynik zapisywany jest do osobnego artefaktu `context/changes/<feature-slug>/research.md`. Twierdzenia strukturalne raportu (liczby call-site'ów, „tylko tutaj", „zawsze przez X") kursant potwierdza deterministycznym CLI `ast-grep`, a każde zero z `ast-grep` weryfikuje klasycznym grepem. Wynikiem są dwa kolejne elementy raportu: ② Feature overview oraz ③ Technical debt.

## Thesis

Deep Focus nie zaczyna się od "agent, przeanalizuj ten feature", tylko od kontrolowanego użycia repo mapy: mapa mówi agentowi, gdzie wejść, jakie hipotezy sprawdzić, czego nie czytać i które dowody muszą zamienić się w przepływ danych oraz ryzyka. Semantyczną analizę agenta (znaczenie, zachowanie) domyka deterministyczna konfirmacja CLI (liczba, pozycja) — agent od „jak to działa", `ast-grep` od „ile dokładnie i gdzie".

## Learning Outcomes

- Kursant wybiera jeden cel Deep Focus na podstawie artefaktów z Mapy projektu: `Strefy ryzyka`, etykiet core/supporting/peripheral, deep/shallow, stable/volatile/seasonal, load-bearing, kontraktów, unknowns i wskazanych entry pointów.
- Kursant uruchamia `/10x-research` w trybie kontrolowanym: jedno zapytanie karmione mapą jako priorem rozbija na dokładnie trzy sub-agenty (trace e2e, luki w testach, blast radius łączący graf statyczny z co-change), a wynik zapisuje do `context/changes/<feature-slug>/research.md`.
- Kursant buduje z agentem Feature overview ②: end-to-end przepływ danych przez wybrany moduł, od wejścia do efektów ubocznych i wyniku, z diagramem oraz dowodami ze ścieżek/komend.
- Kursant buduje Technical debt ③: hotspoty, change coupling, kruche sprzężenia, blast radius, luki testowe i unknowns, oddzielając dowody od interpretacji.
- Kursant potwierdza twierdzenia strukturalne raportu narzędziem `ast-grep` (wzorce w składni języka z placeholderami, odróżnienie `Save` od `SaveMultiple`), a każde zero potwierdza grepem; rozumie, że `ast-grep` to też operator rewrite (zapowiedź dla M4-L4), z którego w tej lekcji jeszcze nie korzysta.
- Kursant umie użyć repo mapy jako kontraktu wejściowego dla agenta: zakres, granice czytania, hipotezy do sprawdzenia i zakaz proponowania refaktoryzacji przed M4-L4.

## Audience Starting Point

Kursant ma po M4-L2 pierwszą Mapę projektu i 2-3 kandydatów do głębszego czytania. Prawdopodobnie rozumie już, gdzie w projekcie są aktywne terytoria, entry pointy i podejrzane sąsiedztwa, ale nie wie jeszcze, jak dany feature naprawdę działa ani które ryzyka są potwierdzone danymi.

## Behavioral Change

Kursant przestaje prosić agenta o ogólną analizę modułu, a zaczyna prowadzić go przez dowodowy Deep Focus: repo map -> scope -> /10x-research (3 sub-agenty) -> data flow -> hotspoty -> ast-grep confirmation -> raport.

## Owned Concepts

- Repo map artifacts as Deep Focus inputs: warning/sensitive area, chosen target, module labels, entry points, load-bearing contracts, dependency corridor, social context, unknowns and evidence snippets.
- Scope contract for an agentic deep dive: one feature/module, explicit boundaries, evidence-first reading, no random deep-read.
- `/10x-research` in controlled mode: znany greenfield research skill nakarmiony mapą jako priorem + kontraktem zakresu; jedno zapytanie rozbite na dokładnie trzy sub-agenty (trace e2e, luki w testach, blast radius = graf statyczny + co-change z gita); wynik do `context/changes/<feature-slug>/research.md`; workflow `/10x-init`, `/10x-new`.
- Feature overview ②: end-to-end data flow through one selected feature/module.
- Technical debt ③: hotspot = complexity x change frequency, change/temporal coupling, connascence vocabulary, blast radius, test gaps and unsupported unknowns.
- Strukturalna konfirmacja CLI: podział pracy agent (znaczenie/zachowanie) vs deterministyczne CLI (liczba/pozycja); AST vs tekst (agent widzi tokeny, nie nazwane węzły drzewa składni); `ast-grep` jako structural matcher (wzorce w składni języka z placeholderami, `Save` vs `SaveMultiple`); instalacja cross-platform (jeden binarny Rust, alias `sg` koliduje z `setgroups` na Linuksie).
- `ast-grep` + grep jako lustrzane słabości: licz `ast-grep`em dla precyzji, ale każde zero potwierdzaj tekstowym grepem (zero z matchera = albo brak wystąpień, albo zły wzorzec).
- `ast-grep` w trybie rewrite (zapowiedź, NIE używane w tej lekcji): `-r` z reużyciem metazmiennych, `--interactive` / `-U`, reguły YAML z polem `fix` i `ast-grep scan` — ten sam wzorzec, którym konfirmujesz raport, poniesie zmianę w M4-L4.
- Evidence taxonomy for the report: evidence, inference, unknown.

## References Only

- M4-L1 context architecture: `context/` as the durable home for artifacts and attention-budget discipline.
- M4-L2 Mapa projektu: territory, structure, social context, dependency map and module classification are inputs, not retaught here.
- M4-L4 refactor opportunities: L3 may name risks and constraints, but does not choose target archetypes or migration strategies.
- M4-L5 DDD opportunities: L3 may surface language/domain tension as a risk, but does not run Event Storming or design bounded contexts.

## Must Not Cover

- Do not re-teach whole-repo mapping, dependency graph theory, deep/shallow modules or static architecture mapping; those belong to M4-L2.
- Do not propose refactor strategies, target architecture, Strangler Fig, Branch by Abstraction, Mikado Method or characterization-test plans; those belong to M4-L4.
- Do not turn CodeScene, code-maat, lizard or raw git pipelines into a tool tutorial. Tools illustrate the method; the method is transferable. (Exception: `ast-grep` is the lesson's confirmation backbone — it earns meaningful install + read/rewrite coverage; even so, teach it as a method for structural confirmation, not as an exhaustive tool reference.)
- Do not cite unverified Page-Jones dates or Weiser/program-slicing attribution as hard facts.
- Do not present agent-generated diagrams as truth without human verification against code, tests and command output.

## Required Example Or Demo

Use the same worked project line as M4-L2. The draft continues from the Mattermost repo map and takes the **post save flow** (`PostStore.Save`) as the Deep Focus target — a simulated backlog task ("optimize the message-save path, maybe prep it for debt repayment"). The `Pierwszy dzień` section points at the store layer:

```text
server/channels/store/store.go            (interfejs warstwy storage)
server/channels/store/sqlstore/...         (konkretna implementacja)
server/channels/store/.../storetest        (kontrakt testowy)
```

The demo should show how repo map artifacts guide the agent:

- Warning / sensitive area: the post save flow flagged in the L2 map as the storage stack with the hardest coupling in the repo.
- Entry points: the three store-layer files from `Pierwszy dzień` (interface, sqlstore implementation, storetest contract).
- Dependency corridor: store interface -> sqlstore implementation -> test contract, plus the backend/frontend halves of the post model.
- Volatility signal: directories or files that were active in git history.
- Change-coupling lead: files/folders that changed together and deserve verification (e.g. backend model vs its hand-maintained frontend counterpart).
- Social context: recent contributors/PRs to inspect before trusting an interpretation.
- Unknowns: runtime config, dynamic dependencies, hidden side effects or test gaps left unresolved by the map.

Worked findings the draft surfaces (use as calibration, do not overfit): folder structure lied (most layers are transparent wrappers, real work is one dense place); single save is a facade over a batch mechanism; post-save data returns from memory, not re-read from DB; optimistic client message reconciles with the server version; the quietest debt is a two-halved model nothing tools keeps in sync plus order-dependent DB writes no compiler guards.

The learner-facing exercise can be variadic: use Mattermost as the demo, mention React/tldraw as contrasting map shapes, then ask learners to run the same Deep Focus on one sensitive area from their own `context/map/repo-map.md`, saving to `context/changes/<feature-slug>/research.md`.

## Structural Logic Map

1. **Beat:** The map is not the answer; it is the entry contract.
   - **Question answered:** "Mam Mapę projektu. Co teraz?"
   - **Introduces:** repo map artifacts as Deep Focus inputs.
   - **Depends on:** M4-L2 map, `Strefy ryzyka` / `Executive Read` and `context/map/repo-map.md`.
   - **Sets up:** choosing a single target.
   - **Diagram opportunity:** Wide Scan output -> Deep Focus input pipeline.
   - **Risk:** repeating M4-L2 instead of showing how the artifacts are consumed.

2. **Beat:** Choose one target and freeze the scope.
   - **Question answered:** "Który fragment zasługuje na koszt głębokiego czytania?"
   - **Introduces:** scope contract for the agent.
   - **Depends on:** warning/sensitive area, module labels, entry points, contracts, unknowns.
   - **Sets up:** end-to-end tracing.
   - **Diagram opportunity:** decision branch from 2-3 candidates to one selected feature.
   - **Risk:** selecting a whole subsystem instead of one feature/module.

3. **Beat:** Turn map evidence into a controlled `/10x-research` query.
   - **Question answered:** "Jak przekazać agentowi kontekst bez wrzucania całego repo?"
   - **Introduces:** prompt contract: target, allowed files, evidence, unknowns, no refactor; one query decomposed into exactly three sub-agents (trace e2e, test gaps, blast radius = static graph + git co-change); `/10x-init`, `/10x-new`; output to `context/changes/<feature-slug>/research.md`.
   - **Depends on:** selected target and repo map snippets.
   - **Sets up:** data-flow reconstruction.
   - **Diagram opportunity:** none.
   - **Risk:** producing a generic prompt that ignores the repo map artifacts, or letting the agent's greenfield decomposition sprawl across half the repo.

4. **Beat:** Reconstruct the Feature overview ②.
   - **Question answered:** "Jak ten feature naprawdę płynie przez system?"
   - **Introduces:** inputs -> commands -> state changes -> side effects -> outputs.
   - **Depends on:** entry points and dependency corridor from the map.
   - **Sets up:** risk analysis.
   - **Diagram opportunity:** sequence/flow diagram for the selected feature.
   - **Risk:** agent hallucinating call graph; require file/line/command evidence and unknowns.

5. **Beat:** Add behavioral evidence: hotspot lens.
   - **Question answered:** "Które miejsca są ryzykowne, a nie tylko brzydkie?"
   - **Introduces:** complexity x change frequency, proxy-agnostic framing with Tornhill caveat.
   - **Depends on:** chosen feature files and git-history leads from the map.
   - **Sets up:** change coupling and blast radius.
   - **Diagram opportunity:** small table or heat map, not decorative Mermaid unless it shows a pipeline.
   - **Risk:** saying Tornhill uses cyclomatic complexity; grounding says avoid that.

6. **Beat:** Detect hidden coupling.
   - **Question answered:** "Co zmienia się razem mimo braku oczywistej zależności statycznej?"
   - **Introduces:** change/temporal/logical coupling and SoC caveat.
   - **Depends on:** git history and candidate corridor.
   - **Sets up:** named issues.
   - **Diagram opportunity:** co-change graph for 3-6 files/modules.
   - **Risk:** conflating pairwise coupling with sum-of-coupling ranking.

7. **Beat:** Name fragility precisely.
   - **Question answered:** "Jak opisać ryzyko inaczej niż 'tightly coupled'?"
   - **Introduces:** connascence vocabulary as a practical label set.
   - **Depends on:** data flow and coupling evidence.
   - **Sets up:** final Technical debt report.
   - **Diagram opportunity:** none unless showing a before/after vocabulary upgrade.
   - **Risk:** hard Page-Jones citation before primary verification.

8. **Beat:** Capture the two report sections.
   - **Question answered:** "Co dokładnie trafia do raportu?"
   - **Introduces:** ② Feature overview and ③ Technical debt templates.
   - **Depends on:** trace, hotspot evidence, coupling evidence, risk read.
   - **Sets up:** structural confirmation pass.
   - **Diagram opportunity:** report assembly flow.
   - **Risk:** slipping into refactor proposals too early.

9. **Beat:** Confirm structural claims with deterministic CLI.
   - **Question answered:** "Czy liczby i twierdzenia 'tylko tutaj' / 'zawsze przez X' w raporcie są prawdziwe?"
   - **Introduces:** agent (meaning/behavior) vs CLI (count/position) division of labor; AST vs text; `ast-grep` patterns with placeholders (`Save` vs `SaveMultiple`); confirmation prompt as investigation, not refactor; `ast-grep` + grep mirror weaknesses (count for precision, confirm every zero with grep); rewrite mode as a forward pointer to M4-L4 (`-r`, `--interactive`, `-U`, YAML `fix`), not used here.
   - **Depends on:** the drafted `research.md` and its structural claims.
   - **Sets up:** M4-L4 refactor opportunities (same patterns will carry the change).
   - **Diagram opportunity:** none, or a small evidence table claim -> confirmed/refined/refuted.
   - **Risk:** reading a structural zero as "no occurrences" when the pattern was simply wrong; presenting rewrite mode as in-scope for L3.

## Failure Mode To Disarm

The central failure mode is "agent zrobił deep dive", but the output is really another broad summary of the map: a few paths, vague coupling language and premature refactor suggestions. The lesson should disarm this by requiring a narrow scope, a repo-map input bundle, explicit evidence/inference/unknown labels and a hard stop before refactor planning.

## Suggested Structure

1. **Od mapy do celu** — show why `context/map/repo-map.md` is the input contract for Deep Focus.
   - Previous beat -> this beat -> next beat: M4-L2 ends with a sensitivity map; this section converts one warning into one target; next section turns the target into an agent prompt.

2. **Research bez wymyślania koła: `/10x-research` w trybie kontrolowanym** — teach the agent contract that consumes repo map artifacts and decomposes one query into exactly three sub-agents (trace, test gaps, blast radius).
   - Previous beat -> this beat -> next beat: the target is chosen; now the known research skill gets boundaries, the map as prior and a fixed decomposition; next it traces the feature.

3. **Feature overview ②: przepływ end-to-end** — reconstruct the selected feature as data flow with a diagram and evidence.
   - Previous beat -> this beat -> next beat: the agent knows where to read; now it explains behavior; next the lesson asks where that behavior is fragile.

4. **Technical debt ③: ryzyko z danych, nie z intuicji** — combine hotspot analysis, change coupling, connascence labels, blast radius and test gaps.
   - Previous beat -> this beat -> next beat: the feature flow is explicit; now risk can be grounded; next the lesson hardens the structural claims.

5. **Pogłębianie raportu z `ast-grep`** — confirm the report's structural claims with a deterministic structural matcher; AST vs text; confirm every zero with grep; preview rewrite mode as the bridge to M4-L4 without using it.
   - Previous beat -> this beat -> next beat: the report exists but its numbers are soft; now CLI confirms or refutes each structural claim; next the lesson saves output and stops before refactor.

6. **Raport i granica przed M4-L4** — save the two sections to `context/changes/<feature-slug>/research.md` and state what remains for refactor planning.
   - Previous beat -> this beat -> next beat: risk is named and confirmed; now it becomes report material; M4-L4 turns it into options.

## Video Placeholders

- Demo: take the `context/map/repo-map.md` output from M4-L2 and select one candidate for Deep Focus.
- Demo: build the controlled `/10x-research` query from repo map artifacts: warning, labels, entry points, load-bearing contracts, corridor, unknowns, social context, decomposed into trace / test gaps / blast radius, saved to `context/changes/<feature-slug>/research.md`.
- Demo: agent reconstructs a sequence/flow diagram, then the instructor verifies it against code and marks evidence/inference/unknown.
- Demo: run one hotspot/change-coupling pass and turn the result into the Technical debt report section without proposing refactors.
- Demo: take a structural claim from the report, build an `ast-grep` pattern (`Save` vs `SaveMultiple`), confirm or refute it, and confirm a zero with grep.

## Bridge In

M4-L2 produced a Mapę projektu ① with a map of sensitive areas. M4-L3 starts by treating that map as a working contract: it tells the agent where to spend attention, what signals already exist and which unknowns need deeper verification.

## Bridge Out

M4-L3 ends with two evidence sections: how the selected feature works and where it hurts. M4-L4 starts from those sections and asks a different question: which refactor opportunities are worth considering, how to make them incremental and how to protect the change.

## Open Questions

- RESOLVED: L3 owns both report elements ② Feature overview and ③ Technical debt (two outputs of the same Deep Focus act). The ③ element is named **Technical debt** in the draft (canonical), not "Issues & hot spots".
- RESOLVED (draft = SoT): the analysis engine is `/10x-research` in controlled mode with a fixed three-sub-agent decomposition, and structural claims are confirmed with `ast-grep` (zeros confirmed with grep). Deep Focus output lives in `context/changes/<feature-slug>/research.md`, separate from `context/map/repo-map.md`.
- Decide whether learner-facing prose should use Mattermost as the continuous demo from M4-L2 or switch to advanced 10xCards for stronger course-project continuity. Current recommendation: Mattermost for L2/L3 continuity; 10xCards as optional exercise framing.
- Decide how much tool detail to include in core vs Deep Dive. Current state in draft: `ast-grep` gets meaningful core coverage (install, read patterns, rewrite preview); hotspot/connascence/logical-coupling depth lives in Deep Dive; code-maat/CodeScene stay illustrative.
- Confirm whether connascence primary attribution should be verified before draft or kept as concept-level vocabulary without hard book/year citation.

## Side-Effect Ledger

New claims introduced:
- Repo map artifacts are explicit Deep Focus inputs: warning/sensitive area, labels, entry points, load-bearing contracts, dependency corridor, social context, unknowns and evidence snippets.
- Back-prop from draft (draft = source of truth): the analysis engine is `/10x-research` in controlled mode, one query decomposed into exactly three sub-agents (trace e2e, test gaps, blast radius = static graph + git co-change), output saved to `context/changes/<feature-slug>/research.md` via `/10x-init`, `/10x-new`.
- Back-prop: `ast-grep` is introduced as the deterministic structural-confirmation layer (agent = meaning/behavior, CLI = count/position; AST vs text; `Save` vs `SaveMultiple`; install cross-platform; `sg` alias collides with `setgroups`), with the rule "count with ast-grep, confirm every zero with grep", and a forward-pointer rewrite preview (`-r`, `--interactive`, `-U`, YAML `fix`) explicitly NOT used in L3.
- Back-prop: ③ report element is renamed from "Issues & hot spots" to **Technical debt** (canonical in draft body, exercise and Deep Dive).

Claims removed:
- (none) — "Issues & hot spots" survives only as a synonym; the canonical name is now Technical debt.

Neighboring lesson references changed:
- M4-L2 handoff is strengthened: Mapę projektu ① must produce artifacts consumable by M4-L3, not only a readable diagram.
- M4-L4 boundary is strengthened: L3 names risk and evidence, but does not propose refactor opportunities; `ast-grep` rewrite mode is previewed in L3 as the bridge that will carry M4-L4 changes.

Prework references used:
- Prework [1.2], [1.3], [3.1], [3.3].

Prework concepts repeated intentionally:
- Context selection and agent/harness framing, only as continuity for Deep Focus.

Potential duplicates:
- M4-L2 map construction vs M4-L3 map consumption. Draft must keep L3 focused on consuming artifacts, not rebuilding the map.

Unsupported facts:
- Page-Jones primary citation dates for connascence remain unverified.
- Program slicing / Weiser attribution remains unverified and should not be used as a hard source.
- Current AI-assisted data-flow reconstruction should be framed as a workflow with verification, not as established capability.
- `ast-grep` tool-behavior claims in the draft (single Rust binary + prebuilt macOS/Linux/Windows releases, install channels, `sg` alias colliding with `setgroups` on Linux, `-r`/`--interactive`/`-U` semantics, YAML `fix` + `ast-grep scan`) should be re-verified against current ast-grep docs before RC; add an ast-grep groundingSource via lesson-grounding.

Video/text mismatches:
- (none yet)

Needs human decision:
- RESOLVED: L3 owns both report elements; ③ is named Technical debt.
- Whether the main demo continues Mattermost or switches to advanced 10xCards.
- How much tool installation/output detail belongs in core vs Deep Dive (current draft gives ast-grep meaningful core coverage).
