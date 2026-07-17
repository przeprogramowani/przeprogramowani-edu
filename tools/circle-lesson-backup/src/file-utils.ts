import * as fs from 'fs';
import * as path from 'path';
import type { CourseConfig } from '@edu/circle';

export function createBackupDirectory(courseConfig: CourseConfig, baseName: string = 'backup-v2'): string {
  const backupDir = path.join(process.cwd(), 'backup', courseConfig.directory_name);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

export function generateFileName(lessonName: string, index: number, extension: string = 'md'): string {
  const indPadded = index.toString().padStart(2, '0');
  const normLessonName = lessonName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_');
  return `${indPadded}-${normLessonName}.${extension}`;
}