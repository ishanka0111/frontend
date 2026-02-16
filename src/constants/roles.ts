/**
 * Role Constants - Centralized role definitions
 */

export enum UserRole {
  CUSTOMER = 1,
  ADMIN = 2,
  KITCHEN = 3,
  WAITER = 4,
}

export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.KITCHEN]: 'Kitchen Staff',
  [UserRole.WAITER]: 'Waiter',
};

export const ROLE_PATHS: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: '/customer',
  [UserRole.ADMIN]: '/admin',
  [UserRole.KITCHEN]: '/kitchen',
  [UserRole.WAITER]: '/waiter',
};

/**
 * Get role name by role ID
 */
export const getRoleName = (role?: number): string => {
  if (!role || !(role in ROLE_NAMES)) {
    return 'Unknown';
  }
  return ROLE_NAMES[role as UserRole];
};

/**
 * Get default path for a role
 */
export const getRolePath = (role?: number): string => {
  if (!role || !(role in ROLE_PATHS)) {
    return '/login';
  }
  return ROLE_PATHS[role as UserRole];
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
