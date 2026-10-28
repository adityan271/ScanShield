import type { AnalysisApiResponse, AnalysisResult, HealthStatus } from '../types/index.js';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

function getApiUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
  }

  const baseUrl = new URL(API_BASE_URL);
  const isLocalDevelopmentUrl =
    import.meta.env.DEV &&
    baseUrl.protocol === 'http:' &&
    LOCAL_HOSTS.has(baseUrl.hostname);

  if (
    baseUrl.username ||
    baseUrl.password ||
    baseUrl.search ||
    baseUrl.hash ||
    baseUrl.pathname !== '/' ||
    (baseUrl.protocol !== 'https:' && !isLocalDevelopmentUrl)
  ) {
    throw new Error(
      'VITE_API_BASE_URL must be an HTTPS origin (HTTP is only allowed for localhost during development).'
    );
  }

  return new URL(path, baseUrl).toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (!isRecord(value)) {
    return false;
  }

  const validRiskLevels = ['HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT_INFORMATION'];
  return (
    typeof value.riskLevel === 'string' &&
    validRiskLevels.includes(value.riskLevel) &&
    typeof value.summary === 'string' &&
    Array.isArray(value.warningSigns) &&
    value.warningSigns.every(
      (sign) =>
        isRecord(sign) &&
        typeof sign.title === 'string' &&
        typeof sign.evidence === 'string' &&
        typeof sign.explanation === 'string'
    ) &&
    Array.isArray(value.safeActions) &&
    value.safeActions.every((action) => typeof action === 'string') &&
    typeof value.limitations === 'string' &&
    (value.mode === 'live' || value.mode === 'demo')
  );
}

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function errorMessageFrom(data: unknown, fallback: string): string {
  return isRecord(data) && typeof data.error === 'string' ? data.error : fallback;
}

const requestOptions = {
  credentials: 'omit' as RequestCredentials,
  redirect: 'error' as RequestRedirect,
  cache: 'no-store' as RequestCache,
  referrerPolicy: 'no-referrer' as ReferrerPolicy,
};

export async function checkServerHealth(): Promise<HealthStatus | null> {
  try {
    const res = await fetch(getApiUrl('/api/health'), {
      ...requestOptions,
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await readJson(res);
    if (
      !isRecord(data) ||
      data.status !== 'ok' ||
      (data.mode !== 'live' && data.mode !== 'demo') ||
      typeof data.provider !== 'string' ||
      typeof data.timestamp !== 'string'
    ) {
      return null;
    }

    return {
      status: data.status,
      mode: data.mode,
      provider: data.provider,
      timestamp: data.timestamp,
    };
  } catch {
    return null;
  }
}

export async function analyzeMessageApi(
  message: string,
  forceDemo: boolean = false
): Promise<AnalysisApiResponse> {
  try {
    const res = await fetch(getApiUrl('/api/analyze'), {
      ...requestOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        message,
        forceDemo,
      }),
    });

    const data = await readJson(res);

    if (!res.ok) {
      return {
        success: false,
        error: errorMessageFrom(data, `Server responded with status code ${res.status}.`),
        canFallbackToDemo: isRecord(data) && Boolean(data.canFallbackToDemo),
      };
    }

    if (!isRecord(data) || data.success !== true || !isAnalysisResult(data.analysis)) {
      return {
        success: false,
        error: 'The server returned an invalid analysis response. Please try again.',
        canFallbackToDemo: false,
      };
    }

    return {
      success: true,
      analysis: data.analysis,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unable to connect securely to the ScamShield backend API.',
      canFallbackToDemo: true,
    };
  }
}
