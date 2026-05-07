import { createContext, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userProps);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tabBar, settabBar] = useState(null); // 'loja', 'admin'

  const login = useCallback((userData, type) => {
    setUser(userData);
    settabBar(type);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tabBar", type);
  }, []);

  const logout = useCallback(() => {
    setUser(userProps);
    settabBar(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("tabBar");
  }, []);

  const signup = useCallback((userData, type) => {
    setUser(userData);
    settabBar(type);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("tabBar", type);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      tabBar,
      login,
      logout,
      signup,
    }),
    [user, isLoggedIn, tabBar, login, logout, signup],
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
  dtNascimento: null, // formato ISO (YYYY-MM-DD)
  endereco: { ...addressProps },
};
