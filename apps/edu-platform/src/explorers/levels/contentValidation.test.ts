import { describe, expect, it } from 'vitest';
import { validateExplorersContent } from './contentValidation';

describe('explorers content validation', () => {
  it('keeps manifests, dialogues, quests, exams, arcade content, and map JSON references aligned', () => {
    expect(validateExplorersContent()).toEqual([]);
  });
});
