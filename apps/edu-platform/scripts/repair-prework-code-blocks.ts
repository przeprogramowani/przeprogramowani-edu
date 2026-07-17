#!/usr/bin/env tsx

import '../src/utils/nodeWebCompat.js';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as cheerio from 'cheerio';
import {
  applyPreBlockRepairsToEnglishHtml,
  createBlockCacheKey,
  createBlockHash,
  createDefaultPreworkCodeBlockRepairTargets,
  findCachedTranslation,
  findPreworkCodeBlockIssues,
  readLessonBlockCache,
  upsertCacheEntry,
  validateTranslatedCodeBlock,
  validateTranslatedMermaidBlock,
  writeLessonBlockCache,
  type PreworkBlockCacheEntry,
  type PreworkCodeBlockIssue,
  type PreworkCodeBlockIssueKind,
  type PreworkCodeBlockLessonReport,
  type PreworkPreBlock,
  type PreworkPreBlockRepair,
} from '../src/server/content/preworkCodeBlockRepair.js';

export const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.5-flash';
export const PREWORK_CODE_BLOCK_PROMPT_VERSION = 'prework-code-block-v2';
export const PREWORK_MERMAID_BLOCK_PROMPT_VERSION = 'prework-mermaid-block-v1';

const ROOT_DIR = process.cwd();
const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_CACHE_DIR = path.join(ROOT_DIR, 'scripts/prework-code-translations/cache');

type RepairMode = 'report' | 'dry-run' | 'write';

interface CliOptions {
  mode: RepairMode;
  lesson: string | null;
  model: string;
  force: boolean;
  json: boolean;
  translateMermaid: boolean;
}

type RepairActionStatus =
  | 'cached'
  | 'translated'
  | 'restored-polish-mermaid'
  | 'manual-translation-required'
  | 'missing'
  | 'needs-api'
  | 'validation-failed';

interface MissingBlockDetails {
  plPath: string;
  enPath: string;
  enPreBlockCount: number;
  plBlockType: string;
  language?: string;
  lineCount: number;
  plBlockPreview: string[];
  plContextBefore?: string;
  plContextAfter?: string;
}

interface RepairAction {
  lessonPrefix: string;
  ordinal: number;
  kind: PreworkCodeBlockIssueKind;
  status: RepairActionStatus;
  message?: string;
  details?: MissingBlockDetails;
}

interface RepairCliResult {
  mode: RepairMode;
  model: string;
  issueCount: number;
  repairedCount: number;
  restoredMermaidCount: number;
  missingCount: number;
  cacheHitCount: number;
  cacheMissCount: number;
  apiRequestCount: number;
  actions: RepairAction[];
  affectedLessons: Array<{
    lessonPrefix: string;
    issues: Record<PreworkCodeBlockIssueKind, number>;
  }>;
}

export type FetchLike = (
  input: string,
  init: {
    method: 'POST';
    headers: Record<string, string>;
    body: string;
  }
) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  json: () => Promise<unknown>;
}>;

export interface OpenRouterCodeBlockTranslationRequest {
  apiKey: string;
  block: Pick<PreworkPreBlock, 'text' | 'language'>;
  model?: string;
  fetchImpl?: FetchLike;
}

export interface OpenRouterMermaidTranslationRequest {
  apiKey: string;
  block: Pick<PreworkPreBlock, 'text'>;
  model?: string;
  fetchImpl?: FetchLike;
}

export async function loadEnvFiles(rootDir = ROOT_DIR): Promise<void> {
  const envFiles = ['.env.local', '.env', '.dev.vars'];

  for (const envFile of envFiles) {
    const envPath = path.join(rootDir, envFile);

    try {
      const raw = await readFile(envPath, 'utf8');
      const lines = raw.split(/\r?\n/);

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) {
          continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();

        if (!key || process.env[key] !== undefined) {
          continue;
        }

        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        process.env[key] = value;
      }
    } catch {
      continue;
    }
  }
}

export function getOpenRouterApiKeyForWriteMode(needsApiCall: boolean): string | null {
  if (!needsApiCall) {
    return null;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for write mode when a cache miss needs an API call');
  }

  return apiKey;
}

export function buildCodeBlockTranslationPrompt(
  block: Pick<PreworkPreBlock, 'text' | 'language'>
): string {
  const languageLine = block.language ? `Language hint: ${block.language}` : 'Language hint: unknown';

  return [
    'Translate natural-language text inside this code or prompt block from Polish to English.',
    'Target language: English.',
    languageLine,
    '',
    'Rules:',
    '- Translate only text that is clearly Polish.',
    '- If text is already English, leave it unchanged.',
    '- Never translate English text into Polish.',
    '- For mixed-language blocks, translate Polish fragments to English and keep English fragments as English.',
    '- Translate comments, string literals, visible HTML text, and prompt prose only when they are Polish.',
    '- Preserve all code syntax, placeholders, indentation, shell line continuations, JSON structure, and variable names.',
    '- Preserve technical identifiers, API names, class names, file paths, commands, and placeholders exactly.',
    '- Return only the translated block text.',
    '- Do not wrap the result in Markdown fences.',
    '',
    'Block:',
    block.text,
  ].join('\n');
}

export function buildMermaidTranslationPrompt(block: Pick<PreworkPreBlock, 'text'>): string {
  return [
    'Translate Polish human-readable labels inside this Mermaid diagram to English.',
    '',
    'Rules:',
    '- Preserve valid Mermaid syntax exactly.',
    '- Preserve diagram type and direction declarations such as "flowchart LR", "graph TD", or "sequenceDiagram".',
    '- Preserve node IDs, participant IDs, edge syntax, arrows, indentation, comments, and line order.',
    '- Translate only labels and natural-language text shown to the learner.',
    '- Do not translate Mermaid keywords such as participant, as, subgraph, end, classDef, style, click, note, loop, alt, opt, par, and rect.',
    '- Return only the Mermaid source.',
    '- Do not wrap the result in Markdown fences.',
    '',
    'Mermaid source:',
    block.text,
  ].join('\n');
}

async function requestOpenRouterTextCompletion({
  apiKey,
  fetchImpl,
  model,
  prompt,
}: {
  apiKey: string;
  fetchImpl: FetchLike;
  model: string;
  prompt: string;
}): Promise<string> {
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for OpenRouter translation requests');
  }

  const response = await fetchImpl(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://przeprogramowani.pl',
      'X-Title': '10xDevs Prework Code Block Repair',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${errorBody}`);
  }

  const result = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };
  const translatedText = result.choices?.[0]?.message?.content;

  if (!translatedText) {
    throw new Error('OpenRouter response did not include choices[0].message.content');
  }

  return translatedText;
}

export async function requestOpenRouterCodeBlockTranslation({
  apiKey,
  block,
  fetchImpl = fetch as FetchLike,
  model = DEFAULT_OPENROUTER_MODEL,
}: OpenRouterCodeBlockTranslationRequest): Promise<string> {
  return requestOpenRouterTextCompletion({
    apiKey,
    fetchImpl,
    model,
    prompt: buildCodeBlockTranslationPrompt(block),
  });
}

export async function requestOpenRouterMermaidTranslation({
  apiKey,
  block,
  fetchImpl = fetch as FetchLike,
  model = DEFAULT_OPENROUTER_MODEL,
}: OpenRouterMermaidTranslationRequest): Promise<string> {
  return requestOpenRouterTextCompletion({
    apiKey,
    fetchImpl,
    model,
    prompt: buildMermaidTranslationPrompt(block),
  });
}

function parseArgs(argv: string[]): CliOptions {
  let mode: RepairMode | null = null;
  let lesson: string | null = null;
  let model = DEFAULT_OPENROUTER_MODEL;
  let force = false;
  let json = false;
  let translateMermaid = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--report' || arg === '--dry-run' || arg === '--write') {
      const nextMode = arg.slice(2) as RepairMode;
      if (mode && mode !== nextMode) {
        throw new Error('Choose exactly one mode: --report, --dry-run, or --write');
      }
      mode = nextMode;
      continue;
    }

    if (arg === '--lesson') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --lesson');
      }
      lesson = value;
      index += 1;
      continue;
    }

    if (arg === '--model') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --model');
      }
      model = value;
      index += 1;
      continue;
    }

    if (arg === '--force') {
      force = true;
      continue;
    }

    if (arg === '--json') {
      json = true;
      continue;
    }

    if (arg === '--translate-mermaid') {
      translateMermaid = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    mode: mode ?? 'report',
    lesson,
    model,
    force,
    json,
    translateMermaid,
  };
}

function matchesLessonFilter(lessonPrefix: string, lesson: string | null): boolean {
  return !lesson || lessonPrefix === lesson || lessonPrefix.split('-')[0] === lesson;
}

function createEmptyIssueCounts(): Record<PreworkCodeBlockIssueKind, number> {
  return {
    'suspicious-code': 0,
    'suspicious-mermaid': 0,
    missing: 0,
  };
}

function countIssues(issues: PreworkCodeBlockIssue[]): Record<PreworkCodeBlockIssueKind, number> {
  return issues.reduce((counts, issue) => {
    counts[issue.kind] += 1;
    return counts;
  }, createEmptyIssueCounts());
}

function countLines(text: string): number {
  const trimmed = text.replace(/\r\n?/g, '\n').trim();
  return trimmed ? trimmed.split('\n').length : 0;
}

function normalizePathForReport(filePath: string): string {
  return path.relative(ROOT_DIR, filePath).split(path.sep).join('/');
}

function getTextPreview(text: string, maxLines = 3): string[] {
  return text
    .replace(/\r\n?/g, '\n')
    .trim()
    .split('\n')
    .slice(0, maxLines)
    .map((line) => line.trimEnd());
}

function normalizeContextText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function findNearbyText(
  $: cheerio.CheerioAPI,
  $pre: cheerio.Cheerio<cheerio.Element>,
  direction: 'before' | 'after'
): string | undefined {
  const siblings = direction === 'before' ? $pre.prevAll().toArray() : $pre.nextAll().toArray();

  for (const element of siblings) {
    const text = normalizeContextText($(element).text());
    if (text) {
      return text.length > 180 ? `${text.slice(0, 177)}...` : text;
    }
  }

  return undefined;
}

async function createMissingBlockDetails(
  lesson: PreworkCodeBlockLessonReport,
  issue: PreworkCodeBlockIssue
): Promise<MissingBlockDetails> {
  const plHtml = await readFile(lesson.plPath, 'utf-8');
  const $ = cheerio.load(plHtml, null, false);
  const $pre = $('pre').eq(issue.ordinal);

  return {
    plPath: normalizePathForReport(lesson.plPath),
    enPath: normalizePathForReport(lesson.enPath),
    enPreBlockCount: lesson.enBlockCount,
    plBlockType: issue.plBlock.type,
    ...(issue.plBlock.language ? { language: issue.plBlock.language } : {}),
    lineCount: issue.plBlock.lineCount,
    plBlockPreview: getTextPreview(issue.plBlock.text),
    ...(findNearbyText($, $pre, 'before') ? { plContextBefore: findNearbyText($, $pre, 'before') } : {}),
    ...(findNearbyText($, $pre, 'after') ? { plContextAfter: findNearbyText($, $pre, 'after') } : {}),
  };
}

function createMermaidIssueFromCacheEntry(
  lessonPrefix: string,
  entry: PreworkBlockCacheEntry
): PreworkCodeBlockIssue {
  return {
    kind: 'suspicious-mermaid',
    lessonPrefix,
    ordinal: entry.ordinal,
    plBlock: {
      lessonPrefix,
      ordinal: entry.ordinal,
      type: 'mermaid',
      text: entry.sourceText,
      lineCount: countLines(entry.sourceText),
      language: 'mermaid',
      className: 'mermaid',
    },
  };
}

function createCodeIssueFromCacheEntry(
  lessonPrefix: string,
  entry: PreworkBlockCacheEntry
): PreworkCodeBlockIssue {
  return {
    kind: 'suspicious-code',
    lessonPrefix,
    ordinal: entry.ordinal,
    plBlock: {
      lessonPrefix,
      ordinal: entry.ordinal,
      type: 'code',
      text: entry.sourceText,
      lineCount: countLines(entry.sourceText),
    },
  };
}

function createCacheEntry({
  issue,
  key,
  model,
  promptVersion = PREWORK_CODE_BLOCK_PROMPT_VERSION,
  status,
  translatedText,
  validationErrors,
}: {
  issue: PreworkCodeBlockIssue;
  key: string;
  model: string;
  promptVersion?: string;
  status: PreworkBlockCacheEntry['status'];
  translatedText: string;
  validationErrors?: string[];
}): PreworkBlockCacheEntry {
  return {
    key,
    blockHash: createBlockHash(issue.plBlock),
    promptVersion,
    model,
    blockType: issue.plBlock.type,
    ordinal: issue.ordinal,
    sourceLanguage: 'pl',
    targetLanguage: 'en',
    sourceText: issue.plBlock.text,
    translatedText,
    status,
    createdAt: new Date().toISOString(),
    ...(validationErrors && validationErrors.length > 0 ? { validationErrors } : {}),
  };
}

function isValidTranslatedCacheEntry(
  issue: PreworkCodeBlockIssue,
  entry: PreworkBlockCacheEntry | null
): entry is PreworkBlockCacheEntry {
  if (!entry || entry.status !== 'translated') {
    return false;
  }

  return validateTranslatedCodeBlock(issue.plBlock, entry.translatedText).ok;
}

function isValidTranslatedMermaidCacheEntry(
  issue: PreworkCodeBlockIssue,
  entry: PreworkBlockCacheEntry | null
): entry is PreworkBlockCacheEntry {
  if (!entry || entry.status !== 'translated') {
    return false;
  }

  return validateTranslatedMermaidBlock(issue.plBlock, entry.translatedText).ok;
}

async function translateCodeIssue({
  cache,
  issue,
  model,
  mode,
  force,
}: {
  cache: Awaited<ReturnType<typeof readLessonBlockCache>>;
  issue: PreworkCodeBlockIssue;
  model: string;
  mode: RepairMode;
  force: boolean;
}): Promise<{
  action: RepairAction;
  cache: Awaited<ReturnType<typeof readLessonBlockCache>>;
  repair: PreworkPreBlockRepair | null;
  cacheHit: boolean;
  cacheMiss: boolean;
  apiRequest: boolean;
}> {
  const key = createBlockCacheKey(issue.plBlock, model, PREWORK_CODE_BLOCK_PROMPT_VERSION);
  const cachedEntry = findCachedTranslation(cache, key);

  if (!force && isValidTranslatedCacheEntry(issue, cachedEntry)) {
    return {
      action: {
        lessonPrefix: issue.lessonPrefix,
        ordinal: issue.ordinal,
        kind: issue.kind,
        status: 'cached',
      },
      cache,
      repair:
        mode === 'write'
          ? {
              ordinal: issue.ordinal,
              type: 'code',
              text: cachedEntry.translatedText,
            }
          : null,
      cacheHit: true,
      cacheMiss: false,
      apiRequest: false,
    };
  }

  if (mode !== 'write') {
    return {
      action: {
        lessonPrefix: issue.lessonPrefix,
        ordinal: issue.ordinal,
        kind: issue.kind,
        status: 'needs-api',
        message: 'No valid cache entry; write mode would call OpenRouter.',
      },
      cache,
      repair: null,
      cacheHit: false,
      cacheMiss: true,
      apiRequest: false,
    };
  }

  const apiKey = getOpenRouterApiKeyForWriteMode(true);
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for write mode when a cache miss needs an API call');
  }

  const translatedText = await requestOpenRouterCodeBlockTranslation({
    apiKey,
    block: issue.plBlock,
    model,
  });

  const validation = validateTranslatedCodeBlock(issue.plBlock, translatedText);
  if (!validation.ok) {
    const failedEntry = createCacheEntry({
      issue,
      key,
      model,
      status: 'validation-failed',
      translatedText,
      validationErrors: validation.diagnostics,
    });
    const updatedCache = upsertCacheEntry(cache, failedEntry);
    await writeLessonBlockCache(DEFAULT_CACHE_DIR, updatedCache);

    return {
      action: {
        lessonPrefix: issue.lessonPrefix,
        ordinal: issue.ordinal,
        kind: issue.kind,
        status: 'validation-failed',
        message: validation.diagnostics.join('; '),
      },
      cache: updatedCache,
      repair: null,
      cacheHit: false,
      cacheMiss: true,
      apiRequest: true,
    };
  }

  const entry = createCacheEntry({
    issue,
    key,
    model,
    status: 'translated',
    translatedText,
  });
  const updatedCache = upsertCacheEntry(cache, entry);
  await writeLessonBlockCache(DEFAULT_CACHE_DIR, updatedCache);

  return {
    action: {
      lessonPrefix: issue.lessonPrefix,
      ordinal: issue.ordinal,
      kind: issue.kind,
      status: 'translated',
    },
    cache: updatedCache,
    repair: {
      ordinal: issue.ordinal,
      type: 'code',
      text: translatedText,
    },
    cacheHit: false,
    cacheMiss: true,
    apiRequest: true,
  };
}

async function translateMermaidIssue({
  cache,
  issue,
  model,
  mode,
  force,
}: {
  cache: Awaited<ReturnType<typeof readLessonBlockCache>>;
  issue: PreworkCodeBlockIssue;
  model: string;
  mode: RepairMode;
  force: boolean;
}): Promise<{
  action: RepairAction;
  cache: Awaited<ReturnType<typeof readLessonBlockCache>>;
  repair: PreworkPreBlockRepair | null;
  cacheHit: boolean;
  cacheMiss: boolean;
  apiRequest: boolean;
}> {
  const key = createBlockCacheKey(issue.plBlock, model, PREWORK_MERMAID_BLOCK_PROMPT_VERSION);
  const cachedEntry = findCachedTranslation(cache, key);

  if (!force && isValidTranslatedMermaidCacheEntry(issue, cachedEntry)) {
    return {
      action: {
        lessonPrefix: issue.lessonPrefix,
        ordinal: issue.ordinal,
        kind: issue.kind,
        status: 'cached',
        message: 'Using cached Mermaid translation.',
      },
      cache,
      repair:
        mode === 'write'
          ? {
              ordinal: issue.ordinal,
              type: 'mermaid',
              text: cachedEntry.translatedText,
            }
          : null,
      cacheHit: true,
      cacheMiss: false,
      apiRequest: false,
    };
  }

  if (mode !== 'write') {
    return {
      action: {
        lessonPrefix: issue.lessonPrefix,
        ordinal: issue.ordinal,
        kind: issue.kind,
        status: 'needs-api',
        message: 'No valid Mermaid translation cache entry; write mode would call OpenRouter.',
      },
      cache,
      repair: null,
      cacheHit: false,
      cacheMiss: true,
      apiRequest: false,
    };
  }

  const apiKey = getOpenRouterApiKeyForWriteMode(true);
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for write mode when a cache miss needs an API call');
  }

  const translatedText = await requestOpenRouterMermaidTranslation({
    apiKey,
    block: issue.plBlock,
    model,
  });

  const validation = validateTranslatedMermaidBlock(issue.plBlock, translatedText);
  if (!validation.ok) {
    const failedEntry = createCacheEntry({
      issue,
      key,
      model,
      promptVersion: PREWORK_MERMAID_BLOCK_PROMPT_VERSION,
      status: 'validation-failed',
      translatedText,
      validationErrors: validation.diagnostics,
    });
    const updatedCache = upsertCacheEntry(cache, failedEntry);
    await writeLessonBlockCache(DEFAULT_CACHE_DIR, updatedCache);

    return {
      action: {
        lessonPrefix: issue.lessonPrefix,
        ordinal: issue.ordinal,
        kind: issue.kind,
        status: 'validation-failed',
        message: validation.diagnostics.join('; '),
      },
      cache: updatedCache,
      repair: null,
      cacheHit: false,
      cacheMiss: true,
      apiRequest: true,
    };
  }

  const entry = createCacheEntry({
    issue,
    key,
    model,
    promptVersion: PREWORK_MERMAID_BLOCK_PROMPT_VERSION,
    status: 'translated',
    translatedText,
  });
  const updatedCache = upsertCacheEntry(cache, entry);
  await writeLessonBlockCache(DEFAULT_CACHE_DIR, updatedCache);

  return {
    action: {
      lessonPrefix: issue.lessonPrefix,
      ordinal: issue.ordinal,
      kind: issue.kind,
      status: 'translated',
      message: 'Mermaid block was translated with OpenRouter.',
    },
    cache: updatedCache,
    repair: {
      ordinal: issue.ordinal,
      type: 'mermaid',
      text: translatedText,
    },
    cacheHit: false,
    cacheMiss: true,
    apiRequest: true,
  };
}

function printTextReport(result: RepairCliResult): void {
  console.log(`Prework code block repair: ${result.mode}`);
  console.log(`Issues: ${result.issueCount}`);
  console.log(
    `Actions: ${result.repairedCount} code repaired/planned, ${result.restoredMermaidCount} Mermaid restored/planned, ${result.missingCount} missing`
  );
  console.log(
    `Cache/API: ${result.cacheHitCount} cache hits, ${result.cacheMissCount} cache misses, ${result.apiRequestCount} API requests`
  );

  if (result.affectedLessons.length === 0) {
    console.log('No suspicious or missing prework code blocks found.');
    return;
  }

  for (const lesson of result.affectedLessons) {
    const parts = [
      `${lesson.issues['suspicious-code']} code`,
      `${lesson.issues['suspicious-mermaid']} mermaid`,
      `${lesson.issues.missing} missing`,
    ];
    console.log(`${lesson.lessonPrefix}: ${parts.join(', ')}`);
  }

  const manualMermaid = result.actions.filter((action) => action.status === 'manual-translation-required');
  if (manualMermaid.length > 0) {
    console.log('Manual Mermaid translation required:');
    for (const action of manualMermaid) {
      console.log(`- ${action.lessonPrefix} pre #${action.ordinal}`);
    }
  }

  const missingBlocks = result.actions.filter((action) => action.status === 'missing');
  if (missingBlocks.length > 0) {
    console.log('Missing blocks to inspect manually:');
    for (const action of missingBlocks) {
      const details = action.details;
      console.log(`- ${action.lessonPrefix} PL pre #${action.ordinal}`);
      if (!details) {
        continue;
      }
      const language = details.language ? `, language=${details.language}` : '';
      console.log(`  PL: ${details.plPath}`);
      console.log(`  EN: ${details.enPath} (${details.enPreBlockCount} existing pre blocks)`);
      console.log(`  Block: ${details.plBlockType}${language}, ${details.lineCount} lines`);
      if (details.plContextBefore) {
        console.log(`  Before: ${details.plContextBefore}`);
      }
      if (details.plContextAfter) {
        console.log(`  After: ${details.plContextAfter}`);
      }
      console.log('  Preview:');
      for (const line of details.plBlockPreview) {
        console.log(`    ${line}`);
      }
    }
  }
}

async function runRepairCli(options: CliOptions): Promise<RepairCliResult> {
  const targets = createDefaultPreworkCodeBlockRepairTargets(ROOT_DIR);
  const report = await findPreworkCodeBlockIssues(targets);
  const lessons = report.lessons.filter((lesson) => matchesLessonFilter(lesson.lessonPrefix, options.lesson));
  const actions: RepairAction[] = [];
  let repairedCount = 0;
  let restoredMermaidCount = 0;
  let missingCount = 0;
  let cacheHitCount = 0;
  let cacheMissCount = 0;
  let apiRequestCount = 0;

  if (options.mode === 'write') {
    await loadEnvFiles(ROOT_DIR);
  }

  for (const lesson of lessons) {
    const repairs: PreworkPreBlockRepair[] = [];
    let cache = await readLessonBlockCache(DEFAULT_CACHE_DIR, lesson.lessonPrefix);
    const processedCodeOrdinals = new Set<number>();
    const processedMermaidOrdinals = new Set<number>();

    for (const issue of lesson.issues) {
      if (issue.kind === 'missing') {
        const details = await createMissingBlockDetails(lesson, issue);
        missingCount += 1;
        actions.push({
          lessonPrefix: issue.lessonPrefix,
          ordinal: issue.ordinal,
          kind: issue.kind,
          status: 'missing',
          message: 'Missing English block is reported only and was not inserted.',
          details,
        });
        continue;
      }

      if (issue.kind === 'suspicious-mermaid') {
        processedMermaidOrdinals.add(issue.ordinal);

        if (options.translateMermaid) {
          const result = await translateMermaidIssue({
            cache,
            issue,
            model: options.model,
            mode: options.mode,
            force: options.force,
          });
          cache = result.cache;
          if (result.repair) {
            repairs.push(result.repair);
          }
          cacheHitCount += result.cacheHit ? 1 : 0;
          cacheMissCount += result.cacheMiss ? 1 : 0;
          apiRequestCount += result.apiRequest ? 1 : 0;
          restoredMermaidCount += 1;
          actions.push(result.action);
          if (result.action.status === 'validation-failed') {
            throw new Error(
              `OpenRouter Mermaid translation failed validation for ${issue.lessonPrefix} pre #${issue.ordinal}: ${result.action.message}`
            );
          }
          continue;
        }

        if (options.mode !== 'report') {
          const key = createBlockCacheKey(issue.plBlock, options.model, PREWORK_MERMAID_BLOCK_PROMPT_VERSION);
          const entry = createCacheEntry({
            issue,
            key,
            model: options.model,
            promptVersion: PREWORK_MERMAID_BLOCK_PROMPT_VERSION,
            status: 'manual-translation-required',
            translatedText: issue.plBlock.text,
          });

          cache = upsertCacheEntry(cache, entry);
          if (options.mode === 'write') {
            await writeLessonBlockCache(DEFAULT_CACHE_DIR, cache);
            repairs.push({
              ordinal: issue.ordinal,
              type: 'mermaid',
              text: issue.plBlock.text,
            });
          }
        }

        restoredMermaidCount += 1;
        actions.push({
          lessonPrefix: issue.lessonPrefix,
          ordinal: issue.ordinal,
          kind: issue.kind,
          status: 'manual-translation-required',
          message: 'Mermaid block is restored from Polish source and requires manual English translation.',
        });
        continue;
      }

      processedCodeOrdinals.add(issue.ordinal);
      const result = await translateCodeIssue({
        cache,
        issue,
        model: options.model,
        mode: options.mode,
        force: options.force,
      });
      cache = result.cache;
      if (result.repair) {
        repairs.push(result.repair);
      }
      cacheHitCount += result.cacheHit ? 1 : 0;
      cacheMissCount += result.cacheMiss ? 1 : 0;
      apiRequestCount += result.apiRequest ? 1 : 0;
      repairedCount += result.action.status === 'cached' || result.action.status === 'translated' ? 1 : 0;
      actions.push(result.action);
      if (result.action.status === 'validation-failed') {
        throw new Error(
          `OpenRouter translation failed validation for ${issue.lessonPrefix} pre #${issue.ordinal}: ${result.action.message}`
        );
      }
    }

    if (options.force) {
      const translatedCodeEntries = cache.entries.filter(
        (entry) =>
          entry.blockType === 'code' &&
          entry.status === 'translated' &&
          !processedCodeOrdinals.has(entry.ordinal)
      );

      for (const entry of translatedCodeEntries) {
        if (processedCodeOrdinals.has(entry.ordinal)) {
          continue;
        }
        processedCodeOrdinals.add(entry.ordinal);
        const issue = createCodeIssueFromCacheEntry(lesson.lessonPrefix, entry);
        const result = await translateCodeIssue({
          cache,
          issue,
          model: options.model,
          mode: options.mode,
          force: options.force,
        });
        cache = result.cache;
        if (result.repair) {
          repairs.push(result.repair);
        }
        cacheHitCount += result.cacheHit ? 1 : 0;
        cacheMissCount += result.cacheMiss ? 1 : 0;
        apiRequestCount += result.apiRequest ? 1 : 0;
        repairedCount += result.action.status === 'cached' || result.action.status === 'translated' ? 1 : 0;
        actions.push(result.action);
        if (result.action.status === 'validation-failed') {
          throw new Error(
            `OpenRouter translation failed validation for ${issue.lessonPrefix} pre #${issue.ordinal}: ${result.action.message}`
          );
        }
      }
    }

    if (options.translateMermaid) {
      const manualMermaidEntries = cache.entries.filter(
        (entry) =>
          entry.blockType === 'mermaid' &&
          (entry.status === 'manual-translation-required' || entry.status === 'restored-polish-mermaid') &&
          !processedMermaidOrdinals.has(entry.ordinal)
      );

      for (const entry of manualMermaidEntries) {
        const issue = createMermaidIssueFromCacheEntry(lesson.lessonPrefix, entry);
        const result = await translateMermaidIssue({
          cache,
          issue,
          model: options.model,
          mode: options.mode,
          force: options.force,
        });
        cache = result.cache;
        if (result.repair) {
          repairs.push(result.repair);
        }
        cacheHitCount += result.cacheHit ? 1 : 0;
        cacheMissCount += result.cacheMiss ? 1 : 0;
        apiRequestCount += result.apiRequest ? 1 : 0;
        restoredMermaidCount += 1;
        actions.push(result.action);
        if (result.action.status === 'validation-failed') {
          throw new Error(
            `OpenRouter Mermaid translation failed validation for ${issue.lessonPrefix} pre #${issue.ordinal}: ${result.action.message}`
          );
        }
      }
    }

    if (options.mode === 'write' && repairs.length > 0) {
      const currentHtml = await readFile(lesson.enPath, 'utf-8');
      await writeFile(lesson.enPath, applyPreBlockRepairsToEnglishHtml(currentHtml, repairs), 'utf-8');
    }
  }

  const filteredIssues = lessons.flatMap((lesson) => lesson.issues);
  const affectedLessonsByPrefix = new Map<string, Record<PreworkCodeBlockIssueKind, number>>();
  const lessonPrefixesWithReportedIssues = new Set<string>();

  for (const lesson of lessons) {
    if (lesson.issues.length > 0) {
      lessonPrefixesWithReportedIssues.add(lesson.lessonPrefix);
      affectedLessonsByPrefix.set(lesson.lessonPrefix, countIssues(lesson.issues));
    }
  }

  for (const action of actions) {
    if (lessonPrefixesWithReportedIssues.has(action.lessonPrefix)) {
      continue;
    }
    if (!affectedLessonsByPrefix.has(action.lessonPrefix)) {
      affectedLessonsByPrefix.set(action.lessonPrefix, createEmptyIssueCounts());
    }
    affectedLessonsByPrefix.get(action.lessonPrefix)![action.kind] += 1;
  }

  const affectedLessons = [...affectedLessonsByPrefix.entries()]
    .map(([lessonPrefix, issues]) => ({
      lessonPrefix,
      issues,
    }))
    .sort((a, b) => a.lessonPrefix.localeCompare(b.lessonPrefix, undefined, { numeric: true }));

  return {
    mode: options.mode,
    model: options.model,
    issueCount: filteredIssues.length,
    repairedCount,
    restoredMermaidCount,
    missingCount,
    cacheHitCount,
    cacheMissCount,
    apiRequestCount,
    actions,
    affectedLessons,
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const result = await runRepairCli(options);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printTextReport(result);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('Failed to repair prework code blocks:', (error as Error).message);
    process.exit(1);
  });
}
