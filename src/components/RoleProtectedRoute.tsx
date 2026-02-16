/**
 * Role Protected Route
 * Thin wrapper over RoleBasedRoute to avoid duplicate logic
 */

import React from 'react';
import { RoleBasedRoute } from './RoleBasedRoute';

const RoleProtectedRoute: React.FC<React.ComponentProps<typeof RoleBasedRoute>> = (props) => {
  return <RoleBasedRoute {...props} />;
};

export default RoleProtectedRoute;
