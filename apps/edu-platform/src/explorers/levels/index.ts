import type { LevelManifest } from './types';
import type { QuestDefinition } from '../systems/QuestManager';
import { manifest as m0Awakening } from './m0-awakening/manifest';
import { manifest as m0CrewRoom } from './m0-crew-room/manifest';
import { manifest as m0ExamRoom } from './m0-exam-room/manifest';
import { manifest as m0CoreAi } from './m0-core-ai/manifest';

const LEVELS = [m0Awakening, m0CrewRoom, m0ExamRoom, m0CoreAi] as const;

/** All level manifests, keyed by map ID */
export const ALL_LEVELS: ReadonlyMap<string, LevelManifest> = new Map(
  LEVELS.map((level) => [level.id, level] as const),
);

/** Get a level manifest by map key */
export function getLevel(mapKey: string): LevelManifest | undefined {
  return ALL_LEVELS.get(mapKey);
}

/** Server-side: flatten all quest definitions from all manifests into a Map (includes answerHash) */
export function getAllQuests(): Map<string, QuestDefinition> {
  const map = new Map<string, QuestDefinition>();
  for (const manifest of ALL_LEVELS.values()) {
    for (const quest of manifest.quests ?? []) {
      map.set(quest.id, quest);
    }
  }
  return map;
}
