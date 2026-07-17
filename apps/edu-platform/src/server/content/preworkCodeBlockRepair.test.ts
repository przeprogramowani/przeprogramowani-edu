/* @vitest-environment jsdom */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  applyPreBlockRepairsToEnglishHtml,
  comparePreBlocks,
  createBlockCacheKey,
  createBlockHash,
  extractPreBlocks,
  findCachedTranslation,
  findPreworkCodeBlockIssues,
  pairPreworkLessonHtmlFiles,
  readLessonBlockCache,
  upsertCacheEntry,
  validateTranslatedCodeBlock,
  validateTranslatedMermaidBlock,
  writeLessonBlockCache,
  type PreworkBlockCacheEntry,
  type PreworkCodeBlockRepairTargets,
} from './preworkCodeBlockRepair';
import {
  buildCodeBlockTranslationPrompt,
  buildMermaidTranslationPrompt,
  DEFAULT_OPENROUTER_MODEL,
  getOpenRouterApiKeyForWriteMode,
  requestOpenRouterCodeBlockTranslation,
  requestOpenRouterMermaidTranslation,
  type FetchLike,
} from '../../../scripts/repair-prework-code-blocks';

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'prework-code-block-repair-'));
  tempDirs.push(dir);
  return dir;
}

async function writeFixture(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

function createTarget(rootDir: string): PreworkCodeBlockRepairTargets {
  return {
    plDir: path.join(rootDir, 'src/content/lessons10xDevs3Prework/pl'),
    enDir: path.join(rootDir, 'src/content/lessons10xDevs3Prework/en'),
    rootDir,
  };
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('pairPreworkLessonHtmlFiles', () => {
  it('pairs Polish and English lesson HTML files by lesson prefix', async () => {
    const rootDir = await createTempDir();
    const target = createTarget(rootDir);
    await writeFixture(path.join(target.plDir, '02-1x2_polish-title.html'), '<html></html>');
    await writeFixture(path.join(target.enDir, '02-1x2.html'), '<html></html>');
    await writeFixture(path.join(target.plDir, '10-3x2_polish-title.html'), '<html></html>');
    await writeFixture(path.join(target.enDir, '10-3x2.html'), '<html></html>');

    const pairs = await pairPreworkLessonHtmlFiles(target.plDir, target.enDir);

    expect(pairs.map((pair) => pair.lessonPrefix)).toEqual(['02-1x2', '10-3x2']);
    expect(pairs[0]).toMatchObject({
      plPath: path.join(target.plDir, '02-1x2_polish-title.html'),
      enPath: path.join(target.enDir, '02-1x2.html'),
    });
  });
});

describe('extractPreBlocks', () => {
  it('extracts pre>code blocks with text, class, language, and line count', () => {
    const [block] = extractPreBlocks(
      [
        '<html><body>',
        '<pre><code class="language-json">{',
        '  "role": "assistant"',
        '}</code></pre>',
        '</body></html>',
      ].join('\n'),
      '02-1x2'
    );

    expect(block).toMatchObject({
      lessonPrefix: '02-1x2',
      ordinal: 0,
      type: 'code',
      text: '{\n  "role": "assistant"\n}',
      lineCount: 3,
      className: 'language-json',
      codeClassName: 'language-json',
      language: 'json',
    });
  });

  it('extracts mermaid pre blocks separately from regular code blocks', () => {
    const [block] = extractPreBlocks(
      [
        '<html><body>',
        '<pre class="mermaid" data-language="mermaid">flowchart LR',
        '  A --> B',
        '</pre>',
        '</body></html>',
      ].join('\n'),
      '03-1x3'
    );

    expect(block).toMatchObject({
      type: 'mermaid',
      text: 'flowchart LR\n  A --> B\n',
      lineCount: 2,
      className: 'mermaid',
      language: 'mermaid',
    });
  });

  it('treats non-code and non-mermaid pre blocks as other-pre', () => {
    const [block] = extractPreBlocks('<pre>plain\npreformatted</pre>', '01-1x1');

    expect(block).toMatchObject({
      type: 'other-pre',
      lineCount: 2,
    });
  });
});

describe('comparePreBlocks', () => {
  it('reports suspicious one-line English code blocks when Polish source is multi-line', () => {
    const plBlocks = extractPreBlocks('<pre><code class="language-json">{\n  "tool": "read"\n}</code></pre>', '02');
    const enBlocks = extractPreBlocks('<pre><code class="language-json">{</code></pre>', '02');

    expect(comparePreBlocks(plBlocks, enBlocks)).toEqual([
      expect.objectContaining({
        kind: 'suspicious-code',
        lessonPrefix: '02',
        ordinal: 0,
      }),
    ]);
  });

  it('reports suspicious one-line English mermaid blocks separately from code blocks', () => {
    const plBlocks = extractPreBlocks(
      '<pre class="mermaid" data-language="mermaid">sequenceDiagram\n  User->>Agent: Cel</pre>',
      '02'
    );
    const enBlocks = extractPreBlocks(
      '<pre class="mermaid" data-language="mermaid">sequenceDiagram</pre>',
      '02'
    );

    expect(comparePreBlocks(plBlocks, enBlocks)).toEqual([
      expect.objectContaining({
        kind: 'suspicious-mermaid',
        lessonPrefix: '02',
        ordinal: 0,
      }),
    ]);
  });

  it('reports missing English blocks by ordinal', () => {
    const plBlocks = extractPreBlocks(
      [
        '<pre><code>first\nblock</code></pre>',
        '<p>Between.</p>',
        '<pre><code>second\nblock</code></pre>',
      ].join('\n'),
      '11'
    );
    const enBlocks = extractPreBlocks('<pre><code>first\nblock</code></pre>', '11');

    expect(comparePreBlocks(plBlocks, enBlocks)).toEqual([
      expect.objectContaining({
        kind: 'missing',
        lessonPrefix: '11',
        ordinal: 1,
      }),
    ]);
  });

  it('ignores healthy blocks', () => {
    const plBlocks = extractPreBlocks('<pre><code>line one\nline two</code></pre>', '04');
    const enBlocks = extractPreBlocks('<pre><code>line one\nline two</code></pre>', '04');

    expect(comparePreBlocks(plBlocks, enBlocks)).toEqual([]);
  });
});

describe('findPreworkCodeBlockIssues', () => {
  it('finds lesson-level issues without modifying source files', async () => {
    const rootDir = await createTempDir();
    const target = createTarget(rootDir);
    const plPath = path.join(target.plDir, '02-1x2_polish-title.html');
    const enPath = path.join(target.enDir, '02-1x2.html');
    await writeFixture(plPath, '<pre><code class="language-json">{\n  "role": "assistant"\n}</code></pre>');
    await writeFixture(enPath, '<pre><code class="language-json">{</code></pre>');
    const before = await Promise.all([fs.readFile(plPath, 'utf-8'), fs.readFile(enPath, 'utf-8')]);

    const report = await findPreworkCodeBlockIssues(target);
    const after = await Promise.all([fs.readFile(plPath, 'utf-8'), fs.readFile(enPath, 'utf-8')]);

    expect(report.issues).toHaveLength(1);
    expect(report.lessons).toEqual([
      expect.objectContaining({
        lessonPrefix: '02-1x2',
        plBlockCount: 1,
        enBlockCount: 1,
        issues: [expect.objectContaining({ kind: 'suspicious-code' })],
      }),
    ]);
    expect(after).toEqual(before);
  });
});

describe('translation cache helpers', () => {
  it('creates stable cache keys from normalized block text, model, and prompt version', () => {
    const [block] = extractPreBlocks('<pre><code>line one\r\nline two\n</code></pre>', '10');
    const [sameBlock] = extractPreBlocks('<pre><code>line one\nline two</code></pre>', '10');

    expect(createBlockHash(block)).toBe(createBlockHash(sameBlock));
    expect(createBlockCacheKey(block, 'google/gemini-2.5-flash', 'prework-code-block-v1')).toBe(
      createBlockCacheKey(sameBlock, 'google/gemini-2.5-flash', 'prework-code-block-v1')
    );
    expect(createBlockCacheKey(block, 'other/model', 'prework-code-block-v1')).not.toBe(
      createBlockCacheKey(block, 'google/gemini-2.5-flash', 'prework-code-block-v1')
    );
  });

  it('reads and writes per-lesson cache files', async () => {
    const rootDir = await createTempDir();
    const cacheDir = path.join(rootDir, 'scripts/prework-code-translations/cache');
    const [block] = extractPreBlocks('<pre><code>Napraw błąd\nUruchom testy</code></pre>', '10');
    const entry: PreworkBlockCacheEntry = {
      key: createBlockCacheKey(block, DEFAULT_OPENROUTER_MODEL, 'prework-code-block-v1'),
      blockHash: createBlockHash(block),
      promptVersion: 'prework-code-block-v1',
      model: DEFAULT_OPENROUTER_MODEL,
      blockType: 'code',
      ordinal: block.ordinal,
      sourceLanguage: 'pl',
      targetLanguage: 'en',
      sourceText: block.text,
      translatedText: 'Fix the bug\nRun tests',
      status: 'translated',
      createdAt: '2026-04-28T00:00:00.000Z',
    };

    const emptyCache = await readLessonBlockCache(cacheDir, '10');
    const updatedCache = upsertCacheEntry(emptyCache, entry);
    await writeLessonBlockCache(cacheDir, updatedCache);

    const stored = await readLessonBlockCache(cacheDir, '10');

    expect(stored).toEqual({
      lessonPrefix: '10',
      updatedAt: '2026-04-28T00:00:00.000Z',
      entries: [entry],
    });
  });

  it('finds cached translations by key and replaces existing entries on upsert', async () => {
    const [block] = extractPreBlocks('<pre><code>Linia pierwsza\nLinia druga</code></pre>', '03');
    const key = createBlockCacheKey(block, DEFAULT_OPENROUTER_MODEL, 'prework-code-block-v1');
    const originalEntry: PreworkBlockCacheEntry = {
      key,
      blockHash: createBlockHash(block),
      promptVersion: 'prework-code-block-v1',
      model: DEFAULT_OPENROUTER_MODEL,
      blockType: 'code',
      ordinal: block.ordinal,
      sourceLanguage: 'pl',
      targetLanguage: 'en',
      sourceText: block.text,
      translatedText: 'First line\nSecond line',
      status: 'translated',
      createdAt: '2026-04-28T00:00:00.000Z',
    };
    const replacementEntry = {
      ...originalEntry,
      translatedText: 'Line one\nLine two',
      createdAt: '2026-04-28T00:01:00.000Z',
    };

    const cache = upsertCacheEntry(
      upsertCacheEntry({ lessonPrefix: '03', updatedAt: new Date(0).toISOString(), entries: [] }, originalEntry),
      replacementEntry
    );

    expect(cache.entries).toHaveLength(1);
    expect(findCachedTranslation(cache, key)).toMatchObject({
      translatedText: 'Line one\nLine two',
    });
  });
});

describe('validateTranslatedCodeBlock', () => {
  it('rejects first-line-only output for a multi-line source block', () => {
    const [sourceBlock] = extractPreBlocks('<pre><code>Napraw błąd\nUruchom testy</code></pre>', '10');

    expect(validateTranslatedCodeBlock(sourceBlock, 'Napraw błąd')).toEqual({
      ok: false,
      diagnostics: ['Translated code block appears to contain only the first source line.'],
    });
  });

  it('accepts translated multi-line prompt text with line-count variation', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre><code>Zrefaktoryzuj moduł płatności.\nZachowaj aktualne zachowanie.\nUruchom testy.</code></pre>',
      '10'
    );

    expect(
      validateTranslatedCodeBlock(
        sourceBlock,
        'Refactor the payment module while preserving the current behavior.\nRun the tests.'
      )
    ).toEqual({
      ok: true,
      diagnostics: [],
    });
  });

  it('rejects fenced output', () => {
    const [sourceBlock] = extractPreBlocks('<pre><code>line one\nline two</code></pre>', '10');

    expect(validateTranslatedCodeBlock(sourceBlock, '```\nline one\nline two\n```')).toMatchObject({
      ok: false,
      diagnostics: ['Translated code block is wrapped in Markdown fences.'],
    });
  });

  it('rejects obvious JSON brace loss', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre><code class="language-json">{\n  "role": "assistant"\n}</code></pre>',
      '02'
    );

    expect(validateTranslatedCodeBlock(sourceBlock, '{\n  "role": "assistant"')).toMatchObject({
      ok: false,
      diagnostics: ['Translated JSON-like block appears to have lost braces.'],
    });
  });

  it('rejects obvious shell line-continuation loss', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre><code class="language-bash">git diff main | claude -p \\\n  "Review changes" \\\n  --output json</code></pre>',
      '04'
    );

    expect(
      validateTranslatedCodeBlock(
        sourceBlock,
        'git diff main | claude -p\n  "Review changes"\n  --output json'
      )
    ).toMatchObject({
      ok: false,
      diagnostics: ['Translated shell-like block appears to have lost line continuations.'],
    });
  });

  it('rejects English comments translated into Polish', () => {
    const [sourceBlock] = extractPreBlocks(
      `<pre><code>function calculateTotal(items: Item) {
  // Property 'price' does not exist on type 'Item'.
  return items.reduce((sum, item) => sum + item.price;
}</code></pre>`,
      '09'
    );

    expect(
      validateTranslatedCodeBlock(
        sourceBlock,
        `function calculateTotal(items: Item) {
  // Właściwość 'price' nie istnieje w typie 'Item'.
  return items.reduce((sum, item) => sum + item.price;
}`
      )
    ).toMatchObject({
      ok: false,
      diagnostics: ['Translated code block appears to translate English source text into Polish.'],
    });
  });

  it('rejects English HTML text translated into Polish', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre><code>&lt;h2 class="text-lg"&gt;Card title&lt;/h2&gt;</code></pre>',
      '14'
    );

    expect(
      validateTranslatedCodeBlock(sourceBlock, '<h2 class="text-lg">Tytuł karty</h2>')
    ).toMatchObject({
      ok: false,
      diagnostics: ['Translated code block appears to translate English source text into Polish.'],
    });
  });

  it('accepts Polish comments translated into English', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre><code>return items.reduce((sum, item) =&gt; sum + item. //jakie pole pobrać z obiektu item?</code></pre>',
      '09'
    );

    expect(
      validateTranslatedCodeBlock(
        sourceBlock,
        'return items.reduce((sum, item) => sum + item. //which field to get from the item object?'
      )
    ).toEqual({
      ok: true,
      diagnostics: [],
    });
  });
});

describe('validateTranslatedMermaidBlock', () => {
  it('accepts translated Mermaid labels when syntax shape is preserved', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre class="mermaid" data-language="mermaid">flowchart LR\n  A[Świeże okno] --> B[Pełna uwaga]</pre>',
      '09'
    );

    expect(
      validateTranslatedMermaidBlock(
        sourceBlock,
        'flowchart LR\n  A[Fresh window] --> B[Full attention]'
      )
    ).toEqual({
      ok: true,
      diagnostics: [],
    });
  });

  it('rejects translated Mermaid output that changes the diagram directive', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre class="mermaid" data-language="mermaid">flowchart LR\n  A[Start] --> B[Koniec]</pre>',
      '09'
    );

    expect(validateTranslatedMermaidBlock(sourceBlock, 'sequenceDiagram\n  A->>B: End')).toEqual({
      ok: false,
      diagnostics: ['Translated Mermaid block changed the diagram directive.'],
    });
  });

  it('rejects truncated Mermaid output', () => {
    const [sourceBlock] = extractPreBlocks(
      '<pre class="mermaid" data-language="mermaid">sequenceDiagram\n  User->>Agent: Cel</pre>',
      '02'
    );

    expect(validateTranslatedMermaidBlock(sourceBlock, 'sequenceDiagram')).toEqual({
      ok: false,
      diagnostics: ['Translated Mermaid block appears to be truncated.'],
    });
  });
});

describe('buildCodeBlockTranslationPrompt', () => {
  it('explicitly preserves already-English text', () => {
    const prompt = buildCodeBlockTranslationPrompt({
      language: 'ts',
      text: "// Property 'price' does not exist on type 'Item'.",
    });

    expect(prompt).toContain('Target language: English.');
    expect(prompt).toContain('Translate only text that is clearly Polish.');
    expect(prompt).toContain('If text is already English, leave it unchanged.');
    expect(prompt).toContain('Never translate English text into Polish.');
  });
});

describe('OpenRouter translation helper', () => {
  it('uses an injectable fetch implementation instead of real network', async () => {
    const [block] = extractPreBlocks('<pre><code>Napraw błąd\nUruchom testy</code></pre>', '10');
    const requests: Array<{ input: string; body: unknown; headers: Record<string, string> }> = [];
    const fakeFetch: FetchLike = async (input, init) => {
      requests.push({
        input,
        body: JSON.parse(init.body),
        headers: init.headers,
      });

      return {
        ok: true,
        status: 200,
        text: async () => '',
        json: async () => ({
          choices: [
            {
              message: {
                content: 'Fix the bug\nRun tests',
              },
            },
          ],
        }),
      };
    };

    await expect(
      requestOpenRouterCodeBlockTranslation({
        apiKey: 'test-key',
        block,
        fetchImpl: fakeFetch,
      })
    ).resolves.toBe('Fix the bug\nRun tests');

    expect(requests).toEqual([
      expect.objectContaining({
        input: 'https://openrouter.ai/api/v1/chat/completions',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
          'HTTP-Referer': 'https://przeprogramowani.pl',
          'X-Title': '10xDevs Prework Code Block Repair',
        }),
      }),
    ]);
    expect(requests[0]?.body).toMatchObject({
      model: DEFAULT_OPENROUTER_MODEL,
      stream: false,
    });
  });

  it('uses a dedicated prompt for Mermaid translation requests', async () => {
    const [block] = extractPreBlocks(
      '<pre class="mermaid" data-language="mermaid">flowchart LR\n  A[Cel] --> B[Wynik]</pre>',
      '02'
    );
    const requests: Array<{ body: { messages?: Array<{ content?: string }> } }> = [];
    const fakeFetch: FetchLike = async (_input, init) => {
      requests.push({
        body: JSON.parse(init.body),
      });

      return {
        ok: true,
        status: 200,
        text: async () => '',
        json: async () => ({
          choices: [
            {
              message: {
                content: 'flowchart LR\n  A[Goal] --> B[Result]',
              },
            },
          ],
        }),
      };
    };

    await expect(
      requestOpenRouterMermaidTranslation({
        apiKey: 'test-key',
        block,
        fetchImpl: fakeFetch,
      })
    ).resolves.toBe('flowchart LR\n  A[Goal] --> B[Result]');

    expect(requests[0]?.body.messages?.[0]?.content).toBe(buildMermaidTranslationPrompt(block));
    expect(requests[0]?.body.messages?.[0]?.content).toContain('Preserve valid Mermaid syntax exactly.');
    expect(requests[0]?.body.messages?.[0]?.content).toContain('Translate only labels and natural-language text');
  });

  it('requires OPENROUTER_API_KEY only when write mode needs an API call', () => {
    const originalApiKey = process.env.OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;

    try {
      expect(getOpenRouterApiKeyForWriteMode(false)).toBeNull();
      expect(() => getOpenRouterApiKeyForWriteMode(true)).toThrow(/OPENROUTER_API_KEY/);
    } finally {
      if (originalApiKey === undefined) {
        delete process.env.OPENROUTER_API_KEY;
      } else {
        process.env.OPENROUTER_API_KEY = originalApiKey;
      }
    }
  });
});

describe('applyPreBlockRepairsToEnglishHtml', () => {
  it('patches one suspicious pre>code block while preserving pre and code attributes', () => {
    const html = [
      '<html><body>',
      '<pre data-kind="example"><code class="language-text" data-language="text">Napraw błąd</code></pre>',
      '</body></html>',
    ].join('');

    const patched = applyPreBlockRepairsToEnglishHtml(html, [
      {
        ordinal: 0,
        type: 'code',
        text: 'Fix the bug\nRun tests',
      },
    ]);

    expect(patched).toContain('<pre data-kind="example"><code class="language-text" data-language="text">Fix the bug\nRun tests</code></pre>');
  });

  it('patches one suspicious Mermaid block while preserving attributes', () => {
    const html = [
      '<html><body>',
      '<pre class="mermaid" data-language="mermaid">flowchart LR</pre>',
      '</body></html>',
    ].join('');

    const patched = applyPreBlockRepairsToEnglishHtml(html, [
      {
        ordinal: 0,
        type: 'mermaid',
        text: 'flowchart LR\n  A --> B',
      },
    ]);

    expect(patched).toContain('<pre class="mermaid" data-language="mermaid">flowchart LR\n  A --&gt; B</pre>');
  });

  it('does not insert missing blocks', () => {
    const html = '<html><body><pre><code>only block</code></pre></body></html>';

    const patched = applyPreBlockRepairsToEnglishHtml(html, [
      {
        ordinal: 1,
        type: 'code',
        text: 'missing block',
      },
    ]);

    expect(extractPreBlocks(patched, '11')).toHaveLength(1);
    expect(patched).not.toContain('missing block');
  });

  it('does not rewrite healthy blocks that are not targeted by repairs', () => {
    const html = [
      '<html><body>',
      '<pre><code class="language-text">healthy\nblock</code></pre>',
      '<pre><code class="language-text">broken</code></pre>',
      '</body></html>',
    ].join('');

    const patched = applyPreBlockRepairsToEnglishHtml(html, [
      {
        ordinal: 1,
        type: 'code',
        text: 'repaired\nblock',
      },
    ]);

    expect(patched).toContain('<pre><code class="language-text">healthy\nblock</code></pre>');
    expect(patched).toContain('<pre><code class="language-text">repaired\nblock</code></pre>');
  });
});
