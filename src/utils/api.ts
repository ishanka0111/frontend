/**
 * API Client Utilities
 * Handles HTTP requests with automatic token management and refresh
 */

import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './jwt';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/';

export interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const newAccessToken = await res.text();
    setAccessToken(newAccessToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * Enhanced fetch with automatic authentication and token refresh
 */
export async function fetchWithAuth(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  const { skipAuth, ...fetchOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  // Add Authorization header if not skipped and token exists
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    let response = await fetch(url, fetchOptions);

    // If 401/403, try to refresh token and retry once
    if ((response.status === 401 || response.status === 403) && !skipAuth) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const newToken = getAccessToken();
        if (newToken) {
          fetchOptions.headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(url, fetchOptions);
        }
      } else {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        globalThis.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    // Parse response based on content type
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
