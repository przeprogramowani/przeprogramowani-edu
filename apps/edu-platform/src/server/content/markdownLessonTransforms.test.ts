/* @vitest-environment jsdom */

import { describe, expect, it } from 'vitest';
import {
  extractLeadingHeading,
  parseFrontmatter,
  parseMarkdownLesson,
  renderMarkdown,
  stripLeadingH1,
} from './markdownLessonTransforms';

describe('markdown lesson frontmatter transforms', () => {
  it('parses YAML frontmatter and returns markdown body', () => {
    const source = `---
title: "[1.1] Test lesson"
hidden: true
---

# Heading

Body`;

    const result = parseFrontmatter(source);

    expect(result.data).toEqual({
      title: '[1.1] Test lesson',
      hidden: true,
    });
    expect(result.body).toContain('# Heading');
    expect(result.body).toContain('Body');
  });

  it('extracts a leading markdown heading as fallback title', () => {
    const heading = extractLeadingHeading(`
# Title from markdown

## Section
`);

    expect(heading).toBe('Title from markdown');
  });

  it('strips the first H1 so the page does not render a duplicate title', () => {
    const stripped = stripLeadingH1(`# Page Title

First paragraph.

## Section
`);

    expect(stripped).toBe(`First paragraph.

## Section
`);
  });

  it('parses a complete markdown lesson with title and rendered HTML', async () => {
    const lesson = await parseMarkdownLesson(
      'lesson.md',
      `---
title: "Frontmatter title"
lessonId: "01"
---

# Body title

Body`
    );

    expect(lesson).toMatchObject({
      sourcePath: 'lesson.md',
      title: 'Frontmatter title',
      frontmatter: {
        title: 'Frontmatter title',
        lessonId: '01',
      },
      bodyMarkdown: 'Body',
      bodyHtml: '<p>Body</p>',
    });
  });
});

describe('markdown lesson HTML rendering', () => {
  it('renders mermaid fences as raw diagram containers', async () => {
    const html = await renderMarkdown('```mermaid\ngraph TD;\n  A-->B;\n```\n');

    expect(html).toContain('<pre class="mermaid" data-language="mermaid">graph TD;');
    expect(html).not.toContain('<code class="language-mermaid">');
  });

  it('leaves non-mermaid code blocks untouched', async () => {
    const html = await renderMarkdown('```ts\nconst x = 1;\n```\n');

    expect(html).not.toContain('class="mermaid"');
    expect(html).toContain('class="language-ts"');
  });

  it('handles multiple mermaid fences in one document', async () => {
    const html = await renderMarkdown(
      '```mermaid\ngraph TD;\n  A-->B;\n```\n\n# Heading\n\n```mermaid\nsequenceDiagram\n  A->>B: hi\n```\n'
    );

    const matches = html.match(/<pre class="mermaid" data-language="mermaid">/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it('preserves trusted raw HTML inside markdown', async () => {
    const html = await renderMarkdown('<section class="note"><strong>Important</strong></section>');

    expect(html).toContain('<section class="note"><strong>Important</strong></section>');
  });
});
