import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SignInCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth
      .signinRedirectCallback()
      .then((user) => {
        if (user?.access_token) {
          localStorage.setItem("token", user.access_token);
        }
        navigate("/");
      })
      .catch(() => navigate("/signin"));
  }, [auth, navigate]);

  return <p className="p-4">Signing in...</p>;
}
