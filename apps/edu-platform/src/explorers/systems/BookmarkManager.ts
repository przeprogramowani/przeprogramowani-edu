import type Phaser from 'phaser';
import type { BookmarkEntry, GameState } from '../state/types';
import { GameEvents } from '../events/GameEvents';
import { devLog } from '../utils/logger';

function bookmarkId(url: string): string {
  return url.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

export function addBookmark(
  game: Phaser.Game,
  bus: Phaser.Events.EventEmitter,
  url: string,
  title: string
): void {
  const state = game.registry.get('demoGameState') as GameState;
  const id = bookmarkId(url);

  if (state.bookmarks.some((b) => b.id === id)) {
    devLog(`[BookmarkManager] Bookmark already exists: ${id}`);
    // Still open preview even if duplicate
    bus.emit(GameEvents.PREVIEW_SHOW, { url, title });
    return;
  }

  const entry: BookmarkEntry = { id, url, title, addedAt: Date.now() };
  const next = { ...state, bookmarks: [...state.bookmarks, entry] };
  game.registry.set('demoGameState', next);
  bus.emit(GameEvents.STATE_CHANGED, { state: next });
  bus.emit(GameEvents.PREVIEW_SHOW, { url, title });
  devLog(`[BookmarkManager] Bookmark added: ${title} (${url})`);
}

export function getBookmarks(state: GameState): BookmarkEntry[] {
  return state.bookmarks ?? [];
}
