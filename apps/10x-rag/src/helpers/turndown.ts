import TurndownService from 'turndown';

type HTMLElementLike = {
  textContent?: string | null;
  getAttribute?: (name: string) => string | null;
  firstChild?: HTMLElementLike;
};

export function buildTurndown(): TurndownService {
  const td = new TurndownService({
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
    bulletListMarker: '-', // stable
    emDelimiter: '_',
  });

  // Preserve tables
  // (Turndown handles basic tables if they are already table/thead/tbody/td/th)
  td.addRule('codePreserveLanguage', {
    filter: (node) => node.nodeName === 'PRE' && node.firstChild?.nodeName === 'CODE',
    replacement: (_content, node) => {
      const code = (node as HTMLElementLike).textContent ?? '';
      // Try to capture language from class="language-ts" etc.
      const className = (node.firstChild as HTMLElementLike)?.getAttribute?.('class') ?? '';
      const m = className.match(/language-([\w-]+)/i);
      const lang = m ? m[1] : '';
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    },
  });

  // Images → keep alt + src
  td.addRule('imageWithSrc', {
    filter: 'img',
    replacement: (_content, node) => {
      const el = node as HTMLElementLike;
      const alt = el.getAttribute?.('alt') ?? '';
      const src = el.getAttribute?.('src') ?? '';
      if (!src) return alt ? `![${alt}]()` : '';
      return `![${alt}](${src})`;
    },
  });

  // Iframes → link placeholder (keeps retrievable anchor without noisy embed HTML)
  td.addRule('iframeToLink', {
    filter: (node) => node.nodeName === 'IFRAME',
    replacement: (_content, node) => {
      const src = (node as HTMLElementLike).getAttribute?.('src') ?? '';
      return src ? `\n[Embed: ${src}]\n` : '';
    },
  });

  // Drop scripts/styles
  // (We already remove them in DOM stage, but this is a safeguard.)
  td.addRule('dropScriptsStyles', {
    filter: (node) => ['SCRIPT', 'STYLE'].includes(node.nodeName),
    replacement: () => '',
  });

  return td;
}
