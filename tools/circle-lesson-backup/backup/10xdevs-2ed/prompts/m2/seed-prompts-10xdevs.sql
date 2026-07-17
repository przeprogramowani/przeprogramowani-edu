-- Seed prompts for 10xDevs organization
-- Generated from .ai/prompt-library/prompts10xDevs/
-- Run this in Supabase SQL Editor after migrations

DO $$
DECLARE
  v_org_id UUID;
  v_coll_m2_bootstrap_id UUID;
  v_seg_l1_planning_id UUID;
  v_seg_l2_rules_for_ai_id UUID;
  v_seg_l3_database_id UUID;
  v_seg_l4_api_id UUID;
  v_seg_l5_ui_id UUID;
  v_seg_l6_business_logic_id UUID;
BEGIN
  -- Get 10xDevs organization ID
  SELECT id INTO v_org_id FROM organizations WHERE slug = '10xdevs';

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION '10xDevs organization not found. Please ensure the organization exists.';
  END IF;

  -- Insert collections
  INSERT INTO prompt_collections (organization_id, slug, title, description, sort_order)
  VALUES
    (v_org_id, 'm2-bootstrap', 'M2 Bootstrap', 'Complete set of prompts for bootstrapping M2 projects from planning to implementation', 1)
  ON CONFLICT (organization_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

  -- Get collection IDs
  SELECT id INTO v_coll_m2_bootstrap_id FROM prompt_collections WHERE organization_id = v_org_id AND slug = 'm2-bootstrap';

  -- Insert segments for M2 Bootstrap
  INSERT INTO prompt_collection_segments (collection_id, slug, title, sort_order)
  VALUES
    (v_coll_m2_bootstrap_id, 'l1-planning', 'Planning', 1),
    (v_coll_m2_bootstrap_id, 'l2-rules-for-ai', 'Rules for AI', 2),
    (v_coll_m2_bootstrap_id, 'l3-database', 'Database', 3),
    (v_coll_m2_bootstrap_id, 'l4-api', 'API', 4),
    (v_coll_m2_bootstrap_id, 'l5-ui', 'UI', 5),
    (v_coll_m2_bootstrap_id, 'l6-business-logic', 'Business Logic', 6)
  ON CONFLICT (collection_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    sort_order = EXCLUDED.sort_order;

  -- Get segment IDs
  SELECT id INTO v_seg_l1_planning_id FROM prompt_collection_segments WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l1-planning';
  SELECT id INTO v_seg_l2_rules_for_ai_id FROM prompt_collection_segments WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l2-rules-for-ai';
  SELECT id INTO v_seg_l3_database_id FROM prompt_collection_segments WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l3-database';
  SELECT id INTO v_seg_l4_api_id FROM prompt_collection_segments WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l4-api';
  SELECT id INTO v_seg_l5_ui_id FROM prompt_collection_segments WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l5-ui';
  SELECT id INTO v_seg_l6_business_logic_id FROM prompt_collection_segments WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l6-business-logic';

  -- Delete existing prompts for collections being seeded (for idempotency)
  DELETE FROM prompts WHERE collection_id = v_coll_m2_bootstrap_id;

  -- Insert prompts
  -- Prompts for Planning
  INSERT INTO prompts (
    organization_id, collection_id, segment_id,
    title_en, title_pl,
    description_en, description_pl,
    markdown_body_en, markdown_body_pl,
    status, sort_order
  ) VALUES
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l1_planning_id,
    'PRD Planning Assistant', 'Asystent planowania PRD',
    'Interactive planning session for creating a Product Requirements Document. Generates questions and recommendations to help define product requirements for MVP.', 'Interaktywna sesja planistyczna do tworzenia Product Requirements Document. Generuje pytania i rekomendacje, które pomogą zdefiniować wymagania produktu dla MVP.',
    'You are an experienced product manager whose task is to help create a comprehensive Product Requirements Document (PRD) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to create a complete PRD.

Please carefully review the following information:

<project_description>
{{project-highlevel}} <- copy the high-level project description
</project_description>

Analyze the information provided, focusing on aspects relevant to PRD creation. Consider the following questions:
<prd_analysis>
1. Identify the main problem that the product is intended to solve.
2. Define the key functionalities of the MVP.
3. Consider potential user stories and paths of product usage.
4. Think about success criteria and how to measure them.
5. Assess design constraints and their impact on product development.
</prd_analysis>

Based on your analysis, generate a list of 10 questions and recommendations in a combined form (question + recommendation). These should address any ambiguities, potential issues, or areas where more information is needed to create an effective PRD. Consider questions about:

1. Details of the user''s problem
2. Prioritization of functionality
3. Expected user experience
4. Measurable success indicators
5. Potential risks and challenges
6. Schedule and resources

<questions>
List your questions and recommendations here, numbered for clarity:

For example:
1. Are you planning to introduce paid subscriptions from the start of the project?

Recommendation: The first phase of the project could focus on free features to attract users, and paid features could be introduced at a later stage.
</questions>

Continue this process, generating new questions and recommendations based on the user''s responses, until the user explicitly asks for a summary.

Remember to focus on clarity, relevance, and accuracy of results. Do not include any additional comments or explanations beyond the specified output format.

Analytical work should be done in the thinking block. The final output should consist solely of questions and recommendations and should not duplicate or repeat any work done in the prd_analysis section.', 'Jesteś doświadczonym menedżerem produktu, którego zadaniem jest pomoc w stworzeniu kompleksowego dokumentu wymagań projektowych (PRD) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do utworzenia pełnego PRD.

Prosimy o uważne zapoznanie się z poniższymi informacjami:

<project_description>
{{project-highlevel}} <- przekopiuj wysokopoziomowy opis projektu
</project_description>

Przeanalizuj dostarczone informacje, koncentrując się na aspektach istotnych dla tworzenia PRD. Rozważ następujące kwestie:
<prd_analysis>
1. Zidentyfikuj główny problem, który produkt ma rozwiązać.
2. Określ kluczowe funkcjonalności MVP.
3. Rozważ potencjalne historie użytkownika i ścieżki korzystania z produktu.
4. Pomyśl o kryteriach sukcesu i sposobach ich mierzenia.
5. Oceń ograniczenia projektowe i ich wpływ na rozwój produktu.
</prd_analysis>

Na podstawie analizy wygeneruj listę 10 pytań i zaleceń w formie łączonej (pytanie + zalecenie). Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby stworzyć skuteczny PRD. Rozważ pytania dotyczące:

1. Szczegółów problemu użytkownika
2. Priorytetyzacji funkcjonalności
3. Oczekiwanego doświadczenia użytkownika
4. Mierzalnych wskaźników sukcesu
5. Potencjalnych ryzyk i wyzwań
6. Harmonogramu i zasobów

<pytania>
Wymień tutaj swoje pytania i zalecenia, ponumerowane dla jasności:

Przykładowo:
1. Czy już od startu projektu planujesz wprowadzenie płatnych subskrypcji?

Rekomendacja: Pierwszy etap projektu może skupić się na funkcjonalnościach darmowych, aby przyciągnąć użytkowników, a płatne funkcje można wprowadzić w późniejszym etapie.
</pytania>

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.

Pamiętaj, aby skupić się na jasności, trafności i dokładności wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

Pracę analityczną należy przeprowadzić w bloku myślenia. Końcowe dane wyjściowe powinny składać się wyłącznie z pytań i zaleceń i nie powinny powielać ani powtarzać żadnej pracy wykonanej w sekcji prd_analysis.',
    'published', 0
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l1_planning_id,
    'PRD Planning Session Summary', 'Podsumowanie sesji planowania PRD',
    'Consolidates decisions and recommendations from PRD planning session. Creates structured summary ready for use in the next stage of generating the complete document.', 'Konsoliduje decyzje i rekomendacje z sesji planistycznej PRD. Tworzy strukturyzowane podsumowanie gotowe do użycia w następnym etapie generowania pełnego dokumentu.',
    '{{latest-round-answers}} <- your list of answers to the last round of questions

---

You are an AI assistant whose task is to summarize a conversation about PRD (Product Requirements Document) planning for MVP and prepare a concise summary for the next development stage. In the conversation history you will find the following information:
1. Project description
2. Identified user problem
3. Conversation history containing questions and answers
4. Recommendations regarding PRD content

Your task is to:
1. Summarize the conversation history, focusing on all decisions related to PRD planning.
2. Match the model''s recommendations to the answers given in the conversation history. Identify which recommendations are relevant based on the discussion.
3. Prepare a detailed conversation summary that includes:
   a. Main functional requirements of the product
   b. Key user stories and usage paths
   c. Important success criteria and ways to measure them
   d. Any unresolved issues or areas requiring further clarification
4. Format the results as follows:

<conversation_summary>
<decisions>
[List decisions made by the user, numbered].
</decisions>

<matched_recommendations>
[List of the most relevant recommendations matched to the conversation, numbered]
</matched_recommendations>

<prd_planning_summary>
[Provide a detailed summary of the conversation, including the elements listed in step 3].
</prd_planning_summary>

<unresolved_issues>
[List any unresolved issues or areas requiring further clarification, if any exist]
</unresolved_issues>
</conversation_summary>

The final result should contain only content in markdown format. Ensure that your summary is clear, concise, and provides valuable information for the next stage of creating the PRD.', '{{latest-round-answers}} <- twoja lista odpowiedzi na ostatnią rundę pytań

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania PRD (Product Requirements Document) dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:
1. Opis projektu
2. Zidentyfikowany problem użytkownika
3. Historia rozmów zawierająca pytania i odpowiedzi
4. Zalecenia dotyczące zawartości PRD

Twoim zadaniem jest:
1. Podsumować historię konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem PRD.
2. Dopasowanie zaleceń modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikuj, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotuj szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania funkcjonalne produktu
   b. Kluczowe historie użytkownika i ścieżki korzystania
   c. Ważne kryteria sukcesu i sposoby ich mierzenia
   d. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatuj wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>

<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>

<prd_planning_summary>
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</prd_planning_summary>

<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu tworzenia PRD.',
    'published', 1
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l1_planning_id,
    'Complete PRD Generation', 'Generowanie kompletnego PRD',
    'Creates detailed Product Requirements Document based on planning session summary. Includes all sections: overview, functional requirements, user stories, and success metrics.', 'Tworzy szczegółowy Product Requirements Document na podstawie podsumowania sesji planistycznej. Zawiera wszystkie sekcje: przegląd, wymagania funkcjonalne, historie użytkownika i metryki sukcesu.',
    'You are an experienced product manager whose task is to create a comprehensive Product Requirements Document (PRD) based on the following descriptions:

<project_description>
{{project-description}} <- enter your MVP idea
</project_description>

<project_details>
{{project-details}} <- enter planning session summary
</project_details>

Follow these steps to create a comprehensive and well-organized document:

1. Divide the PRD into the following sections:
   a. Project Overview
   b. User Problem
   c. Functional Requirements
   d. Project Boundaries
   e. User Stories
   f. Success Metrics

2. In each section, provide detailed and relevant information based on the project description and answers to clarifying questions. Make sure to:
   - Use clear and concise language
   - Provide specific details and data as needed
   - Maintain consistency throughout the document
   - Address all points listed in each section

3. When creating user stories and acceptance criteria
   - List ALL necessary user stories, including basic, alternative, and edge case scenarios.
   - Assign a unique requirement identifier (e.g., US-001) to each user story for direct traceability.
   - Include at least one user story specifically for secure access or authentication, if the application requires user identification or access restrictions.
   - Ensure that no potential user interaction is omitted.
   - Ensure that each user story is testable.

Use the following structure for each user story:
- ID
- Title
- Description
- Acceptance Criteria

4. After completing the PRD, review it against this checklist:
   - Is each user story testable?
   - Are the acceptance criteria clear and specific?
   - Do we have enough user stories to build a fully functional application?
   - Have we included authentication and authorization requirements (if applicable)?

5. PRD Formatting:
   - Maintain consistent formatting and numbering.
   - Do not use bold formatting in markdown ( ** ).
   - List ALL user stories.
   - Format the PRD in proper markdown.

Prepare the PRD with the following structure:

```markdown
# Product Requirements Document (PRD) - {{app-name}}
## 1. Product Overview
## 2. User Problem
## 3. Functional Requirements
## 4. Product Boundaries
## 5. User Stories
## 6. Success Metrics
```

Remember to fill each section with detailed, relevant information based on the project description and our clarifying questions. Ensure the PRD is comprehensive, clear, and contains all relevant information needed for further product development.

The final output should consist solely of the PRD in the specified markdown format, which you will save in the file .ai/prd.md', 'Jesteś doświadczonym menedżerem produktu, którego zadaniem jest stworzenie kompleksowego dokumentu wymagań produktu (PRD) w oparciu o poniższe opisy:

<project_description>
{{project-description}} <- wprowadź pomysł na MVP
</project_description>

<project_details>
{{project-details}} <- wprowadź podsumowanie sesji planistycznej
</project_details>

Wykonaj następujące kroki, aby stworzyć kompleksowy i dobrze zorganizowany dokument:

1. Podziel PRD na następujące sekcje:
   a. Przegląd projektu
   b. Problem użytkownika
   c. Wymagania funkcjonalne
   d. Granice projektu
   e. Historie użytkownika
   f. Metryki sukcesu

2. W każdej sekcji należy podać szczegółowe i istotne informacje w oparciu o opis projektu i odpowiedzi na pytania wyjaśniające. Upewnij się, że:
   - Używasz jasnego i zwięzłego języka
   - W razie potrzeby podajesz konkretne szczegóły i dane
   - Zachowujesz spójność w całym dokumencie
   - Odnosisz się do wszystkich punktów wymienionych w każdej sekcji

3. Podczas tworzenia historyjek użytkownika i kryteriów akceptacji
   - Wymień WSZYSTKIE niezbędne historyjki użytkownika, w tym scenariusze podstawowe, alternatywne i skrajne.
   - Przypisz unikalny identyfikator wymagań (np. US-001) do każdej historyjki użytkownika w celu bezpośredniej identyfikowalności.
   - Uwzględnij co najmniej jedną historię użytkownika specjalnie dla bezpiecznego dostępu lub uwierzytelniania, jeśli aplikacja wymaga identyfikacji użytkownika lub ograniczeń dostępu.
   - Upewnij się, że żadna potencjalna interakcja użytkownika nie została pominięta.
   - Upewnij się, że każda historia użytkownika jest testowalna.

Użyj następującej struktury dla każdej historii użytkownika:
- ID
- Tytuł
- Opis
- Kryteria akceptacji

4. Po ukończeniu PRD przejrzyj go pod kątem tej listy kontrolnej:
   - Czy każdą historię użytkownika można przetestować?
   - Czy kryteria akceptacji są jasne i konkretne?
   - Czy mamy wystarczająco dużo historyjek użytkownika, aby zbudować w pełni funkcjonalną aplikację?
   - Czy uwzględniliśmy wymagania dotyczące uwierzytelniania i autoryzacji (jeśli dotyczy)?

5. Formatowanie PRD:
   - Zachowaj spójne formatowanie i numerację.
   - Nie używaj pogrubionego formatowania w markdown ( ** ).
   - Wymień WSZYSTKIE historyjki użytkownika.
   - Sformatuj PRD w poprawnym markdown.

Przygotuj PRD z następującą strukturą:

```markdown
# Dokument wymagań produktu (PRD) - {{app-name}}
## 1. Przegląd produktu
## 2. Problem użytkownika
## 3. Wymagania funkcjonalne
## 4. Granice produktu
## 5. Historyjki użytkowników
## 6. Metryki sukcesu
```

Pamiętaj, aby wypełnić każdą sekcję szczegółowymi, istotnymi informacjami w oparciu o opis projektu i nasze pytania wyjaśniające. Upewnij się, że PRD jest wyczerpujący, jasny i zawiera wszystkie istotne informacje potrzebne do dalszej pracy nad produktem.

Ostateczny wynik powinien składać się wyłącznie z PRD zgodnego ze wskazanym formatem w markdown, który zapiszesz w pliku .ai/prd.md',
    'published', 2
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l1_planning_id,
    'Tech Stack Analysis', 'Analiza stacku technologicznego',
    'Critical evaluation of chosen technology stack against PRD requirements. Verifies MVP delivery speed, scalability, costs, and potential risks.', 'Krytyczna ocena wybranego stacku technologicznego pod kątem zgodności z wymaganiami PRD. Weryfikuje szybkość dostarczenia MVP, skalowalność, koszty i potencjalne ryzyka.',
    '<tech-stack>
{{tech-stack}} <- enter your stack description here
</tech-stack>

Conduct a critical but objective analysis of whether <tech-stack> adequately addresses the needs in @prd.md. Consider the following questions:
1. Will the technology allow us to quickly deliver an MVP?
2. Will the solution be scalable as the project grows?
3. Will the cost of maintenance and development be acceptable?
4. Do we need such a complex solution?
5. Is there a simpler approach that would meet our requirements?
6. Will the technology allow us to ensure proper security?', '<tech-stack>
{{tech-stack}} <- wprowadź tutaj opis swojego stacku
</tech-stack>

Dokonaj krytycznej lecz rzeczowej analizy czy <tech-stack> odpowiednio adresuje potrzeby @prd.md. Rozważ następujące pytania:
1. Czy technologia pozwoli nam szybko dostarczyć MVP?
2. Czy rozwiązanie będzie skalowalne w miarę wzrostu projektu?
3. Czy koszt utrzymania i rozwoju będzie akceptowalny?
4. Czy potrzebujemy aż tak złożonego rozwiązania?
5. Czy nie istnieje prostsze podejście, które spełni nasze wymagania?
6. Czy technologie pozwoli nam zadbać o odpowiednie bezpieczeństwo?',
    'published', 3
  )
  ;

  -- Prompts for Rules for AI
  INSERT INTO prompts (
    organization_id, collection_id, segment_id,
    title_en, title_pl,
    description_en, description_pl,
    markdown_body_en, markdown_body_pl,
    status, sort_order
  ) VALUES
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l2_rules_for_ai_id,
    'Project README Generation', 'Generowanie README projektu',
    'Creates complete README.md file based on PRD, tech stack, and project dependencies. Includes all key sections following GitHub best practices.', 'Tworzy kompletny plik README.md na podstawie PRD, stacku technologicznego i zależności projektu. Zawiera wszystkie kluczowe sekcje zgodne z najlepszymi praktykami GitHub.',
    'You are an experienced programmer whose task is to create a README.md file for a GitHub project. Your goal is to create a comprehensive, well-organized README file that follows best practices and contains all relevant information from the provided project files.

Here are the project files to analyze:

<prd>
@prd.md
</prd>

<tech_stack>
@tech-stack.md
</tech_stack>

<dependencies>
@package.json
@.nvmrc
</dependencies>

Your task is to create a README.md file with the following structure:

1. Project name
2. Project description
3. Tech stack
4. Getting started locally
5. Available scripts
6. Project scope
7. Project status
8. License

Instructions:
1. Carefully read all provided project files.
2. Extract appropriate information for each README section.
3. Organize information into the specified structure.
4. Ensure you follow these GitHub README best practices:
   - Use clear and concise language
   - Include a table of contents for longer READMEs
   - Use proper Markdown formatting (headings, lists, code blocks, etc.).
   - Include clear instructions for setting up and running the project.
   - Include badges where relevant (e.g., build status, version, license).
   - Link to additional documentation if available
5. Carefully verify that you have included all relevant information from the input files.

Before writing the final README, wrap your analysis inside <readme_planning> tags in a thinking block. In this section:
- List key information from each input file separately (PRD, tech stack, dependencies).
- Create a brief outline for each README section.
- Note any missing information that might be needed for a comprehensive README.

This process will help ensure an accurate and well-organized README.

After conducting your analysis, provide the complete README.md content in Markdown format.

Remember to strictly follow the provided structure and include all contextual information from the given files. Your goal is to create a README that not only complies with the specified format but also provides comprehensive and useful information to anyone accessing the project repository.

The final output should be solely the creation of a README.md file in the project root, in Markdown format in English, and should not duplicate or repeat any work done in the readme_planning section.', 'Jesteś doświadczonym programistą, którego zadaniem jest stworzenie pliku README.md dla projektu GitHub. Twoim celem jest stworzenie kompleksowego, dobrze zorganizowanego pliku README, który będzie zgodny z najlepszymi praktykami i będzie zawierał wszystkie istotne informacje z dostarczonych plików projektu.

Oto pliki projektu, które należy przeanalizować:

<prd>
@prd.md
</prd>

<tech_stack>
@tech-stack.md
</tech_stack>

<dependencies>
@package.json
@.nvmrc
</dependencies>

Twoim zadaniem jest utworzenie pliku README.md o następującej strukturze:

1. Project name
2. Project description
3. Tech stack
4. Getting started locally
5. Available scripts
6. Project scope
7. Project status
8. License

Instrukcje:
1. Uważnie przeczytaj wszystkie dostarczone pliki projektu.
2. Wyodrębnij odpowiednie informacje dla każdej sekcji README.
3. Zorganizuj informacje w określoną strukturę.
4. Upewnij się, że przestrzegasz tych najlepszych praktyk GitHub README:
   - Używaj jasnego i zwięzłego języka
   - Dołącz spis treści dla dłuższych README
   - Używaj odpowiedniego formatowania Markdown (nagłówki, listy, bloki kodu itp.).
   - Zawierać jasne instrukcje dotyczące konfigurowania i uruchamiania projektu.
   - Uwzględnianie znaczników tam, gdzie jest to istotne (np. status kompilacji, wersja, licencja).
   - Link do dodatkowej dokumentacji, jeśli jest dostępna
5. Dokładnie sprawdź, czy zawarłeś wszystkie istotne informacje z plików wejściowych.

Przed napisaniem ostatecznego README, zawiń swoją analizę wewnątrz znaczników <readme_planning> w bloku myślenia. W tej sekcji:
- Wymień kluczowe informacje z każdego pliku wejściowego osobno (PRD, stos technologiczny, zależności).
- Utwórz krótki zarys dla każdej sekcji README.
- Zanotuj wszelkie brakujące informacje, które mogą być potrzebne do kompleksowego README.

Proces ten pomoże zapewnić dokładne i dobrze zorganizowane README.

Po przeprowadzeniu analizy, dostarcz pełną zawartość README.md w formacie Markdown.

Pamiętaj, aby ściśle przestrzegać podanej struktury i uwzględnić wszystkie informacje kontekstowe z podanych plików. Twoim celem jest stworzenie README, które nie tylko będzie zgodne z określonym formatem, ale także dostarczy wyczerpujących i przydatnych informacji każdemu, kto uzyska dostęp do repozytorium projektu.

Końcowy wynik to wyłącznie utworzenie pliku README.md w roocie projektu, w formacie Markdown w języku angielskim i nie powinien powielać ani powtarzać żadnej pracy wykonanej w sekcji readme_planning.',
    'published', 0
  )
  ;

  -- Prompts for Database
  INSERT INTO prompts (
    organization_id, collection_id, segment_id,
    title_en, title_pl,
    description_en, description_pl,
    markdown_body_en, markdown_body_pl,
    status, sort_order
  ) VALUES
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l3_database_id,
    'Database Planning Assistant', 'Asystent planowania bazy danych',
    'Interactive PostgreSQL database schema design session. Generates questions about entities, relationships, security, and scalability based on PRD and tech stack.', 'Interaktywna sesja projektowania schematu bazy danych PostgreSQL. Generuje pytania dotyczące encji, relacji, bezpieczeństwa i skalowalności na podstawie PRD i stacku technologicznego.',
    'You are an AI assistant whose task is to help plan a PostgreSQL database schema for an MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to create the database schema, relationships, and row-level security (RLS) policies.

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

Based on your analysis, generate a list of questions and recommendations. These should address any ambiguities, potential issues, or areas where more information is needed to create an effective database schema. Consider questions regarding:

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

Remember to focus on clarity, relevance, and accuracy of outputs. Do not include any additional comments or explanations beyond the specified output format.', 'Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu schematu bazy danych w PostgreSQL dla MVP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do utworzenia schematu bazy danych, relacji i zasad bezpieczeństwa na poziomie wierszy (RLS).

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

Na podstawie analizy wygeneruj listę pytań i zaleceń. Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby stworzyć skuteczny schemat bazy danych. Rozważ pytania dotyczące:

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
1. Czy encja „użytkownicy” powinna mieć powiązanie z „postami”?

Rekomendacja: Tak, encja „użytkownicy” powinna mieć powiązanie z „postami”, ponieważ użytkownicy mogą tworzyć posty.
</pytania>

Pamiętaj, że Twoim celem jest dostarczenie kompleksowej listy pytań i zaleceń, które pomogą w stworzeniu solidnego schematu bazy danych PostgreSQL dla MVP. Skoncentruj się na jasności, trafności i dokładności swoich wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.

Kontynuuj ten proces, generując nowe pytania i rekomendacje w oparciu o przekazany kontekst i odpowiedzi użytkownika, dopóki użytkownik wyraźnie nie poprosi o podsumowanie.

Pamiętaj, aby skupić się na jasności, trafności i dokładności wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.',
    'published', 0
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l3_database_id,
    'Database Planning Summary', 'Podsumowanie planowania bazy danych',
    'Consolidates design decisions regarding database schema. Creates summary including main entities, relationships, security considerations, and unresolved issues.', 'Konsoliduje decyzje projektowe dotyczące schematu bazy danych. Tworzy podsumowanie obejmujące główne encje, relacje, kwestie bezpieczeństwa i nierozwiązane problemy.',
    '{{latest-round-answers}} <- list of answers to the second round of questions

---

You are an AI assistant whose task is to summarize the conversation about database planning for MVP and prepare a concise summary for the next stage of development. In the conversation history, you will find the following information:
1. Product Requirements Document (PRD)
2. Information about the tech stack
3. Conversation history containing questions and answers
4. Model recommendations

Your tasks are:
1. Summarize the conversation history, focusing on all decisions related to database planning.
2. Match model recommendations to the answers given in the conversation history. Identify which recommendations are relevant based on the discussion.
3. Prepare a detailed conversation summary that includes:
   a. Main requirements for the database schema
   b. Key entities and their relationships
   c. Important security and scalability concerns
   d. Any unresolved issues or areas requiring further clarification
4. Format the results as follows:

<conversation_summary>
<decisions>
[List decisions made by the user, numbered].
</decisions>

<matched_recommendations>
[List of the most relevant recommendations matched to the conversation, numbered]
</matched_recommendations>

<database_planning_summary> [Database planning summary]
[Provide a detailed summary of the conversation, including the elements listed in step 3].
</database_planning_summary>

<unresolved_issues>
[List any unresolved issues or areas requiring further clarification, if any exist]
</unresolved_issues>
</conversation_summary>

The final output should contain only the content in markdown format. Ensure that your summary is clear, concise, and provides valuable information for the next stage of database planning.', '{{latest-round-answers}} <- lista odpowiedzi na drugą rundę pytań

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania bazy danych dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:
1. Dokument wymagań produktu (PRD)
2. Informacje o stacku technologicznym
3. Historia rozmów zawierająca pytania i odpowiedzi
4. Zalecenia dotyczące modelu

Twoim zadaniem jest:
1. Podsumować historii konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem bazy danych.
2. Dopasowanie zaleceń modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikuj, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotuj szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania dotyczące schematu bazy danych
   b. Kluczowe encje i ich relacje
   c. Ważne kwestie dotyczące bezpieczeństwa i skalowalności
   d. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatuj wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>

<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>

<database_planning_summary> [Podsumowanie planowania bazy danych]
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</database_planning_summary>

<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu planowania bazy danych.',
    'published', 1
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l3_database_id,
    'Database Schema Creation', 'Tworzenie schematu bazy danych',
    'Generates detailed PostgreSQL database schema with tables, relationships, indexes, and RLS policies. Result saved as .ai/db-plan.md.', 'Generuje szczegółowy schemat bazy danych PostgreSQL z tabelami, relacjami, indeksami i zasadami RLS. Rezultat zapisywany jako .ai/db-plan.md.',
    'You are a database architect whose task is to create a PostgreSQL database schema based on information provided from planning sessions, a Product Requirements Document (PRD), and the tech stack. Your goal is to design an efficient and scalable database structure that meets project requirements.

1. <prd>
{{prd}} <- replace with reference to @prd.md
</prd>

This is the Product Requirements Document that specifies features, functionalities, and project requirements.

2. <session_notes>
{{session-notes}} <- paste planning session summary
</session_notes>

These are notes from the database schema planning session. They may contain important decisions, considerations, and specific requirements discussed during the meeting.

3. <tech_stack>
{{tech-stack}} <- replace with reference to tech-stack.md
</tech_stack>

Describes the technology stack that will be used in the project, which may influence database design decisions.

Follow these steps to create the database schema:

1. Carefully analyze session notes, identifying key entities, attributes, and relationships discussed during the planning session.
2. Review the PRD to ensure that all required features and functionalities are supported by the database schema.
3. Analyze the tech stack and ensure that the database design is optimized for the chosen technologies.

4. Create a comprehensive database schema that includes:
   a. Tables with appropriate column names and data types
   b. Primary keys and foreign keys
   c. Indexes to improve query performance
   d. Any necessary constraints (e.g., uniqueness, not null)

5. Define relationships between tables, specifying cardinality (one-to-one, one-to-many, many-to-many) and any junction tables required for many-to-many relationships.

6. Develop PostgreSQL policies for row-level security (RLS), if applicable, based on requirements specified in session notes or the PRD.

7. Ensure the schema follows database design best practices, including normalization to the appropriate level (typically 3NF, unless denormalization is justified for performance reasons).

The final output should have the following structure:
```markdown
1. List of tables with their columns, data types, and constraints
2. Relationships between tables
3. Indexes
4. PostgreSQL policies (if applicable)
5. Any additional notes or explanations about design decisions
```

Your response should provide only the final database schema in markdown format, which you will save in the file .ai/db-plan.md without including the thinking process or intermediate steps. Ensure the schema is comprehensive, well-organized, and ready to use as a basis for creating database migrations.', 'Jesteś architektem baz danych, którego zadaniem jest stworzenie schematu bazy danych PostgreSQL na podstawie informacji dostarczonych z sesji planowania, dokumentu wymagań produktu (PRD) i stacku technologicznym. Twoim celem jest zaprojektowanie wydajnej i skalowalnej struktury bazy danych, która spełnia wymagania projektu.

1. <prd>
{{prd}} <- zamień na referencję do @prd.md
</prd>

Jest to dokument wymagań produktu, który określa cechy, funkcjonalności i wymagania projektu.

2. <session_notes>
{{session-notes}} <- wklej podsumowanie sesji planistycznej
</session_notes>

Są to notatki z sesji planowania schematu bazy danych. Mogą one zawierać ważne decyzje, rozważania i konkretne wymagania omówione podczas spotkania.

3. <tech_stack>
{{tech-stack}} <- zamień na referencje do tech-stack.md
</tech_stack>

Opisuje stack technologiczny, który zostanie wykorzystany w projekcie, co może wpłynąć na decyzje dotyczące projektu bazy danych.

Wykonaj następujące kroki, aby utworzyć schemat bazy danych:

1. Dokładnie przeanalizuj notatki z sesji, identyfikując kluczowe jednostki, atrybuty i relacje omawiane podczas sesji planowania.
2. Przejrzyj PRD, aby upewnić się, że wszystkie wymagane funkcje i funkcjonalności są obsługiwane przez schemat bazy danych.
3. Przeanalizuj stack technologiczny i upewnij się, że projekt bazy danych jest zoptymalizowany pod kątem wybranych technologii.

4. Stworzenie kompleksowego schematu bazy danych, który obejmuje
   a. Tabele z odpowiednimi nazwami kolumn i typami danych
   b. Klucze podstawowe i klucze obce
   c. Indeksy poprawiające wydajność zapytań
   d. Wszelkie niezbędne ograniczenia (np. unikalność, not null)

5. Zdefiniuj relacje między tabelami, określając kardynalność (jeden-do-jednego, jeden-do-wielu, wiele-do-wielu) i wszelkie tabele łączące wymagane dla relacji wiele-do-wielu.

6. Opracowanie zasad PostgreSQL dla zabezpieczeń na poziomie wiersza (RLS), jeśli dotyczy, w oparciu o wymagania określone w notatkach z sesji lub PRD.

7. Upewnij się, że schemat jest zgodny z najlepszymi praktykami projektowania baz danych, w tym normalizacji do odpowiedniego poziomu (zwykle 3NF, chyba że denormalizacja jest uzasadniona ze względu na wydajność).

Ostateczny wynik powinien mieć następującą strukturę:
```markdown
1. Lista tabel z ich kolumnami, typami danych i ograniczeniami
2. Relacje między tabelami
3. Indeksy
4. Zasady PostgreSQL (jeśli dotyczy)
5. Wszelkie dodatkowe uwagi lub wyjaśnienia dotyczące decyzji projektowych
```

W odpowiedzi należy podać tylko ostateczny schemat bazy danych w formacie markdown, który zapiszesz w pliku .ai/db-plan.md bez uwzględniania procesu myślowego lub kroków pośrednich. Upewnij się, że schemat jest kompleksowy, dobrze zorganizowany i gotowy do wykorzystania jako podstawa do tworzenia migracji baz danych.',
    'published', 2
  )
  ;

  -- Prompts for API
  INSERT INTO prompts (
    organization_id, collection_id, segment_id,
    title_en, title_pl,
    description_en, description_pl,
    markdown_body_en, markdown_body_pl,
    status, sort_order
  ) VALUES
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l4_api_id,
    'REST API Plan Creation', 'Tworzenie planu REST API',
    'Generates comprehensive REST API specification based on database schema and PRD. Defines resources, endpoints, authentication, and business logic.', 'Generuje kompleksową specyfikację REST API na podstawie schematu bazy danych i PRD. Definiuje zasoby, endpointy, uwierzytelnianie i logikę biznesową.',
    '<db-plan>
{{db-plan}} <- replace with reference to @db-plan.md
</db-plan>

<prd>
{{prd}} <- replace with reference to @prd.md
</prd>

<tech-stack>
{{tech-stack}} <- replace with reference to @tech-stack.md
</tech-stack>

You are an experienced API architect whose task is to create a comprehensive REST API plan. Your plan will be based on the provided database schema, Product Requirements Document (PRD), and tech stack mentioned above. Carefully review the inputs and perform the following steps:

1. Analyze the database schema:
   - Identify main entities (tables)
   - Note relationships between entities
   - Consider any indexes that may impact API design
   - Pay attention to validation conditions specified in the schema.

2. Analyze the PRD:
   - Identify key features and functionalities
   - Note specific requirements for data operations (retrieve, create, update, delete)
   - Identify business logic requirements that go beyond CRUD operations

3. Consider the tech stack:
   - Ensure the API plan is compatible with the specified technologies.
   - Consider how these technologies may influence API design

4. Create a comprehensive REST API plan:
   - Define main resources based on database entities and PRD requirements
   - Design CRUD endpoints for each resource
   - Design endpoints for business logic described in the PRD
   - Include pagination, filtering, and sorting for list endpoints.
   - Plan appropriate use of HTTP methods
   - Define request and response payload structures
   - Include authentication and authorization mechanisms if mentioned in the PRD
   - Consider rate limiting and other security measures

Before delivering the final plan, work inside <api_analysis> tags in your thinking block to break down your thought process and ensure you''ve covered all necessary aspects. In this section:

1. List main entities from the database schema. Number each entity and quote the relevant part of the schema.
2. List key business logic features from the PRD. Number each feature and quote the relevant part of the PRD.
3. Map features from the PRD to potential API endpoints. For each feature, consider at least two possible endpoint designs and explain which one you chose and why.
4. Consider and list any security and performance requirements. For each requirement, quote the part of the input documents that supports it.
5. Explicitly map business logic from the PRD to API endpoints.
6. Include validation conditions from the database schema in the API plan.

This section may be quite long.

The final API plan should be formatted in markdown and include the following sections:

```markdown
# REST API Plan

## 1. Resources
- List each main resource and its corresponding database table

## 2. Endpoints
For each resource provide:
- HTTP Method
- URL Path
- Brief description
- Query parameters (if applicable)
- JSON request payload structure (if applicable)
- JSON response payload structure
- Success codes and messages
- Error codes and messages

## 3. Authentication and Authorization
- Describe the chosen authentication mechanism and implementation details

## 4. Validation and Business Logic
- List validation conditions for each resource
- Describe how business logic is implemented in the API
```

Ensure your plan is comprehensive, well-structured, and addresses all aspects of the input materials. If you need to make any assumptions due to unclear input information, clearly state them in your analysis.

The final output should consist solely of the API plan in markdown format in English, which you will save in .ai/api-plan.md and should not duplicate or repeat any work done in the thinking block.', '<db-plan>
{{db-plan}} <- zamień na referencję do @db-plan.md
</db-plan>

<prd>
{{prd}} <- zamień na referencję do @prd.md
</prd>

<tech-stack>
{{tech-stack}} <- zamień na referencję do @tech-stack.md
</tech-stack>

Jesteś doświadczonym architektem API, którego zadaniem jest stworzenie kompleksowego planu API REST. Twój plan będzie oparty na podanym schemacie bazy danych, dokumencie wymagań produktu (PRD) i stacku technologicznym podanym powyżej. Uważnie przejrzyj dane wejściowe i wykonaj następujące kroki:

1. Przeanalizuj schemat bazy danych:
   - Zidentyfikuj główne encje (tabele)
   - Zanotuj relacje między jednostkami
   - Rozważ wszelkie indeksy, które mogą mieć wpływ na projekt API
   - Zwróć uwagę na warunki walidacji określone w schemacie.

2. Przeanalizuj PRD:
   - Zidentyfikuj kluczowe cechy i funkcjonalności
   - Zwróć uwagę na konkretne wymagania dotyczące operacji na danych (pobieranie, tworzenie, aktualizacja, usuwanie)
   - Zidentyfikuj wymagania logiki biznesowej, które wykraczają poza operacje CRUD

3. Rozważ stack technologiczny:
   - Upewnij się, że plan API jest zgodny z określonymi technologiami.
   - Rozważ, w jaki sposób te technologie mogą wpłynąć na projekt API

4. Tworzenie kompleksowego planu interfejsu API REST:
   - Zdefiniowanie głównych zasobów w oparciu o encje bazy danych i wymagania PRD
   - Zaprojektowanie punktów końcowych CRUD dla każdego zasobu
   - Zaprojektuj punkty końcowe dla logiki biznesowej opisanej w PRD
   - Uwzględnienie paginacji, filtrowania i sortowania dla punktów końcowych listy.
   - Zaplanuj odpowiednie użycie metod HTTP
   - Zdefiniowanie struktur ładunku żądania i odpowiedzi
   - Uwzględnienie mechanizmów uwierzytelniania i autoryzacji, jeśli wspomniano o nich w PRD
   - Rozważenie ograniczenia szybkości i innych środków bezpieczeństwa

Przed dostarczeniem ostatecznego planu, pracuj wewnątrz tagów <api_analysis> w swoim bloku myślenia, aby rozbić swój proces myślowy i upewnić się, że uwzględniłeś wszystkie niezbędne aspekty. W tej sekcji:

1. Wymień główne encje ze schematu bazy danych. Ponumeruj każdą encję i zacytuj odpowiednią część schematu.
2. Wymień kluczowe funkcje logiki biznesowej z PRD. Ponumeruj każdą funkcję i zacytuj odpowiednią część PRD.
3. Zmapuj funkcje z PRD do potencjalnych punktów końcowych API. Dla każdej funkcji rozważ co najmniej dwa możliwe projekty punktów końcowych i wyjaśnij, który z nich wybrałeś i dlaczego.
4. Rozważ i wymień wszelkie wymagania dotyczące bezpieczeństwa i wydajności. Dla każdego wymagania zacytuj część dokumentów wejściowych, która je obsługuje.
5. Wyraźnie mapuj logikę biznesową z PRD na punkty końcowe API.
6. Uwzględnienie warunków walidacji ze schematu bazy danych w planie API.

Ta sekcja może być dość długa.

Ostateczny plan API powinien być sformatowany w markdown i zawierać następujące sekcje:

```markdown
# REST API Plan

## 1. Zasoby
- Wymień każdy główny zasób i odpowiadającą mu tabelę bazy danych

## 2. Punkty końcowe
Dla każdego zasobu podaj:
- Metoda HTTP
- Ścieżka URL
- Krótki opis
- Parametry zapytania (jeśli dotyczy)
- Struktura ładunku żądania JSON (jeśli dotyczy)
- Struktura ładunku odpowiedzi JSON
- Kody i komunikaty powodzenia
- Kody i komunikaty błędów

## 3. Uwierzytelnianie i autoryzacja
- Opisz wybrany mechanizm uwierzytelniania i szczegóły implementacji

## 4. Walidacja i logika biznesowa
- Lista warunków walidacji dla każdego zasobu
- Opisz, w jaki sposób logika biznesowa jest zaimplementowana w API
```

Upewnij się, że Twój plan jest kompleksowy, dobrze skonstruowany i odnosi się do wszystkich aspektów materiałów wejściowych. Jeśli musisz przyjąć jakieś założenia z powodu niejasnych informacji wejściowych, określ je wyraźnie w swojej analizie.

Końcowy wynik powinien składać się wyłącznie z planu API w formacie markdown w języku angielskim, który zapiszesz w .ai/api-plan.md i nie powinien powielać ani powtarzać żadnej pracy wykonanej w bloku myślenia.',
    'published', 0
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l4_api_id,
    'DTO and Command Models Type Generation', 'Generowanie typów DTO i Command Models',
    'Creates DTO (Data Transfer Objects) and Command Models types based on database models. Uses TypeScript utility types to ensure type safety.', 'Tworzy typy DTO (Data Transfer Objects) i Command Models na podstawie modeli bazy danych. Wykorzystuje TypeScript utility types do zapewnienia bezpieczeństwa typów.',
    'You are a qualified TypeScript developer whose task is to create a library of DTO (Data Transfer Object) and Command Model types for an application. Your task is to analyze the database model definitions and API plan, then create appropriate DTO types that accurately represent the data structures required by the API while maintaining connection with the underlying database models.

First, carefully review the following inputs:

1. Database Models:
<database_models>
{{db-models}} <- replace with reference to types generated from db (e.g., @database.types.ts)
</database_models>

2. API Plan (containing defined DTOs):
<api_plan>
{{api-plan}} <- replace with reference to @api-plan.md
</api_plan>

Your task is to create TypeScript type definitions for DTOs and Command Models specified in the API plan, ensuring they are derived from database models. Execute the following steps:

1. Analyze database models and API plan.
2. Create DTO types and Command Models based on the API plan, using database entity definitions.
3. Ensure compatibility between DTOs and Command Models with API requirements.
4. Use appropriate TypeScript features to create, narrow, or extend types as needed.
5. Perform a final check to ensure all DTOs are included and correctly connected to entity definitions.

Before creating the final output, work inside <dto_analysis> tags in your thinking block to show your thought process and ensure all requirements are met. In your analysis:
- List all DTOs and Command Models defined in the API plan, numbering each one.
- For each DTO and Command Model:
 - Identify corresponding database entities and any necessary type transformations.
  - Describe TypeScript features or utilities you plan to use.
  - Create a brief sketch of the DTO and Command Model structure.
- Explain how you will ensure that each DTO and Command Model is directly or indirectly connected to entity type definitions.

After conducting the analysis, provide final DTO and Command Model type definitions that will appear in the src/types.ts file. Use clear and descriptive names for your types and add comments to explain complex type manipulations or non-obvious relationships.

Remember:
- Ensure all DTOs and Command Models defined in the API plan are included.
- Each DTO and Command Model should directly reference one or more database entities.
- Use TypeScript features such as Pick, Omit, Partial, etc., as needed.
- Add comments to explain complex or non-obvious type manipulations.

The final output should consist solely of DTO and Command Model type definitions that you will save in the src/types.ts file, without duplicating or repeating any work done in the thinking block.', 'Jesteś wykwalifikowanym programistą TypeScript, którego zadaniem jest stworzenie biblioteki typów DTO (Data Transfer Object) i Command Model dla aplikacji. Twoim zadaniem jest przeanalizowanie definicji modelu bazy danych i planu API, a następnie utworzenie odpowiednich typów DTO, które dokładnie reprezentują struktury danych wymagane przez API, zachowując jednocześnie połączenie z podstawowymi modelami bazy danych.

Najpierw dokładnie przejrzyj następujące dane wejściowe:

1. Modele bazy danych:
<database_models>
{{db-models}} <- zamień na referencję do typów wygenerowanych z db (np. @database.types.ts)
</database_models>

2. Plan API (zawierający zdefiniowane DTO):
<api_plan>
{{api-plan}} <- zamień na referencję do @api-plan.md
</api_plan>

Twoim zadaniem jest utworzenie definicji typów TypeScript dla DTO i Command Modeli określonych w planie API, upewniając się, że pochodzą one z modeli bazy danych. Wykonaj następujące kroki:

1. Przeanalizuj modele bazy danych i plan API.
2. Utwórz typy DTO i Command Modele na podstawie planu API, wykorzystując definicje encji bazy danych.
3. Zapewnienie zgodności między DTO i Command Modeli a wymaganiami API.
4. Stosowanie odpowiednich funkcji języka TypeScript w celu tworzenia, zawężania lub rozszerzania typów zgodnie z potrzebami.
5. Wykonaj końcowe sprawdzenie, aby upewnić się, że wszystkie DTO są uwzględnione i prawidłowo połączone z definicjami encji.

Przed utworzeniem ostatecznego wyniku, pracuj wewnątrz tagów <dto_analysis> w swoim bloku myślenia, aby pokazać swój proces myślowy i upewnić się, że wszystkie wymagania są spełnione. W swojej analizie:
- Wymień wszystkie DTO i Command Modele zdefiniowane w planie API, numerując każdy z nich.
- Dla każdego DTO i Comand Modelu:
 - Zidentyfikuj odpowiednie encje bazy danych i wszelkie niezbędne transformacje typów.
  - Opisz funkcje lub narzędzia TypeScript, których planujesz użyć.
  - Utwórz krótki szkic struktury DTO i Command Modelu.
- Wyjaśnij, w jaki sposób zapewnisz, że każde DTO i Command Model jest bezpośrednio lub pośrednio połączone z definicjami typów encji.

Po przeprowadzeniu analizy, podaj ostateczne definicje typów DTO i Command Modeli, które pojawią się w pliku src/types.ts. Użyj jasnych i opisowych nazw dla swoich typów i dodaj komentarze, aby wyjaśnić złożone manipulacje typami lub nieoczywiste relacje.

Pamiętaj:
- Upewnij się, że wszystkie DTO i Command Modele zdefiniowane w planie API są uwzględnione.
- Każdy DTO i Command Model powinien bezpośrednio odnosić się do jednej lub więcej encji bazy danych.
- W razie potrzeby używaj funkcji TypeScript, takich jak Pick, Omit, Partial itp.
- Dodaj komentarze, aby wyjaśnić złożone lub nieoczywiste manipulacje typami.

Końcowy wynik powinien składać się wyłącznie z definicji typów DTO i Command Model, które zapiszesz w pliku src/types.ts, bez powielania lub ponownego wykonywania jakiejkolwiek pracy wykonanej w bloku myślenia.',
    'published', 1
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l4_api_id,
    'REST API Endpoint Implementation Plan', 'Plan implementacji endpointa REST API',
    'Creates detailed REST API endpoint implementation plan with request/response structure, data flow, security, and error handling.', 'Tworzy szczegółowy plan wdrożenia endpointa REST API z strukturą żądania/odpowiedzi, przepływem danych, bezpieczeństwem i obsługą błędów.',
    'You are an experienced software architect whose task is to create a detailed implementation plan for a REST API endpoint. Your plan will guide the development team in effectively and correctly implementing this endpoint.

Before we begin, review the following information:

1. Route API specification:
<route_api_specification>
{{route-api-specification}} <- copy endpoint description from api-plan.md
</route_api_specification>

2. Related database resources:
<related_db_resources>
{{db-resources}} <- copy tables and relationships from db-plan.md
</related_db_resources>

3. Type definitions:
<type_definitions>
{{types}} <- replace with reference to type definitions (e.g., @types)
</type_definitions>

3. Tech stack:
<tech_stack>
{{tech-stack}} <- replace with reference to @tech-stack.md
</tech_stack>

4. Implementation rules:
<implementation_rules>
{{backend-rules}} <- replace with reference to Rules for AI for backend (e.g., @shared.mdc, @backend.mdc, @astro.mdc)
</implementation_rules>

Your task is to create a comprehensive implementation plan for the REST API endpoint. Before delivering the final plan, use <analysis> tags to analyze the information and outline your approach. In this analysis, ensure that:

1. Summarize key points of the API specification.
2. List required and optional parameters from the API specification.
3. List necessary DTO types and Command Models.
4. Consider how to extract logic to a service (existing or new, if it doesn''t exist).
5. Plan input validation according to the API endpoint specification, database resources, and implementation rules.
6. Determine how to log errors in the error table (if applicable).
7. Identify potential security threats based on the API specification and tech stack.
8. Outline potential error scenarios and corresponding status codes.

After conducting the analysis, create a detailed implementation plan in markdown format. The plan should contain the following sections:

1. Endpoint Overview
2. Request Details
3. Response Details
4. Data Flow
5. Security Considerations
6. Error Handling
7. Performance
8. Implementation Steps

Throughout the plan, ensure that you:
- Use correct API status codes:
  - 200 for successful read
  - 201 for successful creation
  - 400 for invalid input
  - 401 for unauthorized access
  - 404 for not found resources
  - 500 for server-side errors
- Adapt to the provided tech stack
- Follow the provided implementation rules

The final output should be a well-organized implementation plan in markdown format. Here''s an example of what the output should look like:

``markdown
# API Endpoint Implementation Plan: [Endpoint Name]

## 1. Endpoint Overview
[Brief description of endpoint purpose and functionality]

## 2. Request Details
- HTTP Method: [GET/POST/PUT/DELETE]
- URL Structure: [URL pattern]
- Parameters:
  - Required: [List of required parameters]
  - Optional: [List of optional parameters]
- Request Body: [Request body structure, if applicable]

## 3. Used Types
[DTOs and Command Models necessary for implementation]

## 3. Response Details
[Expected response structure and status codes]

## 4. Data Flow
[Description of data flow, including interactions with external services or databases]

## 5. Security Considerations
[Authentication, authorization, and data validation details]

## 6. Error Handling
[List of potential errors and how to handle them]

## 7. Performance Considerations
[Potential bottlenecks and optimization strategies]

## 8. Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]
...
```

The final output should consist solely of the implementation plan in markdown format and should not duplicate or repeat any work done in the analysis section.

Remember to save your implementation plan as .ai/view-implementation-plan.md. Ensure the plan is detailed, clear, and provides comprehensive guidance for the development team.', 'Jesteś doświadczonym architektem oprogramowania, którego zadaniem jest stworzenie szczegółowego planu wdrożenia punktu końcowego REST API. Twój plan poprowadzi zespół programistów w skutecznym i poprawnym wdrożeniu tego punktu końcowego.

Zanim zaczniemy, zapoznaj się z poniższymi informacjami:

1. Route API specification:
<route_api_specification>
{{route-api-specification}} <- przekopiuj opis endpointa z api-plan.md
</route_api_specification>

2. Related database resources:
<related_db_resources>
{{db-resources}} <- przekopiuj z tabele i relacje z db-plan.md
</related_db_resources>

3. Definicje typów:
<type_definitions>
{{types}} <- zamień na referencje do definicji typów (np. @types)
</type_definitions>

3. Tech stack:
<tech_stack>
{{tech-stack}} <- zamień na referencje do @tech-stack.md
</tech_stack>

4. Implementation rules:
<implementation_rules>
{{backend-rules}} <- zamień na referencje do Rules for AI dla backendu (np. @shared.mdc, @backend.mdc, @astro.mdc)
</implementation_rules>

Twoim zadaniem jest stworzenie kompleksowego planu wdrożenia endpointu interfejsu API REST. Przed dostarczeniem ostatecznego planu użyj znaczników <analysis>, aby przeanalizować informacje i nakreślić swoje podejście. W tej analizie upewnij się, że:

1. Podsumuj kluczowe punkty specyfikacji API.
2. Wymień wymagane i opcjonalne parametry ze specyfikacji API.
3. Wymień niezbędne typy DTO i Command Modele.
4. Zastanów się, jak wyodrębnić logikę do service (istniejącego lub nowego, jeśli nie istnieje).
5. Zaplanuj walidację danych wejściowych zgodnie ze specyfikacją API endpointa, zasobami bazy danych i regułami implementacji.
6. Określenie sposobu rejestrowania błędów w tabeli błędów (jeśli dotyczy).
7. Identyfikacja potencjalnych zagrożeń bezpieczeństwa w oparciu o specyfikację API i stack technologiczny.
8. Nakreśl potencjalne scenariusze błędów i odpowiadające im kody stanu.

Po przeprowadzeniu analizy utwórz szczegółowy plan wdrożenia w formacie markdown. Plan powinien zawierać następujące sekcje:

1. Przegląd punktu końcowego
2. Szczegóły żądania
3. Szczegóły odpowiedzi
4. Przepływ danych
5. Względy bezpieczeństwa
6. Obsługa błędów
7. Wydajność
8. Kroki implementacji

W całym planie upewnij się, że
- Używać prawidłowych kodów stanu API:
  - 200 dla pomyślnego odczytu
  - 201 dla pomyślnego utworzenia
  - 400 dla nieprawidłowych danych wejściowych
  - 401 dla nieautoryzowanego dostępu
  - 404 dla nie znalezionych zasobów
  - 500 dla błędów po stronie serwera
- Dostosowanie do dostarczonego stacku technologicznego
- Postępuj zgodnie z podanymi zasadami implementacji

Końcowym wynikiem powinien być dobrze zorganizowany plan wdrożenia w formacie markdown. Oto przykład tego, jak powinny wyglądać dane wyjściowe:

``markdown
# API Endpoint Implementation Plan: [Nazwa punktu końcowego]

## 1. Przegląd punktu końcowego
[Krótki opis celu i funkcjonalności punktu końcowego]

## 2. Szczegóły żądania
- Metoda HTTP: [GET/POST/PUT/DELETE]
- Struktura URL: [wzorzec URL]
- Parametry:
  - Wymagane: [Lista wymaganych parametrów]
  - Opcjonalne: [Lista opcjonalnych parametrów]
- Request Body: [Struktura treści żądania, jeśli dotyczy]

## 3. Wykorzystywane typy
[DTOs i Command Modele niezbędne do implementacji]

## 3. Szczegóły odpowiedzi
[Oczekiwana struktura odpowiedzi i kody statusu]

## 4. Przepływ danych
[Opis przepływu danych, w tym interakcji z zewnętrznymi usługami lub bazami danych]

## 5. Względy bezpieczeństwa
[Szczegóły uwierzytelniania, autoryzacji i walidacji danych]

## 6. Obsługa błędów
[Lista potencjalnych błędów i sposób ich obsługi]

## 7. Rozważania dotyczące wydajności
[Potencjalne wąskie gardła i strategie optymalizacji]

## 8. Etapy wdrożenia
1. [Krok 1]
2. [Krok 2]
3. [Krok 3]
...
```

Końcowe wyniki powinny składać się wyłącznie z planu wdrożenia w formacie markdown i nie powinny powielać ani powtarzać żadnej pracy wykonanej w sekcji analizy.

Pamiętaj, aby zapisać swój plan wdrożenia jako .ai/view-implementation-plan.md. Upewnij się, że plan jest szczegółowy, przejrzysty i zapewnia kompleksowe wskazówki dla zespołu programistów.',
    'published', 3
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l4_api_id,
    'Endpoint Implementation (3×3 workflow)', 'Implementacja endpointu (workflow 3×3)',
    'Implements REST API endpoint in iterative 3×3 mode: completes 3 steps, reports progress, waits for feedback. Ensures balance between AI autonomy and developer control.', 'Implementuje endpoint REST API w trybie iteracyjnym 3×3: realizuje 3 kroki, raportuje postęp, czeka na feedback. Zapewnia balans między autonomią AI a kontrolą programisty.',
    'Your task is to implement a REST API endpoint based on the provided implementation plan. Your goal is to create a solid and well-organized implementation that includes appropriate validation, error handling, and follows all logical steps described in the plan.

First, carefully review the provided implementation plan:

<implementation_plan>
{{endpoint-implementation-plan}} <- add reference to endpoint implementation plan (e.g., @generations-endpoint-implementation-plan.md)
</implementation_plan>

<types>
{{types}} <- add reference to type definitions (e.g., @types)
</types>

<implementation_rules>
{{backend-rules}} <- add reference to backend rules (e.g., @shared.mdc, @backend.mdc, @astro.mdc)
</implementation_rules>

<implementation_approach>
Implement a maximum of 3 steps from the implementation plan, briefly summarize what you''ve done, and describe the plan for the next 3 actions - stop work at this point and wait for my feedback.
</implementation_approach>

Now perform the following steps to implement the REST API endpoint:

1. Analyze the implementation plan:
   - Determine the HTTP method (GET, POST, PUT, DELETE, etc.) for the endpoint.
   - Define the endpoint URL structure
   - List all expected input parameters
   - Understand the required business logic and data processing stages
   - Note any special requirements for validation or error handling.

2. Begin implementation:
   - Start by defining the endpoint function with the correct HTTP method decorator.
   - Configure function parameters based on expected inputs
   - Implement input validation for all parameters
   - Follow the logical steps described in the implementation plan
   - Implement error handling for each stage of the process
   - Ensure proper data processing and transformation according to requirements
   - Prepare the response data structure

3. Validation and error handling:
   - Implement thorough input validation for all parameters
   - Use appropriate HTTP status codes for different scenarios (e.g., 400 for bad requests, 404 for not found, 500 for server errors).
   - Provide clear and informative error messages in responses.
   - Handle potential exceptions that may occur during processing.

4. Testing considerations:
   - Consider edge cases and potential issues that should be tested.
   - Ensure the implementation covers all scenarios mentioned in the plan.

5. Documentation:
   - Add clear comments to explain complex logic or important decisions
   - Include documentation for the main function and any helper functions.

After completing the implementation, ensure it includes all necessary imports, function definitions, and any additional helper functions or classes required for the implementation.

If you need to make any assumptions or have any questions about the implementation plan, present them before writing code.

Remember to follow REST API design best practices, adhere to programming language style guidelines, and ensure the code is clean, readable, and well-organized.', 'Twoim zadaniem jest wdrożenie endpointa interfejsu API REST w oparciu o podany plan wdrożenia. Twoim celem jest stworzenie solidnej i dobrze zorganizowanej implementacji, która zawiera odpowiednią walidację, obsługę błędów i podąża za wszystkimi logicznymi krokami opisanymi w planie.

Najpierw dokładnie przejrzyj dostarczony plan wdrożenia:

<implementation_plan>
{{endpoint-implementation-plan}} <- dodaj referencję do planu implementacji endpointa (np. @generations-endpoint-implementation-plan.md)
</implementation_plan>

<types>
{{types}} <- dodaj referencje do definicji typów (np. @types)
</types>

<implementation_rules>
{{backend-rules}} <- dodaj referencje do reguł backendowych (np. @shared.mdc, @backend.mdc, @astro.mdc)
</implementation_rules>

<implementation_approach>
Realizuj maksymalnie 3 kroki planu implementacji, podsumuj krótko co zrobiłeś i opisz plan na 3 kolejne działania - zatrzymaj w tym momencie pracę i czekaj na mój feedback.
</implementation_approach>

Teraz wykonaj następujące kroki, aby zaimplementować punkt końcowy interfejsu API REST:

1. Przeanalizuj plan wdrożenia:
   - Określ metodę HTTP (GET, POST, PUT, DELETE itp.) dla punktu końcowego.
   - Określenie struktury adresu URL punktu końcowego
   - Lista wszystkich oczekiwanych parametrów wejściowych
   - Zrozumienie wymaganej logiki biznesowej i etapów przetwarzania danych
   - Zwróć uwagę na wszelkie szczególne wymagania dotyczące walidacji lub obsługi błędów.

2. Rozpocznij implementację:
   - Rozpocznij od zdefiniowania funkcji punktu końcowego z prawidłowym dekoratorem metody HTTP.
   - Skonfiguruj parametry funkcji w oparciu o oczekiwane dane wejściowe
   - Wdrożenie walidacji danych wejściowych dla wszystkich parametrów
   - Postępuj zgodnie z logicznymi krokami opisanymi w planie wdrożenia
   - Wdrożenie obsługi błędów dla każdego etapu procesu
   - Zapewnienie właściwego przetwarzania i transformacji danych zgodnie z wymaganiami
   - Przygotowanie struktury danych odpowiedzi

3. Walidacja i obsługa błędów:
   - Wdrożenie dokładnej walidacji danych wejściowych dla wszystkich parametrów
   - Używanie odpowiednich kodów statusu HTTP dla różnych scenariuszy (np. 400 dla błędnych żądań, 404 dla nie znaleziono, 500 dla błędów serwera).
   - Dostarczanie jasnych i informacyjnych komunikatów o błędach w odpowiedzi.
   - Obsługa potencjalnych wyjątków, które mogą wystąpić podczas przetwarzania.

4. Rozważania dotyczące testowania:
   - Należy rozważyć edge case''y i potencjalne problemy, które powinny zostać przetestowane.
   - Upewnienie się, że wdrożenie obejmuje wszystkie scenariusze wymienione w planie.

5. Dokumentacja:
   - Dodaj jasne komentarze, aby wyjaśnić złożoną logikę lub ważne decyzje
   - Dołącz dokumentację dla głównej funkcji i wszelkich funkcji pomocniczych.

Po zakończeniu implementacji upewnij się, że zawiera wszystkie niezbędne importy, definicje funkcji i wszelkie dodatkowe funkcje pomocnicze lub klasy wymagane do implementacji.

Jeśli musisz przyjąć jakieś założenia lub masz jakiekolwiek pytania dotyczące planu implementacji, przedstaw je przed pisaniem kodu.

Pamiętaj, aby przestrzegać najlepszych praktyk projektowania REST API, stosować się do wytycznych dotyczących stylu języka programowania i upewnić się, że kod jest czysty, czytelny i dobrze zorganizowany.',
    'published', 4
  )
  ;

  -- Prompts for UI
  INSERT INTO prompts (
    organization_id, collection_id, segment_id,
    title_en, title_pl,
    description_en, description_pl,
    markdown_body_en, markdown_body_pl,
    status, sort_order
  ) VALUES
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l5_ui_id,
    'UI Architecture Planning Assistant', 'Asystent planowania architektury UI',
    'Interactive user interface design session. Generates questions about views, user flows, responsiveness, and API integration based on PRD.', 'Interaktywna sesja projektowania interfejsu użytkownika. Generuje pytania dotyczące widoków, przepływów użytkownika, responsywności i integracji z API na podstawie PRD.',
    'You are an AI assistant whose task is to help plan the user interface architecture for an MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in subsequent prompting to create a detailed UI architecture, user journey maps, and navigation structure.

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

Based on your analysis, generate a list of questions and recommendations. These should address any ambiguities, potential issues, or areas where more information is needed to create an effective UI architecture. Consider questions regarding:

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

Remember to focus on clarity, relevance, and accuracy of outputs. Do not include any additional comments or explanations beyond the specified output format.', 'Jesteś asystentem AI, którego zadaniem jest pomoc w zaplanowaniu architektury interfejsu użytkownika dla MVP (Minimum Viable Product) na podstawie dostarczonych informacji. Twoim celem jest wygenerowanie listy pytań i zaleceń, które zostaną wykorzystane w kolejnym promptowaniu do utworzenia szczegółowej architektury UI, map podróży użytkownika i struktury nawigacji.

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

Na podstawie analizy wygeneruj listę pytań i zaleceń. Powinny one dotyczyć wszelkich niejasności, potencjalnych problemów lub obszarów, w których potrzeba więcej informacji, aby stworzyć efektywną architekturę UI. Rozważ pytania dotyczące:

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

Pamiętaj, aby skupić się na jasności, trafności i dokładności wyników. Nie dołączaj żadnych dodatkowych komentarzy ani wyjaśnień poza określonym formatem wyjściowym.',
    'published', 0
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l5_ui_id,
    'UI Architecture Planning Session Summary', 'Podsumowanie sesji planowania architektury UI',
    'Consolidates decisions from UI architecture planning session. Matches recommendations to user responses and identifies unresolved issues.', 'Konsoliduje decyzje z sesji planowania architektury interfejsu użytkownika. Dopasowuje rekomendacje do odpowiedzi użytkownika i identyfikuje nierozwiązane kwestie.',
    '{{latest-round-answers}} <- list of answers to the second round of questions

---

You are an AI assistant whose task is to summarize the conversation about UI architecture planning for MVP and prepare a concise summary for the next stage of development. In the conversation history you will find the following information:
1. Product Requirements Document (PRD)
2. Tech stack information
3. API plan
4. Conversation history containing questions and answers
5. UI architecture recommendations

Your task is to:
1. Summarize the conversation history, focusing on all decisions related to UI architecture planning.
2. Match the model''s recommendations to the answers given in the conversation history. Identify which recommendations are relevant based on the discussion.
3. Prepare a detailed conversation summary that includes:
   a. Main UI architecture requirements
   b. Key views, screens, and user flows
   c. API integration and state management strategy
   d. Responsiveness, accessibility, and security considerations
   e. Any unresolved issues or areas requiring further clarification
4. Format the results in the following way:

<conversation_summary>
<decisions>
[List decisions made by the user, numbered].
</decisions>
<matched_recommendations>
[List of the most relevant recommendations matched to the conversation, numbered]
</matched_recommendations>
<ui_architecture_planning_summary>
[Provide a detailed conversation summary, including the elements listed in step 3].
</ui_architecture_planning_summary>
<unresolved_issues>
[List any unresolved issues or areas requiring further clarification, if any exist]
</unresolved_issues>
</conversation_summary>

The final output should contain only content in markdown format. Ensure your summary is clear, concise, and provides valuable information for the next stage of UI architecture planning and API integration.', '{{latest-round-answers}} <- lista odpowiedzi na drugą runde pytań

---

Jesteś asystentem AI, którego zadaniem jest podsumowanie rozmowy na temat planowania architektury UI dla MVP i przygotowanie zwięzłego podsumowania dla następnego etapu rozwoju. W historii konwersacji znajdziesz następujące informacje:
1. Dokument wymagań produktu (PRD)
2. Informacje o stacku technologicznym
3. Plan API
4. Historia rozmów zawierająca pytania i odpowiedzi
5. Zalecenia dotyczące architektury UI

Twoim zadaniem jest:
1. Podsumować historię konwersacji, koncentrując się na wszystkich decyzjach związanych z planowaniem architektury UI.
2. Dopasować zalecenia modelu do odpowiedzi udzielonych w historii konwersacji. Zidentyfikować, które zalecenia są istotne w oparciu o dyskusję.
3. Przygotować szczegółowe podsumowanie rozmowy, które obejmuje:
   a. Główne wymagania dotyczące architektury UI
   b. Kluczowe widoki, ekrany i przepływy użytkownika
   c. Strategię integracji z API i zarządzania stanem
   d. Kwestie dotyczące responsywności, dostępności i bezpieczeństwa
   e. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia
4. Sformatować wyniki w następujący sposób:

<conversation_summary>
<decisions>
[Wymień decyzje podjęte przez użytkownika, ponumerowane].
</decisions>
<matched_recommendations>
[Lista najistotniejszych zaleceń dopasowanych do rozmowy, ponumerowanych]
</matched_recommendations>
<ui_architecture_planning_summary>
[Podaj szczegółowe podsumowanie rozmowy, w tym elementy wymienione w kroku 3].
</ui_architecture_planning_summary>
<unresolved_issues>
[Wymień wszelkie nierozwiązane kwestie lub obszary wymagające dalszych wyjaśnień, jeśli takie istnieją]
</unresolved_issues>
</conversation_summary>

Końcowy wynik powinien zawierać tylko treść w formacie markdown. Upewnij się, że Twoje podsumowanie jest jasne, zwięzłe i zapewnia cenne informacje dla następnego etapu planowania architektury UI i integracji z API.',
    'published', 1
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l5_ui_id,
    'High-Level UI Plan Generation', 'Generowanie wysokopoziomowego planu UI',
    'Creates comprehensive user interface architecture with view list, user journey map, navigation structure, and key components.', 'Tworzy kompleksową architekturę interfejsu użytkownika z listą widoków, mapą podróży użytkownika, strukturą nawigacji i kluczowymi komponentami.',
    'You are a qualified frontend architect whose task is to create a comprehensive user interface architecture based on the Product Requirements Document (PRD), API plan, and planning session notes. Your goal is to design a user interface structure that effectively meets product requirements, is compatible with API capabilities, and incorporates insights from the planning session.

First, carefully review the following documents:

Product Requirements Document (PRD):
<prd>
{{prd}} <- replace with reference to @prd.md
</prd>

API Plan:
<api_plan>
{{api-plan}} <- replace with reference to @api-plan.md
</api_plan>

Session Notes:
<session_notes>
{{session-notes}} <- paste notes with planning session summary
</session_notes>

Your task is to create a detailed user interface architecture that includes necessary views, user journey mapping, navigation structure, and key elements for each view. The design should consider user experience, accessibility, and security.

Execute the following steps to complete the task:

1. Thoroughly analyze the PRD, API plan, and session notes.
2. Extract and list key requirements from the PRD.
3. Identify and list main API endpoints and their purposes.
4. Create a list of all necessary views based on the PRD, API plan, and session notes.
5. Determine the main purpose and key information for each view.
6. Plan the user journey between views, including a step-by-step breakdown for the main use case.
7. Design the navigation structure.
8. Propose key user interface elements for each view, considering UX, accessibility, and security.
9. Consider potential edge cases or error states.
10. Ensure the user interface architecture is compatible with the API plan.
11. Review and map all user stories from the PRD to the user interface architecture.
12. Explicitly map requirements to user interface elements.
13. Consider potential user pain points and how the user interface addresses them.

For each main step, work inside <ui_architecture_planning> tags in your thinking block to break down your thought process before moving to the next step. This section can be quite long. It''s okay that this section can be quite long.

Present the final user interface architecture in the following Markdown format:

```markdown
# UI Architecture for [Product Name]

## 1. UI Structure Overview

[Provide a general overview of the UI structure]

## 2. View List

[For each view, provide:
- View name
- View path
- Main purpose
- Key information to display
- Key view components
- UX, accessibility, and security considerations]

## 3. User Journey Map

[Describe the flow between views and key user interactions]

## 4. Layout and Navigation Structure

[Explain how users will navigate between views]

## 5. Key Components

[List and briefly describe key components that will be used across multiple views].
```

Focus exclusively on user interface architecture, user journey, navigation, and key elements for each view. Do not include implementation details, specific visual design, or code examples unless they are crucial to understanding the architecture.

The final result should consist solely of the UI architecture in Markdown format in English, which you will save in the .ai/ui-plan.md file. Do not duplicate or repeat any work done in the thinking block.', 'Jesteś wykwalifikowanym architektem frontend, którego zadaniem jest stworzenie kompleksowej architektury interfejsu użytkownika w oparciu o dokument wymagań produktu (PRD), plan API i notatki z sesji planowania. Twoim celem jest zaprojektowanie struktury interfejsu użytkownika, która skutecznie spełnia wymagania produktu, jest zgodna z możliwościami API i zawiera spostrzeżenia z sesji planowania.

Najpierw dokładnie przejrzyj następujące dokumenty:

Dokument wymagań produktu (PRD):
<prd>
{{prd}} <- zamień na referencję do @prd.md
</prd>

Plan API:
<api_plan>
{{api-plan}} <- zamień na referencję do @api-plan.md
</api_plan>

Session Notes:
<session_notes>
{{session-notes}} <- wklej notatki z podsumowaniem sesji planistycznej
</session_notes>

Twoim zadaniem jest stworzenie szczegółowej architektury interfejsu użytkownika, która obejmuje niezbędne widoki, mapowanie podróży użytkownika, strukturę nawigacji i kluczowe elementy dla każdego widoku. Projekt powinien uwzględniać doświadczenie użytkownika, dostępność i bezpieczeństwo.

Wykonaj następujące kroki, aby ukończyć zadanie:

1. Dokładnie przeanalizuj PRD, plan API i notatki z sesji.
2. Wyodrębnij i wypisz kluczowe wymagania z PRD.
3. Zidentyfikuj i wymień główne punkty końcowe API i ich cele.
4. Utworzenie listy wszystkich niezbędnych widoków na podstawie PRD, planu API i notatek z sesji.
5. Określenie głównego celu i kluczowych informacji dla każdego widoku.
6. Zaplanuj podróż użytkownika między widokami, w tym podział krok po kroku dla głównego przypadku użycia.
7. Zaprojektuj strukturę nawigacji.
8. Zaproponuj kluczowe elementy interfejsu użytkownika dla każdego widoku, biorąc pod uwagę UX, dostępność i bezpieczeństwo.
9. Rozważ potencjalne przypadki brzegowe lub stany błędów.
10. Upewnij się, że architektura interfejsu użytkownika jest zgodna z planem API.
11. Przejrzenie i zmapowanie wszystkich historyjek użytkownika z PRD do architektury interfejsu użytkownika.
12. Wyraźne mapowanie wymagań na elementy interfejsu użytkownika.
13. Rozważ potencjalne punkty bólu użytkownika i sposób, w jaki interfejs użytkownika je rozwiązuje.

Dla każdego głównego kroku pracuj wewnątrz tagów <ui_architecture_planning> w bloku myślenia, aby rozbić proces myślowy przed przejściem do następnego kroku. Ta sekcja może być dość długa. To w porządku, że ta sekcja może być dość długa.

Przedstaw ostateczną architekturę interfejsu użytkownika w następującym formacie Markdown:

```markdown
# Architektura UI dla [Nazwa produktu]

## 1. Przegląd struktury UI

[Przedstaw ogólny przegląd struktury UI]

## 2. Lista widoków

[Dla każdego widoku podaj:
- Nazwa widoku
- Ścieżka widoku
- Główny cel
- Kluczowe informacje do wyświetlenia
- Kluczowe komponenty widoku
- UX, dostępność i względy bezpieczeństwa]

## 3. Mapa podróży użytkownika

[Opisz przepływ między widokami i kluczowymi interakcjami użytkownika]

## 4. Układ i struktura nawigacji

[Wyjaśnij, w jaki sposób użytkownicy będą poruszać się między widokami]

## 5. Kluczowe komponenty

[Wymień i krótko opisz kluczowe komponenty, które będą używane w wielu widokach].
```

Skup się wyłącznie na architekturze interfejsu użytkownika, podróży użytkownika, nawigacji i kluczowych elementach dla każdego widoku. Nie uwzględniaj szczegółów implementacji, konkretnego projektu wizualnego ani przykładów kodu, chyba że są one kluczowe dla zrozumienia architektury.

Końcowy rezultat powinien składać się wyłącznie z architektury UI w formacie Markdown w języku polskim, którą zapiszesz w pliku .ai/ui-plan.md. Nie powielaj ani nie powtarzaj żadnej pracy wykonanej w bloku myślenia.',
    'published', 2
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l5_ui_id,
    'View Implementation Plan Generation', 'Szczegółowy plan implementacji widoku',
    'Creates detailed view implementation plan with component structure, API integration, state management, and validation.', 'Tworzy szczegółowy plan wdrożenia widoku z strukturą komponentów, integracją API, zarządzaniem stanem i walidacją.',
    'As a senior frontend developer, your task is to create a detailed implementation plan for a new view in a web application. This plan should be comprehensive and clear enough for another frontend developer to implement the view correctly and efficiently.

First, review the following information:

1. Product Requirements Document (PRD):
<prd>
{{prd}} <- replace with reference to @prd.md file
</prd>

2. View Description:
<view_description>
{{view-description}} <- paste description of the view being implemented from ui-plan.md
</view_description>

3. User Stories:
<user_stories>
{{user-stories}} <- paste user stories from @prd.md that will be addressed by the view
</user_stories>

4. Endpoint Description:
<endpoint_description>
{{endpoint-description}} <- paste endpoint descriptions from api-plan.md that the view will use
</endpoint_description>

5. Endpoint Implementation:
<endpoint_implementation>
{{endpoint-implementation}} <- replace with reference to endpoint implementations that the view will use (e.g., @generations.ts, @flashcards.ts)
</endpoint_implementation>

6. Type Definitions:
<type_definitions>
{{types}} <- replace with reference to file with DTO definitions (e.g., @types.ts)
</type_definitions>

7. Tech Stack:
<tech_stack>
{{tech-stack}} <- replace with reference to @tech-stack.md file
</tech_stack>

Before creating the final implementation plan, conduct analysis and planning inside <implementation_breakdown> tags in your thinking block. This section can be quite long, as it''s important to be thorough.

In your implementation breakdown, execute the following steps:
1. For each input section (PRD, User Stories, Endpoint Description, Endpoint Implementation, Type Definitions, Tech Stack):
  - Summarize key points
 - List any requirements or constraints
 - Note any potential challenges or important issues
2. Extract and list key requirements from the PRD
3. List all needed main components, along with a brief description of their purpose, needed types, handled events, and validation conditions
4. Create a high-level component tree diagram
5. Identify required DTOs and custom ViewModel types for each view component. Explain these new types in detail, breaking down their fields and associated types.
6. Identify potential state variables and custom hooks, explaining their purpose and how they''ll be used
7. List required API calls and corresponding frontend actions
8. Map each user story to specific implementation details, components, or functions
9. List user interactions and their expected outcomes
10. List conditions required by the API and how to verify them at the component level
11. Identify potential error scenarios and suggest how to handle them
12. List potential challenges related to implementing this view and suggest possible solutions

After conducting the analysis, provide an implementation plan in Markdown format with the following sections:

1. Overview: Brief summary of the view and its purpose.
2. View Routing: Specify the path where the view should be accessible.
3. Component Structure: Outline of main components and their hierarchy.
4. Component Details: For each component, describe:
 - Component description, its purpose and what it consists of
 - Main HTML elements and child components that build the component
 - Handled events
 - Validation conditions (detailed conditions, according to API)
 - Types (DTO and ViewModel) required by the component
 - Props that the component accepts from parent (component interface)
5. Types: Detailed description of types required for view implementation, including exact breakdown of any new types or view models by fields and types.
6. State Management: Detailed description of how state is managed in the view, specifying whether a custom hook is required.
7. API Integration: Explanation of how to integrate with the provided endpoint. Precisely indicate request and response types.
8. User Interactions: Detailed description of user interactions and how to handle them.
9. Conditions and Validation: Describe what conditions are verified by the interface, which components they concern, and how they affect the interface state
10. Error Handling: Description of how to handle potential errors or edge cases.
11. Implementation Steps: Step-by-step guide for implementing the view.

Ensure your plan is consistent with the PRD, user stories, and includes the provided tech stack.

The final output should be in English and saved in a file named .ai/{view-name}-view-implementation-plan.md. Do not include any analysis and planning in the final output.

Here''s an example of what the output file should look like (content is to be replaced):

```markdown
# View Implementation Plan [View Name]

## 1. Overview
[Brief description of the view and its purpose]

## 2. View Routing
[Path where the view should be accessible]

## 3. Component Structure
[Outline of main components and their hierarchy]

## 4. Component Details
### [Component Name 1]
- Component description [description]
- Main elements: [description]
- Handled interactions: [list]
- Handled validation: [list, detailed]
- Types: [list]
- Props: [list]

### [Component Name 2]
[...]

## 5. Types
[Detailed description of required types]

## 6. State Management
[Description of state management in the view]

## 7. API Integration
[Explanation of integration with provided endpoint, indication of request and response types]

## 8. User Interactions
[Detailed description of user interactions]

## 9. Conditions and Validation
[Detailed description of conditions and their validation]

## 10. Error Handling
[Description of handling potential errors]

## 11. Implementation Steps
1. [Step 1]
2. [Step 2]
3. [...]
```

Begin analysis and planning now. Your final output should consist solely of the implementation plan in English in markdown format, which you will save in the .ai/{view-name}-view-implementation-plan.md file and should not duplicate or repeat any work done in the implementation breakdown.', 'Jako starszy programista frontendu Twoim zadaniem jest stworzenie szczegółowego planu wdrożenia nowego widoku w aplikacji internetowej. Plan ten powinien być kompleksowy i wystarczająco jasny dla innego programisty frontendowego, aby mógł poprawnie i wydajnie wdrożyć widok.

Najpierw przejrzyj następujące informacje:

1. Product Requirements Document (PRD):
<prd>
{{prd}} <- zamień na referencję do pliku @prd.md
</prd>

2. Opis widoku:
<view_description>
{{view-description}} <- wklej opis implementowanego widoku z ui-plan.md
</view_description>

3. User Stories:
<user_stories>
{{user-stories}} <- wklej historyjki użytkownika z @prd.md, które będą adresowane przez widok
</user_stories>

4. Endpoint Description:
<endpoint_description>
{{endpoint-description}} <- wklej opisy endpointów z api-plan.md, z których będzie korzystał widok
</endpoint_description>

5. Endpoint Implementation:
<endpoint_implementation>
{{endpoint-implementation}} <- zamień na referencję do implementacji endpointów, z których będzie korzystał widok (np. @generations.ts, @flashcards.ts)
</endpoint_implementation>

6. Type Definitions:
<type_definitions>
{{types}} <- zamień na referencję do pliku z definicjami DTOsów (np. @types.ts)
</type_definitions>

7. Tech Stack:
<tech_stack>
{{tech-stack}} <- zamień na referencję do pliku @tech-stack.md
</tech_stack>

Przed utworzeniem ostatecznego planu wdrożenia przeprowadź analizę i planowanie wewnątrz tagów <implementation_breakdown> w swoim bloku myślenia. Ta sekcja może być dość długa, ponieważ ważne jest, aby być dokładnym.

W swoim podziale implementacji wykonaj następujące kroki:
1. Dla każdej sekcji wejściowej (PRD, User Stories, Endpoint Description, Endpoint Implementation, Type Definitions, Tech Stack):
- Podsumuj kluczowe punkty
- Wymień wszelkie wymagania lub ograniczenia
- Zwróć uwagę na wszelkie potencjalne wyzwania lub ważne kwestie
2. Wyodrębnienie i wypisanie kluczowych wymagań z PRD
3. Wypisanie wszystkich potrzebnych głównych komponentów, wraz z krótkim opisem ich opisu, potrzebnych typów, obsługiwanych zdarzeń i warunków walidacji
4. Stworzenie wysokopoziomowego diagramu drzewa komponentów
5. Zidentyfikuj wymagane DTO i niestandardowe typy ViewModel dla każdego komponentu widoku. Szczegółowo wyjaśnij te nowe typy, dzieląc ich pola i powiązane typy.
6. Zidentyfikuj potencjalne zmienne stanu i niestandardowe hooki, wyjaśniając ich cel i sposób ich użycia
7. Wymień wymagane wywołania API i odpowiadające im akcje frontendowe
8. Zmapuj każdej historii użytkownika do konkretnych szczegółów implementacji, komponentów lub funkcji
9. Wymień interakcje użytkownika i ich oczekiwane wyniki
10. Wymień warunki wymagane przez API i jak je weryfikować na poziomie komponentów
11. Zidentyfikuj potencjalne scenariusze błędów i zasugeruj, jak sobie z nimi poradzić
12. Wymień potencjalne wyzwania związane z wdrożeniem tego widoku i zasugeruj możliwe rozwiązania

Po przeprowadzeniu analizy dostarcz plan wdrożenia w formacie Markdown z następującymi sekcjami:

1. Przegląd: Krótkie podsumowanie widoku i jego celu.
2. Routing widoku: Określenie ścieżki, na której widok powinien być dostępny.
3. Struktura komponentów: Zarys głównych komponentów i ich hierarchii.
4. Szczegóły komponentu: Dla każdego komponentu należy opisać:
 - Opis komponentu, jego przeznaczenie i z czego się składa
 - Główne elementy HTML i komponenty dzieci, które budują komponent
 - Obsługiwane zdarzenia
 - Warunki walidacji (szczegółowe warunki, zgodnie z API)
 - Typy (DTO i ViewModel) wymagane przez komponent
 - Propsy, które komponent przyjmuje od rodzica (interfejs komponentu)
5. Typy: Szczegółowy opis typów wymaganych do implementacji widoku, w tym dokładny podział wszelkich nowych typów lub modeli widoku według pól i typów.
6. Zarządzanie stanem: Szczegółowy opis sposobu zarządzania stanem w widoku, określenie, czy wymagany jest customowy hook.
7. Integracja API: Wyjaśnienie sposobu integracji z dostarczonym punktem końcowym. Precyzyjnie wskazuje typy żądania i odpowiedzi.
8. Interakcje użytkownika: Szczegółowy opis interakcji użytkownika i sposobu ich obsługi.
9. Warunki i walidacja: Opisz jakie warunki są weryfikowane przez interfejs, których komponentów dotyczą i jak wpływają one na stan interfejsu
10. Obsługa błędów: Opis sposobu obsługi potencjalnych błędów lub przypadków brzegowych.
11. Kroki implementacji: Przewodnik krok po kroku dotyczący implementacji widoku.

Upewnij się, że Twój plan jest zgodny z PRD, historyjkami użytkownika i uwzględnia dostarczony stack technologiczny.

Ostateczne wyniki powinny być w języku polskim i zapisane w pliku o nazwie .ai/{view-name}-view-implementation-plan.md. Nie uwzględniaj żadnej analizy i planowania w końcowym wyniku.

Oto przykład tego, jak powinien wyglądać plik wyjściowy (treść jest do zastąpienia):

```markdown
# Plan implementacji widoku [Nazwa widoku]

## 1. Przegląd
[Krótki opis widoku i jego celu]

## 2. Routing widoku
[Ścieżka, na której widok powinien być dostępny]

## 3. Struktura komponentów
[Zarys głównych komponentów i ich hierarchii]

## 4. Szczegóły komponentów
### [Nazwa komponentu 1]
- Opis komponentu [opis]
- Główne elementy: [opis]
- Obsługiwane interakcje: [lista]
- Obsługiwana walidacja: [lista, szczegółowa]
- Typy: [lista]
- Propsy: [lista]

### [Nazwa komponentu 2]
[...]

## 5. Typy
[Szczegółowy opis wymaganych typów]

## 6. Zarządzanie stanem
[Opis zarządzania stanem w widoku]

## 7. Integracja API
[Wyjaśnienie integracji z dostarczonym endpointem, wskazanie typów żądania i odpowiedzi]

## 8. Interakcje użytkownika
[Szczegółowy opis interakcji użytkownika]

## 9. Warunki i walidacja
[Szczegółowy opis warunków i ich walidacji]

## 10. Obsługa błędów
[Opis obsługi potencjalnych błędów]

## 11. Kroki implementacji
1. [Krok 1]
2. [Krok 2]
3. [...]
```

Rozpocznij analizę i planowanie już teraz. Twój ostateczny wynik powinien składać się wyłącznie z planu wdrożenia w języku polskim w formacie markdown, który zapiszesz w pliku .ai/{view-name}-view-implementation-plan.md i nie powinien powielać ani powtarzać żadnej pracy wykonanej w podziale implementacji.',
    'published', 3
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l5_ui_id,
    'View Implementation', 'Implementacja widoku',
    'Implements view based on detailed plan. Uses 3×3 workflow for iterative implementation of components, API integration, and user interactions.', 'Implementuje widok na podstawie szczegółowego planu. Wykorzystuje workflow 3×3 do iteracyjnej implementacji komponentów, integracji API i interakcji użytkownika.',
    'Your task is to implement a frontend view based on the provided implementation plan and implementation rules. Your goal is to create a detailed and accurate implementation that conforms to the provided plan, correctly represents the component structure, integrates with the API, and handles all specified user interactions.

First, review the implementation plan:

<implementation_plan>
{{implementation-plan}} <- replace with reference to view implementation plan (e.g., @generations-view-implementation-plan.md)
</implementation_plan>

Now review the implementation rules:

<implementation_rules>
{{frontend-rules}}  <- replace with reference to frontend rules (e.g., @shared.mdc, @frontend.mdc, @astro.mdc, @react.mdc, @ui-shadcn-helper.mdc)
</implementation_rules>

Review the defined types:

<types>
{{types}} <- replace with reference to DTO definitions (e.g., @types.ts)
</types>

Implement the plan according to the following approach:

<implementation_approach>
Implement a maximum of 3 steps from the implementation plan, briefly summarize what you''ve done, and describe the plan for the next 3 actions - stop work at this point and wait for my feedback.
</implementation_approach>

Carefully analyze the implementation plan and rules. Pay special attention to component structure, API integration requirements, and user interactions described in the plan.

Execute the following steps to implement the frontend view:

1. Component Structure:
   - Identify all components listed in the implementation plan.
   - Create a hierarchical structure of these components.
   - Ensure that each component''s responsibilities and relationships are clearly defined.

2. API Integration:
   - Identify all API endpoints listed in the plan.
   - Implement necessary API calls for each endpoint.
   - Handle API responses and update component state accordingly.

3. User Interactions:
   - List all user interactions specified in the implementation plan.
   - Implement event handlers for each interaction.
   - Ensure that each interaction triggers the appropriate action or state change.

4. State Management:
   - Identify required state for each component.
   - Implement state management using the appropriate method (local state, custom hook, shared state).
   - Ensure that state changes trigger necessary re-renders.

5. Styling and Layout:
   - Apply specified styling and layout as mentioned in the implementation plan.
   - Ensure responsiveness if required by the plan.

6. Error Handling and Edge Cases:
   - Implement error handling for API calls and user interactions.
   - Consider and handle potential edge cases listed in the plan.

7. Performance Optimization:
   - Implement any performance optimizations specified in the plan or rules.
   - Ensure efficient rendering and minimal unnecessary re-renders.

8. Testing:
   - If specified in the plan, implement unit tests for components and functions.
   - Thoroughly test all user interactions and API integrations.

Throughout the implementation process, strictly adhere to the provided implementation rules. These rules take precedence over any general best practices that may conflict with them.

Ensure that your implementation accurately reflects the provided implementation plan and adheres to all specified rules. Pay special attention to component structure, API integration, and handling of user interactions.', 'Twoim zadaniem jest zaimplementowanie widoku frontendu w oparciu o podany plan implementacji i zasady implementacji. Twoim celem jest stworzenie szczegółowej i dokładnej implementacji, która jest zgodna z dostarczonym planem, poprawnie reprezentuje strukturę komponentów, integruje się z API i obsługuje wszystkie określone interakcje użytkownika.

Najpierw przejrzyj plan implementacji:

<implementation_plan>
{{implementation-plan}} <- zamień na referencję do planu implementacji widoku (np. @generations-view-implementation-plan.md)
</implementation_plan>

Teraz przejrzyj zasady implementacji:

<implementation_rules>
{{frontend-rules}}  <- zamień na referencję do reguł frontendowych (np. @shared.mdc, @frontend.mdc, @astro.mdc, @react.mdc, @ui-shadcn-helper.mdc)
</implementation_rules>

Przejrzyj zdefiniowane typy:

<types>
{{types}} <- zamień na referencję do definicji DTOsów (np. @types.ts)
</types>

Wdrażaj plan zgodnie z następującym podejściem:

<implementation_approach>
Realizuj maksymalnie 3 kroki planu implementacji, podsumuj krótko co zrobiłeś i opisz plan na 3 kolejne działania - zatrzymaj w tym momencie pracę i czekaj na mój feedback.
</implementation_approach>

Dokładnie przeanalizuj plan wdrożenia i zasady. Zwróć szczególną uwagę na strukturę komponentów, wymagania dotyczące integracji API i interakcje użytkownika opisane w planie.

Wykonaj następujące kroki, aby zaimplementować widok frontendu:

1. Struktura komponentów:
   - Zidentyfikuj wszystkie komponenty wymienione w planie wdrożenia.
   - Utwórz hierarchiczną strukturę tych komponentów.
   - Upewnij się, że obowiązki i relacje każdego komponentu są jasno zdefiniowane.

2. Integracja API:
   - Zidentyfikuj wszystkie endpointy API wymienione w planie.
   - Wdróż niezbędne wywołania API dla każdego endpointa.
   - Obsłuż odpowiedzi z API i odpowiednio aktualizacji stan komponentów.

3. Interakcje użytkownika:
   - Wylistuj wszystkie interakcje użytkownika określone w planie wdrożenia.
   - Wdróż obsługi zdarzeń dla każdej interakcji.
   - Upewnij się, że każda interakcja wyzwala odpowiednią akcję lub zmianę stanu.

4. Zarządzanie stanem:
   - Zidentyfikuj wymagany stan dla każdego komponentu.
   - Zaimplementuj zarządzanie stanem przy użyciu odpowiedniej metody (stan lokalny, custom hook, stan współdzielony).
   - Upewnij się, że zmiany stanu wyzwalają niezbędne ponowne renderowanie.

5. Stylowanie i layout:
   - Zastosuj określone stylowanie i layout, jak wspomniano w planie wdrożenia.
   - Zapewnienie responsywności, jeśli wymaga tego plan.

6. Obsługa błędów i przypadki brzegowe:
   - Wdrożenie obsługi błędów dla wywołań API i interakcji użytkownika.
   - Rozważ i obsłuż potencjalne edge case''y wymienione w planie.

7. Optymalizacja wydajności:
   - Wdrożenie wszelkich optymalizacji wydajności określonych w planie lub zasadach.
   - Zapewnienie wydajnego renderowania i minimalnej liczby niepotrzebnych ponownych renderowań.

8. Testowanie:
   - Jeśli zostało to określone w planie, zaimplementuj testy jednostkowe dla komponentów i funkcji.
   - Dokładnie przetestuj wszystkie interakcje użytkownika i integracje API.

W trakcie całego procesu implementacji należy ściśle przestrzegać dostarczonych zasad implementacji. Zasady te mają pierwszeństwo przed wszelkimi ogólnymi najlepszymi praktykami, które mogą być z nimi sprzeczne.

Upewnij się, że twoja implementacja dokładnie odzwierciedla dostarczony plan implementacji i przestrzega wszystkich określonych zasad. Zwróć szczególną uwagę na strukturę komponentów, integrację API i obsługę interakcji użytkownika.',
    'published', 4
  )
  ;

  -- Prompts for Business Logic
  INSERT INTO prompts (
    organization_id, collection_id, segment_id,
    title_en, title_pl,
    description_en, description_pl,
    markdown_body_en, markdown_body_pl,
    status, sort_order
  ) VALUES
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l6_business_logic_id,
    'OpenRouter Service Implementation Plan Generation', 'Generowanie planu implementacji serwisu OpenRouter',
    'Creates comprehensive implementation plan for OpenRouter service for LLM communication. Analyzes tech stack, defines service structure and implementation details.', 'Tworzy kompleksowy plan wdrożenia usługi OpenRouter do komunikacji z LLM. Analizuje tech stack, definiuje strukturę serwisu i szczegóły implementacji.',
    'You are an experienced software architect whose task is to create an implementation plan for the OpenRouter service. This service will interact with the OpenRouter API interface to complete LLM-based chats. Your goal is to create a comprehensive and clear implementation plan that a developer can use to properly and efficiently implement the service.

First, review the provided tech stack and implementation rules:

<tech_stack>
{{tech-stack}}
</tech_stack>

<service_rules>
{{service-rules}}
</service_rules>

Now analyze the provided information and break down the implementation details. Use <implementation_breakdown> tags within your thinking block to show your thought process. Consider the following issues:

1. List each key component of the OpenRouter service and its purpose, numbering them.
2. For each component:
   a. Describe its functionality in detail.
   b. List potential implementation challenges, numbering them.
   c. Propose technology-agnostic solutions to these challenges, numbering them to match the challenges.
3. Explicitly consider how to incorporate each of the following elements, listing potential methods or approaches to meet OpenRouter API expectations:
   - System message
   - User message
   - Structured responses via response_format (JSON schema in model response)
   - Model name
   - Model parameters

Provide specific examples for each element, numbering them. Ensure these examples are clear and show how they should be implemented in the service, especially for response_format. Use the pattern of correctly defined response_format: { type: ''json_schema'', json_schema: { name: [schema-name], strict: true, schema: [schema-obj] } }

4. Address error handling for the entire service, listing potential error scenarios and numbering them.

Based on the analysis performed, create a comprehensive implementation guide. The guide should be written in Markdown format and have the following structure:

1. Service description
2. Constructor description
3. Public methods and fields
4. Private methods and fields
5. Error handling
6. Security considerations
7. Step-by-step implementation plan

Ensure that the implementation plan:
1. Is tailored to the specified tech stack
2. Covers all essential OpenRouter service components
3. Covers error handling and security best practices
4. Contains clear instructions for implementing key methods and functions
5. Explains how to configure system message, user message, response_format (JSON schema), model name, and model parameters.

Use appropriate Markdown formatting for better readability. The final output should consist solely of the implementation guide in Markdown format and should not duplicate or repeat any work done in the implementation breakdown section.

Save the implementation guide in .ai/openrouter-service-implementation-plan.md', 'Jesteś doświadczonym architektem oprogramowania, którego zadaniem jest stworzenie planu wdrożenia usługi OpenRouter. Usługa ta będzie współdziałać z interfejsem API OpenRouter w celu uzupełnienia czatów opartych na LLM. Twoim celem jest stworzenie kompleksowego i przejrzystego planu wdrożenia, który developer może wykorzystać do prawidłowego i sprawnego wdrożenia usługi.

Najpierw przejrzyj dostarczony stack technologiczny i zasady implementacji:

<tech_stack>
{{tech-stack}}
</tech_stack>

<service_rules>
{{service-rules}}
</service_rules>

Teraz przeanalizuj dostarczone informacje i rozbij szczegóły implementacji. Użyj znaczników <implementation_breakdown> wewnątrz bloku myślenia, aby pokazać swój proces myślowy. Rozważ następujące kwestie:

1. Wymień każdy kluczowy komponent usługi OpenRouter i jego cel, numerując je.
2. Dla każdego komponentu:
   a. Szczegółowo opisz jego funkcjonalność.
   b. Wymień potencjalne wyzwania związane z wdrożeniem, numerując je.
   c. Zaproponuj niezależne od technologii rozwiązania tych wyzwań, numerując je tak, aby odpowiadały wyzwaniom.
3. Wyraźne rozważenie sposobu włączenia każdego z poniższych elementów, wymieniając potencjalne metody lub podejścia w celu spełnienia oczekiwań OpenRouter API:
   - Komunikat systemowy
   - Komunikat użytkownika
   - Ustrukturyzowane odpowiedzi poprzez response_format (schemat JSON w odpowiedzi modelu)
   - Nazwa modelu
   - Parametry modelu

Podaj konkretne przykłady dla każdego elementu, numerując je. Upewnij się, że przykłady te są jasne i pokazują, w jaki sposób należy je zaimplementować w usłudze, zwłaszcza w przypadku response_format. Wykorzystaj wzór poprawnie zdefiniowanego response_format: { type: ''json_schema'', json_schema: { name: [schema-name], strict: true, schema: [schema-obj] } }

4. Zajmij się obsługą błędów dla całej usługi, wymieniając potencjalne scenariusze błędów i numerując je.

Na podstawie przeprowadzonej analizy utwórz kompleksowy przewodnik implementacji. Przewodnik powinien być napisany w formacie Markdown i mieć następującą strukturę:

1. Opis usługi
2. Opis konstruktora
3. Publiczne metody i pola
4. Prywatne metody i pola
5. Obsługa błędów
6. Kwestie bezpieczeństwa
7. Plan wdrożenia krok po kroku

Upewnij się, że plan wdrożenia
1. Jest dostosowany do określonego stacku technologicznego
2. Obejmuje wszystkie istotne komponenty usługi OpenRouter
3. Obejmuje obsługę błędów i najlepsze praktyki bezpieczeństwa
4. Zawiera jasne instrukcje dotyczące wdrażania kluczowych metod i funkcji
5. Wyjaśnia, jak skonfigurować komunikat systemowy, komunikat użytkownika, response_format (schemat JSON), nazwę modelu i parametry modelu.

Używa odpowiedniego formatowania Markdown dla lepszej czytelności. Końcowy wynik powinien składać się wyłącznie z przewodnika implementacji w formacie Markdown i nie powinien powielać ani powtarzać żadnej pracy wykonanej w sekcji podziału implementacji.

Zapisz przewodnik implementacji w .ai/openrouter-service-implementation-plan.md',
    'published', 0
  ),
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l6_business_logic_id,
    'OpenRouter Service Implementation', 'Implementacja serwisu OpenRouter',
    'Creates OpenRouter API integration service for LLM model communication. Includes structured outputs handling, error management, and security considerations.', 'Tworzy serwis integracji z OpenRouter API do komunikacji z modelami LLM. Obejmuje obsługę structured outputs, zarządzanie błędami i kwestie bezpieczeństwa.',
    'Your task is to implement a service based on the provided implementation plan and implementation rules. Your goal is to create a detailed and accurate implementation that conforms to the provided plan, properly communicates with the API, and handles all specified functionalities and error cases.

First, review the implementation plan:
<implementation_plan>
{{implementation-plan}} <- replace with reference to service implementation plan

Create the service in {{path}}
</implementation_plan>

Now review the implementation rules:
<implementation_rules>
{{backend-rules}} <- replace with reference to rules useful for the service (e.g., shared.mdc)
</implementation_rules>

Implement the plan according to the following approach:
<implementation_approach>
Implement a maximum of 3 steps from the implementation plan, briefly summarize what you''ve done, and describe the plan for the next 3 actions - stop work at this point and wait for my feedback.
</implementation_approach>

Carefully analyze the implementation plan and rules. Pay special attention to service structure, API integration, error handling, and security concerns described in the plan.

Follow these steps to implement the service:

Service Structure:
- Define the service class according to the implementation plan
- Create a constructor initializing required fields
- Apply appropriate access modifiers for fields and methods (public, private)

Public Methods Implementation:
- Implement public methods listed in the plan
- Ensure each method is properly typed for both parameters and return values
- Provide complete implementation of business logic described in the plan

Private Methods Implementation:
- Develop helper methods listed in the plan
- Ensure proper encapsulation and separation of concerns
- Implement logic for data formatting, sending requests, and processing responses

API Integration:
- Implement logic for communicating with external API
- Handle all necessary request parameters and headers
- Ensure proper processing of API responses

Error Handling:
- Implement comprehensive error handling for all scenarios
- Apply appropriate retry mechanisms for transient errors
- Provide clear error messages for different scenarios

Security:
- Implement recommended security practices mentioned in the plan
- Ensure secure management of API keys and credentials
- Apply input validation to prevent attacks

Documentation and Typing:
- Define and apply appropriate interfaces for parameters and return values
- Ensure full type coverage for the entire service

Testing:
- Prepare service structure in a way that enables easy unit testing
- Include the ability to mock external dependencies

Throughout the implementation process, strictly adhere to the provided implementation rules. These rules take precedence over any general best practices that may conflict with them.

Ensure your implementation accurately reflects the provided implementation plan and adheres to all specified rules. Pay special attention to service structure, API integration, error handling, and security.', 'Twoim zadaniem jest zaimplementowanie serwisu w oparciu o podany plan implementacji i zasady implementacji. Twoim celem jest stworzenie szczegółowej i dokładnej implementacji, która jest zgodna z dostarczonym planem, poprawnie komunikuje się z API i obsługuje wszystkie określone funkcjonalności oraz przypadki błędów.

Najpierw przejrzyj plan implementacji:
<implementation_plan>
{{implementation-plan}} <- zamień na referencję do planu implementacji serwisu

Utwórz serwis w {{sciezka}}
</implementation_plan>

Teraz przejrzyj zasady implementacji:
<implementation_rules>
{{backend-rules}} <- zamień na referencję do reguł przydatnych dla serwisu (np. shared.mdc)
</implementation_rules>

Wdrażaj plan zgodnie z następującym podejściem:
<implementation_approach>
Realizuj maksymalnie 3 kroki planu implementacji, podsumuj krótko co zrobiłeś i opisz plan na 3 kolejne działania - zatrzymaj w tym momencie pracę i czekaj na mój feedback.
</implementation_approach>

Dokładnie przeanalizuj plan wdrożenia i zasady. Zwróć szczególną uwagę na strukturę serwisu, integrację API, obsługę błędów i kwestie bezpieczeństwa opisane w planie.

Wykonaj następujące kroki, aby zaimplementować serwis:

Struktura serwisu:
- Zdefiniuj klasę serwisu zgodnie z planem implementacji
- Utwórz konstruktor inicjalizujący wymagane pola
- Zastosuj odpowiednie modyfikatory dostępu dla pól i metod (public, private)

Implementacja metod publicznych:
- Zaimplementuj metody publiczne wymienione w planie
- Upewnij się, że każda metoda jest poprawnie typowana zarówno dla parametrów jak i zwracanych wartości
- Zapewnij kompletną implementację logiki biznesowej opisanej w planie

Implementacja metod prywatnych:
- Opracuj metody pomocnicze wymienione w planie
- Zapewnij prawidłową enkapsulację i separację odpowiedzialności
- Zaimplementuj logikę formatowania danych, wysyłania żądań i przetwarzania odpowiedzi

Integracja z API:
- Zaimplementuj logikę komunikacji z zewnętrznym API
- Obsłuż wszystkie niezbędne parametry i nagłówki żądań
- Zapewnij poprawne przetwarzanie odpowiedzi z API

Obsługa błędów:
- Zaimplementuj kompleksową obsługę błędów dla wszystkich scenariuszy
- Zastosuj odpowiednie mechanizmy ponownych prób dla błędów przejściowych
- Zapewnij czytelne komunikaty błędów dla różnych scenariuszy

Zabezpieczenia:
- Zaimplementuj zalecane praktyki bezpieczeństwa wymienione w planie
- Zapewnij bezpieczne zarządzanie kluczami API i danymi uwierzytelniającymi
- Zastosuj walidację danych wejściowych dla zapobiegania atakom

Dokumentacja i typowanie:
- Zdefiniuj i zastosuj odpowiednie interfejsy dla parametrów i zwracanych wartości
- Zapewnij pełne pokrycie typami dla całego serwisu

Testowanie:
- Przygotuj strukturę serwisu w sposób umożliwiający łatwe testowanie jednostkowe
- Uwzględnij możliwość mockowania zależności zewnętrznych

W trakcie całego procesu implementacji należy ściśle przestrzegać dostarczonych zasad implementacji. Zasady te mają pierwszeństwo przed wszelkimi ogólnymi najlepszymi praktykami, które mogą być z nimi sprzeczne.

Upewnij się, że twoja implementacja dokładnie odzwierciedla dostarczony plan implementacji i przestrzega wszystkich określonych zasad. Zwróć szczególną uwagę na strukturę serwisu, integrację z API, obsługę błędów i zabezpieczenia.',
    'published', 1
  )
  ;

  RAISE NOTICE 'Successfully seeded % prompts for 10xDevs organization',
    (SELECT COUNT(*) FROM prompts WHERE organization_id = v_org_id);
END $$;
