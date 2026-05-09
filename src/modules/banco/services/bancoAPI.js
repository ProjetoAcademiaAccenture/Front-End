import api from "../../../services/api";

// Simulação de API do Banco
export const bancoAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login-bank", credentials);
    return response.data;
  },

  signup: async (newAccountData) => {
    const response = await api.post("/auth/register-bank", newAccountData);
    return response;
  },

  getTransacoes: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transacoes: [],
        });
      }, 300);
    });
  },
};
