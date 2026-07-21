import type { APIRoute } from 'astro';
import { ALL_LEVELS } from '@/explorers/levels/index';
import { localized } from '@/explorers/i18n/types';

export const GET: APIRoute = async () => {
  try {
    const maps: { id: string; displayName: string }[] = [];
    const dialogueIdSet = new Set<string>();
    const manifests: Record<
      string,
      {
        interactionRoutes: { zoneId: string }[];
        exams: { id: string }[];
        arcadeGames: { id: string }[];
      }
    > = {};

    for (const [, manifest] of ALL_LEVELS) {
      maps.push({ id: manifest.id, displayName: localized(manifest.displayName) });
      for (const dialogueId of Object.keys(manifest.dialogues)) {
        dialogueIdSet.add(dialogueId);
      }
      // Lite projection consumed by the editor's client-side validateLevel.
      manifests[manifest.id] = {
        interactionRoutes: manifest.interactionRoutes.map((route) => ({ zoneId: route.zoneId })),
        exams: (manifest.exams ?? []).map((exam) => ({ id: exam.id })),
        arcadeGames: (manifest.arcadeGames ?? []).map((game) => ({ id: game.id })),
      };
    }

    return new Response(
      JSON.stringify({
        maps,
        dialogueIds: [...dialogueIdSet].sort(),
        manifests,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    console.error('[api/game-editor] Failed to build editor metadata:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
