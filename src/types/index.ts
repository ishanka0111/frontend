/**
 * Type Definitions for the Restaurant Management System
 */

// User & Authentication Types
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: number; // 1 = Customer, 2 = Admin, 3 = Kitchen
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: number;
}

export interface RegisterResponse {
  id: number;
  email: string;
  fullName: string;
  role: number;
  phone: string;
  createdAt: string;
}

// Menu Types
export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  dietaryTags?: string[];
  allergens?: string[];
  preparationTime?: number;
  createdAt: string;
}

// Cart Types
export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

// Order Types
export interface Order {
  id: number;
  userId: number;
  tableId?: number;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatusType;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface PlaceOrderRequest {
  tableId?: number;
  items: {
    menuItemId: number;
    quantity: number;
    notes?: string;
  }[];
  specialRequests?: string;
}

export interface PlaceOrderResponse {
  orderId: number;
  status: string;
  totalPrice: number;
  estimatedTime?: number;
}

export const OrderStatus = {
  PENDING: 'PENDING',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

// Roles
export const UserRole = {
  CUSTOMER: 1,
  ADMIN: 2,
  KITCHEN: 3,
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];
