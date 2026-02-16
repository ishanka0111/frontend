/**
 * Order Status Constants - Centralized order status definitions
 */

export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PAID: 'paid',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  completed: 'Completed',
  cancelled: 'Cancelled',
  paid: 'Paid',
};

export const ORDER_STATUS_BADGE_CLASSES: Record<string, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  preparing: 'badge-preparing',
  ready: 'badge-ready',
  served: 'badge-served',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
  paid: 'badge-paid',
};

/**
 * Payment Status Constants
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Payment',
  paid: 'Paid',
  failed: 'Payment Failed',
  refunded: 'Refunded',
};

/**
 * Order status workflow helpers
 */
export const ORDER_STATUS_FLOW: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['served'],
  served: ['completed'],
  completed: ['paid'],
  paid: [],
  cancelled: [],
};

/**
 * Get available next statuses for an order
 */
export const getNextStatuses = (currentStatus: string): string[] => {
  return ORDER_STATUS_FLOW[currentStatus] || [];
};

/**
 * Check if status transition is valid
 */
export const isValidStatusTransition = (from: string, to: string): boolean => {
  const validNextStatuses = getNextStatuses(from);
  return validNextStatuses.includes(to);
};

/**
 * Get status priority for sorting
 */
export const ORDER_STATUS_PRIORITY: Record<string, number> = {
  ready: 1,
  preparing: 2,
  confirmed: 3,
  pending: 4,
  served: 5,
  completed: 6,
  paid: 7,
  cancelled: 8,
};

export const getStatusPriority = (status: string): number => {
  return ORDER_STATUS_PRIORITY[status] || 99;
};
