import { Resend } from 'resend';
import { generateMagicLinkEmail } from './templates';
import type { EmailTemplateType, EmailLanguage, SendEmailResult } from './types';

const FROM_EMAIL = 'Przeprogramowani <no-reply@notifications.przeprogramowani.pl>';
const RETRY_DELAY_MS = 1000;

export interface SendMagicLinkOptions {
  to: string;
  magicLink: string;
  template: EmailTemplateType;
  ttlMinutes: number;
  lang?: EmailLanguage;
  courseName?: string;
  brandColor?: string;
  resendApiKey?: string;
  fallbackMailingServiceUrl?: string;
}

export async function sendMagicLinkEmail(options: SendMagicLinkOptions): Promise<SendEmailResult> {
  const {
    to,
    magicLink,
    template,
    ttlMinutes,
    lang = 'pl',
    courseName,
    brandColor,
    resendApiKey,
    fallbackMailingServiceUrl,
  } = options;

  const emailContent = generateMagicLinkEmail({
    magicLink,
    type: template,
    lang,
    ttlMinutes,
    courseName,
    brandColor,
  });

  // Try Resend first (if API key available)
  if (resendApiKey) {
    const resendResult = await sendViaResendWithRetry(
      to,
      emailContent.subject,
      emailContent.html,
      resendApiKey,
      template
    );

    if (resendResult.success) {
      return resendResult;
    }

    console.warn(`Resend failed after retry, attempting fallback. Error: ${resendResult.error}`);
  }

  // Fallback to old mailing service
  if (fallbackMailingServiceUrl) {
    const fallbackResult = await sendViaFallback(
      to,
      magicLink,
      template,
      courseName,
      fallbackMailingServiceUrl
    );

    return {
      ...fallbackResult,
      usedFallback: true,
    };
  }

  return {
    success: false,
    error: 'No email service available (Resend failed, no fallback configured)',
  };
}

async function sendViaResendWithRetry(
  to: string,
  subject: string,
  html: string,
  apiKey: string,
  template: EmailTemplateType
): Promise<SendEmailResult> {
  // First attempt
  const firstResult = await sendViaResend(to, subject, html, apiKey, template);
  if (firstResult.success) {
    return firstResult;
  }

  console.log(`Resend first attempt failed: ${firstResult.error}. Retrying in ${RETRY_DELAY_MS}ms...`);

  // Wait before retry
  await sleep(RETRY_DELAY_MS);

  // Retry once
  const retryResult = await sendViaResend(to, subject, html, apiKey, template);
  if (retryResult.success) {
    console.log('Resend retry succeeded');
  }

  return retryResult;
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  apiKey: string,
  template: EmailTemplateType
): Promise<SendEmailResult> {
  const startTime = Date.now();

  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      tags: [
        { name: 'template', value: template },
        { name: 'type', value: 'magic-link' },
      ],
    });

    const duration = Date.now() - startTime;

    if (error) {
      console.error(`Resend API error (${duration}ms):`, error);
      return { success: false, error: error.message };
    }

    console.log(`Email sent via Resend (${duration}ms, id: ${data?.id}, template: ${template})`);
    return { success: true, id: data?.id };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Resend exception (${duration}ms):`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

async function sendViaFallback(
  to: string,
  magicLink: string,
  template: EmailTemplateType,
  courseName: string | undefined,
  mailingServiceUrl: string
): Promise<SendEmailResult> {
  const startTime = Date.now();

  const message = {
    email: to,
    magicLink,
    template,
    ...(template === 'external' && courseName ? { courseName } : {}),
  };

  try {
    const response = await fetch(mailingServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.error(`Fallback service error (${duration}ms): HTTP ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    console.log(`Email sent via fallback (${duration}ms, template: ${template})`);
    return { success: true };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Fallback exception (${duration}ms):`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
