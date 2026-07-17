export type EmailTemplateType = 'main' | 'external';
export type EmailLanguage = 'pl' | 'en';

export interface MagicLinkTemplateProps {
  magicLink: string;
  type: EmailTemplateType;
  lang: EmailLanguage;
  ttlMinutes: number;
  courseName?: string; // Required for 'external' type
  brandColor?: string; // Hex color for external template (default: #10b981)
}

export interface EmailContent {
  subject: string;
  html: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
  usedFallback?: boolean;
}
