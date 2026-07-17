-- Seed file for M5 Module 5x2 - MCP Server Planning Prompts
-- Generated from: backup/10xdevs-2ed/prompts/m5/
-- Collection: m5-innovation
-- Segment: l2-mcp
-- Prompts: 1

DO $$
DECLARE
  v_org_id uuid;
  v_collection_id uuid;
  v_segment_id uuid;
BEGIN
  -- Get organization ID
  SELECT id INTO v_org_id
  FROM organizations
  WHERE slug = '10xdevs';

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Organization "10xdevs" not found';
  END IF;

  -- Insert/update collection (single title, not bilingual)
  INSERT INTO prompt_collections (
    organization_id,
    slug,
    title,
    sort_order
  )
  VALUES (
    v_org_id,
    'm5-innovation',
    'M5 Innovation',
    5
  )
  ON CONFLICT (organization_id, slug)
  DO UPDATE SET
    title = EXCLUDED.title,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW()
  RETURNING id INTO v_collection_id;

  -- Insert/update segment (single title, not bilingual)
  INSERT INTO prompt_collection_segments (
    collection_id,
    slug,
    title,
    sort_order
  )
  VALUES (
    v_collection_id,
    'l2-mcp',
    'Module Context Protocol',
    2
  )
  ON CONFLICT (collection_id, slug)
  DO UPDATE SET
    title = EXCLUDED.title,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW()
  RETURNING id INTO v_segment_id;

  -- ============================================================================
  -- PROMPT 1: MCP Server Planning Summary
  -- ============================================================================

  -- Delete existing prompt if it exists (for idempotency)
  DELETE FROM prompts
  WHERE organization_id = v_org_id
    AND collection_id = v_collection_id
    AND segment_id = v_segment_id
    AND sort_order = 3;

  -- Insert prompt (omit created_at/updated_at - they have defaults)
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
    status,
    sort_order
  )
  VALUES (
    v_org_id,
    v_collection_id,
    v_segment_id,
    'MCP Server Planning Summary',
    'Podsumowanie planowania serwera MCP',
    'Generates a structured summary of MCP server planning conversations, extracting decisions, matching recommendations, and preparing detailed implementation plan for tools, resources, and prompts.',
    'Generuje strukturalne podsumowanie rozmowy o planowaniu serwera MCP, wyodrębniając decyzje, dopasowując zalecenia i przygotowując szczegółowy plan implementacji narzędzi, zasobów i promptów.',
    $BODY${{latest-round-answers}}

---

You are an AI assistant whose task is to summarize a conversation about planning an **MCP (Model Context Protocol) server** for an MVP and prepare a concise summary for the next development stage. In the conversation history, you will find the following information:

1.  Product Requirements Document (PRD)
2.  Information about the technology stack
3.  Conversation history containing questions and answers about **MCP server design (tools, resources, prompts, schemas, API, etc.)**
4.  Recommendations regarding **MCP server design**

Your tasks are:

1.  Summarize the conversation history, focusing on all decisions related to **MCP server planning**.
2.  Match the model''s recommendations to the answers provided in the conversation history. Identify which **MCP server** recommendations are relevant based on the discussion.
3.  Prepare a detailed conversation summary that includes:
    a. Main requirements for **MCP server functionality** (what tools/resources/prompts should it provide?)
    b. Key **tools/resources/prompts**, their **inputs/outputs**, **schemas**, and **data sources**.
    c. Important issues regarding **response structure, error handling, security**, and **interactions with SDK/framework**.
    d. Any unresolved issues or areas requiring further clarification regarding **MCP server implementation**.
4.  Format the results as follows:

<conversation_summary>
<decisions>
[List decisions made by the user regarding the MCP server, numbered].
</decisions>

<matched_recommendations>
[List of the most relevant MCP server recommendations matched to the conversation, numbered]
</matched_recommendations>

<mcp_server_planning_summary>
[Provide a detailed summary of the MCP server planning conversation, including the elements listed in step 3].
</mcp_server_planning_summary>

<unresolved_issues>
[List any unresolved issues or areas requiring further clarification regarding the MCP server, if any]
</unresolved_issues>
</conversation_summary>

The final output should contain only content in markdown format. Ensure that your summary is clear, concise, and provides valuable information for the next stage of **MCP server implementation**.$BODY$,
    $BODY${{latest-round-answers}}

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania **serwera MCP (Model Context Protocol)** dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:

1.  Dokument wymagań produktu (PRD)
2.  Informacje o stacku technologicznym
3.  Historia rozmów zawierająca pytania i odpowiedzi dotyczące **projektowania serwera MCP (narzędzi, zasobów, promptów, schematów, API itp.)**
4.  Zalecenia dotyczące **projektu serwera MCP**

Twoim zadaniem jest:

1.  Podsumować historię konwersacji, koncentrując się na wszystkich decyzjach związanych z **planowaniem serwera MCP**.
2.  Dopasować zalecenia modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikuj, które zalecenia dotyczące **serwera MCP** są istotne w oparciu o dyskusję.
3.  Przygotować szczegółowe podsumowanie rozmowy, które obejmuje:
    a. Główne wymagania dotyczące **funkcjonalności serwera MCP** (jakie narzędzia/zasoby/prompty ma udostępniać?)
    b. Kluczowe **narzędzia/zasoby/prompty**, ich **wejścia/wyjścia**, **schematy** i **źródła danych**.
    c. Ważne kwestie dotyczące **struktury odpowiedzi, obsługi błędów, bezpieczeństwa** i **interakcji z SDK/frameworkiem**.
    d. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia dotyczące **implementacji serwera MCP**.
4.  Sformatować wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika dotyczące serwera MCP, ponumerowane].
</decisions>

<matched_recommendations>
[Lista najistotniejszych zaleceń dotyczących serwera MCP dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>

<mcp_server_planning_summary>
[Podaj szczegółowe podsumowanie rozmowy na temat planowania serwera MCP, w tym elementy wymienione w kroku 3].
</mcp_server_planning_summary>

<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień dotyczące serwera MCP, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu **implementacji serwera MCP**.$BODY$,
    'published',
    1
  );

  RAISE NOTICE 'Successfully seeded 1 prompt for m5-innovation/l2-mcp';

END $$;
