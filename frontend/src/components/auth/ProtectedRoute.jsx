import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';

export default function ProtectedRoute({ children, to = '/login' }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Đang tải...
      </div>
    );
  }
  if (!user) {
    return <Navigate to={to} replace />;
  }
  return children;
}

