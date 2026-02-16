/**
 * Shared helpers for menu item display
 */

import { MOCK_MENU_ITEMS } from '../services/mockDataGenerator';

export const getMenuItemNameById = (menuItemId: number): string => {
  const item = MOCK_MENU_ITEMS.find((menuItem) => menuItem.id === menuItemId);
  return item ? item.name : 'Unknown Item';
};
