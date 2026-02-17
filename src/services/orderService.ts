import { Order, OrderItem, OrderStatus } from '../types';
import { getMockOrders, updateMockOrder } from './kitchenService';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface CreateOrderRequest {
  items: {
    itemId: string;
    quantity: number;
    unitPrice: number;
    specialRequests?: string;
  }[];
  tableNumber?: number;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface UserOrderSummary {
  id: string;
  total: number;
  date: string;
  status: OrderStatus;
  itemCount: number;
}

export interface TableOrdersResponse {
  tableNumber: number;
  orders: Order[];
  totalOrders: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Simulates API delay for realistic behavior
 */
const simulateDelay = (min: number = 150, max: number = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Validates JWT token (mock)
 * Returns role from token
 */
const extractRoleFromToken = (token?: string): string | null => {
  if (!token) {
    return null;
  }
  
  // Mock: assume token format is "Bearer_ROLE_userId"
  const parts = token.split('_');
  return parts.length >= 2 ? parts[1] : null;
};

/**
 * Checks if user has permission for the operation
 */
const hasPermission = (token: string | undefined, allowedRoles: string[]): boolean => {
  const role = extractRoleFromToken(token);
  if (!role) {
    console.warn('[orderService] No valid role found in token');
    return false;
  }
  
  // ADMIN always has access
  if (role === 'ADMIN') {
    return true;
  }
  
  return allowedRoles.includes(role);
};

/**
 * Generates a new order ID
 */
let orderCounter = 1000;
const generateOrderId = (): string => {
  orderCounter++;
  return `ORD-${String(orderCounter).padStart(6, '0')}`;
};

/**
 * Transforms Order to UserOrderSummary (for customer order history)
 */
const transformToUserOrderSummary = (order: Order): UserOrderSummary => {
  return {
    id: order.id,
    total: order.totalPrice,
    date: order.orderTime,
    status: order.status,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

// ============================================
// ORDER API ENDPOINTS
// ============================================

/**
 * POST /api/orders
 * Creates a new order
 * 
 * Access: CUSTOMER (own orders), WAITER (for table orders), ADMIN (any)
 * 
 * @param orderData - Order creation data
 * @param jwtToken - JWT token for authentication
 * @param customerId - Customer ID (optional, extracted from token if not provided)
 * @returns Created order
 */
export const createOrder = async (
  orderData: CreateOrderRequest,
  jwtToken?: string,
  customerId?: string
): Promise<Order> => {
  await simulateDelay();
  
  // Validate token
  if (!jwtToken) {
    throw new Error('Unauthorized: JWT token required');
  }
  
  const role = extractRoleFromToken(jwtToken);
  if (!role || !['CUSTOMER', 'WAITER', 'ADMIN'].includes(role)) {
    throw new Error('Unauthorized: Invalid role for order creation');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(orderData),
  // });
  // if (!response.ok) throw new Error('Failed to create order');
  // return response.json();
  
  // Extract customer ID from token if not provided
  const extractedCustomerId = customerId || jwtToken.split('_')[2] || 'unknown';
  
  // Mock order creation
  const mockOrders = getMockOrders();
  
  // Calculate total price
  const totalPrice = orderData.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  
  // Create order items (simplified - in production, fetch menu item details)
  const orderItems: OrderItem[] = orderData.items.map((item, index) => ({
    id: `item-${Date.now()}-${index}`,
    menuItemId: item.itemId,
    menuItem: {
      id: item.itemId,
      name: `Menu Item ${item.itemId}`, // In production, fetch from menu service
      description: '',
      price: item.unitPrice,
      category: 'Main Course',
      image: '',
      preparationTime: 15,
      available: true,
    },
    quantity: item.quantity,
    specialRequests: item.specialRequests,
    price: item.unitPrice * item.quantity,
  }));
  
  // Create new order
  const newOrder: Order = {
    id: generateOrderId(),
    customerId: extractedCustomerId,
    customerName: `Customer ${extractedCustomerId}`, // In production, fetch from user service
    items: orderItems,
    status: OrderStatus.PENDING,
    totalPrice,
    tableNumber: orderData.tableNumber,
    orderTime: new Date().toISOString(),
    estimatedTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes estimate
    notes: orderData.notes,
    isPaid: false,
  };
  
  // Add to mock store
  mockOrders.push(newOrder);
  
  console.log('[orderService] Order created:', newOrder.id, 'by role:', role);
  return newOrder;
};

/**
 * PATCH /api/orders/{id}/status
 * Updates order status
 * 
 * Access: KITCHEN (to CONFIRMED/PREPARING/READY), WAITER (to SERVED/COMPLETED), ADMIN (any)
 * 
 * @param orderId - Order ID
 * @param statusData - New status
 * @param jwtToken - JWT token for authentication (staff only)
 * @returns Updated order
 */
export const updateOrderStatus = async (
  orderId: string,
  statusData: UpdateOrderStatusRequest,
  jwtToken?: string
): Promise<Order> => {
  await simulateDelay();
  
  // Validate token (staff only)
  if (!jwtToken) {
    throw new Error('Unauthorized: JWT token required');
  }
  
  const role = extractRoleFromToken(jwtToken);
  if (!role || !['KITCHEN', 'WAITER', 'ADMIN'].includes(role)) {
    throw new Error('Unauthorized: Staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/orders/${orderId}/status`, {
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
  
  // Role-based status validation
  if (role === 'KITCHEN') {
    const allowedStatuses = [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error(`Kitchen staff can only set status to: ${allowedStatuses.join(', ')}`);
    }
  } else if (role === 'WAITER') {
    const allowedStatuses = [OrderStatus.SERVED, OrderStatus.COMPLETED, OrderStatus.CANCELLED];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error(`Waiter staff can only set status to: ${allowedStatuses.join(', ')}`);
    }
  }
  
  // Find and update order
  const mockOrders = getMockOrders();
  const order = mockOrders.find((o) => o.id === orderId);
  
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  // Update order
  order.status = newStatus;
  if (newStatus === OrderStatus.COMPLETED) {
    order.completedTime = new Date().toISOString();
  }
  
  updateMockOrder(orderId, { status: newStatus });
  
  console.log('[orderService] Order status updated:', orderId, '→', newStatus, 'by', role);
  return order;
};

/**
 * GET /api/orders/active
 * Returns all active orders (not completed or cancelled)
 * 
 * Access: Public (no JWT required)
 * 
 * @returns Array of active orders
 */
export const getActiveOrders = async (): Promise<Order[]> => {
  await simulateDelay(100, 300);
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/orders/active');
  // if (!response.ok) throw new Error('Failed to fetch active orders');
  // return response.json();
  
  const mockOrders = getMockOrders();
  
  // Filter active orders (not completed or cancelled)
  const activeOrders = mockOrders.filter(
    (order) =>
      order.status !== OrderStatus.COMPLETED &&
      order.status !== OrderStatus.CANCELLED
  );
  
  // Sort by order time (oldest first)
  activeOrders.sort(
    (a, b) => new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
  );
  
  console.log('[orderService] Retrieved', activeOrders.length, 'active orders');
  return activeOrders;
};

/**
 * GET /api/orders/user
 * Returns all orders for the authenticated user (order history)
 * 
 * Access: CUSTOMER (own orders only), ADMIN (any user)
 * 
 * @param jwtToken - JWT token for authentication
 * @param userId - User ID (optional for admin, required for customer)
 * @returns Array of user's order summaries
 */
export const getUserOrders = async (
  jwtToken?: string,
  userId?: string
): Promise<UserOrderSummary[]> => {
  await simulateDelay();
  
  // Validate token
  if (!jwtToken) {
    throw new Error('Unauthorized: JWT token required');
  }
  
  const role = extractRoleFromToken(jwtToken);
  if (!role) {
    throw new Error('Unauthorized: Invalid token');
  }
  
  // Extract user ID from token if not provided
  let targetUserId = userId;
  if (!targetUserId) {
    targetUserId = jwtToken.split('_')[2] || 'unknown';
  }
  
  // Customer can only view their own orders
  if (role === 'CUSTOMER') {
    const tokenUserId = jwtToken.split('_')[2];
    if (targetUserId !== tokenUserId) {
      throw new Error('Unauthorized: Cannot view other users\' orders');
    }
  }
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/orders/user', {
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to fetch user orders');
  // return response.json();
  
  const mockOrders = getMockOrders();
  
  // Filter orders by user ID
  const userOrders = mockOrders.filter(
    (order) => order.customerId === targetUserId
  );
  
  // Transform to summary format
  const orderSummaries = userOrders.map(transformToUserOrderSummary);
  
  // Sort by date (newest first)
  orderSummaries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  console.log('[orderService] Retrieved', orderSummaries.length, 'orders for user:', targetUserId);
  return orderSummaries;
};

/**
 * GET /api/orders/table
 * Returns all orders for a specific table
 * 
 * Access: WAITER, KITCHEN, ADMIN
 * 
 * @param tableNumber - Table number
 * @param jwtToken - JWT token for authentication
 * @returns Orders for the table
 */
export const getTableOrders = async (
  tableNumber: number,
  jwtToken?: string
): Promise<TableOrdersResponse> => {
  await simulateDelay();
  
  // Validate token (staff only)
  if (!jwtToken) {
    throw new Error('Unauthorized: JWT token required');
  }
  
  if (!hasPermission(jwtToken, ['WAITER', 'KITCHEN'])) {
    throw new Error('Unauthorized: Staff access required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/orders/table?tableNumber=${tableNumber}`, {
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to fetch table orders');
  // return response.json();
  
  const mockOrders = getMockOrders();
  
  // Filter orders by table number
  const tableOrders = mockOrders.filter(
    (order) => order.tableNumber === tableNumber
  );
  
  // Sort by order time (newest first)
  tableOrders.sort(
    (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime()
  );
  
  console.log('[orderService] Retrieved', tableOrders.length, 'orders for table:', tableNumber);
  
  return {
    tableNumber,
    orders: tableOrders,
    totalOrders: tableOrders.length,
  };
};

// ============================================
// ADDITIONAL HELPER METHODS
// ============================================

/**
 * Gets a single order by ID
 */
export const getOrderById = async (
  orderId: string,
  jwtToken?: string
): Promise<Order> => {
  await simulateDelay(100, 200);
  
  const mockOrders = getMockOrders();
  const order = mockOrders.find((o) => o.id === orderId);
  
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  // If JWT provided, validate access
  if (jwtToken) {
    const role = extractRoleFromToken(jwtToken);
    if (role === 'CUSTOMER') {
      const tokenUserId = jwtToken.split('_')[2];
      if (order.customerId !== tokenUserId) {
        throw new Error('Unauthorized: Cannot view other users\' orders');
      }
    }
  }
  
  return order;
};

/**
 * Cancels an order
 */
export const cancelOrder = async (
  orderId: string,
  jwtToken?: string
): Promise<Order> => {
  return updateOrderStatus(orderId, { status: 'CANCELLED' }, jwtToken);
};

/**
 * Gets all orders (admin only)
 */
export const getAllOrders = async (jwtToken?: string): Promise<Order[]> => {
  await simulateDelay();
  
  // Validate token (admin only)
  if (!jwtToken) {
    throw new Error('Unauthorized: JWT token required');
  }
  
  if (!hasPermission(jwtToken, [])) {
    // Empty array means only ADMIN can access
    throw new Error('Unauthorized: Admin access required');
  }
  
  const mockOrders = getMockOrders();
  console.log('[orderService] Admin retrieved all', mockOrders.length, 'orders');
  return mockOrders;
};

// ============================================
// EXPORTED SERVICE
// ============================================

export const orderService = {
  // Main API endpoints
  createOrder,
  updateOrderStatus,
  getActiveOrders,
  getUserOrders,
  getTableOrders,
  
  // Helper methods
  getOrderById,
  cancelOrder,
  getAllOrders,
};
