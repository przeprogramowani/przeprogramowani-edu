import type { APIRoute } from 'astro';
import { ALL_LEVELS } from '@/explorers/levels/index';
import { localized } from '@/explorers/i18n/types';

export const GET: APIRoute = async () => {
  try {
    const maps: { id: string; displayName: string }[] = [];
    const dialogueIdSet = new Set<string>();

    for (const [, manifest] of ALL_LEVELS) {
      maps.push({ id: manifest.id, displayName: localized(manifest.displayName) });
      for (const dialogueId of Object.keys(manifest.dialogues)) {
        dialogueIdSet.add(dialogueId);
      }
    }

    return new Response(
      JSON.stringify({
        maps,
        dialogueIds: [...dialogueIdSet].sort(),
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
