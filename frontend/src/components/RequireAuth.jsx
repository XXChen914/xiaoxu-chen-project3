import { Navigate, useOutletContext } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { username } = useOutletContext();

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
