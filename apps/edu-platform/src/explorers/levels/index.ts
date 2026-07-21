import type { LevelManifest } from './types';
import type { QuestDefinition } from '../systems/QuestManager';
import { manifest as m0Awakening } from './m0-awakening/manifest';
import { manifest as m0CrewRoom } from './m0-crew-room/manifest';
import { manifest as m0ExamRoom } from './m0-exam-room/manifest';
import { manifest as m0CoreAi } from './m0-core-ai/manifest';
import { manifest as m1LandingPad } from './m1-landing-pad/manifest';
import { manifest as m1EchoDepths } from './m1-echo-depths/manifest';
import { manifest as m1ShaftControl } from './m1-shaft-control/manifest';
import { manifest as m1ProfileVault } from './m1-profile-vault/manifest';
import { manifest as m1UplinkBay } from './m1-uplink-bay/manifest';
import { manifest as m2Planning } from './m2-planning/manifest';
import { manifest as m2StagingYard } from './m2-staging-yard/manifest';
import { manifest as m2DraftingHall } from './m2-drafting-hall/manifest';
import { manifest as m2AssemblyLine } from './m2-assembly-line/manifest';
import { manifest as m2PlanningCore } from './m2-planning-core/manifest';
import { manifest as debugNpcPlayground } from './debug-npc-playground/manifest';

const LEVELS = [
  m0Awakening,
  m0CrewRoom,
  m0ExamRoom,
  m0CoreAi,
  m1LandingPad,
  m1EchoDepths,
  m1ShaftControl,
  m1ProfileVault,
  m1UplinkBay,
  m2Planning,
  m2StagingYard,
  m2DraftingHall,
  m2AssemblyLine,
  m2PlanningCore,
  debugNpcPlayground,
] as const;

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
