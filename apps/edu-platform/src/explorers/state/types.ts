import type { GameFlag } from '../config/flags';
import type { MapKey } from '../config/mapRegistry';

export type FacingDirection = 'down' | 'up' | 'left' | 'right';

export interface GameState {
  version: 2;
  flags: GameFlag[];
  currentMap: MapKey;
  position: { x: number; y: number };
  facing: FacingDirection;
  quests: {
    active: string | null;
    completed: string[];
    objectivesDone: Record<string, string[]>;
  };
  hintIndex: Record<string, number>;
  xp: number;
  commandHistory: string[];
  bookmarks: BookmarkEntry[];
  needsPositionReset?: boolean;
}

export interface BookmarkEntry {
  id: string;
  url: string;
  title: string;
  addedAt: number;
}

export interface PendingGrant {
  id: string;
  quest_id: string;
  questTitle: string;
  xp: number;
  flags: GameFlag[];
  timestamp: number;
}
