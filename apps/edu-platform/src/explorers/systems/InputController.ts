import Phaser from 'phaser';

export type VirtualDirection = 'up' | 'down' | 'left' | 'right';

export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private interactKey: Phaser.Input.Keyboard.Key;
  private spaceKey: Phaser.Input.Keyboard.Key;
  private escKey: Phaser.Input.Keyboard.Key;
  private enabled = true;

  // Virtual input state (driven by MobileControls)
  private virtualButtons: Record<VirtualDirection, boolean> = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  private virtualInteractPulse = false;

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
  }

  /**
   * Set a virtual direction button state. When pressing a new direction,
   * all other directions are cleared first to enforce the no-diagonals rule
   * (winner-takes-all, latest press wins).
   */
  setVirtualDirection(dir: VirtualDirection, value: boolean): void {
    if (value) {
      this.virtualButtons.up = false;
      this.virtualButtons.down = false;
      this.virtualButtons.left = false;
      this.virtualButtons.right = false;
    }
    this.virtualButtons[dir] = value;
  }

  /**
   * Trigger a one-frame interact pulse. The pulse is consumed exactly once
   * by the next call to isInteractJustPressed(), matching the keyboard
   * JustDown semantics.
   */
  pulseVirtualInteract(): void {
    this.virtualInteractPulse = true;
  }

  isUp(): boolean {
    return (
      this.enabled &&
      (this.cursors.up.isDown || this.wasd.W.isDown || this.virtualButtons.up)
    );
  }

  isDown(): boolean {
    return (
      this.enabled &&
      (this.cursors.down.isDown ||
        this.wasd.S.isDown ||
        this.virtualButtons.down)
    );
  }

  isLeft(): boolean {
    return (
      this.enabled &&
      (this.cursors.left.isDown ||
        this.wasd.A.isDown ||
        this.virtualButtons.left)
    );
  }

  isRight(): boolean {
    return (
      this.enabled &&
      (this.cursors.right.isDown ||
        this.wasd.D.isDown ||
        this.virtualButtons.right)
    );
  }

  isInteractJustPressed(): boolean {
    if (!this.enabled) return false;
    const kb = Phaser.Input.Keyboard.JustDown(this.interactKey);
    if (this.virtualInteractPulse) {
      this.virtualInteractPulse = false;
      return true;
    }
    return kb;
  }

  isSpaceJustPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.spaceKey);
  }

  isEscJustPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.escKey);
  }
}
