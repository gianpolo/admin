import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const signIn = async (username, password) => {
    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("scope", "openid roles api_read_scope api_write_scope");
    body.append("client_id", import.meta.env.REACT_APP_CLIENT_ID);
    body.append("client_secret", import.meta.env.REACT_APP_CLIENT_SECRET);
    body.append("username", username);
    body.append("password", password);
    const url = `${import.meta.env.REACT_APP_IDENTITY_SERVER_URL}/identity/connect/token`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (!res.ok) {
      throw new Error("Failed to sign in");
    }
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
