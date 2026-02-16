/**
 * Application Configuration
 * Controls mock vs real API, base URLs, and behavior toggles
 */

export const CONFIG = {
  // Toggle between mock and real API
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  
  // API endpoints
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // WebSocket URL (Gateway route)
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws-waiter',
  
  // Simulate network latency (ms)
  MOCK_API_DELAY: 500,
  
  // Cookie settings
  COOKIE_EXPIRY_HOURS: 5,
  
  // Development logging
  DEBUG: import.meta.env.DEV,
} as const;

/**
 * Log configuration on app start (dev only)
 */
export function logConfig() {
  if (CONFIG.DEBUG) {
    console.log('🔧 App Configuration:', {
      USE_MOCK_API: CONFIG.USE_MOCK_API,
      API_BASE_URL: CONFIG.API_BASE_URL,
      WS_URL: CONFIG.WS_URL,
      MOCK_API_DELAY: CONFIG.MOCK_API_DELAY,
      ENVIRONMENT: import.meta.env.MODE,
    });
  }
}
