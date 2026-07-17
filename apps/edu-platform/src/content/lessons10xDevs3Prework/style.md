# Writing Style Guide

General rules for written educational content aimed at Polish developers: prework lessons, regular course lessons, workshop materials, and related technical articles.

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

#### Rule: Add forward references to upcoming material when relevant

When the article belongs to a larger learning path, add 2–3 forward references signaling that topics will be explored in depth later. These can serve as mid-section teasers or section conclusions. For standalone articles, skip course teasers and use a practical next step instead.

**Examples from 10xDevs:**
> Wszystkie te zagadnienia poznasz dokładnie na przekroju całego 10xDevs, ale w formie lekkiego wprowadzenia przeanalizujemy to już teraz.

> W trakcie 10xDevs nauczysz się również jak dbać o ten budżet i jak przepala się go w nieświadomy sposób.

> ...technikach, o których nauczysz się w 10xDevs.

**How to apply:** Place forward references: (1) after introducing the main thesis, (2) after a complex subtopic, (3) before the closing section. They lower article density and build anticipation. Use the actual program, module, or material name instead of defaulting to a specific course brand.

For 10xDevs-specific materials, the full program reference lives in `/Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/.ai/10x-devs/course/10x-devs-spec.md`

---

### Conversational Tone

#### Rule: Use casual asides, rhetorical questions, AND humor/irony to break density

Inject short interjections that acknowledge the reader's potential reaction. Include ironic/humorous one-liners that express mild sarcasm about unrealistic expectations.

**Examples:**
> Naprawde sporo pracy jak na jeden ticket!

> No właśnie - ale jak nad tym wszystkim zapanować?

> Niestety - choć potencjał AI rośnie z miesiąca na miesiąc, to nadal nie jest magiczna różdżka.

> Zamiast AI-voo-doo, chcemy na te rozwiązania patrzeć okiem inżyniera.

> ...więcej, da radę!

**How to apply:** After describing a complex process, insert a short (5–15 word) casual aside. Aim for 3–4 per article. Humor should be brief (3–8 words) and self-aware, not slapstick.

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

> model asertywnie informuje o 2 milionach limitu tokenów nie definiuje absolutnie faktu

**After (Human):**
> Agent to coś znacznie bardziej sprawczego i autonomicznego - to system sterowany przez LLM, która posiada własny mechanizm decyzyjny i bezpośredni wpływ na twoje środowisko pracy poprzez narzędzia (tool use).

> model informuje o dostępnych 2 milionach tokenów okna nie oznacza absolutnie faktu

**How to apply:** Replace uncommon/formal verbs with everyday ones. Prefer dash-separated restatements ("Agent to X - to system, który Y") over deeply embedded relative clauses. Add concrete parenthetical examples rather than abstract descriptors.

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

### Concept Framing

#### Rule: Avoid introducing new job-title jargon — use aspirational framing

Don't coin role labels ("operator agenta"). Describe evolution in terms the reader already identifies with ("programista nowej generacji"). The goal is aspiration, not taxonomy.

---

#### Rule: Replace inline academic citations with organic knowledge flow

Don't cite papers inline. Present insights as established knowledge. When a source mention is kept (e.g., "Zespół OpenAI podkreśla"), keep it brief and reframe insights as practical implications for the reader. Keep references in a dedicated end section.

**Before (AI):**
> Jak piszą inżynierowie w tekście *Building effective agents* (Anthropic, 2024), największym nieporozumieniem jest definiowanie agentów poprzez modele...

> Zespół OpenAI wprost podkreśla w swoich analizach z jesieni 2025 roku dotyczących mechaniki halucynacji: sama architektura treningowa bezwzględnie promuje gładkość, pewność siebie oraz gramatyczną płynność...

**After (Human):**
> *(Inline citation removed — concept presented directly)*

> Zespół OpenAI wprost podkreśla w swoich analizach z jesieni 2025: model jest tak skalibrowany, aby zawsze wyprodukować najbezpieczniejszy dalszy ciąg tekstu lub kodu, ale niekoniecznie w 100% dopasowany do twoich unikalnych preferencji.

---

#### Rule: Replace prescriptive labels with questions + next steps

Instead of "Praktyczny wniosek:" or "Podsumowując:", pose the conclusion as a question the reader is likely thinking, answer it briefly, and point to the next useful step. In course materials, that next step can be a later lesson or module.

**Before (AI):**
> Praktyczny wniosek: płynny i wysoce poprawny składniowo język... Weryfikacja kodu przez uruchomienie build pipeline, zapięcie mocnych asercji w testach...

**After (Human):**
> Czy można temu zapobiec? Tak, po części zdobywanym doświadczeniem i wyczuciem zachowania AI, a po części twardymi bramkami bezpieczeństwa i kontrolą kontekstu, czyli technikach, o których nauczysz się w 10xDevs.

**How to apply:** Pose conclusions as rhetorical questions, answer briefly, then point to a concrete next step: a later course module, a follow-up lesson, an exercise, or a practical verification method. This avoids the lecture-hall tone and builds curiosity.

---

### Section Naming

#### Rule: Use "Materiały dodatkowe" not "Źródła" for the references section

Label the references section as "Materiały dodatkowe" (supplementary materials), not "Źródła" (sources). This frames them as optional further reading rather than academic bibliography, matching the tone of practical educational content.

---

## Application Checklist

Ordered by impact (most frequently observed patterns first):

1. [ ] Break paragraphs after each complete idea — max 3 sentences
2. [ ] Use casual asides, rhetorical questions, AND humor/irony (3–4 per article)
3. [ ] Simplify opening scenarios to universal patterns — don't list specific tools/steps
4. [ ] Add 2–3 forward references to upcoming material when the article belongs to a larger learning path
5. [ ] Do not expand well-known tech acronyms (CLI, JSON, API, etc.)
6. [ ] Write headings as 3–8 word descriptive phrases, not thesis statements or contrasts
7. [ ] Replace heavy jargon with simpler quoted alternatives in introductory material
8. [ ] Lead with what something IS — skip negative preambles
9. [ ] Use varied everyday dev examples (2–3) instead of single specific ones
10. [ ] Replace dramatic metaphors with functional, precise descriptions
11. [ ] Address reader directly (ty/ci) and reference their learning context only when natural
12. [ ] Use ellipsis for dramatic pause before punchlines (once in opening)
13. [ ] Replace prescriptive labels ("Praktyczny wniosek:") with rhetorical question + next step
14. [ ] Open with bridge from previous lesson (when in series) or universal scenario (when standalone)
15. [ ] Keep takeaway bullet lists short, but allow longer operational checklists when each item is useful
16. [ ] Simplify tool/feature descriptions to action level
17. [ ] Don't coin new job-title jargon — use aspirational framing
18. [ ] Remove inline academic citations — present knowledge directly
19. [ ] Label references as "Materiały dodatkowe", not "Źródła"
