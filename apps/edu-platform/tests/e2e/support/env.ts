export interface E2EEnv {
  baseUrl: string;
  externalCourseId: string;
  externalLoginEmail: string;
  externalReturnPath: string;
  resendApiKey: string;
  resendInboxEmail: string;
}

const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_EXTERNAL_COURSE_ID = '10xdevs-3-prework';
const DEFAULT_EXTERNAL_RETURN_PATH = '/external/10xdevs-3-prework/pl';

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required E2E environment variable: ${name}`);
  }

  return value;
}

export function getE2EEnv(): E2EEnv {
  return {
    baseUrl: process.env.PLAYWRIGHT_TEST_BASE_URL?.trim() || DEFAULT_BASE_URL,
    externalCourseId: process.env.E2E_EXTERNAL_COURSE_ID?.trim() || DEFAULT_EXTERNAL_COURSE_ID,
    externalLoginEmail: requiredEnv('E2E_EXTERNAL_LOGIN_EMAIL'),
    externalReturnPath: process.env.E2E_EXTERNAL_RETURN_PATH?.trim() || DEFAULT_EXTERNAL_RETURN_PATH,
    resendApiKey: requiredEnv('E2E_RESEND_API_KEY'),
    resendInboxEmail: requiredEnv('E2E_RESEND_INBOX_EMAIL'),
  };
}
