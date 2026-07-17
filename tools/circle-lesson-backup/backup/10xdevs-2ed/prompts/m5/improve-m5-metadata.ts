#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

interface PromptMetadata {
  title: string;
  description: string;
}

// M5-specific metadata improvements following M3 quality standards
// Based on M3_METADATA_IMPROVEMENTS.md patterns
const metadataImprovements: Record<string, PromptMetadata> = {
  // 5x2 - Model Context Protocol (MCP)
  'Model Context Protocol - Prompt 7': {
    title: 'MCP Server Planning',
    description: 'Analyzes project requirements and generates comprehensive planning questions and recommendations for MCP server architecture including tools, resources, data schemas, and deployment strategy.',
  },
  'Model Context Protocol - Prompt 9': {
    title: 'MCP Implementation Plan Creation',
    description: 'Creates detailed technical implementation plan for MCP server including file structure, module definitions, Zod schemas, data providers, error handling, and testing strategy based on planning session notes.',
  },
  'Model Context Protocol - Prompt 10': {
    title: 'MCP Server Implementation',
    description: 'Implements complete MCP server following the technical plan with TypeScript, Cloudflare Workers, and proper tool registration, data handling, validation, and error management.',
  },
};

function improveMetadata(filePath: string): void {
  console.log(`\n📝 Processing: ${path.basename(filePath)}`);

  let content = fs.readFileSync(filePath, 'utf-8');
  let improvementCount = 0;

  // Process each metadata improvement
  for (const [oldTitle, newMetadata] of Object.entries(metadataImprovements)) {
    const oldPattern = new RegExp(
      `title: "${oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\ndescription: "[^"]*"`,
      'g'
    );

    const oldMatch = content.match(oldPattern);
    if (oldMatch) {
      const newPattern = `title: "${newMetadata.title}"\ndescription: "${newMetadata.description}"`;
      content = content.replace(oldPattern, newPattern);
      improvementCount++;
      console.log(`   ✅ Improved: "${oldTitle}" → "${newMetadata.title}"`);
    }
  }

  // Write improved content
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`   📊 Total improvements: ${improvementCount}`);
}

function main() {
  const sourceDir = path.join(process.cwd(), 'backup/10xdevs-2ed/prompts/m5');

  console.log('🚀 M5 Metadata Quality Improvement');
  console.log('===================================');
  console.log(`Source directory: ${sourceDir}`);
  console.log('\nApplying M3-style metadata improvements...');
  console.log('✅ Action-oriented titles (no "Prompt N" suffixes)');
  console.log('✅ Descriptive descriptions (action verb + outcome + context)');
  console.log('✅ Technical specificity (tools, frameworks, patterns)');

  const files = ['5x2_prompts.md', '5x3_prompts.md', '5x4_prompts.md'];

  files.forEach(file => {
    const filePath = path.join(sourceDir, file);
    if (fs.existsSync(filePath)) {
      improveMetadata(filePath);
    } else {
      console.log(`\n⚠️  Skipping: ${file} (not found)`);
    }
  });

  console.log('\n✨ Metadata improvement complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { improveMetadata, metadataImprovements };
