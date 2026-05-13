import { createContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const getStoredModule = (module) => {
  const user = localStorage.getItem(`${module}_user`);
  const token = localStorage.getItem(`${module}_token`);

  return {
    user: user ? JSON.parse(user) : null,
    token,
    isAuthenticated: !!token,
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    loja: getStoredModule("loja"),
    banco: getStoredModule("banco"),
  });

  const [activeModule, setActiveModule] = useState("loja");

  const login = useCallback((module, userData, token) => {
    console.log("Login:", { module, userData, token });
    const moduleData = {
      user: userData,
      token,
      isAuthenticated: true,
    };

    setAuth((prev) => ({
      ...prev,
      [module]: moduleData,
    }));

    localStorage.setItem(`${module}_user`, JSON.stringify(userData));

    localStorage.setItem(`${module}_token`, token);
  }, []);

  const logout = useCallback((module) => {
    setAuth((prev) => ({
      ...prev,
      [module]: {
        user: null,
        token: null,
        isAuthenticated: false,
      },
    }));

    localStorage.removeItem(`${module}_user`);
    localStorage.removeItem(`${module}_token`);
  }, []);

  const signup = useCallback((module, userData, token) => {
    const moduleData = {
      user: userData,
      token,
      isAuthenticated: true,
    };

    setAuth((prev) => ({
      ...prev,
      [module]: moduleData,
    }));

    localStorage.setItem(`${module}_user`, JSON.stringify(userData));
    localStorage.setItem(`${module}_token`, token);
  }, []);

  const value = useMemo(
    () => ({
      auth,
      activeModule,
      setActiveModule,
      login,
      logout,
      signup,
    }),
    [auth, activeModule, setActiveModule, login, logout, signup],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
