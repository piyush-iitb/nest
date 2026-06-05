/**
 * Auth context: provides user/signIn/signOut to any component via useAuth().
 *
 * Lifecycle:
 *   - On mount, checks localStorage for a token; if present, fetches /me
 *     to hydrate the user. This is what makes "refresh and stay signed in"
 *     work.
 *   - signIn(phone, code) calls /auth/verify-otp, stores tokens, sets user.
 *   - signOut() calls /auth/sign-out, clears tokens, resets user.
 *
 * Used by wrapping the app in <AuthProvider> (done in app/providers.js)
 * and reading from useAuth() inside components.
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  apiFetch,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  ApiError,
} from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user: the signed-in user object, or null if not signed in.
  // isLoading: true while we're hydrating from the stored token on app load.
  //            This matters because we don't want the UI to flash "signed out"
  //            in the moment between page-load and the /me response arriving.
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------- On mount: hydrate from localStorage ----------
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const token = getAccessToken();
      if (!token) {
        // No token = definitely signed out. Done hydrating.
        if (!cancelled) setIsLoading(false);
        return;
      }

      // We have a token — try to fetch /me. apiFetch handles auto-refresh
      // if the access token is expired.
      try {
        const me = await apiFetch('/me');
        if (!cancelled) setUser(me);
      } catch (err) {
        // Token is invalid and refresh failed (or there's no refresh token).
        // Clear tokens and treat as signed out.
        if (err instanceof ApiError && err.status === 401) {
          clearTokens();
        }
        // For other errors (e.g., backend is down), keep tokens so they can
        // retry when the backend recovers. user stays null.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    hydrate();
    return () => { cancelled = true; };
  }, []);

  // ---------- Sign-in flow ----------
  //
  // Two-step: request OTP, then verify. Each step is a separate function
  // so the AuthModal can show different screens for each.

  const requestOtp = useCallback(async (phone) => {
    // Returns { sent: true } on success; throws ApiError on failure
    // (e.g., rate-limited 429, invalid phone 422).
    return await apiFetch('/auth/request-otp', {
      method: 'POST',
      body: { phone },
    });
  }, []);

  const verifyOtp = useCallback(async (phone, code) => {
    // On success, stores tokens and sets user. Returns the user object.
    // On failure (wrong code, expired, etc.), throws ApiError.
    const result = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: { phone, code },
    });
    setTokens(result.access_token, result.refresh_token);
    setUser(result.user);
    return result.user;
  }, []);

  // ---------- Update profile (name, intent, city) ----------
  //
  // Used by the profile page, intent modal, and name-entry step of signup.
  // PATCH /me returns the updated user; we update local state to match.

  const updateProfile = useCallback(async (patch) => {
    const updated = await apiFetch('/me', {
      method: 'PATCH',
      body: patch,
    });
    setUser(updated);
    return updated;
  }, []);

  // ---------- Sign-out ----------

  const signOut = useCallback(async () => {
    // Best-effort: tell the backend to revoke the refresh token.
    // If this fails (network/server down), we still clear local state.
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiFetch('/auth/sign-out', {
          method: 'POST',
          body: { refresh_token: refreshToken },
        });
      } catch {
        // Ignore — local clear is what really matters for the user experience.
      }
    }
    clearTokens();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isSignedIn: user !== null,
    requestOtp,
    verifyOtp,
    updateProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to read auth state and call auth actions from any component.
 *
 * Usage:
 *   const { user, isSignedIn, signOut } = useAuth();
 *   if (!isSignedIn) return <LoginPrompt />;
 *   return <div>Welcome {user.name}</div>;
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}
