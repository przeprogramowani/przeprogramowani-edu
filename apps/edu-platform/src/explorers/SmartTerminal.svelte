<script lang="ts">
  import { onMount } from 'svelte';
  import type Phaser from 'phaser';
  import { GameEvents } from './events/GameEvents';
  import { handleCommand, type InteractiveItem } from './terminal/commandHandler';
  import { getAvailableCommands, COMMAND_REGISTRY } from './terminal/commandRegistry';
  import { t } from './i18n/store';
  import { setFlag } from './state/flagManager';
  import { FLAGS } from './config/flags';
  import type { GameState } from './state/types';
  import type { QuestManager } from './systems/QuestManager';
  import bootData from './data/dialogues/terminal-boot.json';
  import { type TerminalBlock, stringsToLines, makeBlock } from './terminal/terminalTypes';
  import { fetchSupportToken } from './terminal/supportCommand';
  import { createTerminalBus } from './terminal/terminalBus';
  import TerminalLockScreen from './terminal/TerminalLockScreen.svelte';
  import TerminalOutput from './terminal/TerminalOutput.svelte';
  import TerminalInput from './terminal/TerminalInput.svelte';
  import TerminalTokenBar from './terminal/TerminalTokenBar.svelte';

  export let game: Phaser.Game;
  export let userEmail: string | undefined = undefined;

  let unlocked = false;
  let bootDone = false;
  let bootSequence: string[] = [];
  let pulseCode = false;
  let blocks: TerminalBlock[] = [];
  let interactiveItems: InteractiveItem[] = [];
  let copyableToken: string | null = null;
  let tokenGenerated = false;
  let scrollTrigger = 0;

  let liveInterval: ReturnType<typeof setInterval> | null = null;
  let liveBlockId: string | null = null;
  let liveRaw = '';

  let gameState: GameState | null = null;
  let questManager: QuestManager;

  $: availableCommands = gameState
    ? getAvailableCommands(gameState.flags).map((c) => c.name)
    : ['time', 'help'];

  function getBus(): Phaser.Events.EventEmitter {
    return game.events;
  }

  function getState(): GameState {
    const state = game.registry.get('demoGameState') as GameState;
    gameState = state;
    return state;
  }

  function updateState(updater: (prev: GameState) => Partial<GameState>): void {
    const prev = getState();
    const next = { ...prev, ...updater(prev) };
    game.registry.set('demoGameState', next);
    getBus().emit(GameEvents.STATE_CHANGED, { state: next });
  }

  function appendBlock(lines: TerminalBlock['lines']): TerminalBlock {
    const block = makeBlock(lines);
    blocks = [...blocks, block];
    scrollTrigger++;
    return block;
  }

  function replaceBlock(id: string, lines: TerminalBlock['lines']) {
    blocks = blocks.map((b) => (b.id === id ? { ...b, lines } : b));
  }

  function clearLiveUpdate() {
    if (liveInterval) { clearInterval(liveInterval); liveInterval = null; }
    liveBlockId = null;
  }

  async function playBootSequence() {
    unlocked = true;
    const lines = bootData.lines as string[];
    bootSequence = [];
    for (const line of lines) {
      bootSequence = [...bootSequence, line];
      await new Promise((r) => setTimeout(r, 200));
    }
    bootDone = true;
    blocks = [makeBlock(stringsToLines([...bootSequence, '', '─────────────────────────────']))];
    scrollTrigger++;

    setFlag(game, FLAGS.TERMINAL_UNLOCKED);
    getBus().emit(GameEvents.TERMINAL_UNLOCK);
    getBus().emit(GameEvents.DIALOGUE_SHOW, { dialogueId: 'first-contact' });
  }

  async function handleCommandSubmit(raw: string) {
    if (!raw) return;
    interactiveItems = [];
    copyableToken = null;
    tokenGenerated = false;
    clearLiveUpdate();

    const state = getState();
    appendBlock([{ kind: 'command', text: `> ${raw}` }]);

    // Async path: /support with calibrated uplink fetches token from API
    if (raw === '/support' && state.flags.includes(FLAGS.M0_SUPPORT_CALIBRATED)) {
      if (!userEmail) {
        appendBlock([
          { kind: 'info', text: $t('terminal.requireSession') },
          { kind: 'info', text: $t('terminal.loginToAccess') },
          { kind: 'blank' },
        ]);
        interactiveItems = [{ label: $t('terminal.loginCta'), action: { type: 'link', url: '/signup?redirect=explorers', title: $t('terminal.loginCtaTitle') } }];
        updateState((s) => ({ commandHistory: [...s.commandHistory, raw] }));
        return;
      }
      appendBlock([{ kind: 'info', text: $t('terminal.connectingSupport') }]);
      try {
        const result = await fetchSupportToken(userEmail);
        appendBlock(result.lines);
        if (result.copyableToken) {
          copyableToken = result.copyableToken;
          tokenGenerated = result.tokenGenerated;
        }
        if (result.showReactionDialogue) {
          getBus().emit(GameEvents.DIALOGUE_SHOW, { dialogueId: 'm0-support-github-reaction' });
        }
        if (result.activateEarthSignal) {
          getBus().emit(GameEvents.QUEST_ACTIVATE_REQUEST, { questId: 'q-earth-signal' });
        }
      } catch {
        appendBlock([{ kind: 'info', text: $t('terminal.connectErrorSupport') }, { kind: 'blank' }]);
      }
      updateState((s) => ({ commandHistory: [...s.commandHistory, raw] }));
      return;
    }

    // Synchronous command handling (all other commands)
    const result = handleCommand(raw, state, questManager);
    const outputLines: TerminalBlock['lines'] = [...stringsToLines(result.output), { kind: 'blank' }];

    if (result.triggerDialogue) {
      getBus().emit(GameEvents.DIALOGUE_SHOW, { dialogueId: result.triggerDialogue });
    }

    if (result.liveUpdate) {
      const block = appendBlock(outputLines);
      liveBlockId = block.id;
      liveRaw = raw;
      liveInterval = setInterval(() => {
        const freshResult = handleCommand(liveRaw, getState(), questManager);
        replaceBlock(liveBlockId!, [...stringsToLines(freshResult.output), { kind: 'blank' }]);
      }, result.liveUpdate.intervalMs);
    } else {
      appendBlock(outputLines);
    }

    interactiveItems = result.interactive ?? [];
    updateState((s) => ({ commandHistory: [...s.commandHistory, raw] }));
  }

  function handleInteractiveClick(item: InteractiveItem) {
    if (item.action.type === 'preview') {
      getBus().emit(GameEvents.PREVIEW_SHOW, { url: item.action.url, title: item.action.title });
    } else if (item.action.type === 'link') {
      window.location.href = item.action.url;
    }
    interactiveItems = [];
  }

  // Stop keyboard events from reaching Phaser
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === '`' && (e.ctrlKey || e.metaKey)) return;
    if (e.key === 'Escape') return;
    e.stopPropagation();
  }

  onMount(() => {
    questManager = game.registry.get('questManager') as QuestManager;

    const state = getState();
    if (state?.flags.includes(FLAGS.TERMINAL_UNLOCKED)) {
      unlocked = true;
      bootDone = true;
      const upgraded = state.flags.includes(FLAGS.M0_FIRMWARE_UPGRADED);
      blocks = [makeBlock(stringsToLines([
        upgraded ? $t('terminal.bootHeaderUpgraded') : $t('terminal.bootHeader'),
        $t('terminal.bootSession'),
        '',
      ]))];
    }
    if (state?.flags.includes(FLAGS.KEYCODE_FOUND)) pulseCode = true;

    const bus = createTerminalBus(getBus(), {
      onFlagSet(flag) {
        if (flag === FLAGS.KEYCODE_FOUND) pulseCode = true;
        const newCmds = COMMAND_REGISTRY.filter((cmd) => cmd.requiredFlag === flag);
        if (newCmds.length > 0 && bootDone) {
          appendBlock(stringsToLines([
            ...newCmds.map((cmd) => $t('terminal.newCommand', { name: cmd.name, description: $t(cmd.descriptionKey) })),
            '',
          ]));
        }
      },
      onStateChanged(s) { gameState = s; },
      onQuestActivated(questId) {
        const quest = questManager?.getQuestDef(questId);
        if (quest) {
          appendBlock(stringsToLines([
            $t('terminal.questActivated', { title: quest.title }),
            $t('terminal.questActivatedHint'),
            '',
          ]));
        }
      },
      onQuestCompleted(questId) {
        const quest = questManager.getQuestDef(questId);
        if (quest) {
          appendBlock(stringsToLines([
            $t('terminal.questCompleted', { title: quest.title, xp: quest.rewards.xp }),
            '',
          ]));
        }
      },
      onPreviewDismissed() { interactiveItems = []; },
    });

    bus.subscribe();
    return () => { clearLiveUpdate(); bus.unsubscribe(); };
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="smart-terminal flex flex-col h-full font-mono text-xl text-gray-300 bg-transparent select-none"
  on:keydown={handleKeydown}
  on:keyup|stopPropagation>
  {#if !unlocked}
    <TerminalLockScreen pulse={pulseCode} on:unlock={playBootSequence} />
  {:else if !bootDone}
    <!-- Boot Sequence -->
    <div class="flex flex-col justify-center h-full px-4 gap-1">
      {#each bootSequence as line}
        <div class="text-teal-400 text-sm">{line}</div>
      {/each}
    </div>
  {:else}
    <!-- Unlocked Terminal -->
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gray-900/50 rounded-t-xl">
        <span class="text-teal-400 text-base font-bold tracking-wider">{$t('terminal.header')}</span>
      </div>

      <TerminalOutput
        {blocks}
        {interactiveItems}
        {scrollTrigger}
        on:interactiveClick={(e) => handleInteractiveClick(e.detail)} />

      {#if copyableToken}
        <TerminalTokenBar
          token={copyableToken}
          generated={tokenGenerated}
          on:regenerated={(e) => {
            copyableToken = e.detail.token;
            tokenGenerated = true;
          }} />
      {/if}

      <TerminalInput {availableCommands} on:submit={(e) => handleCommandSubmit(e.detail)} />

      <!-- Hints -->
      <div class="px-3 py-1 text-sm text-gray-300 border-t border-gray-900 rounded-b-xl">
        <div>{$t('terminal.hintArrow')}</div>
        <div>{$t('terminal.hintEnter')}</div>
        <div>{$t('terminal.hintEsc')}</div>
      </div>
    </div>
  {/if}
</div>
