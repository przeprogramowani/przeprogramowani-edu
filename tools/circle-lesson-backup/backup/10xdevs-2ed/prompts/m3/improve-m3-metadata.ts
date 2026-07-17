#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

interface PromptMetadata {
  title: string;
  description: string;
}

// Mapping of prompt content patterns to improved metadata
const promptMetadataMap: Record<string, PromptMetadata[]> = {
  '3x1_prompts.md': [
    {
      title: 'Authentication Architecture Specification',
      description: 'Creates comprehensive technical specification for authentication system including UI architecture, backend logic, and Supabase Auth integration based on PRD requirements.',
    },
    {
      title: 'Authentication Spec Validation',
      description: 'Validates authentication specification against PRD requirements, identifies conflicts and redundant assumptions, updates documentation accordingly.',
    },
    {
      title: 'Authentication Flow Diagram',
      description: 'Generates Mermaid diagram visualizing authentication architecture based on PRD and auth specification.',
    },
    {
      title: 'Authentication UI Implementation',
      description: 'Implements login, signup, and password recovery pages and forms following Astro and React best practices without backend integration.',
    },
    {
      title: 'Login Backend Integration Planning',
      description: 'Plans login form integration with Astro backend and Supabase Auth. Generates technical questions to clarify implementation details before proceeding.',
    },
    {
      title: 'Logout Functionality Implementation',
      description: 'Extends Layout component with user session verification and logout functionality for authenticated users.',
    },
    {
      title: 'Route Protection Implementation',
      description: 'Implements universal route protection mechanism preventing unauthenticated users from accessing protected pages.',
    },
    {
      title: 'Signup Backend Implementation',
      description: 'Implements backend logic for signup page and form component consistent with login flow, including email confirmation handling.',
    },
  ],
  '3x2_prompts.md': [
    {
      title: 'Component Structure Visualization',
      description: 'Generates ASCII diagram showing component structure and dependencies starting from specified component.',
    },
    {
      title: 'Unit Testing Candidate Analysis',
      description: 'Analyzes project components to identify which elements should be covered with unit tests and provides reasoning.',
    },
    {
      title: 'Unit Tests Implementation',
      description: 'Creates comprehensive unit test suite for specified service covering business rules and edge cases following Vitest best practices.',
    },
  ],
  '3x3_prompts.md': [
    {
      title: 'Database Environment Strategy',
      description: 'Explains recommended hybrid approach for database environments across development, testing, staging, and production using Supabase.',
    },
    {
      title: 'E2E Database Migration Setup',
      description: 'Provides commands for linking to e2e test database project and applying migrations using Supabase CLI.',
    },
    {
      title: 'Test ID Selector Best Practices',
      description: 'Demonstrates correct placement of data-testid attributes within components rather than on component usage for better Playwright compatibility.',
    },
  ],
  '3x4_prompts.md': [
    {
      title: 'Component Complexity Analysis',
      description: 'Analyzes components folder to identify top 5 files with highest LOC and suggests refactoring directions based on tech stack.',
    },
    {
      title: 'React Hook Form Refactoring Plan',
      description: 'Creates detailed refactoring plan for migrating form components to React Hook Form, including API call management and testing strategy.',
    },
    {
      title: 'Accessibility Evaluation',
      description: 'Evaluates proposed solutions on 1-10 scale considering user accessibility and usability based on industry research.',
    },
    {
      title: 'Mobile Navigation Specification',
      description: 'Creates business specification for mobile navigation changes in TwoPane component, including footer hiding on small screens.',
    },
    {
      title: 'Mobile Navigation Implementation',
      description: 'Implements mobile navigation changes across all affected components following the specification and React best practices.',
    },
    {
      title: 'React 19 Migration Assessment',
      description: 'Analyzes components in rule-builder folder to identify which require updates for React 19 migration.',
    },
    {
      title: 'Domain-Driven Design Restructuring',
      description: 'Proposes domain extraction strategy using DDD patterns (strategic and tactical) to improve project maintainability.',
    },
    {
      title: 'Row Level Security Migration',
      description: 'Creates Supabase migration adding Row Level Security to all CRUD operations on collections table with implementation instructions.',
    },
  ],
  '3x5_prompts.md': [
    {
      title: 'GitHub Actions Hello World Example',
      description: 'Basic GitHub Actions workflow example demonstrating simple checkout and echo steps triggered on push and pull requests.',
    },
    {
      title: 'Pull Request CI/CD Workflow',
      description: 'Creates GitHub Actions workflow for pull requests including linting, parallel unit and e2e tests, coverage collection, and PR status comments.',
    },
  ],
  '3x6_prompts.md': [
    {
      title: 'Feature Flags System Design',
      description: 'Designs universal TypeScript feature flag module for frontend and backend supporting environment-based toggles for auth and collections.',
    },
    {
      title: 'Cloudflare Pages Deployment Setup',
      description: 'Configures project for Cloudflare Pages and creates GitHub Actions workflow for automated deployment without e2e tests.',
    },
    {
      title: 'Docker DigitalOcean Deployment Pipeline',
      description: 'Creates GitHub Actions workflow building Docker image, pushing to GitHub Container Registry, and deploying to DigitalOcean App Platform.',
    },
    {
      title: 'GitHub Action Version Fix',
      description: 'Troubleshoots and fixes DigitalOcean action version error in deployment workflow using updated GitHub Actions.',
    },
    {
      title: 'DigitalOcean Deployment Secrets',
      description: 'Documents required secret variables for DigitalOcean App Platform deployment including access token and app ID.',
    },
  ],
};

/**
 * Update metadata in a markdown file
 */
function updatePromptMetadata(filePath: string, newMetadata: PromptMetadata[]): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let result: string[] = [];
  let currentPromptIndex = -1;
  let inFrontmatter = false;
  let frontmatterLineCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect frontmatter boundaries
    if (line === '---') {
      if (!inFrontmatter) {
        // Starting new frontmatter
        inFrontmatter = true;
        frontmatterLineCount = 0;
        currentPromptIndex++;
        result.push(line);
      } else {
        // Ending frontmatter
        inFrontmatter = false;
        result.push(line);
      }
      continue;
    }

    // If we're in frontmatter, update title and description
    if (inFrontmatter) {
      frontmatterLineCount++;

      if (line.startsWith('title:')) {
        const metadata = newMetadata[currentPromptIndex];
        if (metadata) {
          result.push(`title: "${metadata.title}"`);
        } else {
          result.push(line);
        }
      } else if (line.startsWith('description:')) {
        const metadata = newMetadata[currentPromptIndex];
        if (metadata) {
          result.push(`description: "${metadata.description}"`);
        } else {
          result.push(line);
        }
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  fs.writeFileSync(filePath, result.join('\n'), 'utf-8');
}

/**
 * Main execution
 */
function main() {
  const outputDir = path.join(process.cwd(), 'backup/10xdevs-2ed/prompts/m3');

  console.log('🔧 Improving M3 Prompt Metadata');
  console.log('================================');
  console.log(`Working directory: ${outputDir}\n`);

  let filesUpdated = 0;
  let promptsUpdated = 0;

  // Process each file
  Object.entries(promptMetadataMap).forEach(([filename, metadata]) => {
    const filePath = path.join(outputDir, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      return;
    }

    console.log(`📝 Processing: ${filename}`);
    console.log(`   Updating ${metadata.length} prompts...`);

    updatePromptMetadata(filePath, metadata);

    filesUpdated++;
    promptsUpdated += metadata.length;
    console.log(`   ✅ Updated successfully\n`);
  });

  console.log('📊 Summary');
  console.log('==========');
  console.log(`Files updated: ${filesUpdated}`);
  console.log(`Prompts updated: ${promptsUpdated}`);
  console.log('\n✅ All metadata improvements complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updatePromptMetadata, promptMetadataMap };
