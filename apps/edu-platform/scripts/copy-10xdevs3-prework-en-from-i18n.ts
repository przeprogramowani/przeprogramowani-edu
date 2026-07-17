#!/usr/bin/env tsx

import { execFile } from 'node:child_process';
import { cp, lstat, mkdir, readdir, rm } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const targetDir = join(projectRoot, 'src/content/lessons10xDevs3/en');

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

async function assertDirectory(path: string, label: string): Promise<void> {
  const stats = await lstat(path).catch(() => null);

  if (!stats?.isDirectory()) {
    throw new Error(`${label} does not exist or is not a directory: ${path}`);
  }
}

async function listHtmlFiles(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath, { withFileTypes: true }).catch((error) => {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }

    throw error;
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => join(dirPath, entry.name));
}

async function pullCoursesI18n(coursesI18nRoot: string): Promise<void> {
  console.log(`Pulling latest courses-i18n changes in ${coursesI18nRoot}...`);

  const { stdout, stderr } = await execFileAsync('git', ['pull', '--ff-only'], {
    cwd: coursesI18nRoot,
  });

  if (stdout.trim()) {
    console.log(stdout.trim());
  }

  if (stderr.trim()) {
    console.error(stderr.trim());
  }
}

async function main(): Promise<void> {
  const przeprogramowaniSitesRoot = findAncestor(projectRoot, 'przeprogramowani-sites');

  if (!przeprogramowaniSitesRoot) {
    throw new Error(`Could not find przeprogramowani-sites ancestor from ${projectRoot}`);
  }

  const sharedParentDir = dirname(przeprogramowaniSitesRoot);
  const coursesI18nRoot = join(sharedParentDir, 'courses-i18n');

  await assertDirectory(coursesI18nRoot, 'courses-i18n repository');
  await pullCoursesI18n(coursesI18nRoot);

  const sourceDir = join(coursesI18nRoot, 'courses/10xdevs-3ed/en');

  await assertDirectory(sourceDir, 'Source directory');
  await mkdir(targetDir, { recursive: true });

  const sourceHtmlFiles = await listHtmlFiles(sourceDir);

  if (sourceHtmlFiles.length === 0) {
    throw new Error(`No HTML files found in source directory: ${sourceDir}`);
  }

  const existingTargetHtmlFiles = await listHtmlFiles(targetDir);

  for (const filePath of existingTargetHtmlFiles) {
    await rm(filePath);
  }

  for (const filePath of sourceHtmlFiles) {
    await cp(filePath, join(targetDir, basename(filePath)));
  }

  console.log(`Copied ${sourceHtmlFiles.length} HTML files.`);
  console.log(`Source: ${sourceDir}`);
  console.log(`Target: ${relative(projectRoot, targetDir)}`);
}

main().catch((error) => {
  console.error('Failed to copy English 10xDevs 3 prework lessons from courses-i18n:', (error as Error).message);
  process.exit(1);
});
