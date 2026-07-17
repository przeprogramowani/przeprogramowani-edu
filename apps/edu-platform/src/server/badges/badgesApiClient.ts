export interface BadgesApiEnv {
  BADGES_API_BASE_URL: string;
  SITE_URL: string;
}

export type BadgesApiErrorCode =
  | 'origin_forbidden'
  | 'rate_limited'
  | 'validation'
  | 'upstream_error'
  | 'network';

export class BadgesApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly code: BadgesApiErrorCode,
  ) {
    super(message);
    this.name = 'BadgesApiError';
  }
}

export interface CatalogBadge {
  id: number;
  name: string;
  overlayPath: string;
  useAstronautCompositionHints?: boolean;
}

export interface CatalogResponse {
  count: number;
  canvas: unknown;
  badges: CatalogBadge[];
}

export interface GenerateResponse {
  imageUrl: string;
  name: string;
  persistedToDatabase: boolean;
  recordId: string | number;
}

export interface ListResponse {
  count: number;
  badges: Array<{
    badgeId: number;
    name: string;
    imageUrl: string;
    generatedAt: string;
    updatedAt: string;
    recordId: string | number;
  }>;
}

function codeFromStatus(status: number): BadgesApiErrorCode {
  if (status === 403) return 'origin_forbidden';
  if (status === 429) return 'rate_limited';
  if (status === 400) return 'validation';
  return 'upstream_error';
}

async function call<T>(
  path: string,
  init: { method: 'GET' | 'POST'; body?: unknown },
  env: BadgesApiEnv,
): Promise<T> {
  const url = `${env.BADGES_API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Origin: env.SITE_URL,
    'Content-Type': 'application/json',
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: init.method,
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch (err) {
    throw new BadgesApiError(
      `Network error contacting badges API: ${String(err)}`,
      null,
      'network',
    );
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new BadgesApiError(
      `Badges API ${response.status}: ${text}`,
      response.status,
      codeFromStatus(response.status),
    );
  }

  const text = await response.text();
  return JSON.parse(text) as T;
}

export function getCatalog(env: BadgesApiEnv): Promise<CatalogResponse> {
  return call<CatalogResponse>('/api/catalog-badge', { method: 'GET' }, env);
}

export interface GenerateBadgeInput {
  email: string;
  badgeId: number;
  imageUrl: string;
}

export function generateBadge(
  input: GenerateBadgeInput,
  env: BadgesApiEnv,
): Promise<GenerateResponse> {
  return call<GenerateResponse>(
    '/api/catalog-badge/generate',
    { method: 'POST', body: input },
    env,
  );
}

export function listBadges(
  input: { email: string },
  env: BadgesApiEnv,
): Promise<ListResponse> {
  return call<ListResponse>(
    '/api/catalog-badge/list',
    { method: 'POST', body: input },
    env,
  );
}

export interface ParticipationBadgeResponse {
  success: true;
  email: string;
  imageUrl: string;
  generatedAt: string;
  referralCode: string;
  referralLink: string;
  role: string;
  goal: string;
}

export async function getParticipationBadge(
  email: string,
  env: BadgesApiEnv,
): Promise<ParticipationBadgeResponse | null> {
  const url = `${env.BADGES_API_BASE_URL}/api/participation-badge?email=${encodeURIComponent(email)}`;
  const headers: Record<string, string> = {
    Origin: env.SITE_URL,
  };

  let response: Response;
  try {
    response = await fetch(url, { method: 'GET', headers });
  } catch (err) {
    throw new BadgesApiError(
      `Network error contacting badges API: ${String(err)}`,
      null,
      'network',
    );
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new BadgesApiError(
      `Badges API ${response.status}: ${text}`,
      response.status,
      codeFromStatus(response.status),
    );
  }

  const text = await response.text();
  return JSON.parse(text) as ParticipationBadgeResponse;
}
