# Writing Style Guide

General rules for written educational content aimed at Polish developers: prework lessons, regular course lessons, workshop materials, and related technical articles.

## Meta

- **Iteration:** 4
- **Sources:** prework lessons [1.2], [3.1] (iter 1–2) + main-course lesson m1-l4 (iter 3) + editorial-economy value filter (iter 4)
- **Last updated:** 2026-06-10

> Cross-cutting economy/adequacy/continuity rules live in
> [`references/editorial-contract.md`](./editorial-contract.md). This guide
> defers to that contract for the economy rule (asides must carry payload).

## Style Rules

### Educational Contextualization

#### Rule: Open with a bridge from the previous lesson OR a universal scenario

When the article is a clear continuation in a numbered sequence, open by referencing what the reader already covered in the previous lesson and pose a bridging question. When the article stands alone or opens a new section, simplify the scenario to a short universal pattern.

**Bridge example (iter 1):**
> W pierwszej lekcji naszego preworku przedstawiliśmy ci przykładowy workflow z AI na miarę 2026r. [...] No właśnie - ale jak nad tym wszystkim zapanować?

**Universal scenario example (iter 2):**
> Początki pracy z Agentami zawsze wyglądają tak samo - wklejasz potężny zrzut logów z błędem z produkcji i prosisz o naprawę pisząc prompta "zajmij się tym".

**How to apply:** Check whether the article follows a specific prior lesson. If yes, bridge. If no, write a 1–2 sentence universal pattern the reader recognizes. Never write a detailed multi-step cold-open scenario listing specific tools.

---

#### Rule: Wstęp without code snippets — recognition level only

The opening (Wstęp) operates at the pattern-recognition level: the reader should nod "that's my situation", not read a technical example. Code fragments, specific filenames, and error message formats belong in Core sections. Close the Wstęp with a short punchy sentence (3–5 words).

**Before (AI):**
> Wpisujesz jedno zdanie: "Dodaj obsługę błędów do endpointu POST /users". Agent chwilę pracuje i oddaje kod, który technicznie wygląda sensownie, ale omija trzy lokalne zasady naraz: zwraca `{ error: 'string' }` zamiast waszego formatu odpowiedzi, tworzy `usersHandler.ts` zamiast `users.handler.ts` i używa relative importów tam, gdzie cały projekt ma alias `@/`.

**After (Human):**
> Wpisujesz polecenie, agent pracuje, a po kilku chwilach oceniasz jego rezultat. Coś tu nie gra. Kod wygląda sensownie, ale my w zespole pracujemy inaczej. Obsługa błędów powinna być bardziej rozbudowana. Brakuje walidacji na API. Nawet nazewnictwo plików nie wszystkim odpowiada a do tego brakuje spójności. No dobra - tu poprawiam, tam poprawiam, znowu prompt i... znowu to samo. Poprawki. **Agent pracuje tobą.**

**How to apply:** If the Wstęp contains code, filenames, or specific error messages, replace with a narrative scenario. End with a 3–5 word punchy sentence.

---

#### Rule: Add forward references organically — not as closing summaries

When the article belongs to a larger learning path, weave 2–3 forward references into the prose as part of sentences. Do not write a dedicated closing paragraph with "Następny krok to X. W lekcji Y zbudujesz Z." — that reads as a promo, not a continuation.

**Organic (keep):**
> W module trzecim, poświęconym zapewnianiu jakości kodu, pogłębimy tę tematykę...

**Section-closing summary (remove):**
> Następny krok to outer loop. W m1-l5 zbudujesz CI/CD pipeline, który robi na poziomie brancha i PR-a to, co lokalny formatter robi przy pojedynczej edycji.

**How to apply:** Place forward references: (1) after introducing the main thesis, (2) after a complex subtopic, (3) within a concluding sentence — never as a standalone "next step" paragraph. Use the actual module or material name.

For 10xDevs-specific materials, the full program reference lives in `/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/.ai/10x-devs/course/10x-devs-spec.md`

---

#### Rule: Move research details to Deep Dive — keep only the implication in Core

Core should not contain paper names, author lists, percentage figures, or methodology descriptions. Extract those to the Deep Dive section and replace with a single practical sentence + forward reference.

**Before (AI — in Core):**
> W badaniu na OpenAI Codex, dla małych PR-ów do 100 linii kodu, dobrze użyty AGENTS.md skrócił medianowy czas wykonania o około 28% i zmniejszył liczbę tokenów wygenerowanych przez agenta o około 16%...

**After (Human — Core):**
> Szczegółowo opisują to dwa badania, które umieszczamy na końcu lekcji, w sekcji **Deep Dive / Materiały dodatkowe**. Na teraz potrzebujesz z nich jednego wniosku: (...)

**After (Human — Deep Dive):**
> W pierwszym badaniu przeprowadzonym na agencie OpenAI Codex, dla małych PR-ów do 100 linii kodu, dobrze użyty AGENTS.md skrócił medianowy czas wykonania zadania o około 28%...

**How to apply:** When AI places paper citations or percentages in Core, extract them. Write one implication sentence + "szczegóły w Deep Dive." Move the full evidence to Deep Dive.

---

#### Rule: Remove sections orthogonal to the lesson's main thesis

Every section should reinforce the same core argument. If a section gives process instructions for a scenario that isn't the lesson's primary skill, cut it or move it to a different lesson.

**Example (removed "Reset problematycznej konwersacji"):**
A lesson about onboarding the agent through AGENTS.md doesn't need a section on conversation hygiene (three-attempt rule, conversation-summary.md). That's a separate topic.

**How to apply:** Before finalizing, list all section headings and ask: "Does this section help the reader do the one thing this lesson teaches?" If no — it's a candidate for removal or extraction.

---

### Conversational Tone

#### Rule: Use casual asides, rhetorical questions, AND humor/irony to break density

Inject short interjections that acknowledge the reader's potential reaction. Include ironic/humorous one-liners that express mild sarcasm about unrealistic expectations.

**Examples:**
> Naprawde sporo pracy jak na jeden ticket!

> No właśli - ale jak nad tym wszystkim zapanować?

> Niestety - choć potencjał AI rośnie z miesiąca na miesiąc, to nadal nie jest magiczna różdżka.

> Zamiast AI-voo-doo, chcemy na te rozwiązania patrzeć okiem inżyniera.

> ...więcej, da radę!

**Value filter:** Every aside must carry information or set up a later payoff. The 3–4 target is a ceiling, not a quota to fill — cut any payload-free aside that exists only to perform voice. An informative or setup aside survives; a decorative one does not. See the Editorial Economy rule in [`references/editorial-contract.md`](./editorial-contract.md).

**How to apply:** After describing a complex process, insert a short (5–15 word) casual aside *when it adds payload*. Aim for at most 3–4 per article, never inserting one just to hit the count. Humor should be brief (3–8 words) and self-aware, not slapstick.

---

#### Rule: Use "ty/ci" (direct address) and "my/nasz" (inclusive we) — including reader-as-participant framing

Address the reader directly and use inclusive first-person plural. Reference the reader's role or context only when it is natural for the material.

**Examples:**
> ...jako uczestnik 10xDevs na pewno nie jesteś w pierwszej grupie, ale możesz być podatny na tę drugą skrajność

> W pierwszej lekcji naszego preworku przedstawiliśmy **ci** przykładowy workflow...

> ...gdzie powinniśmy się przygotować na asystowanie Agentowi...

**How to apply:** Use "ty/ci/Ciebie" for direct instructions and "my/nasz" for shared understanding. In cohort or course materials, you can reference participation ("jako uczestnik 10xDevs", "w tym module", "na tym etapie kursu") to build belonging. The reader should feel spoken *to*, not lectured *at*.

---

#### Rule: Use ellipsis for dramatic pause before punchlines

Insert `...` to create a comedic beat before a surprising result.

**Before (AI):**
> ...który po zaufanym i błyskawicznym wdrożeniu wywala resztę aplikacji.

**After (Human):**
> ...który po błyskawicznym wdrożeniu... wywala resztę aplikacji.

**How to apply:** When a sentence delivers an ironic result, insert `...` before the punchline. Use sparingly — once per article in the opening. Remove unnecessary adjectives before the pause to sharpen impact.

---

#### Rule: Limit emdash usage — prefer varied punctuation

AI-generated prose overuses emdashes (`—`) as a universal parenthetical separator. In Polish technical prose, prefer: periods for independent thoughts, commas for light asides, colons before explanations, ` - ` (hyphen with spaces) for restatements, parentheses for truly parenthetical info. Reserve emdashes for definition lists (`**term** — explanation`) and cases where no other punctuation fits naturally.

**Before (AI):**
> Zanim odpalisz `/10x-shape`, potrzebujesz kursowego CLI — narzędzia, które dostarcza skille i materiały do twojego projektu. Nie musisz go instalować globalnie — uruchamiasz je przez `npx` z tagiem `@latest`, żeby zawsze mieć najnowszą wersję.

**After (Human):**
> Zanim odpalisz `/10x-shape`, potrzebujesz kursowego CLI, czyli narzędzia, które dostarcza skille i materiały do twojego projektu. Nie musisz go instalować globalnie. Uruchamiasz je przez `npx` z tagiem `@latest`, żeby zawsze mieć najnowszą wersję.

**How to apply:** A lesson draft should not have more than ~1 prose emdash per 10 lines of text. When editing, look for sentences with two emdashes first — those are the worst offenders. Vary replacements across periods, commas, colons, hyphens, and parentheses instead of swapping all emdashes for one alternative.

---

### Acronym & Jargon Handling

#### Rule: Do not parenthetically expand well-known tech acronyms

Never expand acronyms that any working developer would know: CLI, JSON, API, HTML, CSS, FS, AST, XML, URL, HTTP, SDK, IDE, CI/CD, LLM. Only expand domain-specific or uncommon acronyms (e.g., OODA, MECW).

**Before (AI):**
> ...w twoim terminalu CLI (Command Line Interface)

> ...typowa struktura JSON (JavaScript Object Notation) zwracana poprzez Messages API (Application Programming Interface)

**After (Human):**
> ...w twoim terminalu CLI

> ...typowa struktura JSON zwracana poprzez Messages API

---

#### Rule: Replace heavy jargon with softer quoted alternatives in introductory material

In introductory educational content, if a concept requires a long inline definition, consider replacing it with a simpler everyday word in quotes.

**Before (AI):**
> **halucynacje** – czyli zmyślanie istnienia funkcji, flag konfiguracyjnych API czy odwoływanie się do nieistniejących zależności – nie są uciążliwym bugiem oprogramowania.

**After (Human):**
> wszelkie obserwowane po drodze "niedokładności" są nieodłączną właściwością systemu opartego na rozkładzie prawdopodobieństwa.

**How to apply:** Use `"quotedSimpleWord"` instead of `**TechnicalTerm** – (definition) –`. Reserve heavy terminology for later deep-dive lessons.

---

### Heading Style

#### Rule: Use simple, relatable headings — not thesis statements or contrasts

Write headings that are 3–8 words, use everyday vocabulary, and describe content rather than argue a thesis.

**Before (AI):**
> `## Przewidywanie, a nie rozumienie`

> `## Agent to nie wielki model – to autonomiczna pętla`

> `## Operator Agenta: nowa definicja programisty`

**After (Human):**
> `## Przewidywanie tokenów w praktyce`

> `## Agent to coś więcej niż ChatGPT`

> `## Nowa epoka programowania z AI`

**How to apply:** Avoid "X, not Y" contrasts and colon-separated definitions. Prefer content-descriptive or aspirational framing. Reference concepts the reader already knows (e.g., "ChatGPT" over "wielki model").

---

#### Rule: Don't use "Ćwiczenie:" label — use action/pattern framing

The "Ćwiczenie:" heading feels like a school assignment. Replace with a phrase that describes what the reader will test or discover.

**Before (AI):** `### Ćwiczenie: pięć wzorców instrukcji`

**After (Human):** `### Pięć wzorców do przetestowania`

**How to apply:** Grep `Ćwiczenie` in headings and replace with "Wzorce do przetestowania", "Co warto sprawdzić", "Jak to zrobić w praktyce", etc.

---

### Metaphor & Drama Restraint

#### Rule: Tone down dramatic or elaborate metaphors

Replace emotionally charged words and literary analogies with functional, precise descriptions.

**Before (AI):**
> ...wciąż traktujemy model jak młodszego programistę, który "ma gorszy dzień"

> ...bez kontrolnej obudowy chroniącej agenta przed zapętleniami i **niszczycielskim chaosem**

> ...warstwa uruchomieniowa, integracyjna oraz **policyjna**

**After (Human):**
> ...błędnego założenia o wszechpotężnym AI, które domyśli się naszych intencji

> ...bez kontrolnej obudowy chroniącej agenta przed zapętleniami i **błędnymi metodami używania narzędzi**

> ...warstwa uruchomieniowa, integracyjna oraz **konfiguracyjna**

**How to apply:** Describe what's actually happening, not literary analogies. The tone should be authoritative-technical, not epic-narrative. Replace emotionally charged words ("chaos", "niszczycielski", "policyjny") with precise technical descriptions.

---

### Sentence Structure

#### Rule: Break long paragraphs into shorter ones — max 3 sentences

After each complete idea, start a new paragraph. The human consistently split dense multi-sentence paragraphs (in one case, 1 paragraph of ~5 sentences was split into 5 separate paragraphs).

**Before (AI):**
> Chatbot działa w jednorazowej, statycznej pętli: dostarcza odpowiedź tekstową na podstawie jednego wejściowego promptu (input → LLM (Large Language Model) → output). Odbierasz odpowiedź i cykl życia chatbota się kończy. Cały ciężar egzekucji poleceń...

**After (Human):**
> Chatbot działa w jednorazowej, statycznej pętli: dostarcza kolejną wiadomość tekstową na podstawie jednego wejściowego promptu lub serii promptów (input → LLM → output).
>
> Odbierasz odpowiedź i cykl życia chatbota się kończy. Cały ciężar egzekucji poleceń...

**How to apply:** Break before shifts in perspective. A paragraph should rarely exceed 3 sentences in educational content. Single-sentence paragraphs are acceptable and encouraged for key statements.

---

#### Rule: Simplify complex noun phrases and clause chains

Untangle deeply nested subordinate clauses into simpler, more direct constructions.

**Before (AI):**
> Agent to aplikacja realizująca zachowanie sterowane przez LLM, która posiada własny mechanizm decyzyjny i własną sprawczość w twoim środowisku pracy.

**After (Human):**
> Agent to coś znacznie bardziej sprawczego i autonomicznego - to system sterowany przez LLM, która posiada własny mechanizm decyzyjny i bezpośredni wpływ na twoje środowisko pracy poprzez narzędzia (tool use).

**How to apply:** Replace uncommon/formal verbs with everyday ones. Prefer dash-separated restatements ("Agent to X - to system, który Y") over deeply embedded relative clauses. Add concrete parenthetical examples rather than abstract descriptors.

---

#### Rule: Connect "nie dlatego… dlatego…" into a single sentence — and prefer a personal rewrite over a mechanical join

When a contrast uses two separate sentences — a negative clause followed by a positive restatement — merge them. Prefer rewriting with a direct personal opener ("Pamiętaj, że…", "Chodzi o to, żebyś…", "Twoim celem jest…") over mechanically joining with "ale raczej". Reserve the simple conjunction join for cases where the original phrasing is otherwise strong.

**Before (AI):**
> Nie dlatego, że PRD jest magicznym dokumentem. Dlatego, że dobrze poprowadzona sesja wymusza decyzje, które samodzielnie bardzo łatwo ominąć.

**After (Human) — personal rewrite (preferred):**
> Nie dlatego, że PRD jest magicznym dokumentem, ale raczej dlatego, że dobrze poprowadzona sesja wymusza decyzje, które samodzielnie bardzo łatwo ominąć.

**How to apply:** When the pattern "Nie X. Y." appears, first try a personal rewrite — address the reader directly, name their actual goal, and frame the positive as what *they* get out of it. If the original phrasing is tight and the personal opener would feel forced, fall back to joining with "ale", "ale raczej", or "lecz".

---

#### Rule: Lead with what something IS — skip negative preambles

Go directly to the positive definition. Don't waste a sentence on what something ISN'T as a preamble.

**Before (AI):**
> ...w rzeczywistości nie wykonują one logicznej weryfikacji architektury. Wykonują one ciągłą, masywną operację **next-token prediction**

**After (Human):**
> ...wykonują one ciągłą, masywną operację **next-token prediction**

**How to apply:** When explaining a concept, go directly to what it IS. If the contrast is essential, fold it into the positive statement ("wykonują X, nie Y") rather than dedicating separate sentences to negation.

---

### Content Density

#### Rule: Simplify tool/feature lists — drop implementation details

In introductory content, describe capabilities at the action level ("explores, modifies, fetches data") not the implementation level ("FS manipulation, full-text search, AST evaluation").

**Before (AI):**
> **Konkretne narzędzia (tools)** – bezpieczne interfejsy operacyjne, dzięki którym agent eksploruje codebase i wprowadza zmiany (manipulacja FS (File System), głębokie wyszukiwanie pełnotekstowe w repozytorium czy automatyczna ewaluacja AST (Abstract Syntax Tree)).

**After (Human):**
> **Sprawdzone narzędzia (tools)** – bezpieczne metody, dzięki którym agent eksploruje codebase, modyfikuje go lub pobiera dane z sieci.

---

#### Rule: Keep bullet lists purposeful

Prefer short bullet lists when the section is a takeaway, summary, or closing rule set. Three concrete takeaways are often retained better than four diluted ones.

Do not force checklist sections to exactly 3 items. If the list is operational and each item changes what the reader can verify or do, keep the necessary points instead of merging them into vague bullets.

---

#### Rule: Use varied everyday dev examples instead of single technical ones

When illustrating a risk or pattern, give 2–3 brief parallel examples from different areas of daily development rather than one specific deep example.

**Before (AI):**
> Zmyślony fragment logiki może idealnie odwzorowywać konwencje nazewnicze `camelCase` twojego repozytorium, budując fałszywe poczucie perfekcji.

**After (Human):**
> Zmyślony fragment logiki może idealnie odwzorowywać konwencje nazewnicze, nowy endpoint może na pierwszy rzut oka wyglądać tak jak pozostałe, a nowy model danych może być "w sam raz", a na końcu i tak coś pójdzie nie tak.

**How to apply:** Give 2–3 brief parallel examples from naming, endpoints, data models, imports. Use colloquial closers ("w sam raz", "coś pójdzie nie tak").

---

#### Rule: Don't use tables for conceptual frameworks — only for lookup

Tables work as quick reference (what flag does what, which tool supports which feature). They don't work as explanations of why or when. If a table describes a taxonomy or decision matrix, replace with prose or remove.

**Example (removed table):**
A 5-row "Typ informacji / Przykład / Gdzie zwykle pasuje" matrix was cut and replaced with a shorter prose paragraph.

**How to apply:** When you see a table with columns like "Typ / Przykład / Gdzie pasuje", ask: will the reader use this as a lookup reference? If no — remove or rewrite as prose.

---

### Formatting

#### Rule: Label comparison diagrams with explicit evaluation

In Mermaid diagrams comparing two states or approaches, add `(źle)` / `(lepiej)` directly to node labels. Don't make the reader infer which approach is recommended.

**Before (AI):**
```
A["Prompt bez konfiguracji środowiska"]
B["Prompt we właściwym środowisku"]
```

**After (Human):**
```
A["Prompt bez konfiguracji środowiska (źle)"]
B["Prompt we właściwym środowisku (lepiej)"]
```

**How to apply:** Any diagram comparing two states — add `(źle)`/`(lepiej)` or `(bez X)`/`(z X)` to node labels.

---

#### Rule: Add a screenshot placeholder when describing tool UI or command output

When a sentence describes what a command shows or what a tool's interface looks like, follow it immediately with `![](./assets/filename.png)` — even if the asset doesn't exist yet.

**Before (AI):**
> Dobrze wizualizuje to polecenie `/context` w Claude Code — przy pierwszym uruchomieniu mamy już zajęte 22 tys. tokenów!

**After (Human):**
> Dobrze wizualizuje to polecenie `/context` w Claude Code — zwróć uwagę, że przy pierwszym uruchomieniu tego polecenia mamy już zajęte 22 tys. tokenów!
>
> `![](./assets/context.png)`

**How to apply:** Search for sentences containing "możesz zobaczyć", "jak to wygląda", "po wykonaniu", "wyświetli" — add a screenshot placeholder after each.

---

#### Rule: Include direct documentation links when listing multi-tool equivalents

When a section compares several tools and their equivalent feature (hooks, config files, integrations), include a direct documentation URL for each tool. Don't leave the reader to search.

**Before (AI):**
> Narzędzia takie jak Claude Code, Cursor czy Codex wspierają tzw. hooki

**After (Human):**
> - **Claude Code** - https://code.claude.com/docs/en/hooks
> - **Cursor** - https://cursor.com/docs/hooks
> - **Codex** - https://developers.openai.com/codex/hooks
> - **Cline** - https://docs.cline.bot/customization/hooks

**How to apply:** "X supports Y" → convert to a bullet list with links. Applies especially to hooks, per-tool config files, and IDE integrations.

---

### Concept Framing

#### Rule: Back recommendations with a mechanism, not just a guideline

Don't just state a practical rule ("keep the file short"). Add one sentence explaining WHY at the model or tool-mechanics level. That sentence is what makes the advice memorable and credible.

**Before (AI):**
> Claude Code dokumentuje też praktyczną granicę: CLAUDE.md powinien zwykle trzymać się około 200 linii na plik.

**After (Human):**
> Badania nad modelami językowymi opisują zjawisko `U-shaped attention`: modele poświęcają wyraźnie więcej uwagi treściom **na początku i na końcu kontekstu** niż tym w środku. Instrukcje zakopane głęboko w długim pliku... mają statystycznie mniejsze szanse na spójne przestrzeganie.

**How to apply:** For every practical configuration recommendation, add "dlatego, że model X" or "to dlatego, że Y" — one sentence on the mechanism behind the rule.

---

#### Rule: Cite a GitHub issue or community source for unexpected tool behavior

When the lesson describes surprising or undocumented tool behavior, link to a concrete community source (GitHub issue, PR comment, changelog entry) rather than stating the claim bare.

**Before (AI):**
> agent akurat o tym nie pamięta.

**After (Human):**
> w system prompcie Claude Code [znaleziono jakiś czas temu taką klauzulę](https://github.com/anthropics/claude-code/issues/18560):
> ```
> This context may or may not be relevant to your tasks.
> ```

**How to apply:** "Agent sometimes ignores instructions" → too vague. Replace with a specific issue link when one exists. "znaleziono jakiś czas temu" is acceptable framing for older discoveries.

---

#### Rule: Avoid introducing new job-title jargon — use aspirational framing

Don't coin role labels ("operator agenta"). Describe evolution in terms the reader already identifies with ("programista nowej generacji"). The goal is aspiration, not taxonomy.

---

#### Rule: Replace inline academic citations with organic knowledge flow

Don't cite papers inline. Present insights as established knowledge. When a source mention is kept (e.g., "Zespół OpenAI podkreśla"), keep it brief and reframe insights as practical implications for the reader. Keep references in a dedicated end section.

**Before (AI):**
> Jak piszą inżynierowie w tekście *Building effective agents* (Anthropic, 2024), największym nieporozumieniem jest definiowanie agentów poprzez modele...

**After (Human):**
> *(Inline citation removed — concept presented directly)*

---

#### Rule: Replace prescriptive labels with questions + next steps

Instead of "Praktyczny wniosek:" or "Podsumowując:", pose the conclusion as a question the reader is likely thinking, answer it briefly, and point to the next useful step. In course materials, that next step can be a later lesson or module.

**Before (AI):**
> Praktyczny wniosek: płynny i wysoce poprawny składniowo język... Weryfikacja kodu przez uruchomienie build pipeline...

**After (Human):**
> Czy można temu zapobiec? Tak, po części zdobywanym doświadczeniem i wyczuciem zachowania AI, a po części twardymi bramkami bezpieczeństwa i kontrolą kontekstu, czyli technikach, o których nauczysz się w 10xDevs.

**How to apply:** Pose conclusions as rhetorical questions, answer briefly, then point to a concrete next step: a later course module, a follow-up lesson, an exercise, or a practical verification method.

---

#### Rule: Soften certainty in recommendation lists

"Należą" in a list of recommendations reads as a mandate. Replace with "mogą należeć", "warto rozważyć", "dobrze sprawdzają się". Reserve firm language for hard constraints (e.g., forbidden patterns in a security context).

**Before (AI):** `Do AGENTS.md albo CLAUDE.md **należą**:`

**After (Human):** `Do AGENTS.md albo CLAUDE.md **mogą należeć**:`

**How to apply:** Grep "należy/należą/musisz" in recommendation lists → soften to "warto/można/powinno/mogą".

---

### Section Naming

#### Rule: Use "Materiały dodatkowe" not "Źródła" for the references section

Label the references section as "Materiały dodatkowe" (supplementary materials), not "Źródła" (sources). This frames them as optional further reading rather than academic bibliography, matching the tone of practical educational content.

---

## Summary Statistics

- Total changes observed: ~120 across three iterations
- Rules extracted: 29 total
- Categories: Educational Contextualization, Conversational Tone, Acronym & Jargon Handling, Heading Style, Metaphor & Drama Restraint, Sentence Structure, Content Density, Formatting, Concept Framing, Section Naming
- New in iter 3: 10 | Confirmed from iter 2: 16 | Refined from iter 2: 3

---

## Application Checklist

Ordered by impact (most frequently observed patterns first):

1. [ ] Break paragraphs after each complete idea — max 3 sentences
2. [ ] Use casual asides, rhetorical questions, AND humor/irony (≤3–4 per article; each must carry payload — cut payload-free asides)
3. [ ] Wstęp: no code snippets or filenames — recognition-level narrative only; close with a 3–5 word punchy sentence
4. [ ] Move research paper details (numbers, authors, methodology) to Deep Dive; keep 1-sentence implication in Core
5. [ ] Forward references: organic and woven in — never as a standalone "Następny krok to..." paragraph
6. [ ] Remove sections that are orthogonal to the lesson's main thesis
7. [ ] Teach transferable concepts first, use tool-specific details as illustrations
8. [ ] Do not expand well-known tech acronyms (CLI, JSON, API, etc.)
9. [ ] Write headings as 3–8 word descriptive phrases, not thesis statements or contrasts
10. [ ] Don't use "Ćwiczenie:" label — use "Wzorce do przetestowania" or action framing
11. [ ] Replace heavy jargon with simpler quoted alternatives in introductory material
12. [ ] Lead with what something IS — skip negative preambles
13. [ ] Merge "Nie dlatego… Dlatego…" two-sentence contrasts into one sentence
14. [ ] Don't use tables for conceptual frameworks — only for lookup reference
15. [ ] Label comparison diagrams with "(źle)" / "(lepiej)"
16. [ ] Add screenshot placeholder after any sentence describing tool UI or command output
17. [ ] Include direct doc links when listing multi-tool equivalents (hooks, config files)
18. [ ] Back recommendations with a mechanism sentence ("dlatego, że model X...")
19. [ ] Cite GitHub issue or community source for unexpected tool behavior
20. [ ] Use varied everyday dev examples (2–3) instead of single specific ones
21. [ ] Replace dramatic metaphors with functional, precise descriptions
22. [ ] Address reader directly (ty/ci) and reference their learning context only when natural
23. [ ] Use ellipsis for dramatic pause before punchlines (once in opening)
24. [ ] Replace prescriptive labels ("Praktyczny wniosek:") with rhetorical question + next step
25. [ ] Open with bridge from previous lesson (when in series) or universal scenario (when standalone)
26. [ ] Keep takeaway bullet lists short, but allow longer operational checklists when each item is useful
27. [ ] Simplify tool/feature descriptions to action level
28. [ ] Soften "należy/musisz" → "warto/można/powinno" in recommendation lists
29. [ ] Don't coin new job-title jargon — use aspirational framing
30. [ ] Remove inline academic citations — present knowledge directly
31. [ ] Label references as "Materiały dodatkowe", not "Źródła"
