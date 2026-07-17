import { describe, it, expect } from 'vitest';
import {
  getRankForXP,
  getRankProgress,
  buildRankUpDialogues,
  getRankUpDialogueId,
} from './ranks';

describe('getRankForXP', () => {
  it('returns tier 1 for 0 XP', () => {
    const { rank } = getRankForXP(0);
    expect(rank.tier).toBe(1);
    expect(rank.name).toBe('???');
  });

  it('returns tier 1 for 99 XP (just below threshold)', () => {
    const { rank } = getRankForXP(99);
    expect(rank.tier).toBe(1);
  });

  it('returns tier 2 for 100 XP (exact threshold)', () => {
    const { rank } = getRankForXP(100);
    expect(rank.tier).toBe(2);
    expect(rank.name).toBe('Space Adept');
  });

  it('returns tier 2 for 999 XP (just below tier 3)', () => {
    const { rank } = getRankForXP(999);
    expect(rank.tier).toBe(2);
  });

  it('returns tier 3 for 1000 XP', () => {
    const { rank } = getRankForXP(1000);
    expect(rank.tier).toBe(3);
    expect(rank.name).toBe('Moon Engineer');
  });

  it('returns tier 6 for 4999 XP (just below tier 7)', () => {
    const { rank } = getRankForXP(4999);
    expect(rank.tier).toBe(6);
  });

  it('returns tier 7 for 5000 XP', () => {
    const { rank } = getRankForXP(5000);
    expect(rank.tier).toBe(7);
    expect(rank.name).toBe('Deep Space Pioneer');
  });

  it('returns tier 7 for 9999 XP (well above max)', () => {
    const { rank } = getRankForXP(9999);
    expect(rank.tier).toBe(7);
  });

  it('returns nextRank for non-max ranks', () => {
    const { nextRank } = getRankForXP(0);
    expect(nextRank).not.toBeNull();
    expect(nextRank!.tier).toBe(2);
  });

  it('returns null nextRank for max rank', () => {
    const { nextRank } = getRankForXP(5000);
    expect(nextRank).toBeNull();
  });
});

describe('getRankProgress', () => {
  it('returns correct progress at 50 XP (within tier 1)', () => {
    const progress = getRankProgress(50);
    expect(progress.displayCurrent).toBe(50);
    expect(progress.displayMax).toBe(100);
    expect(progress.xpInRank).toBe(50);
    expect(progress.xpForRank).toBe(100);
    expect(progress.percent).toBe(50);
  });

  it('returns 0% at rank boundary start', () => {
    const progress = getRankProgress(0);
    expect(progress.percent).toBe(0);
    expect(progress.displayCurrent).toBe(0);
    expect(progress.displayMax).toBe(100);
  });

  it('returns correct progress just below next rank', () => {
    const progress = getRankProgress(99);
    expect(progress.percent).toBe(99);
    expect(progress.displayMax).toBe(100);
  });

  it('resets progress at new rank boundary', () => {
    const progress = getRankProgress(100);
    expect(progress.xpInRank).toBe(0);
    expect(progress.percent).toBe(0);
    expect(progress.displayCurrent).toBe(100);
    expect(progress.displayMax).toBe(1000);
  });

  it('returns 100% for max rank', () => {
    const progress = getRankProgress(5000);
    expect(progress.percent).toBe(100);
    expect(progress.displayMax).toBeNull();
  });

  it('returns 100% for XP well above max rank', () => {
    const progress = getRankProgress(9999);
    expect(progress.percent).toBe(100);
    expect(progress.displayMax).toBeNull();
  });
});

describe('buildRankUpDialogues', () => {
  it('returns 6 dialogues (tiers 2-7)', () => {
    const dialogues = buildRankUpDialogues();
    expect(Object.keys(dialogues)).toHaveLength(6);
  });

  it('does not include tier 1', () => {
    const dialogues = buildRankUpDialogues();
    expect(dialogues['rank-up-tier-1']).toBeUndefined();
  });

  it('each dialogue has 3 lines', () => {
    const dialogues = buildRankUpDialogues();
    for (const seq of Object.values(dialogues)) {
      expect(seq.lines).toHaveLength(3);
    }
  });

  it('first line is always AWANS header', () => {
    const dialogues = buildRankUpDialogues();
    for (const seq of Object.values(dialogues)) {
      expect(seq.lines[0].text).toEqual({ pl: '═══ AWANS ═══', en: '═══ RANK-UP ═══' });
      expect(seq.lines[0].mode).toBe('system');
    }
  });
});

describe('getRankUpDialogueId', () => {
  it('returns expected format', () => {
    expect(getRankUpDialogueId(2)).toBe('rank-up-tier-2');
    expect(getRankUpDialogueId(7)).toBe('rank-up-tier-7');
  });
});
