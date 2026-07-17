-- ============================================================================
-- Supabase Seed File: M4 Lesson 4x2 - Analysis & Debugging (l2-analysis)
-- ============================================================================
-- Generated from: backup/10xdevs-2ed/prompts/m4/4x2-missing-prompts.md
-- Collection: m4-legacy ("M4 Legacy")
-- Segment: l2-analysis ("Analysis & Debugging")
-- Prompts: 3 bilingual pairs (sequences 3-5)
--
-- This file is idempotent and can be run multiple times safely.
-- Uses DELETE + INSERT pattern for prompts (no unique constraint).
-- Uses ON CONFLICT DO UPDATE for collections and segments (have unique constraints).
-- ============================================================================

DO $$
DECLARE
  v_org_id uuid;
  v_collection_id uuid;
  v_segment_id uuid;
BEGIN
  -- =========================================================================
  -- 1. Get Organization ID
  -- =========================================================================
  SELECT id INTO v_org_id
  FROM organizations
  WHERE slug = '10xdevs';

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Organization "10xdevs" not found';
  END IF;

  -- =========================================================================
  -- 2. Insert/Update Collection: m4-legacy
  -- =========================================================================
  INSERT INTO prompt_collections (
    organization_id,
    slug,
    title,
    sort_order
  )
  VALUES (
    v_org_id,
    'm4-legacy',
    'M4 Legacy',
    4  -- Module number for sort order
  )
  ON CONFLICT (organization_id, slug)
  DO UPDATE SET
    title = EXCLUDED.title,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW()
  RETURNING id INTO v_collection_id;

  -- =========================================================================
  -- 3. Insert/Update Segment: l2-analysis
  -- =========================================================================
  INSERT INTO prompt_collection_segments (
    collection_id,
    slug,
    title,
    sort_order
  )
  VALUES (
    v_collection_id,
    'l2-analysis',
    'Analysis & Debugging',
    2  -- Segment sort order
  )
  ON CONFLICT (collection_id, slug)
  DO UPDATE SET
    title = EXCLUDED.title,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW()
  RETURNING id INTO v_segment_id;

  -- =========================================================================
  -- 4. Insert Prompts (DELETE + INSERT pattern for idempotency)
  -- =========================================================================

  -- -------------------------------------------------------------------------
  -- Prompt 3: Bug Reproduction Log Analysis / Analiza logów z reprodukcji błędu
  -- -------------------------------------------------------------------------
  DELETE FROM prompts
  WHERE organization_id = v_org_id
    AND collection_id = v_collection_id
    AND segment_id = v_segment_id
    AND sort_order = 3;

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
    'Bug Reproduction Log Analysis',
    'Analiza logów z reprodukcji błędu',
    'Prompt for analyzing logs collected during bug reproduction to identify irregularities, update root cause hypothesis, and propose further debugging steps.',
    'Prompt do analizy logów zebranych podczas reprodukcji błędu w celu identyfikacji nieprawidłowości, aktualizacji hipotezy przyczyny źródłowej i zaproponowania dalszych kroków debugowania.',
    $BODY${{logs}} - paste here the logs collected from the browser/terminal during reproduction

Here are results from recreating buggy behaviour, please analyse them to find irregularities and possible issues, provide an updated root cause analysis and propose further ways that we can understand the issue on a deeper level. Don't edit any code, focus on analysis.$BODY$,
    $BODY${{logi}} - wklej tutaj logi zgromadzone w przeglądarce/terminalu podczas reprodukcji

Here are results from recreating buggy behaviour, please analyse them to find irregularities and possible issues, provide a updated root cause analysis and propose further ways that we can understand the issue on a deeper level. Don't edit any code, focus on analysis.$BODY$,
    'published',
    3
  );

  -- -------------------------------------------------------------------------
  -- Prompt 4: Action Plan Update After Analysis Session / Aktualizacja planu działania po sesji analizy
  -- -------------------------------------------------------------------------
  DELETE FROM prompts
  WHERE organization_id = v_org_id
    AND collection_id = v_collection_id
    AND segment_id = v_segment_id
    AND sort_order = 4;

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
    'Action Plan Update After Analysis Session',
    'Aktualizacja planu działania po sesji analizy',
    'Prompt for updating the action plan document with debugging session results, with particular focus on sections: relevant codebase parts, root cause hypothesis, investigation questions, and next steps.',
    'Prompt do aktualizacji dokumentu action plan wynikami sesji debugowania, ze szczególnym uwzględnieniem sekcji: istotne części kodu, hipoteza przyczyny źródłowej, pytania do zbadania i kolejne kroki.',
    $BODY$Please update {{action-plan}} with results of this session, focus particularly on sections: Relevant Codebase Parts, Root Cause Hypothesis, Investigation Questions, Next Steps and Additional Notes.

Please ensure that you'll provide as much details as possible from the analysis that you've conducted during this session$BODY$,
    $BODY$Please update {{action-plan}} with results of this session, focus particulary on sections: Relevant Codebase Parts, Root Cause Hypothesis, Investigation Questions, Next Steps and Additional Notes.

Please ensure that you'll provide as much details as possible from the analysis that've conducted during this session$BODY$,
    'published',
    4
  );

  -- -------------------------------------------------------------------------
  -- Prompt 5: Adding Professional Documentation to Module / Dodawanie profesjonalnej dokumentacji do modułu
  -- -------------------------------------------------------------------------
  DELETE FROM prompts
  WHERE organization_id = v_org_id
    AND collection_id = v_collection_id
    AND segment_id = v_segment_id
    AND sort_order = 5;

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
    'Adding Professional Documentation to Module',
    'Dodawanie profesjonalnej dokumentacji do modułu',
    'Prompt for generating professional documentation for a selected module according to programming language standards (JSDoc, TSDoc, etc.), including module description, parameters, return values, and dependencies.',
    'Prompt do generowania profesjonalnej dokumentacji dla wybranego modułu zgodnie ze standardami języka programowania (JSDoc, TSDoc itp.), obejmującej opis modułu, parametrów, zwracanych wartości i zależności.',
    $BODY$Add professional documentation for the @generation.service.ts module according to the documentation standard for the programming language used. Requirements:

1. Documentation should follow accepted conventions for the language (JavaDoc/PHPDoc/Docstrings/XML Documentation Comments/JSDoc, etc.)

2. Include the following elements:
   - General description of the module/class/function
   - Description of parameters/arguments (types, meaning, default values)
   - Description of return values/exceptions
   - Information about dependencies and relationships with other modules (if applicable)

3. Apply the following additional guidelines:
   - Use clear and concise language
   - Document all public methods/functions/properties
   - Mark which elements are optional or deprecated
   - Include information about specific behaviors or potential pitfalls in usage$BODY$,
    $BODY$Dodaj profesjonalną dokumentację dla modułu @generation.service.ts zgodnie ze standardem dokumentacji dla wykorzystanego języka programowania. Wymagania:

1. Dokumentacja powinna być zgodna z przyjętymi konwencjami dla języka (JavaDoc/PHPDoc/Docstrings/XML Documentation Comments/JSDoc itp.)

2. Uwzględnij następujące elementy:
   - Opis ogólny modułu/klasy/funkcji
   - Opis parametrów/argumentów (typy, znaczenie, wartości domyślne)
   - Opis zwracanych wartości/wyjątków
   - Informacje o zależnościach i powiązaniach z innymi modułami (jeśli dotyczy)

3. Zastosuj następujące dodatkowe wytyczne:
   - Używaj jasnego i zwięzłego języka
   - Dokumentuj wszystkie publiczne metody/funkcje/właściwości
   - Zaznacz, które elementy są opcjonalne lub przestarzałe (deprecated)
   - Dołącz informacje o specyficznych zachowaniach lub potencjalnych pułapkach w użyciu$BODY$,
    'published',
    5
  );

  RAISE NOTICE 'Successfully inserted/updated 3 prompts for m4-legacy > l2-analysis (sequences 3-5)';

END $$;
