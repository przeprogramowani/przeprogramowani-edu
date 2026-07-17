import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { parse as parseYaml } from 'yaml';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

export interface LessonFrontmatter {
  title?: string;
  titleEn?: string;
  hidden?: boolean;
  lessonId?: string;
  language?: 'pl' | 'en';
  order?: number;
  slug?: string;
}

export interface ParsedFrontmatter {
  data: LessonFrontmatter;
  body: string;
}

export interface ParsedMarkdownLesson {
  sourcePath: string;
  frontmatter: LessonFrontmatter;
  title: string;
  bodyMarkdown: string;
  bodyHtml: string;
}

export function parseFrontmatter(source: string): ParsedFrontmatter {
  const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!frontmatterMatch) {
    return {
      data: {},
      body: source,
    };
  }

  const [, yamlBlock] = frontmatterMatch;
  const parsed = parseYaml(yamlBlock) as LessonFrontmatter | null;

  return {
    data: parsed ?? {},
    body: source.slice(frontmatterMatch[0].length),
  };
}

export function extractLeadingHeading(markdown: string): string | null {
  const headingMatch = markdown.match(/^\s*#\s+(.+?)\s*$/m);
  return headingMatch ? headingMatch[1].trim() : null;
}

export function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#\s+.+?\r?\n+/, '').trimStart();
}

function rehypeMermaidContainer() {
  return (tree: Root) => {
    visit(tree, 'element', (preNode: Element) => {
      if (preNode.tagName !== 'pre') return;

      const codeNode = preNode.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code'
      );
      if (!codeNode) return;

      const classNames = Array.isArray(codeNode.properties?.className)
        ? (codeNode.properties!.className as string[])
        : [];
      if (!classNames.includes('language-mermaid')) return;

      // Mermaid expects the raw diagram DSL directly inside the target element.
      const preClasses = Array.isArray(preNode.properties?.className)
        ? [...(preNode.properties!.className as string[])]
        : [];
      preNode.properties = {
        ...preNode.properties,
        className: [...preClasses.filter((className) => className !== 'mermaid'), 'mermaid'],
        dataLanguage: 'mermaid',
      };
      preNode.children = codeNode.children;
    });
  };
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const rendered = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeMermaidContainer)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(rendered).trim();
}

export async function parseMarkdownLesson(
  sourcePath: string,
  source: string
): Promise<ParsedMarkdownLesson> {
  const { data, body } = parseFrontmatter(source);
  const bodyMarkdown = stripLeadingH1(body);
  const title = data.title?.trim() || extractLeadingHeading(body) || '';
  const bodyHtml = await renderMarkdown(bodyMarkdown);

  return {
    sourcePath,
    frontmatter: data,
    title,
    bodyMarkdown,
    bodyHtml,
  };
}
