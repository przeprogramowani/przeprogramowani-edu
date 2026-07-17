<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { GameEvents } from './events/GameEvents';
  import type { GrantsAppliedPayload } from './events/GameEvents';
  import type Phaser from 'phaser';
  import { t } from './i18n/store';

  export let game: Phaser.Game;

  const AUTO_DISMISS_MS = 5000;

  interface GrantEntry {
    questTitle: string;
    xp: number;
  }

  let visible = false;
  let grants: GrantEntry[] = [];
  let totalXp = 0;
  let dismissTimer: ReturnType<typeof setTimeout> | null = null;
  let progressInterval: ReturnType<typeof setInterval> | null = null;
  let progressPct = 100;

  function show(payload: GrantsAppliedPayload) {
    grants = payload.grants;
    totalXp = payload.totalXp;
    progressPct = 100;
    visible = true;

    if (dismissTimer) clearTimeout(dismissTimer);
    if (progressInterval) clearInterval(progressInterval);

    const step = 100 / (AUTO_DISMISS_MS / 50);
    progressInterval = setInterval(() => {
      progressPct = Math.max(0, progressPct - step);
    }, 50);

    dismissTimer = setTimeout(dismiss, AUTO_DISMISS_MS);
  }

  function dismiss() {
    visible = false;
    if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; }
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
  }

  onMount(() => {
    game.events.on(GameEvents.GRANTS_APPLIED, show);
  });

  onDestroy(() => {
    game.events.off(GameEvents.GRANTS_APPLIED, show);
    if (dismissTimer) clearTimeout(dismissTimer);
    if (progressInterval) clearInterval(progressInterval);
  });
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="grant-card"
    transition:fly={{ x: 64, duration: 300 }}
    on:click={dismiss}>

    <!-- Header -->
    <div class="grant-header">
      <span class="grant-check">✓</span>
      <span class="grant-label">{$t('grant.questCompleted')}</span>
      <button class="grant-close" on:click|stopPropagation={dismiss}>✕</button>
    </div>

    <!-- Quest list -->
    <ul class="grant-list">
      {#each grants as g}
        <li class="grant-item">
          <span class="grant-title">{g.questTitle}</span>
          {#if g.xp > 0}
            <span class="grant-xp">+{g.xp} XP</span>
          {/if}
        </li>
      {/each}
    </ul>

    {#if totalXp > 0}
      <div class="grant-total">{$t('grant.totalXp', { xp: totalXp })}</div>
    {/if}

    <!-- Countdown bar -->
    <div class="grant-progress-bg">
      <div class="grant-progress-fill" style="width: {progressPct}%"></div>
    </div>
  </div>
{/if}

<style>
  .grant-card {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 50;
    width: 280px;
    background: #0a0e2a;
    border: 1px solid rgba(0, 212, 170, 0.45);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 212, 170, 0.08);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    color: #e0e0e0;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
  }

  .grant-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px 8px;
    border-bottom: 1px solid rgba(0, 212, 170, 0.15);
    background: rgba(0, 212, 170, 0.06);
  }

  .grant-check {
    color: #00d4aa;
    font-size: 14px;
    font-weight: 700;
  }

  .grant-label {
    flex: 1;
    color: #00d4aa;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  .grant-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.3);
    font-size: 11px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    font-family: inherit;
    transition: color 0.15s ease;
  }

  .grant-close:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  .grant-list {
    list-style: none;
    margin: 0;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .grant-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .grant-title {
    color: #c8c8d8;
    font-size: 11px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .grant-xp {
    color: #ffb347;
    font-weight: 700;
    font-size: 11px;
    flex-shrink: 0;
    text-shadow: 0 0 6px rgba(255, 179, 71, 0.35);
  }

  .grant-total {
    padding: 4px 12px 8px;
    text-align: right;
    color: #ffb347;
    font-weight: 700;
    font-size: 13px;
    text-shadow: 0 0 8px rgba(255, 179, 71, 0.4);
  }

  .grant-progress-bg {
    height: 3px;
    background: rgba(255, 255, 255, 0.06);
  }

  .grant-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d4aa, #00e4bb);
    transition: width 50ms linear;
  }
</style>
