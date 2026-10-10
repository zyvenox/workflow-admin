import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "./ProtectedRoute.css";

function ProtectedRoute() {
  const {
    user,
    loading,
    isDemoMode,
  } = useAuth();

  const location =
    useLocation();

  if (loading) {
    return (
      <div className="protected-route__loading">
        <div className="protected-route__spinner">
          <LoaderCircle
            size={24}
            strokeWidth={2}
          />
        </div>

        <p>
          Loading workspace...
        </p>
      </div>
    );
  }

  /*
    In Demo Mode the visitor can explore
    the dashboard without logging in.
  */
  if (isDemoMode) {
    return <Outlet />;
  }

  /*
    In normal authentication mode,
    unauthenticated users are redirected
    to the login page.
  */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;