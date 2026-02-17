import { Order, OrderStatus } from '../types';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface KitchenOrder {
  orderId: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    specialRequests?: string;
  }[];
  tableNumber?: number;
  customerName: string;
  status: OrderStatus;
  orderTime: string;
  priority?: 'low' | 'normal' | 'high';
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
// MOCK DATA PERSISTENCE
// ============================================

// Shared mock orders store (simulates database)
// In production, this would be replaced by actual database queries
let mockOrders: Order[] = [];

/**
 * Initialize mock orders (called from OrderContext or can be populated separately)
 */
export const initializeMockOrders = (orders: Order[]): void => {
  mockOrders = orders;
  console.log('[kitchenService] Initialized with', mockOrders.length, 'orders');
};

/**
 * Get current mock orders (for syncing)
 */
export const getMockOrders = (): Order[] => {
  return mockOrders;
};

/**
 * Update an order in the mock store
 */
export const updateMockOrder = (orderId: string, updates: Partial<Order>): void => {
  const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...updates };
  }
};

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
 * Checks if user has kitchen staff role
 */
const validateKitchenToken = (token?: string): boolean => {
  if (!token) {
    console.warn('[kitchenService] No JWT token provided');
    return false;
  }
  
  // Mock: assume token format is "Bearer_ROLE_userId"
  // Accept KITCHEN or ADMIN roles
  const hasKitchenAccess = token.includes('KITCHEN') || token.includes('ADMIN');
  if (!hasKitchenAccess) {
    console.warn('[kitchenService] User does not have kitchen access');
  }
  return hasKitchenAccess;
};

/**
 * Transforms Order to KitchenOrder (simplified view for kitchen staff)
 */
const transformToKitchenOrder = (order: Order): KitchenOrder => {
  return {
    orderId: order.id,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.menuItem.name,
      quantity: item.quantity,
      specialRequests: item.specialRequests,
    })),
    tableNumber: order.tableNumber,
    customerName: order.customerName,
    status: order.status,
    orderTime: order.orderTime,
    priority: determinePriority(order),
  };
};

/**
 * Determines order priority based on time and table status
 */
const determinePriority = (order: Order): 'low' | 'normal' | 'high' => {
  const orderTime = new Date(order.orderTime).getTime();
  const now = Date.now();
  const minutesWaiting = (now - orderTime) / (1000 * 60);

  // High priority if waiting > 20 minutes
  if (minutesWaiting > 20) return 'high';
  
  // Normal priority if 10-20 minutes
  if (minutesWaiting > 10) return 'normal';
  
  // Low priority if < 10 minutes
  return 'low';
};

// ============================================
// KITCHEN API ENDPOINTS
// ============================================

/**
 * GET /api/kitchen/orders
 * Returns all orders that need kitchen attention (PENDING, CONFIRMED, PREPARING)
 * 
 * @param jwtToken - JWT token for authentication (Kitchen or Admin role)
 * @returns Array of kitchen orders
 */
const getKitchenOrders = async (jwtToken?: string): Promise<KitchenOrder[]> => {
  await simulateDelay();
  
  // Validate token
  if (!validateKitchenToken(jwtToken)) {
    throw new Error('Unauthorized: Kitchen staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/kitchen/orders', {
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to fetch kitchen orders');
  // return response.json();
  
  // Filter orders that kitchen needs to handle
  const kitchenOrders = mockOrders.filter(
    (order) =>
      order.status === OrderStatus.PENDING ||
      order.status === OrderStatus.CONFIRMED ||
      order.status === OrderStatus.PREPARING
  );
  
  // Transform to kitchen order format
  const transformedOrders = kitchenOrders.map(transformToKitchenOrder);
  
  // Sort by priority and time (oldest first)
  transformedOrders.sort((a, b) => {
    const priorityWeight = { high: 3, normal: 2, low: 1 };
    const priorityDiff = priorityWeight[b.priority!] - priorityWeight[a.priority!];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime();
  });
  
  console.log('[kitchenService] Retrieved', transformedOrders.length, 'orders');
  return transformedOrders;
};

/**
 * POST /api/kitchen/orders/{id}/created
 * Marks order as created/confirmed by kitchen staff
 * 
 * @param orderId - Order ID
 * @param jwtToken - JWT token for authentication
 * @returns Status update confirmation
 */
const markOrderCreated = async (
  orderId: string,
  jwtToken?: string
): Promise<StatusUpdateResponse> => {
  await simulateDelay();
  
  // Validate token
  if (!validateKitchenToken(jwtToken)) {
    throw new Error('Unauthorized: Kitchen staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/kitchen/orders/${orderId}/created`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to update order status');
  // return response.json();
  
  // Find and update order
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  // Update status to CONFIRMED
  updateMockOrder(orderId, { status: OrderStatus.CONFIRMED });
  
  console.log('[kitchenService] Order marked as created:', orderId);
  
  return {
    orderId,
    status: OrderStatus.CONFIRMED,
    message: 'Order confirmed and added to kitchen queue',
    timestamp: new Date().toISOString(),
  };
};

/**
 * POST /api/kitchen/orders/{id}/preparing
 * Marks order as being prepared by kitchen staff
 * 
 * @param orderId - Order ID
 * @param jwtToken - JWT token for authentication
 * @returns Status update confirmation
 */
const markOrderPreparing = async (
  orderId: string,
  jwtToken?: string
): Promise<StatusUpdateResponse> => {
  await simulateDelay();
  
  // Validate token
  if (!validateKitchenToken(jwtToken)) {
    throw new Error('Unauthorized: Kitchen staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/kitchen/orders/${orderId}/preparing`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to update order status');
  // return response.json();
  
  // Find and update order
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  // Update status to PREPARING
  updateMockOrder(orderId, { status: OrderStatus.PREPARING });
  
  console.log('[kitchenService] Order marked as preparing:', orderId);
  
  return {
    orderId,
    status: OrderStatus.PREPARING,
    message: 'Order is now being prepared',
    timestamp: new Date().toISOString(),
  };
};

/**
 * POST /api/kitchen/orders/{id}/ready
 * Marks order as ready for pickup by waiter
 * 
 * @param orderId - Order ID
 * @param jwtToken - JWT token for authentication
 * @returns Status update confirmation
 */
const markOrderReady = async (
  orderId: string,
  jwtToken?: string
): Promise<StatusUpdateResponse> => {
  await simulateDelay();
  
  // Validate token
  if (!validateKitchenToken(jwtToken)) {
    throw new Error('Unauthorized: Kitchen staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/kitchen/orders/${orderId}/ready`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to update order status');
  // return response.json();
  
  // Find and update order
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  // Update status to READY
  updateMockOrder(orderId, { status: OrderStatus.READY });
  
  console.log('[kitchenService] Order marked as ready:', orderId);
  
  return {
    orderId,
    status: OrderStatus.READY,
    message: 'Order is ready for pickup',
    timestamp: new Date().toISOString(),
  };
};

/**
 * GET /api/kitchen/health
 * Health check endpoint (No JWT required)
 * 
 * @returns Health status
 */
const getKitchenHealth = async (): Promise<HealthCheckResponse> => {
  await simulateDelay(50, 150);
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/kitchen/health');
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
 * Resets all mock data (for testing)
 */
const resetMockData = (): void => {
  mockOrders = [];
  console.log('[kitchenService] Mock data reset');
};

// ============================================
// EXPORTED SERVICE
// ============================================

export const kitchenService = {
  // API endpoints
  getKitchenOrders,
  markOrderCreated,
  markOrderPreparing,
  markOrderReady,
  getKitchenHealth,
  
  // Data management helpers
  initializeMockOrders,
  getMockOrders,
  resetMockData,
};
