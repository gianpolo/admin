import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { isTokenExpired } from "../../utils/auth.js";

export default function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
