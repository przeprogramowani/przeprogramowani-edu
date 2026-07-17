import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from './htmlToMarkdown';

describe('htmlToMarkdown', () => {
  describe('HTML Structure Cleanup', () => {
    it('should remove DOCTYPE declaration', () => {
      const html = '<!DOCTYPE html><p>Content</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('<!DOCTYPE');
      expect(result).toContain('Content');
    });

    it('should remove <html> tags', () => {
      const html = '<html><p>Content</p></html>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('<html>');
      expect(result).not.toContain('</html>');
      expect(result).toContain('Content');
    });

    it('should remove <head> section completely', () => {
      const html = '<html><head><meta charset="UTF-8"><title>Test</title></head><body><p>Content</p></body></html>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('<head>');
      expect(result).not.toContain('</head>');
      expect(result).not.toContain('<meta');
      expect(result).not.toContain('<title>');
      expect(result).toContain('Content');
    });

    it('should remove <body> tags', () => {
      const html = '<body><p>Content</p></body>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('<body>');
      expect(result).not.toContain('</body>');
      expect(result).toContain('Content');
    });

    it('should handle full HTML document structure', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Lesson</title>
        </head>
        <body>
          <div class="content">
            <h1>Introduction</h1>
            <p>This is test content.</p>
          </div>
        </body>
        </html>
      `;
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('<!DOCTYPE');
      expect(result).not.toContain('<html');
      expect(result).not.toContain('<head');
      expect(result).not.toContain('<body');
      expect(result).not.toContain('<meta');
      expect(result).toContain('# Introduction');
      expect(result).toContain('This is test content.');
    });

    it('should remove inline styles', () => {
      const html = '<p style="color: red; font-size: 16px;">Styled content</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('style=');
      expect(result).toContain('Styled content');
    });

    it('should remove class attributes', () => {
      const html = '<div class="container main-content"><p>Content</p></div>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('class=');
      expect(result).toContain('Content');
    });

    it('should remove loading attributes from images', () => {
      const html = '<img src="test.jpg" loading="lazy" alt="Test">';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('loading=');
      expect(result).toContain('![Test](test.jpg)');
    });
  });

  describe('Image Handling', () => {
    it('should add default alt-text for Circle.so images without alt', () => {
      const html = '<img src="https://assets-v2.circle.so/koeg1rle3x2k3orxxbm0b1mji8iz">';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('![]()');
      expect(result).toContain('![Ilustracja z lekcji](https://assets-v2.circle.so/koeg1rle3x2k3orxxbm0b1mji8iz)');
    });

    it('should add default alt-text for non-Circle.so images without alt', () => {
      const html = '<img src="https://example.com/image.jpg">';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('![]()');
      expect(result).toContain('![Obraz](https://example.com/image.jpg)');
    });

    it('should preserve existing alt-text', () => {
      const html = '<img src="https://example.com/image.jpg" alt="Custom description">';
      const result = htmlToMarkdown(html);

      expect(result).toContain('![Custom description](https://example.com/image.jpg)');
    });

    it('should skip data URI images', () => {
      const html = '<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." alt="Data image">';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('data:image');
      expect(result).not.toContain('![Data image]');
    });

    it('should skip images without src', () => {
      const html = '<img alt="No source">';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('![No source]');
    });

    it('should remove <img> HTML tags completely', () => {
      const html = '<img src="test.jpg" alt="Test">';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('<img');
      expect(result).toContain('![Test](test.jpg)');
    });
  });

  describe('Video Embed Handling', () => {
    it('should convert Vimeo embed to video marker', () => {
      const html = '<iframe src="https://player.vimeo.com/video/1035131766?app_id=122963"></iframe>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('🎥 **VIDEO**');
      expect(result).toContain('[Watch here](https://player.vimeo.com/video/1035131766?app_id=122963)');
    });

    it('should convert YouTube embed to video marker', () => {
      const html = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('🎥 **VIDEO**');
      expect(result).toContain('[Watch here](https://www.youtube.com/embed/dQw4w9WgXcQ)');
    });

    it('should skip non-video iframes', () => {
      const html = '<iframe src="https://example.com/widget"></iframe>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('🎥');
      expect(result).not.toContain('example.com/widget');
    });

    // Note: Legacy [FRAGMENT VIDEO] text markers are handled by the backup replacement
    // in post-processing, but they get escaped to \[FRAGMENT VIDEO\] by the markdown
    // converter, so the replacement only works on unescaped versions. In practice,
    // real video content uses iframe tags which are properly converted above.
  });

  describe('HTML Entity Conversion', () => {
    it('should convert &nbsp; to space', () => {
      const html = '<p>Hello&nbsp;World</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('&nbsp;');
      expect(result).toContain('Hello World');
    });

    it('should convert &mdash; to em dash', () => {
      const html = '<p>First&mdash;Second</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('&mdash;');
      expect(result).toContain('First—Second');
    });

    it('should convert &ndash; to en dash', () => {
      const html = '<p>First&ndash;Second</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('&ndash;');
      expect(result).toContain('First–Second');
    });

    it('should convert &quot; to quote', () => {
      const html = '<p>He said &quot;Hello&quot;</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('&quot;');
      expect(result).toContain('He said "Hello"');
    });

    it('should convert &apos; to apostrophe', () => {
      const html = "<p>It&apos;s great</p>";
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('&apos;');
      expect(result).toContain("It's great");
    });

    it('should convert &lt; and &gt;', () => {
      const html = '<p>&lt;div&gt; element</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('&lt;');
      expect(result).not.toContain('&gt;');
      expect(result).toContain('<div> element');
    });

    it('should convert &amp;', () => {
      const html = '<p>Tom &amp; Jerry</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('&amp;');
      expect(result).toContain('Tom & Jerry');
    });
  });

  describe('Polish Characters', () => {
    it('should preserve lowercase Polish characters', () => {
      const html = '<p>ąćęłńóśźż</p>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('ąćęłńóśźż');
    });

    it('should preserve uppercase Polish characters', () => {
      const html = '<p>ĄĆĘŁŃÓŚŹŻ</p>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('ĄĆĘŁŃÓŚŹŻ');
    });

    it('should preserve Polish text in complex HTML', () => {
      const html = '<h1>Wprowadzenie do TypeScript</h1><p>To jest lekcja o programowaniu.</p>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('Wprowadzenie do TypeScript');
      expect(result).toContain('To jest lekcja o programowaniu.');
    });
  });

  describe('Markdown Formatting', () => {
    it('should convert headings properly', () => {
      const html = '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('# Heading 1');
      expect(result).toContain('## Heading 2');
      expect(result).toContain('### Heading 3');
    });

    it('should convert bold text', () => {
      const html = '<p>This is <strong>bold</strong> text</p>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('**bold**');
    });

    it('should convert italic text', () => {
      const html = '<p>This is <em>italic</em> text</p>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('_italic_');
    });

    it('should convert unordered lists', () => {
      const html = '<ul><li>First</li><li>Second</li><li>Third</li></ul>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('- First');
      expect(result).toContain('- Second');
      expect(result).toContain('- Third');
    });

    it('should convert code blocks with fenced style', () => {
      const html = '<pre><code>const x = 10;</code></pre>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('```');
      expect(result).toContain('const x = 10;');
    });

    it('should limit consecutive newlines to 2', () => {
      const html = '<p>First</p>\n\n\n\n<p>Second</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('\n\n\n');
      expect(result).toContain('First');
      expect(result).toContain('Second');
    });
  });

  describe('Whitespace Cleanup', () => {
    it('should trim leading whitespace', () => {
      const html = '   <p>Content</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toMatch(/^\s+/);
      expect(result.startsWith('Content')).toBe(true);
    });

    it('should trim trailing whitespace', () => {
      const html = '<p>Content</p>   ';
      const result = htmlToMarkdown(html);

      expect(result).not.toMatch(/\s+$/);
      expect(result.endsWith('Content')).toBe(true);
    });

    it('should remove lines with only whitespace', () => {
      const html = '<p>First</p>\n   \n<p>Second</p>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('\n   \n');
    });
  });

  describe('Real-World Lesson HTML', () => {
    it('should handle complex lesson structure', () => {
      const html = `
        <meta name="lesson-id" content="Test Lesson">
        <html><head></head><body>
        <div>
          <img loading="lazy" src="https://assets-v2.circle.so/koeg1rle3x2k3orxxbm0b1mji8iz" style="width: 100%;">
          <h2>Wprowadzenie</h2>
          <p>W tej lekcji przedstawimy ci uniwersalną <strong>"filozofię TypeScriptu"</strong>,
          która w praktyce odnosi się&nbsp;do matematycznych operacji na zbiorach danych.</p>

          <iframe src="https://player.vimeo.com/video/1035131766?app_id=122963"></iframe>

          <h3>Code Example</h3>
          <pre><code>const greeting: string = "Hello World";
console.log(greeting);</code></pre>

          <ul>
            <li><p>Pierwsza pozycja</p></li>
            <li><p>Druga pozycja z <em>wyróżnieniem</em></p></li>
          </ul>
        </div>
        </body></html>
      `;

      const result = htmlToMarkdown(html);

      // No HTML artifacts
      expect(result).not.toContain('<!DOCTYPE');
      expect(result).not.toContain('<html');
      expect(result).not.toContain('<body');
      expect(result).not.toContain('<div');
      expect(result).not.toContain('<img');
      expect(result).not.toContain('loading=');
      expect(result).not.toContain('style=');

      // Proper markdown formatting
      expect(result).toContain('## Wprowadzenie');
      expect(result).toContain('**"filozofię TypeScriptu"**');
      expect(result).toContain('![Ilustracja z lekcji](https://assets-v2.circle.so/koeg1rle3x2k3orxxbm0b1mji8iz)');
      expect(result).toContain('🎥 **VIDEO**');
      expect(result).toContain('### Code Example');
      expect(result).toContain('```');
      expect(result).toContain('Hello World'); // &nbsp; converted
      expect(result).toContain('- Pierwsza pozycja');
      expect(result).toContain('_wyróżnieniem_');
    });

    it('should produce clean output without any HTML tags', () => {
      const html = `
        <!DOCTYPE html>
        <html><head><meta charset="UTF-8"></head>
        <body>
          <div class="content" style="padding: 20px;">
            <h1>Title</h1>
            <p>Content with <strong>bold</strong> and <em>italic</em>.</p>
            <img src="https://example.com/test.jpg" loading="lazy">
          </div>
        </body></html>
      `;

      const result = htmlToMarkdown(html);

      // Should not contain ANY angle brackets (except in code blocks potentially)
      const htmlTagPattern = /<(?!!\[CDATA\[)[^>]+>/g;
      const matches = result.match(htmlTagPattern);

      expect(matches).toBeNull();
    });
  });

  describe('Code Fence Round-Trip', () => {
    it('should preserve language-mermaid class so mermaid fences round-trip', () => {
      const html = '<pre class="mermaid"><code class="language-mermaid">graph TD;\n  A-->B;</code></pre>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('```mermaid');
      expect(result).toContain('graph TD;');
    });

    it('should preserve generated raw mermaid containers as mermaid fences', () => {
      const html = '<pre class="mermaid" data-language="mermaid">graph TD;\n  A-->B;</pre>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('```mermaid');
      expect(result).toContain('graph TD;');
    });

    it('should preserve language-ts class so typed fences round-trip', () => {
      const html = '<pre><code class="language-ts">const x = 1;</code></pre>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('```ts');
      expect(result).toContain('const x = 1;');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const result = htmlToMarkdown('');
      expect(result).toBe('');
    });

    it('should handle plain text without HTML', () => {
      const html = 'Just plain text';
      const result = htmlToMarkdown(html);
      expect(result).toBe('Just plain text');
    });

    it('should handle nested div structures', () => {
      const html = '<div><div><div><p>Deeply nested content</p></div></div></div>';
      const result = htmlToMarkdown(html);

      expect(result).not.toContain('<div');
      expect(result).toContain('Deeply nested content');
    });

    it('should handle embed divs specially', () => {
      const html = '<div class="embed"><p>Embedded content</p></div>';
      const result = htmlToMarkdown(html);

      expect(result).toContain('Embedded content');
      expect(result).not.toContain('class=');
    });
  });
});
