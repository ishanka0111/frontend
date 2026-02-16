/**
 * Authentication Context Types
 */

import type { UserProfile } from '../types';

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
