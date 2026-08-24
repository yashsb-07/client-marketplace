import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
function ProtectedRoute() {
  const {
    loading,
    isAuthenticated,
    user,
  } = useAuth();

  if (loading) {
    return (
      <main className="auth-state">
        <p>Checking your session...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "BUYER") {
    return (
      <Navigate
        to="/marketplace"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;