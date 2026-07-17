import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Segment metadata mapping
const SEGMENT_METADATA = {
  'l1-onboarding': {
    title_en: 'Onboarding',
    title_pl: 'Wdrożenie',
    description_en: 'Systematic approaches to understanding existing codebases through git history, module analysis, and comprehensive documentation',
    description_pl: 'Systematyczne podejście do zrozumienia istniejącego kodu poprzez historię git, analizę modułów i kompleksową dokumentację',
    sort_order: 1
  },
  'l2-analysis': {
    title_en: 'Analysis & Debugging',
    title_pl: 'Analiza i Debugowanie',
    description_en: 'Issue investigation, action planning, and strategic logging for debugging legacy systems',
    description_pl: 'Badanie problemów, planowanie działań i strategiczne logowanie dla debugowania systemów legacy',
    sort_order: 2
  }
};

interface PromptFile {
  filename: string;
  locale: 'en' | 'pl';
  baseFilename: string;
  frontmatter: {
    title: string;
    description: string;
    collection: string;
    segment: string;
    'sort-order': number;
    status: string;
  };
  body: string;
}

interface PromptPair {
  baseFilename: string;
  segment: string;
  sortOrder: number;
  status: string;
  title_en: string;
  title_pl: string;
  description_en: string;
  description_pl: string;
  body_en: string;
  body_pl: string;
}

// SQL escape function using dollar-quoting
function sqlEscape(text: string, tagNum: number): string {
  return `$prompt${tagNum}$${text}$prompt${tagNum}$`;
}

// Parse all markdown files (excluding certain files)
function parsePromptFiles(directory: string): PromptFile[] {
  const pattern = path.join(directory, '*.md');
  const files = globSync(pattern);

  // Files to exclude
  const excludePatterns = [
    '4x3_prompts.md',
    '4x4_prompts.md',
    '4x5_prompts.md',
    'README.md',
    'm4-prompt-seed-plan.md',
    'm4-split-prompts-plan.md'
  ];

  const filteredFiles = files.filter(filepath => {
    const filename = path.basename(filepath);
    return !excludePatterns.includes(filename);
  });

  return filteredFiles.map(filepath => {
    const content = fs.readFileSync(filepath, 'utf-8');
    const { data, content: body } = matter(content);
    const filename = path.basename(filepath);

    // Extract locale from filename (last part before .md)
    const match = filename.match(/-(en|pl)\.md$/);
    const locale = match ? match[1] as 'en' | 'pl' : 'en';

    // Get base filename without locale suffix
    const baseFilename = filename.replace(/-(en|pl)\.md$/, '');

    return {
      filename,
      locale,
      baseFilename,
      frontmatter: data as PromptFile['frontmatter'],
      body: body.trim()
    };
  });
}

// Group EN/PL pairs
function pairPrompts(files: PromptFile[]): PromptPair[] {
  const grouped = new Map<string, { en?: PromptFile; pl?: PromptFile }>();

  files.forEach(file => {
    if (!grouped.has(file.baseFilename)) {
      grouped.set(file.baseFilename, {});
    }
    const pair = grouped.get(file.baseFilename)!;
    pair[file.locale] = file;
  });

  const pairs: PromptPair[] = [];

  grouped.forEach((pair, baseFilename) => {
    if (!pair.en) {
      console.warn(`Missing EN version for: ${baseFilename}`);
      return;
    }
    if (!pair.pl) {
      console.warn(`Missing PL version for: ${baseFilename}`);
      return;
    }

    pairs.push({
      baseFilename,
      segment: pair.en.frontmatter.segment,
      sortOrder: pair.en.frontmatter['sort-order'],
      status: pair.en.frontmatter.status || 'published',
      title_en: pair.en.frontmatter.title,
      title_pl: pair.pl.frontmatter.title,
      description_en: pair.en.frontmatter.description,
      description_pl: pair.pl.frontmatter.description,
      body_en: pair.en.body,
      body_pl: pair.pl.body
    });
  });

  // Sort by segment and sort order
  pairs.sort((a, b) => {
    const segmentA = SEGMENT_METADATA[a.segment as keyof typeof SEGMENT_METADATA]?.sort_order || 0;
    const segmentB = SEGMENT_METADATA[b.segment as keyof typeof SEGMENT_METADATA]?.sort_order || 0;
    if (segmentA !== segmentB) return segmentA - segmentB;
    return a.sortOrder - b.sortOrder;
  });

  return pairs;
}

// Generate SQL seed file
function generateSeedSQL(pairs: PromptPair[]): string {
  const lines: string[] = [];

  lines.push('-- =====================================================');
  lines.push('-- 10xDevs M4 (Legacy Code) Prompts Seed File');
  lines.push('-- Generated: ' + new Date().toISOString());
  lines.push('-- Total prompts: ' + pairs.length);
  lines.push('-- =====================================================');
  lines.push('');
  lines.push('DO $$');
  lines.push('DECLARE');
  lines.push('    v_org_id UUID;');
  lines.push('    v_collection_id UUID;');

  // Declare segment ID variables
  Object.keys(SEGMENT_METADATA).forEach(segmentSlug => {
    const varName = segmentSlug.replace(/-/g, '_');
    lines.push(`    v_segment_${varName}_id UUID;`);
  });

  lines.push('BEGIN');
  lines.push('    -- =====================================================');
  lines.push('    -- 1. Get organization ID');
  lines.push('    -- =====================================================');
  lines.push("    SELECT id INTO v_org_id FROM organizations WHERE slug = '10xdevs';");
  lines.push('');
  lines.push('    IF v_org_id IS NULL THEN');
  lines.push("        RAISE EXCEPTION 'Organization 10xdevs not found';");
  lines.push('    END IF;');
  lines.push('');
  lines.push("    RAISE NOTICE 'Found organization: %', v_org_id;");
  lines.push('');

  // Insert/update collection
  lines.push('    -- =====================================================');
  lines.push('    -- 2. Insert/Update Collection: m4-legacy');
  lines.push('    -- =====================================================');
  lines.push('    INSERT INTO prompt_collections (');
  lines.push('        organization_id,');
  lines.push('        slug,');
  lines.push('        title,');
  lines.push('        description,');
  lines.push('        sort_order');
  lines.push('    ) VALUES (');
  lines.push('        v_org_id,');
  lines.push("        'm4-legacy',");
  lines.push("        'Module 4: Legacy Code Mastery',");
  lines.push("        'Understanding and working with legacy codebases through git history analysis, systematic onboarding, debugging strategies, and issue resolution workflows',");
  lines.push('        4');
  lines.push('    )');
  lines.push('    ON CONFLICT (organization_id, slug)');
  lines.push('    DO UPDATE SET');
  lines.push('        title = EXCLUDED.title,');
  lines.push('        description = EXCLUDED.description,');
  lines.push('        sort_order = EXCLUDED.sort_order,');
  lines.push('        updated_at = NOW()');
  lines.push('    RETURNING id INTO v_collection_id;');
  lines.push('');
  lines.push("    RAISE NOTICE 'Collection m4-legacy: %', v_collection_id;");
  lines.push('');

  // Insert/update segments
  lines.push('    -- =====================================================');
  lines.push('    -- 3. Insert/Update Segments');
  lines.push('    -- =====================================================');

  Object.entries(SEGMENT_METADATA).forEach(([segmentSlug, meta]) => {
    const varName = segmentSlug.replace(/-/g, '_');
    lines.push(`    -- Segment: ${segmentSlug}`);
    lines.push('    INSERT INTO prompt_collection_segments (');
    lines.push('        collection_id,');
    lines.push('        slug,');
    lines.push('        title,');
    lines.push('        sort_order');
    lines.push('    ) VALUES (');
    lines.push('        v_collection_id,');
    lines.push(`        '${segmentSlug}',`);
    lines.push(`        '${meta.title_en}',`);
    lines.push(`        ${meta.sort_order}`);
    lines.push('    )');
    lines.push('    ON CONFLICT (collection_id, slug)');
    lines.push('    DO UPDATE SET');
    lines.push('        title = EXCLUDED.title,');
    lines.push('        sort_order = EXCLUDED.sort_order,');
    lines.push('        updated_at = NOW()');
    lines.push(`    RETURNING id INTO v_segment_${varName}_id;`);
    lines.push('');
  });

  // Delete existing prompts for this collection (for idempotency)
  lines.push('    -- =====================================================');
  lines.push('    -- 4. Delete existing prompts for this collection');
  lines.push('    -- =====================================================');
  lines.push('    DELETE FROM prompts');
  lines.push('    WHERE collection_id = v_collection_id;');
  lines.push('');
  lines.push("    RAISE NOTICE 'Deleted existing prompts for collection m4-legacy';");
  lines.push('');

  // Insert prompts
  lines.push('    -- =====================================================');
  lines.push('    -- 5. Insert Prompts');
  lines.push('    -- =====================================================');

  pairs.forEach((pair, index) => {
    const segmentVarName = pair.segment.replace(/-/g, '_');
    const promptNum = index + 1;

    lines.push(`    -- Prompt ${promptNum}/${pairs.length}: ${pair.title_en}`);
    lines.push('    INSERT INTO prompts (');
    lines.push('        organization_id,');
    lines.push('        collection_id,');
    lines.push('        segment_id,');
    lines.push('        title_en,');
    lines.push('        title_pl,');
    lines.push('        description_en,');
    lines.push('        description_pl,');
    lines.push('        markdown_body_en,');
    lines.push('        markdown_body_pl,');
    lines.push('        sort_order,');
    lines.push('        status,');
    lines.push('        created_by');
    lines.push('    ) VALUES (');
    lines.push('        v_org_id,');
    lines.push('        v_collection_id,');
    lines.push(`        v_segment_${segmentVarName}_id,`);
    lines.push(`        '${pair.title_en.replace(/'/g, "''")}',`);
    lines.push(`        '${pair.title_pl.replace(/'/g, "''")}',`);
    lines.push(`        '${pair.description_en.replace(/'/g, "''")}',`);
    lines.push(`        '${pair.description_pl.replace(/'/g, "''")}',`);
    lines.push(`        ${sqlEscape(pair.body_en, promptNum * 2 - 1)},`);
    lines.push(`        ${sqlEscape(pair.body_pl, promptNum * 2)},`);
    lines.push(`        ${pair.sortOrder},`);
    lines.push(`        '${pair.status}',`);
    lines.push('        NULL');
    lines.push('    );');
    lines.push('');
  });

  lines.push("    RAISE NOTICE 'Successfully seeded % prompts for M4', " + pairs.length + ";");
  lines.push('END $$;');
  lines.push('');
  lines.push('-- =====================================================');
  lines.push('-- Seed completed successfully');
  lines.push('-- =====================================================');

  return lines.join('\n');
}

// Main execution
function main() {
  console.log('🚀 Generating M4 Prompts Seed File...\n');

  const inputDir = path.join(__dirname);
  const outputFile = path.join(__dirname, '../../../supabase/seed-prompts-10xdevs-m4.sql');

  console.log('📂 Input directory:', inputDir);
  console.log('📄 Output file:', outputFile);
  console.log('');

  // Parse all files
  console.log('📖 Parsing prompt files...');
  const files = parsePromptFiles(inputDir);
  console.log(`   Found ${files.length} files`);

  // Pair EN/PL versions
  console.log('🔗 Pairing EN/PL versions...');
  const pairs = pairPrompts(files);
  console.log(`   Created ${pairs.length} prompt pairs`);

  // Validate counts
  const expectedPairs = 7;
  if (pairs.length !== expectedPairs) {
    console.warn(`⚠️  Warning: Expected ${expectedPairs} pairs, got ${pairs.length}`);
  }

  // Group by segment
  const bySegment = new Map<string, number>();
  pairs.forEach(pair => {
    bySegment.set(pair.segment, (bySegment.get(pair.segment) || 0) + 1);
  });

  console.log('\n📊 Distribution by segment:');
  Array.from(bySegment.entries())
    .sort((a, b) => {
      const sortA = SEGMENT_METADATA[a[0] as keyof typeof SEGMENT_METADATA]?.sort_order || 0;
      const sortB = SEGMENT_METADATA[b[0] as keyof typeof SEGMENT_METADATA]?.sort_order || 0;
      return sortA - sortB;
    })
    .forEach(([segment, count]) => {
      const meta = SEGMENT_METADATA[segment as keyof typeof SEGMENT_METADATA];
      console.log(`   ${segment}: ${count} prompts (${meta?.title_en})`);
    });

  // Generate SQL
  console.log('\n🏗️  Generating SQL...');
  const sql = generateSeedSQL(pairs);

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(outputFile, sql, 'utf-8');

  console.log(`✅ Seed file generated successfully!`);
  console.log(`   ${outputFile}`);
  console.log(`   ${(sql.length / 1024).toFixed(2)} KB`);
  console.log('\n✨ Done!');
}

// Run
main();
