<script lang="ts">
  import { onMount, tick } from 'svelte';
  import LessonThemeToggle from '@/components/LessonThemeToggle.svelte';
  import LessonNavigationLabel from '@/components/sidebar/LessonNavigationLabel.svelte';
  import TOCTree from '@/components/navigation/TOCTree.svelte';
  import { createTocManager } from '@/lib/tocManager.svelte';
  import { findActiveSectionId, buildDownloadHref, buildLessonHref, getChecklistCountLabel } from '@/lib/topBarHelpers';
  import {
    formatExternalLessonCount,
    formatExternalLessonsInCourseCount,
    getExternalLessonShellCopy,
    type ExternalLessonShellLabels,
  } from '@/lib/externalLessonShellCopy';
  import type { TocItem } from '@/types/toc';

  interface Breadcrumb {
    primary: string;
    secondary: string;
  }

  interface FlatLessonItem {
    id: string;
    name: string;
    personalization?: LessonPersonalization;
  }

  interface SectionItem {
    id: number;
    name: string;
  }

  interface GroupedLessonItem {
    id: string | number;
    name: string;
    sectionId: number;
    personalization?: LessonPersonalization;
  }

  interface LessonPersonalization {
    label: string;
    tooltip: string;
  }

  interface ChecklistItem {
    id: string;
    title: string;
  }

  interface Props {
    homeUrl?: string;
    logoUrl?: string;
    logoSrc: string;
    logoSmallSrc: string;
    logoDarkSrc?: string;
    logoDarkSmallSrc?: string;
    prevUrl?: string | null;
    nextUrl?: string | null;
    showLogo?: boolean;
    breadcrumb?: Breadcrumb | null;
    downloadUrl?: string | null;
    downloadName?: string | null;
    downloadLabel?: string;
    lessons?: FlatLessonItem[];
    activeLessonId?: string | null;
    lessonUrlPrefix?: string;
    sections?: SectionItem[];
    groupedLessons?: GroupedLessonItem[];
    activeExternalLessonId?: string | number | null;
    courseId?: string;
    checklists?: ChecklistItem[];
    activeChecklistId?: string | null;
    headings?: TocItem[];
    tocStorageKey?: string;
    contentSelector?: string;
    showDesktopTocWidget?: boolean;
    lessonPanelLabel?: string;
    sectionPanelLabel?: string;
    shellCopy?: ExternalLessonShellLabels;
    sticky?: boolean;
    showThemeToggle?: boolean;
  }

  let {
    homeUrl = '/',
    logoUrl = '/courses',
    logoSrc,
    logoSmallSrc,
    logoDarkSrc,
    logoDarkSmallSrc,
    prevUrl = null,
    nextUrl = null,
    showLogo = true,
    breadcrumb = null,
    downloadUrl = null,
    downloadName = null,
    downloadLabel,
    lessons = [],
    activeLessonId = null,
    lessonUrlPrefix = '',
    sections = [],
    groupedLessons = [],
    activeExternalLessonId = null,
    courseId,
    checklists = [],
    activeChecklistId = null,
    headings = [],
    tocStorageKey = 'toc-widget-open',
    contentSelector = '.prose',
    showDesktopTocWidget = true,
    lessonPanelLabel,
    sectionPanelLabel,
    shellCopy = getExternalLessonShellCopy(),
    sticky = false,
    showThemeToggle = false,
  }: Props = $props();

  const resolvedDownloadLabel = downloadLabel ?? shellCopy.downloadMarkdown;
  const resolvedLessonPanelLabel = lessonPanelLabel ?? shellCopy.lessons;
  const resolvedSectionPanelLabel = sectionPanelLabel ?? shellCopy.sections;

  const hasFlatLessons = lessons.length > 0;
  const hasGroupedLessons = sections.length > 0 && groupedLessons.length > 0 && !!courseId;
  const hasLessons = hasFlatLessons || hasGroupedLessons;
  const hasSections = headings.length > 0;
  const lessonDialogId = `topbar-lessons-${courseId ?? tocStorageKey}`;
  const sectionDialogId = `topbar-sections-${courseId ?? tocStorageKey}`;
  const activeSectionId = findActiveSectionId(groupedLessons, activeExternalLessonId);
  const downloadHref = buildDownloadHref(downloadUrl, downloadName);

  let isHydrated = $state(false);
  let activePanel = $state<'lessons' | 'sections' | null>(null);
  let topbarElement: HTMLElement | null = null;
  let topbarHeight = $state(0);
  let desktopTocWidget: HTMLElement | null = null;
  let mobileTocContainer: HTMLElement | null = null;
  let resizeObserver: ResizeObserver | null = null;

  const tocManager = createTocManager({
    headings,
    contentSelector,
    storageKey: tocStorageKey,
    getScrollOffsetTop: () => (sticky ? topbarHeight : 0),
  });

  function getLessonsBySection(sectionId: number) {
    return groupedLessons.filter((lesson) => lesson.sectionId === sectionId);
  }

  function getLessonHref(id: string | number): string {
    const resolvedLessonUrlPrefix = lessonUrlPrefix || (courseId ? `/external/${courseId}` : '');
    return buildLessonHref(resolvedLessonUrlPrefix, id);
  }

  function togglePanel(panel: 'lessons' | 'sections') {
    activePanel = activePanel === panel ? null : panel;

    if (activePanel === 'sections') {
      void tick().then(() => {
        tocManager.syncTocScroll(true);
      });
    }
  }

  function closePanel() {
    activePanel = null;
  }

  function handleSectionClick(id: string) {
    tocManager.handleItemClick(id);
    closePanel();
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closePanel();
    }
  }

  function syncTopbarHeight() {
    topbarHeight = topbarElement?.offsetHeight ?? 0;
  }

  onMount(() => {
    isHydrated = true;
    syncTopbarHeight();

    if (topbarElement) {
      resizeObserver = new ResizeObserver(() => {
        syncTopbarHeight();
      });
      resizeObserver.observe(topbarElement);
    }

    if (hasSections) {
      tocManager.init();
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      resizeObserver?.disconnect();
      if (hasSections) {
        tocManager.destroy();
      }
    };
  });

  $effect(() => {
    tocManager.setDesktopWidget(desktopTocWidget);
  });

  $effect(() => {
    tocManager.setMobileContainer(activePanel === 'sections' ? mobileTocContainer : null);
  });

  $effect(() => {
    const shouldSync =
      hasSections &&
      tocManager.isHydrated &&
      !!tocManager.activeId &&
      (tocManager.isDesktopOpen || activePanel === 'sections');

    if (!shouldSync) return;

    void tick().then(() => {
      tocManager.syncTocScroll(false);
    });
  });
</script>

<div
  bind:this={topbarElement}
  class={`lesson-topbar relative flex items-center justify-between gap-3 border-b px-4 py-2 ${
    sticky ? 'sticky top-0 z-50' : ''
  }`}
>
  <div class="flex items-center gap-2 md:gap-4">
    {#if hasLessons}
      <button
        class="lesson-button-secondary md:hidden inline-flex h-10 items-center gap-2 rounded-lg px-3 shadow-sm backdrop-blur-sm transition-colors"
        onclick={() => togglePanel('lessons')}
        aria-controls={lessonDialogId}
        aria-expanded={activePanel === 'lessons'}
        aria-label={activePanel === 'lessons' ? `${shellCopy.close} ${resolvedLessonPanelLabel}` : `${shellCopy.show} ${resolvedLessonPanelLabel}`}
      >
        <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if activePanel === 'lessons'}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 6h11M9 12h11M9 18h11" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
          {/if}
        </svg>
        <span class="hidden text-sm font-medium leading-none md:inline">{resolvedLessonPanelLabel}</span>
      </button>
    {/if}

    {#if breadcrumb}
      <div class="min-w-0">
        <p class="lesson-soft m-0 truncate text-sm">
          {breadcrumb.primary}
          <span class="lesson-muted px-1">/</span>
          <span class="font-semibold">{breadcrumb.secondary}</span>
        </p>
      </div>
    {:else}
      <a href={homeUrl} class="lesson-icon-button rounded-lg p-2 transition-colors" title={shellCopy.home}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </a>

      {#if prevUrl}
        <a
          href={prevUrl}
          data-astro-prefetch
          class="lesson-button-primary inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium leading-none shadow-sm transition-colors"
        >
          <span class="hidden md:inline">← {shellCopy.previous}</span>
          <span class="md:hidden">←</span>
        </a>
      {/if}
    {/if}
  </div>

  {#if showLogo}
    <a href={logoUrl}>
      <img
        src={logoSrc}
        alt="Logo"
        class="lesson-logo-light lesson-logo-full absolute left-1/2 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2"
      />
      {#if logoDarkSrc}
        <img
          src={logoDarkSrc}
          alt="Logo"
          class="lesson-logo-dark lesson-logo-full absolute left-1/2 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2"
        />
      {/if}
      <img
        src={logoSmallSrc}
        alt="Logo"
        class="lesson-logo-light lesson-logo-compact absolute left-1/2 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2"
      />
      {#if logoDarkSmallSrc}
        <img
          src={logoDarkSmallSrc}
          alt="Logo"
          class="lesson-logo-dark lesson-logo-compact absolute left-1/2 top-1/2 h-8 -translate-x-1/2 -translate-y-1/2"
        />
      {/if}
    </a>
  {/if}

  <div class="flex items-center gap-2 md:gap-4">
    {#if nextUrl}
      <a
        href={nextUrl}
        data-astro-prefetch
        class="lesson-button-primary inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium leading-none shadow-sm transition-colors"
      >
        <span class="hidden md:inline">{shellCopy.next} →</span>
        <span class="md:hidden">→</span>
      </a>
    {/if}

    {#if downloadHref}
      <a
        href={downloadHref}
        class="lesson-markdown-button inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium leading-none shadow-sm transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        title={shellCopy.markdownTitle}
        download
      >
        {resolvedDownloadLabel}
      </a>
    {/if}

    {#if showThemeToggle}
      <LessonThemeToggle />
    {/if}

    {#if hasSections}
      <button
        class="lesson-button-secondary toc-toggle-desktop hidden h-10 items-center gap-2 rounded-lg px-3 shadow-sm backdrop-blur-sm transition-colors md:inline-flex"
        onclick={tocManager.toggleDesktop}
        aria-expanded={tocManager.isDesktopOpen}
        aria-label={tocManager.isDesktopOpen ? `${shellCopy.hide} ${resolvedSectionPanelLabel}` : `${shellCopy.show} ${resolvedSectionPanelLabel}`}
      >
        <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if tocManager.isDesktopOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 4h8l4 4v12H8V4Zm8 0v5h4M11 13h6M11 17h6"
            />
          {/if}
        </svg>
        <span class="text-sm font-medium leading-none">{resolvedSectionPanelLabel}</span>
      </button>

      <button
        class="lesson-button-secondary toc-toggle-mobile inline-flex h-10 items-center gap-2 rounded-lg px-3 shadow-sm backdrop-blur-sm transition-colors md:hidden"
        onclick={() => togglePanel('sections')}
        aria-controls={sectionDialogId}
        aria-expanded={activePanel === 'sections'}
        aria-label={activePanel === 'sections' ? `${shellCopy.close} ${resolvedSectionPanelLabel}` : `${shellCopy.show} ${resolvedSectionPanelLabel}`}
      >
        <svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if activePanel === 'sections'}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 4h8l4 4v12H8V4Zm8 0v5h4M11 13h6M11 17h6"
            />
          {/if}
        </svg>
        <span class="hidden text-sm font-medium leading-none md:inline">{resolvedSectionPanelLabel}</span>
      </button>
    {/if}
  </div>
</div>

{#if isHydrated && activePanel !== null}
  <div
    class="lesson-overlay toc-mobile-overlay fixed inset-x-0 bottom-0 z-40 backdrop-blur-sm md:hidden"
    style={`top: ${topbarHeight}px;`}
  >
    <button type="button" class="absolute inset-0" onclick={closePanel} aria-label={`${shellCopy.close} panel`}></button>

    <div class="relative flex h-full w-full">
      {#if activePanel === 'lessons' && hasLessons}
        <div
          id={lessonDialogId}
          class="lesson-panel lesson-scrollbar h-full w-[min(24rem,100vw)] overflow-y-auto border-r lesson-divider-subtle shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={resolvedLessonPanelLabel}
        >
          {#if hasFlatLessons}
            <div class="lesson-sticky-header toc-sticky-header sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-4 pb-3 pt-4 backdrop-blur-sm">
              <div>
                <h2 class="m-0 text-lg font-semibold">{resolvedLessonPanelLabel}</h2>
                <p class="lesson-muted mb-0 mt-1 text-xs uppercase tracking-[0.18em]">{formatExternalLessonsInCourseCount(lessons.length, shellCopy)}</p>
              </div>
              <button
                type="button"
                class="lesson-icon-button mt-0.5 rounded p-1 transition-colors"
                onclick={closePanel}
                aria-label={`${shellCopy.close} ${resolvedLessonPanelLabel}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="lesson-surface min-h-full space-y-1.5 px-3 pb-4 pt-3">
              {#each lessons as lesson, index}
                <a
                  href={getLessonHref(lesson.id)}
                  class={`flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                    lesson.id === activeLessonId
                      ? 'lesson-nav-row-active font-semibold ring-1'
                      : 'lesson-nav-row'
                  }`}
                  onclick={closePanel}
                >
                  <span
                    class={`mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-md text-[11px] font-semibold ${
                      lesson.id === activeLessonId
                        ? 'lesson-nav-row-active'
                        : 'lesson-panel-subtle lesson-muted'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <LessonNavigationLabel
                    name={lesson.name}
                    personalization={lesson.personalization}
                    textClass="min-w-0 leading-snug"
                    nameClass="break-words"
                  />
                </a>
              {/each}
            </div>
          {:else if hasGroupedLessons}
            <div class="lesson-sticky-header toc-sticky-header sticky top-0 z-10 border-b backdrop-blur-sm">
              <div class="flex items-start justify-between gap-4 px-4 pb-3 pt-4">
                <h2 class="m-0 text-lg font-semibold">{resolvedLessonPanelLabel}</h2>
                <button
                  type="button"
                  class="lesson-icon-button rounded p-1 transition-colors"
                  onclick={closePanel}
                  aria-label={`${shellCopy.close} ${resolvedLessonPanelLabel}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <a
                href={homeUrl}
                class="lesson-nav-row flex items-center gap-2 border-t lesson-divider-subtle px-4 py-3 text-sm transition-colors"
                onclick={closePanel}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span class="font-medium">{shellCopy.courseContents}</span>
              </a>
            </div>

            <div class="lesson-surface flex min-h-full flex-col">
              {#each sections as section}
                {@const sectionLessons = getLessonsBySection(section.id)}
                {@const isActiveSection = section.id === activeSectionId}

                <details class="group border-b lesson-divider-subtle" open={isActiveSection}>
                  <summary class="lesson-nav-row list-none cursor-pointer select-none px-4 py-3 transition-colors">
                    <div class="flex items-center justify-between">
                      <span class="text-base font-medium">{section.name}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="lesson-muted h-4 w-4 transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <span class="lesson-muted text-xs">{formatExternalLessonCount(sectionLessons.length, shellCopy)}</span>
                  </summary>

                  <div class="lesson-panel-subtle">
                    {#each sectionLessons as lesson}
                      <a
                        href={getLessonHref(lesson.id)}
                        class={`block border-l-2 px-6 py-3 transition-colors ${
                          lesson.id === activeExternalLessonId
                            ? 'lesson-nav-row-active'
                            : 'lesson-nav-row border-transparent'
                        }`}
                        onclick={closePanel}
                      >
                        <LessonNavigationLabel
                          name={lesson.name}
                          personalization={lesson.personalization}
                          textClass="text-sm"
                        />
                      </a>
                    {/each}
                  </div>
                </details>
              {/each}

              {#if checklists.length > 0}
                <div class="my-2 border-t lesson-divider"></div>

                <details class="group border-b lesson-divider-subtle" open={activeChecklistId !== null}>
                  <summary class="lesson-nav-row list-none cursor-pointer select-none px-4 py-3 transition-colors">
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-2 text-base font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Checklisty
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="lesson-muted h-4 w-4 transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <span class="lesson-muted text-xs">
                      {checklists.length} {getChecklistCountLabel(checklists.length)}
                    </span>
                  </summary>

                  <div class="lesson-panel-subtle">
                    {#each checklists as checklist}
                      <a
                        href={`/external/${courseId}/checklists/${checklist.id}`}
                        class={`block border-l-2 px-6 py-3 transition-colors ${
                          checklist.id === activeChecklistId
                            ? 'lesson-nav-row-success-active'
                            : 'lesson-nav-row border-transparent'
                        }`}
                        onclick={closePanel}
                      >
                        <span class="text-sm">{checklist.title}</span>
                      </a>
                    {/each}
                  </div>
                </details>
              {/if}
            </div>
          {/if}
        </div>
      {:else if activePanel === 'sections' && hasSections}
        <div
          id={sectionDialogId}
          bind:this={mobileTocContainer}
          class="lesson-panel lesson-scrollbar ml-auto h-full w-[min(24rem,100vw)] overflow-y-auto border-l lesson-divider-subtle shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={resolvedSectionPanelLabel}
        >
          <div class="lesson-sticky-header toc-sticky-header sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-4 pb-3 pt-4 backdrop-blur-sm">
            <h2 class="m-0 text-lg font-semibold">{shellCopy.tableOfContents}</h2>
            <button
              type="button"
              class="lesson-icon-button rounded p-1 transition-colors"
              onclick={closePanel}
              aria-label={`${shellCopy.close} ${resolvedSectionPanelLabel}`}
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-4 pb-4 pt-3">
            <TOCTree
              items={tocManager.visibleHeadings}
              activeId={tocManager.activeId}
              expandedIds={tocManager.expandedIds}
              depth={0}
              onToggle={tocManager.toggleExpand}
              onClick={handleSectionClick}
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

{#if hasSections && showDesktopTocWidget && tocManager.isHydrated && tocManager.isDesktopOpen}
  <aside
    bind:this={desktopTocWidget}
    class="lesson-panel lesson-scrollbar toc-desktop-widget fixed right-4 z-30 hidden w-72 overflow-y-auto rounded-lg border lesson-divider shadow-lg backdrop-blur-sm md:block 2xl:w-80"
    style={`top: ${topbarHeight + 16}px; max-height: calc(100vh - ${topbarHeight + 32}px);`}
    aria-label={shellCopy.tableOfContents}
  >
    <div class="lesson-sticky-header toc-sticky-header sticky top-0 z-10 flex items-center justify-between border-b px-4 pb-3 pt-4 backdrop-blur-sm">
      <h2 class="text-lg font-semibold">{shellCopy.tableOfContents}</h2>
      <button
        class="lesson-icon-button toc-close-button rounded p-1 transition-colors"
        onclick={tocManager.toggleDesktop}
        aria-label={`${shellCopy.hide} ${shellCopy.tableOfContents}`}
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="px-4 pb-4 pt-3">
      <TOCTree
        items={tocManager.visibleHeadings}
        activeId={tocManager.activeId}
        expandedIds={tocManager.expandedIds}
        depth={0}
        onToggle={tocManager.toggleExpand}
        onClick={tocManager.handleItemClick}
      />
    </div>
  </aside>
{/if}

<style>
  summary::-webkit-details-marker {
    display: none;
  }
</style>
