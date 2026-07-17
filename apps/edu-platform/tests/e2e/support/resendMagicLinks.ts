import { Resend } from 'resend';
import type { E2EEnv } from './env';

interface FindMagicLinkOptions {
  courseId: string;
  inboxEmail: string;
  startedAt: Date;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_POLL_INTERVAL_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function extractVerifyUrl(html: string, courseId: string): string | null {
  const escapedCourseId = courseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`https?://[^"'<>\\s]+/external/${escapedCourseId}/verify\\?[^"'<>\\s]+`, 'i');
  const match = html.match(pattern);

  return match ? match[0].replace(/&amp;/g, '&') : null;
}

function getEmailCreatedAt(email: Record<string, unknown>): Date | null {
  const rawDate = email.created_at ?? email.createdAt;

  if (typeof rawDate !== 'string') {
    return null;
  }

  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getEmailRecipients(email: Record<string, unknown>): string[] {
  const rawTo = email.to;

  if (Array.isArray(rawTo)) {
    return rawTo.filter((entry): entry is string => typeof entry === 'string');
  }

  if (typeof rawTo === 'string') {
    return [rawTo];
  }

  return [];
}

export class ResendMagicLinks {
  private readonly resend: Resend;

  constructor(env: Pick<E2EEnv, 'resendApiKey'>) {
    this.resend = new Resend(env.resendApiKey);
  }

  async findExternalVerifyUrl(options: FindMagicLinkOptions): Promise<string> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
    const deadline = Date.now() + timeoutMs;
    const normalizedInbox = normalizeEmail(options.inboxEmail);
    let lastError: unknown;
    let pollCount = 0;

    while (Date.now() < deadline) {
      try {
        const { data, error } = await this.resend.emails.list({ limit: 50 });

        if (error) {
          throw new Error(`Resend list failed: ${error.message}`);
        }

        const allEmails = (data?.data ?? []) as Array<Record<string, unknown>>;

        if (pollCount === 0) {
          const sample = allEmails.slice(0, 5).map((e) => ({
            to: getEmailRecipients(e).map(normalizeEmail),
            created_at: e.created_at,
            subject: e.subject,
          }));
          console.log(`[resend-poll] looking for inbox=${normalizedInbox} after=${options.startedAt.toISOString()}`);
          console.log(`[resend-poll] list returned ${allEmails.length} emails, first 5:`, JSON.stringify(sample));
        }

        const candidates = allEmails
          .filter((email) => {
            const id = email.id;
            const createdAt = getEmailCreatedAt(email);
            const recipients = getEmailRecipients(email).map(normalizeEmail);

            return (
              typeof id === 'string' &&
              createdAt !== null &&
              createdAt >= options.startedAt &&
              recipients.includes(normalizedInbox)
            );
          })
          .sort((a, b) => {
            const aDate = getEmailCreatedAt(a)?.getTime() ?? 0;
            const bDate = getEmailCreatedAt(b)?.getTime() ?? 0;

            return bDate - aDate;
          });

        for (const candidate of candidates) {
          const { data: email, error: getError } = await this.resend.emails.get(candidate.id as string);

          if (getError) {
            throw new Error(`Resend get failed for ${candidate.id}: ${getError.message}`);
          }

          const html = typeof email?.html === 'string' ? email.html : '';
          const verifyUrl = extractVerifyUrl(html, options.courseId);

          if (verifyUrl) {
            return verifyUrl;
          }
        }
      } catch (error) {
        lastError = error;
      }

      pollCount++;
      await sleep(pollIntervalMs);
    }

    const suffix = lastError instanceof Error ? ` Last Resend error: ${lastError.message}` : '';
    throw new Error(
      `Timed out after ${timeoutMs}ms waiting for an external auth magic link to ${options.inboxEmail} for ${options.courseId}. Polled ${pollCount} times.${suffix}`
    );
  }
}
