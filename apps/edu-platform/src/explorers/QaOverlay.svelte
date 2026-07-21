<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { GameEvents } from './events/GameEvents';
  import { SceneKey } from './config/sceneRegistry';
  import { getMapDisplayNames, getDialoguesByLevel } from './levels/levelLoader';
  import type { GameState, FacingDirection } from './state/types';
  import type { StateChangedPayload } from './events/GameEvents';
  import type { GameScene } from './scenes/GameScene';
  import { getRankForXP, RANKS } from './config/ranks';
  import {
    removeFlag,
    setFlag,
    setSystemFlag,
    removeSystemFlag,
    getSystemFlags,
    clearQaSystemFlags,
  } from './state/flagManager';
  import type { GameFlag } from './config/flags';
  import { createDefaultState, saveState } from './state/GameStateManager';
  import { ALL_FLAGS } from './config/flags';
  import { QA_MAP_SPAWNS } from './config/qaMapSpawns';

  export let game: Phaser.Game;

  const STATE_KEY = 'demoGameState';

  const isDev = import.meta.env.DEV;
  let expanded = true;
  let state: GameState | null = null;
  let selectedFlag = ALL_FLAGS[0];
  let xpInput = 0;
  let selectedDialogue = '';
  let zoneDebugVisible = true;
  let liveX = 0;
  let liveY = 0;
  let liveFacing: FacingDirection = 'down';
  let systemFlags: GameFlag[] = [];
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function refreshSystemFlags() {
    systemFlags = [...getSystemFlags(game)];
  }

  function blurQaTarget(event: Event) {
    (event.currentTarget as HTMLElement | null)?.blur();
  }

  function preventQaButtonFocus(event: MouseEvent) {
    event.preventDefault();
  }

  function toggleExpanded(event: MouseEvent) {
    expanded = !expanded;
    blurQaTarget(event);
  }

  function onFlagRemoved(event: MouseEvent, flag: string) {
    removeFlag(game, flag);
    const next = game.registry.get(STATE_KEY) as GameState;
    syncStateToServer(next);
    blurQaTarget(event);
  }

  function onAddFlagClick(event: MouseEvent) {
    addFlag();
    blurQaTarget(event);
  }

  function onSetXpClick(event: MouseEvent) {
    setXP();
    blurQaTarget(event);
  }

  function onRankPresetClick(event: MouseEvent, rankMinXP: number) {
    xpInput = rankMinXP;
    setXP();
    blurQaTarget(event);
  }

  function onZoneDebugClick(event: MouseEvent) {
    toggleZoneDebug();
    blurQaTarget(event);
  }

  async function onResetClick(event: MouseEvent) {
    blurQaTarget(event);
    await resetState();
  }

  function readLivePosition() {
    const gameScene = game.scene.getScene(SceneKey.GAME) as GameScene | null;
    if (gameScene) {
      const player = gameScene.getPlayer?.();
      if (player) {
        liveX = player.x;
        liveY = player.y;
        liveFacing = player.facing;
      }
      if (isDev) {
        zoneDebugVisible = gameScene.getZoneDebugVisible();
      }
    }
    refreshSystemFlags();
  }

  function onStateChanged(payload: StateChangedPayload) {
    state = payload.state;
    xpInput = state.xp;
  }

  function toggleZoneDebug() {
    const gameScene = game.scene.getScene(SceneKey.GAME) as GameScene | null;
    if (gameScene) {
      zoneDebugVisible = gameScene.toggleZoneDebug();
    }
  }

  function getAvailableMaps(): Array<{ key: string; name: string }> {
    const names = getMapDisplayNames();
    return Object.entries(names).map(([key, name]) => ({ key, name: name.pl }));
  }

  function jumpToMap(mapKey: string) {
    if (state?.currentMap === mapKey) return;
    const spawn = QA_MAP_SPAWNS[mapKey];
    if (!spawn) {
      console.warn(`[QaOverlay] No QA spawn configured for map: ${mapKey}`);
      return;
    }
    game.events.emit(GameEvents.TRANSITION_START, {
      targetMap: mapKey,
      spawnX: spawn.x,
      spawnY: spawn.y,
    });
  }

  function getDialogueGroups(): Array<{ level: string; label: string; keys: string[] }> {
    const byLevel = getDialoguesByLevel();
    const names = getMapDisplayNames();
    return [...byLevel.entries()].map(([level, keys]) => ({
      level,
      label: names[level]?.pl ?? level,
      keys,
    }));
  }

  function launchDialogue(dialogueId: string) {
    if (!dialogueId) return;
    game.events.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
  }

  function onDialogueSelected(event: Event) {
    const value = (event.currentTarget as HTMLSelectElement).value;
    if (value) launchDialogue(value);
    blurQaTarget(event);
  }

  async function syncStateToServer(next: GameState): Promise<void> {
    try {
      await fetch('/api/game/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
    } catch (err) {
      console.warn('[QaOverlay] Failed to sync state to server:', err);
    }
  }

  function addFlag() {
    if (!selectedFlag || !state) return;
    if (selectedFlag.startsWith('sys:')) {
      // System flags are server-controlled and read-only for game logic.
      // The QA overlay is the one place allowed to force them locally so gated
      // content can be exercised. Not persisted to the server.
      setSystemFlag(game, selectedFlag);
      refreshSystemFlags();
      return;
    }
    setFlag(game, selectedFlag);
    // setFlag already updates registry + localStorage; also sync to server
    const next = game.registry.get(STATE_KEY) as GameState;
    syncStateToServer(next);
  }

  function onSystemFlagRemoved(event: MouseEvent, flag: GameFlag) {
    removeSystemFlag(game, flag);
    refreshSystemFlags();
    blurQaTarget(event);
  }

  function setXP() {
    if (!state) return;
    const xp = Math.max(0, Math.floor(xpInput));
    const next: GameState = { ...state, xp };
    game.registry.set(STATE_KEY, next);
    game.events.emit(GameEvents.STATE_CHANGED, { state: next });
    syncStateToServer(next);
  }

  async function resetState() {
    if (window.confirm('Reset all game state? This will clear localStorage, server state, and reload.')) {
      // Prevent the game from re-saving stale state during destroy/unload.
      game.registry.set('skipSave', true);
      const freshState = createDefaultState();
      saveState(freshState);
      clearQaSystemFlags();

      // Delete server-side state (KV + Supabase).
      try {
        const delRes = await fetch('/api/game/state', { method: 'DELETE' });
        if (!delRes.ok && delRes.status !== 401) {
          console.warn('[QaOverlay] Server delete returned non-OK status:', delRes.status);
        }
      } catch (err) {
        console.warn('[QaOverlay] Failed to delete server state:', err);
      }

      // Force a fresh server state as fallback for authenticated sessions.
      try {
        const putRes = await fetch('/api/game/state', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: freshState }),
        });
        if (!putRes.ok && putRes.status !== 401) {
          console.warn('[QaOverlay] Server reset PUT returned non-OK status:', putRes.status);
        }
      } catch (err) {
        console.warn('[QaOverlay] Failed to overwrite server state with defaults:', err);
      }

      game.destroy(true);
      window.location.reload();
    }
  }

  onMount(() => {
    state = (game.registry.get(STATE_KEY) as GameState) ?? null;
    xpInput = state?.xp ?? 0;
    game.events.on(GameEvents.STATE_CHANGED, onStateChanged);
    // Poll player sprite for live position/facing (not stored in gameState every frame)
    readLivePosition();
    pollTimer = setInterval(readLivePosition, 250);
  });

  onDestroy(() => {
    game.events.off(GameEvents.STATE_CHANGED, onStateChanged);
    if (pollTimer) clearInterval(pollTimer);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="absolute top-12 left-2 z-50 w-80 max-h-[80vh] overflow-y-auto
         bg-gray-950/85 border border-gray-700 rounded-lg p-3
         font-mono text-xs text-gray-300 pointer-events-auto select-text"
  on:click|stopPropagation
  on:mousedown|preventDefault
  on:keydown|stopPropagation
  on:keyup|stopPropagation>
  <button
    type="button"
    class="flex items-center justify-between w-full cursor-pointer"
    class:mb-2={expanded}
    on:mousedown={preventQaButtonFocus}
    on:click={toggleExpanded}
  >
    <span class="text-amber-400 font-bold text-sm">QA MODE</span>
    <div class="flex items-center gap-2">
      <span class="text-gray-500 text-[10px]">?qa</span>
      <span class="text-gray-500 text-[10px]">{expanded ? '▲' : '▼'}</span>
    </div>
  </button>

  {#if state}
    {#if expanded}
      <div class="space-y-1.5">
        <div>
          <span class="text-gray-500">Map:</span>
          <span class="text-teal-400">{state.currentMap}</span>
        </div>
        <div>
          <span class="text-gray-500">Pos:</span>
          <span>({Math.round(liveX)}, {Math.round(liveY)})</span>
          <span class="text-gray-500 ml-1">Face:</span>
          <span>{liveFacing}</span>
        </div>

        <div>
          <span class="text-gray-500">XP:</span>
          <span class="text-amber-300">{state.xp}</span>
          <span class="text-gray-500 ml-1">Rank:</span>
          <span class="text-teal-400">{getRankForXP(state.xp).rank.name} (Lv.{getRankForXP(state.xp).rank.tier})</span>
        </div>

        <div>
          <span class="text-gray-500">Quest:</span>
          <span class={state.quests.active ? 'text-teal-400' : 'text-gray-600'}>
            {state.quests.active ?? 'none'}
          </span>
        </div>
        {#if state.quests.completed.length > 0}
          <div>
            <span class="text-gray-500">Done:</span>
            <span class="text-green-400">{state.quests.completed.join(', ')}</span>
          </div>
        {/if}

        <div>
          <div class="text-gray-500 mb-0.5">Flags ({state.flags.length}):</div>
          {#if state.flags.length > 0}
            <div class="flex flex-wrap gap-1">
              {#each state.flags as flag}
                <button
                  type="button"
                  class="bg-gray-800 px-1 rounded text-[10px] text-gray-400
                         hover:bg-red-900/60 hover:text-red-300 cursor-pointer transition-colors"
                  title="Click to remove flag: {flag}"
                  on:mousedown={preventQaButtonFocus}
                  on:click={(event) => onFlagRemoved(event, flag)}
                >{flag} ✕</button>
              {/each}
            </div>
          {:else}
            <span class="text-gray-600">none</span>
          {/if}
        </div>

        <div>
          <div class="text-gray-500 mb-0.5">System flags ({systemFlags.length}):</div>
          {#if systemFlags.length > 0}
            <div class="flex flex-wrap gap-1">
              {#each systemFlags as flag}
                <button
                  type="button"
                  class="bg-indigo-900/50 px-1 rounded text-[10px] text-indigo-300
                         hover:bg-red-900/60 hover:text-red-300 cursor-pointer transition-colors"
                  title="Click to clear system flag: {flag}"
                  on:mousedown={preventQaButtonFocus}
                  on:click={(event) => onSystemFlagRemoved(event, flag)}
                >{flag} ✕</button>
              {/each}
            </div>
          {:else}
            <span class="text-gray-600">none</span>
          {/if}
        </div>
      </div>

      <div class="mt-3 pt-2 border-t border-gray-700 space-y-1.5">
        <div>
          <label class="text-gray-500" for="qa-flag-add">Add flag:</label>
          <div class="flex gap-1 mt-0.5">
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <select
              id="qa-flag-add"
              class="flex-1 px-1.5 py-1 bg-gray-800/80 border border-gray-600/50 rounded
                     text-[11px] text-gray-300 cursor-pointer outline-none focus:border-teal-600"
              bind:value={selectedFlag}
              on:mousedown|stopPropagation
              on:change={blurQaTarget}
            >
              {#each ALL_FLAGS.filter(f => !state?.flags.includes(f) && !systemFlags.includes(f)) as flag}
                <option value={flag}>{flag}</option>
              {/each}
            </select>
            <button
              type="button"
              on:mousedown={preventQaButtonFocus}
              on:click={onAddFlagClick}
              class="px-2 py-1 bg-teal-900/60 hover:bg-teal-800/80 border border-teal-700/50
                     rounded text-teal-300 text-xs font-bold cursor-pointer transition-colors"
            >+</button>
          </div>
        </div>

        <div>
          <label class="text-gray-500" for="qa-xp-set">Set XP:</label>
          <div class="flex gap-1 mt-0.5">
            <input
              id="qa-xp-set"
              type="number"
              min="0"
              bind:value={xpInput}
              on:mousedown|stopPropagation
              on:keydown|stopPropagation
              on:keyup|stopPropagation
              class="flex-1 px-1.5 py-1 bg-gray-800/80 border border-gray-600/50 rounded
                     text-[11px] text-gray-300 outline-none focus:border-amber-600"
            />
            <button
              type="button"
              on:mousedown={preventQaButtonFocus}
              on:click={onSetXpClick}
              class="px-2 py-1 bg-amber-900/60 hover:bg-amber-800/80 border border-amber-700/50
                     rounded text-amber-300 text-xs font-bold cursor-pointer transition-colors"
            >Set</button>
          </div>
          <div class="flex flex-wrap gap-1 mt-1">
            {#each RANKS as rank}
              <button
                type="button"
                on:mousedown={preventQaButtonFocus}
                on:click={(event) => onRankPresetClick(event, rank.minXP)}
                class="bg-gray-800 px-1.5 py-0.5 rounded text-[10px] text-gray-400
                       hover:bg-amber-900/50 hover:text-amber-300 cursor-pointer transition-colors"
              >Lv{rank.tier}</button>
            {/each}
          </div>
        </div>

        <div>
          <label class="text-gray-500" for="qa-map-jump">Jump to map:</label>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <select
            id="qa-map-jump"
            class="w-full mt-0.5 px-1.5 py-1 bg-gray-800/80 border border-gray-600/50 rounded
                   text-[11px] text-gray-300 cursor-pointer outline-none
                   focus:border-teal-600"
            value={state?.currentMap ?? ''}
            on:mousedown|stopPropagation
            on:change={(e) => { jumpToMap(e.currentTarget.value); blurQaTarget(e); }}
          >
            {#each getAvailableMaps() as map}
              <option value={map.key}>{map.name} ({map.key})</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="text-gray-500" for="qa-dialogue-launch">Launch dialogue:</label>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <select
            id="qa-dialogue-launch"
            class="w-full mt-0.5 px-1.5 py-1 bg-gray-800/80 border border-gray-600/50 rounded
                   text-[11px] text-gray-300 cursor-pointer outline-none focus:border-purple-600"
            bind:value={selectedDialogue}
            on:mousedown|stopPropagation
            on:change={onDialogueSelected}
          >
            <option value="" disabled>-- select dialogue --</option>
            {#each getDialogueGroups() as group}
              <optgroup label={group.label}>
                {#each group.keys as key}
                  <option value={key}>{key}</option>
                {/each}
              </optgroup>
            {/each}
          </select>
        </div>

        {#if isDev}
          <button
            type="button"
            on:mousedown={preventQaButtonFocus}
            on:click={onZoneDebugClick}
            class="w-full px-2 py-1.5 border rounded text-xs font-bold cursor-pointer transition-colors
                   {zoneDebugVisible
                     ? 'bg-teal-900/60 hover:bg-teal-800/80 border-teal-700/50 text-teal-300'
                     : 'bg-gray-800/60 hover:bg-gray-700/80 border-gray-600/50 text-gray-400'}"
          >
            Strefy: {zoneDebugVisible ? 'WŁ' : 'WYŁ'}
          </button>
        {/if}
        <button
          type="button"
          on:mousedown={preventQaButtonFocus}
          on:click={onResetClick}
          class="w-full px-2 py-1.5 bg-red-900/60 hover:bg-red-800/80 border border-red-700/50
                 rounded text-red-300 text-xs font-bold cursor-pointer transition-colors">
          Reset State
        </button>
      </div>
    {/if}
  {:else}
    {#if expanded}
      <div class="text-gray-600 italic">Waiting for game state...</div>
    {/if}
  {/if}
</div>
