import type { DialogueSequence } from '../systems/DialogueTypes';
import { FLAGS } from './flags';
import type { BilingualText } from '../i18n/types';

export interface RankDefinition {
  tier: number;
  name: string;
  minXP: number;
  badgeImage: string | null;
}

export const RANKS: readonly RankDefinition[] = [
  { tier: 1, name: '???', minXP: 0, badgeImage: null },
  { tier: 2, name: 'Space Adept', minXP: 100, badgeImage: '/game/badges/space-adept.png' },
  { tier: 3, name: 'Moon Engineer', minXP: 1000, badgeImage: '/game/badges/moon-engineer.png' },
  { tier: 4, name: 'Solar Builder', minXP: 2000, badgeImage: '/game/badges/solar-builder.png' },
  { tier: 5, name: 'Stellar Explorer', minXP: 3000, badgeImage: '/game/badges/stellar-explorer.png' },
  { tier: 6, name: 'Cosmic Architect', minXP: 4000, badgeImage: '/game/badges/cosmic-architect.png' },
  { tier: 7, name: 'Deep Space Pioneer', minXP: 5000, badgeImage: '/game/badges/deep-space-pioneer.png' },
] as const;

/** Resolve a shareable badge rank, falling back when the tier has no badge. */
export function getBadgeRankForTier(tier: number): RankDefinition {
  return RANKS.find((rank) => rank.tier === tier && rank.badgeImage !== null) ?? RANKS[1];
}

export interface RankInfo {
  rank: RankDefinition;
  nextRank: RankDefinition | null;
}

export interface RankProgress {
  xpInRank: number;
  xpForRank: number;
  percent: number;
  displayCurrent: number; // total XP
  displayMax: number | null; // next rank threshold, null for max rank
}

/** Get the rank for a given XP value. */
export function getRankForXP(xp: number): RankInfo {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.minXP) {
      current = rank;
    } else {
      break;
    }
  }

  const currentIndex = RANKS.indexOf(current);
  const nextRank = currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;

  return { rank: current, nextRank };
}

/** Get XP bar progress within the current rank. */
export function getRankProgress(xp: number): RankProgress {
  const { rank, nextRank } = getRankForXP(xp);

  if (!nextRank) {
    // Max rank — bar is full
    return {
      xpInRank: xp - rank.minXP,
      xpForRank: 0,
      percent: 100,
      displayCurrent: xp,
      displayMax: null,
    };
  }

  const xpInRank = xp - rank.minXP;
  const xpForRank = nextRank.minXP - rank.minXP;
  const percent = Math.min((xpInRank / xpForRank) * 100, 100);

  return {
    xpInRank,
    xpForRank,
    percent,
    displayCurrent: xp,
    displayMax: nextRank.minXP,
  };
}

// Rank-up dialogue definitions — registered into the global dialogue registry
export const RANK_FLAVOR: Record<number, BilingualText> = {
  2: { pl: 'Systemy pokładowe rozpoznają twoje kompetencje - potwierdza to komenda /badges w Smart Terminalu.', en: 'Ship systems recognise your competence — confirmed by the /badges command in SmartTerminal.' },
  3: { pl: 'Twoje umiejętności inżynieryjne robią wrażenie.', en: 'Your engineering skills are impressive.' },
  4: { pl: 'Budujesz coś wielkiego w kosmosie.', en: 'You are building something great in space.' },
  5: { pl: 'Gwiazdy nie mają przed tobą tajemnic.', en: 'The stars hold no secrets from you.' },
  6: { pl: 'Projektujesz przyszłość stacji kosmicznych.', en: 'You are designing the future of space stations.' },
  7: { pl: 'Głęboka przestrzeń jest twoim domem.', en: 'Deep space is your home.' },
};

export function getRankUpDialogueId(tier: number): string {
  return `rank-up-tier-${tier}`;
}

export function buildRankUpDialogues(): Record<string, DialogueSequence> {
  const dialogues: Record<string, DialogueSequence> = {};

  for (const rank of RANKS) {
    if (rank.tier === 1) continue; // No rank-up dialogue for starting rank

    const id = getRankUpDialogueId(rank.tier);
    dialogues[id] = {
      id,
      lines: [
        { speaker: 'system', text: { pl: '═══ AWANS ═══', en: '═══ RANK-UP ═══' }, mode: 'system', autoAdvance: 2000 },
        { speaker: 'system', text: { pl: `Nowa ranga: ${rank.name}`, en: `New rank: ${rank.name}` }, mode: 'system', autoAdvance: 2500 },
        { speaker: 'system', text: RANK_FLAVOR[rank.tier] ?? { pl: '', en: '' }, mode: 'system', autoAdvance: 2500 },
      ],
      // Unlock /badges command on first rank-up
      ...(rank.tier === 2 ? { onComplete: { setFlags: [FLAGS.CMDS_BADGES] } } : {}),
    };
  }

  return dialogues;
}
