import { Order, OrderStatus } from '../types';
import { getMockOrders } from './kitchenService';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface WaiterOrder {
  orderId: string;
  tableId?: number;
  status: OrderStatus;
  customerName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
  }[];
  totalPrice: number;
  orderTime: string;
  timeReady?: string;
}

export interface UpdateStatusRequest {
  status: string;
}

export interface StatusUpdateResponse {
  orderId: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'UP' | 'DOWN';
  timestamp: string;
  version?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Simulates API delay for realistic behavior
 */
const simulateDelay = (min: number = 150, max: number = 400): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Validates JWT token (mock)
 * Checks if user has waiter staff role
 */
const validateWaiterToken = (token?: string): boolean => {
  if (!token) {
    console.warn('[waiterService] No JWT token provided');
    return false;
  }
  
  // Mock: assume token format is "Bearer_ROLE_userId"
  // Accept WAITER or ADMIN roles
  const hasWaiterAccess = token.includes('WAITER') || token.includes('ADMIN');
  if (!hasWaiterAccess) {
    console.warn('[waiterService] User does not have waiter access');
  }
  return hasWaiterAccess;
};

/**
 * Transforms Order to WaiterOrder (simplified view for waiter staff)
 */
const transformToWaiterOrder = (order: Order): WaiterOrder => {
  return {
    orderId: order.id,
    tableId: order.tableNumber,
    status: order.status,
    customerName: order.customerName,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.menuItem.name,
      quantity: item.quantity,
    })),
    totalPrice: order.totalPrice,
    orderTime: order.orderTime,
    timeReady: order.status === OrderStatus.READY ? new Date().toISOString() : undefined,
  };
};

/**
 * Updates order status in mock store
 */
const updateMockOrderStatus = (orderId: string, status: OrderStatus): void => {
  const mockOrders = getMockOrders();
  const order = mockOrders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    if (status === OrderStatus.COMPLETED) {
      order.completedTime = new Date().toISOString();
    }
  }
};

// ============================================
// WAITER API ENDPOINTS
// ============================================

/**
 * GET /api/waiter/received-orders
 * Returns all orders that are ready to be served (status: READY)
 * 
 * @param jwtToken - JWT token for authentication (Waiter or Admin role)
 * @returns Array of ready orders
 */
const getReceivedOrders = async (jwtToken?: string): Promise<WaiterOrder[]> => {
  await simulateDelay();
  
  // Validate token
  if (!validateWaiterToken(jwtToken)) {
    throw new Error('Unauthorized: Waiter staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/waiter/received-orders', {
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to fetch received orders');
  // return response.json();
  
  // Get orders from shared mock store
  const mockOrders = getMockOrders();
  
  // Filter orders that are ready for waiter pickup
  const readyOrders = mockOrders.filter(
    (order) => order.status === OrderStatus.READY
  );
  
  // Transform to waiter order format
  const transformedOrders = readyOrders.map(transformToWaiterOrder);
  
  // Sort by order time (oldest first - FIFO)
  transformedOrders.sort(
    (a, b) => new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
  );
  
  console.log('[waiterService] Retrieved', transformedOrders.length, 'ready orders');
  return transformedOrders;
};

/**
 * PATCH /api/waiter/orders/{id}/status
 * Updates order status (typically to SERVED or COMPLETED)
 * 
 * @param orderId - Order ID
 * @param statusData - New status
 * @param jwtToken - JWT token for authentication
 * @returns Status update confirmation
 */
const updateOrderStatus = async (
  orderId: string,
  statusData: UpdateStatusRequest,
  jwtToken?: string
): Promise<StatusUpdateResponse> => {
  await simulateDelay();
  
  // Validate token
  if (!validateWaiterToken(jwtToken)) {
    throw new Error('Unauthorized: Waiter staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/waiter/orders/${orderId}/status`, {
  //   method: 'PATCH',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(statusData),
  // });
  // if (!response.ok) throw new Error('Failed to update order status');
  // return response.json();
  
  // Validate status
  const validStatuses = Object.values(OrderStatus);
  const newStatus = statusData.status.toUpperCase() as OrderStatus;
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${statusData.status}`);
  }
  
  // Find order
  const mockOrders = getMockOrders();
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  // Update status
  updateMockOrderStatus(orderId, newStatus);
  
  console.log('[waiterService] Order status updated:', orderId, '→', newStatus);
  
  return {
    orderId,
    status: newStatus,
    message: `Order status updated to ${newStatus}`,
    timestamp: new Date().toISOString(),
  };
};

/**
 * GET /api/waiter/health
 * Health check endpoint (No JWT required)
 * 
 * @returns Health status
 */
const getWaiterHealth = async (): Promise<HealthCheckResponse> => {
  await simulateDelay(50, 150);
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/waiter/health');
  // if (!response.ok) throw new Error('Health check failed');
  // return response.json();
  
  // Simulate health check
  const isHealthy = true; // In production, check database connection, etc.
  
  return {
    status: isHealthy ? 'UP' : 'DOWN',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };
};

// ============================================
// ADDITIONAL HELPERS
// ============================================

/**
 * Gets all orders for a specific table (helper for waiter UI)
 */
const getOrdersByTable = async (
  tableNumber: number,
  jwtToken?: string
): Promise<WaiterOrder[]> => {
  await simulateDelay();
  
  // Validate token
  if (!validateWaiterToken(jwtToken)) {
    throw new Error('Unauthorized: Waiter staff access required');
  }
  
  const mockOrders = getMockOrders();
  
  // Filter orders by table number
  const tableOrders = mockOrders.filter(
    (order) => order.tableNumber === tableNumber
  );
  
  // Transform to waiter order format
  const transformedOrders = tableOrders.map(transformToWaiterOrder);
  
  console.log('[waiterService] Retrieved', transformedOrders.length, 'orders for table', tableNumber);
  return transformedOrders;
};

/**
 * Marks an order as served (shortcut method)
 */
const markOrderServed = async (
  orderId: string,
  jwtToken?: string
): Promise<StatusUpdateResponse> => {
  return updateOrderStatus(orderId, { status: 'SERVED' }, jwtToken);
};

/**
 * Marks an order as completed (shortcut method)
 */
const markOrderCompleted = async (
  orderId: string,
  jwtToken?: string
): Promise<StatusUpdateResponse> => {
  return updateOrderStatus(orderId, { status: 'COMPLETED' }, jwtToken);
};

// ============================================
// EXPORTED SERVICE
// ============================================

export const waiterService = {
  // API endpoints
  getReceivedOrders,
  updateOrderStatus,
  getWaiterHealth,
  
  // Helper methods
  getOrdersByTable,
  markOrderServed,
  markOrderCompleted,
};
