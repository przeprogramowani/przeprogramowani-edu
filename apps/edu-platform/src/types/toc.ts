/**
 * Represents a single heading in the table of contents
 */
export interface TocItem {
  /** Unique ID for the heading (used for anchor links) */
  id: string;

  /** Display text of the heading */
  text: string;

  /** Heading level (1-6) */
  level: number;

  /** Nested child headings */
  children: TocItem[];

  /** Parent heading ID (null for top-level) */
  parentId: string | null;
}

/**
 * Configuration for TOC extraction
 */
export interface TocConfig {
  /** Minimum heading level to include (default: 1) */
  minLevel?: number;

  /** Maximum heading level to include (default: 6) */
  maxLevel?: number;

  /** Whether to generate IDs for headings without them (default: true) */
  autoGenerateIds?: boolean;

  /** Prefix for auto-generated IDs (default: 'heading-') */
  idPrefix?: string;
}

/**
 * Result of heading extraction from HTML
 */
export interface HtmlExtractionResult {
  /** Flat list of extracted headings */
  headings: TocItem[];

  /** Modified HTML with IDs added to headings */
  modifiedHtml: string;
}

/**
 * Complete TOC extraction result with hierarchy
 */
export interface TocExtractionResult {
  /** Flat list of all headings */
  flatHeadings: TocItem[];

  /** Hierarchical tree structure */
  tree: TocItem[];

  /** Map of heading ID to TocItem for quick lookup */
  headingMap: Map<string, TocItem>;
}
