/**
 * RoleBasedRoute - Route guard for role-based access control
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRolePath, hasRole } from '../constants/roles';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRoles: number[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, requiredRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(user.role, requiredRoles)) {
    // Redirect to user's appropriate dashboard based on role
    const redirectPath = getRolePath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
