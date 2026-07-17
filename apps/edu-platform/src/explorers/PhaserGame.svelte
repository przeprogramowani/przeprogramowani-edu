<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Phaser from 'phaser';
  import { createGameConfig } from './config/gameConfig';
  import { BootScene } from './scenes/BootScene';
  import { GameEvents } from './events/GameEvents';
  import type { XpGainedPayload, StateChangedPayload } from './events/GameEvents';
  import GrantNotification from './GrantNotification.svelte';
  import type { GameState, PendingGrant } from './state/types';
  import { GamePersistence } from './state/GamePersistence';
  import {
    applyPendingGrants,
    GAME_STATE_ENDPOINT,
    preloadAuthenticatedGameState,
  } from './state/preloadAuthenticatedGameState';
  import { getQuestCompletionDialogues } from './levels/levelLoader';
  import { FLAGS } from './config/flags';
  import { getRankForXP, getRankUpDialogueId } from './config/ranks';
  import { QuestManager } from './systems/QuestManager';
  import SmartTerminal from './SmartTerminal.svelte';
  import QaOverlay from './QaOverlay.svelte';
  import PreviewOverlay from './PreviewOverlay.svelte';
  import GameHud from './GameHud.svelte';
  import MobileControls from './MobileControls.svelte';
  import { isTouchMode, initTouchDetection } from './utils/touchDetection';
  import { locale, initLocaleStore } from './utils/locale';

  export let userEmail: string | undefined = undefined;

  let container: HTMLDivElement;
  let game: Phaser.Game | null = null;
  let gameReady = false;
  let settled = false;
  let terminalOpen = false;
  let qaMode = false;

  let persistence: GamePersistence | null = null;
  let pollPendingInterval: ReturnType<typeof setInterval> | null = null;
  let isPollingPending = false;
  let pollingArmed = false;

  const POLL_INTERVAL_MS = 30_000;

  function startPollingPending(fn: () => void) {
    if (pollPendingInterval || document.hidden) return;
    pollPendingInterval = setInterval(fn, POLL_INTERVAL_MS);
  }

  function stopPollingPending() {
    if (!pollPendingInterval) return;
    clearInterval(pollPendingInterval);
    pollPendingInterval = null;
  }

  function openTerminal() {
    if (terminalOpen) return;
    // Gate terminal on terminal-found flag
    const state = game?.registry.get('demoGameState') as GameState | undefined;
    if (state && !state.flags.includes(FLAGS.TERMINAL_FOUND)) return;
    terminalOpen = true;
    game?.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: true });
  }

  function closeTerminal() {
    if (!terminalOpen) return;
    terminalOpen = false;
    game?.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: false });
    (document.activeElement as HTMLElement)?.blur();
  }

  function toggleTerminal() {
    if (terminalOpen) closeTerminal();
    else openTerminal();
  }

  onMount(async () => {
    qaMode = new URLSearchParams(window.location.search).has('qa');

    // Pre-load state before booting Phaser.
    // Keep local navigation state, merge server progression, then apply pending grants.
    if (userEmail) {
      try {
        await preloadAuthenticatedGameState();
      } catch (err) {
        console.error('[GameState] Failed to load server state:', err);
      }
    }

    const config = createGameConfig(container);
    config.scene = [BootScene];
    game = new Phaser.Game(config);

    const cleanupTouchDetection = initTouchDetection();
    const cleanupLocaleStore = initLocaleStore();
    const unsubscribeLocale = locale.subscribe((value) => {
      if (!game) return;
      game.events.emit(GameEvents.LOCALE_CHANGED, { locale: value });
    });

    function markReady() {
      if (gameReady) return;
      gameReady = true;
      // Wait two frames for HUD render + Phaser resize to settle, then fade in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settled = true;
        });
      });
    }

    game.events.once('ready', markReady);
    setTimeout(() => {
      if (!gameReady && game) markReady();
    }, 500);

    // Global shortcut
    function onGlobalKey(e: KeyboardEvent) {
      if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleTerminal();
      }
      if (e.key === 'Escape' && terminalOpen) {
        closeTerminal();
      }
    }
    window.addEventListener('keydown', onGlobalKey);

    // Quest system — owned here so it works regardless of terminal visibility
    let questMgr: QuestManager | null = null;

    function getGameState(): GameState {
      return game!.registry.get('demoGameState') as GameState;
    }

    function updateGameState(updater: (prev: GameState) => Partial<GameState>): void {
      const prev = getGameState();
      const patch = updater(prev);
      const next = { ...prev, ...patch };
      game!.registry.set('demoGameState', next);
      game!.events.emit(GameEvents.STATE_CHANGED, { state: next });
    }

    async function pollPendingGrants() {
      if (isPollingPending || !userEmail || !game) return;
      isPollingPending = true;
      try {
        const res = await fetch('/api/game/pending');
        if (!res.ok) return;
        const pending = (await res.json()) as PendingGrant[];
        if (pending.length === 0) return;

        const xpBefore = getGameState().xp;
        const xpGained = pending.reduce((sum, g) => sum + g.xp, 0);
        const appliedGrantIds = pending.map((g) => g.id);

        updateGameState((prev) => applyPendingGrants(prev, pending));

        if (xpGained > 0) {
          game!.events.emit(GameEvents.XP_GAINED, {
            amount: xpGained,
            total: xpBefore + xpGained,
          });
        }
        for (const grant of pending) {
          game!.events.emit(GameEvents.QUEST_COMPLETED, {
            questId: grant.quest_id,
            rewards: { xp: grant.xp, flags: grant.flags },
          });
        }

        game!.events.emit(GameEvents.GRANTS_APPLIED, {
          grants: pending.map((g) => ({ questTitle: g.questTitle, xp: g.xp })),
          totalXp: xpGained,
        });

        // Trigger quest completion dialogues (same as in-browser QuestManager path)
        const completionDialogues = getQuestCompletionDialogues();
        for (const grant of pending) {
          const dialogueId = completionDialogues[grant.quest_id];
          if (dialogueId) {
            game!.events.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
            break; // show only the first — dialogue system handles one at a time
          }
        }

        await fetch(GAME_STATE_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: getGameState(), appliedGrantIds }),
        });
      } catch (err) {
        console.error('[GameState] Pending poll failed:', err);
      } finally {
        isPollingPending = false;
      }
    }

    // Initialize QuestManager once game state is ready (after BootScene)
    game.events.once(GameEvents.STATE_CHANGED, () => {
      questMgr = new QuestManager(game!, game!.events, getGameState, updateGameState);
      questMgr.resumeActiveQuest();
      game!.registry.set('questManager', questMgr);
      if (userEmail) {
        pollingArmed = true;
        startPollingPending(pollPendingGrants);
      }
    });

    function onVisibilityChange() {
      if (!pollingArmed) return;
      if (document.hidden) {
        stopPollingPending();
      } else {
        pollPendingGrants();
        startPollingPending(pollPendingGrants);
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Handle quest activation requests from DialogueManager
    game.events.on(GameEvents.QUEST_ACTIVATE_REQUEST, (p: { questId: string }) => {
      questMgr?.activateQuest(p.questId);
    });
    game.events.on(GameEvents.QUEST_COMPLETE_REQUEST, (p: { questId: string }) => {
      questMgr?.completeQuestById(p.questId);
    });

    // Rank-up detection
    let pendingRankUpDialogue: string | null = null;

    game.events.on(GameEvents.XP_GAINED, (p: XpGainedPayload) => {
      const oldRank = getRankForXP(p.total - p.amount);
      const newRank = getRankForXP(p.total);

      if (oldRank.rank.tier !== newRank.rank.tier) {
        pendingRankUpDialogue = getRankUpDialogueId(newRank.rank.tier);

        game!.events.emit(GameEvents.RANK_UP, {
          oldTier: oldRank.rank.tier,
          oldName: oldRank.rank.name,
          newTier: newRank.rank.tier,
          newName: newRank.rank.name,
          totalXP: p.total,
        });
      }
    });

    game.events.on(GameEvents.DIALOGUE_DISMISSED, () => {
      if (pendingRankUpDialogue) {
        const dialogueId = pendingRankUpDialogue;
        pendingRankUpDialogue = null;
        // Short delay for visual breathing room between dialogues
        setTimeout(() => {
          game!.events.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
        }, 400);
      }
    });

    // Unified persistence (localStorage on every STATE_CHANGED, server save for authenticated users)
    persistence = new GamePersistence({
      getState: () => game?.registry.get('demoGameState') as GameState | undefined,
      authenticated: !!userEmail,
      skipSaveCheck: () => !!game?.registry.get('skipSave'),
    });

    game.events.on(GameEvents.STATE_CHANGED, ({ state }: StateChangedPayload) => {
      persistence!.persist(state);
    });

    game.events.on(GameEvents.QUEST_COMPLETED, () => persistence!.persistMilestone());
    game.events.on(GameEvents.FLAG_SET, () => persistence!.persistMilestone());
    game.events.on(GameEvents.EXAM_COMPLETED, () => persistence!.persistMilestone());
    game.events.on(GameEvents.RANK_UP, () => persistence!.persistMilestone());

    // Save on beforeunload (skip if a state reset is in progress)
    function onBeforeUnload() {
      if (game?.registry.get('skipSave')) return;
      const state = game?.registry.get('demoGameState') as GameState | undefined;
      if (state) {
        persistence?.flush(state);
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('keydown', onGlobalKey);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      persistence?.destroy();
      stopPollingPending();
      cleanupTouchDetection();
      unsubscribeLocale();
      cleanupLocaleStore();
    };
  });

  onDestroy(() => {
    const questMgr = game?.registry.get('questManager') as QuestManager | undefined;
    questMgr?.cleanupEventListeners();
    game?.destroy(true);
    game = null;
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="flex flex-col w-full h-full transition-opacity duration-300"
  class:opacity-0={!settled}>
  <!-- HUD topbar -->
  <div style="flex: 0 0 56px;">
    {#if game && gameReady}
      <GameHud {game} {userEmail} {terminalOpen} onToggleTerminal={toggleTerminal} />
    {/if}
  </div>

  <!-- Game canvas — fills space below HUD and above mobile controls -->
  <div bind:this={container} class="flex-1 min-h-0"></div>

  <!-- Mobile controls — only on touch devices in narrow viewports -->
  {#if game && gameReady && $isTouchMode}
    <MobileControls {game} />
  {/if}

  <!-- Overlays (positioned over entire viewport) -->
  {#if game && gameReady}
    {#if terminalOpen}
      <!-- Dim backdrop — click to close -->
      <div class="fixed inset-0 bg-black/40 z-10" on:click={closeTerminal}></div>

      <!-- Floating terminal card -->
      <div
        class="fixed top-3 bottom-3 z-20 left-3 right-3 sm:left-auto sm:right-3 sm:w-[540px]">
        <div
          class="h-full rounded-xl overflow-hidden border border-teal-800/60 bg-gray-950 shadow-2xl shadow-teal-900/30">
          <SmartTerminal {game} {userEmail} />
        </div>
      </div>
    {/if}

    <PreviewOverlay {game} />
    <GrantNotification {game} />

    {#if qaMode}
      <QaOverlay {game} />
    {/if}
  {/if}
</div>

<style>
  div :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
</style>
