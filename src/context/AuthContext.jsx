import { createContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userProps);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );
  const [tabBar, setTabBar] = useState(null); // 'loja', 'admin'

  const login = useCallback((userData, type, token) => {
    setUser({ ...userData, token });
    setTabBar(type);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify({ ...userData, token }));
    localStorage.setItem("tabBar", type);
    if (token) localStorage.setItem("token", token);
  }, []);

  const logout = useCallback(() => {
    setUser(userProps);
    setTabBar(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("tabBar");
    localStorage.removeItem("token");
  }, []);

  const signup = useCallback((userData, type) => {
    setUser({ ...userData});
    setTabBar(type);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify({ ...userData }));
    localStorage.setItem("tabBar", type);
    if (userData?.token) localStorage.setItem("token", userData.token);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      tabBar,
      login,
      logout,
      signup,
    }),
    [user, setUser, isAuthenticated, setIsAuthenticated, tabBar, login, logout, signup],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const userProps = {
  clienteId: null,
  nome: null,
  tipoCliente: null, // 'ROLE_ADMIN' ou 'ROLE_USER'
  token: null,
};
