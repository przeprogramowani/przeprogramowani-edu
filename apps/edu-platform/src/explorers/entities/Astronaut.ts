import Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT, PLAYER_BODY_OFFSET_X, PLAYER_BODY_OFFSET_Y } from '../config/constants';
import { actorDepth } from './actorDepth';
import { InputController } from '../systems/InputController';
import { StateMachine } from '../systems/StateMachine';
import type { FacingDirection } from '../state/types';

type AstronautState = 'idle' | 'walking' | 'interacting' | 'dialogue' | 'cutscene';

const FACING_FRAMES: Record<FacingDirection, number> = {
  down: 0, // row 0, col 0
  left: 4, // row 1, col 0
  right: 8, // row 2, col 0
  up: 12, // row 3, col 0
};

export class Astronaut extends Phaser.Physics.Arcade.Sprite {
  private inputCtrl: InputController;
  private fsm: StateMachine<AstronautState>;
  private _facing: FacingDirection = 'down';

  constructor(scene: Phaser.Scene, x: number, y: number, inputCtrl: InputController) {
    super(scene, x, y, 'astronaut', 0);

    scene.add.existing(this as Phaser.GameObjects.GameObject);
    scene.physics.add.existing(this as Phaser.GameObjects.GameObject);

    this.inputCtrl = inputCtrl;

    // Physics body: 24x16 at feet
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT);
    body.setOffset(PLAYER_BODY_OFFSET_X, PLAYER_BODY_OFFSET_Y);

    this.setDepth(actorDepth(this.y));

    this.fsm = new StateMachine<AstronautState>({
      initial: 'idle',
      transitions: {
        idle: ['walking', 'interacting', 'dialogue', 'cutscene'],
        walking: ['idle', 'interacting', 'dialogue', 'cutscene'],
        interacting: ['idle', 'dialogue'],
        dialogue: ['idle'],
        cutscene: ['idle'],
      },
    });
  }

  get facing(): FacingDirection {
    return this._facing;
  }

  get stateMachine(): StateMachine<AstronautState> {
    return this.fsm;
  }

  setFacing(dir: FacingDirection): void {
    this._facing = dir;
    // Only set static frame if NOT walking (animation handles frames during walk)
    if (!this.fsm.isState('walking')) {
      this.setFrame(FACING_FRAMES[dir]);
    }
  }

  enterState(state: AstronautState): boolean {
    return this.fsm.transition(state);
  }

  update(): void {
    this.setDepth(actorDepth(this.y));

    if (this.fsm.isState('dialogue') || this.fsm.isState('cutscene') || this.fsm.isState('interacting')) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (body.velocity.x !== 0 || body.velocity.y !== 0) {
        body.setVelocity(0, 0);
      }
      if (this.anims.isPlaying) {
        this.stop();
        this.setFrame(FACING_FRAMES[this._facing]);
      }
      return;
    }

    let vx = 0;
    let vy = 0;

    if (this.inputCtrl.isLeft()) vx -= 1;
    if (this.inputCtrl.isRight()) vx += 1;
    if (this.inputCtrl.isUp()) vy -= 1;
    if (this.inputCtrl.isDown()) vy += 1;

    // Normalize diagonal movement
    if (vx !== 0 && vy !== 0) {
      const norm = Math.SQRT1_2;
      vx *= norm;
      vy *= norm;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(vx * PLAYER_SPEED, vy * PLAYER_SPEED);

    // Update facing direction and animation
    if (vx !== 0 || vy !== 0) {
      if (!this.fsm.isState('walking')) {
        this.fsm.transition('walking');
      }

      // Determine facing direction (prioritize horizontal when both axes active)
      let newFacing: FacingDirection;
      if (Math.abs(vx) >= Math.abs(vy)) {
        newFacing = vx < 0 ? 'left' : 'right';
      } else {
        newFacing = vy < 0 ? 'up' : 'down';
      }

      // Play walk animation (only restart if direction changed)
      const animKey = `walk-${newFacing}`;
      if (this._facing !== newFacing || !this.anims.isPlaying) {
        this._facing = newFacing;
        this.play(animKey, true);
      }
    } else {
      if (this.fsm.isState('walking')) {
        this.fsm.transition('idle');
        // Stop animation only on transition from walking to idle
        this.stop();
        this.setFrame(FACING_FRAMES[this._facing]);
      }
    }
  }

}
