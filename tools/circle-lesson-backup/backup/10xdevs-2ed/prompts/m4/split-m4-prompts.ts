#!/usr/bin/env node
/**
 * M4 Prompt Splitter & Translator
 *
 * Splits aggregated M4 prompt files into individual bilingual files
 * following the M2 naming pattern: {lesson}-{seq}-{title-slug}-{locale}.md
 *
 * M4 specifics:
 * - 7 total prompts (5 from 4x1, 2 from 4x2)
 * - Git-focused with placeholders like {{top-modules}}, {{onboarding.md}}
 * - XML-style tags for context: <top_modules>, <project_onboarding_doc>
 * - Multi-phase structures in some prompts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

interface PromptMetadata {
  title: string;
  description: string;
  collection: string;
  segment: string;
  sortOrder: number;
  status: string;
}

interface Prompt {
  metadata: PromptMetadata;
  content: string;
}

interface PromptDefinition {
  seq: number;
  slug: string;
  titleEn: string;
}

// Define slug mappings with English title translations
const SLUG_MAPPINGS: Record<string, PromptDefinition[]> = {
  '4x1': [
    {
      seq: 1,
      slug: 'initial-project-analysis',
      titleEn: 'Initial Project Analysis'
    },
    {
      seq: 2,
      slug: 'module-analysis',
      titleEn: 'Module Analysis Prompt'
    },
    {
      seq: 3,
      slug: 'key-files-analysis',
      titleEn: 'Key Files Analysis Prompt'
    },
    {
      seq: 4,
      slug: 'onboarding-synthesis',
      titleEn: 'Onboarding Synthesis Prompt'
    },
    {
      seq: 5,
      slug: 'no-git-history-analysis',
      titleEn: 'No Git History Analysis Prompt'
    },
  ],
  '4x2': [
    {
      seq: 1,
      slug: 'action-plan-structure',
      titleEn: 'Action Plan Structure Prompt'
    },
    {
      seq: 2,
      slug: 'logging-strategy',
      titleEn: 'Logging Strategy Prompt'
    },
  ],
};

/**
 * Translation mappings for common phrases
 */
const TRANSLATIONS: Record<string, string> = {
  // Common instruction patterns
  'Jesteś': 'You are',
  'jesteś': 'you are',
  'doświadczonym': 'an experienced',
  'Twoim zadaniem jest': 'Your task is to',
  'twoim zadaniem jest': 'your task is to',
  'Zapoznaj się z': 'Review',
  'zapoznaj się z': 'review',
  'Na podstawie': 'Based on',
  'na podstawie': 'based on',
  'Przeanalizuj': 'Analyze',
  'przeanalizuj': 'analyze',
  'Utwórz': 'Create',
  'utwórz': 'create',
  'Dla każdego': 'For each',
  'dla każdego': 'for each',
  'Upewnij się': 'Ensure',
  'upewnij się': 'ensure',

  // M4-specific terms
  'historia git': 'git history',
  'moduł': 'module',
  'modułów': 'modules',
  'plik': 'file',
  'plików': 'files',
  'kluczowych': 'key',
  'kontrybutor': 'contributor',
  'kontrybutorów': 'contributors',
  'analiza': 'analysis',
  'analizy': 'analysis',
  'logi': 'logs',
  'projektu': 'project',
  'dokumentu': 'document',
  'onboardingowego': 'onboarding',
  'syntezy': 'synthesis',
  'aktualizacji': 'update',
  'projektów': 'projects',
  'rozbudowanej': 'extensive',
  'historii': 'history',
  'Struktura': 'Structure',
  'promptu': 'prompt',
  'dodającego': 'adding',
  'planu': 'plan',
  'Wstępna': 'Initial',

  // Preserve these terms unchanged
  'legacy code': 'legacy code',
  'onboarding': 'onboarding',
  'action plan': 'action plan',
};

/**
 * Parse frontmatter and content from a markdown string
 */
function parsePrompt(rawContent: string): Prompt | null {
  const lines = rawContent.trim().split('\n');

  if (lines[0] !== '---') {
    return null;
  }

  const frontmatterEnd = lines.indexOf('---', 1);
  if (frontmatterEnd === -1) {
    return null;
  }

  // Parse frontmatter
  const frontmatterLines = lines.slice(1, frontmatterEnd);
  const metadata: Partial<PromptMetadata> = {};

  for (const line of frontmatterLines) {
    const match = line.match(/^(\w+(?:-\w+)*?):\s*"?(.+?)"?$/);
    if (match) {
      const [, key, value] = match;
      if (key === 'title') metadata.title = value.replace(/^"|"$/g, '');
      if (key === 'description') metadata.description = value.replace(/^"|"$/g, '');
      if (key === 'collection') metadata.collection = value;
      if (key === 'segment') metadata.segment = value;
      if (key === 'sort-order') metadata.sortOrder = parseInt(value, 10);
      if (key === 'status') metadata.status = value;
    }
  }

  // Extract content (everything after second ---)
  const content = lines.slice(frontmatterEnd + 1).join('\n').trim();

  return {
    metadata: metadata as PromptMetadata,
    content,
  };
}

/**
 * Split an aggregated file into individual prompts
 */
function splitAggregatedFile(filePath: string): Prompt[] {
  const fileContent = readFileSync(filePath, 'utf-8');

  // Split by blank lines + --- separator
  // Pattern: content followed by 2-3 newlines, then ---, then next frontmatter
  const sections = fileContent.split(/\n\n+---\n(?=title:)/);

  const prompts: Prompt[] = [];

  for (let i = 0; i < sections.length; i++) {
    let section = sections[i];

    // First section already has opening ---, others need it added back
    if (i > 0) {
      section = '---\n' + section;
    }

    const prompt = parsePrompt(section);
    if (prompt && prompt.content) {
      prompts.push(prompt);
    }
  }

  return prompts;
}

/**
 * Translate Polish content to English
 * Preserves placeholders, XML tags, git commands, and technical terms
 */
function translateContent(polishContent: string): string {
  let translated = polishContent;

  // Note: This is a basic translation function
  // For production use, this should be enhanced with proper NLP or manual review

  // The actual translation will be done manually to ensure quality
  // This function serves as a placeholder and preserves structure

  return translated;
}

/**
 * Generate filename for a prompt
 */
function generateFilename(lesson: string, seq: number, slug: string, locale: 'pl' | 'en'): string {
  return `${lesson}-${seq}-${slug}-${locale}.md`;
}

/**
 * Create markdown file with frontmatter and content
 */
function createMarkdownFile(
  outputPath: string,
  metadata: PromptMetadata,
  content: string
): void {
  const lines = [
    '---',
    `title: "${metadata.title}"`,
    `description: "${metadata.description}"`,
    `collection: ${metadata.collection}`,
    `segment: ${metadata.segment}`,
    `sort-order: ${metadata.sortOrder}`,
    `status: ${metadata.status}`,
    '---',
    '',
    content,
    '',
  ];

  writeFileSync(outputPath, lines.join('\n'), 'utf-8');
}

/**
 * Process a single lesson (e.g., 4x1, 4x2)
 */
function processLesson(
  lesson: string,
  sourceDir: string,
  outputDir: string,
  createEnglish: boolean = false
): number {
  const inputFile = join(sourceDir, `${lesson}_prompts.md`);

  if (!existsSync(inputFile)) {
    console.log(`⚠️  Skipping ${lesson} - file not found`);
    return 0;
  }

  const prompts = splitAggregatedFile(inputFile);
  const slugMappings = SLUG_MAPPINGS[lesson] || [];

  if (prompts.length === 0) {
    console.log(`⚠️  Skipping ${lesson} - no prompts found`);
    return 0;
  }

  console.log(`\n📦 Processing ${lesson} (${prompts.length} prompts)...`);

  let fileCount = 0;

  prompts.forEach((prompt, index) => {
    const mapping = slugMappings[index];
    if (!mapping) {
      console.warn(`   ⚠️  No slug mapping for prompt ${index + 1} in ${lesson}`);
      return;
    }

    const { seq, slug, titleEn } = mapping;

    // Create Polish version
    const filenamePl = generateFilename(lesson, seq, slug, 'pl');
    const outputPathPl = join(outputDir, filenamePl);
    createMarkdownFile(outputPathPl, prompt.metadata, prompt.content);
    console.log(`   ✅ ${filenamePl}`);
    fileCount++;

    // Create English version if requested
    if (createEnglish) {
      const filenameEn = generateFilename(lesson, seq, slug, 'en');
      const outputPathEn = join(outputDir, filenameEn);

      // Create English metadata
      const metadataEn: PromptMetadata = {
        ...prompt.metadata,
        title: titleEn,
        // Description will be translated manually - keep empty for now
        description: prompt.metadata.description || '',
      };

      // For now, use the same content (will be translated manually)
      // In a production scenario, this would call translateContent()
      const contentEn = prompt.content;

      createMarkdownFile(outputPathEn, metadataEn, contentEn);
      console.log(`   ✅ ${filenameEn} (needs manual translation)`);
      fileCount++;
    }
  });

  return fileCount;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const createEnglish = args.includes('--english') || args.includes('-e');

  const BASE_DIR = process.cwd();
  const SOURCE_DIR = join(BASE_DIR, 'backup/10xdevs-2ed/prompts/m4');
  const OUTPUT_DIR = join(BASE_DIR, 'backup/10xdevs-2ed/prompts/m4');

  console.log('🚀 M4 Prompt Splitter & Translator');
  console.log('===================================');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Mode: ${createEnglish ? 'Polish + English' : 'Polish only'}`);

  // Process all M4 lessons
  const lessons = ['4x1', '4x2'];
  let totalFiles = 0;

  for (const lesson of lessons) {
    totalFiles += processLesson(lesson, SOURCE_DIR, OUTPUT_DIR, createEnglish);
  }

  console.log('\n===================================');
  if (createEnglish) {
    console.log(`✅ Extraction complete: ${totalFiles} files created (${totalFiles / 2} Polish + ${totalFiles / 2} English)`);
    console.log('⚠️  English files need manual translation review');
  } else {
    console.log(`✅ Extraction complete: ${totalFiles} Polish files created`);
    console.log('💡 Run with --english flag to create English versions');
  }
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parsePrompt, splitAggregatedFile, generateFilename, createMarkdownFile, processLesson };
