# Notes — M4L2: Mapa projektu (territory before the trees)

> Conceptual scaffolding for L2, distributed from `workbench/lessons/m4-shape.md` §5.
> Report element produced: **① Mapa projektu.** Lesson opens with *why + current problem*,
> then applies these lenses. Concept is the hero; AI operationalizes it at scale.

## Why / current problem (recap)

You can't decide what to change until you can see the whole board. Folder structure ≠
architecture; real boundaries are implicit; it's unclear which modules are load-bearing
vs peripheral, and onboarding docs are stale or never existed.

## Grounded lenses (≥3)

### 1. Deep vs shallow modules — *J. Ousterhout, A Philosophy of Software Design (2018)*
A module's value is interface simplicity relative to implementation depth. Shallow
modules (interface ≈ implementation) leak complexity upward; deep modules hide a lot
behind a small interface.
- **Apply:** classify each mapped module by depth — deep modules are good boundaries,
  shallow ones are smells to flag on the map.
- **Pairs with — information hiding** (*D. Parnas, "On the Criteria To Be Used in
  Decomposing Systems into Modules", 1972*): decompose by hidden design decisions, not by
  processing steps. Use to judge whether existing boundaries are principled or accidental.

### 2. Coupling metrics & the Main Sequence — *R. C. Martin, package design principles*
Quantify structure instead of eyeballing it:
- Afferent coupling `Ca` (who depends on me) / efferent coupling `Ce` (who I depend on).
- **Instability** `I = Ce / (Ca + Ce)` — 0 = maximally stable, 1 = maximally unstable.
- **Abstractness** `A` and **distance from the main sequence** `D = |A + I − 1|`.
- **Apply:** find unstable-but-depended-on modules (pain) and zones of
  uselessness/pain (high D). Turns "feels coupled" into a coordinate on the map.

### 3. Architectural core & propagation cost (DSM) — *MacCormack, Rusnak & Baldwin, "Exploring the Structure of Complex Software Designs" (2006)*
Dependency Structure Matrix analysis classifies components as **core / peripheral /
shared**, measures **propagation cost** (fraction of the system reachable by a change),
and exposes **cyclic dependency groups**.
- **Apply:** identify the load-bearing core and the tangled cycles. This is the
  enterprise-grade, measurable version of "deep vs shallow" at system scale.

## Koncepty techniczne: nawigacja i przeszukiwanie repo

> Wątek dodany na prośbę: *dlaczego* mapa-najpierw-potem-feature, oraz *jak* w ogóle
> przeszukać duże repo. **Placement jest płynny** — część (zwłaszcza deep/agentic search
> i śledzenie przepływu) może w przyszłości przenieść się do **L3**. Tu trzymamy całość
> razem, bo to L2 ustawia strategię "wide then deep".

### 4. Wide-then-deep — dlaczego mapa przed featurem (ograniczone okno kontekstu)

Metodyczne uzasadnienie kolejności L2 → L3: budujesz najpierw szeroki model całości,
żeby wiedzieć *gdzie* wydać kosztowny deep-read. To nie estetyka — to alokacja
ograniczonej uwagi (człowiek) i ograniczonego okna kontekstu (agent).

- **Top-down / integrated program comprehension** — *R. Brooks; von Mayrhauser & Vans
  (integrated metamodel: program model + situation model + top-down model)*: rozumienie
  zaczyna się od hipotezy o całości, weryfikowanej potem w szczególe.
- **Opportunistic / as-needed comprehension** — *Littman i in.*: doświadczeni nie czytają
  wszystkiego; czytają *tyle, ile trzeba*, prowadzeni przez model wysokiego poziomu.
- **Information Foraging Theory** — *Pirolli & Card*: programista podąża za "zapachem
  informacji" (information scent); mapa z L2 **dostarcza scent**, który kieruje deep-dive
  w L3. Bilans: koszt nawigacji vs wartość znalezionej informacji.
- **Limited context window** — analog techniczny: ani człowiek, ani agent nie zmieści
  całego repo naraz; "wide then deep" to strategia budżetowania kontekstu (łączy się z
  *context economics* z L1).
- **Apply:** to jest *uzasadnienie struktury całego modułu* — L2 = wide, L3 = deep — a nie
  osobny krok w raporcie.

### 5. Modele przeszukiwania repo (od taniego/precyzyjnego do semantycznego/agentowego)

Czym agent (i człowiek) faktycznie nawiguje po dużym repo. Cztery rodziny, różne trade-offy:

- **Lexical / pattern search** — `grep`, `ripgrep`: dokładne/regex, szybkie, tanie, bez
  semantyki. Wysoka precyzja, recall zależny od tego, czy znasz właściwe nazwy.
- **Structural / symbol indexes** — `ctags`, **LSP** (go-to-definition, find-references),
  indeksy kodu (**SCIP/LSIF**, Sourcegraph), **AST-grep / Comby**: wyszukiwanie po
  strukturze i symbolach zamiast po tekście.
- **Semantic retrieval / RAG** — embeddingi nad chunkami kodu + wektorowy retrieval:
  dobre na "gdzie jest logika X", gdy nie znasz nazw. Ryzyka: chunking, **nieaktualny
  indeks**, kompromis precision/recall.
- **Agentic search** — iteracyjne, tool-driven (ReAct): agent sam odpala `ls`/`grep`/`read`,
  rozumuje i zawęża; brak prekomputowanego indeksu → świeżość, ale koszt tokenów/iteracji.
  To **"wide then deep" wykonane przez agenta**.
- **Trade-offy do nazwania w lekcji:** świeżość vs koszt indeksu; precyzja (lexical) vs
  recall (semantyczny); determinizm vs eksploracja.
- **Mapowanie L2 ↔ L3 (do rozłożenia):** L2 używa *wide* search (lexical + struktura +
  ewentualnie semantyczny) do zbudowania mapy; L3 używa *deep*, ukierunkowanego czytania
  (agentic, śledzenie przepływu danych). Stąd przyszły podział tematu między L2 i L3.

## Bonus lenses (optional, if room)

- **Software Reflexion Models** — *Murphy, Notkin & Sullivan (1995)*: diff the
  *as-intended* architecture against the *as-built* dependency graph; the gaps are the
  story.
- **C4 model** — *S. Brown*: map at deliberate altitudes (Context → Container →
  Component → Code) so the map stays readable instead of a hairball.
- **Conway's Law** — *M. Conway (1968)* + the **Inverse Conway Maneuver**: module
  structure mirrors org structure; mismatches predict friction.

## Tooling / data sources (operationalize the lenses)

Narzędzia CLI-native, nie-AI, które karmią overlay ważności na mapie **bez czytania
kodu**. Każde mapuje się na wskaźnik z sekcji "L2 — mapa wide & shallow + overlay".
Rdzeń: **git + scc + code-maat + madge** pokrywa cztery osie (historia, rozmiar/złożoność,
zachowanie, struktura) czterema komendami.

### Piątka podstawowa

1. **`git` — historia jako sygnał (churn + bus factor).** Najtańsza strzałka "gdzie się
   ciągle grzebie", zero czytania kodu.
   ```bash
   git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20  # churn heatmap
   git shortlog -sne -- src/server/                                             # bus factor
   ```
   → *churn heatmap*, *bus factor*.

2. **`scc` (Sloc Cloc and Code) — rozmiar + proxy złożoności + COCOMO w jednym binarku.**
   Upgrade nad `cloc`/`tokei` (liczy keyword-based complexity, nie tylko linie).
   ```bash
   scc --by-file --sort complexity src/
   ```
   → *complexity proxy*, *deep/shallow size signal*. (`tokei` = same linie, szybkie; `cloc` = klasyk.)

3. **`code-maat` — behavioral analysis prosto z `git log`** (narzędzie A. Tornhilla).
   Liczy hotspoty, temporal/change coupling, sum-of-coupling, authorship.
   ```bash
   git log --numstat --pretty=format:'[%h] %an %ad %s' --date=short > log.txt
   maat -l log.txt -c git2 -a revisions   # churn
   maat -l log.txt -c git2 -a coupling    # zmieniają się razem
   ```
   → *churn*, *change coupling* (most do L3).

4. **`madge` / `dependency-cruiser` — graf zależności + cykle** (natywne dla TS/Astro/Svelte = 10xCards).
   Strukturalny szkielet mapy; karmi *instability/D*, *core/periphery*, sygnały DSM.
   ```bash
   madge --circular src/                          # cykle = czerwona flaga
   madge --image graph.svg src/                   # obraz mapy
   depcruise --output-type dot src | dot -Tsvg > deps.svg
   ```
   → *coupling/instability inputs*, *cykle*, *core*.

5. **`lizard` — cyclomatic complexity per funkcja (multi-language).** Dokładniejsza oś
   złożoności niż keyword-proxy z scc; wskazuje funkcje-potwory.
   ```bash
   lizard src/ -s cyclomatic_complexity
   ```
   → *complexity* na poziomie funkcji.

### Honorable mentions (gdyby trzeba 6–7)

- **`jscpd`** — copy/paste detector (duplikacja jako smell na mapie), multi-language.
- **`ripgrep` + `universal-ctags`** — lexical search + indeks symboli (spina się z
  "search models" z sekcji 5).
- **`Graphviz` (`dot`)** — klej, który zamienia output madge/code-maat/dep-cruiser w obrazek mapy.
- **`tree` / `eza --tree`** — terytorium na rzut oka, zero setupu.

### Kąt "variadic" (raport robimy na dowolnym OSS, nie tylko 10xCards)

- **Język-agnostyczne** (działają wszędzie): `git`, `scc`, `code-maat`, `lizard`, `jscpd`.
- **JS-native** (out-of-the-box na 10xCards): `madge`, `dependency-cruiser` — świetne do
  demo; ucz, że dla innego stacku jest odpowiednik (`pydeps`, `go mod graph`, `jdeps`).

### Pozostałe źródła / whiteboard

- **Mermaid / Excalidraw** jako whiteboard mapy (zgodnie z house Mermaid workflow).
- Data sources: directory & workspace/build config, dependency manifests, entry
  points/routes, README (verify intent against reality).

## Output of the lesson

The **Mapa projektu** report section: territory map (modules, responsibilities, dependency
direction, entry points), each module tagged deep/shallow + core/peripheral, cycles and
high-D zones marked, and a shortlist of "suspicious neighborhoods" → sets the L3 target.

> Attributions are confident-but-unverified — confirm in `lesson-grounding` before
> learner-facing prose (esp. the metric formulas `I = Ce/(Ca+Ce)`, `D = |A+I−1|`).
