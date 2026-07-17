import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as readline from 'readline';
import {
  updateLessonContent,
  TEN_X_DEVS_THIRD_ED,
  TEN_X_DEVS_THIRD_ED_EN,
  getTokenForPlatform,
  type CourseConfig,
} from '@edu/circle';

type SupportedLanguage = 'pl' | 'en';

function parseLanguage(args: string[]): SupportedLanguage {
  const idx = args.indexOf('--lang');
  if (idx === -1 || idx + 1 >= args.length) return 'pl';
  const lang = args[idx + 1];
  if (lang !== 'pl' && lang !== 'en') {
    console.error(`❌ Unsupported language: ${lang}. Use "pl" or "en".`);
    process.exit(1);
  }
  return lang;
}

function getContentDir(lang: SupportedLanguage): string {
  return path.join(process.cwd(), `content/lessons10xDevs3/${lang}`);
}

function getLessonMapPath(lang: SupportedLanguage): string {
  const filename = lang === 'en' ? 'lesson-map-en.json' : 'lesson-map.json';
  return path.join(process.cwd(), `content/lessons10xDevs3/${filename}`);
}

function getCourseConfig(lang: SupportedLanguage): CourseConfig {
  return lang === 'en' ? TEN_X_DEVS_THIRD_ED_EN : TEN_X_DEVS_THIRD_ED;
}

interface LessonMapEntry {
  sectionId: number;
  circleLessonId: number;
}

interface ParsedLesson {
  fileName: string;
  lessonId: number;
  sectionId: number;
  name: string;
  html: string;
  contentHash: string;
}

const MIN_CONTENT_BYTES = 50;

function isContentEmpty(html: string): boolean {
  return html.replace(/<[^>]*>/g, '').trim().length < MIN_CONTENT_BYTES;
}

function hashContent(html: string): string {
  return crypto.createHash('sha256').update(html).digest('hex').slice(0, 16);
}

function getCachePath(contentDir: string): string {
  return path.join(contentDir, '.push-cache.json');
}

function loadCache(contentDir: string): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(getCachePath(contentDir), 'utf-8'));
  } catch {
    return {};
  }
}

function saveCache(contentDir: string, cache: Record<string, string>): void {
  fs.writeFileSync(getCachePath(contentDir), JSON.stringify(cache, null, 2) + '\n', 'utf-8');
}

function loadLessonMap(lessonMapPath: string): Record<string, LessonMapEntry> {
  return JSON.parse(fs.readFileSync(lessonMapPath, 'utf-8'));
}

function loadLessons(contentDir: string, lessonMapPath: string): ParsedLesson[] {
  const lessonMap = loadLessonMap(lessonMapPath);
  const htmlFiles = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.html'))
    .sort();

  return htmlFiles.map((fileName) => {
    const stem = fileName.replace(/\.html$/, '');
    const mapping = lessonMap[stem];
    if (!mapping) {
      throw new Error(`No lesson-map entry for "${stem}". Add it to ${lessonMapPath}`);
    }
    const filePath = path.join(contentDir, fileName);
    const html = fs.readFileSync(filePath, 'utf-8');
    const contentHash = hashContent(html);
    return {
      fileName,
      lessonId: mapping.circleLessonId,
      sectionId: mapping.sectionId,
      name: stem,
      html,
      contentHash,
    };
  });
}

function ask(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise<string>((resolve) => rl.question(prompt, resolve));
}

async function selectViaInteractivePicker(rl: readline.Interface, changed: ParsedLesson[]): Promise<ParsedLesson[]> {
  console.log(`\n📋 Select lessons to push:\n`);
  for (let i = 0; i < changed.length; i++) {
    console.log(`  [${i + 1}] ${changed[i].fileName}`);
  }
  console.log();

  const answer = await ask(rl, `Which lessons to push? (e.g. 1,3 / all / none): `);
  const trimmed = answer.trim().toLowerCase();

  if (trimmed === 'none' || trimmed === '') return [];
  if (trimmed === 'all') return changed;

  const indices = trimmed.split(',').map((s) => parseInt(s.trim(), 10));
  const invalid = indices.filter((n) => isNaN(n) || n < 1 || n > changed.length);
  if (invalid.length > 0) {
    console.error(`❌ Invalid selection: ${invalid.join(', ')}. Must be 1-${changed.length}.`);
    return [];
  }

  return indices.map((i) => changed[i - 1]);
}

async function selectViaPerLessonConfirm(rl: readline.Interface, changed: ParsedLesson[]): Promise<ParsedLesson[]> {
  console.log(`\n📋 Confirm each lesson individually:\n`);
  const selected: ParsedLesson[] = [];

  for (const lesson of changed) {
    const answer = await ask(rl, `  Push ${lesson.fileName}? (y/n/a=all remaining/q=quit): `);
    const trimmed = answer.trim().toLowerCase();

    if (trimmed === 'q') break;
    if (trimmed === 'a') {
      selected.push(lesson, ...changed.slice(changed.indexOf(lesson) + 1));
      break;
    }
    if (trimmed === 'y') selected.push(lesson);
  }

  return selected;
}

async function pushCourse(
  lang: SupportedLanguage,
  dryRun: boolean,
  force: boolean,
  interactive: boolean,
  lessonFilter?: string,
) {
  const contentDir = getContentDir(lang);
  const lessonMapPath = getLessonMapPath(lang);
  const courseConfig = getCourseConfig(lang);

  console.log(`\n📂 Loading lessons from: ${contentDir}`);

  if (!fs.existsSync(contentDir)) {
    console.error(`❌ Content directory not found: ${contentDir}`);
    console.error('   Run "npm run circle:prepare" first to generate Circle-ready HTML.');
    process.exit(1);
  }

  let lessons = loadLessons(contentDir, lessonMapPath);

  if (lessonFilter) {
    lessons = lessons.filter((l) => l.fileName.includes(lessonFilter));
    if (lessons.length === 0) {
      console.error(`❌ No lesson matching "${lessonFilter}" found`);
      process.exit(1);
    }
  }

  if (lessons.length === 0) {
    console.error('❌ No .html files found in content directory');
    process.exit(1);
  }

  const cache = force ? {} : loadCache(contentDir);
  const changed = lessons.filter((l) => cache[l.fileName] !== l.contentHash);
  const skipped = lessons.length - changed.length;

  console.log(`\n🎯 Push plan for: lessons10xDevs3 (${lang})`);
  console.log(`📍 Platform: ${courseConfig.platform}`);
  console.log(`🌐 Language: ${lang}`);
  console.log(`🔄 Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}${force ? ' (--force)' : ''}${interactive ? ' (--interactive)' : ''}`);
  console.log(`📚 Lessons: ${changed.length} changed, ${skipped} unchanged`);
  console.log('---');

  const emptyLessons: string[] = [];
  for (const lesson of lessons) {
    const unchanged = cache[lesson.fileName] === lesson.contentHash;
    const empty = isContentEmpty(lesson.html);
    if (empty) emptyLessons.push(lesson.fileName);
    const status = unchanged ? '⏭️  skip' : empty ? '🚫 EMPTY' : '📤 push';
    console.log(`  ${status}  ${lesson.fileName} -> section=${lesson.sectionId}, lesson=${lesson.lessonId} (${lesson.name})`);
  }

  if (emptyLessons.length > 0) {
    console.log(`\n🚫 ${emptyLessons.length} lesson(s) have empty or near-empty content (<${MIN_CONTENT_BYTES} chars of text):`);
    for (const name of emptyLessons) console.log(`   - ${name}`);
  }

  const pushable = changed.filter((l) => !isContentEmpty(l.html));

  if (pushable.length === 0 && emptyLessons.length > 0) {
    console.log('\n❌ All changed lessons are empty — aborting to prevent overwriting Circle content.');
    process.exit(1);
  }

  if (changed.length === 0) {
    console.log('\n✅ Nothing to push — all lessons match cache.');
    return;
  }

  if (dryRun) {
    console.log('\n✅ Dry run complete. No changes pushed.');
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const selected = interactive
    ? await selectViaInteractivePicker(rl, pushable)
    : await selectViaPerLessonConfirm(rl, pushable);

  rl.close();

  if (selected.length === 0) {
    console.log('\nAborted — no lessons selected.');
    return;
  }

  const token = getTokenForPlatform(courseConfig.platform);
  let successCount = 0;
  const newCache = { ...cache };

  for (const lesson of selected) {
    try {
      process.stdout.write(`  Pushing ${lesson.fileName}...`);
      await updateLessonContent(token, lesson.sectionId, lesson.lessonId, lesson.html);
      console.log(' ✅');
      newCache[lesson.fileName] = lesson.contentHash;
      successCount++;
    } catch (error) {
      console.log(' ❌');
      console.error(`    Error:`, error instanceof Error ? error.message : error);
    }
  }

  saveCache(contentDir, newCache);
  console.log(
    `\n🎉 Push complete: ${successCount}/${selected.length} updated, ${skipped} unchanged, ${emptyLessons.length} blocked (empty).`,
  );
}

function parseLessonFilter(args: string[]): string | undefined {
  const idx = args.indexOf('--lesson');
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const force = args.includes('--force') || args.includes('-f');
  const interactive = args.includes('--interactive') || args.includes('-i');
  const lang = parseLanguage(args);
  const lessonFilter = parseLessonFilter(args);

  if (lessonFilter) {
    console.log(`\n🎯 Targeting lesson: ${lessonFilter} (force-push)`);
  }
  await pushCourse(lang, dryRun, lessonFilter ? true : force, interactive, lessonFilter);
}

main().catch((error) => {
  console.error('❌ Error during push:', error);
  process.exit(1);
});
