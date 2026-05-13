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
    const response = await api.get("api/produtos");
    return response.data;
  },

  getProdutoByCategoria: async (categoria) => {
    const response = await api.get(`api/produtos/categoria/${categoria}`);
    return response.data;
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
