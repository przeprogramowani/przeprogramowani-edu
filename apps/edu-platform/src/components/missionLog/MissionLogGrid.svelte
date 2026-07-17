<script lang="ts">
  import axios from 'axios';
  import AvatarRequiredModal from './AvatarRequiredModal.svelte';
  import type { MissionLogState, MissionLogLessonState } from '@/server/missionLog/buildState';
  import type { MissionLogModuleId } from '@/models/missionLog/lessonCatalog';

  interface Props {
    initialState: MissionLogState;
    avatarUrl: string | null;
    email: string;
    devMode?: boolean;
  }

  const { initialState, avatarUrl, devMode = false }: Props = $props();

  const RETURN_PATH = '/10xdevs-3/mission-log';

  let lessons = $state<MissionLogLessonState[]>(
    initialState.lessons.map((l) => ({ ...l })),
  );
  let modules = $state(initialState.modules);
  let currentAvatarUrl = $state<string | null>(avatarUrl);
  let busyLessonId = $state<string | null>(null);
  let errorMessageByLessonId = $state<Record<string, string>>({});
  let showAvatarModal = $state(false);
  let devUnlockAll = $state(false);

  const TOTAL_BADGES = 25;
  const earnedCount = $derived(lessons.filter((l) => l.count > 0).length);
  const progressPercent = $derived(Math.round((earnedCount / TOTAL_BADGES) * 100));

  const MODULE_LABELS: Record<MissionLogModuleId, string> = {
    m1: 'Moduł 1',
    m2: 'Moduł 2',
    m3: 'Moduł 3',
    m4: 'Moduł 4',
    m5: 'Moduł 5',
  };

  const moduleRows = $derived(
    modules.map((m) => ({
      id: m.id as MissionLogModuleId,
      label: MODULE_LABELS[m.id as MissionLogModuleId] ?? m.id,
      unlocksAt: m.unlocksAt,
      unlocked: m.unlocked || devUnlockAll,
      lessons: lessons
        .filter((l) => l.moduleId === m.id)
        .sort((a, b) => a.order - b.order),
    })),
  );

  const polishDateFormatter = new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Warsaw',
  });

  function formatUnlockDate(iso: string): string {
    return polishDateFormatter.format(new Date(iso));
  }

  function setErrorFor(lessonId: string, message: string | null) {
    if (message === null) {
      const next = { ...errorMessageByLessonId };
      delete next[lessonId];
      errorMessageByLessonId = next;
    } else {
      errorMessageByLessonId = { ...errorMessageByLessonId, [lessonId]: message };
    }
  }

  function patchLesson(lessonId: string, patch: Partial<MissionLogLessonState>) {
    lessons = lessons.map((l) => (l.lessonId === lessonId ? { ...l, ...patch } : l));
  }

  async function handleGenerate(lessonId: string) {
    setErrorFor(lessonId, null);

    if (!currentAvatarUrl) {
      showAvatarModal = true;
      return;
    }

    busyLessonId = lessonId;
    try {
      const { data } = await axios.post('/api/mission-log/generate', {
        lessonId,
        ...(devMode && devUnlockAll ? { devBypassGating: true } : {}),
      });
      patchLesson(lessonId, {
        badgeImageUrl: data.badgeImageUrl,
        count: data.count,
        remaining: data.remaining,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const code = err.response?.data?.error;
        if (status === 409 && code === 'avatar_missing') {
          showAvatarModal = true;
        } else if (status === 429 || code === 'quota_exhausted') {
          patchLesson(lessonId, { count: 2, remaining: 0 });
          setErrorFor(lessonId, 'Limit wykorzystany.');
        } else if (status === 403 && code === 'module_locked') {
          setErrorFor(lessonId, 'Moduł jest jeszcze zablokowany.');
        } else if (status === 503 || code === 'upstream_busy') {
          setErrorFor(lessonId, 'Spróbuj za chwilę — generator jest chwilowo zajęty.');
        } else if (status === 401) {
          setErrorFor(lessonId, 'Sesja wygasła. Zaloguj się ponownie.');
        } else if (status === 403) {
          setErrorFor(lessonId, 'Brak dostępu do 10xDevs 3.0.');
        } else {
          setErrorFor(lessonId, 'Nie udało się wygenerować odznaki. Spróbuj ponownie.');
        }
      } else {
        setErrorFor(lessonId, 'Wystąpił nieoczekiwany błąd.');
      }
    } finally {
      busyLessonId = null;
    }
  }

  function closeAvatarModal() {
    showAvatarModal = false;
  }
</script>

<div class="space-y-8">
  <section
    aria-label="Postęp"
    class="rounded-xl border border-purple-500/20 bg-black/30 p-4 md:p-5">
    <div class="flex items-baseline justify-between gap-3 mb-3">
      <h2 class="text-sm font-semibold text-white">✨ Postęp Misji</h2>
      <span class="text-xs text-gray-400">
        <span class="text-white font-medium">{earnedCount}</span>
        / {TOTAL_BADGES} odznak
      </span>
    </div>
    <div
      class="relative h-2.5 rounded-full bg-white/5 overflow-hidden"
      role="progressbar"
      aria-valuenow={earnedCount}
      aria-valuemin="0"
      aria-valuemax={TOTAL_BADGES}>
      <div
        class="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-[width] duration-500 ease-out"
        style:width="{progressPercent}%">
      </div>
    </div>
  </section>

  {#if devMode}
    <div class="rounded-lg border border-amber-500/30 bg-amber-950/30 p-3 flex items-center gap-3">
      <span class="text-[10px] font-semibold uppercase tracking-widest text-amber-400 px-2 py-0.5 border border-amber-400/40 rounded">
        Dev
      </span>
      <label class="flex items-center gap-2 text-xs text-amber-100 cursor-pointer">
        <input
          type="checkbox"
          bind:checked={devUnlockAll}
          class="w-3.5 h-3.5 rounded border-amber-400/50 bg-amber-950 text-amber-400 focus:ring-amber-400" />
          Odblokuj wszystkie moduły (omiń bramkę czasową)
      </label>
      <span class="text-[10px] text-amber-300/70 ml-auto">
        Server bypass aktywny tylko w ENV ≠ PROD
      </span>
    </div>
  {/if}
  {#each moduleRows as row (row.id)}
    <section class="rounded-xl border border-purple-500/20 bg-black/30 p-4 md:p-6">
      <header class="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 class="text-lg font-semibold text-white">{row.label}</h2>
        {#if row.unlocked}
          <span class="text-xs font-medium text-emerald-300">Odblokowany</span>
        {:else}
          <span class="text-xs font-medium text-gray-400">
            Odblokowanie: {formatUnlockDate(row.unlocksAt)}
          </span>
        {/if}
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {#each row.lessons as lesson (lesson.lessonId)}
          {@const isLocked = !row.unlocked}
          {@const isExhausted = !isLocked && lesson.remaining <= 0}
          {@const isGenerated = !isLocked && lesson.count > 0 && lesson.badgeImageUrl}
          {@const isBusy = busyLessonId === lesson.lessonId}
          <article
            class={`relative rounded-lg border bg-gradient-to-br from-purple-950 via-indigo-950 to-cyan-950 p-3 flex flex-col transition-opacity ${
              isLocked ? 'border-white/5 opacity-60' : 'border-purple-500/30'
            }`}>
            <div class="aspect-[920/1470] w-full rounded-md bg-black/40 mb-3 overflow-hidden flex items-center justify-center">
              {#if lesson.badgeImageUrl && !isLocked}
                <a
                  href={lesson.badgeImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full h-full">
                  <img
                    src={lesson.badgeImageUrl}
                    alt={lesson.title}
                    class="w-full h-full object-contain cursor-zoom-in" />
                </a>
              {:else}
                <span class="text-4xl font-main text-white/30">#{lesson.badgeId}</span>
              {/if}
            </div>

            <h3 class="text-xs font-medium text-white leading-snug mb-1 line-clamp-2">
              {lesson.title}
            </h3>
            <p class="text-[10px] text-gray-500 mb-3">
              Lekcja {lesson.order}
            </p>

            <div class="mt-auto">
              {#if isLocked}
                <div class="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 11c.667 0 1.333.444 1.333 1.333V14a1.333 1.333 0 11-2.666 0v-1.667c0-.889.666-1.333 1.333-1.333zM7 11V8a5 5 0 0110 0v3M6 11h12v9H6v-9z" />
                  </svg>
                  Zablokowane
                </div>
              {:else if isExhausted}
                <span class="inline-flex text-[11px] text-gray-400">Limit wykorzystany</span>
              {:else}
                <button
                  type="button"
                  onclick={() => handleGenerate(lesson.lessonId)}
                  disabled={isBusy}
                  class="w-full inline-flex justify-center px-2.5 py-1.5 text-[11px] font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors">
                  {#if isBusy}
                    Generuję...
                  {:else if isGenerated}
                    Wygeneruj ponownie
                  {:else}
                    Wygeneruj odznakę
                  {/if}
                </button>
              {/if}

              {#if errorMessageByLessonId[lesson.lessonId]}
                <p class="mt-2 text-[10px] text-rose-300">
                  {errorMessageByLessonId[lesson.lessonId]}
                </p>
              {/if}
            </div>

          </article>
        {/each}
      </div>
    </section>
  {/each}

  {#if showAvatarModal}
    <AvatarRequiredModal onClose={closeAvatarModal} returnPath={RETURN_PATH} />
  {/if}
</div>
