import { describe, expect, it } from 'vitest';
import { buildLocalizedPreworkMarkdownExport } from './preworkMarkdownExport';

describe('buildLocalizedPreworkMarkdownExport', () => {
  it('adds localized prework frontmatter and converts HTML to Markdown', () => {
    const result = buildLocalizedPreworkMarkdownExport({
      title: 'Lekcja &amp; test',
      courseId: '10xdevs-3-prework',
      language: 'pl',
      htmlContent: '<h2>Start</h2><p>Treść lekcji</p>',
      exportedDate: '2026-04-27',
    });

    expect(result).toContain('title: "Lekcja & test"');
    expect(result).toContain('course: "10xdevs-3-prework"');
    expect(result).toContain('language: "pl"');
    expect(result).toContain('exported: "2026-04-27"');
    expect(result).toContain('format: "markdown"');
    expect(result).toContain('## Start');
    expect(result).toContain('Treść lekcji');
  });
});
