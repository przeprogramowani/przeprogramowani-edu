---
title: "Wstępna analiza projektu"
description: ""
collection: m4-legacy
segment: l1-onboarding
sort-order: 0
status: published
---

You are an AI assistant tasked with onboarding a new developer to a big project. Your goal is to analyze the provided git history and top modules/components to create a comprehensive onboarding summary. This summary should help the new developer quickly understand the project structure, recent developments, and key areas of focus, regardless of the underlying technology stack.

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

Begin your response with your exploration.



---
title: "1. Prompt do analizy modułów"
description: "Po wygenerowaniu podstawowego dokumentu onboardingowego możemy zastosować serię wyspecjalizowanych promptów, które pomogą nam dokładniej zrozumieć strukturę projektu i najważniejsze elementy kodu.  Pr"
collection: m4-legacy
segment: l1-onboarding
sort-order: 1
status: published
---

You are a skilled software developer tasked with analyzing the core modules of a project. Your goal is to provide a high-level overview of these modules based on the project's onboarding documentation and git history.

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

Ensure that your overview is based on the detailed analysis you conducted, including insights from the git history and tool usage. Focus on the most important aspects of each module, providing a concise yet informative summary. Your final output should consist only of the Core Modules Overview and should not duplicate or rehash any of the work you did in the thinking block.



---
title: "2. Prompt do analizy kluczowych plików"
description: ""
collection: m4-legacy
segment: l1-onboarding
sort-order: 2
status: published
---

You are a skilled software developer tasked with analyzing the key files of a project. Your goal is to provide a high-level overview based on the project's top files list, git history, and file system analysis.

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

Your response should clearly show the progression through all three phases and culminate in the final overview.



---
title: "3. Prompt do syntezy i aktualizacji dokumentu onboardingowego"
description: ""
collection: m4-legacy
segment: l1-onboarding
sort-order: 3
status: published
---

You are a senior developer tasked with enhancing the onboarding documentation for the Excalidraw project. You have completed both module-level and file-level analyses, and now need to synthesize these findings to update the original onboarding document.

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

Don't return new version as a text, but update the existing @onboarding.md file.



---
title: "Prompt do analizy projektów bez rozbudowanej historii git"
description: ""
collection: m4-legacy
segment: l1-onboarding
sort-order: 4
status: published
---

You are an AI assistant tasked with onboarding a new developer to a large project. Your goal is to create a comprehensive onboarding summary by exploring the project repository and analyzing its structure, recent developments, and key areas of focus. This summary should help the new developer quickly understand the project, regardless of the underlying technology stack.

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

Begin your response with your exploration.