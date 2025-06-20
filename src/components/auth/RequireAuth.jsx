import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
