/**
 * Role Constants - Centralized role definitions
 */

export const UserRole = {
  CUSTOMER: 1,
  ADMIN: 2,
  KITCHEN: 3,
  WAITER: 4,
} as const;

export const ROLE_NAMES: Record<number, string> = {
  1: 'Customer',
  2: 'Admin',
  3: 'Kitchen Staff',
  4: 'Waiter',
};

export const ROLE_PATHS: Record<number, string> = {
  1: '/customer',
  2: '/admin',
  3: '/kitchen',
  4: '/waiter',
};

/**
 * Get role name by role ID
 */
export const getRoleName = (role?: number): string => {
  if (!role || !(role in ROLE_NAMES)) {
    return 'Unknown';
  }
  return ROLE_NAMES[role];
};

/**
 * Get default path for a role
 */
export const getRolePath = (role?: number): string => {
  if (!role || !(role in ROLE_PATHS)) {
    return '/login';
  }
  return ROLE_PATHS[role];
};

/**
 * Check if user has required role
 */
export const hasRole = (userRole?: number, requiredRoles?: number[]): boolean => {
  if (!userRole || !requiredRoles || requiredRoles.length === 0) {
    return false;
  }
  return requiredRoles.includes(userRole);
};
