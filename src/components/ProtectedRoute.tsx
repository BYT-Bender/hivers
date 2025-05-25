
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
