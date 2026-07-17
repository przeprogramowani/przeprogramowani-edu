import { describe, it, expect } from 'vitest';
import type { BilingualText } from '../i18n/types';
import { ALL_LEVELS } from './index';
import { buildRankUpDialogues, RANK_FLAVOR } from '../config/ranks';

// Polish values that are intentionally identical to their English counterpart
const IDENTICAL_ALLOWED = new Set<string>([
  // Floobert alien speech — untranslatable
  'Mrrpfff! Gleebok spznx!',
  'Wubwub! Zleeborp fnk fnk!',
  'Bzzzt! Floof floof! Mrrphh! ✨',
  'Gleebok! Gleebok! 🐾',
  'BZZZT! Spznx spznx! Mrrpfff wubwub!',
  'Gleebok! Fnk fnk fnk! ⭐',
  'Zleeborp! 🐾💫',
  // Workflow phase sequences — already English in Polish context
  'Plan → Implement → Explore → Verify',
  'Implement → Verify → Explore → Plan',
  'Explore → Plan → Implement → Verify',
  'Explore → Implement → Plan → Verify',
  // Technical terms that are identical in both languages
  'Context Engineering',
]);

function isSeparator(s: string): boolean {
  return /^[═\s]+$/.test(s);
}

function checkBilingual(value: BilingualText, path: string): void {
  expect(value.pl, `${path}: pl must be non-empty`).not.toBe('');
  expect(value.en, `${path}: en must be non-empty`).not.toBe('');
  if (!IDENTICAL_ALLOWED.has(value.pl) && !isSeparator(value.pl)) {
    expect(value.en, `${path}: en must differ from pl (placeholder check)`).not.toBe(value.pl);
  }
}

describe('bilingual content parity', () => {
  it('all dialogue lines have non-empty, distinct pl and en', () => {
    for (const [levelId, manifest] of ALL_LEVELS) {
      for (const [seqId, seq] of Object.entries(manifest.dialogues)) {
        seq.lines.forEach((line, i) => {
          checkBilingual(line.text, `${levelId}/${seqId}[${i}].text`);
        });

        const bookmark = seq.onComplete?.addBookmark;
        if (bookmark?.title) {
          checkBilingual(bookmark.title, `${levelId}/${seqId}.onComplete.addBookmark.title`);
        }
        const openUrlTitle = seq.onComplete?.openUrlTitle;
        if (openUrlTitle) {
          checkBilingual(openUrlTitle, `${levelId}/${seqId}.onComplete.openUrlTitle`);
        }
      }
    }
  });

  it('rank-up dialogues have non-empty, distinct pl and en', () => {
    const rankDialogues = buildRankUpDialogues();
    for (const [seqId, seq] of Object.entries(rankDialogues)) {
      seq.lines.forEach((line, i) => {
        checkBilingual(line.text, `rank-up/${seqId}[${i}].text`);
      });
    }
  });

  it('RANK_FLAVOR has non-empty, distinct pl and en for all tiers', () => {
    for (const [tier, flavor] of Object.entries(RANK_FLAVOR)) {
      checkBilingual(flavor, `RANK_FLAVOR[${tier}]`);
    }
  });

  it('all quest fields have non-empty, distinct pl and en', () => {
    for (const [levelId, manifest] of ALL_LEVELS) {
      for (const quest of manifest.quests ?? []) {
        checkBilingual(quest.title, `${levelId}/${quest.id}.title`);
        checkBilingual(quest.briefing, `${levelId}/${quest.id}.briefing`);
        quest.hints?.forEach((hint, i) => {
          checkBilingual(hint, `${levelId}/${quest.id}.hints[${i}]`);
        });
        if ('hint' in quest && quest.hint) {
          checkBilingual(quest.hint, `${levelId}/${quest.id}.hint`);
        }
        if ('objectives' in quest && Array.isArray(quest.objectives)) {
          for (const obj of quest.objectives) {
            checkBilingual(obj.label, `${levelId}/${quest.id}/objective:${obj.id}.label`);
          }
        }
      }
    }
  });

  it('all level displayNames have non-empty, distinct pl and en', () => {
    for (const [levelId, manifest] of ALL_LEVELS) {
      checkBilingual(manifest.displayName, `${levelId}.displayName`);
    }
  });

  it('all arcade game fields have non-empty, distinct pl and en', () => {
    for (const [levelId, manifest] of ALL_LEVELS) {
      for (const game of manifest.arcadeGames ?? []) {
        checkBilingual(game.title, `${levelId}/${game.id}.title`);
        checkBilingual(game.description, `${levelId}/${game.id}.description`);
      }
    }
  });

  it('all exam fields have non-empty, distinct pl and en', () => {
    for (const [levelId, manifest] of ALL_LEVELS) {
      for (const exam of manifest.exams ?? []) {
        checkBilingual(exam.title, `${levelId}/${exam.id}.title`);
        checkBilingual(exam.description, `${levelId}/${exam.id}.description`);
        exam.questions.forEach((question, qi) => {
          checkBilingual(question.text, `${levelId}/${exam.id}/q[${qi}].text`);
          question.options.forEach((option, oi) => {
            checkBilingual(option.text, `${levelId}/${exam.id}/q[${qi}]/opt[${oi}].text`);
          });
        });
      }
    }
  });
});
