import { Navigate, useOutletContext } from "react-router-dom";

export default function RequireAuth({ children }) {
  const outletContext = useOutletContext();

  // App not ready yet
  if (!outletContext) return null;

  const { username } = outletContext;

  // Still checking login
  if (username === null) {
    return <div>Checking login…</div>;
  }

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
