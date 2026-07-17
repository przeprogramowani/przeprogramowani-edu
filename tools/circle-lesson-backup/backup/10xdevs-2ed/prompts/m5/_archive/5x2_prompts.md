---
title: "MCP Server Planning"
description: "Analyzes project requirements and generates comprehensive planning questions and recommendations for MCP server architecture including tools, resources, data schemas, and deployment strategy."
collection: m5-innovation
segment: l2-mcp
sort-order: 0
status: published
---

Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu narzędzi, zasobów, promptów i ogólnej struktury serwera MCP (Model Context Protocol) dla MVP serwera MCP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do zaimplementowania serwera MCP, jego narzędzi oraz logiki.

Prosimy o uważne zapoznanie się z poniższymi informacjami:


<tech_stack>
{{tech-stack}}

</tech_stack>

Przeanalizuj dostarczone informacje, koncentrując się na aspektach istotnych dla projektowania serwera MCP. Rozważ następujące kwestie:

1.  Zidentyfikuj kluczowe narzędzia (Tools), zasoby (Resources) i/lub prompty (Prompts) wymagane przez produkt. Jakie konkretne funkcjonalności serwer ma udostępniać?
2.  Określ wejścia (inputs) i wyjścia (outputs) dla każdego zidentyfikowanego narzędzia/zasobu/promptu. Jakie dane są potrzebne do ich wykonania i co powinny zwracać?
3.  Rozważ potrzebę i sposób definicji schematów dla walidacji danych wejściowych i wyjściowych (np. przy użyciu biblioteki Zod, jak w naszym projekcie).
4.  Pomyśl o źródłach danych potrzebnych dla narzędzi – skąd będą pobierane informacje (np. statyczne pliki JSON jak `preparedRules.json`, zewnętrzne API, bazy danych)?
5.  Oceń wymagania dotyczące bezpieczeństwa i autentykacji serwera MCP. Czy dostęp do narzędzi powinien być ograniczony? (Nasz obecny przykład jest bez autentykacji).
6.  Rozważ wszelkie specyficzne funkcje wybranego frameworka/SDK MCP (np. `@modelcontextprotocol/sdk/server/mcp.js`) oraz środowiska wdrożeniowego (np. Cloudflare Workers), które mogą wpłynąć na projekt lub implementację.
7.  Zastanów się nad wymaganą strukturą odpowiedzi z narzędzi, aby była kompatybilna z klientami MCP i wykorzystywanym SDK (np. czy konieczne jest opakowanie wyniku w `{ content: [...] }`?).
8.  Rozważ strategię obsługi błędów – jak błędy wykonania narzędzi lub walidacji danych będą komunikowane klientowi?

Na podstawie analizy wygeneruj listę pytań i zaleceń. Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby efektywnie zaprojektować i zaimplementować serwer MCP. Rozważ pytania dotyczące:

1.  Szczegółów implementacji poszczególnych narzędzi/zasobów/promptów.
2.  Dokładnego formatu i schematów danych wejściowych/wyjściowych.
3.  Sposobu interakcji ze źródłami danych.
4.  Oczekiwanej struktury odpowiedzi dla klienta MCP (np. zawartość pola `content`).
5.  Wymagań dotyczących autentykacji i autoryzacji (jeśli dotyczy).
6.  Szczegółowej obsługi błędów i formatu komunikatów.
7.  Strategii testowania serwera i jego narzędzi (np. przy użyciu narzędzi takich jak `npx @modelcontextprotocol/inspector@latest`).
8.  Kwestii skalowalności i wydajności (np. obsługa długo działających narzędzi, cachowanie).
9.  Potrzeby zarządzania stanem po stronie serwera (jeśli wymagane).

Dane wyjściowe powinny mieć następującą strukturę:

<mcp_server_planning_output>

<pytania>

[Wymień tutaj swoje pytania, ponumerowane]

</pytania>

<rekomendacje>

[Wymień tutaj swoje zalecenia, ponumerowane]

</rekomendacje>

</mcp_server_planning_output>

Pamiętaj, że Twoim celem jest dostarczenie kompleksowej listy pytań i zaleceń, które pomogą w stworzeniu solidnego i funkcjonalnego serwera MCP dla MVP. Skoncentruj się na jasności, trafności i dokładności swoich wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o przekazany kontekst i odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.



---
title: "MCP Implementation Plan Creation"
description: "Creates detailed technical implementation plan for MCP server including file structure, module definitions, Zod schemas, data providers, error handling, and testing strategy based on planning session notes."
collection: m5-innovation
segment: l2-mcp
sort-order: 1
status: published
---

Jesteś **architektem oprogramowania**, którego zadaniem jest stworzenie **planu implementacji serwera MCP (Model Context Protocol)** na podstawie informacji dostarczonych z sesji planowania, dokumentu wymagań produktu (PRD) i stacku technologicznego. Twoim celem jest zaprojektowanie klarownego i efektywnego planu implementacji, który spełnia wymagania projektu i wykorzystuje wybrane technologie.

<session_notes>
{{session-notes}}

</session_notes>

Jest to podsumowanie sesji planowania serwera MCP. Zawiera ono kluczowe decyzje, rozważania, zidentyfikowane narzędzia/zasoby/prompty, ich schematy oraz specyficzne wymagania omówione podczas planowania.

<tech_stack>
{{tech-stack}}

</tech_stack>

Opisuje stack technologiczny, który zostanie wykorzystany w projekcie (np. Node.js, TypeScript, Cloudflare Workers, `@modelcontextprotocol/sdk/server/mcp.js`, Zod), co może wpłynąć na decyzje implementacyjne.

Wykonaj następujące kroki, aby utworzyć plan implementacji serwera MCP:

1.  Dokładnie przeanalizuj **podsumowanie sesji planowania (`<session_notes>`)**, identyfikując kluczowe narzędzia, zasoby, prompty, ich schematy, źródła danych, strukturę odpowiedzi i strategię obsługi błędów.
2.  Przeanalizuj **stack technologiczny (`<tech_stack>`)** i upewnij się, że plan implementacji jest zoptymalizowany pod kątem wybranych technologii i ich najlepszych praktyk (np. wykorzystanie Zod do walidacji, asynchroniczność w Cloudflare Workers).

4.  Stworzenie **kompleksowego planu implementacji serwera MCP**, który obejmuje:
    a.  Proponowaną **strukturę plików i katalogów** dla projektu serwera MCP.
    b.  Określenie **kluczowych modułów/plików** do utworzenia lub modyfikacji (np. `index.ts`, `tools/rulesTools.ts`, `data/rulesProvider.ts`).
    c.  Szczegółowe **definicje dla każdego Narzędzia/Zasobu/Promptu**:
        *   Nazwa, opis.
        *   Schematy wejściowe i wyjściowe (np. w składni Zod).
        *   Wysokopoziomowy opis logiki funkcji `execute`, w tym interakcje ze źródłami danych, przetwarzanie i obsługa błędów.
        *   Sposób opakowania wyniku dla SDK MCP (np. `{ content: [...] }`).
    d.  Plan implementacji **dostawców danych** lub modułów interakcji z zewnętrznymi API/bazami.
    e.  Szczegóły **konfiguracji instancji serwera MCP** (np. w `new McpServer(...)`).
    f.  Konkretne założenia dotyczące implementacji **strategii obsługi błędów**.
    g.  Zarys **strategii testowania** (np. testy jednostkowe dla logiki narzędzi, testy integracyjne z użyciem inspektora MCP).

5.  Opisz proces **rejestracji narzędzi** w głównym pliku serwera (np. w metodzie `init()`), uwzględniając wymagania SDK dotyczące przekazywania schematów i callbacków.

6.  Zidentyfikuj wszelkie niezbędne wpisy w pliku **konfiguracyjnym środowiska wdrożeniowego** (np. `wrangler.jsonc`) lub wymagane zmienne środowiskowe/sekrety.

7.  Upewnij się, że plan jest zgodny z **najlepszymi praktykami** dla wybranego frameworka (np. Cloudflare Workers, SDK MCP) i języka (TypeScript), w tym obsługi asynchroniczności, zarządzania zależnościami i czytelności kodu.

Ostateczny wynik powinien mieć następującą strukturę (w formacie Markdown):

```markdown
### Plan Implementacji Serwera MCP

#### 1. Struktura Projektu
   - [Zarys proponowanej struktury katalogów i plików]

#### 2. Kluczowe Moduły
   - **`src/index.ts`**:
       - [Opis inicjalizacji McpServer, rejestracji narzędzi, obsługi fetch]
   - **`src/tools/` (lub `src/tools/rulesTools.ts`)**:
       - [Opis zawartości modułu/modułów z narzędziami]
   - **`src/data/` (lub `src/data/rulesProvider.ts`)**:
       - [Opis zawartości modułu/modułów dostawcy danych]
   - **Inne (np. `src/types.ts`)**:
       - [Opis innych potrzebnych modułów]

#### 3. Definicje Narzędzi/Zasobów/Promptów
   - **Narzędzie: `[nazwa_narzędzia_1]`**
       - Opis: `[Opis narzędzia]`
       - Schemat Wejściowy (Zod): `[Definicja schematu Zod]`
       - Schemat Wyjściowy (Zod): `[Definicja schematu Zod]`
       - Logika `execute`: `[Kroki implementacji, interakcje, obsługa błędów]`
       - Opakowanie Wyniku dla SDK: `[Przykładowa struktura, np. { content: [...] }]`
   - **Narzędzie: `[nazwa_narzędzia_2]`**
       - ... (jak wyżej)
   - ... (dla wszystkich narzędzi/zasobów/promptów)

#### 4. Obsługa Danych
   - [Opis sposobu dostępu i przetwarzania danych, np. z preparedRules.json]

#### 5. Konfiguracja Serwera i Wdrożenia
   - Konfiguracja `McpServer`: `[Ustawienia w new McpServer(...)]`
   - Konfiguracja `wrangler.jsonc` / `wrangler.toml`: `[Wymagane ustawienia]`
   - Zmienne Środowiskowe / Sekrety: `[Lista wymaganych zmiennych]`

#### 6. Obsługa Błędów
   - [Opis strategii implementacji obsługi błędów i formatu komunikatów]

#### 7. Strategia Testowania
   - Testy Jednostkowe: `[Podejście do testowania logiki narzędzi/danych]`
   - Testy Integracyjne: `[Plan wykorzystania np. @modelcontextprotocol/inspector]`

#### 8. Dodatkowe Uwagi
   - [Wszelkie inne istotne uwagi, potencjalne ryzyka, decyzje projektowe]
```

W odpowiedzi należy podać **tylko ostateczny plan implementacji serwera MCP w formacie markdown**, który zapiszesz w pliku `.ai/mcp-implementation-plan.md`, bez uwzględniania procesu myślowego lub kroków pośrednich. Upewnij się, że plan jest kompleksowy, dobrze zorganizowany i gotowy do wykorzystania jako przewodnik podczas implementacji serwera MCP.



---
title: "MCP Server Implementation"
description: "Implements complete MCP server following the technical plan with TypeScript, Cloudflare Workers, and proper tool registration, data handling, validation, and error management."
collection: m5-innovation
segment: l2-mcp
sort-order: 2
status: published
---

Twoim zadaniem jest zaimplementowanie **serwera MCP (Model Context Protocol)** w oparciu o podany plan implementacji i zasady implementacji. Twoim celem jest stworzenie szczegółowej i dokładnej implementacji, która jest zgodna z dostarczonym planem, poprawnie definiuje narzędzia, obsługuje logikę i komunikuje się zgodnie z protokołem MCP.

Najpierw przejrzyj plan implementacji:
<implementation_plan>
{{implementation-plan}} <!-- Wstaw tutaj referencję do pliku .ai/mcp-implementation-plan.md -->

Utwórz/zmodyfikuj kod serwera w lokalizacji: {{sciezka}} <!-- Określ ścieżkę bazową, np. mcp-server/src -->
</implementation_plan>

Teraz przejrzyj zasady implementacji:
<implementation_rules>
{{implementation-rules}} <!-- Wstaw tutaj referencję do odpowiednich zasad implementacji (np. dotyczących TypeScript, Cloudflare Workers, Zod, itp.) -->
</implementation_rules>

Wdrażaj plan zgodnie z następującym podejściem:
<implementation_approach>
Realizuj maksymalnie 3 kroki planu implementacji (np. zdefiniowanie struktury, implementacja jednego modułu, implementacja jednego narzędzia). Po każdej grupie kroków podsumuj krótko, co zostało zrobione i opisz plan na 3 kolejne działania. Zatrzymaj w tym momencie pracę i czekaj na mój feedback przed kontynuacją.
</implementation_approach>

Dokładnie przeanalizuj plan implementacji i zasady. Zwróć szczególną uwagę na strukturę projektu, definicję narzędzi, implementację logiki `execute`, schematy Zod, interakcję ze źródłami danych, obsługę błędów oraz sposób rejestracji narzędzi w SDK MCP.

Wykonaj następujące kroki, aby zaimplementować serwer MCP:

1.  **Struktura Projektu i Główny Plik Serwera:**
    *   Utwórz lub zmodyfikuj pliki i katalogi w lokalizacji `{{sciezka}}` zgodnie ze strukturą opisaną w planie.
    *   W głównym pliku serwera (np. `index.ts`), zdefiniuj klasę `MyMCP` (lub inną zgodną z planem) rozszerzającą `McpAgent`.
    *   Zaimplementuj inicjalizację instancji `McpServer` z odpowiednią nazwą i wersją.

2.  **Implementacja Modułów Narzędzi:**
    *   Utwórz lub zmodyfikuj pliki zawierające definicje narzędzi (np. `tools/rulesTools.ts`).
    *   Dla każdego narzędzia zdefiniuj obiekt eksportowany zawierający `name`, `description`.
    *   Zaimplementuj schematy Zod (`inputSchema`, `outputSchema`) zgodnie ze specyfikacją w planie.

3.  **Implementacja Logiki Narzędzi (`execute`):**
    *   Dla każdego narzędzia zaimplementuj asynchroniczną funkcję `execute`.
    *   Zaimplementuj logikę biznesową opisaną w planie, w tym interakcję z modułami danych (np. `rulesProvider`).
    *   Zapewnij walidację danych wejściowych (jeśli nie jest w pełni obsługiwana przez SDK) i wyjściowych (np. używając `outputSchema.safeParse`).

4.  **Implementacja Dostawców Danych:**
    *   Utwórz lub zmodyfikuj moduły odpowiedzialne za dostarczanie danych (np. `data/rulesProvider.ts`).
    *   Zaimplementuj funkcje zgodnie z planem (np. odczyt i udostępnianie danych z `preparedRules.json`).

5.  **Rejestracja Narzędzi w `init()`:**
    *   W metodzie `init()` klasy `MyMCP`, dla każdego narzędzia wywołaj `this.server.tool()`.
    *   Przekaż odpowiednie argumenty zgodnie z wymaganiami SDK (nazwa, schemat/opis, funkcja callback).
    *   Wewnątrz funkcji callback, wywołaj odpowiednią funkcję `execute` narzędzia.
    *   Opakuj wynik z `execute` w strukturę oczekiwaną przez SDK (np. `{ content: [{ type: 'text', text: JSON.stringify(result) }] }`), zgodnie z ustaleniami w planie.

6.  **Obsługa Błędów:**
    *   Zaimplementuj obsługę błędów w funkcjach `execute` (np. `try...catch`, zwracanie obiektu błędu zgodnego ze schematem `outputSchema`).
    *   Obsłuż błędy walidacji (wejścia/wyjścia).
    *   Zapewnij, że błędy są odpowiednio formatowane w odpowiedzi dla SDK (np. ustawiając `isError: true` w odpowiedzi callbacka, jeśli SDK to wspiera).

7.  **Typowanie i Dokumentacja:**
    *   Zastosuj silne typowanie TypeScript w całym kodzie.
    *   Dodaj komentarze JSDoc/TSDoc wyjaśniające działanie kluczowych fragmentów kodu, zwłaszcza logiki narzędzi i schematów.

8.  **Testowanie:**
    *   Zorganizuj kod w sposób modułowy, ułatwiający testowanie jednostkowe logiki narzędzi i dostawców danych.

W trakcie całego procesu implementacji należy ściśle przestrzegać dostarczonych zasad implementacji (`<implementation_rules>`). Mają one pierwszeństwo przed ogólnymi najlepszymi praktykami, które mogą być z nimi sprzeczne.

Upewnij się, że Twoja implementacja dokładnie odzwierciedla dostarczony plan implementacji (`<implementation_plan>`) i przestrzega wszystkich określonych zasad. Zwróć szczególną uwagę na poprawną definicję i rejestrację narzędzi, implementację ich logiki, obsługę danych i błędów oraz zgodność ze specyfiką SDK MCP. Implementuj kod iteracyjnie zgodnie z `<implementation_approach>`.


