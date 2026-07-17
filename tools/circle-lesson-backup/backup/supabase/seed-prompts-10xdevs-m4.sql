-- =====================================================
-- 10xDevs M4 (Legacy Code) Prompts Seed File
-- Generated: 2025-10-19T07:23:46.015Z
-- Total prompts: 7
-- =====================================================

DO $$
DECLARE
    v_org_id UUID;
    v_collection_id UUID;
    v_segment_l1_onboarding_id UUID;
    v_segment_l2_analysis_id UUID;
BEGIN
    -- =====================================================
    -- 1. Get organization ID
    -- =====================================================
    SELECT id INTO v_org_id FROM organizations WHERE slug = '10xdevs';

    IF v_org_id IS NULL THEN
        RAISE EXCEPTION 'Organization 10xdevs not found';
    END IF;

    RAISE NOTICE 'Found organization: %', v_org_id;

    -- =====================================================
    -- 2. Insert/Update Collection: m4-legacy
    -- =====================================================
    INSERT INTO prompt_collections (
        organization_id,
        slug,
        title,
        description,
        sort_order
    ) VALUES (
        v_org_id,
        'm4-legacy',
        'M4 Legacy',
        'Understanding and working with legacy codebases through git history analysis, systematic onboarding, debugging strategies, and issue resolution workflows',
        4
    )
    ON CONFLICT (organization_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_collection_id;

    RAISE NOTICE 'Collection m4-legacy: %', v_collection_id;

    -- =====================================================
    -- 3. Insert/Update Segments
    -- =====================================================
    -- Segment: l1-onboarding
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l1-onboarding',
        'Onboarding',
        1
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l1_onboarding_id;

    -- Segment: l2-analysis
    INSERT INTO prompt_collection_segments (
        collection_id,
        slug,
        title,
        sort_order
    ) VALUES (
        v_collection_id,
        'l2-analysis',
        'Analysis & Debugging',
        2
    )
    ON CONFLICT (collection_id, slug)
    DO UPDATE SET
        title = EXCLUDED.title,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
    RETURNING id INTO v_segment_l2_analysis_id;

    -- =====================================================
    -- 4. Delete existing prompts for this collection
    -- =====================================================
    DELETE FROM prompts
    WHERE collection_id = v_collection_id;

    RAISE NOTICE 'Deleted existing prompts for collection m4-legacy';

    -- =====================================================
    -- 5. Insert Prompts
    -- =====================================================
    -- Prompt 1/7: Initial Project Analysis
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
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l1_onboarding_id,
        'Initial Project Analysis',
        'Wstępna analiza projektu',
        'Analyzes git history, top modules, and contributors to create comprehensive onboarding documentation. Helps new developers quickly understand project structure and recent developments.',
        'Analizuje historię git, główne moduły i kontrybutorów, aby stworzyć kompleksową dokumentację onboardingową. Pomaga nowym programistom szybko zrozumieć strukturę projektu i ostatnie zmiany.',
        $prompt1$You are an AI assistant tasked with onboarding a new developer to a big project. Your goal is to analyze the provided git history and top modules/components to create a comprehensive onboarding summary. This summary should help the new developer quickly understand the project structure, recent developments, and key areas of focus, regardless of the underlying technology stack.

First, review the following information:

<top_modules>
{{top-modules}} - replace with git script output for modules
</top_modules>

<top_files>
{{top-files}} - replace with git script output for files
</top_files>

<top_contributors>
{{top-contributors}} - replace with git script output for contributors
</top_contributors>

Analyze the git history and top modules/files to identify:
1. The main areas of development focus in the past year.
2. Frequently updated modules, directories, or core files.
3. Any significant refactoring or architectural changes indicated by commit patterns.

Based on your analysis, create an onboarding summary.

**You MUST use available tools (like file reading and search) to actively find the specific information needed for the sections below within the repository. Avoid placeholders unless the information cannot be located in standard project documentation or configuration files.**

**Specifically for 'Core Modules':**
*   When describing 'Key Files/Areas' and 'Top Contributed Files' for each module/package/directory, attempt to verify file paths and roles by listing directory contents or reading key files, correlating with the provided `<top_files>` data.

**Specifically for 'Development Environment Setup':**
*   Search for and read primary project documentation files like `README` (e.g., `README.md`, `README.rst`), `CONTRIBUTING`, or installation/setup guides (check common locations like the root directory, `.github/`, or `docs/`).
*   Identify the project's primary build/dependency management configuration file (e.g., `package.json`, `pom.xml`, `build.gradle`, `requirements.txt`, `Pipfile`, `go.mod`, `Cargo.toml`, `composer.json`, etc.). Read this file if necessary.
*   Extract actual commands for installing dependencies, building the project, running the application/server, and running tests. Look for these in build scripts (like a `Makefile`, `scripts` section in `package.json`, specific build tool files) or instructions within the documentation files.
*   Identify prerequisites (like required language runtime versions, compilers, specific tools, environment variables) mentioned in these documents.
*   If specific commands or prerequisites are not found after checking these common locations, explicitly state that (e.g., "Dependency installation command not found in checked files.").

**Specifically for 'Helpful Resources':**
*   Search for and read `README`, `CONTRIBUTING`, and other documentation files (potentially in a `/docs` or similar directory if `list_dir` shows one exists).
*   Extract actual URLs for external documentation websites, the project's issue tracker (e.g., GitHub Issues, Jira), contribution guidelines, communication channels (like Discord, Slack, mailing list links), etc., mentioned in these files.
*   If specific links are not found, explicitly state that (e.g., "Link to communication channel not found in checked files.").

To accomplish this task, you have access to the following tools:
1. file_read: Reads the content of a specified file.
2. file_search: Searches for files matching a given pattern.
3. list_dir: Lists the contents of a specified directory.

Generate a list of 5-7 questions that the new developer should dig into via analysing the codebase, git history and project repository (e.g., on GitHub, GitLab) to gain a deeper understanding of the project. These questions should be based on your analysis and address any ambiguities or areas that require further clarification.

Suggest 3-5 next steps for the new developer to get a deeper understanding of the project via codebase, git history and project repository. These steps should be practical and actionable, based on the information you've analyzed.

Your final output should **only** include the content in markdown with the specified format that you will save in `.ai/onboarding.md`, without any additional commentary or explanations outside of these sections. Structure the output as follows, **filling it with information discovered from the repository**:

```markdown
# Project Onboarding: [Project Name Found in Repo, e.g., from README or build config]

## Welcome

Welcome to the [Project Name Found in Repo] project! [Brief 1-2 sentence description of what the project does and its purpose, potentially summarized from README].

## Project Overview & Structure

The core functionality revolves around [key functionality description, inferred from README/context]. The project is organized as [monorepo/multi-project/single application/etc.], with the following key components/modules:

## Core Modules

### `[Module/Package/Directory Name]`

- **Role:** [Concise description of this component's purpose]
- **Key Files/Areas:**
  - [Category/Group Name]: `path/to/file1`, `path/to/file2`, etc.
  - [Category/Group Name]: `path/to/file3`, `path/to/file4`, etc.
- **Top Contributed Files:** `path/to/filename`, `path/to/filename`, etc.
- **Recent Focus:** [Description of recent work, features, or bug fixes in this area with issue/PR references if possible to infer]

[Repeat for each major module/package/directory based on the top_modules data]

## Key Contributors

- **[Contributor Name]:** [Areas of focus or expertise, key contributions based on available data]
- **[Contributor Name]:** [Areas of focus or expertise, key contributions based on available data]
[List top 3-5 contributors]

## Overall Takeaways & Recent Focus

1. **[Major Theme/Initiative]:** [Description of significant recent project-wide change based on active modules/files]
2. **Feature Development:** [Description of recent major features added to the project, inferred from active areas]
3. **[Specific Area] Improvements:** [Details on focused improvements in a particular active area]
4. **UI/UX Refinement (if applicable):** [Recent UI/UX changes and improvements, inferred from relevant file activity]
5. **Performance & Stability:** [Recent performance optimizations and stability improvements, inferred from core logic/testing activity]

## Potential Complexity/Areas to Note

- **[Complex Area]:** [Description of why this area might be complex (e.g., core domain logic, concurrency, state management, external system integration) and what to watch out for]
- **[Complex Area]:** [Description of why this area might be complex and what to watch out for]
- **[Complex Area]:** [Description of why this area might be complex and what to watch out for]

## Questions for the Team

1. [Question about project structure, architecture, or key design decisions]
2. [Question about build process, deployment, or development workflows inferred from setup/docs]
3. [Question about specific complex areas identified]
4. [Question about data persistence, state management, or inter-service communication patterns]
5. [Question about contributing changes to active modules or adding new features]
6. [Question about testing strategy, code quality standards, or CI/CD pipeline]
7. [Question about collaboration, code ownership, or release process]

## Next Steps

1. **[Action Item]:** [Specific details, e.g., Set up the development environment using instructions found in README]
2. **[Action Item]:** [Specific details, e.g., Explore the `[highly_active_module/directory]` identified as highly active]
3. **[Action Item]:** [Specific details, e.g., Run the project's test suite using the command found in the build configuration/documentation]
4. **[Action Item]:** [Specific details, e.g., Trace a core business logic flow related to `[frequently_edited_core_file]`]
5. **[Action Item]:** [Specific details, e.g., Review recent Pull Requests/Merge Requests related to `[another_active_module]`]

## Development Environment Setup

1. **Prerequisites:** [Actual prerequisites found, e.g., Language Runtime version X.Y, Compiler Z, Tool A]
2. **Dependency Installation:** `[Actual command(s) found, or "Command not specified"]`
3. **Building the Project (if applicable):** `[Actual command(s) found, or "Command not specified"]`
4. **Running the Application/Service:** `[Actual command(s) found, or "Command not specified"]`
5. **Running Tests:** `[Actual command(s) found, or "Command not specified"]`
6. **Common Issues:** [Summarize common setup issues mentioned in docs, or state "Common issues section not found in checked files"]

## Helpful Resources

- **Documentation:** [Actual link(s) found, or state "Primary documentation link not found"]
- **Issue Tracker:** [Actual link(s) found, e.g., GitHub Issues URL, Jira Project URL]
- **Contribution Guide:** [Actual link(s) found]
- **Communication Channels:** [Actual link(s) found, e.g., Slack invite, mailing list archive]
- **Learning Resources:** [Actual link(s) found, or state "Specific learning resources section not found"]

Ensure that all information in the summary is based on <top_modules>, <top_files>, <top_contributors> and your exploration of the project using the provided tools. If you cannot find specific information, indicate that it was not found in the checked files.

Your final output should consist only of the markdown-formatted onboarding summary that you will save in .ai/onboarding.md and should not duplicate or rehash any of the work you did in the exploration section of the thinking block. Finish the work after you created document with a required structure and content.

Begin your response with your exploration.$prompt1$,
        $prompt2$You are an AI assistant tasked with onboarding a new developer to a big project. Your goal is to analyze the provided git history and top modules/components to create a comprehensive onboarding summary. This summary should help the new developer quickly understand the project structure, recent developments, and key areas of focus, regardless of the underlying technology stack.

First, review the following information:

<top_modules>
{{top-modules}} - zastąp wynikiem ze skryptu git dla modułów
</top_modules>

<top_files>
{{top-files}} - zastąp wynikiem ze skryptu git dla plików
</top_files>

<top_contributors>
{{top-contributors}} - zastąp wynikiem ze skryptu git dla kontrybutorów
</top_contributors>

Analyze the git history and top modules/files to identify:
1. The main areas of development focus in the past year.
2. Frequently updated modules, directories, or core files.
3. Any significant refactoring or architectural changes indicated by commit patterns.

Based on your analysis, create an onboarding summary.

**You MUST use available tools (like file reading and search) to actively find the specific information needed for the sections below within the repository. Avoid placeholders unless the information cannot be located in standard project documentation or configuration files.**

**Specifically for 'Core Modules':**
*   When describing 'Key Files/Areas' and 'Top Contributed Files' for each module/package/directory, attempt to verify file paths and roles by listing directory contents or reading key files, correlating with the provided `<top_files>` data.

**Specifically for 'Development Environment Setup':**
*   Search for and read primary project documentation files like `README` (e.g., `README.md`, `README.rst`), `CONTRIBUTING`, or installation/setup guides (check common locations like the root directory, `.github/`, or `docs/`).
*   Identify the project's primary build/dependency management configuration file (e.g., `package.json`, `pom.xml`, `build.gradle`, `requirements.txt`, `Pipfile`, `go.mod`, `Cargo.toml`, `composer.json`, etc.). Read this file if necessary.
*   Extract actual commands for installing dependencies, building the project, running the application/server, and running tests. Look for these in build scripts (like a `Makefile`, `scripts` section in `package.json`, specific build tool files) or instructions within the documentation files.
*   Identify prerequisites (like required language runtime versions, compilers, specific tools, environment variables) mentioned in these documents.
*   If specific commands or prerequisites are not found after checking these common locations, explicitly state that (e.g., "Dependency installation command not found in checked files.").

**Specifically for 'Helpful Resources':**
*   Search for and read `README`, `CONTRIBUTING`, and other documentation files (potentially in a `/docs` or similar directory if `list_dir` shows one exists).
*   Extract actual URLs for external documentation websites, the project's issue tracker (e.g., GitHub Issues, Jira), contribution guidelines, communication channels (like Discord, Slack, mailing list links), etc., mentioned in these files.
*   If specific links are not found, explicitly state that (e.g., "Link to communication channel not found in checked files.").

To accomplish this task, you have access to the following tools:
1. file_read: Reads the content of a specified file.
2. file_search: Searches for files matching a given pattern.
3. list_dir: Lists the contents of a specified directory.

Generate a list of 5-7 questions that the new developer should dig into via analysing the codebase, git history and project repository (e.g., on GitHub, GitLab) to gain a deeper understanding of the project. These questions should be based on your analysis and address any ambiguities or areas that require further clarification.

Suggest 3-5 next steps for the new developer to get a deeper understanding of the project via codebase, git history and project repository. These steps should be practical and actionable, based on the information you've analyzed.

Your final output should **only** include the content in markdown with the specified format that you will save in `.ai/onboarding.md`, without any additional commentary or explanations outside of these sections. Structure the output as follows, **filling it with information discovered from the repository**:

```markdown
# Project Onboarding: [Project Name Found in Repo, e.g., from README or build config]

## Welcome

Welcome to the [Project Name Found in Repo] project! [Brief 1-2 sentence description of what the project does and its purpose, potentially summarized from README].

## Project Overview & Structure

The core functionality revolves around [key functionality description, inferred from README/context]. The project is organized as [monorepo/multi-project/single application/etc.], with the following key components/modules:

## Core Modules

### `[Module/Package/Directory Name]`

- **Role:** [Concise description of this component's purpose]
- **Key Files/Areas:**
  - [Category/Group Name]: `path/to/file1`, `path/to/file2`, etc.
  - [Category/Group Name]: `path/to/file3`, `path/to/file4`, etc.
- **Top Contributed Files:** `path/to/filename`, `path/to/filename`, etc.
- **Recent Focus:** [Description of recent work, features, or bug fixes in this area with issue/PR references if possible to infer]

[Repeat for each major module/package/directory based on the top_modules data]

## Key Contributors

- **[Contributor Name]:** [Areas of focus or expertise, key contributions based on available data]
- **[Contributor Name]:** [Areas of focus or expertise, key contributions based on available data]
[List top 3-5 contributors]

## Overall Takeaways & Recent Focus

1. **[Major Theme/Initiative]:** [Description of significant recent project-wide change based on active modules/files]
2. **Feature Development:** [Description of recent major features added to the project, inferred from active areas]
3. **[Specific Area] Improvements:** [Details on focused improvements in a particular active area]
4. **UI/UX Refinement (if applicable):** [Recent UI/UX changes and improvements, inferred from relevant file activity]
5. **Performance & Stability:** [Recent performance optimizations and stability improvements, inferred from core logic/testing activity]

## Potential Complexity/Areas to Note

- **[Complex Area]:** [Description of why this area might be complex (e.g., core domain logic, concurrency, state management, external system integration) and what to watch out for]
- **[Complex Area]:** [Description of why this area might be complex and what to watch out for]
- **[Complex Area]:** [Description of why this area might be complex and what to watch out for]

## Questions for the Team

1. [Question about project structure, architecture, or key design decisions]
2. [Question about build process, deployment, or development workflows inferred from setup/docs]
3. [Question about specific complex areas identified]
4. [Question about data persistence, state management, or inter-service communication patterns]
5. [Question about contributing changes to active modules or adding new features]
6. [Question about testing strategy, code quality standards, or CI/CD pipeline]
7. [Question about collaboration, code ownership, or release process]

## Next Steps

1. **[Action Item]:** [Specific details, e.g., Set up the development environment using instructions found in README]
2. **[Action Item]:** [Specific details, e.g., Explore the `[highly_active_module/directory]` identified as highly active]
3. **[Action Item]:** [Specific details, e.g., Run the project's test suite using the command found in the build configuration/documentation]
4. **[Action Item]:** [Specific details, e.g., Trace a core business logic flow related to `[frequently_edited_core_file]`]
5. **[Action Item]:** [Specific details, e.g., Review recent Pull Requests/Merge Requests related to `[another_active_module]`]

## Development Environment Setup

1. **Prerequisites:** [Actual prerequisites found, e.g., Language Runtime version X.Y, Compiler Z, Tool A]
2. **Dependency Installation:** `[Actual command(s) found, or "Command not specified"]`
3. **Building the Project (if applicable):** `[Actual command(s) found, or "Command not specified"]`
4. **Running the Application/Service:** `[Actual command(s) found, or "Command not specified"]`
5. **Running Tests:** `[Actual command(s) found, or "Command not specified"]`
6. **Common Issues:** [Summarize common setup issues mentioned in docs, or state "Common issues section not found in checked files"]

## Helpful Resources

- **Documentation:** [Actual link(s) found, or state "Primary documentation link not found"]
- **Issue Tracker:** [Actual link(s) found, e.g., GitHub Issues URL, Jira Project URL]
- **Contribution Guide:** [Actual link(s) found]
- **Communication Channels:** [Actual link(s) found, e.g., Slack invite, mailing list archive]
- **Learning Resources:** [Actual link(s) found, or state "Specific learning resources section not found"]

Ensure that all information in the summary is based on <top_modules>, <top_files>, <top_contributors> and your exploration of the project using the provided tools. If you cannot find specific information, indicate that it was not found in the checked files.

Your final output should consist only of the markdown-formatted onboarding summary that you will save in .ai/onboarding.md and should not duplicate or rehash any of the work you did in the exploration section of the thinking block. Finish the work after you created document with a required structure and content.

Begin your response with your exploration.$prompt2$,
        0,
        'published',
        NULL
    );

    -- Prompt 2/7: Core Modules Deep Dive
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
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l1_onboarding_id,
        'Core Modules Deep Dive',
        'Dogłębna analiza głównych modułów',
        'Deep analysis of core project modules based on onboarding documentation. Identifies patterns, dependencies, and architectural decisions for each key module.',
        'Dogłębna analiza głównych modułów projektu na podstawie dokumentacji onboardingowej. Identyfikuje wzorce, zależności i decyzje architektoniczne dla każdego kluczowego modułu.',
        $prompt3$You are a skilled software developer tasked with analyzing the core modules of a project. Your goal is to provide a high-level overview of these modules based on the project's onboarding documentation and git history.

First, carefully read the project onboarding document:

<project_onboarding_doc>
{{onboarding.md}} - pass reference to onboarding documentation

</project_onboarding_doc>

Based on this document, identify the core modules of the project. For each core module, you will conduct an analysis using git history and various tools. Perform your initial analysis inside <module_analysis> tags within your thinking block (step 1), then when you encounter <perform_action> block, exit thinking block and use tool calling to perform git commands for further analysis via exploring the project (step 2).

<module_analysis>
1. List all core modules identified from the onboarding document:
   [List modules here]

</module_analysis>

Then use git commands to perform next steps:
<perform_action>
2. For each core module:
   a. Extract and quote relevant information about the module from the onboarding document.

   b. Git History Analysis:
      Command: git --no-pager log --pretty=format:"Commit: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n%n------------------------------------------------------------" --date=iso -n 10  -- [path-to-module]
      [Record the output here]
      [Identify and note patterns or themes in the commit messages]

   c. Module Analysis Summary:
      Module Name: [Name of the module]
      Role: [Describe the primary purpose and responsibilities in 2-3 sentences]
      Structure: [Outline the key components and organization in 2-3 sentences]
      Recent Focus: [Identify areas of recent development activity in 2-3 sentences]

[Repeat steps a-c for each core module]
</perform_action>

3. Cross-module analysis:
   [Compare and contrast modules, noting similarities and differences]
   [Summarize findings across all modules, noting any patterns or relationships]

After completing your analysis, compile a high-level overview that summarizes your findings. Your final output should be structured as follows:

Core Modules Overview:

1. [Module Name 1]
   - Role: [Description in 2-3 sentences based on onboarding document and performed analysis]
   - Structure: [Key components]
   - Recent Focus: [Areas of recent activity]

2. [Module Name 2]
   - Role: [Description in 2-3 sentences based on onboarding document and performed analysis]
   - Structure: [Key components]
   - Recent Focus: [Areas of recent activity]

[Continue for all identified core modules]

Ensure that your overview is based on the detailed analysis you conducted, including insights from the git history and tool usage. Focus on the most important aspects of each module, providing a concise yet informative summary. Your final output should consist only of the Core Modules Overview and should not duplicate or rehash any of the work you did in the thinking block.$prompt3$,
        $prompt4$You are a skilled software developer tasked with analyzing the core modules of a project. Your goal is to provide a high-level overview of these modules based on the project's onboarding documentation and git history.

First, carefully read the project onboarding document:

<project_onboarding_doc>
{{onboarding.md}} - przekaż referencję do dokumentacji onboardingowej

</project_onboarding_doc>

Based on this document, identify the core modules of the project. For each core module, you will conduct an analysis using git history and various tools. Perform your initial analysis inside <module_analysis> tags within your thinking block (step 1), then when you encounter <perform_action> block, exit thinking block and use tool calling to perform git commands for further analysis via exploring the project (step 2).

<module_analysis>
1. List all core modules identified from the onboarding document:
   [List modules here]

</module_analysis>

Then use git commands to perform next steps:
<perform_action>
2. For each core module:
   a. Extract and quote relevant information about the module from the onboarding document.

   b. Git History Analysis:
      Command: git --no-pager log --pretty=format:"Commit: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n%n------------------------------------------------------------" --date=iso -n 10  -- [path-to-module]
      [Record the output here]
      [Identify and note patterns or themes in the commit messages]

   c. Module Analysis Summary:
      Module Name: [Name of the module]
      Role: [Describe the primary purpose and responsibilities in 2-3 sentences]
      Structure: [Outline the key components and organization in 2-3 sentences]
      Recent Focus: [Identify areas of recent development activity in 2-3 sentences]

[Repeat steps a-c for each core module]
</perform_action>

3. Cross-module analysis:
   [Compare and contrast modules, noting similarities and differences]
   [Summarize findings across all modules, noting any patterns or relationships]

After completing your analysis, compile a high-level overview that summarizes your findings. Your final output should be structured as follows:

Core Modules Overview:

1. [Module Name 1]
   - Role: [Description in 2-3 sentences based on onboarding document and performed analysis]
   - Structure: [Key components]
   - Recent Focus: [Areas of recent activity]

2. [Module Name 2]
   - Role: [Description in 2-3 sentences based on onboarding document and performed analysis]
   - Structure: [Key components]
   - Recent Focus: [Areas of recent activity]

[Continue for all identified core modules]

Ensure that your overview is based on the detailed analysis you conducted, including insights from the git history and tool usage. Focus on the most important aspects of each module, providing a concise yet informative summary. Your final output should consist only of the Core Modules Overview and should not duplicate or rehash any of the work you did in the thinking block.$prompt4$,
        1,
        'published',
        NULL
    );

    -- Prompt 3/7: Key Files Analysis
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
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l1_onboarding_id,
        'Key Files Analysis',
        'Analiza kluczowych plików',
        'Three-phase analysis of most frequently changed files: identification, git history review, and content examination. Reveals recent development focus and architectural insights.',
        'Trójfazowa analiza najczęściej zmienianych plików: identyfikacja, przegląd historii git i analiza zawartości. Ujawnia ostatnie obszary rozwoju i wgląd w architekturę.',
        $prompt5$You are a skilled software developer tasked with analyzing the key files of a project. Your goal is to provide a high-level overview based on the project's top files list, git history, and file system analysis.

First, carefully examine the list of top files and their change history:
<top_files_list>
{{top-files}} - same list of top files from git script that was used to prepare the onboarding document

</top_files_list>

Please complete this analysis in THREE DISTINCT PHASES:

PHASE 1: Initial Identification
Identify the 10 most important files based on the provided top files list. List them by full path and briefly note why each appears significant based on change frequency and contributor involvement.

PHASE 2: Git History Analysis
For each of the 10 key files identified:
1. First, run the git log command to examine the recent commit history:
git --no-pager log --pretty=format:"Commit: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n%n" --date=iso -n 5 -- [file-path]
2. Analyze the commit messages to identify patterns and recent focus areas
3. Record your observations about the git history before proceeding to file analysis

YOU MUST COMPLETE PHASE 2 BEFORE MOVING TO PHASE 3.

PHASE 3: File Content Analysis
After completing the git history analysis for all 10 files, examine the actual content of each file:
1. Use the file_read tool to view the content of each key file
2. For each file, provide:
- File purpose and function (2-3 sentences)
- Content organization and key components (2-3 sentences)
- How the file connects to other parts of the system (1-2 sentences)

Final Deliverable:
After completing all three phases, summarize your findings in a "Key Files Overview" section that includes:
1. The role of each file in the system
2. Recent development focus areas based on git history
3. Key architectural insights about how these files work together

Your response should clearly show the progression through all three phases and culminate in the final overview.$prompt5$,
        $prompt6$You are a skilled software developer tasked with analyzing the key files of a project. Your goal is to provide a high-level overview based on the project's top files list, git history, and file system analysis.

First, carefully examine the list of top files and their change history:
<top_files_list>
{{top-files}} - ta sama lista top plików ze skryptu git którą przekazywaliśmy do przygotowania dokumentu onboardingowego

</top_files_list>

Please complete this analysis in THREE DISTINCT PHASES:

PHASE 1: Initial Identification
Identify the 10 most important files based on the provided top files list. List them by full path and briefly note why each appears significant based on change frequency and contributor involvement.

PHASE 2: Git History Analysis
For each of the 10 key files identified:
1. First, run the git log command to examine the recent commit history:
git --no-pager log --pretty=format:"Commit: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n%n" --date=iso -n 5 -- [file-path]
2. Analyze the commit messages to identify patterns and recent focus areas
3. Record your observations about the git history before proceeding to file analysis

YOU MUST COMPLETE PHASE 2 BEFORE MOVING TO PHASE 3.

PHASE 3: File Content Analysis
After completing the git history analysis for all 10 files, examine the actual content of each file:
1. Use the file_read tool to view the content of each key file
2. For each file, provide:
- File purpose and function (2-3 sentences)
- Content organization and key components (2-3 sentences)
- How the file connects to other parts of the system (1-2 sentences)

Final Deliverable:
After completing all three phases, summarize your findings in a "Key Files Overview" section that includes:
1. The role of each file in the system
2. Recent development focus areas based on git history
3. Key architectural insights about how these files work together

Your response should clearly show the progression through all three phases and culminate in the final overview.$prompt6$,
        2,
        'published',
        NULL
    );

    -- Prompt 4/7: Onboarding Documentation Synthesis
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
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l1_onboarding_id,
        'Onboarding Documentation Synthesis',
        'Synteza dokumentacji onboardingowej',
        'Synthesizes findings from module and file analysis to enhance onboarding documentation. Creates comprehensive guide incorporating all discovered patterns and insights.',
        'Syntetyzuje wyniki z analizy modułów i plików, aby wzbogacić dokumentację onboardingową. Tworzy kompleksowy przewodnik zawierający wszystkie odkryte wzorce i spostrzeżenia.',
        $prompt7$You are a senior developer tasked with enhancing the onboarding documentation for the Excalidraw project. You have completed both module-level and file-level analyses, and now need to synthesize these findings to update the original onboarding document.

Please review:
1. Your module analysis findings
2. Your key files analysis findings
3. The original onboarding document:
<onboarding-document>
{{onboarding-md}} - pass reference to onboarding documentation

</onboarding-document>

Based on your comprehensive analysis, update the following sections of the  document with deeper insights:

1. Core Modules
   - Enhance the description of each module with insights from your analysis
   - Add any missing modules you discovered that weren't in the original document
   - Include relationships between modules that weren't previously documented

2. Key Contributors
   - Update with accurate contributor information from git history
   - Note areas of expertise/focus for major contributors
   - Identify which contributors are most active in which areas

3. Overall Takeaways & Recent Focus
   - Synthesize patterns discovered in git commits across files and modules
   - Highlight the current development priorities based on recent activity
   - Note any shifts in focus compared to what was stated in the original document

4. Potential Complexity/Areas to Note
   - Flag specific files or modules with high change rates that might indicate complexity
   - Identify areas where multiple contributors frequently make changes (potential knowledge sharing needs)
   - Note any discrepancies between documented architecture and actual implementation

5. Questions for the Team
   - Based on your analysis, formulate 3-5 specific questions that would help a new developer understand unclear aspects of the codebase
   - Focus on areas where the documentation doesn't align with observed code patterns

6. Next Steps
   - Provide concrete recommendations for a new developer joining the project
   - Suggest which files/modules should be reviewed first based on your analysis
   - Recommend specific documentation improvements

Create a revised onboarding document that maintains the overall structure of the original, but enhances these sections with your new findings. The document should be comprehensive yet concise, suitable for helping new developers quickly understand the project landscape.

When updating each section, clearly indicate:
- What information was preserved from the original
- What new insights were added based on your analysis
- Any corrections to the original documentation

Don't return new version as a text, but update the existing @onboarding.md file.$prompt7$,
        $prompt8$You are a senior developer tasked with enhancing the onboarding documentation for the Excalidraw project. You have completed both module-level and file-level analyses, and now need to synthesize these findings to update the original onboarding document.

Please review:
1. Your module analysis findings
2. Your key files analysis findings
3. The original onboarding document:
<onboarding-document>
{{onboarding-md}} - przekaż referencję do dokumentacji onboardingowej

</onboarding-document>

Based on your comprehensive analysis, update the following sections of the  document with deeper insights:

1. Core Modules
   - Enhance the description of each module with insights from your analysis
   - Add any missing modules you discovered that weren't in the original document
   - Include relationships between modules that weren't previously documented

2. Key Contributors
   - Update with accurate contributor information from git history
   - Note areas of expertise/focus for major contributors
   - Identify which contributors are most active in which areas

3. Overall Takeaways & Recent Focus
   - Synthesize patterns discovered in git commits across files and modules
   - Highlight the current development priorities based on recent activity
   - Note any shifts in focus compared to what was stated in the original document

4. Potential Complexity/Areas to Note
   - Flag specific files or modules with high change rates that might indicate complexity
   - Identify areas where multiple contributors frequently make changes (potential knowledge sharing needs)
   - Note any discrepancies between documented architecture and actual implementation

5. Questions for the Team
   - Based on your analysis, formulate 3-5 specific questions that would help a new developer understand unclear aspects of the codebase
   - Focus on areas where the documentation doesn't align with observed code patterns

6. Next Steps
   - Provide concrete recommendations for a new developer joining the project
   - Suggest which files/modules should be reviewed first based on your analysis
   - Recommend specific documentation improvements

Create a revised onboarding document that maintains the overall structure of the original, but enhances these sections with your new findings. The document should be comprehensive yet concise, suitable for helping new developers quickly understand the project landscape.

When updating each section, clearly indicate:
- What information was preserved from the original
- What new insights were added based on your analysis
- Any corrections to the original documentation

Don't return new version as a text, but update the existing @onboarding.md file.$prompt8$,
        3,
        'published',
        NULL
    );

    -- Prompt 5/7: Project Analysis Without Git History
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
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l1_onboarding_id,
        'Project Analysis Without Git History',
        'Analiza projektu bez historii git',
        'Alternative onboarding approach for projects with limited or no git history. Uses file system analysis and code structure to understand project organization and patterns.',
        'Alternatywne podejście do onboardingu dla projektów z ograniczoną lub brakiem historii git. Wykorzystuje analizę systemu plików i struktury kodu do zrozumienia organizacji projektu i wzorców.',
        $prompt9$You are an AI assistant tasked with onboarding a new developer to a large project. Your goal is to create a comprehensive onboarding summary by exploring the project repository and analyzing its structure, recent developments, and key areas of focus. This summary should help the new developer quickly understand the project, regardless of the underlying technology stack.

To accomplish this task, you have access to the following tools:
1. file_read: Reads the content of a specified file.
2. file_search: Searches for files matching a given pattern.
3. list_dir: Lists the contents of a specified directory.

Use these tools to explore the project structure, read documentation, and analyze the codebase. Do not assume any information about the project that you haven't explicitly discovered through these tools.

Before creating the final onboarding summary, conduct your exploration inside <exploration> tags within your thinking block. In your exploration:

1. Explore the project structure:
   - Use list_dir to understand the directory structure.
   - Identify key directories (e.g., src, docs, tests).
   - Write down the main directories you've found.

2. Analyze core modules and components:
   - Use file_search and file_read to identify and examine main source code files.
   - Determine the project's primary programming language(s) and frameworks.
   - List each core module/component you've identified, numbering them as you go.
   - Write down key observations about each module/component.

3. Review documentation:
   - Search for and read README files, CONTRIBUTING guidelines, and other documentation.
   - Extract information about project setup, running tests, and development workflows.
   - Quote relevant parts of the documentation you find.

4. Identify recent development focus:
   - Examine recently modified files to infer areas of active development.
   - Use git log to check last 10 commits (modules, files, authors). Remember that you have to pipe the results to the stdout so command is not stuck.
   - List the most recently modified files and their modification dates.

5. Determine key contributors:
   - Look for author information in file headers, documentation and previous git log.
   - Write down the names of contributors you've found and their apparent roles.

6. Identify potential complexity areas:
   - Analyze core logic files, state management, or complex integrations.
   - List areas that seem particularly complex and explain why.

7. Gather development environment setup information:
   - Search for build scripts, configuration files, and setup instructions.
   - Summarize the setup process based on what you've found.

8. Collect helpful resources:
   - Find links to external documentation, issue trackers, and communication channels.
   - List all relevant links you've discovered.

9. Conclusions:
   - Summarize your key findings from the exploration.
   - Note any areas where you couldn't find information.

After your exploration, compile an onboarding summary in markdown format with the following structure:

```markdown
# Project Onboarding: [Project Name]

## Welcome

[Brief welcome message and project description]

## Project Overview & Structure

[Overview of project organization and key components]

## Core Modules

[For each identified core module/component]
### `[Module/Component Name]`

- **Role:** [Description of purpose]
- **Key Files/Areas:** [List of important files or areas]
- **Recent Focus:** [Description of recent work or changes]

## Key Contributors

[List of key contributors and their areas of focus]

## Overall Takeaways & Recent Focus

[List of major themes, recent initiatives, and focus areas]

## Potential Complexity/Areas to Note

[List of complex areas and what to watch out for]

## Questions for the Team

[List of 5-7 questions for the new developer to investigate]

## Next Steps

[List of 3-5 actionable steps for the new developer]

## Development Environment Setup

[Instructions for setting up the development environment]

## Helpful Resources

[List of relevant links and resources]
```

Ensure that all information in the summary is based on your exploration of the project using the provided tools. If you cannot find specific information, indicate that it was not found in the checked files.

Your final output should consist only of the markdown-formatted onboarding summary that you will save in .ai/onboarding.md and should not duplicate or rehash any of the work you did in the exploration section of the thinking block. Finish the work after you created document with a required structure and content.

Begin your response with your exploration.$prompt9$,
        $prompt10$You are an AI assistant tasked with onboarding a new developer to a large project. Your goal is to create a comprehensive onboarding summary by exploring the project repository and analyzing its structure, recent developments, and key areas of focus. This summary should help the new developer quickly understand the project, regardless of the underlying technology stack.

To accomplish this task, you have access to the following tools:
1. file_read: Reads the content of a specified file.
2. file_search: Searches for files matching a given pattern.
3. list_dir: Lists the contents of a specified directory.

Use these tools to explore the project structure, read documentation, and analyze the codebase. Do not assume any information about the project that you haven't explicitly discovered through these tools.

Before creating the final onboarding summary, conduct your exploration inside <exploration> tags within your thinking block. In your exploration:

1. Explore the project structure:
   - Use list_dir to understand the directory structure.
   - Identify key directories (e.g., src, docs, tests).
   - Write down the main directories you've found.

2. Analyze core modules and components:
   - Use file_search and file_read to identify and examine main source code files.
   - Determine the project's primary programming language(s) and frameworks.
   - List each core module/component you've identified, numbering them as you go.
   - Write down key observations about each module/component.

3. Review documentation:
   - Search for and read README files, CONTRIBUTING guidelines, and other documentation.
   - Extract information about project setup, running tests, and development workflows.
   - Quote relevant parts of the documentation you find.

4. Identify recent development focus:
   - Examine recently modified files to infer areas of active development.
   - Use git log to check last 10 commits (modules, files, authors). Remember that you have to pipe the results to the stdout so command is not stuck.
   - List the most recently modified files and their modification dates.

5. Determine key contributors:
   - Look for author information in file headers, documentation and previous git log.
   - Write down the names of contributors you've found and their apparent roles.

6. Identify potential complexity areas:
   - Analyze core logic files, state management, or complex integrations.
   - List areas that seem particularly complex and explain why.

7. Gather development environment setup information:
   - Search for build scripts, configuration files, and setup instructions.
   - Summarize the setup process based on what you've found.

8. Collect helpful resources:
   - Find links to external documentation, issue trackers, and communication channels.
   - List all relevant links you've discovered.

9. Conclusions:
   - Summarize your key findings from the exploration.
   - Note any areas where you couldn't find information.

After your exploration, compile an onboarding summary in markdown format with the following structure:

```markdown
# Project Onboarding: [Project Name]

## Welcome

[Brief welcome message and project description]

## Project Overview & Structure

[Overview of project organization and key components]

## Core Modules

[For each identified core module/component]
### `[Module/Component Name]`

- **Role:** [Description of purpose]
- **Key Files/Areas:** [List of important files or areas]
- **Recent Focus:** [Description of recent work or changes]

## Key Contributors

[List of key contributors and their areas of focus]

## Overall Takeaways & Recent Focus

[List of major themes, recent initiatives, and focus areas]

## Potential Complexity/Areas to Note

[List of complex areas and what to watch out for]

## Questions for the Team

[List of 5-7 questions for the new developer to investigate]

## Next Steps

[List of 3-5 actionable steps for the new developer]

## Development Environment Setup

[Instructions for setting up the development environment]

## Helpful Resources

[List of relevant links and resources]
```

Ensure that all information in the summary is based on your exploration of the project using the provided tools. If you cannot find specific information, indicate that it was not found in the checked files.

Your final output should consist only of the markdown-formatted onboarding summary that you will save in .ai/onboarding.md and should not duplicate or rehash any of the work you did in the exploration section of the thinking block. Finish the work after you created document with a required structure and content.

Begin your response with your exploration.$prompt10$,
        4,
        'published',
        NULL
    );

    -- Prompt 6/7: Issue Resolution Action Plan
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
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l2_analysis_id,
        'Issue Resolution Action Plan',
        'Plan działania do rozwiązania problemu',
        'Creates comprehensive action plan for debugging and resolving issues in legacy code. Analyzes relevant codebase parts, git history, and hypothesizes root causes with clear next steps.',
        'Tworzy kompleksowy plan działania do debugowania i rozwiązywania problemów w legacy code. Analizuje odpowiednie części kodu, historię git i stawia hipotezy o źródłach problemów z jasnymi kolejnymi krokami.',
        $prompt11$You are an experienced software developer tasked with creating an action plan to address an issue. Your goal is to produce a comprehensive, step-by-step plan that will guide the resolution of this issue.

First, review the following information:

1. Project Onboarding Document:
<project_onboarding_doc>
 {{onboarding.md}}

</project_onboarding_doc>

2. Issue Description:
<issue_description>
{{issue-description}} - issue description, preferably paste the text instead of inserting a link here

</issue_description>

Your task is to create an action plan document in Markdown format. Follow these steps, working inside <action_plan_development> tags in your thinking block. If you see <perform_action>, go outside of thinking block, perform a given action via tool call.

<action_plan_development>
1. Identify Relevant Codebase Parts:
   Based on the issue description and project onboarding document, determine which parts of the codebase are most likely connected to this issue. List and number specific parts of the codebase mentioned in both documents. Explain your reasoning for each.
</action_plan_development>

<perform_action>
2. Analyze Git Commit History:
   For the relevant modules/files identified, analyze the git commit history. Use the following git command to do this:
   ```
   git --no-pager log --pretty=format:"Commit: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n%n" --date=iso -n 10 -- [file-path]
   ```
</perform-action>


<action_plan_development>
3. Hypothesize Root Cause:
   Based on the information gathered, list potential causes for the issue. Then, choose the most likely cause and explain your reasoning.

4. Identify Potential Contacts:
   List names or roles mentioned in the documents that might be helpful to contact for assistance with this issue. For each contact, explain why they would be valuable to consult.

5. Self-Reflection Questions:
   Generate a list of questions that should be asked to further investigate and understand the issue. Include both self-reflective questions and questions for others. Number each question as you write it.

6. Next Steps:
   Outline the next steps for addressing this issue, including specific actions for logging and debugging. Provide a clear, actionable plan. Number each step and provide a brief rationale for why it's necessary.
</action_plan_development>

After completing your analysis, create a Markdown document with the following structure:

```markdown
# Action Plan for [Issue Name]

## Issue Description
[Briefly summarize the issue]

## Relevant Codebase Parts
[List and briefly describe the relevant parts of the codebase]

## Git Commit History Analysis
[Summarize key findings from the git commit history]

## Root Cause Hypothesis
[State and explain your hypothesis]

## Potential Contacts
[List individuals or teams to contact, with brief explanations]

## Investigation Questions
[List self-reflection questions and questions for others]

## Next Steps
[Provide a numbered list of actionable steps, including logging and debugging tasks]

## Additional Notes
[Any other relevant information or considerations]
```

Ensure that your action plan is comprehensive, follows a step-by-step approach, and is presented in an easy-to-read Markdown format. The final document should be named .ai/{issue-name}-action-plan.md.

Your final output should consist only of the Markdown document and should not duplicate or rehash any of the work you did in the action_plan_development thinking block.$prompt11$,
        $prompt12$You are an experienced software developer tasked with creating an action plan to address an issue. Your goal is to produce a comprehensive, step-by-step plan that will guide the resolution of this issue.

First, review the following information:

1. Project Onboarding Document:
<project_onboarding_doc>
 {{onboarding.md}}

</project_onboarding_doc>

2. Issue Description:
<issue_description>
{{issue-description}} - opis issues, najlepiej wkleić tekst zamiast wstawiać tutaj link

</issue_description>

Your task is to create an action plan document in Markdown format. Follow these steps, working inside <action_plan_development> tags in your thinking block. If you see <perform_action>, go outside of thinking block, perform a given action via tool call.

<action_plan_development>
1. Identify Relevant Codebase Parts:
   Based on the issue description and project onboarding document, determine which parts of the codebase are most likely connected to this issue. List and number specific parts of the codebase mentioned in both documents. Explain your reasoning for each.
</action_plan_development>

<perform_action>
2. Analyze Git Commit History:
   For the relevant modules/files identified, analyze the git commit history. Use the following git command to do this:
   ```
   git --no-pager log --pretty=format:"Commit: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n%n" --date=iso -n 10 -- [file-path]
   ```
</perform-action>


<action_plan_development>
3. Hypothesize Root Cause:
   Based on the information gathered, list potential causes for the issue. Then, choose the most likely cause and explain your reasoning.

4. Identify Potential Contacts:
   List names or roles mentioned in the documents that might be helpful to contact for assistance with this issue. For each contact, explain why they would be valuable to consult.

5. Self-Reflection Questions:
   Generate a list of questions that should be asked to further investigate and understand the issue. Include both self-reflective questions and questions for others. Number each question as you write it.

6. Next Steps:
   Outline the next steps for addressing this issue, including specific actions for logging and debugging. Provide a clear, actionable plan. Number each step and provide a brief rationale for why it's necessary.
</action_plan_development>

After completing your analysis, create a Markdown document with the following structure:

```markdown
# Action Plan for [Issue Name]

## Issue Description
[Briefly summarize the issue]

## Relevant Codebase Parts
[List and briefly describe the relevant parts of the codebase]

## Git Commit History Analysis
[Summarize key findings from the git commit history]

## Root Cause Hypothesis
[State and explain your hypothesis]

## Potential Contacts
[List individuals or teams to contact, with brief explanations]

## Investigation Questions
[List self-reflection questions and questions for others]

## Next Steps
[Provide a numbered list of actionable steps, including logging and debugging tasks]

## Additional Notes
[Any other relevant information or considerations]
```

Ensure that your action plan is comprehensive, follows a step-by-step approach, and is presented in an easy-to-read Markdown format. The final document should be named .ai/{issue-name}-action-plan.md.

Your final output should consist only of the Markdown document and should not duplicate or rehash any of the work you did in the action_plan_development thinking block.$prompt12$,
        0,
        'published',
        NULL
    );

    -- Prompt 7/7: Strategic Logging Implementation
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
        sort_order,
        status,
        created_by
    ) VALUES (
        v_org_id,
        v_collection_id,
        v_segment_l2_analysis_id,
        'Strategic Logging Implementation',
        'Strategiczna implementacja logowania',
        'Adds strategic logging to key files for debugging legacy code issues. Helps identify bug sources and understand execution flow in unfamiliar codebases.',
        'Dodaje strategiczne logowanie do kluczowych plików w celu debugowania problemów w legacy code. Pomaga zidentyfikować źródła błędów i zrozumieć przepływ wykonania w nieznanych bazach kodu.',
        $prompt13$You are a skilled developer tasked with debugging an issue related to bug in a codebase. Your goal is to add strategic logging to understand which parts of the code are responsible for the bug. You will be working with the following information:

1. An action plan for debugging:
<action-plan>
{{action-plan}} - reference to action plan file

</action-plan>

2. Investigation questions to guide your analysis:
<investigation-questions>
{{investigation-questions}} - pasted list of questions from action plan that can be answered using logs/analysis

</investigation-questions>

3. A list of files that need to be analyzed and modified:
<suggested-files>
{{suggested-files}} - references to files suspected to be related to the bug

</suggested-files>

For each file in the suggested-files list, follow these steps inside your thinking block:

1. Analyze the code using the action plan and investigation questions.
2. Extract and list key functions and variables related to the bug.
3. Summarize existing logging or debugging code in the file.
4. Brainstorm potential causes of the issue based on the file content.
5. Plan 5-10 key logs that will help understand the codebase behavior.
6. Consider if more logs are needed.

After finishing analysis within thinking block, start performing actions on the first file in the suggested-files list. Process one file at a time and wait for user confirmation before moving to the next file.

Important guidelines:
- Process one file at a time.
- Focus on adding logs that best address the investigation questions.
- Avoid refactoring the code unless absolutely necessary. If you must refactor, clearly mark the changed variable with a comment and explain why it was necessary.
- For JS code, add JSON.stringify when logging objects to ensure their content is visible in the console and easy to copy into this conversation.

Remember to prioritize logs that directly address the investigation questions and provide insights into the issue. Avoid unnecessary code changes or refactoring.

Focus on adding logs to the suggested file, adding explanations why these logs are valuable. You should not duplicate or rehash any of the work you did in the thinking block.$prompt13$,
        $prompt14$You are a skilled developer tasked with debugging an issue related to bug in a codebase. Your goal is to add strategic logging to understand which parts of the code are responsible for the bug. You will be working with the following information:

1. An action plan for debugging:
<action-plan>
{{action-plan}} - referencja do pliku z action planem

</action-plan>

2. Investigation questions to guide your analysis:
<investigation-questions>
{{investigation-questions}} - przeklejona lista pytań z action planu, na które możemy odpowiedzieć dzięki logom/analizie

</investigation-questions>

3. A list of files that need to be analyzed and modified:
<suggested-files>
{{suggested-files}} - referencje do plików, które podejrzewamy o związek z błędem

</suggested-files>

For each file in the suggested-files list, follow these steps inside your thinking block:

1. Analyze the code using the action plan and investigation questions.
2. Extract and list key functions and variables related to the bug.
3. Summarize existing logging or debugging code in the file.
4. Brainstorm potential causes of the issue based on the file content.
5. Plan 5-10 key logs that will help understand the codebase behavior.
6. Consider if more logs are needed.

After finishing analysis within thinking block, start performing actions on the first file in the suggested-files list. Process one file at a time and wait for user confirmation before moving to the next file.

Important guidelines:
- Process one file at a time.
- Focus on adding logs that best address the investigation questions.
- Avoid refactoring the code unless absolutely necessary. If you must refactor, clearly mark the changed variable with a comment and explain why it was necessary.
- For JS code, add JSON.stringify when logging objects to ensure their content is visible in the console and easy to copy into this conversation.

Remember to prioritize logs that directly address the investigation questions and provide insights into the issue. Avoid unnecessary code changes or refactoring.

Focus on adding logs to the suggested file, adding explantions why these logs are valuable. You should not duplicate or rehash any of the work you did in the thinking block.$prompt14$,
        1,
        'published',
        NULL
    );

    RAISE NOTICE 'Successfully seeded % prompts for M4', 7;
END $$;

-- =====================================================
-- Seed completed successfully
-- =====================================================