/**
 * Client for the dev-server-only level file bridge (scripts/levelEditorDevPlugin.mjs).
 * Only reachable under `npm run dev` — the endpoints do not exist in production.
 */

export interface LevelYamlEntry {
  mapKey: string;
  yaml: string;
}

export async function fetchLevelSources(): Promise<LevelYamlEntry[]> {
  const res = await fetch('/__level-editor/levels');
  if (!res.ok) {
    throw new Error(
      `Failed to load level sources (${res.status}) — the editor only works under "npm run dev"`,
    );
  }
  const data = (await res.json()) as { levels: LevelYamlEntry[] };
  return data.levels;
}

export async function saveLevelSource(mapKey: string, yaml: string): Promise<void> {
  const res = await fetch(`/__level-editor/levels/${encodeURIComponent(mapKey)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/plain' },
    body: yaml,
  });
  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(`Failed to save ${mapKey} (${res.status})${message ? `: ${message}` : ''}`);
  }
}
