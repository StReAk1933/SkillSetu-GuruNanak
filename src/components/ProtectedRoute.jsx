import React from 'react';
import { isAuthenticated, getCurrentUser } from '../auth/auth';

/**
 * ProtectedRoute Component
 * Wraps content/routes that require an authenticated session and optional role authorization.
 */
export default function ProtectedRoute({ children, fallback, allowedRoles }) {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return fallback || null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const user = getCurrentUser();
    const userRole = user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return children;
}
