/**
 * Authentication Context
 * Manages user authentication state and provides auth-related functions
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../types';
import { getProfile } from '../api/auth';
import { clearTokens, isAuthenticated as checkIsAuthenticated } from '../utils/jwt';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import { STORAGE_KEYS, storage } from '../constants/storage';

export type TableId = number | string | null;

export interface AuthContextType {
  user: UserProfile | null;
  tableId: TableId;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  logout: () => void;
  refreshUser: () => Promise<UserProfile>;
  setError: (error: string | null) => void;
  setTableId: (id: TableId) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

const TABLE_ID_COOKIE = 'tableId';
const TABLE_EXPIRY_HOURS = 5; // 5 hours validity

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tableId, internalSetTableId] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check for tableId in URL params
      const params = new URLSearchParams(globalThis.location.search);
      const urlTableId = params.get('tableId');
      
      if (urlTableId) {
        internalSetTableId(urlTableId);
        // Save to cookie with 5-hour expiration
        setCookie(TABLE_ID_COOKIE, urlTableId, TABLE_EXPIRY_HOURS);
        // Also save to localStorage as backup
        storage.set(STORAGE_KEYS.TABLE_NUMBER, urlTableId);
        console.log(`TableId ${urlTableId} saved (expires in ${TABLE_EXPIRY_HOURS} hours)`);
      } else {
        // Try to load from cookie first (preferred)
        const cookieTableId = getCookie(TABLE_ID_COOKIE);
        if (cookieTableId) {
          internalSetTableId(cookieTableId);
          console.log('TableId loaded from cookie:', cookieTableId);
        } else {
          // Fallback to localStorage
          const savedTableId = storage.get<string>(STORAGE_KEYS.TABLE_NUMBER);
          if (savedTableId) {
            internalSetTableId(savedTableId);
            // Restore to cookie if found in localStorage
            setCookie(TABLE_ID_COOKIE, savedTableId, TABLE_EXPIRY_HOURS);
            console.log('TableId restored from localStorage to cookie:', savedTableId);
          }
        }
      }

      // Check if user is authenticated
      if (checkIsAuthenticated()) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      setError(null);
      return profile; // Return the profile data
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
      setError('Failed to load user profile');
      setUser(null);
      throw err; // Re-throw so caller can handle
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    internalSetTableId(null);
    // Clear tableId from both cookie and localStorage
    deleteCookie(TABLE_ID_COOKIE);
    storage.remove(STORAGE_KEYS.TABLE_NUMBER);
    console.log('Logout: tableId cleared from cookie and localStorage');
    globalThis.location.href = '/login';
  }, []);

  const setTableId = useCallback((id: TableId) => {
    internalSetTableId(id);
    if (id) {
      // Save to cookie with 5-hour expiration
      setCookie(TABLE_ID_COOKIE, id.toString(), TABLE_EXPIRY_HOURS);
      // Also save to localStorage as backup
      storage.set(STORAGE_KEYS.TABLE_NUMBER, id.toString());
      console.log(`TableId ${id} set (expires in ${TABLE_EXPIRY_HOURS} hours)`);
    } else {
      // Clear both cookie and localStorage
      deleteCookie(TABLE_ID_COOKIE);
      storage.remove(STORAGE_KEYS.TABLE_NUMBER);
      console.log('TableId cleared');
    }
  }, []);

  const value: AuthContextType = React.useMemo(() => ({
    user,
    tableId,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
    refreshUser,
    setError,
    setTableId,
  }), [user, tableId, isLoading, error, logout, refreshUser, setError, setTableId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
