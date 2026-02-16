import { useAuth } from './useAuth';

export interface RoleInfo {
  isCustomer: boolean;
  isAdmin: boolean;
  isKitchen: boolean;
  isWaiter: boolean;
  role: number | undefined;
  roleName: string;
}

export function useRole(): RoleInfo {
  const { user } = useAuth();
  
  const role = user?.role;
  
  return {
    isCustomer: role === 1,
    isAdmin: role === 2,
    isKitchen: role === 3,
    isWaiter: role === 4,
    role,
    roleName: role === 1 ? 'Customer' : role === 2 ? 'Admin' : role === 3 ? 'Kitchen' : role === 4 ? 'Waiter' : 'Guest',
  };
}
