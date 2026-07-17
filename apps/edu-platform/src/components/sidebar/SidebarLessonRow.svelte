<script lang="ts">
  import LessonProgressToggle from '@/components/progress/LessonProgressToggle.svelte';
  import LessonNavigationLabel from './LessonNavigationLabel.svelte';
  import type { LessonSidebarLabels, SidebarLessonItem, SidebarProgressScope } from './types';

  interface Props {
    lesson: SidebarLessonItem;
    href: string;
    active: boolean;
    progressScope?: SidebarProgressScope;
    labels: LessonSidebarLabels;
  }

  const props: Props = $props();
  const activeClasses = $derived(
    props.active ? 'lesson-nav-row-active' : 'lesson-nav-row border-transparent'
  );
</script>

{#if props.progressScope && props.lesson.progress}
  <div class={`flex items-center gap-2 border-l-2 py-1 pr-3 transition-colors ${activeClasses}`}>
    <div class="pl-3">
      <LessonProgressToggle
        courseSlug={props.progressScope.courseSlug}
        language={props.progressScope.language}
        lessonId={props.lesson.progress.lessonId}
        completed={props.lesson.progress.completed}
        lessonName={props.lesson.name}
        variant="sidebar"
        labels={props.labels}
      />
    </div>
    <a href={props.href} class="min-w-0 flex-1 py-1.5 pr-3">
      <LessonNavigationLabel name={props.lesson.name} personalization={props.lesson.personalization} />
    </a>
  </div>
{:else}
  <a href={props.href} class={`block px-6 py-2 border-l-2 transition-colors ${activeClasses}`}>
    <LessonNavigationLabel name={props.lesson.name} personalization={props.lesson.personalization} />
  </a>
{/if}
