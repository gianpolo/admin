import { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn as signInThunk, signOut as signOutAction } from "../store/authSlice.js";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const signIn = (username, password) => dispatch(signInThunk({ username, password }));

  const signOut = () => {
    dispatch(signOutAction());
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
