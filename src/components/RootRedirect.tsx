/**
 * Root Redirect Component
 * Handles QR code scans - redirects based on authentication status
 * If user scans QR (e.g., http://172.20.10.3:5173/?tableId=5):
 * - Authenticated → Redirect to /menu
 * - Not authenticated → Redirect to /login
 */

import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

const getRoleBasedPath = (role: number | undefined): string => {
  switch (role) {
    case 1: return '/menu';
    case 2: return '/admin';
    case 3: return '/kitchen';
    case 4: return '/waiter';
    default: return '/login';
  }
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading, user, tableId, setTableId } = useAuth();
  const [searchParams] = useSearchParams();

  // Ensure tableId from URL is captured before any redirect
  useEffect(() => {
    const urlTableId = searchParams.get('tableId');
    if (urlTableId && urlTableId !== tableId?.toString()) {
      console.log('RootRedirect: Capturing tableId from URL:', urlTableId);
      setTableId(urlTableId);
    }
  }, [searchParams, tableId, setTableId]);

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

  // If authenticated, redirect to role-based dashboard; otherwise go to login
  // tableId from URL (?tableId=5) is already captured by AuthContext
  const redirectPath = isAuthenticated ? getRoleBasedPath(user?.role) : '/login';
  return <Navigate to={redirectPath} replace />;
};

export default RootRedirect;
