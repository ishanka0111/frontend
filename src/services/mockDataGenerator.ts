/**
 * Mock Data Generator
 * Generates realistic dummy data for all API endpoints
 * Themed: Modern, Authentic, Classy Restaurant
 */

import type { UserProfile } from '../types';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
  isActive: boolean;
  allergens?: string[];
  preparationTime?: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: number;
  tableId: string;
  items: {
    menuItemId: number;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID';
  paymentMethod?: 'CARD' | 'CASH' | 'PAYPAL';
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number; // minutes
}

export type CategoryIconKey = 'appetizers' | 'pasta' | 'mains' | 'seafood' | 'desserts' | 'beverages';

export interface Category {
  id: number;
  name: string;
  description: string;
  iconKey: CategoryIconKey;
  displayOrder: number;
}

// ============================================================================
// CATEGORIES
// ============================================================================
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Appetizers',
    description: 'Small plates and starters to begin your meal',
    iconKey: 'appetizers',
    displayOrder: 1,
  },
  {
    id: 2,
    name: 'Pasta & Risotto',
    description: 'Fresh pasta and creamy risotto classics',
    iconKey: 'pasta',
    displayOrder: 2,
  },
  {
    id: 3,
    name: 'Mains',
    description: 'Signature main courses and chef specials',
    iconKey: 'mains',
    displayOrder: 3,
  },
  {
    id: 4,
    name: 'Seafood',
    description: 'Ocean-fresh seafood selections',
    iconKey: 'seafood',
    displayOrder: 4,
  },
  {
    id: 5,
    name: 'Desserts',
    description: 'Sweet finishes and dessert favorites',
    iconKey: 'desserts',
    displayOrder: 5,
  },
  {
    id: 6,
    name: 'Beverages',
    description: 'Wine, cocktails, and non-alcoholic drinks',
    iconKey: 'beverages',
    displayOrder: 6,
  },
];

// ============================================================================
// MENU ITEMS (28 items - Modern, Authentic, Classy)
// ============================================================================
const currentDate = new Date().toISOString();

export const MOCK_MENU_ITEMS: MenuItem[] = [
  // Appetizers (5 items)
  { id: 101, name: 'Burrata & Heirloom Tomato', categoryId: 1, description: 'Fresh burrata, heirloom tomatoes, basil oil, balsamic reduction', price: 18, imageUrl: 'https://images.unsplash.com/photo-1599599810694-2d16b0f5e2cf?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 102, name: 'Beef Carpaccio', categoryId: 1, description: 'Thinly sliced wagyu beef with truffle oil, capers, parmesan', price: 22, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 103, name: 'Crispy Squid', categoryId: 1, description: 'Lightly battered squid, lemon aioli, sea salt', price: 16, imageUrl: 'https://images.unsplash.com/photo-1599599810694-2d16b0f5e2cf?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 104, name: 'Shrimp Saganaki', categoryId: 1, description: 'Pan-seared shrimp with feta cheese, tomato, oregano', price: 19, imageUrl: 'https://images.unsplash.com/photo-1615326539570-6c2a1a16c3b6?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 105, name: 'Foie Gras Terrine', categoryId: 1, description: 'House-made foie gras, brioche, fig compote', price: 28, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },

  // Pasta & Risotto (6 items)
  { id: 201, name: 'Truffle Tagliatelle', categoryId: 2, description: 'Fresh egg pasta, black truffle, parmigiano-reggiano, butter', price: 26, imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 202, name: 'Lobster Ravioli', categoryId: 2, description: 'Handmade ravioli filled with lobster, bisque sauce, chives', price: 28, imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4ee32510d8?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 203, name: 'Cacio e Pepe', categoryId: 2, description: 'Spaghetti, pecorino romano, cracked black pepper, aged cacio', price: 16, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 204, name: 'Wild Mushroom Risotto', categoryId: 2, description: 'Arborio rice, porcini, cremini, shiitake, white wine, truffle butter', price: 24, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 205, name: 'Saffron Risotto', categoryId: 2, description: 'Creamy Italian rice infused with saffron, parmesan, butter', price: 22, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 206, name: 'Bolognese', categoryId: 2, description: 'Fresh pasta, slow-cooked ragù with beef and pork, pecorino', price: 20, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },

  // Main Courses (7 items)
  { id: 301, name: 'Wagyu Ribeye', categoryId: 3, description: '300g A5 Japanese wagyu, herb butter, seasonal vegetables', price: 65, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 302, name: 'Herb-Crusted Lamb', categoryId: 3, description: 'Rack of lamb, Dijon mustard, herbs, mint jus, root vegetables', price: 42, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 303, name: 'Duck Confit', categoryId: 3, description: 'Slow-cooked duck leg, cherry gastrique, wild rice, haricots verts', price: 36, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 304, name: 'Veal Chop', categoryId: 3, description: 'Bone-in veal chop, mushroom ragout, polenta, sage brown butter', price: 44, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 305, name: 'Chicken Piccata', categoryId: 3, description: 'Heritage chicken breast, lemon-caper sauce, al dente pasta', price: 28, imageUrl: 'https://images.unsplash.com/photo-1598566174191-3ae7e6c0e5c1?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 306, name: 'Vegetable Tart', categoryId: 3, description: 'Seasonal vegetables, aged gruyère, herb pesto, side salad', price: 22, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561c1d?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 307, name: 'Prime Burger', categoryId: 3, description: '8oz prime beef, truffle mayo, aged cheddar, brioche bun', price: 24, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },

  // Seafood (5 items)
  { id: 401, name: 'Branzino en Papillote', categoryId: 4, description: 'Whole Mediterranean branzino, white wine, herbs, fennel, olives', price: 48, imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85faf00021b?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 402, name: 'Halibut Meunière', categoryId: 4, description: 'Pan-seared halibut, brown butter, lemon, capers, seasonal greens', price: 44, imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85faf00021b?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 403, name: 'Lobster Tail', categoryId: 4, description: 'Cold water lobster tail, drawn butter, seasonal vegetables', price: 52, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07f46e?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 404, name: 'Scallops Meunière', categoryId: 4, description: 'Diver scallops, brown butter, lemon, haricots verts', price: 46, imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cfd519?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 405, name: 'Cioppino', categoryId: 4, description: 'Tomato-based stew with mussels, clams, shrimp, fish, garlic toast', price: 38, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },

  // Desserts (3 items)
  { id: 501, name: 'Chocolate Soufflé', categoryId: 5, description: 'Dark chocolate soufflé with crème anglaise, raspberry compote', price: 12, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 502, name: 'Tiramisù', categoryId: 5, description: 'House-made tiramisù with mascarpone, espresso, cocoa powder', price: 10, imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a76fb6293?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 503, name: 'Panna Cotta', categoryId: 5, description: 'Silky vanilla panna cotta with seasonal berry coulis', price: 11, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291840?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },

  // Beverages (2 items)
  { id: 601, name: 'Premium Wine Selection', categoryId: 6, description: 'Curated wines by glass - see wine list', price: 14, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
  { id: 602, name: 'Craft Cocktail', categoryId: 6, description: 'Seasonal craft cocktail - ask server for today special', price: 16, imageUrl: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=300&h=300&fit=crop', isActive: true, createdAt: currentDate },
];

// ============================================================================
// USERS (4 test accounts + 15 customer records)
// ============================================================================
export const MOCK_USERS = {
  // Test Accounts
  customer: {
    id: 1001,
    fullName: 'John Diner',
    email: 'customer@test.com',
    role: 1,
    phone: '555-0101',
    createdAt: new Date('2024-01-15').toISOString(),
  } as UserProfile,
  admin: {
    id: 2001,
    fullName: 'Sarah Chef',
    email: 'admin@test.com',
    role: 2,
    phone: '555-0201',
    createdAt: new Date('2024-01-01').toISOString(),
  } as UserProfile,
  kitchen: {
    id: 3001,
    fullName: 'Marco Cucina',
    email: 'kitchen@test.com',
    role: 3,
    phone: '555-0301',
    createdAt: new Date('2024-01-10').toISOString(),
  } as UserProfile,
  waiter: {
    id: 4001,
    fullName: 'Emma Server',
    email: 'waiter@test.com',
    role: 4,
    phone: '555-0401',
    createdAt: new Date('2024-01-12').toISOString(),
  } as UserProfile,

  // Additional Customers (for order history)
  customers: [
    { id: 1002, fullName: 'Alice Johnson', email: 'alice@example.com', role: 1, phone: '555-1001', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1003, fullName: 'Bob Williams', email: 'bob@example.com', role: 1, phone: '555-1002', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1004, fullName: 'Carol Davis', email: 'carol@example.com', role: 1, phone: '555-1003', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1005, fullName: 'David Miller', email: 'david@example.com', role: 1, phone: '555-1004', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1006, fullName: 'Eve Wilson', email: 'eve@example.com', role: 1, phone: '555-1005', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1007, fullName: 'Frank Brown', email: 'frank@example.com', role: 1, phone: '555-1006', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1008, fullName: 'Grace Taylor', email: 'grace@example.com', role: 1, phone: '555-1007', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1009, fullName: 'Henry Anderson', email: 'henry@example.com', role: 1, phone: '555-1008', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1010, fullName: 'Iris Thomas', email: 'iris@example.com', role: 1, phone: '555-1009', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1011, fullName: 'Jack Jackson', email: 'jack@example.com', role: 1, phone: '555-1010', createdAt: new Date().toISOString() } as UserProfile,
    { id: 1012, fullName: 'Karen White', email: 'karen@example.com', role: 1, phone: '555-1011', createdAt: new Date().toISOString() } as UserProfile,
  ] as UserProfile[],
};

// ============================================================================
// SAMPLE ORDERS (20+ orders with various statuses)
// ============================================================================
function generateOrders(): Order[] {
  const orders: Order[] = [];
  const customers = [1001, 1002, 1003, 1004, 1005, 1006];
  const statuses: Order['status'][] = ['PLACED', 'PREPARING', 'READY', 'SERVED', 'PAID'];
  
  const now = new Date();
  
  for (let i = 0; i < 22; i++) {
    const customerId = customers[i % customers.length];
    const status = statuses[i % statuses.length];
    const createdTime = new Date(now.getTime() - (i * 30 * 60 * 1000)); // 30 min apart
    
    // Random items
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const item = MOCK_MENU_ITEMS[Math.floor(Math.random() * MOCK_MENU_ITEMS.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;
      items.push({
        menuItemId: item.id,
        quantity,
        price: item.price,
      });
      total += item.price * quantity;
    }
    
    orders.push({
      id: `ORD-${String(i + 1).padStart(5, '0')}`,
      customerId,
      tableId: String(Math.floor(Math.random() * 15) + 1),
      items,
      totalAmount: Number.parseFloat(total.toFixed(2)),
      status,
      paymentMethod: status === 'PAID' ? 'CARD' : undefined,
      createdAt: createdTime.toISOString(),
      updatedAt: new Date(createdTime.getTime() + (30 * 60 * 1000)).toISOString(),
      estimatedTime: Math.floor(Math.random() * 20) + 15,
    });
  }
  
  return orders;
}

export const MOCK_ORDERS = generateOrders();

// ============================================================================
// STAFF MEMBERS
// ============================================================================
export const MOCK_STAFF = [
  {
    id: 3001,
    name: 'Marco Cucina',
    email: 'kitchen@test.com',
    role: 'KITCHEN',
    status: 'ACTIVE',
  },
  {
    id: 3002,
    name: 'Luigi Rossi',
    email: 'kitchen2@test.com',
    role: 'KITCHEN',
    status: 'ACTIVE',
  },
  {
    id: 4001,
    name: 'Emma Server',
    email: 'waiter@test.com',
    role: 'WAITER',
    status: 'ACTIVE',
  },
  {
    id: 4002,
    name: 'Sebastian Page',
    email: 'waiter2@test.com',
    role: 'WAITER',
    status: 'ACTIVE',
  },
];

// ============================================================================
// INVENTORY
// ============================================================================
export const MOCK_INVENTORY: Record<number, { stock: number; reorderLevel: number }> = MOCK_MENU_ITEMS.reduce(
  (acc, item) => {
    acc[item.id] = {
      stock: Math.floor(Math.random() * 20) + 5,
      reorderLevel: 5,
    };
    return acc;
  },
  {} as Record<number, { stock: number; reorderLevel: number }>,
);

// ============================================================================
// EXPORT FUNCTION
// ============================================================================
export function getMockData() {
  return {
    categories: MOCK_CATEGORIES,
    menuItems: MOCK_MENU_ITEMS,
    users: MOCK_USERS,
    orders: MOCK_ORDERS,
    staff: MOCK_STAFF,
    inventory: MOCK_INVENTORY,
  };
}

// Alias for backward compatibility with categoryName added
export const MOCK_MENU = MOCK_MENU_ITEMS.map(item => ({
  ...item,
  categoryName: MOCK_CATEGORIES.find(cat => cat.id === item.categoryId)?.name || 'Unknown'
}));
