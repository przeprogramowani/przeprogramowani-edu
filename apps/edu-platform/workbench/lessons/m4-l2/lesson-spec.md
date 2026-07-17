# Lesson Spec: m4-l2 — Agent w projekcie legacy - generowanie Mapy projektu

## Schema Context

- Course: 10xdevs-3
- Module: m4 — Large scale & legacy projects
- Position: moduleOrder 2 / globalOrder 17
- Depends on: m4-l1 — Skalowanie kontekstu dla AI w dużych projektach
- Prepares for: m4-l3 — Analiza feature z AI: co działa, co kuleje, co zmodernizować

## Current Draft Source Of Truth

This spec has been backpropped from `lesson-draft.md`. The draft is the current editorial source of truth.

Key current-state decisions from the draft:

- The lesson title is `Agent w projekcie legacy - generowanie Mapy projektu`.
- The main process is **Wide Scan -> Deep Focus**.
- M4-l2 executes Wide Scan only and ends with the **Mapa projektu ①** in `context/map/repo-map.md`, synthesized from three working artifacts (`artifact-1-territory.md`, `artifact-2-structure.md`, `artifact-3-contributors.md`) in the same `context/map/` folder.
- The map's primary job is not to hand off to M4-l3; it is to identify key, sensitive, active and load-bearing areas in a legacy project before bigger changes.
- M4-l3 may take one sensitive area and perform Deep Focus: feature/data-flow analysis, risk, hotspot reasoning and modernization decisions.
- The main example is **Mattermost** as a large, real, checkable legacy-style OSS repo.
- The project map is built from three signal families: **Terytorium**, **Struktura**, and **Kontekst kontrybutorów**.
- Each signal family should produce operational `evidence / inference / caution / unknowns`, not raw rankings or dumps.
- The draft now makes evidence-based module classification explicit: **core/supporting/peripheral**, **deep/shallow**, **stable/volatile/seasonal**, **load-bearing/contained**, **high/medium/low sensitivity**, and **contract/implementation layer** when supported by evidence.
- The project map's TL;DR includes a compact Mermaid of the main layers as a manual synthesis of Wide Scan evidence, not a full dependency-graph hairball. There is no dedicated diagram section in the lesson body.
- `dependency-cruiser` is the featured structural tool (cycles, layer boundaries, test-risk, density-taming flags); `madge`/`skott` are lighter alternatives and a compact per-stack table ("Alternatywy pod inne stacki") covers other ecosystems inside the structural section.
- Tool taxonomy and the semantic-search nuance are Deep Dive material; evidence-based module classification ("Jak klasyfikować moduły na mapie") also lives in Deep Dive, not on the main spine.

## Prework Continuity

- Relevant prework: [3.1] LLMy i ograniczenia okna kontekstu; [3.3] Write/Select/Compress/Isolate i cykl życia wątku; [2.2]/[2.3] indeksowanie repo i pamięć projektowa w narzędziach.
- Assumed from prework: kursant wie, że model nie ma magicznej pamięci projektu, okno kontekstu jest ograniczonym zasobem, a selekcja kontekstu jest częścią pracy z agentem.
- Deepened here: preworkowe `Select` staje się operacyjną strategią wejścia w obce legacy: najpierw tanie sygnały CLI, potem synteza mapy i dopiero później wąskie czytanie.
- Avoid repeating: teoria MECW jako osobny wykład, podstawy promptów, porównania narzędzi AI, AGENTS.md/CLAUDE.md i architektura `context/` z M4-l1.

## Lesson Job

Ta lekcja uczy, jak wejść w obcy albo dawno niewidziany projekt bez przepalania okna kontekstowego na losowe czytanie plików. Kursant ma przestać prosić agenta o "przeczytanie całego repo" i zamiast tego wykonać kontrolowany **Wide Scan**: zebrać tanie, deterministyczne sygnały z CLI, poprosić agenta o syntezę i zapisać wynik jako **Mapę projektu ①** pokazującą kluczowe i wrażliwe obszary legacy.

Lekcja nie jest refaktoryzacją ani analizą feature'a. Jej efektem jest mapa wrażliwości terytorium: moduły, entry pointy, kierunki zależności, aktywne obszary, korytarze zmian, kontekst kontrybutorów, dowodowa klasyfikacja modułów, uproszczony diagram, unknowns oraz 3-5 miejsc, w których trzeba uważać przed większą zmianą.

## Thesis

W dużym legacy nie zaczynasz od "agent, przeczytaj całe repo". Najpierw robisz **Wide Scan**: zbierasz kompaktowe dowody z historii gita, strukturalnego wyszukiwania i grafów zależności, a potem agent syntetyzuje z nich Mapę projektu. Dobra mapa mówi, gdzie projekt jest aktywny, load-bearing, sprzężony, zależny od kontraktów albo pełen unknowns, czyli gdzie trzeba uważać przed zmianą.

## Learning Outcomes

- Kursant wyjaśnia, dlaczego pełny zrzut repo do LLM-a jest złą strategią startową: nie mieści się w praktycznym budżecie kontekstu albo daje streszczenie bez priorytetów.
- Kursant stosuje proces **Wide Scan -> Deep Focus** i wie, że M4-l2 kończy się Wide Scan, a M4-l3 może pogłębić jeden z wrażliwych obszarów.
- Kursant tworzy **Mapę projektu ①** w `context/map/repo-map.md` (po drodze trzy robocze artefakty `artifact-1/2/3`) z krótkimi sekcjami, dowodami z komend, jawnie oznaczonymi `unknowns` i Strefami ryzyka, w których trzeba uważać przed większą zmianą.
- Kursant odróżnia drzewko katalogów od mapy projektu: foldery są hipotezą, a architektura wymaga sygnałów o zależnościach, entry pointach, historii zmian i kontekście zespołowym.
- Kursant zbiera trzy składowe mapy: **Terytorium** (gdzie projekt żyje), **Struktura** (jak jest połączony), **Kontekst kontrybutorów** (kto ma wiedzę o obszarach).
- Kursant zapisuje po każdej składowej operacyjne `evidence / inference / caution / unknowns`, zamiast zostawiać surowe rankingi narzędzi.
- Kursant klasyfikuje moduły wyłącznie na podstawie dowodów z Wide Scan: core/supporting/peripheral, deep/shallow, stable/volatile/seasonal, load-bearing/contained, high/medium/low sensitivity oraz contract/implementation layer, jeśli taki podział widać.
- Kursant umieszcza w TL;DR mapy kompaktowy Mermaid głównych warstw jako ręczną syntezę dowodów Wide Scan, zamiast wklejać automatycznie wygenerowany pełny graf zależności.
- Kursant używa agenta jako tłumacza między pytaniem w języku naturalnym a przewidywalnym CLI, a nie jako wyroczni, która "rozumie repo" bez dowodów.
- Kursant ręcznie weryfikuje mapę: sprawdza entry pointy, konfigurację grafu zależności, aliasy, cykle i miejsca, gdzie agent powinien powiedzieć `unknown`.

## Audience Starting Point

Kursant po M4-l1 rozumie, że rosnący projekt trzeba przygotować pod pracę z agentem przez lean root, `context/` i świadome zarządzanie uwagą. W M4-l2 sytuacja jest odwrotna: projekt już istnieje, często jest legacy, dokumentacja bywa stara, a agent nie ma dobrego punktu startowego.

Typowe początkowe odruchy:

- "Nie wiem, od którego pliku zacząć."
- "Wrzućmy całe repo do modelu i zapytajmy o architekturę."
- "Drzewko katalogów chyba wystarczy jako mapa."
- "Najlepiej od razu przeanalizować feature."

Lekcja zmienia ten odruch na: najpierw mapa wrażliwości, potem dopiero głębokie czytanie wybranego miejsca, jeśli jest potrzebne.

## Behavioral Change

Po lekcji kursant nie prosi agenta o ogólne `explain this entire repo`. Daje agentowi zadanie Wide Scan: zebrać i zsyntetyzować dowody z historii gita, entry pointów, zależności i kontekstu kontrybutorów, zapisać Mapę projektu i wskazać, gdzie w legacy trzeba uważać przed większą zmianą.

## Owned Concepts

- **Mapa projektu ①** jako finalny artefakt Wide Scan zapisany w `context/map/repo-map.md`.
- **Trzy robocze artefakty skanu** w `context/map/` (`artifact-1-territory.md`, `artifact-2-structure.md`, `artifact-3-contributors.md`) jako notatki robocze, syntetyzowane na końcu do `repo-map.md`.
- **Wide Scan -> Deep Focus** jako sekwencja wejścia w legacy: szeroka, płytka mapa wrażliwości przed ewentualnym wąskim, głębokim czytaniem.
- **Full repo dump jako antywzorzec startowy**: duże okno kontekstu nie oznacza dobrego zrozumienia ani priorytetów.
- **Foldery jako hipoteza, nie architektura**: drzewko katalogów pokazuje położenie plików, ale nie ważność, aktywność, sprzężenie ani realne wejścia do systemu.
- **Trzy składowe Mapy projektu**:
  - Terytorium: aktywne centra, korytarze zmian, stabilne i sezonowe obszary.
  - Struktura: entry pointy, kierunek zależności, cykle, lokalne centra.
  - Kontekst kontrybutorów: kto pracował nad jakim typem problemu w danym korytarzu.
- **Operacyjne wnioski po każdej składowej**: `evidence / inference / caution / unknowns` jako zabezpieczenie przed dumpem danych.
- **Dowodowa klasyfikacja modułów**: core/supporting/peripheral, deep/shallow, stable/volatile/seasonal, load-bearing/contained, high/medium/low sensitivity oraz contract/implementation layer są roboczymi etykietami mapy, nie diagnozą jakości kodu.
- **Diagram jako ręczna synteza w TL;DR**: mapa zawiera kompaktowy Mermaid głównych warstw w sekcji TL;DR, a nie automatycznie wygenerowany pełny graf zależności; nie ma osobnej sekcji-diagramu w lekcji.
- **dependency-cruiser jako narzędzie wiodące struktury**: cykle, granice warstw, ryzyka testów i dźwignie taming gęstego grafu; `madge`/`skott` i tabela per stack jako alternatywy.
- **CLI jako compact evidence**: `git`, `rg`/`find`, structural search i grafy zależności skanują repo poza oknem kontekstowym, a do rozmowy trafia skondensowany wynik.
- **Unknowns jako część mapy**: mapa ma pokazywać niepewność, a nie udawać pełne zrozumienie systemu.
- **Manual sanity checks**: entry pointy, path aliases, workspace config, cykle i granice narzędzi muszą zostać sprawdzone przez człowieka.

## References Only

- M4-l1 context architecture: lean root, `context/`, maturity ladder i zarządzanie uwagą. L2 korzysta z tej mentalności, ale jej nie uczy od nowa.
- Prework [3.1] i [3.3]: ograniczone okno kontekstu i `Select`. L2 operacjonalizuje je w legacy.
- M1-l4 agent onboarding: mapa może później zasilić instrukcje projektu, ale lekcja nie jest tutorialem pisania AGENTS.md.
- M4-l3 Deep Focus: feature/data-flow analysis, hotspoty, szczegółowy risk read, change coupling i decyzje modernizacyjne.
- Narzędzia repo search: cztery rodziny wyszukiwania i warianty per stack są materiałem wspierającym, nie głównym celem lekcji.

## Must Not Cover

- Ponowne nauczanie AGENTS.md/CLAUDE.md, inclusion testu, inner loop ani architektury `context/`.
- Pełna analiza feature'a, przepływ danych end-to-end, luki testowe i decyzja "co zmodernizować" — to M4-l3.
- Behavioral code analysis jako metoda: hotspot = complexity x churn, change coupling, temporal coupling i sum-of-coupling — to M4-l3.
- Makro-smells jako język refactor opportunities, refaktoryzacja, plan zmian, safety net i weryfikacja refaktoru — to M4-l4.
- DDD, bounded contexts, ekstrakcja domen i modernizacja legacy — to M4-l5.
- Szczegółowy tutorial instalacji każdego narzędzia CLI albo długa tabela odpowiedników per język.
- Twierdzenie, że narzędzia automatycznie rozumieją architekturę. Narzędzia produkują sygnały; interpretacja jest pracą agenta i człowieka.
- Learner-facing strong claims o niezweryfikowanych narzędziach, wersjach, licencjach, capability claims lub akademickich metrykach bez dodatkowego grounding.

## Required Example Or Demo

Main example: **Mattermost** — open-source platforma komunikacyjna z backendem Go, frontendem React/TypeScript, wieloletnią historią, dużą liczbą kontrybutorów i ponad milionem linii kodu.

The draft uses Mattermost because it is real, large and checkable. It is not just a toy project. It also lets the lesson show three map layers:

1. **Mapa terytorialna** — `git` history: active directories, quarterly activity shifts, directory/file pairs changed together.
2. **Mapa strukturalna** — structural search and dependency graph: HTTP handlers, app-layer delegation, frontend dependency centers.
3. **Mapa kontrybutorów** — contributor/topic grouping: who has context for Burn on Read, permissions, AI features, search/store/platform maintenance.

Demo sequence:

1. Start from the bad instinct: "Agent, przeczytaj całe repo i wyjaśnij architekturę".
2. Name the correction: **Wide Scan -> Deep Focus**.
3. Show that M4-l2 only performs Wide Scan, writing working artifacts into `context/map/` and synthesizing `context/map/repo-map.md`.
4. Collect territory signals from git history: active directories, quarterly trends, co-change corridors.
5. Collect structure signals: entry point counts, app-layer delegation, local dependency centers.
6. Collect social context: top contributors for a selected corridor, grouped by commit themes rather than raw commit count.
7. After each layer, write operational `evidence / inference / caution / unknowns`.
8. Classify modules with evidence: core/supporting/peripheral, deep/shallow, stable/volatile/seasonal, load-bearing/contained, sensitivity and contract layer where visible.
9. Ask the agent to synthesize `context/map/repo-map.md` from the three artifacts: TL;DR with a compact Mermaid of layers, Teren, Realne powiązania, Strefy ryzyka, Kogo zapytać, Pierwszy dzień and Ograniczenia.
10. Run manual sanity checks.
11. End by naming 3-5 sensitive areas to check before bigger changes.

The video placeholder in the draft should cover this exact Mattermost Wide Scan flow.

## Structural Logic Map

Beat 1 — Bridge: controlled project vs inherited project
- Question answered: czym M4-l2 różni się od M4-l1?
- Introduces: w M4-l1 organizujesz projekt, na który masz wpływ; w M4-l2 wchodzisz w repo, którego nie znasz.
- Sets up: pokusę "wrzuć całe repo".

Beat 2 — Why not full repo dump
- Question answered: dlaczego duże okno kontekstu nie rozwiązuje problemu?
- Introduces: praktyczny budżet kontekstu, tokenization variability, narzut narzędzi/instrukcji/historii rozmowy i streszczenie bez priorytetów.
- Sets up: map-first as selection strategy.

Beat 3 — Wide Scan -> Deep Focus
- Question answered: jaki jest właściwy proces?
- Introduces: Wide Scan jako płytki skan terytorium, Deep Focus jako wąskie czytanie wybranego obszaru.
- Sets up: Mapa projektu jako radar wrażliwości, który może później zasilić Deep Focus.

Beat 4 — Folder tree is not architecture
- Question answered: czemu `tree` i nazwy katalogów nie wystarczą?
- Introduces: foldery jako hipoteza, zależności, entry pointy, aktywność zmian i ukryte sprzężenia.
- Sets up: trzy składowe mapy.

Beat 5 — Effective Mapa projektu
- Question answered: co ma zawierać mapa?
- Introduces: kluczowe moduły, częstotliwość zmian, obszary wrażliwe, coupling, blast radius, kontrybutorzy, unknowns i Strefy ryzyka.
- Sets up: agent + CLI loop.

Beat 6 — Natural language + predictable CLI
- Question answered: jak agent pomaga bez czytania wszystkiego?
- Introduces: agent tłumaczy pytania na komendy, CLI skanuje repo poza oknem, wynik wraca jako compact evidence.
- Sets up: three map components.

Beat 7 — Three components of the map
- Question answered: jakie sygnały łączymy?
- Introduces: Terytorium, Struktura, Kontekst kontrybutorów; po każdej składowej zapis do roboczego artefaktu w `context/map/`.
- Sets up: Mattermost example.

Beat 8 — Mattermost territorial map
- Question answered: gdzie projekt żyje?
- Introduces: active directories, quarterly trends, co-change corridors; zapis do `artifact-1-territory.md`.
- Sets up: `Sensitive areas from change history` with evidence/inference/caution/unknowns.
- Sets up: structure layer.

Beat 9 — Mattermost structural map (dependency-cruiser)
- Question answered: jak to jest połączone?
- Introduces: `dependency-cruiser` dla `webapp` — cykle, granice warstw, ryzyka testów, taming gęstego grafu (`--collapse`/`--focus`/`--exclude`), kompaktowa tabela odpowiedników per stack; zapis do `artifact-2-structure.md`.
- Sets up: `Structural sensitivities` and structural blast-radius cautions.
- Sets up: social context layer.

Beat 10 — Mattermost social map
- Question answered: kto ma kontekst i o co go zapytać?
- Introduces: contributor/topic grouping, not raw blame; zapis do `artifact-3-contributors.md`.
- Sets up: `Contributor/context risks`, PR-history pointers and caution before changing subtle areas.
- Sets up: synthesis.

Beat 11 — Mapa projektu — finalna synteza
- Question answered: jak zamienić trzy artefakty w `context/map/repo-map.md`?
- Introduces: synthesis prompt z onboardingową strukturą (TL;DR + Mermaid warstw, Teren, Realne powiązania, Strefy ryzyka 4-6, Kogo zapytać, Pierwszy dzień 5-8 plików, Ograniczenia), no refactoring, unknowns, manual sanity checks.
- Sets up: optional M4-l3 bridge (one risk zone → Deep Focus) without making it the main goal of L2.

Deep Dive beats (po sekcji praktycznej, nie na głównej osi):
- Cztery rodziny wyszukiwania repo, Granice każdej składowej, Dwa znaczenia "semantic search" oraz Jak klasyfikować moduły na mapie (core/supporting/peripheral, deep/shallow, stable/volatile/seasonal, load-bearing/contained, sensitivity, contract/implementation layer + prompty wymuszające dowód na etykietę).

## Suggested Structure

The draft already follows the intended structure:

1. Intro without heading — bridge from M4-l1 to unknown legacy, anti-pattern of "read whole repo", definition of Mapa projektu, the `context/map/` layout (three artifacts + final `repo-map.md`).
2. `### Dlaczego nie zaczynamy od całego repo`
3. `### Wide Scan -> Deep Focus`
4. `### Czego nie mówi drzewko katalogów`
5. `### Efektywna Mapa projektu`
6. `### Język naturalny i przewidywalne CLI`
7. `### Trzy składowe Mapy projektu`
8. `### Mapa terytorialna — gdzie projekt żyje`
9. `### Mapa strukturalna — jak to jest zbudowane` (#### Pierwsze kroki, #### Pozyskujemy informacje o strukturze, #### Jak ujarzmić zbyt gęsty graf, #### Alternatywy pod inne stacki)
10. `### Mapa kontrybutorów — kto wie co i o co go zapytać`
11. `### Mapa projektu — finalna synteza`
12. `## 🧑🏻‍💻 Zadania praktyczne` (Krok 0-4)
13. `## Odbierz swoją odznakę`
14. `## 🔎 Deep Dive` (Cztery rodziny wyszukiwania repo, Granice każdej składowej, Dwa znaczenia "semantic search", Jak klasyfikować moduły na mapie)
15. `## 📚 Materiały dodatkowe`

## Practical Task Contract

The learner works in `context/map/`: first three working artifacts (`artifact-1-territory.md`, `artifact-2-structure.md`, `artifact-3-contributors.md`), then a final synthesis into `context/map/repo-map.md` for a repository they do not know well (Krok 0-4).

Working artifacts capture, per Wide Scan session:

- **artifact-1-territory.md** — active centers, quarterly trends when possible, co-change corridors, and `evidence / inference / caution / unknowns`.
- **artifact-2-structure.md** — entry points, dependency direction, cycles, local centers, contracts, and structural blast-radius cautions (built with `dependency-cruiser` for JS/TS).
- **artifact-3-contributors.md** — top contributors for a chosen area, grouped by topic, with bots/automation filtered out, plus PR/history topics to check before changing.

The final `repo-map.md` synthesis (per the lesson's synthesis prompt) has the sections:

- **TL;DR** (5-7 sentences) with a compact Mermaid of the main layers, where work concentrates, where it hurts.
- **Teren** — large responsibility vs periphery; deep vs shallow modules; activity over time.
- **Realne powiązania** — what truly changes together (couplings + layers + cycles), with provenance.
- **Strefy ryzyka** — 4-6 high-risk areas with a one-line "why" (replaces the earlier standalone `Where to be careful first` framing).
- **Kogo zapytać** — per zone, 1-2 topically matched contributors.
- **Pierwszy dzień** — 5-8 entry files/modules to read first.
- **Ograniczenia** — time window, method, what the map does NOT say (unknowns).

Required manual checks:

- Entry points are real system entry points, not merely obvious folder names.
- Dependency tooling understood project config, path aliases, workspaces and nonstandard entry points.
- Module labels (Deep Dive legend) are supported by evidence and not based only on folder names.
- The TL;DR Mermaid is a readable synthesis, not a full dependency graph dump.
- Important sections include caution, not just evidence.
- Agent marks gaps as `unknown` instead of pretending certainty.

## Deep Dive Contract

Deep Dive supports the main lesson, but does not replace it.

Current Deep Dive subsections in the draft:

- **Cztery rodziny wyszukiwania repo** — lexical/pattern, structural/symbol, semantic/RAG and agentic search.
- **Granice każdej składowej** — what territory, structure and social context can and cannot prove.
- **Dwa znaczenia "semantic search"** — distinguish AST-aware structural search from embedding/RAG search, especially for Probe.
- **Jak klasyfikować moduły na mapie** — evidence-based labels: core/supporting/peripheral, deep/shallow, stable/volatile/seasonal, load-bearing/contained, sensitivity and contract/implementation layer, with prompts that require evidence per label. (Moved here from the main spine.)

Note: the per-stack tool alternatives ("Alternatywy pod inne stacki" / variadic mapping) live in the main structural section, not in Deep Dive.

Keep tool details here unless they are necessary for the core Mattermost walkthrough.

## Video Placeholders

- One main demo video covering the Mattermost Wide Scan flow already described in the draft (territory → structure → contributors → synthesis).
- It should show agent synthesis from tool outputs (and writing into `context/map/` artifacts), not agent guessing from memory.
- It should end with the `context/map/repo-map.md` synthesis and its Strefy ryzyka (4-6 high-risk areas).
- It must not teach full behavioral analysis, refactoring or DDD modernization.

## Bridge In

M4-l1 taught context scaling for a project you can organize: lean root, `context/` and attention-aware instruction architecture. M4-l2 applies the same attention discipline to a project you do not yet understand: before writing instructions or changing code, build a compact operational map.

## Bridge Out

M4-l2 ends with `context/map/repo-map.md` and its Strefy ryzyka. M4-l3 can take one of those sensitive areas and turn it into feature/data-flow analysis: what works, what hurts, what is risky and what might deserve modernization.

> Cross-lesson note: M4-l3's contract and spec were updated this pass to the new `context/map/repo-map.md` path and `Strefy ryzyka` section name. The M4-l3 draft already used this naming, so the module bridge is now fully consistent (only the M4-l3 contract+spec had lagged behind both drafts).

## Open Questions

- Czy Mattermost zostaje finalnym głównym demo repo? The draft currently assumes yes.
- Czy all Mattermost numeric examples have been fully reproduced/verified from current local commands or source material? If not, keep them as draft examples until grounding/QA confirms them.
- Czy schema-level `learningOutcomes`, `referencesOnly` and `mustNotCover` should be updated to reflect this draft-backed spec? Current answer: yes, updated in this pass to reflect the sensitivity-map framing.
- Czy `git` in L2 remains a map signal only, while hotspot/change-coupling method stays in M4-l3? Current draft answer: yes.
- Czy a dedicated grounding pass is needed for token-window claims and Mattermost size/contributor examples before RC? Current draft has supporting links, but exact examples should be treated as needing QA if not already verified.

## Side-Effect Ledger

New claims introduced (this backprop pass):
- The draft is the source of truth for this spec and contract.
- Artifact layout is `context/map/`: three working artifacts (`artifact-1-territory.md`, `artifact-2-structure.md`, `artifact-3-contributors.md`) synthesized at the end into `context/map/repo-map.md` — not a single `context/repo-map.md`.
- Mattermost is the main example repository for the lesson.
- Mapa projektu is framed as a legacy sensitivity map: key, active, load-bearing and risky areas before bigger changes.
- The main project-map spine is three components: Terytorium, Struktura and Kontekst kontrybutorów, each producing `evidence / inference / caution / unknowns` in its own artifact.
- `dependency-cruiser` is the featured structural tool (cycles, layer boundaries, test-risk, density-taming flags); `madge`/`skott` and a compact per-stack table are the alternatives, kept in the structural section.
- The final map's risk block is `Strefy ryzyka` (4-6 areas) inside `repo-map.md`, not a standalone `Where to be careful first` lesson section.
- Evidence-based module classification is taught in Deep Dive (`Jak klasyfikować moduły na mapie`), not on the main spine.
- The Mermaid lives in the map's TL;DR as a compact layer diagram; there is no dedicated diagram section in the lesson body.

Claims removed:
- Academic metric formulas and architecture lenses as a core learner-facing spine for this lesson.
- "Core five" or broad CLI-tool bundles as a required main-path toolset.
- Treating repo-search model taxonomy as a central learning outcome instead of supporting Deep Dive material.
- Deep Focus shortlist as the primary output of M4-l2.
- A standalone `Where to be careful first` / `Diagram Mapy projektu` / `Demo` section; a 6-12 node diagram requirement.
- The `10xArchitect` report name (not present in the draft; the `①` numbering convention is kept).
- A blanket ban on a per-stack tool table (the draft includes a compact one).

Neighboring lesson references changed:
- M4-l1 remains the bridge-in through attention/context discipline only.
- M4-l3 can consume one risk zone, but M4-l2 itself is complete as a sensitivity map.
- RESOLVED (propagated this pass): M4-l3's contract and spec were updated to `context/map/repo-map.md` + `Strefy ryzyka` to match M4-l2. The M4-l3 draft already used this naming, so the whole module bridge is now consistent.

Prework references used:
- [3.1] context window limits and the operational cost of too much context.
- [3.3] `Select` as the prework concept deepened into Wide Scan.
- [2.2]/[2.3] project indexing and memory as background, not re-taught.

Prework concepts repeated intentionally:
- Limited context is repeated only as the practical legacy-onboarding problem, not as a fresh theory section.

Potential duplicates:
- M4-l1 context scaling — controlled by bridge only; no re-teaching `context/`.
- M4-l3 behavioral analysis — controlled by explicit boundary: L2 maps, L3 analyzes feature/risk.
- M1-l4 agent onboarding — controlled by not turning map output into AGENTS.md tutorial.

Unsupported facts:
- Exact Mattermost line-count and numeric examples should be verified before RC if they were not produced by a recorded grounding/demo run.
- Tokenizer/context-window claims should stay tied to current supporting sources in `Materiały dodatkowe`.
- The draft's Materiały dodatkowe now cite three token/context-window sources (OpenAI Help Center, Claude support article, arXiv tokenizer paper 2601.11518) not yet in `groundingSources`; a grounding pass should verify them before adding.
- Specific tool capabilities should remain grounded in the listed source material and not be expanded without verification.

Video/text mismatches:
- (none yet) — video scenario not drafted.

Needs human decision:
- Final confirmation that Mattermost is the canonical demo repo.
- RESOLVED: propagated the new `context/map/repo-map.md` path and `Strefy ryzyka` naming to M4-l3's contract and spec; the M4-l3 draft already used them, so the module bridge is now consistent.
- Whether to run a targeted grounding/QA pass for Mattermost numbers and to add the three token/context-window sources to `groundingSources`.
