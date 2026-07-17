<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import type Phaser from 'phaser';
  import { GameEvents } from './events/GameEvents';
  import type { SceneEnteredPayload, XpGainedPayload, StateChangedPayload, RankUpPayload } from './events/GameEvents';
  import type { GameState } from './state/types';
  import { getRankForXP, getRankProgress } from './config/ranks';
  import { devLog } from './utils/logger';
  import { audioManager } from './audio/AudioManager';
  import { isTouchMode } from './utils/touchDetection';
  import { locale, toggleLocale } from './utils/locale';
  import { t } from './i18n/store';
  import type { BilingualText } from './i18n/types';

  export let game: Phaser.Game;
  export let userEmail: string | undefined = undefined;
  export let terminalOpen: boolean = false;
  export let onToggleTerminal: (() => void) | undefined = undefined;

  let location: BilingualText | null = null;
  $: locationDisplay = location ? location[$locale] || location.pl : '';
  let xp = 0;
  let xpFlash = false;
  let rankName = '???';
  let rankTier = 1;
  let rankUpFlash = false;
  let terminalFound = false;
  let muted = false;
  let hudExpanded = false;

  const xpWidth = tweened(0, { duration: 300, easing: cubicOut });

  function onSceneEntered(payload: SceneEnteredPayload) {
    location = payload.displayName;
  }

  function onXpGained(payload: XpGainedPayload) {
    xp = payload.total;
    const progress = getRankProgress(payload.total);
    const info = getRankForXP(payload.total);
    rankName = info.rank.name;
    rankTier = info.rank.tier;
    xpWidth.set(progress.percent);

    // Flash effect
    xpFlash = true;
    setTimeout(() => {
      xpFlash = false;
    }, 600);
  }

  function onStateChanged(payload: StateChangedPayload) {
    xp = payload.state.xp;
    const progress = getRankProgress(payload.state.xp);
    const info = getRankForXP(payload.state.xp);
    rankName = info.rank.name;
    rankTier = info.rank.tier;
    // Update bar without animation on state sync
    xpWidth.set(progress.percent, { duration: 0 });
    if (payload.state.flags.includes('terminal-found')) terminalFound = true;
  }

  function preventHudFocusSteal(event: MouseEvent) {
    event.preventDefault();
  }

  function blurHudButton(event: MouseEvent) {
    (event.currentTarget as HTMLButtonElement | null)?.blur();
  }

  function onToggleMute(event: MouseEvent) {
    muted = audioManager.toggleMute();
    blurHudButton(event);
  }

  function onToggleLocale(event: MouseEvent) {
    blurHudButton(event);
    toggleLocale();
  }

  function onTerminalButtonClick(event: MouseEvent) {
    onToggleTerminal?.();
    blurHudButton(event);
    hudExpanded = false;
  }

  function toggleExpanded(event: MouseEvent) {
    hudExpanded = !hudExpanded;
    blurHudButton(event);
  }

  function closeExpanded() {
    hudExpanded = false;
  }

  function onRankUp(payload: RankUpPayload) {
    rankUpFlash = true;
    setTimeout(() => {
      rankUpFlash = false;
    }, 1200);
  }

  onMount(() => {
    devLog('[GameHud] mounted');

    // Read initial state
    const state = game.registry.get('demoGameState') as GameState | undefined;
    if (state) {
      xp = state.xp;
      const progress = getRankProgress(state.xp);
      const info = getRankForXP(state.xp);
      rankName = info.rank.name;
      rankTier = info.rank.tier;
      xpWidth.set(progress.percent, { duration: 0 });
      if (state.flags.includes('terminal-found')) terminalFound = true;
    }

    muted = audioManager.getMuteState();

    game.events.on(GameEvents.SCENE_ENTERED, onSceneEntered);
    game.events.on(GameEvents.XP_GAINED, onXpGained);
    game.events.on(GameEvents.STATE_CHANGED, onStateChanged);
    game.events.on(GameEvents.RANK_UP, onRankUp);
  });

  onDestroy(() => {
    game.events.off(GameEvents.SCENE_ENTERED, onSceneEntered);
    game.events.off(GameEvents.XP_GAINED, onXpGained);
    game.events.off(GameEvents.STATE_CHANGED, onStateChanged);
    game.events.off(GameEvents.RANK_UP, onRankUp);
  });
</script>

<div class="hud" class:hud-mobile={$isTouchMode}>
  {#if $isTouchMode}
    <!-- Compact mobile layout -->
    <div class="hud-left">
      <button
        type="button"
        class="hotkey hamburger"
        aria-label={$t('hud.menu')}
        aria-expanded={hudExpanded}
        on:mousedown={preventHudFocusSteal}
        on:click={toggleExpanded}>
        ☰
      </button>
    </div>

    <div class="hud-center">
      <span class="level" class:rank-up-flash={rankUpFlash}>Lv.{rankTier}</span>
    </div>

    <div class="hud-right">
      <button
        type="button"
        tabindex="-1"
        class="hotkey hotkey-locale"
        on:mousedown={preventHudFocusSteal}
        on:click={onToggleLocale}
        title={$locale === 'pl' ? $t('hud.localeTitlePl') : $t('hud.localeTitleEn')}
        aria-label={$locale === 'pl' ? $t('hud.localeSwitchToEn') : $t('hud.localeSwitchToPl')}>
        <span class:locale-active={$locale === 'pl'}>PL</span>
        <span class="locale-divider">/</span>
        <span class:locale-active={$locale === 'en'}>EN</span>
      </button>
      <button
        type="button"
        tabindex="-1"
        class="hotkey"
        class:hotkey-active={muted}
        on:mousedown={preventHudFocusSteal}
        on:click={onToggleMute}
        title={muted ? $t('hud.muteOn') : $t('hud.muteOff')}>
        {#if muted}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        {/if}
      </button>
      {#if terminalFound}
        <button
          type="button"
          tabindex="-1"
          class="hotkey"
          class:hotkey-active={terminalOpen}
          on:mousedown={preventHudFocusSteal}
          on:click={onTerminalButtonClick}>
          {$t('hud.terminal')}
        </button>
      {/if}
    </div>
  {:else}
    <!-- Desktop layout -->
    <!-- Home + Logo -->
    <div class="hud-left">
      <a href="/courses" class="home-btn" title={$t('hud.homeButton')} aria-label={$t('hud.homeButton')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </a>
      <span class="logo-divider"></span>
      <span class="logo">Space Explorers</span>
    </div>

    <!-- Rank + XP + Location -->
    <div class="hud-center">
      <span class="rank" class:rank-up-flash={rankUpFlash}>&#9733; {rankName}</span>
      <span class="level" class:rank-up-flash={rankUpFlash}>Lv.{rankTier}</span>
      <div class="xp-bar-bg">
        <div class="xp-bar-fill" style="width: {$xpWidth}%"></div>
      </div>
      <span class="xp-text" class:xp-flash={xpFlash}>
        {#if getRankProgress(xp).displayMax !== null}
          {xp}/{getRankProgress(xp).displayMax} XP
        {:else}
          {xp} XP
        {/if}
      </span>
      {#if locationDisplay}
        <span class="separator">|</span>
        <span class="location">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="opacity:0.9;vertical-align:middle;color:#00d4aa">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>{locationDisplay}
        </span>
      {/if}
    </div>

    <!-- Right actions -->
    <div class="hud-right">
      {#if !userEmail}
        <a href="/signup?redirect=explorers" class="save-cta flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="flex-shrink-0">
            <path
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z" />
          </svg>
          <span class="leading-none">{$t('hud.signupCta')}</span>
        </a>
      {/if}
      <button
        type="button"
        tabindex="-1"
        class="hotkey hotkey-locale"
        on:mousedown={preventHudFocusSteal}
        on:click={onToggleLocale}
        title={$locale === 'pl' ? $t('hud.localeTitlePl') : $t('hud.localeTitleEn')}
        aria-label={$locale === 'pl' ? $t('hud.localeSwitchToEn') : $t('hud.localeSwitchToPl')}>
        <span class:locale-active={$locale === 'pl'}>PL</span>
        <span class="locale-divider">/</span>
        <span class:locale-active={$locale === 'en'}>EN</span>
      </button>
      <button
        type="button"
        tabindex="-1"
        class="hotkey"
        class:hotkey-active={muted}
        on:mousedown={preventHudFocusSteal}
        on:click={onToggleMute}
        title={muted ? $t('hud.muteOn') : $t('hud.muteOff')}>
        {#if muted}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        {/if}
      </button>
      {#if terminalFound}
        <button
          type="button"
          tabindex="-1"
          class="hotkey"
          class:hotkey-active={terminalOpen}
          on:mousedown={preventHudFocusSteal}
          on:click={onTerminalButtonClick}>
          {$t('hud.terminal')}
        </button>
      {/if}
    </div>
  {/if}
</div>

{#if $isTouchMode && hudExpanded}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="hud-backdrop" on:click={closeExpanded}></div>

  <div class="hud-drawer">
    <a href="/courses" class="home-btn" title={$t('hud.homeButton')} aria-label={$t('hud.homeButton')} on:click={closeExpanded}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </a>

    <div class="drawer-row">
      <span class="rank" class:rank-up-flash={rankUpFlash}>&#9733; {rankName}</span>
      <span class="level">Lv.{rankTier}</span>
    </div>

    <div class="drawer-row">
      <div class="xp-bar-bg" style="width: 100%;">
        <div class="xp-bar-fill" style="width: {$xpWidth}%"></div>
      </div>
    </div>

    <div class="drawer-row">
      <span class="xp-text">
        {#if getRankProgress(xp).displayMax !== null}
          {xp}/{getRankProgress(xp).displayMax} XP
        {:else}
          {xp} XP
        {/if}
      </span>
    </div>

    {#if location}
      <div class="drawer-row">
        <span class="location">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="opacity:0.9;vertical-align:middle;color:#00d4aa">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>{locationDisplay}
        </span>
      </div>
    {/if}

    {#if !userEmail}
      <a href="/signup?redirect=explorers" class="save-cta" on:click={closeExpanded}>
        {$t('hud.signupDrawerCta')}
      </a>
    {/if}

    <div class="drawer-row">
      <button
        type="button"
        class="hotkey hotkey-locale"
        on:click={onToggleLocale}
        aria-label={$locale === 'pl' ? $t('hud.localeSwitchToEn') : $t('hud.localeSwitchToPl')}>
        <span class:locale-active={$locale === 'pl'}>PL</span>
        <span class="locale-divider">/</span>
        <span class:locale-active={$locale === 'en'}>EN</span>
      </button>
    </div>
  </div>
{/if}

<style>
  .hud {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    background: #0a0e2a;
    border-bottom: 1px solid rgba(0, 212, 170, 0.15);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 14px;
    color: #e0e0e0;
    pointer-events: none;
    user-select: none;
  }

  .hud-left,
  .hud-center,
  .hud-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hud-left {
    flex: 0 0 auto;
  }
  .hud-center {
    flex: 1 1 auto;
    justify-content: center;
  }
  .hud-right {
    flex: 0 0 auto;
  }

  .home-btn {
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: #00d4aa;
    background: rgba(0, 212, 170, 0.1);
    border: 1px solid rgba(0, 212, 170, 0.25);
    border-radius: 4px;
    text-decoration: none;
    transition:
      background 0.15s ease,
      color 0.15s ease;
    flex-shrink: 0;
  }

  .home-btn:hover {
    background: rgba(0, 212, 170, 0.25);
    color: #fff;
  }

  .logo-divider {
    width: 1px;
    height: 22px;
    background: rgba(0, 212, 170, 0.2);
    flex-shrink: 0;
  }

  .logo {
    color: #00d4aa;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .separator {
    color: #333;
    font-size: 14px;
  }

  .rank {
    color: #00d4aa;
    font-weight: 600;
  }

  .level {
    color: #00d4aa;
    opacity: 0.7;
  }

  .xp-bar-bg {
    width: 130px;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .xp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #00d4aa, #00e4bb);
    border-radius: 4px;
    transition: none; /* tweened store handles animation */
  }

  .xp-text {
    font-size: 13px;
    color: #a0a0a0;
    transition: color 0.15s ease;
  }

  .xp-flash {
    color: #ffb347;
    text-shadow: 0 0 6px rgba(255, 179, 71, 0.4);
  }

  .rank-up-flash {
    color: #ffb347;
    text-shadow: 0 0 8px rgba(255, 179, 71, 0.6);
    animation: rank-pulse 1.2s ease-out;
  }

  @keyframes rank-pulse {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(1.15);
    }
    40% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .location {
    color: #e8e8e8;
    font-size: 13px;
    font-weight: 600;
    background: rgba(0, 212, 170, 0.08);
    border: 1px solid rgba(0, 212, 170, 0.3);
    border-radius: 4px;
    padding: 3px 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    letter-spacing: 0.3px;
  }

  .hotkey {
    pointer-events: auto;
    cursor: pointer;
    color: #00d4aa;
    font-size: 13px;
    font-family: inherit;
    background: transparent;
    border: 1px solid rgba(0, 212, 170, 0.3);
    border-radius: 4px;
    padding: 3px 10px;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;
  }

  .hotkey:hover {
    background: rgba(0, 212, 170, 0.1);
    border-color: rgba(0, 212, 170, 0.6);
  }

  .hotkey-active {
    background: rgba(0, 212, 170, 0.15);
    border-color: rgba(0, 212, 170, 0.7);
    color: #fff;
  }

  .hotkey-locale {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
  }

  .locale-active {
    font-weight: 700;
    color: #fff;
  }

  .locale-divider {
    opacity: 0.4;
    margin: 0 2px;
  }

  .save-cta {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #ffb347;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    background: rgba(255, 179, 71, 0.1);
    border: 1px solid rgba(255, 179, 71, 0.35);
    border-radius: 4px;
    padding: 3px 10px;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }

  .save-cta:hover {
    background: rgba(255, 179, 71, 0.2);
    color: #ffd080;
  }

  /* Mobile compact bar */
  .hud-mobile {
    padding: 0 12px;
  }

  .hamburger {
    font-size: 18px;
    line-height: 1;
    padding: 4px 12px;
  }

  /* Drawer / popover (touch only) */
  .hud-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 25;
  }

  .hud-drawer {
    position: fixed;
    top: 56px;
    left: 8px;
    right: 8px;
    z-index: 26;
    background: #0a0e2a;
    border: 1px solid rgba(0, 212, 170, 0.35);
    border-radius: 6px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }

  .drawer-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
