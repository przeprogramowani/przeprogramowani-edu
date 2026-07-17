<script lang="ts">
  import type { TocItem } from '@/types/toc';

  interface Props {
    items: TocItem[];
    activeId: string | null;
    expandedIds: Set<string>;
    depth: number;
    onToggle: (id: string) => void;
    onClick: (id: string) => void;
  }

  let { items, activeId, expandedIds, depth, onToggle, onClick }: Props = $props();

  /**
   * Indentation should follow the actual tree depth, not the original heading level.
   * This keeps flat TOCs left-aligned even when top-level items start at H2/H3.
   */
  function getIndentClass(currentDepth: number): string {
    const indents = [
      'pl-0', // Root
      'pl-1', // First nested level
      'pl-2', // Deeper nesting
      'pl-3',
      'pl-4',
    ];
    return indents[Math.min(currentDepth, indents.length - 1)] || 'pl-0';
  }

  /**
   * Main sections (H2 / ##) should stand out from deeper levels.
   */
  function getLevelTextClass(level: number): string {
    if (level <= 2) return 'font-semibold leading-snug';
    if (level === 3) return 'lesson-soft font-medium leading-snug';
    return 'lesson-muted font-normal leading-snug';
  }

  /**
   * Keep nested lists scannable with a subtle guide line.
   */
  function getListClass(currentDepth: number): string {
    if (currentDepth === 0) return 'space-y-1.5';
    return 'space-y-1 ml-2 pl-2 border-l lesson-divider-subtle';
  }

  /**
   * Only reserve toggle space when the current list level actually contains expandable items.
   * Flat lists should not get a fake left gutter.
   */
  function levelHasExpandableItems(currentItems: TocItem[]): boolean {
    return currentItems.some((item) => item.children.length > 0);
  }

  /**
   * Handle link click while preserving real anchor semantics.
   */
  function handleLinkClick(e: Event, id: string) {
    e.preventDefault();
    onClick(id);
  }

  /**
   * Handle expand/collapse toggle
   */
  function handleToggleClick(e: Event, id: string) {
    e.preventDefault();
    e.stopPropagation();
    onToggle(id);
  }
</script>

<ul class={getListClass(depth)}>
  {#each items as item}
    <li>
      <div class="flex items-start gap-1 {getIndentClass(depth)}">
        <!-- Expand/Collapse Icon -->
        {#if item.children.length > 0}
          <button
            class="lesson-icon-button mt-1 flex-shrink-0 rounded transition-colors"
            onclick={(e) => handleToggleClick(e, item.id)}
            aria-label={expandedIds.has(item.id) ? 'Zwiń' : 'Rozwiń'}
          >
            <svg
              class="h-4 w-4 transition-transform {expandedIds.has(item.id) ? 'rotate-90 text-blue-500' : ''}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {:else if levelHasExpandableItems(items)}
          <span class="w-4 flex-shrink-0" aria-hidden="true"></span>
        {/if}

        <!-- Link -->
        <a
          href="#{item.id}"
          data-toc-active={activeId === item.id ? 'true' : 'false'}
          class="flex-1 text-sm py-1.5 px-2 rounded transition-colors break-words {
            activeId === item.id
              ? 'lesson-nav-row-active font-semibold ring-1'
              : `lesson-nav-row ${getLevelTextClass(item.level)}`
          }"
          onclick={(e) => handleLinkClick(e, item.id)}
        >
          {item.text}
        </a>
      </div>

      <!-- Nested Children (Recursive) -->
      {#if item.children.length > 0 && expandedIds.has(item.id)}
        <svelte:self
          items={item.children}
          {activeId}
          {expandedIds}
          depth={depth + 1}
          {onToggle}
          {onClick}
        />
      {/if}
    </li>
  {/each}
</ul>
