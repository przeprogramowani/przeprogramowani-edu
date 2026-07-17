#!/usr/bin/env python3
"""Compare and synchronize shared skill files between Claude Code and Codex."""

from __future__ import annotations

import argparse
import filecmp
import hashlib
import shutil
import sys
from pathlib import Path


RUNTIME_DIRS = {
    "claude": Path(".claude/skills"),
    "codex": Path(".agents/skills"),
}

RUNTIME_ONLY_TOP_LEVEL = {"agents"}
IGNORED_NAMES = {".DS_Store", "__pycache__"}


def find_workbench_root(start: Path) -> Path:
    current = start.resolve()
    for candidate in [current, *current.parents]:
        if (candidate / ".claude/skills").is_dir() or (candidate / ".agents/skills").is_dir():
            return candidate
    raise SystemExit("Could not find a workbench root containing .claude/skills or .agents/skills.")


def is_shared_file(path: Path, skill_root: Path) -> bool:
    relative = path.relative_to(skill_root)
    if any(part in IGNORED_NAMES for part in relative.parts):
        return False
    if relative.parts and relative.parts[0] in RUNTIME_ONLY_TOP_LEVEL:
        return False
    if any(part.startswith(".") for part in relative.parts):
        return False
    return path.is_file()


def shared_files(skill_root: Path) -> dict[Path, Path]:
    if not skill_root.is_dir():
        return {}
    return {
        path.relative_to(skill_root): path
        for path in skill_root.rglob("*")
        if is_shared_file(path, skill_root)
    }


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def compare(source_root: Path, target_root: Path) -> tuple[list[Path], list[Path], list[Path]]:
    source_files = shared_files(source_root)
    target_files = shared_files(target_root)
    source_only = sorted(path for path in source_files if path not in target_files)
    target_only = sorted(path for path in target_files if path not in source_files)
    changed = sorted(
        path
        for path in source_files.keys() & target_files.keys()
        if digest(source_files[path]) != digest(target_files[path])
    )
    return source_only, target_only, changed


def copy_shared(source_root: Path, target_root: Path) -> list[Path]:
    copied: list[Path] = []
    for relative, source_path in sorted(shared_files(source_root).items()):
        target_path = target_root / relative
        target_path.parent.mkdir(parents=True, exist_ok=True)
        if target_path.exists() and filecmp.cmp(source_path, target_path, shallow=False):
            continue
        shutil.copy2(source_path, target_path)
        copied.append(relative)
    return copied


def runtime_root(workbench: Path, runtime: str, skill: str) -> Path:
    return workbench / RUNTIME_DIRS[runtime] / skill


def format_paths(paths: list[Path]) -> str:
    if not paths:
        return "  (none)"
    return "\n".join(f"  - {path.as_posix()}" for path in paths)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skill", required=True, help="Skill directory name to compare or sync.")
    parser.add_argument(
        "--from",
        dest="source_runtime",
        choices=("claude", "codex"),
        help="Source runtime for a sync operation.",
    )
    parser.add_argument("--write", action="store_true", help="Apply the sync. Without this flag, report only.")
    parser.add_argument("--root", help="Workbench root. Defaults to auto-detection from cwd.")
    args = parser.parse_args()

    workbench = Path(args.root).resolve() if args.root else find_workbench_root(Path.cwd())
    claude_root = runtime_root(workbench, "claude", args.skill)
    codex_root = runtime_root(workbench, "codex", args.skill)

    print(f"Workbench: {workbench}")
    print(f"Skill: {args.skill}")
    print(f"Claude: {claude_root} ({'present' if claude_root.is_dir() else 'missing'})")
    print(f"Codex:  {codex_root} ({'present' if codex_root.is_dir() else 'missing'})")

    if args.source_runtime:
        source_runtime = args.source_runtime
        target_runtime = "codex" if source_runtime == "claude" else "claude"
    else:
        source_runtime = "claude"
        target_runtime = "codex"

    source_root = runtime_root(workbench, source_runtime, args.skill)
    target_root = runtime_root(workbench, target_runtime, args.skill)
    source_only, target_only, changed = compare(source_root, target_root)

    print(f"\nCompared shared payload: {source_runtime} -> {target_runtime}")
    print("\nOnly in source:")
    print(format_paths(source_only))
    print("\nOnly in target:")
    print(format_paths(target_only))
    print("\nChanged:")
    print(format_paths(changed))

    if not args.source_runtime:
        print("\nMode: report only. Pass --from claude or --from codex with --write to sync.")
        return 0

    if not source_root.is_dir():
        print(f"\nCannot sync: source skill directory is missing: {source_root}", file=sys.stderr)
        return 2

    if not args.write:
        print(f"\nDry run: would copy shared files from {source_runtime} to {target_runtime}.")
        print("Pass --write to apply.")
        return 0

    target_root.mkdir(parents=True, exist_ok=True)
    copied = copy_shared(source_root, target_root)
    print(f"\nSynced {source_runtime} -> {target_runtime}.")
    print("\nCopied or updated:")
    print(format_paths(copied))
    print("\nRuntime-specific files such as agents/openai.yaml were preserved.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
