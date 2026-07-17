import type { GameFlag } from '../config/flags';
import type { DialogueSequence } from '../systems/DialogueTypes';
import type { QuestDefinition } from '../systems/QuestManager';
import type { ExamDefinition } from '../systems/ExamTypes';
import type { ArcadeGameDefinition } from '../systems/ArcadeTypes';
import type { InteractionRoute } from './types';
import type { BilingualText } from '../i18n/types';
import { buildRankUpDialogues } from '../config/ranks';
import { devLog } from '../utils/logger';

/** Shape of a single level in the /api/game response */
interface GameManifestLevel {
  id: string;
  displayName: BilingualText;
  dialogues: Record<string, DialogueSequence>;
  interactionRoutes: InteractionRoute[];
  quests: QuestDefinition[];
  questCompletionDialogues: Record<string, string>;
  exams: ExamDefinition[];
  examCompletionDialogues: Record<string, string>;
  arcadeGames: ArcadeGameDefinition[];
  introDialogue: string | null;
  introFlag: GameFlag | null;
  introCinematicTitle?: string;
  introCinematicSubtitle?: string;
}

/** Shape of the /api/game JSON response */
export interface GameManifestResponse {
  levels: Record<string, GameManifestLevel>;
}

/** Flattened global registries built from all level manifests */
let allDialogues: Map<string, DialogueSequence>;
let allQuests: Map<string, QuestDefinition>;
let allQuestCompletionDialogues: Record<string, string>;
let allExams: Map<string, ExamDefinition>;
let allExamCompletionDialogues: Record<string, string>;
let allArcadeGames: Map<string, ArcadeGameDefinition>;
let routesByMap: Map<string, InteractionRoute[]>;
let displayNames: Record<string, BilingualText>;
let introConfigs: Map<string, { dialogueId: string; flag: GameFlag; cinematicTitle?: string; cinematicSubtitle?: string }>;
let dialoguesByLevel: Map<string, string[]>;

let loaded = false;

function registerUnique<T>(
  registry: Map<string, T>,
  id: string,
  value: T,
  kind: string,
  ownerId: string
): void {
  if (registry.has(id)) {
    throw new Error(`[LevelLoader] Duplicate ${kind} ID "${id}" detected while loading "${ownerId}"`);
  }
  registry.set(id, value);
}

function assignUniqueMappings(
  target: Record<string, string>,
  source: Record<string, string>,
  kind: string,
  ownerId: string
): void {
  for (const [id, mappedId] of Object.entries(source)) {
    if (id in target) {
      throw new Error(`[LevelLoader] Duplicate ${kind} key "${id}" detected while loading "${ownerId}"`);
    }
    target[id] = mappedId;
  }
}

/** Load level data from the API manifest and build global registries. Call once at boot. */
export function loadLevelsFromData(data: GameManifestResponse): void {
  if (loaded) return;

  allDialogues = new Map();
  allQuests = new Map();
  allQuestCompletionDialogues = {};
  allExams = new Map();
  allExamCompletionDialogues = {};
  allArcadeGames = new Map();
  routesByMap = new Map();
  displayNames = {};
  introConfigs = new Map();
  dialoguesByLevel = new Map();

  for (const [mapKey, manifest] of Object.entries(data.levels)) {
    // Register dialogues
    const levelDialogueKeys: string[] = [];
    for (const [id, seq] of Object.entries(manifest.dialogues)) {
      registerUnique(allDialogues, id, seq, 'dialogue', mapKey);
      levelDialogueKeys.push(id);
    }
    dialoguesByLevel.set(mapKey, levelDialogueKeys.sort());

    // Register quests
    if (manifest.quests) {
      for (const quest of manifest.quests) {
        registerUnique(allQuests, quest.id, quest, 'quest', mapKey);
      }
    }

    // Register quest completion dialogues
    if (manifest.questCompletionDialogues) {
      assignUniqueMappings(allQuestCompletionDialogues, manifest.questCompletionDialogues, 'quest completion dialogue', mapKey);
    }

    // Register exams
    if (manifest.exams) {
      for (const exam of manifest.exams) {
        registerUnique(allExams, exam.id, exam, 'exam', mapKey);
      }
    }

    // Register exam completion dialogues
    if (manifest.examCompletionDialogues) {
      assignUniqueMappings(allExamCompletionDialogues, manifest.examCompletionDialogues, 'exam completion dialogue', mapKey);
    }

    // Register arcade games
    if (manifest.arcadeGames) {
      for (const game of manifest.arcadeGames) {
        registerUnique(allArcadeGames, game.id, game, 'arcade game', mapKey);
      }
    }

    // Register interaction routes
    routesByMap.set(mapKey, manifest.interactionRoutes);

    // Register display name
    displayNames[mapKey] = manifest.displayName;

    // Register intro config
    if (manifest.introDialogue && manifest.introFlag) {
      introConfigs.set(mapKey, {
        dialogueId: manifest.introDialogue,
        flag: manifest.introFlag,
        cinematicTitle: manifest.introCinematicTitle,
        cinematicSubtitle: manifest.introCinematicSubtitle,
      });
    }
  }

  // Register rank-up dialogues (global, not per-level)
  const rankUpDialogues = buildRankUpDialogues();
  const rankUpKeys: string[] = [];
  for (const [id, seq] of Object.entries(rankUpDialogues)) {
    registerUnique(allDialogues, id, seq, 'dialogue', 'rank-up-dialogues');
    rankUpKeys.push(id);
  }
  if (rankUpKeys.length > 0) {
    dialoguesByLevel.set('rank-up', rankUpKeys.sort());
  }

  loaded = true;
  const levelCount = Object.keys(data.levels).length;
  devLog(
    `[LevelLoader] Loaded ${levelCount} levels, ${allDialogues.size} dialogues, ${allQuests.size} quests, ${allExams.size} exams, ${allArcadeGames.size} arcade games`
  );
}

/** Get all dialogue sequences (global registry) */
export function getAllDialogues(): Map<string, DialogueSequence> {
  return allDialogues;
}

/** Get all quest definitions (global registry) */
export function getAllQuests(): Map<string, QuestDefinition> {
  return allQuests;
}

/** Get quest completion → dialogue mappings (global registry) */
export function getQuestCompletionDialogues(): Record<string, string> {
  return allQuestCompletionDialogues;
}

/** Get all exam definitions (global registry) */
export function getAllExams(): Map<string, ExamDefinition> {
  return allExams;
}

/** Get exam completion → dialogue mappings (global registry) */
export function getExamCompletionDialogues(): Record<string, string> {
  return allExamCompletionDialogues;
}

/** Get all arcade game definitions (global registry) */
export function getAllArcadeGames(): Map<string, ArcadeGameDefinition> {
  return allArcadeGames;
}

/** Get a single arcade game definition by ID */
export function getArcadeGame(id: string): ArcadeGameDefinition | undefined {
  return allArcadeGames.get(id);
}

/** Get interaction routes for a specific map */
export function getInteractionRoutes(mapKey: string): InteractionRoute[] {
  return routesByMap.get(mapKey) ?? [];
}

/** Get map display names (global registry, bilingual) */
export function getMapDisplayNames(): Record<string, BilingualText> {
  return displayNames;
}

/** Get dialogue keys grouped by level (for QA tooling) */
export function getDialoguesByLevel(): Map<string, string[]> {
  return dialoguesByLevel;
}

/** Get intro config for a map (if any) */
export function getIntroConfig(mapKey: string): { dialogueId: string; flag: GameFlag; cinematicTitle?: string; cinematicSubtitle?: string } | null {
  return introConfigs.get(mapKey) ?? null;
}
