-- =====================================================
-- 10xDevs M5 (Innovation) Prompts Seed File
-- Generated: 2025-10-26T11:06:10.813Z
-- Total prompts: 3
-- =====================================================

DO $$
DECLARE
    v_org_id UUID;
    v_collection_id UUID;
    v_segment_l2_mcp_id UUID;
BEGIN
    -- =====================================================
    -- 1. Get organization ID
    -- =====================================================
    SELECT id INTO v_org_id FROM organizations WHERE slug = '10xdevs';

    IF v_org_id IS NULL THEN
        RAISE EXCEPTION 'Organization 10xdevs not found';
    END IF;

    RAISE NOTICE 'Found organization: %', v_org_id;

    -- =====================================================
    -- 2. Insert/Update Collection: m5-innovation
    -- =====================================================
    INSERT INTO prompt_collections (
        organization_id,
        slug,
        title,
        description,
        sort_order
    ) VALUES (
        v_org_id,
        'm5-innovation',
        'M5 Innovation',
        'Extending AI capabilities through llms.txt documentation, Model Context Protocol (MCP) servers, AI agents in CI/CD pipelines, and model evaluation frameworks for AI-assisted development',
        5
    )
    ON CONFLICT (organization_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_collection_id;

    RAISE NOTICE 'Collection m5-innovation: %', v_collection_id;

    -- =====================================================
    -- 3. Insert/Update Segments
    -- =====================================================
    -- Segment: l2-mcp
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l2-mcp',
        'Model Context Protocol',
        1
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l2_mcp_id;

    -- =====================================================
    -- 4. Delete existing prompts for this collection
    -- =====================================================
    DELETE FROM prompts
    WHERE collection_id = v_collection_id;

    RAISE NOTICE 'Deleted existing prompts for collection m5-innovation';

    -- =====================================================
    -- 5. Insert Prompts
    -- =====================================================
    -- Prompt 1/3: MCP Server Planning
    INSERT INTO prompts (
        organization_id,
        collection_id,
        segment_id,
        title_en,
        title_pl,
        description_en,
        description_pl,
        markdown_body_en,
        markdown_body_pl,
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l2_mcp_id,
        'MCP Server Planning',
        'Planowanie Serwera MCP',
        'Analyzes project requirements and generates comprehensive planning questions and recommendations for MCP server architecture including tools, resources, data schemas, and deployment strategy.',
        'Analizuje wymagania projektu i generuje kompleksowe pytania planistyczne oraz rekomendacje dotyczące architektury serwera MCP, w tym narzędzi, zasobów, schematów danych i strategii wdrożenia.',
        $prompt1$You are an AI assistant whose task is to help plan the tools, resources, prompts, and overall structure of an MCP (Model Context Protocol) server for an MCP server MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to implement the MCP server, its tools, and logic.

Please carefully review the following information:


<tech_stack>
{{tech-stack}}

</tech_stack>

Analyze the provided information, focusing on aspects relevant to MCP server design. Consider the following issues:

1.  Identify key tools (Tools), resources (Resources), and/or prompts (Prompts) required by the product. What specific functionalities should the server provide?
2.  Specify inputs and outputs for each identified tool/resource/prompt. What data is needed for their execution and what should they return?
3.  Consider the need for and method of defining schemas for input and output data validation (e.g., using the Zod library, as in our project).
4.  Think about data sources needed for the tools – where will information be retrieved from (e.g., static JSON files like `preparedRules.json`, external APIs, databases)?
5.  Assess security requirements and MCP server authentication. Should access to tools be restricted? (Our current example is without authentication).
6.  Consider any specific features of the chosen MCP framework/SDK (e.g., `@modelcontextprotocol/sdk/server/mcp.js`) and deployment environment (e.g., Cloudflare Workers) that may affect the design or implementation.
7.  Think about the required response structure from tools to be compatible with MCP clients and the SDK being used (e.g., is it necessary to wrap the result in `{ content: [...] }`?).
8.  Consider the error handling strategy – how will tool execution errors or data validation errors be communicated to the client?

Based on the analysis, generate a list of questions and recommendations. These should address any ambiguities, potential issues, or areas where more information is needed to effectively design and implement the MCP server. Consider questions regarding:

1.  Implementation details of individual tools/resources/prompts.
2.  Exact format and schemas of input/output data.
3.  Method of interaction with data sources.
4.  Expected response structure for the MCP client (e.g., content field contents).
5.  Authentication and authorization requirements (if applicable).
6.  Detailed error handling and message format.
7.  Testing strategy for the server and its tools (e.g., using tools such as `npx @modelcontextprotocol/inspector@latest`).
8.  Scalability and performance issues (e.g., handling long-running tools, caching).
9.  Need for state management on the server side (if required).

The output should have the following structure:

<mcp_server_planning_output>

<pytania>

[List your questions here, numbered]

</pytania>

<rekomendacje>

[List your recommendations here, numbered]

</rekomendacje>

</mcp_server_planning_output>

Remember that your goal is to provide a comprehensive list of questions and recommendations that will help create a solid and functional MCP server for the MVP. Focus on clarity, relevance, and accuracy of your results. Do not include any additional comments or explanations beyond the specified output format.

Continue this process, generating new questions and recommendations based on the provided context and user responses, until the user explicitly requests a summary.$prompt1$,
        $prompt2$Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu narzędzi, zasobów, promptów i ogólnej struktury serwera MCP (Model Context Protocol) dla MVP serwera MCP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do zaimplementowania serwera MCP, jego narzędzi oraz logiki.

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

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o przekazany kontekst i odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.$prompt2$,
        0,
        'published',
        NULL
    );

    -- Prompt 2/3: MCP Implementation Plan Creation
    INSERT INTO prompts (
        organization_id,
        collection_id,
        segment_id,
        title_en,
        title_pl,
        description_en,
        description_pl,
        markdown_body_en,
        markdown_body_pl,
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l2_mcp_id,
        'MCP Implementation Plan Creation',
        'Tworzenie Planu Implementacji MCP',
        'Creates detailed technical implementation plan for MCP server including file structure, module definitions, Zod schemas, data providers, error handling, and testing strategy based on planning session notes.',
        'Tworzy szczegółowy techniczny plan implementacji serwera MCP, w tym strukturę plików, definicje modułów, schematy Zod, dostawców danych, obsługę błędów i strategię testowania w oparciu o notatki z sesji planowania.',
        $prompt3$You are a **software architect** whose task is to create an **MCP (Model Context Protocol) server implementation plan** based on information provided from the planning session, product requirements document (PRD), and technology stack. Your goal is to design a clear and efficient implementation plan that meets project requirements and leverages the chosen technologies.

<session_notes>
{{session-notes}}

</session_notes>

This is a summary of the MCP server planning session. It contains key decisions, considerations, identified tools/resources/prompts, their schemas, and specific requirements discussed during planning.

<tech_stack>
{{tech-stack}}

</tech_stack>

Describes the technology stack that will be used in the project (e.g., Node.js, TypeScript, Cloudflare Workers, `@modelcontextprotocol/sdk/server/mcp.js`, Zod), which may affect implementation decisions.

Perform the following steps to create the MCP server implementation plan:

1.  Carefully analyze the **planning session summary (`<session_notes>`)**, identifying key tools, resources, prompts, their schemas, data sources, response structure, and error handling strategy.
2.  Analyze the **technology stack (`<tech_stack>`)** and ensure the implementation plan is optimized for the chosen technologies and their best practices (e.g., using Zod for validation, asynchronicity in Cloudflare Workers).

4.  Create a **comprehensive MCP server implementation plan** that includes:
    a.  Proposed **file and directory structure** for the MCP server project.
    b.  Identification of **key modules/files** to create or modify (e.g., `index.ts`, `tools/rulesTools.ts`, `data/rulesProvider.ts`).
    c.  Detailed **definitions for each Tool/Resource/Prompt**:
        *   Name, description.
        *   Input and output schemas (e.g., in Zod syntax).
        *   High-level description of `execute` function logic, including interactions with data sources, processing, and error handling.
        *   Method of result wrapping for MCP SDK (e.g., `{ content: [...] }`).
    d.  Implementation plan for **data providers** or modules for interacting with external APIs/databases.
    e.  Details of **MCP server instance configuration** (e.g., in `new McpServer(...)`).
    f.  Specific assumptions regarding **error handling strategy** implementation.
    g.  Outline of **testing strategy** (e.g., unit tests for tool logic, integration tests using MCP inspector).

5.  Describe the **tool registration** process in the main server file (e.g., in the `init()` method), taking into account SDK requirements for passing schemas and callbacks.

6.  Identify any necessary entries in the **deployment environment configuration file** (e.g., `wrangler.jsonc`) or required environment variables/secrets.

7.  Ensure the plan complies with **best practices** for the chosen framework (e.g., Cloudflare Workers, MCP SDK) and language (TypeScript), including asynchronous handling, dependency management, and code readability.

The final result should have the following structure (in Markdown format):

```markdown
### MCP Server Implementation Plan

#### 1. Project Structure
   - [Outline of proposed directory and file structure]

#### 2. Key Modules
   - **`src/index.ts`**:
       - [Description of McpServer initialization, tool registration, fetch handling]
   - **`src/tools/` (or `src/tools/rulesTools.ts`)**:
       - [Description of tool module/modules contents]
   - **`src/data/` (or `src/data/rulesProvider.ts`)**:
       - [Description of data provider module/modules contents]
   - **Other (e.g., `src/types.ts`)**:
       - [Description of other needed modules]

#### 3. Tool/Resource/Prompt Definitions
   - **Tool: `[tool_name_1]`**
       - Description: `[Tool description]`
       - Input Schema (Zod): `[Zod schema definition]`
       - Output Schema (Zod): `[Zod schema definition]`
       - `execute` Logic: `[Implementation steps, interactions, error handling]`
       - Result Wrapping for SDK: `[Example structure, e.g., { content: [...] }]`
   - **Tool: `[tool_name_2]`**
       - ... (as above)
   - ... (for all tools/resources/prompts)

#### 4. Data Handling
   - [Description of method of access and data processing, e.g., from preparedRules.json]

#### 5. Server and Deployment Configuration
   - `McpServer` Configuration: `[Settings in new McpServer(...)]`
   - `wrangler.jsonc` / `wrangler.toml` Configuration: `[Required settings]`
   - Environment Variables / Secrets: `[List of required variables]`

#### 6. Error Handling
   - [Description of error handling implementation strategy and message format]

#### 7. Testing Strategy
   - Unit Tests: `[Approach to testing tool/data logic]`
   - Integration Tests: `[Usage plan e.g., @modelcontextprotocol/inspector]`

#### 8. Additional Notes
   - [Any other relevant notes, potential risks, design decisions]
```

The response should include **only the final MCP server implementation plan in markdown format**, which you will save in the `.ai/mcp-implementation-plan.md` file, without including the thought process or intermediate steps. Ensure the plan is comprehensive, well organized, and ready to use as a guide during MCP server implementation.$prompt3$,
        $prompt4$Jesteś **architektem oprogramowania**, którego zadaniem jest stworzenie **planu implementacji serwera MCP (Model Context Protocol)** na podstawie informacji dostarczonych z sesji planowania, dokumentu wymagań produktu (PRD) i stacku technologicznego. Twoim celem jest zaprojektowanie klarownego i efektywnego planu implementacji, który spełnia wymagania projektu i wykorzystuje wybrane technologie.

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

W odpowiedzi należy podać **tylko ostateczny plan implementacji serwera MCP w formacie markdown**, który zapiszesz w pliku `.ai/mcp-implementation-plan.md`, bez uwzględniania procesu myślowego lub kroków pośrednich. Upewnij się, że plan jest kompleksowy, dobrze zorganizowany i gotowy do wykorzystania jako przewodnik podczas implementacji serwera MCP.$prompt4$,
        1,
        'published',
        NULL
    );

    -- Prompt 3/3: MCP Server Implementation
    INSERT INTO prompts (
        organization_id,
        collection_id,
        segment_id,
        title_en,
        title_pl,
        description_en,
        description_pl,
        markdown_body_en,
        markdown_body_pl,
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l2_mcp_id,
        'MCP Server Implementation',
        'Implementacja Serwera MCP',
        'Implements complete MCP server following the technical plan with TypeScript, Cloudflare Workers, and proper tool registration, data handling, validation, and error management.',
        'Implementuje kompletny serwer MCP zgodnie z planem technicznym, wykorzystując TypeScript, Cloudflare Workers oraz właściwą rejestrację narzędzi, obsługę danych, walidację i zarządzanie błędami.',
        $prompt5$Your task is to implement an **MCP (Model Context Protocol) server** based on the provided implementation plan and implementation rules. Your goal is to create a detailed and accurate implementation that complies with the provided plan, correctly defines tools, handles logic, and communicates according to the MCP protocol.

First review the implementation plan:
<implementation_plan>
{{implementation-plan}} <!-- Insert reference to .ai/mcp-implementation-plan.md file here -->

Create/modify server code in location: {{sciezka}} <!-- Specify base path, e.g., mcp-server/src -->
</implementation_plan>

Now review the implementation rules:
<implementation_rules>
{{implementation-rules}} <!-- Insert reference to appropriate implementation rules here (e.g., regarding TypeScript, Cloudflare Workers, Zod, etc.) -->
</implementation_rules>

Implement the plan according to the following approach:
<implementation_approach>
Implement a maximum of 3 steps of the implementation plan (e.g., structure definition, implementation of one module, implementation of one tool). After each group of steps, summarize briefly what was done and describe the plan for the next 3 actions. Stop work at this point and wait for my feedback before continuing.
</implementation_approach>

Carefully analyze the implementation plan and rules. Pay special attention to the project structure, tool definition, `execute` logic implementation, Zod schemas, interaction with data sources, error handling, and the method of tool registration in the MCP SDK.

Perform the following steps to implement the MCP server:

1.  **Project Structure and Main Server File:**
    *   Create or modify files and directories in location `{{sciezka}}` according to the structure described in the plan.
    *   In the main server file (e.g., `index.ts`), define a `MyMCP` class (or other according to the plan) extending `McpAgent`.
    *   Implement `McpServer` instance initialization with appropriate name and version.

2.  **Tool Module Implementation:**
    *   Create or modify files containing tool definitions (e.g., `tools/rulesTools.ts`).
    *   For each tool, define an exported object containing `name`, `description`.
    *   Implement Zod schemas (`inputSchema`, `outputSchema`) according to the specification in the plan.

3.  **Tool Logic Implementation (`execute`):**
    *   For each tool, implement an asynchronous `execute` function.
    *   Implement the business logic described in the plan, including interaction with data modules (e.g., `rulesProvider`).
    *   Ensure validation of input data (if not fully supported by SDK) and output data (e.g., using `outputSchema.safeParse`).

4.  **Data Provider Implementation:**
    *   Create or modify modules responsible for providing data (e.g., `data/rulesProvider.ts`).
    *   Implement functions according to the plan (e.g., reading and providing data from `preparedRules.json`).

5.  **Tool Registration in `init()`:**
    *   In the `init()` method of the `MyMCP` class, for each tool call `this.server.tool()`.
    *   Pass appropriate arguments according to SDK requirements (name, schema/description, callback function).
    *   Inside the callback function, call the appropriate tool `execute` function.
    *   Wrap the result from `execute` in the structure expected by the SDK (e.g., `{ content: [{ type: 'text', text: JSON.stringify(result) }] }`), according to agreements in the plan.

6.  **Error Handling:**
    *   Implement error handling in `execute` functions (e.g., `try...catch`, returning error object compliant with `outputSchema` schema).
    *   Handle validation errors (input/output).
    *   Ensure errors are properly formatted in the response for the SDK (e.g., setting `isError: true` in callback response, if SDK supports it).

7.  **Typing and Documentation:**
    *   Apply strong TypeScript typing throughout the code.
    *   Add JSDoc/TSDoc comments explaining the operation of key code fragments, especially tool logic and schemas.

8.  **Testing:**
    *   Organize code modularly, facilitating unit testing of tool and data provider logic.

Throughout the entire implementation process, you must strictly follow the provided implementation rules (`<implementation_rules>`). They take precedence over general best practices that may conflict with them.

Ensure your implementation accurately reflects the provided implementation plan (`<implementation_plan>`) and follows all specified rules. Pay special attention to correct definition and registration of tools, implementation of their logic, data and error handling, and compliance with MCP SDK specifics. Implement code iteratively according to `<implementation_approach>`.$prompt5$,
        $prompt6$Twoim zadaniem jest zaimplementowanie **serwera MCP (Model Context Protocol)** w oparciu o podany plan implementacji i zasady implementacji. Twoim celem jest stworzenie szczegółowej i dokładnej implementacji, która jest zgodna z dostarczonym planem, poprawnie definiuje narzędzia, obsługuje logikę i komunikuje się zgodnie z protokołem MCP.

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

Upewnij się, że Twoja implementacja dokładnie odzwierciedla dostarczony plan implementacji (`<implementation_plan>`) i przestrzega wszystkich określonych zasad. Zwróć szczególną uwagę na poprawną definicję i rejestrację narzędzi, implementację ich logiki, obsługę danych i błędów oraz zgodność ze specyfiką SDK MCP. Implementuj kod iteracyjnie zgodnie z `<implementation_approach>`.$prompt6$,
        2,
        'published',
        NULL
    );

    RAISE NOTICE 'Successfully seeded % prompts for M5', 3;
END $$;

-- =====================================================
-- Seed completed successfully
-- =====================================================