import { tick } from 'svelte';
import type { TocItem } from '@/types/toc';

interface TocManagerOptions {
  headings: TocItem[];
  contentSelector: string;
  storageKey: string;
  minVisibleLevel?: number;
  getScrollOffsetTop?: () => number;
}

function filterHeadingsByMinLevel(items: TocItem[], minLevel: number): TocItem[] {
  const result: TocItem[] = [];

  for (const item of items) {
    const filteredChildren = filterHeadingsByMinLevel(item.children, minLevel);

    if (item.level >= minLevel) {
      result.push({
        ...item,
        children: filteredChildren,
      });
    } else {
      result.push(...filteredChildren);
    }
  }

  return result;
}

function collectParentIds(items: TocItem[]): Set<string> {
  const ids = new Set<string>();

  for (const item of items) {
    if (item.children.length > 0) {
      ids.add(item.id);

      const childIds = collectParentIds(item.children);
      childIds.forEach((id) => ids.add(id));
    }
  }

  return ids;
}

function collectHeadingIds(items: TocItem[]): string[] {
  let ids: string[] = [];

  for (const item of items) {
    ids.push(item.id);

    if (item.children.length > 0) {
      ids = ids.concat(collectHeadingIds(item.children));
    }
  }

  return ids;
}

function getCurrentHashId(): string {
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return window.location.hash.replace(/^#/, '');
  }
}

function syncHashToHistory(id: string) {
  const encodedId = encodeURIComponent(id);
  if (getCurrentHashId() === id) return;

  window.history.pushState(null, '', `#${encodedId}`);
}

function findScrollContainer(contentEl: Element): HTMLElement | null {
  let el = contentEl.parentElement;

  while (el && el !== document.documentElement) {
    const overflow = getComputedStyle(el).overflowY;

    if (overflow === 'auto' || overflow === 'scroll') {
      return el;
    }

    el = el.parentElement;
  }

  return null;
}

export function createTocManager(options: TocManagerOptions) {
  const {
    headings,
    contentSelector,
    storageKey,
    minVisibleLevel = 2,
    getScrollOffsetTop = () => 0,
  } = options;

  const filteredHeadings = filterHeadingsByMinLevel(headings, minVisibleLevel);
  const visibleHeadings = filteredHeadings.length > 0 ? filteredHeadings : headings;

  let activeId = $state<string | null>(null);
  let expandedIds = $state(collectParentIds(visibleHeadings));
  let headingElements = $state<Map<string, Element>>(new Map());
  let isDesktopOpen = $state(false);
  let isHydrated = $state(false);

  let observer: IntersectionObserver | null = null;
  let desktopWidget: HTMLElement | null = null;
  let mobileContainer: HTMLElement | null = null;
  let scrollRoot: HTMLElement | null = null;

  function syncActiveIdWithViewport() {
    if (headingElements.size === 0) return;

    const rootRect = scrollRoot?.getBoundingClientRect();
    const viewportHeight = rootRect ? rootRect.height : window.innerHeight;
    const viewportTop = rootRect ? rootRect.top : 0;
    const threshold = viewportTop + viewportHeight * 0.2;

    let bestVisibleId: string | null = null;
    let bestVisibleTop = -Infinity;
    let nearestBelowId: string | null = null;
    let nearestBelowTop = Infinity;

    headingElements.forEach((element, id) => {
      const top = element.getBoundingClientRect().top;

      if (top <= threshold && top > bestVisibleTop) {
        bestVisibleTop = top;
        bestVisibleId = id;
      }

      if (top > threshold && top < nearestBelowTop) {
        nearestBelowTop = top;
        nearestBelowId = id;
      }
    });

    activeId = bestVisibleId ?? nearestBelowId ?? Array.from(headingElements.keys())[0] ?? null;
  }

  function scrollActiveItemInContainer(container: HTMLElement | null, center: boolean) {
    if (!container) return;

    const activeLink = container.querySelector<HTMLElement>('[data-toc-active="true"]');
    if (!activeLink) return;

    if (center) {
      activeLink.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
      return;
    }

    const stickyHeader = container.querySelector<HTMLElement>('.toc-sticky-header');
    const headerOffset = stickyHeader ? stickyHeader.getBoundingClientRect().height : 0;

    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const linkTopInScroll = linkRect.top - containerRect.top + container.scrollTop;
    const linkBottomInScroll = linkTopInScroll + linkRect.height;

    const visibleTop = container.scrollTop + headerOffset + 16;
    const visibleBottom = container.scrollTop + container.clientHeight - 20;
    const comfortTop = visibleTop + 36;
    const comfortBottom = visibleBottom - 42;

    if (linkTopInScroll < comfortTop || linkBottomInScroll > comfortBottom) {
      const targetTop = Math.max(
        0,
        linkTopInScroll - headerOffset - container.clientHeight * 0.34
      );
      container.scrollTo({ top: targetTop, behavior: 'auto' });
    }
  }

  function syncTocScroll(center = false) {
    if (isDesktopOpen) {
      scrollActiveItemInContainer(desktopWidget, center);
    }

    scrollActiveItemInContainer(mobileContainer, center);
  }

  function scrollToHeading(
    id: string,
    {
      behavior = 'smooth',
      updateHistory = false,
    }: { behavior?: ScrollBehavior; updateHistory?: boolean } = {}
  ) {
    const element = headingElements.get(id);
    if (!element) return false;

    if (updateHistory) {
      syncHashToHistory(id);
    }

    activeId = id;

    if (scrollRoot) {
      const rootRect = scrollRoot.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const targetTop = elementRect.top - rootRect.top + scrollRoot.scrollTop;

      scrollRoot.scrollTo({ top: targetTop, behavior });
      return true;
    }

    const topOffset = Math.max(0, getScrollOffsetTop());
    const targetTop = window.scrollY + element.getBoundingClientRect().top - topOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior });
    return true;
  }

  function scrollToHashHeading(behavior: ScrollBehavior = 'auto') {
    const hashId = getCurrentHashId();
    if (!hashId) return false;

    return scrollToHeading(hashId, { behavior, updateHistory: false });
  }

  function handleLocationNavigation() {
    if (!scrollToHashHeading('auto')) return;

    void tick().then(() => {
      syncTocScroll(false);
    });
  }

  function gatherHeadingElements() {
    const contentContainer = document.querySelector(contentSelector);
    if (!contentContainer) return;

    scrollRoot = findScrollContainer(contentContainer);
    headingElements = new Map();

    const allIds = collectHeadingIds(visibleHeadings);

    allIds.forEach((id) => {
      const element = contentContainer.querySelector(`#${CSS.escape(id)}`);

      if (element) {
        headingElements.set(id, element);
      }
    });
  }

  function setupIntersectionObserver() {
    observer?.disconnect();

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
      },
      {
        root: scrollRoot,
        rootMargin: '0px 0px -80% 0px',
        threshold: 0,
      }
    );

    headingElements.forEach((element) => {
      observer?.observe(element);
    });
  }

  function toggleExpand(id: string) {
    if (expandedIds.has(id)) {
      expandedIds.delete(id);
    } else {
      expandedIds.add(id);
    }

    expandedIds = new Set(expandedIds);
  }

  function toggleDesktop() {
    isDesktopOpen = !isDesktopOpen;
    localStorage.setItem(storageKey, JSON.stringify(isDesktopOpen));

    if (isDesktopOpen) {
      void tick().then(() => {
        syncTocScroll(true);
      });
    }
  }

  function handleItemClick(id: string) {
    if (scrollToHeading(id, { behavior: 'smooth', updateHistory: true })) {
      void tick().then(() => {
        syncTocScroll(false);
      });
    }
  }

  function init() {
    const savedState = localStorage.getItem(storageKey);
    isDesktopOpen = savedState !== null ? JSON.parse(savedState) : true;

    gatherHeadingElements();
    syncActiveIdWithViewport();
    setupIntersectionObserver();
    handleLocationNavigation();
    isHydrated = true;

    document.documentElement.classList.remove('toc-not-hydrated');
    document.documentElement.classList.remove('toc-initially-closed');

    window.addEventListener('hashchange', handleLocationNavigation);
    window.addEventListener('popstate', handleLocationNavigation);
  }

  function destroy() {
    observer?.disconnect();
    window.removeEventListener('hashchange', handleLocationNavigation);
    window.removeEventListener('popstate', handleLocationNavigation);
  }

  return {
    get visibleHeadings() {
      return visibleHeadings;
    },
    get activeId() {
      return activeId;
    },
    get expandedIds() {
      return expandedIds;
    },
    get isDesktopOpen() {
      return isDesktopOpen;
    },
    get isHydrated() {
      return isHydrated;
    },
    init,
    destroy,
    toggleDesktop,
    toggleExpand,
    handleItemClick,
    syncTocScroll,
    setDesktopWidget: (el: HTMLElement | null) => {
      desktopWidget = el;
    },
    setMobileContainer: (el: HTMLElement | null) => {
      mobileContainer = el;
    },
  };
}
