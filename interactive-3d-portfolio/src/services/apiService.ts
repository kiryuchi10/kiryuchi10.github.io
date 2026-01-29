/**
 * API service for interactive-3d-portfolio: contact, analytics, health.
 * Assumes same-origin /api/* (e.g. Netlify Functions).
 */

const BASE = '';
const TIMEOUT = 12000;

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${BASE}${url}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
    });
    clearTimeout(timeoutId);
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const err = new Error((data.error as string) || `HTTP ${res.status}`) as Error & { response?: { status: number } };
      err.response = { status: res.status };
      throw err;
    }
    return data as T;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === 'AbortError') {
      const err = new Error('Request timeout') as Error & { code?: string };
      err.code = 'ECONNABORTED';
      throw err;
    }
    throw e;
  }
}

export async function sendContact(data: { name: string; email: string; subject: string; message: string }): Promise<{ status: string; message?: string }> {
  return request<{ status: string; message?: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface AnalyticsData {
  total_visitors: number;
  github_users: number;
  total_messages: number;
  visitors_by_country: [string, number][];
  visitors_by_page: [string, number][];
  recent_visitors: unknown[];
}

export async function getAnalytics(): Promise<{ data: AnalyticsData }> {
  return request<{ data: AnalyticsData }>('/api/analytics');
}

export async function checkApiStatus(): Promise<{ isOnline: boolean }> {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${BASE}/api/analytics`, { method: 'GET', signal: controller.signal });
    return { isOnline: res.ok };
  } catch {
    return { isOnline: false };
  }
}
