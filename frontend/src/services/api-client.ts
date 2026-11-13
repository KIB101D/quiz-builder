const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export interface ApiErrorDetail {
  path: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details: ApiErrorDetail[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isNotFound() {
    return this.status === 404;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', ...init.headers },
    });
  } catch {
    throw new ApiError(0, `Cannot reach the API at ${API_URL}. Is the backend running?`);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
      details?: ApiErrorDetail[];
    } | null;

    throw new ApiError(
      response.status,
      body?.message ?? `Request failed with status ${response.status}`,
      body?.details,
    );
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
