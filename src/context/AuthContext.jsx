import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
    }
  }, []);

  const login = async (username, password) => {
    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append(
      "scope",
      "openid roles api_read_scope api_write_scope"
    );
    body.append("client_id", import.meta.env.REACT_APP_CLIENT_ID);
    body.append("client_secret", import.meta.env.REACT_APP_CLIENT_SECRET);
    body.append("username", username);
    body.append("password", password);

    const response = await fetch(
      `${import.meta.env.REACT_APP_IDENTITY_SERVER_URL}/identity/connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }
    );

    if (!response.ok) throw new Error("Failed to login");

    const data = await response.json();
    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);
    return data;
  };

  return (
    <AuthContext.Provider value={{ token, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
