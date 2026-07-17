<script lang="ts">
  import { buildLessonHref, getChecklistCountLabel } from '@/lib/topBarHelpers';
  import { formatExternalLessonCount, formatExternalLessonsInCourseCount, getExternalLessonShellCopy } from '@/lib/externalLessonShellCopy';
  import SidebarLessonRow from './SidebarLessonRow.svelte';
  import type { LessonSidebarProps, SidebarLessonItem } from './types';

  const props: LessonSidebarProps = $props();
  const defaultLabels = getExternalLessonShellCopy();
  const labels = $derived(props.labels ?? defaultLabels);

  // Derived: group lessons by section for grouped mode
  const lessonsBySection = $derived.by(() => {
    const map = new Map<number, SidebarLessonItem[]>();
    if (props.mode !== 'grouped') return map;
    for (const section of props.sections) {
      map.set(
        section.id,
        props.lessons.filter((l) => l.sectionId === section.id)
      );
    }
    return map;
  });

  const activeSectionId = $derived(
    props.mode === 'grouped'
      ? (props.lessons.find((l) => l.id === props.activeLessonId)?.sectionId ?? null)
      : null
  );

  const isChecklistSectionOpen = $derived(
    props.mode === 'grouped' && props.activeChecklistId != null
  );

  function lessonHref(id: string | number): string {
    const lessonUrlPrefix =
      props.mode === 'flat' ? props.lessonUrlPrefix : (props.lessonUrlPrefix ?? `/external/${props.courseId}`);
    return buildLessonHref(lessonUrlPrefix, id);
  }

  function checklistHref(id: string): string {
    if (props.mode !== 'grouped') return '#';
    return `/external/${props.courseId}/checklists/${id}`;
  }
</script>

<aside class="lesson-sidebar flex h-full flex-col">
  {#if props.mode === 'flat'}
    <!-- Flat mode: sticky header + simple lesson list -->
    <div class="lesson-sticky-header sticky top-0 z-10 border-b px-4 py-3">
      <span class="text-sm font-medium">{labels.lessons}</span>
      <span class="lesson-muted block text-xs">{formatExternalLessonsInCourseCount(props.lessons.length, labels)}</span>
    </div>
    <div class="lesson-panel-subtle">
      {#each props.lessons as lesson (lesson.id)}
        <SidebarLessonRow
          {lesson}
          href={lessonHref(lesson.id)}
          active={lesson.id === props.activeLessonId}
          progressScope={props.progressScope}
          {labels}
        />
      {/each}
    </div>
  {:else}
    <!-- Grouped mode: collapsible sections -->
    {#each props.sections as section (section.id)}
      {@const sectionLessons = lessonsBySection.get(section.id) || []}
      {@const isActiveSection = section.id === activeSectionId}
      <details class="group border-b lesson-divider-subtle" open={isActiveSection}>
        <summary
          class="lesson-nav-row list-none cursor-pointer select-none px-4 py-3 transition-colors"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">
              {section.name}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="lesson-muted h-4 w-4 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span class="lesson-muted text-xs">{formatExternalLessonCount(sectionLessons.length, labels)}</span>
        </summary>
        <div class="lesson-panel-subtle">
          {#each sectionLessons as lesson (lesson.id)}
            <SidebarLessonRow
              {lesson}
              href={lessonHref(lesson.id)}
              active={lesson.id === props.activeLessonId}
              progressScope={props.progressScope}
              {labels}
            />
          {/each}
        </div>
      </details>
    {/each}

    <!-- Checklists section (optional) -->
    {#if props.checklists && props.checklists.length > 0}
      <div class="my-2 border-t lesson-divider"></div>
      <details class="group border-b lesson-divider-subtle" open={isChecklistSectionOpen}>
        <summary
          class="lesson-nav-row list-none cursor-pointer select-none px-4 py-3 transition-colors"
        >
          <div class="flex items-center justify-between">
            <span
              class="flex items-center gap-2 text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
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
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span class="lesson-muted text-xs">
            {props.checklists.length}
            {getChecklistCountLabel(props.checklists.length)}
          </span>
        </summary>
        <div class="lesson-panel-subtle">
          {#each props.checklists as checklist (checklist.id)}
            <a
              href={checklistHref(checklist.id)}
              class="block px-6 py-2 border-l-2 transition-colors {checklist.id ===
              props.activeChecklistId
                ? 'lesson-nav-row-success-active'
                : 'lesson-nav-row border-transparent'}"
            >
              <span class="text-xs">{checklist.title}</span>
            </a>
          {/each}
        </div>
      </details>
    {/if}
  {/if}
</aside>

<style>
  summary::-webkit-details-marker {
    display: none;
  }

  details[open] a[class*='bg-blue-800'] {
    scroll-margin-top: 1rem;
  }
</style>
