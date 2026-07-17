export interface EditorMeta {
  maps: { id: string; displayName: string }[];
  dialogueIds: string[];
}

/** Fetch lightweight editor metadata from the server */
export async function fetchEditorMeta(): Promise<EditorMeta> {
  const res = await fetch('/api/game-editor');
  if (!res.ok) {
    throw new Error(`Failed to fetch editor metadata: ${res.status}`);
  }
  return res.json();
}
