<script lang="ts">
  import { onMount } from 'svelte';

  interface ProgressLabels {
    markComplete: string;
    completed: string;
    markIncomplete: string;
    error: string;
  }

  interface Props {
    courseSlug: string;
    lessonId: string;
    language?: string | null;
    completed: boolean;
    variant?: 'sidebar' | 'content';
    lessonName?: string;
    labels?: Partial<ProgressLabels> & { htmlLang?: 'pl' | 'en' };
  }

  const props: Props = $props();
  const language = $derived(props.language ?? null);
  let completed = $state(props.completed);
  let pending = $state(false);
  let error = $state<string | null>(null);

  const copy = $derived.by<ProgressLabels>(() => {
    const isEnglish = props.labels?.htmlLang === 'en';
    return {
      markComplete: props.labels?.markComplete ?? (isEnglish ? 'Mark as complete' : 'Oznacz jako ukończone'),
      completed: props.labels?.completed ?? (isEnglish ? 'Completed' : 'Ukończone'),
      markIncomplete: props.labels?.markIncomplete ?? (isEnglish ? 'Mark as incomplete' : 'Oznacz jako nieukończone'),
      error: props.labels?.error ?? (isEnglish ? 'Could not update progress' : 'Nie udało się zapisać postępu'),
    };
  });

  const eventKey = $derived(`${props.courseSlug}:${language ?? ''}:${props.lessonId}`);
  const ariaLabel = $derived(
    completed
      ? `${copy.markIncomplete}: ${props.lessonName ?? props.lessonId}`
      : `${copy.markComplete}: ${props.lessonName ?? props.lessonId}`
  );

  function publish(nextCompleted: boolean) {
    window.dispatchEvent(
      new CustomEvent('lesson-progress:changed', {
        detail: {
          key: eventKey,
          courseSlug: props.courseSlug,
          language,
          lessonId: props.lessonId,
          completed: nextCompleted,
        },
      })
    );
  }

  async function toggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (pending) return;

    const previous = completed;
    const next = !completed;
    completed = next;
    error = null;
    pending = true;
    publish(next);

    try {
      const response = await fetch('/api/lesson-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: props.courseSlug,
          language,
          lessonId: props.lessonId,
          completed: next,
        }),
      });

      if (!response.ok) {
        throw new Error(`Progress update failed with status ${response.status}`);
      }
    } catch {
      completed = previous;
      error = copy.error;
      publish(previous);
    } finally {
      pending = false;
    }
  }

  onMount(() => {
    function handleProgressChange(event: Event) {
      const detail = (event as CustomEvent<{ key: string; completed: boolean }>).detail;
      if (detail?.key === eventKey && detail.completed !== completed) {
        completed = detail.completed;
        error = null;
      }
    }

    window.addEventListener('lesson-progress:changed', handleProgressChange);
    return () => window.removeEventListener('lesson-progress:changed', handleProgressChange);
  });
</script>

<div class={props.variant === 'content' ? 'inline-flex flex-col items-start gap-1' : 'flex flex-col items-center'}>
  <button
    type="button"
    class={props.variant === 'content'
      ? 'lesson-progress-button inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60'
      : 'lesson-progress-button inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-semibold transition-colors disabled:opacity-60'}
    aria-pressed={completed}
    aria-label={ariaLabel}
    disabled={pending}
    onclick={toggle}
  >
    <span aria-hidden="true">{completed ? '✓' : ''}</span>
    {#if props.variant === 'content'}
      <span>{completed ? copy.completed : copy.markComplete}</span>
    {/if}
  </button>

  {#if error}
    <span class={props.variant === 'content' ? 'text-xs text-red-500' : 'sr-only'}>{error}</span>
  {/if}
</div>
