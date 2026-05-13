import axios from "axios";
import { ROUTES } from "../constants";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (window.location.pathname !== ROUTES.LOGIN_SHOP) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = ROUTES.LOGIN_SHOP;
      }
    }

    if (error.response?.status === 403) {
      alert("Acesso negado. Você não tem permissão para acessar este recurso.");
    }

    return Promise.reject(error);
  },
);

const createInstance = (moduleName) => {
  const instance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(`${moduleName}_token`);
    console.log(`Token adicionado para ${moduleName}:`, token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const lojaApi = createInstance("loja");
export const bancoApi = createInstance("banco");

export default api;
