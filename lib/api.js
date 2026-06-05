/**
 * nest API client.
 *
 * Wraps the browser's built-in fetch() with our application's concerns:
 *   - Base URL configuration (http://localhost:8000 in dev)
 *   - Automatic JSON body serialization
 *   - Auth token attachment on every authenticated request
 *   - Silent refresh when access token expires (single retry on 401)
 *   - Structured error handling via the ApiError class
 *
 * Most files in the app should NOT import fetch() directly.
 * Always use apiFetch() so auth and errors are handled consistently.
 */

// ---------- Config ----------

const API_BASE =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://localhost:8000';

const TOKEN_KEY = 'nest_access_token';
const REFRESH_KEY = 'nest_refresh_token';


// ---------- Token storage ----------
//
// We use localStorage so tokens survive page refreshes and tab restarts.
// The typeof-window check exists because Next.js can render components on
// the server, where localStorage doesn't exist. Reading there returns null
// (effectively "not signed in" during server render), and the real value
// is loaded once the browser takes over.

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken, refreshToken) {
  if (typeof window === 'undefined') return;
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}


// ---------- Refresh logic ----------
//
// When the access token expires, we exchange the refresh token for a new
// access token. The `refreshPromise` variable deduplicates concurrent
// refreshes: if five API calls all hit 401 at the same time, they share
// a single refresh request instead of triggering five.

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401);
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) {
        clearTokens();
        throw new ApiError('Refresh failed', res.status);
      }

      const { access_token } = await res.json();
      setTokens(access_token, null);
      return access_token;
    } finally {
      // Always clear the in-flight cache so the next 401 starts fresh
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}


// ---------- The custom error class ----------
//
// JavaScript's built-in Error only carries a message. Our API returns
// structured error responses (status code, detail body), so we subclass
// Error to capture those for consumers to inspect.

export class ApiError extends Error {
  constructor(message, status, detail = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}


// ---------- The main function ----------
//
// Usage:
//   const listings = await apiFetch('/listings');
//   await apiFetch('/auth/verify-otp', { method: 'POST', body: { phone, code } });
//   await apiFetch('/me/shortlist/abc-123', { method: 'POST' });
//
// Pass body as a plain object; it's stringified for you.
// Pass method as 'GET' (default), 'POST', 'PATCH', 'DELETE', etc.

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const opts = { ...options };

  // Build headers — start from caller's headers if any.
  const headers = { ...(opts.headers || {}) };

  // Auto-serialize object bodies to JSON.
  if (
    opts.body !== undefined &&
    opts.body !== null &&
    typeof opts.body === 'object' &&
    !(opts.body instanceof FormData) &&
    !(opts.body instanceof Blob)
  ) {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }

  // Attach auth token if we have one.
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  opts.headers = headers;

  // Send the request.
  let response;
  try {
    response = await fetch(url, opts);
  } catch (networkError) {
    // fetch only throws for actual network failures (DNS, offline, CORS).
    // HTTP errors (4xx, 5xx) come back as normal responses — we handle those below.
    throw new ApiError(
      'Network error — check your connection',
      0,
      { networkError: networkError.message }
    );
  }

  // 401 with a token = token expired. Refresh and retry once.
  if (response.status === 401 && token) {
    try {
      const newToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...opts, headers });
    } catch (refreshError) {
      // Refresh itself failed (refresh token expired, etc.).
      // Tokens are already cleared by refreshAccessToken on failure.
      throw new ApiError('Authentication expired', 401);
    }
  }

  // Handle non-2xx responses.
  if (!response.ok) {
    let detail = null;
    try {
      detail = await response.json();
    } catch {
      // Response wasn't JSON — that's fine, leave detail as null.
    }

    // FastAPI puts errors under `detail`, which may be a string or object.
    // We surface the most useful message in `.message` for simple display,
    // while preserving the full structured detail for handlers that need it.
    let message = response.statusText;
    if (detail?.detail) {
      message = typeof detail.detail === 'string'
        ? detail.detail
        : (detail.detail.message || JSON.stringify(detail.detail));
    }

    throw new ApiError(message, response.status, detail);
  }

  // 204 No Content (returned by DELETE endpoints) has no body to parse.
  if (response.status === 204) return null;

  // Some responses might not have a body even with other 2xx codes — handle gracefully.
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    // Backend returned non-JSON content; pass through as text.
    return text;
  }
}
