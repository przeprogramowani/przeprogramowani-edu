# NotebookLM Infographic Brief

## Goal

Use NotebookLM manually for text-heavy infographics, while keeping the automated OpenRouter pipeline focused on conceptual illustrations.

## Guardrails

- Use only one tightly scoped ebook chunk per infographic.
- Keep output in Polish.
- Force `16:9` composition for every infographic.
- Do not combine multiple far-apart sections into one graphic unless they are explicitly part of the same local framework.
- Do not let NotebookLM introduce extra model names, benchmark names, dates, percentages, or claims that are not present in the selected chunk.
- Prefer 3-7 blocks, lanes, or steps per infographic. Dense tables perform worse visually.

## Style Target

- Match the illustration family used in the automated assets: `dark-cosmic-10xdevs`.
- Keep the background dark, cinematic, and space-adjacent:
  - deep navy / indigo / violet base
  - not black flat fill, not white canvas
  - subtle cosmic depth, haze, or layered atmosphere
- Lock the accent palette to:
  - `#F68F09`
  - `#CD84FF`
  - `#1F36E4`
- Use color roles consistently:
  - blue / indigo for structure and large surfaces
  - violet for emphasis and secondary UI glow
  - orange only as a focal accent or key action point
- Lighting should feel premium and high-contrast:
  - cool blue-violet rim light
  - restrained orange highlights
  - clear separation between foreground and background
- Composition should feel like a designed sci-fi editorial graphic, not a generic slide:
  - modular panels, cards, lanes, or orbits
  - one strong visual center or a clearly dominant reading path
  - enough negative space to breathe
- Texture should match the illustrations:
  - smooth, premium surfaces
  - subtle glow and mild painterly polish
  - no noisy photorealism
- Typography expectations:
  - Polish only
  - very short labels
  - avoid paragraphs
  - prefer 1-3 word headings and one short sentence per block at most
  - if a table would require too much copy, reduce it into grouped cards instead
- Desired mood:
  - neutral educational
  - premium web visual
  - subtle cosmic 10xDevs vibe
  - more “designed product graphic” than “presentation slide”

## Forbidden Style Traits

- flat stock-photo look
- generic clipart or office-illustration style
- dominant white background
- chaotic cyberpunk overload
- busy dashboards packed with microtext
- random logos, watermarking, branding, or fake UI chrome
- bright rainbow palette outside the locked 3-color system
- corporate infographic templates with thin gray dividers and bland icon sets
- too much text for a narrow ebook column

## Layout Rules

- Build the infographic as one coherent board, not several disconnected mini-slides.
- The infographic must read well when embedded inside an ebook column.
- Use larger information blocks rather than many tiny cells.
- Favor these structures:
  - timeline / orbit
  - 3-column comparison
  - decision tree
  - scorecard
  - ladder / maturity spectrum
  - pipeline / quality gate
- Keep the reading path obvious from left to right or top to bottom.
- Avoid literal spreadsheet rendering unless the source chunk is already extremely compact.

## Reusable NotebookLM Prompt

```text
Na podstawie wyłącznie podanego fragmentu ebooka przygotuj jedną infografikę w proporcji 16:9.

Zasady:
- język polski
- używaj tylko faktów, terminów, nazw i liczb z fragmentu
- nie dopisuj żadnych nowych benchmarków, modeli, dat ani wniosków
- zredukuj tekst do krótkich etykiet i 1-zdaniowych bloków
- wybierz układ najbardziej naturalny dla fragmentu: oś czasu, porównanie, drzewo decyzyjne, karta oceny, 3-etapowy proces albo macierz
- priorytet: czytelność i poprawność faktów
- końcowy wynik ma wyglądać jak pojedyncza infografika do ebooka, nie jak slajd pełen tekstu
- styl ma pasować do istniejących ilustracji ebooka:
  - ciemne granatowo-fioletowe tło
  - mocne krawędziowe światło
  - neonowe poświaty tylko w kolorach #F68F09, #CD84FF i #1F36E4
  - filmowa głębia i warstwowa kompozycja
  - subtelne modułowe panele sci-fi UI
  - neutralny edukacyjny ton
  - premium web illustration / premium editorial infographic
- unikaj:
  - białego tła
  - stockowego looku
  - clipartu
  - przeładowanego dashboardu
  - zbyt dużej ilości tekstu
  - losowych ikon i brandingów
```

## Optional NotebookLM Add-On

If NotebookLM tends to overproduce text, append this sentence:

```text
Maksymalnie 3-7 bloków informacji, duże czytelne panele, żadnego drobnego tekstu.
```

## Recommended Chunks

### Chapter 1

- Heading: `Cykl życia benchmarku`
- Lines: `147-159`
- Why this works: the section is already a clean 5-step loop.
- Best layout: circular lifecycle / orbit.
- What to keep verbatim: the five phases only.
- Avoid mixing with: contamination examples from earlier subsections.

### Chapter 2

- Heading: `Spektrum dojrzałości (marzec 2026)`
- Lines: `184-194`
- Why this works: one compact status matrix with a direct decision implication.
- Best layout: 4-lane maturity spectrum.
- What to keep verbatim: the four status buckets and their action implications.
- Avoid mixing with: later ranking tables and leaderboard numbers.

### Chapter 3

- Heading: `Metryki wynikowe`
- Lines: `360-374`
- Why this works: strong comparison between `pass@1`, `pass@k`, `pass^k`, `G-Pass@k`, and `Resolve Rate`.
- Best layout: comparison card or side-by-side metric grid.
- What to keep verbatim: metric names, what they measure, when to use, and the trap to avoid.
- Avoid mixing with: cost tables from the next subsection.

### Chapter 4

- Heading: `Paradygmaty architektoniczne`
- Lines: `495-503`
- Why this works: a clean 3-column contrast between workflow, agentic, and hybrid.
- Best layout: three-column comparison.
- What to keep verbatim: examples, strengths, and weaknesses of each paradigm.
- Avoid mixing with: market-agent table below.

### Chapter 5

- Heading: `Spektrum technik`
- Lines: `586-598`
- Why this works: one table already maps structure, quality, safety, and best use.
- Best layout: left-to-right maturity spectrum.
- What to keep verbatim: the five techniques and their qualitative differences.
- Avoid mixing with: METR / CodeRabbit study numbers from later in the chapter.

### Chapter 6

- Heading: `Szybki przewodnik wyboru`
- Lines: `661-675`
- Why this works: immediate decision support with one recommendation per situation.
- Best layout: decision matrix or chooser board.
- What to keep verbatim: the situation, chosen tool, and why.
- Avoid mixing with: the broader tool catalog below.

### Chapter 7

- Heading: `Co sprawdzać w wygenerowanym kodzie`
- Lines: `781-793`
- Why this works: a clear review gate from build to code review.
- Best layout: quality gate / pipeline.
- What to keep verbatim: the five layers of checking and the hard stop on build failure.
- Avoid mixing with: later case-study content.

### Chapter 8

- Heading: `Który tier do jakiego zadania`
- Lines: `991-999`
- Why this works: a compact tier-to-task mapping that turns into a readable infographic fast.
- Best layout: tier ladder or task-to-tier matrix.
- What to keep verbatim: the three task bands and example model tiers.
- Avoid mixing with: the broader pricing tables unless you want a separate cost infographic.

### Chapter 9

- Heading: `Co chcesz ustalić?`
- Lines: `1026-1048`
- Why this works: the section is already written as a decision tree.
- Best layout: branching decision tree.
- What to keep verbatim: the four top-level questions and the immediate action for each.
- Avoid mixing with: the weighted scorecard section below.

### Chapter 10

- Heading: `Krok 1`, `Krok 2`, `Krok 3`
- Lines: `1147-1168`
- Why this works: the rollout is already broken into three stages with different time horizons.
- Best layout: 3-step roadmap / mission timeline.
- What to keep verbatim: the three rollout stages and their time framing.
- Avoid mixing with: the later stakeholder communication section.

## Working Rule

If a chunk already contains a table, tree, or numbered process, keep the infographic limited to that one structure. That is the safest way to avoid NotebookLM fabricating summary text.
