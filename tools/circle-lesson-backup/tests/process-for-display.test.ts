import { describe, expect, it } from 'vitest';
import { processHtmlForDisplay } from '../utils/process-for-display';

describe('processHtmlForDisplay', () => {
  it('removes focus mode self-reference paragraphs', () => {
    const lessonHtml = `
      <div>
        <p>Wersja Focus Mode (Markdown) jest dostępna <a href="https://platforma.przeprogramowani.pl/shared/123" target="_blank" rel="noopener noreferrer">tutaj</a>.</p>
        <p>Regular lesson content with a <a href="https://example.com">link</a>.</p>
      </div>
    `;

    const result = processHtmlForDisplay(lessonHtml, 'Sample Lesson');

    expect(result.includes('Wersja Focus Mode')).toBe(false);
    expect(result.includes('Regular lesson content')).toBe(true);
    expect(result.includes('https://example.com')).toBe(true);
  });

  it('keeps paragraphs that mention focus mode but do not link to the shared copy', () => {
    const lessonHtml = `
      <div>
        <p>Wersja focus mode jest omawiana w tej lekcji bez linku.</p>
      </div>
    `;

    const result = processHtmlForDisplay(lessonHtml, 'Sample Lesson');

    expect(result.includes('Wersja focus mode')).toBe(true);
  });
});
