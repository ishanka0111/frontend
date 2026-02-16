/**
 * Route Configuration
 * Defines all application routes and their access requirements
 */

export const ROUTES = {
  // Public Routes
  LOGIN: {
    path: '/login',
    name: 'Login',
    public: true,
  },
  REGISTER: {
    path: '/register',
    name: 'Register',
    public: true,
  },

  // Customer Routes
  MENU: {
    path: '/menu',
    name: 'Menu',
    public: false,
    requiredRoles: [1, 2, 3], // All authenticated users
  },
  ORDER: {
    path: '/order',
    name: 'Orders',
    public: false,
    requiredRoles: [1, 2], // Customer, Admin
  },
  PROFILE: {
    path: '/profile',
    name: 'Profile',
    public: false,
    requiredRoles: [1, 2, 3], // All authenticated users
  },

  // Admin Routes
  ADMIN_DASHBOARD: {
    path: '/admin/dashboard',
    name: 'Admin Dashboard',
    public: false,
    requiredRoles: [2], // Admin only
  },
  ADMIN_MENU: {
    path: '/admin/menu',
    name: 'Manage Menu',
    public: false,
    requiredRoles: [2],
  },
  ADMIN_ORDERS: {
    path: '/admin/orders',
    name: 'Manage Orders',
    public: false,
    requiredRoles: [2],
  },
  ADMIN_STAFF: {
    path: '/admin/staff',
    name: 'Manage Staff',
    public: false,
    requiredRoles: [2],
  },

  // Kitchen Routes
  KITCHEN: {
    path: '/kitchen',
    name: 'Kitchen Display',
    public: false,
    requiredRoles: [3], // Kitchen only
  },

  // Error Pages
  UNAUTHORIZED: {
    path: '/unauthorized',
    name: 'Unauthorized',
    public: true,
  },
  NOT_FOUND: {
    path: '/404',
    name: 'Not Found',
    public: true,
  },
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES]['path'];
