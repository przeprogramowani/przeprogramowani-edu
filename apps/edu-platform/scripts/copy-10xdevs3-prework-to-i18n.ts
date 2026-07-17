#!/usr/bin/env tsx

import { cp, lstat, mkdir, readdir } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');

const sourceDir = join(projectRoot, 'src/content/lessons10xDevs3Prework/pl');

function findAncestor(startPath: string, ancestorName: string): string | null {
  let currentPath = resolve(startPath);

  while (true) {
    if (basename(currentPath) === ancestorName) {
      return currentPath;
    }

    const parentPath = dirname(currentPath);

    if (parentPath === currentPath) {
      return null;
    }

    currentPath = parentPath;
  }
}

async function countFiles(dirPath: string): Promise<number> {
  const entries = await readdir(dirPath, { withFileTypes: true });
  let fileCount = 0;

  for (const entry of entries) {
    const entryPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      fileCount += await countFiles(entryPath);
      continue;
    }

    if (entry.isFile()) {
      fileCount += 1;
    }
  }

  return fileCount;
}

async function assertDirectory(path: string, label: string): Promise<void> {
  const stats = await lstat(path).catch(() => null);

  if (!stats?.isDirectory()) {
    throw new Error(`${label} does not exist or is not a directory: ${path}`);
  }
}

async function main(): Promise<void> {
  const przeprogramowaniSitesRoot = findAncestor(projectRoot, 'przeprogramowani-sites');

  if (!przeprogramowaniSitesRoot) {
    throw new Error(`Could not find przeprogramowani-sites ancestor from ${projectRoot}`);
  }

  const sharedParentDir = dirname(przeprogramowaniSitesRoot);
  const coursesI18nRoot = join(sharedParentDir, 'courses-i18n');
  const targetDir = join(coursesI18nRoot, 'courses/10xdevs-3ed-prework/pl');

  await assertDirectory(sourceDir, 'Source directory');
  await assertDirectory(coursesI18nRoot, 'courses-i18n repository');
  await mkdir(dirname(targetDir), { recursive: true });

  const copiedFilesCount = await countFiles(sourceDir);

  await cp(sourceDir, targetDir, {
    recursive: true,
    force: true,
    errorOnExist: false,
  });

  console.log(`Copied ${copiedFilesCount} files.`);
  console.log(`Source: ${relative(projectRoot, sourceDir)}`);
  console.log(`Target: ${targetDir}`);
}

main().catch((error) => {
  console.error('Failed to copy 10xDevs 3 prework lessons to courses-i18n:', (error as Error).message);
  process.exit(1);
});
