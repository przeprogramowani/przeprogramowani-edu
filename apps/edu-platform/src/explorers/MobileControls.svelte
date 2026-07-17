<script lang="ts">
  import type Phaser from 'phaser';
  import { SceneKey } from './config/sceneRegistry';
  import type { InputController, VirtualDirection } from './systems/InputController';
  import type { GameScene } from './scenes/GameScene';
  import { devLog } from './utils/logger';

  export let game: Phaser.Game;

  type ActionKey = 'space' | 'enter' | 'esc';

  function getInputController(): InputController | null {
    const scene = game.scene.getScene(SceneKey.GAME) as GameScene | undefined;
    return scene?.getInputController() ?? null;
  }

  function pressDirection(dir: VirtualDirection): void {
    devLog('[MobileControls] press dir', dir);
    getInputController()?.setVirtualDirection(dir, true);
    game.events.emit('virtual-dir-down', { dir });
  }

  function releaseDirection(dir: VirtualDirection): void {
    devLog('[MobileControls] release dir', dir);
    getInputController()?.setVirtualDirection(dir, false);
    game.events.emit('virtual-dir-up', { dir });
  }

  function pressInteract(): void {
    devLog('[MobileControls] press interact');
    getInputController()?.pulseVirtualInteract();
  }

  function pressAction(key: ActionKey): void {
    devLog('[MobileControls] press action', key);
    game.events.emit(`virtual-${key}`);
  }
</script>

<div class="mobile-controls" role="group" aria-label="Sterowanie dotykowe">
  <!-- D-pad -->
  <div class="dpad">
    <button
      type="button"
      class="dpad-btn dpad-up"
      aria-label="Góra"
      on:pointerdown|preventDefault={() => pressDirection('up')}
      on:pointerup={() => releaseDirection('up')}
      on:pointercancel={() => releaseDirection('up')}
      on:pointerleave={() => releaseDirection('up')}
      on:lostpointercapture={() => releaseDirection('up')}>▲</button>
    <button
      type="button"
      class="dpad-btn dpad-left"
      aria-label="Lewo"
      on:pointerdown|preventDefault={() => pressDirection('left')}
      on:pointerup={() => releaseDirection('left')}
      on:pointercancel={() => releaseDirection('left')}
      on:pointerleave={() => releaseDirection('left')}
      on:lostpointercapture={() => releaseDirection('left')}>◀</button>
    <button
      type="button"
      class="dpad-btn dpad-right"
      aria-label="Prawo"
      on:pointerdown|preventDefault={() => pressDirection('right')}
      on:pointerup={() => releaseDirection('right')}
      on:pointercancel={() => releaseDirection('right')}
      on:pointerleave={() => releaseDirection('right')}
      on:lostpointercapture={() => releaseDirection('right')}>▶</button>
    <button
      type="button"
      class="dpad-btn dpad-down"
      aria-label="Dół"
      on:pointerdown|preventDefault={() => pressDirection('down')}
      on:pointerup={() => releaseDirection('down')}
      on:pointercancel={() => releaseDirection('down')}
      on:pointerleave={() => releaseDirection('down')}
      on:lostpointercapture={() => releaseDirection('down')}>▼</button>
  </div>

  <!-- Action buttons -->
  <div class="actions">
    <button
      type="button"
      class="action-btn"
      aria-label="Interakcja"
      on:pointerdown|preventDefault={pressInteract}>E</button>
    <button
      type="button"
      class="action-btn"
      aria-label="Spacja"
      on:pointerdown|preventDefault={() => pressAction('space')}>SPC</button>
    <button
      type="button"
      class="action-btn"
      aria-label="Enter"
      on:pointerdown|preventDefault={() => pressAction('enter')}>ENT</button>
    <button
      type="button"
      class="action-btn"
      aria-label="Anuluj"
      on:pointerdown|preventDefault={() => pressAction('esc')}>ESC</button>
  </div>
</div>

<style>
  .mobile-controls {
    width: 100%;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0)) 16px;
    background: #0a0e2a;
    border-top: 1px solid rgba(0, 212, 170, 0.15);
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }

  .dpad {
    position: relative;
    width: 168px;
    height: 168px;
    flex-shrink: 0;
  }

  .dpad-btn {
    position: absolute;
    width: 56px;
    height: 56px;
    background: rgba(0, 212, 170, 0.08);
    border: 1px solid rgba(0, 212, 170, 0.25);
    color: #00d4aa;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 22px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    touch-action: none;
    image-rendering: pixelated;
    /* No transitions — pixel-art instant feel */
  }

  .dpad-btn:active {
    background: rgba(0, 212, 170, 0.25);
    border-color: #00d4aa;
    color: #ffffff;
  }

  .dpad-up {
    top: 0;
    left: 56px;
  }
  .dpad-left {
    top: 56px;
    left: 0;
  }
  .dpad-right {
    top: 56px;
    left: 112px;
  }
  .dpad-down {
    top: 112px;
    left: 56px;
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(2, 56px);
    grid-template-rows: repeat(2, 56px);
    gap: 8px;
  }

  .action-btn {
    width: 56px;
    height: 56px;
    background: rgba(0, 212, 170, 0.08);
    border: 1px solid rgba(0, 212, 170, 0.25);
    color: #00d4aa;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    touch-action: none;
  }

  .action-btn:active {
    background: rgba(0, 212, 170, 0.25);
    border-color: #00d4aa;
    color: #ffffff;
  }
</style>
