/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/',
  USE_MOCK: import.meta.env.VITE_USE_MOCK_API === 'true',
  TIMEOUT: 30000, // 30 seconds
} as const;

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh',
  },

  // Profile
  PROFILE: {
    ME: 'profile/me',
  },

  // Menu
  MENU: {
    LIST: 'menu',
    CATEGORIES: 'menu/categories',
    ITEMS: 'menu/items',
    ITEM: (id: number) => `menu/${id}`,
    CREATE: 'menu',
    UPDATE: (id: number) => `menu/${id}`,
    DELETE: (id: number) => `menu/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: 'orders',
    MY_ORDERS: 'orders/my',
    CREATE: 'orders',
    DETAIL: (id: number) => `orders/${id}`,
    UPDATE_STATUS: (id: number) => `orders/${id}/status`,
    CANCEL: (id: number) => `orders/${id}/cancel`,
  },

  // Kitchen
  KITCHEN: {
    PENDING: 'kitchen/pending',
    PREPARING: 'kitchen/preparing',
    UPDATE_STATUS: (id: number) => `kitchen/${id}/status`,
  },

  // Admin
  ADMIN: {
    USERS: 'admin/users',
    STATS: 'admin/stats',
  },
} as const;
