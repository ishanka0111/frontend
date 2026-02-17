import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  updateProfile: (name: string, phone: string, address: string) => Promise<void>;
  addStaff: (name: string, email: string, password: string, role: UserRole, phone: string) => Promise<void>;
  getJwtToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: 'cust1',
    name: 'John Customer',
    email: 'customer@restaurant.com',
    password: 'password123',
    role: UserRole.CUSTOMER,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@restaurant.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'kitchen1',
    name: 'Chef John',
    email: 'kitchen@restaurant.com',
    password: 'kitchen123',
    role: UserRole.KITCHEN,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'waiter1',
    name: 'Waiter Mike',
    email: 'waiter@restaurant.com',
    password: 'waiter123',
    role: UserRole.WAITER,
    createdAt: new Date().toISOString(),
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

    if (user) {
      const token = `token_${user.id}_${Date.now()}`;
      setAuthState({
        user: { ...user, password: undefined },
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: 'Invalid email or password',
      }));
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
      };

      MOCK_USERS.push(newUser);

      const token = `token_${newUser.id}_${Date.now()}`;
      setAuthState({
        user: { ...newUser, password: undefined },
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    },
    []
  );

  const updateProfile = useCallback(
    async (name: string, phone: string, address: string) => {
      if (!authState.user) return;

      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update mock users database
      const userIndex = MOCK_USERS.findIndex((u) => u.id === authState.user?.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = {
          ...MOCK_USERS[userIndex],
          name,
          phone,
          address,
        };
      }

      // Update auth state
      const updatedUser = { ...authState.user, name, phone, address };
      setAuthState({
        ...authState,
        user: { ...updatedUser, password: undefined },
        loading: false,
      });

      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    },
    [authState]
  );

  const addStaff = useCallback(
    async (name: string, email: string, password: string, role: UserRole, phone: string) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if email already exists
      const existingUser = MOCK_USERS.find((u) => u.email === email);
      if (existingUser) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: 'Email already exists',
        }));
        throw new Error('Email already exists');
      }

      // Create new staff member
      const newStaff: User = {
        id: `staff_${Date.now()}`,
        name,
        email,
        password,
        role,
        phone,
        createdAt: new Date().toISOString(),
      };

      // Add to mock database
      MOCK_USERS.push(newStaff);

      setAuthState((prev) => ({ ...prev, loading: false }));

      // Persist to localStorage
      localStorage.setItem('mock_users', JSON.stringify(MOCK_USERS));
    },
    []
  );

  const getJwtToken = useCallback((): string | null => {
    // Return mock JWT token that includes role information
    // Format: Bearer_ROLE_userId
    if (!authState.user || !authState.token) {
      return null;
    }
    
    const roleString = Object.keys(UserRole).find(
      key => UserRole[key as keyof typeof UserRole] === authState.user?.role
    );
    
    return `Bearer_${roleString}_${authState.user.id}`;
  }, [authState.user, authState.token]);

  const value = useMemo(
    () => ({ ...authState, login, logout, register, updateProfile, addStaff, getJwtToken }),
    [authState, login, logout, register, updateProfile, addStaff, getJwtToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
