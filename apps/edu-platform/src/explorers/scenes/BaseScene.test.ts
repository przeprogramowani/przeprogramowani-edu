import { describe, expect, it, vi } from 'vitest';
import type { GameFlag } from '../config/flags';
import type { GameState } from '../state/types';
import { BaseScene } from './BaseScene';

vi.mock('phaser', () => ({
  default: {
    Scene: class {},
    Scenes: { Events: { SHUTDOWN: 'shutdown', DESTROY: 'destroy' } },
  },
}));

function createState(flags: GameFlag[]): GameState {
  return {
    version: 2,
    flags,
    currentMap: 'm1-echo-depths',
    position: { x: 0, y: 0 },
    facing: 'right',
    quests: { active: null, completed: [], objectivesDone: {} },
    hintIndex: {},
    xp: 0,
    commandHistory: [],
    bookmarks: [],
  };
}

describe('BaseScene flag cache', () => {
  it('rebuilds after an external state merge replaces the flags array', () => {
    let state = createState([]);
    const scene = Object.create(BaseScene.prototype) as BaseScene;
    Object.defineProperty(scene, 'gameState', { get: () => state });
    Object.defineProperty(scene, 'registry', { value: { get: () => undefined } });

    const initialFlags = scene.flagsSet;
    expect(scene.hasFlag('m1-camp-online')).toBe(false);

    state = createState(['m1-camp-online']);

    expect(scene.flagsSet).not.toBe(initialFlags);
    expect(scene.hasFlag('m1-camp-online')).toBe(true);
  });
});
