import type { PREWORK_PATH_QUIZ_SLUG, PREWORK_PATH_QUIZ_VERSION } from './constants';

export type QuizLanguage = 'pl' | 'en';

export type PreworkQuestionId =
  | 'foundations'
  | 'learning'
  | 'agentEnvironment'
  | 'cursorIntro'
  | 'claudeIntro'
  | 'llmBasics'
  | 'promptPatterns'
  | 'contextManagement'
  | 'aiWorkLanguage'
  | 'modelSelection'
  | 'stackKnown';

export interface PreworkQuizQuestion {
  id: PreworkQuestionId;
  type: 'single' | 'multi';
  title: string;
  description?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export type PreworkQuizAnswers = Partial<Record<PreworkQuestionId, string | string[]>>;

export interface PreworkQuizRecommendation {
  lessonId: string;
  title: string;
  reason: string;
  href: string;
  required: boolean;
}

export interface PreworkQuizResult {
  quizSlug: typeof PREWORK_PATH_QUIZ_SLUG;
  questionVersion: typeof PREWORK_PATH_QUIZ_VERSION;
  language: QuizLanguage;
  recommendations: PreworkQuizRecommendation[];
}

export interface PreworkQuizIntroCopy {
  title: string;
  description: string;
  completedTitle: string;
  completedDescription: string;
  start: string;
  savedResult: string;
  submit: string;
  retry: string;
  resultTitle: string;
  resultDescription: string;
  resultNavigationHint: string;
  goToNextLesson: string;
  answersTitle: string;
  answersDescription: string;
  correctSelectedLabel: string;
  correctAnswerLabel: string;
  selectedAnswerLabel: string;
  openLesson: string;
  loading: string;
  saveWarning: string;
}

export interface PreworkQuizReasons {
  alwaysEnvironment: string;
  alwaysAgentNative: string;
  alwaysProject: string;
  alwaysSupport: string;
  foundations: string;
  learning: string;
  cursor: string;
  claude: string;
  llmBasics: string;
  promptPatterns: string;
  contextManagement: string;
  aiWorkLanguage: string;
  modelSelection: string;
  stack: string;
}

export interface PreworkPathQuizLanguageContent {
  lessonTitles: Record<string, string>;
  questions: PreworkQuizQuestion[];
  intro: PreworkQuizIntroCopy;
  reasons: PreworkQuizReasons;
}
