<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import type { ParticipationBadgeResponse } from '@/server/badges/badgesApiClient';

  let badge = $state<ParticipationBadgeResponse | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const { data } = await axios.get<{ badge: ParticipationBadgeResponse | null }>(
        '/api/mission-log/participation-badge',
      );
      badge = data.badge;
    } catch (err) {
      console.error('[ParticipationBadge] failed to load', err);
      error = 'Nie udało się pobrać badge\'a uczestnictwa.';
    } finally {
      loading = false;
    }
  });

  // Chrome blocks top-level navigation to data: URIs, so convert to a blob URL first.
  function dataUrlToBlobUrl(dataUrl: string): string {
    const [meta, b64] = dataUrl.split(',');
    const mime = meta.match(/data:([^;]+)/)?.[1] ?? 'image/png';
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  }

  function openBadge(event: MouseEvent) {
    if (!badge) return;
    event.preventDefault();
    const url = badge.imageUrl.startsWith('data:')
      ? dataUrlToBlobUrl(badge.imageUrl)
      : badge.imageUrl;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
</script>

<section class="mt-12 mb-16 flex flex-col items-center">
  <header class="mb-6 text-center">
    <h2 class="text-2xl md:text-3xl font-main text-white mb-2 drop-shadow-[0_0_20px_rgba(168,85,247,0.35)]">
      Twoja odznaka uczestnika
    </h2>
  </header>

  {#if loading}
    <div class="text-gray-400 text-sm">Wczytywanie…</div>
  {:else if error}
    <div class="rounded-2xl bg-red-500/10 border border-red-500/30 px-6 py-4 text-center text-red-200">
      {error}
    </div>
  {:else if badge}
    <a
      href={badge.imageUrl}
      onclick={openBadge}
      target="_blank"
      rel="noopener noreferrer"
      class="block"
    >
      <img
        src={badge.imageUrl}
        alt="Odznaka uczestnika"
        class="w-64 h-64 md:w-80 md:h-80 rounded-xl object-cover shadow-[0_0_40px_rgba(168,85,247,0.25)] cursor-zoom-in"
      />
    </a>
  {:else}
    <div class="flex flex-col items-center gap-4">
      <p class="text-gray-300 text-center text-sm">Wygeneruj odznakę korzystając z przycisku poniżej. Odznaka pojawi się w tym miejscu.</p>
      <a
        href="https://badges.10xdevs.pl/"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition shadow-[0_0_20px_rgba(168,85,247,0.35)]"
      >
        Wygeneruj
      </a>
    </div>
  {/if}
</section>
