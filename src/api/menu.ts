/**
 * Menu API Functions
 * Handles menu items, categories, and inventory
 */

import { CONFIG } from '../utils/config';
import { withDelay, withDelayError } from '../services/mockApiDelayer';
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES, MOCK_INVENTORY } from '../services/mockDataGenerator';
import type { MenuItem, Category } from '../services/mockDataGenerator';

// ============================================================================
// MOCK IMPLEMENTATIONS
// ============================================================================

async function mockGetCategories(): Promise<Category[]> {
  if (CONFIG.DEBUG) {
    console.log(`Mock getCategories - returning ${MOCK_CATEGORIES.length} categories`);
  }
  return withDelay<Category[]>(MOCK_CATEGORIES);
}

async function mockGetMenuItems(categoryId?: number): Promise<MenuItem[]> {
  let items = MOCK_MENU_ITEMS;

  if (categoryId) {
    items = items.filter((item) => item.categoryId === categoryId);
  }

  if (CONFIG.DEBUG) {
    const suffix = categoryId ? ` for category ${categoryId}` : '';
    console.log(`Mock getMenuItems - returning ${items.length} items${suffix}`);
  }

  return withDelay<MenuItem[]>(items);
}

async function mockGetMenuItem(itemId: number): Promise<MenuItem> {
  const item = MOCK_MENU_ITEMS.find((i) => i.id === itemId);

  if (!item) {
    return withDelayError(new Error(`Menu item ${itemId} not found`), CONFIG.MOCK_API_DELAY);
  }

  if (CONFIG.DEBUG) {
    console.log(`Mock getMenuItem - returning item ${itemId}: ${item.name}`);
  }

  return withDelay<MenuItem>(item);
}

async function mockGetInventory(): Promise<Record<number, { stock: number; reorderLevel: number }>> {
  if (CONFIG.DEBUG) {
    console.log(`Mock getInventory - returning inventory data`);
  }
  return withDelay<Record<number, { stock: number; reorderLevel: number }>>(MOCK_INVENTORY);
}

// ============================================================================
// REAL API IMPLEMENTATIONS
// ============================================================================

async function realGetCategories(): Promise<Category[]> {
  const response = await fetch(`${CONFIG.API_BASE_URL}/menu/categories`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

async function realGetMenuItems(categoryId?: number): Promise<MenuItem[]> {
  const url = new URL(`${CONFIG.API_BASE_URL}/menu`);
  if (categoryId) {
    url.searchParams.append('categoryId', categoryId.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu items: ${response.statusText}`);
  }

  return response.json();
}

async function realGetMenuItem(itemId: number): Promise<MenuItem> {
  const response = await fetch(`${CONFIG.API_BASE_URL}/menu/${itemId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu item ${itemId}: ${response.statusText}`);
  }

  return response.json();
}

async function realGetInventory(): Promise<Record<number, { stock: number; reorderLevel: number }>> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}/inventory`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch inventory: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// PUBLIC EXPORTS (Auto-routes to mock or real based on CONFIG)
// ============================================================================

/**
 * Get all menu categories
 */
export async function getCategories(): Promise<Category[]> {
  if (CONFIG.USE_MOCK_API) {
    return mockGetCategories();
  }
  return realGetCategories();
}

/**
 * Get menu items, optionally filtered by category
 */
export async function getMenuItems(categoryId?: number): Promise<MenuItem[]> {
  if (CONFIG.USE_MOCK_API) {
    return mockGetMenuItems(categoryId);
  }
  return realGetMenuItems(categoryId);
}

/**
 * Get a specific menu item by ID
 */
export async function getMenuItem(itemId: number): Promise<MenuItem> {
  if (CONFIG.USE_MOCK_API) {
    return mockGetMenuItem(itemId);
  }
  return realGetMenuItem(itemId);
}

/**
 * Get current inventory levels
 * Requires authentication (Kitchen/Admin)
 */
export async function getInventory(): Promise<Record<number, { stock: number; reorderLevel: number }>> {
  if (CONFIG.USE_MOCK_API) {
    return mockGetInventory();
  }
  return realGetInventory();
}
