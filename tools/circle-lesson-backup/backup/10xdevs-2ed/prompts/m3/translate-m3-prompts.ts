#!/usr/bin/env node
/**
 * M3 Prompt Translator
 *
 * Creates English versions of Polish prompts by translating content
 * while preserving technical references and variable placeholders
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { readdirSync } from 'fs';

interface TranslationPair {
  polish: string;
  english: string;
}

// Common translation patterns for technical prompts
const TRANSLATIONS: Record<string, string> = {
  // Common phrases
  'Jesteś doświadczonym': 'You are an experienced',
  'Twoim zadaniem jest': 'Your task is to',
  'Zapoznaj się z': 'Review',
  'Utwórz': 'Create',
  'Zaimplementuj': 'Implement',
  'Zadbaj o zgodność': 'Ensure compatibility',
  'Weź pod uwagę': 'Take into account',
  'Pamiętaj o': 'Remember',
  'Przygotuj': 'Prepare',
  'Zanim rozpoczniemy': 'Before we begin',
  'Rozpocznij od': 'Start by',
  'Przeprowadź': 'Conduct',
  'Przedstaw': 'Present',
  'Oceń': 'Evaluate',
  'Upewnij się': 'Make sure',
  'Porównaj': 'Compare',
  'Które elementy': 'Which elements',

  // Technical terms
  'full-stack web developerem': 'full-stack web developer',
  'specjalizującym się': 'specializing in',
  'wdrażaniu modułu': 'implementing a module for',
  'rejestracji': 'registration',
  'logowania': 'login',
  'odzyskiwania hasła': 'password recovery',
  'użytkowników': 'users',

  // Common instructions
  'na podstawie': 'based on',
  'zgodnie z': 'according to',
  'w oparciu o': 'based on',
  'w kontekście': 'in the context of',
  'w folderze': 'in the folder',
  'w pliku': 'in the file',
  'w projekcie': 'in the project',
};

// Manual translations for each prompt (content only)
const PROMPT_TRANSLATIONS: Record<string, string> = {
  '3x1-1': `You are an experienced full-stack web developer specializing in implementing user registration, login, and password recovery modules. Develop a detailed architecture for this functionality based on requirements from @project-prd.md (US-003 and US-004) and the stack from @tech-stack.md.

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

Present key findings in the form of a descriptive technical specification in Polish - without target implementation, but with indication of individual components, modules, services, and contracts. After completing the task, create a file .ai/auth-spec.md and add the entire specification there.`,

  '3x1-2': `Compare @project-prd.md and @auth-spec.md looking for conflicting and redundant assumptions. Make sure that each User Story can be implemented based on the prepared plan. If you notice conflicts, update @auth-spec.md according to new knowledge.`,

  '3x1-3': `Use project documentation @project-prd.md, authentication specification @auth-spec.md to create a diagram according to the rules - @mermaid-diagram-ui.mdc

Before you begin, search the codebase for elements that may be involved in the authentication process.`,

  '3x1-4': `Your task is to implement user interface elements (pages and forms) for the login, registration, and account recovery process. The specification is located in: @auth-spec.md

Remember the assumptions @astro.mdc and @react.mdc -

Use similar styling to {{EXISTING_COMPONENTS}}

Do not implement backend or application state modifications - we will deal with these elements in the next steps`,

  '3x1-5': `Integrate @login.astro @LoginForm.tsx with the Astro backend based on the specification @auth-spec.md. Start by analyzing the existing code in the context of best practices @astro.mdc and @react.mdc

The presented plan should meet the assumptions outlined in the user stories section: @project-prd.md

Use @supabase-auth.mdc to achieve correct integration of the login process with Supabase Auth.

Before we start, ask me 5 key technical questions addressing unclear elements of integration that will help you carry out the entire implementation from start to finish.`,

  '3x1-6': `Extend @Layout.astro with user state verification - for logged-in users, introduce the ability to log out of the application according to @astro.mdc @react.mdc`,

  '3x1-7': `Make sure that entering the main page @generate.astro is not possible for logged-out users.

Use instructions from @supabase-auth.mdc and implement this mechanism in the most universal and engineering-compliant way.`,

  '3x1-8': `Using @supabase-auth.mdc implement the backend under the page @signup.astro and component @SignupForm.tsx

The logic should be consistent with @login.astro and @LoginForm.tsx

Take into account the behavior of supabase - after registration, a link will be sent to confirm the account by the user - inform about this.`,

  '3x2-1': `In ASCII format, present the structure of components and dependencies starting from @RulePreview.tsx`,

  '3x2-2': `Which elements of this project fragment are worth testing with unit tests and why?`,

  '3x2-3': `Prepare a set of unit tests for \`RulesBuilderService.generateRulesContent()\` taking into account key business rules and edge cases @vitest-unit-testing.mdc`,

  '3x4-1': `Review all files in the @components folder identifying those with the highest number of lines of code.

1) Select and list the paths of the TOP 5 files with the highest LOC, indicating potentially high complexity.

2) Review each file from the TOP 5 suggesting potential refactoring directions (patterns, techniques, and improvements tailored to the technology encountered there) with argumentation.

For reference, base on @tech-stack.md`,

  '3x4-2': '', // Already in English, keep as-is

  '3x4-3': `Evaluate each proposal on a scale of 1-10 in terms of accessibility and ease of use. I care about the user's perspective.

Take into account industry research and studies on each proposal.`,

  '3x4-4': `I decided on option #3. As a frontend, React and Tailwind specialist, create a business specification of changes in the @TwoPane.tsx component. Add information about @tech-stack.md. The specification should not contain implementation details, but only references to components. Make sure that the behavior of panels in desktop mode will not be violated.

Extend the proposed change to hide the classic footer @Footer.tsx in favor of mobile navigation on small screens.

Save the specification in the file in the .ai/ui/mobile-navigation.md folder`,

  '3x4-5': `You are an experienced senior frontend developer.
Implement necessary changes in the project to implement @mobile-navigation.md

Update all indicated components so that they comprehensively influence the completion of the task.

Remember to comply with @tech-stack.md and @react-development.mdc`,

  '3x4-6': `Review the content of @R19Migration and then assess which components in the @rule-builder folder will require correction in case of migration to React 19.`,

  '3x4-7': `The 10xRules project is becoming difficult to maintain. We are preparing to extract domains from the application based on @project-prd.md and the structure and content of the project.

Propose the shape of an example domain according to going cross-sectionally through all layers of the application, describing refactoring suggestions. What DDD patterns - strategic and tactical - should be taken into account?`,

  '3x4-8': `Create a new migration adding RLS to all CRUD operations in the collections table (@database.types.ts) based on recommendations from @supabase-migrations.mdc

Additionally, present instructions for executing the migration on the database and applying changes.`,

  '3x5-1': `You are a GitHub Actions specialist in the stack @tech-stack.md @package.json

Create a "pull-request.yml" scenario based on @github-action.mdc

Workflow:
The "pull-request.yml" scenario should work as follows:

- Linting code
- Then two parallel - unit-test and e2e-test
- Finally - status-comment (comment to PR about the status of the whole)

Additional notes:
- status-comment runs only when the previous set of 3 passes correctly
- in the e2e job download browsers according to @playwright.config.ts
- in the e2e job set the "integration" environment and variables from secrets according to @.env.example
- collect coverage of unit tests and e2e tests`,

  '3x6-1': `In my application, I would like to separate deployments from releases by introducing a feature flag system.

It should be applicable:

- at the api endpoint level (collections, auth)
- at the astro pages level – @login.astro @signup.astro @reset-password.astro
- at the collections visibility level – @TwoPane.tsx and @MobileNavigation.tsx

At the level of the mentioned modules, I should be able to check the state of the flag for a given functionality, according to the environment.

Design a universal TypeScript module that can be used on the frontend and backend (src/features), which will store flag configuration for local, integration, and production environments. Add flags for "auth" and "collections".

I will provide the environment as the ENV_NAME variable (local, integration, prod)

We will deal with integration in the next step. Before we start, ask me 5 questions that will facilitate the entire implementation.`,

  '3x6-2': `You are a GitHub Actions and Cloudflare specialist.

1) Review the project:

- Tech Stack @tech-stack.md
- Current project configuration @astro.config.mjs
- Dependencies and scripts @package.json
- Available environment variables @.env.example

2) Adapt the project to support deployment to Cloudflare

3) Create a CI/CD scenario "master.yml" where we will carry out deployment to an existing Cloudflare Pages project. Base on @pull-request.yml but in the new scenario do not test E2E.

4) At the end, fix the scenario using @github-action.mdc`,

  '3x6-3': `You are a DevOps specialist who is preparing a CI/CD scenario in GitHub Actions - "master-docker.yml".

Prepare a scenario that will place the image @Dockerfile in GitHub Container Registry - "{owner}/{appname}" and then execute Deploy to DigitalOcean App Platform. The container can be tagged with the SHA of the last commit on master.

The job for building the image should use the GHA "production" environment and receive the PUBLIC_ENV_NAME secret as an argument.

<owner>psmyrdek</owner>
<appname>10xrules</appname>

When creating the action, base on @master.yml (most important steps - lint, unit-test)

After completing the draft, make sure you are using the latest and current versions of actions @github-action.mdc

Before we start, ask me additional questions that will help you complete this task.`,

  '3x6-4': `The scenario has an error: "Unable to resolve action \`digitalocean/app-deploy-action@v1\`, repository or version not found"

Fix this with @github-action.mdc`,
};

function translateContent(promptKey: string, polishContent: string): string {
  // If we have a manual translation, use it
  if (PROMPT_TRANSLATIONS[promptKey]) {
    return PROMPT_TRANSLATIONS[promptKey];
  }

  // If content is already in English (starts with common English phrases)
  const englishIndicators = ['You are', 'Your task', 'Please', 'Create a', 'Implement'];
  if (englishIndicators.some(indicator => polishContent.trim().startsWith(indicator))) {
    return polishContent;
  }

  // Otherwise, return original (will need manual translation)
  return polishContent;
}

function createEnglishVersion(polishFilePath: string, outputDir: string): void {
  const content = readFileSync(polishFilePath, 'utf-8');
  const lines = content.split('\n');

  // Find frontmatter end
  const frontmatterEnd = lines.indexOf('---', 1);
  const frontmatter = lines.slice(0, frontmatterEnd + 1).join('\n');
  const polishContent = lines.slice(frontmatterEnd + 1).join('\n').trim();

  // Extract prompt key from filename (e.g., "3x1-1" from "3x1-1-auth-architecture-spec-pl.md")
  const filename = polishFilePath.split('/').pop()!;
  const match = filename.match(/^(\d+x\d+-\d+)-/);
  const promptKey = match ? match[1] : '';

  // Translate content
  const englishContent = translateContent(promptKey, polishContent);

  // Create English filename
  const englishFilename = filename.replace('-pl.md', '-en.md');
  const englishFilePath = join(outputDir, englishFilename);

  // Write English file
  const englishFile = `${frontmatter}\n\n${englishContent}\n`;
  writeFileSync(englishFilePath, englishFile, 'utf-8');

  console.log(`   ✅ ${englishFilename}`);
}

function main() {
  const BASE_DIR = process.cwd();
  const INPUT_DIR = join(BASE_DIR, 'backup/10xdevs-2ed/prompts/m3/individual');

  console.log('🌍 M3 Prompt Translator');
  console.log('========================');
  console.log(`Input: ${INPUT_DIR}`);
  console.log(`Output: ${INPUT_DIR}`);

  // Get all Polish files
  const files = readdirSync(INPUT_DIR)
    .filter(f => f.endsWith('-pl.md'))
    .sort();

  console.log(`\n📝 Translating ${files.length} prompts to English...\n`);

  let count = 0;
  for (const file of files) {
    const filePath = join(INPUT_DIR, file);
    createEnglishVersion(filePath, INPUT_DIR);
    count++;
  }

  console.log('\n========================');
  console.log(`✅ Translation complete: ${count} English files created`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
