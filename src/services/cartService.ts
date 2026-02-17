import { Order, OrderStatus } from '../types';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface CartItemRequest {
  menuItemId: string;
  itemName: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartItemResponse {
  id: string;
  menuItemId: string;
  itemName: string;
  price: number;
  quantity: number;
  note?: string;
  subtotal: number;
}

export interface CartOpenResponse {
  cartId: string;
  status: string;
  message: string;
}

export interface CheckoutResponse {
  orderId: string;
  status: string;
  totalAmount: number;
}

// ============================================
// MOCK DATA PERSISTENCE
// ============================================

// In-memory storage for cart items (simulates server-side cart)
let mockCartItems: Map<string, CartItemResponse> = new Map();
let mockOrders: Map<string, Order> = new Map();
let nextCartItemId = 1;
let nextOrderId = 1;

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
 * In production, this will validate the actual JWT
 */
const validateToken = (token?: string): boolean => {
  if (!token) {
    console.warn('[cartService] No JWT token provided');
    return false;
  }
  
  // Mock: assume token format is "Bearer_ROLE_userId"
  // Accept any authenticated user (customer, admin, waiter, kitchen)
  const isValid = token.startsWith('Bearer_');
  if (!isValid) {
    console.warn('[cartService] Invalid JWT token format');
  }
  return isValid;
};

/**
 * Extracts user ID from JWT token (mock)
 */
const getUserIdFromToken = (token: string): string => {
  // Mock: token format is "Bearer_ROLE_userId"
  const parts = token.split('_');
  return parts[2] || 'unknown';
};

// ============================================
// CART API ENDPOINTS (All JWT Required)
// ============================================

/**
 * POST /api/cart/open
 * Opens a new shopping cart session
 * 
 * @param jwtToken - JWT token for authentication
 * @returns Cart ID and confirmation
 */
const openCart = async (jwtToken?: string): Promise<CartOpenResponse> => {
  await simulateDelay();
  
  // Validate token
  if (!validateToken(jwtToken)) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/cart/open', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to open cart');
  // return response.json();
  
  // Create new cart session
  const cartId = `cart-${Date.now()}`;
  
  console.log('[cartService] Cart opened:', cartId);
  
  return {
    cartId,
    status: 'OPEN',
    message: 'Cart session created successfully',
  };
};

/**
 * POST /api/cart/items
 * Adds an item to the cart
 * 
 * @param itemData - Cart item details
 * @param jwtToken - JWT token for authentication
 * @returns Updated cart item
 */
const addCartItem = async (
  itemData: CartItemRequest,
  jwtToken?: string
): Promise<CartItemResponse> => {
  await simulateDelay();
  
  // Validate token
  if (!validateToken(jwtToken)) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/cart/items', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(itemData),
  // });
  // if (!response.ok) throw new Error('Failed to add item to cart');
  // return response.json();
  
  // Validate required fields
  if (!itemData.menuItemId || !itemData.itemName || itemData.quantity <= 0) {
    throw new Error('Invalid cart item data');
  }
  
  // Check if item already exists in cart
  const existingItem = Array.from(mockCartItems.values()).find(
    (item) => item.menuItemId === itemData.menuItemId && item.note === itemData.note
  );
  
  if (existingItem) {
    // Update quantity of existing item
    existingItem.quantity += itemData.quantity;
    existingItem.subtotal = existingItem.price * existingItem.quantity;
    mockCartItems.set(existingItem.id, existingItem);
    
    console.log('[cartService] Updated existing cart item:', existingItem.id);
    return existingItem;
  } else {
    // Create new cart item
    const newItem: CartItemResponse = {
      id: `cart-item-${nextCartItemId++}`,
      menuItemId: itemData.menuItemId,
      itemName: itemData.itemName,
      price: itemData.price,
      quantity: itemData.quantity,
      note: itemData.note,
      subtotal: itemData.price * itemData.quantity,
    };
    
    mockCartItems.set(newItem.id, newItem);
    
    console.log('[cartService] Added new cart item:', newItem.id);
    return newItem;
  }
};

/**
 * PUT /api/cart/items/{itemId}
 * Updates the quantity of a cart item
 * 
 * @param itemId - Cart item ID
 * @param updateData - Updated quantity
 * @param jwtToken - JWT token for authentication
 * @returns Updated cart item
 */
const updateCartItem = async (
  itemId: string,
  updateData: UpdateCartItemRequest,
  jwtToken?: string
): Promise<CartItemResponse> => {
  await simulateDelay();
  
  // Validate token
  if (!validateToken(jwtToken)) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/cart/items/${itemId}`, {
  //   method: 'PUT',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(updateData),
  // });
  // if (!response.ok) throw new Error('Failed to update cart item');
  // return response.json();
  
  // Find cart item
  const cartItem = mockCartItems.get(itemId);
  if (!cartItem) {
    throw new Error(`Cart item not found: ${itemId}`);
  }
  
  // Validate quantity
  if (updateData.quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }
  
  // If quantity is 0, remove the item
  if (updateData.quantity === 0) {
    mockCartItems.delete(itemId);
    console.log('[cartService] Removed cart item (quantity 0):', itemId);
    return { ...cartItem, quantity: 0, subtotal: 0 };
  }
  
  // Update quantity and subtotal
  cartItem.quantity = updateData.quantity;
  cartItem.subtotal = cartItem.price * cartItem.quantity;
  mockCartItems.set(itemId, cartItem);
  
  console.log('[cartService] Updated cart item quantity:', itemId);
  return cartItem;
};

/**
 * POST /api/cart/checkout
 * Checks out the current cart and creates an order
 * 
 * @param jwtToken - JWT token for authentication
 * @returns Order ID, status, and total amount
 */
const checkout = async (jwtToken?: string): Promise<CheckoutResponse> => {
  await simulateDelay(300, 600);
  
  // Validate token
  if (!validateToken(jwtToken)) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch('/api/cart/checkout', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to checkout');
  // return response.json();
  
  // Validate cart has items
  if (mockCartItems.size === 0) {
    throw new Error('Cannot checkout: Cart is empty');
  }
  
  // Calculate total
  const totalAmount = Array.from(mockCartItems.values()).reduce(
    (sum, item) => sum + item.subtotal,
    0
  );
  
  // Create order ID
  const orderId = `ORD-${String(nextOrderId++).padStart(6, '0')}`;
  
  // Get user ID from token
  const userId = getUserIdFromToken(jwtToken!);
  
  // Create order object
  const order: Order = {
    id: orderId,
    customerId: userId,
    customerName: 'Customer', // In production, fetch from user profile
    items: Array.from(mockCartItems.values()).map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      menuItem: {
        id: item.menuItemId,
        name: item.itemName,
        price: item.price,
      } as any, // Mock minimal menu item
      quantity: item.quantity,
      specialRequests: item.note,
      price: item.price,
    })),
    status: OrderStatus.PENDING,
    totalPrice: totalAmount,
    orderTime: new Date().toISOString(),
    isPaid: false,
  };
  
  // Store order
  mockOrders.set(orderId, order);
  
  // Clear cart after checkout
  mockCartItems.clear();
  
  console.log('[cartService] Checkout completed:', orderId, 'Total:', totalAmount);
  
  return {
    orderId,
    status: 'CREATED',
    totalAmount,
  };
};

/**
 * GET /api/cart/order/{orderId}
 * Retrieves full order details
 * 
 * @param orderId - Order ID
 * @param jwtToken - JWT token for authentication
 * @returns Full order details
 */
const getOrder = async (orderId: string, jwtToken?: string): Promise<Order> => {
  await simulateDelay();
  
  // Validate token
  if (!validateToken(jwtToken)) {
    throw new Error('Unauthorized: Authentication required');
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`/api/cart/order/${orderId}`, {
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  // });
  // if (!response.ok) throw new Error('Failed to fetch order');
  // return response.json();
  
  // Find order
  const order = mockOrders.get(orderId);
  if (!order) {
    throw new Error(`Order not found: ${orderId}`);
  }
  
  console.log('[cartService] Retrieved order:', orderId);
  return order;
};

// ============================================
// ADDITIONAL HELPERS
// ============================================

/**
 * Gets all current cart items (for local state sync)
 */
const getCurrentCartItems = (): CartItemResponse[] => {
  return Array.from(mockCartItems.values());
};

/**
 * Clears the current cart (for local testing)
 */
const clearCart = (): void => {
  mockCartItems.clear();
  console.log('[cartService] Cart cleared');
};

/**
 * Resets all mock data (for testing)
 */
const resetMockData = (): void => {
  mockCartItems.clear();
  mockOrders.clear();
  nextCartItemId = 1;
  nextOrderId = 1;
  console.log('[cartService] Mock data reset to initial state');
};

// ============================================
// EXPORTED SERVICE
// ============================================

export const cartService = {
  // API endpoints (JWT required)
  openCart,
  addCartItem,
  updateCartItem,
  checkout,
  getOrder,
  
  // Local helpers
  getCurrentCartItems,
  clearCart,
  resetMockData,
};
