import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { globSync } from 'glob';

const POLISH_CHARS = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
const STRING_LITERAL = /(['"`])((?:\\.|(?!\1).)*?)\1/g;
const ALLOW_MARKER = /i18n-allow\b/;
const COMMENT_LINE = /^\s*(\/\/|\*|\/\*)/;
const BILINGUAL_LINE = /\bpl\s*:.*\ben\s*:|\ben\s*:.*\bpl\s*:/;

const EXPLORERS_ROOT = resolve(__dirname, '..');

describe('no hardcoded Polish in explorers chrome', () => {
  it('finds zero offending literals outside content/i18n modules', () => {
    const files = globSync('**/*.{ts,svelte}', {
      cwd: EXPLORERS_ROOT,
      ignore: [
        'i18n/**',
        'levels/**',
        'data/**',
        // Plan-acknowledged out-of-scope:
        'QaOverlay.svelte',
        'MobileControls.svelte',
        // Tests:
        '**/*.test.ts',
        '__tests__/**',
      ],
      absolute: true,
    });

    const offenders: string[] = [];
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const lines = src.split('\n');
      lines.forEach((line, idx) => {
        if (COMMENT_LINE.test(line)) return;
        if (ALLOW_MARKER.test(line)) return;
        if (BILINGUAL_LINE.test(line)) return;
        const matches = line.matchAll(STRING_LITERAL);
        for (const match of matches) {
          if (POLISH_CHARS.test(match[2])) {
            const rel = file.replace(EXPLORERS_ROOT + '/', '');
            offenders.push(`${rel}:${idx + 1}: ${match[0]}`);
          }
        }
      });
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
