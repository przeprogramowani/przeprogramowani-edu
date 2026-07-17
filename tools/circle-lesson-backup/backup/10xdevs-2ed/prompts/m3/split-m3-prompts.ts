#!/usr/bin/env node
/**
 * M3 Prompt Splitter
 *
 * Splits aggregated M3 prompt files into individual bilingual files
 * following the M2 naming pattern: {lesson}-{seq}-{title-slug}-{locale}.md
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
}

// Define slug mappings for each lesson
const SLUG_MAPPINGS: Record<string, PromptDefinition[]> = {
  '3x1': [
    { seq: 1, slug: 'auth-architecture-spec' },
    { seq: 2, slug: 'auth-spec-validation' },
    { seq: 3, slug: 'auth-flow-diagram' },
    { seq: 4, slug: 'auth-ui-implementation' },
    { seq: 5, slug: 'login-backend-planning' },
    { seq: 6, slug: 'logout-implementation' },
    { seq: 7, slug: 'route-protection' },
    { seq: 8, slug: 'signup-backend-implementation' },
  ],
  '3x2': [
    { seq: 1, slug: 'component-structure-viz' },
    { seq: 2, slug: 'unit-test-candidates' },
    { seq: 3, slug: 'unit-tests-implementation' },
  ],
  '3x4': [
    { seq: 1, slug: 'component-complexity' },
    { seq: 2, slug: 'rhf-refactoring-plan' },
    { seq: 3, slug: 'accessibility-evaluation' },
    { seq: 4, slug: 'mobile-nav-spec' },
    { seq: 5, slug: 'mobile-nav-implementation' },
    { seq: 6, slug: 'react19-migration' },
    { seq: 7, slug: 'ddd-restructuring' },
    { seq: 8, slug: 'rls-migration' },
  ],
  '3x5': [
    { seq: 1, slug: 'pr-cicd-workflow' },
  ],
  '3x6': [
    { seq: 1, slug: 'feature-flags-design' },
    { seq: 2, slug: 'cloudflare-deployment' },
    { seq: 3, slug: 'docker-digitalocean-pipeline' },
    { seq: 4, slug: 'github-action-fix' },
  ],
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
 * Process a single lesson (e.g., 3x1)
 */
function processLesson(lesson: string, sourceDir: string, outputDir: string): number {
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

    const { seq, slug } = mapping;
    const filename = generateFilename(lesson, seq, slug, 'pl');
    const outputPath = join(outputDir, filename);

    createMarkdownFile(outputPath, prompt.metadata, prompt.content);
    console.log(`   ✅ ${filename}`);
    fileCount++;
  });

  return fileCount;
}

/**
 * Main execution
 */
function main() {
  const BASE_DIR = process.cwd();
  const SOURCE_DIR = join(BASE_DIR, 'backup/10xdevs-2ed/prompts/m3');
  const OUTPUT_DIR = join(BASE_DIR, 'backup/10xdevs-2ed/prompts/m3/individual');

  console.log('🚀 M3 Prompt Splitter');
  console.log('=====================');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('✅ Created output directory');
  }

  // Process all lessons
  const lessons = ['3x1', '3x2', '3x3', '3x4', '3x5', '3x6'];
  let totalFiles = 0;

  for (const lesson of lessons) {
    totalFiles += processLesson(lesson, SOURCE_DIR, OUTPUT_DIR);
  }

  console.log('\n=====================');
  console.log(`✅ Extraction complete: ${totalFiles} Polish files created`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { parsePrompt, splitAggregatedFile, generateFilename, createMarkdownFile };
