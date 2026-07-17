# Plan: Generate Supabase Seed File for 10xDevs M3 Prompts

## Overview
Parse markdown prompt files from `backup/10xdevs-2ed/prompts/m3/individual/` and generate a Supabase seed SQL file that populates the database with bilingual prompts (EN/PL) for the M3 (Production) course module.

## Database Structure Analysis

### Tables to populate:
- `prompt_collections` - Collection groupings (e.g., "m3-prod")
- `prompt_collection_segments` - Segments within collections (e.g., "l1-auth", "l2-unit-tests")
- `prompts` - Individual prompts with bilingual content (en/pl)

### File Naming Pattern:
- `{lesson}-{seq}-{slug}-en.md` + `{lesson}-{seq}-{slug}-pl.md` → 1 prompt row
- Example: `3x1-1-auth-architecture-spec-en.md` + `3x1-1-auth-architecture-spec-pl.md`

### Frontmatter → Database Mapping:
```yaml
frontmatter.title → prompts.title_en / title_pl
frontmatter.description → prompts.description_en / description_pl
frontmatter.collection → prompt_collections.slug
frontmatter.segment → prompt_collection_segments.slug
frontmatter.sort-order → determine prompt order within segment
frontmatter.status → prompts.status
markdown body → prompts.markdown_body_en / markdown_body_pl
```

## Discovered Structure

### Collection:
- `m3-prod` (Production course module)
  - Title: "Module 3: Production Ready"
  - Description: "Advanced production-ready development patterns including authentication, testing, refactoring, CI/CD, and deployment strategies"

### Segments:
1. **l1-auth** (8 prompts)
   - Title: "Authentication & Authorization"
   - Description: "Implementing secure user authentication with Supabase Auth"
   - Sort order: 1

2. **l2-unit-tests** (3 prompts)
   - Title: "Unit Testing"
   - Description: "Writing comprehensive unit tests for components"
   - Sort order: 2

3. **l4-refactor** (8 prompts)
   - Title: "Refactoring & Best Practices"
   - Description: "Code refactoring, DDD patterns, and accessibility improvements"
   - Sort order: 4
   - Note: l3 intentionally skipped in original structure

4. **l5-cicd** (1 prompt)
   - Title: "CI/CD Pipeline"
   - Description: "Setting up continuous integration and deployment workflows"
   - Sort order: 5

5. **l6-deploy** (4 prompts)
   - Title: "Deployment Strategies"
   - Description: "Production deployment with feature flags and multiple platforms"
   - Sort order: 6

### Total: 24 prompts × 2 locales = 48 files

## Detailed Prompt Breakdown

### L1: Authentication (3x1-*) - 8 prompts
| Sort | Slug | Title (EN/PL identical in frontmatter) |
|------|------|----------------------------------------|
| 0 | auth-architecture-spec | Authentication Architecture Specification |
| 1 | auth-spec-validation | Authentication Spec Validation |
| 2 | auth-flow-diagram | Authentication Flow Diagram |
| 3 | auth-ui-implementation | Authentication UI Implementation |
| 4 | login-backend-planning | Login Backend Integration Planning |
| 5 | logout-implementation | Logout Functionality Implementation |
| 6 | route-protection | Route Protection Implementation |
| 7 | signup-backend-implementation | Signup Backend Implementation |

### L2: Unit Tests (3x2-*) - 3 prompts
| Sort | Slug | Title |
|------|------|-------|
| 0 | component-structure-viz | Component Structure Visualization |
| 1 | unit-test-candidates | Unit Testing Candidate Analysis |
| 2 | unit-tests-implementation | Unit Tests Implementation |

### L4: Refactoring (3x4-*) - 8 prompts
| Sort | Slug | Title |
|------|------|-------|
| 0 | component-complexity | Component Complexity Analysis |
| 1 | rhf-refactoring-plan | React Hook Form Refactoring Plan |
| 2 | accessibility-evaluation | Accessibility Evaluation |
| 3 | mobile-nav-spec | Mobile Navigation Specification |
| 4 | mobile-nav-implementation | Mobile Navigation Implementation |
| 5 | react19-migration | React 19 Migration Assessment |
| 6 | ddd-restructuring | Domain-Driven Design Restructuring |
| 7 | rls-migration | Row Level Security Migration |

### L5: CI/CD (3x5-*) - 1 prompt
| Sort | Slug | Title |
|------|------|-------|
| 0 | pr-cicd-workflow | Pull Request CI/CD Workflow |

### L6: Deployment (3x6-*) - 4 prompts
| Sort | Slug | Title |
|------|------|-------|
| 0 | feature-flags-design | Feature Flags System Design |
| 1 | cloudflare-deployment | Cloudflare Pages Deployment Setup |
| 2 | docker-digitalocean-pipeline | Docker DigitalOcean Deployment Pipeline |
| 3 | github-action-fix | GitHub Action Version Fix |

## Implementation Steps

1. **Parse all markdown files**
   - Scan `backup/10xdevs-2ed/prompts/m3/individual/` directory
   - Extract frontmatter (using gray-matter or similar) and body from each file
   - Handle both `-en.md` and `-pl.md` variants

2. **Group by base filename**
   - Pair EN/PL versions together (e.g., `3x1-1-auth-architecture-spec-{en,pl}.md`)
   - Extract metadata: lesson (3x1), sequence (1), slug (auth-architecture-spec)

3. **Extract collection and segments**
   - Collection: `m3-prod`
   - Segments from frontmatter `segment` field: l1-auth, l2-unit-tests, l4-refactor, l5-cicd, l6-deploy
   - Map segments to human-readable titles and descriptions

4. **Generate seed SQL** with structure:
   ```sql
   -- Get 10xdevs org ID
   DO $$
   DECLARE
       org_id UUID;
       collection_id UUID;
       segment_l1_id UUID;
       segment_l2_id UUID;
       segment_l4_id UUID;
       segment_l5_id UUID;
       segment_l6_id UUID;
   BEGIN
       -- Lookup organization
       SELECT id INTO org_id FROM organizations WHERE slug = '10xdevs';

       -- Insert/update collection
       INSERT INTO prompt_collections (organization_id, slug, title_en, title_pl, description_en, description_pl, status)
       VALUES (
           org_id,
           'm3-prod',
           'Module 3: Production Ready',
           'Moduł 3: Produkcja',
           'Advanced production-ready development patterns including authentication, testing, refactoring, CI/CD, and deployment strategies',
           'Zaawansowane wzorce development gotowe na produkcję obejmujące autentykację, testowanie, refaktoryzację, CI/CD i strategie wdrożeniowe',
           'published'
       )
       ON CONFLICT (organization_id, slug)
       DO UPDATE SET
           title_en = EXCLUDED.title_en,
           title_pl = EXCLUDED.title_pl,
           description_en = EXCLUDED.description_en,
           description_pl = EXCLUDED.description_pl,
           updated_at = NOW()
       RETURNING id INTO collection_id;

       -- Insert/update segments (l1-auth, l2-unit-tests, l4-refactor, l5-cicd, l6-deploy)
       -- ... (similar pattern for each segment)

       -- Insert prompts with bilingual content
       -- ... (for each of 24 prompts)
   END $$;
   ```

5. **Handle sort_order**
   - Use frontmatter `sort-order` field to order prompts within segments
   - Maintains sequential ordering (0, 1, 2, ... within each segment)

6. **Output format**
   - Create `supabase/seed-prompts-10xdevs-m3.sql`
   - Follow existing seed file patterns from M2
   - Use `ON CONFLICT DO UPDATE` for idempotency
   - Proper SQL escaping for strings (especially markdown content with quotes/apostrophes)

## Technical Details

### SQL Generation Considerations:
- Use `ON CONFLICT DO UPDATE` for idempotency (can re-run seed safely)
- Proper escaping for SQL strings:
  - Replace `'` with `''` (SQL escape)
  - Handle markdown content with code blocks, quotes, and special characters
  - Use PostgreSQL dollar-quoting for complex strings: `$$content$$`
- Maintain `organization_id` reference throughout all inserts
- Set `created_by` to NULL (can be updated later)
- Default `status` from frontmatter or 'published'
- Use `RETURNING id INTO variable` to capture UUIDs for foreign key references

### Database Schema Reference

#### prompts table columns:
- `id` (UUID, auto-generated)
- `organization_id` (UUID, references organizations)
- `collection_id` (UUID, references prompt_collections)
- `segment_id` (UUID, references prompt_collection_segments, nullable)
- `title_en` (TEXT, required)
- `title_pl` (TEXT, nullable)
- `description_en` (TEXT, nullable)
- `description_pl` (TEXT, nullable)
- `markdown_body_en` (TEXT, required)
- `markdown_body_pl` (TEXT, nullable)
- `status` (TEXT, 'draft' or 'published')
- `created_by` (UUID, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Example Pairing

### Files:
- `3x1-1-auth-architecture-spec-en.md`
- `3x1-1-auth-architecture-spec-pl.md`

### Frontmatter (English version):
```yaml
---
title: "Authentication Architecture Specification"
description: "Creates comprehensive technical specification for authentication system including UI architecture, backend logic, and Supabase Auth integration based on PRD requirements."
collection: m3-prod
segment: l1-auth
sort-order: 0
status: published
---
```

### Frontmatter (Polish version):
```yaml
---
title: "Authentication Architecture Specification"
description: "Creates comprehensive technical specification for authentication system including UI architecture, backend logic, and Supabase Auth integration based on PRD requirements."
collection: m3-prod
segment: l1-auth
sort-order: 0
status: published
---
```

### Becomes one prompt row:
```sql
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
    created_by
) VALUES (
    org_id,
    collection_id,
    segment_l1_id,
    'Authentication Architecture Specification',
    'Authentication Architecture Specification', -- Same as EN in this case
    'Creates comprehensive technical specification for authentication system including UI architecture, backend logic, and Supabase Auth integration based on PRD requirements.',
    'Creates comprehensive technical specification for authentication system including UI architecture, backend logic, and Supabase Auth integration based on PRD requirements.', -- Same as EN
    $$You are an experienced full-stack web developer specializing in implementing user registration, login, and password recovery modules. Develop a detailed architecture for this functionality based on requirements from @project-prd.md (US-003 and US-004) and the stack from @tech-stack.md.

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

Present key findings in the form of a descriptive technical specification in Polish - without target implementation, but with indication of individual components, modules, services, and contracts. After completing the task, create a file .ai/auth-spec.md and add the entire specification there.$$,
    $$Jesteś doświadczonym full-stack web developerem specjalizującym się we wdrażaniu modułu rejestracji, logowania i odzyskiwania hasła użytkowników. Opracuj szczegółową architekturę tej funkcjonalności na podstawie wymagań z pliku @project-prd.md (US-003 i US-004) oraz stacku z @tech-stack.md.

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

Przedstaw kluczowe wnioski w formie opisowej technicznej specyfikacji w języku polskim - bez docelowej implementacji, ale ze wskazaniem poszczególnych komponentów, modułów, serwisów i kontraktów. Po ukończeniu zadania, utwórz plik .ai/auth-spec.md i dodaj tam całą specyfikację.$$,
    'published',
    NULL
)
ON CONFLICT (organization_id, collection_id, segment_id, title_en)
DO UPDATE SET
    title_pl = EXCLUDED.title_pl,
    description_en = EXCLUDED.description_en,
    description_pl = EXCLUDED.description_pl,
    markdown_body_en = EXCLUDED.markdown_body_en,
    markdown_body_pl = EXCLUDED.markdown_body_pl,
    status = EXCLUDED.status,
    updated_at = NOW();
```

## Key Differences from M2

| Aspect | M2 (Bootstrap) | M3 (Production) |
|--------|----------------|-----------------|
| Collection slug | `m2-bootstrap` | `m3-prod` |
| Total prompts | ~24 (varies) | 24 prompts |
| Segments | 6 (l1-l6) | 5 (l1, l2, l4, l5, l6) |
| File prefix | `1x*-` or `2x*-` | `3x*-` |
| Naming pattern | Same | Same |
| Focus | Basic app bootstrap | Production readiness |
| Technical depth | Foundation | Advanced patterns |

## Validation Checklist

Before finalizing the seed file:

- [ ] All 48 files successfully parsed (24 EN + 24 PL)
- [ ] All locale pairs correctly matched
- [ ] Frontmatter fields extracted: title, description, collection, segment, sort-order, status
- [ ] Markdown bodies preserved with proper escaping
- [ ] Collection metadata complete (title EN/PL, description EN/PL)
- [ ] All 5 segments created with proper titles and sort orders
- [ ] Sort order sequential within each segment (0, 1, 2, ...)
- [ ] SQL syntax valid (test with `psql --dry-run` or similar)
- [ ] Idempotency verified (can run seed multiple times safely)
- [ ] Technical references preserved (@file.md, {{VARIABLES}}, .mdc)
- [ ] Special characters properly escaped

## Next Steps

1. **Create seed generator script** (`generate-m3-seed.ts`)
   - Parse M3 individual prompt files
   - Extract and group by locale pairs
   - Generate SQL according to this plan

2. **Generate SQL file** (`supabase/seed-prompts-10xdevs-m3.sql`)
   - Run generator script
   - Review output for correctness

3. **Test seed file**
   - Run against local Supabase instance
   - Verify prompt count: 24 prompts
   - Verify segment distribution: 8+3+8+1+4 = 24
   - Check bilingual content integrity

4. **Document seed process**
   - Update README with M3 seed instructions
   - Document any manual adjustments made

## Notes

- **Frontmatter titles/descriptions**: Already in English for both locales (design decision)
- **Markdown bodies**: Fully bilingual - English vs Polish content
- **Technical references**: Must preserve @ and {{}} syntax exactly
- **L3 segment**: Intentionally skipped (empty in original course structure)
- **Status**: All prompts marked as 'published'
- **Archive**: Original aggregated files preserved in `_archive/` subdirectory

---

**Source files**: `backup/10xdevs-2ed/prompts/m3/individual/*.md` (48 files)
**Target output**: `supabase/seed-prompts-10xdevs-m3.sql`
**Based on**: M2 seed plan pattern (prompt-seed-plan.md)
**Date**: 2025-10-12
