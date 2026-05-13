import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export function useModuleAuth(module) {
  const { auth, login, logout, signup, adicionarAoCarrinho } = useContext(AuthContext);

  const moduleAuth = auth[module];

  return {
    user: moduleAuth?.user,
    token: moduleAuth?.token,
    isAuthenticated: moduleAuth?.isAuthenticated,

    login: (userData, token) => login(module, userData, token),
    signup: (userData, token) => signup(module, userData, token),
    logout: () => logout(module),
    adicionarAoCarrinho: (produto, quantidade) => adicionarAoCarrinho(produto, quantidade),
  };
}
