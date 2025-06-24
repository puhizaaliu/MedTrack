import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Wrap any private layout or page in:
 *  <RequireAuth allowedRoles={['Patient','Admin']}>
 *    <SomeLayoutOrPage />
 *  </RequireAuth>
 */
export default function RequireAuth({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1) Still checking if there’s an existing session?
  if (loading) {
    return <p className="text-center py-6">Checking authentication…</p>;
  }

  // 2) Not logged in?
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">You must log in to view this page</h2>
        <Link to="/login" className="text-blue-600 underline mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  // 3) Role-based guard (if you passed allowedRoles)
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return (
      <p className="text-center py-6 text-red-600">
        You don’t have permission to view this page.
      </p>
    );
  }

  // 4) All good—render children
  return children;
}
