#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { load } from 'cheerio';

interface LessonConfig {
  file: string;
  lesson: string;
  expectedPrompts: number;
  outputFile: string;
  segment: string;
  sortOrder: number;
}

const lessons: LessonConfig[] = [
  {
    file: '21-3x1_implementacja_uwierzytelniania_z_supabase_auth.html',
    lesson: 'Authentication with Supabase Auth',
    expectedPrompts: 9,
    outputFile: '3x1_prompts.md',
    segment: 'l1-auth',
    sortOrder: 0,
  },
  {
    file: '22-3x2_test_plan_i_testy_jednostkowe_z_vitest.html',
    lesson: 'Test Plan & Unit Tests',
    expectedPrompts: 3,
    outputFile: '3x2_prompts.md',
    segment: 'l2-unit-tests',
    sortOrder: 1,
  },
  {
    file: '23-3x3_testy_e2e_z_playwright.html',
    lesson: 'E2E Tests with Playwright',
    expectedPrompts: 7,
    outputFile: '3x3_prompts.md',
    segment: 'l3-e2e-tests',
    sortOrder: 2,
  },
  {
    file: '24-3x4_refaktoryzacja_projektu_z_ai.html',
    lesson: 'Project Refactoring with AI',
    expectedPrompts: 7,
    outputFile: '3x4_prompts.md',
    segment: 'l4-refactor',
    sortOrder: 3,
  },
  {
    file: '25-3x5_wdraanie_cicd_z_github_actions.html',
    lesson: 'CI/CD with GitHub Actions',
    expectedPrompts: 2,
    outputFile: '3x5_prompts.md',
    segment: 'l5-cicd',
    sortOrder: 4,
  },
  {
    file: '26-3x6_wdroenie_na_produkcj.html',
    lesson: 'Production Deployment',
    expectedPrompts: 7,
    outputFile: '3x6_prompts.md',
    segment: 'l6-deploy',
    sortOrder: 5,
  },
];

interface ExtractedPrompt {
  content: string;
  title: string;
  description: string;
  contextHeadings: string[];
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
  };

  return text.replace(/&[#\w]+;/g, (match) => entities[match] || match);
}

/**
 * Generate title and description based on context
 */
function generateMetadata(
  promptContent: string,
  contextHeadings: string[],
  lessonName: string,
  promptIndex: number
): { title: string; description: string } {
  // Try to determine the purpose from the prompt content and context
  const content = promptContent.toLowerCase();
  const headings = contextHeadings.map(h => h.toLowerCase());

  let title = '';
  let description = '';

  // Use the most recent heading as a base for the title
  if (contextHeadings.length > 0) {
    const lastHeading = contextHeadings[contextHeadings.length - 1];
    title = lastHeading;
  } else {
    title = `${lessonName} - Prompt ${promptIndex + 1}`;
  }

  // Try to infer description from content patterns
  if (content.includes('test plan') || content.includes('plan testowy')) {
    description = 'Prompt for creating or analyzing test plan';
  } else if (content.includes('vitest') || content.includes('unit test')) {
    description = 'Prompt for implementing unit tests with Vitest';
  } else if (content.includes('playwright') || content.includes('e2e')) {
    description = 'Prompt for implementing E2E tests with Playwright';
  } else if (content.includes('refactor') || content.includes('refaktoryzacja')) {
    description = 'Prompt for code refactoring with AI assistance';
  } else if (content.includes('ci/cd') || content.includes('github actions')) {
    description = 'Prompt for CI/CD setup with GitHub Actions';
  } else if (content.includes('deploy') || content.includes('wdro')) {
    description = 'Prompt for production deployment';
  } else if (content.includes('auth') || content.includes('supabase')) {
    description = 'Prompt for authentication implementation';
  } else if (content.includes('architecture') || content.includes('struktur')) {
    description = 'Prompt for system architecture planning';
  } else if (content.includes('implementa') || content.includes('tworzenie')) {
    description = 'Prompt for feature implementation';
  } else if (content.includes('analiz') || content.includes('przegląd')) {
    description = 'Prompt for code analysis and review';
  } else {
    description = `Prompt for ${lessonName.toLowerCase()}`;
  }

  return { title, description };
}

/**
 * Check if a code block is likely a prompt (not config/example)
 */
function isLikelyPrompt(content: string): boolean {
  const trimmed = content.trim();

  // Skip very short snippets (under 20 chars is definitely not a prompt)
  if (trimmed.length < 20) {
    return false;
  }

  // Skip ASCII tree diagrams (they are examples, not prompts)
  if (trimmed.includes('├──') || trimmed.includes('└──')) {
    return false;
  }

  // Skip URLs (just links, not prompts)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // Check if it's ONLY a URL (single line, no instruction)
    const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 1) {
      return false;
    }
  }

  // Skip error logs (timestamps, WARN, ERROR, etc.)
  if (/^\d{2}:\d{2}:\d{2}/.test(trimmed) || /\[(WARN|ERROR|INFO|DEBUG)\]/.test(trimmed)) {
    return false;
  }

  // Skip PRD/documentation content (starts with // or #)
  if (trimmed.startsWith('//') || (trimmed.startsWith('#') && !trimmed.includes('\n\n'))) {
    // However, if it contains instruction words later, might still be a prompt
    const hasInstructionInContent = /\b(jesteś|twoim zadaniem|wykorzystaj|przygotuj|zaimplementuj|you are|your task|use|prepare|implement)\b/i.test(trimmed);
    if (!hasInstructionInContent) {
      return false;
    }
  }

  // Skip pure code snippets (code without instructional context)
  // Code snippets typically have: const, function, import, etc. without instructions
  const looksLikeCode = /^(const|let|var|function|import|export|class|interface|type|async|await|\{)/m.test(trimmed);
  if (looksLikeCode) {
    // Check if it also has instructional language
    const hasInstruction = /\b(jesteś|twoim|zadaniem|wykorzystaj|przygotuj|stwórz|zaimplementuj|dodaj|wygeneruj|opisz|wyjaśnij|przedstaw|you are|your|task|use|prepare|create|implement|add|generate|describe|explain|present)\b/i.test(trimmed);
    if (!hasInstruction) {
      return false;
    }
  }

  // Skip numbered lists without context (like "1. X\n2. Y")
  if (/^\d+\.\s/.test(trimmed) && trimmed.split('\n').length <= 10) {
    // Check if it has instructional context
    const hasContext = /\b(jesteś|twoim zadaniem|wykorzystaj|przygotuj|zaimplementuj|you are|your task|use|prepare|implement)\b/i.test(trimmed);
    if (!hasContext) {
      return false;
    }
  }

  // Skip pure JSON/configuration (starts with { or [, short, and no natural language)
  if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && trimmed.length < 150) {
    const hasNaturalInJson = /\b(jak|co|które|dlaczego|napisz|przygotuj|stwórz|zaimplementuj|dodaj|wygeneruj|opisz|wyjaśnij|przedstaw|how|what|which|why|write|prepare|create|implement|add|generate|describe|explain|present)\b/i.test(trimmed);
    if (!hasNaturalInJson) {
      return false;
    }
  }

  // Check for natural language instruction/question words (primary indicator)
  const hasInstructionWords = /\b(jesteś|twoim|zadaniem|jak|co|które|dlaczego|napisz|przygotuj|stwórz|zaimplementuj|dodaj|wygeneruj|opisz|wyjaśnij|przedstaw|rozpoczyn|wykonaj|warto|upewnij|wykorzystaj|przeprowadź|you are|your|task|how|what|which|why|write|prepare|create|implement|add|generate|describe|explain|present|start|execute|worth|ensure|use|perform)\b/i.test(trimmed);

  if (hasInstructionWords) {
    // If it has instruction words, it's likely a prompt even if short
    return true;
  }

  // Check for question marks (common in prompts)
  if (trimmed.includes('?')) {
    return true;
  }

  // If single line and very short (under 60 chars) without instruction words, likely config
  const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 1 && trimmed.length < 60) {
    return false;
  }

  // If it's longer and has sentence structure, likely a prompt
  const hasSentenceStructure = /[.!?]/.test(trimmed);
  const hasMultipleParagraphs = trimmed.split('\n\n').length > 1;

  if ((hasSentenceStructure || hasMultipleParagraphs) && trimmed.length > 50) {
    return true;
  }

  return false;
}

/**
 * Extract prompts from HTML file
 */
function extractPromptsFromHtml(htmlPath: string, lessonName: string): ExtractedPrompt[] {
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const $ = load(htmlContent);
  const prompts: ExtractedPrompt[] = [];

  // Find all <pre><code> blocks
  $('pre code').each((index, element) => {
    let content = $(element).text().trim();

    // Skip empty code blocks
    if (!content || content.length < 10) {
      return;
    }

    // Decode HTML entities
    content = decodeHtmlEntities(content);

    // Filter out non-prompts (configs, examples, etc.)
    if (!isLikelyPrompt(content)) {
      return;
    }

    // Get context from surrounding headings
    const contextHeadings: string[] = [];
    let current = $(element).parent().parent(); // Navigate up from code -> pre -> parent

    // Look back for headings (h2, h3, h4)
    while (current.length > 0) {
      const prevHeading = current.prevAll('h2, h3, h4').first();
      if (prevHeading.length > 0) {
        const headingText = prevHeading.text().trim();
        if (headingText && !contextHeadings.includes(headingText)) {
          contextHeadings.unshift(headingText);
        }
        current = prevHeading;
      } else {
        break;
      }
    }

    // Generate metadata
    const { title, description } = generateMetadata(content, contextHeadings, lessonName, index);

    prompts.push({
      content,
      title,
      description,
      contextHeadings,
    });
  });

  return prompts;
}

/**
 * Generate YAML frontmatter for a prompt
 */
function generateFrontmatter(
  title: string,
  description: string,
  segment: string,
  sortOrder: number
): string {
  return `---
title: "${title}"
description: "${description}"
collection: m3-prod
segment: ${segment}
sort-order: ${sortOrder}
status: published
---`;
}

/**
 * Process a single lesson
 */
function processLesson(config: LessonConfig, sourceDir: string, outputDir: string): number {
  const htmlPath = path.join(sourceDir, config.file);

  console.log(`\n📖 Processing: ${config.file}`);
  console.log(`   Expected prompts: ${config.expectedPrompts}`);

  // Extract prompts
  const prompts = extractPromptsFromHtml(htmlPath, config.lesson);
  console.log(`   Found prompts: ${prompts.length}`);

  if (prompts.length !== config.expectedPrompts) {
    console.warn(`   ⚠️  Warning: Expected ${config.expectedPrompts} prompts but found ${prompts.length}`);
  }

  // Generate output content
  const outputLines: string[] = [];

  prompts.forEach((prompt, index) => {
    // Add frontmatter
    const frontmatter = generateFrontmatter(
      prompt.title,
      prompt.description,
      config.segment,
      config.sortOrder
    );

    outputLines.push(frontmatter);
    outputLines.push('');
    outputLines.push(prompt.content);
    outputLines.push('');
    outputLines.push('');
    outputLines.push('');
  });

  // Write output file
  const outputPath = path.join(outputDir, config.outputFile);
  fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf-8');
  console.log(`   ✅ Written to: ${config.outputFile}`);

  return prompts.length;
}

/**
 * Main execution
 */
function main() {
  const sourceDir = path.join(process.cwd(), 'backup/10xdevs-2ed');
  const outputDir = path.join(sourceDir, 'prompts/m3');

  console.log('🚀 M3 Prompt Extraction');
  console.log('=======================');
  console.log(`Source directory: ${sourceDir}`);
  console.log(`Output directory: ${outputDir}`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created output directory`);
  }

  let totalPrompts = 0;
  let totalExpected = 0;

  // Process each lesson
  lessons.forEach(config => {
    totalExpected += config.expectedPrompts;
    const count = processLesson(config, sourceDir, outputDir);
    totalPrompts += count;
  });

  console.log('\n📊 Summary');
  console.log('==========');
  console.log(`Total files processed: ${lessons.length}`);
  console.log(`Total prompts extracted: ${totalPrompts}`);
  console.log(`Total prompts expected: ${totalExpected}`);

  if (totalPrompts === totalExpected) {
    console.log('✅ All prompts extracted successfully!');
  } else {
    console.log(`⚠️  Mismatch: Expected ${totalExpected} but got ${totalPrompts}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { extractPromptsFromHtml, generateFrontmatter, processLesson };
