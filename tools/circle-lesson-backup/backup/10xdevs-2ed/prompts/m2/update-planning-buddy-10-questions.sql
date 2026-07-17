-- Update planning-buddy prompts to require exactly 10 questions
-- Updates Database Planning Assistant and UI Architecture Planning Assistant
-- for both EN and PL versions
-- Run this in Supabase SQL Editor

DO $$
DECLARE
  v_org_id UUID;
  v_coll_m2_bootstrap_id UUID;
  v_seg_l3_database_id UUID;
  v_seg_l5_ui_id UUID;
  v_updated_count INTEGER := 0;
BEGIN
  -- Get 10xDevs organization ID
  SELECT id INTO v_org_id FROM organizations WHERE slug = '10xdevs';

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION '10xDevs organization not found. Please ensure the organization exists.';
  END IF;

  -- Get collection ID
  SELECT id INTO v_coll_m2_bootstrap_id FROM prompt_collections
  WHERE organization_id = v_org_id AND slug = 'm2-bootstrap';

  IF v_coll_m2_bootstrap_id IS NULL THEN
    RAISE EXCEPTION 'M2 Bootstrap collection not found. Please run the main seed first.';
  END IF;

  -- Get segment IDs
  SELECT id INTO v_seg_l3_database_id FROM prompt_collection_segments
  WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l3-database';

  SELECT id INTO v_seg_l5_ui_id FROM prompt_collection_segments
  WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l5-ui';

  IF v_seg_l3_database_id IS NULL THEN
    RAISE EXCEPTION 'L3 Database segment not found. Please run the main seed first.';
  END IF;

  IF v_seg_l5_ui_id IS NULL THEN
    RAISE EXCEPTION 'L5 UI segment not found. Please run the main seed first.';
  END IF;

  -- Update Database Planning Assistant (EN)
  UPDATE prompts
  SET markdown_body_en = 'You are an AI assistant whose task is to help plan a PostgreSQL database schema for an MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to create the database schema, relationships, and row-level security (RLS) policies.

Please carefully review the following information:

<product_requirements>
{{prd}} <- replace with reference to @prd.md
</product_requirements>

<tech_stack>
{{tech-stack}} <- replace with reference to @tech-stack.md
</tech_stack>

Analyze the provided information, focusing on aspects relevant to database design. Consider the following issues:

1. Identify key entities and their attributes based on product requirements.
2. Determine potential relationships between entities.
3. Consider data types and constraints that may be necessary.
4. Think about scalability and performance impact.
5. Assess security requirements and their impact on database design.
6. Consider any specific PostgreSQL features that might be beneficial for the project.

Based on your analysis, generate a list of 10 questions and recommendations in a combined form (question + recommendation). These should address any ambiguities, potential issues, or areas where more information is needed to create an effective database schema. Consider questions regarding:

1. Entity relationships and cardinality
2. Data types and constraints
3. Indexing strategies
4. Partitioning (if applicable)
5. Row-level security requirements
6. Performance considerations
7. Scalability concerns
8. Data integrity and consistency

The output should have the following structure:

<questions>
List your questions and recommendations here, numbered for clarity:

For example:
1. Should the `users` entity have a relationship with `posts`?

Recommendation: Yes, the `users` entity should have a relationship with `posts` because users can create posts.
</questions>

Remember that your goal is to provide a comprehensive list of questions and recommendations that will help create a solid PostgreSQL database schema for the MVP. Focus on clarity, relevance, and accuracy of your outputs. Do not include any additional comments or explanations beyond the specified output format.

Continue this process, generating new questions and recommendations based on the provided context and user responses, until the user explicitly requests a summary.

Remember to focus on clarity, relevance, and accuracy of outputs. Do not include any additional comments or explanations beyond the specified output format.'
  WHERE organization_id = v_org_id
    AND collection_id = v_coll_m2_bootstrap_id
    AND segment_id = v_seg_l3_database_id
    AND title_en = 'Database Planning Assistant'
    AND sort_order = 0;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated Database Planning Assistant (EN): % rows', v_updated_count;

  -- Update Database Planning Assistant (PL)
  UPDATE prompts
  SET markdown_body_pl = 'Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu schematu bazy danych w PostgreSQL dla MVP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do utworzenia schematu bazy danych, relacji i zasad bezpieczeństwa na poziomie wierszy (RLS).

Prosimy o uważne zapoznanie się z poniższymi informacjami:

<product_requirements>
{{prd}} <- zamień na referencję do @prd.md
</product_requirements>

<tech_stack>
{{tech-stack}} <- zamień na referencję do @tech-stack.md
</tech_stack>

Przeanalizuj dostarczone informacje, koncentrując się na aspektach istotnych dla projektowania bazy danych. Rozważ następujące kwestie:

1. Zidentyfikuj kluczowe encje i ich atrybuty na podstawie wymagań produktu.
2. Określ potencjalne relacje między jednostkami.
3. Rozważ typów danych i ograniczeń, które mogą być konieczne.
4. Pomyśl o skalowalności i wpływie na wydajność.
5. Oceń wymagania bezpieczeństwa i ich wpływ na projekt bazy danych.
6. Rozważ wszelkie konkretne funkcje PostgreSQL, które mogą być korzystne dla projektu.

Na podstawie analizy wygeneruj listę 10 pytań i zaleceń w formie łączonej (pytanie + zalecenie). Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby stworzyć skuteczny schemat bazy danych. Rozważ pytania dotyczące:

1. Relacje i kardynalność jednostek
2. Typy danych i ograniczenia
3. Strategie indeksowania
4. Partycjonowanie (jeśli dotyczy)
5. Wymagania bezpieczeństwa na poziomie wierszy
6. Rozważania dotyczące wydajności
7. Kwestie skalowalności
8. Integralność i spójność danych

Dane wyjściowe powinny mieć następującą strukturę:

<pytania>
Wymień tutaj swoje pytania i zalecenia, ponumerowane dla przejrzystości:

Na przykład:
1. Czy encja „użytkownicy" powinna mieć powiązanie z „postami"?

Rekomendacja: Tak, encja „użytkownicy" powinna mieć powiązanie z „postami", ponieważ użytkownicy mogą tworzyć posty.
</pytania>

Pamiętaj, że Twoim celem jest dostarczenie kompleksowej listy pytań i zaleceń, które pomogą w stworzeniu solidnego schematu bazy danych PostgreSQL dla MVP. Skoncentruj się na jasności, trafności i dokładności swoich wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o przekazany kontekst i odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.

Pamiętaj, aby skupić się na jasności, trafności i dokładności wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.'
  WHERE organization_id = v_org_id
    AND collection_id = v_coll_m2_bootstrap_id
    AND segment_id = v_seg_l3_database_id
    AND title_pl = 'Asystent planowania bazy danych'
    AND sort_order = 0;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated Database Planning Assistant (PL): % rows', v_updated_count;

  -- Update UI Architecture Planning Assistant (EN)
  UPDATE prompts
  SET markdown_body_en = 'You are an AI assistant whose task is to help plan the user interface architecture for an MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to create a detailed UI architecture, user journey maps, and navigation structure.

Please carefully review the following information:

<product_requirements>
@prd.md
</product_requirements>

<tech_stack>
@tech-stack.md
</tech_stack>

<api_plan>
@api-plan.md
</api_plan>

Analyze the provided information, focusing on aspects relevant to user interface design. Consider the following issues:

1. Identify key views and screens based on product requirements and available API endpoints.
2. Determine potential user flows and navigation between views, taking into account API capabilities.
3. Consider UI components and interaction patterns that may be necessary for effective API communication.
4. Think about interface responsiveness and accessibility.
5. Assess security and authentication requirements in the context of API integration.
6. Consider any specific UI libraries or frameworks that might be beneficial for the project.
7. Analyze how the API structure impacts UI design and data flows in the application.

Based on your analysis, generate a list of 10 questions and recommendations in a combined form (question + recommendation). These should address any ambiguities, potential issues, or areas where more information is needed to create an effective UI architecture. Consider questions regarding:

1. View hierarchy and organization in relation to API structure
2. User flows and navigation supported by available endpoints
3. Responsiveness and adaptation to different devices
4. Accessibility and inclusiveness
5. Security and authorization at the UI level in connection with API mechanisms
6. Design consistency and user experience
7. Application state management strategy and synchronization with API
8. Handling error states and exceptions returned by API
9. Caching strategies and performance optimization in API communication

The output should have the following structure:

<questions>
List your questions and recommendations here, numbered for clarity:

For example:
1. Should the post card component display the author''s name?

Recommendation: Yes, the post card component should display the author''s name.
</questions>

Remember that your goal is to provide a comprehensive list of questions and recommendations that will help create a solid UI architecture for the MVP, fully integrated with available API endpoints. Focus on clarity, relevance, and accuracy of your outputs. Do not include any additional comments or explanations beyond the specified output format.

Continue this process, generating new questions and recommendations based on the provided context and user responses, until the user explicitly requests a summary.

Remember to focus on clarity, relevance, and accuracy of outputs. Do not include any additional comments or explanations beyond the specified output format.'
  WHERE organization_id = v_org_id
    AND collection_id = v_coll_m2_bootstrap_id
    AND segment_id = v_seg_l5_ui_id
    AND title_en = 'UI Architecture Planning Assistant'
    AND sort_order = 0;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated UI Architecture Planning Assistant (EN): % rows', v_updated_count;

  -- Update UI Architecture Planning Assistant (PL)
  UPDATE prompts
  SET markdown_body_pl = 'Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu architektury interfejsu użytkownika dla MVP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do utworzenia szczegółowej architektury UI, map podróży użytkownika i struktury nawigacji.

Prosimy o uważne zapoznanie się z poniższymi informacjami:

<product_requirements>
@prd.md
</product_requirements>

<tech_stack>
@tech-stack.md
</tech_stack>

<api_plan>
@api-plan.md
</api_plan>

Przeanalizuj dostarczone informacje, koncentrując się na aspektach istotnych dla projektowania interfejsu użytkownika. Rozważ następujące kwestie:

1. Zidentyfikuj kluczowe widoki i ekrany na podstawie wymagań produktu i dostępnych endpointów API.
2. Określ potencjalne przepływy użytkownika i nawigację między widokami, uwzględniając możliwości API.
3. Rozważ komponenty UI i wzorce interakcji, które mogą być konieczne do efektywnej komunikacji z API.
4. Pomyśl o responsywności i dostępności interfejsu.
5. Oceń wymagania bezpieczeństwa i uwierzytelniania w kontekście integracji z API.
6. Rozważ wszelkie konkretne biblioteki UI lub frameworki, które mogą być korzystne dla projektu.
7. Przeanalizuj, jak struktura API wpływa na projekt UI i przepływy danych w aplikacji.

Na podstawie analizy wygeneruj listę 10 pytań i zaleceń w formie łączonej (pytanie + zalecenie). Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby stworzyć efektywną architekturę UI. Rozważ pytania dotyczące:

1. Hierarchia i organizacja widoków w odniesieniu do struktury API
2. Przepływy użytkownika i nawigacja wspierane przez dostępne endpointy
3. Responsywność i adaptacja do różnych urządzeń
4. Dostępność i inkluzywność
5. Bezpieczeństwo i autoryzacja na poziomie UI w powiązaniu z mechanizmami API
6. Spójność designu i doświadczenia użytkownika
7. Strategia zarządzania stanem aplikacji i synchronizacji z API
8. Obsługa stanów błędów i wyjątków zwracanych przez API
9. Strategie buforowania i optymalizacji wydajności w komunikacji z API

Dane wyjściowe powinny mieć następującą strukturę:

<pytania>
W tym miejscu proszę wymienić pytania i zalecenia, dla przejrzystości opatrzone numerami:

Na przykład:
1. Czy na pocztówce powinno znajdować się nazwisko autora?

Rekomendacja: Tak, na pocztówce powinno znajdować się nazwisko autora.
</pytania>

Pamiętaj, że Twoim celem jest dostarczenie kompleksowej listy pytań i zaleceń, które pomogą w stworzeniu solidnej architektury UI dla MVP, w pełni zintegrowanej z dostępnymi endpointami API. Skoncentruj się na jasności, trafności i dokładności swoich wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o przekazany kontekst i odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.

Pamiętaj, aby skupić się na jasności, trafności i dokładności wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.'
  WHERE organization_id = v_org_id
    AND collection_id = v_coll_m2_bootstrap_id
    AND segment_id = v_seg_l5_ui_id
    AND title_pl = 'Asystent planowania architektury UI'
    AND sort_order = 0;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated UI Architecture Planning Assistant (PL): % rows', v_updated_count;

  RAISE NOTICE 'Successfully updated all planning-buddy prompts to require exactly 10 questions';

END $$;
