/**
 * Order Status Constants - Centralized order status definitions
 */

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PAID = 'paid',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '⏳ Pending',
  [OrderStatus.CONFIRMED]: '✔️ Confirmed',
  [OrderStatus.PREPARING]: '👨‍🍳 Preparing',
  [OrderStatus.READY]: '🔔 Ready',
  [OrderStatus.SERVED]: '🍽️ Served',
  [OrderStatus.COMPLETED]: '✅ Completed',
  [OrderStatus.CANCELLED]: '❌ Cancelled',
  [OrderStatus.PAID]: '💳 Paid',
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'badge-pending',
  [OrderStatus.CONFIRMED]: 'badge-confirmed',
  [OrderStatus.PREPARING]: 'badge-preparing',
  [OrderStatus.READY]: 'badge-ready',
  [OrderStatus.SERVED]: 'badge-served',
  [OrderStatus.COMPLETED]: 'badge-completed',
  [OrderStatus.CANCELLED]: 'badge-cancelled',
  [OrderStatus.PAID]: 'badge-paid',
};

/**
 * Payment Status Constants
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending Payment',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.FAILED]: 'Payment Failed',
  [PaymentStatus.REFUNDED]: 'Refunded',
};

/**
 * Order status workflow helpers
 */
export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.SERVED],
  [OrderStatus.SERVED]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [OrderStatus.PAID],
  [OrderStatus.PAID]: [],
  [OrderStatus.CANCELLED]: [],
};

/**
 * Get available next statuses for an order
 */
export const getNextStatuses = (currentStatus: string): OrderStatus[] => {
  return ORDER_STATUS_FLOW[currentStatus as OrderStatus] || [];
};

/**
 * Check if status transition is valid
 */
export const isValidStatusTransition = (from: string, to: string): boolean => {
  const validNextStatuses = getNextStatuses(from);
  return validNextStatuses.includes(to as OrderStatus);
};

/**
 * Get status priority for sorting
 */
export const ORDER_STATUS_PRIORITY: Record<OrderStatus, number> = {
  [OrderStatus.READY]: 1,
  [OrderStatus.PREPARING]: 2,
  [OrderStatus.CONFIRMED]: 3,
  [OrderStatus.PENDING]: 4,
  [OrderStatus.SERVED]: 5,
  [OrderStatus.COMPLETED]: 6,
  [OrderStatus.PAID]: 7,
  [OrderStatus.CANCELLED]: 8,
};

export const getStatusPriority = (status: string): number => {
  return ORDER_STATUS_PRIORITY[status as OrderStatus] || 99;
};
