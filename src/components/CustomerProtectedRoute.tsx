/**
 * Customer Protected Route Component
 * Ensures customer is authenticated AND has a table ID before accessing the route
 * Table ID can ONLY be set via QR code scanning (URL parameter)
 * For non-customer roles (admin, kitchen staff), only authentication is checked
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { STORAGE_KEYS, storage } from '../constants/storage';

interface CustomerProtectedRouteProps {
  children: React.ReactNode;
}

const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, tableId } = useAuth();

  // Fallback: Read tableId from localStorage directly (for iPhone Safari timing issues)
  const localStorageTableId = storage.get<string>(STORAGE_KEYS.TABLE_NUMBER);
  const effectiveTableId = tableId || localStorageTableId;

  // Log for debugging tableId issues
  console.log('CustomerProtectedRoute - isAuth:', isAuthenticated, 'contextTableId:', tableId, 'localStorageTableId:', localStorageTableId, 'effectiveTableId:', effectiveTableId, 'user role:', user?.role);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a customer (role === 1) and needs a tableId
  const isCustomer = user?.role === 1;
  
  // If customer doesn't have tableId, redirect to login
  // (They should scan QR code which will bring them back here)
  if (isCustomer && !effectiveTableId) {
    console.log('CustomerProtectedRoute - No tableId found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default CustomerProtectedRoute;
