-- ========================================================================
-- ADD THIS TO seed-prompts-10xdevs.sql
-- Insert after the Tech Stack Analysis prompt (around line 398-400)
-- Replace the closing semicolon and parenthesis with a comma, then add:
-- ========================================================================

  ,
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
  )

-- ========================================================================
-- After adding the above, make sure the closing semicolon and parenthesis
-- are at the end (after the new entry)
-- ========================================================================
