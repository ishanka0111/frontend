/**
 * Storage Keys - Centralized localStorage key definitions
 */

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_ROUTE: 'lastRoute',
  TABLE_NUMBER: 'tableNumber',
  SESSION_ID: 'sessionId',
} as const;

/**
 * Type-safe storage operations
 */
export const storage = {
  get: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch {
      return localStorage.getItem(key) as unknown as T;
    }
  },

  set: <T = any>(key: string, value: T): void => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },

  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },
};

/**
 * Specific storage helpers
 */
export const tokenStorage = {
  get: () => storage.get<string>(STORAGE_KEYS.TOKEN),
  set: (token: string) => storage.set(STORAGE_KEYS.TOKEN, token),
  remove: () => storage.remove(STORAGE_KEYS.TOKEN),
};

export const userStorage = {
  get: () => storage.get<any>(STORAGE_KEYS.USER),
  set: (user: any) => storage.set(STORAGE_KEYS.USER, user),
  remove: () => storage.remove(STORAGE_KEYS.USER),
};

export const cartStorage = {
  get: () => storage.get<any[]>(STORAGE_KEYS.CART) || [],
  set: (cart: any[]) => storage.set(STORAGE_KEYS.CART, cart),
  remove: () => storage.remove(STORAGE_KEYS.CART),
};
