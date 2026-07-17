---
name: skill-sync
description: Compare and synchronize matching Claude Code and Codex skill directories in this workbench. Use this skill when a user asks to port, mirror, reconcile, sync, propagate, or two-way synchronize improvements between .claude/skills/<skill-name> and .agents/skills/<skill-name>, especially after one agent version of a skill has been edited and the other runtime should receive the same shared workflow changes without losing runtime-specific metadata.
---

# Skill Sync

You synchronize agent skills between Claude Code and Codex in the workbench.

The core rule: **compare first, copy only the intended direction, preserve runtime-specific files, and never let a convenience sync erase local improvements silently**.

## Skill Roots

- Claude Code skills: `.claude/skills/<skill-name>/`
- Codex skills: `.agents/skills/<skill-name>/`

Codex skills may include `agents/openai.yaml`. Treat that as Codex-specific UI metadata. Do not copy it into Claude skills and do not delete it when syncing from Claude to Codex.

## When To Use

Use this skill when the user asks to:

- sync a skill changed in Claude Code into Codex,
- sync a skill changed in Codex into Claude Code,
- compare the two versions before deciding,
- port a new skill into the other runtime,
- reconcile drift after both versions changed.

Do not use it for normal lesson drafting, grounding, editing, or RC review.

## Workflow

1. Identify the target skill name. If absent, ask which skill to sync.
2. Inspect both directories when they exist.
3. Run the report command:

```bash
python3 .agents/skills/skill-sync/scripts/sync_skills.py --skill <skill-name>
```

If running from the Claude copy of this skill, this equivalent path is also valid:

```bash
python3 .claude/skills/skill-sync/scripts/sync_skills.py --skill <skill-name>
```

4. Summarize whether the skill is missing on either side, identical in shared files, or divergent.
5. If exactly one side has the intended improvement, sync in that direction with `--write`:

```bash
python3 .agents/skills/skill-sync/scripts/sync_skills.py --skill <skill-name> --from codex --write
python3 .agents/skills/skill-sync/scripts/sync_skills.py --skill <skill-name> --from claude --write
```

6. Re-run the report command and summarize remaining differences.
7. If both sides changed in different ways, do not overwrite. Read the differing files, merge manually, then copy the merged version to the other side.

## Direction Rules

- `--from codex` means `.agents/skills/<skill-name>` is the source and `.claude/skills/<skill-name>` is updated.
- `--from claude` means `.claude/skills/<skill-name>` is the source and `.agents/skills/<skill-name>` is updated.
- Without `--write`, the script reports what would happen and does not edit files.
- Existing target files that are not part of the source shared payload are preserved. This protects Codex `agents/openai.yaml` and other runtime-local metadata.

## Shared Payload

Shared files are copied between runtimes:

- `SKILL.md`
- `scripts/**`
- `references/**`
- `assets/**`
- other non-hidden files used by the skill

Runtime-specific files are not part of shared payload:

- `agents/**`
- hidden/system files such as `.DS_Store`

If a runtime-specific file needs to change, edit it directly in that runtime's skill directory.

## Safety Rules

- Never use destructive git commands or delete an entire skill directory as part of sync.
- Do not overwrite divergent changes until the user confirms the direction or approves a manual merge.
- Keep generated skill instructions in English unless the skill explicitly owns Polish learner-facing prose.
- After syncing, run a lightweight validation: frontmatter has `name` and `description`, and Codex `agents/openai.yaml` parses as YAML when present.

## Reporting

End with:

```text
Synced:
- [skill name]

Direction:
- [codex -> claude / claude -> codex / manual merge / report only]

Changed shared files:
- [...]

Preserved runtime-specific files:
- [...]

Remaining differences:
- [...]
```
