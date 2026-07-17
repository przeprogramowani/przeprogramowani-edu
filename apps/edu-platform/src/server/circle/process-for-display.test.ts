import { describe, it, expect } from 'vitest';
import { processHtmlForDisplay, transformIframes } from './process-for-display';
import { htmlToMarkdown } from '../../utils/htmlToMarkdown';
import { sanitizeForYaml } from '../../utils/decodeHtmlEntities';

/**
 * Tests for processHtmlForDisplay() - the function that processes HTML from Circle API
 *
 * These tests verify that Cheerio doesn't add unwanted DOCTYPE or HTML structure tags
 * This is critical because Cheerio by default wraps content in <!DOCTYPE html><html><body>...
 */
describe('processHtmlForDisplay - Cheerio DOCTYPE Prevention', () => {
  describe('transformIframes - should not add DOCTYPE', () => {
    it('should not add DOCTYPE when processing simple HTML', () => {
      const html = '<div><p>Simple content</p></div>';
      const result = transformIframes(html);

      expect(result).not.toContain('<!DOCTYPE');
      expect(result).not.toContain('<html>');
      expect(result).not.toContain('<head>');
      expect(result).not.toContain('<body>');
    });

    it('should not add DOCTYPE when processing iframe embeds', () => {
      const html = `
        <div>
          <iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F123456"></iframe>
          <p>Content after iframe</p>
        </div>
      `;
      const result = transformIframes(html);

      expect(result).not.toContain('<!DOCTYPE');
      expect(result).not.toContain('<html>');
      expect(result).not.toContain('<head>');
      expect(result).not.toContain('<body>');
      expect(result).toContain('vimeo.com');
    });

    it('should preserve content without wrapping in extra tags', () => {
      const html = '<p>Test</p><p>Another paragraph</p>';
      const result = transformIframes(html);

      // Should not start with <!DOCTYPE or <html>
      expect(result.trim()).toMatch(/^<p>/);
      expect(result).not.toContain('<html>');
    });
  });

  describe('processHtmlForDisplay - full pipeline', () => {
    it('should remove DOCTYPE if it somehow appears', () => {
      const html = '<!DOCTYPE html><html><body><p>Content</p></body></html>';
      const result = processHtmlForDisplay(html, 'test-lesson');

      // Should remove all HTML structure tags
      expect(result.html).not.toContain('<!DOCTYPE');
      expect(result.html).not.toContain('<html>');
      expect(result.html).not.toContain('<head>');
      expect(result.html).not.toContain('<body>');

      // Should keep content
      expect(result.html).toContain('<p>Content</p>');

      // Should add lesson-id meta tag
      expect(result.html).toContain('<meta name="lesson-id" content="test-lesson">');
    });

    it('should handle realistic Circle.so HTML content', () => {
      const circleHtml = `
        <div class="lesson-content">
          <h2>Introduction</h2>
          <p>This is a lesson about <strong>TypeScript</strong>.</p>
          <img src="https://example.com/image.png" alt="Example" />
          <pre><code>const x: string = "hello";</code></pre>
          <iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F987654"></iframe>
        </div>
      `;

      const result = processHtmlForDisplay(circleHtml, '[5x1] Test Lesson');

      // Critical: no DOCTYPE or HTML structure tags
      expect(result.html).not.toContain('<!DOCTYPE');
      expect(result.html).not.toContain('<html>');
      expect(result.html).not.toContain('<head>');
      expect(result.html).not.toContain('<body>');

      // Should preserve content
      expect(result.html).toContain('Introduction');
      expect(result.html).toContain('TypeScript');
      expect(result.html).toContain('loading="lazy"'); // lazyImages should work

      // Should add lesson-id
      expect(result.html).toContain('<meta name="lesson-id" content="[5x1] Test Lesson">');

      // Should not start with whitespace
      expect(result.html).toMatch(/^<meta/);
    });

    it('should handle HTML with focus mode links', () => {
      const html = `
        <p>📖 <a href="https://platforma.przeprogramowani.pl/shared/abc123">Wersja focus mode</a></p>
        <div class="lesson-content">
          <h2>Main Content</h2>
          <p>Lesson content here...</p>
        </div>
      `;

      const result = processHtmlForDisplay(html, 'test');

      // Focus mode link should be removed
      expect(result.html).not.toContain('Wersja focus mode');
      expect(result.html).not.toContain('shared/abc123');

      // But main content should remain
      expect(result.html).toContain('Main Content');
      expect(result.html).toContain('Lesson content here');

      // No DOCTYPE
      expect(result.html).not.toContain('<!DOCTYPE');
    });

    it('should clean up multiple Cheerio passes', () => {
      // Simulate worst case: HTML that already has some structure tags
      const messyHtml = `
        <!DOCTYPE html>
        <html>
          <head><title>Ignored</title></head>
          <body>
            <div class="lesson">
              <h1>Lesson Title</h1>
              <p>Content</p>
            </div>
          </body>
        </html>
      `;

      const result = processHtmlForDisplay(messyHtml, 'messy-lesson');

      // Should strip ALL structure tags
      expect(result.html).not.toContain('<!DOCTYPE');
      expect(result.html).not.toContain('<html>');
      expect(result.html).not.toContain('</html>');
      expect(result.html).not.toContain('<head>');
      expect(result.html).not.toContain('</head>');
      expect(result.html).not.toContain('<body>');
      expect(result.html).not.toContain('</body>');
      expect(result.html).not.toContain('<title>');

      // Should keep actual content
      expect(result.html).toContain('Lesson Title');
      expect(result.html).toContain('Content');
    });
  });

  describe('Full integration: processHtmlForDisplay -> htmlToMarkdown', () => {
    it('should produce clean markdown without DOCTYPE or HTML entities', () => {
      const circleHtml = `
        <div>
          <h2>Lekcja: &quot;Wprowadzenie do TypeScript&quot;</h2>
          <p>Poznamy typy <strong>podstawowe</strong> oraz zaawansowane.</p>
          <img src="https://example.com/diagram.png" alt="Diagram typów" />
          <pre><code class="language-typescript">type User = { name: string; };</code></pre>
        </div>
      `;

      // Step 1: Process HTML (like we do for Circle API content)
      const processed = processHtmlForDisplay(circleHtml, 'intro-lesson');

      // Step 2: Convert to markdown (like we do in markdown.astro endpoints)
      const markdown = htmlToMarkdown(processed.html);

      // Critical checks - markdown should be CLEAN
      expect(markdown).not.toContain('<!DOCTYPE');
      expect(markdown).not.toContain('<html>');
      expect(markdown).not.toContain('<head>');
      expect(markdown).not.toContain('<body>');
      expect(markdown).not.toContain('<meta'); // lesson-id meta should be stripped
      expect(markdown).not.toContain('loading="lazy"'); // HTML attributes should be gone

      // Should have proper markdown
      expect(markdown).toContain('## Lekcja'); // Heading
      expect(markdown).toContain('**podstawowe**'); // Bold
      expect(markdown).toContain('![Diagram typów]'); // Image with alt text
      expect(markdown).toContain('```'); // Code block
      expect(markdown).toContain('type User');

      // HTML entities should be decoded in content
      expect(markdown).toContain('"Wprowadzenie do TypeScript"');
      expect(markdown).not.toContain('&quot;');

      // Should not have excessive newlines
      expect(markdown).not.toContain('\n\n\n');
    });

    it('should handle lesson title with HTML entities for frontmatter', () => {
      const lessonTitle = '[5x1] Poszerzanie wiedzy modelu - LLMs.txt';
      const circleHtml = '<div><h1>Lesson content</h1><p>Some text</p></div>';

      // Process HTML
      const processed = processHtmlForDisplay(circleHtml, lessonTitle);
      const markdown = htmlToMarkdown(processed.html);

      // Simulate frontmatter generation (like in markdown.astro)
      const cleanTitle = sanitizeForYaml(lessonTitle);
      const frontmatter = `---
title: "${cleanTitle}"
course: "10xdevs-2"
source: "Przeprogramowani.pl"
exported: "2025-11-03"
format: "markdown"
---

${markdown}`;

      // Verify frontmatter is clean
      const lines = frontmatter.split('\n');

      // First line should be ---
      expect(lines[0]).toBe('---');

      // Title line should NOT contain &quot;
      const titleLine = lines.find(l => l.startsWith('title:'));
      expect(titleLine).toBeDefined();
      expect(titleLine).not.toContain('&quot;');
      expect(titleLine).not.toContain('&amp;');
      expect(titleLine).not.toContain('&lt;');
      expect(titleLine).not.toContain('&gt;');

      // Should have proper quotes
      expect(titleLine).toContain('"[5x1]');

      // Frontmatter should have opening and closing ---
      expect(frontmatter).toMatch(/^---\n/);
      expect(frontmatter).toContain('\n---\n');

      // Content should start after frontmatter
      expect(frontmatter).toContain('# Lesson content');
    });

    it('should produce markdown that starts with clean frontmatter, not DOCTYPE', () => {
      const html = '<div><h1>Title</h1><p>Content</p></div>';
      const processed = processHtmlForDisplay(html, 'Test Lesson');
      const markdown = htmlToMarkdown(processed.html);

      // When used in endpoint, markdown should be ready for frontmatter
      const withFrontmatter = `---
title: "Test Lesson"
---

${markdown}`;

      // Must start with ---
      expect(withFrontmatter.trim()).toMatch(/^---\ntitle:/);

      // Must NOT start with DOCTYPE
      expect(withFrontmatter).not.toMatch(/^<!DOCTYPE/);
      expect(withFrontmatter).not.toMatch(/^\s*<!DOCTYPE/);
    });
  });

  describe('Edge cases and regression prevention', () => {
    it('should handle empty or minimal HTML', () => {
      const result = processHtmlForDisplay('', 'empty');
      expect(result.html).not.toContain('<!DOCTYPE');
      expect(result.html).toContain('<meta name="lesson-id"');
    });

    it('should handle HTML with special characters', () => {
      const html = '<p>Special chars: &amp; &lt; &gt; &nbsp; &mdash;</p>';
      const result = processHtmlForDisplay(html, 'special');

      expect(result.html).not.toContain('<!DOCTYPE');
      // HTML entities should be preserved at this stage (decoded later by htmlToMarkdown)
      expect(result.html).toContain('Special chars');
    });

    it('should handle nested iframes and complex structures', () => {
      const html = `
        <div class="outer">
          <div class="inner">
            <iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F111"></iframe>
            <div class="text">
              <p>Text between iframes</p>
            </div>
            <iframe class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F222"></iframe>
          </div>
        </div>
      `;

      const result = processHtmlForDisplay(html, 'complex');

      expect(result.html).not.toContain('<!DOCTYPE');
      expect(result.html).not.toContain('<html>');
      expect(result.html).not.toContain('<body>');
      expect(result.html).toContain('Text between iframes');
    });

    it('should handle Polish characters throughout pipeline', () => {
      const html = '<div><h2>Tytuł z polskimi znakami: ąćęłńóśźż</h2><p>Treść lekcji o właściwościach.</p></div>';
      const processed = processHtmlForDisplay(html, '[Test] Tytuł z ąćęłńóśźż');
      const markdown = htmlToMarkdown(processed.html);

      // Polish chars should be preserved
      expect(markdown).toContain('ąćęłńóśźż');
      expect(markdown).toContain('właściwościach');

      // No DOCTYPE
      expect(markdown).not.toContain('<!DOCTYPE');
    });

    it('should ensure output never starts with DOCTYPE regardless of input', () => {
      const testCases = [
        '<!DOCTYPE html><p>Test</p>',
        '<html><body><p>Test</p></body></html>',
        '<p>Test</p>',
        '   <!DOCTYPE html>  <p>Test</p>',
      ];

      testCases.forEach(html => {
        const result = processHtmlForDisplay(html, 'doctype-test');

        // Should NEVER start with DOCTYPE
        expect(result.html.trim()).not.toMatch(/^<!DOCTYPE/);
        expect(result.html.trim()).not.toMatch(/^<html/);

        // Should start with meta tag
        expect(result.html.trim()).toMatch(/^<meta/);
      });
    });
  });
});
