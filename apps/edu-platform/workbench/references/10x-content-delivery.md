# 10x Content Delivery: Toolkit → CLI

This reference describes how AI skills reach learners in the 10xDevs 3.0 course. Use it when drafting, grounding, or reviewing any lesson that mentions skills, the CLI, toolkit installation, or artifact delivery.

## Two-Tool Architecture

| Tool | Package | Audience | Repo |
|------|---------|----------|------|
| **10x-toolkit** | `@przeprogramowani/10x-toolkit` | Authors (private) | `/Users/admin/code/10x-toolkit/` |
| **10x-cli** | `@przeprogramowani/10x-cli` | Learners (public, open-source) | `/Users/admin/code/10x-cli/` |

The toolkit is the authoring + publishing backoffice. The CLI is what learners install and run daily to get lesson packs.

**Learner-facing lessons must reference `10x-cli` commands, not `10x-toolkit` internal commands.**

## Learner Commands (10x-cli)

The canonical invocation is `npx @przeprogramowani/10x-cli@latest <command>`. The `@latest` tag ensures learners always run the newest version without manual updates — critical during rapid iteration in the first course days.

```bash
# Authenticate (magic-link via course email)
npx @przeprogramowani/10x-cli@latest auth

# Browse available modules and lessons
npx @przeprogramowani/10x-cli@latest list
npx @przeprogramowani/10x-cli@latest list m1

# Fetch and apply a lesson pack
npx @przeprogramowani/10x-cli@latest get m1l1

# Fetch for a specific AI tool
npx @przeprogramowani/10x-cli@latest get m1l1 --tool cursor
npx @przeprogramowani/10x-cli@latest get m1l1 --tool claude-code
npx @przeprogramowani/10x-cli@latest get m1l1 --tool copilot
npx @przeprogramowani/10x-cli@latest get m1l1 --tool codex

# Fetch only specific artifact types
npx @przeprogramowani/10x-cli@latest get m1l1 --type skills
npx @przeprogramowani/10x-cli@latest get m1l1 --type prompts
npx @przeprogramowani/10x-cli@latest get m1l1 --type rules

# Preview without writing files
npx @przeprogramowani/10x-cli@latest get m1l1 --dry-run

# Diagnose environment
npx @przeprogramowani/10x-cli@latest doctor
```

Supported `--tool` values: `claude-code` (default), `cursor`, `copilot`, `codex`, `generic`.

> **Note:** Global install (`npm install -g @przeprogramowani/10x-cli`) also works but risks running a stale version. Learner-facing lessons should use the npx @latest form.

## What a Lesson Pack Delivers

When a learner runs `10x get <ref>`, the CLI writes artifacts to tool-specific paths:

| Artifact type | Claude Code path | Cursor path | Copilot path |
|---------------|-----------------|-------------|--------------|
| Skills | `.claude/skills/<name>/` | `.cursor/skills/<name>/` | `.github/skills/<name>/` |
| Prompts | `.claude/prompts/` | `.cursor/prompts/` | `.github/prompts/` |
| Rules | `CLAUDE.md` (sentinel block) | `.cursor/rules/10x-course.mdc` | `.github/copilot-instructions.md` |
| Configs | `.claude/config-templates/` | `.cursor/config-templates/` | `.github/config-templates/` |

Skills are the primary delivery unit. Each skill is a `SKILL.md` file with YAML frontmatter (`name` + `description`) and a markdown body that instructs the AI agent.

## Content Pipeline (Author → Learner)

```
1. Author writes skill
   → 10x-toolkit/packages/ai-artifacts/skills/<name>/SKILL.md

2. Author wires skill into a lesson definition
   → 10x-toolkit/packages/course-content/src/courses/10xdevs3/module-NN/lesson-NN.ts
   → artifacts.root.skills: ["10x-shape", "10x-prd", ...]

3. Build embeds full skill content into lesson bundle JSON
   → pnpm --filter @przeprogramowani/course-content build:lessons
   → dist/10xdevs3/lessons/m1l1.json

4. CI uploads bundles to R2 bucket (10x-toolkit-content)

5. API (Cloudflare Worker) serves gated bundles
   → https://10x-toolkit-api.przeprogramowani.workers.dev/api/lessons/10xdevs3/m1l1
   → Requires JWT, respects module unlock dates

6. Learner's CLI fetches and applies
   → 10x get m1l1
```

## Where To Find Canonical Skill Sources

For grounding and fact-checking skill behavior:

```
/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/<name>/SKILL.md
```

For the lesson wiring (which skills belong to which lesson):

```
/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/
```

For the full list of available skills:

```bash
ls /Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/
```

## Key Distinctions For Lesson Prose

| When writing about... | Use this | Not this |
|-----------------------|----------|----------|
| Learner getting skills | `npx @przeprogramowani/10x-cli@latest get m1l1` | `npx @przeprogramowani/10x-toolkit install` |
| Learner authenticating | `npx @przeprogramowani/10x-cli@latest auth` | (no toolkit equivalent) |
| Learner checking available content | `npx @przeprogramowani/10x-cli@latest list` | (no toolkit equivalent) |
| Where skills land (Claude Code) | `.claude/skills/<name>/` | (same for both channels) |
| First-time setup in a lesson | `npx @przeprogramowani/10x-cli@latest auth` → `get <ref>` | `npm install -g` + `10x auth` |
| Skill invocation by learner | `/10x-shape` (slash command in AI tool) | same |

The internal toolkit (`npx @przeprogramowani/10x-toolkit install`) is an author/dogfooding path. Learners never see it.

## Module Gating

Lessons unlock on a schedule. The API returns 403 with unlock date if a module is still locked. The CLI shows the unlock date to the learner. Do not promise learners they can access a future lesson before its module opens.

## Idempotency

Re-running `10x get <ref>` is safe. The CLI tracks applied artifacts in `.claude/.10x-cli-manifest.json` and handles:
- unchanged files (skipped),
- updated files (overwritten),
- removed artifacts (cleaned up),
- rules blocks (managed via sentinel markers in CLAUDE.md).

## CLI Utility Skills (Agent-Facing)

The CLI ships two internal utility skills in its npm package (`/skills/` directory):

| Skill | Purpose |
|-------|---------|
| `10x-cli-setup` | Guides agents through first-time installation and authentication |
| `10x-cli-guide` | Guides agents through daily CLI usage: commands, tool-switching, troubleshooting |

These are **not** course content skills. They help AI agents (Claude Code, Cursor, Copilot) assist learners with CLI setup and usage.

**Delivery**: via the [skills.sh](https://skills.sh) registry, not via `10x get`:

```bash
# Install CLI utility skills into current project
npx skills add przeprogramowani/10x-cli

# Install globally (all projects)
npx skills add przeprogramowani/10x-cli -g

# Install for a specific agent
npx skills add przeprogramowani/10x-cli -a claude-code
```

**Two distinct skill ecosystems:**

| Type | Source | Delivery | Purpose |
|------|--------|----------|---------|
| Course skills | 10x API (per lesson) | `npx @przeprogramowani/10x-cli@latest get m1l1` | Teaching content |
| CLI utility skills | npm package `/skills/` | `npx skills add przeprogramowani/10x-cli` | Agent-assisted CLI setup and usage |

Learner-facing lessons reference course skills only. CLI utility skills are infrastructure — they help agents help learners, but learners don't invoke them directly.

## When To Consult This Reference

- **lesson-spec**: When defining `requiredFragments` that mention CLI setup or skill delivery.
- **lesson-grounding**: When looking up canonical skill sources in `10x-toolkit/packages/ai-artifacts/skills/`.
- **lesson-draft**: When writing installation instructions, skill usage examples, or onboarding sections.
- **lesson-rc-review**: When verifying that the draft uses correct learner-facing commands (not author commands).
- **lesson-editor-pl**: When polishing CLI references or skill invocation examples.
