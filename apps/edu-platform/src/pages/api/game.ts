import type { APIRoute } from 'astro';
import { ALL_LEVELS } from '@/explorers/levels/index';
import type { QuestDefinition } from '@/explorers/systems/QuestManager';

function sanitizeQuest(quest: QuestDefinition): object {
  if (quest.completionType === 'api-answer') {
    const { answerHash: _stripped, ...publicQuest } = quest;
    return publicQuest;
  }
  return quest;
}

export const GET: APIRoute = async () => {
  try {
    const levels: Record<string, object> = {};

    for (const [key, manifest] of ALL_LEVELS) {
      levels[key] = {
        id: manifest.id,
        displayName: manifest.displayName,
        dialogues: manifest.dialogues,
        interactionRoutes: manifest.interactionRoutes,
        quests: (manifest.quests ?? []).map(sanitizeQuest),
        questCompletionDialogues: manifest.questCompletionDialogues ?? {},
        exams: manifest.exams ?? [],
        examCompletionDialogues: manifest.examCompletionDialogues ?? {},
        arcadeGames: manifest.arcadeGames ?? [],
        introDialogue: manifest.introDialogue ?? null,
        introFlag: manifest.introFlag ?? null,
        introCinematicTitle: manifest.introCinematicTitle,
        introCinematicSubtitle: manifest.introCinematicSubtitle,
      };
    }

    return new Response(JSON.stringify({ levels }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[api/game] Failed to serialize game manifest:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
