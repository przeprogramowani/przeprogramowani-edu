import { describe, expect, it } from 'vitest';
import {
  buildPreworkQuizResult,
  PREWORK_PATH_QUIZ_SLUG,
  type PreworkQuizAnswers,
} from '.';

function lessonIds(answers: PreworkQuizAnswers, language: 'pl' | 'en' = 'pl'): string[] {
  return buildPreworkQuizResult(answers, language).recommendations.map((item) => item.lessonId);
}

describe('buildPreworkQuizResult', () => {
  it('always recommends the shared environment, agent-native IDE, project, and support lessons', () => {
    expect(lessonIds({
      foundations: 'correct',
      learning: 'correct',
      stackKnown: 'correct',
      llmBasics: 'correct',
      promptPatterns: 'correct',
      contextManagement: 'correct',
      aiWorkLanguage: 'correct',
      modelSelection: 'correct',
    })).toEqual([
      '04',
      '07',
      '15',
      '16',
    ]);
  });

  it('recommends Cursor and Claude Code intros independently', () => {
    expect(lessonIds({ cursorIntro: 'yes', claudeIntro: 'no' })).toContain('05');
    expect(lessonIds({ cursorIntro: 'no', claudeIntro: 'yes' })).toContain('06');
    expect(lessonIds({ cursorIntro: 'no', claudeIntro: 'no' })).not.toEqual(
      expect.arrayContaining(['05', '06'])
    );
  });

  it('maps each missed 3.x knowledge question to its own lesson', () => {
    const ids = lessonIds({
      llmBasics: 'incorrect',
      promptPatterns: 'incorrect',
      contextManagement: 'incorrect',
      aiWorkLanguage: 'incorrect',
      modelSelection: 'incorrect',
      stackKnown: 'correct',
    });

    expect(ids).toEqual(expect.arrayContaining(['09', '10', '11', '12', '13']));
  });

  it('recommends the stack overview when the stack knowledge question is missed', () => {
    expect(lessonIds({ stackKnown: 'incorrect' })).toContain('14');
    expect(lessonIds({ stackKnown: 'correct' })).not.toContain('14');
  });

  it('keeps lesson ids stable while localizing links', () => {
    const result = buildPreworkQuizResult({ foundations: 'incorrect', stackKnown: 'correct' }, 'en');

    expect(result.quizSlug).toBe(PREWORK_PATH_QUIZ_SLUG);
    expect(result.recommendations.map((item) => item.lessonId)).toContain('02');
    expect(result.recommendations[0].href).toContain('/external/10xdevs-3-prework/en/');
  });
});
