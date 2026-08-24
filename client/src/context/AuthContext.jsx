import {
  useEffect,
  useState,
} from "react";

import { AuthContext } from "./authContextDefinition";

import {
  getCurrentUser,
  getToken,
  loginUser,
  registerBuyer,
  removeToken,
  saveToken,
} from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch (error) {
        console.error(
          "Session restoration failed:",
          error
        );

        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    saveToken(data.token);
    setUser(data.user);

    return data.user;
  };

  const register = async (userData) => {
    const data = await registerBuyer(userData);

    saveToken(data.token);
    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}