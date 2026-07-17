import type Phaser from 'phaser';
import { GameEvents } from '../events/GameEvents';
import type { GameState } from '../state/types';

export interface TerminalBusHandlers {
  onFlagSet(flag: string): void;
  onStateChanged(state: GameState): void;
  onQuestActivated(questId: string, title: string): void;
  onQuestCompleted(questId: string): void;
  onQuestObjectiveCompleted(objectiveLabel: string, doneCount: number, totalCount: number): void;
  onPreviewDismissed(): void;
}

export function createTerminalBus(bus: Phaser.Events.EventEmitter, handlers: TerminalBusHandlers) {
  // Wrap handlers to match Phaser event payload shapes
  const wrapped = {
    onFlagSet: (p: { flag: string }) => handlers.onFlagSet(p.flag),
    onStateChanged: (p: { state: GameState }) => handlers.onStateChanged(p.state),
    onQuestActivated: (p: { questId: string; title: string }) =>
      handlers.onQuestActivated(p.questId, p.title),
    onQuestCompleted: (p: { questId: string }) => handlers.onQuestCompleted(p.questId),
    onQuestObjectiveCompleted: (p: { objectiveLabel: string; doneCount: number; totalCount: number }) =>
      handlers.onQuestObjectiveCompleted(p.objectiveLabel, p.doneCount, p.totalCount),
    onPreviewDismissed: () => handlers.onPreviewDismissed(),
  };

  return {
    subscribe() {
      bus.on(GameEvents.FLAG_SET, wrapped.onFlagSet);
      bus.on(GameEvents.STATE_CHANGED, wrapped.onStateChanged);
      bus.on(GameEvents.QUEST_ACTIVATED, wrapped.onQuestActivated);
      bus.on(GameEvents.QUEST_COMPLETED, wrapped.onQuestCompleted);
      bus.on(GameEvents.QUEST_OBJECTIVE_COMPLETED, wrapped.onQuestObjectiveCompleted);
      bus.on(GameEvents.PREVIEW_DISMISSED, wrapped.onPreviewDismissed);
    },
    unsubscribe() {
      bus.off(GameEvents.FLAG_SET, wrapped.onFlagSet);
      bus.off(GameEvents.STATE_CHANGED, wrapped.onStateChanged);
      bus.off(GameEvents.QUEST_ACTIVATED, wrapped.onQuestActivated);
      bus.off(GameEvents.QUEST_COMPLETED, wrapped.onQuestCompleted);
      bus.off(GameEvents.QUEST_OBJECTIVE_COMPLETED, wrapped.onQuestObjectiveCompleted);
      bus.off(GameEvents.PREVIEW_DISMISSED, wrapped.onPreviewDismissed);
    },
  };
}
