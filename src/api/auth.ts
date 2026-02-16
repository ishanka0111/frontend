/**
 * Authentication API Functions
 * Supports both mock and real backend
 */

import { CONFIG } from '../utils/config';
import { withDelay, withDelayError } from '../services/mockApiDelayer';
import { MOCK_USERS } from '../services/mockDataGenerator';
import { setAccessToken, setRefreshToken, clearTokens } from '../utils/jwt';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserProfile } from '../types';

// ============================================================================
// MOCK IMPLEMENTATIONS
// ============================================================================

async function mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
  // Find user by email
  const testAccounts = [MOCK_USERS.customer, MOCK_USERS.admin, MOCK_USERS.kitchen, MOCK_USERS.waiter];
  const user = testAccounts.find((u) => u.email === credentials.email);

  if (!user || credentials.password !== 'password123') {
    return withDelayError(new Error('Invalid email or password'), CONFIG.MOCK_API_DELAY);
  }

  // Generate mock JWT tokens
  const mockAccessToken = `mock-access-${user.id}-${Date.now()}`;
  const mockRefreshToken = `mock-refresh-${user.id}-${Date.now()}`;

  setAccessToken(mockAccessToken);
  setRefreshToken(mockRefreshToken);

  if (CONFIG.DEBUG) {
    console.log(`✅ Mock login successful for ${credentials.email}`);
  }

  return withDelay<LoginResponse>({
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    tokenType: 'Bearer',
  });
}

async function mockRegister(data: RegisterRequest): Promise<RegisterResponse> {
  // Check if email already exists
  const allUsers = [MOCK_USERS.customer, MOCK_USERS.admin, ...MOCK_USERS.customers];
  if (allUsers.some((u) => u.email === data.email)) {
    return withDelayError(new Error('Email already registered'), CONFIG.MOCK_API_DELAY);
  }

  // Create new customer user
  const newUser: UserProfile = {
    id: Math.floor(Math.random() * 10000) + 1000,
    fullName: data.fullName,
    email: data.email,
    role: 1, // CUSTOMER role
    phone: data.phone,
    createdAt: new Date().toISOString(),
  };

  // Generate tokens
  const mockAccessToken = `mock-access-${newUser.id}-${Date.now()}`;
  const mockRefreshToken = `mock-refresh-${newUser.id}-${Date.now()}`;

  setAccessToken(mockAccessToken);
  setRefreshToken(mockRefreshToken);

  if (CONFIG.DEBUG) {
    console.log(`✅ Mock registration successful for ${data.email}`);
  }

  return withDelay<RegisterResponse>({
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
    phone: newUser.phone,
    createdAt: newUser.createdAt,
  });
}

async function mockGetProfile(token: string): Promise<UserProfile> {
  // Extract user ID from token (mock token format: "mock-access-{id}-{timestamp}")
  const parts = token.split('-');
  const userId = Number.parseInt(parts[2], 10);

  // Find user
  const allUsers = [MOCK_USERS.customer, MOCK_USERS.admin, MOCK_USERS.kitchen, MOCK_USERS.waiter, ...MOCK_USERS.customers];
  const user = allUsers.find((u) => u.id === userId);

  if (!user) {
    return withDelayError(new Error('User not found'), CONFIG.MOCK_API_DELAY);
  }

  if (CONFIG.DEBUG) {
    console.log(`✅ Mock getProfile successful for user ${userId}`);
  }

  return withDelay<UserProfile>(user);
}

async function mockUpdateProfile(token: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const profile = await mockGetProfile(token);
  const updated = { ...profile, ...updates };

  if (CONFIG.DEBUG) {
    console.log(`✅ Mock updateProfile successful for user ${profile.id}`);
  }

  return withDelay<UserProfile>(updated);
}

// ============================================================================
// REAL API IMPLEMENTATIONS
// ============================================================================

async function realLogin(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data: LoginResponse = await response.json();

  // Store tokens
  if (data.accessToken) setAccessToken(data.accessToken);
  if (data.refreshToken) setRefreshToken(data.refreshToken);

  return data;
}

async function realRegister(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  const responseData: RegisterResponse = await response.json();

  // Note: Tokens are not returned from registration endpoint
  // User must login after registration to get access tokens

  return responseData;
}

async function realGetProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get profile: ${response.statusText}`);
  }

  return response.json();
}

async function realUpdateProfile(token: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// PUBLIC EXPORTS (Auto-routes to mock or real based on CONFIG)
// ============================================================================

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  if (CONFIG.USE_MOCK_API) {
    return mockLogin(credentials);
  }
  return realLogin(credentials);
}


/**
 * Register a new customer account
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  if (CONFIG.USE_MOCK_API) {
    return mockRegister(data);
  }
  return realRegister(data);
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<UserProfile> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No access token found');
  }

  if (CONFIG.USE_MOCK_API) {
    return mockGetProfile(token);
  }
  return realGetProfile(token);
}

/**
 * Update current user profile
 */
export async function updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  const { getAccessToken } = await import('../utils/jwt');
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No access token found');
  }

  if (CONFIG.USE_MOCK_API) {
    return mockUpdateProfile(token, updates);
  }
  return realUpdateProfile(token, updates);
}

/**
 * Logout - clear tokens
 */
export async function logout(): Promise<void> {
  clearTokens();
  
  if (!CONFIG.USE_MOCK_API) {
    try {
      const { getAccessToken } = await import('../utils/jwt');
      const token = getAccessToken();
      
      if (token) {
        await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
