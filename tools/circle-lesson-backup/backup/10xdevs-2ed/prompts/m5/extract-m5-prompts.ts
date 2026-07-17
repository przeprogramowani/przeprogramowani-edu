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
    file: '33-5x2_model_context_protocol_mcp.html',
    lesson: 'Model Context Protocol',
    expectedPrompts: 10,
    outputFile: '5x2_prompts.md',
    segment: 'l2-mcp',
    sortOrder: 0,
  },
  {
    file: '34-5x3_agent_ai_w_scenariuszach_cicd.html',
    lesson: 'Agent AI in CI/CD Scenarios',
    expectedPrompts: 13,
    outputFile: '5x3_prompts.md',
    segment: 'l3-agent-cicd',
    sortOrder: 1,
  },
  {
    file: '35-5x4_ewaluacja_modeli_pod_aiassisted_development.html',
    lesson: 'Model Evaluation for AI-Assisted Development',
    expectedPrompts: 9,
    outputFile: '5x4_prompts.md',
    segment: 'l4-evaluation',
    sortOrder: 2,
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
 * Generate M5-specific metadata with high quality standards
 * Following M3 metadata improvement patterns
 */
function generateMetadata(
  promptContent: string,
  contextHeadings: string[],
  lessonName: string,
  promptIndex: number
): { title: string; description: string } {
  const content = promptContent.toLowerCase();
  const headings = contextHeadings.map(h => h.toLowerCase());

  let title = '';
  let description = '';

  // Use the most recent heading as a base for the title
  if (contextHeadings.length > 0) {
    title = contextHeadings[contextHeadings.length - 1];
  } else {
    title = `${lessonName} - Prompt ${promptIndex + 1}`;
  }

  // M5-specific metadata patterns based on lesson type
  // For MCP (5x2)
  if (lessonName.includes('Model Context Protocol')) {
    if (content.includes('plan') && (content.includes('serwer') || content.includes('server'))) {
      description = 'Creates comprehensive MCP server specification for integrating external APIs with Claude Desktop.';
    } else if (content.includes('tool') && (content.includes('defini') || content.includes('implemen'))) {
      description = 'Implements MCP tool definitions with JSON-RPC protocol support and error handling.';
    } else if (content.includes('resource')) {
      description = 'Designs MCP resource schema for exposing database queries and file operations to AI models.';
    } else if (content.includes('cloudflare') || content.includes('worker')) {
      description = 'Configures MCP server deployment on Cloudflare Workers with TypeScript and Zod validation.';
    } else if (content.includes('typescript') || content.includes('sdk')) {
      description = 'Implements MCP server using TypeScript SDK with proper type safety and validation.';
    } else {
      description = 'Analyzes MCP server capabilities to identify integration opportunities and limitations.';
    }
  }
  // For Agent CI/CD (5x3)
  else if (lessonName.includes('Agent AI') || lessonName.includes('CI/CD')) {
    if (content.includes('github actions') || content.includes('workflow')) {
      description = 'Creates GitHub Actions workflow leveraging AI agents for automated code review, test generation, and deployment validation.';
    } else if (content.includes('orkie') || content.includes('orchestr')) {
      description = 'Designs multi-agent orchestration pattern for CI/CD pipelines coordinating test execution, code analysis, and deployment.';
    } else if (content.includes('test') && content.includes('automat')) {
      description = 'Implements CI/CD test automation strategy using AI agents for comprehensive coverage and validation.';
    } else if (content.includes('deploy') || content.includes('wdro')) {
      description = 'Configures AI-powered deployment pipeline with automated validation and rollback strategies.';
    } else {
      description = 'Plans agent integration strategy for CI/CD automation workflows and deployment processes.';
    }
  }
  // For Evaluation (5x4)
  else if (lessonName.includes('Evaluation') || lessonName.includes('Ewaluacja')) {
    if (content.includes('benchmar') || content.includes('porówna')) {
      description = 'Implements comprehensive evaluation framework measuring AI model performance on code generation tasks across multiple dimensions.';
    } else if (content.includes('metric') || content.includes('metryki')) {
      description = 'Defines evaluation metrics for assessing model quality including accuracy, speed, cost, and code quality.';
    } else if (content.includes('test') && (content.includes('harness') || content.includes('framework'))) {
      description = 'Creates testing harness for systematic model evaluation with automated scoring and comparison.';
    } else if (content.includes('analiz') || content.includes('analysis')) {
      description = 'Analyzes model performance results to identify strengths, weaknesses, and optimization opportunities.';
    } else {
      description = 'Evaluates AI model capabilities for development tasks with focus on practical code generation scenarios.';
    }
  }
  // Fallback
  else {
    description = `Prompt for ${lessonName.toLowerCase()}`;
  }

  return { title, description };
}

/**
 * Check if a code block is likely a prompt (not config/example)
 * STRICT version - requires clear AI prompt indicators
 */
function isLikelyPrompt(content: string): boolean {
  const trimmed = content.trim();

  // Minimum length requirement for prompts (prompts are typically longer)
  if (trimmed.length < 100) {
    return false;
  }

  // MUST have clear AI prompt indicators
  // Polish: "Jesteś", "Twoim zadaniem", "Twoj celem"
  // English: "You are", "Your task", "Your goal", "Your objective"
  const hasPromptIndicator = /(jesteś|twoim zadaniem|twoim celem|twoja rola|you are|your task is|your goal|your objective|your role)/i.test(trimmed);

  if (!hasPromptIndicator) {
    return false;
  }

  // Skip if it looks like code even with some instructions
  // Code files typically start with: import, const, function, class, etc.
  const firstLine = trimmed.split('\n')[0].trim();
  if (/^(import |export |const |let |var |function |class |interface |type |\/\/|#|--|{|}|\[|\]|<\?|<!)/.test(firstLine)) {
    return false;
  }

  // Skip configuration files (YAML, JSON, etc.)
  if (/^(name:|version:|description:|runs:|steps:|inputs:|outputs:|branding:)/.test(firstLine)) {
    return false;
  }

  // Skip if it's primarily code (has more code patterns than natural language)
  const codePatterns = (trimmed.match(/\b(const|let|var|function|import|export|class|interface|async|await|return|if|else|for|while)\b/g) || []).length;
  const naturalLanguageWords = (trimmed.match(/\b(the|is|are|will|can|should|must|to|and|or|with|from|that|this)\b/gi) || []).length;

  if (codePatterns > naturalLanguageWords / 2) {
    return false;
  }

  return true;
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
collection: m5-innovation
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
      index // Use index for sort-order within the file
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
  const outputDir = path.join(sourceDir, 'prompts/m5');

  console.log('🚀 M5 Prompt Extraction');
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
