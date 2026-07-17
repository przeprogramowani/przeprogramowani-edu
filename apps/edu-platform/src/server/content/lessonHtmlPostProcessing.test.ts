import { describe, expect, it } from 'vitest';
import { replaceMermaidWithCdnImages, injectPreworkLinks, PREWORK_BASE_URL } from './lessonHtmlPostProcessing';

describe('replaceMermaidWithCdnImages', () => {
  it('replaces mermaid pre + rendered + cdn-10x with img tag', () => {
    const html = [
      '<p>Before</p>',
      '<pre class="mermaid" data-language="mermaid">flowchart LR',
      '    A-->B',
      '</pre>',
      '<!-- rendered: ../../assets/diagrams/d1.png | cdn: https://images.przeprogramowani.pl/diagrams/d1.png -->',
      '<!-- cdn-10x: https://images.przeprogramowani.pl/diagrams/d1-10x.png -->',
      '<p>After</p>',
    ].join('\n');

    const result = replaceMermaidWithCdnImages(html);

    expect(result).toBe(
      '<p>Before</p>\n<img src="https://images.przeprogramowani.pl/diagrams/d1-10x.png" alt="Diagram">\n<p>After</p>'
    );
  });

  it('falls back to cdn URL when cdn-10x comment is absent', () => {
    const html = [
      '<pre class="mermaid" data-language="mermaid">graph TD; A-->B;</pre>',
      '<!-- rendered: path.png | cdn: https://images.przeprogramowani.pl/diagrams/fallback.png -->',
    ].join('\n');

    const result = replaceMermaidWithCdnImages(html);

    expect(result).toBe('<img src="https://images.przeprogramowani.pl/diagrams/fallback.png" alt="Diagram">');
  });

  it('leaves mermaid blocks without CDN comments untouched', () => {
    const html = '<pre class="mermaid" data-language="mermaid">graph TD; A-->B;</pre>\n<p>Next</p>';

    const result = replaceMermaidWithCdnImages(html);

    expect(result).toBe(html);
  });

  it('handles multiple mermaid blocks in sequence', () => {
    const html = [
      '<pre class="mermaid" data-language="mermaid">graph 1</pre>',
      '<!-- rendered: d1.png | cdn: https://cdn/d1.png -->',
      '<!-- cdn-10x: https://cdn/d1-10x.png -->',
      '<p>gap</p>',
      '<pre class="mermaid" data-language="mermaid">graph 2</pre>',
      '<!-- rendered: d2.png | cdn: https://cdn/d2.png -->',
      '<!-- cdn-10x: https://cdn/d2-10x.png -->',
    ].join('\n');

    const result = replaceMermaidWithCdnImages(html);

    expect(result).toBe(
      '<img src="https://cdn/d1-10x.png" alt="Diagram">\n<p>gap</p>\n<img src="https://cdn/d2-10x.png" alt="Diagram">'
    );
  });

  it('handles multiline pre content with HTML entities', () => {
    const html = [
      '<pre class="mermaid" data-language="mermaid">flowchart LR',
      '    A["prd.md&#x3C;br/>&#x3C;small>M1L1&#x3C;/small>"] --> B["tech-stack.md"]',
      '',
      '    style A fill:#1e293b,stroke:#3b82f6,color:#e2e8f0',
      '</pre>',
      '<!-- rendered: ../../assets/diagrams/d.png | cdn: https://cdn/d.png -->',
      '<!-- cdn-10x: https://cdn/d-10x.png -->',
    ].join('\n');

    const result = replaceMermaidWithCdnImages(html);

    expect(result).toBe('<img src="https://cdn/d-10x.png" alt="Diagram">');
  });

  it('does not match pre blocks without mermaid class', () => {
    const html = [
      '<pre><code>some code</code></pre>',
      '<!-- cdn-10x: https://cdn/should-not-match.png -->',
    ].join('\n');

    const result = replaceMermaidWithCdnImages(html);

    expect(result).toBe(html);
  });
});

describe('injectPreworkLinks', () => {
  const base = 'https://platforma.przeprogramowani.pl';

  it('wraps known bracket ID in an anchor tag', () => {
    const html = '<p>W preworku [3.2] omówiliśmy to.</p>';

    const result = injectPreworkLinks(html, 'pl', base);

    expect(result).toBe(
      `<p>W preworku <a href="${base}/external/10xdevs-3-prework/pl/10">[3.2]</a> omówiliśmy to.</p>`
    );
  });

  it('handles multiple brackets in one sentence', () => {
    const html = '<p>Z preworku [3.1] i [3.3] wiesz to.</p>';

    const result = injectPreworkLinks(html, 'pl', base);

    expect(result).toContain(`<a href="${base}/external/10xdevs-3-prework/pl/09">[3.1]</a>`);
    expect(result).toContain(`<a href="${base}/external/10xdevs-3-prework/pl/11">[3.3]</a>`);
  });

  it('leaves unknown bracket IDs as plain text', () => {
    const html = '<p>Patrz [9.9] i [0.0].</p>';

    const result = injectPreworkLinks(html, 'pl', base);

    expect(result).toBe(html);
  });

  it('does not double-wrap brackets already inside an anchor', () => {
    const html = `<p>Patrz <a href="/somewhere">[3.2]</a> tutaj.</p>`;

    const result = injectPreworkLinks(html, 'pl', base);

    expect(result).toBe(html);
  });

  it('is idempotent — running twice produces the same output', () => {
    const html = '<p>W preworku [3.2] omówiliśmy.</p>';

    const first = injectPreworkLinks(html, 'pl', base);
    const second = injectPreworkLinks(first, 'pl', base);

    expect(second).toBe(first);
  });

  it('uses English language path when specified', () => {
    const html = '<p>See prework [1.2] for details.</p>';

    const result = injectPreworkLinks(html, 'en', base);

    expect(result).toBe(
      `<p>See prework <a href="${base}/external/10xdevs-3-prework/en/02">[1.2]</a> for details.</p>`
    );
  });

  it('wraps bracket inside a list item', () => {
    const html = '<li>Prework [2.3] <em>Claude Code</em> — opis.</li>';

    const result = injectPreworkLinks(html, 'pl', base);

    expect(result).toBe(
      `<li>Prework <a href="${base}/external/10xdevs-3-prework/pl/06">[2.3]</a> <em>Claude Code</em> — opis.</li>`
    );
  });

  it('handles all known bracket IDs', () => {
    const ids = ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '2.4', '3.1', '3.2', '3.3', '3.4', '3.5', '4.1', '4.2', '4.3'];

    for (const id of ids) {
      const html = `<p>[${id}]</p>`;
      const result = injectPreworkLinks(html, 'pl', base);
      expect(result).toContain(`<a href="${base}/external/10xdevs-3-prework/pl/`);
      expect(result).toContain(`[${id}]</a>`);
    }
  });
});
