/**
 * Mock API Service
 * Provides dummy data for testing frontend without backend
 */

import { setAccessToken, setRefreshToken } from '../utils/jwt';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
} from '../types';

// Internal type for mock users with password
type MockUser = UserProfile & { password: string };

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users database
const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    email: 'customer@test.com',
    password: 'password123',
    fullName: 'Test Customer',
    phone: '+94771234567',
    role: 1,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 2,
    email: 'admin@test.com',
    password: 'admin123',
    fullName: 'Admin User',
    phone: '+94779876543',
    role: 2,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 3,
    email: 'kitchen@test.com',
    password: 'kitchen123',
    fullName: 'Kitchen Staff',
    phone: '+94771111111',
    role: 3,
    createdAt: '2024-01-12T08:00:00Z',
  },
];

// Store for newly registered users
const registeredUsers: MockUser[] = [...MOCK_USERS];
let currentUserId = 4;

// Mock current user (set by login)
let currentUser: UserProfile | null = null;

/**
 * Mock Login
 */
export async function mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
  await delay(800); // Simulate network delay

  const user = registeredUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Set current user
  currentUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };

  // Generate mock tokens
  const mockAccessToken = `mock_access_token_${user.id}_${Date.now()}`;
  const mockRefreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;

  // Store tokens
  setAccessToken(mockAccessToken);
  setRefreshToken(mockRefreshToken);

  return {
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    tokenType: 'Bearer',
  };
}

/**
 * Mock Register
 */
export async function mockRegister(data: RegisterRequest): Promise<RegisterResponse> {
  await delay(800);

  // Check if email already exists
  if (registeredUsers.some((u) => u.email === data.email)) {
    throw new Error('Email already registered');
  }

  // Create new user
  const newUser = {
    id: currentUserId++,
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    phone: data.phone,
    role: data.role,
    createdAt: new Date().toISOString(),
  };

  registeredUsers.push(newUser);

  return {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
    phone: newUser.phone,
    createdAt: newUser.createdAt,
  };
}

/**
 * Mock Get Profile
 */
export async function mockGetProfile(): Promise<UserProfile> {
  await delay(300);

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  return currentUser;
}

/**
 * Mock Update Profile
 */
export async function mockUpdateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  await delay(500);

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Update current user
  currentUser = {
    ...currentUser,
    ...data,
    id: currentUser.id, // Don't allow changing ID
    email: currentUser.email, // Don't allow changing email
    role: currentUser.role, // Don't allow changing role
  };

  return currentUser;
}

/**
 * Mock Logout
 */
export async function mockLogout(): Promise<void> {
  await delay(200);
  currentUser = null;
}
