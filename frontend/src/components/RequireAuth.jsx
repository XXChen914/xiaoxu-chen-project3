import { Navigate, useOutletContext, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const outletContext = useOutletContext();
  const location = useLocation();

  // App not ready yet (impossible to happen in current setup)
  if (!outletContext) return <div>Loading</div>;

  const { username } = outletContext;

  // Not logged in - redirect to login with return path
  if (!username) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
