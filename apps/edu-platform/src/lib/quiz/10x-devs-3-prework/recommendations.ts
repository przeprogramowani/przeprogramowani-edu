import {
  PREWORK_COURSE_SLUG,
  PREWORK_PATH_QUIZ_SLUG,
  PREWORK_PATH_QUIZ_VERSION,
} from './constants';
import { preworkPathQuizContent } from './content';
import type {
  PreworkQuestionId,
  PreworkQuizAnswers,
  PreworkQuizQuestion,
  PreworkQuizResult,
  QuizLanguage,
} from './types';

function getSingleAnswer(answers: PreworkQuizAnswers, id: PreworkQuestionId): string | null {
  const value = answers[id];
  return typeof value === 'string' ? value : null;
}

function didMissKnowledgeQuestion(answers: PreworkQuizAnswers, id: PreworkQuestionId): boolean {
  return getSingleAnswer(answers, id) !== 'correct';
}

export function getPreworkQuizQuestions(language: QuizLanguage): PreworkQuizQuestion[] {
  return preworkPathQuizContent[language].questions;
}

export function getPreworkQuizIntro(language: QuizLanguage) {
  return preworkPathQuizContent[language].intro;
}

export function buildPreworkQuizResult(
  answers: PreworkQuizAnswers,
  language: QuizLanguage
): PreworkQuizResult {
  const content = preworkPathQuizContent[language];
  const recommendations = new Map<string, { reason: string; required: boolean }>();

  const add = (lessonId: string, reason: string, required = false) => {
    recommendations.set(lessonId, { reason, required });
  };

  add('04', content.reasons.alwaysEnvironment, true);
  add('07', content.reasons.alwaysAgentNative, true);
  add('15', content.reasons.alwaysProject, true);
  add('16', content.reasons.alwaysSupport, true);

  if (didMissKnowledgeQuestion(answers, 'foundations')) add('02', content.reasons.foundations);
  if (didMissKnowledgeQuestion(answers, 'learning')) add('03', content.reasons.learning);
  if (getSingleAnswer(answers, 'cursorIntro') === 'yes') add('05', content.reasons.cursor);
  if (getSingleAnswer(answers, 'claudeIntro') === 'yes') add('06', content.reasons.claude);
  if (didMissKnowledgeQuestion(answers, 'llmBasics')) add('09', content.reasons.llmBasics);
  if (didMissKnowledgeQuestion(answers, 'promptPatterns')) add('10', content.reasons.promptPatterns);
  if (didMissKnowledgeQuestion(answers, 'contextManagement')) add('11', content.reasons.contextManagement);
  if (didMissKnowledgeQuestion(answers, 'aiWorkLanguage')) add('12', content.reasons.aiWorkLanguage);
  if (didMissKnowledgeQuestion(answers, 'modelSelection')) add('13', content.reasons.modelSelection);
  if (didMissKnowledgeQuestion(answers, 'stackKnown')) add('14', content.reasons.stack);

  return {
    quizSlug: PREWORK_PATH_QUIZ_SLUG,
    questionVersion: PREWORK_PATH_QUIZ_VERSION,
    language,
    recommendations: [...recommendations.entries()]
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([lessonId, recommendation]) => ({
        lessonId,
        title: content.lessonTitles[lessonId],
        reason: recommendation.reason,
        href: `/external/${PREWORK_COURSE_SLUG}/${language}/${lessonId}`,
        required: recommendation.required,
      })),
  };
}

export function isQuizLanguage(value: string | null | undefined): value is QuizLanguage {
  return value === 'pl' || value === 'en';
}
