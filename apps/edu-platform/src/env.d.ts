/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Window {
  onloadTurnstileCallback: () => void;
  turnstile: {
    render: (
      selector: string,
      options: {
        theme?: 'light' | 'dark' | 'auto';
        sitekey: string;
        callback?: (token: string) => void | Promise<void>;
        'before-interactive-callback'?: () => void;
        'after-interactive-callback'?: () => void;
        'error-callback'?: (errorCode?: string) => void;
        'expired-callback'?: () => void;
        'timeout-callback'?: () => void;
        'unsupported-callback'?: () => void;
      }
    ) => string;
  };
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    keys: Array<{ name: string; expiration?: number }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

interface AnalyticsEngineDataset {
  writeDataPoint(dataPoint: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void;
}

declare const MAGIC_LINKS: KVNamespace;
declare const PLATFORM_LESSON_CACHE: KVNamespace;
declare const CIRCLE_MEMBERS: KVNamespace;
declare const TOOLKIT_10X3_MEMBERSHIP_KV: KVNamespace;
declare const ANON_GAME_STARTS: AnalyticsEngineDataset;

interface Env {
  SITE_URL: string;
  MAILING_SERVICE_URL: string;
  AIRTABLE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  JWT_SECRET: string;
  ENV: string;
  TEST_MODE?: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  CF_CAPTCHA_SITE_KEY: string;
  CF_CAPTCHA_SECRET_KEY: string;
  // Resend email service
  RESEND_API_KEY?: string;
  PLATFORM_LESSON_CACHE?: KVNamespace;
  // External auth - Circle API v1 tokens
  CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN?: string;
  CIRCLE_BRAVE_V1_TOKEN?: string;
  // External auth - membership cache
  CIRCLE_MEMBERS?: KVNamespace;
  TOOLKIT_10X3_MEMBERSHIP_KV?: KVNamespace;
  TEN_X_DEVS_3_EXTERNAL_AUTH_SOURCE?: string;
  TEN_X_DEVS_3_TOOLKIT_LEGACY_FALLBACK_ON_MISSING?: string;
  EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS?: number;
  EXTERNAL_MEMBERSHIP_CACHE_RETENTION_HOURS?: number;
  EXTERNAL_MEMBERSHIP_REFRESH_SECRET?: string;
  MAGIC_LINKS?: KVNamespace;
  GAME_STATE?: KVNamespace;
  GAME_API_TOKENS?: KVNamespace;
  ANON_GAME_STARTS?: AnalyticsEngineDataset;
  // MailerLite newsletter integration
  TEN_X_DEVS_MAILERLITE_API_KEY?: string;
  TEN_X_DEVS_MAILERLITE_NEWSLETTER_GROUP_ID?: string;
  TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID: string;
  TEN_X_DEVS_GAME_FINISHED_GROUP_ID: string;
  BADGES_API_BASE_URL?: string;
}
