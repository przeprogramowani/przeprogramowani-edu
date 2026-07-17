import { htmlLessonLoader, type HtmlLessonEntry } from './htmlLessonLoader';
import { markdownLessonLoader, type MarkdownLessonEntry } from './markdownLessonLoader';

type LocalLessonSource = 'markdown' | 'html';

export interface MixedLocalLessonLoaderOptions {
  markdownPattern: string;
  htmlPattern: string;
}

export type MixedLocalLessonEntry = (MarkdownLessonEntry | HtmlLessonEntry) & {
  source: LocalLessonSource;
};

function withSource<T extends MarkdownLessonEntry | HtmlLessonEntry>(
  entry: T,
  source: LocalLessonSource
): T & { source: LocalLessonSource } {
  return {
    ...entry,
    source,
  };
}

function assertUniqueLessonIds(entries: MixedLocalLessonEntry[]): void {
  const seenById = new Map<string, LocalLessonSource>();

  for (const entry of entries) {
    const previousSource = seenById.get(entry.id);
    if (previousSource) {
      throw new Error(
        `Duplicate local lesson id "${entry.id}" found in ${previousSource} and ${entry.source} entries`
      );
    }

    seenById.set(entry.id, entry.source);
  }
}

export async function mixedLocalLessonLoader({
  markdownPattern,
  htmlPattern,
}: MixedLocalLessonLoaderOptions): Promise<MixedLocalLessonEntry[]> {
  const [markdownEntries, htmlEntries] = await Promise.all([
    markdownLessonLoader(markdownPattern),
    htmlLessonLoader(htmlPattern),
  ]);
  const entries = [
    ...markdownEntries.map((entry) => withSource(entry, 'markdown')),
    ...htmlEntries.map((entry) => withSource(entry, 'html')),
  ];

  assertUniqueLessonIds(entries);

  return entries.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export const __testUtils = {
  assertUniqueLessonIds,
};
