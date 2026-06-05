/**
 * Data hooks for the nest frontend.
 *
 * Each hook wraps SWR around an apiFetch call. SWR gives us:
 *   - Automatic caching (same request from two components = one network call)
 *   - Loading and error states as plain booleans
 *   - Revalidation on focus/reconnect/interval
 *   - mutate() to invalidate the cache after a write
 *
 * Pattern:
 *   const { data, isLoading, error, mutate } = useSomething();
 *
 * After a successful POST/DELETE that should refresh the data, call mutate().
 */

'use client';

import useSWR, { useSWRConfig } from 'swr';
import { useCallback } from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';


// SWR's "fetcher" — the function it calls to get data. We just wrap apiFetch.
const fetcher = (path) => apiFetch(path);

// Normalize backend listing shape (snake_case) to what UI components expect (camelCase + some renames).
// The UI was originally built against MOCK_LISTINGS shape — this keeps every component working unchanged.
function normalizeListing(raw) {
  if (!raw) return raw;
  return {
    ...raw,
    priceLabel: raw.price_label,
    area: raw.area_sqft,
    type: raw.property_type,
    age: raw.age_years,
  };
}


// ----------------------------------------------------------------
// Listings
// ----------------------------------------------------------------

/**
 * All active listings, optionally filtered.
 * Pass filters as an object: { city, locality, bhk, property_type, min_price, max_price, featured, sort }
 */
export function useListings(filters = {}) {
  // Build query string from filters (skip undefined/null values).
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, v);
  });
  const qs = params.toString();
  const path = qs ? `/listings?${qs}` : '/listings';

  const { data, error, isLoading, mutate } = useSWR(path, fetcher);

  return {
    listings: (data || []).map(normalizeListing),
    isLoading,
    error,
    mutate,
  };
}

/** A single listing by ID. */
export function useListing(id) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/listings/${id}` : null,  // null = skip the fetch
    fetcher,
  );
  return { listing: normalizeListing(data), isLoading, error, mutate };
}


// ----------------------------------------------------------------
// Shortlist
// ----------------------------------------------------------------

/**
 * The current user's shortlist.
 * Returns:
 *   listings    — array of full listing objects (not just IDs)
 *   ids         — Set of shortlisted listing IDs for fast lookup
 *   addItem(id) — add a listing
 *   removeItem(id) — remove a listing
 *   toggleItem(id) — toggle
 *
 * Only fetches when the user is signed in.
 */
export function useShortlist() {
  const { isSignedIn } = useAuth();
  const { mutate: globalMutate } = useSWRConfig();

  const { data, error, isLoading, mutate } = useSWR(
    isSignedIn ? '/me/shortlist' : null,
    fetcher,
  );

  const listings = (data || []).map(normalizeListing);
  const ids = new Set(listings.map(l => l.id));

  const addItem = useCallback(async (listingId) => {
    if (!isSignedIn) return;
    // Optimistic update: add to local cache immediately, then revalidate.
    try {
      await apiFetch(`/me/shortlist/${listingId}`, { method: 'POST' });
      await mutate();  // refetch the shortlist
    } catch (err) {
      console.error('Failed to add to shortlist:', err);
      throw err;
    }
  }, [isSignedIn, mutate]);

  const removeItem = useCallback(async (listingId) => {
    if (!isSignedIn) return;
    try {
      await apiFetch(`/me/shortlist/${listingId}`, { method: 'DELETE' });
      await mutate();
    } catch (err) {
      console.error('Failed to remove from shortlist:', err);
      throw err;
    }
  }, [isSignedIn, mutate]);

  const toggleItem = useCallback(async (listingId) => {
    if (ids.has(listingId)) {
      await removeItem(listingId);
    } else {
      await addItem(listingId);
    }
  }, [ids, addItem, removeItem]);

  return {
    listings,
    ids,
    isLoading,
    error,
    addItem,
    removeItem,
    toggleItem,
    mutate,
  };
}


// ----------------------------------------------------------------
// Events (fire-and-forget telemetry)
// ----------------------------------------------------------------

/**
 * Hook returning a single function to log a behavioral event.
 * Events are best-effort — failure is logged but doesn't throw.
 *
 * Usage:
 *   const logEvent = useLogEvent();
 *   logEvent('listing_view', { listing_id: '...' });
 */
export function useLogEvent() {
  return useCallback((type, payload = {}) => {
    // Fire and forget — don't await, don't block UI.
    apiFetch('/events', {
      method: 'POST',
      body: { type, payload },
    }).catch(err => {
      // Silently log — events failing should never break the user experience.
      console.debug('Event log failed:', type, err);
    });
  }, []);
}
