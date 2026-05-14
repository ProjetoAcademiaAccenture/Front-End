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

  const [lastPaths, setLastPaths] = useState({
    loja: "/loja/produtos",
    banco: "/banco/dashboard",
  });

  const [activeModule, setActiveModule] = useState("loja");
  const [pagamentoConcluido, setPagamentoConcluido] = useState({
    id: null,
    status: null,
  });

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

  const confirmarPagamentoGlobal = useCallback((id, status) => {
    setPagamentoConcluido({ id, status });
  }, []);

  const limparSinalizadorPagamento = useCallback(() => {
    setPagamentoConcluido({ id: null, status: null });
  }, []);

  const saveLastPath = useCallback((module, path) => {
    setLastPaths((prev) => ({
      ...prev,
      [module]: path,
    }));
  }, []);

  const value = useMemo(
    () => ({
      auth,
      activeModule,
      lastPaths,
      pagamentoConcluido,
      saveLastPath,
      setActiveModule,
      setPagamentoConcluido,
      login,
      logout,
      signup,
      confirmarPagamentoGlobal,
      limparSinalizadorPagamento,
    }),
    [
      auth,
      activeModule,
      lastPaths,
      pagamentoConcluido,
      saveLastPath,
      setPagamentoConcluido,
      setActiveModule,
      login,
      logout,
      signup,
      confirmarPagamentoGlobal,
      limparSinalizadorPagamento,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
