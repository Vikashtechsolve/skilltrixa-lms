import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "./skeletons";

/**
 * PublicRoute - Redirects authenticated users away from public pages
 * Use this for landing page, sign in, etc.
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return <PageLoader />;
  }

  // If authenticated, redirect to LMS home
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  // Not authenticated - show public page
  return children;
};

export default PublicRoute;

