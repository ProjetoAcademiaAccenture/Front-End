import { bancoApi } from "../../../services/api";

export const bancoAPI = {
  login: async (credentials) => {
    const response = await bancoApi.post("/auth/login-bank", credentials);
    return response.data;
  },

  signup: async (newAccountData) => {
    const response = await bancoApi.post("/auth/register-bank", newAccountData);
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
