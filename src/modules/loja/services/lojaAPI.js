import api from "../../../services/api";

export const lojaAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  signup: async (newUser) => {
    const response = await api.post("/auth/register", newUser);
    return response;
  },

  getProdutos: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, produtos: [] });
      }, 300);
    });
  },

  processarPagamento: async (valor) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: Math.random() > 0.1,
          transacaoId: `TRX${Date.now()}`,
        });
      }, 1000);
    });
  },
};
