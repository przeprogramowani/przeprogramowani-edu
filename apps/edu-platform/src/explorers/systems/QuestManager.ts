import type Phaser from 'phaser';
import type { GameFlag } from '../config/flags';
import { GameEvents } from '../events/GameEvents';
import type { GameEventValue } from '../events/GameEvents';
import { setFlag } from '../state/flagManager';
import { devLog } from '../utils/logger';
import type { GameState } from '../state/types';
import { getAllQuests, getQuestCompletionDialogues } from '../levels/levelLoader';
import type { BilingualText } from '../i18n/types';
import { localized } from '../i18n/types';

// Shared base for all quest types
interface BaseQuestDefinition {
  id: string;
  title: BilingualText;
  briefing: BilingualText;
  hints: BilingualText[];
  rewards: { xp: number; flags: GameFlag[] };
}

// Text-answer quests (existing, solved via /solve command)
export interface TextAnswerQuest extends BaseQuestDefinition {
  completionType: 'text-answer';
  inputPayload: string;
  solution: string;
  validation: 'exact-lowercase' | 'exact-trim';
}

// Event-based quest objective
export interface EventObjective {
  id: string;
  /** Label shown in /quest command */
  label: BilingualText;
  /** GameEvents value to listen for */
  event: GameEventValue;
  /** Payload properties that must match for this objective to be satisfied */
  matchPayload?: Record<string, unknown>;
  /** If this flag is already set, objective is immediately satisfied on quest activation */
  requireFlag?: GameFlag;
}

// Event-based quests (auto-complete when game events fire)
export interface EventQuest extends BaseQuestDefinition {
  completionType: 'event';
  objectives: EventObjective[];
}

// External API quests (solved via POST /api/game/submit with Bearer token)
export interface ApiAnswerQuest extends BaseQuestDefinition {
  completionType: 'api-answer';
  /** SHA-256 hex digest of canonical answer (trim + lowercase) — server-side only, stripped from public API */
  answerHash: string;
  /** Hint returned to Navigator on wrong answer */
  hint: BilingualText;
}

export type QuestDefinition = TextAnswerQuest | EventQuest | ApiAnswerQuest;

/** Check if actual payload matches expected payload criteria */
export function matchesPayload(
  actual: Record<string, unknown>,
  expected?: Record<string, unknown>
): boolean {
  if (!expected) return true;
  return Object.entries(expected).every(([key, value]) => actual[key] === value);
}

export class QuestManager {
  private game: Phaser.Game;
  private bus: Phaser.Events.EventEmitter;
  private getState: () => GameState;
  private setState: (updater: (prev: GameState) => Partial<GameState>) => void;
  private questDefs: Map<string, QuestDefinition>;
  private questCompletionDialogues: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private activeEventListeners: Array<{ event: string; handler: (...args: any[]) => void }> = [];

  constructor(
    game: Phaser.Game,
    bus: Phaser.Events.EventEmitter,
    getState: () => GameState,
    setState: (updater: (prev: GameState) => Partial<GameState>) => void
  ) {
    this.game = game;
    this.bus = bus;
    this.getState = getState;
    this.setState = setState;
    this.questDefs = getAllQuests();
    this.questCompletionDialogues = getQuestCompletionDialogues();
  }

  getActiveQuest(): QuestDefinition | null {
    const state = this.getState();
    if (!state.quests.active) return null;
    return this.questDefs.get(state.quests.active) ?? null;
  }

  getQuestDef(id: string): QuestDefinition | null {
    return this.questDefs.get(id) ?? null;
  }

  activateQuest(questId: string): void {
    const def = this.questDefs.get(questId);
    if (!def) return;
    const state = this.getState();

    if (state.quests.completed.includes(questId)) {
      devLog(`[QuestManager] Ignored activation for completed quest: ${localized(def.title)}`);
      return;
    }

    if (state.quests.active === questId) {
      devLog(`[QuestManager] Ignored duplicate activation for active quest: ${localized(def.title)}`);
      return;
    }

    this.cleanupEventListeners();

    this.setState((s) => ({
      quests: { ...s.quests, active: questId },
    }));

    this.bus.emit(GameEvents.QUEST_ACTIVATED, { questId, title: localized(def.title) });
    devLog(`[QuestManager] Quest activated: ${localized(def.title)}`);

    if (def.completionType === 'event') {
      this.setupEventListeners(def);
    }
  }

  /** Re-setup event listeners if an event quest was active on game reload */
  resumeActiveQuest(): void {
    const state = this.getState();
    if (!state.quests.active) return;

    if (state.quests.completed.includes(state.quests.active)) {
      this.setState((s) => ({
        quests: { ...s.quests, active: null },
      }));
      devLog(`[QuestManager] Cleared stale active quest already marked completed: ${state.quests.active}`);
      return;
    }

    const def = this.questDefs.get(state.quests.active);
    if (!def || def.completionType !== 'event') return;

    this.setupEventListeners(def);
    devLog(`[QuestManager] Resumed event listeners for: ${localized(def.title)}`);
  }

  /** Validate an answer against the active quest. Returns true if correct. */
  submitAnswer(answer: string): boolean {
    const quest = this.getActiveQuest();
    if (!quest) return false;
    if (quest.completionType === 'event') return false;
    if (quest.completionType === 'api-answer') return false; // handled by external API

    const correct = this.validate(answer, quest.solution, quest.validation);
    if (!correct) return false;

    this.completeQuest(quest);
    return true;
  }

  completeQuestById(questId: string): void {
    const quest = this.questDefs.get(questId);
    if (!quest) return;

    if (this.getState().quests.active === questId) {
      this.cleanupEventListeners();
    }

    this.completeQuest(quest);
  }

  getObjectiveProgress(questId: string): { objective: EventObjective; done: boolean }[] | null {
    const def = this.questDefs.get(questId);
    if (!def || def.completionType !== 'event') return null;

    const state = this.getState();
    const doneIds = state.quests.objectivesDone[questId] ?? [];

    return def.objectives.map((obj) => ({
      objective: obj,
      done: doneIds.includes(obj.id),
    }));
  }

  /** Clean up all active event listeners */
  cleanupEventListeners(): void {
    for (const { event, handler } of this.activeEventListeners) {
      this.bus.off(event, handler);
    }
    this.activeEventListeners = [];
    devLog('[QuestManager] Event listeners cleaned up');
  }

  private setupEventListeners(quest: EventQuest): void {
    // Check already-satisfied objectives via flags
    const state = this.getState();
    const alreadyDone: string[] = [];

    for (const obj of quest.objectives) {
      if (obj.requireFlag && state.flags.includes(obj.requireFlag)) {
        alreadyDone.push(obj.id);
      }
    }

    // Persist already-done objectives
    if (alreadyDone.length > 0) {
      this.setState((s) => ({
        quests: {
          ...s.quests,
          objectivesDone: {
            ...s.quests.objectivesDone,
            [quest.id]: alreadyDone,
          },
        },
      }));
    }

    // Check if all already done
    if (alreadyDone.length >= quest.objectives.length) {
      this.completeQuest(quest);
      return;
    }

    // Subscribe to events for remaining objectives
    const remainingObjectives = quest.objectives.filter((o) => !alreadyDone.includes(o.id));

    for (const obj of remainingObjectives) {
      const handler = (payload: Record<string, unknown>) => {
        this.onEventObjective(quest, obj, payload);
      };
      this.bus.on(obj.event, handler);
      this.activeEventListeners.push({ event: obj.event, handler });
    }

    devLog(
      `[QuestManager] Event listeners set up: ${remainingObjectives.length} remaining objectives`
    );
  }

  private onEventObjective(
    quest: EventQuest,
    objective: EventObjective,
    payload: Record<string, unknown>
  ): void {
    // Check payload match
    if (!matchesPayload(payload, objective.matchPayload)) return;

    // Mark objective done
    const state = this.getState();
    const currentDone = state.quests.objectivesDone[quest.id] ?? [];
    if (currentDone.includes(objective.id)) return;

    const updatedDone = [...currentDone, objective.id];

    this.setState((s) => ({
      quests: {
        ...s.quests,
        objectivesDone: {
          ...s.quests.objectivesDone,
          [quest.id]: updatedDone,
        },
      },
    }));

    devLog(
      `[QuestManager] Objective completed: ${localized(objective.label)} (${updatedDone.length}/${quest.objectives.length})`
    );

    // Notify terminal about objective progress
    this.bus.emit(GameEvents.QUEST_OBJECTIVE_COMPLETED, {
      questId: quest.id,
      objectiveLabel: localized(objective.label),
      doneCount: updatedDone.length,
      totalCount: quest.objectives.length,
    });

    // Check if all objectives done
    if (updatedDone.length >= quest.objectives.length) {
      this.cleanupEventListeners();
      this.completeQuest(quest);
    }
  }

  private completeQuest(quest: QuestDefinition): void {
    const state = this.getState();

    if (state.quests.completed.includes(quest.id)) {
      if (state.quests.active === quest.id) {
        this.setState((s) => ({
          quests: { ...s.quests, active: null },
        }));
      }
      devLog(`[QuestManager] Ignored duplicate completion for: ${localized(quest.title)}`);
      return;
    }

    // Grant XP
    const newXp = state.xp + quest.rewards.xp;

    // Mark completed
    this.setState((s) => ({
      quests: {
        ...s.quests,
        active: null,
        completed: [...s.quests.completed, quest.id],
      },
      xp: newXp,
    }));

    // Emit XP gained
    this.bus.emit(GameEvents.XP_GAINED, { amount: quest.rewards.xp, total: newXp });

    // Emit quest completed
    this.bus.emit(GameEvents.QUEST_COMPLETED, {
      questId: quest.id,
      rewards: quest.rewards,
    });

    // Set reward flags
    for (const flag of quest.rewards.flags) {
      setFlag(this.game, flag);
    }

    // Trigger completion dialogue
    const dialogueId = this.questCompletionDialogues[quest.id];
    if (dialogueId) {
      this.bus.emit(GameEvents.DIALOGUE_SHOW, { dialogueId });
    }

    devLog(`[QuestManager] Quest completed: ${localized(quest.title)} (+${quest.rewards.xp} XP)`);
  }

  getHint(): string | null {
    const quest = this.getActiveQuest();
    if (!quest) return null;

    const state = this.getState();
    const idx = state.hintIndex[quest.id] ?? 0;

    if (idx >= quest.hints.length) return null;

    // Increment hint index
    this.setState((s) => ({
      hintIndex: { ...s.hintIndex, [quest.id]: idx + 1 },
    }));

    return localized(quest.hints[idx]);
  }

  getRemainingHints(): number {
    const quest = this.getActiveQuest();
    if (!quest) return 0;
    const state = this.getState();
    const idx = state.hintIndex[quest.id] ?? 0;
    return Math.max(0, quest.hints.length - idx);
  }

  private validate(
    answer: string,
    solution: string,
    mode: 'exact-lowercase' | 'exact-trim'
  ): boolean {
    switch (mode) {
      case 'exact-lowercase':
        return answer.toLowerCase().trim() === solution;
      case 'exact-trim':
        return answer.trim() === solution;
      default:
        return false;
    }
  }
}
