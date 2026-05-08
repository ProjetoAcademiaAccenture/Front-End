import { createContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userProps);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );
  const [tabBar, settabBar] = useState(null); // 'loja', 'admin'

  const login = useCallback((userData, type) => {
    setUser(userData);
    settabBar(type);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tabBar", type);
  }, []);

  const logout = useCallback(() => {
    setUser(userProps);
    settabBar(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("tabBar");
  }, []);

  const signup = useCallback((userData, type) => {
    setUser(userData);
    settabBar(type);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tabBar", type);
    localStorage.removeItem("token");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      tabBar,
      login,
      logout,
      signup,
    }),
    [user, isAuthenticated, tabBar, login, logout, signup],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const addressProps = {
  cep: null,
  logradouro: null,
  numero: null,
  complemento: null,
  bairro: null,
  cidade: null,
  estado: null,
};

const userProps = {
  id: null,
  nome: null,
  email: null,
  tipo: null, // 'ROLE_ADMIN' ou 'ROLE_USER'
  cpf: null,
  telefone: null, // apenas números
  dataNascimento: null, // formato ISO (YYYY-MM-DD)
  endereco: { ...addressProps },
};
