-- Seed for PoC Generator for Key Feature prompt (2x1-6)
-- Collection: m2-foundations
-- Segment: l1-planning
-- Generated from Phase 8 workflow

DO $$
DECLARE
  v_org_id UUID;
  v_coll_m2_foundations_id UUID;
  v_seg_l1_planning_id UUID;
BEGIN
  -- Get 10xDevs organization ID
  SELECT id INTO v_org_id FROM organizations WHERE slug = '10xdevs';

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION '10xDevs organization not found. Please ensure the organization exists.';
  END IF;

  -- Insert/update collection: m2-foundations
  INSERT INTO prompt_collections (organization_id, slug, title, description, sort_order)
  VALUES
    (v_org_id, 'm2-bootstrap', 'M2 Bootstrap', 'Complete set of prompts for bootstrapping M2 projects from planning to implementation', 2)
  ON CONFLICT (organization_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

  -- Get collection ID
  SELECT id INTO v_coll_m2_foundations_id FROM prompt_collections
  WHERE organization_id = v_org_id AND slug = 'm2-bootstrap';

  IF v_coll_m2_foundations_id IS NULL THEN
    RAISE EXCEPTION 'M2 Foundations collection not found after insert.';
  END IF;

  -- Insert/update segment: l1-planning
  INSERT INTO prompt_collection_segments (collection_id, slug, title, sort_order)
  VALUES
    (v_coll_m2_foundations_id, 'l1-planning', 'Planning', 1)
  ON CONFLICT (collection_id, slug) DO UPDATE SET
    title = EXCLUDED.title,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

  -- Get segment ID
  SELECT id INTO v_seg_l1_planning_id FROM prompt_collection_segments
  WHERE collection_id = v_coll_m2_foundations_id AND slug = 'l1-planning';

  IF v_seg_l1_planning_id IS NULL THEN
    RAISE EXCEPTION 'L1 Planning segment not found after insert.';
  END IF;

  -- Delete existing prompt if it exists (for idempotency)
  DELETE FROM prompts
  WHERE organization_id = v_org_id
    AND collection_id = v_coll_m2_foundations_id
    AND segment_id = v_seg_l1_planning_id
    AND sort_order = 6;

  -- Insert prompt: PoC Generator for Key Feature
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
  ) VALUES (
    v_org_id,
    v_coll_m2_foundations_id,
    v_seg_l1_planning_id,
    'PoC Generator for Key Feature',
    'Generator POC dla kluczowej funkcjonalności',
    'Create minimal PoC verifying the main application function with required planning and approval phase.',
    'Stwórz minimalne POC weryfikujące główna wykcję aplikacji z wymaganym etapem planowania i akceptacji.',
    $BODY$Based on the MVP description from @prd.md and the technology stack from @tech-stack.md, prepare a prompt for the proof of concept generator that will allow us to verify the basic functionality of the application, i.e. {{KEYFEATURE}}. Exclude all redundant features. Mark that the generator should plan the work and obtain my approval before proceeding to create the PoC.$BODY$,
    $BODY$Na podstawie opisu MVP z @prd.md oraz stacku technologicznego z @tech-stack.md przygotuj prompt dla generatora proof of concept, który pozwoli nam zweryfikować podstawową funkcjonalność aplikacji czyli {{KEYFEATURE}}. Wyklucz wszystkie nadmiarowe funkcje. Zaznacz, aby generator rozplanował pracę i uzyskał moją akceptację zanim przejdzie do tworzenia PoC.$BODY$,
    'published',
    6
  );

  RAISE NOTICE 'PoC Generator prompt inserted/updated successfully with sort_order 6';

END $$;
