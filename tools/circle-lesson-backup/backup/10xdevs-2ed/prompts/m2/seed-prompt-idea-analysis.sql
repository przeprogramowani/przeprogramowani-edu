-- Seed for Project Idea Analysis prompt (1x1-5)
-- Add this to the existing seed-prompts-10xdevs.sql file
-- or run standalone after the main seed has been executed

DO $$
DECLARE
  v_org_id UUID;
  v_coll_m2_bootstrap_id UUID;
  v_seg_l1_planning_id UUID;
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

  -- Get segment ID
  SELECT id INTO v_seg_l1_planning_id FROM prompt_collection_segments
  WHERE collection_id = v_coll_m2_bootstrap_id AND slug = 'l1-planning';

  IF v_seg_l1_planning_id IS NULL THEN
    RAISE EXCEPTION 'L1 Planning segment not found. Please run the main seed first.';
  END IF;

  -- Delete existing prompt if it exists (for idempotency)
  DELETE FROM prompts
  WHERE organization_id = v_org_id
    AND collection_id = v_coll_m2_bootstrap_id
    AND segment_id = v_seg_l1_planning_id
    AND sort_order = 4;

  -- Insert Project Idea Analysis prompt
  INSERT INTO prompts (
    organization_id, collection_id, segment_id,
    title_en, title_pl,
    description_en, description_pl,
    markdown_body_en, markdown_body_pl,
    status, sort_order
  ) VALUES
  (
    v_org_id, v_coll_m2_bootstrap_id, v_seg_l1_planning_id,
    'Project Idea Analysis', 'Analiza pomysłu na projekt',
    'Interactive MVP project idea analysis. Validates problem reality, focus on key features, 6-week feasibility, and potential risks. Gathers information about experience and tech preferences before analysis.', 'Interaktywna analiza pomysłu na projekt MVP. Weryfikuje realność problemu, focus na kluczowych funkcjach, możliwość realizacji w 6 tygodni oraz potencjalne ryzyka. Przed analizą zbiera informacje o doświadczeniu i preferencjach technologicznych.',
    '<project-idea>
{{DESCRIPTION}} - brief description of the idea you''re considering
</project-idea>

I''m a developer analyzing a project idea that I''ll be working on as part of the 10xDevs course. I''m interested in analysis based on the following criteria:
1. Does the application solve a real problem?
2. Can the application focus on 1-2 key features?
3. Am I able to implement this idea within 6 weeks working on it after hours with AI?
4. Potential difficulties

Before proceeding with the idea analysis, ask me about my experience, preferred tech stack, and other relevant matters that will impact the project implementation.', '<project-idea>
{{DESCRIPTION}} - krótki opis pomysłu, który rozważasz
</project-idea>

Jestem programistą i analizuje pomysł na projekt, nad którym będę pracował w ramach kursu 10xDevs. Interesuje mnie analiza pod kątem poniższych kryteriów:
1. Czy aplikacja rozwiązuje realny problem?
2. Czy w aplikacji można skupić się na 1-2 kluczowych funkcjach?
3. Czy jestem w stanie wdrożyć ten pomysł do 6 tygodni pracując nad nim po godzinach z AI?
4. Potencjalnych trudności

Zanim przejdziesz do analizy pomysłu, zapytaj mnie o moje doświadczenie, preferowany stack technologiczny i inne istotne kwestie, które będą miały wpływ na realizację pomysłu.',
    'published', 4
  );

  RAISE NOTICE 'Project Idea Analysis prompt inserted successfully with sort_order 4';

END $$;
