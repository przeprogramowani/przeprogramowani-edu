import { describe, expect, it } from 'vitest';
import { mapPreworkQuizResultToLessonPersonalization } from './preworkSidebarPersonalization';
import {
  PREWORK_PATH_QUIZ_SLUG,
  PREWORK_PATH_QUIZ_VERSION,
  type PreworkQuizResult,
} from '@/lib/quiz/10x-devs-3-prework';

describe('mapPreworkQuizResultToLessonPersonalization', () => {
  it('maps quiz recommendations to lesson marker tooltips', () => {
    const result: PreworkQuizResult = {
      quizSlug: PREWORK_PATH_QUIZ_SLUG,
      questionVersion: PREWORK_PATH_QUIZ_VERSION,
      language: 'pl',
      recommendations: [
        {
          lessonId: '02',
          title: 'Chatbot vs Agent',
          reason: 'Warto uporządkować definicje.',
          href: '/external/10xdevs-3-prework/pl/02',
          required: false,
        },
      ],
    };

    expect(mapPreworkQuizResultToLessonPersonalization(result, 'pl')).toEqual({
      '02': {
        label: '💡',
        tooltip: 'Sugestia na podstawie quizu: Warto uporządkować definicje.',
      },
    });
  });

  it('returns no markers when there is no saved agenda', () => {
    expect(mapPreworkQuizResultToLessonPersonalization(null, 'en')).toEqual({});
  });
});
