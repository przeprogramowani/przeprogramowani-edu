import { describe, it, expect } from 'vitest';
import {
  buildTocHierarchy,
  buildTocMap,
  buildCompleteToc,
} from './buildTocHierarchy';
import type { TocItem } from '@/types/toc';

describe('buildTocHierarchy', () => {
  describe('Basic Hierarchy Building', () => {
    it('should build nested structure from flat list', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H1', level: 1, children: [], parentId: null },
        { id: '2', text: 'H2', level: 2, children: [], parentId: null },
        { id: '3', text: 'H3', level: 3, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(1); // One root element
      expect(tree[0].id).toBe('1');
      expect(tree[0].children).toHaveLength(1); // H1 has one child (H2)
      expect(tree[0].children[0].id).toBe('2');
      expect(tree[0].children[0].children).toHaveLength(1); // H2 has one child (H3)
      expect(tree[0].children[0].children[0].id).toBe('3');
    });

    it('should handle multiple root headings', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H1-A', level: 1, children: [], parentId: null },
        { id: '2', text: 'H1-B', level: 1, children: [], parentId: null },
        { id: '3', text: 'H1-C', level: 1, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(3);
      expect(tree[0].id).toBe('1');
      expect(tree[1].id).toBe('2');
      expect(tree[2].id).toBe('3');
    });

    it('should handle siblings at same level', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H1', level: 1, children: [], parentId: null },
        { id: '2', text: 'H2-A', level: 2, children: [], parentId: null },
        { id: '3', text: 'H2-B', level: 2, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(1);
      expect(tree[0].children).toHaveLength(2);
      expect(tree[0].children[0].id).toBe('2');
      expect(tree[0].children[1].id).toBe('3');
    });
  });

  describe('Parent ID Assignment', () => {
    it('should set parentId for nested headings', () => {
      const flat: TocItem[] = [
        { id: 'h1', text: 'H1', level: 1, children: [], parentId: null },
        { id: 'h2', text: 'H2', level: 2, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree[0].parentId).toBeNull();
      expect(tree[0].children[0].parentId).toBe('h1');
    });

    it('should set correct parentId for multiple levels', () => {
      const flat: TocItem[] = [
        { id: 'h1', text: 'H1', level: 1, children: [], parentId: null },
        { id: 'h2', text: 'H2', level: 2, children: [], parentId: null },
        { id: 'h3', text: 'H3', level: 3, children: [], parentId: null },
        { id: 'h4', text: 'H4', level: 4, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      const h2 = tree[0].children[0];
      const h3 = h2.children[0];
      const h4 = h3.children[0];

      expect(h2.parentId).toBe('h1');
      expect(h3.parentId).toBe('h2');
      expect(h4.parentId).toBe('h3');
    });
  });

  describe('Irregular Nesting', () => {
    it('should handle skip levels (H1 -> H4)', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H1', level: 1, children: [], parentId: null },
        { id: '2', text: 'H4', level: 4, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(1);
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].id).toBe('2'); // H4 is child of H1
      expect(tree[0].children[0].parentId).toBe('1');
    });

    it('should handle jump back to lower level', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H1', level: 1, children: [], parentId: null },
        { id: '2', text: 'H2', level: 2, children: [], parentId: null },
        { id: '3', text: 'H4', level: 4, children: [], parentId: null },
        { id: '4', text: 'H2-B', level: 2, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(1);
      expect(tree[0].children).toHaveLength(2); // Two H2s
      expect(tree[0].children[0].children).toHaveLength(1); // First H2 has H4 child
      expect(tree[0].children[1].id).toBe('4'); // Second H2
      expect(tree[0].children[1].parentId).toBe('1');
    });

    it('should handle complex irregular nesting', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H2', level: 2, children: [], parentId: null },
        { id: '2', text: 'H4', level: 4, children: [], parentId: null },
        { id: '3', text: 'H1', level: 1, children: [], parentId: null },
        { id: '4', text: 'H5', level: 5, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(2); // H2 and H1 are roots
      expect(tree[0].id).toBe('1'); // H2 first
      expect(tree[0].children[0].id).toBe('2'); // H4 child of H2
      expect(tree[1].id).toBe('3'); // H1 second
      expect(tree[1].children[0].id).toBe('4'); // H5 child of H1
    });
  });

  describe('Real-World Structures', () => {
    it('should handle typical checklist structure', () => {
      const flat: TocItem[] = [
        { id: 'title', text: 'Checklista Modułu 2', level: 1, children: [], parentId: null },
        { id: 'toc', text: 'Spis treści', level: 2, children: [], parentId: null },
        { id: '2x1', text: '[2x1] Planowanie projektu', level: 2, children: [], parentId: null },
        { id: 'step1', text: 'Krok 1', level: 4, children: [], parentId: null },
        { id: 'step2', text: 'Krok 2', level: 4, children: [], parentId: null },
        { id: '2x2', text: '[2x2] Konfiguracja', level: 2, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(1); // One H1
      expect(tree[0].children).toHaveLength(3); // Three H2s
      expect(tree[0].children[1].children).toHaveLength(2); // [2x1] has two H4s
      expect(tree[0].children[1].children[0].id).toBe('step1');
      expect(tree[0].children[1].children[1].id).toBe('step2');
    });

    it('should handle document with multiple top-level sections', () => {
      const flat: TocItem[] = [
        { id: 'intro', text: 'Introduction', level: 1, children: [], parentId: null },
        { id: 'overview', text: 'Overview', level: 2, children: [], parentId: null },
        { id: 'main', text: 'Main Content', level: 1, children: [], parentId: null },
        { id: 'section1', text: 'Section 1', level: 2, children: [], parentId: null },
        { id: 'section2', text: 'Section 2', level: 2, children: [], parentId: null },
        { id: 'conclusion', text: 'Conclusion', level: 1, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(3); // Three H1s
      expect(tree[0].children).toHaveLength(1); // Intro has 1 child
      expect(tree[1].children).toHaveLength(2); // Main has 2 children
      expect(tree[2].children).toHaveLength(0); // Conclusion has no children
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      const flat: TocItem[] = [];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(0);
    });

    it('should handle single heading', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H1', level: 1, children: [], parentId: null },
      ];
      const tree = buildTocHierarchy(flat);

      expect(tree).toHaveLength(1);
      expect(tree[0].id).toBe('1');
      expect(tree[0].children).toHaveLength(0);
    });

    it('should not mutate original array', () => {
      const flat: TocItem[] = [
        { id: '1', text: 'H1', level: 1, children: [], parentId: null },
        { id: '2', text: 'H2', level: 2, children: [], parentId: null },
      ];
      const originalFlat = JSON.parse(JSON.stringify(flat));

      buildTocHierarchy(flat);

      expect(flat).toEqual(originalFlat);
    });
  });
});

describe('buildTocMap', () => {
  it('should create map with heading IDs as keys', () => {
    const flat: TocItem[] = [
      { id: 'h1', text: 'H1', level: 1, children: [], parentId: null },
      { id: 'h2', text: 'H2', level: 2, children: [], parentId: null },
    ];
    const map = buildTocMap(flat);

    expect(map.size).toBe(2);
    expect(map.get('h1')).toBeDefined();
    expect(map.get('h2')).toBeDefined();
    expect(map.get('h1')?.text).toBe('H1');
  });

  it('should handle empty array', () => {
    const flat: TocItem[] = [];
    const map = buildTocMap(flat);

    expect(map.size).toBe(0);
  });

  it('should allow quick lookup by ID', () => {
    const flat: TocItem[] = [
      { id: 'intro', text: 'Introduction', level: 1, children: [], parentId: null },
      { id: 'main', text: 'Main Content', level: 1, children: [], parentId: null },
      { id: 'conclusion', text: 'Conclusion', level: 1, children: [], parentId: null },
    ];
    const map = buildTocMap(flat);

    const mainHeading = map.get('main');
    expect(mainHeading).toBeDefined();
    expect(mainHeading?.text).toBe('Main Content');
  });
});

describe('buildCompleteToc', () => {
  it('should return complete TOC result', () => {
    const flat: TocItem[] = [
      { id: '1', text: 'H1', level: 1, children: [], parentId: null },
      { id: '2', text: 'H2', level: 2, children: [], parentId: null },
    ];
    const result = buildCompleteToc(flat);

    expect(result.flatHeadings).toEqual(flat);
    expect(result.tree).toHaveLength(1);
    expect(result.tree[0].children).toHaveLength(1);
    expect(result.headingMap.size).toBe(2);
  });

  it('should have consistent data across all properties', () => {
    const flat: TocItem[] = [
      { id: 'h1', text: 'H1', level: 1, children: [], parentId: null },
      { id: 'h2', text: 'H2', level: 2, children: [], parentId: null },
      { id: 'h3', text: 'H3', level: 3, children: [], parentId: null },
    ];
    const result = buildCompleteToc(flat);

    // All headings should be in flat list
    expect(result.flatHeadings).toHaveLength(3);

    // All headings should be in map
    expect(result.headingMap.size).toBe(3);

    // Tree should have proper structure
    expect(result.tree).toHaveLength(1);
    expect(result.tree[0].id).toBe('h1');
  });

  it('should handle complex real-world structure', () => {
    const flat: TocItem[] = [
      { id: 'title', text: 'Main Title', level: 1, children: [], parentId: null },
      { id: 'section1', text: 'Section 1', level: 2, children: [], parentId: null },
      { id: 'subsection1', text: 'Subsection 1', level: 3, children: [], parentId: null },
      { id: 'section2', text: 'Section 2', level: 2, children: [], parentId: null },
      { id: 'step1', text: 'Step 1', level: 4, children: [], parentId: null },
    ];
    const result = buildCompleteToc(flat);

    expect(result.flatHeadings).toHaveLength(5);
    expect(result.headingMap.size).toBe(5);
    expect(result.tree).toHaveLength(1);
    expect(result.tree[0].children).toHaveLength(2); // Two sections
    expect(result.tree[0].children[0].children).toHaveLength(1); // One subsection
  });

  it('should handle empty input', () => {
    const flat: TocItem[] = [];
    const result = buildCompleteToc(flat);

    expect(result.flatHeadings).toHaveLength(0);
    expect(result.tree).toHaveLength(0);
    expect(result.headingMap.size).toBe(0);
  });
});
