import { envField } from 'astro/config';

export const ASTRO_ENV_SCHEMA = {
  ENV: envField.string({
    context: 'server',
    access: 'secret',
  }),
  SITE_URL: envField.string({
    context: 'server',
    access: 'secret',
  }),
  MAILING_SERVICE_URL: envField.string({
    context: 'server',
    access: 'secret',
  }),
  AIRTABLE_API_KEY: envField.string({
    context: 'server',
    access: 'secret',
  }),
  SUPABASE_URL: envField.string({
    context: 'server',
    access: 'secret',
  }),
  SUPABASE_SERVICE_KEY: envField.string({
    context: 'server',
    access: 'secret',
  }),
  JWT_SECRET: envField.string({
    context: 'server',
    access: 'secret',
  }),
  GITHUB_CLIENT_ID: envField.string({
    context: 'server',
    access: 'secret',
  }),
  GITHUB_CLIENT_SECRET: envField.string({
    context: 'server',
    access: 'secret',
  }),
  GOOGLE_CLIENT_ID: envField.string({
    context: 'server',
    access: 'secret',
  }),
  GOOGLE_CLIENT_SECRET: envField.string({
    context: 'server',
    access: 'secret',
  }),
  CF_CAPTCHA_SITE_KEY: envField.string({
    context: 'server',
    access: 'secret',
    // default: '1x00000000000000000000AA',
  }),
  CF_CAPTCHA_SECRET_KEY: envField.string({
    context: 'server',
    access: 'secret',
    // default: '1x0000000000000000000000000000000AA',
  }),
  RESEND_API_KEY: envField.string({
    context: 'server',
    access: 'secret',
    optional: true, // Optional for fallback support
  }),
  LESSON_CACHE_TTL_HOURS: envField.number({
    context: 'server',
    access: 'public',
    default: 24,
    optional: true,
  }),
  BADGES_API_BASE_URL: envField.string({
    context: 'server',
    access: 'public',
    default: 'https://badges.10xdevs.pl',
    optional: true,
  }),
  PUBLIC_SENTRY_DSN: envField.string({
    context: 'client',
    access: 'public',
    optional: true,
  }),
  EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS: envField.number({
    context: 'server',
    access: 'secret',
    default: 24 * 60,
    optional: true,
  }),
  EXTERNAL_MEMBERSHIP_CACHE_RETENTION_HOURS: envField.number({
    context: 'server',
    access: 'secret',
    default: 24 * 90,
    optional: true,
  }),
  EXTERNAL_MEMBERSHIP_REFRESH_SECRET: envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  }),
  TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE: envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  }),
  TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING: envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  }),
  CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN: envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  }),
  CIRCLE_BRAVE_V1_TOKEN: envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  }),
  // Required in PROD for MailerLite game funnel tracking.
  // Must be set as encrypted secrets in Cloudflare Pages dashboard.
  // If missing, newsletter subscriptions are silently skipped — check CF Pages env vars.
  TEN_X_DEVS_MAILERLITE_API_KEY: envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  }),
  // deprecated - use TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID
  TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID: envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  }),
  TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID: envField.string({
    context: 'server',
    access: 'secret',
    optional: false,
  }),
  TEN_X_DEVS_GAME_FINISHED_GROUP_ID: envField.string({
    context: 'server',
    access: 'secret',
    optional: false,
  }),
};
