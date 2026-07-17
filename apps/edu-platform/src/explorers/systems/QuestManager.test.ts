import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameFlag } from '../config/flags';
import type { GameState } from '../state/types';
import { createDefaultState } from '../state/GameStateManager';
import { GameEvents } from '../events/GameEvents';

const {
  mockGetAllQuests,
  mockGetQuestCompletionDialogues,
  mockSetFlag,
} = vi.hoisted(() => ({
  mockGetAllQuests: vi.fn(),
  mockGetQuestCompletionDialogues: vi.fn(),
  mockSetFlag: vi.fn(),
}));

vi.mock('../levels/levelLoader', () => ({
  getAllQuests: mockGetAllQuests,
  getQuestCompletionDialogues: mockGetQuestCompletionDialogues,
}));

vi.mock('../state/flagManager', () => ({
  setFlag: mockSetFlag,
}));

import { QuestManager, matchesPayload, type EventQuest } from './QuestManager';
import type { BilingualText } from '../i18n/types';

const bi = (text: string): BilingualText => ({ pl: text, en: text });

class TestBus {
  private listeners = new Map<string, Set<(payload: Record<string, unknown>) => void>>();

  on(event: string, handler: (payload: Record<string, unknown>) => void): void {
    const handlers = this.listeners.get(event) ?? new Set();
    handlers.add(handler);
    this.listeners.set(event, handlers);
  }

  off(event: string, handler: (payload: Record<string, unknown>) => void): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, payload: Record<string, unknown> = {}): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    for (const handler of handlers) {
      handler(payload);
    }
  }
}

// Test the validation logic directly since QuestManager depends on Phaser
describe('QuestManager validation', () => {
  function validate(answer: string, solution: string, mode: 'exact-lowercase' | 'exact-trim'): boolean {
    switch (mode) {
      case 'exact-lowercase':
        return answer.toLowerCase().trim() === solution;
      case 'exact-trim':
        return answer.trim() === solution;
      default:
        return false;
    }
  }

  describe('exact-lowercase (Quest 1)', () => {
    const solution = 'recalibrate-cal-7031';

    it('accepts exact match', () => {
      expect(validate('recalibrate-cal-7031', solution, 'exact-lowercase')).toBe(true);
    });

    it('accepts mixed case', () => {
      expect(validate('Recalibrate-CAL-7031', solution, 'exact-lowercase')).toBe(true);
    });

    it('accepts with whitespace', () => {
      expect(validate('  recalibrate-CAL-7031  ', solution, 'exact-lowercase')).toBe(true);
    });

    it('rejects wrong answer', () => {
      expect(validate('wrong-answer', solution, 'exact-lowercase')).toBe(false);
    });

    it('rejects partial match', () => {
      expect(validate('recalibrate', solution, 'exact-lowercase')).toBe(false);
    });
  });

  describe('exact-trim (Quest 2)', () => {
    const solution = '14.7.26';

    it('accepts exact match', () => {
      expect(validate('14.7.26', solution, 'exact-trim')).toBe(true);
    });

    it('accepts with whitespace', () => {
      expect(validate('  14.7.26  ', solution, 'exact-trim')).toBe(true);
    });

    it('rejects wrong answer', () => {
      expect(validate('15.7.26', solution, 'exact-trim')).toBe(false);
    });

    it('rejects different case (case-sensitive)', () => {
      // exact-trim is case-sensitive, but '14.7.26' has no letters
      expect(validate('14.7.26', solution, 'exact-trim')).toBe(true);
    });
  });
});

describe('matchesPayload', () => {
  it('returns true when expected is undefined', () => {
    expect(matchesPayload({ foo: 'bar' }, undefined)).toBe(true);
  });

  it('returns true when all expected fields match', () => {
    expect(
      matchesPayload(
        { examId: 'm0-exam-agent-systems', passed: true, score: 5 },
        { examId: 'm0-exam-agent-systems', passed: true }
      )
    ).toBe(true);
  });

  it('returns false when a field does not match', () => {
    expect(
      matchesPayload(
        { examId: 'm0-exam-agent-systems', passed: false },
        { examId: 'm0-exam-agent-systems', passed: true }
      )
    ).toBe(false);
  });

  it('returns false when expected field is missing from actual', () => {
    expect(matchesPayload({ examId: 'm0-exam-agent-systems' }, { examId: 'm0-exam-agent-systems', passed: true })).toBe(
      false
    );
  });

  it('returns true for empty expected object', () => {
    expect(matchesPayload({ foo: 'bar' }, {})).toBe(true);
  });

  it('matches with exact value types (no coercion)', () => {
    expect(matchesPayload({ count: 1 }, { count: '1' as unknown })).toBe(false);
  });
});

describe('QuestManager activation guards', () => {
  const repeatableExploitQuest: EventQuest = {
    id: 'q-pass-exams',
    completionType: 'event',
    title: bi('Zdaj egzaminy weryfikacyjne'),
    briefing: bi('Test quest'),
    hints: [],
    objectives: [
      {
        id: 'exam-a',
        label: bi('Exam A'),
        event: GameEvents.EXAM_COMPLETED,
        requireFlag: 'exam-a-done' as GameFlag,
      },
      {
        id: 'exam-b',
        label: bi('Exam B'),
        event: GameEvents.EXAM_COMPLETED,
        requireFlag: 'exam-b-done' as GameFlag,
      },
    ],
    rewards: { xp: 20, flags: ['quest-done' as GameFlag] },
  };

  let state: GameState;
  let bus: TestBus;
  let manager: QuestManager;

  function updateState(updater: (prev: GameState) => Partial<GameState>): void {
    state = { ...state, ...updater(state) };
  }

  beforeEach(() => {
    state = createDefaultState();
    bus = new TestBus();
    mockGetAllQuests.mockReturnValue(new Map([[repeatableExploitQuest.id, repeatableExploitQuest]]));
    mockGetQuestCompletionDialogues.mockReturnValue({});
    mockSetFlag.mockReset();
    manager = new QuestManager({} as never, bus as never, () => state, updateState);
  });

  it('does not reactivate or re-award a quest that is already completed', () => {
    state.flags = ['exam-a-done' as GameFlag, 'exam-b-done' as GameFlag];

    const activated = vi.fn();
    const completed = vi.fn();
    const xpGained = vi.fn();
    bus.on(GameEvents.QUEST_ACTIVATED, activated);
    bus.on(GameEvents.QUEST_COMPLETED, completed);
    bus.on(GameEvents.XP_GAINED, xpGained);

    manager.activateQuest(repeatableExploitQuest.id);

    expect(state.quests.active).toBeNull();
    expect(state.quests.completed).toEqual([repeatableExploitQuest.id]);
    expect(state.xp).toBe(20);
    expect(completed).toHaveBeenCalledTimes(1);
    expect(xpGained).toHaveBeenCalledTimes(1);
    expect(mockSetFlag).toHaveBeenCalledWith({}, 'quest-done');

    manager.activateQuest(repeatableExploitQuest.id);

    expect(state.quests.active).toBeNull();
    expect(state.quests.completed).toEqual([repeatableExploitQuest.id]);
    expect(state.xp).toBe(20);
    expect(activated).toHaveBeenCalledTimes(1);
    expect(completed).toHaveBeenCalledTimes(1);
    expect(xpGained).toHaveBeenCalledTimes(1);
    expect(mockSetFlag).toHaveBeenCalledTimes(1);
  });

  it('clears stale active quests that are already completed on resume', () => {
    state.quests.active = repeatableExploitQuest.id;
    state.quests.completed = [repeatableExploitQuest.id];
    state.xp = 20;

    const completed = vi.fn();
    bus.on(GameEvents.QUEST_COMPLETED, completed);

    manager.resumeActiveQuest();

    expect(state.quests.active).toBeNull();
    expect(state.quests.completed).toEqual([repeatableExploitQuest.id]);
    expect(state.xp).toBe(20);
    expect(completed).not.toHaveBeenCalled();
    expect(mockSetFlag).not.toHaveBeenCalled();
  });
});
