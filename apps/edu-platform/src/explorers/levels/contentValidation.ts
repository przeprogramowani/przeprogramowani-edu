import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_FLAGS } from '../config/flags';
import { NPC_COLOR_VARIANTS, NPC_TYPE_ROWS, TILE_SIZE } from '../config/constants';
import { QA_MAP_SPAWNS, type QaMapSpawn } from '../config/qaMapSpawns';
import { isSpawnPositionValid } from '../state/spawnValidation';
import { ALL_LEVELS } from './index';
import { NAV_DESTINATIONS } from './navigationDestinations';
import { parseLevelSource } from './mapAuthoring/parseSource';

interface TiledProperty {
  name: string;
  value: unknown;
}

interface TiledObject {
  name?: string;
  type?: string;
  properties?: TiledProperty[];
}

interface TiledLayer {
  name?: string;
  data?: number[];
  objects?: TiledObject[];
}

interface TiledMap {
  width?: number;
  height?: number;
  layers?: TiledLayer[];
}

interface ParsedZone {
  id: string;
  type: string;
  properties: Record<string, unknown>;
}

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(THIS_DIR, '../../..');
const MAPS_DIR = path.join(PROJECT_ROOT, 'public/game/maps');
const LEVELS_DIR = path.join(PROJECT_ROOT, 'src/explorers/levels');

function isKnownFlag(flag: string): boolean {
  return ALL_FLAGS.includes(flag as (typeof ALL_FLAGS)[number]) || flag.startsWith('arcade:');
}

function getMap(mapKey: string): TiledMap {
  const mapPath = path.join(MAPS_DIR, `${mapKey}.json`);
  if (!existsSync(mapPath)) {
    throw new Error(`Missing map JSON for "${mapKey}" at ${mapPath}`);
  }

  return JSON.parse(readFileSync(mapPath, 'utf8')) as TiledMap;
}

function getZonesForMap(mapKey: string): ParsedZone[] {
  const map = getMap(mapKey);
  const zonesLayer = map.layers?.find((layer) => layer.name === 'Zones');
  const objects = zonesLayer?.objects ?? [];

  return objects.map((object) => {
    const properties = Object.fromEntries((object.properties ?? []).map((property) => [property.name, property.value]));
    return {
      id: String(properties.id ?? object.name ?? ''),
      type: object.type ?? 'trigger',
      properties,
    };
  });
}

function isSafeAuthoredSpawn(mapKey: string, spawn: QaMapSpawn): boolean {
  const sourcePath = path.join(LEVELS_DIR, mapKey, 'map.level.yaml');
  if (!existsSync(sourcePath)) return false;

  const source = parseLevelSource(readFileSync(sourcePath, 'utf8'), mapKey);
  const { x, y } = spawn;
  if (!Number.isInteger(x) || !Number.isInteger(y) || source.cells[y]?.[x] !== 'FLOOR') {
    return false;
  }
  if (source.props.some((prop) => prop.solid && prop.at[0] === x && prop.at[1] === y)) {
    return false;
  }

  const targetMap = getMap(mapKey);
  const walls = targetMap.layers?.find((layer) => layer.name === 'Walls')?.data;
  const width = targetMap.width;
  const height = targetMap.height;
  if (typeof width !== 'number' || typeof height !== 'number' || !walls || walls.length !== width * height) {
    return false;
  }

  return isSpawnPositionValid(
    {
      width,
      height,
      collisions: Array.from({ length: height }, (_, tileY) =>
        walls.slice(tileY * width, (tileY + 1) * width).map((tile) => tile !== 0),
      ),
    },
    { x: x * TILE_SIZE, y: y * TILE_SIZE },
  );
}

export function validateExplorersContent(): string[] {
  const errors: string[] = [];
  const globalDialogueOwners = new Map<string, string>();
  const globalQuestOwners = new Map<string, string>();
  const globalExamOwners = new Map<string, string>();
  const globalArcadeOwners = new Map<string, string>();
  const globalDialogueIds = new Set<string>();
  const globalQuestIds = new Set<string>();
  const globalExamIds = new Set<string>();
  const globalArcadeIds = new Set<string>();

  const destinationIds = new Set<string>();
  for (const destination of NAV_DESTINATIONS) {
    if (destinationIds.has(destination.id)) {
      errors.push(`Duplicate navigation destination ID "${destination.id}"`);
    }
    destinationIds.add(destination.id);

    for (const flag of destination.requiredFlags) {
      if (!isKnownFlag(flag)) {
        errors.push(`Navigation destination "${destination.id}" references unknown required flag "${flag}"`);
      }
    }

    if (!destination.targetMap) continue;
    if (!ALL_LEVELS.has(destination.targetMap)) {
      errors.push(`Navigation destination "${destination.id}" references unknown target map "${destination.targetMap}"`);
      continue;
    }

    const { spawnX, spawnY } = destination;
    if (!isSafeAuthoredSpawn(destination.targetMap, { x: spawnX, y: spawnY })) {
      errors.push(
        `Navigation destination "${destination.id}" spawns at (${spawnX}, ${spawnY}) in "${destination.targetMap}", which is not a safe authored floor position`,
      );
    }
  }

  for (const mapKey of ALL_LEVELS.keys()) {
    const spawn = QA_MAP_SPAWNS[mapKey];
    if (!spawn) {
      errors.push(`Map "${mapKey}" is missing a QA selector spawn`);
    } else if (!isSafeAuthoredSpawn(mapKey, spawn)) {
      errors.push(`Map "${mapKey}" has an unsafe QA selector spawn at (${spawn.x}, ${spawn.y})`);
    }
  }
  for (const mapKey of Object.keys(QA_MAP_SPAWNS)) {
    if (!ALL_LEVELS.has(mapKey)) {
      errors.push(`QA selector spawn references unknown map "${mapKey}"`);
    }
  }

  for (const [mapKey, manifest] of ALL_LEVELS) {
    for (const dialogueId of Object.keys(manifest.dialogues)) {
      if (globalDialogueOwners.has(dialogueId)) {
        errors.push(`Duplicate dialogue ID "${dialogueId}" in ${mapKey} and ${globalDialogueOwners.get(dialogueId)}`);
      } else {
        globalDialogueOwners.set(dialogueId, mapKey);
        globalDialogueIds.add(dialogueId);
      }
    }

    for (const quest of manifest.quests ?? []) {
      if (globalQuestOwners.has(quest.id)) {
        errors.push(`Duplicate quest ID "${quest.id}" in ${mapKey} and ${globalQuestOwners.get(quest.id)}`);
      } else {
        globalQuestOwners.set(quest.id, mapKey);
        globalQuestIds.add(quest.id);
      }
    }

    for (const exam of manifest.exams ?? []) {
      if (globalExamOwners.has(exam.id)) {
        errors.push(`Duplicate exam ID "${exam.id}" in ${mapKey} and ${globalExamOwners.get(exam.id)}`);
      } else {
        globalExamOwners.set(exam.id, mapKey);
        globalExamIds.add(exam.id);
      }
    }

    for (const arcadeGame of manifest.arcadeGames ?? []) {
      if (globalArcadeOwners.has(arcadeGame.id)) {
        errors.push(`Duplicate arcade game ID "${arcadeGame.id}" in ${mapKey} and ${globalArcadeOwners.get(arcadeGame.id)}`);
      } else {
        globalArcadeOwners.set(arcadeGame.id, mapKey);
        globalArcadeIds.add(arcadeGame.id);
      }
    }
  }

  for (const [mapKey, manifest] of ALL_LEVELS) {
    const zones = getZonesForMap(mapKey);
    const zoneIds = new Set<string>();
    const localExamIds = new Set((manifest.exams ?? []).map((exam) => exam.id));
    const localArcadeIds = new Set((manifest.arcadeGames ?? []).map((game) => game.id));

    for (const zone of zones) {
      if (!zone.id) {
        errors.push(`Map "${mapKey}" has a zone without an id property`);
        continue;
      }

      if (zoneIds.has(zone.id)) {
        errors.push(`Map "${mapKey}" has duplicate zone id "${zone.id}"`);
      } else {
        zoneIds.add(zone.id);
      }

      if (zone.type === 'exam') {
        const examId = zone.properties.examId;
        if (typeof examId !== 'string' || !localExamIds.has(examId)) {
          errors.push(`Map "${mapKey}" exam zone "${zone.id}" references unknown examId "${String(examId)}"`);
        }
      }

      if (zone.type === 'arcade') {
        const arcadeGameId = zone.properties.arcadeGameId;
        if (typeof arcadeGameId !== 'string' || !localArcadeIds.has(arcadeGameId)) {
          errors.push(`Map "${mapKey}" arcade zone "${zone.id}" references unknown arcadeGameId "${String(arcadeGameId)}"`);
        }
      }

      if (zone.type === 'npc') {
        const npcType = zone.properties.npcType;
        if (typeof npcType !== 'string' || !(npcType in NPC_TYPE_ROWS)) {
          errors.push(`Map "${mapKey}" NPC zone "${zone.id}" references unknown npcType "${String(npcType)}"`);
        }
        const npcVariant = zone.properties.npcVariant;
        if (npcVariant !== undefined && (typeof npcVariant !== 'string' || !(npcVariant in NPC_COLOR_VARIANTS))) {
          errors.push(`Map "${mapKey}" NPC zone "${zone.id}" references unknown npcVariant "${String(npcVariant)}"`);
        }
      }

      const requiredFlags = zone.properties.requiredFlags;
      if (typeof requiredFlags === 'string') {
        for (const flag of requiredFlags.split(',').map((part) => part.trim()).filter(Boolean)) {
          if (!isKnownFlag(flag)) {
            errors.push(`Map "${mapKey}" zone "${zone.id}" references unknown required flag "${flag}"`);
          }
        }
      }
    }

    for (const [dialogueKey, sequence] of Object.entries(manifest.dialogues)) {
      if (sequence.id !== dialogueKey) {
        errors.push(`Dialogue "${dialogueKey}" in ${mapKey} has mismatched inner id "${sequence.id}"`);
      }

      if (sequence.onComplete?.activateQuest && !globalQuestIds.has(sequence.onComplete.activateQuest)) {
        errors.push(`Dialogue "${dialogueKey}" in ${mapKey} activates unknown quest "${sequence.onComplete.activateQuest}"`);
      }

      if (sequence.onComplete?.completeQuest && !globalQuestIds.has(sequence.onComplete.completeQuest)) {
        errors.push(`Dialogue "${dialogueKey}" in ${mapKey} completes unknown quest "${sequence.onComplete.completeQuest}"`);
      }

      for (const flag of sequence.onComplete?.setFlags ?? []) {
        if (!isKnownFlag(flag)) {
          errors.push(`Dialogue "${dialogueKey}" in ${mapKey} sets unknown flag "${flag}"`);
        }
      }

      const afterDialogue = sequence.onComplete?.addBookmark?.afterDialogue;
      if (afterDialogue && !globalDialogueIds.has(afterDialogue)) {
        errors.push(`Dialogue "${dialogueKey}" in ${mapKey} references unknown afterDialogue "${afterDialogue}"`);
      }
    }

    for (const route of manifest.interactionRoutes) {
      if (!zoneIds.has(route.zoneId)) {
        errors.push(`Manifest "${mapKey}" references missing zoneId "${route.zoneId}"`);
      }

      if (!globalDialogueIds.has(route.defaultDialogue)) {
        errors.push(`Manifest "${mapKey}" route "${route.zoneId}" references unknown defaultDialogue "${route.defaultDialogue}"`);
      }

      for (const variant of route.flagVariants ?? []) {
        if (!isKnownFlag(variant.flag)) {
          errors.push(`Manifest "${mapKey}" route "${route.zoneId}" references unknown variant flag "${variant.flag}"`);
        }
        if (!globalDialogueIds.has(variant.dialogue)) {
          errors.push(`Manifest "${mapKey}" route "${route.zoneId}" references unknown variant dialogue "${variant.dialogue}"`);
        }
      }
    }

    for (const [questId, dialogueId] of Object.entries(manifest.questCompletionDialogues ?? {})) {
      if (!globalQuestIds.has(questId)) {
        errors.push(`Manifest "${mapKey}" maps unknown quest "${questId}" to completion dialogue`);
      }
      if (!globalDialogueIds.has(dialogueId)) {
        errors.push(`Manifest "${mapKey}" maps quest "${questId}" to unknown dialogue "${dialogueId}"`);
      }
    }

    for (const [examId, dialogueId] of Object.entries(manifest.examCompletionDialogues ?? {})) {
      if (!globalExamIds.has(examId)) {
        errors.push(`Manifest "${mapKey}" maps unknown exam "${examId}" to completion dialogue`);
      }
      if (!globalDialogueIds.has(dialogueId)) {
        errors.push(`Manifest "${mapKey}" maps exam "${examId}" to unknown dialogue "${dialogueId}"`);
      }
    }

    if ((manifest.introDialogue && !manifest.introFlag) || (!manifest.introDialogue && manifest.introFlag)) {
      errors.push(`Manifest "${mapKey}" must define introDialogue and introFlag together`);
    }
    if (manifest.introDialogue && !globalDialogueIds.has(manifest.introDialogue)) {
      errors.push(`Manifest "${mapKey}" references unknown introDialogue "${manifest.introDialogue}"`);
    }
    if (manifest.introFlag && !isKnownFlag(manifest.introFlag)) {
      errors.push(`Manifest "${mapKey}" references unknown introFlag "${manifest.introFlag}"`);
    }

    for (const intro of manifest.conditionalIntros ?? []) {
      if (!globalDialogueIds.has(intro.dialogue)) {
        errors.push(`Manifest "${mapKey}" conditional intro references unknown dialogue "${intro.dialogue}"`);
      }
      if (!isKnownFlag(intro.flag)) {
        errors.push(`Manifest "${mapKey}" conditional intro references unknown flag "${intro.flag}"`);
      }
      for (const flag of intro.requiredFlags ?? []) {
        if (!isKnownFlag(flag)) {
          errors.push(`Manifest "${mapKey}" conditional intro references unknown required flag "${flag}"`);
        }
      }
    }

    for (const exam of manifest.exams ?? []) {
      const questionIds = new Set<string>();
      for (const question of exam.questions) {
        if (questionIds.has(question.id)) {
          errors.push(`Exam "${exam.id}" in ${mapKey} has duplicate question id "${question.id}"`);
        } else {
          questionIds.add(question.id);
        }

        const optionIds = new Set<string>();
        for (const option of question.options) {
          if (optionIds.has(option.id)) {
            errors.push(`Exam "${exam.id}" question "${question.id}" has duplicate option id "${option.id}"`);
          } else {
            optionIds.add(option.id);
          }
        }

        for (const optionId of question.correctOptionIds) {
          if (!optionIds.has(optionId)) {
            errors.push(`Exam "${exam.id}" question "${question.id}" references unknown correct option "${optionId}"`);
          }
        }
      }

      for (const flag of exam.rewards.flags) {
        if (!isKnownFlag(flag)) {
          errors.push(`Exam "${exam.id}" in ${mapKey} sets unknown reward flag "${flag}"`);
        }
      }
    }

    for (const quest of manifest.quests ?? []) {
      for (const flag of quest.rewards.flags) {
        if (!isKnownFlag(flag)) {
          errors.push(`Quest "${quest.id}" in ${mapKey} sets unknown reward flag "${flag}"`);
        }
      }

      if (quest.completionType === 'event') {
        for (const objective of quest.objectives) {
          if (objective.requireFlag && !isKnownFlag(objective.requireFlag)) {
            errors.push(`Quest "${quest.id}" in ${mapKey} references unknown objective flag "${objective.requireFlag}"`);
          }
        }
      }
    }

    for (const arcadeGame of manifest.arcadeGames ?? []) {
      const firstClearDialogueId = arcadeGame.mission?.firstClearDialogueId;
      if (firstClearDialogueId && !globalDialogueIds.has(firstClearDialogueId)) {
        errors.push(`Arcade game "${arcadeGame.id}" in ${mapKey} references unknown firstClearDialogueId "${firstClearDialogueId}"`);
      }
    }
  }

  return errors;
}
