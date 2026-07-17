import type { PendingGrant } from '@/explorers/state/types';

const store = new Map<string, PendingGrant[]>();

function key(email: string): string {
  return email.toLowerCase().trim();
}

export async function getPendingGrants(email: string): Promise<PendingGrant[]> {
  return store.get(key(email)) ?? [];
}

export async function appendPendingGrant(email: string, grant: PendingGrant): Promise<void> {
  const existing = store.get(key(email)) ?? [];
  if (existing.some((g) => g.quest_id === grant.quest_id)) return;
  store.set(key(email), [...existing, grant]);
}

export async function clearAppliedGrants(email: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const existing = store.get(key(email)) ?? [];
  const remaining = existing.filter((g) => !ids.includes(g.id));
  if (remaining.length === 0) {
    store.delete(key(email));
  } else {
    store.set(key(email), remaining);
  }
}
