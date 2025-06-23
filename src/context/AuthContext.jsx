import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const signIn = async (username, password) => {
    const body = new URLSearchParams();
    body.append("userName", username);
    body.append("password", password);
    const backend_url = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5005/api/v1";
    const url = `${backend_url}/auth/signin`;
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
    console.log(data);
    if (data) {
      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);
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
