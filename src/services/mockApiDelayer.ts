/**
 * Mock API Delayer
 * Simulates realistic network latency
 */

import { CONFIG } from '../utils/config';

/**
 * Wrap a response with simulated network delay
 * @param data - Data to return
 * @param customDelay - Optional custom delay in ms (uses CONFIG.MOCK_API_DELAY if not provided)
 * @returns Promise that resolves after delay
 */
export async function withDelay<T>(data: T, customDelay?: number): Promise<T> {
  const delay = customDelay ?? CONFIG.MOCK_API_DELAY;
  return new Promise((resolve) => {
    setTimeout(() => {
      if (CONFIG.DEBUG) {
        console.log(`Mock API response after ${delay}ms`);
      }
      resolve(data);
    }, delay);
  });
}

/**
 * Simulate an error response with delay
 * @param error - Error to throw
 * @param customDelay - Optional custom delay
 */
export async function withDelayError<T extends Error>(error: T, customDelay?: number): Promise<never> {
  const delay = customDelay ?? CONFIG.MOCK_API_DELAY;
  return new Promise((_, reject) => {
    setTimeout(() => {
      if (CONFIG.DEBUG) {
        console.error(`Mock API error after ${delay}ms:`, error);
      }
      reject(error);
    }, delay);
  });
}
