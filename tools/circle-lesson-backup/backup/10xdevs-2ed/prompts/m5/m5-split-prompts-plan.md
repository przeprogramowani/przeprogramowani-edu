# Plan: Split and Localize M5 Prompts Following M2/M4 Pattern

## Overview
Transform the single aggregated M5 prompt file (`5x2_prompts.md`) into individual, bilingual prompt files matching the M2/M4 naming pattern and structure.

## Current State Analysis

### M2/M4 Pattern (Target):
- **Naming**: `{lesson}-{seq}-{title-short-slug}-{locale}.md`
- **Example**: `5x2-1-mcp-server-planning-en.md` / `5x2-1-mcp-server-planning-pl.md`
- **Frontmatter**: title, description, collection, segment, sort-order, status
- **Localization**: Complete translation of title, description, and content

### M5 Current State:
- **Files**: Only 1 aggregated file with prompts (`5x2_prompts.md`)
- **Files with prompts**: 1 file (5x2 only)
- **Format**: Multiple prompts per file, separated by `---`
- **Language**: Mixed - Polish content with improved English titles
- **Total prompts**: 3 individual prompts to extract (all from 5x2)
- **Collection**: `m5-innovation`
- **Segment**: `l2-mcp` (all prompts)
- **Extraction status**: ✅ Already completed (see M5_EXTRACTION_SUMMARY.md)
- **Metadata quality**: ✅ Already improved to M3 standards

### M5 Unique Characteristics:
- **MCP-focused**: All prompts are about Model Context Protocol implementation
- **Technical depth**: Heavy use of TypeScript, Cloudflare Workers, Zod schemas
- **Placeholders**: Uses `{{tech-stack}}`, `{{session-notes}}`, `{{implementation-plan}}`, `{{sciezka}}`, `{{implementation-rules}}`
- **Structured sections**: XML-style tags like `<tech_stack>`, `<session_notes>`, `<implementation_plan>`
- **Workflow-based prompts**: Sequential 3-step process (Planning → Implementation Plan → Implementation)
- **File references**: `.ai/mcp-implementation-plan.md` file path references
- **SDK-specific**: References to `@modelcontextprotocol/sdk/server/mcp.js`, `McpServer`, `McpAgent` classes

### Comparison with Other Modules:

| Aspect | M2 | M3 | M4 | M5 |
|--------|----|----|----|----|
| Total prompts | ~30 | 24 | 7 | **3** |
| Total files (bilingual) | ~60 | 48 | 14 | **6** |
| Collection | m2-planning | m3-prod | m4-legacy | **m5-innovation** |
| Lessons with prompts | 5 | 8 | 2 | **1** |
| Segments | Lesson-based | Lesson-based | Theme-based | **Topic-based** |
| Content type | Planning | Implementation | Analysis | **Architecture** |
| Complexity | Medium | High | Very High | **Very High** |
| Focus | Project planning | Feature building | Code exploration | **MCP design** |

## Detailed Breakdown by Lesson

### 5x1 (Knowledge Expansion via llms.txt) - 0 prompts
*No extractable prompts - lesson about llms.txt standard and documentation*

### 5x2 (Model Context Protocol) - 3 prompts
| Seq | Title (English) | Sort | Suggested Slug | Key Focus |
|-----|-----------------|------|----------------|-----------|
| 1 | MCP Server Planning | 0 | mcp-server-planning | Requirements analysis + architecture design |
| 2 | MCP Implementation Plan Creation | 1 | mcp-implementation-plan | Technical specification + file structure |
| 3 | MCP Server Implementation | 2 | mcp-server-implementation | Step-by-step coding guidance |

**Technical Elements per Prompt:**

**Prompt 1 (Planning):**
- Placeholders: `{{tech-stack}}`
- XML tags: `<tech_stack>`, `<mcp_server_planning_output>`, `<pytania>`, `<rekomendacje>`
- Tools mentioned: `@modelcontextprotocol/sdk/server/mcp.js`, Zod, Cloudflare Workers
- File references: None
- Key deliverable: Planning questions and recommendations

**Prompt 2 (Implementation Plan):**
- Placeholders: `{{session-notes}}`, `{{tech-stack}}`
- XML tags: `<session_notes>`, `<tech_stack>`
- Tools mentioned: TypeScript, Cloudflare Workers, Zod, `wrangler.jsonc`
- File references: `.ai/mcp-implementation-plan.md` (output)
- Key deliverable: Markdown implementation plan document

**Prompt 3 (Implementation):**
- Placeholders: `{{implementation-plan}}`, `{{sciezka}}`, `{{implementation-rules}}`
- XML tags: `<implementation_plan>`, `<implementation_rules>`, `<implementation_approach>`
- Tools mentioned: TypeScript, `McpServer`, `McpAgent`, Zod schemas, `tool()` method
- File references: `.ai/mcp-implementation-plan.md` (input), `mcp-server/src` (code location)
- Key deliverable: Complete MCP server code implementation

### 5x3 (Agent AI in CI/CD Scenarios) - 0 prompts
*No extractable prompts - lesson uses inline code examples, not standalone prompts*

### 5x4 (Model Evaluation) - 0 prompts
*No extractable prompts - lesson focuses on evaluation concepts through examples*

### 5x5 (10xDev Growth in AI Era) - 0 prompts
*No extractable prompts - conceptual lesson about career development*

## Translation Strategy

### For English Versions (`-en.md`):

1. **Title**: Already in English (high quality from M3-style improvements)
   - "MCP Server Planning" ✅
   - "MCP Implementation Plan Creation" ✅
   - "MCP Server Implementation" ✅

2. **Description**: Already in English (technical, action-oriented)
   - All descriptions follow M3 patterns with action verbs + context

3. **Content Translation**:
   - **Preserve placeholders**: `{{tech-stack}}`, `{{session-notes}}`, `{{implementation-plan}}`, `{{sciezka}}`, `{{implementation-rules}}`
   - **Preserve XML tags**: `<tech_stack>`, `<session_notes>`, `<mcp_server_planning_output>`, `<pytania>`, `<rekomendacje>`, `<implementation_plan>`, `<implementation_rules>`, `<implementation_approach>`
   - **Preserve file paths**: `.ai/mcp-implementation-plan.md`, `mcp-server/src`, `wrangler.jsonc`
   - **Preserve SDK/tool names**: `@modelcontextprotocol/sdk/server/mcp.js`, `McpServer`, `McpAgent`, `Zod`, `TypeScript`, `Cloudflare Workers`
   - **Preserve code references**: `new McpServer()`, `this.server.tool()`, `execute`, `inputSchema`, `outputSchema`
   - **Translate instructions**: Convert Polish instructional text to English
   - **Preserve markdown structure**: Code blocks, lists, headings
   - **Preserve technical terms**: MCP, JSON-RPC, SDK, tools, resources, prompts (in MCP context)

4. **Special MCP Terminology Handling**:
   - **MCP concepts** (unchanged): tools, resources, prompts, schemas, server, client, protocol
   - **SDK classes** (unchanged): `McpServer`, `McpAgent`, `tool()`, `init()`, `fetch`
   - **Data schemas** (unchanged): Zod, `inputSchema`, `outputSchema`, `safeParse`
   - **Deployment** (unchanged): Cloudflare Workers, `wrangler.jsonc`, `wrangler.toml`
   - **File operations** (unchanged): `file_read`, `file_search`, `list_dir`

5. **Polish→English Translation Pairs (MCP-specific)**:
   | Polish | English |
   |--------|---------|
   | Jesteś asystentem AI, którego zadaniem jest | You are an AI assistant whose task is |
   | Twoim celem jest | Your goal is |
   | Prosimy o uważne zapoznanie się z | Please carefully review |
   | Przeanalizuj dostarczone informacje | Analyze the provided information |
   | Rozważ następujące kwestie | Consider the following issues |
   | Zidentyfikuj kluczowe narzędzia | Identify key tools |
   | Określ wejścia i wyjścia | Specify inputs and outputs |
   | Rozważ potrzebę | Consider the need for |
   | Oceń wymagania | Assess requirements |
   | Zastanów się nad | Think about |
   | Na podstawie analizy | Based on the analysis |
   | Wygeneruj listę pytań | Generate a list of questions |
   | Dane wyjściowe powinny mieć | The output should have |
   | Pamiętaj, że | Remember that |
   | Kontynuuj ten proces | Continue this process |
   | architektem oprogramowania | software architect |
   | plan implementacji | implementation plan |
   | sesji planowania | planning session |
   | struktura plików i katalogów | file and directory structure |
   | kluczowe moduły | key modules |
   | szczegółowe definicje | detailed definitions |
   | strategia obsługi błędów | error handling strategy |
   | strategia testowania | testing strategy |
   | rejestracja narzędzi | tool registration |
   | konfiguracja serwera | server configuration |
   | zmienne środowiskowe | environment variables |
   | najlepsze praktyki | best practices |
   | Ostateczny wynik | The final result |
   | W odpowiedzi należy podać | The response should include |
   | bez uwzględniania procesu myślowego | without including the thought process |
   | Upewnij się, że | Ensure that |
   | Twoim zadaniem jest zaimplementowanie | Your task is to implement |
   | w oparciu o podany plan | based on the provided plan |
   | Najpierw przejrzyj | First review |
   | Teraz przejrzyj | Now review |
   | Wdrażaj plan zgodnie z | Implement the plan according to |
   | Realizuj maksymalnie 3 kroki | Implement a maximum of 3 steps |
   | Zatrzymaj w tym momencie | Stop at this point |
   | czekaj na mój feedback | wait for my feedback |
   | Dokładnie przeanalizuj | Carefully analyze |
   | Zwróć szczególną uwagę | Pay special attention |
   | Wykonaj następujące kroki | Perform the following steps |
   | Utwórz lub zmodyfikuj | Create or modify |
   | zgodnie ze strukturą | according to the structure |
   | Dla każdego narzędzia | For each tool |
   | Zapewnij walidację | Ensure validation |
   | Zaimplementuj obsługę błędów | Implement error handling |
   | Zastosuj silne typowanie | Apply strong typing |
   | Dodaj komentarze | Add comments |
   | Zorganizuj kod | Organize code |
   | W trakcie całego procesu | Throughout the entire process |
   | należy ściśle przestrzegać | you must strictly follow |
   | Mają one pierwszeństwo | They take precedence |

### For Polish Versions (`-pl.md`):
- Keep original content unchanged
- Extract as-is from source file (5x2_prompts.md)
- Preserve all frontmatter and formatting
- No modifications needed (already high quality)

## Implementation Steps

### Phase 1: Preparation
1. Read aggregated file `5x2_prompts.md`
2. Parse frontmatter and content for each prompt (3 prompts)
3. Generate mapping of prompts to target filenames
4. Validate segment assignment (all are `l2-mcp`)
5. Create translation glossary for MCP terminology

### Phase 2: Extraction & Polish Files
1. Split the aggregated file into individual prompts
2. Create Polish version files:
   - `5x2-1-mcp-server-planning-pl.md`
   - `5x2-2-mcp-implementation-plan-pl.md`
   - `5x2-3-mcp-server-implementation-pl.md`
3. Validate frontmatter completeness
4. Ensure all placeholders and references are preserved:
   - ✅ `{{tech-stack}}`
   - ✅ `{{session-notes}}`
   - ✅ `{{implementation-plan}}`
   - ✅ `{{sciezka}}`
   - ✅ `{{implementation-rules}}`
5. Ensure all XML tags are intact:
   - ✅ `<tech_stack>`, `</tech_stack>`
   - ✅ `<session_notes>`, `</session_notes>`
   - ✅ `<mcp_server_planning_output>`, `</mcp_server_planning_output>`
   - ✅ `<pytania>`, `</pytania>`
   - ✅ `<rekomendacje>`, `</rekomendacje>`
   - ✅ `<implementation_plan>`, `</implementation_plan>`
   - ✅ `<implementation_rules>`, `</implementation_rules>`
   - ✅ `<implementation_approach>`, `</implementation_approach>`

### Phase 3: Translation & English Files
1. For each Polish file, create corresponding English file
2. Titles are already in English (no translation needed):
   ```yaml
   # Polish & English (same)
   title: "MCP Server Planning"
   ```
3. Descriptions are already in English (no translation needed)
4. Translate prompt content:
   - Instructional text (Polish → English)
   - Section headings
   - Comments and explanations
   - List items and instructions
5. Preserve all technical elements:
   - Placeholders: `{{variable-name}}`
   - XML tags: `<tag_name>` ... `</tag_name>`
   - Tool names: `@modelcontextprotocol/sdk/server/mcp.js`, `McpServer`, `Zod`
   - File paths: `.ai/mcp-implementation-plan.md`, `mcp-server/src`
   - Code blocks and commands
   - SDK method names: `tool()`, `init()`, `execute`
   - Schema references: `inputSchema`, `outputSchema`, `safeParse`
6. Maintain markdown structure:
   - Numbered lists
   - Code blocks (preserve triple backticks)
   - Headings hierarchy
   - Nested lists
7. Review for technical accuracy

### Phase 4: Validation
1. **File count check**: Verify 6 files (3 prompts × 2 locales)
2. **Naming convention**: Confirm `5x2-{seq}-{slug}-{locale}.md` pattern
3. **Frontmatter validation**:
   - All required fields present
   - Collection = `m5-innovation`
   - Segment = `l2-mcp` (all prompts)
   - Sort-order sequential: 0, 1, 2
   - Status = `published`
   - Titles identical across locale pairs
   - Descriptions identical across locale pairs (already in English)
4. **Content integrity**:
   - All placeholders intact: `{{...}}`
   - All XML tags preserved: `<...>...</...>`
   - File paths unchanged: `.ai/...`
   - SDK references preserved: `@modelcontextprotocol/...`
   - Class names preserved: `McpServer`, `McpAgent`
   - Method names preserved: `tool()`, `init()`, `execute`
5. **Translation quality**:
   - Instructions clear and actionable
   - Technical terms consistent with M2/M3/M4
   - Workflow steps properly translated
   - Professional tone maintained

### Phase 5: Cleanup
1. Archive original aggregated file:
   - Move to `backup/10xdevs-2ed/prompts/m5/_archive/`
   - Keep `5x2_prompts.md` in archive for reference
2. Keep empty files (5x3_prompts.md, 5x4_prompts.md) or document why they're empty
3. Update `M5_EXTRACTION_SUMMARY.md` to reflect new bilingual structure
4. Create manifest/index of all M5 prompts

## Technical Considerations

### Filename Generation Rules:
- **Lesson prefix**: `5x2` (only lesson with prompts)
- **Sequential number**: 1, 2, 3 (matching sort-order in original)
- **Title slug**: Descriptive, kebab-case, from existing titles
  - Prompt 1: `mcp-server-planning`
  - Prompt 2: `mcp-implementation-plan`
  - Prompt 3: `mcp-server-implementation`
- **Locale suffix**: `-en` or `-pl`

### Segment Assignment:
- **l2-mcp**: All 3 prompts from 5x2
  - Focus: Model Context Protocol implementation
  - Tools: TypeScript, Cloudflare Workers, Zod, MCP SDK
  - Pattern: Planning → Design → Implementation workflow

### Placeholder Preservation:
All M5 prompts use placeholders that must be preserved exactly:
- `{{tech-stack}}` - Project technology stack description
- `{{session-notes}}` - Planning session summary
- `{{implementation-plan}}` - Reference to implementation plan file
- `{{sciezka}}` - File path for code implementation
- `{{implementation-rules}}` - Implementation guidelines reference

### XML Tag Preservation:
All M5 prompts use XML-style tags for structured sections:
- `<tech_stack>` ... `</tech_stack>` - Technology context
- `<session_notes>` ... `</session_notes>` - Planning notes
- `<mcp_server_planning_output>` ... `</mcp_server_planning_output>` - Output format
- `<pytania>` ... `</pytania>` - Questions section
- `<rekomendacje>` ... `</rekomendacje>` - Recommendations section
- `<implementation_plan>` ... `</implementation_plan>` - Plan reference
- `<implementation_rules>` ... `</implementation_rules>` - Rules reference
- `<implementation_approach>` ... `</implementation_approach>` - Approach description

### File Path Preservation:
All M5 prompts reference specific file paths:
- `.ai/mcp-implementation-plan.md` - Implementation plan output/input
- `mcp-server/src` - Code implementation directory
- `wrangler.jsonc` / `wrangler.toml` - Cloudflare Workers config
- `tools/rulesTools.ts` - Example tool module
- `data/rulesProvider.ts` - Example data provider

### SDK/Tool Reference Preservation:
All M5 prompts reference specific tools and SDKs:
- `@modelcontextprotocol/sdk/server/mcp.js` - MCP SDK import
- `@modelcontextprotocol/inspector` - Testing tool
- `McpServer` - Server class
- `McpAgent` - Agent base class
- `Zod` - Schema validation library
- TypeScript - Programming language
- Cloudflare Workers - Deployment platform

### Quality Checks:
- [ ] All frontmatter fields present in both locales
- [ ] Titles and descriptions identical across locale pairs
- [ ] Content translated without losing technical meaning
- [ ] Placeholders intact: `{{`, `}}`
- [ ] XML tags intact: `<tag>`, `</tag>`
- [ ] File paths unchanged: `.ai/...`
- [ ] SDK references preserved: `@modelcontextprotocol/...`
- [ ] Class names preserved: `McpServer`, `McpAgent`
- [ ] Method names preserved: `tool()`, `init()`, `execute`
- [ ] Schema references preserved: `inputSchema`, `outputSchema`, `safeParse`
- [ ] Configuration files preserved: `wrangler.jsonc`, `wrangler.toml`
- [ ] Sort-order identical between locale pairs
- [ ] Status field remains "published"
- [ ] Collection remains "m5-innovation"
- [ ] Segment remains "l2-mcp"
- [ ] Markdown structure preserved: lists, code blocks, headings

## Deliverables

**Output**: 6 individual prompt files organized as:
```
backup/10xdevs-2ed/prompts/m5/
├── 5x2-1-mcp-server-planning-en.md
├── 5x2-1-mcp-server-planning-pl.md
├── 5x2-2-mcp-implementation-plan-en.md
├── 5x2-2-mcp-implementation-plan-pl.md
├── 5x2-3-mcp-server-implementation-en.md
└── 5x2-3-mcp-server-implementation-pl.md
```

**Archive**: Original aggregated file in `backup/10xdevs-2ed/prompts/m5/_archive/`
```
_archive/
└── 5x2_prompts.md (3 prompts, aggregated)
```

**Documentation**: Keep as reference
```
5x3_prompts.md (empty - no prompts)
5x4_prompts.md (empty - no prompts)
M5_EXTRACTION_SUMMARY.md (extraction documentation)
m5-extract-plan.md (original extraction plan)
extract-m5-prompts.ts (extraction script)
improve-m5-metadata.ts (metadata improvement script)
```

## Execution Approach

1. **Manual Splitting**: Since only 3 prompts, can be done manually or with simple script
   - Split on `---` delimiters
   - Extract frontmatter with YAML parser
   - Generate filenames from slugs
   - Preserve exact formatting

2. **Manual Translation**: Human verification of translations for accuracy
   - Focus on instructional clarity
   - Maintain technical precision
   - Ensure consistency with M2/M3/M4 terminology
   - Preserve all technical elements (placeholders, XML tags, paths)

3. **Sequential Process**: Process all 3 prompts in one session
   - Complete Polish files first (1, 2, 3)
   - Then English files (1, 2, 3)
   - Validate after each file
   - Cross-check locale pairs for consistency

4. **Testing**: Validate sample prompts work as expected after split
   - Test placeholder substitution
   - Verify XML tag parsing
   - Check file path references
   - Validate SDK method names

## Translation Quality Standards

### Polish to English Translation Guidelines:
- Use professional technical vocabulary
- Maintain consistency with M2/M3/M4 English terminology
- Preserve imperative/instructional tone
- Keep instructions clear and actionable
- Avoid over-translation of technical terms
- Preserve MCP-specific terminology unchanged

### Key Translation Pairs (MCP Context):
| Polish | English |
|--------|---------|
| Jesteś asystentem AI | You are an AI assistant |
| Twoim zadaniem jest pomoc w zaplanowaniu | Your task is to help plan |
| Twoim celem jest wygenerowanie | Your goal is to generate |
| narzędzi, zasobów, promptów | tools, resources, prompts |
| serwera MCP | MCP server |
| MVP serwera MCP | MCP server MVP |
| dostarczonych informacji | provided information |
| Prosimy o uważne zapoznanie się | Please carefully review |
| Przeanalizuj dostarczone informacje | Analyze the provided information |
| koncentrując się na aspektach | focusing on aspects |
| Rozważ następujące kwestie | Consider the following issues |
| Zidentyfikuj kluczowe narzędzia | Identify key tools |
| Określ wejścia i wyjścia | Specify inputs and outputs |
| walidacji danych wejściowych i wyjściowych | input and output data validation |
| źródłach danych | data sources |
| Oceń wymagania dotyczące bezpieczeństwa | Assess security requirements |
| autentykacji serwera | server authentication |
| środowiska wdrożeniowego | deployment environment |
| strukturę odpowiedzi | response structure |
| kompatybilna z klientami MCP | compatible with MCP clients |
| strategię obsługi błędów | error handling strategy |
| Na podstawie analizy | Based on the analysis |
| wygeneruj listę pytań i zaleceń | generate a list of questions and recommendations |
| wszelkich niejasności | any ambiguities |
| potencjalnych problemów | potential issues |
| Dane wyjściowe powinny mieć | The output should have |
| Pamiętaj, że | Remember that |
| dostarczenie kompleksowej listy | provide a comprehensive list |
| solidnego i funkcjonalnego | solid and functional |
| Skoncentruj się na jasności | Focus on clarity |
| architektem oprogramowania | software architect |
| planu implementacji | implementation plan |
| sesji planowania | planning session |
| dokumentu wymagań produktu | product requirements document |
| stacku technologicznego | technology stack |
| klarownego i efektywnego | clear and efficient |
| kluczowe decyzje | key decisions |
| zidentyfikowane narzędzia | identified tools |
| ich schematy | their schemas |
| specyficzne wymagania | specific requirements |
| omówione podczas planowania | discussed during planning |
| Wykonaj następujące kroki | Perform the following steps |
| strukturę plików i katalogów | file and directory structure |
| kluczowych modułów/plików | key modules/files |
| Szczegółowe definicje | Detailed definitions |
| wysokopoziomowy opis logiki | high-level description of logic |
| interakcje ze źródłami danych | interactions with data sources |
| przetwarzanie i obsługa błędów | processing and error handling |
| opakowanie wyniku | result wrapping |
| dostawców danych | data providers |
| konfiguracji instancji | instance configuration |
| Konkretne założenia | Specific assumptions |
| strategii testowania | testing strategy |
| rejestracji narzędzi | tool registration |
| wymagania SDK | SDK requirements |
| przekazywania schematów | passing schemas |
| konfiguracyjnym środowiska | environment configuration |
| wymagane zmienne środowiskowe | required environment variables |
| sekrety | secrets |
| zgodny z najlepszymi praktykami | compliant with best practices |
| obsługi asynchroniczności | asynchronous handling |
| zarządzania zależnościami | dependency management |
| czytelności kodu | code readability |
| Ostateczny wynik powinien | The final result should |
| zarys proponowanej struktury | outline of proposed structure |
| inicjalizacji McpServer | McpServer initialization |
| obsługi fetch | fetch handling |
| zawartości modułu | module contents |
| potrzebnych modułów | needed modules |
| Logika execute | Execute logic |
| Kroki implementacji | Implementation steps |
| Opakowanie Wyniku dla SDK | Result Wrapping for SDK |
| sposobu dostępu | method of access |
| Konfiguracja McpServer | McpServer Configuration |
| Zmienne Środowiskowe / Sekrety | Environment Variables / Secrets |
| Lista wymaganych zmiennych | List of required variables |
| strategii implementacji | implementation strategy |
| formatu komunikatów | message format |
| Podejście do testowania | Testing approach |
| Plan wykorzystania | Usage plan |
| istotne uwagi | relevant notes |
| potencjalne ryzyka | potential risks |
| decyzje projektowe | design decisions |
| W odpowiedzi należy podać | The response should include |
| tylko ostateczny plan | only the final plan |
| bez uwzględniania procesu myślowego | without including the thought process |
| kroków pośrednich | intermediate steps |
| Upewnij się, że plan jest | Ensure the plan is |
| kompleksowy | comprehensive |
| dobrze zorganizowany | well organized |
| gotowy do wykorzystania | ready to use |
| przewodnik podczas implementacji | guide during implementation |
| Twoim zadaniem jest zaimplementowanie | Your task is to implement |
| w oparciu o podany plan | based on the provided plan |
| zasady implementacji | implementation rules |
| Twoim celem jest stworzenie | Your goal is to create |
| szczegółowej i dokładnej | detailed and accurate |
| zgodna z dostarczonym planem | compliant with the provided plan |
| poprawnie definiuje | correctly defines |
| obsługuje logikę | handles logic |
| komunikuje się zgodnie z | communicates according to |
| Najpierw przejrzyj | First review |
| Utwórz/zmodyfikuj kod | Create/modify code |
| Określ ścieżkę bazową | Specify base path |
| Teraz przejrzyj | Now review |
| Wdrażaj plan zgodnie z | Implement the plan according to |
| Realizuj maksymalnie 3 kroki | Implement a maximum of 3 steps |
| zdefiniowanie struktury | structure definition |
| implementacja jednego modułu | implementation of one module |
| implementacja jednego narzędzia | implementation of one tool |
| Po każdej grupie kroków | After each group of steps |
| podsumuj krótko | summarize briefly |
| co zostało zrobione | what was done |
| opisz plan na 3 kolejne działania | describe plan for next 3 actions |
| Zatrzymaj w tym momencie pracę | Stop work at this point |
| czekaj na mój feedback | wait for my feedback |
| przed kontynuacją | before continuing |
| Dokładnie przeanalizuj | Carefully analyze |
| Zwróć szczególną uwagę | Pay special attention |
| strukturę projektu | project structure |
| definicję narzędzi | tool definition |
| implementację logiki execute | execute logic implementation |
| schematy Zod | Zod schemas |
| interakcję ze źródłami danych | interaction with data sources |
| obsługę błędów | error handling |
| sposób rejestracji | registration method |
| Wykonaj następujące kroki | Perform the following steps |
| Główny Plik Serwera | Main Server File |
| Utwórz lub zmodyfikuj pliki | Create or modify files |
| zgodnie ze strukturą opisaną | according to the structure described |
| zdefiniuj klasę | define class |
| rozszerzającą | extending |
| Zaimplementuj inicjalizację | Implement initialization |
| odpowiednią nazwą i wersją | appropriate name and version |
| Modułów Narzędzi | Tool Modules |
| zawierające definicje narzędzi | containing tool definitions |
| Dla każdego narzędzia | For each tool |
| obiekt eksportowany | exported object |
| Zaimplementuj schematy Zod | Implement Zod schemas |
| zgodnie ze specyfikacją | according to specification |
| Logiki Narzędzi | Tool Logic |
| asynchroniczną funkcję | asynchronous function |
| logikę biznesową | business logic |
| w tym interakcję z | including interaction with |
| modułami danych | data modules |
| Zapewnij walidację | Ensure validation |
| jeśli nie jest w pełni obsługiwana | if not fully supported |
| Dostawców Danych | Data Providers |
| odpowiedzialne za dostarczanie | responsible for providing |
| Zaimplementuj funkcje zgodnie z | Implement functions according to |
| odczyt i udostępnianie danych | reading and providing data |
| Rejestracja Narzędzi | Tool Registration |
| dla każdego narzędzia wywołaj | for each tool call |
| Przekaż odpowiednie argumenty | Pass appropriate arguments |
| zgodnie z wymaganiami | according to requirements |
| funkcja callback | callback function |
| Wewnątrz funkcji callback | Inside callback function |
| wywołaj odpowiednią funkcję | call appropriate function |
| Opakuj wynik | Wrap result |
| w strukturę oczekiwaną | in expected structure |
| zgodnie z ustaleniami | according to agreements |
| Obsługa Błędów | Error Handling |
| Zaimplementuj obsługę błędów | Implement error handling |
| zwracanie obiektu błędu | returning error object |
| zgodnego ze schematem | compliant with schema |
| Obsłuż błędy walidacji | Handle validation errors |
| wejścia/wyjścia | input/output |
| Zapewnij, że błędy są | Ensure errors are |
| odpowiednio formatowane | properly formatted |
| w odpowiedzi dla SDK | in response for SDK |
| ustawiając | setting |
| jeśli SDK to wspiera | if SDK supports it |
| Typowanie i Dokumentacja | Typing and Documentation |
| Zastosuj silne typowanie | Apply strong typing |
| w całym kodzie | throughout code |
| Dodaj komentarze | Add comments |
| wyjaśniające działanie | explaining operation |
| kluczowych fragmentów kodu | key code fragments |
| zwłaszcza logiki | especially logic |
| Testowanie | Testing |
| Zorganizuj kod w sposób modułowy | Organize code modularly |
| ułatwiający testowanie | facilitating testing |
| testowanie jednostkowe | unit testing |
| W trakcie całego procesu | Throughout the entire process |
| należy ściśle przestrzegać | you must strictly follow |
| dostarczonych zasad | provided rules |
| Mają one pierwszeństwo | They take precedence |
| przed ogólnymi najlepszymi praktykami | over general best practices |
| które mogą być z nimi sprzeczne | that may conflict with them |
| Upewnij się, że Twoja implementacja | Ensure your implementation |
| dokładnie odzwierciedla | accurately reflects |
| przestrzega wszystkich określonych zasad | follows all specified rules |
| poprawną definicję i rejestrację | correct definition and registration |
| implementację ich logiki | implementation of their logic |
| obsługę danych i błędów | data and error handling |
| zgodność ze specyfiką | compliance with specifics |
| Implementuj kod iteracyjnie | Implement code iteratively |

## Success Criteria

✅ All 3 prompts successfully split into individual files
✅ Each prompt has both English and Polish versions (6 total files)
✅ Naming convention matches M2/M4 pattern exactly
✅ All frontmatter fields complete and accurate
✅ Collection set to `m5-innovation`
✅ Segment set to `l2-mcp` (all prompts)
✅ Placeholders preserved: `{{variable-name}}`
✅ XML tags preserved: `<tag_name>...</tag_name>`
✅ File paths unchanged: `.ai/...`
✅ SDK references preserved: `@modelcontextprotocol/...`
✅ Class names preserved: `McpServer`, `McpAgent`
✅ Method names preserved: `tool()`, `init()`, `execute`
✅ Schema references preserved: `inputSchema`, `outputSchema`
✅ Configuration files preserved: `wrangler.jsonc`
✅ Translations maintain technical accuracy
✅ Sort-order consistency across locale pairs
✅ Original file archived safely
✅ No regression in prompt functionality

## Differences from M3/M4 Split

| Aspect | M3 | M4 | M5 |
|--------|----|----|-----|
| Total prompts | 24 | 7 | **3** |
| Total files | 48 | 14 | **6** |
| Collection | m3-prod | m4-legacy | **m5-innovation** |
| Segments | Lesson-based (8 lessons) | Theme-based (2 themes) | **Topic-based (1 topic)** |
| Lessons with prompts | 8 | 2 | **1** |
| Content type | Implementation prompts | Analysis prompts | **Architecture prompts** |
| Placeholders | Project refs (`{{project-prd}}`) | Git refs (`{{top-modules}}`) | **MCP refs (`{{tech-stack}}`)** |
| Tools | Code generation | Code exploration | **MCP server design** |
| Complexity | High (feature building) | Very High (investigation) | **Very High (architecture)** |
| Structure | Per-feature | Per-workflow phase | **Sequential workflow** |
| Translation effort | Medium (24 prompts) | Low (7 prompts) | **Very Low (3 prompts)** |
| Unique elements | Feature specs | Git commands | **SDK references** |

## Notes

- M5 has the **fewest prompts** of all modules (only 3)
- M5 prompts are **highly technical and specialized** (MCP-focused)
- M5 prompts form a **sequential workflow** (Planning → Plan Creation → Implementation)
- Only **one lesson** (5x2) contains prompts, unlike M2/M3/M4
- Four lessons (5x1, 5x3, 5x4, 5x5) have **no extractable prompts** by design
- M5 prompts are **longer and more detailed** than M2/M3 prompts
- Heavy use of **file references** (`.ai/mcp-implementation-plan.md`)
- Deep **SDK integration** (`@modelcontextprotocol/sdk/server/mcp.js`)
- **Deployment-specific** (Cloudflare Workers configuration)
- Uses **placeholder-driven approach** for customization
- **XML-style tags** for structured input/output sections
- M5 is more **architectural/design-focused** than implementation-focused
- Translation is **simpler** due to fewer prompts but **more technical**
- Requires careful preservation of **MCP terminology** and SDK references

## Rationale for Bilingual Split

Despite having only 3 prompts, bilingual splitting is **recommended** for M5 because:

1. **Consistency**: All modules (M2, M4) follow bilingual pattern
2. **Discoverability**: English-speaking developers need English prompts
3. **Technical accuracy**: MCP terminology needs professional translation
4. **Future-proofing**: Easier to maintain separate locale files
5. **User experience**: Course platform can serve correct locale
6. **Low effort**: Only 3 prompts = minimal translation work
7. **Quality standard**: Maintains M3-level metadata quality across locales

## Translation Complexity Analysis

**Low Complexity** (easier to translate):
- Titles: Already in English ✅
- Descriptions: Already in English ✅
- Technical terms: Preserved unchanged ✅
- Placeholders: Preserved unchanged ✅
- XML tags: Preserved unchanged ✅

**Medium Complexity** (requires care):
- Instructional text: Polish → English translation needed
- Section explanations: Context-dependent translation
- Step-by-step instructions: Must maintain clarity

**High Complexity** (requires expertise):
- MCP workflow descriptions: Technical accuracy critical
- SDK usage instructions: Must align with official docs
- Architecture guidance: Professional technical writing

**Estimated Translation Time**: 2-3 hours for all 3 prompts

## Recommended Workflow

**Option A: Manual Split + Manual Translation** (Recommended)
1. Manually copy each prompt to individual files (3 Polish files)
2. Manually translate each prompt to English (3 English files)
3. Validate all 6 files
4. Archive original

**Time**: ~3 hours
**Quality**: High (human review of all content)

**Option B: Script Split + Manual Translation**
1. Run TypeScript script to split into 3 Polish files
2. Manually translate each to English
3. Validate all 6 files
4. Archive original

**Time**: ~2.5 hours
**Quality**: High (automated splitting, human translation)

**Option C: Full Automation** (Not Recommended for M5)
1. Script splits and auto-translates using AI
2. Manual review and correction
3. Validate

**Time**: ~1.5 hours
**Quality**: Medium (requires extensive review due to technical content)

**Recommendation**: Use **Option A** for M5 due to:
- Only 3 prompts (low volume)
- High technical complexity
- Critical SDK/tool references
- Need for professional quality
