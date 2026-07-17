-- =====================================================
-- 10xDevs M3 (Production) Prompts Seed File
-- Generated: 2025-10-12T16:33:49.448Z
-- Total prompts: 24
-- =====================================================

DO $$
DECLARE
    v_org_id UUID;
    v_collection_id UUID;
    v_segment_l1_auth_id UUID;
    v_segment_l2_unit_tests_id UUID;
    v_segment_l4_refactor_id UUID;
    v_segment_l5_cicd_id UUID;
    v_segment_l6_deploy_id UUID;
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
    -- 2. Insert/Update Collection: m3-prod
    -- =====================================================
    INSERT INTO prompt_collections (
        organization_id,
        slug,
        title,
        description,
        sort_order
    ) VALUES (
        v_org_id,
        'm3-prod',
        'M3 Prod Ready',
        'Advanced production-ready development patterns including authentication, testing, refactoring, CI/CD, and deployment strategies',
        3
    )
    ON CONFLICT (organization_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_collection_id;

    RAISE NOTICE 'Collection m3-prod: %', v_collection_id;

    -- =====================================================
    -- 3. Insert/Update Segments
    -- =====================================================
    -- Segment: l1-auth
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l1-auth',
        'Authentication & Authorization',
        1
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l1_auth_id;

    -- Segment: l2-unit-tests
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l2-unit-tests',
        'Unit Testing',
        2
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l2_unit_tests_id;

    -- Segment: l4-refactor
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l4-refactor',
        'Refactoring & Best Practices',
        4
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l4_refactor_id;

    -- Segment: l5-cicd
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l5-cicd',
        'CI/CD Pipeline',
        5
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l5_cicd_id;

    -- Segment: l6-deploy
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l6-deploy',
        'Deployment Strategies',
        6
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l6_deploy_id;

    -- =====================================================
    -- 4. Insert/Update Prompts
    -- =====================================================
    -- Prompt 1/24: Authentication Architecture Specification
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
        v_segment_l1_auth_id,
        'Authentication Architecture Specification',
        'Specyfikacja Architektury Autentykacji',
        'Creates comprehensive technical specification for authentication system including UI architecture, backend logic, and Supabase Auth integration based on PRD requirements.',
        'Tworzy kompleksową specyfikację techniczną systemu autentykacji, w tym architekturę UI, logikę backendową i integrację Supabase Auth w oparciu o wymagania PRD.',
        $prompt1$You are an experienced full-stack web developer specializing in implementing user registration, login, and password recovery modules. Develop a detailed architecture for this functionality based on requirements from @project-prd.md (US-003 and US-004) and the stack from @tech-stack.md.

Ensure compatibility with remaining requirements - you cannot break existing application behavior described in the documentation.

The specification should include the following elements:

1. USER INTERFACE ARCHITECTURE
- Detailed description of changes in the frontend layer (pages, components, and layouts in auth and non-auth mode), including description of new elements and those to be extended with authentication requirements
- Precise separation of responsibilities between forms and client-side React components vs. Astro pages, taking into account their integration with the authentication backend, navigation, and user actions
- Description of validation cases and error messages
- Handling of the most important scenarios

2. BACKEND LOGIC
- Structure of API endpoints and data models consistent with new user interface elements
- Input data validation mechanism
- Exception handling
- Update of server-side rendering method for selected pages taking into account @astro.config.mjs

3. AUTHENTICATION SYSTEM
- Use of Supabase Auth to implement registration, login, logout, and account recovery functionality in conjunction with Astro

Present key findings in the form of a descriptive technical specification in Polish - without target implementation, but with indication of individual components, modules, services, and contracts. After completing the task, create a file .ai/auth-spec.md and add the entire specification there.$prompt1$,
        $prompt2$Jesteś doświadczonym full-stack web developerem specjalizującym się we wdrażaniu modułu rejestracji, logowania i odzyskiwania hasła użytkowników. Opracuj szczegółową architekturę tej funkcjonalności na podstawie wymagań z pliku @project-prd.md (US-003 i US-004) oraz stacku z @tech-stack.md.

Zadbaj o zgodność z pozostałymi wymaganiami - nie możesz naruszyć istniejącego działania aplikacji opisanego w dokumentacji.

Specyfikacja powinna zawierać następujące elementy:

1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA
- Dokładny opis zmian w warstwie frontendu (stron, komponentów i layoutów w trybie auth i non-auth), w tym opis nowych elementów oraz tych do rozszerzenia o wymagania autentykacji
- Dokładne rozdzielenie odpowiedzialności pomiędzy formularze i komponenty client-side React a strony Astro, biorąc pod uwagę ich integrację z backendem autentykacji oraz nawigacją i akcjami użytkownika
- Opis przypadków walidacji i komunikatów błędów
- Obsługę najważniejszych scenariuszy

2. LOGIKA BACKENDOWA
- Struktura endpointów API i modeli danych zgodnych z nowymi elementami interfejsu użytkownika
- Mechanizm walidacji danych wejściowych
- Obsługa wyjątków
- Aktualizacja sposobu renderowania wybranych stron server-side biorąc pod uwagę @astro.config.mjs

3. SYSTEM AUTENTYKACJI
- Wykorzystanie Supabase Auth do realizacji funkcjonalności rejestracji, logowania, wylogowywania i odzyskiwania konta w połączeniu z Astro

Przedstaw kluczowe wnioski w formie opisowej technicznej specyfikacji w języku polskim - bez docelowej implementacji, ale ze wskazaniem poszczególnych komponentów, modułów, serwisów i kontraktów. Po ukończeniu zadania, utwórz plik .ai/auth-spec.md i dodaj tam całą specyfikację.$prompt2$,
        0,
        'published',
        NULL
    );

    -- Prompt 2/24: Authentication Spec Validation
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
        v_segment_l1_auth_id,
        'Authentication Spec Validation',
        'Walidacja Specyfikacji Autentykacji',
        'Validates authentication specification against PRD requirements, identifies conflicts and redundant assumptions, updates documentation accordingly.',
        'Waliduje specyfikację autentykacji względem wymagań PRD, identyfikuje konflikty i nadmiarowe założenia, aktualizuje dokumentację zgodnie z nimi.',
        $prompt3$Compare @project-prd.md and @auth-spec.md looking for conflicting and redundant assumptions. Make sure that each User Story can be implemented based on the prepared plan. If you notice conflicts, update @auth-spec.md according to new knowledge.$prompt3$,
        $prompt4$Porównaj @project-prd.md oraz @auth-spec.md w poszukiwaniu sprzecznych i nadmiarowych założeń. Upewnij się, że każde User Story może być zrealizowane w oparciu o przygotowany plan. Jeśli zauważasz sprzeczności, zaktualizuj @auth-spec.md zgodnie z nową wiedzą.$prompt4$,
        1,
        'published',
        NULL
    );

    -- Prompt 3/24: Authentication Flow Diagram
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
        v_segment_l1_auth_id,
        'Authentication Flow Diagram',
        'Diagram Przepływu Autentykacji',
        'Generates Mermaid diagram visualizing authentication architecture based on PRD and auth specification.',
        'Generuje diagram Mermaid wizualizujący architekturę autentykacji w oparciu o PRD i specyfikację autentykacji.',
        $prompt5$Use project documentation @project-prd.md, authentication specification @auth-spec.md to create a diagram according to the rules - @mermaid-diagram-ui.mdc

Before you begin, search the codebase for elements that may be involved in the authentication process.$prompt5$,
        $prompt6$Wykorzystaj dokumentację projektową @project-prd.md , specyfikację autentykacji @auth-spec.md do utworzenia diagramu zgodnie z regułami - @mermaid-diagram-ui.mdc

Zanim rozpoczniesz, przeszukaj codebase pod kątem elementów mogących brać udział w procesie autentykacji.$prompt6$,
        2,
        'published',
        NULL
    );

    -- Prompt 4/24: Authentication UI Implementation
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
        v_segment_l1_auth_id,
        'Authentication UI Implementation',
        'Implementacja UI Autentykacji',
        'Implements login, signup, and password recovery pages and forms following Astro and React best practices without backend integration.',
        'Implementuje strony i formularze logowania, rejestracji i odzyskiwania hasła zgodnie z najlepszymi praktykami Astro i React bez integracji z backendem.',
        $prompt7$Your task is to implement user interface elements (pages and forms) for the login, registration, and account recovery process. The specification is located in: @auth-spec.md

Remember the assumptions @astro.mdc and @react.mdc -

Use similar styling to {{EXISTING_COMPONENTS}}

Do not implement backend or application state modifications - we will deal with these elements in the next steps$prompt7$,
        $prompt8$Twoim zadaniem jest implementacja elementów interfejsu użytkownika (stron i formularzy) dla procesu logowania, rejestracji i odzyskiwania konta. Specyfikacja znajduje się w: @auth-spec.md

Pamiętaj o założeniach @astro.mdc i @react.mdc -

Wykorzystaj podobną stylistykę do {{EXISTING_COMPONENTS}}

Nie implementuj backendu ani modyfikacji stanu aplikacji - tymi elementami zajmiemy się w dalszej kolejności$prompt8$,
        3,
        'published',
        NULL
    );

    -- Prompt 5/24: Login Backend Integration Planning
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
        v_segment_l1_auth_id,
        'Login Backend Integration Planning',
        'Planowanie Integracji Backendu Logowania',
        'Plans login form integration with Astro backend and Supabase Auth. Generates technical questions to clarify implementation details before proceeding.',
        'Planuje integrację formularza logowania z backendem Astro i Supabase Auth. Generuje pytania techniczne w celu wyjaśnienia szczegółów implementacji przed przystąpieniem do prac.',
        $prompt9$Integrate @login.astro @LoginForm.tsx with the Astro backend based on the specification @auth-spec.md. Start by analyzing the existing code in the context of best practices @astro.mdc and @react.mdc

The presented plan should meet the assumptions outlined in the user stories section: @project-prd.md

Use @supabase-auth.mdc to achieve correct integration of the login process with Supabase Auth.

Before we start, ask me 5 key technical questions addressing unclear elements of integration that will help you carry out the entire implementation from start to finish.$prompt9$,
        $prompt10$Przeprowadź integrację @login.astro @LoginForm.tsx  z backendem Astro na podstawie specyfikacji @auth-spec.md. Rozpocznij od analizy istniejącego kodu w kontekście najlepszych praktyk @astro.mdc i @react.mdc

Przedstawiony plan powinien spełniać założenia wyszczególnione w sekcji user stories: @project-prd.md

Wykorzystaj @supabase-auth.mdc do uzyskania poprawnej integracji procesu logowania z Supabase Auth.

Zanim rozpoczniemy, zadaj mi 5 kluczowych pytań technicznych adresujących niejasne elementy integracji, które pomogą ci przeprowadzić całą implementację od początku do końca.$prompt10$,
        4,
        'published',
        NULL
    );

    -- Prompt 6/24: Logout Functionality Implementation
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
        v_segment_l1_auth_id,
        'Logout Functionality Implementation',
        'Implementacja Funkcjonalności Wylogowania',
        'Extends Layout component with user session verification and logout functionality for authenticated users.',
        'Rozbudowuje komponent Layout o weryfikację sesji użytkownika i funkcjonalność wylogowania dla zalogowanych użytkowników.',
        $prompt11$Extend @Layout.astro with user state verification - for logged-in users, introduce the ability to log out of the application according to @astro.mdc @react.mdc$prompt11$,
        $prompt12$Rozbuduj @Layout.astro o weryfikację stanu użytkownika - dla zalogowanych wprowadź możliwość wylogowywania się z aplikacji zgodnie z @astro.mdc @react.mdc$prompt12$,
        5,
        'published',
        NULL
    );

    -- Prompt 7/24: Route Protection Implementation
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
        v_segment_l1_auth_id,
        'Route Protection Implementation',
        'Implementacja Ochrony Tras',
        'Implements universal route protection mechanism preventing unauthenticated users from accessing protected pages.',
        'Implementuje uniwersalny mechanizm ochrony tras zapobiegający niezalogowanym użytkownikom dostępu do chronionych stron.',
        $prompt13$Make sure that entering the main page @generate.astro is not possible for logged-out users.

Use instructions from @supabase-auth.mdc and implement this mechanism in the most universal and engineering-compliant way.$prompt13$,
        $prompt14$Upewnij się, że wejście na stronę główną @generate.astro nie jest możliwe dla niezalogowanych użytkowników.

Wykorzystaj instrukcje z @supabase-auth.mdc i zaimplementuj ten mechanizm w maksymalnie uniwersalny i zgodny z praktykami inżynierskimi sposób.$prompt14$,
        6,
        'published',
        NULL
    );

    -- Prompt 8/24: Signup Backend Implementation
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
        v_segment_l1_auth_id,
        'Signup Backend Implementation',
        'Implementacja Backendu Rejestracji',
        'Implements backend logic for signup page and form component consistent with login flow, including email confirmation handling.',
        'Implementuje logikę backendową dla strony rejestracji i komponentu formularza zgodnie z przepływem logowania, w tym obsługę potwierdzenia e-mail.',
        $prompt15$Using @supabase-auth.mdc implement the backend under the page @signup.astro and component @SignupForm.tsx

The logic should be consistent with @login.astro and @LoginForm.tsx

Take into account the behavior of supabase - after registration, a link will be sent to confirm the account by the user - inform about this.$prompt15$,
        $prompt16$Wykorzystując @supabase-auth.mdc zaimplementuj backend pod stronę @signup.astro i komponent @SignupForm.tsx

Logika powinna być spójna z @login.astro oraz @LoginForm.tsx

Weź pod uwagę zachowanie supabase - po rejestracji zostanie wysłany link do potwierdzenia konta przez użytkownika - poinformuj o tym.$prompt16$,
        7,
        'published',
        NULL
    );

    -- Prompt 9/24: Component Structure Visualization
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
        v_segment_l2_unit_tests_id,
        'Component Structure Visualization',
        'Wizualizacja Struktury Komponentów',
        'Generates ASCII diagram showing component structure and dependencies starting from specified component.',
        'Generuje diagram ASCII pokazujący strukturę komponentów i zależności począwszy od wskazanego komponentu.',
        $prompt17$In ASCII format, present the structure of components and dependencies starting from @RulePreview.tsx$prompt17$,
        $prompt18$W formacie ASCII przedstaw strukturę komponentów i zależności rozpoczynając od @RulePreview.tsx$prompt18$,
        0,
        'published',
        NULL
    );

    -- Prompt 10/24: Unit Testing Candidate Analysis
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
        v_segment_l2_unit_tests_id,
        'Unit Testing Candidate Analysis',
        'Analiza Kandydatów do Testów Jednostkowych',
        'Analyzes project components to identify which elements should be covered with unit tests and provides reasoning.',
        'Analizuje komponenty projektu w celu identyfikacji elementów, które powinny być objęte testami jednostkowymi wraz z uzasadnieniem.',
        $prompt19$Which elements of this project fragment are worth testing with unit tests and why?$prompt19$,
        $prompt20$Które elementy tego fragmentu projektu warto przetestować z wykorzystaniem unit testów i dlaczego?$prompt20$,
        1,
        'published',
        NULL
    );

    -- Prompt 11/24: Unit Tests Implementation
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
        v_segment_l2_unit_tests_id,
        'Unit Tests Implementation',
        'Implementacja Testów Jednostkowych',
        'Creates comprehensive unit test suite for specified service covering business rules and edge cases following Vitest best practices.',
        'Tworzy kompleksowy zestaw testów jednostkowych dla wskazanego serwisu, obejmujący reguły biznesowe i przypadki brzegowe zgodnie z najlepszymi praktykami Vitest.',
        $prompt21$Prepare a set of unit tests for `RulesBuilderService.generateRulesContent()` taking into account key business rules and edge cases @vitest-unit-testing.mdc$prompt21$,
        $prompt22$Przygotuj zestaw testów jednostkowych dla `RulesBuilderService.generateRulesContent()` z uwzględnieniem kluczowych reguł biznesowych i warunków brzegowych @vitest-unit-testing.mdc$prompt22$,
        2,
        'published',
        NULL
    );

    -- Prompt 12/24: Component Complexity Analysis
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
        v_segment_l4_refactor_id,
        'Component Complexity Analysis',
        'Analiza Złożoności Komponentów',
        'Analyzes components folder to identify top 5 files with highest LOC and suggests refactoring directions based on tech stack.',
        'Analizuje folder komponentów w celu identyfikacji TOP 5 plików o największej liczbie linii kodu i sugeruje kierunki refaktoryzacji w oparciu o stos technologiczny.',
        $prompt23$Review all files in the @components folder identifying those with the highest number of lines of code.

1) Select and list the paths of the TOP 5 files with the highest LOC, indicating potentially high complexity.

2) Review each file from the TOP 5 suggesting potential refactoring directions (patterns, techniques, and improvements tailored to the technology encountered there) with argumentation.

For reference, base on @tech-stack.md$prompt23$,
        $prompt24$Zapoznaj się z wszystkimi plikami w folderze @components identyfikując te o największej liczbie linijek kodu.

1) Wyselekcjonuj i wypisz ścieżki TOP 5 plików o największej liczbie LOC, wskazując na potencjalnie wysoką złożoność.

2) Zapoznaj się z każdym plikiem z TOP 5 sugerując potencjalne kierunki refaktoryzacji (wzorce, techniki i ulepszenia dopasowanej do napotkanej tam technologii) wraz z argumentacją.

Dla referencji bazuj na @tech-stack.md$prompt24$,
        0,
        'published',
        NULL
    );

    -- Prompt 13/24: React Hook Form Refactoring Plan
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
        v_segment_l4_refactor_id,
        'React Hook Form Refactoring Plan',
        'Plan Refaktoryzacji React Hook Form',
        'Creates detailed refactoring plan for migrating form components to React Hook Form, including API call management and testing strategy.',
        'Tworzy szczegółowy plan refaktoryzacji komponentów formularzy do React Hook Form, w tym zarządzanie wywołaniami API i strategię testowania.',
        $prompt25$You are an experienced React developer tasked with refactoring components using React Hook Form. Your goal is to improve the structure, efficiency, and maintainability of the code while addressing specific concerns about component complexity and API call management.

Components: {{COMPONENTS}}

Tech Stack: {{TECH_STACK}}

Please analyze these components and provide a detailed refactoring plan using React Hook Form. Follow these steps:

1. Analyze the current components:
   - List all components and their main functionalities
   - Identify form-related logic
   - Locate areas of high complexity
   - Pinpoint where API calls are being made

2. Implement React Hook Form:
   - Explain how to integrate React Hook Form into each component
   - Describe any necessary changes to the component structure

3. Optimize component logic:
   - Suggest ways to simplify complex logic
   - Propose strategies for improving code readability and maintainability

4. Manage API calls:
   - Recommend best practices for handling API calls
   - If appropriate, suggest moving API calls to a separate service or custom hook

5. Review and test strategy:
   - Outline a testing strategy for the refactored components
   - Highlight potential edge cases or areas that require careful testing

Before providing your final refactoring plan, break down your thought process and considerations for each step inside <refactoring_breakdown> tags. For each component:

- Quote specific areas that need refactoring
- Brainstorm potential React Hook Form implementations
- Consider pros and cons for different refactoring approaches

This will ensure a thorough approach to the refactoring task. It's OK for this section to be quite long.

Your final output should be structured as follows:

1. Analysis
2. Refactoring Plan
   2.1 Component Structure Changes
   2.2 React Hook Form Implementation
   2.3 Logic Optimization
   2.4 API Call Management
   2.5 Testing Strategy

Please proceed with your refactoring breakdown and refactoring plan.$prompt25$,
        $prompt26$You are an experienced React developer tasked with refactoring components using React Hook Form. Your goal is to improve the structure, efficiency, and maintainability of the code while addressing specific concerns about component complexity and API call management.

Components: {{COMPONENTS}}

Tech Stack: {{TECH_STACK}}

Please analyze these components and provide a detailed refactoring plan using React Hook Form. Follow these steps:

1. Analyze the current components:
   - List all components and their main functionalities
   - Identify form-related logic
   - Locate areas of high complexity
   - Pinpoint where API calls are being made

2. Implement React Hook Form:
   - Explain how to integrate React Hook Form into each component
   - Describe any necessary changes to the component structure

3. Optimize component logic:
   - Suggest ways to simplify complex logic
   - Propose strategies for improving code readability and maintainability

4. Manage API calls:
   - Recommend best practices for handling API calls
   - If appropriate, suggest moving API calls to a separate service or custom hook

5. Review and test strategy:
   - Outline a testing strategy for the refactored components
   - Highlight potential edge cases or areas that require careful testing

Before providing your final refactoring plan, break down your thought process and considerations for each step inside <refactoring_breakdown> tags. For each component:

- Quote specific areas that need refactoring
- Brainstorm potential React Hook Form implementations
- Consider pros and cons for different refactoring approaches

This will ensure a thorough approach to the refactoring task. It's OK for this section to be quite long.

Your final output should be structured as follows:

1. Analysis
2. Refactoring Plan
   2.1 Component Structure Changes
   2.2 React Hook Form Implementation
   2.3 Logic Optimization
   2.4 API Call Management
   2.5 Testing Strategy

Please proceed with your refactoring breakdown and refactoring plan.$prompt26$,
        1,
        'published',
        NULL
    );

    -- Prompt 14/24: Accessibility Evaluation
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
        v_segment_l4_refactor_id,
        'Accessibility Evaluation',
        'Ocena Dostępności',
        'Evaluates proposed solutions on 1-10 scale considering user accessibility and usability based on industry research.',
        'Ocenia proponowane rozwiązania w skali 1-10 pod kątem dostępności i użyteczności dla użytkowników w oparciu o badania branżowe.',
        $prompt27$Evaluate each proposal on a scale of 1-10 in terms of accessibility and ease of use. I care about the user's perspective.

Take into account industry research and studies on each proposal.$prompt27$,
        $prompt28$Oceń w skali 1-10 każdą z propozycji pod kątem dostępności i łatwości obsługi. Zależy mi na perspektywie użytkownika.

Weź pod uwagę branżowe badania i opracowania na temat każdej z propozycji.$prompt28$,
        2,
        'published',
        NULL
    );

    -- Prompt 15/24: Mobile Navigation Specification
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
        v_segment_l4_refactor_id,
        'Mobile Navigation Specification',
        'Specyfikacja Nawigacji Mobilnej',
        'Creates business specification for mobile navigation changes in TwoPane component, including footer hiding on small screens.',
        'Tworzy specyfikację biznesową zmian nawigacji mobilnej w komponencie TwoPane, w tym ukrywanie stopki na małych ekranach.',
        $prompt29$I decided on option #3. As a frontend, React and Tailwind specialist, create a business specification of changes in the @TwoPane.tsx component. Add information about @tech-stack.md. The specification should not contain implementation details, but only references to components. Make sure that the behavior of panels in desktop mode will not be violated.

Extend the proposed change to hide the classic footer @Footer.tsx in favor of mobile navigation on small screens.

Save the specification in the file in the .ai/ui/mobile-navigation.md folder$prompt29$,
        $prompt30$Zdecydowałem się na opcję nr 3. Jako specjalista frontendu, Reacta i Tailwinda, utwórz specyfikację biznesową zmian w komponencie @TwoPane.tsx. Dodaj informacje o @tech-stack.md. Specyfikacja nie powinna zawierać detali implementacyjnych, a wyłącznie referencje do komponentów. Upewnij się, że zachowanie paneli w trybie desktop nie zostanie naruszone.

Rozszerz proponowaną zmianę o ukrywanie klasycznej stopki @Footer.tsx na rzecz nawigacji mobile na małych ekranach.

Zapisz specyfikację w pliku w folderze .ai/ui/mobile-navigation.md$prompt30$,
        3,
        'published',
        NULL
    );

    -- Prompt 16/24: Mobile Navigation Implementation
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
        v_segment_l4_refactor_id,
        'Mobile Navigation Implementation',
        'Implementacja Nawigacji Mobilnej',
        'Implements mobile navigation changes across all affected components following the specification and React best practices.',
        'Implementuje zmiany nawigacji mobilnej we wszystkich dotkniętych komponentach zgodnie ze specyfikacją i najlepszymi praktykami React.',
        $prompt31$You are an experienced senior frontend developer.
Implement necessary changes in the project to implement @mobile-navigation.md

Update all indicated components so that they comprehensively influence the completion of the task.

Remember to comply with @tech-stack.md and @react-development.mdc$prompt31$,
        $prompt32$Jesteś doświadczonym senior frontend developerem.
Zaimplementuj niezbędne zmiany w projekcie aby zrealizować @mobile-navigation.md

Zaktualizuj wszystkie wskazane komponenty tak, aby całościowo wpływały na realizację zadania.

Pamiętaj o zgodności z @tech-stack.md oraz @react-development.mdc$prompt32$,
        4,
        'published',
        NULL
    );

    -- Prompt 17/24: React 19 Migration Assessment
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
        v_segment_l4_refactor_id,
        'React 19 Migration Assessment',
        'Ocena Migracji do React 19',
        'Analyzes components in rule-builder folder to identify which require updates for React 19 migration.',
        'Analizuje komponenty w folderze rule-builder w celu identyfikacji wymagających aktualizacji w ramach migracji do React 19.',
        $prompt33$Review the content of @R19Migration and then assess which components in the @rule-builder folder will require correction in case of migration to React 19.$prompt33$,
        $prompt34$Zapoznaj się z treścią @R19Migration a następnie oceń, które komponenty w folderze @rule-builder będą wymagać korekty w przypadku migracji do Reacta 19.$prompt34$,
        5,
        'published',
        NULL
    );

    -- Prompt 18/24: Domain-Driven Design Restructuring
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
        v_segment_l4_refactor_id,
        'Domain-Driven Design Restructuring',
        'Restrukturyzacja Domain-Driven Design',
        'Proposes domain extraction strategy using DDD patterns (strategic and tactical) to improve project maintainability.',
        'Proponuje strategię ekstrakcji domen z wykorzystaniem wzorców DDD (strategicznych i taktycznych) w celu poprawy utrzymywalności projektu.',
        $prompt35$The 10xRules project is becoming difficult to maintain. We are preparing to extract domains from the application based on @project-prd.md and the structure and content of the project.

Propose the shape of an example domain according to going cross-sectionally through all layers of the application, describing refactoring suggestions. What DDD patterns - strategic and tactical - should be taken into account?$prompt35$,
        $prompt36$Projekt 10xRules staje się trudny w utrzymaniu. Przygotowujemy się do wyodrębnienia domen z aplikacji bazując na @project-prd.md oraz strukturze i zawartości projektu.

Zaproponuj kształt przykładowej domeny zgodnie przechodząc przekrojowo przez wszystkie warstwy aplikacji, opisując sugestie refaktoryzacji. Jakie wzorce DDD - strategiczne i taktyczne - warto wziąć pod uwagę?$prompt36$,
        6,
        'published',
        NULL
    );

    -- Prompt 19/24: Row Level Security Migration
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
        v_segment_l4_refactor_id,
        'Row Level Security Migration',
        'Migracja Row Level Security',
        'Creates Supabase migration adding Row Level Security to all CRUD operations on collections table with implementation instructions.',
        'Tworzy migrację Supabase dodającą Row Level Security do wszystkich operacji CRUD na tabeli kolekcji wraz z instrukcjami implementacji.',
        $prompt37$Create a new migration adding RLS to all CRUD operations in the collections table (@database.types.ts) based on recommendations from @supabase-migrations.mdc

Additionally, present instructions for executing the migration on the database and applying changes.$prompt37$,
        $prompt38$Utwórz nową migrację dodającą RLS na wszystkie operacje CRUD w tabeli kolekcji (@database.types.ts ) bazując na rekomendacjach z @supabase-migrations.mdc

Dodatkowo, przedstaw instrukcję wykonania migracji na bazie i zaaplikowania zmian.$prompt38$,
        7,
        'published',
        NULL
    );

    -- Prompt 20/24: Pull Request CI/CD Workflow
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
        v_segment_l5_cicd_id,
        'Pull Request CI/CD Workflow',
        'Workflow CI/CD Pull Request',
        'Creates GitHub Actions workflow for pull requests including linting, parallel unit and e2e tests, coverage collection, and PR status comments.',
        'Tworzy workflow GitHub Actions dla pull requestów, w tym linting, równoległe testy jednostkowe i e2e, zbieranie pokrycia oraz komentarze statusu PR.',
        $prompt39$You are a GitHub Actions specialist in the stack @tech-stack.md @package.json

Create a "pull-request.yml" scenario based on @github-action.mdc

Workflow:
The "pull-request.yml" scenario should work as follows:

- Linting code
- Then two parallel - unit-test and e2e-test
- Finally - status-comment (comment to PR about the status of the whole)

Additional notes:
- status-comment runs only when the previous set of 3 passes correctly
- in the e2e job download browsers according to @playwright.config.ts
- in the e2e job set the "integration" environment and variables from secrets according to @.env.example
- collect coverage of unit tests and e2e tests$prompt39$,
        $prompt40$Jesteś specjalistą GitHub Actions w stacku @tech-stack.md  @package.json

Utwórz scenariusz "pull-request.yml" na podstawie @github-action.mdc

Workflow:
Scenariusz "pull-request.yml" powinien działać następująco:

- Lintowanie kodu
- Następnie dwa równoległe - unit-test i e2e-test
- Finalnie - status-comment (komentarz do PRa o statusie całości)

Dodatkowe uwagi:
- status-comment uruchamia się tylko kiedy poprzedni zestaw 3 przejdzie poprawnie
- w jobie e2e pobieraj przeglądarki wg @playwright.config.ts
- w jobie e2e ustaw środowisko "integration" i zmienne z sekretów wg @.env.example
- zbieraj coverage unit testów i testów e2e$prompt40$,
        0,
        'published',
        NULL
    );

    -- Prompt 21/24: Feature Flags System Design
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
        v_segment_l6_deploy_id,
        'Feature Flags System Design',
        'Projektowanie Systemu Feature Flags',
        'Designs universal TypeScript feature flag module for frontend and backend supporting environment-based toggles for auth and collections.',
        'Projektuje uniwersalny moduł TypeScript feature flag dla frontendu i backendu wspierający przełączniki oparte na środowisku dla autentykacji i kolekcji.',
        $prompt41$In my application, I would like to separate deployments from releases by introducing a feature flag system.

It should be applicable:

- at the api endpoint level (collections, auth)
- at the astro pages level – @login.astro @signup.astro @reset-password.astro
- at the collections visibility level – @TwoPane.tsx and @MobileNavigation.tsx

At the level of the mentioned modules, I should be able to check the state of the flag for a given functionality, according to the environment.

Design a universal TypeScript module that can be used on the frontend and backend (src/features), which will store flag configuration for local, integration, and production environments. Add flags for "auth" and "collections".

I will provide the environment as the ENV_NAME variable (local, integration, prod)

We will deal with integration in the next step. Before we start, ask me 5 questions that will facilitate the entire implementation.$prompt41$,
        $prompt42$W mojej aplikacji chciałbym rozdzielić deploymenty od releasów wprowadzając system feature flag.

Powinien być możliwy do zastosowania:

- na poziomie endpointów api (collections, auth)
- na poziomie stron astro – @login.astro @signup.astro @reset-password.astro
- na poziomie widoczności kolekcji – @TwoPane.tsx oraz @MobileNavigation.tsx

Na poziomie wspomnianych modułów powinienem być w stanie sprawdzić stan flagi określonej funkcjonalności, wg środowiska.

Zaprojektuj uniwersalny moduł TypeScript z którego będzie można korzystać na frontendzie i backendzie (src/features), który będzie przechowywał konfigurację flag dla środowisk local, integration i production. Dodaj flagi dla "auth" i "collections".

Środowisko dostarczę jako zmienną ENV_NAME (local, integration, prod)

Integracją zajmiemy się w kolejnym kroku. Zanim rozpoczniemy, zadaj mi 5 pytań, które ułatwią ci całą implementację.$prompt42$,
        0,
        'published',
        NULL
    );

    -- Prompt 22/24: Cloudflare Pages Deployment Setup
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
        v_segment_l6_deploy_id,
        'Cloudflare Pages Deployment Setup',
        'Konfiguracja Deploymentu Cloudflare Pages',
        'Configures project for Cloudflare Pages and creates GitHub Actions workflow for automated deployment without e2e tests.',
        'Konfiguruje projekt dla Cloudflare Pages i tworzy workflow GitHub Actions dla automatycznego wdrożenia bez testów e2e.',
        $prompt43$You are a GitHub Actions and Cloudflare specialist.

1) Review the project:

- Tech Stack @tech-stack.md
- Current project configuration @astro.config.mjs
- Dependencies and scripts @package.json
- Available environment variables @.env.example

2) Adapt the project to support deployment to Cloudflare

3) Create a CI/CD scenario "master.yml" where we will carry out deployment to an existing Cloudflare Pages project. Base on @pull-request.yml but in the new scenario do not test E2E.

4) At the end, fix the scenario using @github-action.mdc$prompt43$,
        $prompt44$Jesteś specjalistą GitHub Actions i Cloudflare.

1) Zapoznaj się z projektem:

- Tech Stack @tech-stack.md
- Aktualna konfiguracja projektu @astro.config.mjs
- Zależności i skrypty @package.json
- Dostępne zmienne środowiskowe @.env.example

2) Dostosuj projekt aby wspierać deployment na Cloudflare

3) Utwórz scenariusz CI/CD "master.yml" gdzie przeprowadzimy wdrożenie na istniejący projekt Cloudflare Pages. Bazuj na @pull-request.yml ale w nowym scenariuszu nie testuj E2E.

4) Na koniec popraw scenariusz z wykorzystaniem @github-action.mdc$prompt44$,
        1,
        'published',
        NULL
    );

    -- Prompt 23/24: Docker DigitalOcean Deployment Pipeline
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
        v_segment_l6_deploy_id,
        'Docker DigitalOcean Deployment Pipeline',
        'Pipeline Deploymentu Docker DigitalOcean',
        'Creates GitHub Actions workflow building Docker image, pushing to GitHub Container Registry, and deploying to DigitalOcean App Platform.',
        'Tworzy workflow GitHub Actions budujący obraz Docker, wysyłający do GitHub Container Registry i wdrażający na DigitalOcean App Platform.',
        $prompt45$You are a DevOps specialist who is preparing a CI/CD scenario in GitHub Actions - "master-docker.yml".

Prepare a scenario that will place the image @Dockerfile in GitHub Container Registry - "{owner}/{appname}" and then execute Deploy to DigitalOcean App Platform. The container can be tagged with the SHA of the last commit on master.

The job for building the image should use the GHA "production" environment and receive the PUBLIC_ENV_NAME secret as an argument.

<owner>psmyrdek</owner>
<appname>10xrules</appname>

When creating the action, base on @master.yml (most important steps - lint, unit-test)

After completing the draft, make sure you are using the latest and current versions of actions @github-action.mdc

Before we start, ask me additional questions that will help you complete this task.$prompt45$,
        $prompt46$Jesteś specjalistą DevOps który przygotowuje scenariusz CI/CD w GitHub Actions - "master-docker.yml".

Przygotuj scenariusz  który umieści obraz @Dockerfile w GitHub Container Registry - "{owner}/{appname}" a następnie wykona Deploy na DigitalOcean App Platform. Kontener może być tagowany SHA ostatniego commita na masterze.

Job do budowania obrazu powinien korzystać ze środowiska GHA "production" i jako argument pobierać sekret PUBLIC_ENV_NAME.

<owner>psmyrdek</owner>
<appname>10xrules</appname>

Tworząc akcję bazuj na @master.yml (najważniejsze kroki - lint, unit-test)

Po ukończeniu draftu, upewnij się, że korzystasz z najnowszych i aktualnych wersji akcji @github-action.mdc

Zanim rozpoczniemy, zadaj mi dodatkowe pytania które pomogą ci ukończyć to zadanie.$prompt46$,
        2,
        'published',
        NULL
    );

    -- Prompt 24/24: GitHub Action Version Fix
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
        v_segment_l6_deploy_id,
        'GitHub Action Version Fix',
        'Naprawa Wersji GitHub Action',
        'Troubleshoots and fixes DigitalOcean action version error in deployment workflow using updated GitHub Actions.',
        'Diagnozuje i naprawia błąd wersji akcji DigitalOcean w workflow wdrożenia przy użyciu zaktualizowanych GitHub Actions.',
        $prompt47$The scenario has an error: "Unable to resolve action `digitalocean/app-deploy-action@v1`, repository or version not found"

Fix this with @github-action.mdc$prompt47$,
        $prompt48$Scenariusz ma błąd: "Unable to resolve action `digitalocean/app-deploy-action@v1`, repository or version not found"

Napraw to z @github-action.mdc$prompt48$,
        3,
        'published',
        NULL
    );

    RAISE NOTICE 'Successfully seeded % prompts for M3', 24;
END $$;

-- =====================================================
-- Seed completed successfully
-- =====================================================