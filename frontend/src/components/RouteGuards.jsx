import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-500">
        Verifying session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function SuperAdminRoute({ children }) {
  const { isAuthenticated, isSuperAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 text-[#71462a]">
        <div className="w-8 h-8 border-2 border-[#784d2f] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs tracking-wider uppercase">Verifying Superadmin Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location,
          notice: 'Please sign in with your Superadmin credentials to enter the admin control center.',
        }}
      />
    );
  }

  if (!isSuperAdmin) {
    return (
      <Navigate
        to="/account"
        replace
        state={{
          accessDenied: true,
          notice: 'Access denied: The Admin Panel is strictly reserved for the Superadmin account.',
        }}
      />
    );
  }

  return children;
}


