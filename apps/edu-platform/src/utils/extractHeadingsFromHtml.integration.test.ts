import { describe, it, expect } from 'vitest';
import { extractHeadingsFromHtml } from './extractHeadingsFromHtml';
import { buildCompleteToc } from './buildTocHierarchy';

/**
 * Integration tests to verify extraction works with real HTML content
 * similar to what process-for-display.ts handles
 */
describe('extractHeadingsFromHtml - Integration with process-for-display.ts', () => {
  it('should extract headings from HTML with embedded iframes', () => {
    const html = `
      <h1>Lesson Title</h1>
      <p>Introduction paragraph</p>
      <iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https://vimeo.com/123"></iframe>
      <h2>Section 1</h2>
      <p>Content</p>
      <h3>Subsection 1.1</h3>
      <p>More content</p>
    `;

    const { headings, modifiedHtml } = extractHeadingsFromHtml(html);

    expect(headings).toHaveLength(3);
    expect(headings[0].text).toBe('Lesson Title');
    expect(headings[1].text).toBe('Section 1');
    expect(headings[2].text).toBe('Subsection 1.1');

    // Verify IDs were added
    expect(modifiedHtml).toContain('id="lesson-title"');
    expect(modifiedHtml).toContain('id="section-1"');
    expect(modifiedHtml).toContain('id="subsection-11"');
  });

  it('should extract headings from HTML with lazy-loaded images', () => {
    const html = `
      <h1>Image Gallery</h1>
      <img loading="lazy" src="image1.jpg" alt="Image 1">
      <h2>Photo Section</h2>
      <img loading="lazy" src="image2.jpg" alt="Image 2">
    `;

    const { headings } = extractHeadingsFromHtml(html);

    expect(headings).toHaveLength(2);
    expect(headings[0].text).toBe('Image Gallery');
    expect(headings[1].text).toBe('Photo Section');
  });

  it('should extract headings from HTML with focus mode links removed', () => {
    const html = `
      <h1>Main Title</h1>
      <p>wersja focus mode <a href="https://platforma.przeprogramowani.pl/shared/lesson">link</a></p>
      <h2>Content Section</h2>
      <p>Regular paragraph</p>
    `;

    const { headings } = extractHeadingsFromHtml(html);

    expect(headings).toHaveLength(2);
    expect(headings[0].text).toBe('Main Title');
    expect(headings[1].text).toBe('Content Section');
  });

  it('should work with Cheerio load options used in process-for-display.ts', () => {
    // process-for-display.ts uses: cheerio.load(htmlContent, null, false)
    // Our extractHeadingsFromHtml uses the same options
    const html = `
      <h1>Test</h1>
      <h2>Section</h2>
    `;

    const { headings, modifiedHtml } = extractHeadingsFromHtml(html);

    expect(headings).toHaveLength(2);
    // Cheerio with (null, false) preserves original HTML structure
    expect(modifiedHtml).toBeTruthy();
  });

  it('should handle complete TOC extraction workflow', () => {
    const html = `
      <h1>Checklista Modułu 2</h1>
      <h2>Spis treści</h2>
      <h2>[2x1] Planowanie projektu</h2>
      <h4>Krok 1: Analiza</h4>
      <h4>Krok 2: Implementacja</h4>
      <h2>[2x2] Testowanie</h2>
      <h3>Testy jednostkowe</h3>
      <h3>Testy integracyjne</h3>
    `;

    const { headings, modifiedHtml } = extractHeadingsFromHtml(html);
    const tocResult = buildCompleteToc(headings);

    // Verify flat list
    expect(tocResult.flatHeadings).toHaveLength(8);

    // Verify tree structure
    expect(tocResult.tree).toHaveLength(1); // One H1
    expect(tocResult.tree[0].children).toHaveLength(3); // Three H2s
    expect(tocResult.tree[0].children[1].children).toHaveLength(2); // [2x1] has 2 H4s
    expect(tocResult.tree[0].children[2].children).toHaveLength(2); // [2x2] has 2 H3s

    // Verify map lookup
    expect(tocResult.headingMap.size).toBe(8);
    const planningSection = tocResult.headingMap.get('2x1-planowanie-projektu');
    expect(planningSection).toBeDefined();
    expect(planningSection?.text).toBe('[2x1] Planowanie projektu');

    // Verify IDs are in HTML (github-slugger preserves Polish characters)
    expect(modifiedHtml).toContain('id="checklista-modułu-2"');
    expect(modifiedHtml).toContain('id="2x1-planowanie-projektu"');
  });

  it('should preserve HTML content while adding IDs', () => {
    const html = `
      <h1>Title with <strong>bold</strong> and <em>italic</em></h1>
      <p>Paragraph content</p>
      <h2>Section with <code>code</code></h2>
      <div class="container">
        <h3>Nested heading</h3>
      </div>
    `;

    const { headings, modifiedHtml } = extractHeadingsFromHtml(html);

    expect(headings).toHaveLength(3);

    // Verify original HTML structure is preserved
    expect(modifiedHtml).toContain('<strong>bold</strong>');
    expect(modifiedHtml).toContain('<em>italic</em>');
    expect(modifiedHtml).toContain('<code>code</code>');
    expect(modifiedHtml).toContain('<div class="container">');
    expect(modifiedHtml).toContain('<p>Paragraph content</p>');

    // But IDs should be added
    expect(modifiedHtml).toContain('id="title-with-bold-and-italic"');
    expect(modifiedHtml).toContain('id="section-with-code"');
    expect(modifiedHtml).toContain('id="nested-heading"');
  });

  it('should handle HTML cleaned by process-for-display.ts', () => {
    // Simulate HTML after process-for-display.ts transformations
    const html = `
      <meta name="lesson-id" content="lesson-123">
      <h1>Processed Lesson</h1>
      <iframe loading="lazy" class="w-full aspect-video" src="https://player.vimeo.com/video/123"></iframe>
      <h2>Content After Processing</h2>
      <img loading="lazy" src="image.jpg">
    `;

    const { headings, modifiedHtml } = extractHeadingsFromHtml(html);

    expect(headings).toHaveLength(2);
    expect(headings[0].text).toBe('Processed Lesson');
    expect(headings[1].text).toBe('Content After Processing');

    // Meta tag and other content should be preserved
    expect(modifiedHtml).toContain('<meta name="lesson-id"');
    expect(modifiedHtml).toContain('class="w-full aspect-video"');
  });
});
