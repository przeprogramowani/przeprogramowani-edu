import Phaser from 'phaser';
import type { GameFlag } from '../config/flags';
import { GameEvents } from '../events/GameEvents';
import type { LocaleChangedPayload } from '../events/GameEvents';
import { setFlag as setFlagCentral } from '../state/flagManager';
import type { GameState } from '../state/types';

const STATE_REGISTRY_KEY = 'demoGameState';

export abstract class BaseScene extends Phaser.Scene {
  /** Cached Set view of flags for O(1) lookups */
  private _flagsSet: Set<GameFlag> | null = null;

  /**
   * Phaser invokes init() on every scene start, before create(). At this point
   * `this.events` exists. We attach the locale listener here and detach it on
   * scene shutdown/destroy. Subclasses that override init() must call super.init().
   */
  init(_data?: unknown): void {
    this.bus.on(GameEvents.LOCALE_CHANGED, this.onLocaleChanged, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.detachLocaleListener, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.detachLocaleListener, this);
  }

  private detachLocaleListener(): void {
    this.bus.off(GameEvents.LOCALE_CHANGED, this.onLocaleChanged, this);
  }

  /** Override in subclasses to react to runtime locale toggles. */
  protected onLocaleChanged(_payload: LocaleChangedPayload): void {
    // no-op; subclasses override
  }

  /** Shortcut to game-level event bus */
  get bus(): Phaser.Events.EventEmitter {
    return this.game.events;
  }

  /** Read current game state from the registry */
  get gameState(): GameState {
    return this.registry.get(STATE_REGISTRY_KEY) as GameState;
  }

  /** Get a Set view of current flags (cached, rebuilt on change) */
  get flagsSet(): Set<GameFlag> {
    if (!this._flagsSet) {
      this._flagsSet = new Set(this.gameState.flags);
    }
    return this._flagsSet;
  }

  /** Replace game state in the registry and emit change event */
  updateState(updater: (prev: GameState) => Partial<GameState>): void {
    const prev = this.gameState;
    const patch = updater(prev);
    const next = { ...prev, ...patch };
    this.registry.set(STATE_REGISTRY_KEY, next);
    // Invalidate flags cache if flags changed
    if (patch.flags) this._flagsSet = null;
    this.bus.emit(GameEvents.STATE_CHANGED, { state: next });
  }

  /** Invalidate the cached flags Set (call when flags change externally) */
  invalidateFlagsCache(): void {
    this._flagsSet = null;
  }

  /** Cached Set view of system flags (read-only, set once at boot) */
  private get systemFlagsSet(): Set<GameFlag> {
    return (this.registry.get('systemFlags') as Set<GameFlag>) ?? new Set();
  }

  /** Check whether a flag is set (O(1) via cached Set) */
  hasFlag(flag: string): boolean {
    const typedFlag = flag as GameFlag;
    return this.flagsSet.has(typedFlag) || this.systemFlagsSet.has(typedFlag);
  }

  /** Set a flag (no-op if already set). Delegates to centralized flagManager. */
  setFlag(flag: GameFlag): boolean {
    if (setFlagCentral(this.game, flag)) {
      this._flagsSet = null;
      return true;
    }
    return false;
  }
}
