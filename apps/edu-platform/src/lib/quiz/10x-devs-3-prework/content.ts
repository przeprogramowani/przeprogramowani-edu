import { preworkPathQuizEn } from './en';
import { preworkPathQuizPl } from './pl';
import type { PreworkPathQuizLanguageContent, QuizLanguage } from './types';

export const preworkPathQuizContent: Record<QuizLanguage, PreworkPathQuizLanguageContent> = {
  pl: preworkPathQuizPl,
  en: preworkPathQuizEn,
};
