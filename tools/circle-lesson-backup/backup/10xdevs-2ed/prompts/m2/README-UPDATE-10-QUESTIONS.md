# Planning Buddy Prompts - 10 Questions Requirement Update

## Overview

This update adds a requirement to generate exactly **10 questions** (with recommendations) for all planning-buddy prompts in the M2 Bootstrap collection. This ensures consistency across all planning assistant prompts.

## Updated Prompts

The following prompts have been updated:

### Database Planning Assistant (l3-database, sort_order: 0)
- **EN**: `1x3-1-database-planning-buddy-en.md`
- **PL**: `1x3-1-database-planning-buddy-pl.md`
- **Change**: Added "generate a list of **10 questions and recommendations in a combined form (question + recommendation)**"

### UI Architecture Planning Assistant (l5-ui, sort_order: 0)
- **EN**: `1x5-1-ui-architecture-planning-buddy-en.md`
- **PL**: `1x5-1-ui-architecture-planning-buddy-pl.md`
- **Change**: Added "generate a list of **10 questions and recommendations in a combined form (question + recommendation)**"

### Already Had Requirement
- **PRD Planning Assistant** (l1-planning, sort_order: 0)
  - `1x1-1-prd-planning-buddy-en.md`
  - `1x1-1-prd-planning-buddy-pl.md`
  - Already specified "10 questions" requirement

## How to Apply

### Run the Update Script

Execute the SQL script in Supabase SQL Editor:

```bash
# Copy the content of update-planning-buddy-10-questions.sql
# and run it in Supabase SQL Editor
```

Or connect via psql:

```bash
psql <your-connection-string> -f update-planning-buddy-10-questions.sql
```

### What the Script Does

1. Looks up organization, collection, and segment IDs
2. Updates `markdown_body_en` and `markdown_body_pl` fields for:
   - Database Planning Assistant (EN & PL)
   - UI Architecture Planning Assistant (EN & PL)
3. Uses precise WHERE clauses to target only the specific prompts
4. Provides feedback via NOTICE messages for each update

### Verification

After running the script, you should see output like:

```
NOTICE:  Updated Database Planning Assistant (EN): 1 rows
NOTICE:  Updated Database Planning Assistant (PL): 1 rows
NOTICE:  Updated UI Architecture Planning Assistant (EN): 1 rows
NOTICE:  Updated UI Architecture Planning Assistant (PL): 1 rows
NOTICE:  Successfully updated all planning-buddy prompts to require exactly 10 questions
```

## Changes Made

### Before
```
Based on your analysis, generate a list of questions and recommendations.
```

### After
```
Based on your analysis, generate a list of 10 questions and recommendations
in a combined form (question + recommendation).
```

## Files

- `update-planning-buddy-10-questions.sql` - SQL update script for Supabase
- `1x3-1-database-planning-buddy-en.md` - Updated EN version (Database)
- `1x3-1-database-planning-buddy-pl.md` - Updated PL version (Database)
- `1x5-1-ui-architecture-planning-buddy-en.md` - Updated EN version (UI)
- `1x5-1-ui-architecture-planning-buddy-pl.md` - Updated PL version (UI)

## Rollback

If you need to rollback, you can modify the script to remove the "10" specification:

```sql
-- Change from:
-- "generate a list of 10 questions and recommendations in a combined form"
-- Back to:
-- "generate a list of questions and recommendations"
```

## Testing

After applying the update:

1. Navigate to the prompt library in your application
2. Open Database Planning Assistant
3. Verify the prompt text includes "10 questions"
4. Open UI Architecture Planning Assistant
5. Verify the prompt text includes "10 questions"
6. Test in both English and Polish language modes
