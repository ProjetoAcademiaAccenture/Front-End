import axios from "axios";
import { ROUTES } from "../constants";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // pega o token do módulo correto baseado na URL
    let token = null;

    if (config.url?.includes('/api/contas') || config.url?.includes('/auth/login-bank') || config.url?.includes('/auth/register-bank')) {
      token = localStorage.getItem('banco_token');
    } else {
      token = localStorage.getItem('loja_token') ?? localStorage.getItem('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
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

export default api;
