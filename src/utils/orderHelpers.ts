/**
 * Shared helpers for order display
 */

import type { Order } from '../services/mockDataGenerator';
import { ORDER_STATUS_BADGE_CLASSES, ORDER_STATUS_LABELS, OrderStatus } from '../constants/orderStatus';

// Map Order status to OrderStatus values
const mapOrderStatus = (status: Order['status']): string => {
  const statusMap: Record<Order['status'], string> = {
    PLACED: OrderStatus.PENDING,
    PREPARING: OrderStatus.PREPARING,
    READY: OrderStatus.READY,
    SERVED: OrderStatus.SERVED,
    PAID: OrderStatus.PAID,
  };
  return statusMap[status] || OrderStatus.PENDING;
};

export const getOrderStatusBadgeClass = (status: Order['status']): string => {
  const orderStatus = mapOrderStatus(status);
  return ORDER_STATUS_BADGE_CLASSES[orderStatus] || '';
};

export const getOrderStatusLabel = (status: Order['status']): string => {
  const orderStatus = mapOrderStatus(status);
  return ORDER_STATUS_LABELS[orderStatus] || status;
};

export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
};
