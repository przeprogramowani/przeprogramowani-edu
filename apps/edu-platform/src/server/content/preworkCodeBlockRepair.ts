import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import '../../utils/nodeWebCompat';
import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

export type PreworkPreBlockType = 'code' | 'mermaid' | 'other-pre';

export interface PreworkPreBlock {
  lessonPrefix: string;
  ordinal: number;
  type: PreworkPreBlockType;
  text: string;
  lineCount: number;
  className?: string;
  codeClassName?: string;
  language?: string;
}

export type PreworkCodeBlockIssueKind =
  | 'suspicious-code'
  | 'suspicious-mermaid'
  | 'missing';

export interface PreworkCodeBlockIssue {
  kind: PreworkCodeBlockIssueKind;
  lessonPrefix: string;
  ordinal: number;
  plBlock: PreworkPreBlock;
  enBlock?: PreworkPreBlock;
}

export interface PreworkLessonHtmlPair {
  lessonPrefix: string;
  plPath: string;
  enPath: string;
}

export interface PreworkCodeBlockRepairTargets {
  plDir: string;
  enDir: string;
  rootDir?: string;
}

export interface PreworkCodeBlockLessonReport {
  lessonPrefix: string;
  plPath: string;
  enPath: string;
  plBlockCount: number;
  enBlockCount: number;
  issues: PreworkCodeBlockIssue[];
}

export interface PreworkCodeBlockRepairReport {
  pairs: PreworkLessonHtmlPair[];
  lessons: PreworkCodeBlockLessonReport[];
  issues: PreworkCodeBlockIssue[];
}

export type PreworkBlockCacheStatus =
  | 'translated'
  | 'restored-polish-mermaid'
  | 'manual-translation-required'
  | 'validation-failed';

export interface PreworkBlockCacheEntry {
  key: string;
  blockHash: string;
  promptVersion: string;
  model: string;
  blockType: PreworkPreBlockType;
  ordinal: number;
  sourceLanguage: 'pl';
  targetLanguage: 'en';
  sourceText: string;
  translatedText: string;
  status: PreworkBlockCacheStatus;
  createdAt: string;
  validationErrors?: string[];
}

export interface PreworkLessonBlockCache {
  lessonPrefix: string;
  updatedAt: string;
  entries: PreworkBlockCacheEntry[];
}

export interface PreworkCodeBlockValidationResult {
  ok: boolean;
  diagnostics: string[];
}

export interface PreworkPreBlockRepair {
  ordinal: number;
  type: Extract<PreworkPreBlockType, 'code' | 'mermaid'>;
  text: string;
}

function getLessonPrefix(filePath: string): string {
  return path.basename(filePath).replace(/\.html$/i, '').split('_')[0];
}

async function listHtmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir);
  return entries
    .filter((entry) => entry.endsWith('.html'))
    .map((entry) => path.join(dir, entry));
}

function buildLessonFileMap(files: string[], languageLabel: string): Map<string, string> {
  const fileMap = new Map<string, string>();

  for (const filePath of files) {
    const lessonPrefix = getLessonPrefix(filePath);
    const existing = fileMap.get(lessonPrefix);

    if (existing) {
      throw new Error(
        `Multiple ${languageLabel} prework HTML files with prefix ${lessonPrefix}: ${existing}, ${filePath}`
      );
    }

    fileMap.set(lessonPrefix, filePath);
  }

  return fileMap;
}

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, '\n');
}

function getSha256(source: string): string {
  return createHash('sha256').update(source).digest('hex');
}

function normalizeBlockTextForHash(text: string): string {
  return normalizeLineEndings(text).trim();
}

function countLines(text: string): number {
  const trimmed = normalizeLineEndings(text).trim();
  return trimmed ? trimmed.split('\n').length : 0;
}

function getLanguageFromClassName(className: string | undefined): string | undefined {
  if (!className) {
    return undefined;
  }

  return className
    .split(/\s+/)
    .map((classPart) => /^language-(.+)$/i.exec(classPart)?.[1])
    .find((language): language is string => Boolean(language));
}

function getLanguage($pre: cheerio.Cheerio<Element>, $code: cheerio.Cheerio<Element>): string | undefined {
  const dataLanguage = $pre.attr('data-language') ?? $code.attr('data-language');

  return dataLanguage ?? getLanguageFromClassName($code.attr('class')) ?? getLanguageFromClassName($pre.attr('class'));
}

function hasClass(className: string | undefined, expectedClass: string): boolean {
  return Boolean(
    className
      ?.split(/\s+/)
      .some((classPart) => classPart.toLowerCase() === expectedClass.toLowerCase())
  );
}

function getBlockType($pre: cheerio.Cheerio<Element>, $code: cheerio.Cheerio<Element>): PreworkPreBlockType {
  const preClassName = $pre.attr('class');
  const preDataLanguage = $pre.attr('data-language');

  if (hasClass(preClassName, 'mermaid') || preDataLanguage?.toLowerCase() === 'mermaid') {
    return 'mermaid';
  }

  if ($code.length > 0) {
    return 'code';
  }

  return 'other-pre';
}

function shouldReportMatchedBlock(plBlock: PreworkPreBlock, enBlock: PreworkPreBlock): boolean {
  return plBlock.lineCount > 1 && enBlock.lineCount <= 1;
}

export async function pairPreworkLessonHtmlFiles(plDir: string, enDir: string): Promise<PreworkLessonHtmlPair[]> {
  const [plFiles, enFiles] = await Promise.all([listHtmlFiles(plDir), listHtmlFiles(enDir)]);
  const plFileMap = buildLessonFileMap(plFiles, 'Polish');
  const enFileMap = buildLessonFileMap(enFiles, 'English');
  const pairs: PreworkLessonHtmlPair[] = [];

  for (const [lessonPrefix, plPath] of plFileMap) {
    const enPath = enFileMap.get(lessonPrefix);

    if (!enPath) {
      throw new Error(`Missing English prework HTML file with prefix ${lessonPrefix}: ${enDir}`);
    }

    pairs.push({
      lessonPrefix,
      plPath,
      enPath,
    });
  }

  return pairs.sort((a, b) => a.lessonPrefix.localeCompare(b.lessonPrefix, undefined, { numeric: true }));
}

export function createBlockHash(block: Pick<PreworkPreBlock, 'text'>): string {
  return getSha256(normalizeBlockTextForHash(block.text));
}

export function createBlockCacheKey(
  block: Pick<PreworkPreBlock, 'lessonPrefix' | 'ordinal' | 'type' | 'text'>,
  model: string,
  promptVersion: string
): string {
  return getSha256(
    JSON.stringify({
      blockHash: createBlockHash(block),
      blockType: block.type,
      lessonPrefix: block.lessonPrefix,
      model,
      ordinal: block.ordinal,
      promptVersion,
    })
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateCacheEntry(value: unknown): PreworkBlockCacheEntry {
  if (!isRecord(value)) {
    throw new Error('Malformed cache entry: expected object');
  }

  const requiredStrings = [
    'key',
    'blockHash',
    'promptVersion',
    'model',
    'blockType',
    'sourceLanguage',
    'targetLanguage',
    'sourceText',
    'translatedText',
    'status',
    'createdAt',
  ] as const;

  for (const field of requiredStrings) {
    if (typeof value[field] !== 'string') {
      throw new Error(`Malformed cache entry: missing string field ${field}`);
    }
  }

  if (typeof value.ordinal !== 'number' || !Number.isFinite(value.ordinal)) {
    throw new Error('Malformed cache entry: missing numeric field ordinal');
  }

  return value as unknown as PreworkBlockCacheEntry;
}

function parseLessonBlockCache(raw: string, cachePath: string): PreworkLessonBlockCache {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Malformed cache JSON: ${cachePath}: ${(error as Error).message}`);
  }

  if (!isRecord(parsed)) {
    throw new Error(`Malformed cache JSON: ${cachePath}: expected object`);
  }

  if (typeof parsed.lessonPrefix !== 'string') {
    throw new Error(`Malformed cache JSON: ${cachePath}: missing lessonPrefix`);
  }

  if (typeof parsed.updatedAt !== 'string') {
    throw new Error(`Malformed cache JSON: ${cachePath}: missing updatedAt`);
  }

  if (!Array.isArray(parsed.entries)) {
    throw new Error(`Malformed cache JSON: ${cachePath}: missing entries`);
  }

  return {
    lessonPrefix: parsed.lessonPrefix,
    updatedAt: parsed.updatedAt,
    entries: parsed.entries.map(validateCacheEntry),
  };
}

export async function readLessonBlockCache(
  cacheDir: string,
  lessonPrefix: string
): Promise<PreworkLessonBlockCache> {
  const cachePath = path.join(cacheDir, `${lessonPrefix}.cache.json`);

  try {
    const raw = await readFile(cachePath, 'utf-8');
    return parseLessonBlockCache(raw, cachePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {
        lessonPrefix,
        updatedAt: new Date(0).toISOString(),
        entries: [],
      };
    }

    throw error;
  }
}

export async function writeLessonBlockCache(
  cacheDir: string,
  cache: PreworkLessonBlockCache
): Promise<void> {
  await mkdir(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, `${cache.lessonPrefix}.cache.json`);
  const stableCache: PreworkLessonBlockCache = {
    ...cache,
    entries: [...cache.entries].sort((a, b) => a.ordinal - b.ordinal || a.key.localeCompare(b.key)),
  };

  await writeFile(cachePath, `${JSON.stringify(stableCache, null, 2)}\n`, 'utf-8');
}

export function findCachedTranslation(
  cache: PreworkLessonBlockCache,
  key: string
): PreworkBlockCacheEntry | null {
  return cache.entries.find((entry) => entry.key === key) ?? null;
}

export function upsertCacheEntry(
  cache: PreworkLessonBlockCache,
  entry: PreworkBlockCacheEntry
): PreworkLessonBlockCache {
  const existingIndex = cache.entries.findIndex((existingEntry) => existingEntry.key === entry.key);
  const entries = [...cache.entries];

  if (existingIndex === -1) {
    entries.push(entry);
  } else {
    entries[existingIndex] = entry;
  }

  return {
    ...cache,
    updatedAt: entry.createdAt,
    entries,
  };
}

export function extractPreBlocks(html: string, lessonPrefix: string): PreworkPreBlock[] {
  const $ = cheerio.load(html, null, false);
  const blocks: PreworkPreBlock[] = [];

  $('pre').each((ordinal, element) => {
    const $pre = $(element);
    const $code = $pre.children('code').first();
    const text = normalizeLineEndings(($code.length > 0 ? $code : $pre).text());
    const className = $pre.attr('class') ?? $code.attr('class');
    const codeClassName = $code.attr('class');
    const language = getLanguage($pre, $code);

    blocks.push({
      lessonPrefix,
      ordinal,
      type: getBlockType($pre, $code),
      text,
      lineCount: countLines(text),
      ...(className ? { className } : {}),
      ...(codeClassName ? { codeClassName } : {}),
      ...(language ? { language } : {}),
    });
  });

  return blocks;
}

export function comparePreBlocks(
  plBlocks: PreworkPreBlock[],
  enBlocks: PreworkPreBlock[]
): PreworkCodeBlockIssue[] {
  const issues: PreworkCodeBlockIssue[] = [];

  for (const plBlock of plBlocks) {
    const enBlock = enBlocks[plBlock.ordinal];

    if (!enBlock) {
      issues.push({
        kind: 'missing',
        lessonPrefix: plBlock.lessonPrefix,
        ordinal: plBlock.ordinal,
        plBlock,
      });
      continue;
    }

    if (!shouldReportMatchedBlock(plBlock, enBlock)) {
      continue;
    }

    if (plBlock.type === 'mermaid') {
      issues.push({
        kind: 'suspicious-mermaid',
        lessonPrefix: plBlock.lessonPrefix,
        ordinal: plBlock.ordinal,
        plBlock,
        enBlock,
      });
      continue;
    }

    if (plBlock.type === 'code') {
      issues.push({
        kind: 'suspicious-code',
        lessonPrefix: plBlock.lessonPrefix,
        ordinal: plBlock.ordinal,
        plBlock,
        enBlock,
      });
    }
  }

  return issues;
}

function getTrimmedLines(text: string): string[] {
  const trimmed = normalizeLineEndings(text).trim();
  return trimmed ? trimmed.split('\n') : [];
}

function isJsonLikeBlock(block: PreworkPreBlock): boolean {
  const trimmed = block.text.trim();
  return block.language === 'json' || (trimmed.startsWith('{') && trimmed.endsWith('}'));
}

function countOccurrences(text: string, character: string): number {
  return [...text].filter((currentCharacter) => currentCharacter === character).length;
}

function hasShellLineContinuationLoss(sourceText: string, translatedText: string): boolean {
  const sourceContinuations = getTrimmedLines(sourceText).filter((line) => line.endsWith('\\')).length;

  if (sourceContinuations === 0) {
    return false;
  }

  const translatedContinuations = getTrimmedLines(translatedText).filter((line) => line.endsWith('\\')).length;
  return translatedContinuations < sourceContinuations;
}

const POLISH_DIACRITIC_PATTERN = /[ąćęłńóśźż]/i;
const POLISH_WORD_PATTERN =
  /\b(?:błąd|błędu|czy|dla|dodaj|działa|jak|jaka|jakie|jest|karty|który|która|które|moduł|może|nie|obiektu|pole|popraw|pobrać|pobierz|przycisk|tytuł|uruchom|usuń|właściwość|zachowaj|zwróć)\b/i;
const ENGLISH_WORD_PATTERN =
  /\b(?:add|button|card|current|does|error|exist|field|fix|for|from|get|item|module|not|object|preserve|price|property|refactor|return|run|tests|title|type)\b/i;

function hasPolishLanguageMarkers(text: string): boolean {
  return POLISH_DIACRITIC_PATTERN.test(text) || POLISH_WORD_PATTERN.test(text);
}

function hasEnglishLanguageMarkers(text: string): boolean {
  return ENGLISH_WORD_PATTERN.test(text);
}

function hasEnglishToPolishDirectionFlip(sourceText: string, translatedText: string): boolean {
  return (
    hasEnglishLanguageMarkers(sourceText) &&
    !hasPolishLanguageMarkers(sourceText) &&
    hasPolishLanguageMarkers(translatedText)
  );
}

export function validateTranslatedCodeBlock(
  sourceBlock: PreworkPreBlock,
  translatedText: string
): PreworkCodeBlockValidationResult {
  const diagnostics: string[] = [];
  const normalizedTranslatedText = normalizeLineEndings(translatedText);
  const trimmedTranslatedText = normalizedTranslatedText.trim();
  const sourceLines = getTrimmedLines(sourceBlock.text);
  const translatedLines = getTrimmedLines(normalizedTranslatedText);

  if (!trimmedTranslatedText) {
    diagnostics.push('Translated code block is empty.');
  }

  if (/^```[\s\S]*```$/m.test(trimmedTranslatedText)) {
    diagnostics.push('Translated code block is wrapped in Markdown fences.');
  }

  if (
    sourceLines.length > 1 &&
    translatedLines.length === 1 &&
    translatedLines[0].trim() === sourceLines[0].trim()
  ) {
    diagnostics.push('Translated code block appears to contain only the first source line.');
  }

  if (isJsonLikeBlock(sourceBlock)) {
    const sourceOpenBraces = countOccurrences(sourceBlock.text, '{');
    const sourceCloseBraces = countOccurrences(sourceBlock.text, '}');
    const translatedOpenBraces = countOccurrences(normalizedTranslatedText, '{');
    const translatedCloseBraces = countOccurrences(normalizedTranslatedText, '}');

    if (
      translatedOpenBraces < sourceOpenBraces ||
      translatedCloseBraces < sourceCloseBraces ||
      translatedOpenBraces !== translatedCloseBraces
    ) {
      diagnostics.push('Translated JSON-like block appears to have lost braces.');
    }
  }

  if (hasShellLineContinuationLoss(sourceBlock.text, normalizedTranslatedText)) {
    diagnostics.push('Translated shell-like block appears to have lost line continuations.');
  }

  if (hasEnglishToPolishDirectionFlip(sourceBlock.text, normalizedTranslatedText)) {
    diagnostics.push('Translated code block appears to translate English source text into Polish.');
  }

  return {
    ok: diagnostics.length === 0,
    diagnostics,
  };
}

function getFirstNonEmptyLine(text: string): string | null {
  return getTrimmedLines(text).find((line) => line.trim().length > 0) ?? null;
}

function getMermaidDirective(text: string): string | null {
  const firstLine = getFirstNonEmptyLine(text);

  if (!firstLine) {
    return null;
  }

  return firstLine.trim().split(/\s+/).slice(0, 2).join(' ');
}

export function validateTranslatedMermaidBlock(
  sourceBlock: PreworkPreBlock,
  translatedText: string
): PreworkCodeBlockValidationResult {
  const diagnostics: string[] = [];
  const normalizedTranslatedText = normalizeLineEndings(translatedText);
  const trimmedTranslatedText = normalizedTranslatedText.trim();
  const sourceDirective = getMermaidDirective(sourceBlock.text);
  const translatedDirective = getMermaidDirective(normalizedTranslatedText);

  if (!trimmedTranslatedText) {
    diagnostics.push('Translated Mermaid block is empty.');
  }

  if (/^```[\s\S]*```$/m.test(trimmedTranslatedText)) {
    diagnostics.push('Translated Mermaid block is wrapped in Markdown fences.');
  }

  if (sourceBlock.lineCount > 1 && countLines(normalizedTranslatedText) <= 1) {
    diagnostics.push('Translated Mermaid block appears to be truncated.');
  }

  if (sourceDirective && translatedDirective && sourceDirective !== translatedDirective) {
    diagnostics.push('Translated Mermaid block changed the diagram directive.');
  }

  return {
    ok: diagnostics.length === 0,
    diagnostics,
  };
}

export function applyPreBlockRepairsToEnglishHtml(
  html: string,
  repairs: PreworkPreBlockRepair[]
): string {
  if (repairs.length === 0) {
    return html;
  }

  const $ = cheerio.load(html, { decodeEntities: false } as unknown as cheerio.CheerioOptions, false);
  const repairsByOrdinal = new Map(repairs.map((repair) => [repair.ordinal, repair]));

  $('pre').each((ordinal, element) => {
    const repair = repairsByOrdinal.get(ordinal);

    if (!repair) {
      return;
    }

    const $pre = $(element);

    if (repair.type === 'code') {
      const $code = $pre.children('code').first();

      if ($code.length === 0) {
        return;
      }

      $code.text(repair.text);
      return;
    }

    $pre.text(repair.text);
  });

  return $.html();
}

export function createDefaultPreworkCodeBlockRepairTargets(
  rootDir = process.cwd()
): PreworkCodeBlockRepairTargets {
  return {
    plDir: path.join(rootDir, 'src/content/lessons10xDevs3Prework/pl'),
    enDir: path.join(rootDir, 'src/content/lessons10xDevs3Prework/en'),
    rootDir,
  };
}

export async function findPreworkCodeBlockIssues(
  targets: PreworkCodeBlockRepairTargets
): Promise<PreworkCodeBlockRepairReport> {
  const pairs = await pairPreworkLessonHtmlFiles(targets.plDir, targets.enDir);
  const lessons: PreworkCodeBlockLessonReport[] = [];

  for (const pair of pairs) {
    const [plHtml, enHtml] = await Promise.all([
      readFile(pair.plPath, 'utf-8'),
      readFile(pair.enPath, 'utf-8'),
    ]);
    const plBlocks = extractPreBlocks(plHtml, pair.lessonPrefix);
    const enBlocks = extractPreBlocks(enHtml, pair.lessonPrefix);
    const issues = comparePreBlocks(plBlocks, enBlocks);

    lessons.push({
      ...pair,
      plBlockCount: plBlocks.length,
      enBlockCount: enBlocks.length,
      issues,
    });
  }

  return {
    pairs,
    lessons,
    issues: lessons.flatMap((lesson) => lesson.issues),
  };
}

export const __testUtils = {
  countLines,
  getLessonPrefix,
  normalizeBlockTextForHash,
};
