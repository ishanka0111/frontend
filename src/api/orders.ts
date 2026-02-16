/**
 * Orders API Functions
 * Handles order placement, tracking, and management
 */

import { CONFIG } from '../utils/config';
import { withDelay, withDelayError } from '../services/mockApiDelayer';
import { MOCK_ORDERS, MOCK_MENU_ITEMS } from '../services/mockDataGenerator';
import type { Order } from '../services/mockDataGenerator';

export interface PlaceOrderRequest {
  tableId: string;
  items: {
    menuItemId: number;
    quantity: number;
  }[];
}

export interface PlaceOrderResponse {
  orderId: string;
  status: Order['status'];
  totalAmount: number;
  estimatedTime: number;
}

export interface OrderUpdateRequest {
  status: Order['status'];
}

// ============================================================================
// MOCK IMPLEMENTATIONS
// ============================================================================

async function mockPlaceOrder(customerId: number, request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
  // Calculate total and build order items
  let total = 0;
  const orderItems = request.items.map(item => {
    const menuItem = MOCK_MENU_ITEMS.find((m) => m.id === item.menuItemId);
    if (menuItem) {
      total += menuItem.price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      };
    }
    return null;
  }).filter((item): item is { menuItemId: number; quantity: number; price: number } => item !== null);

  // Generate order ID
  const orderId = `ORD-${String(MOCK_ORDERS.length + 1).padStart(5, '0')}`;
  const estimatedTime = Math.floor(Math.random() * 20) + 15;
  const now = new Date().toISOString();

  // Create the new order object
  const newOrder: Order = {
    id: orderId,
    customerId,
    tableId: request.tableId,
    items: orderItems,
    totalAmount: Number.parseFloat(total.toFixed(2)),
    status: 'PLACED',
    createdAt: now,
    updatedAt: now,
    estimatedTime,
  };

  // Add to MOCK_ORDERS array
  MOCK_ORDERS.push(newOrder);

  if (CONFIG.DEBUG) {
    console.log(`Mock placeOrder - Order ${orderId} placed for customer ${customerId}, table ${request.tableId}`);
  }

  return withDelay<PlaceOrderResponse>({
    orderId,
    status: 'PLACED',
    totalAmount: Number.parseFloat(total.toFixed(2)),
    estimatedTime,
  });
}

async function mockGetOrdersByTable(tableId: string): Promise<Order[]> {
  const orders = MOCK_ORDERS.filter((o) => o.tableId === tableId);

  if (CONFIG.DEBUG) {
    console.log(`Mock getOrdersByTable - returning ${orders.length} orders for table ${tableId}`);
  }

  return withDelay<Order[]>(orders);
}

async function mockGetOrderById(orderId: string): Promise<Order> {
  const order = MOCK_ORDERS.find((o) => o.id === orderId);

  if (!order) {
    return withDelayError(new Error(`Order ${orderId} not found`), CONFIG.MOCK_API_DELAY);
  }

  if (CONFIG.DEBUG) {
    console.log(`Mock getOrderById - returning order ${orderId}`);
  }

  return withDelay<Order>(order);
}

async function mockGetActiveOrders(): Promise<Order[]> {
  const activeOrders = MOCK_ORDERS.filter((o) => ['PLACED', 'PREPARING', 'READY'].includes(o.status));

  if (CONFIG.DEBUG) {
    console.log(`Mock getActiveOrders - returning ${activeOrders.length} active orders`);
  }

  return withDelay<Order[]>(activeOrders);
}

async function mockUpdateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const order = MOCK_ORDERS.find((o) => o.id === orderId);

  if (!order) {
    return withDelayError(new Error(`Order ${orderId} not found`), CONFIG.MOCK_API_DELAY);
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  if (CONFIG.DEBUG) {
    console.log(`Mock updateOrderStatus - Order ${orderId} status updated to ${status}`);
  }

  return withDelay<Order>(order);
}

type PaymentMethod = 'CARD' | 'CASH' | 'PAYPAL';

async function mockProcessPayment(orderId: string, _amount: number, paymentMethod: PaymentMethod): Promise<Order> {
  const order = MOCK_ORDERS.find((o) => o.id === orderId);

  if (!order) {
    return withDelayError(new Error(`Order ${orderId} not found`), CONFIG.MOCK_API_DELAY);
  }

  order.status = 'PAID';
  order.paymentMethod = paymentMethod;
  order.updatedAt = new Date().toISOString();

  if (CONFIG.DEBUG) {
    console.log(`Mock processPayment - Order ${orderId} payment processed via ${paymentMethod}`);
  }

  return withDelay<Order>(order);
}

// ============================================================================
// REAL API IMPLEMENTATIONS
// ============================================================================

async function realPlaceOrder(_customerId: number, request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to place order: ${response.statusText}`);
  }

  return response.json();
}

async function realGetOrdersByTable(tableId: string): Promise<Order[]> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}/orders/table?tableId=${tableId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Table-Id': tableId,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
}

async function realGetOrderById(orderId: string): Promise<Order> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }

  return response.json();
}

async function realGetActiveOrders(): Promise<Order[]> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}/orders/active`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch active orders: ${response.statusText}`);
  }

  return response.json();
}

async function realUpdateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update order status: ${response.statusText}`);
  }

  return response.json();
}

async function realProcessPayment(orderId: string, amount: number, paymentMethod: 'CARD' | 'CASH' | 'PAYPAL'): Promise<Order> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();

  const response = await fetch(`${CONFIG.API_BASE_URL}/orders/${orderId}/pay`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ amount, paymentMethod }),
  });

  if (!response.ok) {
    throw new Error(`Failed to process payment: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// PUBLIC EXPORTS (Auto-routes to mock or real based on CONFIG)
// ============================================================================

/**
 * Place a new order
 */
export async function placeOrder(customerId: number, request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
  if (CONFIG.USE_MOCK_API) {
    return mockPlaceOrder(customerId, request);
  }
  return realPlaceOrder(customerId, request);
}

/**
 * Get all orders for a specific table
 */
export async function getOrdersByTable(tableId: string): Promise<Order[]> {
  if (CONFIG.USE_MOCK_API) {
    return mockGetOrdersByTable(tableId);
  }
  return realGetOrdersByTable(tableId);
}

/**
 * Get a specific order by ID
 */
export async function getOrderById(orderId: string): Promise<Order> {
  if (CONFIG.USE_MOCK_API) {
    return mockGetOrderById(orderId);
  }
  return realGetOrderById(orderId);
}

/**
 * Get all active orders (Kitchen view)
 * Requires authentication (Kitchen/Admin)
 */
export async function getActiveOrders(): Promise<Order[]> {
  if (CONFIG.USE_MOCK_API) {
    return mockGetActiveOrders();
  }
  return realGetActiveOrders();
}

/**
 * Update order status
 * Requires authentication (Kitchen/Admin)
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  if (CONFIG.USE_MOCK_API) {
    return mockUpdateOrderStatus(orderId, status);
  }
  return realUpdateOrderStatus(orderId, status);
}

/**
 * Process payment for an order
 * Requires authentication (Waiter/Admin)
 */
export async function processPayment(orderId: string, amount: number, paymentMethod: PaymentMethod): Promise<Order> {
  if (CONFIG.USE_MOCK_API) {
    return mockProcessPayment(orderId, amount, paymentMethod);
  }
  return realProcessPayment(orderId, amount, paymentMethod);
}
