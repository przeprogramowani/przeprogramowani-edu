import { saveState } from './GameStateManager';
import { devLog } from '../utils/logger';
import type { GameState } from './types';

const SAVE_ENDPOINT = '/api/game/state';
const DEBOUNCE_MS = 5000;

export class GamePersistence {
  private getState: () => GameState | undefined;
  private skipSaveCheck: () => boolean;
  private authenticated: boolean;
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  private milestonePending = false;

  constructor(options: {
    getState: () => GameState | undefined;
    authenticated: boolean;
    skipSaveCheck: () => boolean;
  }) {
    this.getState = options.getState;
    this.authenticated = options.authenticated;
    this.skipSaveCheck = options.skipSaveCheck;
  }

  /** Called on every STATE_CHANGED — always saves to localStorage, queues debounced server save. */
  persist(state: GameState): void {
    if (this.skipSaveCheck()) {
      devLog('[GamePersistence] Skipped (skipSave)');
      return;
    }
    saveState(state);
    if (this.authenticated) {
      this.debouncedServerSave(state);
    }
  }

  /** Called on milestone events — upgrades pending server save to immediate via microtask. */
  persistMilestone(): void {
    if (!this.authenticated || this.milestonePending) return;
    this.milestonePending = true;
    queueMicrotask(() => {
      this.milestonePending = false;
      if (this.skipSaveCheck()) return;
      // Cancel pending debounce — this immediate save supersedes it
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = null;
      }
      const state = this.getState();
      if (state) {
        console.log('[GamePersistence] Milestone save');
        fetch(SAVE_ENDPOINT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state }),
        }).catch((err) => console.error('[GamePersistence] Milestone server save failed:', err));
      }
    });
  }

  /** Emergency save for beforeunload — sync localStorage + keepalive server save. */
  flush(state: GameState): void {
    saveState(state);
    if (this.authenticated) {
      fetch(SAVE_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
        keepalive: true,
      }).catch(() => {});
    }
  }

  /** Cancel pending timers. Call on component teardown. */
  destroy(): void {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
  }

  private debouncedServerSave(state: GameState): void {
    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.debounceTimeout = null;
      fetch(SAVE_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      }).catch((err) => console.error('[GamePersistence] Server save failed:', err));
    }, DEBOUNCE_MS);
  }
}
