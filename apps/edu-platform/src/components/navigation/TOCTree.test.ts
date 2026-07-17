/* @vitest-environment jsdom */

import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import TOCTree from './TOCTree.svelte';
import type { TocItem } from '@/types/toc';

function renderTree(items: TocItem[], depth = 0) {
  return render(TOCTree, {
    items,
    activeId: null,
    expandedIds: new Set(['parent']),
    depth,
    onToggle: vi.fn(),
    onClick: vi.fn(),
  });
}

describe('TOCTree', () => {
  it('keeps flat root sections left-aligned even when they are H2 headings', () => {
    const items: TocItem[] = [
      {
        id: 'section-a',
        text: 'Section A',
        level: 2,
        children: [],
        parentId: null,
      },
      {
        id: 'section-b',
        text: 'Section B',
        level: 2,
        children: [],
        parentId: null,
      },
    ];

    const { container } = renderTree(items);
    const rows = Array.from(container.querySelectorAll('li > div'));

    expect(rows).toHaveLength(2);
    rows.forEach((row) => {
      expect(row.className).toContain('pl-0');
      expect(row.className).not.toContain('pl-1');
      expect(row.className).not.toContain('pl-4');
    });
  });

  it('does not reserve a fake toggle gutter for a flat list level', () => {
    const items: TocItem[] = [
      {
        id: 'section-a',
        text: 'Section A',
        level: 2,
        children: [],
        parentId: null,
      },
    ];

    const { container } = renderTree(items);

    expect(container.querySelector('button[aria-label="Rozwiń"]')).not.toBeInTheDocument();
    expect(container.querySelector('span.w-4[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('keeps alignment for mixed levels by reserving space only when siblings can expand', () => {
    const items: TocItem[] = [
      {
        id: 'parent',
        text: 'Parent',
        level: 2,
        children: [
          {
            id: 'child',
            text: 'Child',
            level: 3,
            children: [],
            parentId: 'parent',
          },
        ],
        parentId: null,
      },
      {
        id: 'leaf',
        text: 'Leaf',
        level: 2,
        children: [],
        parentId: null,
      },
    ];

    const { container } = renderTree(items);

    expect(container.querySelector('button[aria-label="Zwiń"]')).toBeInTheDocument();
    expect(container.querySelector('span.w-4[aria-hidden="true"]')).toBeInTheDocument();
  });
});
